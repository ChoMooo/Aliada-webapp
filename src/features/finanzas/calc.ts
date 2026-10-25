import { pn, uid, money } from '../../lib/format';
import type { Data } from '../../store';
import { GUIA, DOCS, OP, OPS, SK_N, EX_N, GU_N, REC_N, HRS } from '../../content/finanzas';

/* ===================== MI PLATA ===================== */
export function calc(d: Data) {
  const P = d.plata, sum = (a: any[]) => a.reduce((t, x) => t + pn(x.m), 0);
  const ing = sum(P.ing), gas = sum(P.gas), cot = pn(P.cot);
  const A = P.ah || { pf: '', cu: '', ef: '', usd: '' };
  const usdOtros = P.aho.filter((x) => x.mon === 'USD').reduce((t, x) => t + pn(x.m), 0);
  const ahoParts = {
    pf: Math.max(pn(A.pf), 0), cu: Math.max(pn(A.cu), 0), ef: Math.max(pn(A.ef), 0),
    usd: Math.max(pn(A.usd), 0), usdARS: Math.max(pn(A.usd), 0) * cot,
    otros: P.aho.reduce((t, x) => t + (x.mon === 'USD' ? pn(x.m) * cot : pn(x.m)), 0)
  };
  const ahoARS = ahoParts.pf + ahoParts.cu + ahoParts.ef + ahoParts.usdARS + ahoParts.otros;
  const deu = sum(P.deu), neto = ahoARS - deu, brecha = ing - gas, gastoNeto = Math.max(gas - ing, 0);
  const anios = gastoNeto > 0 ? Math.max(neto, 0) / (gastoNeto * 12) : null;
  return { ing, gas, cot, ahoARS, ahoParts, deu, neto, brecha, gastoNeto, anios, has: ing > 0 || gas > 0,
    usdSinCot: (ahoParts.usd > 0 || usdOtros > 0) && cot <= 0 };
}
export type Calc = ReturnType<typeof calc>;

export function simInf(d: Data) {
  const c = calc(d), I = d.plata.inf;
  const gas = I.gas !== '' ? pn(I.gas) : c.gas, ing = I.ing !== '' ? pn(I.ing) : c.ing, aho = I.aho !== '' ? pn(I.aho) : Math.max(c.neto, 0);
  const inf = pn(I.inf) / 100, aum = pn(I.aum) / 100, N = Math.max(1, Math.min(30, Math.round(pn(I.anios) || 10)));
  const rows: { y: number; gas: number; ing: number; aho: number; raw: number }[] = [{ y: 0, gas, ing, aho, raw: aho }];
  let out: number | null = null, a = aho;
  for (let y = 1; y <= N; y++) {
    const g = gas * Math.pow(1 + inf, y), i = ing * Math.pow(1 + aum, y), prev = a;
    a = a + (i - g) * 12;
    if (out == null && a < 0) out = y - 1 + prev / (prev - a);
    rows.push({ y, gas: g, ing: i, aho: Math.max(a, 0), raw: a });
  }
  return { rows, out, N, gas, ing, aho, poder: ing * Math.pow((1 + aum) / (1 + inf), N) };
}

/* ===================== MIS TRÁMITES ===================== */
export const SIT = [
  ['nada', 'Todavía no empecé a preparar mi jubilación', 'Quiero saber por dónde empezar'],
  ['docs', 'Estoy reuniendo documentación', 'Quiero ordenar lo que tengo y lo que falta'],
  ['inicio', 'Ya inicié un trámite', 'Quiero seguirlo y no perder el hilo'],
  ['jub', 'Ya estoy jubilado/a y necesito otra gestión', 'Salud, cobro, trabajo u otros temas']
] as const;
export const SIT_N: Record<string, string> = Object.fromEntries(SIT.map((s) => [s[0], s[1]]));

