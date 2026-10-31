/* ===== Motor del asistente: encuentra lo más importante de cada ciudad y lo reparte por días =====
   Solo datos reales y gratis: Wikidata (qué hay), Wikipedia (visitas a su artículo = cuánto interesa a la gente,
   textos y fotos), OpenStreetMap (buscador, restaurantes, miradores), OSRM (tiempos) y Open-Meteo (clima).
   No depende de la interfaz: Motor.generate(spec, step) devuelve el viaje en el mismo formato que Escocia.
   Referencia para medirlo: tests/motor-benchmark.html */
window.Motor = (function () {
  'use strict';
  function ui() { return window.Lang ? Lang.get() : 'es'; }
  // cada viaje se guarda en español (la base) con una capa en inglés (trip_en), igual que Escocia
  function lg() { return 'es'; }
  function tr(x) { return x; }
  function toEn(x) { return window.Lang ? Lang.translate(x, true) : x; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function hm(s) { var p = String(s).split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) { m = Math.round(m); return p2(Math.floor(m / 60) % 24) + ':' + p2(m % 60); }
  function round5(m) { return Math.round(m / 5) * 5; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function km(a, b) {
    var r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  }
  function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* ---------- Red: los servicios gratuitos a veces fallan o se quedan colgados ---------- */
  function fetchT(url, opt, ms) {
    var c = window.AbortController ? new AbortController() : null, t = c ? setTimeout(function () { c.abort(); }, ms) : 0;
    opt = opt || {}; if (c) opt.signal = c.signal;
    return fetch(url, opt).then(function (r) { clearTimeout(t); return r; }, function (e) { clearTimeout(t); throw e; });
  }
  function getJSON(url, opt, ms) {
    return fetchT(url, opt, ms || 25000).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status + ' · ' + url.split('?')[0]); return r.json(); });
  }
  // Nominatim pide como mucho una petición por segundo
  var nomLast = 0;
  function nominatim(params) {
    var wait = Math.max(0, nomLast + 1100 - Date.now()); nomLast = Date.now() + wait;
    return sleep(wait).then(function () {
      return getJSON('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&extratags=1&accept-language=' + ui() + '&' + params);
    });
  }
  var OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
  function overpass(q, k) {
    k = k || 0;
    return fetchT(OVERPASS[k], { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 14000)
      .then(function (r) { if (!r.ok) throw new Error('Overpass ' + r.status); return r.json(); })
      .catch(function (err) { if (k + 1 < OVERPASS.length) return sleep(500).then(function () { return overpass(q, k + 1); }); throw err; });
  }
  function sparql(q, tries) {
    tries = tries || 0;
    // Wikidata a veces corta la respuesta a medias y el navegador la guarda así: al reintentar, sin caché
    var opt = { headers: { Accept: 'application/sparql-results+json' } }; if (tries) opt.cache = 'reload';
    return fetchT('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), opt, 50000)
      .then(function (r) {
        if ((r.status === 429 || r.status >= 500) && tries < 2) return sleep(4000).then(function () { return sparql(q, tries + 1); });
        if (!r.ok) throw new Error('Wikidata ' + r.status); return r.json();
      }).catch(function (e) { if (tries < 2) return sleep(3000).then(function () { return sparql(q, tries + 1); }); throw e; });
  }
  // varias tareas a la vez, sin saturar
  function pool(list, n, fn) {
    var i = 0;
    function worker() { if (i >= list.length) return Promise.resolve(); var k = i++; return Promise.resolve(fn(list[k], k)).catch(function () {}).then(worker); }
    var w = []; for (var j = 0; j < n; j++) w.push(worker());
    return Promise.all(w);
  }

  /* ---------- Qué tipo de sitio es: se decide por las clases de Wikidata, en inglés, para que valga en cualquier país ---------- */
  // d = minutos de visita (mín. para un sitio menor, máx. para uno muy famoso), cat = gusto al que pertenece
  var KINDS = {
    palace: { re: /castle|fortress|\bfort\b|citadel|palace|ch[aâ]teau|alc[aá]zar|kasbah|stately home|imperial residence/, t: 'visit', cat: 'palaces', d: [40, 90], icon: 'castle' },
    museum: { re: /museum|art gallery|national gallery|planetarium|science cent|exhibition cent|pinacoteca/, t: 'visit', cat: 'museums', d: [45, 120], icon: 'castle', rain: 1 },
    sacred: { re: /cathedral|basilica|\bchurch|temple|shrine|mosque|synagogue|monastery|abbey|pagoda|madrasa|madrassa|medersa|\bchapel|\bminster|buddhist|shinto|hindu|\bcloister/, t: 'visit', cat: 'sacred', d: [20, 70], icon: 'castle', rain: 1 },
    ruins: { re: /archaeological|ruin|ancient roman|amphitheat|\btomb|necropolis|mausoleum|acropolis|roman theat|thermae|\bcemetery|burial/, t: 'visit', cat: 'ruins', d: [25, 80], icon: 'castle', out: 1 },
    quarter: { re: /historic cent|historic district|old town|old city|\bmedina\b|neighbou?rhood|\bquarter\b|historic site|heritage site|\bcanal|waterway|bairro/, t: 'walk', cat: 'quarters', d: [35, 75], icon: 'pin', out: 1 },
    square: { re: /\bsquare\b|\bplaza\b|piazza|pedestrian|shopping street|\bstreet\b|boulevard|avenue|promenade|commercial gallery|shopping arcade|\barcade\b|galleria/, t: 'walk', cat: 'quarters', d: [15, 45], icon: 'pin', out: 1 },
    market: { re: /\bmarket\b|\bsouk\b|bazaar|food hall/, t: 'walk', cat: 'markets', d: [30, 70], icon: 'shop' },
    monument: { re: /monument|memorial|\bstatue|sculpture|triumphal|\barch\b|obelisk|fountain|\btower\b|city gate|\bgate\b|\bbridge\b|lighthouse|skyscraper|observation|colossal|building complex|elevator|funicular|cable car|aerial tramway|bullring|bull ring/, t: 'walk', cat: 'monuments', d: [15, 50], icon: 'pin', out: 1 },
    show: { re: /opera house|\btheat(er|re)\b|concert hall|music venue|stadium|arena|sports venue|\bcinema\b/, t: 'walk', cat: 'shows', d: [15, 45], icon: 'pin', rain: 1 },
    garden: { re: /\bpark\b|garden|botanical|arboretum|forest/, t: 'walk', cat: 'parks', d: [30, 70], icon: 'pin', out: 1 },
    nature: { re: /waterfall|mountain|\bpeak\b|\bhill\b|\blake\b|\bbeach\b|national park|nature reserve|\bisland\b|viewpoint|canyon|glacier|gorge|\bcave\b|volcano|\bcliff|\bbay\b|\bdesert\b/, t: 'view', cat: 'nature', d: [40, 90], icon: 'mountain', out: 1, photo: 1 },
    family: { re: /\bzoo\b|amusement|theme park|aquarium|water park/, t: 'visit', cat: 'family', d: [120, 240], icon: 'pin' }
  };
  var KIND_ORDER = ['family', 'museum', 'sacred', 'palace', 'ruins', 'market', 'show', 'garden', 'nature', 'square', 'monument', 'quarter'];
  // lo que nunca es una visita, aunque también tenga otra clase
  var NEVER = /\b(university|college|school|company|business|enterprise|brand|fashion house|manufacturer|airline|railway station|railway line|railway company|rapid transit|metro|subway|train station|bus station|airport|hospital|embassy|consulate|bank|stock exchange|hotel|government|race track|racing circuit|street circuit|motorsport|ministry|parliament of|political|organi[sz]ation|publisher|newspaper|television|radio|sports (club|team)|football club|military unit|rebellion|battle|war|revolution|olympic|festival|recurring event|sporting event|tournament|film|novel|book|album|song)\b/;
  var PLACE = /\b(city|town|village|big city|metropolis|municipality|comune|commune|capital|prefecture|ward|borough|province|county|region|state|country|republic|kingdom|duchy|empire|sovereign|administrative|census|river|human settlement|former|metropolitan|arrondissement|sestiere)\b/;
  var ART = /\b(painting|fresco|wall painting|mural|work of art)\b/;
  function classify(types) {
    var s = types.toLowerCase(), k = null;
    if (ART.test(s)) return 'art';
    KIND_ORDER.some(function (x) { if (KINDS[x].re.test(s)) { k = x; return true; } return false; });
    if (!k && /tourist attraction|tourist destination|landmark|architectural structure/.test(s)) k = 'monument';
    if (NEVER.test(s) && (!k || k === 'monument' || k === 'quarter')) return null;
    // ciudades, regiones: fuera, salvo que también sean claramente un sitio que se visita (p. ej. ciudadela, ruinas)
    if (PLACE.test(s) && (!k || k === 'quarter' || k === 'monument' || k === 'square')) return null;
    return k;
  }

  /* ---------- Importancia: lo que más interesa de verdad a la gente ---------- */
  var FOUND = {}, STOP = /^(de|del|la|las|el|los|da|do|di|dos|du|le|the|of|and|y|san|santa|santo|saint|st|sao|plaza|piazza|praca|iglesia|chiesa|igreja|church|basilica|catedral|cathedral|museo|museum|palacio|palazzo|palace|castillo|castle|torre|tower|parque|park|jardin|jardines|garden|gardens|puente|bridge|mezquita|templo|temple|santuario|shrine|monumento|monument|center|centre|centro|building|edificio|nacional|national|real|royal|grand|gran|nueva|nuevo|new)$/;
  function tokens(n) { return slug(n).split('-').filter(function (t) { return t.length > 2 && !STOP.test(t); }); }
  function sightsQuery(c, rKm, minLinks) {
    return 'SELECT ?item (SAMPLE(?les) AS ?es) (SAMPLE(?len) AS ?en) (SAMPLE(?coord) AS ?c) (MAX(?links) AS ?n) (SAMPLE(?img) AS ?image) (SAMPLE(?web) AS ?site) (MAX(?vis) AS ?visitors) (MAX(?her) AS ?unesco)' +
      " (GROUP_CONCAT(DISTINCT ?tl; separator='|') AS ?types) WHERE {" +
      ' SERVICE wikibase:around { ?item wdt:P625 ?coord. bd:serviceParam wikibase:center "Point(' + c.lon.toFixed(4) + ' ' + c.lat.toFixed(4) + ')"^^geo:wktLiteral. bd:serviceParam wikibase:radius "' + rKm + '". }' +
      ' ?item wikibase:sitelinks ?links. FILTER(?links >= ' + minLinks + ')' +
      " ?item wdt:P31 ?t. ?t rdfs:label ?tl. FILTER(LANG(?tl) = 'en')" +
      " OPTIONAL { ?item rdfs:label ?les. FILTER(LANG(?les) = 'es') } OPTIONAL { ?item rdfs:label ?len. FILTER(LANG(?len) = 'en') }" +
      ' OPTIONAL { ?item wdt:P18 ?img. } OPTIONAL { ?item wdt:P856 ?web. } OPTIONAL { ?item wdt:P1174 ?vis. } OPTIONAL { ?item wdt:P1435 wd:Q9259. BIND(1 AS ?her) }' +
      '} GROUP BY ?item ORDER BY DESC(?n) LIMIT 600';
  }
  function radiusOf(city) {
    var r = 8;
    if (city.r) return city.r;   // en coche se llega más lejos
    if (city.bb) r = km({ lat: city.bb[0], lon: city.bb[2] }, { lat: city.bb[1], lon: city.bb[3] }) / 2;
    return clamp(Math.round(r), 7, 16);
  }
  function rowsToSights(j) {
    return (j.results.bindings || []).map(function (b) {
      var m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(b.c.value), types = b.types.value, kind = classify(types);
      return { wd: b.item.value.split('/').pop(), n: ((lg() === 'en' ? b.en || b.es : b.es || b.en) || {}).value, en: (b.en || {}).value, lat: m ? +m[2] : null, lon: m ? +m[1] : null, links: +b.n.value, kind: kind, types: types,
        img: b.image ? b.image.value.replace(/^http:/, 'https:') + '?width=800' : '', web: b.site ? b.site.value : '', visitors: b.visitors ? +b.visitors.value : 0, unesco: !!b.unesco };
    }).filter(function (x) { return x.n && x.kind && x.lat != null && !/^Q\d+$/.test(x.n); });
  }
  function articles(ids) {
    var out = {}, batches = [];
    for (var i = 0; i < ids.length; i += 50) batches.push(ids.slice(i, i + 50));
    return pool(batches, 2, function (b) {
      return getJSON('https://www.wikidata.org/w/api.php?action=wbgetentities&props=sitelinks&format=json&origin=*&ids=' + b.join('|')).then(function (j) {
        Object.keys(j.entities || {}).forEach(function (q) { var sl = (j.entities[q] || {}).sitelinks || {}; out[q] = { es: sl.eswiki && sl.eswiki.title, en: sl.enwiki && sl.enwiki.title }; });
      });
    }).then(function () { return out; });
  }
  // visitas al artículo de Wikipedia en los últimos 12 meses (media mensual)
  function pageviews(lang, title) {
    var d = new Date(), to = d.getUTCFullYear() + p2(d.getUTCMonth() + 1) + '0100', from = (d.getUTCFullYear() - 1) + p2(d.getUTCMonth() + 1) + '0100';
    function go(tries) {
      return fetchT('https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/' + lang + '.wikipedia.org/all-access/user/' + encodeURIComponent(title.replace(/ /g, '_')) + '/monthly/' + from + '/' + to, null, 12000).then(function (r) {
        if (r.status === 429 && tries < 3) return sleep(1500 * (tries + 1)).then(function () { return go(tries + 1); });
        if (!r.ok) return null;
        return r.json().then(function (j) { var a = j.items || []; return a.length ? a.reduce(function (s, x) { return s + x.views; }, 0) / a.length : 0; });
      });
    }
    return go(0);
  }
  // sitios conocidos de una ciudad, de más a menos importante
  function discover(city) {
    var key = city.lat.toFixed(3) + ',' + city.lon.toFixed(3) + ',' + (city.r || '');
    if (FOUND[key]) return FOUND[key];
    var r = radiusOf(city);
    // si la lista completa no llega entera, una más corta: la ordena por fama, así que lo importante sigue dentro
    function ask(minL) { var q = sightsQuery(city, r, minL); return sparql(q).catch(function () { return sparql(q.replace('LIMIT 600', 'LIMIT 250')); }); }
    var pr = ask(8).then(rowsToSights).then(function (a) {
      // ciudad pequeña: se baja el listón
      return a.length >= 18 ? a : ask(3).then(rowsToSights);
    }).then(function (all) {
      var cityName = slug(city.name), arts = all.filter(function (x) { return x.kind === 'art'; });
      var list = all.filter(function (x) { return x.kind !== 'art' && slug(x.n) !== cityName && !(x.kind === 'ruins' && PLACE.test(x.types.toLowerCase()) && km(city, x) < 4); });
      if (!list.length) return [];
      list.forEach(function (x) { x.dist = km(city, x); });
      // una estatua pegada a un museo o iglesia es parte de la visita
      list = list.filter(function (x) {
        if (x.kind !== 'monument' || !/sculpture|statue/i.test(x.types) || !list.some(function (o) { return o !== x && KINDS[o.kind].t === 'visit' && km(o, x) < (o.kind === 'museum' ? 0.35 : 0.12); })) return true;
        arts.push(x); return false;
      });
      // las 120 con más Wikipedias se comparan por visitas reales
      var top = list.slice().sort(function (a, b) { return b.links - a.links; }).slice(0, 120);
      return articles(top.map(function (x) { return x.wd; })).catch(function () { return {}; }).then(function (ar) {
        return pool(top, 5, function (x) {
          var a = ar[x.wd] || {}, first = lg() === 'en' ? ['en', 'es'] : ['es', 'en']; x.wiki = a[first[0]] ? [first[0], a[first[0]]] : a[first[1]] ? [first[1], a[first[1]]] : null;
          var lang = a.en ? 'en' : a.es ? 'es' : null; if (!lang) return;
          return pageviews(lang, a.en || a.es).then(function (v) { x.views = lang === 'en' ? v : v * 3; });
        });
      }).then(function () {
        var kept = list.filter(function (x) { return top.indexOf(x) >= 0; });
        var maxV = Math.max.apply(null, kept.map(function (x) { return Math.log10(1 + (x.views || 0)); }).concat([1]));
        var maxL = Math.max.apply(null, kept.map(function (x) { return Math.log10(1 + x.links); }).concat([1]));
        var someV = kept.some(function (x) { return x.views; });
        kept.forEach(function (x) {
          var zl = Math.log10(1 + x.links) / maxL, zv = x.views ? Math.log10(1 + x.views) / maxV : someV ? zl * 0.8 : zl;   // si Wikipedia no responde, se estima
          x.fame = 0.62 * zv + 0.38 * zl;
          // los estadios y pabellones tienen muchas visitas por el deporte, no por turismo
          if (/stadium|arena|sports venue|indoor/i.test(x.types)) x.fame *= 0.72;
          // rascacielos y plazas sin más: se leen mucho, pero no suelen ser el motivo del viaje
          if (/skyscraper|office/i.test(x.types) && (x.views || 0) < 40000) x.fame *= 0.86;
          if (x.kind === 'square' && (x.views || 0) < 20000 && !/pedestrian|tourist|commercial|arcade|cathedral square/i.test(x.types)) x.fame *= 0.9;
          if (x.kind === 'quarter' && !/historic|old town|old city|medina|heritage/i.test(x.types)) x.fame *= 0.92;
          if (/tourist attraction|tourist destination|landmark/i.test(x.types)) x.fame += 0.05;
          if (x.unesco) x.fame += 0.06;
          if (x.visitors) x.fame += 0.04;
          // una obra famosa dentro de un sitio le da su fama (La última cena, la Gioconda…)
          arts.forEach(function (w) { if (km(x, w) < 0.12 && /visit/.test(KINDS[x.kind].t)) { x.fame += Math.min(0.12, w.links / 800); (x.art = x.art || []).push(w.n); } });
          if (x.dist > r * 0.75) x.fame -= 0.04;
        });
        kept.sort(function (a, b) { return b.fame - a.fame; });
        // un mismo sitio con dos fichas (el palacio y su museo): se queda la más importante
        var out = [], cityT = tokens(city.name);
        kept.forEach(function (x) {
          var tx = tokens(x.n).filter(function (t) { return cityT.indexOf(t) < 0; });
          if (!out.some(function (o) { var d = km(o, x); return d < 0.07 || (d < 0.35 && tx.some(function (t) { return tokens(o.n).indexOf(t) >= 0; })); })) out.push(x);
        });
        return out;
      });
    });
    pr.catch(function () { delete FOUND[key]; });
    FOUND[key] = pr;
    return pr;
  }


  /* ---------- Buscadores para el asistente ---------- */
  function hitToPlace(h) {
    var a = h.address || {};
    return { name: h.name || h.display_name.split(',')[0], full: h.display_name, lat: +h.lat, lon: +h.lon, bb: (h.boundingbox || []).map(Number), cc: (a.country_code || '').toUpperCase(), country: a.country || '', wd: (h.extratags || {}).wikidata || '', type: h.addresstype || h.type || '' };
  }
  function searchCountry(q) {
    return nominatim('limit=5&featureType=country&q=' + encodeURIComponent(q)).then(function (r) { return r.map(hitToPlace); });
  }
  function searchCity(q, cc) {
    return nominatim('limit=8&' + (cc ? 'countrycodes=' + cc.toLowerCase() + '&' : '') + 'q=' + encodeURIComponent(q)).then(function (r) {
      var ok = r.filter(function (h) { return /^(city|town|village|municipality|county|state|region|province|island|suburb|neighbourhood|archipelago|administrative)$/.test(h.addresstype || h.type || ''); });
      return (ok.length ? ok : r).slice(0, 6).map(hitToPlace);
    });
  }
  // las ciudades más conocidas de un país (por número de Wikipedias)
  var SUG = {};
  function suggestCities(countryWd) {
    if (!countryWd) return Promise.resolve([]);
    if (SUG[countryWd]) return SUG[countryWd];
    SUG[countryWd] = fetchCities(countryWd);
    SUG[countryWd].catch(function () { delete SUG[countryWd]; });
    return SUG[countryWd];
  }
  function fetchCities(countryWd) {
    var q = 'SELECT ?c (SAMPLE(?les) AS ?es) (SAMPLE(?len) AS ?en) (SAMPLE(?co) AS ?p) (MAX(?n0) AS ?n) (SAMPLE(?img) AS ?image) WHERE { ?c wdt:P17 wd:' + countryWd + '; wdt:P31/wdt:P279* wd:Q515; wikibase:sitelinks ?n0; wdt:P625 ?co. FILTER(?n0 > 25)' +
      " OPTIONAL { ?c rdfs:label ?les. FILTER(LANG(?les) = 'es') } OPTIONAL { ?c rdfs:label ?len. FILTER(LANG(?len) = 'en') } OPTIONAL { ?c wdt:P18 ?img. } } GROUP BY ?c ORDER BY DESC(?n) LIMIT 12";
    return sparql(q).then(function (j) {
      return (j.results.bindings || []).map(function (b) {
        var m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(b.p.value);
        return { name: ((ui() === 'en' ? b.en || b.es : b.es || b.en) || {}).value, lat: m ? +m[2] : null, lon: m ? +m[1] : null, img: b.image ? b.image.value.replace(/^http:/, 'https:') + '?width=480' : '', links: +b.n.value };
      }).filter(function (x) { return x.name && x.lat != null && !/^Q\d+$/.test(x.name); });
    });
  }
  function wikiSummary(lang, title) {
    return getJSON('https://' + lang + '.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title.replace(/ /g, '_'))).catch(function () { return null; });
  }
  function firstSentences(t, n) { var c = String(t), c0; do { c0 = c; c = c.replace(/\s*\([^()]*\)/g, ''); } while (c !== c0); var m = c.replace(/\s*\([^)]*$/, '').replace(/\s*\(,/g, ',').match(/[^.!?]+[.!?]+/g); return m ? m.slice(0, n).join('').trim() : String(t).slice(0, 220); }
  // una foto bonita de un sitio (la de su artículo de Wikipedia)
  function photoOf(title) {
    return wikiSummary('en', title).then(function (s) { return s && s.thumbnail ? s.thumbnail.source : ''; });
  }
  function placeInfo(name) {
    var L0 = ui() === 'en' ? ['en', 'es'] : ['es', 'en'];
    return wikiSummary(L0[0], name).then(function (s) { return s && s.extract && s.type !== 'disambiguation' ? s : wikiSummary(L0[1], name); }).then(function (s) {
      return s ? { text: firstSentences(s.extract || '', 2), img: s.originalimage ? (s.thumbnail || s.originalimage).source.replace(/\/\d+px-/, '/800px-') : '' } : null;
    });
  }

  /* ---------- Ritmo y reparto del día ---------- */
  // cap = minutos de visitas al día; max = paradas; slow: tiempo para bares y comer
  var PACE = { slow: { cap: 210, max: 3, lunch: 90, dinner: 120, cafe: 1, drinks: 1 }, normal: { cap: 330, max: 5, lunch: 75, dinner: 90, drinks: 0 }, fast: { cap: 450, max: 8, lunch: 50, dinner: 75, drinks: 0 } };
  // horas: start = salida, amEnd = fin de la mañana, lunch, pm = primera visita de la tarde, pmEnd, dinner
  var STYLE = {
    morning: { start: '08:30', amEnd: '14:00', lunch: '14:00', pm: '16:00', pmEnd: '18:00', dinner: '20:00', share: 1 },
    afternoon: { start: '10:30', amEnd: '13:30', lunch: '14:00', pm: '15:30', pmEnd: '20:30', dinner: '21:15', share: 0.3 },
    spread: { start: '09:30', amEnd: '13:15', lunch: '13:30', pm: '15:30', pmEnd: '19:30', dinner: '20:45', share: 0.5 }
  };
  function dwell(x) {
    var d = KINDS[x.kind].d;
    return Math.max(10, round5(d[0] + (d[1] - d[0]) * clamp((x.fame - 0.5) / 0.45, 0, 1)));
  }
  function moveMin(a, b, o) {
    var k = km(a, b), speed = o.mode === 'car' ? 32 : 4.5;
    if (o.mode !== 'car' && k > 3) return round5(k * 1.3 / 16 * 60 + 8);   // lejos: transporte público
    return round5(k * 1.3 / speed * 60 + (o.mode === 'car' && k > 1 ? 8 : 0));
  }

  /* ---------- Elegir: primero lo imprescindible; después, según gustos, variedad y que quede a mano ---------- */
  function catOf(x) { return /stadium|arena|sports venue/i.test(x.types) ? 'sports' : KINDS[x.kind].cat; }
  function nicho(x, ints) { return (x.kind === 'family' || catOf(x) === 'sports') && !(ints || {})[catOf(x)]; }
  function gustosPeso(x, ints) {
    var has = Object.keys(ints || {}).length;
    if (!has) return 1;
    return ints[catOf(x)] ? 1.22 : 0.92;
  }
  function pickSights(list, capMin, maxN, ints, mustN) {
    var chosen = [], left = list.slice(), byKind = {}, used = 0;
    function take(x) { chosen.push(x); left.splice(left.indexOf(x), 1); byKind[x.kind] = (byKind[x.kind] || 0) + 1; used += dwell(x) + 12; }
    // lo más importante entra siempre, tengas los gustos que tengas (salvo lo que es de un nicho muy concreto)
    list.filter(function (x) { return !nicho(x, ints); }).slice(0, mustN).forEach(take);
    while (left.length && chosen.length < maxN && used < capMin) {
      var best = null, bs = -1;
      left.forEach(function (x) {
        var s = x.fame * gustosPeso(x, ints) * Math.pow(0.93, byKind[x.kind] || 0);
        if (nicho(x, ints)) s *= 0.6;
        if (chosen.some(function (c) { return km(c, x) < 0.7; })) s += 0.07;   // a un paso de otra parada: se aprovecha el paseo
        if (s > bs) { bs = s; best = x; }
      });
      if (!best || bs < 0.28) break;
      take(best);
    }
    return { chosen: chosen, left: left };
  }

  /* ---------- Agrupar por zonas: cada día, una zona; así no se cruza la ciudad varias veces ---------- */
  function clusterDays(sights, caps, o) {
    var k = caps.length, res = caps.map(function () { return []; });
    if (!sights.length) return res;
    if (k === 1) { res[0] = sights.slice(); return res; }
    function load(g) { return g.reduce(function (s, x) { return s + dwell(x) + 12; }, 0); }
    function link(a, b) { var s = 0; a.forEach(function (x) { b.forEach(function (y) { s += km(x, y); }); }); return s / (a.length * b.length); }
    var maxCap = Math.max.apply(null, caps) * 1.1, groups = sights.map(function (x) { return [x]; });
    // se unen los dos grupos más cercanos mientras quepan en un día
    while (groups.length > k) {
      var best = null, bd = 1e9;
      for (var i = 0; i < groups.length; i++) for (var j = i + 1; j < groups.length; j++) {
        var d = link(groups[i], groups[j]), over = load(groups[i]) + load(groups[j]) > maxCap;
        if (over) d += 1000;   // solo si no queda otra
        if (d < bd) { bd = d; best = [i, j]; }
      }
      groups[best[0]] = groups[best[0]].concat(groups[best[1]]); groups.splice(best[1], 1);
    }
    // el grupo más grande, al día con más tiempo
    groups.sort(function (a, b) { return load(b) - load(a); });
    var order = caps.map(function (c, i) { return { c: c, i: i }; }).sort(function (a, b) { return b.c - a.c || a.i - b.i; });
    order.forEach(function (d, j) { d.g = groups[j] || []; });
    // si un día se pasa de tiempo o de paradas, lo más alejado de su grupo pasa al día con hueco más cercano
    var maxStops = (o && o.maxStops) || 8;
    for (var guard = 0; guard < 40; guard++) {
      var ov = order.filter(function (d) { return d.g.length > 1 && (load(d.g) > d.c * 1.05 || d.g.length > maxStops); }).sort(function (a, b) { return (load(b.g) - b.c) - (load(a.g) - a.c); })[0];
      if (!ov) break;
      var mv = null, to = null, cost = 1e9;
      ov.g.forEach(function (x) {
        var rest = ov.g.filter(function (y) { return y !== x; });
        order.forEach(function (d) {
          if (d === ov || load(d.g) + dwell(x) + 12 > d.c * 1.05 || d.g.length >= maxStops) return;
          var dist0 = d.g.length ? link([x], d.g) : 1, c = dist0 - link([x], rest);
          if (c < cost) { cost = c; mv = x; to = d; }
        });
      });
      if (!mv) break;
      ov.g.splice(ov.g.indexOf(mv), 1); to.g.push(mv);
    }
    order.forEach(function (d) { res[d.i] = d.g; });
    return res;
  }
  // rellena los días con hueco con lo mejor que quede cerca, para que ningún día se quede a medias
  function fillDays(groups, caps, left, center, ints, maxN) {
    groups.forEach(function (g, i) {
      var c = g.length ? { lat: g.reduce(function (s, x) { return s + x.lat; }, 0) / g.length, lon: g.reduce(function (s, x) { return s + x.lon; }, 0) / g.length } : center;
      function load() { return g.reduce(function (s, x) { return s + dwell(x) + 12; }, 0); }
      while (load() < caps[i] * 0.8 && g.length < maxN && left.length) {
        var best = null, bs = -1e9;
        left.forEach(function (x) { if (nicho(x, ints)) return; var s = x.fame * gustosPeso(x, ints) - 0.04 * km(c, x); if (s > bs) { bs = s; best = x; } });
        if (!best) break;
        g.push(best); left.splice(left.indexOf(best), 1);
      }
    });
  }
  // orden del día: vecino más cercano y 2-opt, saliendo y volviendo al alojamiento
  function orderStops(stops, S, E) {
    var left = stops.slice(), out = [], cur = S;
    while (left.length) {
      var b = left[0], bd = 1e9;
      left.forEach(function (x) { var d = km(cur, x); if (d < bd) { bd = d; b = x; } });
      out.push(b); left.splice(left.indexOf(b), 1); cur = b;
    }
    function len(a) { var s = km(S, a[0]) + km(a[a.length - 1], E); for (var i = 1; i < a.length; i++) s += km(a[i - 1], a[i]); return s; }
    for (var pass = 0, imp = true; imp && pass < 6; pass++) {
      imp = false;
      for (var i = 0; i < out.length - 1; i++) for (var j = i + 1; j < out.length; j++) {
        var t = out.slice(0, i).concat(out.slice(i, j + 1).reverse(), out.slice(j + 1));
        if (len(t) < len(out) - 0.01) { out = t; imp = true; }
      }
    }
    // misma ruta en sentido contrario: se elige la que deja lo más famoso antes (menos colas y, si falta tiempo, no se pierde)
    function early(a) { return a.reduce(function (s, x, i) { return s + (x.fame || 0) * (a.length - i); }, 0); }
    var rev = out.slice().reverse();
    if (km(S, rev[0]) + km(rev[rev.length - 1], E) <= km(S, out[0]) + km(out[out.length - 1], E) + 1.5 && early(rev) > early(out)) out = rev;
    return out;
  }

  /* ---------- Plan del viaje ---------- */
  function buildPlan(sp, cityData) {
    var P = Object.assign({}, PACE[sp.pace] || PACE.normal), ST = STYLE[sp.style] || STYLE.spread, o = { mode: sp.mode }, days = [], dayNo = 0, nDays = 0;
    if ((sp.ints || {}).food) { P.drinks = 1; P.lunch += 15; }
    sp.stops.forEach(function (c) { nDays += c.days; });
    sp.stops.forEach(function (c, ci) {
      var data = cityData[ci], caps = [], firstDay = dayNo, prev = sp.stops[ci - 1];
      for (var k = 0; k < c.days; k++) {
        var abs = firstDay + k, cap = P.cap;
        var win = hm(ST.pmEnd) - hm(ST.start) - P.lunch;
        cap = Math.min(cap, win);
        if (k === 0 && prev) cap = Math.max(0, cap - (sp.mode === 'car' ? km(prev, c) / 70 * 60 : legMinutes(km(prev, c)) + 60));
        if (abs === 0 && sp.fin && sp.fin.t) cap = Math.min(cap, Math.max(0, hm(ST.pmEnd) - hm(sp.fin.t) - 90 - P.lunch * (hm(sp.fin.t) < hm(ST.lunch) ? 1 : 0)));
        if (abs === nDays - 1 && sp.fout && sp.fout.t) cap = Math.min(cap, Math.max(0, hm(sp.fout.t) - 180 - hm(ST.start) - (hm(sp.fout.t) - 180 > hm(ST.lunch) ? P.lunch : 0)));
        caps.push(Math.max(0, cap));
      }
      var totalCap = caps.reduce(function (s, x) { return s + x; }, 0), maxN = Math.max(1, Math.round(totalCap / P.cap * P.max * 1.1));
      var fixedHere = (sp.fixed || []).filter(function (f) { return f.pt && f.day >= firstDay && f.day < firstDay + c.days; });
      var mustN = Math.min(maxN, Math.max(2, Math.ceil(c.days * Math.min(P.max, 4))));
      var pick = pickSights(data, totalCap, maxN, sp.ints, mustN);
      var groups = clusterDays(pick.chosen, caps, { maxStops: P.max + 1 });
      fillDays(groups, caps, pick.left, c, sp.ints, P.max + 1);
      var C = { lat: c.lat, lon: c.lon, name: c.stay || '', town: c.name };
      var stayPt = c.stayPt || C;
      groups.forEach(function (g, k) {
        var abs = firstDay + k, dayFixed = fixedHere.filter(function (f) { return f.day === abs; });
        var fs = dayFixed.map(function (f) { return { n: f.n, lat: f.pt.lat, lon: f.pt.lon, kind: 'museum', fame: 0.7, types: '', fixedAt: f.at, links: 0, wd: null }; });
        var startP = k === 0 && prev ? stayPt : stayPt;
        var order = g.length ? orderStops(g, startP, stayPt) : [];
        days.push(scheduleDay(order, fs, { abs: abs, k: k, city: c, ci: ci, stay: stayPt, prev: k === 0 ? prev : null, P: P, ST: ST, sp: sp, o: o, nDays: nDays, last: abs === nDays - 1, cap: caps[k], moved: k === 0 && !!prev }));
      });
      // alternativas de cada día: lo mejor que no se ha usado, cerca
      groups.forEach(function (g, k) {
        var d = days[firstDay + k], ctr = g.length ? g[0] : c;
        d.extras = pick.left.slice().sort(function (a, b) { return (b.fame - 0.03 * km(ctr, b)) - (a.fame - 0.03 * km(ctr, a)); }).slice(0, 6);
        d.extras.forEach(function (x) { pick.left.splice(pick.left.indexOf(x), 1); });
      });
      dayNo += c.days;
    });
    return days;
  }
  function legMinutes(k) { return k < 700 ? round5(k / 95 * 60 + 40) : round5(k / 700 * 60 + 190); }

  // decide qué va por la mañana y qué por la tarde, y a qué hora
  function scheduleDay(order, fixedStops, c) {
    var P = c.P, ST = c.ST, sp = c.sp, o = c.o, amCap, pmCap, start = hm(ST.start);
    if (c.abs === 0 && sp.fin && sp.fin.t) start = Math.max(start, hm(sp.fin.t) + (sp.mode === 'car' ? 110 : 85));
    if (c.moved && sp.mode !== 'car') start = Math.max(start, hm(ST.start) + 45 + legMinutes(km(c.prev, c.city)) + 20);
    if (c.moved && sp.mode === 'car') start = Math.max(start, hm(ST.start) + 30 + km(c.prev, c.city) / 70 * 60);
    amCap = Math.max(0, hm(ST.amEnd) - start); pmCap = Math.max(0, hm(ST.pmEnd) - Math.max(hm(ST.pm), start));
    if (c.last && sp.fout && sp.fout.t) pmCap = Math.min(pmCap, Math.max(0, hm(sp.fout.t) - 180 - hm(ST.pm)));
    var mins = order.map(function (x) { return dwell(x); }), walk = order.map(function (x, i) { return i ? moveMin(order[i - 1], x, o) : 0; });
    var total = mins.reduce(function (s, v) { return s + v; }, 0) + walk.reduce(function (s, v) { return s + v; }, 0);
    // cuánto de la mañana: «mañana» todo lo que quepa; si no, en proporción al estilo
    var want = ST.share >= 1 ? amCap : Math.min(amCap, Math.max(total * ST.share, 45));
    var split = 0, used = 0;
    for (var i = 0; i < order.length; i++) {
      var add = mins[i] + walk[i];
      if (used + add <= amCap && (ST.share >= 1 || used + add / 2 <= want)) { used += add; split = i + 1; } else break;
    }
    // si en la tarde no cabe todo, la mañana se llena hasta donde pueda
    var pmTotal = total - used;
    while (split < order.length && pmTotal > pmCap && used + mins[split] + walk[split] <= amCap) { used += mins[split] + walk[split]; pmTotal -= mins[split] + walk[split]; split++; }
    // sobra tiempo: se alargan un poco las visitas, sin pasar del máximo razonable
    function stretch(a, b, room) {
      var seg = order.slice(a, b), s0 = seg.reduce(function (s, x) { return s + dwell(x); }, 0);
  var f = s0 ? clamp(1 + room / s0, 1, 1.2) : 1;
      seg.forEach(function (x) { x.dd = Math.max(dwell(x), Math.min(round5(dwell(x) * f), KINDS[x.kind].d[1])); });
    }
    order.forEach(function (x) { x.dd = dwell(x); });
    if (ST.share < 1 || split === order.length) stretch(0, split, Math.max(0, amCap - used - 15));
    if (split < order.length) stretch(split, order.length, Math.max(0, pmCap - pmTotal - 15));
    return { abs: c.abs, k: c.k, city: c.city, ci: c.ci, stay: c.stay, prev: c.prev, moved: c.moved, last: c.last, ST: ST, P: P, start: c.moved || (c.abs === 0 && sp.fin && sp.fin.t) ? hm(ST.start) : start, arrive: start, am: order.slice(0, split), pm: order.slice(split), fixed: fixedStops, stops: order.concat(fixedStops) };
  }

  /* ---------- De los resultados a los datos que entiende la guía (mismo formato que Escocia) ---------- */
  var CURRENCY = { GB: ['£', 'p'], US: ['$', '¢'], CH: ['CHF ', 'rp'], NO: ['kr ', 'øre'], SE: ['kr ', 'öre'], DK: ['kr ', 'øre'], IS: ['kr ', ''], CZ: ['Kč ', ''], PL: ['zł ', 'gr'], HU: ['Ft ', ''], JP: ['¥', ''], MA: ['DH ', ''], TR: ['₺', ''], CA: ['$', '¢'], AU: ['$', '¢'], MX: ['$', '¢'], TH: ['฿', ''], VN: ['₫', ''], IN: ['₹', ''], CN: ['¥', ''], KR: ['₩', ''], BR: ['R$', ''], AR: ['$', ''], EG: ['E£', ''], ZA: ['R', ''], NZ: ['$', '¢'], RO: ['lei ', ''], BG: ['лв ', ''], ID: ['Rp ', ''] };
  var TYPES = { food: { icon: 'food', label: 'Comer' }, visit: { icon: 'castle', label: 'Visita' }, walk: { icon: 'pin', label: 'Paseo' }, view: { icon: 'mountain', label: 'Mirador' },
    drive: { icon: 'car', label: 'Ruta' }, car: { icon: 'key', label: 'Coche' }, hotel: { icon: 'bed', label: 'Hotel' }, night: { icon: 'moon', label: 'Noche' }, tour: { icon: 'ghost', label: 'Tour' },
    train: { icon: 'plane', label: 'Viaje' }, shop: { icon: 'shop', label: 'Compras' } };
  function checklist(sp, country) {
    if (lg() === 'en') country = country.replace(' y ', ' and ');
    var c = [
      { id: 'doc', icon: 'doc', title: 'Documentos', items: [{ id: 'pasaporte', t: 'DNI o pasaporte en vigor', imp: 1, n: 'Comprueba qué documento pide ' + country + ' y si hace falta visado o autorización.' },
        { id: 'seguro', t: 'Seguro de viaje o tarjeta sanitaria', imp: 1 }, { id: 'reservas', t: 'Reservas guardadas en «Reservas y billetes»' }] },
      { id: 'din', icon: 'card', title: 'Dinero y móvil', items: [{ id: 'tarjeta', t: 'Tarjeta sin comisiones en el extranjero', imp: 1 }, { id: 'roaming', t: 'Roaming o eSIM', n: 'Mira si tu tarifa incluye ' + country + '.' },
        { id: 'mapasoff', t: 'Mapas sin conexión descargados', n: 'En Google Maps, con wifi: tu foto → «Mapas sin conexión» → «Selecciona tu propio mapa».' }] },
      { id: 'elec', icon: 'plug', title: 'Electrónica', items: [{ id: 'cargador', t: 'Cargadores y batería externa' }, { id: 'adaptador', t: 'Adaptador de enchufe si hace falta' }] },
      { id: 'ropa', icon: 'jacket', title: 'Ropa', items: [{ id: 'calzado', t: 'Calzado cómodo para andar', imp: 1 }, { id: 'capas', t: 'Ropa según el tiempo de esos días' }] },
      { id: 'vdoc', icon: 'plane', title: 'Vuelta', when: 'back', items: [{ id: 'vcheckin', t: 'Check-in online del vuelo de vuelta', imp: 1 }, { id: 'vmaleta', t: 'Maleta revisada (líquidos, peso)' }] }
    ];
    if (sp.mode === 'car') c.splice(2, 0, { id: 'car', icon: 'car', title: 'Coche', items: [{ id: 'carnet', t: 'Carné de conducir', imp: 1, n: 'Algunos países piden el permiso internacional.' }, { id: 'alquiler', t: 'Reserva del coche de alquiler', imp: 1 }] });
    c.forEach(function (g) { g.title = tr(g.title); g.items.forEach(function (i) { i.t = tr(i.t); if (i.n) i.n = tr(i.n); }); });
    return c;
  }
  function nameOf(tg) { return tg['name:es'] || tg.name || tg['name:en']; }
  function placeOf(tg, fallback) { return tg['addr:city'] || tg['addr:town'] || tg['addr:village'] || fallback || ''; }
  function assemble(plan, food, sp, meta0) {
    var EN0 = lg() === 'en', AT = EN0 ? ' at ' : ' en ';
    var photos = {}, credits = [], nPh = 0, foodUsed = {}, walkMode = sp.mode !== 'car';
    function photo(p) {
      if (!p.img) return '';
      var key = 'w' + (++nPh); photos[key] = p.img;
      var file = decodeURIComponent((p.img.split('/').pop() || '').replace(/\?.*$/, '').replace(/^\d+px-/, ''));
      credits.push({ place: p.n, artist: 'Wikimedia Commons', lic: 'ver licencia', page: 'https://commons.wikimedia.org/wiki/File:' + file });
      return key;
    }
    function rich(f) { var t = f.tg; return (t.cuisine ? 1 : 0) + (t.opening_hours ? 1 : 0) + (t.website || t['contact:website'] ? 1 : 0) + (t.wikidata ? 2 : 0); }
    function foodNear(pt, n, re) {
      return food.filter(function (f) { return !foodUsed[f.n] && km(pt, f) < 1 && (!re || re.test(f.tg.amenity || '')); })
        .sort(function (a, b) { return rich(b) - rich(a) || km(pt, a) - km(pt, b); }).slice(0, n || 1);
    }
    function hours(tg) { return tg.opening_hours ? tr('Horario en OpenStreetMap: ' + tg.opening_hours + ' (compruébalo antes de ir).') : ''; }
    var stays = [], days = [], route = [];
    plan.forEach(function (d, k) {
      var did = 'd' + (k + 1), items = [], n = 0, c = d.city, town = c.name, hotelName = c.stay || '', stayPt = d.stay;
      function id() { return did + '-' + (++n); }
      function meal(ti, at, dur, pt, re, fallbackQ) {
        var f = pt ? foodNear(pt, 1, re)[0] : null; if (f) foodUsed[f.n] = 1;
        var x = { id: id(), t: 'food', ti: f ? tr(ti) + AT + f.n : tr(ti), pl: f ? placeOf(f.tg, town) : town, d: dur, lat: f ? +f.lat.toFixed(5) : +(pt || stayPt).lat.toFixed(5), lon: f ? +f.lon.toFixed(5) : +(pt || stayPt).lon.toFixed(5),
          q: f ? f.n + ', ' + town : tr(fallbackQ), tips: f ? [f.tg.cuisine ? tr('Cocina: ' + f.tg.cuisine.replace(/;/g, ', ') + '.') : '', hours(f.tg)].filter(Boolean) : [tr('El botón de Maps abre los sitios cercanos.')] };
        if (at) x.at = at;
        items.push(x);
      }
      function stopItem(p) {
        var K = KINDS[p.kind], it = { id: id(), t: K.t, k: p.kind, ti: p.n, pl: town, d: p.dd || dwell(p), lat: +p.lat.toFixed(5), lon: +p.lon.toFixed(5), q: p.n + ', ' + town };
        if (p.must) it.must = 1;
        if (p.fixedAt) { it.at = p.fixedAt; it.tips = [tr('Entrada con hora: llega 15 min antes.')]; }
        if (p.soft) { it.at = p.soft; it.soft = 1; }
        if (p.lead) it.lead = p.lead;
        var tips = (it.tips || []).slice();
        if (p.art) tips.push(tr('Aquí se conserva: ' + p.art.slice(0, 3).join(', ') + '.'));
        if (p.web) tips.push(tr('Web oficial: ' + p.web));
        tips.push(tr('Comprueba horario y precio en la web oficial antes de ir.'));
        it.tips = tips;
        var ph = photo(p); if (ph) it.ph = ph;
        var tags = []; if (K.photo) tags.push('photo'); if (K.rain) tags.push('rain'); if (tags.length) it.tags = tags;
        if (K.out) it.light = 1;
        if (p.page) it.see = [tr('Más en Wikipedia: ' + p.page)];
        it.src = { wd: p.wd || null, links: p.links || 0, views: Math.round(p.views || 0) };
        items.push(it);
      }
      // el comienzo del día
      var firstNight = k === 0 || d.moved;
      if (k === 0 && sp.fin && sp.fin.t) {
        items.push({ id: id(), t: 'train', ti: tr('Llegada' + (sp.fin.p ? ' a ' + sp.fin.p : '')), at: sp.fin.t, d: walkMode ? 45 : 30, lat: +(sp.airIn || stayPt).lat.toFixed(5), lon: +(sp.airIn || stayPt).lon.toFixed(5), tips: [tr('Cuenta con el control de pasaportes y las maletas.')] });
        if (!walkMode) items.push({ id: id(), t: 'car', ti: tr('Recoger el coche de alquiler'), d: 45, lat: +(sp.airIn || stayPt).lat.toFixed(5), lon: +(sp.airIn || stayPt).lon.toFixed(5), pickup: 1, tips: [tr('Revisa el coche y haz fotos antes de salir.')] });
      } else if (k > 0) {
        var prevStay = plan[k - 1].stay;
        items.push({ id: id(), t: 'food', ti: tr(d.moved ? 'Desayuno y check-out' : 'Desayuno'), d: d.ST === STYLE.afternoon && !d.moved ? 50 : d.moved ? 45 : 30, lat: +prevStay.lat.toFixed(5), lon: +prevStay.lon.toFixed(5) });
      }
      if (d.moved && walkMode) {
        var mk = km(d.prev, c), mm = legMinutes(mk), how = mk < 700 ? 'tren o autobús' : 'avión';
        items.push({ id: id(), t: 'train', jump: 1, ti: tr('Viaje a ' + town), pl: d.prev.name + ' → ' + town, d: mm, lat: +c.lat.toFixed(5), lon: +c.lon.toFixed(5), tips: [tr('Tiempo aproximado en ' + how + ' (' + Math.round(mk) + ' km en línea recta), con esperas. El billete lo reservas tú: busca horarios antes de ir y ajusta el plan.')] });
      }
      if (firstNight && !d.last) items.push({ id: id(), t: 'hotel', ti: tr((k === 0 && !d.moved ? 'Dejar las maletas en ' : 'Check-in en ') + (hotelName || 'el alojamiento')), pl: town, d: 20, lat: +stayPt.lat.toFixed(5), lon: +stayPt.lon.toFixed(5), stay: did });
      // las visitas de la mañana, comida, las de la tarde
      var am = d.am.slice(), pm = d.pm.slice();
      // entradas con hora: se colocan donde les toca
      d.fixed.forEach(function (f) { (hm(f.fixedAt) < hm(d.ST.lunch) ? am : pm).push(f); });
      am.sort(function (a, b) { return a.fixedAt && b.fixedAt ? hm(a.fixedAt) - hm(b.fixedAt) : 0; });
      var morningCafe = d.P.cafe && am.length > 1;
      am.forEach(function (p, j) {
        stopItem(p);
        if (morningCafe && j === Math.floor((am.length - 1) / 2)) meal('Café y descanso', '', 30, p, /cafe|bar|pub/, 'cafeterías cerca de ' + p.n);
      });
      var lastAm = am[am.length - 1] || pm[0] || stayPt;
      // si se llega muy tarde (o se va pronto), esa comida no se pone
      var lunchOk = d.arrive <= hm(d.ST.lunch) + 45 && !(d.last && sp.fout && sp.fout.t && hm(sp.fout.t) - 180 < hm(d.ST.lunch));
      if (lunchOk) meal('Comida', d.ST.lunch, d.P.lunch, lastAm, /restaurant|pub/, 'restaurantes cerca de ' + (lastAm.n || town));
      if (pm.length && !pm[0].fixedAt && d.arrive < hm(d.ST.pm)) pm[0].soft = d.ST.pm;
      pm.forEach(function (p) { stopItem(p); });
      // tiempo para una copa
      var lastStop = pm[pm.length - 1] || lastAm;
      if ((d.P.drinks || d.ST === STYLE.spread) && d.arrive < hm(d.ST.dinner) - 180 && !(d.last && sp.fout && sp.fout.t)) meal(d.P.drinks ? 'Tarde de bares y aperitivo' : 'Aperitivo', fmt(hm(d.ST.dinner) - (d.P.drinks ? 120 : 75)), d.P.drinks ? 90 : 50, lastStop, /bar|pub|cafe/, 'bares cerca de ' + (lastStop.n || town));
      if (!d.stops.length && d.arrive < hm(d.ST.dinner) - 120) items.push({ id: id(), t: 'walk', ti: tr('Paseo libre por ' + town), pl: town, d: 120, lat: +c.lat.toFixed(5), lon: +c.lon.toFixed(5), q: town, tips: [tr('No he encontrado más sitios conocidos para este día: es un buen momento para perderse por la zona. En «Más ideas» tienes alternativas.')] });
      // el final del día
      if (d.last && sp.fout && sp.fout.t) {
        var ap = sp.airOut || stayPt;
        if (!walkMode) items.push({ id: id(), t: 'car', ti: tr('Devolver el coche'), d: 30, lat: +ap.lat.toFixed(5), lon: +ap.lon.toFixed(5) });
        items.push({ id: id(), t: 'train', ti: tr('Aeropuerto · vuelo a las ' + sp.fout.t), at: fmt(hm(sp.fout.t) - 120), d: 120, lat: +ap.lat.toFixed(5), lon: +ap.lon.toFixed(5), tips: [tr('Llega 2 h antes del vuelo.')] });
      } else {
        if (!firstNight && !d.last) items.push({ id: id(), t: 'hotel', ti: tr(hotelName ? 'Vuelta a ' + hotelName : 'Vuelta al alojamiento'), pl: town, d: 15, lat: +stayPt.lat.toFixed(5), lon: +stayPt.lon.toFixed(5), stay: did });
        meal('Cena', d.ST.dinner, d.P.dinner, stayPt === d.stay ? (lastStop.lat != null ? lastStop : stayPt) : stayPt, /restaurant|pub/, 'restaurantes cerca de ' + (hotelName || town));
      }
      if (!d.last) stays.push({ id: did, town: town, lat: +stayPt.lat.toFixed(5), lon: +stayPt.lon.toFixed(5) });
      var extras = (d.extras || []).map(function (p, j) {
        var K = KINDS[p.kind], x = { id: 'x-' + did + '-' + (j + 1), t: K.t, wd: p.wd || null, ti: p.n, pl: town, d: dwell(p), lat: +p.lat.toFixed(5), lon: +p.lon.toFixed(5) };
        if (p.lead) x.lead = p.lead; var ph = photo(p); if (ph) x.ph = ph;
        var tags = []; if (K.rain) tags.push('rain'); if (K.photo) tags.push('photo'); if (tags.length) x.tags = tags;
        return x;
      });
      var guide = foodNear(stayPt, 8).concat(foodNear(lastAm, 4)).map(function (f) {
        foodUsed[f.n] = 1;
        var kind = /pub|bar/.test(f.tg.amenity) ? 'pub' : 'eat';
        return { k: kind, n: f.n, pl: placeOf(f.tg, town), p: '', t: [f.tg.cuisine ? (EN0 ? 'Cuisine: ' : 'Cocina: ') + f.tg.cuisine.replace(/;/g, ', ') : (kind === 'pub' ? 'Bar' : f.tg.amenity === 'cafe' ? (EN0 ? 'Café' : 'Café') : (EN0 ? 'Restaurant' : 'Restaurante')), f.tg.opening_hours ? (EN0 ? 'Hours (OSM): ' : 'Horario (OSM): ') + f.tg.opening_hours : ''].filter(Boolean).join('. ') + '.' };
      });
      var top = d.stops.slice().sort(function (a, b) { return (b.fame || 0) - (a.fame || 0); });
      var topPh = top.filter(function (p) { return p.img; })[0];
      var day = {
        id: did, title: town, sub: top.slice(0, 3).map(function (p) { return p.n; }).join(', ') || tr('Día libre'),
        ph: topPh ? Object.keys(photos).filter(function (kk) { return photos[kk] === topPh.img; })[0] : undefined,
        start: fmt(d.start), ref: { name: town, lat: c.lat, lon: c.lon }, icon: (top[0] && KINDS[top[0].kind] && KINDS[top[0].kind].icon) || 'pin',
        tips: [], items: items, guide: guide, extras: extras
      };
      if (sp.mode !== 'car') day.mode = sp.mode;
      days.push(day);
      route.push({ n: town, k: k + 1, day: tr('Día ' + (k + 1)), ph: day.ph, go: (k + 1) + ':' + ((items.filter(function (i) { return i.src; })[0] || items[0] || {}).id || ''),
        t: (top[0] && top[0].lead) || day.sub, facts: top.slice(0, 3).map(function (p) { return p.n; }), must: top[0] ? top[0].n : '' });
    });
    var wxDays = plan.map(function (d) { return { n: d.city.name, lat: d.city.lat, lon: d.city.lon, hi: null, lo: null, pass: 0 }; });
    var c0 = sp.stops[0], cur = CURRENCY[c0.cc] || ['€', 'c'], towns = sp.stops.map(function (x) { return x.name; });
    var countries = sp.stops.map(function (x) { return x.country; }).filter(function (v, i, a) { return v && a.indexOf(v) === i; });
    var destName = towns.length === 1 ? towns[0] : towns.length === 2 ? towns.join(lg() === 'en' ? ' and ' : ' y ') : (countries.length === 1 ? countries[0] : towns[0] + ' y más');
    var nDays = plan.length;
    var meta = {
      id: meta0.id, storage: meta0.id, title: { es: meta0.title, en: meta0.title }, dest: { es: destName, en: destName }, home: { es: 'España', en: 'Spain' }, lang: lg(),
      region: countries.join(', ') || destName, roads: '', tz: meta0.tz, tzBase: meta0.tzOff, homeTz: 'Europe/Madrid', currency: cur[0], minor: cur[1],
      flights: { out: sp.fin && sp.fin.t ? { date: sp.start, time: sp.fin.t } : {}, back: sp.fout && sp.fout.t ? { date: addDays(sp.start, nDays - 1), time: sp.fout.t } : {}, hours: 24 },
      strings: {
        es: { coverTitle: esc(destName) + ' <em>en ' + nDays + (nDays === 1 ? ' día' : ' días') + '</em>', coverSub: '{0} – {1} · ' + esc(towns.slice(0, 4).join(', ')), coverAria: esc(destName) },
        en: { coverTitle: esc(destName) + ' <em>in ' + nDays + (nDays === 1 ? ' day' : ' days') + '</em>', coverSub: '{0} – {1}', coverAria: esc(destName) }
      },
      mode: sp.mode, autoLegs: true,
      generated: { at: new Date().toISOString(), by: 'asistente', engine: 2, pace: sp.pace, style: sp.style, cities: towns, countries: countries, dest: destName, verify: 'Horarios, precios y restaurantes salen de OpenStreetMap y Wikipedia: compruébalos.' }
    };
    var trip = {
      defaultStart: sp.start, cover: days.map(function (x) { return x.ph; }).filter(Boolean)[0] || '', types: TYPES, events: [], checklist: checklist(sp, countries.join(' y ') || 'el destino'),
      days: days, souvenirs: [], route: route, wx: wxDays, links: [], driving: [], photoRoutes: [], stays: stays, filmRoutes: []
    };
    return { meta: meta, travel: {}, trip: trip, trip_en: {}, credits: credits, photos: photos };
  }

  /* ---------- Tiempos reales (OSRM) y clima típico (Open-Meteo) ---------- */
  function osrmTable(pts, foot) {
    var coords = pts.map(function (p) { return (+p.lon).toFixed(5) + ',' + (+p.lat).toFixed(5); }).join(';');
    var url = foot ? 'https://routing.openstreetmap.de/routed-foot/table/v1/driving/' : 'https://router.project-osrm.org/table/v1/driving/';
    return getJSON(url + coords + '?annotations=duration,distance', null, 30000);
  }
  // minutos y décimas de km en base 36, como la tabla de Escocia
  function travelTable(b) {
    var pts = [], ix = {};
    function add(it) { if (it.lat == null) return; var k = (+it.lat).toFixed(4) + ',' + (+it.lon).toFixed(4); if (ix[k] == null) { ix[k] = pts.length; pts.push({ lat: +it.lat, lon: +it.lon, k: k }); } }
    b.trip.days.forEach(function (d) { d.items.forEach(add); });
    b.trip.days.forEach(function (d) { (d.extras || []).forEach(add); });
    pts = pts.slice(0, 100);
    function enc(rows, f) { var out = []; rows.forEach(function (r) { r.forEach(function (v) { out.push(v == null ? '' : Math.round(f(v)).toString(36)); }); }); return out.join(','); }
    var foot = b.meta.mode !== 'car';
    return osrmTable(pts, false).then(function (car) {
      var res = { src: 'OSRM · OpenStreetMap, ' + new Date().toISOString().slice(0, 10), k: pts.map(function (p) { return p.k; }),
        cm: enc(car.durations, function (s) { return s / 60; }), ck: enc(car.distances, function (m) { return m / 100; }) };
      var empty = pts.map(function () { return pts.map(function () { return null; }); });
      if (!foot) { res.fm = enc(empty); res.fk = enc(empty); return res; }
      return osrmTable(pts, true).then(function (ft) { res.fm = enc(ft.durations, function (s) { return s / 60; }); res.fk = enc(ft.distances, function (m) { return m / 100; }); return res; })
        .catch(function () { res.fm = enc(empty); res.fk = enc(empty); return res; });
    });
  }
  function climate(b) {
    var y0 = addDays(b.trip.defaultStart, -365), y1 = addDays(y0, b.trip.days.length - 1), done = {};
    return b.trip.wx.reduce(function (pr, w) {
      return pr.then(function () {
        if (done[w.n]) { w.hi = done[w.n][0]; w.lo = done[w.n][1]; return; }
        return getJSON('https://archive-api.open-meteo.com/v1/archive?latitude=' + w.lat + '&longitude=' + w.lon + '&start_date=' + y0 + '&end_date=' + y1 + '&daily=temperature_2m_max,temperature_2m_min&timezone=auto').then(function (j) {
          function avg(a) { a = (a || []).filter(function (v) { return v != null; }); return a.length ? Math.round(a.reduce(function (s, v) { return s + v; }, 0) / a.length) : null; }
          w.hi = avg(j.daily.temperature_2m_max); w.lo = avg(j.daily.temperature_2m_min); done[w.n] = [w.hi, w.lo];
        });
      });
    }, Promise.resolve());
  }

  /* ---------- Capa en inglés: nombres y descripciones de Wikipedia; el resto, con las tablas de lang.js ---------- */
  function addEnglish(b) {
    var T = b.trip, all = [], cityEn = {}, E = { items: {}, days: {}, checklist: {}, guide: {}, route: [], wx: [], types: {} };
    function cityOf(n) { return cityEn[n] || n; }
    function swapCities(x) { Object.keys(cityEn).forEach(function (n) { x = String(x).split(n).join(cityEn[n]); }); return x; }
    T.days.forEach(function (d) { d.items.concat(d.extras || []).forEach(function (it) { all.push(it); }); });
    function wdOf(it) { return it.wd || (it.src && it.src.wd) || null; }
    var ids = all.map(wdOf).filter(function (q, i, a) { return q && a.indexOf(q) === i; }), info = {}, batches = [];
    for (var i = 0; i < ids.length; i += 50) batches.push(ids.slice(i, i + 50));
    return pool(batches, 2, function (bt) {
      return getJSON('https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels|sitelinks&languages=en&format=json&origin=*&ids=' + bt.join('|')).then(function (j) {
        Object.keys(j.entities || {}).forEach(function (q) { var e = j.entities[q] || {}; info[q] = { n: e.labels && e.labels.en && e.labels.en.value, title: e.sitelinks && e.sitelinks.enwiki && e.sitelinks.enwiki.title }; });
      });
    }).then(function () {
      return pool(ids.filter(function (q) { return info[q] && info[q].title; }), 4, function (q) {
        return wikiSummary('en', info[q].title).then(function (sm) { if (sm) { info[q].lead = firstSentences(sm.extract || '', 2); info[q].page = sm.content_urls && sm.content_urls.desktop && sm.content_urls.desktop.page; } });
      });
    }).then(function () {
      // los nombres de las ciudades (Praga → Prague), con los enlaces entre idiomas de Wikipedia
      var towns = T.days.map(function (d) { return d.title; }).filter(function (v, k, a) { return v && a.indexOf(v) === k; });
      return pool(towns, 3, function (n) {
        return getJSON('https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=langlinks&lllang=en&titles=' + encodeURIComponent(n)).then(function (j) {
          var pg = j.query.pages, ll = pg[Object.keys(pg)[0]].langlinks;
          if (ll && ll[0]) cityEn[n] = ll[0]['*'].replace(/,.*$/, '');
        });
      });
    }).then(function () {
      var names = {};
      all.forEach(function (it) {
        var w = info[wdOf(it)] || {}, o = {}, ti = w.n || toEn(it.ti);
        if (ti !== it.ti) { o.ti = ti; names[it.ti] = ti; }
        if (w.lead) o.lead = w.lead;
        if (it.tips) o.tips = it.tips.map(toEn);
        if (it.q && !wdOf(it)) o.q = toEn(it.q);
        if (it.pl) o.pl = cityOf(it.pl);
        o.see = w.page ? ['More on Wikipedia: ' + w.page] : it.see ? it.see.map(toEn) : undefined;
        if (!o.see) delete o.see;
        if (it.pl && /→/.test(it.pl)) o.pl = swapCities(it.pl);
        E.items[it.id] = o;
      });
      function nameEn(n) { return names[n] || n; }
      T.days.forEach(function (d) {
        E.days[d.id] = { title: cityOf(d.title), ref: cityOf(d.ref && d.ref.name), sub: String(d.sub || '').split(', ').map(nameEn).join(', ') };
        if (d.sub === 'Día libre') E.days[d.id].sub = toEn(d.sub);
        if (d.guide && d.guide.length) E.guide[d.id] = d.guide.map(function (g) { return { t: toEn(g.t) }; });
      });
      (T.checklist || []).forEach(function (c) {
        var o = { title: toEn(c.title), items: {} };
        c.items.forEach(function (it) { o.items[it.id] = { t: toEn(it.t) }; if (it.n) o.items[it.id].n = toEn(it.n); });
        E.checklist[c.id] = o;
      });
      (T.route || []).forEach(function (r, k) {
        var d = T.days[k], first = d && d.items.filter(function (x) { return E.items[x.id] && E.items[x.id].lead; })[0];
        E.route.push({ n: cityOf(r.n), day: toEn(r.day), t: first ? E.items[first.id].lead : E.days[d ? d.id : ''] ? E.days[d.id].sub : r.t, facts: (r.facts || []).map(nameEn), must: nameEn(r.must) });
      });
      Object.keys(T.types || {}).forEach(function (k) { E.types[k] = toEn(T.types[k].label); });
      b.trip_en = E;
      (T.wx || []).forEach(function (w) { E.wx.push({ n: cityOf(w.n) }); });
      b.meta.title.en = swapCities(toEn(b.meta.title.es));
      if (b.meta.dest) b.meta.dest.en = swapCities(b.meta.dest.es).replace(/ y /g, ' and ');
      var st = b.meta.strings && b.meta.strings.en; if (st) { st.coverTitle = swapCities(st.coverTitle).replace(/ y /g, ' and '); st.coverAria = swapCities(st.coverAria).replace(/ y /g, ' and '); }
      b.meta.enReady = 1;
      return b;
    });
  }
  // el viaje tal como se ve en inglés (para el mapa del final del asistente)
  function localized(b) {
    var t = JSON.parse(JSON.stringify(b.trip));
    if (ui() !== 'en' || !(b.trip_en || {}).items) return t;
    t.days.forEach(function (d) { var dd = b.trip_en.days[d.id]; if (dd) Object.assign(d, dd); d.items.concat(d.extras || []).forEach(function (it) { Object.assign(it, b.trip_en.items[it.id] || {}); }); });
    return t;
  }

  /* ---------- Todo junto ---------- */
  // spec: { title, start, mode, pace, style, ints, stops:[{name,lat,lon,bb,cc,country,days,stay}], fin:{t,p}, fout:{t,p}, fixed:[{n,day,at}] }
  function generate(sp, step) {
    step = step || function () { return { ok: function () {}, warn: function () {} }; };
    var c0 = sp.stops[0], title = sp.title, nDays = sp.stops.reduce(function (s, c) { return s + c.days; }, 0), tz = 'UTC', tzOff = 0;
    if (!title) title = tr((sp.stops.length === 1 ? c0.name : sp.stops.length === 2 ? sp.stops[0].name + (lg() === 'en' ? ' and ' : ' y ') + sp.stops[1].name : c0.country || c0.name) + ' en ' + nDays + (nDays === 1 ? ' día' : ' días'));
    var id = 'u-' + slug(c0.name).slice(0, 24) + '-' + Math.random().toString(36).slice(2, 6);
    function geo(q, near) {
      return q ? nominatim('limit=1&' + (near && near.cc ? 'countrycodes=' + near.cc.toLowerCase() + '&' : '') + 'q=' + encodeURIComponent(q)).then(function (r) { return r[0] ? { lat: +r[0].lat, lon: +r[0].lon, name: q } : null; }).catch(function () { return null; }) : Promise.resolve(null);
    }
    var s1 = step('Buscando alojamientos, aeropuertos y entradas'), missing = [], chain = Promise.resolve();
    sp.stops.forEach(function (c) {
      chain = chain.then(function () { return geo(c.stay ? c.stay + ', ' + c.name : '', c); }).then(function (g) { if (c.stay && !g) missing.push(c.stay); c.stayPt = g ? { lat: g.lat, lon: g.lon, name: c.stay, town: c.name } : { lat: c.lat, lon: c.lon, name: c.stay || '', town: c.name }; });
    });
    chain = chain.then(function () { return geo(sp.fin && sp.fin.p ? sp.fin.p + ' airport' : '', c0); }).then(function (g) { if (sp.fin) sp.airIn = g; })
      .then(function () { return geo(sp.fout && sp.fout.p ? sp.fout.p + ' airport' : '', sp.stops[sp.stops.length - 1]); }).then(function (g) { if (sp.fout) sp.airOut = g; });
    (sp.fixed || []).forEach(function (f) { chain = chain.then(function () { return geo(f.n, c0); }).then(function (g) { if (!g) missing.push(f.n); f.pt = g; }); });
    return chain.then(function () {
      s1.ok(missing.length ? 'Listo (no encontré: ' + missing.join(', ') + '; uso el centro)' : 'Alojamientos y horarios listos');
      var s2 = step('Zona horaria');
      return getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + c0.lat + '&longitude=' + c0.lon + '&timezone=auto&forecast_days=1&daily=sunrise')
        .then(function (j) { tz = j.timezone || 'UTC'; tzOff = Math.round((j.utc_offset_seconds || 0) / 60); s2.ok('Zona horaria: ' + tz); })
        .catch(function () { s2.warn('Sin zona horaria: uso la de tu móvil'); tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; });
    }).then(function () {
      var s3 = step('Buscando lo más importante (Wikidata y Wikipedia)'), data = [], fails = [], n = 0;
      return pool(sp.stops, 2, function (c, k) {
        if (sp.mode === 'car') c.r = 30;
        return discover(c).then(function (a) { data[k] = a.map(function (x) { return Object.assign({}, x); }); }, function () { data[k] = []; fails.push(c.name); }).then(function () { n++; s3.ok('Lo más importante: ' + n + ' de ' + sp.stops.length + (sp.stops.length === 1 ? ' destino' : ' destinos')); });
      }).then(function () {
        var tot = data.reduce(function (s, a) { return s + (a ? a.length : 0); }, 0);
        if (!tot) throw new Error(fails.length ? 'Wikidata no responde ahora' : 'No he encontrado sitios conocidos en esa zona');
        s3.ok(tot + ' sitios valorados por interés real' + (fails.length ? ' (sin respuesta: ' + fails.join(', ') + ')' : ''));
        return data;
      });
    }).then(function (data) {
      var s4 = step('Repartiendo por días, según tu ritmo');
      var plan = buildPlan(sp, data);
      // imprescindibles: lo más importante de cada ciudad
      sp.stops.forEach(function (c, ci) {
        var used = []; plan.forEach(function (d) { if (d.ci === ci) d.stops.forEach(function (x) { if (x.fame != null) used.push(x); }); });
        used.sort(function (a, b) { return b.fame - a.fame; }).slice(0, Math.max(2, Math.ceil(used.length * 0.35))).forEach(function (x) { x.must = 1; });
      });
      s4.ok(plan.map(function (d, k) { return 'Día ' + (k + 1) + ': ' + d.stops.length; }).join(' · ') + ' paradas');
      return plan;
    }).then(function (plan) {
      var s6 = step('Restaurantes y bares cerca (OpenStreetMap)'), pts = [];
      plan.forEach(function (d) { pts.push(d.stay); d.stops.forEach(function (x, i) { if (i % 2 === 0) pts.push(x); }); });
      var seen = [], parts = pts.filter(function (p) { if (seen.some(function (o) { return km(o, p) < 0.6; })) return false; seen.push(p); return true; }).slice(0, 14).map(function (p) {
        return 'nwr(around:600,' + p.lat.toFixed(5) + ',' + p.lon.toFixed(5) + ')["amenity"~"^(restaurant|pub|bar|cafe)$"]["name"];';
      });
      return overpass('[out:json][timeout:20];(' + parts.join('') + ');out center tags 700;').then(function (j) {
        var food = (j.elements || []).map(function (el) { var p = el.center || el; return { tg: el.tags || {}, n: nameOf(el.tags || {}), lat: p.lat, lon: p.lon }; }).filter(function (f) { return f.n && f.lat != null; });
        s6.ok(food.length + ' sitios para comer'); return { plan: plan, food: food };
      }).catch(function () { s6.warn('OpenStreetMap no responde ahora: las comidas llevan un enlace para buscar sitio cerca'); return { plan: plan, food: [] }; });
    }).then(function (R) {
      var s7 = step('Descripciones y fotos (Wikipedia)'), used = [];
      R.plan.forEach(function (d) { d.stops.forEach(function (s) { used.push(s); }); (d.extras || []).forEach(function (s) { used.push(s); }); });
      var list = used.filter(function (p) { return p.wiki; });
      return pool(list, 4, function (p) {
        return wikiSummary(p.wiki[0], p.wiki[1]).then(function (sm) {
          if (!sm) return;
          p.lead = firstSentences(sm.extract || '', 2);
          if (!p.img && sm.thumbnail && sm.thumbnail.source) p.img = sm.thumbnail.source.replace(/\/\d+px-/, '/800px-');
          p.page = sm.content_urls && sm.content_urls.desktop && sm.content_urls.desktop.page;
        });
      }).then(function () { s7.ok(list.filter(function (p) { return p.img; }).length + ' fotos y ' + list.filter(function (p) { return p.lead; }).length + ' descripciones'); return R; });
    }).then(function (R) {
      var s8 = step('Tiempos reales de cada trayecto (OSRM)'), bundle = assemble(R.plan, R.food, sp, { id: id, title: title, tz: tz, tzOff: tzOff });
      return travelTable(bundle).then(function (tv) { bundle.travel = tv; s8.ok('Rutas calculadas entre ' + tv.k.length + ' puntos'); return bundle; })
        .catch(function () { s8.warn('Sin rutas reales: la guía estimará los tiempos por distancia'); return bundle; });
    }).then(function (bundle) {
      var s8b = step('Textos en inglés (Wikipedia)');
      return addEnglish(bundle).then(function () { s8b.ok('Guía en español e inglés'); return bundle; }, function () { s8b.warn('Textos en inglés pendientes: se completarán al volver a Home'); return bundle; });
    }).then(function (bundle) {
      var s9 = step('Temperaturas típicas de esas fechas (Open-Meteo)');
      return climate(bundle).then(function () { s9.ok('Temperaturas listas'); }, function () { s9.warn('Sin datos de clima: se verá la previsión cuando falten pocos días'); }).then(function () { return bundle; });
    }).then(function (bundle) {
      if (!window.Mapa) return bundle;
      // el mapa ilustrado: se prepara ahora, con conexión, para verlo después sin ella
      var s10 = step('Dibujando el mapa del viaje'), days = Mapa.fromTrip(bundle.trip);
      return Mapa.landFor(days).catch(function () { return null; }).then(function (land) {
        if (land && land.length) bundle.trip.mapLand = land;
        return pool(Mapa.pickPins(days), 3, function (q) {
          var src = Mapa.photoOf(q.s, bundle.photos); if (!src) return;
          return Mapa.sketch(src).then(function (u) { q.s.sk = u; });
        });
      }).then(function () { s10.ok('Mapa del viaje listo'); return bundle; }, function () { s10.warn('Mapa sin todos los dibujos'); return bundle; });
    });
  }

  return { discover: discover, generate: generate, classify: classify, searchCountry: searchCountry, addEnglish: addEnglish, localized: localized, searchCity: searchCity, suggestCities: suggestCities, placeInfo: placeInfo, photoOf: photoOf, km: km, addDays: addDays, KINDS: KINDS, _buildPlan: buildPlan, _dwell: dwell };
})();
