import React, { useState } from 'react';
import { useStore, mut } from '../../store';
import { PageHeader, Card, Progress, Chips, Note, Stagger, Item, CheckRow, ListenButton, Celebrate } from '../../ui';
import { SETUP } from '../../content/digital';
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
          <CheckRow done={!!d.md.setup[s.id]} onToggle={() => mut((x) => { if (x.md.setup[s.id]) delete x.md.setup[s.id]; else x.md.setup[s.id] = 1; })}
            sub={s.por}><b className="font-head font-normal text-[1.15rem] no-underline">{s.t}</b></CheckRow>
          <p className="pl-11 text-[.98rem]">{os === 'ios' ? s.ios : s.android}</p>
          {os === 'android' && s.samsung && (samsung || !d.md.diag.marca) && <p className="pl-11 text-[.88rem] text-muted">{s.samsung}</p>}
          <div className="pl-11 pt-2"><ListenButton text={s.t + '. ' + (os === 'ios' ? s.ios : s.android)} /></div>
        </Card></Item>
      ))}
    </Stagger>
  );
}
