/* Mis vencimientos: qué tengo que pagar este mes, cuándo y cuánto.
   Marcás lo que ya pagaste, ves lo que falta y podés llevar recordatorios al calendario del celular. */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, CalendarPlus, Share2, Trash2, Pencil } from 'lucide-react';
import { useStore, mut, type Data } from '../../store';
import { PageHeader, Stagger, Item, Button, MoneyInput, TextInput, Note, cx } from '../../ui';
import { money, pn, uid } from '../../lib/format';
import { wa, downloadText } from '../../lib/share';
import { toast } from '../../ui/toast';

const SUGERIDOS = ['Luz', 'Gas', 'Agua', 'Internet', 'Celular', 'Tarjeta de crédito', 'Alquiler o expensas', 'Obra social o prepaga', 'Impuestos municipales', 'Seguro'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const mesKey = (dt = new Date()) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
const diasEnMes = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();

export type Estado = { id: string; n: string; dia: number; m: number; pagado: boolean; diff: number; txt: string; tone: 'ok' | 'hoy' | 'pronto' | 'vencido' | 'luego' };
export function estados(d: Data, now = new Date()): Estado[] {
  const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate()), pag = d.venc.pagos[mesKey(now)] || {};
  return d.venc.items.filter((x) => x.n || x.m).map((x) => {
    const dia = Math.min(Math.max(Math.round(pn(x.dia)) || 1, 1), diasEnMes(now));
    const due = new Date(now.getFullYear(), now.getMonth(), dia), diff = Math.round((due.getTime() - hoy.getTime()) / 864e5);
    const pagado = !!pag[x.id];
    const txt = pagado ? 'Pagado' : diff < 0 ? (diff === -1 ? 'Venció ayer' : `Venció el ${dia}`) : diff === 0 ? 'Vence hoy' : diff === 1 ? 'Vence mañana' : diff <= 7 ? `Vence en ${diff} días` : `Vence el ${dia}`;
    const tone: Estado['tone'] = pagado ? 'ok' : diff < 0 ? 'vencido' : diff === 0 ? 'hoy' : diff <= 7 ? 'pronto' : 'luego';
    return { id: x.id, n: x.n || 'Sin nombre', dia, m: pn(x.m), pagado, diff, txt, tone };
  }).sort((a, b) => Number(a.pagado) - Number(b.pagado) || a.diff - b.diff);
}
/** Lo urgente para el inicio: vencidos o que vencen en los próximos 7 días */
export const urgentes = (d: Data) => estados(d).filter((e) => !e.pagado && e.diff <= 7);

const TONE: Record<Estado['tone'], string> = { ok: 'bg-mint text-accent', hoy: 'bg-warn text-warnink', pronto: 'bg-ambersoft text-amber', vencido: 'bg-badsoft text-bad', luego: 'bg-sunk text-muted' };

