/* Audio de la app: primero usa las grabaciones generadas con voz argentina (carpeta audio/),
   y si un texto no tiene grabación, usa la voz del dispositivo como respaldo. */
import manifest from '../generated/audio.json';
type Entry = { f: string; d: number; m?: number[] };
const M = manifest as Record<string, Entry>;

export const norm = (t: string) => t.replace(/\s+/g, ' ').trim();
/* Versión "para decir en voz alta" de un texto de pantalla */
export function speechify(t: string) {
  return norm(t)
    .replace(/\s*→\s*/g, ', después ')
    .replace(/[“”«»"]/g, '')
    .replace(/\$\s?([\d.]+(?:,\d+)?)/g, '$1 pesos')
    .replace(/(\d),(\d)x\b/g, '$1 coma $2 equis').replace(/\b(\d)x\b/g, '$1 equis')
    .replace(/\bGB\b/g, 'gigas').replace(/\bMB\b/g, 'megas')
    .replace(/\bCVU\b/g, 'ce ve u').replace(/\bCBU\b/g, 'ce be u').replace(/\bDNI\b/g, 'de ene i').replace(/\bPIN\b/g, 'pin')
    .replace(/\bQR\b/g, 'cu erre').replace(/\bIA\b/g, 'i a').replace(/\bPDF\b/g, 'pe de efe').replace(/\bPNG\b/g, 'pe ene ge')
    .replace(/\bANSES\b/g, 'Anses').replace(/\bPAMI\b/g, 'Pami').replace(/\biPhone\b/g, 'aifon').replace(/\bwifi\b/gi, 'uaifai')
    .replace(/\bWhatsApp\b/g, 'Guasap').replace(/\bYouTube\b/g, 'Iutiub').replace(/\bGoogle\b/g, 'Gúgol').replace(/\bChatGPT\b/g, 'Chat yi pi ti')
    .replace(/\bMaps\b/g, 'Maps').replace(/\bDrive\b/g, 'Draiv').replace(/\bCanva\b/g, 'Canva').replace(/\bCapCut\b/g, 'Cap cat')
    .replace(/\bTikTok\b/g, 'Tik tok').replace(/\bInstagram\b/g, 'Instagram').replace(/\bFacebook\b/g, 'Feisbuk').replace(/\bShorts\b/g, 'Shorts')
    .replace(/[❤️💛🙂😓⚠️👑✓◉★☆♡▶⇄·]/gu, ' ').replace(/\s+/g, ' ').trim();
}
export function hash(t: string) {
  let h = 0x811c9dc5;
  const s = norm(t);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
export const demoKey = (caps: string[]) => hash(caps.map(norm).join(' || '));
export const entry = (key: string): Entry | undefined => M[key];
export const urlOf = (e: Entry) => 'audio/' + e.f;

let current: HTMLAudioElement | null = null;
let onStop: (() => void) | null = null;
let ext: (() => void) | null = null;
/* Un reproductor propio (por ejemplo, un mini video) avisa que está sonando, para poder pausarlo si se toca otro audio */
export function claim(stop: () => void) { ext = stop; }
export function stopAll() {
  if (ext) { const f = ext; ext = null; f(); }
  if (current) { current.pause(); current = null; }
  try { window.speechSynthesis.cancel(); } catch { /* */ }
  const f = onStop; onStop = null; f?.();
}

function pickVoice() {
  try {
    const vs = window.speechSynthesis.getVoices().filter((v) => /^es/i.test(v.lang));
    const score = (v: SpeechSynthesisVoice) => (/es[-_](AR|UY)/i.test(v.lang) ? 4 : /es[-_](US|MX|419)/i.test(v.lang) ? 2 : 1) + (/google|natural|neural|premium|enhanced|paulina|m[oó]nica|helena/i.test(v.name) ? 3 : 0);
    return vs.sort((a, b) => score(b) - score(a))[0];
  } catch { return undefined; }
}
function speakFallback(t: string, done: () => void) {
  try {
    const s = window.speechSynthesis; s.cancel();
    const parts = norm(t).match(/[^.!?¿¡]+[.!?]*/g) || [t];
    const v = pickVoice();
    parts.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(speechify(p)); u.lang = v?.lang || 'es-AR'; u.rate = 0.9; u.pitch = 1; if (v) u.voice = v;
      if (i === parts.length - 1) u.onend = done;
      s.speak(u);
    });
  } catch { done(); }
}

/* Reproduce un texto. Devuelve false si no hay audio posible. */
export function playText(t: string, done: () => void) {
  stopAll();
  const e = M[hash(t)];
  onStop = done;
  if (e) {
    const a = new Audio(urlOf(e)); current = a;
    a.onended = () => { if (current === a) { current = null; const f = onStop; onStop = null; f?.(); } };
    a.play().catch(() => speakFallback(t, () => { const f = onStop; onStop = null; f?.(); }));
    return true;
  }
  speakFallback(t, () => { const f = onStop; onStop = null; f?.(); });
  return true;
}
export const hasRecording = (t: string) => !!M[hash(t)];
