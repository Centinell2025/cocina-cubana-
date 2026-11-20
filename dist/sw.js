'use strict';
const CACHE='cocina-cubana-1.0.2';
const FILES=['./','index.html','styles.css','app.js','recipes.json','sources.json','manifest.webmanifest',...['carnes','aves','pescados','arroces','granos_sopas','viandas_ensaladas','entrantes','pasteleria','postres','bebidas','mesa-cubana','icon'].map(name=>'assets/'+name+'.svg'),'assets/icon-192.png','assets/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('cocina-cubana-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();for(const client of await self.clients.matchAll())client.postMessage({type:'OFFLINE_READY'});})());});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE);if(request.mode==='navigate'){const root=new URL('./',self.location.href).pathname;if(url.pathname!==root&&url.pathname!==root+'index.html')return fetch(request);try{const response=await fetch(request);if(response.ok&&response.type==='basic'&&response.headers.get('content-type')?.includes('text/html'))await cache.put('index.html',response.clone());return response;}catch{return(await cache.match('index.html'))||(await cache.match('./'));}}
  const hit=await cache.match(request);if(hit)return hit;return fetch(request);
  })());
});
self.addEventListener('message',event=>{if(event.data?.type==='CHECK_CACHE')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const recipes=await cache.match('recipes.json');if(recipes)event.source?.postMessage({type:'OFFLINE_READY'});})());});