/* Archivo de calendario: un recordatorio mensual por cada pago, con aviso el día anterior a las 9 */
function ics(d: Data) {
  const now = new Date(), stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const ev = d.venc.items.filter((x) => x.n).map((x) => {
    const dia = Math.min(Math.max(Math.round(pn(x.dia)) || 1, 1), 31);
    let start = new Date(now.getFullYear(), now.getMonth(), Math.min(dia, diasEnMes(now)));
    if (start < new Date(now.getFullYear(), now.getMonth(), now.getDate())) start = new Date(now.getFullYear(), now.getMonth() + 1, Math.min(dia, diasEnMes(new Date(now.getFullYear(), now.getMonth() + 1, 1))));
    const ymd = `${start.getFullYear()}${String(start.getMonth() + 1).padStart(2, '0')}${String(start.getDate()).padStart(2, '0')}`;
    const monto = pn(x.m) > 0 ? ' (' + money(pn(x.m)) + ')' : '';
    return ['BEGIN:VEVENT', `UID:${x.id}@aliada.digital`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd}`, `RRULE:FREQ=MONTHLY;BYMONTHDAY=${dia > 28 ? -1 : dia}`,
      `SUMMARY:Pagar ${x.n}${monto}`, 'DESCRIPTION:Recordatorio de Aliada Digital', 'BEGIN:VALARM', 'TRIGGER:-PT15H', 'ACTION:DISPLAY', `DESCRIPTION:Mañana vence ${x.n}`, 'END:VALARM', 'END:VEVENT'].join('\r\n');
  });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aliada Digital//Vencimientos//ES', 'CALSCALE:GREGORIAN', ...ev, 'END:VCALENDAR'].join('\r\n');
}
function textoMes(d: Data) {
  const E = estados(d), now = new Date();
  const L = ['Mis pagos de ' + MESES[now.getMonth()], ''];
  E.forEach((e) => L.push(`${e.pagado ? '✔' : '•'} ${e.n}: ${e.m > 0 ? money(e.m) : 'monto a confirmar'} · ${e.pagado ? 'pagado' : 'vence el ' + e.dia}`));
  const falta = E.filter((e) => !e.pagado).reduce((t, e) => t + e.m, 0);
  L.push('', 'Falta pagar: ' + money(falta));
  return L.join('\n');
}

export default function Vencimientos() {
  const d = useStore((s) => s.d), E = estados(d), now = new Date(), mk = mesKey(now);
  const [edit, setEdit] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState(d.venc.items.length === 0);
  const total = E.reduce((t, e) => t + e.m, 0), pagado = E.filter((e) => e.pagado).reduce((t, e) => t + e.m, 0);
  const toggle = (id: string) => mut((x) => { const m = (x.venc.pagos[mk] ||= {}); if (m[id]) delete m[id]; else m[id] = 1; });

  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/finanzas', label: 'Finanzas' }} title="Mis vencimientos" lead="Anotá una vez lo que pagás todos los meses. La app te avisa qué vence primero y cuánto te falta pagar." /></Item>

      {E.length > 0 && (
        <Item><section className="rounded-xl2 bg-sunk p-4 sm:p-5 flex flex-col gap-3" aria-label={'Resumen de ' + MESES[now.getMonth()]}>
          <div>
            <span className="block text-[.95rem] text-muted">Te falta pagar en {MESES[now.getMonth()]}</span>
            <b className="block font-head font-semibold text-[1.9rem] leading-tight num">{money(total - pagado)}</b>
            <span className="block text-[.9rem] text-muted num">Ya pagaste {money(pagado)} de {money(total)}</span>
          </div>
          <div className="h-2 rounded-full bg-line overflow-hidden" aria-hidden><div className="h-full bg-accent rounded-full transition-[width] duration-300" style={{ width: (total ? (pagado / total) * 100 : 0) + '%' }} /></div>
        </section></Item>
      )}

      {E.length > 0 && (
        <Item><ul className="rounded-xl2 bg-surface border border-line shadow-card divide-y divide-line overflow-hidden">
          {E.map((e) => (
            <li key={e.id} className="p-3.5 sm:p-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => toggle(e.id)} aria-pressed={e.pagado} aria-label={(e.pagado ? 'Desmarcar ' : 'Marcar como pagado: ') + e.n}
                  className={cx('press grid place-items-center size-12 rounded-full border-2 shrink-0 transition-colors duration-150', e.pagado ? 'bg-accent border-accent text-onaccent' : 'border-line bg-surface text-transparent')}>
                  <Check className="size-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <b className={cx('block text-[1.05rem] leading-tight break-words', e.pagado && 'text-muted line-through decoration-1')}>{e.n}</b>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className={cx('inline-flex rounded-full px-2.5 py-0.5 text-[.8rem] font-semibold', TONE[e.tone])}>{e.txt}</span>
                    {e.m > 0 && <span className="num text-[.95rem] font-semibold">{money(e.m)}</span>}
                  </span>
                  {e.tone === 'vencido' && <span className="block text-[.85rem] text-muted mt-1">¿Ya lo pagaste? Tocá el círculo para marcarlo.</span>}
                </div>
                <button type="button" onClick={() => setEdit(edit === e.id ? null : e.id)} aria-label={'Editar ' + e.n} aria-expanded={edit === e.id}
                  className="press grid place-items-center size-11 rounded-full text-muted hover:bg-sunk shrink-0"><Pencil className="size-5" /></button>
              </div>
              <AnimatePresence initial={false}>{edit === e.id && <Editor id={e.id} onClose={() => setEdit(null)} />}</AnimatePresence>
            </li>
          ))}
        </ul></Item>
      )}

      <Item>
        <AnimatePresence initial={false} mode="wait">
          {nuevo ? <Nuevo key="n" onDone={() => setNuevo(false)} first={E.length === 0} />
            : <Button key="b" variant="secondary" icon={<Plus />} onClick={() => setNuevo(true)}>Agregar un pago</Button>}
        </AnimatePresence>
      </Item>

      {E.length > 0 && (
        <Item className="flex flex-wrap gap-3">
          <Button variant="ghost" icon={<CalendarPlus />} onClick={() => { const ok = downloadText('mis-vencimientos.ics', ics(d), 'text/calendar'); toast(ok ? 'Abrí el archivo para sumar los recordatorios a tu calendario' : 'No se pudo crear el archivo'); }}>Recordatorios en mi calendario</Button>
          <Button variant="ghost" icon={<Share2 />} href={wa(textoMes(d))}>Mandar por WhatsApp</Button>
        </Item>
      )}
      {E.length > 0 && <Item><p className="text-[.85rem] text-muted">Al empezar un mes nuevo, todos los pagos vuelven a "pendiente". Los recordatorios del calendario avisan el día anterior a las 9.</p></Item>}
    </Stagger>
  );
}

function Nuevo({ onDone, first }: { onDone: () => void; first: boolean }) {
  const [n, setN] = useState(''), [dia, setDia] = useState(''), [m, setM] = useState('');
  const ok = n.trim() && pn(dia) >= 1 && pn(dia) <= 31;
  const save = () => { if (!ok) return; mut((x) => { x.venc.items.push({ id: uid(), n: n.trim(), dia: String(Math.round(pn(dia))), m }); }); setN(''); setDia(''); setM(''); toast('Pago agregado'); if (!first) onDone(); };
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      className="rounded-xl2 bg-surface border border-line p-4 flex flex-col gap-4">
      <b className="text-[1.1rem]">{first ? 'Empecemos con tu primer pago' : 'Nuevo pago'}</b>
      <div className="flex flex-col gap-2">
        <label htmlFor="vn" className="font-bold text-[.95rem]">¿Qué pagás?</label>
        <div className="flex flex-wrap gap-2">{SUGERIDOS.map((s) => <button key={s} type="button" onClick={() => setN(s)} className={cx('press min-h-[2.6rem] px-3.5 rounded-full border text-[.9rem] font-semibold', n === s ? 'bg-ink text-bg border-ink' : 'border-line bg-surface')}>{s}</button>)}</div>
        <TextInput id="vn" value={n} onChange={setN} placeholder="O escribilo: ej. cuota del préstamo" />
      </div>
      <div className="grid grid-cols-[7rem_1fr] gap-3">
        <div className="flex flex-col gap-1.5"><label htmlFor="vd" className="font-bold text-[.95rem]">Día que vence</label><TextInput id="vd" numeric value={dia} onChange={setDia} placeholder="Ej: 10" /></div>
        <div className="flex flex-col gap-1.5 min-w-0"><label htmlFor="vm" className="font-bold text-[.95rem]">Cuánto, más o menos</label><MoneyInput id="vm" value={m} onChange={setM} /></div>
      </div>
      {dia && !(pn(dia) >= 1 && pn(dia) <= 31) && <Note tone="warn">El día tiene que ser un número del 1 al 31.</Note>}
      <div className="flex flex-wrap gap-3">
        <Button icon={<Plus />} disabled={!ok} onClick={save}>Agregar</Button>
        {!first && <Button variant="ghost" onClick={onDone}>Cancelar</Button>}
      </div>
    </motion.div>
  );
}

function Editor({ id, onClose }: { id: string; onClose: () => void }) {
  const it = useStore((s) => s.d.venc.items.find((x) => x.id === id));
  const [conf, setConf] = useState(false);
  if (!it) return null;
  const set = (k: 'n' | 'dia' | 'm') => (v: string) => mut((x) => { const o = x.venc.items.find((y) => y.id === id); if (o) o[k] = v; });
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
      <div className="pt-4 flex flex-col gap-3">
        <TextInput label="Nombre" value={it.n} onChange={set('n')} />
        <div className="grid grid-cols-[7rem_1fr] gap-3"><TextInput label="Día" numeric value={it.dia} onChange={set('dia')} /><MoneyInput label="Monto" value={it.m} onChange={set('m')} /></div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onClose}>Listo</Button>
          {!conf ? <Button size="sm" variant="ghost" icon={<Trash2 />} onClick={() => setConf(true)}>Quitar</Button>
            : <Button size="sm" variant="danger" icon={<Trash2 />} onClick={() => { mut((x) => { x.venc.items = x.venc.items.filter((y) => y.id !== id); }); toast('Pago quitado'); }}>Sí, quitar {it.n}</Button>}
        </div>
      </div>
    </motion.div>
  );
}
