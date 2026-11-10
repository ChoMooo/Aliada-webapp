/* Primera vez: "¿Qué te gustaría resolver primero?"
   Pantalla completa sobre una foto del mar al atardecer, con tarjetas de vidrio numeradas para elegir varias
   y la opción de contarlo hablando. Con lo elegido se arma "tu plan" de misiones (las elegidas van primero). */
import { HomeSea } from '../ui/ocean';
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mic, ArrowRight } from 'lucide-react';
import { useStore, mut } from '../store';
import { Mascot, cx } from '../ui';
import { Display, ShineButton } from '../ui/sunset';
import { MISION } from '../content/misiones';
import { MisionCard } from './Misiones';
import { toast } from '../ui/toast';

const OPC: { id: string; t: string; k: string[] }[] = [
  { id: 'plata-mes', t: 'Saber si me alcanza la plata', k: ['alcanza', 'plata', 'mes', 'gasto', 'sueldo', 'cobro'] },
  { id: 'recargos', t: 'No pagar recargos', k: ['vencimiento', 'recargo', 'pagar a tiempo', 'factura', 'luz', 'gas'] },
  { id: 'ahorros', t: 'Que mis ahorros no pierdan valor', k: ['ahorro', 'inflación', 'plazo fijo', 'rinde', 'invertir'] },
  { id: 'ingreso', t: 'Ganar un ingreso extra', k: ['ingreso', 'trabajo', 'ganar', 'vender', 'extra'] },
  { id: 'anses', t: 'Ir a ANSES o PAMI con todo listo', k: ['anses', 'pami', 'trámite', 'turno', 'jubil'] },
  { id: 'mensaje', t: 'Darme cuenta de una estafa', k: ['estafa', 'mensaje', 'cuento', 'robo', 'seguridad'] },
  { id: 'videollamada', t: 'Hacer videollamadas', k: ['videollamada', 'nietos', 'hijos', 'familia', 'ver'] },
  { id: 'pagar', t: 'Pagar con el celular', k: ['qr', 'transfer', 'billetera', 'mercado pago', 'pagar con'] },
  { id: 'papel', t: 'Entender cartas y papeles', k: ['carta', 'papel', 'contrato', 'entender', 'inteligencia'] },
  { id: 'salud', t: 'Tener mis datos de salud a mano', k: ['salud', 'medicamento', 'médico', 'remedio', 'alergia'] }
];

const SR: any = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

