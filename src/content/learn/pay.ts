import { type Module, type Screen, same, F, home, app, T } from './shared';

const bill = (title: string, blocks: any[], hl?: string): Screen => app(title, blocks, hl, { tone: T.bill });
const inicio = (hl?: number) => bill('Billetera', [{ b: 'big', t: '$ 84.500', s: 'Dinero disponible' }, { b: 'tiles', items: [{ t: 'Pagar con QR', i: 'qr' }, { t: 'Transferir', i: 'enviar' }, { t: 'Ingresar dinero', i: 'plata' }, { t: 'Tu CVU y alias', i: 'copiar' }], hl }, { b: 'card', t: 'Actividad', s: 'Tus movimientos', i: 'recibo', id: 'act' }]);
const ml = (title: string, blocks: any[], hl?: string): Screen => app(title, blocks, hl, { tone: T.ml });

export const PAY: Module = {
  id: 'pay', n: 'Plata en el celular', apps: 'Billeteras virtuales, bancos y Mercado Libre', tone: 'sky', section: 'finanzas',
  desc: 'Pagar, transferir, cobrar y comprar online con tranquilidad y sin errores.',
  temas: ['Pagar con QR', 'Transferir sin equivocarte', 'Cobrar y compartir tu alias', 'Comprar seguro', 'Estafas con pagos'],
  lessons: [
    {
      id: 'pay-qr', t: 'Pagar con QR', min: 5, nivel: 'basico',
      para: 'Vas a pagar en un comercio escaneando el código QR, revisando siempre a quién y cuánto.',
      idea: ['El QR es un cuadradito que el comercio tiene en el mostrador. Lo escaneás con tu billetera virtual y pagás.', 'Antes de confirmar, la app te muestra el nombre del comercio y el monto: es el momento de revisar.'],
      demo: [
        F(home('Billetera'), 'Abrí tu billetera virtual o la app de tu banco.'),
        F(inicio(0), 'Tocá «Pagar con QR». Suele estar en la pantalla principal.'),
        F(bill('Escanear QR', [{ b: 'img', t: 'Apuntá al código del mostrador', tone: 5, id: 'qr' }, { b: 'text', t: 'Mantené el celular quieto a unos 20 cm', muted: true }], 'qr'), 'Apuntá la cámara al código del comercio, a unos 20 centímetros.'),
        F(bill('Confirmar pago', [{ b: 'card', t: 'Almacén Don Pepe', s: 'Comercio', i: 'tienda', id: 'com' }, { b: 'big', t: '$ 6.250' }, { b: 'btn', t: 'Pagar', id: 'pay' }], 'com'), 'Antes de pagar, revisá el nombre del comercio y el monto.'),
        F(bill('Listo', [{ b: 'big', t: '✓  Pagaste $ 6.250', s: 'a Almacén Don Pepe' }, { b: 'btn', t: 'Ver comprobante', tone: 'ghost', id: 'comp' }], 'comp'), 'Confirmá. Si te lo piden, mostrá el comprobante.')
      ],
      sim: 'pay-qr', simIntro: 'Probalo: escaneá el QR y revisá antes de pagar.',
      pasos: same(['Abrí tu billetera virtual o la app de tu banco.', 'Tocá la opción para pagar con QR (suele estar en la pantalla principal).', 'Apuntá la cámara al código del comercio.', 'Revisá el nombre del comercio y el monto.', 'Confirmá y mostrá el comprobante si te lo piden.']),
      siNo: ['Si la cámara no lee el código, limpiá la lente y alejá un poco el celular.', 'Si el monto no coincide, no confirmes: pedí que lo corrijan.'],
      quiz: [
        { q: 'Antes de confirmar un pago con QR, ¿qué revisás?', o: ['El nombre del comercio y el monto', 'El color de la pantalla', 'Nada'], c: 0, e: 'Es la última oportunidad para detectar un error.' },
        { q: 'La cámara no lee el código. ¿Qué probás?', o: ['Limpiar la lente y alejar un poco el celular', 'Pagar con otro QR que encontré', 'Reiniciar todo'], c: 0, e: 'Casi siempre es la lente sucia o el celular demasiado cerca.' }
      ],
      ficha: ['Billetera → Pagar con QR', 'Revisar comercio y monto', 'Confirmar y guardar comprobante']
    },
    {
      id: 'pay-transfer', t: 'Transferir sin equivocarte', min: 6, nivel: 'basico',
      para: 'Vas a mandar plata con alias o CVU y revisar a nombre de quién va antes de confirmar.',
      idea: ['El alias es un nombre fácil (por ejemplo, “sol.mar.casa”) que reemplaza al número de cuenta.', 'Antes de confirmar, la app muestra el nombre del titular. Si no coincide con la persona, no sigas.', 'En general, una transferencia hecha no se puede deshacer.'],
      demo: [
        F(inicio(1), 'En tu billetera o tu banco, tocá «Transferir».'),
        F(bill('Transferir', [{ b: 'text', t: 'Alias, CVU o CBU', muted: true }, { b: 'input', t: 'lucia.fer.rio', id: 'al' }, { b: 'btn', t: 'Continuar' }], 'al'), 'Pegá el alias tal cual te lo mandaron, sin cambiar letras.', 'type'),
        F(bill('¿Es correcto?', [{ b: 'card', t: 'Lucía Fernández', s: 'Titular de la cuenta', i: 'persona', id: 'tit' }, { b: 'btn', t: 'Sí, continuar' }, { b: 'btn', t: 'No es esta persona', tone: 'ghost' }], 'tit'), 'Revisá el nombre del titular. Si no es la persona, cancelá.'),
        F(bill('Monto', [{ b: 'big', t: '$ 15.000', s: 'a Lucía Fernández' }, { b: 'input', t: 'Motivo: cumpleaños (opcional)', ph: true }, { b: 'btn', t: 'Revisar', id: 'rev' }], 'rev'), 'Escribí el monto y revisalo dos veces: contá los ceros.'),
        F(bill('Confirmar', [{ b: 'card', t: '$ 15.000 a Lucía Fernández', s: 'Alias lucia.fer.rio', i: 'enviar' }, { b: 'btn', t: 'Transferir', id: 'ok' }], 'ok'), 'Confirmá y guardá el comprobante.')
      ],
      sim: 'pay-transfer', simIntro: 'Practicá: transferí $ 15.000 a tu sobrina Lucía Fernández.',
      pasos: same(['En tu billetera o tu banco, tocá “Transferir”.', 'Escribí el alias o el CVU/CBU (copiado del mensaje, sin cambiar letras).', 'Revisá el nombre del titular que aparece.', 'Escribí el monto y revisalo dos veces.', 'Confirmá y guardá el comprobante.']),
      siNo: ['Si el nombre que aparece no es el esperado, cancelá y confirmá el alias con la persona por otro medio.', 'Si te equivocaste, contactá enseguida a la ayuda oficial de tu banco o billetera desde la app.'],
      quiz: [
        { q: 'Escribís el alias y aparece otro nombre. ¿Qué hacés?', o: ['Transfiero igual', 'Cancelo y confirmo el alias con la persona', 'Cambio una letra a ver'], c: 1, e: 'El nombre del titular es tu control de seguridad.' },
        { q: '¿Se puede deshacer una transferencia ya hecha?', o: ['Sí, siempre', 'En general no: por eso se revisa antes', 'Solo los domingos'], c: 1, e: 'Revisar titular y monto antes de confirmar es la clave.' }
      ],
      ficha: ['Alias = nombre fácil de la cuenta', 'Revisar el nombre del titular', 'Revisar el monto dos veces', 'Guardar el comprobante']
    },
    {
      id: 'pay-cobrar', t: 'Cobrar y compartir tu alias', min: 5, nivel: 'intermedio',
      para: 'Vas a encontrar tu alias, cambiarlo por uno fácil y comprobar si de verdad te pagaron.',
      idea: ['Tu alias y tu CVU están en los datos de tu cuenta dentro de la app.', 'Una captura de pantalla de un comprobante se puede falsificar. El pago es real solo si aparece en tu app.'],
      demo: [
        F(inicio(3), 'Buscá «Tu CVU y alias». Suele estar en la pantalla principal o en tu perfil.'),
        F(bill('Tus datos', [{ b: 'card', t: 'Alias: marta.sol.casa', s: 'Fácil de dictar', i: 'copiar' }, { b: 'card', t: 'CVU: 0000003100…', i: 'copiar' }, { b: 'btn', t: 'Compartir', id: 'sh' }, { b: 'btn', t: 'Modificar alias', tone: 'ghost' }], 'sh'), 'Tocá «Compartir» para mandarlo por WhatsApp. También podés cambiar el alias por uno fácil.'),
        F({ k: 'chat', title: 'Vecina Ana', msgs: [{ t: 'Te paso por las tortas 🙂' }, { img: true, t: '' }, { t: 'Ahí te mandé la captura' }], hl: 'm1' }, 'Si te mandan una captura del pago, todavía no está confirmado.'),
        F(inicio(undefined), 'Entrá a «Actividad» en tu app.'),
        F(bill('Actividad', [{ b: 'rows', items: [{ t: 'Recibiste $ 9.000', s: 'de Ana Gómez · hoy 10:42', i: 'plata' }, { t: 'Pagaste $ 6.250', s: 'Almacén Don Pepe · ayer', i: 'tienda' }], hl: 0 }]), 'El pago es real solo cuando aparece en tu actividad.')
      ],
      pasos: same(['Abrí tu billetera y buscá “Tu CVU” o “Alias” (suele estar en tu perfil o en los datos de la cuenta).', 'Si querés, cambiá el alias por uno fácil de dictar.', 'Tocá “Compartir” para mandarlo por WhatsApp.', 'Cuando te paguen, confirmalo en tu actividad o movimientos de la app, no en una captura.']),
      siNo: ['Si alguien insiste en que ya pagó pero no lo ves en tu app, no entregues nada hasta que aparezca.'],
      quiz: [
        { q: 'Te mandan una captura de un pago. ¿Ya cobraste?', o: ['Sí, la captura alcanza', 'Solo si aparece en mis movimientos de la app'], c: 1, e: 'Las capturas se pueden falsificar.' },
        { q: '¿Dónde encontrás tu alias?', o: ['En los datos de tu cuenta dentro de la app', 'En el DNI', 'Te lo manda el banco por SMS cada vez'], c: 0, e: 'Está en tu perfil o en “Tu CVU y alias”.' }
      ],
      ficha: ['Alias y CVU en los datos de la cuenta', 'Compartir por WhatsApp', 'Confirmar pagos en la app, no en capturas']
    },
    {
      id: 'pay-comprar', t: 'Comprar seguro en Mercado Libre', min: 7, nivel: 'basico',
      para: 'Vas a elegir un vendedor confiable y comprar con la protección de la plataforma.',
      idea: ['Mirá la reputación del vendedor y las opiniones de otros compradores.', 'Pagá siempre dentro de la plataforma: si te piden pagar por fuera o seguir por WhatsApp, perdés la protección.', 'Un precio mucho más bajo que el resto es una señal de alerta.'],
      demo: [
        F(ml('Mercado Libre', [{ b: 'search', t: 'pava eléctrica', id: 'q' }, { b: 'card', t: 'Pava eléctrica 1,7 L', s: '$ 38.900 · Envío gratis', i: 'compras' }, { b: 'card', t: 'Pava eléctrica 1,7 L', s: '$ 9.900 · ¡Oferta increíble!', i: 'compras' }], 'q'), 'Buscá el producto. Si uno está mucho más barato que el resto, desconfiá.', 'type'),
        F(ml('Publicación', [{ b: 'img', t: 'Pava eléctrica 1,7 L', tone: 3 }, { b: 'card', t: 'Vendedor: Hogar Útil', s: '★★★★★ · +5.000 ventas · MercadoLíder', i: 'estrella', id: 'vend' }, { b: 'btn', t: 'Comprar ahora' }], 'vend'), 'Mirá la reputación del vendedor: color, cantidad de ventas y opiniones.'),
        F(ml('Opiniones', [{ b: 'rows', items: [{ t: '★★★★★ Llegó rápido, funciona bien', i: 'like' }, { t: '★★★★☆ Buena, un poco ruidosa', i: 'like' }, { t: 'Preguntas: ¿Tiene garantía? — Sí, 6 meses', i: 'doc' }], hl: 2 }]), 'Leé las opiniones y las preguntas de otros compradores.'),
        F(ml('Pagar', [{ b: 'card', t: 'Pagás dentro de Mercado Libre', s: 'Así tenés la protección de compra', i: 'escudo', id: 'pp' }, { b: 'btn', t: 'Confirmar compra' }], 'pp'), 'Pagá siempre dentro de la app. Si te piden pagar por fuera, no sigas.'),
        F(ml('Mis compras', [{ b: 'card', t: 'Pava eléctrica', s: 'En camino · llega el jueves', i: 'envio' }, { b: 'btn', t: 'Necesito ayuda con la compra', tone: 'ghost', id: 'ay' }], 'ay'), 'Seguí el envío en «Mis compras». Si hay un problema, usá la ayuda de esa compra.')
      ],
      sim: 'ml-seller', simIntro: 'Elegí a qué vendedor le comprarías.',
      pasos: same(['Buscá el producto en la app.', 'Entrá a la publicación y mirá la reputación del vendedor y las opiniones.', 'Leé las preguntas de otros compradores.', 'Comprá y pagá dentro de la app.', 'Seguí el envío en “Mis compras”. Si hay un problema, usá la ayuda de esa compra.']),
      siNo: ['Si el producto no llega o es distinto, entrá a la compra en “Mis compras” y buscá la opción de ayuda o reclamo.'],
      quiz: [
        { q: 'El vendedor te dice “pagame por transferencia y te hago descuento”. ¿Qué hacés?', o: ['Acepto, es más barato', 'No: pago solo dentro de la plataforma'], c: 1, e: 'Fuera de la plataforma no tenés protección.' },
        { q: 'Una pava cuesta $ 9.900 y las demás $ 38.000. ¿Qué pensás?', o: ['¡Ganga!', 'Es una señal de alerta: reviso bien al vendedor'], c: 1, e: 'Un precio demasiado bajo es una señal típica de publicación falsa.' }
      ],
      ficha: ['Reputación y opiniones del vendedor', 'Pagar siempre dentro de la app', 'Precio demasiado bajo = alerta', '“Mis compras” para seguir y reclamar']
    },
    {
      id: 'pay-estafas', t: 'Estafas con pagos: las 5 más comunes', min: 6, nivel: 'basico',
      para: 'Vas a reconocer las trampas más usadas con billeteras virtuales y compras.',
      idea: ['1. “Te transferí de más, devolvémelo”: verificá en tu app; suele ser falso.', '2. Comprobantes falsos: confirmá siempre en tus movimientos.', '3. Falso soporte que pide códigos o claves: el soporte real no te los pide.', '4. Links de premios o reintegros: no entres, abrí la app vos.', '5. Señas por adelantado para alquileres o autos baratos: desconfiá y verificá en persona.'],
      demo: [
        F({ k: 'chat', title: '+54 9 11 5555-0192', sub: 'Número desconocido', msgs: [{ t: 'Hola! Te transferí $ 20.000 por error 😓 ¿Me los devolvés a este alias?' }], hl: 'm0' }, 'Trampa 1: «te transferí de más». Antes de devolver nada, revisá tu app.'),
        F(bill('Actividad', [{ b: 'rows', items: [{ t: 'Pagaste $ 6.250', s: 'Almacén Don Pepe · ayer', i: 'tienda' }, { t: 'Recibiste $ 9.000', s: 'Ana Gómez · lunes', i: 'plata' }] }, { b: 'card', t: 'No hay ningún ingreso de $ 20.000', i: 'check', id: 'no' }], 'no'), 'Si la plata no aparece en tus movimientos, es una estafa.'),
        F({ k: 'chat', title: 'Soporte Billetera', sub: 'Número desconocido', msgs: [{ t: 'Detectamos un problema en tu cuenta. Pasanos el código que te llegó por SMS.' }], hl: 'm0' }, 'Trampa 3: falso soporte. Nadie legítimo te pide códigos ni claves.'),
        F({ k: 'chat', title: 'Promo', sub: 'Número desconocido', msgs: [{ t: '¡Ganaste un reintegro de $ 50.000! Entrá acá: billetera-premios.xyz' }], hl: 'm0' }, 'Trampa 4: links de premios. No entres: abrí la app oficial vos.'),
        F(inicio(undefined), 'Ante la duda, frená, abrí la app oficial por tu cuenta y consultá con alguien de confianza.')
      ],
      pasos: same(['Ante cualquier mensaje con plata de por medio, frená y no respondas apurado.', 'Abrí la app oficial vos (no desde el link) y fijate si es cierto.', 'Si dudás, consultá a alguien de confianza.', 'Practicá en el Escudo antiestafas, dentro de Mundo digital.']),
      siNo: ['Si caíste en una estafa, avisá enseguida a tu banco o billetera desde la app oficial y hacé la denuncia.'],
      quiz: [
        { q: '“Te transferí de más por error, devolveme $ 20.000”. ¿Qué hacés primero?', o: ['Devuelvo enseguida', 'Reviso mis movimientos en la app'], c: 1, e: 'En la mayoría de los casos, la plata nunca llegó.' },
        { q: 'Te llega un link de “reintegro” de tu billetera. ¿Qué hacés?', o: ['Entro y pongo mis datos', 'Abro la app oficial por mi cuenta'], c: 1, e: 'Los links falsos copian el diseño de la app.' }
      ],
      ficha: ['Frenar ante la urgencia', 'Verificar en la app, no en el mensaje', 'Nunca compartir códigos ni claves', 'Practicar en el Escudo antiestafas']
    }
  ]
};
