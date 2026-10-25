import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { uid } from './lib/format';

/* ---------- Forma de los datos (todo vive en el dispositivo) ---------- */
export type Row = { id: string; n: string; m: string; mon?: 'ARS' | 'USD' };

export const DEF = () => ({
  v: 2,
  lastBackup: 0,
  perfil: { nombre: '', etapa: '' as '' | 'falta' | 'tramitando' | 'jubilado', sexo: '' as '' | 'mujer' | 'hombre' | 'nd', onb: false },
  aj: { fs: '1', tema: 'auto' as 'auto' | 'light' | 'dark', voz: true, vel: '1' as '0.85' | '1' | '1.2' },
  acceso: { ok: false },
  plata: {
    ing: [{ id: uid(), n: 'Ingreso principal', m: '' }] as Row[],
    gas: [
      { id: uid(), n: 'Vivienda (alquiler, expensas)', m: '' }, { id: uid(), n: 'Comida', m: '' },
      { id: uid(), n: 'Salud y medicamentos', m: '' }, { id: uid(), n: 'Servicios (luz, gas, internet)', m: '' },
      { id: uid(), n: 'Transporte', m: '' }, { id: uid(), n: 'Otros gastos', m: '' }
    ] as Row[],
    /* Ahorros por lugar: plazo fijo, cuentas y billeteras, efectivo y dólares (con la cotización que carga la persona) */
    ah: { pf: '', cu: '', ef: '', usd: '' },
    aho: [] as Row[], // otros ahorros (fondos, cripto, plata prestada…), en pesos o dólares
    deu: [] as Row[],
    cot: '',
    meta: { n: '', m: '' },
    inf: { gas: '', ing: '', aho: '', inf: '30', aum: '25', anios: '10' },
    seg: {} as Record<string, Record<string, string>>,
    grande: { monto: '', meses: '12', proy: [] as Row[] }
  },
  tr: {
    sit: { sit: '', sexo: '', edad: '', aportes: '', hijos: '' },
    docs: {} as Record<string, 1>, ck: {} as Record<string, 1>,
    notas: [] as { id: string; g: string; t: string; ok: boolean }[],
    preg: {} as Record<string, { id: string; t: string; ok: boolean; own: boolean }[]>,
    resp: {} as Record<string, string>
  },
  ta: {
    P: { ex: [] as string[], exTxt: '', sk: [] as string[], gu: [] as string[], ayuda: '', rec: [] as string[], tiempo: '', amb: '', net: '', inv: '', trato: '', fis: '' },
    done: false, cmp: [] as string[], sel: '', w: {} as Record<string, any>
  },
  md: {
    diag: {
      done: false, os: '' as '' | 'android' | 'ios', marca: '', apps: [] as string[],
      nivel: {} as Record<string, string>, retos: {} as Record<string, string>,
      metas: [] as string[], miedos: [] as string[], aprende: '', tiempo: ''
    },
    setup: {} as Record<string, 1>,
    lec: {} as Record<string, { done?: boolean; score?: number; steps?: Record<string, 1> }>
  },
  escudo: { vistos: {} as Record<string, 'ok' | 'mal'>, analisis: 0 },
  /* Vencimientos del mes: qué se paga, qué día y cuánto; "pagos" guarda lo marcado como pagado por mes (AAAA-MM) */
  venc: { items: [] as { id: string; n: string; dia: string; m: string }[], pagos: {} as Record<string, Record<string, 1>> },
  /* Ficha de salud y emergencias (solo en este dispositivo; sin números de documento ni de afiliado) */
  salud: {
    sangre: '', obra: '', medico: '', medTel: '', cond: '', alergias: '', notas: '',
    meds: [] as { id: string; n: string; dosis: string; cuando: string }[],
    contactos: [] as { id: string; n: string; rel: string; tel: string }[]
  },
  libro: { dias: {} as Record<string, 1>, desc: 0 },
  ui: { seen: {} as Record<string, 1> }
});
export type Data = ReturnType<typeof DEF>;

function merge(a: any, b: any): any {
  if (b == null) return a;
  for (const k in b) {
    if (Array.isArray(b[k]) || typeof b[k] !== 'object' || b[k] === null) a[k] = b[k];
    else a[k] = merge(a[k] && typeof a[k] === 'object' ? a[k] : {}, b[k]);
  }
  return a;
}
export function mergeData(o: any): Data {
  const d = merge(DEF(), o) as Data;
  /* Datos anteriores a la calculadora de ahorros: pasan las filas conocidas a sus casilleros */
  if (o?.plata && !o.plata.ah && Array.isArray(d.plata.aho)) {
    const rest: Row[] = [];
    for (const r of d.plata.aho) {
      if (r.n === 'Cuentas y efectivo en pesos' && r.mon !== 'USD') { if (!d.plata.ah.cu) d.plata.ah.cu = r.m; }
      else if (r.n === 'Dólares' && r.mon === 'USD') { if (!d.plata.ah.usd) d.plata.ah.usd = r.m; }
      else if (r.n || r.m) rest.push(r);
    }
    d.plata.aho = rest;
  }
  return d;
}

/* Migra los datos de la versión anterior (aliada.v1), si existen */
function migrateV1(): Data | null {
  try {
    const r = localStorage.getItem('aliada.v1');
    if (!r) return null;
    const o = JSON.parse(r);
    const d = DEF();
    if (o.perfil) { d.perfil.nombre = o.perfil.nombre || ''; d.perfil.etapa = o.perfil.etapa || ''; d.perfil.onb = !!o.perfil.onb; }
    if (o.tr?.sit?.sexo) d.perfil.sexo = o.tr.sit.sexo === 'F' ? 'mujer' : o.tr.sit.sexo === 'M' ? 'hombre' : '';
    if (o.aj) { d.aj.fs = String(o.aj.fs || '1'); d.aj.tema = o.aj.tema || 'auto'; d.aj.voz = o.aj.voz !== false; }
    if (o.plata) merge(d.plata, o.plata);
    if (o.tr) merge(d.tr, o.tr);
    if (o.ta) merge(d.ta, o.ta);
    d.lastBackup = o.lastBackup || 0;
    return d;
  } catch { return null; }
}

const safeStorage = {
  getItem: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
  removeItem: (k: string) => { try { localStorage.removeItem(k); } catch { /* */ } }
};

type Store = {
  d: Data;
  savedAt: number;
  mut: (fn: (d: Data) => void) => void;
  replace: (d: Data) => void;
  reset: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      d: migrateV1() ?? DEF(),
      savedAt: 0,
      mut: (fn) => set((s) => ({ d: produce(s.d, fn), savedAt: Date.now() })),
      replace: (d) => set({ d, savedAt: Date.now() }),
      reset: () => set({ d: DEF(), savedAt: Date.now() })
    }),
    {
      name: 'aliada.v2',
      version: 2,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ d: s.d }) as any,
      merge: (persisted: any, current) => ({ ...current, d: persisted?.d ? mergeData(persisted.d) : current.d })
    }
  )
);

/* Atajos */
export const useD = <T,>(sel: (d: Data) => T) => useStore((s) => sel(s.d));
export const mut = (fn: (d: Data) => void) => useStore.getState().mut(fn);
export const getD = () => useStore.getState().d;
export const gp = (o: any, p: string) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
export function sp(o: any, p: string, v: any) {
  const ks = p.split('.'); let a = o;
  for (let i = 0; i < ks.length - 1; i++) { if (a[ks[i]] == null) a[ks[i]] = {}; a = a[ks[i]]; }
  a[ks[ks.length - 1]] = v;
}
export const setPath = (p: string, v: any) => mut((d) => sp(d, p, v));
