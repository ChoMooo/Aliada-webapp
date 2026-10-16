import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, UserRound, Lightbulb, Scale, FileText, Calculator, Megaphone, CalendarCheck, BarChart3, PlayCircle, Check } from 'lucide-react';
import { useStore, mut, type Data } from '../../store';
import { PageHeader, Card, Hero, Button, Field, TextInput, TextArea, Progress, Note, RowLink, Stagger, Item, Tag, Chips, Bullets, Disclosure, cx } from '../../ui';
import { toast } from '../../ui/toast';
import { OP, OPS, RUBROS, SKILLS, GUSTOS, RECURSOS, REC_N, INV_T, DIF_T, HRS } from '../../content/finanzas';
import { ranking, evalOp, nivel, perfilVacio, taSiguiente, taPlanProg, wDefault, type Ev } from './calc';

export const TBACK = { to: '/finanzas/talento', label: 'Mi talento' };
export const elegir = (id: string) => mut((d) => { d.ta.sel = id; if (!d.ta.w[id]) d.ta.w[id] = wDefault(OP(id), d.perfil.nombre); });
const AMB: Record<string, string> = { h: 'Desde casa', o: 'Por internet', s: 'Presencial' };

function Metrics({ o }: { o: any }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Tag>Inversión: {INV_T[o.inv].toLowerCase()}</Tag><Tag>{DIF_T[o.dif - 1]}</Tag><Tag>~{o.hs} h/semana</Tag><Tag>Empezar en {o.ini}</Tag>
    </div>
  );
}

export function TalHub() {
  const d = useStore((s) => s.d), nx = taSiguiente(d), o = d.ta.sel ? OP(d.ta.sel) : null, pp = taPlanProg(d);
  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader back={{ to: '/finanzas', label: 'Finanzas' }} kicker="Finanzas" title="Mi talento, mi ingreso" lead="Descubrí una oportunidad realista, definí tu oferta y salí con un plan de 30 días." /></Item>
      <Item><Hero>
        {!d.ta.done ? (<>
          <div className="text-glow font-bold text-[.85rem]">Para empezar</div>
          <h2 className="text-[1.6rem] text-onbrand mt-1">Contanos lo que sabés y lo que tenés</h2>
          <p className="opacity-85 mt-1">Un perfil corto —podés saltear lo que quieras— y te mostramos oportunidades concretas, con sus motivos y sus riesgos.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button variant="glow" to="/finanzas/talento/perfil" iconRight={<ArrowRight />}>Completar mi perfil</Button><Button variant="onbrand" to="/finanzas/talento/ideas">Ver todas</Button></div>
        </>) : (<>
          <div className="text-glow font-bold text-[.85rem]">{o ? 'Tu oportunidad elegida' : 'Tu próximo paso'}</div>
          {o && <h2 className="text-[1.5rem] text-onbrand mt-1 leading-snug">{o.n}</h2>}
          <p className="opacity-90 mt-2">{o && <b>Siguiente: </b>}{nx?.txt ?? 'Todo al día'}</p>
          {o && pp.t > 0 && <div className="mt-4 max-w-sm"><Progress tone="glow" value={pp.n} max={pp.t} label={<span className="text-onbrand">Plan de 30 días</span>} right={<span className="text-onbrand/80">{pp.n} de {pp.t}</span>} /></div>}
          <div className="mt-5 flex flex-wrap gap-3">{nx && <Button variant="glow" to={nx.go} iconRight={<ArrowRight />}>Continuar</Button>}<Button variant="onbrand" to="/finanzas/talento/ideas">{o ? 'Cambiar oportunidad' : 'Ver oportunidades'}</Button></div>
        </>)}
      </Hero></Item>
      <Item className="flex flex-col gap-3">
        <RowLink to="/finanzas/talento/perfil" tone="amber" icon={<UserRound />} title="Mi perfil" sub={d.ta.done ? 'Revisá o corregí tus respuestas' : 'Experiencia, habilidades, tiempo y recursos'} />
        <RowLink to="/finanzas/talento/ideas" tone="amber" icon={<Lightbulb />} title="Mis oportunidades" sub="Recomendaciones con motivos y riesgos" />
        <RowLink to="/finanzas/talento/comparar" tone="amber" icon={<Scale />} title="Comparar oportunidades" sub={d.ta.cmp.length ? d.ta.cmp.length + ' en la comparación' : 'Inversión, dificultad, tiempo y clientes'} />
        <RowLink to="/finanzas/talento/oferta" tone="amber" icon={<FileText />} title="Mi oferta" sub="Qué ofrecés, a quién y cómo cobrás" />
        <RowLink to="/finanzas/talento/precio" tone="amber" icon={<Calculator />} title="Precios y costos" sub="Tu precio inicial, con todos los cálculos a la vista" />
        <RowLink to="/finanzas/talento/materiales" tone="amber" icon={<Megaphone />} title="Material para vender" sub="Propuesta, presupuesto, mensajes y preguntas frecuentes" />
        <RowLink to="/finanzas/talento/plan" tone="amber" icon={<CalendarCheck />} title="Plan de 30 días" sub={pp.t ? `${pp.n} de ${pp.t} tareas` : 'Tareas semanales a tu medida'} />
        <RowLink to="/finanzas/talento/seguimiento" tone="amber" icon={<BarChart3 />} title="Seguimiento" sub="Contactos, consultas, trabajos y qué mejorar" />
      </Item>
      <Item><Note tone="info">Las estimaciones son orientativas y no garantizan ingresos. Antes de empezar, verificá tus obligaciones impositivas, comerciales y previsionales (guía “Trabajar siendo jubilado/a” en Mis trámites).</Note></Item>
    </Stagger>
  );
}

