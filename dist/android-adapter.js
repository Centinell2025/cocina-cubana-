'use strict';

// This file adapts the existing cookbook without changing the web experience.
if (window.CocinaAndroid?.active) {
  const native = window.CocinaAndroid;
  const nativeText = (es, en) => language === 'en' ? en : es;
  const originalTranslate = t;
  const androidTranslations = {
    'Este navegador no permite guardar cambios. Exporta una copia desde Ayuda.': [
      'No se pudieron guardar los cambios en la aplicación. Exporta una copia desde Ayuda.',
      'Changes could not be saved in the app. Export a backup from Help.'
    ],
    'Las recetas que guardas para volver a cocinar. Tu colección se conserva en este navegador.': [
      'Las recetas que guardas para volver a cocinar. Tu colección se conserva en esta aplicación.',
      'Recipes you save to cook again. Your collection stays in this app.'
    ]
  };
  t = function (text) {
    const entry = androidTranslations[text];
    return entry ? entry[language === 'en' ? 1 : 0] : originalTranslate(text);
  };
  const nativeError = error => {
    if (error?.name !== 'AbortError') toast(error?.message || nativeText(
      'No se pudo completar la operación.', 'The operation could not be completed.'));
  };
  const requestNative = (action, payload) => native.request(action, payload);
  const stopNativeSpeech = () => requestNative('stopSpeech').catch(() => {});

  const originalOpenRecipe = openRecipe;
  openRecipe = function (id) {
    originalOpenRecipe(id);
    const share = document.querySelector('#recipe-dialog [data-share-recipe]');
    if (share) share.setAttribute('aria-label', nativeText('Compartir receta', 'Share recipe'));
    const notes = document.querySelector('#recipe-dialog .note-caption');
    if (notes) notes.textContent = nativeText('Se guardan automáticamente en esta aplicación.', 'Saved automatically in this app.');
  };

  const originalHelp = renderHelp;
  renderHelp = function () {
    originalHelp();
    const panels = document.querySelectorAll('#main .help-card');
    const langHelp = document.querySelector('.language-help p');
    if (langHelp) langHelp.textContent = nativeText(
      'Elige Español o English. Tu selección se guarda en esta aplicación.',
      'Choose Español or English. Your selection is saved in this app.');
    if (panels[1]) panels[1].innerHTML = '<h2>' + nativeText('Recetas sin conexión', 'Offline recipes') +
      '</h2><p>' + nativeText(
        'Las 1.078 recetas, sus ilustraciones y ambos idiomas ya están incluidos en la aplicación. No necesitas iniciar sesión ni descargar el recetario al abrirlo.',
        'All 1,078 recipes, their illustrations and both languages are included in the app. No sign-in or first-use cookbook download is needed.') +
      '</p><p>' + nativeText(
        'Las nuevas recetas y mejoras llegarán mediante actualizaciones de la aplicación. Las referencias externas necesitan conexión y se abren en tu navegador.',
        'New recipes and improvements arrive through app updates. External references require a connection and open in your browser.') + '</p>';
    if (panels[2]) {
      const paragraphs = panels[2].querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = nativeText(
        'Favoritos, notas, menú, compras e idioma se guardan en este dispositivo, dentro de la aplicación. No se envían a un servidor de Cocina Cubana ni se sincronizan entre dispositivos.',
        'Favorites, notes, menus, shopping and language are saved inside this app on your device. They are not sent to a Cocina Cubana server or synced between devices.');
      if (paragraphs[1]) paragraphs[1].textContent = nativeText(
        'Desinstalar la app o borrar su almacenamiento elimina esos datos. Puedes exportar una copia JSON al lugar que elijas e importarla después. Protege las copias que guardes o compartas.',
        'Uninstalling the app or clearing its storage deletes this data. You can export a JSON backup to a location you choose and import it later. Protect any copies you save or share.');
      const reset = panels[2].querySelector('[data-reset-personal]');
      if (reset) reset.textContent = nativeText('Borrar mis datos de esta app', 'Delete my app data');
      const link = document.createElement('a');
      link.href = 'privacy.html';
      link.className = 'button secondary';
      link.style.marginTop = '16px';
      link.textContent = nativeText('Política de privacidad', 'Privacy policy');
      panels[2].append(link);
      const notices = document.createElement('a');
      notices.href = 'third-party-notices.txt';
      notices.className = 'text-link';
      notices.style.display = 'block';
      notices.style.marginTop = '16px';
      notices.textContent = nativeText('Licencias de software de terceros', 'Third-party software licenses');
      panels[2].append(notices);
    }
    if (panels[3]) {
      const p = panels[3].querySelector('p');
      if (p) p.textContent = nativeText(
        'Activa texto grande o escucha los pasos con una voz sin conexión instalada en Android para el idioma elegido. Si falta esa voz, instálala desde los ajustes de texto a voz del dispositivo.',
        'Use large text or listen to the steps with an offline Android voice installed for your chosen language. If no voice is available, install one in your device’s text-to-speech settings.');
    }
    const label = document.querySelector('.version-label');
    if (label) label.textContent = 'Android · 1.0.0 · Español / English';
  };

  exportData = async function () {
    try {
      await requestNative('exportData', {
        filename: 'mi-cocina-cubana-' + new Date().toISOString().slice(0, 10) + '.json',
        content: JSON.stringify({...state, exportedAt: new Date().toISOString()}, null, 2)
      });
      toast(nativeText('Copia guardada.', 'Backup saved.'));
    } catch (error) { nativeError(error); }
  };

  copyText = async function (text, message) {
    try { await requestNative('copyText', {text}); toast(message); }
    catch (error) { nativeError(error); }
  };

  shareRecipe = async function () {
    const r = currentRecipe;
    if (!r) return;
    const ratio = currentServings / r.servings;
    const ingredients = r.ingredients.map(i => {
      const quantity = i.amount === null ? '' : amount(i.amount * ratio) + ' ';
      return '• ' + quantity + (i.unit ? i.unit + ' ' : '') + i.name + (i.note ? ' (' + i.note + ')' : '');
    }).join('\n');
    const text = r.title + '\nCocina Cubana · ' + currentServings + ' ' + r.yieldUnit + '\n\n' +
      nativeText('Ingredientes', 'Ingredients') + '\n' + ingredients + '\n\n' +
      nativeText('Preparación', 'Directions') + '\n' + r.steps.map((step, i) => (i + 1) + '. ' + step).join('\n\n') +
      (currentServings !== r.servings ? '\n\n' + nativeText(
        'Las cantidades escritas dentro de los pasos corresponden a la tanda original de ',
        'Quantities written within the directions refer to the original batch of ') + r.servings + ' ' + r.yieldUnit + '.' : '') +
      '\n\nCocina Cubana · Beacon of the Eagle LLC';
    try { await requestNative('shareText', {title: r.title, text}); }
    catch (error) { nativeError(error); }
  };

  window.print = function () {
    const title = document.body.classList.contains('print-shopping')
      ? nativeText('Cocina Cubana · Compras', 'Cocina Cubana · Shopping')
      : currentRecipe?.title || 'Cocina Cubana';
    requestNative('print', {title})
      .catch(nativeError);
  };

  const originalCook = renderCook;
  renderCook = function () {
    originalCook();
    const speak = document.querySelector('[data-speak]');
    if (speak) speak.disabled = !native.available;
  };
  speakStep = function () {
    requestNative('speak', {
      text: nativeText('Paso ', 'Step ') + (cookStep + 1) + '. ' + currentRecipe.steps[cookStep],
      language: language === 'en' ? 'en-US' : 'es-ES'
    }).catch(nativeError);
  };

  // Import and deletion are intercepted before the original delegated handler.
  document.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-import')) {
      event.preventDefault(); event.stopImmediatePropagation();
      try {
        const result = await requestNative('importData');
        const file = new File([result.text], 'cocina-cubana-backup.json', {type: 'application/json'});
        await importBackup({target: {files: [file], value: ''}});
      } catch (error) { nativeError(error); }
    } else if (button.hasAttribute('data-reset-personal')) {
      event.preventDefault(); event.stopImmediatePropagation();
      if (confirm(nativeText(
        '¿Borrar favoritos, notas, menú y compras de esta aplicación? Exporta una copia si quieres conservarlos.',
        'Delete favorites, notes, menu and shopping from this app? Export a backup first if you want to keep them.'))) {
        state = {...structuredClone(INITIAL), language};
        save(); initState(); timerTick(); render();
        toast(t('Datos personales borrados. Las recetas siguen disponibles.'));
      }
    }
    if (button.hasAttribute('data-cook-step') || button.hasAttribute('data-finish-cook') || button.hasAttribute('data-language')) stopNativeSpeech();
  }, true);

  const cookDialog = document.getElementById('cook-dialog');
  cookDialog.addEventListener('close', () => {
    stopNativeSpeech();
    requestNative('keepAwake', {enabled: false}).catch(() => {});
  });
  new MutationObserver(() => {
    requestNative('keepAwake', {enabled: cookDialog.open}).catch(() => {});
  }).observe(cookDialog, {attributes: true, attributeFilter: ['open']});

  window.cocinaHandleBack = function () {
    const openDialog = [...document.querySelectorAll('dialog[open]')].at(-1);
    if (openDialog) { openDialog.close(); return true; }
    if (currentView !== 'inicio') { navigate('inicio'); return true; }
    return false;
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopNativeSpeech();
    if (!document.hidden && cookDialog.open) requestNative('keepAwake', {enabled: true}).catch(() => {});
  });
}
