import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ClipboardList, FolderCheck, LifeBuoy, BookOpen, ExternalLink, Copy, Share2, Printer, Plus, Trash2 } from 'lucide-react';
import { useStore, mut } from '../../store';
import { N } from '../../lib/narration';
import { PageHeader, Card, Hero, Button, Field, TextInput, TextArea, Progress, Note, RowLink, Stagger, Item, Tag, Tabs, CheckRow, Disclosure, Chips, Choices, Legal, Bullets, ListenButton, ease } from '../../ui';
import { fdate, uid } from '../../lib/format';
import { copyText, wa } from '../../lib/share';
import { toast } from '../../ui/toast';
import { GUIAS, GUIA, DOCS, AYUDA, CONTENIDO_VERSION } from '../../content/finanzas';
import { LEGAL } from '../../config';
import { SIT, SIT_N, plan, gProg, gItems, tramSiguiente, progresoTram, consultaTexto, type Item as CItem } from './calc';

const BACK = { to: '/finanzas/tramites', label: 'Mis trámites' };
const tfecha = () => fdate(CONTENIDO_VERSION);
const EstTag = ({ g }: { g: any }) => g.pend.length ? <Tag tone="warn">Con puntos pendientes</Tag> : <Tag tone="ok">Verificada en la fuente</Tag>;
const OrgTag = ({ g }: { g: any }) => <Tag tone="sky">{g.org}</Tag>;

export function TramHub() {
  const d = useStore((s) => s.d); const nav = useNavigate();
  if (!d.tr.sit.sit) return <Situacion />;
  const pl = plan(d), nx = tramSiguiente(d), pt = progresoTram(d), pend = d.tr.notas.filter((x) => !x.ok);
  const dtot = Object.keys(DOCS).filter((k) => pl.some((e) => GUIA(e.id).docs.some((x: any) => x.id === k)));
  const dn = dtot.filter((k) => d.tr.docs[k]).length;
  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader back={{ to: '/finanzas', label: 'Finanzas' }} kicker="Finanzas" title="Mis trámites" /></Item>
      <Item><Card tone="sunk" className="flex items-center justify-between gap-3">
        <div><span className="text-[.82rem] text-muted">Tu situación</span><b className="block">{SIT_N[d.tr.sit.sit]}</b></div>
        <Button size="sm" variant="ghost" to="/finanzas/tramites/situacion">Cambiar</Button>
      </Card></Item>
      <Item><Hero>
        <div className="text-onbrand/80 text-[.98rem]">Tu próxima acción</div>
        <h2 className="text-[1.5rem] text-onbrand mt-1 leading-snug">{nx ? nx.txt : 'Todo al día por ahora'}</h2>
        <p className="opacity-85 mt-1">{nx ? `En la guía “${nx.g.t}”.` : 'Podés revisar otras guías o preparar una consulta.'}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {nx && <Button variant="glow" to={'/finanzas/tramites/guia/' + nx.g.id} iconRight={<ArrowRight />}>Abrir esa guía</Button>}
          <Button variant="onbrand" to="/finanzas/tramites/ayuda">Me trabé con algo</Button>
        </div>
      </Hero></Item>
      <Item><Card className="flex flex-col gap-4">
        <Progress value={pt.n} max={pt.t} label="Tu avance en el plan" right={`${pt.n} de ${pt.t}`} />
        {dtot.length > 0 && <Progress tone="sky" value={dn} max={dtot.length} label="Documentos reunidos" right={`${dn} de ${dtot.length}`} />}
        {pend.length > 0 && <p className="text-[.92rem]"><b>{pend.length}</b> {pend.length === 1 ? 'cuestión pendiente' : 'cuestiones pendientes'}: {pend.slice(0, 2).map((x) => x.t).join(' · ')}{pend.length > 2 ? '…' : ''}</p>}
      </Card></Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.35rem]">Tu plan</h2>
        {pl.map((e, i) => {
          const g = GUIA(e.id), pr = gProg(d, g), full = pr.n === pr.t;
          return (
            <Card key={g.id} to={'/finanzas/tramites/guia/' + g.id} className="flex gap-4 items-start">
              <span className={'grid place-items-center size-10 rounded-full shrink-0 font-bold ' + (full ? 'bg-accent text-onaccent' : 'bg-sunk')}>{full ? '✓' : i + 1}</span>
              <span className="flex-1 min-w-0 flex flex-col gap-1.5">
                <b className="font-head font-semibold text-[1.12rem] leading-tight">{g.t}</b>
                <span className="text-muted text-[.9rem]">{e.why}</span>
                <span className="flex flex-wrap gap-1.5"><OrgTag g={g} /><Tag tone={full ? 'ok' : 'neutral'}>{pr.n} de {pr.t}</Tag></span>
              </span>
            </Card>
          );
        })}
      </Item>
      <Item className="flex flex-col gap-3">
        <RowLink to="/finanzas/tramites/preparar" icon={<ClipboardList />} tone="sky" title="Preparar mi consulta" sub="Datos, documentos y preguntas antes de ir a ANSES o PAMI" />
        <RowLink to="/finanzas/tramites/docs" icon={<FolderCheck />} tone="sky" title="Mis documentos" sub="Qué tenés y qué te falta, en un solo lugar" />
        <RowLink to="/finanzas/tramites/ayuda" icon={<LifeBuoy />} tone="sky" title="Me trabé con algo" sub="Faltan papeles, datos incorrectos, sin turno…" />
        <RowLink to="/finanzas/tramites/guias" icon={<BookOpen />} tone="sky" title="Todas las guías" sub={GUIAS.length + ' guías con fuente y fecha'} />
      </Item>
      <Item><Note tone="info" title="Esta aplicación orienta y te ayuda a organizarte">No determina si tenés derecho a jubilarte ni a ningún beneficio: eso lo define el organismo correspondiente. Contenido verificado el {tfecha()}.</Note></Item>
      <Item><Legal>{LEGAL}</Legal></Item>
    </Stagger>
  );
}