export type Item = { type: 'a' | 'd' | 'p'; k: string; t: string; c?: string; done: boolean };
export function gItems(d: Data, g: any): Item[] {
  const T = d.tr, o: Item[] = [];
  g.antes.forEach((t: string, i: number) => o.push({ type: 'a', k: 'a' + i, t, done: !!T.ck[g.id + '.a' + i] }));
  g.docs.forEach((x: any) => o.push({ type: 'd', k: x.id, t: DOCS[x.id], c: x.c, done: !!T.docs[x.id] }));
  g.pasos.forEach((t: string, i: number) => o.push({ type: 'p', k: 'p' + i, t, done: !!T.ck[g.id + '.p' + i] }));
  return o;
}
export function gProg(d: Data, g: any) { const it = gItems(d, g); return { n: it.filter((x) => x.done).length, t: it.length, items: it }; }
export function plan(d: Data) {
  const T = d.tr.sit, s = T.sit, edad = pn(T.edad), ap = T.aportes, L: { id: string; why: string }[] = [];
  const add = (id: string, why: string) => { if (!L.some((x) => x.id === id)) L.push({ id, why }); };
  const faltaAp = ap && ap !== '30', apNS = !ap || ap === 'ns';
  const cuidado = (T.sexo === 'F' || T.sexo === 'X' || !T.sexo) && T.hijos !== 'no';
  const puam = edad >= 65 && (ap === 'lt10' || ap === '10' || ap === 'ns');
  if (s === 'nada') {
    add('claves', 'Con tu acceso hacés casi todo desde el celular, sin viajar.');
    add('historia', 'Es lo primero: saber qué aportes figuran a tu nombre.');
    add('jubilacion', 'Para entender requisitos y cómo se inicia, sin apuro.');
    if (faltaAp || apNS) add('faltan', apNS ? 'Para saber qué preguntar si te faltaran aportes.' : 'Marcaste menos de 30 años de aportes.');
    if (cuidado) add('cuidado', 'Puede sumar años si criaste hijos o hijas.');
    if (puam) add('puam', 'Tenés 65 años o más: conviene conocerla.');
    add('pami', 'Para conocer tu cobertura de salud futura.');
  } else if (s === 'docs') {
    add('historia', 'Confirmá qué períodos faltan antes de pedir turno.');
    add('jubilacion', 'Tu lista de documentación está acá.');
    if (cuidado) add('cuidado', 'Si tenés hijos o hijas, reuní también sus partidas.');
    if (faltaAp || apNS) add('faltan', 'Ordená tus opciones si te faltan aportes.');
    if (puam) add('puam', 'Tenés 65 años o más: conviene conocerla.');
    add('claves', 'Necesitás tu acceso para verificar y sacar turno.');
    add('turno', 'Cuando tengas todo, reservá tu turno.');
  } else if (s === 'inicio') {
    add('seguimiento', 'Para saber en qué etapa está tu expediente.');
    add('turno', 'Si necesitás otro turno o querés cancelar uno.');
    add('pami', 'Para tener lista tu cobertura de salud.');
    add('claves', 'Sin tu acceso no podés seguir el trámite.');
    add('historia', 'Por si hay que presentar comprobantes.');
  } else if (s === 'jub') {
    add('seguimiento', 'Cobro, recibo y estado de gestiones.');
    add('pami', 'Médico de cabecera y medicamentos.');
    add('trabajar', 'Si querés generar ingresos extra.');
    add('claves', 'Tu acceso para gestiones por internet.');
    add('turno', 'Para trámites presenciales.');
  }
  return L;
}
export function tramSiguiente(d: Data) {
  for (const e of plan(d)) {
    const g = GUIA(e.id), it = gProg(d, g).items.find((x) => !x.done);
    if (it) return { g, it, txt: ({ a: 'Antes de empezar: ', d: 'Reuní: ', p: 'Paso: ' } as any)[it.type] + it.t };
  }
  return null;
}
export function progresoTram(d: Data) {
  let n = 0, t = 0;
  plan(d).forEach((e) => { const p = gProg(d, GUIA(e.id)); n += p.n; t += p.t; });
  return { n, t, pend: d.tr.notas.filter((x) => !x.ok).length };
}
export function consultaTexto(d: Data, g: any) {
  const L = ['PARA MI CONSULTA · ' + g.org, g.t, new Date().toLocaleDateString('es-AR'), '', 'Llevo:'];
  gItems(d, g).filter((x) => x.type === 'd').forEach((x) => L.push((x.done ? '[x] ' : '[ ] ') + x.t));
  if (g.datos.length) { L.push('', 'Datos para tener a mano:'); g.datos.forEach((x: string) => L.push('• ' + x)); }
  L.push('', 'Preguntas:');
  (d.tr.preg[g.id] || g.preg.map((t: string) => ({ t, ok: false }))).forEach((q: any) => L.push((q.ok ? '[x] ' : '[ ] ') + q.t));
  const r = d.tr.resp[g.id]; if (r) L.push('', 'Lo que me respondieron:', r);
  return L.join('\n');
}

