/* Movimientos calmos: líneas topográficas (como un mapa) y una entrada suave a los módulos. */
import React, { useEffect, useState } from 'react';
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

/** Pantalla de entrada breve la primera vez que se abre un módulo en la sesión */
export function EntryVeil({ id, icon, title, sub, tone = 'mint' }: { id: string; icon: React.ReactNode; title: string; sub?: string; tone?: string }) {
  const reduce = useReducedMotion();
  const key = 'aliada.veil.' + id;
  const [show, setShow] = useState(() => { try { return !reduce && !sessionStorage.getItem(key); } catch { return false; } });
  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem(key, '1'); } catch { /* */ }
    const t = setTimeout(() => setShow(false), 1150);
    return () => clearTimeout(t);
  }, []);
  const T: Record<string, string> = { mint: 'bg-mint text-accent', sky: 'bg-skysoft text-sky', amber: 'bg-ambersoft text-amber', violet: 'bg-violetsoft text-violet' };
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-bg" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} onClick={() => setShow(false)}>
          <Topo className="absolute w-[min(130vw,720px)] text-accent/70" draw rings={8} speed={2} />
          <motion.div className="relative flex flex-col items-center gap-3 text-center px-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
            <span className={cx('grid place-items-center size-16 rounded-2xl [&_svg]:size-8 shadow-card', T[tone])}>{icon}</span>
            <b className="font-head text-[1.5rem] leading-tight">{title}</b>
            {sub && <span className="text-muted text-[.95rem]">{sub}</span>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
