/* Entender lo que la persona dice, fotografía, comparte o importa, para que no tenga que escribirlo.
   Todo corre en el dispositivo: son reglas simples sobre texto (sin inteligencia artificial ni servidores).
   El resultado siempre es una lista de "borradores" que la persona revisa antes de guardar. */

export type Borrador = {
  id: string;
  /** Descripción: "Farmacia", "Luz" */
  n: string;
  /** Monto en pesos, siempre positivo */
  m: number;
  /** Fecha del movimiento (AAAA-MM-DD), si se conoce */
  f?: string;
  /** gasto: se suma a un rubro del mes · pago: va a Mis vencimientos (se repite todos los meses) */
  tipo: 'gasto' | 'pago';
  /** Día del mes en que vence (solo pagos) */
  dia?: number;
  /** Plata que entró (no es un gasto): viene destildado en la revisión */
  ingreso?: boolean;
};

let seq = 0;
const nid = () => 'b' + (++seq).toString(36) + Math.random().toString(36).slice(2, 6);
const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
export const isoDe = (dt: Date) => iso(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());

/* ---------- Números dichos con palabras ---------- */
const UNI: Record<string, number> = {
  cero: 0, un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
  once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19,
  veinte: 20, veintiun: 21, veintiuno: 21, veintiuna: 21, veintidos: 22, veintitres: 23, veinticuatro: 24, veinticinco: 25,
  veintiseis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29,
  treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90,
  cien: 100, ciento: 100, doscientos: 200, doscientas: 200, trescientos: 300, trescientas: 300, cuatrocientos: 400, cuatrocientas: 400,
  quinientos: 500, quinientas: 500, seiscientos: 600, seiscientas: 600, setecientos: 700, setecientas: 700,
  ochocientos: 800, ochocientas: 800, novecientos: 900, novecientas: 900
};
const esMil = (w: string) => w === 'mil';
const esMillon = (w: string) => w === 'millon' || w === 'millones' || w === 'palo' || w === 'palos';
const esLuca = (w: string) => w === 'luca' || w === 'lucas';

/** Un número escrito con cifras: "25.000", "1.500,50", "1500.50", "8500" */
export function cifra(s: string): number | null {
  let t = s.replace(/[^\d.,]/g, '');
  if (!/\d/.test(t)) return null;
  const c = t.lastIndexOf(','), p = t.lastIndexOf('.');
  if (c >= 0 && p >= 0) t = c > p ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, '');
  else if (c >= 0) t = /,\d{3}(,|$)/.test(t) && !/,\d{1,2}$/.test(t) ? t.replace(/,/g, '') : t.replace(',', '.');
  else if (p >= 0 && (/^\d{1,3}(\.\d{3})+$/.test(t) || !/\.\d{1,2}$/.test(t))) t = t.replace(/\./g, '');
  const n = parseFloat(t);
  return isFinite(n) ? n : null;
}

/** Pasa a cifras los números dichos con palabras: "veinticinco mil quinientos" → "25500", "25 mil" → "25000" */
export function numerosDichos(texto: string): string {
  const words = texto.split(/(\s+)/);
  const out: string[] = [];
  let total = 0, grupo = 0, activo = false, pend = ''; // pend: una "y" o espacios que quedan en suspenso dentro de un número
  const cerrar = () => { if (activo) { out.push(String(total + grupo)); } if (pend) out.push(pend); total = 0; grupo = 0; activo = false; pend = ''; };
  for (let i = 0; i < words.length; i++) {
    const raw = words[i];
    if (/^\s+$/.test(raw)) { if (activo) pend += raw; else out.push(raw); continue; }
    const m = raw.match(/^([^\wáéíóúñü$]*)(.*?)([^\wáéíóúñü]*)$/i)!;
    const w = sinAcentos(m[2].toLowerCase());
    const fin = m[3]; // puntuación pegada: corta el número
    let ok = true;
    if (w in UNI) {
      const v = UNI[w];
      /* "uno/una" suelto antes de una palabra común es artículo, no número ("una compra") */
      if (!activo && (w === 'un' || w === 'una' || w === 'uno')) {
        const sig = sinAcentos((words[i + 2] || '').toLowerCase().replace(/[^\wáéíóúñü]/gi, ''));
        if (!(esMil(sig) || esMillon(sig) || esLuca(sig))) ok = false;
      }
      if (ok) { grupo += v; activo = true; pend = ''; }
    } else if (/^\d[\d.,]*$/.test(w) && cifra(w) != null) {
      const sig = sinAcentos((words[i + 2] || '').toLowerCase().replace(/[^\wáéíóúñü]/gi, ''));
      /* cifras seguidas de "mil/millones/lucas" ("25 mil", "1,5 millones") o después de mil ("2 mil 500") */
      if (esMil(sig) || esMillon(sig) || esLuca(sig) || (activo && total > 0 && grupo === 0)) { grupo += cifra(w)!; activo = true; pend = ''; }
      else ok = false;
    } else if (esMil(w) || esLuca(w)) { total += (grupo || 1) * 1000; grupo = 0; activo = true; pend = ''; }
    else if (esMillon(w) && activo) { total += (grupo || 1) * 1e6; grupo = 0; pend = ''; }
    else if (w === 'medio' && esMillon(sinAcentos((words[i + 2] || '').toLowerCase()))) { grupo += 0.5; activo = true; pend = ''; }
    else if (w === 'y' && activo && !fin) { pend += raw; continue; }
    else ok = false;
    if (!ok) { cerrar(); out.push(raw); continue; }
    if (m[1] && !activo) out.push(m[1]);
    if (fin) { cerrar(); out.push(fin); }
  }
  cerrar();
  return out.join('');
}

