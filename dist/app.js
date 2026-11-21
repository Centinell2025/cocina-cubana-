'use strict';

const APP_VERSION = '1.13.1';

// Curated collections reuse recipe IDs so images, notes and favorites stay linked.
const SALAD_FRUIT_GROUPS = {
  ensaladas: ["r114", "r115", "r116", "r117", "r118", "r666", "r667", "r668", "r669", "r670", "r671", "r672", "r673", "r674", "r675", "r676", "r677", "r678", "r679", "r680", "r681", "r682", "r683", "r684", "r685", "r762", "r766", "r773", "r779", "r802", "r811", "r812", "r813", "r814", "r815", "r816", "r817", "r818", "r819", "r820", "r1019", "r1020", "r1021", "r1022", "r1023", "r1024", "r1025", "r1026", "r1027", "r1028"],
  frutas: ['r1010','r1011','r1009','r981','r982','r984','r985','r627']
};
const SALAD_FRUIT_IDS = [...SALAD_FRUIT_GROUPS.ensaladas,...SALAD_FRUIT_GROUPS.frutas];
const SALAD_FRUIT_FEATURED = ['r1019','r1021','r1022','r1027','r812','r811','r1010','r667','r1011','r985','r1009'];

const CORN_GROUPS = {
  tamales: ['r1081','r1012','r126','r127','r523','r524','r525','r526'],
  caldos: ['r091','r1017','r1018','r101','r457'],
  frituras: ['r125','r513']
};
const JUICE_GROUPS = {"jugos": ["r196", "r633", "r1031", "r1033", "r1034"], "batidos": ["r193", "r194", "r195", "r200", "r1029", "r1060", "r1080"], "refrescos": ["r197", "r199", "r1030", "r1079"]};
const COLD_SPREAD_GROUPS = {"frias": ["r118", "r679", "r1026", "r685", "r671", "r678", "r670", "r668", "r672", "r116", "r117", "r675", "r676", "r681", "r815", "r1020"], "pastas": ["r686", "r689", "r696", "r700", "r839", "r1066", "r1067", "r1068", "r1069", "r1070", "r1071", "r1072"]};
const PUDDING_GROUPS = {
  pasas_coco: ['r178','r1073','r609'],
  frutas: ['r1074','r1076','r1078'],
  chocolate_cafe: ['r1075','r1077']
};
const EXTRA_COLLECTIONS = {
  pudines: {title:'Pudín cubano de pan',eyebrow:'PAN DE AYER, DULCE DE HOY',description:'El clásico de pasas y siete variantes caseras con coco, piña, guayaba, chocolate, plátano, café o naranja.',icon:'cake',groups:PUDDING_GROUPS,labels:{pasas_coco:'Pasas y coco',frutas:'Guayaba, plátano y naranja',chocolate_cafe:'Chocolate y café'},featured:['r178','r1073','r609','r1074','r1075','r1076','r1077','r1078']},
  bocaditos: {title:'Ensaladas frías y bocaditos',eyebrow:'PARA LA MERIENDA Y LA MESA FRÍA',description:'Ensaladas para servir frías y pastas para untar o rellenar bocaditos, con cantidades y preparación.',icon:'utensils',groups:COLD_SPREAD_GROUPS,labels:{frias:'Ensaladas frías',pastas:'Pastas para bocaditos'},featured:['r118','r679','r1066','r1067','r1026','r1068','r685','r1069']},
  maiz: {title:'Maíz y tamales', eyebrow:'MAÍZ, VIANDAS Y SABOR DE CASA', description:'Hallacas, tamales, ajiaco, caldosa y harina de maíz, reunidos para cocinar a tu gusto.', icon:'bowl', groups:CORN_GROUPS, labels:{tamales:'Tamales y hallacas',caldos:'Caldos y harinas',frituras:'Frituras de maíz'}, featured:['r1081','r1012','r091','r1017','r1018']},
  jugos: {title:'Jugos y batidos', eyebrow:'FRUTAS, FRESCURA Y CREMOSIDAD', description:'Jugos y batidos de la tradición cubana: garapiña, guarapo, mamey, mamey amarillo, níspero y otros sabores de casa.', icon:'cup', groups:JUICE_GROUPS, labels:{jugos:'Jugos de frutas',batidos:'Batidos y cremosos',refrescos:'Refrescos naturales'}, featured:['r1079','r193','r1080','r1060','r1029','r1030','r1031']}
};
function collectionIds(view=currentView){return Object.values(EXTRA_COLLECTIONS[view]?.groups||{}).flat();}

