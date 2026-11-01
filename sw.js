// Guarda la app para usarla sin conexión. build.py pone la versión en el nombre de la caché.
var CACHE = 'guia-2.5', IMG = 'guia-img';
var FILES = ['./', './index.html', './guia.html', './viajes.html', './app.js', './styles.css', './viajes.js', './album.js', './album.css', './motor.js', './asistente.js', './mapa.js', './mundo.js', './lang.js', './manifest.webmanifest',
  './icon-180.png', './icon-192.png', './icon-512.png', './trips/index.json'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== IMG; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function fromCache(cacheName, req, key) {
  return caches.match(key || req, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      if (res.ok || res.type === 'opaque') { var copy = res.clone(); caches.open(cacheName).then(function (c) { c.put(key || req, copy); }); }
      return res;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return;
  var u = new URL(req.url);
  if (u.origin === self.location.origin) {
    // la guía y los viajes, desde la caché; las páginas, por su nombre sin parámetros
    var key = req.mode === 'navigate' ? (/guia\.html$/.test(u.pathname) ? './guia.html' : /viajes\.html$/.test(u.pathname) ? './viajes.html' : './index.html') : null;
    e.respondWith(fromCache(CACHE, req, key));
  } else if (/(^|\.)(wikimedia\.org|arcgisonline\.com|jsdelivr\.net)$/.test(u.hostname)) {
    // fotos, mapa y atlas de países: se guardan al verlos para tenerlos sin conexión
    e.respondWith(fromCache(IMG, req));
  }
  // el resto (tiempo, mapas, búsquedas): a la red
});