export function Situacion() {
  const d = useStore((s) => s.d), T = d.tr.sit; const nav = useNavigate();
  const set = (k: keyof typeof T) => (v: string) => mut((x) => { x.tr.sit[k] = v; });
  return (
    <div className="flex flex-col gap-6">
      <PageHeader back={T.sit ? BACK : { to: '/finanzas', label: 'Finanzas' }} kicker="Mis trámites" title="¿En qué situación estás?" lead="Con esto te mostramos solo lo que te sirve ahora. Podés cambiarlo cuando quieras." />
      <ListenButton text={N.tramSit} />
      <Choices options={SIT.map((s) => ({ k: s[0], t: s[1], s: s[2] }))} value={T.sit} onChange={set('sit')} />
      <Disclosure title="Afiná tus recomendaciones (opcional)" defaultOpen={!!(T.sexo || T.edad || T.aportes || T.hijos)}>
        <div className="flex flex-col gap-5">
          <p className="text-[.88rem] text-muted">Queda solo en tu dispositivo y sirve para sugerirte guías. No cargues DNI, CUIL ni claves.</p>
          <Field label="Sexo que figura en tu DNI"><Chips options={[['F', 'Femenino'], ['M', 'Masculino'], ['X', 'Otro / prefiero no decirlo']]} value={T.sexo} onChange={set('sexo')} /></Field>
          <Field label="Tu edad" htmlFor="ed"><TextInput id="ed" numeric value={T.edad} onChange={set('edad')} placeholder="Ej: 62" /></Field>
          <Field label="Años de aportes (aproximado)"><Chips options={[['lt10', 'Menos de 10'], ['10', '10 a 19'], ['20', '20 a 29'], ['30', '30 o más'], ['ns', 'No lo sé']]} value={T.aportes} onChange={set('aportes')} /></Field>
          <Field label="¿Tuviste hijos o hijas?"><Chips options={[['si', 'Sí'], ['no', 'No']]} value={T.hijos} onChange={set('hijos')} /></Field>
        </div>
      </Disclosure>
      <Button size="lg" block iconRight={<ArrowRight />} onClick={() => { if (!T.sit) { toast('Elegí tu situación'); return; } nav('/finanzas/tramites'); }}>Ver mi plan</Button>
    </div>
  );
}

export function Guias() {
  const d = useStore((s) => s.d), ids = plan(d).map((e) => e.id), otras = GUIAS.filter((g) => !ids.includes(g.id));
  const card = (g: any) => { const pr = gProg(d, g); return (
    <Card key={g.id} to={'/finanzas/tramites/guia/' + g.id} className="flex flex-col gap-1.5">
      <b className="font-head font-semibold text-[1.12rem]">{g.t}</b><span className="text-muted text-[.9rem]">{g.resuelve}</span>
      <span className="flex flex-wrap gap-1.5"><OrgTag g={g} /><EstTag g={g} /><Tag>{pr.n} de {pr.t}</Tag></span>
    </Card>); };
  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={BACK} title="Todas las guías" /></Item>
      <Item className="flex flex-col gap-3"><h2 className="text-[1.2rem]">Para tu situación</h2>{ids.map((i) => card(GUIA(i)))}</Item>
      {otras.length > 0 && <Item className="flex flex-col gap-3"><h2 className="text-[1.2rem]">Otras guías</h2>{otras.map(card)}</Item>}
    </Stagger>
  );
}

