/* Paso 3 de "Mis números": calculadora de ahorros por lugar.
   La persona anota cuánto tiene en cada lado; la app suma y pasa los dólares a pesos
   con la cotización que la persona escribe (no usamos cotizaciones en vivo). */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Wallet, Banknote, DollarSign, Plus } from 'lucide-react';
import { useStore, mut } from '../../store';
import { MoneyInput, cx } from '../../ui';
import { money, fmt, uid } from '../../lib/format';
import { calc } from './calc';
import { RowEditor } from './shared';

type K = 'pf' | 'cu' | 'ef';
const LUGARES: { k: K; icon: React.ReactNode; t: string; h: string }[] = [
  { k: 'pf', icon: <Landmark />, t: 'Plazo fijo', h: 'Lo que pusiste, en pesos. Sin sumar intereses que todavía no cobraste.' },
  { k: 'cu', icon: <Wallet />, t: 'Cuentas y billeteras', h: 'Caja de ahorro, cuenta sueldo, Mercado Pago, Ualá, Cuenta DNI…' },
  { k: 'ef', icon: <Banknote />, t: 'Efectivo en pesos', h: 'Lo que guardás en tu casa.' }
];

export function AhorrosPaso() {
  const d = useStore((s) => s.d), c = calc(d), A = d.plata.ah, P = c.ahoParts;
  const [otros, setOtros] = useState(d.plata.aho.length > 0);
  const setA = (k: keyof typeof A) => (v: string) => mut((x) => { x.plata.ah[k] = v; });

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col rounded-xl2 bg-surface border border-line shadow-card divide-y divide-line">
        {LUGARES.map((L) => (
          <li key={L.k} className="p-4 flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_12rem] sm:items-center sm:gap-4">
            <label htmlFor={'ah-' + L.k} className="flex gap-3 min-w-0">
              <span className="grid place-items-center size-11 rounded-xl bg-mint text-teal [&_svg]:size-5 shrink-0">{L.icon}</span>
              <span className="min-w-0"><b className="block text-[1.05rem] leading-tight">{L.t}</b><span className="block text-[.86rem] text-muted mt-0.5">{L.h}</span></span>
            </label>
            <MoneyInput id={'ah-' + L.k} value={A[L.k]} onChange={setA(L.k)} />
          </li>
        ))}

        {/* Dólares: cantidad × cotización del día = pesos */}
        <li className="p-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <span className="grid place-items-center size-11 rounded-xl bg-skysoft text-sky [&_svg]:size-5 shrink-0"><DollarSign /></span>
            <span className="min-w-0"><b className="block text-[1.05rem] leading-tight">Dólares</b><span className="block text-[.86rem] text-muted mt-0.5">Billetes o en una cuenta en dólares.</span></span>
          </div>
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 min-w-0">
              <label htmlFor="ah-usd" className="font-bold text-[.92rem]">¿Cuántos dólares tenés?</label>
              <MoneyInput id="ah-usd" cur="US$" value={A.usd} onChange={setA('usd')} />
            </div>
            <div className="flex flex-col gap-1.5 min-w-0">
              <label htmlFor="ah-cot" className="font-bold text-[.92rem]">¿A cuánto está hoy?</label>
              <MoneyInput id="ah-cot" value={d.plata.cot} onChange={(v) => mut((x) => { x.plata.cot = v; })} placeholder="Ej: 1.400" />
            </div>
          </div>
          <p className="text-[.85rem] text-muted">Buscá el precio de <b className="text-ink">compra</b> (lo que te pagan por cada dólar) en tu banco, en tu billetera o en el diario, y escribilo. Lo usamos solo para pasar tus dólares a pesos.</p>
          <AnimatePresence initial={false} mode="wait">
            {P.usd > 0 && (
              <motion.div key={c.cot > 0 ? 'ok' : 'falta'} initial={{ opacity: 0, transform: 'translate(0px, 4px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                className={cx('rounded-lg px-4 py-3 num', c.cot > 0 ? 'bg-skysoft' : 'bg-warn text-warnink')} aria-live="polite">
                {c.cot > 0
                  ? <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1"><span>US$ {fmt(P.usd, P.usd % 1 ? 2 : 0)} × $ {fmt(c.cot, c.cot % 1 ? 2 : 0)}</span><span aria-hidden>=</span><b className="text-[1.15rem]">{money(P.usdARS)}</b></span>
                  : <span>Escribí a cuánto está el dólar hoy para sumarlos en pesos.</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      </ul>

      {/* Otros ahorros, solo si los necesita */}
      {!otros ? (
        <button type="button" onClick={() => { setOtros(true); if (!d.plata.aho.length) mut((x) => { x.plata.aho.push({ id: uid(), n: '', m: '', mon: 'ARS' }); }); }}
          className="press self-start inline-flex items-center gap-2 min-h-[2.9rem] px-4 rounded-lg border-2 border-accent text-accent font-semibold">
          <Plus className="size-5" /> Tengo otros ahorros
        </button>
      ) : (
        <div className="rounded-xl2 bg-surface border border-line p-4 flex flex-col gap-3">
          <div><b className="block text-[1.05rem]">Otros ahorros</b><span className="text-[.86rem] text-muted">Fondos, plata que prestaste, cripto u otra cosa. Elegí si está en pesos o en dólares.</span></div>
          <RowEditor path="plata.aho" rows={d.plata.aho} currency addLabel="Agregar otro" namePh="Ej: fondo común de inversión" />
        </div>
      )}

      {/* Total con el detalle, para que se vea de dónde sale */}
      <section className="rounded-xl2 bg-sunk p-4 sm:p-5" aria-label="Total de tus ahorros">
        <dl className="flex flex-col text-[.95rem]">
          {([['Plazo fijo', P.pf], ['Cuentas y billeteras', P.cu], ['Efectivo', P.ef]] as [string, number][]).filter(([, v]) => v > 0).map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-x-3 py-1.5"><dt className="text-muted">{k}</dt><dd className="num font-semibold">{money(v)}</dd></div>
          ))}
          {P.usd > 0 && <div className="flex justify-between gap-3 py-1.5"><dt className="text-muted">Dólares (US$ {fmt(P.usd)})</dt><dd className="num font-semibold">{c.cot > 0 ? money(P.usdARS) : 'falta la cotización'}</dd></div>}
          {P.otros !== 0 && <div className="flex justify-between gap-3 py-1.5"><dt className="text-muted">Otros</dt><dd className="num font-semibold">{money(P.otros)}</dd></div>}
          <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 pt-3 mt-1.5 border-t border-ink/15">
            <dt className="font-bold">Total en pesos</dt>
            <dd className="num font-head font-semibold text-[1.7rem] leading-none">{money(c.ahoARS)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