function Sec({ n: num, t, hint, children }: { n: number; t: string; hint?: string; children: React.ReactNode }) {
  return <Card className="flex flex-col gap-4"><div><div className="text-amber font-bold text-[.82rem]">{num} de 6</div><h2 className="text-[1.3rem]">{t}</h2>{hint && <p className="text-muted text-[.9rem] mt-0.5">{hint}</p>}</div>{children}</Card>;
}
export function Perfil() {
  const d = useStore((s) => s.d), P = d.ta.P, nav = useNavigate();
  const set = (k: keyof Data['ta']['P']) => (v: any) => mut((x) => { (x.ta.P as any)[k] = v; });
  const n = ranking(d).length;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={TBACK} kicker="Mi talento" title="Mi perfil" lead={<>Respondé en el orden que quieras. <b className="text-ink">Podés saltear lo que no quieras contestar</b> y corregirlo cuando quieras.</>} />
      <Sec n={1} t="Tu experiencia laboral" hint="¿En qué rubros trabajaste? Marcá todos los que quieras.">
        <Chips multi options={RUBROS as any} value={P.ex} onChange={set('ex')} />
        <Field label="¿Qué hacías en tu trabajo? (opcional)" htmlFor="x1"><TextArea id="x1" value={P.exTxt} onChange={set('exTxt')} placeholder="Ej: atendía clientes, llevaba cuentas, enseñaba matemática…" className="!min-h-[5rem]" /></Field>
      </Sec>
      <Sec n={2} t="Lo que sabés hacer" hint="Habilidades prácticas, aunque no las hayas usado en un trabajo.">
        <Chips multi options={SKILLS as any} value={P.sk} onChange={set('sk')} />
        <Field label="¿En qué te piden ayuda tus conocidos? (opcional)" htmlFor="x2"><TextInput id="x2" value={P.ayuda} onChange={set('ayuda')} placeholder="Ej: arreglar cosas, ordenar papeles, recetas…" /></Field>
      </Sec>
      <Sec n={3} t="Lo que disfrutás"><Chips multi options={GUSTOS as any} value={P.gu} onChange={set('gu')} /></Sec>
      <Sec n={4} t="Recursos con los que contás" hint="Lo que ya tenés y podrías usar."><Chips multi options={RECURSOS as any} value={P.rec} onChange={set('rec')} /></Sec>
      <Sec n={5} t="Tiempo, lugar e inversión">
        <Field label="¿Cuánto tiempo por semana podrías dedicarle?"><Chips options={[['1', 'Hasta 5 horas'], ['2', '5 a 10 horas'], ['3', '10 a 20 horas'], ['4', 'Más de 20']]} value={P.tiempo} onChange={set('tiempo')} /></Field>
        <Field label="¿Dónde preferís trabajar?"><Chips options={[['h', 'En mi casa'], ['o', 'Por internet'], ['s', 'Saliendo, presencial'], ['*', 'Me da igual']]} value={P.amb} onChange={set('amb')} /></Field>
        <Field label="¿Cómo te llevás con internet y el celular?"><Chips options={[['0', 'Casi no los uso'], ['1', 'WhatsApp y poco más'], ['2', 'Me manejo bien']]} value={P.net} onChange={set('net')} /></Field>
        <Field label="¿Cuánto podrías invertir para empezar?"><Chips options={[['0', 'Casi nada'], ['1', 'Poco: algunos materiales'], ['2', 'Algo más: herramientas o equipo']]} value={P.inv} onChange={set('inv')} /></Field>
      </Sec>
      <Sec n={6} t="Tus preferencias">
        <Field label="Trato con gente"><Chips options={[['1', 'Me gusta tratar con personas'], ['0', 'Prefiero poco trato']]} value={P.trato} onChange={set('trato')} /></Field>
        <Field label="Esfuerzo físico"><Chips options={[['0', 'Poco'], ['1', 'Moderado'], ['2', 'Puedo hacer trabajos pesados']]} value={P.fis} onChange={set('fis')} /></Field>
      </Sec>
      <motion.div layout className="sticky bottom-[5.6rem] lg:bottom-4 z-20">
        <div className="rounded-xl bg-ink text-bg p-4 shadow-lift flex flex-wrap items-center gap-3 justify-between">
          <span className="text-[.95rem]">{perfilVacio(d) ? 'Todavía no respondiste nada.' : <><b className="text-glow text-[1.2rem]">{n}</b> oportunidades relacionadas</>}</span>
          <Button variant="glow" size="sm" iconRight={<ArrowRight />} onClick={() => { mut((x) => { x.ta.done = true; }); nav('/finanzas/talento/ideas'); }}>Ver mis oportunidades</Button>
        </div>
      </motion.div>
    </div>
  );
}

