// match-sw.js
// KitsuneChess の対局ページ用 Service Worker。
// 元々あったオフラインキャッシュ機能に加えて、プッシュ通知(FCM)のバックグラウンド受信も
// この1つのファイルで扱います(スコープの衝突を避けるため、別ファイルに分けず統合しています)。
//
// 【v3での変更点】
// ・他サイト宛(Google広告/Firebaseなど)の通信と、GET以外の通信は Service Worker で触らず素通しにする
//   (Googleのセキュリティ報告通信を横取りして失敗するエラーの対策)
// ・HTMLのキャッシュ対象を対戦ページ(/match.html, /match)だけにする(練習ページには触らない)
// ・正常なレスポンス(response.ok)だけをキャッシュする
// ・キャッシュ名をv3に変更して、古いキャッシュを自動削除する
const CACHE_NAME = 'kitsunechess-match-v3';
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
  const req = event.request;

  // GET以外(POSTなど)は触らない
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 他サイト宛(Google広告・Firebase・gstaticなど)は触らず、ブラウザにそのまま任せる
  if (url.origin !== self.location.origin) return;

  // 対戦ページのHTML: ネット優先、失敗したときだけキャッシュを使う
  const isMatchPage = url.pathname === '/match.html' || url.pathname === '/match';
  if (isMatchPage) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return response;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 事前キャッシュしたアイコン画像だけ、キャッシュ優先で返す
  if (CORE_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
    return;
  }

  // それ以外(練習ページなど)は何もせず、通常どおりブラウザに任せる
});
// ── ここからプッシュ通知(FCM)関連 ──
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
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
