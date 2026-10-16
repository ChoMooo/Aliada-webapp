/* Textos que la app lee en voz alta. Se arman siempre con estas funciones,
   así el script de audio genera exactamente los mismos textos (scripts/audio-texts.ts). */
type L = { t: string; para: string; idea: string[] };
const end = (s: string) => (/[.!?…:]$/.test(s.trim()) ? s.trim() : s.trim() + '.');
export const N = {
  lessonIntro: (l: L) => [end(l.t), end(l.para), ...l.idea.map(end)].join(' '),
  steps: (p: string[]) => p.map((s, i) => `Paso ${i + 1}. ` + end(s)).join(' '),
  setup: (s: { t: string; android: string; ios: string }, os: string) => end(s.t) + ' ' + end(os === 'ios' ? s.ios : s.android),
  ask: (t: string, h?: string) => end(t) + (h ? ' ' + end(h) : ''),
  guia: (g: { t: string; resuelve: string; gen: string[] }) => [end(g.t), end(g.resuelve), ...g.gen.map(end)].join(' '),
  tramSit: '¿En qué situación estás? Elegí una opción.'
};
