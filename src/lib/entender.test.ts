import { describe, it, expect } from 'vitest';
import { cifra, numerosDichos, montos, fechas, entenderDicho, entenderBoleta, entenderTexto, entenderCSV, rubroPara, servicioDe } from './entender';

const HOY = new Date(2026, 10, 11); // 11 de noviembre de 2026
const simple = (b: { n: string; m: number; tipo: string; dia?: number; f?: string; ingreso?: boolean }[]) => b.map((x) => [x.n, x.m, x.tipo, x.dia ?? null]);

describe('cifra', () => {
  it.each([['25.000', 25000], ['1.500,50', 1500.5], ['1500.50', 1500.5], ['8500', 8500], ['1,234.56', 1234.56], ['12,5', 12.5], ['1.234.567', 1234567], ['3.500', 3500], ['0,99', 0.99]])('%s → %d', (s, n) => expect(cifra(s)).toBe(n));
});

describe('numerosDichos', () => {
  it.each([
    ['ocho mil quinientos', '8500'], ['veinticinco mil', '25000'], ['25 mil', '25000'], ['mil quinientos', '1500'],
    ['treinta y cinco mil', '35000'], ['un millón doscientos mil', '1200000'], ['2 mil 500', '2500'], ['cien', '100'],
    ['doscientos cincuenta', '250'], ['15 lucas', '15000'], ['tres millones', '3000000'], ['ciento veinte mil', '120000']
  ])('%s → %s', (s, n) => expect(numerosDichos(s)).toBe(n));
  it('no toca el resto de la frase', () => expect(numerosDichos('gasté quince mil en el super')).toBe('gasté 15000 en el super'));
  it('"una" como artículo no es un número', () => expect(numerosDichos('una compra de dos mil')).toBe('una compra de 2000'));
  it('la "y" entre dos gastos no los suma', () => expect(numerosDichos('farmacia ocho mil y luz veinte mil')).toBe('farmacia 8000 y luz 20000'));
});

describe('montos y fechas', () => {
  it('encuentra plata con signo y centavos', () => {
    const M = montos('Total a pagar $ 45.230,50 hasta el 10/12/2026');
    expect(M.find((m) => m.fuerte)?.v).toBe(45230.5);
  });
  it('ignora códigos largos', () => expect(montos('Operación 123456789012').length).toBe(0));
  it('detecta negativos', () => expect(montos('-$ 1.500,00')[0].neg).toBe(true));
  it('lee varias formas de fecha', () => {
    expect(fechas('10/12/2026', HOY)[0].f).toBe('2026-12-10');
    expect(fechas('05-11-26', HOY)[0].f).toBe('2026-11-05');
    expect(fechas('3/11', HOY)[0].f).toBe('2026-11-03');
    expect(fechas('2026-10-28', HOY)[0].f).toBe('2026-10-28');
    expect(fechas('vence el 9 de diciembre', HOY)[0].f).toBe('2026-12-09');
    expect(fechas('12 nov 2026', HOY)[0].f).toBe('2026-11-12');
  });
  it('un monto con centavos no es una fecha', () => expect(fechas('$ 12.50', HOY).length).toBe(0));
});

describe('entenderDicho', () => {
  it('un gasto simple', () => expect(simple(entenderDicho('Farmacia ocho mil quinientos', HOY))).toEqual([['Farmacia', 8500, 'gasto', null]]));
  it('con relleno', () => expect(simple(entenderDicho('gasté quince mil en el supermercado', HOY))).toEqual([['Supermercado', 15000, 'gasto', null]]));
  it('como lo escribe el teléfono', () => expect(simple(entenderDicho('Nafta $20.000', HOY))).toEqual([['Nafta', 20000, 'gasto', null]]));
  it('dos gastos en una frase', () => expect(simple(entenderDicho('farmacia 8500 y verdulería tres mil doscientos', HOY))).toEqual([['Farmacia', 8500, 'gasto', null], ['Verdulería', 3200, 'gasto', null]]));
  it('un pago con vencimiento', () => expect(simple(entenderDicho('Luz 25 mil, vence el 10', HOY))).toEqual([['Luz', 25000, 'pago', 10]]));
  it('ayer', () => expect(entenderDicho('ayer gasté 4 mil en el kiosco', HOY)[0].f).toBe('2026-11-10'));
  it('sin monto no inventa nada', () => expect(entenderDicho('fui a la farmacia', HOY)).toEqual([]));
  it('treinta y cinco mil no se parte', () => expect(simple(entenderDicho('carnicería treinta y cinco mil', HOY))).toEqual([['Carnicería', 35000, 'gasto', null]]));
});

const BOLETA_LUZ = `EDENOR S.A.
Liquidación de Servicio Público
Cliente: 0012345678
Período 10/2026
Consumo 320 kWh
Subtotal $ 38.120,00
Impuestos $ 7.110,50
TOTAL A PAGAR $ 45.230,50
1er Vencimiento 10/12/2026
2do Vencimiento 24/12/2026 $ 46.900,00`;

const TICKET = `SUPERMERCADOS DIA
Av. Rivadavia 1234
Fecha 09/11/2026 18:42
LECHE ENTERA 1L   1.450,00
PAN LACTAL        2.300,00
YERBA 1KG         5.900,00
TOTAL            9.650,00
EFECTIVO        10.000,00
VUELTO             350,00`;

