import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, Card, Progress, Stagger, Item, Note, Button, BackLink, cx } from '../../ui';
import { MOD, modPath, CONTENIDO_DIGITAL, isExtra } from '../../content/learn';
import type { Lesson } from '../../content/learn/shared';
import { fdate } from '../../lib/format';
import { modProg, isDone, startLevel } from '../digital/logic';
import { MOD_ICON, TONE, sectionOf } from './meta';

export default function Modulo() {
  const { mod = '' } = useParams(); const d = useStore((s) => s.d); const m = MOD(mod);
  if (!m) return <div className="flex flex-col gap-4"><BackLink to="/" label="Inicio" /><Note tone="warn">No encontramos este módulo.</Note></div>;
  const p = modProg(d, m), lv = m.section === 'digital' ? startLevel(d, m.id) : 'basico', base = modPath(m), sec = sectionOf(m);
  const core = m.lessons.filter((l) => !isExtra(l.id)), extra = m.lessons.filter((l) => isExtra(l.id));
  const next = core.find((l) => !isDone(d, l.id) && (lv === 'basico' || l.nivel === 'intermedio')) || core.find((l) => !isDone(d, l.id)) || extra.find((l) => !isDone(d, l.id));
  const Row = ({ l, n }: { l: Lesson; n: number }) => {
    const dn = isDone(d, l.id), sc = d.md.lec[l.id]?.score;
    return (
      <li>
        <Link to={`${base}/${l.id}`} className="press flex items-center gap-3.5 px-4 py-3.5 min-h-[4.5rem] hover:bg-sunk/60 transition-colors duration-150">
          <span className={cx('grid place-items-center size-9 rounded-full text-[.9rem] font-bold shrink-0 num', dn ? 'bg-accent text-onaccent' : 'bg-sunk text-ink')}>{dn ? <Check className="size-5" /> : n}</span>
          <span className="flex-1 min-w-0">
            <b className="block font-semibold text-[1.05rem] leading-snug">{l.t}</b>
            <span className="block text-[.86rem] text-muted mt-0.5">{l.min} min · video y práctica{sc != null ? ` · desafío ${sc}/${l.quiz.length}` : ''}</span>
          </span>
          <ChevronRight className="size-5 text-muted shrink-0" />
        </Link>
      </li>
    );
  };
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={sec} title={m.n} lead={m.desc} right={<span className={cx('grid place-items-center size-14 rounded-xl shrink-0 [&_svg]:size-7', TONE[m.tone])}>{MOD_ICON[m.id]}</span>} /></Item>
      <Item><Card className="flex flex-col gap-4">
        <Progress value={p.n} max={p.t} label="Tu avance" right={`${p.n} de ${p.t} lecciones`} />
        {d.md.diag.done && lv === 'intermedio' && <p className="text-[.92rem]">Por tu encuesta, podés saltear lo básico y arrancar por las lecciones intermedias.</p>}
        {next && <div><Button to={`${base}/${next.id}`} iconRight={<ArrowRight />}>{p.n ? 'Seguir' : 'Empezar'}: {next.t}</Button></div>}
      </Card></Item>
      <Item className="flex flex-col gap-2.5">
        <h2 className="text-[1.25rem]">Lo esencial</h2>
        <ul className="rounded-xl2 bg-surface border border-line shadow-card divide-y divide-line overflow-hidden">{core.map((l, i) => <Row key={l.id} l={l} n={i + 1} />)}</ul>
      </Item>
      {extra.length > 0 && (
        <Item>
          <details className="group">
            <summary className="press flex items-center justify-between gap-3 cursor-pointer min-h-[3.2rem] text-[1.1rem] font-head font-semibold">
              <span>Para más adelante <span className="font-body font-normal text-muted text-[.95rem]">· {extra.length} {extra.length === 1 ? 'lección' : 'lecciones'}</span></span>
              <ChevronRight className="size-5 text-muted transition-transform duration-200 group-open:rotate-90" />
            </summary>
            <ul className="mt-2 rounded-xl2 bg-surface border border-line divide-y divide-line overflow-hidden">{extra.map((l, i) => <Row key={l.id} l={l} n={core.length + i + 1} />)}</ul>
          </details>
        </Item>
      )}
      <Item><p className="text-[.82rem] text-muted">Los pasos son generales y se revisan periódicamente: los menús cambian según la marca, el modelo y la versión de cada app. Las pantallas son ilustraciones propias que reproducen la disposición de cada app, sin sus logos. Contenido del {fdate(CONTENIDO_DIGITAL.fecha)}.</p></Item>
    </Stagger>
  );
}
