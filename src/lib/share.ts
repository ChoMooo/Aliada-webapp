import { toast } from '../ui/toast';
export const wa = (t: string) => 'https://wa.me/?text=' + encodeURIComponent(t);
export function copyText(t: string) {
  const ok = () => toast('Copiado');
  const fb = () => {
    const a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0';
    document.body.appendChild(a); a.select();
    try { document.execCommand('copy'); ok(); } catch { toast('No se pudo copiar: seleccioná el texto'); }
    a.remove();
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(t).then(ok, fb); else fb();
}
export function speak(t: string) {
  try {
    const s = window.speechSynthesis; s.cancel();
    const u = new SpeechSynthesisUtterance(t); u.lang = 'es-AR'; u.rate = 0.93;
    const vs = s.getVoices(); const v = vs.find(x => /es[-_]AR/i.test(x.lang)) || vs.find(x => /^es/i.test(x.lang)); if (v) u.voice = v;
    s.speak(u);
  } catch { toast('Este dispositivo no tiene lectura en voz alta'); }
}
export function stopSpeak() { try { window.speechSynthesis.cancel(); } catch { /* */ } }
export function downloadText(name: string, text: string, type = 'application/json') {
  try { const b = new Blob([text], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); a.remove(); return true; } catch { return false; }
}
