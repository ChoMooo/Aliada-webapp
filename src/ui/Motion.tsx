/* Movimientos calmos: líneas topográficas (como un mapa) y una entrada suave a los módulos. */
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Home, Wallet, TrendingUp, Smartphone, BookHeart } from 'lucide-react';
import { SECTION_HOLD, INTRO_HOLD, type SectionId } from '../lib/navhist';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cx } from './cx';

/* Curva cerrada orgánica alrededor del centro */
function blob(r: number, k: number, wob = 0.09) {
  const pts = 64, out: string[] = [];
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const rr = r * (1 + wob * Math.sin(a * 3 + k) + wob * 0.6 * Math.cos(a * 5 - k * 1.7));
    out.push(`${(200 + rr * Math.cos(a)).toFixed(1)},${(200 + rr * Math.sin(a)).toFixed(1)}`);
  }
  return 'M' + out.join(' L') + 'Z';
}

/** Líneas de nivel que giran muy despacio. Decorativas: aria-hidden. */
export function Topo({ className, rings = 9, color = 'currentColor', draw = false, speed = 1 }: { className?: string; rings?: number; color?: string; draw?: boolean; speed?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 400 400" className={cx('pointer-events-none', className)} aria-hidden fill="none">
      {Array.from({ length: rings }, (_, i) => {
        const r = 26 + i * 19;
        return (
          <motion.path key={i} d={blob(r, i * 0.9)} stroke={color} strokeWidth={1.1} strokeOpacity={0.55 - i * 0.04}
            style={{ transformOrigin: '200px 200px' }}
            initial={draw && !reduce ? { pathLength: 0, opacity: 0 } : false}
            animate={reduce ? {} : { rotate: i % 2 ? [0, 360] : [360, 0], pathLength: 1, opacity: 1 }}
            transition={{ rotate: { duration: (90 + i * 22) / speed, repeat: Infinity, ease: 'linear' }, pathLength: { duration: 1.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.6, delay: i * 0.06 } }} />
        );
      })}
    </svg>
  );
}

const TONE: Record<string, { chip: string; ink: string; wash: string }> = {
  mint: { chip: 'bg-mint text-teal', ink: 'text-accent', wash: 'rgb(var(--accent) / .10)' },
  sky: { chip: 'bg-skysoft text-sky', ink: 'text-sky', wash: 'rgb(var(--sky) / .12)' },
  amber: { chip: 'bg-ambersoft text-amber', ink: 'text-amber', wash: 'rgb(var(--amber) / .12)' },
  violet: { chip: 'bg-violetsoft text-violet', ink: 'text-violet', wash: 'rgb(var(--violet) / .12)' }
};

