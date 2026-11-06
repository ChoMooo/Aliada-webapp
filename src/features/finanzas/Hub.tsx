import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, FileCheck2, Lightbulb, CreditCard, CalendarClock, Scale, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';
import { RowLink, RowList, Stagger, Item, cx } from '../../ui';
import { OceanHero } from '../../ui/ocean';
import { Display } from '../../ui/sunset';
import { fmt, money } from '../../lib/format';
import { estados } from './vencimientos';
import { calc, progresoTram } from './calc';
import { OP } from '../../content/finanzas';
import { finModProg } from '../digital/logic';

export default function FinanzasHub() {
  const d = useStore((s) => s.d);
  const c = calc(d), pt = progresoTram(d), fp = finModProg(d), E = estados(d), pend = E.filter((e) => !e.pagado), prox = pend[0];
  return (
    <Stagger className="flex flex-col gap-6">
      <Item>
        <OceanHero mar="finanzas">
          <Display className="text-white">Finanzas</Display>
          <p className="text-white/90 text-[1.05rem] mt-2 max-w-[32rem]">Tu plata del mes, tus pagos, tus trámites y cómo generar un ingreso extra con lo que sabés.</p>
        </OceanHero>
      </Item>
      {/* Tu panel: la cifra del mes y la puerta al tablero completo */}
      <Item>
        <Link to="/finanzas/panel" className="press group block rounded-xl3 border border-line bg-surface p-4 sm:p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[.9rem] text-muted">Tu panel</p>
              {c.has ? <>
                <p className="mt-1">Cada mes {c.brecha >= 0 ? 'te sobran' : 'te faltan'}</p>
                <p className={cx('font-head font-semibold text-[2.2rem] leading-none mt-1 [overflow-wrap:anywhere]', c.brecha < 0 && 'text-bad')}>{money(Math.abs(c.brecha))}</p>
              </> : <p className="font-head font-semibold text-[1.3rem] leading-snug mt-1">Tus números, en un tablero claro</p>}
            </div>
            <span className="grid place-items-center size-11 rounded-full bg-sunk shrink-0 transition-transform group-hover:translate-x-0.5"><ArrowRight className="size-5" /></span>
          </div>
          {c.has && c.ing > 0 && (
            <div className="mt-4 flex flex-col gap-1.5">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--viz-track)' }} aria-hidden>
                <div className="h-full rounded-full" style={{ width: `${Math.min(c.gas / c.ing, 1) * 100}%`, background: c.gas / c.ing <= 0.8 ? 'var(--st-good)' : c.gas / c.ing <= 1 ? 'var(--st-warn)' : 'var(--st-bad)' }} />
              </div>
              <span className="text-[.86rem] text-muted num">Gastás el {Math.round((c.gas / c.ing) * 100)}% de lo que entra{E.length ? ` · ${pend.length ? `${pend.length} ${pend.length === 1 ? 'pago pendiente' : 'pagos pendientes'}` : 'pagos al día'}` : ''}</span>
            </div>
          )}
          {!c.has && <p className="text-muted text-[.95rem] mt-2">Cargá tus números y vas a ver cuánto te sobra, adónde va tu plata y cuánto te cubren tus ahorros.</p>}
        </Link>
      </Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.25rem]">Herramientas</h2>
        <RowList>
          <RowLink to="/finanzas/vencimientos" icon={<CalendarClock />} tone="amber" title="Mis vencimientos" sub={E.length ? (pend.length ? `${pend.length} por pagar este mes` : 'Todo pagado este mes') : 'Luz, gas, tarjeta… qué vence y cuándo'} />
          <RowLink to="/finanzas/plata" icon={<Wallet />} tone="mint" title="Mi plata" sub={c.has ? (c.anios == null ? 'Tus ingresos cubren tus gastos' : `Tus ahorros alcanzan unos ${fmt(c.anios, 1)} años`) : 'Ingresos, gastos y ahorros: tu mes en claro'} />
          <RowLink to="/finanzas/cuotas" icon={<Scale />} tone="sky" title="¿Cuotas o contado?" sub="La cuenta hecha antes de comprar" />
          <RowLink to="/finanzas/tramites" icon={<FileCheck2 />} tone="sky" title="Mis trámites" sub={d.tr.sit.sit ? `${pt.n} de ${pt.t} tareas de tu plan` : 'ANSES, PAMI y más, con lo que tenés que llevar'} />
          <RowLink to="/finanzas/talento" icon={<Lightbulb />} tone="amber" title="Mi talento, mi ingreso" sub={d.ta.sel ? 'Tu oportunidad: ' + OP(d.ta.sel).n : 'Precio, oferta y plan para vender lo que sabés'} />
        </RowList>
      </Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.25rem]">Aprendé con video</h2>
        <RowLink to="/finanzas/m/pay" icon={<CreditCard />} tone="violet" title="Plata en el celular" sub={fp.n ? `${fp.n} de ${fp.t} lecciones` : 'Pagar con QR, transferir, pagar servicios y comprar seguro'} />
      </Item>
    </Stagger>
  );
}