/* ---------- Montos y fechas dentro de un texto ---------- */
export type Monto = { v: number; i: number; fin: number; fuerte: boolean; neg: boolean };
const RE_MONTO = /(-|−|–)?\s?(\$|ars|u\$s|usd)?\s?(-|−|–)?\s?(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)(-)?/gi;

/** Todos los números que parecen plata. "fuerte" = lleva signo $ o centavos (casi seguro es un monto) */
export function montos(texto: string): Monto[] {
  const out: Monto[] = [];
  for (const m of texto.matchAll(RE_MONTO)) {
    const num = m[4], v = cifra(num);
    if (v == null) continue;
    const i = m.index! + m[0].indexOf(num), fin = i + num.length;
    /* no es un monto si está pegado a letras o a una barra/guion de fecha, ni si es un número larguísimo (un código) */
    const antes = texto[i - 1] || ' ', desp = texto[fin] || ' ';
    if (/[\w/]/.test(antes) || /[\w/%]/.test(desp)) continue;
    if (/^\d+$/.test(num) && num.length > 9) continue;
    const neg = !!(m[1] || m[3] || m[5]) && !/\d/.test(antes === '-' ? texto[i - 2] || ' ' : ' ');
    out.push({ v, i, fin, fuerte: !!m[2] || /[.,]\d{2}$/.test(num), neg });
  }
  return out;
}

const MES: Record<string, number> = { ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, sep: 9, set: 9, oct: 10, nov: 11, dic: 12 };
export type Fecha = { f: string; i: number; fin: number; dia: number };
const valida = (y: number, m: number, d: number) => m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 2000 && y <= 2100;

/** Fechas dentro de un texto: 10/03/2026, 10-03-26, 10/03, 2026-03-10, "10 de marzo", "10 mar 2026" */
export function fechas(texto: string, hoy = new Date()): Fecha[] {
  const out: Fecha[] = [], t = sinAcentos(texto.toLowerCase());
  const push = (y: number, m: number, d: number, i: number, len: number) => { if (valida(y, m, d) && !out.some((o) => i < o.fin && i + len > o.i)) out.push({ f: iso(y, m, d), i, fin: i + len, dia: d }); };
  const anio = (s?: string) => (s ? (s.length === 2 ? 2000 + Number(s) : Number(s)) : hoy.getFullYear());
  for (const m of t.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)) push(+m[1], +m[2], +m[3], m.index!, m[0].length);
  for (const m of t.matchAll(/(?<![\d.,])(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{4}|\d{2}))?(?![\d,]|\.\d)/g)) push(anio(m[3]), +m[2], +m[1], m.index!, m[0].length);
  for (const m of t.matchAll(/\b(\d{1,2})\s*(?:de\s+)?(ene|feb|mar|abr|may|jun|jul|ago|sep|set|oct|nov|dic)[a-z]*\.?(?:\s*(?:de\s+)?(\d{4}))?/g)) push(anio(m[3]), MES[m[2]], +m[1], m.index!, m[0].length);
  return out.sort((a, b) => a.i - b.i);
}

