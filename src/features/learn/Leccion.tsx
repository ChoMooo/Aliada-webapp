import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X, Copy, Share2, Trophy, Lightbulb, Wrench, HelpCircle, Hand, ListChecks, Flag, PlayCircle } from 'lucide-react';
import { useStore, mut } from '../../store';
import { BackLink, Card, Button, Chips, Note, CheckRow, ListenButton, Bullets, Celebrate, Ring, ease, cx, Tag } from '../../ui';
import { MOD, modPath } from '../../content/learn';
import { N } from '../../lib/narration';
import { DemoPlayer, VisualGuide } from './Demo';
import { copyText, wa } from '../../lib/share';
import { userOS } from '../digital/logic';
import { SIMS } from '../digital/sims';
import { TONE, MOD_ICON, sectionOf } from './meta';

type Sec = 'intro' | 'video' | 'practica' | 'pasos' | 'sino' | 'quiz' | 'fin';
const META: Record<Sec, [string, React.ReactNode]> = {
  intro: ['La idea', <Lightbulb key="i" />], video: ['Mirá cómo se hace', <PlayCircle key="v" />], practica: ['Practicá sin riesgo', <Hand key="p" />], pasos: ['Hacelo en tu celular', <ListChecks key="s" />],
  sino: ['Si algo no sale', <Wrench key="w" />], quiz: ['Mini desafío', <HelpCircle key="q" />], fin: ['¡Terminaste!', <Flag key="f" />]
};