describe('entenderBoleta', () => {
  it('boleta de servicio: total y primer vencimiento', () => {
    const [b] = entenderBoleta(BOLETA_LUZ, HOY);
    expect([b.n, b.m, b.tipo, b.dia]).toEqual(['Luz', 45231, 'pago', 10]);
  });
  it('ticket de compra: total y comercio', () => {
    const [b] = entenderBoleta(TICKET, HOY);
    expect([b.n, b.m, b.tipo, b.f]).toEqual(['Supermercados dia', 9650, 'gasto', '2026-11-09']);
  });
  it('sin montos no devuelve nada', () => expect(entenderBoleta('Hola, ¿cómo estás?', HOY)).toEqual([]));
});

const RESUMEN_MP = `Resumen de cuenta
Fecha Descripción ID de la operación Valor Saldo
01-11-2026 Pago Farmacity 91234567890 $ -8.500,00 $ 141.500,00
02-11-2026 Transferencia recibida Juan Perez 91234567891 $ 50.000,00 $ 191.500,00
03-11-2026 Pago Carrefour 91234567892 $ -32.410,75 $ 159.089,25
05-11-2026 Pago de servicios Edenor 91234567893 $ -45.230,50 $ 113.858,75
07-11-2026 Rendimientos 91234567894 $ 312,40 $ 114.171,15`;

const RESUMEN_BANCO = `Fecha  Concepto  Débito  Crédito  Saldo
03/11/26 COMPRA TARJ DEBITO COTO 18.250,00 231.750,00
04/11/26 EXTRACCION CAJERO 40.000,00 191.750,00
05/11/26 HABERES ANSES 620.000,00 811.750,00
06/11/26 PAGO SERVICIOS METROGAS 21.300,40 790.449,60`;

describe('entenderTexto', () => {
  it('resumen con signos: separa gastos de ingresos', () => {
    const r = entenderTexto(RESUMEN_MP, HOY);
    expect(r.clase).toBe('resumen');
    expect(r.items.map((x) => [x.n, x.m, !!x.ingreso, x.f])).toEqual([
      ['Pago Farmacity', 8500, false, '2026-11-01'],
      ['Transferencia recibida Juan Perez', 50000, true, '2026-11-02'],
      ['Pago Carrefour', 32411, false, '2026-11-03'],
      ['Pago de servicios Edenor', 45231, false, '2026-11-05'],
      ['Rendimientos', 312, true, '2026-11-07']
    ]);
  });
  it('resumen sin signos: toma el movimiento, no el saldo, y marca los ingresos por palabra', () => {
    const r = entenderTexto(RESUMEN_BANCO, HOY);
    expect(r.items.map((x) => [x.m, !!x.ingreso])).toEqual([[18250, false], [40000, false], [620000, true], [21300, false]]);
  });
  it('una boleta sigue siendo boleta', () => expect(entenderTexto(BOLETA_LUZ, HOY).clase).toBe('boleta'));
  it('un mensaje compartido corto', () => expect(simple(entenderTexto('Pagaste $ 12.000 a Verdulería Don José', HOY).items)).toEqual([['Verdulería Don José', 12000, 'gasto', null]]));
  it('texto sin plata', () => expect(entenderTexto('Nos vemos el sábado', HOY).clase).toBe('nada'));
});

describe('entenderCSV', () => {
  it('planilla con punto y coma y monto con signo', () => {
    const csv = 'Fecha;Descripción;Monto;Saldo\n01/11/2026;Farmacia;-8.500,00;141.500,00\n02/11/2026;"Transferencia; de Ana";50.000,00;191.500,00\n';
    expect(entenderCSV(csv, HOY).map((x) => [x.n, x.m, !!x.ingreso, x.f])).toEqual([['Farmacia', 8500, false, '2026-11-01'], ['Transferencia; de Ana', 50000, true, '2026-11-02']]);
  });
  it('planilla con columnas de débito y crédito', () => {
    const csv = 'Fecha,Concepto,Débito,Crédito,Saldo\n03/11/2026,COTO,18250.00,,231750.00\n05/11/2026,HABERES,,620000.00,851750.00\n';
    expect(entenderCSV(csv, HOY).map((x) => [x.n, x.m, !!x.ingreso])).toEqual([['COTO', 18250, false], ['HABERES', 620000, true]]);
  });
  it('planilla en inglés con punto decimal', () => {
    const csv = 'date,description,amount\n2026-11-03,Supermercado,-1500.50\n';
    expect(entenderCSV(csv, HOY).map((x) => [x.n, x.m, x.f])).toEqual([['Supermercado', 1501, '2026-11-03']]);
  });
});

describe('rubros y servicios', () => {
  const R = [{ id: 'v', n: 'Vivienda (alquiler, expensas)' }, { id: 'c', n: 'Comida' }, { id: 's', n: 'Salud y medicamentos' }, { id: 'sv', n: 'Servicios (luz, gas, internet)' }, { id: 't', n: 'Transporte' }, { id: 'o', n: 'Otros gastos' }];
  it.each([['Supermercado', 'c'], ['Farmacia', 's'], ['Luz', 'sv'], ['Nafta YPF', 't'], ['Expensas', 'v'], ['Regalo para Lucía', 'o'], ['Pago Carrefour', 'c']])('%s → %s', (d, id) => expect(rubroPara(d, R)).toBe(id));
  it('reconoce el servicio de una boleta', () => { expect(servicioDe('METROGAS S.A.')).toBe('Gas'); expect(servicioDe('Resumen Visa')).toBe('Tarjeta de crédito'); expect(servicioDe('Hola')).toBeNull(); });
});