/* ---------- Qué es cada cosa ---------- */
/** Servicios que se pagan todos los meses: por estas palabras reconocemos una boleta */
const SERVICIOS: [string, RegExp][] = [
  ['Luz', /\b(luz|electricidad|energia electrica|edenor|edesur|epec|edelap|edea|epe|edemsa|secheep|ute)\b/],
  ['Gas', /\b(gas natural|gas|metrogas|naturgy|camuzzi|ecogas|litoral gas|gasnor)\b/],
  ['Agua', /\b(agua|aysa|absa|aguas|ose)\b/],
  ['Internet', /\b(internet|wifi|fibra|fibertel|telecentro|flow|cablevision|iplan|antel)\b/],
  ['Celular', /\b(celular|telefono|linea movil|movistar|claro|personal|tuenti)\b/],
  ['Tarjeta de crédito', /\b(tarjeta|visa|mastercard|american express|amex|naranja|cabal)\b/],
  ['Alquiler o expensas', /\b(alquiler|expensas|consorcio)\b/],
  ['Obra social o prepaga', /\b(obra social|prepaga|osde|swiss medical|galeno|medife|sancor salud|omint)\b/],
  ['Impuestos municipales', /\b(abl|municipal|municipalidad|tasa|arba|rentas|inmobiliario|patente|agip|contribucion)\b/],
  ['Seguro', /\b(seguro|poliza|aseguradora)\b/]
];
export function servicioDe(texto: string): string | null {
  const t = sinAcentos(texto.toLowerCase());
  for (const [n, re] of SERVICIOS) if (re.test(t)) return n;
  return null;
}

/** Palabras que ayudan a adivinar el rubro del presupuesto */
const RUBROS: [RegExp, RegExp][] = [
  [/comida|super|almacen|aliment/, /\b(super|supermercado|almacen|verduleria|carniceria|panaderia|comida|mercado|coto|carrefour|dia|jumbo|disco|vea|chino|fiambreria|restaurante|restaurant|cafe|delivery|pedidosya|rappi|kiosco)\b/],
  [/salud|medic|farmac|remedio/, /\b(farmacia|farmacity|remedio|remedios|medicamento|medicamentos|medico|medica|consulta|dentista|odontologo|analisis|optica|kinesiologo|osde|prepaga|obra social)\b/],
  [/servicio|luz|gas|internet/, /\b(luz|gas|agua|internet|wifi|celular|telefono|cable|edenor|edesur|metrogas|aysa|movistar|claro|personal|telecentro|flow)\b/],
  [/transporte|nafta|auto|viaje/, /\b(nafta|combustible|sube|colectivo|bondi|tren|subte|taxi|remis|uber|cabify|didi|peaje|estacionamiento|ypf|shell|axion|pasaje)\b/],
  [/vivienda|alquiler|expensa|casa/, /\b(alquiler|expensas|consorcio|abl|inmobiliario|plomero|electricista|ferreteria|arreglo)\b/]
];
/** Rubro del presupuesto que mejor le queda a una descripción (o el que suena a "otros") */
export function rubroPara(desc: string, rubros: { id: string; n: string }[]): string {
  if (!rubros.length) return '';
  const t = sinAcentos(desc.toLowerCase());
  const directo = rubros.find((r) => { const p = sinAcentos(r.n.toLowerCase()).split(/[^a-z]+/).filter((w) => w.length > 3); return p.some((w) => new RegExp('\\b' + w).test(t)); });
  if (directo) return directo.id;
  for (const [reRubro, rePal] of RUBROS) if (rePal.test(t)) { const r = rubros.find((x) => reRubro.test(sinAcentos(x.n.toLowerCase()))); if (r) return r.id; }
  return (rubros.find((r) => /otro/.test(sinAcentos(r.n.toLowerCase()))) || rubros[rubros.length - 1]).id;
}

const mayus = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const limpiar = (s: string) => s.replace(/\s+/g, ' ').replace(/^[\s\-–—·|:;,.*]+|[\s\-–—·|:;,*]+$/g, '').trim();

