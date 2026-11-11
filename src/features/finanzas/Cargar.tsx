/* Cargar sin escribir: decirlo, sacarle una foto a la boleta, traer el resumen del banco o mandarlo desde otra app.
   Las cuatro puertas llegan al mismo lugar: una lista de "esto entendí" que la persona revisa y corrige antes de guardar.
   Nada sale del dispositivo (salvo el dictado, que lo hace el propio celular). */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mic, Square, Camera, FileText, Share2, Check, Pencil, Undo2, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, Stagger, Item, Button, MoneyInput, TextInput, Note, Chips, Disclosure, Bullets, Mascot, Field, cx } from '../../ui';
import { toast } from '../../ui/toast';
import { money, pn } from '../../lib/format';
import { entenderDicho, entenderTexto, rubroPara, type Borrador } from '../../lib/entender';
import { guardar, deshacer, type Fila, type Origen } from '../../lib/cargar';
import { leerArchivo, porQueFallo } from '../../lib/leer';
import { hayDictado, useDictado } from '../../lib/voz';
import { isIOS } from '../../lib/device';

const EASE = [0.23, 1, 0.32, 1] as const;
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fechaCorta = (f?: string) => { if (!f) return ''; const [, m, d] = f.split('-').map(Number); return `${d} ${MESES[m - 1]}`; };
export const CACHE_COMPARTIDO = 'aliada-compartido';

type Paso = { k: 'inicio' } | { k: 'leyendo'; p: number; que: string } | { k: 'revisar'; src: Origen; clase: string } | { k: 'listo'; gastos: number; pagos: number };

