import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { PhoneScreen, type Frame } from './Screen';
import { demoKey, entry, urlOf, stopAll, claim, rate } from '../../lib/audio';
import { useD } from '../../store';
import { cx, SpeedControl } from '../../ui';

/* Mini video: pantallas animadas con narración y subtítulos sincronizados */
export function DemoPlayer({ frames, title }: { frames: Frame[]; title?: string }) {
  const caps = useMemo(() => frames.map((f) => f.cap), [frames]);
  const e = entry(demoKey(caps));
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [noAudio, setNoAudio] = useState(false);
  const [t, setT] = useState(0);
  const vel = useD((d) => d.aj.vel); const r = rate();
  useEffect(() => { if (audio.current) audio.current.playbackRate = rate(); }, [vel]); // la barra cambia la velocidad mientras suena
  const [pw] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 520 ? 214 : 250));
  const audio = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<any>(null);
  const marks = e?.m || [];
  const durOf = (k: number) => (e ? ((marks[k + 1] ?? e.d) - (marks[k] ?? 0)) : Math.max(3.6, caps[k].length * 0.07));
  const total = e ? e.d : caps.reduce((a, _, k) => a + durOf(k), 0);
  const startOf = (k: number) => (e ? marks[k] ?? 0 : caps.slice(0, k).reduce((a, _, j) => a + durOf(j), 0));

  useEffect(() => {
    if (e) { const a = new Audio(urlOf(e)); a.preload = 'auto'; audio.current = a;
      a.ontimeupdate = () => { setT(a.currentTime); let k = 0; marks.forEach((m, j) => { if (a.currentTime >= m - 0.05) k = j; }); setI(k); };
      a.onended = () => { setPlaying(false); setT(e.d); };
    }
    return () => { audio.current?.pause(); clearInterval(timer.current); };
  }, []);
  useEffect(() => { if (audio.current) audio.current.muted = muted; }, [muted]);
  useEffect(() => {
    clearInterval(timer.current);
    if (!playing || (e && !noAudio)) return;
    timer.current = setInterval(() => setT((x) => { const n = x + 0.1 * rate(); if (n >= total) { setPlaying(false); return total; } let k = 0; for (let j = 0; j < caps.length; j++) if (n >= startOf(j)) k = j; setI(k); return n; }), 100);
    return () => clearInterval(timer.current);
  }, [playing, noAudio]);

  const play = () => { stopAll(); claim(() => { audio.current?.pause(); setPlaying(false); }); setStarted(true); if (t >= total - 0.05) seek(0); if (audio.current && !noAudio) { audio.current.playbackRate = rate(); } if (audio.current && !noAudio) audio.current.play().catch(() => setNoAudio(true)); setPlaying(true); };
  const pause = () => { audio.current?.pause(); setPlaying(false); };
  const seek = (k: number) => { const s = startOf(k); setI(k); setT(s); if (audio.current) audio.current.currentTime = s; };
  const go = (k: number) => { seek(Math.max(0, Math.min(frames.length - 1, k))); setStarted(true); };
  const ended = !playing && t >= total - 0.05 && started;
  return (
    <div className="flex flex-col md:flex-row md:items-center items-center gap-4 md:gap-8">
      <div className="relative shrink-0">
        <PhoneScreen frame={frames[i]} width={pw} />
        <AnimatePresence>{!started && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={play}
            className="absolute inset-0 grid place-items-center rounded-[34px] bg-[#0f1714]/55 backdrop-blur-[1px] text-white">
            <span className="flex flex-col items-center gap-2"><span className="grid place-items-center size-16 rounded-full bg-white text-ink"><Play className="size-7 ml-1" /></span><b className="text-[1rem]">Ver el video</b><span className="text-[.85rem] opacity-85">{Math.round(total / r)} segundos{e ? ' · con voz' : ''}</span></span>
          </motion.button>)}
        </AnimatePresence>
      </div>
      <div className="w-full max-w-[24rem] flex flex-col gap-3 md:self-center">
        <div className="flex gap-1" aria-hidden>
          {frames.map((_, k) => {
            const s = startOf(k), d = durOf(k), p = Math.max(0, Math.min(1, (t - s) / d));
            return <button key={k} onClick={() => go(k)} aria-label={'Paso ' + (k + 1)} className="h-1.5 flex-1 rounded-full bg-line overflow-hidden"><span className="block h-full bg-accent" style={{ width: (k < i ? 1 : k === i ? p : 0) * 100 + '%' }} /></button>;
          })}
        </div>
        <div className="min-h-[4.5rem] rounded-lg bg-surface border border-line px-4 py-3" aria-live="polite">
          <span className="text-[.78rem] font-semibold text-muted">Paso {i + 1} de {frames.length}{title ? ' · ' + title : ''}</span>
          <AnimatePresence mode="wait"><motion.p key={i} initial={{ opacity: 0, transform: 'translate(0px, 4px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} exit={{ opacity: 0 }} className="text-[1.05rem] font-medium leading-snug mt-0.5">{caps[i]}</motion.p></AnimatePresence>
        </div>
        <div className="flex items-center justify-center gap-2">
          <IconBtn label="Paso anterior" onClick={() => go(i - 1)} disabled={i === 0}><SkipBack /></IconBtn>
          {playing ? <IconBtn big label="Pausar" onClick={pause}><Pause /></IconBtn> : <IconBtn big label={ended ? 'Ver de nuevo' : 'Reproducir'} onClick={play}>{ended ? <RotateCcw /> : <Play className="ml-0.5" />}</IconBtn>}
          <IconBtn label="Paso siguiente" onClick={() => go(i + 1)} disabled={i === frames.length - 1}><SkipForward /></IconBtn>
          {e && <IconBtn label={muted ? 'Activar sonido' : 'Silenciar'} onClick={() => setMuted(!muted)}>{muted ? <VolumeX /> : <Volume2 />}</IconBtn>}
          <SpeedControl align="right" />
        </div>
      </div>
    </div>
  );
}
function IconBtn({ children, onClick, label, disabled, big }: { children: React.ReactNode; onClick: () => void; label: string; disabled?: boolean; big?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className={cx('grid place-items-center rounded-full disabled:opacity-30', big ? 'size-14 bg-ink text-bg [&_svg]:size-6' : 'size-11 border border-line bg-surface [&_svg]:size-5')}>
      {children}
    </motion.button>
  );
}

/* Miniatura de un paso */
export function StepThumb({ frame, width = 92 }: { frame: Frame; width?: number }) {
  return <div className="shrink-0" aria-hidden><PhoneScreen frame={frame} width={width} animateFinger={false} /></div>;
}

/* Guía en imágenes: cada acción con su pantallita */
export function VisualGuide({ frames }: { frames: Frame[] }) {
  return (
    <ol className="flex flex-col gap-2.5">
      {frames.map((f, i) => (
        <li key={i} className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3">
          <StepThumb frame={f} width={78} />
          <div className="min-w-0"><span className="text-[.78rem] font-semibold text-accent">Paso {i + 1}</span><p className="text-[1rem] leading-snug">{f.cap}</p></div>
        </li>
      ))}
    </ol>
  );
}
