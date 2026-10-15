import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Wallet, Smartphone, ShieldCheck, Settings } from 'lucide-react';
import { cx, IconButton, LOGO } from '../ui';

const NAV = [
  { to: '/', label: 'Inicio', icon: <Home />, match: (p: string) => p === '/' },
  { to: '/finanzas', label: 'Finanzas', icon: <Wallet />, match: (p: string) => p.startsWith('/finanzas') },
  { to: '/digital', label: 'Mundo digital', short: 'Digital', icon: <Smartphone />, match: (p: string) => p.startsWith('/digital') },
  { to: '/escudo', label: 'Escudo antiestafas', short: 'Escudo', icon: <ShieldCheck />, match: (p: string) => p.startsWith('/escudo') }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const nav = useNavigate();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Barra superior */}
      <header className="no-print sticky top-0 z-30 lg:col-span-2 safe-t bg-bg/85 backdrop-blur-md border-b border-line">
        <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
          <button onClick={() => nav('/')} className="flex items-center gap-3 text-left" aria-label="Ir al inicio">
            <motion.img src={LOGO} alt="" className="size-10 rounded-full" whileHover={{ rotate: -8 }} />
            <span><b className="block font-head font-normal text-[1.1rem] leading-none">Aliada Digital</b><span className="text-[.74rem] text-muted">Jubilación con calma</span></span>
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
              className={cx('relative flex items-center gap-3 min-h-[3.3rem] px-4 rounded-2xl font-bold text-left [&_svg]:size-5', on ? 'text-accent' : 'text-muted hover:text-ink')}>
              {on && <motion.span layoutId="side-pill" className="absolute inset-0 rounded-2xl bg-mint" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
              <span className="relative">{n.icon}</span><span className="relative">{n.label}</span>
            </button>
          );
        })}
      </nav>

      <main className="px-4 sm:px-6 pt-5 pb-32 lg:pb-16 w-full max-w-[46rem] mx-auto lg:mx-0 lg:px-10">{children}</main>

      {/* Navegación inferior (celular) */}
      <nav aria-label="Secciones" className="no-print lg:hidden fixed inset-x-0 bottom-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line safe-b">
        <div className="grid grid-cols-4 px-2 pt-1.5">
          {NAV.map((n) => {
            const on = n.match(pathname);
            return (
              <button key={n.to} onClick={() => nav(n.to)} aria-current={on ? 'page' : undefined}
                className={cx('relative flex flex-col items-center gap-0.5 min-h-[3.7rem] justify-center rounded-2xl text-[.76rem] font-bold [&_svg]:size-6', on ? 'text-accent' : 'text-muted')}>
                {on && <motion.span layoutId="bottom-pill" className="absolute inset-x-1.5 inset-y-0.5 rounded-2xl bg-mint" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                <span className="relative">{n.icon}</span><span className="relative">{n.short ?? n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