/* ---------- 1. Lo dicho (o escrito) en una frase ---------- */
const RELLENO = /\b(gaste|gasto|pague|pago|pagaste|transferiste|enviaste|mandaste|compre|compra|me salio|salio|me cobraron|cobraron|fueron|fue|son|es|eran|era|de|del|en|el|la|los|las|lo|un|una|unos|unas|por|para|a|al|con|que|pesos|peso|mangos|hoy|ayer|anteayer|anoche|esta manana|recien|tambien|ademas|mas o menos|aproximadamente|como|unos|casi|mi|mis|me|le|se|vence|vencimiento|vto|todos los meses|cada mes|dia)\b/g;

/** "Farmacia ocho mil quinientos y luz 25 mil, vence el 10" → dos borradores */
export function entenderDicho(texto: string, hoy = new Date()): Borrador[] {
  const t = numerosDichos(texto.replace(/\$\s+/g, '$'));
  const trozos = t.split(/\s*[;\n]\s*|,\s+(?!vence|venci|vto)|\s+y\s+(?!vence|venci|vto)|\.\s+/i).map((s) => s.trim()).filter(Boolean);
  const out: Borrador[] = [];
  let pend = '';
  for (const trozo of trozos) {
    const plano = sinAcentos(trozo.toLowerCase());
    /* "vence el 10" · "el día 10" · "los 10": día del mes de un pago que se repite */
    const vto = plano.match(/\b(?:vence|vencimiento|vto)\b[^\d]{0,12}(\d{1,2})\b/) || plano.match(/\btodos los (\d{1,2})\b/);
    const dia = vto ? Math.min(Math.max(Number(vto[1]), 1), 31) : undefined;
    let resto = trozo;
    if (vto) { const k = plano.indexOf(vto[0]); resto = trozo.slice(0, k) + ' ' + trozo.slice(k + vto[0].length); }
    const M = montos(resto).filter((x) => x.v > 0);
    if (!M.length) { pend = (pend + ' ' + trozo).trim(); continue; }
    const mo = M.find((x) => x.fuerte) || M.reduce((a, b) => (b.v > a.v ? b : a));
    let desc = (pend + ' ' + resto.slice(0, mo.i) + ' ' + resto.slice(mo.fin)).replace(/[$]/g, ' ');
    pend = '';
    const pd = sinAcentos(desc.toLowerCase());
    let f: string | undefined;
    if (/\banteayer\b/.test(pd)) f = isoDe(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 2));
    else if (/\b(ayer|anoche)\b/.test(pd)) f = isoDe(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1));
    /* quitamos relleno trabajando sin acentos pero conservando las letras originales */
    const pals = desc.split(/\s+/).filter((w) => { const s = sinAcentos(w.toLowerCase()).replace(/[^a-z0-9ñ]/g, ''); return s && !new RegExp(RELLENO.source).test(' ' + s + ' ') && !/^\d+$/.test(s); });
    const n = limpiar(pals.join(' '));
    const serv = servicioDe(n || trozo);
    const esPago = dia != null || /\b(todos los meses|cada mes)\b/.test(plano);
    out.push({ id: nid(), n: mayus(n) || serv || 'Gasto', m: Math.round(mo.v), f: f || isoDe(hoy), tipo: esPago ? 'pago' : 'gasto', dia });
  }
  return out;
}

/* ---------- 2. Un texto largo: resumen de cuenta, boleta o ticket ---------- */
const RE_SALDO = /\b(saldo|subtotal|sub total|total|disponible|balance)\b/;
const RE_INGRESO = /\b(transferencia recibida|recibiste|recibida|ingreso de dinero|ingreso|acreditacion|acreditamos|deposito|sueldo|haberes|rendimiento|rendimientos|devolucion|reintegro|cobro|cobraste|venta)\b/;

type Linea = { n: string; f: string; v: number; neg: boolean; ingreso: boolean };
function lineaDeResumen(linea: string, hoy: Date): Linea | null {
  const F = fechas(linea, hoy);
  if (!F.length) return null;
  const plano = sinAcentos(linea.toLowerCase());
  let M = montos(linea).filter((m) => !F.some((f) => m.i < f.fin && m.fin > f.i) && m.v > 0);
  if (!M.length) return null;
  if (M.some((m) => m.fuerte)) M = M.filter((m) => m.fuerte);
  else M = M.filter((m) => m.v >= 10);
  if (!M.length) return null;
  const mo = M[0]; // el primero es el movimiento; el que sigue suele ser el saldo
  const ch = linea.split('');
  [...F, ...montos(linea)].forEach((x) => { for (let k = x.i; k < x.fin; k++) ch[k] = ' '; });
  let desc = ch.join('');
  desc = limpiar(desc.replace(/[$|]/g, ' ').replace(/\b\d{6,}\b/g, ' ').replace(/(^|\s)[-−–](?=\s|$)/g, ' ').replace(/\b(ars|usd|u\$s)\b/gi, ' '));
  if (!desc || (RE_SALDO.test(sinAcentos(desc.toLowerCase())) && desc.split(' ').length <= 3)) return null;
  return { n: mayus(desc.slice(0, 60)), f: F[0].f, v: mo.v, neg: mo.neg, ingreso: RE_INGRESO.test(plano) };
}

