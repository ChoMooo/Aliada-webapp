/* Tu panel de plata: los resultados de todo lo que cargaste, de un vistazo.
   Arriba la cifra que importa (cuánto te sobra o te falta por mes); después de dónde sale, adónde va,
   qué tenés guardado y cómo vienen los meses. Todo sale de Mis números y del Seguimiento; nada se envía a ningún lado. */
import { Link } from 'react-router-dom';
import { ArrowRight, Pencil, CalendarDays, Share2 } from 'lucide-react';
import { useStore } from '../../store';
import { Stagger, Item, Button, Mascot, Legal } from '../../ui';
import { OceanHero } from '../../ui/ocean';
import { Display, ShineButton } from '../../ui/sunset';
import { Panel, Tile, Meter, SegBar, RankBars, MonthColumns } from '../../ui/viz';
import { money, pn, fmt } from '../../lib/format';
import { wa } from '../../lib/share';
import { calc } from './calc';

/* $ 1,2 M · $ 850 mil · $ 9.500: cifras cortas para las tarjetas chicas */
export const corto = (v: number) => {
  const a = Math.abs(v), s = v < 0 ? '−' : '';
  return a >= 1e6 ? `${s}$ ${(a / 1e6).toLocaleString('es-AR', { maximumFractionDigits: 1 })} M` : a >= 1e4 ? `${s}$ ${Math.round(a / 1e3).toLocaleString('es-AR')} mil` : money(v);
};
const MESES = (n: number) => { const o: string[] = []; const t = new Date(); for (let i = n - 1; i >= 0; i--) { const d = new Date(t.getFullYear(), t.getMonth() - i, 1); o.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); } return o; };
const nombreMes = (ym: string) => { const [y, m] = ym.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'long' }); };

/** Partes de los ahorros, en pesos (mismo orden en Finanzas e Inversiones: el color sigue a cada lugar) */
export function partesAhorro(c: ReturnType<typeof calc>) {
  return [
    { k: 'pf', n: 'Plazo fijo', v: c.ahoParts.pf },
    { k: 'cu', n: 'Cuentas y billeteras', v: c.ahoParts.cu },
    { k: 'ef', n: 'Efectivo', v: c.ahoParts.ef },
    { k: 'usd', n: 'Dólares', v: c.ahoParts.usdARS },
    { k: 'ot', n: 'Otros ahorros', v: c.ahoParts.otros }
  ];
}

