import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, Card, Progress, Stagger, Item, Tag, Note, Button, cx } from '../../ui';
import { MOD, CONTENIDO_DIGITAL } from '../../content/digital';
import { fdate } from '../../lib/format';
import { modProg, isDone, startLevel } from './logic';
import { MOD_ICON, TONE } from './Hub';
import DigitalHub from './Hub';

export default function Modulo() {
  const { mod = '' } = useParams(); const d = useStore((s) => s.d); const m = MOD(mod);
  if (!m || !m.lessons.length) return <DigitalHub />;
  const p = modProg(d, m), lv = startLevel(d, m.id);
  const next = m.lessons.find((l) => !isDone(d, l.id) && (lv === 'basico' || l.nivel === 'intermedio')) || m.lessons.find((l) => !isDone(d, l.id));
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/digital', label: 'Mundo digital' }} kicker={m.apps} title={m.n} lead={m.desc} right={<span className={cx('grid place-items-center size-14 rounded-2xl shrink-0 [&_svg]:size-7', TONE[m.tone])}>{MOD_ICON[m.id]}</span>} /></Item>
      <Item><Card className="flex flex-col gap-4">
        <Progress value={p.n} max={p.t} label="Tu avance" right={`${p.n} de ${p.t} lecciones`} />
        {d.md.diag.done && lv === 'intermedio' && <p className="text-[.92rem]">Por tu encuesta, podés saltear lo básico y arrancar por las lecciones intermedias.</p>}
        {next && <div><Button to={`/digital/m/${m.id}/${next.id}`} iconRight={<ArrowRight />}>{p.n ? 'Seguir' : 'Empezar'}: {next.t}</Button></div>}
      </Card></Item>
      {m.lessons.map((l, i) => {
        const dn = isDone(d, l.id);
        return (
          <Item key={l.id}><Card to={`/digital/m/${m.id}/${l.id}`} className="flex items-start gap-4">
            <span className={cx('grid place-items-center size-11 rounded-full shrink-0 font-bold', dn ? 'bg-accent text-onaccent' : 'bg-sunk')}>{dn ? <CheckCircle2 className="size-6" /> : i + 1}</span>
            <span className="flex-1 min-w-0 flex flex-col gap-1.5">
              <b className="font-head font-normal text-[1.15rem] leading-tight">{l.t}</b>
              <span className="text-[.9rem] text-muted">{l.para}</span>
              <span className="flex flex-wrap gap-1.5"><Tag><Clock className="size-3.5" />{l.min} min</Tag><Tag tone={l.nivel === 'basico' ? 'ok' : 'violet'}>{l.nivel === 'basico' ? 'Básico' : 'Intermedio'}</Tag>{l.sim && <Tag tone="sky">Con práctica</Tag>}{d.md.lec[l.id]?.score != null && <Tag>Desafío: {d.md.lec[l.id]!.score}/{l.quiz.length}</Tag>}</span>
            </span>
          </Card></Item>
        );
      })}
      <Item><Note tone="info">Los pasos son generales y se revisan periódicamente. Contenido del {fdate(CONTENIDO_DIGITAL.fecha)}.</Note></Item>
    </Stagger>
  );
}
