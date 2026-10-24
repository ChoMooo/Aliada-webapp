import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Smartphone, TrendingUp, BookHeart, ArrowRight, ChevronRight, FileText, Settings } from 'lucide-react';
import { useStore, useD } from '../store';
import { Button, Stagger, Item, Note, cx, Kicker, Mascot, LivingSea } from '../ui';
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
  const tiles = [
    { to: '/finanzas', icon: <Wallet />, t: 'Finanzas', s: 'Tu plata, trámites y pagos', tone: 'bg-mint text-accent' },
    { to: '/inversiones', icon: <TrendingUp />, t: 'Inversiones', s: 'Cómo invertir, paso a paso', tone: 'bg-skysoft text-sky' },
    { to: '/digital', icon: <Smartphone />, t: 'Mundo digital', s: 'Apps explicadas con videos', tone: 'bg-violetsoft text-violet' },
    ...(mujer ? [{ to: '/libro', icon: <BookHeart />, t: 'Mi nueva versión', s: 'Tu libro y cuaderno', tone: 'bg-ambersoft text-amber' }] : [])
  ];
  return (
    <Stagger className="flex flex-col gap-6">
      <Item className="flex items-end justify-between gap-3">
        <div className="min-w-0 pb-2">
          <Kicker className="first-letter:uppercase">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</Kicker>
          <h1 className="text-[2rem] sm:text-[2.3rem] mt-1 leading-tight">{greet}{nombre ? ', ' + nombre : ''}</h1>
        </div>
        <Mascot pose="wave" gesture={firstVisit ? 'wave' : 'none'} size={92} label="La mascota de Aliada te saluda" />
      </Item>

      {main && (
        <Item>
          <NextStepHero tag={main.tag} title={main.t} sub={main.s} go={main.go} />
        </Item>
      )}

      <Item className={cx('grid gap-3', tiles.length === 4 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3')}>
        {tiles.map((x) => <Tile key={x.to} {...x} row={tiles.length !== 4} />)}
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

function Tile({ to, icon, t, s, tone, row }: { to: string; icon: React.ReactNode; t: string; s: string; tone: string; row?: boolean }) {
  const nav = useNavigate();
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} onClick={() => nav(to)}
      className={cx('text-left rounded-xl2 bg-surface border border-line shadow-card p-4 flex gap-3', row ? 'items-center sm:flex-col sm:items-start' : 'flex-col')}>
      <span className={cx('grid place-items-center size-11 rounded-xl [&_svg]:size-6 shrink-0', tone)}>{icon}</span>
      <span className="flex-1 min-w-0"><b className="block font-head font-semibold text-[1.12rem] leading-tight">{t}</b><span className="block text-[.86rem] text-muted mt-0.5">{s}</span></span>
      {row && <ChevronRight className="size-5 text-muted sm:hidden" />}
    </motion.button>
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
        <div className="text-accent sm:text-[#0a6e57] font-semibold text-[.78rem] tracking-wide uppercase">Tu próximo paso · {tag}</div>
        <h2 className="text-[1.5rem] sm:text-[1.8rem] text-ink sm:text-[#0b2236] mt-1.5 sm:mt-2 leading-tight">{title}</h2>
        <p className="text-muted sm:text-[#23455a] mt-1.5">{sub}</p>
        <div className="mt-5"><Button to={go} iconRight={<ArrowRight />} className="sm:!bg-[#0a6e57] sm:!border-[#0a6e57] sm:!text-white">Continuar</Button></div>
      </div>
    </section>
  );
}
