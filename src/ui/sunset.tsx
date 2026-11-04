/* Piezas visuales "Mar al atardecer": fotos de océano a pantalla completa, títulos con emoción,
   botón principal con un borde de luz y tarjetas de vidrio con cifras grandes.
   Usan componentes de Aceternity UI (src/ui/aceternity) adaptados a la marca. */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button as MovingBorderButton } from './aceternity/moving-border';
import { ShootingStars } from './aceternity/shooting-stars';
import { StarsBackground } from './aceternity/stars-background';
import { cx } from './cx';

/** Encabezado con una foto del océano a todo el ancho; el texto va abajo, sobre un degradado que lo hace legible */
export function PhotoHero({ src, children, stars, className, height = 'min-h-[22rem] sm:min-h-[26rem]', pos = 'center' }: {
  src: string; children?: React.ReactNode; stars?: boolean; className?: string; height?: string; pos?: string;
}) {
  return (
    <section className={cx('relative isolate overflow-hidden -mx-4 sm:-mx-6 lg:mx-0 lg:rounded-[1.75rem] -mt-5 lg:mt-0 text-white flex flex-col justify-end', height, className)}>
      <img src={src} alt="" className="absolute inset-0 -z-[2] size-full object-cover" style={{ objectPosition: pos }} />
      {stars && <div className="absolute inset-0 -z-[1] pointer-events-none" aria-hidden><StarsBackground starDensity={0.00012} allStarsTwinkle={false} twinkleProbability={0.6} /><ShootingStars minDelay={2500} maxDelay={6000} starColor="#9fe8d2" trailColor="#2650C4" /></div>}
      <div className="absolute inset-0 -z-[1] bg-[linear-gradient(180deg,rgb(7_15_28/.55)_0%,rgb(7_15_28/.05)_32%,rgb(7_15_28/.25)_58%,rgb(7_15_28/.86)_100%)]" aria-hidden />
      <div className="px-4 sm:px-8 pt-24 pb-7 sm:pb-9">{children}</div>
    </section>
  );
}

/** "Volver" sobre una foto: píldora de vidrio, se lee sobre cualquier cielo */
export function PhotoBack({ to, label = 'Volver' }: { to: string; label?: string }) {
  const nav = useNavigate();
  return (
    <button type="button" onClick={() => nav(to)} className="no-print press glass-chip !text-[.95rem] !min-h-[2.75rem] !pl-2.5 !pr-4">
      <ChevronLeft className="size-5" />{label}
    </button>
  );
}

/** Título grande con emoción: serif en cursiva (solo para tamaños grandes, se lee bien) */
export function Display({ children, className, as: T = 'h1' }: { children: React.ReactNode; className?: string; as?: any }) {
  return <T className={cx('font-display italic font-normal tracking-[-.01em] leading-[1.02] text-[2.9rem] sm:text-[3.6rem] text-balance', className)}>{children}</T>;
}

/** Botón principal con una luz que recorre el borde (Moving Border de Aceternity) */
export function ShineButton({ children, to, onClick, icon, iconRight, className, block, type = 'button' }: {
  children: React.ReactNode; to?: string; onClick?: () => void; icon?: React.ReactNode; iconRight?: React.ReactNode; className?: string; block?: boolean; type?: 'button' | 'submit';
}) {
  const inner = <span className="inline-flex items-center justify-center gap-2 [&_svg]:size-5">{icon}{children}{iconRight}</span>;
  const common = {
    borderRadius: '0.875rem', duration: 3200,
    containerClassName: cx('press h-auto p-[2px] text-[1.05rem] shadow-lift', block ? 'flex w-full' : 'inline-flex w-auto align-middle', className),
    borderClassName: 'h-24 w-24 bg-[radial-gradient(#9fffe0_35%,#34D4A6_50%,transparent_68%)] opacity-90',
    className: 'min-h-[3.1rem] px-6 border-0 bg-accent text-onaccent font-bold text-[1.05rem] backdrop-blur-0'
  };
  if (to) return <MovingBorderButton as={Link} to={to} onClick={onClick} {...common}>{inner}</MovingBorderButton>;
  return <MovingBorderButton as="button" type={type} onClick={onClick} {...common}>{inner}</MovingBorderButton>;
}

/** Tarjeta de vidrio sobre una foto, con una cifra grande */
export function GlassStat({ label, value, hint, className, small }: { label: string; value: React.ReactNode; hint?: React.ReactNode; className?: string; small?: boolean }) {
  return (
    <div className={cx('rounded-2xl border border-white/25 bg-white/[.14] backdrop-blur-xl p-3.5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/.25)]', className)}>
      <div className="text-[.82rem] text-white/80 leading-tight">{label}</div>
      <div className={cx('font-head font-bold leading-tight mt-1 num whitespace-nowrap', small ? 'text-[1.2rem]' : 'text-[1.6rem]')}>{value}</div>
      {hint && <div className="text-[.78rem] text-white/70 mt-0.5">{hint}</div>}
    </div>
  );
}
