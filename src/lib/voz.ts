/* Dictado: la persona habla y el celular lo pasa a texto.
   Usa el reconocimiento de voz del propio teléfono (en Android lo hace Google, en iPhone Apple): Aliada no graba ni guarda el audio. */
import { useCallback, useEffect, useRef, useState } from 'react';

const Rec = (): any => (typeof window === 'undefined' ? null : (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null);
export const hayDictado = () => !!Rec();

export function useDictado(onTexto: (t: string, final: boolean) => void) {
  const [on, setOn] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef<any>(null), cb = useRef(onTexto);
  cb.current = onTexto;
  const parar = useCallback(() => { try { ref.current?.stop(); } catch { /* */ } }, []);
  const empezar = useCallback(() => {
    const R = Rec();
    if (!R) { setError('Este celular no tiene dictado en el navegador. Usá el micrófono del teclado.'); return; }
    try { ref.current?.abort(); } catch { /* */ }
    const r = new R(); ref.current = r;
    r.lang = 'es-AR'; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
    r.onstart = () => { setOn(true); setError(''); };
    r.onend = () => setOn(false);
    r.onerror = (e: any) => {
      setOn(false);
      setError(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Falta el permiso del micrófono. Aceptalo cuando el celular lo pida.'
        : e.error === 'no-speech' ? 'No escuché nada. Tocá el micrófono y hablá cerca del celular.'
        : e.error === 'network' ? 'El dictado necesita internet. También podés escribirlo.' : e.error === 'aborted' ? '' : 'No pude escucharte. Probá de nuevo o escribilo.');
    };
    r.onresult = (e: any) => {
      let t = '', fin = true;
      for (let i = 0; i < e.results.length; i++) { t += e.results[i][0].transcript; if (!e.results[i].isFinal) fin = false; }
      cb.current(t.trim(), fin);
    };
    try { r.start(); } catch { setError('No pude abrir el micrófono. Probá de nuevo.'); }
  }, []);
  useEffect(() => () => { try { ref.current?.abort(); } catch { /* */ } }, []);
  return { on, error, empezar, parar };
}
