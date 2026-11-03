/* ===== Asistente para crear un viaje: una ventana por encima, con páginas temáticas una tras otra =====
   Toda la búsqueda y el reparto los hace motor.js; aquí solo se recoge lo que quiere el usuario. */
window.Asistente = (function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(n) { return '<svg class="ic"><use href="#i-' + n + '"></use></svg>'; }
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'], DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  function sLbl(iso) { var d = new Date(iso + 'T12:00:00Z'); return d.getUTCDate() + ' ' + MES[d.getUTCMonth()]; }
  function dLbl(iso) { var d = new Date(iso + 'T12:00:00Z'); return DIAS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MES[d.getUTCMonth()]; }
  function flag(cc) { return /^[A-Z]{2}$/.test(cc || '') ? String.fromCodePoint(127397 + cc.charCodeAt(0), 127397 + cc.charCodeAt(1)) : '🌍'; }
  var MAX_DAYS = 10, COLORS = ['#e2782f', '#3b3e46', '#2f8f5b', '#b4551a', '#6b7fb3', '#a8481a', '#8b9099'];

  var A, page = 0, cfg = {}, debounce = 0, busy = false, done = null, repaintDays = null, lastPj = '', JR = null;
  // personajes animados (personajes.js): aparecen al elegir y se meten en la opción elegida
  // no siempre: a veces sí y a veces no (Pj.maybe), y nunca dos seguidos
  function pj(kind, target, p) { if (!window.Pj || !kind) return; lastPj = kind; setTimeout(function () { Pj.maybe(kind, { target: target }, p == null ? .8 : p); }, 300); }
  function ccs() { return A.countries.map(function (k) { return k.cc; }); }
  // nombres de países y ciudades: así Escocia, Azores o Laponia tienen sus propios personajes aunque el país sea otro
  function hint() { return A.countries.map(function (k) { return k.name; }).concat(A.cities.map(function (c) { return c.name || ''; })).join(' '); }
  function fresh() {
    var t = new Date(); t.setDate(t.getDate() + 30);
    return { countries: [], cities: [], start: t.toISOString().slice(0, 10), mode: 'transit', pace: 'normal', style: 'spread', ints: {}, open: {}, fin: { t: '', p: '' }, fout: { t: '', p: '' }, fixed: [], title: '' };
  }
  function totalDays() { return A.cities.reduce(function (s, c) { return s + c.days; }, 0); }

  /* ---------- Las páginas ---------- */
  var PAGES = [
    { id: 'pais', eyebrow: 'Destino', title: '¿A qué país vais?', sub: 'Elige uno. Si el viaje cruza fronteras, añade todos los que quieras.', draw: drawCountries, ok: function () { return A.countries.length > 0; }, need: 'Elige al menos un país' },
    { id: 'ciudades', eyebrow: 'Destino', title: '¿Qué ciudades o zonas?', sub: 'Toca las que quieras, en el orden en que las vais a visitar.', draw: drawCities, ok: function () { return A.cities.length > 0; }, need: 'Elige al menos una ciudad' },
    { id: 'dias', eyebrow: 'Fechas', title: '¿Cuándo y cuántos días?', sub: 'Elige el primer día y reparte los días entre tus destinos.', draw: drawDays, ok: function () { return !!A.start && totalDays() > 0; }, need: 'Pon la fecha del primer día' },
    { id: 'mover', eyebrow: 'Cómo os movéis', title: '¿Cómo vais a moveros?', sub: 'Cambia los tiempos de cada trayecto y qué sitios quedan a mano.', draw: drawMode },
    { id: 'ritmo', eyebrow: 'Vuestro ritmo', title: '¿A qué ritmo?', sub: 'Lo más importante entra siempre. El ritmo decide cuánto más y con cuánta calma.', draw: drawPace },
    { id: 'horario', eyebrow: 'Vuestro ritmo', title: '¿Cómo repartís el día?', sub: 'Las visitas se colocan según lo que elijas, sin dejar medio día vacío por error.', draw: drawStyle },
    { id: 'gustos', eyebrow: 'Vuestros gustos', title: '¿Qué os apetece?', sub: 'Opcional. Empieza por lo general y afina si quieres. Lo imprescindible de cada sitio entra igualmente.', draw: drawInts },
    { id: 'aloja', eyebrow: 'Alojamiento', title: '¿Dónde os alojáis?', sub: 'Opcional. Si lo sabes, las rutas de cada día salen y vuelven de allí.', draw: drawStays },
    { id: 'billetes', eyebrow: 'Billetes', title: '¿Tenéis algo ya comprado?', sub: 'Opcional. Vuelos y entradas con hora: el plan se organiza a su alrededor.', draw: drawTickets },
    { id: 'fin', eyebrow: 'Todo listo', title: 'Tu viaje', sub: '', draw: drawSummary, last: true }
  ];

  function open(o) {
    cfg = o || cfg; A = fresh(); page = 0; done = null; busy = false; lastPj = '';
    if (window.Pj && Pj.fresh) Pj.fresh();
    // desde una idea de temporada: el país ya elegido y la fecha en su mes
    var pre = (o || {}).preset;
    if (pre && pre.country) {
      var k = { name: pre.country.name, cc: pre.country.cc, wd: pre.country.wd }; A.countries.push(k);
      Motor.placeInfo(k.name).then(function (i) { if (i) { k.text = i.text; redraw(); } }).catch(function () {});
      Motor.suggestCities(k.wd).catch(function () { return []; }).then(function (r) { k.sug = r; redraw(); });
      if (pre.start) A.start = pre.start;
      if (pre.days) A.presetDays = pre.days;
      // desde una idea: su personaje (islas, comida…) entra en la tarjeta del país
      if (pre.pj) setTimeout(function () { pj(pre.pj, function () { var l = $$('#wzPicked .wz-country'); return l[l.length - 1]; }, 1); }, 500);
    }
    var w = $('#wz'); w.hidden = false; document.documentElement.classList.add('wz-open');
    requestAnimationFrame(function () { w.classList.add('on'); });
    show(1);
  }
  // vuelve a pintar la página de países cuando llegan los datos del país elegido de antemano
  function redraw() { var cs = document.querySelectorAll('#wzBody .wz-page .wz-c'), c0 = cs[cs.length - 1]; if (c0 && PAGES[page].id === 'pais') PAGES[page].draw(c0); }
  // confirmar dentro de la app (los diálogos del navegador se bloquean en algunos visores y el botón parecía no hacer nada)
  function ask(msg, yes, onYes) {
    var old = $('#wzAsk'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'wzAsk'; d.className = 'wz-ask';
    d.innerHTML = '<div class="wz-ask-in"><p>' + esc(msg) + '</p><div class="btn-row"><button type="button" class="btn ghost sq" data-ask="no">Seguir aquí</button><button type="button" class="btn navy sq" data-ask="yes">' + esc(yes) + '</button></div></div>';
    d.addEventListener('click', function (e) { var b = e.target.closest('[data-ask]'); if (!b && e.target !== d) return; d.classList.add('out'); setTimeout(function () { d.remove(); }, 220); if (b && b.getAttribute('data-ask') === 'yes') onYes(); });
    if (window.Lang) Lang.watch(d);
    $('#wz').appendChild(d);
  }
  function close(force) {
    if (force !== true) {
      if (busy) { ask('Se está creando la guía. ¿Salir de todos modos?', 'Salir', function () { close(true); }); return; }
      if (!done && A && (A.countries.length || A.cities.length)) { ask('¿Salir sin crear el viaje? Lo elegido se pierde.', 'Salir', function () { close(true); }); return; }
    }
    var q = $('#wzAsk'); if (q) q.remove();
    if (window.Pj) Pj.stop();
    var w = $('#wz'); w.classList.remove('on'); document.documentElement.classList.remove('wz-open');
    setTimeout(function () { w.hidden = true; $('#wzBody').innerHTML = ''; }, 420);
  }
  function show(dir) {
    repaintDays = null;
    var P = PAGES[page], body = $('#wzBody');
    $('#wzBar i').style.width = ((page + 1) / PAGES.length * 100) + '%';
    $('#wzStep').textContent = P.eyebrow + ' · ' + (page + 1) + ' de ' + PAGES.length;
    var el = document.createElement('section'); el.className = 'wz-page ' + (dir > 0 ? 'from-r' : 'from-l');
    el.innerHTML = '<h2>' + esc(P.title) + '</h2>' + (P.sub ? '<p class="wz-sub">' + esc(P.sub) + '</p>' : '') + '<div class="wz-c"></div>';
    // salen todas las que se ven, no solo la primera: con dos toques seguidos, la que ya se iba no tapa a la actual
    // y la actual no se queda pegada debajo de la nueva
    Array.prototype.forEach.call(body.querySelectorAll('.wz-page'), function (old) {
      if (old.classList.contains('to-l') || old.classList.contains('to-r')) { old.remove(); return; }
      old.classList.add(dir > 0 ? 'to-l' : 'to-r'); setTimeout(function () { old.remove(); }, 430);
    });
    body.appendChild(el); body.scrollTop = 0;
    P.draw($('.wz-c', el));
    foot();
    // al entrar en algunas páginas, de vez en cuando, alguien pasa por allí
    var walk = { ciudades: (window.Pj && Pj.animal && Math.random() < .5 && Pj.animal(ccs(), A.start, hint())) || 'pie', aloja: 'siesta', billetes: 'avion', horario: 'madruga', gustos: 'ciudad' }[P.id];
    if (walk && window.Pj) setTimeout(function () { if (PAGES[page] === P) Pj.maybe(walk, {}, .45); }, 900);
  }
  function foot() {
    var P = PAGES[page], b = $('#wzBack'), n = $('#wzNext');
    b.style.visibility = page ? 'visible' : 'hidden';
    if (done) { n.textContent = 'Abrir la guía'; n.disabled = false; b.style.visibility = 'hidden'; }
    else if (P.last) { n.textContent = busy ? 'Creando…' : 'Crear la guía'; n.disabled = busy; }
    else { var ok = !P.ok || P.ok(); n.textContent = P.ok || ok ? 'Siguiente' : 'Siguiente'; n.disabled = !ok; }
    $('#wzNeed').textContent = !done && P.ok && !P.ok() ? P.need : '';
  }
  function next() {
    if (done) { cfg.onOpen(done.meta.id); return; }
    var P = PAGES[page];
    if (P.last) { create(); return; }
    if (P.ok && !P.ok()) return;
    // al pasar de las fechas, los días que se ven quedan fijos: una sugerencia que llegue tarde ya no los cambia
    if (P.id === 'dias') A.cities.forEach(function (x) { x.touched = true; });
    page++; show(1);
  }
  function back() { if (page > 0 && !busy) { page--; show(-1); } }

  /* ---------- 1. Países ---------- */
  var POPULAR = [['Italia', 'Italy', 'IT', 'Q38', 'Colosseum'], ['España', 'Spain', 'ES', 'Q29', 'Sagrada Família'], ['Francia', 'France', 'FR', 'Q142', 'Eiffel Tower'], ['Portugal', 'Portugal', 'PT', 'Q45', 'Belém Tower'],
    ['Reino Unido', 'United Kingdom', 'GB', 'Q145', 'Edinburgh Castle'], ['Grecia', 'Greece', 'GR', 'Q41', 'Parthenon'], ['Japón', 'Japan', 'JP', 'Q17', 'Fushimi Inari-taisha'], ['Marruecos', 'Morocco', 'MA', 'Q1028', 'Koutoubia Mosque'],
    ['Estados Unidos', 'United States', 'US', 'Q30', 'Statue of Liberty'], ['México', 'Mexico', 'MX', 'Q96', 'Chichen Itza'], ['Tailandia', 'Thailand', 'TH', 'Q869', 'Wat Arun'], ['Alemania', 'Germany', 'DE', 'Q183', 'Neuschwanstein Castle']];
  function popName(p) { return Lang.get() === 'en' ? p[1] : p[0]; }
  function popularHTML() {
    var free = POPULAR.filter(function (p) { return !A.countries.some(function (k) { return k.cc === p[2]; }); });
    return '<div class="wz-popt">' + esc(Lang.get() === 'en' ? 'Popular destinations' : 'Destinos populares') + '</div><div class="wz-grid">' + free.map(function (p) {
      return '<button type="button" class="wz-city" data-pop="' + p[2] + '"><span>' + flag(p[2]) + ' ' + esc(popName(p)) + '</span></button>';
    }).join('') + '</div>';
  }
  function popularPhotos(c) {
    $$('[data-pop]', c).forEach(function (b) {
      var p = POPULAR.filter(function (x) { return x[2] === b.getAttribute('data-pop'); })[0];
      Motor.photoOf(p[4]).then(function (u) { if (u) b.style.backgroundImage = 'url("' + u + '")'; }).catch(function () {});
    });
  }
  function drawCountries(c) {
    function chosen() {
      return A.countries.map(function (k, i) {
        return '<div class="wz-country" style="--d:' + i * 60 + 'ms"><div class="wz-cph">' + (k.sug || []).filter(function (x) { return x.img; }).slice(0, 3).map(function (x) { return '<i style="background-image:url(&quot;' + esc(x.img) + '&quot;)"></i>'; }).join('') + '</div>' +
          '<div class="wz-cm"><b>' + flag(k.cc) + ' ' + esc(k.name) + '</b><small>' + esc(k.text || '') + '</small></div><button type="button" class="wz-x" data-delc="' + i + '" aria-label="Quitar">' + ic('x') + '</button></div>';
      }).join('');
    }
    function paint() {
      var has = A.countries.length;
      c.innerHTML = '<div id="wzPicked">' + chosen() + '</div>' +
        (has && !A.adding ? '<button type="button" class="wz-add" id="wzAddC">' + ic('plus') + 'Añadir otro país</button>' :
          '<div class="wz-search"><input type="text" id="wzQ" placeholder="' + (has ? 'Otro país…' : 'Escribe un país (Italia, Japón…)') + '" autocomplete="off" enterkeyhint="search"><button type="button" class="btn navy sq" id="wzGo">Buscar</button></div><div class="wz-hits" id="wzHits"></div>' + popularHTML());
      popularPhotos(c);
      var add = $('#wzAddC', c); if (add) add.onclick = function () { A.adding = true; paint(); $('#wzQ', c).focus(); };
      var q = $('#wzQ', c); if (!q) return;
      function go() {
        var v = q.value.trim(); if (v.length < 2) return;
        $('#wzHits', c).innerHTML = '<p class="wz-note">Buscando…</p>';
        Motor.searchCountry(v).then(function (r) {
          A.hits = r;
          $('#wzHits', c).innerHTML = r.length ? r.map(function (h, i) { return '<button type="button" class="wz-hit" data-pick="' + i + '"><span class="wz-flag sm">' + flag(h.cc) + '</span><span><b>' + esc(h.name) + '</b></span></button>'; }).join('') : '<p class="wz-note">No encuentro ese país. Prueba a escribirlo de otra forma.</p>';
        }, function () { $('#wzHits', c).innerHTML = '<p class="wz-note">Sin conexión con el buscador. Inténtalo de nuevo.</p>'; });
      }
      q.oninput = function () { clearTimeout(debounce); debounce = setTimeout(go, 650); };
      q.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(debounce); go(); } };
      $('#wzGo', c).onclick = go;
    }
    c.onclick = function (e) {
      var p = e.target.closest('[data-pick]'), d = e.target.closest('[data-delc]'), pop = e.target.closest('[data-pop]');
      if (p || pop) {
        var P0 = pop && POPULAR.filter(function (x) { return x[2] === pop.getAttribute('data-pop'); })[0];
        var h = pop ? { name: popName(P0), cc: P0[2], wd: P0[3] } : A.hits[+p.getAttribute('data-pick')];
        if (!A.countries.some(function (k) { return k.cc === h.cc; })) {
          var k = { name: h.name, cc: h.cc, wd: h.wd, lat: h.lat, lon: h.lon, bb: h.bb };
          A.countries.push(k);
          pj(window.Pj && Pj.forPlace(ccs(), A.start, hint()), function () { var l = $$('#wzPicked .wz-country'); return l[l.length - 1]; }, .9);
          Motor.placeInfo(h.name).then(function (i) { if (i) { k.text = i.text; if (PAGES[page].id === 'pais') paint(); } });
          Motor.suggestCities(k.wd).catch(function () { return []; }).then(function (r) { k.sug = r; if (PAGES[page].id === 'pais') paint(); });
        }
        A.adding = false; paint(); foot();
      } else if (d) {
        var gone = A.countries.splice(+d.getAttribute('data-delc'), 1)[0];
        A.cities = A.cities.filter(function (x) { return x.cc !== gone.cc; });
        paint(); foot();
      }
    };
    paint();
  }

  /* ---------- 2. Ciudades ---------- */
  function drawCities(c) {
    A.adding = false;
    A.tab = A.tab && A.countries.some(function (k) { return k.cc === A.tab; }) ? A.tab : A.countries[0].cc;
    function country() { return A.countries.filter(function (k) { return k.cc === A.tab; })[0]; }
    function isOn(n) { return A.cities.some(function (x) { return x.name === n; }); }
    function grid() {
      var k = country();
      if (!k.sug) { var sk = ''; for (var n0 = 0; n0 < 9; n0++) sk += '<i class="wz-city wz-skel"></i>'; return '<div class="wz-grid">' + sk + '</div>'; }
      return k.sug.length ? '<div class="wz-grid">' + k.sug.map(function (s, i) {
        return '<button type="button" class="wz-city' + (isOn(s.name) ? ' on' : '') + '" data-sug="' + i + '"' + (s.img ? ' style="background-image:url(&quot;' + esc(s.img) + '&quot;)"' : '') + '><i>' + ic('check') + '</i><span>' + esc(s.name) + '</span></button>';
      }).join('') + '</div>' : '';
    }
    function paint() {
      if (A.cities.length && !A.adding) {
        c.innerHTML = '<div id="wzChosen"></div>' + A.countries.map(function (k) { return '<button type="button" class="wz-add" data-more="' + k.cc + '">' + ic('plus') + 'Añadir ' + (A.cities.some(function (x) { return x.cc === k.cc; }) ? 'otra ciudad' : 'una ciudad') + (A.countries.length > 1 ? ' en ' + flag(k.cc) + ' ' + esc(k.name) : '') + '</button>'; }).join('');
        chosen(); return;
      }
      c.innerHTML = (A.countries.length > 1 ? '<div class="wz-tabs">' + A.countries.map(function (k) { return '<button type="button" class="opt' + (k.cc === A.tab ? ' on' : '') + '" data-tab="' + k.cc + '">' + flag(k.cc) + ' ' + esc(k.name) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="wz-search"><input type="text" id="wzQ" placeholder="Otra ciudad o zona de ' + esc(country().name) + '" autocomplete="off" enterkeyhint="search"><button type="button" class="btn navy sq" id="wzGo">Buscar</button></div><div class="wz-hits" id="wzHits"></div>' +
        '<div id="wzGrid">' + grid() + '</div>' + (A.cities.length ? '<button type="button" class="wz-add" data-done>' + ic('check') + 'Listo, ver lo elegido</button>' : '');
      var k = country();
      if (!k.sug) Motor.suggestCities(k.wd).catch(function () { return []; }).then(function (r) { k.sug = r; if (PAGES[page].id === 'ciudades' && A.tab === k.cc) { var g = $('#wzGrid', c); if (g) g.innerHTML = grid() || '<p class="wz-note">' + esc(Lang.t('Escribe el nombre de la ciudad o zona.')) + '</p>'; } });
      var q = $('#wzQ', c);
      function go() {
        var v = q.value.trim(); if (v.length < 2) return;
        $('#wzHits', c).innerHTML = '<p class="wz-note">Buscando…</p>';
        Motor.searchCity(v, k.cc).then(function (r) {
          A.hits = r;
          $('#wzHits', c).innerHTML = r.length ? r.map(function (h, i) { return '<button type="button" class="wz-hit" data-pick="' + i + '"><span><b>' + esc(h.name) + '</b><small>' + esc(h.full) + '</small></span></button>'; }).join('') : '<p class="wz-note">No lo encuentro. Prueba con otro nombre.</p>';
        }, function () { $('#wzHits', c).innerHTML = '<p class="wz-note">Sin conexión con el buscador. Inténtalo de nuevo.</p>'; });
      }
      q.oninput = function () { clearTimeout(debounce); debounce = setTimeout(go, 650); };
      q.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(debounce); go(); } };
      $('#wzGo', c).onclick = go;
      chosen();
    }
    function chosen() {
      var box = $('#wzChosen', c); if (!box) return;
      box.innerHTML = A.cities.length ? '<div class="wz-map" id="wzMap"></div>' + A.cities.map(function (x, i) {
        return '<div class="wz-sel" data-i="' + i + '">' + (x.img ? '<div class="wz-selph" style="background-image:url(&quot;' + esc(x.img) + '&quot;)"></div>' : '') + '<span class="wz-n" style="background:' + COLORS[i % COLORS.length] + '">' + (i + 1) + '</span><div class="wz-sm"><b>' + flag(x.cc) + ' ' + esc(x.name) + '</b><small>Lo más visitado</small>' +
          '<div class="wz-top" id="wzTop' + i + '">' + topHTML(x) + '</div></div>' +
          '<div class="wz-mv">' + (i ? '<button type="button" class="wz-x" data-up="' + i + '" aria-label="Antes">' + ic('up') + '</button>' : '') + '<button type="button" class="wz-x" data-del="' + i + '" aria-label="Quitar">' + ic('x') + '</button></div></div>';
      }).join('') : '';
      if (A.cities.length) miniMap($('#wzMap', c), A.cities);
    }
    function topHTML(x) {
      if (!x.top) return '<small class="wz-load">Mirando lo más visitado…</small>';
      if (!x.top.length) return '<small>Aún no tengo datos de esta zona: se buscará al crear la guía.</small>';
      var max = x.top[0].fame;
      return x.top.slice(0, 4).map(function (s) { return '<div class="wz-fame"><span>' + esc(s.n) + '</span><i style="width:' + Math.round(s.fame / max * 100) + '%"></i></div>'; }).join('');
    }
    function add(x) {
      if (isOn(x.name)) return;
      x.days = A.presetDays || 2; if (A.presetDays) x.touched = true; A.cities.push(x);
      if (!x.img) Motor.placeInfo(x.name).then(function (i) { if (i && i.img) { x.img = i.img; if (PAGES[page].id === 'ciudades') chosen(); } });
      Motor.discover(x).then(function (l) {
        x.top = l;
        // días sugeridos: según cuánto importante tenga. Llega tarde: nunca pisa lo que ya haya elegido el usuario
        if (!x.touched) {
          var sug = Math.max(1, Math.min(4, Math.round(l.filter(function (s) { return s.fame > 0.72; }).length / 4) || 1));
          if (totalDays() - x.days + sug <= MAX_DAYS) { x.days = sug; if (repaintDays) repaintDays(); }
        }
        var b = $('#wzTop' + A.cities.indexOf(x), c); if (b) b.innerHTML = topHTML(x);
      }, function () { x.top = []; var b = $('#wzTop' + A.cities.indexOf(x), c); if (b) b.innerHTML = topHTML(x); });
    }
    c.onclick = function (e) {
      var t = e.target, s = t.closest('[data-sug]'), p = t.closest('[data-pick]'), d = t.closest('[data-del]'), u = t.closest('[data-up]'), tb = t.closest('[data-tab]'), mr = t.closest('[data-more]'), k = country();
      if (tb) { A.tab = tb.getAttribute('data-tab'); paint(); return; }
      if (mr) { A.tab = mr.getAttribute('data-more'); A.adding = true; paint(); return; }
      if (t.closest('[data-done]')) { A.adding = false; paint(); return; }
      if (s) {
        var g = k.sug[+s.getAttribute('data-sug')];
        if (isOn(g.name)) A.cities = A.cities.filter(function (x) { return x.name !== g.name; });
        else add({ name: g.name, lat: g.lat, lon: g.lon, cc: k.cc, country: k.name, img: g.img });
        A.adding = false; paint(); foot(); return;
      }
      if (p) {
        var h = A.hits[+p.getAttribute('data-pick')];
        add({ name: h.name, lat: h.lat, lon: h.lon, bb: h.bb, cc: k.cc, country: k.name });
        A.adding = false; paint(); foot(); return;
      }
      if (d) { A.cities.splice(+d.getAttribute('data-del'), 1); paint(); foot(); return; }
      if (u) { var i = +u.getAttribute('data-up'), m = A.cities.splice(i, 1)[0]; A.cities.splice(i - 1, 0, m); chosen(); }
    };
    paint();
  }
  // mapa sin librerías: baldosas de OpenStreetMap, línea y puntos numerados
  function miniMap(el, pts) {
    if (!el) return;
    var W = el.clientWidth || 340, H = el.clientHeight || 180;
    function X(lon, z) { return (lon + 180) / 360 * 256 * Math.pow(2, z); }
    function Y(lat, z) { var s = Math.sin(lat * Math.PI / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 256 * Math.pow(2, z); }
    var z = 12;
    for (; z > 2; z--) {
      var xs = pts.map(function (p) { return X(p.lon, z); }), ys = pts.map(function (p) { return Y(p.lat, z); });
      if (Math.max.apply(null, xs) - Math.min.apply(null, xs) < W - 70 && Math.max.apply(null, ys) - Math.min.apply(null, ys) < H - 70) break;
    }
    if (pts.length === 1) z = Math.min(z, 10);
    var ax = pts.map(function (p) { return X(p.lon, z); }), ay = pts.map(function (p) { return Y(p.lat, z); });
    var cx = (Math.max.apply(null, ax) + Math.min.apply(null, ax)) / 2, cy = (Math.max.apply(null, ay) + Math.min.apply(null, ay)) / 2, x0 = cx - W / 2, y0 = cy - H / 2, h = '';
    for (var tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + W) / 256); tx++) for (var ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + H) / 256); ty++) {
      if (ty < 0 || ty >= Math.pow(2, z)) continue;
      var nx = ((tx % Math.pow(2, z)) + Math.pow(2, z)) % Math.pow(2, z);
      h += '<img alt="" draggable="false" src="https://tile.openstreetmap.org/' + z + '/' + nx + '/' + ty + '.png" style="left:' + Math.round(tx * 256 - x0) + 'px;top:' + Math.round(ty * 256 - y0) + 'px">';
    }
    var line = ax.map(function (x, i) { return Math.round(x - x0) + ',' + Math.round(ay[i] - y0); }).join(' ');
    h += '<svg width="' + W + '" height="' + H + '"><polyline points="' + line + '" fill="none" stroke="#e2782f" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/></svg>';
    h += ax.map(function (x, i) { return '<b class="wz-pin" style="left:' + Math.round(x - x0) + 'px;top:' + Math.round(ay[i] - y0) + 'px;background:' + COLORS[i % COLORS.length] + '">' + (i + 1) + '</b>'; }).join('');
    el.innerHTML = h + '<small class="wz-osm">© OpenStreetMap</small>';
  }

  /* ---------- 3. Días ---------- */
  function drawDays(c) {
    var th0 = window.Pj && Pj.theme(ccs(), A.start); if (th0 && th0 !== lastPj) pj(th0, function () { return $('#wzStart') && $('#wzStart').closest('.wz-fld'); });
    function paint() {
      var tot = totalDays(), at = 0;
      var segs = A.cities.map(function (x, i) { return '<i style="flex:' + x.days + ';background:' + COLORS[i % COLORS.length] + '">' + x.days + '</i>'; }).join('');
      c.innerHTML = '<label class="wz-fld"><span>Primer día</span><input type="date" id="wzStart" value="' + esc(A.start) + '"></label>' +
        A.cities.map(function (x, i) {
          var from = A.start ? Motor.addDays(A.start, at) : '', to = A.start ? Motor.addDays(A.start, at + x.days - 1) : ''; at += x.days;
          return '<div class="wz-step"><span class="wz-n" style="background:' + COLORS[i % COLORS.length] + '">' + (i + 1) + '</span><div class="wz-sm"><b>' + esc(x.name) + '</b><small>' + (from ? esc(x.days > 1 ? dLbl(from) + ' – ' + dLbl(to) : dLbl(from)) : '') + '</small></div>' +
            '<div class="wz-stp"><button type="button" class="wz-x" data-m="' + i + '" aria-label="Menos días">−</button><b>' + x.days + '</b><button type="button" class="wz-x" data-p="' + i + '" aria-label="Más días">+</button></div></div>';
        }).join('') +
        '<div class="wz-time">' + segs + '</div><p class="wz-note center">' + tot + (tot === 1 ? ' día' : ' días') + ' en total' + (tot >= MAX_DAYS ? ' · de momento, ' + MAX_DAYS + ' como máximo' : '') + '</p>' +
        '<p class="wz-note">Los días de cada destino se han sugerido según lo que hay que ver allí.</p>';
      $('#wzStart', c).onchange = function () {
        A.start = this.value; paint(); foot();
        var th = window.Pj && Pj.theme(ccs(), A.start); if (th && th !== lastPj) pj(th, function () { return $('#wzStart') && $('#wzStart').closest('.wz-fld'); });
      };
    }
    c.onclick = function (e) {
      var m = e.target.closest('[data-m]'), p = e.target.closest('[data-p]');
      if (m) { var x = A.cities[+m.getAttribute('data-m')]; x.touched = true; if (x.days > 1) { x.days--; paint(); } }
      if (p && totalDays() < MAX_DAYS) { var y = A.cities[+p.getAttribute('data-p')]; y.touched = true; y.days++; paint(); }
    };
    repaintDays = paint;
    // al volver atrás y quitar ciudades, que no se pase del máximo
    while (totalDays() > MAX_DAYS) { var big = A.cities.slice().sort(function (a, b) { return b.days - a.days; })[0]; big.days--; }
    paint();
  }

  /* ---------- Tarjetas de elección ---------- */
  var CARD_PJ = { mode: { car: 'coche', walk: 'pie', transit: 'bus' }, pace: { slow: 'relax', normal: 'pie', fast: 'corre' }, style: { morning: 'madruga', afternoon: 'siesta', spread: 'ciudad' } };
  function cards(c, key, list, after) {
    function paint() {
      c.innerHTML = list.map(function (o) {
        return '<button type="button" class="wz-card' + (A[key] === o.v ? ' on' : '') + '" data-v="' + o.v + '"><span class="wz-ico">' + o.ico + '</span><span class="wz-cb"><b>' + esc(o.t) + '</b><small>' + esc(o.d) + '</small>' + (o.bar ? dayBar(o.bar) : '') + '</span><i class="wz-tick">' + ic('check') + '</i></button>';
      }).join('') + (after ? after() : '');
    }
    c.onclick = function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      var v = b.getAttribute('data-v'), was = A[key]; A[key] = v; paint();
      if (v !== was && CARD_PJ[key]) pj(CARD_PJ[key][v], function () { return c.querySelector('[data-v="' + v + '"]'); });
    };
    paint();
  }
  // tira del día de 8:00 a 22:00: v = visitas, c = comer, b = bares, l = libre
  function dayBar(segs) {
    var h = segs.map(function (s) { return '<i class="' + s[0] + '" style="flex:' + s[1] + '"></i>'; }).join('');
    return '<span class="wz-bar">' + h + '</span><span class="wz-hours"><em>8</em><em>12</em><em>16</em><em>20</em></span>';
  }
  function drawMode(c) {
    var far = 0; A.cities.forEach(function (x, i) { if (i) far = Math.max(far, Motor.km(A.cities[i - 1], x)); });
    cards(c, 'mode', [
      { v: 'transit', ico: '🚇', t: 'A pie y transporte público', d: 'Lo mejor en ciudad. Lo cercano andando; lo lejano, en metro o autobús.' },
      { v: 'walk', ico: '🚶', t: 'Solo a pie', d: 'Para centros históricos compactos. Lo muy lejano se hará igualmente en transporte.' },
      { v: 'car', ico: '🚗', t: 'En coche', d: 'Para rutas por carretera, con tiempos reales de conducción y más alcance alrededor de cada destino.' }
    ], function () { return far > 200 ? '<p class="wz-note">Entre vuestros destinos hay hasta ' + Math.round(far) + ' km en línea recta. Si no vais en coche, la guía incluye el trayecto con un tiempo aproximado; el billete lo reservas tú.</p>' : ''; });
  }
  function drawPace(c) {
    cards(c, 'pace', [
      { v: 'slow', ico: '🍷', t: 'Tranquilo', d: 'Pocas visitas y sin prisa: tiempo de sobra para bares, comer bien y sentarse a mirar. Unas 3 al día.' },
      { v: 'normal', ico: '🚶', t: 'Normal', d: 'Lo esencial y algo más, con tiempo para comer y descansar. Unas 5 al día.' },
      { v: 'fast', ico: '⚡', t: 'Intenso', d: 'Aprovechar al máximo: comidas rápidas y muchas paradas. Hasta 8 al día.' }
    ]);
  }
  function drawStyle(c) {
    var slow = A.pace === 'slow', mid = slow ? 'b' : 'l';
    cards(c, 'style', [
      { v: 'morning', ico: '🌅', t: 'Madrugar y tarde libre', d: 'Las visitas por la mañana. Después de comer, la tarde es vuestra.', bar: [['v', 6], ['c', 1], ['l', 5], ['c', 2]] },
      { v: 'afternoon', ico: '😴', t: 'Dormir más y visitar por la tarde', d: 'Salís sin prisa a media mañana y aprovecháis la tarde hasta la cena.', bar: [['l', 3], ['v', 2.5], ['c', 1.5], ['v', 5], ['c', 2]] },
      { v: 'spread', ico: '☀️', t: 'Repartido por todo el día', d: slow ? 'Visitas mañana y tarde con descansos largos, y tiempo para bares antes de cenar.' : 'Visitas mañana y tarde, con tiempo para comer, descansar y tomar algo.', bar: [['l', 1.5], ['v', 4], ['c', 1.5], ['l', 1], ['v', 3.5], [mid, 1], ['c', 1.5]] }
    ], function () { return '<div class="wz-legend"><span><i class="v"></i>Visitas</span><span><i class="c"></i>Comer</span><span><i class="b"></i>Bares</span><span><i class="l"></i>Libre</span></div>'; });
  }

  /* ---------- Gustos: de lo general a lo concreto ---------- */
  var GUSTOS = [
    { id: 'cultura', ico: '🏛️', t: 'Historia y cultura', subs: [['palaces', 'Castillos y palacios'], ['ruins', 'Ruinas y arqueología'], ['monuments', 'Monumentos y torres'], ['sacred', 'Templos, iglesias y mezquitas']] },
    { id: 'arte', ico: '🎨', t: 'Arte y espectáculos', subs: [['museums', 'Museos y galerías'], ['shows', 'Ópera y teatro'], ['sports', 'Estadios y deporte']] },
    { id: 'ciudad', ico: '🏙️', t: 'Vida de ciudad', subs: [['quarters', 'Barrios, plazas y calles'], ['markets', 'Mercados']] },
    { id: 'natura', ico: '🌿', t: 'Naturaleza', subs: [['parks', 'Parques y jardines'], ['nature', 'Paisajes, miradores y playas']] },
    { id: 'comer', ico: '🍽️', t: 'Comer y beber', subs: [['food', 'Tiempo para bares y buena mesa']] },
    { id: 'peques', ico: '🎡', t: 'En familia', subs: [['family', 'Zoos, acuarios y parques de atracciones']] }
  ];
  function drawInts(c) {
    function paint() {
      c.innerHTML = '<div class="wz-gustos">' + GUSTOS.map(function (g) {
        var on = g.subs.filter(function (s) { return A.ints[s[0]]; }).length, open = A.open[g.id];
        return '<div class="wz-g' + (on ? ' on' : '') + (open ? ' open' : '') + '"><button type="button" class="wz-gh" data-g="' + g.id + '"><span class="wz-ico">' + g.ico + '</span><b>' + esc(g.t) + '</b>' + (on ? '<em>' + on + '</em>' : '') + '</button>' +
          (open ? '<div class="wz-subs">' + g.subs.map(function (s) { return '<button type="button" class="opt' + (A.ints[s[0]] ? ' on' : '') + '" data-s="' + s[0] + '">' + esc(s[1]) + '</button>'; }).join('') + '</div>' : '') + '</div>';
      }).join('') + '</div>';
    }
    c.onclick = function (e) {
      var g = e.target.closest('[data-g]'), s = e.target.closest('[data-s]');
      if (s) { var k = s.getAttribute('data-s'); if (A.ints[k]) delete A.ints[k]; else A.ints[k] = 1; paint(); return; }
      if (g) {
        var id = g.getAttribute('data-g'), G = GUSTOS.filter(function (x) { return x.id === id; })[0], on = G.subs.some(function (x) { return A.ints[x[0]]; });
        // primer toque: se marca todo el grupo y se abre el detalle; después abre o cierra
        if (!A.open[id] && !on) { G.subs.forEach(function (x) { A.ints[x[0]] = 1; }); A.open[id] = 1; pj({ cultura: 'ciudad', arte: 'arte', ciudad: 'compras', natura: (window.Pj && Pj.animal && Math.random() < .5 && Pj.animal(ccs(), A.start, hint())) || 'monte', comer: 'chef', peques: 'globo' }[id], function () { var x = c.querySelector('[data-g="' + id + '"]'); return x && x.closest('.wz-g'); }); }
        else A.open[id] = !A.open[id];
        paint();
      }
    };
    paint();
  }

  /* ---------- Alojamiento y billetes ---------- */
  function drawStays(c) {
    c.innerHTML = A.cities.map(function (x, i) {
      return '<label class="wz-fld"><span>' + flag(x.cc) + ' ' + esc(x.name) + ' · ' + x.days + (x.days === 1 ? ' día' : ' días') + '</span><input type="text" data-st="' + i + '" value="' + esc(x.stay || '') + '" placeholder="Nombre del hotel o dirección"></label>';
    }).join('') + '<p class="wz-note">Si aún no lo sabéis, dejadlo en blanco: se usa el centro y podréis ponerlo después en la guía.</p>';
    c.oninput = function (e) { var i = e.target.getAttribute('data-st'); if (i != null) A.cities[+i].stay = e.target.value.trim(); };
  }
  function dayOpts(v) { var n = totalDays(), o = ''; for (var k = 0; k < n; k++) o += '<option value="' + k + '"' + (+v === k ? ' selected' : '') + '>Día ' + (k + 1) + '</option>'; return o; }
  function drawTickets(c) {
    function paint() {
      c.innerHTML = '<div class="wz-fld"><span>Vuelo de llegada (primer día)</span><div class="wz-row"><input type="time" id="fI" value="' + esc(A.fin.t) + '"><input type="text" id="fIp" value="' + esc(A.fin.p) + '" placeholder="Aeropuerto (p. ej. MXP)"></div></div>' +
        '<div class="wz-fld"><span>Vuelo de vuelta (último día)</span><div class="wz-row"><input type="time" id="fO" value="' + esc(A.fout.t) + '"><input type="text" id="fOp" value="' + esc(A.fout.p) + '" placeholder="Aeropuerto"></div></div>' +
        '<div class="wz-fld"><span>Entradas con hora</span>' + A.fixed.map(function (f, i) {
          return '<div class="wz-row wz-fx"><input type="text" data-fn="' + i + '" value="' + esc(f.n) + '" placeholder="Sitio"><select data-fd="' + i + '">' + dayOpts(f.day) + '</select><input type="time" data-ft="' + i + '" value="' + esc(f.at) + '"><button type="button" class="wz-x" data-fdel="' + i + '" aria-label="Quitar">' + ic('x') + '</button></div>';
        }).join('') + '<button type="button" class="wz-add" id="fAdd">' + ic('plus') + 'Añadir entrada</button></div>';
      $('#fAdd', c).onclick = function () { A.fixed.push({ n: '', day: 0, at: '10:00' }); paint(); };
    }
    c.oninput = function (e) {
      var t = e.target, id = t.id;
      if (id === 'fI') A.fin.t = t.value; else if (id === 'fIp') A.fin.p = t.value; else if (id === 'fO') A.fout.t = t.value; else if (id === 'fOp') A.fout.p = t.value;
      if (t.hasAttribute('data-fn')) A.fixed[+t.getAttribute('data-fn')].n = t.value;
      if (t.hasAttribute('data-fd')) A.fixed[+t.getAttribute('data-fd')].day = +t.value;
      if (t.hasAttribute('data-ft')) A.fixed[+t.getAttribute('data-ft')].at = t.value;
    };
    c.onclick = function (e) { var d = e.target.closest('[data-fdel]'); if (d) { A.fixed.splice(+d.getAttribute('data-fdel'), 1); paint(); } };
    paint();
  }

  /* ---------- Resumen y creación ---------- */
  var L_MODE = { transit: 'A pie y transporte', walk: 'A pie', car: 'En coche' }, L_PACE = { slow: 'Tranquilo', normal: 'Normal', fast: 'Intenso' }, L_STYLE = { morning: 'Madrugar y tarde libre', afternoon: 'Dormir más, visitas por la tarde', spread: 'Repartido por todo el día' };
  function defTitle() { var n = totalDays(), c = A.cities; return Lang.translate((c.length === 1 ? c[0].name : c.length === 2 ? c[0].name + (Lang.get() === 'en' ? ' and ' : ' y ') + c[1].name : A.countries.length === 1 ? A.countries[0].name : c[0].name + (Lang.get() === 'en' ? ' and more' : ' y más')) + ' en ' + n + (n === 1 ? ' día' : ' días')); }
  function drawSummary(c) {
    var n = totalDays();
    // el viaje como tarjeta de embarque: códigos de origen y destino, fechas, días y cómo os movéis
    var code = function (x) { return String(x.name || '').normalize('NFD').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(); }, c0 = A.cities[0], c1 = A.cities[A.cities.length - 1];
    c.innerHTML = '<div class="hp-pass wz-bp"><div class="hp-top"' + (c0.img ? ' style="background-image:url(&quot;' + esc(c0.img) + '&quot;)"' : '') + '><span class="hm-shade"></span><small>Tarjeta de embarque</small><b id="wzBpT">' + esc(A.title || defTitle()) + '</b></div>' +
      '<div class="wz-bpr"><span><b>' + esc(code(c0)) + '</b><small>' + flag(c0.cc) + ' ' + esc(c0.name) + '</small></span><i class="wz-bpl"><em>✈</em></i><span><b>' + esc(code(c1)) + '</b><small>' + flag(c1.cc) + ' ' + esc(c1.name) + '</small></span></div>' +
      '<div class="hp-grid"><span><small>Salida</small><b>' + esc(sLbl(A.start)) + '</b></span><span><small>Regreso</small><b>' + esc(sLbl(Motor.addDays(A.start, n - 1))) + '</b></span><span><small>Días</small><b>' + n + '</b></span><span><small>Ritmo</small><b>' + L_PACE[A.pace] + '</b></span></div>' +
      '<div class="hp-cut"></div><div class="wz-bps"><span><small>Destinos</small><b>' + A.cities.map(function (x) { return esc(x.name) + ' (' + x.days + ')'; }).join(' → ') + '</b><small>' + L_MODE[A.mode] + ' · ' + L_STYLE[A.style] + '</small></span><span class="hp-code"></span></div></div>' +
      '<label class="wz-fld"><span>Nombre del viaje</span><input type="text" id="wzTitle" value="' + esc(A.title) + '" placeholder="' + esc(defTitle()) + '"></label>' +
      '<div id="wzJourney"></div><ul class="wz-log" id="wzLog"></ul><div id="wzAfter"></div>' +
      '<p class="wz-note">Datos reales y gratis: Wikidata, Wikipedia, OpenStreetMap, OSRM y Open-Meteo. Horarios y precios: compruébalos siempre en la web oficial.</p>';
    $('#wzTitle', c).oninput = function () { A.title = this.value.trim(); var t = $('#wzBpT'); if (t) t.textContent = A.title || defTitle(); };
  }
  function step(txt) {
    if (JR) JR.tick();
    var ul = $('#wzLog'), li = document.createElement('li'), jz = $('#wzJourney'); li.className = 'run'; li.textContent = txt; if (ul) { ul.appendChild(li); if (!jz || !jz.firstChild) li.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    return { ok: function (t2) { li.className = 'ok'; if (t2) li.textContent = t2; }, warn: function (t2) { li.className = 'warn'; if (t2) li.textContent = t2; } };
  }
  function create() {
    if (busy) return; busy = true; foot(); $('#wzLog').innerHTML = '';
    // la escena del viaje dura lo que tarde la guía (y se recoge si tarda demasiado)
    var jr = JR = window.Pj && Pj.journey ? Pj.journey($('#wzJourney'), Pj.theme(ccs(), A.start)) : null;
    if ($('#wzJourney')) $('#wzJourney').scrollIntoView({ behavior: 'smooth', block: 'start' });
    var fixed = A.fixed.filter(function (f) { return f.n && f.at; }).map(function (f) { return { n: f.n, day: f.day, at: f.at }; });
    var sp = { title: A.title, start: A.start, mode: A.mode, pace: A.pace, style: A.style, ints: A.ints, fin: A.fin, fout: A.fout, fixed: fixed,
      stops: A.cities.map(function (x) { return { name: x.name, lat: x.lat, lon: x.lon, bb: x.bb, cc: x.cc, country: x.country, days: x.days, stay: x.stay || '' }; }) };
    Motor.generate(sp, step).then(function (b) {
      return cfg.onSave(b).then(function () {
        done = b; busy = false; step('Guía guardada en este móvil').ok(); foot();
        if (jr) jr.done();
        $('#wzAfter').innerHTML = '<div id="wzMapa"></div>' + (cfg.aiBox ? cfg.aiBox(b) : '');
        if (window.Mapa) {
          Mapa.mount($('#wzMapa'), { pj: 1, start: A.start, id: b.meta.id, title: b.meta.title.es, heading: 'Tu viaje en un mapa', dayLabel: Lang.t('Día 1').replace(' 1', ''), lang: Lang.get(), mode: b.meta.mode, land: b.trip.mapLand || null, photos: b.photos, days: Mapa.fromTrip(Motor.localized(b)) });
          $('#wzMapa').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }).catch(function (err) {
      if (jr) jr.stop();
      busy = false; step('Algo falló: ' + (err && err.message || err) + '. Comprueba la conexión y vuelve a intentarlo.').warn(); foot();
    });
  }

  document.addEventListener('DOMContentLoaded', init); if (document.readyState !== 'loading') init();
  var inited = false;
  function init() {
    if (inited || !$('#wz')) return; inited = true;
    $('#wzClose').onclick = function () { close(); }; $('#wzBack').onclick = back; $('#wzNext').onclick = next;
    // atrás arriba: la página anterior o, en la primera, salir
    $('#wzPrev').onclick = function () { if (page > 0 && !busy && !done) back(); else close(); };
    window.addEventListener('resize', function () { if (A && PAGES[page] && PAGES[page].id === 'ciudades') miniMap($('#wzMap'), A.cities); });
  }
  return { open: open, close: close };
})();
