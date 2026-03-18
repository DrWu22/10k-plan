// ─── 10K Training Plan — Service Worker ───────────────────────────
// Caches the app shell so it loads offline after the first visit.
// Bump the CACHE version string any time you update the HTML to
// force clients to fetch the latest files.

const CACHE = 'training-plan-v1';

const ASSETS = [
  './10k-training-plan.html',
  './manifest.json'
];

// Install: cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
