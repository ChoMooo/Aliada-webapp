import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Smartphone, ShieldCheck, ScanSearch, FileText, Settings, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { useStore, useD } from '../store';
import { Button, Hero, Stagger, Item, Ring, Note, cx, Kicker } from '../ui';
import { fmt, money } from '../lib/format';
import { calc, progresoTram, tramSiguiente, taSiguiente } from './finanzas/calc';
import { digitalProg, nextLesson } from './digital/logic';
import { LEGAL } from '../config';

function useNextSteps() {
  const d = useStore((s) => s.d);
  const c = calc(d);
  const steps: { t: string; s: string; go: string; tag: string }[] = [];
  if (!c.has) steps.push({ t: 'Cargá tus ingresos y gastos', s: 'En 5 minutos ves cuánto te alcanzan tus ahorros.', go: '/finanzas/plata/numeros/0', tag: 'Mi plata' });
  if (!d.md.diag.done) steps.push({ t: 'Hacé tu encuesta digital', s: '3 minutos para armar tu ruta de aprendizaje.', go: '/digital/diagnostico', tag: 'Mundo digital' });
  else { const n = nextLesson(d); if (n) steps.push({ t: n.l.t, s: n.m.n + ' · ' + n.l.min + ' minutos', go: `/digital/m/${n.m.id}/${n.l.id}`, tag: 'Mundo digital' }); }
  if (!d.tr.sit.sit) steps.push({ t: 'Contanos tu situación de trámites', s: 'Te mostramos qué hacer primero.', go: '/finanzas/tramites/situacion', tag: 'Mis trámites' });
  else { const t = tramSiguiente(d); if (t) steps.push({ t: t.txt, s: 'Guía: ' + t.g.t, go: '/finanzas/tramites/guia/' + t.g.id, tag: 'Mis trámites' }); }
  const k = taSiguiente(d); if (k) steps.push({ t: k.txt, s: 'Generá un ingreso extra con lo que sabés.', go: k.go, tag: 'Mi talento' });
  return steps;
}

