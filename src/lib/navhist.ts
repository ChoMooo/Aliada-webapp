/* Historial mínimo de navegación para decidir cuándo mostrar las animaciones de entrada.
   Se actualiza durante el render de AppShell (idempotente), antes de que se monten las páginas. */
export type SectionId = 'inicio' | 'finanzas' | 'inversiones' | 'digital' | 'libro';

export function sectionOf(p: string): SectionId {
  if (p.startsWith('/finanzas')) return 'finanzas';
  if (p.startsWith('/inversiones')) return 'inversiones';
  if (p.startsWith('/digital')) return 'digital';
  if (p.startsWith('/libro')) return 'libro';
  return 'inicio';
}

const MOD_RE = /^\/(finanzas|digital|inversiones)\/m\/[^/]+$/;
export const SECTION_HOLD = 1000;
export const MODULE_HOLD = 1150;

export const hist = {
  cur: '' as string,
  prev: '' as string,
  veilKey: 0,
  veil: null as null | { kind: 'section'; id: SectionId } | { kind: 'module'; path: string },
  until: 0
};

function reduced() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
}

/** Llamar en cada render con el pathname actual */
export function track(pathname: string) {
  if (pathname === hist.cur) return hist;
  const first = hist.cur === '';
  hist.prev = hist.cur;
  hist.cur = pathname;
  hist.veil = null;
  hist.until = 0;
  if (first) { // al abrir la app está la pantalla de carga: el contenido entra cuando se va
    if (document.getElementById('splash')) hist.until = Date.now() + Math.max(0, (reduced() ? 700 : 2450) - performance.now());
    return hist;
  }
  if (reduced()) return hist;
  if (MOD_RE.test(pathname)) {
    if (!hist.prev.startsWith(pathname + '/')) { hist.veil = { kind: 'module', path: pathname }; hist.until = Date.now() + MODULE_HOLD - 120; hist.veilKey++; }
  } else if (sectionOf(pathname) !== sectionOf(hist.prev)) {
    hist.veil = { kind: 'section', id: sectionOf(pathname) }; hist.until = Date.now() + SECTION_HOLD - 120; hist.veilKey++;
  }
  return hist;
}

/** Segundos que falta para que termine la animación de entrada (para retrasar el contenido) */
export function veilDelay() {
  return Math.max(0, hist.until - Date.now()) / 1000;
}
