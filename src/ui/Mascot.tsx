/* Mascota de Aliada Digital: dos poses (parada y saludando) con gestos suaves,
   y tres acciones animadas recortadas del video de la mascota (act): festeja, piensa y señala.
   Al tocarla salta, tira un chorrito de agua y dice algo; puede mostrar un globo de diálogo (say).
   Aparece en: bienvenida, inicio, encuesta, misiones, logros, fin de lección y libro. */
import { useAhorro } from '../lib/ahorro';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useAnimationControls } from 'framer-motion';
import { cx } from './cx';

const SRC = { neutral: 'mascota/mascota-neutral.webp', wave: 'mascota/mascota-wave.webp' };
if (typeof window !== 'undefined') Object.values(SRC).forEach((u) => { const i = new Image(); i.src = u; });

type Gesture = 'wave' | 'hop' | 'nod' | 'none';
export type Act = 'festeja' | 'piensa' | 'senala';
/* Hacia dónde mira cada clip en el video original; se espeja para que mire hacia el contenido (a la izquierda) */
const ACT_MIRA_DERECHA: Record<Act, boolean> = { festeja: true, piensa: false, senala: true };

/* Los clips son WebP animados que se reproducen una vez y quedan en el último cuadro.
   Para poder repetirlos (al tocar o al volver a mostrarse) se bajan una sola vez y cada reproducción usa una copia nueva. */
const blobs: Record<string, Promise<Blob | null>> = {};
const traer = (u: string) => (blobs[u] ||= fetch(u).then((r) => (r.ok ? r.blob() : null)).catch(() => null));

function Clip({ act, play }: { act: Act; play: number }) {
  const reduce = useReducedMotion();
  const fin = `mascota/${act}-fin.webp`;
  const [src, setSrc] = useState<string>(reduce ? fin : '');
  useEffect(() => {
    if (reduce) { setSrc(fin); return; }
    let url = '', vivo = true;
    traer(`mascota/${act}.webp`).then((b) => { if (!vivo) return; if (b) { url = URL.createObjectURL(b); setSrc(url); } else setSrc(fin); });
    return () => { vivo = false; if (url) setTimeout(() => URL.revokeObjectURL(url), 4000); };
  }, [act, play, reduce]);
  return src ? <img src={src} alt="" draggable={false} className="absolute inset-0 w-full h-full object-contain object-bottom" style={{ transform: ACT_MIRA_DERECHA[act] ? 'scaleX(-1)' : undefined }} /> : null;
}
const FRASES = ['¡Hola! Acá estoy si me necesitás.', 'Sin apuro: vamos a tu ritmo.', 'Cada paso cuenta. ¡Vamos!', 'Si algo no se entiende, tocá Escuchar.', '¡Qué bueno verte por acá!', 'Podés cambiar el tamaño de la letra en Ajustes.', 'Una misión por día y listo.'];

/** Chorrito de agua que sale de la cabeza (el "resoplido" de la ballena) */
function Spout({ size }: { size: number }) {
  const s = Math.max(18, size * 0.32);
  return (
    <motion.svg viewBox="-20 -40 40 42" width={s} height={s * 1.05} className="absolute pointer-events-none" style={{ left: `calc(45% - ${s / 2}px)`, top: -s * 0.95 }} aria-hidden
      initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.1, times: [0, 0.15, 0.7, 1] }}>
      {[-1, 0, 1].map((k) => (
        <motion.path key={k} d="M0 0c-3-6-3-11 0-16 3 5 3 10 0 16z" fill="#7fb3ff" stroke="#3f63c9" strokeWidth="1"
          initial={{ transform: 'translate(0px, 0px) rotate(0deg) scale(0.4)' }}
          animate={{ transform: `translate(${k * 12}px, ${k === 0 ? -22 : -16}px) rotate(${k * 28}deg) scale(1)` }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }} />
      ))}
    </motion.svg>
  );
}

/** Globo de diálogo, arriba de la mascota */
export function Bubble({ text, side = 'left' }: { text: string; side?: 'left' | 'right' }) {
  return (
    <motion.span role="status" className={cx('absolute bottom-[96%] z-10 w-max max-w-[14rem] rounded-2xl bg-surface text-ink border border-line shadow-lift px-3.5 py-2 text-[.92rem] font-semibold leading-snug text-left',
      side === 'left' ? 'right-[55%] rounded-br-md' : 'left-[55%] rounded-bl-md')}
      initial={{ opacity: 0, transform: 'translateY(6px) scale(0.96)' }} animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }} exit={{ opacity: 0, transform: 'translateY(4px) scale(0.98)', transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>{text}</motion.span>
  );
}

