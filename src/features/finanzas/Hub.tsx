import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, FileCheck2, Lightbulb, CreditCard, CalendarClock, Scale } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, RowLink, RowList, Stagger, Item, cx } from '../../ui';
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
      <Item><PageHeader title="Finanzas" lead="Tu plata del mes, tus pagos, tus trámites y cómo generar un ingreso extra con lo que sabés." /></Item>
      {(c.has || E.length > 0) && (
        <Item><section className="rounded-xl2 bg-sunk p-4 sm:p-5 grid gap-3 sm:grid-cols-2" aria-label="Este mes">
          {c.has && <Link to="/finanzas/plata/resultado" className="press flex flex-col"><span className="text-[.9rem] text-muted">Cada mes {c.brecha >= 0 ? 'te sobran' : 'te faltan'}</span><b className={cx('font-head font-semibold text-[1.6rem] leading-tight num', c.brecha < 0 && 'text-bad')}>{money(Math.abs(c.brecha))}</b></Link>}
          {E.length > 0 && <Link to="/finanzas/vencimientos" className="press flex flex-col"><span className="text-[.9rem] text-muted">{pend.length ? `${pend.length} ${pend.length === 1 ? 'pago pendiente' : 'pagos pendientes'}` : 'Pagos del mes'}</span><b className="font-head font-semibold text-[1.25rem] leading-tight">{prox ? `${prox.n}: ${prox.txt.toLowerCase()}` : 'Todo pagado'}</b></Link>}
        </section></Item>
      )}
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
