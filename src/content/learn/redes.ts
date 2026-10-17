import { type Module, same, F, S, home } from './shared';

export const REDES: Module = {
  id: 'redes', n: 'Redes sociales', apps: 'Facebook, Instagram, YouTube y TikTok', tone: 'sky', section: 'digital',
  desc: 'Compartir, comentar, encontrar grupos y videos que valen la pena, y elegir quién ve lo tuyo.',
  temas: ['Facebook paso a paso', 'Quién ve lo tuyo', 'Grupos y Marketplace', 'Instagram con la familia', 'Publicar en Instagram', 'YouTube a tu medida', 'YouTube en la tele', 'TikTok y videos cortos', 'Informarte bien'],
  lessons: [
    {
      id: 'r-fb', t: 'Facebook paso a paso: publicar, reaccionar y comentar', min: 6, nivel: 'basico',
      para: 'Vas a publicar una foto con un texto, reaccionar y comentar lo que comparten tus amigos y familia.',
      idea: ['En Inicio ves lo que publican tus amigos y las páginas que seguís.', 'Arriba está «¿Qué estás pensando?»: desde ahí publicás texto, fotos o videos.', 'Debajo de cada publicación: «Me gusta» (mantenelo apretado para elegir otra reacción), «Comentar» y «Compartir».'],
      demo: [
        F(home('Facebook'), 'Abrí Facebook.'),
        F(S('fb', { hl: 'like0' }), 'Para reaccionar, tocá «Me gusta». Si lo mantenés apretado, elegís otra reacción: me encanta, me divierte…', 'hold'),
        F(S('fb', { hl: 'comment0' }), 'Con «Comentar» escribís un mensaje debajo de la publicación.'),
        F(S('fb', { hl: 'think' }), 'Para publicar algo tuyo, tocá «¿Qué estás pensando?».'),
        F(S('fb', { v: 'compose', text: '¡Qué lindo día en el club!', hl: 'photo' }), 'Escribí tu texto y tocá «Foto/video» para sumar una foto.', 'type'),
        F(S('fb', { v: 'compose', text: '¡Qué lindo día en el club!', photo: 4, hl: 'post' }), 'Cuando esté listo, tocá «Publicar».')
      ],
      pasos: same(['Abrí Facebook. En Inicio ves las publicaciones de tus amigos.', 'Para reaccionar: tocá “Me gusta” (o mantenelo apretado para otras reacciones).', 'Para comentar: tocá “Comentar”, escribí y enviá.', 'Para publicar: tocá “¿Qué estás pensando?”, escribí, sumá fotos con “Foto/video” y tocá “Publicar”.', 'Para ver tu perfil: tocá tu foto.']),
      siNo: ['Si te equivocaste en una publicación, tocá los tres puntos de esa publicación → Editar publicación.', 'Para borrarla: tres puntos → Eliminar.'],
      quiz: [
        { q: '¿Cómo elegís una reacción distinta a “Me gusta”?', o: ['Manteniendo apretado “Me gusta”', 'Tocando dos veces la foto', 'No se puede'], c: 0, e: 'Aparecen me encanta, me divierte, me asombra…' },
        { q: '¿Desde dónde publicás una foto?', o: ['Desde “¿Qué estás pensando?”', 'Desde Ajustes', 'Desde Marketplace'], c: 0, e: 'Ahí está “Foto/video”.' }
      ],
      ficha: ['Me gusta (mantener = otras reacciones)', 'Comentar · Compartir', '¿Qué estás pensando? = publicar', 'Tres puntos = editar o eliminar']
    },
    {
      id: 'r-fb-priv', t: 'Elegí quién ve lo que publicás', min: 6, nivel: 'basico',
      para: 'Vas a decidir si lo tuyo lo ven tus amigos o cualquiera, y revisar tu privacidad en pocos pasos.',
      idea: ['Cada publicación tiene un público: Público (cualquier persona), Amigos o Solo yo.', 'La «Comprobación de privacidad» de Facebook te guía por lo más importante.', 'Una buena base: publicaciones para Amigos y tu lista de amigos, teléfono y fecha de nacimiento en «Solo yo».'],
      demo: [
        F(S('fb', { v: 'compose', text: 'Mis nietos en la plaza 💙', photo: 3, hl: 'aud' }), 'Al publicar, mirá el público debajo de tu nombre y tocalo para cambiarlo.'),
        F(S('fb', { v: 'audience', hl: 'o1' }), 'Elegí «Amigos» para que lo vean solo tus amigos.'),
        F(S('fb', { v: 'menu', items: [{ t: 'Configuración y privacidad', i: 'settings' }, { t: 'Ayuda y asistencia', i: 'help' }], hl: 'r0' }), 'Para revisar todo: Menú → «Configuración y privacidad» → «Configuración».'),
        F(S('fb', { v: 'list', title: 'Configuración', items: [{ t: 'Comprobación de privacidad', i: 'lock', s: 'Revisá lo más importante' }, { t: 'Configuración de perfil', i: 'user' }, { t: 'Publicaciones', i: 'doc' }, { t: 'Bloqueos', i: 'ban' }], hl: 'r0' }), 'Tocá «Comprobación de privacidad» y seguí los pasos.'),
        F(S('fb', { v: 'list', title: 'Quién puede ver lo que compartís', items: [{ t: 'Publicaciones futuras', val: 'Amigos' }, { t: 'Lista de amigos', val: 'Solo yo' }, { t: 'Fecha de nacimiento', val: 'Solo yo' }, { t: 'Teléfono y correo', val: 'Solo yo' }], hl: 'r1' }), 'Elegí «Amigos» para publicaciones y «Solo yo» para tu lista de amigos y tus datos.')
      ],
      pasos: same(['Al publicar, tocá el público debajo de tu nombre y elegí “Amigos”.', 'Para revisar todo: Menú (tu foto o las tres rayitas) → Configuración y privacidad → Configuración.', 'Entrá a “Comprobación de privacidad” y seguí los pasos.', 'En “Quién puede ver lo que compartís”: publicaciones para Amigos; lista de amigos, teléfono y fecha de nacimiento en Solo yo.', 'Para cambiar algo ya publicado: tres puntos de la publicación → Editar privacidad.']),
      siNo: ['Los menús de Facebook cambian seguido: en Configuración usá la lupa y escribí “privacidad”.', 'Si alguien te molesta, en su perfil tocá los tres puntos → Bloquear.'],
      quiz: [
        { q: '¿Quién ve una publicación con público “Público”?', o: ['Solo mis amigos', 'Cualquier persona en internet', 'Nadie'], c: 1, e: '“Público” significa que la puede ver cualquiera.' },
        { q: '¿Dónde revisás tu privacidad paso a paso?', o: ['En Comprobación de privacidad', 'En Marketplace', 'En Grupos'], c: 0, e: 'Te guía por lo más importante.' }
      ],
      ficha: ['Público · Amigos · Solo yo', 'Configuración → Comprobación de privacidad', 'Lista de amigos y datos: Solo yo']
    },
    {
      id: 'r-fb-grupos', t: 'Grupos de tus intereses y Marketplace', min: 6, nivel: 'intermedio',
      para: 'Vas a sumarte a grupos de jardinería, cocina, viajes o tu barrio, y a buscar cosas usadas en Marketplace.',
      idea: ['Los grupos reúnen a personas con un mismo interés: recetas, ajedrez, tu barrio, viajeros.', 'Marketplace es una sección para comprar y vender cosas usadas entre personas.', 'En Marketplace, coordiná por el chat de Facebook, encontrate en lugares públicos y pagá al recibir y revisar el producto.'],
      demo: [
        F(S('fb', { v: 'menu', items: [{ t: 'Configuración y privacidad', i: 'settings' }], hl: 'g0' }), 'En el Menú, tocá «Grupos».'),
        F(S('fb', { v: 'groups', chip: 2, hl: 'chip2' }), 'En «Descubrir» encontrás grupos sugeridos, o buscá un tema con la lupa.'),
        F(S('fb', { v: 'groups', chip: 2, hl: 'join0' }), 'Tocá «Unirte». Algunos grupos te hacen preguntas antes de aceptarte.'),
        F(S('fb', { v: 'menu', items: [{ t: 'Configuración y privacidad', i: 'settings' }], hl: 'g1' }), 'Para comprar o vender usados, tocá «Marketplace».'),
        F(S('fb', { v: 'market', hl: 'it0' }), 'Tocá un artículo para ver fotos, precio y ubicación, y escribirle al vendedor.')
      ],
      pasos: same(['Menú → Grupos → Descubrir. O buscá un tema con la lupa: “huerta”, “recetas”, tu barrio.', 'Tocá “Unirte” y respondé las preguntas si las hay.', 'Para ver lo nuevo de tus grupos: Menú → Grupos → Tus grupos.', 'Marketplace: Menú → Marketplace. Buscá lo que querés y tocá el artículo.', 'Escribile al vendedor por el chat, coordiná en un lugar público y revisá el producto antes de pagar.']),
      siNo: ['Si un grupo publica demasiado, entrá al grupo → Notificaciones → elegí “Destacados” o “Desactivadas”.', 'En Marketplace, no pagues por adelantado a alguien que no conocés.'],
      quiz: [
        { q: '¿Dónde encontrás grupos de tus intereses?', o: ['Menú → Grupos → Descubrir', 'En Ajustes del celular', 'En Llamadas'], c: 0, e: 'También podés buscar por tema.' },
        { q: 'En Marketplace, ¿cuándo conviene pagar?', o: ['Al recibir y revisar el producto', 'Antes, por transferencia a un desconocido'], c: 0, e: 'Así te asegurás de que es lo que esperabas.' }
      ],
      ficha: ['Menú → Grupos → Unirte', 'Notificaciones del grupo: Destacados', 'Marketplace: lugar público y pagar al revisar']
    },
    {
      id: 'r-ig', t: 'Instagram: seguí a la familia y mirá sus historias', min: 6, nivel: 'basico',
      para: 'Vas a seguir a tu familia, ver sus historias, darle «me gusta» y mandar mensajes.',
      idea: ['En Instagram se comparten fotos, videos cortos (Reels) e «historias» que duran 24 horas.', 'Arriba están los círculos de las historias; abajo, las publicaciones.', 'El avión de papel es para mensajes privados.'],
      demo: [
        F(home('Instagram'), 'Abrí Instagram.'),
        F(S('ig', { hl: 'nav1' }), 'Tocá la lupa para buscar a tu familiar por nombre o usuario y tocá «Seguir».'),
        F(S('ig', { hl: 'st0' }), 'Arriba están las historias: tocá el círculo de una persona para verlas.'),
        F(S('ig', { v: 'story', who: 'sofi.perez', hl: 'reply' }), 'Tocá para pasar a la siguiente. Abajo podés responder o mandar un corazón.'),
        F(S('ig', { liked: true, hl: 'like' }), 'En las publicaciones, el corazón es «Me gusta». También podés comentar.'),
        F(S('ig', { v: 'dm', hl: 'c0' }), 'Con el avión de papel (arriba) entrás a tus mensajes privados.')
      ],
      pasos: same(['Abrí Instagram y tocá la lupa. Buscá el nombre o usuario y tocá “Seguir”.', 'Arriba, tocá los círculos para ver historias. Tocá para pasar; deslizá hacia abajo para salir.', 'En una publicación: el corazón es “Me gusta”, el globito es “Comentar”.', 'Para mensajes: tocá el avión de papel o el globito de arriba.']),
      siNo: ['Si una cuenta es privada, vas a ver “Solicitado” hasta que la persona te acepte.', 'Si no querés ver más a alguien sin dejar de seguirlo, en su perfil tocá “Siguiendo” → Silenciar.'],
      quiz: [
        { q: '¿Cuánto dura una historia?', o: ['24 horas', 'Para siempre', '1 minuto'], c: 0, e: 'Las historias desaparecen a las 24 horas.' },
        { q: '¿Dónde están tus mensajes privados?', o: ['En el avión de papel de arriba', 'En el perfil', 'En la lupa'], c: 0, e: 'Ahí ves y mandás mensajes.' }
      ],
      ficha: ['Lupa → buscar → Seguir', 'Círculos = historias (24 h)', 'Corazón = Me gusta', 'Avión de papel = mensajes']
    },
    {
      id: 'r-ig-publicar', t: 'Publicá en Instagram y elegí quién te ve', min: 6, nivel: 'intermedio',
      para: 'Vas a publicar tu primera foto, subir una historia y, si querés, dejar tu cuenta privada.',
      idea: ['El botón «+» publica una foto (queda en tu perfil) o una historia (dura 24 horas).', 'Podés elegir varias fotos para una misma publicación.', 'Con la cuenta privada, solo te ven las personas que aceptás.'],
      demo: [
        F(S('ig', { hl: 'nav2' }), 'Tocá el «+» de abajo.'),
        F(S('ig', { v: 'new', sel: [0], hl: 'multi' }), 'Elegí la foto. Con «Seleccionar varias» sumás más de una.'),
        F(S('ig', { v: 'new', sel: [0, 2], hl: 'next' }), 'Tocá «Siguiente». Podés aplicar un filtro si querés.'),
        F(S('ig', { v: 'caption', text: 'Domingo de huerta 🌱', hl: 'share' }), 'Escribí un texto y tocá «Compartir».', 'type'),
        F(S('ig', { v: 'profile', hl: 'menu' }), 'Para la privacidad: en tu perfil, tocá las tres rayitas.'),
        F(S('ig', { v: 'privacy', on: true, hl: 'priv' }), 'En «Privacidad de la cuenta», activá «Cuenta privada».')
      ],
      pasos: same(['Tocá el “+” (abajo) y elegí “Publicación” o “Historia”.', 'Elegí la foto (o varias) y tocá “Siguiente”.', 'Escribí un texto y tocá “Compartir”.', 'Para cuenta privada: tu foto (abajo a la derecha) → las tres rayitas → Privacidad de la cuenta → activá “Cuenta privada”.']),
      siNo: ['Para borrar una publicación: abrila → tres puntos → Eliminar.', 'Si los menús cambiaron, en Configuración usá la lupa y escribí “privada”.'],
      quiz: [
        { q: '¿Qué diferencia hay entre publicación e historia?', o: ['La historia dura 24 horas; la publicación queda en tu perfil', 'Ninguna'], c: 0, e: 'La publicación queda hasta que la borres.' },
        { q: '¿Qué hace la cuenta privada?', o: ['Solo te ven las personas que aceptás', 'Te cobra', 'Borra tus fotos'], c: 0, e: 'Vos decidís quién te sigue.' }
      ],
      ficha: ['+ → Publicación o Historia', 'Seleccionar varias', 'Compartir', 'Tres rayitas → Cuenta privada']
    },
    {
      id: 'r-yt', t: 'YouTube a tu medida', min: 6, nivel: 'basico',
      para: 'Vas a encontrar videos que valen la pena, seguir a tus canales favoritos y verlos más cómodo.',
      idea: ['YouTube tiene clases de todo: cocina, jardinería, gimnasia suave, historia, idiomas, música.', '«Suscribirme» a un canal hace que veas sus videos nuevos en «Suscripciones».', 'En la rueda del video activás subtítulos y cambiás la velocidad; con «Guardar» lo dejás para después.'],
      demo: [
        F(home('YouTube'), 'Abrí YouTube.'),
        F(S('yt', { hl: 'search' }), 'Tocá la lupa.'),
        F(S('yt', { v: 'search', q: 'gimnasia en silla', sugg: ['gimnasia en silla para mayores', 'gimnasia en silla 15 minutos', 'gimnasia en silla para la espalda'], kb: true, hl: 's0' }), 'Escribí lo que buscás con varias palabras y elegí una sugerencia.', 'type'),
        F(S('yt', { v: 'watch', hl: 'sub' }), 'Si te gusta el canal, tocá «Suscribirme».'),
        F(S('yt', { v: 'watch', controls: true, hl: 'gear' }), 'Tocá el video y después la rueda.'),
        F(S('yt', { v: 'gear', hl: 'o2' }), 'En «Velocidad de reproducción» podés hacerlo más lento. En «Subtítulos» activás el texto.'),
        F(S('yt', { v: 'saveTo', hl: 'o0' }), 'Con «Guardar» lo dejás en «Ver más tarde» o en una lista tuya.')
      ],
      pasos: same(['Abrí YouTube y tocá la lupa. Buscá con varias palabras: “recetas sin sal fáciles”.', 'Antes de ver, mirá el canal y la cantidad de vistas.', 'Si te gusta el canal, tocá “Suscribirme”.', 'Mientras se ve el video, tocá la pantalla → rueda: “Subtítulos” y “Velocidad de reproducción”.', 'Para guardar: tocá “Guardar” → “Ver más tarde” o una lista.', 'En “Suscripciones” (abajo) ves lo nuevo de tus canales.']),
      siNo: ['Si aparece un anuncio, esperá el botón “Omitir”.', 'Para ver lo que guardaste: tocá “Tú” (abajo) → Ver más tarde o tus listas.'],
      quiz: [
        { q: '¿Para qué sirve suscribirte a un canal?', o: ['Para ver sus videos nuevos en Suscripciones', 'Para pagarle', 'Para que te llame'], c: 0, e: 'Es gratis y te ordena lo que te gusta.' },
        { q: 'El video va muy rápido. ¿Qué hacés?', o: ['Rueda → Velocidad → 0,75x', 'Lo cierro', 'Subo el volumen'], c: 0, e: 'Podés bajarle la velocidad.' }
      ],
      ficha: ['Buscar con varias palabras', 'Suscribirme = seguir el canal', 'Rueda: subtítulos y velocidad', 'Guardar → Ver más tarde']
    },
    {
      id: 'r-yt-tv', t: 'YouTube en el televisor', min: 5, nivel: 'intermedio',
      para: 'Vas a mandar un video del celular a la tele para verlo en pantalla grande y usar el celular como control.',
      idea: ['Si tu tele es Smart (o tiene un dispositivo como Chromecast) y está en el mismo wifi que el celular, podés «transmitir».', 'El botón de transmitir es un rectángulo con ondas, arriba en YouTube.', 'Mientras se ve en la tele, el celular funciona como control: pausa, volumen, siguiente.'],
      demo: [
        F(S('yt', { v: 'watch', hl: 'player' }), 'Abrí el video que querés ver.'),
        F(S('yt', { hl: 'cast' }), 'Tocá el botón de transmitir, arriba (un rectángulo con ondas).'),
        F(S('yt', { v: 'cast', hl: 'o0' }), 'Elegí tu televisor de la lista.'),
        F(S('yt', { v: 'watch', controls: true, hl: 'player' }), 'El video se ve en la tele. En el celular podés pausar o elegir otro.')
      ],
      pasos: same(['Prendé la tele y abrí la app de YouTube en la tele (o el dispositivo Chromecast).', 'Fijate que el celular esté en el mismo wifi que la tele.', 'En YouTube del celular, tocá el botón de transmitir (arriba).', 'Elegí tu televisor. Si no aparece, usá “Vincular con código de TV” y escribí el código que muestra la tele.', 'Para dejar de transmitir, tocá de nuevo el botón y elegí “Desconectar”.']),
      siNo: ['Si no aparece la tele, revisá que estén en el mismo wifi y reiniciá la app de YouTube en la tele.', 'Si tu tele no es Smart, se puede conectar un dispositivo de transmisión por HDMI.'],
      quiz: [
        { q: '¿Qué necesitan el celular y la tele para transmitir?', o: ['Estar en el mismo wifi', 'Estar en la misma habitación solamente', 'Nada'], c: 0, e: 'Si no comparten el wifi, no se encuentran.' },
        { q: 'Mientras se ve en la tele, el celular…', o: ['Funciona como control', 'Se apaga', 'No se puede usar'], c: 0, e: 'Pausás, cambiás de video y más.' }
      ],
      ficha: ['Mismo wifi', 'Botón transmitir (rectángulo con ondas)', 'Elegir la tele', 'Vincular con código de TV']
    },
    {
      id: 'r-tiktok', t: 'TikTok y videos cortos', min: 5, nivel: 'intermedio',
      para: 'Vas a encontrar recetas, ideas y humor en videos cortos, guardar los que te gustan y enseñarle a la app lo que preferís.',
      idea: ['En «Para ti» la app te muestra videos según lo que mirás. Deslizás hacia arriba para pasar al siguiente.', 'Con la lupa buscás temas: «recetas fáciles», «ejercicios para la espalda».', 'Si algo no te gusta, mantené apretado el video y tocá «No me interesa». Y podés poner un límite diario de tiempo.'],
      demo: [
        F(home('TikTok'), 'Abrí TikTok.'),
        F(S('tt', { hl: 'search' }), 'Con la lupa buscás un tema, por ejemplo «empanadas al horno».'),
        F(S('tt', { liked: true, hl: 'save' }), 'Tocá el marcador para guardar el video y verlo después.'),
        F(S('tt', { hl: 'share' }), 'Con la flecha lo compartís por WhatsApp.'),
        F(S('tt', { v: 'menu', hl: 'o0' }), 'Si un video no te interesa, mantenelo apretado y elegí «No me interesa».', 'hold'),
        F(S('tt', { v: 'list', title: 'Tiempo en pantalla', items: [{ t: 'Límite de tiempo diario', s: '45 minutos', tg: true }, { t: 'Recordatorio de descanso', s: 'Cada 30 minutos', tg: true }], hl: 'r0' }), 'En Configuración → «Tiempo en pantalla» podés poner un límite diario.')
      ],
      pasos: same(['Abrí TikTok. Deslizá hacia arriba para pasar de video.', 'Tocá la lupa (arriba) y buscá un tema.', 'Para guardar: tocá el marcador. Lo encontrás en tu perfil → Favoritos.', 'Para compartir: tocá la flecha y elegí WhatsApp.', 'Si no te interesa: mantené apretado el video → No me interesa.', 'Para el tiempo: Perfil → tres rayitas → Configuración y privacidad → Tiempo en pantalla.']),
      siNo: ['Los menús cambian: en Configuración buscá la palabra “tiempo”.', 'Si aparecen videos de “inversiones milagrosas”, marcá “No me interesa”.'],
      quiz: [
        { q: '¿Cómo guardás un video para después?', o: ['Con el marcador', 'Con una captura', 'No se puede'], c: 0, e: 'Queda en Favoritos de tu perfil.' },
        { q: '¿Qué hacés con un video que no te gusta?', o: ['Mantener apretado → No me interesa', 'Seguir mirando'], c: 0, e: 'La app aprende y te muestra menos de eso.' }
      ],
      ficha: ['Deslizar arriba = siguiente', 'Lupa = buscar temas', 'Marcador = guardar', 'No me interesa', 'Límite de tiempo diario']
    },
    {
      id: 'r-informarte', t: 'Informarte bien en las redes', min: 5, nivel: 'intermedio',
      para: 'Vas a chequear una noticia en un minuto antes de compartirla, y saber dónde encontrar información confiable.',
      idea: ['Antes de compartir, preguntate: ¿quién lo dice, cuándo y dónde más aparece?', 'Para temas oficiales, entrá vos al sitio del organismo (en Argentina, suelen terminar en .gob.ar).', 'Hay sitios que verifican noticias, como Chequeado. Y con Google Lens podés ver de dónde viene una foto.'],
      demo: [
        F(S('wa', { v: 'chat', title: 'Familia Pérez', av: 1, msgs: [{ t: '⚠️ URGENTE!!! A partir del lunes cambian todos los pagos. Reenviá a todos!!!' }], hl: 'm0' }), 'Mayúsculas, signos de exclamación y «reenviá a todos»: momento de chequear.'),
        F(S('google', { hl: 'mic' }), 'Buscá el título en Google: fijate si lo publican medios conocidos o el organismo oficial.'),
        F(S('google', { v: 'lens', photo: 6, results: 'Coincidencias de 2019', hl: 'r0' }), 'Para una foto, Lens te muestra si es vieja o de otro lugar.'),
        F(S('wa', { v: 'chat', title: 'Familia Pérez', av: 1, msgs: [{ t: '⚠️ URGENTE!!! A partir del lunes cambian todos los pagos…' }, { me: true, t: 'Lo busqué y no lo publica ningún sitio oficial. Mejor esperemos la info oficial 🙂' }], hl: 'm1' }), 'Si no lo confirma una fuente seria, no lo reenvíes. Podés avisar con amabilidad.')
      ],
      pasos: same(['Frená: si te da mucha bronca o miedo, es momento de revisar.', 'Mirá quién lo publica y la fecha.', 'Buscá el título en Google y fijate si lo publican medios conocidos.', 'Para temas oficiales, entrá vos al sitio oficial del organismo.', 'Para fotos: Google Lens. Si no se confirma, no lo reenvíes.']),
      siNo: ['Si no encontrás nada, lo más prudente es no compartirlo.', 'Seguí páginas oficiales y medios que conozcas para tener información de primera mano.'],
      quiz: [
        { q: 'Te llega “¡URGENTE! Reenviá a todos”. ¿Qué hacés?', o: ['Lo reenvío por las dudas', 'Lo busco antes y si no se confirma, no lo reenvío'], c: 1, e: 'El apuro es una señal típica de información dudosa.' },
        { q: 'Una noticia sobre un trámite: ¿dónde la confirmás?', o: ['En el sitio oficial del organismo', 'En los comentarios', 'En un grupo'], c: 0, e: 'La fuente oficial es la que vale.' }
      ],
      ficha: ['¿Quién, cuándo y dónde más?', 'Sitios oficiales (.gob.ar)', 'Verificadores como Chequeado', 'Fotos: Google Lens']
    }
  ]
};
