/* Mi persona de confianza: un familiar o alguien cercano a quien pedirle una mano.
   Solo guarda su nombre y su WhatsApp, en este dispositivo. Todo lo que se manda sale por WhatsApp,
   a la vista de la persona, y nunca incluye claves ni códigos. */
import React, { useState } from 'react';
import { HandHeart, MessageCircle, CalendarClock, ShieldCheck, Pencil, Trash2, Save, FolderUp } from 'lucide-react';
import { useStore, mut } from '../store';
import { PageHeader, Stagger, Item, Button, TextInput, Field, Note, RowLink, RowList, Chips } from '../ui';
import { toast } from '../ui/toast';
import { money } from '../lib/format';
import { compartirCopia } from '../lib/copia';
import { calc } from './finanzas/calc';
import { estados, textoMes } from './finanzas/vencimientos';

/** Número para WhatsApp: solo dígitos, con el código del país. Si no lo trae, se asume Argentina (54 9) */
export function telWhatsApp(tel: string): string {
  const conMas = tel.trim().startsWith('+');
  let n = tel.replace(/\D/g, '');
  if (!n) return '';
  if (conMas || n.startsWith('54') || n.startsWith('598')) return n;
  n = n.replace(/^0/, '');
  return '549' + n;
}
const wa = (tel: string, t: string) => `https://wa.me/${telWhatsApp(tel)}?text=${encodeURIComponent(t)}`;

const TEMAS: [string, string][] = [['pago', 'Un pago'], ['tramite', 'Un trámite'], ['celular', 'El celular'], ['mensaje', 'Un mensaje raro']];
const PEDIDO: Record<string, string> = {
  pago: 'necesito una mano con un pago que tengo que hacer',
  tramite: 'necesito una mano con un trámite',
  celular: 'necesito una mano con algo del celular',
  mensaje: 'me llegó un mensaje raro y quiero que lo veas antes de contestar',
  '': 'necesito una mano con algo'
};

