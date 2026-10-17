/* Inversiones: educación sobre CÓMO se invierte en Argentina. No recomienda en qué invertir.
   Datos verificados el 16/10/2026. Fuentes en INV_FUENTES. */
import { type Module, same, F, S, home } from './shared';
import { TICKERS } from './tickers';

export const INV_FECHA = '2026-10-16';
export const INV_FUENTES = [
  { t: 'Registro público de agentes (ALyC) — CNV', u: 'https://www.cnv.gov.ar/SitioWeb/RegistrosPublicos/Agentes' },
  { t: 'Registro de Proveedores de Servicios de Activos Virtuales (PSAV) — CNV', u: 'https://www.cnv.gov.ar/SitioWeb/RegistrosPublicos/Psav' },
  { t: 'Garantía de los depósitos: $ 50.000.000 desde el 1/4/2026 — BCRA, Comunicación “A” 8407', u: 'https://www.bcra.gob.ar/Pdfs/comytexord/A8407.pdf' },
  { t: 'Plazo de liquidación de 24 horas (T+1) desde el 27/5/2024 — BYMA', u: 'https://www.byma.com.ar/newsroom/desde-el-27052024-byma-reduce-el-ciclo-de-liquidacin-de-operaciones-de-contado-normal' }
];
const b = (o: any = {}) => S('broker', o);

