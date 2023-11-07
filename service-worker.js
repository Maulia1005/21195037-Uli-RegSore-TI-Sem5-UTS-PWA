const cacheName = "adhita-pwa-v1";

const filesToCache = [
  "/",
  "/index.html",
  "/tailwind.config.js",
  "/service-worker.js",
  "/output.css",
  "/package-lock.json",
  "/package.json",
  "/assets/css/final.css",
  "/assets/js/script.js",
  "/manifest.json",
  "/assets/img/Pas_Foto_terbaru-removebg-preview.png",
  "/assets/img/Pas_Foto_terbaru-removebg-preview1.png",
  '/assets/img/android-chrome-512x512.png',
  '/assets/img/favicon-192.png',
  '/assets/img/favicon-256.png',
  '/assets/img/favicon-384.png',
  "/assets/src/input.css",
];

// Instalasi Service Worker
self.addEventListener('install', evt => {
  evt.waitUntil(
      caches.open(cacheName).then(function(cache) {
          return cache.addAll(filesToCache);
      })
  );
});

// Aktivasi Service Worker
self.addEventListener('activate', evt => {

});

// Fetching sumber daya dari cache atau jaringan
// self.addEventListener('fetch', evt => {
//     evt.respondWith(
//         caches.match(evt.request).then(cacheRes => {
//             // Menggunakan sumber daya dari cache jika ada
//             return cacheRes || fetch(evt.request);
//         })
//     );
// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Data berhasil diambil dari jaringan, cache data tersebut
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open('my-cache').then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        // Jika gagal mengambil data dari jaringan, coba ambil dari cache
        return caches.match(event.request);
 })
);
});

self.addEventListener('push', function(event) {
  if (self.Notification.permission === 'granted') {
    // Izin notifikasi telah diberikan, Anda dapat menampilkan pemberitahuan
    const options = {
      body: 'Apakah bapak mau memberi nilai "A" kepada saya??',
      icon: '/img/icon-96x96.png',
      actions: [
        { action: 'yes', title: 'Ya' },
        { action: 'no', title: 'Tidak' }
      ],
      data: {
        senderId: '12345',
        messageId: '67890'
      },
      silent: true,
      timestamp: Date.now()
    };
    

    event.waitUntil(
      self.registration.showNotification('Notifikasi', options)
    );
  } else {
    // Izin notifikasi tidak diberikan
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'yes') {
    // Tindakan "Ya" diambil
    // Menampilkan notifikasi dengan ucapan "Anda memilih Ya"
    self.registration.showNotification('Terimakasih', {
      body: 'Terimakasih Bapak sudah baik, memberi nilai yang bagus kepada saya',
      icon: '/img/happy.png'
    });
  } else if (event.action === 'no') {
    // Tindakan "Tidak" diambil
    // Menampilkan notifikasi dengan ucapan "Anda memilih Tidak"
    self.registration.showNotification('Duhhh pak pak', {
      body: 'Gak papa wis...',
      icon: '/img/sad.png'
    });
  } else {
    // Notifikasi di-klik tanpa memilih tindakan apa pun
    // Lakukan sesuatu ketika notifikasi di-klik tanpa memilih "Ya" atau "Tidak"
    console.log('Anda mengklik notifikasi');
  }
});