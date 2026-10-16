import { type Module, same, F, home, list, app, CHATS } from './shared';

const chat = (msgs: any[], hl?: string, extra: any = {}) => ({ k: 'chat' as const, title: 'Hija', msgs, hl, ...extra });
const M0 = [{ t: '¿Cómo te fue en el médico?' }, { t: 'Contame con un audio si querés' }];

export const WA: Module = {
  id: 'wa', n: 'WhatsApp a fondo', apps: 'WhatsApp', tone: 'mint', section: 'digital',
  desc: 'Todo lo que WhatsApp puede hacer por vos, más allá de mandar mensajes.',
  temas: ['Audios', 'Videollamadas', 'Grupos', 'Ordenar chats', 'Fotos, documentos y ubicación', 'Seguridad y privacidad'],
  lessons: [
    {
      id: 'wa-audio', t: 'Audios que no se cortan', min: 5, nivel: 'basico',
      para: 'Vas a mandar audios largos sin sostener el dedo, cancelar uno si te equivocaste y escuchar los que te mandan más rápido.',
      idea: ['El micrófono está abajo a la derecha del chat. Mientras lo mantenés apretado, graba.', 'Si deslizás el dedo hacia arriba, aparece un candado: queda grabando solo y podés soltar.', 'Si deslizás hacia la izquierda, el audio se cancela y no se envía.'],
      demo: [
        F(home('WhatsApp'), 'Abrí WhatsApp desde la pantalla de inicio.'),
        F({ k: 'chats', items: CHATS, hl: 0 }, 'Entrá al chat de la persona a la que le querés hablar.'),
        F(chat(M0, 'mic', { rec: true }), 'Mantené apretado el micrófono y hablá. Mientras lo sostenés, graba.', 'hold'),
        F(chat(M0, 'mic', { rec: true }), 'Para no sostener el dedo, deslizalo hacia arriba hasta el candado y soltá.', 'up'),
        F(chat([...M0, { me: true, audio: true }], 'm2'), 'Cuando soltás, el audio se envía. Para cancelar, deslizá hacia la izquierda antes de soltar.')
      ],
      sim: 'wa-audio', simIntro: 'Probalo acá: mantené apretado el micrófono un par de segundos y soltá.',
      pasos: same(['Abrí el chat de la persona.', 'Mantené apretado el micrófono (abajo a la derecha) y hablá.', 'Soltá para enviar. Para cancelar, deslizá el dedo hacia la izquierda antes de soltar.', 'Para un audio largo: mientras grabás, deslizá hacia arriba hasta el candado y soltá. Cuando termines, tocá enviar.', 'Para escuchar más rápido: mientras suena un audio, tocá “1x” y elegí 1,5x o 2x.']),
      siNo: ['Si no graba, revisá que WhatsApp tenga permiso de micrófono (en los Ajustes del celular, en Apps o en WhatsApp).', 'Si el audio sale muy bajo, alejá un poco el celular de la boca y hablá en un lugar sin ruido.'],
      quiz: [
        { q: '¿Cómo grabás un audio largo sin mantener el dedo apretado?', o: ['Deslizando hacia arriba hasta el candado', 'Tocando dos veces el micrófono', 'Agitando el celular'], c: 0, e: 'Al deslizar hacia arriba aparece el candado y la grabación sigue sola.' },
        { q: 'Te equivocaste mientras grabás. ¿Qué hacés?', o: ['Lo mando igual y explico', 'Deslizo hacia la izquierda para cancelar', 'Apago el celular'], c: 1, e: 'Deslizar hacia la izquierda antes de soltar cancela el audio.' }
      ],
      ficha: ['Mantener apretado el micrófono = grabar', 'Deslizar arriba (candado) = grabar sin sostener', 'Deslizar a la izquierda = cancelar', '“1x” mientras suena = escuchar más rápido']
    },
    {
      id: 'wa-video', t: 'Videollamadas con la familia', min: 6, nivel: 'basico',
      para: 'Vas a hacer videollamadas con una persona o con varias a la vez, y vas a saber qué hacer si no se ve o no se escucha.',
      idea: ['Arriba de cada chat hay dos íconos: el teléfono es para llamada de voz y la cámara es para videollamada.', 'Durante la llamada, tocá la pantalla para ver los botones: micrófono, cámara, girar cámara y cortar (el rojo).'],
      demo: [
        F({ k: 'chats', items: CHATS, hl: 1 }, 'Entrá al chat de la persona o del grupo de la familia.'),
        F({ k: 'chat', title: 'Familia Pérez', sub: '5 participantes', msgs: [{ t: '¿Hacemos videollamada así te mostramos al bebé?' }], hl: 'cam' }, 'Tocá la cámara de arriba para empezar la videollamada.'),
        F({ k: 'call', name: 'Familia Pérez', hl: 'flip' }, 'Con este botón girás la cámara para mostrar lo que tenés adelante.'),
        F({ k: 'call', name: 'Familia Pérez', hl: 'mic' }, 'El micrófono te silencia y te vuelve a activar.'),
        F({ k: 'call', name: 'Familia Pérez', hl: 'end' }, 'Para terminar, tocá el botón rojo.')
      ],
      sim: 'wa-video', simIntro: 'Probalo: tocá el ícono de la cámara arriba del chat.',
      pasos: same(['Abrí el chat de la persona o del grupo.', 'Tocá el ícono de la cámara (arriba) para la videollamada.', 'Esperá a que atiendan. Tocá la pantalla para ver los botones.', 'Para dar vuelta la cámara, tocá el botón de girar.', 'Para cortar, tocá el botón rojo.']),
      siNo: ['Si no te ven: revisá que la cámara no esté tapada y que WhatsApp tenga permiso de cámara en los Ajustes del celular.', 'Si se corta seguido: conectate a una red wifi o acercate al router.', 'Si no te escuchan: revisá que el micrófono no esté tachado.'],
      quiz: [
        { q: '¿Qué ícono usás para una videollamada?', o: ['El teléfono', 'La cámara', 'El clip'], c: 1, e: 'La cámara inicia una videollamada; el teléfono, una llamada de voz.' },
        { q: 'Durante la llamada no aparecen los botones. ¿Qué hacés?', o: ['Tocar la pantalla una vez', 'Cortar y volver a llamar', 'Reiniciar el celular'], c: 0, e: 'Los botones se esconden solos; con un toque vuelven a aparecer.' }
      ],
      ficha: ['Cámara arriba del chat = videollamada', 'Teléfono = llamada de voz', 'Tocar la pantalla = ver botones', 'Botón rojo = cortar']
    },
    {
      id: 'wa-grupos', t: 'Grupos: crearlos, silenciarlos y salir', min: 6, nivel: 'intermedio',
      para: 'Vas a armar un grupo de familia, silenciar los grupos que molestan y decidir quién puede agregarte.',
      idea: ['Silenciar un grupo no te saca de él: solo deja de sonar.', 'Podés elegir que solo tus contactos te puedan agregar a grupos. Así evitás grupos de desconocidos.'],
      demo: [
        F({ k: 'chats', items: CHATS, hl: -4 }, 'Tocá el botón de nuevo chat.'),
        F(list('Nuevo chat', [{ t: 'Nuevo grupo', i: 'persona' }, { t: 'Nuevo contacto', i: 'plus' }, 'Ana López', 'Carlos Pérez'], 0), 'Elegí «Nuevo grupo».'),
        F(list('Agregar participantes', [{ t: 'Hija', toggle: true, on: true }, { t: 'Carlos Pérez', toggle: true, on: true }, { t: 'Ana López', toggle: true }], 2), 'Marcá a las personas que querés sumar.'),
        F(app('Nuevo grupo', [{ b: 'input', t: 'Familia Pérez' }, { b: 'btn', t: 'Crear grupo', id: 'ok' }], 'ok'), 'Escribí el nombre del grupo y crealo.'),
        F(list('Info. del grupo', [{ t: 'Silenciar notificaciones', i: 'silencio' }, { t: 'Mensajes temporales', i: 'reloj' }, { t: 'Salir del grupo', danger: true }], 0), 'Para que deje de sonar: tocá el nombre del grupo y elegí «Silenciar notificaciones».')
      ],
      pasos: {
        android: ['Tocá el botón de nuevo chat (abajo a la derecha) y elegí “Nuevo grupo”.', 'Elegí los contactos y tocá la flecha.', 'Escribí el nombre del grupo y crealo.', 'Para silenciar un grupo: abrilo, tocá el nombre arriba y elegí “Silenciar notificaciones”.', 'Para decidir quién te agrega: tres puntos (arriba) → Ajustes → Privacidad → Grupos → Mis contactos.'],
        ios: ['En Chats, tocá el botón de nuevo chat (arriba a la derecha) y elegí “Nuevo grupo”.', 'Elegí los contactos y tocá “Siguiente”.', 'Escribí el nombre del grupo y tocá “Crear”.', 'Para silenciar un grupo: abrilo, tocá el nombre arriba y elegí “Silenciar”.', 'Para decidir quién te agrega: Configuración (abajo) → Privacidad → Grupos → Mis contactos.']
      },
      siNo: ['Si no encontrás una opción, abrí los Ajustes de WhatsApp y usá la lupa para buscar la palabra (por ejemplo, “grupos”).', 'Para salir de un grupo: tocá su nombre arriba y bajá hasta “Salir del grupo”.'],
      quiz: [
        { q: 'Silenciar un grupo…', o: ['Te saca del grupo', 'Hace que deje de sonar, pero seguís en el grupo', 'Borra los mensajes'], c: 1, e: 'Seguís en el grupo y podés leerlo cuando quieras.' },
        { q: 'Te agregan a grupos de desconocidos. ¿Qué conviene?', o: ['Cambiar de número', 'En Privacidad → Grupos, elegir “Mis contactos”', 'Aceptar todo'], c: 1, e: 'Así solo tus contactos pueden agregarte.' }
      ],
      ficha: ['Nuevo chat → Nuevo grupo', 'Nombre del grupo → Silenciar', 'Privacidad → Grupos → Mis contactos', 'Nombre del grupo → Salir del grupo']
    },
    {
      id: 'wa-orden', t: 'Ordená tus chats: fijar, archivar y buscar', min: 5, nivel: 'basico',
      para: 'Vas a tener siempre arriba los chats importantes y encontrar cualquier mensaje viejo en segundos.',
      idea: ['Fijar un chat lo deja siempre arriba de todo (podés fijar hasta tres).', 'Archivar lo esconde sin borrarlo.', 'La lupa busca palabras en todos tus chats.'],
      demo: [
        F({ k: 'chats', items: CHATS, hl: 4 }, 'Mantené apretado el chat que querés tener siempre a mano.', 'hold'),
        F({ k: 'chats', items: CHATS, sel: 4, bar: true, hl: -1 }, 'Arriba aparece la chinche: tocala para fijarlo.'),
        F({ k: 'chats', items: [{ ...CHATS[4], pin: true }, ...CHATS.slice(0, 4)], hl: 0 }, 'Listo: el chat queda fijado arriba de todo.'),
        F({ k: 'chats', items: CHATS, sel: 3, bar: true, hl: -2 }, 'La caja archiva el chat: lo esconde sin borrarlo.'),
        F({ k: 'chats', items: CHATS, hl: -3 }, 'Con la lupa buscás cualquier palabra, por ejemplo «turno».')
      ],
      sim: 'wa-pin', simIntro: 'Probalo: mantené apretado el chat de “Hija” y fijalo arriba.',
      pasos: {
        android: ['Mantené apretado el chat que querés fijar.', 'Tocá el ícono de la chinche (fijar) arriba.', 'Para archivar: mantené apretado el chat y tocá el ícono de la caja.', 'Para buscar: tocá la lupa arriba y escribí una palabra.'],
        ios: ['Deslizá el chat hacia la derecha y tocá “Fijar” (o mantenelo apretado y elegí “Fijar”).', 'Para archivar: deslizá el chat hacia la izquierda y tocá “Archivar” (puede estar dentro de “Más”).', 'Para buscar: deslizá la lista de chats hacia abajo y usá el campo de búsqueda.']
      },
      siNo: ['Si no aparece la opción, probá mantener apretado el chat: se abre un menú con todas las acciones.', 'Los chats archivados están en “Archivados”, arriba de la lista.'],
      quiz: [
        { q: 'Archivar un chat…', o: ['Lo borra para siempre', 'Lo esconde sin borrarlo', 'Bloquea a la persona'], c: 1, e: 'Lo encontrás en “Archivados” cuando quieras.' },
        { q: '¿Para qué sirve fijar un chat?', o: ['Para que quede siempre arriba', 'Para que no te escriban', 'Para guardar fotos'], c: 0, e: 'Los chats fijados quedan arriba de todo.' }
      ],
      ficha: ['Mantener apretado (Android) o deslizar (iPhone) = fijar o archivar', 'Lupa = buscar palabras en todos los chats', '“Archivados” = chats escondidos']
    },
    {
      id: 'wa-adjuntos', t: 'Mandá fotos, documentos y tu ubicación', min: 6, nivel: 'basico',
      para: 'Vas a mandar un PDF, varias fotos de una vez y tu ubicación para que te encuentren.',
      idea: ['Todo lo que se adjunta sale del mismo botón: el clip en Android o el “+” en iPhone.', 'La ubicación en tiempo real se comparte por un rato y se puede cortar cuando quieras.'],
      demo: [
        F(chat([{ t: 'Ma, ¿me mandás la receta del médico?' }], 'clip'), 'Tocá el clip, al lado de donde escribís. En iPhone es el «+».'),
        F({ k: 'sheet', base: chat([{ t: 'Ma, ¿me mandás la receta del médico?' }]), grid: true, items: [{ t: 'Documento', i: 'doc' }, { t: 'Cámara', i: 'camara' }, { t: 'Galería', i: 'galeria' }, { t: 'Audio', i: 'musica' }, { t: 'Ubicación', i: 'ubicacion' }, { t: 'Contacto', i: 'persona' }], hl: 0 }, 'Elegí «Documento» para mandar un PDF, o «Galería» para fotos.'),
        F(chat([{ t: 'Ma, ¿me mandás la receta del médico?' }, { me: true, doc: true, t: 'Receta.pdf' }], 'm1'), 'El documento queda enviado en el chat.'),
        F({ k: 'sheet', base: chat([{ t: '¿Dónde estás? Te paso a buscar' }]), grid: true, items: [{ t: 'Documento', i: 'doc' }, { t: 'Cámara', i: 'camara' }, { t: 'Galería', i: 'galeria' }, { t: 'Audio', i: 'musica' }, { t: 'Ubicación', i: 'ubicacion' }, { t: 'Contacto', i: 'persona' }], hl: 4 }, 'Para que te encuentren, elegí «Ubicación».'),
        F(app('Enviar ubicación', [{ b: 'img', t: 'Tu ubicación', tone: 6 }, { b: 'rows', items: [{ t: 'Compartir ubicación en tiempo real', i: 'ubicacion' }, { t: 'Enviar tu ubicación actual', i: 'pin' }], hl: 0 }]), 'Elegí «en tiempo real» y por cuánto tiempo. Se puede cortar cuando quieras.')
      ],
      pasos: {
        android: ['Abrí el chat y tocá el clip (al lado del lugar donde escribís).', 'Elegí “Galería” para fotos, “Documento” para archivos o “Ubicación”.', 'Para varias fotos: mantené apretada una y tocá las demás.', 'En Ubicación, elegí “Compartir ubicación en tiempo real” y por cuánto tiempo.'],
        ios: ['Abrí el chat y tocá el “+” (a la izquierda del lugar donde escribís).', 'Elegí “Fotos y videos”, “Documento” o “Ubicación”.', 'Para varias fotos: tocá cada una para marcarla.', 'En Ubicación, elegí “Compartir ubicación en tiempo real” y por cuánto tiempo.']
      },
      siNo: ['Si no encontrás un documento, buscalo en “Descargas” o en la carpeta donde lo guardaste.', 'Para dejar de compartir la ubicación, volvé al chat y tocá “Dejar de compartir”.'],
      quiz: [
        { q: '¿Desde dónde mandás un documento?', o: ['Desde el clip (Android) o el + (iPhone)', 'Desde la cámara', 'Desde la foto de perfil'], c: 0, e: 'Todos los adjuntos salen de ese botón.' },
        { q: 'La ubicación en tiempo real…', o: ['Queda compartida para siempre', 'Se comparte por el tiempo que elijas y se puede cortar', 'Solo la ve WhatsApp'], c: 1, e: 'Elegís cuánto tiempo y podés cortarla antes.' }
      ],
      ficha: ['Clip (Android) / + (iPhone) = adjuntar', 'Documento = PDF y archivos', 'Ubicación en tiempo real = por un rato, se puede cortar']
    },
    {
      id: 'wa-seguridad', t: 'Blindá tu WhatsApp', min: 7, nivel: 'intermedio',
      para: 'Vas a evitar que te roben la cuenta y que desconocidos vean tus datos.',
      idea: ['La verificación en dos pasos agrega un PIN propio. Aunque alguien consiga el código que llega por SMS, sin tu PIN no entra.', 'El código de 6 dígitos que manda WhatsApp nunca se comparte con nadie, aunque diga ser de soporte o un familiar.'],
      demo: [
        F(list('Ajustes', [{ t: 'Cuenta', i: 'candado' }, { t: 'Privacidad', i: 'ojo' }, { t: 'Chats', i: 'whatsapp' }, { t: 'Notificaciones', i: 'campana' }, { t: 'Almacenamiento y datos', i: 'carpeta' }], 0), 'En los Ajustes de WhatsApp, entrá a «Cuenta».'),
        F(list('Cuenta', ['Verificación en dos pasos', 'Dirección de correo electrónico', 'Cambiar número'], 0), 'Tocá «Verificación en dos pasos».'),
        F(app('Verificación en dos pasos', [{ b: 'text', t: 'Agregá un PIN para proteger tu cuenta.', big: true }, { b: 'btn', t: 'Activar', id: 'on' }], 'on'), 'Tocá «Activar».'),
        F(app('Creá un PIN', [{ b: 'input', t: '●  ●  ●  ●  ●  ●' }, { b: 'text', t: 'Elegí 6 números que recuerdes. Después sumá tu correo.', muted: true }]), 'Elegí un PIN de 6 números que recuerdes y sumá tu correo.'),
        F(list('Privacidad', [{ t: 'Últ. vez y en línea', s: 'Mis contactos' }, { t: 'Foto de perfil', s: 'Mis contactos' }, { t: 'Grupos', s: 'Mis contactos' }, { t: 'Llamadas', s: 'Silenciar desconocidos' }], 3), 'En «Privacidad», elegí «Mis contactos» y silenciá las llamadas de desconocidos.')
      ],
      pasos: {
        android: ['Abrí WhatsApp, tocá los tres puntos (arriba) → Ajustes.', 'Entrá a Cuenta → Verificación en dos pasos → Activar.', 'Elegí un PIN de 6 números que recuerdes y sumá tu correo.', 'En Ajustes → Privacidad, elegí “Mis contactos” para la foto de perfil y la información.', 'En Privacidad → Llamadas, activá “Silenciar llamadas de desconocidos”.'],
        ios: ['Abrí WhatsApp y tocá Configuración (abajo a la derecha).', 'Entrá a Cuenta → Verificación en dos pasos → Activar.', 'Elegí un PIN de 6 números que recuerdes y sumá tu correo.', 'En Configuración → Privacidad, elegí “Mis contactos” para la foto de perfil y la información.', 'En Privacidad → Llamadas, activá “Silenciar llamadas de desconocidos”.']
      },
      siNo: ['Si olvidaste el PIN, WhatsApp te deja restablecerlo con el correo que cargaste.', 'Si alguien te pidió el código y se lo diste, intentá volver a registrar tu número en WhatsApp enseguida y avisá a tus contactos.'],
      quiz: [
        { q: 'Te escriben “soy de soporte de WhatsApp, pasame el código que te llegó”. ¿Qué hacés?', o: ['Se lo paso si es de soporte', 'No lo comparto con nadie', 'Le pido que me llame'], c: 1, e: 'Nadie legítimo te pide ese código. Es la estafa más común para robar cuentas.' },
        { q: '¿Qué agrega la verificación en dos pasos?', o: ['Un PIN propio que protege la cuenta', 'Más stickers', 'Copia de los chats'], c: 0, e: 'Sin tu PIN nadie puede activar tu WhatsApp en otro celular.' }
      ],
      ficha: ['Ajustes → Cuenta → Verificación en dos pasos', 'Privacidad → Mis contactos', 'Privacidad → Llamadas → Silenciar desconocidos', 'El código de 6 dígitos no se comparte nunca']
    }
  ]
};
