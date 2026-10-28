/* Misiones: cada una lleva de una situación concreta a un resultado que la persona se lleva.
   Los pasos usan herramientas y lecciones que ya existen. Cuando la app puede saber sola que un paso
   está hecho, lo marca (done); si no, la persona lo marca con "Ya lo hice" (manual). */
import type { Data } from '../store';
import { calc, W, taPlanProg } from '../features/finanzas/calc';
import { estados, mesKey } from '../features/finanzas/vencimientos';
import { ALL_MODULES, modPath } from './learn';
import { money, pn, fmt } from '../lib/format';

export type Area = 'plata' | 'tramites' | 'celular' | 'bienestar';
export const AREAS: Record<Area, string> = { plata: 'Plata', tramites: 'Trámites', celular: 'Celular', bienestar: 'Salud y bienestar' };

export type Paso = { id: string; t: string; s: string; go: string; done?: (d: Data) => boolean };
export type Resultado = { big?: string; t: string; s?: string };
export type Mision = {
  id: string; area: Area; t: string; para: string; tendras: string; min: number;
  pasos: Paso[]; res: (d: Data) => Resultado; solo?: (d: Data) => boolean;
};

/** Ruta de una lección por su id, esté en el módulo que esté */
export function lec(id: string) {
  const m = ALL_MODULES.find((x) => x.lessons.some((l) => l.id === id));
  return m ? modPath(m) + '/' + id : '/digital';
}
const hecha = (id: string) => (d: Data) => !!d.md.lec[id]?.done;
const tit = (id: string) => ALL_MODULES.flatMap((m) => m.lessons).find((l) => l.id === id)?.t || 'Lección';
const leccion = (id: string, s = 'Lección con video y práctica'): Paso => ({ id, t: tit(id), s, go: lec(id), done: hecha(id) });

