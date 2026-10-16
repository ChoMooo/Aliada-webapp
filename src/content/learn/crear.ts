import { type Module, type Screen, F, home, app, list, T } from './shared';

const canva = (blocks: any[], hl?: string, extra: any = {}): Screen => app('Canva', blocks, hl, { tone: T.canva, back: false, ...extra });
const CT = [{ t: 'Texto', i: 'texto' }, { t: 'Fotos', i: 'galeria' }, { t: 'Elementos', i: 'capas' }, { t: 'Fondo', i: 'luz' }];
const CC = [{ t: 'Recortar', i: 'cortar' }, { t: 'Audio', i: 'musica' }, { t: 'Texto', i: 'texto' }, { t: 'Efectos', i: 'magia' }, { t: 'Subtítulos', i: 'subtitulos' }];
const ED = [{ t: 'Mejorar', i: 'magia' }, { t: 'Recortar', i: 'recortar' }, { t: 'Luz', i: 'luz' }, { t: 'Filtros', i: 'filtros' }];

export const CREAR: Module = {
  id: 'crear', n: 'Crear con el celular', apps: 'Canva, CapCut y el editor de fotos', tone: 'violet', section: 'digital',
  desc: 'Tarjetas, invitaciones, videos con las fotos de la familia y álbumes compartidos.',
  temas: ['Tarjetas con Canva', 'Invitaciones para eventos', 'Videos con fotos y música', 'Mejorar fotos', 'Álbum compartido con la familia'],
  lessons: [
    {
      id: 'c-tarjeta', t: 'Una tarjeta de cumpleaños con Canva', min: 7, nivel: 'basico',
      para: 'Vas a hacer una tarjeta linda a partir de una plantilla, con tu texto y una foto, y mandarla por WhatsApp.',
      idea: ['Canva es una app gratuita con miles de diseños listos (“plantillas”). Solo cambiás el texto y las fotos.', 'Algunas plantillas o elementos tienen una corona: son pagos. Elegí los que no la tienen.', 'Tocar algo lo selecciona; para cambiar un texto, tocalo dos veces.'],
      demo: [
        F(home('Canva'), 'Abrí Canva. La primera vez, entrá con tu cuenta de Google o tu correo.'),
        F(canva([{ b: 'search', t: 'tarjeta de cumpleaños', id: 'q' }, { b: 'tiles', items: [{ t: 'Tarjetas', i: 'corazon' }, { t: 'Invitaciones', i: 'doc' }, { t: 'Historias', i: 'cel' }, { t: 'Collage', i: 'galeria' }] }], 'q'), 'Buscá «tarjeta de cumpleaños».', 'type'),
        F(canva([{ b: 'img', t: 'Feliz cumple · gratis', tone: 4, id: 't' }, { b: 'img', t: 'Globos · 👑 pago', tone: 1 }], 't'), 'Elegí una plantilla sin corona: esas son gratis.'),
        F({ k: 'editor', title: 'Tarjeta', canvas: { t: '¡Feliz cumple, Sofi!', s: 'Te quiere mucho, la abuela', tone: 4 }, tools: CT, hl: 'canvas' }, 'Tocá dos veces el texto y escribí tu mensaje.', 'type'),
        F({ k: 'editor', title: 'Tarjeta', canvas: { t: '¡Feliz cumple, Sofi!', s: 'Te quiere mucho, la abuela', tone: 2 }, tools: CT, hl: 1 }, 'En «Fotos» podés sumar una foto tuya y cambiar los colores.'),
        F({ k: 'editor', title: 'Tarjeta', canvas: { t: '¡Feliz cumple, Sofi!', s: 'Te quiere mucho, la abuela', tone: 2 }, tools: CT, hl: 'export' }, 'Tocá compartir o descargar y elegí WhatsApp. Listo.')
      ],
      pasos: {
        android: ['Bajá Canva gratis de Play Store y entrá con tu cuenta de Google o tu correo.', 'En la búsqueda, escribí “tarjeta de cumpleaños”.', 'Elegí una plantilla sin corona (las de corona son pagas).', 'Tocá dos veces un texto para cambiarlo. Para cambiar una foto, tocala y elegí “Reemplazar”.', 'Tocá el botón de compartir o descargar (arriba) → elegí “PNG” o directamente WhatsApp.'],
        ios: ['Bajá Canva gratis de App Store y entrá con tu cuenta de Google, Apple o tu correo.', 'En la búsqueda, escribí “tarjeta de cumpleaños”.', 'Elegí una plantilla sin corona (las de corona son pagas).', 'Tocá dos veces un texto para cambiarlo. Para cambiar una foto, tocala y elegí “Reemplazar”.', 'Tocá el botón de compartir o descargar (arriba) → elegí “PNG” o directamente WhatsApp.']
      },
      siNo: ['Si tocaste algo sin querer, usá la flecha de deshacer (arriba).', 'Si te ofrece Canva Pro, podés cerrar ese aviso: con la versión gratis alcanza.'],
      quiz: [
        { q: '¿Qué significa la corona en una plantilla de Canva?', o: ['Que es paga', 'Que es la más linda', 'Que es para reyes'], c: 0, e: 'Elegí las que no tienen corona para que sea gratis.' },
        { q: 'Te equivocaste al mover algo. ¿Qué hacés?', o: ['Tocar la flecha de deshacer', 'Empezar de cero', 'Cerrar la app'], c: 0, e: 'Deshacer vuelve un paso atrás.' }
      ],
      ficha: ['Buscar la plantilla', 'Sin corona = gratis', 'Doble toque = cambiar texto', 'Compartir → WhatsApp', 'Flecha = deshacer']
    },
    {
      id: 'c-invitacion', t: 'Invitación para un evento', min: 6, nivel: 'intermedio',
      para: 'Vas a hacer una invitación clara con fecha, hora y lugar, y mandarla al grupo de la familia.',
      idea: ['Una buena invitación responde: qué, cuándo, a qué hora, dónde y a quién avisar.', 'Revisá la fecha y la hora dos veces antes de mandarla: es el error más común.', 'Podés guardarla como imagen (PNG) para WhatsApp o como PDF para imprimir.'],
      demo: [
        F(canva([{ b: 'search', t: 'invitación almuerzo familiar', id: 'q' }, { b: 'img', t: 'Almuerzo · gratis', tone: 5 }], 'q'), 'Buscá una plantilla de invitación.', 'type'),
        F({ k: 'editor', title: 'Invitación', canvas: { t: 'Almuerzo de los 70 de Marta', s: 'Domingo 9 de noviembre · 13 h · Club de bochas', tone: 5 }, tools: CT, hl: 'canvas' }, 'Cambiá los textos: qué es, el día, la hora y el lugar.', 'type'),
        F({ k: 'editor', title: 'Invitación', canvas: { t: 'Almuerzo de los 70 de Marta', s: 'Confirmá a Juan: 11 5555-0000', tone: 5 }, tools: CT, hl: 0 }, 'Sumá a quién confirmar la asistencia.'),
        F(app('Descargar', [{ b: 'rows', items: [{ t: 'PNG', s: 'Imagen para WhatsApp', i: 'galeria' }, { t: 'PDF', s: 'Para imprimir', i: 'imprimir' }], hl: 0 }, { b: 'btn', t: 'Descargar', id: 'ok' }], undefined, { tone: T.canva }), 'Descargala como PNG para WhatsApp o como PDF para imprimir.'),
        F({ k: 'chat', title: 'Familia Pérez', sub: '5 participantes', msgs: [{ me: true, img: true, t: '' }, { me: true, t: '¡Los esperamos! Confirmen a Juan 🙂' }, { t: '¡Ahí estaremos!' }], hl: 'm0' }, 'Mandala al grupo con un mensaje corto.')
      ],
      pasos: {
        android: ['En Canva, buscá “invitación” y el tipo de evento.', 'Elegí una plantilla sin corona.', 'Cambiá los textos: qué es, día, hora, lugar y a quién confirmar.', 'Revisá fecha y hora dos veces.', 'Tocá compartir o descargar → “PNG” para WhatsApp o “PDF” para imprimir.'],
        ios: ['En Canva, buscá “invitación” y el tipo de evento.', 'Elegí una plantilla sin corona.', 'Cambiá los textos: qué es, día, hora, lugar y a quién confirmar.', 'Revisá fecha y hora dos veces.', 'Tocá compartir o descargar → “PNG” para WhatsApp o “PDF” para imprimir.']
      },
      siNo: ['Si el texto no entra, achicá la letra: tocá el texto y cambiá el número del tamaño.', 'Tu diseño queda guardado en Canva: lo podés abrir y cambiar después desde “Proyectos”.'],
      quiz: [
        { q: '¿Qué no puede faltar en una invitación?', o: ['Qué, cuándo, hora y dónde', 'Muchos stickers', 'Tu DNI'], c: 0, e: 'Con eso, nadie tiene que preguntar.' },
        { q: '¿En qué formato la guardás para imprimir?', o: ['PDF', 'Audio', 'Video'], c: 0, e: 'PDF es el mejor formato para imprimir.' }
      ],
      ficha: ['Qué · cuándo · hora · dónde · a quién confirmar', 'Revisar fecha y hora dos veces', 'PNG = WhatsApp · PDF = imprimir', 'Proyectos = volver a editar']
    },
    {
      id: 'c-video', t: 'Un video con fotos y música', min: 8, nivel: 'intermedio',
      para: 'Vas a juntar fotos de un viaje o un cumpleaños en un video con música para compartir.',
      idea: ['CapCut es una app gratuita para hacer videos. Elegís fotos, sumás música y la app arma el video.', 'Usá la música que trae la app: las canciones comerciales pueden tener restricciones al compartir en redes.', 'Si preferís algo más simple, Google Fotos y la app Fotos del iPhone también arman videos de recuerdos automáticamente.'],
      demo: [
        F(home('CapCut'), 'Abrí CapCut.'),
        F(app('CapCut', [{ b: 'btn', t: '+  Nuevo proyecto', id: 'new' }, { b: 'text', t: 'Proyectos recientes', muted: true }], 'new', { tone: '#1c1c1c', back: false }), 'Tocá «Nuevo proyecto».'),
        F({ k: 'photos', title: 'Elegí fotos', sel: [0, 2, 4, 7], hl: 7 }, 'Tocá las fotos en el orden en que querés que aparezcan.'),
        F({ k: 'editor', title: 'Proyecto', canvas: { t: 'Vacaciones en Mendoza', tone: 6 }, tools: CC, hl: 1, timeline: true }, 'Tocá «Audio» y elegí una canción de la biblioteca de la app.'),
        F({ k: 'editor', title: 'Proyecto', canvas: { t: 'Vacaciones en Mendoza', s: 'Enero 2026', tone: 6 }, tools: CC, hl: 2, timeline: true }, 'Con «Texto» sumás un título al principio.'),
        F({ k: 'editor', title: 'Proyecto', canvas: { t: 'Vacaciones en Mendoza', s: 'Enero 2026', tone: 6 }, tools: CC, hl: 'export', timeline: true }, 'Tocá exportar (arriba). Se guarda en tu galería y lo mandás por WhatsApp.')
      ],
      pasos: {
        android: ['Bajá CapCut gratis de Play Store.', 'Tocá “Nuevo proyecto” y elegí las fotos en orden. Tocá “Agregar”.', 'Abajo, tocá “Audio” → “Sonidos” o “Música” y elegí una canción de la app.', 'Tocá “Texto” para sumar un título.', 'Tocá exportar (la flecha arriba a la derecha). El video queda en tu galería.'],
        ios: ['Bajá CapCut gratis de App Store.', 'Tocá “Nuevo proyecto” y elegí las fotos en orden. Tocá “Agregar”.', 'Abajo, tocá “Audio” → “Sonidos” o “Música” y elegí una canción de la app.', 'Tocá “Texto” para sumar un título.', 'Tocá exportar (la flecha arriba a la derecha). El video queda en tu galería.']
      },
      siNo: ['Si una foto dura mucho, tocala en la línea de tiempo y arrastrá el borde para acortarla.', 'Si te ofrece funciones pagas, cerrá el aviso: lo básico es gratis.', 'Alternativa simple: en Google Fotos, tocá “Crear” → “Video” (o en iPhone, Fotos → Recuerdos).'],
      quiz: [
        { q: '¿Qué música conviene usar?', o: ['La que trae la app', 'Cualquier canción famosa sin importar las restricciones'], c: 0, e: 'Las canciones comerciales pueden quedar bloqueadas al compartir en redes.' },
        { q: '¿Dónde queda el video al exportarlo?', o: ['En la galería del celular', 'Se borra', 'En el correo'], c: 0, e: 'Desde la galería lo mandás a quien quieras.' }
      ],
      ficha: ['Nuevo proyecto → fotos en orden', 'Audio → música de la app', 'Texto = título', 'Exportar → galería → WhatsApp']
    },
    {
      id: 'c-fotos', t: 'Mejorá tus fotos sin apps extra', min: 5, nivel: 'basico',
      para: 'Vas a enderezar, recortar y dar más luz a una foto con el editor que ya trae tu celular.',
      idea: ['Todos los celulares traen un editor de fotos dentro de la galería.', 'El botón “Mejorar” o la varita mágica ajusta luz y color en un toque.', 'Los cambios se pueden deshacer: el celular guarda la original.'],
      demo: [
        F({ k: 'photos', title: 'Galería', hl: 5 }, 'Abrí la galería y elegí la foto.'),
        F({ k: 'editor', title: 'Editar', canvas: { t: 'Foto oscura', tone: 0 }, tools: ED, hl: 0 }, 'Tocá «Editar» (el lápiz o las barritas) y después «Mejorar» o la varita.'),
        F({ k: 'editor', title: 'Editar', canvas: { t: 'Foto con más luz ✓', tone: 5 }, tools: ED, hl: 1 }, 'Con «Recortar» enderezás la foto y sacás lo que sobra.'),
        F({ k: 'editor', title: 'Editar', canvas: { t: 'Foto recortada', tone: 5 }, tools: ED, hl: 2 }, 'En «Luz» podés ajustar el brillo a mano si querés.'),
        F({ k: 'editor', title: 'Editar', canvas: { t: 'Lista ✓', tone: 5 }, tools: ED, hl: 'export' }, 'Tocá «Guardar». Siempre se puede volver a la original.')
      ],
      pasos: {
        android: ['Abrí la Galería o Google Fotos y tocá la foto.', 'Tocá “Editar” (lápiz o barritas).', 'Probá “Mejorar” o la varita mágica.', 'Usá “Recortar” para enderezar y quitar bordes.', 'Tocá “Guardar” (o “Guardar copia” para conservar la original aparte).'],
        ios: ['Abrí Fotos y tocá la foto.', 'Tocá “Editar” (arriba o abajo, según la versión).', 'Tocá la varita mágica para mejorar automáticamente.', 'Tocá “Recortar” para enderezar y quitar bordes.', 'Tocá “OK”. Para volver atrás: Editar → “Restablecer” o “Revertir”.']
      },
      siNo: ['Algunos celulares traen “Borrador mágico” o herramientas con IA para quitar objetos. Si el tuyo lo tiene, aparece en el editor; si no, no hace falta.', 'Si la foto quedó peor, usá “Revertir” o “Restablecer” para volver a la original.'],
      quiz: [
        { q: '¿Se pierde la foto original al editar?', o: ['No, se puede volver atrás', 'Sí, para siempre'], c: 0, e: 'Con Revertir o Restablecer volvés a la original.' },
        { q: '¿Qué herramienta endereza una foto torcida?', o: ['Recortar', 'Filtros', 'Compartir'], c: 0, e: 'Dentro de Recortar está la opción de enderezar.' }
      ],
      ficha: ['Foto → Editar', 'Mejorar / varita = automático', 'Recortar = enderezar', 'Revertir = volver a la original']
    },
    {
      id: 'c-album', t: 'Un álbum compartido con la familia', min: 6, nivel: 'intermedio',
      para: 'Vas a crear un álbum donde toda la familia sube las fotos de un evento, sin mandarlas una por una.',
      idea: ['Un álbum compartido es una carpeta de fotos en la que varias personas pueden ver y sumar fotos.', 'Las fotos se ven en buena calidad, mejor que reenviadas por WhatsApp.', 'Compartilo solo con la familia: cualquiera con el enlace puede verlo.'],
      demo: [
        F({ k: 'photos', title: 'Fotos', sel: [1, 3, 4], hl: 4 }, 'En Google Fotos, mantené apretada una foto y tocá las demás para elegirlas.'),
        F({ k: 'sheet', base: { k: 'photos', title: 'Fotos', sel: [1, 3, 4] }, items: [{ t: 'Agregar a álbum compartido', i: 'persona' }, { t: 'Crear', i: 'plus' }, { t: 'Compartir', i: 'share' }], hl: 0 }, 'Tocá «+» o «Agregar a» y elegí «Álbum compartido».'),
        F(app('Nuevo álbum compartido', [{ b: 'input', t: 'Cumple 70 de Marta', id: 'n' }, { b: 'btn', t: 'Compartir', id: 'ok' }], 'n', { tone: '#d0663a' }), 'Ponele un nombre al álbum.', 'type'),
        F({ k: 'sheet', base: app('Cumple 70 de Marta', [{ b: 'img', tone: 4 }], undefined, { tone: '#d0663a' }), title: 'Compartir con', items: [{ t: 'WhatsApp', i: 'whatsapp' }, { t: 'Copiar enlace', i: 'link' }, { t: 'Contactos', i: 'persona' }], hl: 0 }, 'Compartí el enlace por WhatsApp con la familia.'),
        F(list('Opciones del álbum', [{ t: 'Colaborar', s: 'Otros pueden sumar fotos', toggle: true, on: true }, { t: 'Compartir enlace', toggle: true, on: true }], 0), 'Con «Colaborar» activado, todos pueden sumar sus fotos.')
      ],
      pasos: {
        android: ['Abrí Google Fotos y mantené apretada una foto; tocá las demás para elegirlas.', 'Tocá “+” o “Agregar a” → “Álbum compartido”.', 'Escribí el nombre del álbum y tocá “Compartir”.', 'Elegí WhatsApp o tus contactos.', 'En las opciones del álbum, dejá activado “Colaborar” para que sumen fotos.'],
        ios: ['Opción 1, Fotos de iPhone: elegí las fotos → Compartir → “Agregar a álbum compartido” → nuevo álbum (necesita iCloud y que los demás tengan iPhone o un enlace).', 'Opción 2, Google Fotos (funciona con Android y iPhone): elegí las fotos → “+” → “Álbum compartido”.', 'Escribí el nombre y tocá “Compartir”.', 'Elegí WhatsApp o tus contactos.', 'Dejá activado “Colaborar” para que sumen fotos.']
      },
      siNo: ['Si en la familia hay Android y iPhone, Google Fotos es la opción que funciona para todos.', 'Para dejar de compartir: abrí el álbum → tres puntos → Opciones → desactivá “Compartir enlace”.'],
      quiz: [
        { q: '¿Qué ventaja tiene un álbum compartido?', o: ['Todos suben fotos en buena calidad a un mismo lugar', 'Las fotos se vuelven públicas en internet', 'Ocupa más espacio'], c: 0, e: 'Todos aportan y nadie tiene que reenviar foto por foto.' },
        { q: 'En la familia hay Android y iPhone. ¿Qué conviene?', o: ['Google Fotos', 'Mandar por correo una por una'], c: 0, e: 'Google Fotos funciona en los dos.' }
      ],
      ficha: ['Elegir fotos → + → Álbum compartido', 'Nombre → Compartir por WhatsApp', 'Colaborar = todos suman', 'Solo con la familia']
    }
  ]
};
