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
    safari:  { group: ['leon', 'jirafa', 'jeep'], fx: 'sun', still: 'monte' },
    sabana:  { vehicle: 'savanna', idle: 'safari', fx: 'sun', long: 1, say: ['¡Mira, una jirafa!', 'Look, a giraffe!'] },
    leon:    { vehicle: 'lion', animal: 1, from: 'left', idle: 'roar', say: ['¡Grrr!', 'Grrr!'] },
    jirafa:  { vehicle: 'giraffe', animal: 1, from: 'right', idle: 'munch' },
    jeep:    { vehicle: 'jeep', idle: 'safari', say: ['¡Mira, una jirafa!', 'Look, a giraffe!'] },
    gondola: { vehicle: 'gondola', idle: 'row', fx: 'notes', long: 1, say: ['¡O sole mio!', 'O sole mio!'] },
    pizza:   { top: '#f7f3ec', bot: '#3b3e46', shoe: '#1f2126', hat: 'chef', hatC: '#ffffff', pan: 1, idle: 'flip', fx: 'food', food: '🍕🍝🧀', say: ['¡Mamma mia!', 'Mamma mia!'] },
    paris:   { top: '#f7f3ec', stripes: '#2b3f73', bot: '#2b3f73', shoe: '#1f2126', hat: 'beret', hatC: '#1f2126', bread: 1, idle: 'wave', fx: 'food', food: '🥐🥖🧀', say: ['¡Bonjour!', 'Bonjour!'] },
    japon:   { top: '#3b4a8b', bot: '#3b4a8b', shoe: '#6e4524', obi: '#c8323c', fanP: 1, idle: 'fan', fx: 'petals', say: ['¡Konnichiwa!', 'Konnichiwa!'] },
    mexico:  { top: '#f7f3ec', bot: '#2b2b2e', shoe: '#3b2a1c', hat: 'charro', hatC: '#3b2a1c', guitar: 1, idle: 'strum', fx: 'notes', say: ['¡Viva México!', '¡Viva México!'] },
    flamenco:{ top: '#c8323c', dots: 1, dress: '#c8323c', bot: '#c8323c', shoe: '#1f2126', flower: '#e8574a', idle: 'twirl', fx: 'notes', say: ['¡Olé!', 'Olé!'] },
    esqui:   { top: '#2b8fc9', bot: '#3b3e46', shoe: '#1f2126', hat: 'beanie', hatC: '#e8574a', coat: 1, mitt: '#e8574a', skis: 1, idle: 'ski', fx: 'snow', say: ['¡A esquiar!', 'Let’s ski!'] },
    aurora:  { top: '#2f8f5b', bot: '#3b4a6b', shoe: '#5a3b2a', hat: 'beanie', hatC: '#8f7fc4', coat: 1, mitt: '#8f7fc4', gear: 'scarf', gearC: '#f2c14e', idle: 'look', fx: 'aurora', say: ['¡Auroras boreales!', 'Northern lights!'] },
    andes:   { vehicle: 'llama', idle: 'llama', say: ['¡Hola, llama!', 'Hello, llama!'] },
    camello: { vehicle: 'camel', idle: 'camel', fx: 'sun', long: 1, say: ['¡Al desierto!', 'Into the desert!'] },
    tuktuk:  { vehicle: 'tuktuk', say: ['¡Tuk, tuk!', 'Tuk tuk!'] },
    taxi:    { vehicle: 'car', body: '#f2c14e', taxi: 1, say: ['¡Taxi!', 'Taxi!'] },
    bici:    { vehicle: 'bike', say: ['¡Ring, ring!', 'Ring ring!'] },
    londres: { vehicle: 'tram', body: '#c8323c', deck2: 1, say: ['Mind the gap!', 'Mind the gap!'] },
    tranvia: { vehicle: 'tram', body: '#f2c14e', say: ['¡El 28!', 'Tram 28!'] },
    globos:  { vehicle: 'hotair', enter: 'rise', idle: 'float', long: 1, say: ['¡Qué vistas!', 'What a view!'] },
    canguro: { vehicle: 'roo', animal: 1, idle: 'boing', say: ['¡Boing!', 'Boing!'] },
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
    if (k === 'charro') return '<ellipse cx="50" cy="31" rx="36" ry="7" fill="' + c + '"/><path d="M36 31 Q38 9 50 9 Q62 9 64 31Z" fill="' + c + '"/><path d="M15 31 Q50 41 85 31" stroke="#e0a92c" stroke-width="2" fill="none"/><rect x="37" y="24" width="26" height="3" fill="#e0a92c"/>';
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
    if (K.skis) s += '<path d="M14 160 L86 154 M16 165 L90 159" stroke="' + (K.hatC || '#2b8fc9') + '" stroke-width="4" stroke-linecap="round"/><path d="M29 107 L16 160 M71 107 L86 158" stroke="#555" stroke-width="2"/>';
    // cuerpo
    var torso = 'M31 74 Q31 64 40 63 L60 63 Q69 64 69 74 L71 116 Q50 122 29 116 Z';
    s += '<g class="pj-body"><path d="' + torso + '" fill="' + top + '"/>';
    if (swim) s += '<path d="M29 104 L71 104 L71 116 Q50 122 29 116 Z" fill="' + K.bot + '"/><path d="M29 104 L71 104" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/>';
    else s += '<path d="M29 112 Q50 118 71 112 L71 116 Q50 122 29 116 Z" fill="' + shade(top, -15) + '"/>';
    if (K.coat) s += '<path d="M31 80 Q50 84 69 80 M30 92 Q50 96 70 92 M30 104 Q50 108 70 104" stroke="' + shade(top, -16) + '" stroke-width="1.6" fill="none"/><line x1="50" y1="64" x2="50" y2="118" stroke="' + shade(top, -22) + '" stroke-width="1.4"/>';
    else if (!swim) s += '<path d="M42 63 Q50 72 58 63" fill="' + shade(top, -14) + '"/>';
    if (K.stripes) s += '<path d="M31 72 H69 M30 80 H70 M30 88 H70 M29 96 H71 M29 104 H71" stroke="' + K.stripes + '" stroke-width="3"/>';
    if (K.dots) s += '<g fill="#fff" opacity=".9"><circle cx="38" cy="74" r="2"/><circle cx="52" cy="70" r="2"/><circle cx="62" cy="80" r="2"/><circle cx="44" cy="86" r="2"/><circle cx="58" cy="94" r="2"/><circle cx="36" cy="98" r="2"/></g>';
    if (K.obi) s += '<path d="M42 63 L56 98" stroke="#f7f3ec" stroke-width="3"/><rect x="29" y="92" width="42" height="10" fill="' + K.obi + '"/><rect x="46" y="91" width="9" height="12" rx="2" fill="' + shade(K.obi, -18) + '"/><path d="M33 104 L38 150 M67 104 L62 150" stroke="' + shade(top, -12) + '" stroke-width="2"/>';
    if (K.dress) s += '<g class="pj-skirt"><path d="M29 104 Q50 110 71 104 L86 150 Q70 158 50 154 Q30 158 14 150 Z" fill="' + K.dress + '"/><path d="M14 150 Q22 140 31 151 Q40 142 50 153 Q60 142 69 151 Q78 140 86 150" stroke="#fff" stroke-width="2.4" fill="none"/></g>';
    if (K.guitar) s += '<g class="pj-gtr"><path d="M36 92 L12 70" stroke="#6e4524" stroke-width="4" stroke-linecap="round"/><path d="M12 70 l-4 -4" stroke="#3b2a1c" stroke-width="5" stroke-linecap="round"/><ellipse cx="46" cy="100" rx="14" ry="10" fill="#c8853f" transform="rotate(-30 46 100)"/><ellipse cx="57" cy="94" rx="9" ry="7" fill="#c8853f" transform="rotate(-30 57 94)"/><circle cx="48" cy="99" r="3.2" fill="#3b2a1c"/></g>';
    if (K.hat === 'chef') s += '<circle cx="50" cy="80" r="1.6" fill="#999"/><circle cx="50" cy="90" r="1.6" fill="#999"/><circle cx="50" cy="100" r="1.6" fill="#999"/>';
    s += '<path d="' + torso + '" fill="' + g + '"/>';
    if (K.ring) s += '<g class="pj-ring"><ellipse cx="50" cy="110" rx="29" ry="9" fill="none" stroke="' + K.ring + '" stroke-width="8"/><ellipse cx="50" cy="110" rx="29" ry="9" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="10 12"/></g>';
    if (K.cam) s += '<g class="pj-cam"><path d="M38 64 L46 86 M62 64 L54 86" stroke="#1f2126" stroke-width="1.5"/><rect x="41" y="84" width="18" height="12" rx="2.5" fill="#1f2126"/><circle cx="50" cy="90" r="4" fill="#5b6170" stroke="#9aa" stroke-width="1"/></g>';
    s += '</g>';
    // brazos (el izquierdo y el derecho giran desde el hombro)
    var hand = K.mitt || skin, slv = swim ? skin : top;
    s += '<g class="pj-armL"><rect x="24" y="67" width="10" height="38" rx="5" fill="' + slv + '"/><rect x="24" y="67" width="10" height="38" rx="5" fill="' + g + '"/><circle cx="29" cy="107" r="5.5" fill="' + hand + '"/>' +
      (K.palette ? '<g class="pj-pal"><ellipse cx="24" cy="110" rx="12" ry="8" fill="#e9d3a7"/><circle cx="18" cy="108" r="2.2" fill="#e8574a"/><circle cx="23" cy="105" r="2.2" fill="#2b8fc9"/><circle cx="29" cy="107" r="2.2" fill="#f2c14e"/><circle cx="24" cy="113" r="2.2" fill="#2f8f5b"/></g>' : '') +
      (K.bread ? '<g transform="rotate(-38 30 92)"><rect x="6" y="87" width="50" height="10" rx="5" fill="#d9a441"/><path d="M16 88 l4 8 M26 88 l4 8 M36 88 l4 8 M46 88 l4 8" stroke="#b07a2a" stroke-width="1.6"/></g>' : '') +
      (K.pillow ? '<rect x="10" y="96" width="26" height="17" rx="7" fill="#f7f3ec" stroke="#ddd"/>' : '') +
      (K.bags ? '<g class="pj-bagL"><path d="M25 106 Q29 98 33 106" stroke="#333" stroke-width="1.5" fill="none"/><rect x="20" y="106" width="18" height="20" rx="2" fill="#f2c14e"/></g>' : '') +
      (K.gear === 'map' ? '<g class="pj-map"><rect x="17" y="100" width="24" height="17" rx="1" fill="' + (K.gearC || '#fff') + '" stroke="#bbb"/><path d="M23 100 L23 117 M29 100 L29 117 M35 100 L35 117" stroke="#ccc"/><path d="M19 112 Q26 104 38 106" stroke="#e2782f" stroke-width="1.4" fill="none" stroke-dasharray="2 2"/></g>' : '') + '</g>';
    s += '<g class="pj-armR"><rect x="66" y="67" width="10" height="38" rx="5" fill="' + slv + '"/><rect x="66" y="67" width="10" height="38" rx="5" fill="' + g + '"/><circle cx="71" cy="107" r="5.5" fill="' + hand + '"/>' +
      (K.fanP ? '<g class="pj-fanp"><path d="M71 107 L57 92 Q71 82 85 92 Z" fill="#f29ab8" stroke="#c8323c" stroke-width="1"/><path d="M71 107 L63 89 M71 107 L71 86 M71 107 L79 89" stroke="#c8323c" stroke-width=".8"/></g>' : '') +
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
    if (K.flower) s += '<circle cx="50" cy="19" r="7" fill="' + hair + '"/><circle cx="33" cy="29" r="5.5" fill="' + K.flower + '"/><circle cx="33" cy="29" r="2" fill="#f2c14e"/>';
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
  /* ---------- Vehículos y escenas de cada sitio ---------- */
  function sk0() { return pick(SKIN); }
  // Venecia: góndola negra y el gondolero con su camiseta de rayas y canotier, remando
  function gondola() {
    var s = sk0();
    return '<svg class="pj-fig" viewBox="0 0 220 130" width="190" height="112" aria-hidden="true"><g class="pj-all">' +
      '<path d="M0 108 Q55 102 110 108 T220 108 L220 130 L0 130Z" fill="#4f8fc4"/><g class="pj-waves"><path d="M10 117 q8 -4 16 0 t16 0 t16 0 M120 121 q8 -4 16 0 t16 0 t16 0" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/></g>' +
      '<rect x="44" y="70" width="6" height="24" fill="#1f2126"/><rect x="53" y="70" width="6" height="24" fill="#1f2126"/>' +
      '<rect x="40" y="44" width="23" height="29" rx="6" fill="#f7f3ec"/><path d="M40 50 H63 M40 57 H63 M40 64 H63" stroke="#2b3f73" stroke-width="3"/>' +
      '<circle cx="51" cy="34" r="9" fill="' + s + '"/><circle cx="48" cy="34" r="1.2" fill="#222"/><circle cx="54" cy="34" r="1.2" fill="#222"/><path d="M48 38 q3 2 6 0" stroke="#222" stroke-width="1" fill="none"/>' +
      '<ellipse cx="51" cy="27" rx="13" ry="3" fill="#e8cf8a"/><rect x="44" y="19" width="14" height="8" rx="1.5" fill="#e8cf8a"/><rect x="44" y="23.5" width="14" height="2.5" fill="#c8323c"/>' +
      '<g class="pj-oar"><path d="M60 54 L76 64" stroke="' + s + '" stroke-width="5" stroke-linecap="round"/><path d="M82 40 L36 124" stroke="#8a5a32" stroke-width="3" stroke-linecap="round"/><ellipse cx="38" cy="120" rx="3" ry="8" fill="#8a5a32" transform="rotate(28 38 120)"/></g>' +
      '<path d="M14 92 Q24 108 100 108 Q178 108 200 88 Q207 78 204 64 Q198 84 182 92 Z" fill="#1f2126"/><path d="M200 66 l9 -3 l-3 5 l5 0 l-3 5 l5 1 l-8 4 Z" fill="#d9d2c0"/><path d="M14 92 Q9 86 12 76" stroke="#1f2126" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M100 92 q17 -12 34 0 Z" fill="#c8323c"/><rect x="98" y="90" width="38" height="6" rx="3" fill="#a8282f"/>' +
      '</g></svg>';
  }
  // desierto: camello con su jinete, dunas y pirámides al fondo
  function camel() {
    var s = sk0(), cm = '#c8955a';
    return '<svg class="pj-fig" viewBox="0 0 200 150" width="160" height="120" aria-hidden="true"><g class="pj-all">' +
      '<path d="M120 132 L137 104 L154 132Z" fill="#e1b468"/><path d="M142 132 L166 92 L190 132Z" fill="#d9a95a"/><path d="M0 132 Q100 120 200 132 L200 150 L0 150Z" fill="#e8c27a"/>' +
      '<g class="pj-cla"><path d="M62 104 L58 136 M106 104 L110 136" stroke="' + cm + '" stroke-width="6" stroke-linecap="round"/></g><g class="pj-clb"><path d="M72 104 L74 136 M116 104 L114 136" stroke="#b5834c" stroke-width="6" stroke-linecap="round"/></g>' +
      '<path d="M50 92 q-9 6 -6 18" stroke="' + cm + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 106 Q44 78 68 76 Q78 54 90 76 Q100 56 110 76 Q128 78 124 106 Z" fill="' + cm + '"/>' +
      '<path d="M118 98 Q138 88 136 62 Q136 50 148 50 Q158 52 157 59 L144 62 Q146 82 128 102Z" fill="' + cm + '"/><circle cx="148" cy="55" r="1.6" fill="#222"/><path d="M142 50 l-2 -5" stroke="' + cm + '" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="76" y="62" width="26" height="10" rx="3" fill="#c8323c"/><path d="M78 72 v4 M84 72 v4 M90 72 v4 M96 72 v4" stroke="#f2c14e" stroke-width="2"/>' +
      '<path d="M80 64 Q80 42 89 40 Q98 42 98 64 Z" fill="#2b5fa6"/><circle cx="89" cy="33" r="7.5" fill="' + s + '"/><path d="M81 33 Q81 22 89 22 Q97 22 97 33 Q95 27 89 27 Q83 27 81 33Z M82 34 Q89 44 96 34 L97 38 Q89 46 81 38Z" fill="#2b5fa6"/><circle cx="91" cy="32" r="1.1" fill="#222"/>' +
      '<path d="M96 50 L140 58" stroke="#6e4524" stroke-width="1.5"/></g></svg>';
  }
  // tuk-tuk de colores
  function tuktuk() {
    var s = sk0(), c = pick(['#2f8f5b', '#2b8fc9', '#c8323c']);
    return '<svg class="pj-fig" viewBox="0 0 160 110" width="140" height="96" aria-hidden="true"><g class="pj-all">' +
      '<path d="M34 34 Q34 22 46 22 L118 22 Q130 22 130 34 Z" fill="' + c + '"/><rect x="34" y="31" width="96" height="5" fill="#f2c14e"/>' +
      '<rect x="36" y="36" width="6" height="48" fill="' + c + '"/><path d="M42 60 L96 60 L96 84 L36 84 L36 60Z" fill="' + c + '"/><rect x="48" y="44" width="34" height="16" rx="5" fill="#e8574a"/>' +
      '<path d="M96 40 L120 40 Q140 44 150 60 L152 84 L96 84 Z" fill="#f2c14e"/><path d="M122 44 Q138 48 144 60 L122 60Z" fill="#bfe0f2"/>' +
      '<circle cx="110" cy="46" r="7" fill="' + s + '"/><path d="M103 45 Q110 36 117 45" fill="' + pick(HAIR) + '"/><circle cx="113" cy="46" r="1.1" fill="#222"/><circle cx="150" cy="68" r="3" fill="#fff6c8"/>' +
      '<g class="pj-wheel" style="transform-origin:58px 88px"><circle cx="58" cy="88" r="11" fill="#2a2a2e"/><circle cx="58" cy="88" r="4" fill="#bbb"/><rect x="56.5" y="78" width="3" height="20" fill="#555"/></g>' +
      '<g class="pj-wheel" style="transform-origin:136px 88px"><circle cx="136" cy="88" r="10" fill="#2a2a2e"/><circle cx="136" cy="88" r="4" fill="#bbb"/><rect x="134.5" y="79" width="3" height="18" fill="#555"/></g></g></svg>';
  }
  // bici con una cesta de tulipanes
  function bike() {
    var s = sk0(), wh = function (x) { return '<g class="pj-wheel" style="transform-origin:' + x + 'px 104px"><circle cx="' + x + '" cy="104" r="20" fill="none" stroke="#333" stroke-width="4"/><path d="M' + (x - 19) + ' 104 H' + (x + 19) + ' M' + x + ' 85 V123 M' + (x - 13) + ' 91 L' + (x + 13) + ' 117 M' + (x - 13) + ' 117 L' + (x + 13) + ' 91" stroke="#999" stroke-width="1.2"/></g>'; };
    return '<svg class="pj-fig" viewBox="0 0 150 130" width="130" height="113" aria-hidden="true"><g class="pj-all">' + wh(34) + wh(116) +
      '<path d="M34 104 L62 72 L104 72 L116 104 M62 72 L78 104 L104 72 M78 104 L34 104" stroke="#c8323c" stroke-width="4" fill="none" stroke-linejoin="round"/><rect x="54" y="63" width="18" height="5" rx="2" fill="#333"/><path d="M100 72 L106 56 L116 56" stroke="#333" stroke-width="3" fill="none"/>' +
      '<rect x="104" y="56" width="24" height="14" rx="2" fill="#c9a46a"/><path d="M108 56 v14 M114 56 v14 M120 56 v14" stroke="#a8844a" stroke-width="1"/>' +
      '<path d="M109 56 V47 M116 56 V45 M123 56 V48" stroke="#2f8f5b" stroke-width="1.6"/><circle cx="109" cy="45" r="4.5" fill="#e8574a"/><circle cx="116" cy="43" r="4.5" fill="#f2c14e"/><circle cx="123" cy="46" r="4.5" fill="#d0558a"/>' +
      '<g class="pj-ped"><path d="M64 66 L80 86 L76 104" stroke="#3b4a6b" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<path d="M57 68 L72 30 L86 35 L72 70Z" fill="#2b8fc9"/><path d="M80 38 L106 56" stroke="' + s + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="82" cy="23" r="9" fill="' + s + '"/><path d="M73 22 Q74 12 83 12 Q91 13 91 21 Q86 16 79 18Z" fill="' + pick(HAIR) + '"/><circle cx="85" cy="23" r="1.2" fill="#222"/></g></svg>';
  }
  // globo aerostático (Capadocia)
  function hotair() {
    return '<svg class="pj-fig" viewBox="0 0 120 170" width="100" height="142" aria-hidden="true"><g class="pj-all">' +
      '<path d="M60 6 C18 6 8 52 26 82 Q40 104 46 112 L74 112 Q80 104 94 82 C112 52 102 6 60 6Z" fill="#e8574a"/>' +
      '<path d="M60 6 C44 6 38 52 47 82 Q53 104 55 112 L65 112 Q67 104 73 82 C82 52 76 6 60 6Z" fill="#f2c14e"/><path d="M60 6 C30 6 22 52 34 82" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>' +
      '<path d="M48 112 L50 130 M72 112 L70 130 M58 112 V130" stroke="#6e4524" stroke-width="1.2"/>' +
      '<circle cx="53" cy="127" r="6" fill="' + sk0() + '"/><circle cx="67" cy="126" r="6" fill="' + sk0() + '"/>' +
      '<rect x="44" y="129" width="32" height="20" rx="3" fill="#a87444"/><path d="M44 135 H76 M44 141 H76 M52 129 V149 M60 129 V149 M68 129 V149" stroke="#8a5a32" stroke-width="1"/></g></svg>';
  }
  // canguro con su cría en la bolsa
  function roo() {
    var c = '#c8853f';
    return '<svg class="pj-fig" viewBox="0 0 120 130" width="100" height="108" aria-hidden="true"><g class="pj-all">' +
      '<path d="M32 108 Q6 114 2 96 Q16 106 36 100Z" fill="' + c + '"/><ellipse cx="48" cy="86" rx="21" ry="27" fill="' + c + '" transform="rotate(-18 48 86)"/><ellipse cx="54" cy="92" rx="10" ry="15" fill="#e3b27a" transform="rotate(-18 54 92)"/>' +
      '<circle cx="56" cy="84" r="5" fill="' + c + '"/><circle cx="57" cy="83" r="1" fill="#222"/>' +
      '<path d="M38 108 L66 116 L70 122 L34 122 Z" fill="#a8642a"/><path d="M62 74 L72 84 M64 80 L74 90" stroke="' + c + '" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M56 62 Q60 50 66 46" stroke="' + c + '" stroke-width="10" stroke-linecap="round"/><ellipse cx="70" cy="46" rx="12" ry="8.5" fill="' + c + '"/><ellipse cx="80" cy="49" rx="4" ry="3" fill="#7a4a24"/>' +
      '<ellipse cx="62" cy="32" rx="3" ry="10" fill="' + c + '" transform="rotate(-12 62 32)"/><ellipse cx="70" cy="32" rx="3" ry="10" fill="' + c + '" transform="rotate(8 70 32)"/><circle cx="72" cy="44" r="1.5" fill="#222"/></g></svg>';
  }
  // los Andes: alguien con chullo y poncho y su llama
  function llama() {
    var s = sk0(), lc = '#f1e6cf';
    return '<svg class="pj-fig" viewBox="0 0 170 160" width="150" height="141" aria-hidden="true"><g class="pj-all">' +
      '<path d="M0 150 Q85 142 170 150 L170 160 L0 160Z" fill="#9db06a"/>' +
      '<path d="M88 110 L86 148 M98 112 L100 148 M122 112 L120 148 M132 110 L134 148" stroke="#e3d3b0" stroke-width="6" stroke-linecap="round"/>' +
      '<ellipse cx="110" cy="102" rx="30" ry="15" fill="' + lc + '"/><path d="M86 100 q-8 -2 -8 6" stroke="' + lc + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<rect x="96" y="88" width="30" height="11" rx="3" fill="#e8574a"/><path d="M96 92 H126 M96 96 H126" stroke="#f2c14e" stroke-width="1.6"/>' +
      '<g class="pj-lh"><path d="M130 100 L136 54" stroke="' + lc + '" stroke-width="13" stroke-linecap="round"/><ellipse cx="141" cy="50" rx="12" ry="8" fill="' + lc + '"/><ellipse cx="135" cy="38" rx="3" ry="7" fill="' + lc + '"/><ellipse cx="143" cy="37" rx="3" ry="7" fill="' + lc + '"/><circle cx="144" cy="48" r="1.6" fill="#222"/></g>' +
      '<rect x="32" y="110" width="7" height="38" rx="3" fill="#3b3e46"/><rect x="44" y="110" width="7" height="38" rx="3" fill="#3b3e46"/>' +
      '<path d="M24 74 L58 74 L66 116 L16 116Z" fill="#e2782f"/><path d="M20 98 L62 98 M18 106 L64 106" stroke="#2b8fc9" stroke-width="3"/><path d="M40 74 L41 116" stroke="#f2c14e" stroke-width="3"/>' +
      '<circle cx="41" cy="60" r="11" fill="' + s + '"/><circle cx="38" cy="61" r="1.3" fill="#222"/><circle cx="45" cy="61" r="1.3" fill="#222"/><path d="M38 66 q3 2 6 0" stroke="#222" stroke-width="1.1" fill="none"/>' +
      '<path d="M29 58 Q30 44 41 43 Q52 44 53 58Z" fill="#c8323c"/><path d="M30 56 L27 72 L34 68Z M52 56 L55 72 L48 68Z" fill="#c8323c"/><path d="M31 51 H51" stroke="#f2c14e" stroke-width="2.5" stroke-dasharray="3 2"/><circle cx="41" cy="41" r="3.5" fill="#2b8fc9"/>' +
      '<path d="M58 88 Q96 70 132 54" stroke="#6e4524" stroke-width="1.4" fill="none"/></g></svg>';
  }
  // safari: cada uno por su cuenta (jirafa, león y jeep), mirando a la derecha
  function giraffe() {
    var c = '#e8b04a', sp = '';
    [[34, 78], [44, 84], [52, 76], [40, 90], [58, 64], [61, 50], [64, 38]].forEach(function (q) { sp += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="2.6" fill="#b06a24"/>'; });
    return '<svg class="pj-fig" viewBox="0 0 90 150" width="81" height="135" aria-hidden="true"><g class="pj-all">' +
      '<g class="pj-lga"><path d="M30 92 L28 142 M54 92 L56 142" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/></g><g class="pj-lgb"><path d="M38 92 L40 142 M48 92 L46 142" stroke="#d29a3a" stroke-width="5" stroke-linecap="round"/></g>' +
      '<path d="M24 82 Q16 88 18 100" stroke="' + c + '" stroke-width="2" fill="none"/><ellipse cx="42" cy="84" rx="20" ry="11" fill="' + c + '"/>' +
      '<g class="pj-neck2"><path d="M55 80 L66 28" stroke="' + c + '" stroke-width="9" stroke-linecap="round"/><ellipse cx="72" cy="24" rx="10" ry="5.5" fill="' + c + '" transform="rotate(-14 72 24)"/>' +
      '<path d="M66 19 l-1 -7 M71 18 l0 -7" stroke="#b06a24" stroke-width="2.4" stroke-linecap="round"/><circle cx="73" cy="22" r="1.4" fill="#222"/></g>' + sp + '</g></svg>';
  }
  function lion() {
    var c = '#d9a441';
    return '<svg class="pj-fig" viewBox="0 0 120 80" width="108" height="72" aria-hidden="true"><g class="pj-all">' +
      '<path class="pj-tail" d="M18 40 Q4 34 6 22" stroke="' + c + '" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="6" cy="21" r="3.5" fill="#8a4a1a"/>' +
      '<g class="pj-lga"><path d="M26 50 L24 74 M78 50 L80 74" stroke="#c8913a" stroke-width="7" stroke-linecap="round"/></g><g class="pj-lgb"><path d="M36 52 L38 74 M70 52 L68 74" stroke="' + c + '" stroke-width="7" stroke-linecap="round"/></g>' +
      '<ellipse cx="52" cy="46" rx="34" ry="14" fill="' + c + '"/>' +
      '<g class="pj-lhd"><circle cx="90" cy="32" r="17" fill="#a8642a"/><circle cx="93" cy="34" r="10.5" fill="#e2b25a"/><circle cx="90" cy="31" r="1.5" fill="#222"/><circle cx="98" cy="31" r="1.5" fill="#222"/>' +
      '<ellipse cx="96" cy="37" rx="2.5" ry="1.8" fill="#6b3a1a"/><path class="pj-roar" d="M92 41 Q96 47 100 41 Z" fill="#7a2a2a" opacity="0"/><path d="M92 40.5 Q96 43 100 40.5" stroke="#6b3a1a" stroke-width="1.2" fill="none"/></g></g></svg>';
  }
  function jeep() {
    var s = pick(SKIN), wh = function (x) { return '<g class="pj-wheel" style="transform-origin:' + x + 'px 74px"><circle cx="' + x + '" cy="74" r="11" fill="#2a2a2e"/><circle cx="' + x + '" cy="74" r="4" fill="#aaa"/><rect x="' + (x - 1.5) + '" y="64" width="3" height="20" fill="#555"/></g>'; };
    return '<svg class="pj-fig" viewBox="0 0 140 90" width="126" height="81" aria-hidden="true"><g class="pj-all">' +
      '<rect x="6" y="46" width="10" height="20" rx="3" fill="#555"/><rect x="12" y="44" width="116" height="26" rx="7" fill="#6b7d3a"/><path d="M30 44 L40 22 L92 22 L104 44 Z" fill="#7f9147"/><rect x="48" y="26" width="38" height="16" rx="3" fill="#bfe0f2"/>' +
      '<circle cx="66" cy="16" r="9" fill="' + s + '"/><ellipse cx="66" cy="9" rx="13" ry="3.5" fill="#c9b37a"/><path d="M58 9 Q66 -3 74 9Z" fill="#c9b37a"/><rect class="pj-bino" x="61" y="13" width="13" height="5" rx="2" fill="#2a2a2e"/>' +
      '<rect x="12" y="56" width="116" height="4" fill="#5a6a2f"/><circle cx="124" cy="52" r="3" fill="#fff6c8"/>' + wh(36) + wh(106) + '</g></svg>';
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
    var F = { gondola: gondola, camel: camel, tuktuk: tuktuk, bike: bike, hotair: hotair, roo: roo, llama: llama, giraffe: giraffe, lion: lion, jeep: jeep }[K.vehicle];
    if (F) return F();
    if (K.vehicle === 'plane') return plane();
    var c = K.body, heads = function (xs, y) { return xs.map(function (x) { return '<circle cx="' + x + '" cy="' + y + '" r="8" fill="' + pick(SKIN) + '"/><path d="M' + (x - 8) + ' ' + (y - 1) + ' Q' + x + ' ' + (y - 12) + ' ' + (x + 8) + ' ' + (y - 1) + '" fill="' + pick(HAIR) + '"/><circle cx="' + (x + 3) + '" cy="' + (y + 1) + '" r="1.3" fill="#222"/>'; }).join(''); };
    if (K.vehicle === 'car') return '<svg class="pj-fig pj-car" viewBox="0 0 150 90" width="150" height="90" aria-hidden="true"><g class="pj-all">' +
      (K.taxi ? '<rect x="58" y="2" width="30" height="10" rx="2" fill="#f7f3ec"/><text x="73" y="10" font-size="7.5" text-anchor="middle" font-family="-apple-system,system-ui,sans-serif" font-weight="800" fill="#1f2126">TAXI</text><path d="M12 47 H138" stroke="#1f2126" stroke-width="4" stroke-dasharray="5 5"/>' : '') +
      (K.lug ? '<g class="pj-lug"><path d="M38 13 L104 13" stroke="#333" stroke-width="2.5"/><rect x="42" y="-1" width="28" height="14" rx="3" fill="#e8574a"/><rect x="72" y="1" width="24" height="12" rx="3" fill="#2f8f5b"/><rect x="54" y="-12" width="22" height="12" rx="3" fill="#f2c14e"/><path d="M56 -1 L56 13 M88 1 L88 13" stroke="#000" stroke-opacity=".2" stroke-width="2"/></g>' : '') +
      '<path d="M30 32 Q38 12 70 12 Q98 12 108 32 Z" fill="' + shade(c, 10) + '"/><path d="M40 31 Q46 18 66 18 L66 31 Z M72 18 Q94 18 100 31 L72 31 Z" fill="#bfe0f2"/>' + heads([56, 86], 27) +
      '<rect x="10" y="30" width="130" height="34" rx="14" fill="' + c + '"/><rect x="10" y="30" width="130" height="34" rx="14" fill="url(#pjCarSh)"/><circle cx="133" cy="42" r="4" fill="#fff6c8"/><rect x="12" y="42" width="6" height="6" rx="2" fill="#e8574a"/>' +
      '<defs><linearGradient id="pjCarSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>' +
      '<g class="pj-wheel" style="transform-origin:42px 66px"><circle cx="42" cy="66" r="13" fill="#2a2a2e"/><circle cx="42" cy="66" r="5" fill="#bbb"/><rect x="40.5" y="55" width="3" height="22" fill="#555"/></g>' +
      '<g class="pj-wheel" style="transform-origin:110px 66px"><circle cx="110" cy="66" r="13" fill="#2a2a2e"/><circle cx="110" cy="66" r="5" fill="#bbb"/><rect x="108.5" y="55" width="3" height="22" fill="#555"/></g></g></svg>';
    return '<svg class="pj-fig pj-car" viewBox="0 0 190 100" width="180" height="95" aria-hidden="true"><g class="pj-all">' +
      (K.deck2 ? '<rect x="8" y="-34" width="174" height="58" rx="12" fill="' + c + '"/>' + [20, 62, 104, 146].map(function (x) { return '<rect x="' + x + '" y="-26" width="' + (x === 146 ? 28 : 34) + '" height="20" rx="4" fill="#bfe0f2"/>'; }).join('') + heads([37, 121], -14) : '<line x1="95" y1="2" x2="80" y2="16" stroke="#333" stroke-width="2"/>') + '<rect x="8" y="16" width="174" height="62" rx="12" fill="' + c + '"/><rect x="8" y="58" width="174" height="8" fill="#f7f3ec" opacity=".85"/>' +
      '<rect x="20" y="24" width="34" height="26" rx="5" fill="#bfe0f2"/><rect x="62" y="24" width="34" height="26" rx="5" fill="#bfe0f2"/><rect x="104" y="24" width="34" height="26" rx="5" fill="#bfe0f2"/><rect x="146" y="24" width="28" height="40" rx="5" fill="#8fc4df"/>' +
      heads([37, 79, 121], 42) + '<circle cx="176" cy="70" r="3.5" fill="#fff6c8"/>' +
      '<g class="pj-wheel" style="transform-origin:42px 82px"><circle cx="42" cy="82" r="11" fill="#2a2a2e"/><circle cx="42" cy="82" r="4" fill="#bbb"/><rect x="40.5" y="72" width="3" height="20" fill="#555"/></g>' +
      '<g class="pj-wheel" style="transform-origin:148px 82px"><circle cx="148" cy="82" r="11" fill="#2a2a2e"/><circle cx="148" cy="82" r="4" fill="#bbb"/><rect x="146.5" y="72" width="3" height="20" fill="#555"/></g></g></svg>';
  }

  /* ---------- Efectos alrededor (nieve, sol, lluvia…) ---------- */
  function fx(kind, L, K) {
    var n = { snow: 26, rain: 34, confetti: 40, food: 12, notes: 9, petals: 24 }[kind] || 0, h = '', foods = K && K.food ? Array.from(K.food) : [];
    for (var i = 0; i < n; i++) {
      var st = 'left:' + rnd(0, 100).toFixed(1) + '%;--t:' + rnd(kind === 'rain' ? .5 : 2.2, kind === 'rain' ? .9 : 4).toFixed(2) + 's;--dl:' + rnd(0, 1.5).toFixed(2) + 's;--s:' + rnd(.6, 1.3).toFixed(2) + ';--x:' + rnd(-40, 40).toFixed(0) + 'px';
      if (kind === 'confetti') st += ';background:' + pick(['#e2782f', '#2f8f5b', '#2b8fc9', '#f2c14e', '#e8574a', '#8f7fc4']);
      h += '<i class="pj-p ' + kind + '" style="' + st + '">' + (kind === 'food' ? pick(foods) : kind === 'notes' ? pick(['♪', '♫', '♬']) : '') + '</i>';
    }
    if (kind === 'sun') h = '<i class="pj-sun"></i>';
    if (kind === 'sunrise') h = '<i class="pj-sun rise"></i>';
    if (kind === 'aurora') h = '<i class="pj-aur"></i><i class="pj-aur b"></i>';
    if (kind === 'birds') h = '<i class="pj-bird" style="top:16%;--dl:0s">︶︶</i><i class="pj-bird" style="top:22%;--dl:.5s">︶︶</i>';
    if (!h) return null;
    var e = document.createElement('div'); e.className = 'pj-fx'; e.innerHTML = h; L.appendChild(e);
    return e;
  }

  /* ---------- La escena ----------
     Entradas: cae, baja en paracaídas, entra andando o asoma desde abajo (los vehículos llegan rodando).
     Salidas: por una trampilla en el suelo, encima de la palabra elegida; si no hay, se va andando o colgado de globos. */
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
  function bubble(run, wrap, txt, ms) {
    if (!txt) return Promise.resolve();
    var b = document.createElement('span'); b.className = 'pj-say'; b.textContent = txt; wrap.appendChild(b);
    return wait(ms || 1500, run).then(function () { b.classList.add('out'); });
  }
  function ground() {
    var f = document.querySelector('#wz:not([hidden]) .wz-foot'), y = f ? f.getBoundingClientRect().top - 6 : window.innerHeight - 110;
    return Math.min(y, window.innerHeight - 30);
  }
  // la palabra sobre la que se abre la trampilla: el título de la opción elegida (o el propio elemento)
  function wordAt(t) {
    var el = typeof t === 'function' ? t() : t; if (!el || !el.getBoundingClientRect) return null;
    var wd = (el.querySelector && el.querySelector('.wz-cb b, .wz-cm b, .wz-gh b, b, span')) || el, r = null;
    try { var rg = document.createRange(); rg.selectNodeContents(wd); var rs = rg.getClientRects(); r = rs.length ? rs[0] : null; } catch (e) {}
    if (!r || !r.width) r = wd.getBoundingClientRect();
    var vh = window.innerHeight; if (!r.width || r.bottom < 90 || r.top > vh - 130) return null;
    var w = Math.min(r.width, 200);
    return { cx: Math.max(50, Math.min(window.innerWidth - 50, r.left + w / 2)), y: Math.round(r.bottom + 1) };
  }
  // trampilla de madera tumbada en el suelo: se levanta, deja el hueco, y se vuelve a cerrar
  function trap(at, width) {
    var h = document.createElement('div'); h.className = 'pj-trap';
    h.style.cssText = 'left:' + Math.round(at.cx - width / 2) + 'px;top:' + (at.y - 7) + 'px;width:' + Math.round(width) + 'px';
    h.innerHTML = '<i class="pj-th"></i><i class="pj-tl"></i><i class="pj-dust"></i>';
    lay().insertBefore(h, lay().firstChild);
    return h;
  }
  var SZ = { car: [150, 90], tram: [180, 95], isle: [177, 118], savanna: [186, 118], plane: [170, 80], gondola: [190, 112], camel: [160, 120], tuktuk: [140, 96], bike: [130, 113], hotair: [100, 142], roo: [100, 108], llama: [150, 141], giraffe: [81, 135], lion: [108, 72], jeep: [126, 81] };
  function sizeOf(K) { return K.vehicle ? SZ[K.vehicle] || [150, 90] : [96, 163]; }
  function at(x, y, extra) { return 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)' + (extra || ''); }
  // ir hasta la palabra, abrir la trampilla, hundirse y cerrarla
  function intoTrap(run, wrap, w, hgt, pos, o, veh) {
    var A = wordAt(o.target); if (!A) return null;
    var tx = A.cx - w / 2, ty = A.y - hgt, d = Math.hypot(tx - pos.x, ty - pos.y), H = trap(A, veh ? w * .8 : 86);
    run.els.push(H);
    wrap.classList.add(veh ? 'drive' : 'walk'); if (tx < pos.x) wrap.classList.add('left'); else wrap.classList.remove('left');
    return anim(wrap, [{ transform: at(pos.x, pos.y) }, { transform: at(tx, ty) }], { duration: Math.max(700, Math.min(1700, d * 4.5)), easing: 'ease-in-out', fill: 'forwards' }).then(function () {
      if (run.dead) return;
      wrap.classList.remove('walk', 'drive'); H.classList.add('open'); wrap.classList.add('peek');
      return wait(450, run);
    }).then(function () {
      if (run.dead) return;
      // un saltito y abajo: lo que pasa del suelo no se ve
      wrap.classList.remove('peek'); wrap.classList.add('dive');
      return anim(wrap, [{ transform: at(tx, ty) }, { transform: at(tx, ty - 22), offset: .35 }, { transform: at(tx, ty) }], { duration: 380, easing: 'ease-out', fill: 'forwards' });
    }).then(function () {
      if (run.dead) return;
      return anim(wrap, [{ transform: at(tx, ty), clipPath: 'inset(-80px -80px 0px -80px)' }, { transform: at(tx, ty + hgt), clipPath: 'inset(-80px -80px ' + hgt + 'px -80px)' }], { duration: 520, easing: 'cubic-bezier(.5,0,.8,.6)', fill: 'forwards' });
    }).then(function () {
      if (run.dead) return;
      wrap.style.opacity = 0; H.classList.remove('open'); H.classList.add('shut');
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
      return wait(900, run);
    });
  }
  function enterAs(run, wrap, kind, K, pos, w, hgt, o) {
    var W = window.innerWidth, how = o.enter || K.enter || (K.vehicle ? 'drive' : pick(['fall', 'fall', 'chute', 'walk', 'pop'])), side = null;
    if (/^walk-/.test(how)) { side = how.slice(5); how = 'walk'; }
    if (how === 'drive' || how === 'walk') {
      var fromR = side ? side === 'right' : K.from === 'right' || (how === 'walk' && Math.random() < .5), x0 = fromR ? W + 20 : -w - 20;
      wrap.classList.add(how === 'walk' ? 'walk' : 'drive'); if (fromR) wrap.classList.add('left');
      return anim(wrap, [{ transform: at(x0, pos.y) }, { transform: at(pos.x, pos.y) }], { duration: how === 'walk' ? 1600 : 1300, easing: how === 'walk' ? 'linear' : 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' })
        .then(function () { wrap.classList.remove('walk', 'drive'); if (!K.animal) wrap.classList.remove('left'); });
    }
    if (how === 'rise') return anim(wrap, [{ transform: at(pos.x, window.innerHeight + 20) }, { transform: at(pos.x, pos.y) }], { duration: 2000, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    if (how === 'pop') {
      wrap.classList.add('fall');
      return anim(wrap, [{ transform: at(pos.x, window.innerHeight + 10) }, { transform: at(pos.x, pos.y - 70), offset: .55 }, { transform: at(pos.x, pos.y) }], { duration: 900, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards' })
        .then(function () { wrap.classList.remove('fall'); wrap.classList.add('land'); return wait(260, run); }).then(function () { wrap.classList.remove('land'); });
    }
    if (how === 'chute') {
      var ch = document.createElement('span'); ch.className = 'pj-chute';
      ch.innerHTML = '<svg viewBox="0 0 130 90"><path d="M8 44 Q65 -18 122 44 Q108 36 94 44 Q80 36 65 44 Q50 36 36 44 Q22 36 8 44Z" fill="' + pick(['#e8574a', '#2b8fc9', '#f2c14e', '#2f8f5b']) + '"/><path d="M36 44 Q50 4 65 2 M94 44 Q80 4 65 2" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/><path d="M8 44 L52 90 M36 44 L56 90 M94 44 L74 90 M122 44 L78 90" stroke="#555" stroke-width="1"/></svg>';
      wrap.appendChild(ch); wrap.classList.add('fall');
      return anim(wrap, [{ transform: at(pos.x - 40, -hgt - 140, ' rotate(10deg)') }, { transform: at(pos.x + 20, pos.y * .45, ' rotate(-8deg)'), offset: .45 }, { transform: at(pos.x - 8, pos.y * .8, ' rotate(5deg)'), offset: .8 }, { transform: at(pos.x, pos.y, ' rotate(0deg)') }], { duration: 2800, easing: 'ease-in-out', fill: 'forwards' })
        .then(function () { wrap.classList.remove('fall'); ch.classList.add('gone'); wrap.classList.add('land'); return wait(260, run); }).then(function () { wrap.classList.remove('land'); setTimeout(function () { ch.remove(); }, 500); });
    }
    // caer desde arriba
    wrap.classList.add('fall');
    return anim(wrap, [{ transform: at(pos.x, -hgt - 40, ' rotate(-14deg)') }, { transform: at(pos.x, pos.y, ' rotate(0deg)'), offset: .78 }, { transform: at(pos.x, pos.y - 18), offset: .9 }, { transform: at(pos.x, pos.y) }], { duration: 1000, easing: 'cubic-bezier(.45,0,.6,1)', fill: 'forwards' })
      .then(function () { wrap.classList.remove('fall'); wrap.classList.add('land'); return wait(260, run); }).then(function () { wrap.classList.remove('land'); });
  }
  function leave(run, wrap, K, pos, w, hgt, o) {
    var veh = !!K.vehicle, W = window.innerWidth;
    var t = o.target ? intoTrap(run, wrap, w, hgt, pos, o, veh) : null; if (t) return t;
    if (K.vehicle === 'hotair') return anim(wrap, [{ transform: at(pos.x, pos.y) }, { transform: at(pos.x + 40, -hgt - 60) }], { duration: 2400, easing: 'ease-in', fill: 'forwards' });
    if (!veh && Math.random() < .4) {
      // se va colgado de unos globos
      var b = document.createElement('span'); b.className = 'pj-lift';
      b.innerHTML = '<svg viewBox="0 0 70 110"><path d="M35 108 L20 40 M35 108 L36 30 M35 108 L52 44" stroke="#666" stroke-width="1"/><ellipse cx="20" cy="30" rx="13" ry="16" fill="#e8574a"/><ellipse cx="38" cy="20" rx="13" ry="16" fill="#f2c14e"/><ellipse cx="54" cy="34" rx="12" ry="15" fill="#2b8fc9"/></svg>';
      wrap.appendChild(b); wrap.classList.add('lift');
      return wait(500, run).then(function () { return anim(wrap, [{ transform: at(pos.x, pos.y) }, { transform: at(pos.x + 30, pos.y - 40, ' rotate(-4deg)'), offset: .3 }, { transform: at(pos.x - 20, -hgt - 160, ' rotate(5deg)') }], { duration: 2600, easing: 'ease-in', fill: 'forwards' }); });
    }
    var out = pos.x > W / 2 ? W + 20 : -w - 20;
    wrap.classList.add(veh ? 'drive' : 'walk'); if (out < pos.x) wrap.classList.add('left');
    return anim(wrap, [{ transform: at(pos.x, pos.y) }, { transform: at(out, pos.y) }], { duration: 1500, easing: 'ease-in', fill: 'forwards' });
  }
  function build(kind, K) {
    var wrap = document.createElement('div'); wrap.className = 'pj pj-' + kind + (K.vehicle ? ' pj-veh' : '');
    wrap.innerHTML = (K.vehicle ? vehicle(K) : person(K, Math.random().toString(36).slice(2, 7))) + '<span class="pj-shadow"></span>';
    return wrap;
  }
  var lastAt = 0;
  // a veces sí y a veces no, y nunca uno detrás de otro
  function maybe(kind, o, p) { if (!kind || Math.random() > (p == null ? .6 : p) || Date.now() - lastAt < 6500) return; play(kind, o); }
  function play(kind, o) {
    o = o || {};
    var K = KINDS[kind]; if (!K || off() || reduced()) return;
    if (K.group) return playGroup(K, o);
    stop(); lastAt = Date.now();
    var run = { t: [], els: [], dead: false }; cur = run;
    var L = lay(), W = window.innerWidth, gy = o.ground || ground(), sz = sizeOf(K), w = sz[0], hgt = sz[1];
    var wrap = build(kind, K); L.appendChild(wrap); run.els.push(wrap);
    var pos = { x: o.x != null ? o.x : Math.round(rnd(.16, .6) * (W - w)), y: gy - hgt };
    var F = K.fx ? fx(K.fx, L, K) : null; if (F) run.els.push(F);
    enterAs(run, wrap, kind, K, pos, w, hgt, o).then(function () {
      if (run.dead) return;
      if (K.idle) wrap.classList.add('act-' + K.idle);
      bubble(run, wrap, K.say ? (en() ? K.say[1] : K.say[0]) : '');
      return wait(K.vehicle ? (K.long ? 2400 : 1100) : 1700, run);
    }).then(function () {
      if (run.dead) return;
      if (K.idle) wrap.classList.remove('act-' + K.idle);
      if (K.gear && K.gear !== 'map' && K.gear !== 'pack') { wrap.classList.add('gear'); return wait(900, run); }
    }).then(function () { if (!run.dead) return leave(run, wrap, K, pos, w, hgt, o); })
      .then(function () { return run.dead ? null : wait(300, run); }).then(function () { if (cur === run) stop(); });
  }
  // varios a la vez, cada uno por su lado (el safari: león, jirafa y jeep)
  function playGroup(G, o) {
    stop(); lastAt = Date.now();
    var run = { t: [], els: [], dead: false }; cur = run;
    var L = lay(), W = window.innerWidth, gy = o.ground || ground(), F = G.fx ? fx(G.fx, L, G) : null; if (F) run.els.push(F);
    var n = G.group.length, ms = G.group.map(function (k, i) {
      var K = KINDS[k], sz = sizeOf(K), wrap = build(k, K); L.appendChild(wrap); run.els.push(wrap);
      var x = Math.round(Math.max(4, Math.min(W - sz[0] - 4, (W / n) * i + (W / n - sz[0]) / 2)));
      return { k: k, K: K, wrap: wrap, w: sz[0], h: sz[1], pos: { x: x, y: gy - sz[1] } };
    });
    var all = ms.map(function (m, i) {
      return wait(i * 650, run).then(function () { if (!run.dead) return enterAs(run, m.wrap, m.k, m.K, m.pos, m.w, m.h, { enter: m.K.vehicle === 'jeep' ? 'drive' : 'walk-' + (m.K.from || 'left') }); })
        .then(function () {
          if (run.dead) return;
          if (m.K.idle) m.wrap.classList.add('act-' + m.K.idle);
          return bubble(run, m.wrap, m.K.say ? (en() ? m.K.say[1] : m.K.say[0]) : '', 1400);
        });
    });
    Promise.all(all).then(function () { return run.dead ? null : wait(900, run); }).then(function () {
      if (run.dead) return;
      // se van por separado; el último (el jeep) por la trampilla, si hay palabra
      return Promise.all(ms.map(function (m, i) {
        m.wrap.classList.remove('act-' + m.K.idle);
        return wait(i * 300, run).then(function () { return run.dead ? null : leave(run, m.wrap, m.K, m.pos, m.w, m.h, i === n - 1 ? o : {}); });
      }));
    }).then(function () { return run.dead ? null : wait(300, run); }).then(function () { if (cur === run) stop(); });
  }

  // un personaje quieto que repite su gesto (para la bienvenida)
  function figure(kind) {
    var K = KINDS[kind] || KINDS.maleta; if (K.group) K = KINDS[K.still || 'monte'];
    var e = document.createElement('div');
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
    var A = { el: null, cur: '', look: { skin: pick(SKIN), hair: pick(HAIR) }, base: KINDS[base] && !KINDS[base].vehicle && !KINDS[base].group ? base : base === 'isla' ? 'playa' : base === 'safari' ? 'monte' : 'pie' };
    function build(kind) {
      var K = KINDS[kind], P = {}; if (K.group) { kind = K.still; K = KINDS[kind]; }
      for (var k in K) P[k] = K[k];
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
  var CULT = { IT: ['gondola', 'pizza'], FR: ['paris'], JP: ['japon'], MX: ['mexico'], ES: ['flamenco'], PT: ['tranvia'], GB: ['londres'], NL: ['bici'], DK: ['bici'],
    EG: ['camello'], MA: ['camello'], JO: ['camello'], AE: ['camello'], TN: ['camello'], TH: ['tuktuk'], IN: ['tuktuk'], LK: ['tuktuk'], KH: ['tuktuk'], US: ['taxi'], TR: ['globos'],
    AU: ['canguro'], PE: ['andes'], BO: ['andes'], EC: ['andes'], CH: ['esqui:w'], AT: ['esqui:w'], NO: ['aurora:w'], IS: ['aurora:w'], FI: ['aurora:w'], SE: ['aurora:w'] };
  // lo típico del país; «:w» solo en invierno (esquí, auroras)
  function culture(cc, iso) {
    var m = iso ? +String(iso).slice(5, 7) : new Date().getMonth() + 1, win = m >= 11 || m <= 3;
    var l = (CULT[cc] || []).filter(function (k) { return !/:w$/.test(k) || win; }).map(function (k) { return k.replace(/:w$/, ''); });
    return l.length ? pick(l) : '';
  }
  function forPlace(ccs, iso) { var c = culture((ccs || [])[0], iso); return c && Math.random() < .65 ? c : theme(ccs, iso); }
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

  return { play: play, maybe: maybe, stop: stop, figure: figure, cast: cast, journey: journey, theme: theme, culture: culture, forPlace: forPlace, kinds: Object.keys(KINDS), enabled: function () { return !off() && !reduced(); } };
})();
