import { type Module, type Screen, F, home, app, list, T } from './shared';

const fb = (blocks: any[], hl?: string, extra: any = {}): Screen => app('Facebook', blocks, hl, { tone: T.fb, back: false, ...extra });
const yt = (blocks: any[], hl?: string, extra: any = {}): Screen => app('YouTube', blocks, hl, { tone: T.yt, back: false, ...extra });
const ig = (blocks: any[], hl?: string, extra: any = {}): Screen => app('Instagram', blocks, hl, { tone: T.ig, back: false, ...extra });

export const REDES: Module = {
  id: 'redes', n: 'Redes sociales', apps: 'Facebook, Instagram, YouTube y TikTok', tone: 'sky', section: 'digital',
  desc: 'Disfrutar las redes con privacidad y criterio: lo que vale la pena, sin trampas.',
  temas: ['Privacidad en Facebook', 'Perfiles falsos', 'Noticias falsas', 'YouTube a tu medida', 'Instagram con la familia', 'Videos cortos sin perder horas'],
  lessons: [
    {
      id: 'r-privacidad', t: 'Facebook privado: elegí quién ve lo tuyo', min: 7, nivel: 'basico',
      para: 'Vas a revisar tu privacidad para que tus fotos y datos los vean solo tus amigos.',
      idea: ['Cada publicación tiene un “público”: Público (cualquiera en internet), Amigos o Solo yo.', 'La “Comprobación de privacidad” de Facebook te guía paso a paso por lo más importante.', 'Lo ideal: publicaciones para Amigos y tu lista de amigos visible solo para vos. Los estafadores usan esos datos.'],
      demo: [
        F(fb([{ b: 'card', t: 'Menú', s: 'Tu foto o las tres rayitas', i: 'menu', id: 'm' }, { b: 'img', t: 'Inicio', tone: 1 }], 'm'), 'Abrí Facebook y tocá el menú: tu foto o las tres rayitas.'),
        F(list('Menú', [{ t: 'Configuración y privacidad', i: 'ajustes' }, { t: 'Ayuda y asistencia', i: 'doc' }, { t: 'Cerrar sesión' }], 0), 'Entrá a «Configuración y privacidad» y después a «Configuración».'),
        F(list('Configuración', [{ t: 'Comprobación de privacidad', s: 'Revisá lo más importante', i: 'candado' }, { t: 'Publicaciones', i: 'doc' }, { t: 'Bloqueos', i: 'bloquear' }], 0), 'Tocá «Comprobación de privacidad».'),
        F(list('Quién puede ver lo que compartís', [{ t: 'Publicaciones futuras', s: 'Amigos' }, { t: 'Lista de amigos', s: 'Solo yo' }, { t: 'Fecha de nacimiento', s: 'Solo yo' }, { t: 'Teléfono y correo', s: 'Solo yo' }], 1), 'Elegí «Amigos» para tus publicaciones y «Solo yo» para tu lista de amigos y tus datos.'),
        F(fb([{ b: 'input', t: '¿Qué estás pensando?', ph: true }, { b: 'chips', items: ['Público', 'Amigos', 'Solo yo'], on: 1, hl: 1 }, { b: 'btn', t: 'Publicar' }]), 'Cada vez que publiques, mirá el público debajo de tu nombre antes de tocar «Publicar».')
      ],
      pasos: {
        android: ['Abrí Facebook y tocá el menú (tu foto o las tres rayitas, arriba o abajo a la derecha).', 'Tocá la rueda o “Configuración y privacidad” → “Configuración”.', 'Entrá a “Comprobación de privacidad” y seguí los pasos.', 'En “Quién puede ver lo que compartís”, elegí “Amigos” para publicaciones y “Solo yo” para la lista de amigos, teléfono y fecha de nacimiento.', 'Al publicar, revisá el público debajo de tu nombre.'],
        ios: ['Abrí Facebook y tocá el menú (tu foto o las tres rayitas, abajo a la derecha).', 'Tocá la rueda o “Configuración y privacidad” → “Configuración”.', 'Entrá a “Comprobación de privacidad” y seguí los pasos.', 'En “Quién puede ver lo que compartís”, elegí “Amigos” para publicaciones y “Solo yo” para la lista de amigos, teléfono y fecha de nacimiento.', 'Al publicar, revisá el público debajo de tu nombre.']
      },
      siNo: ['Los menús de Facebook cambian seguido. Si no encontrás algo, en Configuración usá la lupa y escribí “privacidad”.', 'Para cambiar el público de algo que ya publicaste: tocá los tres puntos de esa publicación → “Editar privacidad”.'],
      quiz: [
        { q: '¿Quién ve una publicación con público “Público”?', o: ['Solo mis amigos', 'Cualquier persona en internet', 'Nadie'], c: 1, e: '“Público” significa que la puede ver cualquiera.' },
        { q: '¿Por qué conviene ocultar tu lista de amigos?', o: ['Porque los estafadores la usan para hacerse pasar por conocidos', 'Porque ocupa espacio', 'No conviene'], c: 0, e: 'Con tu lista arman perfiles falsos creíbles.' }
      ],
      ficha: ['Menú → Configuración y privacidad → Configuración', 'Comprobación de privacidad', 'Publicaciones: Amigos', 'Lista de amigos y datos: Solo yo']
    },
    {
      id: 'r-falsos', t: 'Perfiles falsos y solicitudes raras', min: 6, nivel: 'basico',
      para: 'Vas a reconocer un perfil falso y saber bloquearlo y denunciarlo.',
      idea: ['Señales de perfil falso: perfil nuevo, pocas fotos, pocos amigos en común, o alguien que “ya es tu amigo” y te manda otra solicitud.', 'Otra señal: apuro, halagos o historias tristes que terminan pidiendo plata, regalos o datos.', 'Si un conocido te escribe desde una cuenta nueva, confirmá por teléfono antes de responder.'],
      demo: [
        F(fb([{ b: 'card', t: 'Solicitud de amistad: Carlos Pérez', s: '0 amigos en común · perfil creado hace 3 días', i: 'persona', id: 'sol' }, { b: 'card', t: 'Carlos Pérez', s: 'Ya es tu amigo desde 2019', i: 'persona' }]), 'Si alguien que ya es tu amigo te manda otra solicitud, es casi seguro una copia.'),
        F(fb([{ b: 'img', t: 'Carlos Pérez', tone: 2 }, { b: 'rows', items: [{ t: 'Se unió en octubre de 2026', i: 'reloj' }, { t: '2 fotos · 12 amigos', i: 'galeria' }, { t: 'Sin publicaciones', i: 'doc' }] }]), 'Mirá el perfil: si es muy nuevo, con pocas fotos y amigos, desconfiá.'),
        F({ k: 'chat', title: 'Carlos Pérez', sub: 'Messenger', msgs: [{ t: 'Hola! Cambié de cuenta. Estoy en un apuro, ¿me prestás $ 50.000? Te devuelvo mañana' }], hl: 'phone' }, 'Si te pide plata, no respondas: llamalo al número que ya tenías.'),
        F(fb([{ b: 'img', t: 'Carlos Pérez', tone: 2 }, { b: 'rows', items: [{ t: 'Buscar en el perfil', i: 'buscar' }, { t: 'Bloquear', i: 'bloquear' }, { t: 'Reportar perfil', i: 'denunciar', danger: true }], hl: 2 }]), 'En el perfil, tocá los tres puntos y elegí «Reportar» y «Bloquear».'),
        F({ k: 'chat', title: 'Carlos (el verdadero)', msgs: [{ me: true, t: 'Carlos, alguien hizo una cuenta con tu nombre y anda pidiendo plata. Avisale a tus contactos.' }], hl: 'm0' }, 'Avisale a la persona real para que alerte a sus contactos.')
      ],
      pasos: {
        android: ['Entrá al perfil sospechoso.', 'Mirá desde cuándo existe, cuántas fotos y amigos tiene y si ya tenías a esa persona.', 'Tocá los tres puntos (…) del perfil.', 'Elegí “Reportar perfil” → “Se hace pasar por otra persona” y seguí los pasos.', 'Después elegí “Bloquear”.'],
        ios: ['Entrá al perfil sospechoso.', 'Mirá desde cuándo existe, cuántas fotos y amigos tiene y si ya tenías a esa persona.', 'Tocá los tres puntos (…) del perfil.', 'Elegí “Reportar perfil” → “Se hace pasar por otra persona” y seguí los pasos.', 'Después elegí “Bloquear”.']
      },
      siNo: ['Si ya le mandaste plata, avisá enseguida a tu banco o billetera desde la app oficial y hacé la denuncia.', 'Practicá más casos en el Escudo antiestafas.'],
      quiz: [
        { q: 'Un amigo que ya tenés te manda otra solicitud. ¿Qué pensás?', o: ['Que cambió de cuenta, la acepto', 'Que probablemente es un perfil falso'], c: 1, e: 'Es una de las señales más claras de perfil copiado.' },
        { q: 'Te piden plata por mensaje desde una cuenta nueva de un conocido. ¿Qué hacés?', o: ['Le transfiero', 'Lo llamo al número de siempre para confirmar'], c: 1, e: 'Confirmá por otro medio antes de cualquier cosa.' }
      ],
      ficha: ['Perfil nuevo + pocas fotos = alerta', 'Solicitud duplicada = copia', 'Pide plata = confirmar por teléfono', 'Tres puntos → Reportar → Bloquear']
    },
    {
      id: 'r-noticias', t: 'Noticias falsas: cómo darte cuenta', min: 6, nivel: 'intermedio',
      para: 'Vas a revisar una noticia en un minuto antes de creerla o reenviarla.',
      idea: ['Las noticias falsas buscan que te enojes o te asustes para que compartas sin pensar.', 'Hoy también hay fotos, audios y videos hechos con IA que parecen reales.', 'La pregunta clave: ¿quién lo dice, cuándo y dónde más aparece?'],
      demo: [
        F({ k: 'chat', title: 'Familia Pérez', sub: '5 participantes', msgs: [{ t: '⚠️ URGENTE!!! A partir del lunes ANSES deja de pagar a los jubilados. Reenviá a todos!!!' }], hl: 'm0' }, 'Mayúsculas, signos de exclamación y «reenviá a todos»: tres señales de alerta.'),
        F(app('Chrome', [{ b: 'search', t: 'ANSES deja de pagar jubilados lunes', id: 'q' }, { b: 'card', t: 'Sin resultados de medios conocidos', i: 'noticias' }, { b: 'card', t: 'Chequeado: es falso', s: 'Sitio de verificación', i: 'check' }], 'q', { tone: '#3466c2', back: false }), 'Buscá el título en internet. Si ningún medio serio lo publica, desconfiá.', 'type'),
        F(app('Chrome', [{ b: 'search', t: 'anses.gob.ar' }, { b: 'card', t: 'Sitio oficial', s: 'Mirá el anuncio en la fuente', i: 'escudo', id: 'of' }], 'of', { tone: '#3466c2', back: false }), 'Para temas oficiales, entrá vos al sitio oficial del organismo.'),
        F(app('Chrome', [{ b: 'img', t: 'Foto sospechosa', tone: 3 }, { b: 'rows', items: [{ t: 'Buscar con Google Lens', i: 'buscar' }, { t: 'Guardar imagen', i: 'descargar' }], hl: 0 }], undefined, { tone: '#3466c2', back: false }), 'Para una foto, mantenela apretada y elegí «Buscar con Google Lens»: vas a ver si es vieja o de otro lugar.'),
        F({ k: 'chat', title: 'Familia Pérez', sub: '5 participantes', msgs: [{ t: '⚠️ URGENTE!!! ANSES deja de pagar…' }, { me: true, t: 'Lo busqué y es falso, lo desmintieron. Mejor no reenviarlo 🙂' }], hl: 'm1' }, 'Si es falso, no lo reenvíes. Si querés, avisá con amabilidad.')
      ],
      pasos: {
        android: ['Frená: si te da mucha bronca o miedo, es momento de revisar.', 'Mirá quién lo publica y la fecha.', 'Copiá el título y buscalo en Google: fijate si lo publican medios conocidos.', 'Para temas oficiales, entrá vos al sitio oficial (terminado en .gob.ar en el caso de organismos argentinos).', 'Para fotos: mantenela apretada → “Buscar con Google Lens”.', 'Si es falso o no estás seguro, no lo reenvíes.'],
        ios: ['Frená: si te da mucha bronca o miedo, es momento de revisar.', 'Mirá quién lo publica y la fecha.', 'Copiá el título y buscalo en Google: fijate si lo publican medios conocidos.', 'Para temas oficiales, entrá vos al sitio oficial (terminado en .gob.ar en el caso de organismos argentinos).', 'Para fotos: usá la app de Google → ícono de cámara (Lens) y elegí la foto.', 'Si es falso o no estás seguro, no lo reenvíes.']
      },
      siNo: ['Hay sitios dedicados a verificar noticias, como Chequeado. Podés buscar ahí el tema.', 'Si no encontrás nada, lo más prudente es no compartirlo.'],
      quiz: [
        { q: 'Te llega “¡URGENTE! Reenviá a todos”. ¿Qué hacés?', o: ['Lo reenvío por las dudas', 'Lo busco antes y si no lo confirma un medio serio, no lo reenvío'], c: 1, e: 'El apuro y el “reenviá a todos” son señales típicas.' },
        { q: 'Una noticia sobre jubilaciones: ¿dónde la confirmás?', o: ['En el sitio oficial del organismo', 'En el grupo de WhatsApp', 'En los comentarios'], c: 0, e: 'La fuente oficial es la que vale.' }
      ],
      ficha: ['Frenar si da bronca o miedo', '¿Quién, cuándo y dónde más?', 'Sitios oficiales y verificadores', 'Fotos: Google Lens', 'Si dudás, no reenviar']
    },
    {
      id: 'r-youtube', t: 'YouTube a tu medida', min: 6, nivel: 'basico',
      para: 'Vas a encontrar videos que valen la pena, seguir a tus canales favoritos y verlos más cómodos.',
      idea: ['YouTube tiene clases de todo: cocina, jardinería, historia, gimnasia suave, idiomas, música.', '“Suscribirte” a un canal hace que veas sus videos nuevos en “Suscripciones”.', 'Podés poner subtítulos, ir más lento o más rápido y guardar videos para después.'],
      demo: [
        F(home('YouTube'), 'Abrí YouTube.'),
        F(yt([{ b: 'search', t: 'gimnasia suave para mayores en silla', id: 'q' }, { b: 'card', t: 'Gimnasia en silla · 20 minutos', s: 'Canal de una kinesióloga · 1,2 M vistas', i: 'youtube' }]), 'Tocá la lupa y buscá lo que te interese, con varias palabras.', 'type'),
        F(yt([{ b: 'img', t: '▶  Gimnasia en silla', tone: 6 }, { b: 'card', t: 'Kine en casa', s: '320 mil suscriptores', i: 'persona' }, { b: 'btn', t: 'Suscribirme', id: 'sus' }], 'sus'), 'Si te gustó el canal, tocá «Suscribirme».'),
        F(yt([{ b: 'img', t: '▶  Gimnasia en silla', tone: 6 }, { b: 'rows', items: [{ t: 'Subtítulos', s: 'Español', i: 'subtitulos' }, { t: 'Velocidad de reproducción', s: '0,75x', i: 'velocidad' }, { t: 'Calidad', s: 'Automática', i: 'ajustes' }], hl: 1 }]), 'Tocá el video y la rueda: ahí activás subtítulos y cambiás la velocidad.'),
        F(yt([{ b: 'img', t: '▶  Gimnasia en silla', tone: 6 }, { b: 'chips', items: ['Me gusta', 'Compartir', 'Guardar'], hl: 2 }]), 'Con «Guardar» lo dejás en «Ver más tarde».'),
        F(yt([{ b: 'tabs', items: ['Inicio', 'Shorts', 'Suscripciones', 'Tú'], on: 2, hl: 2 }, { b: 'card', t: 'Kine en casa', s: 'Nuevo: Estiramientos de espalda', i: 'youtube' }]), 'En «Suscripciones» aparecen los videos nuevos de tus canales.')
      ],
      pasos: {
        android: ['Abrí YouTube y tocá la lupa. Buscá con varias palabras: “recetas sin sal fáciles”.', 'Antes de ver, mirá el canal y la cantidad de vistas.', 'Si te gusta el canal, tocá “Suscribirme”.', 'Mientras se ve el video, tocá la pantalla → rueda: “Subtítulos” y “Velocidad de reproducción”.', 'Para guardar: tocá “Guardar” debajo del video → “Ver más tarde”.'],
        ios: ['Abrí YouTube y tocá la lupa. Buscá con varias palabras: “recetas sin sal fáciles”.', 'Antes de ver, mirá el canal y la cantidad de vistas.', 'Si te gusta el canal, tocá “Suscribirme”.', 'Mientras se ve el video, tocá la pantalla → rueda: “Subtítulos” y “Velocidad de reproducción”.', 'Para guardar: tocá “Guardar” debajo del video → “Ver más tarde”.']
      },
      siNo: ['Si aparecen muchos anuncios, esperá el botón “Omitir”. Nunca pagues ni des datos en un anuncio que promete premios.', 'Si querés verlo en el televisor, buscá el ícono de transmitir (un rectángulo con ondas) con el celular y la tele en el mismo wifi.'],
      quiz: [
        { q: '¿Para qué sirve suscribirte a un canal?', o: ['Para ver sus videos nuevos en Suscripciones', 'Para pagarle', 'Para que te llame'], c: 0, e: 'Suscribirte es gratis y te ordena lo que te gusta.' },
        { q: 'El video va muy rápido. ¿Qué hacés?', o: ['Rueda → Velocidad → 0,75x', 'Lo cierro', 'Subo el volumen'], c: 0, e: 'Podés bajarle la velocidad.' }
      ],
      ficha: ['Buscar con varias palabras', 'Suscribirme = seguir el canal', 'Rueda: subtítulos y velocidad', 'Guardar → Ver más tarde']
    },
    {
      id: 'r-instagram', t: 'Instagram: seguí a la familia', min: 6, nivel: 'basico',
      para: 'Vas a seguir a tu familia, ver sus historias, mandar mensajes y tener una cuenta privada.',
      idea: ['En Instagram se comparten fotos, videos cortos e “historias” que duran 24 horas.', 'Con la cuenta privada, solo te ven las personas que vos aceptás.', 'Los mensajes privados se mandan desde el ícono del avión de papel o del globito.'],
      demo: [
        F(ig([{ b: 'search', t: 'Buscar: nombre de tu nieta', id: 'q' }, { b: 'card', t: 'sofi.perez', s: 'Sofía Pérez · la siguen 3 amigos tuyos', i: 'persona' }, { b: 'btn', t: 'Seguir', id: 'seg' }], 'seg'), 'Buscá a tu familiar con la lupa y tocá «Seguir».'),
        F(ig([{ b: 'chips', items: ['Tu historia', 'sofi.perez', 'juan.p'], hl: 1 }, { b: 'img', t: 'Publicación de sofi.perez', tone: 4 }]), 'Arriba están las historias: tocá el círculo de una persona para verlas.'),
        F(ig([{ b: 'img', t: 'Publicación de sofi.perez', tone: 4 }, { b: 'chips', items: ['♡ Me gusta', 'Comentar', 'Enviar'], hl: 0 }]), 'El corazón es «Me gusta». También podés comentar.'),
        F(list('Privacidad de la cuenta', [{ t: 'Cuenta privada', s: 'Solo te ven las personas que aprobás', toggle: true, on: true }], 0), 'En Configuración, buscá «Privacidad de la cuenta» y activá «Cuenta privada».'),
        F(ig([{ b: 'card', t: 'Mensajes', s: 'sofi.perez: ¡Hola abu! 💛', i: 'enviar', id: 'dm' }], 'dm'), 'Para mensajes privados, tocá el avión de papel o el globito.')
      ],
      pasos: {
        android: ['Abrí Instagram y tocá la lupa. Buscá el nombre o usuario de tu familiar y tocá “Seguir”.', 'Arriba, tocá los círculos para ver las historias.', 'Para cuenta privada: tu foto (abajo a la derecha) → las tres rayitas → “Privacidad de la cuenta” → activá “Cuenta privada”.', 'Para mensajes: tocá el avión de papel o el globito (arriba).'],
        ios: ['Abrí Instagram y tocá la lupa. Buscá el nombre o usuario de tu familiar y tocá “Seguir”.', 'Arriba, tocá los círculos para ver las historias.', 'Para cuenta privada: tu foto (abajo a la derecha) → las tres rayitas → “Privacidad de la cuenta” → activá “Cuenta privada”.', 'Para mensajes: tocá el avión de papel o el globito (arriba).']
      },
      siNo: ['Si alguien desconocido te escribe con ofertas, premios o “inversiones”, no respondas: bloquealo desde los tres puntos de su perfil.', 'Los menús cambian: si no encontrás algo, en Configuración usá la lupa de búsqueda.'],
      quiz: [
        { q: '¿Cuánto dura una historia de Instagram?', o: ['24 horas', 'Para siempre', '1 minuto'], c: 0, e: 'Las historias desaparecen a las 24 horas.' },
        { q: '¿Qué hace la cuenta privada?', o: ['Solo te ven las personas que aprobás', 'Te cobra', 'Borra tus fotos'], c: 0, e: 'Vos decidís quién te sigue.' }
      ],
      ficha: ['Lupa → buscar → Seguir', 'Círculos de arriba = historias (24 h)', 'Privacidad de la cuenta → Cuenta privada', 'Avión de papel o globito = mensajes']
    },
    {
      id: 'r-tiempo', t: 'Videos cortos sin perder horas', min: 5, nivel: 'intermedio',
      para: 'Vas a disfrutar TikTok, Reels o Shorts sin que te atrapen, y enseñarle a la app qué no querés ver.',
      idea: ['Los videos cortos están pensados para que sigas mirando sin parar.', 'Las apps aprenden de lo que mirás. Si algo no te gusta, decíselo con “No me interesa”.', 'Podés poner un límite de tiempo diario y apagar notificaciones que no aportan.'],
      demo: [
        F(app('Videos cortos', [{ b: 'img', t: 'Video', tone: 7, id: 'v' }, { b: 'text', t: 'Mantené apretado el video', muted: true }], 'v', { tone: '#1c1c1c', back: false }), 'Si un video no te gusta, mantenelo apretado.', 'hold'),
        F({ k: 'sheet', base: app('Videos cortos', [{ b: 'img', t: 'Video', tone: 7 }], undefined, { tone: '#1c1c1c', back: false }), items: [{ t: 'No me interesa', i: 'x' }, { t: 'Guardar', i: 'guardar' }, { t: 'Denunciar', i: 'denunciar' }], hl: 0 }, 'Elegí «No me interesa». La app te va a mostrar menos de eso.'),
        F(list('Tiempo en pantalla', [{ t: 'Límite de tiempo diario', s: '45 minutos', toggle: true, on: true }, { t: 'Recordatorio de descanso', s: 'Cada 30 minutos', toggle: true, on: true }], 0), 'En la configuración de la app, buscá «Tiempo en pantalla» y poné un límite diario.'),
        F(list('Notificaciones', [{ t: 'Mensajes', toggle: true, on: true }, { t: 'Sugerencias de videos', toggle: true }, { t: 'En vivo', toggle: true }], 1), 'Apagá las notificaciones de sugerencias: dejá solo las de mensajes.')
      ],
      pasos: {
        android: ['En TikTok, Reels o Shorts: mantené apretado un video que no te guste → “No me interesa”.', 'En TikTok: tu perfil → las tres rayitas → “Configuración y privacidad” → “Tiempo en pantalla” → poné un límite diario.', 'En YouTube: tu foto → Configuración → General → “Recordarme que tome un descanso”.', 'Apagá notificaciones que no aportan: Ajustes del celular → Notificaciones → elegí la app.', 'También podés usar el “Bienestar digital” del celular para ver cuánto tiempo pasás en cada app.'],
        ios: ['En TikTok, Reels o Shorts: mantené apretado un video que no te guste → “No me interesa”.', 'En TikTok: tu perfil → las tres rayitas → “Configuración y privacidad” → “Tiempo en pantalla” → poné un límite diario.', 'En YouTube: tu foto → Configuración → General → “Recordarme que tome un descanso”.', 'Apagá notificaciones que no aportan: Ajustes → Notificaciones → elegí la app.', 'En Ajustes → Tiempo en pantalla podés ver cuánto usás cada app y poner límites.']
      },
      siNo: ['Si te aparecen videos de “inversiones milagrosas” o curas, no les creas: marcá “No me interesa” o denuncialos.', 'Los nombres de los menús cambian con las actualizaciones; buscá la palabra “tiempo” en la configuración.'],
      quiz: [
        { q: 'Te aparecen videos que no te gustan. ¿Qué hacés?', o: ['Mantener apretado → No me interesa', 'Seguir mirando', 'Desinstalar el celular'], c: 0, e: 'Así la app aprende qué no mostrarte.' },
        { q: '¿Qué ayuda a no perder horas?', o: ['Un límite de tiempo diario', 'Subir el brillo', 'Más notificaciones'], c: 0, e: 'El límite te avisa cuando llegaste al tiempo elegido.' }
      ],
      ficha: ['Mantener apretado → No me interesa', 'Límite diario en “Tiempo en pantalla”', 'Notificaciones: solo mensajes', 'Inversiones milagrosas = estafa']
    }
  ]
};
