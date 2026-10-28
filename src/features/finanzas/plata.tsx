import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ListChecks, LineChart, CalendarDays, PiggyBank, Calculator, Share2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore, mut } from '../../store';
import Counter from '../../ui/bits/Counter/Counter'; // dígitos que giran como un contador (React Bits)
import { PageHeader, Card, Hero, Button, Field, MoneyInput, TextInput, Progress, KV, Note, RowLink, RowList, Stagger, Item, CountUp, ListenButton, Legal, ease, cx } from '../../ui';
import { fmt, money, pn } from '../../lib/format';
import { wa } from '../../lib/share';
import { calc, simInf } from './calc';
import { RowEditor } from './shared';
import { AhorrosPaso } from './ahorros';
import { PLATA_STEPS } from '../../content/finanzas';
import { N } from '../../lib/narration';
import { resumenTexto } from '../Resumen';

const BACK = { to: '/finanzas/plata', label: 'Mi plata' };

export function PlataHub() {
  const d = useStore((s) => s.d), c = calc(d);
  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader back={{ to: '/finanzas', label: 'Finanzas' }} kicker="Finanzas" title="Mi plata" lead="Cargá tus números una vez y mirá con claridad cuánto te queda cada mes y cuánto te duran tus ahorros." /></Item>
      <Item>
        <Hero>
          {!c.has ? (<>
            <div className="text-onbrand/80 text-[.98rem]">Para empezar</div>
            <h2 className="text-[1.7rem] text-onbrand mt-1">Cargá tus números en 4 pasos</h2>
            <p className="opacity-85 mt-1">Ingresos, gastos, ahorros y deudas. Tarda unos 5 minutos.</p>
            <div className="mt-5"><Button variant="glow" to="/finanzas/plata/numeros/0" iconRight={<ArrowRight />}>Empezar</Button></div>
          </>) : c.anios != null ? (<>
            <div className="text-onbrand/80 text-[.98rem]">Tus ahorros alcanzan</div>
            <div className="font-head font-semibold text-[3.6rem] leading-none text-glow mt-2"><CountUp value={Math.min(c.anios, 99.9)} format={(n) => fmt(n, 1)} /><span className="font-body text-[1.1rem] text-onbrand ml-2">años</span></div>
            <p className="opacity-85 mt-2">Cada mes gastás {money(c.gastoNeto)} más de lo que ingresa. Con tus ahorros netos de {money(c.neto)}, te alcanza este tiempo si nada cambia.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Button variant="glow" to="/finanzas/plata/resultado">Ver mi resultado</Button><Button variant="onbrand" to="/finanzas/plata/inflacion">Probar con inflación</Button></div>
          </>) : (<>
            <div className="text-onbrand/80 text-[.98rem]">Cada mes te sobran</div>
            <div className="font-head font-semibold leading-none text-glow mt-2"><Counter value={Math.abs(c.brecha)} prefix={'$\u00a0'} locale="es-AR" fontSize={money(c.brecha).length > 11 ? 32 : 46} fontWeight={700} /></div>
            <p className="opacity-85 mt-2">Tus ingresos cubren tus gastos. Ese margen puede ir a tu meta de ahorro.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Button variant="glow" to="/finanzas/plata/resultado">Ver mi resultado</Button><Button variant="onbrand" to="/finanzas/plata/inflacion">Probar con inflación</Button></div>
          </>)}
        </Hero>
      </Item>
      <Item className="flex flex-col gap-3">
        <RowList>
          <RowLink to="/finanzas/plata/numeros/0" icon={<ListChecks />} title="Mis números" sub={c.has ? 'Ingresos, gastos, ahorros y deudas · editar' : 'Empezá acá'} />
          <RowLink to="/finanzas/plata/resultado" icon={<PiggyBank />} title="Mi resultado y mi meta" sub="Brecha mensual, colchón y meta de ahorro" />
          <RowLink to="/finanzas/plata/inflacion" icon={<LineChart />} title="Simulador de inflación" sub="¿Qué pasa con tu plata si los precios suben?" />
          <RowLink to="/finanzas/plata/seguimiento" icon={<CalendarDays />} title="Seguimiento del mes" sub="Lo que planeaste contra lo que gastaste" />
          <RowLink to="/finanzas/plata/grande" icon={<Calculator />} title="Planificador de un monto grande" sub="Indemnización, herencia o venta: cómo repartirlo" />
        </RowList>
      </Item>
      <Item><Legal>Estas herramientas calculan con los números que cargás vos. Son estimaciones, no predicciones ni asesoramiento financiero.</Legal></Item>
    </Stagger>
  );
}

