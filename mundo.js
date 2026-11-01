/* ===== Países: en qué país cae cada viaje, estadísticas y mapa mundial del perfil =====
   El país sale de las coordenadas de las paradas (Natural Earth, vía world-atlas), así vale para cualquier viaje, también
   para los ya creados o importados. El resultado se guarda en localStorage (guia-cc:<id>) para no volver a calcularlo.
   Mundo.mount(el, trips, { base }): trips = lista de Album.overview(); base = sus cifras de cromos. Mundo.detect(list), Mundo.cached(t), Mundo.name(cc). */
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
        var d = '', best = null, area = -1;
        C.rings.forEach(function (r) {
          // lo que cruza el meridiano 180 se desdobla hacia un lado; lo que sobresale queda fuera del encuadre
          var jump = r.some(function (p, i) { return i && Math.abs(p[0] - r[i - 1][0]) > 180; }), s = '', n = 0, lx = 1e5, ly = 1e5, x0 = 1e4, x1 = -1e4, y0 = 1e4, y1 = -1e4;
          r.forEach(function (p) {
            var q = proj(jump && p[0] < 0 ? p[0] + 360 : p[0], p[1]);
            x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
            if (Math.abs(q[0] - lx) + Math.abs(q[1] - ly) < 0.3) return;
            s += (n++ ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); lx = q[0]; ly = q[1];
          });
          var ar = (x1 - x0) * (y1 - y0); if (ar > area) { area = ar; best = [x0, x1, y0, y1]; }
          if (n > 2) d += s + 'Z';
        });
        return { cc: C.cc, d: d, x0: best[0], x1: best[1], y0: best[2], y1: best[3], cx: (best[0] + best[1]) / 2, cy: (best[2] + best[3]) / 2, small: best[1] - best[0] < 7 && best[3] - best[2] < 7 };
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
  // el mapa se ve con esta proporción; la vista es la zona del mapa que entra en él: [x, y, ancho, alto]
  var A = 1.5, WMIN = 70, ST = { filter: 'all', region: 'mine', year: '', sel: '', more: false, stats: false, names: true, view: null };
  function clampView(cx, cy, w) {
    w = Math.max(WMIN, Math.min(1000, w));
    var h = w / A;
    cx = w >= 1000 ? 500 : Math.max(w * 0.35, Math.min(1000 - w * 0.35, cx));
    cy = Math.max(0, Math.min(524, cy));
    return [cx - w / 2, cy - h / 2, w, h];
  }
  function viewOfBox(x0, x1, y0, y1, minW) {
    var w = Math.max(x1 - x0, (y1 - y0) * A, minW || 0);
    return clampView((x0 + x1) / 2, (y0 + y1) / 2, w);
  }
  function viewOf(r) {
    if (r === 'world') return clampView(500, 262, 1000);
    var g = REGION[r], x0 = 1e4, x1 = -1e4, y0 = 1e4, y1 = -1e4;
    [[g[1], g[3]], [g[1], g[4]], [g[2], g[3]], [g[2], g[4]], [(g[1] + g[2]) / 2, g[4]], [(g[1] + g[2]) / 2, g[3]]].forEach(function (p) { var q = proj(p[0], p[1]); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    return viewOfBox(x0, x1, y0, y1);
  }
  function mount(el, trips, opt) {
    if (!el) return;
    opt = opt || {};
    var years = {}, WORLD = null, labels = [], lastLabelW = 0, anim = 0;
    trips.forEach(function (t) { if (t.start) years[t.start.slice(0, 4)] = 1; });
    function cell(b, l, sub) { return '<div class="st-cell"><b>' + b + '</b><small>' + esc(l) + '</small>' + (sub ? '<small class="st-sub">' + esc(sub) + '</small>' : '') + '</div>'; }
    function statsHTML(S) {
      var vc = Object.keys(S.V).length, nc = Object.keys(S.N).filter(function (c) { return !S.V[c]; }).length, O = opt.base || {};
      var first = [cell(trips.length, trips.length === 1 ? 'viaje' : 'viajes'), cell(vc, 'países visitados', nc ? '+' + nc + ' por visitar' : ''), cell(trips.reduce(function (a, t) { return a + t.days; }, 0), 'días de viaje')];
      var rest = [cell(S.conts + '<i>/6</i>', 'continentes'), cell(S.cities, 'ciudades y lugares'), cell(fmtN(S.km), 'km recorridos', S.km ? 'en línea recta' : ''),
        cell(S.dayN, 'días ya viajados'), cell(S.longest ? S.longest.days + '<i> ' + (S.longest.days === 1 ? 'día' : 'días') + '</i>' : '–', 'viaje más largo'), cell(S.top ? flag(S.top) || '★' : '–', S.top ? name(S.top) : 'Ningún país repetido', S.top ? S.V[S.top].length + ' veces' : ''),
        cell(vc ? Math.round(vc / 195 * 100) + '<i>%</i>' : '0<i>%</i>', 'del mundo'), cell(O.got != null ? O.got + '<i>/' + O.all + '</i>' : '–', 'cromos'), cell(O.mustGot != null ? O.mustGot + '<i>/' + O.must + '</i>' : '–', 'imprescindibles')];
      return '<div class="card st-card"><div class="st-top"><span class="st-h">Estadísticas</span><button type="button" class="st-tog sq" id="stTog" aria-expanded="' + ST.stats + '">' + (ST.stats ? 'Ver menos' : 'Ver más') + '</button></div>' +
        '<div class="st-grid">' + first.join('') + '</div><div class="st-grid st-more"' + (ST.stats ? '' : ' hidden') + '>' + rest.join('') + '</div></div>';
    }
    function draw() {
      var S = statsOf(trips), unk = trips.some(function (t) { return !cached(t.ref); }), yl = Object.keys(years).sort().reverse();
      var ic = function (d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };
      el.innerHTML = statsHTML(S) +
        '<div class="pf-h">Mi mapa del mundo</div><div class="card mw">' +
        '<div class="mw-chips" data-mw="filter">' + [['all', 'Todos'], ['one', 'Visitados'], ['rep', 'Repetidos'], ['next', 'Por visitar']].map(function (f) { return '<button type="button" class="opt' + (ST.filter === f[0] ? ' on' : '') + '" data-v="' + f[0] + '">' + f[1] + '</button>'; }).join('') +
        (yl.length > 1 ? '<select id="mwYear" class="mw-ysel" aria-label="Año"><option value="">Todos los años</option>' + yl.map(function (y) { return '<option' + (ST.year === y ? ' selected' : '') + '>' + y + '</option>'; }).join('') + '</select>' : '') + '</div>' +
        '<div class="mw-chips" data-mw="region"><button type="button" class="opt' + (ST.region === 'mine' ? ' on' : '') + '" data-v="mine">Mis países</button><button type="button" class="opt' + (ST.region === 'world' ? ' on' : '') + '" data-v="world">Mundo</button>' + Object.keys(REGION).map(function (r) { return '<button type="button" class="opt' + (ST.region === r ? ' on' : '') + '" data-v="' + r + '">' + REGION[r][0] + '</button>'; }).join('') + '</div>' +
        '<div class="mw-wrap"><div class="mw-map" id="mwMap"><p class="note">Cargando el mapa…</p></div>' +
        '<div class="mw-tools"><button type="button" class="sq" data-mt="in" aria-label="Acercar" title="Acercar">' + ic('M12 5v14M5 12h14') + '</button><button type="button" class="sq" data-mt="out" aria-label="Alejar" title="Alejar">' + ic('M5 12h14') + '</button>' +
        '<button type="button" class="sq' + (ST.names ? ' on' : '') + '" data-mt="names" aria-label="Nombres de países" title="Nombres de países" aria-pressed="' + ST.names + '"><b>Aa</b></button></div></div>' +
        '<div class="mw-legend"><span><i class="c1"></i>1 vez</span><span><i class="c2"></i>2 veces</span><span><i class="c3"></i>3 o más</span><span><i class="cn"></i>Por visitar</span></div>' +
        '<div class="mw-info" id="mwInfo"></div></div>' +
        '<div id="mwList"></div>';
      paintList(S);
      world().then(function (W) { WORLD = W; paintMap(); }).catch(function () {
        var m = el.querySelector('#mwMap'); if (m) m.innerHTML = '<p class="note">El mapa necesita conexión la primera vez.</p>';
      });
      if (unk) detect(trips.map(function (t) { return t.ref; })).then(function (ch) { if (ch) { ST.view = null; draw(); } }).catch(function () {});
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
    // encuadre de «Mis países»: lo que está coloreado, sin que un solo país llene el mapa
    function viewMine() {
      var C = counts(), x0 = 1e4, x1 = -1e4, y0 = 1e4, y1 = -1e4, any = false;
      (WORLD || []).forEach(function (c) { if (!klass(c.cc, C)) return; any = true; x0 = Math.min(x0, c.x0); x1 = Math.max(x1, c.x1); y0 = Math.min(y0, c.y0); y1 = Math.max(y1, c.y1); });
      if (!any) return viewOf('world');
      var px = Math.max(x1 - x0, 20) * 0.22, py = Math.max(y1 - y0, 20) * 0.22;
      return viewOfBox(x0 - px, x1 + px, y0 - py, y1 + py, 190);
    }
    function targetView(r) { return r === 'mine' ? viewMine() : viewOf(r); }
    function svgEl() { return el.querySelector('#mwMap svg'); }
    function setView(v) {
      ST.view = v;
      var s = svgEl(); if (!s) return;
      s.setAttribute('viewBox', v.map(function (x) { return x.toFixed(2); }).join(' '));
      if (Math.abs(v[2] - lastLabelW) > lastLabelW * 0.02) paintLabels();
    }
    function paintLabels() {
      var s = svgEl(); if (!s) return;
      var w = ST.view[2], g = s.querySelector('.mw-labels'), C = counts(), fs = w * 0.031;
      lastLabelW = w;
      g.setAttribute('font-size', fs.toFixed(2)); g.setAttribute('stroke-width', (fs * 0.28).toFixed(2));
      labels.forEach(function (l) {
        var on = !!klass(l.c.cc, C), mw = l.c.x1 - l.c.x0, show = ST.names && (ST.sel === l.c.cc || (on && mw / w > 0.03) || (w < 620 && mw / w > 0.1));
        l.t.style.display = show ? '' : 'none';
        if (show) l.t.setAttribute('class', on || ST.sel === l.c.cc ? 'on' : '');
      });
      Array.prototype.forEach.call(s.querySelectorAll('circle'), function (c) { c.setAttribute('r', (w / 130).toFixed(2)); });
    }
    function animateTo(v) {
      cancelAnimationFrame(anim);
      var a = ST.view || v, t0 = performance.now();
      if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) { setView(v); return; }
      (function step(now) {
        var f = Math.min(1, (now - t0) / 550), e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
        setView(a.map(function (x, i) { return x + (v[i] - x) * e; }));
        if (f < 1) anim = requestAnimationFrame(step);
      })(t0);
    }
    // acercar o alejar dejando quieto el punto (fx, fy) del mapa, de 0 a 1
    function zoomAt(f, fx, fy, smooth) {
      var v = ST.view, w = v[2] * f, nx = v[0] + (v[2] - w) * fx, ny = v[1] + (v[3] - w / A) * fy, c = clampView(nx + w / 2, ny + w / A / 2, w);
      unselectRegion();
      if (smooth) animateTo(c); else { cancelAnimationFrame(anim); setView(c); }
    }
    function unselectRegion() {
      if (!ST.region) return; ST.region = '';
      Array.prototype.forEach.call(el.querySelectorAll('[data-mw=region] .opt'), function (x) { x.classList.remove('on'); });
    }
    function focusCountry(cc) {
      var c = (WORLD || []).filter(function (x) { return x.cc === cc; })[0]; if (!c) return;
      unselectRegion();
      animateTo(viewOfBox(c.x0 - (c.x1 - c.x0) * 0.35, c.x1 + (c.x1 - c.x0) * 0.35, c.y0 - (c.y1 - c.y0) * 0.35, c.y1 + (c.y1 - c.y0) * 0.35, 110));
    }
    function paintMap() {
      var m = el.querySelector('#mwMap'); if (!m || !WORLD) return;
      var C = counts();
      if (!ST.view) ST.view = targetView(ST.region || 'mine');
      var h = '<svg viewBox="' + ST.view.join(' ') + '" role="img" aria-label="Mapa del mundo">';
      WORLD.forEach(function (c) { if (c.d) h += '<path data-c="' + esc(c.cc) + '" class="' + klass(c.cc, C) + (ST.sel === c.cc ? ' sel' : '') + '" d="' + c.d + '"/>'; });
      // los países diminutos no se verían: un punto
      WORLD.forEach(function (c) { var k = klass(c.cc, C); if (c.small && k) h += '<circle data-c="' + esc(c.cc) + '" class="' + k + '" cx="' + c.cx.toFixed(1) + '" cy="' + c.cy.toFixed(1) + '" r="4"/>'; });
      h += '<g class="mw-labels" text-anchor="middle" dominant-baseline="middle">' + WORLD.map(function (c) { return '<text data-l="' + esc(c.cc) + '" x="' + c.cx.toFixed(1) + '" y="' + c.cy.toFixed(1) + '" style="display:none">' + esc(name(c.cc)) + '</text>'; }).join('') + '</g>';
      m.innerHTML = h + '</svg>';
      var byCc = {}; WORLD.forEach(function (c) { byCc[c.cc] = c; });
      labels = Array.prototype.map.call(m.querySelectorAll('text'), function (t) { return { t: t, c: byCc[t.getAttribute('data-l')] }; });
      gestures(m);
      paintLabels();
      paintInfo();
    }
    /* ----- con el dedo: arrastrar para moverse, pellizcar para acercar. Con ratón: rueda y doble clic ----- */
    var dragged = false;
    function gestures(m) {
      if (m._mw) return; m._mw = true;
      var P = {}, start = null, lastTap = 0;
      function pts() { return Object.keys(P).map(function (k) { return P[k]; }); }
      function snapshot() {
        var a = pts(), r = m.getBoundingClientRect(), mx = 0, my = 0, d = 0;
        a.forEach(function (p) { mx += p.x; my += p.y; }); mx /= a.length; my /= a.length;
        if (a.length > 1) d = Math.sqrt(Math.pow(a[0].x - a[1].x, 2) + Math.pow(a[0].y - a[1].y, 2));
        start = { v: ST.view.slice(), mx: mx, my: my, d: d, r: r };
      }
      m.addEventListener('pointerdown', function (e) { if (e.button) return; P[e.pointerId] = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY }; dragged = false; cancelAnimationFrame(anim); snapshot(); });
      m.addEventListener('pointermove', function (e) {
        var p = P[e.pointerId]; if (!p || !ST.view) return;
        p.x = e.clientX; p.y = e.clientY;
        var a = pts(); if (!a.length || !start) return;
        if (!dragged && a.length === 1 && Math.abs(p.x - p.x0) + Math.abs(p.y - p.y0) < 7) return;
        if (!dragged) { dragged = true; try { m.setPointerCapture(e.pointerId); } catch (err) {} unselectRegion(); }
        var mx = 0, my = 0; a.forEach(function (q) { mx += q.x; my += q.y; }); mx /= a.length; my /= a.length;
        var r = start.r, v = start.v, w = v[2];
        if (a.length > 1 && start.d) { var d = Math.sqrt(Math.pow(a[0].x - a[1].x, 2) + Math.pow(a[0].y - a[1].y, 2)); w = v[2] * start.d / Math.max(d, 1); }
        w = Math.max(WMIN, Math.min(1000, w));
        // el punto del mapa que estaba bajo los dedos sigue bajo los dedos
        var wx0 = v[0] + (start.mx - r.left) / r.width * v[2], wy0 = v[1] + (start.my - r.top) / r.height * v[3], nx = wx0 - (mx - r.left) / r.width * w, ny = wy0 - (my - r.top) / r.height * (w / A);
        setView(clampView(nx + w / 2, ny + w / A / 2, w));
      });
      function up(e) {
        var was = !!P[e.pointerId]; delete P[e.pointerId];
        if (pts().length) { snapshot(); return; }
        if (!was || dragged || e.type === 'pointercancel') return;
        var now = performance.now(), r = m.getBoundingClientRect();
        if (now - lastTap < 320) { lastTap = 0; zoomAt(0.5, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, true); } else lastTap = now;
      }
      m.addEventListener('pointerup', up); m.addEventListener('pointercancel', up);
      m.addEventListener('wheel', function (e) {
        if (!ST.view) return; e.preventDefault();
        var r = m.getBoundingClientRect();
        zoomAt(Math.exp(Math.max(-120, Math.min(120, e.deltaY)) * 0.0028), (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      }, { passive: false });
    }
    function paintInfo() {
      var b = el.querySelector('#mwInfo'); if (!b) return;
      var c = ST.sel; if (!c) { b.innerHTML = '<p class="mw-hint">Arrastra para moverte, pellizca o usa + y − para acercar, y toca un país para ver tus viajes allí.</p>'; return; }
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
    function recolor() {
      var C = counts();
      Array.prototype.forEach.call(el.querySelectorAll('#mwMap path, #mwMap circle'), function (p) { p.setAttribute('class', klass(p.getAttribute('data-c'), C) + (ST.sel === p.getAttribute('data-c') ? ' sel' : '')); });
      paintLabels(); paintInfo();
    }
    el.onclick = function (e) {
      var t = e.target, ch = t.closest('.mw-chips .opt'), tool = t.closest('[data-mt]');
      if (ch) {
        var w = ch.parentNode.getAttribute('data-mw'), v = ch.getAttribute('data-v');
        Array.prototype.forEach.call(ch.parentNode.querySelectorAll('.opt'), function (x) { x.classList.toggle('on', x === ch); });
        if (w === 'filter') { ST.filter = v; recolor(); if (ST.region === 'mine') animateTo(viewMine()); } else { ST.region = v; animateTo(targetView(v)); }
        return;
      }
      if (tool) {
        var a = tool.getAttribute('data-mt');
        if (a === 'in') zoomAt(0.55, 0.5, 0.5, true); else if (a === 'out') zoomAt(1.8, 0.5, 0.5, true);
        else { ST.names = !ST.names; tool.classList.toggle('on', ST.names); tool.setAttribute('aria-pressed', ST.names); paintLabels(); }
        return;
      }
      if (t.closest('#stTog')) {
        ST.stats = !ST.stats; el.querySelector('.st-more').hidden = !ST.stats;
        var tg = el.querySelector('#stTog'); tg.textContent = ST.stats ? 'Ver menos' : 'Ver más'; tg.setAttribute('aria-expanded', ST.stats);
        return;
      }
      if (t.closest('#mwMore')) { ST.more = !ST.more; paintList(statsOf(trips)); return; }
      var c = t.closest('[data-c]');
      if (c) {
        var row = t.closest('.mw-row');
        if (dragged && !row) { dragged = false; return; }
        ST.sel = !row && ST.sel === c.getAttribute('data-c') ? '' : c.getAttribute('data-c'); recolor();
        if (row) { focusCountry(ST.sel); var mw = el.querySelector('.mw'); if (mw) mw.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
    };
    el.onchange = function (e) { if (e.target.id === 'mwYear') { ST.year = e.target.value; recolor(); if (ST.region === 'mine') animateTo(viewMine()); } };
    draw();
  }
  return { mount: mount, detect: detect, cached: cached, name: name, flag: flag };
})();
