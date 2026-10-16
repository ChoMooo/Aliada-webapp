import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle, MessageSquare, PhoneIncoming, Mail, Megaphone, Check, X, RotateCcw, Trophy } from 'lucide-react';
import { useStore, mut } from '../../store';
import { PageHeader, Card, Button, Note, Bullets, Celebrate, Ring, ease, cx } from '../../ui';
import { ESCENARIOS, type Canal } from '../../content/escudo';

const CANAL: Record<Canal, [string, React.ReactNode, string]> = {
  whatsapp: ['Mensaje', <MessageCircle key="w" />, 'bg-mint text-accent'], sms: ['SMS', <MessageSquare key="s" />, 'bg-skysoft text-sky'],
  llamada: ['Llamada', <PhoneIncoming key="l" />, 'bg-badsoft text-bad'], correo: ['Correo', <Mail key="c" />, 'bg-violetsoft text-violet'], oferta: ['Publicidad', <Megaphone key="o" />, 'bg-ambersoft text-amber']
};

export default function Simulador() {
  const d = useStore((s) => s.d);
  const first = ESCENARIOS.findIndex((e) => !d.escudo.vistos[e.id]);
  const [i, setI] = useState(first < 0 ? 0 : first);
  const [pick, setPick] = useState<number | null>(null);
  const [end, setEnd] = useState(false);
  const e = ESCENARIOS[i];
  const ok = Object.values(d.escudo.vistos).filter((x) => x === 'ok').length;
  if (end) return (
    <div className="flex flex-col gap-5">
      <PageHeader back={{ to: '/digital/escudo', label: 'Escudo antiestafas' }} title="Resultado" />
      <Card className="relative flex flex-col items-center gap-3 text-center py-8 overflow-visible">
        <Celebrate show={ok >= 7} />
        <Ring value={ok} max={ESCENARIOS.length} size={110} stroke={10}><span className="flex flex-col items-center"><Trophy className="size-7 text-accent" /><span className="text-[1rem]">{ok}/{ESCENARIOS.length}</span></span></Ring>
        <h2 className="text-[1.6rem]">{ok >= 9 ? '¡Escudo de oro!' : ok >= 7 ? '¡Muy bien!' : 'Buen comienzo'}</h2>
        <p className="text-muted max-w-sm">{ok >= 7 ? 'Reconocés la mayoría de los trucos. Compartí lo que aprendiste con tu familia.' : 'Repasá las situaciones donde dudaste: con práctica se vuelven obvias.'}</p>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button icon={<RotateCcw />} onClick={() => { mut((x) => { x.escudo.vistos = {}; }); setI(0); setPick(null); setEnd(false); }}>Practicar de nuevo</Button>
        <Button variant="ghost" to="/digital/escudo/analizador">Analizar un mensaje real</Button>
      </div>
    </div>
  );
  const c = CANAL[e.canal];
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={{ to: '/digital/escudo', label: 'Escudo antiestafas' }} title="Simulador de estafas" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[.85rem] text-muted"><span>Situación {i + 1} de {ESCENARIOS.length}</span><span>{ok} detectadas</span></div>
        <div className="flex gap-1">{ESCENARIOS.map((x, k) => <span key={x.id} className={cx('h-2 flex-1 rounded-full', d.escudo.vistos[x.id] === 'ok' ? 'bg-accent' : d.escudo.vistos[x.id] === 'mal' ? 'bg-bad' : k === i ? 'bg-ink/40' : 'bg-line')} />)}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={e.id} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }} className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className={cx('grid place-items-center size-11 rounded-xl [&_svg]:size-5', c[2])}>{c[1]}</span>
              <div><b className="block text-[.95rem]">{c[0]}</b><span className="text-[.82rem] text-muted">{e.de}</span></div>
            </div>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className={cx('rounded-xl px-4 py-3 text-[1.04rem] leading-relaxed', e.canal === 'llamada' ? 'bg-sunk italic' : 'bg-sunk rounded-tl-md')}>{e.msg}</motion.div>
          </Card>
          <h2 className="text-[1.3rem]">¿Qué hacés?</h2>
          <div className="flex flex-col gap-2.5">
            {e.op.map((o, k) => {
              const picked = pick === k;
              return (
                <motion.button key={o.t} whileTap={{ scale: 0.985 }} disabled={pick != null}
                  onClick={() => { setPick(k); mut((x) => { x.escudo.vistos[e.id] = o.ok ? 'ok' : 'mal'; }); }}
                  animate={pick != null && picked && !o.ok ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                  className={cx('flex items-center gap-3 text-left min-h-[3.8rem] px-4 py-3 rounded-xl border-2 font-bold',
                    pick == null ? 'border-line bg-surface hover:border-ink/25' : o.ok ? 'border-accent bg-mint' : picked ? 'border-bad bg-badsoft' : 'border-line bg-surface opacity-60')}>
                  <span className="flex-1">{o.t}</span>{pick != null && o.ok && <Check className="size-5 text-accent" />}{pick != null && picked && !o.ok && <X className="size-5 text-bad" />}
                </motion.button>
              );
            })}
          </div>
          {pick != null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
              <Note tone={e.op[pick].ok ? 'good' : 'bad'} title={e.op[pick].ok ? '¡Bien detectado!' : 'Era una estafa'}>{e.op[pick].fb}</Note>
              <Card tone="sunk"><b className="block mb-1.5">Señales de alerta</b><Bullets items={e.senales} /></Card>
              <Card tone="mint"><b>Regla:</b> {e.regla}</Card>
              <Button iconRight={<ArrowRight />} onClick={() => { setPick(null); if (i < ESCENARIOS.length - 1) setI(i + 1); else setEnd(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{i < ESCENARIOS.length - 1 ? 'Siguiente situación' : 'Ver mi resultado'}</Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