export default function Home() {
  const nav = useNavigate();
  const d = useStore((s) => s.d);
  const c = calc(d), pt = progresoTram(d), dp = digitalProg(d), steps = useNextSteps();
  const nombre = useD((x) => x.perfil.nombre);
  const due = Date.now() - d.lastBackup > 30 * 864e5 && (c.has || d.md.diag.done || Object.keys(d.tr.docs).length > 0);
  const main = steps[0];
  const finPct = (c.has ? 1 : 0) + (pt.t ? pt.n / pt.t : 0) + (d.ta.sel ? 1 : 0);
  return (
    <Stagger className="flex flex-col gap-6">
      <Item>
        <Kicker className="first-letter:uppercase">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</Kicker>
        <h1 className="text-[2rem] sm:text-[2.3rem] mt-1">Hola{nombre ? ', ' + nombre : ''}</h1>
      </Item>

      {main && (
        <Item>
          <Hero>
            <div className="flex items-center gap-2 text-glow font-bold text-[.85rem]"><Sparkles className="size-4" />Tu próximo paso · {main.tag}</div>
            <h2 className="text-[1.6rem] sm:text-[1.9rem] text-onbrand mt-2 leading-tight">{main.t}</h2>
            <p className="opacity-85 mt-1.5">{main.s}</p>
            <div className="mt-5"><Button variant="glow" to={main.go} iconRight={<ArrowRight />}>Continuar</Button></div>
          </Hero>
        </Item>
      )}

      <Item className="grid sm:grid-cols-2 gap-4">
        <SectionCard to="/finanzas" icon={<Wallet />} tone="mint" title="Finanzas" ring={finPct / 3}
          lines={[
            c.has ? (c.anios == null ? 'Tus ingresos cubren tus gastos' : 'Tus ahorros alcanzan ~' + fmt(c.anios, 1) + ' años') : 'Mi plata: sin cargar',
            d.tr.sit.sit ? `Trámites: ${pt.n} de ${pt.t} tareas` : 'Trámites: elegí tu situación',
            d.ta.sel ? 'Talento: oportunidad elegida' : 'Talento: descubrí oportunidades'
          ]} />
        <SectionCard to="/digital" icon={<Smartphone />} tone="violet" title="Mundo digital" ring={dp.t ? dp.n / dp.t : 0}
          lines={[d.md.diag.done ? `${dp.n} de ${dp.t} lecciones` : 'Encuesta de 3 minutos', 'WhatsApp · Inteligencia artificial', 'Pagos con el celular']} />
      </Item>

      <Item>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} onClick={() => nav('/escudo/analizador')}
          className="w-full text-left flex items-center gap-4 rounded-xl2 p-5 bg-ambersoft border border-amber/25">
          <span className="grid place-items-center size-12 rounded-2xl bg-amber text-white shrink-0 [&_svg]:size-6"><ScanSearch /></span>
          <span className="flex-1 min-w-0"><b className="block font-head font-normal text-[1.15rem]">¿Te llegó un mensaje raro?</b><span className="text-[.9rem] text-muted">Pegalo en el analizador y mirá qué señales de alerta tiene.</span></span>
          <ChevronRight className="size-5 text-muted" />
        </motion.button>
      </Item>

      {steps.length > 1 && (
        <Item className="flex flex-col gap-2.5">
          <h2 className="text-[1.3rem]">También te sugerimos</h2>
          {steps.slice(1, 4).map((s) => (
            <motion.button key={s.go + s.t} whileHover={{ x: 3 }} onClick={() => nav(s.go)} className="flex items-center gap-3 text-left rounded-2xl bg-surface border border-line px-4 py-3.5">
              <span className="flex-1 min-w-0"><span className="text-[.78rem] font-bold text-accent">{s.tag}</span><span className="block font-bold leading-snug">{s.t}</span></span>
              <ChevronRight className="size-5 text-muted shrink-0" />
            </motion.button>
          ))}
        </Item>
      )}

      {due && <Item><Note tone="info" title="Guardá una copia de tus datos">Tus datos viven en este dispositivo. Si lo cambiás o se borran los datos del navegador, se pierden. <button className="font-bold underline" onClick={() => nav('/ajustes')}>Hacer la copia ahora</button></Note></Item>}

      <Item className="flex flex-wrap gap-3">
        <Button variant="ghost" icon={<FileText />} to="/resumen">Mi resumen</Button>
        <Button variant="ghost" icon={<ShieldCheck />} to="/escudo/simulador">Practicar estafas</Button>
        <Button variant="ghost" icon={<Settings />} to="/ajustes">Ajustes</Button>
      </Item>
      <Item><p className="text-[.8rem] text-muted border-t border-line pt-4">{LEGAL}</p></Item>
    </Stagger>
  );
}

function SectionCard({ to, icon, tone, title, lines, ring }: { to: string; icon: React.ReactNode; tone: 'mint' | 'violet'; title: string; lines: string[]; ring: number }) {
  const nav = useNavigate();
  const t = tone === 'mint' ? 'bg-mint text-accent' : 'bg-violetsoft text-violet';
  return (
    <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} onClick={() => nav(to)}
      className="text-left rounded-xl2 bg-surface border border-line shadow-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className={cx('grid place-items-center size-12 rounded-2xl [&_svg]:size-6', t)}>{icon}</span>
        <Ring value={Math.round(ring * 100)} size={52} stroke={6} tone={tone === 'mint' ? 'accent' : 'sky'}>{Math.round(ring * 100)}%</Ring>
      </div>
      <div>
        <h2 className="text-[1.45rem]">{title}</h2>
        <ul className="mt-2 flex flex-col gap-1 text-[.9rem] text-muted">{lines.map((l) => <li key={l} className="flex gap-2"><span className="mt-2 size-1.5 rounded-full bg-line shrink-0" />{l}</li>)}</ul>
      </div>
      <span className="inline-flex items-center gap-1 font-bold text-accent text-[.95rem]">Entrar <ArrowRight className="size-4" /></span>
    </motion.button>
  );
}
