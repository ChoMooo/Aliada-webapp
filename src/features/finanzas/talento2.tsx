import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Copy, Share2, RotateCcw, ChevronLeft, ChevronRight, Plus, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { useStore, mut, type Data } from '../../store';
import { PageHeader, Card, Hero, Button, Field, TextInput, TextArea, MoneyInput, Progress, Note, Tag, Chips, Bullets, KV, Tabs, CheckRow, CountUp, Celebrate, ease, cx } from '../../ui';
import { toast } from '../../ui/toast';
import { copyText, wa } from '../../lib/share';
import { fmt, money, pn, uid } from '../../lib/format';
import { OP, HRS } from '../../content/finanzas';
import { W, precioCalc, ofertaFrase, ofertaPct, matGen, genPlan, taPlanProg, DIFER, COBRO, PAGO, MATS, type Work } from './calc';
import { RowEditor } from './shared';
import { TBACK } from './talento';

function NeedSel({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={TBACK} title={title} />
      <Note tone="info">Primero elegí una oportunidad. Así adaptamos todo a lo que vas a ofrecer.</Note>
      <div><Button to="/finanzas/talento/ideas">Ver mis oportunidades</Button></div>
    </div>
  );
}
const upd = (fn: (w: Work, d: Data) => void) => mut((d) => { const w = d.ta.w[d.ta.sel]; if (w) fn(w, d); });

