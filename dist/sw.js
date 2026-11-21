'use strict';
const VERSION='1.13.1';
const CACHE='cocina-cubana-'+VERSION+'-android-prep-1';
const versioned=name=>name+'?v='+VERSION;
const FILES=['./','index.html','android-bridge.js?v=1.0.0','android-adapter.js?v=1.0.0',...['styles.css','i18n.js','app.js','recipes.json','recipes.en.json','recipe-images.json','sources.json','manifest.webmanifest'].map(versioned),'assets/mesa-cubana-3d.png','assets/icon.svg','assets/icon-192.png','assets/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);await cache.addAll(FILES);
  const response=await cache.match(versioned('recipe-images.json'));
  const images=await response.json();
  const paths=Object.entries(images).filter(([id,image])=>image.src===`assets/recipes/${id}-3d.webp`).map(([,image])=>image.src+(/^[a-f0-9]{12}$/.test(image.revision||'')?'?rev='+image.revision:''));
  const uniquePaths=[...new Set(paths)];
  // Download the complete image collection in bounded groups for offline use.
  for(let index=0;index<uniquePaths.length;index+=12){
    await cache.addAll(uniquePaths.slice(index,index+12));
  }
  await self.skipWaiting();
})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('cocina-cubana-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();for(const client of await self.clients.matchAll())client.postMessage({type:'OFFLINE_READY'});})());});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE);if(request.mode==='navigate'){const root=new URL('./',self.location.href).pathname;if(url.pathname!==root&&url.pathname!==root+'index.html')return fetch(request);try{const response=await fetch(request);if(response.ok&&response.type==='basic'&&response.headers.get('content-type')?.includes('text/html'))await cache.put('index.html',response.clone());return response;}catch{return(await cache.match('index.html'))||(await cache.match('./'));}}
  const hit=await cache.match(request);if(hit)return hit;return fetch(request);
  })());
});
self.addEventListener('message',event=>{if(event.data?.type==='CHECK_CACHE')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const recipes=await cache.match(versioned('recipes.json'));if(recipes&&await cache.match(versioned('recipes.en.json')))event.source?.postMessage({type:'OFFLINE_READY'});})());});
