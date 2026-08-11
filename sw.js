const CACHE_NAME = 'sw-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './css/materialize.min.css',
  './css/styles.css',
  './js/materialize.min.js',
  './manifest.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS);
        })
    );
});

// El evento fetch es OBLIGATORIO para que el navegador considere instalable la PWA
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});