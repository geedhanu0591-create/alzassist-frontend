// ========================
// PWA CACHE + PUSH WORKER
// ========================

const CACHE_NAME = 'alzassist-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install – cache basic app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching app shell");
      return cache.addAll(ASSETS);
    })
  );
});

// Activate – clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

// Fetch – serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});

// ---------------------------
// PUSH NOTIFICATIONS
// ---------------------------
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try { data = event.data.json(); }
    catch (e) { data = { body: event.data.text() }; }
  }

  const title = data.title || 'AlzAssist';
  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
