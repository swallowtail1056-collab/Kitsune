// firebase-messaging-sw.js
// バックグラウンド(アプリを閉じている/裏で開いていない)状態でのプッシュ通知を処理するservice worker
// リポジトリのルート(match.htmlと同じ階層)に配置してください

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
  const title = (payload.notification && payload.notification.title) || '🦊 KitsuneChess';
  const body = (payload.notification && payload.notification.body) || '';
  const options = {
    body: body,
    icon: '/jene_welcome.png',
    badge: '/jene_welcome.png',
    data: { url: (payload.data && payload.data.url) || 'https://kitsunechess.com/match.html' }
  };
  self.registration.showNotification(title, options);
});

// 通知タップで対局画面を開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || 'https://kitsunechess.com/match.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('match.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
