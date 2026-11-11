import { describe, it, expect } from 'vitest';
import { planPorRubro, type Fila } from './cargar';

const f = (r: string, m: number, fecha: string, ok = true): Fila => ({ id: r + m + fecha, n: 'x', m, f: fecha, tipo: 'gasto', ok, r });

describe('planPorRubro', () => {
  it('suma por rubro lo tildado', () => {
    expect(planPorRubro([f('comida', 1000, '2026-11-01'), f('comida', 500, '2026-11-09'), f('salud', 300, '2026-11-02'), f('salud', 999, '2026-11-03', false)]))
      .toEqual([{ r: 'comida', m: 1500 }, { r: 'salud', m: 300 }]);
  });
  it('si el resumen trae dos meses, devuelve el promedio por mes', () => {
    expect(planPorRubro([f('comida', 1000, '2026-10-15'), f('comida', 3000, '2026-11-15')])).toEqual([{ r: 'comida', m: 2000 }]);
  });
});
