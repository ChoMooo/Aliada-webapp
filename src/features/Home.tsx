import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Smartphone, TrendingUp, BookHeart, ArrowRight, ChevronRight, FileText, Settings } from 'lucide-react';
import { useStore, useD } from '../store';
import { Button, Hero, Stagger, Item, Note, cx, Kicker, Mascot } from '../ui';
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
          <Hero>
            <div className="text-glow font-semibold text-[.8rem] tracking-wide uppercase">Tu próximo paso · {main.tag}</div>
            <h2 className="text-[1.55rem] sm:text-[1.8rem] text-onbrand mt-2 leading-tight">{main.t}</h2>
            <p className="opacity-85 mt-1.5">{main.s}</p>
            <div className="mt-5"><Button variant="glow" to={main.go} iconRight={<ArrowRight />}>Continuar</Button></div>
          </Hero>
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