const RE_TOTAL = [/total a pagar/, /importe a pagar/, /total a abonar/, /monto a pagar/, /pagar hasta/, /total factura/, /importe total/, /\btotal\b/, /\bimporte\b/, /\bmonto\b/];

/** Boleta o ticket: un solo monto (el total) y, si figura, la fecha de vencimiento */
export function entenderBoleta(texto: string, hoy = new Date()): Borrador[] {
  const lineas = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const plano = lineas.map((l) => sinAcentos(l.toLowerCase()));
  let total: number | null = null;
  for (const re of RE_TOTAL) {
    for (let i = 0; i < plano.length && total == null; i++) {
      if (!re.test(plano[i]) || /\bsubtotal|sub total\b/.test(plano[i])) continue;
      const corte = plano[i].search(re);
      const aca = montos(lineas[i].slice(corte)).filter((m) => m.v >= 1 && !fechas(lineas[i], hoy).some((f) => m.i + corte < f.fin && m.fin + corte > f.i));
      const cand = aca.filter((m) => m.fuerte).pop() || aca.pop() || montos(lineas[i + 1] || '').filter((m) => m.fuerte && m.v >= 1)[0];
      if (cand) total = cand.v;
    }
    if (total != null) break;
  }
  if (total == null) { const M = lineas.flatMap((l) => montos(l)).filter((m) => m.fuerte && m.v >= 1); if (M.length) total = Math.max(...M.map((m) => m.v)); }
  if (total == null) return [];
  let vto: Fecha | undefined;
  for (let i = 0; i < plano.length && !vto; i++) if (/\b(venc|vto)/.test(plano[i])) vto = fechas(lineas[i], hoy)[0] || fechas(lineas[i + 1] || '', hoy)[0];
  const serv = servicioDe(texto);
  const cualquier = fechas(texto, hoy)[0];
  if (vto || serv) return [{ id: nid(), n: serv || 'Boleta', m: Math.round(total), tipo: 'pago', dia: vto?.dia, f: vto?.f }];
  /* Ticket de compra: el nombre es la primera línea con letras (suele ser el comercio) */
  const comercio = lineas.find((l) => /[a-záéíóúñ]{3,}/i.test(l) && !montos(l).some((m) => m.fuerte)) || 'Compra';
  return [{ id: nid(), n: mayus(limpiar(comercio).toLowerCase()).slice(0, 40), m: Math.round(total), tipo: 'gasto', f: cualquier?.f || isoDe(hoy) }];
}

/** Decide solo: si hay varias líneas con fecha y monto es un resumen; si no, una boleta o ticket */
export function entenderTexto(texto: string, hoy = new Date()): { clase: 'resumen' | 'boleta' | 'nada'; items: Borrador[] } {
  const L = texto.split(/\r?\n/).map((l) => lineaDeResumen(l, hoy)).filter(Boolean) as Linea[];
  if (L.length >= 3) return { clase: 'resumen', items: deLineas(L) };
  /* Un mensaje corto ("Pagaste $ 12.000 a Verdulería Don José") se entiende como una frase dicha */
  if (!L.length && texto.trim().split(/\r?\n/).filter((l) => l.trim()).length <= 2) { const d = entenderDicho(texto, hoy); if (d.length) return { clase: 'boleta', items: d }; }
  const b = entenderBoleta(texto, hoy);
  if (b.length) return { clase: 'boleta', items: b };
  if (L.length) return { clase: 'resumen', items: deLineas(L) };
  const d = entenderDicho(texto, hoy);
  return d.length ? { clase: 'boleta', items: d } : { clase: 'nada', items: [] };
}
function deLineas(L: Linea[]): Borrador[] {
  /* Si el resumen marca los gastos con signo menos, lo que no lo lleva es plata que entró */
  const hayNeg = L.some((l) => l.neg);
  return L.map((l) => ({ id: nid(), n: l.n, m: Math.round(l.v), f: l.f, tipo: 'gasto' as const, ingreso: hayNeg ? !l.neg : l.ingreso }));
}

