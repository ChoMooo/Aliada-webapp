import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Wallet, Smartphone, Settings, TrendingUp, BookHeart } from 'lucide-react';
import { useD } from '../store';
import { cx, IconButton, LOGO, SectionVeil } from '../ui';
import { track } from '../lib/navhist';

const NAV_ALL = [
  { to: '/', label: 'Inicio', icon: <Home />, match: (p: string) => p === '/' },
  { to: '/finanzas', label: 'Finanzas', icon: <Wallet />, match: (p: string) => p.startsWith('/finanzas') },
  { to: '/inversiones', label: 'Inversiones', short: 'Invertir', icon: <TrendingUp />, match: (p: string) => p.startsWith('/inversiones') },
  { to: '/digital', label: 'Mundo digital', short: 'Digital', icon: <Smartphone />, match: (p: string) => p.startsWith('/digital') },
  { to: '/libro', label: 'Mi nueva versión', short: 'Mi libro', icon: <BookHeart />, match: (p: string) => p.startsWith('/libro'), women: true }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const h = track(pathname);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  const mujer = useD((d) => d.perfil.sexo === 'mujer');
  const NAV = NAV_ALL.filter((n) => !n.women || mujer);
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      {h.veil?.kind === 'section' && <SectionVeil key={h.veilKey} id={h.veil.id} />}
      {/* Barra superior */}
      <header className="no-print sticky top-0 z-30 lg:col-span-2 safe-t bg-bg/90 backdrop-blur-md border-b border-line">
        <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
          <button onClick={() => nav('/')} className="flex items-center gap-3 text-left" aria-label="Ir al inicio">
            <img src={LOGO} alt="" className="size-10 rounded-full" />
            <span><b className="block font-head font-bold text-[1.1rem] leading-none">Aliada Digital</b><span className="text-[.74rem] text-muted">A tu ritmo, con calma</span></span>
          </button>
          <span className="flex-1" />
          <IconButton label="Ajustes" onClick={() => nav('/ajustes')}><Settings /></IconButton>
        </div>
      </header>

      {/* Navegación lateral (computadora) */}
      <nav aria-label="Secciones" className="no-print hidden lg:flex flex-col gap-1.5 sticky top-16 self-start p-4 pt-6">
        {NAV.map((n) => {
          const on = n.match(pathname);
          return (
            <button key={n.to} onClick={() => nav(n.to)} aria-current={on ? 'page' : undefined}
              className={cx('relative flex items-center gap-3 min-h-[3.3rem] px-4 rounded-xl font-bold text-left [&_svg]:size-5', on ? 'text-accent' : 'text-muted hover:text-ink')}>
              {on && <motion.span layoutId="side-pill" className="absolute inset-0 rounded-xl bg-accent/10" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
              <span className="relative">{n.icon}</span><span className="relative">{n.label}</span>
            </button>
          );
        })}
      </nav>

      <main className="px-4 sm:px-6 pt-5 pb-32 lg:pb-16 w-full max-w-[46rem] mx-auto lg:mx-0 lg:px-10">{children}</main>

      {/* Navegación inferior (celular) */}
      <nav aria-label="Secciones" className="no-print lg:hidden fixed inset-x-0 bottom-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line safe-b">
        <div className="grid px-1.5 pt-1.5 max-w-lg mx-auto" style={{ gridTemplateColumns: `repeat(${NAV.length}, minmax(0, 1fr))` }}>
          {NAV.map((n) => {
            const on = n.match(pathname);
            return (
              <button key={n.to} onClick={() => nav(n.to)} aria-current={on ? 'page' : undefined}
                className={cx('press relative flex flex-col items-center gap-0.5 min-h-[3.7rem] justify-center rounded-xl text-[.74rem] font-bold [&_svg]:size-6', on ? 'text-accent' : 'text-muted')}>
                {on && <motion.span layoutId="bottom-pill" className="absolute inset-x-1.5 inset-y-0.5 rounded-xl bg-accent/10" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                <span className="relative">{n.icon}</span><span className="relative">{n.short ?? n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
