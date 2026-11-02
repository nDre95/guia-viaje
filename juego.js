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
  // MODO PRUEBA (lo pidió el usuario el 2 nov 2026, para trastear): los cromos se canjean a mano y hay quiz de
  // cualquier viaje, aunque no haya empezado. Para volver a las reglas normales: TEST = false
  var TEST = true;
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
      if (TEST && !check.asked) { check.asked = 1; page('Modo prueba: puedes canjearlo sin estar allí.', '<button type="button" class="btn navy sq rd-go" data-rd="test">Canjear ya</button><button type="button" class="rd-alt sq" data-rd="retry">Comprobar mi ubicación</button>'); return; }
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
      if (b.getAttribute('data-rd') === 'test') { box.remove(); done(null, false, true); return; }
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
  // sin repetidos: cada cromo sale como mucho una vez por sobre y siempre sube de rareza. Si la rareza que toca
  // no mejora ninguno, el de menos rareza sube un escalón; los que ya son rubí no salen
  var ORDER = ['base', 'copper', 'silver', 'gold', 'emerald', 'ruby'];
  function draw(kind, pool) {
    var g = get(), left = pool.slice(), picks = [];
    function was(c) { var o = g.own[c.key]; return o && o.tier ? o.tier : 'base'; }
    for (var i = 0; i < 3; i++) {
      var tier = drawTier(kind), up = left.filter(function (c) { return RANK[tier] > RANK[was(c)]; }), c;
      if (up.length) c = up[Math.floor(Math.random() * up.length)];
      else {
        var low = left.filter(function (x) { return was(x) !== 'ruby'; }).sort(function (a, b) { return RANK[was(a)] - RANK[was(b)]; });
        if (!low.length) break;
        c = low[0]; tier = ORDER[ORDER.indexOf(was(c)) + 1];
      }
      left.splice(left.indexOf(c), 1);
      picks.push({ c: Object.assign({}, c, { rate: Object.assign({}, c.rate, { tier: tier, r: RANK[tier] }) }), tier: tier, better: true, was: was(c), key: c.key });
    }
    return picks.sort(function (a, b) { return RANK[a.tier] - RANK[b.tier]; });
  }
  // el sobre recién ganado: cae girando, con luz y destellos alrededor; se gira con el dedo. onOpen = abrirlo ya
  function presentPack(kind, tripTitle, onOpen) {
    var old = document.getElementById('pk3Box'); if (old) old.remove();
    var box = watch(document.createElement('div')), sp = '';
    for (var k = 0; k < 14; k++) sp += '<i style="--a:' + (k * 360 / 14 + Math.random() * 14).toFixed(0) + 'deg;--d:' + (118 + Math.random() * 70).toFixed(0) + 'px;--t:' + (Math.random() * 2.4).toFixed(2) + 's"></i>';
    box.id = 'pk3Box'; box.className = 'pk3 k-' + kind;
    box.innerHTML = '<div class="pk3-stage"><span class="pk3-rays"></span><span class="pk3-ring"></span><span class="pk3-sp">' + sp + '</span>' +
      '<div class="pk3-w"><div class="pk3-b"><div class="pk3-f"><span class="pk-foil"></span><span class="pk3-gl"></span><span class="pk-lb"><small>Guía de viaje</small><b>' + esc(PACK[kind]) + '</b><small>' + esc(tripTitle || 'Mejora tus cromos') + '</small></span></div>' +
      '<div class="pk3-k"><span class="pk3-gl"></span><span class="pk3-logo">G</span><small>Guía de viaje</small></div></div></div></div>' +
      '<div class="pk3-txt"><b>' + esc(PACK[kind]) + ' conseguido</b><p>Gíralo con el dedo</p>' +
      (onOpen ? '<button type="button" class="btn navy sq" data-p3="open">Abrir ahora</button>' : '') + '<button type="button" class="btn ghost sq" data-p3="keep">Guardar para luego</button></div>';
    var b = box.querySelector('.pk3-b'), st = { rx: 0, ry: 0, d: null };
    function set(rx, ry, snap) {
      st.rx = rx; st.ry = ry; b.classList.toggle('snap', !!snap);
      b.style.setProperty('--rx', rx.toFixed(1) + 'deg'); b.style.setProperty('--ry', ry.toFixed(1) + 'deg');
      b.style.setProperty('--gx', (50 + ((ry % 180) + 180) % 180 / 1.8 - 25).toFixed(0) + '%');
    }
    b.addEventListener('pointerdown', function (e) { st.d = { x: e.clientX, y: e.clientY, ry: st.ry }; box.classList.add('held'); try { b.setPointerCapture(e.pointerId); } catch (er) {} });
    b.addEventListener('pointermove', function (e) { if (!st.d) return; set(Math.max(-30, Math.min(30, -(e.clientY - st.d.y) * 0.35)), st.d.ry + (e.clientX - st.d.x) * 0.6); });
    function up() { if (!st.d) return; st.d = null; box.classList.remove('held'); set(0, Math.round(st.ry / 180) * 180, true); }
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
    box.addEventListener('click', function (e) {
      var a = e.target.closest('[data-p3]'); if (!a) return;
      box.classList.add('out'); setTimeout(function () { box.remove(); }, 260);
      if (a.getAttribute('data-p3') === 'open' && onOpen) onOpen();
    });
    document.body.appendChild(box);
  }
  // abre un sobre de ese tipo y viaje; pool = todos los cromos canjeados: solo valen los de su viaje
  function openPack(kind, tripId, cromos, done) {
    var g = get(), at = -1; g.bag.some(function (b, i) { if (b.k === kind && b.t === tripId) { at = i; return true; } return false; });
    if (at < 0) return;
    var pool = cromos.filter(function (c) { return c.got && (!tripId || c.trip === tripId); });
    if (!pool.length) { toast('Canjea un cromo de este viaje para abrir este sobre'); return; }
    var old = document.getElementById('pkBox'); if (old) old.remove();
    var cards = draw(kind, pool), box = watch(document.createElement('div')), i = -1;
    if (!cards.length) { toast('Todos los cromos canjeados de este viaje ya son rubí'); return; }
    g.bag.splice(at, 1);
    cards.forEach(function (x) { var o = g.own[x.key] || { tier: 'base' }; delete o.n; o.tier = x.tier; o.at = today(); g.own[x.key] = o; });
    save(g);
    box.id = 'pkBox'; box.className = 'pk k-' + kind;
    function close() { box.remove(); document.dispatchEvent(new Event('juego:change')); if (done) done(); }
    function pack() {
      box.innerHTML = '<div class="pk-in"><button type="button" class="pk-pack sq" data-pk="tear"><span class="pk-foil"></span><span class="pk-lb"><small>Guía de viaje</small><b>' + esc(PACK[kind]) + '</b><small>Mejora tus cromos</small></span></button><p class="pk-hint">Toca para abrirlo</p></div>';
    }
    function card() {
      var x = cards[i];
      box.className = 'pk k-' + kind + ' r-' + x.tier;
      box.innerHTML = '<div class="pk-in"><div class="pk-flip">' + cardHTML(x.c, '<em class="pk-new">Mejorado</em>') + '</div>' +
        '<p class="pk-lead">' + esc('De ' + TIER[x.was] + ' a ' + TIER[x.tier]) + '</p>' +
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
  // ¿ya pasó el viaje? Entonces no se puede pedir estar allí: basta la foto
  function isPast(start, days) { if (!start) return false; var e = new Date(start + 'T12:00:00Z'); e.setUTCDate(e.getUTCDate() + Math.max(0, days - 1)); return e.toISOString().slice(0, 10) < today(); }

  /* ---------- Siguiente destino ---------- */
  // ideas de viaje según la época del año: [título es, en, subtítulo es, en, meses, artículo de Wikipedia (foto), país, país es, en, Wikidata]
  var IDEAS = [
    ['Laponia en invierno', 'Lapland in winter', 'Auroras, renos y noches largas', 'Northern lights, reindeer and long nights', [12, 1, 2, 3], 'Laponia_finlandesa', 'FI', 'Finlandia', 'Finland', 'Q33'],
    ['Praga en Navidad', 'Prague at Christmas', 'Mercados navideños en la Ciudad Vieja', 'Christmas markets in the Old Town', [11, 12], 'Praga', 'CZ', 'República Checa', 'Czech Republic', 'Q213'],
    ['Viena entre mercados navideños', 'Vienna and its Christmas markets', 'Palacios, cafés y luces de diciembre', 'Palaces, cafés and December lights', [11, 12], 'Viena', 'AT', 'Austria', 'Austria', 'Q40'],
    ['Islandia: auroras y hielo', 'Iceland: auroras and ice', 'Cascadas heladas y cuevas de glaciar', 'Frozen waterfalls and glacier caves', [11, 12, 1, 2, 3], 'Jökulsárlón', 'IS', 'Islandia', 'Iceland', 'Q189'],
    ['Tromsø bajo la aurora', 'Tromsø under the aurora', 'La noche polar del norte de Noruega', 'The polar night of northern Norway', [11, 12, 1, 2], 'Tromsø', 'NO', 'Noruega', 'Norway', 'Q20'],
    ['Los Alpes suizos en tren', 'The Swiss Alps by train', 'Pueblos nevados y trenes panorámicos', 'Snowy villages and panoramic trains', [12, 1, 2, 3], 'Zermatt', 'CH', 'Suiza', 'Switzerland', 'Q39'],
    ['Marrakech con sol de invierno', 'Marrakesh in the winter sun', 'Zocos, riads y el Atlas nevado', 'Souks, riads and the snowy Atlas', [11, 12, 1, 2, 3], 'Marrakech', 'MA', 'Marruecos', 'Morocco', 'Q1028'],
    ['Tenerife y el Teide', 'Tenerife and Mount Teide', 'Volcán, playas y 22 °C en enero', 'A volcano, beaches and 22 °C in January', [12, 1, 2, 3], 'Teide', 'ES', 'España', 'Spain', 'Q29'],
    ['Patagonia en verano austral', 'Patagonia in the southern summer', 'Glaciares y caminatas en El Chaltén', 'Glaciers and hikes around El Chaltén', [12, 1, 2], 'Glaciar_Perito_Moreno', 'AR', 'Argentina', 'Argentina', 'Q414'],
    ['Tailandia en temporada seca', 'Thailand in the dry season', 'Templos de Chiang Mai y playas del sur', 'Chiang Mai temples and southern beaches', [11, 12, 1, 2], 'Chiang_Mai', 'TH', 'Tailandia', 'Thailand', 'Q869'],
    ['Nueva York en Navidad', 'New York at Christmas', 'Pistas de hielo y escaparates', 'Ice rinks and shop windows', [12], 'Rockefeller_Center', 'US', 'Estados Unidos', 'United States', 'Q30'],
    ['Edimburgo en Hogmanay', 'Edinburgh for Hogmanay', 'La Nochevieja escocesa', 'The Scottish New Year', [12, 1], 'Edimburgo', 'GB', 'Reino Unido', 'United Kingdom', 'Q145'],
    ['Kioto en flor', 'Kyoto in blossom', 'Cerezos en templos y canales', 'Cherry blossom by temples and canals', [3, 4], 'Kioto', 'JP', 'Japón', 'Japan', 'Q17'],
    ['Holanda en tulipanes', 'Holland in tulip season', 'Campos de flores y Ámsterdam en bici', 'Flower fields and Amsterdam by bike', [4, 5], 'Keukenhof', 'NL', 'Países Bajos', 'Netherlands', 'Q55'],
    ['Sevilla en primavera', 'Seville in spring', 'Azahar, patios y Feria de Abril', 'Orange blossom, patios and the April Fair', [3, 4, 5], 'Plaza_de_España_(Sevilla)', 'ES', 'España', 'Spain', 'Q29'],
    ['La Toscana en coche', 'Tuscany by car', 'Colinas, cipreses y pueblos medievales', 'Hills, cypresses and medieval towns', [4, 5, 6, 9, 10], 'Val_d%27Orcia', 'IT', 'Italia', 'Italy', 'Q38'],
    ['Cinque Terre a pie', 'Cinque Terre on foot', 'El sendero entre los cinco pueblos', 'The trail between the five villages', [4, 5, 6, 9], 'Cinque_Terre', 'IT', 'Italia', 'Italy', 'Q38'],
    ['Lisboa al sol', 'Lisbon in the sun', 'Miradores, tranvías y pastéis de nata', 'Viewpoints, trams and pastéis de nata', [3, 4, 5, 6, 9, 10], 'Lisboa', 'PT', 'Portugal', 'Portugal', 'Q45'],
    ['Petra y Wadi Rum', 'Petra and Wadi Rum', 'La ciudad nabatea y noche en el desierto', 'The Nabataean city and a night in the desert', [3, 4, 5, 10, 11], 'Petra', 'JO', 'Jordania', 'Jordan', 'Q810'],
    ['Atenas antes del calor', 'Athens before the heat', 'La Acrópolis sin colas de verano', 'The Acropolis without the summer queues', [4, 5, 10], 'Acrópolis_de_Atenas', 'GR', 'Grecia', 'Greece', 'Q41'],
    ['Fiordos noruegos', 'The Norwegian fjords', 'Cascadas y miradores sobre el agua', 'Waterfalls and viewpoints over the water', [6, 7, 8], 'Geirangerfjord', 'NO', 'Noruega', 'Norway', 'Q20'],
    ['Highlands de Escocia', 'The Scottish Highlands', 'Lagos, castillos y días largos', 'Lochs, castles and long days', [5, 6, 7, 8, 9], 'Eilean_Donan', 'GB', 'Reino Unido', 'United Kingdom', 'Q145'],
    ['Islas griegas', 'The Greek islands', 'Santorini, Naxos y mar en calma', 'Santorini, Naxos and calm seas', [6, 7, 8, 9], 'Santorini', 'GR', 'Grecia', 'Greece', 'Q41'],
    ['Dolomitas: rutas de montaña', 'Dolomites: mountain trails', 'Tre Cime y refugios de altura', 'Tre Cime and high mountain huts', [6, 7, 8, 9], 'Tre_Cime_di_Lavaredo', 'IT', 'Italia', 'Italy', 'Q38'],
    ['La costa de Croacia', 'The Croatian coast', 'Dubrovnik, Split y calas', 'Dubrovnik, Split and coves', [6, 7, 8, 9], 'Dubrovnik', 'HR', 'Croacia', 'Croatia', 'Q224'],
    ['Islandia con sol de medianoche', 'Iceland under the midnight sun', 'La ruta circular sin noche', 'The Ring Road with no nights', [6, 7], 'Seljalandsfoss', 'IS', 'Islandia', 'Iceland', 'Q189'],
    ['Camino de Santiago', 'The Camino de Santiago', 'Las últimas etapas hasta la catedral', 'The final stages to the cathedral', [5, 6, 9], 'Catedral_de_Santiago_de_Compostela', 'ES', 'España', 'Spain', 'Q29'],
    ['Provenza y la lavanda', 'Provence and the lavender', 'Valensole en flor y pueblos de piedra', 'Valensole in bloom and stone villages', [6, 7], 'Gordes', 'FR', 'Francia', 'France', 'Q142'],
    ['Banff y las Rocosas', 'Banff and the Rockies', 'Lagos turquesa y senderos', 'Turquoise lakes and trails', [6, 7, 8, 9], 'Lago_Moraine', 'CA', 'Canadá', 'Canada', 'Q16'],
    ['Nueva Inglaterra en otoño', 'New England in autumn', 'Bosques rojos y pueblos de madera', 'Red forests and clapboard towns', [9, 10], 'Nueva_Inglaterra', 'US', 'Estados Unidos', 'United States', 'Q30'],
    ['Kioto con hojas rojas', 'Kyoto in autumn colours', 'Arces en llamas en los templos', 'Blazing maples in the temples', [11], 'Kiyomizu-dera', 'JP', 'Japón', 'Japan', 'Q17'],
    ['El Duero en vendimia', 'The Douro at harvest time', 'Viñedos en terrazas y Oporto', 'Terraced vineyards and Porto', [9, 10], 'Oporto', 'PT', 'Portugal', 'Portugal', 'Q45'],
    ['Múnich en Oktoberfest', 'Munich for Oktoberfest', 'La fiesta de la cerveza y los Alpes cerca', 'The beer festival with the Alps nearby', [9, 10], 'Oktoberfest', 'DE', 'Alemania', 'Germany', 'Q183'],
    ['Roma sin el calor', 'Rome without the heat', 'Foros, plazas y trattorias', 'Forums, piazzas and trattorias', [10, 11, 3], 'Coliseo', 'IT', 'Italia', 'Italy', 'Q38'],
    ['Estambul en otoño', 'Istanbul in autumn', 'Bazares, mezquitas y el Bósforo', 'Bazaars, mosques and the Bosphorus', [9, 10, 11, 4, 5], 'Santa_Sofía', 'TR', 'Turquía', 'Turkey', 'Q43'],
    ['Camino Inca a Machu Picchu', 'Inca Trail to Machu Picchu', 'Cuatro días a pie en temporada seca', 'Four days on foot in the dry season', [5, 6, 7, 8, 9], 'Machu_Picchu', 'PE', 'Perú', 'Peru', 'Q419'],
    ['México en Día de Muertos', 'Mexico for the Day of the Dead', 'Altares, cempasúchil y desfiles', 'Altars, marigolds and parades', [10, 11], 'Día_de_Muertos', 'MX', 'México', 'Mexico', 'Q96'],
    // islas
    ['Maldivas', 'The Maldives', 'Atolones, agua turquesa y casas sobre el mar', 'Atolls, turquoise water and overwater villas', [1, 2, 3, 4, 11, 12], 'Malé', 'MV', 'Maldivas', 'Maldives', 'Q826', 'isla playa'],
    ['Lanzarote', 'Lanzarote', 'Volcanes, viñedos negros y calas', 'Volcanoes, black vineyards and coves', [10, 11, 12, 1, 2, 3, 4, 5], 'Parque_nacional_de_Timanfaya', 'ES', 'España', 'Spain', 'Q29', 'isla playa naturaleza'],
    ['Mallorca sin multitudes', 'Mallorca without the crowds', 'Calas, la Serra de Tramuntana y Palma', 'Coves, the Tramuntana hills and Palma', [5, 6, 9, 10], 'Caló_des_Moro', 'ES', 'España', 'Spain', 'Q29', 'isla playa'],
    ['Madeira, la isla jardín', 'Madeira, the garden island', 'Levadas entre bosques y acantilados', 'Levada walks through forests and cliffs', [3, 4, 5, 6, 9, 10], 'Pico_Ruivo', 'PT', 'Portugal', 'Portugal', 'Q45', 'isla naturaleza'],
    ['Las Azores', 'The Azores', 'Lagos en cráteres y ballenas', 'Crater lakes and whales', [5, 6, 7, 8, 9], 'Sete_Cidades', 'PT', 'Portugal', 'Portugal', 'Q45', 'isla naturaleza'],
    ['Sicilia y Taormina', 'Sicily and Taormina', 'El Etna, templos griegos y cannoli', 'Etna, Greek temples and cannoli', [4, 5, 6, 9, 10], 'Taormina', 'IT', 'Italia', 'Italy', 'Q38', 'isla comida'],
    ['Creta', 'Crete', 'Playas rosas, gargantas y palacios minoicos', 'Pink beaches, gorges and Minoan palaces', [5, 6, 9, 10], 'Elafonisi', 'GR', 'Grecia', 'Greece', 'Q41', 'isla playa'],
    ['Bali', 'Bali', 'Arrozales en terrazas y templos junto al mar', 'Rice terraces and temples by the sea', [5, 6, 7, 8, 9], 'Bali', 'ID', 'Indonesia', 'Indonesia', 'Q252', 'isla playa'],
    ['Zanzíbar', 'Zanzibar', 'Stone Town, especias y playas blancas', 'Stone Town, spices and white beaches', [6, 7, 8, 9, 1, 2], 'Stone_Town', 'TZ', 'Tanzania', 'Tanzania', 'Q924', 'isla playa comida africa'],
    ['Seychelles', 'The Seychelles', 'Rocas de granito y playas de postal', 'Granite boulders and postcard beaches', [4, 5, 10, 11], 'La_Digue', 'SC', 'Seychelles', 'Seychelles', 'Q1042', 'isla playa'],
    // viajes de comida
    ['San Sebastián de pintxos', 'San Sebastián for pintxos', 'Barras de la Parte Vieja y La Concha', 'Old Town bars and La Concha bay', [4, 5, 6, 9, 10], 'Bahía_de_La_Concha', 'ES', 'España', 'Spain', 'Q29', 'comida ciudad'],
    ['Bolonia y Emilia-Romaña', 'Bologna and Emilia-Romagna', 'Tortellini, parmesano y vinagre de Módena', 'Tortellini, Parmesan and Modena balsamic', [4, 5, 9, 10, 11], 'Tortellini', 'IT', 'Italia', 'Italy', 'Q38', 'comida ciudad escapada'],
    ['Nápoles y la pizza', 'Naples and its pizza', 'Pizzerías históricas y la costa de Amalfi', 'Historic pizzerias and the Amalfi Coast', [4, 5, 6, 9, 10], 'Pizza_napolitana', 'IT', 'Italia', 'Italy', 'Q38', 'comida ciudad escapada'],
    ['Lyon, capital del buen comer', 'Lyon, capital of good food', 'Bouchons, mercados y vino del Ródano', 'Bouchons, markets and Rhône wines', [4, 5, 6, 9, 10], 'Lyon', 'FR', 'Francia', 'France', 'Q142', 'comida ciudad'],
    ['Tokio de mercado en mercado', 'Tokyo, market by market', 'Sushi, ramen e izakayas', 'Sushi, ramen and izakayas', [3, 4, 5, 10, 11], 'Sushi', 'JP', 'Japón', 'Japan', 'Q17', 'comida ciudad'],
    ['Bangkok a pie de calle', 'Bangkok street food', 'Puestos nocturnos y mercados flotantes', 'Night stalls and floating markets', [11, 12, 1, 2], 'Pad_thai', 'TH', 'Tailandia', 'Thailand', 'Q869', 'comida ciudad'],
    ['Oaxaca y el mole', 'Oaxaca and its mole', 'Mercados, cacao y mezcal', 'Markets, cacao and mezcal', [10, 11, 12, 1, 2, 3], 'Oaxaca_de_Juárez', 'MX', 'México', 'Mexico', 'Q96', 'comida ciudad'],
    ['Lima y el ceviche', 'Lima and ceviche', 'La cocina peruana frente al Pacífico', 'Peruvian cooking by the Pacific', [12, 1, 2, 3, 4], 'Ceviche', 'PE', 'Perú', 'Peru', 'Q419', 'comida ciudad'],
    // escapadas low cost: ciudades con vuelos baratos, para un fin de semana
    ['Budapest en un fin de semana', 'A weekend in Budapest', 'Baños termales, el Parlamento y ruin bars', 'Thermal baths, Parliament and ruin bars', [3, 4, 5, 9, 10, 11, 12], 'Parlamento_de_Hungría', 'HU', 'Hungría', 'Hungary', 'Q28', 'escapada ciudad'],
    ['Cracovia', 'Kraków', 'Plaza del Mercado, Wawel y Kazimierz', 'Market Square, Wawel and Kazimierz', [4, 5, 6, 9, 10, 12], 'Plaza_del_Mercado_de_Cracovia', 'PL', 'Polonia', 'Poland', 'Q36', 'escapada ciudad'],
    ['Riga y su Art Nouveau', 'Riga and its Art Nouveau', 'Casco antiguo y mercado central', 'Old town and central market', [5, 6, 7, 8, 9, 12], 'Riga', 'LV', 'Letonia', 'Latvia', 'Q211', 'escapada ciudad'],
    ['Tallin medieval', 'Medieval Tallinn', 'Murallas, torres y mercado navideño', 'Walls, towers and a Christmas market', [5, 6, 7, 8, 12], 'Tallin', 'EE', 'Estonia', 'Estonia', 'Q191', 'escapada ciudad'],
    ['Sofía', 'Sofia', 'La catedral de Alejandro Nevski y el monte Vitosha', 'Alexander Nevsky Cathedral and Mount Vitosha', [4, 5, 6, 9, 10], 'Catedral_de_Alejandro_Nevski', 'BG', 'Bulgaria', 'Bulgaria', 'Q219', 'escapada ciudad'],
    ['Malta y La Valeta', 'Malta and Valletta', 'Murallas, calas y sol casi todo el año', 'Bastions, coves and sun most of the year', [3, 4, 5, 10, 11], 'La_Valeta', 'MT', 'Malta', 'Malta', 'Q233', 'escapada isla playa'],
    ['Gdansk junto al Báltico', 'Gdańsk by the Baltic', 'Fachadas de colores y ámbar', 'Colourful facades and amber', [5, 6, 7, 8, 9], 'Gdansk', 'PL', 'Polonia', 'Poland', 'Q36', 'escapada ciudad'],
    ['Bruselas y Brujas', 'Brussels and Bruges', 'Grand-Place, chocolate y canales', 'Grand-Place, chocolate and canals', [4, 5, 6, 9, 12], 'Grand-Place', 'BE', 'Bélgica', 'Belgium', 'Q31', 'escapada ciudad comida'],
    ['Milán y el lago de Como', 'Milan and Lake Como', 'El Duomo, la Última Cena y un tren al lago', 'The Duomo, the Last Supper and a train to the lake', [3, 4, 5, 9, 10, 11], 'Catedral_de_Milán', 'IT', 'Italia', 'Italy', 'Q38', 'escapada ciudad'],
    ['Valencia', 'Valencia', 'Paella, la Ciudad de las Artes y la playa', 'Paella, the City of Arts and the beach', [3, 4, 5, 6, 9, 10], 'Museo_de_las_Ciencias_Príncipe_Felipe', 'ES', 'España', 'Spain', 'Q29', 'escapada ciudad playa comida'],
    ['Bucarest', 'Bucharest', 'El Palacio del Parlamento y el casco viejo', 'The Palace of Parliament and the old town', [4, 5, 6, 9, 10], 'Bucarest', 'RO', 'Rumanía', 'Romania', 'Q218', 'escapada ciudad'],
    // África
    ['Safari en Masái Mara', 'Safari in the Maasai Mara', 'La gran migración de ñus y los leones', 'The great wildebeest migration and lions', [7, 8, 9, 10], 'Masái_Mara', 'KE', 'Kenia', 'Kenya', 'Q114', 'africa naturaleza safari'],
    ['Serengeti y Ngorongoro', 'Serengeti and Ngorongoro', 'Sabana sin fin y el cráter de los animales', 'Endless savannah and the crater of wildlife', [1, 2, 6, 7, 8, 9, 10], 'Serengeti', 'TZ', 'Tanzania', 'Tanzania', 'Q924', 'africa naturaleza safari'],
    ['Kruger, en Sudáfrica', 'Kruger, South Africa', 'Los Cinco Grandes en temporada seca', 'The Big Five in the dry season', [5, 6, 7, 8, 9], 'Parque_nacional_Kruger', 'ZA', 'Sudáfrica', 'South Africa', 'Q258', 'africa naturaleza safari'],
    ['Ciudad del Cabo', 'Cape Town', 'Table Mountain, pingüinos y viñedos', 'Table Mountain, penguins and vineyards', [11, 12, 1, 2, 3], 'Montaña_de_la_Mesa', 'ZA', 'Sudáfrica', 'South Africa', 'Q258', 'africa ciudad playa'],
    ['Las dunas de Namibia', 'The dunes of Namibia', 'Sossusvlei y el desierto más antiguo', 'Sossusvlei and the oldest desert', [4, 5, 6, 7, 8, 9, 10], 'Deadvlei', 'NA', 'Namibia', 'Namibia', 'Q1030', 'africa naturaleza'],
    ['Delta del Okavango', 'The Okavango Delta', 'Elefantes y canoas entre juncos', 'Elephants and dugout canoes among the reeds', [6, 7, 8, 9, 10], 'Delta_del_Okavango', 'BW', 'Botsuana', 'Botswana', 'Q963', 'africa naturaleza safari'],
    ['Egipto: Luxor y el Nilo', 'Egypt: Luxor and the Nile', 'Templos, el Valle de los Reyes y un crucero', 'Temples, the Valley of the Kings and a cruise', [10, 11, 12, 1, 2, 3], 'Templo_de_Karnak', 'EG', 'Egipto', 'Egypt', 'Q79', 'africa ciudad'],
    ['Cataratas Victoria', 'Victoria Falls', 'La cortina de agua entre Zambia y Zimbabue', 'The curtain of water between Zambia and Zimbabwe', [2, 3, 4, 5, 6, 7], 'Cataratas_Victoria', 'ZW', 'Zimbabue', 'Zimbabwe', 'Q954', 'africa naturaleza'],
    ['El desierto de Merzouga', 'The Merzouga desert', 'Dunas de Erg Chebbi en camello', 'The Erg Chebbi dunes by camel', [10, 11, 3, 4], 'Erg_Chebbi', 'MA', 'Marruecos', 'Morocco', 'Q1028']
  ];
  // categorías de las ideas (las nuevas la llevan en x[10])
  var TAGS = { Laponia_finlandesa: 'nieve', Praga: 'ciudad escapada', Viena: 'ciudad', 'Jökulsárlón': 'nieve naturaleza', 'Tromsø': 'nieve', Zermatt: 'nieve naturaleza', Marrakech: 'ciudad comida escapada africa',
    Teide: 'isla playa naturaleza', Glaciar_Perito_Moreno: 'naturaleza', Chiang_Mai: 'playa comida', Rockefeller_Center: 'ciudad nieve', Edimburgo: 'ciudad escapada', Kioto: 'ciudad', Keukenhof: 'naturaleza',
    'Plaza_de_España_(Sevilla)': 'ciudad comida escapada', 'Val_d%27Orcia': 'naturaleza comida', Cinque_Terre: 'playa naturaleza', Lisboa: 'ciudad comida escapada', Petra: 'naturaleza', 'Acrópolis_de_Atenas': 'ciudad',
    Geirangerfjord: 'naturaleza', Eilean_Donan: 'naturaleza', Santorini: 'isla playa', Tre_Cime_di_Lavaredo: 'naturaleza', Dubrovnik: 'playa ciudad', Seljalandsfoss: 'naturaleza',
    Catedral_de_Santiago_de_Compostela: 'naturaleza comida', Gordes: 'naturaleza', Lago_Moraine: 'naturaleza', Nueva_Inglaterra: 'naturaleza', 'Kiyomizu-dera': 'ciudad', Oporto: 'ciudad comida escapada',
    Oktoberfest: 'comida ciudad', Coliseo: 'ciudad comida', 'Santa_Sofía': 'ciudad comida', Machu_Picchu: 'naturaleza', 'Día_de_Muertos': 'ciudad comida', Erg_Chebbi: 'naturaleza africa' };
  function tagsOf(x) { return (x[10] || TAGS[x[5]] || '').split(' '); }
  var CATS = [['escapada', 'Escapadas low cost', 'Budget city breaks', 'Parlamento_de_Hungría'], ['africa', 'África', 'Africa', 'Masái_Mara'], ['isla', 'Islas', 'Islands', 'La_Digue'], ['comida', 'Viaje culinario', 'Food trip', 'Pizza_napolitana'], ['playa', 'Playa', 'Beach', 'Santorini'], ['nieve', 'Nieve', 'Snow', 'Laponia_finlandesa'], ['ciudad', 'Ciudades', 'Cities', 'Praga'], ['naturaleza', 'Naturaleza', 'Nature', 'Geirangerfjord']];
  // el mes bueno más cercano desde ahora (0 = este mes)
  function nearest(x, m) { var dist = 99, best = m; x[4].forEach(function (mm) { var d = (mm - m + 12) % 12; if (d < dist) { dist = d; best = mm; } }); return { d: dist, m: best }; }
  // las de este mes y el siguiente; primero las de países que aún no tienes. Cambian cada semana
  function ideas(known, n, cat) {
    var d = new Date(), m = d.getMonth() + 1, m2 = m % 12 + 1, en = window.Lang && Lang.get() === 'en', wk = Math.floor(d.getTime() / 6048e5);
    var list = IDEAS.filter(function (x) { return x[4].indexOf(m) >= 0 || x[4].indexOf(m2) >= 0; }).map(function (x, i) {
      return { t: en ? x[1] : x[0], sub: en ? x[3] : x[2], wiki: x[5], cc: x[6], country: { name: en ? x[8] : x[7], cc: x[6], wd: x[9] }, month: x[4].indexOf(m) >= 0 ? m : m2, months: x[4], tags: tagsOf(x), k: (i * 7 + wk * 13) % 17 + (known[x[6]] ? 100 : 0) };
    });
    if (cat) {
      list = list.filter(function (o) { return o.tags.indexOf(cat) >= 0; });
      var have = {}; list.forEach(function (o) { have[o.wiki] = 1; });
      IDEAS.forEach(function (x) { if (have[x[5]] || tagsOf(x).indexOf(cat) < 0) return; var N = nearest(x, m), o = ideaOf(x, N.m); o.k = 200 + N.d * 10 + (known[x[6]] ? 5 : 0); list.push(o); });
    }
    return list.sort(function (a, b) { return a.k - b.k; }).slice(0, n || 6);
  }
  function ideaOf(x, mon) { var en = window.Lang && Lang.get() === 'en'; return { t: en ? x[1] : x[0], sub: en ? x[3] : x[2], wiki: x[5], cc: x[6], country: { name: en ? x[8] : x[7], cc: x[6], wd: x[9] }, month: mon, months: x[4], tags: tagsOf(x) }; }
  // ideas de un mes concreto (la línea del tiempo de Home), sin repetir las ya usadas
  function ideasIn(known, mon, n, skip) {
    var wk = Math.floor(Date.now() / 6048e5);
    return IDEAS.map(function (x, i) { return { x: x, k: (i * 7 + wk * 13) % 17 + (known[x[6]] ? 100 : 0) }; })
      .filter(function (o) { return o.x[4].indexOf(mon) >= 0 && !(skip || {})[o.x[5]]; })
      .sort(function (a, b) { return a.k - b.k; }).slice(0, n || 3).map(function (o) { return ideaOf(o.x, mon); });
  }
  // «Recomiéndame un viaje»: lo que mejor cuadra pronto, mejor en un país nuevo, con algo de azar
  function recommend(known, seen, cat) {
    var m = new Date().getMonth() + 1;
    var c = IDEAS.filter(function (x) { return !(seen || {})[x[5]] && (!cat || tagsOf(x).indexOf(cat) >= 0); }).map(function (x) {
      var N = nearest(x, m);
      return { x: x, mon: N.m, s: N.d + (known[x[6]] ? 3 : 0) + Math.random() * 4 };
    }).sort(function (a, b) { return a.s - b.s; })[0];
    return c ? ideaOf(c.x, c.mon) : null;
  }
  // foto de la idea: la miniatura del artículo de Wikipedia, guardada para la próxima vez
  function ideaImg(wiki) {
    var C = {}; try { C = JSON.parse(localStorage.getItem('guia-ideas') || '{}') || {}; } catch (e) {}
    if (C[wiki]) return Promise.resolve(C[wiki].replace('/500px-', '/960px-'));
    return fetch('https://es.wikipedia.org/api/rest_v1/page/summary/' + wiki).then(function (r) { return r.json(); }).then(function (j) {
      var u = (j.thumbnail || j.originalimage || {}).source || ''; if (!u) return '';
      u = u.replace(/\/\d+px-/, '/960px-'); C[wiki] = u;
      try { localStorage.setItem('guia-ideas', JSON.stringify(C)); } catch (e) {}
      return u;
    }).catch(function () { return ''; });
  }

  return { TEST: TEST, presentPack: presentPack, get: get, save: save, rate: rate, tierOf: tierOf, RANK: RANK, cardHTML: cardHTML, TIER: TIER, PACK: PACK, BY_HITS: BY_HITS, toast: toast, total: total, onQuiz: onQuiz, onVisit: onVisit, challenges: challenges, redeem: redeem, radiusOf: radiusOf, locate: locate, ready: ready, photo: photo, savePhoto: savePhoto, openPack: openPack, ideas: ideas, ideasIn: ideasIn, recommend: recommend, CATS: CATS, ideaImg: ideaImg, watch: watch, today: today, isPast: isPast };
})();
