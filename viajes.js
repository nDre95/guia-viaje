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
  function tripCard(t, user) {
    var title = (t.title && (t.title[Lang.get()] || t.title.es || t.title.en)) || t.id, days = t.days || 0;
    var dates = t.start ? dateLbl(t.start) + ' – ' + dateLbl(addDays(t.start, Math.max(0, days - 1))) : '';
    return '<div class="card trip"><div class="trip-ph"' + (t.cover ? ' style="background-image:url(&quot;' + esc(t.cover) + '&quot;)"' : '') + '></div>' +
      '<div class="trip-m">' + (user ? '<span class="tag-gen">' + (t.gen ? 'Creado con el asistente' : 'Importado') + '</span>' : '') +
      '<b>' + esc(title) + '</b><small>' + esc(dates) + (days ? ' · ' + days + ' días' : '') + '</small>' +
      '<div class="btn-row"><button type="button" class="btn navy sq" data-open="' + esc(t.id) + '">Abrir</button>' +
      '<button type="button" class="btn ghost sq" data-exp="' + esc(t.id) + '">Exportar</button>' +
      (user ? '<button type="button" class="btn ghost sq" data-del="' + esc(t.id) + '">Borrar</button>' : '') + '</div></div></div>';
  }
  function renderList() {
    return Album.trips().then(function (list) {
      var now = new Date().toISOString().slice(0, 10);
      var rows = list.map(function (t) {
        var bd = t.b, ph = bd.photos || {}, start = bd.trip.defaultStart, days = bd.trip.days.length, user = /^u-/.test(t.id), end = start ? addDays(start, Math.max(0, days - 1)) : '';
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
          render: function (r) { return tripCard(r, r.user); } });
      }
      paint();
      Mundo.detect(list).then(function (ch) { if (ch) paint(); }).catch(function () {});
    });
  }
  function openTrip(id) {
    try { localStorage.setItem('guia-trip', id); } catch (e) {}
    function go() { location.href = 'guia.html'; }
    if (!enWork[id]) go();
    else Promise.race([enWork[id], new Promise(function (r) { setTimeout(r, 12000); })]).then(go, go);
  }
  // viajes creados antes de guardar los dos idiomas: se completan en segundo plano, con conexión
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
    if (o) openTrip(o.getAttribute('data-open'));
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
    var g = e.target.closest('[data-go]'), n = e.target.closest('[data-new]');
    if (g) setTab(g.getAttribute('data-go'));
    if (n) newTrip();
  });
  function newTrip() {
    Asistente.open({ onSave: function (b) { return DB.put({ id: b.meta.id, at: Date.now(), bundle: b }).then(function () { Album.reset(); refreshAll(); }); }, onOpen: openTrip, aiBox: aiBoxHTML });
  }
  function refreshAll() { renderList(); var t = $$('.vn').filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]; if (t && t.getAttribute('data-vt') === 'home') renderHome(); }

  /* ---------- Álbum y perfil: album.js ---------- */
  // todos los viajes con sus datos: los de la web (trips/<id>.json) y los del móvil
  function allTrips() {
    var a = fetch('trips/index.json').then(function (r) { return r.json(); }).catch(function () { return []; }).then(function (idx) {
      return Promise.all(idx.map(function (t) { return fetch('trips/' + t.id + '.json').then(function (r) { return r.json(); }).then(function (b) { return { id: t.id, b: b }; }).catch(function () { return null; }); }));
    });
    var u = DB.all().catch(function () { return []; }).then(function (l) { return (l || []).map(function (x) { return { id: x.id, b: x.bundle }; }); });
    return Promise.all([a, u]).then(function (r) { return r[0].filter(Boolean).concat(r[1]); });
  }
  Album.init({ trips: allTrips, backupTrips: function () { return DB.all().then(function (l) { return (l || []).map(function (x) { return { id: x.id, at: x.at, bundle: x.bundle }; }); }).catch(function () { return []; }); },
    restoreTrips: function (list) { return Promise.all(list.map(function (x) { return x && x.id && x.bundle && /^u-/.test(x.id) ? DB.put({ id: x.id, at: x.at || Date.now(), bundle: x.bundle }) : null; })); }, onChange: function () { var t = $$('.vn').filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]; if (t && t.getAttribute('data-vt') === 'home') renderHome(); } });
  function renderProfile() {
    return Album.renderProfile().then(function () {
      var th = 'auto'; try { th = localStorage.getItem('guia-theme') || 'auto'; } catch (e) {}
      $$('#themeOpts .opt').forEach(function (o) { o.classList.toggle('on', o.getAttribute('data-th') === th); });
    });
  }
  $('#themeOpts').addEventListener('click', function (e) {
    var o = e.target.closest('[data-th]'); if (!o) return; var t = o.getAttribute('data-th');
    try { localStorage.setItem('guia-theme', t); } catch (err) {}
    var d = t === 'dark' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
    $$('#themeOpts .opt').forEach(function (x) { x.classList.toggle('on', x === o); });
  });

  /* ---------- Home: lo más relevante de un vistazo ---------- */
  function daysTo(iso) { var n = new Date(), t = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()), d = new Date(iso + 'T00:00:00Z').getTime(); return Math.round((d - t) / 864e5); }
  function checklistStat(t) {
    var ns = (t.b.meta.storage || t.b.meta.id || t.id) + ':', ck = {}, all = 0, done = 0;
    try { ck = JSON.parse(localStorage.getItem(ns + 'checked') || '{}') || {}; } catch (e) {}
    (t.b.trip.checklist || []).forEach(function (c) { (c.items || []).forEach(function (i) { all++; if (ck[i.id]) done++; }); });
    return { all: all, done: done };
  }
  function renderHome() {
    var box = $('#homeBox');
    return Album.overview().then(function (O) {
      var trips = O.trips, nextT = trips.filter(function (t) { return t.status !== 'past'; }).sort(function (a, b) { return String(a.start).localeCompare(String(b.start)); })[0];
      var h = '';
      if (nextT) {
        var dd = daysTo(nextT.start), when = nextT.status === 'now' ? 'En curso · día ' + (1 - dd) + ' de ' + nextT.days : dd === 0 ? '¡Es hoy!' : dd === 1 ? 'Mañana' : 'Faltan ' + dd + ' días';
        h += '<button type="button" class="hm-next rv-h" data-open="' + esc(nextT.id) + '"' + (nextT.cover ? ' style="background-image:url(&quot;' + esc(nextT.cover) + '&quot;)"' : '') + '><span class="hm-shade"></span>' +
          '<span class="hm-ey">Tu próximo viaje</span><span class="hm-cd">' + esc(when) + '</span><b>' + esc(nextT.title) + '</b><small>' + esc(dateLbl(nextT.start)) + ' – ' + esc(dateLbl(addDays(nextT.start, Math.max(0, nextT.days - 1)))) + '</small><span class="hm-go">Abrir la guía' + ic('chev') + '</span></button>';
      } else {
        h += '<button type="button" class="hm-next empty rv-h" data-new><span class="hm-ey">Sin viajes a la vista</span><b>¿A dónde vamos?</b><small>Crea una guía nueva en un par de minutos, con datos reales.</small><span class="hm-go">Crear un viaje' + ic('chev') + '</span></button>';
      }
      if (window.Juego) {
        var G = Juego.get(), nP = Juego.total(G), kP = G.packs.r ? 'r' : G.packs.g ? 'g' : G.packs.s ? 's' : 'c';
        if (nP) h += '<button type="button" class="card hm-row sq rv-h" data-go="album" style="--d:30ms"><span class="hm-pk k-' + kP + '"><span class="pk-foil"></span></span><span><b>' + (nP === 1 ? 'Tienes 1 sobre' : 'Tienes ' + nP + ' sobres') + '</b><small>Ábrelo en tu álbum</small></span>' + ic('chev') + '</button>';
        // durante un viaje: los retos de hoy
        if (nextT && nextT.status === 'now') h += '<div class="card hm-ret rv-h"><b>Retos de hoy</b><ul>' + Juego.challenges().map(function (c) { return '<li class="' + (c.done ? 'ok' : '') + '">' + esc(c.t) + '</li>'; }).join('') + '</ul></div>';
        // recuerdos: un viaje de estas fechas en otros años
        var nowD = new Date(), mem = trips.filter(function (t) {
          if (t.status !== 'past' || !t.start) return false;
          var d0 = new Date(t.start + 'T12:00:00Z'), same = new Date(Date.UTC(nowD.getFullYear(), d0.getUTCMonth(), d0.getUTCDate(), 12));
          return Math.abs(same - nowD) < 8 * 864e5 && d0.getUTCFullYear() < nowD.getFullYear();
        })[0];
        if (mem) {
          var yrs = nowD.getFullYear() - +mem.start.slice(0, 4);
          h += '<button type="button" class="card hm-row sq rv-h" data-open="' + esc(mem.id) + '"><span class="hm-ph"' + (mem.cover ? ' style="background-image:url(&quot;' + esc(mem.cover) + '&quot;)"' : '') + '></span><span><b>' + (yrs === 1 ? 'Hace 1 año' : 'Hace ' + yrs + ' años') + '</b><small>' + esc(mem.title) + '</small></span>' + ic('chev') + '</button>';
        }
      }
      // perfil y álbum, uno al lado del otro
      var fan = O.recent.slice(0, 3);
      h += '<div class="hm-two">' +
        '<button type="button" class="card hm-t rv-h" data-go="profile" style="--d:60ms"><span class="hm-tt">' + ic('user') + 'Perfil</span><span class="hm-big">' + O.badgesOn + '<i>/' + O.badges.length + '</i></span><small>insignias</small><small>' + trips.length + (trips.length === 1 ? ' viaje' : ' viajes') + ' · ' + O.totalDays + ' días</small></button>' +
        '<button type="button" class="card hm-t rv-h" data-go="album" style="--d:120ms"><span class="hm-tt">' + ic('star') + 'Álbum</span>' +
        (fan.length ? '<span class="hm-fan">' + fan.map(function (c, i) { return '<i class="' + (c.img ? '' : 'noph') + '" style="--r:' + (i - 1) * 9 + 'deg;--x:' + (i - 1) * 22 + 'px' + (c.img ? ';background-image:url(&quot;' + esc(c.img) + '&quot;)' : '') + '"></i>'; }).join('') + '</span>' : '<span class="hm-big">' + O.got + '<i>/' + O.all + '</i></span>') +
        '<small>' + O.got + ' de ' + O.all + ' cromos</small></button></div>';
      // del próximo viaje: imprescindibles y preparativos
      if (nextT) {
        var T = nextT.ref, must = Album.cromosOf(T, Album.get()).filter(function (c) { return c.must; }).slice(0, 10), st = checklistStat(T), pc = st.all ? Math.round(st.done / st.all * 100) : 0;
        if (must.length) h += '<div class="hm-sec rv-h" style="--d:160ms"><div class="hm-h"><b>Imprescindibles</b><small>' + must.filter(function (c) { return c.got; }).length + ' de ' + must.length + '</small></div><div class="hm-scroll">' + must.map(function (c) {
          return '<button type="button" class="hm-must' + (c.got ? ' got' : '') + '" data-cr="' + esc(T.id + '|' + c.id) + '"' + (c.img ? ' style="background-image:url(&quot;' + esc(c.img) + '&quot;)"' : '') + '><span>' + esc(c.ti) + '</span></button>';
        }).join('') + '</div></div>';
        h += '<div class="hm-two">' +
          '<button type="button" class="card hm-t rv-h" data-open="' + esc(nextT.id) + '" style="--d:200ms"><span class="hm-tt">' + ic('check') + 'Listo para salir</span><span class="hm-big">' + pc + '<i>%</i></span><span class="hm-prog"><i style="width:' + pc + '%"></i></span><small>' + st.done + ' de ' + st.all + ' tareas</small></button>' +
          '<div class="card hm-t rv-h" id="hmWx" style="--d:240ms"><span class="hm-tt">' + ic('cloud') + 'Tiempo</span><span class="hm-big">–</span><small>' + esc((T.b.trip.wx[0] || {}).n || '') + '</small></div></div>';
      }
      // siguiente insignia y crear
      if (O.nextBadge) h += '<div class="card hm-b rv-h" style="--d:280ms"><i>' + O.nextBadge[0] + '</i><span><small>Siguiente insignia</small><b>' + esc(O.nextBadge[1]) + '</b></span></div>';
      if (window.Juego && window.Mundo) {
        var known = {}; trips.forEach(function (t) { (Mundo.cached(t.ref) || []).forEach(function (c) { known[c] = 1; }); });
        var idea = Juego.suggest(known);
        if (idea) h += '<button type="button" class="card hm-row sq rv-h" data-new style="--d:300ms"><span class="hm-tt" style="margin:0;font-size:22px">' + (Mundo.flag(idea.cc) || '🌍') + '</span><span><b>¿Y ahora ' + esc(idea.name) + '?</b><small>País nuevo para tu pasaporte</small></span>' + ic('chev') + '</button>';
        // copia de seguridad: los datos solo están en este dispositivo
        var GB = Juego.get(), hasData = O.got > 0 || trips.some(function (t) { return /^u-/.test(t.id); });
        if (hasData && Date.now() - (GB.backup || 0) > 30 * 864e5) h += '<button type="button" class="card hm-row sq rv-h" data-go="profile" style="--d:310ms"><span class="hm-tt" style="margin:0">' + ic('check') + '</span><span><b>Haz una copia de seguridad</b><small>Tus viajes solo están en este dispositivo</small></span>' + ic('chev') + '</button>';
      }
      h += '<button type="button" class="btn navy sq big-btn rv-h" data-new style="--d:320ms">' + ic('plus') + 'Nuevo viaje</button>';
      box.innerHTML = h;
      if (nextT) homeWeather(nextT);
    });
  }
  // previsión si faltan menos de 2 semanas; si no, temperaturas típicas de esas fechas
  function homeWeather(t) {
    var el = $('#hmWx'), w = t.ref.b.trip.wx[0]; if (!el || !w) return;
    var d = daysTo(t.start), big = $('.hm-big', el);
    function typical() { if (w.hi != null) { big.innerHTML = w.hi + '<i>°</i>'; el.lastChild.textContent = w.n + ' · típico ' + w.lo + '–' + w.hi + '°'; } else el.style.opacity = .6; }
    if (d > 14 || d < -30 || w.lat == null) { typical(); return; }
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + w.lat + '&longitude=' + w.lon + '&daily=temperature_2m_max,temperature_2m_min&timezone=auto&start_date=' + (d > 0 ? t.start : new Date().toISOString().slice(0, 10)) + '&forecast_days=1'.replace('&forecast_days=1', '&end_date=' + (d > 0 ? t.start : new Date().toISOString().slice(0, 10))))
      .then(function (r) { return r.json(); }).then(function (j) { big.innerHTML = Math.round(j.daily.temperature_2m_max[0]) + '<i>°</i>'; el.lastChild.textContent = w.n + ' · mín. ' + Math.round(j.daily.temperature_2m_min[0]) + '°'; }).catch(typical);
  }

  document.addEventListener('juego:change', function () { var v = $$('.vn').filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]; if (v && v.getAttribute('data-vt') === 'home') renderHome(); });
  renderList();
  completeEnglish();
  var t0 = location.hash.slice(1);
  setTab(['trips', 'album', 'profile'].indexOf(t0) >= 0 ? t0 : 'home');
  if (t0 === 'nuevo') newTrip();
  // quien tenía guardada la dirección antigua de las páginas
})();