const BASE: Module = {
  id: 'inv-base', n: 'Primeros pasos para invertir', apps: 'Conceptos, dónde invertir y cuenta comitente', tone: 'mint', section: 'inversiones',
  desc: 'Lo que conviene saber antes de empezar: riesgo, plazo, dónde se invierte en Argentina y cómo abrir una cuenta.',
  temas: ['Antes de invertir', 'Dónde se invierte', 'Abrir una cuenta comitente', 'Costos e impuestos'],
  lessons: [
    {
      id: 'inv-antes', t: 'Antes de invertir: 6 ideas clave', min: 7, nivel: 'basico',
      para: 'Vas a entender las palabras que vas a escuchar siempre: riesgo, plazo, liquidez, inflación, diversificar y perfil de inversor.',
      idea: ['Riesgo: cuánto puede subir o bajar lo que invertís. A más rendimiento posible, en general, más riesgo.', 'Plazo y liquidez: en cuánto tiempo necesitás la plata y qué tan rápido la podés recuperar.', 'Inflación: si una inversión rinde menos que la inflación, tu plata pierde poder de compra.', 'Diversificar: repartir en distintas opciones para no depender de una sola.', 'Perfil de inversor: un cuestionario que te hacen al abrir una cuenta para conocer cuánto riesgo aceptás.', 'Una base sana: tener un fondo para imprevistos antes de invertir a largo plazo.'],
      demo: [
        F(b({ v: 'signup', step: 3, hl: 'q1' }), 'Al abrir una cuenta te hacen un test de perfil: por ejemplo, qué harías si tu inversión baja un 10 % en un mes.'),
        F(b({ v: 'fci', hl: 'f0' }), 'Cada opción indica su nivel de riesgo y en cuánto tiempo recuperás la plata (rescate).'),
        F(b({ v: 'portfolio', hl: 'trade' }), 'Diversificar es repartir: por ejemplo, una parte en algo de bajo riesgo y otra en algo de más largo plazo.'),
        F(b({ v: 'asset', x: TICKERS[1], hl: 'sell' }), 'Los precios suben y bajan. Antes de invertir, pensá en qué plazo vas a necesitar ese dinero.')
      ],
      pasos: same(['Definí para qué es la plata y cuándo la vas a necesitar.', 'Separá primero un fondo para imprevistos (varios meses de gastos) en algo que puedas retirar rápido.', 'Respondé el test de perfil con sinceridad.', 'Empezá con montos chicos para aprender cómo funciona.', 'No inviertas en algo que no entendés: preguntá hasta entenderlo.']),
      siNo: ['Desconfiá de cualquiera que te prometa ganancias seguras, altas y rápidas.', 'Esta sección es educativa: no te dice en qué invertir. Para decisiones personales, consultá con un asesor matriculado.'],
      quiz: [
        { q: '¿Qué es la liquidez?', o: ['Qué tan rápido podés recuperar tu plata', 'El color del dinero', 'La ganancia asegurada'], c: 0, e: 'Algo líquido se convierte en efectivo rápido.' },
        { q: 'Alguien te promete duplicar tu plata en un mes, sin riesgo. ¿Qué pensás?', o: ['Es una gran oportunidad', 'Es una señal de alerta'], c: 1, e: 'No existe rendimiento alto sin riesgo.' }
      ],
      ficha: ['Riesgo · Plazo · Liquidez', 'Inflación: rendir más que ella', 'Diversificar', 'Perfil de inversor', 'Fondo para imprevistos primero']
    },
    {
      id: 'inv-donde', t: 'Dónde se invierte en Argentina y cómo verificar', min: 7, nivel: 'basico',
      para: 'Vas a conocer las cuatro puertas para invertir y cómo comprobar que la empresa esté habilitada.',
      idea: ['Bancos: plazo fijo, fondos comunes y, en muchos, una sección de inversiones con cuenta comitente.', 'Billeteras virtuales: cuentas que rinden (en general a través de fondos comunes de inversión).', 'Agentes de bolsa (ALyC): apps para comprar fondos, bonos, acciones y CEDEARs. Algunas conocidas: InvertirOnline, Balanz, Bull Market, Cocos, PPI. La mención no es una recomendación.', 'Exchanges de criptomonedas: deben estar registrados como PSAV en la CNV.', 'Antes de abrir una cuenta, buscá a la empresa en los registros públicos de la CNV.'],
      demo: [
        F(home('Mi banco'), 'Primera puerta: tu banco. Suele tener una sección «Inversiones».'),
        F(S('wallet', { v: 'invest', hl: 'i2' }), 'Segunda: tu billetera virtual, donde el saldo puede rendir.'),
        F(home('Inversiones'), 'Tercera: una app de un agente de bolsa (ALyC).'),
        F(home('Cripto'), 'Cuarta: un exchange de criptomonedas registrado.'),
        F(S('google', { hl: 'mic' }), 'Antes de abrir una cuenta, buscá «registro de agentes CNV» y verificá que la empresa figure.')
      ],
      pasos: same(['Elegí por dónde empezar: tu banco, tu billetera, un agente de bolsa o un exchange.', 'Entrá al sitio de la CNV → Registros públicos → Agentes (para brokers) o PSAV (para cripto).', 'Buscá el nombre de la empresa y fijate que figure como habilitada.', 'Descargá la app solo desde la tienda oficial y revisá el desarrollador.', 'Si la empresa no figura, no envíes dinero.']),
      siNo: ['Si te contactan por redes o WhatsApp para invertir con un “asesor”, verificá la empresa en la CNV antes de responder.', 'Que una app aparezca en publicidades no significa que esté habilitada.'],
      quiz: [
        { q: '¿Dónde verificás que un agente de bolsa esté habilitado?', o: ['En el registro de agentes de la CNV', 'En los comentarios de Facebook', 'En el grupo de la familia'], c: 0, e: 'La CNV publica el registro oficial.' },
        { q: 'Un exchange de cripto en Argentina debe estar…', o: ['Registrado como PSAV en la CNV', 'En la tienda de apps solamente'], c: 0, e: 'Los proveedores de activos virtuales se registran en la CNV.' }
      ],
      ficha: ['Banco · Billetera · ALyC · Exchange', 'CNV → Registros públicos', 'Agentes (brokers) · PSAV (cripto)', 'Si no figura, no envíes plata']
    },
    {
      id: 'inv-cuenta', t: 'Abrir una cuenta comitente', min: 7, nivel: 'basico',
      para: 'Vas a saber qué te piden y cómo es el paso a paso para abrir una cuenta para invertir, sin costo de apertura en la mayoría de los casos.',
      idea: ['La cuenta comitente es la cuenta donde quedan tus inversiones (fondos, bonos, acciones). Se abre en un banco o en un agente de bolsa.', 'Te van a pedir tus datos, foto del documento, una selfie, el test de perfil y una cuenta bancaria a tu nombre.', 'El dinero entra y sale siempre desde cuentas a tu nombre.'],
      demo: [
        F(b({ v: 'signup', step: 1, hl: 'f0' }), 'Descargá la app oficial y empezá con tus datos: nombre, correo y celular.'),
        F(b({ v: 'signup', step: 2, hl: 'dni' }), 'Validá tu identidad con fotos del documento y una selfie, dentro de la app.'),
        F(b({ v: 'signup', step: 3, pick: 1, hl: 'next' }), 'Respondé el test de perfil de inversor.'),
        F(b({ v: 'signup', step: 4, hl: 'cbu' }), 'Cargá tu CBU o CVU propio: desde ahí ingresás y retirás dinero.'),
        F(b({ v: 'deposit', hl: 'cbu' }), 'Para ingresar dinero, transferí desde tu banco o billetera a los datos de tu cuenta comitente.')
      ],
      pasos: same(['Elegí un banco o agente habilitado por la CNV y descargá su app oficial.', 'Tocá “Abrir cuenta” y completá tus datos.', 'Validá tu identidad (fotos del documento y selfie) dentro de la app.', 'Respondé el test de perfil de inversor y aceptá los términos después de leerlos.', 'Cargá tu cuenta bancaria propia (CBU o CVU).', 'Para empezar, transferí un monto chico desde tu cuenta a los datos de la cuenta comitente.']),
      siNo: ['La validación de identidad se hace solo dentro de la app oficial: nadie te la va a pedir por WhatsApp.', 'Si la aprobación demora, esperá el correo de la empresa o consultá desde la ayuda de la app.'],
      quiz: [
        { q: '¿Desde qué cuenta ingresás dinero a la comitente?', o: ['Desde una cuenta a tu nombre', 'Desde la de cualquier persona'], c: 0, e: 'El dinero entra y sale siempre desde cuentas a tu nombre.' },
        { q: '¿Dónde validás tu identidad?', o: ['Solo dentro de la app oficial', 'Mandando fotos por WhatsApp'], c: 0, e: 'Es parte del alta, dentro de la app.' }
      ],
      ficha: ['Datos → identidad → perfil → CBU propio', 'Solo app oficial', 'Ingresar desde cuenta a tu nombre', 'Empezar con poco']
    },
    {
      id: 'inv-costos', t: 'Costos, impuestos y seguimiento', min: 6, nivel: 'intermedio',
      para: 'Vas a saber qué costos puede tener invertir, dónde ver tus movimientos y cuándo conviene consultar a un contador.',
      idea: ['Al comprar o vender suele haber comisiones del agente, derechos de mercado e IVA. Algunas cuentas cobran custodia.', 'La app muestra el costo estimado antes de confirmar cada operación: revisalo siempre.', 'Las inversiones pueden tener impuestos según el caso. Para tu situación, consultá con un contador.', 'En «Movimientos» y en los resúmenes mensuales ves todo lo que hiciste.'],
      demo: [
        F(b({ v: 'order', hl: 'review' }), 'Antes de confirmar, mirá el detalle: monto, comisión y derechos, y total.'),
        F(b({ v: 'confirm', hl: 'ok' }), 'En la confirmación figura el total estimado. El precio final puede variar un poco.'),
        F(b({ v: 'portfolio', hl: 'nav3' }), 'En «Movimientos» ves cada compra, venta e ingreso.'),
        F(b({ v: 'portfolio', hl: 'nav4' }), 'En tu perfil encontrás los resúmenes y las comisiones vigentes de la empresa.')
      ],
      pasos: same(['Antes de abrir la cuenta, buscá en la web de la empresa su tabla de comisiones.', 'En cada operación, mirá el costo estimado antes de confirmar.', 'Revisá tus movimientos y el resumen mensual.', 'Guardá los comprobantes.', 'Si tenés dudas sobre impuestos, consultá con un contador.']),
      siNo: ['Operar muchas veces seguidas suma comisiones: tenelo en cuenta.', 'Si ves un cargo que no entendés, consultá desde la ayuda oficial de la app.'],
      quiz: [
        { q: '¿Dónde ves cuánto te cuesta una operación?', o: ['En el detalle antes de confirmar', 'No se puede saber'], c: 0, e: 'La app muestra la estimación antes de confirmar.' },
        { q: '¿Quién te puede asesorar sobre impuestos de tus inversiones?', o: ['Un contador', 'Un video al azar'], c: 0, e: 'Depende de tu situación particular.' }
      ],
      ficha: ['Comisiones · derechos · IVA · custodia', 'Mirar el costo antes de confirmar', 'Movimientos y resúmenes', 'Impuestos: contador']
    }
  ]
};

