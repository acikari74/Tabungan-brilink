importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBVD_JxRan2imOtcWCxc78_2zHvb1uY_UA",
  authDomain: "buku-tabungan-d91d3.firebaseapp.com",
  projectId: "buku-tabungan-d91d3",
  storageBucket: "buku-tabungan-d91d3.firebasestorage.app",
  messagingSenderId: "259351197970",
  appId: "1:259351197970:web:468eee581958e5f74f1bcb"
});

const messaging = firebase.messaging();

// Ditangani otomatis oleh Firebase Messaging SDK saat app benar-benar
// tertutup/di-background: notifikasi tetap muncul di HP seperti WhatsApp.
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Pasti Punya', {
    body: n.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('nasabah.html') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./nasabah.html');
    })
  );
});
