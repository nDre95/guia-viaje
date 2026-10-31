/* ===== Idiomas: textos de la interfaz (ES / EN) ===== */
var I18N = (function () {
  'use strict';
  var S = {
    es: {
      app: 'Guía {dest}', now: 'ahora', pinned: 'Fijada', day: 'Día', tabPrep: 'Inicio', tabTrip: 'Resumen', mapHint: 'mueve la bolita',
      islCount: 'Faltan {0} días', islDone: 'Viaje terminado', islPre: 'Día {0} · empieza a las {1}', payMe: 'Viajero 1', payYou: 'Viajero 2', payBy: 'Pagó {0} (toca para cambiar)', payName: 'Nombre {0}', payPaid: 'Pagado por {0}', splitT: 'Cuentas a medias', splitEven: 'Estáis en paz.', splitOwes: '{0} debe a {1}', splitHow: 'Toca la inicial de cada gasto para cambiar quién lo pagó. Todo se reparte a medias.', gDocs: 'Reservas y billetes', docsN: '{0} archivos guardados', docsN1: '1 archivo guardado', docsSub: 'Entradas, embarques, coche', docsT: 'Tus reservas', docsNote: 'PDF o capturas de entradas, tarjetas de embarque, el alquiler del coche… Se guardan en este móvil y se abren sin conexión. No van en la copia de seguridad.', docAdd: 'Añadir archivo', docsEmpty: 'Aún no has guardado nada.', docDel: 'Borrar', docDelQ: '¿Borrar este archivo del móvil?', docBig: '«{0}» pesa más de 25 MB', docAdded: 'Guardado ({0})', docFail: 'No se pudo guardar el archivo', gData: 'Copia, calendario y mapas', gDataSub: 'Copia de seguridad', gDataSub2: 'Calendario · mapas sin conexión', bkT: 'Copia de seguridad', bkNote: 'Guarda en un archivo lo que has marcado y apuntado (tareas, hoteles, gastos, cambios del plan). Sirve para no perderlo o para pasárselo a tu acompañante por WhatsApp.', bkExp: 'Guardar copia', bkImp: 'Cargar copia', bkBad: 'Ese archivo no es una copia de la guía', bkOther: 'La copia es de otro viaje ({0}). ¿Cargarla igualmente?', bkSure: 'Se sustituirá lo apuntado en este móvil por la copia del {0}. ¿Seguir?', calT: 'Todo el viaje en tu calendario', calNote: 'Crea un archivo de calendario con cada actividad, su sitio y un aviso 15 min antes. Al abrirlo en el iPhone se añade al Calendario. Si cambias el plan, vuelve a crearlo.', calBtn: 'Añadir al calendario', calDone: '{0} actividades en el archivo', calDoneB: 'Ábrelo para añadirlas al Calendario.', omT: 'Mapas sin conexión', omNote: 'En las Highlands falla la cobertura. Antes de salir, con wifi: abre cada día en Google Maps, toca tu foto → «Mapas sin conexión» → «Selecciona tu propio mapa» y descarga la zona.', cromoAdd: 'Pegar cromo', cromoGot: 'Cromo pegado', cromoDone: '¡Cromo de {0}!', cromoDoneB: '{0} de {1} cromos de este viaje. Toca para ver tu álbum.', albT: 'Mi álbum', albSub: '{0} de {1} cromos', albSub2: 'Visor 3D, postal y perfil', albTabA: 'Álbum', albTabP: 'Perfil', albHint: 'Cada sitio que visitas es un cromo. Toca uno para verlo en 3D y pegarlo. ★ = imprescindible.', albCopyNote: 'Guarda tus cromos en un archivo para pasarlos a otro móvil o a la app web.', cromoAsk: '¿Has visto {0}?', cromoAskB: 'Toca para pegar el cromo en tu álbum.', viewT: 'Vista del itinerario', viewFull: 'Fotos', viewList: 'Lista', nowBtn: 'Ahora', myTrips: 'Viajes', themeT: 'Tema', theme_auto: 'Automático (como el iPhone)', theme_dark: 'Oscuro', theme_light: 'Claro', islDefault: '{title}', loading: 'Cargando…', live: 'Hora real', manual: 'Manual', scotTime: 'Hora de {dest}',
      left: 'quedan {0}', nextAt: 'Siguiente · {0}', dayDone: 'Día {0} terminado', rest: 'Descansa, mañana más', from: 'desde {0}',
      freeTime: 'Tiempo libre', endOfDay: 'Fin del día', upNext: 'Lo siguiente: {0}', tomorrow: 'Mañana más.', next: 'Siguiente', nothingMore: 'Nada más hoy',
      setTime: 'Hora', seeInGuide: 'Ver en la guía', sync: 'Sincronizar', close: 'Cerrar',
      sNight: 'Noche', sRiseAt: 'Amanece {0}', sDawn: 'Amanecer', sAt: 'A las {0}', sLight: 'Luz', sUntil: 'Hasta las {0}', sGolden: 'Golden hour', sSetAt: 'Puesta {0}', sTwilight: 'Crepúsculo', sDarkAt: 'Noche {0}',
      nAt: 'A las {0}', nLeft: 'Quedan {0}', nThen: ' · luego {0}', nNextAt: 'Siguiente: {0} a las {1}', nInMin: 'En {0} min: {1}', nGo: 'Toca salir. Ruta lista en el mapa.',
      nGoldIn: 'Golden hour en {0} min', nGoldBody: 'Puesta de sol a las {0}. Busca el mirador.', nLow: 'Queda poca luz', nLowBody: '{0}: el sol se pone a las {1}.',
      nDayOn: 'Día {0} en marcha', nNowIs: 'Ahora: {0}. ', nSunsetAt: 'Puesta de sol a las {0}.', nDaysLeft: 'Faltan {0} días para {dest}',
      nDaysLeftBody: 'La guía sigue la hora de tu móvil. Arrastra la columna de horas del itinerario para ver otro momento.',
      nPickDate: 'Elige la fecha del viaje', nPickDateBody: 'Cambia la fecha del día 1 en «Preparar» para recalcular el sol.',
      nImp: '{0} imprescindibles sin marcar', nImpBody: 'Pasaporte, ETA, carnet… Toca para ver la lista.', nReset: 'Lista reiniciada',
      nCatDone: '{0}: listo', nAllDone: 'Todo preparado.', nItemsLeft: 'Quedan {0} cosas en la lista.',
      nDates: 'Fechas actualizadas', nDatesBody: '{0} → {1} · puesta de sol {2} el día 1 · {3}', nWarnN: '{0} aviso(s) de luz', nNoWarn: 'sin avisos de luz',
      nReplan: 'Plan recalculado', nReplanBody: 'Día {0}: terminas sobre las {1}{2}', nAllLight: ' · todo con luz',
      nSynced: 'Sincronizado con la hora real', nSyncedBody: 'Hora de tu móvil: {0}', scotNow: 'en {dest} {0}', phoneNow: 'Hora de tu móvil', nManual: 'Modo manual', nManualBody: 'Día {0} a las {1}. Toca «Sincronizar» para volver a la hora real.',
      nLang: 'Idioma: español', nLangBody: 'Toda la guía está ahora en español.',
      wxEarly: 'Aún es pronto', wxEarlyBody: 'La previsión aparece unos 15 días antes del viaje.', wxOffline: 'Sin conexión', wxOfflineBody: 'Se muestra la última previsión guardada.',
      wxFail: 'No se pudo actualizar', wxFailBody: 'Prueba más tarde. Se mantiene lo último guardado.', wxUpdated: 'Previsión actualizada',
      wxRisky: 'Hay riesgo de hielo, nieve o viento algún día.', wxSafe: 'Sin riesgos especiales en carretera.', wxAlert: 'Ojo con las carreteras',
      wxAlertBody: 'Riesgo de hielo, nieve o viento algún día. Mira «El tiempo y las carreteras».',
      wxNoteOk: 'Previsión de Open-Meteo, actualizada {0}. Las carreteras se estiman con temperatura, nieve y viento: confírmalo en {roads}.',
      wxLtHour: 'hace menos de una hora', wxHours: 'hace {0} h',
      wxNoteEarly: 'La previsión real aparece unos 15 días antes del viaje (a partir del {0}). Mientras, ves el clima típico.',
      wxNoteNone: 'Sin previsión guardada: toca «Actualizar» cuando tengas conexión. Confirma siempre las carreteras en {roads}.',
      wxNoteDefault: 'La previsión real aparece unos 15 días antes del viaje. El estado de las carreteras se estima con la temperatura, la nieve y el viento: confírmalo siempre en {roads}.',
      wxEyebrow: 'El tiempo y las carreteras', wxTitle: 'Previsión del viaje', wxRefresh: 'Actualizar',
      wxC: ['Sin datos', 'Despejado', 'Sol y nubes', 'Nublado', 'Niebla', 'Llovizna', 'Lluvia', 'Nieve', 'Chubascos', 'Chubascos de nieve', 'Tormenta', 'Variable'],
      wxRain: 'lluvia {0} %', wxGusts: 'rachas {0} km/h', rSnow: 'Nieve: {0} cm', rIce: 'Riesgo de hielo', rGust: 'Rachas de {0} km/h', rFog: 'Niebla', rRain: 'Lluvia intensa',
      rNone: 'Sin riesgos previstos en carretera', wxTypical: 'Clima típico de invierno (aprox.)', wxNone: 'Sin previsión todavía', wxPassSnow: 'Nieve o hielo posibles en el puerto',
      wxCityRain: 'Lluvia frecuente', wxMiniTyp: 'Clima típico: <b>≈ {0}° / {1}°</b> en {2}',
      nojsTitle: 'Estás viendo la versión estática',
      nojs1: 'Esta vista (Archivos, Mail, WhatsApp…) no ejecuta JavaScript. Ves todo el contenido, pero sin notificaciones, slider ni recálculo de horarios.',
      nojs2: 'Horas de sol calculadas para el día 1 = <b>{0}</b>.',
      nojs3: 'Para la versión completa, ábrela desde una URL en Safari (por ejemplo, subida a Netlify Drop) y añádela a la pantalla de inicio.',
      coverEyebrow: 'Guía de viaje · {ndays} días', coverTitle: '{dest}', coverSub: '{0} – {1}', coverAria: '{dest}',
      theRoute: 'La ruta', routeHint: 'Toca un punto para ver el resumen', kmByCar: 'km en coche', castles: 'castillos', lightPerDay: 'de luz al día',
      date1: 'Fecha del día 1', recalc: 'Recalcula sol y horarios', sunsetW: 'Puesta', mustSee: 'No te lo pierdas', seeInDay: 'Ver en el día {0}',
      beforeLeaving: 'Antes de salir', whatToPack: 'Qué llevar', doneOf: '{0} de {1}', ready: 'listo', essential: 'imprescindible', reset: 'Reiniciar',
      rSee: 'Qué ver', rEat: 'Comer', rRoad: 'En ruta', rTip: 'Consejo', rPhoto: 'La foto', rBook: 'Entradas',
      cOpt: 'Opcional', cAuto: 'Quitada por poca luz', cSun: 'Se ajusta a la puesta de sol', cSunShift: 'Hora ideal {0}: movida para encajar el día', cFixed: 'Hora fija {0}',
      recs: 'Recomendaciones', routeStops: 'Ruta y paradas', route: 'Ruta', openRoute: 'Abrir ruta',
      inclAnyway: 'Incluir igualmente', addBack: 'Volver a incluir', remove: 'Quitar del plan', arrive: 'llegada {0}', until: 'hasta {0}', nowPill: 'AHORA',
      pShort: 'Días cortos', pMid: 'Luz media', pLong: 'Mucha luz', pAll: 'Consejo',
      okLight: 'Todo cuadra con la luz', okLightBody: 'Las visitas al aire libre acaban antes de anochecer.', nightDrive: 'Conducción de noche', nightDriveBody: '≈ {0} después de anochecer. Ve con calma: ciervos y curvas.',
      lightOf: 'Luz del día · {0}', fullDark: 'Noche cerrada', ofLight: 'de luz', onFoot: 'A pie', noCar: 'sin coche', driving: '{0} al volante', dayEnds: 'fin del día',
      arcAria: 'Recorrido del sol: amanece {0}, se pone {1}',
      stops: 'Paradas', stopsAria: 'Paradas del día', beforeStart: 'Antes de empezar', itinerary: 'Itinerario', tlHint: 'Arrastra la columna de horas para cambiar la hora',
      edsTitle: 'Comer, beber y comprar', fAll: 'Todo', fEat: 'Comer', fPub: 'Pubs', fShop: 'Souvenirs', kEat: 'Comer', kPub: 'Pub', kShop: 'Souvenirs', filter: 'Filtrar',
      dropped: 'Quitada', mkRise: 'Amanecer', mkGold: 'Empieza la golden hour', mkSet: 'Puesta de sol', mkDusk: 'Se hace de noche',
      gapFixed: 'Margen hasta la hora fija · {0}', gapFree: 'Tiempo libre · {0}', offSeason: '{0}: no hay servicio en esta fecha (temporada de abril a octubre).',
      foot: 'Horarios y precios aproximados: confírmalos en las webs oficiales antes de ir.<br>Horas de sol calculadas para cada lugar en hora local de {dest}.<br>Todo funciona sin conexión salvo los enlaces a mapas y la previsión del tiempo.',
      credits: 'Créditos de las fotos', author: 'autor en Commons', souvTitle: 'Qué traerte de {dest}', souv: 'Souvenir',
      drvTitle: 'Conducir en {dest}', dAll: 'Todo', dBase: 'Básico', dWinter: 'Invierno y nieve', dSos: 'Emergencias', kBase: 'Básico', kWinter: 'Invierno', kSos: 'Emergencias',
      wNightDrive: 'Ruta panorámica casi toda de noche', wDark: 'Ya será de noche (anochece {0})', wAfterSet: 'Termina {0} después de la puesta de sol',
      wLate: 'Hora fija {0}: con este plan llegas a las {1}', wBeforeRise: 'Empieza antes del amanecer ({0})', wClosed: 'Suele cerrar a las {0} en estas fechas',
      WD: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], MO: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      swap: 'Cambiar', altsTitle: 'Cambiar por…', selected: 'Elegida', original: 'Plan original', choose: 'Elegir',
      addPlan: 'Añadir plan', addPlanEnd: 'Añadir plan al final del día', ideasFor: 'Ideas para {0} libres', ideasEnd: 'Ideas para terminar el día', add: 'Añadir', removeExtra: 'Quitar',
      resetDay: 'Restablecer el día', nSwapped: 'Actividad cambiada', nAdded: 'Plan añadido', nRemoved: 'Plan quitado', nMoved: 'Orden cambiado', nDayReset: 'Día restablecido',
      dragHint: 'Mantén pulsada una actividad para moverla', noExtras: 'No hay ideas que quepan en este hueco.', extra: 'Extra', phoneTime: 'tu móvil {0}',
      snowAlert: 'Previsión de nieve', snowAlertBody: 'Nieve prevista: {0}. Revisa {roads} antes de salir.', rSnowFc: 'Nieve prevista',
      flTitle: 'Vuelos', flOut: 'Ida', flBack: 'Vuelta', flOutTz: 'hora de {home}', flBackTz: 'hora de {dest}', flHours: 'El check-in abre', flBefore: '{0} antes',
      flOpens: 'Check-in: abre el {0} a las {1}', flOpenIn: 'en {0}', flOpenNow: 'Check-in abierto ahora', flDone: 'Vuelo pasado', flMissing: 'Añade fecha y hora del vuelo',
      flCal: 'Añadir a Calendario', flCalNote: 'Crea los recordatorios en el calendario del iPhone: avisan aunque la guía esté cerrada.',
      flNotify: 'Check-in abierto: {0}', flNotifyBody: 'Vuelo del {0} a las {1}. Hazlo ahora en la app o web de tu aerolínea.', flSoon: 'Check-in en {0}: {1}',
      flEvCheck: 'Check-in vuelo de {0}', flEvFlight: 'Vuelo de {0}', days: '{0} d', hours: '{0} h',
      budTitle: 'Presupuesto del día', budTrip: 'Presupuesto del viaje', budEst: 'estimado', budPax: '{0} personas', budAdd: 'Gasto', budSpent: 'Gastado',
      budLeft: 'quedan ≈ {0}', budOver: 'te pasas {0}', budNone: 'Sin gastos apuntados todavía.', bTickets: 'Entradas', bFood: 'Comida y bebida', bFuel: 'Gasolina',
      bParking: 'Parking', bShop: 'Compras', bHotel: 'Alojamiento', bOther: 'Otros', budPaxL: 'Viajeros', budFuelL: 'Gasolina ({cur}/litro)', budConsL: 'Consumo (L/100 km)',
      budRateL: 'Cambio (€ por {cur})', expTitle: 'Apuntar gasto', expAmt: 'Importe ({cur})', expNote: 'Nota (opcional)', expSave: 'Guardar', nExpSaved: 'Gasto apuntado', nExpDel: 'Gasto borrado',
      budNote: 'Los precios que vienen del itinerario son aproximados: toca el importe y pon lo que hayas pagado.',
      bAddFuel: 'Repostaje', bLogFuel: 'Apuntar repostaje', bRefuel: 'Repostaje', bFuelTitle: 'Apuntar repostaje', bFuelLead: 'Pon lo que te ha costado llenar el depósito. Se suma al total del viaje.',
      budEur: '≈ {0} €', budPP: 'p.p.', budCar: 'por coche', budFuelCalc: '{0} km × {1} L/100 km × {cur}{2}', budTotal: 'Total estimado', budDays: 'Por día', expBad: 'Escribe un importe',
      autoLeg: 'Tramo estimado por distancia (orden cambiado). Abre la ruta en Google Maps para el tiempo real.', toX: 'Hacia «{0}»', autoLegMode: 'Tramo estimado por distancia. Abre la ruta en Google Maps para ver el tiempo real.', autoLegR: 'Tiempo por carretera real (OpenStreetMap), con 5 min para aparcar. Orden cambiado: no es el tramo de la guía.', autoLegModeR: 'Tiempo real por carretera o a pie (OpenStreetMap). En coche incluye 5 min para aparcar.', editDay: 'Editar día', editTitle: 'Editar el día',
      editHint: 'Arrastra ≡ para reordenar. Quita, recupera o cambia actividades: el horario y los trayectos se recalculan solos.', editAdd: 'Añadir actividad',
      bySunset: 'se coloca con la puesta de sol', fixedAt: 'hora fija {0}', useInstead: 'Elegir', otherIdeas: 'Otras ideas del día', nReplaced: 'Actividad reemplazada',
      bAddFrom: 'Desde el itinerario', bAddNew: 'Nuevo elemento', bTotal: 'Total', bGeneral: 'General', bAll: 'Añadir todas las que tienen precio', bAdded: 'Añadida',
      bName: 'Nombre', bDay: 'Día', bFuelOn: 'Incluir gasolina calculada', bEmpty: 'Añade actividades del itinerario o elementos nuevos.', bPickTitle: 'Añadir desde el itinerario',
      bNewTitle: 'Nuevo elemento', nBAdded: 'Añadido al presupuesto', bFuelRow: 'Gasolina · {0} km', bNoName: 'Escribe un nombre y un importe',
      fuTitle: 'Gasolina en la ruta', fuSub: 'Las más baratas cerca de cada parada', fuNote: 'Precios del {0} (datos abiertos de {1}). Sin servidor no se pueden actualizar solos: toca una gasolinera y Google Maps te muestra el precio de hoy.',
      fuUse: 'Usar {cur}{0}/L en el presupuesto', fuNone: 'sin datos abiertos', fuNoneTip: 'Hay pocas gasolineras en esta zona: llena antes. Búscalas en Google Maps.', fuFrom: 'desde {cur}{0}',
      fuPetrol: 'Gasolina', fuDiesel: 'Diésel', fuSearch: 'Buscar gasolineras en Google Maps', fuUsed: 'Precio de la gasolina actualizado en el presupuesto', fuMedian: 'Mediana en {dest}: gasolina {cur}{0} · diésel {cur}{1}',
      prepTitle: 'Todo para el viaje', gChk: 'Maleta y documentos', gMoney: 'Presupuesto', gFl: 'Vuelos', gStay: 'Alojamiento', gIda: 'Ida · maleta y papeles', gVuelta: 'Vuelta · maleta y papeles', gFuel: 'Gasolina', gWx: 'Tiempo y carretera', gSug: 'Sugerencias',
      gReady: '{0} de {1} listos', gImp: '{0} imprescindibles sin marcar', gImpOk: 'Lo imprescindible, listo', gFuelFrom: 'Gasolina desde {cur}{0}/L', gBudNone: 'Sin gastos apuntados',
      gWxSub: '{0}: ≈ {1}° / {2}° · conducir en invierno', gSnow: 'Nieve prevista: {0}', gSugSub: '{0} souvenirs y {1} sitios para comer, beber y comprar',
      kmAway: 'a {0} km', nearIdeas: 'Más ideas cerca', mealIdeas: 'Otros sitios para comer o tomar algo', sugDay: 'Día {0} · {1}',
      fuCheaper: '−{0}{minor} vs media', fuDearer: '+{0}{minor} vs media', fuAvg: 'en la media', fuPerL: 'por litro', fuMedian2: 'Precio medio en {dest} · {0}',
      fuCheapest: 'La más barata de tu ruta', fuByTown: 'Por día y pueblo', fuBestAt: 'Más barata: {0} · a {1} km', fuGo: 'Ir', fuSearchShort: 'Buscar',
      fuNoneTip2: 'Casi no hay gasolineras aquí. Llena antes en {0}.', fuToday: 'Google Maps muestra el precio de hoy',
      gapsTitle: 'Huecos libres', gapBtn: '{0}–{1}', gapLen: '{0} libres', noGaps: 'Este día no tiene huecos de {0} o más.', noGapsShort: 'Sin huecos',
      asMeal: 'Para una comida del día', asNight: 'En lugar del plan de noche', replaceTitle: 'Reemplazar una actividad',
      inGap: 'En un hueco libre · {0}', gapShort: 'hueco libre · {0}', shifts: 'retrasa lo demás',
      meal_b: 'Desayuno en {0}', meal_l: 'Comida en {0}', meal_d: 'Cena en {0}', replacesX: 'Sustituye a «{0}»',
      addTitle: 'Añadir al plan', useFor: 'Para «{0}» · {1}', insteadOf: 'En lugar de «{0}»', atEnd: 'Al final del día', beforeX: 'Antes de «{0}» · {1}',
      beforeShort: 'antes de la cena · {0}', buyX: 'Comprar: {0}', addedTo: 'Añadido al día {0}', addedBody: 'Toca para verlo. Puedes moverlo arrastrándolo en el timeline.',
      inPlan: 'En el plan', seeIt: 'Ver', gtCta: 'Añadir al plan', addNote: 'Se recalcula el horario del día. Luego puedes moverlo o quitarlo.',
      rchFrom: 'Tiempo para llegar desde «{0}»', rchFromX: 'Desde «{0}»', rchHere: 'Aquí mismo', rchBus: 'Bus/tren', altOpt: 'Alternativa', nowInPlan: 'Ahora en el plan',
      holeTi: 'Hueco libre', holeLead: 'Aquí iba «{0}». Elige qué hacer con este tiempo.', holeFill: 'Buscar algo para aquí', holeClose: 'Adelantar lo siguiente', holeEdit: 'Reordenar', holeBack: 'Volver a poner «{0}»',
      holeWas: 'antes: {0}', holeUse: 'En el hueco libre · {0}–{1}', nHole: 'Queda un hueco libre', nHoleBody: 'Busca algo para ese hueco, adelanta lo siguiente o reordena el día.', nHoleClosed: 'Hueco cerrado',
      addAct: 'Añadir actividad', addWhere: 'Dónde ponerla', backBtn: 'Atrás', atTime: 'A la hora que elijas', atTimeBtn: 'Poner a esta hora', pickTime: 'Elige una hora',
      atTimeWarn: 'Se recalcula el día: lo que va después se mueve. Si algo con hora (una comida, un tour) se retrasa, te lo digo.', addedAt: 'Añadida a las {0}',
      addedNearBody: 'A las {0} no cabía sin mover algo de hora fija: es lo más cerca posible.', noFit: 'No hay ningún hueco donde quepa ({0} más el trayecto).',
      tripX: '{0} de trayecto', shiftX: 'lo siguiente se mueve {0}', movesX: 'mueve «{0}» a las {1}', autoLegW: 'Tiempo real a pie (OpenStreetMap).', autoLegT: 'Estimado en transporte público (≈ coche × 1,6 + 10 min de esperas). Mira horarios en Google Maps.', addActLead: 'Ideas cerca de las paradas del día. Al elegir una, primero te enseño los huecos libres.', backIdeas: 'Otras ideas',
      verX: 'Versión de la guía: {0}', wayStopsT: 'Paradas por el camino', wsPlus: '+{0} al día', darkAt: 'de noche ({0})', nowAt: '(con el plan actual llegas a las {0})', save: 'Guardar', savedTxt: 'Guardado', savedAt: 'Guardado · {0}', dirtyTxt: 'Cambios sin guardar', flSavedOut: 'Vuelo de ida guardado', flSavedBack: 'Vuelo de vuelta guardado', stSaved: 'Alojamiento guardado: {0}', openGmaps: 'Abrir en Google Maps', tgPhoto: 'Fotografía', presetsT: 'Rutas sugeridas', presetsLead: 'Formas distintas de organizar el día. Cada una se calcula con los tiempos reales a pie; al aplicarla se reordena el timeline y puedes volver cuando quieras.', presetsTile: 'Ahora: {0} · {1} opciones', presetGuide: 'Plan de la guía', presetGuideLead: 'El orden original: castillo a primera hora (09:30), antes de las colas.', presetNow: 'En uso', presetApply: 'Usar esta ruta', presetDone: 'Ruta cambiada', presetGuideShort: 'Guía', cmpBtn: 'Comparar', mapAria: 'Diagrama del recorrido', mapFwd: 'sigues adelante', mapBack: 'vuelves atrás ({0})', mapFixed: 'hora fija', cmpBack: 'Vueltas atrás', mapSame: 'sitio real', cmpKm: 'Km a pie', cmpMust: 'Imprescindibles (★) y muy recomendables (☆)', cmpNums: 'En cifras', cmpWalk: 'A pie', cmpEnd: 'Terminas', cmpPhoto: 'Sitios de foto', cmpHP: 'Harry Potter', cmpLate: 'Llegas tarde a algo con hora (tour, cena…)', cmpNo: 'No', cmpYesN: 'Sí ({0})', cmpMissMust: 'te pierdes {0}.', cmpMissNice: 'Sin: {0}.', cmpAll: 'no te pierdes nada importante.', presetAsk: 'Cambiar de ruta quita los cambios que hiciste a mano en este día. ¿Seguir?', presetWalk: '{0} a pie', presetEnd: 'Terminas a las {0}', presetLate: '{0} con hora llegan tarde', presetOnTime: 'Todo a su hora', tgFilm: 'Cine y series', fFilm: 'Cine', hpShort: 'Ruta Harry Potter', hpOpen: 'Ver la ruta Harry Potter', hpLead: 'Lugares de rodaje y de inspiración de las películas, ordenados para ir de uno a otro. Los de Edimburgo son a pie; los de las Highlands, en coche.', hpCard: 'Glenfinnan, el Lago Negro, la cabaña de Hagrid, la tumba de Dumbledore… y el Edimburgo de Rowling', filmsAllT: 'Cine y series en el viaje', filmsAllSub: 'Harry Potter, Skyfall, Highlander, Vengadores, Monty Python, Outlander…', filmsAllSubGen: 'Sitios de este viaje que salen en películas', omNoteGen: 'Por si falla la cobertura. Antes de salir, con wifi: abre cada día en Google Maps, toca tu foto → «Mapas sin conexión» → «Selecciona tu propio mapa» y descarga la zona.', filmsAllB: 'Lugares de películas', filmsDayT: 'Cine en el día {0}', filmsDayB: '{0} lugares de películas y series', castlesT: '{0} castillos en el viaje', castlesLead: 'Los que visitas en el plan, con su día y su hora. Toca uno para verlo en el timeline.', hmDays: 'Tus {0} días', hmSwipe: 'Desliza →', hmStops: '{0} paradas', hmStopsSwipe: '{0} paradas · toca una', packBack: 'Para volver', hubMiss: 'Falta', hubMissN: 'Faltan {0}', hubStay: '{0} de {1} noches', hubStayAdd: 'Añade tus hoteles', hubSpentN: '{0} gastos apuntados', hubFuelSpent: 'Gastado: {0}', hubFuelAdd: 'Apunta cada repostaje', hubWx2: 'Previsión y consejos al volante', stayIn: 'Check-in en {0}', stayOut: 'Desayuno y check-out · {0}', stayOutNoBf: 'Check-out · {0}', stNight: 'Noche {0} · {1}', stName: 'Nombre', stNamePh: 'Hotel, B&B…', stAddr: 'Dirección o enlace de Google Maps', stAddrPh: 'Calle, código postal o enlace', stArr: 'Llegada (hora fija)', stOut: 'Check-out', stRef: 'Reserva o teléfono', stBf: 'Desayuno incluido', stLoc: 'Ubicar en el mapa', stLocOk: 'Ubicado en el mapa', stLocTown: 'Sin ubicar: se usa el centro de {0}', stLocNo: 'No lo encuentro: prueba con la dirección o pega un enlace de Google Maps con coordenadas.', stLocFar: 'Lo que encuentro está lejos de {0}: revisa el nombre o pega un enlace de Google Maps.', stLocOff: 'Sin conexión: de momento se usa el centro de {0}.', stLocating: 'Buscando…', stNeedName: 'Pon el nombre o la dirección primero', stDel: 'Borrar', stDeleted: 'Alojamiento borrado', stArrSet: 'Llegada fija a las {0}', hopWalk: '{0} a pie', hopCar: '{0} en coche', hopBus: '{0} en transporte público', byWalk: 'A pie', byCar: 'En coche', byBus: 'Transporte público', stFound: 'Encontrado: {0}', stPhotoOk: 'Foto del alojamiento añadida', stPhotoG: 'Sin foto libre: ver fotos en Google Maps', stWeb: 'Web', stPlanArr: 'Según el plan llegas a las {0}', stLate: 'Según el plan llegas a las {0}, más tarde de las {1}: quita o acorta algo del día, o cambia la hora', stNote: 'Cada noche va al timeline: el check-in de ese día y el desayuno y check-out del día siguiente se ponen en tu hotel. La hora de llegada queda fija (candado) y el día se organiza para llegar a tiempo. Ubicar usa OpenStreetMap y necesita conexión; también vale pegar un enlace de Google Maps con coordenadas.', fuLogT: 'Lo que llevas en gasolina', fuLogN: '{0} repostajes', fuLogEmpty: 'Cada vez que repostes, apúntalo aquí: se suma al presupuesto.', wayNote: 'Ideas de camino entre «{0}» y «{1}», de menos a más desvío.', mustBe: 'Tienes que estar en «{0}» a las {1}.', detNone: 'sin desvío', detPlus: 'desvío +{0}', detSave: '{0} menos de trayecto', shotFrom: 'Foto:', shotMap: 'Ver en Maps', fPhoto: 'Fotografía', prTitle: 'Ruta de fotos', prOpen: 'Ruta de fotos en Google Maps', prBy: 'Inspirada en la guía de {0} en Instagram.', prKm: '{0} sitios, unos {1} km a pie.', prTile: '{0} sitios · {1} km a pie · aparte de la ruta del día', prFar: 'Aparte (en coche)', prApart: 'aparte', resetOrig: 'Volver a la ruta original del día', resetRoute: 'Deshacer mis cambios en «{0}»', resetRouteAsk: '¿Volver a la ruta «{0}» tal como era? Se pierden los cambios que hiciste a mano en este día.', nRouteReset: 'Ruta «{0}» como al principio', resetAsk: '¿Volver al plan original del día {0}? Se pierden los cambios de ese día.', fNight: 'De noche', fMorning: 'Por la mañana', fSunset: 'Atardecer', fQuick: 'Cortas', fBooking: 'Con reserva', afCount: '{0} de {1}', afNone: 'Ninguna actividad tiene todos esos filtros.', afClear: 'Quitar filtros',
      wMidnight: 'Termina pasada la medianoche ({0})', crClosed: 'Cerrado', crNotFit: 'No cabe a las {0}', crNotFitBody: 'Con las actividades bloqueadas y los trayectos del día no hay hueco a esa hora. Se queda donde estaba.',
      ssClash: 'La puesta de sol ({0}) cae durante «{1}», que está bloqueada: lo que añadas irá antes o después.', travelGuide: 'Guía de viaje', sections: 'Secciones',
      wxSunGood: 'Atardecer despejado (nubes {0} %)', wxSunMixed: 'Nubes al atardecer ({0} %)', wxSunBad: 'Probablemente nublado al atardecer ({0} %)', wxRainAt: 'Lluvia probable ({0} %)',
      soGood: 'despejado', soMixed: 'algunas nubes', soBad: 'probablemente nublado', planB: 'Plan si llueve', maps: 'Maps',
      rainTitle: 'Si llueve o está nublado', rainMore: 'Plan para mal tiempo', rainNone: 'No hay planes a cubierto cerca.',
      rainNoteSun: 'Al atardecer se esperan nubes al {0} % (lluvia {1} %). Planes a cubierto cerca:', rainNoteRain: 'A esa hora: lluvia {0} % ({1} mm). Planes a cubierto cerca:',
      routeShort: 'Ruta', mapBtn: 'Mapa', routesBtn: 'Rutas', rtOpts: 'Opciones', rtTitle: 'Ruta en Google Maps', rtLeft: 'Lo que queda de hoy, desde donde estás', rtAll: 'Todo el día', rtPart: 'parte {0} de {1}', rtStops: 'Paradas',
      rtNear: 'Recomendados cerca (no están en la ruta)', rtNearShort: 'recomendados', rtKml: 'Exportar mapa del viaje (KML)',
      rtNote: 'Google Maps admite hasta 9 paradas intermedias por enlace (si hay más, va en partes) y no deja añadir marcadores sueltos a una ruta. Para verlo todo junto, exporta el mapa.',
      rtKmlHow: 'Ábrelo en mymaps.google.com → Crear mapa → Importar. Después aparece en la app de Google Maps, en Guardado → Mapas, con la ruta de cada día y los recomendados.',
      nKml: 'Mapa del viaje exportado', nSunBadT: 'Atardecer probablemente nublado', nSunBadB: '{0}: nubes al {1} %. Toca para ver planes a cubierto.',
      tgMuseum: 'Museos', tgSacred: 'Templos e iglesias', tgPalace: 'Castillos y palacios', tgRuins: 'Ruinas e historia', tgPark: 'Parques y naturaleza', tgCity: 'Plazas y monumentos', tgSunset: 'Buena puesta de sol', tgNight: 'Mejor de noche', tgMorning: 'Mejor por la mañana', tgRain: 'Bueno si llueve', tgBooking: 'Reserva antes', tgQuick: 'Parada rápida',
      cLocked: 'Bloqueada · {0}', cMoved: 'Movida tras «{0}» para llegar a tiempo',
      clashT: 'La puesta de sol choca con «{0}»', clashB: 'El sol se pone a las {0}, durante una actividad bloqueada. Toca para elegir.', clashPicked: 'Ya elegiste qué hacer. Toca para cambiarlo.',
      fixT: 'Choque de horarios', fixB: 'Con este orden llegas tarde a una actividad bloqueada. Toca para reordenar.', nFixed: 'Día reordenado',
      scEyebrow: 'Choque con la puesta de sol', scTitle: 'La puesta de sol ({0}) cae durante «{1}»', scLead: '«{0}» está bloqueada de {1} a {2}. ¿Qué hacemos con «{3}»?',
      scAfter: 'Mantener «{0}» y hacer «{1}» después · {2}', scAfterNote: 'sin sol; anochece a las {0}', scBefore: 'Hacer «{0}» antes · {1}', scBeforeNote: 'con luz, sin atardecer; se reordena el día si hace falta',
      scSwap: 'Cambiar «{0}» por otra actividad', scRemove: 'Quitar «{0}» hoy', scKeep: 'Dejarlo como está', scRec: 'recomendado', scChosen: 'elegido',
      scNote: 'Las actividades bloqueadas (con candado) siempre se respetan. Puedes cambiar esta elección cuando quieras desde la ficha del día.',
      nClashT: 'Día {0}: choque con la puesta de sol', nClashB: 'El sol se pone a las {0} durante «{1}». Toca para elegir.', nPicked: 'Plan del día actualizado',
      ssTile: 'Puesta de sol · {0}', ssHave: 'Hoy la ves desde «{0}»', ssTitle: 'Dónde ver la puesta de sol · {0}', ssLead: 'Sitios con buena vista cerca de donde estarás. Al añadir uno, la guía lo coloca a la hora del atardecer.',
      ssAdd: 'Añadir al atardecer', ssNone: 'No hay sitios con buena puesta de sol cerca de tu ruta de hoy.',
      slot_sunset: 'Este hueco cae cerca de la puesta de sol ({0}): primero los sitios con buena vista.', slot_night: 'Este hueco ya es de noche: primero los planes de noche.', slot_morning: 'Hueco por la mañana: primero lo que mejor se ve temprano.',
      crTitle: 'Afluencia típica', crAtPlan: 'a la hora del plan ({0})', crLow: 'Poca gente', crMid: 'Algo de gente', crHigh: 'Bastante gente', crPeak: 'Hora punta',
      crMove: 'Mover a las {0}', crPref: 'Hora elegida: {0}', crPrefShort: 'Elegida a las {0}', crPrefClear: 'Quitar', crMoved: 'Actividad movida', crNoBetter: 'Para esta actividad no hay una hora con mucha menos gente.',
      crLive: 'En directo en Google Maps', crNote: 'Estimación según el tipo de sitio y el día de la semana, no son datos en directo. Google Maps muestra la afluencia real cuando la tiene.',
      langBtn: 'EN', langAria: 'Cambiar a inglés'
    },
    en: {
      app: '{dest} guide', now: 'now', pinned: 'Pinned', day: 'Day', tabPrep: 'Home', tabTrip: 'Summary', mapHint: 'slide the ball',
      islCount: '{0} days to go', islDone: 'Trip finished', islPre: 'Day {0} · starts at {1}', payMe: 'Traveller 1', payYou: 'Traveller 2', payBy: 'Paid by {0} (tap to change)', payName: 'Name {0}', payPaid: 'Paid by {0}', splitT: 'Split costs', splitEven: 'You are even.', splitOwes: '{0} owes {1}', splitHow: 'Tap the initial on each expense to change who paid. Everything is split in half.', gDocs: 'Bookings and tickets', docsN: '{0} files saved', docsN1: '1 file saved', docsSub: 'Tickets, boarding passes, car', docsT: 'Your bookings', docsNote: 'PDFs or screenshots of tickets, boarding passes, the car hire… They are stored on this phone and open offline. They are not included in the backup.', docAdd: 'Add file', docsEmpty: 'Nothing saved yet.', docDel: 'Delete', docDelQ: 'Delete this file from the phone?', docBig: '“{0}” is larger than 25 MB', docAdded: 'Saved ({0})', docFail: 'The file could not be saved', gData: 'Backup, calendar and maps', gDataSub: 'Backup', gDataSub2: 'Calendar · offline maps', bkT: 'Backup', bkNote: 'Save what you have ticked and noted (tasks, hotels, expenses, plan changes) to a file, so you do not lose it or can send it to your travel partner.', bkExp: 'Save backup', bkImp: 'Load backup', bkBad: 'That file is not a guide backup', bkOther: 'This backup is from another trip ({0}). Load it anyway?', bkSure: 'What is saved on this phone will be replaced by the backup from {0}. Continue?', calT: 'The whole trip in your calendar', calNote: 'Creates a calendar file with every activity, its place and an alert 15 min before. Open it on the iPhone to add it to Calendar. If you change the plan, create it again.', calBtn: 'Add to calendar', calDone: '{0} activities in the file', calDoneB: 'Open it to add them to Calendar.', omT: 'Offline maps', omNote: 'Coverage is patchy in the Highlands. Before you go, on wifi: open each day in Google Maps, tap your photo → “Offline maps” → “Select your own map” and download the area.', cromoAdd: 'Collect', cromoGot: 'Collected', cromoDone: '{0} collected!', cromoDoneB: '{0} of {1} cards on this trip. Tap to see your album.', albT: 'My album', albSub: '{0} of {1} cards', albSub2: '3D viewer, postcard and profile', albTabA: 'Album', albTabP: 'Profile', albHint: 'Every place you visit is a card. Tap one to see it in 3D and collect it. ★ = must-see.', albCopyNote: 'Save your cards to a file to move them to another phone or to the web app.', cromoAsk: 'Did you see {0}?', cromoAskB: 'Tap to stick the card in your album.', viewT: 'Itinerary view', viewFull: 'Photos', viewList: 'List', nowBtn: 'Now', myTrips: 'Trips', themeT: 'Theme', theme_auto: 'Automatic (follows your iPhone)', theme_dark: 'Dark', theme_light: 'Light', islDefault: '{title}', loading: 'Loading…', live: 'Live time', manual: 'Manual', scotTime: '{dest} time',
      left: '{0} left', nextAt: 'Next · {0}', dayDone: 'Day {0} done', rest: 'Rest, more tomorrow', from: 'from {0}',
      freeTime: 'Free time', endOfDay: 'End of the day', upNext: 'Up next: {0}', tomorrow: 'More tomorrow.', next: 'Next', nothingMore: 'Nothing else today',
      setTime: 'Time', seeInGuide: 'Show in guide', sync: 'Sync', close: 'Close',
      sNight: 'Night', sRiseAt: 'Sunrise {0}', sDawn: 'Sunrise', sAt: 'At {0}', sLight: 'Daylight', sUntil: 'Until {0}', sGolden: 'Golden hour', sSetAt: 'Sunset {0}', sTwilight: 'Twilight', sDarkAt: 'Dark {0}',
      nAt: 'At {0}', nLeft: '{0} left', nThen: ' · then {0}', nNextAt: 'Next: {0} at {1}', nInMin: 'In {0} min: {1}', nGo: 'Time to go. Route ready in Maps.',
      nGoldIn: 'Golden hour in {0} min', nGoldBody: 'Sunset at {0}. Head to the viewpoint.', nLow: 'Light is fading', nLowBody: '{0}: sunset at {1}.',
      nDayOn: 'Day {0} under way', nNowIs: 'Now: {0}. ', nSunsetAt: 'Sunset at {0}.', nDaysLeft: '{0} days to {dest}',
      nDaysLeftBody: 'The guide follows your phone’s time. Drag the time column in the itinerary to preview another moment.',
      nPickDate: 'Pick your travel dates', nPickDateBody: 'Change the Day 1 date in “Prepare” to recalculate the sun.',
      nImp: '{0} essentials not ticked', nImpBody: 'Passport, ETA, licence… Tap to see the list.', nReset: 'List reset',
      nCatDone: '{0}: done', nAllDone: 'All set.', nItemsLeft: '{0} items left on the list.',
      nDates: 'Dates updated', nDatesBody: '{0} → {1} · sunset {2} on Day 1 · {3}', nWarnN: '{0} daylight warning(s)', nNoWarn: 'no daylight warnings',
      nReplan: 'Plan updated', nReplanBody: 'Day {0}: you finish around {1}{2}', nAllLight: ' · all in daylight',
      nSynced: 'Synced to live time', nSyncedBody: 'Your phone time: {0}', scotNow: 'in {dest} {0}', phoneNow: 'Your phone time', nManual: 'Manual mode', nManualBody: 'Day {0} at {1}. Tap “Sync” to go back to live time.',
      nLang: 'Language: English', nLangBody: 'The whole guide is now in English.',
      wxEarly: 'Too early', wxEarlyBody: 'The forecast appears about 15 days before the trip.', wxOffline: 'Offline', wxOfflineBody: 'Showing the last saved forecast.',
      wxFail: 'Couldn’t update', wxFailBody: 'Try again later. Keeping the last saved data.', wxUpdated: 'Forecast updated',
      wxRisky: 'Ice, snow or wind risk on some days.', wxSafe: 'No special road risks.', wxAlert: 'Watch the roads',
      wxAlertBody: 'Ice, snow or wind risk on some days. See “Weather and roads”.',
      wxNoteOk: 'Open-Meteo forecast, updated {0}. Road conditions are estimated from temperature, snow and wind: always check {roads}.',
      wxLtHour: 'less than an hour ago', wxHours: '{0} h ago',
      wxNoteEarly: 'The real forecast appears about 15 days before the trip (from {0}). Until then you see typical weather.',
      wxNoteNone: 'No forecast saved: tap “Update” when you are online. Always check the roads on {roads}.',
      wxNoteDefault: 'The real forecast appears about 15 days before the trip. Road conditions are estimated from temperature, snow and wind: always check {roads}.',
      wxEyebrow: 'Weather and roads', wxTitle: 'Trip forecast', wxRefresh: 'Update',
      wxC: ['No data', 'Clear', 'Sun and clouds', 'Cloudy', 'Fog', 'Drizzle', 'Rain', 'Snow', 'Showers', 'Snow showers', 'Thunderstorm', 'Mixed'],
      wxRain: 'rain {0}%', wxGusts: 'gusts {0} km/h', rSnow: 'Snow: {0} cm', rIce: 'Ice risk', rGust: 'Gusts of {0} km/h', rFog: 'Fog', rRain: 'Heavy rain',
      rNone: 'No road risks forecast', wxTypical: 'Typical winter weather (approx.)', wxNone: 'No forecast yet', wxPassSnow: 'Snow or ice possible on the pass',
      wxCityRain: 'Frequent rain', wxMiniTyp: 'Typical: <b>≈ {0}° / {1}°</b> at {2}',
      nojsTitle: 'You are viewing the static version',
      nojs1: 'This preview (Files, Mail, WhatsApp…) does not run JavaScript. You see all the content, but no notifications, slider or time recalculation.',
      nojs2: 'Sun times calculated for Day 1 = <b>{0}</b>.',
      nojs3: 'For the full version, open it from a URL in Safari (for example, uploaded to Netlify Drop) and add it to your Home Screen.',
      coverEyebrow: 'Travel guide · {ndays} days', coverTitle: '{dest}', coverSub: '{0} – {1}', coverAria: '{dest}',
      theRoute: 'The route', routeHint: 'Tap a stop to see the summary', kmByCar: 'km by car', castles: 'castles', lightPerDay: 'daylight a day',
      date1: 'Day 1 date', recalc: 'Recalculates sun and times', sunsetW: 'Sunset', mustSee: 'Don’t miss', seeInDay: 'Show in day {0}',
      beforeLeaving: 'Before you go', whatToPack: 'What to pack', doneOf: '{0} of {1}', ready: 'ready', essential: 'essential', reset: 'Reset',
      rSee: 'What to see', rEat: 'Eat', rRoad: 'On the road', rTip: 'Tip', rPhoto: 'The photo', rBook: 'Tickets',
      cOpt: 'Optional', cAuto: 'Dropped: not enough light', cSun: 'Follows the sunset', cSunShift: 'Ideal time {0}: moved to fit the day', cFixed: 'Fixed time {0}',
      recs: 'Recommendations', routeStops: 'Route and stops', route: 'Route', openRoute: 'Open route',
      inclAnyway: 'Include anyway', addBack: 'Add back', remove: 'Remove from plan', arrive: 'arrive {0}', until: 'until {0}', nowPill: 'NOW',
      pShort: 'Short days', pMid: 'Medium light', pLong: 'Long days', pAll: 'Tip',
      okLight: 'Everything fits the daylight', okLightBody: 'Outdoor visits end before dark.', nightDrive: 'Night driving', nightDriveBody: '≈ {0} after dark. Take it easy: deer and bends.',
      lightOf: 'Daylight · {0}', fullDark: 'Full dark', ofLight: 'of daylight', onFoot: 'On foot', noCar: 'no car', driving: '{0} driving', dayEnds: 'day ends',
      arcAria: 'Sun path: sunrise {0}, sunset {1}',
      stops: 'Stops', stopsAria: 'Stops of the day', beforeStart: 'Before you start', itinerary: 'Itinerary', tlHint: 'Drag the time column to change the time',
      edsTitle: 'Eat, drink and shop', fAll: 'All', fEat: 'Eat', fPub: 'Pubs', fShop: 'Souvenirs', kEat: 'Eat', kPub: 'Pub', kShop: 'Souvenirs', filter: 'Filter',
      dropped: 'Dropped', mkRise: 'Sunrise', mkGold: 'Golden hour begins', mkSet: 'Sunset', mkDusk: 'Night falls',
      gapFixed: 'Buffer before the fixed time · {0}', gapFree: 'Free time · {0}', offSeason: '{0}: not running on this date (season April to October).',
      foot: 'Times and prices are approximate: check the official websites before you go.<br>Sun times calculated for each place in Scottish local time.<br>Everything works offline except the map links and the weather forecast.',
      credits: 'Photo credits', author: 'author on Commons', souvTitle: 'What to bring home', souv: 'Souvenir',
      drvTitle: 'Driving in {dest}', dAll: 'All', dBase: 'Basics', dWinter: 'Winter and snow', dSos: 'Emergencies', kBase: 'Basics', kWinter: 'Winter', kSos: 'Emergencies',
      wNightDrive: 'Scenic drive mostly in the dark', wDark: 'It will be dark (dusk {0})', wAfterSet: 'Ends {0} after sunset',
      wLate: 'Fixed time {0}: with this plan you arrive at {1}', wBeforeRise: 'Starts before sunrise ({0})', wClosed: 'Usually closes at {0} at this time of year',
      WD: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], MO: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      swap: 'Swap', altsTitle: 'Swap for…', selected: 'Selected', original: 'Original plan', choose: 'Choose',
      addPlan: 'Add a plan', addPlanEnd: 'Add a plan at the end of the day', ideasFor: 'Ideas for {0} free', ideasEnd: 'Ideas to end the day', add: 'Add', removeExtra: 'Remove',
      resetDay: 'Reset this day', nSwapped: 'Activity swapped', nAdded: 'Plan added', nRemoved: 'Plan removed', nMoved: 'Order changed', nDayReset: 'Day reset',
      dragHint: 'Press and hold an activity to move it', noExtras: 'No ideas fit this gap.', extra: 'Extra', phoneTime: 'your phone {0}',
      snowAlert: 'Snow forecast', snowAlertBody: 'Snow forecast: {0}. Check {roads} before setting off.', rSnowFc: 'Snow forecast',
      flTitle: 'Flights', flOut: 'Outbound', flBack: 'Return', flOutTz: '{home} time', flBackTz: '{dest} time', flHours: 'Check-in opens', flBefore: '{0} before',
      flOpens: 'Check-in opens on {0} at {1}', flOpenIn: 'in {0}', flOpenNow: 'Check-in is open now', flDone: 'Flight is past', flMissing: 'Add the flight date and time',
      flCal: 'Add to Calendar', flCalNote: 'Creates the reminders in the iPhone calendar: they alert you even when the guide is closed.',
      flNotify: 'Check-in open: {0}', flNotifyBody: 'Flight on {0} at {1}. Do it now in your airline’s app or website.', flSoon: 'Check-in in {0}: {1}',
      flEvCheck: 'Check-in: {0} flight', flEvFlight: '{0} flight', days: '{0} d', hours: '{0} h',
      budTitle: 'Budget for the day', budTrip: 'Trip budget', budEst: 'estimated', budPax: '{0} people', budAdd: 'Expense', budSpent: 'Spent',
      budLeft: '≈ {0} left', budOver: '{0} over', budNone: 'No expenses logged yet.', bTickets: 'Tickets', bFood: 'Food and drink', bFuel: 'Fuel',
      bParking: 'Parking', bShop: 'Shopping', bHotel: 'Accommodation', bOther: 'Other', budPaxL: 'Travellers', budFuelL: 'Fuel ({cur}/litre)', budConsL: 'Consumption (L/100 km)',
      budRateL: 'Rate (€ per {cur})', expTitle: 'Log an expense', expAmt: 'Amount ({cur})', expNote: 'Note (optional)', expSave: 'Save', nExpSaved: 'Expense logged', nExpDel: 'Expense deleted',
      budNote: 'Prices taken from the itinerary are approximate: tap the amount and enter what you paid.',
      bAddFuel: 'Refuel', bLogFuel: 'Log refuel', bRefuel: 'Refuel', bFuelTitle: 'Log a refuel', bFuelLead: 'Enter what filling the tank cost you. It adds to the trip total.',
      budEur: '≈ €{0}', budPP: 'pp', budCar: 'per car', budFuelCalc: '{0} km × {1} L/100 km × {cur}{2}', budTotal: 'Estimated total', budDays: 'Per day', expBad: 'Enter an amount',
      autoLeg: 'Leg estimated from distance (order changed). Open the route in Google Maps for the real time.', toX: 'To “{0}”', autoLegMode: 'Leg estimated from distance. Open the route in Google Maps for the real time.', autoLegR: 'Real road time (OpenStreetMap), with 5 min to park. Order changed: not the guide’s leg.', autoLegModeR: 'Real road or walking time (OpenStreetMap). By car it includes 5 min to park.', editDay: 'Edit day', editTitle: 'Edit the day',
      editHint: 'Drag ≡ to reorder. Remove, restore or swap activities: the schedule and the legs are recalculated automatically.', editAdd: 'Add an activity',
      bySunset: 'placed by the sunset', fixedAt: 'fixed time {0}', useInstead: 'Choose', otherIdeas: 'Other ideas for the day', nReplaced: 'Activity replaced',
      bAddFrom: 'From the itinerary', bAddNew: 'New item', bTotal: 'Total', bGeneral: 'General', bAll: 'Add all with a price', bAdded: 'Added',
      bName: 'Name', bDay: 'Day', bFuelOn: 'Include calculated fuel', bEmpty: 'Add activities from the itinerary or new items.', bPickTitle: 'Add from the itinerary',
      bNewTitle: 'New item', nBAdded: 'Added to the budget', bFuelRow: 'Fuel · {0} km', bNoName: 'Enter a name and an amount',
      fuTitle: 'Fuel on the route', fuSub: 'The cheapest near each stop', fuNote: 'Prices from {0} (open data from {1}). They can’t update themselves without a server: tap a station and Google Maps shows today’s price.',
      fuUse: 'Use {cur}{0}/L in the budget', fuNone: 'no open data', fuNoneTip: 'Few petrol stations here: fill up before. Find them in Google Maps.', fuFrom: 'from {cur}{0}',
      fuPetrol: 'Petrol', fuDiesel: 'Diesel', fuSearch: 'Find petrol stations in Google Maps', fuUsed: 'Fuel price updated in the budget', fuMedian: 'Median in {dest}: petrol {cur}{0} · diesel {cur}{1}',
      prepTitle: 'Everything for the trip', gChk: 'Packing and documents', gMoney: 'Budget', gFl: 'Flights', gStay: 'Accommodation', gIda: 'Outbound · packing & papers', gVuelta: 'Return · packing & papers', gFuel: 'Fuel', gWx: 'Weather and roads', gSug: 'Suggestions',
      gReady: '{0} of {1} ready', gImp: '{0} essentials unchecked', gImpOk: 'Essentials done', gFuelFrom: 'Fuel from {cur}{0}/L', gBudNone: 'No expenses yet',
      gWxSub: '{0}: ≈ {1}° / {2}° · winter driving', gSnow: 'Snow forecast: {0}', gSugSub: '{0} souvenirs and {1} places to eat, drink and shop',
      kmAway: '{0} km away', nearIdeas: 'More ideas nearby', mealIdeas: 'Other places to eat or drink', sugDay: 'Day {0} · {1}',
      fuCheaper: '−{0}{minor} vs avg', fuDearer: '+{0}{minor} vs avg', fuAvg: 'average', fuPerL: 'per litre', fuMedian2: 'Average price in {dest} · {0}',
      fuCheapest: 'Cheapest on your route', fuByTown: 'By day and town', fuBestAt: 'Cheapest: {0} · {1} km away', fuGo: 'Go', fuSearchShort: 'Search',
      fuNoneTip2: 'Hardly any petrol stations here. Fill up before, in {0}.', fuToday: 'Google Maps shows today’s price',
      gapsTitle: 'Free gaps', gapBtn: '{0}–{1}', gapLen: '{0} free', noGaps: 'This day has no gaps of {0} or more.', noGapsShort: 'No gaps',
      asMeal: 'For one of the day’s meals', asNight: 'Instead of the evening plan', replaceTitle: 'Replace an activity',
      inGap: 'In a free gap · {0}', gapShort: 'free gap · {0}', shifts: 'pushes the rest later',
      meal_b: 'Breakfast at {0}', meal_l: 'Lunch at {0}', meal_d: 'Dinner at {0}', replacesX: 'Replaces “{0}”',
      addTitle: 'Add to the plan', useFor: 'For “{0}” · {1}', insteadOf: 'Instead of “{0}”', atEnd: 'At the end of the day', beforeX: 'Before “{0}” · {1}',
      beforeShort: 'before dinner · {0}', buyX: 'Buy: {0}', addedTo: 'Added to day {0}', addedBody: 'Tap to see it. You can move it by dragging it in the timeline.',
      inPlan: 'In the plan', seeIt: 'See', gtCta: 'Add to the plan', addNote: 'The day’s schedule is recalculated. You can move or remove it later.',
      rchFrom: 'Travel time from “{0}”', rchFromX: 'From “{0}”', rchHere: 'Right here', rchBus: 'Bus/train', altOpt: 'Alternative', nowInPlan: 'Now in the plan',
      holeTi: 'Free slot', holeLead: '“{0}” was here. Choose what to do with this time.', holeFill: 'Find something for here', holeClose: 'Move the rest earlier', holeEdit: 'Reorder', holeBack: 'Put back “{0}”',
      holeWas: 'was: {0}', holeUse: 'In the free slot · {0}–{1}', nHole: 'A free slot is left', nHoleBody: 'Find something for it, move the rest earlier or reorder the day.', nHoleClosed: 'Slot closed',
      addAct: 'Add activity', addWhere: 'Where to put it', backBtn: 'Back', atTime: 'At a time you choose', atTimeBtn: 'Put it at this time', pickTime: 'Pick a time',
      atTimeWarn: 'The day is recalculated: what comes after moves. If something with a set time (a meal, a tour) gets later, you’ll be told.', addedAt: 'Added at {0}',
      addedNearBody: '{0} didn’t fit without moving a fixed-time activity: this is the closest.', noFit: 'No gap where it fits ({0} plus travel).',
      tripX: '{0} of travel', shiftX: 'the rest moves {0}', movesX: 'moves “{0}” to {1}', autoLegW: 'Real walking time (OpenStreetMap).', autoLegT: 'Public transport estimate (≈ car × 1.6 + 10 min of waiting). Check timetables in Google Maps.', addActLead: 'Ideas near today’s stops. Pick one and you’ll see the free gaps first.', backIdeas: 'Other ideas',
      verX: 'Guide version: {0}', wayStopsT: 'Stops on the way', wsPlus: '+{0} to the day', darkAt: 'after dark ({0})', nowAt: '(with the current plan you arrive at {0})', save: 'Save', savedTxt: 'Saved', savedAt: 'Saved · {0}', dirtyTxt: 'Unsaved changes', flSavedOut: 'Outbound flight saved', flSavedBack: 'Return flight saved', stSaved: 'Accommodation saved: {0}', openGmaps: 'Open in Google Maps', tgPhoto: 'Photography', presetsT: 'Suggested routes', presetsLead: 'Different ways to organise the day. Each is computed with real walking times; applying one reorders the timeline and you can switch back any time.', presetsTile: 'Now: {0} · {1} options', presetGuide: 'Guide plan', presetGuideLead: 'The original order: castle first thing (09:30), before the queues.', presetNow: 'In use', presetApply: 'Use this route', presetDone: 'Route changed', presetGuideShort: 'Guide', cmpBtn: 'Compare', mapAria: 'Route diagram', mapFwd: 'moving on', mapBack: 'going back ({0})', mapFixed: 'fixed time', cmpBack: 'Going back', mapSame: 'actual spot', cmpKm: 'Km on foot', cmpMust: 'Must-sees (★) and recommended (☆)', cmpNums: 'In numbers', cmpWalk: 'On foot', cmpEnd: 'You finish', cmpPhoto: 'Photo spots', cmpHP: 'Harry Potter', cmpLate: 'Late for something timed (tour, dinner…)', cmpNo: 'No', cmpYesN: 'Yes ({0})', cmpMissMust: 'you miss {0}.', cmpMissNice: 'Without: {0}.', cmpAll: 'you miss nothing important.', presetAsk: 'Switching route removes the changes you made by hand on this day. Continue?', presetWalk: '{0} on foot', presetEnd: 'You finish at {0}', presetLate: '{0} timed items late', presetOnTime: 'Everything on time', tgFilm: 'Film & TV', fFilm: 'Film', hpShort: 'Harry Potter route', hpOpen: 'See the Harry Potter route', hpLead: 'Filming and inspiration spots from the films, ordered to go from one to the next. Edinburgh ones on foot; Highland ones by car.', hpCard: 'Glenfinnan, the Black Lake, Hagrid’s hut, Dumbledore’s grave… and Rowling’s Edinburgh', filmsAllT: 'Film & TV on the trip', filmsAllSub: 'Harry Potter, Skyfall, Highlander, Avengers, Monty Python, Outlander…', filmsAllSubGen: 'Places on this trip that appear in films', omNoteGen: 'In case coverage fails. Before you go, on wifi: open each day in Google Maps, tap your photo → “Offline maps” → “Select your own map” and download the area.', filmsAllB: 'Film locations', filmsDayT: 'Film on day {0}', filmsDayB: '{0} film and TV spots', castlesT: '{0} castles on the trip', castlesLead: 'The ones you visit in the plan, with day and time. Tap one to see it in the timeline.', hmDays: 'Your {0} days', hmSwipe: 'Swipe →', hmStops: '{0} stops', hmStopsSwipe: '{0} stops · tap one', packBack: 'For the way back', hubMiss: 'Missing', hubMissN: '{0} missing', hubStay: '{0} of {1} nights', hubStayAdd: 'Add your hotels', hubSpentN: '{0} expenses logged', hubFuelSpent: 'Spent: {0}', hubFuelAdd: 'Log every refuel', hubWx2: 'Forecast and driving tips', stayIn: 'Check-in at {0}', stayOut: 'Breakfast and check-out · {0}', stayOutNoBf: 'Check-out · {0}', stNight: 'Night {0} · {1}', stName: 'Name', stNamePh: 'Hotel, B&B…', stAddr: 'Address or Google Maps link', stAddrPh: 'Street, postcode or link', stArr: 'Arrival (fixed time)', stOut: 'Check-out', stRef: 'Booking or phone', stBf: 'Breakfast included', stLoc: 'Find on the map', stLocOk: 'Placed on the map', stLocTown: 'Not placed: using the centre of {0}', stLocNo: 'Not found: try the address or paste a Google Maps link with coordinates.', stLocFar: 'What I found is far from {0}: check the name or paste a Google Maps link.', stLocOff: 'Offline: using the centre of {0} for now.', stLocating: 'Searching…', stNeedName: 'Add the name or address first', stDel: 'Delete', stDeleted: 'Accommodation deleted', stArrSet: 'Arrival fixed at {0}', hopWalk: '{0} on foot', hopCar: '{0} by car', hopBus: '{0} by public transport', byWalk: 'On foot', byCar: 'By car', byBus: 'Public transport', stFound: 'Found: {0}', stPhotoOk: 'Accommodation photo added', stPhotoG: 'No free photo: see photos in Google Maps', stWeb: 'Website', stPlanArr: 'The plan gets you there at {0}', stLate: 'The plan gets you there at {0}, later than {1}: drop or shorten something, or change the time', stNote: 'Each night goes into the timeline: that day’s check-in and the next day’s breakfast and check-out move to your hotel. The arrival time is fixed (padlock) and the day is planned to get there on time. Finding it uses OpenStreetMap and needs a connection; a Google Maps link with coordinates also works.', fuLogT: 'Your fuel so far', fuLogN: '{0} refuels', fuLogEmpty: 'Log each refuel here: it adds to the budget.', wayNote: 'Ideas on the way between “{0}” and “{1}”, smallest detour first.', mustBe: 'You need to be at “{0}” at {1}.', detNone: 'no detour', detPlus: 'detour +{0}', detSave: '{0} less travel', shotFrom: 'Photo:', shotMap: 'Show in Maps', fPhoto: 'Photography', prTitle: 'Photo route', prOpen: 'Photo route in Google Maps', prBy: 'Inspired by {0}’s guide on Instagram.', prKm: '{0} spots, about {1} km on foot.', prTile: '{0} spots · {1} km on foot · separate from the day route', prFar: 'Separate (by car)', prApart: 'separate', resetOrig: 'Back to the day’s original route', resetRoute: 'Undo my changes to “{0}”', resetRouteAsk: 'Go back to the “{0}” route as it was? The changes you made by hand on this day will be lost.', nRouteReset: '“{0}” route restored', resetAsk: 'Go back to the original plan for day {0}? That day’s changes will be lost.', fNight: 'At night', fMorning: 'Morning', fSunset: 'Sunset', fQuick: 'Short', fBooking: 'Booking needed', afCount: '{0} of {1}', afNone: 'No activity has all those filters.', afClear: 'Clear filters',
      wMidnight: 'Ends after midnight ({0})', crClosed: 'Closed', crNotFit: 'Doesn’t fit at {0}', crNotFitBody: 'With the locked activities and the day’s trips there is no room at that time. It stays where it was.',
      ssClash: 'Sunset ({0}) falls during “{1}”, which is locked: anything you add goes before or after.', travelGuide: 'Travel guide', sections: 'Sections',
      wxSunGood: 'Clear sunset (cloud {0}%)', wxSunMixed: 'Clouds at sunset ({0}%)', wxSunBad: 'Probably overcast at sunset ({0}%)', wxRainAt: 'Rain likely ({0}%)',
      soGood: 'clear', soMixed: 'some cloud', soBad: 'probably overcast', planB: 'Rain plan', maps: 'Maps',
      rainTitle: 'If it rains or is overcast', rainMore: 'Bad-weather plan', rainNone: 'No indoor plans nearby.',
      rainNoteSun: 'Cloud cover at sunset {0}% (rain {1}%). Indoor plans nearby:', rainNoteRain: 'At that time: rain {0}% ({1} mm). Indoor plans nearby:',
      routeShort: 'Route', mapBtn: 'Map', routesBtn: 'Routes', rtOpts: 'Options', rtTitle: 'Route in Google Maps', rtLeft: 'What’s left today, from where you are', rtAll: 'The whole day', rtPart: 'part {0} of {1}', rtStops: 'Stops',
      rtNear: 'Recommended nearby (not in the route)', rtNearShort: 'recommended', rtKml: 'Export the trip map (KML)',
      rtNote: 'Google Maps allows up to 9 intermediate stops per link (more go in parts) and cannot add loose markers to a route. To see everything together, export the map.',
      rtKmlHow: 'Open it at mymaps.google.com → Create map → Import. It then appears in the Google Maps app under Saved → Maps, with each day’s route and the recommendations.',
      nKml: 'Trip map exported', nSunBadT: 'Sunset probably overcast', nSunBadB: '{0}: cloud cover {1}%. Tap for indoor plans.',
      tgMuseum: 'Museums', tgSacred: 'Temples and churches', tgPalace: 'Castles and palaces', tgRuins: 'Ruins and history', tgPark: 'Parks and nature', tgCity: 'Squares and monuments', tgSunset: 'Good for sunset', tgNight: 'Best at night', tgMorning: 'Best in the morning', tgRain: 'Good if it rains', tgBooking: 'Book ahead', tgQuick: 'Quick stop',
      cLocked: 'Locked · {0}', cMoved: 'Moved after “{0}” to be on time',
      clashT: 'Sunset clashes with “{0}”', clashB: 'The sun sets at {0}, during a locked activity. Tap to choose.', clashPicked: 'Choice made. Tap to change it.',
      fixT: 'Schedule clash', fixB: 'With this order you arrive late to a locked activity. Tap to reorder.', nFixed: 'Day reordered',
      scEyebrow: 'Sunset clash', scTitle: 'Sunset ({0}) falls during “{1}”', scLead: '“{0}” is locked from {1} to {2}. What should we do with “{3}”?',
      scAfter: 'Keep “{0}” and do “{1}” after · {2}', scAfterNote: 'no sun; dark at {0}', scBefore: 'Do “{0}” before · {1}', scBeforeNote: 'in daylight, no sunset; the day is reordered if needed',
      scSwap: 'Swap “{0}” for another activity', scRemove: 'Remove “{0}” today', scKeep: 'Leave it as it is', scRec: 'recommended', scChosen: 'chosen',
      scNote: 'Locked activities (padlock) are always kept. You can change this choice any time from the day card.',
      nClashT: 'Day {0}: sunset clash', nClashB: 'The sun sets at {0} during “{1}”. Tap to choose.', nPicked: 'Day plan updated',
      ssTile: 'Sunset · {0}', ssHave: 'Today you watch it from “{0}”', ssTitle: 'Where to watch the sunset · {0}', ssLead: 'Places with a good view near where you will be. Add one and the guide places it at sunset.',
      ssAdd: 'Add at sunset', ssNone: 'No good sunset spots near today’s route.',
      slot_sunset: 'This gap is close to sunset ({0}): sunset spots first.', slot_night: 'This gap is after dark: evening plans first.', slot_morning: 'Morning gap: what looks best early comes first.',
      crTitle: 'Typical crowds', crAtPlan: 'at the planned time ({0})', crLow: 'Quiet', crMid: 'A few people', crHigh: 'Busy', crPeak: 'Peak time',
      crMove: 'Move to {0}', crPref: 'Chosen time: {0}', crPrefShort: 'Set for {0}', crPrefClear: 'Remove', crMoved: 'Activity moved', crNoBetter: 'There is no much quieter time for this activity.',
      crLive: 'Live in Google Maps', crNote: 'Estimate by type of place and day of the week, not live data. Google Maps shows real crowds when it has them.',
      langBtn: 'ES', langAria: 'Switch to Spanish'
    }
  };
  var lang = 'es';
  // datos del viaje para los textos: {dest}, {home}, {title}, {roads}, {cur}, {minor}; y textos propios del viaje (meta.strings)
  function meta() { return window.TRIP_META || {}; }
  function pick(o) { return o && typeof o === 'object' ? (o[lang] != null ? o[lang] : (o.es || '')) : (o == null ? '' : String(o)); }
  function tok(v) {
    var m = meta();
    return v.replace(/\{(dest|home|title|roads|cur|minor|ndays)\}/g, function (_, k) {
      if (k === 'ndays') return String((window.TRIP && TRIP.days || []).length);
      if (k === 'cur') return m.currency || '€';
      if (k === 'minor') return m.minor || '';
      return pick(m[k]);
    });
  }
  function t(k) {
    var ov = meta().strings, v = ov && ov[lang] && ov[lang][k] != null ? ov[lang][k] : null;
    if (v == null) v = (S[lang] && S[lang][k] != null) ? S[lang][k] : S.es[k];
    if (typeof v !== 'string') return v;
    v = tok(v);
    for (var i = 1; i < arguments.length; i++) v = v.split('{' + (i - 1) + '}').join(arguments[i]);
    return v;
  }

  /* Contenido: el español es la base; el inglés solo sustituye textos por id */
  var BASE = null;
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function apply(l) {
    if (!BASE) BASE = clone(TRIP);
    var src = clone(BASE), E = l === 'en' && window.TRIP_EN;
    if (E) {
      src.days.forEach(function (d) {
        var dd = E.days && E.days[d.id];
        if (dd) { if (dd.title) d.title = dd.title; if (dd.sub) d.sub = dd.sub; if (dd.ref) d.ref.name = dd.ref; if (dd.tips) d.tips.forEach(function (t, i) { if (dd.tips[i]) t.t = dd.tips[i]; }); }
        function ov(it) { var o = E.items && E.items[it.id]; if (!o) return; for (var k in o) { if (k === 'ifSkip') it.ifSkip.ti = o.ifSkip; else it[k] = o[k]; } }
        d.items.forEach(function (it) { ov(it); (it.alts || []).forEach(ov); });
        (d.extras || []).forEach(ov);
        var g = E.guide && E.guide[d.id];
        if (g && d.guide) d.guide.forEach(function (x, i) { if (g[i]) for (var k in g[i]) x[k] = g[i][k]; });
      });
      src.checklist.forEach(function (c) {
        var cc = E.checklist && E.checklist[c.id]; if (!cc) return;
        if (cc.title) c.title = cc.title;
        c.items.forEach(function (it) { var o = cc.items && cc.items[it.id]; if (o) { if (o.t) it.t = o.t; if (o.n) it.n = o.n; } });
      });
      ['events', 'souvenirs', 'route', 'links', 'driving', 'wx'].forEach(function (key) {
        if (E[key] && src[key]) src[key].forEach(function (x, i) { if (E[key][i]) for (var k in E[key][i]) x[k] = E[key][i][k]; });
      });
      if (E.types) for (var ty in E.types) if (src.types[ty]) src.types[ty].label = E.types[ty];
    }
    // mismo objeto TRIP (Core y View lo tienen referenciado): se vacía y se rellena
    Object.keys(TRIP).forEach(function (k) { delete TRIP[k]; });
    Object.keys(src).forEach(function (k) { TRIP[k] = src[k]; });
    lang = l;
    document.documentElement.setAttribute('lang', l);
  }
  return { t: t, apply: apply, get lang() { return lang; } };
})();
var L = I18N.t;

/* ===== Núcleo: sol, horas, plan ===== */
var Core = (function () {
  'use strict';
  var rad = Math.PI / 180, DAY = 864e5, J1970 = 2440588, J2000 = 2451545, J0 = 0.0009, e = rad * 23.4397;

  /* Cálculo solar (algoritmo tipo NOAA / SunCalc) */
  function toDays(ms) { return ms / DAY - 0.5 + J1970 - J2000; }
  function fromJulian(j) { return (j + 0.5 - J1970) * DAY; }
  function sunTimes(ms, lat, lon) {
    var lw = rad * -lon, phi = rad * lat, d = toDays(ms);
    var n = Math.round(d - J0 - lw / (2 * Math.PI));
    var ds = J0 + lw / (2 * Math.PI) + n;
    var M = rad * (357.5291 + 0.98560028 * ds);
    var C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    var L = M + C + rad * 102.9372 + Math.PI;
    var dec = Math.asin(Math.sin(e) * Math.sin(L));
    var noon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    function at(h) {
      var x = (Math.sin(h * rad) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
      if (x < -1 || x > 1) return null;
      var w = Math.acos(x);
      var a = J0 + (w + lw) / (2 * Math.PI) + n;
      var set = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
      return { rise: fromJulian(noon - (set - noon)), set: fromJulian(set) };
    }
    var s = at(-0.833), c = at(-6), g = at(6);
    return {
      rise: ukMin(s.rise), set: ukMin(s.set),
      dawn: c ? ukMin(c.rise) : null, dusk: c ? ukMin(c.set) : null,
      gold: g ? ukMin(g.set) : null, goldAm: g ? ukMin(g.rise) : null
    };
  }

  /* Hora local del destino (TRIP_META.tz, p. ej. «Europe/London»). Sin Intl: horario de verano europeo sobre TRIP_META.tzBase */
  function lastSun(y, m) { var d = new Date(Date.UTC(y, m + 1, 0, 1)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d.getTime(); }
  var tzFmt = {}, tzMemo = {};
  function tzOff(ms, tz) {   // minutos que hay que sumar a la hora UTC
    var M0 = window.TRIP_META || {};
    tz = tz || M0.tz || 'Europe/London';
    var key = tz + '|' + Math.floor(ms / 9e5);
    if (tzMemo[key] != null) return tzMemo[key];
    if (tzFmt[tz] === undefined) {
      try { tzFmt[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }); }
      catch (e) { tzFmt[tz] = null; }
    }
    var f = tzFmt[tz], off;
    if (f && f.formatToParts) {
      var p = {}; f.formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
      off = Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - Math.floor(ms / 6e4) * 6e4) / 6e4);
    } else {
      var y = new Date(ms).getUTCFullYear();
      off = (M0.tzBase || 0) + (ms >= lastSun(y, 2) && ms < lastSun(y, 9) ? 60 : 0);
    }
    return (tzMemo[key] = off);
  }
  function ukMin(ms) { var d = new Date(ms + tzOff(ms) * 6e4); return d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60; }
  function ukISO(ms) { return new Date(ms + tzOff(ms) * 6e4).toISOString().slice(0, 10); }

  function parseISO(iso) { var p = String(iso).split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2], 12); }
  function addDays(ms, n) { return ms + n * DAY; }
  function hm(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function fmt(m) { m = Math.round(m); m = ((m % 1440) + 1440) % 1440; var h = Math.floor(m / 60), mi = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi; }
  function dur(m) { m = Math.round(m); var h = Math.floor(m / 60), mi = m % 60; return h ? (h + ' h' + (mi ? ' ' + mi + ' min' : '')) : (mi + ' min'); }
  // km para mostrar: un decimal por debajo de 10 km y entero por encima; coma decimal en español
  function kmTxt(k) { k = +k || 0; k = k < 10 ? Math.round(k * 10) / 10 : Math.round(k); return String(k).replace('.', I18N.lang === 'en' ? '.' : ','); }
  function dateLabel(ms) {
    var d = new Date(ms), WD = L('WD'), MO = L('MO');
    return I18N.lang === 'en' ? WD[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()] : WD[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()];
  }
  function round5(m) { return Math.round(m / 5) * 5; }

  /* Plan de un día: horarios + avisos según la luz */
  function plan(day, ms, skipped, custom) {
    var month = new Date(ms).getUTCMonth() + 1;
    var sunRef = sunTimes(ms, day.ref.lat, day.ref.lon);
    var profile = sunRef.set < 17 * 60 ? 'short' : (sunRef.set >= 20 * 60 ? 'long' : 'mid');
    var off = [], list = [], byId = {};
    var startStr = profile === 'short' && day.startShort ? day.startShort : day.start;
    day.items.forEach(function (it) { byId[it.id] = it; });
    // 1 = quitada por ti, 0 = incluida por ti; las «ws» opcionales se quitan solas con poca luz
    function isSkip(id) {
      var it = byId[id]; if (!it) return false;
      if (holes[id] && !it.extra) return false;          // hueco libre: guarda su tiempo
      var u = skipped[id]; if (u === 1) return true; if (u === 0) return false;
      return !!(it.opt && it.ws && profile === 'short');
    }
    var cs = custom || {}, swaps = cs.swaps || {}, extras = (cs.extras || {})[day.id] || [], order = (cs.order || {})[day.id];
    var sunPos = (cs.sunPos || {})[day.id] || {}, prefAt = (cs.prefAt || {})[day.id] || {}, holes = (cs.gaps || {})[day.id] || {}, stays = cs.hotels || {}, freeAt = (cs.free || {})[day.id] || {}, dursR = (cs.durs || {})[day.id] || {};
    var replaced = {};
    function copy(it) {
      if (it.mo && it.mo.indexOf(month) < 0) { off.push(it); return null; }
      var x = {}, alt = it.alts && swaps[it.id] != null ? it.alts[swaps[it.id]] : null;
      if (alt) {
        for (var ka in alt) x[ka] = alt[ka]; x.id = it.id; x.opt = it.opt; x.ws = it.ws; x.alts = it.alts; x.swapped = swaps[it.id]; x.altId = alt.id;
        // la alternativa ocupa el hueco de la original: si era de puesta de sol, sigue en ese momento; si no, no se mueve a otro
        if (it.sun) { if (!alt.sun || alt.sun.ref !== it.sun.ref) x.sun = it.sun; } else delete x.sun;
        if (it.at && alt.at == null && !it.sun) x.at = it.at;     // y su hora (comida o fija)
      }
      else for (var k in it) x[k] = it[k];
      if (it.t === 'drive') x.skip = it['with'] ? isSkip(it['with']) : isSkip(it.id);
      else x.skip = it.extra ? false : isSkip(it.id);
      x.auto = !!(it.opt && x.skip && skipped[it.id] !== 1);
      // alojamiento (Preparar → Alojamiento): check-in de esa noche y desayuno/check-out del día siguiente van al hotel;
      // la hora de llegada que pongas es una hora fija (ancla)
      if (freeAt[it.id]) delete x.at;
      if (dursR[it.id] && !x.altId) x.d = dursR[it.id];   // la ruta elegida acorta o alarga esta parada           // la ruta elegida suelta esta hora
      var hst = it.stay && stays[it.stay];
      if (hst && it.t !== 'drive') {
        if (hst.lat != null) { x.origLat = it.lat; x.origLon = it.lon; x.origPl = it.pl; x.lat = hst.lat; x.lon = hst.lon; x.stayLoc = 1; }
        if (hst.img) { x.img = hst.img; x.ph = null; }
        if (hst.name) { x.pl = hst.name; x.q = hst.name + (hst.addr && !/^https?:/.test(hst.addr) ? ', ' + hst.addr : ''); x.ti = L(it.t === 'hotel' ? 'stayIn' : hst.bf === false ? 'stayOutNoBf' : 'stayOut', hst.name); }
        if (it.t === 'hotel' && hst.arr) x.at = hst.arr;
      }
      if (!it.extra && replaced[it.id]) { x.skip = true; x.hidden = true; x.auto = false; }
      else if (!it.extra && holes[it.id] && it.t !== 'drive') {
        var hz = holes[it.id];
        x.hole = 1; x.holeTi = x.ti; x.ti = L('holeTi'); x.skip = false; x.auto = false;
        delete x.cl; delete x.book; delete x.ws; delete x.opt; delete x.cost; delete x.tags;
        // hueco que dejó un reemplazo: ocupa lo que ocupaba él (duración y sitio) para que el resto no se mueva
        if (typeof hz === 'object') { if (hz.d) x.d = hz.d; if (hz.lat != null) { x.lat = hz.lat; x.lon = hz.lon; x.hloc = 1; } }
        if (!x.hloc) { x.holeLat = x.lat; x.holeLon = x.lon; x.lat = x.lon = null; }
      }
      if (it.ifSkip && isSkip(it.ifSkip.id)) { x.ti = it.ifSkip.ti; x.km = it.ifSkip.km; x.d = it.ifSkip.d; }
      return x;
    }
    // secuencia original (con los extras insertados delante de su actividad)
    var src = day.items.slice();
    extras.forEach(function (x) {
      var def = findDef(day, x); if (!def) return;      // si no se encuentra, la original no se oculta
      var o = {}; for (var k in def) o[k] = def[k]; o.id = x.uid; o.extra = def.id; byId[o.id] = o;
      delete o.at;                                       // un añadido nunca es un ancla
      if (o.lat == null) { o.lat = x.lat != null ? x.lat : day.ref.lat; o.lon = x.lon != null ? x.lon : day.ref.lon; }
      if (x.rep) {
        var org0 = byId[x.before];
        o.rep = 1; o.repOf = x.before; o.repTi = (org0 || {}).ti; replaced[x.before] = x.uid;
        // un reemplazo ocupa el hueco de la original: misma posición y, si era de puesta de sol, ese momento (no el suyo)
        delete o.after;
        if (org0 && org0.at && !org0.sun) o.at = org0.at;     // y su hora (comida orientativa o fija)
        var sunOk = (o.tags || []).indexOf('sunset') >= 0 || o.t === 'view' || o.t === 'walk';
        if (org0 && org0.sun && sunOk) o.sun = org0.sun.ref === 'set' ? { ref: 'set', off: Math.max(org0.sun.off || 0, -Math.max(15, (o.d || 30) - 15)) } : org0.sun;
        else delete o.sun;
      }
      // añadido «para ver la puesta de sol»: se coloca solo a la hora del atardecer
      if (x.sunAt && !o.sun && !x.rep) { o.sun = { ref: 'set', off: -Math.max(15, (o.d || 30) - 15) }; delete o.after; }
      var pos = -1; src.forEach(function (it, k) { if (it.id === (x.pos || x.before)) pos = k; });
      if (pos < 0) src.push(o); else src.splice(pos, 0, o);
    });
    var floats = src.filter(function (x) { return x.sun && x.t !== 'drive'; });
    // de dónde sales por la mañana: el alojamiento de la noche anterior (el día 1, el de esa misma ciudad)
    var TD = window.TRIP.days || [], dIx = -1; TD.forEach(function (d, k) { if (d.id === day.id) dIx = k; });
    var hPrev = dIx > 0 ? stays[TD[dIx - 1].id] : dIx === 0 ? stays[day.id] : null;
    var startPt = hPrev && hPrev.lat != null ? { id: 'stay-start', lat: hPrev.lat, lon: hPrev.lon, pl: hPrev.name || '', ti: hPrev.name || '' } : null;
    var actsOrig = [], drivesAfter = {}, lastA = '__start';
    src.forEach(function (x) { if (x.sun && x.t !== 'drive') return; if (x.t === 'drive') (drivesAfter[lastA] = drivesAfter[lastA] || []).push(x); else { actsOrig.push(x); lastA = x.id; } });
    var posOrig = {}; actsOrig.forEach(function (x, k) { posOrig[x.id] = k; });
    var acts = actsOrig.slice();
    if (order && order.length) {
      var rank = {}, befOf = {}; order.forEach(function (id, k) { rank[id] = k; });
      extras.forEach(function (x, n) { befOf[x.uid] = { b: x.before, n: n }; });
      // lo que no está en el orden (añadidos, reemplazos) va justo delante de su «before», donde esté ahora
      function rk(it, k) { if (rank[it.id] != null) return rank[it.id]; var bf = befOf[it.id]; if (bf && rank[bf.b] != null) return rank[bf.b] - 0.5 + bf.n * 0.001; return k - 0.5; }
      acts = acts.map(function (it, k) { return { it: it, r: rk(it, k) }; }).sort(function (q, w) { return q.r - w.r; }).map(function (z) { return z.it; });
    }
    function dist(p1, p2) {
      var R = 6371, dLa = (p2.lat - p1.lat) * rad, dLo = (p2.lon - p1.lon) * rad;
      var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(p1.lat * rad) * Math.cos(p2.lat * rad) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
      return 2 * R * Math.asin(Math.sqrt(h));
    }
    // ancla = actividad con hora fija (bloqueada). Las comidas tienen hora orientativa, no son anclas
    function isAnchor(it) { return !!(it && it.at && !it.sun && !it.soft && it.t !== 'food'); }
    function closeAt(it) { return hm(month >= 4 && month <= 9 ? it.cl[0] : it.cl[1]); }

    // modo de moverse del día (car | walk | transit) y si se crean tramos aunque los datos no los traigan
    var MM = window.TRIP_META || {}, legMode = day.mode || MM.mode || 'car', autoLegs = !!(day.autoLegs != null ? day.autoLegs : MM.autoLegs);
    var legMin = legMode === 'walk' || legMode === 'transit' ? 0.4 : 1.5;
    function addLeg(lst, a, b, same, force) {
      var walk = force ? force === 'walk' : legMode === 'walk', bus = force ? force === 'transit' : legMode === 'transit';
      var km = dist(a, b) * (walk ? 1.3 : 1.35);
      if (km <= (force ? 0.2 : legMin)) return;
      if (!force && walk) { var wr0 = travel(a, b, 'walk'); if ((wr0 ? wr0.km : km) > 3.5) { walk = false; bus = true; } }  // en un día a pie, lo lejano en transporte
      if (bus && km < 1.5) { walk = true; bus = false; }   // en transporte público, lo cercano se hace a pie
      // tiempo real (OSRM; en coche + 5 min para aparcar) si el tramo está en la tabla; si no, estimado por distancia.
      // En transporte público no hay datos gratis fiables: se estima con el coche (× 1,6 + 10 min de esperas)
      var r = travel(a, b, walk ? 'walk' : 'car');
      if (r) km = r.km;
      var d = bus ? (r ? round5(r.min * 1.6 + 10) : round5(km / 15 * 60 + 8)) : r ? round5(r.min + (walk ? 0 : 5)) : walk ? round5(km / 4.5 * 60) : round5(km / 55 * 60 + 5);
      lst.push({ id: 'auto-' + a.id + '-' + b.id, t: 'drive', mode: walk ? 'walk' : bus ? 'transit' : 'car', autoLeg: 1,
        ti: a.pl && b.pl && a.pl !== b.pl ? a.pl + ' → ' + b.pl : L('toX', b.ti),
        km: km < 10 ? Math.round(km * 10) / 10 : Math.round(km), d: Math.max(5, d), lat: b.lat, lon: b.lon, oLat: a.lat, oLon: a.lon, scenic: !walk && !bus && km > 30 ? 1 : 0,
        real: r && !bus ? 1 : 0, tips: [L(bus ? 'autoLegT' : r ? (walk ? 'autoLegW' : same ? 'autoLegModeR' : 'autoLegR') : (same ? 'autoLegMode' : 'autoLeg'))] });
    }

    // entre dos actividades sin tramo de la guía: el paseo cuenta en el horario (o el coche / transporte si es largo)
    function shortLeg(lst, a, b) {
      if (!a || a.lat == null || b.lat == null || dist(a, b) < 0.15) return;
      var w = travel(a, b, 'walk'), wm = w ? w.min : dist(a, b) * 1.3 / 4.5 * 60, wk = w ? w.km : dist(a, b) * 1.3;
      // a recoger el coche de alquiler aún no hay coche: andando o en transporte público
      if (wm <= 25) addLeg(lst, a, b, true, 'walk');
      else if (legMode === 'car' && !b.pickup) addLeg(lst, a, b, true, 'car');
      else addLeg(lst, a, b, true, wk > 3.5 || b.pickup ? 'transit' : 'walk');
    }
    // lista del día para un orden dado. Tramos de la guía solo entre dos actividades originales, en su sitio y seguidas;
    // si no (añadidos, alternativas, otro orden), tramo estimado entre los sitios reales
    var fIdeal = {};
    function buildList(ord, fAt) {
      off = [];
      var lst = [], prev = null, prevX = null, started = false;
      ord.forEach(function (it) {
        var x = copy(it); if (!x) return;
        // primera actividad del día que no es en el propio hotel: tramo desde el alojamiento (se sale antes, no retrasa nada)
        if (!started && !x.skip && x.t !== 'drive') {
          started = true;
          if (startPt && !x.stay && x.lat != null) { var nS = lst.length; shortLeg(lst, startPt, x); if (lst.length > nS) lst[lst.length - 1].fromStay = 1; }
        }
        if (fAt && fAt[it.id] != null) { x.atMin = fAt[it.id]; x.sunIdeal = fIdeal[it.id]; }
        else if (prefAt[it.id] && !x.skip && !isAnchor(x)) { x.atMin = hm(prefAt[it.id]); x.pref = prefAt[it.id]; }
        if (x.skip) { lst.push(x); return; }
        // viaje a otra ciudad: su duración ya lo cuenta todo; lo siguiente sale de la nueva ciudad
        if (it.jump) { lst.push(x); prev = it; prevX = x; return; }
        if (it.sun) {
          // atardecer: si está cerca de donde estás, sin tramo; si está lejos, se va hasta allí y lo siguiente sale desde ahí
          var far = prevX && prevX.lat != null && x.lat != null && dist(prevX, x) * 1.35 > (autoLegs || it.extra ? legMin : 5);
          if (far) { addLeg(lst, prevX, x, false); prev = it; }
          else { shortLeg(lst, prevX, x); if (!prev) prev = it; }
          if (x.lat != null) prevX = x;          // lo siguiente sale desde aquí
          lst.push(x); return;
        }
        if (prev) {
          var orig = !it.extra && !prev.extra && !prev.sun && !x.altId && !prevX.altId && !x.hloc && !prevX.hloc && posOrig[prev.id] != null && posOrig[it.id] != null;
          var pa = posOrig[prev.id], pb = posOrig[it.id], same = orig && pb > pa;
          var drsIn = []; for (var j0 = pa; same && j0 < pb; j0++) (drivesAfter[actsOrig[j0].id] || []).forEach(function (dr) { drsIn.push(dr); });
          for (var j = pa + 1; same && j < pb; j++) {
            var mid = actsOrig[j]; if (mid.extra) continue;
            var offS = mid.mo && mid.mo.indexOf(month) < 0;
            if (!(isSkip(mid.id) || replaced[mid.id] || offS)) same = false;
            // quitado sin tramo previsto en la guía para ese caso: tramo directo calculado
            else if (!offS && !drsIn.some(function (dr) { return dr.ifSkip && dr.ifSkip.id === mid.id; })) same = false;
          }
          var pushed = 0, n0 = lst.length, drs = [];
          if (same) drsIn.forEach(function (dr) { var dx = copy(dr); if (dx) drs.push(dx); });
          var liveD = drs.filter(function (d) { return !d.skip; });
          if (same && liveD.length) {
            // sales de tu hotel: tramo corto hasta donde empieza el trayecto de la guía (el centro del pueblo)
            if (prevX.stayLoc && prevX.origLat != null) shortLeg(lst, prevX, { id: prev.id + '-o', lat: prevX.origLat, lon: prevX.origLon, pl: prevX.origPl, ti: prevX.origPl });
            // el último tramo de la guía termina donde vas de verdad (si lo de en medio se quitó o la parada está a un paso)
            var lastD = liveD[liveD.length - 1];
            if (x.lat != null && !x.stayLoc && lastD.lat != null && dist(lastD, x) > 0.3) { lastD.lat = x.lat; lastD.lon = x.lon; }
            drs.forEach(function (d) { lst.push(d); }); pushed = liveD.length;
            // llegas a tu hotel: tramo corto desde donde acaba el trayecto de la guía
            if (x.stayLoc && x.origLat != null) shortLeg(lst, { id: it.id + '-i', lat: x.origLat, lon: x.origLon, pl: x.origPl, ti: x.origPl }, x);
          } else if (same) drs.forEach(function (d) { lst.push(d); });
          if ((!same || (!pushed && autoLegs)) && prevX.lat != null && x.lat != null) addLeg(lst, prevX, x, same);
          if (!lst.slice(n0).some(function (d) { return !d.skip; })) shortLeg(lst, prevX, x);   // nada entre medias: el paseo también lleva su tiempo
        }
        lst.push(x);
        prev = it; if (x.lat != null) prevX = x;
      });
      return lst;
    }

    function schedule(arr) {
      var t = hm(startStr), out = [];
      var f0 = arr.filter(function (z) { return !z.skip; })[0]; if (f0 && f0.fromStay) t -= f0.d;   // sales del hotel con tiempo
      arr.forEach(function (it) {
        if (it.skip) { out.push({ it: it, start: t, end: t, skip: true }); return; }
        var earliest = it.atMin != null ? it.atMin : (it.at ? hm(it.at) : null);
        var gap = 0;
        if (earliest != null && earliest > t) { gap = earliest - t; t = earliest; }
        out.push({ it: it, start: t, end: t + it.d, gap: gap });
        t += it.d;
      });
      return out;
    }

    // Lo ligado al sol entra en el orden del día: lo más cerca posible de su hora ideal sin retrasar anclas, sin quedarse
    // a oscuras, sin llegar a sitios cerrados y sin rodeos. Si la hora ideal cae dentro de la hora reservada de un ancla,
    // es un choque: gana el ancla y el usuario elige si va antes o después (sunPos)
    var BACK = [0, 5, 10, 15, 20, 30, 45, 60, 90, 120, 180];
    function placeFloats(ord) {
      var cur = ord.slice(), fAt = {}, clashes = [];
      floats.forEach(function (f0) {
        var fx = copy(f0);
        if (!fx || fx.skip) { cur.push(f0); return; }       // fuera de temporada o quitada: buildList la trata
        var lat = fx.lat != null ? fx.lat : day.ref.lat, lon = fx.lon != null ? fx.lon : day.ref.lon;
        var s = sunTimes(ms, lat, lon), ideal = round5(s[fx.sun.ref] + fx.sun.off);
        fIdeal[f0.id] = ideal;
        if (fx.after) {
          var ia = cur.length; cur.forEach(function (b, i) { if (b.id === fx.after) ia = i + 1; });
          fAt[f0.id] = ideal; cur.splice(ia, 0, f0); return;
        }
        var anc = null;
        cur.forEach(function (a) {
          if (anc || a.sun) return; var ax = copy(a);
          if (!ax || ax.skip || !isAnchor(ax)) return;
          var s0 = hm(ax.at), e0 = s0 + ax.d; if (s0 < ideal + fx.d && e0 > ideal) anc = ax;
        });
        var pick = sunPos[f0.id] || '', best = null;
        if (anc && (pick === 'after' || pick === 'before')) {
          var ai = 0; cur.forEach(function (b, i) { if (b.id === anc.id) ai = i; });
          best = pick === 'after' ? { c: ai + 1, at: hm(anc.at) + anc.d } : { c: ai, at: Math.min(ideal, hm(anc.at) - fx.d - 5) };
        } else {
          var idxOf = {}; cur.forEach(function (b, i) { idxOf[b.id] = i; });
          var natural = 0;
          schedule(buildList(cur, fAt)).forEach(function (e) { if (!e.skip && e.it.t !== 'drive' && e.end <= ideal + 15 && idxOf[e.it.id] != null) natural = idxOf[e.it.id] + 1; });
          var cands = {};
          for (var c = natural - 2; c <= natural + 3; c++) if (c >= 0 && c <= cur.length) cands[c] = 1;
          cur.forEach(function (b, i) { if (!b.sun && isAnchor(b)) { cands[i] = 1; cands[i + 1] = 1; } });
          Object.keys(cands).forEach(function (cs0) {
            var cc = +cs0, tmp = cur.slice(); tmp.splice(cc, 0, f0);
            for (var bi = 0; bi < BACK.length; bi++) {
              fAt[f0.id] = ideal - BACK[bi];
              var pen = Math.abs(cc - natural) * 0.01, fe = null, travel = 0;
              schedule(buildList(tmp, fAt)).forEach(function (e) {
                if (e.skip) return; var it = e.it;
                if (it.t === 'drive') { travel += e.end - e.start; return; }
                if (it.id === f0.id) {
                  fe = e; var dev0 = Math.abs(e.start - ideal); pen += dev0 + Math.max(0, dev0 - 45) * 4;
                  if (fx.sun.ref === 'set' && e.end < s.set) pen += (s.set - e.end) * 4;   // si acaba antes de que se ponga el sol, no la ves
                  if (e.end > s.set + 20) pen += (e.end - s.set - 20) * 3;
                  if (e.start >= s.dusk) pen += 200;
                  return;
                }
                if (it.at && !it.sun) pen += Math.max(0, e.start - hm(it.at)) * (isAnchor(it) ? 15 : 2);
                if (it.light && e.end > s.set + 20) pen += e.end - s.set - 20;
                if (it.cl && e.end > closeAt(it)) pen += 60;
              });
              pen += travel * 0.3;
              if (!best || pen < best.pen - 1e-6) best = { pen: pen, c: cc, at: fAt[f0.id] };
              if (!fe || fe.start > fAt[f0.id]) break;
            }
          });
        }
        if (anc) clashes.push({ id: f0.id, ti: fx.ti, d: fx.d, ideal: ideal, set: s.set, dusk: s.dusk, anc: anc.id, ancTi: anc.ti, ancAt: anc.at, ancEnd: hm(anc.at) + anc.d, pick: pick });
        fAt[f0.id] = best.at; cur.splice(best.c, 0, f0);
      });
      return { ord: cur, fAt: fAt, clashes: clashes };
    }

    // cuánto «duele» un horario: anclas tarde, sol lejos de su hora, cosas a oscuras o cerradas, rodeos, pasarse de medianoche
    function dayPen(seq) {
      var pen = 0, last = 0;
      seq.forEach(function (e) {
        if (e.skip) return; var it = e.it; last = Math.max(last, e.end);
        if (it.t === 'drive') { pen += (e.end - e.start) * 0.25; return; }
        if (it.at && !it.sun) pen += Math.max(0, e.start - hm(it.at)) * (isAnchor(it) ? 15 : 2);
        if (it.sun && it.sunIdeal != null) pen += Math.abs(e.start - it.sunIdeal) * 0.5;
        if (it.light) { if (e.start >= sunRef.dusk) pen += 120; else if (e.end > sunRef.set + 20) pen += e.end - sunRef.set - 20; }
        if (it.cl && e.end > closeAt(it)) pen += 60;
      });
      if (last > 1440) pen += (last - 1440) * 2;
      return pen;
    }
    var memo = {};
    function compose(ord) {
      var key = ord.map(function (a) { return a.id; }).join('|');
      if (memo[key]) return memo[key];
      var pf = placeFloats(ord), sq = schedule(buildList(pf.ord, pf.fAt));
      return (memo[key] = { ord: ord, clashes: pf.clashes, ev: sq, pen: dayPen(sq) });
    }

    for (var hi = 0; hi < acts.length - 1; hi++) {
      var ha = acts[hi], hb = acts[hi + 1], hs0 = ha.stay && stays[ha.stay];
      if (ha.t === 'hotel' && hs0 && hs0.arr && hb.at && !hb.sun && hm(hb.at) < hm(hs0.arr) && hb.lat != null && dist(hs0.lat != null ? hs0 : ha, hb) <= 2) { acts[hi] = hb; acts[hi + 1] = ha; }
    }
    // hora preferida (p. ej. «cuando hay menos gente»): el hueco que más se acerca a esa hora contando trayectos y anclas
    Object.keys(prefAt).forEach(function (id) {
      var k = -1; acts.forEach(function (a, i) { if (a.id === id) k = i; });
      if (k < 0 || isAnchor(acts[k]) || acts[k].sun) return;
      var a = acts[k], rest = acts.slice(); rest.splice(k, 1);
      var target = hm(prefAt[id]), best = null;
      for (var c = 0; c <= rest.length; c++) {
        var o2 = rest.slice(); o2.splice(c, 0, a);
        var r = compose(o2), st = null;
        r.ev.forEach(function (e) { if (e.it.id === id && !e.skip) st = e.start; });
        var cost = r.pen + (st == null ? 999 : Math.abs(st - target) * 1.5);
        if (!best || cost < best.cost) best = { cost: cost, ord: o2 };
      }
      acts = best.ord;
    });

    // choques: si algo hace llegar tarde a un ancla, se pasa detrás de ella cuando así el día queda mejor. Se prueban
    // todas las anclas que llegan tarde, no solo la primera. Con un orden puesto a mano no se toca: se propone (fix)
    var trial = compose(acts), firstTry = trial, movedBy = {}, adj = trial.pen;
    for (var rep = 0; rep < 8; rep++) {
      var lates = trial.ev.filter(function (e) { return !e.skip && isAnchor(e.it) && e.it.t !== 'hotel' && e.start > hm(e.it.at) + 1; });
      if (!lates.length) break;
      var bestT = null;
      for (var li = 0; li < lates.length && !bestT; li++) {
        var lateId = lates[li].it.id, lateTi = lates[li].it.ti, lp = -1;
        trial.ord.forEach(function (a, kk) { if (a.id === lateId) lp = kk; });
        var fu = -1; trial.ord.forEach(function (a, kk) { if (fu < 0 && (a.extra || holes[a.id] || swaps[a.id] != null)) fu = kk; });
        for (var k2 = 0; k2 < lp; k2++) {
          var a2 = trial.ord[k2];
          if (a2.extra || holes[a2.id] || swaps[a2.id] != null || (fu >= 0 && k2 < fu)) continue;   // lo que has puesto tú y lo de antes no se mueve solo
          if (isAnchor(a2) || a2.t === 'food' || a2.t === 'hotel' || a2.t === 'car' || a2.sun || (isSkip(a2.id) && !a2.extra) || replaced[a2.id]) continue;
          var base3 = trial.ord.slice(); base3.splice(k2, 1);
          var fi = -1; base3.forEach(function (b, kk) { if (b.id === lateId) fi = kk; });
          for (var ins = fi + 1; ins <= Math.min(base3.length, fi + 4); ins++) {
            var o3 = base3.slice(); o3.splice(ins, 0, a2);
            var r3 = compose(o3), p3 = r3.pen + 3 * (rep + 1) + (ins - fi - 1) * 0.5;
            if (p3 < adj - 1 && (!bestT || p3 < bestT.p)) bestT = { r: r3, p: p3, mv: a2.id, by: lateTi };
          }
        }
      }
      if (!bestT) break;
      movedBy[bestT.mv] = bestT.by; trial = bestT.r; adj = bestT.p;
    }
    var fixOrder = null, moved = {};
    if (trial !== firstTry) {
      if (order && order.length) fixOrder = { order: trial.ord.map(function (a) { return a.id; }), clearPref: Object.keys(movedBy).filter(function (id) { return prefAt[id]; }) };
      else { acts = trial.ord; moved = movedBy; }
    }
    var pfF = placeFloats(acts), base = buildList(pfF.ord, pfF.fAt), sunClashes = pfF.clashes;

    var ev = schedule(base);
    var warns = [], km = 0, driveMin = 0, darkDrive = 0, pastMid = false;
    ev.forEach(function (e) {
      var it = e.it; e.warn = [];
      if (e.skip) return;
      var s = sunTimes(ms, it.lat || day.ref.lat, it.lon || day.ref.lon);
      e.sun = s;
      if (it.t === 'drive' && (!it.mode || it.mode === 'car')) {
        km += it.km || 0; driveMin += it.d;
        var dk = Math.max(0, e.end - Math.max(e.start, s.dusk)) + Math.max(0, Math.min(e.end, s.dawn) - e.start);
        darkDrive += dk;
        if (it.scenic && dk > it.d * 0.5) e.warn.push({ k: 'dark', t: L('wNightDrive') });
      }
      if (it.light && it.t !== 'drive') {
        if (e.start >= s.dusk) e.warn.push({ k: 'dark', t: L('wDark', fmt(s.dusk)) });
        else if (e.end > s.set + 20) e.warn.push({ k: 'dark', t: L('wAfterSet', dur(e.end - s.set)) });
        if (e.start < s.rise - 5) e.warn.push({ k: 'dark', t: L('wBeforeRise', fmt(s.rise)) });
      }
      if (it.at && !it.sun && e.start > hm(it.at) + (isAnchor(it) ? 1 : 5)) e.warn.push({ k: 'late', t: L('wLate', it.at, fmt(e.start)) });
      if (it.cl) {
        var c = closeAt(it);
        if (e.end > c) e.warn.push({ k: 'closed', t: L('wClosed', fmt(c)) });
      }
      if (e.end > 1440 && !pastMid) { pastMid = true; e.warn.push({ k: 'late', t: L('wMidnight', fmt(e.end)) }); }
      e.warn.forEach(function (w) { warns.push({ id: it.id, ti: it.ti, t: w.t, k: w.k }); });
      if (it.sun) { e.golden = true; e.sunIdeal = it.sunIdeal; }
      e.locked = isAnchor(it);
      if (moved[it.id]) e.moved = moved[it.id];
    });

    var live = ev.filter(function (e) { return !e.skip; });
    var markers = [];
    var first = live.length ? live[0].start : hm(startStr), last = live.length ? live[live.length - 1].end : first;
    function mk(t, label, cls, icon) { if (t != null && t > first - 1 && t < last + 1) markers.push({ t: t, label: label, cls: cls || '', icon: icon }); }
    mk(sunRef.rise, L('mkRise'), '', 'sunrise');
    mk(sunRef.gold, L('mkGold'), '', 'sun');
    mk(sunRef.set, L('mkSet'), '', 'sunset');
    mk(sunRef.dusk, L('mkDusk'), 'night', 'moon');

    return {
      day: day, ms: ms, month: month, sun: sunRef, profile: profile, ev: ev, live: live, off: off,
      markers: markers, warns: warns, km: km, driveMin: driveMin, darkDrive: darkDrive, first: first, last: last, clashes: sunClashes, fix: fixOrder
    };
  }

  // ideas de todo el viaje (extras y alternativas), sin repetir sitio
  function pool(T) {
    var out = [], seen = {};
    function add(x) { var key = String(x.ti).toLowerCase(); if (seen[x.id] || seen[key]) return; seen[x.id] = seen[key] = 1; out.push(x); }
    T.days.forEach(function (d) { (d.extras || []).forEach(add); });
    T.days.forEach(function (d) { d.items.forEach(function (it) { (it.alts || []).forEach(add); }); });
    return out;
  }
  // tiempos reales precalculados (OSRM sobre OpenStreetMap, sin conexión): coche y a pie entre los sitios de la guía
  var TV = null;
  function tvData() {
    if (TV !== null) return TV;
    var W = window.TRAVEL; if (!W || !W.k) return (TV = false);
    function dec(str) { return str.split(',').map(function (x) { return x === '' ? -1 : parseInt(x, 36); }); }
    var ix = {}; W.k.forEach(function (k, n) { ix[k] = n; });
    return (TV = { ix: ix, n: W.k.length, cm: dec(W.cm), ck: dec(W.ck), fm: dec(W.fm), fk: dec(W.fk) });
  }
  // { min, km } de a hasta b (mode 'walk' o coche), o null si alguno no está en la tabla
  function travel(a, b, mode) {
    var D = tvData(); if (!D || !a || !b || a.lat == null || b.lat == null) return null;
    var i = D.ix[(+a.lat).toFixed(4) + ',' + (+a.lon).toFixed(4)], j = D.ix[(+b.lat).toFixed(4) + ',' + (+b.lon).toFixed(4)];
    if (i == null || j == null) return null;
    var st = km(a, b); if (st < 0.25) return { min: 0, km: st };          // mismo sitio (puntos casi iguales)
    var w = mode === 'walk', M = w ? D.fm : D.cm, K = w ? D.fk : D.ck, p = i * D.n + j, q = j * D.n + i, m = M[p], k = K[p];
    if (m < 0) return null;
    if (M[q] >= 0 && M[q] < m) { m = M[q]; k = K[q]; }                    // ida y vuelta: el menor (quita rodeos por mal ajuste)
    k = Math.max(k / 10, st); if (w) m = Math.max(m, k / 5.5 * 60);       // nunca menos que la línea recta ni más rápido que 5,5 km/h
    return { min: m, km: k };
  }
  function km(a, b) {
    var R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  // definición de un plan añadido: del día, de cualquier otro día o un sitio de la guía (g-<día>-<n>)
  function findDef(day, x) {
    var T = window.TRIP, def = null;
    function chk(e) { if (!def && e && e.id === x.id && e.t !== 'drive') def = e; }
    (day.extras || []).forEach(chk);
    T.days.forEach(function (d) { (d.extras || []).forEach(chk); d.items.forEach(function (it) { chk(it); (it.alts || []).forEach(chk); }); });
    var gm = !def && /^g-(\w+)-(\d+)$/.exec(x.id);
    if (gm) {
      var gd = T.days.filter(function (d) { return d.id === gm[1]; })[0], g = gd && (gd.guide || [])[+gm[2]];
      if (g) def = { id: x.id, t: g.k === 'pub' ? 'night' : g.k === 'shop' ? 'shop' : 'food', ti: x.meal ? L('meal_' + x.meal, g.n) : g.n, pl: g.pl, d: x.d || (g.k === 'shop' ? 30 : 60), lat: x.lat, lon: x.lon, lead: g.t, ph: g.ph, q: g.n };
    }
    var sm = !def && /^s-(\d+)$/.exec(x.id), sv = sm && (T.souvenirs || [])[+sm[1]];
    if (sv) def = { id: x.id, t: 'shop', ti: L('buyX', sv.n), pl: String(sv.w || '').split(/[,;]/)[0], d: x.d || 30, lat: x.lat, lon: x.lon, lead: sv.t + (sv.w ? ' · ' + sv.w : ''), ph: sv.ph };
    return def || null;
  }

  return {
    pool: pool, km: km, travel: travel, sunTimes: sunTimes, tzOff: tzOff, ukMin: ukMin, ukISO: ukISO, parseISO: parseISO, addDays: addDays,
    hm: hm, fmt: fmt, dur: dur, kmTxt: kmTxt, dateLabel: dateLabel, plan: plan
  };
})();

/* ===== Render: HTML como texto (sirve también para el prerender sin JS) ===== */
var View = (function () {
  'use strict';
  var C = Core, T = TRIP;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(n, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  // «Nombre: texto» → nombre en negrita
  function rich(s) { s = esc(s); var i = s.indexOf(': '); return i > 0 && i < 60 ? '<b>' + s.slice(0, i) + '</b> ' + s.slice(i + 2) : s; }
  function pct(m) { return Math.max(0, Math.min(100, (m - 360) / 1080 * 100)); }
  function hshort(m) { m = Math.round(m); var h = Math.floor(m / 60), mi = m % 60; return h + ' h ' + (mi < 10 ? '0' : '') + mi; }
  function tyIcon(t) { return (T.types[t] || T.types.walk).icon; }

  /* Mapas: siempre Google Maps (en iPhone abre la app si está instalada) */
  // datos del viaje: moneda y región para buscar en Google Maps
  function meta() { return window.TRIP_META || {}; }
  function cur() { return meta().currency || '€'; }
  function region() { var r = meta().region; return r ? ', ' + r : ''; }
  function gmaps(it, drive) {
    var ll = it.q ? encodeURIComponent(it.q + ', ' + (it.pl || '') + region()) : it.lat + ',' + it.lon;
    if (/^s-/.test(it.extra || '') && !drive) ll = encodeURIComponent((it.pl || it.ti) + region());
    return drive ? 'https://www.google.com/maps/dir/?api=1&destination=' + ll + '&travelmode=' + (it.mode === 'walk' ? 'walking' : it.mode === 'transit' ? 'transit' : 'driving')
                 : 'https://www.google.com/maps/search/?api=1&query=' + ll;
  }
  function gsearch(name, place) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ', ' + place + region()); }
  function mapBtn(href, label) { return '<a class="btn navy sq" href="' + href + '" target="_blank" rel="noopener">' + ic('map') + esc(label || 'Google Maps') + '</a>'; }
  function ring(p, label, cls, id) {
    return '<div class="ring ' + cls + (p ? '' : ' zero') + '"' + (id ? ' id="' + id + '"' : '') + ' style="--p:' + p.toFixed(3) + '"><svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="15.9" pathLength="100"/>' +
      '<circle class="fg" cx="20" cy="20" r="15.9" pathLength="100"/></svg><span>' + label + '</span></div>';
  }
  // Carrusel con flechas (solo se ven con ratón) y arrastre con ratón
  function hs(inner, cls, attrs) {
    return '<div class="hs-wrap rv"><div class="hscroll ' + (cls || '') + '"' + (attrs || '') + '>' + inner + '</div>' +
      '<button type="button" class="hs-btn prev js-only" data-hs="-1" aria-label="‹">' + ic('chev') + '</button>' +
      '<button type="button" class="hs-btn next js-only" data-hs="1" aria-label="›">' + ic('chev') + '</button></div>';
  }
  function sh(title, n, extra) { return '<div class="sh"><h3>' + title + '</h3>' + (n != null ? '<span class="n">' + n + '</span>' : '') + (extra || '') + '</div>'; }

  /* ---------- Arco solar ---------- */
  var AW = 340, AH = 124, HZ = 80;
  function ax(t) { return 10 + t / 1440 * 320; }
  function tFromX(x) { return Math.max(0, Math.min(1439, (x - 10) / 320 * 1440)); }
  function arcFn(s) {
    var noon = (s.rise + s.set) / 2, half = (s.set - s.rise) / 2, c0 = Math.cos(2 * Math.PI * half / 1440);
    var K = 50 / Math.max(1 - c0, 0.55);
    return function (t) { var v = Math.cos(2 * Math.PI * (t - noon) / 1440) - c0; return Math.max(6, Math.min(AH - 2, HZ - K * v)); };
  }
  function path(f, a, b, step) {
    var d = '';
    for (var t = a; t <= b + 0.01; t += step) d += (d ? ' L' : 'M') + ax(Math.min(t, b)).toFixed(1) + ' ' + f(Math.min(t, b)).toFixed(1);
    return d;
  }
  // De día, el sol sigue su arco. De noche se queda medio hundido en el horizonte y sale la luna.
  function arcXY(s, t) {
    if (t >= s.rise && t <= s.set) return { x: ax(t), y: arcFn(s)(t), night: false };
    var nl = 1440 - (s.set - s.rise), p = t > s.set ? (t - s.set) / nl : (t + 1440 - s.set) / nl;
    return { x: ax(t > s.set ? s.set : s.rise), y: HZ, night: true, mx: ax(t), my: HZ - 16 - 34 * Math.sin(Math.PI * p) };
  }
  function sunArc(p, i) {
    var s = p.sun, f = arcFn(s);
    var day = path(f, s.rise, s.set, 5);
    var fill = day + ' L' + ax(s.set).toFixed(1) + ' ' + HZ + ' L' + ax(s.rise).toFixed(1) + ' ' + HZ + ' Z';
    function lab(t, txt, anchor) {
      var x = ax(t).toFixed(1);
      return '<g class="arc-t" data-time="' + Math.round(t) + '" data-tday="' + i + '"><rect x="' + (anchor === 'end' ? x - 62 : x) + '" y="' + (HZ + 4) + '" width="62" height="34" fill="transparent"/>' +
        '<line class="tick" x1="' + x + '" y1="' + (HZ - 4) + '" x2="' + x + '" y2="' + (HZ + 4) + '"/>' +
        '<text class="lbl" x="' + x + '" y="' + (HZ + 19) + '" text-anchor="' + anchor + '">' + C.fmt(t) + '</text>' +
        '<text class="lbl2" x="' + x + '" y="' + (HZ + 32) + '" text-anchor="' + anchor + '">' + txt + '</text></g>';
    }
    return '<svg class="sunarc" viewBox="0 0 ' + AW + ' ' + AH + '" data-arc="' + i + '" role="img" aria-label="' + esc(L('arcAria', C.fmt(s.rise), C.fmt(s.set))) + '">' +
      '<clipPath id="hz' + i + '"><rect x="-20" y="-40" width="' + (AW + 40) + '" height="' + (HZ + 40) + '"/></clipPath>' +
      '<path class="dayfill" d="' + fill + '"/><path class="daycurve" d="' + day + '"/>' +
      '<path class="gold" d="' + path(f, s.gold, s.set, 4) + '"/><path class="gold" d="' + path(f, s.rise, s.goldAm, 4) + '"/>' +
      '<line class="hz" x1="6" y1="' + HZ + '" x2="' + (AW - 6) + '" y2="' + HZ + '"/>' +
      lab(s.rise, L('mkRise'), 'end') + lab(s.set, L('sunsetW'), 'start') +
      '<g class="moon"><path transform="translate(-9 -9) scale(.75)" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></g>' +
      '<g clip-path="url(#hz' + i + ')"><g class="sun"><circle class="h" r="13"/><circle class="c" r="6.5"/></g></g>' +
      '<g class="sun-ui"><line class="sun-guide" x1="0" y1="8" x2="0" y2="8"/><text class="sun-t" y="-15" text-anchor="middle"></text></g></svg>';
  }

  /* ---------- Preparar ---------- */
  function langToggle() {
    var l = I18N.lang;
    return '<div class="lang js-only" role="group" aria-label="Idioma / Language"><button type="button" data-lang="es"' + (l === 'es' ? ' class="on"' : '') + '>ES</button><button type="button" data-lang="en"' + (l === 'en' ? ' class="on"' : '') + '>EN</button></div>';
  }
  function factIcon(f) {
    return /castillo|castle|palacio|palace|torre|tower/i.test(f) ? 'castle' : /unesco|patrimonio|heritage/i.test(f) ? 'flag' : /batalla|battle|guerra|war/i.test(f) ? 'flag'
      : /\b1[0-9]{3}\b|\b20[0-9]{2}\b/.test(f) ? 'calendar' : /lago|loch|río|river|mar|sea|cascada|falls/i.test(f) ? 'waves' : /km|millas|miles|carretera|road/i.test(f) ? 'road' : 'bulb';
  }
  function routePanels() {
    return (T.route || []).map(function (r, k) {
      var tx = '<p class="rsp-lead rx-i" style="--s:.16">' + esc(r.t) + '</p>' +
        '<ul class="rsp-facts">' + r.facts.map(function (f, n) { return '<li class="rx-i" style="--s:' + (0.3 + n * 0.11).toFixed(2) + '"><span class="rf-i">' + ic(factIcon(f)) + '</span><span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' +
        '<div class="rsp-must rx-i" style="--s:.66"><div><small>' + L('mustSee') + '</small>' + esc(r.must) + '</div></div>' +
        (r.go ? '<div class="btn-row js-only rx-i" style="--s:.76"><button type="button" class="btn navy sq" data-goto="' + r.go + '">' + ic('next') + L('seeInDay', r.go.split(':')[0]) + '</button></div>' : '');
      return '<div class="rsp' + (k ? '' : ' on') + '" data-rsp="' + k + '"><div class="rsx"><div class="rsx-st">' +
        (r.ph ? '<div class="rsx-ph" role="img" aria-label="' + esc(r.n) + '"><div class="rsp-bg ph ph-' + r.ph + '"></div><span class="rsp-day">' + esc(r.day) + '</span><h3 class="rsp-ti">' + esc(r.n) + '</h3>' +
          (k ? '<button type="button" class="rsx-nav l js-only" data-rsnav="-1" aria-label="‹">' + ic('chev') + '</button>' : '') + (k < (T.route || []).length - 1 ? '<button type="button" class="rsx-nav r js-only" data-rsnav="1" aria-label="›">' + ic('chev') + '</button>' : '') + '</div>' : '') +
        '<div class="rsx-tx">' + (r.ph ? '' : '<div class="eyebrow o">' + esc(r.day) + '</div><h3>' + esc(r.n) + '</h3>') + tx + '</div></div></div></div>';
    }).join('');
  }
  function hero(startISO, plans) {
    var km = plans.reduce(function (a, p) { return a + Math.round(p.km); }, 0);
    var light = plans.reduce(function (a, p) { return a + (p.sun.set - p.sun.rise); }, 0) / plans.length;
    var castles = 0;
    T.days.forEach(function (d) { d.items.forEach(function (i) { if (i.t === 'visit' && i.cl && /Castillo|Castle/.test(i.ti)) castles++; }); });
    // carrusel de los días: foto grande, que se agranda al llegar al centro
    var cards = plans.map(function (p, i) {
      var d = p.day, mode = d.mode || meta().mode || 'car', stops = p.ev.filter(function (e) { return !e.skip && !e.it.hidden && !e.it.hole && e.it.t !== 'drive'; }).length;
      return '<div class="dcard sq' + (d.ph ? ' ph ph-' + d.ph : '') + '" data-go="' + (i + 1) + '" role="button" tabindex="0">' +
        '<div class="dc-in"><div class="dc-d">' + L('day') + ' ' + (i + 1) + ' · ' + esc(C.dateLabel(p.ms)) + '</div><div class="dc-t">' + esc(d.title) + '</div>' +
        '<div class="dc-f"><span>' + ic('sunset') + C.fmt(p.sun.set) + '</span><span>' + ic(mode === 'walk' ? 'walk' : 'car') + (mode === 'walk' ? L('byWalk') : C.kmTxt(p.km) + ' km') + '</span><span>' + ic('pin') + L('hmStops', stops) + '</span></div></div></div>';
    }).join('');
    var routeN = (T.route || []).length;
    return '' +
      '<div class="card nojs-only nojs-note"><h3>' + L('nojsTitle') + '</h3><p>' + L('nojs1') + '</p><p>' + L('nojs2', esc(C.dateLabel(C.parseISO(startISO)))) + '</p><p>' + L('nojs3') + '</p></div>' +
      '<div class="cover ph ph-' + T.cover + ' rv" data-par role="img" aria-label="' + esc(L('coverAria')) + '">' +
        langToggle() +
        '<div class="eyebrow">' + L('coverEyebrow') + '</div><h1>' + L('coverTitle') + '</h1>' +
        '<p>' + esc(L('coverSub', C.dateLabel(plans[0].ms), C.dateLabel(plans[plans.length - 1].ms))) + '</p></div>' +
      // la ruta
      '<div class="hm-h"><h3>' + L('theRoute') + '</h3><span>' + L('mapHint') + '</span></div><div id="tripMap"></div>' +
      // en cifras
      '<div class="hm-stats rv">' +
        '<div class="hm-stat sq" style="--d:0" data-sheet="drives:all" role="button" tabindex="0"><span class="hm-i n">' + ic('car') + '</span><b data-count="' + km + '" data-fmt="km">≈ ' + km + '</b><span>' + L('kmByCar') + '</span>' + ic('chev') + '</div>' +
        '<div class="hm-stat sq" style="--d:1" data-sheet="castles:0" role="button" tabindex="0"><span class="hm-i g">' + ic('castle') + '</span><b data-count="' + castles + '">' + castles + '</b><span>' + L('castles') + '</span>' + ic('chev') + '</div>' +
        '<div class="hm-stat sq" style="--d:2" data-sheet="light:0" role="button" tabindex="0"><span class="hm-i o">' + ic('sun') + '</span><b data-count="' + Math.round(light) + '" data-fmt="hm">' + hshort(light) + '</b><span>' + L('lightPerDay') + '</span>' + ic('chev') + '</div></div>' +
      // los días
      '<div class="dcx"><div class="dcx-st"><div class="hm-h"><h3>' + L('hmDays', plans.length) + '</h3><span>' + L('hmSwipe') + '</span></div>' +
      '<div class="dcar" id="dcar">' + cards + '</div></div></div>' +
      // cine y series
      (function () {
        // la ruta de cine es la de este destino; sin películas, no hay sección
        var fr0 = (T.filmRoutes || [])[0], en0 = I18N.lang === 'en', hp = fr0 && fr0.id === 'hp', anyFilm = T.days.some(function (d) { return d.items.concat(d.extras || []).some(function (o) { return o.film; }); });
        if (!fr0 && !anyFilm) return '';
        return '<div class="hm-h"><h3>' + L('tgFilm') + '</h3><span>' + L('filmsAllB') + '</span></div>' +
      '<div class="film-card rv">' + (fr0 ? '<button type="button" class="fc-hp sq ph ph-' + (hp ? 'glenfinnan' : T.cover) + '" data-sheet="filmrt:' + fr0.id + '"><span class="fc-in"><span class="fc-k">' + ic('film') + (hp ? 'Harry Potter' : L('tgFilm')) + '</span><b>' + (hp ? L('hpShort') : esc(en0 ? fr0.ti_en : fr0.ti)) + '</b><small>' + (hp ? L('hpCard') : esc(en0 ? fr0.card_en : fr0.card)) + '</small></span></button>' : '') +
        (anyFilm ? '<button type="button" class="fc-all sq" data-sheet="films:all"><span class="hm-i fi">' + ic('film') + '</span><span><b>' + L('filmsAllT') + '</b><small>' + (fr0 && fr0.auto ? L('filmsAllSubGen') : L('filmsAllSub')) + '</small></span>' + ic('chev') + '</button>' : '') + '</div>';
      })();
  }

  function flights(fl) {
    function row(k, lbl, tz) {
      var f = fl[k] || {};
      return '<div class="flr"><div class="fl-h"><span class="sq-ico">' + ic('plane') + '</span><div><b>' + lbl + '</b><small>' + tz + '</small></div></div>' +
        '<div class="fl-in js-only"><input type="date" data-fl="' + k + '.date" value="' + esc(f.date || '') + '"><input type="time" data-fl="' + k + '.time" value="' + esc(f.time || '') + '"></div>' +
        '<div class="nojs-only small muted">' + esc((f.date || '—') + ' ' + (f.time || '')) + '</div>' +
        '<div class="sv-row js-only"><button type="button" class="btn sq sv-btn" data-flsave="' + k + '">' + ic('check') + L('save') + '</button>' +
          '<span class="sv-st">' + (f.date && f.time ? '✓ ' + (f.savedAt ? L('savedAt', esc(f.savedAt)) : L('savedTxt')) : '') + '</span></div>' +
        '<div class="fl-st" id="flSt-' + k + '">' + (f.date && f.time ? '' : L('flMissing')) + '</div></div>';
    }
    var hrs = [24, 48, 168, 720];
    return '<div class="card rv fl"><div class="eyebrow">' + L('flTitle') + '</div>' + row('out', L('flOut'), L('flOutTz')) + row('back', L('flBack'), L('flBackTz')) +
      '<div class="field js-only"><label>' + L('flHours') + '</label><select data-fl="hours">' + hrs.map(function (h) {
        return '<option value="' + h + '"' + (+fl.hours === h ? ' selected' : '') + '>' + L('flBefore', h < 72 ? L('hours', h) : L('days', h / 24)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="btn-row js-only"><button type="button" class="btn navy sq" data-ics>' + ic('calendar') + L('flCal') + '</button></div>' +
      '<p class="wx-note js-only">' + L('flCalNote') + '</p></div>';
  }

  function checklist(checked, when) {
    var total = 0, done = 0;
    when = when || 'out';
    var cats = T.checklist.filter(function (c) { return (c.when || 'out') === when; }).map(function (c) {
      var n = 0;
      var rows = c.items.map(function (it) {
        var on = !!checked[it.id]; total++; if (on) { done++; n++; }
        return '<label class="chk" data-cat="' + c.id + '"><input type="checkbox" data-id="' + it.id + '"' + (on ? ' checked' : '') + '>' +
          '<span class="box"></span><span class="txt"><span class="t">' + esc(it.t) + (it.imp ? '<i class="imp" title="' + L('essential') + '"></i>' : '') + '</span>' +
          (it.n ? '<span class="n">' + esc(it.n) + '</span>' : '') + '</span></label>';
      }).join('');
      return '<div class="card cat rv" id="cat-' + c.id + '"><div class="cat-head"><span class="sq-ico">' + ic(c.icon) + '</span><h3>' + esc(c.title) + '</h3>' +
        ring(n / c.items.length, n + '/' + c.items.length, 'sm', 'r-' + c.id) + '</div>' + rows + '</div>';
    }).join('');
    var head = '<div class="card rv"><div class="prog-head">' + ring(total ? done / total : 0, (total ? Math.round(done / total * 100) : 0) + '%', '', 'r-all-' + when) +
      '<div style="flex:1"><h2>' + L(when === 'back' ? 'packBack' : 'whatToPack') + '</h2>' +
      '<div class="muted small"><span id="doneTxt-' + when + '">' + L('doneOf', done, total) + '</span> ' + L('ready') + ' · <i class="imp" style="margin:0 3px 0 0"></i>' + L('essential') + '</div></div>' +
      '<button class="btn ghost sq js-only" data-resetchk="' + when + '" type="button">' + ic('undo') + L('reset') + '</button></div></div>';
    return head + cats;
  }

  /* ---------- Tiempo y carreteras ---------- */
  function wxCode(c) {
    var N = L('wxC');
    if (c == null) return ['cloud', N[0]];
    if (c === 0) return ['sun', N[1]];
    if (c <= 2) return ['cloudsun', N[2]];
    if (c === 3) return ['cloud', N[3]];
    if (c === 45 || c === 48) return ['fog', N[4]];
    if (c >= 51 && c <= 57) return ['rain', N[5]];
    if (c >= 61 && c <= 67) return ['rain', N[6]];
    if (c >= 71 && c <= 77) return ['snow', N[7]];
    if (c >= 80 && c <= 82) return ['rain', N[8]];
    if (c === 85 || c === 86) return ['snow', N[9]];
    if (c >= 95) return ['bolt', N[10]];
    return ['cloud', N[11]];
  }
  function roadRisk(d) {
    var r = [];
    if (snowy(d)) r.push(['snow', d.snow > 0.05 ? L('rSnow', d.snow.toFixed(1)) : L('rSnowFc'), 'snow']);
    if (d.tmin != null && d.tmin <= 1) r.push(['snow', L('rIce'), 'warn']);
    if (d.gust != null && d.gust >= 65) r.push(['wind', L('rGust', Math.round(d.gust)), 'warn']);
    if (d.code === 45 || d.code === 48) r.push(['fog', L('rFog'), 'warn']);
    if (d.rain != null && d.rain >= 10) r.push(['rain', L('rRain'), 'warn']);
    return r;
  }
  function snowy(d) { return !!d && ((d.snow || 0) > 0.05 || (d.code >= 71 && d.code <= 77) || d.code === 85 || d.code === 86); }
  function winter(p) { return [11, 12, 1, 2, 3].indexOf(p.month) >= 0; }
  function deg(v) { return v == null ? '—' : Math.round(v) + '°'; }
  function wxRows(plans, days) {
    return plans.map(function (p, i) {
      var pt = T.wx[i], d = days && days[i], head = '<b>' + L('day') + ' ' + (i + 1) + ' · ' + esc(C.dateLabel(p.ms)) + '</b><small>' + esc(pt.n) + '</small>';
      var open = ' data-go="' + (i + 1) + '" role="button" tabindex="0"';
      if (d) {
        var w = wxCode(d.code), risk = roadRisk(d);
        return '<div class="wxr sq' + (snowy(d) ? ' snow' : '') + '"' + open + '><div class="wxi' + (snowy(d) ? ' s' : risk.length ? ' w' : '') + '">' + ic(w[0]) + '</div><div class="wxt">' + head +
          '<span>' + w[1] + (d.prob != null ? ' · ' + L('wxRain', Math.round(d.prob)) : '') + (d.gust != null ? ' · ' + L('wxGusts', Math.round(d.gust)) : '') + '</span></div>' +
          '<div class="wxtemp">' + deg(d.tmax) + '<small>' + deg(d.tmin) + '</small></div></div>' +
          '<div class="chips wxc">' + (risk.length ? risk.map(function (x) { return '<span class="chip ' + x[2] + '">' + ic(x[0]) + x[1] + '</span>'; }).join('') : '<span class="chip ok">' + ic('check') + L('rNone') + '</span>') + '</div>';
      }
      var wi = winter(p);
      return '<div class="wxr sq"' + open + '><div class="wxi">' + ic(pt.pass ? 'snow' : 'rain') + '</div><div class="wxt">' + head +
        '<span>' + (wi ? L('wxTypical') : L('wxNone')) + '</span></div>' +
        (wi ? '<div class="wxtemp">≈ ' + pt.hi + '°<small>' + pt.lo + '°</small></div>' : '') + '</div>' +
        (wi ? '<div class="chips wxc"><span class="chip gold">' + ic(pt.pass ? 'snow' : 'rain') + (pt.pass ? L('wxPassSnow') : L('wxCityRain')) + '</span></div>' : '');
    }).join('');
  }
  function wxMini(d, p, i) {
    if (d) {
      var w = wxCode(d.code), risk = roadRisk(d);
      return ic(w[0]) + '<span>' + w[1] + ' · <b>' + deg(d.tmax) + ' / ' + deg(d.tmin) + '</b>' + (risk.length ? ' · <em class="' + risk[0][2] + '">' + risk[0][1] + '</em>' : '') + '</span>';
    }
    var pt = T.wx[i];
    return winter(p) ? ic('cloud') + '<span>' + L('wxMiniTyp', pt.hi, pt.lo, esc(pt.n)) + '</span>' : '';
  }
  function weather(plans) {
    return '<div class="card rv wx"><div class="wx-head"><div><div class="eyebrow">' + L('wxEyebrow') + '</div><h3>' + L('wxTitle') + '</h3></div>' +
      '<button type="button" class="btn ghost sq js-only" id="wxRefresh">' + ic('refresh') + L('wxRefresh') + '</button></div>' +
      '<div id="wxBody">' + wxRows(plans, null) + '</div>' +
      '<p class="wx-note" id="wxNote">' + L('wxNoteDefault') + '</p>' +
      '<div class="links">' + (T.links || []).map(function (l) { return '<a class="lk sq" href="' + l.u + '" target="_blank" rel="noopener"><div><b>' + esc(l.n) + '</b><small>' + esc(l.t) + '</small></div>' + ic('ext') + '</a>'; }).join('') + '</div></div>';
  }

  /* ---------- Fichas genéricas (guía, souvenirs, conducción) ---------- */
  function gtile(o) {
    return '<div class="gtile glass sq' + (o.ph ? ' has-ph' : '') + '"' + (o.k ? ' data-k="' + o.k + '"' : '') + ' data-sheet="' + o.sheet + '" role="button" tabindex="0">' +
      (o.ph ? '<div class="gt-ph ph ph-' + o.ph + '"></div>' : '') +
      '<div class="gt"><span class="sq-ico ' + (o.icls || '') + '">' + ic(o.ic) + '</span><span class="gk">' + esc(o.kind) + '</span>' + (o.p ? '<span class="gp">' + o.p + '</span>' : '') + '</div>' +
      '<b>' + esc(o.n) + '</b>' + (o.pl ? '<small>' + esc(o.pl) + '</small>' : '') + '<p>' + esc(o.t) + '</p>' + (o.add ? '<span class="gt-add js-only">' + ic('next') + L('gtCta') + '</span>' : '') + '</div>';
  }
  function filterRow(opts) {
    return '<div class="gf-row js-only" role="group" aria-label="' + L('filter') + '">' + opts.map(function (f, k) {
      return '<button type="button" class="gf sq' + (k ? '' : ' on') + '" data-gf="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div>';
  }
  var KIND = { eat: ['kEat', 'food', 'o'], pub: ['kPub', 'beer', ''], shop: ['kShop', 'shop', 'g'] };
  function guideHTML(d, di, title) {
    var g = d.guide || [];
    if (!g.length) return '';
    return sh(title || L('edsTitle'), g.length) + filterRow([['all', L('fAll')], ['eat', L('fEat')], ['pub', L('fPub')], ['shop', L('fShop')]]) +
      hs(g.map(function (x, k) { var K = KIND[x.k]; return gtile({ k: x.k, ph: x.ph, ic: K[1], icls: K[2], kind: L(K[0]), p: x.p, n: x.n, pl: x.pl, t: x.t, sheet: 'guide:' + di + ':' + k, add: 1 }); }).join(''), 'guide');
  }
  function souvenirs() {
    var s = T.souvenirs || [];
    if (!s.length) return '';
    return sh(L('souvTitle'), s.length) + hs(s.map(function (x, k) { return gtile({ ph: x.ph, ic: 'shop', icls: 'g', kind: L('souv'), n: x.n, t: x.t, sheet: 'souv:' + k, add: 1 }); }).join(''));
  }
  function driving() {
    var D = T.driving || [];
    if (!D.length) return '';
    var K = { base: L('kBase'), winter: L('kWinter'), sos: L('kSos') };
    return sh(L('drvTitle'), D.length) + filterRow([['all', L('dAll')], ['base', L('dBase')], ['winter', L('dWinter')], ['sos', L('dSos')]]) +
      hs(D.map(function (x, k) { return gtile({ k: x.k, ph: x.ph, ic: x.ic, icls: x.k === 'sos' ? 'o' : x.k === 'base' ? 'g' : '', kind: K[x.k], n: x.n, t: x.t, sheet: 'drv:' + k }); }).join(''), 'guide');
  }

  /* ---------- Etiquetas ---------- */
  var TAGS = { sunset: ['sunset', 'tgSunset', 'gold'], night: ['moon', 'tgNight', 'night'], morning: ['sunrise', 'tgMorning', 'morn'],
    rain: ['rain', 'tgRain', 'rain'], booking: ['ticket', 'tgBooking', 'book'], quick: ['clock', 'tgQuick', 'quick'], photo: ['camera', 'tgPhoto', 'photo'], film: ['film', 'tgFilm', 'film'], museum: ['castle', 'tgMuseum', 'book'], sacred: ['castle', 'tgSacred', 'morn'], palace: ['castle', 'tgPalace', 'gold'], ruins: ['castle', 'tgRuins', 'night'], park: ['mountain', 'tgPark', 'quick'], city: ['pin', 'tgCity', 'night'] };
  // para filtrar al cambiar una parada: qué clase de sitio es (también en viajes creados antes)
  function kindTags(o) {
    if (!o || o.t === 'food' || o.t === 'hotel' || o.t === 'car' || o.t === 'drive' || o.t === 'train') return [];
    var k = o.k, n = String(o.ti || '').toLowerCase(), out = [];
    function has(kinds, re) { return kinds.indexOf(k) >= 0 || re.test(n); }
    if (has(['museum'], /museo|museum|musei|galer|gallery|pinacoteca/)) out.push('museum');
    if (has(['sacred'], /bas[ií]lica|iglesia|church|chiesa|catedral|cathedral|duomo|templo|temple|mezquita|mosque|sinagoga|synagogue|monasterio|monastery|abad[ií]a|abbey|santuario|shrine/)) out.push('sacred');
    if (has(['palace'], /castillo|castle|castel|palacio|palace|palazzo|alc[aá]zar|fortaleza|fortress/)) out.push('palace');
    if (has(['ruins'], /ruinas|ruins|foro |forum|coliseo|colosseum|termas|baths|panteón|pantheon|arqueol|archaeolog/)) out.push('ruins');
    if (has(['garden', 'nature'], /parque|park|jard[ií]n|garden|villa |bosque|forest/)) out.push('park');
    if (has(['square', 'quarter', 'monument'], /plaza|piazza|square|fuente|fountain|barrio|quarter|torre|tower|puente|bridge/)) out.push('city');
    if (o.t === 'view' || /mirador|viewpoint|belvedere/.test(n)) out.push('photo', 'sunset');
    else if (has(['monument', 'nature', 'square'], /^$/)) out.push('photo');
    return out;
  }
  function tagsOf(it) {
    var t = (it.tags || []).slice();
    if (it.d && it.d <= 30 && ['food', 'car', 'hotel', 'drive'].indexOf(it.t) < 0 && t.indexOf('quick') < 0) t.push('quick');
    return t;
  }
  // desde dónde hacer la foto (actividades con etiqueta «Fotografía») y botón al sitio exacto en Google Maps
  function shotUrl(o) { var z = o.shot || {}; return 'https://www.google.com/maps/search/?api=1&query=' + (z.q ? encodeURIComponent(z.q) : z.lat != null ? z.lat + ',' + z.lon : o.lat + ',' + o.lon); }
  function shotHTML(o, small) {
    if (!o || !o.photo || tagsOf(o).indexOf('photo') < 0) return '';
    return '<div class="shot' + (small ? ' sm' : '') + '">' + ic('camera') + '<span><b>' + L('shotFrom') + '</b> ' + esc(o.photo) + '</span>' +
      '<a class="btn ghost sq shot-map" href="' + shotUrl(o) + '" target="_blank" rel="noopener">' + ic('map') + L('shotMap') + '</a></div>';
  }
  function filmHTML(o, small) {
    if (!o || !o.film) return '';
    return '<div class="filmx' + (small ? ' sm' : '') + '">' + ic('film') + '<span>' + esc(o.film) + '</span></div>';
  }
  function tagChips(it, max, skip) {
    return tagsOf(it).filter(function (k) { return k !== skip; }).slice(0, max || 9).map(function (k) {
      var g = TAGS[k]; return g ? '<span class="chip tg tg-' + g[2] + '">' + ic(g[0]) + L(g[1]) + '</span>' : ''; }).join('');
  }
  // qué etiqueta encaja con una hora del día
  function slotTag(t, sun) {
    if (sun && t >= sun.set - 75 && t <= sun.set + 10) return 'sunset';
    if (sun && t >= sun.dusk - 10) return 'night';
    if (t < 12 * 60) return 'morning';
    return '';
  }
  function bySlot(list, slot, get) {
    if (!slot) return list;
    return list.map(function (x, k) { return { x: x, k: k, m: tagsOf(get ? get(x) : x).indexOf(slot) >= 0 ? 0 : 1 }; })
      .sort(function (p, q) { return p.m - q.m || p.k - q.k; }).map(function (z) { return z.x; });
  }

  /* ---------- Afluencia típica (estimación por tipo de sitio, no en directo) ---------- */
  var CROWD = {   // 0–100, de 8:00 a 22:00
    attraction: [8, 15, 35, 60, 80, 90, 85, 70, 50, 30, 15, 8, 5, 5, 5],
    museum:     [0, 0, 20, 45, 70, 80, 75, 60, 35, 10, 0, 0, 0, 0, 0],
    street:     [5, 10, 25, 45, 65, 80, 85, 80, 70, 55, 40, 30, 20, 10, 5],
    viewpoint:  [5, 10, 20, 35, 50, 60, 65, 70, 75, 60, 40, 25, 15, 10, 5],
    nature:     [5, 15, 30, 50, 65, 70, 65, 50, 30, 10, 5, 0, 0, 0, 0],
    restaurant: [10, 15, 20, 35, 70, 85, 55, 25, 20, 40, 70, 85, 70, 40, 15],
    pub:        [0, 0, 5, 10, 25, 30, 25, 25, 30, 40, 55, 75, 90, 95, 85],
    shop:       [0, 5, 20, 40, 60, 75, 80, 75, 65, 45, 25, 10, 0, 0, 0],
    market:     [0, 0, 10, 25, 40, 55, 65, 75, 85, 90, 80, 60, 30, 10, 0]
  };
  function crowdKind(it) {
    if (it.crowd) return it.crowd;
    if (/mercado|market/i.test(it.ti)) return 'market';
    switch (it.t) {
      case 'visit': return /museum|museo|gallery|galer|centre|center/i.test(it.ti) ? 'museum' : 'attraction';
      case 'walk': return 'street'; case 'view': return 'viewpoint'; case 'food': return 'restaurant';
      case 'night': return 'pub'; case 'shop': return 'shop'; default: return null;
    }
  }
  function crowdAt(it, p, min) {
    var k = crowdKind(it); if (!k) return null;
    var c = CROWD[k], h = min / 60 - 8; if (h < 0 || h > 14) return 0;
    var i = Math.floor(h), f = h - i, v = c[i] + ((c[i + 1] != null ? c[i + 1] : c[i]) - c[i]) * f;
    if (k === 'viewpoint' && p.sun) { var dd = Math.abs(min - p.sun.set); if (dd < 60) v = Math.max(v, 95 - dd * 0.6); }
    var wd = new Date(p.ms).getUTCDay(); if (wd === 0 || wd === 6) v = Math.min(100, v * 1.2);
    return Math.round(v);
  }
  function crowdAvg(it, p, from, d) { var s0 = 0, n = 0; for (var t = from; t < from + Math.max(15, d); t += 15) { s0 += crowdAt(it, p, t) || 0; n++; } return n ? Math.round(s0 / n) : 0; }
  function crowdWord(v) { return v <= 0 ? L('crClosed') : v < 30 ? L('crLow') : v < 60 ? L('crMid') : v < 80 ? L('crHigh') : L('crPeak'); }
  function crowdOpen(it, p, from, d) { for (var t = from; t < from + Math.max(15, d); t += 15) if (!crowdAt(it, p, t)) return false; return true; }
  function crowdHTML(hit, p, di) {
    var it = hit.it; if (!crowdKind(it) || hit.skip) return '';
    var now = crowdAvg(it, p, hit.start, it.d), bars = '';
    for (var h = 8; h <= 22; h++) {
      var v = crowdAt(it, p, h * 60 + 30), on = hit.start < (h + 1) * 60 && hit.end > h * 60;
      bars += '<i class="' + (on ? 'on' : '') + '" style="height:' + Math.max(4, v) + '%" title="' + h + ':00 · ' + v + '%"></i>';
    }
    var movable = !hit.locked && !it.sun && it.t !== 'food' && it.t !== 'drive' && it.t !== 'hotel' && it.t !== 'car';
    var close = it.cl ? hm2(p.month >= 4 && p.month <= 9 ? it.cl[0] : it.cl[1]) : 22 * 60;
    var from = 9 * 60, to = close - it.d;
    if (it.light && p.sun) { from = Math.max(from, p.sun.rise); to = Math.min(to, p.sun.set - it.d + 10); }
    var opts = [], locks = [], dayStart = p.live.length ? p.live[0].start : from;
    p.ev.forEach(function (e) { if (!e.skip && e.locked && e.it.id !== it.id) locks.push([hm2(e.it.at), hm2(e.it.at) + e.it.d]); });
    from = Math.max(from, dayStart);
    if (movable) for (var t = from; t <= to; t += 30) {
      if (Math.abs(t - hit.start) < 45 || !crowdOpen(it, p, t, it.d)) continue;
      if (locks.some(function (l) { return t < l[1] && t + it.d > l[0]; })) continue;
      var v2 = crowdAvg(it, p, t, it.d); if (v2 <= now - 15) opts.push({ t: t, v: v2 });
    }
    opts.sort(function (x, y) { return x.v - y.v || x.t - y.t; });
    var picked = [];
    opts.forEach(function (o) { if (picked.length < 2 && picked.every(function (q) { return Math.abs(q.t - o.t) >= 90; })) picked.push(o); });
    picked.sort(function (x, y) { return x.t - y.t; });
    return '<div class="sh-sec crowd"><div class="k">' + ic('people') + L('crTitle') + '</div>' +
      '<div class="cr-now"><b>' + crowdWord(now) + '</b> ' + L('crAtPlan', C.fmt(hit.start)) + '</div>' +
      '<div class="cr-bars">' + bars + '</div><div class="cr-ax"><span>8</span><span>12</span><span>16</span><span>20</span></div>' +
      (it.pref ? '<div class="add-row"><span class="chip ok">' + ic('clock') + L('crPref', esc(it.pref)) + '</span><button type="button" class="btn ghost sq" data-prefclear="' + di + ':' + it.id + '">' + ic('x') + L('crPrefClear') + '</button></div>' : '') +
      (picked.length ? '<div class="add-col">' + picked.map(function (o) { return '<button type="button" class="btn navy sq" data-prefat="' + di + ':' + it.id + ':' + C.fmt(o.t) + '">' + ic('people') + L('crMove', C.fmt(o.t)) + ' <small>' + crowdWord(o.v) + '</small></button>'; }).join('') + '</div>'
        : (movable && now >= 60 ? '<p class="add-note">' + L('crNoBetter') + '</p>' : '')) +
      '<div class="btn-row"><a class="btn ghost sq" href="' + gmaps(it) + '" target="_blank" rel="noopener">' + ic('ext') + L('crLive') + '</a></div>' +
      '<p class="add-note">' + L('crNote') + '</p></div>';
  }
  function hm2(s) { var p0 = String(s).split(':'); return +p0[0] * 60 + (+p0[1] || 0); }

  /* ---------- Sitios para la puesta de sol del día ---------- */
  function sunSpots(p, di) {
    var set = p.sun.set, at = null;
    p.ev.forEach(function (e) { if (!e.skip && !e.it.hidden && e.it.lat != null && e.it.t !== 'drive' && e.start <= set) at = e.it; });
    if (!at) p.ev.forEach(function (e) { if (!at && !e.skip && e.it.lat != null) at = e.it; });
    var inPlan = {}, have = null;
    p.ev.forEach(function (e) {
      if (e.skip || e.it.hidden) return;
      inPlan[e.it.extra || e.it.altId || e.it.id] = 1; inPlan[String(e.it.ti).toLowerCase()] = 1;
      if (!e.it.hole && (e.it.sun || tagsOf(e.it).indexOf('sunset') >= 0) && e.start <= set + 10 && e.end >= set - 40) have = e.it;
    });
    var cands = [];
    T.days[di].items.forEach(function (it) { if (it.t !== 'drive' && tagsOf(it).indexOf('sunset') >= 0) cands.push(it); });
    C.pool(T).forEach(function (o) { if (tagsOf(o).indexOf('sunset') >= 0) cands.push(o); });
    var seen = {}, list = [];
    cands.forEach(function (o) {
      var key = String(o.ti).toLowerCase();
      if (seen[key] || inPlan[o.id] || inPlan[key] || o.lat == null || !at) return; seen[key] = 1;
      var km = C.km(at, o); if (km <= 40) list.push({ o: o, km: km });
    });
    list.sort(function (x, y) { return x.km - y.km; });
    return { have: have, list: list, set: set };
  }

  /* ---------- Tiempo por horas (Open-Meteo) para el plan B ---------- */
  var WX = null, PLANS = null;
  function setWx(w) { WX = w; }
  function hourly(i, which) { var d = WX && WX.days && WX.days[i]; return d ? (which === 'sun' ? (d.hs || d.h) : d.h) || null : null; }
  // lluvia y nubes entre dos horas del día (minutos): probabilidad máxima, litros y nubes medias
  function wxSpan(i, from, to, which) {
    var H = hourly(i, which); if (!H || !H.pop) return null;
    var h0 = Math.max(0, Math.min(23, Math.floor(from / 60))), h1 = Math.max(h0, Math.min(23, Math.floor((to - 1) / 60))), pop = 0, mm = 0, cl = 0, n = 0;
    for (var h = h0; h <= h1; h++) { pop = Math.max(pop, H.pop[h] || 0); mm += H.mm[h] || 0; cl += H.cloud[h] || 0; n++; }
    return { pop: Math.round(pop), mm: Math.round(mm * 10) / 10, cloud: Math.round(cl / n) };
  }
  function sunOutlook(i, p) {
    var s = wxSpan(i, p.sun.set - 60, p.sun.set + 15, 'sun'); if (!s) return null;
    s.level = s.cloud < 45 && s.pop < 30 ? 'good' : s.cloud < 80 && s.pop < 50 ? 'mixed' : 'bad';
    return s;
  }
  function outdoor(it) { return (it.light || it.t === 'view' || it.t === 'walk') && tagsOf(it).indexOf('rain') < 0 && it.t !== 'drive'; }
  function nearSunset(e, p) { return e.it.sun || (tagsOf(e.it).indexOf('sunset') >= 0 && e.start <= p.sun.set + 15 && e.end >= p.sun.set - 60); }
  // ¿hace mal tiempo para esta actividad, a su hora?
  function badWeather(e, di, p) {
    if (!p || e.skip) return null;
    if (nearSunset(e, p)) { var o = sunOutlook(di, p); if (o && o.level === 'bad') return { kind: 'sun', s: o }; }
    if (outdoor(e.it)) { var s = wxSpan(di, e.start, e.end); if (s && (s.pop >= 60 || s.mm >= 1)) return { kind: 'rain', s: s }; }
    return null;
  }
  function wxChip(e, di, p) {
    if (!p || e.skip) return '';
    if (nearSunset(e, p)) {
      var o = sunOutlook(di, p); if (!o) return '';
      return o.level === 'good' ? '<span class="chip gold">' + ic('sun') + L('wxSunGood', o.cloud) + '</span>'
        : o.level === 'mixed' ? '<span class="chip">' + ic('cloudsun') + L('wxSunMixed', o.cloud) + '</span>'
        : '<span class="chip warn">' + ic('cloud') + L('wxSunBad', o.cloud) + '</span>';
    }
    if (outdoor(e.it)) { var s = wxSpan(di, e.start, e.end); if (s && (s.pop >= 60 || s.mm >= 1)) return '<span class="chip tg tg-rain">' + ic('rain') + L('wxRainAt', s.pop) + '</span>'; }
    return '';
  }
  function wxBadge(e, di) {
    var H = hourly(di, e.it.sun ? 'sun' : null); if (!H || !H.code || e.skip) return '';
    var h = Math.max(0, Math.min(23, Math.floor(e.start / 60)));
    if (H.code[h] == null) return '';
    var w = wxCode(H.code[h]), pop = Math.round(H.pop[h] || 0), tmp = H.temp && H.temp[h] != null ? Math.round(H.temp[h]) + '°' : '';
    return '<span class="ev-wx' + (pop >= 50 ? ' wet' : '') + '" title="' + esc(w[1]) + '">' + ic(w[0]) + tmp + (pop >= 30 ? '<em>' + pop + '%</em>' : '') + '</span>';
  }
  function mapLink(o) {
    if (o.lat == null && !o.q) return '';
    return '<a class="btn ghost sq mapl" href="' + gmaps(o) + '" target="_blank" rel="noopener">' + ic('map') + L('maps') + '</a>';
  }

  /* ---------- Ruta del día en Google Maps ---------- */
  function stopsOf(p, fromMin) {
    var out = [];
    p.ev.forEach(function (e) {
      if (e.skip || e.it.hidden || e.it.hole || e.it.t === 'drive' || e.it.lat == null) return;
      if (e.it.jump) { out = []; }   // la ruta del día empieza en la ciudad de llegada
      if (fromMin != null && e.end <= fromMin) return;
      var last = out[out.length - 1];
      if (last && C.km(last.it, e.it) < 0.15) return;   // mismo sitio: una sola parada
      out.push(e);
    });
    return out;
  }
  function llOf(it) { return it.lat + ',' + it.lon; }
  function travelMode(p) { var m = p.day.mode || meta().mode; return m === 'walk' ? 'walking' : m === 'transit' ? 'transit' : 'driving'; }
  // enlaces de Google Maps: en el iPhone la app solo se queda con 9 puntos por enlace (origen + 7 paradas + destino) y tira
  // el resto sin avisar; si hay más, en partes (cada parte empieza donde acabó la anterior)
  function routeLinks(stops, mode, fromHere) {
    var pts = stops.map(function (e) { return e.it; }), links = [];
    if (!pts.length) return links;
    var i = 0, first = true;
    while (i < pts.length) {
      var origin = first && fromHere ? null : pts[i], start = origin ? i + 1 : i;
      var chunk = pts.slice(start, start + 8);
      if (!chunk.length) break;
      var dest = chunk[chunk.length - 1], way = chunk.slice(0, -1);
      links.push('https://www.google.com/maps/dir/?api=1' + (origin ? '&origin=' + llOf(origin) : '') + '&destination=' + llOf(dest) +
        (way.length ? '&waypoints=' + way.map(llOf).join('%7C') : '') + '&travelmode=' + mode);
      i = start + chunk.length - 1; first = false;
      if (i >= pts.length - 1) break;
    }
    return links;
  }
  // rutas de fotos del día (datos: TRIP.photoRoutes)
  function photoRoutesOf(di) { var id = T.days[di].id; return (T.photoRoutes || []).filter(function (r) { return r.day === id; }); }
  function spotById(id) { var hit = null; C.pool(T).forEach(function (o) { if (!hit && o.id === id) hit = o; }); T.days.forEach(function (d) { (d.extras || []).forEach(function (o) { if (!hit && o.id === id) hit = o; }); }); return hit; }
  function photoKm(r) { var sp = r.ids.map(spotById).filter(Boolean), k = 0; for (var n = 1; n < sp.length; n++) { var w = C.travel(sp[n - 1], sp[n], 'walk'); k += w ? w.km : C.km(sp[n - 1], sp[n]) * 1.3; } return k; }
  function photoRouteHTML(di) {
    return photoRoutesOf(di).map(function (r) {
      var en = I18N.lang === 'en', sp = r.ids.map(spotById).filter(Boolean), far = (r.far || []).map(spotById).filter(Boolean);
      var links = routeLinks(sp.map(function (o) { return { it: o }; }), 'walking', false);
      return '<div class="pr-box"><div class="add-h">' + ic('camera') + L('prTitle') + ' · ' + esc(en && r.ti_en ? r.ti_en : r.ti) + '</div>' +
        '<p class="add-note">' + L('prBy', '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.by) + '</a>') + ' ' + esc(en && r.note_en ? r.note_en : r.note) + ' ' + L('prKm', sp.length, (Math.round(photoKm(r) * 10) / 10).toString().replace('.', en ? '.' : ',')) + '</p>' +
        '<div class="add-col">' + links.map(function (u, k) { return '<a class="btn navy sq" href="' + u + '" target="_blank" rel="noopener">' + ic('camera') + L('prOpen') + (links.length > 1 ? ' · ' + L('rtPart', k + 1, links.length) : '') + '</a>'; }).join('') + '</div>' +
        '<div class="rt-list">' + sp.map(function (o, k) {
          return '<div class="rt-row"><span class="rt-n ph">' + (k + 1) + '</span><span class="bl-n">' + esc(o.ti) + '<small>' + esc(o.lead || o.pl || '') + '</small>' + (o.photo ? '<small class="pr-tip">' + ic('camera') + esc(o.photo) + '</small>' : '') + (o.tips && o.tips[0] ? '<small class="pr-tip">' + ic('rain') + esc(o.tips[0]) + '</small>' : '') + '</span>' + '<a class="btn ghost sq mapl" href="' + shotUrl(o) + '" target="_blank" rel="noopener">' + ic('map') + L('maps') + '</a></div>'; }).join('') + '</div>' +
        (far.length ? '<div class="add-h">' + L('prFar') + '</div><div class="rt-list">' + far.map(function (o) {
          return '<div class="rt-row"><span class="rt-n o">' + ic('car') + '</span><span class="bl-n">' + esc(o.ti) + '<small>' + esc(o.lead || '') + '</small>' + (o.tips && o.tips[0] ? '<small class="pr-tip">' + ic('alert') + esc(o.tips[0]) + '</small>' : '') + '</span>' + mapLink(o) + '</div>'; }).join('') + '</div>' : '') + '</div>';
    }).join('');
  }
  // recomendados del día que no están en el plan (para verlos como marcadores sueltos)
  function nearRecs(p, di) {
    var inPlan = {}, st = stopsOf(p), out = [], seen = {};
    p.ev.forEach(function (e) { if (!e.skip) { inPlan[e.it.extra || e.it.altId || e.it.id] = 1; inPlan[String(e.it.ti).toLowerCase()] = 1; } });
    function add(o) {
      var k = String(o.ti).toLowerCase();
      if (o.lat == null || o.fuel || o.t === 'car' || o.t === 'hotel' || inPlan[o.id] || inPlan[k] || seen[k]) return;
      if (!st.some(function (e) { return C.km(e.it, o) <= 25; })) return;
      seen[k] = 1; out.push(o);
    }
    (T.days[di].extras || []).forEach(add);
    C.pool(T).forEach(function (o) { if (tagsOf(o).length) add(o); });
    return out.slice(0, 16);
  }

  /* ---------- Día ---------- */
  function recTiles(it, drive) {
    var r = [];
    (it.see || []).forEach(function (x) { r.push([L('rSee'), 'eye', x, '']); });
    (it.eat || []).forEach(function (x) { r.push([L('rEat'), 'food', x, 'o']); });
    (it.tips || []).forEach(function (x) { r.push([drive ? L('rRoad') : L('rTip'), drive ? 'route' : 'bulb', x, '']); });
    if (it.photo && tagsOf(it).indexOf('photo') < 0) r.push([L('rPhoto'), 'camera', it.photo, '']);
    if (it.book) r.push([L('rBook'), 'ticket', it.book, 'o']);
    return r;
  }
  function chipsFor(e, di, p) {
    var it = e.it, t = it.t, c = '';
    if (it.opt) c += '<span class="chip opt">' + L('cOpt') + '</span>';
    if (it.extra) c += it.repTi ? '<span class="chip opt">' + ic('refresh') + L('replacesX', esc(it.repTi)) + '</span>' : '<span class="chip opt">' + L('extra') + '</span>';
    if (it.cost && !e.skip) c += '<span class="chip">' + ic(it.cost.t === 'food' ? 'food' : it.cost.t === 'parking' ? 'car' : 'ticket') + '≈ ' + cur() + it.cost.v + (it.cost.pp ? ' ' + L('budPP') : it.cost.t === 'parking' ? ' ' + L('budCar') : '') + '</span>';
    if (it.auto) c += '<span class="chip gold">' + ic('moon') + L('cAuto') + '</span>';
    if (it.sun) c += e.sunIdeal != null && Math.abs(e.start - e.sunIdeal) > 25 && !e.skip
      ? '<span class="chip warn">' + ic('sunset') + L('cSunShift', C.fmt(e.sunIdeal)) + '</span>'
      : '<span class="chip gold">' + ic('sunset') + L('cSun') + '</span>';
    if (it.at && !it.sun && !it.soft && t !== 'food') c += '<span class="chip lock">' + ic('lock') + L('cLocked', esc(it.at)) + '</span>';
    if (e.moved) c += '<span class="chip opt">' + ic('next') + L('cMoved', esc(e.moved)) + '</span>';
    if (it.pref && !e.skip) c += '<span class="chip ok">' + ic('people') + L('crPrefShort', esc(it.pref)) + '</span>';
    // «Buena puesta de sol» solo si la actividad cae cerca de la puesta
    if (!e.skip) c += wxChip(e, di, p) + tagChips(it, 3, it.sun || !nearSunset(e, p) ? 'sunset' : '');
    (e.warn || []).forEach(function (w) { c += '<span class="chip warn">' + ic(w.k === 'closed' ? 'lock' : 'alert') + esc(w.t) + '</span>'; });
    return c;
  }
  // hueco libre: lo que quitaste deja su tiempo; tú decides qué hacer con él
  function holeHTML(e, seg, di) {
    var it = e.it;
    return '<div class="ev ev--hole" data-s="' + e.start + '" data-e="' + e.end + '" data-id="' + it.id + '" data-seg="' + seg + '" data-drag="1">' +
      '<div class="ev-time">' + C.fmt(e.start) + '<small>' + C.dur(it.d).replace(' min', '′') + '</small></div><div class="ev-node"></div>' +
      '<div class="ev-card hole rv" id="ev-' + it.id + '"><div class="ev-in"><div class="ev-top"><span class="sq-ico g">' + ic('clock') + '</span>' +
      '<div class="ev-h"><h3>' + L('holeTi') + '</h3><div class="ev-meta">' + C.dur(it.d) + ' · ' + L('until', C.fmt(e.end)) + '</div></div><span class="now-pill">' + L('nowPill') + '</span></div>' +
      '<p class="ev-lead">' + L('holeLead', esc(it.holeTi)) + '</p><div class="ev-prog"><i></i></div>' +
      '<div class="btn-row js-only"><button type="button" class="btn navy sq" data-alts="' + di + ':' + it.id + '">' + ic('bulb') + L('holeFill') + '</button>' +
      '<button type="button" class="btn ghost sq" data-holeclose="' + di + ':' + it.id + '">' + ic('next') + L('holeClose') + '</button>' +
      '<button type="button" class="btn ghost sq" data-sheet="edit:' + di + '">' + ic('grip') + L('holeEdit') + '</button>' +
      '<button type="button" class="btn ghost sq" data-swap="' + it.id + ':' + (it.swapped != null ? it.swapped : -1) + '">' + ic('undo') + L('holeBack', esc(it.holeTi)) + '</button></div>' +
      '</div></div></div>';
  }
  var WSU = {};
  function wayStops(e, di) {
    var a = e.from, b = e.toIt || e.it;
    if (!a || a.lat == null || b.lat == null || e.it.mode === 'walk') return '';
    var ab = C.km(a, b); if (ab < 8) return '';
    var pd = PLANS && PLANS[di], dark = pd ? e.start >= pd.sun.dusk - 20 : false;
    var inPlan = PLANS ? inPlanTest(PLANS, di) : function () { return false; }, seen = {}, base = ttMin(a, b);
    var c = C.pool(T).concat(T.days[di].extras || []).filter(function (o) {
      if (o.lat == null || seen[o.id] || (WSU[di] || {})[o.id] || inPlan(o)) return false; seen[o.id] = 1;
      var tg = tagsOf(o); if ((tg.indexOf('photo') < 0 && o.t !== 'view') || o.private) return false;
      if (tg.indexOf('night') >= 0 && !(dark && tg.indexOf('sunset') < 0 ? true : dark)) return false;   // lo que es de noche, solo si el tramo es de noche
      var ka = C.km(a, o), kb = C.km(o, b);
      return ka > 2 && kb > 2 && ka + kb <= ab * 1.12 + 2;
    }).map(function (o) { return { o: o, det: ttMin(a, o) + ttMin(o, b) - base }; }).filter(function (z) { return z.det <= 30; }).sort(function (x, y) { return x.det - y.det; }).slice(0, 3);
    if (!c.length) return '';
    c.forEach(function (z) { (WSU[di] = WSU[di] || {})[z.o.id] = 1; });
    return '<div class="ws"><div class="ws-h">' + ic('camera') + L('wayStopsT') + '</div>' + c.map(function (z) {
      var o = z.o, d = Math.max(0, Math.round((z.det + (o.d || 15)) / 5) * 5);
      return '<div class="ws-row"><div class="ws-ph' + (o.ph ? ' ph ph-' + o.ph : '') + '">' + (o.ph ? '' : ic(tyIcon(o.t))) + '</div>' +
        '<div class="ws-t"><b>' + esc(o.ti) + '</b><small>' + L('wsPlus', C.dur(d)) + (o.photo ? ' · ' + esc(o.photo) : o.lead ? ' · ' + esc(o.lead) : '') + '</small></div>' +
        '<div class="ws-b"><a class="btn sq ws-map" href="' + shotUrl(o) + '" target="_blank" rel="noopener" aria-label="Google Maps">' + ic('map') + '</a>' +
        '<button type="button" class="btn sq ws-add" data-sheet="addto:' + di + ':' + o.id + '" aria-label="' + L('add') + '">' + ic('plus') + '</button></div></div>';
    }).join('') + '</div>';
  }
  // paseo ya contado en el horario: conector pequeño con el tiempo y enlace a Google Maps andando
  function walkPill(e, from) {
    var it = e.it, w = it.mode === 'walk', tr = it.mode === 'transit';
    var oLa = it.oLat != null ? it.oLat : from && from.lat, oLo = it.oLat != null ? it.oLon : from && from.lon;
    var href = 'https://www.google.com/maps/dir/?api=1' + (oLa != null ? '&origin=' + oLa + ',' + oLo : '') + '&destination=' + it.lat + ',' + it.lon + '&travelmode=' + (w ? 'walking' : tr ? 'transit' : 'driving');
    return '<div class="hop sched" data-s="' + e.start + '" data-e="' + e.end + '"><a class="hop-l sq" href="' + href + '" target="_blank" rel="noopener">' + ic(w ? 'walk' : tr ? 'train' : 'car') +
      '<span>' + L(w ? 'hopWalk' : tr ? 'hopBus' : 'hopCar', C.dur(it.d)) + '</span>' + ic('ext') + '</a></div>';
  }
  function hopHTML(a, b, p) {
    var st = C.km(a, b); if (st < 0.15) return '';
    var mode = p.day.mode || meta().mode || 'car', w = C.travel(a, b, 'walk'), c = C.travel(a, b, 'car'), est = !c;
    if (!w) w = { min: st * 1.3 / 4.5 * 60 }; if (!c) c = { min: st * 1.35 / 55 * 60 };
    var kind = w.min <= (mode === 'car' ? 15 : 45) ? 'walk' : mode === 'car' ? 'car' : 'bus';
    var m = kind === 'walk' ? w.min : kind === 'car' ? c.min + 5 : c.min * 1.6 + 10;
    m = Math.max(1, m < 10 ? Math.round(m) : Math.round(m / 5) * 5);
    var href = 'https://www.google.com/maps/dir/?api=1&origin=' + a.lat + ',' + a.lon + '&destination=' + b.lat + ',' + b.lon + '&travelmode=' + (kind === 'walk' ? 'walking' : kind === 'bus' ? 'transit' : 'driving');
    return '<div class="hop"><a class="hop-l sq" href="' + href + '" target="_blank" rel="noopener">' + ic(kind === 'walk' ? 'walk' : kind === 'bus' ? 'train' : 'car') +
      '<span>' + L(kind === 'walk' ? 'hopWalk' : kind === 'bus' ? 'hopBus' : 'hopCar', (est || kind === 'bus' ? '≈ ' : '') + C.dur(m)) + '</span>' + ic('ext') + '</a></div>';
  }
  function evHTML(e, seg, di) {
    var it = e.it, t = it.t, drive = t === 'drive', dark = t === 'night' || t === 'tour';
    if (it.hole && !drive) return holeHTML(e, seg, di);
    var pl0 = PLANS && PLANS[di], chips = chipsFor(e, di, pl0), recs = recTiles(it, drive), bw = pl0 ? badWeather(e, di, pl0) : null;
    var tilesHTML = recs.map(function (x) { return '<div class="rec ' + x[3] + '"><div class="k">' + ic(x[1]) + x[0] + '</div><p>' + rich(x[2]) + '</p></div>'; }).join('');
    var more = '';
    if (!e.skip && (recs.length || !drive)) {
      more = '<details class="more"><summary>' + (drive ? L('routeStops') : L('recs')) + (recs.length ? ' <span class="cnt">' + recs.length + '</span>' : '') + ic('chev') + '</summary>' +
        '<div class="more-body">' + (recs.length ? '<div class="hscroll recs">' + tilesHTML + '</div>' : '') + '<div class="maps">' + mapBtn(gmaps(it, drive), drive ? L('route') + ' · Google Maps' : 'Google Maps') + '</div></div></details>';
    }
    var routeBtn = '';
    var acts = '';
    var slotId = it.rep ? it.repOf : it.id, canSwap = !drive && (!it.extra || !!it.rep);
    if (!drive && !it.extra) acts += e.skip ? '<button type="button" class="btn ghost sq" data-skip="' + it.id + '">' + ic('undo') + (it.auto ? L('inclAnyway') : L('addBack')) + '</button>'
      : '<button type="button" class="btn ghost sq" data-holemk="' + di + ':' + it.id + '">' + ic('x') + L('remove') + '</button>';
    if (bw && canSwap && !e.skip) acts = '<button type="button" class="btn navy sq" data-alts="' + di + ':' + slotId + ':rain">' + ic('rain') + L('planB') + '</button>' + acts;
    if (canSwap && !e.skip) acts += '<button type="button" class="btn ghost sq" data-alts="' + di + ':' + slotId + '">' + ic('refresh') + L('swap') + '</button>';
    if (it.fuel && !e.skip) acts = '<button type="button" class="btn navy sq" data-sheet="bnew:fuel:' + di + '">' + ic('fuel') + L('bLogFuel') + '</button>' + acts;
    if (it.extra) acts += '<button type="button" class="btn ghost sq" data-delx="' + di + ':' + it.id + '">' + ic('x') + (it.rep ? L('remove') : L('removeExtra')) + '</button>';
    if (!drive && !e.skip && (it.lat != null || it.q)) acts += mapLink(it);
    if (!e.skip && isCromo(it)) acts = cromoBtn(it) + acts;
    if (drive && !e.skip) acts = '<a class="btn sq drv-go" href="' + gmaps(it, true) + '" target="_blank" rel="noopener">' + ic('route') + L('openGmaps') + '</a>' + acts;
    var skipBtn = acts ? '<div class="btn-row js-only">' + acts + '</div>' : '';
    var meta = drive ? (L(it.mode === 'walk' ? 'byWalk' : it.mode === 'transit' ? 'byBus' : 'byCar') + (e.skip ? ' · ' + (it.km ? '≈ ' + C.kmTxt(it.km) + ' km · ' : '') + C.dur(it.d) : '') + '<span hidden>' + (e.skip ? '' : ' · ' + L('arrive', C.fmt(e.end))) + '</span>')
                     : ((it.pl ? esc(it.pl) + ' · ' : '') + C.dur(it.d) + (e.skip ? '' : ' · ' + L('until', C.fmt(e.end))));
    var badge = drive ? '<span class="sq-ico">' + ic(it.mode === 'walk' ? 'pin' : it.mode === 'transit' ? 'train' : 'car') + '</span>'
      : '<span class="sq-ico' + (t === 'food' || dark ? ' o' : (t === 'hotel' || t === 'car' ? ' g' : '')) + '">' + ic(tyIcon(t)) + '</span>';
    var dph = drive ? it.ph || (e.toIt && e.toIt.ph) || '' : '';
    var ph = drive ? (e.skip ? '' : '<div class="drv-band sq' + (dph ? ' ph ph-' + dph : '') + '" data-sheet="item:' + it.id + '" role="button" tabindex="0">' +
        '<div class="db-in"><span class="db-i">' + ic(it.mode === 'walk' ? 'walk' : it.mode === 'transit' ? 'train' : 'car') + '</span><div class="db-t"><b>' + C.dur(it.d) + '</b><small>' + (it.km ? '≈ ' + C.kmTxt(it.km) + ' km · ' : '') + L('arrive', C.fmt(e.end)) + '</small></div></div></div>')
      : !e.skip && (it.ph || it.img) ? '<div class="ev-ph ph' + (it.ph ? ' ph-' + it.ph : '') + ' sq" data-sheet="item:' + it.id + '"' + (it.img ? ' style="background-image:url(' + it.img + ')"' : '') + ' role="button" tabindex="0" aria-label="' + esc(it.ti) + '"><div class="lab"><span>' + C.fmt(e.start) + ' – ' + C.fmt(e.end) + '</span></div><span class="ev-zoom">' + ic('eye') + '</span></div>' : '';
    var cardCls = drive ? 'card dark drv' : dark ? 'card dark' : (t === 'hotel' || t === 'car' ? 'glass' : 'card');
    var dragOk = !drive && !it.sun;
    return '<div class="ev ev--' + t + (e.skip ? ' is-skip' : '') + '" data-s="' + e.start + '" data-e="' + e.end + '" data-id="' + it.id + '" data-seg="' + seg + '"' + (dragOk ? ' data-drag="1"' : '') + '>' +
      '<div class="ev-time">' + (e.skip ? '—' : C.fmt(e.start)) + (drive || e.skip ? '' : '<small>' + C.dur(it.d).replace(' min', '′') + '</small>' + wxBadge(e, di)) + '</div>' +
      '<div class="ev-node"></div>' +
      '<div class="ev-card ' + cardCls + ' rv" id="ev-' + it.id + '">' + ph +
        '<div class="ev-in"><div class="ev-top">' + badge + '<div class="ev-h" data-sheet="item:' + it.id + '"><h3>' + esc(it.ti) + '</h3><div class="ev-meta">' + meta + '</div></div>' + routeBtn + '<span class="now-pill">' + L('nowPill') + '</span></div>' +
        (chips ? '<div class="chips">' + chips + '</div>' : '') +
        (it.lead && !e.skip ? '<p class="ev-lead">' + esc(it.lead) + '</p>' : '') + (e.skip ? '' : filmHTML(it) + shotHTML(it)) + (drive && !e.skip ? wayStops(e, di) : '') +
        '<div class="ev-prog"><i></i></div>' + skipBtn + more +
      '</div></div></div>';
  }

  var PROF = { short: 'pShort', mid: 'pMid', long: 'pLong', all: 'pAll' };
  function tile(ico, title, text, kind, sheetAttr) {
    return '<div class="tile glass sq ' + (kind === 'warn' ? 'warn' : '') + '"' + (sheetAttr || '') + ' role="button" tabindex="0"><div class="tt"><span class="sq-ico' + (kind === 'warn' ? ' o' : kind === 'tip' ? ' g' : '') + '">' + ic(ico) + '</span><b>' + esc(title) + '</b></div><p>' + esc(text) + '</p></div>';
  }

  // ¿has cambiado algo en este día? (añadidos, reemplazos, huecos, quitadas, orden, alternativas, horas elegidas)
  // ruta sugerida activa del día (null si es el plan de la guía) y su nombre corto
  function curRoute(d, custom) { var id = (((custom || {}).preset || {})[d.id]) || 'guia'; return (d.routes || []).filter(function (r) { return r.id === id; })[0] || null; }
  function routeName(r) { return r ? (I18N.lang === 'en' && r.short_en ? r.short_en : r.short || r.ti) : L('presetGuide'); }
  function resetLbl(d, custom, dflt) { var r = curRoute(d, custom); return r ? L('resetRoute', esc(routeName(r))) : dflt; }
  // ¿hay cambios a mano? se compara con la ruta activa tal como viene (la de la guía o una sugerida)
  function dayTouched(p, custom) {
    var d = p.day, cs = custom || {}, sk = SKIPS ? SKIPS() : {}, r = curRoute(d, cs), base = presetState(T.days.indexOf(d), r ? r.id : 'guia', cs, sk);
    function snap(c, s0) {
      return JSON.stringify(['extras', 'order', 'gaps', 'sunPos', 'prefAt', 'free', 'durs'].map(function (k) { var v = (c[k] || {})[d.id]; return v && (v.length || Object.keys(v).length) ? v : null; })
        .concat(d.items.map(function (it) { return [(c.swaps || {})[it.id], s0[it.id] ? 1 : 0]; })));
    }
    return snap(cs, sk) !== snap(base.cu, base.sk);
  }
  function day(p, i, custom) {
    WSU[i] = {};   // paradas por el camino ya sugeridas este día: cada una solo una vez
    var d = p.day, s = p.sun;
    var cover = '<div class="cover ph ph-' + d.ph + ' rv" data-par data-sheet="photo:' + d.ph + ':' + i + '" role="img" aria-label="' + esc(d.title) + '">' + langToggle() + '<div class="eyebrow">' + L('day') + ' ' + (i + 1) + ' · ' + esc(C.dateLabel(p.ms)) + '</div><h2>' + esc(d.title) + '</h2><p>' + esc(d.sub) + '</p></div>';
    var lightCard = '<div class="card rv"><div class="eyebrow">' + L('lightOf', esc(d.ref.name)) + '</div>' + sunArc(p, i) +
      '<div class="sunline"><button type="button" class="tbtn sq" data-time="' + Math.round(s.gold) + '" data-tday="' + i + '">' + ic('sun') + 'Golden hour <b>' + C.fmt(s.gold) + '</b></button>' +
      '<button type="button" class="tbtn sq" data-time="' + Math.round(s.dusk) + '" data-tday="' + i + '">' + ic('moon') + L('fullDark') + ' <b>' + C.fmt(s.dusk) + '</b></button></div>' +
      '<div class="wxmini" data-wxd="' + i + '">' + wxMini(null, p, i) + '</div>' +
      '<div class="stats"><div class="stat o sq" data-sheet="light:' + i + '" role="button" tabindex="0"><b>' + hshort(s.set - s.rise) + '</b><span>' + L('ofLight') + '</span></div>' +
        '<div class="stat sq"' + (p.km ? ' data-sheet="drives:' + i + '"' : '') + ' role="button" tabindex="0"><b>' + (p.km ? C.kmTxt(p.km) + ' km' : L('onFoot')) + '</b><span>' + (p.km ? L('driving', C.dur(p.driveMin)) : L('noCar')) + '</span></div>' +
        '<div class="stat sq" data-time="' + Math.round(p.last - 1) + '" data-tday="' + i + '" role="button" tabindex="0"><b>' + C.fmt(p.last) + '</b><span>' + L('dayEnds') + '</span></div></div></div>';

    var stopsArr = p.ev.filter(function (e) { return e.it.t !== 'drive' && !e.it.hidden && !e.it.hole; });
    var stops = stopsArr.map(function (e) {
      var it = e.it;
      return '<a class="stop sq ' + (it.ph ? 'ph ph-' + it.ph : it.img ? 'ph' : 'noph') + (e.skip ? ' is-skip' : '') + '" href="#ev-' + it.id + '" data-sheet="item:' + it.id + '"' + (it.img && !it.ph ? ' style="background-image:url(' + it.img + ')"' : '') + '>' + (it.ph || it.img ? '' : ic(tyIcon(it.t))) +
        '<div class="h">' + (e.skip ? L('dropped') : C.fmt(e.start)) + '</div><div class="n">' + esc(it.ti) + '</div></a>';
    }).join('');

    var tiles = [];
    (p.clashes || []).forEach(function (cx) {
      tiles.push(tile('lock', L('clashT', cx.ancTi), cx.pick ? L('clashPicked') : L('clashB', C.fmt(cx.set)), cx.pick ? '' : 'warn', ' data-sheet="sunclash:' + i + '"'));
    });
    if (p.fix) tiles.push(tile('alert', L('fixT'), L('fixB'), 'warn', ' data-fixorder="' + i + '"'));
    var nFilm = p.day.items.concat(p.day.extras || []).filter(function (o) { return o.film; }).length;
    if (nFilm) tiles.push(tile('film', L('filmsDayT', i + 1), L('filmsDayB', nFilm), 'tip', ' data-sheet="films:' + i + '"'));
    if ((p.day.routes || []).length) { var curP = (((custom || {}).preset || {})[p.day.id]) || 'guia', rP = (p.day.routes || []).filter(function (r) { return r.id === curP; })[0];
      tiles.unshift(tile('route', L('presetsT'), L('presetsTile', rP ? (I18N.lang === 'en' && rP.ti_en ? rP.ti_en : rP.ti) : L('presetGuide'), (p.day.routes || []).length + 1), '', ' data-sheet="routes:' + i + '"')); }
    photoRoutesOf(i).forEach(function (r) { tiles.push(tile('camera', L('prTitle') + ' · ' + (I18N.lang === 'en' && r.ti_en ? r.ti_en : r.ti), L('prTile', r.ids.length, (Math.round(photoKm(r) * 10) / 10).toString().replace('.', I18N.lang === 'en' ? '.' : ',')), 'tip', ' data-sheet="photort:' + i + '"')); });
    var ss = sunSpots(p, i), so = sunOutlook(i, p), soTxt = so ? ' · ' + (so.level === 'good' ? L('soGood') : so.level === 'mixed' ? L('soMixed') : L('soBad')) : '';
    if (ss.have) tiles.push(tile(so && so.level === 'bad' ? 'cloud' : 'sunset', L('ssTile', C.fmt(ss.set)) + soTxt, L('ssHave', ss.have.ti), so && so.level === 'bad' ? 'warn' : '', ' data-sheet="sunspots:' + i + '"'));
    else if (ss.list.length) tiles.push(tile('sunset', L('ssTile', C.fmt(ss.set)), ss.list.slice(0, 2).map(function (z) { return z.o.ti; }).join(' · '), '', ' data-sheet="sunspots:' + i + '"'));
    if (!p.warns.length) tiles.push(tile('check', L('okLight'), L('okLightBody'), ''));
    p.warns.forEach(function (w) { tiles.push(tile(w.k === 'closed' ? 'lock' : 'alert', w.ti, w.t, 'warn', ' data-jump="' + w.id + '"')); });
    if (p.darkDrive >= 15) tiles.push(tile('car', L('nightDrive'), L('nightDriveBody', C.dur(p.darkDrive)), 'warn', ' data-sheet="drives:' + i + '"'));
    var dt = new Date(p.ms), md = ('0' + (dt.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + dt.getUTCDate()).slice(-2);
    (T.events || []).forEach(function (x, k) {
      var hit = x.md === md || (x.from && (x.from <= x.to ? (x.from <= md && md <= x.to) : (md >= x.from || md <= x.to)));
      if (hit) tiles.push(tile(x.icon, x.ti, x.t, '', ' data-sheet="event:' + k + '"'));
    });
    d.tips.forEach(function (t, k) { if (t.c === 'all' || t.c === p.profile) tiles.push(tile('bulb', L(PROF[t.c]), t.t, 'tip', ' data-sheet="tip:' + i + ':' + k + '"')); });

    var tl = '', mi = 0, mks = p.markers.slice().sort(function (a, b) { return a.t - b.t; });
    function where(t) { for (var k = 0; k < p.live.length; k++) if (t >= p.live[k].start && t < p.live[k].end) return p.live[k].it.ti; return ''; }
    function flush(upto) {
      while (mi < mks.length && mks[mi].t <= upto) {
        var m = mks[mi++], w = where(m.t);
        tl += '<div class="mk ' + m.cls + '" data-time="' + Math.round(m.t) + '" data-tday="' + i + '" role="button" tabindex="0"><div class="mk-time">' + C.fmt(m.t) + '</div><div class="mk-node"></div><div class="mk-txt">' + ic(m.icon) + '<em>' + m.label + '</em>' + (w ? '<span>· ' + esc(w) + '</span>' : '') + '</div></div>';
      }
    }
    var seg = 0, lastA = null, hadLeg = false;
    p.ev.forEach(function (e, k) {
      if (e.it.t === 'drive') { e.from = lastA; e.toIt = null; for (var q = k + 1; q < p.ev.length && !e.toIt; q++) { var z = p.ev[q]; if (!z.skip && !z.it.hidden && z.it.t !== 'drive') e.toIt = z.it; } }
      if (e.it.hidden) return;
      if (e.it.t === 'drive') seg++;
      if (!e.skip) {
        flush(e.start);
        if (e.it.t === 'drive') hadLeg = true;
        else if (!e.it.hole && e.it.lat != null) { if (lastA && !hadLeg && !e.it.jump) tl += hopHTML(lastA, e.it, p); lastA = e.it; hadLeg = false; }
        if (e.it.t === 'drive' && (e.it.autoLeg || (!e.it.ph && !(e.it.tips || []).length && !(e.it.see || []).length)) && (e.it.mode === 'walk' ? e.it.d <= 25 : e.it.d < 15)) {
          if (e.gap >= 15) tl += '<div class="gap"><div class="g">' + ic('cup') + L('gapFree', C.dur(e.gap)) + '</div></div>';
          tl += walkPill(e, lastA); seg++; return;
        }
        if (e.gap >= 15) tl += '<div class="gap"><div class="g">' + (e.it.at && !e.it.soft && e.it.t !== 'food' ? ic('clock') + L('gapFixed', C.dur(e.gap)) : ic('cup') + L('gapFree', C.dur(e.gap))) +
          (e.gap >= 25 && d.extras ? '<button type="button" class="gapadd sq js-only" data-extras="' + i + ':' + e.it.id + ':' + Math.round(e.gap) + ':' + Math.round(e.start - e.gap) + '">+ ' + L('addPlan') + '</button>' : '') + '</div></div>';
      }
      tl += evHTML(e, e.it.t === 'drive' ? -1 : seg, i);
      if (e.it.t === 'drive') seg++;
    });
    flush(9999);
    var touched = dayTouched(p, custom);
    tl += '<div class="gap end js-only"><div class="g">' + (d.extras ? '<button type="button" class="gapadd sq" data-extras="' + i + ':END:240:' + Math.round(p.last) + '">+ ' + L('addPlanEnd') + '</button>' : '') +
      (touched ? '<button type="button" class="gapadd ghost sq" data-resetday="' + i + '">' + ic('undo') + resetLbl(d, custom, L('resetDay')) + '</button>' : '') + '</div></div>';
    var off = p.off.map(function (it) { return '<p class="muted small" style="margin:4px 4px 0">' + esc(L('offSeason', it.ti)) + '</p>'; }).join('');

    return cover + lightCard +
      sh(L('stops'), stopsArr.filter(function (e) { return !e.skip; }).length) + hs(stops, '', ' aria-label="' + L('stopsAria') + '"') +
      sh(L('beforeStart'), tiles.length) + hs(tiles.join('')) + guideHTML(d, i) +
      sh(L('itinerary'), null, '<span class="sh-btns js-only"><button type="button" class="btn ghost sq sh-edit" data-sheet="route:' + i + '">' + ic('map') + L('mapBtn') + '</button>' +
        ((p.day.routes || []).length ? '<button type="button" class="btn ghost sq sh-edit" data-sheet="routes:' + i + '">' + ic('route') + L('routesBtn') + '<i class="sh-n">' + ((p.day.routes || []).length + 1) + '</i></button>' : '') +
        '<button type="button" class="btn navy sq sh-edit" data-sheet="edit:' + i + '">' + ic('grip') + L('editDay') + '</button>' +
        (touched ? '<button type="button" class="btn ghost sq sh-edit sh-undo" data-resetday="' + i + '" aria-label="' + resetLbl(d, custom, L('resetDay')) + '" title="' + resetLbl(d, custom, L('resetDay')) + '">' + ic('undo') + '</button>' : '') + '</span>') +
      ((p.day.routes || []).length ? (function () {
        var cur = (((custom || {}).preset || {})[p.day.id]) || 'guia', en = I18N.lang === 'en';
        return '<div class="pr-seg js-only" role="group" aria-label="' + L('presetsT') + '">' + [{ id: 'guia', ti: L('presetGuide') }].concat(p.day.routes.map(function (r) { return { id: r.id, ti: en && r.short_en ? r.short_en : r.short || r.ti }; })).map(function (o) {
          return '<button type="button" class="pr-sb sq' + (o.id === cur ? ' on' : '') + '" data-preset="' + i + ':' + o.id + '" aria-pressed="' + (o.id === cur) + '">' + esc(o.ti) + '</button>';
        }).join('') + '</div>';
      })() : '') +
      '<div class="pr-seg vw-seg js-only" role="group" aria-label="' + L('viewT') + '"><button type="button" class="pr-sb sq" data-view="full">' + ic('camera') + L('viewFull') + '</button><button type="button" class="pr-sb sq" data-view="list">' + ic('list') + L('viewList') + '</button></div>' +
      '<p class="sh-hint2 js-only">' + L('tlHint') + ' · ' + L('dragHint') + '</p>' +
      '<div class="tl" data-tl="' + i + '"><div class="tl-scrub js-only" data-scrub="' + i + '" aria-hidden="true"></div>' +
      '<div class="nowline js-only" aria-hidden="true"><span class="nl-pill"><i class="live-dot"></i><b>--:--</b></span><button type="button" class="nl-sync" data-sync aria-label="' + L('sync') + '">' + ic('refresh') + '</button></div>' + tl + '</div>' + off;
  }

  /* ---------- Presupuesto ---------- */
  // el álbum se lee ya aquí: la guía se pinta antes de que la app lo pase con setAlbum
  var BUD = { list: [], payers: null }, DOCS = [], ALB = (function () { try { return JSON.parse(localStorage.getItem('guia-album') || '{}') || {}; } catch (_) { return {}; } })();
  // álbum de cromos: los sitios que se visitan (no comidas, hoteles ni trayectos)
  function isCromo(it) { return !!it && ['visit', 'walk', 'view', 'tour', 'night'].indexOf(it.t) >= 0 && !it.hidden && !it.hole && !/aeropuerto|airport/i.test(it.ti); }
  function cromoKey(id) { return ((window.TRIP_META || {}).id || 'guia') + '|' + id; }
  function cromoBtn(it) {
    var got = ALB[cromoKey(it.id)];
    return '<button type="button" class="btn sq cromo-b' + (got ? ' got' : '') + '" data-cromo="' + it.id + '">' + ic(got ? 'check' : 'camera') + (got ? L('cromoGot') : L('cromoAdd')) + '</button>';
  }
  var BC = [['ticket', 'ticket', 'bTickets'], ['food', 'food', 'bFood'], ['fuel', 'fuel', 'bFuel'], ['parking', 'car', 'bParking'], ['shop', 'shop', 'bShop'], ['hotel', 'bed', 'bHotel'], ['other', 'card', 'bOther']];
  function setBudget(list, payers) { BUD.list = list || []; if (payers) BUD.payers = payers; }
  function payers() { var p = BUD.payers || []; return [p[0] || L('payMe'), p[1] || L('payYou')]; }
  function catIcon(c) { for (var k = 0; k < BC.length; k++) if (BC[k][0] === c) return BC[k][1]; return 'card'; }
  function budgetCard(plans) {
    var list = BUD.list, by = {}, tot = 0, names = {};
    plans.forEach(function (p) { p.ev.forEach(function (e) { names[e.it.id] = e.it.ti; }); });
    list.forEach(function (x) { by[x.c] = (by[x.c] || 0) + x.a; tot += x.a; });
    var cats = BC.filter(function (c) { return by[c[0]]; }).map(function (c) {
      return '<div class="bud-row"><span class="sq-ico g">' + ic(c[1]) + '</span><div class="bud-m"><div class="bud-t"><b>' + L(c[2]) + '</b><span>' + money(by[c[0]]) + '</span></div>' +
        '<div class="bud-bar"><i style="width:' + Math.round(by[c[0]] / tot * 100) + '%"></i></div></div></div>';
    }).join('');
    function row(x) {
      return '<div class="bl-row"><span class="sq-ico ' + (x.c === 'fuel' ? 'o' : 'g') + '">' + ic(catIcon(x.c)) + '</span><span class="bl-n">' + esc((x.src && names[x.src]) || x.n) + '<small>' + esc(catLabel(x.c)) + '</small></span>' +
        '<button type="button" class="bl-pay js-only' + (x.by ? ' b' : '') + '" data-bpay="' + x.id + '" aria-label="' + esc(L('payBy', payers()[x.by ? 1 : 0])) + '">' + esc(payers()[x.by ? 1 : 0].slice(0, 1).toUpperCase()) + '</button>' +
        '<label class="bl-amt js-only">' + cur() + '<input type="text" inputmode="decimal" autocomplete="off" data-bamt="' + x.id + '" value="' + x.a + '"></label><b class="nojs-only">' + money(x.a) + '</b>' +
        '<button type="button" class="bud-del js-only" data-bdel="' + x.id + '" aria-label="×">' + ic('x') + '</button></div>';
    }
    var groups = [[-1, L('bGeneral')]].concat(plans.map(function (p, i) { return [i, L('day') + ' ' + (i + 1) + ' · ' + p.day.title]; })).map(function (g) {
      var items = list.filter(function (x) { return x.di === g[0]; });
      if (!items.length) return '';
      return '<div class="bl-day"><div class="bl-dh"><span>' + esc(g[1]) + '</span><b>' + money(items.reduce(function (a, x) { return a + x.a; }, 0)) + '</b></div>' + items.map(row).join('') + '</div>';
    }).join('');
    return '<div class="card rv bud" id="budCard"><div class="eyebrow">' + L('budTrip') + '</div>' +
      '<div class="bud-big one"><div><small>' + L('bTotal') + '</small><b>' + money(tot) + '</b>' + (by.fuel ? '<span>' + L('bFuel') + ' ' + money(by.fuel) + '</span>' : '') + '</div></div>' + cats +
      '<div class="btn-row js-only"><button type="button" class="btn ghost sq" data-sheet="bpick:0">+ ' + L('bAddFrom') + '</button><button type="button" class="btn ghost sq" data-sheet="bnew:0">+ ' + L('bAddNew') + '</button></div>' +
      (groups || '<p class="wx-note">' + L('bEmpty') + '</p>') + splitCard(list, tot) +
      '<p class="wx-note">' + L('budNote') + '</p></div>';
  }
  // cuentas a medias entre los dos viajeros: quién pagó cada gasto y quién debe a quién
  function splitCard(list, tot) {
    if (!tot) return '';
    var pn = payers(), paid = [0, 0];
    list.forEach(function (x) { paid[x.by ? 1 : 0] += x.a; });
    var d = Math.round((paid[0] - tot / 2) * 100) / 100;
    return '<div class="split js-only"><div class="eyebrow">' + L('splitT') + '</div>' +
      '<div class="split-names">' + [0, 1].map(function (k) { return '<label><span>' + L('payName', k + 1) + '</span><input type="text" maxlength="20" data-payname="' + k + '" value="' + esc(pn[k]) + '"></label>'; }).join('') + '</div>' +
      [0, 1].map(function (k) { return '<div class="split-row"><span><i class="bl-pay' + (k ? ' b' : '') + '">' + esc(pn[k].slice(0, 1).toUpperCase()) + '</i>' + esc(L('payPaid', pn[k])) + '</span><b>' + money(paid[k]) + '</b></div>'; }).join('') +
      '<p class="split-res">' + (Math.abs(d) < 0.01 ? L('splitEven') : esc(L('splitOwes', d > 0 ? pn[1] : pn[0], d > 0 ? pn[0] : pn[1])) + ' <b>' + money(Math.abs(d)) + '</b>') + '</p>' +
      '<p class="wx-note">' + L('splitHow') + '</p></div>';
  }
  function areaName(a) { return I18N.lang === 'en' && a.n_en ? a.n_en : a.n; }
  function fuelMin(st, k) { var m = 0; st.forEach(function (s) { if (s[k] && (!m || s[k] < m)) m = s[k]; }); return m; }
  function p3(v) { return v ? cur() + v.toFixed(3) : '—'; }
  // diferencia con la media de Escocia, en peniques
  function fuelDiff(v, med) {
    if (!v) return '';
    var d = Math.round((med - v) * 100);
    return d >= 1 ? '<em class="fu-d ok">' + L('fuCheaper', d) + '</em>' : d <= -1 ? '<em class="fu-d hi">' + L('fuDearer', -d) + '</em>' : '<em class="fu-d">' + L('fuAvg') + '</em>';
  }
  function fuelCard() {
    var F = T.fuel; if (!F) return '';
    var days = [], dayN = {};
    T.days.forEach(function (d, k) { dayN[d.id] = k + 1; });
    F.areas.forEach(function (a) { if (days.indexOf(a.day) < 0) days.push(a.day); });
    var best = null;
    F.areas.forEach(function (a) { a.st.forEach(function (s) { if (s.e10 && (!best || s.e10 < best.s.e10)) best = { s: s, a: a }; }); });
    var lastOk = null;
    var cards = F.areas.map(function (a, k) {
      var e = fuelMin(a.st, 'e10'), b = fuelMin(a.st, 'b7'), top = a.st.filter(function (s) { return s.e10 === e; })[0] || a.st[0];
      var head = '<div class="gt"><span class="sq-ico ' + (a.st.length ? 'o' : 'g') + '">' + ic(a.st.length ? 'fuel' : 'alert') + '</span><span class="gk">' + L('day') + ' ' + dayN[a.day] + '</span>' +
        (a.st.length ? '<span class="gp">' + a.st.length + ' ' + ic('chev') + '</span>' : '') + '</div><b>' + esc(areaName(a)) + '</b>';
      var out;
      if (!a.st.length) {
        out = '<div class="gtile glass fu-t none" data-k="' + a.day + '">' + head +
          '<p>' + L('fuNoneTip2', lastOk ? esc(lastOk) : '') + '</p>' +
          '<a class="btn ghost sq fu-go" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('petrol station near ' + a.lat + ',' + a.lon) + '" target="_blank" rel="noopener">' + ic('map') + L('fuSearchShort') + '</a></div>';
      } else {
        out = '<div class="gtile glass fu-t" data-k="' + a.day + '" data-sheet="fuel:' + k + '" role="button" tabindex="0">' + head +
          '<div class="fu-big"><div><small>' + L('fuPetrol') + '</small><strong>' + p3(e) + '</strong>' + fuelDiff(e, F.medE10) + '</div>' +
          '<div><small>' + L('fuDiesel') + '</small><strong>' + p3(b) + '</strong>' + fuelDiff(b, F.medB7) + '</div></div>' +
          '<small>' + L('fuBestAt', esc(top.b), top.d) + '</small>' +
          '<a class="btn navy sq fu-go" href="https://www.google.com/maps/dir/?api=1&destination=' + top.lat + ',' + top.lon + '&travelmode=driving" target="_blank" rel="noopener">' + ic('route') + L('fuGo') + '</a></div>';
        lastOk = areaName(a);
      }
      return out;
    }).join('');
    var dayChips = [['all', L('fAll')]].concat(days.map(function (d) {
      var m = 0; F.areas.forEach(function (a) { if (a.day === d) { var v = fuelMin(a.st, 'e10'); if (v && (!m || v < m)) m = v; } });
      return [d, L('day') + ' ' + dayN[d] + (m ? ' · ' + cur() + m.toFixed(3) : '')];
    }));
    return '<div class="card rv fu"><div class="eyebrow">' + L('fuTitle') + '</div>' +
      '<div class="fu-hero"><div class="fu-h"><small>' + L('fuPetrol') + ' · E10</small><strong>' + p3(F.medE10) + '</strong><span>' + L('fuPerL') + '</span></div>' +
        '<div class="fu-h"><small>' + L('fuDiesel') + ' · B7</small><strong>' + p3(F.medB7) + '</strong><span>' + L('fuPerL') + '</span></div></div>' +
      '<p class="fu-med">' + L('fuMedian2', C.dateLabel(C.parseISO(F.at)).replace(/^\S+\s+/, '')) + '</p>' +
      (best ? '<a class="fu-best sq" href="https://www.google.com/maps/dir/?api=1&destination=' + best.s.lat + ',' + best.s.lon + '&travelmode=driving" target="_blank" rel="noopener"><span class="sq-ico o">' + ic('fuel') + '</span>' +
        '<span><small>' + L('fuCheapest') + '</small><b>' + esc(best.s.b) + ' · ' + esc(areaName(best.a)) + '</b></span><strong>' + p3(best.s.e10) + '</strong></a>' : '') +
      '</div>' +
      sh(L('fuByTown'), F.areas.length) + filterRow(dayChips) + hs(cards, 'guide') +
      '<p class="wx-note">' + L('fuNote', C.dateLabel(C.parseISO(F.at)), F.src.map(function (x) { return x.toUpperCase(); }).join(', ')) + '</p>';
  }
  function money(v) { v = Math.round(v * 100) / 100; return cur() + (v % 1 ? v.toFixed(2) : v); }
  function catLabel(c) { for (var k = 0; k < BC.length; k++) if (BC[k][0] === c) return L(BC[k][2]); return c; }
  /* ---------- Preparar: panel de grupos ---------- */
  var GRP = [['fl', 'plane', 'gFl', 'n'], ['stay', 'bed', 'gStay', 'n'], ['ida', 'bag', 'gIda', 'g'], ['vuelta', 'bag', 'gVuelta', 'g'],
             ['money', 'card', 'gMoney', 'o'], ['fuel', 'fuel', 'gFuel', 'o'], ['wx', 'cloudsun', 'gWx', 'b'], ['sug', 'shop', 'gSug', 'b'],
             ['docs', 'ticket', 'gDocs', 'n'], ['data', 'doc', 'gData', 'g']];
  // progreso de la maleta: ida («out») o vuelta («back»)
  function chkStat(checked, when) {
    var all = 0, done = 0, imp = 0;
    T.checklist.forEach(function (c) { if ((c.when || 'out') !== when) return; c.items.forEach(function (i) { all++; if (checked[i.id]) done++; else if (i.imp) imp++; }); });
    return { all: all, done: done, imp: imp };
  }
  function hubTiles(o) {
    var tot = BUD.list.reduce(function (s0, x) { return s0 + x.a; }, 0), fuelTot = BUD.list.reduce(function (s0, x) { return s0 + (x.c === 'fuel' ? x.a : 0); }, 0), F = T.fuel, best = 0;
    if (F) F.areas.forEach(function (ar) { ar.st.forEach(function (st) { if (st.e10 && (!best || st.e10 < best)) best = st.e10; }); });
    function fd(f) { f = f || {}; return f.date ? esc(C.dateLabel(C.parseISO(f.date)).replace(/^\S+\s+/, '')) + (f.time ? ' · ' + esc(f.time) : '') : '—'; }
    var w0 = T.wx[0], S = T.souvenirs || [], nG = 0;
    T.days.forEach(function (d) { nG += (d.guide || []).length; });
    function pill(txt, cls) { return '<span class="hub-pill ' + (cls || '') + '">' + txt + '</span>'; }
    // todas iguales: icono, aviso a la derecha, título y dos líneas
    function tile(g, l1, l2, p) {
      return '<button type="button" class="card hub-t sq" data-grp="' + g[0] + '"><span class="hub-top"><span class="sq-ico hub-i ' + g[3] + '">' + ic(g[1]) + '</span>' + (p || '') + ic('chev') + '</span>' +
        '<b>' + L(g[2]) + '</b><small>' + l1 + '</small><small>' + (l2 || '&nbsp;') + '</small></button>';
    }
    var G = {}; GRP.forEach(function (g) { G[g[0]] = g; });
    var fl = o.flights || {}, flMiss = !(fl.out && fl.out.date && fl.out.time) || !(fl.back && fl.back.date && fl.back.time);
    var hs = (o.hotels || {}), stN = (T.stays || []).length, stOk = (T.stays || []).filter(function (z) { return hs[z.id] && hs[z.id].name; }).length;
    var nextStay = (T.stays || []).filter(function (z) { return hs[z.id] && hs[z.id].name; })[0];
    function chkTile(k, when) {
      var c = chkStat(o.checked, when), pc = c.all ? Math.round(c.done / c.all * 100) : 0;
      return tile(G[k], L('gReady', c.done, c.all), c.imp ? '<span class="warn-t">' + L('gImp', c.imp) + '</span>' : '<span class="ok-t">' + L('gImpOk') + '</span>', pill(pc + '%', pc === 100 ? 'ok' : ''));
    }
    return tile(G.fl, L('flOut') + ': ' + fd(fl.out), L('flBack') + ': ' + fd(fl.back), flMiss ? pill(L('hubMiss'), 'warn') : '') +
      tile(G.stay, L('hubStay', stOk, stN), nextStay ? esc(hs[nextStay.id].name) : L('hubStayAdd'), stOk < stN ? pill(L('hubMissN', stN - stOk), 'warn') : pill(ic('check'), 'ok')) +
      chkTile('ida', 'out') + chkTile('vuelta', 'back') +
      tile(G.money, '<span class="big">' + (tot ? money(tot) : cur() + '0') + '</span>', L('hubSpentN', BUD.list.length)) +
      tile(G.fuel, best ? L('gFuelFrom', best.toFixed(3)) : '', fuelTot ? L('hubFuelSpent', money(fuelTot)) : L('hubFuelAdd')) +
      tile(G.wx, o.snow && o.snow.length ? '<span class="snow-t">' + ic('snow') + L('gSnow', esc(o.snow.join(', '))) + '</span>' : L('gWxSub', esc(w0.n), w0.hi, w0.lo), L('hubWx2')) +
      tile(G.sug, L('gSugSub', S.length, nG), '', '<span class="hub-ph">' + S.slice(0, 3).map(function (x) { return x.ph ? '<i class="ph ph-' + x.ph + '"></i>' : ''; }).join('') + '</span>') +
      tile(G.docs, DOCS.length === 1 ? L('docsN1') : L('docsN', DOCS.length), L('docsSub')) +
      tile(G.data, L('gDataSub'), L('gDataSub2')) + albumTile();
  }
  // «Mi álbum»: cromos pegados de este viaje (la hoja con el álbum y el perfil la pinta album.js)
  function albumTile() {
    var n = 0, got = 0;
    T.days.forEach(function (d) { d.items.forEach(function (it) { if (isCromo(it)) { n++; if (ALB[cromoKey(it.id)]) got++; } }); });
    return '<button type="button" class="card hub-t sq" data-album><span class="hub-top"><span class="sq-ico hub-i o">' + ic('camera') + '</span><span class="hub-pill' + (n && got === n ? ' ok' : '') + '">' + got + '/' + n + '</span>' + ic('chev') + '</span>' +
      '<b>' + L('albT') + '</b><small>' + L('albSub', got, n) + '</small><small>' + L('albSub2') + '</small></button>';
  }
  // alojamiento por noches: nombre, dirección (o enlace de Google Maps), hora de llegada (fija en el plan), check-out, desayuno
  function stays(hs) {
    hs = hs || {};
    return '<div class="card rv stay-note"><p class="wx-note" style="margin-top:0">' + L('stNote') + '</p></div>' + (T.stays || []).map(function (z, k) {
      var h = hs[z.id] || {}, di = T.days.map(function (d) { return d.id; }).indexOf(z.id), ms = PLANS && PLANS[di] ? PLANS[di].ms : null, town = I18N.lang === 'en' && z.town_en ? z.town_en : z.town;
      function f(key, lbl, type, ph) { return '<label class="stay-f"><span>' + lbl + '</span><input type="' + type + '" data-stay="' + z.id + '.' + key + '" value="' + esc(h[key] || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + ' autocomplete="off"></label>'; }
      var loc = h.lat != null ? '<span class="ok-t">' + ic('check') + L('stLocOk') + '</span>' : '<span class="muted">' + L('stLocTown', esc(town)) + '</span>';
      var hev = null; if (PLANS && PLANS[di]) PLANS[di].ev.forEach(function (e) { if (e.it.stay === z.id && e.it.t === 'hotel' && !e.skip) hev = e; });
      var arrived = hev ? hev.start - (hev.gap || 0) : null, late = hev && h.arr && arrived > C.hm(h.arr) + 1;
      if (hev) loc += '<span class="stay-plan' + (late ? ' warn-t' : '') + '">' + ic(late ? 'alert' : 'clock') + (late ? L('stLate', C.fmt(arrived), h.arr) : L('stPlanArr', C.fmt(arrived))) + '</span>';
      var mq = h.name ? encodeURIComponent(h.name + (h.addr && !/^https?:/.test(h.addr) ? ', ' + h.addr : '') + ', ' + town) : h.lat != null ? h.lat + ',' + h.lon : '';
      var gq = encodeURIComponent((h.name || '') + ', ' + (z.town_en || z.town));
      var photo = h.img ? '<div class="stay-ph" style="background-image:url(' + h.img + ')"></div>' + (h.imgCredit ? '<div class="stay-cr">' + ic('camera') + esc(h.imgCredit) + '</div>' : '')
        : h.name && h.lat != null && h.noImg ? '<a class="stay-noph" href="https://www.google.com/maps/search/?api=1&query=' + gq + '" target="_blank" rel="noopener">' + ic('camera') + L('stPhotoG') + '</a>' : '';
      return '<div class="card rv stay-c">' + photo + '<div class="stay-h"><span class="sq-ico hub-i n">' + ic('bed') + '</span><div><b>' + L('stNight', k + 1, esc(town)) + '</b><small>' + (ms ? esc(C.dateLabel(ms)) : '') + '</small></div>' +
          (h.name ? '<span class="hub-pill ok">' + ic('check') + '</span>' : '<span class="hub-pill warn">' + L('hubMiss') + '</span>') + '</div>' +
        f('name', L('stName'), 'text', L('stNamePh')) + f('addr', L('stAddr'), 'text', L('stAddrPh')) +
        '<div class="stay-row">' + f('arr', L('stArr'), 'time') + f('out', L('stOut'), 'time') + '</div>' + f('ref', L('stRef'), 'text') +
        '<label class="stay-bf"><input type="checkbox" data-stay="' + z.id + '.bf"' + (h.bf === false ? '' : ' checked') + '> ' + L('stBf') + '</label>' +
        '<div class="stay-loc">' + loc + '</div>' +
        '<div class="sv-row js-only"><button type="button" class="btn sq sv-btn" data-staysave="' + z.id + '">' + ic('check') + L('save') + '</button>' +
          '<span class="sv-st">' + (h.name ? '✓ ' + (h.savedAt ? L('savedAt', esc(h.savedAt)) : L('savedTxt')) : '') + '</span></div>' +
        '<div class="btn-row js-only"><button type="button" class="btn ghost sq" data-stayloc="' + z.id + '">' + ic('pin') + L('stLoc') + '</button>' +
          (mq ? '<a class="btn ghost sq" href="https://www.google.com/maps/search/?api=1&query=' + mq + '" target="_blank" rel="noopener">' + ic('map') + L('maps') + '</a>' : '') +
          (h.web ? '<a class="btn ghost sq" href="' + esc(h.web) + '" target="_blank" rel="noopener">' + ic('ext') + L('stWeb') + '</a>' : '') +
          (h.name ? '<button type="button" class="btn ghost sq" data-staydel="' + z.id + '">' + ic('x') + L('stDel') + '</button>' : '') + '</div></div>';
    }).join('');
  }
  // reservas guardadas en el móvil (IndexedDB): entradas, tarjetas de embarque, confirmaciones
  function docs() {
    function kb(n) { return n > 1048576 ? (n / 1048576).toFixed(1).replace('.', I18N.lang === 'en' ? '.' : ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
    var rows = DOCS.map(function (d) {
      var img = /^image\//.test(d.type);
      return '<div class="doc-row"><span class="sq-ico ' + (img ? 'b' : 'n') + '">' + ic(img ? 'camera' : 'ticket') + '</span>' +
        '<button type="button" class="doc-n" data-docopen="' + esc(d.id) + '"><b>' + esc(d.name) + '</b><small>' + kb(d.size) + ' · ' + esc(C.dateLabel(C.parseISO(new Date(d.at).toISOString().slice(0, 10)))) + '</small></button>' +
        '<button type="button" class="bud-del" data-docdel="' + esc(d.id) + '" aria-label="' + L('docDel') + '">' + ic('x') + '</button></div>';
    }).join('');
    return '<div class="card rv" id="docsBox"><div class="eyebrow">' + L('docsT') + '</div><p class="wx-note" style="margin-top:0">' + L('docsNote') + '</p>' +
      '<div class="btn-row js-only"><label class="btn navy sq">' + ic('plus') + L('docAdd') + '<input type="file" accept="application/pdf,image/*" multiple data-docadd hidden></label></div>' +
      (rows ? '<div class="doc-list">' + rows + '</div>' : '<p class="wx-note">' + L('docsEmpty') + '</p>') + '</div>';
  }
  // copia de seguridad, viaje al calendario y mapas sin conexión
  function dataTools() {
    var maps = T.days.map(function (d, i) {
      var r = d.ref || {}; if (r.lat == null) return '';
      return '<a class="btn ghost sq" href="https://www.google.com/maps/@?api=1&map_action=map&center=' + r.lat + ',' + r.lon + '&zoom=9" target="_blank" rel="noopener">' + ic('map') + L('day') + ' ' + (i + 1) + '</a>';
    }).join('');
    return '<div class="card rv"><div class="eyebrow">' + L('bkT') + '</div><p class="wx-note" style="margin-top:0">' + L('bkNote') + '</p>' +
        '<div class="btn-row js-only"><button type="button" class="btn navy sq" data-bkexp>' + ic('doc') + L('bkExp') + '</button>' +
        '<label class="btn ghost sq">' + ic('refresh') + L('bkImp') + '<input type="file" accept="application/json,.json" data-bkimp hidden></label></div></div>' +
      '<div class="card rv"><div class="eyebrow">' + L('calT') + '</div><p class="wx-note" style="margin-top:0">' + L('calNote') + '</p>' +
        '<div class="btn-row js-only"><button type="button" class="btn navy sq" data-icsall>' + ic('calendar') + L('calBtn') + '</button></div></div>' +
      '<div class="card rv"><div class="eyebrow">' + L('omT') + '</div><p class="wx-note" style="margin-top:0">' + L((window.TRIP_META || {}).generated ? 'omNoteGen' : 'omNote') + '</p>' +
        '<div class="btn-row om-days">' + maps + '</div></div>';
  }
  // gasolina: precios por zona y lo que llevas gastado en repostajes
  function fuelLog() {
    var ls = BUD.list.filter(function (x) { return x.c === 'fuel'; }), tot = ls.reduce(function (a, x) { return a + x.a; }, 0);
    return '<div class="card rv"><div class="eyebrow">' + L('fuLogT') + '</div><div class="bud-big one"><div><small>' + L('bTotal') + '</small><b>' + money(tot) + '</b><span>' + L('fuLogN', ls.length) + '</span></div></div>' +
      '<div class="btn-row js-only"><button type="button" class="btn navy sq" data-sheet="bnew:fuel">' + ic('fuel') + L('bAddFuel') + '</button></div>' +
      (ls.length ? '' : '<p class="wx-note">' + L('fuLogEmpty') + '</p>') + '</div>';
  }
  function prepGroups(parts) {
    return GRP.map(function (g) {
      return '<section class="grp" id="grp-' + g[0] + '"><div class="grp-h js-only"><button type="button" class="grp-back sq" data-grpback>' + ic('chev') + L('tabPrep') + '</button></div>' +
        '<div class="grp-title"><span class="sq-ico hub-i ' + g[3] + '">' + ic(g[1]) + '</span><h2>' + L(g[2]) + '</h2></div>' + parts[g[0]] + '</section>';
    }).join('');
  }

  /* ---------- Añadir una sugerencia al timeline ---------- */
  // huecos libres de al menos «dur» minutos entre «from» y «to» (no mueven nada)
  function gapsOf(p, dur, from, to) {
    var out = [];
    p.ev.forEach(function (e) {
      if (e.skip || e.it.hidden || !e.gap) return;
      var at = Math.max(e.start - e.gap, from);
      if (e.start - at >= dur + 5 && at + dur <= to) out.push({ e: e, at: at, len: e.start - at });
    });
    return out;
  }
  var ADD_DUR = { eat: 60, pub: 60, shop: 30 };
  // opciones para un día: huecos, comidas/noches que se pueden cambiar y, si no hay huecos, cualquier otra actividad
  function addOptions(p, di, id, kind, dur0) {
    var dur = dur0 || ADD_DUR[kind] || 30, gaps = gapsOf(p, dur, kind === 'shop' ? 600 : 480, kind === 'shop' ? 1050 : 1410);
    var live = p.ev.filter(function (e) { return !e.skip && !e.it.hidden && !e.it.hole && e.it.t !== 'drive' && !e.it.sun; });
    var holesP = p.ev.filter(function (e) { return !e.skip && e.it.hole; });
    var meals = live.filter(function (e) { return e.it.t === 'food' && (!e.it.extra || e.it.rep); });
    var nights = live.filter(function (e) { return e.it.t === 'night' && (!e.it.extra || e.it.rep); });
    var others = live.filter(function (e) { var t = e.it.t; return t !== 'hotel' && t !== 'car' && t !== 'food' && !(e.it.extra && !e.it.rep) && meals.indexOf(e) < 0 && nights.indexOf(e) < 0; });
    function btn(cls, attr, lbl) { return '<button type="button" class="btn ' + cls + ' sq" ' + attr + '>' + lbl + '</button>'; }
    var g = holesP.map(function (e) { return btn('navy', 'data-replace="' + di + ':' + e.it.id + ':' + id + '"', ic('clock') + L('holeUse', C.fmt(e.start), C.fmt(e.end)) + ' <small>' + L('holeWas', esc(e.it.holeTi)) + '</small>'); })
      .concat(gaps.map(function (z) { return btn('navy', 'data-addg="' + di + ':' + id + ':' + z.e.it.id + '"', ic('clock') + L('gapBtn', C.fmt(z.at), C.fmt(z.e.start)) + ' <small>' + L('gapLen', C.dur(z.len)) + '</small>'); }));
    var r = [];
    if (kind === 'eat') meals.forEach(function (e) { r.push(btn('ghost', 'data-replace="' + di + ':' + e.it.id + ':' + id + '"', L('useFor', esc(e.it.ti), C.fmt(e.start)))); });
    if (kind === 'pub') nights.forEach(function (e) { r.push(btn('ghost', 'data-replace="' + di + ':' + e.it.id + ':' + id + '"', L('insteadOf', esc(e.it.ti)) + ' <small>' + C.fmt(e.start) + '</small>')); });
    var o = g.length ? [] : others.map(function (e) { return btn('ghost', 'data-replace="' + di + ':' + e.it.id + ':' + id + '"', L('insteadOf', esc(e.it.ti)) + ' <small>' + C.fmt(e.start) + '</small>'); });
    var end = kind === 'pub' || kind === 'act' ? btn('ghost', 'data-addg="' + di + ':' + id + ':END"', L('atEnd')) : '';
    return { gaps: g, repl: r, others: o, end: end, dur: dur };
  }
  // simulador del día (lo pone la interfaz): plan de un día con otro estado
  var SIM = null, SKIPS = null;
  // paradas de un recorrido (en orden, con sitio)
  function routeStops(r) { return r.ev.filter(function (e) { return !e.skip && !e.it.hidden && !e.it.hole && e.it.t !== 'drive' && e.it.lat != null; }); }
  // tramos en los que vuelves por donde has venido: 300 m o más y un giro de más de 135° respecto al último tramo
  // de 200 m o más (los pasos de menos de 50 m, como de un sitio a la puerta de al lado, no cuentan)
  function backTurns(st) {
    var cl = Math.cos(56 * Math.PI / 180), out = [], prev = null, prevKm = 0;
    for (var k = 1; k < st.length; k++) {
      var a = st[k - 1].it, b = st[k].it, v = [(b.lon - a.lon) * cl, b.lat - a.lat], len = C.km(a, b), back = false;
      if (prev && prevKm >= 0.2 && len >= 0.3) back = (v[0] * prev[0] + v[1] * prev[1]) / (Math.hypot(v[0], v[1]) * Math.hypot(prev[0], prev[1])) < -0.707;
      out.push(back);
      if (len >= 0.05) { prev = v; prevKm = len; }
    }
    return out;
  }
  // diagrama del recorrido (SVG, sin conexión)
  function routeSvg(r, day) {
    var st = routeStops(r);
    if (st.length < 2) return '';
    var mp = day.map || {}, all = st.map(function (e) { return [e.it.lat, e.it.lon]; });
    (mp.marks || []).forEach(function (m) { all.push(m.p); });
    var la0 = Math.min.apply(null, all.map(function (q) { return q[0]; })), la1 = Math.max.apply(null, all.map(function (q) { return q[0]; }));
    var lo0 = Math.min.apply(null, all.map(function (q) { return q[1]; })), lo1 = Math.max.apply(null, all.map(function (q) { return q[1]; }));
    var cosl = Math.cos((la0 + la1) / 2 * Math.PI / 180), W = 320, H = 250, pad = 24;
    var k = Math.min((W - pad * 2) / Math.max(1e-6, (lo1 - lo0) * cosl), (H - pad * 2) / Math.max(1e-6, la1 - la0));
    var ox = (W - (lo1 - lo0) * cosl * k) / 2, oy = (H - (la1 - la0) * k) / 2;
    function P(lat, lon) { return [ox + (lon - lo0) * cosl * k, oy + (la1 - lat) * k]; }
    function f1(v) { return v.toFixed(1); }
    var g = '';
    (mp.lines || []).forEach(function (ln) {
      g += '<polyline points="' + ln.pts.map(function (q) { var p = P(q[0], q[1]); return f1(p[0]) + ',' + f1(p[1]); }).join(' ') + '" class="rm-ref"/>';
      var m = P(ln.pts[Math.floor(ln.pts.length / 2)][0], ln.pts[Math.floor(ln.pts.length / 2)][1]);
      g += '<text x="' + f1(m[0]) + '" y="' + f1(m[1] - 6) + '" class="rm-rt">' + esc(ln.n) + '</text>';
    });
    (mp.marks || []).forEach(function (m) { var q = P(m.p[0], m.p[1]); g += '<text x="' + f1(q[0]) + '" y="' + f1(q[1] + 16) + '" class="rm-mk">' + esc(I18N.lang === 'en' && m.n_en ? m.n_en : m.n) + '</text>'; });
    // cada parada con su número y sin pisarse: los círculos se apartan lo justo y una línea fina los une a su sitio real
    var raw = st.map(function (e, n0) { var p = P(e.it.lat, e.it.lon), an = n0 * 2.4; return { x: p[0] + Math.cos(an) * 0.5, y: p[1] + Math.sin(an) * 0.5, rx: p[0], ry: p[1], e: e }; }), D = 19;
    for (var it0 = 0; it0 < 200; it0++) {
      raw.forEach(function (q) { q.x += (q.rx - q.x) * 0.03; q.y += (q.ry - q.y) * 0.03; });
      for (var a2 = 0; a2 < raw.length; a2++) for (var b2 = a2 + 1; b2 < raw.length; b2++) {
        var qa = raw[a2], qb = raw[b2], ddx = qb.x - qa.x, ddy = qb.y - qa.y, dd = Math.hypot(ddx, ddy) || 0.01;
        if (dd < D) { var push = (D - dd) / 2 / dd; qa.x -= ddx * push; qa.y -= ddy * push; qb.x += ddx * push; qb.y += ddy * push; }
      }
      raw.forEach(function (q) { q.x = Math.max(10, Math.min(W - 10, q.x)); q.y = Math.max(10, Math.min(H - 10, q.y)); });
    }
    var reals = [];
    raw.forEach(function (q) {
      if (Math.hypot(q.x - q.rx, q.y - q.ry) < 6) return;
      g += '<line x1="' + f1(q.rx) + '" y1="' + f1(q.ry) + '" x2="' + f1(q.x) + '" y2="' + f1(q.y) + '" class="rm-lead"/>';
      if (!reals.some(function (z) { return Math.hypot(z[0] - q.rx, z[1] - q.ry) < 3; })) reals.push([q.rx, q.ry]);
    });
    reals.forEach(function (z) { g += '<circle cx="' + f1(z[0]) + '" cy="' + f1(z[1]) + '" r="2.4" class="rm-real"/>'; });
    var bk = backTurns(st), nb = bk.filter(Boolean).length;
    for (var s0 = 1; s0 < raw.length; s0++) {
      var A = raw[s0 - 1], B = raw[s0], dx = B.x - A.x, dy = B.y - A.y, L0 = Math.hypot(dx, dy);
      if (L0 < 2) continue;
      var nx = -dy / L0, ny = dx / L0, bend = Math.min(24, L0 * 0.2), cx = (A.x + B.x) / 2 + nx * bend, cy = (A.y + B.y) / 2 + ny * bend, cls = bk[s0 - 1] ? 'back' : 'fwd';
      g += '<path d="M' + f1(A.x) + ',' + f1(A.y) + ' Q' + f1(cx) + ',' + f1(cy) + ' ' + f1(B.x) + ',' + f1(B.y) + '" class="rm-leg ' + cls + '"/>';
      var t = 0.55, mx = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * cx + t * t * B.x, my = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * cy + t * t * B.y;
      var tx = 2 * (1 - t) * (cx - A.x) + 2 * t * (B.x - cx), ty = 2 * (1 - t) * (cy - A.y) + 2 * t * (B.y - cy);
      if (L0 > 14) g += '<path d="M-4,-3.2 L4,0 L-4,3.2 Z" transform="translate(' + f1(mx) + ',' + f1(my) + ') rotate(' + (Math.atan2(ty, tx) * 180 / Math.PI).toFixed(0) + ')" class="rm-arr ' + cls + '"/>';
    }
    raw.forEach(function (q, n0) {
      var fx = q.e.it.sun || (q.e.it.at && q.e.it.t !== 'food');
      g += '<g class="rm-pt' + (fx ? ' fx' : '') + '"><circle cx="' + f1(q.x) + '" cy="' + f1(q.y) + '" r="8.2"/><text x="' + f1(q.x) + '" y="' + f1(q.y + 3.2) + '">' + (n0 + 1) + '</text></g>';
    });
    return '<svg class="rmap" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + L('mapAria') + '">' + g + '</svg>' +
      '<div class="rm-leg-k"><span><i class="fwd"></i>' + L('mapFwd') + '</span>' + (nb ? '<span><i class="back"></i>' + L('mapBack', nb) + '</span>' : '') + '<span><i class="fxk"></i>' + L('mapFixed') + '</span>' + (reals.length ? '<span><i class="real"></i>' + L('mapSame') + '</span>' : '') + '</div>';
  }
  // aplica una ruta sugerida a una copia del estado (para la vista previa y para aplicarla de verdad)
  function presetState(di, pid, custom, skipped) {
    var d = T.days[di], cu = JSON.parse(JSON.stringify(custom || {})), sk = JSON.parse(JSON.stringify(skipped || {}));
    ['swaps', 'extras', 'order', 'sunPos', 'prefAt', 'gaps', 'hotels', 'free', 'preset', 'durs'].forEach(function (k) { cu[k] = cu[k] || {}; });
    (cu.extras[d.id] || []).forEach(function (x) { if (x.rep) delete sk[x.before]; });
    Object.keys(cu.gaps[d.id] || {}).forEach(function (id) { delete sk[id]; });
    ['gaps', 'sunPos', 'prefAt', 'extras', 'order', 'free', 'durs'].forEach(function (k) { delete cu[k][d.id]; });
    d.items.forEach(function (it) { delete cu.swaps[it.id]; delete sk[it.id]; });
    var pr = (d.routes || []).filter(function (r) { return r.id === pid; })[0];
    if (pr) {
      cu.order[d.id] = pr.order.slice(); (pr.skip || []).forEach(function (id) { sk[id] = 1; });
      cu.free[d.id] = {}; (pr.free || []).forEach(function (id) { cu.free[d.id][id] = 1; });
      cu.extras[d.id] = (pr.add || []).map(function (a0) { return { id: a0.id, before: a0.before, uid: a0.uid }; });
      if (pr.durs) cu.durs[d.id] = JSON.parse(JSON.stringify(pr.durs));
      Object.keys(pr.swaps || {}).forEach(function (id) { cu.swaps[id] = pr.swaps[id]; });
    }
    cu.preset[d.id] = pr ? pid : 'guia';
    return { cu: cu, sk: sk };
  }
  function ttMin(x, y) {
    if (!x || !y || x.lat == null || y.lat == null) return 0;
    var w = C.travel(x, y, 'walk'); if (w && w.min <= 12) return w.min;
    var c = C.travel(x, y, 'car'); if (c) return c.min + 5;
    var k = C.km(x, y) * 1.35; return k < 1 ? k / 4.5 * 60 : k / 55 * 60 + 5;
  }
  // prueba a poner «rec» en el día di: dónde queda, cuánto se mueve lo demás y si mueve algo con hora fija
  function trialAdd(p, di, custom, rec) {
    if (!SIM) return null;
    var cu = JSON.parse(JSON.stringify(custom || {})), dId = T.days[di].id;
    ['swaps', 'extras', 'order', 'sunPos', 'prefAt', 'gaps', 'hotels', 'free', 'preset', 'durs'].forEach(function (k) { cu[k] = cu[k] || {}; });
    cu.extras[dId] = (cu.extras[dId] || []).filter(function (x) { return !(rec.rep && x.rep && x.before === rec.before); });
    cu.extras[dId].push(rec);
    if (rec.rep && cu.gaps[dId]) delete cu.gaps[dId][rec.before];
    var r = SIM(di, cu), ne = null, before = {}, moved = 0, fixed = null;
    r.ev.forEach(function (e) { if (e.it.id === rec.uid) ne = e; });
    p.ev.forEach(function (e) { if (!e.skip && e.it.t !== 'drive') before[e.it.id] = e.start; });
    r.ev.forEach(function (e) {
      if (e.skip || e.it.t === 'drive' || before[e.it.id] == null) return;
      var dd = e.start - before[e.it.id]; if (dd > moved) moved = dd;
      if (dd > 2 && !fixed && (e.it.at || e.it.sun)) fixed = e;
    });
    var bad = ne ? (ne.warn || []).filter(function (w) { return w.k !== 'late'; }) : [];
    if (ne && !ne.skip && r.sun && ne.start >= r.sun.dusk) { var tgn = tagsOf(ne.it); if (tgn.indexOf('night') < 0 && tgn.indexOf('rain') < 0 && ne.it.t !== 'food' && ne.it.t !== 'night' && !bad.some(function (w) { return w.k === 'dark'; })) bad.push({ k: 'dark', t: L('darkAt', C.fmt(ne.start)) }); }
    return { ev: ne, moved: moved, fixed: fixed, bad: bad, last: r.last };
  }
  // dónde poner una actividad: huecos donde cabe contando el trayecto, a la hora que elijas, en lugar de otra o al final
  function addActHTML(p, di, o, custom) {
    var dur = o.d || 60, evs = p.ev;
    // minutos de un sitio a otro: a pie si está al lado, si no en coche (+5 aparcar); estimado si no está en la tabla
    function tt(x, y) {
      if (!x || !y || x.lat == null || y.lat == null) return 0;
      var w = C.travel(x, y, 'walk'); if (w && w.min <= 12) return w.min;
      var c = C.travel(x, y, 'car'); if (c) return c.min + 5;
      var k = C.km(x, y) * 1.35; return k < 1 ? k / 4.5 * 60 : k / 55 * 60 + 5;
    }
    function okStop(z) { return !z.skip && !z.it.hidden && !z.it.hole && z.it.t !== 'drive' && z.it.lat != null; }
    function stopBefore(k) { for (var q = k - 1; q >= 0; q--) if (okStop(evs[q])) return evs[q].it; return null; }
    function stopFrom(k) { for (var q = k; q < evs.length; q++) if (okStop(evs[q])) return evs[q].it; return null; }
    function btn(cls, attr, lbl) { return '<button type="button" class="btn ' + cls + ' sq" ' + attr + '>' + lbl + '</button>'; }
    function r5(m) { return Math.max(0, Math.round(m / 5) * 5); }
    var fit = [];
    evs.forEach(function (e, k) {
      if (e.skip || e.it.hidden) return;
      var pv = stopBefore(k);
      if (e.it.hole) {          // hueco que dejaste: se pone ahí; si es más larga, lo siguiente se mueve (y se dice qué)
        var th = trialAdd(p, di, custom, { id: o.id, before: e.it.id, uid: '_t', rep: 1 }), nx = stopFrom(k + 1);
        var sh = th ? r5(th.moved) : r5(tt(pv, o) + dur + tt(o, nx) - (tt(pv, e.it) + e.it.d + tt(e.it, nx)));
        var info = th && th.fixed ? L('movesX', esc(th.fixed.it.ti), C.fmt(th.fixed.start)) : sh > 5 ? L('shiftX', C.dur(sh)) : L('holeWas', esc(e.it.holeTi));
        if (th && th.bad.length) info += ' · ' + esc(th.bad[0].t);
        fit.push(btn(th && (th.fixed || th.bad.length) ? 'ghost warnb' : 'navy', 'data-replace="' + di + ':' + e.it.id + ':' + o.id + '"', ic('clock') + L('holeUse', C.fmt(e.start), C.fmt(e.end)) + ' <small>' + info + '</small>'));
        return;
      }
      if (!(e.gap >= 15) || e.start - e.gap < 420) return;   // tiempo muerto antes de algo con hora
      var nx2 = stopFrom(k), extra = tt(pv, o) + tt(o, nx2) - tt(pv, nx2);
      if (SIM) {   // cabe si, puesta ahí, no se mueve nada, no queda de noche ni cerrada
        var tg = trialAdd(p, di, custom, { id: o.id, before: e.it.id, uid: '_t', lat: pv && pv.lat, lon: pv && pv.lon });
        if (tg && tg.ev && !tg.ev.skip && tg.moved <= 2 && !tg.bad.length) fit.push(btn('navy', 'data-addg="' + di + ':' + o.id + ':' + e.it.id + '"', ic('clock') + L('gapBtn', C.fmt(tg.ev.start), C.fmt(tg.ev.end)) +
          ' <small>' + L('gapLen', C.dur(e.gap)) + (extra >= 5 ? ' · ' + L('tripX', C.dur(r5(extra))) : '') + '</small>'));
        return;
      }
      if (dur + extra <= e.gap) fit.push(btn('navy', 'data-addg="' + di + ':' + o.id + ':' + e.it.id + '"', ic('clock') + L('gapBtn', C.fmt(e.start - e.gap), C.fmt(e.start)) +
        ' <small>' + L('gapLen', C.dur(e.gap)) + (extra >= 5 ? ' · ' + L('tripX', C.dur(r5(extra))) : '') + '</small>'));
    });
    // a la hora que elijas: por defecto, al terminar la parada más cercana
    var near = null, nk = 1e9;
    evs.forEach(function (e) { if (okStop(e) && o.lat != null) { var q = C.km(e.it, o); if (q < nk) { nk = q; near = e; } } });
    var t0 = near ? Math.round((near.end + tt(near.it, o)) / 5) * 5 : 600;
    var hv = ('0' + Math.floor(t0 / 60) % 24).slice(-2) + ':' + ('0' + t0 % 60).slice(-2);
    var live = evs.filter(function (e) { return !e.skip && !e.it.hidden && !e.it.hole && e.it.t !== 'drive' && e.it.t !== 'hotel' && e.it.t !== 'car'; })
      .map(function (e) { return { e: e, km: o.lat != null && e.it.lat != null ? C.km(e.it, o) : 999 }; }).sort(function (x, y) { return x.km - y.km; }).slice(0, 8);
    var h = '<div class="add-h">' + L('gapsTitle') + '</div>' + (fit.length ? '<div class="add-col">' + fit.join('') + '</div>' : '<p class="add-none">' + L('noFit', C.dur(dur)) + '</p>');
    h += '<div class="add-h">' + L('atTime') + '</div><div class="add-time"><input type="time" data-addtime value="' + hv + '" step="300" aria-label="' + L('atTime') + '">' +
      btn('navy', 'data-addat="' + di + ':' + o.id + '"', ic('clock') + L('atTimeBtn')) + '</div><p class="add-warn">' + ic('alert') + L('atTimeWarn') + '</p>';
    if (live.length) h += '<div class="add-h">' + L('replaceTitle') + '</div><div class="add-col">' + live.map(function (z) {
      return btn('ghost', 'data-replace="' + di + ':' + z.e.it.id + ':' + o.id + '"', L('insteadOf', esc(z.e.it.ti)) + ' <small>' + C.fmt(z.e.start) + '</small>'); }).join('') + '</div>';
    var endB = 'END';
    for (var q2 = evs.length - 1; q2 >= 0; q2--) { var z2 = evs[q2]; if (z2.skip || z2.it.hidden || z2.it.t === 'drive') continue; if (z2.it.t === 'hotel' || z2.it.t === 'car' || (z2.it.at && !z2.it.sun && z2.it.t !== 'food')) endB = z2.it.id; else break; }
    var te = trialAdd(p, di, custom, { id: o.id, before: endB, uid: '_t' });
    if (!te || (te.ev && te.ev.end <= 1440)) {
      var einfo = te && te.ev ? C.fmt(te.ev.start) + '–' + C.fmt(te.ev.end) + (te.fixed ? ' · ' + L('movesX', esc(te.fixed.it.ti), C.fmt(te.fixed.start)) : '') + (te.bad.length ? ' · ' + esc(te.bad[0].t) : '') : '';
      h += '<div class="add-col" style="margin-top:12px">' + btn(te && (te.fixed || te.bad.length) ? 'ghost warnb' : 'ghost', 'data-addg="' + di + ':' + o.id + ':' + endB + '"', ic('next') + L('atEnd') + (einfo ? ' <small>' + einfo + '</small>' : '')) + '</div>';
    }
    return '<div class="sh-sec add-sec">' + h + '<p class="add-note">' + L('addNote') + '</p></div>';
  }
  function addBlockHTML(x, kind) {
    var h = '';
    h += '<div class="add-h">' + L('gapsTitle') + '</div>' + (x.gaps.length ? '<div class="add-col">' + x.gaps.join('') + '</div>' : '<p class="add-none">' + L('noGaps', C.dur(x.dur)) + '</p>');
    if (x.repl.length) h += '<div class="add-h">' + L(kind === 'eat' ? 'asMeal' : 'asNight') + '</div><div class="add-col">' + x.repl.join('') + '</div>';
    if (x.others.length) h += '<div class="add-h">' + L('replaceTitle') + '</div><div class="add-col">' + x.others.join('') + '</div>';
    if (x.end) h += '<div class="add-col" style="margin-top:8px">' + x.end + '</div>';
    return h;
  }
  function addPlan(plans, custom, di, id, kind) {
    var dId = T.days[di].id, ex = ((custom || {}).extras || {})[dId] || [], have = ex.filter(function (x) { return x.id === id; })[0];
    var head = '<div class="sh-sec add-sec js-only"><div class="k">' + ic('next') + L('addTitle') + ' · ' + L('day') + ' ' + (di + 1) + '</div>';
    if (have) return head + '<div class="add-row"><span class="chip ok">' + ic('check') + L('inPlan') + '</span>' +
      '<button type="button" class="btn ghost sq" data-goto="' + (di + 1) + ':' + have.uid + '">' + ic('next') + L('seeIt') + '</button>' +
      '<button type="button" class="btn ghost sq" data-delx="' + di + ':' + have.uid + '">' + ic('x') + L('removeExtra') + '</button></div></div>';
    return head + addBlockHTML(addOptions(plans[di], di, id, kind), kind) + '<p class="add-note">' + L('addNote') + '</p></div>';
  }
  function souvAdd(plans, custom, k) {
    var id = 's-' + k, out = '<div class="sh-sec add-sec js-only"><div class="k">' + ic('next') + L('addTitle') + '</div>';
    plans.forEach(function (p, di) {
      var dId = T.days[di].id, have = (((custom || {}).extras || {})[dId] || []).filter(function (x) { return x.id === id; })[0];
      out += '<div class="add-day"><div class="add-dh">' + L('day') + ' ' + (di + 1) + ' · ' + esc(p.day.title) + '</div>';
      if (have) out += '<div class="add-row"><span class="chip ok">' + ic('check') + L('inPlan') + '</span><button type="button" class="btn ghost sq" data-goto="' + (di + 1) + ':' + have.uid + '">' + L('seeIt') + '</button>' +
        '<button type="button" class="btn ghost sq" data-delx="' + di + ':' + have.uid + '">' + ic('x') + L('removeExtra') + '</button></div>';
      else {
        var x = addOptions(p, di, id, 'shop');
        out += x.gaps.length ? '<div class="add-col">' + x.gaps.join('') + '</div>'
          : '<details class="add-more"><summary>' + L('noGapsShort') + ' · ' + L('replaceTitle') + ic('chev') + '</summary><div class="add-col">' + x.others.join('') + '</div></details>';
      }
      out += '</div>';
    });
    return out + '<p class="add-note">' + L('addNote') + '</p></div>';
  }

  /* ---------- Hojas de detalle ---------- */
  function shPhoto(ph) { return ph ? '<div class="sh-ph ph ph-' + ph + '"></div>' : ''; }
  // clave para comparar títulos: sin mayúsculas, acentos, apóstrofos curvos ni «Visita a…»
  function tkey(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u2018\u2019`\u00b4]/g, "'").replace(/^visita (a |al )?/, '').replace(/\s+/g, ' ').trim(); }
  // ¿ya está en el plan (cualquier día)? por id, por título o por estar en el mismo sitio con un título parecido
  // sitio aproximado de un restaurante de la guía (no traen coordenadas): por su zona, buscando un sitio del viaje con ese nombre
  function gLoc(g, day) {
    var pl = tkey(g.pl || ''), parts = [pl].concat(pl.split(',').map(function (x) { return x.trim(); }).reverse()), hit = null;
    var all = []; T.days.forEach(function (d) { d.items.concat(d.extras || []).forEach(function (it) { all.push(it); (it.alts || []).forEach(function (x) { all.push(x); }); }); });
    parts.some(function (q) { if (!q) return false; all.some(function (it) { if (it.lat != null && it.pl && tkey(it.pl) === q) { hit = it; return true; } return false; }); return !!hit; });
    if (hit) return { lat: hit.lat, lon: hit.lon, ti: g.n };
    return day && day.ref ? { lat: day.ref.lat, lon: day.ref.lon, ti: g.n, approx: 1 } : null;
  }
  var GENW = /^(castillo|castle|comida|cena|desayuno|almuerzo|paseo|visita|mirador|ruta|bocadillo|cata|whisky|musica|pinta|copa|antes|hotel|street|calle|lunch|dinner|breakfast|the|del|las|los|con|por|desde|hacia|inn|bar|pub|loch|lago|glen|fort|check|edimburgo|edinburgh|inverness|glasgow|william|centro|noche|atardecer|tour)$/;
  function toks(t) { return tkey(t).replace(/\([^)]*\)/g, ' ').split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 3 && !GENW.test(w) && !/^(and|for|san|new|old|tea|sea|top)$/.test(w); }); }
  function sameThing(a, b) {
    if (a.lat != null && b.lat != null && C.km(a, b) > 1.2) return false;
    var ta = toks(a.ti); if (!ta.length) return false;
    var tb = toks(b.ti); return ta.some(function (w) { return tb.indexOf(w) >= 0; });
  }
  function inPlanTest(plans, dayIx) {
    var ids = {}, keys = {}, its = [];
    plans.forEach(function (pp, pi) { pp.ev.forEach(function (e) {
      if ((e.skip && pi !== dayIx) || e.it.hidden || e.it.t === 'drive' || e.it.hole) return;   // del mismo día, también lo quitado
      ids[e.it.id] = 1; if (e.it.extra) ids[e.it.extra] = 1; if (e.it.altId) ids[e.it.altId] = 1; keys[tkey(e.it.ti)] = 1; its.push(e.it);
    }); });
    return function (o) {
      var k = tkey(o.ti); if (ids[o.id] || keys[k]) return true;
      if (o.lat == null) return false;
      return its.some(function (x) { if (x.lat == null || C.km(o, x) > 0.08) return false; var kx = tkey(x.ti); return kx.indexOf(k) >= 0 || k.indexOf(kx) >= 0; });
    };
  }
  // cómo llegar desde «a»: a pie (si es 1 h o menos), en coche y enlace a transporte público en Google Maps
  function reach(a, o, named) {
    if (!a || !o || a.lat == null || o.lat == null) return '';
    var c = C.travel(a, o, 'car'), w = C.travel(a, o, 'walk'), est = !c, k0, out = [];
    if (est) { k0 = C.km(a, o); c = { min: k0 * 1.35 / 55 * 60, km: k0 * 1.35 }; w = { min: k0 * 1.3 / 4.5 * 60, km: k0 * 1.3 }; }
    var ap = est ? '≈ ' : '';
    if (w && w.min < 2.5) out.push('<span>' + ic('pin') + L('rchHere') + '</span>');
    else {
      if (w && w.min <= 60) out.push('<span>' + ic('walk') + ap + C.dur(w.min < 10 ? Math.max(1, Math.round(w.min)) : Math.round(w.min / 5) * 5) + '</span>');
      if (c && c.km >= 0.8) out.push('<span>' + ic('car') + ap + C.dur(Math.max(5, Math.round((c.min + 5) / 5) * 5)) + ' · ' + C.kmTxt(c.km) + ' km</span>');
    }
    out.push('<a href="https://www.google.com/maps/dir/?api=1&amp;origin=' + a.lat + ',' + a.lon + '&amp;destination=' + o.lat + ',' + o.lon + '&amp;travelmode=transit" target="_blank" rel="noopener">' + ic('train') + L('rchBus') + '</a>');
    return '<div class="rch">' + (named ? '<em>' + L('rchFromX', esc(a.ti)) + '</em>' : '') + out.join('') + '</div>';
  }
  // filtros por etiqueta (varios a la vez: se ven las filas que tienen todas) + la lista; «pre» = filtro activo al abrir
  var AF = [['rain', 'rain', 'rainMore'], ['night', 'moon', 'fNight'], ['morning', 'sunrise', 'fMorning'], ['sunset', 'sunset', 'fSunset'], ['quick', 'clock', 'fQuick'], ['booking', 'ticket', 'fBooking'], ['photo', 'camera', 'fPhoto'], ['film', 'film', 'fFilm'], ['museum', 'castle', 'tgMuseum'], ['palace', 'castle', 'tgPalace'], ['sacred', 'castle', 'tgSacred'], ['ruins', 'castle', 'tgRuins'], ['city', 'pin', 'tgCity'], ['park', 'mountain', 'tgPark']];
  function fList(rows, pre) {
    var cnt = {}; rows.forEach(function (r) { r.tags.forEach(function (k) { cnt[k] = (cnt[k] || 0) + 1; }); });
    if (pre && !cnt[pre]) pre = '';
    var vis = rows.filter(function (r) { return !pre || r.tags.indexOf(pre) >= 0; }).length;
    if (!rows.length) return { bar: '', list: '<p class="sh-lead">' + L('noExtras') + '</p>' };
    var bar = '<div class="af-row" role="group" aria-label="' + L('filter') + '">' + AF.filter(function (f) { return cnt[f[0]]; }).map(function (f) {
      var on = f[0] === pre;
      return '<button type="button" class="gf af sq af-' + TAGS[f[0]][2] + (on ? ' on' : '') + '" data-afilter="' + f[0] + '" aria-pressed="' + on + '">' + ic(f[1]) + L(f[2]) + ' <i>' + cnt[f[0]] + '</i></button>';
    }).join('') + '</div><div class="af-count">' + (pre ? L('afCount', vis, rows.length) : '') + '</div>';
    var list = '<div class="alt-list">' + rows.map(function (r, k) {
      return '<div class="alt-it' + (pre && r.tags.indexOf(pre) < 0 ? ' hid' : '') + '" data-k="' + k + '" data-tags="' + r.tags.join(' ') + '">' + r.html + '</div>'; }).join('') + '</div>' +
      '<div class="af-empty"' + (vis ? ' style="display:none"' : '') + '><p class="sh-lead">' + L('afNone') + '</p><button type="button" class="btn ghost sq" data-afclear>' + ic('x') + L('afClear') + '</button></div>';
    return { bar: bar, list: list };
  }
  function optRow(o, sub, right, extra) {
    return '<div class="opt-row">' + (o.ph ? '<div class="opt-ph ph ph-' + o.ph + '"></div>' : '<div class="opt-ph noph">' + ic(tyIcon(o.t)) + '</div>') +
      '<div class="opt-t"><small>' + sub + '</small><b>' + esc(o.ti) + '</b>' + (tagsOf(o).length ? '<div class="opt-tags">' + tagChips(o, 3) + '</div>' : '') + (extra || '') + (o.lead ? '<p>' + esc(o.lead) + '</p>' : '') + filmHTML(o, true) + shotHTML(o, true) + '</div>' +
      '<div class="opt-btns">' + right + mapLink(o) + '</div></div>';
  }
  function sheet(kind, a, b, plans, custom, c, d0) {
    var html = '';
    if (kind === 'edit') {
      var pe = plans[+a], de0 = pe.day, addedE = (((custom || {}).extras || {})[de0.id] || []).map(function (x) { return x.id; });
      var rows = pe.ev.filter(function (e) { return e.it.t !== 'drive' && !e.it.hidden; }).map(function (e) {
        var it = e.it, anchor = !!(it.at && !it.sun && !it.soft && it.t !== 'food'), fixed = !!it.sun || anchor, sub0 = e.skip ? L('dropped') : C.fmt(e.start) + '–' + C.fmt(e.end) + ' · ' + C.dur(it.d);
        if (it.sun) sub0 += ' · ' + L('bySunset'); else if (it.at && it.t !== 'food') sub0 += ' · ' + L('fixedAt', it.at);
        return '<div class="ed-row' + (e.skip ? ' off' : '') + (fixed ? ' fixed' : '') + '" data-id="' + it.id + '">' +
          '<span class="ed-h"' + (fixed ? '' : ' data-edh') + '>' + ic(it.sun ? 'sunset' : anchor ? 'lock' : 'grip') + '</span><span class="sq-ico ' + (it.t === 'food' ? 'o' : 'g') + '">' + ic(tyIcon(it.t)) + '</span>' +
          '<div class="ed-t"><b>' + esc(it.ti) + '</b><small>' + sub0 + '</small></div>' +
          (it.rep ? '<button type="button" class="ed-b" data-alts="' + a + ':' + it.repOf + '" aria-label="' + L('swap') + '">' + ic('refresh') + '</button><button type="button" class="ed-b" data-delx="' + a + ':' + it.id + '" aria-label="' + L('remove') + '">' + ic('x') + '</button>'
          : it.extra ? '<button type="button" class="ed-b" data-delx="' + a + ':' + it.id + '" aria-label="' + L('removeExtra') + '">' + ic('x') + '</button>'
            : '<button type="button" class="ed-b" data-alts="' + a + ':' + it.id + '" aria-label="' + L('swap') + '">' + ic('refresh') + '</button><button type="button" class="ed-b" data-skip="' + it.id + '" aria-label="' + (e.skip ? L('addBack') : L('remove')) + '">' + ic(e.skip ? 'undo' : 'x') + '</button>') + '</div>';
      }).join('');
      var addList = (de0.extras || []).filter(function (x) { return addedE.indexOf(x.id) < 0; }).map(function (o) {
        return optRow(o, esc(o.pl) + ' · ' + C.dur(o.d), '<button type="button" class="btn navy sq" data-addx="' + a + ':' + o.id + ':END">+ ' + L('add') + '</button>'); }).join('');
      return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + ' · ' + esc(C.dateLabel(pe.ms)) + '</div><h2>' + L('editTitle') + '</h2>' +
        '<button type="button" class="btn sq ed-add" data-sheet="addday:' + a + '">' + ic('plus') + L('addAct') + '</button><p class="wx-note">' + L('editHint') + '</p>' +
        '<div class="ed-list" data-ed="' + a + '">' + rows + '</div>' +
        '<div class="btn-row"><button type="button" class="btn ghost sq" data-resetday="' + a + '">' + ic('undo') + resetLbl(de0, custom, L('resetDay')) + '</button></div></div>';
    }
    if (kind === 'fuel') {
      var FA = T.fuel && T.fuel.areas[+a]; if (!FA) return '';
      var Fm = T.fuel;
      return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (T.days.map(function (d) { return d.id; }).indexOf(FA.day) + 1) + ' · ' + L('fuTitle') + '</div><h2>' + esc(areaName(FA)) + '</h2>' +
        '<div class="fu-l">' + FA.st.slice().sort(function (x, y) { return (x.e10 || 9) - (y.e10 || 9); }).map(function (st) {
          return '<a class="fu-s sq" href="https://www.google.com/maps/dir/?api=1&destination=' + st.lat + ',' + st.lon + '&travelmode=driving" target="_blank" rel="noopener"><div><b>' + esc(st.b) + '</b><small>' + esc(st.a) + (st.pc ? ' · ' + esc(st.pc) : '') + ' · ' + st.d + ' km</small></div>' +
            '<div class="fu-p"><span>' + L('fuPetrol') + ' <b>' + p3(st.e10) + '</b></span><span>' + L('fuDiesel') + ' <b>' + p3(st.b7) + '</b></span></div></a>';
        }).join('') +
        '<a class="lk sq" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('petrol station near ' + FA.lat + ',' + FA.lon) + '" target="_blank" rel="noopener"><div><b>' + L('fuSearch') + '</b><small>' + L('fuToday') + '</small></div>' + ic('ext') + '</a></div>' +
        '<p class="wx-note">' + L('fuNote', C.dateLabel(C.parseISO(Fm.at)), Fm.src.map(function (x) { return x.toUpperCase(); }).join(', ')) + '</p></div>';
    }
    if (kind === 'films' || kind === 'filmrt') {
      var inPlanF = {}, dayOf = {};
      plans.forEach(function (p, di) { p.ev.forEach(function (e) { if (!e.skip && !e.it.hidden) { inPlanF[e.it.extra || e.it.altId || e.it.id] = { di: di, id: e.it.id, e: e }; } }); });
      T.days.forEach(function (d, di) { d.items.concat(d.extras || []).forEach(function (o) { dayOf[o.id] = di; (o.alts || []).forEach(function (x) { dayOf[x.id] = di; }); }); });
      function filmObj(id) { var hit = null; T.days.forEach(function (d) { d.items.concat(d.extras || []).forEach(function (o) { if (!hit && o.id === id) hit = o; (o.alts || []).forEach(function (x) { if (!hit && x.id === id) hit = x; }); }); }); return hit; }
      function filmRow(o) {
        var ip = inPlanF[o.id], di = ip ? ip.di : dayOf[o.id];
        var sub = L('day') + ' ' + ((di || 0) + 1) + (ip && ip.e ? ' · ' + C.fmt(ip.e.start) : '') + (o.pl ? ' · ' + esc(o.pl) : '');
        var btn = ip ? '<button type="button" class="btn ghost sq" data-goto="' + (ip.di + 1) + ':' + ip.id + '">' + ic('next') + L('seeIt') + '</button>'
          : o.t === 'drive' ? '' : '<button type="button" class="btn navy sq" data-sheet="addto:' + (di || 0) + ':' + o.id + '">' + ic('plus') + L('add') + '</button>';
        return optRow(o, sub + (ip ? ' · ' + L('inPlan') : ''), btn);
      }
      if (kind === 'filmrt') {
        var fr = (T.filmRoutes || []).filter(function (x) { return x.id === a; })[0]; if (!fr) return '';
        var en = I18N.lang === 'en';
        return '<div class="sh-in"><div class="eyebrow o">' + ic('film') + L('tgFilm') + '</div><h2>' + esc(en && fr.ti_en ? fr.ti_en : fr.ti) + '</h2><p class="sh-lead">' + (fr.auto ? esc(en ? fr.lead_en : fr.lead) : L('hpLead')) + '</p>' +
          fr.groups.map(function (g) {
            var os = g.ids.map(filmObj).filter(Boolean), pts = os.filter(function (o) { return o.lat != null && o.t !== 'drive'; });
            var links = g.mode && pts.length > 1 ? routeLinks(pts.map(function (o) { return { it: o }; }), g.mode, false) : [];
            return '<div class="add-h">' + esc(en && g.ti_en ? g.ti_en : g.ti) + '</div>' +
              (links.length ? '<div class="add-col">' + links.map(function (u, k) { return '<a class="btn navy sq" href="' + u + '" target="_blank" rel="noopener">' + ic('route') + L('prOpen').replace(L('prTitle'), fr.auto ? esc(en ? fr.ti_en : fr.ti) : L('hpShort')) + (links.length > 1 ? ' · ' + L('rtPart', k + 1, links.length) : '') + '</a>'; }).join('') + '</div>' : '') +
              os.map(filmRow).join('');
          }).join('') + '</div>';
      }
      var fl = [];
      T.days.forEach(function (d, di) {
        if (a !== 'all' && +a !== di) return;
        d.items.concat(d.extras || []).forEach(function (o) { if (o.film) fl.push(o); (o.alts || []).forEach(function (x) { if (x.film) fl.push(x); }); });
      });
      return '<div class="sh-in"><div class="eyebrow o">' + ic('film') + L('tgFilm') + '</div><h2>' + (a === 'all' ? L('filmsAllT') : L('filmsDayT', +a + 1)) + '</h2>' +
        ((T.filmRoutes || [])[0] ? '<button type="button" class="btn sq film-hp" data-sheet="filmrt:' + T.filmRoutes[0].id + '">' + ic('route') + (T.filmRoutes[0].auto ? esc(I18N.lang === 'en' ? T.filmRoutes[0].ti_en : T.filmRoutes[0].ti) : L('hpOpen')) + '</button>' : '') + fl.map(filmRow).join('') + '</div>';
    }
    if (kind === 'routes') {
      var dR = T.days[+a], cur = ((custom || {}).preset || {})[dR.id] || 'guia', en = I18N.lang === 'en';
      var opts = [{ id: 'guia', ti: L('presetGuide'), short: L('presetGuideShort'), lead: L('presetGuideLead') }].concat((dR.routes || []).map(function (r) { return { id: r.id, ti: en && r.ti_en ? r.ti_en : r.ti, short: en && r.short_en ? r.short_en : r.short || r.ti, lead: en && r.lead_en ? r.lead_en : r.lead }; }));
      // cada ruta simulada una vez: qué imprescindibles incluye y sus cifras
      var sims = opts.map(function (o) { var ps = SIM ? presetState(+a, o.id, custom, SKIPS ? SKIPS() : {}) : null; return ps ? SIM(+a, ps.cu, ps.sk) : null; });
      var musts = dR.items.concat(dR.extras || []).filter(function (o) { return o.must; }).sort(function (x, y) { return y.must - x.must; });
      function found(r, id) { var hit = null; if (r) r.ev.forEach(function (e) { if (!hit && !e.skip && !e.it.hidden && (e.it.id === id || e.it.extra === id)) hit = e; }); return hit; }
      function countIf(r, f) { return r ? r.ev.filter(function (e) { return !e.skip && !e.it.hidden && e.it.t !== 'drive' && f(e.it); }).length : 0; }
      var cmp = '<div class="cmp"><table><thead><tr><th></th>' + opts.map(function (o) { return '<th' + (o.id === cur ? ' class="on"' : '') + '>' + esc(o.short) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        '<tr class="cmp-k"><td colspan="' + (opts.length + 1) + '">' + L('cmpMust') + '</td></tr>' +
        musts.map(function (m) {
          return '<tr><td>' + (m.must > 1 ? '<i class="cmp-m2">★</i>' : '<i class="cmp-m1">☆</i>') + esc(m.ti) + '</td>' + sims.map(function (r) { var e = found(r, m.id); return e ? '<td class="y">' + C.fmt(e.start) + '</td>' : '<td class="n">—</td>'; }).join('') + '</tr>';
        }).join('') +
        '<tr class="cmp-k"><td colspan="' + (opts.length + 1) + '">' + L('cmpNums') + '</td></tr>' +
        [[L('cmpBack'), function (r) { var nb = backTurns(routeStops(r)).filter(Boolean).length; return nb ? '<b class="warn-t">' + nb + '</b>' : '<b class="ok-t">0</b>'; }],
         [L('cmpKm'), function (r) { var km0 = r.ev.reduce(function (m0, e) { return m0 + (!e.skip && e.it.t === 'drive' && e.it.mode === 'walk' ? (e.it.km || 0) : 0); }, 0); return C.kmTxt(km0) + ' km'; }],
         [L('cmpWalk'), function (r) { return C.dur(r.ev.reduce(function (m0, e) { return m0 + (!e.skip && e.it.t === 'drive' && e.it.mode === 'walk' ? e.it.d : 0); }, 0)); }],
         [L('cmpEnd'), function (r) { return C.fmt(r.last); }],
         [L('cmpPhoto'), function (r) { return String(countIf(r, function (it) { return tagsOf(it).indexOf('photo') >= 0; })); }],
         [L('cmpHP'), function (r) { return String(countIf(r, function (it) { return /Harry Potter/.test(it.film || ''); })); }],
         [L('cmpLate'), function (r) { var n0 = r.ev.filter(function (e) { return !e.skip && (e.warn || []).some(function (w) { return w.k === 'late'; }); }).length; return n0 ? '<b class="warn-t">' + L('cmpYesN', n0) + '</b>' : '<b class="ok-t">' + L('cmpNo') + '</b>'; }]
        ].map(function (row) { return '<tr><td>' + row[0] + '</td>' + sims.map(function (r) { return '<td>' + (r ? row[1](r) : '') + '</td>'; }).join('') + '</tr>'; }).join('') +
        '</tbody></table></div>' +
        '<div class="cmp-miss">' + opts.map(function (o, k) {
          var miss = musts.filter(function (m) { return !found(sims[k], m.id); });
          var m2 = miss.filter(function (m) { return m.must > 1; }), m1 = miss.filter(function (m) { return m.must < 2; });
          return '<p><b>' + esc(o.short) + ':</b> ' + (miss.length ? (m2.length ? '<span class="warn-t">' + L('cmpMissMust', m2.map(function (m) { return esc(m.ti); }).join(', ')) + '</span> ' : '') + (m1.length ? L('cmpMissNice', m1.map(function (m) { return esc(m.ti); }).join(', ')) : '') : '<span class="ok-t">' + L('cmpAll') + '</span>') + '</p>';
        }).join('') + '</div>';
      return '<div class="sh-in rt-tabs" data-rtab="' + (c === 'cmp' ? 'cmp' : 'opt') + '"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + ' · ' + esc(dR.title) + '</div><h2>' + L('presetsT') + '</h2>' +
        '<div class="rt-seg" role="tablist"><button type="button" class="rt-sb" data-rtabbtn="opt">' + ic('route') + L('rtOpts') + '</button><button type="button" class="rt-sb" data-rtabbtn="cmp">' + ic('check') + L('cmpBtn') + '</button></div>' +
        '<div class="rt-pane rt-cmp">' + cmp + '</div><div class="rt-pane rt-opt"><p class="sh-lead">' + L('presetsLead') + '</p>' +
        opts.map(function (o, k) {
          var r = sims[k];
          var acts = r ? r.ev.filter(function (e) { return !e.skip && !e.it.hidden && e.it.t !== 'drive'; }) : [];
          var walk = r ? r.ev.reduce(function (m, e) { return m + (!e.skip && e.it.t === 'drive' && e.it.mode === 'walk' ? e.it.d : 0); }, 0) : 0;
          var lates = r ? r.ev.filter(function (e) { return !e.skip && (e.warn || []).some(function (w) { return w.k === 'late'; }); }).length : 0;
          return '<div class="pr-opt' + (o.id === cur ? ' on' : '') + '"><div class="pr-h"><b>' + esc(o.ti) + '</b>' + (o.id === cur ? '<span class="hub-pill ok">' + ic('check') + L('presetNow') + '</span>' : '') + '</div>' +
            '<p>' + esc(o.lead) + '</p>' +
            (r ? '<div class="pr-st"><span>' + ic('walk') + L('presetWalk', C.dur(walk)) + '</span><span>' + ic('clock') + L('presetEnd', C.fmt(r.last)) + '</span>' + (lates ? '<span class="warn-t">' + ic('alert') + L('presetLate', lates) + '</span>' : '<span class="ok-t">' + ic('check') + L('presetOnTime') + '</span>') + '</div>' +
              routeSvg(r, dR) +
              '<ol class="pr-seq">' + acts.filter(function (e) { return e.it.lat != null && !e.it.hole; }).map(function (e, n0) { return '<li><span class="pr-n' + (e.it.sun || (e.it.at && e.it.t !== 'food') ? ' fx' : '') + '">' + (n0 + 1) + '</span><i>' + C.fmt(e.start) + '</i>' + esc(e.it.ti) + '</li>'; }).join('') + '</ol>' +
              (function () { var lk = routeLinks(acts.filter(function (e) { return e.it.lat != null; }), 'walking', false); return lk.length ? '<div class="pr-maps">' + lk.map(function (u, n1) { return '<a class="btn ghost sq" href="' + u + '" target="_blank" rel="noopener">' + ic('map') + L('openGmaps') + (lk.length > 1 ? ' · ' + L('rtPart', n1 + 1, lk.length) : '') + '</a>'; }).join('') + '</div>' : ''; })() : '') +
            (o.id === cur ? '' : '<button type="button" class="btn navy sq" data-preset="' + a + ':' + o.id + '">' + ic('route') + L('presetApply') + '</button>') + '</div>';
        }).join('') + '</div></div>';
    }
    if (kind === 'album') {
      return '<div class="sh-in"><div class="eyebrow o">' + esc(((window.TRIP_META || {}).title || {})[I18N.lang] || ((window.TRIP_META || {}).title || {}).es || '') + '</div><h2>' + L('albT') + '</h2>' +
        '<div class="pr-seg" role="group"><button type="button" class="pr-sb sq on" data-albtab="album" aria-pressed="true">' + ic('camera') + L('albTabA') + '</button><button type="button" class="pr-sb sq" data-albtab="profile" aria-pressed="false">' + ic('check') + L('albTabP') + '</button></div>' +
        '<section data-albsec="album"><p class="sh-lead">' + L('albHint') + '</p><div id="albumBox"></div>' +
          '<div class="card" id="postBox" hidden><div class="eyebrow">Tu postal</div><img id="postImg" alt="Postal del viaje"><div class="btn-row"><button type="button" class="btn navy sq" id="postSave">Guardar o compartir</button><button type="button" class="btn ghost sq" id="postClose">Cerrar</button></div></div></section>' +
        '<section data-albsec="profile" hidden><div id="profBox"></div><div class="card"><div class="eyebrow">Copia del álbum</div><p class="wx-note" style="margin-top:0">' + L('albCopyNote') + '</p>' +
          '<div class="btn-row"><button type="button" class="btn ghost sq" id="albExp">Guardar copia</button><label class="btn ghost sq">Cargar copia<input type="file" accept="application/json,.json" id="albImp" hidden></label></div></div></section></div>';
    }
    if (kind === 'castles') {
      var cl = [];
      plans.forEach(function (p, di) { p.ev.forEach(function (e) { var it = e.it; if (!e.skip && !it.hidden && it.t === 'visit' && /Castillo|Castle/.test(it.ti)) cl.push({ e: e, di: di }); }); });
      return '<div class="sh-in"><div class="eyebrow o">' + L('castles') + '</div><h2>' + L('castlesT', cl.length) + '</h2><p class="sh-lead">' + L('castlesLead') + '</p>' +
        cl.map(function (z) {
          var it = z.e.it;
          return optRow(it, L('day') + ' ' + (z.di + 1) + ' · ' + C.fmt(z.e.start) + '–' + C.fmt(z.e.end) + (it.pl ? ' · ' + esc(it.pl) : ''),
            '<button type="button" class="btn navy sq" data-goto="' + (z.di + 1) + ':' + it.id + '">' + ic('next') + L('seeIt') + '</button>');
        }).join('') + '</div>';
    }
    if (kind === 'photort') {
      var hp = photoRouteHTML(+a); if (!hp) return '';
      return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + ' · ' + esc(T.days[+a].title) + '</div><h2>' + L('prTitle') + '</h2>' + hp + '</div>';
    }
    if (kind === 'route') {
      var pr = plans[+a]; if (!pr) return '';
      var mode = travelMode(pr), fromNow = b != null && b !== '' ? +b : null;
      var all = stopsOf(pr), left = fromNow != null ? stopsOf(pr, fromNow) : [];
      function linksHTML(links, lbl) {
        return links.map(function (u, k) { return '<a class="btn ' + (k ? 'ghost' : 'navy') + ' sq" href="' + u + '" target="_blank" rel="noopener">' + ic('route') + lbl + (links.length > 1 ? ' · ' + L('rtPart', k + 1, links.length) : '') + '</a>'; }).join('');
      }
      var recs0 = nearRecs(pr, +a);
      return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + ' · ' + esc(pr.day.title) + '</div><h2>' + L('rtTitle') + '</h2>' +
        '<div class="add-col">' + (left.length ? linksHTML(routeLinks(left, mode, true), L('rtLeft')) : '') + linksHTML(routeLinks(all, mode, false), L('rtAll')) +
        (dayTouched(pr, custom) ? '<button type="button" class="btn ghost sq" data-resetday="' + a + '">' + ic('undo') + resetLbl(pr.day, custom, L('resetOrig')) + '</button>' : '') +
        (photoRoutesOf(+a).length ? '<button type="button" class="btn ghost sq" data-sheet="photort:' + a + '">' + ic('camera') + L('prTitle') + ' · ' + L('prApart') + '</button>' : '') + '</div>' +
        '<div class="add-h">' + L('rtStops') + '</div><div class="rt-list">' + all.map(function (e, k) {
          return '<div class="rt-row"><span class="rt-n">' + (k + 1) + '</span><span class="bl-n">' + esc(e.it.ti) + '<small>' + C.fmt(e.start) + (e.it.pl ? ' · ' + esc(e.it.pl) : '') + '</small></span>' + mapLink(e.it) + '</div>'; }).join('') + '</div>' +
        (recs0.length ? '<div class="add-h">' + L('rtNear') + '</div><div class="rt-list">' + recs0.map(function (o) {
          return '<div class="rt-row"><span class="rt-n o">' + ic(tagsOf(o).indexOf('sunset') >= 0 ? 'sunset' : tagsOf(o).indexOf('rain') >= 0 ? 'rain' : 'pin') + '</span><span class="bl-n">' + esc(o.ti) + '<small>' + esc(o.pl || '') + '</small></span>' + mapLink(o) + '</div>'; }).join('') + '</div>' : '') +
        '<p class="add-note">' + L('rtNote') + (window.GUIDE_VER ? ' · ' + L('verX', window.GUIDE_VER) : '') + '</p>' +
        '<div class="btn-row"><button type="button" class="btn ghost sq" data-kml>' + ic('map') + L('rtKml') + '</button></div><p class="add-note">' + L('rtKmlHow') + '</p></div>';
    }
    if (kind === 'sunclash') {
      var pc = plans[+a];
      return (pc.clashes || []).map(function (cx) {
        var fe = null; pc.ev.forEach(function (e) { if (e.it.id === cx.id) fe = e; });
        var autoAfter = fe && fe.start >= cx.ancEnd - 1, cur = cx.pick || 'auto';
        function opt(val, lbl, note, rec) {
          var on = cur === val || (cur === 'auto' && ((val === 'after' && autoAfter) || (val === 'before' && !autoAfter))) || (cur === 'keep' && ((val === 'after' && autoAfter) || (val === 'before' && !autoAfter)));
          return '<button type="button" class="btn ' + (on ? 'navy' : 'ghost') + ' sq" data-sunpick="' + a + ':' + cx.id + ':' + val + '">' + lbl +
            ' <small>' + note + (rec ? ' · ' + L('scRec') : '') + (on ? ' · ' + L('scChosen') : '') + '</small></button>';
        }
        var bAt = Math.min(cx.ideal, C.hm(cx.ancAt) - cx.d - 5);
        return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + ' · ' + L('scEyebrow') + '</div>' +
          '<h2>' + L('scTitle', C.fmt(cx.set), esc(cx.ancTi)) + '</h2>' +
          '<p class="sh-lead">' + L('scLead', esc(cx.ancTi), esc(cx.ancAt), C.fmt(cx.ancEnd), esc(cx.ti)) + '</p>' +
          '<div class="add-col">' +
            opt('after', L('scAfter', esc(cx.ancTi), esc(cx.ti), C.fmt(cx.ancEnd)), L('scAfterNote', C.fmt(cx.dusk)), autoAfter) +
            opt('before', L('scBefore', esc(cx.ti), C.fmt(bAt)), L('scBeforeNote'), !autoAfter) +
            '<button type="button" class="btn ghost sq" data-alts="' + a + ':' + cx.id + '">' + ic('refresh') + L('scSwap', esc(cx.ti)) + '</button>' +
            '<button type="button" class="btn ghost sq" data-skip="' + cx.id + '">' + ic('x') + L('scRemove', esc(cx.ti)) + '</button>' +
          '</div>' + (cx.pick ? '' : '<div class="btn-row"><button type="button" class="btn ghost sq" data-sunpick="' + a + ':' + cx.id + ':keep">' + ic('check') + L('scKeep') + '</button></div>') +
          '<p class="add-note">' + L('scNote') + '</p></div>';
      }).join('');
    }
    if (kind === 'sunspots') {
      var ps = plans[+a], sp = sunSpots(ps, +a), sunF = null, ssLock = null;
      ps.ev.forEach(function (e) { if (!e.skip && !e.it.hidden && e.it.sun) sunF = e; if (!e.skip && e.locked && hm2(e.it.at) <= sp.set && hm2(e.it.at) + e.it.d >= sp.set) ssLock = e.it; });
      return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + '</div><h2>' + L('ssTitle', C.fmt(sp.set)) + '</h2>' +
        (sp.have ? '<p class="sh-lead">' + L('ssHave', esc(sp.have.ti)) + '</p>' : '') +
        (ssLock ? '<p class="warn-note">' + ic('lock') + L('ssClash', C.fmt(sp.set), esc(ssLock.ti)) + '</p>' : '<p class="add-note">' + L('ssLead') + '</p>') +
        (sp.list.length ? sp.list.slice(0, 10).map(function (z) {
          var o = z.o, btns = '<button type="button" class="btn navy sq" data-addg="' + a + ':' + o.id + ':END:sun">' + ic('sunset') + L('ssAdd') + '</button>';
          if (sunF && !sunF.it.extra) btns += '<button type="button" class="btn ghost sq" data-replace="' + a + ':' + sunF.it.id + ':' + o.id + '">' + L('insteadOf', esc(sunF.it.ti)) + '</button>';
          return optRow(o, esc(o.pl || '') + ' · ' + C.dur(o.d) + ' · ' + L('kmAway', z.km < 1 ? '&lt;1' : Math.round(z.km)), '<div class="opt-btns">' + btns + '</div>');
        }).join('') : '<p class="sh-lead">' + L('ssNone') + '</p>') + '</div>';
    }
    if (kind === 'bpick') {
      var have = {};
      BUD.list.forEach(function (x) { if (x.src) have[x.src] = 1; });
      return '<div class="sh-in"><div class="eyebrow o">' + L('budTrip') + '</div><h2>' + L('bPickTitle') + '</h2>' +
        '<div class="btn-row"><button type="button" class="btn navy sq" data-bpickall>' + ic('check') + L('bAll') + '</button></div>' +
        plans.map(function (pp, di) {
          var acts = pp.live.filter(function (e) { return e.it.t !== 'drive' && !e.it.hole; });
          return '<div class="eyebrow" style="margin-top:16px">' + L('day') + ' ' + (di + 1) + ' · ' + esc(pp.day.title) + '</div>' + acts.map(function (e) {
            var it = e.it, c = it.cost, est = c ? c.v : 0, cat = it.fuel ? 'fuel' : c ? c.t : (it.t === 'food' ? 'food' : 'other');
            return '<div class="bp-row"><span class="sq-ico g">' + ic(it.fuel ? 'fuel' : tyIcon(it.t)) + '</span><span class="bl-n">' + esc(it.ti) + '<small>' + C.fmt(e.start) + (c ? ' · ≈ ' + money(est) + (c.pp ? ' ' + L('budPP') : c.t === 'parking' ? ' ' + L('budCar') : '') : '') + '</small></span>' +
              (have[it.id] ? '<span class="chip ok">' + ic('check') + L('bAdded') + '</span>' : '<button type="button" class="btn ghost sq" data-bpick="' + di + ':' + it.id + ':' + est + ':' + cat + '">+ ' + L('add') + '</button>') + '</div>';
          }).join('');
        }).join('') + '</div>';
    }
    if (kind === 'bnew') {
      var isF = a === 'fuel', dSel = b != null && b !== '' ? +b : -1;
      return '<div class="sh-in"><div class="eyebrow o">' + L('budTrip') + '</div><h2>' + (isF ? L('bFuelTitle') : L('bNewTitle')) + '</h2>' +
        (isF ? '<p class="sh-lead">' + L('bFuelLead') + '</p>' : '') +
        '<label class="exp-f"><span>' + L('bName') + '</span><input id="bnN" type="text" maxlength="60" value="' + (isF ? esc(L('bRefuel')) : '') + '"></label>' +
        '<label class="exp-f"><span>' + L('expAmt') + '</span><input id="bnA" type="text" inputmode="decimal" autocomplete="off" data-step="0.01" min="0" placeholder="0.00"></label>' +
        '<div class="exp-cats">' + BC.map(function (c, k) { return '<button type="button" class="gf expcat' + ((isF ? c[0] === 'fuel' : !k) ? ' on' : '') + '" data-cat="' + c[0] + '">' + ic(c[1]) + L(c[2]) + '</button>'; }).join('') + '</div>' +
        '<label class="exp-f"><span>' + L('bDay') + '</span><select id="bnD" class="bud-sel"><option value="-1">' + L('bGeneral') + '</option>' +
          plans.map(function (pp, di) { return '<option value="' + di + '"' + (di === dSel ? ' selected' : '') + '>' + L('day') + ' ' + (di + 1) + ' · ' + esc(pp.day.title) + '</option>'; }).join('') + '</select></label>' +
        '<div class="btn-row"><button type="button" class="btn navy sq" data-bnew>' + ic('check') + L('expSave') + '</button></div></div>';
    }
    if (kind === 'alts') {
      var dd0 = T.days[+a], base = dd0.items.filter(function (x) { return x.id === b; })[0];
      if (!base) return '';
      var pA = plans[+a], exA = ((custom || {}).extras || {})[dd0.id] || [];
      // qué ocupa ahora este hueco: la original (o su alternativa), un reemplazo o un hueco libre
      var curRep = exA.filter(function (x) { return x.rep && x.before === b; })[0];
      var hole = !!((((custom || {}).gaps || {})[dd0.id] || {})[b]), orgOn = !curRep && !hole;
      var used = {};
      plans.forEach(function (pp) { pp.ev.forEach(function (e) { if (e.skip) return; used[e.it.id] = 1; used[String(e.it.ti).toLowerCase()] = 1; if (e.it.extra) used[e.it.extra] = 1; if (e.it.altId) used[e.it.altId] = 1; }); });
      (base.alts || []).forEach(function (x) { used[x.id] = 1; used[String(x.ti).toLowerCase()] = 1; });
      used[base.id] = 1; used[String(base.ti).toLowerCase()] = 1;
      function useBtn(id) { return '<button type="button" class="btn navy sq" data-replace="' + a + ':' + b + ':' + id + '">' + L('choose') + '</button>'; }
      // a cubierto: lo etiquetado «rain» y también restaurantes, cafés y pubs
      function indoor(o) { return tagsOf(o).indexOf('rain') >= 0 || o.t === 'food' || o.t === 'night'; }
      var bev = null; pA.ev.forEach(function (e) { if (curRep ? e.it.id === curRep.uid : e.it.id === b) bev = e; });
      var bw0 = bev && !hole ? badWeather(bev, +a, pA) : null, rainOn = c === 'rain' || !!bw0;
      // se llega desde la parada anterior del día
      var from = null, bi0 = bev ? pA.ev.indexOf(bev) : -1;
      for (var q = bi0 - 1; q >= 0 && !from; q--) { var pe0 = pA.ev[q]; if (!pe0.skip && !pe0.it.hidden && !pe0.it.hole && pe0.it.t !== 'drive' && pe0.it.lat != null) from = pe0.it; }
      var rows = [], seenId = {};
      var seenPl = [];
      function push(o, html, rain) {
        if (o.id) { if (seenId[o.id]) return; seenId[o.id] = 1; }
        if (o.ti) {
          if (seenPl.some(function (z) { return sameThing(z, o); })) return;
          seenPl.push({ lat: o.lat, lon: o.lon, ti: o.ti });
        }
        var tg = tagsOf(o).slice(); kindTags(o).forEach(function (kt) { if (tg.indexOf(kt) < 0) tg.push(kt); }); if (rain && tg.indexOf('rain') < 0) tg.push('rain');
        rows.push({ html: html, tags: tg });
      }
      var selChip = '<span class="chip ok">' + ic('check') + L('selected') + '</span>';
      // 0) lo que hay ahora en su lugar
      if (curRep && bev) push(bev.it, optRow(bev.it, L('nowInPlan') + ' · ' + C.dur(bev.it.d) + (bev.it.pl ? ' · ' + esc(bev.it.pl) : ''), selChip, reach(from, bev.it)), indoor(bev.it));
      // 1) la original y sus alternativas
      if (base.alts || !orgOn) {
        var curSw = custom && custom.swaps && custom.swaps[b] != null ? custom.swaps[b] : -1;
        [{ o: base, k: -1 }].concat((base.alts || []).map(function (x, k) { return { o: x, k: k }; })).forEach(function (z) {
          var on = orgOn && z.k === curSw;
          push(z.o, optRow(z.o, (z.k < 0 ? L('original') : L('altOpt')) + ' · ' + C.dur(z.o.d) + (z.o.pl ? ' · ' + esc(z.o.pl) : ''),
            on ? selChip : '<button type="button" class="btn navy sq" data-swap="' + b + ':' + z.k + '">' + L('choose') + '</button>', reach(from, z.o)), indoor(z.o));
        });
      }
      // restaurantes y pubs de la guía del día que están cerca (≤ 25 km), del más cercano al más lejano
      var gNear = (dd0.guide || []).map(function (g, k) { return { g: g, k: k, loc: gLoc(g, dd0) }; }).filter(function (z) {
        var gk = tkey(z.g.n);
        if (Object.keys(used).some(function (u) { return tkey(u).indexOf(gk) >= 0; })) return false;   // ya está en el plan («Cena en Sloans»)
        return (z.g.k === 'eat' || z.g.k === 'pub') && !used[String(z.g.n).toLowerCase()] && (!z.loc || base.lat == null || C.km(base, z.loc) <= 25);
      }).sort(function (p, q) { return (p.loc && base.lat != null ? C.km(base, p.loc) : 0) - (q.loc && base.lat != null ? C.km(base, q.loc) : 0); });
      function gRow(z) {
        var g = z.g, tg = g.k === 'pub' ? ['rain', 'night'] : ['rain'];
        push({ id: 'g-' + dd0.id + '-' + z.k, tags: tg, ti: g.n }, optRow({ ph: g.ph, t: g.k === 'pub' ? 'night' : 'food', ti: g.n, lead: g.t, q: g.n, pl: g.pl, tags: tg }, esc(g.pl) + (g.p ? ' · ' + esc(g.p) : ''), useBtn('g-' + dd0.id + '-' + z.k), z.loc && !z.loc.approx ? reach(from, z.loc) : ''), true);
      }
      // 2) si es una comida: otros sitios para comer o tomar algo del día (a cubierto)
      if (base.t === 'food') gNear.forEach(gRow);
      // 3) ideas. Día de ruta (la parada anterior y la siguiente están lejos): solo lo que queda de camino, por desvío,
      //    probando cada una en el día para avisar si te hace llegar tarde a algo con hora. Día de ciudad: lo de cerca.
      var inPlan = inPlanTest(plans, +a), baseK = tkey(base.ti);
      var to = null, fixNext = null, bi1 = bev ? pA.ev.indexOf(bev) : -1;
      for (var q3 = bi1 + 1; bi1 >= 0 && q3 < pA.ev.length; q3++) {
        var ne0 = pA.ev[q3]; if (ne0.skip || ne0.it.hidden || ne0.it.t === 'drive') continue;
        if (!to && !ne0.it.hole && ne0.it.lat != null) to = ne0.it;
        if (!fixNext && ne0.it.at && !ne0.it.sun) fixNext = ne0;
      }
      var cur0 = bev && !bev.skip ? bev.it : base, corridor = !!(from && to && C.km(from, to) > 15), posAfter = null;
      if (base.sun) for (var q5 = bi1 + 1; bi1 >= 0 && q5 < pA.ev.length && !posAfter; q5++) { var z5 = pA.ev[q5]; if (!z5.skip && !z5.it.hidden && z5.it.t !== 'drive' && !z5.it.extra) posAfter = z5.it.id; }
      var dayIts = pA.ev.filter(function (e) { return !e.skip && !e.it.hidden && !e.it.hole && e.it.t !== 'drive'; }).map(function (e) { return e.it; });
      var lateSlot = bev && !bev.skip && bev.start >= pA.sun.dusk;
      function nightOk(o) { var tg = tagsOf(o); return tg.indexOf('night') >= 0 || tg.indexOf('rain') >= 0 || o.t === 'food' || o.t === 'night'; }
      function okIdea(o) {
        return o.lat != null && !o.fuel && o.t !== 'car' && o.t !== 'hotel' && !used[o.id] && !used[String(o.ti).toLowerCase()] && !inPlan(o) && tkey(o.ti) !== baseK &&
          !dayIts.some(function (x) { return sameThing(x, o); }) && (!lateSlot || nightOk(o));   // de noche, solo cosas de noche o a cubierto
      }
      var ab = corridor ? C.km(from, to) : 0, baseCost = corridor ? ttMin(from, cur0) + ttMin(cur0, to) : 0;
      function onWay(o) { return C.km(from, o) + C.km(o, to) <= ab * 1.25 + 15 && (C.km(from, o) >= ab * 0.25 || C.km(o, cur0) <= 15); }
      // desvío = solo el trayecto extra (lo que dura la actividad se ve en el aviso de lo que se mueve)
      function detour(o) { return ttMin(from, o) + ttMin(o, to) - baseCost; }
      function detTxt(m) { m = Math.round(m / 5) * 5; return m <= 5 && m >= -5 ? L('detNone') : m < 0 ? L('detSave', C.dur(-m)) : L('detPlus', C.dur(m)); }
      // lo que pasa en el día si la eliges (hora fija que se mueve, de noche, cerrado)
      function consequence(o) {
        var th = trialAdd(pA, +a, custom, { id: o.id, before: b, uid: '_t', rep: 1, pos: posAfter });
        if (!th) return '';
        var w = [];
        if (th.fixed) w.push(L('movesX', esc(th.fixed.it.ti), C.fmt(th.fixed.start)));
        if (th.bad.length) w.push(esc(th.bad[0].t));
        return w.length ? '<p class="det-warn">' + ic('alert') + w.join(' · ') + '</p>' : '';
      }
      var near;
      if (corridor) {
        near = C.pool(T).filter(function (o) { return okIdea(o) && onWay(o); }).map(function (o) { return { o: o, km: C.km(cur0, o), det: detour(o) }; })
          .sort(function (p, q) { return (Math.round(p.det / 5) - Math.round(q.det / 5)) || p.km - q.km; }).slice(0, 12);
      } else {
        near = base.lat == null ? [] : C.pool(T).filter(okIdea)
          .map(function (o) { return { o: o, km: C.km(base, o) }; }).filter(function (z) { return z.km <= (z.o.t === 'food' ? 20 : 30); })
          .sort(function (p, q) { var fp = base.t === 'food' && p.o.t === 'food' ? -100 : 0, fq = base.t === 'food' && q.o.t === 'food' ? -100 : 0; return (p.km + fp) - (q.km + fq); });
        near = near.slice(0, 16);
        var bslot = base.sun ? 'sunset' : bev && !bev.skip ? slotTag(bev.start, pA.sun) : '';
        near = bySlot(near, bslot, function (z) { return z.o; });
      }
      function nearRow(z) {
        var o = z.o, sub = esc(o.pl || '') + ' · ' + C.dur(o.d) + (corridor ? ' · ' + detTxt(z.det != null ? z.det : detour(o)) : from ? '' : ' · ' + L('kmAway', z.km < 1 ? '&lt;1' : Math.round(z.km)));
        return optRow(o, sub, useBtn(o.id), reach(from, o) + (corridor ? consequence(o) : ''));
      }
      near.forEach(function (z) { push(z.o, nearRow(z), indoor(z.o)); });
      // 4) más planes a cubierto (de camino, o hasta 40 km) y, si no es comida, cafés y pubs del día
      if (base.lat != null) C.pool(T).concat(dd0.extras || []).filter(function (o) { return okIdea(o) && indoor(o) && (!corridor || onWay(o)); })
        .map(function (o) { return { o: o, km: C.km(base, o), det: corridor ? detour(o) : null }; }).filter(function (z) { return corridor || z.km <= 40; })
        .sort(function (p, q) { return corridor ? p.det - q.det : p.km - q.km; }).slice(0, 8)
        .forEach(function (z) { push(z.o, nearRow(z), true); });
      if (base.t !== 'food') gNear.slice(0, 6).forEach(gRow);
      var FL = fList(rows, rainOn ? 'rain' : '');
      var note = bw0 ? '<p class="warn-note">' + ic(bw0.kind === 'sun' ? 'cloud' : 'rain') + (bw0.kind === 'sun' ? L('rainNoteSun', bw0.s.cloud, bw0.s.pop) : L('rainNoteRain', bw0.s.pop, bw0.s.mm)) + '</p>' : '';
      var head = hole ? '<div class="eyebrow o">' + L('holeFill') + '</div><h2>' + L('holeTi') + (bev && !bev.skip ? ' · ' + C.fmt(bev.start) + '–' + C.fmt(bev.end) : '') + '</h2><p class="muted small">' + L('holeWas', esc(base.ti)) + '</p>'
        : '<div class="eyebrow o">' + L('altsTitle') + '</div><h2>' + esc(curRep && bev ? bev.it.ti : base.ti) + '</h2>';
      var way = corridor ? '<p class="rch-from">' + ic('route') + L('wayNote', esc(from.ti), esc(to.ti)) + (fixNext ? ' ' + L('mustBe', esc(fixNext.it.ti), fixNext.it.at) + (fixNext.start > C.hm(fixNext.it.at) + 1 ? ' ' + L('nowAt', C.fmt(fixNext.start)) : '') : '') + '</p>'
        : from ? '<p class="rch-from">' + ic('route') + L('rchFrom', esc(from.ti)) + '</p>' : '';
      return '<div class="sh-in">' + head + FL.bar + note + way + FL.list + '</div>';
    }
    // «+» del día: ideas cerca de las paradas del día, con filtros y cómo llegar
    if (kind === 'addday') {
      var dA = T.days[+a], pD = plans[+a];
      var liveA = pD.ev.filter(function (e) { return !e.skip && !e.it.hidden && !e.it.hole && e.it.t !== 'drive' && e.it.lat != null; });
      var usedA = {};
      plans.forEach(function (pp) { pp.ev.forEach(function (e) { if (e.skip) return; usedA[e.it.id] = 1; usedA[String(e.it.ti).toLowerCase()] = 1; if (e.it.extra) usedA[e.it.extra] = 1; if (e.it.altId) usedA[e.it.altId] = 1; }); });
      var seenA = {}, candA = [], inPlanA = inPlanTest(plans, +a);
      (dA.extras || []).concat(C.pool(T)).forEach(function (o) {
        if (seenA[o.id] || seenA[tkey(o.ti)] || o.lat == null || o.fuel || o.t === 'car' || o.t === 'hotel' || o.t === 'drive' || usedA[o.id] || usedA[String(o.ti).toLowerCase()] || inPlanA(o)) return;
        seenA[o.id] = 1; seenA[tkey(o.ti)] = 1;
        var nb = null, nk = 1e9; liveA.forEach(function (e) { var k = C.km(e.it, o); if (k < nk) { nk = k; nb = e.it; } });
        if (liveA.some(function (e) { return sameThing(e.it, o); }) || candA.some(function (z) { return sameThing(z.o, o); })) return;
        if (nb && nk <= 40) candA.push({ o: o, km: nk, from: nb });
      });
      candA.sort(function (p, q) { return p.km - q.km; });
      var rowsA = candA.slice(0, 30).map(function (z) {
        var o = z.o, tg = tagsOf(o).slice(); if ((o.t === 'food' || o.t === 'night') && tg.indexOf('rain') < 0) tg.push('rain');
        return { tags: tg, html: optRow(o, esc(o.pl || '') + ' · ' + C.dur(o.d), '<button type="button" class="btn navy sq" data-sheet="addto:' + a + ':' + o.id + '">' + ic('plus') + L('add') + '</button>', reach(z.from, o, true)) };
      });
      var FA = fList(rowsA, '');
      return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + ' · ' + esc(dA.title) + '</div><h2>' + L('addAct') + '</h2><p class="add-note">' + L('addActLead') + '</p>' + FA.bar + FA.list + '</div>';
    }
    // dónde ponerla: huecos libres primero; si no hay, en lugar de otra
    if (kind === 'addto') {
      var dT = +a, oT = null; (T.days[dT].extras || []).concat(C.pool(T)).forEach(function (o) { if (!oT && o.id === b) oT = o; });
      if (!oT) return '';
      return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (dT + 1) + ' · ' + L('addWhere') + '</div>' +
        optRow(oT, esc(oT.pl || '') + ' · ' + C.dur(oT.d), '') + addActHTML(plans[dT], dT, oT, custom) + '</div>';
    }
    if (kind === 'extras') {
      var dx = T.days[+a], gap = +c, added = (((custom || {}).extras || {})[dx.id] || []).map(function (x) { return x.id; });
      var dusk = plans[+a].sun.dusk, t0 = +d0 || 0;
      var list = (dx.extras || []).filter(function (x) { return added.indexOf(x.id) < 0 && (b === 'END' || x.d <= gap + 10) && !(x.light && t0 + 15 >= dusk); });
      var slot = slotTag(b === 'END' ? plans[+a].last : t0, plans[+a].sun);
      list = bySlot(list, slot);
      return '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + '</div><h2>' + (b === 'END' ? L('ideasEnd') : L('ideasFor', C.dur(gap))) + '</h2>' +
        (slot && list.some(function (x) { return tagsOf(x).indexOf(slot) >= 0; }) ? '<p class="add-note">' + L('slot_' + slot, C.fmt(plans[+a].sun.set)) + '</p>' : '') +
        (list.length ? list.map(function (o) { return optRow(o, esc(o.pl) + ' · ' + C.dur(o.d), '<button type="button" class="btn navy sq" data-addx="' + a + ':' + o.id + ':' + b + '">+ ' + L('add') + '</button>'); }).join('')
          : '<p class="sh-lead">' + L('noExtras') + '</p>') + '</div>';
    }
    if (kind === 'item') {
      var hit = null, di = 0;
      plans.forEach(function (p, k) { p.ev.forEach(function (e) { if (e.it.id === a) { hit = e; di = k; } }); });
      if (!hit) return '';
      var it = hit.it, drive = it.t === 'drive', recs = recTiles(it, drive), chips = chipsFor(hit, di, plans[di]);
      var groups = {};
      recs.forEach(function (r) { (groups[r[0]] = groups[r[0]] || { ic: r[1], o: r[3], list: [] }).list.push(r[2]); });
      html = (it.img && !it.ph ? '<div class="sh-ph ph" style="background-image:url(' + it.img + ')"></div>' : shPhoto(it.ph)) + '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (di + 1) + ' · ' + (hit.skip ? L('dropped') : C.fmt(hit.start) + ' – ' + C.fmt(hit.end)) + ' · ' + C.dur(it.d) + '</div>' +
        '<h2>' + esc(it.ti) + '</h2>' + (it.pl ? '<div class="muted small">' + esc(it.pl) + '</div>' : '') +
        (chips ? '<div class="chips">' + chips + '</div>' : '') + (it.lead ? '<p class="sh-lead">' + esc(it.lead) + '</p>' : '') + filmHTML(it) + shotHTML(it) +
        Object.keys(groups).map(function (g) { var G = groups[g]; return '<div class="sh-sec ' + G.o + '"><div class="k">' + ic(G.ic) + g + '</div><ul>' + G.list.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul></div>'; }).join('') +
        '<div class="btn-row">' + mapBtn(gmaps(it, drive), drive ? L('route') + ' · Google Maps' : 'Google Maps') +
        (hit.skip ? '' : '<button type="button" class="btn ghost sq" data-time="' + hit.start + '" data-tday="' + di + '">' + ic('clock') + C.fmt(hit.start) + '</button>') +
        '<button type="button" class="btn ghost sq" data-goto="' + (di + 1) + ':' + it.id + '">' + ic('next') + L('itinerary') + '</button></div>' +
        (drive ? '' : crowdHTML(hit, plans[di], di)) + '</div>';
    } else if (kind === 'guide') {
      var g = T.days[+a].guide[+b], K = KIND[g.k];
      html = shPhoto(g.ph) + '<div class="sh-in"><div class="eyebrow o">' + L(K[0]) + (g.p ? ' · ' + g.p : '') + '</div><h2>' + esc(g.n) + '</h2><div class="muted small">' + esc(g.pl) + '</div>' +
        '<p class="sh-lead">' + esc(g.t) + '</p><div class="btn-row">' + mapBtn(gsearch(g.n, g.pl)) + '</div>' + addPlan(plans, custom, +a, 'g-' + T.days[+a].id + '-' + b, g.k) + '</div>';
    } else if (kind === 'souv') {
      var s = T.souvenirs[+a];
      html = shPhoto(s.ph) + '<div class="sh-in"><div class="eyebrow o">' + L('souv') + '</div><h2>' + esc(s.n) + '</h2><p class="sh-lead">' + esc(s.t) + '</p>' +
        '<div class="sh-sec"><div class="k">' + ic('pin') + L('rSee') + '</div><p>' + esc(s.w) + '</p></div>' + souvAdd(plans, custom, +a) + '</div>';
    } else if (kind === 'drv') {
      var x = T.driving[+a];
      html = shPhoto(x.ph) + '<div class="sh-in"><div class="eyebrow o">' + esc({ base: L('kBase'), winter: L('kWinter'), sos: L('kSos') }[x.k]) + '</div><h2>' + esc(x.n) + '</h2><p class="sh-lead">' + esc(x.t) + '</p>' +
        (x.k !== 'base' ? '<div class="links">' + (T.links || []).map(function (l) { return '<a class="lk sq" href="' + l.u + '" target="_blank" rel="noopener"><div><b>' + esc(l.n) + '</b><small>' + esc(l.t) + '</small></div>' + ic('ext') + '</a>'; }).join('') + '</div>' : '') + '</div>';
    } else if (kind === 'event') {
      var ev = T.events[+a];
      html = '<div class="sh-in"><div class="sh-icon">' + ic(ev.icon) + '</div><h2>' + esc(ev.ti) + '</h2><p class="sh-lead">' + esc(ev.t) + '</p></div>';
    } else if (kind === 'tip') {
      var tp = T.days[+a].tips[+b];
      html = '<div class="sh-in"><div class="sh-icon">' + ic('bulb') + '</div><div class="eyebrow o">' + L(PROF[tp.c]) + '</div><p class="sh-lead">' + esc(tp.t) + '</p></div>';
    } else if (kind === 'photo') {
      var dd = T.days[+b];
      html = shPhoto(a) + '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+b + 1) + '</div><h2>' + esc(dd.title) + '</h2><p class="sh-lead">' + esc(dd.sub) + '</p></div>';
    } else if (kind === 'light') {
      var p = plans[+a], su = p.sun, mad = Core.sunTimes(p.ms, 40.4168, -3.7038);
      function row(icn, lbl, t) { return '<button type="button" class="lrow sq" data-time="' + Math.round(t) + '" data-tday="' + a + '">' + ic(icn) + '<span>' + lbl + '</span><b>' + C.fmt(t) + '</b></button>'; }
      html = '<div class="sh-in"><div class="eyebrow o">' + L('day') + ' ' + (+a + 1) + ' · ' + esc(C.dateLabel(p.ms)) + '</div><h2>' + L('lightOf', esc(p.day.ref.name)) + '</h2>' +
        '<div class="lrows">' + row('moon', L('sDawn') + ' (−6°)', su.dawn) + row('sunrise', L('mkRise'), su.rise) + row('sun', 'Golden hour', su.gold) + row('sunset', L('mkSet'), su.set) + row('moon', L('fullDark'), su.dusk) + '</div>' +
        '<div class="sh-sec"><div class="k">' + ic('sun') + hshort(su.set - su.rise) + ' ' + L('ofLight') + '</div><p>Madrid: ' + hshort(mad.set - mad.rise) + ' ' + L('ofLight') + ' (' + (I18N.lang === 'en' ? 'difference' : 'diferencia') + ': ' + hshort(Math.abs((mad.set - mad.rise) - (su.set - su.rise))) + ')</p></div></div>';
    } else if (kind === 'drives') {
      var list = a === 'all' ? plans : [plans[+a]];
      html = '<div class="sh-in"><div class="eyebrow o">' + L('route') + '</div><h2>' + (a === 'all' ? L('drvTitle') : L('day') + ' ' + (+a + 1)) + '</h2>' +
        list.map(function (pp) {
          var k = plans.indexOf(pp), legs = pp.live.filter(function (e) { return e.it.t === 'drive'; });
          if (!legs.length) return '';
          return (a === 'all' ? '<div class="eyebrow" style="margin-top:12px">' + L('day') + ' ' + (k + 1) + ' · ' + C.kmTxt(pp.km) + ' km · ' + C.dur(pp.driveMin) + '</div>' : '') +
            legs.map(function (e) { return '<a class="lrow sq" href="' + gmaps(e.it, true) + '" target="_blank" rel="noopener">' + ic('car') + '<span>' + esc(e.it.ti) + '<small>' + C.fmt(e.start) + ' · ' + (e.it.km ? C.kmTxt(e.it.km) + ' km · ' : '') + C.dur(e.it.d) + '</small></span>' + ic('ext') + '</a>'; }).join('');
        }).join('') + '</div>';
    }
    return html;
  }

  function foot() {
    var cr = (window.PHOTO_CREDITS || []).map(function (c) { return esc(c.place) + ': ' + esc(c.artist || L('author')) + ' · ' + esc(c.lic) + ' · <a href="' + esc(c.page) + '" target="_blank" rel="noopener">Wikimedia Commons</a>'; }).join('<br>');
    return '<p class="foot">' + L('foot') + (window.GUIDE_VER ? '<br>' + L('verX', window.GUIDE_VER) : '') + '</p>' + (cr ? '<details class="credits"><summary>' + L('credits') + '</summary><p>' + cr + '</p></details>' : '');
  }

  return { setAlbum: function (a) { ALB = a || {}; }, isCromo: isCromo, cromoKey: cromoKey, cromoBtn: cromoBtn, setDocs: function (d) { DOCS = d || []; }, docs: docs, dataTools: dataTools, payers: payers, setWx: setWx, presetState: presetState, dayTouched: dayTouched, curRoute: curRoute, routeName: routeName, setPlans: function (p) { PLANS = p; }, stays: stays, fuelLog: fuelLog, chkStat: chkStat, setSim: function (f, g) { SIM = f; SKIPS = g; }, gLoc: gLoc, stopsOf: stopsOf, nearRecs: nearRecs, badWeather: badWeather, sunOutlook: sunOutlook, cur: cur, money: money, hubTiles: hubTiles, prepGroups: prepGroups, guideHTML: guideHTML, budgetCard: budgetCard, fuelCard: fuelCard, setBudget: setBudget, hero: hero, flights: flights, checklist: checklist, souvenirs: souvenirs, weather: weather, wxRows: wxRows, wxMini: wxMini, driving: driving, day: day, foot: foot, sheet: sheet,
    esc: esc, ic: ic, pct: pct, ring: ring, arcXY: arcXY, tFromX: tFromX, tyIcon: tyIcon, AW: AW };
})();

/* ===== Interfaz ===== */
(function () {
  'use strict';
  var C = Core, V = View, T = TRIP;
  var PRE = /[?&]prerender=1/.test(location.search);
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function r5(m) { return Math.round(m / 5) * 5; }

  // pestañas, páginas y botones del simulador según los días del viaje (el HTML trae 4)
  (function frame() {
    var n = T.days.length, main = $('#pages'), bar = $('.tabbar'), seg = $('#seg');
    if (!$('#p0')) { var p0 = document.createElement('section'); p0.className = 'page is-active'; p0.id = 'p0'; p0.setAttribute('aria-label', L('tabPrep')); main.insertBefore(p0, main.firstChild); }
    for (var i = 1; i <= Math.max(n, 9); i++) {
      var pg = $('#p' + i), tb = $('.tab[data-tab="' + i + '"]');
      if (i > n) { if (pg) pg.remove(); if (tb) tb.remove(); continue; }
      if (!pg) { pg = document.createElement('section'); pg.className = 'page'; pg.id = 'p' + i; main.appendChild(pg); }
      pg.setAttribute('aria-label', L('day') + ' ' + i);
      if (!tb && bar) {
        tb = document.createElement('button'); tb.className = 'tab sq'; tb.type = 'button'; tb.setAttribute('role', 'tab'); tb.setAttribute('data-tab', i); tb.setAttribute('aria-selected', 'false');
        bar.appendChild(tb);
      }
      if (tb && T.days[i - 1].icon && !tb.getAttribute('data-fixed')) tb.innerHTML = V.ic(T.days[i - 1].icon) + '<span class="tl-lbl">' + L('day') + ' ' + i + '</span>';
    }
    if (bar) {
      var web = !!window.GUIA_WEB;
      bar.style.setProperty('--n', n + 1 + (web ? 1 : 0)); bar.classList.toggle('many', n + (web ? 1 : 0) > 5); bar.classList.toggle('compact-days', n > 7);
      // en la web, el primer botón vuelve a la pantalla principal (Home); el segundo es el resumen de este viaje
      if (web && !$('.tab-home', bar)) {
        var hb = document.createElement('a'); hb.className = 'tab-home sq'; hb.href = 'index.html'; hb.setAttribute('aria-label', 'Home');
        hb.innerHTML = '<svg class="ic"><use href="#i-home"></use></svg><span class="tl-lbl">Home</span>';
        bar.insertBefore(hb, $('.tab', bar)); bar.classList.add('has-home');
        var t0i = $('.tab[data-tab="0"] use', bar); if (t0i) t0i.setAttribute('href', '#i-route');
      }
    }
    if (seg) {
      seg.style.setProperty('--nd', n);
      $$('button', seg).forEach(function (b) { b.remove(); });
      for (var k = 0; k < n; k++) { var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-sd', k); b.textContent = (n > 5 ? '' : L('day') + ' ') + (k + 1); seg.appendChild(b); }
    }
  })();

  // cada viaje guarda sus datos con su propio prefijo, así varios viajes no se mezclan
  var META = window.TRIP_META || {}, NS = (META.storage || META.id || 'guia') + ':';
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(NS + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) { /* modo privado */ } }
  };
  function fl0() { return JSON.parse(JSON.stringify(META.flights || { out: {}, back: {}, hours: 24 })); }
  if (!PRE) { var lang0 = window.Lang ? Lang.get() : store.get('lang', 'es'); if (lang0 !== 'es') I18N.apply(lang0); }
  var state = {
    start: PRE ? T.defaultStart : ((/[?&]start=(\d{4}-\d{2}-\d{2})/.exec(location.search) || [])[1] || T.defaultStart),
    checked: PRE ? {} : store.get('checked', {}),
    skipped: PRE ? {} : store.get('skipped', {}),
    custom: PRE ? {} : store.get('custom', {}),
    blist: PRE ? [] : store.get('blist', []),
    flights: PRE ? fl0() : store.get('flights', fl0()),
    payers: PRE ? null : store.get('payers', null),
    tab: 0, lastDay: 0, mode: 'sync', mDay: 0, mMin: 600, liveDay: -1, open: false
  };
  ['swaps', 'extras', 'order', 'sunPos', 'prefAt', 'gaps', 'hotels', 'free', 'preset', 'durs'].forEach(function (k) { state.custom[k] = state.custom[k] || {}; });
  // gastos apuntados con la versión anterior (por día) → lista única del presupuesto
  if (!PRE) {
    var oldEx = store.get('exps', null);
    if (oldEx) {
      T.days.forEach(function (d, di) { (oldEx[d.id] || []).forEach(function (x) { state.blist.push({ id: x.id, di: di, n: x.n || '', a: x.a, c: x.c }); }); });
      store.set('blist', state.blist); try { localStorage.removeItem(NS + 'exps'); localStorage.removeItem(NS + 'budget'); } catch (e) {}
    }
  }
  var wxData = PRE ? null : store.get('wx', null);   // previsión guardada: el primer pintado ya la usa
  function saveCustom() { store.set('custom', state.custom); }
  var grpOpen = '', hubY = 0, snowList = [], SID = Math.random().toString(36).slice(2);
  function hubHTML() { return V.hubTiles({ checked: state.checked, flights: state.flights, snow: snowList, hotels: state.custom.hotels }); }
  function hubRefresh() { var h = document.getElementById('hubGrid'); if (h) h.innerHTML = hubHTML(); }
  var plans = [];
  function computePlans() {
    var base = C.parseISO(state.start);
    plans = T.days.map(function (d, i) { return C.plan(d, C.addDays(base, i), state.skipped, state.custom); });
    V.setSim(function (di, cu, sk) { return C.plan(T.days[di], C.addDays(base, di), sk || state.skipped, cu); }, function () { return state.skipped; });
  }
  function renderAll() {
    computePlans(); V.setPlans(plans); V.setWx(wxValid() ? wxData : null);
    V.setBudget(state.blist, state.payers);
    var sug = V.souvenirs() + T.days.map(function (d, di) { return V.guideHTML(d, di, L('sugDay', di + 1, d.title)); }).join('');
    $('#p0').innerHTML = '<div class="prep-main" id="prepMain">' + V.hero(state.start, plans) +
        '<div class="sh hub-sh"><h3>' + L('prepTitle') + '</h3></div><div class="hub-grid" id="hubGrid">' + hubHTML() + '</div></div>' +
      V.prepGroups({ fl: V.flights(state.flights), stay: '<div id="stayBox">' + V.stays(state.custom.hotels) + '</div>', ida: V.checklist(state.checked, 'out'), vuelta: V.checklist(state.checked, 'back'),
        money: '<div id="budTrip">' + V.budgetCard(plans) + '</div>', fuel: '<div id="fuelLog">' + V.fuelLog() + '</div>' + V.fuelCard(),
        wx: V.weather(plans) + V.driving(), sug: sug, docs: V.docs(), data: V.dataTools() }) + V.foot();
    if (grpOpen) { var g0 = grpOpen; grpOpen = ''; openGroup(g0, true); }
    plans.forEach(function (p, i) { $('#p' + (i + 1)).innerHTML = V.day(p, i, state.custom) + V.foot(); });
    viewBtns();
    if (window.Mapa) Mapa.mount($('#tripMap'), {
      id: META.id, title: (META.title || {})[I18N.lang] || (META.title || {}).es || '', dayLabel: L('day'), lang: I18N.lang, mode: META.mode || 'car', land: T.mapLand || null,
      photos: window.TRIP_PHOTOS || null,
      days: plans.map(function (p) { return { title: p.day.title, jump: p.ev.some(function (e) { return e.it.jump && !e.skip; }), stops: p.ev.filter(function (e) { return !e.skip && Mapa.isStop(e.it); }).map(function (e) { return e.it; }) }; })
    });
  }

  /* ---------- Prerender (versión sin JS) ---------- */
  if (PRE) { renderAll(); document.documentElement.setAttribute('data-prerendered', state.start); return; }

  document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.documentElement.classList.add('mo');
  renderAll();

  // Textos fijos del HTML (pestañas, isla) en el idioma elegido
  function applyStatic() {
    $$('.tab').forEach(function (t, k) { var s = $('.tl-lbl', t); if (s) s.textContent = k ? L('day') + ' ' + k : window.GUIA_WEB ? L('tabTrip') : L('tabPrep'); });
    $$('#seg button').forEach(function (b, k) { b.textContent = L('day') + ' ' + (k + 1); });
    $('#islGo').textContent = L('seeInGuide');
    $('#islSync').innerHTML = V.ic('refresh') + L('sync');
    $('#islRoute').innerHTML = V.ic('route') + L('routeShort');
    $('#islLang').textContent = L('langBtn'); $('#islLang').setAttribute('aria-label', L('langAria'));
    $('#islBud').setAttribute('aria-label', L('gMoney'));
    $('#shX').setAttribute('aria-label', L('close'));
    var mt = META.title; document.title = (mt && typeof mt === 'object' ? (mt[I18N.lang] || mt.es) : (mt || '')) + ' · ' + L('travelGuide');
    var tb = $('.tabbar'); if (tb) tb.setAttribute('aria-label', L('sections'));
    $$('.page').forEach(function (pg, k) { pg.setAttribute('aria-label', k ? L('day') + ' ' + k : L('tabPrep')); });
  }
  applyStatic();

  /* ---------- Háptica (iOS 18: truco del switch nativo; Android: vibrate) ---------- */
  var hapt = $('#haptic');
  function haptic() {
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    try { if (navigator.vibrate) navigator.vibrate(8); else if (hapt) hapt.click(); } catch (e) {}
  }

  /* ---------- Pulsar ---------- */
  var pressed = null;
  function release() { if (pressed) { pressed.classList.remove('is-press'); pressed = null; } }
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest('.sq, .chk');
    if (!el) return; release(); pressed = el; el.classList.add('is-press');
  }, { passive: true });
  ['pointerup', 'pointercancel', 'dragstart'].forEach(function (n) { document.addEventListener(n, release, { passive: true }); });
  document.addEventListener('touchstart', function () {}, { passive: true });

  /* ---------- Scroll estilo Apple: aparición suave, borde superior y parallax ----------
     Todo va ligado a la posición (no a la velocidad) y con medidas cacheadas: estable y fluido. */
  var items = [], pars = [], zooms = [], stages = [], counts = [], anchors = {}, raf = 0;
  function absTop(el) { var t = 0; while (el) { t += el.offsetTop; el = el.offsetParent; } return t; }
  function measure() {
    items.forEach(function (it) { it.el.style.transform = ''; });
    var pg = $('.page.is-active');
    items = $$('.rv', pg).filter(function (el) { return el.offsetParent !== null; }).map(function (el) { return { el: el, top: absTop(el), h: el.offsetHeight || 1, s: 1 }; });
    pars = $$('[data-par]', pg).map(function (el) { return { el: el, top: absTop(el), h: el.offsetHeight || 1 }; });
    zooms = $$('[data-zoom]', pg).filter(function (el) { return el.offsetParent !== null; }).map(function (el) { return { el: el, top: absTop(el), h: el.offsetHeight || 1, s: 0 }; });
    // escenarios fijos de Inicio: la ruta (foto a la derecha, datos a la izquierda) y la tira de días
    stages = [];
    if (!reduce) {
      var shh = Math.max(380, Math.min(560, window.innerHeight - 190));

    }
    counts = $$('[data-count]', pg).filter(function (el) { return !el.getAttribute('data-done'); });
    anchors = {};
    $$('.tl', pg).forEach(function (tl) { anchors[tl.getAttribute('data-tl')] = { tl: tl, top: absTop(tl), pts: tlAnchors(tl) }; });
    frame();
  }
  function frame() {
    raf = 0;
    var y = window.pageYOffset, H = window.innerHeight, edge = 76, stagger = 0;
    for (var i = 0; i < items.length; i++) {
      var it = items[i], top = it.top - y, bot = top + it.h;
      if (!it.el.classList.contains('in') && top < H * 0.94 && bot > 0) {
        if (!reduce) it.el.style.transitionDelay = (stagger++ * 70) + 'ms';
        it.el.classList.add('in');
      }
      if (reduce) continue;
      // al salir por arriba (bajo la isla), la tarjeta se encoge un poco: profundidad, como en watchOS
      var e = clamp((edge + 70 - bot) / 140, 0, 1), s = 1 - e * 0.06;
      if (Math.abs(s - it.s) > 0.001) { it.s = s; it.el.style.transform = s < 0.9995 ? 'scale(' + s.toFixed(4) + ')' : ''; }
    }
    if (!reduce) for (var k = 0; k < pars.length; k++) {
      var p = pars[k], pt = p.top - y;
      if (pt > H || pt + p.h < 0) continue;
      p.el.style.backgroundPosition = 'center calc(50% + ' + ((pt - 80) * -0.12).toFixed(1) + 'px)';
    }
    // escenarios: progreso 0→1 mientras el bloque está fijo bajo la isla
    for (var g = 0; g < stages.length; g++) {
      var sg = stages[g], rr = sg.el.getBoundingClientRect();
      if (rr.bottom < -50 || rr.top > H + 50) continue;
      var pp = clamp((92 - rr.top) / Math.max(1, rr.height - sg.sh), 0, 1);
      if (Math.abs(pp - sg.p) < 0.002) continue;
      sg.p = pp; sg.el.style.setProperty('--p', pp.toFixed(3));
      if (sg.strip) { sg.strip.style.transform = 'translate3d(' + (-pp * sg.travel).toFixed(1) + 'px,0,0)'; dcarFx(); }
    }
    // cifras que cuentan hacia arriba al aparecer
    for (var c2 = counts.length - 1; c2 >= 0; c2--) {
      var cel = counts[c2], cr = cel.getBoundingClientRect();
      if (cr.top < H * 0.88 && cr.bottom > 0) { counts.splice(c2, 1); countUp(cel); }
    }
    // fotos que se acercan al entrar y se asientan al llegar arriba, como en las fichas de Apple
    if (!reduce) for (var z = 0; z < zooms.length; z++) {
      var zo = zooms[z], zt = zo.top - y;
      if (zt > H || zt + zo.h < 0) continue;
      var zs = (1.16 - 0.16 * clamp((H - zt) / (H * 0.75), 0, 1)).toFixed(4);
      if (zs !== zo.s) { zo.s = zs; zo.el.style.transform = 'scale(' + zs + ')'; }
    }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  window.__fx = function () { measure(); frame(); };   // para pruebas: fuerza un fotograma de los efectos
  // ruta de Inicio: deslizar la foto (o tocar las flechas) para ir a la parada siguiente o anterior
  function rsGo(dir) { var cur = $('#steps .st.on'), nx = cur && (dir > 0 ? cur.nextElementSibling : cur.previousElementSibling); if (nx && nx.classList.contains('st')) { pickStop(nx); selectStop(nx); } }
  (function () {
    var sx = 0, sy = 0, el = null;
    document.addEventListener('pointerdown', function (e) { var ph = e.target.closest && e.target.closest('#rspWrap .rsx-ph'); if (!ph || e.target.closest('[data-rsnav]')) return; el = ph; sx = e.clientX; sy = e.clientY; }, { passive: true });
    document.addEventListener('pointermove', function (e) { if (!el) return; var dx = e.clientX - sx; if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - sy)) el.style.transform = 'translateX(' + (dx * 0.3).toFixed(1) + 'px)'; }, { passive: true });
    function end(e) {
      if (!el) return; var ph = el, dx = e.clientX - sx, dy = e.clientY - sy; el = null;
      ph.style.transition = 'transform .35s cubic-bezier(.22,1,.36,1)'; ph.style.transform = ''; setTimeout(function () { ph.style.transition = ''; }, 380);
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) rsGo(dx < 0 ? 1 : -1);
    }
    document.addEventListener('pointerup', end, { passive: true }); document.addEventListener('pointercancel', function () { if (el) { el.style.transform = ''; el = null; } }, { passive: true });
  })();
  function countUp(el) {
    el.setAttribute('data-done', '1');
    if (reduce) return;
    var to = +el.getAttribute('data-count'), fm = el.getAttribute('data-fmt'), t0 = 0;
    function show(v) { el.textContent = fm === 'km' ? '≈ ' + Math.round(v) : fm === 'hm' ? Math.floor(v / 60) + ' h ' + ('0' + Math.round(v % 60)).slice(-2) : String(Math.round(v)); }
    function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1100), e = 1 - Math.pow(1 - k, 3); show(to * e); if (k < 1) requestAnimationFrame(step); }
    show(0); requestAnimationFrame(step);
  }
  function setupReveal(instant) {
    setTimeout(dcarFx, 30);
    if (reduce) { $$('.rv').forEach(function (el) { el.classList.add('in'); }); measure(); return; }
    if (instant) $$('.rv').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.style.transition = 'none'; el.classList.add('in'); el.offsetWidth; el.style.transition = ''; }
    });
    measure();
  }
  // carrusel de días: la tarjeta del centro, más grande y clara
  function dcarFx() {
    var c = document.getElementById('dcar'); if (!c || reduce) return;
    var r = c.getBoundingClientRect(), mid = r.left + r.width / 2;
    $$('.dcard', c).forEach(function (el) {
      var b = el.getBoundingClientRect(), d = Math.min(1, Math.abs(b.left + b.width / 2 - mid) / r.width);
      el.style.transform = 'scale(' + (1 - d * 0.1).toFixed(4) + ')'; el.style.opacity = (1 - d * 0.45).toFixed(3);
    });
  }
  document.addEventListener('scroll', function (e) { if (e.target && e.target.id === 'dcar') requestAnimationFrame(dcarFx); }, true);
  // Reflejo de la isla y la barra: se desplaza con el scroll, como la luz sobre el cristal
  var isl0 = $('#island'), bar0 = $('.tabbar');
  function sheen(y) { var gx = (30 + 35 * Math.sin(y / 420)).toFixed(1) + '%'; isl0.style.setProperty('--gx', gx); bar0.style.setProperty('--gx', gx); }
  window.addEventListener('scroll', function () { release(); sheen(window.pageYOffset); kick(); islSmall(); }, { passive: true });
  // la isla se encoge al bajar, como la Dynamic Island
  function islSmall() { var sm = window.pageYOffset > 90; if (document.documentElement.classList.contains('isl-sm') !== sm) document.documentElement.classList.toggle('isl-sm', sm); }

  /* ---------- Carruseles: escala por posición, arrastre con ratón y flechas ---------- */
  function hsUpdate(h) {
    if (reduce || !h.offsetParent) return;
    var r = h.getBoundingClientRect(), edge = r.left + 16;
    for (var k = 0; k < h.children.length; k++) {
      var c = h.children[k], cr = c.getBoundingClientRect();
      c.style.scale = (1 - Math.min(Math.abs(cr.left - edge) / r.width, 0.7) * 0.09).toFixed(3);
    }
  }
  var hsPending = [];
  document.addEventListener('scroll', function (e) {
    var h = e.target;
    if (!h.classList || !h.classList.contains('hscroll')) return;
    if (hsPending.indexOf(h) < 0) { hsPending.push(h); requestAnimationFrame(function () { hsUpdate(h); hsPending.splice(hsPending.indexOf(h), 1); }); }
  }, { capture: true, passive: true });
  function hsAll(root) { $$('.hscroll', root).forEach(hsUpdate); }
  var mdrag = null, eatClick = false;
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    var h = e.target.closest('.hscroll, .steps, .dcar'); if (!h) return;
    mdrag = { h: h, x: e.clientX, sl: h.scrollLeft, moved: false };
  });
  document.addEventListener('pointermove', function (e) {
    if (!mdrag) return;
    var dx = e.clientX - mdrag.x;
    if (!mdrag.moved && Math.abs(dx) > 5) { mdrag.moved = true; mdrag.h.classList.add('dragging'); }
    if (mdrag.moved) { mdrag.h.scrollLeft = mdrag.sl - dx; e.preventDefault(); }
  });
  document.addEventListener('pointerup', function () {
    if (!mdrag) return;
    if (mdrag.moved) { eatClick = true; setTimeout(function () { eatClick = false; }, 0); mdrag.h.classList.remove('dragging'); }
    mdrag = null;
  });
  document.addEventListener('click', function (e) { if (eatClick) { e.preventDefault(); e.stopPropagation(); eatClick = false; } }, true);

  /* ---------- Notificaciones ---------- */
  // de una en una: si ya hay una a la vista, la nueva espera y la actual se acorta
  var box = $('#banners'), bq = [];
  function notify(o) {
    var vis = $$('.banner', box).filter(function (x) { return !x._gone; })[0];
    if (vis) {
      bq.push(o);
      if (!vis._down) { clearTimeout(vis._t); vis._t = setTimeout(function () { dismiss(vis); }, Math.max(1200, 2500 - (Date.now() - vis._at))); }
      return null;
    }
    var b = document.createElement('div');
    b.className = 'banner ' + (o.tone || '');
    b.setAttribute('role', 'status');
    b.innerHTML = '<div class="b-ico">' + V.ic(o.ico || 'flag') + '</div><div class="b-main"><div class="b-app"><span>' + L('app') + '</span><span>' +
      (o.persist ? '<span class="b-pin">' + L('pinned') + '</span>' : L('now')) + '</span></div><div class="b-title">' + V.esc(o.title) + '</div>' +
      (o.body ? '<div class="b-body">' + V.esc(o.body) + '</div>' : '') + '</div>';
    b._persist = !!o.persist; b._at = Date.now();
    box.insertBefore(b, box.firstChild);
    var sx = 0, sy = 0, dx = 0, dy = 0, down = false;
    // las fijadas se quedan mientras no haya otra esperando
    function arm() { b._down = false; if (!o.persist || bq.length) b._t = setTimeout(function () { dismiss(b); }, bq.length ? 2500 : o.ms || 5200); }
    b.addEventListener('pointerdown', function (e) { down = true; b._down = true; sx = e.clientX; sy = e.clientY; dx = dy = 0; clearTimeout(b._t); b.classList.add('drag'); try { b.setPointerCapture(e.pointerId); } catch (_) {} });
    b.addEventListener('pointermove', function (e) {
      if (!down) return; dx = e.clientX - sx; dy = Math.min(0, e.clientY - sy);
      b.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)'; b.style.opacity = 1 - Math.min(Math.abs(dx) / 300, .6);
    });
    function up() {
      if (!down) return; down = false; b.classList.remove('drag');
      if (Math.abs(dx) > 80) return dismiss(b, dx > 0 ? 1 : -1);
      if (dy < -35) return dismiss(b);
      b.classList.add('out'); b.style.transform = ''; b.style.opacity = '';
      setTimeout(function () { b.classList.remove('out'); }, 400);
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) { haptic(); if (o.onTap) o.onTap(); dismiss(b); return; }
      arm();
    }
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
    arm();
    return b;
  }
  function dismiss(b, dir) {
    if (!b || b._gone) return; b._gone = true; clearTimeout(b._t);
    b.classList.remove('drag'); b.classList.add('out');
    b.style.transform = dir ? 'translate3d(' + (dir * 120) + '%,0,0)' : 'translate3d(0,-130%,0) scale(.92)';
    b.style.opacity = '0';
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 420);
    if (bq.length) setTimeout(function () { if (bq.length) notify(bq.shift()); }, 320);
  }

  /* ---------- Pestañas ---------- */
  var pages = $$('.page'), tabs = $$('.tab'), ind = $('.tab-ind'), blob = $('.tab-blob'), mem = {};
  function setTab(i, quiet) {
    i = clamp(i, 0, pages.length - 1);
    if (i === state.tab && quiet !== 'force') return;
    var dir = i > state.tab ? 1 : -1;
    mem[state.tab] = window.pageYOffset;
    pages.forEach(function (p) { p.classList.remove('is-active'); });
    pages[i].style.setProperty('--dx', (dir * 22) + 'px');
    pages[i].classList.add('is-active');
    window.scrollTo(0, mem[i] || 0);
    tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    ind.style.setProperty('--i', i);
    if (blob.animate && quiet !== 'force') blob.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.25,.84)', offset: .35 }, { transform: 'scale(.96,1.04)', offset: .7 }, { transform: 'scale(1,1)' }], { duration: 520, easing: 'ease-out' });
    state.tab = i; store.set('tab', i);
    if (i > 0) state.lastDay = i - 1;
    syncSim(); update();
    requestAnimationFrame(function () { hsAll(pages[i]); measure(); if (i === 0) placeBall(); update(); });
    if (quiet !== 'force') haptic();
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { var k = +t.getAttribute('data-tab'); if (k === 0 && state.tab === 0 && grpOpen) { grpBack(); return; } setTab(k); }); });
  function openGroup(k, quiet) {
    var g = document.getElementById('grp-' + k), m = $('#prepMain'); if (!g || !m) return;
    if (!quiet) { if (state.tab !== 0) setTab(0); if (!grpOpen) hubY = window.pageYOffset; }
    $$('.grp.on').forEach(function (x) { x.classList.remove('on'); });
    var was = grpOpen;
    m.classList.add('off'); g.classList.add('on'); grpOpen = k;
    if (!quiet) {
      // el gesto «atrás» del móvil cierra el grupo en vez de salir de la guía; la altura la restauramos nosotros
      try { history.scrollRestoration = 'manual'; } catch (e) {}
      try { if (was && history.state && history.state.sid === SID) history.replaceState({ grp: k, sid: SID }, ''); else history.pushState({ grp: k, sid: SID }, ''); } catch (e) {}
      window.scrollTo(0, 0); haptic();
      if (g.animate && !reduce) g.animate([{ opacity: 0, transform: 'translateX(28px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    requestAnimationFrame(function () { $$('.hscroll', g).forEach(hsUpdate); measure(); });
  }
  function closeGroup() {
    if (!grpOpen) return;
    var g = document.getElementById('grp-' + grpOpen), m = $('#prepMain');
    grpOpen = ''; if (g) g.classList.remove('on'); if (m) m.classList.remove('off');
    var y = hubY;
    window.scrollTo(0, y); haptic();
    // otra vez tras el repintado: Safari puede mover el scroll al cambiar la altura de la página
    requestAnimationFrame(function () { window.scrollTo(0, y); setTimeout(function () { if (Math.abs(window.pageYOffset - y) > 2) window.scrollTo(0, y); try { history.scrollRestoration = 'auto'; } catch (e) {} }, 60); });
    if (m && m.animate && !reduce) m.animate([{ opacity: 0, transform: 'translateX(-22px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    requestAnimationFrame(function () { measure(); placeBall(); });
  }
  function grpBack() { if (history.state && history.state.sid === SID) history.back(); else closeGroup(); }
  window.addEventListener('popstate', function () { if (grpOpen) closeGroup(); });
  // notificaciones que llevan a una parte de Preparar
  function goPrep(k) { if (state.tab !== 0) setTab(0); if (k) openGroup(k); else if (grpOpen) grpBack(); }

  var sw = null, main = $('#pages');
  main.addEventListener('touchstart', function (e) {
    var t = e.touches[0];
    if (e.touches.length !== 1 || t.clientX < 24 || t.clientX > window.innerWidth - 24 || e.target.closest('.hscroll, .steps, .dcar, #rspWrap, .slider, input, .sunarc, .tl-scrub, .nowline')) { sw = null; return; }
    sw = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, { passive: true });
  main.addEventListener('touchend', function (e) {
    if (!sw) return; var t = e.changedTouches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8 && Date.now() - sw.t < 650) setTab(state.tab + (dx < 0 ? 1 : -1));
    sw = null;
  }, { passive: true });

  /* ---------- Clicks ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target, inSheet = !!t.closest('#sheet');
    var vw = t.closest('[data-view]');
    if (vw) { setView(vw.getAttribute('data-view')); haptic(); return; }
    if (view === 'list' && !inSheet && !t.closest('a,button,details,input,select,textarea,label,[data-sheet],[data-time]')) {
      var evx = t.closest('.ev'); if (evx && evx.closest('.tl')) { evx.classList.toggle('open'); requestAnimationFrame(function () { measure(); update(); }); haptic(); return; }
    }
    if (t.closest('[data-gonow]')) { goNow(); return; }
    var ln = t.closest('[data-lang]');
    if (ln) { setLang(ln.getAttribute('data-lang')); return; }
    var hb = t.closest('[data-hs]');
    if (hb) { var hsc = $('.hscroll', hb.parentNode); hsc.scrollBy({ left: +hb.getAttribute('data-hs') * hsc.clientWidth * 0.8, behavior: 'smooth' }); haptic(); return; }
    if (t.closest('[data-sync]')) { setSync(); return; }
    var tm = t.closest('[data-time]');
    if (tm) { setManual(+tm.getAttribute('data-tday'), +tm.getAttribute('data-time'), 'tap'); if (inSheet) closeSheet(); return; }
    var al = t.closest('[data-alts]');
    if (al) { openSheet('alts:' + al.getAttribute('data-alts')); return; }
    var swp = t.closest('[data-swap]');
    if (swp) { var sp = swp.getAttribute('data-swap').split(':'); clearSlot(sp[0]); if (+sp[1] < 0) delete state.custom.swaps[sp[0]]; else state.custom.swaps[sp[0]] = +sp[1]; saveCustom(); doneSheet(); rerender(); notify({ ico: 'refresh', title: L('nSwapped') }); haptic(); return; }
    var aat = t.closest('[data-addat]');
    if (aat) {
      var aq = aat.getAttribute('data-addat').split(':'), adi = +aq[0], aDay = T.days[adi].id, inp = $('#shBody [data-addtime]'), hv = inp ? inp.value : '';
      if (!/^\d\d:\d\d$/.test(hv)) { notify({ ico: 'alert', title: L('pickTime'), ms: 2200 }); return; }
      var tmin = C.hm(hv), arec = { id: aq[1], before: 'END', uid: 'u' + Date.now().toString(36) }, aref = null;
      // se mete delante de lo primero que empieza a esa hora o después; el motor busca el sitio más cercano a esa hora
      plans[adi].ev.forEach(function (e) {
        if (e.skip || e.it.hidden || e.it.t === 'drive') return;
        if (arec.before === 'END' && e.start >= tmin) arec.before = e.it.id;
        if (e.it.lat != null && e.start < tmin) aref = e.it;
      });
      if (aref) { arec.lat = aref.lat; arec.lon = aref.lon; }
      (state.custom.extras[aDay] = state.custom.extras[aDay] || []).push(arec);
      (state.custom.prefAt[aDay] = state.custom.prefAt[aDay] || {})[arec.uid] = hv;
      var befA = {}; plans[adi].ev.forEach(function (e) { if (!e.skip && e.it.at && !e.it.sun) befA[e.it.id] = e.start; });
      saveCustom(); doneSheet(); rerender();
      var movedA = []; plans[adi].ev.forEach(function (e) { if (!e.skip && befA[e.it.id] != null && e.start - befA[e.it.id] > 5) movedA.push(L('movesX', e.it.ti, C.fmt(e.start))); });
      var aev = null, apl = plans[adi]; apl.ev.forEach(function (e) { if (e.it.id === arec.uid) aev = e; });
      var exact = aev && Math.abs(aev.start - tmin) <= 10;
      notify({ ico: 'clock', tone: 'o', title: L('addedAt', aev ? C.fmt(aev.start) : hv),
        body: (exact ? '' : L('addedNearBody', hv) + ' ') + (movedA.length ? movedA.join(' · ') + ' · ' : '') + L('nReplanBody', adi + 1, C.fmt(apl.last), apl.warns.length ? ' · ' + L('nWarnN', apl.warns.length) : L('nAllLight')),
        ms: movedA.length ? 6500 : 4200, onTap: function () { setTab(adi + 1); setTimeout(function () { jump(arec.uid); }, 160); } });
      haptic(); return;
    }
    var prs = t.closest('[data-preset]');
    if (prs) {
      var pq2 = prs.getAttribute('data-preset').split(':'), pdi = +pq2[0], pDid = T.days[pdi].id, cu2 = state.custom;
      if ((cu2.preset[pDid] || 'guia') === pq2[1]) return;
      var handMade = V.dayTouched(plans[pdi], cu2);
      if (handMade && !window.confirm(L('presetAsk'))) return;
      var ps2 = V.presetState(pdi, pq2[1], state.custom, state.skipped);
      state.custom = ps2.cu; state.skipped = ps2.sk; store.set('skipped', state.skipped); saveCustom(); rerender(); refreshSheet(); haptic();
      var pz2 = plans[pdi]; notify({ ico: 'route', tone: 'o', title: L('presetDone'), body: L('nReplanBody', pdi + 1, C.fmt(pz2.last), pz2.warns.length ? ' · ' + L('nWarnN', pz2.warns.length) : L('nAllLight')), ms: 3600 });
      return;
    }
    var hmk = t.closest('[data-holemk]');
    if (hmk) {
      var hq = hmk.getAttribute('data-holemk').split(':'), hDay = T.days[+hq[0]].id;
      state.skipped[hq[1]] = 1; store.set('skipped', state.skipped);
      (state.custom.gaps[hDay] = state.custom.gaps[hDay] || {})[hq[1]] = 1; saveCustom(); rerender(); refreshSheet();
      notify({ ico: 'clock', tone: 'o', title: L('nHole'), body: L('nHoleBody'), ms: 3600 }); haptic(); return;
    }
    var hcl = t.closest('[data-holeclose]');
    if (hcl) {
      var hc = hcl.getAttribute('data-holeclose').split(':'), hcDay = T.days[+hc[0]].id;
      if (state.custom.gaps[hcDay]) delete state.custom.gaps[hcDay][hc[1]]; saveCustom(); rerender();
      var pz = plans[+hc[0]];
      notify({ ico: 'next', title: L('nHoleClosed'), body: L('nReplanBody', +hc[0] + 1, C.fmt(pz.last), pz.warns.length ? ' · ' + L('nWarnN', pz.warns.length) : L('nAllLight')) }); haptic(); return;
    }
    var rpl = t.closest('[data-replace]');
    if (rpl) {
      var rp = rpl.getAttribute('data-replace').split(':'), rDay = T.days[+rp[0]].id, rList = (state.custom.extras[rDay] = state.custom.extras[rDay] || []);
      // cambiar algo que ya era un reemplazo: se cambia el sitio y se queda en el mismo hueco
      // cambiar algo que ya era un reemplazo (por su uid o por la original que sustituye): mismo hueco, otro sitio
      var rec = rList.filter(function (x) { return x.uid === rp[1] || (x.rep && x.before === rp[1]); })[0];
      if (rec) {
        rec.id = rp[2]; delete rec.d;
        var bo = T.days[+rp[0]].items.filter(function (x) { return x.id === rec.before; })[0];
        if (bo && /^g-/.test(rp[2]) && bo.t === 'food') rec.d = bo.d;
        if (bo) { rec.lat = bo.lat; rec.lon = bo.lon; }
        var gm1 = /^g-(\w+)-(\d+)$/.exec(rp[2]), gd1 = gm1 && T.days.filter(function (d) { return d.id === gm1[1]; })[0], gl1 = gd1 && (gd1.guide || [])[+gm1[2]] && V.gLoc(gd1.guide[+gm1[2]], gd1);
        if (gl1 && !gl1.approx) { rec.lat = gl1.lat; rec.lon = gl1.lon; }
      }
      else {
        state.skipped[rp[1]] = 1; store.set('skipped', state.skipped);
        rec = { id: rp[2], before: rp[1], uid: 'u' + Date.now().toString(36), rep: 1 };
        var bi = T.days[+rp[0]].items.filter(function (x) { return x.id === rp[1]; })[0], be = null;
        plans[+rp[0]].ev.forEach(function (e) { if (e.it.id === rp[1]) be = e; });
        if (bi) { rec.lat = bi.lat; rec.lon = bi.lon; if (/^g-/.test(rp[2]) && bi.t === 'food') rec.d = bi.d; }
        var gm0 = /^g-(\w+)-(\d+)$/.exec(rp[2]), gd0 = gm0 && T.days.filter(function (d) { return d.id === gm0[1]; })[0], gl0 = gd0 && (gd0.guide || [])[+gm0[2]] && V.gLoc(gd0.guide[+gm0[2]], gd0);
        if (gl0 && !gl0.approx) { rec.lat = gl0.lat; rec.lon = gl0.lon; }
        if (bi && bi.t === 'food' && be) rec.meal = be.start < 660 ? 'b' : be.start < 990 ? 'l' : 'd';
        if (bi && bi.sun) {
          rec.sunAt = 1;
          // si lo nuevo no es para el atardecer, va justo antes de lo que seguía a la puesta de sol en el plan
          var evs0 = plans[+rp[0]].ev, k0 = -1; evs0.forEach(function (e, kk) { if (e.it.id === rp[1]) k0 = kk; });
          for (var q0 = k0 + 1; k0 >= 0 && q0 < evs0.length; q0++) { var z0 = evs0[q0]; if (!z0.skip && !z0.it.hidden && z0.it.t !== 'drive' && !z0.it.extra) { rec.pos = z0.it.id; break; } }
        }
        rList.push(rec);
      }
      if (state.custom.gaps[rDay]) delete state.custom.gaps[rDay][rec.before];
      saveCustom(); doneSheet(); rerender(); notify({ ico: 'refresh', tone: 'o', title: L('nReplaced'), body: L('addedBody'), onTap: function () { setTab(+rp[0] + 1); setTimeout(function () { jump(rec.uid); }, 160); } }); haptic(); return;
    }
    var gq = t.closest('[data-grp]');
    if (gq) { openGroup(gq.getAttribute('data-grp')); return; }
    if (t.closest('[data-grpback]')) { grpBack(); return; }
    var afb = t.closest('[data-afilter]'), afc = t.closest('[data-afclear]');
    if (afb || afc) {
      if (afb) { afb.classList.toggle('on'); afb.setAttribute('aria-pressed', afb.classList.contains('on') ? 'true' : 'false'); }
      else $$('#shBody [data-afilter].on').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      var act = $$('#shBody [data-afilter].on').map(function (x) { return x.getAttribute('data-afilter'); });
      var its = $$('#shBody .alt-it'), nv = 0;
      its.forEach(function (x) {
        var tg = (x.getAttribute('data-tags') || '').split(' '), ok = act.every(function (k) { return tg.indexOf(k) >= 0; }), was = !x.classList.contains('hid');
        x.classList.toggle('hid', !ok);
        if (ok) { nv++; if (!was && x.animate && !reduce) x.animate([{ opacity: 0, transform: 'translateY(10px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: Math.min(nv, 6) * 30, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); }
      });
      var cn = $('#shBody .af-count'); if (cn) cn.textContent = act.length ? L('afCount', nv, its.length) : '';
      var em = $('#shBody .af-empty'); if (em) em.style.display = nv ? 'none' : '';
      haptic(); return;
    }
    var xs = t.closest('[data-extras]');
    if (xs) { var xa = xs.getAttribute('data-extras').split(':'); openSheet('extras:' + xa.join(':')); return; }
    var spk = t.closest('[data-sunpick]');
    if (spk) {
      var sk = spk.getAttribute('data-sunpick').split(':'), sDay = T.days[+sk[0]].id, sp0 = (state.custom.sunPos[sDay] = state.custom.sunPos[sDay] || {});
      if (sk[2] === 'auto') delete sp0[sk[1]]; else sp0[sk[1]] = sk[2];
      saveCustom(); doneSheet(); rerender();
      var sev = null; plans[+sk[0]].ev.forEach(function (e) { if (e.it.id === sk[1]) sev = e; });
      notify({ ico: 'sunset', tone: 'o', title: L('nPicked'), body: sev ? sev.it.ti + ' · ' + C.fmt(sev.start) + '–' + C.fmt(sev.end) : '', ms: 3200, onTap: function () { setTab(+sk[0] + 1); setTimeout(function () { jump(sk[1]); }, 160); } });
      haptic(); return;
    }
    var fxo = t.closest('[data-fixorder]');
    if (fxo) {
      var fdi = +fxo.getAttribute('data-fixorder'), fp = plans[fdi];
      if (fp && fp.fix) { var fDay = T.days[fdi].id; state.custom.order[fDay] = fp.fix.order; (fp.fix.clearPref || []).forEach(function (id) { if (state.custom.prefAt[fDay]) delete state.custom.prefAt[fDay][id]; }); saveCustom(); rerender(); notify({ ico: 'route', tone: 'o', title: L('nFixed'), body: L('nReplanBody', fdi + 1, C.fmt(plans[fdi].last), plans[fdi].warns.length ? ' · ' + L('nWarnN', plans[fdi].warns.length) : L('nAllLight')), ms: 3000 }); haptic(); }
      return;
    }
    var pfa = t.closest('[data-prefat]');
    if (pfa) {
      var pq = pfa.getAttribute('data-prefat').split(':'), pDay = T.days[+pq[0]].id;
      (state.custom.prefAt[pDay] = state.custom.prefAt[pDay] || {})[pq[1]] = pq[2] + ':' + pq[3];
      saveCustom(); doneSheet(); rerender();
      var pev = null; plans[+pq[0]].ev.forEach(function (e) { if (e.it.id === pq[1]) pev = e; });
      if (pev && Math.abs(pev.start - C.hm(pq[2] + ':' + pq[3])) > 20) {
        delete state.custom.prefAt[pDay][pq[1]]; saveCustom(); rerender();
        notify({ ico: 'people', tone: 'o', title: L('crNotFit', pq[2] + ':' + pq[3]), body: L('crNotFitBody'), ms: 4200 }); haptic(); return;
      }
      notify({ ico: 'people', tone: 'o', title: L('crMoved'), body: pev ? pev.it.ti + ' · ' + C.fmt(pev.start) + '–' + C.fmt(pev.end) : '', ms: 3200, onTap: function () { setTab(+pq[0] + 1); setTimeout(function () { jump(pq[1]); }, 160); } });
      haptic(); return;
    }
    var pfc = t.closest('[data-prefclear]');
    if (pfc) { var pc0 = pfc.getAttribute('data-prefclear').split(':'), cDay = T.days[+pc0[0]].id; if (state.custom.prefAt[cDay]) delete state.custom.prefAt[cDay][pc0[1]]; saveCustom(); rerender(); refreshSheet(); haptic(); return; }
    var ag = t.closest('[data-addg]');
    if (ag) {
      var gp = ag.getAttribute('data-addg').split(':'), gdi = +gp[0], gDay = T.days[gdi].id, ref = null;
      plans[gdi].ev.forEach(function (e) { if (e.it.lat != null && e.it.t !== 'drive' && (gp[2] === 'END' ? !e.skip : e.it.id === gp[2])) ref = e.it; });
      var grec = { id: gp[1], before: gp[2], uid: 'u' + Date.now().toString(36) };
      if (gp[3] === 'sun') grec.sunAt = 1;
      if (ref) { grec.lat = ref.lat; grec.lon = ref.lon; }
      (state.custom.extras[gDay] = state.custom.extras[gDay] || []).push(grec);
      saveCustom(); doneSheet(); rerender();
      var gev = null; plans[gdi].ev.forEach(function (e) { if (e.it.id === grec.uid) gev = e; });
      notify({ ico: 'next', tone: 'o', title: L('addedTo', gdi + 1) + (gev ? ' · ' + C.fmt(gev.start) + '–' + C.fmt(gev.end) : ''), body: L('addedBody'), ms: 3600, onTap: function () { setTab(gdi + 1); setTimeout(function () { jump(grec.uid); }, 160); } });
      haptic(); return;
    }
    var ax = t.closest('[data-addx]');
    if (ax) {
      var xp = ax.getAttribute('data-addx').split(':'), dId = T.days[+xp[0]].id;
      (state.custom.extras[dId] = state.custom.extras[dId] || []).push({ id: xp[1], before: xp[2], uid: 'u' + Date.now().toString(36) });
      saveCustom(); if (!/^edit:/.test(sheetSpec)) closeSheet(); rerender(); refreshSheet(); notify({ ico: 'next', tone: 'o', title: L('nAdded'), ms: 2200 }); haptic(); return;
    }
    var dx = t.closest('[data-delx]');
    if (dx) { var dp = dx.getAttribute('data-delx').split(':'), dI = T.days[+dp[0]].id;
      // quitar un reemplazo deja el hueco libre (no vuelve la original)
      var holeOf = null, hev = null; (state.custom.extras[dI] || []).forEach(function (x) { if (x.uid === dp[1] && x.rep) holeOf = x.before; });
      plans[+dp[0]].ev.forEach(function (e) { if (e.it.id === dp[1]) hev = e; });
      if (holeOf) (state.custom.gaps[dI] = state.custom.gaps[dI] || {})[holeOf] = hev ? { d: hev.it.d, lat: hev.it.lat, lon: hev.it.lon } : 1;
      var odx = state.custom.order[dI]; if (holeOf && odx && odx.indexOf(dp[1]) >= 0) odx[odx.indexOf(dp[1])] = holeOf;
      state.custom.extras[dI] = (state.custom.extras[dI] || []).filter(function (x) { return x.uid !== dp[1]; }); saveCustom(); rerender(); refreshSheet();
      notify(holeOf ? { ico: 'clock', tone: 'o', title: L('nHole'), body: L('nHoleBody'), ms: 3600 } : { ico: 'x', title: L('nRemoved'), ms: 2200 }); haptic(); return; }
    var rsd = t.closest('[data-resetday]');
    if (rsd) {
      var rdi = +rsd.getAttribute('data-resetday'), rr0 = V.curRoute(T.days[rdi], state.custom);
      if (!window.confirm(rr0 ? L('resetRouteAsk', V.routeName(rr0)) : L('resetAsk', rdi + 1))) return;
      var ps3 = V.presetState(rdi, rr0 ? rr0.id : 'guia', state.custom, state.skipped);
      state.custom = ps3.cu; state.skipped = ps3.sk; store.set('skipped', state.skipped);
      saveCustom(); rerender(); refreshSheet(); notify({ ico: 'undo', title: rr0 ? L('nRouteReset', V.routeName(rr0)) : L('nDayReset'), ms: 2200 }); haptic(); return;
    }
    if (t.closest('[data-ics]')) { downloadIcs(); return; }
    if (t.closest('[data-kml]')) { downloadKml(); return; }
    var bpk = t.closest('[data-bpick]');
    if (bpk) {
      var bq = bpk.getAttribute('data-bpick').split(':'), bdi = +bq[0], bit = null;
      plans[bdi].live.forEach(function (e) { if (e.it.id === bq[1]) bit = e.it; });
      if (bit) { state.blist.push({ id: 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), di: bdi, n: bit.ti, a: +bq[2] || 0, c: bq[3], src: bit.id }); store.set('blist', state.blist); refreshBudget(); refreshSheet(); haptic(); }
      return;
    }
    if (t.closest('[data-bpickall]')) {
      var hv = {}; state.blist.forEach(function (x) { if (x.src) hv[x.src] = 1; });
      plans.forEach(function (pp, di) { pp.live.forEach(function (e) { var c = e.it.cost; if (c && !hv[e.it.id] && e.it.t !== 'drive') state.blist.push({ id: 'b' + Math.random().toString(36).slice(2, 9), di: di, n: e.it.ti, a: c.v, c: c.t, src: e.it.id }); }); });
      store.set('blist', state.blist); refreshBudget(); refreshSheet(); notify({ ico: 'card', tone: 'o', title: L('nBAdded'), ms: 2200 }); haptic(); return;
    }
    if (t.closest('[data-bnew]')) {
      var nn = ($('#bnN').value || '').trim(), na = parseFloat(String($('#bnA').value || '').replace(',', '.'));
      if (!nn || !(na > 0)) { notify({ ico: 'card', tone: 'o', title: L('bNoName'), ms: 2200 }); return; }
      state.blist.push({ id: 'b' + Date.now().toString(36), di: +$('#bnD').value, n: nn.slice(0, 60), a: Math.round(na * 100) / 100, c: ($('.expcat.on') || { getAttribute: function () { return 'other'; } }).getAttribute('data-cat') });
      var bLast = state.blist[state.blist.length - 1];
      store.set('blist', state.blist); closeSheet(); refreshBudget(); notify({ ico: bLast.c === 'fuel' ? 'fuel' : 'card', tone: 'o', title: L('nBAdded'), body: bLast.n + ' · ' + V.cur() + bLast.a.toFixed(2), ms: 2600 }); haptic(); return;
    }
    if (t.closest('[data-album]')) { openAlbum(); return; }
    var abt = t.closest('[data-albtab]');
    if (abt) { albumTab(abt.getAttribute('data-albtab')); haptic(); return; }
    var crb = t.closest('[data-cromo]');
    if (crb) { toggleCromo(crb.getAttribute('data-cromo')); return; }
    var bpy = t.closest('[data-bpay]');
    if (bpy) { var pid = bpy.getAttribute('data-bpay'); state.blist.forEach(function (x) { if (x.id === pid) x.by = x.by ? 0 : 1; }); store.set('blist', state.blist); refreshBudget(); haptic(); return; }
    var dop = t.closest('[data-docopen]');
    if (dop) { openDoc(dop.getAttribute('data-docopen')); return; }
    var ddl = t.closest('[data-docdel]');
    if (ddl) { if (confirm(L('docDelQ'))) DB.del(ddl.getAttribute('data-docdel')).then(docsRefresh); return; }
    if (t.closest('[data-bkexp]')) { backupExport(); return; }
    if (t.closest('[data-icsall]')) { downloadIcsAll(); return; }
    var bdl = t.closest('[data-bdel]');
    if (bdl) { var bid = bdl.getAttribute('data-bdel'); state.blist = state.blist.filter(function (x) { return x.id !== bid; }); store.set('blist', state.blist); refreshBudget(); haptic(); return; }
    var ec = t.closest('.expcat');
    if (ec) { $$('.expcat', ec.parentNode).forEach(function (b) { b.classList.toggle('on', b === ec); }); haptic(); return; }
    var gt = t.closest('[data-goto]');
    if (gt) { var a = gt.getAttribute('data-goto').split(':'); if (inSheet) closeSheet(); setTab(+a[0]); setTimeout(function () { jump(a[1]); }, 160); return; }
    var shx = t.closest('[data-sheet]');
    if (shx && !t.closest('a[target]')) {
      e.preventDefault(); var spx = shx.getAttribute('data-sheet');
      // repostaje desde el presupuesto: propone el día de hoy si estáis de viaje
      if (spx === 'bnew:fuel' && state.liveDay >= 0) spx += ':' + state.liveDay;
      openSheet(spx); if (/^bnew:/.test(spx) && $('#bnA')) setTimeout(function () { try { $('#bnA').focus({ preventScroll: true }); } catch (x) {} }, 380);
      return;
    }
    var go = t.closest('[data-go]');
    if (go) { setTab(+go.getAttribute('data-go')); return; }
    var j = t.closest('[data-jump]');
    if (j) { e.preventDefault(); jump(j.getAttribute('data-jump')); return; }
    var gf = t.closest('[data-gf]');
    if (gf) {
      var row = gf.parentNode, g = $('.hscroll', row.nextElementSibling), k = gf.getAttribute('data-gf');
      $$('.gf', row).forEach(function (b) { b.classList.toggle('on', b === gf); });
      g.scrollLeft = 0;
      $$('.gtile', g).forEach(function (x) { x.style.display = k === 'all' || x.getAttribute('data-k') === k ? '' : 'none'; });
      hsUpdate(g); haptic();
      if (!reduce) $$('.gtile', g).filter(function (x) { return k === 'all' || x.getAttribute('data-k') === k; }).slice(0, 4).forEach(function (x, n) {
        if (x.animate) x.animate([{ opacity: 0, transform: 'translateX(14px) scale(.97,.93)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: n * 40, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      });
      return;
    }
    var rtb = t.closest('[data-rtabbtn]');
    if (rtb) { var tabs = rtb.closest('.rt-tabs'); if (tabs) { tabs.setAttribute('data-rtab', rtb.getAttribute('data-rtabbtn')); shBody.scrollTop = 0; } haptic(); return; }
    var rsn = t.closest('[data-rsnav]');
    if (rsn) { rsGo(+rsn.getAttribute('data-rsnav')); haptic(); return; }
    var rs = t.closest('[data-rs]');
    if (rs) { pickStop(rs); return; }
    if (t.closest('#wxRefresh')) { fetchWx(true); return; }
    var sk = t.closest('[data-skip]');
    if (sk) { toggleSkip(sk.getAttribute('data-skip')); refreshSheet(); return; }
    var rck = t.closest('[data-resetchk]');
    if (rck) {
      var wh = rck.getAttribute('data-resetchk');
      T.checklist.forEach(function (c) { if ((c.when || 'out') === wh) c.items.forEach(function (i) { delete state.checked[i.id]; var b = $('.chk input[data-id="' + i.id + '"]'); if (b) b.checked = false; }); });
      store.set('checked', state.checked); rings(); haptic(); notify({ ico: 'undo', title: L('nReset') }); return;
    }
    // alojamiento: ubicar en el mapa (enlace de Google Maps con coordenadas, o búsqueda en OpenStreetMap si hay conexión)
    // «Guardar» del alojamiento: recoge todos los campos de la tarjeta, lo aplica al plan y lo confirma
    var ssv = t.closest('[data-staysave]');
    if (ssv) {
      var sid = ssv.getAttribute('data-staysave'), scard = ssv.closest('.stay-c'), hz3 = (state.custom.hotels[sid] = state.custom.hotels[sid] || {}), nm0 = hz3.name;
      $$('[data-stay]', scard).forEach(function (inp) { var k3 = inp.getAttribute('data-stay').split('.')[1]; if (k3 === 'bf') hz3.bf = inp.checked; else hz3[k3] = inp.value.trim(); });
      if (hz3.name !== nm0) ['lat', 'lon', 'img', 'imgCredit', 'imgPage', 'noImg', 'osm', 'web'].forEach(function (k4) { delete hz3[k4]; });
      var cc3 = coordsIn(hz3.addr || ''); if (cc3) { hz3.lat = cc3[0]; hz3.lon = cc3[1]; }
      var zz = (T.stays || []).filter(function (x) { return x.id === sid; })[0] || {};
      if (!hz3.name && !hz3.addr && !hz3.arr) delete state.custom.hotels[sid]; else hz3.savedAt = nowHM();
      clearTimeout(stayT); saveCustom(); rerender(); haptic();
      var sdi3 = T.days.map(function (d) { return d.id; }).indexOf(sid), pz3 = plans[sdi3];
      notify({ ico: 'check', tone: 'o', title: L('stSaved', hz3.name || zz.town || ''), body: (hz3.arr ? L('stArrSet', hz3.arr) + ' · ' : '') + (pz3 ? L('nReplanBody', sdi3 + 1, C.fmt(pz3.last), pz3.warns.length ? ' · ' + L('nWarnN', pz3.warns.length) : L('nAllLight')) : ''), ms: 3800 });
      if (hz3.name && hz3.lat == null) stayLocate(sid, true);
      return;
    }
    // «Guardar» del vuelo
    var fsv = t.closest('[data-flsave]');
    if (fsv) {
      var fk = fsv.getAttribute('data-flsave'), frow = fsv.closest('.flr'), fd0 = $('[data-fl="' + fk + '.date"]', frow), ft0 = $('[data-fl="' + fk + '.time"]', frow);
      state.flights[fk] = state.flights[fk] || {};
      state.flights[fk].date = fd0 ? fd0.value : ''; state.flights[fk].time = ft0 ? ft0.value : ''; state.flights[fk].savedAt = nowHM();
      store.set('flights', state.flights); flUpdate(); hubRefresh(); haptic(); svMark(frow, 'ok', state.flights[fk].savedAt);
      var ok3 = state.flights[fk].date && state.flights[fk].time;
      notify({ ico: ok3 ? 'check' : 'alert', tone: ok3 ? 'o' : '', title: ok3 ? L(fk === 'out' ? 'flSavedOut' : 'flSavedBack') : L('flMissing'), ms: 2600 });
      return;
    }
    var sloc = t.closest('[data-stayloc]');
    if (sloc) { stayLocate(sloc.getAttribute('data-stayloc')); return; }
    var sdel = t.closest('[data-staydel]');
    if (sdel) { delete state.custom.hotels[sdel.getAttribute('data-staydel')]; saveCustom(); rerender(); haptic(); notify({ ico: 'x', title: L('stDeleted'), ms: 2200 }); return; }
    if (t.closest('[data-shclose]')) { closeSheet(); return; }
    if (t.closest('[data-shback]')) { sheetBack(); haptic(); return; }
    var sum = t.closest('details.more > summary');
    if (sum) { e.preventDefault(); toggleDetails(sum.parentNode); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (sheetEl.classList.contains('on')) closeSheet(); else if (state.open) closeIsland(); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-go],[data-sheet],[data-time]') && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') { e.preventDefault(); e.target.click(); }
  });

  function toggleDetails(det) {
    var body = $('.more-body', det); haptic();
    if (!body.animate) { det.open = !det.open; return; }
    if (det.open) {
      var a = body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' });
      a.onfinish = function () { det.open = false; measure(); update(); };
    } else {
      det.open = true;
      body.animate([{ height: '0px', opacity: 0 }, { height: body.offsetHeight + 'px', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = function () { measure(); update(); };
      var h = $('.hscroll', body);
      if (h) {
        hsUpdate(h);
        $$('.rec', h).forEach(function (r, k) { if (r.animate && !reduce) r.animate([{ opacity: 0, transform: 'translateX(16px) scale(.97,.92)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: k * 40, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); });
      }
    }
  }

  /* ---------- Hoja de detalle (estilo iOS): se abre desde abajo y se cierra deslizando ---------- */
  var sheetEl = $('#sheet'), shBody = $('#shBody'), shScrim = $('#shScrim'), shBk = $('#shBk');
  var sheetSpec = '', sheetStack = [];
  // «Atrás»: hojas abiertas desde otra hoja (p. ej. Editar día → Cambiar)
  function sheetBack() { var prev = sheetStack.pop(); if (prev) openSheet(prev, true); else closeSheet(); }
  // tras elegir algo: si se vino de otra hoja, se vuelve a ella ya actualizada (los selectores intermedios se saltan)
  function doneSheet() {
    if (!sheetStack.length) { closeSheet(); return; }
    var prev = sheetStack.pop();
    while (/^(addday|addto):/.test(prev) && sheetStack.length) prev = sheetStack.pop();
    setTimeout(function () { openSheet(prev, true); }, 0);
  }
  function refreshSheet() {
    if (!sheetEl.classList.contains('on') || !sheetSpec || sheetSpec === 'album') return;
    var p = sheetSpec.split(':'), y = shBody.scrollTop, html = V.sheet(p[0], p[1], p[2], plans, state.custom, p[3], p[4]);
    if (html) { shBody.innerHTML = html; shBody.scrollTop = y; sheetEl.classList.toggle('tall', !!shBody.querySelector('.af-row')); } else closeSheet();
  }
  function openSheet(spec, isBack) {
    var p = spec.split(':'), html = V.sheet(p[0], p[1], p[2], plans, state.custom, p[3], p[4]);
    if (!html) return;
    if (!isBack && sheetSpec && sheetSpec !== spec && sheetEl.classList.contains('on')) sheetStack.push(sheetSpec);
    sheetSpec = spec;
    if (shBk) { shBk.hidden = !sheetStack.length; $('span', shBk).textContent = L('backBtn'); shBk.setAttribute('aria-label', L('backBtn')); }
    shBody.innerHTML = html; shBody.scrollTop = 0; sheetEl.classList.toggle('tall', !!shBody.querySelector('.af-row'));
    sheetEl.style.transform = ''; sheetEl.classList.add('on'); shScrim.classList.add('on'); sheetEl.setAttribute('aria-hidden', 'false');
    haptic();
  }
  function closeSheet() { sheetSpec = ''; sheetStack = []; if (shBk) shBk.hidden = true; sheetEl.classList.remove('on'); shScrim.classList.remove('on'); sheetEl.setAttribute('aria-hidden', 'true'); sheetEl.style.transform = ''; }
  shScrim.addEventListener('click', closeSheet);
  (function () {
    var sy = 0, dy = 0, down = false;
    sheetEl.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button, .hscroll, input, select, textarea, label, .ed-row')) return;
      if (shBody.scrollTop > 0 && !e.target.closest('.sh-grab')) return;
      down = true; sy = e.clientY; dy = 0; sheetEl.classList.add('drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return; dy = Math.max(0, e.clientY - sy);
      if (dy > 4) sheetEl.style.transform = 'translateY(' + dy + 'px) scale(' + (1 - Math.min(dy, 300) / 3000) + ')';
    });
    window.addEventListener('pointerup', function () {
      if (!down) return; down = false; sheetEl.classList.remove('drag');
      if (dy > 110) closeSheet(); else sheetEl.style.transform = '';
    });
  })();

  /* ---------- La ruta: lupa que agranda el punto central; se desliza como un slider ---------- */
  var stepCur = null, stepTimer = 0;
  function magnify() {
    var steps = $('#steps'); if (!steps || !steps.offsetParent) return null;
    var half = steps.clientWidth / 2, best = null, bd = 1e9, bs = $$('.st', steps), ps = [];
    bs.forEach(function (b) {
      var d = b.offsetLeft + b.offsetWidth / 2 - steps.scrollLeft - half, ad = Math.abs(d), m = Math.max(0, 1 - ad / 130);
      m = m * m * (3 - 2 * m);
      b.style.setProperty('--m', m.toFixed(3));
      var pu = (d > 0 ? 1 : -1) * 20 * Math.min(1, ad / 80); ps.push(pu);
      b.style.setProperty('--push', pu.toFixed(1) + 'px');
      if (ad < bd) { bd = ad; best = b; }
    });
    // cada tramo de línea llega hasta el punto siguiente desplazado: sin huecos alrededor de la bola
    bs.forEach(function (b, k) { b.style.setProperty('--pn', (k + 1 < ps.length ? ps[k + 1] : 0).toFixed(1) + 'px'); });
    return best;
  }
  function centerOn(btn, smooth) {
    var steps = btn.parentNode, left = btn.offsetLeft + btn.offsetWidth / 2 - steps.clientWidth / 2;
    if (smooth && steps.scrollTo) steps.scrollTo({ left: left, behavior: 'smooth' }); else steps.scrollLeft = left;
  }
  function placeBall() {
    var on = $('#steps .st.on'), ball = $('.st-ball'); if (!on || !on.offsetParent) return;
    centerOn(on, false); magnify(); bb.last = $('#steps').scrollLeft;
    var dot = $('i', on), steps = $('#steps');
    if (ball && dot) ball.style.top = (steps.offsetTop + on.offsetTop + dot.offsetTop + dot.offsetHeight / 2 - ball.offsetHeight / 2).toFixed(1) + 'px';
  }
  // bola de la ruta: al viajar se encoge a una pastilla casi del grosor de la línea y se queda un poco atrás;
  // al llegar da un tirón hacia delante (frenada) y vuelve a crecer con un pequeño rebote
  var bb = { x: 0, vx: 0, v: 0, pv: 0, d: 0, z: 1, vz: 0, last: null, t: 0, raf: 0 }, BMX = 11, BMIN = 0.3;
  function tanh(z) { var e = Math.exp(2 * z); return (e - 1) / (e + 1); }
  function ballKick() { if (!bb.raf && !reduce) bb.raf = requestAnimationFrame(ballStep); }
  function ballStep(now) {
    bb.raf = 0;
    var steps = $('#steps'), el = $('.st-ball'); if (!steps || !el) return;
    var sl = steps.scrollLeft, dt = bb.t ? Math.max(0.5, Math.min(2.5, (now - bb.t) / 16.667)) : 1;
    bb.t = now; if (bb.last == null) bb.last = sl;
    var raw = Math.max(-60, Math.min(60, (sl - bb.last) / dt)); bb.last = sl;
    for (var n = Math.max(1, Math.round(dt)), k = 0; k < n; k++) {
      bb.v = bb.v * 0.5 + raw * 0.5;
      var sp = Math.abs(bb.v);
      if (sp > 1) bb.d = bb.v > 0 ? 1 : -1;
      bb.pv = Math.max(bb.pv, sp);
      // posición: se retrasa con la velocidad; impulso hacia delante al frenar
      var tx = -BMX * tanh(bb.v * 0.4 / BMX);
      if (bb.pv > 2.5 && sp < 1.2) { bb.vx += bb.d * Math.min(BMX, 2.5 + bb.pv * 0.3) * 0.5; bb.pv = 0; }
      bb.vx += (tx - bb.x) * 0.11 - bb.vx * 0.2;
      bb.x += bb.vx;
      // tamaño: encoge rápido al arrancar, crece con rebote al parar
      var f = Math.max(0, Math.min(1, (sp - 0.6) / 2.4)); f = f * f * (3 - 2 * f);
      var zt = 1 - f * (1 - BMIN), shrink = zt < bb.z;
      bb.vz += (zt - bb.z) * (shrink ? 0.34 : 0.15) - bb.vz * (shrink ? 0.5 : 0.24);
      bb.z = Math.max(BMIN * 0.8, bb.z + bb.vz);
    }
    var xd = BMX * 1.3 * tanh(bb.x / (BMX * 1.3)), spd = Math.abs(bb.v);
    var e = Math.max(0, Math.min(1, (1 - bb.z) / (1 - BMIN)));           // 1 = pastilla en la línea
    var q = Math.max(0, Math.min(1, xd * bb.d / 9)) * (1 - Math.min(spd / 4, 1)) * (1 - e);   // aplastado de la frenada
    var sx = bb.z * (1 + 1.25 * e) * (1 - 0.24 * q), sy = bb.z * (1 + 0.18 * q);
    el.style.transform = 'translateX(' + xd.toFixed(2) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
    steps.style.setProperty('--bz', (1 - e).toFixed(3));
    if (spd > 0.03 || Math.abs(bb.x) > 0.05 || Math.abs(bb.vx) > 0.03 || Math.abs(1 - bb.z) > 0.004 || Math.abs(bb.vz) > 0.003) ballKick();
    else { bb.t = 0; bb.x = bb.vx = bb.v = bb.vz = 0; bb.z = 1; el.style.transform = ''; steps.style.setProperty('--bz', '1'); }
  }
  function selectStop(btn) {
    var steps = btn.parentNode, wrap = $('#rspWrap'), prev = $('.st.on', steps);
    if (prev === btn) return;
    var k = btn.getAttribute('data-rs'), h0 = wrap.offsetHeight, dir = prev && +prev.getAttribute('data-rs') > +k ? -1 : 1;
    $$('.st', steps).forEach(function (b) { var on = b === btn; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    $$('.rsp', wrap).forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-rsp') === k); });
    var h1 = wrap.offsetHeight, panel = $('.rsp.on', wrap);
    if (wrap.animate && !reduce) {
      wrap.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      panel.animate([{ opacity: 0, transform: 'translateX(' + dir * 18 + 'px) scale(.985,.96)' }, { opacity: 1, transform: 'none' }], { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    setTimeout(measure, 450);
  }
  function pickStop(btn) {
    if (btn.classList.contains('on')) { var b0 = $('.st-ball'); if (b0 && b0.animate && !reduce) b0.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.28,.78)', offset: .3 }, { transform: 'scale(.9,1.1)', offset: .65 }, { transform: 'scale(1)' }], { duration: 440, easing: 'ease-out' }); return; }
    centerOn(btn, true); haptic();
  }
  document.addEventListener('scroll', function (e) {
    if (e.target.id !== 'steps') return;
    ballKick();
    requestAnimationFrame(function () {
      var best = magnify(); if (!best) return;
      if (best !== stepCur) { stepCur = best; $$('#steps .st').forEach(function (b) { b.classList.toggle('near', b === best); }); haptic(); }
      clearTimeout(stepTimer); stepTimer = setTimeout(function () { selectStop(best); }, 130);
    });
  }, { capture: true, passive: true });

  /* ---------- Reordenar: mantén pulsada una actividad y arrástrala dentro de su tramo ---------- */
  var rd = null, lp = null, lpTimer = 0;
  function rdStart(ev, y) {
    var tl = ev.closest('.tl');
    var sibs = $$('.ev[data-drag]', tl);
    if (sibs.length < 2) return false;
    rd = { ev: ev, tl: tl, di: +tl.getAttribute('data-tl'), y0: y, sy0: window.pageYOffset, sibs: sibs, idx: sibs.indexOf(ev), h: ev.offsetHeight, tops: sibs.map(function (x) { return x.offsetTop; }), target: sibs.indexOf(ev) };
    rd.target = rd.idx;
    ev.classList.add('lifted'); document.documentElement.classList.add('reordering'); haptic();
    return true;
  }
  function rdMove(y) {
    rd.y = y;
    var dy = y - rd.y0 + (window.pageYOffset - rd.sy0), center = rd.tops[rd.idx] + rd.h / 2 + dy, t = rd.idx;
    rd.ev.style.transform = 'translateY(' + dy.toFixed(1) + 'px) scale(1.03)';
    rd.sibs.forEach(function (x, k) { var mid = rd.tops[k] + x.offsetHeight / 2; if (k < rd.idx && center < mid) t = Math.min(t, k); if (k > rd.idx && center > mid) t = Math.max(t, k); });
    if (t !== rd.target) haptic();
    rd.target = t;
    rd.sibs.forEach(function (x, k) {
      if (x === rd.ev) return;
      var sh = rd.idx < t && k > rd.idx && k <= t ? -rd.h : rd.idx > t && k >= t && k < rd.idx ? rd.h : 0;
      x.style.transform = sh ? 'translateY(' + sh + 'px)' : '';
    });
  }
  function rdLoop() {
    if (!rd) return;
    var H = window.innerHeight, v = rd.y < 140 ? -10 : rd.y > H - 160 ? 10 : 0;
    if (v && rd.y != null) { window.scrollBy(0, v); rdMove(rd.y); }
    requestAnimationFrame(rdLoop);
  }
  function rdEnd() {
    var r = rd; rd = null; document.documentElement.classList.remove('reordering');
    r.sibs.forEach(function (x) { x.style.transform = ''; }); r.ev.classList.remove('lifted');
    eatClick = true; setTimeout(function () { eatClick = false; }, 0);
    if (r.target === r.idx) return;
    var ids = r.sibs.map(function (x) { return x.getAttribute('data-id'); });
    ids.splice(r.target, 0, ids.splice(r.idx, 1)[0]);
    state.custom.order[T.days[r.di].id] = ids; saveCustom(); rerender(); refreshSheet();
    notify({ ico: 'route', title: L('nMoved'), body: L('nReplanBody', r.di + 1, C.fmt(plans[r.di].last), plans[r.di].warns.length ? ' · ' + L('nWarnN', plans[r.di].warns.length) : L('nAllLight')) });
  }
  function lpOk(t) { return !t.closest('a, button, summary, input, select, .hscroll, .tl-scrub, .nl-pill, .ev-ph, .more-body'); }
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    var ev = e.target.closest('.ev[data-drag]'); if (!ev || !lpOk(e.target)) return;
    var t = e.touches[0]; lp = { ev: ev, x: t.clientX, y: t.clientY };
    clearTimeout(lpTimer); lpTimer = setTimeout(function () { if (lp && rdStart(lp.ev, lp.y)) { rd.y = lp.y; requestAnimationFrame(rdLoop); } lp = null; }, 430);
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    var t = e.touches[0];
    if (rd) { e.preventDefault(); rdMove(t.clientY); return; }
    if (lp && (Math.abs(t.clientX - lp.x) > 8 || Math.abs(t.clientY - lp.y) > 8)) { clearTimeout(lpTimer); lp = null; }
  }, { passive: false });
  function touchEnd() { clearTimeout(lpTimer); lp = null; if (rd) rdEnd(); }
  document.addEventListener('touchend', touchEnd); document.addEventListener('touchcancel', touchEnd);
  // con ratón: mantener pulsado y arrastrar
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    var ev = e.target.closest('.ev[data-drag]'); if (!ev || !lpOk(e.target)) return;
    lp = { ev: ev, x: e.clientX, y: e.clientY };
    clearTimeout(lpTimer); lpTimer = setTimeout(function () { if (lp && rdStart(lp.ev, lp.y)) { rd.y = lp.y; requestAnimationFrame(rdLoop); } lp = null; }, 380);
  });
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    if (rd) { rdMove(e.clientY); return; }
    if (lp && (Math.abs(e.clientX - lp.x) > 6 || Math.abs(e.clientY - lp.y) > 6)) { clearTimeout(lpTimer); lp = null; }
  });
  document.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') return; clearTimeout(lpTimer); lp = null; if (rd) rdEnd(); });

  /* ---------- Editar día: arrastrar ≡ o mantener pulsada una fila para reordenar ---------- */
  var ed = null, edLp = null;
  function edBegin(row, y, touch) {
    var list = row.parentNode, rows = $$('.ed-row:not(.fixed)', list);
    if (row.classList.contains('fixed') || rows.length < 2) return false;
    ed = { row: row, list: list, rows: rows, idx: rows.indexOf(row), y0: y, sy0: shBody.scrollTop, tops: rows.map(function (x) { return x.offsetTop; }), h: row.offsetHeight + 8, target: rows.indexOf(row), touch: !!touch };
    row.classList.add('lifted'); haptic(); return true;
  }
  function edMove(y) {
    var dy = y - ed.y0 + (shBody.scrollTop - ed.sy0), center = ed.tops[ed.idx] + ed.row.offsetHeight / 2 + dy, t = ed.idx;
    ed.row.style.transform = 'translateY(' + dy.toFixed(1) + 'px) scale(1.02)';
    ed.rows.forEach(function (x, k) { var mid = ed.tops[k] + x.offsetHeight / 2; if (k < ed.idx && center < mid) t = Math.min(t, k); if (k > ed.idx && center > mid) t = Math.max(t, k); });
    if (t !== ed.target) haptic();
    ed.target = t;
    ed.rows.forEach(function (x, k) { if (x === ed.row) return; var sh = ed.idx < t && k > ed.idx && k <= t ? -ed.h : ed.idx > t && k >= t && k < ed.idx ? ed.h : 0; x.style.transform = sh ? 'translateY(' + sh + 'px)' : ''; });
    // cerca de los bordes de la hoja, desplaza la lista
    var r = shBody.getBoundingClientRect();
    if (y < r.top + 50) shBody.scrollTop -= 8; else if (y > r.bottom - 50) shBody.scrollTop += 8;
  }
  document.addEventListener('pointerdown', function (e) {
    var h = e.target.closest('[data-edh]'); if (!h || ed) return;
    e.preventDefault(); e.stopPropagation();
    if (edBegin(h.closest('.ed-row'), e.clientY, false)) { try { h.setPointerCapture(e.pointerId); } catch (_) {} }
  }, true);
  document.addEventListener('pointermove', function (e) { if (ed && !ed.touch) edMove(e.clientY); });
  document.addEventListener('touchstart', function (e) {
    var row = e.target.closest('.ed-row'); if (!row || ed || e.touches.length !== 1 || e.target.closest('button, a, input, [data-edh]')) return;
    var t0 = e.touches[0];
    edLp = { row: row, x: t0.clientX, y: t0.clientY, tm: setTimeout(function () { if (edLp) { edBegin(edLp.row, edLp.y, true); edLp = null; } }, 320) };
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    var t0 = e.touches[0];
    if (edLp && (Math.abs(t0.clientX - edLp.x) > 8 || Math.abs(t0.clientY - edLp.y) > 8)) { clearTimeout(edLp.tm); edLp = null; }
    if (ed && ed.touch) { e.preventDefault(); edMove(t0.clientY); }
  }, { passive: false });
  document.addEventListener('touchend', function () { if (edLp) { clearTimeout(edLp.tm); edLp = null; } if (ed && ed.touch) edEnd(); });
  document.addEventListener('touchcancel', function () { if (edLp) { clearTimeout(edLp.tm); edLp = null; } if (ed && ed.touch) edEnd(); });
  function edEnd() {
    if (!ed) return; var r = ed; ed = null;
    r.rows.forEach(function (x) { x.style.transform = ''; }); r.row.classList.remove('lifted');
    if (r.target === r.idx) return;
    var free = r.rows.map(function (x) { return x.getAttribute('data-id'); });
    free.splice(r.target, 0, free.splice(r.idx, 1)[0]);
    var ids = [];
    $$('.ed-row', r.list).forEach(function (x) { ids.push(x.classList.contains('fixed') ? x.getAttribute('data-id') : free.shift()); });
    var di = +r.list.getAttribute('data-ed');
    state.custom.order[T.days[di].id] = ids; saveCustom(); rerender(); refreshSheet();
    notify({ ico: 'route', title: L('nMoved'), body: L('nReplanBody', di + 1, C.fmt(plans[di].last), plans[di].warns.length ? ' · ' + L('nWarnN', plans[di].warns.length) : L('nAllLight')), ms: 2600 });
  }
  document.addEventListener('pointerup', function () { if (ed && !ed.touch) edEnd(); });
  document.addEventListener('pointercancel', function () { if (ed && !ed.touch) edEnd(); });

  /* ---------- Vuelos y check-in ---------- */
  function lastSun(y, m) { var d = new Date(Date.UTC(y, m + 1, 0, 1)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d.getTime(); }
  function zoneOff(ms, tz) { return C.tzOff(ms, tz); }
  function flCalc(k) {
    var f = state.flights[k] || {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date || '') || !/^\d{2}:\d{2}/.test(f.time || '')) return null;
    var dp = f.date.split('-'), tp = f.time.split(':'), loc = Date.UTC(+dp[0], +dp[1] - 1, +dp[2], +tp[0], +tp[1]);
    var base = k === 'out' ? (META.homeTz || META.tz) : META.tz, dep = loc - zoneOff(loc, base) * 6e4, open = dep - (+state.flights.hours || 24) * 36e5;
    return { dep: dep, open: open, base: base, label: k === 'out' ? L('flOut') : L('flBack') };
  }
  function locLabel(ms, base) {
    var d = new Date(ms + zoneOff(ms, base) * 6e4);
    return { date: C.dateLabel(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12)), time: C.fmt(d.getUTCHours() * 60 + d.getUTCMinutes()) };
  }
  function span(ms) { var h = Math.round(ms / 36e5); return h >= 48 ? L('days', Math.round(h / 24)) : h >= 1 ? L('hours', h) : Math.max(1, Math.round(ms / 6e4)) + ' min'; }
  var flFired = store.get('flFired', {});
  function flUpdate() {
    var now = Date.now();
    ['out', 'back'].forEach(function (k) {
      var el = document.getElementById('flSt-' + k), c = flCalc(k);
      if (!c) { if (el) el.innerHTML = L('flMissing'); return; }
      var o = locLabel(c.open, c.base), f = locLabel(c.dep, c.base), txt;
      if (now >= c.dep) txt = '<span class="muted">' + L('flDone') + '</span>';
      else if (now >= c.open) txt = '<b class="ok">' + V.ic('check') + L('flOpenNow') + '</b>';
      else txt = L('flOpens', o.date, o.time) + ' · <b>' + L('flOpenIn', span(c.open - now)) + '</b>';
      if (el) el.innerHTML = txt;
      var key = k + c.dep;
      if (now >= c.open && now < c.dep && !flFired[key]) {
        flFired[key] = 1; store.set('flFired', flFired);
        notify({ ico: 'plane', tone: 'o', persist: true, title: L('flNotify', c.label), body: L('flNotifyBody', f.date, f.time), onTap: function () { goPrep('fl'); } });
      } else if (now < c.open && c.open - now < 6 * 36e5 && !flFired['s' + key]) {
        flFired['s' + key] = 1; store.set('flFired', flFired);
        notify({ ico: 'plane', title: L('flSoon', span(c.open - now), c.label), body: L('flNotifyBody', f.date, f.time) });
      }
    });
  }
  function icsDate(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function downloadKml() {
    function x(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function pm(name, desc, style, it) { return '<Placemark><name>' + x(name) + '</name><description>' + x(desc) + '</description><styleUrl>#' + style + '</styleUrl><Point><coordinates>' + it.lon + ',' + it.lat + ',0</coordinates></Point></Placemark>'; }
    var folders = plans.map(function (p, di) {
      var st = V.stopsOf(p), name = L('day') + ' ' + (di + 1) + ' · ' + p.day.title;
      var line = st.length > 1 ? '<Placemark><name>' + x(name) + '</name><styleUrl>#ruta</styleUrl><LineString><tessellate>1</tessellate><coordinates>' + st.map(function (e) { return e.it.lon + ',' + e.it.lat + ',0'; }).join(' ') + '</coordinates></LineString></Placemark>' : '';
      var pts = st.map(function (e, k) { return pm((k + 1) + '. ' + C.fmt(e.start) + ' · ' + e.it.ti, (e.it.pl || '') + (e.it.lead ? ' — ' + e.it.lead : ''), 'plan', e.it); }).join('');
      var rec = V.nearRecs(p, di).map(function (o) { return pm(o.ti, (o.pl || '') + (o.lead ? ' — ' + o.lead : ''), 'reco', o); }).join('');
      return '<Folder><name>' + x(name) + '</name>' + line + pts + '</Folder>' + (rec ? '<Folder><name>' + x(L('day') + ' ' + (di + 1) + ' · ' + L('rtNearShort')) + '</name>' + rec + '</Folder>' : '');
    }).join('');
    var mt = META.title, title = mt && typeof mt === 'object' ? (mt[I18N.lang] || mt.es) : (mt || 'Viaje');
    var kml = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>' + x(title) + '</name>' +
      '<Style id="plan"><IconStyle><color>ff2f78e2</color></IconStyle></Style><Style id="reco"><IconStyle><color>ff9f8f80</color></IconStyle></Style>' +
      '<Style id="ruta"><LineStyle><color>ff2f78e2</color><width>4</width></LineStyle></Style>' + folders + '</Document></kml>';
    var blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = (META.id || 'viaje') + '.kml'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    notify({ ico: 'map', tone: 'o', title: L('nKml'), body: L('rtKmlHow'), ms: 6000 });
  }
  // aviso: el atardecer de hoy viene nublado y falta poco
  var sunWxShown = {};
  function sunWxCheck() {
    if (!wxValid() || state.liveDay < 0) return;
    var di = state.liveDay, p = plans[di], now = phoneMin(), ev = null;
    p.ev.forEach(function (e) { if (!e.skip && !ev && V.badWeather(e, di, p) && (e.it.sun || e.start >= p.sun.set - 75)) ev = e; });
    if (!ev || now < ev.start - 150 || now > ev.start) return;
    var key = p.day.id + ':' + state.start; if (sunWxShown[key]) return; sunWxShown[key] = 1;
    var o = V.sunOutlook(di, p);
    notify({ ico: 'cloud', tone: 'o', persist: true, title: L('nSunBadT'), body: L('nSunBadB', ev.it.ti, o ? o.cloud : '?'), onTap: function () { setTab(di + 1); setTimeout(function () { openSheet('alts:' + di + ':' + ev.it.id + ':rain'); }, 200); } });
  }
  function downloadIcs() {
    var ev = [];
    function vevent(uid, s0, e0, title, alarm) {
      return ['BEGIN:VEVENT', 'UID:' + uid + '-' + s0 + '@' + (META.id || 'guia'), 'DTSTAMP:' + icsDate(Date.now()), 'DTSTART:' + icsDate(s0), 'DTEND:' + icsDate(e0), 'SUMMARY:' + title,
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + title, 'TRIGGER:-PT' + alarm + 'M', 'END:VALARM', 'END:VEVENT'].join('\r\n');
    }
    ['out', 'back'].forEach(function (k) {
      var c = flCalc(k); if (!c) return;
      ev.push(vevent('chk-' + k, c.open, c.open + 30 * 6e4, L('flEvCheck', c.label.toLowerCase()), 0));
      ev.push(vevent('fl-' + k, c.dep, c.dep + 150 * 6e4, L('flEvFlight', c.label.toLowerCase()), 180));
    });
    if (!ev.length) { notify({ ico: 'plane', title: L('flMissing') }); return; }
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Guia ' + (META.id || '') + '//ES', 'CALSCALE:GREGORIAN'].concat(ev, ['END:VCALENDAR']).join('\r\n');
    try {
      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'vuelos-' + (META.id || 'viaje') + '.ics'; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    } catch (e) { location.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics); }
    haptic();
  }

  /* ---------- Álbum de cromos: se guarda para todos los viajes (lo enseña «Mis viajes» → Álbum) ---------- */
  function albumGet() { try { return JSON.parse(localStorage.getItem('guia-album') || '{}') || {}; } catch (_) { return {}; } }
  var album = albumGet(); V.setAlbum(album);
  function cromoItem(id) { var f = null; plans.forEach(function (p, di) { p.ev.forEach(function (e) { if (e.it.id === id) f = { it: e.it, di: di }; }); }); return f; }
  // como el álbum: todos los sitios del viaje, también los que hoy no van en el plan
  function cromoCount() { var n = 0, all = 0; (window.TRIP || T).days.forEach(function (d) { d.items.forEach(function (it) { if (V.isCromo(it)) { all++; if (album[V.cromoKey(it.id)]) n++; } }); }); return [n, all]; }
  function toggleCromo(id, force) {
    var f = cromoItem(id); if (!f) return;
    album = albumGet(); var k = V.cromoKey(id), had = !!album[k];
    if (had && force) return;
    if (had) delete album[k]; else album[k] = { at: phoneISO(), ti: f.it.ti, ph: f.it.ph || '', day: f.di + 1 };
    try { localStorage.setItem('guia-album', JSON.stringify(album)); } catch (_) {}
    V.setAlbum(album);
    $$('[data-cromo="' + id + '"]').forEach(function (b) { b.outerHTML = V.cromoBtn(f.it); });
    if (!had) { var c = cromoCount(); notify({ ico: 'camera', tone: 'o', title: L('cromoDone', f.it.ti), body: L('cromoDoneB', c[0], c[1]), ms: 3200, onTap: openAlbum }); }
    hubRefresh(); haptic();
  }
  // álbum: en la web está en «Mis viajes»; en el HTML único, en una hoja (album.js)
  function openAlbum() {
    if (window.GUIA_WEB || !window.Album) { location.href = 'index.html#album'; return; }
    openSheet('album'); sheetEl.classList.add('tall'); albumTab('album');
  }
  function albumTab(t) {
    $$('[data-albtab]').forEach(function (b) { var on = b.getAttribute('data-albtab') === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    $$('[data-albsec]').forEach(function (s) { s.hidden = s.getAttribute('data-albsec') !== t; });
    if (t === 'profile') Album.renderProfile(); else Album.renderAlbum();
  }
  if (window.Album && !window.GUIA_WEB) Album.init({
    single: true,
    trips: function () { return Promise.resolve([{ id: (META.id || 'guia'), b: { meta: META, trip: window.TRIP || T, trip_en: window.TRIP_EN, photos: {} } }]); },
    // pegado o quitado desde el visor 3D: botones de la guía y losa al día
    onChange: function () {
      album = albumGet(); V.setAlbum(album);
      $$('[data-cromo]').forEach(function (b) { var f = cromoItem(b.getAttribute('data-cromo')); if (f) b.outerHTML = V.cromoBtn(f.it); });
      hubRefresh();
    }
  });

  /* ---------- Todo el itinerario al calendario del iPhone (.ics) ---------- */
  function downloadIcsAll() {
    function tx(v) { return String(v || '').replace(/[\\;,]/g, function (m) { return '\\' + m; }).replace(/\n/g, '\\n'); }
    var ev = [];
    plans.forEach(function (p) {
      var mid = p.ms - 12 * 36e5, off = C.tzOff(p.ms);
      p.ev.forEach(function (e) {
        if (e.skip || e.it.hidden || e.it.t === 'drive') return;
        var s0 = mid + (e.start - off) * 6e4, e0 = mid + (e.end - off) * 6e4, it = e.it;
        var url = it.lat != null ? 'https://www.google.com/maps/search/?api=1&query=' + it.lat + ',' + it.lon : '';
        ev.push(['BEGIN:VEVENT', 'UID:' + it.id + '-' + p.day.id + '@' + (META.id || 'guia'), 'DTSTAMP:' + icsDate(Date.now()), 'DTSTART:' + icsDate(s0), 'DTEND:' + icsDate(e0),
          'SUMMARY:' + tx(it.ti), 'LOCATION:' + tx(it.pl || ''), 'DESCRIPTION:' + tx((it.lead || '') + (url ? '\n' + url : '')),
          'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + tx(it.ti), 'TRIGGER:-PT15M', 'END:VALARM', 'END:VEVENT'].join('\r\n'));
      });
    });
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Guia ' + (META.id || '') + '//ES', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:' + tx((META.title || {})[I18N.lang] || (META.title || {}).es || META.id || '')].concat(ev, ['END:VCALENDAR']).join('\r\n');
    saveFile(new Blob([ics], { type: 'text/calendar;charset=utf-8' }), 'itinerario-' + (META.id || 'viaje') + '.ics');
    notify({ ico: 'calendar', title: L('calDone', ev.length), body: L('calDoneB'), ms: 4200 });
  }
  // guarda un archivo: hoja de compartir del iPhone si se puede, si no descarga
  function saveFile(blob, name, share) {
    var f = null; try { f = new File([blob], name, { type: blob.type }); } catch (_) {}
    if (share && f && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: name }).catch(function () {}); return; }
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000); haptic();
  }

  /* ---------- Copia de seguridad de lo apuntado (tareas, gastos, hoteles, cambios) ---------- */
  function backupExport() {
    var data = {};
    try { for (var k = 0; k < localStorage.length; k++) { var key = localStorage.key(k); if (key.indexOf(NS) === 0 && key !== NS + 'wx') data[key.slice(NS.length)] = localStorage.getItem(key); } } catch (_) {}
    var o = { app: 'guia-viaje', trip: META.id || '', ver: window.GUIDE_VER || '', at: new Date().toISOString(), data: data };
    saveFile(new Blob([JSON.stringify(o, null, 1)], { type: 'application/json' }), 'copia-' + (META.id || 'viaje') + '-' + phoneISO() + '.json', true);
  }
  function backupImport(file) {
    var r = new FileReader();
    r.onload = function () {
      var o = null; try { o = JSON.parse(r.result); } catch (_) {}
      if (!o || o.app !== 'guia-viaje' || !o.data) { notify({ ico: 'alert', tone: 'o', title: L('bkBad') }); return; }
      if (o.trip && META.id && o.trip !== META.id && !confirm(L('bkOther', o.trip))) return;
      if (!confirm(L('bkSure', o.at ? o.at.slice(0, 10) : '?'))) return;
      try { Object.keys(o.data).forEach(function (k) { localStorage.setItem(NS + k, o.data[k]); }); } catch (_) { notify({ ico: 'alert', tone: 'o', title: L('bkBad') }); return; }
      location.reload();
    };
    r.readAsText(file);
  }

  /* ---------- Reservas: archivos guardados en el propio móvil (IndexedDB), también sin conexión ---------- */
  var DB = (function () {
    var dbp = null;
    function open() {
      if (!dbp) dbp = new Promise(function (res, rej) {
        if (!window.indexedDB) return rej(new Error('no idb'));
        var q = indexedDB.open('guia-docs', 1);
        q.onupgradeneeded = function () { q.result.createObjectStore('docs', { keyPath: 'id' }); };
        q.onsuccess = function () { res(q.result); }; q.onerror = function () { rej(q.error); };
      });
      return dbp;
    }
    function run(mode, fn) {
      return open().then(function (db) { return new Promise(function (res, rej) {
        var tr = db.transaction('docs', mode), q = fn(tr.objectStore('docs'));
        tr.oncomplete = function () { res(q ? q.result : null); }; tr.onerror = tr.onabort = function () { rej(tr.error); };
      }); });
    }
    return {
      all: function () { return run('readonly', function (st) { return st.getAll(); }); },
      get: function (id) { return run('readonly', function (st) { return st.get(id); }); },
      put: function (o) { return run('readwrite', function (st) { return st.put(o); }); },
      del: function (id) { return run('readwrite', function (st) { return st.delete(id); }); }
    };
  })();
  function docsRefresh() {
    return DB.all().then(function (all) {
      V.setDocs((all || []).filter(function (d) { return d.trip === (META.id || ''); }).map(function (d) { return { id: d.id, name: d.name, type: d.type, size: d.size, at: d.at }; })
        .sort(function (a, b) { return a.at - b.at; }));
      var box = $('#docsBox'); if (box) { box.outerHTML = V.docs(); var nb = $('#docsBox'); if (nb) nb.classList.add('in'); }
      hubRefresh();
    }).catch(function () {});
  }
  function addDocs(files) {
    var list = [].slice.call(files || []), n = 0;
    var jobs = list.map(function (f) {
      if (f.size > 25 * 1048576) { notify({ ico: 'alert', tone: 'o', title: L('docBig', f.name) }); return null; }
      n++;
      return DB.put({ id: 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), trip: META.id || '', name: f.name, type: f.type, size: f.size, at: Date.now(), blob: f });
    });
    Promise.all(jobs).then(function () { docsRefresh(); if (n) notify({ ico: 'ticket', title: L('docAdded', n), ms: 2600 }); haptic(); })
      .catch(function () { notify({ ico: 'alert', tone: 'o', title: L('docFail') }); });
  }
  function openDoc(id) {
    DB.get(id).then(function (d) {
      if (!d || !d.blob) return;
      var u = URL.createObjectURL(d.blob), a = document.createElement('a');
      a.href = u; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click();
      setTimeout(function () { a.remove(); }, 1000); setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
    });
  }
  if (!PRE) docsRefresh();

  /* ---------- Tiempo: Open-Meteo si hay conexión; si no, último guardado o clima típico ---------- */
  // (wxData se carga al principio, junto al estado)
  function wxValid() { return wxData && wxData.start === state.start && wxData.days; }
  function daysAhead() { return Math.round((C.parseISO(state.start) - C.parseISO(phoneISO())) / 864e5); }
  function renderWx() {
    var ok = wxValid(), body = $('#wxBody'), note = $('#wxNote');
    if (body) body.innerHTML = V.wxRows(plans, ok ? wxData.days : null);
    $$('[data-wxd]').forEach(function (el) { var i = +el.getAttribute('data-wxd'); el.innerHTML = V.wxMini(ok ? wxData.days[i] : null, plans[i], i); });
    if (!note) return;
    var ahead = daysAhead();
    if (ok) { var h = Math.round((Date.now() - wxData.at) / 36e5); note.textContent = L('wxNoteOk', h < 1 ? L('wxLtHour') : L('wxHours', h)); }
    else if (ahead > 15) note.textContent = L('wxNoteEarly', C.dateLabel(C.addDays(C.parseISO(state.start), -15)));
    else note.textContent = L('wxNoteNone');
  }
  function fetchT(url, ms) {
    var c = window.AbortController ? new AbortController() : null, tm = setTimeout(function () { if (c) c.abort(); }, ms);
    return fetch(url, c ? { signal: c.signal } : {}).then(function (r) { clearTimeout(tm); if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  function fetchWx(manual) {
    renderWx();
    var ahead = daysAhead();
    if (!window.fetch || ahead < -4) return;
    if (ahead > 15) { if (manual) notify({ ico: 'cloud', title: L('wxEarly'), body: L('wxEarlyBody') }); return; }
    if (!manual && wxValid() && Date.now() - wxData.at < 36e5) return;
    if (navigator.onLine === false) { if (manual) notify({ ico: 'cloud', title: L('wxOffline'), body: L('wxOfflineBody') }); return; }
    var btn = $('#wxRefresh'); if (btn) btn.classList.add('spin');
    var TZQ = encodeURIComponent(META.tz || 'Europe/London');
    function hrs(j) { var h = j && j.hourly; return h && h.time ? { pop: h.precipitation_probability || [], mm: h.precipitation || [], cloud: h.cloud_cover || [], code: h.weather_code || [], temp: h.temperature_2m || [] } : null; }
    Promise.all(plans.map(function (pl, i) {
      var pt = T.wx[i] || { lat: pl.day.ref.lat, lon: pl.day.ref.lon };
      var iso = C.ukISO(pl.ms), q = '&timezone=' + TZQ + '&start_date=' + iso + '&end_date=' + iso;
      var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + pt.lat + '&longitude=' + pt.lon +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,snowfall_sum,wind_gusts_10m_max' +
        '&hourly=temperature_2m,precipitation_probability,precipitation,cloud_cover,weather_code' + q;
      // sitio del atardecer de ese día (si está a más de 20 km del punto de previsión)
      var sp = null; pl.ev.forEach(function (e) { if (!e.skip && e.it.lat != null && e.it.t !== 'drive' && (e.it.sun || (e.start <= pl.sun.set && e.end >= pl.sun.set - 60))) sp = e.it; });
      var far = sp && C.km(sp, pt) > 20;
      var sunReq = far ? fetchT('https://api.open-meteo.com/v1/forecast?latitude=' + sp.lat + '&longitude=' + sp.lon + '&hourly=temperature_2m,precipitation_probability,precipitation,cloud_cover,weather_code' + q, 9000).then(hrs).catch(function () { return null; }) : Promise.resolve(null);
      return Promise.all([fetchT(url, 9000), sunReq]).then(function (rr) {
        var j = rr[0], d = j && j.daily; if (!d || !d.time || !d.time.length) return null;
        return { h: hrs(j), hs: rr[1], code: d.weather_code[0], tmax: d.temperature_2m_max[0], tmin: d.temperature_2m_min[0], rain: d.precipitation_sum[0], prob: d.precipitation_probability_max[0], snow: d.snowfall_sum[0], gust: d.wind_gusts_10m_max[0] };
      }).catch(function () { return null; });
    })).then(function (days) {
      var b = $('#wxRefresh'); if (b) b.classList.remove('spin');
      if (!days.some(Boolean)) { if (manual) notify({ ico: 'cloud', title: L('wxFail'), body: L('wxFailBody') }); return; }
      wxData = { at: Date.now(), start: state.start, days: days }; store.set('wx', wxData); V.setWx(wxData); rerender(); snowCheck(true); sunWxCheck();
      var risky = days.some(function (d) { return d && ((d.snow || 0) > 0.2 || (d.tmin != null && d.tmin <= 1) || (d.gust || 0) >= 65); });
      if (manual) notify({ ico: 'cloud', title: L('wxUpdated'), body: risky ? L('wxRisky') : L('wxSafe') });
      else if (risky) notify({ ico: 'snow', tone: 'o', persist: true, title: L('wxAlert'), body: L('wxAlertBody'), onTap: function () { goPrep('wx'); } });
    });
  }
  window.addEventListener('online', function () { fetchWx(false); });
  setInterval(function () { fetchWx(false); }, 30 * 6e4);
  var snowShown = '';
  function snowCheck(fresh) {
    if (!wxValid()) return;
    var sn = wxData.days.map(function (d, i) { return d && ((d.snow || 0) > 0.05 || (d.code >= 71 && d.code <= 77) || d.code === 85 || d.code === 86) ? L('day') + ' ' + (i + 1) : null; }).filter(Boolean);
    var key = sn.join(',');
    if (key !== snowList.join(',')) { snowList = sn; hubRefresh(); }
    if (!sn.length || key === snowShown) return;
    snowShown = key;
    notify({ ico: 'snow', tone: 'b', persist: true, title: L('snowAlert'), body: L('snowAlertBody', sn.join(', ')), onTap: function () { goPrep('wx'); } });
  }

  function refreshBudget() {
    V.setBudget(state.blist, state.payers);
    var bt = $('#budTrip'); if (bt) bt.innerHTML = V.budgetCard(plans);
    var fl2 = $('#fuelLog'); if (fl2) fl2.innerHTML = V.fuelLog();
    hubRefresh();
    $$('[id^="bud"] .rv, #fuelLog .rv').forEach(function (el) { el.style.transition = 'none'; el.classList.add('in'); el.offsetWidth; el.style.transition = ''; });
    measure();
  }

  function jump(id) {
    var el = document.getElementById('ev-' + id); if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    haptic();
  }
  var clashSeen = {};
  function clashNotify() {
    plans.forEach(function (p, di) {
      (p.clashes || []).forEach(function (cx) {
        var key = p.day.id + ':' + cx.id + ':' + state.start;
        if (cx.pick || clashSeen[key]) return; clashSeen[key] = 1;
        notify({ ico: 'lock', tone: 'o', persist: true, title: L('nClashT', di + 1), body: L('nClashB', C.fmt(cx.set), cx.ancTi), onTap: function () { setTab(di + 1); setTimeout(function () { openSheet('sunclash:' + di); }, 200); } });
      });
    });
  }
  function rerender() {
    var y = window.pageYOffset; renderAll(); window.scrollTo(0, y); clashNotify();
    setupReveal(true); hsAll(pages[state.tab]); placeBall(); renderWx(); syncSim(); update();
  }
  // deja un hueco del plan como al principio: sin reemplazo, sin hueco libre y sin quitar
  function clearSlot(id) {
    T.days.forEach(function (d) {
      var ex = state.custom.extras[d.id], od = state.custom.order[d.id];
      if (ex && od) ex.forEach(function (x) { if (x.rep && x.before === id && od.indexOf(x.uid) >= 0) od[od.indexOf(x.uid)] = id; });
      if (ex) state.custom.extras[d.id] = ex.filter(function (x) { return !(x.rep && x.before === id); });
      if (state.custom.gaps[d.id]) delete state.custom.gaps[d.id][id];
    });
    if (state.skipped[id] === 1) { delete state.skipped[id]; store.set('skipped', state.skipped); }
  }
  // coordenadas dentro de un texto: «57.47, -4.22» o un enlace de Google Maps con @lat,lon o q=lat,lon
  function coordsIn(txt) {
    var m = /@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/.exec(txt) || /[?&](?:q|query|ll|destination)=(-?\d{1,2}\.\d+)(?:,|%2C)\s*(-?\d{1,3}\.\d+)/.exec(txt) || /^\s*(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)\s*$/.exec(txt);
    return m ? [Math.round(+m[1] * 1e5) / 1e5, Math.round(+m[2] * 1e5) / 1e5] : null;
  }
  function jget(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); }); }
  // palabras que distinguen el nombre de un alojamiento (sin «hotel», «the», la ciudad…)
  var STOPW = /^(the|hotel|hotels|inn|house|guest|guesthouse|lodge|bnb|apartment|apartments|suite|suites|and|of|by|at|edinburgh|edimburgo|inverness|fort|william|glasgow|scotland|escocia)$/;
  function nameTokens(n) { return String(n || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 3 && !STOPW.test(w); }); }
  function r5d(v) { return Math.round(v * 1e5) / 1e5; }
  // ubicar el alojamiento: coordenadas o enlace pegado; si no, se busca por nombre + ciudad (Photon, sobre OpenStreetMap),
  // luego solo el nombre y por último la dirección. Después se busca una foto libre en Wikimedia Commons
  function stayLocate(id, quiet) {
    var z = (T.stays || []).filter(function (x) { return x.id === id; })[0], h = state.custom.hotels[id] || {};
    if (!z) return;
    var cc = coordsIn(h.addr || '');
    if (cc) { h.lat = cc[0]; h.lon = cc[1]; state.custom.hotels[id] = h; saveCustom(); rerender(); notify({ ico: 'pin', tone: 'o', title: L('stLocOk'), ms: 2200 }); stayPhoto(id); return; }
    if (!h.name && !h.addr) { if (!quiet) notify({ ico: 'alert', title: L('stNeedName'), ms: 2600 }); return; }
    var town = z.town_en || z.town, qs = [];
    if (h.name) qs.push(h.name + ' ' + town, h.name);
    if (h.addr && !/^https?:/.test(h.addr)) qs.push(h.addr + ' ' + town);
    var tk = nameTokens(h.name);
    function near(f) { var c = f.geometry.coordinates; return C.km({ lat: c[1], lon: c[0] }, z) <= 40; }
    function score(f) {
      var p = f.properties, n = String(p.name || '').toLowerCase(), sc = 0;
      if (p.osm_key === 'tourism') sc += 3;
      if (/hotel|guest_house|hostel|apartment|motel|chalet/.test(p.osm_value || '')) sc += 2;
      if (tk.length && tk.every(function (w) { return n.indexOf(w) >= 0; })) sc += 4;
      return sc;
    }
    if (!quiet) notify({ ico: 'pin', title: L('stLocating'), ms: 1600 });
    (function next(k) {
      if (k >= qs.length) { notify({ ico: 'alert', title: L('stLocNo'), ms: 4200 }); return; }
      jget('https://photon.komoot.io/api/?limit=8&lat=' + z.lat + '&lon=' + z.lon + '&q=' + encodeURIComponent(qs[k])).then(function (j) {
        var fs = (j.features || []).filter(near).sort(function (a, b) { return score(b) - score(a); });
        if (!fs.length || (k < 2 && tk.length && score(fs[0]) < 4)) return next(k + 1);
        var f = fs[0], p = f.properties, c = f.geometry.coordinates;
        h.lat = r5d(c[1]); h.lon = r5d(c[0]); h.osm = String(p.osm_type || '') + p.osm_id;
        if (!h.addr) h.addr = [[p.housenumber, p.street].filter(Boolean).join(' '), p.postcode].filter(Boolean).join(', ');
        state.custom.hotels[id] = h; saveCustom(); rerender();
        notify({ ico: 'pin', tone: 'o', title: L('stFound', p.name || h.name), body: [p.street, p.postcode, p.city].filter(Boolean).join(', '), ms: 3200 });
        // web y teléfono (si están en OpenStreetMap) y foto
        jget('https://nominatim.openstreetmap.org/lookup?format=json&extratags=1&osm_ids=' + encodeURIComponent(h.osm)).then(function (d) {
          var et = (d && d[0] && d[0].extratags) || {}, hh = state.custom.hotels[id]; if (!hh) return;
          if (et.website && !hh.web) hh.web = et.website;
          if ((et.phone || et['contact:phone']) && !hh.ref) hh.ref = et.phone || et['contact:phone'];
          saveCustom(); rerender();
        }).catch(function () {});
        stayPhoto(id);
      }).catch(function () { notify({ ico: 'alert', title: L('stLocOff', z.town), ms: 4200 }); });
    })(0);
  }
  // foto libre del alojamiento: un archivo de Wikimedia Commons a menos de 200 m cuyo nombre contenga el del hotel.
  // Se guarda en el móvil (funciona sin conexión) con su autor y licencia
  function stayPhoto(id) {
    var h = state.custom.hotels[id]; if (!h || h.lat == null) return;
    var tk = nameTokens(h.name);
    function noPhoto() { var hh = state.custom.hotels[id]; if (hh) { hh.noImg = 1; saveCustom(); rerender(); } }
    if (!tk.length) { noPhoto(); return; }
    jget('https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsnamespace=6&gsradius=200&gslimit=40&format=json&origin=*&gscoord=' + h.lat + '%7C' + h.lon).then(function (j) {
      var hit = ((j.query || {}).geosearch || []).filter(function (g) { var t = g.title.toLowerCase(); return tk.every(function (w) { return t.indexOf(w) >= 0; }); })[0];
      if (!hit) { noPhoto(); return; }
      return jget('https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=720&format=json&origin=*&titles=' + encodeURIComponent(hit.title)).then(function (j2) {
        var pgs = (j2.query || {}).pages || {}, pg = pgs[Object.keys(pgs)[0]] || {}, ii = (pg.imageinfo || [])[0];
        if (!ii || !ii.thumburl) { noPhoto(); return; }
        var md = ii.extmetadata || {}, artist = String((md.Artist || {}).value || '').replace(/<[^>]+>/g, '').trim(), lic = String((md.LicenseShortName || {}).value || '');
        // se reduce a 640 px y JPEG ligero para que quepa sin problema en el móvil
        return fetch(ii.thumburl).then(function (r) { return r.blob(); }).then(function (b) {
          return new Promise(function (res, rej) {
            var u = URL.createObjectURL(b), im = new Image();
            im.onload = function () { var k = Math.min(1, 640 / im.width), cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
              cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); URL.revokeObjectURL(u); res(cv.toDataURL('image/jpeg', 0.72)); };
            im.onerror = rej; im.src = u;
          });
        }).then(function (du) {
          var hh = state.custom.hotels[id]; if (!hh) return;
          hh.img = du; hh.imgCredit = [artist, lic, 'Wikimedia Commons'].filter(Boolean).join(' · '); hh.imgPage = ii.descriptionurl; delete hh.noImg;
          saveCustom(); rerender(); notify({ ico: 'camera', tone: 'o', title: L('stPhotoOk'), ms: 2400 });
        });
      });
    }).catch(function () {});
  }
  function nowHM() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  // estado del guardado en una tarjeta: «Cambios sin guardar» o «✓ Guardado · hh:mm»
  function svMark(el, st, at) {
    if (!el) return;
    var sp = $('.sv-st', el), b = $('.sv-btn', el);
    if (sp) { sp.classList.toggle('dirty', st === 'dirty'); sp.textContent = st === 'dirty' ? L('dirtyTxt') : '✓ ' + (at ? L('savedAt', at) : L('savedTxt')); }
    if (b) b.classList.toggle('on', st === 'dirty');
  }
  var stayT = 0;
  function stayLater() { clearTimeout(stayT); stayT = setTimeout(function () { var a = document.activeElement; if (a && a.closest && a.closest('.stay-c')) { stayLater(); return; } rerender(); }, 800); }
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches && t.matches('[data-stay]')) svMark(t.closest('.stay-c'), 'dirty');
    else if (t.matches && t.matches('[data-fl]')) svMark(t.closest('.flr'), 'dirty');
  });
  function toggleSkip(id) {
    T.days.forEach(function (d) { if (state.custom.gaps[d.id] && state.custom.gaps[d.id][id]) { delete state.custom.gaps[d.id][id]; saveCustom(); } });
    var now = false;
    plans.forEach(function (p) { p.ev.forEach(function (e) { if (e.it.id === id) now = e.skip; }); });
    state.skipped[id] = now ? 0 : 1;
    store.set('skipped', state.skipped);
    rerender();
    var di = state.tab - 1, p = plans[Math.max(0, di)];
    notify({ ico: 'route', title: L('nReplan'), body: L('nReplanBody', di + 1, C.fmt(p.last), p.warns.length ? ' · ' + L('nWarnN', p.warns.length) : L('nAllLight')) });
    haptic();
  }

  /* ---------- Checklist ---------- */
  function rings() {
    var all = 0, done = 0;
    T.checklist.forEach(function (c) {
      var n = 0; c.items.forEach(function (i) { all++; if (state.checked[i.id]) { n++; done++; } });
      var r = document.getElementById('r-' + c.id);
      if (r) { r.style.setProperty('--p', n / c.items.length); r.classList.toggle('zero', !n); $('span', r).textContent = n + '/' + c.items.length; }
    });
    ['out', 'back'].forEach(function (w) {
      var c = V.chkStat(state.checked, w), ra = $('#r-all-' + w), dt = $('#doneTxt-' + w);
      if (ra) { ra.style.setProperty('--p', c.all ? c.done / c.all : 0); ra.classList.toggle('zero', !c.done); $('span', ra).textContent = (c.all ? Math.round(c.done / c.all * 100) : 0) + '%'; }
      if (dt) dt.textContent = L('doneOf', c.done, c.all);
    });
    hubRefresh();
    return { all: all, done: done };
  }
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('.chk input')) {
      var id = t.getAttribute('data-id');
      if (t.checked) state.checked[id] = 1; else delete state.checked[id];
      store.set('checked', state.checked); haptic();
      var r = rings(), cat = T.checklist.filter(function (c) { return c.id === t.closest('.chk').getAttribute('data-cat'); })[0];
      if (t.checked && cat && cat.items.every(function (i) { return state.checked[i.id]; })) notify({ ico: 'check', tone: 'o', title: L('nCatDone', cat.title), body: r.done === r.all ? L('nAllDone') : L('nItemsLeft', r.all - r.done) });
    } else if (t.matches('[data-payname]')) {
      var pn0 = (state.payers || V.payers()).slice(); pn0[+t.getAttribute('data-payname')] = t.value.trim() || null;
      state.payers = pn0; store.set('payers', pn0); refreshBudget();
    } else if (t.matches('[data-docadd]')) {
      addDocs(t.files); t.value = '';
    } else if (t.matches('[data-bkimp]')) {
      if (t.files && t.files[0]) backupImport(t.files[0]); t.value = '';
    } else if (t.matches('[data-bamt]')) {
      var av = parseFloat(String(t.value).replace(',', '.')), aid = t.getAttribute('data-bamt');
      state.blist.forEach(function (x) { if (x.id === aid && av >= 0) x.a = Math.round(av * 100) / 100; });
      store.set('blist', state.blist); refreshBudget();
    } else if (t.matches('[data-stay]')) {
      var sk2 = t.getAttribute('data-stay').split('.'), hz = (state.custom.hotels[sk2[0]] = state.custom.hotels[sk2[0]] || {});
      var prevName = hz.name;
      if (sk2[1] === 'bf') hz.bf = t.checked; else hz[sk2[1]] = t.value.trim();
      var renamed = sk2[1] === 'name' && hz.name !== prevName;
      if (renamed) { delete hz.lat; delete hz.lon; delete hz.img; delete hz.imgCredit; delete hz.imgPage; delete hz.noImg; delete hz.osm; delete hz.web; }
      if (sk2[1] === 'addr' || sk2[1] === 'name') { var cc = coordsIn(hz.addr || ''); if (cc) { hz.lat = cc[0]; hz.lon = cc[1]; } }
      if (!hz.name && !hz.addr && !hz.arr) delete state.custom.hotels[sk2[0]]; else hz.savedAt = nowHM();
      saveCustom(); haptic(); svMark(t.closest('.stay-c'), 'ok', hz.savedAt); stayLater();
      if (renamed && hz.name && hz.lat == null) stayLocate(sk2[0], true);
      return;
      if (sk2[1] === 'arr' && hz.arr) { var sdi = T.days.map(function (d) { return d.id; }).indexOf(sk2[0]); notify({ ico: 'lock', tone: 'o', title: L('stArrSet', hz.arr), body: L('nReplanBody', sdi + 1, C.fmt(plans[sdi].last), plans[sdi].warns.length ? ' · ' + L('nWarnN', plans[sdi].warns.length) : L('nAllLight')), ms: 4200 }); }
    } else if (t.matches('[data-fl]')) {
      var key = t.getAttribute('data-fl').split('.');
      if (key.length === 2) { state.flights[key[0]] = state.flights[key[0]] || {}; state.flights[key[0]][key[1]] = t.value; } else state.flights.hours = +t.value;
      if (key.length === 2) state.flights[key[0]].savedAt = nowHM();
      store.set('flights', state.flights); flUpdate(); hubRefresh(); haptic();
      if (key.length === 2) svMark(t.closest('.flr'), 'ok', state.flights[key[0]].savedAt);
    } else if (t.id === 'startDate') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(t.value)) return;
      state.start = t.value; store.set('start', t.value);
      detectLive(); rerender(); fetchWx(false); haptic();
      var w = plans.reduce(function (a, p) { return a + p.warns.length; }, 0);
      notify({ ico: 'calendar', title: L('nDates'), body: L('nDatesBody', C.dateLabel(plans[0].ms), C.dateLabel(plans[plans.length - 1].ms), C.fmt(plans[0].sun.set), w ? L('nWarnN', w) : L('nNoWarn')) });
    }
  });

  /* ---------- Slider táctil (pointer events + touch-action:none) ---------- */
  function Slider(el, min, max, step, onInput, onEnd) {
    var val = min, drag = false;
    function set(v, silent) {
      v = clamp(Math.round(v / step) * step, min, max);
      var changed = v !== val; val = v;
      el.style.setProperty('--v', (v - min) / (max - min));
      el.setAttribute('aria-valuenow', v); el.setAttribute('aria-valuetext', C.fmt(v));
      if (!silent && changed) onInput(v);
    }
    function fromX(x) { var r = el.getBoundingClientRect(); return min + (x - r.left) / r.width * (max - min); }
    function start(x) { drag = true; el.classList.add('is-drag'); set(fromX(x)); }
    function end() { if (!drag) return; drag = false; el.classList.remove('is-drag'); if (onEnd) onEnd(val); }
    el.addEventListener('pointerdown', function (e) { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (_) {} start(e.clientX); });
    el.addEventListener('pointermove', function (e) { if (drag) set(fromX(e.clientX)); });
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end); el.addEventListener('lostpointercapture', end);
    el.addEventListener('keydown', function (e) {
      var k = e.key, d = k === 'ArrowRight' || k === 'ArrowUp' ? step : k === 'ArrowLeft' || k === 'ArrowDown' ? -step : k === 'PageUp' ? 60 : k === 'PageDown' ? -60 : 0;
      if (d) { e.preventDefault(); set(val + d); if (onEnd) onEnd(val); }
    });
    return { set: set, get: function () { return val; }, dragging: function () { return drag; } };
  }

  /* ---------- Modo: hora real (por defecto) o manual ---------- */
  var toldManual = false;
  // la hora «en vivo» es la del móvil: en Escocia coincide con la local; fuera, se muestra también la de Escocia
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function phoneMin() { var d = new Date(); return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; }
  function phoneISO() { var d = new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function scotDiff() { return Math.round(phoneMin() - C.ukMin(Date.now())); }
  function curDay() { return state.liveDay >= 0 ? state.liveDay : (state.tab > 0 ? state.tab - 1 : state.lastDay); }
  function setManual(di, min, src) {
    var was = state.mode;
    state.mode = 'manual'; state.mDay = clamp(di, 0, T.days.length - 1); state.mMin = clamp(Math.round(min), 0, 1439);
    if (src !== 'slider') slider.set(clamp(state.mMin, 360, 1435), true);
    syncSim(); update();
    if (src === 'tap' || src === 'drag-end') announce();
    if (was !== 'manual' && !toldManual) { toldManual = true; notify({ ico: 'clock', tone: 'o', title: L('nManual'), body: L('nManualBody', state.mDay + 1, C.fmt(state.mMin)), ms: 4200 }); }
  }
  function setSync() {
    state.mode = 'sync'; syncSim(); update(); haptic();
    notify({ ico: 'refresh', title: L('nSynced'), body: L('nSyncedBody', C.fmt(phoneMin())) + (Math.abs(scotDiff()) >= 15 ? ' · ' + L('scotNow', C.fmt(C.ukMin(Date.now()))) : ''), ms: 3600 });
  }
  var lastAnn = null;
  function announce() {
    var c = current(), id = c.cur ? c.cur.it.id : null;
    if (id === lastAnn) return; lastAnn = id;
    notify({ ico: c.cur ? V.tyIcon(c.cur.it.t) : 'clock', ms: 3600, title: L('nAt', C.fmt(c.now)) + (c.cur ? ': ' + c.cur.it.ti : ''),
      body: c.cur ? L('nLeft', C.dur(c.cur.end - c.now)) + (c.next ? L('nThen', c.next.it.ti) : '') : (c.next ? L('nNextAt', c.next.it.ti, C.fmt(c.next.start)) : L('endOfDay')) });
  }

  /* ---------- Vista del itinerario: fotos (completa) o lista (compacta) ---------- */
  var view = 'full';
  try { view = localStorage.getItem('guia-view') === 'list' ? 'list' : 'full'; } catch (_) {}
  viewBtns();
  function setView(v) {
    view = v; try { localStorage.setItem('guia-view', v); } catch (_) {}
    document.documentElement.classList.toggle('compact', v === 'list');
    viewBtns();
    $$('.tl .ev.open').forEach(function (e) { e.classList.remove('open'); });
    requestAnimationFrame(function () { measure(); update(); });
  }
  function viewBtns() {
    var v = view || 'full'; document.documentElement.classList.toggle('compact', v === 'list');
    $$('[data-view]').forEach(function (b) { var on = b.getAttribute('data-view') === v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }

  /* ---------- Botón «Ahora»: salta a lo que toca durante el viaje ---------- */
  function goNow() {
    var c = current(), target = c.cur || c.next; closeIsland();
    if (state.tab !== c.di + 1) setTab(c.di + 1);
    if (target) setTimeout(function () { jump(target.it.id); }, 140);
    haptic();
  }

  /* ---------- Tema claro / oscuro ---------- */
  // 'auto' sigue al iPhone; la preferencia vale para todos los viajes
  function themePref() { try { return localStorage.getItem('guia-theme') || 'auto'; } catch (_) { return 'auto'; } }
  var darkMq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function applyTheme() {
    var t = themePref(), dark = t === 'dark' || (t === 'auto' && !!darkMq && darkMq.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    var mc = document.querySelector('meta[name="theme-color"]'); if (mc) mc.setAttribute('content', dark ? '#16171b' : '#efe9de');
    var b = $('#islTheme'); if (b) { b.innerHTML = V.ic(t === 'light' ? 'sun' : 'moon') + (t === 'auto' ? '<i class="th-a">A</i>' : ''); b.setAttribute('aria-label', L('themeT') + ': ' + L('theme_' + t)); }
  }
  if (darkMq) { if (darkMq.addEventListener) darkMq.addEventListener('change', applyTheme); else if (darkMq.addListener) darkMq.addListener(applyTheme); }
  applyTheme();

  /* ---------- Isla (Live Activity) ---------- */
  var isl = $('#island'), scrim = $('#scrim'), full = $('#islFull');
  function islHeight() { return Math.min(62 + full.scrollHeight, window.innerHeight - 20) + 'px'; }
  function openIsland() { state.open = true; isl.classList.add('is-open'); scrim.classList.add('on'); $('#islBtn').setAttribute('aria-expanded', 'true'); isl.style.height = islHeight(); haptic(); }
  function closeIsland() { state.open = false; isl.classList.remove('is-open'); scrim.classList.remove('on'); $('#islBtn').setAttribute('aria-expanded', 'false'); isl.style.height = ''; }
  function fitIsland() { if (state.open) isl.style.height = islHeight(); }
  $('#islBtn').addEventListener('click', function () { state.open ? closeIsland() : openIsland(); });
  scrim.addEventListener('click', closeIsland);
  $('#islBud').addEventListener('click', function () { closeIsland(); setTab(0); setTimeout(function () { openGroup('money'); }, 280); haptic(); });
  $('#islGo').addEventListener('click', function () {
    var c = current(); closeIsland(); setTab(c.di + 1);
    var target = c.cur || c.next; if (target) setTimeout(function () { jump(target.it.id); }, 120);
  });
  $('#islSync').addEventListener('click', setSync);
  $('#islRoute').addEventListener('click', function () {
    var c = current(); closeIsland();
    openSheet('route:' + c.di + (c.sync && state.liveDay === c.di ? ':' + Math.round(c.now) : ''));
  });
  $('#islLang').addEventListener('click', function () { setLang(I18N.lang === 'es' ? 'en' : 'es'); });
  // versión web: botón para volver a la lista de viajes
  if (window.GUIA_WEB && !PRE) {
    var tb0 = document.createElement('button'); tb0.type = 'button'; tb0.className = 'ibtn'; tb0.id = 'islTrips'; tb0.innerHTML = V.ic('route') + L('myTrips');
    $('.isl-actions').insertBefore(tb0, $('#islLang'));
    tb0.addEventListener('click', function () { location.href = 'index.html'; });
  }
  $('#islTheme').addEventListener('click', function () {
    var order = ['auto', 'dark', 'light'], t = order[(order.indexOf(themePref()) + 1) % 3];
    try { localStorage.setItem('guia-theme', t); } catch (_) {}
    applyTheme(); haptic();
    notify({ ico: t === 'light' ? 'sun' : 'moon', title: L('themeT'), body: L('theme_' + t), ms: 2400 });
  });
  var segBtns = $$('#seg button');
  segBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var d = +b.getAttribute('data-sd');
      if (state.mode === 'manual') state.mDay = d;
      setTab(d + 1, 'quiet'); syncSim(); update();
    });
  });
  var slider = Slider($('#slider'), 360, 1435, 5, function (v) { setManual(state.mode === 'manual' ? state.mDay : curDay(), v, 'slider'); }, function () { announce(); });

  function syncSim() {
    var di = current().di;
    $('#seg').style.setProperty('--i', di);
    segBtns.forEach(function (b, k) { b.setAttribute('aria-pressed', k === di ? 'true' : 'false'); });
    var s = plans[di].sun;
    function p(m) { return V.pct(m).toFixed(1) + '%'; }
    $('#slider').style.setProperty('--sl-grad', 'linear-gradient(90deg,#3b3e46 0%,#3b3e46 ' + p(s.dawn) + ',#6d6f7a ' + p(s.rise) + ',#c9b79a ' + p(s.goldAm) + ',#efe2c8 ' + p((s.rise + s.set) / 2) + ',#e9a066 ' + p(s.gold) + ',#e2782f ' + p(s.set) + ',#6b6470 ' + p(s.dusk) + ',#3b3e46 ' + p(s.dusk + 20) + ',#3b3e46 100%)');
  }
  function detectLive() {
    var today = C.parseISO(phoneISO()), d = Math.round((today - C.parseISO(state.start)) / 864e5);
    state.liveDay = d >= 0 && d < plans.length ? d : -1; state.dayDiff = d;
    return d;
  }
  function current() {
    var sync = state.mode === 'sync';
    var di = sync ? curDay() : state.mDay, now = sync ? phoneMin() : state.mMin;
    var Lv = plans[di].live, cur = null, next = null;
    for (var k = 0; k < Lv.length; k++) {
      if (now >= Lv[k].start && now < Lv[k].end) { cur = Lv[k]; next = Lv[k + 1] || null; break; }
      if (Lv[k].start > now) { next = Lv[k]; break; }
    }
    // pre: hora real fuera de las fechas del viaje (antes o después): no se marca nada como «ahora»
    return { di: di, now: now, p: plans[di], cur: cur, next: next, sync: sync, onTrip: sync && state.liveDay >= 0, pre: sync && state.liveDay < 0 };
  }
  function sunInfo(s, now) {
    if (now < s.dawn) return ['moon', L('sNight'), L('sRiseAt', C.fmt(s.rise))];
    if (now < s.rise) return ['sunrise', L('sDawn'), L('sAt', C.fmt(s.rise))];
    if (now < s.gold) return ['sun', L('sLight'), L('sUntil', C.fmt(s.set))];
    if (now < s.set) return ['sunset', L('sGolden'), L('sSetAt', C.fmt(s.set))];
    if (now < s.dusk) return ['sunset', L('sTwilight'), L('sDarkAt', C.fmt(s.dusk))];
    return ['moon', L('sNight'), L('sRiseAt', C.fmt(s.rise))];
  }

  /* ---------- Timeline: línea de «ahora» y arrastre en la columna de horas ---------- */
  function tlAnchors(tl) {
    var pts = [];
    $$('.ev', tl).forEach(function (ev) {
      if (ev.classList.contains('is-skip')) return;
      var s = +ev.getAttribute('data-s'), e = +ev.getAttribute('data-e'), top = ev.offsetTop, h = ev.offsetHeight;
      pts.push([s, top + 16], [e, top + h - 4]);
    });
    for (var k = 1; k < pts.length; k++) if (pts[k][1] < pts[k - 1][1]) pts[k][1] = pts[k - 1][1];
    return pts;
  }
  function yAt(pts, t) {
    if (!pts.length) return 0;
    if (t <= pts[0][0]) return Math.max(0, pts[0][1] - (pts[0][0] - t) * 0.4);
    for (var k = 1; k < pts.length; k++) if (t <= pts[k][0]) {
      var a = pts[k - 1], b = pts[k]; return b[0] === a[0] ? b[1] : a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
    }
    var z = pts[pts.length - 1]; return z[1] + Math.min(60, (t - z[0]) * 0.4);
  }
  function tAt(pts, y) {
    if (!pts.length) return 600;
    if (y <= pts[0][1]) return pts[0][0] - (pts[0][1] - y) / 0.4;
    for (var k = 1; k < pts.length; k++) if (y <= pts[k][1]) {
      var a = pts[k - 1], b = pts[k]; return b[1] === a[1] ? b[0] : a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]);
    }
    var z = pts[pts.length - 1]; return z[0] + (y - z[1]) / 0.4;
  }
  var scrub = null;
  function scrubAt(clientY) {
    var A = anchors[scrub.di]; if (!A) return;
    var y = clientY - A.tl.getBoundingClientRect().top;
    setManual(scrub.di, r5(clamp(tAt(A.pts, y), 0, 1439)), 'drag');
  }
  function scrubLoop() {
    if (!scrub) return;
    var H = window.innerHeight, v = scrub.y < 130 ? -9 : scrub.y > H - 150 ? 9 : 0;
    if (v) { window.scrollBy(0, v); scrubAt(scrub.y); }
    requestAnimationFrame(scrubLoop);
  }
  document.addEventListener('pointerdown', function (e) {
    var z = e.target.closest('.tl-scrub, .nl-pill'); if (!z) return;
    var tl = z.closest('.tl'); e.preventDefault();
    scrub = { di: +tl.getAttribute('data-tl'), y: e.clientY };
    if (!anchors[scrub.di]) measure();
    try { z.setPointerCapture(e.pointerId); } catch (_) {}
    document.documentElement.classList.add('scrubbing'); haptic();
    scrubAt(e.clientY); requestAnimationFrame(scrubLoop);
  });
  document.addEventListener('pointermove', function (e) { if (scrub) { scrub.y = e.clientY; scrubAt(e.clientY); } });
  function scrubEnd() { if (!scrub) return; scrub = null; document.documentElement.classList.remove('scrubbing'); announce(); }
  document.addEventListener('pointerup', scrubEnd); document.addEventListener('pointercancel', scrubEnd);

  /* ---------- Sol del arco: se arrastra en horizontal para cambiar la hora ---------- */
  var arcDrag = null;
  function arcAt(clientX) {
    var r = arcDrag.svg.getBoundingClientRect();
    setManual(arcDrag.di, r5(V.tFromX((clientX - r.left) / r.width * V.AW)), 'drag');
  }
  document.addEventListener('pointerdown', function (e) {
    var svg = e.target.closest('.sunarc'); if (!svg || e.target.closest('.arc-t')) return;
    arcDrag = { svg: svg, di: +svg.getAttribute('data-arc'), x: e.clientX };
    svg.classList.add('drag'); arcAt(e.clientX); haptic();
  });
  document.addEventListener('pointermove', function (e) { if (arcDrag) arcAt(e.clientX); });
  function arcEnd() { if (!arcDrag) return; arcDrag.svg.classList.remove('drag'); arcDrag = null; announce(); }
  document.addEventListener('pointerup', arcEnd); document.addEventListener('pointercancel', arcEnd);

  /* ---------- Actualizar todo lo que depende de la hora ---------- */
  var lastCurId = '__', lastCurIt = null, fired = {};
  function update() {
    if (state.liveDay >= 0 && Math.random() < 0.05) sunWxCheck();
    var c = current(), s = c.p.sun, now = c.now, cur = c.cur, next = c.next;
    var sky = (now < s.dawn || now >= s.dusk) ? 'night' : ((now < s.goldAm || now >= s.gold) ? 'gold' : 'day');
    if (document.documentElement.getAttribute('data-sky') !== sky) document.documentElement.setAttribute('data-sky', sky);

    var dot = '<span class="live-dot' + (c.sync ? '' : ' sim') + '"></span>', mode = c.sync ? L('live') : L('manual');
    var pr = cur ? (now - cur.start) / (cur.end - cur.start) : 0;
    $('#islIco').innerHTML = V.ic(cur ? V.tyIcon(cur.it.t) : (next ? 'clock' : 'moon'));
    var dm = ((scotDiff() % 1440) + 1440) % 1440;
    var phone = c.sync && dm >= 15 && dm <= 1425 ? ' · ' + L('scotNow', C.fmt(C.ukMin(Date.now()))) : '';
    $('#islK').innerHTML = c.pre ? '<span class="live-dot sim"></span>' + (state.dayDiff < 0 ? L('islCount', -state.dayDiff) : L('islDone'))
      : dot + mode + ' · ' + C.fmt(now) + (cur ? ' · ' + L('left', C.dur(cur.end - now)) : (next ? ' · ' + L('nextAt', C.fmt(next.start)) : ''));
    $('#islMode').setAttribute('data-phone', phone);
    $('#islT').textContent = c.pre ? L('islPre', c.di + 1, C.fmt(c.p.live.length ? c.p.live[0].start : now)) : cur ? cur.it.ti : (next ? next.it.ti : L('rest'));
    $('#islRing').innerHTML = cur && !c.pre ? V.ring(pr, Math.round(cur.end - now) + '′', 'sm') : '';
    if (c.pre) $('#islIco').innerHTML = V.ic('calendar');
    $('#islMode').innerHTML = dot + (c.sync ? L('phoneNow') + ' ' + C.fmt(now) + phone + ' · ' : '') + L('day') + ' ' + (c.di + 1) + ' · ' + V.esc(C.dateLabel(c.p.ms));
    $('#islRange').textContent = cur ? C.fmt(cur.start) + ' – ' + C.fmt(cur.end) : (next ? L('from', C.fmt(next.start)) : '');
    $('#islBig').textContent = cur ? cur.it.ti : (next ? L('freeTime') : L('endOfDay'));
    $('#islPl').textContent = cur ? ((cur.it.pl ? cur.it.pl + ' · ' : '') + C.dur(cur.it.d)) : (next ? L('upNext', next.it.ti) : L('tomorrow'));
    $('#islBar').style.setProperty('--p', pr.toFixed(3));
    $('#islA').textContent = cur ? C.fmt(cur.start) : C.fmt(now);
    $('#islLeft').textContent = cur ? L('left', C.dur(cur.end - now)) : '';
    $('#islB').textContent = cur ? C.fmt(cur.end) : (next ? C.fmt(next.start) : '');
    $('#islNext').innerHTML = V.ic('next') + '<div><small>' + L('next') + (next ? ' · ' + C.fmt(next.start) : '') + '</small><span>' + (next ? V.esc(next.it.ti) : L('nothingMore')) + '</span></div>';
    var si = sunInfo(s, now);
    $('#islSun').innerHTML = V.ic(si[0]) + '<div><small>' + si[1] + '</small><span>' + si[2] + '</span></div>';
    $('#simVal').textContent = C.fmt(now);
    $('#islSync').style.display = c.sync ? 'none' : '';
    var fab = $('#nowFab'); if (fab) { fab.hidden = !c.onTrip; $('span', fab).textContent = L('nowBtn'); }
    if (!slider.dragging()) slider.set(clamp(now, 360, 1435), true);

    pages.forEach(function (pg, k) {
      var isDay = k === c.di + 1 && !c.pre;
      $$('.ev', pg).forEach(function (ev) {
        var a = +ev.getAttribute('data-s'), b = +ev.getAttribute('data-e'), skip = ev.classList.contains('is-skip');
        var isNow = isDay && !skip && now >= a && now < b, past = isDay && !skip && now >= b;
        ev.classList.toggle('is-now', isNow); ev.classList.toggle('is-past', past);
        if (isNow) { var pi = $('.ev-prog i', ev); if (pi) pi.style.setProperty('--p', ((now - a) / (b - a)).toFixed(3)); }
      });
      // sol y luna del arco
      var g = $('.sunarc .sun', pg), mo = $('.sunarc .moon', pg);
      if (g) {
        g.classList.toggle('on', isDay);
        if (isDay) {
          var pt = V.arcXY(plans[c.di].sun, now);
          g.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')'); g.classList.toggle('nite', pt.night);
          if (mo) { mo.classList.toggle('on', pt.night); if (pt.night) mo.setAttribute('transform', 'translate(' + pt.mx.toFixed(1) + ' ' + pt.my.toFixed(1) + ')'); }
          var su = $('.sunarc .sun-ui', pg);
          if (su) {
            var ux = pt.night ? pt.mx : pt.x, uy = pt.night ? pt.my : pt.y;
            su.classList.add('on'); su.setAttribute('transform', 'translate(' + ux.toFixed(1) + ' ' + uy.toFixed(1) + ')');
            $('text', su).textContent = C.fmt(now); $('line', su).setAttribute('y2', Math.max(8, 80 - uy).toFixed(1));
          }
        } else { if (mo) mo.classList.remove('on'); var su2 = $('.sunarc .sun-ui', pg); if (su2) su2.classList.remove('on'); }
      }
      // línea de «ahora» en el itinerario
      var nl = $('.nowline', pg);
      if (nl) {
        var A = anchors[k - 1];
        nl.classList.toggle('on', isDay && !!A);
        nl.classList.toggle('manual', !c.sync);
        if (isDay && A) { nl.style.transform = 'translateY(' + yAt(A.pts, now).toFixed(1) + 'px)'; $('.nl-pill b', nl).textContent = C.fmt(now) + (c.sync ? ' · ' + L('now') : ''); }
      }
    });

    var id = cur ? cur.it.id : (next ? 'gap-' + next.it.id : 'end');
    if (id !== lastCurId) {
      var prevIt = lastCurIt; lastCurIt = cur ? cur.it : null;
      if (c.onTrip && prevIt && V.isCromo(prevIt) && !album[V.cromoKey(prevIt.id)]) notify({ ico: 'camera', tone: 'o', ms: 9000, title: L('cromoAsk', prevIt.ti), body: L('cromoAskB'), onTap: function () { toggleCromo(prevIt.id, true); } });
      if (lastCurId !== '__' && !state.open && c.onTrip) { isl.classList.remove('pulse'); void isl.offsetWidth; isl.classList.add('pulse'); }
      if (lastCurId !== '__' && (scrub || arcDrag || slider.dragging())) haptic();
      lastCurId = id;
    }
    if (c.onTrip) liveAlerts(c);
    flUpdate();
    fitIsland();
  }
  function liveAlerts(c) {
    var s = c.p.sun, now = c.now, key = c.di + ':';
    function once(k, fn) { if (!fired[key + k]) { fired[key + k] = 1; fn(); } }
    if (c.next && c.next.start - now <= 10 && c.next.start - now > 0) once('n' + c.next.it.id, function () {
      notify({ ico: V.tyIcon(c.next.it.t), title: L('nInMin', Math.round(c.next.start - now), c.next.it.ti), body: c.next.it.t === 'drive' ? L('nGo') : (c.next.it.pl || ''), onTap: function () { jump(c.next.it.id); } });
    });
    if (s.gold - now <= 30 && s.gold - now > 0) once('gold', function () { notify({ ico: 'sun', tone: 'o', persist: true, title: L('nGoldIn', Math.round(s.gold - now)), body: L('nGoldBody', C.fmt(s.set)) }); });
    if (c.cur && c.cur.it.light && s.set - now <= 30 && s.set - now > 0) once('dark' + c.cur.it.id, function () { notify({ ico: 'sunset', tone: 'o', persist: true, title: L('nLow'), body: L('nLowBody', c.cur.it.ti, C.fmt(s.set)) }); });
  }

  /* ---------- Idioma ---------- */
  function setLang(l) {
    if (l === I18N.lang) return;
    I18N.apply(l); store.set('lang', l); if (window.Lang) Lang.set(l);
    applyStatic(); rerender();
    notify({ ico: 'flag', title: L('nLang'), body: L('nLangBody'), ms: 3000 });
    haptic();
  }

  /* ---------- Arranque ---------- */
  var diff = detectLive();
  if (state.liveDay >= 0) setTab(state.liveDay + 1, 'force');
  else { var st = store.get('tab', 0); state.tab = -1; setTab(st, 'force'); }
  syncSim();
  setupReveal(false);
  setTimeout(function () { measure(); update(); }, 160);
  setTimeout(placeBall, 60);
  fetchWx(false);
  setTimeout(function () { snowCheck(false); }, 1600);
  update();
  setInterval(function () { if (state.mode === 'sync') update(); else flUpdate(); }, 20000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { detectLive(); update(); } });
  window.addEventListener('resize', function () { fitIsland(); hsAll(pages[state.tab]); measure(); placeBall(); update(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); update(); });

  setTimeout(function () {
    if (state.liveDay >= 0) {
      var c = current();
      notify({ ico: 'flag', tone: 'o', title: L('nDayOn', c.di + 1), body: (c.cur ? L('nNowIs', c.cur.it.ti) : '') + L('nSunsetAt', C.fmt(c.p.sun.set)) });
    } else if (diff < 0) {
      notify({ ico: 'calendar', title: L('nDaysLeft', -diff), body: L('nDaysLeftBody'), onTap: openIsland });
    } else {
      notify({ ico: 'calendar', title: L('nPickDate'), body: L('nPickDateBody'), onTap: function () { goPrep(''); } });
    }
    setTimeout(clashNotify, 1600);
    var imp = 0; T.checklist.forEach(function (c) { c.items.forEach(function (i) { if (i.imp && !state.checked[i.id]) imp++; }); });
    if (imp) setTimeout(function () { notify({ ico: 'doc', tone: 'o', ms: 8000, title: L('nImp', imp), body: L('nImpBody'), onTap: function () { goPrep('chk'); } }); }, 900);
  }, 700);
})();
