import { isExtra } from '../../content/learn';
import type { Data } from '../../store';
import { MODULES, FIN_MODULES, RETOS, SETUP, type Module } from '../../content/learn';
import { detectOS } from '../../lib/device';

export const userOS = (d: Data) => d.md.diag.os || detectOS() || 'android';
export const isDone = (d: Data, lid: string) => !!d.md.lec[lid]?.done;
export function modProg(d: Data, m: Module) { const n = m.lessons.filter((l) => isDone(d, l.id)).length; return { n, t: m.lessons.length }; }
export function setupProg(d: Data) { return { n: SETUP.filter((s) => d.md.setup[s.id]).length, t: SETUP.length }; }
export function digitalProg(d: Data) {
  let n = 0, t = 0;
  MODULES.forEach((m) => { const p = modProg(d, m); n += p.n; t += p.t; });
  return { n, t };
}
export function finModProg(d: Data) {
  let n = 0, t = 0;
  FIN_MODULES.forEach((m) => { const p = modProg(d, m); n += p.n; t += p.t; });
  return { n, t };
}

/* Nivel inicial por módulo: si dice manejarse bien y acierta el desafío, arranca en intermedio */
export function startLevel(d: Data, modId: string): 'basico' | 'intermedio' {
  const g = d.md.diag, self = g.nivel[modId];
  const reto = RETOS.find((r) => r.area === modId);
  const ok = reto ? g.retos[reto.id] === String(reto.c) : false;
  return self === 'bien' && (ok || !reto) ? 'intermedio' : 'basico';
}

/* Ruta: módulos disponibles ordenados según metas, miedos, nivel y desafíos */
export function ruta(d: Data) {
  const g = d.md.diag;
  const avail = MODULES;
  const score: Record<string, number> = {};
  const why: Record<string, string> = {};
  avail.forEach((m) => { score[m.id] = 0; });
  const bump = (id: string, n: number, w?: string) => { if (id in score) { score[id] += n; if (w && !why[id]) why[id] = w; } };
  if (g.metas.includes('familia')) bump('wa', 3, 'Querés hablar más con tu familia');
  if (g.metas.includes('ia') || g.metas.includes('aprender')) bump('ia', 3, 'Querés usar la inteligencia artificial');
  if (g.metas.includes('fotos')) bump('google', 3, 'Querés cuidar tus fotos');
  if (g.metas.includes('moverme')) bump('google', 2, 'Querés moverte y viajar con el celular');
  if (g.metas.includes('redes')) bump('redes', 3, 'Querés usar mejor las redes');
  if (g.metas.includes('crear')) bump('crear', 3, 'Querés crear tarjetas y videos');
  if (g.metas.includes('proteger')) { bump('wa', 1); bump('redes', 1); }
  if (g.miedos.includes('cuentas')) bump('wa', 2, 'Te preocupa que te roben las cuentas');
  if (g.miedos.includes('fotos')) bump('google', 2, 'Te preocupa perder tus fotos');
  if (g.miedos.includes('privacidad')) bump('redes', 2, 'Te preocupa que desconocidos vean tus datos');
  if (g.miedos.includes('tocar')) bump('wa', 1, 'Empezamos por lo que más usás');
  avail.forEach((m) => {
    const lv = g.nivel[m.id];
    if (lv === 'cuesta') bump(m.id, 1, 'Es un tema que te cuesta');
    if (lv === 'bien') bump(m.id, -1);
    const r = RETOS.find((x) => x.area === m.id);
    if (r && g.retos[r.id] != null && g.retos[r.id] !== String(r.c)) bump(m.id, 2, 'El desafío mostró que te conviene repasarlo');
  });
  return avail
    .map((m) => ({ m, s: score[m.id], why: why[m.id] || 'Es de lo más útil para el día a día', start: startLevel(d, m.id) }))
    .sort((a, b) => b.s - a.s);
}
export function nextLesson(d: Data) {
  for (const r of ruta(d)) {
    const ls = r.m.lessons;
    const core = ls.filter((l) => !isExtra(l.id));
    const pick = core.find((l) => !isDone(d, l.id) && (r.start === 'basico' || l.nivel === 'intermedio')) || core.find((l) => !isDone(d, l.id));
    if (pick) return { m: r.m, l: pick };
  }
  return null;
}
export const escudoWanted = (d: Data) => d.md.diag.metas.includes('proteger');