export function Mascot({ pose = 'neutral', gesture = 'none', size = 120, className, idle = true, label, say, sayFor = 4500, side = 'left', act }: { pose?: 'neutral' | 'wave'; gesture?: Gesture; size?: number; className?: string; idle?: boolean; label?: string; say?: string; sayFor?: number; side?: 'left' | 'right'; act?: Act }) {
  const [play, setPlay] = useState(0);
  if (useAhorro()) idle = false;
  const reduce = useReducedMotion();
  const [bubble, setBubble] = useState<string | null>(null);
  const [spout, setSpout] = useState(0);
  const bubbleT = React.useRef<any>();
  const decir = (t: string, ms = sayFor) => { clearTimeout(bubbleT.current); setBubble(t); bubbleT.current = setTimeout(() => setBubble(null), ms); };
  /* Si le pasan algo para decir, lo dice un rato al aparecer */
  useEffect(() => { if (say) { const t = setTimeout(() => decir(say), 700); return () => clearTimeout(t); } }, [say]);
  useEffect(() => () => clearTimeout(bubbleT.current), []);
  const [p, setP] = useState<'neutral' | 'wave'>(gesture === 'wave' ? 'neutral' : pose);
  const [blink, setBlink] = useState(false);
  const boing = useAnimationControls();
  const blinkT = React.useRef<any>();
  /* Al tocarla pestañea en el acto (y da un saltito chiquito) */
  const tap = () => {
    clearTimeout(blinkT.current);
    setBlink(true);
    blinkT.current = setTimeout(() => setBlink(false), 170);
    if (act) setPlay((n) => n + 1); /* con una acción animada, tocarla la repite */
    else {
      if (!reduce) boing.start({ scaleY: [1, 0.92, 1.06, 1], y: [0, 3, -10, 0], transition: { duration: 0.5 } });
      setSpout((n) => n + 1);
    }
    decir(FRASES[Math.floor(Math.random() * FRASES.length)], 3200);
  };
  useEffect(() => () => clearTimeout(blinkT.current), []);

  /* Saludo: alterna las poses unas veces y termina saludando */
  useEffect(() => {
    if (gesture !== 'wave' || reduce) { setP(pose === 'neutral' && gesture === 'wave' ? 'wave' : pose); return; }
    const seq = ['wave', 'neutral', 'wave', 'neutral', 'wave'] as const;
    const ts = seq.map((x, i) => setTimeout(() => setP(x), 350 + i * 330));
    return () => ts.forEach(clearTimeout);
  }, [gesture, pose, reduce]);

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
    <motion.button type="button" aria-label={label || 'Mascota de Aliada Digital'} onPointerDown={tap} onClick={(e) => { if (e.detail === 0) tap(); }}
      className={cx('relative shrink-0 select-none cursor-pointer [-webkit-tap-highlight-color:transparent]', className)} style={{ width: size, height: h }}
      initial={reduce ? false : { opacity: 0, transform: 'translate(0px, 18px) scale(0.92)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px) scale(1)' }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
      {act ? <Clip act={act} play={play} /> : (
      <motion.div className="absolute inset-0" animate={boing} style={{ transformOrigin: '50% 100%' }}>
      <motion.div className="absolute inset-0"
        animate={reduce || !idle ? {} : gesture === 'hop' ? { y: [0, -14, 0, -6, 0], scaleY: [1, 1.04, 0.96, 1.02, 1] } : gesture === 'nod' ? { rotate: [0, -4, 3, 0] } : { y: [0, -4, 0] }}
        transition={gesture === 'hop' ? { duration: 1.1, delay: 0.3 } : gesture === 'nod' ? { duration: 1.2, delay: 0.4 } : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
        <img src={SRC.neutral} alt="" draggable={false} className={cx('absolute inset-0 w-full h-full', p === 'neutral' ? 'opacity-100' : 'opacity-0')} />
        <img src={SRC.wave} alt="" draggable={false} className={cx('absolute inset-0 w-full h-full', p === 'wave' ? 'opacity-100' : 'opacity-0')} />
        <span className="absolute rounded-full origin-top transition-transform duration-75" style={{ left: '39.2%', top: '28.4%', width: '6.4%', height: '6.4%', background: '#6582ee', borderBottom: `${Math.max(1, size / 140)}px solid #26265e`, transform: `scaleY(${blink ? 1 : 0})` }} />
      </motion.div>
      </motion.div>)}
      {!reduce && spout > 0 && <Spout key={spout} size={size} />}
      <AnimatePresence>{bubble && <Bubble key={bubble} text={bubble} side={side} />}</AnimatePresence>
    </motion.button>
  );
}