function CmpBtn({ id, block }: { id: string; block?: boolean }) {
  const on = useStore((s) => s.d.ta.cmp.includes(id));
  return (
    <Button size="sm" block={block} variant={on ? 'primary' : 'ghost'} icon={on ? <Check /> : <Scale />} pressed={on}
      onClick={() => mut((x) => { const a = x.ta.cmp, i = a.indexOf(id); if (i >= 0) a.splice(i, 1); else { if (a.length >= 3) { toast('Podés comparar hasta 3'); return; } a.push(id); } })}>
      {on ? 'En la comparación' : 'Comparar'}
    </Button>
  );
}

function OpCard({ x }: { x: Ev }) {
  const d = useStore((s) => s.d), o = x.o, lv = nivel(x.s), nav = useNavigate();
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">{perfilVacio(d) ? <Tag>Sin personalizar</Tag> : <Tag tone={lv[1]}>{lv[0]}</Tag>}<Tag tone="amber">{o.cat}</Tag>{d.ta.sel === o.id && <Tag tone="ok">Elegida</Tag>}</div>
      <h3 className="text-[1.25rem]">{o.n}</h3>
      <p className="text-[.95rem]">{o.que}</p>
      <Metrics o={o} />
      {x.why.length > 0 && <div><b className="text-[.88rem]">Por qué te la recomendamos</b><Bullets className="text-[.9rem] mt-1" items={x.why.slice(0, 3)} /></div>}
      {x.risk.length > 0 && <div><b className="text-[.88rem]">Ojo con</b><Bullets className="text-[.9rem] mt-1" items={x.risk.slice(0, 2)} /></div>}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button size="sm" variant="ghost" to={'/finanzas/talento/op/' + o.id}>Ver detalle</Button>
        <CmpBtn id={o.id} />
        <Button size="sm" variant="secondary" onClick={() => { elegir(o.id); toast('Elegiste: ' + o.n); nav('/finanzas/talento/oferta'); }}>Elegir esta</Button>
      </div>
    </Card>
  );
}

