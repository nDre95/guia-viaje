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
  function trips() { var ph = window.Juego ? Juego.ready() : Promise.resolve(); return ph.then(function () { return TRIPS || cfg.trips().then(function (t) { TRIPS = t || []; return TRIPS; }); }); }
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
    list.forEach(function (c, n) { c.n = n + 1; c.key = t.id + '|' + c.id; c.got = alb[c.key] || null; c.own = own[c.key] || null; if (window.Juego) c.rate = Juego.rate(c.raw.must || !c.must ? c.raw : Object.assign({}, c.raw, { must: 1 })); });
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
    var g = Juego.get(), kinds = ['i', 'g', 'n'].filter(function (k) { return g.packs[k] > 0; }), d = Juego.dups(g);
    var head = '<div class="pk-row">' + (kinds.length ? kinds.map(function (k) {
      return '<button type="button" class="pk-mini k-' + k + ' sq" data-pkopen="' + k + '"><span class="pk-foil"></span><b>' + g.packs[k] + '</b><small>' + esc(Juego.PACK[k]) + '</small></button>';
    }).join('') : '<p class="pk-none">Hoy no te quedan sobres. Mañana hay otro, y también se ganan con el quiz, los retos y visitando sitios.</p>') +
      (d >= 5 ? '<button type="button" class="pk-ex sq" data-pkex>Cambiar 5 repetidas por un sobre</button>' : '') + '</div>';
    // colecciones
    var sets = SETS.map(function (S) {
      var all = cards.filter(function (c) { return S[2].indexOf(c.rate.pos) >= 0; }), have = all.filter(function (c) { return c.own || c.got; }).length;
      if (all.length && have === all.length) Juego.reward('set:' + S[0], 'g', 'Colección completa');
      return all.length ? { n: S[1], have: have, all: all.length } : null;
    }).filter(Boolean);
    var tops = cards.filter(function (c) { return c.rate.r >= 80; });
    if (tops.length) sets.push({ n: 'Oro y superiores', have: tops.filter(function (c) { return c.own || c.got; }).length, all: tops.length });
    return head + (sets.length ? '<div class="pf-h">Colecciones</div><div class="set-row">' + sets.map(function (x) {
      return '<div class="card set-c"><b>' + esc(x.n) + '</b><small>' + x.have + ' de ' + x.all + '</small><span class="alb-bar"><i style="width:' + Math.round(x.have / x.all * 100) + '%"></i></span></div>';
    }).join('') + '</div><div class="pf-h">Mis viajes</div>' : '');
  }
  function paintPacks(on) {
    var box = $('#albumBox'); if (!box || !window.Juego) return Promise.resolve();
    var el = $('#packBox');
    if (!el) { el = document.createElement('div'); el.id = 'packBox'; box.parentNode.insertBefore(el, box); }
    if (!on) { el.innerHTML = ''; return Promise.resolve(); }
    Juego.claimDaily();
    return allCards().then(function (cards) {
      // un sobre de oro de regalo por cada viaje, una sola vez
      (TRIPS || []).forEach(function (t) { Juego.reward('trip:' + t.id, 'g', tripTitle(t)); });
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
          (cs.length > 8 ? '<div class="lst-chips">' + [['all', 'Todos', cs.length], ['got', 'Pegados', got], ['miss', 'Faltan', cs.length - got], ['top', 'Oro o más', cs.filter(function (c) { return c.rate && (c.rate.r >= 80); }).length]].map(function (f) { return '<button type="button" class="opt' + (crFilter === f[0] ? ' on' : '') + '" data-crf="' + f[0] + '">' + f[1] + ' <i>' + f[2] + '</i></button>'; }).join('') + '</div>' : '') +
          '<div class="crs">' + seen.map(function (c) {
            var R = c.rate || { r: '', pos: '', tier: 'copper' };
            return '<button type="button" class="cr fc t-' + R.tier + (c.got ? ' got' : '') + (c.own ? ' own' : '') + phCls(c) + '" data-cr="' + esc(t.id + '|' + c.id) + '"' + phStyle(c) + '>' +
              '<i class="fc-b"></i>' + (c.got ? '<i class="sheen"></i>' : '') + '<i class="fc-r">' + R.r + '</i><i class="fc-p">' + R.pos + '</i>' + (c.own && c.own.n > 1 ? '<i class="fc-x">×' + c.own.n + '</i>' : '') + (c.got ? '<i class="fc-v">' + (c.got.gps ? '✓ GPS' : '✓') + '</i>' : '') + '<span>' + esc(c.ti) + '</span></button>';
          }).join('') + '</div>' +
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
    var c = f.c, R = c.rate || { r: '', pos: '', tier: 'copper', st: [] }, have = c.got || c.own, top = R.r >= 80, cls = ' fc t-' + R.tier + (have ? '' : ' miss');
    cv3.key = key; cv3.rx = 0; cv3.ry = 0;
    $('#crView').innerHTML =
      '<div class="hv-wrap"><div class="hv-halo' + (have ? (top ? ' gold' : '') : ' miss') + '"></div>' +
        '<div class="holo' + cls + '">' +
          '<div class="hf"><div class="hp' + phCls(c) + '"' + phStyle(c) + '></div><div class="foil"></div><div class="glit"></div>' +
            '<span class="fc-frame"></span><span class="fc-glit"></span><span class="fc-top"><b>' + R.r + '</b><i>' + R.pos + '</i></span>' +
            (c.got ? '<span class="fc-seen">' + (c.got.gps ? '✓ GPS · ' : '✓ ') + esc(shortDate(c.got.at)) + '</span>' : have ? '' : '<span class="lock">Aún no la tienes</span>') +
            '<div class="cap"><b>' + esc(c.ti) + '</b><i>' + esc(window.Juego ? Juego.TIER[R.tier] : '') + '</i></div><div class="fc-st">' + (R.st || []).map(function (x) { return '<i><b>' + x[1] + '</b>' + x[0] + '</i>'; }).join('') + '</div><div class="glare"></div></div>' +
          '<div class="hb"><span class="seal">' + (c.got ? 'Visto<br>' + esc(shortDate(c.got.at)) : 'Por<br>pegar') + '</span><b>' + esc(tripTitle(f.t)) + '</b><small>Cromo #' + c.n + ' de ' + f.total + ' · Día ' + c.day + '</small></div>' +
        '</div></div>' +
      '<p class="hv-hint">Arrastra para girarlo · dale la vuelta para ver el reverso</p>' +
      '<div class="hv-btns"><button type="button" class="btn go sq" data-cv="toggle">' + (c.got ? 'Quitar del álbum' : 'Pegar cromo') + '</button>' +
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
      else { alb[k] = { at: today(), ti: f.c.ti }; if (window.Juego) Juego.onVisit(f.t.id, cromosOf(f.t, alb), alb, false); }
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
  function makeReel(id, btn) {
    var t = (TRIPS || []).filter(function (x) { return x.id === id; })[0]; if (!t) return;
    var mime = reelMime(); if (!mime) { makePostcard(id); return; }
    var cs = cromosOf(t, albumGet()), got = cs.filter(function (c) { return c.got; }), pick = got.filter(function (c) { return c.img || c.ph; }).sort(function (a, b) { return (b.rate ? b.rate.r : 0) - (a.rate ? a.rate.r : 0); }).slice(0, 7);
    if (btn) { btn.disabled = true; btn.textContent = 'Creando vídeo…'; }
    function restore() { if (btn) { btn.disabled = false; btn.textContent = 'Crear vídeo'; } }
    Promise.all(pick.map(function (c) { return loadImg(phUrl(c)); })).then(function (imgs) {
      var W0 = 720, H0 = 1280, cv = document.createElement('canvas'), g = cv.getContext('2d'), serif = '"New York","Iowan Old Style",Georgia,serif', sans = '-apple-system,"Segoe UI",Roboto,sans-serif';
      cv.width = W0; cv.height = H0; cv.style.cssText = 'position:fixed;left:-9999px;top:0;width:10px;height:18px'; document.body.appendChild(cv);
      var shots = pick.map(function (c, i) { return { c: c, im: imgs[i] }; }).filter(function (x) { return x.im; }), INTRO = 1.6, SHOT = 2.1, OUTRO = 2.8, total = INTRO + shots.length * SHOT + OUTRO, title = tripTitle(t), stream;
      function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
      function bg() { var b = g.createLinearGradient(0, 0, W0, H0); b.addColorStop(0, '#2b2d36'); b.addColorStop(1, '#14151a'); g.fillStyle = b; g.fillRect(0, 0, W0, H0); }
      function cover(im, z, dx) { var r = Math.max(W0 / im.width, H0 / im.height) * z, w = im.width * r, h = im.height * r; g.drawImage(im, (W0 - w) / 2 + dx, (H0 - h) / 2, w, h); }
      function frame(sec) {
        g.globalAlpha = 1; g.textAlign = 'center'; bg();
        if (sec < INTRO) {
          var a = ease(sec / 0.6); g.globalAlpha = a; g.fillStyle = '#ffc48f'; g.font = '800 26px ' + sans; g.fillText(tr('Recuerdos de').toUpperCase(), W0 / 2, 560 + (1 - a) * 24);
          g.fillStyle = '#fff'; g.font = 'italic 700 66px ' + serif; wrap(g, title, W0 / 2, 640 + (1 - a) * 24, 620, 74); return;
        }
        var s0 = sec - INTRO, i = Math.floor(s0 / SHOT);
        if (i < shots.length) {
          var f = (s0 - i * SHOT) / SHOT, x = shots[i], R = x.c.rate;
          cover(x.im, 1.05 + f * 0.12, (i % 2 ? 1 : -1) * f * 26);
          var sh = g.createLinearGradient(0, H0 * 0.55, 0, H0); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.82)'); g.fillStyle = sh; g.fillRect(0, 0, W0, H0);
          var t0 = ease(f / 0.22), o = ease((1 - f) / 0.1); g.globalAlpha = t0 * o; g.textAlign = 'left';
          g.fillStyle = '#ffc48f'; g.font = '800 25px ' + sans; g.fillText((tr('Día') + ' ' + x.c.day).toUpperCase(), 50, H0 - 180 + (1 - t0) * 22);
          g.fillStyle = '#fff'; g.font = '700 52px ' + serif; wrap(g, x.c.ti, 50, H0 - 122 + (1 - t0) * 22, 620, 58);
          if (R) { g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(50, 70, 96, 96); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '800 46px ' + serif; g.fillText(String(R.r), 98, 128); g.font = '800 17px ' + sans; g.fillText(R.pos, 98, 154); }
          g.globalAlpha = 1 - ease(f / 0.12); bg(); g.globalAlpha = 1; return;
        }
        var e = ease((s0 - shots.length * SHOT) / 0.6), col = 3, sz = 190; g.globalAlpha = e;
        shots.slice(0, 6).forEach(function (x, k) { var X = 60 + (k % col) * (sz + 15), Y = 300 + Math.floor(k / col) * (sz + 15); g.save(); g.beginPath(); g.rect(X, Y, sz, sz); g.clip(); var r = Math.max(sz / x.im.width, sz / x.im.height), w = x.im.width * r, h = x.im.height * r; g.drawImage(x.im, X + (sz - w) / 2, Y + (sz - h) / 2, w, h); g.restore(); });
        g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = 'italic 700 58px ' + serif; g.fillText(title.length > 22 ? title.slice(0, 21) + '…' : title, W0 / 2, 800);
        g.fillStyle = '#ffc48f'; g.font = '700 31px ' + sans; g.fillText(lg() === 'en' ? got.length + ' of ' + cs.length + ' cards' : got.length + ' de ' + cs.length + ' cromos', W0 / 2, 860);
        g.fillStyle = 'rgba(255,255,255,.6)'; g.font = '600 24px ' + sans; g.fillText(tr('Guía de viaje'), W0 / 2, 1190);
      }
      try { frame(0); stream = cv.captureStream(30); } catch (e) { cv.remove(); restore(); makePostcard(id); return; }
      var parts = [], rc = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 3500000 });
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

  /* ---------- Perfil: mis viajes, cifras e insignias ---------- */
  function overview() {
    return trips().then(function (list) {
      var alb = albumGet(), all = 0, got = 0, must = 0, mustGot = 0, castles = 0, full = 0, mustFull = 0, withCromo = 0, days = 0, dests = {}, gen = 0, out = [], recent = [];
      var now = today();
      list.forEach(function (t) {
        var cs = cromosOf(t, alb), g0 = cs.filter(function (c) { return c.got; }), m = cs.filter(function (c) { return c.must; }), bt = t.b.trip, ph = t.b.photos || {};
        all += cs.length; got += g0.length; must += m.length; mustGot += m.filter(function (c) { return c.got; }).length;
        castles += g0.filter(function (c) { return /castillo|castle|palacio|palace|alcázar|château/i.test(c.ti); }).length;
        if (cs.length && g0.length === cs.length) full++;
        if (m.length && m.every(function (c) { return c.got; })) mustFull++;
        if (g0.length) withCromo++;
        days += bt.days.length; dests[(t.b.meta.dest || {}).es || t.id] = 1; if (t.b.meta.generated) gen++;
        g0.forEach(function (c) { recent.push({ img: c.img, ph: c.ph, ti: c.ti, at: c.got.at }); });
        var start = bt.defaultStart, end = start ? new Date(new Date(start + 'T12:00:00Z').getTime() + (bt.days.length - 1) * 864e5).toISOString().slice(0, 10) : '';
        // el motor antiguo no decía qué es cada foto: en la web todas las fotos son direcciones
        out.push({ id: t.id, title: tripTitle(t), start: start, end: end, days: bt.days.length, cover: ph[bt.cover] || '', got: g0.length, total: cs.length, mustGot: m.filter(function (c) { return c.got; }).length, must: m.length,
          status: !start ? 'next' : now > end ? 'past' : now >= start ? 'now' : 'next', top: m.slice(0, 3).map(function (c) { return c.ti; }), ref: t });
      });
      recent.sort(function (a, b) { return String(b.at).localeCompare(String(a.at)); });
      var B = [['🌟', 'Primer cromo', got >= 1], ['📸', '10 cromos', got >= 10], ['🏆', '50 cromos', got >= 50], ['🏰', '5 castillos', castles >= 5],
        ['⭐', 'Todos los imprescindibles de un viaje', mustFull >= 1], ['📖', 'Álbum completo', full >= 1], ['🧳', 'Cromos en 2 viajes', withCromo >= 2], ['🧭', 'Primer viaje creado', gen >= 1], ['🌍', '3 destinos', Object.keys(dests).length >= 3]];
      return { trips: out, all: all, got: got, must: must, mustGot: mustGot, totalDays: days, badges: B, badgesOn: B.filter(function (b) { return b[2]; }).length, nextBadge: B.filter(function (b) { return !b[2]; })[0] || null, recent: recent };
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
        '<div class="pf-h">Insignias · ' + O.badgesOn + ' de ' + B.length + '</div><div class="card"><div class="badges">' +
        B.map(function (b) { return '<div class="bdg' + (b[2] ? '' : ' off') + '"><i>' + b[0] + '</i>' + esc(b[1]) + '</div>'; }).join('') + '</div></div>';
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
      if (o.game && window.Juego) { var g1 = Juego.get(), g2 = o.game; ['n', 'g', 'i'].forEach(function (k) { g1.packs[k] = Math.max(g1.packs[k], (g2.packs || {})[k] || 0); }); Object.keys(g2.own || {}).forEach(function (k) { if (!g1.own[k]) g1.own[k] = g2.own[k]; }); Object.keys(g2.claimed || {}).forEach(function (k) { g1.claimed[k] = 1; }); Juego.save(g1); }
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
      var po = t.closest('[data-pkopen]');
      if (po) { allCards().then(function (cards) { Juego.openPack(po.getAttribute('data-pkopen'), cards, function () { renderAlbum(); }); }); return; }
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
