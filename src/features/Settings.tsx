import React, { useEffect, useRef, useState } from 'react';
import { Download, Upload, Smartphone, Copy, Trash2 } from 'lucide-react';
import { useStore, useD, mut, mergeData } from '../store';
import { PageHeader, Card, Chips, Field, TextInput, Button, Note, Section, TextArea, Choices } from '../ui';
import { toast } from '../ui/toast';
import { copyText, downloadText } from '../lib/share';
import { isIOS, isStandalone } from '../lib/device';
import { LEGAL } from '../config';
import { CONTENIDO_VERSION } from '../content/finanzas';
import { CONTENIDO_DIGITAL } from '../content/digital';
import { fdate } from '../lib/format';

let deferred: any = null;
if (typeof window !== 'undefined') window.addEventListener('beforeinstallprompt', (e: any) => { e.preventDefault(); deferred = e; });

export default function Settings() {
  const d = useStore((s) => s.d);
  const replace = useStore((s) => s.replace);
  const reset = useStore((s) => s.reset);
  const [bk, setBk] = useState('');
  const [paste, setPaste] = useState('');
  const [confirm, setConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const backup = () => {
    const j = JSON.stringify({ app: 'aliada', ...d, lastBackup: Date.now() });
    mut((x) => { x.lastBackup = Date.now(); });
    const ok = downloadText('aliada-copia-' + new Date().toISOString().slice(0, 10) + '.json', j);
    setBk(j);
    toast(ok ? 'Copia lista' : 'Copiá el texto de abajo');
  };
  const restore = (txt: string) => {
    try { const o = JSON.parse(txt); if (!o || !(o.v === 2 || o.v === 1) || !o.plata) throw 0; const nd = mergeData(o); nd.perfil.onb = true; replace(nd); toast('Datos recuperados'); }
    catch { toast('Ese archivo o texto no es una copia válida'); }
  };
  return (
    <div className="flex flex-col gap-6">
      <PageHeader back={{ to: '/', label: 'Inicio' }} title="Ajustes" />
      <Card className="flex flex-col gap-5">
        <h2 className="text-[1.3rem]">Cómo lo ves</h2>
        <Field label="Tamaño de letra"><Chips options={[['1', 'Normal'], ['2', 'Grande'], ['3', 'Muy grande']]} value={d.aj.fs} onChange={(v) => v && mut((x) => { x.aj.fs = v; })} /></Field>
        <Field label="Colores"><Chips options={[['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Oscuro']]} value={d.aj.tema} onChange={(v) => v && mut((x) => { x.aj.tema = v; })} /></Field>
        <Field label="Botones “Escuchar”"><Chips options={[['1', 'Mostrar'], ['0', 'Ocultar']]} value={d.aj.voz ? '1' : '0'} onChange={(v) => v && mut((x) => { x.aj.voz = v === '1'; })} /></Field>
      </Card>
      <Card className="flex flex-col gap-5">
        <h2 className="text-[1.3rem]">Tu perfil</h2>
        <Field label="Tu nombre" htmlFor="n2"><TextInput id="n2" value={d.perfil.nombre} onChange={(v) => mut((x) => { x.perfil.nombre = v; })} /></Field>
        <Field label="Tu momento">
          <Choices options={[{ k: 'falta', t: 'Todavía me falta para jubilarme' }, { k: 'tramitando', t: 'Estoy haciendo el trámite' }, { k: 'jubilado', t: 'Ya cobro la jubilación' }]} value={d.perfil.etapa} onChange={(v) => mut((x) => { x.perfil.etapa = v; })} />
        </Field>
      </Card>
      <Card className="flex flex-col gap-4">
        <h2 className="text-[1.3rem]">Tus datos</h2>
        <p className="text-muted">Todo lo que cargás se guarda <b className="text-ink">solo en este dispositivo</b>. Hacé una copia de vez en cuando para no perderlo si cambiás de celular.</p>
        <div className="flex flex-wrap gap-3"><Button icon={<Download />} onClick={backup}>Guardar copia de mis datos</Button></div>
        {bk && (
          <Field label="Si no se descargó, copiá este texto y guardalo en tus notas o mandátelo por WhatsApp:">
            <textarea readOnly value={bk} className="!min-h-[5rem] text-[.75rem]" />
            <div><Button size="sm" variant="ghost" icon={<Copy />} onClick={() => copyText(bk)}>Copiar texto</Button></div>
          </Field>
        )}
        <hr className="border-line" />
        <Field label="Recuperar mis datos" hint="Elegí el archivo de tu copia o pegá el texto.">
          <input ref={fileRef} type="file" accept=".json,application/json" className="text-[.9rem]" />
          <TextArea value={paste} onChange={setPaste} placeholder="…o pegá acá el texto de tu copia" className="!min-h-[4.5rem]" label="Texto de la copia" />
        </Field>
        <div><Button variant="secondary" icon={<Upload />} onClick={() => {
          const f = fileRef.current?.files?.[0];
          if (f) { const r = new FileReader(); r.onload = () => restore(String(r.result)); r.readAsText(f); }
          else if (paste.trim()) restore(paste.trim()); else toast('Elegí un archivo o pegá el texto');
        }}>Recuperar</Button></div>
      </Card>
      <Card className="flex flex-col gap-4">
        <h2 className="text-[1.3rem]">Instalar en tu celular</h2>
        <p className="text-muted">Instalada, se abre como cualquier aplicación, funciona sin internet y cuida mejor tus datos.</p>
        {isStandalone() ? <Note tone="good">Ya la tenés instalada.</Note> : !isIOS() && (
          <div><Button icon={<Smartphone />} onClick={() => { if (deferred) { deferred.prompt(); deferred = null; } else toast('Usá el menú del navegador: “Instalar aplicación”'); }}>Instalar ahora</Button></div>
        )}
        <Note tone="info" title="iPhone o iPad">Abrila en <b>Safari</b>, tocá <b>Compartir</b> (el cuadrado con la flecha), elegí <b>“Agregar a pantalla de inicio”</b> y confirmá.</Note>
        <Note tone="info" title="Android">En Chrome, tocá los <b>tres puntitos</b> y elegí <b>“Instalar aplicación”</b> o “Agregar a pantalla principal”.</Note>
      </Card>
      <Card className="flex flex-col gap-3">
        <h2 className="text-[1.3rem]">Empezar de cero</h2>
        <p className="text-muted">Borra todo lo que cargaste en este dispositivo. No se puede deshacer.</p>
        <div>{!confirm ? <Button variant="danger" icon={<Trash2 />} onClick={() => setConfirm(true)}>Borrar todos mis datos</Button>
          : <div className="flex flex-wrap gap-3"><Button variant="danger" onClick={() => { reset(); toast('Datos borrados'); }}>Sí, borrar todo</Button><Button variant="ghost" onClick={() => setConfirm(false)}>Cancelar</Button></div>}</div>
      </Card>
      <Card tone="sunk" className="flex flex-col gap-2">
        <h3 className="text-[1.1rem]">Acerca de</h3>
        <p className="text-[.85rem] text-muted">Aliada Digital 2.0 · Trámites verificados el {fdate(CONTENIDO_VERSION)} · Mundo digital: contenido del {fdate(CONTENIDO_DIGITAL.fecha)}.</p>
        <p className="text-[.85rem] text-muted">{LEGAL}</p>
        <p className="text-[.85rem] text-muted">Voz de las narraciones: generada con la voz sintética «Daniela» (Piper, español de Argentina), entrenada con el corpus de habla argentina de Google publicado en OpenSLR (recurso 61) bajo licencia CC BY-SA 4.0. Los audios de la app se distribuyen bajo la misma licencia. Las pantallas de los videos son ilustraciones propias y no reproducen el diseño oficial de cada aplicación; los nombres de las apps pertenecen a sus respectivos dueños.</p>
      </Card>
    </div>
  );
}
