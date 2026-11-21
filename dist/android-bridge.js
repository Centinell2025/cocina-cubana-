'use strict';

// The native bridge is exposed only to this HTTPS origin by AndroidX WebKit.
// A normal website never activates the Android integration.
(() => {
  const active = location.origin === 'https://appassets.androidplatform.net';
  if (!active) return;
  const pending = new Map();
  let sequence = 0;
  const channel = window.CocinaNative;
  const available = Boolean(channel && typeof channel.postMessage === 'function');
  const cancelled = new Set(['cancelled', 'canceled']);
  if (available) channel.onmessage = event => {
    let message;
    try { message = JSON.parse(event.data); } catch { return; }
    const task = pending.get(String(message.id));
    if (!task) return;
    clearTimeout(task.timeout);
    pending.delete(String(message.id));
    if (message.ok) task.resolve(message.result ?? {});
    else {
      const error = new Error(message.error || 'La operación no se pudo completar.');
      if (cancelled.has(message.error)) error.name = 'AbortError';
      task.reject(error);
    }
  };
  window.CocinaAndroid = Object.freeze({
    active,
    available,
    request(action, payload = {}) {
      if (!available) return Promise.reject(new Error(
        document.documentElement.lang === 'en'
          ? 'Update Android System WebView to use this function.'
          : 'Actualiza Android System WebView para usar esta función.'
      ));
      const id = String(++sequence);
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          pending.delete(id);
          reject(new Error(document.documentElement.lang === 'en'
            ? 'The operation timed out. Please try again.'
            : 'La operación tardó demasiado. Vuelve a intentarlo.'));
        }, 300000);
        pending.set(id, {resolve, reject, timeout});
        try { channel.postMessage(JSON.stringify({id, action, payload})); }
        catch (error) { clearTimeout(timeout); pending.delete(id); reject(error); }
      });
    }
  });
  window.__offlineReady = true;
  document.documentElement.classList.add('android-app');
})();
