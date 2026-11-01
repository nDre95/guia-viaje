/* ===== El juego: cartas estilo FC, sobres, colecciones, retos, GPS y fotos propias =====
   Todo se guarda en el dispositivo: localStorage guia-game; las fotos propias, en IndexedDB guia-fotos.
   Dos estados de una carta: «conseguida» (salió en un sobre) y «visitada» (pegada en el álbum; con GPS, verificada).
   Sobres: n = normal (3 cartas), g = oro (al menos una de oro), i = rubí (al menos una esmeralda o rubí). */
window.Juego = (function () {
  'use strict';
  var KEY = 'guia-game', DAILY_MAX = 3;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function get() {
    var g = null; try { g = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    g = g || {}; g.packs = g.packs || { n: 0, g: 0, i: 0 }; g.own = g.own || {}; g.claimed = g.claimed || {};
    return g;
  }
  function save(g) { try { localStorage.setItem(KEY, JSON.stringify(g)); } catch (e) {} }
  function watch(el) { if (window.Lang) Lang.watch(el); return el; }

  /* ---------- La carta: media, categoría, posición y estadísticas ---------- */
  var POS = { palace: 'CAS', ruins: 'RUI', monument: 'MON', sacred: 'TEM', museum: 'MUS', square: 'PLZ', quarter: 'BAR', market: 'MER', show: 'ESP', garden: 'JAR', nature: 'NAT', family: 'FAM' };
  var BONUS = { CAS: [0, 8, 0, -8, 3, 0], RUI: [0, 10, 0, -6, 2, -2], MON: [0, 6, 2, -8, 5, 0], TEM: [0, 6, 6, -10, 2, 0], MUS: [0, 2, 10, -14, -6, 2], PLZ: [0, 0, 0, -12, 4, 6], BAR: [0, 0, 0, -8, 4, 8], MER: [0, -6, -4, -14, 0, 8], ESP: [0, 0, 10, -14, -2, 4], JAR: [0, -8, 0, 8, 4, 2], NAT: [0, -12, -10, 12, 8, 0], FAM: [0, -10, -6, 0, 0, 8], MIR: [0, -8, -6, 8, 10, 0], PAS: [0, 0, -2, 0, 2, 6] };
  var LABELS = ['FAM', 'HIS', 'ART', 'NAT', 'FOT', 'VIS'];
  function hash(s) { var h = 7; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }
  function posOf(it) {
    if (POS[it.k]) return POS[it.k];
    var t = String(it.ti || '');
    if (/castillo|castle|palacio|palace|fortaleza/i.test(t)) return 'CAS';
    if (/catedral|cathedral|iglesia|church|abad|abbey|templo|temple/i.test(t)) return 'TEM';
    if (/museo|museum|galer/i.test(t)) return 'MUS';
    if (/mercado|market/i.test(t)) return 'MER';
    if (it.t === 'view') return 'MIR';
    if (/jard[ií]n|garden|parque|park/i.test(t)) return 'JAR';
    if (/loch|lago|glen|cascada|falls/i.test(t)) return 'NAT';
    return 'PAS';
  }
  // la media sale de la fama real del sitio (visitas a Wikipedia); sin ese dato, de si es imprescindible
  function rate(it) {
    var src = it.src || {}, h = hash(it.id + '|' + it.ti), r;
    if (src.views) r = 58 + 13 * (Math.log(src.views + 1) / Math.LN10 - 3) + Math.min(10, (src.links || 0) / 12) + (it.must ? 6 : 0);
    else r = it.must ? 84 + h % 8 : 62 + h % 18;
    r = Math.max(45, Math.min(99, Math.round(r)));
    var pos = posOf(it), b = BONUS[pos] || BONUS.PAS;
    return { r: r, tier: r >= 91 ? 'ruby' : r >= 86 ? 'emerald' : r >= 80 ? 'gold' : r >= 70 ? 'silver' : 'copper', pos: pos,
      st: LABELS.map(function (l, i) { return [l, Math.max(20, Math.min(99, r + b[i] + (i ? (h >> i) % 9 - 4 : 0)))]; }) };
  }
  var TIER = { copper: 'Cobre', silver: 'Plata', gold: 'Oro', emerald: 'Esmeralda', ruby: 'Rubí' };
  function cardHTML(c, extra) {
    var R = c.rate;
    return '<div class="pk-card t-' + R.tier + '"><span class="fc-b"></span><span class="pk-ph"' + (c.url ? ' style="background-image:url(&quot;' + esc(c.url) + '&quot;)"' : '') + '></span>' +
      '<span class="pk-top"><b>' + R.r + '</b><i>' + R.pos + '</i></span>' + (extra || '') +
      '<span class="pk-n">' + esc(c.ti) + '</span><span class="pk-tier">' + esc(TIER[R.tier]) + '</span>' +
      '<span class="pk-st">' + R.st.map(function (s) { return '<i><b>' + s[1] + '</b>' + s[0] + '</i>'; }).join('') + '</span></div>';
  }

  /* ---------- Avisos ---------- */
  function toast(txt) {
    var el = document.getElementById('jgToast');
    if (!el) { el = document.createElement('div'); el.id = 'jgToast'; el.className = 'jg-toast'; document.body.appendChild(el); watch(el); }
    el.textContent = txt; el.classList.add('on');
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('on'); }, 3400);
  }

  /* ---------- Conseguir sobres ---------- */
  var PACK = { n: 'Sobre', g: 'Sobre de oro', i: 'Sobre rubí' };
  function total(g) { g = g || get(); return g.packs.n + g.packs.g + g.packs.i; }
  function give(kind, why) {
    var g = get(); g.packs[kind]++; save(g);
    toast((why ? why + ': ' : '') + PACK[kind].toLowerCase() + ' +1');
    document.dispatchEvent(new Event('juego:change'));
  }
  // una sola vez por motivo
  function reward(key, kind, why) {
    var g = get(); if (g.claimed[key]) return false;
    g.claimed[key] = 1; g.packs[kind]++; save(g);
    toast((why ? why + ': ' : '') + PACK[kind].toLowerCase() + ' +1');
    document.dispatchEvent(new Event('juego:change'));
    return true;
  }
  // el sobre del día: sin rachas ni castigos; si no entras, se quedan guardados hasta 3
  function claimDaily() {
    var g = get(), d = today(); if (g.daily === d) return false;
    g.daily = d;
    if (g.packs.n < DAILY_MAX) g.packs.n++;
    save(g); return true;
  }
  function onQuiz(hits) { if (hits >= 4) reward('quiz:' + today(), 'n', 'Quiz aprobado'); }
  // al pegar un cromo: cada 3 visitas, un sobre; imprescindibles o viaje completos, sobres mejores
  function onVisit(tripId, list, album, gps) {
    var g = get(); g.visits = (g.visits || 0) + 1; if (gps) g.gps = (g.gps || 0) + 1;
    var day = today(); g.dayV = g.dayV && g.dayV.d === day ? g.dayV : { d: day, n: 0, gps: 0, must: 0 };
    g.dayV.n++; if (gps) g.dayV.gps++;
    var must = list.filter(function (c) { return c.must; }), key = function (c) { return tripId + '|' + c.id; };
    if (must.some(function (c) { var a = album[key(c)]; return a && a.at === day; })) g.dayV.must = 1;
    var bonus = g.visits % 3 === 0; save(g);
    if (bonus) give('n', '3 sitios visitados');
    if (must.length && must.every(function (c) { return album[key(c)]; })) reward('must:' + tripId, 'g', 'Imprescindibles completos');
    if (list.length && list.every(function (c) { return album[key(c)]; })) reward('full:' + tripId, 'i', 'Viaje completo');
    checkChallenges();
  }
  /* ---------- Retos del día (durante un viaje) ---------- */
  function challenges() {
    var g = get(), v = g.dayV && g.dayV.d === today() ? g.dayV : { n: 0, gps: 0, must: 0 };
    return [{ t: 'Visita 2 sitios', done: v.n >= 2 }, { t: 'Verifica uno con GPS', done: v.gps >= 1 }, { t: 'Ve a un imprescindible', done: !!v.must }];
  }
  function checkChallenges() { if (challenges().every(function (c) { return c.done; })) reward('reto:' + today(), 'n', 'Retos del día'); }

  /* ---------- GPS: solo se pide al tocar el botón, y no sale del dispositivo ---------- */
  function kmTo(a, lat, lon) {
    var r = Math.PI / 180, x = (lon - a.longitude) * r * Math.cos((a.latitude + lat) / 2 * r), y = (lat - a.latitude) * r;
    return Math.sqrt(x * x + y * y) * 6371;
  }
  function locate(lat, lon) {
    return new Promise(function (res, rej) {
      if (!navigator.geolocation) return rej(new Error('nogeo'));
      navigator.geolocation.getCurrentPosition(function (p) { res(kmTo(p.coords, lat, lon)); }, rej, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });
  }

  /* ---------- Tus fotos en los cromos ---------- */
  var PH = {}, phP = null;
  function photoDb() {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error('nodb'));
      var q = indexedDB.open('guia-fotos', 1);
      q.onupgradeneeded = function () { q.result.createObjectStore('f'); };
      q.onsuccess = function () { res(q.result); }; q.onerror = function () { rej(q.error); };
    });
  }
  function ready() {
    if (!phP) phP = photoDb().then(function (db) { return new Promise(function (res) {
      var s = db.transaction('f').objectStore('f'), c = s.openCursor();
      c.onsuccess = function () { var k = c.result; if (k) { PH[k.key] = k.value; k.continue(); } else res(); };
      c.onerror = function () { res(); };
    }); }).catch(function () {});
    return phP;
  }
  function photo(key) { return PH[key] || ''; }
  // se reduce antes de guardarla: una foto del móvil llenaría el almacenamiento enseguida
  function savePhoto(key, file) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 900 / Math.max(im.width, im.height)), cv = document.createElement('canvas');
        cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); URL.revokeObjectURL(u);
        var data = cv.toDataURL('image/jpeg', 0.8);
        photoDb().then(function (db) { var tx = db.transaction('f', 'readwrite'); tx.objectStore('f').put(data, key); tx.oncomplete = function () { PH[key] = data; res(data); }; tx.onerror = function () { rej(tx.error); }; }, rej);
      };
      im.onerror = rej; im.src = u;
    });
  }

  /* ---------- Abrir un sobre ---------- */
  var ORDER = ['copper', 'silver', 'gold', 'emerald', 'ruby'], WEIGHT = { copper: 56, silver: 29, gold: 10, emerald: 4, ruby: 1 };
  function draw(kind, pool) {
    var g = get(), picks = [];
    function pick(min) {
      var cand = pool.filter(function (c) { return picks.indexOf(c) < 0 && ORDER.indexOf(c.rate.tier) >= min; });
      if (!cand.length) cand = pool.filter(function (c) { return picks.indexOf(c) < 0; });
      if (!cand.length) cand = pool;
      // mejor las que aún no tienes
      var fresh = cand.filter(function (c) { return !g.own[c.key]; }); if (fresh.length && Math.random() < 0.7) cand = fresh;
      var sum = cand.reduce(function (a, c) { return a + WEIGHT[c.rate.tier]; }, 0), x = Math.random() * sum, out = cand[0];
      cand.some(function (c) { x -= WEIGHT[c.rate.tier]; if (x <= 0) { out = c; return true; } return false; });
      return out;
    }
    if (kind === 'i') picks.push(pick(3));   // esmeralda o rubí else if (kind === 'g') picks.push(pick(2));
    while (picks.length < 3) picks.push(pick(0));
    // de menos a más, para que la mejor salga la última
    return picks.sort(function (a, b) { return a.rate.r - b.rate.r; });
  }
  function openPack(kind, pool, done) {
    var g = get(); if (!g.packs[kind] || !pool.length) return;
    var old = document.getElementById('pkBox'); if (old) old.remove();
    var cards = draw(kind, pool), box = watch(document.createElement('div')), i = -1, news = {};
    g.packs[kind]--;
    cards.forEach(function (c) { var o = g.own[c.key]; if (!o) { g.own[c.key] = { n: 1, at: today() }; news[c.key] = 1; } else o.n = (o.n || 1) + 1; });
    save(g);
    box.id = 'pkBox'; box.className = 'pk k-' + kind;
    function close() { box.remove(); document.dispatchEvent(new Event('juego:change')); if (done) done(); }
    function pack() {
      box.innerHTML = '<div class="pk-in"><button type="button" class="pk-pack sq" data-pk="tear"><span class="pk-foil"></span><span class="pk-lb"><small>Guía de viaje</small><b>' + esc(PACK[kind]) + '</b><small>3 cartas</small></span></button><p class="pk-hint">Toca para abrirlo</p></div>';
    }
    function card() {
      var c = cards[i];
      box.className = 'pk k-' + kind + ' r-' + c.rate.tier;
      box.innerHTML = '<div class="pk-in"><div class="pk-flip">' + cardHTML(c, news[c.key] ? '<em class="pk-new">Nueva</em>' : '<em class="pk-new dup">Repetida</em>') + '</div>' +
        (c.lead ? '<p class="pk-lead">' + esc(c.lead.length > 110 ? c.lead.slice(0, 110).replace(/\s+\S*$/, '') + '…' : c.lead) + '</p>' : '') +
        '<button type="button" class="btn navy sq" data-pk="next">' + (i + 1 < cards.length ? 'Siguiente carta' : 'Ver las tres') + '</button></div>';
    }
    function all() {
      box.className = 'pk k-' + kind;
      box.innerHTML = '<div class="pk-in wide"><div class="pk-three">' + cards.map(function (c) { return cardHTML(c); }).join('') + '</div><button type="button" class="btn navy sq" data-pk="close">Guardar en el álbum</button></div>';
    }
    box.addEventListener('click', function (e) {
      var a = e.target.closest('[data-pk]'); if (!a) return;
      var w = a.getAttribute('data-pk');
      if (w === 'tear') { a.classList.add('torn'); setTimeout(function () { i = 0; card(); }, 620); }
      else if (w === 'next') { i++; if (i < cards.length) card(); else all(); }
      else close();
    });
    pack();
    document.body.appendChild(box);
  }
  // cambiar repetidas: 5 copias de más, un sobre
  function dups(g) { g = g || get(); return Object.keys(g.own).reduce(function (a, k) { return a + Math.max(0, (g.own[k].n || 1) - 1); }, 0); }
  function exchange() {
    var g = get(), left = 5; if (dups(g) < 5) return false;
    Object.keys(g.own).forEach(function (k) { var o = g.own[k]; while (left > 0 && (o.n || 1) > 1) { o.n--; left--; } });
    g.packs.n++; save(g); toast('5 repetidas: sobre +1'); document.dispatchEvent(new Event('juego:change'));
    return true;
  }

  /* ---------- Siguiente destino ---------- */
  var IDEAS = [['Lisboa', 'Lisbon', 'PT'], ['Atenas', 'Athens', 'GR'], ['Islandia', 'Iceland', 'IS'], ['Kioto', 'Kyoto', 'JP'], ['Marrakech', 'Marrakesh', 'MA'], ['Ciudad de México', 'Mexico City', 'MX'], ['Estambul', 'Istanbul', 'TR'], ['Praga', 'Prague', 'CZ'], ['Buenos Aires', 'Buenos Aires', 'AR'], ['Bangkok', 'Bangkok', 'TH'], ['Nueva York', 'New York', 'US'], ['Sídney', 'Sydney', 'AU'], ['Roma', 'Rome', 'IT'], ['París', 'Paris', 'FR']];
  function suggest(known) {
    var list = IDEAS.filter(function (x) { return !known[x[2]]; }); if (!list.length) return null;
    var d = new Date(), pick = list[(d.getFullYear() * 12 + d.getMonth()) % list.length];
    return { name: window.Lang && Lang.get() === 'en' ? pick[1] : pick[0], cc: pick[2] };
  }

  return { get: get, save: save, rate: rate, cardHTML: cardHTML, TIER: TIER, PACK: PACK, toast: toast, total: total, give: give, reward: reward, claimDaily: claimDaily, onQuiz: onQuiz, onVisit: onVisit, challenges: challenges, locate: locate, ready: ready, photo: photo, savePhoto: savePhoto, openPack: openPack, dups: dups, exchange: exchange, suggest: suggest, watch: watch, today: today };
})();