const STEPS = PLATA_STEPS;

export function Numeros() {
  const { i: is } = useParams(); const nav = useNavigate();
  const i = Math.max(0, Math.min(3, Number(is) || 0)), st = STEPS[i];
  const d = useStore((s) => s.d), c = calc(d);
  const tot = { ing: c.ing, gas: c.gas, aho: c.ahoARS, deu: c.deu }[st.k];
  return (
    <div className="flex flex-col gap-6">
      <PageHeader back={{ to: i ? `/finanzas/plata/numeros/${i - 1}` : '/finanzas/plata', label: i ? 'Atrás' : 'Mi plata' }} title="" />
      <div className="flex gap-1.5">{STEPS.map((_, k) => <motion.span key={k} className={cx('h-2 flex-1 rounded-full', k <= i ? 'bg-accent' : 'bg-line')} layout />)}</div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, transform: 'translate(20px, 0px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} exit={{ opacity: 0, transform: 'translate(-20px, 0px)' }} transition={{ duration: 0.22, ease }} className="flex flex-col gap-5">
          <div><div className="text-accent font-bold text-[.85rem]">Paso {i + 1} de 4</div><h1 className="text-[1.9rem] mt-1">{st.t}</h1><p className="text-muted mt-1">{st.h}</p></div>
          <ListenButton text={N.ask(st.t, st.h)} />
          {st.k === 'aho' ? <AhorrosPaso /> : (<>
            <Card><RowEditor path={'plata.' + st.k} rows={(d.plata as any)[st.k]} addLabel={st.add} /></Card>
            <Card tone="sunk" className="flex items-center justify-between gap-3"><span>{st.label}</span><b className="font-head font-semibold text-[1.6rem]"><CountUp value={tot} format={money} /></b></Card>
          </>)}
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-3">
        {i > 0 && <Button variant="ghost" icon={<ArrowLeft />} onClick={() => nav(`/finanzas/plata/numeros/${i - 1}`)}>Atrás</Button>}
        <Button className="flex-1" iconRight={<ArrowRight />} onClick={() => nav(i === 3 ? '/finanzas/plata/resultado' : `/finanzas/plata/numeros/${i + 1}`)}>{i === 3 ? 'Ver mi resultado' : 'Siguiente'}</Button>
      </div>
    </div>
  );
}

