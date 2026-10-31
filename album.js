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
  function trips() { return TRIPS ? Promise.resolve(TRIPS) : cfg.trips().then(function (t) { TRIPS = t || []; return TRIPS; }); }
  function tripTitle(t) { return (t.b.meta.title || {}).es || t.id; }
  // cromos de un viaje: sus sitios, por días; ★ = imprescindible (o, si el viaje no marca ninguno, el 20 % más famoso)
  function cromosOf(t, alb) {
    var b = t.b, ph = b.photos || {}, list = [];
    b.trip.days.forEach(function (d, k) { d.items.forEach(function (it) { if (isCromo(it)) list.push({ id: it.id, ti: it.ti, day: k + 1, ph: it.ph || '', img: it.ph ? ph[it.ph] || '' : '', must: !!it.must, links: (it.src || {}).links || 0 }); }); });
    if (!list.some(function (c) { return c.must; })) {
      var cut = list.map(function (c) { return c.links; }).sort(function (x, y) { return y - x; })[Math.max(0, Math.ceil(list.length * 0.2) - 1)] || 1e9;
      list.forEach(function (c) { c.must = c.links > 0 && c.links >= cut; });
    }
    list.forEach(function (c, n) { c.n = n + 1; c.got = alb[t.id + '|' + c.id] || null; });
    return list;
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

  function renderAlbum() {
    var box = $('#albumBox'); if (!box) return Promise.resolve();
    if (!TRIPS) box.innerHTML = '<p class="note">Cargando…</p>';
    return trips().then(function (list) {
      var alb = albumGet();
      box.innerHTML = list.filter(function (t) { return cromosOf(t, alb).length; }).map(function (t) {
        var cs = cromosOf(t, alb), got = cs.filter(function (c) { return c.got; }).length;
        return '<div class="alb" data-trip="' + esc(t.id) + '"><div class="alb-h"><b>' + esc(tripTitle(t)) + '</b><small>' + got + ' de ' + cs.length + '</small></div>' +
          '<div class="alb-bar"><i style="width:' + (cs.length ? Math.round(got / cs.length * 100) : 0) + '%"></i></div>' +
          '<div class="crs">' + cs.map(function (c) {
            return '<button type="button" class="cr' + (c.got ? ' got' : '') + (c.must ? ' must' : '') + phCls(c) + '" data-cr="' + esc(t.id + '|' + c.id) + '"' + phStyle(c) + '>' +
              (c.got ? '<i class="sheen"></i>' : '') + '<i class="no">#' + c.n + '</i>' + (c.must ? '<i class="cst">★</i>' : '') + (c.got ? '<i class="stamp">Visto · ' + esc(shortDate(c.got.at)) + '</i>' : '') + '<span>' + esc(c.ti) + '</span></button>';
          }).join('') + '</div>' +
          '<div class="btn-row" style="margin-top:10px">' + (got ? '<button type="button" class="btn navy sq" data-post="' + esc(t.id) + '">Crear postal</button>' : '') +
          (cfg.single ? '' : '<button type="button" class="btn ghost sq" data-open="' + esc(t.id) + '">Abrir guía</button>') + '</div></div>';
      }).join('') || '<p class="note">Aún no hay viajes.</p>';
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
    var c = f.c, cls = (c.must ? ' gold' : '') + (c.got ? '' : ' miss');
    cv3.key = key; cv3.rx = 0; cv3.ry = 0;
    $('#crView').innerHTML =
      '<div class="hv-wrap"><div class="hv-halo' + (c.got ? (c.must ? ' gold' : '') : ' miss') + '"></div>' +
        '<div class="holo' + cls + '">' +
          '<div class="hf"><div class="hp' + phCls(c) + '"' + phStyle(c) + '></div><div class="foil"></div><div class="glit"></div>' +
            (c.must ? '<span class="star">★ Imprescindible</span>' : '') +
            (c.got ? '<span class="stamp2">Visto · ' + esc(shortDate(c.got.at)) + '</span>' : '<span class="lock">Aún no lo tienes</span>') +
            '<div class="cap"><b>' + esc(c.ti) + '</b><i>#' + c.n + '</i></div><div class="glare"></div></div>' +
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
      else alb[k] = { at: today(), ti: f.c.ti };
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
      im.src = /^data:/.test(src) ? src : new URL(src, location.href).href;
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
      var title = tripTitle(t), dest = (t.b.meta.dest || {}).es || '';
      g.textAlign = 'left'; g.fillStyle = '#e2782f'; g.font = 'italic 34px ' + serif; g.fillText('Recuerdos de', 1095, 330);
      g.fillStyle = '#1c1d21'; g.font = '700 52px ' + serif; wrap(g, title, 1095, 392, 360, 58);
      g.fillStyle = '#5a5d66'; g.font = '500 24px ' + sans;
      var lines = got.slice(0, 7).map(function (c) { return '✓ ' + c.ti; });
      lines.forEach(function (l, n) { g.fillText(fit(g, l, 360), 1095, 540 + n * 40); });
      g.strokeStyle = '#d9d1c2'; g.lineWidth = 1.5; for (var y = 552; y < 840; y += 40) { g.beginPath(); g.moveTo(1095, y); g.lineTo(1450, y); g.stroke(); }
      g.fillStyle = '#8b9099'; g.font = '600 20px ' + sans; g.fillText(got.length + ' de ' + cs.length + ' cromos · Guía de viaje', 1095, 900);
      // sello
      g.save(); g.translate(1300, 80); g.fillStyle = '#fff'; g.fillRect(0, 0, 140, 170);
      g.strokeStyle = '#e2782f'; g.setLineDash([6, 6]); g.lineWidth = 4; g.strokeRect(8, 8, 124, 154); g.setLineDash([]);
      g.fillStyle = '#e2782f'; g.font = '900 54px ' + sans; g.textAlign = 'center'; g.fillText(String(got.length), 70, 92);
      g.font = '800 15px ' + sans; g.fillText(fit(g, dest.toUpperCase(), 116), 70, 128); g.fillText('CROMOS', 70, 150); g.restore();
      // matasellos
      g.save(); g.translate(1200, 175); g.rotate(-.2); g.strokeStyle = 'rgba(59,62,70,.55)'; g.lineWidth = 3;
      g.beginPath(); g.arc(0, 0, 62, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(0, 0, 48, 0, Math.PI * 2); g.stroke();
      g.fillStyle = 'rgba(59,62,70,.6)'; g.font = '800 15px ' + sans; g.textAlign = 'center'; g.fillText(shortDate(today()).toUpperCase(), 0, 6);
      for (var w2 = 0; w2 < 4; w2++) { g.beginPath(); g.moveTo(70, -24 + w2 * 16); g.bezierCurveTo(110, -36 + w2 * 16, 140, -12 + w2 * 16, 190, -24 + w2 * 16); g.stroke(); }
      g.restore();
      cv.toBlob(function (bl) {
        postBlob = bl; postName = 'postal-' + id + '.jpg';
        var box = $('#postBox'); if (!box) return;
        $('#postImg').src = URL.createObjectURL(bl); box.hidden = false; box.scrollIntoView({ behavior: 'smooth' });
      }, 'image/jpeg', 0.9);
    });
  }
  function fit(g, txt, max) { txt = String(txt); while (txt.length > 3 && g.measureText(txt).width > max) txt = txt.slice(0, -2) + '…'; return txt.replace(/……$/, '…'); }
  function wrap(g, txt, x, y, max, lh) {
    var words = String(txt).split(' '), line = '', n = 0;
    words.forEach(function (w) { var test = line ? line + ' ' + w : w; if (g.measureText(test).width > max && line) { g.fillText(line, x, y + n * lh); n++; line = w; } else line = test; });
    if (line) g.fillText(line, x, y + n * lh);
  }
  function postSave() {
    if (!postBlob) return; var f = null; try { f = new File([postBlob], postName, { type: 'image/jpeg' }); } catch (e) {}
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
      box.innerHTML = '<div class="pstats">' +
        [[O.trips.length, O.trips.length === 1 ? 'viaje' : 'viajes'], [O.totalDays, 'días de viaje'], [O.got + ' / ' + O.all, 'cromos'], [O.mustGot + ' / ' + O.must, 'imprescindibles']].map(function (s) {
          return '<div class="card stat2"><b>' + s[0] + '</b><small>' + s[1] + '</small></div>';
        }).join('') + '</div>' +
        '<div class="pf-h">Mis viajes</div>' + (O.trips.length ? O.trips.slice().sort(function (a, b) { return String(b.start).localeCompare(String(a.start)); }).map(function (t) {
          return '<div class="card pf-trip">' + (t.cover ? '<div class="pf-ph" style="background-image:url(&quot;' + esc(t.cover) + '&quot;)"></div>' : '<div class="pf-ph"></div>') +
            '<div class="pf-m"><span class="pf-st ' + t.status + '">' + S[t.status] + '</span><b>' + esc(t.title) + '</b><small>' + esc(shortRange(t)) + ' · ' + t.days + (t.days === 1 ? ' día' : ' días') + '</small>' +
            '<div class="alb-bar"><i style="width:' + (t.total ? Math.round(t.got / t.total * 100) : 0) + '%"></i></div><small>' + t.got + ' de ' + t.total + ' cromos · ' + t.mustGot + ' de ' + t.must + ' imprescindibles</small>' +
            (cfg.single ? '' : '<div class="btn-row"><button type="button" class="btn ghost sq" data-open="' + esc(t.id) + '">Abrir guía</button></div>') + '</div></div>';
        }).join('') : '<p class="note">Aún no hay viajes.</p>') +
        '<div class="pf-h">Insignias · ' + O.badgesOn + ' de ' + B.length + '</div><div class="card"><div class="badges">' +
        B.map(function (b) { return '<div class="bdg' + (b[2] ? '' : ' off') + '"><i>' + b[0] + '</i>' + esc(b[1]) + '</div>'; }).join('') + '</div></div>';
    });
  }
  function albImport(f) {
    var r = new FileReader(); r.onload = function () {
      var o = null; try { o = JSON.parse(r.result); } catch (e) {}
      if (!o || o.app !== 'guia-album' || !o.album) { alert('Ese archivo no es una copia del álbum.'); return; }
      var a = albumGet(); Object.keys(o.album).forEach(function (k) { if (!a[k]) a[k] = o.album[k]; });   // se suman, no se pisan
      albumSet(a); if (cfg.onChange) cfg.onChange(''); renderAlbum(); renderProfile(); alert('Álbum cargado.');
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
      var c = t.closest('[data-cr]'), pb = t.closest('[data-post]');
      if (c) openCromo(c.getAttribute('data-cr'));
      else if (pb) makePostcard(pb.getAttribute('data-post'));
      else if (t.closest('#postSave')) postSave();
      else if (t.closest('#postClose')) $('#postBox').hidden = true;
      else if (t.closest('#albExp')) download({ app: 'guia-album', at: new Date().toISOString(), album: albumGet() }, 'album-' + today() + '.json');
    });
    document.addEventListener('change', function (e) {
      if (e.target.id !== 'albImp') return;
      var f = e.target.files[0]; e.target.value = ''; if (f) albImport(f);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('#crView.on')) closeCromo(); });
  }

  return { init: init, renderAlbum: renderAlbum, renderProfile: renderProfile, overview: overview, reset: function () { TRIPS = null; }, get: albumGet, isCromo: isCromo, cromosOf: cromosOf };
})();
