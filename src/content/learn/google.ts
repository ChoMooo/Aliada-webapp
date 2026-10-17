import { type Module, F, S, home, store } from './shared';

export const GOOGLE: Module = {
  id: 'google', n: 'Google en tu celular', apps: 'Maps, Fotos, Drive, Lens, Traductor y Calendar', tone: 'amber', section: 'digital',
  desc: 'Llegar a cualquier lado, encontrar lugares, cuidar y encontrar tus fotos, guardar papeles, traducir y no olvidarte de nada.',
  temas: ['Cómo llegar', 'Colectivo, subte y tren', 'Encontrar lugares cerca', 'Compartir ubicación', 'Copia de tus fotos', 'Encontrar cualquier foto', 'Liberar espacio', 'Papeles en Drive', 'Traductor', 'Buscar con la cámara', 'Agenda y recordatorios'],
  lessons: [
    {
      id: 'g-maps-ir', t: 'Llegá a cualquier lado con Maps', min: 6, nivel: 'basico',
      para: 'Vas a buscar un lugar, ver cómo llegar en auto o caminando y seguir las indicaciones con voz.',
      idea: ['Google Maps te muestra el camino y cuánto vas a tardar con cada medio de transporte.', 'Al tocar «Iniciar», te guía paso a paso con voz.', 'Guardá tus lugares frecuentes (casa, médico, club) para no buscarlos cada vez.'],
      demo: [
        F(home('Maps'), 'Abrí Google Maps.'),
        F(S('maps', { hl: 'search' }), 'Tocá la barra «Buscá aquí».'),
        F(S('maps', { v: 'place', hl: 'dir' }), 'Escribí el lugar, elegilo y tocá «Cómo llegar».', 'type'),
        F(S('maps', { v: 'route', mode: 'car', hl: 'walk' }), 'Elegí cómo vas: auto, transporte o a pie. Cada uno muestra cuánto tardás.'),
        F(S('maps', { v: 'route', mode: 'walk', hl: 'start' }), 'Tocá «Iniciar» para que te guíe.'),
        F(S('maps', { v: 'nav', hl: 'sound' }), 'Te avisa con voz cuándo doblar. Con el parlante subís o bajás la voz; con la X terminás.'),
        F(S('maps', { v: 'place', hl: 'save' }), 'Con «Guardar» lo dejás en tus listas para la próxima vez.')
      ],
      pasos: {
        android: ['Abrí Google Maps y tocá “Buscá aquí”.', 'Escribí el lugar o la dirección y elegilo de la lista.', 'Tocá “Cómo llegar” y elegí el medio arriba: auto, transporte público o a pie.', 'Tocá “Iniciar” para que te guíe con voz. Para salir, tocá la X.', 'Para guardar el lugar, tocá “Guardar” y elegí una lista (Favoritos, Quiero ir).'],
        ios: ['Abrí Google Maps (si no lo tenés, bajalo gratis de App Store; el iPhone también trae Mapas de Apple, que funciona parecido).', 'Tocá “Buscá aquí”, escribí el lugar y elegilo.', 'Tocá “Cómo llegar” y elegí el medio arriba.', 'Tocá “Iniciar” para que te guíe con voz. Para salir, tocá la X.', 'Para guardar el lugar, tocá “Guardar” y elegí una lista.']
      },
      siNo: ['Si no te ubica bien, revisá que la ubicación del celular esté activada (bajá la barra de arriba y buscá “Ubicación”).', 'Si no escuchás las indicaciones, subí el volumen mientras te guía.'],
      quiz: [
        { q: '¿Qué botón tocás después de buscar el lugar?', o: ['Cómo llegar', 'Compartir', 'Llamar'], c: 0, e: '“Cómo llegar” te muestra las rutas y los tiempos.' },
        { q: '¿Para qué sirve “Guardar” un lugar?', o: ['Para encontrarlo rápido la próxima vez', 'Para comprar algo', 'Para avisarle al lugar'], c: 0, e: 'Queda en tus listas.' }
      ],
      ficha: ['Buscá aquí → Cómo llegar', 'Elegir medio → Iniciar', 'Guardar = tus lugares frecuentes']
    },
    {
      id: 'g-maps-bus', t: 'Viajá en colectivo, subte o tren', min: 6, nivel: 'basico',
      para: 'Vas a ver qué colectivo tomar, dónde subirte y bajarte, y cuánto caminar.',
      idea: ['En «Cómo llegar», el ícono del colectivo muestra las opciones en transporte público.', 'Cada opción indica la línea, el horario estimado y cuánto caminás.', 'Los horarios son estimados: el tránsito y el servicio pueden cambiar.'],
      demo: [
        F(S('maps', { v: 'route', mode: 'car', hl: 'bus' }), 'En «Cómo llegar», tocá el ícono del colectivo.'),
        F(S('maps', { v: 'route', mode: 'bus', transit: true, hl: 'opt0' }), 'Vas a ver varias opciones con la línea, los horarios y la caminata. Tocá la que prefieras.'),
        F(S('maps', { v: 'route', mode: 'bus', hl: 'steps' }), 'Con «Pasos» ves el recorrido detallado: dónde subir, cuántas paradas y dónde bajar.'),
        F(S('maps', { v: 'route', mode: 'bus', hl: 'start' }), 'Con «Iniciar», el celular te avisa cuándo te tenés que bajar.')
      ],
      pasos: {
        android: ['Buscá el destino y tocá “Cómo llegar”.', 'Tocá el ícono del colectivo (transporte público).', 'Elegí una opción: muestra la línea, los horarios y la caminata.', 'Tocá “Pasos” para ver la parada de subida y la de bajada.', 'Tocá “Iniciar” para que te avise en el camino.'],
        ios: ['Buscá el destino y tocá “Cómo llegar”.', 'Tocá el ícono del colectivo (transporte público).', 'Elegí una opción: muestra la línea, los horarios y la caminata.', 'Tocá “Pasos” para ver la parada de subida y la de bajada.', 'Tocá “Iniciar” para que te avise en el camino.']
      },
      siNo: ['Si no aparece transporte público, puede que esa zona no tenga datos cargados: probá con otra parada cercana.', 'Si te bajás antes, Maps recalcula el camino.'],
      quiz: [
        { q: '¿Dónde ves la parada donde bajarte?', o: ['En “Pasos”', 'En Guardado', 'En Contribuir'], c: 0, e: 'Los pasos muestran el recorrido detallado.' },
        { q: 'Los horarios del colectivo en Maps son…', o: ['Exactos siempre', 'Estimados: pueden cambiar'], c: 1, e: 'Dependen del tránsito y del servicio.' }
      ],
      ficha: ['Cómo llegar → ícono del colectivo', 'Elegir opción → Pasos', 'Iniciar = te avisa dónde bajar']
    },
    {
      id: 'g-maps-explorar', t: 'Encontrá lugares cerca: farmacias, cafés, horarios', min: 5, nivel: 'basico',
      para: 'Vas a encontrar la farmacia o el supermercado más cercano, ver si está abierto, sus opiniones y llamar.',
      idea: ['Los botones de arriba (Restaurantes, Farmacias, Supermercados) muestran lo que hay cerca.', 'Cada lugar dice si está abierto, a qué distancia queda y qué opinan otras personas.', 'Desde la ficha podés llamar, guardar o compartir el lugar por WhatsApp.'],
      demo: [
        F(S('maps', { hl: 'chip2' }), 'Tocá «Farmacias» (o lo que necesites) en los botones de arriba.'),
        F(S('maps', { q: 'Farmacias', results: [{ t: 'Farmacia Central', r: '4,6', d: '400 m', p: 6 }, { t: 'Farmacia del Sol', r: '4,4', d: '650 m', o: 'Cierra a las 21', p: 7 }], hl: 'res0' }), 'Vas a ver las más cercanas, si están abiertas y la distancia. Tocá una.'),
        F(S('maps', { v: 'place', place: { t: 'Farmacia Central', k: 'Farmacia', r: '4,6', n: '312', d: '400 m', o: 'Abierto · Cierra a las 22' }, ptab: 1, hl: 'tab1' }), 'En «Opiniones» ves lo que dicen otras personas.'),
        F(S('maps', { v: 'place', place: { t: 'Farmacia Central', k: 'Farmacia', r: '4,6', n: '312', d: '400 m', o: 'Abierto · Cierra a las 22' }, hl: 'call' }), 'Con «Llamar» te comunicás directo para preguntar.'),
        F(S('maps', { v: 'place', place: { t: 'Farmacia Central', k: 'Farmacia', r: '4,6', n: '312', d: '400 m', o: 'Abierto · Cierra a las 22' }, hl: 'share' }), 'Con «Compartir» mandás la dirección por WhatsApp.')
      ],
      pasos: {
        android: ['Abrí Maps y tocá un botón de arriba (Restaurantes, Farmacias…) o escribí lo que buscás: “farmacia”.', 'Mirá la lista: distancia, si está abierto y la puntuación.', 'Tocá un lugar para ver su ficha: horarios, opiniones y fotos.', 'Usá “Llamar”, “Guardar” o “Compartir”.'],
        ios: ['Abrí Maps y tocá un botón de arriba (Restaurantes, Farmacias…) o escribí lo que buscás: “farmacia”.', 'Mirá la lista: distancia, si está abierto y la puntuación.', 'Tocá un lugar para ver su ficha: horarios, opiniones y fotos.', 'Usá “Llamar”, “Guardar” o “Compartir”.']
      },
      siNo: ['Los horarios los cargan los comercios o los usuarios: si es importante, llamá antes de ir.', 'Si el lugar está mal ubicado, desde la ficha podés sugerir un cambio.'],
      quiz: [
        { q: '¿Dónde ves lo que opinan otras personas de un lugar?', o: ['En la pestaña Opiniones', 'En Ajustes', 'No se puede'], c: 0, e: 'Las opiniones están en la ficha del lugar.' },
        { q: 'El horario dice abierto, pero es feriado. ¿Qué conviene?', o: ['Llamar antes desde la ficha', 'Ir igual'], c: 0, e: 'Los horarios pueden no estar actualizados.' }
      ],
      ficha: ['Botones de arriba = lugares cerca', 'Ficha: horarios, opiniones, fotos', 'Llamar · Guardar · Compartir']
    },
    {
      id: 'g-maps-compartir', t: 'Compartí tu ubicación con la familia', min: 5, nivel: 'basico',
      para: 'Vas a mostrarle a alguien de confianza dónde estás, durante el tiempo que elijas, y cortarlo cuando quieras.',
      idea: ['Compartir la ubicación en tiempo real da tranquilidad cuando viajás o volvés tarde.', 'Elegís con quién y por cuánto tiempo. Se corta sola al terminar el tiempo, o antes si querés.', 'Mientras manejás o viajás, también podés compartir tu hora de llegada.'],
      demo: [
        F(S('maps', { hl: 'avatar' }), 'Tocá tu foto o tu inicial, arriba a la derecha.'),
        F(S('maps', { v: 'menu', hl: 'o2' }), 'Elegí «Compartir ubicación».'),
        F(S('maps', { v: 'share', time: 0, pick: 0, hl: 'p0' }), 'Elegí por cuánto tiempo y con quién (o mandalo por WhatsApp).'),
        F(S('maps', { v: 'share', time: 0, pick: 0, hl: 'ok' }), 'Tocá «Compartir». Para cortarlo antes, entrá de nuevo y tocá «Detener».'),
        F(S('maps', { v: 'route', mode: 'car', hl: 'shareEta' }), 'En un viaje, también podés compartir tu hora estimada de llegada.')
      ],
      pasos: {
        android: ['Abrí Google Maps y tocá tu foto o inicial (arriba a la derecha).', 'Elegí “Compartir ubicación”.', 'Elegí por cuánto tiempo (por ejemplo, 1 hora).', 'Elegí el contacto o la app (por ejemplo, WhatsApp) y tocá “Compartir”.', 'Para dejar de compartir: entrá de nuevo y tocá “Detener”.'],
        ios: ['Abrí Google Maps y tocá tu foto o inicial (arriba a la derecha).', 'Elegí “Compartir ubicación”.', 'Elegí por cuánto tiempo (por ejemplo, 1 hora).', 'Elegí el contacto o la app (por ejemplo, WhatsApp) y tocá “Compartir”.', 'Para dejar de compartir: entrá de nuevo y tocá “Detener”. En iPhone también podés usar la app Buscar.']
      },
      siNo: ['Si la otra persona no te ve, revisá que la ubicación del celular esté activada.', 'Para algo rápido, también podés mandar tu ubicación por WhatsApp.'],
      quiz: [
        { q: 'Compartiste tu ubicación por 1 hora. ¿Qué pasa al terminar?', o: ['Se sigue compartiendo', 'Se corta sola', 'Se borra Maps'], c: 1, e: 'Al terminar el tiempo elegido deja de compartirse.' },
        { q: '¿Con quién conviene compartirla?', o: ['Con cualquiera', 'Con personas de confianza'], c: 1, e: 'Tu ubicación es un dato personal.' }
      ],
      ficha: ['Tu foto → Compartir ubicación', 'Elegir tiempo y contacto', '“Detener” para cortarlo']
    },
    {
      id: 'g-fotos-copia', t: 'Que nunca se pierdan tus fotos', min: 6, nivel: 'basico',
      para: 'Vas a activar la copia de seguridad para que tus fotos queden guardadas aunque pierdas o cambies el celular.',
      idea: ['La copia de seguridad guarda tus fotos en tu cuenta, en internet.', 'Google da 15 GB gratis por cuenta, compartidos entre Gmail, Drive y Fotos. iCloud, en iPhone, da 5 GB gratis.', 'Con la copia activada, si cambiás de celular, entrás con tu cuenta y aparecen todas.'],
      demo: [
        F(home('Fotos'), 'Abrí Google Fotos.'),
        F(S('photos', { off: true, banner: 'La copia de seguridad está desactivada', hl: 'avatar' }), 'Tocá tu foto o tu inicial, arriba a la derecha.'),
        F(S('photos', { v: 'account', hl: 'o0' }), 'Tocá «Activar copia de seguridad».'),
        F(S('settings', { v: 'list', title: 'Copia de seguridad', items: [{ t: 'Copia de seguridad', tg: true }, { t: 'Calidad de la copia', s: 'Ahorro de espacio', blue: true }, { t: 'Usar datos móviles', s: 'Copiar solo con wifi', tg: false }], hl: 'r2' }), 'Dejá apagado «Usar datos móviles» para que copie solo con wifi.'),
        F(S('photos', { backing: true, banner: 'Copia de seguridad completa ✓' }), 'Cuando dice «copia completa», tus fotos ya están a salvo.')
      ],
      pasos: {
        android: ['Abrí Google Fotos (viene en casi todos los Android).', 'Tocá tu foto o inicial (arriba a la derecha).', 'Tocá “Activar copia de seguridad” (o Configuración de Fotos → Copia de seguridad).', 'Elegí la calidad: “Ahorro de espacio” rinde más los 15 GB gratis.', 'Dejá desactivado “Usar datos móviles” para que copie solo con wifi.'],
        ios: ['Opción 1, iCloud: Ajustes → tu nombre (arriba) → iCloud → Fotos → activá la sincronización. Tiene 5 GB gratis.', 'Opción 2, Google Fotos: bajala gratis de App Store y entrá con tu cuenta de Google.', 'En Google Fotos, tocá tu foto → “Activar copia de seguridad”.', 'Permití el acceso a “Todas las fotos” cuando lo pida.', 'La primera vez, dejá la app abierta con wifi y cargador hasta que termine.']
      },
      siNo: ['Si dice que no hay espacio, mirá la lección “Liberá espacio sin perder nada” antes de pagar más.', 'Si en iPhone avanza lento, dejá la app abierta con wifi y cargador.'],
      quiz: [
        { q: '¿Qué pasa con tus fotos si perdés el celular y tenías la copia activada?', o: ['Se pierden', 'Siguen en tu cuenta y las ves desde otro celular', 'Las tiene el que lo encontró'], c: 1, e: 'Quedan guardadas en tu cuenta.' },
        { q: '¿Cuánto espacio gratis da Google por cuenta?', o: ['15 GB compartidos entre Gmail, Drive y Fotos', 'Ilimitado', 'Nada'], c: 0, e: 'Son 15 GB para todo lo de esa cuenta.' }
      ],
      ficha: ['Fotos → tu foto → Activar copia', 'Solo con wifi', 'Google: 15 GB gratis · iCloud: 5 GB', '“Copia completa” = a salvo']
    },
    {
      id: 'g-fotos-buscar', t: 'Encontrá cualquier foto en segundos', min: 5, nivel: 'basico',
      para: 'Vas a buscar fotos escribiendo lo que aparece en ellas (“playa”, “torta”, “perro”), por persona o por lugar.',
      idea: ['Google Fotos reconoce lo que hay en tus fotos: podés buscar “cumpleaños”, “flores” o “Mendoza”.', 'También agrupa por personas y lugares.', 'Marcá con el corazón tus favoritas para encontrarlas rápido.'],
      demo: [
        F(S('photos', { hl: 'nav2' }), 'Tocá «Buscar», abajo.'),
        F(S('photos', { v: 'search', hl: 'q' }), 'Arriba escribí lo que buscás. Abajo ves personas y lugares.'),
        F(S('photos', { v: 'search', q: 'flores', hl: 'q' }), 'Escribí, por ejemplo, «flores»: aparecen todas las fotos con flores.', 'type'),
        F(S('photos', { v: 'search', hl: 'q' }), 'Tocá una persona para ver todas sus fotos juntas.'),
        F(S('photos', { v: 'photo', photo: 4, hl: 'share' }), 'Al abrir una foto, podés compartirla, editarla o marcarla como favorita.')
      ],
      pasos: {
        android: ['Abrí Google Fotos y tocá “Buscar” (abajo).', 'Escribí lo que aparece en la foto: “torta”, “playa”, “perro”.', 'O tocá una persona o un lugar de la lista.', 'Para marcar una favorita: abrila y tocá la estrella o el corazón.', 'Tus favoritas quedan en Colecciones → Favoritos.'],
        ios: ['Abrí Google Fotos y tocá “Buscar” (abajo). En la app Fotos de Apple, la lupa también busca por contenido.', 'Escribí lo que aparece en la foto: “torta”, “playa”, “perro”.', 'O tocá una persona o un lugar.', 'Para marcar una favorita: abrila y tocá el corazón o la estrella.', 'Tus favoritas quedan en Favoritos.']
      },
      siNo: ['Si no encuentra algo, probá con otra palabra o con el nombre del lugar.', 'Para que reconozca personas, puede pedirte activar la agrupación de rostros en la configuración.'],
      quiz: [
        { q: '¿Cómo encontrás las fotos de la playa?', o: ['Escribiendo “playa” en Buscar', 'Mirando una por una', 'No se puede'], c: 0, e: 'La app reconoce lo que hay en las fotos.' },
        { q: '¿Para qué sirve marcar favoritas?', o: ['Para encontrarlas rápido', 'Para borrarlas', 'Para pagar'], c: 0, e: 'Quedan juntas en Favoritos.' }
      ],
      ficha: ['Buscar = escribir lo que aparece', 'Personas y lugares', 'Corazón o estrella = favoritas']
    },
    {
      id: 'g-espacio', t: 'Liberá espacio sin perder nada', min: 6, nivel: 'intermedio',
      para: 'Vas a hacer lugar en el celular borrando solo lo que ya tiene copia o no sirve.',
      idea: ['Cuando el celular está lleno, se pone lento y no saca fotos.', 'Lo que más ocupa suele ser: fotos, videos y lo que llega por WhatsApp.', 'Regla de oro: primero confirmá que tus fotos tengan copia de seguridad. Recién ahí liberá espacio.'],
      demo: [
        F(S('settings', { v: 'list', title: 'Almacenamiento', items: [{ t: 'Imágenes y videos', s: '38 GB' }, { t: 'WhatsApp', s: '12 GB' }, { t: 'Aplicaciones', s: '9 GB' }, { t: 'Disponible', s: '1,2 GB de 64 GB', blue: true }], hl: 'r0' }), 'En los Ajustes del celular, mirá qué ocupa más lugar.'),
        F(S('photos', { v: 'account', backup: true, hl: 'o1' }), 'En Google Fotos, tocá tu foto y elegí «Liberar espacio».'),
        F(S('photos', { v: 'free', hl: 'ok' }), 'Te muestra cuánto vas a liberar. Las fotos siguen en tu cuenta.'),
        F(S('wa', { v: 'list', title: 'Administrar almacenamiento', items: [{ t: 'Más de 5 MB', i: 'video', s: '2,8 GB · videos reenviados' }, { t: 'Reenviados muchas veces', i: 'share', s: '1,1 GB' }, { t: 'Familia Pérez', i: 'users', s: '3,4 GB' }], hl: 'r0' }), 'En WhatsApp: Ajustes → Almacenamiento y datos → Administrar almacenamiento. Empezá por lo más pesado.'),
        F(S('wa', { v: 'list', title: 'Almacenamiento y datos', items: [{ t: 'Descarga automática con datos móviles', s: 'Fotos' }, { t: 'Descarga automática con wifi', s: 'Fotos, audio' }, { t: 'Calidad de subida de medios', s: 'Calidad estándar' }], hl: 'r1' }), 'Para que no se llene otra vez, sacá los videos de la descarga automática.')
      ],
      pasos: {
        android: ['Ajustes → Almacenamiento (en Samsung: Mantenimiento del dispositivo → Almacenamiento): mirá qué ocupa más.', 'Con la copia de seguridad completa, abrí Google Fotos → tu foto → “Liberar espacio”.', 'En WhatsApp: tres puntos → Ajustes → Almacenamiento y datos → Administrar almacenamiento. Borrá lo grande que no necesites.', 'En la misma pantalla, en “Descarga automática”, sacá los videos.', 'Desinstalá apps que no usás: mantené apretado el ícono → Desinstalar.'],
        ios: ['Ajustes → General → Almacenamiento del iPhone: mirá qué ocupa más y las recomendaciones.', 'Si usás Google Fotos con copia completa: tu foto → “Liberar espacio”. Si usás iCloud, activá “Optimizar almacenamiento” en Ajustes → Fotos.', 'En WhatsApp: Configuración → Almacenamiento y datos → Administrar almacenamiento.', 'En la misma pantalla, sacá los videos de la descarga automática.', 'En Almacenamiento del iPhone podés “Desinstalar app” sin perder sus datos.']
      },
      siNo: ['Si no aparece “Liberar espacio”, la copia todavía no terminó: esperá a que diga “copia completa”.', 'Si no estás seguro de borrar algo, no lo borres: preguntale a alguien de confianza.'],
      quiz: [
        { q: '¿Qué confirmás antes de usar “Liberar espacio”?', o: ['Que la copia esté completa', 'Que haya batería', 'Nada'], c: 0, e: 'Así las fotos siguen en tu cuenta.' },
        { q: '¿Qué evita que WhatsApp vuelva a llenar el celular?', o: ['Sacar los videos de la descarga automática', 'Salir de todos los grupos', 'Cambiar el fondo'], c: 0, e: 'Los videos reenviados son lo que más ocupa.' }
      ],
      ficha: ['Primero la copia, después liberar', 'Fotos → Liberar espacio', 'WhatsApp → Administrar almacenamiento', 'Descarga automática sin videos']
    },
    {
      id: 'g-drive', t: 'Tus papeles importantes en Drive', min: 6, nivel: 'intermedio',
      para: 'Vas a escanear recetas, estudios o recibos con el celular y guardarlos ordenados para encontrarlos cuando los necesites.',
      idea: ['Drive es un espacio para guardar documentos en tu cuenta de Google. Usa los mismos 15 GB gratis.', 'Con «Escanear», el celular saca la foto, endereza la hoja y la guarda como PDF.', 'Ponele un nombre claro (qué es y la fecha) y guardalo en una carpeta: Salud, Casa, Garantías.'],
      demo: [
        F(home('Drive'), 'Abrí Google Drive.'),
        F(S('drive', { hl: 'new' }), 'Tocá «+ Nuevo».'),
        F(S('drive', { v: 'new', hl: 'o2' }), 'Elegí «Escanear».'),
        F(S('drive', { v: 'scan', hl: 'shot' }), 'Apuntá a la hoja con buena luz. El celular la detecta y la endereza. Tocá el botón para sacar la foto.'),
        F(S('drive', { v: 'save', name: 'Receta presión - oct 2026', hl: 'name' }), 'Ponele un nombre claro.', 'type'),
        F(S('drive', { v: 'save', name: 'Receta presión - oct 2026', folder: 'Salud', hl: 'ok' }), 'Elegí la carpeta y tocá «Guardar». Después la encontrás con la búsqueda.'),
        F(S('drive', { v: 'file', hl: 'o1' }), 'Para mandarla, tocá los tres puntos del archivo y «Enviar una copia».')
      ],
      pasos: {
        android: ['Abrí Google Drive (si no lo tenés, bajalo gratis de Play Store).', 'Tocá “+ Nuevo” → “Escanear”.', 'Apuntá a la hoja con buena luz y sacá la foto. Podés sumar más páginas.', 'Tocá “Listo”, escribí un nombre claro y elegí la carpeta.', 'Para encontrarlo: usá “Buscar en Drive”. Para mandarlo: tres puntos → Enviar una copia.'],
        ios: ['Bajá Google Drive gratis de App Store y entrá con tu cuenta de Google.', 'Tocá “+” → “Escanear” (o “Usar cámara”, según la versión).', 'Apuntá a la hoja con buena luz y sacá la foto.', 'Escribí un nombre claro y elegí la carpeta.', 'Otra opción en iPhone: la app Notas también escanea documentos.']
      },
      siNo: ['Si la hoja sale torcida o con sombra, apoyala sobre una mesa oscura y sacala de frente.', 'Guardá copias de recetas, estudios o garantías. Fotos de documentos de identidad o tarjetas, mejor no.'],
      quiz: [
        { q: '¿Qué conviene guardar en Drive?', o: ['Copias de recetas, estudios y garantías', 'Las claves del banco', 'Nada'], c: 0, e: 'Documentos útiles sí; claves no.' },
        { q: '¿Cómo encontrás rápido un documento?', o: ['Con un nombre claro y la búsqueda', 'Mirando todas las fotos', 'Llamando a Google'], c: 0, e: 'Nombre claro + búsqueda.' }
      ],
      ficha: ['+ Nuevo → Escanear', 'Nombre: qué es + fecha', 'Carpetas: Salud, Casa, Garantías', 'Tres puntos → Enviar una copia']
    },
    {
      id: 'g-traductor', t: 'Traducí hablando y con la cámara', min: 5, nivel: 'basico',
      para: 'Vas a conversar con alguien que habla otro idioma y traducir carteles o menús apuntando con la cámara.',
      idea: ['El Traductor de Google es gratis y funciona con texto, voz y cámara.', 'El modo «Conversación» traduce a cada persona por turnos, en voz alta.', 'Si vas a viajar, descargá el idioma antes: así traduce sin internet.'],
      demo: [
        F(home('Traductor'), 'Abrí el Traductor de Google.'),
        F(S('translate', { hl: 'lb' }), 'Arriba elegí los dos idiomas: el tuyo y el de la otra persona.'),
        F(S('translate', { text: '¿Dónde queda la farmacia?', result: 'Where is the pharmacy?', hl: 'speak' }), 'Escribí o dictá una frase. Con el parlante la escuchás en el otro idioma.'),
        F(S('translate', { hl: 'conv' }), 'Para charlar, tocá «Conversación».'),
        F(S('translate', { v: 'conv', listening: 'a', hl: 'micA' }), 'Cada uno toca su micrófono y habla. El celular lo dice en el otro idioma.'),
        F(S('translate', { hl: 'cam' }), 'Para carteles o menús, tocá «Cámara».'),
        F(S('translate', { v: 'camera' }), 'Apuntá y lo ves traducido sobre la imagen.')
      ],
      pasos: {
        android: ['Abrí el Traductor de Google (si no lo tenés, bajalo gratis).', 'Arriba, elegí tu idioma y el de la otra persona.', 'Escribí o tocá el micrófono para dictar. Con el parlante lo escuchás.', 'Para charlar: tocá “Conversación” y hablen por turnos.', 'Para carteles: tocá “Cámara” y apuntá.', 'Antes de viajar: tu foto → “Idiomas descargados” → bajá el idioma.'],
        ios: ['Bajá el Traductor de Google gratis (el iPhone también trae la app Traducir de Apple).', 'Arriba, elegí tu idioma y el de la otra persona.', 'Escribí o tocá el micrófono para dictar. Con el parlante lo escuchás.', 'Para charlar: tocá “Conversación” y hablen por turnos.', 'Para carteles: tocá “Cámara” y apuntá.', 'Antes de viajar: tu foto → “Idiomas descargados” → bajá el idioma.']
      },
      siNo: ['Si no te entiende, hablá más despacio, en frases cortas.', 'Si la traducción suena rara, decilo de otra manera más simple.'],
      quiz: [
        { q: 'Vas a un lugar sin buena señal. ¿Qué hacés antes?', o: ['Descargo el idioma', 'Nada', 'Compro otro celular'], c: 0, e: 'Con el idioma descargado traduce sin internet.' },
        { q: '¿Qué opción usás para leer un menú en otro idioma?', o: ['Cámara', 'Conversación', 'Escritura'], c: 0, e: 'La cámara traduce lo que ves.' }
      ],
      ficha: ['Elegir los dos idiomas', 'Parlante = escuchar', 'Conversación = charla por turnos', 'Cámara = carteles', 'Descargar el idioma']
    },
    {
      id: 'g-lens', t: 'Buscá con la cámara: Google Lens', min: 5, nivel: 'intermedio',
      para: 'Vas a apuntar la cámara a una planta, un objeto o un texto y saber qué es, dónde comprarlo o copiar lo escrito.',
      idea: ['Google Lens busca en internet a partir de lo que ve la cámara o de una foto tuya.', 'Sirve para identificar plantas y objetos, encontrar un producto, traducir o copiar un texto de un papel.', 'Está en la app de Google (el ícono de la cámara en la búsqueda) y en Google Fotos.'],
      demo: [
        F(home('Google'), 'Abrí la app de Google.'),
        F(S('google', { hl: 'lens' }), 'Tocá el ícono de la cámara en la barra de búsqueda.'),
        F(S('google', { v: 'lens', photo: 4, hl: 'shot' }), 'Apuntá a lo que querés saber y tocá el botón de búsqueda.'),
        F(S('google', { v: 'lens', photo: 4, results: 'Lavanda (Lavandula)', hl: 'r1' }), 'Abajo aparecen los resultados: qué es, cómo cuidarlo o dónde comprarlo.'),
        F(S('photos', { v: 'photo', photo: 4, hl: 'lens' }), 'También funciona con fotos que ya tenés: abrila en Google Fotos y tocá «Lens».')
      ],
      pasos: {
        android: ['Abrí la app de Google y tocá el ícono de la cámara en la barra de búsqueda.', 'Apuntá a la planta, el objeto o el texto, y tocá el botón de búsqueda.', 'Mirá los resultados abajo. Elegí “Traducir” o “Texto” para trabajar con lo escrito.', 'Con una foto que ya tenés: abrila en Google Fotos → Lens.'],
        ios: ['Bajá la app de Google gratis de App Store.', 'Tocá el ícono de la cámara en la barra de búsqueda.', 'Apuntá y tocá el botón de búsqueda. Mirá los resultados abajo.', 'Con una foto que ya tenés: en Google Fotos, abrila → Lens. En la app Fotos de Apple también podés tocar el ícono de información.']
      },
      siNo: ['Si no reconoce bien, acercate, mejorá la luz y enfocá una sola cosa.', 'Para copiar un texto, elegí la opción “Texto”, marcá las palabras y tocá “Copiar”.'],
      quiz: [
        { q: '¿Para qué sirve Lens?', o: ['Para buscar en internet lo que ve la cámara', 'Para hacer llamadas', 'Para borrar fotos'], c: 0, e: 'Identifica objetos, plantas y textos.' },
        { q: '¿Funciona con fotos que ya sacaste?', o: ['Sí, desde Google Fotos', 'No'], c: 0, e: 'Abrí la foto y tocá Lens.' }
      ],
      ficha: ['App de Google → ícono de cámara', 'Apuntar → buscar', 'Texto: copiar o traducir', 'Google Fotos → Lens']
    },
    {
      id: 'g-calendar', t: 'Agenda y recordatorios con Calendar', min: 5, nivel: 'basico',
      para: 'Vas a anotar un turno médico o un cumpleaños y que el celular te avise antes.',
      idea: ['Google Calendar es una agenda en el celular: anotás eventos con día, hora y lugar.', 'Podés elegir que te avise un día antes, una hora antes o cuando quieras.', 'Si se repite (pagar una cuenta, tomar un remedio), configurás que se repita.'],
      demo: [
        F(home('Calendar'), 'Abrí Google Calendar (en iPhone también podés usar el Calendario del sistema).'),
        F(S('calendar', { hl: 'fab' }), 'Tocá el botón «+» para crear un evento.'),
        F(S('calendar', { v: 'new', title: 'Turno Dr. López', kb: true, hl: 'title' }), 'Escribí el título, por ejemplo «Turno Dr. López».', 'type'),
        F(S('calendar', { v: 'new', title: 'Turno Dr. López', hl: 'r1' }), 'Elegí el día y la hora.'),
        F(S('calendar', { v: 'new', title: 'Turno Dr. López', alert: '1 día antes', hl: 'r5' }), 'En la campanita elegí cuándo querés el aviso.'),
        F(S('calendar', { v: 'new', title: 'Turno Dr. López', alert: '1 día antes', hl: 'save' }), 'Tocá «Guardar». El día anterior, el celular te avisa.')
      ],
      pasos: same(['Abrí Google Calendar y tocá “+” → Evento.', 'Escribí el título.', 'Elegí el día y la hora (o “Todo el día” para cumpleaños).', 'En la campanita, elegí cuándo te avisa: 1 día antes, 1 hora antes…', 'Si se repite, tocá “No se repite” y elegí cada cuánto.', 'Tocá “Guardar”.'] as any),
      siNo: ['Si no te llega el aviso, revisá que Calendar tenga permiso de notificaciones en los Ajustes del celular.', 'Para borrar un evento, abrilo y tocá el tacho.'],
      quiz: [
        { q: '¿Cómo hacés que te avise un día antes?', o: ['En la campanita del evento', 'No se puede', 'Llamando'], c: 0, e: 'Ahí elegís cuándo te avisa.' },
        { q: 'Tenés que pagar una cuenta todos los meses. ¿Qué configurás?', o: ['Que el evento se repita cada mes', 'Un evento nuevo cada vez'], c: 0, e: 'La opción “se repite” lo hace por vos.' }
      ],
      ficha: ['+ → Evento', 'Título, día y hora', 'Campanita = aviso', 'Repetir cada mes o semana']
    }
  ]
};
function same(a: string[]) { return { android: a, ios: a }; }
void store;
