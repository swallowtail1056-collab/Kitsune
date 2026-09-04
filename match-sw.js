importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDR6vsVq2uePiFRUmoqYB4LjdGZJiRM4eE",
  authDomain: "kitsunechess-multiplayer.firebaseapp.com",
  projectId: "kitsunechess-multiplayer",
  storageBucket: "kitsunechess-multiplayer.firebasestorage.app",
  messagingSenderId: "1025643200128",
  appId: "1:1025643200128:web:cf333443c75742ea127065"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || '🦊 KitsuneChess';
  const body = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(title, {
    body: body,
    icon: '/jene_welcome.png'
  });
});

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
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