export default function Empezar() {
  const nav = useNavigate();
  const nombre = useStore((s) => s.d.perfil.nombre.trim().split(/\s+/)[0] || '');
  const [sel, setSel] = useState<string[]>([]);
  const [plan, setPlan] = useState<string[] | null>(null);
  const [oyendo, setOyendo] = useState(false);
  const [dicho, setDicho] = useState('');
  const rec = useRef<any>(null);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  /* Contarlo hablando: el navegador pasa la voz a texto y buscamos palabras clave */
  const hablar = () => {
    if (!SR) return;
    if (oyendo) { rec.current?.stop(); return; }
    const r = new SR(); rec.current = r; r.lang = 'es-AR'; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = (e: any) => {
      const t = String(e.results[0][0].transcript || ''); setDicho(t);
      const low = t.toLowerCase(), hits = OPC.filter((o) => o.k.some((k) => low.includes(k))).map((o) => o.id);
      if (hits.length) setSel((s) => Array.from(new Set([...s, ...hits]))); else toast('No me di cuenta: elegí en las tarjetas');
    };
    r.onend = () => setOyendo(false); r.onerror = () => setOyendo(false);
    setOyendo(true); try { r.start(); } catch { setOyendo(false); }
  };

  const armar = () => {
    const ids = sel.length ? sel : ['plata-mes', 'mensaje', 'videollamada'];
    mut((d) => { d.mis.pref = ids; d.mis.enc = true; });
    setPlan(ids.slice(0, 3));
    window.scrollTo({ top: 0 });
  };
  const salir = () => { mut((d) => { d.mis.enc = true; }); nav('/', { replace: true }); };
  const cards = useMemo(() => (plan || []).map((id) => MISION(id)).filter(Boolean), [plan]);

  return (
    <div className="relative min-h-dvh text-white isolate overflow-hidden">
      <div className="fixed inset-0 -z-[2]"><HomeSea /></div>
      <div className="fixed inset-0 -z-[1] bg-[linear-gradient(180deg,rgb(7_15_28/.55),rgb(7_15_28/.35)_35%,rgb(7_15_28/.82)_75%,rgb(7_15_28/.94))]" />
      <div className="max-w-[36rem] mx-auto px-4 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] flex flex-col gap-6 min-h-dvh">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div key="q" className="flex flex-col gap-6" exit={{ opacity: 0, transform: 'translateY(-10px)' }} transition={{ duration: 0.2 }}>
              {/* La mascota va un poco más abajo para que su globo entre en la pantalla */}
              <div className="flex items-end justify-between gap-3 pt-14">
                <span className="glass-chip mb-2">Tu plan en Aliada</span>
                <Mascot size={78} act="piensa" say={nombre ? `¡Hola, ${nombre}! Elegí lo que quieras.` : 'Elegí lo que quieras, después lo cambiás.'} side="left" />
              </div>
              <div>
                <p className="text-white/75 text-[1rem]">Elegí todo lo que quieras</p>
                <Display className="text-white mt-1">¿Qué te gustaría resolver primero?</Display>
              </div>
              <div className="grid grid-cols-2 gap-3" role="group" aria-label="Lo que querés resolver">
                {OPC.map((o, i) => {
                  const on = sel.includes(o.id);
                  return (
                    <motion.button key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)}
                      initial={{ opacity: 0, transform: 'translateY(12px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ delay: 0.12 + i * 0.035, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className={cx('liquid press relative text-left rounded-[1.6rem] min-h-[7.2rem] p-4 flex flex-col justify-between', on && 'liquid-on')}>
                      <span className="flex items-center justify-between"><span className="text-[.8rem] font-semibold text-white/60 num">{String(i + 1).padStart(2, '0')}</span>
                        <span className={cx('grid place-items-center size-6 rounded-full border transition-colors', on ? 'bg-white text-[#0c192d] border-white' : 'border-white/40 text-transparent')}><Check className="size-4" strokeWidth={3} /></span></span>
                      <span className="text-[1.04rem] font-semibold leading-snug">{o.t}</span>
                    </motion.button>
                  );
                })}
              </div>
              {SR && (
                <div className="flex flex-col items-center gap-2">
                  <button type="button" onClick={hablar} aria-pressed={oyendo} className="press relative grid place-items-center size-16 rounded-full liquid">
                    <span className={cx('absolute -inset-4 -z-[1] rounded-full bg-[radial-gradient(ellipse_at_center,rgb(255_190_120/.55),rgb(255_150_90/.18)_45%,transparent_70%)] transition-opacity', oyendo ? 'opacity-100 animate-pulse' : 'opacity-70')} />
                    <Mic className="size-6" />
                  </button>
                  <span className="text-[.9rem] text-white/75">{oyendo ? 'Te escucho…' : dicho ? `“${dicho}”` : 'O contámelo hablando'}</span>
                </div>
              )}
              <div className="mt-auto flex flex-col gap-3 pt-2">
                <ShineButton block onClick={armar} iconRight={<ArrowRight />}>{sel.length ? `Armar mi plan (${sel.length})` : 'Armar mi plan'}</ShineButton>
                <button type="button" onClick={salir} className="self-center text-white/80 underline underline-offset-4 font-semibold min-h-[2.75rem]">Ahora no</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="p" className="flex flex-col gap-6" initial={{ opacity: 0, transform: 'translateY(12px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
              <div className="flex items-end justify-between gap-3 pt-6">
                <div><p className="text-white/75">Listo{nombre ? ', ' + nombre : ''}</p><Display className="text-white mt-1">Este es tu plan</Display></div>
                <Mascot size={88} act="festeja" say="¡Buen plan! Empezá por la primera." side="left" />
              </div>
              <p className="text-white/85 text-[1.05rem]">Tres misiones para empezar. Cada una te lleva paso a paso y termina en algo concreto que te llevás. Las demás quedan en el Inicio.</p>
              <div className="flex flex-col gap-3 text-ink">{cards.map((m) => m && <MisionCard key={m.id} m={m} />)}</div>
              <div className="mt-auto flex flex-col gap-3 pt-2">
                {cards[0] && <ShineButton block to={'/misiones/' + cards[0]!.id} iconRight={<ArrowRight />}>Empezar la primera</ShineButton>}
                <button type="button" onClick={() => nav('/', { replace: true })} className="self-center text-white/85 underline underline-offset-4 font-semibold min-h-[2.75rem]">Ir al Inicio</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
