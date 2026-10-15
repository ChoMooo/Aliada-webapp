/* ===== Escudo antiestafas: escenarios y reglas del analizador ===== */
export type Canal = 'whatsapp' | 'sms' | 'llamada' | 'correo' | 'oferta';
export type Escenario = {
  id: string; canal: Canal; de: string; msg: string;
  op: { t: string; ok: boolean; fb: string }[];
  senales: string[]; regla: string;
};

export const ESCENARIOS: Escenario[] = [
  { id: 'nuevo-numero', canal: 'whatsapp', de: '+54 9 11 5xxx-xxxx (número desconocido)',
    msg: 'Hola ma, este es mi nuevo número, el otro se me rompió. Agendalo 🙏 Necesito que me hagas una transferencia urgente, después te explico.',
    op: [
      { t: 'Le transfiero, es mi hijo', ok: false, fb: 'Es la estafa más común en WhatsApp: se hacen pasar por un familiar con un número nuevo.' },
      { t: 'Llamo a mi hijo a su número de siempre', ok: true, fb: '¡Bien! Confirmar por otro medio desarma la estafa en segundos.' },
      { t: 'Le pido el alias y le pregunto qué pasó', ok: false, fb: 'Seguir la conversación por ese número le da tiempo al estafador para presionarte.' }
    ],
    senales: ['Número nuevo que dice ser un familiar', 'Pedido de plata urgente', '“Después te explico”: evita que preguntes'],
    regla: 'Si un familiar “cambió de número” y pide plata, llamalo a su número de siempre.' },
  { id: 'codigo', canal: 'sms', de: 'Mensaje de texto',
    msg: 'Soporte WhatsApp: detectamos un problema con tu cuenta. Para no perderla, respondé con el código de 6 dígitos que te acabamos de enviar.',
    op: [
      { t: 'Respondo con el código', ok: false, fb: 'Con ese código pueden activar tu WhatsApp en otro celular y escribirle a tus contactos.' },
      { t: 'No lo comparto con nadie y activo la verificación en dos pasos', ok: true, fb: '¡Exacto! Ese código no se comparte nunca y la verificación en dos pasos te protege.' },
      { t: 'Pregunto si es real', ok: false, fb: 'Cualquier respuesta les da pie para insistir. No hace falta preguntar: nadie legítimo pide ese código.' }
    ],
    senales: ['Pide un código de verificación', 'Dice ser “soporte”', 'Amenaza con que perdés la cuenta'],
    regla: 'Los códigos que te llegan por SMS no se comparten nunca, con nadie.' },
  { id: 'banco-link', canal: 'sms', de: 'BANCO-INFO',
    msg: 'BANCO: Detectamos un ingreso no autorizado a su cuenta. Valídela en bit.ly/valida-cuenta antes de 24 h o será bloqueada.',
    op: [
      { t: 'Entro al link y valido', ok: false, fb: 'El link lleva a una página falsa que copia la del banco para robar tu usuario y clave.' },
      { t: 'No entro; abro la app del banco por mi cuenta o llamo al número de mi tarjeta', ok: true, fb: '¡Muy bien! Siempre entrá por la app oficial o el teléfono que figura en tu tarjeta.' },
      { t: 'Respondo el mensaje pidiendo más información', ok: false, fb: 'Responder confirma que tu número está activo y te pueden llamar para presionarte.' }
    ],
    senales: ['Link acortado (bit.ly)', 'Urgencia: “antes de 24 h”', 'Amenaza de bloqueo'],
    regla: 'Al banco se entra siempre desde la app oficial, nunca desde un link de un mensaje.' },
  { id: 'anses-llamada', canal: 'llamada', de: 'Llamada de número privado',
    msg: '“Le hablamos de ANSES. Tiene un bono pendiente de cobro. Para acreditarlo, acérquese a un cajero y siga mis instrucciones, o dígame el código que le va a llegar.”',
    op: [
      { t: 'Voy al cajero y sigo las instrucciones', ok: false, fb: 'En el cajero te hacen generar una clave o transferir. Así vacían cuentas.' },
      { t: 'Corto y consulto por los canales oficiales', ok: true, fb: '¡Bien! Los trámites de ANSES que consultamos son gratuitos y no se hacen por teléfono con un cajero.' },
      { t: 'Le doy el código para que me acrediten', ok: false, fb: 'Con ese código entran a tus cuentas.' }
    ],
    senales: ['Se presenta como un organismo', 'Promete un dinero que no esperabas', 'Te manda al cajero o pide un código'],
    regla: 'Nadie te va a pedir ir a un cajero para cobrar algo. Cortá y consultá por los canales oficiales.' },
  { id: 'premio', canal: 'whatsapp', de: 'Promo Ganadores',
    msg: '🎉 ¡Felicitaciones! Ganaste un celular nuevo en el sorteo aniversario. Solo pagá $ 4.900 de envío en este link para recibirlo: www.premios-ya.click',
    op: [
      { t: 'Pago el envío, es poco', ok: false, fb: 'El premio no existe: te cobran el “envío” y además se quedan con los datos de tu tarjeta.' },
      { t: 'Lo ignoro y lo borro', ok: true, fb: 'Correcto. Si no participaste de un sorteo, no ganaste nada.' },
      { t: 'Lo reenvío a mis amigos por si les sirve', ok: false, fb: 'Así la estafa llega a más gente. Mejor avisales que es falso.' }
    ],
    senales: ['Premio de un sorteo en el que no participaste', 'Pide pagar para recibirlo', 'Link con dominio raro (.click)'],
    regla: 'Si tenés que pagar para recibir un premio, no es un premio.' },
  { id: 'de-mas', canal: 'whatsapp', de: 'Comprador de Marketplace',
    msg: 'Hola! Te transferí $ 50.000 por error en vez de $ 5.000 😅 ¿Me devolvés la diferencia a este alias? luna.sol.mar',
    op: [
      { t: 'Le devuelvo la diferencia enseguida', ok: false, fb: 'Casi siempre la transferencia nunca llegó: te mandan un comprobante falso.' },
      { t: 'Reviso mis movimientos en la app antes de hacer nada', ok: true, fb: '¡Bien! Si no figura en tu app, no llegó. Y si figura, consultá con tu billetera cómo devolverlo.' },
      { t: 'Le pido una captura del comprobante', ok: false, fb: 'Las capturas se falsifican fácil. Lo único que vale es tu app.' }
    ],
    senales: ['“Te transferí de más”', 'Te apura para que devuelvas', 'Muestra capturas en vez de que lo veas en tu app'],
    regla: 'Un pago es real solo si aparece en los movimientos de tu app.' },
  { id: 'link-cobro', canal: 'whatsapp', de: 'Interesado en tu silla',
    msg: 'Hola, me interesa la silla que publicaste. Te la pago ya por adelantado. Te mando un link para que cobres: ahí poné los datos de tu tarjeta y te llega la plata.',
    op: [
      { t: 'Pongo los datos de mi tarjeta en el link', ok: false, fb: 'Para cobrar nunca necesitás dar los datos de tu tarjeta. El link te los roba.' },
      { t: 'Le paso mi alias o cobro en persona', ok: true, fb: '¡Exacto! Para cobrar alcanza con tu alias o tu QR.' },
      { t: 'Le pido que me llame para explicarme', ok: false, fb: 'Por teléfono intentan convencerte con más presión.' }
    ],
    senales: ['Link para “cobrar”', 'Pide datos de tarjeta', 'Apuro por pagar por adelantado'],
    regla: 'Para cobrar solo compartís tu alias o tu QR. Nunca datos de tarjeta ni claves.' },
  { id: 'inversion', canal: 'oferta', de: 'Publicidad en redes',
    msg: 'Invertí $ 100.000 y ganá 30% por mes GARANTIZADO. Plataforma con inteligencia artificial. Últimos cupos, escribinos ya por WhatsApp.',
    op: [
      { t: 'Escribo para invertir, parece moderno', ok: false, fb: 'Ninguna inversión seria garantiza ganancias tan altas. Primero pagan un poco y después desaparecen.' },
      { t: 'Desconfío: nadie garantiza 30% por mes', ok: true, fb: 'Correcto. Ganancia “garantizada” y altísima es la señal más clara de estafa.' },
      { t: 'Pruebo con poco', ok: false, fb: 'Así empieza: con poco te devuelven algo para que pongas más.' }
    ],
    senales: ['Ganancia garantizada', 'Porcentaje altísimo', '“Últimos cupos”'],
    regla: 'Si una inversión promete mucho, rápido y garantizado, es una estafa.' },
  { id: 'alquiler', canal: 'oferta', de: 'Aviso de alquiler',
    msg: 'Alquilo depto en la costa, enero, súper barato. Hay muchos interesados, si me pagás la seña hoy te lo reservo. No lo puedo mostrar porque estoy de viaje.',
    op: [
      { t: 'Pago la seña para no perderlo', ok: false, fb: 'Es una estafa típica de temporada: el departamento no existe o no es de esa persona.' },
      { t: 'No pago sin verlo o sin verificar quién es el dueño', ok: true, fb: '¡Bien! Pedí verlo, usá inmobiliarias o plataformas con protección.' },
      { t: 'Pido fotos y si son lindas, pago', ok: false, fb: 'Las fotos se copian de otros avisos.' }
    ],
    senales: ['Precio muy bajo', 'Apuro con la seña', 'No se puede ver'],
    regla: 'No pagues señas de algo que nadie puede mostrarte.' },
  { id: 'voz-nieto', canal: 'llamada', de: 'Llamada de número desconocido',
    msg: '“Abuela, soy yo… tuve un problema con el auto, estoy en la comisaría. No le digas a mamá, por favor. Necesito plata ya, te paso con el abogado.”',
    op: [
      { t: 'Hago lo que me dice el abogado', ok: false, fb: 'Es el “cuento del tío”. Hoy además pueden imitar voces con inteligencia artificial.' },
      { t: 'Corto y llamo a mi nieto o a su mamá a sus números de siempre', ok: true, fb: '¡Muy bien! Y acordá con tu familia una palabra clave para emergencias.' },
      { t: 'Le pregunto datos para ver si es él', ok: false, fb: 'Muchos datos están en redes sociales. Mejor cortá y llamá vos.' }
    ],
    senales: ['Emergencia y apuro', '“No le digas a nadie”', 'Te pasan con un “abogado” o “policía”'],
    regla: 'Ante una emergencia por teléfono, cortá y llamá vos a tu familiar.' }
];

