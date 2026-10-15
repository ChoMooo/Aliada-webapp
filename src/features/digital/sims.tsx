import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Lock, Phone, Video, VideoOff, MicOff, SwitchCamera, PhoneOff, Pin, Archive, Search, QrCode, CheckCircle2, XCircle, Star, ShieldCheck, Copy, ExternalLink, Send, ArrowLeft, Play } from 'lucide-react';
import { PhoneFrame, Button, Chips, Field, TextInput, Note, Card, cx } from '../../ui';
import { copyText } from '../../lib/share';
import { money, pn } from '../../lib/format';

type SimProps = { onDone: () => void; done: boolean };
const Done = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 rounded-2xl bg-mint text-accent font-bold px-4 py-3"><CheckCircle2 className="size-5" />{children}</motion.div>
);
const Bubble = ({ me, children, time = '10:24' }: { me?: boolean; children: React.ReactNode; time?: string }) => (
  <div className={cx('max-w-[80%] rounded-2xl px-3 py-2 text-[.92rem] shadow-sm', me ? 'self-end bg-mint rounded-br-md' : 'self-start bg-surface rounded-bl-md')}>
    {children}<span className="block text-right text-[.65rem] text-muted mt-0.5">{time}</span>
  </div>
);

/* ---------- Audios ---------- */
function WaAudio({ onDone, done }: SimProps) {
  const [rec, setRec] = useState<'idle' | 'rec' | 'lock'>('idle');
  const [secs, setSecs] = useState(0);
  const [audios, setAudios] = useState<number[]>([]);
  const [msg, setMsg] = useState('Mantené apretado el micrófono para grabar.');
  const start = useRef({ x: 0, y: 0, t: 0 });
  const timer = useRef<any>(null);
  const stop = (send: boolean) => {
    clearInterval(timer.current);
    const held = (Date.now() - start.current.t) / 1000;
    if (send && held >= 1) { setAudios((a) => [...a, Math.max(1, Math.round(held))]); setMsg('¡Audio enviado!'); onDone(); }
    else if (send) setMsg('Muy cortito: mantené apretado un poco más.');
    else setMsg('Audio cancelado. ¡Bien! Así se cancela.');
    setRec('idle'); setSecs(0);
  };
  return (
    <div className="flex flex-col gap-4">
      <PhoneFrame title="Hija" sub="en línea">
        <div className="flex-1 flex flex-col gap-2 p-3 bg-sunk/60">
          <Bubble time="10:20">¿Cómo te fue en el médico?</Bubble>
          <Bubble time="10:21">Contame con un audio si querés 😊</Bubble>
          {audios.map((s, k) => (
            <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-end bg-mint rounded-2xl rounded-br-md px-3 py-2 flex items-center gap-2 shadow-sm">
              <Play className="size-4" /><span className="h-1 w-24 rounded-full bg-accent/40" /><span className="text-[.75rem] num">0:0{s}</span>
            </motion.div>
          ))}
        </div>
        <div className="relative flex items-center gap-2 p-2 bg-surface border-t border-line select-none touch-none">
          <div className="flex-1 rounded-full bg-sunk px-4 py-2.5 text-[.9rem] text-muted min-h-[2.8rem] flex items-center">
            {rec === 'idle' ? 'Mensaje' : <span className="flex items-center gap-2 text-bad font-bold"><motion.span className="size-2.5 rounded-full bg-bad" animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} />0:{String(secs).padStart(2, '0')} {rec === 'rec' && <span className="text-muted font-normal text-[.78rem]">◀ deslizá para cancelar</span>}</span>}
          </div>
          {rec === 'lock' ? (
            <button onClick={() => stop(true)} aria-label="Enviar audio" className="grid place-items-center size-12 rounded-full bg-accent text-onaccent"><Send className="size-5" /></button>
          ) : (
            <motion.button aria-label="Micrófono: mantené apretado para grabar" animate={{ scale: rec === 'rec' ? 1.35 : 1 }}
              onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); start.current = { x: e.clientX, y: e.clientY, t: Date.now() }; setRec('rec'); setMsg('Grabando… soltá para enviar. Deslizá hacia arriba para el candado.'); timer.current = setInterval(() => setSecs((s) => s + 1), 1000); }}
              onPointerMove={(e) => { if (rec !== 'rec') return; if (start.current.y - e.clientY > 50) { setRec('lock'); setMsg('¡Candado! Ya podés soltar. Tocá el botón para enviar.'); } else if (start.current.x - e.clientX > 80) stop(false); }}
              onPointerUp={() => { if (rec === 'rec') stop(true); }}
              className="grid place-items-center size-12 rounded-full bg-accent text-onaccent"><Mic className="size-5" /></motion.button>
          )}
          <AnimatePresence>{rec === 'rec' && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-3 -top-14 grid place-items-center size-10 rounded-full bg-surface shadow-lift"><Lock className="size-4" /></motion.div>}</AnimatePresence>
        </div>
      </PhoneFrame>
      <p className="text-center text-[.95rem] font-bold" aria-live="polite">{msg}</p>
      {done && <Done>¡Lo lograste! Ya sabés mandar audios.</Done>}
    </div>
  );
}

