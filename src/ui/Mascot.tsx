/* Mascota de Aliada Digital: dos poses (parada y saludando) con gestos suaves.
   Aparece en pocos lugares: bienvenida, inicio, encuesta, fin de lección y libro. */
import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cx } from './cx';

const SRC = { neutral: 'mascota/mascota-neutral.webp', wave: 'mascota/mascota-wave.webp' };
if (typeof window !== 'undefined') Object.values(SRC).forEach((u) => { const i = new Image(); i.src = u; });

type Gesture = 'wave' | 'hop' | 'nod' | 'none';
export function Mascot({ pose = 'neutral', gesture = 'none', size = 120, className, idle = true, label }: { pose?: 'neutral' | 'wave'; gesture?: Gesture; size?: number; className?: string; idle?: boolean; label?: string }) {
  const reduce = useReducedMotion();
  const [p, setP] = useState<'neutral' | 'wave'>(gesture === 'wave' ? 'neutral' : pose);
  const [blink, setBlink] = useState(false);
  const [beat, setBeat] = useState(0);

  /* Saludo: alterna las poses unas veces y termina saludando */
  useEffect(() => {
    if (gesture !== 'wave' || reduce) { setP(pose === 'neutral' && gesture === 'wave' ? 'wave' : pose); return; }
    const seq = ['wave', 'neutral', 'wave', 'neutral', 'wave'] as const;
    const ts = seq.map((x, i) => setTimeout(() => setP(x), 350 + i * 330));
    return () => ts.forEach(clearTimeout);
  }, [gesture, pose, reduce, beat]);

  /* Parpadeo cada tanto */
  useEffect(() => {
    if (reduce) return;
    let t: any;
    const loop = () => { t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 140); loop(); }, 2600 + Math.random() * 3200); };
    loop();
    return () => clearTimeout(t);
  }, [reduce]);

  const h = Math.round(size * 474 / 440);
  return (
    <motion.button type="button" aria-label={label || 'Mascota de Aliada Digital'} onClick={() => setBeat((b) => b + 1)}
      className={cx('relative shrink-0 select-none cursor-default', className)} style={{ width: size, height: h }}
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
      <motion.div className="absolute inset-0"
        animate={reduce || !idle ? {} : gesture === 'hop' ? { y: [0, -14, 0, -6, 0], scaleY: [1, 1.04, 0.96, 1.02, 1] } : gesture === 'nod' ? { rotate: [0, -4, 3, 0] } : { y: [0, -4, 0] }}
        transition={gesture === 'hop' ? { duration: 1.1, delay: 0.3 } : gesture === 'nod' ? { duration: 1.2, delay: 0.4 } : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
        <img src={SRC.neutral} alt="" draggable={false} className={cx('absolute inset-0 w-full h-full', p === 'neutral' ? 'opacity-100' : 'opacity-0')} />
        <img src={SRC.wave} alt="" draggable={false} className={cx('absolute inset-0 w-full h-full', p === 'wave' ? 'opacity-100' : 'opacity-0')} />
        <span className="absolute rounded-full origin-top transition-transform duration-75" style={{ left: '39.2%', top: '28.4%', width: '6.4%', height: '6.4%', background: '#6582ee', borderBottom: `${Math.max(1, size / 140)}px solid #26265e`, transform: `scaleY(${blink ? 1 : 0})` }} />
      </motion.div>
    </motion.button>
  );
}