export default function Leccion() {
  const { mod = '', lec = '' } = useParams(); const nav = useNavigate();
  const d = useStore((s) => s.d), m = MOD(mod), l = m?.lessons.find((x) => x.id === lec);
  const [k, setK] = useState(0);
  const [dir, setDir] = useState(1);
  const [os, setOs] = useState<string>(userOS(d));
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState<(number | null)[]>([]);
  const [simDone, setSimDone] = useState(false);
  React.useEffect(() => { setK(0); setQi(0); setAns([]); setSimDone(false); }, [lec]);
  const secs = useMemo<Sec[]>(() => (l ? (['intro', l.demo.length ? 'video' : null, l.sim ? 'practica' : null, 'pasos', 'sino', 'quiz', 'fin'].filter(Boolean) as Sec[]) : []), [l]);
  if (!m || !l) return <div className="flex flex-col gap-4"><BackLink to="/" label="Inicio" /><Note tone="warn">No encontramos esta lección.</Note></div>;
  const sec = secs[k], st = d.md.lec[l.id] || {}, Sim = l.sim ? SIMS[l.sim] : null;
  const base = modPath(m), sc = sectionOf(m);
  const idx = m.lessons.findIndex((x) => x.id === l.id), nextL = m.lessons[idx + 1];
  const score = ans.filter((a, i) => a === l.quiz[i]?.c).length;
  const go = (n: number) => { setDir(n > k ? 1 : -1); setK(n); window.scrollTo({ top: 0, behavior: 'smooth' }); if (secs[n] === 'fin') mut((x) => { x.md.lec[l.id] = { ...(x.md.lec[l.id] || {}), done: true, score }; }); };
  const pasos = os === 'ios' ? l.pasos.ios : l.pasos.android;
  const canNext = sec !== 'quiz' || (ans[qi] != null && qi === l.quiz.length - 1);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3"><BackLink to={base} label={m.n} /><Tag>{l.min} min</Tag></div>
      <div className="flex items-start gap-3">
        <span className={cx('grid place-items-center size-12 rounded-xl shrink-0 [&_svg]:size-6', TONE[m.tone])}>{MOD_ICON[m.id]}</span>
        <h1 className="text-[1.7rem] sm:text-[2rem] leading-tight">{l.t}</h1>
      </div>
      {/* Progreso por secciones */}
      <div className="flex gap-1.5" aria-label={`Parte ${k + 1} de ${secs.length}`}>
        {secs.map((s, i) => <motion.button key={s} aria-label={META[s][0]} onClick={() => i < k && go(i)} className={cx('h-2 flex-1 rounded-full', i <= k ? 'bg-accent' : 'bg-line')} animate={{ opacity: i === k ? 1 : 0.85 }} />)}
      </div>
      <div className="flex items-center gap-2 text-accent font-bold text-[.9rem] [&_svg]:size-5">{META[sec][1]}{META[sec][0]}</div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={sec + qi} custom={dir} initial={{ opacity: 0, x: 40 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 * dir }} transition={{ duration: 0.35, ease }} className="flex flex-col gap-4">
          {sec === 'intro' && (<>
            <p className="text-[1.15rem] leading-relaxed"><b>Para qué te sirve:</b> {l.para}</p>
            <ListenButton text={N.lessonIntro(l)} />
            {l.idea.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                <Card className="flex gap-4 items-start"><span className="font-head font-semibold text-[1.6rem] text-accent leading-none">{i + 1}</span><p className="text-[1.02rem]">{t}</p></Card>
              </motion.div>
            ))}
          </>)}
          {sec === 'video' && (<>
            <p className="text-[1.05rem] text-muted">Un video corto con voz: mirá dónde se toca en cada pantalla. Podés pausar y avanzar paso por paso.</p>
            <DemoPlayer key={l.id} frames={l.demo} title={l.t} />
            <h3 className="text-[1.2rem] mt-3">La guía en imágenes</h3>
            <VisualGuide frames={l.demo} />
            <p className="text-[.82rem] text-muted">Pantallas ilustrativas: en tu celular los colores y la ubicación de algunos botones pueden variar.</p>
          </>)}
          {sec === 'practica' && Sim && (<>
            {l.simIntro && <p className="text-[1.05rem]">{l.simIntro}</p>}
            <Sim done={simDone || !!st.done} onDone={() => setSimDone(true)} />
            <p className="text-[.85rem] text-muted text-center">Es un simulador: nada de lo que hagas acá se envía de verdad.</p>
          </>)}
          {sec === 'pasos' && (<>
            <div className="flex flex-wrap items-center gap-3"><span className="text-[.9rem] text-muted">Pasos para:</span><Chips options={[['android', 'Android'], ['ios', 'iPhone']]} value={os} onChange={(v) => v && setOs(v)} /></div>
            <Card>
              {pasos.map((p, i) => {
                const key = os + i, dn = !!st.steps?.[key];
                return <CheckRow key={key} done={dn} onToggle={() => mut((x) => { const o = (x.md.lec[l.id] ||= {}); const s = (o.steps ||= {}); if (s[key]) delete s[key]; else s[key] = 1; })}><span className="text-muted mr-1.5">{i + 1}.</span>{p}</CheckRow>;
              })}
            </Card>
            <ListenButton text={N.steps(pasos)} label="Escuchar los pasos" />
            <Note tone="info">Pasos generales: los menús pueden cambiar un poco según tu modelo y la versión de la app. Si no ves algo, buscá la palabra con la lupa.</Note>
          </>)}
          {sec === 'sino' && (<>
            {l.siNo.map((t, i) => <Card key={i} className="flex gap-3 items-start"><Wrench className="size-5 text-amber shrink-0 mt-0.5" /><p>{t}</p></Card>)}
            <Card tone="sunk"><p><b>Regla de oro:</b> si algo no aparece donde esperabas, abrí los Ajustes de la app o del celular y usá la <b>lupa</b> para buscar la palabra.</p></Card>
          </>)}
          {sec === 'quiz' && (() => {
            const q = l.quiz[qi], a = ans[qi];
            return (<>
              <div className="text-[.85rem] text-muted">Pregunta {qi + 1} de {l.quiz.length}</div>
              <h2 className="text-[1.35rem]">{q.q}</h2>
              <div className="flex flex-col gap-2.5">
                {q.o.map((o, i) => {
                  const picked = a === i, ok = i === q.c;
                  return (
                    <motion.button key={o} whileTap={{ scale: 0.985 }} disabled={a != null} onClick={() => setAns((s) => { const n = [...s]; n[qi] = i; return n; })}
                      animate={a != null && picked && !ok ? { x: [0, -6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}
                      className={cx('flex items-center gap-3 text-left min-h-[3.8rem] px-4 py-3 rounded-xl border-2 font-bold',
                        a == null ? 'border-line bg-surface hover:border-ink/25' : ok ? 'border-accent bg-mint' : picked ? 'border-bad bg-badsoft' : 'border-line bg-surface opacity-60')}>
                      <span className="flex-1">{o}</span>{a != null && ok && <Check className="size-5 text-accent" />}{a != null && picked && !ok && <X className="size-5 text-bad" />}
                    </motion.button>
                  );
                })}
              </div>
              {a != null && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><Note tone={a === q.c ? 'good' : 'warn'} title={a === q.c ? '¡Correcto!' : 'Casi'}>{q.e}</Note></motion.div>}
              {a != null && qi < l.quiz.length - 1 && <div><Button onClick={() => setQi(qi + 1)} iconRight={<ArrowRight />}>Siguiente pregunta</Button></div>}
            </>);
          })()}
          {sec === 'fin' && (<>
            <Card className="relative flex flex-col items-center text-center gap-3 py-8 overflow-visible">
              <Celebrate show />
              <motion.div initial={{ scale: 0.6, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }}>
                <Ring value={score} max={l.quiz.length || 1} size={96} stroke={9}><Trophy className="size-8 text-accent" /></Ring>
              </motion.div>
              <h2 className="text-[1.6rem]">¡Lección completada!</h2>
              <p className="text-muted">Desafío: {score} de {l.quiz.length} respuestas correctas.</p>
            </Card>
            <Card className="flex flex-col gap-3">
              <h3 className="text-[1.15rem]">Tu ficha para guardar</h3>
              <Bullets items={l.ficha} />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" icon={<Copy />} onClick={() => copyText(l.t + '\n' + l.ficha.map((f) => '• ' + f).join('\n'))}>Copiar</Button>
                <Button size="sm" variant="ghost" icon={<Share2 />} href={wa('Aprendí con Aliada: ' + l.t + '\n' + l.ficha.map((f) => '• ' + f).join('\n'))}>Mandar por WhatsApp</Button>
              </div>
            </Card>
            <div className="flex flex-wrap gap-3">
              {nextL ? <Button iconRight={<ArrowRight />} onClick={() => { nav(`${base}/${nextL.id}`); }}>Siguiente: {nextL.t}</Button> : <Button to={sc.to}>Volver a {sc.label}</Button>}
              <Button variant="ghost" to={base}>Ver el módulo</Button>
            </div>
          </>)}
        </motion.div>
      </AnimatePresence>

      {sec !== 'fin' && (
        <div className={cx('z-20 flex gap-3 -mx-4 px-4 pt-6 pb-3', sec === 'video' ? 'relative' : 'sticky bottom-[5.2rem] lg:bottom-0 bg-gradient-to-t from-bg via-bg/95 to-transparent')}>
          {k > 0 && <Button variant="ghost" icon={<ArrowLeft />} onClick={() => { if (sec === 'quiz' && qi > 0) setQi(qi - 1); else go(k - 1); }}>Atrás</Button>}
          <Button className="flex-1 shadow-lift" disabled={!canNext} iconRight={<ArrowRight />} onClick={() => go(k + 1)}>
            {sec === 'quiz' ? 'Terminar' : sec === 'practica' && !simDone && !st.done ? 'Seguir sin practicar' : 'Siguiente'}
          </Button>
        </div>
      )}
    </div>
  );
}