const PESOS: Module = {
  id: 'inv-pesos', n: 'Opciones en pesos', apps: 'Plazo fijo, cuentas que rinden, FCI y bonos', tone: 'sky', section: 'inversiones',
  desc: 'Cómo funcionan y cómo se contratan el plazo fijo, las cuentas remuneradas, los fondos comunes y los bonos.',
  temas: ['Plazo fijo', 'Cuentas que rinden', 'Fondos comunes de inversión', 'Bonos y obligaciones negociables'],
  lessons: [
    {
      id: 'inv-pf', t: 'Plazo fijo tradicional y UVA', min: 6, nivel: 'basico',
      para: 'Vas a saber cómo funciona un plazo fijo, la diferencia entre el tradicional y el UVA, y cómo se arma desde el home banking.',
      idea: ['En un plazo fijo dejás el dinero en el banco por un tiempo y te pagan un interés. El tradicional tiene un plazo mínimo de 30 días.', 'La tasa (TNA) la informa cada banco al momento de armarlo.', 'El UVA ajusta por inflación y tiene un plazo mínimo más largo: el banco te lo indica al armarlo.', 'Los depósitos en bancos tienen una garantía de hasta $ 50.000.000 por persona y por entidad, con algunas condiciones (desde el 1/4/2026).'],
      demo: [
        F(home('Mi banco'), 'Entrá a la app de tu banco.'),
        F(b({ v: 'pf', hl: 'kind0' }), 'Buscá «Plazo fijo» y elegí tradicional o UVA.'),
        F(b({ v: 'pf', hl: 'amt' }), 'Escribí el monto.', 'type'),
        F(b({ v: 'pf', days: '30 días', hl: 'days' }), 'Elegí el plazo. El banco te muestra la tasa, el interés estimado y la fecha de vencimiento.'),
        F(b({ v: 'pf', hl: 'ok' }), 'Revisá todo y tocá «Constituir». Al vencer, el dinero vuelve a tu cuenta (o se renueva, si elegiste eso).')
      ],
      pasos: same(['Entrá a la app o home banking de tu banco → Inversiones → Plazo fijo.', 'Elegí tradicional o UVA.', 'Escribí el monto y el plazo.', 'Mirá la tasa (TNA), el interés estimado y la fecha de vencimiento.', 'Elegí qué pasa al vencer (acreditar o renovar) y confirmá.']),
      siNo: ['El dinero de un plazo fijo no se puede usar hasta que vence (salvo opciones precancelables con condiciones).', 'El dinero en billeteras virtuales y en fondos comunes no tiene la garantía de depósitos de los bancos.'],
      quiz: [
        { q: '¿Cuál es el plazo mínimo de un plazo fijo tradicional?', o: ['30 días', '1 día', '5 años'], c: 0, e: 'El tradicional se arma por al menos 30 días.' },
        { q: '¿Qué tiene de particular el plazo fijo UVA?', o: ['Ajusta por inflación y su plazo mínimo es más largo', 'No paga nada'], c: 0, e: 'El banco informa el plazo mínimo al armarlo.' }
      ],
      ficha: ['Tradicional: mínimo 30 días', 'UVA: ajusta por inflación, plazo más largo', 'Mirar TNA y vencimiento', 'Garantía: hasta $ 50 millones por persona y banco']
    },
    {
      id: 'inv-rinde', t: 'Cuentas que rinden en billeteras', min: 5, nivel: 'basico',
      para: 'Vas a entender cómo hace tu billetera para que el saldo rinda todos los días y qué tener en cuenta.',
      idea: ['En muchas billeteras, el saldo se invierte en un fondo común de inversión de bajo riesgo (money market).', 'Rinde un poco cada día y podés usar el dinero cuando quieras.', 'El rendimiento cambia con el tiempo y no está garantizado. Ese dinero no tiene la garantía de los depósitos bancarios.'],
      demo: [
        F(S('wallet', { hl: 'yield' }), 'En la pantalla principal suele aparecer cuánto rindió tu dinero hoy.'),
        F(S('wallet', { hl: 'invest' }), 'Tocá la opción de rendimientos o «Invertir».'),
        F(S('wallet', { v: 'invest', hl: 'i2' }), 'Ahí ves en qué fondo está tu dinero y su detalle. Leelo antes de activarlo.')
      ],
      pasos: same(['Abrí tu billetera y buscá “Rendimientos” o “Tu dinero rinde”.', 'Leé el detalle: qué fondo es, quién lo administra y su reglamento.', 'Activalo si te conviene. Algunas billeteras lo activan por defecto.', 'Mirá en tu actividad los rendimientos diarios.']),
      siNo: ['Si el rendimiento baja, no es un error: depende de las tasas del mercado.', 'Para montos grandes o largo plazo, compará con otras opciones.'],
      quiz: [
        { q: '¿De dónde sale el rendimiento de la cuenta?', o: ['De un fondo común de inversión', 'Es un regalo fijo para siempre'], c: 0, e: 'Por eso cambia con el tiempo.' },
        { q: '¿Ese dinero tiene la garantía de los depósitos bancarios?', o: ['No', 'Sí, igual que un plazo fijo'], c: 0, e: 'La garantía cubre depósitos en bancos.' }
      ],
      ficha: ['Saldo invertido en un fondo de bajo riesgo', 'Rinde diario, se usa cuando quieras', 'Rendimiento variable', 'Sin garantía de depósitos']
    },
    {
      id: 'inv-fci', t: 'Fondos comunes de inversión', min: 6, nivel: 'intermedio',
      para: 'Vas a entender qué es un fondo común, cómo se elige según el riesgo y cómo se suscribe y se rescata.',
      idea: ['Un fondo común junta el dinero de muchas personas y lo administra una sociedad gerente. Vos tenés «cuotapartes».', 'Hay fondos de liquidez (bajo riesgo, rescate rápido), de renta fija (bonos) y de renta variable (acciones, más riesgo).', '«Suscribir» es entrar al fondo; «rescatar» es retirar. Cada fondo dice en cuántos días te devuelve la plata.'],
      demo: [
        F(b({ v: 'portfolio', hl: 'trade' }), 'En tu banco o broker, entrá a «Operar» o «Fondos».'),
        F(b({ v: 'fci', hl: 'cat0' }), 'Los fondos se agrupan por tipo: liquidez, renta fija, renta variable.'),
        F(b({ v: 'fci', hl: 'f1' }), 'Cada uno indica su riesgo y el plazo de rescate. Tocá uno para leer su reglamento.'),
        F(b({ v: 'order', x: { k: 'FCI', t: 'Fondo Ejemplo Renta Fija', p: '$ 1.152,30 por cuotaparte', c: '', up: true, type: 'FCI' }, qty: '$ 100.000', hl: 'qty' }), 'Para suscribir, escribí el monto en pesos y confirmá.', 'type')
      ],
      pasos: same(['En tu banco o broker, entrá a Fondos comunes de inversión.', 'Filtrá por tipo y mirá riesgo, plazo de rescate y rendimientos pasados (no garantizan los futuros).', 'Leé el reglamento del fondo.', 'Tocá “Suscribir”, escribí el monto y confirmá.', 'Para retirar, tocá “Rescatar”: la plata llega en el plazo que indica el fondo.']),
      siNo: ['Un fondo de renta variable puede bajar: pensalo para plazos largos.', 'Los fondos no tienen la garantía de depósitos.'],
      quiz: [
        { q: '¿Qué es “rescatar” un fondo?', o: ['Retirar tu dinero', 'Invertir más', 'Cambiar de banco'], c: 0, e: 'Suscribir es entrar; rescatar, salir.' },
        { q: '¿Qué tipo de fondo suele tener menos riesgo?', o: ['Liquidez', 'Renta variable'], c: 0, e: 'Los de liquidez son de bajo riesgo y rescate rápido.' }
      ],
      ficha: ['Cuotapartes', 'Liquidez · Renta fija · Renta variable', 'Suscribir = entrar · Rescatar = salir', 'Leer el reglamento']
    },
    {
      id: 'inv-bonos', t: 'Bonos y obligaciones negociables', min: 7, nivel: 'intermedio',
      para: 'Vas a entender qué es un bono, qué es una obligación negociable (ON) y cómo se compran desde una cuenta comitente.',
      idea: ['Un bono es un préstamo que le hacés a un gobierno; una ON, a una empresa. A cambio, te pagan intereses (cupones) y te devuelven el capital (amortización) en fechas fijas.', 'Se compran y venden en el mercado, así que su precio sube y baja hasta el vencimiento.', 'Algunos se pagan en pesos y otros en dólares. El prospecto indica cómo y cuándo pagan.'],
      demo: [
        F(b({ v: 'market', cat: 2, list: [TICKERS[2]], hl: 'cat2' }), 'En «Mercado», elegí la categoría «Bonos» u «ON».'),
        F(b({ v: 'asset', x: TICKERS[2], info: [['Paga cupones', 'Semestrales'], ['Moneda', 'Pesos'], ['Vencimiento', '2030']], hl: 'buy' }), 'En la ficha ves la moneda, cuándo paga y el vencimiento. Leé el prospecto antes de comprar.'),
        F(b({ v: 'order', x: TICKERS[2], qty: '100 nominales', hl: 'qty' }), 'Los bonos se compran por «valor nominal». La app calcula el monto.', 'type'),
        F(b({ v: 'confirm', rows: [['Operación', 'Compra'], ['Instrumento', 'BX30 · Bono Ejemplo 2030'], ['Cantidad', '100 nominales'], ['Plazo', '24 hs'], ['Total estimado', '$ 84.600']], hl: 'ok' }), 'Revisá y confirmá. Los pagos de cupones llegan a tu cuenta comitente.')
      ],
      pasos: same(['En tu cuenta comitente, entrá a Mercado → Bonos u ON.', 'Elegí el instrumento y leé su ficha y prospecto: moneda, pagos y vencimiento.', 'Tocá “Comprar”, elegí la cantidad (valor nominal) y el tipo de precio.', 'Revisá costos y confirmá.', 'Los cupones y amortizaciones se acreditan en tu cuenta comitente.']),
      siNo: ['Si vendés antes del vencimiento, el precio puede ser mayor o menor al que pagaste.', 'Si no entendés un prospecto, consultá con la atención de tu broker antes de comprar.'],
      quiz: [
        { q: '¿Qué es una ON?', o: ['Un préstamo a una empresa', 'Una acción', 'Una criptomoneda'], c: 0, e: 'ON = obligación negociable, deuda de empresas.' },
        { q: '¿Qué es un cupón?', o: ['El interés que paga el bono', 'Un descuento del súper'], c: 0, e: 'Se paga en las fechas que indica el prospecto.' }
      ],
      ficha: ['Bono = deuda de un gobierno', 'ON = deuda de una empresa', 'Cupón = interés · Amortización = devolución', 'Leer el prospecto']
    }
  ]
};

