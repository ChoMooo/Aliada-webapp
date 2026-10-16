import { type Module, type Screen, same, F, home, app, T } from './shared';

/* Pantalla genérica de una app de IA: tarjetas como burbujas de conversación */
const ia = (blocks: any[], hl?: string): Screen => app('Asistente de IA', blocks, hl, { tone: T.ia });
const yo = (t: string) => ({ b: 'card', t, i: 'persona' });
const resp = (t: string, s?: string) => ({ b: 'card', t, s, i: 'ia' });
const caja = (t = 'Escribí tu pregunta…', ph = true) => ({ b: 'input', t, ph, id: 'in' });
const tienda = (q: string, hl?: string): Screen => app('Tienda de apps', [{ b: 'search', t: q, id: 'q' }, { b: 'card', t: 'Asistente de IA', s: 'Desarrollador oficial · Gratis', i: 'ia', id: 'res' }, { b: 'card', t: 'IA Chat Pro 2026', s: 'Desarrollador desconocido · Compras en la app', i: 'ia' }, { b: 'btn', t: 'Instalar', id: 'inst' }], hl, { tone: '#2f7a64' });

export const IA: Module = {
  id: 'ia', n: 'Inteligencia artificial', apps: 'ChatGPT, Gemini y Claude', tone: 'violet', section: 'digital',
  desc: 'Una asistente que te explica, te ayuda a escribir y te enseña lo que quieras. Gratis.',
  temas: ['Tu primera conversación', 'Cómo pedirle bien', 'Entender documentos', 'Hablarle con la voz', 'Qué no creerle ni compartirle'],
  lessons: [
    {
      id: 'ia-empezar', t: 'Tu primera conversación con una IA', min: 6, nivel: 'basico',
      para: 'Vas a instalar una inteligencia artificial gratuita y hacerle tu primera pregunta.',
      idea: ['Una IA como ChatGPT, Gemini o Claude es un programa con el que conversás escribiendo o hablando. Responde preguntas, explica, resume y ayuda a escribir.', 'Las tres tienen versión gratuita. Podés probar las tres y quedarte con la que más te guste.', 'Puede equivocarse: para salud, plata o temas legales, confirmá siempre con un profesional.'],
      demo: [
        F(home('Tienda'), 'Abrí la tienda de aplicaciones: Play Store en Android o App Store en iPhone.'),
        F(tienda('ChatGPT', 'q'), 'Buscá el nombre de la IA: ChatGPT, Gemini o Claude.', 'type'),
        F(tienda('ChatGPT', 'res'), 'Fijate que el desarrollador sea el oficial: OpenAI, Google o Anthropic. Hay copias falsas.'),
        F(tienda('ChatGPT', 'inst'), 'Tocá «Instalar» y después creá tu cuenta con tu correo.'),
        F(ia([resp('¡Hola! ¿En qué te ayudo hoy?'), caja('Explicame qué es la inflación como si tuviera 10 años', false), { b: 'btn', t: 'Enviar', id: 'env' }], 'env'), 'Escribí tu primera pregunta y tocá enviar.', 'type'),
        F(ia([yo('Explicame qué es la inflación como si tuviera 10 años'), resp('Es cuando las cosas cuestan cada vez más…', 'Imaginá que con $ 1.000 hoy comprás 2 panes…'), caja('Ahora dame un ejemplo con el precio del pan', false)], 'in'), 'Seguí la charla: podés repreguntar todo lo que quieras.')
      ],
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
      demo: [
        F(ia([yo('Receta'), resp('Aquí tenés una receta de lasaña con 14 ingredientes…', 'Larga, con sal y difícil')]), 'Un pedido de una sola palabra da una respuesta que no te sirve.'),
        F(ia([caja('Sos cocinera.', false), { b: 'text', t: '1 · Quién querés que sea', muted: true }], 'in'), 'Primera parte: decile quién querés que sea. Por ejemplo, «Sos cocinera».', 'type'),
        F(ia([caja('Sos cocinera. Dame una receta de cena para 2.', false), { b: 'text', t: '2 · Qué tiene que hacer', muted: true }], 'in'), 'Segunda parte: qué necesitás que haga.', 'type'),
        F(ia([caja('… sin sal porque soy hipertensa, con cosas baratas.', false), { b: 'text', t: '3 · Tu situación', muted: true }], 'in'), 'Tercera parte: tu situación. Es lo que hace que la respuesta sea para vos.', 'type'),
        F(ia([caja('… en 5 pasos cortos.', false), { b: 'text', t: '4 · Cómo querés la respuesta', muted: true }, { b: 'btn', t: 'Enviar', id: 'env' }], 'env'), 'Cuarta parte: cómo la querés. Por ejemplo, en 5 pasos cortos.'),
        F(ia([yo('Sos cocinera. Dame una receta de cena para 2…'), resp('Tarta de zapallitos sin sal', '1. Prendé el horno… 2. …'), caja('Más corto, por favor', false)], 'in'), 'Si algo no te sirve, pedile un ajuste en vez de empezar de cero.')
      ],
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
      demo: [
        F(app('Cámara', [{ b: 'img', t: 'Carta de la prepaga', tone: 1 }, { b: 'text', t: 'Con buena luz y el papel derecho', muted: true }, { b: 'btn', t: 'Sacar foto', id: 'foto' }], 'foto', { tone: '#444b52' }), 'Sacá una foto del documento con buena luz y el papel derecho.'),
        F(app('Editar foto', [{ b: 'img', t: 'DNI ████  ·  Cuenta ████', tone: 1, id: 'tap' }, { b: 'text', t: 'Tapá los datos personales con el lápiz o recortá', muted: true }], 'tap', { tone: '#444b52' }), 'Antes de compartirla, tapá el DNI, los números de cuenta y la dirección.'),
        F(ia([resp('¿En qué te ayudo?'), { b: 'tiles', items: [{ t: 'Adjuntar foto', i: 'galeria' }, { t: 'Cámara', i: 'camara' }], hl: 0 }, caja()]), 'En tu IA, tocá el clip o el «+» y elegí la foto.'),
        F(ia([{ b: 'img', t: 'Carta de la prepaga', tone: 1 }, caja('Explicame en simple qué dice, qué fechas y montos importan y qué tengo que hacer', false), { b: 'btn', t: 'Enviar', id: 'env' }], 'env'), 'Pedile: qué dice en simple, qué fechas y montos importan y qué tenés que hacer.', 'type'),
        F(ia([resp('Resumen en simple', 'Tu cuota aumenta desde el 1 de diciembre. Si no estás de acuerdo, tenés plazo para…'), { b: 'card', t: 'Compará las fechas y montos con la carta original', i: 'check', id: 'ver' }], 'ver'), 'Antes de actuar, compará las fechas y montos con la carta original.')
      ],
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
      demo: [
        F(ia([resp('¿En qué te ayudo?'), caja(), { b: 'tiles', items: [{ t: 'Dictar', i: 'mic' }, { t: 'Modo voz', i: 'voz' }], hl: 1 }]), 'Buscá el ícono de micrófono o de ondas de sonido, al lado de donde se escribe.'),
        F(app('Permiso', [{ b: 'text', t: '¿Permitir que la app use el micrófono?', big: true }, { b: 'btn', t: 'Permitir', id: 'ok' }, { b: 'btn', t: 'No permitir', tone: 'ghost' }], 'ok'), 'La primera vez, el celular te pide permiso para el micrófono: tocá «Permitir».'),
        F(app('Modo voz', [{ b: 'big', t: '◉  Escuchando…', s: 'Hablá con tranquilidad' }, { b: 'card', t: '“Quiero organizar un viaje de 3 días por la costa. Hacéme preguntas de a una.”', i: 'mic' }, { b: 'btn', t: 'Terminar', tone: 'ghost', id: 'fin' }], undefined, { tone: T.ia }), 'Hablale como a una persona. Pedile que te haga preguntas de a una.'),
        F(app('Modo voz', [{ b: 'big', t: '◉  Respondiendo', s: 'La IA te contesta en voz alta' }, { b: 'card', t: '“¡Buenísimo! Primero: ¿preferís mar tranquilo o una ciudad con paseos?”', i: 'ia' }, { b: 'btn', t: 'Terminar', tone: 'ghost', id: 'fin' }], 'fin', { tone: T.ia }), 'Te responde en voz alta. Cuando termines, tocá «Terminar».')
      ],
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
      demo: [
        F(ia([yo('¿Qué remedio tomo para la presión?'), resp('Podría ser…', 'La IA no te conoce ni ve tus estudios'), { b: 'card', t: 'Usala para preparar preguntas para tu médico', i: 'check', id: 'ok' }], 'ok'), 'Para salud, plata o temas legales, la IA sirve para preparar preguntas, no para decidir.'),
        F(ia([yo('¿De dónde sale ese dato?'), resp('Según el sitio oficial de…', 'Abrí la fuente y verificalo'), caja()], 'in'), 'Si un dato es importante, preguntale de dónde sale y verificalo en la fuente oficial.'),
        F(ia([{ b: 'card', t: 'Nunca le escribas: DNI, claves, tarjeta, CBU o códigos', i: 'candado', id: 'no' }, caja()], 'no'), 'Nunca le compartas claves, DNI, tarjetas, CBU ni códigos.'),
        F({ k: 'chat', title: 'Nieto', msgs: [{ audio: true, t: '' }, { t: 'Abu, choqué, mandame plata ya' }], hl: 'phone' }, 'Las voces se pueden imitar con IA. Ante un pedido urgente, llamá vos al número de siempre.'),
        F({ k: 'chat', title: 'Familia Pérez', sub: '5 participantes', msgs: [{ me: true, t: 'Acordemos una palabra clave para emergencias: si alguien pide plata, la tiene que decir.' }], hl: 'm0' }, 'Acordá con tu familia una palabra clave para confirmar emergencias.')
      ],
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
};
