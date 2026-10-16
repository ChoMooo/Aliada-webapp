import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ShieldCheck, ArrowRight, Cpu, Clock, ScanSearch, Gamepad2 } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, Card, Hero, Button, Progress, Stagger, Item, Tag, Ring, cx } from '../../ui';
import { MODULES, SOON, type Module } from '../../content/learn';
import { ESCENARIOS } from '../../content/escudo';
import { ruta, nextLesson, modProg, setupProg, digitalProg, startLevel } from './logic';
import { MOD_ICON, TONE } from '../learn/meta';

export { MOD_ICON, TONE };

export function ModCard({ m, tag, base = '/digital/m/' }: { m: Module; tag?: string; base?: string }) {
  const d = useStore((s) => s.d), p = modProg(d, m), nav = useNavigate();
  return (
    <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} onClick={() => nav(base + m.id)}
      className="text-left rounded-xl2 border p-5 flex flex-col gap-3 w-full bg-surface border-line shadow-card">
      <div className="flex items-start justify-between gap-3">
        <span className={cx('grid place-items-center size-12 rounded-xl [&_svg]:size-6', TONE[m.tone])}>{MOD_ICON[m.id]}</span>
        {tag ? <Tag tone="ok">{tag}</Tag> : p.n === p.t ? <Tag tone="ok">Completo</Tag> : <Tag>{m.lessons.length} lecciones</Tag>}
      </div>
      <div><h3 className="text-[1.22rem]">{m.n}</h3><p className="text-[.85rem] text-muted">{m.apps}</p></div>
      <p className="text-[.92rem]">{m.desc}</p>
      <Progress size="sm" value={p.n} max={p.t} label={<span className="text-[.85rem] font-normal text-muted">{p.n} de {p.t} lecciones</span>} />
    </motion.button>
  );
}

function EscudoCard() {
  const d = useStore((s) => s.d), nav = useNavigate(), n = Object.keys(d.escudo.vistos).length;
  return (
    <div className="rounded-xl2 border border-amber/30 bg-surface shadow-card p-5 flex flex-col gap-3 sm:col-span-2">
      <div className="flex items-start justify-between gap-3">
        <span className={cx('grid place-items-center size-12 rounded-xl [&_svg]:size-6', TONE.amber)}><ShieldCheck /></span>
        <Tag tone="warn">Práctica interactiva</Tag>
      </div>
      <div><h3 className="text-[1.22rem]">Escudo antiestafas</h3><p className="text-[.85rem] text-muted">WhatsApp, llamadas, SMS, correos y redes</p></div>
      <p className="text-[.92rem]">Aprendé a reconocer las trampas más usadas practicando con situaciones reales, y analizá cualquier mensaje sospechoso que te llegue.</p>
      <Progress size="sm" value={n} max={ESCENARIOS.length} label={<span className="text-[.85rem] font-normal text-muted">{n} de {ESCENARIOS.length} situaciones practicadas</span>} />
      <div className="flex flex-wrap gap-2 pt-1">
        <Button size="sm" icon={<Gamepad2 />} onClick={() => nav('/digital/escudo/simulador')}>Practicar</Button>
        <Button size="sm" variant="ghost" icon={<ScanSearch />} onClick={() => nav('/digital/escudo/analizador')}>Analizar un mensaje</Button>
        <Button size="sm" variant="quiet" iconRight={<ArrowRight />} onClick={() => nav('/digital/escudo')}>Ver el módulo</Button>
      </div>
    </div>
  );
}

export default function DigitalHub() {
  const d = useStore((s) => s.d), done = d.md.diag.done, nx = nextLesson(d), r = ruta(d), sp = setupProg(d), dp = digitalProg(d);
  const order = done ? r.map((x) => x.m) : MODULES;
  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader kicker="Sección" title="Mundo digital" lead="Las apps que usa todo el mundo, explicadas a tu ritmo, con videos cortos y práctica real. Para sacarles el máximo provecho, no solo lo básico." /></Item>
      <Item><Hero>
        {!done ? (<>
          <div className="text-glow font-semibold text-[.85rem] tracking-wide uppercase">Para empezar · 3 minutos</div>
          <h2 className="text-[1.65rem] text-onbrand mt-1">Armemos tu ruta de aprendizaje</h2>
          <p className="opacity-85 mt-1">Unas preguntas cortas sobre tu celular, lo que ya sabés y lo que querés lograr. Así no perdés tiempo con lo que ya dominás.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button variant="glow" to="/digital/diagnostico" iconRight={<ArrowRight />}>Empezar la encuesta</Button></div>
        </>) : nx ? (<>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-glow font-semibold text-[.85rem] tracking-wide uppercase">Tu próxima lección · {nx.m.n}</div>
              <h2 className="text-[1.6rem] text-onbrand mt-1 leading-tight">{nx.l.t}</h2>
              <p className="opacity-85 mt-1">{nx.l.min} minutos · {nx.l.nivel === 'basico' ? 'Básico' : 'Intermedio'} · con video</p>
            </div>
            <Ring value={dp.n} max={dp.t} size={72} tone="glow"><span className="text-onbrand">{dp.n}/{dp.t}</span></Ring>
          </div>
          <div className="mt-5 flex flex-wrap gap-3"><Button variant="glow" to={`/digital/m/${nx.m.id}/${nx.l.id}`} iconRight={<ArrowRight />}>Empezar lección</Button><Button variant="onbrand" to="/digital/diagnostico">Rehacer encuesta</Button></div>
        </>) : (<>
          <h2 className="text-[1.6rem] text-onbrand">¡Completaste todas las lecciones!</h2>
          <p className="opacity-85 mt-1">Podés repasar cualquier módulo cuando quieras y seguir practicando en el Escudo antiestafas.</p>
        </>)}
      </Hero></Item>
      <Item>
        <Card to="/digital/ajustes" className="flex items-center gap-4">
          <span className="grid place-items-center size-12 rounded-xl bg-sunk [&_svg]:size-6 shrink-0"><SlidersHorizontal /></span>
          <span className="flex-1 min-w-0"><b className="block font-head font-semibold text-[1.1rem]">Primeros ajustes del celular</b><span className="text-[.85rem] text-muted">Letra grande, dictado, bloqueo y más · con video</span></span>
          <Ring value={sp.n} max={sp.t} size={46} stroke={5}>{sp.n}/{sp.t}</Ring>
        </Card>
      </Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.35rem]">{done ? 'Tu ruta' : 'Módulos'}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {order.map((m, i) => <ModCard key={m.id} m={m} tag={done && i === 0 ? 'Recomendado' : done && startLevel(d, m.id) === 'intermedio' ? 'Arrancás en intermedio' : undefined} />)}
          <EscudoCard />
        </div>
      </Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.35rem]">Próximamente</h2>
        <div className="rounded-xl2 bg-sunk p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between"><span className="grid place-items-center size-12 rounded-xl bg-line/60 text-muted [&_svg]:size-6"><Cpu /></span><Tag><Clock className="size-3.5" />Próximamente</Tag></div>
          <div><h3 className="text-[1.22rem]">{SOON.n}</h3><p className="text-[.85rem] text-muted">Opcional · privada</p></div>
          <p className="text-[.92rem]">{SOON.desc} La app revisará si tu celular la soporta antes de activarla.</p>
        </div>
      </Item>
    </Stagger>
  );
}
