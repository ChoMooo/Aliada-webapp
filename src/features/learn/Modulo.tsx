import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, Card, Progress, Stagger, Item, Tag, Note, Button, BackLink, cx } from '../../ui';
import { MOD, modPath, CONTENIDO_DIGITAL } from '../../content/learn';
import { fdate } from '../../lib/format';
import { modProg, isDone, startLevel } from '../digital/logic';
import { MOD_ICON, TONE, sectionOf } from './meta';
import { StepThumb } from './Demo';

export default function Modulo() {
  const { mod = '' } = useParams(); const d = useStore((s) => s.d); const m = MOD(mod);
  if (!m) return <div className="flex flex-col gap-4"><BackLink to="/" label="Inicio" /><Note tone="warn">No encontramos este módulo.</Note></div>;
  const p = modProg(d, m), lv = m.section === 'digital' ? startLevel(d, m.id) : 'basico', base = modPath(m), sec = sectionOf(m);
  const next = m.lessons.find((l) => !isDone(d, l.id) && (lv === 'basico' || l.nivel === 'intermedio')) || m.lessons.find((l) => !isDone(d, l.id));
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={sec} kicker={m.apps} title={m.n} lead={m.desc} right={<span className={cx('grid place-items-center size-14 rounded-xl shrink-0 [&_svg]:size-7', TONE[m.tone])}>{MOD_ICON[m.id]}</span>} /></Item>
      <Item><Card className="flex flex-col gap-4">
        <Progress value={p.n} max={p.t} label="Tu avance" right={`${p.n} de ${p.t} lecciones`} />
        {d.md.diag.done && lv === 'intermedio' && <p className="text-[.92rem]">Por tu encuesta, podés saltear lo básico y arrancar por las lecciones intermedias.</p>}
        {next && <div><Button to={`${base}/${next.id}`} iconRight={<ArrowRight />}>{p.n ? 'Seguir' : 'Empezar'}: {next.t}</Button></div>}
      </Card></Item>
      {m.lessons.map((l, i) => {
        const dn = isDone(d, l.id);
        return (
          <Item key={l.id}><Card to={`${base}/${l.id}`} className="flex items-start gap-4 !p-4 sm:!p-5">
            <div className="relative shrink-0 hidden min-[400px]:block">
              <StepThumb frame={l.demo[Math.min(1, l.demo.length - 1)]} width={64} />
              <span className={cx('absolute -top-2 -left-2 grid place-items-center size-7 rounded-full text-[.8rem] font-bold ring-2 ring-surface', dn ? 'bg-accent text-onaccent' : 'bg-ink text-bg')}>{dn ? <CheckCircle2 className="size-4" /> : i + 1}</span>
            </div>
            <span className="flex-1 min-w-0 flex flex-col gap-1.5">
              <b className="font-head font-semibold text-[1.12rem] leading-tight">{l.t}</b>
              <span className="text-[.9rem] text-muted">{l.para}</span>
              <span className="flex flex-wrap gap-1.5"><Tag><Clock className="size-3.5" />{l.min} min</Tag><Tag tone={l.nivel === 'basico' ? 'ok' : 'violet'}>{l.nivel === 'basico' ? 'Básico' : 'Intermedio'}</Tag><Tag tone="sky"><PlayCircle className="size-3.5" />Video</Tag>{l.sim && <Tag tone="sky">Con práctica</Tag>}{d.md.lec[l.id]?.score != null && <Tag>Desafío: {d.md.lec[l.id]!.score}/{l.quiz.length}</Tag>}</span>
            </span>
          </Card></Item>
        );
      })}
      <Item><Note tone="info">Los pasos son generales y se revisan periódicamente: los menús cambian según la marca, el modelo y la versión de cada app. Las pantallas de los videos son ilustrativas. Contenido del {fdate(CONTENIDO_DIGITAL.fecha)}.</Note></Item>
    </Stagger>
  );
}
