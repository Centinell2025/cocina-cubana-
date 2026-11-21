import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const recipes=JSON.parse(read('dist/recipes.json'));
const sources=JSON.parse(read('dist/sources.json'));
const meatCuts=JSON.parse(read('dist/meat-cuts.json'));
const heritage=JSON.parse(read('dist/heritage.json'));
const hauteCuisine=JSON.parse(read('dist/haute-cuisine.json'));
const collections=JSON.parse(read('dist/collections.json'));
const counts={carnes:70,aves:45,pescados:25,arroces:25,granos_sopas:24,viandas_ensaladas:18,entrantes:18,pasteleria:65,postres:90,bebidas:30};
assert.equal(recipes.length,410,'Exactly 410 recipes');
const recipeIds=new Set(recipes.map(r=>r.id));
assert.equal(recipeIds.size,410,'Unique IDs');
assert.equal(new Set(recipes.map(r=>r.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())).size,410,'Unique normalized recipe titles');
const sourceIds=new Set(sources.map(s=>s.id));
assert.equal(sourceIds.size,sources.length,'Unique source IDs');
const nonempty=(value,label)=>assert.ok(typeof value==='string'&&value.trim().length,label);
function referenceList(ids,known,label,{required=true}={}){
  assert.ok(Array.isArray(ids)&&(!required||ids.length>0),label+' list');
  assert.equal(new Set(ids).size,ids.length,label+' unique references');
  for(const id of ids)assert.ok(known.has(id),label+' unresolved reference '+id);
}
function checkReferences(value,path){
  if(Array.isArray(value)){value.forEach((item,i)=>checkReferences(item,path+'['+i+']'));return;}
  if(!value||typeof value!=='object')return;
  for(const[key,item]of Object.entries(value)){
    const label=path+'.'+key;
    if(['sourceIds','referenceSourceIds','safetySourceIds'].includes(key))referenceList(item,sourceIds,label,{required:false});
    else if(['recipeIds','sideIds'].includes(key))referenceList(item,recipeIds,label);
    else if(['recipeId','mainId','beverageId','dessertId'].includes(key))assert.ok(recipeIds.has(item),label+' unresolved reference '+item);
    else checkReferences(item,label);
  }
}
for(const[category,count]of Object.entries(counts))assert.equal(recipes.filter(r=>r.category===category).length,count,category);
for(const[rIndex,r]of recipes.entries()){
  assert.equal(r.id,'r'+String(rIndex+1).padStart(3,'0'));
  for(const field of ['title','category','description','difficulty','tradition','yieldUnit'])assert.ok(typeof r[field]==='string'&&r[field].length,r.id+' '+field);
  assert.ok(r.servings>0&&Number.isInteger(r.servings));
  for(const key of ['prepMinutes','cookMinutes','restMinutes'])assert.ok(Number.isFinite(r[key])&&r[key]>=0,r.id+' '+key);
  assert.ok(r.ingredients.length>=2,r.id+' ingredients');
  assert.ok(r.steps.length>=5,r.id+' full method');
  for(const i of r.ingredients){assert.ok(i.name&&i.unit);assert.ok(i.amount===null||(Number.isFinite(i.amount)&&i.amount>0),r.id+' ingredient amount');}
  for(const step of r.steps)assert.ok(typeof step==='string'&&step.length>=35,r.id+' detailed instructions');
  referenceList(r.sourceIds,sourceIds,r.id+' sources',{required:false});
  assert.ok(r.chef&&typeof r.chef==='object',r.id+' chef guidance');
  assert.ok(Array.isArray(r.chef.miseEnPlace)&&r.chef.miseEnPlace.length>=2,r.id+' mise en place');
  for(const action of r.chef.miseEnPlace)nonempty(action,r.id+' mise en place action');
  for(const field of ['technique','plating','service','culturalNote'])nonempty(r.chef[field],r.id+' chef '+field);
  assert.ok(existsSync(resolve(root,'dist/assets/'+r.category+'.svg')));
}
assert.equal(Object.keys(meatCuts).length,115,'Every meat/poultry recipe has cut metadata');
for(const r of recipes.filter(r=>['carnes','aves'].includes(r.category))){
  const m=meatCuts[r.id];assert.ok(m,r.id+' meat metadata');
  for(const field of ['type','typeLabel','cut','cutLabel'])nonempty(m[field],r.id+' meat '+field);
  assert.equal(typeof m.roast,'boolean',r.id+' roast metadata');
}
for(const id of Object.keys(meatCuts))assert.ok(recipeIds.has(id),'Meat metadata recipe '+id);
assert.equal(hauteCuisine.occasions.length,6,'Six occasion menus');
for(const menu of hauteCuisine.occasions){
  for(const field of ['name','description','pairing'])nonempty(menu[field],'Occasion '+field);
  assert.ok(recipes.some(r=>r.id===menu.beverageId&&r.category==='bebidas'),'Occasion beverage');
}
for(const s of sources){
  nonempty(s.title,'source title');nonempty(s.id,'source ID');nonempty(s.coverage,s.id+' source coverage');
  const url=new URL(s.url);assert.equal(url.protocol,'https:',s.id+' secure source URL');assert.ok(url.hostname,s.id+' source hostname');
}
for(const field of ['edition','period','intro','scope','terminology'])nonempty(heritage[field],'heritage '+field);
assert.ok(Array.isArray(heritage.roots)&&heritage.roots.length>=3,'Heritage roots');
assert.equal(new Set(heritage.roots.map(r=>r.id)).size,heritage.roots.length,'Unique heritage root IDs');
for(const r of heritage.roots){
  for(const field of ['id','name','subtitle','text','kitchen'])nonempty(r[field],'heritage root '+field);
  referenceList(r.sourceIds,sourceIds,'heritage root '+r.id+' sources');
  referenceList(r.recipeIds,recipeIds,'heritage root '+r.id+' recipes');
}
assert.ok(Array.isArray(heritage.timeline)&&heritage.timeline.length>0,'Heritage timeline');
for(const item of heritage.timeline)for(const field of ['period','title','text'])nonempty(item[field],'timeline '+field);
for(const field of ['title','text'])nonempty(heritage.connections[field],'heritage connections '+field);
referenceList(heritage.connections.sourceIds,sourceIds,'heritage connections sources');
assert.ok(Array.isArray(heritage.method)&&heritage.method.length>0,'Heritage method');
for(const item of heritage.method)nonempty(item,'heritage method entry');
for(const field of ['title','intro','status','principlesNote','menuNote'])nonempty(hauteCuisine[field],'haute cuisine '+field);
referenceList(hauteCuisine.referenceSourceIds,sourceIds,'haute cuisine references');
referenceList(hauteCuisine.safetySourceIds,sourceIds,'haute cuisine safety references');
for(const key of ['principles','workshops','menus','servicePlan'])assert.ok(Array.isArray(hauteCuisine[key])&&hauteCuisine[key].length>0,'haute cuisine '+key);
for(const p of hauteCuisine.principles)for(const key of ['title','text'])nonempty(p[key],'principle '+key);
for(const w of hauteCuisine.workshops){
  for(const key of ['title','subtitle'])nonempty(w[key],'workshop '+key);
  assert.ok(Array.isArray(w.steps)&&w.steps.length>0,'Workshop steps');
  for(const step of w.steps)nonempty(step,'workshop step');
  referenceList(w.recipeIds,recipeIds,'workshop '+w.title+' recipes');
}
assert.equal(new Set(hauteCuisine.menus.map(m=>m.id)).size,hauteCuisine.menus.length,'Unique tasting menu IDs');
for(const m of hauteCuisine.menus){
  for(const key of ['id','name','description'])nonempty(m[key],'tasting menu '+key);
  assert.ok(Array.isArray(m.courses)&&m.courses.length>0,'Tasting menu courses');
  for(const course of m.courses){
    for(const key of ['label','portion','service'])nonempty(course[key],m.id+' course '+key);
    assert.ok(recipeIds.has(course.recipeId),m.id+' unresolved course '+course.recipeId);
  }
}
for(const item of hauteCuisine.servicePlan)for(const key of ['when','action'])nonempty(item[key],'service plan '+key);
checkReferences(heritage,'heritage');checkReferences(hauteCuisine,'hauteCuisine');
assert.deepEqual(Object.keys(collections.lists).sort(),['panes','frutas','miel','almibar','melao','jugos','batidos','helados','calientes','fritos'].sort(),'Named recipe collections');
for(const[view,collection]of Object.entries(collections.lists)){
  for(const field of ['title','description'])nonempty(collection[field],view+' collection '+field);
  if(collection.groups){
    assert.ok(Array.isArray(collection.groups),view+' groups');
    assert.equal(new Set(collection.groups.map(g=>g.id)).size,collection.groups.length,view+' unique group IDs');
    for(const group of collection.groups){
      for(const field of ['id','title','description'])nonempty(group[field],view+' group '+field);
      referenceList(group.recipeIds,new Set(collection.recipeIds),view+' group '+group.id+' recipes');
    }
  }
}
assert.equal(collections.combinations.length,8,'Eight complete-meal combinations');
assert.equal(new Set(collections.combinations.map(m=>m.id)).size,8,'Unique combination IDs');
for(const meal of collections.combinations){
  for(const field of ['id','title','description','mainId','serviceTip'])nonempty(meal[field],'Combination '+field);
  assert.ok(Array.isArray(meal.sideIds)&&meal.sideIds.length>0,meal.id+' accompaniments');
  assert.ok(recipes.some(r=>r.id===meal.beverageId&&r.category==='bebidas'),meal.id+' beverage');
  if(meal.dessertId)assert.ok(recipes.some(r=>r.id===meal.dessertId&&['postres','pasteleria'].includes(r.category)),meal.id+' dessert');
}
checkReferences(collections,'collections');
const manifest=JSON.parse(read('dist/manifest.webmanifest'));
for(const i of manifest.icons)assert.ok(existsSync(resolve(root,'dist',i.src)));
for(const file of ['index.html','styles.css','app.js','sw.js','recipes.json','sources.json','heritage.json','haute-cuisine.json','meat-cuts.json','collections.json'])assert.ok(existsSync(resolve(root,'dist',file)));
const js=read('dist/app.js');
new vm.Script(js);
new vm.Script(read('dist/sw.js'));
let saved=null,fragment='';
const elements=new Map();
const document={querySelectorAll:()=>[],getElementById:id=>{
  if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',addEventListener:()=>{}});
  return elements.get(id);
}};
const context=vm.createContext({console,structuredClone,URL,Intl,setTimeout,clearTimeout,Map,Set,Date,localStorage:{getItem:()=>null,setItem:(key,value)=>saved=value},document,window:{scrollTo:()=>{}},history:{replaceState:(state,title,url)=>fragment=url},confirm:()=>true});
const eventBindings=js.indexOf('// Browser event bindings');assert.ok(eventBindings>0,'Browser initialization boundary');
vm.runInContext(js.slice(0,eventBindings),context);
context.seed=recipes;context.sourceSeed=sources;context.heritageSeed=heritage;context.hauteSeed=hauteCuisine;context.meatSeed=meatCuts;context.collectionsSeed=collections;
vm.runInContext(`recipes=seed;sources=sourceSeed;heritage=heritageSeed;hauteCuisine=hauteSeed;meatCuts=meatSeed;collections=collectionsSeed;recipes.forEach(r=>{r.searchText=norm([r.title,r.description,CATEGORIES[r.category].name,...r.ingredients.map(i=>i.name),...(r.tags||[]),r.chef?.technique||'',meatCuts[r.id]?.typeLabel||'',meatCuts[r.id]?.cutLabel||''].join(' '));recipeMap.set(r.id,r);});toast=()=>{};render=()=>{};`,context);
const run=expression=>vm.runInContext(expression,context);
assert.equal(run('filteredRecipes().length'),410);
run("filters.q='ROPA VIEJA'");assert.equal(run('filteredRecipes()[0].id'),'r001');
run("filters.q='limón'");const withAccent=run('filteredRecipes().map(r=>r.id).join()');run("filters.q='limon'");assert.equal(run('filteredRecipes().map(r=>r.id).join()'),withAccent);
run("filters.q='';filters.time='30'");assert.ok(run('filteredRecipes().length')>0);assert.ok(run('filteredRecipes().every(r=>total(r)<=30)'));
run("navigate('pasteleria')");assert.equal(fragment,'#pasteleria');assert.equal(run('filteredRecipes().length'),65);
run("navigate('postres')");assert.equal(fragment,'#postres');assert.equal(run('currentView'),'postres');assert.equal(run('filters.category'),'postres');assert.equal(run('filteredRecipes().length'),90);
assert.ok(run("filteredRecipes().every(r=>r.category==='postres')"));
run("currentView='favoritos';state.favorites=['r136'];filters.category='all'");assert.equal(run('filteredRecipes().length'),1);
run("currentView='menu';state.menu={'lunes-comida':{id:'r001',servings:3},'martes-cena':{id:'r001',servings:6}};menuToShopping()");assert.equal(run('state.shopping.length'),1);assert.equal(run('state.shopping[0].servings'),9);
const expected=recipes[0].ingredients.find(i=>i.name==='falda de res').amount*1.5;
assert.equal(run("shoppingEntries().find(i=>i.name==='falda de res').amount"),expected);
run("state.menu={'lunes-comida':{id:'r002',servings:4}};menuToShopping()");assert.equal(run('state.shopping.length'),1);assert.equal(run('state.shopping[0].id'),'r002');
run("addShopping('r002',8);addShopping('r002',8)");assert.equal(run('state.shopping.length'),1);assert.equal(run('state.shopping[0].servings'),8);
run("state.notes.r001='<img src=x onerror=alert(1)>';save()");assert.ok(JSON.parse(saved).notes.r001.includes('<img'));
assert.equal(run("esc(state.notes.r001)"),'&lt;img src=x onerror=alert(1)&gt;');
for(const[view,count]of Object.entries({jugos:23,batidos:4,helados:12,panes:8,miel:6,fritos:12})){
  run('navigate('+JSON.stringify(view)+')');assert.equal(fragment,'#'+view);assert.equal(run('filteredRecipes().length'),count,view+' collection count');
  if(view==='jugos')assert.equal(run('filteredRecipes()[0].id'),'r301');
  if(view==='panes')for(const id of ['r401','r404'])assert.ok(run('filteredRecipes().some(r=>r.id==='+JSON.stringify(id)+')'),'Bread collection includes '+id);
  if(view==='miel')assert.ok(!run("filteredRecipes().some(r=>r.id==='r410')"),'Grosella in sugar syrup is not a honey recipe');
}
run("filters.group='maduros'");assert.equal(run('filteredRecipes().map(r=>r.id).join()'),'r109','Ripe plantain group');
run("navigate('almibar')");assert.ok(run("filteredRecipes().some(r=>r.id==='r410')"),'Grosella belongs in syrup collection');
run("navigate('carnes')");assert.equal(run('filteredRecipes().length'),115);
run("filters.meat='cerdo';filters.cut='solomillo'");
assert.ok(run("filteredRecipes().some(r=>r.id==='r272')"),'Known pork fillet is found');
assert.ok(run("filteredRecipes().every(r=>meatCuts[r.id].type==='cerdo'&&meatCuts[r.id].cut==='solomillo')"),'Meat and cut filters combine');
assert.ok(!run("filteredRecipes().some(r=>r.id==='r001')"),'Beef is excluded by pork filter');
run("navigate('asados')");assert.equal(run('filteredRecipes().length'),71,'Roast collection');
assert.ok(run("filteredRecipes().every(r=>['carnes','aves'].includes(r.category)&&isRoast(r))"),'Roast collection contains only classified meats');
assert.ok(!run("filteredRecipes().some(r=>r.id==='r001')"),'A stew is excluded from oven and grill roasts');
run("navigate('carnes');filters.meat='cerdo';filters.cut='all'");
const cutControls=run('meatFilterControls()');assert.ok(cutControls.includes('Solomillo')&&!cutControls.includes('Pechuga'),'Dependent cut options follow the selected meat');
assert.ok(run("card(recipeMap.get('r272'))").includes('Cerdo · Solomillo'),'Recipe card displays meat and cut');
run("navigate('cultura');renderHeritage()");assert.equal(fragment,'#cultura');
let rendered=document.getElementById('main').innerHTML;
for(const r of heritage.roots)for(const id of r.recipeIds)assert.ok(rendered.includes('data-recipe="'+id+'"'),'Rendered heritage recipe '+id);
assert.ok(rendered.includes(heritage.period),'Rendered heritage period');
run("navigate('altacocina');renderHauteCuisine()");assert.equal(fragment,'#altacocina');
rendered=document.getElementById('main').innerHTML;
for(const menu of hauteCuisine.menus)for(const course of menu.courses)assert.ok(rendered.includes('data-recipe="'+course.recipeId+'"'),'Rendered tasting recipe '+course.recipeId);
for(const id of [...hauteCuisine.referenceSourceIds,...hauteCuisine.safetySourceIds]){
  context.sourceURL=sources.find(s=>s.id===id).url;
  assert.ok(rendered.includes(run('esc(sourceURL)')),'Rendered haute cuisine source '+id);
}
run("navigate('completas');renderCombinations()");assert.equal(fragment,'#completas');
rendered=document.getElementById('main').innerHTML;
assert.equal((rendered.match(/class="combination-card"/g)||[]).length,8,'Eight rendered combination cards');
for(const meal of collections.combinations)for(const id of [meal.mainId,...meal.sideIds,meal.beverageId,...(meal.dessertId?[meal.dessertId]:[])])assert.ok(rendered.includes('data-recipe="'+id+'"'),'Rendered combination recipe '+id);
const chef=recipes.find(r=>r.id==='r238').chef;
context.chefText=chef.technique;const panel=run("chefPanel(recipeMap.get('r238'))");
assert.ok(panel.includes(run('esc(chefText)')),'Recipe chef technique is rendered');
assert.ok(panel.includes('data-view="altacocina"'),'Recipe links to chef workshop route');
assert.ok(run("chefPanel({...recipeMap.get('r238'),chef:{...recipeMap.get('r238').chef,plating:'<img src=x onerror=alert(1)>'}})").includes('&lt;img src=x onerror=alert(1)&gt;'),'Chef content is escaped');
run("navigate('mamiferos')");assert.equal(run('filteredRecipes().length'),70,'Mammal recipes');
assert.equal(run("filteredRecipes()[0]&&meatCuts[filteredRecipes()[0].id].type"),'res','Mammals begin with beef');
run("filters.size='pequeno'");assert.equal(run('filteredRecipes().length'),2,'Small mammals are rabbits in this edition');
assert.ok(run("filteredRecipes().every(r=>meatCuts[r.id].type==='conejo')"),'Rabbit group is separate from birds');
run("navigate('aves')");assert.equal(run('filteredRecipes().length'),45,'Poultry recipes');
run("navigate('mamiferos');filters.quality='tierno'");assert.ok(run('filteredRecipes().length')>0,'Tender cuts exist');
assert.ok(run("filteredRecipes().every(r=>meatCuts[r.id].quality==='tierno')"),'Culinary cut filter');
console.log('PASS: 410 recipes, 10 category counts, unique titles/IDs, complete ingredients/steps and chef guidance, '+sources.length+' unique sources, 10 recipe collections and 8 complete-meal combinations, resolved heritage/haute-cuisine/collection references, PWA assets, syntax, search, accents, time filter, collection/meat/roast/culture/chef routes and combined meat/cut and fried-group filtering, rendered editorial and combination links, favorites, menu totals, shopping replacement/deduplication, persistence and escaping.');
