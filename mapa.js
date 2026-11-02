/* ===== Mapa del viaje =====
   Un mapa propio en <canvas>, sin librerías. De fondo, un mapa real sin rótulos (baldosas Canvas de Esri, sin clave);
   debajo, por si no hay conexión, una silueta lisa de la tierra (Natural Earth, dominio público, vía world-atlas).
   Encima, la ruta de un color por día, burbujas con la foto de cada sitio y los nombres de las ciudades.
   Empieza con el viaje entero. Al mover el slider o reproducir, la cámara entra en la ciudad del día, se aleja en cada
   viaje a otro sitio (avión en arco, coche en puntitos, tren como una vía, a pie…) y vuelve a entrar en la siguiente.
   Al llegar a un sitio se despliegan su foto y su descripción.
   Mapa.mount(el, { days, land, title, id, mode, photos, dayLabel, heading, lang, cities }); cada día puede llevar `date` */
window.Mapa = (function () {
  'use strict';
  var BALL = '#14161b';   // el punto actual: distinto de los colores de los días
  var COLORS = ['#d9622b', '#2b6ea3', '#3f8f5b', '#9b4fa8', '#c2962a', '#c0394b', '#1f8a8a', '#6b7fb3', '#8a5a2b', '#444c5e'];
  var ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function kmBetween(a, b) {
    var r = Math.PI / 180, x = (b.lon - a.lon) * r * Math.cos((a.lat + b.lat) / 2 * r), y = (b.lat - a.lat) * r;
    return Math.sqrt(x * x + y * y) * 6371;
  }

  /* ---------- Qué sale en el mapa ---------- */
  function isSight(it) { return !!it && ['visit', 'walk', 'view', 'tour', 'night'].indexOf(it.t) >= 0 && !it.hidden && !it.hole && it.lat != null && !/aeropuerto|airport/i.test(it.ti); }
  // la ruta va de principio a fin: también el aeropuerto de llegada y el de salida, aunque no lleven dibujo
  function isStop(it) { return isSight(it) || (!!it && it.lat != null && !it.hidden && /aeropuerto|airport|^llegada/i.test(it.ti)); }
  function fromTrip(trip) { return trip.days.map(function (d) { return { title: d.title, jump: d.items.some(function (i) { return i.jump; }), stops: d.items.filter(isStop) }; }); }

  // Special:FilePath de Wikimedia no deja leer la imagen desde la página: se pide su dirección directa, que sí
  function corsUrl(src, w) {
    var m = /commons\.wikimedia\.org\/wiki\/Special:FilePath\/([^?]+)/.exec(src);
    if (!m) return Promise.resolve(src);
    return fetch('https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&iiurlwidth=' + (w || 330) + '&titles=File:' + m[1])
      .then(function (r) { return r.json(); }).then(function (j) {
        var pg = j.query.pages, i = pg[Object.keys(pg)[0]].imageinfo[0];
        return i.thumburl || i.url;
      });
  }
  // la dirección de la foto de un sitio: en la web, una dirección; en el HTML único, la clase con la foto incrustada
  function photoOf(s, photos) {
    if (!s.ph) return '';
    if (photos && photos[s.ph]) return new URL(photos[s.ph], location.href).href;
    var d = document.createElement('i'); d.className = 'ph-' + s.ph; d.style.display = 'none'; document.body.appendChild(d);
    var u = getComputedStyle(d).backgroundImage || ''; d.remove();
    var m = /^url\(["']?([\s\S]*?)["']?\)$/.exec(u); return m ? m[1] : '';
  }

  /* ---------- Silueta de la tierra: solo si el viaje es lo bastante grande para que se vea ---------- */
  var atlasP = null;
  function atlas() {
    if (!atlasP) atlasP = fetch(ATLAS).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(function (e) { atlasP = null; throw e; });
    return atlasP;
  }
  function boundsOf(pts) {
    var b = { s: 90, n: -90, w: 180, e: -180 };
    pts.forEach(function (p) { b.s = Math.min(b.s, p.lat); b.n = Math.max(b.n, p.lat); b.w = Math.min(b.w, p.lon); b.e = Math.max(b.e, p.lon); });
    return b;
  }
  function simplify(pts, tol) {
    if (pts.length < 4) return pts;
    var keep = new Uint8Array(pts.length), st = [[0, pts.length - 1]]; keep[0] = keep[pts.length - 1] = 1;
    while (st.length) {
      var seg = st.pop(), a = pts[seg[0]], b = pts[seg[1]], md = 0, mi = -1, dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy;
      for (var i = seg[0] + 1; i < seg[1]; i++) {
        var t = l ? clamp(((pts[i][0] - a[0]) * dx + (pts[i][1] - a[1]) * dy) / l, 0, 1) : 0, ex = pts[i][0] - a[0] - t * dx, ey = pts[i][1] - a[1] - t * dy, d = ex * ex + ey * ey;
        if (d > md) { md = d; mi = i; }
      }
      if (mi >= 0 && md > tol * tol) { keep[mi] = 1; st.push([seg[0], mi], [mi, seg[1]]); }
    }
    return pts.filter(function (_, i) { return keep[i]; });
  }
  // polígonos de países que caen cerca del viaje, ya simplificados
  function landFor(days) {
    var pts = []; days.forEach(function (d) { d.stops.forEach(function (s) { pts.push(s); }); });
    if (!pts.length) return Promise.resolve(null);
    var b = boundsOf(pts), span = Math.max(kmBetween({ lat: b.s, lon: b.w }, { lat: b.n, lon: b.w }), kmBetween({ lat: b.s, lon: b.w }, { lat: b.s, lon: b.e }));
    if (span < 60) return Promise.resolve(null);   // dentro de una ciudad esta silueta no aporta
    var mx = Math.max(b.n - b.s, b.e - b.w), pad = mx * 0.6 + 0.3, tol = mx / 160;
    return atlas().then(function (T) {
      var sc = T.transform.scale, tr = T.transform.translate, arcs = T.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (p) { x += p[0]; y += p[1]; return [x * sc[0] + tr[0], y * sc[1] + tr[1]]; }); }), out = [];
      function ring(r) { var c = []; r.forEach(function (ix, k) { var a = ix >= 0 ? arcs[ix] : arcs[~ix].slice().reverse(); a.forEach(function (p, j) { if (j || !k) c.push(p); }); }); return c; }
      T.objects.countries.geometries.forEach(function (g) {
        (g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []).forEach(function (poly) {
          var c = ring(poly[0]);
          if (!c.some(function (p) { return p[1] > b.s - pad && p[1] < b.n + pad && p[0] > b.w - pad && p[0] < b.e + pad; })) return;
          var s = simplify(c, tol); if (s.length < 4) return;
          out.push(s.map(function (p) { return [+p[0].toFixed(3), +p[1].toFixed(3)]; }));
        });
      });
      return out;
    });
  }

  /* ---------- Modelo: la ruta en coordenadas del mundo (Mercator, de 0 a 1) ---------- */
  function wx(lon) { return (lon + 180) / 360; }
  function wy(lat) { var l = clamp(lat, -85, 85) * Math.PI / 180; return 0.5 - Math.log(Math.tan(Math.PI / 4 + l / 2)) / (2 * Math.PI); }
  var ICONS = {
    castle: 'M5 21V9h3V6h2v3h4V6h2v3h3v12zM10 21v-5a2 2 0 0 1 4 0v5',
    sacred: 'M12 2v4M10 4h4M5 21v-9l7-6 7 6v9zM10 21v-5a2 2 0 0 1 4 0v5',
    museum: 'M3 9l9-6 9 6zM5 9v10M10 9v10M14 9v10M19 9v10M3 21h18',
    tower: 'M9 21l1.5-14h3L15 21zM12 3v4M8 21h8',
    bridge: 'M2 16h20M4 16c2-6 6-9 8-9s6 3 8 9M8 16v-4M16 16v-4',
    square: 'M4 20V10l4-3 4 3 4-3 4 3v10zM9 20v-5h6v5',
    nature: 'M2 20l7-12 4 6 3-4 6 10z',
    garden: 'M12 21v-7M12 14a5 5 0 1 0-4.6-7A4 4 0 0 0 12 14zM12 14a5 5 0 1 0 4.6-7',
    market: 'M4 10l2-6h12l2 6M4 10a3 3 0 0 0 5.3 0 3 3 0 0 0 5.4 0A3 3 0 0 0 20 10M6 12v8h12v-8',
    show: 'M4 20V8c5-5 11-5 16 0v12zM9 20v-6h6v6',
    pin: 'M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z'
  };
  function iconFor(s) {
    var k = s.k, t = (s.ti || '').toLowerCase();
    var map = { palace: 'castle', ruins: 'castle', sacred: 'sacred', museum: 'museum', monument: 'tower', square: 'square', quarter: 'square', market: 'market', show: 'show', garden: 'garden', nature: 'nature', family: 'garden' };
    if (map[k]) return map[k];
    if (/castillo|castle|palacio/.test(t)) return 'castle';
    if (/catedral|iglesia|abad|igreja|church|st giles/.test(t)) return 'sacred';
    if (/museo|museum|galer/.test(t)) return 'museum';
    if (/puente|bridge|viaducto|viaduct/.test(t)) return 'bridge';
    if (/mirador|monte|loch|glen|hill|cascada|falls|buachaille|sisters/.test(t) || s.t === 'view') return 'nature';
    return 'pin';
  }
  var VEH = {
    plane: 'M2 13.2l7.5-1.2L14 4h2.2l-1.8 7.6 4.6-.7L20.5 9H22l-.7 3 .7 3h-1.5l-1.5-1.9-4.6-.7L16.2 20H14l-4.5-8z',
    car: 'M3 15.5l1.8-4.7A2 2 0 0 1 6.7 9.5h8.1a3 3 0 0 1 2.4 1.2l2.3 2.8 2 .9v3.1h-2.1a2.3 2.3 0 0 1-4.5 0H9a2.3 2.3 0 0 1-4.5 0H3zM7 11.5l-1 2.5h5v-2.5zM13 11.5V14h4.5l-1.5-2a1.5 1.5 0 0 0-1.2-.5z',
    train: 'M7 3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-2.5 3l2 3h-2.4l-2-3H10.9l-2 3H6.5l2-3A3 3 0 0 1 6 15V6a3 3 0 0 1 1-3zM8 6v5h8V6zM9 13.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM15 13.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z',
    bus: 'M6 3h12a2 2 0 0 1 2 2v13h-1.5v2.5h-2.5V18H8v2.5H5.5V18H4V5a2 2 0 0 1 2-2zM6 6v6h12V6zM7.5 14a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM16.5 14a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z',
    walk: 'M13.5 2.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM11 8l3.500.3 2 3.2 3 1-.6 1.8-3.9-1.3-1-1.5-.8 3.2 2.8 2.8V23h-2v-4.7l-3-2.5-1 2.6L6.5 22 5 20.6l3.2-3.7L10 9.8l-2 .9V14H6V9.5z'
  };
  // cómo se hace un tramo
  function legMode(a, b, mode) {
    var d = kmBetween(a.s, b.s), other = a.di !== b.di;
    if (other && d >= (mode === 'car' ? 1500 : 700)) return 'plane';
    if (other && b.jump) return 'train';
    if (mode === 'car') return d > 1.5 ? 'car' : 'walk';
    return d > 3.5 ? 'bus' : 'walk';
  }
  var HOW = { es: { plane: 'en avión', car: 'en coche', train: 'en tren o autobús', bus: 'en transporte público', walk: 'a pie', to: 'Hacia', see: 'Ver en el día', fin: 'Fin del viaje', vid: 'Guardar vídeo de la ruta', rec: 'Grabando… no cierres esta pantalla', novid: 'Este navegador no puede grabar el mapa', hint: 'Mueve la bolita por la ruta', play: 'Reproducir el viaje', all: 'Ver todo el viaje', start: 'Arrastra la bolita o dale a reproducir para recorrer el viaje', end: 'Este es el viaje completo. Arrastra la bolita hacia atrás para volver a cualquier sitio' },
    en: { plane: 'by plane', car: 'by car', train: 'by train or coach', bus: 'by public transport', walk: 'on foot', to: 'To', see: 'See in the day', fin: 'End of the trip', vid: 'Save route video', rec: 'Recording… keep this screen open', novid: "This browser can't record the map", hint: 'Slide the ball along the route', play: 'Play the trip', all: 'See the whole trip', start: 'Drag the ball or press play to travel the trip', end: 'This is the whole trip. Drag the ball back to return to any place' } };

  var LEG_KM = 3.5, ZONE_KM = 6, ZONE_MAX = 5;
  function model(o) {
    var seq = [], legs = [], scenes = [];
    o.days.forEach(function (d, di) { d.stops.forEach(function (st, si) { seq.push({ s: st, di: di, si: si, x: wx(st.lon), y: wy(st.lat), jump: !si && d.jump, sight: isSight(st), a: 0 }); }); });
    if (!seq.length) return null;
    seq.slice(1).forEach(function (q, n) {
      var a = seq[n], dx = q.x - a.x, dy = q.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1e-9, m = legMode(a, q, o.mode), km = kmBetween(a.s, q.s);
      // el avión vuela en arco; lo demás, una curva suave. Siempre hacia arriba
      var bulge = len * (m === 'plane' ? 0.26 : 0.07), px = dy / len, py = -dx / len; if (py > 0) { px = -px; py = -py; }
      legs.push({ m: m, km: km, di: q.di, soft: a.di !== q.di && km < 15 && m !== 'train' && m !== 'plane', ax: a.x, ay: a.y, cx: (a.x + q.x) / 2 + px * bulge, cy: (a.y + q.y) / 2 + py * bulge, bx: q.x, by: q.y });
    });
    // escenas: cada zona con su zoom. Puntos seguidos y cercanos, a escala de paseo; cambia al alejarse, al cambiar de día o en un aeropuerto
    var run = [];
    function zones(pts) {
      var km = 0;
      pts.forEach(function (a) { pts.forEach(function (b) { km = Math.max(km, kmBetween(a.s, b.s)); }); });
      if (pts.length < 2 || (km <= ZONE_KM && pts.length <= ZONE_MAX)) { scenes.push({ pts: pts }); return; }
      // zona demasiado grande o llena: se parte por el tramo más largo, y así hasta que se vea bien
      var cut = 1, big = -1;
      pts.slice(1).forEach(function (q, k) { var d = kmBetween(pts[k].s, q.s); if (d > big) { big = d; cut = k + 1; } });
      zones(pts.slice(0, cut)); zones(pts.slice(cut));
    }
    seq.forEach(function (q, i) {
      var p = seq[i - 1];
      if (p && (p.di !== q.di || legs[i - 1].km > LEG_KM || p.sight !== q.sight)) { zones(run); run = []; }
      run.push(q);
    });
    zones(run);
    scenes.forEach(function (sc, n) { sc.pts.forEach(function (q) { q.sc = n; }); });
    // nombres de ciudades: los del viaje, o el lugar de cada parada
    var cities = [];
    if (o.cities && o.cities.length) {
      seq.forEach(function (q) {
        var best = null, bd = 30;
        o.cities.forEach(function (c) { var d = kmBetween(q.s, c); if (d < bd) { bd = d; best = c; } });
        q.city = best ? best.n : '';
        if (best && !cities.some(function (c) { return c.n === best.n; })) cities.push({ n: best.n, x: wx(best.lon), y: wy(best.lat), c: 0, pts: [] });
      });
    } else {
      seq.forEach(function (q) {
        var n = q.sight ? q.s.pl || '' : ''; q.city = n; if (!n) return;
        var c = cities.filter(function (z) { return z.n === n; })[0];
        if (!c) { c = { n: n, c: 0, pts: [] }; cities.push(c); }
        c.pts.push(q);
      });
      cities.forEach(function (c) { c.x = c.pts.reduce(function (a, q) { return a + q.x; }, 0) / c.pts.length; c.y = c.pts.reduce(function (a, q) { return a + q.y; }, 0) / c.pts.length; });
    }
    cities.forEach(function (c) {
      c.pts = seq.filter(function (q) { return q.city === c.n; }); c.c = c.pts.length;
      c.w = Math.max.apply(null, c.pts.map(function (q) { return q.x; })) - Math.min.apply(null, c.pts.map(function (q) { return q.x; }));
    });
    cities.sort(function (a, b) { return b.c - a.c; });
    return { seq: seq, legs: legs, scenes: scenes, cities: cities };
  }

  /* ---------- Cámara ---------- */
  var SMAX = 256 * Math.pow(2, 16.5);
  function fit(pts, W, H, top, bot, side, minKm) {
    var x0 = 2, x1 = -1, y0 = 2, y1 = -1, lat = 0;
    pts.forEach(function (p) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); lat += p.s ? p.s.lat : 0; });
    var cosL = Math.max(0.2, Math.cos((pts[0].s ? pts[0].s.lat : lat) * Math.PI / 180)), minW = (minKm || 0.01) / (40075 * cosL);
    var dx = Math.max(x1 - x0, minW), dy = Math.max(y1 - y0, minW * 0.6), s = Math.min(SMAX, (W - side * 2) / dx, (H - top - bot) / dy);
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 - (top + (H - top - bot) / 2 - H / 2) / s, s: s };
  }
  function ease(f) { return f * f * (3 - 2 * f); }
  // de una vista a otra: la escala cambia en proporción y el centro acompaña, sin que parezca que se desliza
  function mix(a, b, t) {
    var s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t), u = Math.abs(a.s - b.s) < a.s * 0.01 ? t : (1 / s - 1 / a.s) / (1 / b.s - 1 / a.s);
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, s: s };
  }

  /* ---------- Baldosas y fotos, compartidas entre mapas ---------- */
  var TILES = {}, nTiles = 0, PHOTOS = {}, ICON2D = {}, wake = [];
  function repaintAll() { wake.forEach(function (f) { f(); }); }
  function tileAt(style, z, x, y, load) {
    var k = style + '/' + z + '/' + y + '/' + x, t = TILES[k];
    if (t || !load) return t && t.ok ? t.im : null;
    t = TILES[k] = { im: new Image(), ok: false };
    t.im.crossOrigin = 'anonymous';   // para poder grabar el mapa en vídeo
    t.im.onload = function () { t.ok = true; repaintAll(); };
    t.im.onerror = function () { delete TILES[k]; };
    t.im.src = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/' + style + '/MapServer/tile/' + z + '/' + y + '/' + x;
    if (++nTiles > 320) { var old = Object.keys(TILES).slice(0, 100); old.forEach(function (o) { delete TILES[o]; }); nTiles -= old.length; }
    return null;
  }
  // la foto del sitio, recortada en cuadrado y reducida: dibujarla en cada fotograma no cuesta nada
  function bubblePhoto(src) {
    var p = PHOTOS[src]; if (p) return p.cv;
    p = PHOTOS[src] = { cv: null };
    var im = new Image(), anon = !/^data:/.test(src);
    if (anon) im.crossOrigin = 'anonymous';
    im.onload = function () {
      var n = 144, cv = document.createElement('canvas'), g = cv.getContext('2d'), k = Math.max(n / im.width, n / im.height), w = im.width * k, h = im.height * k;
      cv.width = cv.height = n; g.drawImage(im, (n - w) / 2, (n - h) / 2, w, h); p.cv = cv; repaintAll();
    };
    // si falla (sin conexión, por ejemplo), se reintenta más tarde en vez de quedarse con el icono
    // sin permiso de lectura, se pide normal: se ve la foto, aunque ese mapa ya no se pueda grabar
    im.onerror = function () {
      if (anon) { anon = false; im.removeAttribute('crossorigin'); im.src = src; return; }
      setTimeout(function () { delete PHOTOS[src]; repaintAll(); }, 4000);   // sin conexión, por ejemplo: se reintenta más tarde
    };
    if (anon && /commons\.wikimedia\.org\/wiki\/Special:FilePath/.test(src)) corsUrl(src).then(function (u) { im.src = u; }, function () { im.src = src; });
    else im.src = src;
    return null;
  }
  function path2d(d) { return ICON2D[d] || (ICON2D[d] = new Path2D(d)); }
  function shorten(g, txt, max) { txt = String(txt); if (g.measureText(txt).width <= max) return txt; while (txt.length > 3 && g.measureText(txt + '…').width > max) txt = txt.slice(0, -1); return txt.replace(/[\s,·]+$/, '') + '…'; }

  /* ---------- El mapa en la página ---------- */
  var MEM = {};   // en qué punto se quedó, aunque la página se vuelva a pintar
  var SERIF = '"New York","Iowan Old Style",Georgia,serif', SANS = '-apple-system,system-ui,"Segoe UI",sans-serif';
  function mount(el, o) {
    if (!el) return;
    if (el._mapOff) el._mapOff();
    var H0 = HOW[o.lang === 'en' ? 'en' : 'es'], M = model(o); if (!M) { el.innerHTML = ''; return; }
    var key0 = o.id || 'x', mem = MEM[key0] || (MEM[key0] = { v: -1, ovr: 0 }), last = M.seq.length - 1;
    if (mem.v > last + 1) mem.v = last + 1;
    var W = 0, H = 0, dpr = 1, over = null, cams = [], mids = [], ovrT = mem.ovr, trFrom = null, tr = 1, raf = 0, moved = 0, tm = 0, playing = false, gl = 0, lastT = 0, lastInfo = '', drawn = [], dead = false, landPath = null;
    var usedDays = [];
    M.seq.forEach(function (q, i) { if (!usedDays.some(function (u) { return u.di === q.di; })) usedDays.push({ di: q.di, i: i, title: o.days[q.di].title }); });
    var track = M.seq.map(function (q, i) { return COLORS[q.di % COLORS.length] + ' ' + ((i + 1) / (last + 2) * 100).toFixed(1) + '%'; });
    el.innerHTML = '<div class="card map-card">' + (o.heading ? '<div class="eyebrow">' + esc(o.heading) + '</div>' : '') +
      '<div class="map-wrap"><canvas class="map-cv" role="img" aria-label="' + esc(o.title || 'Mapa del viaje') + '"></canvas><div class="map-city" aria-live="polite"></div>' +
      '<button type="button" class="map-all sq" aria-label="' + esc(H0.all) + '" title="' + esc(H0.all) + '"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<small class="map-attr">Esri, HERE, Garmin, © OpenStreetMap</small></div>' +
      '<div class="map-ctl"><button type="button" class="map-play sq" aria-label="' + esc(H0.play) + '"><svg viewBox="0 0 24 24"><path class="pl" fill="currentColor" d="M7 4v16l13-8z"/><path class="pa" fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg></button>' +
      '<input class="map-range" type="range" min="-1" max="' + (last + 1) + '" step="0.005" value="' + mem.v + '" aria-label="' + esc(H0.hint) + '" style="--track:linear-gradient(90deg,' + COLORS[0] + ' 0%,' + track.join(',') + ')"></div>' +
      '<div class="map-info"></div>' +
      '<div class="map-leg">' + usedDays.map(function (x) { return '<button type="button" class="map-day" data-mapgo="' + x.i + '" data-di="' + x.di + '"><i style="background:' + COLORS[x.di % COLORS.length] + '"></i>' + esc((o.dayLabel || 'Día') + ' ' + (x.di + 1)) + (x.title ? ' · ' + esc(x.title) : '') + '</button>'; }).join('') + '</div><button type="button" class="map-vid" hidden>' + esc(H0.vid) + '</button></div>';
    var wrap = el.querySelector('.map-wrap'), cv = el.querySelector('.map-cv'), g = cv.getContext('2d'), rg = el.querySelector('.map-range'), allBtn = el.querySelector('.map-all'), box = el.querySelector('.map-info'), playBtn = el.querySelector('.map-play');

    function layout() {
      var w = wrap.clientWidth; if (!w) return false;
      if (w === W && cams.length) return true;
      W = w; H = Math.round(clamp(w * 1.08, 300, 520)); dpr = Math.min(3, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
      var world = M.seq.slice();
      M.legs.forEach(function (l) { if (l.m === 'plane') world.push({ x: l.cx, y: l.cy }); });
      over = fit(world, W, H, 100, 42, 46, 0.6);
      // un sitio solo: de cerca si está en plena ciudad; en el campo, con lo que tiene alrededor
      cams = M.scenes.map(function (sc) {
        var i = M.seq.indexOf(sc.pts[0]), near = Math.min((M.legs[i - 1] || { km: 1e4 }).km, (M.legs[i] || { km: 1e4 }).km);
        return fit(sc.pts, W, H, 104, 48, 50, sc.pts.length > 1 || near < 6 ? 1.2 : 5);
      });
      mids = M.legs.map(function (l, i) {
        var a = M.seq[i], b = M.seq[i + 1]; if (a.sc === b.sc) return null;
        return fit([a, b, { x: l.cx, y: l.cy }], W, H, 112, 50, 56, 0.1);
      });
      return true;
    }
    // la cámara va siempre con la bolita, un poco por debajo del centro para que se vea la foto de encima
    function follow(P, sc) { return { x: P.x, y: P.y - H * 0.1 / sc, s: sc }; }
    function logMix(a, b, t) { return Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t); }
    function zoneScale(i) { var sc = M.scenes[M.seq[i].sc]; return cams[M.seq[i].sc].s * (sc.pts.length > 1 ? 0.82 : 1); }
    function scaleAt(v) {
      var i = Math.min(last - 1, Math.floor(v)), f = v - i;
      if (i < 0) return zoneScale(0);
      var a = zoneScale(i), b = zoneScale(i + 1);
      if (M.seq[i].sc === M.seq[i + 1].sc) return a;
      var m = mids[i] && mids[i].s * 0.85;
      // viaje a otro sitio: se aleja al salir y mantiene esa vista, con origen y destino a la vista, hasta acercarse a la llegada
      if (m && m < Math.min(a, b) * 0.8) return f < 0.3 ? logMix(a, m, ease(f / 0.3)) : f > 0.7 ? logMix(m, b, ease((f - 0.7) / 0.3)) : m;
      return logMix(a, b, ease(f));
    }
    function camAt(v) {
      if (v <= -1) return over;
      // pasada la última parada, se aleja: otra vez el viaje entero
      if (v > last) return mix(follow(posAt(last), zoneScale(last)), over, ease(Math.min(1, v - last)));
      if (v < 0) return mix(over, follow(posAt(0), zoneScale(0)), ease(v + 1));
      var P = posAt(v), sc = scaleAt(v), i = Math.min(last - 1, Math.floor(v));
      // en un viaje a otro sitio, se ve de dónde sale hasta la mitad del camino, y adónde llega desde ahí
      if (i >= 0 && M.seq[i].sc !== M.seq[i + 1].sc) {
        var q = M.seq[v - i < 0.5 ? i : i + 1], d = Math.sqrt(Math.pow(q.x - P.x, 2) + Math.pow(q.y - P.y, 2));
        if (d > 0) sc = Math.min(sc, Math.min(W, H) * 0.4 / d);
      }
      return follow(P, sc);
    }
    function posAt(v) {
      v = Math.min(v, last);
      if (v <= 0) return { x: M.seq[0].x, y: M.seq[0].y, a: 0, m: 'walk', right: true };
      var i = Math.min(M.legs.length - 1, Math.floor(v)), f = v - i, l = M.legs[i];
      if (!l) return { x: M.seq[0].x, y: M.seq[0].y, a: 0, m: 'walk', right: true };
      var u = 1 - f, dx = 2 * u * (l.cx - l.ax) + 2 * f * (l.bx - l.cx), dy = 2 * u * (l.cy - l.ay) + 2 * f * (l.by - l.cy);
      return { x: u * u * l.ax + 2 * u * f * l.cx + f * f * l.bx, y: u * u * l.ay + 2 * u * f * l.cy + f * f * l.by, a: Math.atan2(dy, dx) * 180 / Math.PI, m: l.m, right: dx >= 0 };
    }

    // cámara con muelle: sigue a la cámara ideal con algo de inercia y un pequeño rebote al acercarse o alejarse
    var spr = null, RM = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    function spring(T, dt) {
      var tl = Math.log(T.s);
      if (!spr || RM || spr.W !== W || spr.H !== H) { spr = { x: T.x, y: T.y, l: tl, vx: 0, vy: 0, vl: 0, W: W, H: H }; return { T: T, busy: false }; }
      var w = 7.5, z = 0.68, n = Math.max(1, Math.ceil(dt / 16)), h = dt / 1000 / n;
      for (var k = 0; k < n; k++) {
        spr.vx += (w * w * (T.x - spr.x) - 2 * z * w * spr.vx) * h; spr.x += spr.vx * h;
        spr.vy += (w * w * (T.y - spr.y) - 2 * z * w * spr.vy) * h; spr.y += spr.vy * h;
        spr.vl += (w * w * (tl - spr.l) - 2 * z * w * spr.vl) * h; spr.l += spr.vl * h;
      }
      var px = T.s, busy = Math.abs(T.x - spr.x) * px > 0.3 || Math.abs(T.y - spr.y) * px > 0.3 || Math.abs(tl - spr.l) > 0.002 || Math.abs(spr.vx) * px > 2 || Math.abs(spr.vy) * px > 2 || Math.abs(spr.vl) > 0.01;
      if (!busy) { spr.x = T.x; spr.y = T.y; spr.l = tl; spr.vx = spr.vy = spr.vl = 0; }
      return { T: { x: spr.x, y: spr.y, s: Math.exp(spr.l) }, busy: busy };
    }
    // escala de una burbuja: muelle poco amortiguado, para que la foto del sitio al que llegas dé un saltito
    function pop(q, to, dt) {
      if (q.ks == null || RM) { q.ks = to; q.kv = 0; return false; }
      var w = 15, z = 0.38, n = Math.max(1, Math.ceil(dt / 16)), h = dt / 1000 / n;
      for (var k = 0; k < n; k++) { q.kv += (w * w * (to - q.ks) - 2 * z * w * q.kv) * h; q.ks += q.kv * h; }
      if (Math.abs(to - q.ks) < 0.002 && Math.abs(q.kv) < 0.02) { q.ks = to; q.kv = 0; return false; }
      return true;
    }

    /* ----- dibujo ----- */
    function halo(txt, x, y, col, hal, lw) { g.lineJoin = 'round'; g.lineWidth = lw; g.strokeStyle = hal; g.strokeText(txt, x, y); g.fillStyle = col; g.fillText(txt, x, y); }
    function drawLeg(l, t1, alpha, sx, sy) {
      if (t1 <= 0) return;
      var ax = sx(l.ax), ay = sy(l.ay), cx = sx(l.cx), cy = sy(l.cy), bx = sx(l.bx), by = sy(l.by);
      if (Math.abs(ax - bx) + Math.abs(ay - by) < 2) return;
      if (t1 < 1) { var q0x = ax + (cx - ax) * t1, q0y = ay + (cy - ay) * t1, q1x = cx + (bx - cx) * t1, q1y = cy + (by - cy) * t1; bx = q0x + (q1x - q0x) * t1; by = q0y + (q1y - q0y) * t1; cx = q0x; cy = q0y; }
      var col = COLORS[l.di % COLORS.length];
      function line(w, dash, c, a) { g.globalAlpha = a; g.lineWidth = w; g.strokeStyle = c; g.setLineDash(dash); g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo(cx, cy, bx, by); g.stroke(); }
      g.lineCap = 'round';
      if (l.soft) line(2.5, [0.1, 6], col, alpha * 0.6);
      else if (l.m === 'plane') { line(5, [], 'rgba(255,255,255,.55)', alpha); line(2.6, [9, 7], col, alpha); }
      else if (l.m === 'car') { line(7, [], 'rgba(255,255,255,.6)', alpha); line(4.6, [0.1, 8.5], col, alpha); }
      else if (l.m === 'train') { g.lineCap = 'butt'; line(5, [], col, alpha); line(2, [5, 5], '#fff', alpha); g.lineCap = 'round'; }
      else if (l.m === 'bus') { line(6, [], 'rgba(255,255,255,.6)', alpha); line(3.4, [11, 5], col, alpha); }
      else { line(5.5, [], 'rgba(255,255,255,.6)', alpha); line(3, [0.1, 5.5], col, alpha); }
      g.setLineDash([]); g.globalAlpha = 1;
    }
    function drawNight(f) {
      var night = Math.min(1, Math.sin(Math.PI * f) * 1.3);
      g.fillStyle = 'rgba(14,20,40,' + (night * 0.6).toFixed(3) + ')'; g.fillRect(0, 0, W, H);
      // el sol se pone por la derecha, la luna cruza y el sol vuelve por la izquierda
      var cx = W / 2, cy = H * 0.5, Rr = Math.min(W * 0.44, H * 0.42), a = -Math.PI / 2 + f * Math.PI * 2;
      function body(ang, col) {
        var x = cx + Math.cos(ang) * Rr, y = cy + Math.sin(ang) * Rr * 0.95, up = clamp((cy + 26 - y) / 60, 0, 1);
        if (up <= 0) return;
        g.globalAlpha = up * Math.min(1, Math.sin(Math.PI * f) * 4); g.fillStyle = col; g.beginPath(); g.arc(x, y, 13, 0, 7); g.fill(); g.globalAlpha = 1;
      }
      body(a, '#f5c04e');
      body(a + Math.PI, '#e8e8e0');
    }
    function paint(now) {
      if (dead || !layout()) return;
      var dt = Math.min(60, now - (lastT || now)); lastT = now;
      var again = false, dark = document.documentElement.getAttribute('data-theme') === 'dark', v = mem.v;
      // cámara
      if (mem.ovr !== ovrT) { var st = dt / 650; mem.ovr = ovrT > mem.ovr ? Math.min(ovrT, mem.ovr + st) : Math.max(ovrT, mem.ovr - st); again = true; }
      var cam = camAt(v);
      if (mem.ovr > 0) cam = mix(cam, over, ease(mem.ovr));
      if (tr < 1 && trFrom) { tr = Math.min(1, tr + dt / 900); cam = mix(trFrom, cam, ease(tr)); again = true; }
      var sp0 = spring(cam, dt); cam = sp0.T; if (sp0.busy) again = true;
      var s = cam.s, ox = W / 2 - cam.x * s, oy = H / 2 - cam.y * s;
      function sx(x) { return x * s + ox; }
      function sy(y) { return y * s + oy; }
      el._cam = cam;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = dark ? '#22242a' : '#e4ebe9'; g.fillRect(0, 0, W, H);
      // la silueta de la tierra, debajo, por si faltan baldosas o no hay conexión
      if (o.land && o.land.length) {
        if (!landPath) { landPath = new Path2D(); o.land.forEach(function (r) { if (r.some(function (c, i) { return i && Math.abs(c[0] - r[i - 1][0]) > 180; })) return; r.forEach(function (c, i) { if (i) landPath.lineTo(wx(c[0]), wy(c[1])); else landPath.moveTo(wx(c[0]), wy(c[1])); }); landPath.closePath(); }); }
        g.save(); g.transform(s, 0, 0, s, ox, oy); g.fillStyle = dark ? '#35383f' : '#ded9cc'; g.fill(landPath); g.restore();
      }
      // baldosas: primero las de menos detalle, para que nunca quede un hueco
      var style = dark ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base', moving = now - moved < 140, zt = clamp(Math.ceil(Math.log(s / 256) / Math.LN2 - (moving ? 1 : 0)), 1, 16);
      for (var z = Math.max(1, zt - 3); z <= zt; z++) {
        var n2 = Math.pow(2, z), ts = s / n2, t0x = Math.floor(-ox / ts), t1x = Math.floor((W - ox) / ts), t0y = Math.max(0, Math.floor(-oy / ts)), t1y = Math.min(n2 - 1, Math.floor((H - oy) / ts));
        for (var tx = t0x; tx <= t1x; tx++) for (var ty = t0y; ty <= t1y; ty++) {
          var im = tileAt(style, z, ((tx % n2) + n2) % n2, ty, z === zt);
          if (im) g.drawImage(im, tx * ts + ox, ty * ts + oy, ts + 0.6, ts + 0.6);
        }
      }
      // un tono cálido, el de la app, sobre el gris del mapa
      if (!dark) { g.globalCompositeOperation = 'multiply'; g.fillStyle = '#f7efe0'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; }
      // la ruta: lo recorrido, con fuerza; lo que falta, suave
      var iNow = v < 0 ? -1 : Math.min(M.legs.length - 1, Math.floor(v)), fNow = v < 0 ? 0 : Math.min(1, v - iNow);
      var fut = v < 0 || v > last ? 0.92 : 0.38;
      M.legs.forEach(function (l, i) { if (i >= iNow) drawLeg(l, 1, fut, sx, sy); });
      M.legs.forEach(function (l, i) { if (i < iNow) drawLeg(l, 1, 1, sx, sy); else if (i === iNow) drawLeg(l, fNow, 1, sx, sy); });
      // paradas
      M.seq.forEach(function (q, i) {
        var x = sx(q.x), y = sy(q.y); if (x < -10 || x > W + 10 || y < -10 || y > H + 10) return;
        g.beginPath(); g.arc(x, y, 4.2, 0, 7); g.fillStyle = v < 0 || i <= v + 0.5 ? COLORS[q.di % COLORS.length] : dark ? '#70737c' : '#a9a69c'; g.fill(); g.lineWidth = 1.6; g.strokeStyle = '#fff'; g.stroke();
      });
      // de un día al siguiente: atardece, sale la luna y amanece
      var dn = v >= 0 && v < last ? Math.floor(v) : -1;
      if (dn >= 0 && M.seq[dn].di !== M.seq[dn + 1].di && v > dn) drawNight(v - dn);
      // burbujas con la foto de cada sitio: las que caben, sin pisarse; el resto se suma a la de al lado (+3)
      var R = clamp(W * 0.065, 20, 27), curI = v >= -0.07 && v <= last + 0.07 ? clamp(Math.round(v), 0, last) : -1, placed = [];
      var cand = M.seq.filter(function (q) { return q.sight; }).sort(function (a, b) {
        var ca = M.seq[curI] === a ? 1 : 0, cb = M.seq[curI] === b ? 1 : 0;
        return cb - ca || (b.a > 0.5) - (a.a > 0.5) || (b.s.must ? 1 : 0) - (a.s.must ? 1 : 0) || (((b.s.src || {}).views || 0) - ((a.s.src || {}).views || 0)) || M.seq.indexOf(a) - M.seq.indexOf(b);
      });
      cand.forEach(function (q) {
        var x = sx(q.x), y = sy(q.y), off = x < -R || x > W + R || y < -4 || y > H + 2 * R + 12, near = null;
        q.extra = 0;
        if (!off) placed.some(function (p) { var dx = p.bx - x, dy = p.by - (y - R - 9); if (dx * dx + dy * dy < (R * 2 + 5) * (R * 2 + 5)) { near = p; return true; } return false; });
        var show = !off && !near;
        if (near) near.q.extra++;
        if (show) placed.push({ q: q, bx: x, by: y - R - 9, x: x, y: y });
        var to = show ? 1 : 0;
        if (q.a !== to) { var d2 = dt / 240; q.a = to > q.a ? Math.min(1, q.a + d2) : Math.max(0, q.a - d2); again = true; }
      });
      drawn = [];
      cand.slice().reverse().forEach(function (q) {
        if (q.a <= 0.3) return;
        var cur = M.seq[curI] === q; if (pop(q, cur ? 1.28 : 1, dt)) again = true;
        var x = sx(q.x), y = sy(q.y), k = q.a * q.ks, r = R * k, by = y - r - 9 * k, col = COLORS[q.di % COLORS.length], src = photoOf(q.s, o.photos), ph = src ? bubblePhoto(src) : null;
        g.save();
        g.shadowColor = 'rgba(20,20,25,.4)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
        g.beginPath(); g.moveTo(x, y - 1); g.lineTo(x - r * 0.42, by + r * 0.72); g.lineTo(x + r * 0.42, by + r * 0.72); g.closePath(); g.fillStyle = cur ? BALL : col; g.fill();
        g.beginPath(); g.arc(x, by, r, 0, 7); g.fill();
        g.restore();
        g.beginPath(); g.arc(x, by, r - 2.5, 0, 7); g.fillStyle = '#fff'; g.fill();
        g.save(); g.beginPath(); g.arc(x, by, r - 3.5, 0, 7); g.clip();
        if (ph) g.drawImage(ph, x - r, by - r, r * 2, r * 2);
        else { g.fillStyle = col; g.fillRect(x - r, by - r, r * 2, r * 2); g.translate(x - r * 0.6, by - r * 0.6); g.scale(r * 1.2 / 24, r * 1.2 / 24); g.strokeStyle = '#fff'; g.lineWidth = 1.7; g.lineCap = g.lineJoin = 'round'; g.stroke(path2d(ICONS[iconFor(q.s)])); }
        g.restore();
        if (q.extra && q.a > 0.5) {
          var tx0 = '+' + q.extra; g.font = '800 11px ' + SANS; var tw = g.measureText(tx0).width + 9, cx0 = x + r * 0.72, cy0 = by - r * 0.72;
          g.beginPath(); g.arc(cx0, cy0, Math.max(9, tw / 2), 0, 7); g.fillStyle = col; g.fill(); g.lineWidth = 1.6; g.strokeStyle = '#fff'; g.stroke();
          g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(tx0, cx0, cy0 + 0.5);
        }
        drawn.push({ q: q, i: M.seq.indexOf(q), x: x, y: by, r: r });
      });
      // nombres: de cerca, los sitios; de lejos, las ciudades
      g.textAlign = 'center'; g.textBaseline = 'middle';
      var txtC = dark ? '#f1efe9' : '#23252b', halC = dark ? 'rgba(20,22,26,.88)' : 'rgba(255,255,255,.92)', boxes = [];
      function free(x, y, w, h) { var hit = boxes.some(function (b) { return Math.abs(b.x - x) < (b.w + w) / 2 && Math.abs(b.y - y) < (b.h + h) / 2; }); if (!hit) boxes.push({ x: x, y: y, w: w, h: h }); return !hit; }
      var closeIn = clamp((Math.log(s / over.s) / Math.LN2 - 0.3) / 0.6, 0, 1), onlyOne = M.cities.length < 2;
      if (closeIn > 0.05 || onlyOne) {
        g.font = '650 11px ' + SANS;
        placed.forEach(function (p) {
          var cur = M.seq[curI] === p.q; if (!cur && closeIn < 0.5) return;
          var txt = shorten(g, p.q.s.ti, cur ? 150 : 104), w = g.measureText(txt).width + 6, y = p.y + 13;
          if (p.x < -40 || p.x > W + 40 || y > H - 8 || !free(clamp(p.x, w / 2 + 2, W - w / 2 - 2), y, w, 15)) return;
          g.globalAlpha = Math.max(cur ? 1 : 0, closeIn) * p.q.a;
          halo(txt, clamp(p.x, w / 2 + 2, W - w / 2 - 2), y, txtC, halC, 3);
        });
        g.globalAlpha = 1;
      }
      g.font = '700 ' + clamp(W * 0.044, 14, 18) + 'px ' + SERIF;
      M.cities.forEach(function (c) {
        // dentro de la ciudad ya no hace falta su nombre: está arriba, en la etiqueta
        var span = c.w * s, a = 1 - clamp((span - W * 0.75) / (W * 0.4), 0, 1);
        if (a <= 0.02) return;
        var x = sx(c.x), y = sy(c.y) + 17, w = g.measureText(c.n).width + 8;
        if (x < -w / 2 || x > W + w / 2 || y < 6 || y > H - 4) return;
        var xx = clamp(x, w / 2 + 2, W - w / 2 - 2);
        if (!free(xx, y, w, 19)) return;
        g.globalAlpha = a; halo(c.n, xx, y, txtC, halC, 4);
      });
      g.globalAlpha = 1;
      // la bolita
      var P = posAt(v), bx = sx(P.x), by2 = sy(P.y), pulse = moving || playing ? 0.22 + Math.sin(now / 240) * 0.08 : 0.24;
      if (moving || playing) again = true;
      g.beginPath(); g.arc(bx, by2, 20, 0, 7); g.fillStyle = 'rgba(20,22,27,' + pulse.toFixed(2) + ')'; g.fill();
      g.save(); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 7; g.shadowOffsetY = 2; g.beginPath(); g.arc(bx, by2, 13.5, 0, 7); g.fillStyle = BALL; g.fill(); g.restore();
      g.lineWidth = 2.4; g.strokeStyle = '#fff'; g.stroke();
      g.save(); g.translate(bx, by2);
      if (P.m === 'plane') g.rotate(P.a * Math.PI / 180); else if (P.m === 'car' && !P.right) g.scale(-1, 1);
      g.scale(0.72, 0.72); g.translate(-12, -12); g.fillStyle = '#fff'; g.fill(path2d(VEH[P.m]), 'evenodd'); g.restore();
      if (recording && cityEl && cityEl.classList.contains('on')) {
        var nowT = cityEl.querySelector('.mc-now');
        if (nowT) { g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'italic 700 ' + (cityEl.classList.contains('big') ? 34 : 23) + 'px ' + SERIF; halo(nowT.querySelector('b').getAttribute('aria-label') || '', W / 2, cityEl.classList.contains('big') ? H * 0.2 : 26, txtC, halC, 5); g.font = '750 13px ' + SANS; halo(nowT.querySelector('small').textContent, W / 2, cityEl.classList.contains('big') ? H * 0.2 + 28 : 48, '#e2782f', halC, 3); }
      }
      if (again || recording) invalidate();
      clearTimeout(tm); if (moving) tm = setTimeout(invalidate, 160);
    }
    function invalidate() { if (dead || raf) return; raf = requestAnimationFrame(function (t) { raf = 0; paint(t); }); }

    /* ----- ficha y etiqueta ----- */
    function info(v) {
      var near = Math.round(v), at = v > -0.07 && Math.abs(v - near) < 0.07, q = M.seq[clamp(near, 0, last)], key = v <= -0.07 ? 'start' : v > last + 0.07 ? 'end' : at ? 's' + near : 'l' + Math.floor(v);
      if (key === lastInfo) return; lastInfo = key;
      if (key === 'start' || key === 'end') { box.className = 'map-info hint'; box.innerHTML = '<span>' + esc(H0[key]) + '</span>'; return; }
      if (at) {
        var s0 = q.s, src = s0.ph && o.photos && o.photos[s0.ph] ? ' style="background-image:url(&quot;' + esc(o.photos[s0.ph]) + '&quot;)"' : '', cls = s0.ph && !src ? ' ph ph-' + s0.ph : '';
        box.className = 'map-info on';
        box.innerHTML = (s0.ph ? '<div class="map-ph' + cls + '"' + src + '></div>' : '') + '<div class="map-tx"><small style="color:' + COLORS[q.di % COLORS.length] + '">' + esc((o.dayLabel || 'Día') + ' ' + (q.di + 1)) + (s0.pl ? ' · ' + esc(s0.pl) : '') + '</small><b>' + esc(s0.ti) + '</b>' +
          (s0.lead ? '<p>' + esc(s0.lead) + '</p>' : '') + (s0.id ? '<button type="button" class="btn ghost sq" data-goto="' + (q.di + 1) + ':' + esc(s0.id) + '">' + esc(H0.see) + '</button>' : '') + '</div>';
      } else {
        var i = clamp(Math.floor(v), 0, M.legs.length - 1), l = M.legs[i], to = M.seq[i + 1];
        box.className = 'map-info leg';
        box.innerHTML = l && to ? '<svg viewBox="0 0 24 24" class="map-li"><path fill="currentColor" fill-rule="evenodd" d="' + VEH[l.m] + '"/></svg><span>' + esc(H0.to) + ' <b>' + esc(to.s.ti) + '</b> · ' + (l.km >= 10 ? Math.round(l.km) : l.km.toFixed(1).replace('.', o.lang === 'en' ? '.' : ',')) + ' km ' + esc(H0[l.m]) + '</span>' : '';
      }
    }
    // el nombre de la ciudad, grande en el centro del mapa al llegar; luego sube y se queda, más pequeño, con el día
    var cityEl = null, cityKey = '', cityT = 0;
    function cityTitle(overview, where, q, end) {
      if (!cityEl) cityEl = el.querySelector('.map-city');
      cityEl.classList.toggle('end', end);
      if (end) where = H0.fin;
      if ((overview && !end) || !where) { cityEl.classList.remove('on', 'big'); cityKey = ''; clearTimeout(cityT); return; }
      var key = end ? 'end' : where + '|' + q.di; if (key === cityKey) return;
      cityKey = key;
      var old = cityEl.querySelector('.mc-now'); if (old) { old.className = 'mc-old'; setTimeout(function () { if (old.parentNode) old.remove(); }, 450); }
      var d = o.days[q.di] || {}, sub = end ? o.title || '' : (o.dayLabel || 'Día') + ' ' + (q.di + 1) + (d.date ? ' · ' + d.date : ''), n = 0, letters = where.split(' ').map(function (w) { return '<u>' + Array.prototype.map.call(w, function (ch) { return '<i style="--i:' + (n++) + '">' + esc(ch) + '</i>'; }).join('') + '</u>'; }).join(' ');
      cityEl.insertAdjacentHTML('beforeend', '<div class="mc-now"><b aria-label="' + esc(where) + '">' + letters + '</b><small>' + esc(sub) + '</small></div>');
      cityEl.classList.add('on', 'big');
      // el final se queda en grande mientras se ve el viaje entero
      clearTimeout(cityT); if (!end) cityT = setTimeout(function () { cityEl.classList.remove('big'); }, 2300);
    }
    function top(v) {
      var overview = v <= -0.5 || v >= last + 0.5 || ovrT === 1, q = M.seq[clamp(Math.round(v), 0, last)], where = q.city || (q.sight ? '' : q.s.ti) || '';
      cityTitle(overview, where, q, v > last + 0.05);
      allBtn.classList.toggle('on', !overview);
      Array.prototype.forEach.call(el.querySelectorAll('.map-day'), function (b) { b.classList.toggle('on', !overview && +b.getAttribute('data-di') === q.di); });
    }
    function set(v, skipSlider) {
      mem.v = v = clamp(v, -1, last + 1); moved = performance.now();
      if (!skipSlider) rg.value = v;
      info(v); top(v); invalidate();
    }
    function glide(to, ms, done) {
      cancelAnimationFrame(gl);
      var from = mem.v, t0 = performance.now();
      if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) { set(to); if (done) done(); return; }
      (function step(now) {
        var f = clamp((now - t0) / ms, 0, 1), e = (1 - Math.cos(Math.PI * f)) / 2;
        set(from + (to - from) * e);
        if (f < 1) gl = requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    // salto a un sitio lejano: la cámara vuela directa, sin recorrer todas las paradas de en medio
    function goTo(i) {
      stop(); ovrT = 0;
      if (Math.abs(i - mem.v) <= 1.5) { glide(i, 700); return; }
      cancelAnimationFrame(gl);
      var c0 = el._cam; mem.ovr = 0;
      if (c0) { trFrom = c0; tr = 0; }
      set(i);
    }
    // vídeo de la ruta: se graba el propio mapa mientras se reproduce entero
    var recMime = window.MediaRecorder && cv.captureStream ? ['video/mp4', 'video/webm;codecs=vp9', 'video/webm'].filter(function (m) { return MediaRecorder.isTypeSupported(m); })[0] : '', vidBtn = el.querySelector('.map-vid'), recording = false, playEnd = null;
    if (recMime) vidBtn.hidden = false;
    function recordVideo() {
      if (recording) return;
      var stream; try { stream = cv.captureStream(30); } catch (e) { vidBtn.textContent = H0.novid; return; }
      var parts = [], rc = new MediaRecorder(stream, { mimeType: recMime });
      rc.ondataavailable = function (e) { if (e.data && e.data.size) parts.push(e.data); };
      rc.onstop = function () {
        recording = false; vidBtn.textContent = H0.vid;
        var ext = /mp4/.test(recMime) ? 'mp4' : 'webm', bl = new Blob(parts, { type: recMime.split(';')[0] }), name = 'ruta-' + (o.id || 'viaje') + '.' + ext, f = null;
        try { f = new File([bl], name, { type: bl.type }); } catch (e) {}
        if (f && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: name }).catch(function () {}); return; }
        var a = document.createElement('a'), u = URL.createObjectURL(bl); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000);
      };
      recording = true; vidBtn.textContent = H0.rec; mem.ovr = 0; ovrT = 0; set(-1);
      rc.start(500);
      playEnd = function () { playEnd = null; setTimeout(function () { rc.stop(); }, 1800); };
      setTimeout(play, 700);
    }
    vidBtn.addEventListener('click', recordVideo);
    function stop() { playing = false; playBtn.classList.remove('on'); clearTimeout(el._pt); cancelAnimationFrame(gl); if (actor) actor.hide(); }
    // el acompañante (personajes.js): la misma persona todo el viaje, vestida según el país y la estación;
    // en los trayectos va andando o en coche, autobús o avión, y en cada parada hace un gesto
    var actor = null;
    function cast() {
      // solo donde se pide (el mapa del asistente): dentro de la guía, nada de personajes
      if (actor || !o.pj || !window.Pj || !Pj.cast) return actor;
      var cc = null; try { cc = JSON.parse(localStorage.getItem('guia-cc:' + o.id) || 'null'); } catch (e) {}
      actor = Pj.cast(el.querySelector('.map-wrap'), Pj.theme(cc || [], o.start || ''));
      return actor;
    }
    var RIDE = { car: 'coche', plane: 'avion', train: 'bus', bus: 'bus' };
    function gesture(it) {
      var t = (it && it.ti) || '';
      if (/castill|castle|palac|catedral|cathedral|museo|museum|templo|temple|iglesia|church/i.test(t)) return 'act-photo';
      if (it && it.t === 'view' || /lago|loch|lake|mirador|viewpoint|playa|beach|monte|mount|glen|valle|valley/i.test(t)) return 'act-look';
      if (it && (it.t === 'visit' || it.t === 'tour')) return 'act-photo';
      return 'act-wave';
    }
    function legMs(n) {
      if (n <= 0 || n > last) return 1700;
      var km = M.legs[n - 1].km, ms = M.seq[n - 1].sc === M.seq[n].sc ? 1300 : km < 6 ? 1800 : clamp(3000 + km * 12, 3000, 5500);
      // al cambiar de día, tiempo para que se vea anochecer y amanecer
      return M.seq[n - 1].di !== M.seq[n].di ? Math.max(ms, 3200) : ms;
    }
    function play() {
      ovrT = 0; var n = Math.round(mem.v); if (n > last) { mem.ovr = 0; set(-1); n = -1; }
      playing = true; playBtn.classList.add('on');
      var A = cast();
      (function next() {
        if (!playing) return;
        if (n > last) { stop(); if (playEnd) playEnd(); return; }
        n++;
        if (A) {
          if (n === 0) A.show('maleta', 'walk');
          else if (n > last) { A.show('fiesta', 'act-jump'); A.say(H0.fin, 2600); }
          else { var m = M.legs[n - 1] && M.legs[n - 1].m; A.show(RIDE[m] || A.base, RIDE[m] ? 'drive' : 'walk'); }
        }
        glide(n, legMs(n), function () {
          if (A && playing && n >= 0 && n <= last) A.show(A.base, gesture(M.seq[n].s));
          if (A && n > last) setTimeout(function () { if (!playing) A.hide(); }, 3200);
          el._pt = setTimeout(next, 1500);
        });
      })();
    }
    rg.addEventListener('input', function () { stop(); ovrT = 0; set(+rg.value, true); });
    // al soltar, se asienta en el sitio más cercano; al principio del todo, en la vista completa
    rg.addEventListener('change', function () { var x = +rg.value; glide(x < -0.5 ? -1 : x > last + 0.5 ? last + 1 : Math.min(last, Math.round(x)), 300); });
    playBtn.addEventListener('click', function () { if (playing) stop(); else play(); });
    allBtn.addEventListener('click', function () { stop(); ovrT = 1; top(mem.v); invalidate(); });
    cv.addEventListener('click', function (e) {
      var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, hit = null;
      drawn.forEach(function (b) { var d = Math.sqrt(Math.pow(b.x - x, 2) + Math.pow(b.y - y, 2)); if (d < b.r + 5) hit = b; });
      if (hit) goTo(hit.i);
    });
    el.onclick = function (e) { var b = e.target.closest && e.target.closest('[data-mapgo]'); if (b) goTo(+b.getAttribute('data-mapgo')); };
    var ro = window.ResizeObserver ? new ResizeObserver(function () { if (layout()) invalidate(); }) : null;
    if (ro) ro.observe(wrap);
    wake.push(invalidate);
    el._mapOff = function () { dead = true; stop(); cancelAnimationFrame(raf); clearTimeout(tm); if (ro) ro.disconnect(); wake.splice(wake.indexOf(invalidate), 1); };
    set(mem.v);
    paint(performance.now());
    // la silueta se descarga una vez y se recuerda para verla sin conexión
    if (!o.land) {
      var key = 'guia-land:' + (o.id || ''), cached = null;
      try { cached = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) {}
      if (cached) { o.land = cached; invalidate(); }
      else landFor(o.days).then(function (l) {
        if (!l || !l.length) return;
        o.land = l; try { localStorage.setItem(key, JSON.stringify(l)); } catch (e) {}
        invalidate();
      }).catch(function () {});
    }
  }
  return { plane: VEH.plane, mount: mount, corsUrl: corsUrl, isStop: isStop, isSight: isSight, fromTrip: fromTrip, landFor: landFor, atlas: atlas, photoOf: photoOf, kmBetween: kmBetween };
})();
