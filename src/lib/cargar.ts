/* Guardar lo que la persona confirmó en "Cargar sin escribir".
   Un gasto se suma al rubro del mes (Seguimiento); un pago va a Mis vencimientos. */
import { mut, getD } from '../store';
import { pn, uid } from './format';
import { isoDe, type Borrador } from './entender';

export type Origen = 'voz' | 'foto' | 'archivo' | 'compartido';
/** Un borrador con lo que eligió la persona: si se guarda y en qué rubro */
export type Fila = Borrador & { ok: boolean; r: string };

/* Se guarda con puntos de miles, igual que cuando la persona lo escribe a mano (32.411) */
const miles = (n: number) => new Intl.NumberFormat('es-AR').format(Math.max(0, Math.round(n)));
const sumar = (actual: unknown, mas: number) => miles(pn(actual) + mas);

export function guardar(filas: Fila[], src: Origen) {
  const elegidas = filas.filter((f) => f.ok && f.m > 0 && (f.tipo === 'pago' ? f.n.trim() : f.r));
  let gastos = 0, pagos = 0;
  mut((d) => {
    for (const f of elegidas) {
      if (f.tipo === 'pago') {
        const dia = String(Math.min(Math.max(Math.round(f.dia || 10), 1), 31));
        const ya = d.venc.items.find((x) => x.n.trim().toLowerCase() === f.n.trim().toLowerCase());
        if (ya) { ya.m = miles(f.m); if (f.dia) ya.dia = dia; }
        else d.venc.items.push({ id: uid(), n: f.n.trim(), dia, m: miles(f.m) });
        pagos++;
      } else {
        const fecha = f.f || isoDe(new Date()), ym = fecha.slice(0, 7);
        const mes = (d.plata.seg[ym] ||= {});
        mes[f.r] = sumar(mes[f.r], f.m);
        d.plata.mov.unshift({ id: uid(), f: fecha, n: f.n.trim() || 'Gasto', m: f.m, r: f.r, src });
        gastos++;
      }
    }
    if (d.plata.mov.length > 400) d.plata.mov.length = 400;
  });
  return { gastos, pagos };
}

/** Deshace un gasto cargado: lo resta del rubro de su mes y lo saca de la lista */
export function deshacer(id: string) {
  const mv = getD().plata.mov.find((x) => x.id === id);
  if (!mv) return false;
  mut((d) => {
    const mes = d.plata.seg[mv.f.slice(0, 7)];
    if (mes && mes[mv.r] != null) mes[mv.r] = sumar(mes[mv.r], -mv.m);
    d.plata.mov = d.plata.mov.filter((x) => x.id !== id);
  });
  return true;
}

/** Suma por rubro de lo tildado, como promedio mensual si el resumen trae más de un mes */
export function planPorRubro(filas: Fila[]): { r: string; m: number }[] {
  const ok = filas.filter((f) => f.ok && f.m > 0 && f.r);
  const meses = Math.max(1, new Set(ok.map((f) => (f.f || '').slice(0, 7)).filter(Boolean)).size);
  const tot = new Map<string, number>();
  for (const f of ok) tot.set(f.r, (tot.get(f.r) || 0) + f.m);
  return [...tot].map(([r, m]) => ({ r, m: Math.round(m / meses) }));
}

/** Arma "Mis números" con el resumen: el gasto por mes de cada rubro pasa a ser lo que muestra el resumen */
export function guardarComoPlan(filas: Fila[]) {
  const plan = planPorRubro(filas);
  mut((d) => { for (const p of plan) { const g = d.plata.gas.find((x) => x.id === p.r); if (g) g.m = miles(p.m); } });
  return plan.length;
}
