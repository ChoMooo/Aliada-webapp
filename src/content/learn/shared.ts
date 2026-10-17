import type { Frame, Screen } from '../../features/learn/Screen';
export type { Frame, Screen };
export type Quiz = { q: string; o: string[]; c: number; e: string };
export type Lesson = {
  id: string; t: string; min: number; nivel: 'basico' | 'intermedio';
  para: string; idea: string[]; sim?: string; simIntro?: string; demo: Frame[];
  pasos: { android: string[]; ios: string[] }; siNo: string[]; quiz: Quiz[]; ficha: string[];
};
export type Section = 'finanzas' | 'digital' | 'inversiones';
export type Module = {
  id: string; n: string; apps: string; tone: 'mint' | 'sky' | 'amber' | 'violet'; section: Section;
  desc: string; temas: string[]; lessons: Lesson[];
};
export const same = (a: string[]) => ({ android: a, ios: a });
export const F = (s: Screen, cap: string, act?: Frame['act']): Frame => ({ s, cap, act });
/** pantalla de una app: S('wa', { v: 'chat', hl: 'mic' }) */
export const S = (app: string, o: Record<string, any> = {}): Screen => ({ app, ...o });
/** inicio del celular con el ícono de la app resaltado */
export const home = (appName: string): Screen => ({ app: 'phone', hl: appName });
/** tienda de apps buscando una app */
export const store = (q: string, dev: string, hl = 'install0'): Screen => ({ app: 'phone', v: 'store', q, apps: [[q, dev, '4,5 ★ · Gratis', '#111']], hl });
