/* ¿Cuotas o contado? Pasa las cuotas a "plata de hoy" con la inflación mensual que estima la persona
   y lo compara con el precio de contado. Valor actual = Σ cuota / (1 + i)^k. */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, Stagger, Item, MoneyInput, TextInput, Note, cx } from '../../ui';
import { money, pn, fmt } from '../../lib/format';

export function cuotasVsContado(contado: number, n: number, cuota: number, infMensual: number, primeraHoy: boolean) {
  const i = infMensual / 100;
  let va = 0;
  for (let k = 0; k < n; k++) va += cuota / Math.pow(1 + i, primeraHoy ? k : k + 1);
  const total = cuota * n;
  return { total, va, recargo: contado > 0 ? (total / contado - 1) * 100 : 0, dif: contado - va, conviene: va < contado ? 'cuotas' as const : 'contado' as const };
}

const CANT = ['3', '6', '9', '12', '18'];

export default function Cuotas() {
  const [contado, setContado] = useState(''), [n, setN] = useState('6'), [cuota, setCuota] = useState(''), [inf, setInf] = useState(''), [hoy, setHoy] = useState(false);
  const C = pn(contado), N = Math.max(0, Math.round(pn(n))), Q = pn(cuota), I = pn(inf);
  const listo = C > 0 && N > 0 && Q > 0;
  const r = cuotasVsContado(C, N, Q, I, hoy);
  const igual = listo && Math.abs(r.dif) < Math.max(1, C * 0.005);

  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/finanzas', label: 'Finanzas' }} title="¿Cuotas o contado?" lead="Con precios que suben, una cuota de dentro de seis meses pesa menos que hoy. Cargá los dos precios y la app hace la cuenta." /></Item>

      <Item><div className="rounded-xl2 bg-surface border border-line shadow-card p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5"><label htmlFor="cc" className="font-bold">Precio de contado</label><MoneyInput id="cc" value={contado} onChange={setContado} />
          <p className="text-[.85rem] text-muted">Si te hacen descuento por pagar en efectivo o transferencia, poné ese precio.</p></div>
        <div className="flex flex-col gap-2">
          <span className="font-bold" id="cn">¿En cuántas cuotas?</span>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="cn">
            {CANT.map((c) => <button key={c} type="button" onClick={() => setN(c)} aria-pressed={n === c} className={cx('press min-w-[3.2rem] min-h-[2.9rem] px-3 rounded-full border font-bold num', n === c ? 'bg-ink text-bg border-ink' : 'border-line bg-surface')}>{c}</button>)}
            <div className="w-[6.5rem]"><TextInput label="Otra cantidad de cuotas" numeric value={CANT.includes(n) ? '' : n} onChange={setN} placeholder="Otra" /></div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5"><label htmlFor="cq" className="font-bold">Valor de cada cuota</label><MoneyInput id="cq" value={cuota} onChange={setCuota} />
          {Q > 0 && N > 0 && <p className="text-[.9rem] text-muted num">En total pagarías {money(Q * N)}{C > 0 ? ` · ${r.recargo >= 0 ? fmt(r.recargo, 1) + ' % más' : fmt(-r.recargo, 1) + ' % menos'} que de contado` : ''}.</p>}</div>
        <div className="flex flex-col gap-1.5"><label htmlFor="ci" className="font-bold">¿Cuánto suben los precios por mes? (%)</label>
          <div className="w-[9rem]"><TextInput id="ci" decimal value={inf} onChange={setInf} placeholder="Ej: 2" /></div>
          <p className="text-[.85rem] text-muted">Es la inflación mensual. Buscá el último dato del INDEC en las noticias; si no sabés, probá con 2 y con 4 para ver cómo cambia.</p></div>
        <label className="flex items-center gap-3 min-h-[2.9rem] cursor-pointer select-none">
          <input type="checkbox" checked={hoy} onChange={(e) => setHoy(e.target.checked)} className="size-6 accent-[rgb(var(--accent))]" />
          <span>La primera cuota se paga hoy</span>
        </label>
      </div></Item>

      <Item>
        <AnimatePresence mode="wait" initial={false}>
          {!listo ? (
            <motion.p key="x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted">Completá el precio de contado, las cuotas y el valor de cada cuota para ver el resultado.</motion.p>
          ) : (
            <motion.section key={r.conviene + igual} initial={{ opacity: 0, transform: 'translate(0px, 6px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
              className={cx('rounded-xl2 p-5 flex flex-col gap-3', igual ? 'bg-sunk' : r.conviene === 'cuotas' ? 'bg-mint' : 'bg-skysoft')} aria-live="polite">
              <h2 className="text-[1.5rem] leading-tight">{igual ? 'Da casi lo mismo' : r.conviene === 'cuotas' ? 'Te conviene en cuotas' : 'Te conviene de contado'}</h2>
              <p className="text-[1.02rem]">
                {I > 0 ? <>Tus {N} cuotas, pasadas a plata de hoy, valen <b className="num">{money(r.va)}</b>. </> : <>Sin inflación, las cuotas suman <b className="num">{money(r.total)}</b>. </>}
                {igual ? 'La diferencia con el contado es mínima: elegí lo que te resulte más cómodo.'
                  : r.conviene === 'cuotas' ? <>Es <b className="num">{money(r.dif)}</b> menos que pagar {money(C)} de contado.</>
                  : <>Es <b className="num">{money(-r.dif)}</b> más que pagar {money(C)} de contado.</>}
              </p>
              {r.conviene === 'cuotas' && !igual && <p className="text-[.92rem]">Ojo: conviene solo si tenés la plata guardada en algo que le gane o empate a la inflación mientras pagás, y si pagás el total del resumen de la tarjeta.</p>}
            </motion.section>
          )}
        </AnimatePresence>
      </Item>
      <Item><Note tone="info">Si no pagás el total del resumen de la tarjeta, se suman intereses muy altos y el cálculo cambia: pagar en cuotas deja de convenir. Es una estimación con la inflación que vos cargaste.</Note></Item>
    </Stagger>
  );
}