export default function PanelFinanzas() {
  const d = useStore((s) => s.d), c = calc(d);
  const nombre = d.perfil.nombre.trim().split(/\s+/)[0] || '';

  if (!c.has) return (
    <Stagger className="flex flex-col gap-6">
      <Item><OceanHero mar="finanzas" height="min-h-[17rem]"><Display className="text-white">Tu panel</Display></OceanHero></Item>
      <Item><Panel>
        <div className="flex items-start gap-4">
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="text-[1.3rem]">Primero, tus números</h2>
            <p className="text-muted">Cargá lo que entra y lo que sale cada mes. En unos 5 minutos este panel se arma solo con tus resultados.</p>
            <div><ShineButton to="/finanzas/plata/numeros/0" iconRight={<ArrowRight />}>Cargar mis números</ShineButton></div>
          </div>
          <Mascot size={76} act="piensa" />
        </div>
      </Panel></Item>
    </Stagger>
  );

  const gastos = d.plata.gas.filter((g) => pn(g.m) > 0).map((g) => ({ k: g.id, n: g.n || 'Sin nombre', v: pn(g.m) }));
  const pct = c.ing > 0 ? c.gas / c.ing : 1;
  const st = pct <= 0.8 ? 'good' : pct <= 1 ? 'warn' : 'bad';
  const partes = partesAhorro(c);
  const meses = c.gas > 0 ? Math.max(c.neto, 0) / c.gas : 0;
  const hist = MESES(6).map((ym) => {
    const r = d.plata.seg[ym] || {}, vals = Object.values(r).filter((x) => x !== '');
    return vals.length ? { k: ym, n: nombreMes(ym), v: vals.reduce((t, x) => t + pn(x), 0) } : null;
  }).filter(Boolean) as { k: string; n: string; v: number }[];
  const sobra = c.brecha >= 0;
  const texto = `Mi panel en Aliada Digital: entran ${money(c.ing)} y salen ${money(c.gas)} por mes. ${sobra ? 'Me sobran' : 'Me faltan'} ${money(Math.abs(c.brecha))}.`;

  return (
    <Stagger className="flex flex-col gap-5">
      {/* La cifra que importa, sobre el mar de Finanzas */}
      <Item>
        <OceanHero mar="finanzas" height="min-h-[22rem] sm:min-h-[24rem]">
          <p className="text-white/85">{nombre ? `${nombre}, este es tu panel` : 'Tu panel'}</p>
          <p className="text-white/90 mt-3 text-[1.05rem]">Cada mes {sobra ? 'te sobran' : 'te faltan'}</p>
          <p className="font-head font-semibold text-white leading-none text-[3.2rem] sm:text-[3.8rem] tracking-[-.02em] [overflow-wrap:anywhere]">{money(Math.abs(c.brecha))}</p>
          <p className="text-white/85 mt-3 num">Entran {money(c.ing)} · salen {money(c.gas)}</p>
        </OceanHero>
      </Item>

      <Item className="grid grid-cols-2 gap-3">
        <Tile label="Entra por mes" value={corto(c.ing)} />
        <Tile label="Sale por mes" value={corto(c.gas)} />
        <Tile label="Ahorros netos" value={corto(c.neto)} hint="Ahorros menos deudas" tone={c.neto < 0 ? 'bad' : undefined} />
        <Tile label="Deudas" value={c.deu ? corto(c.deu) : 'Ninguna'} />
      </Item>

      <Item><Panel title="Lo que gastás de lo que entra">
        <Meter value={c.gas} max={c.ing || c.gas} status={st}
          label={c.ing ? `${Math.round(pct * 100)}% de tus ingresos` : 'No cargaste ingresos'}
          right={st === 'good' ? 'Con margen' : st === 'warn' ? 'Justo' : 'Te pasás'} />
        <p className="text-[.95rem] text-muted">
          {st === 'good' ? `Te queda un margen de ${money(c.brecha)} por mes para ahorrar o para un objetivo.`
            : st === 'warn' ? 'Gastás casi todo lo que entra. Mirá abajo en qué rubros se va la mayor parte.'
            : `Los gastos superan a los ingresos: la diferencia, ${money(-c.brecha)} por mes, sale de tus ahorros.`}
        </p>
      </Panel></Item>

      {gastos.length > 0 && (
        <Item><Panel title="Adónde va tu plata" sub="Lo que planeaste gastar por mes, de mayor a menor">
          <RankBars rows={gastos} format={money} sub={(v) => c.gas ? `${Math.round((v / c.gas) * 100)}%` : ''} />
        </Panel></Item>
      )}

      {c.ahoARS > 0 && (
        <Item><Panel title="Tus ahorros" sub={c.cot > 0 && c.ahoParts.usd > 0 ? `Los dólares, a $ ${fmt(c.cot)} cada uno (la cotización que pusiste)` : 'En pesos'}
          right={<b className="font-head text-[1.25rem] whitespace-nowrap">{corto(c.ahoARS)}</b>}>
          <SegBar parts={partes} format={money} label="Tus ahorros por lugar" />
        </Panel></Item>
      )}

      <Item><Panel title="Tu colchón" sub="Cuántos meses de gastos cubren tus ahorros netos">
        <Meter value={meses} max={24} status={meses >= 12 ? 'good' : meses >= 3 ? 'warn' : 'bad'}
          label={meses >= 1 ? `${fmt(meses, meses < 10 ? 1 : 0)} ${meses >= 1 && meses < 2 ? 'mes' : 'meses'}` : 'Menos de un mes'}
          right="Meta: 24 meses" />
        <p className="text-[.95rem] text-muted">Una reserva de 2 años de gastos da tranquilidad ante imprevistos.</p>
      </Panel></Item>

      <Item><Panel title="Mes a mes" sub="Lo que anotaste como gastado en el Seguimiento">
        {hist.length >= 2 ? (
          <MonthColumns rows={hist} format={money} plan={c.gas} planLabel="Plan" />
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-muted">Cuando anotes lo que gastás en al menos dos meses, acá vas a ver cómo cambian.</p>
            <div><Button variant="secondary" size="sm" to="/finanzas/plata/seguimiento" icon={<CalendarDays />}>Anotar lo de este mes</Button></div>
          </div>
        )}
      </Panel></Item>

      <Item className="flex flex-wrap gap-3">
        <Button variant="secondary" icon={<Pencil />} to="/finanzas/plata/numeros/0">Cambiar mis números</Button>
        <Button variant="secondary" icon={<Share2 />} href={wa(texto)}>Compartir</Button>
        <Link to="/revision" className="inline-flex items-center gap-1.5 min-h-[2.9rem] px-2 font-semibold text-accent underline underline-offset-4">Revisión del mes<ArrowRight className="size-4" /></Link>
      </Item>
      <Item><Legal>Se calcula solo con lo que cargaste vos. Tus datos quedan en este dispositivo.</Legal></Item>
    </Stagger>
  );
}
