import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Smartphone, Apple, Check, X, BookOpen, Headphones, Eye, Sparkles } from 'lucide-react';
import { useStore, mut } from '../../store';
import { PageHeader, Card, Hero, Button, Chips, Choices, Field, ListenButton, Tag, Stagger, Item, Celebrate, ease, cx, Mascot, Topo } from '../../ui';
import { detectOS } from '../../lib/device';
import { DIAG_APPS, DIAG_AREAS, NIVELES, METAS, MIEDOS, RETOS, DIAG_Q } from '../../content/learn';
import { N } from '../../lib/narration';
import { ruta, startLevel } from './logic';
import { MOD_ICON, TONE } from '../learn/meta';

type Step = { id: string; t: string; h?: string; skip?: boolean; when?: () => boolean };

export default function Diagnostico() {
  const d = useStore((s) => s.d), g = d.md.diag, nav = useNavigate();
  const [i, setI] = useState(0);
  const [fin, setFin] = useState(false);
  const [intro, setIntro] = useState(true);
  const det = detectOS();
  React.useEffect(() => { if (det && !g.os) mut((x) => { x.md.diag.os = det; }); }, []);
  const set = (k: keyof typeof g) => (v: any) => mut((x) => { (x.md.diag as any)[k] = v; });
  const steps: Step[] = [
    { id: 'os', ...DIAG_Q.os(det) },
    { id: 'marca', ...DIAG_Q.marca, when: () => g.os === 'android', skip: true },
    { id: 'apps', ...DIAG_Q.apps, skip: true },
    { id: 'nivel', ...DIAG_Q.nivel, skip: true },
    ...RETOS.map((r, k) => ({ id: r.id, ...DIAG_Q.reto(k), skip: true })),
    { id: 'metas', ...DIAG_Q.metas, skip: true },
    { id: 'miedos', ...DIAG_Q.miedos, skip: true },
    { id: 'aprende', ...DIAG_Q.aprende, skip: true }
  ];
  const vis = steps.filter((s) => !s.when || s.when());
  const st = vis[Math.min(i, vis.length - 1)];
  const next = () => { if (i < vis.length - 1) setI(i + 1); else { mut((x) => { x.md.diag.done = true; }); setFin(true); } };
  const canNext = st.id !== 'os' || !!g.os;

  if (fin) return <Resultado onGo={(p) => nav(p)} />;
  if (intro) return (
    <div className="relative -mx-4 sm:-mx-6 -mt-5 px-4 sm:px-6 pt-10 pb-8 min-h-[78vh] flex flex-col items-center justify-center text-center overflow-hidden">
      <Topo className="absolute w-[min(150vw,760px)] text-accent/60" draw />
      <motion.div className="relative flex flex-col items-center gap-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease }}>
        <Mascot size={110} gesture="nod" />
        <div className="flex flex-col gap-2 max-w-[26rem]">
          <span className="text-[.8rem] font-semibold tracking-wide uppercase text-accent">Tu ruta en Mundo digital</span>
          <h1 className="text-[2rem] leading-tight">Empecemos por donde estás</h1>
          <p className="text-muted text-[1.05rem]">Unas preguntas cortas sobre tu celular y lo que te gustaría lograr. Te lleva unos 3 minutos y podés saltear lo que quieras.</p>
        </div>
        <Button size="lg" onClick={() => setIntro(false)} iconRight={<ArrowRight />}>Empezar</Button>
        <button className="text-muted underline underline-offset-4 font-semibold" onClick={() => nav('/digital')}>Ahora no</button>
      </motion.div>
    </div>
  );
  const reto = RETOS.find((r) => r.id === st.id);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader back={{ to: '/digital', label: 'Mundo digital' }} title="" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[.85rem] text-muted"><span>Pregunta {i + 1} de {vis.length}</span>{st.skip && <button onClick={next} className="font-bold underline underline-offset-4">Saltear</button>}</div>
        <div className="h-2 rounded-full bg-sunk overflow-hidden"><motion.div className="h-full bg-accent rounded-full" animate={{ width: ((i + 1) / vis.length) * 100 + '%' }} transition={{ duration: 0.5, ease }} /></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={st.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease }} className="flex flex-col gap-5">
          <div><h1 className="text-[1.85rem]">{st.t}</h1>{st.h && <p className={cx('mt-1.5', reto ? 'text-[1.1rem] text-ink bg-surface border border-line rounded-xl p-4 shadow-card' : 'text-muted')}>{st.h}</p>}</div>
          <ListenButton text={N.ask(st.t, st.h)} />
          {st.id === 'os' && <Choices value={g.os} onChange={set('os')} options={[{ k: 'android', t: 'Android', s: 'Samsung, Motorola, Xiaomi y otros', icon: <Smartphone /> }, { k: 'ios', t: 'iPhone', s: 'De Apple', icon: <Apple /> }]} />}
          {st.id === 'marca' && <Choices value={g.marca} onChange={set('marca')} options={[{ k: 'samsung', t: 'Samsung' }, { k: 'motorola', t: 'Motorola' }, { k: 'xiaomi', t: 'Xiaomi' }, { k: 'otra', t: 'Otra marca' }]} />}
          {st.id === 'apps' && <Chips multi options={DIAG_APPS} value={g.apps} onChange={set('apps')} />}
          {st.id === 'nivel' && (
            <div className="flex flex-col gap-3">
              {DIAG_AREAS.map(([k, l]) => (
                <Card key={k} className="flex flex-col gap-3 !p-4"><b>{l}</b>
                  <Chips options={NIVELES} value={g.nivel[k] || ''} onChange={(v) => mut((x) => { x.md.diag.nivel[k] = v; })} />
                </Card>
              ))}
            </div>
          )}
          {reto && (
            <div className="flex flex-col gap-2.5">
              {reto.o.map((o, k) => {
                const ans = g.retos[reto.id], picked = ans === String(k), ok = k === reto.c;
                return (
                  <motion.button key={o} whileTap={{ scale: 0.985 }} disabled={ans != null}
                    onClick={() => mut((x) => { x.md.diag.retos[reto.id] = String(k); })}
                    className={cx('flex items-center gap-3 text-left min-h-[3.8rem] px-4 py-3 rounded-xl border-2 font-bold transition-colors',
                      ans == null ? 'border-line bg-surface hover:border-ink/25' : ok ? 'border-accent bg-mint' : picked ? 'border-bad bg-badsoft' : 'border-line bg-surface opacity-60')}>
                    <span className="flex-1">{o}</span>
                    {ans != null && ok && <Check className="size-5 text-accent" />}{ans != null && picked && !ok && <X className="size-5 text-bad" />}
                  </motion.button>
                );
              })}
              {g.retos[reto.id] != null && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[.95rem]">{g.retos[reto.id] === String(reto.c) ? '¡Muy bien! Lo tenés claro.' : 'No pasa nada: lo vamos a ver en tu ruta.'}</motion.p>}
            </div>
          )}
          {st.id === 'metas' && <Chips multi options={METAS} value={g.metas} onChange={set('metas')} />}
          {st.id === 'miedos' && <Chips multi options={MIEDOS} value={g.miedos} onChange={set('miedos')} />}
          {st.id === 'aprende' && (
            <div className="flex flex-col gap-5">
              <Choices value={g.aprende} onChange={set('aprende')} options={[{ k: 'leer', t: 'Leyendo', icon: <BookOpen /> }, { k: 'escuchar', t: 'Escuchando', s: 'Activamos los botones “Escuchar”', icon: <Headphones /> }, { k: 'ver', t: 'Mirando videos paso a paso', s: 'Con pantallas de cada app y desafíos', icon: <Eye /> }]} />
              <Field label="¿Cuánto tiempo tenés por día?"><Chips options={[['5', '5 minutos'], ['15', '15 minutos'], ['30', '30 minutos o más']]} value={g.tiempo} onChange={set('tiempo')} /></Field>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-3">
        {i > 0 && <Button variant="ghost" icon={<ArrowLeft />} onClick={() => setI(i - 1)}>Atrás</Button>}
        <Button className="flex-1" disabled={!canNext} iconRight={<ArrowRight />} onClick={() => { if (st.id === 'aprende' && g.aprende === 'escuchar') mut((x) => { x.aj.voz = true; }); next(); }}>{i === vis.length - 1 ? 'Ver mi ruta' : 'Siguiente'}</Button>
      </div>
    </div>
  );
}

function Resultado({ onGo }: { onGo: (p: string) => void }) {
  const d = useStore((s) => s.d), r = ruta(d);
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><Hero className="relative">
        <Celebrate show />
        <div className="flex items-center gap-2 text-onbrand/80 text-[.98rem]"><Sparkles className="size-4" />Listo</div>
        <h1 className="text-[2rem] text-onbrand mt-1">Tu ruta está armada</h1>
        <p className="opacity-85 mt-1">La ordenamos según lo que querés lograr, lo que te preocupa y lo que ya sabés. Podés cambiar el orden cuando quieras.</p>
      </Hero></Item>
      {r.map((x, k) => (
        <Item key={x.m.id}><Card to={'/digital/m/' + x.m.id} className="flex items-start gap-4">
          <span className="font-head font-semibold text-[1.6rem] text-muted w-6 shrink-0">{k + 1}</span>
          <span className={cx('grid place-items-center size-12 rounded-xl [&_svg]:size-6 shrink-0', TONE[x.m.tone])}>{MOD_ICON[x.m.id]}</span>
          <span className="flex-1 min-w-0"><b className="block font-head font-semibold text-[1.15rem]">{x.m.n}</b><span className="text-[.9rem] text-muted">{x.why}</span>
            <span className="flex gap-1.5 mt-1.5"><Tag tone={startLevel(d, x.m.id) === 'intermedio' ? 'violet' : 'neutral'}>Empezás en {startLevel(d, x.m.id) === 'intermedio' ? 'intermedio' : 'básico'}</Tag></span></span>
        </Card></Item>
      ))}
      <Item className="flex flex-wrap gap-3">
        <Button size="lg" onClick={() => onGo('/digital/ajustes')} iconRight={<ArrowRight />}>Primero, ajustar mi celular</Button>
        <Button size="lg" variant="ghost" onClick={() => onGo('/digital')}>Ir a Mundo digital</Button>
      </Item>
    </Stagger>
  );
}