function CkList({ g, items, d }: { g: any; items: CItem[]; d: any }) {
  return <>{items.map((it) => (
    <CheckRow key={it.k} done={it.done} sub={it.c}
      onToggle={() => mut((x) => { if (it.type === 'd') { if (x.tr.docs[it.k]) delete x.tr.docs[it.k]; else x.tr.docs[it.k] = 1; } else { const k = g.id + '.' + it.k; if (x.tr.ck[k]) delete x.tr.ck[k]; else x.tr.ck[k] = 1; } })}>
      {it.t}
    </CheckRow>))}</>;
}

export function Guia() {
  const { id = '' } = useParams(); const d = useStore((s) => s.d); const g = GUIA(id);
  const [tab, setTab] = useState<'res' | 'check' | 'ayuda' | 'fuentes'>('res');
  const [nota, setNota] = useState('');
  if (!g) return <Guias />;
  const pr = gProg(d, g), nx = pr.items.find((x) => !x.done), notas = d.tr.notas.filter((n) => n.g === g.id);
  const por = (t: string) => pr.items.filter((x) => x.type === t);
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={BACK} title={g.t} />
      <div className="flex flex-wrap gap-1.5 -mt-2"><OrgTag g={g} /><EstTag g={g} /><Tag>Verificada el {tfecha()}</Tag></div>
      <Card className="flex flex-col gap-3">
        <Progress value={pr.n} max={pr.t} label="Tu avance en esta guía" right={`${pr.n} de ${pr.t}`} />
        <p className="text-[.92rem]">{nx ? <><b>Siguiente:</b> {nx.t}</> : <b>Completaste esta guía.</b>}</p>
      </Card>
      <Tabs id="guia" value={tab} onChange={setTab} tabs={[['res', 'Resumen'], ['check', 'Checklist'], ['ayuda', 'Si algo falla'], ['fuentes', 'Fuentes']]} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease }} className="flex flex-col gap-4">
          {tab === 'res' && (<>
            <Card className="flex flex-col gap-3">
              <div><h3 className="text-[1.1rem]">Qué resuelve</h3><p>{g.resuelve}</p></div>
              <div><h3 className="text-[1.1rem]">Para quién</h3><p>{g.quien}</p></div>
              <ListenButton text={N.guia(g)} />
            </Card>
            <Card tone="mint" className="flex flex-col gap-2"><h3 className="text-[1.1rem]">Requisitos generales</h3><p className="text-[.85rem] text-muted">Lo que la fuente oficial indica para el caso general.</p><Bullets items={g.gen} /></Card>
            <Card tone="sunk" className="flex flex-col gap-2"><h3 className="text-[1.1rem]">Lo que depende de cada caso</h3><p className="text-[.85rem] text-muted">No lo podemos determinar acá: depende de tu situación.</p><Bullets items={g.caso} /></Card>
            {g.pend.length > 0 && <Note tone="warn" title="Pendiente de confirmación"><Bullets items={g.pend} /></Note>}
            <div className="flex flex-wrap gap-3"><Button onClick={() => setTab('check')}>Ir a mi checklist</Button><Button variant="ghost" to={'/finanzas/tramites/preparar/' + g.id}>Preparar mi consulta</Button></div>
          </>)}
          {tab === 'check' && (<>
            <Card><h3 className="text-[1.1rem] mb-1">1. Revisá antes de empezar</h3><CkList g={g} items={por('a')} d={d} /></Card>
            <Card><h3 className="text-[1.1rem]">2. Documentación</h3><p className="text-[.85rem] text-muted mb-1">Marcá lo que ya tenés. Se guarda para todas las guías.</p><CkList g={g} items={por('d')} d={d} /></Card>
            <Card><h3 className="text-[1.1rem] mb-1">3. Pasos</h3><CkList g={g} items={por('p')} d={d} /></Card>
            <Card className="flex flex-col gap-2">
              <h3 className="text-[1.1rem]">Mis cuestiones pendientes</h3>
              {notas.length ? notas.map((n) => (
                <CheckRow key={n.id} done={n.ok} onToggle={() => mut((x) => { const it = x.tr.notas.find((y) => y.id === n.id); if (it) it.ok = !it.ok; })}
                  actions={<button aria-label="Quitar" onClick={() => mut((x) => { x.tr.notas = x.tr.notas.filter((y) => y.id !== n.id); })} className="text-muted hover:text-bad p-2"><Trash2 className="size-5" /></button>}>{n.t}</CheckRow>
              )) : <p className="text-muted text-[.92rem]">Anotá lo que te falta resolver (por ejemplo, “pedir el recibo de 2009”).</p>}
              <div className="flex gap-2 mt-1">
                <div className="flex-1"><TextInput label="Nueva cuestión pendiente" value={nota} onChange={setNota} placeholder="Nueva cuestión pendiente" /></div>
                <Button size="sm" icon={<Plus />} onClick={() => { if (!nota.trim()) { toast('Escribí la cuestión pendiente'); return; } mut((x) => { x.tr.notas.push({ id: uid(), g: g.id, t: nota.trim(), ok: false }); }); setNota(''); }}>Agregar</Button>
              </div>
            </Card>
          </>)}
          {tab === 'ayuda' && (<>
            {g.prob.map((p: string[]) => <Disclosure key={p[0]} title={p[0]}><p>{p[1]}</p></Disclosure>)}
            <Note tone="info" title="Cuándo conviene consultar al organismo">Cuando una respuesta cambie tu decisión, cuando algo no figure como esperabas o cuando pase mucho tiempo sin novedades. Anotá antes tus preguntas en “Preparar mi consulta”.</Note>
            <div><Button variant="ghost" to="/finanzas/tramites/ayuda">Ver más situaciones frecuentes</Button></div>
          </>)}
          {tab === 'fuentes' && (<>
            <Card className="flex flex-col gap-3">
              <h3 className="text-[1.1rem]">Fuentes oficiales</h3>
              <p className="text-[.88rem] text-muted">Complementan la guía. Última verificación: <b className="text-ink">{tfecha()}</b>.</p>
              {g.src.map((s: string[]) => <Button key={s[1]} variant="ghost" href={s[1]} className="!justify-between text-left" iconRight={<ExternalLink />}>{s[0]}</Button>)}
            </Card>
            {g.pend.length ? <Note tone="warn" title="No pudimos verificar"><Bullets items={g.pend} /></Note> : <Note tone="good">Todo lo que aparece en esta guía se verificó en la fuente.</Note>}
          </>)}
        </motion.div>
      </AnimatePresence>
      <Legal>{LEGAL}</Legal>
    </div>
  );
}

