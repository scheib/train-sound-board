// See top of index.html minimal-service-worker-rule
// NOTE: Maintain this app so it always works if possible without this worker.
// The service worker is purely for offline caching and PWA installability.

const CACHE_NAME = 'train-sound-board-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192-v1.png',
  './icon-512-v1.png',
  './bell_clean.mp4',
  './horn_attack.mp4',
  './horn_release.mp4',
  './horn_sustain.mp4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
