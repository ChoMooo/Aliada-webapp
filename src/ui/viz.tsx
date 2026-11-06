/* Piezas de gráficos para los paneles. Reglas: marcas finas, el color identifica (nunca el texto),
   cada valor también se puede leer sin tocar (etiquetas o "Ver como tabla") y todo funciona en claro y oscuro.
   Colores en styles.css (--viz-*), paleta validada para daltonismo. */
import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cx } from './cx';

const EASE = [0.23, 1, 0.32, 1] as const;
export const VIZ = ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-3)', 'var(--viz-4)', 'var(--viz-5)'];
/* Texto dentro de un color: blanco, salvo sobre el amarillo (casi negro) */
const INK = ['#ffffff', '#ffffff', '#ffffff', '#0b0b0b', '#ffffff'];

/** Tarjeta de panel: borde fino, título chico arriba */
export function Panel({ title, sub, children, className, right }: { title?: React.ReactNode; sub?: React.ReactNode; children: React.ReactNode; className?: string; right?: React.ReactNode }) {
  return (
    <section className={cx('rounded-xl3 border border-line bg-surface p-4 sm:p-5 flex flex-col gap-4 min-w-0', className)}>
      {(title || right) && (
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">{title && <h2 className="text-[1.15rem] leading-snug">{title}</h2>}{sub && <p className="text-[.9rem] text-muted mt-0.5">{sub}</p>}</div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

/** Cifra con etiqueta (KPI) */
export function Tile({ label, value, hint, tone }: { label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: 'bad' }) {
  return (
    <div className="rounded-xl2 border border-line bg-surface p-3.5 flex flex-col gap-0.5 min-w-0">
      <span className="text-[.86rem] text-muted leading-tight">{label}</span>
      <span className={cx('font-head font-semibold text-[1.45rem] leading-tight [overflow-wrap:anywhere]', tone === 'bad' && 'text-bad')}>{value}</span>
      {hint && <span className="text-[.8rem] text-muted leading-snug">{hint}</span>}
    </div>
  );
}

type Status = 'good' | 'warn' | 'bad';
const ST: Record<Status, { c: string; I: any }> = {
  good: { c: 'var(--st-good)', I: CheckCircle2 }, warn: { c: 'var(--st-warn)', I: AlertTriangle }, bad: { c: 'var(--st-bad)', I: AlertOctagon }
};

/** Medidor: cuánto de un límite se usa. El color dice el estado y siempre va con ícono y texto */
export function Meter({ value, max, status, label, right }: { value: number; max: number; status: Status; label: React.ReactNode; right?: React.ReactNode }) {
  const reduce = useReducedMotion();
  const f = Math.max(0, Math.min(value / (max || 1), 1));
  const S = ST[status];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-semibold"><S.I className="size-[1.1rem] shrink-0" style={{ color: S.c }} aria-hidden />{label}</span>
        {right && <span className="text-[.9rem] text-muted num whitespace-nowrap">{right}</span>}
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--viz-track)' }} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value, max)}>
        <motion.div className="h-full w-full rounded-full origin-left" style={{ background: S.c }}
          initial={reduce ? false : { transform: 'scaleX(0)' }} animate={{ transform: `scaleX(${f})` }} transition={{ duration: 0.7, ease: EASE }} />
      </div>
    </div>
  );
}

export type Part = { k: string; n: string; v: number };

/** Barra dividida en partes (un total y de qué está hecho). Debajo, la lista con nombre, monto y porcentaje */
export function SegBar({ parts, format, label }: { parts: Part[]; format: (v: number) => string; label: string }) {
  const reduce = useReducedMotion();
  const P = parts.filter((p) => p.v > 0), tot = P.reduce((t, p) => t + p.v, 0) || 1;
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-[2px] h-7" role="img" aria-label={label + ': ' + P.map((p) => `${p.n} ${Math.round((p.v / tot) * 100)}%`).join(', ')}>
        {P.map((p, i) => {
          const sh = p.v / tot, idx = parts.indexOf(p);
          return (
            <motion.button key={p.k} type="button" onClick={() => setSel(sel === p.k ? null : p.k)} aria-label={`${p.n}: ${format(p.v)}, ${Math.round(sh * 100)}%`}
              className={cx('relative h-full rounded-[4px] min-w-[4px] flex items-center px-1.5 overflow-hidden transition-opacity', sel && sel !== p.k && 'opacity-45')}
              style={{ background: VIZ[idx % 5], flexGrow: sh, flexBasis: 0, transformOrigin: 'left' }}
              initial={reduce ? false : { opacity: 0, transform: 'scaleX(.6)' }} animate={{ opacity: sel && sel !== p.k ? 0.45 : 1, transform: 'scaleX(1)' }} transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}>
              {sh >= 0.14 && <span className="text-[.78rem] font-bold num" style={{ color: INK[idx % 5] }}>{Math.round(sh * 100)}%</span>}
            </motion.button>
          );
        })}
      </div>
      <ul className="flex flex-col">
        {parts.map((p, idx) => p.v > 0 && (
          <li key={p.k} className={cx('flex items-center gap-2.5 py-1.5 border-b border-line last:border-0 transition-opacity', sel && sel !== p.k && 'opacity-55')}>
            <span className="size-3 rounded-[3px] shrink-0" style={{ background: VIZ[idx % 5] }} aria-hidden />
            <span className="flex-1 min-w-0 leading-snug">{p.n}</span>
            <span className="num font-semibold">{format(p.v)}</span>
            <span className="num text-muted text-[.88rem] w-[3.2rem] text-right">{Math.round((p.v / tot) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Barras horizontales ordenadas de mayor a menor, un solo color, con el valor en la punta */
export function RankBars({ rows, format, sub }: { rows: { k: string; n: string; v: number }[]; format: (v: number) => string; sub?: (v: number) => string }) {
  const reduce = useReducedMotion();
  const R = [...rows].filter((r) => r.v > 0).sort((a, b) => b.v - a.v), max = R[0]?.v || 1;
  return (
    <ul className="flex flex-col gap-3">
      {R.map((r, i) => (
        <li key={r.k} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate">{r.n}</span>
            <span className="whitespace-nowrap"><b className="num">{format(r.v)}</b>{sub && <span className="text-muted text-[.86rem] num ml-1.5">{sub(r.v)}</span>}</span>
          </div>
          <div className="h-3 flex items-center">
            <motion.span className="block h-3 rounded-r-[4px] origin-left" style={{ width: `${(r.v / max) * 100}%`, background: 'var(--viz-seq)' }}
              initial={reduce ? false : { transform: 'scaleX(0)' }} animate={{ transform: 'scaleX(1)' }} transition={{ duration: 0.6, delay: 0.05 + i * 0.05, ease: EASE }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Columnas por mes: el mes elegido en color, los demás en gris; una línea fina marca el plan.
    Tocar una columna muestra su valor; "Ver como tabla" muestra todos */
export function MonthColumns({ rows, format, plan: refV, planLabel: refLabel }: { rows: { k: string; n: string; v: number }[]; format: (v: number) => string; plan?: number; planLabel?: string }) {
  const reduce = useReducedMotion();
  const id = useId();
  const [sel, setSel] = useState(rows.length - 1);
  const [tabla, setTabla] = useState(false);
  const max = Math.max(...rows.map((r) => r.v), refV || 0) * 1.08 || 1;
  const H = 150;
  const cur = rows[sel];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[.95rem]"><b className="num text-[1.15rem]">{cur ? format(cur.v) : '—'}</b> <span className="text-muted">en {cur?.n}</span></p>
        <button type="button" onClick={() => setTabla(!tabla)} aria-expanded={tabla} aria-controls={id} className="text-[.9rem] text-accent font-semibold underline underline-offset-4 min-h-[2.75rem] px-1">{tabla ? 'Ver gráfico' : 'Ver tabla'}</button>
      </div>
      <div id={id}>
        {tabla ? (
          <table className="w-full text-left">
            <thead><tr className="text-muted text-[.86rem]"><th className="font-normal py-1">Mes</th><th className="font-normal py-1 text-right">Gastado</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.k} className="border-t border-line"><td className="py-1.5 capitalize">{r.n}</td><td className="py-1.5 text-right num">{format(r.v)}</td></tr>)}</tbody>
          </table>
        ) : (
          <div className="relative" style={{ height: H + 26 }}>
            {refV ? (
              <div className="absolute inset-x-0" style={{ top: H - (refV / max) * H, borderTop: '1px solid rgb(var(--muted) / .55)' }}>
                <span className="absolute right-0 -top-5 text-[.75rem] text-muted bg-surface px-1">{refLabel}</span>
              </div>
            ) : null}
            <div className="absolute inset-x-0 top-0 flex items-end justify-around gap-2" style={{ height: H }}>
              {rows.map((r, i) => (
                <button key={r.k} type="button" onClick={() => setSel(i)} aria-pressed={sel === i} aria-label={`${r.n}: ${format(r.v)}`}
                  className="group relative flex-1 max-w-[3.5rem] h-full flex items-end justify-center">
                  <motion.span className="block w-full max-w-[24px] rounded-t-[4px] origin-bottom"
                    style={{ height: `${(r.v / max) * 100}%`, background: sel === i ? 'var(--viz-seq)' : 'var(--viz-dim)' }}
                    initial={reduce ? false : { transform: 'scaleY(0)' }} animate={{ transform: 'scaleY(1)' }} transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }} />
                </button>
              ))}
            </div>
            <div className="absolute inset-x-0 border-t border-line" style={{ top: H }} />
            <div className="absolute inset-x-0 flex justify-around gap-2" style={{ top: H + 6 }}>
              {rows.map((r, i) => <span key={r.k} className={cx('flex-1 max-w-[3.5rem] text-center text-[.78rem] capitalize', sel === i ? 'text-ink font-semibold' : 'text-muted')}>{r.n.slice(0, 3)}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