export function Docs() {
  const d = useStore((s) => s.d), used: Record<string, string[]> = {};
  GUIAS.forEach((g) => g.docs.forEach((x: any) => { (used[x.id] ||= []).push(g.t); }));
  const ids = Object.keys(DOCS), n = ids.filter((k) => d.tr.docs[k]).length;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={BACK} title="Mis documentos" lead="Marcá lo que ya tenés a mano. Se actualiza en todas las guías." />
      <Card><Progress value={n} max={ids.length} label="Documentos reunidos" right={`${n} de ${ids.length}`} /></Card>
      <Card>{ids.map((k) => <CheckRow key={k} done={!!d.tr.docs[k]} sub={'Se usa en: ' + (used[k] || ['—']).join(', ')} onToggle={() => mut((x) => { if (x.tr.docs[k]) delete x.tr.docs[k]; else x.tr.docs[k] = 1; })}>{DOCS[k]}</CheckRow>)}</Card>
      <Note tone="info">No cargues números de DNI, CUIL ni claves: solo marcá si tenés el documento.</Note>
    </div>
  );
}

export function Ayuda() {
  return (
    <Stagger className="flex flex-col gap-4">
      <Item><PageHeader back={BACK} title="Me trabé con algo" lead="Situaciones frecuentes, con el siguiente paso razonable y cuándo conviene consultar al organismo." /></Item>
      {AYUDA.map((a) => (
        <Item key={a.t}><Disclosure title={a.t}>
          <div className="flex flex-col gap-2.5">
            <p><b>Siguiente paso:</b> {a.q}</p><p><b>Cuándo consultar al organismo:</b> {a.c}</p>
            {a.g && <div><Button size="sm" variant="ghost" to={'/finanzas/tramites/guia/' + a.g}>Ver la guía relacionada</Button></div>}
          </div>
        </Disclosure></Item>
      ))}
      <Item><Legal>{LEGAL}</Legal></Item>
    </Stagger>
  );
}

