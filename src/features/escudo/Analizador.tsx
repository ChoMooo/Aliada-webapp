import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanSearch, ShieldAlert, ShieldQuestion, ShieldCheck, Eraser } from 'lucide-react';
import { mut } from '../../store';
import { PageHeader, Card, Button, Note, TextArea, Bullets, Tag, cx } from '../../ui';
import { analizar, ESCENARIOS } from '../../content/escudo';

export default function Analizador() {
  const [t, setT] = useState('');
  const [res, setRes] = useState<ReturnType<typeof analizar> | null>(null);
  const run = () => { if (!t.trim()) return; setRes(analizar(t)); mut((x) => { x.escudo.analisis += 1; }); };
  const lv = res?.nivel;
  const head = lv === 'alto' ? ['Muchas señales de alerta', 'bg-badsoft border-bad text-bad', <ShieldAlert key="a" />] : lv === 'medio' ? ['Algunas señales de alerta', 'bg-warn border-amber text-warnink', <ShieldQuestion key="m" />] : ['No encontramos señales típicas', 'bg-mint border-accent text-accent', <ShieldCheck key="b" />];
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={{ to: '/escudo', label: 'Escudo' }} kicker="Escudo antiestafas" title="Analizar un mensaje" lead="Copiá el mensaje sospechoso y pegalo acá. Lo revisamos dentro de tu celular: no se envía a ningún lado." />
      <Card className="flex flex-col gap-3">
        <TextArea label="Mensaje sospechoso" value={t} onChange={(v) => { setT(v); setRes(null); }} placeholder="Pegá acá el mensaje (mantené apretado y elegí “Pegar”)" className="!min-h-[9rem]" />
        <div className="flex flex-wrap gap-2">
          <Button icon={<ScanSearch />} disabled={!t.trim()} onClick={run}>Analizar</Button>
          {t && <Button variant="ghost" icon={<Eraser />} onClick={() => { setT(''); setRes(null); }}>Borrar</Button>}
          <Button variant="quiet" size="sm" onClick={() => { const e = ESCENARIOS[Math.floor(Math.random() * ESCENARIOS.length)]; setT(e.msg.replace(/[“”]/g, '')); setRes(null); }}>Probar con un ejemplo</Button>
        </div>
      </Card>
      <AnimatePresence mode="wait">
        {res && (
          <motion.div key={t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} className={cx('flex items-center gap-3 rounded-2xl border-2 px-4 py-4 font-bold text-[1.15rem] [&_svg]:size-8', head[1] as string)}>{head[2]}{head[0]}</motion.div>
            {res.found.length > 0 ? (<>
              <div className="flex flex-col gap-3">
                {res.found.map((s, k) => (
                  <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.07 }}>
                    <Card className="flex flex-col gap-1"><div className="flex items-center justify-between gap-2"><b>{s.t}</b><Tag tone={s.peso >= 3 ? 'bad' : 'warn'}>{s.peso >= 3 ? 'Grave' : 'Atención'}</Tag></div><p className="text-[.94rem] text-muted">{s.e}</p></Card>
                  </motion.div>
                ))}
              </div>
              <Card tone="mint" className="flex flex-col gap-2"><b>Qué verificar antes de hacer nada</b><Bullets items={[...new Set(res.found.map((s) => s.verificar))]} /></Card>
            </>) : (
              <Note tone="info">No vimos los trucos más comunes, <b>pero eso no garantiza que sea seguro</b>. Si te pide plata, datos o apuro, verificá por otro medio con quien te escribe.</Note>
            )}
            <p className="text-[.82rem] text-muted">El analizador busca señales típicas de estafa con reglas simples. Nunca afirma que un mensaje es seguro: la decisión es tuya, y ante la duda, consultá con alguien de confianza.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