/* ===================== MI TALENTO ===================== */
export function wDefault(op: any, nombre: string) {
  return {
    of: { que: op.n, quien: '', problema: '', difer: [] as string[], diferTxt: '', cobro: '', precio: '', pago: '', zona: '', disp: '', plazo: '', nombre: nombre || '' },
    pr: { vh: '', h1: '', h2: '', h3: '', h4: '', mats: op.costos.map((n: string) => ({ id: uid(), n, m: '' })), fijos: [] as any[], cant: '', imp: '', imprev: '10', ref: [] as any[] },
    mat: {} as Record<string, string>, plan: { on: false, tasks: [] as any[] }, seg: { cont: '', cons: '', trab: '', ing: '', nota: '' }
  };
}
export type Work = ReturnType<typeof wDefault>;
export const W = (d: Data): Work | null => (d.ta.sel && d.ta.w[d.ta.sel] ? d.ta.w[d.ta.sel] : null);

export const perfilVacio = (d: Data) => {
  const P = d.ta.P;
  return !(P.ex.length || P.sk.length || P.gu.length || P.rec.length || P.exTxt || P.ayuda || P.tiempo || P.amb || P.net !== '' || P.inv !== '' || P.trato !== '' || P.fis !== '');
};
const names = (arr: string[], M: Record<string, string>) => arr.map((k) => M[k]).filter(Boolean);
export function evalOp(o: any, P: Data['ta']['P']) {
  let s = 0; const why: string[] = [], risk: string[] = [];
  const sk = o.sk.filter((x: string) => P.sk.includes(x)); if (sk.length) { s += 3 * sk.length; why.push('Usás lo que sabés hacer: ' + names(sk, SK_N).join(', ').toLowerCase()); }
  const ex = o.ex.filter((x: string) => P.ex.includes(x)); if (ex.length) { s += 2 * ex.length; why.push('Aprovecha tu experiencia en ' + names(ex, EX_N).slice(0, 2).join(' y ').toLowerCase()); }
  const gu = o.gu.filter((x: string) => P.gu.includes(x)); if (gu.length) { s += 1.5 * gu.length; why.push('Va con lo que disfrutás: ' + names(gu, GU_N).slice(0, 2).join(', ').toLowerCase()); }
  if (P.rec.length) {
    const have = o.rec.filter((x: string) => P.rec.includes(x)), miss = o.rec.filter((x: string) => !P.rec.includes(x));
    if (have.length) { s += 2 * have.length; why.push('Ya contás con: ' + names(have, REC_N).join(', ').toLowerCase()); }
    if (miss.length) { s -= miss.length; risk.push('Te faltaría: ' + names(miss, REC_N).join(', ').toLowerCase()); }
  }
  if (P.amb && P.amb !== '*') {
    if (o.amb === P.amb) { s += 2; why.push(o.amb === 'h' ? 'Se hace desde tu casa' : o.amb === 'o' ? 'Se hace por internet' : 'Se hace saliendo, como preferís'); }
    else if (o.amb !== 's' && P.amb !== 's') s += 1;
    else { s -= 3; risk.push(o.amb === 's' ? 'Implica salir de casa y hacerlo presencial' : 'Se hace principalmente desde casa o por internet'); }
  }
  if (P.net !== '' && o.net > +P.net) { s -= 4; risk.push('Pide más manejo de internet del que indicaste'); }
  if (P.fis !== '' && o.fis > +P.fis) { s -= 3 * (o.fis - +P.fis); risk.push('Exige más esfuerzo físico del que indicaste'); }
  if (P.trato === '0' && o.trato === 1) { s -= 2; risk.push('Implica tratar con bastante gente'); }
  if (P.trato === '1' && o.trato === 1) s += 1;
  if (P.inv !== '') { if (o.inv > +P.inv) { s -= 3 * (o.inv - +P.inv); risk.push('Requiere más inversión inicial de la que indicaste'); } else { s += 1; why.push('Entra en tu inversión inicial'); } }
  if (P.tiempo && o.hs > HRS[P.tiempo]) { s -= 2; risk.push('Suele pedir unas ' + o.hs + ' h por semana y indicaste unas ' + HRS[P.tiempo]); }
  return { o, s, why, risk, base: sk.length + ex.length + gu.length };
}
export type Ev = ReturnType<typeof evalOp>;
export function ranking(d: Data) {
  const r = OPS.map((o) => evalOp(o, d.ta.P));
  if (perfilVacio(d)) return r;
  return r.filter((x) => x.base > 0).sort((a, b) => b.s - a.s);
}
export const nivel = (s: number): [string, 'ok' | 'sky' | 'neutral'] => (s >= 12 ? ['Muy buena coincidencia', 'ok'] : s >= 7 ? ['Buena coincidencia', 'sky'] : ['Posible', 'neutral']);