export function Ideas() {
  const d = useStore((s) => s.d), r = ranking(d), top = r.slice(0, 6), vacio = perfilVacio(d);
  const rest = vacio ? r.slice(6) : OPS.map((o) => evalOp(o, d.ta.P)).filter((x) => !top.some((t) => t.o.id === x.o.id));
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={TBACK} kicker="Mi talento" title="Tus oportunidades" lead={vacio ? 'Todavía no completaste tu perfil, así que mostramos opciones sin personalizar.' : 'Ordenadas según tu perfil, con los motivos de cada una.'} /></Item>
      <Item className="flex flex-wrap gap-2">
        <Button size="sm" variant="ghost" icon={<UserRound />} to="/finanzas/talento/perfil">{vacio ? 'Completar mi perfil' : 'Corregir mis respuestas'}</Button>
        {d.ta.cmp.length >= 2 && <Button size="sm" icon={<Scale />} to="/finanzas/talento/comparar">Comparar ({d.ta.cmp.length})</Button>}
      </Item>
      {top.length ? top.map((x) => <Item key={x.o.id}><OpCard x={x} /></Item>) : <Item><Note tone="warn">Ninguna oportunidad coincide con lo que marcaste. Probá sumar habilidades o experiencia, o mirá todas abajo.</Note></Item>}
      <Item><Disclosure title={`Otras oportunidades (${rest.length})`}>
        <div className="flex flex-col gap-2">{rest.map((x) => <Card key={x.o.id} tone="sunk" to={'/finanzas/talento/op/' + x.o.id} className="!p-4"><b>{x.o.n}</b><span className="block text-[.85rem] text-muted">{x.o.cat} · inversión {INV_T[x.o.inv].toLowerCase()}</span></Card>)}</div>
      </Disclosure></Item>
      <Item><Note tone="info">Las recomendaciones son orientativas. No prometen ingresos: dependen de tu zona, tu tiempo y tu esfuerzo.</Note></Item>
    </Stagger>
  );
}

export function Op() {
  const { id = '' } = useParams(); const d = useStore((s) => s.d); const o = OP(id); const nav = useNavigate();
  if (!o) return <Ideas />;
  const x = evalOp(o, d.ta.P), yt = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(o.buscar);
  const B = ({ t, items, tone }: { t: string; items: string[]; tone?: 'sunk' }) => <Card tone={tone}><h3 className="text-[1.12rem] mb-2">{t}</h3><Bullets items={items} /></Card>;
  return (
    <Stagger className="flex flex-col gap-4">
      <Item><PageHeader back={{ to: '/finanzas/talento/ideas', label: 'Mis oportunidades' }} title={o.n} /></Item>
      <Item className="flex flex-wrap gap-1.5 -mt-1"><Tag tone="amber">{o.cat}</Tag><Tag>{AMB[o.amb]}</Tag></Item>
      <Item><Metrics o={o} /></Item>
      <Item><Card className="flex flex-col gap-3"><div><h3 className="text-[1.12rem]">Qué ofrecerías</h3><p>{o.que}</p></div><div><h3 className="text-[1.12rem]">Por qué podría funcionar</h3><p>{o.porq}</p></div></Card></Item>
      <Item><B t="A quién se lo ofrecés" items={o.quien} /></Item>
      {x.why.length > 0 && <Item><B t="Por qué encaja con vos" items={x.why} tone="sunk" /></Item>}
      <Item><B t="Cómo conseguir tus primeros clientes" items={o.cons} /></Item>
      <Item><B t="Qué necesitás para empezar" items={o.nec} /></Item>
      <Item><B t="Ejemplos de oferta" items={o.ej} /></Item>
      <Item><B t="Riesgos a tener en cuenta" items={[...x.risk, ...o.rie]} /></Item>
      <Item><Note tone="warn" title="Verificá antes de empezar"><Bullets items={o.ver} /><p className="text-[.88rem] mt-2">No afirmamos que esta actividad sea compatible con tu jubilación: eso se comprueba en ANSES.</p></Note></Item>
      <Item className="flex flex-col gap-2.5">
        <Button block onClick={() => { elegir(o.id); toast('Elegiste: ' + o.n); nav('/finanzas/talento/oferta'); }}>Elegir esta oportunidad</Button>
        <CmpBtn id={o.id} block />
        <Button block variant="ghost" icon={<PlayCircle />} href={yt}>Buscar videos en YouTube</Button>
        <Button block variant="ghost" to="/finanzas/tramites/guia/trabajar">Ver guía: Trabajar siendo jubilado/a</Button>
      </Item>
    </Stagger>
  );
}

