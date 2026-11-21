import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
if(process.argv.includes('--image-retries-only')){
  await validateImageRetries();
  console.log('PASS: mapped-image failure labels, three bounded retries, offline/hidden pause, single-image recovery and unchanged user state.');
  process.exit(0);
}
const recipes=JSON.parse(read('dist/recipes.json'));
const englishRecipes=JSON.parse(read('dist/recipes.en.json'));
const sources=JSON.parse(read('dist/sources.json'));
const counts={"carnes": 90, "aves": 100, "pescados": 103, "arroces": 100, "granos_sopas": 102, "viandas_ensaladas": 110, "entrantes": 110, "pasteleria": 198, "postres": 105, "bebidas": 23};
assert.equal(recipes.length,1041,'Exactly 1041 recipes');
assert.equal(new Set(recipes.map(r=>r.id)).size,1041,'Unique IDs');
assert.equal(new Set(recipes.map(r=>r.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())).size,1041,'Unique normalized recipe titles');
const sourceIds=new Set(sources.map(s=>s.id));
assert.equal(sourceIds.size,sources.length,'Unique source IDs');
for(const[category,count]of Object.entries(counts))assert.equal(recipes.filter(r=>r.category===category).length,count,category);
for(const[rIndex,r]of recipes.entries()){
  assert.match(r.id,/^r\d{3,}$/);
  if(rIndex)assert.ok(Number(r.id.slice(1))>Number(recipes[rIndex-1].id.slice(1)),'Stable increasing IDs allow retired recipes');
  for(const field of ['title','category','description','difficulty','tradition','yieldUnit'])assert.ok(typeof r[field]==='string'&&r[field].length,r.id+' '+field);
  assert.ok(r.servings>0&&Number.isInteger(r.servings));
  for(const key of ['prepMinutes','cookMinutes','restMinutes'])assert.ok(Number.isFinite(r[key])&&r[key]>=0,r.id+' '+key);
  assert.ok(r.ingredients.length>=2,r.id+' ingredients');
  assert.ok(r.steps.length>=5,r.id+' full method');
  for(const i of r.ingredients){assert.ok(i.name&&i.unit);assert.ok(i.amount===null||(Number.isFinite(i.amount)&&i.amount>0),r.id+' ingredient amount');}
  for(const step of r.steps)assert.ok(typeof step==='string'&&step.length>=35,r.id+' detailed instructions');
  for(const s of r.sourceIds)assert.ok(sourceIds.has(s),r.id+' unresolved source '+s);
}
for(const s of sources){assert.ok(s.title&&s.id);assert.match(s.url,/^https:\/\//);}

// A translated catalog must preserve the recipe, serving and ingredient identities.
// Numeric instructions are compared per step, allowing decimal punctuation to localize.
const numbersIn=text=>[...String(text).matchAll(/\d+(?:[.,]\d+)?/g)].map(m=>m[0].replace(',','.')).sort();
const englishById=new Map(englishRecipes.map(r=>[r.id,r]));
assert.equal(englishRecipes.length,recipes.length,'English catalog is complete');
assert.equal(englishById.size,recipes.length,'Unique English IDs');
assert.equal(new Set(englishRecipes.map(r=>r.title.toLowerCase())).size,recipes.length,'Unique English titles');
assert.deepEqual(englishRecipes.map(r=>r.id),recipes.map(r=>r.id),'Both catalogs keep the same recipe order and IDs');
for(const es of recipes){
  const en=englishById.get(es.id);
  assert.ok(en,es.id+' has an English translation');
  assert.deepEqual(Object.keys(en).sort(),Object.keys(es).sort(),es.id+' English schema matches');
  for(const field of ['id','category','servings','prepMinutes','cookMinutes','restMinutes','sourceIds']){
    assert.deepEqual(en[field],es[field],es.id+' preserves '+field);
  }
  for(const field of ['title','description','yieldUnit','difficulty','tradition']){
    assert.ok(typeof en[field]==='string'&&en[field].trim(),es.id+' English '+field);
  }
  assert.ok(['Easy','Medium','Advanced'].includes(en.difficulty),es.id+' English difficulty');
  assert.ok(['Traditional','Home-style version'].includes(en.tradition),es.id+' English tradition');
  assert.ok(['servings','pieces','glasses'].includes(en.yieldUnit),es.id+' English yield');
  assert.notEqual(en.description,es.description,es.id+' description is translated');
  assert.equal(en.ingredients.length,es.ingredients.length,es.id+' ingredient count');
  es.ingredients.forEach((ingredient,index)=>{
    const translated=en.ingredients[index];
    assert.deepEqual(Object.keys(translated).sort(),Object.keys(ingredient).sort(),es.id+' ingredient schema '+index);
    assert.equal(translated.amount,ingredient.amount,es.id+' ingredient amount '+index);
    assert.ok(typeof translated.name==='string'&&translated.name.trim(),es.id+' ingredient name '+index);
    assert.ok(typeof translated.unit==='string'&&translated.unit.trim(),es.id+' ingredient unit '+index);
    if(ingredient.note!==undefined){
      assert.ok(typeof translated.note==='string'&&translated.note.trim(),es.id+' ingredient note '+index);
      assert.deepEqual(numbersIn(translated.note),numbersIn(ingredient.note),es.id+' numeric ingredient note '+index);
    }
  });
  for(const field of ['steps','tips','allergens','tags']){
    assert.ok(Array.isArray(en[field]),es.id+' English '+field+' array');
    assert.equal(en[field].length,es[field].length,es.id+' English '+field+' count');
    en[field].forEach((text,index)=>{
      assert.ok(typeof text==='string'&&text.trim(),es.id+' English '+field+' '+index);
      if(field==='steps'||field==='tips'){
        assert.deepEqual(numbersIn(text),numbersIn(es[field][index]),es.id+' numeric '+field+' '+index);
        assert.notEqual(text,es[field][index],es.id+' translated '+field+' '+index);
      }
    });
  }
}
const manifest=JSON.parse(read('dist/manifest.webmanifest'));
assert.match(read('dist/index.html'),/1041 recetas/);
assert.doesNotMatch(read('dist/index.html'),/\b200 recetas/);
assert.match(manifest.description,/1041 recetas/);
assert.match(read('dist/sw.js'),/VERSION='1\.13\.1'/);
for(const i of manifest.icons)assert.ok(existsSync(resolve(root,'dist',i.src)));
for(const file of ['index.html','styles.css','app.js','i18n.js','sw.js','recipes.json','recipes.en.json','recipe-images.json','sources.json'])assert.ok(existsSync(resolve(root,'dist',file)));
const js=read('dist/app.js');
const i18n=read('dist/i18n.js');
new vm.Script(js);
new vm.Script(i18n);
new vm.Script(read('dist/sw.js'));
let saved=null;
// These nodes only support nav() and initState(); this is not a browser emulator.
const nodes=new Map(['main-nav','mobile-nav','favorite-count','breadcrumb','text-size-button'].map(id=>[id,{
  innerHTML:'',textContent:'',attributes:{},setAttribute(name,value){this.attributes[name]=value;}
}]));
const document={
  getElementById(id){assert.ok(nodes.has(id),'Unexpected DOM access in functional checks: '+id);return nodes.get(id);},
  documentElement:{classList:{toggle(){}}},
};
const context=vm.createContext({console,structuredClone,URL,Intl,setTimeout,clearTimeout,Map,Set,Date,localStorage:{getItem:()=>null,setItem:(key,value)=>saved=value},document,window:{},confirm:()=>true});
vm.runInContext(i18n,context);
vm.runInContext(js.slice(0,js.indexOf("// Browser event bindings")),context);
context.seed=recipes;
context.seedEnglish=englishRecipes;
context.seedImages=JSON.parse(read('dist/recipe-images.json'));
vm.runInContext(`spanishRecipes=seed;englishRecipes=seedEnglish;spanishRecipeMap=new Map(spanishRecipes.map(r=>[r.id,r]));validateEnglishCatalog();selectCatalog();loadRecipeImages(seedImages);toast=()=>{};navigate=()=>{};`,context);
const run=expression=>vm.runInContext(expression,context);
const plain=expression=>JSON.parse(run('JSON.stringify('+expression+')'));
// The same recipe keeps its image in both languages and all UI surfaces.
// Distinct recipes cannot accidentally reuse a path or byte-identical image.
const imageManifest=JSON.parse(read('dist/recipe-images.json'));
const imageUrl=entry=>entry.src+'?rev='+entry.revision;
const imagePaths=new Set(),imageHashes=new Set();
const allowPartialImages=process.argv.includes('--partial-images');
for(const [id,entry] of Object.entries(imageManifest)){
  const recipe=recipes.find(r=>r.id===id);
  assert.ok(recipe,'Image references an existing recipe: '+id);
  assert.equal(entry.title,recipe.title,'Image assignment matches its reviewed dish');
  assert.equal(entry.src,`assets/recipes/${id}-3d.webp`);
  assert.ok(!imagePaths.has(entry.src),'No photo path reused for another dish');
  imagePaths.add(entry.src);
  const bytes=readFileSync(resolve(root,'dist',entry.src));
  const hash=createHash('sha256').update(bytes).digest('hex');
  assert.equal(entry.revision,hash.slice(0,12),'Image revision tracks its real content');
  assert.ok(!imageHashes.has(hash),'No byte-identical photo reused for another dish');
  imageHashes.add(hash);
  assert.equal(run(`asset(recipeMap.get('${id}'))`),imageUrl(entry));
}
if(!allowPartialImages)assert.equal(imagePaths.size,recipes.length,'Every recipe has its own individual image');
const first18=run('filteredRecipes().slice(0,18).map(r=>asset(r))');
assert.ok(first18.every(Boolean),'Every initial recipe has its own image');
assert.equal(new Set(first18).size,18,'Initial grid contains 18 different food images');
for(const recipe of recipes){
  if(allowPartialImages&&!imageManifest[recipe.id])continue;
  assert.ok(imageManifest[recipe.id],recipe.id+' has its own image');
  assert.match(run(`recipeVisual(recipeMap.get('${recipe.id}'))`),/<img/,'Every recipe renders an image');
}
run("unavailableImages.add('r003')");
assert.match(run("recipeVisual(recipeMap.get('r003'))"),/Ingredientes principales/);
run("unavailableImages.clear()");
assert.ok(!js.includes("r.category+'-3d.png'"),'No category-based food images');
run("language='en';selectCatalog()");
assert.equal(run("asset(recipeMap.get('r003'))"),imageUrl(imageManifest.r003),'Changing language keeps the same recipe image');
run("unavailableImages.add('r003')");
assert.match(run("recipeVisual(recipeMap.get('r003'))"),/Main ingredients/);
run("unavailableImages.clear()");
run("language='es';selectCatalog();unavailableImages.add('r003')");
assert.doesNotMatch(run("recipeVisual(recipeMap.get('r003'))"),/<img/,'Unavailable image does not fall back to a different meal');
run("unavailableImages.clear()");
const dictionary=plain('UI_EN');
// A new publication fills existing placeholders without resetting user state or filters.
const refreshedId=Object.keys(imageManifest).at(-1);
context.refreshTarget=refreshedId;
context.refreshManifest=imageManifest;
const refreshVisual={dataset:{imageRecipe:refreshedId,imageLayout:'card'},outerHTML:''};
document.querySelectorAll=selector=>{assert.equal(selector,'[data-image-recipe]');return[refreshVisual];};
context.navigator={onLine:true};
const beforeRefresh=plain('({state,filters,currentView,language})');
run('let incompleteImages={...refreshManifest};delete incompleteImages[refreshTarget];loadRecipeImages(incompleteImages)');
context.fetch=async()=>({ok:false});
await run('refreshRecipeImages()');
assert.equal(run('Object.keys(recipeImages).length'),Object.keys(imageManifest).length-1,'Failed refresh retains existing images');
context.fetch=async url=>{assert.match(url,/^recipe-images\.json\?update=\d+$/);return{ok:true,json:async()=>imageManifest};};
await run('refreshRecipeImages()');
assert.equal(run('asset(recipeMap.get(refreshTarget))'),imageUrl(imageManifest[refreshedId]),'New recipe image becomes available');
assert.ok(refreshVisual.outerHTML.includes(imageManifest[refreshedId].src),'Visible placeholder updates to the new image');
assert.deepEqual(plain('({state,filters,currentView,language})'),beforeRefresh,'Refreshing images preserves all user state');
// A repaired image gets a new URL even when the number of images is unchanged.
const sameCountManifest={...imageManifest};delete sameCountManifest.r001;
context.sameCountManifest=sameCountManifest;run('loadRecipeImages(sameCountManifest)');
const repairedManifest={...sameCountManifest,[refreshedId]:{...sameCountManifest[refreshedId],revision:'abcdef123456'}};
context.fetch=async()=>({ok:true,json:async()=>repairedManifest});
await run('refreshRecipeImages()');
assert.equal(run('asset(recipeMap.get(refreshTarget))'),imageUrl(repairedManifest[refreshedId]),'Repaired image bypasses old browser cache');
assert.ok(refreshVisual.outerHTML.includes('rev=abcdef123456'),'Visible image switches to the repaired revision');
assert.deepEqual(plain('({state,filters,currentView,language})'),beforeRefresh,'Repair refresh preserves user state');
run('loadRecipeImages(refreshManifest)');
delete document.querySelectorAll;
const translatedLiterals=[...js.matchAll(/\bt\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*\)/g)].map(m=>vm.runInNewContext(m[1]));
const htmlKeys=[...read('dist/index.html').matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map(m=>m[1]);
for(const key of new Set([...translatedLiterals,...htmlKeys])){
  assert.ok(Object.hasOwn(dictionary,key),'Missing English UI translation: '+key);
  assert.ok(typeof dictionary[key]==='string'&&dictionary[key].trim(),'Empty English UI translation: '+key);
}
// Exercise the real nav callbacks, including their translator calls. This catches
// a string label shadowing t() even though a syntax check alone would pass.
run("language='es';selectCatalog();nav()");
assert.match(nodes.get('main-nav').innerHTML,/Explorar recetas/);
assert.match(nodes.get('mobile-nav').innerHTML,/Guardadas/);
assert.equal(nodes.get('breadcrumb').textContent,'Nuestra cocina');
assert.equal(run('amount(1.5)'),'1,5');
run("language='en';selectCatalog();nav()");
assert.match(nodes.get('main-nav').innerHTML,/Explore recipes/);
assert.match(nodes.get('main-nav').innerHTML,/YOUR KITCHEN/);
assert.match(nodes.get('mobile-nav').innerHTML,/Saved/);
assert.equal(nodes.get('breadcrumb').textContent,'Our kitchen');
assert.equal(run('amount(1.5)'),'1.5');
run("language='es';selectCatalog()");
assert.equal(run('filteredRecipes().length'),1041);
run("filters.q='ROPA VIEJA'");assert.equal(run('filteredRecipes()[0].id'),'r001');
run("filters.q='limón'");const withAccent=run('filteredRecipes().map(r=>r.id).join()');run("filters.q='limon'");assert.equal(run('filteredRecipes().map(r=>r.id).join()'),withAccent);
run("filters.q='';filters.time='30'");assert.ok(run('filteredRecipes().length')>0);assert.ok(run('filteredRecipes().every(r=>total(r)<=30)'));
run("filters.time='all';filters.category='pasteleria'");assert.equal(run('filteredRecipes().length'),198);
run("currentView='favoritos';state.favorites=['r136'];filters.category='all'");assert.equal(run('filteredRecipes().length'),1);
run("state.favorites=['r136','r1016']");assert.equal(run('filteredRecipes().length'),2);
assert.ok(run("filteredRecipes().some(r=>r.id==='r1016')"),'Newest recipe works alongside an original favorite');
run("currentView='menu';state.menu={'lunes-comida':{id:'r001',servings:3},'martes-cena':{id:'r001',servings:6}};menuToShopping()");assert.equal(run('state.shopping.length'),1);assert.equal(run('state.shopping[0].servings'),9);
const expected=recipes[0].ingredients.find(i=>i.name==='falda de res').amount*1.5;
assert.equal(run("shoppingEntries().find(i=>i.name==='falda de res').amount"),expected);
run("state.menu={'lunes-comida':{id:'r002',servings:4}};menuToShopping()");assert.equal(run('state.shopping.length'),1);assert.equal(run('state.shopping[0].id'),'r002');
run("addShopping('r002',8);addShopping('r002',8)");assert.equal(run('state.shopping.length'),1);assert.equal(run('state.shopping[0].servings'),8);
run("state.notes.r001='<img src=x onerror=alert(1)>';save()");assert.ok(JSON.parse(saved).notes.r001.includes('<img'));
assert.equal(run("esc(state.notes.r001)"),'&lt;img src=x onerror=alert(1)&gt;');

// The requested collections contain distinct complete recipes in both languages.
for(const locale of ['es','en']){
  run(`language='${locale}';selectCatalog();currentView='ensaladas_frutas';filters={q:'',category:'all',time:'all',sort:'recommended',section:'ensaladas'}`);
  assert.equal(run('filteredRecipes().length'),50,'Exactly 50 mixed salads');
  run("currentView='jugos';filters.section='all'");
  assert.equal(run('filteredRecipes().length'),16,'Sixteen curated Cuban drinks');
  assert.equal(new Set(plain('filteredRecipes().map(r=>r.id)')).size,16,'Distinct drink varieties');
  assert.deepEqual(plain('filteredRecipes().slice(0,4).map(r=>r.id)'),['r1079','r193','r1080','r1060'],'Requested Cuban drinks appear first');
  run("currentView='maiz';filters.section='all'");
  assert.equal(run('filteredRecipes().length'),15,'Corn collection includes tamales, soups and fritters');
  assert.deepEqual(plain('filteredRecipes().slice(0,4).map(r=>r.id)'),['r1081','r1012','r091','r1017'],'Plain corn tamal appears first');
  run("filters.q='hallacas'");assert.ok(plain('filteredRecipes().map(r=>r.id)').includes('r1012'));
  run("filters.q='';filters.section='tamales'");assert.equal(run('filteredRecipes().length'),8);
  run("currentView='bocaditos';filters.section='all'");assert.equal(run('filteredRecipes().length'),28,'Cold salads and spreads are distinct');
  run("filters.section='frias'");assert.equal(run('filteredRecipes().length'),16,'Cold salad list');
  run("filters.section='pastas'");assert.equal(run('filteredRecipes().length'),12,'Twelve sandwich spreads');
  assert.ok(plain('filteredRecipes().map(r=>r.id)').includes('r1066'),'Classic ham and cheese spread is available');
  run("currentView='pudines';filters.section='all'");
  assert.deepEqual(plain('filteredRecipes().map(r=>r.id)'),['r178','r1073','r609','r1074','r1075','r1076','r1077','r1078'],'Eight distinct bread puddings, including the two existing recipes');
  assert.ok(run("filteredRecipes().every(r=>r.category==='postres'&&r.ingredients.some(i=>/bread|pan/i.test(i.name)))"),'Every pudding in the collection uses bread');
  assert.equal(run('collectionRoute()'),'pudines','Puddings have a direct route');
  run("filters.section='frutas'");assert.equal(run('filteredRecipes().length'),3,'Fruit pudding filter');
  run("filters.section='chocolate_cafe'");assert.equal(run('filteredRecipes().length'),2,'Chocolate and coffee pudding filter');
  run("currentView='pasteleria';filters.category='postres'");
  assert.match(run('collectionEntry()'),/data-view="pudines"/,'Desserts include the bread pudding collection');
}
run("language='es';selectCatalog();currentView='recetas';filters={q:'',category:'all',time:'all',sort:'recommended'}");

// A user may search in either language without changing the displayed language.
run("currentView='recetas';filters={q:'shrimp',category:'all',time:'all',sort:'recommended'};language='es';selectCatalog()");
const shrimpId=recipes.find(r=>/camarones/i.test(r.title)).id;
assert.ok(plain('filteredRecipes().map(r=>r.id)').includes(shrimpId),'English ingredient search works in Spanish UI');
run("language='en';selectCatalog();filters.q='camarones'");
assert.ok(plain('filteredRecipes().map(r=>r.id)').includes(shrimpId),'Spanish ingredient search works in English UI');
const spanishQueryEnglishUi=plain('filteredRecipes().map(r=>r.id)');
run("language='es';selectCatalog()");
assert.deepEqual(plain('filteredRecipes().map(r=>r.id)'),spanishQueryEnglishUi,'Search results do not depend on display language');

// Favorites and menu slots refer to recipe IDs, not localized titles.
run("state.favorites=['r001','r136'];state.menu={'lunes-comida':{id:'r001',servings:3},'martes-cena':{id:'r136',servings:6}};state.notes.r136='Mi nota personal';currentView='favoritos';filters={q:'',category:'all',time:'all',sort:'recommended'}");
const personalBefore=plain('({favorites:state.favorites,menu:state.menu,notes:state.notes})');
run("language='en';selectCatalog();initState()");
assert.deepEqual(plain('({favorites:state.favorites,menu:state.menu,notes:state.notes})'),personalBefore,'English selection preserves saved recipe IDs and notes');
assert.deepEqual(plain('filteredRecipes().map(r=>r.id).sort()'),['r001','r136']);
assert.equal(run("recipeMap.get('r136').title"),englishById.get('r136').title,'Display switches to translated recipe title');

// Shared ingredients still aggregate and retain their checked state across languages.
run("state.shopping=[{id:'r001',servings:3},{id:'r002',servings:8},{id:'r136',servings:6}];state.manual=[{id:'personal',name:'Mi ingrediente personal'}];state.checks={};language='es';selectCatalog()");
const spanishShopping=plain('shoppingEntries()');
const baseIngredient=recipes[0].ingredients.find(i=>i.name==='falda de res');
const matchingIngredient=recipes[1].ingredients.find(i=>i.name==='falda de res');
const sharedExpected=baseIngredient.amount*3/recipes[0].servings+matchingIngredient.amount*8/recipes[1].servings;
const sharedItem=spanishShopping.find(i=>i.name==='falda de res');
assert.ok(sharedItem,'Canonical shared ingredient exists');
assert.equal(sharedItem.amount,sharedExpected,'Quantities aggregate across recipes and serving sizes');
context.checkedKey=sharedItem.key;
run('state.checks[checkedKey]=true');
run("language='en';selectCatalog()");
const englishShopping=plain('shoppingEntries()');
const quantitiesByKey=items=>items.map(({key,amount,manual})=>({key,amount,manual})).sort((a,b)=>a.key.localeCompare(b.key));
assert.deepEqual(quantitiesByKey(englishShopping),quantitiesByKey(spanishShopping),'Language change preserves all aggregation keys and quantities');
const translatedShared=englishShopping.find(i=>i.key===sharedItem.key);
assert.equal(translatedShared.amount,sharedExpected);
assert.notEqual(translatedShared.name,sharedItem.name,'Shopping ingredient display is translated');
assert.equal(run('state.checks[checkedKey]'),true,'Checked shopping item survives English selection');
assert.equal(run('shoppingEntries().filter(i=>state.checks[i.key]).length'),1,'Checked item still resolves through canonical key');
assert.equal(englishShopping.find(i=>i.manual).name,'Mi ingrediente personal','Personal shopping text stays unchanged');
run("language='es';selectCatalog();initState();save()");
assert.deepEqual(quantitiesByKey(plain('shoppingEntries()')),quantitiesByKey(spanishShopping),'Round trip preserves shopping quantities');
assert.deepEqual(plain('({favorites:state.favorites,menu:state.menu,notes:state.notes})'),personalBefore,'Round trip preserves favorites, menu and personal notes');
assert.equal(run('state.checks[checkedKey]'),true);
assert.equal(JSON.parse(saved).checks[sharedItem.key],true,'Stable checked key persists to storage');

await validateImageRetries();
console.log('PASS: 1041 bilingual recipes; 10 category counts, complete methods and source references; English schema/IDs/amounts/timing and numeric instruction parity; UI dictionary coverage; real desktop/mobile nav rendering; locale-aware amounts; bilingual search; stable original and new favorites/menu IDs; shopping aggregation/check keys and quantities across both languages; persistence, PWA assets, bounded image recovery and escaping.');

async function validateImageRetries(){
  const source=read('dist/app.js');
  const sampledRecipes=JSON.parse(read('dist/recipes.json')).filter(r=>['r001','r003'].includes(r.id));
  const manifest=JSON.parse(read('dist/recipe-images.json'));
  const sampledImages=Object.fromEntries(sampledRecipes.map(r=>[r.id,manifest[r.id]]));
  const visuals=sampledRecipes.map(r=>({dataset:{imageRecipe:r.id,imageLayout:'card'},outerHTML:'unchanged '+r.id}));
  const timers=new Map(),probes=[];
  let timerId=0,manifestFetches=0;
  const fakeDocument={hidden:false,querySelectorAll(selector){
    const id=selector.match(/^\[data-image-recipe="(r\d+)"\]$/)?.[1];
    assert.ok(id,'Recovery must target only the failed recipe');
    return visuals.filter(node=>node.dataset.imageRecipe===id);
  }};
  class ImageProbe{constructor(){probes.push(this);}}
  const testContext=vm.createContext({
    console,structuredClone,URL,Intl,Map,Set,Date,document:fakeDocument,navigator:{onLine:true},window:{},Image:ImageProbe,
    localStorage:{getItem:()=>null,setItem(){}},
    setTimeout:(callback,delay)=>{const id=++timerId;timers.set(id,{callback,delay});return id;},
    clearTimeout:id=>timers.delete(id),
    fetch:async()=>{manifestFetches++;throw Error('A mapped-file retry must not refetch the manifest');},
    sampledRecipes,sampledImages
  });
  vm.runInContext(read('dist/i18n.js'),testContext);
  vm.runInContext(source.slice(0,source.indexOf('// Browser event bindings')),testContext);
  const execute=expression=>vm.runInContext(expression,testContext);
  execute("recipes=sampledRecipes;spanishRecipes=sampledRecipes;spanishRecipeMap=new Map(recipes.map(r=>[r.id,r]));recipeMap=new Map(spanishRecipeMap);loadRecipeImages(sampledImages);state.favorites=['r003'];state.notes.r003='Keep my note';filters.q='picadillo'");
  const personalBefore=execute('JSON.stringify({state,filters,currentView,language})');
  const tick=delay=>{
    const entry=[...timers.entries()].find(([,timer])=>timer.delay===delay);
    assert.ok(entry,'Expected retry/timeout after '+delay+' ms');
    timers.delete(entry[0]);entry[1].callback();
  };
  execute("markRecipeImageUnavailable('r003');markRecipeImageUnavailable('r003')");
  assert.equal(timers.size,1,'Duplicate image errors schedule one retry per recipe');
  assert.match(visuals[1].outerHTML,/Imagen temporalmente no disponible/);
  assert.doesNotMatch(visuals[1].outerHTML,/Imagen por añadir/,'Assigned image failure is not unfinished content');
  assert.equal(visuals[0].outerHTML,'unchanged r001','Other recipe is not rerendered');
  execute("language='en'");
  assert.match(execute("recipeVisual(recipeMap.get('r003'))"),/Image temporarily unavailable/);
  execute("language='es';delete recipeImages.r001");
  assert.match(execute("recipeVisual(recipeMap.get('r001'))"),/Imagen por añadir/,'Truly absent image remains distinct');
  execute('loadRecipeImages(sampledImages)');
  for(const delay of [3000,8000,15000]){
    tick(delay);
    const probe=probes.at(-1);
    assert.equal(probe.src,sampledImages.r003.src+'?rev='+sampledImages.r003.revision,'Only failed recipe image is requested');
    probe.onerror();
  }
  assert.equal(probes.length,3,'At most three automatic retries for a continuous failure');
  assert.equal(timers.size,0,'No unbounded retry loop after three failures');
  await execute('refreshRecipeImages()');
  assert.equal(timers.size,0,'Visibility/online refresh does not reset an exhausted retry budget');
  assert.equal(manifestFetches,0,'Complete catalog is not refetched to retry one image');
  testContext.navigator.onLine=false;
  execute("markRecipeImageUnavailable('r001')");
  assert.equal(timers.size,0,'Offline failure waits for connectivity');
  testContext.navigator.onLine=true;
  await execute('refreshRecipeImages()');
  fakeDocument.hidden=true;
  tick(3000);
  assert.equal(probes.length,3,'Hidden tab does not spend a retry attempt');
  fakeDocument.hidden=false;
  await execute('refreshRecipeImages()');
  tick(3000);
  const recovering=probes.at(-1);
  assert.equal(recovering.src,sampledImages.r001.src+'?rev='+sampledImages.r001.revision);
  recovering.onload();
  assert.match(visuals[0].outerHTML,/<img/,'Recovered file replaces only its own fallback');
  assert.match(visuals[1].outerHTML,/Imagen temporalmente no disponible/,'Other failed recipe stays unchanged');
  assert.equal(execute("unavailableImages.has('r001')"),false);
  assert.equal(timers.size,0,'Successful recovery clears its timeout');
  assert.equal(manifestFetches,0);
  assert.equal(execute('JSON.stringify({state,filters,currentView,language})'),personalBefore,'Retry and recovery preserve user data and view');
}