export const MISIONES: Mision[] = [
  {
    id: 'plata-mes', area: 'plata', t: '¿Me alcanza la plata del mes?', min: 10,
    para: 'Para vos si no sabés bien cuánto te queda a fin de mes.',
    tendras: 'Tu número del mes y una idea concreta para mejorarlo.',
    pasos: [
      { id: 'ing', t: 'Anotá lo que entra por mes', s: 'Ingresos de todo tipo', go: '/finanzas/plata/numeros/0', done: (d) => calc(d).ing > 0 },
      { id: 'gas', t: 'Anotá lo que gastás', s: 'Vivienda, comida, salud, servicios…', go: '/finanzas/plata/numeros/1', done: (d) => calc(d).gas > 0 },
      { id: 'aho', t: 'Sumá tus ahorros', s: 'Plazo fijo, cuentas, efectivo y dólares', go: '/finanzas/plata/numeros/2', done: (d) => calc(d).ahoARS > 0 },
      { id: 'ver', t: 'Mirá tu resultado', s: 'Cuánto te sobra o te falta, y tu colchón', go: '/finanzas/plata/resultado' }
    ],
    res: (d) => {
      const c = calc(d);
      if (c.brecha >= 0) return { big: money(c.brecha), t: 'te sobran cada mes', s: `Una idea: el día que cobrás, separá ${money(Math.round(c.brecha * 0.2 / 1000) * 1000)} para tu meta de ahorro antes de gastar.` };
      return { big: money(-c.brecha), t: 'te faltan cada mes', s: 'Una idea: mirá qué gasto podés achicar, o si podés sumar un ingreso con lo que sabés (misión "Quiero un ingreso extra").' };
    }
  },
  {
    id: 'recargos', area: 'plata', t: 'No quiero pagar recargos', min: 10,
    para: 'Para vos si alguna vez se te pasó un vencimiento.',
    tendras: 'Todos tus pagos del mes ordenados, con aviso en tu calendario.',
    pasos: [
      { id: 'cargar', t: 'Anotá lo que pagás cada mes', s: 'Luz, gas, tarjeta, obra social…', go: '/finanzas/vencimientos', done: (d) => d.venc.items.filter((x) => x.n).length >= 2 },
      { id: 'avisos', t: 'Agregá los avisos a tu calendario', s: 'Te avisa el día anterior, a las 9', go: '/finanzas/vencimientos' },
      { id: 'marcar', t: 'Marcá lo que ya pagaste este mes', s: 'Así ves cuánto te falta', go: '/finanzas/vencimientos', done: (d) => Object.keys(d.venc.pagos[mesKey()] || {}).length > 0 }
    ],
    res: (d) => {
      const E = estados(d), pend = E.filter((e) => !e.pagado), falta = pend.reduce((t, e) => t + e.m, 0);
      return pend.length ? { big: money(falta), t: `te falta pagar este mes, en ${pend.length} ${pend.length === 1 ? 'pago' : 'pagos'}`, s: `El próximo: ${pend[0].n}, ${pend[0].txt.toLowerCase()}.` } : { big: 'Al día', t: 'pagaste todo lo de este mes' };
    }
  },
  {
    id: 'cuotas', area: 'plata', t: '¿Lo compro en cuotas o al contado?', min: 5,
    para: 'Para vos si te ofrecen cuotas y no sabés si te conviene.',
    tendras: 'La respuesta con la cuenta hecha, antes de comprar.',
    pasos: [{ id: 'cuenta', t: 'Hacé la cuenta con tu compra', s: 'Precio de contado, cuotas e inflación', go: '/finanzas/cuotas' }],
    res: () => ({ t: 'Ya sabés comparar', s: 'Cada vez que te ofrezcan cuotas, volvé a la cuenta: tarda un minuto.' })
  },
  {
    id: 'ahorros', area: 'plata', t: 'Mis ahorros pierden contra los precios', min: 25,
    para: 'Para vos si tenés ahorros quietos y sentís que valen cada vez menos.',
    tendras: 'Una comparación con las tasas que te ofrecen hoy, y qué preguntar en tu banco.',
    pasos: [
      { id: 'inf', t: 'Mirá cuánto pierden con la inflación', s: 'Simulador con tus números', go: '/finanzas/plata/inflacion' },
      leccion('inv-pf', 'Qué es y cómo funciona'),
      leccion('inv-rinde', 'Billeteras que pagan por tener la plata'),
      { id: 'comparar', t: 'Compará con tus tasas', s: 'Las que te ofrecen tu banco y tu billetera', go: '/inversiones/calculadora' }
    ],
    res: () => ({ t: 'Ya sabés comparar dónde rinde más tu plata', s: 'La decisión es tuya: consultá en tu banco o tu billetera antes de mover tus ahorros.' })
  },
  {
    id: 'grande', area: 'plata', t: 'Me entró una plata grande', min: 15,
    para: 'Para vos si cobraste una indemnización, una herencia o vendiste algo.',
    tendras: 'Un plan de reparto por escrito, sin apuro.',
    pasos: [
      { id: 'monto', t: 'Escribí el monto', s: 'Y en cuántos meses lo querés usar', go: '/finanzas/plata/grande', done: (d) => pn(d.plata.grande.monto) > 0 },
      { id: 'partes', t: 'Repartilo en partes', s: 'Colchón, gastos previstos, proyectos', go: '/finanzas/plata/grande', done: (d) => d.plata.grande.proy.some((x) => pn(x.m) > 0) },
      leccion('inv-antes', 'Antes de decidir nada')
    ],
    res: (d) => ({ big: money(pn(d.plata.grande.monto)), t: 'repartidos en un plan', s: 'Si algo cambia, volvé a mover las partes: el plan se ajusta solo.' })
  },
  {
    id: 'ingreso', area: 'plata', t: 'Quiero un ingreso extra', min: 40,
    para: 'Para vos si querés ganar plata con lo que sabés hacer.',
    tendras: 'Tu oferta, tu precio y un plan de 30 días.',
    pasos: [
      { id: 'perfil', t: 'Contá lo que sabés y lo que tenés', s: 'Experiencia, tiempo y recursos', go: '/finanzas/talento/perfil', done: (d) => d.ta.done },
      { id: 'elegir', t: 'Elegí una oportunidad', s: 'Con motivos y riesgos de cada una', go: '/finanzas/talento/ideas', done: (d) => !!d.ta.sel },
      { id: 'oferta', t: 'Armá tu oferta', s: 'Qué ofrecés, a quién y cómo cobrás', go: '/finanzas/talento/oferta', done: (d) => !!(W(d)?.of.quien || W(d)?.of.problema) },
      { id: 'precio', t: 'Poné tu precio', s: 'Con todos los costos a la vista', go: '/finanzas/talento/precio', done: (d) => pn(W(d)?.of.precio) > 0 },
      { id: 'plan', t: 'Empezá tu plan de 30 días', s: 'Tareas cortas por semana', go: '/finanzas/talento/plan', done: (d) => taPlanProg(d).t > 0 }
    ],
    res: (d) => { const w = W(d); return { big: pn(w?.of.precio) > 0 ? money(pn(w?.of.precio)) : undefined, t: w ? w.of.que : 'Tu oferta', s: 'Las estimaciones son orientativas: no garantizan ingresos.' }; }
  },
  {
    id: 'anses', area: 'tramites', t: 'Tengo que ir a ANSES o PAMI', min: 20,
    para: 'Para vos si tenés que hacer un trámite y no querés ir dos veces.',
    tendras: 'Tu hoja de consulta con documentos y preguntas, lista para llevar.',
    pasos: [
      { id: 'sit', t: 'Contá tu situación', s: 'Así te mostramos solo lo que te sirve', go: '/finanzas/tramites/situacion', done: (d) => !!d.tr.sit.sit },
      { id: 'prep', t: 'Prepará tu consulta', s: 'Documentos, datos y preguntas', go: '/finanzas/tramites/preparar' },
      { id: 'docs', t: 'Revisá qué documentos tenés', s: 'Qué tenés y qué te falta', go: '/finanzas/tramites/docs', done: (d) => Object.keys(d.tr.docs).length > 0 },
      { id: 'turno', t: 'Sacá turno', s: 'Paso a paso, con la fuente oficial', go: '/finanzas/tramites/guia/turno' }
    ],
    res: (d) => ({ big: String(Object.keys(d.tr.docs).length), t: Object.keys(d.tr.docs).length === 1 ? 'documento listo' : 'documentos listos', s: 'Llevá la hoja impresa o en el celular. Esta app orienta: los requisitos los define el organismo.' })
  },
  {
    id: 'videollamada', area: 'celular', t: 'Quiero ver a mi familia por videollamada', min: 10,
    para: 'Para vos si te gustaría ver a tus hijos, nietos o amigos mientras hablan.',
    tendras: 'Tu primera videollamada hecha.',
    pasos: [leccion('wa-video'), { id: 'real', t: 'Hacé una videollamada de verdad', s: 'Con alguien de confianza que sepa que lo vas a llamar', go: lec('wa-video') }],
    res: () => ({ t: 'Ya hablás por videollamada', s: 'Si algo falla, la lección queda guardada para repasar.' })
  },
  {
    id: 'pagar', area: 'celular', t: 'Me da miedo pagar con el celular', min: 30,
    para: 'Para vos si no te animás a pagar con QR o a transferir.',
    tendras: 'Tu primer pago hecho, sin errores y con los cuidados claros.',
    pasos: [leccion('pay-billetera'), leccion('pay-qr'), leccion('pay-transfer'), leccion('pay-cuidados'),
      { id: 'real', t: 'Hacé un primer pago chico', s: 'Un café o una carga de la SUBE', go: lec('pay-qr') }],
    res: () => ({ t: 'Ya pagás con el celular', s: 'Antes de cada pago: revisá el nombre de quien cobra y el monto.' })
  },
  {
    id: 'mensaje', area: 'celular', t: 'Me llegó un mensaje raro', min: 10,
    para: 'Para vos si dudás de un mensaje, un llamado o un correo.',
    tendras: 'La respuesta en un minuto, y las 3 reglas que frenan casi todas las estafas.',
    pasos: [
      { id: 'analizar', t: 'Pegá el mensaje en el analizador', s: 'Te marca las señales de alerta', go: '/digital/escudo/analizador', done: (d) => d.escudo.analisis > 0 },
      { id: 'practicar', t: 'Practicá con 3 situaciones', s: 'Simulador de estafas reales', go: '/digital/escudo/simulador', done: (d) => Object.keys(d.escudo.vistos).length >= 3 },
      { id: 'reglas', t: 'Aprendé las 3 reglas', s: 'Las que frenan casi todo', go: '/digital/escudo' }
    ],
    res: (d) => ({ big: String(Object.keys(d.escudo.vistos).length), t: 'situaciones practicadas', s: 'Ante la duda: no toques links, no des códigos y llamá vos al número oficial.' })
  },
  {
    id: 'papel', area: 'celular', t: 'No entiendo una carta o un papel', min: 20,
    para: 'Para vos si te llega una carta, un resumen o un contrato difícil de leer.',
    tendras: 'Ese papel explicado en simple, con la inteligencia artificial.',
    pasos: [leccion('ia-empezar'), leccion('ia-fotos'), leccion('ia-docs'), { id: 'real', t: 'Probá con un papel tuyo', s: 'Sacale una foto y preguntá qué dice', go: lec('ia-docs') }],
    res: () => ({ t: 'Ya podés entender cualquier papel', s: 'No compartas en la IA números de documento, claves ni datos de tarjetas.' })
  },
  {
    id: 'fotos', area: 'celular', t: 'Que no se pierdan mis fotos', min: 10,
    para: 'Para vos si tenés fotos que no querés perder si se rompe el celular.',
    tendras: 'La copia de seguridad activada.',
    pasos: [leccion('g-fotos-copia'), { id: 'real', t: 'Activá la copia en tu celular', s: 'Y fijate que diga "Copia de seguridad completa"', go: lec('g-fotos-copia') }],
    res: () => ({ t: 'Tus fotos están a salvo', s: 'Si cambiás de celular, entrás con la misma cuenta y aparecen todas.' })
  },
  {
    id: 'salud', area: 'bienestar', t: 'Quiero mis datos de salud a mano', min: 5,
    para: 'Para vos si en una consulta o una guardia te cuesta acordarte de todo.',
    tendras: 'Tu ficha lista para mostrar o imprimir.',
    pasos: [
      { id: 'meds', t: 'Anotá medicamentos y alergias', s: 'Lo más importante en una urgencia', go: '/salud', done: (d) => d.salud.meds.some((m) => m.n) || !!d.salud.alergias },
      { id: 'cont', t: 'A quién avisar', s: 'Uno o dos contactos', go: '/salud', done: (d) => d.salud.contactos.some((c) => c.n) },
      { id: 'guardar', t: 'Guardala o imprimila', s: 'Para tenerla en la cartera o la heladera', go: '/salud' }
    ],
    res: (d) => ({ big: String(d.salud.meds.filter((m) => m.n).length), t: d.salud.meds.filter((m) => m.n).length === 1 ? 'medicamento anotado' : 'medicamentos anotados', s: 'Revisala cuando cambie algún tratamiento.' })
  },
  {
    id: 'etapa', area: 'bienestar', t: 'Me cuesta esta etapa', min: 15, solo: (d) => d.perfil.sexo === 'mujer',
    para: 'Para vos si sentís que tu cuerpo y tu forma de verte cambiaron.',
    tendras: 'Un programa de 30 días en marcha, a tu ritmo.',
    pasos: [
      { id: 'leer', t: 'Leé la primera parte del libro', s: 'Entender los cambios', go: '/libro' },
      { id: 'dia1', t: 'Hacé el día 1 del cuaderno', s: 'Un ejercicio corto', go: '/libro', done: (d) => Object.keys(d.libro.dias).length > 0 }
    ],
    res: (d) => ({ big: `Día ${Math.min(Object.keys(d.libro.dias).length + 1, 30)}`, t: 'de 30', s: 'Sin apuro: cada día funciona por separado.' })
  }
];

export const MISION = (id: string) => MISIONES.find((m) => m.id === id);
export const misionesPara = (d: Data) => MISIONES.filter((m) => !m.solo || m.solo(d));

/** Estado de cada paso: hecho si la app lo detecta o si la persona lo marcó */
export function pasoHecho(d: Data, m: Mision, p: Paso) { return !!d.mis.ck[m.id + ':' + p.id] || !!p.done?.(d); }
export function progresoMision(d: Data, m: Mision) {
  const n = m.pasos.filter((p) => pasoHecho(d, m, p)).length;
  return { n, t: m.pasos.length, fin: n === m.pasos.length, empezada: n > 0 || !!d.mis.ck[m.id + ':_'] };
}
export const minutos = (m: Mision) => (m.min < 60 ? `${m.min} min` : `${fmt(m.min / 60, 1)} h`);
