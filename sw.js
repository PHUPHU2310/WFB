/* WFB Service Worker â€” v2 */
const CACHE_NAME = 'wfb-cache-v2';
const OFFLINE_URL = './index.html';

const STATIC_ASSETS = [
  './',
  './index.html',
  './login.html',
  './app.js',
  './style.css',
  './manifest.json',
  './icon.svg',
];

const CDN_PREFIXES = [
  'https://cdn.jsdelivr.net/',
  'https://unpkg.com/',
  'https://cdnjs.cloudflare.com/',
];

function isCDN(url) {
  return CDN_PREFIXES.some(function (p) { return url.startsWith(p); });
}

function isSameOrigin(url) {
  return url.startsWith(self.location.origin);
}

/* ---- INSTALL: cache all assets ---- */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS).then(function () {
        var cdnAssets = [
          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
          'https://cdn.jsdelivr.net/npm/chart.js',
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        ];
        return Promise.allSettled(
          cdnAssets.map(function (url) {
            return cache.add(url).catch(function (err) {
              console.warn('[SW] Could not cache:', url, err);
            });
          })
        );
      });
    })
  );
  self.skipWaiting();
});

/* ---- ACTIVATE: remove old caches ---- */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ---- FETCH: cache-first for same-origin, network-first for CDN ---- */
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  if (isSameOrigin(req.url)) {
    // Network-first for same-origin: always get latest, fall back to cache
    event.respondWith(
      fetch(req).then(function (response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, clone); });
        }
        return response;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match('./index.html');
        });
      })
    );
  } else if (isCDN(req.url)) {
    // Network-first for CDN, fall back to cache
    event.respondWith(
      fetch(req).then(function (response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, clone); });
        }
        return response;
      }).catch(function () {
        return caches.match(req);
      })
    );
  }
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

