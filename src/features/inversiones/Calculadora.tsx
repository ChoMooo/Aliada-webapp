import React, { useState } from 'react';
import { PageHeader, Card, Field, MoneyInput, TextInput, KV, Note, Tabs, Stagger, Item, cx } from '../../ui';
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

/* Comparador: ¿dónde rinde más mi plata este mes? Con las tasas que informa tu banco o tu billetera. */
export function comparar(monto: number, dias: number, tnaPF: number, tnaCta: number, infMensual: number) {
  const pf = monto * (tnaPF / 100) * (dias / 365);
  const cta = monto * (Math.pow(1 + tnaCta / 100 / 365, dias) - 1);   // las cuentas remuneradas suman intereses todos los días
  const infl = monto * (Math.pow(1 + infMensual / 100, dias / 30) - 1); // lo que pierde la plata quieta por la suba de precios
  return { pf, cta, infl };
}

function Comparador() {
  const [m, setM] = useState('500000'), [dias, setDias] = useState('30'), [tpf, setTpf] = useState(''), [tcta, setTcta] = useState(''), [inf, setInf] = useState('');
  const M = pn(m), D = Math.max(1, Math.round(pn(dias))), I = pn(inf);
  const r = comparar(M, D, pn(tpf), pn(tcta), I);
  const filas = [
    { k: 'pf', t: 'Plazo fijo', s: `La plata queda quieta ${D} días`, g: pn(tpf) > 0 ? r.pf : null },
    { k: 'cta', t: 'Cuenta que rinde o billetera', s: 'La podés sacar cuando quieras', g: pn(tcta) > 0 ? r.cta : null },
    { k: 'ef', t: 'Dejarla quieta en la cuenta o en efectivo', s: 'No gana nada', g: 0 }
  ];
  const best = filas.filter((f) => f.g != null).sort((a, b) => (b.g as number) - (a.g as number))[0];
  return (<>
    <Item><div className="rounded-xl2 bg-surface border border-line shadow-card p-4 sm:p-5 flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_6.5rem] gap-3 items-end">
        <Field label="¿Cuánta plata?" htmlFor="cm"><MoneyInput id="cm" value={m} onChange={setM} /></Field>
        <Field label="¿Por cuántos días?" htmlFor="cd"><TextInput id="cd" numeric value={dias} onChange={setDias} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3 items-start">
        <Field label="TNA del plazo fijo (%)" htmlFor="cp" hint="La que te ofrece tu banco hoy"><TextInput id="cp" decimal value={tpf} onChange={setTpf} placeholder="Ej: 30" /></Field>
        <Field label="TNA de tu cuenta o billetera (%)" htmlFor="cr" hint="La que figura en la app"><TextInput id="cr" decimal value={tcta} onChange={setTcta} placeholder="Ej: 27" /></Field>
      </div>
      <Field label={<>Inflación mensual estimada (%) <span className="text-muted font-normal">(opcional)</span></>} hint="Para saber si le ganás a la suba de precios" htmlFor="ci"><div className="w-[9rem]"><TextInput id="ci" decimal value={inf} onChange={setInf} placeholder="Ej: 2" /></div></Field>
    </div></Item>
    <Item><ul className="rounded-xl2 bg-surface border border-line divide-y divide-line overflow-hidden" aria-live="polite">
      {filas.map((f) => {
        const real = f.g != null && I > 0 ? f.g - r.infl : null, top = best && best.k === f.k && (f.g as number) > 0;
        return (
          <li key={f.k} className={cx('p-4 flex items-start justify-between gap-3', top && 'bg-mint')}>
            <span className="min-w-0"><b className="block leading-tight">{f.t}{top && <span className="ml-2 inline-flex rounded-full bg-accent text-onaccent px-2 py-0.5 text-[.75rem] align-middle">Rinde más</span>}</b><span className="block text-[.86rem] text-muted mt-0.5">{f.s}</span></span>
            <span className="text-right shrink-0">
              <b className="block num text-[1.1rem]">{f.g == null ? 'Falta la tasa' : '+ ' + money(f.g)}</b>
              {real != null && <span className={cx('block text-[.82rem] num', real >= 0 ? 'text-accent' : 'text-bad')}>{real >= 0 ? 'Le ganás a la inflación por ' + money(real) : 'Perdés ' + money(-real) + ' contra la inflación'}</span>}
            </span>
          </li>
        );
      })}
    </ul></Item>
    {I > 0 && <Item><p className="text-[.92rem] text-muted num">En {D} días, con {fmt(I, 1)} % de inflación por mes, tus {money(M)} pierden unos {money(r.infl)} de poder de compra si no rinden nada.</p></Item>}
  </>);
}

export default function Calculadora() {
  const [tab, setTab] = useState<'cmp' | 'pf' | 'comp'>('cmp');
  const [m, setM] = useState('500000'), [tna, setTna] = useState(''), [dias, setDias] = useState('30');
  const [ini, setIni] = useState('100000'), [ap, setAp] = useState('20000'), [tasa, setTasa] = useState(''), [an, setAn] = useState('5'), [inf, setInf] = useState('');
  const pf = plazoFijo(pn(m), pn(tna), Math.max(1, pn(dias)));
  const cp = compuesto(pn(ini), pn(ap), pn(tasa), Math.max(0, pn(an)), pn(inf));
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/inversiones', label: 'Inversiones' }} title="¿Dónde rinde más mi plata?" lead="Compará con las tasas que te ofrecen hoy tu banco y tu billetera. No es una recomendación: las tasas cambian y las informa cada entidad." /></Item>
      <Item><Tabs id="calc" tabs={[['cmp', 'Comparar'], ['pf', 'Plazo fijo'], ['comp', 'A largo plazo']]} value={tab} onChange={setTab} /></Item>
      {tab === 'cmp' ? <Comparador /> : tab === 'pf' ? (<>
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
