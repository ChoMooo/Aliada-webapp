export const uid = () => Math.random().toString(36).slice(2, 8);
export function pn(v: unknown): number {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  let s = String(v ?? '').trim().replace(/[^\d.,\-]/g, '');
  if (!s) return 0;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = parseFloat(s);
  return isFinite(n) ? n : 0;
}
export const fmt = (n: number, d = 0) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
/* Espacio duro entre el signo y el número: "$" nunca queda solo al final de una línea */
export const money = (n: number) => (n < 0 ? '−' : '') + '$\u00a0' + fmt(Math.abs(Math.round(n)));
export const fdate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }); };
export const today = () => new Date().toLocaleDateString('es-AR');
