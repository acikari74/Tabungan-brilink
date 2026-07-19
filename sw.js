const CACHE_NAME = 'tabungan-nasabah-v1';
const CORE_ASSETS = ['./nasabah.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first untuk data (biar saldo selalu terbaru), cache-first untuk file statis
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  if(url.origin !== location.origin){ return; } // biarkan request Firebase lewat apa adanya
  e.respondWith(
    fetch(e.request).then(res=>{
      const resClone = res.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(e.request, resClone));
      return res;
    }).catch(()=>caches.match(e.request))
  );
});
