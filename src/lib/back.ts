/* Botón "Volver" de la barra de arriba: vuelve a la pantalla anterior dentro de la app.
   Si no hay pantalla anterior (se abrió directo en una página, o se recargó), va al "padre" que declaró la página
   (PageHeader back) y si no hay, a la sección (/finanzas, /digital…) o al Inicio. */
import type { NavigateFunction } from 'react-router-dom';

const padre = { path: '', to: '' };
/** Las páginas avisan cuál es su pantalla "de arriba" (se usa solo si no hay historial) */
export function setPadre(path: string, to: string) { padre.path = path; padre.to = to; }

export function volver(nav: NavigateFunction, pathname: string) {
  const idx = (window.history.state && typeof window.history.state.idx === 'number') ? window.history.state.idx : 0;
  if (idx > 0) { nav(-1); return; }
  if (padre.path === pathname && padre.to) { nav(padre.to, { replace: true }); return; }
  const seg = pathname.split('/').filter(Boolean);
  nav(seg.length > 1 ? '/' + seg[0] : '/', { replace: true });
}
