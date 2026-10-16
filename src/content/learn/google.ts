import { type Module, type Screen, F, home, app, list, T } from './shared';

const tr = (blocks: any[], hl?: string): Screen => app('Traductor', blocks, hl, { tone: T.tr, back: false });
const drive = (blocks: any[], hl?: string, extra: any = {}): Screen => app('Drive', blocks, hl, { tone: T.drive, back: false, ...extra });
const cuenta = (hl: number, items?: any[]) => list('Tu cuenta', items || [{ t: 'Copia de seguridad', s: 'Activada · 2,1 GB usados de 15 GB', i: 'nube' }, { t: 'Liberar espacio', s: 'Borra del celular lo que ya tiene copia', i: 'borrar' }, { t: 'Configuración de Fotos', i: 'ajustes' }], hl);

export const GOOGLE: Module = {
  id: 'google', n: 'Google en tu celular', apps: 'Maps, Fotos, Drive y Traductor', tone: 'amber', section: 'digital',
  desc: 'Llegar a cualquier lado, cuidar tus fotos, guardar tus papeles y traducir hablando.',
  temas: ['Cómo llegar en colectivo, auto o a pie', 'Compartir tu ubicación', 'Copia de tus fotos', 'Liberar espacio', 'Tus papeles en Drive', 'Traducir hablando'],
  lessons: [
    {
      id: 'g-maps-ir', t: 'Llegá a cualquier lado con Maps', min: 6, nivel: 'basico',
      para: 'Vas a buscar un lugar, ver cómo llegar en colectivo, auto o caminando y seguir las indicaciones con voz.',
      idea: ['Google Maps te muestra el camino y cuánto vas a tardar con cada medio de transporte.', 'En colectivo te dice qué línea tomar, dónde bajarte y cuánto caminar.', 'Guardá tus lugares frecuentes (casa, médico, club) para no buscarlos cada vez.'],
      demo: [
        F(home('Maps'), 'Abrí Google Maps.'),
        F({ k: 'map', hl: 'search' }, 'Tocá la barra de búsqueda de arriba.'),
        F({ k: 'map', q: 'Hospital Central', place: 'Hospital Central', hl: 'dir' }, 'Escribí el lugar y tocá «Cómo llegar».', 'type'),
        F({ k: 'map', q: 'Hospital Central', route: true, mode: 'bus', hl: 'bus' }, 'Elegí cómo vas: auto, colectivo o a pie. Cada uno muestra cuánto tardás.'),
        F({ k: 'map', q: 'Hospital Central', route: true, mode: 'bus', hl: 'start' }, 'Tocá «Iniciar» y seguí las indicaciones con voz.'),
        F({ k: 'map', q: 'Hospital Central', place: 'Hospital Central', hl: 'save' }, 'Con «Guardar» lo dejás en tus lugares para la próxima vez.')
      ],
      pasos: {
        android: ['Abrí Google Maps.', 'Tocá la barra de búsqueda (arriba) y escribí el lugar o la dirección.', 'Tocá “Cómo llegar”.', 'Arriba elegí el medio: auto, transporte público o a pie.', 'Tocá “Iniciar” para que te guíe con voz. Para salir, tocá la X.', 'Para guardar el lugar, tocá “Guardar” y elegí una lista (por ejemplo, Favoritos).'],
        ios: ['Abrí Google Maps (si no lo tenés, bajalo gratis de App Store; el iPhone también trae Mapas de Apple, que funciona parecido).', 'Tocá la barra de búsqueda (arriba) y escribí el lugar o la dirección.', 'Tocá “Cómo llegar”.', 'Arriba elegí el medio: auto, transporte público o a pie.', 'Tocá “Iniciar” para que te guíe con voz. Para salir, tocá la X.', 'Para guardar el lugar, tocá “Guardar” y elegí una lista.']
      },
      siNo: ['Si no te ubica bien, revisá que la ubicación del celular esté activada (bajá la barra de arriba y buscá “Ubicación”).', 'Si los horarios del colectivo no coinciden, tomalos como aproximados: el tránsito y el servicio pueden cambiar.', 'Si no escuchás las indicaciones, subí el volumen mientras te guía.'],
      quiz: [
        { q: '¿Qué botón tocás después de buscar el lugar?', o: ['Cómo llegar', 'Compartir', 'Fotos'], c: 0, e: '“Cómo llegar” te muestra las rutas y los tiempos.' },
        { q: '¿Para qué sirve “Guardar” un lugar?', o: ['Para encontrarlo rápido la próxima vez', 'Para comprar algo', 'Para avisarle al lugar que vas'], c: 0, e: 'Queda en tus listas y no tenés que buscarlo de nuevo.' }
      ],
      ficha: ['Buscar → Cómo llegar → elegir medio → Iniciar', 'Colectivo: línea, parada y caminata', 'Guardar = tus lugares frecuentes', 'Ubicación activada para que te encuentre']
    },
    {
      id: 'g-maps-compartir', t: 'Compartí tu ubicación con la familia', min: 5, nivel: 'basico',
      para: 'Vas a mostrarle a alguien de confianza dónde estás, durante el tiempo que elijas, y cortarlo cuando quieras.',
      idea: ['Compartir la ubicación en tiempo real da tranquilidad cuando viajás o volvés tarde.', 'Elegís con quién y por cuánto tiempo. Se corta sola al terminar el tiempo, o antes si vos querés.', 'Compartila solo con personas de confianza.'],
      demo: [
        F(app('Google Maps', [{ b: 'card', t: 'Tu perfil', s: 'Tocá tu foto, arriba a la derecha', i: 'persona', id: 'perf' }, { b: 'img', t: 'Mapa', tone: 6 }], 'perf', { tone: T.maps, back: false }), 'Tocá tu foto o tu inicial, arriba a la derecha.'),
        F(list('Tu cuenta', [{ t: 'Tu perfil', i: 'persona' }, { t: 'Compartir ubicación', i: 'ubicacion' }, { t: 'Modo incógnito', i: 'ojo' }, { t: 'Configuración', i: 'ajustes' }], 1), 'Elegí «Compartir ubicación».'),
        F(app('Compartir ubicación', [{ b: 'chips', items: ['1 hora', 'Hasta que la desactives'], on: 0, hl: 0 }, { b: 'rows', items: [{ t: 'Hija', s: 'Contacto', i: 'persona' }, { t: 'WhatsApp', i: 'whatsapp' }], hl: 0 }, { b: 'btn', t: 'Compartir', id: 'ok' }], 'ok', { tone: T.maps }), 'Elegí por cuánto tiempo y con quién. Después tocá «Compartir».'),
        F(app('Compartir ubicación', [{ b: 'card', t: 'Compartiendo con Hija', s: 'Queda 1 hora', i: 'ubicacion' }, { b: 'btn', t: 'Detener', tone: 'danger', id: 'stop' }], 'stop', { tone: T.maps }), 'Para cortarlo antes, entrá de nuevo y tocá «Detener».')
      ],
      pasos: {
        android: ['Abrí Google Maps y tocá tu foto o inicial (arriba a la derecha).', 'Elegí “Compartir ubicación”.', 'Elegí por cuánto tiempo (por ejemplo, 1 hora).', 'Elegí el contacto o la app (por ejemplo, WhatsApp) y tocá “Compartir”.', 'Para dejar de compartir: entrá de nuevo y tocá “Detener”.'],
        ios: ['Abrí Google Maps y tocá tu foto o inicial (arriba a la derecha).', 'Elegí “Compartir ubicación”.', 'Elegí por cuánto tiempo (por ejemplo, 1 hora).', 'Elegí el contacto o la app (por ejemplo, WhatsApp) y tocá “Compartir”.', 'Para dejar de compartir: entrá de nuevo y tocá “Detener”. En iPhone también podés usar la app Buscar para compartir con tu familia.']
      },
      siNo: ['Si la otra persona no te ve, revisá que la ubicación del celular esté activada.', 'Para algo rápido, también podés mandar tu ubicación por WhatsApp (lección “Mandá fotos, documentos y tu ubicación”).'],
      quiz: [
        { q: 'Compartiste tu ubicación por 1 hora. ¿Qué pasa al terminar?', o: ['Se sigue compartiendo para siempre', 'Se corta sola', 'Se borra Maps'], c: 1, e: 'Al terminar el tiempo elegido deja de compartirse.' },
        { q: '¿Con quién conviene compartir tu ubicación?', o: ['Con cualquiera que la pida', 'Solo con personas de confianza'], c: 1, e: 'Tu ubicación es un dato sensible.' }
      ],
      ficha: ['Tu foto (arriba) → Compartir ubicación', 'Elegir tiempo y contacto', '“Detener” para cortarlo', 'Solo con personas de confianza']
    },
    {
      id: 'g-fotos-copia', t: 'Que nunca se pierdan tus fotos', min: 6, nivel: 'basico',
      para: 'Vas a activar la copia de seguridad para que tus fotos queden guardadas aunque pierdas o cambies el celular.',
      idea: ['La copia de seguridad guarda tus fotos en la nube: un espacio en internet asociado a tu cuenta.', 'Google da 15 GB gratis por cuenta, compartidos entre Gmail, Drive y Fotos. iCloud, en iPhone, da 5 GB gratis.', 'Con la copia activada, si cambiás de celular, entrás con tu cuenta y aparecen todas.'],
      demo: [
        F(home('Fotos'), 'Abrí Google Fotos.'),
        F({ k: 'photos', title: 'Fotos', bannerHl: true, banner: 'La copia de seguridad está desactivada' }, 'Tocá tu foto o tu inicial, arriba a la derecha.'),
        F(cuenta(0, [{ t: 'Activar copia de seguridad', s: 'Tus fotos quedan guardadas en tu cuenta', i: 'nube', toggle: true }, { t: 'Configuración de Fotos', i: 'ajustes' }]), 'Tocá «Activar copia de seguridad».'),
        F(list('Copia de seguridad', [{ t: 'Copia de seguridad', toggle: true, on: true }, { t: 'Calidad', s: 'Ahorro de espacio' }, { t: 'Usar datos móviles', s: 'Solo con wifi', toggle: true }], 2), 'Elegí que copie solo con wifi para no gastar datos.'),
        F({ k: 'photos', title: 'Fotos', banner: 'Copia de seguridad completa ✓' }, 'Cuando aparece «copia completa», tus fotos ya están a salvo.')
      ],
      pasos: {
        android: ['Abrí Google Fotos (viene en casi todos los Android).', 'Tocá tu foto o inicial (arriba a la derecha).', 'Tocá “Activar copia de seguridad” (o entrá a Configuración de Fotos → Copia de seguridad).', 'Elegí la calidad: “Ahorro de espacio” rinde más los 15 GB gratis.', 'Desactivá “Usar datos móviles” para que copie solo con wifi.'],
        ios: ['Opción 1, iCloud: Ajustes → tu nombre (arriba) → iCloud → Fotos → activá “Sincronizar este iPhone”. Tiene 5 GB gratis.', 'Opción 2, Google Fotos: bajala gratis de App Store y entrá con tu cuenta de Google.', 'En Google Fotos, tocá tu foto (arriba a la derecha) → “Activar copia de seguridad”.', 'Permití el acceso a “Todas las fotos” cuando lo pida.', 'Dejá la app abierta con wifi la primera vez: en iPhone copia mejor con la app abierta.']
      },
      siNo: ['Si dice que no hay espacio, revisá cuánto usás en tu cuenta. Antes de pagar más espacio, mirá la lección “Liberá espacio sin perder nada”.', 'Si en iPhone la copia avanza lento, conectá el cargador y dejá la app abierta con wifi.'],
      quiz: [
        { q: '¿Qué pasa con tus fotos si perdés el celular y tenías la copia activada?', o: ['Se pierden', 'Siguen en tu cuenta y las ves desde otro celular', 'Las tiene el que lo encontró'], c: 1, e: 'Quedan guardadas en tu cuenta.' },
        { q: '¿Cuánto espacio gratis da Google por cuenta?', o: ['15 GB compartidos entre Gmail, Drive y Fotos', 'Ilimitado', 'Nada'], c: 0, e: 'Son 15 GB para todo lo de esa cuenta.' }
      ],
      ficha: ['Fotos → tu foto → Activar copia de seguridad', 'Solo con wifi', 'Google: 15 GB gratis · iCloud: 5 GB gratis', '“Copia completa” = fotos a salvo']
    },
    {
      id: 'g-espacio', t: 'Liberá espacio sin perder nada', min: 6, nivel: 'intermedio',
      para: 'Vas a hacer lugar en el celular borrando solo lo que ya tiene copia o no sirve.',
      idea: ['Cuando el celular está lleno, se pone lento y no saca fotos.', 'Lo que más ocupa suele ser: fotos y videos, y los archivos que llegan por WhatsApp.', 'Regla de oro: primero confirmá que tus fotos tengan copia de seguridad. Recién ahí liberá espacio.'],
      demo: [
        F(list('Almacenamiento', [{ t: 'Fotos y videos', s: '38 GB', i: 'galeria' }, { t: 'WhatsApp', s: '12 GB', i: 'whatsapp' }, { t: 'Apps', s: '9 GB', i: 'cel' }, { t: 'Libre', s: '1,2 GB de 64 GB' }], 0), 'Mirá qué ocupa más lugar en los Ajustes del celular.'),
        F(cuenta(1), 'En Google Fotos, tocá tu foto y elegí «Liberar espacio». Borra del celular solo lo que ya tiene copia.'),
        F(app('Liberar espacio', [{ b: 'big', t: '18,4 GB', s: 'Podés liberar esto: tus fotos siguen en tu cuenta' }, { b: 'btn', t: 'Liberar 18,4 GB', id: 'ok' }], 'ok', { tone: '#d0663a' }), 'Confirmá. Las fotos se siguen viendo en Google Fotos.'),
        F(list('WhatsApp · Almacenamiento', [{ t: 'Administrar almacenamiento', s: '12 GB', i: 'carpeta' }, { t: 'Más de 5 MB', s: '2,8 GB · videos reenviados', i: 'video' }, { t: 'Reenviados muchas veces', s: '1,1 GB', i: 'share' }], 1), 'En WhatsApp: Ajustes → Almacenamiento y datos → Administrar almacenamiento. Empezá por los archivos grandes.'),
        F(list('Ajustes de WhatsApp', [{ t: 'Descarga automática', s: 'Fotos: solo wifi · Videos: nunca', i: 'descargar' }], 0), 'Para que no se llene otra vez, desactivá la descarga automática de videos.')
      ],
      pasos: {
        android: ['Ajustes → Almacenamiento (o Mantenimiento del dispositivo en Samsung): mirá qué ocupa más.', 'Con la copia de seguridad completa, abrí Google Fotos → tu foto → “Liberar espacio”.', 'En WhatsApp: tres puntos → Ajustes → Almacenamiento y datos → Administrar almacenamiento. Borrá los archivos grandes que no necesites.', 'En la misma pantalla, en “Descarga automática”, elegí que los videos no se descarguen solos.', 'Desinstalá las apps que no usás: mantené apretado el ícono → Desinstalar.'],
        ios: ['Ajustes → General → Almacenamiento del iPhone: mirá qué ocupa más y las recomendaciones.', 'Si usás Google Fotos con copia completa: tu foto → “Liberar espacio”. Si usás iCloud, activá “Optimizar almacenamiento” en Ajustes → Fotos.', 'En WhatsApp: Configuración → Almacenamiento y datos → Administrar almacenamiento. Borrá los archivos grandes que no necesites.', 'En la misma pantalla, elegí que los videos no se descarguen solos.', 'En Almacenamiento del iPhone podés “Desinstalar app” sin perder sus datos.']
      },
      siNo: ['Si no aparece “Liberar espacio”, es porque la copia todavía no terminó: esperá a que diga “copia completa”.', 'Si no sabés si borrar algo, no lo borres: preguntale a alguien de confianza.'],
      quiz: [
        { q: '¿Qué tenés que confirmar antes de usar “Liberar espacio”?', o: ['Que la copia de seguridad esté completa', 'Que tengas batería al 100%', 'Nada'], c: 0, e: 'Así las fotos siguen en tu cuenta aunque se borren del celular.' },
        { q: '¿Qué evita que WhatsApp vuelva a llenar el celular?', o: ['Desactivar la descarga automática de videos', 'Salir de todos los grupos', 'Cambiar el fondo'], c: 0, e: 'Los videos reenviados son lo que más ocupa.' }
      ],
      ficha: ['Primero la copia, después liberar', 'Fotos → tu foto → Liberar espacio', 'WhatsApp → Administrar almacenamiento', 'Descarga automática de videos: desactivada']
    },
    {
      id: 'g-drive', t: 'Tus papeles importantes en Drive', min: 6, nivel: 'intermedio',
      para: 'Vas a escanear recetas, estudios o recibos con el celular y guardarlos ordenados para encontrarlos cuando los necesites.',
      idea: ['Drive es un espacio para guardar documentos en tu cuenta de Google. Usa los mismos 15 GB gratis.', 'Con la opción “Escanear”, el celular saca la foto, endereza la hoja y la guarda como PDF.', 'Guardá ahí copias de estudios médicos, recetas o garantías. No guardes fotos del DNI ni de tarjetas, ni claves.'],
      demo: [
        F(home('Drive'), 'Abrí Google Drive.'),
        F(drive([{ b: 'search', t: 'Buscar en Drive' }, { b: 'rows', items: [{ t: 'Salud', i: 'carpeta' }, { t: 'Casa y servicios', i: 'carpeta' }, { t: 'Garantías', i: 'carpeta' }] }, { b: 'btn', t: '+  Nuevo', id: 'new' }], 'new'), 'Tocá el botón «+ Nuevo».'),
        F({ k: 'sheet', base: drive([{ b: 'rows', items: [{ t: 'Salud', i: 'carpeta' }] }]), grid: true, items: [{ t: 'Carpeta', i: 'carpeta' }, { t: 'Subir', i: 'subir' }, { t: 'Escanear', i: 'camara' }], hl: 2 }, 'Elegí «Escanear».'),
        F(app('Escanear', [{ b: 'img', t: 'Receta Dr. López', tone: 2, id: 'hoja' }, { b: 'text', t: 'Apoyá la hoja sobre una mesa oscura, con buena luz', muted: true }, { b: 'btn', t: 'Guardar', id: 'ok' }], 'hoja', { tone: '#444b52' }), 'Apuntá a la hoja con buena luz. El celular la endereza solo.'),
        F(app('Guardar en Drive', [{ b: 'input', t: 'Receta presión - octubre 2026', id: 'nom' }, { b: 'card', t: 'Carpeta: Salud', i: 'carpeta' }, { b: 'btn', t: 'Guardar', id: 'ok' }], 'nom', { tone: T.drive }), 'Ponele un nombre claro y elegí la carpeta. Así la encontrás con la lupa.', 'type')
      ],
      pasos: {
        android: ['Abrí Google Drive (si no lo tenés, bajalo gratis de Play Store).', 'Tocá “+ Nuevo” (abajo a la derecha) → “Escanear”.', 'Apuntá a la hoja con buena luz y sacá la foto. Podés sumar más páginas con “+”.', 'Tocá “Listo”, escribí un nombre claro (qué es y la fecha) y elegí la carpeta.', 'Para encontrarlo después, usá la lupa y escribí una palabra del nombre.'],
        ios: ['Bajá Google Drive gratis de App Store y entrá con tu cuenta de Google.', 'Tocá “+” (abajo a la derecha) y elegí “Escanear” o “Usar cámara”, según la versión.', 'Apuntá a la hoja con buena luz y sacá la foto.', 'Escribí un nombre claro (qué es y la fecha) y elegí la carpeta.', 'Otra opción en iPhone: la app Notas también escanea (clip o cámara → Escanear documentos).']
      },
      siNo: ['Si la hoja sale torcida o con sombra, apoyala sobre una mesa oscura y sacala de frente.', 'Para mandarle un documento a alguien, abrilo, tocá los tres puntos y “Compartir” o “Enviar una copia”.'],
      quiz: [
        { q: '¿Qué conviene guardar en Drive?', o: ['Copias de recetas, estudios y garantías', 'La foto del DNI y las claves del banco', 'Nada, es peligroso'], c: 0, e: 'Documentos útiles sí; claves y DNI, no.' },
        { q: '¿Cómo encontrás rápido un documento?', o: ['Con un nombre claro y la lupa', 'Mirando todas las fotos', 'Llamando a Google'], c: 0, e: 'Nombre claro + lupa = lo encontrás en segundos.' }
      ],
      ficha: ['+ Nuevo → Escanear', 'Nombre claro: qué es + fecha', 'Carpetas: Salud, Casa, Garantías', 'Nunca: DNI, tarjetas ni claves']
    },
    {
      id: 'g-traductor', t: 'Traducí hablando y con la cámara', min: 5, nivel: 'basico',
      para: 'Vas a conversar con alguien que habla otro idioma y traducir carteles o menús apuntando con la cámara.',
      idea: ['El Traductor de Google es gratis y funciona con texto, voz y cámara.', 'El modo conversación traduce a cada persona por turnos, en voz alta.', 'Si vas a viajar, descargá el idioma antes: así traduce sin internet.'],
      demo: [
        F(home('Traductor'), 'Abrí el Traductor de Google.'),
        F(tr([{ b: 'tabs', items: ['Español', '⇄', 'Inglés'], on: 0, hl: 2 }, { b: 'input', t: 'Ingresá texto', ph: true }, { b: 'tiles', items: [{ t: 'Conversación', i: 'persona' }, { t: 'Voz', i: 'mic' }, { t: 'Cámara', i: 'camara' }, { t: 'Escritura', i: 'texto' }] }], undefined), 'Arriba elegí los dos idiomas: el tuyo y el de la otra persona.'),
        F(tr([{ b: 'tabs', items: ['Español', '⇄', 'Inglés'], on: 0 }, { b: 'tiles', items: [{ t: 'Conversación', i: 'persona' }, { t: 'Voz', i: 'mic' }, { t: 'Cámara', i: 'camara' }, { t: 'Escritura', i: 'texto' }], hl: 0 }]), 'Para charlar, tocá «Conversación».'),
        F(tr([{ b: 'card', t: '¿Dónde queda la estación de tren?', s: 'Español', i: 'mic' }, { b: 'card', t: 'Where is the train station?', s: 'Inglés · se escucha en voz alta', i: 'voz' }, { b: 'tiles', items: [{ t: 'Hablar en español', i: 'mic' }, { t: 'Hablar en inglés', i: 'mic' }], hl: 0 }]), 'Hablá y el celular lo dice en el otro idioma. Después habla la otra persona.'),
        F(tr([{ b: 'img', t: 'MENU → MENÚ: Sopa del día · Pollo asado', tone: 4, id: 'cam' }, { b: 'text', t: 'Apuntá al cartel o al menú', muted: true }], 'cam'), 'Con «Cámara», apuntá a un cartel o un menú y lo ves traducido.')
      ],
      pasos: {
        android: ['Abrí el Traductor de Google (si no lo tenés, bajalo gratis de Play Store).', 'Arriba, elegí tu idioma y el de la otra persona.', 'Para charlar: tocá “Conversación” y hablá por turnos.', 'Para carteles o menús: tocá “Cámara” y apuntá.', 'Antes de viajar: tocá tu foto → “Idiomas descargados” y bajá el idioma para usarlo sin internet.'],
        ios: ['Bajá el Traductor de Google gratis de App Store (el iPhone también trae la app Traducir de Apple).', 'Arriba, elegí tu idioma y el de la otra persona.', 'Para charlar: tocá “Conversación” y hablá por turnos.', 'Para carteles o menús: tocá “Cámara” y apuntá.', 'Antes de viajar: tocá tu foto → “Idiomas descargados” y bajá el idioma para usarlo sin internet.']
      },
      siNo: ['Si no te entiende, hablá más despacio, en frases cortas.', 'Si la traducción suena rara, decilo de otra manera más simple.'],
      quiz: [
        { q: 'Vas a viajar a un lugar sin buena señal. ¿Qué hacés antes?', o: ['Descargo el idioma en el Traductor', 'Nada', 'Compro otro celular'], c: 0, e: 'Con el idioma descargado traduce sin internet.' },
        { q: '¿Qué opción usás para leer un menú en otro idioma?', o: ['Cámara', 'Conversación', 'Escritura'], c: 0, e: 'La cámara traduce lo que ves.' }
      ],
      ficha: ['Elegir los dos idiomas arriba', 'Conversación = charla por turnos', 'Cámara = carteles y menús', 'Descargar el idioma antes de viajar']
    }
  ]
};