export function Oferta() {
  const d = useStore((s) => s.d), w = W(d);
  if (!w) return <NeedSel title="Mi oferta" />;
  const o = OP(d.ta.sel), f = w.of, pc = precioCalc(w)!, pct = ofertaPct(w);
  const set = (k: keyof Work['of']) => (v: any) => upd((x) => { (x.of as any)[k] = v; });
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={TBACK} kicker="Mi oferta" title={o.n} lead="Convertí la idea en algo concreto que puedas decir en una frase." />
      <Card tone="amber" className="flex flex-col gap-2">
        <h3 className="text-[1.1rem]">Ejemplos para tu caso</h3>
        {o.ej.map((e: string) => (
          <div key={e} className="flex items-start gap-3 justify-between"><p className="text-[.95rem]">{e}</p><Button size="sm" variant="ghost" onClick={() => set('que')(e.replace(/[“”"]/g, ''))}>Usar</Button></div>
        ))}
      </Card>
      <Card className="flex flex-col gap-5">
        <Field label="1. ¿Qué vas a ofrecer?" htmlFor="f1"><TextArea id="f1" value={f.que} onChange={set('que')} className="!min-h-[5rem]" /></Field>
        <Field label="2. ¿A qué tipo de cliente?">
          <Chips options={o.quien.map((q: string) => [q, q])} value={f.quien} onChange={set('quien')} />
          <TextInput label="Tipo de cliente" value={f.quien} onChange={set('quien')} placeholder="O escribilo con tus palabras" />
        </Field>
        <Field label="3. ¿Qué problema le resolvés?" htmlFor="f3"><TextInput id="f3" value={f.problema} onChange={set('problema')} placeholder={'Ej: ahorrarle tiempo a ' + o.quien[0].toLowerCase()} /></Field>
        <Field label="4. ¿Cómo te diferenciás?">
          <Chips multi options={DIFER} value={f.difer} onChange={set('difer')} />
          <TextInput label="Diferencial propio" value={f.diferTxt} onChange={set('diferTxt')} placeholder="Algo propio (opcional)" />
        </Field>
        <Field label="5. ¿Cómo vas a cobrar?" hint={'En este rubro suele cobrarse: ' + o.uni + '.'}><Chips options={COBRO} value={f.cobro} onChange={set('cobro')} /></Field>
        <Field label="6. Precio" htmlFor="f6">
          <MoneyInput id="f6" value={f.precio} onChange={set('precio')} />
          <div>{pc.ok ? <Button size="sm" variant="ghost" onClick={() => set('precio')(String(pc.redo))}>Usar mi precio calculado ({money(pc.redo)})</Button> : <Button size="sm" variant="ghost" to="/finanzas/talento/precio">Calcular mi precio</Button>}</div>
        </Field>
        <Field label="Forma de pago"><Chips options={PAGO} value={f.pago} onChange={set('pago')} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Zona" htmlFor="f8"><TextInput id="f8" value={f.zona} onChange={set('zona')} placeholder="Ej: mi barrio" /></Field>
          <Field label="Plazo de entrega o anticipación" htmlFor="f9"><TextInput id="f9" value={f.plazo} onChange={set('plazo')} placeholder="Ej: 72 horas" /></Field>
        </div>
        <Field label="Días y horarios" htmlFor="f10"><TextInput id="f10" value={f.disp} onChange={set('disp')} placeholder="Ej: lunes a viernes por la tarde" /></Field>
        <Field label="Tu nombre" htmlFor="f11"><TextInput id="f11" value={f.nombre} onChange={set('nombre')} /></Field>
      </Card>
      <Hero>
        <div className="text-onbrand/80 text-[.98rem]">Tu oferta en una frase</div>
        <p className="text-[1.15rem] mt-2 leading-relaxed">{ofertaFrase(w)}</p>
        <div className="mt-4"><Progress tone="glow" value={pct} label={<span className="text-onbrand">Tu oferta está al {pct}%</span>} /></div>
      </Hero>
      <Button block size="lg" to="/finanzas/talento/materiales" iconRight={<ArrowRight />}>Preparar mi material para vender</Button>
    </div>
  );
}

export function Precio() {
  const d = useStore((s) => s.d), w = W(d), nav = useNavigate();
  if (!w) return <NeedSel title="Precios y costos" />;
  const o = OP(d.ta.sel), P = w.pr, r = precioCalc(w)!, base = 'ta.w.' + d.ta.sel + '.pr.';
  const set = (k: keyof Work['pr']) => (v: string) => upd((x) => { (x.pr as any)[k] = v; });
  const warn: string[] = [];
  if (r.vh <= 0) warn.push('Completá cuánto querés ganar por hora.');
  if (r.hs <= 0) warn.push('Completá las horas que lleva cada servicio.');
  if (r.cant <= 0) warn.push('Sin la cantidad de servicios por mes no podemos estimar el mes.');
  if (r.impRaw >= 90) warn.push('El porcentaje de impuestos y comisiones parece demasiado alto: lo limitamos a 90%.');
  const avg = r.refs.length ? r.refs.reduce((a: number, b: number) => a + b, 0) / r.refs.length : 0, dif = avg ? (r.redo - avg) / avg * 100 : 0;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={TBACK} kicker="Mi talento" title="Precios y costos" lead={<>{o.n}. Completá con tus números: si no los tenés, empezá con estimaciones y ajustalas.</>} />
      <Card className="flex flex-col gap-4">
        <h2 className="text-[1.25rem]">Tu tiempo</h2>
        <Field label="¿Cuánto querés ganar por hora?" htmlFor="p1" hint="Pensá cuánto vale tu hora. Es tu decisión."><MoneyInput id="p1" value={P.vh} onChange={set('vh')} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Preparación (h)" htmlFor="p2"><TextInput id="p2" decimal value={P.h1} onChange={set('h1')} placeholder="0" /></Field>
          <Field label="Trabajo (h)" htmlFor="p3"><TextInput id="p3" decimal value={P.h2} onChange={set('h2')} placeholder="0" /></Field>
          <Field label="Traslado (h)" htmlFor="p4"><TextInput id="p4" decimal value={P.h3} onChange={set('h3')} placeholder="0" /></Field>
          <Field label="Mensajes y cobro (h)" htmlFor="p5"><TextInput id="p5" decimal value={P.h4} onChange={set('h4')} placeholder="0" /></Field>
        </div>
      </Card>
      <Card className="flex flex-col gap-3"><h2 className="text-[1.25rem]">Materiales por servicio</h2><RowEditor path={base + 'mats'} rows={P.mats} addLabel="Agregar material" namePh="Material" /></Card>
      <Card className="flex flex-col gap-3"><h2 className="text-[1.25rem]">Gastos fijos por mes</h2><p className="text-[.88rem] text-muted">Herramientas, transporte, publicidad, internet: lo que gastás aunque no vendas.</p><RowEditor path={base + 'fijos'} rows={P.fijos} addLabel="Agregar gasto fijo" namePh="Gasto" /></Card>
      <Card className="flex flex-col gap-4">
        <h2 className="text-[1.25rem]">Ventas y porcentajes</h2>
        <Field label="¿Cuántos servicios pensás hacer por mes?" htmlFor="p6"><TextInput id="p6" numeric value={P.cant} onChange={set('cant')} placeholder="Ej: 8" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Impuestos y comisiones (%)" htmlFor="p7" hint="Según tu caso: consultá en ARCA o con un contador."><TextInput id="p7" decimal value={P.imp} onChange={set('imp')} placeholder="0" /></Field>
          <Field label="Colchón de imprevistos (%)" htmlFor="p8"><TextInput id="p8" decimal value={P.imprev} onChange={set('imprev')} /></Field>
        </div>
      </Card>
      <Card className="flex flex-col gap-3"><h2 className="text-[1.25rem]">Precios de referencia</h2><p className="text-[.88rem] text-muted">Cuánto cobran otras personas por algo parecido en tu zona. Cargalos para comparar.</p><RowEditor path={base + 'ref'} rows={P.ref} addLabel="Agregar referencia" namePh="Quién o dónde" /></Card>
      {!r.ok ? <Note tone="warn">{warn.map((x) => <div key={x}>{x}</div>)}</Note> : (<>
        <Hero>
          <div className="text-onbrand/80 text-[.98rem]">Precio inicial orientativo por servicio</div>
          <div className="font-head font-semibold text-[3.2rem] leading-none text-glow mt-2"><CountUp value={r.redo} format={money} /></div>
          <p className="opacity-85 mt-2">Cálculo exacto: {money(r.precio)}, redondeado hacia arriba a múltiplos de $ 50. Es un punto de partida para probar, no un precio “correcto”.</p>
        </Hero>
        <Card>
          <h3 className="text-[1.12rem] mb-1">De dónde sale</h3>
          <KV k={`Tu tiempo (${fmt(r.hs, 1)} h × ${money(r.vh)})`} v={money(r.mano)} />
          <KV k="Materiales por servicio" v={money(r.mat)} />
          <KV k={'Parte de tus gastos fijos' + (r.cant > 0 ? ` (${money(r.fij)} ÷ ${fmt(r.cant)})` : '')} v={money(r.fu)} />
          <KV k={`Imprevistos (${fmt(r.ip * 100, 1)}% sobre el subtotal)`} v={money(r.conI - r.base)} />
          <KV k={`Impuestos y comisiones (${fmt(r.imp * 100, 1)}% del precio)`} v={money(r.precio - r.conI)} />
          <KV total k="Precio calculado" v={money(r.precio)} />
        </Card>
        {r.cant > 0 && <Card>
          <h3 className="text-[1.12rem] mb-1">Si conseguís {fmt(r.cant)} servicios por mes</h3>
          <KV k="Te quedarían por mes (con tu tiempo incluido)" v={money(r.neto)} tone={r.neto >= 0 ? 'pos' : 'neg'} />
          <KV k="Por hora trabajada (real)" v={money(r.neto / (r.cant * r.hs))} />
          {r.equil > 0 && <KV k="Servicios mínimos por mes para cubrir tus gastos fijos" v={r.equil} />}
        </Card>}
        <Card>
          <h3 className="text-[1.12rem] mb-1">Comparado con tus referencias</h3>
          {r.refs.length ? (<>
            <KV k={`Promedio de tus referencias (${r.refs.length})`} v={money(avg)} />
            <KV k="Rango" v={`${money(Math.min(...r.refs))} – ${money(Math.max(...r.refs))}`} />
            <p className="mt-2">{Math.abs(dif) < 5 ? <>Tu precio está <b>cerca</b> del promedio.</> : <>Tu precio está <b>{fmt(Math.abs(dif))}% {dif > 0 ? 'por encima' : 'por debajo'}</b> del promedio de las referencias que cargaste.</>}</p>
          </>) : <p className="text-muted">Todavía no cargaste precios de referencia. No incluimos precios de mercado porque cambian rápido y dependen de la zona.</p>}
        </Card>
        <Card tone="sunk"><h3 className="text-[1.05rem] mb-2">Supuestos que usamos</h3>
          <Bullets className="text-[.9rem]" items={['Todos los valores los cargaste vos; no usamos precios de mercado.', `Tiempo total por servicio: ${fmt(r.hs, 1)} h.`, 'Se asume que vendés todos los servicios que indicaste por mes.', `Impuestos y comisiones: ${fmt(r.imp * 100, 1)}%. Confirmá los tuyos en ARCA o con un contador.`, 'No es una garantía de ingresos.']} /></Card>
        {warn.length > 0 && <Note tone="warn">{warn.map((x) => <div key={x}>{x}</div>)}</Note>}
        <Button block iconRight={<ArrowRight />} onClick={() => { upd((x) => { x.of.precio = String(r.redo); }); nav('/finanzas/talento/oferta'); }}>Usar este precio en mi oferta</Button>
      </>)}
    </div>
  );
}

export function Materiales() {
  const d = useStore((s) => s.d), w = W(d);
  const [k, setK] = useState('propuesta');
  if (!w) return <NeedSel title="Material para vender" />;
  const o = OP(d.ta.sel), edited = w.mat[k] != null, t = edited ? w.mat[k] : matGen(w, d.ta.sel, k);
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={TBACK} kicker="Mi talento" title="Material para vender" lead={<>Armado con tu oferta de “{o.n}”. Podés editar todo el texto: se guarda en tu dispositivo.</>} />
      <Tabs id="mat" value={k} onChange={setK} tabs={MATS} />
      {ofertaPct(w) < 60 && <Note tone="warn">Completá tu oferta para que el texto salga más completo. <button className="font-bold underline" onClick={() => history.back()}>Volver</button></Note>}
      <AnimatePresence mode="wait">
        <motion.div key={k} initial={{ opacity: 0, transform: 'translate(0px, 8px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <TextArea label="Texto" value={t} onChange={(v) => upd((x) => { x.mat[k] = v; })} className="!min-h-[22rem] text-[.98rem]" />
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-wrap gap-3">
        <Button icon={<Copy />} onClick={() => copyText(t)}>Copiar</Button>
        <Button variant="secondary" icon={<Share2 />} href={wa(t)}>WhatsApp</Button>
        {edited && <Button variant="ghost" icon={<RotateCcw />} onClick={() => upd((x) => { delete x.mat[k]; })}>Restaurar texto automático</Button>}
      </div>
    </div>
  );
}

export function Plan() {
  const d = useStore((s) => s.d), w = W(d);
  const [nt, setNt] = useState(''); const [nw, setNw] = useState('1'); const [confirm, setConfirm] = useState(false); const [party, setParty] = useState(false);
  if (!w) return <NeedSel title="Plan de 30 días" />;
  const o = OP(d.ta.sel), tiempo = d.ta.P.tiempo, cap = HRS[tiempo];
  if (!w.plan.on) return (
    <div className="flex flex-col gap-5">
      <PageHeader back={TBACK} kicker="Mi talento" title="Plan de 30 días" lead={<>Para “{o.n}”. Tareas concretas, ajustadas a tu tiempo{tiempo ? ` (hasta ${cap} h por semana)` : ''}.</>} />
      {!tiempo && <Note tone="info">No indicaste tu tiempo semanal: usamos unas 10 horas. Podés ajustarlo en tu perfil.</Note>}
      <div className="grid sm:grid-cols-2 gap-3">
        {[['Semana 1', 'Definir la oferta, calcular costos y validar con 5 personas'], ['Semana 2', 'Preparar materiales y verificar obligaciones'], ['Semana 3', 'Contactar personas y conseguir el primer trabajo'], ['Semana 4', 'Evaluar, ajustar y decidir cómo seguir']].map(([a, b], i) => (
          <motion.div key={a} initial={{ opacity: 0, transform: 'translate(0px, 10px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} transition={{ delay: i * 0.08 }}><Card className="h-full"><b className="text-amber">{a}</b><p className="mt-1">{b}</p></Card></motion.div>
        ))}
      </div>
      <Button size="lg" block iconRight={<ArrowRight />} onClick={() => upd((x, dd) => { x.plan = { on: true, tasks: genPlan(dd.ta.sel, dd.ta.P.tiempo) }; })}>Generar mi plan</Button>
    </div>
  );
  const tk = w.plan.tasks, pp = taPlanProg(d), nx = tk.filter((x: any) => !x.ok).sort((a: any, b: any) => a.w - b.w)[0];
  const toggle = (id: string) => upd((x) => { const t = x.plan.tasks.find((y: any) => y.id === id); if (t) { t.ok = !t.ok; if (t.ok && x.plan.tasks.every((y: any) => y.ok)) { setParty(true); setTimeout(() => setParty(false), 1500); } } });
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={TBACK} kicker="Plan de 30 días" title={o.n} />
      <Card className="relative flex flex-col gap-3">
        <Celebrate show={party} />
        <Progress value={pp.n} max={pp.t} label="Tu avance" right={`${pp.n} de ${pp.t}`} />
        <p className="text-[.92rem]">{nx ? <><b>Siguiente:</b> Semana {nx.w}: {nx.t}</> : <b>¡Completaste tu plan! Registrá tus resultados.</b>}</p>
      </Card>
      {[1, 2, 3, 4].map((n) => {
        const l = tk.filter((x: any) => x.w === n), h = l.reduce((a: number, x: any) => a + x.h, 0), dn = l.filter((x: any) => x.ok).length;
        return (
          <Card key={n} className="flex flex-col gap-1">
            <div className="flex items-center justify-between"><h3 className="text-[1.2rem]">Semana {n}</h3><span className="text-[.85rem] text-muted num">{dn} de {l.length} · ~{fmt(h, 1)} h</span></div>
            {cap && h > cap && <p className="text-[.85rem] bg-warn text-warnink rounded-lg px-3 py-2 mt-1">Esta semana pide ~{fmt(h, 1)} h y indicaste ~{cap}: podés mover tareas con las flechas.</p>}
            {l.length ? l.map((x: any) => (
              <CheckRow key={x.id} done={x.ok} onToggle={() => toggle(x.id)}
                sub={<span className="flex flex-wrap items-center gap-1.5 mt-1">
                  {x.go && <Button size="sm" variant="quiet" to={x.go} iconRight={<ExternalLink />}>Abrir</Button>}
                  <button aria-label="Pasar a la semana anterior" disabled={x.w <= 1} onClick={() => upd((y) => { const t = y.plan.tasks.find((z: any) => z.id === x.id); if (t) t.w = Math.max(1, t.w - 1); })} className="grid place-items-center size-9 rounded-full border border-line disabled:opacity-30"><ChevronLeft className="size-4" /></button>
                  <button aria-label="Pasar a la semana siguiente" disabled={x.w >= 4} onClick={() => upd((y) => { const t = y.plan.tasks.find((z: any) => z.id === x.id); if (t) t.w = Math.min(4, t.w + 1); })} className="grid place-items-center size-9 rounded-full border border-line disabled:opacity-30"><ChevronRight className="size-4" /></button>
                  {x.own && <button aria-label="Quitar tarea" onClick={() => upd((y) => { y.plan.tasks = y.plan.tasks.filter((z: any) => z.id !== x.id); })} className="grid place-items-center size-9 rounded-full border border-line text-muted hover:text-bad"><Trash2 className="size-4" /></button>}
                </span>}>{x.t}</CheckRow>
            )) : <p className="text-muted text-[.9rem] py-2">Sin tareas.</p>}
          </Card>
        );
      })}
      <Card className="flex flex-col gap-3">
        <h3 className="text-[1.1rem]">Agregar una tarea</h3>
        <TextInput label="Tarea" value={nt} onChange={setNt} placeholder="Ej: pedir fotos a mi hermana" />
        <div className="flex gap-2 items-center">
          <select aria-label="Semana" value={nw} onChange={(e) => setNw(e.target.value)} className="!w-auto">{[1, 2, 3, 4].map((n) => <option key={n} value={n}>Semana {n}</option>)}</select>
          <Button size="sm" icon={<Plus />} onClick={() => { if (!nt.trim()) { toast('Escribí la tarea'); return; } upd((x) => { x.plan.tasks.push({ id: uid(), w: +nw, t: nt.trim(), h: 1, go: '', ok: false, own: true }); }); setNt(''); }}>Agregar</Button>
        </div>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button to="/finanzas/talento/seguimiento">Ir al seguimiento</Button>
        {!confirm ? <Button variant="ghost" icon={<RefreshCw />} onClick={() => setConfirm(true)}>Rehacer el plan</Button>
          : <Button variant="danger" onClick={() => { upd((x, dd) => { x.plan = { on: true, tasks: genPlan(dd.ta.sel, dd.ta.P.tiempo) }; }); setConfirm(false); toast('Plan rehecho'); }}>Sí, rehacer (se pierde tu avance)</Button>}
      </div>
    </div>
  );
}

export function Seg() {
  const d = useStore((s) => s.d), w = W(d);
  if (!w) return <NeedSel title="Seguimiento" />;
  const o = OP(d.ta.sel), S = w.seg, pc = precioCalc(w)!;
  const set = (k: keyof Work['seg']) => (v: string) => upd((x) => { x.seg[k] = v; });
  const c = Math.max(pn(S.cont), 0), q = Math.max(pn(S.cons), 0), t = Math.max(pn(S.trab), 0), ing = Math.max(pn(S.ing), 0);
  const r1 = c ? q / c : 0, r2 = q ? t / q : 0, sug: string[] = [];
  if (c > 0) {
    if (q === 0) sug.push('Nadie consultó todavía: podría servir revisar tu mensaje, tu oferta o a quién se lo enviás.');
    else if (r1 < 0.2) sug.push('Pocas consultas en relación con los contactos: probá un mensaje más claro o ofrecelo a otro tipo de cliente.');
    if (q > 0 && t === 0) sug.push('Hubo consultas pero ningún trabajo: revisá precio, plazos y cómo respondés.');
    else if (q > 0 && r2 < 0.3) sug.push('Pocas consultas se concretan: puede ayudar pedir una seña, aclarar el precio o dar un plazo concreto.');
    if (t > 0 && r1 >= 0.2 && r2 >= 0.3) sug.push('Buen avance: repetí lo que funcionó y pedí recomendaciones a quienes ya te contrataron.');
  }
  const Bar = ({ l, v }: { l: string; v: number }) => <Progress value={v} max={c || 1} label={l} right={fmt(v)} />;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader back={TBACK} kicker="Mi talento" title="Seguimiento y mejora" lead={<>{o.n}. Anotá lo que va pasando para decidir con datos.</>} />
      <Card className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Personas contactadas" htmlFor="s1"><TextInput id="s1" numeric value={S.cont} onChange={set('cont')} placeholder="0" /></Field>
          <Field label="Consultas recibidas" htmlFor="s2"><TextInput id="s2" numeric value={S.cons} onChange={set('cons')} placeholder="0" /></Field>
          <Field label="Trabajos concretados" htmlFor="s3"><TextInput id="s3" numeric value={S.trab} onChange={set('trab')} placeholder="0" /></Field>
          <Field label="Ingresos cobrados" htmlFor="s4"><MoneyInput id="s4" value={S.ing} onChange={set('ing')} /></Field>
        </div>
        <Field label="¿Qué aprendí? ¿Qué cambiaría?" htmlFor="s5"><TextArea id="s5" value={S.nota} onChange={set('nota')} /></Field>
      </Card>
      {c > 0 ? (<>
        <Card className="flex flex-col gap-4">
          <Bar l="Personas contactadas" v={c} /><Bar l="Consultas recibidas" v={q} /><Bar l="Trabajos concretados" v={t} />
          <div><KV k="De cada 10 contactos, consultan" v={fmt(r1 * 10, 1)} />{q > 0 && <KV k="De cada 10 consultas, se concretan" v={fmt(r2 * 10, 1)} />}
            {t > 0 && ing > 0 && <KV k="Ingreso promedio por trabajo" v={money(ing / t)} />}{t > 0 && ing > 0 && pc.ok && <KV k="Tu precio orientativo" v={money(pc.redo)} />}</div>
        </Card>
        {sug.length > 0 && <Note tone="info" title="Para mejorar"><Bullets items={sug} /></Note>}
      </>) : <p className="text-muted">Cargá cuántas personas contactaste para ver tu embudo.</p>}
      <div className="flex flex-wrap gap-3"><Button to="/finanzas/talento/plan">Volver al plan</Button><Button variant="ghost" to="/finanzas/talento/comparar">Comparar otra oportunidad</Button></div>
    </div>
  );
}
