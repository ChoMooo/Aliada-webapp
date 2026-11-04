/* Une clases de Tailwind resolviendo conflictos (lo usan los componentes de Aceternity UI) */
import { twMerge } from 'tailwind-merge';
type V = string | false | null | undefined | 0 | Record<string, boolean | undefined>;
export function cn(...a: V[]) {
  return twMerge(a.flatMap((x) => (!x ? [] : typeof x === 'string' ? [x] : Object.keys(x).filter((k) => x[k]))).join(' '));
}
