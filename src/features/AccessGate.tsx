import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { mut } from '../store';
import { Button, Field, TextInput, LOGO } from '../ui';
import { toast } from '../ui/toast';
import { checkCode } from '../config';

export default function AccessGate() {
  const [code, setCode] = useState('');
  return (
    <div className="min-h-dvh hero-glow text-onbrand grid place-items-center px-5">
      <div className="w-full max-w-[26rem] rounded-xl3 bg-surface text-ink p-6 shadow-lift flex flex-col gap-5">
        <div className="flex items-center gap-3"><img src={LOGO} alt="" className="size-12 rounded-full" /><h1 className="text-[1.5rem]">Activá tu acceso</h1></div>
        <p className="text-muted">Ingresá el código que recibiste después de tu compra. Se pide una sola vez en este dispositivo.</p>
        <Field label="Código de acceso" htmlFor="cod"><TextInput id="cod" value={code} onChange={setCode} placeholder="Ej: ALIADA-1234" /></Field>
        <Button icon={<KeyRound />} onClick={async () => { if (await checkCode(code)) { mut((d) => { d.acceso.ok = true; }); toast('¡Bienvenida/o!'); } else toast('El código no es válido'); }}>Activar</Button>
      </div>
    </div>
  );
}
