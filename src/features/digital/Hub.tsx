import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, CreditCard, MapPin, Users, Palette, SlidersHorizontal, ShieldCheck, ArrowRight, Cpu, Clock } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, Card, Hero, Button, Progress, Stagger, Item, Tag, Ring, cx } from '../../ui';
import { MODULES, type Module } from '../../content/digital';
import { ruta, nextLesson, modProg, setupProg, digitalProg, startLevel } from './logic';

export const MOD_ICON: Record<string, React.ReactNode> = { wa: <MessageCircle />, ia: <Sparkles />, pay: <CreditCard />, google: <MapPin />, redes: <Users />, crear: <Palette /> };
export const TONE: Record<string, string> = { mint: 'bg-mint text-accent', sky: 'bg-skysoft text-sky', amber: 'bg-ambersoft text-amber', violet: 'bg-violetsoft text-violet' };

function ModCard({ m, tag }: { m: Module; tag?: string }) {
  const d = useStore((s) => s.d), p = modProg(d, m), nav = useNavigate(), soon = !m.lessons.length;
  return (
    <motion.button whileHover={soon ? undefined : { y: -3 }} whileTap={soon ? undefined : { scale: 0.985 }} onClick={() => !soon && nav('/digital/m/' + m.id)} disabled={soon}
      className={cx('text-left rounded-xl2 border p-5 flex flex-col gap-3 w-full', soon ? 'bg-sunk border-transparent' : 'bg-surface border-line shadow-card')}>
      <div className="flex items-start justify-between gap-3">
        <span className={cx('grid place-items-center size-12 rounded-2xl [&_svg]:size-6', soon ? 'bg-line/60 text-muted' : TONE[m.tone])}>{MOD_ICON[m.id]}</span>
        {soon ? <Tag><Clock className="size-3.5" />Próximamente</Tag> : tag ? <Tag tone="ok">{tag}</Tag> : p.n === p.t ? <Tag tone="ok">Completo</Tag> : null}
      </div>
      <div><h3 className="text-[1.22rem]">{m.n}</h3><p className="text-[.85rem] text-muted">{m.apps}</p></div>
      <p className="text-[.92rem]">{m.desc}</p>
      {soon ? <div className="flex flex-wrap gap-1.5">{m.temas.map((t) => <Tag key={t}>{t}</Tag>)}</div>
        : <Progress size="sm" value={p.n} max={p.t} label={<span className="text-[.85rem] font-normal text-muted">{p.n} de {p.t} lecciones</span>} />}
    </motion.button>
  );
}

export default function DigitalHub() {
  const d = useStore((s) => s.d), done = d.md.diag.done, nx = nextLesson(d), r = ruta(d), sp = setupProg(d), dp = digitalProg(d);
  const order = done ? r.map((x) => x.m) : MODULES.filter((m) => m.lessons.length);
  const soon = MODULES.filter((m) => !m.lessons.length);
  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader kicker="Sección" title="Mundo digital" lead="Las apps que usa todo el mundo, explicadas a tu ritmo y con práctica real. Para sacarles el máximo provecho, no solo lo básico." /></Item>
      <Item><Hero>
        {!done ? (<>
          <div className="text-glow font-bold text-[.85rem]">Para empezar · 3 minutos</div>
          <h2 className="text-[1.65rem] text-onbrand mt-1">Armemos tu ruta de aprendizaje</h2>
          <p className="opacity-85 mt-1">Unas preguntas cortas sobre tu celular, lo que ya sabés y lo que querés lograr. Así no perdés tiempo con lo que ya dominás.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button variant="glow" to="/digital/diagnostico" iconRight={<ArrowRight />}>Empezar la encuesta</Button></div>
        </>) : nx ? (<>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-glow font-bold text-[.85rem]">Tu próxima lección · {nx.m.n}</div>
              <h2 className="text-[1.6rem] text-onbrand mt-1 leading-tight">{nx.l.t}</h2>
              <p className="opacity-85 mt-1">{nx.l.min} minutos · {nx.l.nivel === 'basico' ? 'Básico' : 'Intermedio'}</p>
            </div>
            <Ring value={dp.n} max={dp.t} size={72} tone="glow"><span className="text-onbrand">{dp.n}/{dp.t}</span></Ring>
          </div>
          <div className="mt-5 flex flex-wrap gap-3"><Button variant="glow" to={`/digital/m/${nx.m.id}/${nx.l.id}`} iconRight={<ArrowRight />}>Empezar lección</Button><Button variant="onbrand" to="/digital/diagnostico">Rehacer encuesta</Button></div>
        </>) : (<>
          <h2 className="text-[1.6rem] text-onbrand">¡Completaste todas las lecciones disponibles!</h2>
          <p className="opacity-85 mt-1">Pronto se suman nuevos módulos. Mientras tanto, practicá en el Escudo antiestafas.</p>
        </>)}
      </Hero></Item>
      <Item className="grid sm:grid-cols-2 gap-3">
        <Card to="/digital/ajustes" className="flex items-center gap-4">
          <span className="grid place-items-center size-12 rounded-2xl bg-sunk [&_svg]:size-6 shrink-0"><SlidersHorizontal /></span>
          <span className="flex-1 min-w-0"><b className="block font-head font-normal text-[1.1rem]">Primeros ajustes</b><span className="text-[.85rem] text-muted">Letra, voz y seguridad del celular</span></span>
          <Ring value={sp.n} max={sp.t} size={46} stroke={5}>{sp.n}/{sp.t}</Ring>
        </Card>
        <Card to="/escudo" className="flex items-center gap-4">
          <span className="grid place-items-center size-12 rounded-2xl bg-ambersoft text-amber [&_svg]:size-6 shrink-0"><ShieldCheck /></span>
          <span className="flex-1 min-w-0"><b className="block font-head font-normal text-[1.1rem]">Escudo antiestafas</b><span className="text-[.85rem] text-muted">Practicá y analizá mensajes</span></span>
        </Card>
      </Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.35rem]">{done ? 'Tu ruta' : 'Módulos'}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {order.map((m, i) => <ModCard key={m.id} m={m} tag={done && i === 0 ? 'Recomendado' : done && startLevel(d, m.id) === 'intermedio' ? 'Arrancás en intermedio' : undefined} />)}
        </div>
      </Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.35rem]">Llegan pronto</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {soon.map((m) => <ModCard key={m.id} m={m} />)}
          <div className="rounded-xl2 bg-sunk p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between"><span className="grid place-items-center size-12 rounded-2xl bg-line/60 text-muted [&_svg]:size-6"><Cpu /></span><Tag><Clock className="size-3.5" />Próximamente</Tag></div>
            <div><h3 className="text-[1.22rem]">IA de Aliada en tu celular</h3><p className="text-[.85rem] text-muted">Opcional · gratis · privada</p></div>
            <p className="text-[.92rem]">Una inteligencia artificial que funciona dentro de tu celular, sin internet, para resumir documentos propios sin que salgan del dispositivo. La app revisará si tu celular la soporta antes de descargarla.</p>
          </div>
        </div>
      </Item>
    </Stagger>
  );
}