export default function Cargar() {
  const d = useStore((s) => s.d);
  const nav = useNavigate();
  const [qs, setQs] = useSearchParams();
  const rubros = d.plata.gas.filter((g) => g.n.trim());
  const [paso, setPaso] = useState<Paso>({ k: 'inicio' });
  const [filas, setFilas] = useState<Fila[]>([]);
  const [frase, setFrase] = useState('');
  const [aviso, setAviso] = useState('');

  const aFilas = (items: Borrador[]): Fila[] => items.map((b) => ({ ...b, ok: !b.ingreso, r: rubroPara(b.n, rubros) }));
  const revisar = (items: Borrador[], src: Origen, clase = '') => {
    if (!items.length) { setAviso(src === 'voz' ? 'No encontré un monto. Decí qué fue y cuánto, por ejemplo: «farmacia ocho mil quinientos».' : 'No encontré montos ahí. Probá con otra foto o archivo, o decilo con tus palabras.'); setPaso({ k: 'inicio' }); return; }
    setAviso(''); setFilas(aFilas(items)); setPaso({ k: 'revisar', src, clase });
    window.scrollTo({ top: 0 });
  };

  const dic = useDictado((t, fin) => { setFrase(t); if (fin && t) revisar(entenderDicho(t), 'voz'); });
  const entenderFrase = () => { if (frase.trim()) revisar(entenderDicho(frase), 'voz'); };

  const leer = async (file: File | undefined, src: Origen) => {
    if (!file) return;
    const foto = file.type.startsWith('image/');
    setAviso(''); setPaso({ k: 'leyendo', p: 0, que: foto ? 'Leyendo la foto' : 'Leyendo el archivo' });
    try {
      const r = await leerArchivo(file, (p) => setPaso((s) => (s.k === 'leyendo' ? { ...s, p } : s)));
      revisar(r.items, src, r.clase);
    } catch (e) { setAviso(porQueFallo(e)); setPaso({ k: 'inicio' }); }
  };

  /* Desde el botón del micrófono del Inicio: se pone a escuchar apenas abre */
  useEffect(() => {
    if (qs.get('voz') !== '1') return;
    setQs({}, { replace: true });
    if (hayDictado()) dic.empezar(); else document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Lo que llegó desde "Compartir" de otra app: el celular lo dejó guardado y acá lo levantamos */
  useEffect(() => {
    if (qs.get('de') !== 'compartido') return;
    setQs({}, { replace: true });
    (async () => {
      try {
        const c = await caches.open(CACHE_COMPARTIDO), claves = await c.keys();
        const arch = claves.find((k) => /archivo-0$/.test(k.url)), txt = claves.find((k) => /texto$/.test(k.url));
        if (arch) {
          const r = await c.match(arch), blob = await r!.blob();
          const nombre = decodeURIComponent(r!.headers.get('x-nombre') || 'archivo');
          await leer(new File([blob], nombre, { type: blob.type }), 'compartido');
        } else if (txt) {
          const t = await (await c.match(txt))!.text();
          revisar(entenderTexto(t).items, 'compartido');
        }
        await Promise.all(claves.map((k) => c.delete(k)));
      } catch { setAviso('No pude abrir lo que compartiste. Probá de nuevo.'); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const elegidas = filas.filter((f) => f.ok);
  const nG = elegidas.filter((f) => f.tipo === 'gasto').length, nP = elegidas.length - nG;
  const totalG = elegidas.filter((f) => f.tipo === 'gasto').reduce((t, f) => t + f.m, 0);
  const confirmar = () => {
    if (paso.k !== 'revisar') return;
    const r = guardar(filas, paso.src);
    setFilas([]); setFrase(''); setPaso({ k: 'listo', ...r });
    window.scrollTo({ top: 0 });
  };

  return (
    <Stagger className="flex flex-col gap-5">
      <Item>
        <PageHeader back={{ to: '/finanzas', label: 'Finanzas' }} title={paso.k === 'revisar' ? 'Esto entendí' : 'Cargar sin escribir'}
          lead={paso.k === 'revisar' ? 'Revisá y corregí lo que haga falta. Nada se guarda hasta que toques Guardar.' : 'Decilo, sacale una foto o traé el resumen. Antes de guardar, siempre vas a ver lo que entendí.'} />
      </Item>

      {aviso && paso.k === 'inicio' && <Item><Note tone="warn">{aviso}</Note></Item>}

      {paso.k === 'inicio' && (<>
        <Item><Decilo frase={frase} setFrase={setFrase} dic={dic} onEntender={entenderFrase} /></Item>
        <Item className="grid grid-cols-2 gap-3">
          <Puerta icon={<Camera />} title="Foto de una boleta" accept="image/*" capture onFile={(f) => leer(f, 'foto')} />
          <Puerta icon={<FileText />} title="Resumen del banco" accept=".pdf,.csv,.txt,image/*,application/pdf,text/csv,text/plain" onFile={(f) => leer(f, 'archivo')} />
        </Item>
        <Item>
          <Disclosure title="Mandarlo desde otra app" icon={<Share2 className="size-5 text-muted" />}>
            <div className="flex flex-col gap-3">
              <Bullets ordered items={['En la app del banco o de la billetera, abrí el comprobante o el resumen.', <>Tocá <b>Compartir</b>.</>, <>Elegí <b>Aliada</b> en la lista. Se abre acá, listo para revisar.</>]} />
              <p className="text-[.9rem] text-muted">{isIOS() ? 'En iPhone, Aliada no aparece en esa lista: sacá una captura de pantalla y usá «Foto de una boleta».' : 'Aliada aparece en la lista cuando está instalada en el celular (Ajustes → Instalar).'}</p>
            </div>
          </Disclosure>
        </Item>
        <Item><Recientes /></Item>
        <Item><p className="text-[.85rem] text-muted">La foto y los archivos se leen en este celular: no se envían a ningún lado. La primera foto tarda un poco más porque se baja el lector (unos 6 MB).</p></Item>
      </>)}

      {paso.k === 'leyendo' && (
        <Item>
          <section className="rounded-xl3 border border-line bg-surface p-5 flex items-center gap-4" role="status" aria-live="polite">
            <Mascot size={72} act="piensa" />
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <b className="text-[1.15rem]">{paso.que}…</b>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--viz-track)' }}>
                <div className="h-full w-full rounded-full bg-accent origin-left transition-transform duration-300 [transition-timing-function:cubic-bezier(.23,1,.32,1)]" style={{ transform: `scaleX(${Math.max(0.04, paso.p)})` }} />
              </div>
              <span className="text-[.9rem] text-muted">Queda en este celular. Puede tardar unos segundos.</span>
            </div>
          </section>
        </Item>
      )}

      {paso.k === 'revisar' && (<>
        {paso.clase === 'resumen' && filas.some((f) => f.ingreso) && <Item><Note tone="info">Lo que es plata que entró viene destildado: acá solo se anotan gastos.</Note></Item>}
        {!rubros.length && <Item><Note tone="warn">Todavía no tenés rubros de gastos. Cargalos en «Mis números» para poder anotar gastos.</Note></Item>}
        <Item>
          <ul className="rounded-xl2 bg-surface border border-line shadow-card divide-y divide-line overflow-hidden">
            {filas.map((f) => <FilaRev key={f.id} f={f} rubros={rubros} abierta={filas.length <= 2} onChange={(nf) => setFilas((L) => L.map((x) => (x.id === f.id ? nf : x)))} />)}
          </ul>
        </Item>
        <Item>
          <section className="rounded-xl2 bg-sunk p-4 flex flex-col gap-3">
            <p className="text-[1.02rem]">
              {elegidas.length === 0 ? 'No hay nada tildado para guardar.'
                : <>Vas a guardar {nG > 0 && <b>{nG} {nG === 1 ? 'gasto' : 'gastos'} por {money(totalG)}</b>}{nG > 0 && nP > 0 && ' y '}{nP > 0 && <b>{nP} {nP === 1 ? 'pago' : 'pagos'} en Mis vencimientos</b>}.</>}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button icon={<Check />} disabled={!elegidas.length} onClick={confirmar}>Guardar</Button>
              <Button variant="ghost" onClick={() => { setFilas([]); setPaso({ k: 'inicio' }); }}>Descartar</Button>
            </div>
          </section>
        </Item>
      </>)}

      {paso.k === 'listo' && (
        <Item>
          <section className="rounded-xl3 border border-line bg-surface p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Mascot size={76} act="festeja" />
              <div className="min-w-0">
                <h2 className="text-[1.35rem] leading-tight">¡Listo, guardado!</h2>
                <p className="text-muted mt-1">{[paso.gastos && `${paso.gastos} ${paso.gastos === 1 ? 'gasto anotado' : 'gastos anotados'} en tu mes`, paso.pagos && `${paso.pagos} ${paso.pagos === 1 ? 'pago' : 'pagos'} en Mis vencimientos`].filter(Boolean).join(' y ')}.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button icon={<Sparkles />} onClick={() => setPaso({ k: 'inicio' })}>Cargar otra cosa</Button>
              {paso.gastos > 0 && <Button variant="secondary" iconRight={<ArrowRight />} onClick={() => nav('/revision')}>Ver cómo va mi mes</Button>}
              {paso.pagos > 0 && <Button variant="secondary" iconRight={<ArrowRight />} onClick={() => nav('/finanzas/vencimientos')}>Ver mis vencimientos</Button>}
            </div>
          </section>
        </Item>
      )}
    </Stagger>
  );
}

/* ---------- Decirlo (o escribirlo) en una frase ---------- */
function Decilo({ frase, setFrase, dic, onEntender }: { frase: string; setFrase: (v: string) => void; dic: ReturnType<typeof useDictado>; onEntender: () => void }) {
  const voz = hayDictado();
  return (
    <section className="rounded-xl3 border border-line bg-surface p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {voz && (
          <button type="button" onClick={() => (dic.on ? dic.parar() : dic.empezar())} aria-pressed={dic.on} aria-label={dic.on ? 'Dejar de escuchar' : 'Hablar: decí qué gastaste y cuánto'}
            className={cx('press relative grid place-items-center size-[4.5rem] rounded-full shrink-0 text-onaccent transition-colors duration-150', dic.on ? 'bg-coral' : 'bg-accent')}>
            {dic.on && <span className="absolute inset-0 rounded-full bg-coral/40 animate-ping" aria-hidden />}
            <span className="relative">{dic.on ? <Square className="size-7" fill="currentColor" /> : <Mic className="size-8" />}</span>
          </button>
        )}
        <div className="min-w-0">
          <h2 className="text-[1.25rem] leading-tight">{dic.on ? 'Te escucho…' : voz ? 'Decilo' : 'Escribilo en una frase'}</h2>
          <p className="text-muted text-[.95rem] mt-1">{dic.on ? 'Decí qué fue y cuánto.' : <>Por ejemplo: «farmacia ocho mil quinientos» o «luz 25 mil, vence el 10».</>}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <textarea value={frase} onChange={(e) => setFrase(e.target.value)} rows={2} aria-label="Qué gastaste y cuánto" placeholder={voz ? 'O escribilo acá' : 'Ej: farmacia 8.500 y nafta 20 mil'} className="!min-h-[4.2rem]"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEntender(); } }} />
        {frase.trim() && !dic.on && <div><Button size="sm" iconRight={<ArrowRight />} onClick={onEntender}>Entender</Button></div>}
      </div>
      {dic.error && <Note tone="warn">{dic.error}</Note>}
      {voz && <p className="text-[.82rem] text-muted">El dictado lo hace tu celular (el servicio de voz de Google o de Apple). Aliada no graba ni guarda el audio.</p>}
    </section>
  );
}

/* ---------- Una puerta: botón grande que abre la cámara o los archivos ---------- */
function Puerta({ icon, title, accept, capture, onFile }: { icon: React.ReactNode; title: string; accept: string; capture?: boolean; onFile: (f?: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.click()} className="press rounded-xl2 border border-line bg-surface p-4 flex flex-col items-start gap-3 text-left min-h-[7.5rem]">
        <span className="grid place-items-center size-12 rounded-lg bg-mint text-teal [&_svg]:size-6">{icon}</span>
        <span className="font-head font-semibold text-[1.05rem] leading-tight">{title}</span>
      </button>
      <input ref={ref} type="file" accept={accept} {...(capture ? { capture: 'environment' as const } : {})} className="sr-only" tabIndex={-1} aria-hidden
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; onFile(f); }} />
    </>
  );
}

