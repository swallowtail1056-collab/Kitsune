// match-sw.js
// KitsuneChess の対局ページ用 Service Worker。
// 元々あったオフラインキャッシュ機能に加えて、プッシュ通知(FCM)のバックグラウンド受信も
// この1つのファイルで扱います(スコープの衝突を避けるため、別ファイルに分けず統合しています)。

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

// ── ここからプッシュ通知(FCM)関連 ──
// Service Worker内ではESモジュールのimportが使えないため、compat版SDKをimportScriptsで読み込む
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// match.html 内の firebaseConfig と同じ内容
firebase.initializeApp({
  apiKey: "AIzaSyDR6vsVq2uePiFRUmoqYB4LjdGZJiRM4eE",
  authDomain: "kitsunechess-multiplayer.firebaseapp.com",
  databaseURL: "https://kitsunechess-multiplayer-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kitsunechess-multiplayer",
  storageBucket: "kitsunechess-multiplayer.firebasestorage.app",
  messagingSenderId: "1025643200128",
  appId: "1:1025643200128:web:cf333443c75742ea127065",
  measurementId: "G-HPDM5LPV3P"
});

const messaging = firebase.messaging();

// バックグラウンド(タブが非表示・閉じている)時に届いた通知を表示する
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'KitsuneChess';
  const body = (payload.notification && payload.notification.body) || '';
  const link = (payload.data && payload.data.link) || '/match.html';

  self.registration.showNotification(title, {
    body: body,
    icon: '/match_icon_192.png',
    data: { link: link }
  });
});

// 通知をクリックしたら該当ページを開く(既に開いているタブがあればそこにフォーカス)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || '/match.html';
  const targetUrl = new URL(link, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
