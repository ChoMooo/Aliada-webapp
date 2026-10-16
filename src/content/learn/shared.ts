import type { Frame, Screen, Row, Block } from '../../features/learn/Screen';
export type { Frame, Screen };
export type Quiz = { q: string; o: string[]; c: number; e: string };
export type Lesson = {
  id: string; t: string; min: number; nivel: 'basico' | 'intermedio';
  para: string; idea: string[]; sim?: string; simIntro?: string; demo: Frame[];
  pasos: { android: string[]; ios: string[] }; siNo: string[]; quiz: Quiz[]; ficha: string[];
};
export type Module = {
  id: string; n: string; apps: string; tone: 'mint' | 'sky' | 'amber' | 'violet'; section: 'finanzas' | 'digital';
  desc: string; temas: string[]; lessons: Lesson[];
};
export const same = (a: string[]) => ({ android: a, ios: a });
export const F = (s: Screen, cap: string, act?: Frame['act']): Frame => ({ s, cap, act });
export const APPS = ['Teléfono', 'WhatsApp', 'Cámara', 'Galería', 'Ajustes', 'Maps', 'Fotos', 'YouTube', 'Facebook', 'Instagram', 'Billetera', 'Mercado Libre', 'Drive', 'Traductor', 'Canva', 'CapCut', 'ChatGPT', 'Tienda', 'Correo', 'Chrome'];
export const home = (app: string): Screen => ({ k: 'home', apps: APPS, hl: APPS.indexOf(app) });
export const list = (title: string, items: Row[], hl?: number, back = true): Screen => ({ k: 'list', title, items, hl, back });
export const app = (title: string, blocks: Block[], hl?: string, extra: Partial<Extract<Screen, { k: 'app' }>> = {}): Screen => ({ k: 'app', title, blocks, hl, back: true, ...extra });
export const CHATS = [{ t: 'Hija', s: 'Te quiero ma ❤️' }, { t: 'Familia Pérez', s: 'Abuela: ¿el domingo almorzamos?' }, { t: 'Club de bochas', s: 'Mañana a las 10' }, { t: 'Vecinos del edificio', s: 'Se corta el agua el jueves' }, { t: 'Dr. López', s: 'Turno confirmado' }];
export const T = { wa: '#1f6b4f', fb: '#3459a8', yt: '#b8322a', ig: '#8f3a76', bill: '#1d5fa0', ml: '#a8820f', ia: '#2c2c2c', drive: '#2a7a52', maps: '#2f6fd6', tr: '#3466c2', canva: '#5a4fcf' };
