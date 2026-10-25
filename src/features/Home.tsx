import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, ChevronRight, FileText, Settings, CalendarClock, PiggyBank, Scale, HeartPulse } from 'lucide-react';
import { useStore, useD } from '../store';
import { Button, Stagger, Item, Note, cx, Mascot, LivingSea, RowLink } from '../ui';
import { urgentes } from './finanzas/vencimientos';
import { money } from '../lib/format';
import { calc, tramSiguiente, taSiguiente } from './finanzas/calc';
import { nextLesson } from './digital/logic';
import { INV_MODULES, modPath } from '../content/learn';
import { LEGAL } from '../config';

/* Un solo próximo paso, el más útil */
function useNextStep() {
  const d = useStore((s) => s.d);
  const c = calc(d);
  if (!c.has) return { t: 'Cargá tus ingresos y gastos', s: 'En 5 minutos ves con claridad tu mes.', go: '/finanzas/plata/numeros/0', tag: 'Finanzas' };
  if (!d.md.diag.done) return { t: 'Armá tu ruta en Mundo digital', s: 'Unas preguntas cortas para empezar por lo que más te sirve.', go: '/digital/diagnostico', tag: 'Mundo digital' };
  const n = nextLesson(d); if (n) return { t: n.l.t, s: n.m.n + ' · ' + n.l.min + ' minutos', go: modPath(n.m) + '/' + n.l.id, tag: 'Mundo digital' };
  const inv = INV_MODULES[0].lessons.find((l) => !d.md.lec[l.id]?.done); if (inv) return { t: inv.t, s: 'Inversiones · ' + inv.min + ' minutos', go: modPath(INV_MODULES[0]) + '/' + inv.id, tag: 'Inversiones' };
  const t = d.tr.sit.sit ? tramSiguiente(d) : null; if (t) return { t: t.txt, s: 'Guía: ' + t.g.t, go: '/finanzas/tramites/guia/' + t.g.id, tag: 'Trámites' };
  const k = taSiguiente(d); if (k) return { t: k.txt, s: 'Generá un ingreso extra con lo que sabés.', go: k.go, tag: 'Mi talento' };
  return null;
}

