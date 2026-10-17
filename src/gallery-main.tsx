import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import Gallery from './features/learn/Gallery';
import { PhoneScreen } from './features/learn/Screen';
import { ALL_MODULES, SETUP } from './content/learn';
import { ESCUDO_DEMO } from './content/learn/escudo';

function All() {
  const items: { id: string; f: any }[] = [];
  ALL_MODULES.forEach((m) => m.lessons.forEach((l) => l.demo.forEach((f, i) => items.push({ id: l.id + '#' + i, f }))));
  SETUP.forEach((s) => s.demo.forEach((f, i) => items.push({ id: 'setup-' + s.id + '#' + i, f })));
  ESCUDO_DEMO.forEach((f, i) => items.push({ id: 'escudo#' + i, f }));
  return <div className="grid grid-cols-7 gap-2 p-2 bg-white">{items.map((x) => <div key={x.id} className="frame" data-id={x.id} data-expect={x.f.s.hl ? '1' : '0'}><PhoneScreen frame={x.f} width={148} animateFinger={false} /><div className="text-[10px] leading-tight">{x.id}<br />{x.f.cap}</div></div>)}</div>;
}
createRoot(document.getElementById('g')!).render(location.search.includes('all') ? <All /> : <Gallery />);
