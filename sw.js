// Guarda la app para usarla sin conexión. build.py pone la versión en el nombre de la caché.
var CACHE = 'guia-3.17', IMG = 'guia-img';
var FILES = ['./', './index.html', './guia.html', './viajes.html', './app.js', './styles.css', './viajes.js', './album.js', './album.css', './motor.js', './asistente.js', './personajes.js', './mapa.js', './mundo.js', './juego.js', './lang.js', './manifest.webmanifest',
  './icon-180.png', './icon-192.png', './icon-512.png', './trips/index.json'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== IMG; }).map(function (k) { return caches.delete(k); }));
  }).then(function () {
    // fuera las consultas a la API de Wikimedia que se guardaron antes por error (todas respondían con la primera)
    return caches.open(IMG).then(function (c) { return c.keys().then(function (ks) { return Promise.all(ks.filter(function (r) { return /\/w\/api\.php/.test(r.url); }).map(function (r) { return c.delete(r); })); }); });
  }).then(function () { return self.clients.claim(); }));
});

// exact: fuera de la app, la dirección entera cuenta (dos fotos pueden diferir solo en los parámetros)
function fromCache(cacheName, req, key, exact) {
  return caches.match(key || req, { ignoreSearch: !exact }).then(function (hit) {
    // lo guardado sin permiso de lectura no vale para quien lo pide con él (vídeo de la ruta): se vuelve a pedir
    if (hit && !(req.mode === 'cors' && hit.type === 'opaque')) return hit;
    return fetch(req).then(function (res) {
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
  } else if (/(^|\.)(wikimedia\.org|arcgisonline\.com|jsdelivr\.net)$/.test(u.hostname) && !/\/w\/api\.php/.test(u.pathname)) {
    // fotos, mapa y atlas de países: se guardan al verlos para tenerlos sin conexión (las consultas a la API, no: van a la red)
    e.respondWith(fromCache(IMG, req, null, true));
  }
  // el resto (tiempo, mapas, búsquedas): a la red
});
