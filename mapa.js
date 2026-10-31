/* ===== Mapa del viaje: diseño minimalista, no un mapa copiado =====
   Solo una silueta lisa de la tierra (Natural Earth, dominio público, vía world-atlas), sin fronteras ni islitas,
   la ruta de un color por día y pines con la foto de cada sitio pasada a dibujo a lápiz.
   Un slider mueve la bolita naranja por toda la ruta: cada tramo se dibuja según cómo se hace (avión en arco, coche en
   puntitos, tren como una vía, a pie…) y al llegar a un sitio se despliegan su foto y su descripción.
   Sin librerías. Mapa.mount(el, { days, land, title, id, mode, photos, dayLabel, heading, lang }) */
window.Mapa = (function () {
  'use strict';
  var COLORS = ['#d9622b', '#2b6ea3', '#3f8f5b', '#9b4fa8', '#c2962a', '#c0394b', '#1f8a8a', '#6b7fb3', '#8a5a2b', '#444c5e'];
  var W = 800, R = 40, uid = 0, ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function kmBetween(a, b) {
    var r = Math.PI / 180, x = (b.lon - a.lon) * r * Math.cos((a.lat + b.lat) / 2 * r), y = (b.lat - a.lat) * r;
    return Math.sqrt(x * x + y * y) * 6371;
  }
  // azar repetible: el dibujo sale igual cada vez
  function rnd(seed) { var s = seed * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

  /* ---------- Qué sale en el mapa ---------- */
  function isSight(it) { return !!it && ['visit', 'walk', 'view', 'tour', 'night'].indexOf(it.t) >= 0 && !it.hidden && !it.hole && it.lat != null && !/aeropuerto|airport/i.test(it.ti); }
  function fromTrip(trip) { return trip.days.map(function (d) { return { title: d.title, jump: d.items.some(function (i) { return i.jump; }), stops: d.items.filter(isSight) }; }); }
  function weight(s) { return (s.must ? 1e7 : 0) + ((s.src || {}).views || 0) + ((s.src || {}).links || 0) * 50 + (s.ph || s.sk ? 500 : 0); }
  // los sitios con dibujo: los más representativos de cada día
  function pickPins(days) {
    var per = days.length <= 2 ? 3 : days.length <= 5 ? 2 : 1, out = [];
    days.forEach(function (d, di) {
      d.stops.slice().sort(function (a, b) { return weight(b) - weight(a); }).slice(0, per).forEach(function (s) { out.push({ s: s, di: di }); });
    });
    return out;
  }

  /* ---------- Dibujo a lápiz a partir de una foto ---------- */
  var SK = {};
  // Special:FilePath de Wikimedia no deja leer la imagen desde la página: se pide su dirección directa, que sí
  function corsUrl(src) {
    var m = /commons\.wikimedia\.org\/wiki\/Special:FilePath\/([^?]+)/.exec(src);
    if (!m) return Promise.resolve(src);
    return fetch('https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&iiurlwidth=320&titles=File:' + m[1])
      .then(function (r) { return r.json(); }).then(function (j) {
        var pg = j.query.pages, i = pg[Object.keys(pg)[0]].imageinfo[0];
        return i.thumburl || i.url;
      });
  }
  function sketch(src) {
    if (SK[src]) return SK[src];
    SK[src] = corsUrl(src).then(function (direct) { return new Promise(function (res, rej) {
      var im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = function () {
        try {
          var n = 140, cv = document.createElement('canvas'); cv.width = cv.height = n;
          var g = cv.getContext('2d', { willReadFrequently: true }), k = Math.max(n / im.width, n / im.height), w = im.width * k, h = im.height * k;
          g.drawImage(im, (n - w) / 2, (n - h) / 2, w, h);
          var d = g.getImageData(0, 0, n, n), p = d.data, gray = new Float32Array(n * n), i;
          for (i = 0; i < n * n; i++) gray[i] = 0.3 * p[i * 4] + 0.59 * p[i * 4 + 1] + 0.11 * p[i * 4 + 2];
          // lápiz: la imagen dividida por su negativo desenfocado deja solo los trazos
          var blur = boxBlur(gray.map(function (v) { return 255 - v; }), n, 3);
          for (i = 0; i < n * n; i++) {
            var v = Math.min(255, gray[i] * 255 / Math.max(1, 255 - blur[i]));
            v = Math.pow(v / 255, 2.4) * 255;   // trazos más marcados
            p[i * 4] = 40 + v * 0.84; p[i * 4 + 1] = 34 + v * 0.83; p[i * 4 + 2] = 28 + v * 0.78;
          }
          g.putImageData(d, 0, 0);
          res(cv.toDataURL('image/jpeg', 0.72));
        } catch (e) { rej(e); }
      };
      im.onerror = rej; im.src = direct;
    }); });
    SK[src].catch(function () { delete SK[src]; });
    return SK[src];
  }
  function boxBlur(a, n, r) {
    var b = new Float32Array(a.length), c = new Float32Array(a.length), x, y, s, q;
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) { s = 0; q = 0; for (var i = -r; i <= r; i++) { var xx = x + i; if (xx >= 0 && xx < n) { s += a[y * n + xx]; q++; } } b[y * n + x] = s / q; }
    for (x = 0; x < n; x++) for (y = 0; y < n; y++) { s = 0; q = 0; for (var j = -r; j <= r; j++) { var yy = y + j; if (yy >= 0 && yy < n) { s += b[yy * n + x]; q++; } } c[y * n + x] = s / q; }
    return c;
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

  /* ---------- El dibujo ---------- */
  // curva suave por varios puntos
  function curve(p, closed) {
    if (p.length < 2) return '';
    var d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1), n = p.length;
    for (var i = 0; i < (closed ? n : n - 1); i++) {
      var a = p[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], b = p[i], c = p[closed ? (i + 1) % n : i + 1], e = p[closed ? (i + 2) % n : Math.min(n - 1, i + 2)];
      d += 'C' + (b[0] + (c[0] - a[0]) / 6).toFixed(1) + ' ' + (b[1] + (c[1] - a[1]) / 6).toFixed(1) + ' ' + (c[0] - (e[0] - b[0]) / 6).toFixed(1) + ' ' + (c[1] - (e[1] - b[1]) / 6).toFixed(1) + ' ' + c[0].toFixed(1) + ' ' + c[1].toFixed(1);
    }
    return d + (closed ? 'Z' : '');
  }
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
  var HOW = { es: { plane: 'en avión', car: 'en coche', train: 'en tren o autobús', bus: 'en transporte público', walk: 'a pie', to: 'Hacia', see: 'Ver en el día', hint: 'Mueve la bolita por la ruta', play: 'Reproducir el viaje' },
    en: { plane: 'by plane', car: 'by car', train: 'by train or coach', bus: 'by public transport', walk: 'on foot', to: 'To', see: 'See in the day', hint: 'Slide the ball along the route', play: 'Play the trip' } };
  function draw(o) {
    var days = o.days.filter(function (d) { return true; }), all = [];
    days.forEach(function (d) { d.stops.forEach(function (s) { all.push(s); }); });
    if (!all.length) return '';
    var id = 'm' + (++uid), b = boundsOf(all), lat0 = (b.s + b.n) / 2, cs = Math.cos(lat0 * Math.PI / 180), rand = rnd(all.length + 7);
    var spanX = Math.max((b.e - b.w) * cs, 0.004), spanY = Math.max(b.n - b.s, 0.004), H = Math.round(W * clamp(spanY / spanX, 0.85, 1.25)), pad = 100, top = 110;
    var k = Math.min((W - pad * 2) / spanX, (H - pad - top) / spanY), cx = (b.w + b.e) / 2, cy = (b.s + b.n) / 2, midY = (H + top - pad) / 2 + 12;
    function X(lon) { return W / 2 + (lon - cx) * cs * k; }
    function Y(lat) { return midY - (lat - cy) * k; }
    var svg = '<svg class="map-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.title || 'Mapa del viaje') + '">';
    svg += '<rect class="map-sea" width="' + W + '" height="' + H + '"/>';
    (o.land || []).forEach(function (r) {
      // formas suaves y sin detalle: se quitan las islitas y los recortes de la costa
      // lo que cruza el meridiano 180 (Rusia) daría una franja de lado a lado: se queda el lado mayoritario
      var east = r.filter(function (c) { return c[0] > 0; }).length * 2 > r.length;
      var ring = r.some(function (c, i) { return i && Math.abs(c[0] - r[i - 1][0]) > 180; }) ? r.filter(function (c) { return east ? c[0] > 0 : c[0] < 0; }) : r;
      var q = simplify(ring.map(function (c) { return [X(c[0]), Y(c[1])]; }), 5);
      var xs = q.map(function (c) { return c[0]; }), ys = q.map(function (c) { return c[1]; });
      if (q.length < 4 || Math.max.apply(null, xs) - Math.min.apply(null, xs) + Math.max.apply(null, ys) - Math.min.apply(null, ys) < 46) return;
      svg += '<path class="map-land" d="' + curve(q, true) + '"/>';
    });
    // toda la ruta, parada a parada, con cómo se hace cada tramo
    var seq = [], legs = [];
    days.forEach(function (d, di) { d.stops.forEach(function (st, si) { seq.push({ s: st, di: di, si: si, x: X(st.lon), y: Y(st.lat), jump: !si && d.jump }); }); });
    seq.slice(1).forEach(function (q, n) {
      var a0 = seq[n], len = Math.sqrt(Math.pow(q.x - a0.x, 2) + Math.pow(q.y - a0.y, 2)), m = legMode(a0, q, o.mode);
      // el avión vuela en arco; lo demás, una curva suave
      var bulge = m === 'plane' ? Math.max(70, len * 0.32) : len * 0.07, cxx = (a0.x + q.x) / 2 + (q.y - a0.y) / (len || 1) * bulge * (q.x >= a0.x ? -1 : 1), cyy = (a0.y + q.y) / 2 - Math.abs(q.x - a0.x) / (len || 1) * bulge;
      legs.push({ m: m, ax: a0.x, ay: a0.y, cx: cxx, cy: cyy, bx: q.x, by: q.y, di: q.di, km: kmBetween(a0.s, q.s) });
    });
    legs.forEach(function (l, n) {
      // de un día al siguiente en la misma zona se duerme, no se viaja: no se dibuja
      if (seq[n].di !== seq[n + 1].di && l.km < 60 && l.m !== 'train') return;
      var col = COLORS[l.di % COLORS.length], d0 = 'M' + l.ax.toFixed(1) + ' ' + l.ay.toFixed(1) + 'Q' + l.cx.toFixed(1) + ' ' + l.cy.toFixed(1) + ' ' + l.bx.toFixed(1) + ' ' + l.by.toFixed(1);
      svg += (
        l.m === 'plane' ? '<path d="' + d0 + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-dasharray="16 11" stroke-linecap="round"/>' :
        l.m === 'car' ? '<path d="' + d0 + '" fill="none" stroke="' + col + '" stroke-width="7.5" stroke-dasharray="0.1 15" stroke-linecap="round"/>' :
        l.m === 'train' ? '<path d="' + d0 + '" fill="none" stroke="' + col + '" stroke-width="6"/><path class="map-rail" d="' + d0 + '" fill="none" stroke-width="3" stroke-dasharray="9 9"/>' :
        l.m === 'bus' ? '<path d="' + d0 + '" fill="none" stroke="' + col + '" stroke-width="5" stroke-dasharray="20 8" stroke-linecap="round"/>' :
        '<path d="' + d0 + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-dasharray="0.1 8" stroke-linecap="round"/>');
    });
    seq.forEach(function (q) { svg += '<circle cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="6" fill="' + COLORS[q.di % COLORS.length] + '"/>'; });
    // pines: se separan para que no se pisen, con una línea hasta su sitio
    var pins = pickPins(days).map(function (q) { var x = X(q.s.lon), y = Y(q.s.lat); return { s: q.s, di: q.di, ax: x, ay: y, x: x + (rand() - 0.5) * 4, y: y - R - 16 }; });
    var bw = R * 2 + 10, bh = R * 2 + 10;
    for (var it = 0; it < 220; it++) {
      pins.forEach(function (a, ia) {
        pins.forEach(function (c, ic) {
          if (ic <= ia) return;
          var dx = c.x - a.x, dy = c.y - a.y, ox2 = bw - Math.abs(dx), oy2 = bh - Math.abs(dy);
          if (ox2 > 0 && oy2 > 0) {
            if (ox2 < oy2) { var m1 = (dx >= 0 ? 1 : -1) * ox2 / 2 + 0.01; a.x -= m1; c.x += m1; }
            else { var m2 = (dy >= 0 ? 1 : -1) * oy2 / 2 + 0.01; a.y -= m2; c.y += m2; }
          }
        });
        a.x += (a.ax - a.x) * 0.006; a.y += (a.ay - R - 16 - a.y) * 0.006;
        a.x = clamp(a.x, bw / 2 + 2, W - bw / 2 - 2); a.y = clamp(a.y, R + 8, H - R - 8);
      });
    }
    pins.forEach(function (q, n) {
      var col = COLORS[q.di % COLORS.length], clip = id + 'c' + n;
      svg += '<g class="map-pin" data-mapgo="' + seq.map(function (z) { return z.s; }).indexOf(q.s) + '">' +
        '<path d="M' + q.ax.toFixed(1) + ' ' + q.ay.toFixed(1) + 'L' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + '" stroke="' + col + '" stroke-width="2.5"/>' +
        '<clipPath id="' + clip + '"><circle cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="' + (R - 4) + '"/></clipPath>' +
        '<circle cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="' + R + '" fill="#fbf7ec" stroke="' + col + '" stroke-width="5"/>' +
        '<svg x="' + (q.x - 27).toFixed(1) + '" y="' + (q.y - 27).toFixed(1) + '" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#5b5038" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="' + ICONS[iconFor(q.s)] + '"/></svg>' +
        '<image class="map-sk" data-n="' + n + '" x="' + (q.x - R + 4).toFixed(1) + '" y="' + (q.y - R + 4).toFixed(1) + '" width="' + (R * 2 - 8) + '" height="' + (R * 2 - 8) + '" clip-path="url(#' + clip + ')" preserveAspectRatio="xMidYMid slice" opacity="0"' + (q.s.sk ? ' href="' + q.s.sk + '" style="opacity:1"' : '') + '/></g>';
    });
    svg +=       '<g class="map-ball"><circle class="map-halo" r="28" fill="#e2782f" opacity=".25"/><circle r="22" fill="#e2782f" stroke="#fff" stroke-width="3.5"/><g class="map-veh"><path fill="#fff" fill-rule="evenodd" d=""/></g></g></svg>';
    return { svg: svg, pins: pins, seq: seq, legs: legs };
  }

  /* ---------- Colocarlo en la página: mapa, slider y ficha de cada sitio ---------- */
  var MEM = {};   // en qué punto se quedó, aunque la página se vuelva a pintar
  function mount(el, o) {
    if (!el) return;
    var H0 = HOW[o.lang === 'en' ? 'en' : 'es'], R0 = null, raf = 0, playing = false, lastInfo = '', key0 = o.id || 'x';
    function t() { return MEM[key0] || 0; }
    function posAt(v) {
      var n = R0.legs.length, i = Math.min(n - 1, Math.floor(v)), f = v - i, l = R0.legs[i];
      if (!l) return { x: R0.seq[0].x, y: R0.seq[0].y, a: 0, m: 'walk' };
      var u = 1 - f, x = u * u * l.ax + 2 * u * f * l.cx + f * f * l.bx, y = u * u * l.ay + 2 * u * f * l.cy + f * f * l.by;
      var dx = 2 * u * (l.cx - l.ax) + 2 * f * (l.bx - l.cx), dy = 2 * u * (l.cy - l.ay) + 2 * f * (l.by - l.cy);
      return { x: x, y: y, a: Math.atan2(dy, dx) * 180 / Math.PI, m: l.m, right: dx >= 0 };
    }
    function info(v) {
      var box = el.querySelector('.map-info'), near = Math.round(v), at = Math.abs(v - near) < 0.07, q = R0.seq[near], key = at ? 's' + near : 'l' + Math.floor(v);
      if (key === lastInfo) return; lastInfo = key;
      if (at) {
        var s0 = q.s, src = s0.ph && o.photos && o.photos[s0.ph] ? ' style="background-image:url(&quot;' + esc(o.photos[s0.ph]) + '&quot;)"' : '', cls = s0.ph && !src ? ' ph ph-' + s0.ph : '';
        box.className = 'map-info on';
        box.innerHTML = (s0.ph ? '<div class="map-ph' + cls + '"' + src + '></div>' : '') + '<div class="map-tx"><small style="color:' + COLORS[q.di % COLORS.length] + '">' + esc((o.dayLabel || 'Día') + ' ' + (q.di + 1)) + (s0.pl ? ' · ' + esc(s0.pl) : '') + '</small><b>' + esc(s0.ti) + '</b>' +
          (s0.lead ? '<p>' + esc(s0.lead) + '</p>' : '') + (s0.id ? '<button type="button" class="btn ghost sq" data-goto="' + (q.di + 1) + ':' + esc(s0.id) + '">' + esc(H0.see) + '</button>' : '') + '</div>';
      } else {
        var l = R0.legs[Math.floor(v)], to = R0.seq[Math.floor(v) + 1];
        box.className = 'map-info leg';
        box.innerHTML = l && to ? '<svg viewBox="0 0 24 24" class="map-li"><path fill="currentColor" fill-rule="evenodd" d="' + VEH[l.m] + '"/></svg><span>' + esc(H0.to) + ' <b>' + esc(to.s.ti) + '</b> · ' + (l.km >= 10 ? Math.round(l.km) : l.km.toFixed(1).replace('.', o.lang === 'en' ? '.' : ',')) + ' km ' + esc(H0[l.m]) + '</span>' : '';
      }
    }
    function set(v, skipSlider) {
      v = clamp(v, 0, R0.seq.length - 1); MEM[key0] = v;
      var P = posAt(v), ball = el.querySelector('.map-ball'), veh = el.querySelector('.map-veh'), path = veh.firstChild;
      ball.setAttribute('transform', 'translate(' + P.x.toFixed(1) + ' ' + P.y.toFixed(1) + ')');
      if (path.getAttribute('d') !== VEH[P.m]) path.setAttribute('d', VEH[P.m]);
      // el avión apunta adonde va; el coche y el resto, mirando hacia su lado
      veh.setAttribute('transform', P.m === 'plane' ? 'rotate(' + P.a.toFixed(0) + ') translate(-14 -14) scale(1.17)' : P.m === 'car' && !P.right ? 'scale(-1 1) translate(-14 -14) scale(1.17)' : 'translate(-14 -14) scale(1.17)');
      if (!skipSlider) el.querySelector('.map-range').value = v;
      info(v);
    }
    function glide(to, ms, done) {
      cancelAnimationFrame(raf);
      var from = t(), t0 = performance.now();
      if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) { set(to); if (done) done(); return; }
      (function step(now) {
        var f = clamp((now - t0) / ms, 0, 1), e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
        set(from + (to - from) * e);
        if (f < 1) raf = requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    function stop() { playing = false; var b = el.querySelector('.map-play'); if (b) { b.classList.remove('on'); } clearTimeout(el._pt); cancelAnimationFrame(raf); }
    function play() {
      var n = Math.round(t()); if (n >= R0.seq.length - 1) { set(0); n = 0; }
      playing = true; el.querySelector('.map-play').classList.add('on');
      (function next() {
        if (!playing) return;
        if (n >= R0.seq.length - 1) { stop(); return; }
        n++; glide(n, 1100, function () { el._pt = setTimeout(next, 1700); });
      })();
    }
    function paint() {
      var r = draw(o); if (!r) { el.innerHTML = ''; return; }
      R0 = r; lastInfo = '';
      var last = r.seq.length - 1, used = [], stops = r.seq.map(function (q, i) { return COLORS[q.di % COLORS.length] + ' ' + (last ? (i / last * 100).toFixed(1) : 0) + '%'; });
      r.seq.forEach(function (q, i) { if (!used.some(function (u) { return u.di === q.di; })) used.push({ di: q.di, i: i, title: o.days[q.di].title }); });
      el.innerHTML = '<div class="card map-card">' + (o.heading ? '<div class="eyebrow">' + esc(o.heading) + '</div>' : '') + '<div class="map-wrap">' + r.svg + '</div>' +
        '<div class="map-ctl"><button type="button" class="map-play sq" aria-label="' + esc(H0.play) + '"><svg viewBox="0 0 24 24"><path class="pl" fill="currentColor" d="M7 4v16l13-8z"/><path class="pa" fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg></button>' +
        '<input class="map-range" type="range" min="0" max="' + last + '" step="0.005" value="' + t() + '" aria-label="' + esc(H0.hint) + '" style="--track:linear-gradient(90deg,' + (stops.length > 1 ? stops.join(',') : COLORS[0] + ',' + COLORS[0]) + ')"></div>' +
        '<div class="map-info"></div>' +
        '<div class="map-leg">' + used.map(function (x) { return '<button type="button" class="map-day" data-mapgo="' + x.i + '"><i style="background:' + COLORS[x.di % COLORS.length] + '"></i>' + esc((o.dayLabel || 'Día') + ' ' + (x.di + 1)) + (x.title ? ' · ' + esc(x.title) : '') + '</button>'; }).join('') + '</div></div>';
      r.pins.forEach(function (q, n) {
        if (q.s.sk) return;
        var src = photoOf(q.s, o.photos); if (!src) return;
        sketch(src).then(function (u) { var im = el.querySelector('.map-sk[data-n="' + n + '"]'); if (im) { im.setAttribute('href', u); im.style.opacity = 1; } }).catch(function () {});
      });
      var rg = el.querySelector('.map-range');
      rg.addEventListener('input', function () { stop(); cancelAnimationFrame(raf); set(+rg.value, true); });
      // al soltar, se asienta en el sitio más cercano
      rg.addEventListener('change', function () { glide(Math.round(+rg.value), 280); });
      el.querySelector('.map-play').addEventListener('click', function () { if (playing) stop(); else play(); });
      set(Math.min(t(), last));
    }
    paint();
    el.onclick = function (e) {
      var g = e.target.closest && e.target.closest('[data-mapgo]'); if (!g) return;
      stop(); glide(+g.getAttribute('data-mapgo'), 700);
    };
    // la silueta se descarga una vez y se recuerda para verla sin conexión
    if (!o.land) {
      var key = 'guia-land:' + (o.id || ''), cached = null;
      try { cached = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) {}
      if (cached) { o.land = cached; paint(); }
      else landFor(o.days).then(function (l) {
        if (!l || !l.length) return;
        o.land = l; try { localStorage.setItem(key, JSON.stringify(l)); } catch (e) {}
        paint();
      }).catch(function () {});
    }
  }
  return { mount: mount, corsUrl: corsUrl, fromTrip: fromTrip, landFor: landFor, sketch: sketch, pickPins: pickPins, photoOf: photoOf };
})();
