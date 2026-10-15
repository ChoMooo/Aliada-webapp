/* ===== Contenido de Mundo digital =====
   Los pasos son generales: los menús cambian según la marca, el modelo y la versión.
   Antes de vender, cada lección se prueba en al menos un Samsung, un Motorola y un iPhone,
   y se actualiza CONTENIDO_DIGITAL con la fecha de esa revisión. */
export const CONTENIDO_DIGITAL = { fecha: '2026-10-15', estado: 'borrador' as 'borrador' | 'verificado' };

export type Quiz = { q: string; o: string[]; c: number; e: string };
export type Lesson = {
  id: string; t: string; min: number; nivel: 'basico' | 'intermedio';
  para: string; idea: string[]; sim?: string; simIntro?: string;
  pasos: { android: string[]; ios: string[] }; marcas?: string[];
  siNo: string[]; quiz: Quiz[]; ficha: string[];
};
export type Module = {
  id: string; n: string; apps: string; tone: 'mint' | 'sky' | 'amber' | 'violet'; fase: 1 | 2 | 3;
  desc: string; temas: string[]; lessons: Lesson[];
};

const same = (a: string[]) => ({ android: a, ios: a });

export const MODULES: Module[] = [
  {
    id: 'wa', n: 'WhatsApp a fondo', apps: 'WhatsApp', tone: 'mint', fase: 1,
    desc: 'Todo lo que WhatsApp puede hacer por vos, más allá de mandar mensajes.',
    temas: ['Audios', 'Videollamadas', 'Grupos', 'Ordenar chats', 'Fotos, documentos y ubicación', 'Seguridad y privacidad'],
    lessons: [
      {
        id: 'wa-audio', t: 'Audios que no se cortan', min: 5, nivel: 'basico',
        para: 'Vas a poder mandar audios largos sin sostener el dedo, cancelar uno si te equivocaste y escuchar los que te mandan más rápido.',
        idea: ['El micrófono está abajo a la derecha del chat. Mientras lo mantenés apretado, graba.', 'Si deslizás el dedo hacia arriba, aparece un candado: queda grabando solo y podés soltar.', 'Si deslizás hacia la izquierda, el audio se cancela y no se envía.'],
        sim: 'wa-audio', simIntro: 'Probalo acá: mantené apretado el micrófono un par de segundos y soltá.',
        pasos: same(['Abrí el chat de la persona.', 'Mantené apretado el micrófono (abajo a la derecha) y hablá.', 'Soltá para enviar. Para cancelar, deslizá el dedo hacia la izquierda antes de soltar.', 'Para un audio largo: mientras grabás, deslizá hacia arriba hasta el candado y soltá. Cuando termines, tocá el botón de enviar.', 'Para escuchar más rápido: mientras suena un audio, tocá “1x” y elegí 1,5x o 2x.']),
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
        idea: ['En la parte de arriba de cada chat hay dos íconos: el teléfono es para llamada de voz y la cámara es para videollamada.', 'Durante la llamada, tocá la pantalla para ver los botones: micrófono, cámara, girar cámara y colgar (el rojo).'],
        sim: 'wa-video', simIntro: 'Probalo: tocá el ícono de la cámara arriba del chat.',
        pasos: same(['Abrí el chat de la persona o del grupo.', 'Tocá el ícono de la cámara (arriba) para la videollamada.', 'Esperá a que atienda. Tocá la pantalla para ver los botones.', 'Para dar vuelta la cámara, tocá el botón de girar.', 'Para cortar, tocá el botón rojo.']),
        siNo: ['Si no te ven: revisá que la cámara no esté tapada y que WhatsApp tenga permiso de cámara en los Ajustes del celular.', 'Si se corta seguido: conectate a una red wifi o acercate al router.', 'Si no escuchan: revisá que el botón de micrófono no esté tachado.'],
        quiz: [
          { q: '¿Qué ícono usás para una videollamada?', o: ['El teléfono', 'La cámara', 'El clip'], c: 1, e: 'La cámara inicia una videollamada; el teléfono, una llamada de voz.' },
          { q: 'Durante la llamada no aparecen los botones. ¿Qué hacés?', o: ['Tocar la pantalla una vez', 'Cortar y volver a llamar', 'Reiniciar el celular'], c: 0, e: 'Los botones se esconden solos; con un toque vuelven a aparecer.' }
        ],
        ficha: ['Cámara arriba del chat = videollamada', 'Teléfono = llamada de voz', 'Tocar la pantalla = ver botones', 'Botón rojo = cortar']
      },
      {
        id: 'wa-grupos', t: 'Grupos: crearlos, silenciarlos y salir', min: 6, nivel: 'intermedio',
        para: 'Vas a armar un grupo de familia, silenciar los grupos que molestan y decidir quién puede agregarte a un grupo.',
        idea: ['Silenciar un grupo no te saca de él: solo deja de sonar.', 'Podés elegir que solo tus contactos te puedan agregar a grupos. Así evitás grupos de desconocidos.'],
        pasos: {
          android: ['Tocá el botón de nuevo chat (abajo a la derecha) y elegí “Nuevo grupo”.', 'Elegí los contactos y tocá la flecha.', 'Escribí el nombre del grupo y crealo.', 'Para silenciar un grupo: abrilo, tocá el nombre arriba y elegí “Silenciar notificaciones”.', 'Para decidir quién te agrega: tres puntos (arriba) → Ajustes → Privacidad → Grupos → Mis contactos.'],
          ios: ['En Chats, tocá el botón de nuevo chat (arriba a la derecha) y elegí “Nuevo grupo”.', 'Elegí los contactos y tocá “Siguiente”.', 'Escribí el nombre del grupo y tocá “Crear”.', 'Para silenciar un grupo: abrilo, tocá el nombre arriba y elegí “Silenciar”.', 'Para decidir quién te agrega: Configuración (abajo) → Privacidad → Grupos → Mis contactos.']
        },
        siNo: ['Si no encontrás una opción, abrí los Ajustes o la Configuración de WhatsApp y usá la lupa para buscar la palabra (por ejemplo, “grupos”).', 'Para salir de un grupo: tocá su nombre arriba y bajá hasta “Salir del grupo”.'],
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
  },
  {
    id: 'ia', n: 'Inteligencia artificial', apps: 'ChatGPT, Gemini y Claude', tone: 'violet', fase: 1,
    desc: 'Una asistente que te explica, te ayuda a escribir y te enseña lo que quieras. Gratis.',
    temas: ['Tu primera conversación', 'Cómo pedirle bien', 'Entender documentos', 'Hablarle con la voz', 'Qué no creerle ni compartirle'],
    lessons: [
      {
        id: 'ia-empezar', t: 'Tu primera conversación con una IA', min: 6, nivel: 'basico',
        para: 'Vas a instalar una inteligencia artificial gratuita y hacerle tu primera pregunta.',
        idea: ['Una IA como ChatGPT, Gemini o Claude es un programa con el que conversás escribiendo o hablando. Responde preguntas, explica, resume y ayuda a escribir.', 'Las tres tienen versión gratuita. Podés probar las tres y quedarte con la que más te guste.', 'Puede equivocarse: para salud, plata o temas legales, confirmá siempre con un profesional.'],
        pasos: {
          android: ['Abrí Play Store y buscá “ChatGPT”, “Gemini” o “Claude”.', 'Fijate que el desarrollador sea OpenAI, Google o Anthropic: hay apps falsas parecidas.', 'Instalala y creá tu cuenta con tu correo.', 'Escribí una pregunta simple, por ejemplo: “Explicame qué es la inflación como si tuviera 10 años”.', 'Después pedile: “Ahora dame un ejemplo con el precio del pan”.'],
          ios: ['Abrí App Store y buscá “ChatGPT”, “Gemini” o “Claude”.', 'Fijate que el desarrollador sea OpenAI, Google o Anthropic: hay apps falsas parecidas.', 'Instalala y creá tu cuenta con tu correo.', 'Escribí una pregunta simple, por ejemplo: “Explicame qué es la inflación como si tuviera 10 años”.', 'Después pedile: “Ahora dame un ejemplo con el precio del pan”.']
        },
        siNo: ['Si te pide pagar: todas tienen un plan gratis. Buscá la opción gratuita o “continuar gratis”.', 'Si no te gusta una respuesta, pedile “explicámelo más simple” o “dame otra opción”.'],
        quiz: [
          { q: '¿La IA puede equivocarse?', o: ['No, nunca', 'Sí, conviene verificar lo importante', 'Solo si es gratis'], c: 1, e: 'Puede inventar datos. Lo importante, verificalo.' },
          { q: 'Antes de instalar, ¿qué conviene mirar?', o: ['Que el desarrollador sea el oficial', 'El color del ícono', 'Que tenga muchos anuncios'], c: 0, e: 'Las apps falsas imitan nombres; el desarrollador oficial es la señal más confiable.' }
        ],
        ficha: ['ChatGPT (OpenAI), Gemini (Google), Claude (Anthropic): todas con plan gratis', 'Instalar solo desde la tienda oficial', 'Repreguntar: “más simple”, “otro ejemplo”', 'Verificar lo importante']
      },
      {
        id: 'ia-pedir', t: 'Cómo pedirle bien: la fórmula de 4 partes', min: 7, nivel: 'basico',
        para: 'Vas a escribir pedidos claros que dan respuestas mucho más útiles.',
        idea: ['Un buen pedido tiene cuatro partes: quién querés que sea, qué tiene que hacer, tu situación y cómo querés la respuesta.', 'Ejemplo flojo: “receta”. Ejemplo bueno: “Sos cocinera. Dame una receta de cena para 2 personas, sin sal porque soy hipertensa, con ingredientes baratos, en 5 pasos cortos.”'],
        sim: 'ia-prompt', simIntro: 'Armá tu pedido con la fórmula y copialo en tu IA.',
        pasos: same(['Abrí tu IA.', 'Pegá el pedido que armaste (mantené apretado el lugar donde se escribe y elegí “Pegar”).', 'Leé la respuesta y pedí ajustes: “más corto”, “en lista”, “con otro ejemplo”.', 'Si algo no te sirve, decile qué cambiar en lugar de empezar de cero.']),
        siNo: ['Si la respuesta es muy larga, pedile: “resumilo en 5 puntos”.', 'Si usa palabras difíciles, pedile: “explicámelo sin palabras técnicas”.'],
        quiz: [
          { q: '¿Cuál pedido va a dar una respuesta más útil?', o: ['“Viaje”', '“Armame un viaje de 3 días a Mendoza para 2 personas jubiladas, sin caminar mucho, con presupuesto moderado”'], c: 1, e: 'Con contexto y formato, la IA entiende lo que necesitás.' },
          { q: 'La respuesta no te sirve. ¿Qué conviene?', o: ['Cerrar la app', 'Decirle qué cambiar', 'Escribir lo mismo otra vez'], c: 1, e: 'Repreguntar con indicaciones mejora la respuesta.' }
        ],
        ficha: ['1. Quién: “Sos…”', '2. Qué: “Necesito que…”', '3. Mi situación: “Tengo 66 años, …”', '4. Cómo: “En 5 pasos cortos”']
      },
      {
        id: 'ia-docs', t: 'Entendé cualquier documento', min: 8, nivel: 'intermedio',
        para: 'Vas a convertir una carta difícil (banco, prepaga, municipio) en un resumen claro con fechas y qué hacer.',
        idea: ['Le podés pegar el texto o mandarle una foto del documento.', 'Antes, tapá o borrá los datos personales: DNI, números de cuenta, dirección.', 'Pedile siempre: qué dice en simple, fechas importantes, montos y qué tengo que hacer.'],
        sim: 'ia-doc', simIntro: 'Practicá con una carta ficticia.',
        pasos: same(['Sacá una foto del documento o copiá el texto.', 'Tapá los datos personales antes de compartirlo.', 'En tu IA, tocá el clip o el “+” para adjuntar la foto, o pegá el texto.', 'Escribí: “Explicame en simple qué dice, qué fechas y montos importan, y qué tengo que hacer”.', 'Compará las fechas y montos con el original antes de actuar.']),
        siNo: ['Si la foto sale borrosa, sacala con buena luz y el papel derecho.', 'Si es algo legal o médico importante, usá el resumen para preparar preguntas y consultalo con un profesional.'],
        quiz: [
          { q: 'Antes de mandarle la foto de una carta del banco…', o: ['Tapo número de cuenta y DNI', 'La mando entera', 'Le agrego mi clave'], c: 0, e: 'La IA no necesita tus datos personales para explicarte el texto.' },
          { q: 'La IA dice que el vencimiento es el 15. ¿Qué hacés?', o: ['Le creo sin mirar', 'Lo confirmo en el documento original', 'Pago ya'], c: 1, e: 'Siempre se verifica contra el original.' }
        ],
        ficha: ['Tapar datos personales', 'Pedido: “qué dice, fechas, montos y qué hago”', 'Verificar contra el original', 'Lo importante, con un profesional']
      },
      {
        id: 'ia-voz', t: 'Hablale en vez de escribir', min: 5, nivel: 'basico',
        para: 'Vas a conversar con la IA usando la voz, como en una charla, y planificar algo paso a paso.',
        idea: ['Las apps de IA tienen un modo de voz: hablás y te responde en voz alta.', 'Funciona muy bien para pensar en voz alta, practicar un idioma o planificar un viaje.'],
        pasos: same(['Abrí la app de tu IA.', 'Buscá el ícono de micrófono o el de ondas de sonido (suele estar al lado de donde se escribe).', 'La primera vez, aceptá el permiso de micrófono.', 'Probá: “Quiero organizar un viaje de 3 días por la costa. Hacéme preguntas de a una para ayudarme.”', 'Repreguntá con la voz: “más barato”, “otra opción”, “explicame mejor eso”.']),
        siNo: ['Si no aparece el modo de voz, usá el micrófono del teclado para dictar el texto.', 'Si no te entiende, hablá más despacio y cerca del celular.'],
        quiz: [
          { q: 'No encontrás el modo de voz. ¿Qué podés usar?', o: ['El micrófono del teclado para dictar', 'Nada, no se puede', 'La cámara'], c: 0, e: 'El dictado del teclado escribe por vos.' },
          { q: '¿Qué pedido ayuda a planificar mejor?', o: ['“Hacéme preguntas de a una”', '“Decime todo junto ya”'], c: 0, e: 'Que te pregunte de a una ayuda a llegar a un plan a tu medida.' }
        ],
        ficha: ['Ícono de micrófono u ondas = modo voz', 'Pedile que te pregunte de a una', 'Sin modo voz: dictado del teclado']
      },
      {
        id: 'ia-cuidados', t: 'Qué no creerle y qué no compartirle', min: 6, nivel: 'basico',
        para: 'Vas a usar la IA con confianza, sabiendo dónde están sus límites y cómo cuidar tus datos.',
        idea: ['La IA puede “inventar” datos con mucha seguridad. Para salud, plata y temas legales, usala para entender y preparar preguntas, no para decidir sola.', 'No le compartas DNI, claves, números de tarjeta, CBU ni códigos.', 'Cuidado con las estafas que usan IA: hay voces e imágenes falsas. Acordá con tu familia una palabra clave para emergencias.'],
        pasos: same(['Antes de usar un dato importante, pedile a la IA: “¿de dónde sale esto?” y verificalo en una fuente oficial.', 'Revisá qué compartís: nada de claves, DNI ni datos bancarios.', 'Acordá una palabra clave familiar para confirmar llamadas de emergencia.']),
        siNo: ['Si ya compartiste algo sensible, cambiá esa clave y avisá a tu banco si fueron datos bancarios.'],
        quiz: [
          { q: '¿Cuál de estos datos NO le compartirías?', o: ['Una receta de cocina', 'El número de tu tarjeta', 'Un texto para corregir'], c: 1, e: 'Datos bancarios, claves y DNI nunca.' },
          { q: 'Recibís un audio con la voz de tu nieto pidiendo plata urgente. ¿Qué hacés?', o: ['Transfiero ya', 'Lo llamo a su número de siempre o pido la palabra clave', 'Respondo con mis datos'], c: 1, e: 'Las voces se pueden imitar con IA. Confirmá por otro medio.' },
          { q: 'La IA te dice qué remedio tomar. ¿Qué hacés?', o: ['Lo tomo', 'Lo consulto con mi médico', 'Lo compro el doble'], c: 1, e: 'Usala para preparar preguntas, la decisión es con tu médico.' }
        ],
        ficha: ['Verificar lo importante', 'Nunca: claves, DNI, tarjetas, CBU, códigos', 'Palabra clave familiar contra voces falsas', 'Salud y plata: con profesionales']
      }
    ]
  },
  {
    id: 'pay', n: 'Plata en el celular', apps: 'Mercado Pago y Mercado Libre', tone: 'sky', fase: 1,
    desc: 'Pagar, transferir, cobrar y comprar online con tranquilidad.',
    temas: ['Pagar con QR', 'Transferir sin equivocarte', 'Cobrar y compartir tu alias', 'Comprar seguro', 'Estafas con pagos'],
    lessons: [
      {
        id: 'pay-qr', t: 'Pagar con QR', min: 5, nivel: 'basico',
        para: 'Vas a pagar en un comercio escaneando el código QR, revisando siempre a quién y cuánto.',
        idea: ['El QR es un cuadradito que el comercio tiene en el mostrador. Lo escaneás con tu billetera virtual y pagás.', 'Antes de confirmar, la app te muestra el nombre del comercio y el monto: es el momento de revisar.'],
        sim: 'pay-qr', simIntro: 'Probalo: escaneá el QR y revisá antes de pagar.',
        pasos: same(['Abrí tu billetera virtual (por ejemplo, Mercado Pago).', 'Tocá la opción para pagar con QR (suele estar en la pantalla principal).', 'Apuntá la cámara al código del comercio.', 'Revisá el nombre del comercio y el monto.', 'Confirmá y mostrá el comprobante si te lo piden.']),
        siNo: ['Si la cámara no lee el código, limpiá la lente y alejá un poco el celular.', 'Si el monto no coincide, no confirmes: pedí que lo corrijan.'],
        quiz: [
          { q: 'Antes de confirmar un pago con QR, ¿qué revisás?', o: ['El nombre del comercio y el monto', 'El color de la pantalla', 'Nada'], c: 0, e: 'Es la última oportunidad para detectar un error.' }
        ],
        ficha: ['Billetera → Pagar con QR', 'Revisar comercio y monto', 'Confirmar y guardar comprobante']
      },
      {
        id: 'pay-transfer', t: 'Transferir sin equivocarte', min: 6, nivel: 'basico',
        para: 'Vas a mandar plata con alias o CVU y revisar a nombre de quién va antes de confirmar.',
        idea: ['El alias es un nombre fácil (por ejemplo, “sol.mar.casa”) que reemplaza al número de cuenta.', 'Antes de confirmar, la app muestra el nombre del titular. Si no coincide con la persona, no sigas.', 'En general, una transferencia hecha no se puede deshacer.'],
        sim: 'pay-transfer', simIntro: 'Practicá: transferí $ 15.000 a tu sobrina Lucía Fernández.',
        pasos: same(['En tu billetera o tu banco, tocá “Transferir”.', 'Escribí el alias o el CVU/CBU (copiado del mensaje, sin cambiar letras).', 'Revisá el nombre del titular que aparece.', 'Escribí el monto y revisalo dos veces.', 'Confirmá y guardá el comprobante.']),
        siNo: ['Si el nombre que aparece no es el esperado, cancelá y confirmá el alias con la persona por otro medio.', 'Si te equivocaste, contactá enseguida a la ayuda oficial de tu banco o billetera desde la app.'],
        quiz: [
          { q: 'Escribís el alias y aparece otro nombre. ¿Qué hacés?', o: ['Transfiero igual', 'Cancelo y confirmo el alias con la persona', 'Cambio una letra a ver'], c: 1, e: 'El nombre del titular es tu control de seguridad.' }
        ],
        ficha: ['Alias = nombre fácil de la cuenta', 'Revisar el nombre del titular', 'Revisar el monto dos veces', 'Guardar el comprobante']
      },
      {
        id: 'pay-cobrar', t: 'Cobrar y compartir tu alias', min: 5, nivel: 'intermedio',
        para: 'Vas a encontrar tu alias, cambiarlo por uno fácil y comprobar si de verdad te pagaron.',
        idea: ['Tu alias y tu CVU están en los datos de tu cuenta dentro de la app.', 'Una captura de pantalla de un comprobante se puede falsificar. El pago es real solo si aparece en tu app.'],
        pasos: same(['Abrí tu billetera y buscá “Tu CVU” o “Alias” (suele estar en tu perfil o en los datos de la cuenta).', 'Si querés, cambiá el alias por uno fácil de dictar.', 'Tocá “Compartir” para mandarlo por WhatsApp.', 'Cuando te paguen, confirmalo en tu actividad o movimientos de la app, no en una captura.']),
        siNo: ['Si alguien insiste en que ya pagó pero no lo ves en tu app, no entregues nada hasta que aparezca.'],
        quiz: [
          { q: 'Te mandan una captura de un pago. ¿Ya cobraste?', o: ['Sí, la captura alcanza', 'Solo si aparece en mis movimientos de la app'], c: 1, e: 'Las capturas se pueden falsificar.' }
        ],
        ficha: ['Alias y CVU en los datos de la cuenta', 'Compartir por WhatsApp', 'Confirmar pagos en la app, no en capturas']
      },
      {
        id: 'pay-comprar', t: 'Comprar seguro en Mercado Libre', min: 7, nivel: 'basico',
        para: 'Vas a elegir un vendedor confiable y comprar con la protección de la plataforma.',
        idea: ['Mirá la reputación del vendedor y las opiniones de otros compradores.', 'Pagá siempre dentro de la plataforma: si te piden pagar por fuera o seguir por WhatsApp, perdés la protección.', 'Un precio mucho más bajo que el resto es una señal de alerta.'],
        sim: 'ml-seller', simIntro: 'Elegí a qué vendedor le comprarías.',
        pasos: same(['Buscá el producto en la app.', 'Entrá a la publicación y mirá la reputación del vendedor y las opiniones.', 'Leé las preguntas de otros compradores.', 'Comprá y pagá dentro de la app.', 'Seguí el envío en “Mis compras”. Si hay un problema, usá la ayuda de esa compra.']),
        siNo: ['Si el producto no llega o es distinto, entrá a la compra en “Mis compras” y buscá la opción de ayuda o reclamo.'],
        quiz: [
          { q: 'El vendedor te dice “pagame por transferencia y te hago descuento”. ¿Qué hacés?', o: ['Acepto, es más barato', 'No: pago solo dentro de la plataforma'], c: 1, e: 'Fuera de la plataforma no tenés protección.' }
        ],
        ficha: ['Reputación y opiniones del vendedor', 'Pagar siempre dentro de la app', 'Precio demasiado bajo = alerta', '“Mis compras” para seguir y reclamar']
      },
      {
        id: 'pay-estafas', t: 'Estafas con pagos: las 5 más comunes', min: 6, nivel: 'basico',
        para: 'Vas a reconocer las trampas más usadas con billeteras virtuales y compras.',
        idea: ['1. “Te transferí de más, devolvémelo”: verificá en tu app; suele ser falso.', '2. Comprobantes falsos: confirmá siempre en tus movimientos.', '3. Falso soporte que pide códigos o claves: el soporte real no te los pide.', '4. Links de premios o reintegros: no entres, abrí la app vos.', '5. Señas por adelantado para alquileres o autos baratos: desconfiá y verificá en persona.'],
        pasos: same(['Ante cualquier mensaje con plata de por medio, frená y no respondas apurado.', 'Abrí la app oficial vos (no desde el link) y fijate si es cierto.', 'Si dudás, consultá a alguien de confianza.', 'Practicá en el Escudo antiestafas.']),
        siNo: ['Si caíste en una estafa, avisá enseguida a tu banco o billetera desde la app oficial y hacé la denuncia.'],
        quiz: [
          { q: '“Te transferí de más por error, devolveme $ 20.000”. ¿Qué hacés primero?', o: ['Devuelvo enseguida', 'Reviso mis movimientos en la app'], c: 1, e: 'En la mayoría de los casos, la plata nunca llegó.' },
          { q: 'Te llega un link de “reintegro” de tu billetera. ¿Qué hacés?', o: ['Entro y pongo mis datos', 'Abro la app oficial por mi cuenta'], c: 1, e: 'Los links falsos copian el diseño de la app.' }
        ],
        ficha: ['Frenar ante la urgencia', 'Verificar en la app, no en el mensaje', 'Nunca compartir códigos ni claves', 'Practicar en el Escudo antiestafas']
      }
    ]
  },
  {
    id: 'google', n: 'Google en tu celular', apps: 'Maps, Fotos, Drive y Traductor', tone: 'amber', fase: 2,
    desc: 'Llegar a cualquier lado, cuidar tus fotos y traducir hablando.',
    temas: ['Recorridos y transporte', 'Compartir ubicación', 'Copia de tus fotos', 'Liberar espacio', 'Traducir hablando'], lessons: []
  },
  {
    id: 'redes', n: 'Redes sociales', apps: 'Facebook, Instagram, YouTube y TikTok', tone: 'sky', fase: 2,
    desc: 'Disfrutar las redes con privacidad y criterio.',
    temas: ['Privacidad', 'Perfiles falsos', 'Noticias falsas', 'Encontrar contenido que vale la pena'], lessons: []
  },
  {
    id: 'crear', n: 'Crear con el celular', apps: 'Canva y CapCut', tone: 'violet', fase: 3,
    desc: 'Tarjetas, invitaciones y videos con las fotos de la familia.',
    temas: ['Tarjetas e invitaciones', 'Videos con fotos', 'Mejorar fotos con IA'], lessons: []
  }
];
export const MOD = (id: string) => MODULES.find((m) => m.id === id);

/* ===== Primeros ajustes del celular ===== */
export const SETUP: { id: string; t: string; por: string; android: string; ios: string; samsung?: string }[] = [
  { id: 'letra', t: 'Letra más grande', por: 'Leer sin anteojos y sin esfuerzo.', android: 'Ajustes → Pantalla → Tamaño de fuente (o “Tamaño de pantalla y texto”).', samsung: 'En Samsung: Ajustes → Pantalla → Tamaño y estilo de fuente.', ios: 'Ajustes → Pantalla y brillo → Tamaño del texto. Para aún más grande: Accesibilidad → Pantalla y tamaño de texto → Texto más grande.' },
  { id: 'oscuro', t: 'Modo oscuro o más contraste', por: 'Descansa la vista y ahorra batería.', android: 'Ajustes → Pantalla → Tema oscuro (o “Modo oscuro”).', ios: 'Ajustes → Pantalla y brillo → Oscuro.' },
  { id: 'leer', t: 'Que el celular te lea en voz alta', por: 'Escuchar mensajes y textos largos.', android: 'Ajustes → Accesibilidad → “Seleccionar para pronunciar” (el nombre puede variar según la marca).', ios: 'Ajustes → Accesibilidad → Contenido leído → activá “Leer selección”.' },
  { id: 'dictado', t: 'Dictar en vez de escribir', por: 'Escribir mensajes hablando.', android: 'En el teclado, tocá el micrófono y hablá. Si no aparece, revisá los ajustes de tu teclado.', ios: 'Ajustes → General → Teclado → activá “Dictado”. Después, tocá el micrófono del teclado.' },
  { id: 'bloqueo', t: 'Bloqueo de pantalla', por: 'Que nadie pueda usar tu celular si lo perdés.', android: 'Ajustes → Seguridad (o Seguridad y privacidad) → Bloqueo de pantalla. Elegí PIN o huella.', ios: 'Ajustes → Face ID y código (o Touch ID y código) → Activar código.' },
  { id: 'buscar', t: 'Encontrar el celular si se pierde', por: 'Ubicarlo, hacerlo sonar o bloquearlo a distancia.', android: 'Ajustes → Google → “Encontrar mi dispositivo” (o en Seguridad). Activalo.', ios: 'Ajustes → tu nombre (arriba) → Buscar → Buscar mi iPhone. Activalo.' },
  { id: 'update', t: 'Actualizaciones al día', por: 'Las actualizaciones cierran puertas a los virus.', android: 'Ajustes → Sistema → Actualización de software (en Samsung: Ajustes → Actualización de software).', ios: 'Ajustes → General → Actualización de software.' }
];

/* ===== Encuesta inicial ===== */
export const DIAG_APPS: [string, string][] = [['wa', 'WhatsApp'], ['fb', 'Facebook'], ['ig', 'Instagram'], ['yt', 'YouTube'], ['tt', 'TikTok'], ['maps', 'Google Maps'], ['mp', 'Mercado Pago'], ['ml', 'Mercado Libre'], ['ia', 'ChatGPT u otra IA']];
export const DIAG_AREAS: [string, string][] = [['wa', 'WhatsApp'], ['ia', 'Inteligencia artificial'], ['pay', 'Pagar y comprar con el celular'], ['google', 'Mapas y fotos'], ['redes', 'Redes sociales']];
export const NIVELES: [string, string][] = [['cuesta', 'Me cuesta'], ['defiendo', 'Me defiendo'], ['bien', 'Me manejo bien']];
export const METAS: [string, string][] = [['familia', 'Hablar más con la familia'], ['proteger', 'Protegerme de estafas'], ['ia', 'Usar la inteligencia artificial'], ['pagos', 'Pagar y comprar sin miedo'], ['fotos', 'Cuidar mis fotos'], ['aprender', 'Aprender cosas nuevas']];
export const MIEDOS: [string, string][] = [['estafas', 'Caer en una estafa'], ['cuentas', 'Que me roben las cuentas'], ['fotos', 'Perder mis fotos'], ['plata', 'Equivocarme con la plata'], ['nada', 'Nada en especial']];
export const RETOS = [
  { id: 'r1', area: 'wa', q: 'Te llega: “Hola, soy de soporte de WhatsApp. Pasame el código de 6 números que te llegó para verificar tu cuenta.” ¿Qué hacés?', o: ['Se lo paso', 'No se lo paso a nadie', 'Le pido que me llame primero'], c: 1 },
  { id: 'r2', area: 'pay', q: 'Vas a transferir con un alias y aparece un nombre distinto al de la persona. ¿Qué hacés?', o: ['Transfiero igual', 'Cancelo y confirmo el alias con la persona', 'Pruebo cambiando una letra'], c: 1 },
  { id: 'r3', area: 'ia', q: '¿Qué pedido le darías a una IA para que responda mejor?', o: ['“Receta”', '“Receta de cena para 2, sin sal, barata, en 5 pasos cortos”'], c: 1 }
];