export default function Familiar() {
  const d = useStore((s) => s.d), fam = d.fam;
  const [edit, setEdit] = useState(!fam.n || !fam.tel);
  const [n, setN] = useState(fam.n), [tel, setTel] = useState(fam.tel);
  const [tema, setTema] = useState('');
  const [quitar, setQuitar] = useState(false);
  const yo = d.perfil.nombre.trim().split(/\s+/)[0];
  const corto = fam.n.split(',')[0].trim(); // "Lucía, mi hija" → "Lucía" para los mensajes
  const okTel = telWhatsApp(tel).length >= 10;
  const guardar = () => { if (!n.trim() || !okTel) return; mut((x) => { x.fam = { n: n.trim(), tel: tel.trim() }; }); setEdit(false); toast('Guardado'); };

  const c = calc(d), E = estados(d);
  const resumen = () => {
    const L = [`Hola ${corto}${yo ? ', soy ' + yo : ''}. Te paso cómo voy este mes (lo armé con Aliada Digital):`, ''];
    if (c.has) L.push(`Entran ${money(c.ing)} y salen ${money(c.gas)} por mes. ${c.brecha >= 0 ? 'Me sobran' : 'Me faltan'} ${money(Math.abs(c.brecha))}.`, '');
    if (E.length) L.push(textoMes(d));
    return L.join('\n').trim();
  };
  const pedido = `Hola ${corto}${yo ? ', soy ' + yo : ''}. Cuando puedas, ${PEDIDO[tema] || PEDIDO['']}. ¿Me llamás?`;

  return (
    <Stagger className="flex flex-col gap-5">
      <Item><PageHeader back={{ to: '/', label: 'Inicio' }} title="Mi persona de confianza" lead="Un familiar o alguien cercano a quien pedirle una mano. Vos decidís qué le mandás y cuándo." /></Item>

      {edit ? (
        <Item>
          <section className="rounded-xl2 bg-surface border border-line p-4 sm:p-5 flex flex-col gap-4">
            <Field label="¿Cómo se llama?" htmlFor="fn"><TextInput id="fn" value={n} onChange={setN} placeholder="Ej: Lucía, mi hija" /></Field>
            <Field label="Su WhatsApp" htmlFor="ft" hint="Con el código de área, sin el 0 ni el 15. Ej: 11 2345 6789">
              <input id="ft" type="tel" inputMode="tel" autoComplete="off" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="11 2345 6789" />
            </Field>
            {tel && !okTel && <Note tone="warn">Ese número parece incompleto.</Note>}
            <div className="flex flex-wrap gap-3">
              <Button icon={<Save />} disabled={!n.trim() || !okTel} onClick={guardar}>Guardar</Button>
              {fam.n && <Button variant="ghost" onClick={() => { setN(fam.n); setTel(fam.tel); setEdit(false); }}>Cancelar</Button>}
            </div>
            <p className="text-[.85rem] text-muted">Queda guardado solo en este celular. Aliada no le escribe a nadie por su cuenta: siempre se abre WhatsApp y enviás vos.</p>
          </section>
        </Item>
      ) : (<>
        <Item>
          <section className="rounded-xl3 border border-line bg-surface p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <span className="grid place-items-center size-14 rounded-full bg-mint text-teal shrink-0"><HandHeart className="size-7" /></span>
              <div className="flex-1 min-w-0">
                <b className="block font-head text-[1.3rem] leading-tight break-words">{fam.n}</b>
                <span className="block text-muted num">{fam.tel}</span>
              </div>
              <button type="button" onClick={() => setEdit(true)} aria-label="Cambiar los datos" className="press grid place-items-center size-11 rounded-full text-muted hover:bg-sunk shrink-0"><Pencil className="size-5" /></button>
            </div>
            <Field label="¿Con qué necesitás una mano?"><Chips options={TEMAS} value={tema} onChange={setTema} /></Field>
            <div><Button icon={<MessageCircle />} href={wa(fam.tel, pedido)}>Pedirle ayuda por WhatsApp</Button></div>
          </section>
        </Item>

        <Item className="flex flex-col gap-3">
          <h2 className="text-[1.2rem]">Mandarle algo</h2>
          <RowList>
            {(c.has || E.length > 0) && <RowLink icon={<CalendarClock />} tone="amber" title="Cómo voy este mes" sub="Tus números y tus pagos, en un mensaje" onClick={() => window.open(wa(fam.tel, resumen()), '_blank', 'noopener')} />}
            <RowLink icon={<FolderUp />} tone="sky" title="Una copia de mis datos" sub="Para que te la guarde por si cambiás de celular"
              onClick={async () => { const r = await compartirCopia(); if (r === 'descargada') toast('Copia descargada: mandásela como archivo'); else if (r === 'fallo') toast('No se pudo crear la copia'); }} />
          </RowList>
        </Item>

        <Item>
          <Note tone="warn" title="Las claves no se mandan, ni a un familiar">
            <span className="inline-flex items-start gap-2"><ShieldCheck className="size-5 shrink-0 mt-0.5" aria-hidden /><span>Nunca pases claves ni códigos por mensaje. Si alguien te los pide por chat diciendo que es {corto}, llamalo por teléfono antes de hacer nada.</span></span>
          </Note>
        </Item>

        <Item>
          {!quitar ? <Button variant="ghost" icon={<Trash2 />} onClick={() => setQuitar(true)}>Quitar a {corto}</Button>
            : <div className="flex flex-wrap gap-3"><Button variant="danger" icon={<Trash2 />} onClick={() => { mut((x) => { x.fam = { n: '', tel: '' }; }); setN(''); setTel(''); setQuitar(false); setEdit(true); toast('Quitado'); }}>Sí, quitar</Button><Button variant="ghost" onClick={() => setQuitar(false)}>Cancelar</Button></div>}
        </Item>
      </>)}
    </Stagger>
  );
}