const CATEGORIES = {
  carnes: {get name(){return t("Carnes")}, icon:'utensils', color:'#ead8be'},
  aves: {get name(){return t("Aves")}, icon:'utensils', color:'#e9dfb8'},
  pescados: {get name(){return t("Pescados y mariscos")}, icon:'fish', color:'#d9e6d8'},
  arroces: {get name(){return t("Arroces")}, icon:'bowl', color:'#eadcb8'},
  granos_sopas: {get name(){return t("Granos y sopas")}, icon:'bowl', color:'#e1d9c3'},
  viandas_ensaladas: {get name(){return t("Viandas y ensaladas")}, icon:'leaf', color:'#dfe5cc'},
  entrantes: {get name(){return t("Entrantes")}, icon:'utensils', color:'#ecdac8'},
  pasteleria: {get name(){return t("Pastelería")}, icon:'cake', color:'#f0dbca'},
  postres: {get name(){return t("Postres")}, icon:'cake', color:'#eadcc5'},
  bebidas: {get name(){return t("Bebidas")}, icon:'cup', color:'#dce8ce'}
};
const ICONS = {
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1z"/>',
  book:'<path d="M12 5c-4-3-8-2-9-1v16c3-2 6-2 9 0 3-2 6-2 9 0V4c-1-1-5-2-9 1Zm0 0v15"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2m4 0h2m-8 3h2"/>',
  bag:'<path d="M5 7h14l2 14H3L5 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  cake:'<path d="M3 12h18v9H3zM3 16c2-3 4 3 6 0s4 3 6 0 4 3 6 0M7 8v4m5-4v4m5-4v4M7 4v1m5-2v2m5-1v1"/>',
  search:'<circle cx="10.8" cy="10.8" r="7.3"/><path d="m16 16 5 5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5"/>',
  leaf:'<path d="M20 3c-8-1-15 2-15 9 0 8 10 9 13 2 2-4 2-8 2-11ZM3 21 15 9"/>',
  bowl:'<path d="M2 11h20c-1 6-4 9-10 9S3 17 2 11ZM8 22h8M8 3c-2 2 2 3 0 5m5-6c-2 2 2 3 0 5m5-4c-2 2 2 3 0 5"/>',
  fish:'<path d="M6 12C9 4 17 4 22 12c-5 8-13 8-16 0ZM6 12 2 7v10l4-5Z"/><circle cx="17" cy="11" r=".7"/>',
  utensils:'<path d="M4 3v6c0 3 6 3 6 0V3M7 3v18M18 3v18m0-18c-5 3-5 10 0 10"/>',
  cup:'<path d="M4 8h13v9c0 6-13 6-13 0V8Zm13 1h2a3 3 0 0 1 0 6h-2M3 22h16M7 2v3m5-3v3"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  check:'<path d="m5 12 4 4L20 5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  print:'<path d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v8H6z"/><circle cx="18" cy="12" r=".3"/>',
  share:'<path d="M8 12 16 7M8 13l8 5"/><circle cx="5" cy="12" r="3"/><circle cx="19" cy="5" r="3"/><circle cx="19" cy="19" r="3"/>',
  play:'<path d="m8 4 12 8-12 8V4Z"/>',
  sound:'<path d="m11 3-6 5H2v8h3l6 5V3Zm5 5c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 8.5a2.5 2.5 0 1 1 4 2c-1.5 1-1.5 1.5-1.5 3M12 17v.1"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5M4 16v5h16v-5"/>',
  stars:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',
  level:'<path d="M4 21v-6m5 6V9m5 12V5m5 16V2"/>'
};
const DAYS = [{id:'lunes',get name(){return t("Lunes")}},{id:'martes',get name(){return t("Martes")}},{id:'miercoles',get name(){return t("Miércoles")}},{id:'jueves',get name(){return t("Jueves")}},{id:'viernes',get name(){return t("Viernes")}},{id:'sabado',get name(){return t("Sábado")}},{id:'domingo',get name(){return t("Domingo")}}];
const MEALS = [{id:'comida',get name(){return t("Comida")}},{id:'cena',get name(){return t("Cena")}}];
const STORAGE_KEY = 'cocina-cubana-v1';
const INITIAL = {version:1,favorites:[],shopping:[],manual:[],checks:{},menu:{},notes:{},cooked:[],largeText:false,language:'es'};
let recipes=[], sources=[], recipeMap=new Map(), currentView='inicio', filters={q:'',category:'all',time:'all',sort:'recommended'}, visibleCount=18, currentRecipe=null, currentServings=4, cookStep=0, pickerSlot=null, toastTimeout, timerInterval, deferredInstall=null;
let state=readState();
let storageAvailable=true;
let spanishRecipes=[], englishRecipes=[], spanishRecipeMap=new Map();
language=state.language==='en'?'en':'es';

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function norm(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();}
function icon(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[name]||ICONS.book)+'</svg>';}
function amount(n){if(n===null||n===undefined)return '';return new Intl.NumberFormat(language,{maximumFractionDigits:n<10?2:1}).format(n);}
function total(r){return r.prepMinutes+r.cookMinutes+r.restMinutes;}
function duration(m){if(m<60)return m+' min';const h=Math.floor(m/60),remainder=m%60;return h+' h'+(remainder?' '+remainder+' min':'');}
let recipeImages=Object.create(null);
const unavailableImages=new Set();
const imageRetryAttempts=new Map(),imageRetryTimers=new Map(),imageRetryInFlight=new Set();
const IMAGE_RETRY_DELAYS=[3000,8000,15000];
let imageUpdateTimer=null,imageUpdateInProgress=false;
function loadRecipeImages(manifest){
  recipeImages=Object.create(null);
  const used=new Set();
  if(!manifest||Array.isArray(manifest)||typeof manifest!=='object')return;
  for(const [id,entry] of Object.entries(manifest)){
    const recipe=spanishRecipeMap.get(id);
    if(!recipe||entry?.title!==recipe.title||entry?.src!==`assets/recipes/${id}-3d.webp`||used.has(entry.src))continue;
    recipeImages[id]=entry;used.add(entry.src);
  }
}
function asset(r){
  const image=recipeImages[r.id];
  if(unavailableImages.has(r.id)||!image)return null;
  return assignedImageSource(r.id);
}
function assignedImageSource(id){
  const image=recipeImages[id];
  return image?image.src+(/^[a-f0-9]{12}$/.test(image.revision||'')?'?rev='+image.revision:''):null;
}
function scheduleImageRetry(id){
  const attempt=imageRetryAttempts.get(id)||0;
  if(!recipeImages[id]||!unavailableImages.has(id)||document.hidden||navigator.onLine===false||attempt>=IMAGE_RETRY_DELAYS.length||imageRetryTimers.has(id)||imageRetryInFlight.has(id))return;
  imageRetryTimers.set(id,setTimeout(()=>{
    imageRetryTimers.delete(id);
    retryRecipeImage(id);
  },IMAGE_RETRY_DELAYS[attempt]));
}
function retryRecipeImage(id){
  const src=assignedImageSource(id),attempt=imageRetryAttempts.get(id)||0;
  if(!src||!unavailableImages.has(id)||document.hidden||navigator.onLine===false||attempt>=IMAGE_RETRY_DELAYS.length||imageRetryInFlight.has(id))return;
  imageRetryAttempts.set(id,attempt+1);
  imageRetryInFlight.add(id);
  // Probe only this recipe's file; keep its ingredient fallback until it loads.
  const probe=new Image();
  let settled=false;
  const finish=loaded=>{
    if(settled)return;
    settled=true;clearTimeout(timeout);imageRetryInFlight.delete(id);
    probe.onload=null;probe.onerror=null;
    if(assignedImageSource(id)!==src)return;
    if(!loaded){scheduleImageRetry(id);return;}
    unavailableImages.delete(id);imageRetryAttempts.delete(id);
    const recipe=recipeMap.get(id);
    if(recipe)document.querySelectorAll('[data-image-recipe="'+id+'"]').forEach(node=>{
      node.outerHTML=recipeVisual(recipe,node.dataset.imageLayout||'card');
    });
  };
  const timeout=setTimeout(()=>finish(false),12000);
  probe.onload=()=>finish(true);probe.onerror=()=>finish(false);probe.src=src;
}
function resumeRecipeImageRetries(){
  for(const id of unavailableImages)scheduleImageRetry(id);
}
function markRecipeImageUnavailable(id){
  const recipe=recipeMap.get(id);
  if(!recipe)return;
  unavailableImages.add(id);
  document.querySelectorAll('[data-image-recipe="'+id+'"]').forEach(node=>{
    node.outerHTML=recipeVisual(recipe,node.dataset.imageLayout||'card');
  });
  scheduleImageRetry(id);
}
async function refreshRecipeImages(){
  if(imageUpdateInProgress||document.hidden||navigator.onLine===false||!recipes.length)return;
  resumeRecipeImageRetries();
  if(Object.keys(recipeImages).length===recipes.length){
    if(imageUpdateTimer){clearInterval(imageUpdateTimer);imageUpdateTimer=null;}
    return;
  }
  imageUpdateInProgress=true;
  try{
    const response=await fetch('recipe-images.json?update='+Date.now(),{cache:'no-store'});
    if(!response.ok)return;
    const manifest=await response.json(),previous=recipeImages;
    const previousCount=Object.keys(previous).length;
    loadRecipeImages(manifest);
    const nextCount=Object.keys(recipeImages).length;
    if(nextCount<previousCount){recipeImages=previous;return;}
    const changedIds=new Set(Object.entries(recipeImages).filter(([id,image])=>image.src!==previous[id]?.src||image.revision!==previous[id]?.revision).map(([id])=>id));
    if(!changedIds.size)return;
    for(const id of changedIds){
      unavailableImages.delete(id);imageRetryAttempts.delete(id);
      if(imageRetryTimers.has(id)){clearTimeout(imageRetryTimers.get(id));imageRetryTimers.delete(id);}
    }
    // Update only illustrations so open recipes, notes, filters and scroll remain in place.
    for(const visual of document.querySelectorAll('[data-image-recipe]')){
      const recipe=recipeMap.get(visual.dataset.imageRecipe);
      if(recipe&&changedIds.has(recipe.id))visual.outerHTML=recipeVisual(recipe,visual.dataset.imageLayout||'card');
    }
    if(nextCount===recipes.length&&imageUpdateTimer){clearInterval(imageUpdateTimer);imageUpdateTimer=null;}
    if('serviceWorker' in navigator)navigator.serviceWorker.getRegistration().then(reg=>reg?.update()).catch(()=>{});
  }catch{
    // Keep the last valid catalog when offline or during a deployment.
  }finally{imageUpdateInProgress=false;}
}
function mainIngredients(r){
  const staples=/^(agua|water|sal|salt|pimienta|pepper|aceite|oil|ajo|garlic|vainilla|vanilla|comino|cumin|oregano|oregano|laurel|bay leaf)( |$)/;
  return r.ingredients.filter(i=>!staples.test(norm(i.name))).slice(0,3).map(i=>i.name);
}
function recipeVisual(r,layout='card'){
  const src=asset(r),compact=layout==='thumb';
  const attributes=' class="recipe-visual recipe-visual--'+layout+(src?'':' recipe-visual--missing')+'" data-image-recipe="'+r.id+'" data-image-layout="'+layout+'"';
  if(src)return '<span'+attributes+'><img src="'+esc(src)+'" alt="'+esc(t('Ilustración 3D de')+' '+r.title)+'" loading="'+(layout==='detail'?'eager':'lazy')+'" decoding="async" width="1536" height="1024"></span>';
  if(compact)return '<span'+attributes+' aria-hidden="true"><span>'+esc(mainIngredients(r)[0]||r.title)+'</span></span>';
  return '<span'+attributes+'><small class="ingredient-preview-label">'+t('Ingredientes principales')+'</small><span class="ingredient-preview">'+mainIngredients(r).map(i=>'<span>'+esc(i)+'</span>').join('')+'</span><small class="image-pending">'+(recipeImages[r.id]?t('Imagen temporalmente no disponible'):t('Imagen por añadir'))+'</small></span>';
}
function readState(){try{const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return raw&&raw.version===1?{...INITIAL,...raw}:structuredClone(INITIAL);}catch{return structuredClone(INITIAL);}}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));storageAvailable=true;}catch{if(storageAvailable)toast(t("Este navegador no permite guardar cambios. Exporta una copia desde Ayuda."));storageAvailable=false;}}
function parkOverlays(){for(const id of ['toast','timer-dock']){const el=document.getElementById(id);if(el)document.body.append(el);}}
function placeOverlays(){const host=[...document.querySelectorAll('dialog[open]')].at(-1)||document.body;for(const id of ['toast','timer-dock']){const el=document.getElementById(id);if(el)host.append(el);}}
function toast(text){placeOverlays();const el=document.getElementById('toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),3300);}
function fillIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
function favorite(id){return state.favorites.includes(id);}
function countCategory(id){return recipes.filter(r=>r.category===id).length;}
function initState(){
  state.favorites=Array.isArray(state.favorites)?state.favorites.filter(id=>recipeMap.has(id)):[];
  state.cooked=Array.isArray(state.cooked)?state.cooked.filter(id=>recipeMap.has(id)):[];
  state.shopping=Array.isArray(state.shopping)?state.shopping.filter(x=>recipeMap.has(x.id)&&Number.isFinite(x.servings)&&x.servings>0):[];
  state.manual=Array.isArray(state.manual)?state.manual.filter(x=>x&&typeof x.id==='string'&&typeof x.name==='string'):[];
  for(const k of ['checks','menu','notes'])if(!state[k]||typeof state[k]!=='object'||Array.isArray(state[k]))state[k]={};
  for(const [k,v]of Object.entries(state.menu))if(!v||!recipeMap.has(v.id)||!Number.isFinite(v.servings)||v.servings<=0)delete state.menu[k];
  document.documentElement.classList.toggle('big-text',!!state.largeText);
  document.getElementById('text-size-button').setAttribute('aria-pressed',!!state.largeText);
}
function nav(){
  const items=[['inicio','home',t("Inicio")],['recetas','book',t("Explorar recetas")],['ensaladas_frutas','leaf',t("Ensaladas y frutas")],['jugos','cup',t('Jugos y batidos')],['maiz','bowl',t('Maíz y tamales')],['bocaditos','utensils',t('Ensaladas frías y bocaditos')],['pasteleria','cake',t("Pastelería")],['pudines','cake',t('Pudines de pan')],['favoritos','heart',t("Mi recetario")],['menu','calendar',t("Menú semanal")],['compras','bag',t("Lista de compras")]];
  document.getElementById('main-nav').innerHTML=items.map(([v,i,label],n)=>(v==='favoritos'?("<div class=\"nav-divider\"></div><p class=\"nav-small-label\">"+t("TU COCINA")+"</p>"):'')+'<button class="nav-item '+(currentView===v?'active':'')+'" data-view="'+v+'" '+(currentView===v?'aria-current="page"':'')+'>'+icon(i)+'<span>'+label+'</span>'+(v==='pasteleria'?'<span class="nav-pill">'+countCategory('pasteleria')+'</span>':'')+'</button>').join('');
  const mobileItems=['inicio','pasteleria','favoritos','menu','compras'].map(id=>items.find(item=>item[0]===id));
  document.getElementById('mobile-nav').innerHTML=mobileItems.map(([v,i,label])=>'<button class="'+(currentView===v?'active':'')+'" data-view="'+v+'" aria-label="'+label+'">'+icon(i)+'<span>'+({inicio:t("Inicio"),pasteleria:t("Pastelería"),favoritos:t("Guardadas"),menu:t("Menú"),compras:t("Compras")}[v])+'</span></button>').join('');
  document.getElementById('favorite-count').textContent=state.favorites.length;
  document.getElementById('breadcrumb').textContent={inicio:t("Nuestra cocina"),recetas:t("El recetario completo"),ensaladas_frutas:t("Ensaladas y frutas"),maiz:t("Maíz y tamales"),jugos:t("Jugos y batidos"),bocaditos:t("Ensaladas frías y bocaditos"),pudines:t("Pudines de pan"),pasteleria:t("Del horno a la mesa"),favoritos:t("Tu colección personal"),menu:t("Organiza tu semana"),compras:t("Todo para cocinar"),ayuda:t("La cocina, a tu manera"),derechos:t("Derechos de autor")}[currentView];
}
function navigate(view,opts={}){
  const coldRoutes={'ensaladas-frias':'frias','pastas-bocaditos':'pastas'};
  if(Object.hasOwn(coldRoutes,view)){opts={...opts,section:coldRoutes[view]};view='bocaditos';}
  const collectionRoutes={'combinaciones':'all','ensaladas-frutas':'all','ensaladas':'ensaladas','frutas':'frutas'};
  if(Object.hasOwn(collectionRoutes,view)){opts={...opts,section:collectionRoutes[view]};view='ensaladas_frutas';}
  if(!['inicio','recetas','pasteleria','ensaladas_frutas','maiz','jugos','bocaditos','pudines','favoritos','menu','compras','ayuda','derechos'].includes(view))view='inicio';
  currentView=view;visibleCount=18;
  if(!opts.keepFilters)filters={q:'',category:view==='pasteleria'?'pasteleria':'all',time:'all',sort:'recommended'};
  if(opts.category)filters.category=opts.category;
  if(opts.query!==undefined)filters.q=String(opts.query);
  if(view==='ensaladas_frutas')filters.section=Object.hasOwn(SALAD_FRUIT_GROUPS,opts.section)?opts.section:'all';
  if(EXTRA_COLLECTIONS[view])filters.section=Object.hasOwn(EXTRA_COLLECTIONS[view].groups,opts.section)?opts.section:'all';
  history.replaceState(null,'','#'+(view==='ensaladas_frutas'||EXTRA_COLLECTIONS[view]?collectionRoute():view));render();if(!opts.keepScroll)window.scrollTo({top:0,behavior:'instant'});
}
function render(){nav();const main=document.getElementById('main');
  if(currentView==='inicio')renderHome();
  else if(['recetas','pasteleria','ensaladas_frutas','maiz','jugos','bocaditos','pudines','favoritos'].includes(currentView))renderCatalog();
  else if(currentView==='menu')renderMenu();else if(currentView==='compras')renderShopping();else if(currentView==='derechos')renderRights();else renderHelp();
  fillIcons(main);
}
function hero(){
  return '<section class="hero home-hero" aria-labelledby="hero-title">'+
    '<div class="hero-deco" aria-hidden="true"></div><div class="hero-copy">'+
    '<div class="eyebrow">'+t('BIENVENIDOS A COCINA CUBANA')+'</div>'+
    '<h1 id="hero-title">'+t('El sabor de Cuba,')+'<br><em>'+t('en tu mesa.')+'</em></h1>'+
    '<p>'+t('Encuentra tu próxima receta, disfruta la pastelería cubana y organiza lo que vas a cocinar.')+'</p>'+
    '<div class="home-hero-actions"><button class="hero-button" data-view="recetas">'+icon('book')+' '+t('Empezar a cocinar')+'</button>'+
    '<button class="home-hero-secondary" data-view="pasteleria">'+t('Descubrir la pastelería')+'</button></div>'+
    '<p class="home-hero-note">'+recipes.length+' '+t('recetas')+' · '+t('Español e inglés')+'</p></div>'+
    '<div class="hero-art"><img src="assets/mesa-cubana-3d.png" alt="'+t('Imagen 3D de un plato cubano con arroz, frijoles, carne y plátano')+'" fetchpriority="high">'+
    '<span class="hero-tag">'+t('El sabor de casa')+'</span></div></section>';
}
function renderHome(){
  const tools=[
    {view:'recetas',icon:'book',title:t('Explorar recetas'),description:t('Encuentra el plato que te apetece.')},
    {view:'favoritos',icon:'heart',title:t('Mi recetario'),description:t('Tus recetas favoritas, siempre a mano.')},
    {view:'menu',icon:'calendar',title:t('Menú semanal'),description:t('Organiza las comidas de tu semana.')},
    {view:'compras',icon:'bag',title:t('Lista de compras'),description:t('Reúne los ingredientes que necesitas.')}
  ];
  const collections=[
    {view:'ensaladas_frutas',icon:'leaf',title:t('Ensaladas y frutas')},
    {view:'jugos',icon:'cup',title:t('Jugos y batidos')},
    {view:'maiz',icon:'bowl',title:t('Maíz y tamales')},
    {view:'bocaditos',icon:'utensils',title:t('Ensaladas frías y bocaditos')},
    {view:'pudines',icon:'cake',title:t('Pudines de pan')}
  ];
  const featured=['r003','r067','r1073'].map(id=>recipeMap.get(id)).filter(Boolean);
  document.getElementById('main').innerHTML='<div class="home-page">'+hero()+
    '<form class="home-search" id="home-search-form" role="search" aria-label="'+t('Buscar recetas por nombre o ingrediente')+'">'+
    '<label for="home-search-input">'+t('¿Qué te apetece cocinar?')+'</label><div class="home-search-controls">'+
    '<div class="home-search-field">'+icon('search')+'<input id="home-search-input" type="search" maxlength="180" placeholder="'+t('Prueba con congrí, pudín o un ingrediente…')+'" aria-label="'+t('Buscar recetas por nombre o ingrediente')+'" autocomplete="off"></div>'+
    '<button class="button" type="submit">'+t('Buscar recetas')+'</button></div></form>'+
    '<nav class="home-shortcuts" aria-label="'+t('Accesos rápidos a tu cocina')+'">'+tools.map(item=>
      '<button class="home-shortcut" data-view="'+item.view+'"><span class="home-shortcut-icon">'+icon(item.icon)+'</span><span><strong>'+item.title+'</strong><span class="home-shortcut-description">'+item.description+'</span></span></button>'
    ).join('')+'</nav>'+
    '<section class="home-section" aria-labelledby="home-categories-title"><div class="section-heading"><div><div class="eyebrow">'+t('DE TODO, PARA TODOS LOS GUSTOS')+'</div>'+
    '<h2 id="home-categories-title">'+t('Explora nuestros sabores')+'</h2><p>'+t('Elige una categoría y encuentra tu próxima receta.')+'</p></div></div>'+
    '<div class="home-category-grid">'+Object.entries(CATEGORIES).map(([id,c])=>
      '<button class="home-category" data-home-category="'+id+'"><span class="home-category-icon" style="background:'+c.color+'">'+icon(c.icon)+'</span><strong>'+esc(c.name)+'</strong><span>'+countCategory(id)+' '+t('recetas')+'</span></button>'
    ).join('')+'</div></section>'+
    '<section class="home-section" aria-labelledby="home-featured-title"><div class="section-heading"><div><h2 id="home-featured-title">'+t('Para cocinar hoy')+'</h2><p>'+t('Un plato, un acompañamiento y algo dulce para compartir.')+'</p></div><button class="text-link" data-view="recetas">'+t('Ver el recetario')+'</button></div>'+
    '<div class="recipe-grid">'+featured.map(card).join('')+'</div></section>'+
    '<section class="home-section home-collections" aria-labelledby="home-collections-title"><div class="section-heading"><div><h2 id="home-collections-title">'+t('Un antojo para cada momento')+'</h2><p>'+t('Descubre nuestras colecciones de la casa.')+'</p></div></div>'+
    '<div class="home-collection-links">'+collections.map(item=>'<button data-view="'+item.view+'">'+icon(item.icon)+'<span>'+item.title+'</span></button>').join('')+'</div></section>'+
    '<section class="home-welcome-note"><span>'+icon('people')+'</span><div><h2>'+t('Cocinar también es compartir')+'</h2><p>'+t('Recetas cubanas y versiones caseras para reunir a la familia, recordar nuestros sabores y crear nuevos momentos en la mesa.')+'</p></div></section></div>';
  document.getElementById('home-search-form').addEventListener('submit',event=>{
    event.preventDefault();
    const query=document.getElementById('home-search-input').value.trim();
    navigate('recetas',{query});
  });
}
function searchControls(){return '<div class="search-row"><label class="search-field">'+icon('search')+("<span class=\"sr-only\" style=\"position:absolute;clip:rect(0,0,0,0)\">"+t("Buscar recetas por nombre o ingrediente")+"</span><input id=\"recipe-search\" type=\"search\" placeholder=\""+t("¿Qué cocinamos hoy? Busca una receta o ingrediente…")+"\" value=\"")+esc(filters.q)+("\" autocomplete=\"off\"></label><select class=\"filter-select\" id=\"time-filter\" aria-label=\""+t("Filtrar por tiempo total")+"\"><option value=\"all\">"+t("Cualquier tiempo")+"</option><option value=\"30\" ")+(filters.time==='30'?'selected':'')+(">"+t("Hasta 30 minutos")+"</option><option value=\"60\" ")+(filters.time==='60'?'selected':'')+(">"+t("Hasta 1 hora")+"</option><option value=\"120\" ")+(filters.time==='120'?'selected':'')+(">"+t("Hasta 2 horas")+"</option></select><select class=\"filter-select\" id=\"sort-filter\" aria-label=\""+t("Ordenar recetas")+"\"><option value=\"recommended\">"+t("Selección de la casa")+"</option><option value=\"time\" ")+(filters.sort==='time'?'selected':'')+(">"+t("Menor tiempo")+"</option><option value=\"az\" ")+(filters.sort==='az'?'selected':'')+(">"+t("Nombre: A–Z")+"</option></select></div>");}
function categoryChips(){
  if(currentView==='ensaladas_frutas')return saladFruitChips();
  if(EXTRA_COLLECTIONS[currentView])return extraCollectionChips();
  let cats=Object.entries(CATEGORIES);
  if(currentView==='pasteleria')cats=cats.filter(([id])=>['pasteleria','postres','bebidas'].includes(id));
  return ("<div class=\"category-strip\" role=\"group\" aria-label=\""+t("Categorías de recetas")+"\">")+(currentView==='pasteleria'?'':'<button class="chip '+(filters.category==='all'?'active':'')+'" data-category="all" aria-pressed="'+(filters.category==='all')+("\">"+t("Todas")+" <span class=\"chip-count\">")+recipes.length+'</span></button>')+cats.map(([id,c])=>'<button class="chip '+(filters.category===id?'active':'')+'" data-category="'+id+'" aria-pressed="'+(filters.category===id)+'">'+icon(c.icon)+esc(c.name)+' <span class="chip-count">'+countCategory(id)+'</span></button>').join('')+'</div>';
}
function filteredRecipes(){
  let list=recipes.filter(r=>(currentView!=='favoritos'||favorite(r.id))&&(filters.category==='all'||r.category===filters.category)&&(filters.time==='all'||total(r)<=Number(filters.time)));
  if(currentView==='ensaladas_frutas'){
    const ids=SALAD_FRUIT_GROUPS[filters.section]||SALAD_FRUIT_IDS;
    list=list.filter(r=>ids.includes(r.id));
  }
  if(EXTRA_COLLECTIONS[currentView]){const ids=EXTRA_COLLECTIONS[currentView].groups[filters.section]||collectionIds();list=list.filter(r=>ids.includes(r.id));}
  const words=norm(filters.q).split(' ').filter(Boolean);
  if(words.length)list=list.filter(r=>words.every(w=>r.searchText.includes(w)));
  if(filters.sort==='time')list.sort((a,b)=>total(a)-total(b)||a.title.localeCompare(b.title,language));
  else if(filters.sort==='az')list.sort((a,b)=>a.title.localeCompare(b.title,language));
  else {const featured=currentView==='ensaladas_frutas'?SALAD_FRUIT_FEATURED:EXTRA_COLLECTIONS[currentView]?EXTRA_COLLECTIONS[currentView].featured:['r001','r066','r136','r026','r086','r166','r106','r121','r046','r137','r141','r191'];list.sort((a,b)=>{const ai=featured.indexOf(a.id),bi=featured.indexOf(b.id);return (ai<0?1000:ai)-(bi<0?1000:bi);});}
  return list;
}
function collectionRoute(){if(currentView==='bocaditos'&&filters.section==='frias')return 'ensaladas-frias';if(currentView==='bocaditos'&&filters.section==='pastas')return 'pastas-bocaditos';if(EXTRA_COLLECTIONS[currentView])return currentView;return filters.section==='ensaladas'?'ensaladas':filters.section==='frutas'?'frutas':'combinaciones';}
function saladFruitChips(){
  const groups=[['all',t('Todas las combinaciones'),SALAD_FRUIT_IDS.length],['ensaladas',t('Ensaladas mixtas'),SALAD_FRUIT_GROUPS.ensaladas.length],['frutas',t('Frutas'),SALAD_FRUIT_GROUPS.frutas.length]];
  return '<div class="category-strip collection-filters" role="group" aria-label="'+t('Filtrar ensaladas y frutas')+'">'+groups.map(([id,label,count])=>'<button class="chip '+((filters.section||'all')===id?'active':'')+'" data-collection="'+id+'" aria-pressed="'+((filters.section||'all')===id)+'">'+esc(label)+' <span class="chip-count">'+count+'</span></button>').join('')+'</div>';
}
function extraCollectionChips(){
  const collection=EXTRA_COLLECTIONS[currentView];
  const groups=[['all',t('Todas'),collectionIds().length],...Object.entries(collection.groups).map(([id,ids])=>[id,t(collection.labels[id]),ids.length])];
  return '<div class="category-strip collection-filters" role="group" aria-label="'+t('Filtrar esta selección')+'">'+groups.map(([id,label,count])=>'<button class="chip '+((filters.section||'all')===id?'active':'')+'" data-collection="'+id+'" aria-pressed="'+((filters.section||'all')===id)+'">'+esc(label)+' <span class="chip-count">'+count+'</span></button>').join('')+'</div>';
}
function collectionIntro(){
  const collection=EXTRA_COLLECTIONS[currentView];
  const isSalad=currentView==='ensaladas_frutas';
  const title=isSalad?(filters.section==='ensaladas'?t('Ensaladas mixtas'):filters.section==='frutas'?t('Frutas'):t('Ensaladas y frutas')):t(collection.labels[filters.section]||collection.title);
  const ids=isSalad?(SALAD_FRUIT_GROUPS[filters.section]||SALAD_FRUIT_IDS):(collection.groups[filters.section]||collectionIds());
  const eyebrow=isSalad?t('DULCE, SALADO Y LLENO DE COLOR'):t(collection.eyebrow);
  const description=isSalad?t('Ensaladas mixtas y preparaciones de frutas con ingredientes, imágenes y pasos completos.'):t(collection.description);
  return '<section class="collection-top salad-fruit-top collection-top--'+(isSalad?'ensaladas':currentView)+'" aria-labelledby="collection-title"><div><div class="eyebrow">'+eyebrow+'</div><h1 id="collection-title">'+title+'</h1><p>'+description+'</p><div class="collection-summary"><strong>'+ids.length+' '+t('recetas')+'</strong><span>'+t('Ingredientes, imágenes y preparación paso a paso.')+'</span></div></div></section>';
}
function collectionEntry(){
  if(!['inicio','recetas','pasteleria'].includes(currentView))return '';
  const entries=[
    {view:'ensaladas',title:t('Ensaladas mixtas'),icon:'leaf',count:SALAD_FRUIT_GROUPS.ensaladas.length,categories:['viandas_ensaladas'],description:t('Verduras, frutas, granos y proteínas en combinaciones para variar tu mesa.')},
    {view:'jugos',title:t('Jugos y batidos'),icon:'cup',count:collectionIds('jugos').length,categories:['bebidas'],description:t('Garapiña de cáscara de piña, guarapo y batidos de mamey, mamey amarillo, níspero y coco.')},
    {view:'maiz',title:t('Maíz y tamales'),icon:'bowl',count:collectionIds('maiz').length,categories:['entrantes','granos_sopas'],description:t('Hallacas, ajiaco, caldosa, harina de maíz y otros platos de cuchara.')},
    {view:'bocaditos',title:t('Ensaladas frías y bocaditos'),icon:'utensils',count:collectionIds('bocaditos').length,categories:['viandas_ensaladas','entrantes'],description:t('Ensaladas frescas y pastas de jamón, pollo, atún, huevo y queso para rellenar panecillos.')},
    {view:'pudines',title:t('Pudín cubano de pan'),icon:'cake',count:collectionIds('pudines').length,categories:['postres'],description:t('Ocho maneras de preparar el pudín de pan, con caramelo, frutas, chocolate o café.')}
  ].filter(entry=>currentView==='inicio'||entry.categories.includes(filters.category));
  if(!entries.length)return '';
  return '<div class="collection-entry-grid">'+entries.map(entry=>'<section class="collection-entry"><span class="collection-entry-icon" aria-hidden="true">'+icon(entry.icon)+'</span><div><h2>'+entry.title+'</h2><span class="collection-entry-count">'+entry.count+' '+t('recetas')+'</span><p>'+entry.description+'</p></div><button class="button" data-view="'+entry.view+'">'+t('Ver recetas')+'</button></section>').join('')+'</div>';
}
function card(r){return '<article class="recipe-card"><button class="card-main" data-recipe="'+r.id+("\" aria-label=\""+t("Ver receta de")+" ")+esc(r.title)+'"><div class="card-image" style="background:'+CATEGORIES[r.category].color+'">'+recipeVisual(r)+'<span class="card-badge">'+esc(CATEGORIES[r.category].name)+'</span></div><div class="card-body"><h3>'+esc(r.title)+'</h3><p class="card-description">'+esc(r.description)+'</p><div class="card-meta"><span>'+icon('clock')+duration(total(r))+'</span><span class="yield-meta">'+icon('people')+r.servings+' '+esc(r.yieldUnit)+'</span><span class="difficulty">'+esc(r.difficulty)+'</span></div></div></button><button class="card-fav" data-favorite="'+r.id+'" aria-label="'+(favorite(r.id)?t("Quitar de"):t("Guardar en"))+(" "+t("favoritos:")+" ")+esc(r.title)+'" aria-pressed="'+favorite(r.id)+'">'+icon('heart')+'</button></article>';}
function renderCatalog(){
  let intro='';
  if(currentView==='ensaladas_frutas'||EXTRA_COLLECTIONS[currentView])intro=collectionIntro();
  else if(currentView==='pasteleria')intro=("<section class=\"collection-top\"><div><div class=\"eyebrow\">"+t("GUAYABA, VAINILLA Y UN BUEN CAFÉ")+"</div><h1>"+t("Pastelería cubana")+"</h1><p>")+countCategory('pasteleria')+(" "+t("recetas de horno y masas. Descubre también")+" ")+countCategory('postres')+(" "+t("postres para cerrar la comida con algo dulce.")+"</p></div></section>");
  else if(currentView==='favoritos')intro=("<div class=\"page-header\"><div class=\"eyebrow\">"+t("AQUÍ SE QUEDAN TUS PREFERIDAS")+"</div><h1>"+t("Mi recetario")+"</h1><p>"+t("Las recetas que guardas para volver a cocinar. Tu colección se conserva en este navegador.")+"</p></div>");
  else intro=("<div class=\"page-header\"><div class=\"eyebrow\">"+t("NUESTROS SABORES, PASO A PASO")+"</div><h1>"+t("El recetario completo")+"</h1><p>")+recipes.length+(" "+t("recetas entre clásicos cubanos y versiones caseras, con cantidades, tiempos y consejos para tu cocina.")+"</p></div>");
  document.getElementById('main').innerHTML=intro+'<div id="collection-entry"></div>'+searchControls()+categoryChips()+'<section aria-labelledby="results-title"><div class="section-heading"><div><h2 id="results-title">'+t('Recetas para ti')+'</h2><p id="results-count" role="status" aria-live="polite"></p></div></div><div id="catalog-results"></div></section>';
  document.getElementById('recipe-search').addEventListener('input',e=>{filters.q=e.target.value;visibleCount=18;renderResults();});
  document.getElementById('time-filter').addEventListener('change',e=>{filters.time=e.target.value;visibleCount=18;renderResults();});
  document.getElementById('sort-filter').addEventListener('change',e=>{filters.sort=e.target.value;visibleCount=18;renderResults();});
  renderResults();
}
function renderResults(){const list=filteredRecipes();
  const entry=document.getElementById('collection-entry');if(entry)entry.innerHTML=collectionEntry();
  if(currentView==='ensaladas_frutas')document.getElementById('results-title').textContent=filters.section==='ensaladas'?t('Ensaladas mixtas'):filters.section==='frutas'?t('Combinaciones de frutas'):t('Combinaciones');
  if(EXTRA_COLLECTIONS[currentView])document.getElementById('results-title').textContent=t(EXTRA_COLLECTIONS[currentView].labels[filters.section]||EXTRA_COLLECTIONS[currentView].title);
  document.getElementById('results-count').textContent=list.length+(" "+t("receta"))+(list.length===1?'':'s')+(filters.q?(" "+t("para «"))+filters.q+'»':(currentView==='ensaladas_frutas'||EXTRA_COLLECTIONS[currentView])?' '+t('en esta selección'):filters.category!=='all'?(" "+t("de")+" ")+CATEGORIES[filters.category].name.toLowerCase():(" "+t("para descubrir")));
  const empty=currentView==='favoritos'&&!state.favorites.length?'<div class="empty-state"><span class="empty-icon">'+icon('heart')+("</span><h2>"+t("Tu recetario empieza aquí")+"</h2><p>"+t("Toca el corazón de una receta para tenerla siempre a mano.")+"</p><button class=\"button\" data-view=\"recetas\">"+t("Explorar recetas")+"</button></div>"):'<div class="empty-state"><span class="empty-icon">'+icon('search')+("</span><h2>"+t("No encontramos esa combinación")+"</h2><p>"+t("Prueba con otro ingrediente o amplía el tiempo de preparación.")+"</p><button class=\"button\" data-reset-filters>"+t("Quitar filtros")+"</button></div>");
  document.getElementById('catalog-results').innerHTML=list.length?'<div class="recipe-grid">'+list.slice(0,visibleCount).map(card).join('')+'</div>'+(list.length>visibleCount?("<button class=\"view-more\" data-more>"+t("Ver más recetas")+" <span aria-hidden=\"true\">·</span> ")+Math.min(visibleCount,list.length)+(" "+t("de")+" ")+list.length+'</button>':''):empty;
}
function toggleFavorite(id){if(!recipeMap.has(id))return;const old=favorite(id);state.favorites=old?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();nav();document.querySelectorAll('[data-favorite="'+id+'"]').forEach(b=>{b.setAttribute('aria-pressed',!old);b.setAttribute('aria-label',(!old?t("Quitar de"):t("Guardar en"))+(" "+t("favoritos:")+" ")+recipeMap.get(id).title);if(b.classList.contains('recipe-favorite'))b.innerHTML=icon('heart')+(!old?t("Guardada"):t("Guardar"));});if(currentView==='favoritos')renderResults();toast(old?t("Receta quitada de favoritos."):t("Receta guardada en Mi recetario."));}
function openRecipe(id){parkOverlays();const r=recipeMap.get(id);if(!r)return;currentRecipe=r;currentServings=r.servings;const dlg=document.getElementById('recipe-dialog');
  dlg.innerHTML=("<button class=\"dialog-close\" data-close=\"recipe-dialog\" aria-label=\""+t("Cerrar receta")+"\">")+icon('close')+'</button><div class="recipe-hero"><div class="recipe-hero-copy"><div class="eyebrow">'+esc(CATEGORIES[r.category].name)+' · '+esc(r.tradition)+'</div><h1 id="recipe-title">'+esc(r.title)+'</h1><p>'+esc(r.description)+'</p></div>'+recipeVisual(r,'detail')+'</div><div class="recipe-facts"><span>'+icon('clock')+'<strong>'+duration(total(r))+("</strong> "+t("en total")+"</span><span>"+t("Preparación:")+" ")+duration(r.prepMinutes)+("</span><span>"+t("Cocción:")+" ")+duration(r.cookMinutes)+'</span>'+(r.restMinutes?("<span>"+t("Reposo:")+" ")+duration(r.restMinutes)+'</span>':'')+'<span>'+icon('level')+esc(r.difficulty)+'</span></div><div class="recipe-body"><div class="recipe-actions"><button class="button" data-start-cook>'+icon('play')+(" "+t("Cocinar paso a paso")+"</button><button class=\"button secondary recipe-favorite\" data-favorite=\"")+r.id+'" aria-pressed="'+favorite(r.id)+'">'+icon('heart')+(favorite(r.id)?t("Guardada"):t("Guardar"))+'</button><button class="button secondary" data-add-shopping>'+icon('bag')+(" "+t("A la lista")+"</button><button class=\"button secondary\" data-plan-recipe>")+icon('calendar')+(" "+t("Al menú")+"</button><button class=\"button secondary\" data-print-recipe aria-label=\""+t("Imprimir receta")+"\">")+icon('print')+("</button><button class=\"button secondary\" data-share-recipe aria-label=\""+t("Compartir enlace de la receta")+"\">")+icon('share')+("</button></div><div class=\"recipe-layout\"><section class=\"ingredients-panel\"><h2>"+t("Ingredientes")+"</h2><div class=\"serving-control\"><span id=\"serving-unit\">")+esc(r.yieldUnit)+("</span><div><button class=\"round-button\" data-serving=\"-1\" aria-label=\""+t("Reducir cantidad")+"\">−</button><strong id=\"serving-number\">")+currentServings+("</strong><button class=\"round-button\" data-serving=\"1\" aria-label=\""+t("Aumentar cantidad")+"\">+</button></div></div><p class=\"serving-note\">"+t("Ingredientes ajustables. Los pasos y moldes corresponden a la tanda base de")+" ")+r.servings+' '+esc(r.yieldUnit)+(t(". Las cifras dentro de los pasos no se recalculan. Mantén la temperatura y adapta recipientes o tandas.")+"</p><ul class=\"ingredients-list\" id=\"ingredients-list\"></ul><div class=\"allergens\"><strong>"+t("Alérgenos declarados:")+"</strong> ")+(r.allergens.length?esc(r.allergens.join(', ')):t("no se han identificado alérgenos principales en la fórmula base"))+(t(". Revisa las etiquetas de los productos y la contaminación cruzada.")+"</div></section><section><h2>"+t("Manos a la cocina")+"</h2><ol class=\"steps-list\">")+r.steps.map((s,i)=>("<li><span class=\"step-num\" aria-label=\""+t("Paso")+" ")+(i+1)+'">'+(i+1)+'</span><p class="step-text">'+esc(s)+'</p></li>').join('')+'</ol>'+(r.tips.length?("<div class=\"recipe-tip\"><strong>"+t("El toque de casa")+"</strong>")+r.tips.map(esc).join('<br>')+'</div>':'')+("</section></div><section class=\"notes-section\"><h3>"+t("Mis notas para la próxima vez")+"</h3><textarea id=\"recipe-note\" maxlength=\"4000\" aria-label=\""+t("Notas personales de esta receta")+"\" placeholder=\""+t("Ese toque que la hace tuya…")+"\">")+esc(state.notes[r.id]||'')+("</textarea><p class=\"note-caption\">"+t("Se guardan automáticamente en este navegador.")+"</p></section>")+sourceDisclosure(r)+("<p class=\"recipe-footer-note\">"+t("Ilustraciones 3D creadas para cada receta del catálogo. Recetas redactadas para esta colección; las variantes caseras están identificadas. Los tiempos son orientativos y no sustituyen comprobar la cocción.")+"</p></div>");
  dlg.querySelector('.recipe-hero-copy').insertAdjacentHTML('afterbegin',languageControls());renderIngredients();document.getElementById('recipe-note').addEventListener('input',e=>{state.notes[r.id]=e.target.value;save();});if(!dlg.open)dlg.showModal();placeOverlays();dlg.scrollTop=0;
}
function sourceDisclosure(r){const list=sources.filter(s=>(r.sourceIds||[]).includes(s.id));return ("<details class=\"source-disclosure\"><summary>"+t("Sobre esta receta y sus referencias")+"</summary><p>"+t("Redacción propia de una")+" ")+(r.tradition===t("Tradicional")?t("preparación tradicional"):t("versión doméstica"))+(t(". La colección no cuenta con pruebas culinarias presenciales. Las fuentes documentan técnicas o contexto; las cantidades de esta versión son propuestas editoriales.")+"</p>")+list.map(s=>'<p><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a></p>').join('')+'</details>';}
function renderIngredients(){const ratio=currentServings/currentRecipe.servings;document.getElementById('serving-number').textContent=currentServings;document.getElementById('ingredients-list').innerHTML=currentRecipe.ingredients.map((ing,i)=>("<li><label class=\"check-row\"><input type=\"checkbox\" aria-label=\""+t("Marcar")+" ")+esc(ing.name)+'"><span><strong>'+(ing.amount===null?'':amount(ing.amount*ratio)+' '+esc(ing.unit)+' ')+'</strong>'+esc(ing.name)+(ing.amount===null?(" "+t("· al gusto")):'')+(ing.note?'<span class="ingredient-note">'+(ratio!==1&&/\d/.test(ing.note)?(t("Tanda base:")+" "):'')+esc(ing.note)+'</span>':'')+'</span></label></li>').join('');}
function addShopping(id,servings){const r=recipeMap.get(id);if(!r)return;const entry=state.shopping.find(x=>x.id===id);if(entry)entry.servings=servings;else state.shopping.push({id,servings});state.checks={};save();toast((t("Ingredientes añadidos para")+" ")+servings+' '+r.yieldUnit+'.');if(currentView==='compras')renderShopping();}
function openPlan(){parkOverlays();const r=currentRecipe;const dlg=document.getElementById('plan-dialog');dlg.innerHTML=("<button class=\"dialog-close\" data-close=\"plan-dialog\" aria-label=\""+t("Cerrar")+"\">")+icon('close')+("</button><h2 id=\"plan-title\">"+t("Un lugar en tu semana")+"</h2><p>")+esc(r.title)+' · '+currentServings+' '+esc(r.yieldUnit)+("</p><label class=\"form-label\" for=\"plan-day\">"+t("Día")+"</label><select class=\"form-control\" id=\"plan-day\">")+DAYS.map(d=>'<option value="'+d.id+'">'+d.name+'</option>').join('')+("</select><label class=\"form-label\" for=\"plan-meal\">"+t("Comida del día")+"</label><select class=\"form-control\" id=\"plan-meal\">")+MEALS.map(m=>'<option value="'+m.id+'">'+m.name+'</option>').join('')+("</select><p class=\"footnote\">"+t("Si el espacio ya tiene una receta, se sustituirá por esta.")+"</p><div class=\"toolbar\"><button class=\"button\" data-confirm-plan>"+t("Añadir al menú")+"</button></div>");dlg.showModal();placeOverlays();}
function confirmPlan(){const slot=document.getElementById('plan-day').value+'-'+document.getElementById('plan-meal').value;state.menu[slot]={id:currentRecipe.id,servings:currentServings};save();document.getElementById('plan-dialog').close();if(currentView==='menu')renderMenu();toast(t("Receta añadida al menú semanal."));}
function renderMenu(){const used=Object.keys(state.menu).length;document.getElementById('main').innerHTML=("<header class=\"page-header\"><div class=\"eyebrow\">"+t("UNA SEMANA CON SABOR")+"</div><h1>"+t("Menú semanal")+"</h1><p>"+t("Elige qué cocinar cada día. Este plan es reutilizable: cámbialo cuando empiece una nueva semana.")+"</p></header><div class=\"toolbar\"><button class=\"button\" data-menu-shopping ")+(!used?'disabled':'')+'>'+icon('bag')+(" "+t("Preparar lista de compras")+"</button><span class=\"pill-note\">")+used+(" "+t("de 14 comidas organizadas")+"</span><button class=\"button secondary\" data-clear-menu ")+(!used?'disabled':'')+(">"+t("Vaciar menú")+"</button></div><div class=\"plan-grid\">")+DAYS.map(d=>'<section class="day-card"><h2>'+d.name+'</h2>'+MEALS.map(m=>{const key=d.id+'-'+m.id;const item=state.menu[key],r=item&&recipeMap.get(item.id);return '<div class="meal-slot"><span class="meal-label">'+m.name+'</span>'+(r?'<div class="meal-added">'+recipeVisual(r,'thumb')+'<button class="meal-name" data-recipe="'+r.id+'">'+esc(r.title)+'<small>'+item.servings+' '+esc(r.yieldUnit)+'</small></button></div><button class="icon-button" data-remove-slot="'+key+("\" aria-label=\""+t("Quitar")+" ")+esc(r.title)+(" "+t("del")+" ")+d.name+'">'+icon('close')+'</button>':'<button class="meal-add" data-pick-slot="'+key+("\">"+t("+ Elegir receta")+"</button>"))+'</div>';}).join('')+'</section>').join('')+("</div><p class=\"footnote\">"+t("Preparar la lista sustituye sus recetas por las de este menú y conserva los ingredientes añadidos a mano. Las porciones del menú son las indicadas en cada receta. Para cambiarlas, abre la receta, ajusta la cantidad y vuelve a añadirla al mismo día.")+"</p>");}
function openPicker(slot){parkOverlays();pickerSlot=slot;const dlg=document.getElementById('picker-dialog');dlg.innerHTML=("<button class=\"dialog-close\" data-close=\"picker-dialog\" aria-label=\""+t("Cerrar selección")+"\">")+icon('close')+("</button><h2 id=\"picker-title\">"+t("¿Qué te apetece cocinar?")+"</h2><label class=\"search-field\" style=\"margin-bottom:17px\">")+icon('search')+("<input id=\"picker-search\" placeholder=\""+t("Busca entre las")+" ")+recipes.length+(" "+t("recetas")+"\" aria-label=\""+t("Buscar receta para el menú")+"\"></label><div class=\"picker-results\" id=\"picker-results\"></div>");pickerResults('');document.getElementById('picker-search').addEventListener('input',e=>pickerResults(e.target.value));dlg.showModal();placeOverlays();}
function pickerResults(q){const words=norm(q).split(' ').filter(Boolean);const list=recipes.filter(r=>words.every(w=>r.searchText.includes(w)));document.getElementById('picker-results').innerHTML=list.length?list.map(r=>'<button class="picker-recipe" data-choose-recipe="'+r.id+'">'+recipeVisual(r,'thumb')+'<span><strong>'+esc(r.title)+'</strong><small>'+esc(CATEGORIES[r.category].name)+' · '+duration(total(r))+' · '+r.servings+' '+esc(r.yieldUnit)+'</small></span></button>').join(''):("<p class=\"notice\">"+t("No encontramos esa receta. Prueba otro nombre o ingrediente.")+"</p>");}
function chooseForMenu(id){const r=recipeMap.get(id);state.menu[pickerSlot]={id,servings:r.servings};save();document.getElementById('picker-dialog').close();renderMenu();toast(t("Menú actualizado."));}
function menuToShopping(){if(state.shopping.length&&!confirm(t("¿Sustituir las recetas de la lista por las de este menú? Los ingredientes añadidos a mano se conservan.")))return;const sums=new Map();Object.values(state.menu).forEach(item=>sums.set(item.id,(sums.get(item.id)||0)+item.servings));state.shopping=[...sums].map(([id,servings])=>({id,servings}));state.checks={};save();navigate('compras');toast(t("Lista actualizada con las porciones del menú semanal."));}
function shoppingEntries(){const map=new Map();for(const item of state.shopping){const r=recipeMap.get(item.id);if(!r)continue;for(const [ingredientIndex,i] of r.ingredients.entries()){const canonical=spanishRecipeMap.get(r.id)?.ingredients[ingredientIndex]||i;const key=norm(canonical.name)+'|'+norm(canonical.unit)+'|'+(i.amount===null?'taste':'measured');const val=i.amount===null?null:i.amount*item.servings/r.servings;const note=i.note?(item.servings!==r.servings&&/\d/.test(i.note)?(t("Tanda base:")+" ")+i.note:i.note):'';const old=map.get(key);if(old){if(val!==null)old.amount+=val;if(note&&!old.notes.includes(note))old.notes.push(note);}else map.set(key,{key,name:i.name,unit:i.unit,amount:val,notes:note?[note]:[],manual:false});}}
  return [...map.values()].sort((a,b)=>a.name.localeCompare(b.name,language)).concat(state.manual.map(m=>({key:'manual:'+m.id,name:m.name,amount:null,unit:'',manual:true,id:m.id,notes:[]})));
}
function renderShopping(){const list=shoppingEntries(),done=list.filter(x=>state.checks[x.key]).length;document.getElementById('main').innerHTML=("<header class=\"page-header\"><div class=\"eyebrow\">"+t("DEL RECETARIO AL MERCADO")+"</div><h1>"+t("Lista de compras")+"</h1><p>"+t("Los ingredientes se reúnen desde tus recetas y porciones. Se suman cuando el nombre y la unidad coinciden; revisa las presentaciones antes de comprar.")+"</p></header><div class=\"toolbar\"><button class=\"button\" data-copy-shopping ")+(!list.length?'disabled':'')+'>'+icon('share')+(" "+t("Copiar lista")+"</button><button class=\"button secondary\" data-print-shopping ")+(!list.length?'disabled':'')+'>'+icon('print')+(" "+t("Imprimir")+"</button><button class=\"button secondary\" data-clear-shopping ")+(!list.length?'disabled':'')+(">"+t("Vaciar lista")+"</button></div><div class=\"shopping-layout\"><section class=\"shopping-list-panel\"><h2>"+t("Lo que necesitamos")+"</h2><p class=\"footnote\" style=\"margin:0\">")+done+(" "+t("de")+" ")+list.length+(" "+t("ingredientes marcados")+"</p><div class=\"shopping-progress\"><span style=\"width:")+(list.length?done/list.length*100:0)+'%"></span></div>'+(list.length?'<ul class="shopping-list">'+list.map(item=>'<li><label class="check-row"><input type="checkbox" data-check-shopping="'+esc(item.key)+'" '+(state.checks[item.key]?'checked':'')+'><span><strong>'+(item.amount===null?'':amount(item.amount)+' '+esc(item.unit)+' ')+'</strong>'+esc(item.name)+(item.amount===null&&!item.manual?(" "+t("· al gusto")):'')+(item.notes.length?'<span class="ingredient-note">'+esc(item.notes.join('; '))+'</span>':'')+'</span></label>'+(item.manual?'<button class="icon-button" data-delete-manual="'+esc(item.id)+("\" aria-label=\""+t("Quitar")+" ")+esc(item.name)+'">'+icon('close')+'</button>':'')+'</li>').join('')+'</ul>':("<div class=\"notice\">"+t("Abre una receta y toca «A la lista», o añade tus propios ingredientes aquí.")+"</div>"))+("<form class=\"manual-form\" id=\"manual-form\"><input id=\"manual-item\" maxlength=\"180\" placeholder=\""+t("Añadir algo más: 2 limones…")+"\" aria-label=\""+t("Ingrediente adicional")+"\" required><button class=\"button\" type=\"submit\" aria-label=\""+t("Añadir ingrediente")+"\">")+icon('plus')+("</button></form></section><aside class=\"shopping-side\"><h2>"+t("Recetas de esta lista")+"</h2>")+(state.shopping.length?state.shopping.map(item=>{const r=recipeMap.get(item.id);return '<div class="shopping-source"><span><button style="text-align:left;padding:0" data-recipe="'+r.id+'">'+esc(r.title)+'</button><small>'+item.servings+' '+esc(r.yieldUnit)+'</small></span><button class="icon-button" data-remove-shopping="'+r.id+("\" aria-label=\""+t("Quitar ingredientes de")+" ")+esc(r.title)+'">'+icon('close')+'</button></div>';}).join(''):("<p class=\"footnote\">"+t("Aquí aparecerán las recetas cuyos ingredientes hayas añadido.")+"</p>"))+("<div class=\"toolbar\"><button class=\"button secondary\" data-view=\"recetas\">"+t("Buscar más recetas")+"</button></div><p class=\"footnote\">"+t("Al volver a añadir una receta, se actualizan sus porciones sin duplicarla. Las compras marcadas se reinician cuando cambia la lista.")+"</p></aside></div>");
  document.getElementById('manual-form').addEventListener('submit',e=>{e.preventDefault();const el=document.getElementById('manual-item'),name=el.value.trim();if(!name)return;state.manual.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name});save();renderShopping();document.getElementById('manual-item').focus();});
}
async function copyText(text,msg){try{await navigator.clipboard.writeText(text);toast(msg);}catch{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';document.body.append(ta);ta.select();let ok=false;try{ok=document.execCommand('copy');}catch{}ta.remove();toast(ok?msg:t("No se pudo copiar. Usa la opción Imprimir para guardar la lista."));}}
function shoppingText(){return (t("COCINA CUBANA · LISTA DE COMPRAS")+"\n\n")+shoppingEntries().map(i=>(state.checks[i.key]?'[✓] ':'[ ] ')+(i.amount===null?'':amount(i.amount)+' '+i.unit+' ')+i.name+(i.amount===null&&!i.manual?(" "+t("(al gusto)")):'')).join('\n');}
function renderRights(){
  const sections=[
    ['Uso personal del recetario','Puedes consultar las recetas e imprimirlas para uso personal con las funciones de la aplicación. También puedes compartir sus enlaces; la persona que los reciba necesitará acceso al sitio.'],
    ['Reserva de derechos','Los derechos que existan sobre los elementos originales protegibles pertenecen a sus respectivos titulares. La reproducción, redistribución o explotación comercial de esos elementos requiere la autorización correspondiente, salvo los usos permitidos por la ley o por una licencia aplicable.'],
    ['Alcance de este aviso','Este aviso no reclama exclusividad sobre recetas tradicionales, listas de ingredientes o métodos culinarios. Las ilustraciones del catálogo se crearon con IA; no se atribuye automáticamente copyright a los materiales generados por IA ni se sustituyen los derechos de terceros.'],
    ['Sobre el registro oficial','Este aviso informa sobre derechos y condiciones de uso. No constituye un certificado de registro ni acredita una inscripción oficial de la aplicación.']
  ];
  document.getElementById('main').innerHTML='<article class="rights-page"><header class="page-header"><div class="eyebrow">'+t('DERECHOS Y USO')+'</div><h1>'+t('Derechos de autor')+'</h1><p>'+t('Cocina Cubana es un proyecto de Beacon of the Eagle LLC.')+'</p></header>'+sections.map(([title,body])=>'<section class="rights-section"><h2>'+t(title)+'</h2><p>'+t(body)+'</p></section>').join('')+'<section class="rights-section rights-sources"><h2>'+t('Información oficial')+'</h2><a href="https://www.copyright.gov/what-is-copyright/" target="_blank" rel="noopener noreferrer">'+t('Oficina de Copyright de Estados Unidos')+'</a><a href="https://www.copyright.gov/circs/circ33.pdf" target="_blank" rel="noopener noreferrer">'+t('Alcance de los derechos de autor')+'</a></section><a class="button" href="#recetas" data-view="recetas">'+t('Volver al recetario')+'</a></article>';
}

function renderHelp(){document.getElementById('main').innerHTML='<section class="language-help"><strong>'+t('Idioma')+'</strong><p>'+t('Elige Español o English en la parte superior. Se traducen las recetas y la aplicación, y tu elección se guarda en este navegador.')+'</p>'+languageControls()+'</section>'+("<header class=\"page-header\"><div class=\"eyebrow\">"+t("TODO A MANO")+"</div><h1>"+t("Tu cocina, a tu manera")+"</h1><p>"+t("Cómo usar el recetario, guardar tus preferencias y llevarlo al teléfono.")+"</p></header><div class=\"help-grid\"><section class=\"help-card\"><h2>"+t("Empieza por un antojo")+"</h2><ol><li>"+t("Busca un plato o un ingrediente en español o inglés. Puedes escribir con o sin tildes.")+"</li><li>"+t("Abre la receta y ajusta las porciones.")+"</li><li>"+t("Marca los ingredientes que ya tienes y activa el modo paso a paso.")+"</li><li>"+t("Guárdala con el corazón, añádela al menú o prepara la lista de compras.")+"</li></ol></section><section class=\"help-card\"><h2>"+t("Instalar y usar sin conexión")+"</h2><p>"+t("En un navegador compatible puedes añadir esta app a tu pantalla de inicio. En Android busca «Instalar aplicación»; en iPhone, abre Safari, toca Compartir y «Añadir a pantalla de inicio».")+"</p><p>"+t("Abre primero el recetario con internet. Cuando la descarga inicial termine, las recetas y sus ilustraciones podrán consultarse sin conexión en este mismo navegador. La instalación depende del navegador y del acceso al sitio.")+"</p><p id=\"offline-status-text\" class=\"footnote\">")+esc(window.__offlineReady?t("Recetario guardado para usar sin conexión."):t("La disponibilidad sin conexión se comprueba tras la primera carga."))+("</p><button class=\"button secondary\" data-install>"+t("Opciones de instalación")+"</button></section><section class=\"help-card\"><h2>"+t("Tus datos y privacidad")+"</h2><p>"+t("Favoritos, notas, menú y compras se guardan localmente en este navegador. No se envían a un servidor de la app y no se sincronizan entre dispositivos.")+"</p><p>"+t("Si borras los datos del navegador, puedes perderlos. Exporta una copia y vuelve a importarla cuando la necesites. Los enlaces de fuentes abren sitios externos con sus propias políticas.")+"</p><div class=\"toolbar\"><button class=\"button\" data-export>")+icon('download')+(" "+t("Exportar mis datos")+"</button><button class=\"button secondary\" data-import>")+icon('upload')+(" "+t("Importar copia")+"</button><input id=\"import-backup\" type=\"file\" accept=\"application/json,.json\" hidden></div><button class=\"text-link\" data-reset-personal>"+t("Borrar mis datos de este navegador")+"</button></section><section class=\"help-card\"><h2>"+t("Lectura cómoda")+"</h2><p>"+t("Activa texto grande o escucha los pasos con la voz disponible en tu dispositivo. La lectura en voz alta requiere una voz compatible con el idioma seleccionado.")+"</p><div class=\"toolbar\"><button class=\"button secondary\" data-large-text aria-pressed=\"")+!!state.largeText+'">Aa · '+(state.largeText?t("Usar tamaño normal"):t("Activar texto grande"))+("</button></div><p>"+t("El temporizador cuenta el tiempo con la app abierta. Si el dispositivo suspende la aplicación, la alarma puede retrasarse hasta que vuelvas a abrirla.")+"</p></section><section class=\"help-card wide\"><h2>"+t("Acerca de las")+" ")+recipes.length+(" "+t("recetas")+"</h2><p>"+t("Esta colección reúne preparaciones cubanas y variantes caseras identificadas como tales. Los ingredientes y las instrucciones son una redacción propia para esta app. Las recetas no se han probado presencialmente en una cocina: ajusta el punto de cocción según tus ingredientes y equipo.")+"</p><p>"+t("Cada receta del catálogo tiene su propia ilustración 3D. Si una imagen no se puede cargar, se muestran los ingredientes de esa receta. Los tiempos incluyen preparación, cocción y reposo indicado; son estimaciones. Las referencias culinarias documentan contexto y técnicas, no certifican cada fórmula editorial.")+"</p><p>"+t("La lista de alérgenos es orientativa. Comprueba etiquetas y utensilios; no interpretes la ausencia de un alérgeno en una ficha como certificación para una alergia.")+"</p><div class=\"notice\">"+t("En pastelería, al cambiar porciones conserva la temperatura del horno y usa moldes equivalentes o varias tandas. Revisa el tiempo y no asumas que se multiplica en la misma proporción.")+"</div></section><section class=\"help-card wide\"><h2>"+t("Referencias consultadas")+"</h2><div class=\"source-links\">")+sources.filter((s,i,a)=>a.findIndex(x=>x.url===s.url)===i).map(s=>'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a>').join('')+'</div></section></div>';
  document.getElementById('import-backup').addEventListener('change',importBackup);
}
function toggleText(){state.largeText=!state.largeText;document.documentElement.classList.toggle('big-text',state.largeText);document.getElementById('text-size-button').setAttribute('aria-pressed',state.largeText);save();if(currentView==='ayuda')renderHelp();toast(state.largeText?t("Texto grande activado."):t("Tamaño de texto normal."));}
function exportData(){const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mi-cocina-cubana-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(t("Copia personal preparada."));}
async function importBackup(e){const file=e.target.files[0];if(!file)return;try{if(file.size>33_554_432)throw Error(t("La copia supera el tamaño permitido."));const incoming=JSON.parse(await file.text());if(incoming.version!==1||!Array.isArray(incoming.favorites)||!Array.isArray(incoming.shopping)||!Array.isArray(incoming.manual)||!incoming.menu||!incoming.notes)throw Error(t("El archivo no es una copia válida de Cocina Cubana."));const clean=structuredClone(INITIAL);clean.favorites=[...new Set(incoming.favorites.filter(x=>recipeMap.has(x)))];clean.cooked=Array.isArray(incoming.cooked)?incoming.cooked.filter(x=>recipeMap.has(x)):[];clean.shopping=incoming.shopping.filter(x=>x&&recipeMap.has(x.id)&&Number.isFinite(x.servings)&&x.servings>0&&x.servings<=1000).map(x=>({id:x.id,servings:x.servings}));clean.manual=incoming.manual.filter(x=>x&&typeof x.id==='string'&&typeof x.name==='string').slice(0,2000).map(x=>({id:x.id.slice(0,100),name:x.name.slice(0,180)}));clean.largeText=!!incoming.largeText;clean.language=language;const slots=DAYS.flatMap(d=>MEALS.map(m=>d.id+'-'+m.id));for(const k of slots){const v=incoming.menu[k];if(v&&recipeMap.has(v.id)&&Number.isFinite(v.servings)&&v.servings>0&&v.servings<=1000)clean.menu[k]={id:v.id,servings:v.servings};}for(const r of recipes){if(typeof incoming.notes[r.id]==='string')clean.notes[r.id]=incoming.notes[r.id].slice(0,4000);}if(incoming.checks&&typeof incoming.checks==='object')for(const[k,v]of Object.entries(incoming.checks).slice(0,10000))if(k!=='__proto__'&&k!=='constructor'&&k!=='prototype'&&v===true)clean.checks[k]=true;if(!confirm(t("¿Sustituir tus favoritos, menú, notas y compras por esta copia?")))return;state=clean;initState();save();render();toast(t("Copia importada correctamente."));}catch(error){toast(error.message||t("No pudimos leer esta copia."));}finally{e.target.value='';}}
function openCook(){cookStep=0;renderCook();document.getElementById('cook-dialog').showModal();placeOverlays();}
function renderCook(){parkOverlays();const r=currentRecipe;document.getElementById('cook-dialog').innerHTML=("<button class=\"dialog-close\" data-close=\"cook-dialog\" aria-label=\""+t("Cerrar modo de cocina")+"\">")+icon('close')+("</button><div class=\"eyebrow\">"+t("MANOS A LA COCINA")+"</div><h2 id=\"cook-title\">")+esc(r.title)+("</h2><p class=\"cook-subtitle\">"+t("Paso")+" ")+(cookStep+1)+(" "+t("de")+" ")+r.steps.length+' · '+currentServings+' '+esc(r.yieldUnit)+'</p>'+(currentServings!==r.servings?("<p class=\"notice\">"+t("Pasos para la tanda base de")+" ")+r.servings+' '+esc(r.yieldUnit)+(t(". Las cifras escritas en los pasos no cambian: usa la lista de ingredientes ajustada y adapta las tandas.")+"</p>"):'')+'<div class="cook-progress" aria-hidden="true">'+r.steps.map((_,i)=>'<span class="'+(i<=cookStep?'done':'')+'"></span>').join('')+'</div><p class="cook-step" tabindex="-1" aria-live="polite">'+esc(r.steps[cookStep])+'</p><div class="cook-tools"><button class="button secondary" data-speak '+(!('speechSynthesis'in window)?'disabled':'')+'>'+icon('sound')+(" "+t("Escuchar paso")+"</button><label for=\"timer-minutes\">"+t("Temporizador")+"</label><input id=\"timer-minutes\" class=\"timer-input\" type=\"number\" min=\"1\" max=\"600\" value=\"10\" aria-label=\""+t("Minutos del temporizador")+"\"><button class=\"button secondary\" data-start-timer>")+icon('clock')+(" "+t("Iniciar")+"</button></div><div class=\"cook-controls\"><button class=\"button secondary\" data-cook-step=\"-1\" ")+(cookStep===0?'disabled':'')+(">"+t("Anterior")+"</button>")+(cookStep<r.steps.length-1?("<button class=\"button\" data-cook-step=\"1\">"+t("Siguiente paso")+"</button>"):'<button class="button" data-finish-cook>'+icon('check')+(" "+t("¡A la mesa!")+"</button>"))+'</div>';document.getElementById('cook-dialog').insertAdjacentHTML('afterbegin',languageControls());placeOverlays();if(document.getElementById('cook-dialog').open)document.querySelector('.cook-step').focus({preventScroll:true});}
function speakStep(){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const msg=new SpeechSynthesisUtterance((t("Paso")+" ")+(cookStep+1)+'. '+currentRecipe.steps[cookStep]);msg.lang=language==='en'?'en-US':'es-ES';msg.rate=.92;const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(language));if(voice)msg.voice=voice;speechSynthesis.speak(msg);}
function startTimer(){const mins=Number(document.getElementById('timer-minutes').value);if(!Number.isFinite(mins)||mins<1||mins>600){toast(t("Elige entre 1 y 600 minutos."));return;}if(state.timer&&!confirm(t("¿Reemplazar el temporizador que está en marcha?")))return;state.timer={deadline:Date.now()+mins*60000,label:currentRecipe.title};save();timerTick();clearInterval(timerInterval);timerInterval=setInterval(timerTick,1000);toast((t("Temporizador de")+" ")+mins+(" "+t("minutos iniciado.")));}
function timerTick(){const dock=document.getElementById('timer-dock');if(!state.timer){dock.hidden=true;clearInterval(timerInterval);return;}const remaining=Math.max(0,Math.ceil((state.timer.deadline-Date.now())/1000));placeOverlays();dock.hidden=false;dock.innerHTML=icon('clock')+'<span><small style="display:block;font-size:.69rem;margin-bottom:2px">'+(remaining?t("Temporizador de cocina"):t("Tiempo cumplido"))+'</small><strong role="timer">'+Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0')+("</strong></span><button data-stop-timer aria-label=\""+t("Cerrar temporizador")+"\">")+icon('close')+'</button>';if(!remaining&&!state.timer.notified){state.timer.notified=true;save();toast(t("Tiempo cumplido. Revisa la preparación."));try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.connect(gain);gain.connect(ctx.destination);oscillator.frequency.value=660;gain.gain.setValueAtTime(.18,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.01,ctx.currentTime+1);oscillator.start();oscillator.stop(ctx.currentTime+1);setTimeout(()=>ctx.close(),1500);}catch{}}}
function printRecipe(){document.body.classList.add('print-recipe');document.body.classList.remove('print-shopping');window.print();}
async function shareRecipe(){const url=new URL(location.href);url.hash='recetas';url.searchParams.set('receta',currentRecipe.id);url.searchParams.set('lang',language);if(navigator.share){try{await navigator.share({title:currentRecipe.title+' · Cocina Cubana',url:url.href});return;}catch(e){if(e.name==='AbortError')return;}}await copyText(url.href,t("Enlace de la receta copiado. El destinatario necesita acceso a la app."));}
async function install(){if(deferredInstall){await deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;document.getElementById('install-button').hidden=true;}else{toast(t("Abre el menú del navegador y elige «Instalar» o «Añadir a pantalla de inicio»."));}}


function languageControls(){
  return '<div class="language-control" role="group" aria-label="'+t('Cambiar idioma')+'">'+
    ['es','en'].map(code=>'<button type="button" data-language="'+code+'" lang="'+code+'" aria-pressed="'+(language===code)+'">'+(code==='es'?'Español':'English')+'</button>').join('')+'</div>';
}
function applyLanguageShell(){
  document.documentElement.lang=language;
  document.title=language==='en'?'Cocina Cubana · The taste of home':'Cocina Cubana · El sabor de casa';
  const meta=document.querySelector('meta[name="description"]');
  if(meta&&recipes.length)meta.content=language==='en'?recipes.length+' Cuban recipes, baking and desserts in English and Spanish. Cook step by step, save your favorites and plan your menu and shopping.':recipes.length+' recetas cubanas, pastelería y postres en español e inglés. Cocina paso a paso, guarda favoritos y organiza tu menú y tus compras.';
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
  const slot=document.getElementById('language-switch');if(slot)slot.innerHTML=languageControls();
  document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.language===language));
}
function validateEnglishCatalog(){
  if(!Array.isArray(englishRecipes)||englishRecipes.length!==spanishRecipes.length)throw Error(t('La traducción al inglés está incompleta. Vuelve a cargar la aplicación.'));
  const translations=new Map(englishRecipes.map(r=>[r.id,r]));
  if(translations.size!==spanishRecipes.length||spanishRecipes.some(r=>{
    const en=translations.get(r.id);
    return !en||!en.title||en.steps.length!==r.steps.length||en.ingredients.length!==r.ingredients.length;
  }))throw Error(t('La traducción al inglés está incompleta. Vuelve a cargar la aplicación.'));
}
function selectCatalog(){
  const translations=new Map(englishRecipes.map(r=>[r.id,r]));
  recipes=spanishRecipes.map(es=>{
    const en=translations.get(es.id),r=language==='en'?en:es;
    const searchText=norm([es.title,es.description,es.category,CATEGORIES[es.category].name,...es.ingredients.map(i=>i.name),...es.tags,
      en?.title,en?.description,...(en?.ingredients||[]).map(i=>i.name),...(en?.tags||[])].join(' '));
    return {...r,searchText};
  });
  recipeMap=new Map(recipes.map(r=>[r.id,r]));
}
function setLanguage(next){
  if(!['es','en'].includes(next)||next===language||!spanishRecipes.length)return;
  const openIds=[...document.querySelectorAll('dialog[open]')].map(el=>el.id);
  const recipeId=currentRecipe?.id,servings=currentServings,step=cookStep;
  const checked=[...document.querySelectorAll('#ingredients-list input')].map(el=>el.checked);
  const day=document.getElementById('plan-day')?.value,meal=document.getElementById('plan-meal')?.value;
  const pickerQuery=document.getElementById('picker-search')?.value;
  const manualDraft=document.getElementById('manual-item')?.value;
  const homeSearchDraft=document.getElementById('home-search-input')?.value;
  const timerMinutes=document.getElementById('timer-minutes')?.value;
  if('speechSynthesis' in window)speechSynthesis.cancel();
  language=next;state.language=next;selectCatalog();save();applyLanguageShell();render();
  if(manualDraft!==undefined&&document.getElementById('manual-item'))document.getElementById('manual-item').value=manualDraft;
  if(homeSearchDraft!==undefined&&document.getElementById('home-search-input'))document.getElementById('home-search-input').value=homeSearchDraft;
  if(recipeId&&recipeMap.has(recipeId)){
    currentRecipe=recipeMap.get(recipeId);
    if(openIds.includes('recipe-dialog')){
      openRecipe(recipeId);currentServings=servings;renderIngredients();
      document.querySelectorAll('#ingredients-list input').forEach((el,i)=>el.checked=!!checked[i]);
    }
    if(openIds.includes('cook-dialog')){cookStep=step;currentServings=servings;renderCook();if(timerMinutes!==undefined)document.getElementById('timer-minutes').value=timerMinutes;}
    if(openIds.includes('plan-dialog')){
      document.getElementById('plan-dialog').close();openPlan();
      if(day)document.getElementById('plan-day').value=day;
      if(meal)document.getElementById('plan-meal').value=meal;
    }
  }
  if(openIds.includes('picker-dialog')){
    document.getElementById('picker-dialog').close();openPicker(pickerSlot);
    if(pickerQuery){document.getElementById('picker-search').value=pickerQuery;pickerResults(pickerQuery);}
  }
  const url=new URL(location.href);
  if(url.searchParams.has('lang')){url.searchParams.set('lang',language);history.replaceState(null,'',url);}
  if(state.timer)timerTick();
  placeOverlays();toast(t('Idioma: español.'));
}

