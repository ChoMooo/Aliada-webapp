/* Mis logros: todo lo que la persona consiguió, con cifras grandes sobre una foto del atardecer.
   Inspirado en las pantallas de perfil (foto arriba, tres cifras, "tu favorito"), con la identidad de Aliada. */
import { Share2, ArrowRight, Trophy } from 'lucide-react';
import { useStore } from '../store';
import { Stagger, Item, Button, Progress, Mascot, BackLink, cx } from '../ui';
import { PhotoBack, PhotoHero, Display, GlassStat, ShineButton } from '../ui/sunset';
import Counter from '../ui/bits/Counter/Counter';
import { misionesPara, progresoMision, AREAS } from '../content/misiones';
import { ALL_MODULES } from '../content/learn';
import { modProg } from './digital/logic';
import { estados } from './finanzas/vencimientos';
import { misionesOrdenadas, fotoMision } from './Misiones';
import { wa } from '../lib/share';

const fecha = (t: number) => new Date(t).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });

export default function Logros() {
  const d = useStore((s) => s.d);
  const nombre = d.perfil.nombre.trim().split(/\s+/)[0] || '';
  const M = misionesPara(d);
  const hechas = M.filter((m) => progresoMision(d, m).fin).map((m) => ({ m, t: d.mis.fin[m.id] || 0 })).sort((a, b) => b.t - a.t);
  const lecciones = Object.values(d.md.lec).filter((x) => x?.done).length;
  const E = estados(d), pagados = E.filter((e) => e.pagado).length;
  const temas = ALL_MODULES.map((m) => ({ m, p: modProg(d, m) })).filter((x) => x.p.n > 0);
  const ult = hechas[0];
  const R = ult ? ult.m.res(d) : null;
  const sig = misionesOrdenadas(d).find((m) => !progresoMision(d, m).fin);
  const texto = `Mis logros en Aliada Digital: ${hechas.length} ${hechas.length === 1 ? 'misión hecha' : 'misiones hechas'} y ${lecciones} ${lecciones === 1 ? 'lección' : 'lecciones'}.` + (ult ? ` La última: "${ult.m.t}".` : '');

  return (
    <Stagger className="flex flex-col gap-7">
      <Item>
        <PhotoHero src="fotos/logros.webp" pos="center 40%" height="min-h-[28rem] sm:min-h-[30rem]">
          <div className="absolute left-4 sm:left-8 top-[calc(1rem)]"><PhotoBack to="/" label="Inicio" /></div>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-white/80">{nombre ? nombre + ', estos son' : 'Estos son'}</p>
              <Display className="text-white">Tus logros</Display>
            </div>
            <Mascot size={78} gesture="hop" say={hechas.length ? '¡Mirá todo lo que hiciste!' : 'Tu primer logro está a un paso.'} side="left" />
          </div>
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <GlassStat label="Misiones" value={<Counter value={hechas.length} fontSize={28} fontWeight={700} locale="es-AR" />} hint={`de ${M.length}`} />
            <GlassStat label="Lecciones" value={<Counter value={lecciones} fontSize={28} fontWeight={700} locale="es-AR" />} hint="hechas" />
            <GlassStat label="Pagos" value={E.length ? <span>{pagados}<span className="text-[1rem] text-white/70">/{E.length}</span></span> : '—'} hint={E.length ? 'del mes' : 'sin cargar'} />
          </div>
        </PhotoHero>
      </Item>

      {ult && R ? (
        <Item>
          <section className="relative overflow-hidden rounded-xl3 text-white isolate shadow-lift">
            <img src={fotoMision(ult.m)} alt="" className="absolute inset-0 -z-[1] size-full object-cover" />
            <div className="absolute inset-0 -z-[1] bg-[linear-gradient(90deg,rgb(7_15_28/.88),rgb(7_15_28/.55)_70%,rgb(7_15_28/.3))]" />
            <div className="p-5 sm:p-6">
              <p className="inline-flex items-center gap-2 text-[.9rem] text-white/80"><Trophy className="size-4 text-glow" />Tu último logro{ult.t ? ' · ' + fecha(ult.t) : ''}</p>
              <h2 className="text-[1.35rem] text-white mt-1 leading-snug">{ult.m.t}</h2>
              {R.big && <p className="font-head font-bold text-glow num text-[2.4rem] leading-none mt-3">{R.big}</p>}
              <p className={cx('text-white/90', R.big ? 'mt-1' : 'mt-2 text-[1.1rem] font-semibold')}>{R.t}</p>
            </div>
          </section>
        </Item>
      ) : (
        <Item>
          <section className="rounded-xl3 border border-line bg-surface p-5 sm:p-6 flex flex-col gap-3">
            <h2 className="text-[1.3rem]">Todavía no terminaste ninguna misión</h2>
            <p className="text-muted">Cada misión te lleva paso a paso y termina en algo concreto. Cuando termines una, aparece acá.</p>
            {sig && <ShineButton block to={'/misiones/' + sig.id} iconRight={<ArrowRight />}>Empezar una misión</ShineButton>}
          </section>
        </Item>
      )}

      {hechas.length > 1 && (
        <Item className="flex flex-col gap-3">
          <h2 className="text-[1.25rem]">Misiones hechas</h2>
          <ul className="rows">
            {hechas.map(({ m, t }) => { const r = m.res(d); return (
              <li key={m.id} className="rowlink flex items-center gap-3.5 p-4">
                <img src={fotoMision(m)} alt="" className="size-12 rounded-xl object-cover shrink-0" />
                <span className="flex-1 min-w-0"><b className="block leading-snug">{m.t}</b><span className="block text-[.86rem] text-muted">{AREAS[m.area]}{t ? ' · ' + fecha(t) : ''}{r.big ? ' · ' + r.big : ''}</span></span>
              </li>
            ); })}
          </ul>
        </Item>
      )}

      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.25rem]">Lo que vas aprendiendo</h2>
        <div className="rounded-xl2 border border-line bg-surface p-4 flex flex-col gap-4">
          {temas.length ? temas.map(({ m, p }) => <Progress key={m.id} value={p.n} max={p.t} label={m.n} right={`${p.n} de ${p.t}`} size="sm" />)
            : <p className="text-muted">Cuando termines tu primera lección, vas a ver acá tu avance en cada tema.</p>}
        </div>
      </Item>

      <Item className="flex flex-wrap gap-3">
        <Button variant="secondary" icon={<Share2 />} href={wa(texto)}>Contárselo a la familia</Button>
        <Button variant="ghost" to="/resumen">Ver la hoja para imprimir</Button>
      </Item>
    </Stagger>
  );
}
