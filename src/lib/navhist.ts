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

export const SECTION_HOLD = 620; // corto: se ve varias veces por día
export const INTRO_HOLD = 480;  // Inicio: el logo aparece y se va, lo más breve posible

export const hist = {
  cur: '' as string,
  prev: '' as string,
  veilKey: 0,
  veil: null as null | { kind: 'section'; id: SectionId },
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
    const sp = (window as any).__splash;
    if (sp && document.getElementById('splash')) hist.until = Date.now() + sp.until();
    return hist;
  }
  if (reduced()) return hist;
  /* Solo las 5 secciones tienen animación de entrada (los módulos no, para que sea más ágil) */
  const id = sectionOf(pathname);
  if (id !== sectionOf(hist.prev)) {
    hist.veil = { kind: 'section', id }; hist.until = Date.now() + (id === 'inicio' ? INTRO_HOLD : SECTION_HOLD) - 60; hist.veilKey++;
  }
  return hist;
}

/** Segundos que falta para que termine la animación de entrada (para retrasar el contenido) */
export function veilDelay() {
  return Math.max(0, hist.until - Date.now()) / 1000;
}
