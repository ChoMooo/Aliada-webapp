import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Smartphone, Lock, ArrowRight, TrendingUp } from 'lucide-react';
import { useD, mut } from '../store';
import { Button, Choices, Chips, Field, TextInput, ease, Mascot, Topo } from '../ui';
import { toast } from '../ui/toast';
import { LEGAL } from '../config';

export const ETAPAS = [
  { k: 'falta', t: 'Sigo trabajando', s: 'Quiero ordenarme y aprender a mi ritmo' },
  { k: 'tramitando', t: 'Estoy en un cambio de etapa', s: 'Con trámites o papeles en curso' },
  { k: 'jubilado', t: 'Ya dejé de trabajar', s: 'Tengo más tiempo para mí' }
];
export const SEXOS: [string, string][] = [['mujer', 'Mujer'], ['hombre', 'Hombre'], ['nd', 'Prefiero no decirlo']];
const PILARES = [
  { i: <Wallet />, t: 'Finanzas', s: 'Tu plata ordenada, tus trámites claros y pagos con el celular sin miedo.' },
  { i: <TrendingUp />, t: 'Inversiones', s: 'Cómo se invierte en Argentina, explicado paso a paso.' },
  { i: <Smartphone />, t: 'Mundo digital', s: 'WhatsApp, IA, Google, redes y más, con videos cortos y narración.' }
];

export default function Welcome() {
  const [step, setStep] = useState(0);
  const perfil = useD((d) => d.perfil);
  const finish = () => {
    if (!perfil.etapa) { toast('Elegí una opción para continuar'); return; }
    mut((d) => {
      d.perfil.onb = true;
      d.tr.sit.sit = ({ falta: 'nada', tramitando: 'inicio', jubilado: 'jub' } as any)[d.perfil.etapa] || '';
      if (!d.tr.sit.sexo && d.perfil.sexo) d.tr.sit.sexo = ({ mujer: 'F', hombre: 'M', nd: 'X' } as any)[d.perfil.sexo];
    });
  };
  return (
    <div className="min-h-dvh hero-glow text-onbrand relative overflow-hidden">
      <Topo className="absolute -right-40 -top-24 w-[640px] text-white/25" draw />
      <div className="relative max-w-[34rem] mx-auto px-5 py-8 sm:py-14 min-h-dvh flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="a" initial={{ opacity: 0, transform: 'translateY(16px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} exit={{ opacity: 0, transform: 'translateY(-12px)' }} transition={{ duration: 0.35, ease }} className="flex flex-col gap-7 flex-1">
              <div className="flex items-end justify-between gap-4">
                <div><div className="font-head font-semibold text-[1.3rem] leading-none">Aliada Digital</div><div className="text-[.85rem] opacity-75 mt-1">A tu ritmo, con calma</div></div>
                <Mascot gesture="wave" pose="wave" size={112} label="La mascota de Aliada te saluda" />
              </div>
              <div className="flex flex-col gap-3">
                <motion.h1 className="text-[2.2rem] sm:text-[2.6rem] text-onbrand leading-[1.08]" initial={{ opacity: 0, transform: 'translateY(10px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ delay: 0.1, duration: 0.4, ease }}>
                  Tu experiencia, <span className="text-glow">tus reglas.</span> Nosotros te acompañamos.
                </motion.h1>
                <motion.p className="text-[1.08rem]" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2, duration: 0.3 }}>
                  Ordená tu plata, aprendé a invertir y sacale todo el provecho al celular. Sin apuro y con explicaciones claras.
                </motion.p>
              </div>
              <div className="flex flex-col gap-2.5">
                {PILARES.map((p, i) => (
                  <motion.div key={p.t} initial={{ opacity: 0, transform: 'translateX(-12px)' }} animate={{ opacity: 1, transform: 'translateX(0px)' }} transition={{ delay: 0.28 + i * 0.06, duration: 0.35, ease }}
                    className="flex gap-4 items-center rounded-xl bg-white/[.06] border border-white/10 px-4 py-3">
                    <span className="grid place-items-center size-10 rounded-lg shrink-0 bg-glow/15 text-glow [&_svg]:size-5">{p.i}</span>
                    <div><b className="block">{p.t}</b><span className="text-[.9rem] opacity-80">{p.s}</span></div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[.88rem] opacity-80"><Lock className="size-4 shrink-0" />Tus datos quedan solo en este dispositivo. Sin cuentas ni claves.</div>
              <div className="mt-auto"><Button variant="glow" size="lg" block onClick={() => setStep(1)} iconRight={<ArrowRight />}>Empezar</Button></div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="b" initial={{ opacity: 0, transform: 'translateX(20px)' }} animate={{ opacity: 1, transform: 'translateX(0px)' }} exit={{ opacity: 0, transform: 'translateX(-20px)' }} transition={{ duration: 0.28, ease }} className="flex flex-col gap-6">
              <div className="flex items-center gap-2 text-[.85rem] opacity-80"><span className="h-1.5 w-10 rounded-full bg-glow" /><span className="h-1.5 w-10 rounded-full bg-white/25" />Paso 1 de 2</div>
              <h1 className="text-[2rem] text-onbrand">Contanos un poco de vos</h1>
              <div className="rounded-xl3 bg-surface text-ink p-5 sm:p-6 flex flex-col gap-6 shadow-lift">
                <Field label={<>¿Cómo querés que te llamemos? <span className="text-muted font-normal">(opcional)</span></>} htmlFor="nm">
                  <TextInput id="nm" value={perfil.nombre} onChange={(v) => mut((d) => { d.perfil.nombre = v; })} placeholder="Tu nombre" />
                </Field>
                <Field label="¿Cómo te identificás?" hint="Lo usamos para mostrarte contenidos pensados para vos.">
                  <Chips options={SEXOS} value={perfil.sexo} onChange={(v) => mut((d) => { d.perfil.sexo = v as any; })} />
                </Field>
                <Button size="lg" block iconRight={<ArrowRight />} onClick={() => setStep(2)}>Continuar</Button>
              </div>
              <button className="self-start text-onbrand/80 font-semibold underline underline-offset-4" onClick={() => setStep(0)}>Volver</button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="c" initial={{ opacity: 0, transform: 'translateX(20px)' }} animate={{ opacity: 1, transform: 'translateX(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease }} className="flex flex-col gap-6">
              <div className="flex items-center gap-2 text-[.85rem] opacity-80"><span className="h-1.5 w-10 rounded-full bg-glow" /><span className="h-1.5 w-10 rounded-full bg-glow" />Paso 2 de 2</div>
              <h1 className="text-[2rem] text-onbrand">¿En qué momento estás?</h1>
              <div className="rounded-xl3 bg-surface text-ink p-5 sm:p-6 flex flex-col gap-6 shadow-lift">
                <Choices options={ETAPAS} value={perfil.etapa} onChange={(v) => mut((d) => { d.perfil.etapa = v; })} />
                <Button size="lg" block iconRight={<ArrowRight />} onClick={finish}>Entrar a mi espacio</Button>
              </div>
              <button className="self-start text-onbrand/80 font-semibold underline underline-offset-4" onClick={() => setStep(1)}>Volver</button>
              <p className="text-[.78rem] opacity-70">{LEGAL}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