/* ---------- Videollamada ---------- */
function WaVideo({ onDone, done }: SimProps) {
  const [st, setSt] = useState<'chat' | 'calling' | 'call' | 'end'>('chat');
  const [mic, setMic] = useState(true); const [cam, setCam] = useState(true); const [front, setFront] = useState(true);
  useEffect(() => { if (st === 'calling') { const t = setTimeout(() => setSt('call'), 1800); return () => clearTimeout(t); } }, [st]);
  return (
    <div className="flex flex-col gap-4">
      <PhoneFrame>
        <AnimatePresence mode="wait">
          {st === 'chat' || st === 'end' ? (
            <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 px-3 py-2.5 bg-surface border-b border-line">
                <ArrowLeft className="size-5 text-muted" /><span className="size-9 rounded-full bg-skysoft grid place-items-center font-bold text-sky">H</span>
                <div className="flex-1"><b className="block text-[.95rem]">Hija</b><span className="text-[.72rem] text-muted">en línea</span></div>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSt('calling')} aria-label="Videollamada" className="p-2 rounded-full ring-2 ring-glow/0 hover:ring-glow"><motion.span animate={done ? {} : { scale: [1, 1.18, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className="block"><Video className="size-6 text-accent" /></motion.span></motion.button>
                <button aria-label="Llamada de voz" className="p-2"><Phone className="size-5 text-muted" /></button>
              </div>
              <div className="flex-1 flex flex-col gap-2 p-3 bg-sunk/60">
                <Bubble time="18:02">Mamá, ¿hacemos videollamada así te muestro al bebé? 👶</Bubble>
                {st === 'end' && <div className="self-center text-[.78rem] bg-surface rounded-full px-3 py-1 text-muted">Videollamada · 2 min</div>}
              </div>
            </motion.div>
          ) : (
            <motion.div key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-between bg-[#14211c] text-white p-6 relative">
              <div className="text-center mt-6"><div className="mx-auto size-24 rounded-full bg-skysoft/20 grid place-items-center text-[2.2rem] font-bold">H</div><b className="block mt-3 text-[1.2rem]">Hija</b><span className="text-white/70 text-[.85rem]">{st === 'calling' ? 'Llamando…' : '00:12'}</span></div>
              {st === 'call' && <div className="absolute right-4 top-4 w-20 h-28 rounded-xl bg-white/10 grid place-items-center text-[.7rem] text-white/70">{cam ? (front ? 'Vos' : 'Cámara trasera') : 'Cámara apagada'}</div>}
              <div className="flex gap-4 mb-2">
                <button aria-label="Micrófono" onClick={() => setMic(!mic)} className="grid place-items-center size-12 rounded-full bg-white/15">{mic ? <Mic className="size-5" /> : <MicOff className="size-5" />}</button>
                <button aria-label="Cámara" onClick={() => setCam(!cam)} className="grid place-items-center size-12 rounded-full bg-white/15">{cam ? <Video className="size-5" /> : <VideoOff className="size-5" />}</button>
                <button aria-label="Girar cámara" onClick={() => setFront(!front)} className="grid place-items-center size-12 rounded-full bg-white/15"><SwitchCamera className="size-5" /></button>
                <motion.button whileTap={{ scale: 0.9 }} aria-label="Cortar" onClick={() => { setSt('end'); onDone(); }} className="grid place-items-center size-12 rounded-full bg-[#e5484d]"><PhoneOff className="size-5" /></motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>
      <p className="text-center text-[.95rem] font-bold" aria-live="polite">{st === 'chat' ? 'Tocá la cámara arriba a la derecha.' : st === 'calling' ? 'Llamando… esperá que atienda.' : st === 'call' ? 'Probá los botones. Para cortar, tocá el rojo.' : '¡Listo! Así se hace una videollamada.'}</p>
      {done && <Done>¡Muy bien! Ya sabés hacer videollamadas.</Done>}
    </div>
  );
}

/* ---------- Fijar chats ---------- */
function WaPin({ onDone, done }: SimProps) {
  const [chats, setChats] = useState([
    { id: 'g', n: 'Club de bochas', m: 'Mañana a las 10', pin: false },
    { id: 'v', n: 'Vecinos del edificio', m: 'Se corta el agua el jueves', pin: false },
    { id: 'h', n: 'Hija', m: 'Te quiero ma ❤️', pin: false },
    { id: 'p', n: 'Promo Tienda', m: '¡Ofertas imperdibles!', pin: false },
    { id: 'm', n: 'Médico Dr. López', m: 'Turno confirmado', pin: false }
  ]);
  const [sel, setSel] = useState<string | null>(null);
  const [arch, setArch] = useState<string[]>([]);
  const tmr = useRef<any>(null);
  const sorted = [...chats.filter((c) => c.pin), ...chats.filter((c) => !c.pin)].filter((c) => !arch.includes(c.id));
  return (
    <div className="flex flex-col gap-4">
      <PhoneFrame>
        <div className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-line min-h-[3.4rem]">
          {sel ? (<>
            <button aria-label="Cancelar" onClick={() => setSel(null)}><ArrowLeft className="size-5" /></button><span className="flex-1 font-bold">1 seleccionado</span>
            <motion.button whileTap={{ scale: 0.85 }} aria-label="Fijar" onClick={() => { setChats((cs) => cs.map((c) => c.id === sel ? { ...c, pin: !c.pin } : c)); if (sel === 'h') onDone(); setSel(null); }} className="p-2 rounded-full bg-mint text-accent"><Pin className="size-5" /></motion.button>
            <button aria-label="Archivar" onClick={() => { setArch((a) => [...a, sel]); setSel(null); }} className="p-2"><Archive className="size-5" /></button>
          </>) : (<><b className="flex-1 text-[1.1rem]">Chats</b><Search className="size-5 text-muted" /></>)}
        </div>
        <div className="flex-1 bg-surface">
          {arch.length > 0 && <button onClick={() => setArch([])} className="w-full text-left px-4 py-2 text-[.85rem] text-muted flex items-center gap-2 border-b border-line"><Archive className="size-4" />Archivados ({arch.length}) · tocá para recuperar</button>}
          <motion.div layout>
            {sorted.map((c) => (
              <motion.div layout key={c.id} transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                onPointerDown={() => { tmr.current = setTimeout(() => setSel(c.id), 550); }} onPointerUp={() => clearTimeout(tmr.current)} onPointerLeave={() => clearTimeout(tmr.current)}
                onContextMenu={(e) => e.preventDefault()}
                className={cx('flex items-center gap-3 px-4 py-3 border-b border-line select-none cursor-pointer', sel === c.id && 'bg-mint')}>
                <span className="size-11 rounded-full bg-sunk grid place-items-center font-bold">{c.n[0]}</span>
                <span className="flex-1 min-w-0"><b className="block text-[.95rem]">{c.n}</b><span className="block truncate text-[.82rem] text-muted">{c.m}</span></span>
                {c.pin && <Pin className="size-4 text-muted rotate-45" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </PhoneFrame>
      <p className="text-center text-[.95rem] font-bold" aria-live="polite">{sel ? 'Ahora tocá la chinche (fijar) arriba.' : done ? '¡Hija quedó arriba de todo!' : 'Mantené apretado el chat de “Hija” un segundo.'}</p>
      {done && <Done>¡Perfecto! Ya sabés fijar chats.</Done>}
    </div>
  );
}

/* ---------- Pagar con QR ---------- */
function PayQr({ onDone, done }: SimProps) {
  const [st, setSt] = useState<'home' | 'scan' | 'confirm' | 'ok' | 'cancel'>('home');
  useEffect(() => { if (st === 'scan') { const t = setTimeout(() => setSt('confirm'), 2000); return () => clearTimeout(t); } }, [st]);
  return (
    <div className="flex flex-col gap-4">
      <Note tone="info">En el kiosco te dicen: “Son <b>$ 2.350</b>, pagame con el QR del mostrador”.</Note>
      <PhoneFrame title="Mi billetera" sub="Saldo disponible: $ 48.200">
        <div className="flex-1 flex flex-col p-4 gap-4">
          <AnimatePresence mode="wait">
            {st === 'home' && <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-3">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSt('scan')} className="rounded-2xl bg-mint p-4 flex flex-col items-center gap-2 font-bold"><motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}><QrCode className="size-8 text-accent" /></motion.span>Pagar con QR</motion.button>
              {['Transferir', 'Ingresar dinero', 'Tu actividad'].map((t) => <div key={t} className="rounded-2xl bg-sunk p-4 grid place-items-center text-center text-[.9rem] text-muted font-bold">{t}</div>)}
            </motion.div>}
            {st === 'scan' && <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
              <div className="relative size-52 rounded-2xl bg-ink/90 grid place-items-center overflow-hidden">
                <QrCode className="size-28 text-white/80" />
                <motion.div className="absolute inset-x-4 h-0.5 bg-glow shadow-[0_0_12px_rgb(var(--glow))]" animate={{ top: ['10%', '90%', '10%'] }} transition={{ repeat: Infinity, duration: 1.6 }} />
              </div>
              <span className="text-[.9rem] text-muted">Apuntá al código…</span>
            </motion.div>}
            {st === 'confirm' && <motion.div key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
              <span className="text-[.85rem] text-muted">Vas a pagar a</span><b className="text-[1.2rem]">Kiosco Don Pepe</b>
              <div className="font-head text-[2.4rem]">$ 2.350</div>
              <p className="text-[.85rem] text-muted">Revisá el comercio y el monto antes de confirmar.</p>
              <Button block onClick={() => { setSt('ok'); onDone(); }}>Pagar</Button>
              <Button block variant="ghost" onClick={() => setSt('cancel')}>Cancelar</Button>
            </motion.div>}
            {st === 'ok' && <motion.div key="o" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2 py-8 text-center"><CheckCircle2 className="size-16 text-accent" /><b className="text-[1.2rem]">¡Pago realizado!</b><span className="text-muted text-[.9rem]">Kiosco Don Pepe · $ 2.350</span></motion.div>}
            {st === 'cancel' && <motion.div key="x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-6 text-center"><p>Cancelaste. Si el monto coincidía con lo que te dijeron, podés pagar tranquilo.</p><Button size="sm" onClick={() => setSt('confirm')}>Volver</Button></motion.div>}
          </AnimatePresence>
        </div>
      </PhoneFrame>
      {done && <Done>¡Bien! Revisaste comercio y monto antes de pagar.</Done>}
    </div>
  );
}

/* ---------- Transferir ---------- */
function PayTransfer({ onDone, done }: SimProps) {
  const [alias, setAlias] = useState(''); const [monto, setMonto] = useState(''); const [st, setSt] = useState<'form' | 'confirm' | 'ok' | 'bad'>('form');
  const ok = alias.trim().toLowerCase() === 'lucia.fer.casa';
  const titular = ok ? 'Lucía Fernández' : 'Martín Gómez Ríos';
  return (
    <div className="flex flex-col gap-4">
      <Card tone="sunk" className="flex flex-col gap-1 !p-4"><span className="text-[.8rem] text-muted">Mensaje de tu sobrina</span><p>“Tía, te paso mi alias para lo del regalo: <b>lucia.fer.casa</b> ¡Gracias!”</p></Card>
      <PhoneFrame title="Transferir" sub="Billetera">
        <div className="flex-1 flex flex-col p-4 gap-4">
          <AnimatePresence mode="wait">
            {st === 'form' && <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
              <Field label="Alias, CVU o CBU" htmlFor="al"><TextInput id="al" value={alias} onChange={setAlias} placeholder="Ej: nombre.algo.algo" /></Field>
              <button className="self-start text-[.82rem] font-bold text-sky underline" onClick={() => setAlias('lucia.fer.cas')}>Pegar lo que copié (¡ojo!)</button>
              <Field label="Monto" htmlFor="mo"><TextInput id="mo" decimal value={monto} onChange={setMonto} placeholder="0" /></Field>
              <Button block disabled={!alias.trim() || !pn(monto)} onClick={() => setSt('confirm')}>Continuar</Button>
            </motion.div>}
            {st === 'confirm' && <motion.div key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
              <span className="text-[.85rem] text-muted">Vas a transferir a</span>
              <b className="text-[1.25rem]">{titular}</b><span className="text-[.82rem] text-muted">Alias: {alias}</span>
              <div className="font-head text-[2.2rem]">{money(pn(monto))}</div>
              <Button block onClick={() => { if (ok && pn(monto) === 15000) { setSt('ok'); onDone(); } else setSt('bad'); }}>Confirmar transferencia</Button>
              <Button block variant="ghost" onClick={() => setSt('form')}>Cancelar y revisar</Button>
            </motion.div>}
            {st === 'ok' && <motion.div key="o" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2 py-8 text-center"><CheckCircle2 className="size-16 text-accent" /><b className="text-[1.2rem]">¡Transferencia enviada!</b><span className="text-muted text-[.9rem]">Lucía Fernández · $ 15.000</span></motion.div>}
            {st === 'bad' && <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-4 text-center">
              <XCircle className="size-14 text-bad" />
              <p>{!ok ? <>¡Ojo! El titular era <b>{titular}</b>, no tu sobrina. En la vida real, esa plata se iría a otra persona.</> : <>El monto no era el pedido: eran <b>$ 15.000</b>.</>}</p>
              <Button size="sm" onClick={() => { setSt('form'); }}>Volver a intentar</Button>
            </motion.div>}
          </AnimatePresence>
        </div>
      </PhoneFrame>
      <p className="text-center text-[.95rem] font-bold">Transferí $ 15.000 a tu sobrina, revisando el nombre antes de confirmar.</p>
      {done && <Done>¡Excelente! Revisaste el titular y el monto.</Done>}
    </div>
  );
}

/* ---------- Elegir vendedor ---------- */
function MlSeller({ onDone, done }: SimProps) {
  const [pick, setPick] = useState<string | null>(null);
  const S = [
    { id: 'a', n: 'OFERTAZO_2024', p: 89000, rep: 'Vendedor nuevo · sin opiniones', note: '“Pagame por transferencia y te hago 20% de descuento”', ok: false, fb: 'Precio muy por debajo del resto, sin reputación y te pide pagar por fuera: tres señales de estafa.' },
    { id: 'b', n: 'Hogar Total', p: 214000, rep: '★ 4,8 · 1.250 ventas · reputación verde', note: 'Compra protegida · envío con seguimiento', ok: true, fb: '¡Muy bien! Buena reputación, muchas ventas y pago dentro de la plataforma, con protección.' },
    { id: 'c', n: 'electro.juan', p: 198000, rep: '★ 3,9 · 40 ventas', note: '“Escribime por WhatsApp para coordinar el pago”', ok: false, fb: 'Al seguir por WhatsApp y pagar por fuera, perdés la protección de la compra.' }
  ];
  const sel = S.find((s) => s.id === pick);
  return (
    <div className="flex flex-col gap-3">
      <p className="font-bold">Querés comprar una aspiradora. ¿A quién le comprarías?</p>
      {S.map((s) => (
        <motion.button key={s.id} whileTap={{ scale: 0.985 }} onClick={() => { setPick(s.id); if (s.ok) onDone(); }}
          className={cx('text-left rounded-2xl border-2 p-4 flex flex-col gap-1 bg-surface', pick === s.id ? (s.ok ? 'border-accent bg-mint' : 'border-bad bg-badsoft') : 'border-line')}>
          <span className="flex justify-between gap-3"><b>{s.n}</b><b className="num">{money(s.p)}</b></span>
          <span className="text-[.85rem] text-muted flex items-center gap-1">{s.ok ? <Star className="size-4 text-amber" /> : null}{s.rep}</span>
          <span className="text-[.88rem]">{s.note}</span>
        </motion.button>
      ))}
      <AnimatePresence>{sel && <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><Note tone={sel.ok ? 'good' : 'bad'}>{sel.fb}</Note></motion.div>}</AnimatePresence>
      {done && <Done>Elegiste el vendedor seguro.</Done>}
    </div>
  );
}

/* ---------- Armador de pedidos para IA ---------- */
function IaPrompt({ onDone, done }: SimProps) {
  const [rol, setRol] = useState(''); const [tarea, setTarea] = useState(''); const [ctx, setCtx] = useState(''); const [fmt, setFmt] = useState('');
  const ROL: [string, string][] = [['Sos una cocinera paciente.', 'Cocinera'], ['Sos una profesora paciente que explica simple.', 'Profesora'], ['Sos un asesor de viajes.', 'Asesor de viajes'], ['Sos un experto en tecnología que explica sin palabras técnicas.', 'Experto en tecnología']];
  const FMT: [string, string][] = [['Respondé en 5 pasos cortos.', 'En 5 pasos'], ['Respondé en una lista corta.', 'En lista'], ['Respondé en un párrafo simple.', 'Párrafo simple'], ['Incluí ejemplos concretos.', 'Con ejemplos']];
  const p = [rol, tarea && ('Necesito que ' + tarea.replace(/^necesito que /i, '') + (tarea.trim().endsWith('.') ? '' : '.')), ctx && ('Mi situación: ' + ctx + (ctx.trim().endsWith('.') ? '' : '.')), fmt].filter(Boolean).join(' ');
  const parts = [rol, tarea, ctx, fmt].filter(Boolean).length;
  return (
    <div className="flex flex-col gap-4">
      <Field label="1. ¿Quién querés que sea?"><Chips options={ROL} value={rol} onChange={setRol} /></Field>
      <Field label="2. ¿Qué tiene que hacer?" htmlFor="t"><TextInput id="t" value={tarea} onChange={setTarea} placeholder="Ej: me des una receta de cena para 2 personas" /></Field>
      <Field label="3. Tu situación" htmlFor="c"><TextInput id="c" value={ctx} onChange={setCtx} placeholder="Ej: soy hipertensa, cocino sin sal y con poco presupuesto" /></Field>
      <Field label="4. ¿Cómo querés la respuesta?"><Chips options={FMT} value={fmt} onChange={setFmt} /></Field>
      <Card tone="violet" className="flex flex-col gap-3">
        <div className="flex justify-between items-center"><b>Tu pedido</b><span className="text-[.85rem] num">{parts} de 4 partes</span></div>
        <p className="text-[1rem] min-h-[3rem]">{p || <span className="text-muted">Completá las partes y se arma solo.</span>}</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" icon={<Copy />} disabled={parts < 2} onClick={() => { copyText(p); onDone(); }}>Copiar pedido</Button>
          <Button size="sm" variant="ghost" href="https://chatgpt.com" iconRight={<ExternalLink />}>ChatGPT</Button>
          <Button size="sm" variant="ghost" href="https://gemini.google.com" iconRight={<ExternalLink />}>Gemini</Button>
          <Button size="sm" variant="ghost" href="https://claude.ai" iconRight={<ExternalLink />}>Claude</Button>
        </div>
      </Card>
      {done && <Done>¡Pedido armado! Pegalo en tu IA.</Done>}
    </div>
  );
}

/* ---------- Entender un documento ---------- */
function IaDoc({ onDone, done }: SimProps) {
  const [show, setShow] = useState(false); const [ans, setAns] = useState<number | null>(null);
  const pedido = 'Explicame en simple qué dice esta carta, qué fechas y montos importan, y qué tengo que hacer.';
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2 font-[Georgia,serif] text-[.92rem] leading-relaxed">
        <b className="font-body text-[.8rem] tracking-wide text-muted">CARTA FICTICIA PARA PRACTICAR</b>
        <p><b>Salud Integral Plus</b> — Comunicación a socios</p>
        <p>Estimado/a socio/a N.º ██████: Le informamos que, conforme a la normativa vigente, a partir del 1 de diciembre la cuota de su plan Clásico 210 tendrá un incremento del 8%, pasando a $ 98.500 mensuales. Asimismo, el plan Clásico 210 será discontinuado el 31 de marzo. Los socios podrán optar por migrar al plan Esencial 150 (sin cobertura odontológica) o al plan Superior 310, hasta el 20 de noviembre, mediante formulario F-12 en sucursal o en la aplicación. De no mediar opción expresa, se realizará la migración automática al plan Superior 310.</p>
      </Card>
      <Card tone="violet" className="flex flex-col gap-2"><b>Pedido para tu IA</b><p>{pedido}</p><div><Button size="sm" icon={<Copy />} onClick={() => copyText(pedido)}>Copiar pedido</Button></div></Card>
      {!show ? <Button variant="secondary" onClick={() => setShow(true)}>Ver una respuesta de ejemplo</Button> : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="flex flex-col gap-2">
            <b className="flex items-center gap-2"><ShieldCheck className="size-5 text-violet" />Respuesta de ejemplo</b>
            <ul className="list-disc pl-5 flex flex-col gap-1 text-[.95rem]">
              <li><b>Qué dice:</b> tu cuota sube 8% y tu plan actual deja de existir.</li>
              <li><b>Desde el 1 de diciembre</b> pagás $ 98.500 por mes.</li>
              <li><b>Tu plan termina el 31 de marzo.</b> Tenés que elegir otro.</li>
              <li><b>Tenés tiempo hasta el 20 de noviembre</b> para elegir entre Esencial 150 (sin dentista) o Superior 310.</li>
              <li><b>Si no elegís,</b> te pasan solos al Superior 310, que probablemente sea más caro.</li>
              <li><b>Qué hacer:</b> pedí el precio de los dos planes y completá el formulario F-12 antes del 20 de noviembre.</li>
            </ul>
          </Card>
          <div className="flex flex-col gap-2 mt-4">
            <b>Comprobá: ¿hasta cuándo tenés para elegir?</b>
            {['1 de diciembre', '20 de noviembre', '31 de marzo'].map((o, k) => (
              <motion.button key={o} whileTap={{ scale: 0.985 }} onClick={() => { setAns(k); if (k === 1) onDone(); }}
                className={cx('text-left rounded-2xl border-2 px-4 py-3 font-bold', ans === k ? (k === 1 ? 'border-accent bg-mint' : 'border-bad bg-badsoft') : 'border-line bg-surface')}>{o}</motion.button>
            ))}
            {ans != null && ans !== 1 && <Note tone="bad">Revisá el documento: el plazo para elegir es otro. Siempre conviene confirmar contra el original.</Note>}
          </div>
        </motion.div>
      )}
      {done && <Done>¡Bien! Entendiste el documento y verificaste la fecha.</Done>}
    </div>
  );
}

export const SIMS: Record<string, (p: SimProps) => JSX.Element> = {
  'wa-audio': WaAudio, 'wa-video': WaVideo, 'wa-pin': WaPin, 'pay-qr': PayQr, 'pay-transfer': PayTransfer, 'ml-seller': MlSeller, 'ia-prompt': IaPrompt, 'ia-doc': IaDoc
};