// Browser event bindings
document.addEventListener('error',event=>{
  const visual=event.target?.tagName==='IMG'&&event.target.closest('.recipe-visual');
  if(!visual)return;
  markRecipeImageUnavailable(visual.dataset.imageRecipe);
},true);
document.querySelector('.skip-link').addEventListener('click',e=>{e.preventDefault();document.getElementById('main').focus();document.getElementById('main').scrollIntoView();});
document.addEventListener('click',e=>{
  const b=e.target.closest('button,[data-view]');if(!b)return;
  if(b.dataset.language){setLanguage(b.dataset.language);return;}
  if(b.dataset.view){navigate(b.dataset.view);return;}
  if(b.dataset.homeCategory&&Object.hasOwn(CATEGORIES,b.dataset.homeCategory)){navigate(b.dataset.homeCategory==='pasteleria'?'pasteleria':'recetas',{category:b.dataset.homeCategory});return;}
  if(b.dataset.recipe){openRecipe(b.dataset.recipe);return;}
  if(b.dataset.favorite){toggleFavorite(b.dataset.favorite);return;}
  if(b.dataset.close){document.getElementById(b.dataset.close).close();if(b.dataset.close==='cook-dialog'&&'speechSynthesis'in window)speechSynthesis.cancel();return;}
  if(b.dataset.collection&&(currentView==='ensaladas_frutas'||EXTRA_COLLECTIONS[currentView])){
    const groups=currentView==='ensaladas_frutas'?SALAD_FRUIT_GROUPS:EXTRA_COLLECTIONS[currentView].groups;
    if(b.dataset.collection!=='all'&&!Object.hasOwn(groups,b.dataset.collection))return;
    filters.section=b.dataset.collection;visibleCount=18;history.replaceState(null,'','#'+collectionRoute());
    document.querySelector('.category-strip').outerHTML=categoryChips();
    document.querySelector('.collection-top').outerHTML=collectionIntro();renderResults();
    document.querySelector('[data-collection="'+filters.section+'"]').focus({preventScroll:true});return;
  }
  if(b.dataset.category){filters.category=b.dataset.category;visibleCount=18;const scrollX=document.querySelector('.category-strip').scrollLeft;document.querySelector('.category-strip').outerHTML=categoryChips();document.querySelector('.category-strip').scrollLeft=scrollX;renderResults();return;}
  if(b.hasAttribute('data-more')){visibleCount+=18;renderResults();return;}
  if(b.hasAttribute('data-reset-filters')){const section=filters.section;filters={q:'',category:currentView==='pasteleria'?'pasteleria':'all',time:'all',sort:'recommended'};if(currentView==='ensaladas_frutas'||EXTRA_COLLECTIONS[currentView])filters.section=section||'all';renderCatalog();return;}
  if(b.dataset.serving){currentServings=Math.max(1,Math.min(100,currentServings+Number(b.dataset.serving)));renderIngredients();return;}
  if(b.hasAttribute('data-add-shopping')){addShopping(currentRecipe.id,currentServings);return;}
  if(b.hasAttribute('data-plan-recipe')){openPlan();return;}
  if(b.hasAttribute('data-confirm-plan')){confirmPlan();return;}
  if(b.dataset.pickSlot){openPicker(b.dataset.pickSlot);return;}
  if(b.dataset.chooseRecipe){chooseForMenu(b.dataset.chooseRecipe);return;}
  if(b.dataset.removeSlot){delete state.menu[b.dataset.removeSlot];save();renderMenu();return;}
  if(b.hasAttribute('data-menu-shopping')){menuToShopping();return;}
  if(b.hasAttribute('data-clear-menu')){if(confirm(t("¿Vaciar todo el menú semanal?"))){state.menu={};save();renderMenu();}return;}
  if(b.dataset.removeShopping){state.shopping=state.shopping.filter(x=>x.id!==b.dataset.removeShopping);state.checks={};save();renderShopping();return;}
  if(b.dataset.deleteManual){state.manual=state.manual.filter(x=>x.id!==b.dataset.deleteManual);delete state.checks['manual:'+b.dataset.deleteManual];save();renderShopping();return;}
  if(b.hasAttribute('data-clear-shopping')){if(confirm(t("¿Vaciar la lista de compras y sus recetas?"))){state.shopping=[];state.manual=[];state.checks={};save();renderShopping();}return;}
  if(b.hasAttribute('data-copy-shopping')){copyText(shoppingText(),t("Lista de compras copiada."));return;}
  if(b.hasAttribute('data-print-shopping')){document.body.classList.remove('print-recipe');document.body.classList.add('print-shopping');window.print();return;}
  if(b.hasAttribute('data-print-recipe')){printRecipe();return;}
  if(b.hasAttribute('data-share-recipe')){shareRecipe();return;}
  if(b.hasAttribute('data-export')){exportData();return;}
  if(b.hasAttribute('data-import')){document.getElementById('import-backup').click();return;}
  if(b.hasAttribute('data-reset-personal')){if(confirm(t("¿Borrar favoritos, notas, menú y compras de este navegador? Exporta una copia si quieres conservarlos."))){state={...structuredClone(INITIAL),language};save();initState();timerTick();render();toast(t("Datos personales borrados. Las recetas siguen disponibles."));}return;}
  if(b.hasAttribute('data-large-text')||b.id==='text-size-button'){toggleText();return;}
  if(b.hasAttribute('data-start-cook')){openCook();return;}
  if(b.dataset.cookStep){if('speechSynthesis'in window)speechSynthesis.cancel();cookStep=Math.max(0,Math.min(currentRecipe.steps.length-1,cookStep+Number(b.dataset.cookStep)));renderCook();return;}
  if(b.hasAttribute('data-speak')){speakStep();return;}
  if(b.hasAttribute('data-start-timer')){startTimer();return;}
  if(b.hasAttribute('data-stop-timer')){delete state.timer;save();timerTick();return;}
  if(b.hasAttribute('data-finish-cook')){if(!state.cooked.includes(currentRecipe.id))state.cooked.push(currentRecipe.id);save();if('speechSynthesis'in window)speechSynthesis.cancel();document.getElementById('cook-dialog').close();toast(t("¡Buen provecho! Puedes anotar tu toque personal al final de la receta."));return;}
  if(b.hasAttribute('data-install')||b.id==='install-button'){install();return;}
});
document.addEventListener('change',e=>{if(e.target.matches('[data-check-shopping]')){const key=e.target.dataset.checkShopping;state.checks[key]=e.target.checked;save();const list=shoppingEntries(),done=list.filter(x=>state.checks[x.key]).length;document.querySelector('.shopping-progress>span').style.width=(done/list.length*100)+'%';document.querySelector('.shopping-list-panel>.footnote').textContent=done+(" "+t("de")+" ")+list.length+(" "+t("ingredientes marcados"));}});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',placeOverlays));
document.getElementById('cook-dialog').addEventListener('close',()=>{if('speechSynthesis'in window)speechSynthesis.cancel();});
window.addEventListener('afterprint',()=>document.body.classList.remove('print-recipe','print-shopping'));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;document.getElementById('install-button').hidden=false;});
window.addEventListener('hashchange',()=>{const route=location.hash.slice(1);if(route==='main'){document.getElementById('main').focus();return;}if(recipes.length)navigate(route||'inicio');});
window.addEventListener('offline',()=>document.getElementById('offline-indicator').hidden=false);
window.addEventListener('online',()=>{document.getElementById('offline-indicator').hidden=true;refreshRecipeImages();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(state.timer)timerTick();refreshRecipeImages();}});