/* ---------- Una fila de la revisión ---------- */
function FilaRev({ f, rubros, abierta, onChange }: { f: Fila; rubros: { id: string; n: string }[]; abierta: boolean; onChange: (f: Fila) => void }) {
  const [edit, setEdit] = useState(abierta);
  const [monto, setMonto] = useState(() => new Intl.NumberFormat('es-AR').format(f.m));
  const reduce = useReducedMotion();
  const rubro = rubros.find((r) => r.id === f.r);
  const donde = f.tipo === 'pago' ? `Pago de todos los meses${f.dia ? ' · vence el ' + f.dia : ''}` : rubro ? rubro.n : 'Sin rubro';
  return (
    <li className={cx('p-3.5 sm:p-4 transition-opacity duration-150', !f.ok && 'opacity-60')}>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange({ ...f, ok: !f.ok })} aria-pressed={f.ok} aria-label={(f.ok ? 'No guardar: ' : 'Guardar: ') + f.n}
          className={cx('press grid place-items-center size-12 rounded-full border-2 shrink-0 transition-colors duration-150', f.ok ? 'bg-accent border-accent text-onaccent' : 'border-line bg-surface text-transparent')}>
          <Check className="size-6" />
        </button>
        <div className="flex-1 min-w-0">
          <b className="block text-[1.05rem] leading-tight [overflow-wrap:anywhere]">{f.n || 'Sin nombre'}</b>
          <span className="block text-[.9rem] text-muted mt-1"><span className="num font-bold text-ink text-[1rem]">{money(f.m)}</span> · {f.ingreso && !f.ok ? 'Entró plata' : donde}{f.tipo === 'gasto' && f.f ? ' · ' + fechaCorta(f.f) : ''}</span>
        </div>
        <button type="button" onClick={() => setEdit(!edit)} aria-expanded={edit} aria-label={'Corregir ' + f.n} className="press grid place-items-center size-11 rounded-full text-muted hover:bg-sunk shrink-0"><Pencil className="size-5" /></button>
      </div>
      <AnimatePresence initial={false}>
        {edit && (
          <motion.div initial={reduce ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: EASE }} className="overflow-hidden">
            <div className="pt-4 flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Qué fue"><TextInput value={f.n} onChange={(v) => onChange({ ...f, n: v })} label="Qué fue" /></Field>
                <Field label="Cuánto"><MoneyInput value={monto} onChange={(v) => { setMonto(v); onChange({ ...f, m: Math.round(pn(v)) }); }} label="Cuánto" /></Field>
              </div>
              <Field label="¿Qué es?">
                <Chips options={[['gasto', 'Un gasto de este mes'], ['pago', 'Un pago de todos los meses']]} value={f.tipo} onChange={(v) => v && onChange({ ...f, tipo: v })} />
              </Field>
              {f.tipo === 'gasto' ? (
                <Field label="Rubro" htmlFor={'r' + f.id}>
                  <select id={'r' + f.id} value={f.r} onChange={(e) => onChange({ ...f, r: e.target.value })}>
                    {rubros.map((r) => <option key={r.id} value={r.id}>{r.n}</option>)}
                  </select>
                </Field>
              ) : (
                <Field label="Día del mes en que vence" htmlFor={'d' + f.id} hint="Queda en Mis vencimientos y se repite todos los meses.">
                  <TextInput id={'d' + f.id} numeric value={f.dia ? String(f.dia) : ''} placeholder="Ej: 10" className="!w-28" onChange={(v) => { const n = Math.round(pn(v)); onChange({ ...f, dia: n >= 1 && n <= 31 ? n : undefined }); }} />
                </Field>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ---------- Lo último que se cargó, con Deshacer ---------- */
function Recientes() {
  const mov = useStore((s) => s.d.plata.mov), gas = useStore((s) => s.d.plata.gas);
  if (!mov.length) return null;
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[1.15rem]">Lo último que cargaste</h2>
      <ul className="rounded-xl2 bg-surface border border-line divide-y divide-line overflow-hidden">
        {mov.slice(0, 5).map((m) => (
          <li key={m.id} className="flex items-center gap-3 p-3.5">
            <div className="flex-1 min-w-0">
              <b className="block leading-tight [overflow-wrap:anywhere]">{m.n}</b>
              <span className="block text-[.88rem] text-muted mt-1"><span className="num font-semibold text-ink">{money(m.m)}</span> · {gas.find((g) => g.id === m.r)?.n || 'Rubro borrado'} · {fechaCorta(m.f)}</span>
            </div>
            <button type="button" onClick={() => { if (deshacer(m.id)) toast('Deshecho: se restó de tu mes'); }} aria-label={'Deshacer ' + m.n}
              className="press inline-flex items-center gap-1.5 min-h-[2.75rem] px-3 rounded-full border border-line text-[.9rem] font-semibold"><Undo2 className="size-4" />Deshacer</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
