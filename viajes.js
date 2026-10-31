/* ===== Mis viajes: lista, importar/exportar y asistente que crea una guía nueva =====
   Todo con servicios gratuitos y sin clave:
   - Nominatim (OpenStreetMap): buscar el destino, hoteles y aeropuertos
   - Overpass (OpenStreetMap): sitios que ver y sitios para comer, con horario si lo tienen
   - Wikidata: lo conocido que es cada sitio (número de Wikipedias que lo tratan)
   - Wikipedia: descripción y foto
   - OSRM: tiempos reales en coche y a pie
   - Open-Meteo: zona horaria y temperaturas típicas de esas fechas
   La IA del usuario es opcional y solo puede reescribir textos de sitios que ya están en la lista. */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function hm(s) { var p = String(s).split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) { m = Math.round(m); return p2(Math.floor(m / 60) % 24) + ':' + p2(m % 60); }
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function dateLbl(iso) { var d = new Date(iso + 'T12:00:00Z'); return DIAS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MES[d.getUTCMonth()]; }
  function km(a, b) {
    var R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

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
  var builtIn = [];
  function tripCard(t, user) {
    var title = (t.title && (t.title.es || t.title.en)) || t.id, days = t.days || 0;
    var dates = t.start ? dateLbl(t.start) + ' – ' + dateLbl(addDays(t.start, Math.max(0, days - 1))) : '';
    return '<div class="card trip"><div class="trip-ph"' + (t.cover ? ' style="background-image:url(&quot;' + esc(t.cover) + '&quot;)"' : '') + '></div>' +
      '<div class="trip-m">' + (user ? '<span class="tag-gen">' + (t.gen ? 'Creado con el asistente' : 'Importado') + '</span>' : '') +
      '<b>' + esc(title) + '</b><small>' + esc(dates) + (days ? ' · ' + days + ' días' : '') + '</small>' +
      '<div class="btn-row"><button type="button" class="btn navy sq" data-open="' + esc(t.id) + '">Abrir</button>' +
      '<button type="button" class="btn ghost sq" data-exp="' + esc(t.id) + '">Exportar</button>' +
      (user ? '<button type="button" class="btn ghost sq" data-del="' + esc(t.id) + '">Borrar</button>' : '') + '</div></div></div>';
  }
  function renderList() {
    var a = fetch('trips/index.json').then(function (r) { return r.json(); }).catch(function () { return []; });
    var b = DB.all().catch(function () { return []; });
    return Promise.all([a, b]).then(function (r) {
      builtIn = r[0] || [];
      var users = (r[1] || []).map(function (x) {
        var bd = x.bundle, ph = bd.photos || {};
        return { id: x.id, title: bd.meta.title, start: bd.trip.defaultStart, days: bd.trip.days.length, cover: ph[bd.trip.cover] || '', gen: !!(bd.meta.generated) };
      });
      $('#list').innerHTML = builtIn.map(function (t) { return tripCard(t, false); }).join('') + users.map(function (t) { return tripCard(t, true); }).join('') ||
        '<p class="note">Aún no hay viajes.</p>';
    });
  }
  function openTrip(id) { try { localStorage.setItem('guia-trip', id); } catch (e) {} location.href = 'index.html'; }
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
      DB.put({ id: id, at: Date.now(), bundle: b }).then(function () { Album.reset(); renderList(); });
    };
    r.readAsText(file);
  }
  document.addEventListener('click', function (e) {
    var t = e.target, o = t.closest('[data-open]'), x = t.closest('[data-exp]'), d = t.closest('[data-del]');
    if (o) openTrip(o.getAttribute('data-open'));
    else if (x) exportTrip(x.getAttribute('data-exp'));
    else if (d && confirm('¿Borrar este viaje del móvil? Lo apuntado en él también se pierde.')) DB.del(d.getAttribute('data-del')).then(function () { Album.reset(); renderList(); });
  });
  $('#impFile').addEventListener('change', function () { if (this.files[0]) importTrip(this.files[0]); this.value = ''; });

  /* ---------- Servicios gratuitos ---------- */
  function getJSON(url, opt) {
    return fetch(url, opt).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status + ' · ' + url.split('?')[0]); return r.json(); });
  }
  // Nominatim pide como mucho una petición por segundo
  var nomLast = 0;
  function nominatim(params) {
    var wait = Math.max(0, nomLast + 1100 - Date.now()); nomLast = Date.now() + wait;
    return sleep(wait).then(function () {
      return getJSON('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&accept-language=es&' + params);
    });
  }
  // fetch con tiempo máximo: los servidores gratuitos a veces se quedan colgados
  function fetchT(url, opt, ms) {
    var c = window.AbortController ? new AbortController() : null, t = c ? setTimeout(function () { c.abort(); }, ms) : 0;
    opt = opt || {}; if (c) opt.signal = c.signal;
    return fetch(url, opt).then(function (r) { clearTimeout(t); return r; }, function (e) { clearTimeout(t); throw e; });
  }
  // Overpass (OpenStreetMap): varios servidores; si todos fallan, la guía sigue sin esos datos
  var OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
  function overpass(q, k) {
    k = k || 0;
    return fetchT(OVERPASS[k], { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 25000)
      .then(function (r) { if (!r.ok) throw new Error('Overpass ' + r.status); return r.json(); })
      .catch(function (err) { if (k + 1 < OVERPASS.length) return sleep(500).then(function () { return overpass(q, k + 1); }); throw err; });
  }
  // Wikidata: sitios conocidos alrededor de un punto, con su tipo, foto y web oficial
  var WD_TYPES = {
    Q23413: 'castle', Q16560: 'castle', Q57821: 'castle', Q33506: 'museum', Q207694: 'museum', Q1007870: 'museum', Q2087181: 'museum',
    Q2977: 'church', Q16970: 'church', Q44613: 'ruins', Q839954: 'ruins', Q109607: 'ruins', Q4989906: 'monument', Q5003624: 'monument',
    Q12518: 'monument', Q12280: 'monument', Q174782: 'monument', Q570116: 'attraction', Q22698: 'park', Q1107656: 'park', Q34038: 'waterfall',
    Q8502: 'peak', Q40080: 'beach', Q46169: 'reserve', Q179049: 'reserve', Q6017969: 'viewpoint', Q35509: 'beach', Q23397: 'viewpoint',
    Q43501: 'family', Q2416723: 'family'
  };
  var KIND_ORDER = ['castle', 'museum', 'ruins', 'church', 'waterfall', 'peak', 'viewpoint', 'beach', 'reserve', 'family', 'park', 'monument', 'attraction'];
  function sparql(q, tries) {
    tries = tries || 0;
    return fetchT('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), { headers: { Accept: 'application/sparql-results+json' } }, 45000)
      .then(function (r) {
        if ((r.status === 429 || r.status >= 500) && tries < 2) return sleep(4000).then(function () { return sparql(q, tries + 1); });
        if (!r.ok) throw new Error('Wikidata ' + r.status); return r.json();
      });
  }
  function sightsAround(c, rKm, minLinks) {
    var q = 'SELECT ?item (SAMPLE(?les) AS ?es) (SAMPLE(?len) AS ?en) (SAMPLE(?coord) AS ?c) (MAX(?links) AS ?n) (SAMPLE(?img) AS ?image) (SAMPLE(?web) AS ?site)' +
      " (GROUP_CONCAT(DISTINCT STRAFTER(STR(?cls), 'entity/'); separator=' ') AS ?types) WHERE {" +
      ' SERVICE wikibase:around { ?item wdt:P625 ?coord. bd:serviceParam wikibase:center "Point(' + c.lon.toFixed(4) + ' ' + c.lat.toFixed(4) + ')"^^geo:wktLiteral. bd:serviceParam wikibase:radius "' + rKm + '". }' +
      ' ?item wikibase:sitelinks ?links. FILTER(?links >= ' + minLinks + ')' +
      ' VALUES ?cls { ' + Object.keys(WD_TYPES).map(function (k) { return 'wd:' + k; }).join(' ') + ' }' +
      ' ?item wdt:P31/wdt:P279? ?cls.' +
      " OPTIONAL { ?item rdfs:label ?les. FILTER(LANG(?les) = 'es') } OPTIONAL { ?item rdfs:label ?len. FILTER(LANG(?len) = 'en') }" +
      ' OPTIONAL { ?item wdt:P18 ?img. } OPTIONAL { ?item wdt:P856 ?web. }' +
      '} GROUP BY ?item ORDER BY DESC(?n) LIMIT 120';
    return sparql(q).then(function (j) {
      return (j.results.bindings || []).map(function (b) {
        var m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(b.c.value), types = b.types.value.split(' '), kind = null;
        KIND_ORDER.some(function (k) { if (types.some(function (t) { return WD_TYPES[t] === k; })) { kind = k; return true; } return false; });
        return { wd: b.item.value.split('/').pop(), n: (b.es || b.en || {}).value, lat: m ? +m[2] : null, lon: m ? +m[1] : null, links: +b.n.value, kind: kind,
          img: b.image ? b.image.value.replace(/^http:/, 'https:') + '?width=800' : '', web: b.site ? b.site.value : '' };
      }).filter(function (x) { return x.n && x.kind && x.lat != null && !/^Q\d+$/.test(x.n); });
    });
  }
  // de tipo de sitio a lo que usa la guía: tipo, interés, duración (min), al aire libre, icono
  var KIND = {
    castle: { t: 'visit', cat: 'castles', d: 90, icon: 'castle' }, museum: { t: 'visit', cat: 'museums', d: 90, icon: 'castle', rain: 1 },
    ruins: { t: 'visit', cat: 'history', d: 50, icon: 'castle', out: 1 }, church: { t: 'visit', cat: 'history', d: 35, icon: 'castle', rain: 1 },
    monument: { t: 'walk', cat: 'towns', d: 25, icon: 'pin', out: 1 }, attraction: { t: 'walk', cat: 'towns', d: 40, icon: 'pin' },
    viewpoint: { t: 'view', cat: 'nature', d: 25, icon: 'mountain', out: 1, photo: 1 }, peak: { t: 'view', cat: 'nature', d: 30, icon: 'mountain', out: 1, photo: 1 },
    waterfall: { t: 'walk', cat: 'nature', d: 40, icon: 'waves', out: 1, photo: 1 }, beach: { t: 'walk', cat: 'nature', d: 50, icon: 'waves', out: 1 },
    reserve: { t: 'walk', cat: 'nature', d: 75, icon: 'mountain', out: 1 }, park: { t: 'walk', cat: 'parks', d: 45, icon: 'pin', out: 1 },
    family: { t: 'visit', cat: 'family', d: 150, icon: 'pin' }
  };
  function wikidata(ids) {
    var out = {}, batches = [];
    for (var i = 0; i < ids.length; i += 50) batches.push(ids.slice(i, i + 50));
    return batches.reduce(function (pr, b) {
      return pr.then(function () {
        return getJSON('https://www.wikidata.org/w/api.php?action=wbgetentities&props=sitelinks&format=json&origin=*&ids=' + b.join('|')).then(function (j) {
          Object.keys(j.entities || {}).forEach(function (q) {
            var sl = (j.entities[q] || {}).sitelinks || {};
            out[q] = { n: Object.keys(sl).length, es: sl.eswiki && sl.eswiki.title, en: sl.enwiki && sl.enwiki.title };
          });
        });
      });
    }, Promise.resolve()).then(function () { return out; });
  }
  function wikiSummary(lang, title) {
    return getJSON('https://' + lang + '.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title.replace(/ /g, '_'))).catch(function () { return null; });
  }
  function osrmTable(pts, foot) {
    var coords = pts.map(function (p) { return (+p.lon).toFixed(5) + ',' + (+p.lat).toFixed(5); }).join(';');
    var url = foot ? 'https://routing.openstreetmap.de/routed-foot/table/v1/driving/' : 'https://router.project-osrm.org/table/v1/driving/';
    return getJSON(url + coords + '?annotations=duration,distance');
  }

  /* ---------- Sol: salida y puesta (NOAA simplificado), en minutos UTC ---------- */
  function sunUTC(iso, lat, lon) {
    var d = new Date(iso + 'T12:00:00Z'), J = d.getTime() / 864e5 + 2440587.5, n = Math.round(J - 2451545.0 + 0.0008);
    var r = Math.PI / 180, M = (357.5291 + 0.98560028 * (n - lon / 360)) % 360, Mr = M * r;
    var C = 1.9148 * Math.sin(Mr) + 0.02 * Math.sin(2 * Mr) + 0.0003 * Math.sin(3 * Mr), L = (M + C + 180 + 102.9372) % 360;
    var Jt = 2451545.0 + (n - lon / 360) + 0.0053 * Math.sin(Mr) - 0.0069 * Math.sin(2 * L * r);
    var dec = Math.asin(Math.sin(L * r) * Math.sin(23.44 * r));
    var cw = (Math.sin(-0.83 * r) - Math.sin(lat * r) * Math.sin(dec)) / (Math.cos(lat * r) * Math.cos(dec));
    cw = Math.max(-1, Math.min(1, cw));
    var w = Math.acos(cw) / r / 360, noon = (Jt - 2440587.5) * 1440 - Math.floor((Jt - 2440587.5)) * 1440;
    return { rise: noon - w * 1440, set: noon + w * 1440 };
  }

  /* ---------- Asistente: formulario ---------- */
  var W = { dest: null, mode: 'car', pace: 5, ints: { castles: 1, history: 1, museums: 1, nature: 1, towns: 1 }, bundle: null };
  $('#newBtn').addEventListener('click', function () { $('#wiz').hidden = false; $('#wiz').scrollIntoView({ behavior: 'smooth' }); $('#wDest').focus(); });
  (function () {
    var s = $('#wDays'); for (var i = 1; i <= 7; i++) s.insertAdjacentHTML('beforeend', '<option value="' + i + '"' + (i === 4 ? ' selected' : '') + '>' + i + '</option>');
    var t = new Date(); t.setDate(t.getDate() + 30); $('#wStart').value = t.toISOString().slice(0, 10);
  })();
  $$('[data-one]').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('.opt'); if (!b) return;
      $$('.opt', g).forEach(function (x) { x.classList.toggle('on', x === b); });
      W[g.getAttribute('data-one')] = g.getAttribute('data-one') === 'pace' ? +b.getAttribute('data-v') : b.getAttribute('data-v');
    });
  });
  $('[data-many]').addEventListener('click', function (e) {
    var b = e.target.closest('.opt'); if (!b) return;
    b.classList.toggle('on'); var v = b.getAttribute('data-v'); if (b.classList.contains('on')) W.ints[v] = 1; else delete W.ints[v];
  });
  function renderNights() {
    var n = +$('#wDays').value, start = $('#wStart').value, old = $$('#wNights input').map(function (i) { return i.value; });
    var h = '';
    for (var k = 0; k < Math.max(1, n - 1); k++) h += '<div class="night"><span>Noche ' + (k + 1) + '<br><small class="note" style="margin:0">' + (start ? esc(dateLbl(addDays(start, k))) : '') + '</small></span><input type="text" data-night="' + k + '" value="' + esc(old[k] || '') + '" placeholder="Hotel o dirección"></div>';
    $('#wNights').innerHTML = h;
    $$('#wFixed select').forEach(function (s) { var v = s.value; s.innerHTML = dayOpts(); s.value = v; });
  }
  function dayOpts() { var n = +$('#wDays').value, o = ''; for (var k = 0; k < n; k++) o += '<option value="' + k + '">Día ' + (k + 1) + '</option>'; return o; }
  $('#wDays').addEventListener('change', renderNights); $('#wStart').addEventListener('change', renderNights); renderNights();
  $('#wFixAdd').addEventListener('click', function () {
    $('#wFixed').insertAdjacentHTML('beforeend', '<div class="fx"><input type="text" placeholder="Sitio (p. ej. Galería Uffizi)" data-fxn><select data-fxd>' + dayOpts() + '</select><input type="time" data-fxt value="10:00"></div>');
  });
  function destSearch() {
    var q = $('#wDest').value.trim(); if (!q) return;
    $('#wHits').innerHTML = '<p class="note">Buscando…</p>';
    nominatim('limit=6&q=' + encodeURIComponent(q)).then(function (r) {
      W.hits = r;
      $('#wHits').innerHTML = r.length ? r.map(function (h, k) {
        return '<button type="button" class="hit" data-hit="' + k + '">' + esc(h.name || h.display_name.split(',')[0]) + '<small>' + esc(h.display_name) + '</small></button>';
      }).join('') : '<p class="note">No lo encuentro. Prueba con otro nombre.</p>';
    }).catch(function () { $('#wHits').innerHTML = '<p class="note">Sin conexión con OpenStreetMap. Inténtalo de nuevo.</p>'; });
  }
  $('#wDestGo').addEventListener('click', destSearch);
  $('#wDest').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); destSearch(); } });
  $('#wHits').addEventListener('click', function (e) {
    var b = e.target.closest('[data-hit]'); if (!b) return;
    $$('.hit').forEach(function (x) { x.classList.toggle('on', x === b); });
    var h = W.hits[+b.getAttribute('data-hit')];
    W.dest = { name: h.name || h.display_name.split(',')[0], full: h.display_name, lat: +h.lat, lon: +h.lon, bb: h.boundingbox.map(Number), cc: (h.address && h.address.country_code || '').toUpperCase(), country: h.address && h.address.country };
    if (!$('#wName').value) $('#wName').placeholder = W.dest.name + ' en ' + $('#wDays').value + ' días';
  });

  /* ---------- Registro de pasos ---------- */
  function step(txt) {
    var li = document.createElement('li'); li.className = 'run'; li.textContent = txt; $('#wLog').appendChild(li);
    return { ok: function (t2) { li.className = 'ok'; if (t2) li.textContent = t2; }, warn: function (t2) { li.className = 'warn'; if (t2) li.textContent = t2; } };
  }

  /* ---------- Datos de OpenStreetMap ---------- */
  function nameOf(tg) { return tg['name:es'] || tg.name || tg['name:en']; }
  function placeOf(tg, fallback) { return tg['addr:city'] || tg['addr:town'] || tg['addr:village'] || tg['is_in:city'] || fallback || ''; }

  function foodQuery(pts) {
    var parts = pts.map(function (p) { return 'nwr(around:' + (p.r || 900) + ',' + p.lat.toFixed(5) + ',' + p.lon.toFixed(5) + ')["amenity"~"^(restaurant|pub|cafe)$"]["name"];'; });
    return '[out:json][timeout:25];(' + parts.join('') + ');out center tags 600;';
  }
  function ll(el) { return el.center ? { lat: el.center.lat, lon: el.center.lon } : { lat: el.lat, lon: el.lon }; }

  /* ---------- El algoritmo ---------- */
  function generate() {
    $('#wLog').innerHTML = ''; $('#wDone').hidden = true; $('#aiBox').hidden = true;
    if (!W.dest) { alert('Elige primero el destino de la lista.'); return; }
    var nDays = +$('#wDays').value, start = $('#wStart').value, walk = W.mode !== 'car';
    if (!start) { alert('Pon la fecha del primer día.'); return; }
    var title = $('#wName').value.trim() || (W.dest.name + ' en ' + nDays + ' días');
    var id = 'u-' + W.dest.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').slice(0, 24) + '-' + Math.random().toString(36).slice(2, 6);
    var nightsTxt = $$('#wNights input').map(function (i) { return i.value.trim(); });
    var fixed = $$('#wFixed .fx').map(function (r) { return { n: $('[data-fxn]', r).value.trim(), day: +$('[data-fxd]', r).value, at: $('[data-fxt]', r).value }; }).filter(function (f) { return f.n && f.at; });
    var fin = { t: $('#wInT').value, p: $('#wInP').value.trim() }, fout = { t: $('#wOutT').value, p: $('#wOutP').value.trim() };
    var center = { lat: W.dest.lat, lon: W.dest.lon }, bb = W.dest.bb;
    var near = 'viewbox=' + [bb[2] - 0.5, bb[1] + 0.5, bb[3] + 0.5, bb[0] - 0.5].join(',');
    var nights = [], airIn = null, airOut = null, fixedPts = [], tz = 'UTC', tzOff = 0, sources = [];
    $('#wGo').disabled = true;

    var s1 = step('Buscando hoteles, aeropuertos y entradas en OpenStreetMap');
    function geo(q) { return q ? nominatim('limit=1&' + near + '&q=' + encodeURIComponent(q)).then(function (r) { return r[0] ? { lat: +r[0].lat, lon: +r[0].lon, name: q, town: (r[0].address || {}).city || (r[0].address || {}).town || (r[0].address || {}).village || '' } : null; }).catch(function () { return null; }) : Promise.resolve(null); }
    var chain = Promise.resolve(), missing = [];
    nightsTxt.forEach(function (q, k) { chain = chain.then(function () { return geo(q); }).then(function (g) { if (q && !g) missing.push(q); nights[k] = g; }); });
    chain = chain.then(function () { return geo(fin.p && fin.p + ' airport'); }).then(function (g) { airIn = g; })
      .then(function () { return geo(fout.p && fout.p + ' airport'); }).then(function (g) { airOut = g; });
    fixed.forEach(function (f) { chain = chain.then(function () { return geo(f.n); }).then(function (g) { if (!g) missing.push(f.n); f.pt = g; }); });

    return chain.then(function () {
      // noches vacías: la anterior; la primera, el centro del destino
      for (var k = 0; k < Math.max(1, nDays - 1); k++) nights[k] = nights[k] || (k ? nights[k - 1] : { lat: center.lat, lon: center.lon, name: '', town: W.dest.name });
      s1.ok(missing.length ? 'Anclas listas (no encontré: ' + missing.join(', ') + '; se usa el centro)' : 'Anclas listas');
      var s2 = step('Zona horaria y temperaturas típicas (Open-Meteo)');
      return getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + center.lat + '&longitude=' + center.lon + '&timezone=auto&forecast_days=1&daily=sunrise')
        .then(function (j) { tz = j.timezone || 'UTC'; tzOff = Math.round((j.utc_offset_seconds || 0) / 60); s2.ok('Zona horaria: ' + tz); })
        .catch(function () { s2.warn('Sin zona horaria: uso la de tu móvil'); tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; });
    }).then(function () {
      // círculos de búsqueda: a pie, alrededor de cada alojamiento; en coche, a lo largo del camino de cada día
      var areas = [];
      function addArea(p) { if (p && !areas.some(function (a) { return km(a, p) < (walk ? 1.5 : 15); })) areas.push({ lat: p.lat, lon: p.lon }); }
      for (var k = 0; k < nDays; k++) {
        var S = k === 0 ? (airIn || nights[0]) : nights[k - 1], E = k === nDays - 1 ? (airOut || nights[Math.max(0, k - 1)]) : nights[k], L = km(S, E);
        addArea(S); addArea(E);
        if (!walk) for (var f = 30; f < L; f += 30) addArea({ lat: S.lat + (E.lat - S.lat) * f / L, lon: S.lon + (E.lon - S.lon) * f / L });
      }
      if (walk) addArea(center);
      var s3 = step('Buscando qué ver (Wikidata): 0 de ' + areas.length + ' zonas'), found = {}, done = 0, fails = 0;
      function one(a) {
        return sightsAround(a, walk ? 3 : 20, walk ? 3 : 4).then(function (list) {
          list.forEach(function (x) { if (!found[x.wd]) found[x.wd] = x; });
        }).catch(function () { fails++; }).then(function () { done++; s3.ok('Buscando qué ver (Wikidata): ' + done + ' de ' + areas.length + ' zonas'); });
      }
      // de dos en dos, para no saturar el servicio
      var queue = areas.slice();
      function worker() { return queue.length ? one(queue.shift()).then(worker) : Promise.resolve(); }
      return Promise.all([worker(), worker()]).then(function () {
        var pois = Object.keys(found).map(function (q) { var x = found[q]; x.c = KIND[x.kind]; x.osm = 'wd:' + q; x.tg = {}; return x; });
        if (!pois.length) throw new Error(fails ? 'Wikidata no responde ahora' : 'No he encontrado sitios conocidos en esa zona');
        s3.ok(pois.length + ' sitios conocidos encontrados' + (fails ? ' (' + fails + ' zonas sin respuesta)' : '')); sources.push('Wikidata');
        if (walk) return pois;
        // miradores de OpenStreetMap (muchos no están en Wikidata); si Overpass no responde, se sigue sin ellos
        var s3b = step('Miradores (OpenStreetMap)');
        var qv = '[out:json][timeout:25];(' + areas.map(function (a) { return 'nwr(around:15000,' + a.lat.toFixed(4) + ',' + a.lon.toFixed(4) + ')["tourism"="viewpoint"]["name"];'; }).join('') + ');out center tags 120;';
        return overpass(qv).then(function (j) {
          var n0 = 0;
          (j.elements || []).forEach(function (el) {
            var p = ll(el), nm = nameOf(el.tags || {}); if (!nm || p.lat == null) return;
            if (pois.some(function (x) { return km(x, p) < 0.3; })) return;
            pois.push({ wd: (el.tags || {}).wikidata || null, n: nm, lat: p.lat, lon: p.lon, links: 0, kind: 'viewpoint', c: KIND.viewpoint, osm: el.type + '/' + el.id, tg: el.tags || {} }); n0++;
          });
          s3b.ok(n0 + ' miradores'); sources.push('OpenStreetMap'); return pois;
        }).catch(function () { s3b.warn('OpenStreetMap no responde ahora: sigo sin miradores extra'); return pois; });
      }).then(function (pois) {
        var s4 = step('Artículos de Wikipedia');
        return wikidata(pois.filter(function (p) { return p.wd; }).map(function (p) { return p.wd; })).catch(function () { return {}; }).then(function (wd) {
          pois.forEach(function (p) {
            var w = wd[p.wd] || {}; p.wiki = w.es ? ['es', w.es] : w.en ? ['en', w.en] : null;
            p.score = (W.ints[p.c.cat] ? 1.6 : 0.55) * (1 + Math.log(1 + (p.links || 0))) * (p.wd ? 1 : 0.6);
          });
          s4.ok(pois.filter(function (p) { return p.wiki; }).length + ' con artículo');
          return pois.sort(function (a, b) { return b.score - a.score; }).slice(0, 250);
        });
      });
    }).then(function (pois) {
      var s5 = step('Repartiendo los sitios por días');
      var days = planDays(pois, { nDays: nDays, start: start, walk: walk, pace: W.pace, nights: nights, airIn: airIn, airOut: airOut, fin: fin, fout: fout, fixed: fixed, center: center, tzOff: tzOff });
      s5.ok(days.map(function (d, k) { return 'Día ' + (k + 1) + ': ' + d.stops.length; }).join(' · ') + ' paradas');
      return { pois: pois, days: days };
    }).then(function (P) {
      var s6 = step('Restaurantes y bares cerca (OpenStreetMap)');
      var pts = [];
      P.days.forEach(function (d) { pts.push(d.lunchAt, d.end); });
      return overpass(foodQuery(pts.filter(Boolean))).then(function (j) {
        P.food = (j.elements || []).map(function (el) { var p = ll(el); return { tg: el.tags || {}, n: nameOf(el.tags || {}), lat: p.lat, lon: p.lon }; }).filter(function (f) { return f.n && f.lat != null; });
        s6.ok(P.food.length + ' sitios para comer'); return P;
      }).catch(function () { s6.warn('OpenStreetMap no responde ahora: las comidas irán con un enlace para buscar sitio cerca'); P.food = []; return P; });
    }).then(function (P) {
      var s7 = step('Descripciones y fotos (Wikipedia)');
      var used = []; P.days.forEach(function (d) { d.stops.forEach(function (s) { used.push(s); }); (d.extras || []).forEach(function (s) { used.push(s); }); });
      var list = used.filter(function (p) { return p.wiki; }), k = 0;
      function worker() {
        if (k >= list.length) return Promise.resolve();
        var p = list[k++];
        return wikiSummary(p.wiki[0], p.wiki[1]).then(function (sm) {
          if (sm) {
            p.lead = firstSentences(sm.extract || '', 2);
            if (!p.img && sm.thumbnail && sm.thumbnail.source) p.img = sm.thumbnail.source.replace(/\/\d+px-/, '/800px-');
            p.page = sm.content_urls && sm.content_urls.desktop && sm.content_urls.desktop.page;
          }
        }).then(worker);
      }
      return Promise.all([worker(), worker(), worker(), worker()]).then(function () {
        s7.ok(list.filter(function (p) { return p.img; }).length + ' fotos y ' + list.filter(function (p) { return p.lead; }).length + ' descripciones'); sources.push('Wikipedia');
        return P;
      });
    }).then(function (P) {
      var s8 = step('Tiempos reales en ' + (walk ? 'a pie y en coche' : 'coche') + ' (OSRM)');
      var bundle = assemble(P, { id: id, title: title, start: start, nDays: nDays, walk: walk, mode: W.mode, tz: tz, tzOff: tzOff, nights: nights, fin: fin, fout: fout, sources: sources });
      return travelTable(bundle).then(function (tv) { bundle.travel = tv; s8.ok('Rutas calculadas entre ' + tv.k.length + ' puntos'); sources.push('OSRM'); return bundle; })
        .catch(function () { s8.warn('Sin rutas reales: la guía estimará los tiempos por distancia'); return bundle; });
    }).then(function (bundle) {
      var s9 = step('Temperaturas típicas de esas fechas (Open-Meteo)');
      return climate(bundle).then(function () { s9.ok('Hecho'); }, function () { s9.warn('Sin datos de clima: se verá la previsión cuando falten pocos días'); }).then(function () { return bundle; });
    }).then(function (bundle) {
      bundle.meta.generated.sources = sources;
      return DB.put({ id: bundle.meta.id, at: Date.now(), bundle: bundle }).then(function () {
        W.bundle = bundle; Album.reset();
        step('Guía guardada en el móvil').ok();
        $('#wDone').hidden = false; $('#aiBox').hidden = false; $('#wGo').disabled = false;
        renderList();
      });
    }).catch(function (err) {
      step('Algo falló: ' + (err && err.message || err) + '. Comprueba la conexión y vuelve a intentarlo.').warn();
      $('#wGo').disabled = false;
    });
  }
  function firstSentences(t, n) { var m = String(t).replace(/\s*\([^)]*\)/g, '').match(/[^.!?]+[.!?]+/g); return m ? m.slice(0, n).join('').trim() : String(t).slice(0, 220); }

  // Reparto: cada día va de donde se durmió (o el aeropuerto) a donde se duerme;
  // se meten los sitios más conocidos que caen de camino, mientras haya tiempo y luz
  function planDays(pois, o) {
    var used = {}, out = [], speed = o.walk ? 4.5 : 55, fac = o.walk ? 1.3 : 1.35, stopMin = o.walk ? 0 : 5;
    function tt(a, b) { return km(a, b) * fac / speed * 60 + (km(a, b) > 0.3 ? stopMin : 0); }
    for (var k = 0; k < o.nDays; k++) {
      var iso = addDays(o.start, k), last = k === o.nDays - 1;
      var S = k === 0 ? (o.airIn || o.nights[0]) : o.nights[k - 1];
      var E = last ? (o.airOut || o.nights[Math.max(0, k - 1)]) : o.nights[k];
      var sun = sunUTC(iso, S.lat, S.lon), set = sun.set + o.tzOff;
      var t0 = 9 * 60, t1 = Math.min(19 * 60, Math.max(17 * 60, set + (o.walk ? 120 : 45)));
      if (k === 0 && o.fin.t) t0 = Math.max(t0, hm(o.fin.t) + (o.walk ? 75 : 105));
      if (last && o.fout.t) t1 = Math.min(t1, hm(o.fout.t) - 150 - (o.walk ? 40 : tt(S, E) + 30));
      var budget = t1 - t0 - 60;   // 1 h para comer
      var cap = o.pace + (o.walk ? 1 : 0);
      var route = [S, E], stops = [];
      // entradas con hora del día: van sí o sí
      o.fixed.filter(function (f) { return f.day === k && f.pt; }).sort(function (a, b) { return hm(a.at) - hm(b.at); }).forEach(function (f) {
        var p = { n: f.n, lat: f.pt.lat, lon: f.pt.lon, c: { t: 'visit', cat: 'fixed', d: 90, icon: 'castle' }, fixedAt: f.at, tg: {} };
        route.splice(route.length - 1, 0, p); stops.push(p);
      });
      function cost(r) { var c = 0; for (var i = 1; i < r.length; i++) c += tt(r[i - 1], r[i]) + (r[i].c ? r[i].c.d : 0); return c; }
      var corridor = km(S, E), maxDet = o.walk ? 2.5 : Math.max(25, corridor * 0.35);
      var cands = pois.filter(function (p) { return !used[p.osm] && km(S, p) + km(p, E) - corridor <= maxDet * 2 && (o.walk ? Math.min(km(S, p), km(E, p)) < 4 : true); });
      for (var c = 0; c < cands.length && stops.length < cap; c++) {
        var p = cands[c]; if (used[p.osm]) continue;
        var best = null, bi = -1, bestR = null;
        for (var i = 1; i < route.length; i++) {
          var r2 = route.slice(0, i).concat([p], route.slice(i)), cst = cost(r2);
          if (best == null || cst < best) { best = cst; bi = i; bestR = r2; }
        }
        if (best == null || best > budget) continue;
        // al aire libre y ya de noche: mejor no
        var arr = t0 + cost(bestR.slice(0, bi + 1)) - p.c.d;
        if (p.c.out && arr > set + 20) continue;
        route.splice(bi, 0, p); stops.push(p); used[p.osm] = 1;
      }
      // dónde comer: la parada en la que se pasa de las 13:00
      var tcur = t0, lunchAt = null;
      for (var j = 1; j < route.length - 1; j++) { tcur += tt(route[j - 1], route[j]) + route[j].c.d; if (!lunchAt && tcur >= 13 * 60) lunchAt = { lat: route[j].lat, lon: route[j].lon, after: j }; }
      if (!lunchAt && route.length > 2) lunchAt = { lat: route[route.length - 2].lat, lon: route[route.length - 2].lon, after: route.length - 2 };
      // ideas sin usar cerca (alternativas y plan B de lluvia)
      var extras = cands.filter(function (p) { return !used[p.osm] && (p.c.rain || p.links > 3); }).slice(0, 8);
      extras.forEach(function (p) { used[p.osm] = 1; });
      out.push({ k: k, iso: iso, S: S, E: E, route: route, stops: route.slice(1, -1), lunchAt: lunchAt, end: { lat: E.lat, lon: E.lon, r: 700 }, extras: extras, t0: t0, last: last, set: set });
    }
    return out;
  }

  // de los resultados a los datos que entiende la guía (mismo formato que Escocia)
  function assemble(P, o) {
    var photos = {}, credits = [], nPh = 0, foodUsed = {};
    function photo(p) {
      if (!p.img) return '';
      var key = 'w' + (++nPh); photos[key] = p.img;
      var file = decodeURIComponent((p.img.split('/').pop() || '').replace(/^\d+px-/, ''));
      credits.push({ place: p.n, artist: 'Wikimedia Commons', lic: 'ver licencia', page: 'https://commons.wikimedia.org/wiki/File:' + file });
      return key;
    }
    function foodNear(pt, n) {
      return P.food.filter(function (f) { return !foodUsed[f.n] && km(pt, f) < (pt.r ? pt.r / 1000 + 0.3 : 1.2); })
        .sort(function (a, b) { return rich(b) - rich(a) || km(pt, a) - km(pt, b); }).slice(0, n || 1);
    }
    function rich(f) { var t = f.tg; return (t.cuisine ? 1 : 0) + (t.opening_hours ? 1 : 0) + (t.website || t['contact:website'] ? 1 : 0) + (t.wikidata ? 2 : 0); }
    function hours(tg) { return tg.opening_hours ? 'Horario en OpenStreetMap: ' + tg.opening_hours + ' (compruébalo antes de ir).' : ''; }
    var stays = [], days = [], route = [], wx = [];
    P.days.forEach(function (d, k) {
      var did = 'd' + (k + 1), items = [], n = 0, town = d.E.town || (d.E.name ? '' : W.dest.name);
      function id() { return did + '-' + (++n); }
      if (k === 0 && o.fin.t) {
        items.push({ id: id(), t: 'train', ti: 'Llegada' + (o.fin.p ? ' a ' + o.fin.p : ''), at: o.fin.t, d: o.walk ? 45 : 30, lat: d.S.lat, lon: d.S.lon, tips: ['Cuenta con el control de pasaportes y las maletas.'] });
        if (!o.walk) items.push({ id: id(), t: 'car', ti: 'Recoger el coche de alquiler', d: 45, lat: d.S.lat, lon: d.S.lon, pickup: 1, tips: ['Revisa el coche y haz fotos antes de salir.'] });
      } else if (k > 0) {
        var moved = km(P.days[k - 1].E, d.E) > 1;
        items.push({ id: id(), t: 'food', ti: moved ? 'Desayuno y check-out' : 'Desayuno', d: moved ? 45 : 30, lat: d.S.lat, lon: d.S.lon });
      }
      var topIds = d.stops.filter(function (p) { return p.links; }).sort(function (a, b) { return b.links - a.links; }).slice(0, 2).map(function (p) { return p.osm; });
      d.route.slice(1, -1).forEach(function (p, j) {
        var tg = p.tg || {}, it = { id: id(), t: p.c.t, ti: p.n, pl: placeOf(tg, ''), d: p.c.d, lat: +p.lat.toFixed(5), lon: +p.lon.toFixed(5), q: p.n + (placeOf(tg, '') ? ', ' + placeOf(tg, '') : '') };
        if (topIds.indexOf(p.osm) >= 0) it.must = 1;
        if (p.fixedAt) { it.at = p.fixedAt; it.tips = ['Entrada con hora: llega 15 min antes.']; }
        if (p.lead) it.lead = p.lead;
        var tips = (it.tips || []).slice(), h = hours(tg); if (h) tips.push(h);
        var web = p.web || tg.website || tg['contact:website']; if (web) tips.push('Web oficial: ' + web);
        if (!h) tips.push('Comprueba horario y precio en la web oficial antes de ir.');
        if (tips.length) it.tips = tips;
        var ph = photo(p); if (ph) it.ph = ph;
        var tags = []; if (p.c.photo) tags.push('photo'); if (p.c.rain) tags.push('rain'); if (tags.length) it.tags = tags;
        if (p.c.out) it.light = 1;
        if (p.page) it.see = ['Más en Wikipedia: ' + p.page];
        it.src = { osm: p.osm, wd: p.wd || null, links: p.links || 0 };
        items.push(it);
        if (d.lunchAt && d.lunchAt.after === j + 1) {
          var f = foodNear({ lat: p.lat, lon: p.lon })[0];
          if (f) foodUsed[f.n] = 1;
          items.push({ id: id(), t: 'food', ti: f ? 'Comida en ' + f.n : 'Comida', pl: f ? placeOf(f.tg, it.pl) : it.pl, d: 60, lat: f ? +f.lat.toFixed(5) : it.lat, lon: f ? +f.lon.toFixed(5) : it.lon,
            q: f ? f.n + (placeOf(f.tg) ? ', ' + placeOf(f.tg) : '') : 'restaurantes cerca de ' + p.n, tips: f ? [f.tg.cuisine ? 'Cocina: ' + f.tg.cuisine.replace(/;/g, ', ') + '.' : '', hours(f.tg)].filter(Boolean) : ['Busca sitio por la zona: el botón de Maps abre los restaurantes cercanos.'] });
        }
      });
      if (d.last && o.fout.t) {
        if (!o.walk) items.push({ id: id(), t: 'car', ti: 'Devolver el coche', d: 30, lat: d.E.lat, lon: d.E.lon });
        items.push({ id: id(), t: 'train', ti: 'Aeropuerto · vuelo a las ' + o.fout.t, at: fmt(hm(o.fout.t) - 120), d: 120, lat: d.E.lat, lon: d.E.lon, tips: ['Llega 2 h antes del vuelo.'] });
      } else {
        // fin del día: alojamiento (si no es el último) y cena a hora de cenar, cerca de donde se duerme
        if (!d.last) items.push({ id: id(), t: 'hotel', ti: 'Check-in' + (d.E.name ? ' en ' + d.E.name : ' en ' + (town || 'el alojamiento')), d: 30, lat: d.E.lat, lon: d.E.lon, stay: did });
        var dn = foodNear(d.end)[0]; if (dn) foodUsed[dn.n] = 1;
        items.push({ id: id(), t: 'food', ti: dn ? 'Cena en ' + dn.n : 'Cena', pl: dn ? placeOf(dn.tg, town) : town, at: '19:30', d: 90, lat: dn ? +dn.lat.toFixed(5) : d.E.lat, lon: dn ? +dn.lon.toFixed(5) : d.E.lon,
          q: dn ? dn.n + (placeOf(dn.tg, town) ? ', ' + placeOf(dn.tg, town) : '') : 'restaurantes cerca de ' + (d.E.name || town || W.dest.name), tips: dn ? [dn.tg.cuisine ? 'Cocina: ' + dn.tg.cuisine.replace(/;/g, ', ') + '.' : '', hours(dn.tg)].filter(Boolean) : [] });
        if (!d.last) stays.push({ id: did, town: town || W.dest.name, lat: d.E.lat, lon: d.E.lon });
      }
      // más ideas cerca y sitios para comer
      var extras = d.extras.map(function (p, j) {
        var tg = p.tg || {}, x = { id: 'x-' + did + '-' + (j + 1), t: p.c.t, ti: p.n, pl: placeOf(tg, ''), d: p.c.d, lat: +p.lat.toFixed(5), lon: +p.lon.toFixed(5) };
        if (p.lead) x.lead = p.lead; var ph = photo(p); if (ph) x.ph = ph;
        var tags = []; if (p.c.rain) tags.push('rain'); if (p.c.photo) tags.push('photo'); if (tags.length) x.tags = tags;
        return x;
      });
      var guide = foodNear({ lat: d.end.lat, lon: d.end.lon, r: 1200 }, 8).concat(d.lunchAt ? foodNear({ lat: d.lunchAt.lat, lon: d.lunchAt.lon, r: 900 }, 4) : []).map(function (f) {
        foodUsed[f.n] = 1;
        var kind = f.tg.amenity === 'pub' ? 'pub' : 'eat';
        return { k: kind, n: f.n, pl: placeOf(f.tg, town), p: '', t: [f.tg.cuisine ? 'Cocina: ' + f.tg.cuisine.replace(/;/g, ', ') : (kind === 'pub' ? 'Pub' : f.tg.amenity === 'cafe' ? 'Café' : 'Restaurante'), f.tg.opening_hours ? 'Horario (OSM): ' + f.tg.opening_hours : ''].filter(Boolean).join('. ') + '.' };
      });
      var top = d.stops.slice().sort(function (a, b) { return (b.links || 0) - (a.links || 0); });
      var topPh = top.filter(function (p) { return p.img; })[0];
      var dayTitle = (k === 0 && !o.fin.t ? '' : '') + (town || (top[0] && placeOf(top[0].tg, '')) || W.dest.name);
      var day = {
        id: did, title: dayTitle, sub: top.slice(0, 3).map(function (p) { return p.n; }).join(', ') || 'Día libre',
        ph: topPh ? Object.keys(photos).filter(function (kk) { return photos[kk] === topPh.img; })[0] : undefined,
        start: fmt(d.t0), ref: { name: town || W.dest.name, lat: d.E.lat, lon: d.E.lon }, icon: (top[0] && top[0].c.icon) || 'pin',
        tips: [], items: items, guide: guide, extras: extras
      };
      if (o.mode !== 'car') day.mode = o.mode;
      days.push(day);
      route.push({ n: day.title, k: k + 1, day: 'Día ' + (k + 1), ph: day.ph, go: (k + 1) + ':' + ((items.filter(function (i) { return i.src; })[0] || items[0] || {}).id || ''),
        t: (top[0] && top[0].lead) || day.sub, facts: top.slice(0, 3).map(function (p) { return p.n; }), must: top[0] ? top[0].n : '' });
      var wk = (town || W.dest.name); if (!wx.some(function (w) { return w.n === wk; })) wx.push({ n: wk, lat: d.E.lat, lon: d.E.lon, hi: null, lo: null, pass: 0 });
    });
    // wx: uno por día (la guía lo lee por índice de día)
    var wxDays = days.map(function (dd) { var w = wx.filter(function (x) { return x.n === dd.ref.name; })[0] || wx[0]; return { n: w.n, lat: w.lat, lon: w.lon, hi: w.hi, lo: w.lo, pass: 0 }; });
    var cur = CURRENCY[W.dest.cc] || ['€', 'c'];
    var meta = {
      id: o.id, storage: o.id, title: { es: o.title, en: o.title }, dest: { es: W.dest.name, en: W.dest.name }, home: { es: 'España', en: 'Spain' },
      region: W.dest.country || W.dest.name, roads: '', tz: o.tz, tzBase: o.tzOff, homeTz: 'Europe/Madrid', currency: cur[0], minor: cur[1],
      flights: { out: o.fin.t ? { date: o.start, time: o.fin.t } : {}, back: o.fout.t ? { date: addDays(o.start, o.nDays - 1), time: o.fout.t } : {}, hours: 24 },
      strings: {
        es: { coverTitle: esc(W.dest.name) + ' <em>en ' + o.nDays + ' días</em>', coverSub: '{0} – {1} · ' + esc(days.map(function (x) { return x.title; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 3).join(', ')), coverAria: esc(W.dest.name) },
        en: { coverTitle: esc(W.dest.name) + ' <em>in ' + o.nDays + ' days</em>', coverSub: '{0} – {1}', coverAria: esc(W.dest.name) }
      },
      mode: o.mode, autoLegs: true,
      generated: { at: new Date().toISOString(), by: 'asistente', dest: W.dest.full, verify: 'Horarios, precios y restaurantes salen de OpenStreetMap y Wikipedia: compruébalos.' }
    };
    var trip = {
      defaultStart: o.start, cover: days.map(function (x) { return x.ph; }).filter(Boolean)[0] || '', types: TYPES, events: [], checklist: checklist(o),
      days: days, souvenirs: [], route: route, wx: wxDays, links: [], driving: [], photoRoutes: [], stays: stays, filmRoutes: []
    };
    return { meta: meta, travel: {}, trip: trip, trip_en: {}, credits: credits, photos: photos };
  }

  // tabla de tiempos (mismo formato que la de Escocia): minutos y décimas de km en base 36
  function travelTable(b) {
    var pts = [], ix = {};
    b.trip.days.forEach(function (d) { d.items.concat(d.extras || []).forEach(function (it) { if (it.lat == null) return; var k = (+it.lat).toFixed(4) + ',' + (+it.lon).toFixed(4); if (ix[k] == null) { ix[k] = pts.length; pts.push({ lat: +it.lat, lon: +it.lon, k: k }); } }); });
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
  // temperaturas del mismo periodo el año pasado (Open-Meteo, archivo histórico)
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
  var CURRENCY = { GB: ['£', 'p'], US: ['$', '¢'], CH: ['CHF ', 'rp'], NO: ['kr ', 'øre'], SE: ['kr ', 'öre'], DK: ['kr ', 'øre'], IS: ['kr ', ''], CZ: ['Kč ', ''], PL: ['zł ', 'gr'], HU: ['Ft ', ''], JP: ['¥', ''], MA: ['DH ', ''], TR: ['₺', ''], CA: ['$', '¢'], AU: ['$', '¢'], MX: ['$', '¢'] };
  var TYPES = { food: { icon: 'food', label: 'Comer' }, visit: { icon: 'castle', label: 'Visita' }, walk: { icon: 'pin', label: 'Paseo' }, view: { icon: 'mountain', label: 'Mirador' },
    drive: { icon: 'car', label: 'Ruta' }, car: { icon: 'key', label: 'Coche' }, hotel: { icon: 'bed', label: 'Hotel' }, night: { icon: 'moon', label: 'Noche' }, tour: { icon: 'ghost', label: 'Tour' },
    train: { icon: 'plane', label: 'Viaje' }, shop: { icon: 'shop', label: 'Compras' } };
  function checklist(o) {
    var c = [
      { id: 'doc', icon: 'doc', title: 'Documentos', items: [{ id: 'pasaporte', t: 'DNI o pasaporte en vigor', imp: 1, n: 'Comprueba qué documento pide ' + (W.dest.country || 'el destino') + ' y si hace falta visado o autorización.' },
        { id: 'seguro', t: 'Seguro de viaje o tarjeta sanitaria', imp: 1 }, { id: 'reservas', t: 'Reservas guardadas en «Reservas y billetes»' }] },
      { id: 'din', icon: 'card', title: 'Dinero y móvil', items: [{ id: 'tarjeta', t: 'Tarjeta sin comisiones en el extranjero', imp: 1 }, { id: 'roaming', t: 'Roaming o eSIM', n: 'Mira si tu tarifa incluye ' + (W.dest.country || 'el destino') + '.' },
        { id: 'mapasoff', t: 'Mapas sin conexión descargados', n: 'En Google Maps, con wifi: tu foto → «Mapas sin conexión» → «Selecciona tu propio mapa».' }] },
      { id: 'elec', icon: 'plug', title: 'Electrónica', items: [{ id: 'cargador', t: 'Cargadores y batería externa' }, { id: 'adaptador', t: 'Adaptador de enchufe si hace falta' }] },
      { id: 'ropa', icon: 'jacket', title: 'Ropa', items: [{ id: 'calzado', t: 'Calzado cómodo para andar', imp: 1 }, { id: 'capas', t: 'Ropa según el tiempo de esos días' }] },
      { id: 'vdoc', icon: 'plane', title: 'Vuelta', when: 'back', items: [{ id: 'vcheckin', t: 'Check-in online del vuelo de vuelta', imp: 1 }, { id: 'vmaleta', t: 'Maleta revisada (líquidos, peso)' }] }
    ];
    if (!o.walk) c.splice(2, 0, { id: 'car', icon: 'car', title: 'Coche', items: [{ id: 'carnet', t: 'Carné de conducir', imp: 1, n: 'Algunos países piden el permiso internacional.' }, { id: 'alquiler', t: 'Reserva del coche de alquiler', imp: 1 }] });
    return c;
  }

  $('#wGo').addEventListener('click', generate);
  $('#wOpen').addEventListener('click', function () { if (W.bundle) openTrip(W.bundle.meta.id); });

  /* ---------- Opcional: la IA del usuario reescribe textos, sin poder añadir sitios ---------- */
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
  $('#aiCopy').addEventListener('click', function () {
    if (!W.bundle) return; var t = aiPrompt(W.bundle);
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { $('#aiCopy').textContent = 'Copiado ✓'; }, function () { $('#aiIn').value = t; $('#aiIn').select(); alert('Copia el texto del cuadro y pégalo en el chat.'); });
  });
  $('#aiApply').addEventListener('click', function () {
    var b = W.bundle, raw = $('#aiIn').value, log = $('#aiLog'); log.innerHTML = '';
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
  });

  /* ---------- Pestañas de la pantalla inicial ---------- */
  function setTab(t) {
    $$('.vtab').forEach(function (s) { s.hidden = s.id !== 'tab-' + t; });
    $$('.vn').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-vt') === t); });
    try { localStorage.setItem('guia-home-tab', t); } catch (e) {}
    if (t === 'album') renderAlbum(); else if (t === 'profile') renderProfile();
    window.scrollTo(0, 0);
  }
  $$('.vn').forEach(function (b) { b.addEventListener('click', function () { setTab(b.getAttribute('data-vt')); }); });

  /* ---------- Álbum, visor 3D, postal y perfil: album.js ---------- */
  // todos los viajes con sus datos: los de la web (trips/<id>.json) y los del móvil
  function allTrips() {
    var a = fetch('trips/index.json').then(function (r) { return r.json(); }).catch(function () { return []; }).then(function (idx) {
      return Promise.all(idx.map(function (t) { return fetch('trips/' + t.id + '.json').then(function (r) { return r.json(); }).then(function (b) { return { id: t.id, b: b }; }).catch(function () { return null; }); }));
    });
    var u = DB.all().catch(function () { return []; }).then(function (l) { return (l || []).map(function (x) { return { id: x.id, b: x.bundle }; }); });
    return Promise.all([a, u]).then(function (r) { return r[0].filter(Boolean).concat(r[1]); });
  }
  Album.init({ trips: allTrips });
  function renderAlbum() { return Album.renderAlbum(); }
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

  renderList();
  var t0 = 'trips'; try { t0 = location.hash.slice(1) || localStorage.getItem('guia-home-tab') || 'trips'; } catch (e) {}
  if (['trips', 'album', 'profile'].indexOf(t0) >= 0 && t0 !== 'trips') setTab(t0);
})();
