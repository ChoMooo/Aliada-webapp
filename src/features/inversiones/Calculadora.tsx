import React, { useState } from 'react';
import { PageHeader, Card, Field, MoneyInput, TextInput, KV, Note, Tabs, Stagger, Item } from '../../ui';
import { money, pn, fmt } from '../../lib/format';

/* Plazo fijo: interés simple = monto × TNA × días / 365.
   Interés compuesto mensual: capital y aportes capitalizados con tasa anual / 12. */
export function plazoFijo(monto: number, tna: number, dias: number) {
  const interes = monto * (tna / 100) * (dias / 365);
  return { interes, total: monto + interes, tea: (Math.pow(1 + (tna / 100) * (dias / 365), 365 / Math.max(dias, 1)) - 1) * 100 };
}
export function compuesto(inicial: number, aporte: number, tasaAnual: number, anios: number, inflAnual = 0) {
  const n = Math.round(anios * 12), r = tasaAnual / 100 / 12;
  let cap = inicial, puesto = inicial;
  for (let i = 0; i < n; i++) { cap = cap * (1 + r) + aporte; puesto += aporte; }
  const real = inflAnual > 0 ? cap / Math.pow(1 + inflAnual / 100, anios) : cap;
  return { total: cap, puesto, ganado: cap - puesto, real };
}

export default function Calculadora() {
  const [tab, setTab] = useState<'pf' | 'comp'>('pf');
  const [m, setM] = useState('500000'), [tna, setTna] = useState(''), [dias, setDias] = useState('30');
  const [ini, setIni] = useState('100000'), [ap, setAp] = useState('20000'), [tasa, setTasa] = useState(''), [an, setAn] = useState('5'), [inf, setInf] = useState('');
  const pf = plazoFijo(pn(m), pn(tna), Math.max(1, pn(dias)));
  const cp = compuesto(pn(ini), pn(ap), pn(tasa), Math.max(0, pn(an)), pn(inf));
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/inversiones', label: 'Inversiones' }} title="Calculadora de intereses" lead="Una simulación con la tasa que vos ingreses. No es una oferta ni una predicción: las tasas reales las informa cada entidad." /></Item>
      <Item><Tabs id="calc" tabs={[['pf', 'Plazo fijo'], ['comp', 'Interés compuesto']]} value={tab} onChange={setTab} /></Item>
      {tab === 'pf' ? (<>
        <Item><Card className="flex flex-col gap-4">
          <Field label="Monto" htmlFor="m"><MoneyInput id="m" value={m} onChange={setM} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="TNA (%)" hint="Tasa nominal anual que informa tu banco" htmlFor="t"><TextInput id="t" decimal value={tna} onChange={setTna} placeholder="Ej.: 30" /></Field>
            <Field label="Días" hint="Mínimo 30 en el tradicional" htmlFor="d"><TextInput id="d" numeric value={dias} onChange={setDias} /></Field>
          </div>
        </Card></Item>
        <Item><Card>
          <KV k="Interés estimado" v={pn(tna) ? money(pf.interes) : '—'} />
          <KV k="Tasa efectiva anual (TEA) equivalente" v={pn(tna) ? fmt(pf.tea, 1) + ' %' : '—'} />
          <KV total k="Total al vencimiento" v={pn(tna) ? money(pf.total) : '—'} />
        </Card></Item>
        {pn(dias) < 30 && <Item><Note tone="warn">El plazo fijo tradicional se arma por un mínimo de 30 días.</Note></Item>}
      </>) : (<>
        <Item><Card className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Monto inicial" htmlFor="i"><MoneyInput id="i" value={ini} onChange={setIni} /></Field>
            <Field label="Aporte mensual" htmlFor="a"><MoneyInput id="a" value={ap} onChange={setAp} /></Field>
            <Field label="Tasa anual estimada (%)" htmlFor="r"><TextInput id="r" decimal value={tasa} onChange={setTasa} placeholder="Ej.: 25" /></Field>
            <Field label="Años" htmlFor="y"><TextInput id="y" decimal value={an} onChange={setAn} /></Field>
          </div>
          <Field label={<>Inflación anual estimada (%) <span className="text-muted font-normal">(opcional)</span></>} hint="Para ver el resultado en plata de hoy" htmlFor="f"><TextInput id="f" decimal value={inf} onChange={setInf} placeholder="Ej.: 20" /></Field>
        </Card></Item>
        <Item><Card>
          <KV k="Lo que pusiste" v={money(cp.puesto)} />
          <KV k="Intereses ganados" v={pn(tasa) ? money(cp.ganado) : '—'} tone="pos" />
          <KV total k="Total estimado" v={pn(tasa) ? money(cp.total) : '—'} />
          {pn(inf) > 0 && pn(tasa) > 0 && <KV k="En plata de hoy (descontando inflación)" v={money(cp.real)} />}
        </Card></Item>
      </>)}
      <Item><Note tone="info">Los rendimientos pasados no garantizan los futuros. Esta herramienta no considera impuestos ni comisiones.</Note></Item>
    </Stagger>
  );
}
