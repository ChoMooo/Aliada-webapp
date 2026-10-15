import React from 'react';
import { Wallet, FileCheck2, Lightbulb } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, RowLink, Stagger, Item, Card, Ring } from '../../ui';
import { fmt } from '../../lib/format';
import { calc, progresoTram, taPlanProg } from './calc';
import { OP } from '../../content/finanzas';

export default function FinanzasHub() {
  const d = useStore((s) => s.d);
  const c = calc(d), pt = progresoTram(d), pp = taPlanProg(d);
  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader kicker="Sección" title="Finanzas" lead="Tu plata bajo control, tus trámites en orden y nuevas formas de generar ingresos con lo que ya sabés." /></Item>
      <Item className="grid grid-cols-3 gap-3">
        <Card className="flex flex-col items-center gap-2 text-center !p-4"><Ring value={c.has ? 100 : 0} size={56}>{c.has ? '✓' : '—'}</Ring><span className="text-[.8rem] text-muted leading-tight">Mi plata</span></Card>
        <Card className="flex flex-col items-center gap-2 text-center !p-4"><Ring value={pt.n} max={pt.t || 1} size={56}>{pt.t ? Math.round(pt.n / pt.t * 100) + '%' : '—'}</Ring><span className="text-[.8rem] text-muted leading-tight">Trámites</span></Card>
        <Card className="flex flex-col items-center gap-2 text-center !p-4"><Ring value={pp.n} max={pp.t || 1} size={56}>{pp.t ? Math.round(pp.n / pp.t * 100) + '%' : '—'}</Ring><span className="text-[.8rem] text-muted leading-tight">Plan de talento</span></Card>
      </Item>
      <Item className="flex flex-col gap-3">
        <RowLink to="/finanzas/plata" icon={<Wallet />} tone="mint" title="Mi plata" sub={c.has ? (c.anios == null ? 'Tus ingresos cubren tus gastos' : `Tus ahorros alcanzan ~${fmt(c.anios, 1)} años`) : 'Ingresos, gastos, ahorros, inflación y metas'} />
        <RowLink to="/finanzas/tramites" icon={<FileCheck2 />} tone="sky" title="Mis trámites" sub={d.tr.sit.sit ? `${pt.n} de ${pt.t} tareas de tu plan` : 'ANSES, PAMI y más, con guía paso a paso'} />
        <RowLink to="/finanzas/talento" icon={<Lightbulb />} tone="amber" title="Mi talento, mi ingreso" sub={d.ta.sel ? 'Tu oportunidad: ' + OP(d.ta.sel).n : 'Descubrí cómo generar ingresos con tu experiencia'} />
      </Item>
    </Stagger>
  );
}
