/* ===== Personajes animados (window.Pj): monigotes en SVG que acompañan al asistente y a la bienvenida =====
   Cada personaje se monta por piezas (piernas, cuerpo, brazos y cabeza giran por separado) con su ropa y objetos.
   Pj.play(tipo, { target }) lo hace caer desde arriba, hacer su gesto, ponerse su prenda, andar hasta la opción
   elegida, que se abre como una compuerta, y meterse dentro. Pj.figure(tipo) da uno quieto que repite su gesto. */
window.Pj = (function () {
  'use strict';
  var NS = 'guia-pj', layer = null, cur = null;
  function en() { return window.Lang && Lang.get() === 'en'; }
  function off() { try { return localStorage.getItem(NS) === 'off'; } catch (e) { return false; } }
  function reduced() { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- Vestuario ---------- */
  var SKIN = ['#f3cdae', '#e2b08a', '#c68b62', '#8d5a3b'], HAIR = ['#3a2a22', '#6b4226', '#c98a3c', '#1f1d1c', '#a33d22'];
  // ropa: top, pantalón, zapatos, extra (gorro, bufanda…). Colores vivos pero no chillones
  var KINDS = {
    nieve:   { top: '#e2782f', bot: '#3b4a6b', shoe: '#5a3b2a', hat: 'beanie', hatC: '#2f8f5b', coat: 1, mitt: '#2f8f5b', gear: 'scarf', gearC: '#c8323c', idle: 'shiver', fx: 'snow', say: ['¡Brrr, qué frío!', 'Brrr, it’s cold!'] },
    playa:   { top: 'swim', bot: '#2b8fc9', shoe: 'flip', hat: 'sunhat', hatC: '#f2c14e', ring: '#e8574a', gear: 'shades', idle: 'fan', fx: 'sun', say: ['¡Uf, qué calor!', 'Phew, so hot!'] },
    lluvia:  { top: '#f2c14e', bot: '#3b4a6b', shoe: '#2f8f5b', hat: 'hood', hatC: '#f2c14e', coat: 1, gear: 'umbrella', gearC: '#c8323c', idle: 'shake', fx: 'rain', say: ['¡Llueve!', 'It’s raining!'] },
    monte:   { top: '#2f8f5b', bot: '#6b5a44', shoe: '#5a3b2a', hat: 'sunhat', hatC: '#b9a27a', pack: '#e2782f', stick: 1, gear: 'pack', idle: 'look', fx: 'birds', say: ['¡Qué vistas!', 'What a view!'] },
    ciudad:  { top: '#6b7fb3', bot: '#e9e2d3', shoe: '#e8574a', hat: 'cap', hatC: '#e2782f', cam: 1, gear: 'map', gearC: '#f7f3ec', idle: 'photo', fx: '', say: ['¡Foto!', 'Say cheese!'] },
    pie:     { top: '#e8574a', bot: '#3b4a6b', shoe: '#f7f3ec', hat: '', pack: '#2f8f5b', gear: 'map', gearC: '#f7f3ec', idle: 'wave', fx: '', say: ['¡A andar!', 'Let’s walk!'] },
    corre:   { top: '#2b8fc9', bot: '#1f2126', shoe: '#f2c14e', hat: 'band', hatC: '#e8574a', idle: 'run', gear: '', fx: 'speed', say: ['¡A tope!', 'Full speed!'] },
    relax:   { top: '#f2c14e', bot: '#e9e2d3', shoe: 'flip', hat: '', drink: 1, gear: 'shades', idle: 'sip', fx: '', say: ['Sin prisa…', 'No rush…'] },
    madruga: { top: '#f29a52', bot: '#3b4a6b', shoe: '#f7f3ec', hat: '', idle: 'stretch', gear: '', fx: 'sunrise', say: ['¡Buenos días!', 'Good morning!'] },
    siesta:  { top: '#8f7fc4', bot: '#8f7fc4', shoe: '#e9e2d3', hat: 'night', hatC: '#6b5fb0', pillow: 1, idle: 'yawn', gear: '', fx: 'zzz', say: ['Cinco minutitos más…', 'Five more minutes…'] },
    arte:    { top: '#1f2126', bot: '#3b3e46', shoe: '#1f2126', hat: 'beret', hatC: '#c8323c', palette: 1, idle: 'paint', gear: '', fx: 'paint', say: ['¡Qué arte!', 'Such art!'] },
    chef:    { top: '#f7f3ec', bot: '#3b3e46', shoe: '#1f2126', hat: 'chef', hatC: '#ffffff', pan: 1, idle: 'flip', gear: '', fx: '', say: ['¡Qué rico!', 'Yummy!'] },
    compras: { top: '#d0558a', bot: '#3b4a6b', shoe: '#f7f3ec', hat: '', bags: 1, idle: 'swing', gear: 'shades', fx: '', say: ['¡De tiendas!', 'Shopping!'] },
    globo:   { top: '#2f8f5b', bot: '#f2c14e', shoe: '#e8574a', hat: 'cap', hatC: '#2b8fc9', balloon: '#e8574a', kid: 1, idle: 'hop', gear: '', fx: '', say: ['¡Bieeen!', 'Yay!'] },
    maleta:  { top: '#6b7fb3', bot: '#3b3e46', shoe: '#5a3b2a', hat: '', case: '#e2782f', idle: 'wave', gear: '', fx: '', say: ['¡Nos vamos!', 'Off we go!'] },
    fiesta:  { top: '#e2782f', bot: '#3b4a6b', shoe: '#f7f3ec', hat: 'party', hatC: '#6b7fb3', idle: 'jump', gear: '', fx: 'confetti', say: ['¡Viaje listo!', 'Trip ready!'] },
    safari:  { vehicle: 'savanna', idle: 'safari', fx: 'sun', say: ['¡Mira, una jirafa!', 'Look, a giraffe!'] },
    isla:    { vehicle: 'isle', idle: 'lounge', fx: 'sun', say: ['¡Esto es vida!', 'This is the life!'] },
    avion:   { vehicle: 'plane', body: '#f7f3ec', say: ['¡Despegamos!', 'Take off!'] },
    coche:   { vehicle: 'car', body: '#e2782f', say: ['¡Pi, pi!', 'Beep beep!'] },
    bus:     { vehicle: 'tram', body: '#c8323c', say: ['¡Próxima parada!', 'Next stop!'] }
  };

  /* ---------- Dibujo (viewBox 100 × 170; el suelo en y = 162) ---------- */
  function hat(k, c) {
    if (k === 'beanie') return '<path d="M30 38 Q31 17 50 16 Q69 17 70 38 Z" fill="' + c + '"/><rect x="29" y="33" width="42" height="8" rx="4" fill="' + shade(c, -18) + '"/><circle cx="50" cy="14" r="6" fill="#f7f3ec"/>';
    if (k === 'sunhat') return '<ellipse cx="50" cy="30" rx="30" ry="6" fill="' + shade(c, -12) + '"/><path d="M35 30 Q36 15 50 15 Q64 15 65 30 Z" fill="' + c + '"/><rect x="35" y="26" width="30" height="4" fill="#e8574a" opacity=".85"/>';
    if (k === 'cap') return '<path d="M31 33 Q32 18 50 18 Q68 18 69 33 Z" fill="' + c + '"/><path d="M50 31 Q72 29 80 34 Q66 37 50 35 Z" fill="' + shade(c, -20) + '"/>';
    if (k === 'hood') return '<path d="M27 44 Q26 16 50 15 Q74 16 73 44 Q70 30 50 28 Q30 30 27 44 Z" fill="' + c + '"/>';
    if (k === 'band') return '<rect x="30" y="29" width="40" height="7" rx="3" fill="' + c + '"/><path d="M30 32 L22 38 L25 30 Z" fill="' + c + '"/>';
    if (k === 'beret') return '<ellipse cx="46" cy="25" rx="20" ry="8" fill="' + c + '" transform="rotate(-12 46 25)"/><rect x="45" y="15" width="3" height="5" rx="1.5" fill="' + c + '"/>';
    if (k === 'chef') return '<rect x="36" y="18" width="28" height="12" fill="' + c + '" stroke="#ddd" stroke-width=".8"/><circle cx="40" cy="15" r="8" fill="' + c + '"/><circle cx="50" cy="11" r="9" fill="' + c + '"/><circle cx="60" cy="15" r="8" fill="' + c + '"/>';
    if (k === 'night') return '<path d="M32 34 Q34 14 54 16 Q70 20 82 40 L76 44 Q68 28 66 34 Z" fill="' + c + '"/><circle cx="80" cy="44" r="4.5" fill="#f7f3ec"/>';
    if (k === 'party') return '<path d="M38 26 L50 0 L62 26 Z" fill="' + c + '"/><path d="M41 19 L59 19 M44 12 L56 12" stroke="#f2c14e" stroke-width="2.5"/><circle cx="50" cy="0" r="3.5" fill="#f2c14e"/>';
    return '';
  }
  // aclara u oscurece un color #rrggbb
  function shade(h, p) {
    var n = parseInt(h.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255, f = function (v) { return Math.max(0, Math.min(255, Math.round(v + p * 2.55))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function person(K, id, look) {
    var skin = look ? look.skin : pick(SKIN), hair = look ? look.hair : pick(HAIR), swim = K.top === 'swim', top = swim ? skin : K.top, legC = swim ? skin : K.bot, kid = K.kid;
    var g = 'url(#pjSh' + id + ')', s = '';
    s += '<defs><linearGradient id="pjSh' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>' +
      '<radialGradient id="pjHd' + id + '" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></radialGradient></defs>';
    s += '<g class="pj-all"' + (kid ? ' transform="translate(10 34) scale(.8)"' : '') + '>';
    if (K.balloon) s += '<g class="pj-balloon"><path d="M73 104 Q80 70 76 34" stroke="#555" stroke-width="1" fill="none"/><ellipse cx="76" cy="22" rx="13" ry="15" fill="' + K.balloon + '"/><ellipse cx="71" cy="16" rx="3.5" ry="5" fill="#fff" opacity=".45"/><path d="M74 37 L78 37 L76 34 Z" fill="' + K.balloon + '"/></g>';
    if (K.pack) s += '<rect x="25" y="66" width="50" height="46" rx="9" fill="' + K.pack + '"/><rect x="25" y="66" width="50" height="46" rx="9" fill="' + g + '"/>';
    if (K.stick) s += '<line x1="78" y1="98" x2="86" y2="162" stroke="#7a5a3a" stroke-width="3" stroke-linecap="round"/>';
    if (K.case) s += '<g class="pj-case"><line x1="72" y1="106" x2="78" y2="124" stroke="#555" stroke-width="2.5"/><rect x="70" y="122" width="24" height="34" rx="5" fill="' + K.case + '"/><rect x="70" y="122" width="24" height="34" rx="5" fill="' + g + '"/><line x1="76" y1="128" x2="76" y2="150" stroke="#000" stroke-opacity=".2" stroke-width="2"/><line x1="88" y1="128" x2="88" y2="150" stroke="#000" stroke-opacity=".2" stroke-width="2"/><circle cx="74" cy="158" r="3" fill="#333"/><circle cx="90" cy="158" r="3" fill="#333"/></g>';
    // piernas
    var shoe = function (cx) { return K.shoe === 'flip' ? '<rect x="' + (cx - 7) + '" y="155" width="14" height="4" rx="2" fill="#2b8fc9"/>' : '<ellipse cx="' + cx + '" cy="155" rx="8" ry="5" fill="' + K.shoe + '"/>'; };
    s += '<g class="pj-legL"><rect x="38" y="108" width="11" height="46" rx="5" fill="' + legC + '"/><rect x="38" y="108" width="11" height="46" rx="5" fill="' + g + '"/>' + shoe(43) + '</g>';
    s += '<g class="pj-legR"><rect x="51" y="108" width="11" height="46" rx="5" fill="' + legC + '"/><rect x="51" y="108" width="11" height="46" rx="5" fill="' + g + '"/>' + shoe(57) + '</g>';
    // cuerpo
    var torso = 'M31 74 Q31 64 40 63 L60 63 Q69 64 69 74 L71 116 Q50 122 29 116 Z';
    s += '<g class="pj-body"><path d="' + torso + '" fill="' + top + '"/>';
    if (swim) s += '<path d="M29 104 L71 104 L71 116 Q50 122 29 116 Z" fill="' + K.bot + '"/><path d="M29 104 L71 104" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/>';
    else s += '<path d="M29 112 Q50 118 71 112 L71 116 Q50 122 29 116 Z" fill="' + shade(top, -15) + '"/>';
    if (K.coat) s += '<path d="M31 80 Q50 84 69 80 M30 92 Q50 96 70 92 M30 104 Q50 108 70 104" stroke="' + shade(top, -16) + '" stroke-width="1.6" fill="none"/><line x1="50" y1="64" x2="50" y2="118" stroke="' + shade(top, -22) + '" stroke-width="1.4"/>';
    else if (!swim) s += '<path d="M42 63 Q50 72 58 63" fill="' + shade(top, -14) + '"/>';
    if (K.hat === 'chef') s += '<circle cx="50" cy="80" r="1.6" fill="#999"/><circle cx="50" cy="90" r="1.6" fill="#999"/><circle cx="50" cy="100" r="1.6" fill="#999"/>';
    s += '<path d="' + torso + '" fill="' + g + '"/>';
    if (K.ring) s += '<g class="pj-ring"><ellipse cx="50" cy="110" rx="29" ry="9" fill="none" stroke="' + K.ring + '" stroke-width="8"/><ellipse cx="50" cy="110" rx="29" ry="9" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="10 12"/></g>';
    if (K.cam) s += '<g class="pj-cam"><path d="M38 64 L46 86 M62 64 L54 86" stroke="#1f2126" stroke-width="1.5"/><rect x="41" y="84" width="18" height="12" rx="2.5" fill="#1f2126"/><circle cx="50" cy="90" r="4" fill="#5b6170" stroke="#9aa" stroke-width="1"/></g>';
    s += '</g>';
    // brazos (el izquierdo y el derecho giran desde el hombro)
    var hand = K.mitt || skin, slv = swim ? skin : top;
    s += '<g class="pj-armL"><rect x="24" y="67" width="10" height="38" rx="5" fill="' + slv + '"/><rect x="24" y="67" width="10" height="38" rx="5" fill="' + g + '"/><circle cx="29" cy="107" r="5.5" fill="' + hand + '"/>' +
      (K.palette ? '<g class="pj-pal"><ellipse cx="24" cy="110" rx="12" ry="8" fill="#e9d3a7"/><circle cx="18" cy="108" r="2.2" fill="#e8574a"/><circle cx="23" cy="105" r="2.2" fill="#2b8fc9"/><circle cx="29" cy="107" r="2.2" fill="#f2c14e"/><circle cx="24" cy="113" r="2.2" fill="#2f8f5b"/></g>' : '') +
      (K.pillow ? '<rect x="10" y="96" width="26" height="17" rx="7" fill="#f7f3ec" stroke="#ddd"/>' : '') +
      (K.bags ? '<g class="pj-bagL"><path d="M25 106 Q29 98 33 106" stroke="#333" stroke-width="1.5" fill="none"/><rect x="20" y="106" width="18" height="20" rx="2" fill="#f2c14e"/></g>' : '') +
      (K.gear === 'map' ? '<g class="pj-map"><rect x="17" y="100" width="24" height="17" rx="1" fill="' + (K.gearC || '#fff') + '" stroke="#bbb"/><path d="M23 100 L23 117 M29 100 L29 117 M35 100 L35 117" stroke="#ccc"/><path d="M19 112 Q26 104 38 106" stroke="#e2782f" stroke-width="1.4" fill="none" stroke-dasharray="2 2"/></g>' : '') + '</g>';
    s += '<g class="pj-armR"><rect x="66" y="67" width="10" height="38" rx="5" fill="' + slv + '"/><rect x="66" y="67" width="10" height="38" rx="5" fill="' + g + '"/><circle cx="71" cy="107" r="5.5" fill="' + hand + '"/>' +
      (K.drink ? '<g><path d="M66 94 L76 94 L74 104 L68 104 Z" fill="#f2c14e" opacity=".85" stroke="#fff"/><line x1="71" y1="104" x2="71" y2="112" stroke="#fff" stroke-width="1.5"/></g>' : '') +
      (K.pan ? '<g class="pj-pan"><rect x="72" y="104" width="16" height="4" rx="2" fill="#333"/><ellipse cx="96" cy="106" rx="11" ry="4" fill="#333"/><ellipse class="pj-cake" cx="96" cy="103" rx="8" ry="3" fill="#e0a92c"/></g>' : '') +
      (K.palette ? '<g class="pj-brush"><line x1="71" y1="108" x2="80" y2="92" stroke="#7a5a3a" stroke-width="2.5"/><circle cx="80.5" cy="91" r="2.5" fill="#e8574a"/></g>' : '') +
      (K.bags ? '<g class="pj-bagR"><path d="M67 106 Q71 98 75 106" stroke="#333" stroke-width="1.5" fill="none"/><rect x="62" y="106" width="18" height="22" rx="2" fill="#2b8fc9"/></g>' : '') +
      (K.gear === 'umbrella' ? '<g class="pj-umb"><line x1="71" y1="110" x2="71" y2="34" stroke="#333" stroke-width="2"/><path class="pj-can" d="M41 40 Q71 0 101 40 Q93 34 86 40 Q78 34 71 40 Q64 34 56 40 Q49 34 41 40 Z" fill="' + K.gearC + '"/></g>' : '') + '</g>';
    // cuello y cabeza
    s += '<rect x="45" y="55" width="10" height="10" fill="' + skin + '"/>';
    s += '<g class="pj-head"><circle cx="50" cy="40" r="19" fill="' + skin + '"/><circle cx="50" cy="40" r="19" fill="url(#pjHd' + id + ')"/>';
    if (K.hat !== 'beanie' && K.hat !== 'hood' && K.hat !== 'chef' && K.hat !== 'night') s += '<path d="M31 38 Q31 20 50 20 Q69 20 69 38 Q64 28 50 28 Q38 28 31 38 Z" fill="' + hair + '"/>';
    s += '<g class="pj-eyes"><ellipse cx="43" cy="42" rx="2.1" ry="2.7" fill="#2a2a2e"/><ellipse cx="57" cy="42" rx="2.1" ry="2.7" fill="#2a2a2e"/></g>' +
      '<circle cx="38" cy="48" r="3.2" fill="#e8574a" opacity=".25"/><circle cx="62" cy="48" r="3.2" fill="#e8574a" opacity=".25"/>' +
      '<path class="pj-mouth" d="M45 50 Q50 54 55 50" stroke="#2a2a2e" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse class="pj-yawn" cx="50" cy="51" rx="3.5" ry="4.5" fill="#6b2a2a" opacity="0"/>';
    s += hat(K.hat, K.hatC || '#333');
    if (K.gear === 'shades') s += '<g class="pj-shades"><rect x="36" y="37" width="12" height="8" rx="3" fill="#1f2126"/><rect x="52" y="37" width="12" height="8" rx="3" fill="#1f2126"/><line x1="48" y1="40" x2="52" y2="40" stroke="#1f2126" stroke-width="1.6"/><rect x="38" y="38.5" width="4" height="2" rx="1" fill="#fff" opacity=".4"/></g>';
    s += '</g>';
    if (K.gear === 'scarf') s += '<g class="pj-scarf"><path d="M38 61 Q50 70 62 61" stroke="' + K.gearC + '" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="53" y="63" width="8" height="22" rx="3" fill="' + K.gearC + '" transform="rotate(-8 57 63)"/><path d="M54 80 L61 79" stroke="#fff" stroke-width="1.6" opacity=".6"/></g>';
    s += '</g>';
    return '<svg class="pj-fig" viewBox="0 0 100 170" width="96" height="163" aria-hidden="true">' + s + '</svg>';
  }
  // la islita: arena, palmera y alguien tumbado en la toalla con su bebida
  function isle() {
    var sk = pick(SKIN), hr = pick(HAIR), tw = pick(['#e8574a', '#2b8fc9', '#f2c14e', '#8f7fc4']), tr = pick(['#2b8fc9', '#e2782f', '#2f8f5b']);
    return '<svg class="pj-fig" viewBox="0 0 210 140" width="177" height="118" aria-hidden="true"><defs>' +
      '<linearGradient id="pjSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd8f2"/><stop offset="1" stop-color="#2b8fc9"/></linearGradient>' +
      '<radialGradient id="pjSand" cx=".4" cy=".25" r=".85"><stop offset="0" stop-color="#fcebbd"/><stop offset="1" stop-color="#e5bd6c"/></radialGradient></defs><g class="pj-all">' +
      '<ellipse cx="105" cy="124" rx="103" ry="15" fill="url(#pjSea)"/>' +
      '<g class="pj-waves"><path d="M8 126 q8 -4 16 0 t16 0 t16 0 M150 128 q8 -4 16 0 t16 0 t16 0 M40 133 q8 -3 16 0 t16 0 M120 134 q8 -3 16 0 t16 0" stroke="#fff" stroke-opacity=".75" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
      '<path d="M26 125 Q58 93 105 92 Q152 93 184 125 Z" fill="url(#pjSand)"/><path d="M60 108 Q80 99 100 98" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>' +
      '<g class="pj-palm"><path d="M151 116 Q158 82 141 45" stroke="#8a5a32" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M148 104 l8 -2 M151 92 l8 -1 M150 80 l8 0 M147 68 l8 1 M144 57 l7 2" stroke="#6e4524" stroke-width="2"/>' +
      '<path d="M141 45 Q118 30 96 48 Q118 39 141 47 Z" fill="#2f8f5b"/><path d="M141 45 Q128 17 104 20 Q126 27 141 47 Z" fill="#3aa36a"/><path d="M141 45 Q153 15 178 22 Q157 27 142 47 Z" fill="#2f8f5b"/>' +
      '<path d="M141 45 Q168 34 184 53 Q163 43 142 48 Z" fill="#3aa36a"/><path d="M141 45 Q148 60 137 76 Q141 59 140 47 Z" fill="#2a7d50"/><circle cx="138" cy="49" r="4" fill="#6e4524"/><circle cx="145" cy="50" r="4" fill="#5a3a1e"/></g>' +
      '<path d="M46 107 L120 102 L122 111 L48 116 Z" fill="' + tw + '"/><path d="M62 106 L64 115 M78 105 L80 114 M94 104 L96 113" stroke="#fff" stroke-width="3" opacity=".75"/>' +
      '<path d="M68 101 Q60 89 53 98" stroke="' + sk + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<rect x="64" y="97" width="31" height="11" rx="5.5" fill="' + sk + '"/><rect x="92" y="97" width="12" height="11" rx="3" fill="' + tr + '"/>' +
      '<path d="M103 104 L130 104" stroke="' + sk + '" stroke-width="8" stroke-linecap="round"/><g class="pj-foot"><ellipse cx="134" cy="101" rx="3.2" ry="5.5" fill="' + sk + '"/></g>' +
      '<path d="M101 100 L113 87 L125 100" stroke="' + sk + '" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="57" cy="100" r="8.5" fill="' + sk + '"/><path d="M49 99 Q50 90 59 91 Q54 94 51 102 Z" fill="' + hr + '"/><rect x="57" y="95.5" width="8" height="4.5" rx="1.8" fill="#1f2126"/><path d="M59 104 Q62 106 64 103" stroke="#2a2a2e" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<g class="pj-sipA"><path d="M80 99 L86 84" stroke="' + sk + '" stroke-width="5.5" stroke-linecap="round"/><path d="M81 72 L92 72 L86.5 80 Z" fill="#f29a52" stroke="#fff" stroke-width="1"/><line x1="86.5" y1="80" x2="86.5" y2="86" stroke="#fff" stroke-width="1.5"/><circle cx="91" cy="71.5" r="2.2" fill="#e8574a"/><line x1="84" y1="72" x2="80" y2="64" stroke="#2f8f5b" stroke-width="1.4"/></g>' +
      '</g></svg>';
  }
  // la sabana: acacia, jirafa comiendo, león tumbado y el jeep con el explorador y sus prismáticos
  function savanna() {
    var sk = pick(SKIN), sp = '';
    [[124, 84], [133, 90], [140, 82], [128, 92], [146, 70], [149, 58]].forEach(function (q) { sp += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="2.6" fill="#b06a24"/>'; });
    return '<svg class="pj-fig" viewBox="0 0 220 140" width="186" height="118" aria-hidden="true"><g class="pj-all">' +
      '<path d="M0 120 Q110 110 220 120 L220 140 L0 140 Z" fill="#d9b65e"/><path d="M20 121 l3 -6 l2 6 M60 117 l3 -7 l2 7 M190 118 l3 -6 l2 6 M205 121 l2 -5 l2 5" stroke="#9c8a3a" stroke-width="1.5" fill="none"/>' +
      '<path d="M190 120 Q188 92 180 76" stroke="#6e4524" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M186 92 Q196 84 204 78" stroke="#6e4524" stroke-width="3" fill="none"/>' +
      '<ellipse cx="180" cy="70" rx="34" ry="8" fill="#5f8a3a"/><ellipse cx="196" cy="64" rx="20" ry="6" fill="#6f9a45"/>' +
      // jirafa: el cuello sube y baja hacia la acacia
      '<g class="pj-gir"><path d="M120 118 L121 96 M127 118 L127 97 M139 118 L138 96 M145 118 L144 95" stroke="#e8b04a" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="132" cy="90" rx="17" ry="9" fill="#e8b04a"/><g class="pj-neck"><path d="M142 88 L156 54" stroke="#e8b04a" stroke-width="8" stroke-linecap="round"/>' +
      '<ellipse cx="160" cy="51" rx="8" ry="4.6" fill="#e8b04a" transform="rotate(-12 160 51)"/><path d="M155 47 l-1 -6 M159 46 l0 -6" stroke="#b06a24" stroke-width="2" stroke-linecap="round"/><circle cx="160" cy="49" r="1.2" fill="#222"/></g>' + sp +
      '<path d="M116 88 Q110 92 112 100" stroke="#e8b04a" stroke-width="2" fill="none"/></g>' +
      // león tumbado con su melena
      '<g class="pj-lion"><ellipse cx="34" cy="114" rx="20" ry="8" fill="#d9a441"/><path class="pj-tail" d="M53 113 Q66 108 64 100" stroke="#d9a441" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="64" cy="99" r="3" fill="#8a4a1a"/>' +
      '<circle cx="16" cy="106" r="12" fill="#a8642a"/><circle cx="15" cy="107" r="7" fill="#e2b25a"/><circle cx="12.5" cy="105.5" r="1.1" fill="#222"/><circle cx="17.5" cy="105.5" r="1.1" fill="#222"/><path d="M13.5 109.5 Q15 111 16.5 109.5" stroke="#222" stroke-width="1" fill="none"/></g>' +
      // jeep con el explorador
      '<g class="pj-jeep"><rect x="66" y="98" width="46" height="16" rx="4" fill="#6b7d3a"/><path d="M72 98 L76 86 L100 86 L104 98 Z" fill="#7f9147"/><rect x="79" y="88" width="18" height="9" rx="2" fill="#bfe0f2"/>' +
      '<circle cx="88" cy="80" r="6" fill="' + sk + '"/><ellipse cx="88" cy="75" rx="9" ry="2.5" fill="#c9b37a"/><path d="M82 75 Q88 67 94 75 Z" fill="#c9b37a"/><rect x="83" y="78" width="10" height="4" rx="1.5" fill="#2a2a2e" class="pj-bino"/>' +
      '<circle cx="76" cy="115" r="5.5" fill="#2a2a2e"/><circle cx="102" cy="115" r="5.5" fill="#2a2a2e"/><circle cx="76" cy="115" r="2" fill="#aaa"/><circle cx="102" cy="115" r="2" fill="#aaa"/><rect x="108" y="100" width="6" height="10" rx="2" fill="#555"/></g>' +
      '</g></svg>';
  }
  // avioneta con pasajeros en las ventanillas
  function plane() {
    var h = ''; [62, 82, 102].forEach(function (x) { h += '<circle cx="' + x + '" cy="40" r="6.5" fill="#bfe0f2"/><circle cx="' + x + '" cy="41" r="4.6" fill="' + pick(SKIN) + '"/><path d="M' + (x - 4.6) + ' 40 Q' + x + ' 33 ' + (x + 4.6) + ' 40" fill="' + pick(HAIR) + '"/>'; });
    return '<svg class="pj-fig" viewBox="0 0 190 90" width="170" height="80" aria-hidden="true"><g class="pj-all">' +
      '<path class="pj-trail" d="M2 44 L26 44 M8 52 L28 52" stroke="#9aa3b5" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M40 30 L26 8 L40 8 L62 30 Z" fill="#e2782f"/>' +
      '<path d="M30 30 Q30 24 44 24 L150 24 Q178 26 184 42 Q178 58 150 60 L44 60 Q30 60 30 52 Z" fill="#f7f3ec"/>' +
      '<path d="M30 46 L184 46 Q182 52 176 55 L44 55 Q32 55 30 50 Z" fill="#2b8fc9" opacity=".9"/>' + h +
      '<path d="M160 34 Q172 34 178 42 L160 42 Z" fill="#8fc4df"/>' +
      '<path d="M90 50 L118 50 L96 84 L82 84 Z" fill="#d5d0c6"/><path d="M40 48 L56 48 L44 64 L36 64 Z" fill="#d5d0c6"/>' +
      '<path d="M30 30 Q30 24 44 24 L150 24 Q178 26 184 42 Q178 58 150 60 L44 60 Q30 60 30 52 Z" fill="url(#pjPlSh)"/>' +
      '<defs><linearGradient id="pjPlSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></linearGradient></defs>' +
      '</g></svg>';
  }
  function vehicle(K) {
    if (K.vehicle === 'isle') return isle();
    if (K.vehicle === 'savanna') return savanna();
    if (K.vehicle === 'plane') return plane();
    var c = K.body, heads = function (xs, y) { return xs.map(function (x) { return '<circle cx="' + x + '" cy="' + y + '" r="8" fill="' + pick(SKIN) + '"/><path d="M' + (x - 8) + ' ' + (y - 1) + ' Q' + x + ' ' + (y - 12) + ' ' + (x + 8) + ' ' + (y - 1) + '" fill="' + pick(HAIR) + '"/><circle cx="' + (x + 3) + '" cy="' + (y + 1) + '" r="1.3" fill="#222"/>'; }).join(''); };
    if (K.vehicle === 'car') return '<svg class="pj-fig pj-car" viewBox="0 0 150 90" width="150" height="90" aria-hidden="true"><g class="pj-all">' +
      (K.lug ? '<g class="pj-lug"><path d="M38 13 L104 13" stroke="#333" stroke-width="2.5"/><rect x="42" y="-1" width="28" height="14" rx="3" fill="#e8574a"/><rect x="72" y="1" width="24" height="12" rx="3" fill="#2f8f5b"/><rect x="54" y="-12" width="22" height="12" rx="3" fill="#f2c14e"/><path d="M56 -1 L56 13 M88 1 L88 13" stroke="#000" stroke-opacity=".2" stroke-width="2"/></g>' : '') +
      '<path d="M30 32 Q38 12 70 12 Q98 12 108 32 Z" fill="' + shade(c, 10) + '"/><path d="M40 31 Q46 18 66 18 L66 31 Z M72 18 Q94 18 100 31 L72 31 Z" fill="#bfe0f2"/>' + heads([56, 86], 27) +
      '<rect x="10" y="30" width="130" height="34" rx="14" fill="' + c + '"/><rect x="10" y="30" width="130" height="34" rx="14" fill="url(#pjCarSh)"/><circle cx="133" cy="42" r="4" fill="#fff6c8"/><rect x="12" y="42" width="6" height="6" rx="2" fill="#e8574a"/>' +
      '<defs><linearGradient id="pjCarSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>' +
      '<g class="pj-wheel" style="transform-origin:42px 66px"><circle cx="42" cy="66" r="13" fill="#2a2a2e"/><circle cx="42" cy="66" r="5" fill="#bbb"/><rect x="40.5" y="55" width="3" height="22" fill="#555"/></g>' +
      '<g class="pj-wheel" style="transform-origin:110px 66px"><circle cx="110" cy="66" r="13" fill="#2a2a2e"/><circle cx="110" cy="66" r="5" fill="#bbb"/><rect x="108.5" y="55" width="3" height="22" fill="#555"/></g></g></svg>';
    return '<svg class="pj-fig pj-car" viewBox="0 0 190 100" width="180" height="95" aria-hidden="true"><g class="pj-all">' +
      '<line x1="95" y1="2" x2="80" y2="16" stroke="#333" stroke-width="2"/><rect x="8" y="16" width="174" height="62" rx="12" fill="' + c + '"/><rect x="8" y="58" width="174" height="8" fill="#f7f3ec" opacity=".85"/>' +
      '<rect x="20" y="24" width="34" height="26" rx="5" fill="#bfe0f2"/><rect x="62" y="24" width="34" height="26" rx="5" fill="#bfe0f2"/><rect x="104" y="24" width="34" height="26" rx="5" fill="#bfe0f2"/><rect x="146" y="24" width="28" height="40" rx="5" fill="#8fc4df"/>' +
      heads([37, 79, 121], 42) + '<circle cx="176" cy="70" r="3.5" fill="#fff6c8"/>' +
      '<g class="pj-wheel" style="transform-origin:42px 82px"><circle cx="42" cy="82" r="11" fill="#2a2a2e"/><circle cx="42" cy="82" r="4" fill="#bbb"/><rect x="40.5" y="72" width="3" height="20" fill="#555"/></g>' +
      '<g class="pj-wheel" style="transform-origin:148px 82px"><circle cx="148" cy="82" r="11" fill="#2a2a2e"/><circle cx="148" cy="82" r="4" fill="#bbb"/><rect x="146.5" y="72" width="3" height="20" fill="#555"/></g></g></svg>';
  }

  /* ---------- Efectos alrededor (nieve, sol, lluvia…) ---------- */
  function fx(kind, L) {
    var n = { snow: 26, rain: 34, confetti: 40 }[kind] || 0, h = '';
    for (var i = 0; i < n; i++) {
      var st = 'left:' + rnd(0, 100).toFixed(1) + '%;--t:' + rnd(kind === 'rain' ? .5 : 2.2, kind === 'rain' ? .9 : 4).toFixed(2) + 's;--dl:' + rnd(0, 1.5).toFixed(2) + 's;--s:' + rnd(.6, 1.3).toFixed(2) + ';--x:' + rnd(-40, 40).toFixed(0) + 'px';
      if (kind === 'confetti') st += ';background:' + pick(['#e2782f', '#2f8f5b', '#2b8fc9', '#f2c14e', '#e8574a', '#8f7fc4']);
      h += '<i class="pj-p ' + kind + '" style="' + st + '"></i>';
    }
    if (kind === 'sun') h = '<i class="pj-sun"></i>';
    if (kind === 'sunrise') h = '<i class="pj-sun rise"></i>';
    if (kind === 'birds') h = '<i class="pj-bird" style="top:16%;--dl:0s">︶︶</i><i class="pj-bird" style="top:22%;--dl:.5s">︶︶</i>';
    if (!h) return null;
    var e = document.createElement('div'); e.className = 'pj-fx'; e.innerHTML = h; L.appendChild(e);
    return e;
  }

  /* ---------- La escena ---------- */
  function lay() {
    if (!layer || !layer.isConnected) { layer = document.createElement('div'); layer.className = 'pj-layer'; layer.setAttribute('aria-hidden', 'true'); document.body.appendChild(layer); }
    return layer;
  }
  function wait(ms, run) { return new Promise(function (r) { run.t.push(setTimeout(r, ms)); }); }
  function anim(el, kf, o) { try { var a = el.animate(kf, o); return a.finished.catch(function () {}); } catch (e) { return Promise.resolve(); } }
  function stop() {
    if (!cur) return;
    var r = cur; cur = null; r.dead = true; r.t.forEach(clearTimeout);
    r.els.forEach(function (e) { if (e && e.parentNode) { e.style.transition = 'opacity .25s'; e.style.opacity = '0'; setTimeout(function () { e.remove(); }, 260); } });
  }
  function bubble(run, wrap, txt) {
    var b = document.createElement('span'); b.className = 'pj-say'; b.textContent = txt; wrap.appendChild(b);
    return wait(1500, run).then(function () { b.classList.add('out'); });
  }
  // una compuerta sobre la opción elegida: se levanta, deja un hueco y se cierra
  function hatch(r, color) {
    var h = document.createElement('div'); h.className = 'pj-hatch';
    h.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
    h.innerHTML = '<i class="pj-hole"></i><i class="pj-flap" style="--c:' + color + '"></i>';
    lay().insertBefore(h, lay().firstChild);
    return h;
  }
  function targetRect(t) {
    var el = typeof t === 'function' ? t() : t; if (!el || !el.getBoundingClientRect) return null;
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    if (r.width < 40 || r.bottom < 60 || r.top > vh - 120) return null;
    // solo la parte visible
    var top = Math.max(r.top, 50), bot = Math.min(r.bottom, vh - 100);
    return { left: r.left, top: top, width: r.width, height: Math.max(60, Math.min(bot - top, 220)), radius: getComputedStyle(el).borderRadius };
  }
  function ground() {
    var f = document.querySelector('#wz:not([hidden]) .wz-foot'), y = f ? f.getBoundingClientRect().top - 6 : window.innerHeight - 110;
    return Math.min(y, window.innerHeight - 30);
  }

  function play(kind, o) {
    o = o || {};
    var K = KINDS[kind]; if (!K || off() || reduced()) return;
    stop();
    var run = { t: [], els: [], dead: false }; cur = run;
    var L = lay(), W = window.innerWidth, gy = o.ground || ground(), veh = !!K.vehicle;
    var wrap = document.createElement('div'); wrap.className = 'pj pj-' + kind + (veh ? ' pj-veh' : '');
    wrap.innerHTML = (veh ? vehicle(K) : person(K, Math.random().toString(36).slice(2, 7))) + '<span class="pj-shadow"></span>';
    L.appendChild(wrap); run.els.push(wrap);
    var SZ = { car: [150, 90], tram: [180, 95], isle: [177, 118], savanna: [186, 118], plane: [170, 80] }, w = veh ? SZ[K.vehicle][0] : 96, hgt = veh ? SZ[K.vehicle][1] : 163;
    var x0 = o.x != null ? o.x : Math.round(rnd(.18, .62) * (W - w)), pos = { x: x0, y: gy - hgt };
    function at(x, y, extra) { return 'translate(' + x + 'px,' + y + 'px)' + (extra || ''); }
    var F = K.fx ? fx(K.fx, L) : null; if (F) run.els.push(F);
    var t0 = Promise.resolve();
    // 1 · entrada: cae desde arriba (o llega rodando si es un vehículo)
    if (veh) {
      wrap.classList.add('drive');
      pos.x = Math.round(W * .5 - w / 2);
      t0 = anim(wrap, [{ transform: at(-w - 20, pos.y) }, { transform: at(pos.x, pos.y) }], { duration: 1300, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' }).then(function () { wrap.classList.remove('drive'); });
    } else {
      wrap.classList.add('fall');
      t0 = anim(wrap, [{ transform: at(pos.x, -hgt - 40, ' rotate(-14deg)') }, { transform: at(pos.x, pos.y, ' rotate(0deg)'), offset: .78 }, { transform: at(pos.x, pos.y - 18) , offset: .9 }, { transform: at(pos.x, pos.y) }],
        { duration: 1000, easing: 'cubic-bezier(.45,0,.6,1)', fill: 'forwards' }).then(function () {
        wrap.classList.remove('fall'); wrap.classList.add('land');
        return wait(260, run);
      }).then(function () { wrap.classList.remove('land'); });
    }
    t0.then(function () {
      if (run.dead) return;
      // 2 · su gesto (frío, calor, foto…) con un bocadillo
      if (K.idle) wrap.classList.add('act-' + K.idle);
      if (K.say) bubble(run, wrap, en() ? K.say[1] : K.say[0]);
      return wait(K.vehicle === 'isle' || K.vehicle === 'savanna' ? 2400 : veh ? 900 : 1700, run);
    }).then(function () {
      if (run.dead) return;
      if (K.idle) wrap.classList.remove('act-' + K.idle);
      // 3 · se pone su prenda (bufanda, gafas, paraguas…)
      if (K.gear && K.gear !== 'map' && K.gear !== 'pack') { wrap.classList.add('gear'); return wait(900, run); }
    }).then(function () {
      if (run.dead) return;
      // 4 · va hasta la opción elegida, se abre la compuerta y se mete
      var r = o.target ? targetRect(o.target) : null;
      if (!r) {
        var out = pos.x > W / 2 ? W + 20 : -w - 20;
        wrap.classList.add(veh ? 'drive' : 'walk'); if (out < pos.x) wrap.classList.add('left');
        return anim(wrap, [{ transform: at(pos.x, pos.y) }, { transform: at(out, pos.y) }], { duration: 1400, easing: 'ease-in', fill: 'forwards' });
      }
      var tx = Math.round(r.left + r.width / 2 - w / 2), ty = Math.round(r.top + r.height * .62 - hgt), d = Math.hypot(tx - pos.x, ty - pos.y);
      wrap.classList.add(veh ? 'drive' : 'walk'); if (tx < pos.x) wrap.classList.add('left');
      var H = null;
      return anim(wrap, [{ transform: at(pos.x, pos.y) }, { transform: at(tx, ty) }], { duration: Math.max(700, Math.min(1600, d * 4.5)), easing: 'ease-in-out', fill: 'forwards' }).then(function () {
        if (run.dead) return;
        // al llegar, la opción se levanta como una compuerta
        wrap.classList.remove('walk', 'drive');
        H = hatch(targetRect(o.target) || r, o.color || K.gearC || K.hatC || K.body || '#e2782f'); run.els.push(H);
        return wait(260, run);
      }).then(function () {
        if (run.dead) return;
        H.classList.add('open');
        return wait(380, run);
      }).then(function () {
        if (run.dead) return;
        // salta dentro del hueco
        wrap.classList.add('dive');
        return anim(wrap, [{ transform: at(tx, ty) + ' scale(1)' }, { transform: at(tx, ty - 46) + ' scale(.9)', offset: .4 }, { transform: at(tx, ty + hgt * .35) + ' scale(.25)', opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.4,0,.7,1)', fill: 'forwards' });
      }).then(function () {
        if (run.dead) return;
        H.classList.remove('open'); H.classList.add('shut');
        try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
        return wait(520, run);
      });
    }).then(function () {
      if (run.dead) return;
      return wait(400, run);
    }).then(function () { if (cur === run) stop(); });
  }

  // un personaje quieto que repite su gesto (para la bienvenida)
  function figure(kind) {
    var K = KINDS[kind] || KINDS.maleta, e = document.createElement('div');
    e.className = 'pj pj-still pj-' + kind + (K.vehicle ? ' pj-veh drive' : '') + (K.idle && !reduced() ? ' act-' + K.idle : '') + (K.gear ? ' gear' : '');
    e.innerHTML = (K.vehicle ? vehicle(K) : person(K, Math.random().toString(36).slice(2, 7))) + '<span class="pj-shadow"></span>';
    return e;
  }

  /* ---------- El viaje mientras se crea la guía: coche con maletas → avión → vuelo → destino ----------
     Pj.journey(caja, tema): las fases van solas; done() hace aterrizar en el destino (isla, nieve, ciudad…)
     en cuanto se pueda; si la guía tarda demasiado, la escena se recoge sola en vez de quedarse colgada. */
  function dest(kind) {
    var sea = '<rect x="0" y="70" width="360" height="50" fill="#5bb4e8"/><path d="M0 76 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/>';
    if (kind === 'isla' || kind === 'playa') return '<svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMax slice">' + sea +
      '<path d="M150 92 Q215 58 290 92 Z" fill="#f2d38b"/><path d="M262 88 Q268 60 254 34" stroke="#8a5a32" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<path d="M254 34 Q234 22 216 36 Q236 30 254 36Z M254 34 Q244 12 224 14 Q242 20 254 36Z M254 34 Q266 12 288 18 Q270 22 255 36Z M254 34 Q276 26 290 42 Q272 34 255 37Z" fill="#2f8f5b"/>' +
      (kind === 'playa' ? '<path d="M120 100 L120 74" stroke="#666" stroke-width="2"/><path d="M98 76 Q120 58 142 76 Z" fill="#e8574a"/><path d="M0 100 L360 100 L360 120 L0 120Z" fill="#f2d38b"/>' : '') + '</svg>';
    if (kind === 'nieve') return '<svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMax slice"><path d="M0 120 L0 70 L60 22 L110 64 L170 12 L240 70 L300 30 L360 66 L360 120Z" fill="#8fa3bf"/>' +
      '<path d="M60 22 L74 34 L66 36 L56 30 L46 34Z M170 12 L188 30 L176 30 L168 24 L156 32Z M300 30 L314 42 L304 42 L294 38Z" fill="#fff"/><path d="M0 120 L0 92 Q180 78 360 94 L360 120Z" fill="#f4f7fb"/>' +
      [40, 70, 290, 320].map(function (x) { return '<path d="M' + x + ' 100 l10 -26 l10 26Z" fill="#2f6b4f"/><rect x="' + (x + 8) + '" y="100" width="4" height="6" fill="#6e4524"/>'; }).join('') + '</svg>';
    if (kind === 'safari') return '<svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMax slice"><path d="M0 120 L0 88 Q180 70 360 90 L360 120Z" fill="#d9b65e"/>' +
      '<path d="M290 92 Q288 66 280 52" stroke="#6e4524" stroke-width="5" fill="none"/><ellipse cx="280" cy="48" rx="36" ry="8" fill="#5f8a3a"/><path d="M60 92 Q58 74 52 64" stroke="#6e4524" stroke-width="4" fill="none"/><ellipse cx="52" cy="60" rx="26" ry="6" fill="#6f9a45"/>' +
      '<path d="M210 92 L211 76 M216 92 L216 77 M226 92 L225 76 M231 92 L230 75" stroke="#e8b04a" stroke-width="3"/><ellipse cx="220" cy="72" rx="13" ry="7" fill="#e8b04a"/><path d="M228 70 L240 44" stroke="#e8b04a" stroke-width="6" stroke-linecap="round"/><ellipse cx="243" cy="42" rx="6" ry="3.5" fill="#e8b04a"/></svg>';
    if (kind === 'monte') return '<svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMax slice"><path d="M0 120 L0 72 L70 26 L130 70 L200 20 L270 74 L330 40 L360 60 L360 120Z" fill="#6f9a7a"/><path d="M0 120 L0 96 Q180 80 360 98 L360 120Z" fill="#4f8a5f"/>' +
      [30, 60, 300, 330].map(function (x) { return '<path d="M' + x + ' 104 l10 -28 l10 28Z" fill="#2a6a45"/>'; }).join('') + '</svg>';
    // ciudad: siluetas de edificios con ventanas encendidas
    var b = '', xs = [[0, 46, 60], [40, 70, 36], [100, 40, 76], [136, 60, 50], [190, 34, 88], [220, 66, 44], [280, 44, 70], [320, 40, 54]];
    xs.forEach(function (q) { b += '<rect x="' + q[0] + '" y="' + (120 - q[2]) + '" width="' + q[1] + '" height="' + q[2] + '" fill="#6b7088"/>'; for (var y = 120 - q[2] + 8; y < 112; y += 12) for (var x = q[0] + 6; x < q[0] + q[1] - 6; x += 12) b += '<rect x="' + x + '" y="' + y + '" width="5" height="6" fill="#f2c14e" opacity="' + (Math.random() > .4 ? .9 : .25) + '"/>'; });
    return '<svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMax slice">' + b + '<rect x="0" y="112" width="360" height="8" fill="#555a6b"/></svg>';
  }
  function journey(box, kind) {
    if (!box || off() || reduced()) return { done: function () {}, stop: function () {}, tick: function () {} };
    var J = { t: [], dead: false, fin: false, cruise: false, landed: false }, W = box.clientWidth || 340;
    var car = vehicle({ vehicle: 'car', body: pick(['#e2782f', '#2b8fc9', '#2f8f5b', '#c8323c']), lug: 1 });
    box.innerHTML = '<div class="jr"><div class="jr-sky"></div><div class="jr-cl"><i></i><i></i><i></i><i></i></div><div class="jr-dest">' + dest(kind) + '</div>' +
      '<div class="jr-gr"><i class="jr-road"></i><span class="jr-tw"><svg viewBox="0 0 40 60"><rect x="16" y="10" width="8" height="46" fill="#9aa3b5"/><rect x="8" y="2" width="24" height="12" rx="3" fill="#6b7fb3"/><rect x="11" y="5" width="18" height="6" fill="#bfe0f2"/></svg></span></div>' +
      '<div class="jr-pl pj drive">' + plane() + '</div><div class="jr-car pj drive">' + car + '</div><div class="jr-pax">' + person(KINDS.maleta, 'jx') + '</div><div class="jr-end"></div></div>';
    var R = box.firstChild, car0 = R.querySelector('.jr-car'), pl = R.querySelector('.jr-pl'), px = R.querySelector('.jr-pax'), gr = R.querySelector('.jr-gr'), ds = R.querySelector('.jr-dest'), cl = R.querySelector('.jr-cl');
    function w(ms) { return new Promise(function (r) { J.t.push(setTimeout(r, ms)); }); }
    function go(el, kf, ms, ease) { return anim(el, kf, { duration: ms, easing: ease || 'ease-in-out', fill: 'forwards' }); }
    var cx = Math.round(W * .1), plx = Math.round(W * .5);
    // 1 · el coche llega cargado de maletas; el avión espera en la pista
    go(pl, [{ transform: 'translate(' + plx + 'px,104px) scale(.62)' }, { transform: 'translate(' + plx + 'px,104px) scale(.62)' }], 10);
    go(car0, [{ transform: 'translate(-170px,112px) scale(.55)' }, { transform: 'translate(' + cx + 'px,112px) scale(.55)' }], 2000, 'cubic-bezier(.2,.8,.3,1)').then(function () {
      if (J.dead) return; car0.classList.remove('drive');
      // 2 · salta del coche al avión
      px.style.opacity = 1;
      return go(px, [{ transform: 'translate(' + (cx + 50) + 'px,100px) scale(.36)' }, { transform: 'translate(' + ((cx + plx) / 2 + 30) + 'px,40px) scale(.36) rotate(20deg)', offset: .5 }, { transform: 'translate(' + (plx + 40) + 'px,96px) scale(.2) rotate(40deg)', opacity: 0 }], 1100, 'cubic-bezier(.3,.6,.5,1)');
    }).then(function () {
      if (J.dead) return;
      // 3 · el coche se va y el avión despega; la pista baja y quedan el cielo y las nubes
      go(car0, [{ transform: 'translate(' + cx + 'px,112px) scale(.55)' }, { transform: 'translate(-200px,112px) scale(.55) scaleX(-1)' }], 1400, 'ease-in'); car0.classList.add('drive', 'left');
      return go(pl, [{ transform: 'translate(' + plx + 'px,104px) scale(.62)' }, { transform: 'translate(' + (plx + 40) + 'px,104px) scale(.62)', offset: .3 }, { transform: 'translate(' + Math.round(W * .32) + 'px,30px) scale(.7) rotate(-14deg)', offset: .8 }, { transform: 'translate(' + Math.round(W * .3) + 'px,46px) scale(.7) rotate(0deg)' }], 2600, 'ease-in-out');
    }).then(function () {
      if (J.dead) return;
      go(gr, [{ transform: 'none' }, { transform: 'translateY(260%)' }], 900);
      cl.classList.add('on'); pl.classList.add('fly');
      J.cruise = true;
      if (J.fin) land();
    });
    // 4 · al terminar la guía: aparece el destino, el avión baja y sale su personaje
    function land() {
      if (J.landed || J.dead) return; J.landed = true;
      go(ds, [{ transform: 'translateY(100%)' }, { transform: 'none' }], 1300, 'cubic-bezier(.2,.8,.3,1)');
      go(pl, [{ transform: 'translate(' + Math.round(W * .3) + 'px,46px) scale(.7)' }, { transform: 'translate(' + Math.round(W * .62) + 'px,70px) scale(.4) rotate(8deg)', opacity: 1, offset: .8 }, { transform: 'translate(' + Math.round(W * .7) + 'px,92px) scale(.3)', opacity: 0 }], 1700).then(function () {
        if (J.dead) return;
        cl.classList.remove('on');
        var f = figure(kind === 'isla' ? 'playa' : kind === 'safari' ? 'monte' : kind), end = R.querySelector('.jr-end'); if (kind === 'isla' || kind === 'playa') end.classList.add('on-isle'); end.appendChild(f);
        var b = document.createElement('span'); b.className = 'pj-say'; b.textContent = en() ? 'We’re here!' : '¡Hemos llegado!'; f.appendChild(b);
        return w(2600);
      }).then(function () { collapse(); });
    }
    function collapse() { if (J.dead) return; J.dead = true; J.t.forEach(clearTimeout); box.classList.add('jr-out'); setTimeout(function () { box.innerHTML = ''; box.classList.remove('jr-out'); }, 600); }
    // dura lo que dure la guía: cada paso la mantiene viva; si se queda parada (o tarda demasiado), se recoge
    J.last = Date.now(); J.t0 = J.last;
    var iv = setInterval(function () { if (J.dead) { clearInterval(iv); return; } if (!J.fin && (Date.now() - J.last > 75000 || Date.now() - J.t0 > 180000)) { clearInterval(iv); collapse(); } }, 2000);
    return { done: function () { J.fin = true; if (J.cruise) land(); }, stop: collapse, tick: function () { J.last = Date.now(); } };
  }

  /* ---------- Un acompañante dentro de un recuadro (los mapas animados) ----------
     Es siempre la misma persona, vestida según el viaje (base); cambia a coche, autobús o avión en los trayectos
     y hace gestos en cada parada. show(tipo, estado): estado = 'walk', 'drive', 'idle' o 'act-…' */
  function cast(box, base) {
    var A = { el: null, cur: '', look: { skin: pick(SKIN), hair: pick(HAIR) }, base: KINDS[base] && !KINDS[base].vehicle ? base : base === 'isla' ? 'playa' : base === 'safari' ? 'monte' : 'pie' };
    function build(kind) {
      var K = KINDS[kind], P = {}; for (var k in K) P[k] = K[k];
      if (!K.vehicle && kind === A.base) P.cam = 1;
      var e = document.createElement('div');
      e.className = 'pj pj-cast pj-in pj-' + kind + (K.vehicle ? ' pj-veh' : '') + (K.gear ? ' gear' : '');
      e.innerHTML = (K.vehicle ? vehicle(P) : person(P, Math.random().toString(36).slice(2, 7), A.look)) + '<span class="pj-shadow"></span>';
      return e;
    }
    A.show = function (kind, state) {
      if (off() || reduced() || !box) return;
      kind = kind || A.base;
      if (kind !== A.cur || !A.el) {
        var old = A.el; if (old) { old.classList.add('pj-out'); setTimeout(function () { old.remove(); }, 300); }
        A.el = build(kind); A.cur = kind; box.appendChild(A.el);
      }
      var c = A.el.className.replace(/\s(walk|drive|act-\w+)/g, ''); A.el.className = c + (state && state !== 'idle' ? ' ' + state : '');
    };
    A.say = function (txt, ms) {
      if (!A.el) return; var b = document.createElement('span'); b.className = 'pj-say'; b.textContent = txt; A.el.appendChild(b);
      setTimeout(function () { b.classList.add('out'); setTimeout(function () { b.remove(); }, 260); }, ms || 1600);
    };
    A.hide = function () { var old = A.el; A.el = null; A.cur = ''; if (old) { old.classList.add('pj-out'); setTimeout(function () { old.remove(); }, 300); } };
    A.phrase = function (kind) { var K = KINDS[kind]; return K && K.say ? (en() ? K.say[1] : K.say[0]) : ''; };
    A.idleOf = function (kind) { var K = KINDS[kind]; return K && K.idle ? 'act-' + K.idle : 'idle'; };
    return A;
  }

  /* ---------- Qué personaje toca según el destino y la fecha ---------- */
  // el clima de cada país en cada época: así un viaje a Marruecos en invierno no sale con abrigo y bufanda
  function L(x) { return x.split(' '); }
  var ISLE = L('MV SC MU FJ PF BS BB'), TROPIC = L('TH MX ID DO CU BR PH VN MY SG CR CO KE TZ IN LK JM PR PA KH LA CV SN GH NG');
  var SOUTH = L('AR CL AU NZ ZA UY NA BW'), HOT = L('EG AE QA OM SA JO BH KW'), SAFARI = L('KE TZ BW NA ZW ZM UG RW');
  var MILD = L('ES PT IT GR MT CY TR MA TN IL LB HR ME AL');
  var COLD = L('FI NO SE IS CH AT CA EE LV LT DK PL CZ SK RU GL DE NL BE GB IE FR LU HU RO BG SI RS BA MK UA BY US JP KR CN MN NP');
  var RAINY = L('GB IE NL BE'), HIKE = L('NP CH AT NZ PE SI CA NO');
  function theme(ccs, iso) {
    var m = iso ? +iso.slice(5, 7) : new Date().getMonth() + 1, cc = (ccs || [])[0] || '', has = function (l) { return l.indexOf(cc) >= 0; };
    if (has(ISLE)) return 'isla';
    if (has(SAFARI)) return 'safari';
    if (has(TROPIC)) return 'playa';
    if (has(SOUTH)) m = (m + 5) % 12 + 1;
    var winter = m === 12 || m <= 2, shoulder = m === 11 || m === 3, summer = m >= 6 && m <= 9;
    if (has(HOT)) return summer ? 'playa' : 'ciudad';
    if (has(MILD)) return summer ? 'playa' : 'ciudad';
    if (has(COLD)) {
      if (winter || (shoulder && !has(RAINY) && cc !== 'FR' && cc !== 'US')) return 'nieve';
      if (summer && has(HIKE)) return 'monte';
      if (has(RAINY)) return 'lluvia';
      return summer ? 'pie' : 'ciudad';
    }
    if (has(SOUTH)) return winter ? 'ciudad' : summer ? 'playa' : 'pie';
    return 'ciudad';
  }

  return { play: play, stop: stop, figure: figure, cast: cast, journey: journey, theme: theme, kinds: Object.keys(KINDS), enabled: function () { return !off() && !reduced(); } };
})();
