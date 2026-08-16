// firebase-messaging-sw.js
// KitsuneChess のバックグラウンド(タブが非アクティブ・閉じている時)プッシュ通知を扱う Service Worker。
// サイトのルート (https://kitsunechess.com/firebase-messaging-sw.js) に配置してください。
//
// Service Worker は ES モジュールの import が使えない環境が多いため、
// ここでは compat 版 SDK を importScripts で読み込みます(クライアント側の match.html は modular SDK のままでOK)。

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// match.html 内の firebaseConfig と同じ内容にしてください
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
    icon: '/favicon.ico',
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
