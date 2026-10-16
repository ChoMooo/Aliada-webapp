import React from 'react';
import { ShieldCheck, ScanSearch, Gamepad2, ArrowRight, PhoneCall, Users, KeyRound } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, Hero, Button, RowLink, Stagger, Item, Card, Ring, Bullets } from '../../ui';
import { ESCENARIOS } from '../../content/escudo';
import { DemoPlayer } from '../learn/Demo';
import { ESCUDO_DEMO } from '../../content/learn/escudo';

export default function EscudoHub() {
  const d = useStore((s) => s.d), v = d.escudo.vistos, n = Object.keys(v).length, ok = Object.values(v).filter((x) => x === 'ok').length;
  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader back={{ to: '/digital', label: 'Mundo digital' }} kicker="Módulo de Mundo digital" title="Escudo antiestafas" lead="Las estafas por celular cambian todo el tiempo, pero usan siempre los mismos trucos. Aprendé a reconocerlos." /></Item>
      <Item><Hero>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-glow font-bold text-[.85rem]">Entrenamiento</div>
            <h2 className="text-[1.6rem] text-onbrand mt-1">¿Lo detectarías a tiempo?</h2>
            <p className="opacity-85 mt-1">{ESCENARIOS.length} situaciones reales: mensajes, llamadas y ofertas. Elegí qué harías.</p>
          </div>
          <Ring value={ok} max={ESCENARIOS.length} size={76} tone="glow"><span className="text-onbrand">{ok}/{ESCENARIOS.length}</span></Ring>
        </div>
        <div className="mt-5"><Button variant="glow" to="/digital/escudo/simulador" iconRight={<ArrowRight />}>{n ? 'Seguir practicando' : 'Empezar a practicar'}</Button></div>
      </Hero></Item>
      <Item><Card className="flex flex-col gap-4">
        <h2 className="text-[1.3rem]">Mirá cómo frenar una estafa en 4 pasos</h2>
        <DemoPlayer frames={ESCUDO_DEMO} title="Escudo antiestafas" />
      </Card></Item>
      <Item className="flex flex-col gap-3">
        <RowLink to="/digital/escudo/analizador" tone="amber" icon={<ScanSearch />} title="Analizar un mensaje" sub="Pegá un mensaje sospechoso y mirá qué señales de alerta tiene" />
        <RowLink to="/digital/escudo/simulador" tone="amber" icon={<Gamepad2 />} title="Simulador de estafas" sub="Practicá con 10 situaciones reales" />
      </Item>
      <Item><Card className="flex flex-col gap-3">
        <h2 className="text-[1.3rem] flex items-center gap-2"><ShieldCheck className="size-6 text-accent" />Las 3 reglas que frenan casi todo</h2>
        <div className="grid gap-3">
          {[[<KeyRound key="k" />, 'Los códigos y claves no se comparten nunca', 'Con nadie: ni soporte, ni banco, ni familiares por mensaje.'], [<PhoneCall key="p" />, 'Ante la urgencia, cortá y verificá', 'Llamá vos al número de siempre o entrá a la app oficial.'], [<Users key="u" />, 'Acordá una palabra clave familiar', 'Si alguien “de la familia” pide plata, pedile la palabra.']].map(([i, t, s]) => (
            <div key={t as string} className="flex gap-3 items-start"><span className="grid place-items-center size-10 rounded-xl bg-mint text-accent shrink-0 [&_svg]:size-5">{i}</span><div><b>{t}</b><p className="text-[.92rem] text-muted">{s}</p></div></div>
          ))}
        </div>
      </Card></Item>
      <Item><Card tone="sunk" className="flex flex-col gap-2"><h3 className="text-[1.1rem]">Si ya caíste en una estafa</h3>
        <Bullets items={['Avisá enseguida a tu banco o billetera desde la app oficial o el teléfono de tu tarjeta.', 'Cambiá las claves que hayas compartido.', 'Si te robaron WhatsApp, volvé a registrar tu número y avisá a tus contactos.', 'Hacé la denuncia. No sientas vergüenza: les pasa a personas de todas las edades.']} /></Card></Item>
    </Stagger>
  );
}