export function Resultado() {
  const d = useStore((s) => s.d), c = calc(d), M = d.plata.meta;
  if (!c.has) return (
    <div className="flex flex-col gap-5"><PageHeader back={BACK} title="Mi resultado" /><Note tone="warn">Todavía no cargaste tus números.</Note><div><Button to="/finanzas/plata/numeros/0">Cargar mis números</Button></div></div>
  );
  const col = c.gas * 24, m = pn(M.m);
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={BACK} kicker="Mi plata" title="Mi resultado" /></Item>
      <Item><Card>
        <h2 className="text-[1.3rem] mb-2">Cada mes</h2>
        <KV k="Ingresos" v={money(c.ing)} /><KV k="Gastos" v={money(c.gas)} />
        <KV total k={c.brecha >= 0 ? 'Te sobra' : 'Te falta'} v={money(Math.abs(c.brecha))} tone={c.brecha >= 0 ? 'pos' : 'neg'} />
        <p className="text-muted mt-2 text-[.95rem]">{c.brecha >= 0 ? 'Tus ingresos cubren tus gastos. Ese margen es el que podés ahorrar o destinar a un objetivo.' : 'Esta diferencia sale de tus ahorros todos los meses.'}</p>
      </Card></Item>
      <Item><Card>
        <h2 className="text-[1.3rem] mb-2">Tus ahorros</h2>
        <KV k="Ahorros (en pesos)" v={money(c.ahoARS)} /><KV k="Deudas" v={'− ' + money(c.deu)} />
        <KV total k="Ahorro neto" v={money(c.neto)} tone={c.neto >= 0 ? undefined : 'neg'} />
        <div className="mt-3 flex flex-col gap-3">
          {c.usdSinCot && <Note tone="warn">Falta la cotización del dólar: tus dólares no están sumados.</Note>}
          <Note tone={c.anios == null || c.anios >= 2 ? 'good' : 'info'}>
            {c.anios == null ? <><b>Tus ingresos cubren tus gastos.</b> Tus ahorros no se consumen por esta diferencia.</>
              : c.neto <= 0 ? <><b>Tus deudas igualan o superan tus ahorros.</b> Conviene ordenar primero las deudas.</>
              : <><b>Tus ahorros netos alcanzan unos {fmt(c.anios, 1)} años</b> si todo sigue igual. Probá el simulador de inflación para un escenario más realista.</>}
          </Note>
        </div>
      </Card></Item>
      <Item><Card className="flex flex-col gap-3">
        <div><h2 className="text-[1.3rem]">Colchón de 2 años</h2><p className="text-muted text-[.92rem]">Una reserva de 24 meses de gastos da tranquilidad ante imprevistos.</p></div>
        <Progress value={Math.max(c.neto, 0)} max={col} label={`${Math.round(Math.min(Math.max(c.neto, 0) / (col || 1), 1) * 100)}% cubierto`} right={`${money(Math.max(c.neto, 0))} de ${money(col)}`} />
      </Card></Item>
      <Item><Card className="flex flex-col gap-4">
        <h2 className="text-[1.3rem]">Mi meta de ahorro</h2>
        <Field label="¿Para qué?" htmlFor="mn"><TextInput id="mn" value={M.n} onChange={(v) => mut((x) => { x.plata.meta.n = v; })} placeholder="Ej: arreglar la casa, un viaje, fondo de salud" /></Field>
        <Field label="¿Cuánto necesitás juntar?" htmlFor="mm"><MoneyInput id="mm" value={M.m} onChange={(v) => mut((x) => { x.plata.meta.m = v; })} /></Field>
        {m > 0 ? <Progress tone="glow" value={Math.max(c.neto, 0)} max={m} label={`${Math.round(Math.min(Math.max(c.neto, 0) / m, 1) * 100)}% de tu meta`} right={`${money(Math.max(c.neto, 0))} de ${money(m)}`} />
          : <p className="text-muted text-[.92rem]">Poné un monto para ver tu avance.</p>}
      </Card></Item>
      <Item className="flex flex-wrap gap-3">
        <Button icon={<Share2 />} href={wa(resumenTexto(d))}>Compartir por WhatsApp</Button>
        <Button variant="ghost" icon={<FileText />} to="/resumen">Hoja para imprimir</Button>
      </Item>
    </Stagger>
  );
}

