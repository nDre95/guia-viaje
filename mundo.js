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
  function citiesOf(t) { var m = t.ref.b.meta; return (m.generated || {}).cities || (m.mapCities || []).map(function (c) { return c.es; }); }
  function statsOf(trips) {
    var done = trips.filter(function (t) { return t.status !== 'next'; }), V = {}, N = {}, conts = {}, cities = {}, km = 0, longest = null, dayN = 0;
    trips.forEach(function (t) {
      (cached(t.ref) || []).forEach(function (c) { (t.status === 'next' ? N : V)[c] = (t.status === 'next' ? N : V)[c] || []; (t.status === 'next' ? N : V)[c].push(t); });
    });
    done.forEach(function (t) {
      var m = t.ref.b.meta, prev = null; dayN += t.days;
      (cached(t.ref) || []).forEach(function (c) { if (CONT[c]) conts[CONT[c]] = 1; });
      citiesOf(t).forEach(function (c) { cities[c] = 1; });
      t.ref.b.trip.days.forEach(function (d) { d.items.forEach(function (it) { if (it.lat == null || !Mapa.isStop(it)) return; if (prev) km += Mapa.kmBetween(prev, it); prev = it; }); });
      if (!longest || t.days > longest.days) longest = t;
    });
    var later = {};
    trips.forEach(function (t) { if (t.status === 'next') citiesOf(t).forEach(function (c) { if (!cities[c]) later[c] = 1; }); });
    var top = Object.keys(V).sort(function (a, b) { return V[b].length - V[a].length; })[0];
    return { V: V, N: N, done: done, conts: Object.keys(conts).length, cities: Object.keys(cities).length, citiesN: Object.keys(later).length, km: Math.round(km), longest: longest, dayN: dayN, top: top && V[top].length > 1 ? top : null };
  }
  function fmtN(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lg() === 'en' ? ',' : '.'); }

  /* ---------- Perfil viajero: cómo viajas, nivel, sellos y tarjeta para compartir ---------- */
  var TYPES = [
    { id: 'hist', ico: '🏰', t: 'Viajes de historia', kinds: ['palace', 'ruins', 'monument', 'sacred'], re: /castillo|castle|palacio|palace|catedral|cathedral|iglesia|church|abad|abbey|ruinas|ruins|foro|forum|monument|memorial|torre|tower|templo|temple/i },
    { id: 'arte', ico: '🎨', t: 'Viajes de arte y museos', kinds: ['museum', 'show'], re: /museo|museum|galer|gallery|teatro|theatre|ópera|opera/i },
    { id: 'natu', ico: '🏔️', t: 'Viajes de naturaleza', kinds: ['nature', 'garden'], re: /parque|park|jard[ií]n|garden|lago|loch|lake|monte|mount|glen|cascada|falls|mirador|viewpoint|playa|beach/i },
    { id: 'urbe', ico: '🏙️', t: 'Viajes de ciudad', kinds: ['square', 'quarter', 'market', 'family'], re: /plaza|piazza|square|barrio|quarter|mercado|market|calle|street|paseo/i }
  ];
  var LEVELS = [[0, 'Principiante'], [40, 'Viajero'], [120, 'Viajero habitual'], [300, 'Viajero experto'], [700, 'Veterano']];
  // el borde del perfil sale del nivel, con los mismos materiales que las rarezas de los cromos
  var BORDERS = ['copper', 'silver', 'gold', 'emerald', 'ruby'];
  // colores del metal: sombra, medio, luz, brillo
  var BD = { copper: ['#4a2710', '#a8693a', '#e6a874', '#ffe2c4'], silver: ['#4d5560', '#9aa4b0', '#e4e9ee', '#ffffff'], gold: ['#5c3f06', '#c4942a', '#ffdf85', '#fff8d8'], emerald: ['#06402b', '#129a69', '#6ff0bb', '#e6fff4'], ruby: ['#4f0617', '#c5163c', '#ff7a92', '#ffe3e9'] };
  var bdN = 0;
  // una voluta: sale del aro, se dobla y acaba en espiral; se repite alrededor y en espejo
  var CURL = 'M1 -45 C4 -52 13 -54 17 -49 C20 -45 16 -40 12 -42 C9 -44 11 -48 14 -46.5';
  var CURL2 = 'M0 -46 C-1 -53 3 -59 8 -57 C11 -55 10 -51 7 -52';
  function borderSVG(id) {
    var c = BD[id]; if (!c) return '';
    var rank = BORDERS.indexOf(id), n = [4, 6, 6, 8, 10][rank], u = 'bd' + (++bdN);
    function metal(d, w) {
      // relieve: sombra debajo, el metal y un filo de luz encima
      return '<path d="' + d + '" stroke="' + c[0] + '" stroke-width="' + (w + 1.5) + '" transform="translate(.5 .9)"/><path d="' + d + '" stroke="url(#' + u + 'm)" stroke-width="' + w + '"/><path d="' + d + '" stroke="' + c[3] + '" stroke-width="' + (w * 0.28).toFixed(2) + '" stroke-opacity=".85" transform="translate(-.25 -.35)"/>';
    }
    var curls = '';
    for (var i = 0; i < n; i++) {
      var a = (360 / n * i + 180 / n).toFixed(1);
      curls += '<g transform="rotate(' + a + ')">' + metal(CURL, 2.1) + '<g transform="scale(-1 1)">' + metal(CURL, 2.1) + '</g>' + (rank >= 3 ? metal(CURL2, 1.5) : '') + '</g>';
    }
    // alas a los lados, en los bordes más altos
    var wing = 'M46 -8 C56 -14 63 -7 60 0 C58 5 52 4 52 0 C52 -3 56 -3 56 -1 M46 8 C56 13 62 8 60 3';
    var wings = rank >= 4 ? metal(wing, 2.2) + '<g transform="scale(-1 1)">' + metal(wing, 2.2) + '</g>' : '';
    // remate arriba: en los altos, una gema con su reflejo
    var crest = rank >= 2 ? '<path d="M0 -60 L7 -50 L0 -42 L-7 -50 Z" fill="url(#' + u + 'm)" stroke="' + c[0] + '" stroke-width="1"/><path d="M0 -58 L3.5 -50 L0 -50 L-3.5 -50 Z" fill="' + c[3] + '" fill-opacity=".85"/>' : '';
    var foot = rank >= 3 ? '<path d="M0 60 L6 51 L0 44 L-6 51 Z" fill="url(#' + u + 'm)" stroke="' + c[0] + '" stroke-width="1"/>' : '';
    var spin = rank >= 4 ? '<animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="7s" repeatCount="indefinite"/>' : '';
    return '<svg class="bd-svg" viewBox="-66 -66 132 132" aria-hidden="true"><defs><linearGradient id="' + u + 'm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[3] + '"/><stop offset=".3" stop-color="' + c[1] + '"/><stop offset=".52" stop-color="' + c[2] + '"/><stop offset=".75" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/>' + spin + '</linearGradient></defs>' +
      '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' + curls + wings + '</g>' +
      // el aro, con canto de luz arriba y sombra abajo
      '<circle r="42" fill="none" stroke="' + c[0] + '" stroke-width="7.5" transform="translate(.4 .9)"/><circle r="42" fill="none" stroke="url(#' + u + 'm)" stroke-width="6"/><circle r="44.6" fill="none" stroke="' + c[3] + '" stroke-width=".9" stroke-opacity=".8"/><circle r="39.3" fill="none" stroke="' + c[0] + '" stroke-width="1.1"/>' + crest + foot + '</svg>';
  }
  var EARTH_KM = 40075;
  function travelType(list) {
    var score = {}; TYPES.forEach(function (T) { score[T.id] = 0; });
    list.forEach(function (t) { t.ref.b.trip.days.forEach(function (d) { d.items.forEach(function (it) {
      if (!Mapa.isSight(it)) return;
      TYPES.forEach(function (T) { if (T.kinds.indexOf(it.k) >= 0 || (!it.k && T.re.test(it.ti)) || (T.id === 'natu' && it.t === 'view')) score[T.id] += it.must ? 2 : 1; });
    }); }); });
    return TYPES.slice().sort(function (a, b) { return score[b.id] - score[a.id]; })[0];
  }
  function levelOf(S, got) {
    // la experiencia solo sale de viajar
    var pts = Object.keys(S.V).length * 15 + S.done.length * 10 + (got || 0) * 2, i = 0;
    LEVELS.forEach(function (l, k) { if (pts >= l[0]) i = k; });
    var next = LEVELS[i + 1];
    return { n: i + 1, name: LEVELS[i][1], pts: pts, next: next, pc: next ? Math.round((pts - LEVELS[i][0]) / (next[0] - LEVELS[i][0]) * 100) : 100 };
  }
  var STAMP = ['#b3364b', '#2b6ea3', '#3f8f5b', '#8a4fa8', '#c2622a', '#1f8a8a', '#7a5a2b'];
  function stampsHTML(S) {
    var firstYear = function (l) { return l.map(function (t) { return (t.start || '').slice(0, 4); }).sort()[0]; };
    var rows = Object.keys(S.V).map(function (c) { return { c: c, y: firstYear(S.V[c]), n: S.V[c].length }; }).sort(function (a, b) { return String(a.y).localeCompare(String(b.y)); })
      .concat(Object.keys(S.N).filter(function (c) { return !S.V[c]; }).map(function (c) { return { c: c, y: firstYear(S.N[c]), next: true }; }));
    if (!rows.length) return '';
    var got = rows.filter(function (r) { return !r.next; }).length;
    return '<div class="pf-h">Mi pasaporte <small>' + got + (got === 1 ? ' sello' : ' sellos') + '</small></div><p class="mw-pp">Un sello por cada país que visitas. Se consigue al empezar un viaje allí; los de tus próximos viajes salen en gris.</p><div class="mw-stamps">' + rows.map(function (r, i) {
      var col = 0; for (var k = 0; k < r.c.length; k++) col += r.c.charCodeAt(k);
      return '<button type="button" class="mw-stamp sq' + (r.next ? ' next' : '') + '" data-c="' + esc(r.c) + '" style="--c:' + STAMP[col % STAMP.length] + '"><span class="fl">' + (flag(r.c) || '🌍') + '</span><b>' + esc(name(r.c)) + '</b><small>' + (r.next ? 'Por visitar' : esc(r.y) + (r.n > 1 ? ' · ×' + r.n : '')) + '</small></button>';
    }).join('') + '</div>';
  }
  function heroHTML(trips, base) {
    var S = statsOf(trips), list = S.done.length ? S.done : trips, T = list.length ? travelType(list) : null, L = levelOf(S, (base || {}).got), pc = S.km / EARTH_KM * 100;
    return '<div class="pf-hero">' +
      '<span class="pf-badge">' + borderSVG(BORDERS[L.n - 1]) + '<span>' + (T ? T.ico : '🧭') + '</span></span><div class="pf-hm"><small>Tu estilo de viaje</small><b>' + esc(T ? T.t : 'Sin viajes aún') + '</b></div>' +
      '<div class="pf-lv"><span><b>Nivel ' + L.n + '</b> · <u class="nm">' + esc(L.name) + '</u></span><span>' + (L.next ? L.pts + ' / ' + L.next[0] + ' XP' : L.pts + ' XP') + '</span></div><span class="pf-bar"><i style="width:' + L.pc + '%"></i></span>' +
      '<div class="pf-world"><span>🌍 Vuelta al mundo</span><span>' + (pc < 10 ? pc.toFixed(1).replace('.', lg() === 'en' ? '.' : ',') : Math.round(pc)) + ' % · ' + fmtN(S.km) + ' km</span></div><span class="pf-bar w"><i style="width:' + Math.min(100, pc).toFixed(1) + '%"></i></span></div>';
  }


  /* ---------- Quiz: preguntas con los sitios de tus viajes, sin conexión ni servicios externos ---------- */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function quizStore(o) {
    try { if (o) localStorage.setItem('guia-quiz', JSON.stringify(o)); return JSON.parse(localStorage.getItem('guia-quiz') || '{}') || {}; } catch (e) { return o || {}; }
  }
  // un intento por viaje cada 24 h, contado desde la primera respuesta
  var QZ_MS = 864e5;
  function quizLeft(tid) { var r = (quizStore().trips || {})[tid]; return r && r.last ? Math.max(0, r.last + QZ_MS - Date.now()) : 0; }
  function clock(ms) { var x = Math.ceil(ms / 1000), h = Math.floor(x / 3600), m = Math.floor(x % 3600 / 60), sc = x % 60; return h + ':' + (m < 10 ? '0' : '') + m + ':' + (sc < 10 ? '0' : '') + sc; }
  // cuenta atrás en vivo de los elementos [data-cd] (ms de fin) mientras la ventana siga abierta
  function ticker(box) {
    var iv = setInterval(function () {
      if (!document.body.contains(box)) { clearInterval(iv); return; }
      Array.prototype.forEach.call(box.querySelectorAll('[data-cd]'), function (el) { var left = +el.getAttribute('data-cd') - Date.now(); el.textContent = left > 0 ? clock(left) : '0:00:00'; });
    }, 1000);
  }
  // los sitios de todos los viajes generados, desde que existen
  function quizPool(trips) {
    var out = [], seen = {};
    trips.forEach(function (t) {
      var b = t.ref.b, en = lg() === 'en' ? (b.trip_en || {}).items || {} : {};
      b.trip.days.forEach(function (d) { d.items.forEach(function (it) {
        if (!Mapa.isSight(it)) return;
        var o = en[it.id] || {}, ti = o.ti || it.ti; if (seen[ti]) return; seen[ti] = 1;
        out.push({ ti: ti, lead: o.lead || it.lead || '', img: Mapa.photoOf({ ph: it.ph }, b.photos), lat: it.lat, trip: t.id });
      }); });
    });
    return { list: out };
  }
  // quita el nombre del sitio de su descripción, para no regalar la respuesta
  function maskName(lead, ti) {
    var r = lead;
    ti.split(/[\s,.'’()-]+/).filter(function (w) { return w.length > 3; }).forEach(function (w) {
      r = r.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '···');
    });
    return r.length > 170 ? r.slice(0, 170).replace(/\s+\S*$/, '') + '…' : r;
  }
  function quizQuestions(P) {
    var L = P.list, used = {}, qs = [];
    function others(q, n) {
      var same = shuffle(L.filter(function (x) { return x !== q && x.trip === q.trip; })), rest = shuffle(L.filter(function (x) { return x !== q && x.trip !== q.trip; }));
      return same.concat(rest).slice(0, n);
    }
    function ask(type, q) {
      used[q.ti] = 1;
      qs.push({ type: type, q: q, ok: q.ti, opts: shuffle([q].concat(others(q, 3))).map(function (x) { return x.ti; }) });
    }
    var withPh = shuffle(L.filter(function (x) { return x.img; })), withTx = shuffle(L.filter(function (x) { return x.lead.length >= 25; }));
    withPh.slice(0, 2).forEach(function (q) { ask('photo', q); });
    withTx.filter(function (q) { return !used[q.ti]; }).slice(0, 2).forEach(function (q) { ask('text', q); });
    // cuál está más al norte: dos sitios claramente separados
    var pairs = shuffle(L), a = pairs[0], b = pairs.filter(function (x) { return Math.abs(x.lat - a.lat) > 0.02; })[0];
    if (b) qs.push({ type: 'north', q: a.lat > b.lat ? a : b, ok: a.lat > b.lat ? a.ti : b.ti, opts: shuffle([a.ti, b.ti]) });
    withPh.concat(withTx).forEach(function (q) { if (qs.length < 5 && !used[q.ti]) ask(q.img ? 'photo' : 'text', q); });
    return shuffle(qs).slice(0, 5);
  }
  // ¿se puede jugar el quiz de este viaje? Solo de los ya empezados o hechos (en modo prueba, de todos)
  function quizOpen(t) { return (window.Juego && Juego.TEST) || t.status !== 'next'; }
  function playable(trips) { return trips.filter(function (t) { return quizPool([t]).list.length >= 4; }); }
  // losa grande del perfil: fotos de tus viajes, récord y partidas
  function quizCardHTML(trips) {
    var rows = playable(trips); if (!rows.length) return '';
    var S = quizStore(), fan = rows.filter(function (t) { return t.cover; }).slice(0, 3);
    return '<button type="button" class="qzb sq" id="pfQuiz"><span class="qzb-fan">' + fan.map(function (t, i) { return '<i style="--r:' + ((i - (fan.length - 1) / 2) * 9) + 'deg;--x:' + ((i - (fan.length - 1) / 2) * 30) + 'px;background-image:url(&quot;' + esc(t.cover) + '&quot;)"></i>'; }).join('') + '<u>?</u></span>' +
      '<span class="qzb-m"><small>Quizzes</small><b>¿Cuánto recuerdas de tus viajes?</b><span>5 preguntas por viaje. Gana sobres para mejorar tus cromos.</span></span>' +
      '<span class="qzb-row"><span><b>' + (S.best || 0) + '<i>/5</i></b><small>récord</small></span><span><b>' + (S.played || 0) + '</b><small>partidas</small></span><span><b>' + (S.perfect || 0) + '</b><small>perfectos</small></span><span class="qzb-go">Jugar</span></span></button>';
  }
  // la página de quizzes, a pantalla completa: cifras, premios, cómo funciona y los viajes con su foto
  var QZF = 'all';
  function openQuizPicker(trips, onEnd) {
    var old = document.getElementById('qzBox'); if (old) old.remove();
    var S = quizStore(), rec = S.trips || {}, box = document.createElement('div'), test = !!(window.Juego && Juego.TEST);
    box.id = 'qzBox'; box.className = 'qzp';
    var rows = playable(trips).slice().sort(function (a, b) { return (quizOpen(b) ? 1 : 0) - (quizOpen(a) ? 1 : 0) || String(b.start || '').localeCompare(String(a.start || '')); });
    var ST0 = { past: 'Hecho', now: 'En curso', next: 'Próximo' }, PK = [[2, 'c'], [3, 's'], [4, 'g'], [5, 'r']];
    function tripHTML(t) {
      var r = rec[t.id], w = quizLeft(t.id), open = quizOpen(t), best = r ? r.best : 0, dots = '';
      for (var k = 0; k < 5; k++) dots += '<i' + (k < best ? ' class="on"' : '') + '></i>';
      var foot = !open ? '<span class="qzp-lock">Cuando hagas el viaje</span>' : w ? '<span class="qzp-wait"><span>Otra vez en</span> <i data-cd="' + (Date.now() + w) + '">' + clock(w) + '</i></span>' : '<span class="qzp-play">Jugar</span>';
      return '<button type="button" class="qzp-t sq' + (open ? '' : ' off') + (w ? ' wait' : '') + '" data-qp="' + esc(t.id) + '"' + (open ? '' : ' disabled') + '><span class="qzp-ph"' + (t.cover ? ' style="background-image:url(&quot;' + esc(t.cover) + '&quot;)"' : '') + '>' +
        '<span class="qzp-st ' + t.status + '">' + ST0[t.status] + '</span></span><span class="qzp-tm"><b>' + esc(t.title) + '</b><small>' + (r ? 'Récord: ' + r.best + '/5' : 'Sin jugar') + '</small><span class="qzp-dots">' + dots + '</span></span>' + foot + '</button>';
    }
    function list() {
      var f = rows.filter(function (t) { return QZF === 'all' ? true : QZF === 'open' ? quizOpen(t) && !quizLeft(t.id) : !!quizLeft(t.id); });
      return f.length ? f.map(tripHTML).join('') : '<p class="note">Nada por aquí.</p>';
    }
    function chips() {
      var nOpen = rows.filter(function (t) { return quizOpen(t) && !quizLeft(t.id); }).length, nWait = rows.filter(function (t) { return quizLeft(t.id); }).length;
      return [['all', 'Todos', rows.length], ['open', 'Disponibles', nOpen], ['wait', 'Jugados hoy', nWait]].map(function (c) { return '<button type="button" class="opt' + (QZF === c[0] ? ' on' : '') + '" data-qf="' + c[0] + '">' + c[1] + ' <i>' + c[2] + '</i></button>'; }).join('');
    }
    box.innerHTML = '<div class="qzp-bar"><button type="button" class="qzp-back sq" data-qp="close"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Perfil</span></button><b>Quizzes</b><span></span></div>' +
      '<div class="qzp-in"><div class="qzp-hero"><span class="qzp-q">?</span><h2>Quizzes de mis viajes</h2><p>5 preguntas por viaje con los sitios que has visto. Cuantos más aciertos, mejor sobre.</p>' +
        (test ? '<p class="qzp-test">Modo prueba: puedes jugar cualquier viaje, aunque aún no lo hayas hecho.</p>' : '') + '</div>' +
      '<div class="qzp-stats"><span><b>' + (S.played || 0) + '</b><small>partidas</small></span><span><b>' + (S.hits || 0) + '</b><small>aciertos</small></span><span><b>' + (S.perfect || 0) + '</b><small>perfectos</small></span><span><b>' + (S.packs || 0) + '</b><small>sobres</small></span></div>' +
      '<div class="pf-h">Premios</div><div class="qzp-rw">' + PK.map(function (p) { return '<span class="k-' + p[1] + '"><i class="pk-mini"><span class="pk-foil"></span></i><b>' + p[0] + ' aciertos</b><small>' + esc(window.Juego ? Juego.PACK[p[1]] : '') + '</small></span>'; }).join('') + '</div>' +
      '<div class="pf-h">Elige un viaje</div><div class="lst-chips qzp-chips">' + chips() + '</div><div class="qzp-list">' + list() + '</div>' +
      '<div class="pf-h">Cómo funciona</div><div class="card qzp-how"><p><b>Preguntas</b><span>Fotos, descripciones sin el nombre y cuál está más al norte.</span></p><p><b>Un intento al día</b><span>Un intento por viaje cada 24 horas, desde la primera respuesta.</span></p><p><b>Sobres</b><span>Mejoran la rareza de los cromos que ya has canjeado en ese viaje, sin repetidos.</span></p></div></div>';
    function close() { box.classList.add('out'); setTimeout(function () { box.remove(); }, 260); if (onEnd) onEnd(); }
    box.addEventListener('click', function (e) {
      var qf = e.target.closest('[data-qf]');
      if (qf) { QZF = qf.getAttribute('data-qf'); box.querySelector('.qzp-chips').innerHTML = chips(); box.querySelector('.qzp-list').innerHTML = list(); return; }
      var b = e.target.closest('[data-qp]'); if (!b) return;
      if (b.getAttribute('data-qp') === 'close') { close(); return; }
      var t = rows.filter(function (x) { return x.id === b.getAttribute('data-qp'); })[0];
      if (t && quizOpen(t)) openQuiz([t], onEnd, function () { openQuizPicker(trips, onEnd); });
    });
    ticker(box);
    if (window.Lang) Lang.watch(box);
    document.body.appendChild(box);
  }
  function openQuiz(trips, onEnd, back) {
    var old = document.getElementById('qzBox'); if (old) old.remove();
    var P = quizPool(trips), Q = quizQuestions(P), i = 0, hits = 0, box = document.createElement('div'), tid = trips[0].id, wait = quizLeft(tid);
    if (!Q.length) return;
    box.id = 'qzBox'; box.className = 'qz'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    function close() { box.remove(); if (onEnd) onEnd(); }
    function waitHTML(ms, best) {
      return '<div class="qz-wt"><small>Próximo intento en</small><b data-cd="' + (Date.now() + ms) + '">' + clock(ms) + '</b>' + (best != null ? '<small>Récord: ' + best + '/5</small>' : '') + '</div>';
    }
    // el intento cuenta desde la primera respuesta
    function mark() {
      var S = quizStore(); S.trips = S.trips || {}; var r = S.trips[tid] || { best: 0, played: 0 };
      if (r.last && Date.now() - r.last < QZ_MS) return; r.last = Date.now(); S.trips[tid] = r; quizStore(S);
    }
    function paint() {
      var q = Q[i], title = q.type === 'photo' ? '¿Qué sitio es este?' : q.type === 'text' ? '¿De qué sitio habla?' : '¿Cuál está más al norte?';
      box.innerHTML = '<div class="qz-in"><div class="qz-top"><span>Pregunta ' + (i + 1) + ' de ' + Q.length + '</span><button type="button" class="qz-x sq" data-qz="close" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>' +
        '<span class="qz-bar"><i style="width:' + (i / Q.length * 100) + '%"></i></span><h3>' + esc(title) + '</h3>' +
        (q.type === 'photo' ? '<div class="qz-ph" style="background-image:url(&quot;' + esc(q.q.img) + '&quot;)"></div>' : q.type === 'text' ? '<p class="qz-tx">' + esc(maskName(q.q.lead, q.q.ti)) + '</p>' : '') +
        '<div class="qz-opts">' + q.opts.map(function (o, k) { return '<button type="button" class="qz-o sq" data-o="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div><div class="qz-next" hidden></div></div>';
    }
    function result() {
      var S = quizStore(); S.played = (S.played || 0) + 1; S.best = Math.max(S.best || 0, hits); if (hits >= 5) S.perfect = (S.perfect || 0) + 1; S.hits = (S.hits || 0) + hits;
      S.trips = S.trips || {}; var tr0 = S.trips[tid] || { best: 0, played: 0 }; tr0.best = Math.max(tr0.best, hits); tr0.played++; S.trips[tid] = tr0;
      quizStore(S);
      var pack = window.Juego ? Juego.onQuiz(hits, tid) : '';
      if (pack) { var S2 = quizStore(); S2.packs = (S2.packs || 0) + 1; quizStore(S2); }
      box.innerHTML = '<div class="qz-in qz-end"><b class="qz-score">' + hits + '<i>/' + Q.length + '</i></b><h3>' + esc(hits === Q.length ? 'Perfecto' : hits * 2 >= Q.length ? 'Bien' : 'Hay que repasar') + '</h3><p class="qz-tx">Has acertado ' + hits + ' de ' + Q.length + '</p><div class="qz-rew"><p class="' + (pack ? 'on' : '') + '">' + (pack ? Juego.PACK[pack] + ' conseguido' : hits >= 2 ? 'Hoy ya ganaste el sobre de este viaje' : 'Con 2 aciertos ya ganas un sobre') + '</p></div>' +
        waitHTML(quizLeft(tid) || QZ_MS) +
        '<div class="btn-row">' + (back ? '<button type="button" class="btn navy sq" data-qz="back">Otro viaje</button>' : '') + '<button type="button" class="btn ghost sq" data-qz="close">Cerrar</button></div></div>';
      // el sobre ganado aparece en grande, en 3D
      if (pack && Juego.presentPack) setTimeout(function () {
        if (!document.body.contains(box)) return;
        Juego.presentPack(pack, trips[0].title, window.Album && Album.allCards ? function () {
          Album.allCards().then(function (cards) { Juego.openPack(pack, tid, cards, function () { if (Album.renderAlbum) Album.renderAlbum(); }); });
        } : null);
      }, 700);
    }
    box.addEventListener('click', function (e) {
      var o = e.target.closest('[data-o]'), a = e.target.closest('[data-qz]');
      if (a) {
        var w = a.getAttribute('data-qz');
        if (w === 'close') close();
        else if (w === 'back') { box.remove(); back(); }
        else if (w === 'next') { i++; if (i < Q.length) paint(); else result(); }
        return;
      }
      if (e.target === box) { close(); return; }
      if (!o || box.querySelector('.qz-o.ok')) return;
      var q = Q[i], pick = q.opts[+o.getAttribute('data-o')], good = pick === q.ok;
      if (i === 0) mark();
      if (good) hits++;
      Array.prototype.forEach.call(box.querySelectorAll('.qz-o'), function (b, k) { b.disabled = true; if (q.opts[k] === q.ok) b.classList.add('ok'); else if (b === o) b.classList.add('no'); });
      var nx = box.querySelector('.qz-next');
      nx.hidden = false;
      nx.innerHTML = '<p class="qz-tx">' + esc(q.type === 'north' ? '' : q.q.lead.length > 150 ? q.q.lead.slice(0, 150).replace(/\s+\S*$/, '') + '…' : q.q.lead) + '</p><button type="button" class="btn navy sq" data-qz="next">' + (i + 1 < Q.length ? 'Siguiente' : 'Ver resultado') + '</button>';
    });
    if (!quizOpen(trips[0])) {
      box.innerHTML = '<div class="qz-in qz-end"><div class="qz-top"><span>' + esc(trips[0].title || '') + '</span><button type="button" class="qz-x sq" data-qz="close" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>' +
        '<h3>Aún no</h3><p class="qz-tx">Este viaje aún no ha empezado. Los quizzes se abren cuando lo hagas.</p><div class="btn-row">' + (back ? '<button type="button" class="btn navy sq" data-qz="back">Otro viaje</button>' : '') + '<button type="button" class="btn ghost sq" data-qz="close">Cerrar</button></div></div>';
    } else if (wait) {
      var r0 = (quizStore().trips || {})[tid];
      box.innerHTML = '<div class="qz-in qz-end"><div class="qz-top"><span>' + esc(trips[0].title || '') + '</span><button type="button" class="qz-x sq" data-qz="close" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>' +
        '<h3>Ya has jugado hoy</h3><p class="qz-tx">Un intento al día por viaje.</p>' + waitHTML(wait, r0 ? r0.best : null) +
        '<div class="btn-row">' + (back ? '<button type="button" class="btn navy sq" data-qz="back">Otro viaje</button>' : '') + '<button type="button" class="btn ghost sq" data-qz="close">Cerrar</button></div></div>';
    } else paint();
    ticker(box);
    if (window.Lang) Lang.watch(box);
    document.body.appendChild(box);
  }

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
    // el año elegido vale para todo el perfil: cifras, mapa y lista de países
    function tf() { return trips.filter(function (t) { return !ST.year || (t.start || '').slice(0, 4) === ST.year; }); }
    function cell(b, l, sub) { return '<div class="st-cell"><b>' + b + '</b><small>' + esc(l) + '</small>' + (sub ? '<small class="st-sub">' + esc(sub) + '</small>' : '') + '</div>'; }
    function statsHTML(S) {
      var vc = Object.keys(S.V).length, nc = Object.keys(S.N).filter(function (c) { return !S.V[c]; }).length, O = opt.base || {}, T = tf();
      var first = [cell(T.length, T.length === 1 ? 'viaje' : 'viajes'), cell(vc, 'países visitados', nc ? '+' + nc + ' por visitar' : ''), cell(S.cities, 'ciudades visitadas', S.citiesN ? '+' + S.citiesN + ' por visitar' : '')];
      var rest = [cell(S.conts + '<i>/6</i>', 'continentes'), cell(T.length - S.done.length, 'viajes próximos'), cell(fmtN(S.km), 'km recorridos', S.km ? 'en línea recta' : ''),
        cell(S.dayN, 'días ya viajados'), cell(S.longest ? S.longest.days + '<i> ' + (S.longest.days === 1 ? 'día' : 'días') + '</i>' : '–', 'viaje más largo'), cell(S.top ? flag(S.top) || '★' : '–', S.top ? name(S.top) : 'Ningún país repetido', S.top ? S.V[S.top].length + ' veces' : ''),
        cell(vc ? Math.round(vc / 195 * 100) + '<i>%</i>' : '0<i>%</i>', 'del mundo'), cell(O.got != null ? O.got + '<i>/' + O.all + '</i>' : '–', 'cromos'), cell(O.mustGot != null ? O.mustGot + '<i>/' + O.must + '</i>' : '–', 'imprescindibles')];
      return '<div class="card st-card"><div class="st-top"><span class="st-h">Estadísticas</span><button type="button" class="st-tog sq" id="stTog" aria-expanded="' + ST.stats + '">' + (ST.stats ? 'Ver menos' : 'Ver más') + '</button></div>' +
        '<div class="st-grid">' + first.join('') + '</div><div class="st-grid st-more"' + (ST.stats ? '' : ' hidden') + '>' + rest.join('') + '</div></div>';
    }
    function draw() {
      var S = statsOf(tf()), unk = trips.some(function (t) { return !cached(t.ref); }), yl = Object.keys(years).sort().reverse();
      var ic = function (d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };
      el.innerHTML = heroHTML(trips, opt.base) + (yl.length ? '<div class="mw-chips mw-years" role="group" aria-label="Año"><button type="button" class="opt' + (ST.year ? '' : ' on') + '" data-y="">Todos</button>' + yl.map(function (y) { return '<button type="button" class="opt' + (ST.year === y ? ' on' : '') + '" data-y="' + y + '">' + y + '</button>'; }).join('') + '</div>' : '') + statsHTML(S) + '<div id="pfQuizBox">' + quizCardHTML(trips) + '</div><div id="mwStamps">' + stampsHTML(S) + '</div>' +
        '<div class="pf-h">Mi mapa del mundo</div><div class="card mw">' +
        '<div class="mw-chips" data-mw="filter">' + [['all', 'Todos'], ['one', 'Visitados'], ['rep', 'Repetidos'], ['next', 'Por visitar']].map(function (f) { return '<button type="button" class="opt' + (ST.filter === f[0] ? ' on' : '') + '" data-v="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div>' +
        '<div class="mw-chips" data-mw="region"><button type="button" class="opt' + (ST.region === 'mine' ? ' on' : '') + '" data-v="mine">Mis países</button><button type="button" class="opt' + (ST.region === 'world' ? ' on' : '') + '" data-v="world">Mundo</button>' + Object.keys(REGION).map(function (r) { return '<button type="button" class="opt' + (ST.region === r ? ' on' : '') + '" data-v="' + r + '">' + REGION[r][0] + '</button>'; }).join('') + '</div>' +
        '<div class="mw-wrap"><div class="mw-map" id="mwMap"><p class="note">Cargando el mapa…</p></div><div class="mw-hero" id="mwHero" aria-hidden="true"></div>' +
        '<div class="mw-tools"><button type="button" class="sq" data-mt="in" aria-label="Acercar" title="Acercar">' + ic('M12 5v14M5 12h14') + '</button><button type="button" class="sq" data-mt="out" aria-label="Alejar" title="Alejar">' + ic('M5 12h14') + '</button>' +
        '<button type="button" class="sq' + (ST.names ? ' on' : '') + '" data-mt="names" aria-label="Nombres de países" title="Nombres de países" aria-pressed="' + ST.names + '"><b>Aa</b></button></div></div>' +
        '<div class="mw-rec" id="mwRec" hidden><div class="mw-rec-h">Resumen por año</div>' +
        (yl.length ? '<div class="mw-chips mw-rec-y" role="group" aria-label="Año"><button type="button" class="opt' + (ST.year ? '' : ' on') + '" data-y="">Todos</button>' + yl.map(function (y) { return '<button type="button" class="opt' + (ST.year === y ? ' on' : '') + '" data-y="' + y + '">' + y + '</button>'; }).join('') + '</div>' : '') +
        '<div class="map-ctl"><button type="button" class="map-play sq" aria-label="Reproducir mis viajes"><svg viewBox="0 0 24 24"><path class="pl" fill="currentColor" d="M7 4v16l13-8z"/><path class="pa" fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg></button><input class="map-range" type="range" min="-1" max="1" step="0.005" value="-1" aria-label="Mueve la bolita por tus viajes" style="--track:linear-gradient(90deg,#c9ccd4,#6c7079)"></div><div class="mw-rec-info tx" id="mwRecInfo"></div></div>' +
        '<div class="mw-legend"><span><i class="c1"></i>1 vez</span><span><i class="c2"></i>2 veces</span><span><i class="c3"></i>3 o más</span><span><i class="cn"></i>Por visitar</span></div>' +
        '<div class="mw-info" id="mwInfo"></div></div>' +
        '<div id="mwList"></div>';
      paintList(S);
      world().then(function (W) { WORLD = W; paintMap(); }).catch(function () {
        var m = el.querySelector('#mwMap'); if (m) m.innerHTML = '<p class="note">El mapa necesita conexión la primera vez.</p>';
      });
      if (unk) detect(trips.map(function (t) { return t.ref; })).then(function (ch) { if (ch) { ST.view = null; draw(); } }).catch(function () {});
    }
    /* ----- el resumen animado: de viaje en viaje, como el mapa de cada viaje ----- */
    var R = { seq: [], v: -1, limit: null, follow: false, playing: false, raf: 0, tm: 0, key: '', cams: [], mids: [], over: null };
    function mixV(a, b, t) {
      var wa = a[2], wb = b[2], w = Math.exp(Math.log(wa) + (Math.log(wb) - Math.log(wa)) * t), u = Math.abs(wa - wb) < wa * 0.01 ? t : (1 / w - 1 / wa) / (1 / wb - 1 / wa);
      var ax = a[0] + wa / 2, ay = a[1] + a[3] / 2, bx = b[0] + wb / 2, by = b[1] + b[3] / 2;
      return [ax + (bx - ax) * u - w / 2, ay + (by - ay) * u - w / A / 2, w, w / A];
    }
    function eased(f) { return f * f * (3 - 2 * f); }
    function recCam(v) {
      var L = R.seq.length - 1;
      if (v <= -1) return R.over;
      if (v < 0) return mixV(R.over, R.cams[0], eased(v + 1));
      if (v >= L) return mixV(R.cams[L], R.over, eased(Math.min(1, v - L)));
      var i = Math.floor(v), f = v - i, a = R.cams[i], b = R.cams[i + 1], m = R.mids[i];
      if (m[2] > Math.max(a[2], b[2]) * 1.25) return f < 0.5 ? mixV(a, m, eased(f * 2)) : mixV(m, b, eased(f * 2 - 1));
      return mixV(a, b, eased(f));
    }
    function recPos(v) {
      var L = R.seq.length - 1;
      if (v <= 0) return { x: R.seq[0].x, y: R.seq[0].y, a: 0 };
      if (v >= L) { var e = R.seq[L]; return { x: e.x, y: e.y, a: 0 }; }
      var i = Math.floor(v), f = v - i, u = 1 - f, a = R.seq[i], b = R.seq[i + 1];
      return { x: u * u * a.x + 2 * u * f * b.cx + f * f * b.x, y: u * u * a.y + 2 * u * f * b.cy + f * f * b.y, a: Math.atan2(2 * u * (b.cy - a.y) + 2 * f * (b.y - b.cy), 2 * u * (b.cx - a.x) + 2 * f * (b.x - b.cx)) * 180 / Math.PI };
    }
    // qué viajes entran, sus puntos en el mapa y el encuadre de cada uno
    function recBuild() {
      var byCc = {}; (WORLD || []).forEach(function (c) { byCc[c.cc] = c; });
      R.seq = tf().filter(function (t) { return t.start && cached(t.ref); }).sort(function (a, b) { var x = String(a.start).slice(0, 10), y = String(b.start).slice(0, 10); return x < y ? -1 : x > y ? 1 : String(a.title).localeCompare(String(b.title)); }).map(function (t) {
        var la = 0, lo = 0, n = 0;
        t.ref.b.trip.days.forEach(function (d) { d.items.forEach(function (it) { if (Mapa.isSight(it)) { la += it.lat; lo += it.lon; n++; } }); });
        var q = proj(n ? lo / n : 0, n ? la / n : 0), box = [1e4, -1e4, 1e4, -1e4];
        cached(t.ref).forEach(function (c) { var C = byCc[c]; if (C) { box[0] = Math.min(box[0], C.x0); box[1] = Math.max(box[1], C.x1); box[2] = Math.min(box[2], C.y0); box[3] = Math.max(box[3], C.y1); } });
        if (box[0] > 1e3) box = [q[0] - 5, q[0] + 5, q[1] - 5, q[1] + 5];
        return { t: t, x: q[0], y: q[1], box: box };
      });
      if (!R.seq.length) return;
      var all = [1e4, -1e4, 1e4, -1e4];
      R.seq.forEach(function (q, i) {
        var b = q.box, px = (b[1] - b[0]) * 0.4 + 4, py = (b[3] - b[2]) * 0.4 + 14;
        all[0] = Math.min(all[0], b[0]); all[1] = Math.max(all[1], b[1]); all[2] = Math.min(all[2], b[2]); all[3] = Math.max(all[3], b[3]);
        R.cams[i] = viewOfBox(b[0] - px, b[1] + px, b[2] - py, b[3] + py, 95);
        var p = R.seq[i - 1]; if (!p) return;
        var dx = q.x - p.x, dy = q.y - p.y, len = Math.sqrt(dx * dx + dy * dy) || 1e-6, nx = dy / len, ny = -dx / len; if (ny > 0) { nx = -nx; ny = -ny; }
        q.cx = (p.x + q.x) / 2 + nx * len * 0.24; q.cy = (p.y + q.y) / 2 + ny * len * 0.24;
        R.mids[i - 1] = viewOfBox(Math.min(p.x, q.x, q.cx) - 30, Math.max(p.x, q.x, q.cx) + 30, Math.min(p.y, q.y, q.cy) - 34, Math.max(p.y, q.y, q.cy) + 22, 95);
      });
      R.cams.length = R.seq.length; R.mids.length = Math.max(0, R.seq.length - 1);
      var ax = Math.max(all[1] - all[0], 20) * 0.22, ay = Math.max(all[3] - all[2], 20) * 0.22;
      R.over = viewOfBox(all[0] - ax, all[1] + ax, all[2] - ay - 16, all[3] + ay, 190);
    }
    function recSetup() {
      recStop(); R.v = -1; R.limit = null; R.follow = false; R.key = '';
      var h0 = el.querySelector('#mwHero'); if (h0) { h0.classList.remove('on'); h0._i = -1; }
      var bar = el.querySelector('#mwRec'), g = el.querySelector('#mwRecG'); if (!bar) return;
      recBuild();
      bar.hidden = !R.seq.length;
      if (g) g.innerHTML = '';
      if (!R.seq.length || !g) return;
      var rg = bar.querySelector('.map-range'); rg.max = R.seq.length; rg.value = -1;
      var route = R.seq.map(function (q, i) { return i ? 'Q' + q.cx.toFixed(1) + ' ' + q.cy.toFixed(1) + ' ' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) : 'M' + q.x.toFixed(1) + ' ' + q.y.toFixed(1); }).join('');
      g.innerHTML = '<defs><clipPath id="mwClip"><circle cy="-25" r="17"/></clipPath></defs><path class="mw-rt" d="' + route + '"/><path class="mw-rt-done" d=""/>' +
        R.seq.map(function (q, i) { return '<g class="mw-pin" data-i="' + i + '" style="display:none"><path d="M0 0L-8 -13A19 19 0 1 1 8 -13Z" fill="#14161b"/><circle cy="-25" r="17" fill="#fff"/>' + (q.t.cover ? '<image href="' + esc(q.t.cover) + '" x="-17" y="-42" width="34" height="34" preserveAspectRatio="xMidYMid slice" clip-path="url(#mwClip)"/>' : '') + '</g>'; }).join('') +
        '<g class="mw-ball" style="display:none"><circle r="13" fill="#14161b" stroke="#fff" stroke-width="2.4"/><path fill="#fff" fill-rule="evenodd" transform="scale(.72) translate(-12 -12)" d="' + Mapa.plane + '"/></g>';
      recInfo();
    }
    function recPaint() {
      var s = svgEl(), g = el.querySelector('#mwRecG'); if (!s || !g || !R.seq.length || !ST.view) return;
      var v = R.v, L = R.seq.length - 1, k = ST.view[2] / (el.querySelector('#mwMap').clientWidth || 340), show = v > -1, idx = v < 0 ? -1 : Math.min(L, Math.floor(v + 0.15));
      Array.prototype.forEach.call(g.querySelectorAll('.mw-pin'), function (p, i) {
        var on = show && i <= idx && !(i === Math.round(v) && Math.abs(v - i) < 0.13), q = R.seq[i], big = i === idx && v <= L + 0.5 ? 1.2 : 0.9;
        p.style.display = on ? '' : 'none';
        if (on) p.setAttribute('transform', 'translate(' + q.x.toFixed(2) + ' ' + q.y.toFixed(2) + ') scale(' + (k * big).toFixed(4) + ')');
      });
      var ball = g.querySelector('.mw-ball'), B = recPos(v), hide = !show || v > L + 0.4;
      ball.style.display = hide ? 'none' : '';
      if (!hide) { ball.setAttribute('transform', 'translate(' + B.x.toFixed(2) + ' ' + B.y.toFixed(2) + ') scale(' + k.toFixed(4) + ')'); ball.lastChild.setAttribute('transform', 'rotate(' + B.a.toFixed(0) + ') scale(.72) translate(-12 -12)'); }
      // lo ya recorrido, con fuerza
      var d = '';
      if (v > 0) {
        var n = Math.min(L, Math.floor(v)), f = v >= L ? 0 : v - n;
        for (var i = 0; i <= n; i++) { var q = R.seq[i]; d += i ? 'Q' + q.cx.toFixed(1) + ' ' + q.cy.toFixed(1) + ' ' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) : 'M' + q.x.toFixed(1) + ' ' + q.y.toFixed(1); }
        if (f > 0) { var a = R.seq[n], b = R.seq[n + 1], c1x = a.x + (b.cx - a.x) * f, c1y = a.y + (b.cy - a.y) * f; d += 'Q' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + B.x.toFixed(1) + ' ' + B.y.toFixed(1); }
      }
      g.querySelector('.mw-rt-done').setAttribute('d', d);
      recHero(v);
    }
    // al llegar: una tarjeta sobre el sitio, con su foto, el mes y el año y el nombre de la ciudad
    // fechas del viaje con el día: «2–6 dic 2026» o «28 nov – 3 dic 2026»
    function heroDate(t) {
      var d1 = new Date(t.start + 'T12:00:00Z'), d2 = new Date(d1.getTime() + Math.max(0, (t.days || 1) - 1) * 864e5), y = d2.getUTCFullYear();
      var f = function (d, o) { return d.toLocaleDateString(lg(), Object.assign({ timeZone: 'UTC' }, o)); };
      if (d1.getUTCMonth() === d2.getUTCMonth()) return (lg() === 'en' ? f(d1, { month: 'short' }) + ' ' + d1.getUTCDate() + '–' + d2.getUTCDate() : d1.getUTCDate() + '–' + d2.getUTCDate() + ' ' + f(d1, { month: 'short' })) + ' ' + y;
      return f(d1, { day: 'numeric', month: 'short' }) + ' – ' + f(d2, { day: 'numeric', month: 'short' }) + ' ' + y;
    }
    function recHero(v) {
      var h = el.querySelector('#mwHero'), m = el.querySelector('#mwMap'); if (!h || !m) return;
      var L = R.seq.length - 1, i = Math.round(v), at = v > -0.13 && v < L + 0.13 && Math.abs(v - i) < 0.13;
      if (!at || i < 0 || i > L) { h.classList.remove('on'); h._i = -1; return; }
      var q = R.seq[i], t = q.t, W = m.clientWidth, Hh = m.clientHeight, vw = ST.view;
      if (h._i !== i) {
        h._i = i;
        var d = new Date(t.start + 'T12:00:00Z'), meta = t.ref.b.meta, names = ((meta.generated || {}).cities || []).slice(0, 2).join(' · ') || t.title, src = Mapa.photoOf({ ph: t.ref.b.trip.cover }, t.ref.b.photos) || t.cover;
        h.innerHTML = '<span class="mw-h-ph"' + (src ? ' style="background-image:url(&quot;' + esc(src) + '&quot;)"' : '') + '></span><span class="mw-h-t"><small>' + esc(heroDate(t)) + '</small><b>' + esc(names) + '</b></span>';
        h.classList.remove('on'); void h.offsetWidth; h.classList.add('on');
      }
      var cw = h.offsetWidth, ch = h.offsetHeight, x = (q.x - vw[0]) / vw[2] * W, y = (q.y - vw[1]) / vw[3] * Hh;
      h.style.left = Math.max(cw / 2 + 8, Math.min(W - cw / 2 - 50, x)) + 'px';
      h.style.top = Math.max(ch + 8, Math.min(Hh - 6, y - 26)) + 'px';
    }
    function recInfo() {
      var b = el.querySelector('#mwRecInfo'); if (!b) return;
      var v = R.v, L = R.seq.length - 1, key = v <= -0.5 ? 'start' : v > L + 0.5 ? 'end' : 'i' + Math.max(0, Math.round(v));
      if (key === R.key) return; R.key = key;
      if (key === 'start' || key === 'end') {
        var cc = {}; R.seq.forEach(function (q) { (cached(q.t.ref) || []).forEach(function (c) { cc[c] = 1; }); });
        var nt = R.seq.length, nc = Object.keys(cc).length;
        b.className = 'mw-rec-info tx';
        b.innerHTML = key === 'start' ? '<span>Dale a reproducir para recorrer tus viajes en el mapa.</span>' : '<b>' + (ST.year ? ST.year + ' · ' : '') + nt + (nt === 1 ? ' viaje' : ' viajes') + ' · ' + nc + (nc === 1 ? ' país' : ' países') + '</b>';
        return;
      }
      // la foto, el mes y la ciudad van sobre el mapa (recHero): aquí, solo por dónde va y abrir la guía
      var i = Math.max(0, Math.round(v)), t = R.seq[i].t;
      b.className = 'mw-rec-info on';
      b.innerHTML = '<small>' + (i + 1) + ' de ' + R.seq.length + '</small>' + (opt.single ? '' : '<button type="button" class="btn ghost sq" data-open="' + esc(t.id) + '">Abrir la guía</button>');
    }
    function recSet(v, keepSlider) {
      var L = R.seq.length - 1; R.v = v = Math.max(-1, Math.min(L + 1, v));
      if (!keepSlider) { var rg = el.querySelector('#mwRec .map-range'); if (rg) rg.value = v; }
      // se va coloreando: cada país aparece al llegar a él
      var lim = v <= -1 || v > L ? null : v < 0 ? -1 : Math.min(L, Math.floor(v + 0.15));
      var changed = lim !== R.limit; R.limit = lim;
      if (R.follow && R.over) setView(recCam(v));
      if (changed) recolor();
      recPaint(); recInfo();
    }
    function recStop() { R.playing = false; cancelAnimationFrame(R.raf); clearTimeout(R.tm); var b = el.querySelector('#mwRec .map-play'); if (b) b.classList.remove('on'); }
    function recGlide(to, ms, done) {
      cancelAnimationFrame(R.raf);
      var from = R.v, t0 = performance.now();
      if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) { recSet(to); if (done) done(); return; }
      (function step(now) {
        var f = Math.min(1, (now - t0) / ms), e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
        recSet(from + (to - from) * e);
        if (f < 1) R.raf = requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    function recPlay() {
      var L = R.seq.length - 1, n = Math.round(R.v);
      if (n > L) { R.v = -1; n = -1; }
      R.playing = true; R.follow = true; unselectRegion(); el.querySelector('#mwRec .map-play').classList.add('on');
      (function next() {
        if (!R.playing) return;
        if (n > L) { recStop(); return; }
        n++; recGlide(n, n <= 0 || n > L ? 1600 : 2300, function () { R.tm = setTimeout(next, n > L ? 0 : 2400); });
      })();
    }
    function counts() {
      var V = {}, N = {};
      // durante el resumen, solo los viajes a los que ya se ha llegado
      (R.limit === null ? tf() : R.seq.slice(0, R.limit + 1).map(function (q) { return q.t; })).forEach(function (t) {
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
      recPaint();
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
      Array.prototype.forEach.call(s.querySelectorAll('circle[data-c]'), function (c) { c.setAttribute('r', (w / 130).toFixed(2)); });
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
      h += '<g class="mw-labels" text-anchor="middle" dominant-baseline="middle">' + WORLD.map(function (c) { return '<text data-l="' + esc(c.cc) + '" x="' + c.cx.toFixed(1) + '" y="' + c.cy.toFixed(1) + '" style="display:none">' + esc(name(c.cc)) + '</text>'; }).join('') + '</g><g id="mwRecG"></g>';
      m.innerHTML = h + '</svg>';
      var byCc = {}; WORLD.forEach(function (c) { byCc[c.cc] = c; });
      labels = Array.prototype.map.call(m.querySelectorAll('text'), function (t) { return { t: t, c: byCc[t.getAttribute('data-l')] }; });
      gestures(m);
      paintLabels();
      paintInfo();
      recSetup();
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
      m.addEventListener('pointerdown', function (e) { if (e.button) return; P[e.pointerId] = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY }; dragged = false; cancelAnimationFrame(anim); R.follow = false; if (R.playing) recStop(); snapshot(); });
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
      Array.prototype.forEach.call(el.querySelectorAll('#mwMap [data-c]'), function (p) { p.setAttribute('class', klass(p.getAttribute('data-c'), C) + (ST.sel === p.getAttribute('data-c') ? ' sel' : '')); });
      paintLabels(); paintInfo();
    }
    el.onclick = function (e) {
      var t = e.target, yb = t.closest('[data-y]'), ch = t.closest('.mw-chips .opt'), tool = t.closest('[data-mt]');
      if (t.closest('#mwRec .map-play')) { if (R.playing) recStop(); else recPlay(); return; }
      if (t.closest('#pfQuiz')) { openQuizPicker(trips, function () { var qb = el.querySelector('#pfQuizBox'); if (qb) qb.innerHTML = quizCardHTML(trips); var hb = el.querySelector('.pf-hero'); if (hb) { var tmp = document.createElement('div'); tmp.innerHTML = heroHTML(trips, opt.base); hb.replaceWith(tmp.firstChild); } }); return; }
      if (yb) {
        recStop(); R.limit = null; R.v = -1;
        ST.year = yb.getAttribute('data-y');
        Array.prototype.forEach.call(el.querySelectorAll('[data-y]'), function (x) { x.classList.toggle('on', x.getAttribute('data-y') === ST.year); });
        var S1 = statsOf(tf()), box = document.createElement('div'); box.innerHTML = statsHTML(S1);
        el.querySelector('.st-card').replaceWith(box.firstChild);
        var st0 = el.querySelector('#mwStamps'); if (st0) st0.innerHTML = stampsHTML(S1);
        paintList(S1); recSetup(); recolor();
        if (ST.region === 'mine' || !ST.region) { ST.region = 'mine'; Array.prototype.forEach.call(el.querySelectorAll('[data-mw=region] .opt'), function (x) { x.classList.toggle('on', x.getAttribute('data-v') === 'mine'); }); animateTo(viewMine()); }
        return;
      }
      if (ch) {
        var w = ch.parentNode.getAttribute('data-mw'), v = ch.getAttribute('data-v');
        Array.prototype.forEach.call(ch.parentNode.querySelectorAll('.opt'), function (x) { x.classList.toggle('on', x === ch); });
        if (w === 'region') { R.follow = false; recStop(); }
        if (w === 'filter') { ST.filter = v; recolor(); if (ST.region === 'mine') animateTo(viewMine()); } else { ST.region = v; animateTo(targetView(v)); }
        return;
      }
      if (tool) {
        var a = tool.getAttribute('data-mt');
        R.follow = false; recStop();
        if (a === 'in') zoomAt(0.55, 0.5, 0.5, true); else if (a === 'out') zoomAt(1.8, 0.5, 0.5, true);
        else { ST.names = !ST.names; tool.classList.toggle('on', ST.names); tool.setAttribute('aria-pressed', ST.names); paintLabels(); }
        return;
      }
      if (t.closest('#stTog')) {
        ST.stats = !ST.stats; el.querySelector('.st-more').hidden = !ST.stats;
        var tg = el.querySelector('#stTog'); tg.textContent = ST.stats ? 'Ver menos' : 'Ver más'; tg.setAttribute('aria-expanded', ST.stats);
        return;
      }
      if (t.closest('#mwMore')) { ST.more = !ST.more; paintList(statsOf(tf())); return; }
      var c = t.closest('[data-c]');
      if (c) {
        var row = t.closest('.mw-row, .mw-stamp');
        if (dragged && !row) { dragged = false; return; }
        ST.sel = !row && ST.sel === c.getAttribute('data-c') ? '' : c.getAttribute('data-c'); recolor();
        if (row) { focusCountry(ST.sel); var mw = el.querySelector('.mw'); if (mw) mw.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
    };
    el.oninput = function (e) {
      if (!e.target.matches('#mwRec .map-range')) return;
      recStop(); R.follow = true; if (ST.region) unselectRegion(); recSet(+e.target.value, true);
    };
    el.onchange = function (e) {
      if (!e.target.matches('#mwRec .map-range')) return;
      var x = +e.target.value, L = R.seq.length - 1; recGlide(x < -0.5 ? -1 : x > L + 0.5 ? L + 1 : Math.max(0, Math.round(x)), 300);
    };
    if (el._mwOff) el._mwOff();
    el._mwOff = recStop;
    draw();
  }
  return { quizLeft: quizLeft, openQuiz: openQuiz, mount: mount, detect: detect, cached: cached, name: name, flag: flag };
})();
