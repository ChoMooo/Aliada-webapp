import { type Module, same, F, S, home } from './shared';

const M0 = [{ t: '¿Cómo te fue en el médico?' }, { t: 'Contame con un audio si querés' }];
const chat = (o: any = {}) => S('wa', { v: 'chat', msgs: M0, ...o });

export const WA: Module = {
  id: 'wa', n: 'WhatsApp a fondo', apps: 'WhatsApp', tone: 'mint', section: 'digital',
  desc: 'Todo lo que WhatsApp puede hacer por vos: audios, videollamadas, grupos, estados, la computadora y mucho más.',
  temas: ['Audios', 'Videollamadas', 'Responder y reaccionar', 'Fotos y documentos', 'Grupos y encuestas', 'Ordenar chats', 'Estados y canales', 'WhatsApp en la computadora', 'Configurarlo a tu gusto'],
  lessons: [
    {
      id: 'wa-audio', t: 'Audios: grabar, escuchar y leer', min: 5, nivel: 'basico',
      para: 'Vas a mandar audios largos sin sostener el dedo, cancelar uno si te equivocaste, escucharlos más rápido y leerlos como texto.',
      idea: ['El micrófono está abajo a la derecha del chat. Mientras lo mantenés apretado, graba.', 'Si deslizás el dedo hacia arriba hasta el candado, sigue grabando solo y podés soltar.', 'Si deslizás hacia la izquierda antes de soltar, el audio se cancela.', 'Los audios que te mandan se pueden escuchar más rápido y, en muchos celulares, también leer como texto con la transcripción.'],
      demo: [
        F(home('WhatsApp'), 'Abrí WhatsApp desde la pantalla de inicio.'),
        F(S('wa', { hl: 'c0' }), 'Entrá al chat de la persona a la que le querés hablar.'),
        F(chat({ hl: 'mic' }), 'Mantené apretado el micrófono y hablá. Mientras lo sostenés, graba.', 'hold'),
        F(chat({ rec: true, hl: 'lock' }), 'Para no sostener el dedo, deslizalo hacia arriba hasta el candado y soltá.', 'up'),
        F(chat({ msgs: [...M0, { me: true, audio: true, dur: '0:38' }], hl: 'm2' }), 'Cuando terminás, el audio queda enviado en el chat.'),
        F(chat({ msgs: [{ t: '¿Venís el domingo?' }, { audio: true, dur: '1:12', trans: '“Hola ma, el domingo vamos a lo de la abuela, te paso a buscar a las doce.”' }], hl: 'm1' }), 'Para leer un audio que te mandaron, mantenelo apretado y elegí «Transcribir», si tu celular lo ofrece.', 'hold')
      ],
      sim: 'wa-audio', simIntro: 'Probalo acá: mantené apretado el micrófono un par de segundos y soltá.',
      pasos: same(['Abrí el chat de la persona.', 'Mantené apretado el micrófono (abajo a la derecha) y hablá. Soltá para enviar.', 'Para cancelar, deslizá el dedo hacia la izquierda antes de soltar.', 'Para un audio largo: mientras grabás, deslizá hacia arriba hasta el candado y soltá. Cuando termines, tocá enviar.', 'Para escuchar más rápido: mientras suena un audio, tocá “1x” y elegí 1,5x o 2x.', 'Para leerlo: mantené apretado el audio y elegí “Transcribir” (si no aparece, activalo en Ajustes → Chats → Transcripciones de mensajes de voz).']),
      siNo: ['Si no graba, revisá que WhatsApp tenga permiso de micrófono en los Ajustes del celular (Aplicaciones → WhatsApp → Permisos).', 'Si el audio sale muy bajo, alejá un poco el celular de la boca y hablá en un lugar sin ruido.', 'La transcripción todavía no está disponible en todos los celulares ni en todos los idiomas.'],
      quiz: [
        { q: '¿Cómo grabás un audio largo sin mantener el dedo apretado?', o: ['Deslizando hacia arriba hasta el candado', 'Tocando dos veces el micrófono', 'Agitando el celular'], c: 0, e: 'Al deslizar hacia arriba aparece el candado y la grabación sigue sola.' },
        { q: 'Te equivocaste mientras grabás. ¿Qué hacés?', o: ['Lo mando igual', 'Deslizo hacia la izquierda para cancelar', 'Apago el celular'], c: 1, e: 'Deslizar hacia la izquierda antes de soltar cancela el audio.' }
      ],
      ficha: ['Mantener apretado el micrófono = grabar', 'Deslizar arriba (candado) = grabar sin sostener', 'Deslizar a la izquierda = cancelar', '“1x” = escuchar más rápido', 'Mantener apretado un audio = transcribir']
    },
    {
      id: 'wa-video', t: 'Videollamadas con la familia', min: 6, nivel: 'basico',
      para: 'Vas a hacer llamadas y videollamadas con una persona o con todo el grupo de la familia, y manejar la cámara y el micrófono.',
      idea: ['Arriba de cada chat hay dos íconos: la cámara es para videollamada y el teléfono para llamada de voz.', 'Desde el chat de un grupo, la llamada sale a todos los integrantes.', 'Durante la llamada, tocá la pantalla para ver los botones: cámara, micrófono, girar la cámara y cortar (el rojo).'],
      demo: [
        F(S('wa', { hl: 'c1' }), 'Entrá al chat de la persona o del grupo de la familia.'),
        F(S('wa', { v: 'chat', title: 'Familia Pérez', sub: 'Juan, Ana, Hija y 3 más', av: 1, msgs: [{ t: '¿Hacemos videollamada así te mostramos al bebé?' }], hl: 'video' }), 'Tocá la cámara de arriba para empezar la videollamada.'),
        F(S('wa', { v: 'call', title: 'Familia Pérez', hl: 'flip' }), 'Con este botón girás la cámara para mostrar lo que tenés adelante.'),
        F(S('wa', { v: 'call', title: 'Familia Pérez', hl: 'mic' }), 'El micrófono te silencia y te vuelve a activar. Útil si hay ruido.'),
        F(S('wa', { v: 'call', title: 'Familia Pérez', hl: 'end' }), 'Para terminar, tocá el botón rojo.')
      ],
      sim: 'wa-video', simIntro: 'Probalo: tocá el ícono de la cámara arriba del chat.',
      pasos: same(['Abrí el chat de la persona o del grupo.', 'Tocá el ícono de la cámara (arriba) para la videollamada, o el teléfono para una llamada de voz.', 'Esperá a que atiendan. Tocá la pantalla para ver los botones.', 'Para dar vuelta la cámara, tocá el botón de girar. Para silenciarte, tocá el micrófono.', 'Para sumar a otra persona durante la llamada, tocá el botón de agregar participante.', 'Para cortar, tocá el botón rojo.']),
      siNo: ['Si no te ven: revisá que WhatsApp tenga permiso de cámara en los Ajustes del celular.', 'Si se corta seguido: conectate a una red wifi o acercate al router.', 'Si no te escuchan: revisá que el micrófono no esté tachado.'],
      quiz: [
        { q: '¿Qué ícono usás para una videollamada?', o: ['El teléfono', 'La cámara', 'El clip'], c: 1, e: 'La cámara inicia una videollamada; el teléfono, una llamada de voz.' },
        { q: 'Durante la llamada no aparecen los botones. ¿Qué hacés?', o: ['Tocar la pantalla una vez', 'Cortar y volver a llamar', 'Reiniciar el celular'], c: 0, e: 'Los botones se esconden solos; con un toque vuelven a aparecer.' }
      ],
      ficha: ['Cámara arriba del chat = videollamada', 'Teléfono = llamada de voz', 'Desde un grupo = llamada grupal', 'Tocar la pantalla = ver botones', 'Botón rojo = cortar']
    },
    {
      id: 'wa-responder', t: 'Responder, reaccionar, editar y borrar', min: 6, nivel: 'basico',
      para: 'Vas a contestar un mensaje puntual, reaccionar con un emoji, corregir lo que escribiste y guardar los mensajes importantes.',
      idea: ['Si deslizás un mensaje hacia la derecha, lo respondés “citado”: así se entiende a qué contestás, sobre todo en los grupos.', 'Manteniendo apretado un mensaje aparecen los emojis para reaccionar y arriba las opciones: responder, destacar con estrella, eliminar, reenviar y más.', 'Un mensaje tuyo se puede editar durante unos minutos después de enviarlo, y eliminar “para todos” durante un tiempo limitado.'],
      demo: [
        F(S('wa', { v: 'chat', title: 'Familia Pérez', av: 1, msgs: [{ t: 'Juan: ¿Quién lleva el postre el domingo?' }, { t: 'Ana: Yo llevo el pan' }], hl: 'm0' }), 'Para responder a un mensaje puntual, deslizalo hacia la derecha.', 'tap'),
        F(S('wa', { v: 'chat', title: 'Familia Pérez', av: 1, msgs: [{ t: 'Juan: ¿Quién lleva el postre el domingo?' }, { t: 'Ana: Yo llevo el pan' }, { me: true, reply: 'Juan: ¿Quién lleva el postre?', t: '¡Yo llevo el flan!' }], hl: 'm2' }), 'Tu respuesta aparece con el mensaje original arriba. Así todos entienden.'),
        F(S('wa', { v: 'chat', msgs: [{ t: '¡Nació Tomás! 3,2 kg 💙' }], react: 0, selMsg: 0, hl: 'emoji' }), 'Mantené apretado un mensaje y elegí un emoji para reaccionar.', 'hold'),
        F(S('wa', { v: 'chat', msgs: [{ t: '¡Nació Tomás! 3,2 kg 💙', r: '❤️' }, { me: true, t: 'Que alegriia!!' }], selMsg: 1, hl: 'mmore' }), 'Si te equivocaste al escribir, mantené apretado tu mensaje, tocá los tres puntos y elegí «Editar».', 'hold'),
        F(S('wa', { v: 'chat', msgs: [{ t: '¡Nació Tomás! 3,2 kg 💙', r: '❤️' }, { me: true, t: '¡Qué alegría!', edited: true }], hl: 'm1' }), 'El mensaje queda corregido y dice «Editado».'),
        F(S('wa', { v: 'chat', msgs: [{ t: 'Dr. López: El turno es el martes 21 a las 10:30' }], selMsg: 0, hl: 'star' }), 'Con la estrella guardás un mensaje importante para encontrarlo después.', 'hold')
      ],
      pasos: {
        android: ['Para responder: deslizá el mensaje hacia la derecha, escribí y enviá.', 'Para reaccionar: mantené apretado el mensaje y tocá un emoji.', 'Para editar: mantené apretado tu mensaje → tres puntos (arriba) → Editar. Funciona durante unos minutos después de enviarlo.', 'Para eliminar: mantené apretado el mensaje → ícono de tacho → “Eliminar para todos”.', 'Para destacar: mantené apretado el mensaje → estrella. Los encontrás en Ajustes → Mensajes destacados (o en el menú de tres puntos).'],
        ios: ['Para responder: deslizá el mensaje hacia la derecha, escribí y enviá.', 'Para reaccionar: mantené apretado el mensaje y tocá un emoji.', 'Para editar: mantené apretado tu mensaje → Editar. Funciona durante unos minutos después de enviarlo.', 'Para eliminar: mantené apretado el mensaje → Eliminar → “Eliminar para todos”.', 'Para destacar: mantené apretado el mensaje → Destacar. Los encontrás en Configuración → Mensajes destacados.']
      },
      siNo: ['Si no aparece “Editar”, ya pasó el tiempo permitido: podés eliminarlo y escribirlo de nuevo.', 'Si eliminás un mensaje “para todos”, los demás ven el aviso “Se eliminó este mensaje”.'],
      quiz: [
        { q: 'En un grupo, ¿cómo dejás claro a qué mensaje respondés?', o: ['Deslizándolo hacia la derecha para citarlo', 'Escribiendo en mayúsculas', 'Mandando un audio'], c: 0, e: 'La respuesta citada muestra el mensaje original arriba.' },
        { q: '¿Para qué sirve la estrella?', o: ['Para guardar mensajes importantes y encontrarlos rápido', 'Para borrar el chat', 'Para bloquear a alguien'], c: 0, e: 'Los mensajes destacados quedan en una lista aparte.' }
      ],
      ficha: ['Deslizar a la derecha = responder citando', 'Mantener apretado = reaccionar y más opciones', 'Editar: solo unos minutos después', 'Estrella = mensaje destacado']
    },
    {
      id: 'wa-adjuntos', t: 'Mandá fotos, documentos, ubicación y contactos', min: 6, nivel: 'basico',
      para: 'Vas a mandar varias fotos juntas y en buena calidad, un PDF, tu ubicación para que te encuentren y el número de alguien.',
      idea: ['Todo lo que se adjunta sale del mismo botón: el clip en Android o el “+” en iPhone.', 'Las fotos se pueden mandar en calidad HD para que se vean mejor.', 'La ubicación en tiempo real se comparte por el tiempo que elijas y se puede cortar cuando quieras.'],
      demo: [
        F(chat({ msgs: [{ t: 'Ma, ¿me mandás las fotos del cumple?' }], hl: 'clip' }), 'Tocá el clip, al lado de donde escribís. En iPhone es el «+».'),
        F(S('wa', { v: 'attach', msgs: [{ t: 'Ma, ¿me mandás las fotos del cumple?' }], hl: 'o0' }), 'Elegí «Galería» para fotos y videos.'),
        F(S('photos', { sel: [0, 1, 2], hl: 'shareSel' }), 'Tocá varias fotos para elegirlas juntas y después enviá.'),
        F(chat({ msgs: [{ t: 'Ma, ¿me mandás las fotos del cumple?' }, { me: true, img: 3 }, { me: true, img: 0 }], hl: 'm1' }), 'Las fotos quedan enviadas en el chat.'),
        F(S('wa', { v: 'attach', msgs: [{ t: '¿Me pasás la receta del médico?' }], hl: 'o4' }), 'Para un PDF o un archivo, elegí «Documento».'),
        F(S('wa', { v: 'attach', msgs: [{ t: '¿Dónde estás? Te paso a buscar' }], hl: 'o2' }), 'Para que te encuentren, elegí «Ubicación» y después «Compartir ubicación en tiempo real».'),
        F(chat({ msgs: [{ t: '¿Dónde estás? Te paso a buscar' }, { me: true, loc: true }], hl: 'm1' }), 'Se comparte por el tiempo que elegiste. Podés detenerla antes desde el chat.')
      ],
      pasos: {
        android: ['Abrí el chat y tocá el clip (al lado del lugar donde escribís).', 'Galería: tocá varias fotos para elegirlas. Arriba podés elegir “HD” para mejor calidad. Tocá enviar.', 'Documento: buscá el archivo (por ejemplo, en Descargas) y enviá.', 'Ubicación: elegí “Compartir ubicación en tiempo real”, el tiempo y enviá.', 'Contacto: elegí la persona de tu agenda y enviá.'],
        ios: ['Abrí el chat y tocá el “+” (a la izquierda del lugar donde escribís).', 'Fotos y videos: tocá cada foto para marcarla. Podés elegir calidad HD. Tocá enviar.', 'Documento: buscá el archivo y enviá.', 'Ubicación: elegí “Compartir ubicación en tiempo real”, el tiempo y enviá.', 'Contacto: elegí la persona de tu agenda y enviá.']
      },
      siNo: ['Si no encontrás un documento, buscalo en “Descargas” o en la carpeta donde lo guardaste.', 'Para dejar de compartir la ubicación, volvé al chat y tocá “Dejar de compartir”.'],
      quiz: [
        { q: '¿Desde dónde mandás un documento?', o: ['Desde el clip (Android) o el + (iPhone)', 'Desde la cámara', 'Desde la foto de perfil'], c: 0, e: 'Todos los adjuntos salen de ese botón.' },
        { q: 'La ubicación en tiempo real…', o: ['Queda compartida para siempre', 'Se comparte por el tiempo que elijas y se puede cortar', 'La ve cualquiera'], c: 1, e: 'Elegís cuánto tiempo y podés cortarla antes.' }
      ],
      ficha: ['Clip (Android) / + (iPhone) = adjuntar', 'Galería: varias fotos y HD', 'Documento = PDF y archivos', 'Ubicación en tiempo real = por un rato']
    },
    {
      id: 'wa-grupos', t: 'Grupos y encuestas', min: 6, nivel: 'intermedio',
      para: 'Vas a armar un grupo, organizar una salida con una encuesta y silenciar los grupos que suenan demasiado.',
      idea: ['Un grupo junta a varias personas en un mismo chat. Quien lo crea es administrador y puede sumar o quitar gente.', 'Las encuestas sirven para decidir rápido: día del almuerzo, quién lleva qué, horario.', 'Silenciar un grupo no te saca: solo deja de sonar. Lo leés cuando quieras.'],
      demo: [
        F(S('wa', { hl: 'fab' }), 'Tocá el botón verde de nuevo chat.'),
        F(S('wa', { v: 'list', title: 'Seleccionar contacto', items: [{ t: 'Nuevo grupo', i: 'users' }, { t: 'Nuevo contacto', i: 'user' }, { t: 'Nueva comunidad', i: 'users' }, 'Ana López', 'Carlos Pérez'], hl: 'r0' }), 'Elegí «Nuevo grupo».'),
        F(S('wa', { v: 'list', title: 'Agregar miembros', items: [{ t: 'Hija', ok: true }, { t: 'Juan Pérez', ok: true }, { t: 'Ana López', ok: true }, { t: 'Carlos' }], hl: 'r3' }), 'Marcá a las personas que querés sumar y tocá la flecha.'),
        F(S('wa', { v: 'attach', title: 'Familia Pérez', msgs: [{ t: '¡Hola a todos!' }], hl: 'o6' }), 'Para decidir algo entre todos, tocá el clip y elegí «Encuesta».'),
        F(S('wa', { v: 'chat', title: 'Familia Pérez', av: 1, msgs: [{ me: true, poll: ['Sábado 25', 'Domingo 26', 'Sábado 1'], t: '¿Qué día almorzamos?' }], hl: 'm0' }), 'Escribí la pregunta y las opciones. Cada uno vota con un toque.'),
        F(S('wa', { v: 'list', title: 'Info. del grupo', info: 'Familia Pérez', items: [{ t: 'Notificaciones', i: 'bell' }, { t: 'Silenciar notificaciones', i: 'mute' }, { t: 'Mensajes temporales', i: 'clock', s: 'Desactivados' }, { t: 'Salir del grupo', i: 'x', danger: true }], hl: 'r1' }), 'Para que no suene: tocá el nombre del grupo y elegí «Silenciar notificaciones».')
      ],
      pasos: {
        android: ['Tocá el botón de nuevo chat (abajo a la derecha) → “Nuevo grupo”.', 'Elegí los contactos y tocá la flecha. Escribí el nombre del grupo y tocá el tilde.', 'Para una encuesta: en el grupo, tocá el clip → Encuesta. Escribí la pregunta y las opciones y enviá.', 'Para silenciar: abrí el grupo, tocá el nombre arriba → “Silenciar notificaciones” → elegí por cuánto tiempo.', 'Para decidir quién te agrega a grupos: tres puntos → Ajustes → Privacidad → Grupos → “Mis contactos”.'],
        ios: ['En Chats, tocá el botón de nuevo chat (arriba a la derecha) → “Nuevo grupo”.', 'Elegí los contactos → Siguiente. Escribí el nombre y tocá “Crear”.', 'Para una encuesta: en el grupo, tocá el “+” → Encuesta. Escribí la pregunta y las opciones y enviá.', 'Para silenciar: abrí el grupo, tocá el nombre arriba → “Silenciar” → elegí por cuánto tiempo.', 'Para decidir quién te agrega a grupos: Configuración → Privacidad → Grupos → “Mis contactos”.']
      },
      siNo: ['Si no encontrás una opción, en los Ajustes de WhatsApp usá la lupa y escribí la palabra (por ejemplo, “grupos”).', 'Para salir de un grupo: tocá su nombre arriba y bajá hasta “Salir del grupo”.'],
      quiz: [
        { q: 'Silenciar un grupo…', o: ['Te saca del grupo', 'Hace que deje de sonar, pero seguís en el grupo', 'Borra los mensajes'], c: 1, e: 'Seguís en el grupo y lo leés cuando quieras.' },
        { q: '¿Para qué sirve una encuesta en un grupo?', o: ['Para que todos voten una opción con un toque', 'Para mandar plata', 'Para bloquear gente'], c: 0, e: 'Ideal para elegir día, horario o quién lleva qué.' }
      ],
      ficha: ['Nuevo chat → Nuevo grupo', 'Clip o + → Encuesta', 'Nombre del grupo → Silenciar', 'Privacidad → Grupos → Mis contactos']
    },
    {
      id: 'wa-orden', t: 'Ordená tus chats: fijar, archivar, filtrar y buscar', min: 5, nivel: 'basico',
      para: 'Vas a tener siempre arriba los chats importantes y encontrar cualquier mensaje viejo en segundos.',
      idea: ['Fijar un chat lo deja arriba de todo (podés fijar varios).', 'Archivar lo esconde sin borrarlo. Silenciar lo deja quieto.', 'Los filtros de arriba (No leídos, Favoritos, Grupos) muestran solo lo que buscás. La lupa encuentra palabras en todos tus chats.'],
      demo: [
        F(S('wa', { hl: 'c3' }), 'Mantené apretado el chat que querés tener siempre a mano.', 'hold'),
        F(S('wa', { sel: 3, hl: 'pin' }), 'Arriba aparecen opciones: la chinche lo fija arriba de todo.'),
        F(S('wa', { items: [{ t: 'Dr. López', m: 'Turno confirmado para el martes', h: 'Ayer', pin: true }, { t: 'Hija', m: 'Te quiero ma ❤️', h: '10:12', u: 2 }, { t: 'Familia Pérez', m: 'Juan: ¿el domingo almorzamos?', h: '9:40', u: 5 }, { t: 'Club de bochas', m: 'Mañana a las 10', h: 'Ayer' }], hl: 'c0' }), 'Listo: el chat queda fijado arriba.'),
        F(S('wa', { sel: 4, hl: 'archive' }), 'La caja archiva un chat: lo esconde sin borrarlo.'),
        F(S('wa', { chip: 1, hl: 'chip1' }), 'Con los filtros de arriba ves solo los no leídos, tus favoritos o los grupos.'),
        F(S('wa', { hl: 'search' }), 'Con la búsqueda encontrás cualquier palabra, por ejemplo «turno».')
      ],
      sim: 'wa-pin', simIntro: 'Probalo: mantené apretado el chat de “Hija” y fijalo arriba.',
      pasos: {
        android: ['Mantené apretado el chat que querés fijar y tocá la chinche (arriba).', 'Para archivar: mantené apretado el chat y tocá la caja. Los ves en “Archivados”, arriba de la lista.', 'Para filtrar: tocá “No leídos”, “Favoritos” o “Grupos” debajo de la búsqueda.', 'Para marcar favoritos: mantené apretado el chat → tres puntos → Agregar a Favoritos.', 'Para buscar: tocá la barra de búsqueda y escribí una palabra.'],
        ios: ['Deslizá el chat hacia la derecha → Fijar (o mantenelo apretado → Fijar).', 'Para archivar: deslizá el chat hacia la izquierda → Archivar (puede estar en “Más”).', 'Para filtrar: tocá “No leídos”, “Favoritos” o “Grupos” debajo de la búsqueda.', 'Para marcar favoritos: mantené apretado el chat → Agregar a Favoritos.', 'Para buscar: deslizá la lista hacia abajo y usá la búsqueda.']
      },
      siNo: ['Si no aparece la opción, mantené apretado el chat: se abre un menú con todas las acciones.', 'Un chat archivado vuelve a la lista si desarchivás o, según tu configuración, cuando llega un mensaje nuevo.'],
      quiz: [
        { q: 'Archivar un chat…', o: ['Lo borra para siempre', 'Lo esconde sin borrarlo', 'Bloquea a la persona'], c: 1, e: 'Lo encontrás en “Archivados” cuando quieras.' },
        { q: '¿Qué filtro usás para ver solo lo que todavía no leíste?', o: ['No leídos', 'Grupos', 'Favoritos'], c: 0, e: 'Muestra solo los chats con mensajes nuevos.' }
      ],
      ficha: ['Mantener apretado (Android) / deslizar (iPhone) = fijar o archivar', 'Filtros: No leídos, Favoritos, Grupos', 'Búsqueda = encontrar palabras']
    },
    {
      id: 'wa-estados', t: 'Estados y canales', min: 5, nivel: 'intermedio',
      para: 'Vas a ver lo que comparten tus contactos, publicar una foto que dure 24 horas y seguir canales de temas que te gustan.',
      idea: ['Los Estados son fotos, videos o textos que duran 24 horas. Solo los ven tus contactos (o quienes elijas).', 'Los Canales son como un diario por WhatsApp: seguís a una cuenta y te llegan sus novedades, sin que nadie vea tu número.', 'Todo está en la pestaña “Novedades”.'],
      demo: [
        F(S('wa', { hl: 'nav1' }), 'Tocá «Novedades», abajo.'),
        F(S('wa', { v: 'status', hl: 'st0' }), 'Arriba están los estados de tus contactos: tocá un círculo para verlos.'),
        F(S('wa', { v: 'status', hl: 'mine' }), 'Para publicar el tuyo, tocá «Mi estado» y elegí una foto o escribí un texto.'),
        F(S('wa', { v: 'status', hl: 'ch0' }), 'Más abajo están los canales: tocá uno para ver sus novedades y «Seguir» si te interesa.'),
        F(S('wa', { v: 'list', title: 'Privacidad del estado', items: [{ t: 'Mis contactos', ok: true }, { t: 'Mis contactos, excepto…' }, { t: 'Solo compartir con…' }], hl: 'r0' }), 'Desde la privacidad del estado elegís quién lo puede ver.')
      ],
      pasos: same(['Tocá “Novedades” (abajo).', 'Para ver un estado: tocá el círculo de la persona. Tocá para pasar al siguiente.', 'Para publicar: tocá “Mi estado” o el botón de cámara, elegí una foto o tocá el lápiz para escribir un texto, y enviá.', 'Para elegir quién lo ve: tres puntos o Configuración → Privacidad del estado.', 'Para seguir un canal: bajá hasta “Canales”, buscá un tema y tocá “Seguir”.']),
      siNo: ['Si un estado no te interesa, podés silenciar los estados de esa persona manteniendo apretado su círculo.', 'Para dejar de seguir un canal, entrá al canal, tocá su nombre y elegí “Dejar de seguir”.'],
      quiz: [
        { q: '¿Cuánto dura un estado?', o: ['24 horas', 'Para siempre', '1 hora'], c: 0, e: 'Después de 24 horas desaparece.' },
        { q: 'Si seguís un canal…', o: ['El canal ve tu número', 'Recibís sus novedades sin que vean tu número', 'Te agregan a un grupo'], c: 1, e: 'En los canales tu número queda privado.' }
      ],
      ficha: ['Novedades = estados y canales', 'Mi estado = publicar por 24 h', 'Privacidad del estado = quién lo ve', 'Canales: Seguir / Dejar de seguir']
    },
    {
      id: 'wa-web', t: 'WhatsApp en la computadora', min: 6, nivel: 'intermedio',
      para: 'Vas a usar WhatsApp en la compu con teclado y pantalla grande, vinculándola con tu celular.',
      idea: ['WhatsApp Web se abre en el navegador de la computadora, entrando a web.whatsapp.com. También existe la app de WhatsApp para computadora.', 'Se vincula una sola vez escaneando un código QR con el celular.', 'Cuando termines en una compu que no es tuya, cerrá la sesión desde el celular.'],
      demo: [
        F(S('wa', { hl: 'menu' }), 'En el celular, tocá los tres puntos de arriba. En iPhone, entrá a Configuración.'),
        F(S('wa', { v: 'menu', title: '', items: [{ t: 'Nuevo grupo' }, { t: 'Nueva difusión' }, { t: 'Dispositivos vinculados' }, { t: 'Mensajes destacados' }, { t: 'Ajustes' }], hl: 'o2' }), 'Elegí «Dispositivos vinculados».'),
        F(S('wa', { v: 'list', title: 'Dispositivos vinculados', items: [{ t: 'Vincular un dispositivo', i: 'plus' }, { t: 'Computadora de casa', i: 'cel', s: 'Activo hace 2 días' }], hl: 'r0' }), 'Tocá «Vincular un dispositivo».'),
        F(S('wallet', { v: 'scan', title: 'Escanear código QR', hint: 'Apuntá al código de la pantalla de la computadora', hl: 'code' }), 'Apuntá la cámara al código QR que aparece en la pantalla de la computadora.'),
        F(S('wa', { v: 'list', title: 'Dispositivos vinculados', items: [{ t: 'Vincular un dispositivo', i: 'plus' }, { t: 'Computadora de casa', i: 'cel', s: 'Activo ahora' }], hl: 'r1' }), 'Listo. Para cerrar la sesión en esa compu, tocala acá y elegí «Cerrar sesión».')
      ],
      pasos: {
        android: ['En la computadora, abrí el navegador y entrá a web.whatsapp.com (o instalá la app de WhatsApp para computadora).', 'En el celular, abrí WhatsApp → tres puntos → Dispositivos vinculados → Vincular un dispositivo.', 'Apuntá la cámara al código QR de la pantalla de la compu.', 'Ya podés escribir con el teclado de la compu.', 'Para cerrar la sesión: Dispositivos vinculados → tocá la compu → Cerrar sesión.'],
        ios: ['En la computadora, abrí el navegador y entrá a web.whatsapp.com (o instalá la app de WhatsApp para computadora).', 'En el iPhone, abrí WhatsApp → Configuración → Dispositivos vinculados → Vincular un dispositivo.', 'Apuntá la cámara al código QR de la pantalla de la compu.', 'Ya podés escribir con el teclado de la compu.', 'Para cerrar la sesión: Dispositivos vinculados → tocá la compu → Cerrar sesión.']
      },
      siNo: ['Si el código QR vence, tocá “Recargar” en la compu para que aparezca uno nuevo.', 'Solo vinculá dispositivos que estás usando vos. Si ves uno que no reconocés, cerrá su sesión.'],
      quiz: [
        { q: '¿Desde dónde vinculás la computadora?', o: ['Desde Dispositivos vinculados en el celular', 'Llamando a WhatsApp', 'Desde Estados'], c: 0, e: 'El celular escanea el QR de la compu.' },
        { q: 'Usaste WhatsApp en una compu prestada. ¿Qué hacés al terminar?', o: ['Nada', 'Cierro la sesión desde Dispositivos vinculados', 'Apago la compu y listo'], c: 1, e: 'Así nadie más puede ver tus chats en esa compu.' }
      ],
      ficha: ['Compu: web.whatsapp.com', 'Celular: Dispositivos vinculados → Vincular', 'Escanear el QR', 'Cerrar sesión al terminar']
    },
    {
      id: 'wa-ajustes', t: 'Configurá WhatsApp a tu gusto y cuidá tus chats', min: 7, nivel: 'intermedio',
      para: 'Vas a agrandar la letra de los chats, guardar una copia de tus conversaciones y dejar tu cuenta protegida.',
      idea: ['En Ajustes → Chats podés agrandar la letra y hacer una copia de seguridad (en Google Drive en Android o en iCloud en iPhone). Así, si cambiás de celular, recuperás tus conversaciones.', 'La verificación en dos pasos agrega un PIN propio a tu cuenta.', 'En Privacidad elegís quién ve tu foto, tu “en línea” y quién te agrega a grupos.'],
      demo: [
        F(S('wa', { v: 'list', title: 'Ajustes', profile: true, items: [{ t: 'Cuenta', i: 'key', s: 'Verificación en dos pasos' }, { t: 'Privacidad', i: 'lock' }, { t: 'Chats', i: 'comment', s: 'Tema, fondos, copia de seguridad' }, { t: 'Notificaciones', i: 'bell' }, { t: 'Almacenamiento y datos', i: 'folder' }], hl: 'r2' }), 'En los Ajustes de WhatsApp, entrá a «Chats».'),
        F(S('wa', { v: 'list', title: 'Chats', items: [{ t: 'Tema', s: 'Predeterminado del sistema' }, { t: 'Tamaño de fuente', s: 'Grande' }, { t: 'Copia de seguridad', s: 'Última: hoy 3:00' }, { t: 'Transcripciones de mensajes de voz', tg: true }], hl: 'r1' }), 'En «Tamaño de fuente» elegí «Grande» para leer más cómodo.'),
        F(S('wa', { v: 'list', title: 'Copia de seguridad', items: [{ t: 'Guardar', s: 'Copia en Google Drive' }, { t: 'Frecuencia', s: 'Diariamente' }, { t: 'Cuenta de Google', s: 'marta@gmail.com' }, { t: 'Incluir videos', tg: false }], hl: 'r0' }), 'En «Copia de seguridad», tocá «Guardar» y elegí que se haga todos los días.'),
        F(S('wa', { v: 'list', title: 'Cuenta', items: [{ t: 'Verificación en dos pasos', i: 'key' }, { t: 'Dirección de correo electrónico', i: 'mail' }, { t: 'Cambiar número', i: 'cel' }], hl: 'r0' }), 'En «Cuenta» → «Verificación en dos pasos», creá un PIN de 6 números que recuerdes.'),
        F(S('wa', { v: 'list', title: 'Privacidad', items: [{ t: 'Últ. vez y en línea', s: 'Mis contactos' }, { t: 'Foto de perfil', s: 'Mis contactos' }, { t: 'Grupos', s: 'Mis contactos' }, { t: 'Llamadas', s: 'Silenciar desconocidos' }], hl: 'r1' }), 'En «Privacidad» elegí qué ven los demás. «Mis contactos» es una buena opción.')
      ],
      pasos: {
        android: ['Abrí WhatsApp → tres puntos (arriba) → Ajustes.', 'Chats → Tamaño de fuente → Grande.', 'Chats → Copia de seguridad → elegí tu cuenta de Google, la frecuencia y tocá “Guardar”.', 'Cuenta → Verificación en dos pasos → Activar. Elegí un PIN de 6 números y sumá tu correo.', 'Privacidad: elegí “Mis contactos” para la foto de perfil, la última vez en línea y los grupos.'],
        ios: ['Abrí WhatsApp → Configuración (abajo a la derecha).', 'Para letra más grande, el iPhone usa el tamaño de texto del sistema: Ajustes del iPhone → Pantalla y brillo → Tamaño del texto.', 'Chats → Copia de seguridad → Realizar copia ahora (se guarda en iCloud) y elegí “Copia automática”.', 'Cuenta → Verificación en dos pasos → Activar. Elegí un PIN de 6 números y sumá tu correo.', 'Privacidad: elegí “Mis contactos” para la foto de perfil, la última vez en línea y los grupos.']
      },
      siNo: ['Si la copia no se hace, conectá el celular al wifi y al cargador, y revisá que tu cuenta de Google o iCloud tenga espacio.', 'Si olvidaste el PIN, WhatsApp te deja restablecerlo con el correo que cargaste.', 'El código de 6 números que llega por SMS al instalar WhatsApp es solo para vos: no se comparte con nadie.'],
      quiz: [
        { q: '¿Para qué sirve la copia de seguridad de chats?', o: ['Para recuperar tus conversaciones si cambiás de celular', 'Para mandar mensajes más rápido', 'Para borrar los grupos'], c: 0, e: 'Se guardan en Google Drive (Android) o iCloud (iPhone).' },
        { q: '¿Qué agrega la verificación en dos pasos?', o: ['Un PIN propio que protege tu cuenta', 'Más stickers', 'Videollamadas más largas'], c: 0, e: 'Sin tu PIN nadie puede activar tu WhatsApp en otro celular.' }
      ],
      ficha: ['Ajustes → Chats → Tamaño de fuente', 'Chats → Copia de seguridad diaria', 'Cuenta → Verificación en dos pasos', 'Privacidad → Mis contactos']
    }
  ]
};