async function boot(){
  applyLanguageShell();fillIcons();
  try{
    const [recipeResponse,sourceResponse,englishResponse,imageResponse]=await Promise.all([
      fetch('recipes.json?v='+APP_VERSION),fetch('sources.json?v='+APP_VERSION),
      fetch('recipes.en.json?v='+APP_VERSION),
      fetch('recipe-images.json?v='+APP_VERSION).catch(()=>null)
    ]);
    if(!recipeResponse.ok)throw Error(t('No se pudo cargar el recetario.'));
    spanishRecipes=await recipeResponse.json();
    sources=sourceResponse.ok?await sourceResponse.json():[];
    if(!Array.isArray(spanishRecipes)||!spanishRecipes.length)throw Error(t('El recetario no está disponible.'));
    if(!englishResponse.ok)throw Error(t('No se pudo cargar la traducción al inglés. Comprueba la conexión y vuelve a intentarlo.'));
    englishRecipes=await englishResponse.json();
    validateEnglishCatalog();
    spanishRecipeMap=new Map(spanishRecipes.map(r=>[r.id,r]));
    if(imageResponse?.ok){try{loadRecipeImages(await imageResponse.json());}catch{loadRecipeImages({});}}
    const requestedLanguage=new URL(location.href).searchParams.get('lang');
    if(requestedLanguage==='es'||requestedLanguage==='en')language=requestedLanguage;
    state.language=language;
    selectCatalog();applyLanguageShell();initState();save();
    navigate(location.hash.slice(1)||'inicio');
    if(Object.keys(recipeImages).length<recipes.length)imageUpdateTimer=setInterval(refreshRecipeImages,60000);
    const id=new URL(location.href).searchParams.get('receta');if(id)openRecipe(id);
    if(state.timer){timerTick();timerInterval=setInterval(timerTick,1000);}
    document.getElementById('offline-indicator').hidden=navigator.onLine;
    if(!window.CocinaAndroid?.active && 'serviceWorker' in navigator){
      try{
        await navigator.serviceWorker.register('sw.js',{updateViaCache:'none'});
        navigator.serviceWorker.addEventListener('message',e=>{
          if(e.data?.type==='OFFLINE_READY'){
            window.__offlineReady=true;
            const text=document.getElementById('offline-status-text');
            if(text)text.textContent=t('Recetario guardado para usar sin conexión.');
          }
        });
        const reg=await navigator.serviceWorker.ready;
        if(reg.active)reg.active.postMessage({type:'CHECK_CACHE'});
      }catch{window.__offlineReady=false;}
    }
  }catch(err){
    document.getElementById('main').innerHTML='<div class="empty-state"><span class="empty-icon">'+icon('book')+'</span><h1>'+t('No pudimos abrir el recetario')+'</h1><p>'+esc(err.message)+' '+t('Comprueba la conexión e inténtalo de nuevo.')+'</p><button class="button" id="retry-load">'+t('Volver a intentar')+'</button></div>';
    document.getElementById('retry-load').addEventListener('click',()=>location.reload());
  }
}
boot();
