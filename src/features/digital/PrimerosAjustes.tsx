import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { useStore, mut } from '../../store';
import { PageHeader, Card, Progress, Chips, Note, Stagger, Item, CheckRow, ListenButton, Celebrate, Disclosure } from '../../ui';
import { N } from '../../lib/narration';
import { DemoPlayer, StepThumb } from '../learn/Demo';
import { SETUP } from '../../content/learn';
import { userOS, setupProg } from './logic';

export default function PrimerosAjustes() {
  const d = useStore((s) => s.d);
  const [os, setOs] = useState<string>(userOS(d));
  const p = setupProg(d), samsung = d.md.diag.marca === 'samsung';
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/digital', label: 'Mundo digital' }} kicker="Mundo digital" title="Primeros ajustes" lead="Siete ajustes que hacen el celular más cómodo y más seguro. Hacelos con el celular en la mano." /></Item>
      <Item><Card className="relative flex flex-col gap-4">
        <Celebrate show={p.n === p.t} />
        <Progress value={p.n} max={p.t} label="Tu avance" right={`${p.n} de ${p.t}`} />
        <div className="flex flex-wrap items-center gap-3"><span className="text-[.9rem] text-muted">Pasos para:</span><Chips options={[['android', 'Android'], ['ios', 'iPhone']]} value={os} onChange={(v) => v && setOs(v)} /></div>
      </Card></Item>
      <Item><Note tone="info">Los menús cambian según la marca y la versión. Si no encontrás una opción, abrí <b>Ajustes</b> y usá la <b>lupa</b> para buscar la palabra.</Note></Item>
      {SETUP.map((s) => (
        <Item key={s.id}><Card className="flex flex-col gap-1">
          <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-1">
          <CheckRow done={!!d.md.setup[s.id]} onToggle={() => mut((x) => { if (x.md.setup[s.id]) delete x.md.setup[s.id]; else x.md.setup[s.id] = 1; })}
            sub={s.por}><b className="font-head font-semibold text-[1.15rem] no-underline">{s.t}</b></CheckRow>
          <p className="pl-11 text-[.98rem]">{os === 'ios' ? s.ios : s.android}</p>
          {os === 'android' && s.samsung && (samsung || !d.md.diag.marca) && <p className="pl-11 text-[.88rem] text-muted">{s.samsung}</p>}
          </div>
          <div className="hidden min-[420px]:block pt-1"><StepThumb frame={s.demo[s.demo.length - 1]} width={70} /></div>
          </div>
          <div className="pl-11 pt-2 flex flex-wrap gap-2 items-center"><ListenButton text={N.setup(s, os)} /></div>
          <div className="pl-11 pt-1"><Disclosure title={<span className="inline-flex items-center gap-2"><PlayCircle className="size-5 text-accent" />Ver el video{os === 'ios' ? ' (pantallas de Android)' : ''}</span>}><div className="pt-3"><DemoPlayer frames={s.demo} title={s.t} /></div></Disclosure></div>
        </Card></Item>
      ))}
    </Stagger>
  );
}
