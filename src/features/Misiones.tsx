/* Misiones: de una situación concreta a un resultado que la persona se lleva.
   - MisionCard: la tarjeta que se ve en el Inicio y en la lista
   - MisionesPage: todas las misiones por área
   - MisionPage: la misión con sus pasos y, al final, el resultado
   - VolverMision: botón flotante para volver a la misión desde una herramienta */
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Clock, Share2, X, Wallet, FileCheck2, Smartphone, HeartPulse, ChevronRight } from 'lucide-react';
import { useStore, mut } from '../store';
import { PageHeader, Hero, Button, Stagger, Item, Progress, Spot, cx } from '../ui';
import { MISIONES, MISION, AREAS, misionesPara, pasoHecho, progresoMision, minutos, type Mision, type Area } from '../content/misiones';
import SpringCheck from '../ui/bits/SpringCheck/SpringCheck';
import StatusMark from '../ui/bits/StatusMark/StatusMark';
import ClickSpark from '../ui/bits/ClickSpark/ClickSpark';
import { wa } from '../lib/share';

const AREA_ICON: Record<Area, React.ReactNode> = { plata: <Wallet />, tramites: <FileCheck2 />, celular: <Smartphone />, bienestar: <HeartPulse /> };
const AREA_TONE: Record<Area, string> = { plata: 'bg-mint text-teal', tramites: 'bg-skysoft text-sky', celular: 'bg-violetsoft text-violet', bienestar: 'bg-ambersoft text-amber' };

/* ---------- Tarjeta ---------- */
export function MisionCard({ m }: { m: Mision }) {
  const d = useStore((s) => s.d), p = progresoMision(d, m);
  return (
    <Link to={'/misiones/' + m.id} className="press block rounded-xl2">
      <Spot className="h-full">
        <div className="p-4 flex gap-3.5 items-start">
          <span className={cx('grid place-items-center size-11 rounded-xl shrink-0 [&_svg]:size-5', AREA_TONE[m.area])}>{AREA_ICON[m.area]}</span>
          <span className="flex-1 min-w-0 flex flex-col gap-1">
            <b className="text-[1.08rem] leading-snug">{m.t}</b>
            <span className="text-[.88rem] text-muted leading-snug">{m.tendras}</span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[.82rem]">
              {p.fin ? <span className="inline-flex items-center gap-1 font-semibold text-teal"><Check className="size-4" />Hecha</span>
                : p.n > 0 ? <span className="font-semibold text-accent num">{p.n} de {p.t} pasos</span>
                  : <span className="inline-flex items-center gap-1 text-muted"><Clock className="size-3.5" />{minutos(m)} · {p.t} {p.t === 1 ? 'paso' : 'pasos'}</span>}
            </span>
          </span>
          <ChevronRight className="size-5 text-muted shrink-0 mt-3" />
        </div>
        {p.n > 0 && !p.fin && <div className="px-4 pb-3 -mt-1"><Progress value={p.n} max={p.t} size="sm" /></div>}
      </Spot>
    </Link>
  );
}

/** Orden para el Inicio: primero las empezadas, después las que no, y al final las hechas */
export function misionesOrdenadas(d: ReturnType<typeof useStore.getState>['d']) {
  const L = misionesPara(d).map((m) => ({ m, p: progresoMision(d, m) }));
  const enCurso = L.filter((x) => x.p.n > 0 && !x.p.fin), hechas = L.filter((x) => x.p.fin);
  /* Las que faltan empezar, alternando áreas para que se vea todo lo que se puede resolver */
  const resto = L.filter((x) => x.p.n === 0 && !x.p.fin), orden: Area[] = ['plata', 'celular', 'tramites', 'bienestar'], mezcla: typeof L = [];
  while (mezcla.length < resto.length) for (const a of orden) { const i = resto.findIndex((x) => x.m.area === a && !mezcla.includes(x)); if (i >= 0) mezcla.push(resto[i]); }
  return [...enCurso, ...mezcla, ...hechas].map((x) => x.m);
}

