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
    var g = Juego.get(), d = Juego.dups(g), groups = [], order = { r: 0, g: 1, s: 2, c: 3 };
    g.bag.forEach(function (b) { var f = groups.filter(function (x) { return x.k === b.k && x.t === b.t; })[0]; if (f) f.n++; else groups.push({ k: b.k, t: b.t, n: 1 }); });
    groups.sort(function (a, b) { return order[a.k] - order[b.k]; });
    var head = '<div class="pk-row">' + (groups.length ? groups.map(function (x) {
      var tr0 = (TRIPS || []).filter(function (t) { return t.id === x.t; })[0];
      return '<button type="button" class="pk-mini k-' + x.k + ' sq" data-pkopen="' + x.k + '" data-pktrip="' + esc(x.t) + '"><span class="pk-foil"></span><b>' + x.n + '</b><small>' + esc(Juego.PACK[x.k]) + '</small>' + (tr0 ? '<small class="pk-trip">' + esc(tripTitle(tr0)) + '</small>' : '') + '</button>';
    }).join('') : '<p class="pk-none">Gana sobres con los quizzes: cuantos más aciertos, mejor sobre.</p>') +
      (d >= 5 ? '<button type="button" class="pk-ex sq" data-pkex>Cambiar 5 repetidos por un sobre</button>' : '') + '</div>';
    // colecciones: cuántos has canjeado de cada clase
    var sets = SETS.map(function (S) {
      var all = cards.filter(function (c) { return S[2].indexOf(c.rate.pos) >= 0; });
      return all.length ? { k: S[0], n: S[1], have: all.filter(function (c) { return c.got; }).length, all: all.length } : null;
    }).filter(Boolean);
    if (cards.length) sets.push({ k: 'top', n: 'Oro o mejores', have: cards.filter(function (c) { return c.got && c.rate.r >= 80; }).length, all: cards.length });
    return head + (sets.length ? '<div class="pf-h">Colecciones</div><div class="set-row">' + sets.map(function (x) {
      return '<button type="button" class="card set-c sq" data-setopen="' + x.k + '"><b>' + esc(x.n) + '</b><small>' + x.have + ' de ' + x.all + '</small><span class="alb-bar"><i style="width:' + Math.round(x.have / x.all * 100) + '%"></i></span></button>';
    }).join('') + '</div><div class="pf-h">Mis viajes</div>' : '');
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
  // un cromo en la cuadrícula (álbum de un viaje o colección)
  function tileHTML(tid, c) {
    var R = c.rate || { r: '', pos: '', tier: 'copper' };
    return '<button type="button" class="cr fc t-' + R.tier + (c.got ? ' got' : '') + (c.own ? ' own' : '') + phCls(c) + '" data-cr="' + esc(tid + '|' + c.id) + '"' + phStyle(c) + '>' +
      '<i class="fc-b"></i>' + (c.got ? '<i class="sheen"></i>' : '') + (c.own && c.own.n > 1 ? '<i class="fc-x">×' + c.own.n + '</i>' : '') + (c.got ? '<i class="fc-v">' + (c.got.gps ? '✓ GPS' : '✓') + '</i>' : '') + '<span>' + esc(c.ti) + '</span></button>';
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
        var pb = $('#postBox'); if (pb) pb.hidden = true;
        // al principio, solo los viajes: compacto
        var rows = withC.map(function (t) { var cs = cromosOf(t, alb); return { t: t, total: cs.length, got: cs.filter(function (c) { return c.got; }).length }; });
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
        albumList();
        if (window.Mundo) Mundo.detect(withC).then(function (ch) { if (ch && !openT) albumList(); }).catch(function () {});
        return;
      }
      var t = cur, cs = cromosOf(t, alb), got = cs.filter(function (c) { return c.got; }).length;
      box._lst = '';
      var seen = cs.filter(function (c) { return crFilter === 'got' ? c.got : crFilter === 'miss' ? !c.got : crFilter === 'top' ? c.rate && (c.rate.r >= 80) : true; });
      box.innerHTML = (cfg.single ? '' : '<button type="button" class="alb-back sq" data-albback><svg class="ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"></path></svg><span>Todos los viajes</span></button>') +
        '<div class="alb" data-trip="' + esc(t.id) + '"><div class="alb-h"><b>' + esc(tripTitle(t)) + '</b><small>' + got + ' de ' + cs.length + '</small></div>' +
          '<div class="alb-bar"><i style="width:' + (cs.length ? Math.round(got / cs.length * 100) : 0) + '%"></i></div>' +
          (cs.length > 8 ? '<div class="lst-chips">' + [['all', 'Todos', cs.length], ['got', 'Canjeados', got], ['miss', 'Faltan', cs.length - got], ['top', 'Oro o más', cs.filter(function (c) { return c.got && c.rate && c.rate.r >= 80; }).length]].map(function (f) { return '<button type="button" class="opt' + (crFilter === f[0] ? ' on' : '') + '" data-crf="' + f[0] + '">' + f[1] + ' <i>' + f[2] + '</i></button>'; }).join('') + '</div>' : '') +
          '<div class="crs">' + seen.map(function (c) { return tileHTML(t.id, c); }).join('') + '</div>' +
          '<div class="btn-row" style="margin-top:10px">' + (got ? '<button type="button" class="btn navy sq" data-post="' + esc(t.id) + '">' + (reelMime() ? 'Crear vídeo' : 'Crear postal') + '</button>' : '') +
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
      '<div class="hv-btns">' + (c.got ? '<button type="button" class="btn ghost sq" data-cv="toggle">Quitar del álbum</button>' : '') +
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

  /* ---------- Postal: collage de los cromos conseguidos, con sello y matasellos ---------- */
  var postBlob = null, postName = '';
  function loadImg(src) {
    return new Promise(function (res) {
      if (!src) return res(null);
      var im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = function () { res(im); }; im.onerror = function () { res(null); };   // sin permiso CORS: se deja el hueco
      var abs = /^data:/.test(src) ? src : new URL(src, location.href).href;
      (window.Mapa ? Mapa.corsUrl(abs).catch(function () { return abs; }) : Promise.resolve(abs)).then(function (u) { im.src = u; });
    });
  }
  function makePostcard(id) {
    var t = (TRIPS || []).filter(function (x) { return x.id === id; })[0]; if (!t) return;
    var cs = cromosOf(t, albumGet()), got = cs.filter(function (c) { return c.got; });
    var pick = got.filter(function (c) { return c.img || c.ph; }).sort(function (a, b) { return (b.must ? 1 : 0) - (a.must ? 1 : 0) || b.links - a.links; }).slice(0, 6);
    var Wd = 1500, Ht = 1000, cv = document.createElement('canvas'); cv.width = Wd; cv.height = Ht;
    var g = cv.getContext('2d'), serif = '"New York","Iowan Old Style",Georgia,serif', sans = '-apple-system,"Segoe UI",Roboto,sans-serif';
    Promise.all(pick.map(function (c) { return loadImg(phUrl(c)); })).then(function (imgs) {
      // papel
      g.fillStyle = '#f7f3ec'; g.fillRect(0, 0, Wd, Ht);
      g.strokeStyle = '#e2782f'; g.lineWidth = 10; g.strokeRect(22, 22, Wd - 44, Ht - 44);
      // fotos, como cromos pegados
      var slots = imgs.length <= 3 ? [[70, 260], [390, 250], [710, 270]] : [[70, 80], [390, 70], [710, 90], [80, 430], [400, 420], [720, 440]];
      imgs.forEach(function (im, n) {
        var s = slots[n], w = 290, h = 300, rot = [-.05, .03, -.02, .04, -.035, .02][n];
        g.save(); g.translate(s[0] + w / 2, s[1] + h / 2); g.rotate(rot);
        g.shadowColor = 'rgba(0,0,0,.28)'; g.shadowBlur = 18; g.shadowOffsetY = 8;
        g.fillStyle = '#fff'; g.fillRect(-w / 2 - 12, -h / 2 - 12, w + 24, h + 60); g.shadowColor = 'transparent';
        if (im) { var r = Math.max(w / im.width, h / im.height), iw = im.width * r, ih = im.height * r; g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip(); g.drawImage(im, -iw / 2, -ih / 2, iw, ih); g.restore(); }
        else { g.fillStyle = '#e8e1d4'; g.fillRect(-w / 2, -h / 2, w, h); }
        g.fillStyle = '#3b3e46'; g.font = '600 20px ' + sans; g.textAlign = 'center';
        g.fillText(fit(g, pick[n].ti, w), 0, h / 2 + 34); g.restore();
      });
      // línea central de postal
      g.strokeStyle = '#cfc6b6'; g.lineWidth = 2; g.beginPath(); g.moveTo(1060, 90); g.lineTo(1060, Ht - 90); g.stroke();
      // texto
      var title = tripTitle(t), dest = (t.b.meta.dest || {})[lg()] || (t.b.meta.dest || {}).es || '';
      g.textAlign = 'left'; g.fillStyle = '#e2782f'; g.font = 'italic 34px ' + serif; g.fillText(tr('Recuerdos de'), 1095, 330);
      g.fillStyle = '#1c1d21'; g.font = '700 52px ' + serif; wrap(g, title, 1095, 392, 360, 58);
      g.fillStyle = '#5a5d66'; g.font = '500 24px ' + sans;
      var lines = got.slice(0, 7).map(function (c) { return '✓ ' + c.ti; });
      lines.forEach(function (l, n) { g.fillText(fit(g, l, 360), 1095, 540 + n * 40); });
      g.strokeStyle = '#d9d1c2'; g.lineWidth = 1.5; for (var y = 552; y < 840; y += 40) { g.beginPath(); g.moveTo(1095, y); g.lineTo(1450, y); g.stroke(); }
      g.fillStyle = '#8b9099'; g.font = '600 20px ' + sans; g.fillText(lg() === 'en' ? got.length + ' of ' + cs.length + ' cards · Travel guide' : got.length + ' de ' + cs.length + ' cromos · Guía de viaje', 1095, 900);
      // sello
      g.save(); g.translate(1300, 80); g.fillStyle = '#fff'; g.fillRect(0, 0, 140, 170);
      g.strokeStyle = '#e2782f'; g.setLineDash([6, 6]); g.lineWidth = 4; g.strokeRect(8, 8, 124, 154); g.setLineDash([]);
      g.fillStyle = '#e2782f'; g.font = '900 54px ' + sans; g.textAlign = 'center'; g.fillText(String(got.length), 70, 92);
      g.font = '800 15px ' + sans; g.fillText(fit(g, dest.toUpperCase(), 116), 70, 128); g.fillText(lg() === 'en' ? 'CARDS' : 'CROMOS', 70, 150); g.restore();
      // matasellos
      g.save(); g.translate(1200, 175); g.rotate(-.2); g.strokeStyle = 'rgba(59,62,70,.55)'; g.lineWidth = 3;
      g.beginPath(); g.arc(0, 0, 62, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(0, 0, 48, 0, Math.PI * 2); g.stroke();
      g.fillStyle = 'rgba(59,62,70,.6)'; g.font = '800 15px ' + sans; g.textAlign = 'center'; g.fillText(shortDate(today()).toUpperCase(), 0, 6);
      for (var w2 = 0; w2 < 4; w2++) { g.beginPath(); g.moveTo(70, -24 + w2 * 16); g.bezierCurveTo(110, -36 + w2 * 16, 140, -12 + w2 * 16, 190, -24 + w2 * 16); g.stroke(); }
      g.restore();
      cv.toBlob(function (bl) {
        postBlob = bl; postName = 'postal-' + id + '.jpg';
        var box = $('#postBox'); if (!box) return;
        var v0 = $('#postVid'); if (v0) v0.hidden = true; $('#postImg').hidden = false;
        $('#postImg').src = URL.createObjectURL(bl); box.hidden = false; box.scrollIntoView({ behavior: 'smooth' });
      }, 'image/jpeg', 0.9);
    });
  }
  /* ---------- Vídeo del viaje: en vertical, con tus sitios uno a uno; sin grabador, la postal de siempre ---------- */
  function reelMime() {
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) return '';
    return ['video/mp4', 'video/webm;codecs=vp9', 'video/webm'].filter(function (m) { return MediaRecorder.isTypeSupported(m); })[0] || '';
  }
  // vídeo del viaje (720×1280): portada con la ruta dibujándose, cada cromo canjeado entra girando con su borde
  // de rareza mientras la ruta avanza hasta ese sitio, y al final las cifras. Sin MediaRecorder: la postal de siempre
  var REEL_M = { base: ['#c9c3b6', '#f5f2eb', '#dcd7cb', '#ffffff'], copper: ['#6e3a18', '#e9a877', '#a65f30', '#ffd7b0'], silver: ['#7f8893', '#f7f9fb', '#aeb6c0', '#ffffff'], gold: ['#8a620c', '#ffe896', '#c9972a', '#fff6c8'], emerald: ['#0a553a', '#6ff0bb', '#129a69', '#d2ffe9'], ruby: ['#6e0a20', '#ff7a92', '#c5163c', '#ffd3dc'] };
  function makeReel(id, btn) {
    var t = (TRIPS || []).filter(function (x) { return x.id === id; })[0]; if (!t) return;
    var mime = reelMime(); if (!mime) { makePostcard(id); return; }
    var cs = cromosOf(t, albumGet()), got = cs.filter(function (c) { return c.got; });
    // hasta 8, por orden del viaje; si hay más, los imprescindibles y los de más rareza
    var pick = got.filter(function (c) { return c.img || c.ph; }).sort(function (a, b) { return (b.must ? 1 : 0) - (a.must ? 1 : 0) || ((b.rate || {}).r || 0) - ((a.rate || {}).r || 0); }).slice(0, 8).sort(function (a, b) { return a.n - b.n; });
    if (btn) { btn.disabled = true; btn.textContent = 'Creando vídeo…'; }
    function restore() { if (btn) { btn.disabled = false; btn.textContent = 'Crear vídeo'; } }
    // la ruta: todas las paradas del viaje, en orden
    var route = [];
    t.b.trip.days.forEach(function (d) { d.items.forEach(function (it) { if (it.lat != null && (!window.Mapa || Mapa.isSight(it))) route.push({ id: it.id, lat: it.lat, lon: it.lon }); }); });
    // km: los de los trayectos en coche si el viaje los tiene; si no, en línea recta entre paradas
    var km = 0, dkm = 0; t.b.trip.days.forEach(function (d) { d.items.forEach(function (it) { if (it.t === 'drive' && it.km) dkm += it.km; }); });
    route.forEach(function (p, i) { if (!i) return; var q = route[i - 1], R = 6371, dl = (p.lat - q.lat) * Math.PI / 180, dn = (p.lon - q.lon) * Math.PI / 180, a = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(q.lat * Math.PI / 180) * Math.cos(p.lat * Math.PI / 180) * Math.sin(dn / 2) * Math.sin(dn / 2); km += 2 * R * Math.asin(Math.sqrt(a)); });
    if (dkm) km = dkm;
    Promise.all(pick.map(function (c) { return loadImg(phUrl(c)); })).then(function (imgs) {
      var W0 = 720, H0 = 1280, cv = document.createElement('canvas'), g = cv.getContext('2d'), serif = '"New York","Iowan Old Style",Georgia,serif', sans = '-apple-system,"Segoe UI",Roboto,sans-serif';
      cv.width = W0; cv.height = H0; cv.style.cssText = 'position:fixed;left:-9999px;top:0;width:10px;height:18px'; document.body.appendChild(cv);
      var shots = pick.map(function (c, i) { return { c: c, im: imgs[i] }; }).filter(function (x) { return x.im; });
      // fondo desenfocado de cada foto: se reduce y se vuelve a ampliar (Safari no tiene filtros en canvas)
      shots.forEach(function (x) { var b = document.createElement('canvas'), r = 28 / Math.max(x.im.width, x.im.height); b.width = Math.max(4, Math.round(x.im.width * r)); b.height = Math.max(4, Math.round(x.im.height * r)); b.getContext('2d').drawImage(x.im, 0, 0, b.width, b.height); x.blur = b; });
      // posición de cada cromo en la ruta
      shots.forEach(function (x) { var k = -1; route.some(function (p, i) { if (p.id === x.c.id) { k = i; return true; } return false; }); x.at = k; });
      var bx = [60, 150, 600, 330], b0 = { s: 90, n: -90, w: 180, e: -180 };
      route.forEach(function (p) { b0.s = Math.min(b0.s, p.lat); b0.n = Math.max(b0.n, p.lat); b0.w = Math.min(b0.w, p.lon); b0.e = Math.max(b0.e, p.lon); });
      var kx = Math.cos((b0.s + b0.n) / 2 * Math.PI / 180), sw = (b0.e - b0.w) * kx || 1e-6, shh = (b0.n - b0.s) || 1e-6, sc0 = Math.min(bx[2] / sw, bx[3] / shh);
      var pts = route.map(function (p) { return { x: bx[0] + bx[2] / 2 + ((p.lon - b0.w) * kx - sw / 2) * sc0, y: bx[1] + bx[3] / 2 - ((p.lat - b0.s) - shh / 2) * sc0 }; });
      var INTRO = 3.2, SHOT = 2.7, OUTRO = 4.6, total = INTRO + shots.length * SHOT + OUTRO, title = tripTitle(t), en = lg() === 'en';
      var st = t.b.trip.defaultStart, nd = t.b.trip.days.length, dates = '';
      if (st) { var d1 = new Date(st + 'T12:00:00Z'), d2 = new Date(d1.getTime() + (nd - 1) * 864e5), fo = { day: 'numeric', month: 'short', timeZone: 'UTC' }; dates = d1.toLocaleDateString(lg(), fo) + ' – ' + d2.toLocaleDateString(lg(), fo) + ' ' + d2.getUTCFullYear(); }
      function cl(x) { return Math.max(0, Math.min(1, x)); }
      function ease(x) { x = cl(x); return x * x * (3 - 2 * x); }
      function back(x) { x = cl(x); var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }   // se pasa un poco y vuelve
      function cover(im, z, dx, dy) { var r = Math.max(W0 / im.width, H0 / im.height) * z, w = im.width * r, h = im.height * r; g.drawImage(im, (W0 - w) / 2 + (dx || 0), (H0 - h) / 2 + (dy || 0), w, h); }
      function shade(a) { var s = g.createLinearGradient(0, 0, 0, H0); s.addColorStop(0, 'rgba(10,10,14,' + (0.55 * a) + ')'); s.addColorStop(0.45, 'rgba(10,10,14,' + (0.25 * a) + ')'); s.addColorStop(1, 'rgba(10,10,14,' + (0.85 * a) + ')'); g.fillStyle = s; g.fillRect(0, 0, W0, H0); }
      function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
      // la ruta hasta la posición p (índice con decimales): gris lo que falta, blanco lo hecho, bolita donde vas
      function drawRoute(p, alpha) {
        if (pts.length < 2) return;
        g.save(); g.globalAlpha = alpha; g.lineCap = g.lineJoin = 'round';
        g.beginPath(); pts.forEach(function (q, i) { if (i) g.lineTo(q.x, q.y); else g.moveTo(q.x, q.y); }); g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 3; g.setLineDash([2, 8]); g.stroke(); g.setLineDash([]);
        var n = Math.floor(p), f = p - n, end = pts[Math.min(n, pts.length - 1)];
        g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
        for (var i = 1; i <= Math.min(n, pts.length - 1); i++) g.lineTo(pts[i].x, pts[i].y);
        if (n + 1 < pts.length && f > 0) { end = { x: pts[n].x + (pts[n + 1].x - pts[n].x) * f, y: pts[n].y + (pts[n + 1].y - pts[n].y) * f }; g.lineTo(end.x, end.y); }
        g.strokeStyle = '#fff'; g.lineWidth = 4; g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 8; g.stroke(); g.shadowBlur = 0;
        shots.forEach(function (x) { if (x.at < 0 || x.at > p + 0.01) return; var q = pts[x.at]; g.beginPath(); g.arc(q.x, q.y, 6.5, 0, 7); g.fillStyle = REEL_M[(x.c.rate || {}).tier || 'base'][2]; g.fill(); g.lineWidth = 2.5; g.strokeStyle = '#fff'; g.stroke(); });
        g.beginPath(); g.arc(end.x, end.y, 11, 0, 7); g.fillStyle = '#14161b'; g.fill(); g.lineWidth = 3.5; g.strokeStyle = '#fff'; g.stroke();
        g.restore();
      }
      // un cromo: borde de metal según su rareza, foto, nombre y clase; e = 0..1 entrada, gl = brillo que lo cruza
      function drawCard(x, cx, cy, sc, rot, flip, gl) {
        var w = 440, h = 600, tier = (x.c.rate || {}).tier || 'base', M = REEL_M[tier];
        g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(sc * flip, sc);
        g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 50; g.shadowOffsetY = 26;
        var mg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); M.concat(M[0]).forEach(function (c, i, a) { mg.addColorStop(i / (a.length - 1), c); });
        rr(-w / 2, -h / 2, w, h, 30); g.fillStyle = mg; g.fill(); g.shadowColor = 'transparent';
        rr(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 20); g.save(); g.clip();
        var im = x.im, r = Math.max((w - 28) / im.width, (h - 28) / im.height), iw = im.width * r, ih = im.height * r; g.drawImage(im, -iw / 2, -ih / 2, iw, ih);
        var sh = g.createLinearGradient(0, 40, 0, h / 2); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.82)'); g.fillStyle = sh; g.fillRect(-w / 2, 0, w, h / 2);
        if (gl > 0 && gl < 1 && tier !== 'base') { var gx = -w + gl * w * 2, gg = g.createLinearGradient(gx - 90, 0, gx + 90, 0); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(0.5, 'rgba(255,255,255,.42)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gg; g.fillRect(-w / 2, -h / 2, w, h); }
        g.restore();
        g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = '700 38px ' + serif;
        var words = String(x.c.ti).split(' '), lines = [''], k;
        words.forEach(function (wd) { k = lines.length - 1; var test = lines[k] ? lines[k] + ' ' + wd : wd; if (g.measureText(test).width > w - 70 && lines[k]) lines.push(wd); else lines[k] = test; });
        lines = lines.slice(-2); lines.forEach(function (ln, i) { g.fillText(fit(g, ln, w - 60), 0, h / 2 - 78 - (lines.length - 1 - i) * 42); });
        g.font = '800 17px ' + sans; g.fillStyle = M[3] === '#ffffff' && tier === 'base' ? 'rgba(255,255,255,.8)' : M[3];
        g.fillText(((x.c.rate || {}).type ? tr(x.c.rate.type) + ' · ' : '') + (window.Juego ? tr(Juego.TIER[tier]) : ''), 0, h / 2 - 40);
        g.restore();
      }
      function frame(sec) {
        g.globalAlpha = 1; g.textAlign = 'center'; g.fillStyle = '#121318'; g.fillRect(0, 0, W0, H0);
        if (sec < INTRO) {
          var f = sec / INTRO;
          if (shots[0]) { g.globalAlpha = ease(sec / 0.8); cover(shots[0].im, 1.18 - f * 0.1, 0, 0); g.globalAlpha = 1; }
          shade(1);
          drawRoute(ease((sec - 0.7) / 2.2) * (pts.length - 1), ease((sec - 0.5) / 0.5));
          var a = ease((sec - 0.2) / 0.7); g.globalAlpha = a; g.fillStyle = '#fff'; g.font = 'italic 700 70px ' + serif; wrap(g, title, W0 / 2, 860 + (1 - a) * 30, 620, 78);
          g.globalAlpha = ease((sec - 0.6) / 0.7); g.font = '750 26px ' + sans; g.fillStyle = 'rgba(255,255,255,.82)'; g.fillText(dates.toUpperCase(), W0 / 2, 1040);
          g.globalAlpha = 1 - ease((sec - INTRO + 0.35) / 0.35); if (g.globalAlpha < 1) { g.globalAlpha = 1 - g.globalAlpha; g.fillStyle = '#121318'; g.fillRect(0, 0, W0, H0); }
          return;
        }
        var s0 = sec - INTRO, i = Math.floor(s0 / SHOT);
        if (i < shots.length) {
          var x = shots[i], u = (s0 - i * SHOT) / SHOT, ts = s0 - i * SHOT;
          g.imageSmoothingQuality = 'high'; cover(x.blur, 1.1 + u * 0.06, 0, 0); shade(0.9);
          // la ruta avanza desde el cromo anterior hasta este
          var from = i ? Math.max(0, shots[i - 1].at) : 0, to = Math.max(0, x.at);
          drawRoute(from + (to - from) * ease(ts / 0.9), 1);
          g.fillStyle = '#ffc48f'; g.font = '800 24px ' + sans; g.globalAlpha = ease(ts / 0.4);
          g.fillText((tr('Día') + ' ' + x.c.day + ' · ' + (i + 1) + '/' + shots.length).toUpperCase(), W0 / 2, 400);
          g.globalAlpha = 1;
          // entra girando sobre sí mismo y se asienta con un pequeño rebote; al final sale hacia arriba
          var e = back(ts / 0.75), out = ease((ts - SHOT + 0.35) / 0.35), flip = Math.cos((1 - cl(ts / 0.55)) * Math.PI / 2);
          drawCard(x, W0 / 2, 790 - out * 140 + (1 - e) * 220, (0.6 + 0.4 * e) * (1 - out * 0.15), (1 - e) * -0.22 + (i % 2 ? 0.035 : -0.035) * e, Math.max(0.04, flip), (ts - 0.7) / 0.8);
          if (out > 0) { g.globalAlpha = out; g.fillStyle = '#121318'; g.fillRect(0, 0, W0, H0); g.globalAlpha = 1; }
          return;
        }
        // final: las cifras suben y los cromos en abanico
        var o = sec - INTRO - shots.length * SHOT, e2 = ease(o / 0.6);
        if (shots[0]) { g.globalAlpha = 0.5 * e2; cover(shots[shots.length - 1].blur, 1.15, 0, 0); g.globalAlpha = 1; shade(1); }
        drawRoute(pts.length - 1, e2 * 0.75);
        var gold = got.filter(function (c) { return c.rate && c.rate.r >= 80; }).length;
        var nums = [[nd, en ? (nd === 1 ? 'day' : 'days') : (nd === 1 ? 'día' : 'días')], [Math.round(km), 'km'], [got.length, en ? 'cards' : 'cromos'], [gold, en ? 'gold or better' : 'oro o más']];
        nums.forEach(function (nm, k) {
          var a = ease((o - 0.3 - k * 0.18) / 0.5), X = 210 + (k % 2) * 300, Y = 590 + Math.floor(k / 2) * 140;
          g.globalAlpha = a; g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = '700 74px ' + serif; g.fillText(String(Math.round(nm[0] * ease((o - 0.3 - k * 0.18) / 1.1))), X, Y + (1 - a) * 20);
          g.font = '750 22px ' + sans; g.fillStyle = 'rgba(255,255,255,.7)'; g.fillText(nm[1].toUpperCase(), X, Y + 38);
        });
        var fan = shots.slice(-5), fa = ease((o - 1.2) / 0.7);
        fan.forEach(function (x, k) { var m = k - (fan.length - 1) / 2; drawCard(x, W0 / 2 + m * 92 * fa, 1000 + Math.abs(m) * 12 * fa + (1 - fa) * 300, 0.33, m * 0.12 * fa, 1, 0); });
        g.globalAlpha = ease((o - 1.8) / 0.6); g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = 'italic 700 46px ' + serif; g.fillText(fit(g, title, 640), W0 / 2, 1205);
        g.font = '650 20px ' + sans; g.fillStyle = 'rgba(255,255,255,.55)'; g.fillText(tr('Guía de viaje'), W0 / 2, 1245);
        g.globalAlpha = 1;
      }
      try { frame(0); var stream = cv.captureStream(30); } catch (e) { cv.remove(); restore(); makePostcard(id); return; }
      var parts = [], rc = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4000000 });
      rc.ondataavailable = function (e) { if (e.data && e.data.size) parts.push(e.data); };
      rc.onstop = function () {
        cv.remove(); restore();
        postBlob = new Blob(parts, { type: mime.split(';')[0] }); postName = 'viaje-' + id + (/mp4/.test(mime) ? '.mp4' : '.webm');
        var box = $('#postBox'); if (!box) return;
        var img = $('#postImg'), vid = $('#postVid'); if (img) img.hidden = true;
        if (!vid) { vid = document.createElement('video'); vid.id = 'postVid'; vid.controls = true; vid.loop = true; vid.muted = true; vid.setAttribute('playsinline', ''); img.parentNode.insertBefore(vid, img); }
        vid.hidden = false; vid.src = URL.createObjectURL(postBlob); box.hidden = false; box.scrollIntoView({ behavior: 'smooth' }); vid.play().catch(function () {});
      };
      rc.start(500);
      var t0 = performance.now(), tick = setInterval(function () {
        var sec = (performance.now() - t0) / 1000; frame(Math.min(sec, total));
        if (sec >= total) { clearInterval(tick); rc.stop(); }
      }, 33);
    });
  }
  function fit(g, txt, max) { txt = String(txt); while (txt.length > 3 && g.measureText(txt).width > max) txt = txt.slice(0, -2) + '…'; return txt.replace(/……$/, '…'); }
  function wrap(g, txt, x, y, max, lh) {
    var words = String(txt).split(' '), line = '', n = 0;
    words.forEach(function (w) { var test = line ? line + ' ' + w : w; if (g.measureText(test).width > max && line) { g.fillText(line, x, y + n * lh); n++; line = w; } else line = test; });
    if (line) g.fillText(line, x, y + n * lh);
  }
  function postSave() {
    if (!postBlob) return; var f = null; try { f = new File([postBlob], postName, { type: postBlob.type || 'image/jpeg' }); } catch (e) {}
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: postName }).catch(function () {}); return; }
    var a = document.createElement('a'); a.href = URL.createObjectURL(postBlob); a.download = postName; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 2000);
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
        '<div class="pf-h">Insignias · ' + O.badgesOn + ' de ' + O.badgesMax + '</div><div class="card"><div class="badges">' + B.map(badgeHTML).join('') + '</div><div class="bdi" id="bdgInfo" hidden></div></div>';
      box._badges = B;
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
      if (po) { allCards().then(function (cards) { Juego.openPack(po.getAttribute('data-pkopen'), po.getAttribute('data-pktrip') || '', cards, function () { renderAlbum(); }); }); return; }
      if (t.closest('[data-pkex]')) { Juego.exchange(); renderAlbum(); return; }
      if (c) openCromo(c.getAttribute('data-cr'));
      else if (pb) makeReel(pb.getAttribute('data-post'), pb);
      else if (t.closest('#postSave')) postSave();
      else if (t.closest('#postClose')) $('#postBox').hidden = true;
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

  return { init: init, renderAlbum: renderAlbum, renderProfile: renderProfile, overview: overview, reset: function () { TRIPS = null; }, get: albumGet, isCromo: isCromo, cromosOf: cromosOf, trips: trips, listBox: listBox, searchText: searchText, allCards: allCards };
})();
