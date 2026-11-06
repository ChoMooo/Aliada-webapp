/* Tus ahorros, de un vistazo: dónde está tu plata, cuánto en dólares y cuánto no rinde nada.
   Es educativo: muestra tus propios números para que entiendas tu situación; no recomienda en qué invertir. */
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Pencil } from 'lucide-react';
import { useStore } from '../../store';
import { Stagger, Item, Button, Mascot, Legal, Progress } from '../../ui';
import { OceanHero } from '../../ui/ocean';
import { Display, ShineButton } from '../../ui/sunset';
import { Panel, SegBar } from '../../ui/viz';
import { money, pn, fmt } from '../../lib/format';
import { calc } from '../finanzas/calc';
import { partesAhorro } from '../finanzas/Panel';
import { INV_MODULES } from '../../content/learn';
import { modProg } from '../digital/logic';

export default function PanelInversiones() {
  const d = useStore((s) => s.d), c = calc(d);
  const partes = partesAhorro(c);
  const total = c.ahoARS;
  const usd = c.ahoParts.usdARS + d.plata.aho.filter((x) => x.mon === 'USD').reduce((t, x) => t + pn(x.m) * c.cot, 0);
  const pUsd = total ? usd / total : 0;
  const quieta = c.ahoParts.ef;
  const infA = pn(d.plata.inf.inf) / 100;
  const valeEnUnAnio = infA > 0 ? quieta / (1 + infA) : quieta;
  const lec = INV_MODULES.reduce((a, m) => { const p = modProg(d, m); return { n: a.n + p.n, t: a.t + p.t }; }, { n: 0, t: 0 });
  const paraComparar = Math.round(c.ahoParts.ef + c.ahoParts.cu);

  if (total <= 0) return (
    <Stagger className="flex flex-col gap-6">
      <Item><OceanHero mar="invertir" height="min-h-[17rem]"><Display className="text-white">Tus ahorros</Display></OceanHero></Item>
      <Item><Panel>
        <div className="flex items-start gap-4">
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="text-[1.3rem]">Todavía no cargaste tus ahorros</h2>
            <p className="text-muted">Contanos dónde tenés tu plata (plazo fijo, cuentas, efectivo, dólares) y acá vas a ver cómo está repartida.</p>
            <div><ShineButton to="/finanzas/plata/numeros/2" iconRight={<ArrowRight />}>Cargar mis ahorros</ShineButton></div>
          </div>
          <Mascot size={76} act="piensa" />
        </div>
      </Panel></Item>
    </Stagger>
  );

  return (
    <Stagger className="flex flex-col gap-5">
      <Item>
        <OceanHero mar="invertir" height="min-h-[21rem] sm:min-h-[23rem]">
          <p className="text-white/90 text-[1.05rem]">Tus ahorros hoy</p>
          <p className="font-head font-semibold text-white leading-none text-[3.2rem] sm:text-[3.8rem] tracking-[-.02em] [overflow-wrap:anywhere]">{money(total)}</p>
          <p className="text-white/85 mt-3">{c.deu > 0 ? `Con tus deudas descontadas: ${money(c.neto)}` : 'Sin deudas cargadas'}</p>
        </OceanHero>
      </Item>

      <Item><Panel title="Dónde está tu plata" sub={c.ahoParts.usd > 0 && c.cot > 0 ? `Los dólares, pasados a pesos a $ ${fmt(c.cot)}` : undefined}>
        <SegBar parts={partes} format={money} label="Tus ahorros por lugar" />
      </Panel></Item>

      <Item><Panel title="En pesos y en dólares">
        <p className="text-[1.05rem]">De cada <b>$ 100</b> que tenés ahorrados, <b className="num">$ {Math.round(pUsd * 100)}</b> están en dólares.</p>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--viz-track)' }} aria-hidden>
          <div className="h-full rounded-full" style={{ width: `${pUsd * 100}%`, background: 'var(--viz-seq)' }} />
        </div>
        <p className="text-[.92rem] text-muted">Tener una parte en pesos y otra en dólares es algo que muchas personas hacen para no depender de una sola moneda. Cuánto en cada una es una decisión tuya.</p>
      </Panel></Item>

      {quieta > 0 && (
        <Item><Panel title="Plata que no rinde" sub="El efectivo no gana intereses">
          <p className="text-[1.05rem]">Tenés <b className="num">{money(quieta)}</b> en efectivo.</p>
          {infA > 0 && (
            <p className="text-[.98rem]">Con una suba de precios de <b className="num">{fmt(infA * 100, 0)}% por año</b>, dentro de un año esa plata va a comprar lo mismo que <b className="num">{money(valeEnUnAnio)}</b> hoy.</p>
          )}
          <p className="text-[.85rem] text-muted">La inflación sale del simulador de Mi plata; la podés cambiar ahí.</p>
          {paraComparar > 0 && <div><Button variant="secondary" icon={<Calculator />} to={`/inversiones/calculadora?m=${paraComparar}`}>Comparar dónde rendiría</Button></div>}
        </Panel></Item>
      )}

      {lec.t > 0 && (
        <Item><Panel title="Lo que vas aprendiendo">
          <Progress value={lec.n} max={lec.t} label={lec.n ? `${lec.n} de ${lec.t} lecciones` : 'Todavía no empezaste'} right={`${Math.round((lec.n / lec.t) * 100)}%`} size="sm" />
          <Link to="/inversiones" className="inline-flex items-center gap-1.5 font-semibold text-accent underline underline-offset-4 min-h-[2.75rem]">Seguir con las lecciones<ArrowRight className="size-4" /></Link>
        </Panel></Item>
      )}

      <Item className="flex flex-wrap gap-3">
        <Button variant="secondary" icon={<Pencil />} to="/finanzas/plata/numeros/2">Cambiar mis ahorros</Button>
      </Item>
      <Item><Legal>Contenido educativo con tus propios números: no es asesoramiento financiero ni una recomendación de inversión. Tus datos quedan en este dispositivo.</Legal></Item>
    </Stagger>
  );
}
