/* ===== El juego: cromos, rarezas, sobres, retos y fotos propias =====
   Todo se guarda en el dispositivo: localStorage guia-game; las fotos propias, en IndexedDB guia-fotos.
   Un cromo normal se canjea en el sitio, con GPS y tu foto (álbum guia-album). Los sobres solo salen de los quizzes,
   y dan rarezas de cromos que ya tienes: cuantos más aciertos, mejor sobre.
   Rarezas: cobre, plata, oro, esmeralda, rubí (guia-game.own[clave].tier). Sobres: guia-game.bag, cada uno de un viaje (tipo c, s, g, r). */
window.Juego = (function () {
  'use strict';
  var KEY = 'guia-game';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function get() {
    var g = null; try { g = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    g = g || { v: 3 };
    // de versiones anteriores: las cartas que salían sin haber estado allí, fuera; los sobres se guardan sin viaje
    if (g.v === undefined || g.v === 1) { var o0 = g.packs || {}; g = { v: 2, packs: { c: o0.n || 0, s: 0, g: o0.g || 0, r: o0.i || 0 }, own: {}, claimed: {}, backup: g.backup, dayV: g.dayV }; }
    // cada sobre es de un viaje: { k: tipo, t: viaje }. Los de antes, sin viaje (t: ''), sirven para cualquiera
    if (g.v === 2) { var o1 = g.packs || {}; g.bag = []; ['c', 's', 'g', 'r'].forEach(function (k) { for (var n = 0; n < (o1[k] || 0); n++) g.bag.push({ k: k, t: '' }); }); delete g.packs; g.v = 3; }
    g.bag = g.bag || [];
    g.own = g.own || {}; g.claimed = g.claimed || {};
    return g;
  }
  function save(g) { try { localStorage.setItem(KEY, JSON.stringify(g)); } catch (e) {} }
  function watch(el) { if (window.Lang) Lang.watch(el); return el; }

  /* ---------- La carta: media, categoría, posición y estadísticas ---------- */
  var POS = { palace: 'CAS', ruins: 'RUI', monument: 'MON', sacred: 'TEM', museum: 'MUS', square: 'PLZ', quarter: 'BAR', market: 'MER', show: 'ESP', garden: 'JAR', nature: 'NAT', family: 'FAM' };
  var TYPE = { CAS: 'Castillo o palacio', RUI: 'Ruinas', MON: 'Monumento', TEM: 'Templo', MUS: 'Museo', PLZ: 'Plaza', BAR: 'Barrio', MER: 'Mercado', ESP: 'Espectáculo', JAR: 'Jardín', NAT: 'Naturaleza', FAM: 'En familia', MIR: 'Mirador', PAS: 'Paseo' };
  function hash(s) { var h = 7; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }
  function posOf(it) {
    if (POS[it.k]) return POS[it.k];
    var t = String(it.ti || '');
    if (/castillo|castle|palacio|palace|fortaleza/i.test(t)) return 'CAS';
    if (/catedral|cathedral|iglesia|church|abad|abbey|templo|temple/i.test(t)) return 'TEM';
    if (/museo|museum|galer/i.test(t)) return 'MUS';
    if (/\b(mercado|market)\b/i.test(t)) return 'MER';
    if (it.t === 'view') return 'MIR';
    if (/jard[ií]n|garden|parque|park/i.test(t)) return 'JAR';
    if (/loch|lago|glen|cascada|falls/i.test(t)) return 'NAT';
    return 'PAS';
  }
  function rate(it) { var pos = posOf(it); return { pos: pos, type: TYPE[pos] }; }
  // la rareza de un cromo: la mejor que te haya salido en un sobre
  var ORDER = ['base', 'copper', 'silver', 'gold', 'emerald', 'ruby'], RANK = { base: 0, copper: 60, silver: 70, gold: 80, emerald: 86, ruby: 91 };
  function tierOf(key, g) { var o = (g || get()).own[key]; return o && o.tier ? o.tier : 'base'; }
  var TIER = { base: 'Normal', copper: 'Cobre', silver: 'Plata', gold: 'Oro', emerald: 'Esmeralda', ruby: 'Rubí' };
  function cardHTML(c, extra) {
    var R = c.rate;
    return '<div class="pk-card t-' + R.tier + '"><span class="fc-b"></span><span class="pk-ph"' + (c.url ? ' style="background-image:url(&quot;' + esc(c.url) + '&quot;)"' : '') + '></span>' +
      (extra || '') + '<span class="pk-n">' + esc(c.ti) + '</span><span class="pk-tier"><u>' + esc(R.type) + '</u> · <u>' + esc(TIER[R.tier]) + '</u></span></div>';
  }

  /* ---------- Avisos ---------- */
  function toast(txt) {
    var el = document.getElementById('jgToast');
    if (!el) { el = document.createElement('div'); el.id = 'jgToast'; el.className = 'jg-toast'; document.body.appendChild(el); watch(el); }
    el.textContent = txt; el.classList.add('on');
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('on'); }, 3400);
  }

  /* ---------- Conseguir sobres: solo con los quizzes ---------- */
  var PACK = { c: 'Sobre de cobre', s: 'Sobre de plata', g: 'Sobre de oro', r: 'Sobre rubí' };
  var BY_HITS = { 2: 'c', 3: 's', 4: 'g', 5: 'r' };
  function total(g) { return (g || get()).bag.length; }
  // un sobre por viaje y día; cuantos más aciertos, mejor. Devuelve qué sobre ha dado, o nada
  function onQuiz(hits, tripId) {
    var kind = BY_HITS[hits]; if (!kind) return '';
    var g = get(), key = 'quiz:' + today() + ':' + (tripId || ''); if (g.claimed[key]) return '';
    g.claimed[key] = 1; g.bag.push({ k: kind, t: tripId || '' }); save(g);
    document.dispatchEvent(new Event('juego:change'));
    return kind;
  }
  // al canjear un cromo: cuenta para los retos del día
  function onVisit(tripId, list, album) {
    var g = get(), day = today(); g.visits = (g.visits || 0) + 1;
    g.dayV = g.dayV && g.dayV.d === day ? g.dayV : { d: day, n: 0, must: 0 };
    g.dayV.n++;
    if (list.some(function (c) { var a = album[tripId + '|' + c.id]; return c.must && a && String(a.at).slice(0, 10) === day; })) g.dayV.must = 1;
    save(g); document.dispatchEvent(new Event('juego:change'));
  }
  /* ---------- Retos del día (durante un viaje) ---------- */
  function challenges() {
    var g = get(), v = g.dayV && g.dayV.d === today() ? g.dayV : { n: 0, must: 0 };
    return [{ t: 'Canjea 1 cromo', done: v.n >= 1 }, { t: 'Canjea 3 cromos', done: v.n >= 3 }, { t: 'Canjea un imprescindible', done: !!v.must }];
  }

  /* ---------- GPS: solo se pide al tocar el botón, y no sale del dispositivo ---------- */
  function kmTo(a, lat, lon) {
    var r = Math.PI / 180, x = (lon - a.longitude) * r * Math.cos((a.latitude + lat) / 2 * r), y = (lat - a.latitude) * r;
    return Math.sqrt(x * x + y * y) * 6371;
  }
  // da más margen a lo que ocupa mucho: un lago o una ruta no están en un punto
  function radiusOf(it) {
    var t = String(it.ti || '');
    if (it.k === 'nature' || /loch|lago|lake|glen|valle|valley|parque nacional|national park|highland|sierra/i.test(t)) return 5;
    if (it.t === 'view') return 2;
    if (it.k === 'garden' || it.k === 'quarter' || it.k === 'family' || it.t === 'walk' || /parque|park|jard[ií]n|garden|barrio|quarter|ruta|paseo|walk/i.test(t)) return 1.5;
    if (it.k === 'palace' || it.k === 'ruins' || /castillo|castle|palacio|palace|ruinas|ruins/i.test(t)) return 1;
    return 0.5;
  }
  // primero con precisión; si se agota el tiempo, sin ella (bajo techo tarda mucho)
  function locate(lat, lon) {
    function ask(high, ms) {
      return new Promise(function (res, rej) {
        navigator.geolocation.getCurrentPosition(function (p) { res({ km: kmTo(p.coords, lat, lon), acc: p.coords.accuracy || 0 }); }, rej, { enableHighAccuracy: high, timeout: ms, maximumAge: 60000 });
      });
    }
    if (!navigator.geolocation) return Promise.reject({ code: 2 });
    return ask(true, 15000).catch(function (e) { if (e && e.code === 1) throw e; return ask(false, 15000); });
  }
  /* ---------- Canjear un cromo: primero se comprueba dónde estás, luego la foto ---------- */
  var FAR_MAX = 20;   // hasta aquí puede ser un fallo del GPS o del punto guardado; más lejos, no estás allí
  function redeem(it, title, past, done) {
    var old = document.getElementById('qzBox'); if (old) old.remove();
    var box = watch(document.createElement('div')); box.id = 'qzBox'; box.className = 'qz';
    function page(txt, body) {
      box.innerHTML = '<div class="qz-in rd"><div class="qz-top"><span>Canjear cromo</span><button type="button" class="qz-x sq" data-rd="close" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div><h3>' + esc(title) + '</h3><p class="qz-tx">' + esc(txt) + '</p>' + (body || '') + '</div>';
    }
    // estado: gps = comprobado; unv = sin verificar. El botón es un toque nuevo, así Safari deja abrir la cámara
    var gps = false, unv = false;
    function photo(txt) {
      page(txt, '<label class="btn navy sq rd-go">Hacer la foto<input type="file" accept="image/*"' + (past ? '' : ' capture="environment"') + ' data-rdfile hidden></label>');
    }
    function check() {
      page('Buscando tu ubicación…', '<span class="rd-load"></span>');
      locate(it.lat, it.lon).then(function (r) {
        // el margen de error del GPS también cuenta, hasta 300 m
        if (r.km <= radiusOf(it) + Math.min(r.acc, 300) / 1000) { gps = true; photo('Estás aquí. Ahora hazte la foto para canjearlo.'); return; }
        var d = r.km < 10 ? r.km.toFixed(1).replace('.', window.Lang && Lang.get() === 'en' ? '.' : ',') : String(Math.round(r.km));
        page('Estás a ' + d + ' km de este sitio.', '<button type="button" class="btn navy sq rd-go" data-rd="retry">Volver a comprobar</button>' + (r.km <= FAR_MAX ? '<button type="button" class="rd-alt sq" data-rd="unv">Estoy aquí: canjear sin verificar</button>' : ''));
      }, function (e) {
        if (e && e.code === 1) page('La app no tiene permiso para ver tu ubicación.', '<ol class="rd-steps"><li>Abre <b>Ajustes</b> en el iPhone.</li><li>Entra en <b>Privacidad y seguridad</b> y luego en <b>Localización</b>.</li><li>Activa la localización y busca <b>Safari</b> en la lista: elige «Al usar la app».</li><li>Vuelve aquí y comprueba de nuevo.</li></ol><button type="button" class="btn navy sq rd-go" data-rd="retry">Volver a comprobar</button><button type="button" class="rd-alt sq" data-rd="unv">Canjear sin verificar</button>');
        else page('El GPS no consigue situarte. Prueba al aire libre.', '<button type="button" class="btn navy sq rd-go" data-rd="retry">Volver a comprobar</button><button type="button" class="rd-alt sq" data-rd="unv">Canjear sin verificar</button>');
      });
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rd]');
      if (e.target === box || (b && b.getAttribute('data-rd') === 'close')) { box.remove(); return; }
      if (!b) return;
      if (b.getAttribute('data-rd') === 'retry') check();
      else { unv = true; photo('Se marcará como «sin verificar». Hazte la foto para canjearlo.'); }
    });
    box.addEventListener('change', function (e) {
      if (!e.target.matches('[data-rdfile]') || !e.target.files[0]) return;
      var file = e.target.files[0]; box.remove();
      done(file, gps, unv);
    });
    document.body.appendChild(box);
    if (past || it.lat == null) photo(past ? 'Este viaje ya pasó: basta con una foto tuya del sitio.' : 'Hazte la foto para canjearlo.');
    else check();
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

  /* ---------- Abrir un sobre: 3 cromos de los que ya tienes, con una rareza según el sobre ---------- */
  var ODDS = { c: { copper: 75, silver: 25 }, s: { copper: 35, silver: 50, gold: 15 }, g: { silver: 40, gold: 45, emerald: 15 }, r: { gold: 45, emerald: 40, ruby: 15 } };
  function drawTier(kind) {
    var t = ODDS[kind], x = Math.random() * 100, out = 'copper';
    Object.keys(t).some(function (k) { x -= t[k]; if (x <= 0) { out = k; return true; } out = k; return false; });
    return out;
  }
  function draw(kind, pool) {
    var g = get(), left = pool.slice(), picks = [];
    for (var i = 0; i < 3 && left.length; i++) {
      // mejor uno que aún no tenga rareza
      var plain = left.filter(function (c) { return !g.own[c.key]; }), from = plain.length && Math.random() < 0.7 ? plain : left, c = from[Math.floor(Math.random() * from.length)];
      left.splice(left.indexOf(c), 1);
      var tier = drawTier(kind), o = g.own[c.key], was = o && o.tier ? o.tier : 'base', better = RANK[tier] > RANK[was];
      picks.push({ c: Object.assign({}, c, { rate: Object.assign({}, c.rate, { tier: tier, r: RANK[tier] }) }), tier: tier, better: better, was: was, key: c.key });
    }
    return picks.sort(function (a, b) { return RANK[a.tier] - RANK[b.tier]; });
  }
  // abre un sobre de ese tipo y viaje; pool = todos los cromos canjeados: solo valen los de su viaje
  function openPack(kind, tripId, cromos, done) {
    var g = get(), at = -1; g.bag.some(function (b, i) { if (b.k === kind && b.t === tripId) { at = i; return true; } return false; });
    if (at < 0) return;
    var pool = cromos.filter(function (c) { return c.got && (!tripId || c.trip === tripId); });
    if (!pool.length) { toast('Canjea un cromo de este viaje para abrir este sobre'); return; }
    var old = document.getElementById('pkBox'); if (old) old.remove();
    var cards = draw(kind, pool), box = watch(document.createElement('div')), i = -1;
    g.bag.splice(at, 1);
    cards.forEach(function (x) { var o = g.own[x.key] || { tier: 'base', n: 0 }; o.n = (o.n || 0) + 1; if (x.better) o.tier = x.tier; o.at = today(); g.own[x.key] = o; });
    save(g);
    box.id = 'pkBox'; box.className = 'pk k-' + kind;
    function close() { box.remove(); document.dispatchEvent(new Event('juego:change')); if (done) done(); }
    function pack() {
      box.innerHTML = '<div class="pk-in"><button type="button" class="pk-pack sq" data-pk="tear"><span class="pk-foil"></span><span class="pk-lb"><small>Guía de viaje</small><b>' + esc(PACK[kind]) + '</b><small>Mejora tus cromos</small></span></button><p class="pk-hint">Toca para abrirlo</p></div>';
    }
    function card() {
      var x = cards[i];
      box.className = 'pk k-' + kind + ' r-' + x.tier;
      box.innerHTML = '<div class="pk-in"><div class="pk-flip">' + cardHTML(x.c, x.better ? '<em class="pk-new">Mejorado</em>' : '<em class="pk-new dup">Repetido</em>') + '</div>' +
        '<p class="pk-lead">' + esc(x.better ? 'De ' + TIER[x.was] + ' a ' + TIER[x.tier] : 'Ya lo tenías en ' + TIER[x.was]) + '</p>' +
        '<button type="button" class="btn navy sq" data-pk="next">' + (i + 1 < cards.length ? 'Siguiente cromo' : 'Ver todos') + '</button></div>';
    }
    function all() {
      box.className = 'pk k-' + kind;
      box.innerHTML = '<div class="pk-in wide"><div class="pk-three">' + cards.map(function (x) { return cardHTML(x.c); }).join('') + '</div><button type="button" class="btn navy sq" data-pk="close">Guardar en el álbum</button></div>';
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
  // cambiar repetidos: 5 de más, un sobre de cobre
  function dups(g) { g = g || get(); return Object.keys(g.own).reduce(function (a, k) { return a + Math.max(0, (g.own[k].n || 1) - 1); }, 0); }
  function exchange() {
    var g = get(), left = 5, from = ''; if (dups(g) < 5) return false;
    // el sobre es del viaje del que salen los repetidos
    Object.keys(g.own).forEach(function (k) { var o = g.own[k]; while (left > 0 && (o.n || 1) > 1) { o.n--; left--; from = from || k.slice(0, k.indexOf('|')); } });
    g.bag.push({ k: 'c', t: from }); save(g); toast('5 repetidos: sobre de cobre +1'); document.dispatchEvent(new Event('juego:change'));
    return true;
  }
  // ¿ya pasó el viaje? Entonces no se puede pedir estar allí: basta la foto
  function isPast(start, days) { if (!start) return false; var e = new Date(start + 'T12:00:00Z'); e.setUTCDate(e.getUTCDate() + Math.max(0, days - 1)); return e.toISOString().slice(0, 10) < today(); }

  /* ---------- Siguiente destino ---------- */
  var IDEAS = [['Lisboa', 'Lisbon', 'PT'], ['Atenas', 'Athens', 'GR'], ['Islandia', 'Iceland', 'IS'], ['Kioto', 'Kyoto', 'JP'], ['Marrakech', 'Marrakesh', 'MA'], ['Ciudad de México', 'Mexico City', 'MX'], ['Estambul', 'Istanbul', 'TR'], ['Praga', 'Prague', 'CZ'], ['Buenos Aires', 'Buenos Aires', 'AR'], ['Bangkok', 'Bangkok', 'TH'], ['Nueva York', 'New York', 'US'], ['Sídney', 'Sydney', 'AU'], ['Roma', 'Rome', 'IT'], ['París', 'Paris', 'FR']];
  function suggest(known) {
    var list = IDEAS.filter(function (x) { return !known[x[2]]; }); if (!list.length) return null;
    var d = new Date(), pick = list[(d.getFullYear() * 12 + d.getMonth()) % list.length];
    return { name: window.Lang && Lang.get() === 'en' ? pick[1] : pick[0], cc: pick[2] };
  }

  return { get: get, save: save, rate: rate, tierOf: tierOf, RANK: RANK, cardHTML: cardHTML, TIER: TIER, PACK: PACK, BY_HITS: BY_HITS, toast: toast, total: total, onQuiz: onQuiz, onVisit: onVisit, challenges: challenges, redeem: redeem, radiusOf: radiusOf, locate: locate, ready: ready, photo: photo, savePhoto: savePhoto, openPack: openPack, dups: dups, exchange: exchange, suggest: suggest, watch: watch, today: today, isPast: isPast };
})();
