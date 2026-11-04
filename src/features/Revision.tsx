/* Revisión del mes: cómo te fue este mes, de un vistazo.
   Foto del atardecer arriba con las cifras clave en vidrio, barras que se dibujan solas por rubro
   (lo planeado contra lo gastado) y una frase que resume el mes. Todo sale de lo que cargó la persona. */
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, CalendarDays, ListChecks } from 'lucide-react';
import { useStore } from '../store';
import { Stagger, Item, Button, BackLink, Mascot, RowList, RowLink, Legal, cx } from '../ui';
import { PhotoBack, PhotoHero, Display, GlassStat, ShineButton } from '../ui/sunset';
import { money, pn } from '../lib/format';
import { calc } from './finanzas/calc';
import { estados } from './finanzas/vencimientos';

const EASE = [0.23, 1, 0.32, 1] as const;
/* Cifra corta para las tarjetas chicas: $ 700 mil, $ 1,2 M */
const corto = (v: number) => (v >= 1e6 ? '$ ' + (v / 1e6).toLocaleString('es-AR', { maximumFractionDigits: 1 }) + ' M' : v >= 1e4 ? '$ ' + Math.round(v / 1e3).toLocaleString('es-AR') + ' mil' : money(v));

export default function Revision() {
  const d = useStore((s) => s.d);
  const reduce = useReducedMotion();
  const hoy = new Date();
  const [ym, setYm] = useState(() => `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`);
  const [y, m] = ym.split('-').map(Number);
  const esEste = ym === `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  const mover = (k: number) => { const dt = new Date(y, m - 1 + k, 1); setYm(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`); };
  const mes = new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'long' });

  const c = calc(d);
  const real = d.plata.seg[ym] || {};
  const rubros = d.plata.gas.filter((g) => g.n || pn(g.m)).map((g) => ({ id: g.id, n: g.n || 'Sin nombre', plan: pn(g.m), gasto: real[g.id] != null && real[g.id] !== '' ? pn(real[g.id]) : null }));
  const anotados = rubros.filter((r) => r.gasto != null);
  const plan = rubros.reduce((t, r) => t + r.plan, 0);
  const gastado = anotados.reduce((t, r) => t + (r.gasto || 0), 0);
  const planAnotados = anotados.reduce((t, r) => t + r.plan, 0);
  const tope = Math.max(1, ...rubros.map((r) => Math.max(r.plan, r.gasto || 0)));
  const E = esEste ? estados(d) : [], pagados = E.filter((e) => e.pagado).length;
  const pasado = anotados.filter((r) => (r.gasto || 0) > r.plan).sort((a, b) => (b.gasto! - b.plan) - (a.gasto! - a.plan))[0];

  /* La frase del mes: solo dice lo que los números muestran */
  const frase = !c.has ? 'Todavía no cargaste tus números. Con eso armamos tu revisión.'
    : !anotados.length ? `Todavía no anotaste lo que gastaste en ${mes}. Anotalo y te muestro cómo vas.`
    : gastado <= planAnotados ? `En lo que anotaste, gastaste ${money(planAnotados - gastado)} menos de lo planeado. ¡Bien!`
    : `En lo que anotaste, te pasaste ${money(gastado - planAnotados)} del plan${pasado ? `, sobre todo en ${pasado.n.toLowerCase()}` : ''}.`;

  return (
    <Stagger className="flex flex-col gap-7">
      <Item>
        <PhotoHero src="fotos/revision.webp" pos="center 55%" height="min-h-[26rem] sm:min-h-[28rem]">
          <div className="absolute left-4 sm:left-8 top-4"><PhotoBack to="/" label="Inicio" /></div>
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={() => mover(-1)} aria-label="Mes anterior" className="press glass-chip justify-center size-11 !p-0"><ChevronLeft className="size-5" /></button>
            <span className="text-white/85 text-[.95rem]">Revisión del mes</span>
            <button type="button" onClick={() => mover(1)} aria-label="Mes siguiente" className="press glass-chip justify-center size-11 !p-0"><ChevronRight className="size-5" /></button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={ym} initial={{ opacity: 0, transform: 'translateY(8px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease: EASE }}>
              <Display className="text-white capitalize mt-3">{mes}<span className="text-white/60 text-[.5em] not-italic font-body ml-2">{y}</span></Display>
            </motion.div>
          </AnimatePresence>
          <p className="text-white/90 text-[1.05rem] mt-2 max-w-[32rem]">{frase}</p>
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <GlassStat small label="Planeado" value={plan ? corto(plan) : '—'} hint="por mes" />
            <GlassStat small label="Gastado" value={anotados.length ? corto(gastado) : '—'} hint={anotados.length ? `${anotados.length} de ${rubros.length} rubros` : 'sin anotar'} />
            <GlassStat label="Pagos" value={E.length ? <span>{pagados}<span className="text-[1rem] text-white/70">/{E.length}</span></span> : '—'} hint={esEste ? (E.length ? 'pagados' : 'sin cargar') : 'solo este mes'} />
          </div>
        </PhotoHero>
      </Item>

      {rubros.length ? (
        <Item className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-[1.3rem]">Rubro por rubro</h2>
            <div className="flex items-center gap-3 text-[.85rem] text-muted">
              <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-full bg-line" />Plan</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-full bg-accent" />Gastado</span>
            </div>
          </div>
          <div className="rounded-xl3 border border-line bg-surface p-4 sm:p-5 flex flex-col gap-5">
            {rubros.map((r, i) => {
              const over = r.gasto != null && r.gasto > r.plan;
              return (
                <div key={r.id + ym} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold leading-snug min-w-0">{r.n}</span>
                    <span className={cx('num text-[.92rem] whitespace-nowrap', over ? 'text-bad font-bold' : 'text-muted')}>{r.gasto != null ? money(r.gasto) : 'sin anotar'}<span className="text-muted font-normal"> / {money(r.plan)}</span></span>
                  </div>
                  <div className="relative h-3.5 rounded-full bg-sunk overflow-hidden">
                    <motion.span className="absolute inset-y-0 left-0 rounded-full bg-line" style={{ width: `${(r.plan / tope) * 100}%`, transformOrigin: 'left' }}
                      initial={reduce ? false : { transform: 'scaleX(0)' }} animate={{ transform: 'scaleX(1)' }} transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: EASE }} />
                    {r.gasto != null && (
                      <motion.span className={cx('absolute inset-y-[3px] left-[3px] rounded-full', over ? 'bg-coral' : 'bg-accent')} style={{ width: `calc(${(Math.min(r.gasto, tope) / tope) * 100}% - 6px)`, transformOrigin: 'left' }}
                        initial={reduce ? false : { transform: 'scaleX(0)' }} animate={{ transform: 'scaleX(1)' }} transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease: EASE }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div><ShineButton to="/finanzas/plata/seguimiento" iconRight={<ArrowRight />}>{anotados.length ? 'Seguir anotando' : 'Anotar lo que gasté'}</ShineButton></div>
        </Item>
      ) : (
        <Item>
          <section className="rounded-xl3 border border-line bg-surface p-5 sm:p-6 flex items-start gap-4">
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-[1.3rem]">Primero, tus números</h2>
              <p className="text-muted">Cargá tus ingresos y gastos de cada mes. Tarda unos 5 minutos y después la revisión se arma sola.</p>
              <div><ShineButton to="/finanzas/plata/numeros/0" iconRight={<ArrowRight />}>Cargar mis números</ShineButton></div>
            </div>
            <Mascot size={70} gesture="nod" />
          </section>
        </Item>
      )}

      <Item>
        <RowList>
          <RowLink to="/finanzas/vencimientos" icon={<CalendarDays />} title="Mis vencimientos" sub={E.length ? `${pagados} de ${E.length} pagos hechos este mes` : 'Anotá qué pagás y cuándo'} />
          <RowLink to="/finanzas/plata/numeros/0" icon={<ListChecks />} title="Mis números" sub="Cambiar ingresos o gastos planeados" />
        </RowList>
      </Item>
      {c.has && c.ing > 0 && <Item><Button variant="ghost" to="/finanzas/plata/resultado">Ver cuánto te queda cada mes</Button></Item>}
      <Item><Legal>Se calcula solo con lo que anotaste vos. Los datos quedan en este dispositivo.</Legal></Item>
    </Stagger>
  );
}