export function precioCalc(w: Work | null) {
  if (!w) return null;
  const P = w.pr, sum = (a: any[]) => a.reduce((t, x) => t + Math.max(pn(x.m), 0), 0);
  const vh = Math.max(pn(P.vh), 0), hs = [P.h1, P.h2, P.h3, P.h4].reduce((t, x) => t + Math.max(pn(x), 0), 0);
  const mat = sum(P.mats), fij = sum(P.fijos), cant = Math.max(pn(P.cant), 0), impRaw = pn(P.imp);
  const imp = Math.min(Math.max(impRaw, 0), 90) / 100, ip = Math.max(pn(P.imprev), 0) / 100;
  const mano = hs * vh, fu = cant > 0 ? fij / cant : 0, base = mano + mat + fu, conI = base * (1 + ip), precio = conI / (1 - imp), redo = Math.ceil(precio / 50) * 50;
  const margen = precio * (1 - imp) - mat, neto = cant * margen - fij, equil = margen > 0 && fij > 0 ? Math.ceil(fij / margen) : 0;
  const refs = P.ref.map((x: any) => pn(x.m)).filter((x: number) => x > 0);
  return { vh, hs, mat, fij, cant, imp, impRaw, ip, mano, fu, base, conI, precio, redo, margen, neto, equil, refs, ok: vh > 0 && hs > 0 };
}
export function taPlanProg(d: Data) { const w = W(d); if (!w || !w.plan.on) return { n: 0, t: 0 }; const t = w.plan.tasks; return { n: t.filter((x: any) => x.ok).length, t: t.length }; }
export function taSiguiente(d: Data): { txt: string; go: string } | null {
  if (!d.ta.done) return { txt: 'Completá tu perfil para recibir oportunidades pensadas para vos', go: '/finanzas/talento/perfil' };
  const w = W(d);
  if (!w) return { txt: 'Elegí una de tus oportunidades', go: '/finanzas/talento/ideas' };
  if (!w.of.quien || !w.of.cobro) return { txt: 'Definí tu oferta: a quién y cómo cobrás', go: '/finanzas/talento/oferta' };
  if (!precioCalc(w)!.ok) return { txt: 'Calculá tu precio inicial', go: '/finanzas/talento/precio' };
  if (!w.plan.on) return { txt: 'Generá tu plan de 30 días', go: '/finanzas/talento/plan' };
  const t = w.plan.tasks.filter((x: any) => !x.ok).sort((a: any, b: any) => a.w - b.w)[0];
  if (t) return { txt: 'Semana ' + t.w + ': ' + t.t, go: '/finanzas/talento/plan' };
  return { txt: 'Registrá tus resultados y decidí cómo seguir', go: '/finanzas/talento/seguimiento' };
}

