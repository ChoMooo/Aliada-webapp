import React from 'react';
import { Printer, Share2, Copy, Check } from 'lucide-react';
import { useStore, type Data } from '../store';
import { PageHeader, Button, cx } from '../ui';
import { fmt, money, pn } from '../lib/format';
import { calc, progresoTram, plan, gProg, SIT_N, W, taPlanProg } from './finanzas/calc';
import { GUIA, OP } from '../content/finanzas';
import { MODULES, FIN_MODULES, INV_MODULES } from '../content/learn';
import { modProg, setupProg } from './digital/logic';
import { copyText, wa } from '../lib/share';
import { toast } from '../ui/toast';
import { estados } from './finanzas/vencimientos';
import { misionesPara, progresoMision } from '../content/misiones';

/* El resumen se arma una sola vez como datos; de ahí salen la hoja que se ve
   y el texto plano para copiar o mandar por WhatsApp (así nunca se contradicen). */
type Row = { k: string; v?: string; done?: boolean; sub?: boolean };
type Sec = { t: string; rows: Row[] };

export function resumenData(d: Data) {
  const c = calc(d), pt = progresoTram(d), S: Sec[] = [];
  const sec = (t: string) => { const x: Sec = { t, rows: [] }; S.push(x); return x.rows; };
  const lec = (p: { n: number; t: number }) => p.n + ' de ' + p.t + ' lecciones';

  /* Misiones: las hechas con su resultado, y las que están en curso */
  const MS = misionesPara(d).map((m) => ({ m, p: progresoMision(d, m) })).filter((x) => x.p.n > 0);
  if (MS.length) {
    const rm = sec('Mis misiones');
    MS.forEach(({ m, p }) => { const R = p.fin ? m.res(d) : null; rm.push({ k: m.t, v: p.fin ? (R?.big ? R.big + ' ' + R.t : 'Hecha') : `${p.n} de ${p.t} pasos`, done: p.fin }); });
  }

  let r = sec('Mi plata');
  if (c.has) {
    r.push({ k: 'Ingresos por mes', v: money(c.ing) }, { k: 'Gastos por mes', v: money(c.gas) }, { k: c.brecha >= 0 ? 'Me sobra por mes' : 'Me falta por mes', v: money(Math.abs(c.brecha)) });
    const P = c.ahoParts;
    ([['Plazo fijo', P.pf], ['Cuentas y billeteras', P.cu], ['Efectivo', P.ef], ['Otros ahorros', P.otros]] as [string, number][]).forEach(([k, v]) => { if (v > 0) r.push({ k, v: money(v), sub: true }); });
    if (P.usd > 0) r.push({ k: 'Dólares (US$ ' + fmt(P.usd) + ')', v: c.cot > 0 ? money(P.usdARS) : 'sin cotización', sub: true });
    r.push({ k: 'Ahorros en pesos', v: money(c.ahoARS) }, { k: 'Ahorros netos (menos deudas)', v: money(c.neto) });
    r.push({ k: c.anios == null ? 'Mis ingresos cubren mis gastos.' : 'Mis ahorros alcanzan unos ' + fmt(c.anios, 1) + ' años.' });
    const meta = pn(d.plata.meta.m);
    if (meta > 0) r.push({ k: 'Meta' + (d.plata.meta.n ? ' (' + d.plata.meta.n + ')' : ''), v: money(meta) + ' · ' + Math.round(Math.min(Math.max(c.neto, 0) / meta, 1) * 100) + '%' });
  } else r.push({ k: 'Todavía sin cargar.' });

  const E = estados(d);
  if (E.length) { r = sec('Mis vencimientos del mes'); E.forEach((e) => r.push({ k: e.n + ' · día ' + e.dia, v: e.m > 0 ? money(e.m) : undefined, done: e.pagado })); }

  r = sec('Mis trámites');
  if (d.tr.sit.sit) {
    r.push({ k: 'Situación', v: SIT_N[d.tr.sit.sit] }, { k: 'Avance', v: pt.n + ' de ' + pt.t + ' tareas' });
    plan(d).forEach((e) => { const g = GUIA(e.id), p = gProg(d, g); r.push({ k: g.t, v: p.n + '/' + p.t, done: p.n === p.t }); });
    d.tr.notas.filter((x) => !x.ok).forEach((x) => r.push({ k: 'Pendiente: ' + x.t }));
  } else r.push({ k: 'Todavía sin situación elegida.' });

  r = sec('Mi talento');
  const w = W(d), op = d.ta.sel ? OP(d.ta.sel) : null;
  if (op && w) {
    r.push({ k: 'Oportunidad elegida', v: op.n });
    if (w.of.que) r.push({ k: 'Mi oferta', v: w.of.que + (pn(w.of.precio) > 0 ? ' · ' + money(pn(w.of.precio)) : '') });
    const pp = taPlanProg(d); if (pp.t) r.push({ k: 'Plan de 30 días', v: pp.n + ' de ' + pp.t + ' tareas' });
  } else r.push({ k: 'Todavía sin oportunidad elegida.' });

  FIN_MODULES.forEach((m) => { sec(m.n).push({ k: 'Avance', v: lec(modProg(d, m)) }); });
  r = sec('Mundo digital');
  const sp = setupProg(d); r.push({ k: 'Primeros ajustes del celular', v: sp.n + ' de ' + sp.t });
  MODULES.forEach((m) => r.push({ k: m.n, v: lec(modProg(d, m)) }));
  r.push({ k: 'Escudo antiestafas', v: Object.keys(d.escudo.vistos).length + ' situaciones practicadas' });
  r = sec('Inversiones');
  INV_MODULES.forEach((m) => r.push({ k: m.n, v: lec(modProg(d, m)) }));
  if (d.perfil.sexo === 'mujer') sec('Mi nueva versión').push({ k: 'Programa de 30 días', v: Object.keys(d.libro.dias).length + ' de 30' });
  return { nombre: d.perfil.nombre, fecha: new Date().toLocaleDateString('es-AR'), secs: S };
}

