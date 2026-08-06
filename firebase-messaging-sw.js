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
// yang mungkin masih "nyangkut" di HP nasabah — supaya perbaikan kode selalu
// langsung kepakai tanpa nasabah perlu uninstall/hapus data segala.
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(clients.claim()); });

// Sengaja TIDAK pakai messaging.onBackgroundMessage() di sini. Karena pesan
// dari server sudah menyertakan field "notification", Firebase Messaging SDK
// SUDAH OTOMATIS menampilkan notifikasinya sendiri saat app di-background —
// tanpa perlu kode tambahan. Kalau kita juga menampilkan manual di sini,
// notifikasinya jadi muncul DOBEL. Ini pola paling stabil untuk web push.

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
