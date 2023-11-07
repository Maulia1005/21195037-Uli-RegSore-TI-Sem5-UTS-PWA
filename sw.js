const cacheName = "Maulia_Nursidik_cache";


const preCache = ["/", 
"/.vscode/settings.json",
"/assets/css/style.css",
"/assets/img/favicon.jpg",
"/assets/img/about.jpg",
"/assets/img/apple-touch-icon.png",
"/assets/img/hero-bg.png",
"/assets/img/maulianursidik.jpg",
"/assets/img/senang.png",
"/assets/img/sedih.png",
"/js/main.js",
"/scss/Readme.txt",
"/vendor",
"/forms/contact.php",
"/icons/javascript.png",
"/icons/javascript2.png",
"/about",
"/contact.html",
"/index.html",
"/manifest.json",
"/portfolio-details.html",
"/portfolio.html",
"/script.js",
"/services.html",
"/sw.js",
 ];

self.addEventListener("install", (e) => {
  console.log("Service worker terinstal");

  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      cache.addAll(preCache);
    })()
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const request = e.request;

      // Periksa skema permintaan
      if (request.url.startsWith(self.location.origin)) {
        // Skema permintaan yang didukung
        const cache = await caches.open(cacheName);
        const resCache = await cache.match(request);

        if (resCache) return resCache;

        try {
          const res = await fetch(request);
          cache.put(request, res.clone());
          return res;
        } catch (error) {
          console.error("Gagal melakukan fetch:", error);
        }
      } else {
        // Skema permintaan bukan 'chrome-extension', biarkan permintaan berlangsung normal
        return fetch(request);
      }
    })()
  );
});


// Tambahkan kode untuk menangani notifikasi push
self.addEventListener('push', function(event) {
  if (self.Notification.permission === 'granted') {
    // Izin notifikasi telah diberikan, Anda dapat menampilkan pemberitahuan
    const options = {
      body: 'Dengan 400rb Anda bisa punya Website, Apakah Anda ingin memesan jasa pembuatan Website di Inori Digital?',
      icon: '/assets/img/maulianursidik.jpg',
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
      body: 'Bisa Chat pada nomor WhatsApp 0895358195740',
      icon: '/assets/img/senang.png'
    });
  } else if (event.action === 'no') {
    // Tindakan "Tidak" diambil
    // Menampilkan notifikasi dengan ucapan "Anda memilih Tidak"
    self.registration.showNotification('Sayang Sekali', {
      body: 'Anda melewatkan kesempatan ini',
      icon: '/assets/img/sedih.png'
    });
  } else {
    // Notifikasi di-klik tanpa memilih tindakan apa pun
    // Lakukan sesuatu ketika notifikasi di-klik tanpa memilih "Ya" atau "Tidak"
    console.log('Anda mengklik notifikasi');
  }
});
