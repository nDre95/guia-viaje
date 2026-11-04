/* ===== Álbum de cromos, visor 3D, postal y perfil =====
   Lo usan «Mis viajes» (web, viajes.html) y la guía de un solo archivo (hoja «Mi álbum»).
   Album.init({ trips, single, onChange }):
     trips()   → promesa con [{ id, b: { meta, trip, photos } }]
     single    → guía de un solo archivo: sin «Abrir guía»; las fotos son clases .ph-<nombre>
     onChange(key) → se ha pegado o quitado un cromo desde el visor */
window.Album = (function () {
  'use strict';
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var cfg = { trips: function () { return Promise.resolve([]); } }, TRIPS = null;
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function shortDate(iso) { if (!iso) return ''; var d = new Date(iso + 'T12:00:00Z'); return d.getUTCDate() + ' ' + MES[d.getUTCMonth()]; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function download(obj, name) {
    var blob = new Blob([JSON.stringify(obj)], { type: 'application/json' }), f = null;
    try { f = new File([blob], name, { type: 'application/json' }); } catch (e) {}
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: name }).catch(function () {}); return; }
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }

  function albumGet() { try { return JSON.parse(localStorage.getItem('guia-album') || '{}') || {}; } catch (e) { return {}; } }
  function albumSet(a) { try { localStorage.setItem('guia-album', JSON.stringify(a)); } catch (e) {} }
  function isCromo(it) { return !!it && ['visit', 'walk', 'view', 'tour', 'night'].indexOf(it.t) >= 0 && !it.hidden && !it.hole && !/aeropuerto|airport/i.test(it.ti); }
  function trips() { var ph = window.Juego ? Juego.ready() : Promise.resolve(); return ph.then(function () { return TRIPS || cfg.trips().then(function (t) { TRIPS = t || []; TRIPS.forEach(realStart); return TRIPS; }); }); }
  // la fecha del viaje es la que se haya puesto en la guía; si no, la de cuando se creó
  function realStart(t) {
    var m = t.b.meta || {}, v = null; try { v = JSON.parse(localStorage.getItem((m.storage || m.id || t.id) + ':start') || 'null'); } catch (e) {}
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) t.b.trip.defaultStart = v;
  }
  function lg() { return window.Lang ? Lang.get() : 'es'; }
  function tr(s) { return window.Lang ? Lang.t(s) : s; }
  function tripTitle(t) { var m = t.b.meta.title || {}; return m[lg()] || m.es || t.id; }
  // cromos de un viaje: sus sitios, por días; ★ = imprescindible (o, si el viaje no marca ninguno, el 20 % más famoso)
  function cromosOf(t, alb) {
    var b = t.b, ph = b.photos || {}, list = [];
    b.trip.days.forEach(function (d, k) { d.items.forEach(function (it) { if (!isCromo(it)) return; var en = lg() === 'en' ? ((t.b.trip_en || {}).items || {})[it.id] || {} : {}, mine = window.Juego ? Juego.photo(t.id + '|' + it.id) : ''; list.push({ id: it.id, ti: en.ti || it.ti, lead: en.lead || it.lead || '', day: k + 1, ph: it.ph || '', img: mine || (it.ph ? ph[it.ph] || '' : ''), must: !!it.must, links: (it.src || {}).links || 0, raw: it }); }); });
    if (!list.some(function (c) { return c.must; })) {
      var cut = list.map(function (c) { return c.links; }).sort(function (x, y) { return y - x; })[Math.max(0, Math.ceil(list.length * 0.2) - 1)] || 1e9;
      list.forEach(function (c) { c.must = c.links > 0 && c.links >= cut; });
    }
    var own = window.Juego ? Juego.get().own : {};
    list.forEach(function (c, n) { c.n = n + 1; c.key = t.id + '|' + c.id; c.got = alb[c.key] || null; c.own = own[c.key] && c.got ? own[c.key] : null; if (window.Juego) { c.rate = Juego.rate(c.raw); c.rate.tier = Juego.tierOf(c.key); c.rate.r = Juego.RANK[c.rate.tier]; } });
    return list;
  }
  // lo que encuentra el buscador: títulos, ciudades y países
  function searchText(t) {
    var m = t.b.meta, g = m.generated || {}, cc = window.Mundo ? Mundo.cached(t) || [] : [];
    return [(m.title || {}).es, (m.title || {}).en, (m.dest || {}).es, (m.dest || {}).en].concat(g.cities || [], g.countries || [], (m.mapCities || []).map(function (c) { return c.es + ' ' + c.en; }), cc.map(Mundo ? Mundo.name : String), t.b.trip.defaultStart ? [t.b.trip.defaultStart.slice(0, 4)] : []).join(' ');
  }
  // foto: en la web es una dirección; en el HTML único, una clase con la foto incrustada
  function phCls(c) { return !c.img && c.ph ? ' ph-' + c.ph : ''; }
  function phStyle(c) { return c.img ? ' style="background-image:url(&quot;' + esc(c.img) + '&quot;)"' : ''; }
  function phUrl(c) {
    if (c.img || !c.ph) return c.img;
    var d = document.createElement('i'); d.className = 'ph-' + c.ph; d.style.display = 'none'; document.body.appendChild(d);
    var u = getComputedStyle(d).backgroundImage || ''; d.remove();
    var m = /^url\(["']?([\s\S]*?)["']?\)$/.exec(u); return m ? m[1] : '';
  }

  /* ---------- Lista larga: buscador, filtros y «Mostrar más» ----------
     Album.listBox(caja, { key, placeholder, chips: [[id, texto, prueba]], select: { all, options }, text(item), selectVal(item), render(item), size, empty, items })
     El buscador no se vuelve a pintar al escribir, para no perder el foco; el estado se recuerda mientras dure la página. */
  var LST = {};
  // todas las cartas de todos los viajes: de aquí salen los sobres y las colecciones
  function allCards() {
    return trips().then(function (list) {
      var alb = albumGet(), out = [];
      list.forEach(function (t) { cromosOf(t, alb).forEach(function (c) { c.trip = t.id; c.url = phUrl(c); out.push(c); }); });
      return out;
    });
  }
  var SETS = [['hist', 'Historia', ['CAS', 'RUI', 'MON', 'TEM']], ['arte', 'Arte y espectáculos', ['MUS', 'ESP']], ['natu', 'Naturaleza y miradores', ['NAT', 'JAR', 'MIR']], ['urbe', 'Ciudad', ['PLZ', 'BAR', 'MER', 'PAS', 'FAM']]];
  function packsHTML(cards) {
    var g = Juego.get(), groups = [], order = { r: 0, g: 1, s: 2, c: 3 };
    g.bag.forEach(function (b) { var f = groups.filter(function (x) { return x.k === b.k && x.t === b.t; })[0]; if (f) f.n++; else groups.push({ k: b.k, t: b.t, n: 1 }); });
    groups.sort(function (a, b) { return order[a.k] - order[b.k]; });
    var head = !groups.length ? '' : '<div class="pf-h">Tus sobres</div><div class="pk-row">' + (groups.length ? groups.map(function (x) {
      var tr0 = (TRIPS || []).filter(function (t) { return t.id === x.t; })[0];
      return '<button type="button" class="pk-mini k-' + x.k + ' sq" data-pkopen="' + x.k + '" data-pktrip="' + esc(x.t) + '"><span class="pk-foil"></span><b>' + x.n + '</b><small>' + esc(Juego.PACK[x.k]) + '</small>' + (tr0 ? '<small class="pk-trip">' + esc(tripTitle(tr0)) + '</small>' : '') + '</button>';
    }).join('') : '<p class="pk-none">Gana sobres con los quizzes: cuantos más aciertos, mejor sobre.</p>') +
      '</div>';
    return albHero(cards) + head;
  }
  // portada del álbum: tus cromos, los últimos que has canjeado y cuántos tienes de cada rareza
  var TIERS = [['base', 'Normal'], ['copper', 'Cobre'], ['silver', 'Plata'], ['gold', 'Oro'], ['emerald', 'Esmeralda'], ['ruby', 'Rubí']];
  function albHero(cards) {
    var got = cards.filter(function (c) { return c.got; }), n = got.length, all = cards.length, pc = all ? Math.round(n / all * 100) : 0;
    var fan = got.slice().sort(function (a, b) { return String(b.got.at || '').localeCompare(String(a.got.at || '')); }).filter(function (c) { return c.url; }).slice(0, 3);
    cards.filter(function (c) { return !c.got && c.url; }).slice(0, 3 - fan.length).forEach(function (c) { fan.push(c); });
    return '<div class="alh rv-h"><div class="alh-t"><small>Mi colección</small><b>' + n + '<i> / ' + all + '</i></b><span>' + (n === 1 ? 'cromo canjeado' : 'cromos canjeados') + '</span><span class="alh-bar"><i style="width:' + pc + '%"></i></span></div>' +
      '<div class="alh-fan">' + fan.map(function (c, i) { return '<i class="t-' + ((c.rate || {}).tier || 'copper') + (c.got ? '' : ' dim') + '" style="--i:' + i + ';background-image:url(&quot;' + esc(c.url) + '&quot;)"></i>'; }).join('') + '</div>' +
      '<div class="alh-tiers">' + TIERS.map(function (T) { return '<span class="t-' + T[0] + '"><i></i><b>' + got.filter(function (c) { return (c.rate || {}).tier === T[0]; }).length + '</b><small>' + T[1] + '</small></span>'; }).join('') + '</div></div>';
  }
  // colecciones con foto: la de un cromo que ya tienes de esa clase (o, si no, en gris)
  function setsHTML(cards) {
    var sets = SETS.map(function (S) {
      var all = cards.filter(function (c) { return S[2].indexOf(c.rate.pos) >= 0; });
      return all.length ? { k: S[0], n: S[1], have: all.filter(function (c) { return c.got; }).length, all: all.length, ph: all.filter(function (c) { return c.got && c.url; }).concat(all.filter(function (c) { return c.url; }))[0] } : null;
    }).filter(Boolean);
    if (cards.length) sets.push({ k: 'top', n: 'Oro o mejores', have: cards.filter(function (c) { return c.got && c.rate.r >= 80; }).length, all: cards.length, ph: cards.filter(function (c) { return c.got && c.rate.r >= 80 && c.url; }).concat(cards.filter(function (c) { return c.url; }))[0] });
    return sets.length ? '<div class="pf-h">Colecciones</div><div class="alc">' + sets.map(function (x, i) {
      return '<button type="button" class="alc-c sq rv-h' + (x.have ? '' : ' none') + '" data-setopen="' + x.k + '" style="--d:' + i * 40 + 'ms"><span class="alc-ph"' + (x.ph ? ' style="background-image:url(&quot;' + esc(x.ph.url) + '&quot;)"' : '') + '></span><span class="hm-shade"></span>' +
        '<b>' + esc(x.n) + '</b><small>' + x.have + ' de ' + x.all + '</small><span class="alf-bar"><i style="width:' + Math.round(x.have / x.all * 100) + '%"></i></span></button>';
    }).join('') + '</div>' : '';
  }
  // los viajes del álbum como una revista: el principal en grande con su tira de cromos y los demás de dos en dos
  var albAll = false;
  function tripsEditorial(rows) {
    if (!rows.length) return '<p class="note">Aún no hay viajes.</p>';
    var show = rows.slice(0, 7), f = show[0], cv = coverOf(f.t), cs = f.cs;
    var strip = cs.slice().sort(function (a, b) { return (b.got ? 1 : 0) - (a.got ? 1 : 0); }).filter(function (c) { return c.url; }).slice(0, 6);
    var h = '<div class="pf-h">Mis viajes</div><button type="button" class="alf sq rv-h" data-albopen="' + esc(f.t.id) + '"><span class="alf-ph' + cv.cl + '"' + cv.st + '></span><span class="hm-shade"></span>' +
      '<small class="alf-k">' + (f.got === f.total && f.total ? 'Álbum completo' : 'Tu álbum de') + '</small><b>' + esc(tripTitle(f.t)) + '</b>' +
      '<span class="alf-s">' + f.got + ' de ' + f.total + ' cromos</span><span class="alf-bar"><i style="width:' + (f.total ? Math.round(f.got / f.total * 100) : 0) + '%"></i></span>' +
      '<span class="alf-strip">' + strip.map(function (c) { return '<i class="t-' + ((c.rate || {}).tier || 'copper') + (c.got ? '' : ' dim') + '" style="background-image:url(&quot;' + esc(c.url) + '&quot;)"></i>'; }).join('') + '</span></button>';
    if (show.length > 1) h += '<div class="al2">' + show.slice(1).map(function (r, i) {
      var c2 = coverOf(r.t);
      return '<button type="button" class="al2-c sq rv-h" data-albopen="' + esc(r.t.id) + '" style="--d:' + (i + 1) * 40 + 'ms"><span class="alf-ph' + c2.cl + '"' + c2.st + '></span><span class="hm-shade"></span><b>' + esc(tripTitle(r.t)) + '</b><small>' + r.got + ' de ' + r.total + '</small><span class="alf-bar"><i style="width:' + (r.total ? Math.round(r.got / r.total * 100) : 0) + '%"></i></span></button>';
    }).join('') + '</div>';
    if (rows.length > 7) h += '<button type="button" class="btn ghost sq alb-all" data-alball>Ver todos los viajes (' + rows.length + ')</button>';
    return h;
  }
  function paintPacks(on) {
    var box = $('#albumBox'); if (!box || !window.Juego) return Promise.resolve();
    var el = $('#packBox');
    if (!el) { el = document.createElement('div'); el.id = 'packBox'; box.parentNode.insertBefore(el, box); }
    if (!on) { el.innerHTML = ''; return Promise.resolve(); }
    return allCards().then(function (cards) {
      el.innerHTML = packsHTML(cards);
    });
  }
  function listBox(box, o) {
    var st = LST[o.key] || (LST[o.key] = { q: '', chip: 'all', sel: '', year: '', n: o.size || 5 });
    if (box._lst !== o.key || !box.querySelector('.lst-res')) {
      box._lst = o.key;
      box.innerHTML = '<div class="lst-bar"><label class="lst-q"><svg class="ic" viewBox="0 0 24 24"><path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4"></path></svg><input type="search" enterkeyhint="search" placeholder="' + esc(o.placeholder) + '" aria-label="' + esc(o.placeholder) + '" value="' + esc(st.q) + '"></label></div>' +
        '<div class="lst-row"><div class="lst-chips"></div><select class="lst-sel" hidden></select></div><div class="lst-chips lst-years"></div><div class="lst-res"></div><button type="button" class="lst-more sq" hidden></button>';
      $('input', box).addEventListener('input', function () { st.q = this.value; st.n = box._lo.size || 5; paintList(box); });
      $('.lst-sel', box).addEventListener('change', function () { st.sel = this.value; st.n = box._lo.size || 5; paintList(box); });
      $('.lst-chips', box).addEventListener('click', function (e) { var c = e.target.closest('[data-lc]'); if (!c) return; st.chip = c.getAttribute('data-lc'); st.n = box._lo.size || 5; paintList(box); });
      $('.lst-years', box).addEventListener('click', function (e) { var c = e.target.closest('[data-ly]'); if (!c) return; st.year = c.getAttribute('data-ly'); st.n = box._lo.size || 5; paintList(box); });
      $('.lst-more', box).addEventListener('click', function () { st.n += box._lo.size || 5; paintList(box); });
    }
    box._lo = o; box._st = st;
    paintList(box);
  }
  function plain(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function paintList(box) {
    var o = box._lo, st = box._st, q = plain(st.q).trim(), few = o.items.length < 2;
    $('.lst-bar', box).hidden = few; $('.lst-row', box).hidden = few;
    // lo elegido en el desplegable puede haber dejado de existir (viaje borrado)
    var sel = $('.lst-sel', box), opts = o.select ? o.select.options() : [];
    if (st.sel && !opts.some(function (x) { return x[0] === st.sel; })) st.sel = '';
    sel.hidden = !(opts.length > 1);
    if (opts.length > 1) sel.innerHTML = '<option value="">' + esc(o.select.all) + '</option>' + opts.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (x[0] === st.sel ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('');
    // años: de más reciente a más antiguo; solo se ofrecen si hay viajes en más de uno
    var yl = []; o.items.forEach(function (it) { var y = o.year ? o.year(it) : ''; if (y && yl.indexOf(y) < 0) yl.push(y); }); yl.sort().reverse();
    if (st.year && yl.indexOf(st.year) < 0) st.year = '';
    $('.lst-years', box).hidden = yl.length < 2;
    $('.lst-years', box).innerHTML = yl.length < 2 ? '' : '<button type="button" class="opt' + (st.year ? '' : ' on') + '" data-ly="">Todos</button>' + yl.map(function (y) { return '<button type="button" class="opt' + (st.year === y ? ' on' : '') + '" data-ly="' + y + '">' + y + '</button>'; }).join('');
    var base = o.items.filter(function (it) { return (!st.year || o.year(it) === st.year) && (!q || q.split(/\s+/).every(function (w) { return plain(o.text(it)).indexOf(w) >= 0; })) && (!st.sel || o.selectVal(it).indexOf(st.sel) >= 0); });
    $('.lst-chips', box).innerHTML = o.chips.map(function (c) { var n = base.filter(c[2]).length; return '<button type="button" class="opt' + (st.chip === c[0] ? ' on' : '') + '" data-lc="' + c[0] + '">' + esc(c[1]) + ' <i>' + n + '</i></button>'; }).join('');
    var ch = o.chips.filter(function (c) { return c[0] === st.chip; })[0] || o.chips[0], all = base.filter(ch[2]), shown = all.slice(0, st.n), more = $('.lst-more', box);
    $('.lst-res', box).innerHTML = shown.map(o.render).join('') || '<p class="note">' + esc(o.items.length ? 'Nada coincide con la búsqueda.' : o.empty) + '</p>';
    more.hidden = all.length <= shown.length;
    if (!more.hidden) more.textContent = 'Mostrar más (' + (all.length - shown.length) + ')';
  }
  // tarjeta de la postal: sello con la foto de tu mejor cromo, borde de correo aéreo
  function postCta(t, cs, got) {
    var best = cs.filter(function (c) { return c.got && (c.img || c.ph); }).sort(function (a, b) { return ((b.rate || {}).r || 0) - ((a.rate || {}).r || 0); })[0];
    var dest = (t.b.meta.dest || {})[lg()] || (t.b.meta.dest || {}).es || tripTitle(t);
    return '<button type="button" class="pc-cta sq"' + (got ? ' data-post="' + esc(t.id) + '"' : ' disabled') + '><span class="pc-in"><span class="pc-st"><i class="' + (best ? phCls(best) : '') + '"' + (best ? phStyle(best) : '') + '></i></span>' +
      (postIdx()[t.id] ? '<span class="pc-m"><small>Postal</small><b>Tu postal de ' + esc(dest) + '</b><span>Toca para verla, girarla y compartirla.</span></span><span class="pc-go">Ver</span>' :
        '<span class="pc-m"><small>Postal</small><b>Crea tu postal de ' + esc(dest) + '</b><span>' + (got ? 'Una postal de verdad: delante tu mejor foto; detrás, más fotos, sello y matasellos.' : 'Canjea un cromo para crear tu postal.') + '</span></span>' +
        (got ? '<span class="pc-go">Crear</span>' : '')) + '</span></button>';
  }
  // un cromo en la cuadrícula (álbum de un viaje o colección)
  function tileHTML(tid, c) {
    var R = c.rate || { r: '', pos: '', tier: 'copper' };
    return '<button type="button" class="cr fc t-' + R.tier + (c.got ? ' got' : '') + (c.own ? ' own' : '') + phCls(c) + '" data-cr="' + esc(tid + '|' + c.id) + '"' + phStyle(c) + '>' +
      '<i class="fc-b"></i>' + (c.got ? '<i class="sheen"></i>' : '') + (c.got ? '<i class="fc-v">' + (c.got.gps ? '✓ GPS' : '✓') + '</i>' : '') + '<span>' + esc(c.ti) + '</span></button>';
  }
  // una colección abierta: sus cromos de todos los viajes, separados por viaje
  var openS = null;
  function renderSet(box, list, alb) {
    var S = SETS.filter(function (x) { return x[0] === openS; })[0], name = S ? S[1] : 'Oro o mejores', have = 0, all = 0, body = '';
    list.forEach(function (t) {
      var cs0 = cromosOf(t, alb), cs = S ? cs0.filter(function (c) { return S[2].indexOf((c.rate || {}).pos) >= 0; }) : cs0.filter(function (c) { return c.got; }).sort(function (a, b) { return b.rate.r - a.rate.r; });
      var h = S ? cs.filter(function (c) { return c.got; }).length : cs.filter(function (c) { return c.rate.r >= 80; }).length;
      have += h; all += S ? cs.length : cs0.length;
      if (!cs.length) return;
      body += '<div class="pf-h">' + esc(tripTitle(t)) + ' <i class="set-n">' + h + ' de ' + (S ? cs.length : cs0.length) + '</i></div><div class="crs">' + cs.map(function (c) { return tileHTML(t.id, c); }).join('') + '</div>';
    });
    box.innerHTML = '<button type="button" class="alb-back sq" data-setback><svg class="ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"></path></svg><span>Álbum</span></button>' +
      '<div class="alb"><div class="alb-h"><b>' + esc(name) + '</b><small>' + have + ' de ' + all + '</small></div><div class="alb-bar"><i style="width:' + (all ? Math.round(have / all * 100) : 0) + '%"></i></div>' +
      '<p class="set-lead">' + (S ? 'Los que faltan se canjean en el sitio, con tu foto.' : 'Tus cromos canjeados, del mejor al peor. Los sobres de los quizzes mejoran la rareza.') + '</p>' +
      (body || '<p class="note">Aún no tienes ninguno.</p>') + '</div>';
  }
  var openT = null, crFilter = 'all';   // viaje abierto en el álbum y qué cromos se ven
  function coverOf(t) {
    var bt = t.b.trip, ph = t.b.photos || {}, c = bt.cover;
    if (c && ph[c]) return { st: ' style="background-image:url(&quot;' + esc(ph[c]) + '&quot;)"', cl: '' };
    return { st: '', cl: c ? ' ph ph-' + c : '' };
  }
  function renderAlbum() {
    var box = $('#albumBox'); if (!box) return Promise.resolve();
    if (!TRIPS) box.innerHTML = '<p class="note">Cargando…</p>';
    return trips().then(function (list) {
      var alb = albumGet(), withC = list.filter(function (t) { return cromosOf(t, alb).length; });
      if (cfg.single && withC[0]) openT = withC[0].id;
      if (openS) { paintPacks(false); box._lst = ''; renderSet(box, withC, alb); return; }
      var cur = withC.filter(function (t) { return t.id === openT; })[0];
      paintPacks(!cur || !!cfg.single);
      if (!cur) {
        openT = null;
        // al principio, solo los viajes: compacto
        var rows = withC.map(function (t) { var cs = cromosOf(t, alb); cs.forEach(function (c) { c.url = phUrl(c); c.trip = t.id; }); return { t: t, cs: cs, total: cs.length, got: cs.filter(function (c) { return c.got; }).length }; });
        // primero el que tiene el último cromo canjeado; luego, los más avanzados
        var last = function (r) { return r.cs.reduce(function (m, c) { return c.got && String(c.got.at || '') > m ? String(c.got.at || '') : m; }, ''); };
        rows.sort(function (a, b) { return last(b).localeCompare(last(a)) || b.got - a.got; });
        var cards = []; rows.forEach(function (r) { cards = cards.concat(r.cs); });
        if (!albAll) {
          box._lst = '';
          box.innerHTML = tripsEditorial(rows) + setsHTML(cards);
          if (window.Mundo) Mundo.detect(withC).catch(function () {});
          return;
        }
        function albumList() {
          listBox(box, { key: 'album', size: 5, placeholder: 'Buscar por viaje o país', empty: 'Aún no hay viajes.', items: rows,
            chips: [['all', 'Todos', function () { return true; }], ['part', 'Empezados', function (r) { return r.got && r.got < r.total; }], ['full', 'Completos', function (r) { return r.total && r.got === r.total; }], ['none', 'Sin empezar', function (r) { return !r.got; }]],
            text: function (r) { return searchText(r.t); }, select: null, year: function (r) { return (r.t.b.trip.defaultStart || '').slice(0, 4); },
            render: function (r) {
              var cv = coverOf(r.t);
              return '<button type="button" class="card alb-row sq" data-albopen="' + esc(r.t.id) + '"><span class="alb-ph' + cv.cl + '"' + cv.st + '></span><span class="alb-m"><b>' + esc(tripTitle(r.t)) + '</b><small>' + r.got + ' de ' + r.total + ' cromos</small>' +
                '<span class="alb-bar"><i style="width:' + (r.total ? Math.round(r.got / r.total * 100) : 0) + '%"></i></span></span><svg class="ic alb-go" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg></button>';
            } });
        }
        box.innerHTML = ''; box._lst = '';
        albumList();
        box.insertAdjacentHTML('afterbegin', '<button type="button" class="alb-back sq" data-albless><svg class="ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"></path></svg><span>Álbum</span></button>');
        if (window.Mundo) Mundo.detect(withC).then(function (ch) { if (ch && !openT) albumList(); }).catch(function () {});
        return;
      }
      var t = cur, cs = cromosOf(t, alb), got = cs.filter(function (c) { return c.got; }).length;
      box._lst = '';
      var seen = cs.filter(function (c) { return crFilter === 'got' ? c.got : crFilter === 'miss' ? !c.got : crFilter === 'top' ? c.rate && (c.rate.r >= 80) : true; });
      box.innerHTML = (cfg.single ? '' : '<button type="button" class="alb-back sq" data-albback><svg class="ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"></path></svg><span>Todos los viajes</span></button>') +
        postCta(t, cs, got) + '<div class="alb" data-trip="' + esc(t.id) + '"><div class="alb-h"><b>' + esc(tripTitle(t)) + '</b><small>' + got + ' de ' + cs.length + '</small></div>' +
          '<div class="alb-bar"><i style="width:' + (cs.length ? Math.round(got / cs.length * 100) : 0) + '%"></i></div>' +
          (cs.length > 8 ? '<div class="lst-chips">' + [['all', 'Todos', cs.length], ['got', 'Canjeados', got], ['miss', 'Faltan', cs.length - got], ['top', 'Oro o más', cs.filter(function (c) { return c.got && c.rate && c.rate.r >= 80; }).length]].map(function (f) { return '<button type="button" class="opt' + (crFilter === f[0] ? ' on' : '') + '" data-crf="' + f[0] + '">' + f[1] + ' <i>' + f[2] + '</i></button>'; }).join('') + '</div>' : '') +
          '<div class="crs">' + seen.map(function (c) { return tileHTML(t.id, c); }).join('') + '</div>' +
          '<div class="btn-row" style="margin-top:10px">' +
          (cfg.single ? '' : '<button type="button" class="btn ghost sq" data-open="' + esc(t.id) + '">Abrir guía</button>') + '</div></div>';
    });
  }

  /* ---------- Visor del cromo: pegatina holográfica que se gira en 3D con el dedo o inclinando el móvil ---------- */
  var cv3 = { rx: 0, ry: 0, drag: null, key: '', gyro: false };
  function cromoByKey(key) {
    var i = key.indexOf('|'), tid = key.slice(0, i), cid = key.slice(i + 1);
    var t = (TRIPS || []).filter(function (x) { return x.id === tid; })[0]; if (!t) return null;
    var cs = cromosOf(t, albumGet()), c = cs.filter(function (x) { return x.id === cid; })[0];
    return c ? { t: t, c: c, total: cs.length } : null;
  }
  function openCromo(key) {
    var f = cromoByKey(key); if (!f) return;
    var c = f.c, R = c.rate || { r: '', pos: '', tier: 'copper', st: [] }, have = c.got, top = R.r >= 80, cls = ' fc t-' + R.tier + (have ? '' : ' miss');
    cv3.key = key; cv3.rx = 0; cv3.ry = 0;
    $('#crView').innerHTML =
      '<div class="hv-wrap"><div class="hv-halo' + (have ? (top ? ' gold' : '') : ' miss') + '"></div>' +
        '<div class="holo' + cls + '">' +
          '<div class="hf"><div class="hp' + phCls(c) + '"' + phStyle(c) + '></div><div class="foil"></div><div class="glit"></div>' +
            '<span class="fc-frame"></span><span class="fc-glit"></span>' +
            (c.got ? '<span class="fc-seen' + (c.got.unv ? ' unv' : '') + '">' + (c.got.gps ? '✓ GPS · ' : c.got.unv ? 'Sin verificar · ' : '✓ ') + esc(shortDate(c.got.at)) + '</span>' : have ? '' : '<span class="lock">Se canjea en el sitio</span>') +
            '<div class="cap"><b>' + esc(c.ti) + '</b></div><div class="fc-kind"><u>' + esc(R.type || '') + '</u> · <u>' + esc(window.Juego ? Juego.TIER[R.tier] : '') + '</u></div><div class="glare"></div></div>' +
          '<div class="hb"><span class="seal">' + (c.got ? 'Visto<br>' + esc(shortDate(c.got.at)) : 'Por<br>pegar') + '</span><b>' + esc(tripTitle(f.t)) + '</b><small>Cromo #' + c.n + ' de ' + f.total + ' · Día ' + c.day + '</small></div>' +
        '</div></div>' +
      '<p class="hv-hint">Arrastra para girarlo · dale la vuelta para ver el reverso</p>' +
      '<div class="hv-btns">' + (c.got ? '<button type="button" class="btn ghost sq" data-cv="toggle">Quitar del álbum</button>' : window.Juego && Juego.TEST ? '<button type="button" class="btn navy sq" data-cv="redeem">Canjear (modo prueba)</button>' : '') +
        (window.DeviceOrientationEvent ? '<button type="button" class="btn ghost sq" data-cv="gyro">Mover con el móvil</button>' : '') +
        '<button type="button" class="btn ghost sq" data-cv="close">Cerrar</button></div>';
    $('#crView').classList.add('on');
    var wrap = $('.hv-wrap', $('#crView'));
    wrap.addEventListener('pointerdown', cvDown); wrap.addEventListener('pointermove', cvMove);
    wrap.addEventListener('pointerup', cvUp); wrap.addEventListener('pointercancel', cvUp); wrap.addEventListener('pointerleave', function (e) { if (!cv3.drag && e.pointerType === 'mouse') cvSet(0, cv3.ry, 50, 50, 0, true); });
  }
  function cvCard() { return $('#crView .holo'); }
  // aplica el giro: rx, ry en grados; mx, my = dónde cae el brillo (%); o = intensidad del reflejo (0–1)
  function cvSet(rx, ry, mx, my, o, smooth) {
    var h = cvCard(); if (!h) return;
    cv3.rx = rx; cv3.ry = ry;
    h.classList.toggle('drag', !smooth);
    h.style.setProperty('--rx', rx.toFixed(1) + 'deg'); h.style.setProperty('--ry', ry.toFixed(1) + 'deg');
    h.style.setProperty('--mx', mx.toFixed(1) + '%'); h.style.setProperty('--my', my.toFixed(1) + '%'); h.style.setProperty('--o', o.toFixed(2));
  }
  function rel(e) { var r = cvCard().getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) }; }
  function cvDown(e) { cv3.drag = { x: e.clientX, y: e.clientY, ry: cv3.ry }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} }
  function cvMove(e) {
    var p = rel(e);
    if (cv3.drag) {
      var dx = e.clientX - cv3.drag.x, dy = e.clientY - cv3.drag.y, ry = cv3.drag.ry + dx * 0.55, rx = Math.max(-28, Math.min(28, -dy * 0.35));
      var face = ((ry % 360) + 360) % 360, off = Math.min(Math.abs(face), Math.abs(face - 180), Math.abs(face - 360));
      cvSet(rx, ry, 50 + (ry % 90) * 0.9, 50 + rx * 1.4, Math.min(1, (Math.abs(rx) + off) / 35), false);
    } else if (e.pointerType === 'mouse') {
      cvSet((0.5 - p.y) * 24, Math.round(cv3.ry / 180) * 180 + (p.x - 0.5) * 30, p.x * 100, p.y * 100, 0.8, false);
    }
  }
  function cvUp() {
    if (!cv3.drag) return; cv3.drag = null;
    cvSet(0, Math.round(cv3.ry / 180) * 180, 50, 50, 0.15, true);   // se asienta de frente o de espaldas, con rebote
  }
  function onTilt(e) {
    if (!$('#crView').classList.contains('on') || cv3.drag || e.beta == null) return;
    var rx = Math.max(-25, Math.min(25, (e.beta - 40) * 0.7)), gy = Math.max(-30, Math.min(30, e.gamma || 0));
    cvSet(-rx, Math.round(cv3.ry / 180) * 180 + gy, 50 + gy * 1.5, 50 + rx * 1.5, Math.min(1, (Math.abs(rx) + Math.abs(gy)) / 30), false);
  }
  function viewerClick(e) {
    var b = e.target.closest('[data-cv]'), a = b && b.getAttribute('data-cv');
    if (!b) { if (e.target.id === 'crView') closeCromo(); return; }
    if (a === 'close') closeCromo();
    else if (a === 'gyro') {
      var go = function () { if (!cv3.gyro) { window.addEventListener('deviceorientation', onTilt); cv3.gyro = true; } b.textContent = 'Inclina el móvil'; };
      // iPhone: hay que pedir permiso con un toque
      if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().then(function (s) { if (s === 'granted') go(); }).catch(function () {});
      else go();
    } else if (a === 'redeem') {
      var al0 = albumGet(), k0 = cv3.key, f0 = cromoByKey(k0); if (!f0 || al0[k0]) return;
      al0[k0] = { at: new Date().toISOString().slice(0, 10), ti: f0.c.ti, ph: f0.c.ph || '', day: f0.c.day, unv: 1 };
      albumSet(al0); if (cfg.onChange) cfg.onChange(k0);
      if (window.Juego) document.dispatchEvent(new Event('juego:change'));
      renderAlbum().then(function () { openCromo(k0); });
    } else if (a === 'toggle') {
      var alb = albumGet(), k = cv3.key, f = cromoByKey(k); if (!f) return;
      if (alb[k]) { if (!confirm('¿Quitar este cromo del álbum?')) return; delete alb[k]; }
      else return;
      albumSet(alb); if (cfg.onChange) cfg.onChange(k);
      renderAlbum().then(function () {
        var was = !!alb[k]; openCromo(k);
        if (was) { var h = cvCard(); h.classList.add('pop'); cvSet(-8, 0, 30, 30, 1, true); setTimeout(function () { cvSet(0, 0, 50, 50, 0.15, true); }, 650); if (navigator.vibrate) navigator.vibrate(12); }
      });
    }
  }
  function closeCromo() { var v = $('#crView'); if (!v) return; v.classList.remove('on'); setTimeout(function () { if (!v.classList.contains('on')) v.innerHTML = ''; }, 350); }

  /* ---------- Postal de verdad, en 3D: por delante la foto principal; por detrás más fotos, sello, matasellos,
     mensaje a mano, los datos del viaje y la ruta. Las dos caras son SVG dentro de la página (texto nítido a
     cualquier tamaño). Se gira con el dedo, con brillo, y se acerca pellizcando ---------- */
  var PC_M = { base: ['#9a917f', '#e8e1d3'], copper: ['#8a4b24', '#efb48a'], silver: ['#7f8893', '#eef1f5'], gold: ['#a2780f', '#ffe08a'], emerald: ['#0e7a54', '#7ff5c4'], ruby: ['#a01232', '#ff8ea3'] };
  function xml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]; }); }
  // la foto recortada a su hueco, en JPEG dentro del SVG, sin pasar de su resolución real
  function jpeg(im, w, h) {
    var r = Math.max(w / im.width, h / im.height), k = r > 1 ? 1 / r : 1, c = document.createElement('canvas');
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    var s = Math.max(c.width / im.width, c.height / im.height), iw = im.width * s, ih = im.height * s;
    c.getContext('2d').drawImage(im, (c.width - iw) / 2, (c.height - ih) / 2, iw, ih);
    try { return c.toDataURL('image/jpeg', 0.9); } catch (e) { return ''; }
  }
  // las postales hechas se guardan (IndexedDB guia-postales; el índice, en localStorage guia-postales)
  var PCV = 4;   // versión del diseño: las postales de un diseño anterior se rehacen solas al abrirlas
  function postIdx(o) { try { if (o) localStorage.setItem('guia-postales', JSON.stringify(o)); return JSON.parse(localStorage.getItem('guia-postales') || '{}') || {}; } catch (e) { return o || {}; } }
  function postDb(mode, fn) {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error('nodb'));
      var q = indexedDB.open('guia-postales', 1);
      q.onupgradeneeded = function () { q.result.createObjectStore('p', { keyPath: 'id' }); };
      q.onerror = function () { rej(q.error); };
      q.onsuccess = function () { var tx = q.result.transaction('p', mode), r = fn(tx.objectStore('p')); tx.oncomplete = function () { res(r && r.result); }; tx.onerror = function () { rej(tx.error); }; };
    });
  }
  function makePostcard(id, btn, redo) {
    var t = (TRIPS || []).filter(function (x) { return x.id === id; })[0]; if (!t || (btn && btn.classList.contains('busy'))) return;
    // ya hecha: se abre la guardada
    if (!redo && postIdx()[id]) { postDb('readonly', function (s) { return s.get(id); }).then(function (p) { if (p && p.v === PCV) postcard3d(p.front, p.back, id); else makePostcard(id, btn, true); }, function () { makePostcard(id, btn, true); }); return; }
    var cs = cromosOf(t, albumGet()), got = cs.filter(function (c) { return c.got; }), en = lg() === 'en';
    // sin fotos repetidas: dos sitios con la misma foto cuentan como uno
    // la foto oficial del sitio (la tuya del cromo puede ser cualquier cosa)
    function offUrl(c) { return phUrl({ img: (t.b.photos || {})[c.ph] || '', ph: c.ph }); }
    var seenU = {}, pick = got.filter(function (c) { return c.ph; }).sort(function (a, b) { return ((b.rate || {}).r || 0) - ((a.rate || {}).r || 0) || (b.must ? 1 : 0) - (a.must ? 1 : 0) || b.links - a.links; })
      .filter(function (c) { var u = offUrl(c); if (!u || seenU[u]) return false; seenU[u] = 1; return true; }).slice(0, 6);
    // mientras se hace: la tarjeta cambia solo el texto de su botón
    var go = btn && btn.querySelector('.pc-go');
    function busy(on) { if (!btn) { if (on && window.Juego) Juego.toast('Creando postal…'); return; } btn.classList.toggle('busy', on); if (go) go.textContent = tr(on ? 'Creando…' : 'Crear'); }
    busy(true);
    Promise.all(pick.map(function (c) { return loadBig(offUrl(c)); })).then(function (imgs) {
      var ph = pick.map(function (c, i) { return { c: c, im: imgs[i] }; }).filter(function (x) { return x.im; });
      var m = t.b.meta || {}, bt = t.b.trip, nd = bt.days.length, st = bt.defaultStart;
      var dest = (m.dest || {})[lg()] || (m.dest || {}).es || tripTitle(t), cc = window.Mundo && Mundo.cached ? (Mundo.cached(t) || [])[0] : '', country = cc && Mundo.name ? Mundo.name(cc) : dest;
      var d1 = st ? new Date(st + 'T12:00:00Z') : null, d2 = d1 ? new Date(d1.getTime() + (nd - 1) * 864e5) : null, year = d1 ? d1.getUTCFullYear() : '';
      var fo2 = { day: 'numeric', month: 'short', timeZone: 'UTC' }, dd = d1 ? d1.toLocaleDateString(lg(), fo2) + ' – ' + d2.toLocaleDateString(lg(), fo2) : '';
      var cities = ((m.generated || {}).cities || (m.mapCities || []).map(function (c) { return c[lg()] || c.es; })).slice(0, 4);
      var km = 0; bt.days.forEach(function (d) { d.items.forEach(function (it) { if (it.t === 'drive' && it.km) km += it.km; }); });
      var best = ph[0] ? (ph[0].c.rate || {}).tier || 'base' : 'base', gold = got.filter(function (c) { return c.rate && c.rate.r >= 80; }).length, M = PC_M[best];
      var W = 1920, H = 1080, ink = '#23324f', hand = "'Bradley Hand','Segoe Script','Snell Roundhand','Noteworthy','Comic Sans MS',cursive", serif = "'New York','Iowan Old Style',Georgia,serif", sans = "-apple-system,'Segoe UI',Roboto,Helvetica,sans-serif";
      var mc = document.createElement('canvas').getContext('2d');
      // textura de cartulina: puntitos irregulares, como el papel de una postal
      var DOTS = '<pattern id="pcDots" width="23" height="19" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.3" fill="#5b4a2e" opacity=".10"/><circle cx="14" cy="9" r="1" fill="#5b4a2e" opacity=".08"/><circle cx="8" cy="15" r="1.5" fill="#fff" opacity=".18"/><circle cx="19" cy="2" r=".8" fill="#5b4a2e" opacity=".12"/><circle cx="20" cy="15" r="1.1" fill="#5b4a2e" opacity=".07"/></pattern>';
      function lines(txt, font, max) { mc.font = font; var out = [''], words = String(txt).split(' '); words.forEach(function (w) { var k = out.length - 1, tt = out[k] ? out[k] + ' ' + w : w; if (mc.measureText(tt).width > max && out[k]) out.push(w); else out[k] = tt; }); return out; }
      function fitTxt(s, font, max) { mc.font = font; s = String(s); if (mc.measureText(s).width <= max) return s; while (s.length > 3 && mc.measureText(s + '…').width > max) s = s.slice(0, -1); return s.trim() + '…'; }
      function svg(defs, body) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice"><defs>' + defs + '</defs>' + body + '</svg>'; }
      function photo(x, y, w, h, im, rot, cap) {
        var u = jpeg(im, w * 1.6, h * 1.6), p = 16, bh = cap ? 62 : p;
        return '<g transform="rotate(' + rot + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')"><rect x="' + (x - p) + '" y="' + (y - p) + '" width="' + (w + 2 * p) + '" height="' + (h + p + bh) + '" fill="#fffdf8" filter="url(#pcSh)"/>' +
          (u ? '<image href="' + u + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid slice"/>' : '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#cfc6b4"/>') +
          (cap ? '<text x="' + (x + w / 2) + '" y="' + (y + h + 43) + '" text-anchor="middle" font-family="' + hand + '" font-size="27" fill="' + ink + '">' + xml(fitTxt(cap, '27px ' + hand, w)) + '</text>' : '') + '</g>';
      }
      // ----- delante: la foto con margen blanco, como una postal impresa, y debajo el destino, el sitio y las fechas -----
      var front = '<rect width="' + W + '" height="' + H + '" fill="#f7f2e8"/>', px = 56, py = 56, pw = W - 112, phh = 806, tsz = dest.length > 16 ? 70 : 92;
      if (ph[0]) front += '<image href="' + jpeg(ph[0].im, pw, phh) + '" x="' + px + '" y="' + py + '" width="' + pw + '" height="' + phh + '" preserveAspectRatio="xMidYMid slice"/>';
      else front += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + phh + '" fill="#2f3a5c"/>';
      front += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + phh + '" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>' +
        '<text x="' + px + '" y="' + (py + phh + 62) + '" font-family="' + sans + '" font-size="26" font-weight="800" letter-spacing="8" fill="#c8382e">' + xml(tr('RECUERDOS DE')) + '</text>' +
        '<text x="' + (px - 4) + '" y="' + (py + phh + 62 + tsz * 0.95) + '" font-family="' + serif + '" font-style="italic" font-weight="700" font-size="' + tsz + '" fill="' + ink + '">' + xml(fitTxt(dest, 'italic 700 ' + tsz + 'px ' + serif, 1000)) + '</text>' +
        (ph[0] ? '<text x="' + (px + pw) + '" y="' + (py + phh + 74) + '" text-anchor="end" font-family="' + hand + '" font-size="40" fill="' + ink + '">' + xml(fitTxt(ph[0].c.ti, '40px ' + hand, 760)) + '</text>' : '') +
        '<text x="' + (px + pw) + '" y="' + (py + phh + 132) + '" text-anchor="end" font-family="' + sans + '" font-size="24" font-weight="700" letter-spacing="4" fill="#8a7f6a">' + xml(dd ? dd.toUpperCase() + ' ' + year : '') + '</text>' +
        '<rect width="' + W + '" height="' + H + '" fill="url(#pcDots)"/>';
      front = svg(DOTS, front);
      // ----- detrás: papel, borde de correo aéreo, fotos, sello, matasellos, mensaje, datos y ruta -----
      var g = '<rect width="' + W + '" height="' + H + '" fill="url(#pcAir)"/><rect x="26" y="26" width="' + (W - 52) + '" height="' + (H - 52) + '" fill="#f6efe0"/>' +
        '<line x1="1080" y1="110" x2="1080" y2="' + (H - 110) + '" stroke="#b9ac94" stroke-width="2"/>';
      [[120, 130, 390, 270, -3], [575, 150, 390, 270, 2.5], [130, 575, 390, 270, 1.8], [585, 590, 390, 270, -2.2]].forEach(function (p, k) { var x = ph[k + 1] || (k === 0 && ph.length === 1 ? ph[0] : null); if (x) g += photo(p[0], p[1], p[2], p[3], x.im, p[4], x.c.ti); });
      var sx = 1590, sy = 90, sw = 230, sh = 280, sp = ph[1] || ph[0];
      g += '<g filter="url(#pcSh)"><rect x="' + sx + '" y="' + sy + '" width="' + sw + '" height="' + sh + '" fill="#fffdf8" mask="url(#pcPerf)"/></g>' +
        '<rect x="' + (sx + 16) + '" y="' + (sy + 16) + '" width="' + (sw - 32) + '" height="' + (sh - 32) + '" fill="' + M[0] + '"/>' +
        (sp ? '<image href="' + jpeg(sp.im, (sw - 48) * 2, (sh - 96) * 2) + '" x="' + (sx + 24) + '" y="' + (sy + 24) + '" width="' + (sw - 48) + '" height="' + (sh - 96) + '" preserveAspectRatio="xMidYMid slice"/>' : '') +
        '<text x="' + (sx + sw / 2) + '" y="' + (sy + sh - 48) + '" text-anchor="middle" font-family="' + sans + '" font-weight="800" font-size="18" letter-spacing="2" fill="' + M[1] + '">' + xml(fitTxt(String(country).toUpperCase(), '800 18px ' + sans, sw - 56)) + '</text>' +
        '<text x="' + (sx + sw / 2) + '" y="' + (sy + sh - 25) + '" text-anchor="middle" font-family="' + serif + '" font-weight="700" font-size="21" fill="' + M[1] + '">' + year + '</text>';
      var mx = 1545, my = 270, r = 96;
      g += '<g opacity=".78" fill="none" stroke="' + ink + '" transform="rotate(-12 ' + mx + ' ' + my + ')"><circle cx="' + mx + '" cy="' + my + '" r="' + r + '" stroke-width="4"/><circle cx="' + mx + '" cy="' + my + '" r="' + (r - 30) + '" stroke-width="2.5"/>' +
        '<path id="pcPmT" d="M' + (mx - r + 16) + ' ' + my + ' A' + (r - 16) + ' ' + (r - 16) + ' 0 0 1 ' + (mx + r - 16) + ' ' + my + '"/><path id="pcPmB" d="M' + (mx - r + 34) + ' ' + my + ' A' + (r - 34) + ' ' + (r - 34) + ' 0 0 0 ' + (mx + r - 34) + ' ' + my + '"/>' +
        '<text font-family="' + sans + '" font-weight="800" font-size="20" letter-spacing="3" fill="' + ink + '" stroke="none"><textPath href="#pcPmT" startOffset="50%" text-anchor="middle">' + xml(fitTxt(String(cities[0] || dest).toUpperCase(), '800 20px ' + sans, 230)) + '</textPath></text>' +
        '<text font-family="' + sans + '" font-weight="800" font-size="17" letter-spacing="2" fill="' + ink + '" stroke="none"><textPath href="#pcPmB" startOffset="50%" text-anchor="middle">' + xml(tr('GUÍA DE VIAJE')) + '</textPath></text>' +
        '<text x="' + mx + '" y="' + (my + 9) + '" text-anchor="middle" font-family="' + sans + '" font-weight="800" font-size="25" fill="' + ink + '" stroke="none">' + xml(d1 ? d1.toLocaleDateString(lg(), { day: '2-digit', month: 'short', timeZone: 'UTC' }).toUpperCase() : '') + '</text>';
      for (var k = 0; k < 5; k++) { var yy = my - 44 + k * 22, dpath = 'M' + (mx - r - 250) + ' ' + yy; for (var q = 0; q < 6; q++) dpath += ' q 20 ' + (q % 2 ? 14 : -14) + ' 40 0'; g += '<path d="' + dpath + '" stroke-width="3"/>'; }
      g += '</g>';
      var top2 = ph.slice(0, 2).map(function (x) { return x.c.ti; }), msg = (en ? 'Hi! ' + nd + ' days in ' + dest + '. The best bits: ' : '¡Hola! ' + nd + ' días por ' + dest + '. Lo mejor: ') +
        (top2.length > 1 ? top2[0] + (en ? ' and ' : ' y ') + top2[1] : top2[0] || '') + '. ' + (en ? 'Wish you were here!' : '¡Ojalá estuvieras aquí!');
      lines(msg, '38px ' + hand, 390).slice(0, 9).forEach(function (ln, i) { g += '<text x="1130" y="' + (480 + i * 54) + '" font-family="' + hand + '" font-size="38" fill="' + ink + '">' + xml(ln) + '</text>'; });
      var rows = [dd, cities.length > 1 ? cities[0] + ' → ' + cities[cities.length - 1] : cities[0] || dest, nd + (en ? (nd === 1 ? ' day' : ' days') : (nd === 1 ? ' día' : ' días')) + (km ? ' · ' + Math.round(km) + ' km' : ''), got.length + (en ? ' cards' : ' cromos'), gold ? gold + (en ? ' gold or better' : ' de oro o más') : ''].filter(Boolean);
      rows.forEach(function (rw, i) { var y = 480 + i * 66; g += '<line x1="1560" y1="' + (y + 14) + '" x2="1830" y2="' + (y + 14) + '" stroke="#b9ac94" stroke-width="2"/><text x="1564" y="' + y + '" font-family="' + hand + '" font-size="26" fill="' + ink + '">' + xml(fitTxt(rw, '26px ' + hand, 280)) + '</text>'; });
      var pts = []; bt.days.forEach(function (d) { d.items.forEach(function (it) { if (it.lat != null && (!window.Mapa || Mapa.isSight(it))) pts.push(it); }); });
      if (pts.length > 1) {
        var b0 = { s: 90, n: -90, w: 180, e: -180 }; pts.forEach(function (p) { b0.s = Math.min(b0.s, p.lat); b0.n = Math.max(b0.n, p.lat); b0.w = Math.min(b0.w, p.lon); b0.e = Math.max(b0.e, p.lon); });
        var kx = Math.cos((b0.s + b0.n) / 2 * Math.PI / 180), bw = (b0.e - b0.w) * kx || 1e-6, bh = (b0.n - b0.s) || 1e-6, box = [1570, 820, 250, 150], s0 = Math.min(box[2] / bw, box[3] / bh);
        var P = pts.map(function (p) { return [box[0] + box[2] / 2 + ((p.lon - b0.w) * kx - bw / 2) * s0, box[1] + box[3] / 2 - ((p.lat - b0.s) - bh / 2) * s0]; });
        g += '<polyline points="' + P.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="none" stroke="#c8382e" stroke-width="3.5" stroke-dasharray="2 9" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<circle cx="' + P[0][0].toFixed(1) + '" cy="' + P[0][1].toFixed(1) + '" r="8" fill="' + ink + '"/><circle cx="' + P[P.length - 1][0].toFixed(1) + '" cy="' + P[P.length - 1][1].toFixed(1) + '" r="8" fill="none" stroke="' + ink + '" stroke-width="3.5"/>';
      }
      g += '<text x="1130" y="' + (H - 66) + '" font-family="' + sans + '" font-size="18" font-weight="700" letter-spacing="3" fill="#a0937b">' + xml(tr('GUÍA DE VIAJE')) + '</text>';
      g += '<rect width="' + W + '" height="' + H + '" fill="url(#pcDots)"/>';
      var holes = ''; for (var hx = sx; hx <= sx + sw + 1; hx += 23) holes += '<circle cx="' + hx + '" cy="' + sy + '" r="8"/><circle cx="' + hx + '" cy="' + (sy + sh) + '" r="8"/>';
      for (var hy = sy; hy <= sy + sh + 1; hy += 23.3) holes += '<circle cx="' + sx + '" cy="' + hy + '" r="8"/><circle cx="' + (sx + sw) + '" cy="' + hy + '" r="8"/>';
      var back = svg(DOTS + '<pattern id="pcAir" width="90" height="90" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="90" height="90" fill="#f6efe0"/><rect width="22" height="90" fill="#c8382e"/><rect x="45" width="22" height="90" fill="#22396b"/></pattern>' +
        '<filter id="pcSh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#3b2f1c" flood-opacity=".28"/></filter>' +
        '<mask id="pcPerf"><rect x="' + (sx - 10) + '" y="' + (sy - 10) + '" width="' + (sw + 20) + '" height="' + (sh + 20) + '" fill="#fff"/><g fill="#000">' + holes + '</g></mask>', g);
      busy(false);
      var ix = postIdx(); ix[id] = Date.now(); postIdx(ix);
      postDb('readwrite', function (s) { return s.put({ id: id, v: PCV, at: Date.now(), front: front, back: back }); }).catch(function () {});
      postcard3d(front, back, id);
      renderAlbum();
    }, function () { busy(false); });
  }
  // el visor: girar con un dedo (se asienta de frente o de espaldas), pellizcar para acercar, doble toque, rueda
  // las dos caras en PNG de 1920×1080, para compartir (se preparan al abrir: Safari solo comparte justo tras el toque)
  function postPng(svgTxt) {
    return new Promise(function (res) {
      var u = URL.createObjectURL(new Blob([svgTxt.replace('<svg ', '<svg width="1920" height="1080" ')], { type: 'image/svg+xml' })), im = new Image();
      im.onload = function () { var c = document.createElement('canvas'); c.width = 1920; c.height = 1080; c.getContext('2d').drawImage(im, 0, 0, 1920, 1080); URL.revokeObjectURL(u); try { c.toBlob(function (b) { res(b); }, 'image/png'); } catch (e) { res(null); } };
      im.onerror = function () { res(null); }; im.src = u;
    });
  }
  // la postal sella el país (o países) del viaje en el pasaporte
  function sealTrip(id) {
    var t = (TRIPS || []).filter(function (x) { return x.id === id; })[0]; if (!t || !window.Mundo || !Mundo.seal) return;
    var nw = Mundo.seal(t);
    if (nw.length && window.Juego) setTimeout(function () { Juego.toast('Sello de ' + nw.join(', ') + ' en tu pasaporte'); }, 900);
  }
  function postcard3d(front, back, id) {
    if (id) sealTrip(id);
    var files = null, name = 'postal-' + (id || 'viaje');
    Promise.all([postPng(front), postPng(back)]).then(function (b) { files = b.map(function (x, i) { try { return x && new File([x], name + (i ? '-detras' : '-delante') + '.png', { type: 'image/png' }); } catch (e) { return null; } }).filter(Boolean); });
    var old = document.getElementById('pcView'); if (old) old.remove();
    var v = document.createElement('div'); v.className = 'pcv'; v.id = 'pcView';
    v.innerHTML = '<div class="pcv-top">' + (id ? '<button type="button" class="pcv-b2 sq" data-pv="redo">Rehacer</button>' : '<span></span>') + '<button type="button" class="pcv-x sq" data-pv="close" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>' +
      '<div class="pcv-stage"><div class="pcv-zoom"><div class="pcv-card in"><div class="pcv-face pcv-f">' + front + '<i class="pcv-gl"></i></div><div class="pcv-face pcv-bk">' + back + '<i class="pcv-gl"></i></div></div></div></div>' +
      '<div class="pcv-bar"><button type="button" class="pcv-b2 sq" data-pv="flip">Darle la vuelta</button><button type="button" class="pcv-b2 pri sq" data-pv="share">Compartir</button></div><p class="pcv-hint">Arrastra para girarla · pellizca para acercar</p>';
    var stage = v.querySelector('.pcv-stage'), zoom = v.querySelector('.pcv-zoom'), card = v.querySelector('.pcv-card');
    var S = { rx: 0, ry: 0, s: 1, x: 0, y: 0 }, P = {}, rot = null, pinch = null, pan = null, lastTap = 0;
    function size() { var w = Math.min(window.innerWidth - 28, (window.innerHeight - 170) * 16 / 9, 1100); card.style.width = w + 'px'; card.style.height = (w * 9 / 16) + 'px'; }
    function turn(rx, ry, snap) {
      S.rx = rx; S.ry = ry; card.classList.toggle('snap', !!snap);
      var face = ((ry % 360) + 360) % 360, off = Math.min(face, Math.abs(face - 180), 360 - face);
      card.style.setProperty('--rx', rx.toFixed(1) + 'deg'); card.style.setProperty('--ry', ry.toFixed(1) + 'deg');
      card.style.setProperty('--gx', (50 + (((ry % 180) + 270) % 180 - 90) * 0.9).toFixed(0) + '%'); card.style.setProperty('--go', Math.min(1, (off + Math.abs(rx)) / 35).toFixed(2));
    }
    function place(smooth) {
      var w = card.offsetWidth, h = card.offsetHeight, mx = Math.max(0, (S.s - 1) * w / 2 + 40), my = Math.max(0, (S.s - 1) * h / 2 + 40);
      S.x = Math.max(-mx, Math.min(mx, S.x)); S.y = Math.max(-my, Math.min(my, S.y));
      zoom.classList.toggle('snap', !!smooth); v.classList.toggle('zoomed', S.s > 1.02);
      zoom.style.transform = 'translate(' + S.x.toFixed(1) + 'px,' + S.y.toFixed(1) + 'px) scale(' + S.s.toFixed(3) + ')';
    }
    function zoomTo(s, cx, cy, smooth) {
      var r = stage.getBoundingClientRect(), ox = cx - (r.left + r.width / 2), oy = cy - (r.top + r.height / 2), k = s / S.s;
      S.x = ox - (ox - S.x) * k; S.y = oy - (oy - S.y) * k; S.s = s;
      if (s <= 1.02) { S.s = 1; S.x = 0; S.y = 0; }
      // de cerca, la cara que se ve queda plana: así el texto se vuelve a dibujar nítido
      if (S.s > 1) turn(0, Math.round(S.ry / 180) * 180, true);
      place(smooth);
    }
    function pts() { return Object.keys(P).map(function (k) { return P[k]; }); }
    stage.addEventListener('pointerdown', function (e) {
      P[e.pointerId] = { x: e.clientX, y: e.clientY }; try { stage.setPointerCapture(e.pointerId); } catch (er) {}
      var p = pts();
      if (p.length === 2) {
        rot = null; pan = null;
        pinch = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1, s: S.s, x: S.x, y: S.y, mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2 };
      } else if (p.length === 1) {
        var now = Date.now();
        if (now - lastTap < 300) { zoomTo(S.s > 1.05 ? 1 : 2.5, e.clientX, e.clientY, true); lastTap = 0; return; }
        lastTap = now;
        if (S.s > 1.02) pan = { x: e.clientX, y: e.clientY, sx: S.x, sy: S.y };
        else rot = { x: e.clientX, y: e.clientY, ry: S.ry };
      }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!P[e.pointerId]) return; P[e.pointerId] = { x: e.clientX, y: e.clientY };
      var p = pts();
      if (pinch && p.length >= 2) {
        var d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), mx = (p[0].x + p[1].x) / 2, my = (p[0].y + p[1].y) / 2;
        var s = Math.max(1, Math.min(5, pinch.s * d / pinch.d)), r = stage.getBoundingClientRect(), ox = pinch.mx - (r.left + r.width / 2), oy = pinch.my - (r.top + r.height / 2), k = s / pinch.s;
        S.s = s; S.x = ox - (ox - pinch.x) * k + (mx - pinch.mx); S.y = oy - (oy - pinch.y) * k + (my - pinch.my);
        if (s > 1.02 && (S.rx || S.ry % 180)) turn(0, Math.round(S.ry / 180) * 180, true);
        place(false); return;
      }
      if (pan) { S.x = pan.sx + e.clientX - pan.x; S.y = pan.sy + e.clientY - pan.y; place(false); return; }
      if (rot) { var dx = e.clientX - rot.x, dy = e.clientY - rot.y; if (Math.abs(dx) + Math.abs(dy) > 4) lastTap = 0; turn(Math.max(-25, Math.min(25, -dy * 0.25)), rot.ry + dx * 0.5, false); }
    });
    function up(e) {
      delete P[e.pointerId];
      if (pinch && pts().length < 2) { pinch = null; if (S.s < 1.05) zoomTo(1, 0, 0, true); var q = pts()[0]; if (q && S.s > 1.02) pan = { x: q.x, y: q.y, sx: S.x, sy: S.y }; return; }
      if (pan && !pts().length) pan = null;
      if (rot && !pts().length) { rot = null; turn(0, Math.round(S.ry / 180) * 180, true); }   // se asienta con rebote
    }
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    stage.addEventListener('wheel', function (e) { e.preventDefault(); zoomTo(Math.max(1, Math.min(5, S.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15))), e.clientX, e.clientY, false); }, { passive: false });
    v.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pv]'), a = b && b.getAttribute('data-pv');
      if (a === 'close') { v.classList.add('out'); window.removeEventListener('resize', size); setTimeout(function () { v.remove(); }, 260); }
      else if (a === 'flip') { if (S.s > 1) zoomTo(1, 0, 0, true); turn(0, S.ry + 180, true); }
      else if (a === 'redo') { if (!confirm(tr('¿Hacer la postal otra vez con tus cromos de ahora?'))) return; v.remove(); window.removeEventListener('resize', size); makePostcard(id, null, true); }
      else if (a === 'share') {
        if (!files || !files.length) { if (window.Juego) Juego.toast('Preparando la postal…'); return; }
        var two = navigator.canShare && navigator.canShare({ files: files }), one = !two && navigator.canShare && navigator.canShare({ files: [files[0]] });
        if (two || one) { navigator.share({ files: two ? files : [files[0]], title: name }).catch(function () {}); return; }
        files.forEach(function (f, i) { setTimeout(function () { var l = document.createElement('a'); l.href = URL.createObjectURL(f); l.download = f.name; document.body.appendChild(l); l.click(); setTimeout(function () { l.remove(); }, 2000); }, i * 400); });
      }
    });
    window.addEventListener('resize', size);
    if (window.Lang) Lang.watch(v);
    document.body.appendChild(v);
    card.addEventListener('animationend', function () { card.classList.remove('in'); });
    size(); turn(0, 0, true);
  }
  // para la postal, la foto lo más grande posible: las miniaturas de Wikimedia se piden a 1280 o 960 (si el original es menor, falla y se usa la que había)
  function loadBig(src) {
    var m = /^(.*\/thumb\/.+\/)(\d+)px-(.*)$/.exec(src || '');
    if (!m || +m[2] >= 1280) return loadImg(src);
    return loadImg(m[1] + '1280px-' + m[3]).then(function (im) { return im || loadImg(m[1] + '960px-' + m[3]); }).then(function (im) { return im || loadImg(src); });
  }
  function loadImg(src) {
    return new Promise(function (res) {
      if (!src) return res(null);
      var im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = function () { res(im); }; im.onerror = function () { res(null); };   // sin permiso CORS: se deja el hueco
      var abs = /^data:/.test(src) ? src : new URL(src, location.href).href;
      (window.Mapa ? Mapa.corsUrl(abs, 1280).catch(function () { return abs; }) : Promise.resolve(abs)).then(function (u) { im.src = u; });
    });
  }


  /* ---------- Insignias: 12 categorías con 5 niveles, con los materiales de los cromos ---------- */
  var BIC = {
    pais: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.9 3 2.9 14 0 17M12 3.5c-2.9 3-2.9 14 0 17"/>',
    viaje: '<rect x="3.5" y="7" width="17" height="12.5" rx="2.5"/><path d="M9 7V5h6v2M3.5 12.5h17"/>',
    cromo: '<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="9.5" r="2.5"/><path d="M9 15.5h6M9.5 18h5"/>',
    must: '<path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.6l-5 2.6.9-5.6-4-3.9 5.6-.8z"/>',
    hist: '<path d="M4 20V9h3v2h2V9h2v2h2V9h2v2h2V9h3v11zM10 20v-4a2 2 0 0 1 4 0v4"/>',
    natu: '<path d="M2.5 19.5l6.5-11 4 6.5 2.5-3.5 6 8z"/>',
    arte: '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M6.5 16.5l4-5 3 3.5 2-2 2 3.5"/><circle cx="15.5" cy="8.5" r="1.3"/>',
    urbe: '<path d="M3.5 20.5V10l5-3v13.5M8.5 20.5V4h7v16.5M15.5 20.5V9.5h5v11M2.5 20.5h19"/>',
    gps: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    quiz: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1 1-1 1.7M12 16.6v.3"/>',
    rare: '<path d="M7 4h10l3.5 5L12 20 3.5 9zM3.5 9h17M9.5 4L12 9l2.5-5M12 9v11"/>',
    full: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5z"/>'
  };
  // [id, nombre, qué cuenta, niveles]
  var BTRACK = [['pais', 'Explorador', 'Países visitados', [1, 3, 6, 12, 25]], ['viaje', 'Viajero', 'Viajes hechos', [1, 3, 6, 10, 20]], ['cromo', 'Coleccionista', 'Cromos canjeados', [1, 10, 30, 75, 150]],
    ['must', 'Imprescindibles', 'Imprescindibles canjeados', [1, 5, 15, 40, 80]], ['gps', 'En el sitio', 'Cromos con GPS', [1, 5, 15, 40, 80]], ['rare', 'Rareza', 'Cromos de oro o mejores', [1, 5, 12, 25, 50]],
    ['hist', 'Historia', 'Castillos, ruinas, monumentos y templos', [1, 5, 12, 25, 50]], ['natu', 'Naturaleza', 'Naturaleza, jardines y miradores', [1, 5, 12, 25, 50]], ['arte', 'Arte', 'Museos y espectáculos', [1, 4, 10, 20, 40]],
    ['urbe', 'Ciudad', 'Plazas, barrios, mercados y paseos', [1, 5, 12, 25, 50]], ['quiz', 'Sabio', 'Quizzes perfectos (5 de 5)', [1, 3, 7, 15, 30]], ['full', 'Álbum completo', 'Viajes con todos los cromos', [1, 2, 3, 5, 8]]];
  var BMAT = ['copper', 'silver', 'gold', 'emerald', 'ruby'], BMAT_ES = { copper: 'Cobre', silver: 'Plata', gold: 'Oro', emerald: 'Esmeralda', ruby: 'Rubí' };
  function badgeList(v) {
    return BTRACK.map(function (T) {
      var have = v[T[0]] || 0, lv = T[3].filter(function (n) { return have >= n; }).length, need = T[3][lv] || 0;
      var from = lv ? T[3][lv - 1] : 0;
      return { id: T[0], name: T[1], what: T[2], steps: T[3], have: have, lv: lv, mat: lv ? BMAT[lv - 1] : '', next: lv < 5 ? BMAT[lv] : '', need: need, frac: lv >= 5 ? 1 : Math.max(0, (have - from) / (need - from)) };
    });
  }
  function medal(b, mat) { mat = mat === undefined ? b.mat : mat; return '<i class="bdm' + (mat ? ' t-' + mat : ' off') + '"><svg viewBox="0 0 24 24">' + BIC[b.id] + '</svg></i>'; }
  function badgeHTML(b) {
    return '<button type="button" class="bdg sq' + (b.lv ? '' : ' off') + '" data-bdg="' + b.id + '">' + medal(b) + '<b>' + esc(b.name) + '</b>' +
      '<small>' + (b.lv ? '<em>' + esc(BMAT_ES[b.mat]) + '</em> ' : '') + (b.lv >= 5 ? '' : '<span>' + b.have + '/' + b.need + '</span>') + '</small><span class="bdg-bar"><i style="width:' + Math.round(b.frac * 100) + '%"></i></span></button>';
  }
  // ficha de una insignia: qué cuenta y sus 5 niveles
  // todas las insignias en una página: cada categoría con sus 5 niveles, lo que tienes y lo que falta
  function openBadges(B) {
    var old = document.getElementById('bdgPage'); if (old) old.remove();
    var on = B.reduce(function (a, b) { return a + b.lv; }, 0), box = document.createElement('div');
    box.id = 'bdgPage'; box.className = 'qzp';
    var sorted = B.slice().sort(function (a, b) { return b.lv - a.lv || b.frac - a.frac; });
    box.innerHTML = '<div class="qzp-bar"><button type="button" class="qzp-back sq" data-bp="close"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Perfil</span></button><b>Insignias</b><span></span></div>' +
      '<div class="qzp-in"><div class="bdp-sum"><b>' + on + '<i> / ' + B.length * 5 + '</i></b><small>niveles conseguidos</small><span class="bdg-bar"><i style="width:' + Math.round(on / (B.length * 5) * 100) + '%"></i></span></div>' +
      '<div class="bdp-list">' + sorted.map(function (b) {
        return '<div class="card bdp-c' + (b.lv ? '' : ' off') + '"><div class="bdp-h">' + medal(b) + '<span><b>' + esc(b.name) + '</b><small>' + esc(b.what) + '</small></span><em>' + (b.lv >= 5 ? '' : b.have + '/' + b.need) + '</em></div>' +
          '<span class="bdg-bar bdp-bar"><i style="width:' + Math.round(b.frac * 100) + '%"></i></span>' +
          '<div class="bdi-steps">' + b.steps.map(function (n, k) { return '<span class="bdi-s' + (b.lv > k ? ' on' : '') + '">' + medal(b, b.lv > k ? BMAT[k] : '') + '<small>' + esc(BMAT_ES[BMAT[k]]) + '</small><b>' + n + '</b></span>'; }).join('') + '</div></div>';
      }).join('') + '</div></div>';
    box.addEventListener('click', function (e) { if (e.target.closest('[data-bp="close"]')) { box.classList.add('out'); setTimeout(function () { box.remove(); }, 260); } });
    if (window.Lang) Lang.watch(box);
    document.body.appendChild(box);
  }
  function badgeInfo(b) {
    return '<div class="bdi-h">' + medal(b) + '<span><b>' + esc(b.name) + '</b><small>' + esc(b.what) + '</small></span></div><div class="bdi-steps">' + b.steps.map(function (n, k) {
      return '<span class="bdi-s' + (b.lv > k ? ' on' : '') + '">' + medal(b, b.lv > k ? BMAT[k] : '') + '<small>' + esc(BMAT_ES[BMAT[k]]) + '</small><b>' + n + '</b></span>';
    }).join('') + '</div>';
  }

  /* ---------- Perfil: mis viajes, cifras e insignias ---------- */
  function overview() {
    return trips().then(function (list) {
      var alb = albumGet(), all = 0, got = 0, must = 0, mustGot = 0, full = 0, days = 0, out = [], recent = [], v = { pais: 0, viaje: 0, gps: 0, rare: 0, hist: 0, natu: 0, arte: 0, urbe: 0 }, cc = {};
      var now = today();
      list.forEach(function (t) {
        var cs = cromosOf(t, alb), g0 = cs.filter(function (c) { return c.got; }), m = cs.filter(function (c) { return c.must; }), bt = t.b.trip, ph = t.b.photos || {};
        all += cs.length; got += g0.length; must += m.length; mustGot += m.filter(function (c) { return c.got; }).length;
        if (cs.length && g0.length === cs.length) full++;
        g0.forEach(function (c) {
          if (c.got.gps) v.gps++;
          if (c.rate && c.rate.r >= 80) v.rare++;
          SETS.forEach(function (S) { if (S[2].indexOf((c.rate || {}).pos) >= 0) v[S[0]]++; });
        });
        days += bt.days.length;
        g0.forEach(function (c) { recent.push({ img: c.img, ph: c.ph, ti: c.ti, at: c.got.at }); });
        var start = bt.defaultStart, end = start ? new Date(new Date(start + 'T12:00:00Z').getTime() + (bt.days.length - 1) * 864e5).toISOString().slice(0, 10) : '';
        // el motor antiguo no decía qué es cada foto: en la web todas las fotos son direcciones
        var st0 = !start ? 'next' : now > end ? 'past' : now >= start ? 'now' : 'next';
        if (st0 === 'past') v.viaje++;
        if (st0 !== 'next' && window.Mundo && Mundo.cached) (Mundo.cached(t) || []).forEach(function (c) { cc[c] = 1; });
        out.push({ id: t.id, title: tripTitle(t), start: start, end: end, days: bt.days.length, cover: ph[bt.cover] || '', got: g0.length, total: cs.length, mustGot: m.filter(function (c) { return c.got; }).length, must: m.length,
          status: !start ? 'next' : now > end ? 'past' : now >= start ? 'now' : 'next', top: m.slice(0, 3).map(function (c) { return c.ti; }), ref: t });
      });
      recent.sort(function (a, b) { return String(b.at).localeCompare(String(a.at)); });
      var qs = {}; try { qs = JSON.parse(localStorage.getItem('guia-quiz') || '{}') || {}; } catch (e) {}
      v.pais = Object.keys(cc).length; v.cromo = got; v.must = mustGot; v.full = full;
      v.quiz = Math.max(qs.perfect || 0, Object.keys(qs.trips || {}).filter(function (k) { return qs.trips[k].best >= 5; }).length);
      var B = badgeList(v), on = B.reduce(function (a, b) { return a + b.lv; }, 0);
      // la siguiente: la que está más cerca de subir
      var nx = B.filter(function (b) { return b.lv < 5; }).sort(function (a, b) { return b.frac - a.frac || a.need - b.need; })[0] || null;
      return { trips: out, all: all, got: got, must: must, mustGot: mustGot, totalDays: days, badges: B, badgesOn: on, badgesMax: B.length * 5, nextBadge: nx, nextBadgeHTML: nx ? medal(nx, nx.next) : '', recent: recent };
    });
  }
  /* ---------- Mis personajes (personajes.js, solo web): uno por cada sitio visitado; los que faltan, en silueta ---------- */
  var PJC_TRY = ['JP', 'IT', 'MX', 'AU', 'CN', 'BR', 'GR', 'NL', 'IN', 'AR', 'CA', 'EG', 'PE', 'TH', 'IE', 'NO', 'KE', 'FR', 'ES'];
  function pjHint(t) { var m = (t.ref && t.ref.b && t.ref.b.meta) || {}; return [t.title].concat((m.generated || {}).cities || (m.mapCities || []).map(function (c) { return c.es; })).join(' '); }
  function pjcSeen(o) { try { if (o) localStorage.setItem('guia-pjcol', JSON.stringify(o)); return JSON.parse(localStorage.getItem('guia-pjcol') || 'null'); } catch (e) { return o || null; } }
  function pjcHTML(trips) {
    if (!window.Pj || !Pj.mascot || !Pj.allowed() || !window.Mundo) return '';
    var got = {}, next = {}, order = [];
    trips.slice().sort(function (a, b) { return String(a.start).localeCompare(String(b.start)); }).forEach(function (t) {
      var hint = pjHint(t);
      (Mundo.cached(t.ref) || []).forEach(function (cc) {
        var key = Pj.placeKey(cc, hint), on = t.status !== 'next', M = on ? got : next;
        if (got[key] || M[key]) return;
        var reg = key !== cc, k = Pj.mascot([cc], t.start, reg ? hint : '', key, '');
        if (!k) return;
        M[key] = { key: key, k: k, name: Pj.placeName(key) || Mundo.name(cc), y: String(t.start || '').slice(0, 4) };
        if (on) order.push(key);
      });
    });
    var all = Pj.places(), lock = Object.keys(next).filter(function (k) { return !got[k]; }).map(function (k) { return next[k]; });
    PJC_TRY.forEach(function (cc) { if (lock.length < 6 && !got[cc] && !next[cc] && all.indexOf(cc) >= 0) lock.push({ key: cc, k: Pj.placeKind(cc), name: '', y: '' }); });
    var n = order.length, total = Math.max(all.length, n);
    // los nuevos desde la última vez entran con su animación (la primera vez, solo el último)
    var seen = pjcSeen(), fresh = seen ? order.filter(function (k) { return seen.indexOf(k) < 0; }) : order.slice(-1);
    pjcSeen(order.slice()); PJC_NEW = fresh.length ? got[fresh[fresh.length - 1]].k : '';
    function tile(x, on, nx) {
      return '<button type="button" class="pjc-t sq' + (on ? '' : ' lk') + (fresh.indexOf(x.key) >= 0 ? ' fresh' : '') + '"' + (on ? ' data-pjc="' + esc(x.k) + '"' : '') + '><span class="pjc-f" data-pjk="' + esc(x.k) + '"></span>' +
        '<b>' + (on || nx ? esc(x.name) : '?') + '</b><small>' + (on ? esc(x.y) : nx ? 'Próximo viaje' : '') + '</small></button>';
    }
    return '<div class="pf-h">Mis personajes <small>' + n + ' de ' + total + '</small></div>' +
      '<p class="mw-pp">Uno por cada país o región que visitas. Toca uno para verlo.</p>' +
      '<div class="pjc">' + order.map(function (k) { return tile(got[k], 1); }).join('') + lock.slice(0, 3 + (3 - n % 3) % 3).map(function (x) { return tile(x, 0, !!x.name); }).join('') + '</div>';
  }
  var PJC_NEW = '';
  // quién asoma del sobre: el animal del viaje del sobre (con el de rubí, hasta tres del sitio)
  function packPj(list, tid, kind) {
    if (!window.Pj || !Pj.forPack || !window.Mundo || !tid) return null;
    var t = list.filter(function (x) { return x.id === tid; })[0]; if (!t) return null;
    var m = (t.b && t.b.meta) || {}, hint = [tripTitle(t)].concat((m.generated || {}).cities || (m.mapCities || []).map(function (c) { return c.es; })).join(' ');
    return Pj.forPack(Mundo.cached(t) || [], (t.b && t.b.trip && t.b.trip.defaultStart) || '', hint, t.id, kind);
  }
  function pjcFill(box) {
    if (!window.Pj || !box) return;
    Array.prototype.forEach.call(box.querySelectorAll('[data-pjk]'), function (el) { if (!el.firstChild && el.getAttribute('data-pjk')) el.appendChild(Pj.figure(el.getAttribute('data-pjk'))); });
    if (PJC_NEW) { var k = PJC_NEW; PJC_NEW = ''; setTimeout(function () { if (box.isConnected) Pj.play(k, { ground: window.innerHeight - 110 }); }, 900); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-pjc]'); if (!b || !window.Pj) return;
    Pj.play(b.getAttribute('data-pjc'), { ground: window.innerHeight - 110 });
  });
  function shortRange(t) { return t.start ? shortDate(t.start) + ' – ' + shortDate(t.end) : ''; }
  function renderProfile() {
    var box = $('#profBox'); if (!box) return Promise.resolve();
    return overview().then(function (O) {
      var B = O.badges, S = { past: 'Hecho', now: 'En curso', next: 'Próximo' };
      var sorted = O.trips.slice().sort(function (a, b) { return String(b.start).localeCompare(String(a.start)); });
      box.innerHTML = '<div id="pfWorld"></div>' +
        '<div class="pf-h">Mis viajes</div>' + (sorted.length ? sorted.slice(0, 3).map(function (t) {
          return '<div class="card pf-trip">' + (t.cover ? '<div class="pf-ph" style="background-image:url(&quot;' + esc(t.cover) + '&quot;)"></div>' : '<div class="pf-ph"></div>') +
            '<div class="pf-m"><span class="pf-st ' + t.status + '">' + S[t.status] + '</span><b>' + esc(t.title) + '</b><small>' + esc(shortRange(t)) + ' · ' + t.days + (t.days === 1 ? ' día' : ' días') + '</small>' +
            '<div class="alb-bar"><i style="width:' + (t.total ? Math.round(t.got / t.total * 100) : 0) + '%"></i></div><small>' + t.got + ' de ' + t.total + ' cromos · ' + t.mustGot + ' de ' + t.must + ' imprescindibles</small>' +
            (cfg.single ? '' : '<div class="btn-row"><button type="button" class="btn ghost sq" data-open="' + esc(t.id) + '">Abrir guía</button></div>') + '</div></div>';
        }).join('') + (sorted.length > 3 ? '<button type="button" class="lst-more sq" data-go="trips">Ver todos (' + sorted.length + ')</button>' : '') : '<p class="note">Aún no hay viajes.</p>') +
        pjcHTML(O.trips) +
        '<div class="pf-h">Insignias · ' + O.badgesOn + ' de ' + O.badgesMax + '</div><div class="card"><div class="badges">' + B.slice().sort(function (a, b) { return b.lv - a.lv || b.frac - a.frac; }).slice(0, 6).map(badgeHTML).join('') + '</div><button type="button" class="lst-more sq bdg-all" data-bdgall>Ver todas (' + B.length * 5 + ')</button><div class="bdi" id="bdgInfo" hidden></div></div>';
      box._badges = B;
      pjcFill(box);
      if (window.Mundo && window.Mapa) Mundo.mount($('#pfWorld'), O.trips, { base: O, single: cfg.single });
    });
  }
  function reset0() { TRIPS = null; }
  function albImport(f) {
    var r = new FileReader(); r.onload = function () {
      var o = null; try { o = JSON.parse(r.result); } catch (e) {}
      if (!o || o.app !== 'guia-album' || !o.album) { alert('Ese archivo no es una copia del álbum.'); return; }
      var a = albumGet(); Object.keys(o.album).forEach(function (k) { if (!a[k]) a[k] = o.album[k]; });   // se suman, no se pisan
      albumSet(a);
      if (o.game && window.Juego) { var g1 = Juego.get(), g2 = o.game; if ((g2.bag || []).length > g1.bag.length) g1.bag = g2.bag; Object.keys(g2.own || {}).forEach(function (k) { if (!g1.own[k]) g1.own[k] = g2.own[k]; }); Object.keys(g2.claimed || {}).forEach(function (k) { g1.claimed[k] = 1; }); Juego.save(g1); }
      (cfg.restoreTrips && o.trips ? cfg.restoreTrips(o.trips) : Promise.resolve()).then(function () { reset0(); if (cfg.onChange) cfg.onChange(''); renderAlbum(); renderProfile(); alert('Copia cargada.'); });
    }; r.readAsText(f);
  }

  // todo por delegación: el álbum puede estar dentro de una hoja que se vuelve a pintar
  var bound = false;
  function init(o) {
    for (var k in o) cfg[k] = o[k];
    if (bound) return; bound = true;
    document.addEventListener('click', function (e) {
      var t = e.target; if (!t.closest) return;
      if (t.closest('#crView')) { viewerClick(e); return; }
      var c = t.closest('[data-cr]'), pb = t.closest('[data-post]'), ao = t.closest('[data-albopen]');
      var crf = t.closest('[data-crf]');
      if (crf) { crFilter = crf.getAttribute('data-crf'); renderAlbum(); return; }
      if (ao) { openT = ao.getAttribute('data-albopen'); crFilter = 'all'; renderAlbum(); window.scrollTo(0, 0); return; }
      if (t.closest('[data-albback]')) { openT = null; renderAlbum(); window.scrollTo(0, 0); return; }
      if (t.closest('[data-alball]')) { albAll = true; renderAlbum(); window.scrollTo(0, 0); return; }
      if (t.closest('[data-albless]')) { albAll = false; renderAlbum(); window.scrollTo(0, 0); return; }
      if (t.closest('[data-bdgall]')) { var pb1 = $('#profBox'); if (pb1 && pb1._badges) openBadges(pb1._badges); return; }
      var bd = t.closest('[data-bdg]');
      if (bd) {
        var pb0 = $('#profBox'), inf = $('#bdgInfo'), bb = ((pb0 && pb0._badges) || []).filter(function (x) { return x.id === bd.getAttribute('data-bdg'); })[0];
        if (!inf || !bb) return;
        var same = !inf.hidden && inf.getAttribute('data-id') === bb.id;
        Array.prototype.forEach.call(document.querySelectorAll('.bdg.sel'), function (x) { x.classList.remove('sel'); });
        if (same) { inf.hidden = true; return; }
        inf.innerHTML = badgeInfo(bb); inf.setAttribute('data-id', bb.id); inf.hidden = false; bd.classList.add('sel');
        return;
      }
      var so = t.closest('[data-setopen]');
      if (so) { openS = so.getAttribute('data-setopen'); renderAlbum().then(function () { var b0 = $('#albumBox'); if (b0 && b0.scrollIntoView) b0.scrollIntoView({ block: 'start' }); }); return; }
      if (t.closest('[data-setback]')) { openS = null; renderAlbum(); return; }
      var po = t.closest('[data-pkopen]');
      if (po) { var pkK = po.getAttribute('data-pkopen'), pkT = po.getAttribute('data-pktrip') || ''; Promise.all([allCards(), trips()]).then(function (r) { Juego.openPack(pkK, pkT, r[0], function () { renderAlbum(); }, packPj(r[1], pkT, pkK)); }); return; }
      if (c) openCromo(c.getAttribute('data-cr'));
      else if (pb) makePostcard(pb.getAttribute('data-post'), pb);
      else if (t.closest('#albExp')) (cfg.backupTrips ? cfg.backupTrips() : Promise.resolve([])).then(function (tr0) {
        var g0 = window.Juego ? Juego.get() : null; if (g0) { g0.backup = Date.now(); Juego.save(g0); }
        download({ app: 'guia-album', at: new Date().toISOString(), album: albumGet(), game: g0, trips: tr0 }, 'guia-viaje-copia-' + today() + '.json');
      });
    });
    document.addEventListener('change', function (e) {
      if (e.target.id !== 'albImp') return;
      var f = e.target.files[0]; e.target.value = ''; if (f) albImport(f);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('#crView.on')) closeCromo(); });
  }

  // todos los viajes en la web: los de la app y los creados (IndexedDB guia-trips)
  function webTrips() {
    var a = fetch('trips/index.json').then(function (r) { return r.json(); }).catch(function () { return []; }).then(function (idx) {
      return Promise.all(idx.map(function (t) { return fetch('trips/' + t.id + '.json').then(function (r) { return r.json(); }).then(function (b) { return { id: t.id, b: b }; }).catch(function () { return null; }); }));
    });
    var u = new Promise(function (res) {
      if (!window.indexedDB) return res([]);
      var q = indexedDB.open('guia-trips', 1);
      q.onupgradeneeded = function () { q.result.createObjectStore('trips', { keyPath: 'id' }); };
      q.onerror = function () { res([]); };
      q.onsuccess = function () { try { var g = q.result.transaction('trips').objectStore('trips').getAll(); g.onsuccess = function () { res((g.result || []).map(function (x) { return { id: x.id, b: x.bundle }; })); }; g.onerror = function () { res([]); }; } catch (e) { res([]); } };
    });
    return Promise.all([a, u]).then(function (r) { return r[0].filter(Boolean).concat(r[1]); });
  }
  return { ready: function () { return !!cfg.trips; }, webTrips: webTrips, postcard: function (id) { trips().then(function () { makePostcard(id); }); }, init: init, renderAlbum: renderAlbum, renderProfile: renderProfile, overview: overview, reset: function () { TRIPS = null; }, get: albumGet, isCromo: isCromo, cromosOf: cromosOf, trips: trips, listBox: listBox, searchText: searchText, allCards: allCards };
})();