export const DIFER = ['Trato cercano y paciente', 'Puntualidad', 'Años de experiencia', 'Hecho a mano o casero', 'Atención personalizada', 'Cerca de tu casa', 'Horarios flexibles', 'Referencias de conocidos'].map((x) => [x, x] as [string, string]);
export const COBRO: [string, string][] = [['unidad', 'Por servicio o unidad'], ['hora', 'Por hora'], ['abono', 'Abono mensual'], ['pack', 'Pack de varios']];
export const PAGO: [string, string][] = [['Efectivo', 'Efectivo'], ['Transferencia', 'Transferencia'], ['Billetera virtual', 'Billetera virtual'], ['Seña y saldo al entregar', 'Seña y saldo']];

export function ofertaFrase(w: Work) {
  const f = w.of, dd = f.difer.concat(f.diferTxt ? [f.diferTxt] : []);
  return `Ofrezco ${f.que || '[qué ofrezco]'} a ${f.quien || '[tipo de cliente]'}${f.problema ? ', para ' + f.problema : ''}.${dd.length ? ' Me diferencio por: ' + dd.join(', ').toLowerCase() + '.' : ''} ${f.cobro ? 'Cobro ' + (COBRO.find((c) => c[0] === f.cobro) || ['', ''])[1].toLowerCase() : ''}${pn(f.precio) > 0 ? ' desde ' + money(pn(f.precio)) : ''}.`;
}
export function ofertaPct(w: Work) {
  const f = w.of;
  return Math.round([f.que, f.quien, f.problema, f.difer.length || f.diferTxt, f.cobro, pn(f.precio) > 0, f.zona || f.disp].filter(Boolean).length / 7 * 100);
}
export const MATS: [string, string][] = [['propuesta', 'Propuesta'], ['presupuesto', 'Presupuesto'], ['lista', 'Lista'], ['mensaje', 'Mensajes'], ['faq', 'Preguntas']];
export function matGen(w: Work, opId: string, k: string) {
  const o = OP(opId), f = w.of, pr = pn(f.precio), P = (v: string) => v || '[completar]';
  const sub = (t: string) => t.replace(/\{precio\}/g, pr > 0 ? money(pr) : '[precio]').replace(/\{zona\}/g, f.zona || '[zona]').replace(/\{disp\}/g, f.disp || '[días y horarios]').replace(/\{pedido\}/g, f.plazo || '[plazo]');
  const dif = f.difer.concat(f.diferTxt ? [f.diferTxt] : []);
  const clean = (e: string) => e.replace(/[“”"]/g, '');
  if (k === 'propuesta') return `PROPUESTA${f.nombre ? ' · ' + f.nombre : ''}\n\nQué ofrezco: ${P(f.que)}\nPara: ${P(f.quien)}\nProblema que resuelvo: ${P(f.problema)}\nPor qué elegirme: ${dif.length ? dif.join(', ') : '[completar]'}\n\nCómo trabajo: ${(COBRO.find((c) => c[0] === f.cobro) || [0, '[forma de cobro]'])[1]}${pr > 0 ? ' · ' + money(pr) : ''}\nZona: ${P(f.zona)}\nDisponibilidad: ${P(f.disp)}\nPlazo: ${P(f.plazo)}\nFormas de pago: ${P(f.pago)}\n\nContacto: ______________________`;
  if (k === 'presupuesto') return `PRESUPUESTO\nFecha: ${new Date().toLocaleDateString('es-AR')}\nCliente: ____________________\n\nServicio: ${P(f.que)}\nIncluye:\n${o.ej.slice(0, 2).map((e: string) => '• ' + clean(e)).join('\n')}\n\nPrecio: ${pr > 0 ? money(pr) : '$ ________'}\nSeña: $ ________\nValidez: 15 días\nForma de pago: ${f.pago || 'a acordar'}\nPlazo: ${P(f.plazo)}\n\n${f.nombre || ''}`;
  if (k === 'lista') return `LISTA DE SERVICIOS${f.nombre ? ' · ' + f.nombre : ''}\n\n${o.ej.map((e: string) => '• ' + clean(e) + '  —  $ ______').join('\n')}\n${pr > 0 ? '\nPrecio base: ' + money(pr) + ' ' + o.uni : ''}\nZona: ${P(f.zona)}\nDisponibilidad: ${P(f.disp)}`;
  if (k === 'mensaje') return `MENSAJE PARA CONSULTAR (semana 1)\nHola, ¿cómo estás? Estoy pensando en ofrecer ${P(f.que)}. Quería preguntarte: ${o.valida} Tu opinión me ayuda mucho. ¡Gracias!\n\nMENSAJE PARA OFRECER\nHola, ¿cómo estás? Soy ${P(f.nombre)}. Ofrezco ${P(f.que)}${f.quien ? ' para ' + f.quien : ''}${f.zona ? ' en ' + f.zona : ''}.${pr > 0 ? ' El valor es ' + money(pr) + '.' : ''} Si querés, te cuento más o coordinamos. ¡Gracias!`;
  return o.faq.map((q: string[]) => 'P: ' + q[0] + '\nR: ' + sub(q[1])).join('\n\n');
}
export function genPlan(opId: string, tiempo: string) {
  const o = OP(opId), cap = Math.max(HRS[tiempo] || 10, 3);
  const base = '/finanzas/talento/';
  const T: [number, string, number, string][] = [
    [1, 'Completá tu oferta: qué ofrecés, a quién y cómo cobrás', 1.5, base + 'oferta'],
    [1, 'Calculá tu precio inicial con tus costos y tu tiempo', 1.5, base + 'precio'],
    [1, 'Hablá con 5 personas (' + o.quien[0].toLowerCase() + ') y preguntales: ' + o.valida, 3, ''],
    [1, 'Anotá lo que respondieron y qué cambiarías de tu oferta', 1, ''],
    [2, 'Hacé una prueba: ' + o.prueba, 3, ''],
    [2, 'Conseguí lo necesario: ' + o.nec.join('; '), 2, ''],
    [2, 'Prepará tu propuesta, tu presupuesto y tus mensajes', 2, base + 'materiales'],
    [2, 'Verificá antes de cobrar: ' + o.ver.slice(0, 2).join(' · '), 2, '/finanzas/tramites/guia/trabajar'],
    [3, 'Enviá tu mensaje a 10 personas. Primer camino: ' + o.cons[0], 2, base + 'materiales'],
    [3, 'Segundo camino: ' + o.cons[1], 2, ''],
    [3, 'Respondé consultas y coordiná tu primer trabajo (pedí una seña si corresponde)', 2, ''],
    [4, 'Hacé tu primer trabajo y pedí una opinión por escrito', 3, ''],
    [4, 'Compará las horas reales con las que calculaste y ajustá tu precio', 1, base + 'precio'],
    [4, 'Anotá tus resultados en Seguimiento', 1, base + 'seguimiento'],
    [4, 'Decidí: seguir, ajustar tu oferta o probar otra oportunidad', 1, base + 'comparar']
  ];
  const used: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }; let wk = 1;
  return T.map((x) => {
    let want = Math.max(x[0], wk);
    while (want < 4 && used[want] + x[2] > cap && used[want] > 0) want++;
    wk = want; used[want] += x[2];
    return { id: uid(), w: want, t: x[1], h: x[2], go: x[3], ok: false, own: false };
  });
}
