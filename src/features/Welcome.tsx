import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Smartphone, Lock, ArrowRight } from 'lucide-react';
import { useD, mut } from '../store';
import { Button, Choices, Field, TextInput, LOGO, ease } from '../ui';
import { toast } from '../ui/toast';
import { LEGAL } from '../config';

const ETAPAS = [
  { k: 'falta', t: 'Todavía me falta para jubilarme', s: 'Quiero prepararme con tiempo' },
  { k: 'tramitando', t: 'Estoy haciendo el trámite', s: 'Necesito ordenar papeles y plata' },
  { k: 'jubilado', t: 'Ya cobro la jubilación', s: 'Quiero cuidar mi plata y aprender cosas nuevas' }
];
const PILARES = [
  { i: <Wallet />, t: 'Finanzas', s: 'Tu plata bajo control, tus trámites en orden, pagos con el celular sin miedo y nuevas formas de generar ingresos.', c: 'bg-glow/15 text-glow' },
  { i: <Smartphone />, t: 'Mundo digital', s: 'WhatsApp, inteligencia artificial, Google, redes y creación de contenido, con videos cortos y narración. Incluye el Escudo antiestafas.', c: 'bg-[rgb(157_176_255/.18)] text-[rgb(157_176_255)]' }
];

export default function Welcome() {
  const [step, setStep] = useState(0);
  const perfil = useD((d) => d.perfil);
  return (
    <div className="min-h-screen hero-glow text-onbrand relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-50 pointer-events-none" />
      <div className="relative max-w-[34rem] mx-auto px-5 py-10 sm:py-16 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="a" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease }} className="flex flex-col gap-8 flex-1">
              <div className="flex items-center gap-3">
                <motion.img src={LOGO} alt="" className="size-16 rounded-full shadow-lift" initial={{ scale: 0.6, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }} />
                <div><div className="font-head font-semibold text-[1.35rem] leading-none">Aliada Digital</div><div className="text-[.85rem] opacity-75 mt-1">Jubilación con calma</div></div>
              </div>
              <div className="flex flex-col gap-4">
                <motion.h1 className="text-[2.3rem] sm:text-[2.7rem] text-onbrand" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6, ease }}>
                  Tu experiencia, <span className="text-glow">tus reglas.</span> Nosotros te acompañamos.
                </motion.h1>
                <motion.p className="text-[1.08rem] opacity-85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  Una aplicación para llegar a la jubilación —o vivirla— con la plata ordenada y el mundo digital a tu favor.
                </motion.p>
              </div>
              <div className="flex flex-col gap-3">
                {PILARES.map((p, i) => (
                  <motion.div key={p.t} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease }}
                    className="flex gap-4 items-start rounded-xl bg-white/[.06] border border-white/10 p-4">
                    <span className={'grid place-items-center size-11 rounded-xl shrink-0 [&_svg]:size-6 ' + p.c}>{p.i}</span>
                    <div><b className="block">{p.t}</b><span className="text-[.92rem] opacity-80">{p.s}</span></div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[.88rem] opacity-80"><Lock className="size-4" />Tus datos quedan solo en este dispositivo. Sin cuentas ni claves.</div>
              <div className="mt-auto"><Button variant="glow" size="lg" block onClick={() => setStep(1)} iconRight={<ArrowRight />}>Empezar</Button></div>
            </motion.div>
          ) : (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }} className="flex flex-col gap-6">
              <h1 className="text-[2rem] text-onbrand">Contanos un poco de vos</h1>
              <div className="rounded-xl3 bg-surface text-ink p-5 sm:p-6 flex flex-col gap-6 shadow-lift">
                <Field label={<>¿Cómo querés que te llamemos? <span className="text-muted font-normal">(opcional)</span></>} htmlFor="nm">
                  <TextInput id="nm" value={perfil.nombre} onChange={(v) => mut((d) => { d.perfil.nombre = v; })} placeholder="Tu nombre" />
                </Field>
                <Field label="¿En qué momento estás?">
                  <Choices options={ETAPAS} value={perfil.etapa} onChange={(v) => mut((d) => { d.perfil.etapa = v; })} />
                </Field>
                <Button size="lg" block iconRight={<ArrowRight />} onClick={() => {
                  if (!perfil.etapa) { toast('Elegí en qué momento estás'); return; }
                  mut((d) => { d.perfil.onb = true; d.tr.sit.sit = ({ falta: 'nada', tramitando: 'inicio', jubilado: 'jub' } as any)[d.perfil.etapa] || ''; });
                }}>Entrar a mi espacio</Button>
              </div>
              <button className="self-start text-onbrand/80 font-bold underline underline-offset-4" onClick={() => setStep(0)}>Volver</button>
              <p className="text-[.78rem] opacity-70">{LEGAL}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
