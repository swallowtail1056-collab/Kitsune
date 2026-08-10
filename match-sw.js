const CACHE_NAME = 'kitsunechess-match-v2';
const CORE_ASSETS = [
  '/match_icon_192.png',
  '/match_icon_512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const isHTML = event.request.mode === 'navigate' ||
                 event.request.destination === 'document' ||
                 event.request.url.endsWith('/match.html');

  if (isHTML) {
    // Always try the network first so updates to match.html show up immediately.
    // Only falls back to a cached copy if the network is unreachable (offline).
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets (icons etc.) can safely be served cache-first.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
