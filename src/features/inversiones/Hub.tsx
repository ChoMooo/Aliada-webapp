import React from 'react';
import { Calculator, BookA, ShieldCheck, ExternalLink } from 'lucide-react';
import { useStore } from '../../store';
import { PageHeader, Stagger, Item, Note, RowLink, Disclosure, Card, SectionWaves } from '../../ui';
import { INV_MODULES, INV_FUENTES, INV_FECHA } from '../../content/learn';
import { fdate } from '../../lib/format';
import { ModCard } from '../digital/Hub';
import { modProg } from '../digital/logic';

export default function InvHub() {
  const d = useStore((s) => s.d);
  const done = INV_MODULES.reduce((a, m) => a + modProg(d, m).n, 0);
  return (
    <Stagger className="flex flex-col gap-6">
      <Item className="relative isolate"><SectionWaves tone="sky" className="-inset-x-4 sm:-inset-x-6 -top-5" /><PageHeader title="Inversiones" lead="Cómo se invierte en Argentina, paso a paso: qué es cada opción, dónde se contrata y cómo se usan las apps. La decisión de en qué invertir es siempre tuya." /></Item>
      <Item><RowLink to="/inversiones/calculadora" icon={<Calculator />} tone="sky" title="¿Dónde rinde más mi plata?" sub="Compará plazo fijo y billetera con las tasas que te ofrecen hoy" /></Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.35rem]">{done ? 'Seguí aprendiendo' : 'Empezá por acá'}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {INV_MODULES.map((m) => <ModCard key={m.id} m={m} base="/inversiones/m/" />)}
        </div>
      </Item>
      <Item className="flex flex-col gap-3">
        <h2 className="text-[1.35rem]">Para consultar</h2>
        <RowLink to="/inversiones/glosario" icon={<BookA />} tone="mint" title="Glosario" sub="Las palabras de las inversiones, en simple" />
      </Item>
      <Item><Card tone="sunk" className="flex flex-col gap-2">
        <h3 className="text-[1.1rem] flex items-center gap-2"><ShieldCheck className="size-5 text-accent" />Antes de abrir una cuenta</h3>
        <p className="text-[.95rem]">Verificá que la empresa figure en los registros públicos de la Comisión Nacional de Valores (CNV): agentes de bolsa en el registro de agentes, y exchanges de cripto en el registro de PSAV.</p>
      </Card></Item>
      <Item><p className="text-[.85rem] text-muted">Contenido educativo: no es asesoramiento financiero ni una recomendación de inversión. Antes de decidir, informate en fuentes oficiales y, si lo necesitás, consultá con un asesor matriculado. Información revisada el {fdate(INV_FECHA)}.</p></Item>
      <Item><Disclosure title="Fuentes consultadas">
        <ul className="flex flex-col gap-2 pt-2">{INV_FUENTES.map((f) => <li key={f.u}><a href={f.u} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1.5 text-accent underline underline-offset-2 text-[.92rem]"><ExternalLink className="size-4 shrink-0 mt-0.5" />{f.t}</a></li>)}</ul>
      </Disclosure></Item>
    </Stagger>
  );
}