export type Senal = { id: string; t: string; e: string; peso: number; re: RegExp; verificar: string };
export const SENALES: Senal[] = [
  { id: 'codigo', t: 'Pide un código o una clave', e: 'Los códigos y claves son solo tuyos. Nadie legítimo te los pide por mensaje o teléfono.', peso: 3, re: /c[oó]digo|token|\bpin\b|clave|contrase[ñn]a/i, verificar: 'No compartas ningún código ni clave.' },
  { id: 'datos', t: 'Pide datos personales o bancarios', e: 'DNI, CBU, números de tarjeta o de seguridad abren la puerta a robos.', peso: 3, re: /\bdni\b|cuil|\bcbu\b|\bcvu\b|n[uú]mero de (tu |la )?(tarjeta|cuenta)|cvv|c[oó]digo de seguridad|datos (personales|bancarios|de (tu|la) tarjeta)|vencimiento de/i, verificar: 'No envíes datos bancarios ni personales por este medio.' },
  { id: 'link', t: 'Trae un link', e: 'Los links pueden llevar a páginas falsas que copian a bancos o empresas.', peso: 2, re: /https?:\/\/|www\.|bit\.ly|tinyurl|\.click\b|\.xyz\b|\.top\b|\.link\b|\.info\b/i, verificar: 'No entres al link: abrí la app o la web oficial escribiéndola vos.' },
  { id: 'urgencia', t: 'Te apura', e: 'La urgencia busca que no pienses ni consultes.', peso: 2, re: /urgente|ya mismo|hoy mismo|inmediat|antes de \d+ ?(h|hs|horas)|[uú]ltim[oa]s? (horas|cupos|lugares)|ser[aá] bloquead|se (va a )?bloquear|caduca|vence hoy|ahora mismo/i, verificar: 'Frená: ningún trámite real se pierde por esperar un rato y consultar.' },
  { id: 'nuevo', t: 'Dice tener un número nuevo', e: 'Hacerse pasar por un familiar con número nuevo es la estafa más común.', peso: 3, re: /nuevo n[uú]mero|cambi[eé] (de )?n[uú]mero|agend[aá](lo|me)|este es mi (nuevo )?n[uú]mero|se me rompi[oó] el (celu|tel)/i, verificar: 'Llamá a esa persona a su número de siempre.' },
  { id: 'premio', t: 'Promete un premio o un beneficio', e: 'Premios, bonos o reintegros que no esperabas suelen ser el anzuelo.', peso: 2, re: /ganaste|ganador|premio|sorteo|regalo|bono|beneficio|reintegro|felicitaciones/i, verificar: 'Si no participaste de nada, no ganaste nada. Confirmá en la app o web oficial.' },
  { id: 'plata', t: 'Pide plata o una transferencia', e: 'Cualquier pedido de plata por mensaje merece una verificación extra.', peso: 1, re: /transfer|deposit|pag(a|á|ar|ues)\b|plata|dinero|\$\s?\d|se[ñn]a|alias/i, verificar: 'Antes de transferir, confirmá por otro medio con quien te lo pide.' },
  { id: 'demas', t: '“Te transferí de más”', e: 'Suele venir con un comprobante falso.', peso: 3, re: /(transfer[ií]|deposit[eé]|mand[eé]) (de m[aá]s|por error)|por error/i, verificar: 'Revisá tus movimientos en la app: si no figura, no llegó.' },
  { id: 'suplanta', t: 'Dice ser un banco, empresa u organismo', e: 'Los estafadores usan nombres conocidos para dar confianza.', peso: 1, re: /soporte|banco|anses|pami|afip|arca|mercado ?pago|mercado ?libre|whatsapp|correo argentino|polic[ií]a|comisar[ií]a|abogad/i, verificar: 'Contactá al organismo o empresa por sus canales oficiales, no por los que te dan en el mensaje.' },
  { id: 'secreto', t: 'Te pide que no le cuentes a nadie', e: 'El secreto evita que alguien de confianza te advierta.', peso: 2, re: /no le digas|no (se lo )?cuentes|entre nosotros|confidencial|no avises/i, verificar: 'Contáselo a alguien de confianza antes de hacer nada.' },
  { id: 'garantia', t: 'Ganancias garantizadas', e: 'Nadie puede garantizar ganancias altas: es la marca de las estafas de inversión.', peso: 3, re: /garantizad|sin riesgo|\d+ ?% (por|al|cada) (mes|d[ií]a|semana)|duplic(a|á)s?/i, verificar: 'Desconfiá de cualquier inversión con ganancia garantizada.' }
];

export function analizar(t: string) {
  const found = SENALES.filter((s) => s.re.test(t));
  const peso = found.reduce((a, s) => a + s.peso, 0);
  const nivel: 'alto' | 'medio' | 'bajo' = peso >= 4 || found.some((s) => s.peso >= 3) ? 'alto' : peso >= 2 ? 'medio' : found.length ? 'medio' : 'bajo';
  return { found, peso, nivel };
}