/* ---------- Todas las misiones ---------- */
export function MisionesPage() {
  const d = useStore((s) => s.d), L = misionesPara(d);
  const hechas = L.filter((m) => progresoMision(d, m).fin).length;
  return (
    <Stagger className="flex flex-col gap-7">
      <Item><PageHeader back={{ to: '/', label: 'Inicio' }} title="Misiones" lead="Elegí una situación y la app te lleva paso a paso hasta resolverla. Cada misión termina en algo concreto que te llevás." /></Item>
      {hechas > 0 && <Item><p className="text-[.95rem] text-muted num">Llevás {hechas} de {L.length} misiones hechas.</p></Item>}
      {(Object.keys(AREAS) as Area[]).map((a) => {
        const M = L.filter((m) => m.area === a);
        if (!M.length) return null;
        return (
          <Item key={a} className="flex flex-col gap-3">
            <h2 className="text-[1.25rem]">{AREAS[a]}</h2>
            <div className="grid gap-3 sm:grid-cols-2">{M.map((m) => <MisionCard key={m.id} m={m} />)}</div>
          </Item>
        );
      })}
    </Stagger>
  );
}

/* ---------- Una misión ---------- */
export function MisionPage() {
  const { id = '' } = useParams();
  const m = MISION(id);
  const d = useStore((s) => s.d);
  const nav = useNavigate();
  const p = m ? progresoMision(d, m) : null;

  /* Al terminar por primera vez: se guarda la fecha y deja de mostrarse el botón de volver */
  useEffect(() => {
    if (!m || !p) return;
    if (p.fin && !d.mis.fin[m.id]) mut((x) => { x.mis.fin[m.id] = Date.now(); });
    if (d.mis.act === m.id && p.fin) mut((x) => { x.mis.act = ''; });
  }, [m, p?.fin]);

  if (!m || !p) return <Navigate to="/misiones" replace />;
  const actual = m.pasos.findIndex((x) => !pasoHecho(d, m, x));
  const ir = (go: string) => { mut((x) => { x.mis.act = m.id; x.mis.ck[m.id + ':_'] = 1; }); nav(go); };
  const marcar = (pid: string, v: boolean) => mut((x) => { if (v) x.mis.ck[m.id + ':' + pid] = 1; else delete x.mis.ck[m.id + ':' + pid]; });
  const R = m.res(d);
  const otras = misionesPara(d).filter((x) => x.id !== m.id && x.area === m.area && !progresoMision(d, x).fin).slice(0, 2);

  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader back={{ to: '/misiones', label: 'Misiones' }} title={m.t} lead={m.para} /></Item>
      <Item>
        <Hero>
          <p className="text-onbrand/80 text-[.98rem]">Al terminar vas a tener</p>
          <p className="text-[1.35rem] font-bold text-onbrand leading-snug mt-1">{m.tendras}</p>
          <p className="mt-3 inline-flex items-center gap-2 text-[.92rem] text-onbrand/85"><Clock className="size-4" />Unos {minutos(m)} · {p.t} {p.t === 1 ? 'paso' : 'pasos'}</p>
          <div className="mt-4"><Progress value={p.n} max={p.t} tone="glow" right={<span className="text-onbrand/85">{p.n} de {p.t}</span>} /></div>
        </Hero>
      </Item>

      <Item>
        <ol className="flex flex-col gap-0" aria-label="Pasos de la misión">
          {m.pasos.map((x, i) => {
            const ok = pasoHecho(d, m, x), auto = !!x.done?.(d), now = i === actual, last = i === m.pasos.length - 1;
            return (
              <li key={x.id} className="relative flex gap-4">
                {/* Línea que une los pasos */}
                {!last && <span className={cx('absolute left-[1.15rem] top-11 bottom-0 w-[2px] rounded-full', ok ? 'bg-teal/50' : 'bg-line')} aria-hidden />}
                <span className="relative z-[1] shrink-0 mt-1">
                  {ok ? <span className="grid place-items-center size-[2.3rem] rounded-full bg-mint"><StatusMark status="done" size={26} doneColor="rgb(var(--teal))" strike={false} /></span>
                    : <span className={cx('grid place-items-center size-[2.3rem] rounded-full border-2 font-bold num', now ? 'border-accent text-accent bg-surface' : 'border-line text-muted bg-surface')}>{i + 1}</span>}
                </span>
                <div className={cx('flex-1 min-w-0 pb-6', now && 'pb-7')}>
                  <div className={cx('rounded-xl2 p-4 flex flex-col gap-3 transition-colors', now ? 'bg-surface border-[1.5px] border-accent/60 shadow-card' : 'bg-surface/60 border border-line')}>
                    <div>
                      <b className={cx('block text-[1.06rem] leading-snug', ok && 'text-muted')}>{x.t}</b>
                      <span className="block text-[.88rem] text-muted mt-0.5">{x.s}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Button size={now ? 'md' : 'sm'} variant={now ? 'primary' : 'secondary'} onClick={() => ir(x.go)} iconRight={<ArrowRight />}>{ok ? 'Ver de nuevo' : now ? 'Empezar' : 'Ir'}</Button>
                      {!auto && (
                        <SpringCheck label="Ya lo hice" checked={ok} onChange={(v) => marcar(x.id, v)} color="rgb(var(--teal))" fillColor="rgb(var(--teal))" checkColor="#fff" boxSize={26} fontSize={16} strike="none" />
                      )}
                      {auto && ok && <span className="inline-flex items-center gap-1 text-[.85rem] text-teal font-semibold"><Check className="size-4" />Hecho</span>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Item>

      <AnimatePresence>
        {p.fin && (
          <Item>
            <motion.section initial={{ opacity: 0, transform: 'translateY(12px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
              <Hero>
                <div className="flex items-center gap-3"><StatusMark status="done" size={30} doneColor="#34D4A6" strike={false} /><b className="text-onbrand text-[1.1rem]">¡Misión hecha!</b></div>
                {R.big && <p className="font-head font-bold text-glow num leading-none mt-4 text-[clamp(2.2rem,10vw,3.2rem)]">{R.big}</p>}
                <p className={cx('text-onbrand font-semibold', R.big ? 'text-[1.15rem] mt-1' : 'text-[1.4rem] mt-3')}>{R.t}</p>
                {R.s && <p className="text-onbrand/85 mt-3">{R.s}</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  <ClickSpark sparkColor={['#34D4A6', '#9fb8ff', '#ffffff']} sparkCount={10} sparkRadius={28}>
                    <Button variant="glow" href={wa(`Terminé la misión "${m.t}" en Aliada Digital.${R.big ? ' ' + R.big + ' ' + R.t + '.' : ' ' + R.t + '.'}`)} icon={<Share2 />}>Contárselo a alguien</Button>
                  </ClickSpark>
                  <Button variant="onbrand" to="/resumen">Ver en Mi resumen</Button>
                </div>
              </Hero>
            </motion.section>
          </Item>
        )}
      </AnimatePresence>

      {otras.length > 0 && (
        <Item className="flex flex-col gap-3">
          <h2 className="text-[1.2rem]">{p.fin ? 'Seguí con otra' : 'Otras misiones de ' + AREAS[m.area].toLowerCase()}</h2>
          <div className="grid gap-3 sm:grid-cols-2">{otras.map((x) => <MisionCard key={x.id} m={x} />)}</div>
        </Item>
      )}
    </Stagger>
  );
}

/* ---------- Volver a la misión (flotante, mientras se usa una herramienta) ---------- */
export function VolverMision() {
  const act = useStore((s) => s.d.mis.act);
  const { pathname } = useLocation();
  const m = act ? MISION(act) : null;
  const show = !!m && !pathname.startsWith('/misiones') && pathname !== '/';
  return (
    <AnimatePresence>
      {show && m && (
        <motion.div className="no-print fixed left-1/2 bottom-[calc(5.6rem+env(safe-area-inset-bottom))] lg:bottom-6 z-40 w-[min(26rem,calc(100vw-2rem))]"
          initial={{ opacity: 0, transform: 'translate(-50%, 12px)' }} animate={{ opacity: 1, transform: 'translate(-50%, 0px)' }} exit={{ opacity: 0, transform: 'translate(-50%, 12px)' }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          <div className="flex items-center gap-1 rounded-full bg-ink text-bg shadow-lift pl-1.5 pr-1.5 py-1.5">
            <Link to={'/misiones/' + m.id} className="press flex-1 min-w-0 flex items-center gap-2.5 rounded-full px-3 py-1.5">
              <span className="grid place-items-center size-8 rounded-full bg-glow text-[#06142a] shrink-0"><ArrowRight className="size-4 rotate-180" /></span>
              <span className="min-w-0"><span className="block text-[.75rem] opacity-75 leading-tight">Volver a tu misión</span><b className="block text-[.92rem] leading-tight truncate">{m.t}</b></span>
            </Link>
            <button type="button" onClick={() => mut((x) => { x.mis.act = ''; })} aria-label="Ocultar" className="press grid place-items-center size-10 rounded-full hover:bg-bg/10 shrink-0"><X className="size-5" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { MISIONES };