export function resumenTexto(d: Data) {
  const R = resumenData(d);
  const L = ['ALIADA DIGITAL · Mi resumen' + (R.nombre ? ' · ' + R.nombre : ''), R.fecha];
  R.secs.forEach((x) => {
    L.push('', x.t.toUpperCase());
    x.rows.forEach((w) => L.push((w.sub ? '  ' : '') + (w.done == null ? '' : w.done ? '[x] ' : '[ ] ') + w.k + (w.v ? ': ' + w.v : '')));
  });
  L.push('', 'Información de orientación general. Verificá en fuentes oficiales.');
  return L.join('\n');
}

export default function Resumen() {
  const d = useStore((s) => s.d);
  const t = resumenTexto(d);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader back={{ to: '/', label: 'Inicio' }} title="Mi resumen" lead="Una hoja con lo importante. Imprimila, guardala como PDF o mandala por WhatsApp." />
      <div className="no-print flex flex-wrap gap-3">
        <Button icon={<Printer />} onClick={() => { try { window.print(); } catch { toast('Usá “Copiar” o “WhatsApp”'); } }}>Imprimir o guardar PDF</Button>
        <Button variant="secondary" icon={<Share2 />} href={wa(t)}>WhatsApp</Button>
        <Button variant="ghost" icon={<Copy />} onClick={() => copyText(t)}>Copiar</Button>
      </div>
      <Hoja d={d} />
    </div>
  );
}

/* La hoja: un documento ordenado, legible en pantalla e impreso */
function Hoja({ d }: { d: Data }) {
  const R = resumenData(d);
  return (
    <article className="rounded-xl2 bg-surface border border-line shadow-card p-5 sm:p-7 print:shadow-none print:border-0 print:p-0">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-4 border-b border-ink/15">
        <h2 className="text-[1.35rem]">Mi resumen{R.nombre && <span className="text-muted font-normal"> · {R.nombre}</span>}</h2>
        <span className="text-[.88rem] text-muted num">{R.fecha}</span>
      </header>
      <div className="flex flex-col divide-y divide-line">
        {R.secs.map((x) => (
          <section key={x.t} className="py-4 break-inside-avoid">
            <h3 className="text-[1.05rem] mb-2">{x.t}</h3>
            <dl className="flex flex-col gap-1.5 text-[.95rem]">
              {x.rows.map((w, i) => (
                <div key={i} className={cx('grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4', w.sub && 'pl-4')}>
                  <dt className={cx('flex items-baseline gap-2 min-w-0', w.v ? 'text-muted' : 'text-ink')}>
                    {w.done != null && (
                      <span aria-label={w.done ? 'Hecho' : 'Pendiente'} className={cx('self-center grid place-items-center size-[1.05rem] rounded-[5px] border-[1.5px] shrink-0', w.done ? 'bg-teal border-teal text-surface' : 'border-ink/30')}>
                        {w.done && <Check className="size-3" strokeWidth={3.5} />}
                      </span>
                    )}
                    <span className={cx(w.done && 'line-through decoration-1')}>{w.k}</span>
                  </dt>
                  {w.v && <dd className="num font-semibold text-right max-w-[13rem] [overflow-wrap:anywhere]">{w.v}</dd>}
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <p className="pt-4 border-t border-line text-[.82rem] text-muted">Información de orientación general. Verificá en fuentes oficiales.</p>
    </article>
  );
}
