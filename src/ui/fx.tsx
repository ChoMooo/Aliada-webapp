/* Efectos visuales de React Bits adaptados a la identidad de Aliada (mar de noche, ballena, turquesa).
   Cada uno respeta "reducir movimiento" y se pausa solo cuando no está en pantalla. */
import React, { useEffect, useState } from 'react';
import Aurora from './bits/Aurora/Aurora';
import Waves from './bits/Waves/Waves';
import SpotlightCard from './bits/SpotlightCard/SpotlightCard';
import { cx } from './cx';

/** Color de un token del tema (por ejemplo "accent") como texto rgb(), y se actualiza si cambia claro/oscuro */
export function useTokenColor(token: string, alpha = 1) {
  const read = () => {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--' + token).trim();
      return v ? `rgb(${v.split(/\s+/).join(' ')} / ${alpha})` : '';
    } catch { return ''; }
  };
  const [c, setC] = useState(read);
  useEffect(() => {
    const upd = () => setC(read());
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    mq?.addEventListener?.('change', upd);
    const mo = new MutationObserver(upd);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    upd();
    return () => { mq?.removeEventListener?.('change', upd); mo.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, alpha]);
  return c;
}

export function useDark() {
  const ink = useTokenColor('bg');
  // el fondo oscuro tiene el primer canal bajo (7 15 28)
  const n = Number(ink.match(/\d+/)?.[0] ?? 255);
  return n < 60;
}

/** Aurora boreal sobre las tarjetas de noche: luz azul y turquesa que se mueve despacio */
export function NightAurora({ className }: { className?: string }) {
  return (
    <div className={cx('absolute inset-0 pointer-events-none', className)} aria-hidden>
      <Aurora colorStops={['#1E4FD8', '#34D4A6', '#2650C4']} amplitude={0.9} blend={0.6} speed={0.45} opacity={0.7} height={0.5} mouseInteraction={false} dpr={1.25} />
    </div>
  );
}

/** Corrientes de mar detrás del encabezado de cada sección, del color de la sección */
export function SectionWaves({ tone = 'accent', className }: { tone?: 'accent' | 'teal' | 'sky' | 'violet' | 'amber'; className?: string }) {
  const dark = useDark();
  const line = useTokenColor(tone, dark ? 0.3 : 0.22);
  const accent = useTokenColor('glow', dark ? 0.45 : 0.35);
  if (!line) return null;
  return (
    <div className={cx('absolute h-[17rem] pointer-events-none -z-[1]', className || 'inset-x-0 top-0')} aria-hidden
      style={{ maskImage: 'radial-gradient(75% 85% at 100% 0%, #000 8%, transparent 62%)', WebkitMaskImage: 'radial-gradient(75% 85% at 100% 0%, #000 8%, transparent 62%)' }}>
      <Waves lineColor={line} accentColor={accent} spacing={18} lineWidth={1.1} amplitude={20} speed={0.35} scale={0.9} mouseInteraction={false} clickRipple={false} lightMode={!dark} dpr={1.5} />
    </div>
  );
}

/** Tarjeta con un brillo que sigue el dedo o el mouse */
export function Spot({ children, className, color, ...rest }: { children: React.ReactNode; className?: string; color?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const dark = useDark();
  const c = useTokenColor('accent', dark ? 0.32 : 0.22);
  return (
    <SpotlightCard theme={dark ? 'dark' : 'light'} spotlightColor={color || c} spotlightSize={260} intensity={dark ? 0.2 : 0.16} borderGlow={0.5}
      className={cx('spot-reset', className)}
      style={{ ['--spotlight-card-surface' as any]: 'rgb(var(--surface))', ['--spotlight-card-border' as any]: 'rgb(var(--line))', ['--spotlight-card-shadow' as any]: '0 1px 2px rgb(var(--shadow) / .05), 0 4px 14px -6px rgb(var(--shadow) / .10)' }}
      {...rest}>
      {children}
    </SpotlightCard>
  );
}