const MERCADO: Module = {
  id: 'inv-mercado', n: 'Acciones, dólar y cripto', apps: 'Acciones, CEDEARs, dólar MEP y criptomonedas', tone: 'violet', section: 'inversiones',
  desc: 'Cómo funcionan y cómo se operan las acciones, los CEDEARs, el dólar MEP y las criptomonedas.',
  temas: ['Acciones y CEDEARs', 'Dólar MEP', 'Criptomonedas'],
  lessons: [
    {
      id: 'inv-acciones', t: 'Acciones y CEDEARs: cómo se compran', min: 8, nivel: 'intermedio',
      para: 'Vas a saber qué es una acción, qué es un CEDEAR y cómo se arma una orden de compra paso a paso.',
      idea: ['Una acción es una pequeña parte de una empresa. Su precio sube y baja según el mercado.', 'Un CEDEAR representa acciones de empresas del exterior y se compra en Argentina, en pesos o dólares, desde tu cuenta comitente.', 'Cada instrumento tiene un código corto (ticker). Al comprar elegís cantidad, tipo de precio y plazo: «contado inmediato» o «24 hs».', 'Las acciones son inversiones de riesgo, pensadas para plazos largos.'],
      demo: [
        F(b({ v: 'market', cat: 1, hl: 'cat1' }), 'En «Mercado», elegí «Acciones» o «CEDEARs».'),
        F(b({ v: 'market', cat: 1, q: 'GLB', hl: 'q' }), 'Buscá por nombre o por ticker (el código corto).', 'type'),
        F(b({ v: 'asset', x: TICKERS[1], hl: 'buy' }), 'En la ficha ves el precio y su evolución. Tocá «Comprar».'),
        F(b({ v: 'order', x: TICKERS[1], ptype: 1, hl: 'type1' }), 'Con «Precio límite» elegís el precio máximo que querés pagar. Con «Precio de mercado» comprás al precio del momento.'),
        F(b({ v: 'order', x: TICKERS[1], qty: '5', hl: 'term' }), 'Elegí la cantidad y el plazo: contado inmediato o 24 hs.'),
        F(b({ v: 'confirm', rows: [['Operación', 'Compra'], ['Instrumento', 'GLB · CEDEAR Empresa Global'], ['Cantidad', '5'], ['Precio límite', '$ 18.320'], ['Plazo', '24 hs'], ['Total estimado', '$ 92.150']], hl: 'ok' }), 'Revisá y confirmá. La orden se ejecuta si hay alguien que vende a ese precio.')
      ],
      pasos: same(['En tu cuenta comitente, entrá a Mercado → Acciones o CEDEARs.', 'Buscá por nombre o ticker y mirá la ficha.', 'Tocá “Comprar” y elegí el tipo de precio (límite o mercado).', 'Escribí la cantidad y elegí el plazo (contado inmediato o 24 hs).', 'Revisá costos y confirmá. Mirá en “Órdenes” si se ejecutó.']),
      siNo: ['Si tu orden con precio límite no se ejecuta, puede quedar pendiente hasta el cierre: podés cancelarla.', 'El mercado opera en días hábiles y en horario de mercado.'],
      quiz: [
        { q: '¿Qué es un CEDEAR?', o: ['Un certificado que representa acciones de empresas del exterior', 'Un plazo fijo en dólares'], c: 0, e: 'Se compra en Argentina desde una cuenta comitente.' },
        { q: '¿Para qué sirve el precio límite?', o: ['Para fijar el precio máximo que querés pagar', 'Para comprar gratis'], c: 0, e: 'La orden se ejecuta solo a ese precio o mejor.' }
      ],
      ficha: ['Acción = parte de una empresa', 'CEDEAR = acción del exterior en Argentina', 'Ticker = código', 'Precio límite o de mercado', 'Contado inmediato o 24 hs']
    },
    {
      id: 'inv-mep', t: 'Dólar MEP: qué es y cómo se opera', min: 7, nivel: 'intermedio',
      para: 'Vas a entender qué es el dólar MEP y cómo se compra desde un banco o una cuenta comitente.',
      idea: ['El dólar MEP se obtiene comprando un bono en pesos y vendiéndolo en dólares, de forma legal y online.', 'Muchas apps tienen la opción «Comprar dólar MEP» que hace los dos pasos juntos.', 'Necesitás una cuenta comitente y una caja de ahorro en dólares a tu nombre para retirarlos.', 'Las reglas cambiarias (plazos de espera y restricciones con otras compras de dólares) cambian con el tiempo: consultalas en tu banco o broker antes de operar.'],
      demo: [
        F(b({ v: 'portfolio', hl: 'deposit' }), 'Ingresá pesos a tu cuenta comitente desde una cuenta a tu nombre.'),
        F(b({ v: 'mep', hl: 'amt' }), 'Entrá a «Dólar MEP», elegí «Comprar» y escribí el monto en pesos.', 'type'),
        F(b({ v: 'mep', hl: 'ok' }), 'La app te muestra la cotización estimada y cuándo se acreditan los dólares según las reglas vigentes.'),
        F(b({ v: 'portfolio', hl: 'withdraw' }), 'Cuando estén disponibles, retirá los dólares a tu caja de ahorro en dólares.')
      ],
      pasos: same(['Abrí una cuenta comitente (en tu banco o en un agente habilitado) y una caja de ahorro en dólares a tu nombre.', 'Ingresá pesos a la cuenta comitente.', 'Elegí “Comprar dólar MEP” (o comprá el bono en pesos y vendelo en dólares, si sabés hacerlo).', 'Revisá la cotización, los costos y el plazo de acreditación, y confirmá.', 'Retirá los dólares a tu caja de ahorro en dólares cuando estén disponibles.']),
      siNo: ['Si la app no te deja operar, puede ser por una restricción vigente: consultá con la atención de tu banco o broker.', 'La cotización cambia durante el día.'],
      quiz: [
        { q: '¿Cómo se obtiene el dólar MEP?', o: ['Comprando un bono en pesos y vendiéndolo en dólares', 'En una cueva'], c: 0, e: 'Es una operación legal en el mercado.' },
        { q: '¿Dónde confirmás las reglas vigentes para operar?', o: ['En tu banco o broker', 'En un video viejo'], c: 0, e: 'Las reglas cambian con el tiempo.' }
      ],
      ficha: ['Bono en pesos → venta en dólares', 'Cuenta comitente + caja en dólares a tu nombre', 'Opción “Comprar dólar MEP”', 'Consultar reglas vigentes']
    },
    {
      id: 'inv-cripto', t: 'Criptomonedas: qué son y cómo se compran', min: 7, nivel: 'intermedio',
      para: 'Vas a entender qué son las criptomonedas y las stablecoins, cómo se compran en un exchange registrado y cómo proteger tu cuenta.',
      idea: ['Las criptomonedas son monedas digitales. Su precio puede subir o bajar mucho en poco tiempo: son de alto riesgo.', 'Las «stablecoins» (como USDT o USDC) buscan mantener un valor parecido al dólar.', 'Se compran en un exchange (una app de compra y venta). En Argentina deben estar registrados como PSAV en la CNV.', 'Protegé tu cuenta con verificación en dos pasos y no compartas tus claves ni códigos.'],
      demo: [
        F(home('Cripto'), 'Abrí la app de un exchange registrado.'),
        F(S('crypto', { v: 'security', hl: 'r0' }), 'Antes de operar, activá la verificación en dos pasos.'),
        F(S('crypto', { hl: 'deposit' }), 'Ingresá pesos desde una cuenta a tu nombre.'),
        F(S('crypto', { hl: 'buy' }), 'Tocá «Comprar» y elegí la moneda.'),
        F(S('crypto', { v: 'buy', coin: 'USDT', hl: 'amt' }), 'Escribí el monto y revisá cuánto recibís.', 'type'),
        F(S('crypto', { v: 'buy', coin: 'USDT', hl: 'ok' }), 'Confirmá. Tu saldo aparece en la pantalla principal.')
      ],
      pasos: same(['Verificá que el exchange figure en el registro de PSAV de la CNV.', 'Descargá la app oficial y completá la validación de identidad dentro de la app.', 'Activá la verificación en dos pasos.', 'Ingresá pesos desde una cuenta a tu nombre.', 'Tocá “Comprar”, elegí la moneda, el monto y confirmá.', 'Para vender, elegí “Vender” y retirá los pesos a tu cuenta.']),
      siNo: ['Si alguien te ofrece “manejar tus criptos” o te pide que le transfieras para invertir por vos, no lo hagas.', 'Si mandás cripto a una dirección equivocada, en general no se puede recuperar: revisá siempre la red y la dirección.'],
      quiz: [
        { q: '¿Qué es una stablecoin?', o: ['Una cripto que busca mantener un valor parecido al dólar', 'Una acción', 'Un plazo fijo'], c: 0, e: 'Por ejemplo, USDT o USDC.' },
        { q: '¿Qué conviene activar antes de operar?', o: ['La verificación en dos pasos', 'Las notificaciones de juegos'], c: 0, e: 'Protege tu cuenta.' }
      ],
      ficha: ['Alto riesgo y mucha variación', 'Stablecoins ≈ dólar', 'Exchange registrado como PSAV en la CNV', 'Verificación en dos pasos']
    }
  ]
};

export const INV_MODULES: Module[] = [BASE, PESOS, MERCADO];
