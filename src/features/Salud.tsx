/* Mi ficha de salud y emergencias: lo que un médico, una guardia o un familiar necesita saber rápido.
   Se guarda solo en este dispositivo. No pedimos DNI ni número de afiliado. */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Share2, Copy, Printer, Eye, Phone } from 'lucide-react';
import { useStore, mut, type Data } from '../store';
import { PageHeader, Stagger, Item, Field, TextInput, TextArea, Button, Note, Tabs, cx } from '../ui';
import { uid } from '../lib/format';
import { wa, copyText } from '../lib/share';

const SANGRE = ['No sé', '0+', '0−', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−'];

export function fichaTexto(d: Data) {
  const S = d.salud, L: string[] = ['FICHA DE SALUD Y EMERGENCIAS' + (d.perfil.nombre ? ' · ' + d.perfil.nombre : '')];
  if (S.sangre && S.sangre !== 'No sé') L.push('Grupo sanguíneo: ' + S.sangre);
  if (S.obra) L.push('Obra social o prepaga: ' + S.obra);
  if (S.medico) L.push('Médico/a de cabecera: ' + S.medico + (S.medTel ? ' · ' + S.medTel : ''));
  if (S.alergias) L.push('', 'ALERGIAS: ' + S.alergias);
  if (S.cond) L.push('', 'Condiciones de salud: ' + S.cond);
  const meds = S.meds.filter((m) => m.n);
  if (meds.length) { L.push('', 'Medicamentos:'); meds.forEach((m) => L.push('• ' + m.n + (m.dosis ? ' · ' + m.dosis : '') + (m.cuando ? ' · ' + m.cuando : ''))); }
  const con = S.contactos.filter((c) => c.n || c.tel);
  if (con.length) { L.push('', 'En caso de emergencia avisar a:'); con.forEach((c) => L.push('• ' + c.n + (c.rel ? ' (' + c.rel + ')' : '') + (c.tel ? ': ' + c.tel : ''))); }
  if (S.notas) L.push('', 'Notas: ' + S.notas);
  L.push('', 'Actualizada el ' + new Date().toLocaleDateString('es-AR'));
  return L.join('\n');
}
const vacia = (d: Data) => { const S = d.salud; return !(S.obra || S.medico || S.alergias || S.cond || S.meds.some((m) => m.n) || S.contactos.some((c) => c.n || c.tel)); };

export default function Salud() {
  const d = useStore((s) => s.d), S = d.salud;
  const [tab, setTab] = useState<'editar' | 'ver'>(vacia(d) ? 'editar' : 'ver');
  const set = (k: 'sangre' | 'obra' | 'medico' | 'medTel' | 'cond' | 'alergias' | 'notas') => (v: string) => mut((x) => { x.salud[k] = v; });

  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/', label: 'Inicio' }} title="Mi ficha de salud" lead="Tus medicamentos, alergias y a quién avisar, listos para mostrar en una consulta o una guardia, o para pegar en la heladera." /></Item>
      <Item><Tabs id="salud" tabs={[['ver', 'Ver mi ficha'], ['editar', 'Completar']]} value={tab} onChange={setTab} /></Item>

      <AnimatePresence mode="wait" initial={false}>
        {tab === 'ver' ? (
          <motion.div key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-4">
            {vacia(d) ? <Note tone="info">Todavía no cargaste datos. Tocá “Completar”: con medicamentos y un contacto ya sirve.</Note> : <Ficha d={d} />}
            {!vacia(d) && (
              <div className="flex flex-wrap gap-3 no-print">
                <Button icon={<Share2 />} href={wa(fichaTexto(d))}>Mandar por WhatsApp</Button>
                <Button variant="ghost" icon={<Copy />} onClick={() => copyText(fichaTexto(d))}>Copiar</Button>
                <Button variant="ghost" icon={<Printer />} onClick={() => window.print()}>Imprimir</Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-5">
            <section className="rounded-xl2 bg-surface border border-line p-4 sm:p-5 flex flex-col gap-4">
              <h2 className="text-[1.2rem]">Lo básico</h2>
              <Field label="Grupo sanguíneo">
                <div className="flex flex-wrap gap-2">{SANGRE.map((g) => <button key={g} type="button" onClick={() => set('sangre')(g)} aria-pressed={S.sangre === g} className={cx('press min-w-[3.2rem] min-h-[2.8rem] px-3 rounded-full border font-bold', S.sangre === g ? 'bg-ink text-bg border-ink' : 'border-line bg-surface')}>{g}</button>)}</div>
              </Field>
              <Field label="Obra social o prepaga" htmlFor="so" hint="Solo el nombre. El número de afiliado no hace falta acá."><TextInput id="so" value={S.obra} onChange={set('obra')} placeholder="Ej: PAMI, OSDE, IOMA" /></Field>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Médico/a de cabecera" htmlFor="sm"><TextInput id="sm" value={S.medico} onChange={set('medico')} placeholder="Nombre" /></Field>
                <Field label="Su teléfono" htmlFor="st"><input id="st" type="tel" inputMode="tel" autoComplete="off" value={S.medTel} onChange={(e) => set('medTel')(e.target.value)} placeholder="Ej: 11 4444 5555" /></Field>
              </div>
            </section>

            <section className="rounded-xl2 bg-surface border border-line p-4 sm:p-5 flex flex-col gap-4">
              <h2 className="text-[1.2rem]">Lo más importante en una urgencia</h2>
              <Field label="Alergias" htmlFor="sa" hint="A medicamentos, comidas u otras. Si no tenés, escribí “ninguna conocida”."><TextArea id="sa" value={S.alergias} onChange={set('alergias')} className="!min-h-[4.5rem]" placeholder="Ej: penicilina" /></Field>
              <Field label="Condiciones de salud" htmlFor="sc" hint="Por ejemplo: presión alta, diabetes, marcapasos, operaciones importantes."><TextArea id="sc" value={S.cond} onChange={set('cond')} className="!min-h-[4.5rem]" /></Field>
            </section>

            <section className="rounded-xl2 bg-surface border border-line p-4 sm:p-5 flex flex-col gap-3">
              <h2 className="text-[1.2rem]">Medicamentos que tomás</h2>
              {S.meds.map((m) => (
                <div key={m.id} className="grid grid-cols-[1fr_auto] gap-2 items-start rounded-lg bg-sunk/60 p-3">
                  <div className="flex flex-col gap-2 min-w-0">
                    <TextInput label="Medicamento" value={m.n} onChange={(v) => mut((x) => { const o = x.salud.meds.find((y) => y.id === m.id); if (o) o.n = v; })} placeholder="Nombre del medicamento" />
                    <div className="grid grid-cols-2 gap-2">
                      <TextInput label="Dosis" value={m.dosis} onChange={(v) => mut((x) => { const o = x.salud.meds.find((y) => y.id === m.id); if (o) o.dosis = v; })} placeholder="Dosis: 10 mg" />
                      <TextInput label="Cuándo" value={m.cuando} onChange={(v) => mut((x) => { const o = x.salud.meds.find((y) => y.id === m.id); if (o) o.cuando = v; })} placeholder="Cuándo: a la mañana" />
                    </div>
                  </div>
                  <button type="button" aria-label={'Quitar ' + (m.n || 'medicamento')} onClick={() => mut((x) => { x.salud.meds = x.salud.meds.filter((y) => y.id !== m.id); })} className="press grid place-items-center size-11 rounded-full text-muted hover:text-bad"><Trash2 className="size-5" /></button>
                </div>
              ))}
              <div><Button variant="secondary" size="sm" icon={<Plus />} onClick={() => mut((x) => { x.salud.meds.push({ id: uid(), n: '', dosis: '', cuando: '' }); })}>Agregar medicamento</Button></div>
            </section>

            <section className="rounded-xl2 bg-surface border border-line p-4 sm:p-5 flex flex-col gap-3">
              <h2 className="text-[1.2rem]">A quién avisar</h2>
              {S.contactos.map((c) => (
                <div key={c.id} className="grid grid-cols-[1fr_auto] gap-2 items-start rounded-lg bg-sunk/60 p-3">
                  <div className="grid sm:grid-cols-3 gap-2 min-w-0">
                    <TextInput label="Nombre" value={c.n} onChange={(v) => mut((x) => { const o = x.salud.contactos.find((y) => y.id === c.id); if (o) o.n = v; })} placeholder="Nombre" />
                    <TextInput label="Relación" value={c.rel} onChange={(v) => mut((x) => { const o = x.salud.contactos.find((y) => y.id === c.id); if (o) o.rel = v; })} placeholder="Ej: hija" />
                    <input type="tel" inputMode="tel" aria-label="Teléfono" autoComplete="off" value={c.tel} onChange={(e) => { const v = e.target.value; mut((x) => { const o = x.salud.contactos.find((y) => y.id === c.id); if (o) o.tel = v; }); }} placeholder="Teléfono" />
                  </div>
                  <button type="button" aria-label={'Quitar ' + (c.n || 'contacto')} onClick={() => mut((x) => { x.salud.contactos = x.salud.contactos.filter((y) => y.id !== c.id); })} className="press grid place-items-center size-11 rounded-full text-muted hover:text-bad"><Trash2 className="size-5" /></button>
                </div>
              ))}
              <div><Button variant="secondary" size="sm" icon={<Plus />} onClick={() => mut((x) => { x.salud.contactos.push({ id: uid(), n: '', rel: '', tel: '' }); })}>Agregar contacto</Button></div>
            </section>

            <Field label="Otras notas" htmlFor="sn"><TextArea id="sn" value={S.notas} onChange={set('notas')} className="!min-h-[4rem]" placeholder="Ej: uso audífonos, tengo las llaves con la vecina del 2°B" /></Field>
            <div><Button icon={<Eye />} onClick={() => { setTab('ver'); window.scrollTo({ top: 0 }); }}>Ver cómo queda</Button></div>
          </motion.div>
        )}
      </AnimatePresence>
      <Item><p className="text-[.85rem] text-muted">Se guarda solo en este celular. Revisala cuando cambie un medicamento. No reemplaza la indicación de tu médico.</p></Item>
    </Stagger>
  );
}

function Ficha({ d }: { d: Data }) {
  const S = d.salud, meds = S.meds.filter((m) => m.n), con = S.contactos.filter((c) => c.n || c.tel);
  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-line last:border-0"><dt className="text-muted text-[.9rem] sm:w-44 shrink-0">{k}</dt><dd className="font-semibold min-w-0 break-words">{v}</dd></div>;
  return (
    <article className="print-card rounded-xl2 bg-surface border-2 border-ink/80 p-5 flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-3 flex-wrap"><h2 className="text-[1.45rem]">{d.perfil.nombre || 'Mi ficha de salud'}</h2>{S.sangre && S.sangre !== 'No sé' && <span className="rounded-full bg-badsoft text-bad font-bold px-3 py-1">Grupo {S.sangre}</span>}</header>
      {S.alergias && <div className="rounded-lg bg-badsoft px-4 py-3"><b className="block text-bad">Alergias</b><p className="font-semibold">{S.alergias}</p></div>}
      <dl>
        {S.cond && <Row k="Condiciones" v={S.cond} />}
        {S.obra && <Row k="Obra social o prepaga" v={S.obra} />}
        {S.medico && <Row k="Médico/a de cabecera" v={<>{S.medico}{S.medTel && <a className="ml-2 inline-flex items-center gap-1 text-accent underline underline-offset-2" href={'tel:' + S.medTel.replace(/[^\d+]/g, '')}><Phone className="size-4" />{S.medTel}</a>}</>} />}
        {meds.length > 0 && <Row k="Medicamentos" v={<ul className="flex flex-col gap-1">{meds.map((m) => <li key={m.id}>{m.n}<span className="font-normal text-muted">{m.dosis ? ' · ' + m.dosis : ''}{m.cuando ? ' · ' + m.cuando : ''}</span></li>)}</ul>} />}
        {con.length > 0 && <Row k="Avisar a" v={<ul className="flex flex-col gap-1">{con.map((c) => <li key={c.id}>{c.n}{c.rel && <span className="font-normal text-muted"> ({c.rel})</span>}{c.tel && <span className="num"> · {c.tel}</span>}</li>)}</ul>} />}
        {S.notas && <Row k="Notas" v={S.notas} />}
      </dl>
    </article>
  );
}

