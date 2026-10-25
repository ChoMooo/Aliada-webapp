import React from 'react';
import { Printer, Share2, Copy } from 'lucide-react';
import { useStore, type Data } from '../store';
import { PageHeader, Button, Card } from '../ui';
import { fmt, money, pn } from '../lib/format';
import { calc, progresoTram, plan, gProg, SIT_N, W, taPlanProg } from './finanzas/calc';
import { GUIA, OP } from '../content/finanzas';
import { MODULES, FIN_MODULES, INV_MODULES } from '../content/learn';
import { modProg, setupProg } from './digital/logic';
import { copyText, wa } from '../lib/share';
import { toast } from '../ui/toast';
import { estados } from './finanzas/vencimientos';

export function resumenTexto(d: Data) {
  const c = calc(d), pt = progresoTram(d);
  const L = ['ALIADA DIGITAL · Mi resumen' + (d.perfil.nombre ? ' · ' + d.perfil.nombre : ''), new Date().toLocaleDateString('es-AR'), '', 'MI PLATA'];
  if (c.has) {
    L.push('Ingresos por mes: ' + money(c.ing), 'Gastos por mes: ' + money(c.gas), (c.brecha >= 0 ? 'Me sobra por mes: ' : 'Me falta por mes: ') + money(Math.abs(c.brecha)));
    const P = c.ahoParts;
    [['Plazo fijo', P.pf], ['Cuentas y billeteras', P.cu], ['Efectivo', P.ef], ['Otros ahorros', P.otros]].forEach(([k, v]) => { if ((v as number) > 0) L.push('  ' + k + ': ' + money(v as number)); });
    if (P.usd > 0) L.push('  Dólares: US$ ' + fmt(P.usd) + (c.cot > 0 ? ' a $ ' + fmt(c.cot, c.cot % 1 ? 2 : 0) + ' = ' + money(P.usdARS) : ' (sin cotización)'));
    L.push('Ahorros en pesos: ' + money(c.ahoARS), 'Ahorros netos (menos deudas): ' + money(c.neto));
    L.push(c.anios == null ? 'Mis ingresos cubren mis gastos.' : 'Mis ahorros alcanzan unos ' + fmt(c.anios, 1) + ' años.');
    if (pn(d.plata.meta.m) > 0) L.push('Meta' + (d.plata.meta.n ? ' (' + d.plata.meta.n + ')' : '') + ': ' + money(pn(d.plata.meta.m)) + ' · llegué al ' + Math.round(Math.min(Math.max(c.neto, 0) / pn(d.plata.meta.m), 1) * 100) + '%');
  } else L.push('Todavía sin cargar.');
  const E = estados(d);
  if (E.length) { L.push('', 'MIS VENCIMIENTOS DEL MES'); E.forEach((e) => L.push((e.pagado ? '[x] ' : '[ ] ') + e.n + ' · día ' + e.dia + (e.m > 0 ? ' · ' + money(e.m) : ''))); }
  L.push('', 'MIS TRÁMITES');
  if (d.tr.sit.sit) {
    L.push('Situación: ' + SIT_N[d.tr.sit.sit], 'Avance: ' + pt.n + ' de ' + pt.t + ' tareas');
    plan(d).forEach((e) => { const g = GUIA(e.id), p = gProg(d, g); L.push((p.n === p.t ? '[x] ' : '[ ] ') + g.t + ' (' + p.n + '/' + p.t + ')'); });
    d.tr.notas.filter((x) => !x.ok).forEach((x) => L.push('Pendiente: ' + x.t));
  } else L.push('Todavía sin situación elegida.');
  L.push('', 'MI TALENTO');
  const w = W(d), op = d.ta.sel ? OP(d.ta.sel) : null;
  if (op && w) { L.push('Oportunidad elegida: ' + op.n); if (w.of.que) L.push('Mi oferta: ' + w.of.que + (pn(w.of.precio) > 0 ? ' · ' + money(pn(w.of.precio)) : '')); const pp = taPlanProg(d); if (pp.t) L.push('Plan de 30 días: ' + pp.n + ' de ' + pp.t + ' tareas'); }
  else L.push('Todavía sin oportunidad elegida.');
  FIN_MODULES.forEach((m) => { const p = modProg(d, m); L.push('', m.n.toUpperCase(), p.n + ' de ' + p.t + ' lecciones'); });
  L.push('', 'MUNDO DIGITAL');
  const sp = setupProg(d); L.push('Primeros ajustes del celular: ' + sp.n + ' de ' + sp.t);
  MODULES.forEach((m) => { const p = modProg(d, m); L.push(m.n + ': ' + p.n + ' de ' + p.t + ' lecciones'); });
  L.push('Escudo antiestafas: ' + Object.keys(d.escudo.vistos).length + ' situaciones practicadas');
  L.push('', 'INVERSIONES');
  INV_MODULES.forEach((m) => { const p = modProg(d, m); L.push(m.n + ': ' + p.n + ' de ' + p.t + ' lecciones'); });
  if (d.perfil.sexo === 'mujer') L.push('', 'MI NUEVA VERSIÓN', 'Programa de 30 días: ' + Object.keys(d.libro.dias).length + ' de 30');
  L.push('', 'Información de orientación general. Verificá en fuentes oficiales.');
  return L.join('\n');
}

export default function Resumen() {
  const d = useStore((s) => s.d);
  const t = resumenTexto(d);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader back={{ to: '/', label: 'Inicio' }} title="Mi resumen" lead="Una hoja con lo importante. Imprimila, guardala como PDF o mandala por WhatsApp." />
      <div className="no-print flex flex-wrap gap-3">
        <Button icon={<Printer />} onClick={() => { try { window.print(); } catch { toast('Usá “Copiar” o “WhatsApp”'); } }}>Imprimir o guardar PDF</Button>
        <Button variant="secondary" icon={<Share2 />} href={wa(t)}>WhatsApp</Button>
        <Button variant="ghost" icon={<Copy />} onClick={() => copyText(t)}>Copiar</Button>
      </div>
      <Card><pre className="whitespace-pre-wrap font-body text-[.98rem] leading-relaxed">{t}</pre></Card>
    </div>
  );
}
