import { type Module, same, F, S, home } from './shared';

export const CREAR: Module = {
  id: 'crear', n: 'Crear con el celular', apps: 'Canva, CapCut y Google Fotos', tone: 'violet', section: 'digital',
  desc: 'Tarjetas, invitaciones, collages, videos con las fotos de la familia y álbumes compartidos.',
  temas: ['Tarjetas con Canva', 'Invitaciones', 'Collages', 'Videos con fotos y música', 'Videos automáticos', 'Mejorar fotos', 'Álbum compartido'],
  lessons: [
    {
      id: 'c-tarjeta', t: 'Una tarjeta de cumpleaños con Canva', min: 7, nivel: 'basico',
      para: 'Vas a hacer una tarjeta linda a partir de una plantilla, con tu texto y una foto, y mandarla por WhatsApp.',
      idea: ['Canva es una app gratuita con miles de diseños listos (plantillas). Solo cambiás el texto y las fotos.', 'Las plantillas con corona son pagas: elegí las que no la tienen.', 'Tocar algo lo selecciona; para cambiar un texto, tocalo dos veces.'],
      demo: [
        F(home('Canva'), 'Abrí Canva. La primera vez, entrá con tu cuenta de Google o tu correo.'),
        F(S('canva', { hl: 'search' }), 'Tocá la búsqueda y escribí «tarjeta de cumpleaños».', 'type'),
        F(S('canva', { v: 'templates', hl: 't0' }), 'Elegí una plantilla sin corona: esas son gratis.'),
        F(S('canva', { v: 'editor', sel: 'title', title: '¡Feliz cumple, Sofi!', hl: 'title' }), 'Tocá dos veces el texto y escribí tu mensaje.', 'type'),
        F(S('canva', { v: 'editor', title: '¡Feliz cumple, Sofi!', sub: 'Te quiere mucho, la abuela', hl: 'gallery' }), 'En «Galería» sumás una foto tuya.'),
        F(S('canva', { v: 'editor', title: '¡Feliz cumple, Sofi!', sub: 'Te quiere mucho, la abuela', photo: 3, hl: 'share' }), 'Tocá «Compartir».'),
        F(S('canva', { v: 'share', hl: 'o1' }), 'Elegí WhatsApp para mandarla, o «Descargar» para guardarla.')
      ],
      pasos: same(['Bajá Canva gratis y entrá con tu cuenta de Google o tu correo.', 'En la búsqueda, escribí “tarjeta de cumpleaños”.', 'Elegí una plantilla sin corona.', 'Tocá dos veces un texto para cambiarlo. Para cambiar una foto, tocala y elegí “Reemplazar”, o sumá una desde “Galería”.', 'Tocá “Compartir” → WhatsApp, o “Descargar” → PNG.']),
      siNo: ['Si tocaste algo sin querer, usá la flecha de deshacer (arriba).', 'Si te ofrece Canva Pro, podés cerrar ese aviso: con la versión gratis alcanza.'],
      quiz: [
        { q: '¿Qué significa la corona en una plantilla?', o: ['Que es paga', 'Que es la más linda', 'Que es nueva'], c: 0, e: 'Elegí las que no tienen corona.' },
        { q: 'Te equivocaste al mover algo. ¿Qué hacés?', o: ['Tocar la flecha de deshacer', 'Empezar de cero', 'Cerrar la app'], c: 0, e: 'Deshacer vuelve un paso atrás.' }
      ],
      ficha: ['Buscar la plantilla', 'Sin corona = gratis', 'Doble toque = cambiar texto', 'Galería = sumar foto', 'Compartir → WhatsApp']
    },
    {
      id: 'c-invitacion', t: 'Invitación para un evento', min: 6, nivel: 'intermedio',
      para: 'Vas a hacer una invitación clara con fecha, hora y lugar, y mandarla al grupo de la familia o imprimirla.',
      idea: ['Una buena invitación responde: qué, cuándo, a qué hora, dónde y a quién avisar.', 'Revisá la fecha y la hora dos veces antes de mandarla.', 'Guardala como imagen (PNG) para WhatsApp o como PDF para imprimir.'],
      demo: [
        F(S('canva', { v: 'templates', q: 'invitación almuerzo', hl: 't1' }), 'Buscá «invitación» y el tipo de evento, y elegí una plantilla.'),
        F(S('canva', { v: 'editor', bg: 'linear-gradient(160deg,#cdeaff,#a6c8ff)', emoji: '🥂', sel: 'title', title: 'Almuerzo de los 70 de Marta', sub: 'Domingo 9/11 · 13 h · Club de bochas', hl: 'title' }), 'Cambiá los textos: qué es, el día, la hora y el lugar.', 'type'),
        F(S('canva', { v: 'editor', bg: 'linear-gradient(160deg,#cdeaff,#a6c8ff)', emoji: '🥂', sel: 'sub', title: 'Almuerzo de los 70 de Marta', sub: 'Confirmá a Juan: 11 5555-0000', hl: 'color' }), 'Con «Color» y «Fuente» cambiás cómo se ve el texto.'),
        F(S('canva', { v: 'download', hl: 'o1' }), 'Para imprimir, descargala como PDF. Para WhatsApp, como PNG.'),
        F(S('wa', { v: 'chat', title: 'Familia Pérez', av: 1, msgs: [{ me: true, img: 6 }, { me: true, t: '¡Los esperamos! Confirmen a Juan 🙂' }, { t: '¡Ahí estaremos!' }], hl: 'm0' }), 'Mandala al grupo con un mensaje corto.')
      ],
      pasos: same(['En Canva, buscá “invitación” y el tipo de evento.', 'Elegí una plantilla sin corona.', 'Cambiá los textos: qué es, día, hora, lugar y a quién confirmar.', 'Revisá fecha y hora dos veces.', 'Compartir → Descargar → PNG para WhatsApp o PDF para imprimir.']),
      siNo: ['Si el texto no entra, achicá la letra con “Tamaño”.', 'Tu diseño queda guardado en “Proyectos” para cambiarlo después.'],
      quiz: [
        { q: '¿Qué no puede faltar en una invitación?', o: ['Qué, cuándo, hora y dónde', 'Muchos stickers', 'Tu DNI'], c: 0, e: 'Con eso, nadie tiene que preguntar.' },
        { q: '¿En qué formato la guardás para imprimir?', o: ['PDF', 'Audio', 'Video'], c: 0, e: 'PDF es el mejor para imprimir.' }
      ],
      ficha: ['Qué · cuándo · hora · dónde · a quién confirmar', 'Revisar fecha y hora', 'PNG = WhatsApp · PDF = imprimir']
    },
    {
      id: 'c-collage', t: 'Un collage con varias fotos', min: 5, nivel: 'basico',
      para: 'Vas a juntar varias fotos en una sola imagen para compartir un viaje o una reunión.',
      idea: ['Google Fotos arma collages en segundos: elegís las fotos y elige un diseño.', 'En Canva también hay plantillas de collage para personalizar más.', 'Entre 2 y 6 fotos suele quedar mejor.'],
      demo: [
        F(S('photos', { hl: 'create' }), 'En Google Fotos, tocá el «+» de arriba.'),
        F(S('photos', { v: 'create', hl: 'o1' }), 'Elegí «Collage».'),
        F(S('photos', { sel: [0, 1, 2, 3], hl: 'p3' }), 'Elegí entre 2 y 6 fotos y tocá «Crear».'),
        F(S('photos', { v: 'photo', photo: 6, hl: 'share' }), 'El collage se guarda junto a tus fotos. Tocá «Compartir» para mandarlo.')
      ],
      pasos: same(['Abrí Google Fotos y tocá el “+” (arriba) → Collage.', 'Elegí entre 2 y 6 fotos y tocá “Crear”.', 'Si querés, elegí otro diseño o editá.', 'Tocá “Guardar” y después “Compartir”.', 'En Canva: buscá “collage”, elegí una plantilla y reemplazá las fotos.']),
      siNo: ['Si no ves la opción Collage, actualizá la app de Google Fotos.', 'En iPhone sin Google Fotos, usá Canva.'],
      quiz: [
        { q: '¿Dónde está la opción Collage en Google Fotos?', o: ['En el + de arriba', 'En Ajustes', 'En Buscar'], c: 0, e: '+ → Collage.' },
        { q: '¿Cuántas fotos suele quedar mejor?', o: ['Entre 2 y 6', 'Más de 30'], c: 0, e: 'Así se ven bien en el celular.' }
      ],
      ficha: ['Fotos → + → Collage', 'Elegir 2 a 6 fotos', 'Guardar → Compartir']
    },
    {
      id: 'c-video', t: 'Un video con fotos y música en CapCut', min: 8, nivel: 'intermedio',
      para: 'Vas a juntar fotos de un viaje o un cumpleaños en un video con música para compartir.',
      idea: ['CapCut es una app gratuita para hacer videos: elegís fotos, sumás música y texto.', 'Usá la música que trae la app: las canciones comerciales pueden tener restricciones al compartir en redes.', 'El video final se guarda en tu galería.'],
      demo: [
        F(home('CapCut'), 'Abrí CapCut.'),
        F(S('capcut', { hl: 'new' }), 'Tocá «Nuevo proyecto».'),
        F(S('capcut', { v: 'pick', sel: [0, 2, 4, 1], hl: 'add' }), 'Tocá las fotos en el orden en que querés que aparezcan y tocá «Agregar».'),
        F(S('capcut', { v: 'editor', hl: 'audio' }), 'Tocá «Audio» para sumar música.'),
        F(S('capcut', { v: 'audio', hl: 'o0' }), 'Elegí una canción de la biblioteca de la app.'),
        F(S('capcut', { v: 'editor', music: true, hl: 'text' }), 'Con «Texto» sumás un título al principio.'),
        F(S('capcut', { v: 'editor', music: true, text: 'Mendoza 2026', hl: 'export' }), 'Tocá «Exportar».'),
        F(S('capcut', { v: 'exportDone', hl: 'wa' }), 'Queda en tu galería y lo podés mandar por WhatsApp.')
      ],
      pasos: same(['Bajá CapCut gratis.', 'Tocá “Nuevo proyecto”, elegí las fotos en orden y tocá “Agregar”.', 'Abajo, tocá “Audio” → “Sonidos” y elegí una canción de la app.', 'Tocá “Texto” para sumar un título.', 'Tocá “Exportar” (arriba). El video queda en tu galería.']),
      siNo: ['Si una foto dura mucho, tocala en la línea de tiempo y arrastrá el borde para acortarla.', 'Si te ofrece funciones pagas, cerrá el aviso: lo básico es gratis.'],
      quiz: [
        { q: '¿Qué música conviene usar?', o: ['La que trae la app', 'Cualquier canción famosa'], c: 0, e: 'Las canciones comerciales pueden quedar bloqueadas al compartir en redes.' },
        { q: '¿Dónde queda el video al exportarlo?', o: ['En la galería del celular', 'Se borra', 'En el correo'], c: 0, e: 'Desde la galería lo mandás a quien quieras.' }
      ],
      ficha: ['Nuevo proyecto → fotos en orden', 'Audio → música de la app', 'Texto = título', 'Exportar → galería']
    },
    {
      id: 'c-auto', t: 'Videos automáticos con tus recuerdos', min: 4, nivel: 'basico',
      para: 'Vas a hacer un video con música en un minuto, dejando que Google Fotos lo arme por vos.',
      idea: ['Google Fotos tiene «Video destacado»: elegís fotos o una persona y arma el video con música.', 'En iPhone, la app Fotos crea «Recuerdos» automáticos que también podés editar.', 'Ideal para compartir un viaje o un cumpleaños sin editar nada.'],
      demo: [
        F(S('photos', { hl: 'create' }), 'En Google Fotos, tocá el «+».'),
        F(S('photos', { v: 'create', hl: 'o2' }), 'Elegí «Video destacado».'),
        F(S('photos', { sel: [0, 1, 4, 5], hl: 'p5' }), 'Elegí las fotos (o una persona o lugar) y tocá «Crear».'),
        F(S('photos', { v: 'photo', photo: 1, hl: 'share' }), 'En segundos tenés el video con música. Guardalo y compartilo.')
      ],
      pasos: { android: ['Abrí Google Fotos → “+” → Video destacado.', 'Elegí las fotos o una persona.', 'Tocá “Crear”. Si querés, cambiá la música o el orden.', 'Tocá “Guardar” y después “Compartir”.'], ios: ['En Google Fotos: “+” → Video destacado, y seguí los mismos pasos.', 'En la app Fotos de Apple: entrá a “Recuerdos”, abrí uno y tocá reproducir.', 'Para cambiar música o fotos: tocá los tres puntos → Editar.', 'Compartilo con el botón de compartir.'] },
      siNo: ['Si no aparece “Video destacado”, actualizá la app.', 'Los recuerdos automáticos dependen de que tengas suficientes fotos de ese día o lugar.'],
      quiz: [
        { q: '¿Qué opción de Google Fotos arma el video sola?', o: ['Video destacado', 'Liberar espacio', 'Buscar'], c: 0, e: 'Elegís fotos y lo arma con música.' },
        { q: 'En iPhone, ¿cómo se llaman los videos automáticos de Fotos?', o: ['Recuerdos', 'Estados', 'Historias'], c: 0, e: 'Los encontrás en la app Fotos.' }
      ],
      ficha: ['Fotos → + → Video destacado', 'iPhone: Fotos → Recuerdos', 'Guardar → Compartir']
    },
    {
      id: 'c-fotos', t: 'Mejorá tus fotos sin apps extra', min: 5, nivel: 'basico',
      para: 'Vas a enderezar, recortar y dar más luz a una foto con el editor que ya trae tu celular.',
      idea: ['Todos los celulares traen un editor de fotos dentro de la galería.', 'El botón «Mejorar» ajusta luz y color en un toque.', 'Con «Guardar copia» conservás la original.'],
      demo: [
        F(S('photos', { v: 'photo', photo: 3, hl: 'edit' }), 'Abrí la foto y tocá «Editar».'),
        F(S('photos', { v: 'edit', tool: 0, photo: 3, dark: true, hl: 'opt0' }), 'En «Sugerencias», tocá «Mejorar».'),
        F(S('photos', { v: 'edit', tool: 0, on: 0, photo: 3, hl: 'tab1' }), 'Con «Recortar» enderezás la foto y sacás lo que sobra.'),
        F(S('photos', { v: 'edit', tool: 3, photo: 3, hl: 'opt0' }), 'En «Ajustar» cambiás el brillo a mano si querés.'),
        F(S('photos', { v: 'edit', tool: 3, photo: 3, hl: 'savecopy' }), 'Tocá «Guardar copia»: la original queda intacta.')
      ],
      pasos: { android: ['Abrí la foto en Google Fotos o la Galería y tocá “Editar”.', 'Probá “Mejorar” en Sugerencias.', 'Usá “Recortar” para enderezar y quitar bordes.', 'En “Ajustar”, cambiá brillo o contraste.', 'Tocá “Guardar copia”.'], ios: ['Abrí la foto en Fotos y tocá “Editar”.', 'Tocá la varita mágica para mejorar automáticamente.', 'Tocá “Recortar” para enderezar y quitar bordes.', 'Tocá “OK”. Para volver atrás: Editar → Restablecer.'] },
      siNo: ['Algunos celulares traen “Borrador mágico” para quitar objetos. Si el tuyo lo tiene, aparece en Herramientas.', 'Si la foto quedó peor, cancelá o restablecé.'],
      quiz: [
        { q: '¿Cómo conservás la foto original?', o: ['Con “Guardar copia”', 'No se puede'], c: 0, e: 'Así tenés las dos versiones.' },
        { q: '¿Qué herramienta endereza una foto torcida?', o: ['Recortar', 'Filtros', 'Compartir'], c: 0, e: 'Dentro de Recortar está enderezar.' }
      ],
      ficha: ['Foto → Editar', 'Mejorar = automático', 'Recortar = enderezar', 'Guardar copia']
    },
    {
      id: 'c-album', t: 'Un álbum compartido con la familia', min: 6, nivel: 'intermedio',
      para: 'Vas a crear un álbum donde toda la familia sube las fotos de un evento, sin mandarlas una por una.',
      idea: ['Un álbum compartido es una carpeta de fotos donde varias personas ven y suman fotos.', 'Las fotos se ven en buena calidad, mejor que reenviadas por WhatsApp.', 'Google Fotos funciona en Android y iPhone, así que sirve para toda la familia.'],
      demo: [
        F(S('photos', { sel: [1, 3, 4], hl: 'addSel' }), 'Elegí las fotos (mantené apretada una y tocá las demás) y tocá el «+».'),
        F(S('photos', { v: 'add', hl: 'o0' }), 'Elegí «Álbum compartido».'),
        F(S('photos', { v: 'album', title: 'Cumple 70 de Marta', hl: 'invite' }), 'Ponele un nombre y tocá «Invitar».'),
        F(S('maps', { v: 'share', pick: 0, hl: 'wa' }), 'Compartí el enlace por WhatsApp con la familia.'),
        F(S('photos', { v: 'album', title: 'Cumple 70 de Marta', hl: 'addPh' }), 'Cada uno puede sumar sus fotos con «Agregar fotos».')
      ],
      pasos: { android: ['Abrí Google Fotos y mantené apretada una foto; tocá las demás.', 'Tocá “+” → “Álbum compartido”.', 'Escribí el nombre y tocá “Compartir” o “Invitar”.', 'Elegí WhatsApp o tus contactos.', 'En las opciones del álbum, dejá activado “Colaborar” para que sumen fotos.'], ios: ['Con Google Fotos, seguí los mismos pasos (funciona con Android y iPhone).', 'Con Fotos de Apple: elegí las fotos → Compartir → “Agregar a álbum compartido” (necesita iCloud).', 'Escribí el nombre e invitá a la familia.', 'Dejá activado que los invitados puedan agregar fotos.'] },
      siNo: ['Si en la familia hay Android y iPhone, Google Fotos es la opción que funciona para todos.', 'Para dejar de compartir: abrí el álbum → tres puntos → Opciones → desactivá “Compartir enlace”.'],
      quiz: [
        { q: '¿Qué ventaja tiene un álbum compartido?', o: ['Todos suben fotos en buena calidad a un mismo lugar', 'Las fotos se vuelven públicas', 'Ocupa más espacio'], c: 0, e: 'Nadie tiene que reenviar foto por foto.' },
        { q: 'En la familia hay Android y iPhone. ¿Qué conviene?', o: ['Google Fotos', 'Mandar por correo una por una'], c: 0, e: 'Funciona en los dos.' }
      ],
      ficha: ['Elegir fotos → + → Álbum compartido', 'Invitar por WhatsApp', 'Colaborar = todos suman']
    }
  ]
};
