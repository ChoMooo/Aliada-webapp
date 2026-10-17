import { type Module, same, F, S, home, store } from './shared';

const ai = (o: any = {}) => S('ai', o);

export const IA: Module = {
  id: 'ia', n: 'Inteligencia artificial', apps: 'ChatGPT, Gemini y Claude', tone: 'violet', section: 'digital',
  desc: 'Una asistente que te explica, te ayuda a escribir, te enseña, mira fotos y crea imágenes. Gratis.',
  temas: ['Tu primera conversación', 'Cómo pedirle bien', 'Hablarle con la voz', 'Preguntarle por una foto', 'Entender documentos', 'Escribir mejor', 'Aprender algo nuevo', 'Crear imágenes', 'Usarla con criterio'],
  lessons: [
    {
      id: 'ia-empezar', t: 'Tu primera conversación con una IA', min: 6, nivel: 'basico',
      para: 'Vas a instalar una inteligencia artificial gratuita y hacerle tus primeras preguntas.',
      idea: ['Una IA como ChatGPT, Gemini o Claude es un programa con el que conversás escribiendo o hablando. Responde, explica, resume y ayuda a escribir.', 'Las tres tienen versión gratuita. Podés probarlas y quedarte con la que más te guste.', 'La conversación sigue: podés repreguntar y pedirle cambios como si charlaras con alguien.'],
      demo: [
        F(home('Play Store'), 'Abrí la tienda de aplicaciones: Play Store en Android o App Store en iPhone.'),
        F(store('ChatGPT', 'OpenAI'), 'Buscá el nombre de la IA y fijate que el desarrollador sea el oficial (OpenAI, Google o Anthropic). Tocá «Instalar».'),
        F(ai({ hl: 'in' }), 'Abrila, creá tu cuenta con tu correo y tocá donde dice «Preguntá lo que quieras».'),
        F(ai({ typing: 'Explicame qué es la inflación como si tuviera 10 años', kb: true, hl: 'send' }), 'Escribí tu pregunta y tocá la flecha para enviar.', 'type'),
        F(ai({ msgs: [{ me: true, t: 'Explicame qué es la inflación como si tuviera 10 años' }, { t: '**Imaginá un kiosco**\nSi hoy con $ 1.000 comprás 2 alfajores y el año que viene con la misma plata comprás 1, eso es la inflación: los precios suben y la plata rinde menos.' }], hl: 'm1' }), 'La IA te responde en segundos.'),
        F(ai({ msgs: [{ me: true, t: 'Explicame qué es la inflación como si tuviera 10 años' }, { t: '**Imaginá un kiosco**\nSi hoy con $ 1.000 comprás 2 alfajores…' }], typing: 'Dame otro ejemplo con el pan', hl: 'send' }), 'Seguí la charla: pedile otro ejemplo, que lo explique más simple o más corto.', 'type')
      ],
      pasos: {
        android: ['Abrí Play Store y buscá “ChatGPT”, “Gemini” o “Claude”.', 'Fijate que el desarrollador sea OpenAI, Google o Anthropic, e instalala.', 'Creá tu cuenta con tu correo (o con tu cuenta de Google).', 'Escribí una pregunta simple y tocá enviar.', 'Seguí la charla: “más simple”, “dame un ejemplo”, “resumilo en 3 puntos”.'],
        ios: ['Abrí App Store y buscá “ChatGPT”, “Gemini” o “Claude”.', 'Fijate que el desarrollador sea OpenAI, Google o Anthropic, e instalala.', 'Creá tu cuenta con tu correo (o con tu cuenta de Apple o Google).', 'Escribí una pregunta simple y tocá enviar.', 'Seguí la charla: “más simple”, “dame un ejemplo”, “resumilo en 3 puntos”.']
      },
      siNo: ['Si te ofrece un plan pago, buscá la opción gratuita o “continuar gratis”: alcanza para empezar.', 'Si una respuesta no te convence, pedile “explicámelo de otra forma”.'],
      quiz: [
        { q: 'Antes de instalar, ¿qué conviene mirar?', o: ['Que el desarrollador sea el oficial', 'El color del ícono', 'Que tenga muchos anuncios'], c: 0, e: 'Hay apps con nombres parecidos; el desarrollador oficial es la señal más confiable.' },
        { q: 'La respuesta te resultó difícil. ¿Qué hacés?', o: ['Le pido que lo explique más simple', 'Cierro la app', 'Empiezo una cuenta nueva'], c: 0, e: 'La conversación sigue: podés pedir ajustes.' }
      ],
      ficha: ['ChatGPT (OpenAI), Gemini (Google), Claude (Anthropic): con plan gratis', 'Instalar desde la tienda oficial', 'Repreguntar: “más simple”, “otro ejemplo”']
    },
    {
      id: 'ia-pedir', t: 'Cómo pedirle bien: la fórmula de 4 partes', min: 7, nivel: 'basico',
      para: 'Vas a escribir pedidos claros que dan respuestas mucho más útiles.',
      idea: ['Un buen pedido tiene cuatro partes: quién querés que sea, qué tiene que hacer, tu situación y cómo querés la respuesta.', 'Ejemplo flojo: “receta”. Ejemplo bueno: “Sos cocinera. Dame una receta de cena para 2 personas, sin sal porque soy hipertensa, con ingredientes baratos, en 5 pasos cortos.”', 'Si la respuesta no te sirve, decile qué cambiar en lugar de empezar de cero.'],
      demo: [
        F(ai({ msgs: [{ me: true, t: 'Receta' }, { t: 'Aquí tenés una receta de lasaña con 14 ingredientes…' }], hl: 'm1' }), 'Un pedido de una sola palabra da una respuesta que no está pensada para vos.'),
        F(ai({ typing: 'Sos cocinera.', hl: 'in' }), 'Primera parte: decile quién querés que sea. Por ejemplo, «Sos cocinera».', 'type'),
        F(ai({ typing: 'Sos cocinera. Dame una receta de cena para 2.', hl: 'in' }), 'Segunda parte: qué necesitás que haga.', 'type'),
        F(ai({ typing: '… sin sal porque soy hipertensa, con cosas baratas…', hl: 'in' }), 'Tercera parte: tu situación. Es lo que hace que la respuesta sea para vos.', 'type'),
        F(ai({ typing: '… en 5 pasos cortos.', hl: 'send' }), 'Cuarta parte: cómo la querés. Por ejemplo, en 5 pasos cortos.', 'type'),
        F(ai({ msgs: [{ me: true, t: 'Sos cocinera. Dame una receta de cena para 2, sin sal…' }, { t: '**Tarta de zapallitos sin sal**\n1. Prendé el horno a 180°.\n2. Rallá 2 zapallitos…' }], typing: 'Más corto, por favor', hl: 'send' }), 'Si algo no te sirve, pedile un ajuste: «más corto», «en lista», «otra opción».', 'type')
      ],
      sim: 'ia-prompt', simIntro: 'Armá tu pedido con la fórmula y copialo en tu IA.',
      pasos: same(['Abrí tu IA.', 'Escribí o pegá tu pedido con las cuatro partes (para pegar: mantené apretado donde se escribe → Pegar).', 'Leé la respuesta y pedí ajustes: “más corto”, “en lista”, “con otro ejemplo”.', 'Guardá lo que te sirvió: mantené apretada la respuesta o tocá el ícono de copiar.']),
      siNo: ['Si la respuesta es muy larga, pedile: “resumilo en 5 puntos”.', 'Si usa palabras difíciles, pedile: “explicámelo sin palabras técnicas”.'],
      quiz: [
        { q: '¿Cuál pedido va a dar una respuesta más útil?', o: ['“Viaje”', '“Armame un viaje de 3 días a Mendoza para 2 personas, sin caminar mucho, con presupuesto moderado”'], c: 1, e: 'Con contexto y formato, la IA entiende lo que necesitás.' },
        { q: 'La respuesta no te sirve. ¿Qué conviene?', o: ['Cerrar la app', 'Decirle qué cambiar', 'Escribir lo mismo otra vez'], c: 1, e: 'Repreguntar con indicaciones mejora la respuesta.' }
      ],
      ficha: ['1. Quién: “Sos…”', '2. Qué: “Necesito que…”', '3. Mi situación: “Tengo 66 años, …”', '4. Cómo: “En 5 pasos cortos”']
    },
    {
      id: 'ia-voz', t: 'Hablale en vez de escribir', min: 5, nivel: 'basico',
      para: 'Vas a conversar con la IA usando la voz, como en una charla, y planificar algo paso a paso.',
      idea: ['Las apps de IA tienen un modo de voz: hablás y te responde en voz alta.', 'Sirve para pensar en voz alta, practicar un idioma, pedir una receta mientras cocinás o planificar un viaje.', 'Si preferís leer la respuesta, usá el micrófono chico para dictar: escribe lo que decís.'],
      demo: [
        F(ai({ hl: 'voice' }), 'Tocá el botón de ondas de sonido, al lado de donde se escribe.'),
        F(ai({ dialog: { title: '¿Permitir que la app grabe audio?', icon: 'mic', ok: 'Mientras la app está en uso', cancel: 'No permitir' }, hl: 'ok' }), 'La primera vez, el celular te pide permiso para el micrófono. Tocá «Mientras la app está en uso».'),
        F(ai({ v: 'voice', said: 'Quiero organizar un viaje de 3 días por la costa. Haceme preguntas de a una.', hl: 'vmic' }), 'Hablale como a una persona. Pedile que te haga preguntas de a una.'),
        F(ai({ v: 'voice', status: 'Respondiendo…', said: '¡Buenísimo! Primero: ¿preferís mar tranquilo o una ciudad con paseos?', hl: 'vend' }), 'Te responde en voz alta. Cuando termines, tocá la X.'),
        F(ai({ hl: 'mic' }), 'Si preferís leer la respuesta, tocá el micrófono chico: dictás y aparece escrito.')
      ],
      pasos: same(['Abrí la app de tu IA.', 'Tocá el botón de ondas de sonido (modo voz), al lado de donde se escribe.', 'La primera vez, aceptá el permiso de micrófono.', 'Probá: “Quiero organizar un viaje de 3 días por la costa. Haceme preguntas de a una para ayudarme.”', 'Para terminar, tocá la X. La charla queda guardada como texto.']),
      siNo: ['Si no aparece el modo voz, usá el micrófono del teclado para dictar.', 'Si no te entiende, hablá más despacio y cerca del celular.'],
      quiz: [
        { q: 'No encontrás el modo voz. ¿Qué podés usar?', o: ['El micrófono para dictar', 'Nada', 'La cámara'], c: 0, e: 'El dictado escribe lo que decís.' },
        { q: '¿Qué pedido ayuda a planificar mejor?', o: ['“Haceme preguntas de a una”', '“Decime todo junto ya”'], c: 0, e: 'Que te pregunte de a una ayuda a llegar a un plan a tu medida.' }
      ],
      ficha: ['Ondas de sonido = modo voz', 'Micrófono chico = dictar', 'Pedile que te pregunte de a una']
    },
    {
      id: 'ia-fotos', t: 'Preguntale por una foto', min: 6, nivel: 'basico',
      para: 'Vas a sacar una foto y preguntarle a la IA qué es, cómo se usa o qué podés hacer con eso.',
      idea: ['Las IA pueden “mirar” fotos: una planta, un cartel en otro idioma, un electrodoméstico, lo que hay en la heladera.', 'Le adjuntás la foto con el “+” y le escribís tu pregunta.', 'Para salud o medicamentos, usala para entender, y la decisión tomala con tu médico.'],
      demo: [
        F(ai({ hl: 'plus' }), 'Tocá el «+» de la caja de texto.'),
        F(ai({ v: 'attach', hl: 'o0' }), 'Elegí «Cámara» para sacar una foto ahora, o «Fotos» para una que ya tengas.'),
        F(S('phone', { v: 'camera', photo: 4, hl: 'shot' }), 'Sacá la foto, por ejemplo de una planta del balcón.'),
        F(ai({ msgs: [{ me: true, img: 4, t: '¿Qué planta es y cómo la cuido?' }], hl: 'm0' }), 'Escribí tu pregunta junto a la foto y enviá.', 'type'),
        F(ai({ msgs: [{ me: true, img: 4, t: '¿Qué planta es y cómo la cuido?' }, { t: '**Parece una lavanda.**\n• Sol directo al menos 6 horas.\n• Regá poco: cuando la tierra esté seca.\n• Podala después de la floración.' }], hl: 'm1' }), 'Te responde con lo que ve. Podés seguir preguntando sobre la misma foto.'),
        F(ai({ msgs: [{ me: true, img: 2, t: 'Tengo esto en la heladera. ¿Qué cocino hoy para 2?' }, { t: '**Opción rápida:** tortilla de verduras…' }], hl: 'm0' }), 'Otra idea: sacale una foto a la heladera y pedile una receta con lo que tenés.')
      ],
      pasos: same(['Abrí tu IA y tocá el “+” (o el clip) de la caja de texto.', 'Elegí “Cámara” para sacar una foto o “Fotos” para elegir una.', 'Escribí tu pregunta: “¿qué es?”, “¿cómo se usa?”, “traducime este cartel”, “¿qué cocino con esto?”.', 'Enviá y leé la respuesta. Podés seguir preguntando sobre la misma foto.']),
      siNo: ['Si no reconoce bien, sacá la foto más de cerca y con buena luz.', 'No compartas fotos de documentos con tus datos, tarjetas ni claves.'],
      quiz: [
        { q: '¿Desde dónde le mandás una foto a la IA?', o: ['Desde el + de la caja de texto', 'Desde Ajustes', 'No se puede'], c: 0, e: 'Ahí aparecen Cámara, Fotos y Archivos.' },
        { q: 'Le mostrás la caja de un remedio. ¿Qué hacés con la respuesta?', o: ['La uso para entender y consulto con mi médico', 'Cambio la dosis', 'La ignoro'], c: 0, e: 'Sirve para entender; las decisiones de salud, con un profesional.' }
      ],
      ficha: ['+ → Cámara o Fotos', 'Foto + pregunta', 'Ideas: plantas, carteles, heladera, aparatos', 'Salud: con tu médico']
    },
    {
      id: 'ia-docs', t: 'Entendé cualquier documento', min: 8, nivel: 'intermedio',
      para: 'Vas a convertir una carta difícil (banco, prepaga, municipio) en un resumen claro con fechas y qué hacer.',
      idea: ['Le podés mandar una foto del documento, el PDF o pegar el texto.', 'Antes, tapá o borrá los datos personales: DNI, números de cuenta, dirección.', 'Pedile siempre: qué dice en simple, qué fechas y montos importan y qué tenés que hacer.'],
      demo: [
        F(S('phone', { v: 'camera', photo: 8, hl: 'shot' }), 'Sacá una foto del documento con buena luz y el papel derecho.'),
        F(S('photos', { v: 'edit', tool: 2, photo: 8, hl: 'opt0' }), 'Antes de compartirla, tapá el DNI y los números de cuenta (con el lápiz o recortando).'),
        F(ai({ v: 'attach', hl: 'o1' }), 'En tu IA, tocá el «+» y elegí la foto o el archivo.'),
        F(ai({ msgs: [{ me: true, doc: 'Carta prepaga.pdf', t: 'Explicame en simple qué dice, qué fechas y montos importan y qué tengo que hacer.' }], hl: 'm0' }), 'Pedile: qué dice en simple, qué fechas y montos importan y qué tenés que hacer.', 'type'),
        F(ai({ msgs: [{ me: true, doc: 'Carta prepaga.pdf', t: 'Explicame en simple…' }, { t: '**En resumen**\nTu cuota aumenta desde el 1 de diciembre.\n**Qué podés hacer**\nSi no estás de acuerdo, tenés un plazo para…' }], hl: 'm1' }), 'Antes de actuar, compará las fechas y los montos con el papel original.')
      ],
      sim: 'ia-doc', simIntro: 'Practicá con una carta ficticia.',
      pasos: same(['Sacá una foto del documento, o tené a mano el PDF.', 'Tapá los datos personales antes de compartirlo.', 'En tu IA, tocá el “+” y adjuntá la foto o el archivo.', 'Escribí: “Explicame en simple qué dice, qué fechas y montos importan, y qué tengo que hacer”.', 'Compará las fechas y montos con el original antes de actuar.']),
      siNo: ['Si la foto sale borrosa, sacala con buena luz y el papel apoyado en una mesa.', 'Si es algo legal o médico importante, usá el resumen para preparar preguntas y consultalo con un profesional.'],
      quiz: [
        { q: 'Antes de mandarle la foto de una carta del banco…', o: ['Tapo número de cuenta y DNI', 'La mando entera', 'Le agrego mi clave'], c: 0, e: 'La IA no necesita tus datos personales para explicarte el texto.' },
        { q: 'La IA dice que el vencimiento es el 15. ¿Qué hacés?', o: ['Le creo sin mirar', 'Lo confirmo en el documento original', 'Pago ya'], c: 1, e: 'Siempre se verifica contra el original.' }
      ],
      ficha: ['Tapar datos personales', 'Pedido: “qué dice, fechas, montos y qué hago”', 'Verificar contra el original']
    },
    {
      id: 'ia-escribir', t: 'Escribí mejor: mensajes, cartas y saludos', min: 6, nivel: 'basico',
      para: 'Vas a pedirle que te ayude a escribir un saludo, un reclamo formal o a corregir un texto tuyo.',
      idea: ['Contale para quién es, qué querés decir y en qué tono: cálido, formal, breve.', 'Podés pegarle un texto tuyo y pedirle que lo corrija sin cambiar tu estilo.', 'Revisá siempre el resultado y cambiá lo que no suene a vos.'],
      demo: [
        F(ai({ typing: 'Escribime un saludo de cumpleaños para mi nieta Sofía que cumple 15. Cálido y corto.', hl: 'send' }), 'Contale para quién es, el motivo y el tono que querés.', 'type'),
        F(ai({ msgs: [{ me: true, t: 'Saludo para mi nieta Sofía que cumple 15…' }, { t: '¡Feliz cumple, Sofi! 15 años de alegrías y de abrazos. Que este año te traiga todo lo que soñás. Te quiero mucho, tu abuela.' }], hl: 'copy1' }), 'Si te gusta, tocá copiar y pegalo en WhatsApp.'),
        F(ai({ typing: 'Necesito un reclamo formal a mi compañía de internet: hace 5 días no tengo servicio. Breve y respetuoso.', hl: 'send' }), 'Para un reclamo, pedile un texto formal con los datos del problema.', 'type'),
        F(ai({ msgs: [{ me: true, t: 'Corregí este texto sin cambiar mi estilo: “queria contarles q el sabado no boy a poder ir”' }, { t: 'Quería contarles que el sábado no voy a poder ir.' }], hl: 'm1' }), 'También corrige ortografía: pegale tu texto y pedile que no cambie tu estilo.')
      ],
      pasos: same(['Abrí tu IA y contale qué querés escribir, para quién y en qué tono.', 'Leé la propuesta y pedí ajustes: “más corto”, “más cálido”, “más formal”.', 'Para corregir: pegá tu texto y escribí “corregí la ortografía sin cambiar mi estilo”.', 'Tocá el ícono de copiar y pegalo donde lo necesites (WhatsApp, correo).']),
      siNo: ['Si suena muy “armado”, pedile: “que suene más natural, como hablo yo”.', 'En reclamos, agregá vos los datos reales: número de cliente, fechas. No le pases claves.'],
      quiz: [
        { q: '¿Qué le contás para que el saludo salga bien?', o: ['Para quién es, el motivo y el tono', 'Solo “saludo”', 'Mi DNI'], c: 0, e: 'Con esos datos la IA arma algo a tu medida.' },
        { q: 'Querés que corrija tu texto pero que siga sonando a vos. ¿Qué pedís?', o: ['“Corregí sin cambiar mi estilo”', '“Reescribilo todo”'], c: 0, e: 'Así solo arregla errores.' }
      ],
      ficha: ['Para quién + motivo + tono', 'Ajustes: más corto, más cálido, más formal', 'Corregir sin cambiar el estilo', 'Copiar y pegar']
    },
    {
      id: 'ia-aprender', t: 'Aprendé algo nuevo con tu IA', min: 6, nivel: 'intermedio',
      para: 'Vas a usar la IA como profesora particular: idiomas, historia, tecnología o lo que te dé curiosidad.',
      idea: ['Pedile que te enseñe de a poco y que te tome preguntas al final.', 'Para idiomas, podés practicar una conversación por voz y pedirle que te corrija.', 'Si un tema es importante (salud, plata, leyes), pedile las fuentes y verificalas.'],
      demo: [
        F(ai({ typing: 'Quiero aprender italiano básico para un viaje. Enseñame 5 frases por día y tomame examen al final.', hl: 'send' }), 'Contale qué querés aprender y cómo: de a poco, con ejemplos y con un examen.', 'type'),
        F(ai({ msgs: [{ me: true, t: 'Quiero aprender italiano básico…' }, { t: '**Día 1**\n1. Buongiorno = Buen día\n2. Grazie = Gracias\n3. Quanto costa? = ¿Cuánto cuesta?\n…\n¿Querés practicarlas?' }], hl: 'read1' }), 'Con el parlante te lee la respuesta para escuchar la pronunciación.'),
        F(ai({ v: 'voice', said: '¿Me corregís si digo mal? Buongiorno, quanto costa il caffè?', hl: 'vmic' }), 'En modo voz podés practicar hablando y pedir que te corrija.'),
        F(ai({ msgs: [{ me: true, t: 'Haceme 3 preguntas para ver si entendí' }, { t: '1. ¿Cómo se dice “gracias”?\n2. ¿Qué significa “quanto costa”?\n3. ¿Cómo saludás a la mañana?' }], hl: 'm1' }), 'Al final, pedile que te tome preguntas para repasar.')
      ],
      pasos: same(['Contale qué querés aprender y tu nivel: “desde cero”, “ya sé un poco”.', 'Pedile un plan corto: “5 frases por día”, “una clase de 10 minutos”.', 'Usá el parlante para escuchar o el modo voz para practicar.', 'Al final, pedile: “haceme 3 preguntas para ver si entendí”.']),
      siNo: ['Si avanza muy rápido, pedile “más despacio y con ejemplos”.', 'Si te da un dato que te sorprende, pedile de dónde sale y buscalo en una fuente confiable.'],
      quiz: [
        { q: '¿Cómo repasás lo aprendido?', o: ['Pidiéndole que me tome preguntas', 'No se puede', 'Cerrando la app'], c: 0, e: 'Las preguntas ayudan a fijar lo aprendido.' },
        { q: '¿Para qué sirve el parlante en la respuesta?', o: ['Para escucharla en voz alta', 'Para borrarla', 'Para enviarla'], c: 0, e: 'Útil para la pronunciación de un idioma.' }
      ],
      ficha: ['Pedir un plan corto', 'Parlante = escuchar', 'Modo voz = practicar', '“Tomame examen”']
    },
    {
      id: 'ia-imagenes', t: 'Creá imágenes con IA', min: 6, nivel: 'intermedio',
      para: 'Vas a pedirle una imagen para una tarjeta o una invitación describiendo lo que imaginás.',
      idea: ['Algunas IA, como ChatGPT y Gemini, crean imágenes a partir de una descripción. En la versión gratuita suele haber un límite por día.', 'Describí: qué se ve, el estilo (acuarela, dibujo, foto), los colores y para qué es.', 'No pidas imágenes de personas reales ni que imiten marcas o personajes conocidos.'],
      demo: [
        F(ai({ hl: 'sg0' }), 'Tocá «Crear una imagen» o escribí directamente lo que querés.'),
        F(ai({ typing: 'Creá una ilustración en acuarela de una torta con velas y flores, colores pastel, para una tarjeta de cumpleaños', hl: 'send' }), 'Describí qué se ve, el estilo, los colores y para qué es.', 'type'),
        F(ai({ msgs: [{ me: true, t: 'Ilustración en acuarela de una torta con velas y flores…' }, { img: 4, t: 'Acá tenés tu ilustración. ¿Querés cambiar algo?' }], hl: 'm1' }), 'En unos segundos aparece la imagen.'),
        F(ai({ msgs: [{ me: true, t: 'Ilustración en acuarela…' }, { img: 4, t: 'Acá tenés tu ilustración.' }], typing: 'Agregale un globo celeste', hl: 'send' }), 'Pedile cambios: «agregale un globo», «más colores», «sin texto».', 'type'),
        F(ai({ msgs: [{ img: 4, t: 'Acá tenés tu ilustración.' }], hl: 'm0' }), 'Para guardarla, mantené apretada la imagen y elegí «Guardar» o tocá el botón de descarga.', 'hold')
      ],
      pasos: same(['Abrí ChatGPT o Gemini (las dos crean imágenes en la versión gratuita, con límites).', 'Escribí “Creá una imagen de…” y describí qué se ve, el estilo y los colores.', 'Pedí cambios hasta que te guste.', 'Mantené apretada la imagen → Guardar (o tocá el ícono de descarga).', 'Usala en una tarjeta de Canva o mandala por WhatsApp.']),
      siNo: ['Si dice que llegaste al límite, probá al día siguiente.', 'Si la imagen sale rara (manos, letras), pedile que la haga sin texto o más simple.'],
      quiz: [
        { q: '¿Qué conviene describir para una buena imagen?', o: ['Qué se ve, el estilo y los colores', 'Solo “linda”', 'Mi nombre completo'], c: 0, e: 'Cuanto más clara la descripción, mejor el resultado.' },
        { q: '¿Qué no conviene pedir?', o: ['Imágenes de personas reales o personajes con marca', 'Un paisaje en acuarela', 'Flores de colores'], c: 0, e: 'Crear imágenes de personas reales o personajes con derechos no está bien.' }
      ],
      ficha: ['“Creá una imagen de…”', 'Qué se ve + estilo + colores', 'Pedir cambios', 'Mantener apretado → Guardar']
    },
    {
      id: 'ia-criterio', t: 'Usala con criterio', min: 5, nivel: 'basico',
      para: 'Vas a sacarle el máximo provecho sabiendo qué verificar y qué datos no hace falta compartir.',
      idea: ['La IA puede equivocarse con mucha seguridad. Para salud, plata y temas legales, usala para entender y preparar preguntas.', 'Pedile las fuentes de un dato importante y revisalo en la fuente oficial.', 'No hace falta darle tu DNI, claves, números de tarjeta ni códigos para que te ayude.'],
      demo: [
        F(ai({ msgs: [{ me: true, t: '¿Qué remedio tomo para la presión?' }, { t: 'No puedo indicarte un medicamento: depende de tu historia clínica. Puedo ayudarte a preparar preguntas para tu médico…' }], hl: 'm1' }), 'Para salud, la IA te ayuda a entender y a preparar preguntas para tu médico.'),
        F(ai({ msgs: [{ me: true, t: '¿De dónde sale ese dato?' }, { t: 'Lo podés confirmar en el sitio oficial del organismo…' }], hl: 'm0' }), 'Si un dato es importante, preguntale de dónde sale y confirmalo en la fuente oficial.'),
        F(ai({ typing: 'Ayudame con esta carta (sin mis datos personales)', hl: 'in' }), 'Contale tu situación sin datos sensibles: no hacen falta para que te ayude.', 'type'),
        F(ai({ hl: 'newchat' }), 'Para empezar un tema nuevo, tocá el lápiz: así la conversación queda ordenada.')
      ],
      pasos: same(['Antes de usar un dato importante, pedile: “¿de dónde sale esto?” y verificalo.', 'Para salud, plata o leyes, usá la respuesta para preparar preguntas para un profesional.', 'Compartí solo lo necesario: nada de claves, DNI ni datos bancarios.', 'Empezá un chat nuevo para cada tema.']),
      siNo: ['Si ya compartiste algo sensible por error, cambiá esa clave y, si fueron datos bancarios, avisá a tu banco.'],
      quiz: [
        { q: '¿Cuál de estos datos no hace falta compartirle?', o: ['Una receta de cocina', 'El número de tu tarjeta', 'Un texto para corregir'], c: 1, e: 'Datos bancarios, claves y DNI no son necesarios.' },
        { q: 'La IA te sugiere un remedio. ¿Qué hacés?', o: ['Lo tomo', 'Lo consulto con mi médico', 'Lo compro el doble'], c: 1, e: 'La decisión es con tu médico.' }
      ],
      ficha: ['Verificar lo importante', 'Salud y plata: con profesionales', 'Sin claves, DNI ni tarjetas', 'Un chat por tema']
    }
  ]
};