export function Comparar() {
  const d = useStore((s) => s.d), ids = d.ta.cmp.filter((i) => OP(i)), P = d.ta.P, nav = useNavigate();
  if (ids.length < 2) return (
    <div className="flex flex-col gap-5"><PageHeader back={TBACK} title="Comparar oportunidades" /><Note tone="info">Elegí al menos 2 oportunidades con el botón “Comparar” para verlas lado a lado (hasta 3).</Note><div><Button to="/finanzas/talento/ideas">Ver mis oportunidades</Button></div></div>
  );
  const ev = ids.map((i) => evalOp(OP(i), P)), vacio = perfilVacio(d);
  const rows: [string, (x: Ev) => React.ReactNode][] = [
    ['Coincidencia', (x) => vacio ? '—' : <Tag tone={nivel(x.s)[1]}>{nivel(x.s)[0]}</Tag>],
    ['Inversión inicial', (x) => <>{INV_T[x.o.inv]}<span className="block text-[.82rem] text-muted">{x.o.nec.slice(0, 2).join(', ')}</span></>],
    ['Dificultad', (x) => DIF_T[x.o.dif - 1]],
    ['Tiempo semanal', (x) => <>~{x.o.hs} h{P.tiempo && <span className="block text-[.82rem] text-muted">{x.o.hs <= HRS[P.tiempo] ? 'Entra en tu tiempo' : 'Más de lo que indicaste'}</span>}</>],
    ['Para empezar', (x) => x.o.ini],
    ['Recursos', (x) => { const have = x.o.rec.filter((r: string) => P.rec.includes(r)), miss = x.o.rec.filter((r: string) => !P.rec.includes(r)); return P.rec.length ? <>{have.length > 0 && <span className="block">Tenés: {have.map((r: string) => REC_N[r]).join(', ')}</span>}<span className="block text-[.82rem] text-muted">{miss.length ? 'Te falta: ' + miss.map((r: string) => REC_N[r]).join(', ') : 'Nada más'}</span></> : x.o.rec.map((r: string) => REC_N[r]).join(', '); }],
    ['Posibles clientes', (x) => x.o.quien.slice(0, 2).join(' · ')],
    ['Por qué', (x) => x.why.slice(0, 2).join('. ') || '—'],
    ['Riesgo principal', (x) => x.risk[0] || x.o.rie[0]]
  ];
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={{ to: '/finanzas/talento/ideas', label: 'Mis oportunidades' }} title="Comparar oportunidades" lead="Mirá en qué se diferencian antes de elegir." />
      <Card pad={false} className="scroll-x">
        <table className="w-full min-w-[38rem] text-[.92rem]">
          <thead><tr><th className="sticky left-0 bg-surface" />{ev.map((x) => <th key={x.o.id} className="text-left align-top p-4 min-w-[11rem]"><button className="font-head font-semibold text-[1.05rem] text-left hover:underline" onClick={() => nav('/finanzas/talento/op/' + x.o.id)}>{x.o.n}</button></th>)}</tr></thead>
          <tbody>
            {rows.map(([t, f]) => <tr key={t} className="border-t border-line"><th scope="row" className="sticky left-0 bg-surface text-left align-top p-4 text-muted font-bold text-[.85rem] w-32">{t}</th>{ev.map((x) => <td key={x.o.id} className="align-top p-4">{f(x)}</td>)}</tr>)}
            <tr className="border-t border-line"><th className="sticky left-0 bg-surface" />{ev.map((x) => <td key={x.o.id} className="p-4"><div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => { elegir(x.o.id); toast('Elegiste: ' + x.o.n); nav('/finanzas/talento/oferta'); }}>Elegir</Button>
              <Button size="sm" variant="ghost" onClick={() => mut((y) => { y.ta.cmp = y.ta.cmp.filter((k) => k !== x.o.id); })}>Quitar</Button>
            </div></td>)}</tr>
          </tbody>
        </table>
      </Card>
      <Note tone="info">La comparación usa información general y lo que cargaste en tu perfil. No predice ingresos.</Note>
    </div>
  );
}
