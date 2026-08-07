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

// Paksa versi baru service worker ini langsung aktif menggantikan versi lama
// yang mungkin masih "nyangkut" di HP nasabah.
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(clients.claim()); });

// Kita KONTROL PENUH tampilan notifikasinya secara manual di sini (bukan
// mengandalkan auto-display bawaan browser yang ternyata tidak selalu
// konsisten di semua device). Server mengirim payload "data" saja supaya
// browser tidak ikut coba menampilkan otomatis dari jalur lain.
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  return self.registration.showNotification(d.title || 'Pasti Punya', {
    body: d.body || '',
    icon: d.icon || 'icons/icon-192.png',
    badge: 'icons/icon-badge.png',
    tag: 'pasti-punya-notif',
    renotify: true,
    data: { link: d.link || './nasabah.html' },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || './nasabah.html';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('nasabah.html') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(link);
    })
  );
});
