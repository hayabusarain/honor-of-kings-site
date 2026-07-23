const CACHE_NAME = 'hok-hub-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/ja',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Skip Chrome extension resources, non-http requests, or Next.js HMR/Dev requests
  if (!url.protocol.startsWith('http')) return;
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(async (err) => {
          if (event.request.mode === 'navigate') {
            if (cachedResponse) return cachedResponse;
            const fallbackJa = await caches.match('/ja');
            if (fallbackJa) return fallbackJa;
            const fallbackRoot = await caches.match('/');
            if (fallbackRoot) return fallbackRoot;
          }
          return Response.error();
        });

      return cachedResponse || fetchPromise.then(res => res || Response.error());
    })
  );
});
