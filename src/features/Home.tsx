import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, ChevronRight, FileText, Settings, HeartPulse, Wallet, Smartphone, BookHeart } from 'lucide-react';
import { useStore, useD } from '../store';
import { Button, Stagger, Item, Note, cx, Mascot, LivingSea } from '../ui';
import { urgentes } from './finanzas/vencimientos';
import { money } from '../lib/format';
import { calc, tramSiguiente, taSiguiente } from './finanzas/calc';
import { nextLesson, modProg } from './digital/logic';
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
  const nombre = useD((x) => x.perfil.nombre).trim().split(/\s+/)[0] ?? ''; // el saludo usa solo el primer nombre
  const c = calc(d);
  const due = Date.now() - d.lastBackup > 30 * 864e5 && (c.has || d.md.diag.done || Object.keys(d.tr.docs).length > 0);
  const main = useNextStep();
  const greet = (() => { const h = new Date().getHours(); return h < 13 ? 'Buen día' : h < 20 ? 'Buenas tardes' : 'Buenas noches'; })();
  const [firstVisit] = useState(() => { try { const f = !sessionStorage.getItem('aliada.hola'); sessionStorage.setItem('aliada.hola', '1'); return f; } catch { return false; } });
  const secs = useSections();

  return (
    <Stagger className="flex flex-col gap-7">
      <Item className="flex items-end justify-between gap-3">
        <div className="min-w-0 pb-2">
          <h1 className="text-[2.1rem] sm:text-[2.4rem] leading-[1.1] [overflow-wrap:anywhere] text-balance">{greet}{nombre ? ',' : ''}{nombre && <><br className="sm:hidden" /> {nombre}</>}</h1>
          <p className="text-muted mt-1.5 first-letter:uppercase">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Mascot pose="wave" gesture={firstVisit ? 'wave' : 'none'} size={88} label="La mascota de Aliada te saluda" />
      </Item>

      {main && <Item><NextStepHero tag={main.tag} title={main.t} sub={main.s} go={main.go} /></Item>}

      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.3rem]">Tus secciones</h2>
        <div className={cx('grid gap-3', secs.length === 4 ? 'grid-cols-2' : 'grid-cols-2')}>
          {secs.map((x, i) => <SectionTile key={x.to} {...x} wide={secs.length === 3 && i === 0} />)}
        </div>
      </Item>

      {due && <Item><Note tone="info" title="Guardá una copia de tus datos">Tus datos viven en este celular. Hacé una copia desde Ajustes para no perderlos si lo cambiás.</Note></Item>}

      <Item className="flex flex-col gap-1">
        <QuietLink to="/salud" icon={<HeartPulse />} title="Mi ficha de salud" sub="Medicamentos, alergias y a quién avisar" />
        <QuietLink to="/resumen" icon={<FileText />} title="Mi resumen" sub="Todo lo tuyo en una hoja, para imprimir o compartir" />
        <QuietLink to="/ajustes" icon={<Settings />} title="Ajustes" sub="Letra, colores, voz y copia de tus datos" />
      </Item>
      <Item><p className="text-[.78rem] text-muted border-t border-line pt-4">{LEGAL}</p></Item>
    </Stagger>
  );
}

/* Cada sección muestra su estado real, en una línea: lo que conviene mirar hoy */
type Sec = { to: string; t: string; status: string; icon: React.ReactNode; tone: 'mint' | 'sky' | 'violet' | 'amber'; alert?: boolean };
function useSections(): Sec[] {
  const d = useStore((s) => s.d), c = calc(d), urg = urgentes(d);
  const nl = nextLesson(d), ip = INV_MODULES.reduce((a, m) => ({ n: a.n + modProg(d, m).n, t: a.t + modProg(d, m).t }), { n: 0, t: 0 });
  const libro = Object.keys(d.libro.dias).length;
  const fin = urg.length ? `${urg[0].n}: ${urg[0].txt.toLowerCase()}` : c.has ? (c.brecha >= 0 ? `Te sobran ${money(c.brecha)} por mes` : `Te faltan ${money(-c.brecha)} por mes`) : 'Tu plata del mes, pagos y trámites';
  const L: Sec[] = [
    { to: '/finanzas', t: 'Finanzas', status: fin, icon: <Wallet />, tone: 'mint', alert: urg.some((e) => e.diff <= 0) },
    { to: '/inversiones', t: 'Invertir', status: ip.n ? `${ip.n} de ${ip.t} lecciones hechas` : 'Cómo se invierte, paso a paso', icon: <TrendingUp />, tone: 'sky' },
    { to: '/digital', t: 'Mundo digital', status: !d.md.diag.done ? 'Armá tu ruta en 3 minutos' : nl ? 'Sigue: ' + nl.l.t : 'Todo al día', icon: <Smartphone />, tone: 'violet' }
  ];
  if (d.perfil.sexo === 'mujer') L.push({ to: '/libro', t: 'Mi libro', status: libro ? `Día ${Math.min(libro + 1, 30)} de 30` : 'Tu libro y tu cuaderno', icon: <BookHeart />, tone: 'amber' });
  return L;
}
const TILE: Record<Sec['tone'], string> = { mint: 'bg-mint text-teal', sky: 'bg-skysoft text-sky', violet: 'bg-violetsoft text-violet', amber: 'bg-ambersoft text-amber' };
function SectionTile({ to, t, status, icon, tone, alert, wide }: Sec & { wide?: boolean }) {
  return (
    <Link to={to} className={cx('press group relative flex flex-col justify-between gap-6 rounded-xl2 bg-surface border border-line shadow-card p-4 min-h-[9.5rem]', wide && 'col-span-2 min-h-0 flex-row items-center gap-4')}>
      <span className={cx('grid place-items-center size-12 rounded-2xl [&_svg]:size-6 shrink-0', TILE[tone])}>{icon}</span>
      <span className={cx('flex flex-col gap-1 min-w-0', wide && 'flex-1')}>
        <b className="text-[1.2rem] leading-tight">{t}</b>
        <span className={cx('text-[.9rem] leading-snug line-clamp-2', alert ? 'text-bad font-semibold' : 'text-muted')}>{status}</span>
      </span>
      <ArrowRight className={cx('size-5 text-muted transition-transform duration-150 group-hover:translate-x-0.5', wide ? 'shrink-0' : 'absolute top-4 right-4')} />
    </Link>
  );
}
function QuietLink({ to, icon, title, sub }: { to: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link to={to} className="press flex items-center gap-3.5 rounded-xl px-2 py-2.5 -mx-2 hover:bg-sunk/70 transition-colors duration-150">
      <span className="grid place-items-center size-10 rounded-full bg-sunk text-ink [&_svg]:size-5 shrink-0">{icon}</span>
      <span className="flex-1 min-w-0"><b className="block font-semibold leading-tight">{title}</b><span className="block text-[.86rem] text-muted">{sub}</span></span>
      <ChevronRight className="size-5 text-muted shrink-0" />
    </Link>
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
        <h2 className="text-[1.5rem] sm:text-[1.8rem] text-ink sm:text-[#0c1a2e] leading-tight">{title}</h2>
        <p className="text-muted sm:text-[#2a3f58] mt-1.5">{sub}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button to={go} iconRight={<ArrowRight />} >Continuar</Button>
          <span className="text-[.9rem] text-muted sm:text-[#2a3f58]">Tu próximo paso en {tag}</span>
        </div>
      </div>
    </section>
  );
}
