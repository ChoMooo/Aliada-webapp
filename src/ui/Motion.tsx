/* Movimientos calmos: líneas topográficas (como un mapa) y una entrada suave a los módulos. */
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Home, Wallet, TrendingUp, Smartphone, BookHeart } from 'lucide-react';
import { hist, MODULE_HOLD, SECTION_HOLD, type SectionId } from '../lib/navhist';
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
  mint: { chip: 'bg-mint text-accent', ink: 'text-accent', wash: 'rgb(var(--accent) / .10)' },
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }} transition={{ duration: 0.16 }}
          onClick={() => setShow(false)}
          style={{ backgroundImage: `radial-gradient(90% 60% at 50% 42%, ${T.wash}, transparent 70%)` }}>
          <Topo className={cx('absolute w-[min(140vw,760px)] opacity-60', T.ink)} draw rings={8} speed={2.4} />
          <motion.div className="relative flex flex-col items-center gap-4 text-center px-6"
            initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ y: -8 }} transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/** Entrada de un módulo: aparece cada vez que se entra desde afuera (no al volver de una de sus lecciones) */
export function EntryVeil({ icon, title, sub, tone = 'mint' }: { id?: string; icon: React.ReactNode; title: string; sub?: string; tone?: string }) {
  const [on] = useState(() => hist.veil?.kind === 'module' && hist.veil.path === hist.cur);
  if (!on) return null;
  const T = TONE[tone] || TONE.mint;
  return (
    <Veil hold={MODULE_HOLD} tone={tone}>
      <motion.span className={cx('grid place-items-center size-[4.5rem] rounded-2xl [&_svg]:size-9 shadow-card', T.chip)}
        initial={{ rotate: -8, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}>{icon}</motion.span>
      <b className="font-head text-[1.6rem] leading-tight">{title}</b>
      {sub && <span className="text-muted text-[.98rem] -mt-2">{sub}</span>}
    </Veil>
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
        <motion.circle cx="60" cy="74" r="24" fill="currentColor" fillOpacity={0.9} initial={{ y: 30 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: ez }} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = Math.PI * (0.12 + i * 0.19);
          return <motion.line key={i} x1={60 - Math.cos(a) * 32} y1={74 - Math.sin(a) * 32} x2={60 - Math.cos(a) * 42} y2={74 - Math.sin(a) * 42} {...S} strokeWidth={4}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.45 + i * 0.06, duration: 0.35 }} />;
        })}
      </g>
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${18 + i * 8} ${80 + i * 9}H${102 - i * 8}`} {...S} strokeWidth={4} strokeOpacity={1 - i * 0.28}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: ez }} />
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
          style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1 + i * 0.12, duration: 0.55, ease: ez }} />
      ))}
      <motion.path d="M14 98H106" {...S} strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
      <motion.g initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 12 }}>
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
      <motion.path d={d + ' L110 104 L12 104 Z'} fill="currentColor" fillOpacity={0.12} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }} />
      <motion.path d={d} {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: ez }} />
      <motion.circle cx="110" cy="30" r="7" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ delay: 0.75, duration: 0.4 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </svg>
  );
}
/* Mundo digital: un celular que se enciende y emite ondas */
function ArtDigital() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <motion.rect x="38" y="22" width="44" height="78" rx="10" {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: ez }} />
      <motion.rect x="45" y="32" width="30" height="50" rx="4" fill="currentColor" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0.25] }} transition={{ delay: 0.45, duration: 0.5 }} />
      <motion.circle cx="60" cy="90" r="3" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${88 + i * 8} ${46 - i * 6} q${7 + i * 3} ${15 + i * 6} 0 ${30 + i * 12}`} {...S} strokeWidth={4}
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 1, 1 - i * 0.25] }} transition={{ delay: 0.55 + i * 0.12, duration: 0.4 }} />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.path key={'l' + i} d={`M${32 - i * 8} ${46 - i * 6} q${-(7 + i * 3)} ${15 + i * 6} 0 ${30 + i * 12}`} {...S} strokeWidth={4}
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 1, 1 - i * 0.25] }} transition={{ delay: 0.55 + i * 0.12, duration: 0.4 }} />
      ))}
    </svg>
  );
}
/* Mi nueva versión: un libro que se abre y un corazón que sube */
function ArtLibro() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <motion.path d="M60 44C48 36 30 34 16 36V94C30 92 48 94 60 102" {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: ez }} />
      <motion.path d="M60 44C72 36 90 34 104 36V94C90 92 72 94 60 102" {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: ez }} />
      <motion.path d="M60 44V102" {...S} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.35 }} />
      <motion.path d="M60 44C70 38 84 37 96 39" {...S} strokeWidth={3} strokeOpacity={0.5} initial={{ pathLength: 0, rotate: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.5 }} />
      <motion.path d="M60 30c-3-6-13-6-13 2 0 6 13 13 13 13s13-7 13-13c0-8-10-8-13-2z" fill="currentColor"
        initial={{ y: 22, scale: 0.4, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} transition={{ delay: 0.55, type: 'spring', stiffness: 220, damping: 11 }}
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