export function Preparar() {
  const { id } = useParams(); const d = useStore((s) => s.d); const g = id ? GUIA(id) : null;
  const [np, setNp] = useState('');
  if (!g) return (
    <Stagger className="flex flex-col gap-4">
      <Item><PageHeader back={BACK} title="Preparar mi consulta" lead="Elegí para qué trámite vas a consultar. Te armamos la hoja con documentos, datos y preguntas." /></Item>
      {GUIAS.map((x) => <Item key={x.id}><Card to={'/finanzas/tramites/preparar/' + x.id} className="flex items-center justify-between gap-3"><b className="font-head font-semibold text-[1.08rem]">{x.t}</b><OrgTag g={x} /></Card></Item>)}
    </Stagger>
  );
  const preg = d.tr.preg[g.id] || g.preg.map((t: string) => ({ id: t, t, ok: false, own: false }));
  const ensure = (x: any) => { if (!x.tr.preg[g.id]) x.tr.preg[g.id] = g.preg.map((t: string) => ({ id: uid(), t, ok: false, own: false })); return x.tr.preg[g.id]; };
  const docs = gItems(d, g).filter((x) => x.type === 'd'), falta = docs.filter((x) => !x.done);
  const txt = consultaTexto(d, g);
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={{ to: '/finanzas/tramites/preparar', label: 'Elegir otro trámite' }} kicker={'Preparar mi consulta · ' + g.org} title={g.t} />
      <Card className="flex flex-col gap-2"><h3 className="text-[1.1rem]">1. Datos para tener a mano</h3>
        <Bullets items={['Tu DNI y tu número de CUIL (llevalos, pero no los cargues acá).', 'Tu clave: es personal, no la compartas.', ...g.datos]} /></Card>
      <Card><h3 className="text-[1.1rem] mb-1">2. Tus documentos {falta.length ? `· te faltan ${falta.length}` : '· ¡tenés todo!'}</h3><CkList g={g} items={docs} d={d} /></Card>
      <Card tone="sunk" className="flex flex-col gap-2"><h3 className="text-[1.1rem]">3. Qué verificar en tu caso antes de avanzar</h3><Bullets items={g.caso} /></Card>
      <Card className="flex flex-col gap-1">
        <h3 className="text-[1.1rem]">4. Mis preguntas</h3><p className="text-[.85rem] text-muted">Marcalas cuando las hayas hecho.</p>
        {preg.map((q: any, i: number) => (
          <CheckRow key={q.id} done={q.ok} onToggle={() => mut((x) => { const a = ensure(x); a[i].ok = !a[i].ok; })}
            actions={q.own ? <button aria-label="Quitar" className="text-muted hover:text-bad p-2" onClick={() => mut((x) => { const a = ensure(x); a.splice(i, 1); })}><Trash2 className="size-5" /></button> : undefined}>{q.t}</CheckRow>
        ))}
        <div className="flex gap-2 mt-2">
          <div className="flex-1"><TextInput label="Agregar pregunta" value={np} onChange={setNp} placeholder="Agregar mi propia pregunta" /></div>
          <Button size="sm" icon={<Plus />} onClick={() => { if (!np.trim()) { toast('Escribí tu pregunta'); return; } mut((x) => { ensure(x).push({ id: uid(), t: np.trim(), ok: false, own: true }); }); setNp(''); }}>Agregar</Button>
        </div>
      </Card>
      <Card className="flex flex-col gap-2"><h3 className="text-[1.1rem]">5. Lo que me respondieron</h3>
        <TextArea label="Notas de la consulta" value={d.tr.resp[g.id] || ''} onChange={(v) => mut((x) => { x.tr.resp[g.id] = v; })} placeholder="Anotá la fecha, quién te atendió y qué te dijeron." /></Card>
      <div className="flex flex-wrap gap-3">
        <Button icon={<Copy />} onClick={() => copyText(txt)}>Copiar hoja</Button>
        <Button variant="secondary" icon={<Share2 />} href={wa(txt)}>WhatsApp</Button>
        <Button variant="ghost" icon={<Printer />} onClick={() => { try { window.print(); } catch { /* */ } }}>Imprimir</Button>
      </div>
      <Legal>{LEGAL}</Legal>
    </div>
  );
}