export default function Home() {
  const d = useStore((s) => s.d);
  const nombre = useD((x) => x.perfil.nombre);
  const mujer = d.perfil.sexo === 'mujer';
  const c = calc(d);
  const due = Date.now() - d.lastBackup > 30 * 864e5 && (c.has || d.md.diag.done || Object.keys(d.tr.docs).length > 0);
  const main = useNextStep();
  const greet = (() => { const h = new Date().getHours(); return h < 13 ? 'Buen día' : h < 20 ? 'Buenas tardes' : 'Buenas noches'; })();
  const [firstVisit] = useState(() => { try { const f = !sessionStorage.getItem('aliada.hola'); sessionStorage.setItem('aliada.hola', '1'); return f; } catch { return false; } });
  const urg = urgentes(d), venc = d.venc.items.length > 0;

  return (
    <Stagger className="flex flex-col gap-6">
      <Item className="flex items-end justify-between gap-3">
        <div className="min-w-0 pb-2">
          <h1 className="text-[2rem] sm:text-[2.3rem] leading-tight">{greet}{nombre ? ', ' + nombre : ''}</h1>
          <p className="text-muted mt-1 first-letter:uppercase">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Mascot pose="wave" gesture={firstVisit ? 'wave' : 'none'} size={92} label="La mascota de Aliada te saluda" />
      </Item>

      {main && (
        <Item>
          <NextStepHero tag={main.tag} title={main.t} sub={main.s} go={main.go} />
        </Item>
      )}

      {urg.length > 0 && (
        <Item><Link to="/finanzas/vencimientos" className="press block rounded-xl2 bg-surface border border-line shadow-card p-4">
          <span className="flex items-center justify-between gap-3"><b className="text-[1.1rem]">Pagos para tener en cuenta</b><ChevronRight className="size-5 text-muted" /></span>
          <ul className="mt-2 flex flex-col gap-1.5">
            {urg.slice(0, 3).map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">{e.n}{e.m > 0 && <span className="text-muted num"> · {money(e.m)}</span>}</span>
                <span className={cx('shrink-0 rounded-full px-2.5 py-0.5 text-[.8rem] font-semibold', e.diff < 0 ? 'bg-badsoft text-bad' : e.diff === 0 ? 'bg-warn text-warnink' : 'bg-ambersoft text-amber')}>{e.txt}</span>
              </li>
            ))}
          </ul>
        </Link></Item>
      )}

      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.25rem]">Resolvé algo hoy</h2>
        <RowLink to="/finanzas/vencimientos" icon={<CalendarClock />} tone="amber" title="Mis vencimientos" sub={venc ? 'Qué pagaste y qué falta este mes' : 'Anotá luz, gas, tarjeta… y no se te pase ninguno'} />
        <RowLink to="/finanzas/plata/numeros/2" icon={<PiggyBank />} tone="mint" title="¿Cuánto tengo ahorrado?" sub="Plazo fijo, cuentas, efectivo y dólares, sumado en pesos" />
        <RowLink to="/finanzas/cuotas" icon={<Scale />} tone="sky" title="¿Cuotas o contado?" sub="La cuenta hecha antes de comprar" />
        <RowLink to="/inversiones/calculadora" icon={<TrendingUp />} tone="sky" title="¿Dónde rinde más mi plata?" sub="Plazo fijo o billetera, con las tasas de hoy" />
        <RowLink to="/salud" icon={<HeartPulse />} tone="violet" title="Mi ficha de salud" sub="Medicamentos, alergias y a quién avisar" />
      </Item>

      {due && <Item><Note tone="info" title="Guardá una copia de tus datos">Tus datos viven en este dispositivo. Hacé una copia desde Ajustes para no perderlos si cambiás de celular.</Note></Item>}

      <Item className="flex flex-wrap gap-2">
        <Button variant="quiet" size="sm" icon={<FileText />} to="/resumen">Mi resumen</Button>
        <Button variant="quiet" size="sm" icon={<Settings />} to="/ajustes">Ajustes</Button>
      </Item>
      <Item><p className="text-[.78rem] text-muted border-t border-line pt-4">{LEGAL}</p></Item>
    </Stagger>
  );
}
/* "Tu próximo paso" sobre la foto del escritorio en el mar, con la marea en movimiento.
   El escritorio queda siempre a la derecha y el texto nunca lo pisa:
   - celular: la foto arriba (entera, un poco acercada al escritorio) y el texto debajo;
   - pantallas más anchas: la foto cubre la tarjeta y el texto va a la izquierda, sobre el cielo y el mar. */
function NextStepHero({ tag, title, sub, go }: { tag: string; title: string; sub: string; go: string }) {
  return (
    <section className="relative overflow-hidden rounded-xl3 shadow-lift isolate bg-surface border border-line sm:border-0">
      <div className="relative sm:absolute sm:inset-0 aspect-[16/9] sm:aspect-auto overflow-hidden">
        <div className="absolute inset-0 origin-[96%_78%] scale-[1.16] sm:scale-100">
          <LivingSea src="inicio/mar-1000.webp" mask="inicio/mar-mask.png" hz={0.292} pos={[1, 0.6]} posSm={[1, 0.62]} imgClass="object-[100%_60%] sm:object-[100%_62%]" />
        </div>
        <div className="hidden sm:block absolute inset-0 hero-sea-veil" />
      </div>
      <div className="relative px-5 pt-4 pb-6 sm:p-8 sm:pr-[50%] sm:min-h-[20rem] flex flex-col sm:justify-center">
        <h2 className="text-[1.5rem] sm:text-[1.8rem] text-ink sm:text-[#0b2236] leading-tight">{title}</h2>
        <p className="text-muted sm:text-[#23455a] mt-1.5">{sub}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button to={go} iconRight={<ArrowRight />} className="sm:!bg-[#0a6e57] sm:!border-[#0a6e57] sm:!text-white">Continuar</Button>
          <span className="text-[.9rem] text-muted sm:text-[#23455a]">Tu próximo paso en {tag}</span>
        </div>
      </div>
    </section>
  );
}