/* ---------- 3. Planilla (CSV) descargada del banco o de la billetera ---------- */
export function leerCSV(texto: string): string[][] {
  const t = texto.replace(/^﻿/, '');
  const prim = t.split(/\r?\n/).slice(0, 8).join('\n');
  const cuenta = (c: string) => prim.split(c).length - 1;
  const sep = [';', '\t', ',', '|'].sort((a, b) => cuenta(b) - cuenta(a))[0];
  const filas: string[][] = [];
  let fila: string[] = [], celda = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) { if (ch === '"') { if (t[i + 1] === '"') { celda += '"'; i++; } else q = false; } else celda += ch; }
    else if (ch === '"') q = true;
    else if (ch === sep) { fila.push(celda.trim()); celda = ''; }
    else if (ch === '\n') { fila.push(celda.trim()); if (fila.some(Boolean)) filas.push(fila); fila = []; celda = ''; }
    else if (ch !== '\r') celda += ch;
  }
  fila.push(celda.trim()); if (fila.some(Boolean)) filas.push(fila);
  return filas;
}

const COL = {
  fecha: /^(fecha|date|dia|fecha de (?:operacion|movimiento|liberacion|origen|compra))/,
  desc: /(descripcion|detalle|concepto|description|referencia|comercio|movimiento|tipo de operacion|operacion)/,
  monto: /^(monto|importe|valor|amount|total|monto neto|neto|net_amount|transaction_net_amount)/,
  debe: /(debito|debe|egreso|salida|cargo)/,
  haber: /(credito|haber|ingreso|entrada|abono)/
};

export function entenderCSV(texto: string, hoy = new Date()): Borrador[] {
  const filas = leerCSV(texto);
  const iCab = filas.findIndex((f) => f.filter((c) => { const s = sinAcentos(c.toLowerCase()); return COL.fecha.test(s) || COL.monto.test(s) || COL.debe.test(s) || COL.desc.test(s); }).length >= 2);
  if (iCab < 0) return entenderTexto(filas.map((f) => f.join('   ')).join('\n'), hoy).items;
  const cab = filas[iCab].map((c) => sinAcentos(c.toLowerCase()));
  const col = (re: RegExp) => cab.findIndex((c) => re.test(c));
  const cF = col(COL.fecha), cM = col(COL.monto), cD = col(COL.debe), cH = col(COL.haber);
  const cN = cab.findIndex((c, i) => COL.desc.test(c) && i !== cF && i !== cM && i !== cD && i !== cH);
  const num = (s?: string) => { if (!s) return null; const v = cifra(s); return v == null ? null : (/^\s*[-−–(]|-\s*$/.test(s) ? -v : v); };
  const L: Linea[] = [];
  for (const f of filas.slice(iCab + 1)) {
    const F = cF >= 0 ? fechas(f[cF] || '', hoy)[0] : fechas(f.join(' '), hoy)[0];
    let v: number | null = null, neg = false;
    if (cD >= 0 || cH >= 0) { const d = Math.abs(num(f[cD]) || 0), h = Math.abs(num(f[cH]) || 0); if (d) { v = d; neg = true; } else if (h) v = h; }
    if (v == null && cM >= 0) { const x = num(f[cM]); if (x != null && x !== 0) { v = Math.abs(x); neg = x < 0; } }
    if (!F || v == null || !v) continue;
    const n = limpiar(cN >= 0 ? f[cN] || '' : f.filter((_, i) => i !== cF && i !== cM && i !== cD && i !== cH).find((c) => /[a-záéíóúñ]{3,}/i.test(c)) || '');
    L.push({ n: mayus(n.slice(0, 60)) || 'Movimiento', f: F.f, v, neg, ingreso: RE_INGRESO.test(sinAcentos(n.toLowerCase())) });
  }
  const conColumnas = cD >= 0 || cH >= 0;
  const hayNeg = L.some((l) => l.neg);
  return L.map((l) => ({ id: nid(), n: l.n, m: Math.round(l.v), f: l.f, tipo: 'gasto' as const, ingreso: conColumnas || hayNeg ? !l.neg : l.ingreso }));
}
