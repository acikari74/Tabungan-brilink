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
// Sengaja baca dari payload.data (bukan payload.notification) — supaya
// browser TIDAK ikut menampilkan notifikasi otomatis sendiri di luar kendali
// kita, yang tadinya menyebabkan notifikasi muncul dobel.
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  // PENTING: return promise-nya, supaya sistem browser menunggu sampai
  // notifikasi kita benar-benar tampil. Kalau tidak di-return, browser bisa
  // menganggap "belum ada notifikasi ditampilkan" dan menampilkan notifikasi
  // cadangan sendiri yang kosong tanpa judul/keterangan.
  return self.registration.showNotification(d.title || 'Pasti Punya', {
    body: d.body || '',
    icon: d.icon || 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: 'pasti-punya-notif',
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
