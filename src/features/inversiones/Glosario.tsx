import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader, Card, Stagger, Item } from '../../ui';

export const GLOSARIO: [string, string][] = [
  ['Acción', 'Una pequeña parte de una empresa. Su precio sube y baja según el mercado.'],
  ['ALyC', 'Agente de Liquidación y Compensación: empresa habilitada por la CNV para operar en el mercado en tu nombre (un “broker”).'],
  ['Amortización', 'La devolución del capital de un bono u obligación negociable, en las fechas que indica su prospecto.'],
  ['Bono', 'Un título de deuda de un gobierno: le prestás dinero y te paga intereses y te devuelve el capital.'],
  ['CEDEAR', 'Certificado que representa acciones de empresas del exterior y se compra en Argentina.'],
  ['CNV', 'Comisión Nacional de Valores: el organismo que regula el mercado de capitales en Argentina.'],
  ['Comisión', 'Lo que cobra el agente por cada operación. Se suman derechos de mercado e impuestos.'],
  ['Contado inmediato (CI)', 'Plazo de liquidación en el que la operación se acredita en el día.'],
  ['Cuenta comitente', 'La cuenta donde quedan tus inversiones. Se abre en un banco o en un agente habilitado.'],
  ['Cuotaparte', 'Cada una de las partes en las que se divide un fondo común de inversión.'],
  ['Cupón', 'El interés que paga un bono o una obligación negociable.'],
  ['Diversificar', 'Repartir el dinero en distintas inversiones para no depender de una sola.'],
  ['Dólar MEP', 'Dólares que se obtienen comprando un bono en pesos y vendiéndolo en dólares, de forma legal.'],
  ['Exchange', 'Plataforma para comprar y vender criptomonedas. En Argentina debe estar registrada como PSAV.'],
  ['FCI', 'Fondo común de inversión: junta el dinero de muchas personas y lo administra una sociedad gerente.'],
  ['Inflación', 'La suba general de precios. Hace que el dinero compre menos con el tiempo.'],
  ['Liquidez', 'Qué tan rápido podés convertir una inversión en dinero disponible.'],
  ['Money market', 'Fondo de muy bajo riesgo y rescate inmediato. Lo usan muchas billeteras para que el saldo rinda.'],
  ['Obligación negociable (ON)', 'Un título de deuda de una empresa.'],
  ['Perfil de inversor', 'El resultado de un cuestionario que indica cuánto riesgo aceptás.'],
  ['Plazo de liquidación', 'Cuándo se acredita una compra o venta: contado inmediato o 24 horas.'],
  ['Precio límite', 'El precio máximo (al comprar) o mínimo (al vender) que aceptás en una orden.'],
  ['PSAV', 'Proveedor de Servicios de Activos Virtuales: empresa de cripto registrada en la CNV.'],
  ['Rescate', 'Retirar tu dinero de un fondo común de inversión.'],
  ['Riesgo', 'La posibilidad de que una inversión valga menos de lo que pagaste.'],
  ['Stablecoin', 'Criptomoneda que busca mantener un valor parecido al de una moneda, como el dólar.'],
  ['TEA', 'Tasa efectiva anual: lo que rinde en un año si reinvertís los intereses.'],
  ['Ticker', 'El código corto con el que se identifica un instrumento en el mercado.'],
  ['TNA', 'Tasa nominal anual: la tasa que informa el banco para un plazo fijo.'],
  ['UVA', 'Unidad de Valor Adquisitivo: se actualiza por inflación. Se usa en plazos fijos y créditos.']
];

export default function Glosario() {
  const [q, setQ] = useState('');
  const n = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const list = GLOSARIO.filter(([t, d]) => n(t + ' ' + d).includes(n(q)));
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/inversiones', label: 'Inversiones' }} title="Glosario" lead="Las palabras de las inversiones, en simple." /></Item>
      <Item><label className="relative block"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar una palabra" aria-label="Buscar una palabra" className="!pl-11" /></label></Item>
      <Item className="flex flex-col gap-2.5">
        {list.map(([t, d]) => <Card key={t} className="!py-3.5"><b className="font-head font-semibold text-[1.08rem]">{t}</b><p className="text-[.97rem] text-muted mt-0.5">{d}</p></Card>)}
        {!list.length && <p className="text-muted">No encontramos esa palabra.</p>}
      </Item>
    </Stagger>
  );
}