function Chart({ rows }: { rows: { y: number; aho: number }[] }) {
  const W = 560, H = 230, L = 64, B = 30, T = 14, R = 24, max = Math.max(...rows.map((r) => r.aho)) || 1, n = rows.length - 1 || 1;
  const x = (i: number) => L + ((W - L - R) * i) / n, y = (v: number) => T + (H - T - B) * (1 - v / max);
  const line = rows.map((r, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(r.aho).toFixed(1)).join(' ');
  const area = line + ` L${x(n)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const lab = (v: number) => (v >= 1e6 ? fmt(v / 1e6, 1) + ' M' : fmt(v / 1e3) + ' mil');
  const step = Math.ceil(n / 5);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Evolución de tus ahorros por año">
      <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgb(var(--accent))" stopOpacity=".28" /><stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0" /></linearGradient></defs>
      {[0, 0.5, 1].map((f) => (<g key={f}><line x1={L} x2={W - R} y1={y(max * f)} y2={y(max * f)} stroke="rgb(var(--line))" /><text x={L - 8} y={y(max * f) + 4} textAnchor="end" fontSize="12" fill="rgb(var(--muted))">{lab(max * f)}</text></g>))}
      {rows.map((r, i) => (i % step === 0 || i === n) && <text key={r.y} x={x(i)} y={H - 8} textAnchor={i === n ? 'end' : i === 0 ? 'start' : 'middle'} fontSize="12" fill="rgb(var(--muted))">{r.y === 0 ? 'Hoy' : 'Año ' + r.y}</text>)}
      <motion.path d={area} fill="url(#ga)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
      <motion.path d={line} fill="none" stroke="rgb(var(--accent))" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease }} key={line} />
    </svg>
  );
}

export function Inflacion() {
  const d = useStore((s) => s.d), c = calc(d), I = d.plata.inf, s = simInf(d);
  const set = (k: keyof typeof I) => (v: string) => mut((x) => { x.plata.inf[k] = v; });
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={BACK} kicker="Mi plata" title="Simulador de inflación" lead="Los precios suben todos los años. Mirá qué pasa con tus ahorros según cuánto suban tus gastos y tu ingreso." />
      <Card className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Gasto mensual hoy" htmlFor="i1"><MoneyInput id="i1" value={I.gas} onChange={set('gas')} placeholder={c.gas ? fmt(c.gas) : '0'} /></Field>
          <Field label="Ingreso mensual hoy" htmlFor="i2"><MoneyInput id="i2" value={I.ing} onChange={set('ing')} placeholder={c.ing ? fmt(c.ing) : '0'} /></Field>
        </div>
        <Field label="Ahorros que usarías" htmlFor="i3" hint="Si lo dejás vacío usamos tu ahorro neto de “Mis números”."><MoneyInput id="i3" value={I.aho} onChange={set('aho')} placeholder={c.neto > 0 ? fmt(c.neto) : '0'} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Inflación anual (%)" htmlFor="i4"><TextInput id="i4" decimal value={I.inf} onChange={set('inf')} /></Field>
          <Field label="Aumento de tu ingreso (%)" htmlFor="i5"><TextInput id="i5" decimal value={I.aum} onChange={set('aum')} /></Field>
        </div>
        <Field label="¿Cuántos años mirar? (1 a 30)" htmlFor="i6"><TextInput id="i6" numeric value={I.anios} onChange={set('anios')} /></Field>
        <p className="text-[.85rem] text-muted">Los porcentajes son supuestos tuyos: probá varios. El cálculo no suma intereses a tus ahorros, para ser prudente.</p>
      </Card>
      <Note tone={s.out == null ? 'good' : 'warn'}>{s.out == null ? <b>Con estos supuestos, tus ahorros no se agotan en {s.N} años.</b> : <b>Con estos supuestos, tus ahorros alcanzarían hasta aproximadamente el año {fmt(s.out, 1)}.</b>}</Note>
      <Card><KV k={`Tu ingreso de hoy (${money(s.ing)}) valdría, en poder de compra de hoy, dentro de ${s.N} años`} v={money(s.poder)} tone={s.poder < s.ing ? 'neg' : 'pos'} /></Card>
      <Card><Chart rows={s.rows} /></Card>
      <Card pad={false} className="scroll-x">
        <table className="w-full text-[.92rem] num">
          <thead><tr className="text-muted text-[.8rem]">{['Año', 'Gasto/mes', 'Ingreso/mes', 'Ahorro'].map((h, i) => <th key={h} className={cx('px-4 py-3 font-bold', i ? 'text-right' : 'text-left')}>{h}</th>)}</tr></thead>
          <tbody>{s.rows.map((r) => (
            <tr key={r.y} className="border-t border-line">
              <td className="px-4 py-2.5">{r.y === 0 ? 'Hoy' : r.y}</td><td className="px-4 py-2.5 text-right whitespace-nowrap">{money(r.gas)}</td>
              <td className="px-4 py-2.5 text-right whitespace-nowrap">{money(r.ing)}</td><td className={cx('px-4 py-2.5 text-right whitespace-nowrap', r.raw < 0 && 'text-bad font-bold')}>{r.raw < 0 ? 'agotado' : money(r.aho)}</td>
            </tr>))}</tbody>
        </table>
      </Card>
    </div>
  );
}

export function Seguimiento() {
  const d = useStore((s) => s.d);
  const [ym, setYm] = React.useState(() => new Date().toISOString().slice(0, 7));
  const gas = d.plata.gas.filter((g) => g.n || pn(g.m)), real = d.plata.seg[ym] || {};
  const [y, m] = ym.split('-').map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  const move = (k: number) => { const dt = new Date(y, m - 1 + k, 1); setYm(dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0')); };
  const plan = gas.reduce((t, g) => t + pn(g.m), 0), re = gas.reduce((t, g) => t + pn(real[g.id]), 0), diff = re - plan;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={BACK} kicker="Mi plata" title="Seguimiento del mes" lead="Anotá lo que gastaste en cada rubro y comparalo con lo que planeaste." />
      <div className="flex items-center justify-between">
        <button onClick={() => move(-1)} aria-label="Mes anterior" className="grid place-items-center size-12 rounded-full border border-line bg-surface"><ChevronLeft className="size-5" /></button>
        <AnimatePresence mode="wait"><motion.h2 key={ym} initial={{ opacity: 0, transform: 'translate(0px, 6px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} exit={{ opacity: 0 }} className="text-[1.4rem] capitalize">{label}</motion.h2></AnimatePresence>
        <button onClick={() => move(1)} aria-label="Mes siguiente" className="grid place-items-center size-12 rounded-full border border-line bg-surface"><ChevronRight className="size-5" /></button>
      </div>
      {gas.length ? (<>
        <Card className="flex flex-col gap-4">
          {gas.map((g) => {
            const v = real[g.id] ?? '', x = pn(v) - pn(g.m);
            return (
              <Field key={g.id} label={<span>{g.n || 'Sin nombre'} <span className="text-muted font-normal">· plan {money(pn(g.m))}</span></span>}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0"><MoneyInput label={'Gastado en ' + g.n} value={v} onChange={(nv) => mut((dd) => { (dd.plata.seg[ym] ||= {})[g.id] = nv; })} /></div>
                  <span className={cx('num text-[.9rem] w-24 text-right font-bold', x > 0 ? 'text-bad' : 'text-accent')}>{v === '' ? '' : (x > 0 ? '+' : x < 0 ? '−' : '') + money(Math.abs(x)).replace('−', '')}</span>
                </div>
              </Field>
            );
          })}
        </Card>
        <Card><KV k="Planeado" v={money(plan)} /><KV k="Gastado" v={money(re)} /><KV total k={diff > 0 ? 'Te pasaste por' : diff < 0 ? 'Te quedó de margen' : 'Justo en lo planeado'} v={money(Math.abs(diff))} tone={diff > 0 ? 'neg' : 'pos'} /></Card>
      </>) : (<><Note tone="warn">Primero cargá tus gastos en “Mis números”.</Note><div><Button to="/finanzas/plata/numeros/1">Cargar mis gastos</Button></div></>)}
    </div>
  );
}

export function Grande() {
  const d = useStore((s) => s.d), c = calc(d), G = d.plata.grande, monto = pn(G.monto);
  let rest = monto; const items: { n: string; need: number; v: number }[] = [];
  const take = (n: string, need: number) => { const v = Math.min(rest, Math.max(need, 0)); rest -= v; items.push({ n, need, v }); };
  if (monto > 0) {
    if (c.deu > 0) take('1. Deudas', c.deu);
    take(`2. Colchón de ${G.meses} meses de gastos`, c.gas * pn(G.meses));
    G.proy.forEach((p, i) => { if (pn(p.m) > 0) take(`${3 + i}. ${p.n || 'Proyecto'}`, pn(p.m)); });
  }
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={BACK} kicker="Mi plata" title="Planificador de un monto grande" lead="Si vas a recibir o tenés una suma importante, repartila con orden antes de gastarla." />
      <Card className="flex flex-col gap-4">
        <Field label="¿De cuánto es el monto?" htmlFor="g1"><MoneyInput id="g1" value={G.monto} onChange={(v) => mut((x) => { x.plata.grande.monto = v; })} /></Field>
        <Field label="¿Cuántos meses de gastos querés dejar de colchón?">
          <div className="flex gap-2">{['6', '12', '24'].map((m) => <Button key={m} size="sm" variant={G.meses === m ? 'primary' : 'ghost'} onClick={() => mut((x) => { x.plata.grande.meses = m; })}>{m} meses</Button>)}</div>
        </Field>
        <Field label="Tus proyectos"><RowEditor path="plata.grande.proy" rows={G.proy} addLabel="Agregar proyecto" namePh="Proyecto" /></Field>
      </Card>
      {monto > 0 ? (
        <Card className="flex flex-col gap-4">
          {items.map((it) => <Progress key={it.n} value={it.v} max={it.need || 1} label={it.n} right={`${money(it.v)} de ${money(it.need)}`} />)}
          <KV total k={rest > 0 ? 'Te sobra para decidir' : 'Queda sin cubrir'} v={money(rest)} />
        </Card>
      ) : <p className="text-muted">Poné el monto para ver cómo se reparte.</p>}
      {c.gas <= 0 && <Note tone="warn">Cargá tus gastos en “Mis números” para calcular el colchón.</Note>}
      <Note tone="info">Orden sugerido: primero deudas, luego un colchón, después proyectos. Antes de un movimiento grande, consultá con alguien de confianza o un profesional.</Note>
    </div>
  );
}