/* Marco común: fondo con degradado del tono, líneas topográficas y el contenido al centro */
function Veil({ hold, tone, children, onDone }: { hold: number; tone: string; children: React.ReactNode; onDone?: () => void }) {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), hold); return () => clearTimeout(t); }, [hold]);
  const T = TONE[tone] || TONE.mint;
  return createPortal(
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-bg overflow-hidden" role="presentation"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }} transition={{ duration: 0.14 }}
          onClick={() => setShow(false)}
          style={{ backgroundImage: `radial-gradient(90% 60% at 50% 42%, ${T.wash}, transparent 70%)` }}>
          <Topo className={cx('absolute w-[min(140vw,760px)] opacity-60', T.ink)} draw rings={8} speed={2.4} />
          <motion.div className="relative flex flex-col items-center gap-4 text-center px-6"
            initial={{ opacity: 0, transform: 'translateY(8px) scale(0.97)' }} animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ---------- Animaciones propias de cada sección ---------- */
const ez = [0.22, 1, 0.36, 1] as const;
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/* Inicio: un sol que asoma sobre el horizonte */
function ArtInicio() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <defs><clipPath id="va-h"><rect x="0" y="0" width="120" height="74" /></clipPath></defs>
      <g clipPath="url(#va-h)">
        <motion.circle cx="60" cy="74" r="24" fill="currentColor" fillOpacity={0.9} initial={{ transform: 'translate(0px, 30px)' }} animate={{ transform: 'translate(0px, 0px)' }} transition={{ duration: 0.495, ease: ez }} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = Math.PI * (0.12 + i * 0.19);
          return <motion.line key={i} x1={60 - Math.cos(a) * 32} y1={74 - Math.sin(a) * 32} x2={60 - Math.cos(a) * 42} y2={74 - Math.sin(a) * 42} {...S} strokeWidth={4}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.248 + i * 0.033, duration: 0.193 }} />;
        })}
      </g>
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${18 + i * 8} ${80 + i * 9}H${102 - i * 8}`} {...S} strokeWidth={4} strokeOpacity={1 - i * 0.28}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.055 + i * 0.055, duration: 0.33, ease: ez }} />
      ))}
    </svg>
  );
}
/* Finanzas: barras que crecen y una moneda que cae en su lugar */
function ArtFinanzas() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      {[[24, 34], [50, 52], [76, 72]].map(([x, h], i) => (
        <motion.rect key={i} x={x} width="18" rx="5" y={98 - h} height={h} fill="currentColor" fillOpacity={0.35 + i * 0.25}
          style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.055 + i * 0.066, duration: 0.303, ease: ez }} />
      ))}
      <motion.path d="M14 98H106" {...S} strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.275 }} />
      <motion.g initial={{ opacity: 0, transform: 'translate(0px, -40px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} transition={{ delay: 0.275, type: 'spring', stiffness: 300, damping: 12 }}>
        <circle cx="85" cy="16" r="11" fill="currentColor" />
        <text x="85" y="20.5" textAnchor="middle" fontSize="14" fontWeight="700" fill="rgb(var(--surface))" fontFamily="system-ui, sans-serif">$</text>
      </motion.g>
    </svg>
  );
}
/* Inversiones: una línea que sube con un punto que la sigue */
function ArtInversiones() {
  const d = 'M12 92 L36 74 L54 82 L78 52 L96 58 L110 30';
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      {[36, 60, 84].map((y) => <path key={y} d={`M12 ${y}H110`} stroke="currentColor" strokeOpacity={0.18} strokeWidth={2} strokeDasharray="3 5" />)}
      <motion.path d={d + ' L110 104 L12 104 Z'} fill="currentColor" fillOpacity={0.12} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.303, duration: 0.22 }} />
      <motion.path d={d} {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.44, ease: ez }} />
      <motion.circle cx="110" cy="30" r="7" fill="currentColor" initial={{ opacity: 0, transform: 'scale(0.6)' }} animate={{ transform: ['scale(0.6)', 'scale(1.25)', 'scale(1)'], opacity: 1 }} transition={{ delay: 0.413, duration: 0.22 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </svg>
  );
}
/* Mundo digital: un celular que se enciende y emite ondas */
function ArtDigital() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <motion.rect x="38" y="22" width="44" height="78" rx="10" {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.33, ease: ez }} />
      <motion.rect x="45" y="32" width="30" height="50" rx="4" fill="currentColor" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0.25] }} transition={{ delay: 0.248, duration: 0.275 }} />
      <motion.circle cx="60" cy="90" r="3" fill="currentColor" initial={{ opacity: 0, transform: 'scale(0.6)' }} animate={{ opacity: 1, transform: 'scale(1)' }} transition={{ delay: 0.275 }} />
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${88 + i * 8} ${46 - i * 6} q${7 + i * 3} ${15 + i * 6} 0 ${30 + i * 12}`} {...S} strokeWidth={4}
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 1, 1 - i * 0.25] }} transition={{ delay: 0.303 + i * 0.066, duration: 0.22 }} />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.path key={'l' + i} d={`M${32 - i * 8} ${46 - i * 6} q${-(7 + i * 3)} ${15 + i * 6} 0 ${30 + i * 12}`} {...S} strokeWidth={4}
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 1, 1 - i * 0.25] }} transition={{ delay: 0.303 + i * 0.066, duration: 0.22 }} />
      ))}
    </svg>
  );
}
/* Mi nueva versión: un libro que se abre y un corazón que sube */
function ArtLibro() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <motion.path d="M60 44C48 36 30 34 16 36V94C30 92 48 94 60 102" {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.33, ease: ez }} />
      <motion.path d="M60 44C72 36 90 34 104 36V94C90 92 72 94 60 102" {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.33, ease: ez }} />
      <motion.path d="M60 44V102" {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.193, duration: 0.193 }} />
      <motion.path d="M60 44C70 38 84 37 96 39" {...S} strokeWidth={3} strokeOpacity={0.5} initial={{ pathLength: 0, rotate: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.165, duration: 0.275 }} />
      <motion.path d="M60 30c-3-6-13-6-13 2 0 6 13 13 13 13s13-7 13-13c0-8-10-8-13-2z" fill="currentColor"
        initial={{ opacity: 0, transform: 'translate(0px, 22px) scale(0.4)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px) scale(1)' }} transition={{ delay: 0.303, type: 'spring', stiffness: 220, damping: 11 }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </svg>
  );
}

export const SECTION_INFO: Record<SectionId, { title: string; sub: string; tone: string; icon: React.ReactNode; Art: () => JSX.Element }> = {
  inicio: { title: 'Inicio', sub: 'A tu ritmo, con calma', tone: 'mint', icon: <Home />, Art: ArtInicio },
  finanzas: { title: 'Finanzas', sub: 'Tu plata, trámites y pagos', tone: 'mint', icon: <Wallet />, Art: ArtFinanzas },
  inversiones: { title: 'Inversiones', sub: 'Cómo invertir, paso a paso', tone: 'sky', icon: <TrendingUp />, Art: ArtInversiones },
  digital: { title: 'Mundo digital', sub: 'Apps explicadas con videos', tone: 'violet', icon: <Smartphone />, Art: ArtDigital },
  libro: { title: 'Mi nueva versión', sub: 'Tu libro y tu cuaderno', tone: 'amber', icon: <BookHeart />, Art: ArtLibro }
};

/** Entrada de sección: cada vez que se cambia entre Inicio, Finanzas, Invertir, Digital y Mi libro */
export function SectionVeil({ id }: { id: SectionId }) {
  if (id === 'inicio') return <IntroVeil />;
  const info = SECTION_INFO[id];
  const T = TONE[info.tone];
  return (
    <Veil hold={SECTION_HOLD} tone={info.tone}>
      <span className={cx('relative grid place-items-center size-40 rounded-[2.4rem] p-5 shadow-lift', T.chip)}>
        <info.Art />
      </span>
      <b className="font-head text-[1.75rem] leading-tight">{info.title}</b>
      <span className="text-muted text-[1rem] -mt-2">{info.sub}</span>
    </Veil>
  );
}

/** Inicio: el logo aparece y se va enseguida (menos de medio segundo). Sin video: se navega a Inicio muchas veces. */
function IntroVeil() {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), INTRO_HOLD); return () => clearTimeout(t); }, []);
  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center intro-bg" role="presentation" onClick={() => setShow(false)}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }} transition={{ duration: 0.12 }}>
          <motion.img src="intro/logo-final.webp" alt="" className="intro-video w-[min(52vw,240px)] aspect-square object-cover"
            initial={{ opacity: 0, transform: 'scale(0.94)' }} animate={{ opacity: 1, transform: 'scale(1)' }} exit={{ transform: 'scale(1.03)' }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
