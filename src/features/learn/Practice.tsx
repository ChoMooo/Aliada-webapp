/* Práctica tocando: las mismas pantallas del video, pero ahora toca la persona.
   Si toca en el lugar correcto avanza; si no, aparece una pista (la marca verde y el dedo). Nada se envía de verdad. */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, Lightbulb, RotateCcw, Hand } from 'lucide-react';
import { PhoneScreen, type Frame } from './Screen';
import { Button, cx } from '../../ui';

export function TapPractice({ frames, onDone, done }: { frames: Frame[]; onDone: () => void; done?: boolean }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [miss, setMiss] = useState(0);
  const [hint, setHint] = useState(false);
  const [ok, setOk] = useState(false);
  const [fin, setFin] = useState(false);
  /* el teléfono entra entero en la pantalla junto con la consigna */
  const [pw] = useState(() => {
    if (typeof window === 'undefined') return 250;
    const byH = Math.floor(((window.innerHeight || 800) - 300) * 280 / 580);
    return Math.max(180, Math.min(window.innerWidth < 520 ? 236 : 260, byH));
  });
  const f = frames[i];
  const box = useRef<HTMLDivElement>(null);
  /* al empezar, la consigna y el teléfono quedan a la vista (debajo de la barra superior) */
  useEffect(() => { const t = setTimeout(() => box.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }), 380); return () => clearTimeout(t); }, []);

  const pick = (good: boolean) => {
    if (ok || fin) return;
    if (!good) { setMiss((m) => m + 1); setHint(true); return; }
    setOk(true);
    setTimeout(() => {
      setOk(false); setHint(false); setMiss(0);
      if (i >= frames.length - 1) { setFin(true); onDone(); } else setI(i + 1);
    }, reduce ? 250 : 600);
  };
  const again = () => { setI(0); setFin(false); setHint(false); setMiss(0); };

  if (fin) return (
    <div className="flex flex-col items-center text-center gap-3 py-4">
      <span className="grid place-items-center size-16 rounded-full bg-mint text-teal"><Check className="size-8" /></span>
      <h3 className="text-[1.35rem]">¡Lo hiciste!</h3>
      <p className="text-muted max-w-[26rem]">Recorriste los {frames.length} pasos tocando vos. Ahora ya sabés dónde está cada cosa en la app de verdad.</p>
      <Button variant="ghost" size="sm" icon={<RotateCcw />} onClick={again}>Practicar de nuevo</Button>
    </div>
  );

  return (
    <div ref={box} className="scroll-mt-20 flex flex-col md:flex-row-reverse md:items-start md:justify-end items-center gap-3 md:gap-8">
      <div className="w-full max-w-[24rem] flex flex-col gap-3">
        <div className="flex gap-1" aria-hidden>
          {frames.map((_, k) => <span key={k} className={cx('h-1.5 flex-1 rounded-full', k < i ? 'bg-accent' : k === i ? 'bg-accent/40' : 'bg-line')} />)}
        </div>
        <div className="rounded-lg bg-surface border border-line px-4 py-3" aria-live="polite">
          <span className="flex items-center gap-1.5 text-[.8rem] font-semibold text-muted"><Hand className="size-4" />Paso {i + 1} de {frames.length} · tocá vos</span>
          <p className="text-[1.08rem] font-medium leading-snug mt-1">{f.cap}</p>
        </div>
        <AnimatePresence initial={false}>
          {hint && (
            <motion.p key="h" initial={{ opacity: 0, transform: 'translate(0px, 4px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              className="flex gap-2 text-[.95rem] rounded-lg bg-warn text-warnink px-3.5 py-2.5">
              <Lightbulb className="size-5 shrink-0" />{miss > 0 ? 'Casi. Tocá donde aparece la marca verde.' : 'Tocá donde aparece la marca verde.'}
            </motion.p>
          )}
        </AnimatePresence>
        {!hint && <button type="button" onClick={() => setHint(true)} className="press self-start text-[.95rem] font-semibold text-accent underline underline-offset-4 min-h-[2.75rem]">No lo encuentro, mostrame dónde</button>}
        {done && <p className="text-[.85rem] text-muted">Ya completaste esta lección: podés practicar las veces que quieras.</p>}
      </div>
      <div className="relative shrink-0">
        <PhoneScreen frame={f} width={pw} practice hint={hint} onPick={pick} animateFinger={false} />
        <AnimatePresence>
          {ok && (
            <motion.div className="absolute inset-0 grid place-items-center pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <motion.span className="grid place-items-center size-20 rounded-full bg-accent text-onaccent shadow-lift"
                initial={{ scale: reduce ? 1 : 0.7 }} animate={{ transform: 'scale(1)' }} transition={{ type: 'spring', duration: 0.35, bounce: 0.3 }}><Check className="size-10" /></motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
