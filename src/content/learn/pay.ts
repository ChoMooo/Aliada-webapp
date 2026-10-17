import { type Module, same, F, S, home } from './shared';

const w = (o: any = {}) => S('wallet', o);

export const PAY: Module = {
  id: 'pay', n: 'Plata en el celular', apps: 'Billeteras virtuales, bancos y Mercado Libre', tone: 'sky', section: 'finanzas',
  desc: 'Pagar, transferir, cobrar, pagar servicios y comprar online con tranquilidad y sin errores.',
  temas: ['Conocé tu billetera', 'Pagar con QR', 'Transferir', 'Cobrar y compartir tu alias', 'Servicios, celular y SUBE', 'Comprar en Mercado Libre', 'Seguir tu compra y devolver', 'Usarla con tranquilidad'],
  lessons: [
    {
      id: 'pay-billetera', t: 'Conocé tu billetera virtual', min: 5, nivel: 'basico',
      para: 'Vas a entender la pantalla principal de tu billetera: saldo, movimientos, tu CVU y los rendimientos.',
      idea: ['Una billetera virtual (como Mercado Pago, Ualá, Naranja X, MODO o la app de tu banco) guarda dinero y permite pagar, transferir y cobrar desde el celular.', 'Arriba ves tu dinero disponible; el ojo lo oculta si estás en un lugar público.', 'En «Actividad» está todo lo que entró y salió, con fecha y comprobante.'],
      demo: [
        F(home('Billetera'), 'Abrí tu billetera virtual o la app de tu banco.'),
        F(w({ hl: 'yield' }), 'Arriba está tu dinero disponible. En muchas billeteras, además, rinde un poco cada día.'),
        F(w({ hl: 'cvu' }), 'En «Tu CVU» están tus datos para que te transfieran.'),
        F(w({ hl: 'nav3' }), 'En «Actividad» ves todos tus movimientos.'),
        F(w({ v: 'activity', hl: 'a0' }), 'Tocá un movimiento para ver el detalle y el comprobante.')
      ],
      pasos: same(['Abrí la app y mirá tu dinero disponible arriba. Tocá el ojo para ocultarlo.', 'Entrá a “Actividad” para ver lo que entró y salió.', 'Tocá un movimiento para ver el detalle o compartir el comprobante.', 'Buscá “Tu CVU” o “Datos de la cuenta” para ver tu alias.', 'Activá el ingreso con huella o rostro en la configuración de seguridad de la app.']),
      siNo: ['Si no reconocés un movimiento, entrá a él y usá la opción de ayuda de la app oficial.', 'Las billeteras cambian el diseño seguido: si no encontrás algo, usá la búsqueda de la app.'],
      quiz: [
        { q: '¿Dónde ves todo lo que entró y salió?', o: ['En Actividad', 'En el perfil', 'En Ayuda'], c: 0, e: 'Ahí están todos los movimientos con comprobante.' },
        { q: '¿Para qué sirve el ojo junto al saldo?', o: ['Para ocultarlo', 'Para pagar', 'Para transferir'], c: 0, e: 'Útil si estás en un lugar público.' }
      ],
      ficha: ['Saldo arriba (ojo = ocultar)', 'Actividad = movimientos', 'Tu CVU = datos para cobrar', 'Huella o rostro para entrar']
    },
    {
      id: 'pay-qr', t: 'Pagar con QR', min: 5, nivel: 'basico',
      para: 'Vas a pagar en un comercio escaneando el código QR, revisando siempre a quién y cuánto.',
      idea: ['El QR es un cuadradito que el comercio tiene en el mostrador. Lo escaneás con tu billetera y pagás.', 'Antes de confirmar, la app te muestra el nombre del comercio y el monto: es el momento de revisar.', 'Con el comprobante en la app, el comercio puede ver que pagaste.'],
      demo: [
        F(w({ hl: 'qr' }), 'Tocá el botón del QR (en muchas billeteras está abajo, al medio).'),
        F(w({ v: 'scan', hl: 'code' }), 'Apuntá la cámara al código del comercio, a unos 20 centímetros.'),
        F(w({ v: 'pay', hl: 'shop' }), 'Revisá el nombre del comercio.'),
        F(w({ v: 'pay', amount: '$ 6.250', hl: 'amount' }), 'Si el monto no viene cargado, escribilo vos. Revisalo.'),
        F(w({ v: 'pay', hl: 'ok' }), 'Tocá «Pagar».'),
        F(w({ v: 'done', hl: 'receipt' }), 'Listo. Si te lo piden, mostrá el comprobante.')
      ],
      sim: 'pay-qr', simIntro: 'Probalo: escaneá el QR y revisá antes de pagar.',
      pasos: same(['Abrí tu billetera o la app de tu banco.', 'Tocá “Pagar con QR” (o el botón del QR).', 'Apuntá la cámara al código del comercio.', 'Revisá el nombre del comercio y el monto.', 'Confirmá y mostrá el comprobante si te lo piden.']),
      siNo: ['Si la cámara no lee el código, limpiá la lente y alejá un poco el celular.', 'Si el monto no coincide, no confirmes: pedí que lo corrijan.'],
      quiz: [
        { q: 'Antes de confirmar un pago con QR, ¿qué revisás?', o: ['El nombre del comercio y el monto', 'El color de la pantalla', 'Nada'], c: 0, e: 'Es la última oportunidad para detectar un error.' },
        { q: 'La cámara no lee el código. ¿Qué probás?', o: ['Limpiar la lente y alejar un poco el celular', 'Reiniciar todo'], c: 0, e: 'Casi siempre es la lente o la distancia.' }
      ],
      ficha: ['Botón QR → apuntar', 'Revisar comercio y monto', 'Pagar → comprobante']
    },
    {
      id: 'pay-transfer', t: 'Transferir sin equivocarte', min: 6, nivel: 'basico',
      para: 'Vas a mandar plata con alias o CVU y revisar a nombre de quién va antes de confirmar.',
      idea: ['El alias es un nombre fácil (por ejemplo, “sol.mar.casa”) que reemplaza al número de cuenta.', 'Antes de confirmar, la app muestra el nombre del titular. Si no coincide con la persona, no sigas.', 'En general, una transferencia hecha no se puede deshacer: por eso se revisa antes.'],
      demo: [
        F(w({ hl: 'transfer' }), 'Tocá «Transferir».'),
        F(w({ v: 'to', alias: 'lucia.fer.rio', hl: 'alias' }), 'Pegá el alias tal cual te lo mandaron, o elegí un contacto frecuente.', 'type'),
        F(w({ v: 'who', hl: 'name' }), 'Revisá el nombre del titular. Si no es la persona, tocá «No es esta persona».'),
        F(w({ v: 'amount', hl: 'amount' }), 'Escribí el monto y revisalo: contá los ceros.', 'type'),
        F(w({ v: 'review', hl: 'ok' }), 'Revisá el resumen y tocá «Transferir».'),
        F(w({ v: 'done', title: '¡Listo! Transferiste $ 15.000', sub: 'a Lucía Fernández', hl: 'share' }), 'Guardá o compartí el comprobante.')
      ],
      sim: 'pay-transfer', simIntro: 'Practicá: transferí $ 15.000 a tu sobrina Lucía Fernández.',
      pasos: same(['En tu billetera o banco, tocá “Transferir”.', 'Escribí o pegá el alias o el CVU/CBU (sin cambiar letras).', 'Revisá el nombre del titular que aparece.', 'Escribí el monto y revisalo dos veces.', 'Confirmá y guardá el comprobante.']),
      siNo: ['Si el nombre que aparece no es el esperado, cancelá y confirmá el alias con la persona por otro medio.', 'Si te equivocaste, contactá enseguida a la ayuda oficial de tu banco o billetera desde la app.'],
      quiz: [
        { q: 'Escribís el alias y aparece otro nombre. ¿Qué hacés?', o: ['Transfiero igual', 'Cancelo y confirmo el alias con la persona', 'Cambio una letra a ver'], c: 1, e: 'El nombre del titular es tu control.' },
        { q: '¿Se puede deshacer una transferencia ya hecha?', o: ['Sí, siempre', 'En general no: por eso se revisa antes'], c: 1, e: 'Revisar titular y monto es la clave.' }
      ],
      ficha: ['Alias = nombre fácil de la cuenta', 'Revisar el titular', 'Revisar el monto dos veces', 'Guardar el comprobante']
    },
    {
      id: 'pay-cobrar', t: 'Cobrar y compartir tu alias', min: 5, nivel: 'basico',
      para: 'Vas a encontrar tu alias, cambiarlo por uno fácil y comprobar que el pago llegó.',
      idea: ['Tu alias y tu CVU están en los datos de tu cuenta dentro de la app.', 'Podés cambiar el alias por uno fácil de dictar.', 'Un pago está confirmado cuando aparece en tu actividad.'],
      demo: [
        F(w({ hl: 'cvu' }), 'Tocá «Tu CVU» (o «Datos de la cuenta»).'),
        F(w({ v: 'cvu', hl: 'editAlias' }), 'Con el lápiz cambiás el alias por uno fácil de dictar.'),
        F(w({ v: 'cvu', hl: 'share' }), 'Tocá «Compartir datos» y mandalos por WhatsApp.'),
        F(w({ v: 'activity', hl: 'a0' }), 'Cuando te pagan, el ingreso aparece en tu actividad.')
      ],
      pasos: same(['Abrí tu billetera y buscá “Tu CVU” o “Datos de la cuenta”.', 'Si querés, tocá el lápiz para cambiar el alias.', 'Tocá “Compartir” y mandalo por WhatsApp.', 'Cuando te paguen, confirmalo en tu actividad.']),
      siNo: ['Si alguien dice que ya te pagó y no lo ves, esperá a que aparezca en tu actividad antes de entregar algo.', 'Para cobrar en persona, muchas billeteras tienen un QR propio en “Cobrar”.'],
      quiz: [
        { q: '¿Cuándo está confirmado un pago que te hicieron?', o: ['Cuando aparece en mi actividad', 'Cuando me mandan una foto'], c: 0, e: 'Tu actividad es la fuente de verdad.' },
        { q: '¿Dónde encontrás tu alias?', o: ['En los datos de la cuenta', 'En el DNI'], c: 0, e: 'Está en “Tu CVU” o “Datos de la cuenta”.' }
      ],
      ficha: ['Tu CVU = alias y CVU', 'Lápiz = cambiar alias', 'Compartir por WhatsApp', 'Confirmar en Actividad']
    },
    {
      id: 'pay-servicios', t: 'Pagá servicios, cargá el celular y la SUBE', min: 6, nivel: 'basico',
      para: 'Vas a pagar la luz o el gas sin hacer filas, recargar crédito del celular y cargar la SUBE.',
      idea: ['En «Pagar servicios» buscás la empresa y la app te muestra lo que vence.', 'Muchas facturas se pueden pagar escaneando el código de barras.', 'Para la SUBE, después de cargar online hay que acreditar la carga apoyándola en una terminal o con el celular, según el caso.'],
      demo: [
        F(w({ hl: 'services' }), 'Tocá «Pagar servicios».'),
        F(w({ v: 'services', q: 'Edesur', hl: 'q' }), 'Buscá la empresa por nombre.', 'type'),
        F(w({ v: 'services', hl: 'sv0' }), 'Elegí la factura que vence.'),
        F(w({ v: 'services', hl: 'scanBill' }), 'También podés escanear el código de barras de la factura en papel.'),
        F(w({ v: 'done', title: '¡Listo! Pagaste $ 18.420', sub: 'a Edesur · Luz', hl: 'receipt' }), 'Guardá el comprobante.'),
        F(w({ hl: 'sube' }), 'Para la SUBE, tocá «Cargar SUBE», escribí el número de la tarjeta y el monto.')
      ],
      pasos: same(['En tu billetera o banco, tocá “Pagar servicios”.', 'Buscá la empresa o escaneá el código de barras de la factura.', 'Revisá el monto y el vencimiento y confirmá.', 'Para recargar el celular: “Recargar celular” → elegí la compañía, el número y el monto.', 'Para la SUBE: “Cargar SUBE” → número de la tarjeta y monto. Después acreditá la carga en una terminal o con el celular, según indique la app.']),
      siNo: ['Si la empresa no aparece, buscá por otro nombre o pagá desde la app de tu banco.', 'Algunas billeteras permiten programar el débito automático: así no te olvidás.'],
      quiz: [
        { q: 'No encontrás la empresa por nombre. ¿Qué podés hacer?', o: ['Escanear el código de barras de la factura', 'Pagar dos veces'], c: 0, e: 'Muchas facturas se pagan escaneando el código.' },
        { q: 'Cargaste la SUBE online. ¿Qué falta?', o: ['Acreditar la carga', 'Nada'], c: 0, e: 'La carga se acredita en una terminal o con el celular, según el caso.' }
      ],
      ficha: ['Pagar servicios → buscar empresa', 'Escanear código de barras', 'Recargar celular', 'Cargar SUBE → acreditar']
    },
    {
      id: 'pay-ml', t: 'Comprar en Mercado Libre', min: 7, nivel: 'basico',
      para: 'Vas a buscar un producto, elegir un buen vendedor y comprar con la protección de la plataforma.',
      idea: ['Mirá la reputación del vendedor y las opiniones de otros compradores.', 'Pagá siempre dentro de la plataforma: así tenés la Compra Protegida.', 'Usá los filtros: envío gratis, llega mañana, mejores vendedores.'],
      demo: [
        F(home('Mercado Libre'), 'Abrí Mercado Libre.'),
        F(S('ml', { hl: 'search' }), 'Buscá el producto.', 'type'),
        F(S('ml', { v: 'results', q: 'pava eléctrica', hl: 'f0' }), 'Usá los filtros. Compará precios: si uno está mucho más barato que el resto, revisalo bien.'),
        F(S('ml', { v: 'product', hl: 'seller' }), 'En la publicación, mirá la reputación del vendedor y la cantidad de ventas.'),
        F(S('ml', { v: 'reviews', hl: 'q' }), 'Leé las opiniones y las preguntas de otros compradores.'),
        F(S('ml', { v: 'product', hl: 'buy' }), 'Tocá «Comprar ahora».'),
        F(S('ml', { v: 'checkout', hl: 'ok' }), 'Revisá el envío y el pago, y tocá «Confirmar compra».')
      ],
      sim: 'ml-seller', simIntro: 'Elegí a qué vendedor le comprarías.',
      pasos: same(['Buscá el producto y usá los filtros (envío gratis, llega mañana).', 'Entrá a la publicación y mirá la reputación del vendedor y las opiniones.', 'Leé las preguntas de otros compradores o hacé la tuya.', 'Tocá “Comprar ahora”, elegí envío y pago, y confirmá.', 'Pagá siempre dentro de la app.']),
      siNo: ['Si el vendedor te propone pagar por fuera o seguir por WhatsApp, no sigas: perdés la protección.', 'Si dudás de un producto, preguntale al vendedor desde la publicación antes de comprar.'],
      quiz: [
        { q: 'El vendedor te ofrece descuento si le pagás por transferencia. ¿Qué hacés?', o: ['Acepto', 'No: pago solo dentro de la plataforma'], c: 1, e: 'Fuera de la plataforma no tenés protección.' },
        { q: '¿Qué mirás del vendedor?', o: ['Reputación y opiniones', 'Solo la foto'], c: 0, e: 'Muestran cómo cumplió con otros compradores.' }
      ],
      ficha: ['Filtros: envío gratis, llega mañana', 'Reputación y opiniones', 'Comprar ahora → Confirmar', 'Pagar dentro de la app']
    },
    {
      id: 'pay-ml-envio', t: 'Seguí tu compra, devolvé y opiná', min: 5, nivel: 'intermedio',
      para: 'Vas a saber cuándo llega tu compra, qué hacer si no es lo que esperabas y cómo dejar tu opinión.',
      idea: ['En «Mis compras» ves el estado del envío y la fecha estimada.', 'Si el producto no llega o es distinto, desde esa compra pedís ayuda o la devolución.', 'Después de recibirlo, tu opinión ayuda a otros compradores.'],
      demo: [
        F(S('ml', { v: 'orders', hl: 'track' }), 'En «Mis compras», tocá «Ver envío» para seguir el paquete.'),
        F(S('ml', { v: 'orders', hl: 'help' }), 'Si hay un problema, tocá «Necesito ayuda» en esa compra.'),
        F(S('ml', { v: 'checkout', hl: 'c2' }), 'La Compra Protegida cubre si no llega o es distinto a lo publicado.')
      ],
      pasos: same(['Abrí el menú → Mis compras.', 'Tocá la compra para ver el envío.', 'Si no llegó o es distinto: “Necesito ayuda” → elegí el problema → seguí los pasos de devolución.', 'Cuando lo recibas, dejá tu opinión del producto y del vendedor.']),
      siNo: ['Respetá los plazos para reclamar que indica la app.', 'Guardá el embalaje hasta revisar que todo funcione.'],
      quiz: [
        { q: '¿Desde dónde reclamás por una compra?', o: ['Desde la compra en “Mis compras”', 'Por mensaje a un número desconocido'], c: 0, e: 'Así queda registrado y se activa la protección.' },
        { q: '¿Qué conviene guardar hasta probar el producto?', o: ['El embalaje', 'Nada'], c: 0, e: 'Facilita una devolución si hace falta.' }
      ],
      ficha: ['Mis compras → Ver envío', 'Necesito ayuda → devolución', 'Compra Protegida', 'Dejar tu opinión']
    },
    {
      id: 'pay-cuidados', t: 'Usá tu billetera con tranquilidad', min: 5, nivel: 'basico',
      para: 'Vas a configurar tu billetera para que sea segura y saber qué revisar ante cualquier mensaje con plata de por medio.',
      idea: ['Activá la huella o el rostro para entrar y para confirmar pagos.', 'Lo que vale es tu actividad en la app: ahí confirmás cualquier pago o transferencia.', 'Las claves y los códigos que te llegan por SMS son solo tuyos: ningún soporte real te los pide.'],
      demo: [
        F(S('settings', { v: 'list', title: 'Seguridad', items: [{ t: 'Ingresar con huella o rostro', tg: true }, { t: 'Pedir clave para pagar', tg: true }, { t: 'Dispositivos conectados', s: '1 dispositivo' }], hl: 'r0' }), 'En la seguridad de la app, activá el ingreso con huella o rostro.'),
        F(S('wa', { v: 'chat', title: '+54 9 11 5555-0192', sub: 'Número desconocido', msgs: [{ t: '¡Hola! Te transferí de más por error, ¿me lo devolvés?' }], hl: 'm0' }), 'Si alguien dice que te transfirió de más, no respondas apurado.'),
        F(w({ v: 'activity', hl: 'a0' }), 'Abrí tu app y mirá tu actividad: lo que no figura ahí, no pasó.'),
        F(w({ hl: 'nav4' }), 'Ante la duda, usá la ayuda oficial desde dentro de la app.')
      ],
      pasos: same(['Activá el ingreso con huella o rostro en la configuración de seguridad.', 'Ante cualquier mensaje sobre plata, abrí la app oficial vos (no desde un link) y revisá tu actividad.', 'No compartas claves ni códigos que te lleguen por SMS.', 'Si dudás, consultá con alguien de confianza o con la ayuda oficial de la app.', 'Practicá situaciones reales en el Escudo antiestafas, dentro de Mundo digital.']),
      siNo: ['Si compartiste una clave por error, cambiala enseguida y avisá a la ayuda oficial de tu billetera o banco.'],
      quiz: [
        { q: 'Te escriben que te transfirieron de más. ¿Qué hacés primero?', o: ['Devuelvo enseguida', 'Reviso mi actividad en la app'], c: 1, e: 'Lo que no figura en tu actividad, no pasó.' },
        { q: '¿Quién puede pedirte el código que te llegó por SMS?', o: ['El soporte de la app', 'Nadie: es solo tuyo'], c: 1, e: 'Ningún soporte real lo pide.' }
      ],
      ficha: ['Huella o rostro activados', 'Actividad = fuente de verdad', 'Claves y códigos: solo tuyos', 'Ayuda oficial desde la app']
    }
  ]
};
