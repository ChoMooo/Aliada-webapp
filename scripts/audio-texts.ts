/* Lista todos los textos que la app lee en voz alta, para generar los audios.
   Uso: npx tsx scripts/audio-texts.ts > textos.json */
import { ALL_MODULES, SETUP, DIAG_Q, RETOS } from '../src/content/learn';
import { ESCUDO_DEMO } from '../src/content/learn/escudo';
import { PLATA_STEPS, GUIAS } from '../src/content/finanzas';
import { N } from '../src/lib/narration';
import { hash, demoKey, speechify, norm, PROBAR_VOZ } from '../src/lib/audio';

const out: Record<string, { kind: 'text' | 'demo'; speak?: string; parts?: string[] }> = {};
const text = (t: string) => { if (t && norm(t)) out[hash(t)] = { kind: 'text', speak: speechify(t) }; };
const demo = (caps: string[]) => { if (caps.length) out[demoKey(caps)] = { kind: 'demo', parts: caps.map(speechify) }; };

ALL_MODULES.forEach((m) => m.lessons.forEach((l) => {
  text(N.steps(l.pasos.android)); text(N.steps(l.pasos.ios)); demo(l.demo.map((f) => f.cap));
}));
SETUP.forEach((s) => { text(N.setup(s, 'android')); text(N.setup(s, 'ios')); demo(s.demo.map((f) => f.cap)); });
demo(ESCUDO_DEMO.map((f) => f.cap));
[DIAG_Q.os(null), DIAG_Q.os('android'), DIAG_Q.os('ios'), DIAG_Q.marca, DIAG_Q.apps, DIAG_Q.nivel, ...RETOS.map((_, k) => DIAG_Q.reto(k)), DIAG_Q.metas, DIAG_Q.miedos, DIAG_Q.aprende].forEach((q) => text(N.ask(q.t, q.h)));
PLATA_STEPS.forEach((s) => text(N.ask(s.t, s.h)));
GUIAS.forEach((g: any) => text(N.guia(g)));
text(N.tramSit);
text(PROBAR_VOZ);
process.stdout.write(JSON.stringify(out, null, 1));
