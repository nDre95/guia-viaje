/* ===== Países: en qué país cae cada viaje, estadísticas y mapa mundial del perfil =====
   El país sale de las coordenadas de las paradas (Natural Earth, vía world-atlas), así vale para cualquier viaje, también
   para los ya creados o importados. El resultado se guarda en localStorage (guia-cc:<id>) para no volver a calcularlo.
   Mundo.mount(el, trips): trips = lista de Album.overview(). Mundo.detect(list), Mundo.cached(t), Mundo.name(cc). */
window.Mundo = (function () {
  'use strict';
  var TABLE = {
    EU: '008AL 020AD 040AT 056BE 070BA 100BG 112BY 191HR 196CY 203CZ 208DK 233EE 234FO 246FI 248AX 250FR 276DE 292GI 300GR 336VA 348HU 352IS 372IE 380IT 428LV 438LI 440LT 442LU 470MT 492MC 498MD 499ME 528NL 578NO 616PL 620PT 642RO 643RU 674SM 688RS 703SK 705SI 724ES 752SE 756CH 804UA 807MK 826GB 831GG 832JE 833IM',
    AS: '004AF 031AZ 048BH 050BD 051AM 064BT 096BN 104MM 116KH 144LK 156CN 158TW 268GE 275PS 344HK 356IN 360ID 364IR 368IQ 376IL 392JP 398KZ 400JO 408KP 410KR 414KW 417KG 418LA 422LB 446MO 458MY 462MV 496MN 512OM 524NP 586PK 608PH 626TL 634QA 682SA 702SG 704VN 760SY 762TJ 764TH 784AE 792TR 795TM 860UZ 887YE',
    AF: '012DZ 024AO 072BW 108BI 120CM 132CV 140CF 148TD 174KM 178CG 180CD 204BJ 226GQ 231ET 232ER 262DJ 266GA 270GM 288GH 324GN 384CI 404KE 426LS 430LR 434LY 450MG 454MW 466ML 478MR 480MU 504MA 508MZ 516NA 562NE 566NG 624GW 646RW 678ST 686SN 690SC 694SL 706SO 710ZA 716ZW 728SS 729SD 732EH 748SZ 768TG 788TN 800UG 818EG 834TZ 854BF 894ZM',
    NA: '028AG 044BS 052BB 060BM 084BZ 092VG 124CA 136KY 188CR 192CU 212DM 214DO 222SV 304GL 308GD 320GT 332HT 340HN 388JM 484MX 500MS 531CW 533AW 534SX 558NI 591PA 630PR 652BL 659KN 660AI 662LC 663MF 666PM 670VC 780TT 796TC 840US 850VI',
    SA: '032AR 068BO 076BR 152CL 170CO 218EC 238FK 328GY 600PY 604PE 740SR 858UY 862VE',
    OC: '016AS 036AU 090SB 184CK 242FJ 258PF 296KI 316GU 520NR 540NC 548VU 554NZ 570NU 574NF 580MP 583FM 584MH 585PW 598PG 612PN 776TO 798TV 876WF 882WS'
  };
  var NAMED = { Kosovo: 'XK', 'N. Cyprus': 'CY', Somaliland: 'SO' }, A2 = {}, CONT = { XK: 'EU' };
  Object.keys(TABLE).forEach(function (c) { TABLE[c].split(' ').forEach(function (x) { A2[x.slice(0, 3)] = x.slice(3); CONT[x.slice(3)] = c; }); });
  var REGION = { EU: ['Europa', -25, 45, 34, 71], AS: ['Asia', 25, 150, -11, 60], AF: ['África', -20, 55, -36, 38], NA: ['Norteamérica', -170, -50, 7, 75], SA: ['Sudamérica', -85, -32, -56, 13], OC: ['Oceanía', 110, 180, -48, 0] };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lg() { return window.Lang ? Lang.get() : 'es'; }

  /* ---------- Nombres ---------- */
  var ATNAME = {};
  function name(cc) {
    try { if (/^[A-Z]{2}$/.test(cc) && window.Intl && Intl.DisplayNames) return new Intl.DisplayNames([lg()], { type: 'region' }).of(cc); } catch (e) {}
    return ATNAME[cc] || cc;
  }
  function flag(cc) { return /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(127397 + cc.charCodeAt(0), 127397 + cc.charCodeAt(1)) : ''; }

  /* ---------- Países del atlas ---------- */
  var polysP = null;
  function polys() {
    if (polysP) return polysP;
    polysP = Mapa.atlas().then(function (T) {
      var sc = T.transform.scale, tr = T.transform.translate, arcs = T.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (p) { x += p[0]; y += p[1]; return [x * sc[0] + tr[0], y * sc[1] + tr[1]]; }); }), out = [];
      function ring(r) { var c = []; r.forEach(function (ix, k) { var a = ix >= 0 ? arcs[ix] : arcs[~ix].slice().reverse(); a.forEach(function (p, j) { if (j || !k) c.push(p); }); }); return c; }
      T.objects.countries.geometries.forEach(function (g) {
        var nm = (g.properties || {}).name || '', cc = A2[g.id] || NAMED[nm] || nm, rings = [];
        if (!ATNAME[cc]) ATNAME[cc] = nm;
        (g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []).forEach(function (p) { rings.push(ring(p[0])); });
        if (rings.length) out.push({ cc: cc, rings: rings, bb: rings.map(boundsOf) });
      });
      return out;
    }).catch(function (e) { polysP = null; throw e; });
    return polysP;
  }
  function boundsOf(r) { var b = [180, 90, -180, -90]; r.forEach(function (p) { b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]); b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]); }); return b; }
  function inside(r, x, y) {
    var c = false;
    for (var i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][1] > y) !== (r[j][1] > y) && x < (r[j][0] - r[i][0]) * (y - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) c = !c;
    return c;
  }
  // el país de un punto; en la costa, el contorno simplificado puede dejarlo fuera: entonces, el país más cercano
  function locate(P, lat, lon) {
    var best = null, ba = 1e9, near = null, nd = 0.25;
    P.forEach(function (C) {
      C.rings.forEach(function (r, k) {
        var b = C.bb[k], pad = 0.5;
        if (lon < b[0] - pad || lon > b[2] + pad || lat < b[1] - pad || lat > b[3] + pad) return;
        var area = (b[2] - b[0]) * (b[3] - b[1]);
        if (area < ba && inside(r, lon, lat)) { best = C.cc; ba = area; }
        if (!best) r.forEach(function (p) { var d = Math.pow(p[0] - lon, 2) + Math.pow(p[1] - lat, 2); if (d < nd) { nd = d; near = C.cc; } });
      });
    });
    return best || near;
  }
  function stopsOf(t) {
    var out = [], seen = {};
    t.b.trip.days.forEach(function (d) { d.items.forEach(function (it) {
      if (!Mapa.isSight(it)) return;
      var k = it.lat.toFixed(1) + ',' + it.lon.toFixed(1); if (seen[k]) return; seen[k] = 1; out.push(it);
    }); });
    return out;
  }
  function cached(t) { try { return JSON.parse(localStorage.getItem('guia-cc:' + t.id) || 'null'); } catch (e) { return null; } }
  // calcula los países de los viajes que aún no los tienen (necesita el atlas, una vez)
  function detect(list) {
    var todo = list.filter(function (t) { return !cached(t); });
    if (!todo.length) return Promise.resolve(false);
    return polys().then(function (P) {
      todo.forEach(function (t) {
        var cc = {}; stopsOf(t).forEach(function (s) { var c = locate(P, s.lat, s.lon); if (c) cc[c] = (cc[c] || 0) + 1; });
        var keys = Object.keys(cc).sort(function (a, b) { return cc[b] - cc[a]; });
        if (keys.length) try { localStorage.setItem('guia-cc:' + t.id, JSON.stringify(keys)); } catch (e) {}
      });
      return true;
    });
  }

  /* ---------- Proyección Natural Earth ---------- */
  var K = 182.8, OX = 500, OY = 262;
  function proj(lon, lat) {
    var l = lon * Math.PI / 180, f = lat * Math.PI / 180, f2 = f * f, f4 = f2 * f2;
    return [OX + K * l * (0.8707 - 0.131979 * f2 + f4 * (-0.013791 + f4 * (0.003971 * f2 - 0.001529 * f4))),
      OY - K * f * (1.007226 + f2 * (0.015085 + f4 * (-0.044475 + 0.028874 * f2 - 0.005916 * f4)))];
  }
  var worldP = null;
  function world() {
    if (worldP) return worldP;
    worldP = polys().then(function (P) {
      return P.filter(function (C) { return C.cc !== 'AQ'; }).map(function (C) {
        var d = '', bx0 = 1e4, bx1 = -1e4, by0 = 1e4, by1 = -1e4;
        C.rings.forEach(function (r) {
          // lo que cruza el meridiano 180 se desdobla hacia un lado; lo que sobresale queda fuera del encuadre
          var jump = r.some(function (p, i) { return i && Math.abs(p[0] - r[i - 1][0]) > 180; }), s = '', n = 0, lx = 1e5, ly = 1e5, x0 = 1e4, x1 = -1e4, y0 = 1e4, y1 = -1e4;
          r.forEach(function (p) {
            var q = proj(jump && p[0] < 0 ? p[0] + 360 : p[0], p[1]);
            x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
            if (Math.abs(q[0] - lx) + Math.abs(q[1] - ly) < 0.55) return;
            s += (n++ ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); lx = q[0]; ly = q[1];
          });
          bx0 = Math.min(bx0, x0); bx1 = Math.max(bx1, x1); by0 = Math.min(by0, y0); by1 = Math.max(by1, y1);
          if (n > 2) d += s + 'Z';
        });
        return { cc: C.cc, d: d, cx: (bx0 + bx1) / 2, cy: (by0 + by1) / 2, small: bx1 - bx0 < 7 && by1 - by0 < 7 };
      }).filter(function (c) { return c.d || c.small; });
    }).catch(function (e) { worldP = null; throw e; });
    return worldP;
  }

  /* ---------- Cifras ---------- */
  function statsOf(trips) {
    var done = trips.filter(function (t) { return t.status !== 'next'; }), V = {}, N = {}, conts = {}, cities = {}, km = 0, longest = null, dayN = 0;
    trips.forEach(function (t) {
      (cached(t.ref) || []).forEach(function (c) { (t.status === 'next' ? N : V)[c] = (t.status === 'next' ? N : V)[c] || []; (t.status === 'next' ? N : V)[c].push(t); });
    });
    done.forEach(function (t) {
      var m = t.ref.b.meta, prev = null; dayN += t.days;
      (cached(t.ref) || []).forEach(function (c) { if (CONT[c]) conts[CONT[c]] = 1; });
      ((m.generated || {}).cities || (m.mapCities || []).map(function (c) { return c.es; })).forEach(function (c) { cities[c] = 1; });
      t.ref.b.trip.days.forEach(function (d) { d.items.forEach(function (it) { if (it.lat == null || !Mapa.isStop(it)) return; if (prev) km += Mapa.kmBetween(prev, it); prev = it; }); });
      if (!longest || t.days > longest.days) longest = t;
    });
    var top = Object.keys(V).sort(function (a, b) { return V[b].length - V[a].length; })[0];
    return { V: V, N: N, done: done, conts: Object.keys(conts).length, cities: Object.keys(cities).length, km: Math.round(km), longest: longest, dayN: dayN, top: top && V[top].length > 1 ? top : null };
  }
  function fmtN(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lg() === 'en' ? ',' : '.'); }

  /* ---------- Mapa y lista ---------- */
  var ST = { filter: 'all', region: 'world', year: '', sel: '', more: false };
  function viewOf(r) {
    if (r === 'world') return [0, 0, 1000, 500];
    var g = REGION[r], x0 = 1e4, x1 = -1e4, y0 = 1e4, y1 = -1e4;
    [[g[1], g[3]], [g[1], g[4]], [g[2], g[3]], [g[2], g[4]], [(g[1] + g[2]) / 2, g[4]], [(g[1] + g[2]) / 2, g[3]]].forEach(function (p) { var q = proj(p[0], p[1]); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    var w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    if (w / h < 2) w = h * 2; else h = w / 2;
    return [cx - w / 2, cy - h / 2, w, h];
  }
  function mount(el, trips) {
    if (!el) return Promise.resolve();
    var years = {}, listTrips = trips;
    trips.forEach(function (t) { if (t.start) years[t.start.slice(0, 4)] = 1; });
    function draw() {
      var S = statsOf(trips), vc = Object.keys(S.V).length, nc = Object.keys(S.N).filter(function (c) { return !S.V[c]; }).length, unk = trips.some(function (t) { return !cached(t.ref); });
      var cards = [[vc, 'países visitados', nc ? '+' + nc + ' por visitar' : (vc ? Math.round(vc / 195 * 100) + ' % del mundo' : '')], [S.conts + '<i>/6</i>', 'continentes', ''], [S.cities, 'ciudades y lugares', ''], [fmtN(S.km), 'km recorridos', S.km ? 'en línea recta' : ''], [S.dayN, 'días ya viajados', S.longest ? 'El más largo: ' + S.longest.days + ' días' : ''], [S.top ? flag(S.top) || '★' : '–', S.top ? name(S.top) : 'Ningún país repetido', S.top ? S.V[S.top].length + ' veces' : '']];
      var yl = Object.keys(years).sort().reverse();
      el.innerHTML = '<div class="pstats">' + cards.map(function (c) { return '<div class="card stat2"><b>' + c[0] + '</b><small>' + esc(c[1]) + '</small>' + (c[2] ? '<small class="st-sub">' + esc(c[2]) + '</small>' : '') + '</div>'; }).join('') + '</div>' +
        '<div class="pf-h">Mi mapa del mundo</div><div class="card mw">' +
        '<div class="mw-chips" data-mw="filter">' + [['all', 'Todos'], ['one', 'Visitados'], ['rep', 'Repetidos'], ['next', 'Por visitar']].map(function (f) { return '<button type="button" class="opt' + (ST.filter === f[0] ? ' on' : '') + '" data-v="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div>' +
        '<div class="mw-chips" data-mw="region"><button type="button" class="opt' + (ST.region === 'world' ? ' on' : '') + '" data-v="world">Mundo</button>' + Object.keys(REGION).map(function (r) { return '<button type="button" class="opt' + (ST.region === r ? ' on' : '') + '" data-v="' + r + '">' + REGION[r][0] + '</button>'; }).join('') + '</div>' +
        (yl.length > 1 ? '<label class="mw-year"><span>Año</span><select id="mwYear"><option value="">Todos</option>' + yl.map(function (y) { return '<option' + (ST.year === y ? ' selected' : '') + '>' + y + '</option>'; }).join('') + '</select></label>' : '') +
        '<div class="mw-map" id="mwMap"><p class="note">Cargando el mapa…</p></div>' +
        '<div class="mw-legend"><span><i class="c1"></i>1 vez</span><span><i class="c2"></i>2 veces</span><span><i class="c3"></i>3 o más</span><span><i class="cn"></i>Por visitar</span></div>' +
        '<div class="mw-info" id="mwInfo"></div></div>' +
        '<div id="mwList"></div>';
      paintList(S);
      world().then(function (W) { paintMap(W); }).catch(function () {
        var m = el.querySelector('#mwMap'); if (m) m.innerHTML = '<p class="note">El mapa necesita conexión la primera vez.</p>';
      });
      if (unk) detect(trips.map(function (t) { return t.ref; })).then(function (ch) { if (ch) draw(); }).catch(function () {});
    }
    function counts() {
      var V = {}, N = {};
      trips.forEach(function (t) {
        if (ST.year && (t.start || '').slice(0, 4) !== ST.year) return;
        (cached(t.ref) || []).forEach(function (c) { var o = t.status === 'next' ? N : V; (o[c] = o[c] || []).push(t); });
      });
      return { V: V, N: N };
    }
    function klass(c, C) {
      var v = (C.V[c] || []).length, n = (C.N[c] || []).length, f = ST.filter;
      if (v >= 1 && f !== 'next' && (f !== 'rep' || v >= 2)) return v >= 3 ? 'c3' : v === 2 ? 'c2' : 'c1';
      if (n && !v && (f === 'all' || f === 'next')) return 'cn';
      if (n && v && f === 'next') return 'cn';
      return '';
    }
    function paintMap(W) {
      var m = el.querySelector('#mwMap'); if (!m) return;
      var C = counts(), vb = viewOf(ST.region), h = '<svg viewBox="' + vb.join(' ') + '" role="img" aria-label="Mapa del mundo">';
      W.forEach(function (c) { if (c.d) h += '<path data-c="' + esc(c.cc) + '" class="' + klass(c.cc, C) + (ST.sel === c.cc ? ' sel' : '') + '" d="' + c.d + '"/>'; });
      // los países diminutos no se verían: un punto
      W.forEach(function (c) { var k = klass(c.cc, C); if (c.small && k) h += '<circle data-c="' + esc(c.cc) + '" class="' + k + '" cx="' + c.cx.toFixed(1) + '" cy="' + c.cy.toFixed(1) + '" r="' + (vb[2] / 170).toFixed(1) + '"/>'; });
      m.innerHTML = h + '</svg>';
      paintInfo();
    }
    function paintInfo() {
      var b = el.querySelector('#mwInfo'); if (!b) return;
      var c = ST.sel; if (!c) { b.innerHTML = '<p class="mw-hint">Toca un país para ver tus viajes allí.</p>'; return; }
      var C = counts(), v = C.V[c] || [], n = C.N[c] || [], all = v.concat(n);
      b.innerHTML = '<div class="mw-sel"><b>' + (flag(c) ? flag(c) + ' ' : '') + esc(name(c)) + '</b><small>' + (v.length ? (v.length === 1 ? 'Visitado 1 vez' : 'Visitado ' + v.length + ' veces') : n.length ? 'Por visitar' : 'Aún sin viajes') + '</small></div>' +
        all.map(function (t) { return '<button type="button" class="mw-trip sq" data-open="' + esc(t.id) + '"><span>' + esc(t.title) + '</span><small>' + esc((t.start || '').slice(0, 4)) + '</small></button>'; }).join('');
    }
    function paintList(S) {
      var b = el.querySelector('#mwList'); if (!b) return;
      var rows = Object.keys(S.V).map(function (c) { return { c: c, n: S.V[c].length, next: 0 }; }).concat(Object.keys(S.N).filter(function (c) { return !S.V[c]; }).map(function (c) { return { c: c, n: 0, next: 1 }; }))
        .sort(function (x, y) { return y.n - x.n || name(x.c).localeCompare(name(y.c)); });
      if (!rows.length) { b.innerHTML = ''; return; }
      var max = Math.max.apply(null, rows.map(function (r) { return r.n; }).concat(1)), shown = ST.more ? rows : rows.slice(0, 5);
      b.innerHTML = '<div class="pf-h">Mis países · ' + rows.length + '</div><div class="card mw-rows">' + shown.map(function (r) {
        return '<button type="button" class="mw-row sq" data-c="' + esc(r.c) + '"><span class="mw-fl">' + (flag(r.c) || '🌍') + '</span><span class="mw-nm">' + esc(name(r.c)) + '<i style="width:' + (r.n ? Math.round(r.n / max * 100) : 8) + '%" class="' + (r.next ? 'cn' : r.n >= 3 ? 'c3' : r.n === 2 ? 'c2' : 'c1') + '"></i></span><small>' + (r.next ? 'Por visitar' : r.n === 1 ? '1 vez' : r.n + ' veces') + '</small></button>';
      }).join('') + (rows.length > 5 ? '<button type="button" class="lst-more sq" id="mwMore">' + (ST.more ? 'Mostrar menos' : 'Mostrar más (' + (rows.length - 5) + ')') + '</button>' : '') + '</div>';
    }
    function animateTo(vb) {
      var svg = el.querySelector('#mwMap svg'); if (!svg) return;
      var a = svg.getAttribute('viewBox').split(' ').map(Number), t0 = performance.now();
      if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) { svg.setAttribute('viewBox', vb.join(' ')); return; }
      (function step(now) {
        var f = Math.min(1, (now - t0) / 550), e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
        svg.setAttribute('viewBox', a.map(function (x, i) { return (x + (vb[i] - x) * e).toFixed(1); }).join(' '));
        if (f < 1) requestAnimationFrame(step);
      })(t0);
    }
    function recolor() {
      var C = counts();
      Array.prototype.forEach.call(el.querySelectorAll('#mwMap [data-c]'), function (p) { p.setAttribute('class', klass(p.getAttribute('data-c'), C) + (ST.sel === p.getAttribute('data-c') ? ' sel' : '')); });
      paintInfo();
    }
    el.onclick = function (e) {
      var t = e.target, ch = t.closest('.mw-chips .opt');
      if (ch) {
        var w = ch.parentNode.getAttribute('data-mw'), v = ch.getAttribute('data-v');
        Array.prototype.forEach.call(ch.parentNode.children, function (x) { x.classList.toggle('on', x === ch); });
        if (w === 'filter') { ST.filter = v; recolor(); } else { ST.region = v; animateTo(viewOf(v)); }
        return;
      }
      if (t.closest('#mwMore')) { ST.more = !ST.more; paintList(statsOf(trips)); return; }
      var c = t.closest('[data-c]');
      if (c) {
        ST.sel = ST.sel === c.getAttribute('data-c') ? '' : c.getAttribute('data-c'); recolor();
        var svg = el.querySelector('.mw'); if (t.closest('.mw-row') && svg) svg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    el.onchange = function (e) { if (e.target.id === 'mwYear') { ST.year = e.target.value; recolor(); } };
    draw();
    return Promise.resolve(listTrips);
  }
  return { mount: mount, detect: detect, cached: cached, name: name, flag: flag };
})();
