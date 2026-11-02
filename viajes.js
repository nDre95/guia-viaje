/* ===== Pantalla principal: Home (resumen), Viajes, Álbum y Perfil =====
   El asistente para crear viajes está en asistente.js y el motor que los genera, en motor.js.
   La IA del usuario es opcional y solo puede reescribir textos de sitios que ya están en la lista. */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(n) { return '<svg class="ic"><use href="#i-' + n + '"></use></svg>'; }
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  document.documentElement.setAttribute('lang', Lang.get());
  Lang.watch(document.body);
  document.title = Lang.translate(document.title);
  // idioma: uno solo para toda la app; al cambiarlo se vuelve a pintar todo
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-l]'); if (!b || b.getAttribute('data-l') === Lang.get()) return;
    Lang.set(b.getAttribute('data-l')); location.reload();
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-l]'), function (b) { b.classList.toggle('on', b.getAttribute('data-l') === Lang.get()); });
  function dateLbl(iso) { var d = new Date(iso + 'T12:00:00Z'); return DIAS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MES[d.getUTCMonth()]; }

  /* ---------- Almacén de viajes del móvil (IndexedDB, el mismo que lee la guía) ---------- */
  var DB = (function () {
    var dbp = null;
    function open() {
      if (!dbp) dbp = new Promise(function (res, rej) {
        var q = indexedDB.open('guia-trips', 1);
        q.onupgradeneeded = function () { q.result.createObjectStore('trips', { keyPath: 'id' }); };
        q.onsuccess = function () { res(q.result); }; q.onerror = function () { rej(q.error); };
      });
      return dbp;
    }
    function run(mode, fn) {
      return open().then(function (db) { return new Promise(function (res, rej) {
        var tr = db.transaction('trips', mode), q = fn(tr.objectStore('trips'));
        tr.oncomplete = function () { res(q ? q.result : null); }; tr.onerror = tr.onabort = function () { rej(tr.error); };
      }); });
    }
    return {
      all: function () { return run('readonly', function (s) { return s.getAll(); }); },
      get: function (id) { return run('readonly', function (s) { return s.get(id); }); },
      put: function (o) { return run('readwrite', function (s) { return s.put(o); }); },
      del: function (id) { return run('readwrite', function (s) { return s.delete(id); }); }
    };
  })();

  /* ---------- Lista de viajes ---------- */
  // cada viaje como una tarjeta de embarque, colgado de una línea del tiempo (cuánto pasa entre uno y otro, y «Hoy»)
  function gapTxt(a, b) {
    var d = Math.abs(Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5)), m = Math.round(d / 30.4), en = Lang.get() === 'en';
    if (d < 45) return d + (en ? (d === 1 ? ' day' : ' days') : (d === 1 ? ' día' : ' días'));
    if (m < 12) return m + (en ? (m === 1 ? ' month' : ' months') : (m === 1 ? ' mes' : ' meses'));
    var y = Math.floor(m / 12), r = m % 12;
    return y + (en ? (y === 1 ? ' year' : ' years') : (y === 1 ? ' año' : ' años')) + (r ? (en ? ' and ' : ' y ') + r + (en ? (r === 1 ? ' month' : ' months') : (r === 1 ? ' mes' : ' meses')) : '');
  }
  function tripCard(t, i, arr) {
    var en = Lang.get() === 'en', title = (t.title && (t.title[Lang.get()] || t.title.es || t.title.en)) || t.id, days = t.days || 0, user = t.user, prev = i ? arr[i - 1] : null, today = new Date().toISOString().slice(0, 10);
    var end = t.start ? addDays(t.start, Math.max(0, days - 1)) : '', now = t.start && t.start <= today && end >= today, cc = (window.Mundo && Mundo.cached(t.ref)) || [];
    var city = (((t.ref.b.meta || {}).generated || {}).cities || [])[0] || title, code = String(city).normalize('NFD').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
    var mon = t.start ? new Date(t.start + 'T12:00:00Z').toLocaleDateString(en ? 'en-GB' : 'es', { month: 'short', year: 'numeric', timeZone: 'UTC' }).replace('.', '') : '';
    var h = '';
    if (prev && !prev.past && t.past) h += '<div class="tl-today"><span>' + (en ? 'Today' : 'Hoy') + '</span></div>';
    else if (prev && prev.start && t.start) h += '<div class="tl-gap">' + (t.past ? (en ? gapTxt(t.start, prev.start) + ' earlier' : gapTxt(t.start, prev.start) + ' antes') : (en ? gapTxt(prev.start, t.start) + ' later' : gapTxt(prev.start, t.start) + ' después')) + '</div>';
    else if (!prev && t.start && !now) h += '<div class="tl-gap first">' + (t.past ? (en ? gapTxt(t.start, today) + ' ago' : 'Hace ' + gapTxt(t.start, today)) : (en ? 'In ' + gapTxt(today, t.start) : 'Dentro de ' + gapTxt(today, t.start))) + '</div>';
    var st = now ? (en ? 'Now' : 'En curso') : t.past ? (en ? 'Done' : 'Hecho') : t.start ? (en ? 'in ' : 'en ') + Math.max(0, Math.round((new Date(t.start + 'T12:00:00Z') - new Date(today + 'T12:00:00Z')) / 864e5)) + ' d' : '–';
    return h + '<div class="tl-n' + (t.past ? ' past' : '') + (now ? ' now' : '') + '"><span class="tl-dot"></span><small class="tl-m">' + esc(mon) + '</small>' +
      '<div class="hp-pass tp-bp"><button type="button" class="hp-top" data-open="' + esc(t.id) + '"' + bg(t.cover) + '><span class="hm-shade"></span>' +
      '<small>' + (en ? 'Boarding pass' : 'Tarjeta de embarque') + (user ? ' · ' + (t.gen ? (en ? 'Created with the assistant' : 'Creado con el asistente') : (en ? 'Imported' : 'Importado')) : '') + '</small><b>' + esc(title) + '</b><span class="tp-code">' + (cc[0] && Mundo.flag(cc[0]) ? Mundo.flag(cc[0]) + ' ' : '') + esc(code) + '</span></button>' +
      '<div class="hp-grid"><span><small>' + (en ? 'Departs' : 'Salida') + '</small><b>' + esc(t.start ? sdate(t.start) : '–') + '</b></span><span><small>' + (en ? 'Returns' : 'Regreso') + '</small><b>' + esc(end ? sdate(end) : '–') + '</b></span><span><small>' + (en ? 'Days' : 'Días') + '</small><b>' + days + '</b></span><span><small>' + (en ? 'Status' : 'Estado') + '</small><b>' + esc(st) + '</b></span></div>' +
      '<div class="hp-cut"></div><div class="tp-stub"><div class="btn-row"><button type="button" class="btn navy sq" data-open="' + esc(t.id) + '">' + (en ? 'Open' : 'Abrir') + '</button>' +
      '<button type="button" class="btn ghost sq" data-exp="' + esc(t.id) + '">' + (en ? 'Export' : 'Exportar') + '</button>' +
      (user ? '<button type="button" class="btn ghost sq" data-del="' + esc(t.id) + '">' + (en ? 'Delete' : 'Borrar') + '</button>' : '') + '</div><span class="hp-code"></span></div></div></div>';
  }
  function sdate(iso) { var d = new Date(iso + 'T12:00:00Z'); return d.getUTCDate() + ' ' + d.toLocaleDateString(Lang.get() === 'en' ? 'en-GB' : 'es', { month: 'short', timeZone: 'UTC' }).replace('.', ''); }
  function renderList() {
    return Album.trips().then(function (list) {
      var now = new Date().toISOString().slice(0, 10);
      var rows = list.map(function (t) {
        var bd = t.b, ph = bd.photos || {}, start = realStart(bd), days = bd.trip.days.length, user = /^u-/.test(t.id), end = start ? addDays(start, Math.max(0, days - 1)) : '';
        return { id: t.id, title: bd.meta.title, start: start, days: days, cover: ph[bd.trip.cover] || '', gen: !!bd.meta.generated, user: user, ref: t, past: !!start && end < now };
      }).sort(function (a, b) { return (a.past ? 1 : 0) - (b.past ? 1 : 0) || (a.past ? String(b.start).localeCompare(String(a.start)) : String(a.start).localeCompare(String(b.start))); });
      function paint() {
        Album.listBox($('#list'), { key: 'trips', size: 5, placeholder: 'Buscar por destino, ciudad, país o año', empty: 'Aún no hay viajes.', items: rows,
          chips: [['all', 'Todos', function () { return true; }], ['next', 'Próximos', function (r) { return !r.past; }], ['past', 'Hechos', function (r) { return r.past; }]],
          text: function (r) { return Album.searchText(r.ref); }, year: function (r) { return (r.start || '').slice(0, 4); },
          select: { all: 'Todos los países', options: function () {
            var seen = {}; rows.forEach(function (r) { (Mundo.cached(r.ref) || []).forEach(function (c) { seen[c] = 1; }); });
            return Object.keys(seen).map(function (c) { return [c, (Mundo.flag(c) ? Mundo.flag(c) + ' ' : '') + Mundo.name(c)]; }).sort(function (a, b) { return a[1].localeCompare(b[1]); });
          } },
          selectVal: function (r) { return Mundo.cached(r.ref) || []; },
          render: function (r, i, arr) { return tripCard(r, i, arr); } });
      }
      paint();
      Mundo.detect(list).then(function (ch) { if (ch) paint(); }).catch(function () {});
    });
  }
  // grp: la guía se abre en ese grupo de Preparativos («ida» = la maleta, «wx» = el tiempo)
  function openTrip(id, grp) {
    try { localStorage.setItem('guia-trip', id); if (grp) localStorage.setItem('guia-goto', grp); } catch (e) {}
    function go() { location.href = 'guia.html'; }
    if (!enWork[id]) go();
    else Promise.race([enWork[id], new Promise(function (r) { setTimeout(r, 12000); })]).then(go, go);
  }
  // viajes creados antes de guardar los dos idiomas: se completan en segundo plano, con conexión
  // la fecha del viaje: la cambiada en la guía, si la hay
  function realStart(b) {
    var m = b.meta || {}, v = null; try { v = JSON.parse(localStorage.getItem((m.storage || m.id) + ':start') || 'null'); } catch (e) {}
    return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : b.trip.defaultStart;
  }
  var enWork = {};
  function completeEnglish() {
    DB.all().then(function (l) {
      (l || []).forEach(function (x) {
        var b = x.bundle;
        var needF = b.meta.generated && !b.meta.filmsReady, needE = b.meta.generated && b.meta.enReady !== 2 && b.meta.lang !== 'en';
        if (!needF && !needE) return;
        enWork[x.id] = (needF ? Motor.addFilms(b).catch(function () { return b; }) : Promise.resolve(b)).then(function () { return needE ? Motor.addEnglish(b) : b; }).then(function () { return DB.put({ id: x.id, at: x.at, bundle: b }); }).then(function () { delete enWork[x.id]; Album.reset(); }, function () { delete enWork[x.id]; });
      });
    }).catch(function () {});
  }
  function download(obj, name) {
    var blob = new Blob([JSON.stringify(obj)], { type: 'application/json' }), f = null;
    try { f = new File([blob], name, { type: 'application/json' }); } catch (e) {}
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: name }).catch(function () {}); return; }
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }
  function exportTrip(id) {
    if (/^u-/.test(id)) DB.get(id).then(function (x) { if (x) download(x.bundle, id + '.json'); });
    else fetch('trips/' + id + '.json').then(function (r) { return r.json(); }).then(function (b) {
      // las fotos van como rutas de esta web: al exportar, en dirección completa para que se vean desde otra
      var base = new URL('.', location.href).href; Object.keys(b.photos || {}).forEach(function (k) { b.photos[k] = new URL(b.photos[k], base).href; });
      download(b, id + '.json');
    });
  }
  function importTrip(file) {
    var r = new FileReader();
    r.onload = function () {
      var b = null; try { b = JSON.parse(r.result); } catch (e) {}
      if (!b || !b.meta || !b.trip || !Array.isArray(b.trip.days) || !b.trip.days.length) { alert('Ese archivo no es un viaje de la guía.'); return; }
      var id = /^u-/.test(b.meta.id || '') ? b.meta.id : 'u-' + (b.meta.id || 'viaje').replace(/[^\w-]/g, '').slice(0, 30) + '-' + Math.random().toString(36).slice(2, 6);
      b.meta.id = id; b.meta.storage = b.meta.storage && /^u-/.test(b.meta.storage) ? b.meta.storage : id;
      DB.put({ id: id, at: Date.now(), bundle: b }).then(function () { Album.reset(); refreshAll(); });
    };
    r.readAsText(file);
  }
  document.addEventListener('click', function (e) {
    var t = e.target, o = t.closest('[data-open]'), x = t.closest('[data-exp]'), d = t.closest('[data-del]');
    if (o) openTrip(o.getAttribute('data-open'), o.getAttribute('data-grp'));
    else if (x) exportTrip(x.getAttribute('data-exp'));
    else if (d && confirm('¿Borrar este viaje del móvil? Lo apuntado en él también se pierde.')) DB.del(d.getAttribute('data-del')).then(function () { Album.reset(); refreshAll(); });
  });
  $('#impFile').addEventListener('change', function () { if (this.files[0]) importTrip(this.files[0]); this.value = ''; });

  /* ---------- Opcional: la IA del usuario reescribe textos, sin poder añadir sitios ---------- */
  function aiBoxHTML(b) {
    aiBundle = b;
    return '<details class="card wz-ai"><summary>Opcional · mejorar los textos con tu ChatGPT o Claude</summary><p class="wz-note">La guía ya está hecha con datos reales. Copia este mensaje en tu chat (la versión gratis vale) y pega aquí su respuesta. Solo puede escribir sobre los sitios de la lista: lo demás se descarta.</p>' +
      '<div class="btn-row"><button type="button" class="btn navy sq" id="aiCopy">Copiar mensaje</button><a class="btn ghost sq" href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT</a><a class="btn ghost sq" href="https://claude.ai/new" target="_blank" rel="noopener">Claude</a></div>' +
      '<label class="wz-fld"><span>Respuesta del chat</span><textarea id="aiIn" placeholder="Pega aquí el JSON que te devuelva"></textarea></label><button type="button" class="btn ghost sq" id="aiApply">Aplicar textos</button><ul class="wz-log" id="aiLog"></ul></details>';
  }
  function aiPrompt(b) {
    var list = [];
    b.trip.days.forEach(function (d, k) { d.items.forEach(function (it) { if (it.src) list.push({ id: it.id, dia: k + 1, sitio: it.ti, lugar: it.pl || '', tipo: it.t }); }); });
    var days = b.trip.days.map(function (d, k) { return { id: d.id, dia: k + 1, ahora: d.title }; });
    return 'Eres un guía de viaje. Voy a ' + b.meta.dest.es + ' (' + b.trip.days.length + ' días desde el ' + b.trip.defaultStart + ').\n' +
      'Estos son los sitios REALES del plan (no puedes añadir ni quitar ninguno):\n' + JSON.stringify(list) + '\n' +
      'Y los días: ' + JSON.stringify(days) + '\n\n' +
      'Devuélveme SOLO un JSON válido, sin texto antes ni después, con esta forma:\n' +
      '{"days":{"d1":{"title":"…","sub":"…"}},"items":{"d1-2":{"lead":"…","tips":["…"]}}}\n' +
      'Reglas: usa solo los id de arriba; "lead" es 1–2 frases que expliquen por qué merece la pena; "tips" como mucho 2 consejos prácticos; ' +
      'NO inventes horarios, precios ni datos que no sepas seguro (si dudas, no lo pongas); "title" corto (2–4 palabras) y "sub" una línea. En español.';
  }
  var aiBundle = null;
  document.addEventListener('click', function (e) {
    if (e.target.closest('#aiCopy')) aiCopy(); else if (e.target.closest('#aiApply')) aiApply();
  });
  function aiCopy() {
    if (!aiBundle) return; var t = aiPrompt(aiBundle);
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { $('#aiCopy').textContent = 'Copiado ✓'; }, function () { $('#aiIn').value = t; $('#aiIn').select(); alert('Copia el texto del cuadro y pégalo en el chat.'); });
  }
  function aiApply() {
    var b = aiBundle, raw = $('#aiIn').value, log = $('#aiLog'); log.innerHTML = '';
    function li(t, c) { log.insertAdjacentHTML('beforeend', '<li class="' + c + '">' + esc(t) + '</li>'); }
    if (!b) return;
    var m = raw.replace(/```(json)?/g, '').match(/\{[\s\S]*\}/), o = null;
    try { o = JSON.parse(m ? m[0].replace(/,\s*([}\]])/g, '$1').replace(/[“”]/g, '"') : ''); } catch (e) {}
    if (!o) { li('No es un JSON válido. Pídele al chat: «devuélvelo solo como JSON válido».', 'warn'); return; }
    var byId = {}, okI = 0, okD = 0, bad = 0;
    b.trip.days.forEach(function (d) { d.items.forEach(function (it) { if (it.src) byId[it.id] = it; }); });
    Object.keys(o.items || {}).forEach(function (k) {
      var it = byId[k], v = o.items[k]; if (!it || !v) { bad++; return; }
      if (typeof v.lead === 'string' && v.lead.length < 400) { it.lead = v.lead.trim(); okI++; }
      if (Array.isArray(v.tips)) it.tips = (it.tips || []).concat(v.tips.filter(function (x) { return typeof x === 'string' && x.length < 200; }).slice(0, 2).map(function (x) { return x.trim() + ' (IA)'; }));
    });
    Object.keys(o.days || {}).forEach(function (k) {
      var d = b.trip.days.filter(function (x) { return x.id === k; })[0], v = o.days[k]; if (!d || !v) { bad++; return; }
      if (typeof v.title === 'string' && v.title.length < 40) d.title = v.title.trim();
      if (typeof v.sub === 'string' && v.sub.length < 120) d.sub = v.sub.trim();
      okD++;
    });
    b.trip.route.forEach(function (r, k) { var d = b.trip.days[k]; if (d) r.n = d.title; });
    b.meta.generated.ai = new Date().toISOString();
    DB.put({ id: b.meta.id, at: Date.now(), bundle: b }).then(function () {
      li(okI + ' textos y ' + okD + ' días actualizados' + (bad ? ' · ' + bad + ' descartados (no estaban en la lista)' : ''), 'ok');
    });
  }

  /* ---------- Pestañas ---------- */
  function setTab(t) {
    $$('.vtab').forEach(function (s) { s.hidden = s.id !== 'tab-' + t; });
    $$('.vn').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-vt') === t); });
    if (t === 'home') renderHome(); else if (t === 'trips') renderList(); else if (t === 'album') Album.renderAlbum(); else if (t === 'profile') renderProfile();
    window.scrollTo(0, 0);
  }
  $$('.vn').forEach(function (b) { b.addEventListener('click', function () { setTab(b.getAttribute('data-vt')); }); });
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]'), n = e.target.closest('[data-new]'), ix = e.target.closest('[data-idea]');
    if (g) setTab(g.getAttribute('data-go'));
    if (n) newTrip();
    if (ix) { var I = IDEAS_NOW[+ix.getAttribute('data-idea')]; if (I) newTrip(I); }
  });
  // idea de temporada: el asistente abre con su país elegido y la fecha en ese mes
  var IDEAS_NOW = [];
  function newTrip(idea) {
    var pre = null;
    if (idea) { var d = new Date(), y = d.getFullYear() + (idea.month < d.getMonth() + 1 ? 1 : 0), dd = idea.month === d.getMonth() + 1 ? Math.min(28, d.getDate() + 14) : 10, st = y + '-' + (idea.month < 10 ? '0' : '') + idea.month + '-' + (dd < 10 ? '0' : '') + dd; pre = { country: idea.country, start: idea.start || st, days: idea.days || 0, pj: ideaPj(idea) }; }
    Asistente.open({ preset: pre, onSave: function (b) { return DB.put({ id: b.meta.id, at: Date.now(), bundle: b }).then(function () { Album.reset(); refreshAll(); cachePhotos(b); }); }, onOpen: openTrip, aiBox: aiBoxHTML });
  }
  function cachePhotos(b) {
    if (!window.caches || !/^https?:$/.test(location.protocol)) return;
    var ph = b.photos || {}, cover = ph[(b.trip || {}).cover];
    caches.open('guia-img').then(function (c) {
      Object.keys(ph).map(function (k) { return ph[k]; }).concat(cover ? [hdUrl(cover)] : []).forEach(function (u) {
        if (!u || !/^https?:/.test(u)) return;
        c.match(u).then(function (hit) { if (!hit) fetch(u, { mode: 'no-cors' }).then(function (r) { if (r.ok || r.type === 'opaque') return c.put(u, r); }).catch(function () {}); });
      });
    }).catch(function () {});
  }
  function refreshAll() { renderList(); var t = $$('.vn').filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]; if (t && t.getAttribute('data-vt') === 'home') renderHome(); }

  /* ---------- Álbum y perfil: album.js ---------- */
  // todos los viajes con sus datos: los de la web (trips/<id>.json) y los del móvil
  function allTrips() {
    var a = fetch('trips/index.json').then(function (r) { return r.json(); }).catch(function () { return []; }).then(function (idx) {
      return Promise.all(idx.map(function (t) { return fetch('trips/' + t.id + '.json').then(function (r) { return r.json(); }).then(function (b) { return { id: t.id, b: b }; }).catch(function () { return null; }); }));
    });
    // Wikimedia ya solo sirve miniaturas de tamaños estándar: las de 800 px de viajes antiguos pasan a 960
    var fx = function (u) { return String(u).replace(/(\/thumb\/.+\/)(\d+)px-/, function (m, a, n) { return a + ([250, 330, 500, 960, 1280].filter(function (x) { return x >= +n; })[0] || 1920) + 'px-'; }); };
    var u = DB.all().catch(function () { return []; }).then(function (l) { return (l || []).map(function (x) { var ph = (x.bundle || {}).photos || {}; Object.keys(ph).forEach(function (k) { ph[k] = fx(ph[k]); }); return { id: x.id, b: x.bundle }; }); });
    return Promise.all([a, u]).then(function (r) { return r[0].filter(Boolean).concat(r[1]); });
  }
  Album.init({ trips: allTrips, backupTrips: function () { return DB.all().then(function (l) { return (l || []).map(function (x) { return { id: x.id, at: x.at, bundle: x.bundle }; }); }).catch(function () { return []; }); },
    restoreTrips: function (list) { return Promise.all(list.map(function (x) { return x && x.id && x.bundle && /^u-/.test(x.id) ? DB.put({ id: x.id, at: x.at || Date.now(), bundle: x.bundle }) : null; })); }, onChange: function () { var t = $$('.vn').filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]; if (t && t.getAttribute('data-vt') === 'home') renderHome(); } });
  function renderProfile() {
    return Album.renderProfile().then(function () {
      var th = 'auto'; try { th = localStorage.getItem('guia-theme') || 'auto'; } catch (e) {}
      $$('#themeOpts .opt').forEach(function (o) { o.classList.toggle('on', o.getAttribute('data-th') === th); });
      var ho = $('#homeOpts'); if (ho) ho.innerHTML = styleChips();
      var pjOff = false; try { pjOff = localStorage.getItem('guia-pj') === 'off'; } catch (e) {}
      $$('[data-pjo]').forEach(function (b) { b.classList.toggle('on', (b.getAttribute('data-pjo') === 'off') === pjOff); });
      var bk = $('#bkNote'), at = window.Juego ? Juego.get().backup : 0;
      if (bk) bk.textContent = at ? tx('Última copia: ', 'Last backup: ') + sd(new Date(at).toISOString().slice(0, 10)) + '. ' + tx('Tus viajes y cromos solo están en este dispositivo.', 'Your trips and cards are only on this device.') : tx('Aún no has guardado ninguna. Tus viajes y cromos solo están en este dispositivo.', 'You haven’t saved one yet. Your trips and cards are only on this device.');
    });
  }
  $('#themeOpts').addEventListener('click', function (e) {
    var o = e.target.closest('[data-th]'); if (!o) return; var t = o.getAttribute('data-th');
    try { localStorage.setItem('guia-theme', t); } catch (err) {}
    var d = t === 'dark' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
    $$('#themeOpts .opt').forEach(function (x) { x.classList.toggle('on', x === o); });
  });

  /* ---------- Home: seis diseños a elegir (guia-home). «clasico» = el de la 3.15 ----------
     Todos enseñan lo mismo: el próximo viaje, lo que falta antes de salir, el tiempo, lo imprescindible,
     ideas para el próximo viaje y una invitación a crear uno; cambia cómo se cuenta. */
  var HOME_STYLES = [['cuenta', 'Cuenta atrás', 'Countdown'], ['pase', 'Tarjeta de embarque', 'Boarding pass'], ['revista', 'Revista', 'Magazine'],
    ['ruta', 'Línea del tiempo', 'Timeline'], ['widgets', 'Widgets', 'Widgets'], ['clasico', 'Clásico', 'Classic']];
  function homeStyle() { var s = ''; try { s = localStorage.getItem('guia-home') || ''; } catch (e) {} return HOME_STYLES.some(function (x) { return x[0] === s; }) ? s : 'cuenta'; }
  function isEn() { return window.Lang && Lang.get() === 'en'; }
  function tx(es, en) { return isEn() ? en : es; }
  function sd(iso) { var d = new Date(iso + 'T12:00:00Z'); return d.getUTCDate() + ' ' + d.toLocaleDateString(isEn() ? 'en-GB' : 'es', { month: 'short', timeZone: 'UTC' }).replace('.', ''); }
  function monName(m) { return new Date(Date.UTC(2026, m - 1, 15)).toLocaleDateString(isEn() ? 'en-GB' : 'es', { month: 'long', timeZone: 'UTC' }); }
  function hdUrl(u) { return /wikimedia\.org\/.+\/(250|330|500|960)px-/.test(u || '') ? u.replace(/\/(250|330|500|960)px-/, '/1280px-') : u; }
  function bg(u) { if (!u) return ''; var h = hdUrl(u); return ' style="background-image:url(&quot;' + esc(h) + '&quot;)' + (h !== u ? ',url(&quot;' + esc(u) + '&quot;)' : '') + '"'; }
  function daysTo(iso) { var n = new Date(), t = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()), d = new Date(iso + 'T00:00:00Z').getTime(); return Math.round((d - t) / 864e5); }
  // lo que hay que hacer antes de salir (la maleta de ida); lo importante primero
  function chkInfo(T) {
    var ns = (T.b.meta.storage || T.b.meta.id || T.id) + ':', ck = {}, E = isEn() ? (T.b.trip_en || {}).checklist || {} : {}, all = 0, done = 0, todo = [];
    try { ck = JSON.parse(localStorage.getItem(ns + 'checked') || '{}') || {}; } catch (e) {}
    (T.b.trip.checklist || []).forEach(function (c) {
      if ((c.when || 'out') !== 'out') return;
      (c.items || []).forEach(function (i, k) { all++; if (ck[i.id]) done++; else todo.push({ id: i.id, t: (((E[c.id] || {}).items || {})[i.id] || {}).t || i.t, imp: i.imp ? 1 : 0, k: todo.length }); });
    });
    todo.sort(function (a, b) { return b.imp - a.imp || a.k - b.k; });
    return { ns: ns, all: all, done: done, pc: all ? Math.round(done / all * 100) : 0, todo: todo };
  }
  var HOME = null, IDEA_SEEN = {};
  function ideaAt(x) { IDEAS_NOW.push(x); return IDEAS_NOW.length - 1; }
  function homeData(O) {
    var trips = O.trips, D = { O: O, trips: trips, known: {} };
    D.next = trips.filter(function (t) { return t.status !== 'past'; }).sort(function (a, b) { return String(a.start).localeCompare(String(b.start)); })[0] || null;
    if (D.next) {
      var t = D.next, T = t.ref, dd = daysTo(t.start);
      D.dd = dd; D.live = t.status === 'now'; D.day = 1 - dd;
      D.when = D.live ? tx('Día ' + D.day + ' de ' + t.days, 'Day ' + D.day + ' of ' + t.days) : dd === 0 ? tx('¡Es hoy!', 'It’s today!') : dd === 1 ? tx('Mañana', 'Tomorrow') : tx('Faltan ' + dd + ' días', dd + ' days to go');
      D.range = t.start ? sd(t.start) + ' – ' + sd(t.end || addDays(t.start, t.days - 1)) : '';
      D.must = Album.cromosOf(T, Album.get()).filter(function (c) { return c.must; }).slice(0, 10);
      D.mustGot = D.must.filter(function (c) { return c.got; }).length;
      D.chk = chkInfo(T);
      D.wxn = (T.b.trip.wx[0] || {}).n || '';
    }
    if (window.Mundo) trips.forEach(function (t) { (Mundo.cached(t.ref) || []).forEach(function (c) { D.known[c] = 1; }); });
    D.ideas = window.Juego ? Juego.ideas(D.known, 6) : [];
    D.mon = monName(new Date().getMonth() + 1);
    return D;
  }
  // sobres, retos del día y recuerdos: solo si hay algo
  function extrasHTML(D) {
    if (!window.Juego) return '';
    var h = '', G = Juego.get(), nP = Juego.total(G), kP = ['r', 'g', 's', 'c'].filter(function (k) { return G.bag.some(function (b) { return b.k === k; }); })[0] || 'c';
    if (nP) h += '<button type="button" class="card hm-row sq rv-h" data-go="album"><span class="hm-pk k-' + kP + '"><span class="pk-foil"></span></span><span><b>' + (nP === 1 ? tx('Tienes 1 sobre', 'You have 1 pack') : tx('Tienes ' + nP + ' sobres', 'You have ' + nP + ' packs')) + '</b><small>' + tx('Ábrelo en tu álbum', 'Open it in your album') + '</small></span>' + ic('chev') + '</button>';
    if (D.next && D.live) h += '<div class="card hm-ret rv-h"><b>' + tx('Retos de hoy', 'Today’s challenges') + '</b><ul>' + Juego.challenges().map(function (c) { return '<li class="' + (c.done ? 'ok' : '') + '">' + esc(c.t) + '</li>'; }).join('') + '</ul></div>';
    var nowD = new Date(), mem = D.trips.filter(function (t) {
      if (t.status !== 'past' || !t.start) return false;
      var d0 = new Date(t.start + 'T12:00:00Z'), same = new Date(Date.UTC(nowD.getFullYear(), d0.getUTCMonth(), d0.getUTCDate(), 12));
      return Math.abs(same - nowD) < 8 * 864e5 && d0.getUTCFullYear() < nowD.getFullYear();
    })[0];
    if (mem) { var yrs = nowD.getFullYear() - +mem.start.slice(0, 4); h += '<button type="button" class="card hm-row sq rv-h" data-open="' + esc(mem.id) + '"><span class="hm-ph"' + bg(mem.cover) + '></span><span><b>' + (yrs === 1 ? tx('Hace 1 año', '1 year ago') : tx('Hace ' + yrs + ' años', yrs + ' years ago')) + '</b><small>' + esc(mem.title) + '</small></span>' + ic('chev') + '</button>'; }
    return h;
  }
  // tareas que se pueden marcar desde aquí (se guardan donde las guarda la guía); al marcar, cambian en directo
  function taskLi(i, k, num) {
    return '<li data-tid="' + esc(i.id) + '"><button type="button" class="hx-tk" data-tick="' + esc(i.id) + '" aria-label="' + tx('Hecho', 'Done') + '">' + ic('check') + '</button><span>' + (num ? '<i>' + ('0' + (k + 1)).slice(-2) + '</i>' : '') + esc(i.t) + (i.imp ? '<em>' + tx('Importante', 'Important') + '</em>' : '') + '</span></li>';
  }
  function tasksHTML(D, n, cls) {
    var C = D.chk, id = esc(D.next.id);
    if (!C.all) return '';
    if (!C.todo.length) return '<p class="hx-done">' + ic('check') + tx('Todo listo para salir', 'All set to go') + '</p>';
    return '<ul class="hx-tasks ' + (cls || '') + '" data-n="' + n + '">' + C.todo.slice(0, n).map(function (i, k) { return taskLi(i, k, cls === 'num'); }).join('') + '</ul><button type="button" class="hx-more" data-open="' + id + '" data-grp="ida">' + tx('Ver la lista entera', 'See the whole list') + ' · <span data-ckd>' + C.done + '</span>/' + C.all + ic('chev') + '</button>';
  }
  function tickTask(tk) {
    var C = HOME.chk, id = tk.getAttribute('data-tick'), li = tk.closest('li'), ul = li && li.parentNode, ck = {};
    if (!li || li.classList.contains('ok')) return;
    try { ck = JSON.parse(localStorage.getItem(C.ns + 'checked') || '{}') || {}; } catch (err) {}
    ck[id] = true;
    try { localStorage.setItem(C.ns + 'checked', JSON.stringify(ck)); } catch (err) {}
    try { if (navigator.vibrate) navigator.vibrate(10); } catch (err) {}
    li.classList.add('ok');
    C.done++; C.todo = C.todo.filter(function (x) { return x.id !== id; }); C.pc = C.all ? Math.round(C.done / C.all * 100) : 0;
    $$('[data-ckd]').forEach(function (el) { el.textContent = C.done; });
    $$('[data-ckpc]').forEach(function (el) { el.textContent = C.pc; });
    $$('[data-ckbar]').forEach(function (el) { el.style.width = C.pc + '%'; });
    // la tachada se pliega y entra la siguiente pendiente, sin volver a pintar la página
    setTimeout(function () {
      li.style.height = li.offsetHeight + 'px'; void li.offsetHeight; li.classList.add('gone');
      setTimeout(function () {
        li.remove();
        var shown = $$('li[data-tid]', ul).map(function (x) { return x.getAttribute('data-tid'); }), nx = C.todo.filter(function (x) { return shown.indexOf(x.id) < 0; })[0];
        if (nx && shown.length < +(ul.getAttribute('data-n') || 3)) { ul.insertAdjacentHTML('beforeend', taskLi(nx, shown.length, ul.classList.contains('num'))); ul.lastChild.classList.add('in'); }
        if (!ul.children.length) { var more = ul.nextElementSibling; if (more && more.classList.contains('hx-more')) more.remove(); ul.outerHTML = '<p class="hx-done">' + ic('check') + tx('Todo listo para salir', 'All set to go') + '</p>'; }
      }, 360);
    }, 520);
  }
  function ring(pc, inner, cls) {
    var r = 26, c = 2 * Math.PI * r;
    return '<span class="hx-ring ' + (cls || '') + '"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="' + r + '" class="bgc"/><circle cx="32" cy="32" r="' + r + '" class="fgc" style="stroke-dasharray:' + c.toFixed(1) + ';stroke-dashoffset:' + (c * (1 - pc / 100)).toFixed(1) + '"/></svg><b>' + inner + '</b></span>';
  }
  function ideaCard(x, cls) {
    return '<button type="button" class="idea sq ' + (cls || '') + '" data-idea="' + ideaAt(x) + '"><span class="idea-ph" data-wiki="' + esc(x.wiki) + '"></span><span class="idea-t"><span class="idea-fl">' + (Mundo.flag(x.cc) || '') + '</span><b>' + esc(x.t) + '</b><small>' + esc(x.sub) + '</small></span></button>';
  }
  function ideasRow(D, title) {
    if (!D.ideas.length) return '';
    return '<div class="rv-h"><div class="hm-h"><b>' + (title || tx('Ideas para ' + D.mon, 'Ideas for ' + D.mon)) + '</b><button type="button" class="hx-lnk" data-rec>' + tx('Sorpréndeme', 'Surprise me') + '</button></div><div class="idea-row">' + D.ideas.map(function (x) { return ideaCard(x); }).join('') + '</div></div>';
  }
  // invitación a crear un viaje: tres postales de sitios a los que ir, en abanico
  function newCard(D, kick) {
    var ph = (D.ideas.length > 3 ? D.ideas.slice(3) : D.ideas).slice(0, 3);
    return '<button type="button" class="hx-new sq rv-h" data-new><span class="hx-fan">' + ph.map(function (x, i) { return '<i style="--i:' + i + '"><span data-wiki="' + esc(x.wiki) + '"></span></i>'; }).join('') + '</span>' +
      '<span class="hx-nt"><small>' + (kick || (D.next ? tx('¿Y después?', 'And next?') : tx('Sin viajes a la vista', 'No trips ahead'))) + '</small><b>' + tx('Crea tu próximo viaje', 'Plan your next trip') + '</b><span>' + tx('Elige destino y fechas: la guía se hace sola, con datos reales.', 'Pick a place and dates: the guide builds itself from real data.') + '</span><em>' + tx('Empezar', 'Start') + ic('chev') + '</em></span></button>';
  }
  function mustRow(D) {
    if (!D.must.length) return '';
    var T = D.next.ref;
    return '<div class="hm-sec rv-h"><div class="hm-h"><b>' + tx('Imprescindibles', 'Must-sees') + '</b><small>' + D.mustGot + ' ' + tx('de', 'of') + ' ' + D.must.length + '</small></div><div class="hm-scroll">' + D.must.map(function (c) {
      return '<button type="button" class="hm-must' + (c.got ? ' got' : '') + '" data-cr="' + esc(T.id + '|' + c.id) + '"' + bg(c.img) + '><span>' + esc(c.ti) + '</span></button>';
    }).join('') + '</div></div>';
  }

  // la portada del próximo viaje (la del Clásico)
  function heroHTML(D) {
    var t = D.next;
    if (!t) return '<button type="button" class="hm-next empty rv-h" data-new><span class="hm-ey">' + tx('Sin viajes a la vista', 'No trips ahead') + '</span><b>' + tx('¿A dónde vamos?', 'Where to?') + '</b><small>' + tx('Crea una guía nueva en un par de minutos, con datos reales.', 'Create a new guide in a couple of minutes, with real data.') + '</small><span class="hm-go">' + tx('Crear un viaje', 'Create a trip') + ic('chev') + '</span></button>';
    return '<button type="button" class="hm-next rv-h" data-open="' + esc(t.id) + '"' + bg(t.cover) + '><span class="hm-shade"></span>' +
      '<span class="hm-ey">' + (D.live ? tx('Estás de viaje', 'You’re travelling') : tx('Tu próximo viaje', 'Your next trip')) + '</span><span class="hm-cd">' + esc(D.live ? tx('En curso · día ' + D.day + ' de ' + t.days, 'Day ' + D.day + ' of ' + t.days) : D.when) + '</span><b>' + esc(t.title) + '</b><small>' + esc(dateLbl(t.start)) + ' – ' + esc(dateLbl(addDays(t.start, Math.max(0, t.days - 1)))) + '</small><span class="hm-go">' + tx('Abrir la guía', 'Open the guide') + ic('chev') + '</span></button>';
  }
  function tileProfile(D) { var O = D.O, n = D.trips.length; return '<button type="button" class="card hm-t" data-go="profile"><span class="hm-tt">' + ic('user') + tx('Perfil', 'Profile') + '</span><span class="hm-big">' + O.badgesOn + '<i>/' + O.badgesMax + '</i></span><small>' + tx('insignias', 'badges') + '</small><small>' + n + (n === 1 ? tx(' viaje', ' trip') : tx(' viajes', ' trips')) + ' · ' + O.totalDays + tx(' días', ' days') + '</small></button>'; }
  function tileAlbum(D) {
    var O = D.O, fan = O.recent.slice(0, 3);
    return '<button type="button" class="card hm-t" data-go="album"><span class="hm-tt">' + ic('star') + tx('Álbum', 'Album') + '</span>' +
      (fan.length ? '<span class="hm-fan">' + fan.map(function (c, i) { return '<i class="' + (c.img ? '' : 'noph') + '" style="--r:' + (i - 1) * 9 + 'deg;--x:' + (i - 1) * 22 + 'px' + (c.img ? ';background-image:url(&quot;' + esc(c.img) + '&quot;)' : '') + '"></i>'; }).join('') + '</span>' : '<span class="hm-big">' + O.got + '<i>/' + O.all + '</i></span>') +
      '<small>' + O.got + tx(' de ', ' of ') + O.all + tx(' cromos', ' cards') + '</small></button>';
  }
  function tileReady(D) { var C = D.chk; return '<button type="button" class="card hm-t" data-open="' + esc(D.next.id) + '" data-grp="ida"><span class="hm-tt">' + ic('check') + tx('Listo para salir', 'Ready to go') + '</span><span class="hm-big"><span data-ckpc>' + C.pc + '</span><i>%</i></span><span class="hm-prog"><i data-ckbar style="width:' + C.pc + '%"></i></span><small><span data-ckd>' + C.done + '</span>' + tx(' de ', ' of ') + C.all + tx(' tareas', ' tasks') + '</small></button>'; }
  // el tiempo con su dibujo (sol, nubes, lluvia, nieve…), como en la previsión de la guía
  function tileWeather(D) { return '<button type="button" class="card hm-t" data-open="' + esc(D.next.id) + '" data-grp="wx"><span class="hm-tt">' + ic('cloud') + tx('Tiempo', 'Weather') + '</span><span class="hm-wx"><svg class="ic hm-wxi" data-wxi><use href="#i-cloudsun"></use></svg><span class="hm-big" data-wxt>–</span></span><small data-wxn>' + esc(D.wxn) + '</small></button>'; }
  function mustPage(D) {
    var t = D.next, T = t.ref, all = Album.cromosOf(T, Album.get()).filter(function (c) { return c.must; }), got = all.filter(function (c) { return c.got; }).length;
    var old = $('#mustBox'); if (old) old.remove();
    var v = document.createElement('div'); v.id = 'mustBox'; v.className = 'msp';
    v.innerHTML = '<div class="msp-top"><button type="button" class="rec-bk" data-mspx>' + ic('chev') + tx('Home', 'Home') + '</button><small>' + esc(t.title) + '</small><span></span></div>' +
      '<div class="msp-in"><h2>' + tx('Imprescindibles', 'Must-sees') + '</h2><p>' + got + tx(' de ', ' of ') + all.length + tx(' vistos. Lo que no te puedes perder en este viaje.', ' seen. What you can’t miss on this trip.') + '</p>' +
      all.map(function (c, i) {
        return '<button type="button" class="msp-c sq' + (c.got ? ' got' : '') + '" data-cr="' + esc(T.id + '|' + c.id) + '" style="--d:' + Math.min(i, 8) * 40 + 'ms"><span class="msp-ph"' + bg(c.img) + '></span><span class="msp-t"><small>' + tx('Día ', 'Day ') + c.day + (c.got ? ' · ' + tx('Visto', 'Seen') : '') + '</small><b>' + esc(c.ti) + '</b>' + (c.lead ? '<span>' + esc(c.lead) + '</span>' : '') + '</span></button>';
      }).join('') + '</div>';
    v.addEventListener('click', function (e) { if (e.target.closest('[data-mspx]')) { v.classList.add('out'); setTimeout(function () { v.remove(); }, 280); } });
    document.body.appendChild(v);
  }

  /* 1 · Cuenta atrás: la portada, cuatro recuadros, lo imprescindible y la lista de antes de salir */
  function homeCuenta(D) {
    var h = heroHTML(D);
    if (!D.next) return h + ideasRow(D) + newCard(D) + extrasHTML(D);
    h += '<div class="hm-four rv-h" style="--d:60ms">' + tileReady(D) + tileWeather(D) + '</div>';
    if (D.must.length) h += '<div class="hm-sec rv-h" style="--d:120ms"><div class="hm-h"><b>' + tx('Imprescindibles', 'Must-sees') + '</b><button type="button" class="hx-lnk" data-mustall>' + tx('Ver todos', 'See all') + ' · ' + D.mustGot + '/' + D.must.length + '</button></div><div class="hm-scroll">' + D.must.map(function (c) {
      return '<button type="button" class="hm-must' + (c.got ? ' got' : '') + '" data-cr="' + esc(D.next.ref.id + '|' + c.id) + '"' + bg(c.img) + '><span>' + esc(c.ti) + '</span></button>';
    }).join('') + '</div></div>';
    if (!D.live && D.chk.all) h += '<div class="card rv-h" style="--d:160ms"><div class="hm-h in"><b>' + tx('Antes de salir', 'Before you go') + '</b><small><span data-ckd>' + D.chk.done + '</span>' + tx(' de ', ' of ') + D.chk.all + '</small></div>' + tasksHTML(D, 3) + '</div>';
    return h + extrasHTML(D) + ideasRow(D) + newCard(D);
  }

  /* 2 · Tarjeta de embarque: el viaje como un billete; el check-in es la lista de antes de salir */
  function homePase(D) {
    var h = '';
    if (D.next) {
      var t = D.next, id = esc(t.id), C = D.chk;
      h += '<div class="hp-pass rv-h"><button type="button" class="hp-top" data-open="' + id + '"' + bg(t.cover) + '><span class="hm-shade"></span><small>' + tx('Tarjeta de embarque', 'Boarding pass') + '</small><b>' + esc(t.title) + '</b></button>' +
        '<div class="hp-grid"><span><small>' + tx('Salida', 'Departs') + '</small><b>' + esc(t.start ? sd(t.start) : '–') + '</b></span><span><small>' + tx('Regreso', 'Returns') + '</small><b>' + esc(t.end ? sd(t.end) : '–') + '</b></span>' +
        '<button type="button" data-open="' + id + '" data-grp="wx"><small>' + tx('Tiempo', 'Weather') + '</small><b data-wxt>–</b></button><span><small>' + (D.live ? tx('En curso', 'Now') : tx('Embarque', 'Boarding')) + '</small><b>' + (D.live ? tx('día ', 'day ') + D.day : D.dd <= 0 ? tx('hoy', 'today') : tx('en ', 'in ') + D.dd + ' d') + '</b></span></div>' +
        '<div class="hp-cut"></div>' +
        '<button type="button" class="hp-stub" data-open="' + id + '" data-grp="ida"><span><small>' + tx('Check-in · antes de salir', 'Check-in · before you go') + '</small><b>' + (C.all && !C.todo.length ? tx('Todo listo', 'All set') : C.done + ' ' + tx('de', 'of') + ' ' + C.all + ' ' + tx('listo', 'done')) + '</b><span class="hm-prog"><i style="width:' + C.pc + '%"></i></span></span><span class="hp-code"></span></button></div>';
      if (!D.live && C.todo.length) h += '<div class="card rv-h" style="--d:60ms"><div class="hm-h in"><b>' + tx('Pendiente para el check-in', 'Left for check-in') + '</b></div>' + tasksHTML(D, 3) + '</div>';
      if (D.must.length) h += '<div class="hm-sec rv-h" style="--d:100ms"><div class="hm-h"><b>' + tx('Escalas imprescindibles', 'Must-see stops') + '</b><small>' + D.mustGot + '/' + D.must.length + '</small></div><div class="hm-scroll hp-stops">' + D.must.map(function (c, i) {
        return '<button type="button" class="' + (c.got ? 'got' : '') + '" data-cr="' + esc(t.ref.id + '|' + c.id) + '"><i' + bg(c.img) + '><em>' + (i + 1) + '</em></i><span>' + esc(c.ti) + '</span></button>';
      }).join('') + '</div></div>';
    }
    h += extrasHTML(D);
    if (D.ideas.length) h += '<div class="rv-h" style="--d:140ms"><div class="hm-h"><b>' + tx('Próximos destinos', 'Next destinations') + '</b><button type="button" class="hx-lnk" data-rec>' + tx('Sorpréndeme', 'Surprise me') + '</button></div>' + D.ideas.slice(0, 4).map(function (x) {
      return '<button type="button" class="hp-tk sq" data-idea="' + ideaAt(x) + '"><span class="hp-tph" data-wiki="' + esc(x.wiki) + '"></span><span class="hp-tm"><b>' + (Mundo.flag(x.cc) || '') + ' ' + esc(x.t) + '</b><small>' + esc(x.sub) + '</small></span><span class="hp-tst"><small>' + tx('Ir en', 'Go in') + '</small><b>' + esc(monName(x.month).slice(0, 3)) + '</b></span></button>';
    }).join('') + '</div>';
    h += '<button type="button" class="hp-blank sq rv-h" data-new><small>' + tx('Tarjeta de embarque', 'Boarding pass') + '</small><span class="hp-q"><small>' + tx('Destino', 'Destination') + '</small><b>' + tx('¿A dónde vamos?', 'Where to?') + '</b></span>' +
      '<span class="hp-grid"><span><small>' + tx('Salida', 'Departs') + '</small><b>—</b></span><span><small>' + tx('Días', 'Days') + '</small><b>—</b></span></span><em>' + ic('plus') + tx('Crear un viaje', 'Create a trip') + '</em></button>';
    return h;
  }

  /* 3 · Revista: portada con el próximo viaje, listas numeradas e inspiración del mes */
  function homeRevista(D) {
    var now = new Date(), h = '<div class="hr-mast rv-h"><span>' + esc(D.mon) + ' ' + now.getFullYear() + '</span><span>' + tx('Tus viajes · nº ', 'Your trips · no. ') + Math.max(1, D.trips.length) + '</span></div>';
    if (D.next) {
      var t = D.next, id = esc(t.id);
      h += '<button type="button" class="hr-cover rv-h" data-open="' + id + '"' + bg(t.cover) + '><span class="hm-shade"></span><small class="hr-k">' + tx('En portada', 'Cover story') + '</small>' +
        '<span class="hr-lines">' + (D.must.length ? '<span><b>' + D.must.length + '</b> ' + tx('imprescindibles', 'must-sees') + '</span>' : '') + '<span><b data-wxt>–</b> ' + esc(D.wxn) + '</span></span>' +
        '<b class="hr-ti">' + esc(t.title) + '</b><small>' + esc(D.when) + ' · ' + esc(D.range) + '</small></button>';
      if (!D.live && D.chk.all) h += '<div class="hr-sec rv-h"><div class="hr-h"><b>' + tx('Antes de salir', 'Before you go') + '</b><small>' + D.chk.pc + ' %</small></div>' + tasksHTML(D, 4, 'num') + '</div>';
      if (D.must.length) h += '<div class="hr-sec rv-h"><div class="hr-h"><b>' + tx('No te lo pierdas', 'Don’t miss') + '</b><small>' + D.mustGot + '/' + D.must.length + '</small></div><ol class="hr-must">' + D.must.slice(0, 4).map(function (c, i) {
        return '<li><button type="button" data-cr="' + esc(t.ref.id + '|' + c.id) + '"><i>' + ('0' + (i + 1)).slice(-2) + '</i><span>' + esc(c.ti) + (c.got ? '<em>' + tx('Visto', 'Seen') + '</em>' : '') + '</span><u' + bg(c.img) + '></u></button></li>';
      }).join('') + '</ol></div>';
    }
    h += extrasHTML(D);
    if (D.ideas.length) {
      var f = D.ideas[0];
      h += '<div class="hr-sec rv-h"><div class="hr-h"><b>' + tx('Inspiración de ' + D.mon, D.mon + ' inspiration') + '</b><button type="button" class="hx-lnk" data-rec>' + tx('Sorpréndeme', 'Surprise me') + '</button></div>' +
        ideaCard(f, 'hr-feat') + '<div class="hr-two">' + D.ideas.slice(1, 3).map(function (x) { return ideaCard(x, 'hr-sm'); }).join('') + '</div></div>';
    }
    var mo = D.ideas.slice(3, 6); if (mo.length < 3) mo = D.ideas.slice(0, 3);
    h += '<button type="button" class="hr-next sq rv-h" data-new><span class="hr-mos">' + mo.map(function (x) { return '<i data-wiki="' + esc(x.wiki) + '"></i>'; }).join('') + '</span><span class="hm-shade"></span>' +
      '<span class="hr-nt"><small>' + tx('Próximo número', 'Next issue') + '</small><b>' + tx('¿Dónde será tu próxima portada?', 'Where will your next cover be?') + '</b><em>' + ic('plus') + tx('Crear un viaje', 'Create a trip') + '</em></span></button>';
    return h;
  }

  /* 4 · Línea del tiempo: de hoy en adelante, con el viaje en su fecha y una idea en cada mes que viene */
  function homeRuta(D) {
    var now = new Date(), h = '<div class="ht">', t = D.next, used = {};
    function node(cls, when, body, d) { return '<div class="ht-n ' + cls + ' rv-h" style="--d:' + (d || 0) + 'ms"><span class="ht-dot"></span><small class="ht-w">' + when + '</small>' + body + '</div>'; }
    h += node('ht-now', tx('Hoy', 'Today') + ' · ' + sd(now.toISOString().slice(0, 10)), '<p class="ht-p">' + (t ? (D.live ? tx('Estás en ' + esc(t.title) + ': día ' + D.day + ' de ' + t.days + '.', 'You’re on ' + esc(t.title) + ': day ' + D.day + ' of ' + t.days + '.') : esc(D.when) + ' ' + tx('para ', 'until ') + esc(t.title) + '. <span class="ht-wx"><b data-wxt>–</b> ' + esc(D.wxn) + '</span>') : tx('No tienes viajes a la vista. Aquí abajo, ideas para los próximos meses.', 'No trips ahead. Below, ideas for the coming months.')) + '</p>');
    if (t && !D.live && D.chk.all) h += node('', tx('Antes de salir', 'Before you go') + ' · ' + D.chk.done + '/' + D.chk.all, '<div class="card ht-c">' + tasksHTML(D, 2) + '</div>', 40);
    if (t) {
      var stack = D.must.slice(0, 4);
      h += node('ht-tr', (D.live ? tx('Ahora', 'Now') : sd(t.start)) + ' · ' + tx('Empieza tu viaje', 'Your trip starts'), '<button type="button" class="ht-trip" data-open="' + esc(t.id) + '"' + bg(t.cover) + '><span class="hm-shade"></span><b>' + esc(t.title) + '</b><small>' + esc(D.range) + ' · ' + t.days + ' ' + tx('días', 'days') + '</small>' +
        (stack.length ? '<span class="ht-st">' + stack.map(function (c) { return '<i' + bg(c.img) + '></i>'; }).join('') + '<em>' + D.must.length + ' ' + tx('imprescindibles', 'must-sees') + '</em></span>' : '') + '</button>', 80);
    }
    var ex = extrasHTML(D); if (ex) h += '<div class="ht-x">' + ex + '</div>';
    // los meses que vienen, cada uno con una idea de su época
    var m0 = (t && t.end ? new Date(t.end + 'T12:00:00Z') : now).getUTCMonth() + 2, yr = (t && t.end ? new Date(t.end + 'T12:00:00Z') : now).getUTCFullYear();
    for (var k = 0; k < 4 && window.Juego; k++) {
      var mm = (m0 - 1 + k) % 12 + 1, y = yr + Math.floor((m0 - 1 + k) / 12), x = Juego.ideasIn(D.known, mm, 1, used)[0];
      if (!x) continue; used[x.wiki] = 1;
      h += node('ht-id', monName(mm) + (y !== now.getFullYear() ? ' ' + y : ''), '<button type="button" class="ht-idea sq" data-idea="' + ideaAt(x) + '"><span class="ht-iph" data-wiki="' + esc(x.wiki) + '"></span><span><b>' + (Mundo.flag(x.cc) || '') + ' ' + esc(x.t) + '</b><small>' + esc(x.sub) + '</small></span>' + ic('chev') + '</button>', 120 + k * 40);
    }
    h += node('ht-ad', tx('Y luego…', 'And then…'), '<button type="button" class="ht-add sq" data-new><span>' + ic('plus') + '</span><b>' + tx('Añade aquí tu próximo viaje', 'Add your next trip here') + '</b><small>' + tx('o deja que la app te proponga uno', 'or let the app suggest one') + '</small></button><button type="button" class="hx-lnk ht-rec" data-rec>' + tx('Recomiéndame un viaje', 'Recommend me a trip') + '</button>', 300);
    return h + '</div>';
  }

  /* 5 · Widgets: como la pantalla de inicio del móvil, cuadrados que se leen de un vistazo */
  function homeWidgets(D) {
    var h = '<div class="hw rv-h">', t = D.next, O = D.O;
    var nw = '<button type="button" class="hw-w hw-wide hw-new sq" data-new><span class="hw-glb">' + ic('plus') + '</span><span><b>' + tx('Nuevo viaje', 'New trip') + '</b><small>' + tx('Destino y fechas, y la guía se hace sola', 'Pick a place and dates, the guide builds itself') + '</small></span></button>' +
      '<button type="button" class="hw-w hw-wide card hw-rec sq" data-rec><span class="hw-glb">✦</span><span><b>' + tx('Recomiéndame un viaje', 'Recommend me a trip') + '</b><small>' + tx('Una idea según la época del año', 'An idea for the time of year') + '</small></span>' + ic('chev') + '</button>';
    if (!t) h += nw;
    if (t) {
      var id = esc(t.id);
      h += '<button type="button" class="hw-w hw-trip" data-open="' + id + '"' + bg(t.cover) + '><span class="hm-shade"></span><small>' + (D.live ? tx('De viaje', 'Travelling') : tx('Próximo viaje', 'Next trip')) + '</small><span class="hw-cd"><b>' + (D.live ? D.day : Math.max(0, D.dd)) + '</b><span>' + (D.live ? tx('día de ' + t.days, 'day of ' + t.days) : D.dd === 1 ? tx('día', 'day') : tx('días', 'days')) + '</span></span><b class="hw-ti">' + esc(t.title) + '</b><small>' + esc(D.range) + '</small></button>' +
        '<button type="button" class="hw-w card" data-open="' + id + '" data-grp="ida"><small class="hw-l">' + ic('check') + tx('Maleta', 'Packing') + '</small>' + ring(D.chk.pc, D.chk.pc + '<i>%</i>') + '<small>' + D.chk.done + ' ' + tx('de', 'of') + ' ' + D.chk.all + '</small></button>' +
        '<button type="button" class="hw-w card hw-wx" data-open="' + id + '" data-grp="wx"><small class="hw-l">' + ic('cloud') + tx('Tiempo', 'Weather') + '</small><b class="hw-big" data-wxt>–</b><small data-wxn>' + esc(D.wxn) + '</small></button>';
      if (D.must.length) h += '<button type="button" class="hw-w hw-must" data-open="' + id + '"' + bg((D.must.filter(function (c) { return !c.got; })[0] || D.must[0]).img) + '><span class="hm-shade"></span><small>' + tx('Imprescindibles', 'Must-sees') + '</small><b>' + D.mustGot + '<i>/' + D.must.length + '</i></b></button>';
    }
    if (O.nextBadge) h += '<button type="button" class="hw-w card hw-bdg" data-go="profile"><small class="hw-l">' + tx('Siguiente insignia', 'Next badge') + '</small>' + O.nextBadgeHTML + '<small>' + esc(O.nextBadge.name) + ' · ' + O.nextBadge.have + '/' + O.nextBadge.need + '</small></button>';
    if (D.ideas.length) h += '<div class="hw-w hw-wide hw-ideas"><div class="hw-sl">' + D.ideas.map(function (x) {
      return '<button type="button" data-idea="' + ideaAt(x) + '"><span class="idea-ph" data-wiki="' + esc(x.wiki) + '"></span><span class="hm-shade"></span><small>' + tx('Idea para ', 'Idea for ') + esc(monName(x.month)) + '</small><b>' + (Mundo.flag(x.cc) || '') + ' ' + esc(x.t) + '</b><span>' + esc(x.sub) + '</span></button>';
    }).join('') + '</div><span class="hw-dots">' + D.ideas.map(function (x, i) { return '<i class="' + (i ? '' : 'on') + '"></i>'; }).join('') + '</span></div>';
    if (t) h += nw;
    return h + '</div>' + extrasHTML(D);
  }

  /* 6 · Clásico: el Home de la 3.15 (sin la copia de seguridad, que está en Perfil) */
  function homeClasico(D) {
    var O = D.O, trips = D.trips, nextT = D.next, h = '';
    if (nextT) {
      h += '<button type="button" class="hm-next rv-h" data-open="' + esc(nextT.id) + '"' + bg(nextT.cover) + '><span class="hm-shade"></span>' +
        '<span class="hm-ey">Tu próximo viaje</span><span class="hm-cd">' + esc(nextT.status === 'now' ? 'En curso · día ' + D.day + ' de ' + nextT.days : D.dd === 0 ? '¡Es hoy!' : D.dd === 1 ? 'Mañana' : 'Faltan ' + D.dd + ' días') + '</span><b>' + esc(nextT.title) + '</b><small>' + esc(dateLbl(nextT.start)) + ' – ' + esc(dateLbl(addDays(nextT.start, Math.max(0, nextT.days - 1)))) + '</small><span class="hm-go">Abrir la guía' + ic('chev') + '</span></button>';
    } else {
      h += '<button type="button" class="hm-next empty rv-h" data-new><span class="hm-ey">Sin viajes a la vista</span><b>¿A dónde vamos?</b><small>Crea una guía nueva en un par de minutos, con datos reales.</small><span class="hm-go">Crear un viaje' + ic('chev') + '</span></button>';
    }
    h += extrasHTML(D);
    var fan = O.recent.slice(0, 3);
    h += '<div class="hm-two">' +
      '<button type="button" class="card hm-t rv-h" data-go="profile" style="--d:60ms"><span class="hm-tt">' + ic('user') + 'Perfil</span><span class="hm-big">' + O.badgesOn + '<i>/' + O.badgesMax + '</i></span><small>insignias</small><small>' + trips.length + (trips.length === 1 ? ' viaje' : ' viajes') + ' · ' + O.totalDays + ' días</small></button>' +
      '<button type="button" class="card hm-t rv-h" data-go="album" style="--d:120ms"><span class="hm-tt">' + ic('star') + 'Álbum</span>' +
      (fan.length ? '<span class="hm-fan">' + fan.map(function (c, i) { return '<i class="' + (c.img ? '' : 'noph') + '" style="--r:' + (i - 1) * 9 + 'deg;--x:' + (i - 1) * 22 + 'px' + (c.img ? ';background-image:url(&quot;' + esc(c.img) + '&quot;)' : '') + '"></i>'; }).join('') + '</span>' : '<span class="hm-big">' + O.got + '<i>/' + O.all + '</i></span>') +
      '<small>' + O.got + ' de ' + O.all + ' cromos</small></button></div>';
    if (nextT) {
      h += mustRow(D);
      h += '<div class="hm-two">' +
        '<button type="button" class="card hm-t rv-h" data-open="' + esc(nextT.id) + '" data-grp="ida" style="--d:200ms"><span class="hm-tt">' + ic('check') + 'Listo para salir</span><span class="hm-big">' + D.chk.pc + '<i>%</i></span><span class="hm-prog"><i style="width:' + D.chk.pc + '%"></i></span><small>' + D.chk.done + ' de ' + D.chk.all + ' tareas</small></button>' +
        '<button type="button" class="card hm-t rv-h" data-open="' + esc(nextT.id) + '" data-grp="wx" style="--d:240ms"><span class="hm-tt">' + ic('cloud') + 'Tiempo</span><span class="hm-big" data-wxt>–</span><small data-wxn>' + esc(D.wxn) + '</small></button></div>';
    }
    if (O.nextBadge) h += '<button type="button" class="card hm-b rv-h" data-go="profile" style="--d:280ms">' + O.nextBadgeHTML + '<span><small>Siguiente insignia</small><b><span>' + esc(O.nextBadge.name) + '</span> · <span>' + esc({ copper: 'Cobre', silver: 'Plata', gold: 'Oro', emerald: 'Esmeralda', ruby: 'Rubí' }[O.nextBadge.next]) + '</span></b><span class="bdg-bar"><i style="width:' + Math.round(O.nextBadge.frac * 100) + '%"></i></span></span><em class="hm-bn">' + O.nextBadge.have + '/' + O.nextBadge.need + '</em></button>';
    if (D.ideas.length) h += '<div class="rv-h" style="--d:300ms"><div class="pf-h">' + tx('Ideas para ' + D.mon, 'Ideas for ' + D.mon) + '</div><div class="idea-row">' + D.ideas.map(function (x) { return ideaCard(x); }).join('') + '</div></div>';
    h += '<button type="button" class="btn navy sq big-btn rv-h" data-new style="--d:320ms">' + ic('plus') + 'Nuevo viaje</button>';
    return h;
  }

  var HOME_FN = { cuenta: homeCuenta, pase: homePase, revista: homeRevista, ruta: homeRuta, widgets: homeWidgets, clasico: homeClasico };
  function styleChips() {
    var cur = homeStyle();
    return HOME_STYLES.map(function (s) { return '<button type="button" class="opt' + (s[0] === cur ? ' on' : '') + '" data-hs="' + s[0] + '">' + esc(tx(s[1], s[2])) + '</button>'; }).join('');
  }
  function renderHome() {
    var box = $('#homeBox');
    return Album.overview().then(function (O) {
      IDEAS_NOW = [];
      var D = homeData(O), st = homeStyle();
      HOME = D;
      box.className = 'hs-' + st;
      box.innerHTML = HOME_FN[st](D) + '<div class="hx-style rv-h"><small>' + tx('Diseño de Home', 'Home layout') + '</small><div class="hx-chips">' + styleChips() + '</div></div>';
      if (D.next) wxFill(D.next);
      $$('[data-wiki]', box).forEach(function (el) { Juego.ideaImg(el.getAttribute('data-wiki')).then(function (u) { if (u) { el.style.backgroundImage = 'url("' + u + '")'; el.classList.add('on'); } }); });
      // widget de ideas: puntos que siguen al deslizar
      var sl = $('.hw-sl', box);
      if (sl) sl.addEventListener('scroll', function () { var i = Math.round(sl.scrollLeft / sl.clientWidth); $$('.hw-dots i', box).forEach(function (d, k) { d.classList.toggle('on', k === i); }); }, { passive: true });
    });
  }
  function setHomeStyle(s) {
    try { localStorage.setItem('guia-home', s); } catch (e) {}
    $$('[data-hs]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-hs') === s); });
    var v = $$('.vn').filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0];
    if (v && v.getAttribute('data-vt') === 'home') renderHome().then(function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
  document.addEventListener('click', function (e) {
    var hs = e.target.closest('[data-hs]'), tk = e.target.closest('[data-tick]'), rc = e.target.closest('[data-rec]');
    if (hs) setHomeStyle(hs.getAttribute('data-hs'));
    if (rc) openRec();
    if (tk && HOME && HOME.next) tickTask(tk);
    if (e.target.closest('[data-mustall]') && HOME && HOME.next) mustPage(HOME);
  });
  // previsión si faltan menos de 2 semanas; si no, temperaturas típicas de esas fechas
  function wxIcon(code) {
    return code == null ? 'cloudsun' : code <= 1 ? 'sun' : code === 2 ? 'cloudsun' : code === 3 ? 'cloud' : code <= 48 ? 'fog' : code >= 95 ? 'bolt' : (code >= 71 && code <= 77) || code === 85 || code === 86 ? 'snow' : 'rain';
  }
  function wxFill(t) {
    var w = t.ref.b.trip.wx[0]; if (!w) return;
    var d = daysTo(t.start), day = d > 0 ? t.start : new Date().toISOString().slice(0, 10);
    function put(hi, note, code, typ) {
      $$('[data-wxt]').forEach(function (el) { el.textContent = hi == null ? '–' : hi + '°'; });
      $$('[data-wxn]').forEach(function (el) { el.textContent = note; });
      // sin previsión, el dibujo sale de las temperaturas típicas
      var k = !typ ? wxIcon(code) : w.lo != null && w.lo <= 0 ? 'snow' : w.hi != null && w.hi >= 24 ? 'sun' : 'cloudsun';
      $$('[data-wxi]').forEach(function (el) { el.innerHTML = '<use href="#i-' + k + '"></use>'; el.setAttribute('class', 'ic hm-wxi k-' + k); });
    }
    function typical() { if (w.hi != null) put(w.hi, w.n + ' · ' + tx('típico ', 'typical ') + w.lo + '–' + w.hi + '°', null, 1); }
    if (d > 14 || d < -30 || w.lat == null) { typical(); return; }
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + w.lat + '&longitude=' + w.lon + '&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=' + day + '&end_date=' + day)
      .then(function (r) { return r.json(); }).then(function (j) { put(Math.round(j.daily.temperature_2m_max[0]), w.n + ' · ' + tx('mín. ', 'min ') + Math.round(j.daily.temperature_2m_min[0]) + '°', j.daily.weather_code[0]); }).catch(typical);
  }

  // el personaje de cada idea según su categoría
  var CAT_PJ = { escapada: 'maleta', africa: 'safari', isla: 'isla', comida: 'chef', nieve: 'nieve', playa: 'playa', naturaleza: 'monte', ciudad: 'ciudad' };
  function ideaPj(x) { var t = (x && x.tags) || []; return ['safari', 'isla', 'comida', 'nieve', 'playa', 'naturaleza', 'escapada', 'ciudad'].map(function (k) { return t.indexOf(k) >= 0 ? CAT_PJ[k] : ''; }).filter(Boolean)[0] || ''; }
  /* ---------- Recomiéndame un viaje: «¿Sin ideas?» con categorías en fotos y después una propuesta ---------- */
  var CAT_SUB = { escapada: ['Fines de semana con vuelos baratos', 'Weekends with cheap flights'], africa: ['Safaris, desiertos y el Nilo', 'Safaris, deserts and the Nile'], isla: ['Arena, palmeras y mar', 'Sand, palms and sea'], comida: ['Viajar para comer bien', 'Travel to eat well'], playa: ['Sol y agua templada', 'Sun and warm water'],
    nieve: ['Auroras, montañas y Navidad', 'Auroras, mountains and Christmas'], ciudad: ['Museos, plazas y barrios', 'Museums, squares and neighbourhoods'], naturaleza: ['Fiordos, lagos y senderos', 'Fjords, lakes and trails'] };
  // el próximo fin de semana (viernes a domingo) en un mes bueno para ir, y la opción entre semana de esa misma semana
  function weekendIn(months) {
    var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + 10);
    for (var k = 0; k < 400; k++) { if (d.getDay() === 5 && months.indexOf(d.getMonth() + 1) >= 0) break; d.setDate(d.getDate() + 1); }
    var fri = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    return { wk: [fri, addDays(fri, 2)], mid: [addDays(fri, -3), addDays(fri, -1)] };
  }
  var WIKI_CITY = { Oporto: 'Oporto', Praga: 'Praga', Lisboa: 'Lisboa', Edimburgo: 'Edimburgo', Marrakech: 'Marrakech', 'Plaza_de_España_(Sevilla)': 'Sevilla', Tortellini: 'Bolonia', Pizza_napolitana: 'Nápoles', La_Valeta: 'Malta', Riga: 'Riga', Tallin: 'Tallin', Bucarest: 'Bucarest' };
  function cityOf(x) { return WIKI_CITY[x.wiki] || String(x.t).split(/ en | y | al | junto| low|:|,/)[0]; }
  function flightsUrl(x, a, b) { var en = isEn(); return 'https://www.google.com/travel/flights?hl=' + (en ? 'en' : 'es') + '&q=' + encodeURIComponent((en ? 'flights to ' : 'vuelos a ') + cityOf(x) + ' ' + a + (en ? ' return ' : ' vuelta ') + b); }
  function openRec() {
    if (!window.Juego || $('#recBox')) return;
    var known = HOME ? HOME.known : {}, seen = {}, cur = null, cat = null;
    var box = document.createElement('div'); box.id = 'recBox'; box.className = 'rcm';
    box.innerHTML = '<div class="rec-top"><button type="button" class="rec-bk" data-recback hidden>' + ic('chev') + tx('Categorías', 'Categories') + '</button><small>' + tx('Recomiéndame un viaje', 'Recommend me a trip') + '</small><button type="button" class="wz-x" data-recx aria-label="' + tx('Cerrar', 'Close') + '">' + ic('x') + '</button></div><div class="rec-stage"></div>' +
      '<div class="rec-act" hidden><button type="button" class="btn ghost sq" data-recnext>' + tx('Otra idea', 'Another idea') + '</button><button type="button" class="btn navy sq" data-recgo>' + tx('Crear este viaje', 'Plan this trip') + ic('chev') + '</button></div>';
    document.body.appendChild(box);
    function photo(el, wiki, big) { Juego.ideaImg(wiki).then(function (u) { if (u && el) { el.style.backgroundImage = 'url("' + (big ? u.replace('/500px-', '/960px-') : u) + '")'; el.classList.add('on'); } }); }
    // 1 · las categorías
    function cats() {
      cat = null; seen = {}; if (window.Pj) Pj.stop();
      $('[data-recback]', box).hidden = true; $('.rec-act', box).hidden = true;
      var stg = $('.rec-stage', box);
      stg.innerHTML = '<div class="rec-cats"><h2>' + tx('¿Sin ideas?', 'Out of ideas?') + '</h2><p>' + tx('Elige qué te apetece y te proponemos un destino para la mejor época.', 'Pick what you fancy and we’ll suggest a destination for the best time of year.') + '</p><div class="rec-grid">' +
        Juego.CATS.map(function (c, i) { return '<button type="button" class="rec-cat sq" data-cat="' + c[0] + '" style="--d:' + i * 50 + 'ms"><span class="rec-cph" data-w="' + esc(c[3]) + '"></span><span class="hm-shade"></span><b>' + esc(tx(c[1], c[2])) + '</b><small>' + esc(tx(CAT_SUB[c[0]][0], CAT_SUB[c[0]][1])) + '</small></button>'; }).join('') +
        '<button type="button" class="rec-cat any sq" data-cat="" style="--d:300ms"><span>✦</span><b>' + tx('Sorpréndeme', 'Surprise me') + '</b><small>' + tx('Cualquier tipo de viaje', 'Any kind of trip') + '</small></button></div></div>';
      $$('.rec-cph', stg).forEach(function (el) { photo(el, el.getAttribute('data-w')); });
    }
    // 2 · una propuesta de esa categoría, con su personaje
    function show(dir) {
      cur = Juego.recommend(known, seen, cat); if (!cur) { seen = {}; cur = Juego.recommend(known, seen, cat); }
      if (!cur) return;
      seen[cur.wiki] = 1;
      $('[data-recback]', box).hidden = false; $('.rec-act', box).hidden = false;
      var stg = $('.rec-stage', box), old = $('.rec-card', stg), oc = $('.rec-cats', stg);
      if (oc) oc.remove();
      if (old) { old.classList.add('out'); setTimeout(function () { old.remove(); }, 380); }
      var why = [tx('Buen momento: ', 'Good time: ') + monName(cur.month)];
      if (!known[cur.cc]) why.push(tx('Un país nuevo para ti', 'A new country for you'));
      var c = document.createElement('div'); c.className = 'rec-card in';
      var esc0 = (cur.tags || []).indexOf('escapada') >= 0, W = esc0 ? weekendIn(cur.months) : null;
      if (W) { cur.start = W.wk[0]; cur.days = 3; }
      c.innerHTML = '<span class="rec-ph" data-wiki="' + esc(cur.wiki) + '"></span><span class="hm-shade"></span><div class="rec-t"><span class="rec-fl">' + (Mundo.flag(cur.cc) || '') + ' ' + esc(cur.country.name) + '</span><b>' + esc(cur.t) + '</b><p>' + esc(cur.sub) + '</p>' +
        (W ? '<div class="rec-esc"><button type="button" class="rec-dt on" data-dt="wk"><small>' + tx('Fin de semana', 'Weekend') + '</small><b>' + esc(sd(W.wk[0]) + ' – ' + sd(W.wk[1])) + '</b></button><button type="button" class="rec-dt" data-dt="mid"><small>' + tx('Suele ser más barato', 'Usually cheaper') + '</small><b>' + esc(sd(W.mid[0]) + ' – ' + sd(W.mid[1])) + '</b></button></div>' +
          '<a class="rec-fly" href="' + esc(flightsUrl(cur, W.wk[0], W.wk[1])) + '" target="_blank" rel="noopener">✈ ' + tx('Buscar vuelos para esas fechas', 'Search flights for these dates') + '</a>'
          : '<span class="rec-why">' + why.map(function (w) { return '<i>' + esc(w) + '</i>'; }).join('') + '</span>') +
        '<span class="rec-ms">' + tx('Mejor época', 'Best time') + ': ' + cur.months.map(function (m) { return monName(m).slice(0, 3); }).join(' · ') + '</span></div>';
      if (W) c.addEventListener('click', function (e) {
        var b = e.target.closest('[data-dt]'); if (!b) return;
        var r = W[b.getAttribute('data-dt')]; cur.start = r[0]; cur.days = b.getAttribute('data-dt') === 'wk' ? 3 : 3;
        $$('[data-dt]', c).forEach(function (x) { x.classList.toggle('on', x === b); });
        $('.rec-fly', c).href = flightsUrl(cur, r[0], r[1]);
      });
      stg.appendChild(c);
      photo($('.rec-ph', c), cur.wiki, true);
      var k = ideaPj(cur) || (cat && CAT_PJ[cat]), act = $('.rec-act', box);
      if (window.Pj && k) setTimeout(function () { if (box.isConnected) Pj.play(k, { ground: act.getBoundingClientRect().top - 10 }); }, 450);
    }
    function close() { if (window.Pj) Pj.stop(); box.classList.add('out'); setTimeout(function () { box.remove(); }, 280); }
    box.addEventListener('click', function (e) {
      var ct = e.target.closest('[data-cat]');
      if (e.target.closest('[data-recx]')) close();
      else if (e.target.closest('[data-recback]')) cats();
      else if (ct) { cat = ct.getAttribute('data-cat') || ''; show(1); }
      else if (e.target.closest('[data-recnext]')) { show(1); try { if (navigator.vibrate) navigator.vibrate(8); } catch (err) {} }
      else if (e.target.closest('[data-recgo]') && cur) { close(); newTrip(cur); }
    });
    if (window.Lang) Lang.watch(box);
    cats();
  }
  window.addEventListener('pageshow', function () { var x = $('#recBox'); if (x) x.remove(); });

  document.addEventListener('juego:change', function () { var v = $$('.vn').filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]; if (v && v.getAttribute('data-vt') === 'home') renderHome(); });

  /* ---------- Bienvenida de la primera vez (guia-bienvenida): qué es la app y ayuda a crear el primer viaje ---------- */
  function showWelcome() {
    var old = document.getElementById('welBox'); if (old) old.remove();
    var S = [['maleta', tx('Tu guía de viaje', 'Your travel guide'), tx('Cada viaje con su plan día a día, el mapa, los horarios, el tiempo y lo que no te puedes perder.', 'Each trip with its day-by-day plan, the map, times, weather and the must-sees.')],
      ['pie', tx('Crea un viaje en un minuto', 'Create a trip in a minute'), tx('Dinos adónde vas y cuándo: la app prepara el plan con datos reales. Luego cambias lo que quieras.', 'Tell us where and when: the app builds the plan from real data. Then change whatever you like.')],
      ['ciudad', tx('Colecciona los sitios que visitas', 'Collect the places you visit'), tx('Cada sitio es un cromo: cuando estés allí, haz tu foto y canjéalo. Con ellos haces tu postal y sellas tu pasaporte.', 'Each place is a card: when you are there, take your photo and redeem it. They make your postcard and stamp your passport.')],
      ['globo', tx('¿Creamos tu primer viaje?', 'Shall we plan your first trip?'), tx('Te acompañamos paso a paso: destino, fechas, cómo os movéis, ritmo y gustos.', 'We’ll guide you step by step: destination, dates, getting around, pace and interests.')]];
    var i = 0, box = document.createElement('div');
    box.id = 'welBox'; box.className = 'wel';
    function paint(dir) {
      var x = S[i], last = i === S.length - 1;
      box.innerHTML = '<div class="wel-in"><button type="button" class="wel-skip" data-w="end">' + tx('Saltar', 'Skip') + '</button>' +
        '<div class="wel-pg ' + (dir < 0 ? 'l' : 'r') + '"><div class="wel-fig"></div><h2>' + x[1] + '</h2><p class="wel-p">' + x[2] + '</p></div>' +
        '<div class="wel-dots">' + S.map(function (_, k) { return '<i' + (k === i ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
        (last ? '<button type="button" class="btn navy sq wel-go" data-w="new">' + ic('plus') + tx('Crear mi primer viaje', 'Plan my first trip') + '</button><button type="button" class="wel-no" data-w="end">' + tx('Ahora no, solo quiero mirar', 'Not now, just looking') + '</button>'
          : '<button type="button" class="btn navy sq wel-go" data-w="next">' + tx('Siguiente', 'Next') + '</button>') + '</div>';
      var f = $('.wel-fig', box);
      if (window.Pj) f.appendChild(Pj.figure(x[0])); else f.innerHTML = '<span class="wel-ic">' + ic('route') + '</span>';
    }
    function end(then) { try { localStorage.setItem('guia-bienvenida', '1'); } catch (e) {} box.classList.add('out'); setTimeout(function () { box.remove(); if (then) then(); }, 300); }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-w]'); if (!b) return; var w = b.getAttribute('data-w');
      if (w === 'next') { i++; paint(1); } else if (w === 'end') end(); else if (w === 'new') end(function () { newTrip(); });
    });
    var x0 = null;
    box.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    box.addEventListener('pointerup', function (e) { if (x0 == null) return; var dx = e.clientX - x0; x0 = null; if (dx < -50 && i < S.length - 1) { i++; paint(1); } else if (dx > 50 && i > 0) { i--; paint(-1); } });
    paint(1);
    document.body.appendChild(box);
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-welcome]')) showWelcome();
    var o = e.target.closest('[data-pjo]'); if (!o) return;
    try { if (o.getAttribute('data-pjo') === 'off') localStorage.setItem('guia-pj', 'off'); else localStorage.removeItem('guia-pj'); } catch (err) {}
    $$('[data-pjo]').forEach(function (b) { b.classList.toggle('on', b === o); });
    if (o.getAttribute('data-pjo') === 'on' && window.Pj) Pj.play(Pj.kinds[Math.floor(Math.random() * 16)], { ground: window.innerHeight - 120 });
  });
  try { if (!localStorage.getItem('guia-bienvenida')) setTimeout(showWelcome, 500); } catch (e) {}
  renderList();
  (function () { var ip = $('#tpPh'), I0 = window.Juego ? Juego.ideas({}, 3)[new Date().getDate() % 3] : null; if (ip && I0) Juego.ideaImg(I0.wiki).then(function (u) { if (u) { ip.style.backgroundImage = 'url("' + u + '")'; ip.classList.add('on'); } }); })();
  completeEnglish();
  var t0 = location.hash.slice(1);
  setTab(['trips', 'album', 'profile'].indexOf(t0) >= 0 ? t0 : 'home');
  if (t0 === 'nuevo') newTrip();
  // quien tenía guardada la dirección antigua de las páginas
})();
