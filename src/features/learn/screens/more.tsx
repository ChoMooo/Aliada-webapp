/* IA, billetera, Mercado Libre, app de inversiones, Canva, CapCut, Ajustes, inicio del celular, tienda y cámara */
import React from 'react';
import { cx } from '../../../ui';
import { H, I, Pic, Avatar, BottomNav, Sheet, SearchPill, Keyboard } from './kit';
import { TICKERS } from '../../../content/learn/tickers';

/* ================= ASISTENTE DE IA ================= */
const AI_THEME: Record<string, { bg: string; fg: string; ph: string; bubble: string; accent: string }> = {
  ChatGPT: { bg: '#ffffff', fg: '#0d0d0d', ph: 'Preguntá lo que quieras', bubble: '#f2f2f2', accent: '#0d0d0d' },
  Gemini: { bg: '#ffffff', fg: '#1f1f1f', ph: 'Preguntale a Gemini', bubble: '#e9eef6', accent: '#1a73e8' },
  Claude: { bg: '#faf9f5', fg: '#141413', ph: 'Escribí tu mensaje', bubble: '#f0eee6', accent: '#c96442' }
};
export function AI(s: any) {
  const name = s.name || 'ChatGPT', th = AI_THEME[name] || AI_THEME.ChatGPT, msgs = s.msgs || [];
  if (s.v === 'attach') return <Sheet s={s} base={AI({ ...s, v: undefined, hl: undefined })} items={[{ t: 'Cámara', i: 'camera' }, { t: 'Fotos', i: 'images' }, { t: 'Archivos', i: 'doc' }]} />;
  if (s.v === 'voice') return (
    <div className="flex-1 flex flex-col min-h-0 items-center justify-between py-6" style={{ background: th.bg, color: th.fg }}>
      <span className="text-[10px] opacity-60">{s.status || 'Escuchando…'}</span>
      <span className="size-28 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #fff 0%, #9cc9ff 30%, #4b8df0 70%, #2a5bd7 100%)', boxShadow: '0 0 40px #8ab4f8aa' }} />
      <p className="px-6 text-center text-[11px] leading-snug min-h-[3em]">{s.said || ''}</p>
      <div className="flex gap-6"><span {...H(s, 'vmic', 'grid place-items-center size-12 rounded-full bg-[#f2f2f2]')}><I n="mic" className="size-5" /></span><span {...H(s, 'vend', 'grid place-items-center size-12 rounded-full bg-[#f2f2f2]')}><I n="x" className="size-5" /></span></div>
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: th.bg, color: th.fg }}>
      <div className="flex items-center gap-3 px-3 h-10 shrink-0"><span {...H(s, 'menu', 'rounded p-0.5')}><I n="menu" className="size-4" /></span><b className="flex-1 text-[12px]">{name} <span className="opacity-50">▾</span></b><span {...H(s, 'newchat', 'rounded p-0.5')}><I n="pencil" className="size-4" /></span></div>
      <div className="flex-1 min-h-0 overflow-hidden px-3 flex flex-col gap-2.5 pt-1">
        {!msgs.length && <div className="flex-1 flex flex-col items-center justify-center gap-3"><b className="text-[15px] text-center">{s.hello || '¿En qué puedo ayudarte?'}</b><div className="flex flex-wrap justify-center gap-1.5">{(s.sugg || ['Crear una imagen', 'Resumir un texto', 'Hacer un plan', 'Aconsejarme']).map((t: string, i: number) => <span key={t} {...H(s, 'sg' + i, 'rounded-full border border-black/10 px-2.5 h-7 grid place-items-center text-[9px]')}>{t}</span>)}</div></div>}
        {msgs.map((m: any, i: number) => m.me ? (
          <div key={i} {...H(s, 'm' + i, 'self-end max-w-[82%] rounded-2xl px-3 py-2 text-[10.5px] leading-snug')} style={{ background: th.bubble }}>{m.img != null && <Pic n={m.img} className="w-28 h-20 rounded-lg mb-1.5" />}{m.doc && <span className="flex items-center gap-1.5 mb-1.5 rounded-lg bg-white px-2 py-1.5 text-[9px]"><span className="grid place-items-center w-5 h-6 rounded-sm bg-[#e94b3c] text-white text-[6px] font-bold">PDF</span>{m.doc}</span>}{m.t}</div>
        ) : (
          <div key={i} {...H(s, 'm' + i, 'text-[10.5px] leading-relaxed rounded-md')}>{m.img != null && <Pic n={m.img} className="w-40 h-28 rounded-xl mb-1.5" />}{m.t.split('\n').map((l: string, k: number) => l.startsWith('**') ? <b key={k} className="block mt-1">{l.replace(/\*\*/g, '')}</b> : <span key={k} className="block">{l}</span>)}
            <span className="flex gap-3 mt-1.5 opacity-60"><span {...H(s, 'copy' + i, 'rounded p-0.5')}><I n="copy" className="size-3" /></span><I n="like" className="size-3" /><span {...H(s, 'read' + i, 'rounded p-0.5')}><I n="speaker" className="size-3" /></span><I n="refresh" className="size-3" /></span></div>
        ))}
      </div>
      <div className="p-2.5 shrink-0"><div className="rounded-[22px] border border-black/10 px-3 pt-2 pb-1.5 shadow-sm" style={{ background: th.bg }}>
        <div {...H(s, 'in', cx('text-[10.5px] min-h-[1.5em] rounded', !s.typing && 'opacity-50'))}>{s.typing || th.ph}</div>
        <div className="flex items-center gap-2 mt-1.5"><span {...H(s, 'plus', 'grid place-items-center size-7 rounded-full border border-black/10')}><I n="plus" className="size-4" /></span><span className="flex-1" /><span {...H(s, 'mic', 'rounded-full p-1')}><I n="mic" className="size-4" /></span>
          <span {...H(s, s.typing ? 'send' : 'voice', 'grid place-items-center size-7 rounded-full text-white')} style={{ background: th.accent }}><I n={s.typing ? 'up' : 'wave'} className="size-3.5" /></span></div>
      </div></div>
      {s.kb && <Keyboard s={s} />}
    </div>
  );
}

/* ================= BILLETERA (estilo Mercado Pago) ================= */
const MP = '#009ee3';
const W_NAV: [string, string][] = [['home', 'Inicio'], ['card', 'Tarjetas'], ['qr', ''], ['receipt', 'Actividad'], ['menu', 'Más']];
function WalletHome(s: any) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f5f5f5]">
      <div className="px-3 pt-2 pb-3 shrink-0" style={{ background: '#fff' }}>
        <div className="flex items-center gap-2"><Avatar t="Marta" n={3} size={26} /><b className="flex-1 text-[11px]">Hola, Marta</b><I n="help" className="size-4 text-[#555]" /><I n="bell" className="size-4 text-[#555]" /></div>
        <div className="mt-3 rounded-xl border border-[#eee] p-3 bg-white shadow-sm">
          <span className="text-[9px] text-[#666]">Dinero disponible</span>
          <div className="flex items-center gap-2"><b className="text-[20px] tracking-tight">$ 84.500</b><I n="eye" className="size-4 text-[#888]" /></div>
          <span {...H(s, 'yield', 'inline-flex items-center gap-1 text-[9px] rounded')} style={{ color: '#00a650' }}><I n="up" className="size-3" />Rendimientos de hoy: $ 52</span>
          <div className="flex justify-between mt-3">{[['transfer', 'transfer', 'Transferir'], ['deposit', 'deposit', 'Ingresar'], ['cvu', 'copy', 'Tu CVU'], ['more', 'grid', 'Más']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex flex-col items-center gap-1 w-14 rounded-lg')}><span className="grid place-items-center size-10 rounded-full" style={{ background: '#e6f5fc', color: MP }}><I n={ic} className="size-4" /></span><span className="text-[8.5px]">{t}</span></span>)}</div>
        </div>
      </div>
      <div className="m-3 mt-2 grid grid-cols-4 gap-y-3 rounded-xl bg-white p-3 shadow-sm">{[['services', 'receipt', 'Pagar servicios'], ['recharge', 'cel', 'Recargar celular'], ['sube', 'bus', 'Cargar SUBE'], ['invest', 'up', 'Invertir']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex flex-col items-center gap-1 rounded-lg')}><I n={ic} className="size-4" style={{ color: MP }} /><span className="text-[8px] text-center leading-tight">{t}</span></span>)}</div>
      <div className="flex-1" />
      <div className="relative"><span {...H(s, 'qr', 'absolute left-1/2 -translate-x-1/2 -top-5 grid place-items-center size-12 rounded-full text-white shadow-lg ring-4 ring-white')} style={{ background: MP }}><I n="qr" className="size-5" /></span></div>
      <BottomNav s={s} active={0} items={W_NAV} />
    </div>
  );
}
function WTop(title: string) { return <div className="flex items-center gap-3 px-3 h-11 shrink-0 bg-white border-b border-[#eee]"><I n="back" className="size-4" /><b className="text-[11.5px]">{title}</b></div>; }
export function Wallet(s: any) {
  if (s.v === 'scan') return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-black text-white">
      <div className="relative flex items-center justify-between px-3 h-10"><I n="x" className="size-4" /><b className="text-[10.5px]">{s.title || 'Escaneá el código QR'}</b><I n="sun" className="size-4" /></div>
      <div className="relative flex-1 grid place-items-center"><div {...H(s, 'code', 'relative size-36 bg-white p-2 rounded-lg')}><svg viewBox="0 0 25 25" className="w-full h-full" shapeRendering="crispEdges">{Array.from({ length: 625 }, (_, i) => { const x = i % 25, y = (i / 25) | 0; const f = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7; const inF = f(0, 0) || f(18, 0) || f(0, 18); let on: boolean; if (inF) { const ox = x < 7 ? 0 : 18, oy = y < 7 ? 0 : 18, rx = x - ox, ry = y - oy; on = rx === 0 || ry === 0 || rx === 6 || ry === 6 || (rx >= 2 && rx <= 4 && ry >= 2 && ry <= 4); } else on = ((x * 7 + y * 13 + x * y) % 5) < 2; return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#000" /> : null; })}</svg><span className="absolute -inset-3 border-[3px] border-white/90 rounded-xl" /></div></div>
      <p className="relative text-center text-[9.5px] pb-6 opacity-80">{s.hint || 'Apuntá al código del comercio'}</p>
    </div>);
  if (s.v === 'pay') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{WTop('Pagar')}
      <div className="flex flex-col items-center gap-1 pt-6"><span {...H(s, 'shop', 'flex flex-col items-center gap-1 rounded-xl p-1')}><span className="grid place-items-center size-12 rounded-full bg-[#fff1c2] text-[#a36b00]"><I n="store" className="size-5" /></span><b className="text-[12px]">{s.shop || 'Almacén Don Pepe'}</b></span><span {...H(s, 'amount', 'text-[26px] font-bold tracking-tight rounded-lg px-2')}>{s.amount || '$ 6.250'}</span></div>
      <div className="mx-3 mt-4 rounded-xl border border-[#eee] p-3"><span className="text-[9px] text-[#666]">Medio de pago</span><div className="flex items-center gap-2 mt-1"><I n="wallet" className="size-4" style={{ color: MP }} /><span className="flex-1 text-[10.5px]">Dinero disponible</span><span className="text-[9.5px]" style={{ color: MP }}>Cambiar</span></div></div>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'ok', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: MP }}>Pagar</span></div>
    </div>);
  if (s.v === 'done') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#00a650] text-white">
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6 text-center"><span className="grid place-items-center size-14 rounded-full bg-white text-[#00a650]"><I n="check" className="size-7" /></span><b className="text-[15px]">{s.title || '¡Listo! Pagaste $ 6.250'}</b><span className="text-[10px] opacity-90">{s.sub || 'a Almacén Don Pepe'}</span></div>
      <div className="bg-white p-3 flex flex-col gap-2"><span {...H(s, 'receipt', 'rounded-lg h-10 grid place-items-center text-[11px] font-semibold')} style={{ color: MP, background: '#e6f5fc' }}>Ver comprobante</span><span {...H(s, 'share', 'rounded-lg h-10 grid place-items-center text-[11px] font-semibold')} style={{ color: MP }}>Compartir comprobante</span></div>
    </div>);
  if (s.v === 'to') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{WTop('Transferir')}
      <div className="px-3 pt-3"><span className="text-[9px] text-[#666]">¿A quién le querés transferir?</span><div {...H(s, 'alias', 'mt-1 flex items-center gap-2 rounded-lg border-2 px-2.5 h-10 text-[11px]')} style={{ borderColor: MP }}>{s.alias || <span className="text-[#999]">Alias, CBU o CVU</span>}</div></div>
      <b className="px-3 mt-3 text-[10px]">Contactos frecuentes</b>
      {[['Lucía Fernández', 'lucia.fer.rio'], ['Juan Pérez', 'juan.perez.mp']].map(([t, a], i) => <div key={i} {...H(s, 'c' + i, 'flex items-center gap-2.5 px-3 py-2')}><Avatar t={t} n={i + 4} size={30} /><span><b className="block text-[10.5px]">{t}</b><span className="text-[8.5px] text-[#666]">{a}</span></span></div>)}
      <div className="flex-1" />{s.kb ? <Keyboard s={s} /> : <div className="p-3"><span {...H(s, 'next', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: MP }}>Continuar</span></div>}
    </div>);
  if (s.v === 'who') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{WTop('Transferir')}
      <div className="flex flex-col items-center gap-1 pt-6"><Avatar t={s.name || 'Lucía Fernández'} n={4} size={52} /><b {...H(s, 'name', 'text-[13px] rounded px-1')}>{s.name || 'Lucía Fernández'}</b><span className="text-[9px] text-[#666]">CUIT 27-•••••••-4 · Banco Ejemplo</span></div>
      <div className="mx-3 mt-4 rounded-xl bg-[#f5f5f5] p-3 text-[9.5px] text-[#444]">Revisá que el nombre sea el de la persona a la que le querés transferir.</div>
      <div className="flex-1" /><div className="p-3 flex flex-col gap-2"><span {...H(s, 'yes', 'rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: MP }}>Continuar</span><span {...H(s, 'no', 'rounded-lg h-10 grid place-items-center text-[11px] font-semibold')} style={{ color: MP }}>No es esta persona</span></div>
    </div>);
  if (s.v === 'amount') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{WTop('Transferir')}
      <div className="flex flex-col items-center pt-6 gap-1"><span className="text-[9.5px] text-[#666]">a {s.name || 'Lucía Fernández'}</span><b {...H(s, 'amount', 'text-[28px] tracking-tight rounded-lg px-2')}>{s.amount || '$ 15.000'}</b><span className="text-[9px] text-[#666]">Disponible: $ 84.500</span></div>
      <div {...H(s, 'note', 'mx-3 mt-4 rounded-lg border border-[#ddd] px-2.5 h-9 grid items-center text-[10px] text-[#999]')}>Mensaje (opcional)</div>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'next', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: MP }}>Revisar transferencia</span></div>
    </div>);
  if (s.v === 'review') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f5f5f5]">{WTop('Revisá tu transferencia')}
      <div className="m-3 rounded-xl bg-white p-3 shadow-sm flex flex-col gap-2 text-[10px]">{[['Para', s.name || 'Lucía Fernández'], ['Alias', s.alias || 'lucia.fer.rio'], ['Monto', s.amount || '$ 15.000'], ['Motivo', 'Varios']].map(([a, b]) => <div key={a} className="flex justify-between"><span className="text-[#666]">{a}</span><b>{b}</b></div>)}</div>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'ok', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: MP }}>Transferir</span></div>
    </div>);
  if (s.v === 'cvu') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{WTop('Tu CVU y alias')}
      {[['Alias', s.alias || 'marta.sol.casa', 'editAlias'], ['CVU', '0000003100012345678901', 'copyCvu']].map(([a, b, id]) => <div key={a} className="mx-3 mt-3 rounded-xl border border-[#eee] p-3"><span className="text-[9px] text-[#666]">{a}</span><div className="flex items-center gap-2"><b className="flex-1 text-[11px] break-all">{b}</b><span {...H(s, id, 'rounded p-0.5')} style={{ color: MP }}><I n={id === 'editAlias' ? 'pencil' : 'copy'} className="size-4" /></span></div></div>)}
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'share', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: MP }}>Compartir datos</span></div>
    </div>);
  if (s.v === 'activity') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{WTop('Actividad')}
      <div className="px-3 py-2"><SearchPill s={s} ph="Buscar" /></div>
      {(s.rows || [['Ana Gómez', 'Transferencia recibida', '+ $ 9.000', 'Hoy'], ['Almacén Don Pepe', 'Pago con QR', '- $ 6.250', 'Ayer'], ['Edesur', 'Pago de servicio', '- $ 18.420', 'Lun'], ['Rendimientos', 'Ganancia del día', '+ $ 52', 'Lun']]).map(([t, d, m, h]: string[], i: number) => <div key={i} {...H(s, 'a' + i, 'flex items-center gap-2.5 px-3 py-2 border-b border-[#f3f3f3]')}><span className="grid place-items-center size-8 rounded-full bg-[#f2f2f2]"><I n={m.startsWith('+') ? 'deposit' : 'receipt'} className="size-4 text-[#555]" /></span><span className="flex-1 min-w-0"><b className="block text-[10px]">{t}</b><span className="text-[8.5px] text-[#666]">{d} · {h}</span></span><b className="text-[10px]" style={{ color: m.startsWith('+') ? '#00a650' : '#333' }}>{m}</b></div>)}
    </div>);
  if (s.v === 'services') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{WTop('Pagar servicios')}
      <div className="px-3 py-2"><SearchPill s={s} id="q" t={s.q} ph="Buscá la empresa" /></div>
      <b className="px-3 text-[10px]">Tus servicios</b>
      {[['Edesur · Luz', 'Vence el 22/10 · $ 18.420'], ['Metrogas · Gas', 'Vence el 25/10 · $ 9.880'], ['AySA · Agua', 'Al día']].map(([t, d], i) => <div key={i} {...H(s, 'sv' + i, 'flex items-center gap-2.5 px-3 py-2.5 border-b border-[#f3f3f3]')}><span className="grid place-items-center size-8 rounded-full bg-[#fff6d6] text-[#a36b00]"><I n="receipt" className="size-4" /></span><span className="flex-1"><b className="block text-[10px]">{t}</b><span className="text-[8.5px] text-[#666]">{d}</span></span><I n="chev" className="size-3 text-[#aaa]" /></div>)}
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'scanBill', 'flex items-center justify-center gap-2 rounded-lg h-10 text-[10.5px] font-semibold')} style={{ color: MP, background: '#e6f5fc' }}><I n="scan" className="size-4" />Escanear código de la factura</span></div>
    </div>);
  if (s.v === 'invest') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{WTop('Tu dinero rinde')}
      <div className="m-3 rounded-xl border border-[#eee] p-3"><span className="text-[9px] text-[#666]">Saldo invertido en un fondo de bajo riesgo</span><b className="block text-[18px]">$ 84.500</b><span className="text-[9px]" style={{ color: '#00a650' }}>Rindió $ 1.420 en los últimos 30 días</span></div>
      {[['Rinde todos los días', 'calendar'], ['Lo podés usar cuando quieras', 'clock'], ['Ver detalle del fondo', 'info']].map(([t, ic], i) => <div key={t} {...H(s, 'i' + i, 'flex items-center gap-2.5 px-3 py-2.5 text-[10px]')}><I n={ic} className="size-4" style={{ color: MP }} />{t}</div>)}
      <div className="flex-1" />
    </div>);
  return WalletHome(s);
}

/* ================= MERCADO LIBRE ================= */
const ML = '#ffe600', MLB = '#3483fa';
function MlTop(s: any) {
  return <div className="shrink-0 px-3 pt-1.5 pb-2" style={{ background: ML }}><div className="flex items-center gap-2"><div {...H(s, 'search', 'flex-1 flex items-center gap-2 rounded-full bg-white h-8 px-3 text-[10px] shadow-sm')}><I n="search" className="size-3.5 text-[#999]" /><span className={s.q ? '' : 'text-[#999]'}>{s.q || 'Buscar en Mercado Libre'}</span></div><I n="cart" className="size-4" /></div><div className="flex items-center gap-1 mt-1.5 text-[8.5px] text-[#333]"><I n="pin" className="size-3" />Enviar a Av. Siempre Viva 742</div></div>;
}
export function MercadoLibre(s: any) {
  if (s.v === 'results') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{MlTop(s)}
      <div className="flex gap-1.5 px-3 py-1.5 text-[8.5px]">{['Envío gratis', 'Llega mañana', 'Mejores vendedores'].map((c, i) => <span key={c} {...H(s, 'f' + i, 'rounded-full border border-[#ddd] px-2 h-6 grid place-items-center')}>{c}</span>)}</div>
      {(s.items || [['Pava eléctrica 1,7 L acero', '$ 38.900', 'Mismo precio en 6 cuotas', 'Envío gratis · llega mañana', 7], ['Pava eléctrica con mate 1,7 L', '$ 41.250', '', 'Envío gratis', 6], ['Pava eléctrica 1,7 L', '$ 9.900', '¡Oferta increíble!', 'Vendedor sin calificaciones', 5]]).map(([t, p, c, e, n]: any[], i: number) => (
        <div key={i} {...H(s, 'p' + i, 'flex gap-2.5 px-3 py-2.5 border-b border-[#eee]')}><Pic n={n} className="size-16 rounded-md" /><span className="min-w-0"><span className="block text-[10px] leading-snug">{t}</span><b className="block text-[13px] mt-0.5">{p}</b>{c && <span className="block text-[8.5px] text-[#00a650]">{c}</span>}<span className="block text-[8.5px] text-[#00a650] font-semibold">{e}</span></span></div>
      ))}
    </div>);
  if (s.v === 'product') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{MlTop(s)}
      <div className="px-3 pt-1.5 text-[8.5px] text-[#666]">Nuevo · +1.000 vendidos</div>
      <b className="px-3 text-[11px] leading-snug">Pava eléctrica 1,7 L acero inoxidable</b>
      <span className="px-3 text-[9px] text-[#3483fa]">4,7 ★★★★★ (2.341)</span>
      <Pic n={7} className="mx-3 my-1.5 h-24 rounded-md" />
      <b className="px-3 text-[18px]">$ 38.900</b><span className="px-3 text-[9px] text-[#00a650]">Mismo precio en 6 cuotas de $ 6.483</span><span className="px-3 text-[9px] text-[#00a650] font-semibold">Llega gratis mañana</span>
      <div {...H(s, 'seller', 'mx-3 mt-1.5 rounded-lg border border-[#eee] p-2 text-[9px]')}><b className="block">Vendido por HOGAR ÚTIL</b><span className="text-[#00a650]">MercadoLíder Platinum · +5 mil ventas</span></div>
      <div className="flex-1" />
      <div className="p-3 flex flex-col gap-1.5"><span {...H(s, 'buy', 'rounded-md h-9 grid place-items-center text-[10.5px] font-semibold text-white')} style={{ background: MLB }}>Comprar ahora</span><span {...H(s, 'cart', 'rounded-md h-9 grid place-items-center text-[10.5px] font-semibold')} style={{ background: '#e3edfb', color: MLB }}>Agregar al carrito</span></div>
    </div>);
  if (s.v === 'reviews') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{MlTop(s)}
      <b className="px-3 pt-2 text-[11px]">Opiniones del producto</b><div className="flex items-center gap-2 px-3 py-1"><b className="text-[22px]">4,7</b><span className="text-[#3483fa] text-[11px]">★★★★★</span><span className="text-[8.5px] text-[#666]">2.341 calificaciones</span></div>
      {[['★★★★★', 'Llegó rápido y funciona perfecto.'], ['★★★★☆', 'Buena, un poco ruidosa al hervir.'], ['★★★★★', 'La uso todos los días para el mate.']].map(([a, b], i) => <div key={i} {...H(s, 'r' + i, 'px-3 py-2 border-b border-[#eee]')}><span className="text-[9px] text-[#3483fa]">{a}</span><p className="text-[10px]">{b}</p></div>)}
      <b className="px-3 pt-2 text-[11px]">Preguntas y respuestas</b><div {...H(s, 'q', 'px-3 py-2 text-[9.5px]')}>¿Tiene garantía? <span className="block text-[#666]">↳ Sí, 6 meses de garantía de fábrica.</span></div>
    </div>);
  if (s.v === 'checkout') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f5f5f5]"><div className="flex items-center gap-3 px-3 h-11 bg-white"><I n="back" className="size-4" /><b className="text-[11.5px]">Revisá tu compra</b></div>
      {[['truck', 'Envío a domicilio', 'Llega mañana · Gratis'], ['wallet', 'Pagás con Mercado Pago', 'Dinero disponible'], ['shield', 'Compra Protegida', 'Si no llega o es distinto, te devolvemos el dinero']].map(([ic, t, d], i) => <div key={i} {...H(s, 'c' + i, 'mx-3 mt-2 flex items-center gap-2.5 rounded-lg bg-white p-2.5')}><I n={ic} className="size-4" style={{ color: MLB }} /><span><b className="block text-[10px]">{t}</b><span className="text-[8.5px] text-[#666]">{d}</span></span></div>)}
      <div className="flex-1" /><div className="p-3 bg-white"><div className="flex justify-between text-[11px] mb-2"><span>Total</span><b>$ 38.900</b></div><span {...H(s, 'ok', 'block rounded-md h-9 grid place-items-center text-[10.5px] font-semibold text-white')} style={{ background: MLB }}>Confirmar compra</span></div>
    </div>);
  if (s.v === 'orders') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f5f5f5]"><div className="flex items-center gap-3 px-3 h-11 bg-white"><I n="back" className="size-4" /><b className="text-[11.5px]">Mis compras</b></div>
      <div className="m-3 rounded-lg bg-white p-3"><span className="text-[9px] font-semibold text-[#00a650]">En camino</span><div className="flex gap-2.5 mt-1"><Pic n={7} className="size-12 rounded-md" /><span><b className="block text-[10px]">Pava eléctrica 1,7 L</b><span className="text-[9px] text-[#666]">Llega mañana entre las 9 y las 18 h</span></span></div>
        <div className="flex gap-1.5 mt-2"><span {...H(s, 'track', 'flex-1 rounded-md h-8 grid place-items-center text-[9.5px] font-semibold text-white')} style={{ background: MLB }}>Ver envío</span><span {...H(s, 'help', 'flex-1 rounded-md h-8 grid place-items-center text-[9.5px] font-semibold')} style={{ background: '#e3edfb', color: MLB }}>Necesito ayuda</span></div></div>
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f5f5f5]">{MlTop(s)}
      <Pic n={1} className="h-20 mx-3 mt-2 rounded-lg" label="Ofertas de la semana" />
      <div className="grid grid-cols-5 gap-1 px-3 py-2">{[['Ofertas', 'tag'], ['Mercado Pago', 'wallet'], ['Supermercado', 'cart'], ['Moda', 'bag'], ['Más', 'grid']].map(([t, ic]) => <span key={t} className="flex flex-col items-center gap-1 text-[7.5px] text-center"><span className="grid place-items-center size-9 rounded-full bg-white shadow-sm"><I n={ic} className="size-4" style={{ color: MLB }} /></span>{t}</span>)}</div>
      <div className="flex-1" />
    </div>
  );
}

/* ================= APP DE INVERSIONES / BANCO (genérica) ================= */
const BK = '#0b2a4a', BKA = '#2f7df6';
function BkTop(title: string, back = true) { return <div className="flex items-center gap-3 px-3 h-11 shrink-0 text-white" style={{ background: BK }}>{back ? <I n="back" className="size-4" /> : <I n="menu" className="size-4" />}<b className="flex-1 text-[11.5px]">{title}</b><I n="bell" className="size-4 opacity-80" /></div>; }
function Spark({ up = true }: { up?: boolean }) { return <svg viewBox="0 0 100 30" className="w-full h-12"><path d={up ? 'M0 25 L12 22 L22 24 L34 16 L46 18 L58 10 L70 13 L84 6 L100 4' : 'M0 6 L14 9 L26 7 L38 14 L50 12 L62 19 L76 17 L88 24 L100 25'} fill="none" stroke={up ? '#22c55e' : '#ef4444'} strokeWidth="2" /></svg>; }
export { TICKERS };
export function Broker(s: any) {
  if (s.v === 'market') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop('Mercado')}
      <div className="px-3 py-2"><SearchPill s={s} id="q" t={s.q} ph="Buscar por nombre o ticker" /></div>
      <div className="flex gap-1.5 px-3 pb-2">{['Acciones', 'CEDEARs', 'Bonos', 'ON', 'FCI'].map((c, i) => <span key={c} {...H(s, 'cat' + i, cx('rounded-full px-2.5 h-6 grid place-items-center text-[8.5px] font-semibold', (s.cat ?? 0) === i ? 'text-white' : 'bg-[#eef2f7] text-[#334155]'))} style={(s.cat ?? 0) === i ? { background: BKA } : undefined}>{c}</span>)}</div>
      {(s.list || TICKERS).map((x: any, i: number) => <div key={x.k} {...H(s, 't' + i, 'flex items-center gap-2.5 px-3 py-2.5 border-b border-[#f1f5f9]')}><span className="grid place-items-center size-8 rounded-full bg-[#eef2f7] text-[8px] font-bold text-[#334155]">{x.k}</span><span className="flex-1 min-w-0"><b className="block text-[10px]">{x.k}</b><span className="block text-[8.5px] text-[#64748b] truncate">{x.t}</span></span><span className="text-right"><b className="block text-[10px]">{x.p}</b><span className="text-[8.5px]" style={{ color: x.up ? '#16a34a' : '#dc2626' }}>{x.c}</span></span></div>)}
      <div className="flex-1" /><BottomNav s={s} active={1} items={[['pie', 'Cartera'], ['bars', 'Mercado'], ['transfer', 'Operar'], ['receipt', 'Movimientos'], ['user', 'Perfil']]} />
    </div>);
  if (s.v === 'asset') { const x = s.x || TICKERS[0]; return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop(x.k)}
      <div className="px-3 pt-2"><span className="text-[9px] text-[#64748b]">{x.type} · {x.t}</span><b className="block text-[20px]">{x.p}</b><span className="text-[9.5px]" style={{ color: x.up ? '#16a34a' : '#dc2626' }}>{x.c} hoy</span></div>
      <div className="px-3"><Spark up={x.up} /></div>
      <div className="flex gap-1 px-3 text-[8.5px] text-[#64748b]">{['1D', '1S', '1M', '1A', '5A'].map((t, i) => <span key={t} className={cx('rounded px-2 py-0.5', i === 2 && 'bg-[#eef2f7] text-[#0f172a] font-semibold')}>{t}</span>)}</div>
      <div className="m-3 rounded-lg bg-[#f8fafc] p-2.5 text-[9px] text-[#475569] flex flex-col gap-1">{(s.info || [['Moneda', 'Pesos'], ['Mercado', 'BYMA'], ['Tipo', x.type]]).map(([a, b]: string[]) => <div key={a} className="flex justify-between"><span>{a}</span><b className="text-[#0f172a]">{b}</b></div>)}</div>
      <div className="flex-1" /><div className="p-3 grid grid-cols-2 gap-2"><span {...H(s, 'sell', 'rounded-lg h-10 grid place-items-center text-[11px] font-semibold border-2')} style={{ borderColor: BKA, color: BKA }}>Vender</span><span {...H(s, 'buy', 'rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: BKA }}>Comprar</span></div>
    </div>); }
  if (s.v === 'order') { const x = s.x || TICKERS[0]; return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop('Comprar ' + x.k)}
      <div className="flex gap-1.5 px-3 pt-3">{['Precio de mercado', 'Precio límite'].map((t, i) => <span key={t} {...H(s, 'type' + i, cx('flex-1 rounded-lg h-8 grid place-items-center text-[9px] font-semibold border', (s.ptype ?? 1) === i ? 'text-white' : 'border-[#cbd5e1] text-[#334155]'))} style={(s.ptype ?? 1) === i ? { background: BKA, borderColor: BKA } : undefined}>{t}</span>)}</div>
      {[['qty', 'Cantidad', s.qty || '10'], ['price', 'Precio por unidad', x.p], ['term', 'Plazo de liquidación', s.term || '24 hs']].map(([id, a, b]) => <div key={id} className="px-3 pt-2.5"><span className="text-[8.5px] text-[#64748b]">{a}</span><div {...H(s, id, 'mt-0.5 flex items-center rounded-lg border border-[#cbd5e1] px-2.5 h-9 text-[11px]')}>{b}{id === 'term' && <I n="chevd" className="size-3 ml-auto" />}</div></div>)}
      <div className="m-3 rounded-lg bg-[#f8fafc] p-2.5 text-[9px] flex flex-col gap-1">{[['Monto estimado', s.total || '$ 24.500'], ['Comisión y derechos (aprox.)', s.fee || '$ 147'], ['Total', s.grand || '$ 24.647']].map(([a, b], i) => <div key={a} className={cx('flex justify-between', i === 2 && 'font-bold text-[10px] pt-1 border-t border-[#e2e8f0]')}><span>{a}</span><span>{b}</span></div>)}</div>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'review', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: BKA }}>Revisar orden</span></div>
    </div>); }
  if (s.v === 'confirm') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop('Confirmá la orden')}
      <div className="m-3 rounded-xl border border-[#e2e8f0] p-3 text-[10px] flex flex-col gap-1.5">{(s.rows || [['Operación', 'Compra'], ['Instrumento', 'EJM · Acción Ejemplo'], ['Cantidad', '10'], ['Precio límite', '$ 2.450'], ['Plazo', '24 hs'], ['Total estimado', '$ 24.647']]).map(([a, b]: string[]) => <div key={a} className="flex justify-between"><span className="text-[#64748b]">{a}</span><b>{b}</b></div>)}</div>
      <p className="px-3 text-[8.5px] text-[#64748b]">El precio final puede variar. La orden queda pendiente hasta que se ejecute en el mercado.</p>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'ok', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: BKA }}>Confirmar</span></div>
    </div>);
  if (s.v === 'portfolio') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f1f5f9]">{BkTop('Mi cartera', false)}
      <div className="px-3 py-3 text-white" style={{ background: BK }}><span className="text-[9px] opacity-80">Total invertido</span><b className="block text-[20px]">$ 350.000</b><span className="text-[9px] text-[#86efac]">Pesos disponibles: $ 12.400</span></div>
      <div className="flex gap-2 p-3">{[['deposit', 'deposit', 'Ingresar'], ['withdraw', 'upload', 'Retirar'], ['trade', 'transfer', 'Operar']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex-1 flex flex-col items-center gap-1 rounded-xl bg-white py-2 text-[9px] font-semibold shadow-sm')}><I n={ic} className="size-4" style={{ color: BKA }} />{t}</span>)}</div>
      <div className="mx-3 rounded-xl bg-white p-2.5 shadow-sm">{[['FCI de liquidez', '45 %', '#2f7df6'], ['Bonos', '25 %', '#22c55e'], ['CEDEARs', '20 %', '#f59e0b'], ['Acciones', '10 %', '#a855f7']].map(([t, p, c]) => <div key={t} className="flex items-center gap-2 py-1 text-[9.5px]"><span className="size-2 rounded-full" style={{ background: c }} /><span className="flex-1">{t}</span><b>{p}</b></div>)}</div>
      <div className="flex-1" /><BottomNav s={s} active={0} items={[['pie', 'Cartera'], ['bars', 'Mercado'], ['transfer', 'Operar'], ['receipt', 'Movimientos'], ['user', 'Perfil']]} />
    </div>);
  if (s.v === 'signup') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop('Abrí tu cuenta')}
      <div className="px-3 pt-3 flex gap-1">{[1, 2, 3, 4].map((n) => <span key={n} className={cx('flex-1 h-1 rounded', n <= (s.step ?? 1) ? '' : 'bg-[#e2e8f0]')} style={n <= (s.step ?? 1) ? { background: BKA } : undefined} />)}</div>
      {(s.step ?? 1) === 1 && <div className="px-3 pt-3 flex flex-col gap-2"><b className="text-[12px]">Tus datos</b>{['Nombre y apellido', 'Correo electrónico', 'Celular'].map((t, i) => <div key={t} {...H(s, 'f' + i, 'rounded-lg border border-[#cbd5e1] px-2.5 h-9 grid items-center text-[10px] text-[#94a3b8]')}>{t}</div>)}</div>}
      {(s.step ?? 1) === 2 && <div className="px-3 pt-3 flex flex-col items-center gap-2 text-center"><b className="text-[12px]">Validá tu identidad</b><div {...H(s, 'dni', 'w-full h-24 rounded-xl border-2 border-dashed border-[#cbd5e1] grid place-items-center text-[9.5px] text-[#64748b]')}>Foto del documento (frente y dorso)</div><div {...H(s, 'selfie', 'size-20 rounded-full border-2 border-dashed border-[#cbd5e1] grid place-items-center text-[9px] text-[#64748b]')}>Selfie</div></div>}
      {(s.step ?? 1) === 3 && <div className="px-3 pt-3 flex flex-col gap-2"><b className="text-[12px]">Tu perfil de inversor</b><p className="text-[9.5px] text-[#475569]">Si tus inversiones bajan un 10 % en un mes, ¿qué harías?</p>{['Vendo todo', 'Espero sin hacer nada', 'Compro más'].map((t, i) => <span key={t} {...H(s, 'q' + i, cx('rounded-lg border px-2.5 h-9 grid items-center text-[10px]', s.pick === i ? 'border-[#2f7df6] bg-[#eff6ff]' : 'border-[#cbd5e1]'))}>{t}</span>)}</div>}
      {(s.step ?? 1) === 4 && <div className="px-3 pt-3 flex flex-col gap-2"><b className="text-[12px]">Tu cuenta bancaria</b><p className="text-[9.5px] text-[#475569]">Para ingresar y retirar dinero usás una cuenta a tu nombre.</p><div {...H(s, 'cbu', 'rounded-lg border border-[#cbd5e1] px-2.5 h-9 grid items-center text-[10px] text-[#94a3b8]')}>CBU o CVU propio</div><label className="flex items-center gap-2 text-[9px]"><span className="size-3.5 rounded border border-[#94a3b8]" />Leí y acepto los términos y el reglamento</label></div>}
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'next', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: BKA }}>Continuar</span></div>
    </div>);
  if (s.v === 'deposit') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop('Ingresar dinero')}
      <p className="px-3 pt-3 text-[9.5px] text-[#475569]">Transferí desde tu banco o billetera, a tu nombre, a estos datos:</p>
      {[['CBU de tu cuenta comitente', '2850590940090418135201', 'cbu'], ['Alias', 'MARTA.INVIERTE.EJM', 'alias']].map(([a, b, id]) => <div key={id} className="mx-3 mt-2 rounded-xl border border-[#e2e8f0] p-2.5"><span className="text-[8.5px] text-[#64748b]">{a}</span><div className="flex items-center gap-2"><b className="flex-1 text-[10.5px] break-all">{b}</b><span {...H(s, id, 'rounded p-0.5')} style={{ color: BKA }}><I n="copy" className="size-4" /></span></div></div>)}
      <div className="mx-3 mt-2 rounded-lg bg-[#fff7ed] p-2.5 text-[9px] text-[#9a3412]">La cuenta de origen tiene que estar a tu nombre.</div>
      <div className="flex-1" />
    </div>);
  if (s.v === 'fci') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop('Fondos comunes de inversión')}
      <div className="flex gap-1.5 px-3 py-2">{['Liquidez', 'Renta fija', 'Renta variable'].map((c, i) => <span key={c} {...H(s, 'cat' + i, cx('rounded-full px-2.5 h-6 grid place-items-center text-[8.5px] font-semibold', (s.cat ?? 0) === i ? 'text-white' : 'bg-[#eef2f7]'))} style={(s.cat ?? 0) === i ? { background: BKA } : undefined}>{c}</span>)}</div>
      {[['Fondo Ejemplo Ahorro Pesos', 'Riesgo bajo · Rescate inmediato'], ['Fondo Ejemplo Renta Fija', 'Riesgo medio · Rescate en 1 día hábil'], ['Fondo Ejemplo Acciones', 'Riesgo alto · Rescate en 2 días hábiles']].map(([t, d], i) => <div key={i} {...H(s, 'f' + i, 'flex items-center gap-2.5 px-3 py-2.5 border-b border-[#f1f5f9]')}><span className="grid place-items-center size-8 rounded-lg bg-[#eff6ff]"><I n="pie" className="size-4" style={{ color: BKA }} /></span><span className="flex-1"><b className="block text-[10px]">{t}</b><span className="text-[8.5px] text-[#64748b]">{d}</span></span><I n="chev" className="size-3 text-[#94a3b8]" /></div>)}
      <div className="flex-1" />
    </div>);
  if (s.v === 'pf') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop('Plazo fijo')}
      <div className="flex gap-1.5 px-3 pt-3">{['Tradicional', 'UVA'].map((t, i) => <span key={t} {...H(s, 'kind' + i, cx('flex-1 rounded-lg h-8 grid place-items-center text-[9.5px] font-semibold border', (s.kind ?? 0) === i ? 'text-white' : 'border-[#cbd5e1]'))} style={(s.kind ?? 0) === i ? { background: BKA, borderColor: BKA } : undefined}>{t}</span>)}</div>
      {[['amt', 'Monto', s.amt || '$ 500.000'], ['days', 'Plazo', s.days || '30 días']].map(([id, a, b]) => <div key={id} className="px-3 pt-2.5"><span className="text-[8.5px] text-[#64748b]">{a}</span><div {...H(s, id, 'mt-0.5 rounded-lg border border-[#cbd5e1] px-2.5 h-9 grid items-center text-[11px]')}>{b}</div></div>)}
      <div className="m-3 rounded-lg bg-[#f8fafc] p-2.5 text-[9px] flex flex-col gap-1">{[['Tasa nominal anual (TNA)', s.tna || 'La informa tu banco'], ['Interés estimado', s.int || '—'], ['Vence el', s.due || '15/11/2026']].map(([a, b]) => <div key={a} className="flex justify-between"><span>{a}</span><b>{b}</b></div>)}</div>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'ok', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: BKA }}>Constituir plazo fijo</span></div>
    </div>);
  if (s.v === 'mep') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{BkTop('Dólar MEP')}
      <div className="flex gap-1.5 px-3 pt-3">{['Comprar', 'Vender'].map((t, i) => <span key={t} className={cx('flex-1 rounded-lg h-8 grid place-items-center text-[9.5px] font-semibold border', i === 0 ? 'text-white' : 'border-[#cbd5e1]')} style={i === 0 ? { background: BKA, borderColor: BKA } : undefined}>{t}</span>)}</div>
      <div className="px-3 pt-2.5"><span className="text-[8.5px] text-[#64748b]">Monto en pesos</span><div {...H(s, 'amt', 'mt-0.5 rounded-lg border border-[#cbd5e1] px-2.5 h-9 grid items-center text-[11px]')}>{s.amt || '$ 300.000'}</div></div>
      <div className="m-3 rounded-lg bg-[#f8fafc] p-2.5 text-[9px] flex flex-col gap-1">{[['Cotización estimada', 'La ves al operar'], ['Recibís aproximadamente', 'US$ —'], ['Acreditación', 'Según las reglas vigentes']].map(([a, b]) => <div key={a} className="flex justify-between"><span>{a}</span><b>{b}</b></div>)}</div>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'ok', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: BKA }}>Continuar</span></div>
    </div>);
  return Broker({ ...s, v: 'portfolio' });
}

/* ================= EXCHANGE CRIPTO (genérico) ================= */
const CX = '#6d28d9';
export function Crypto(s: any) {
  if (s.v === 'buy') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white"><div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="text-[11.5px]">Comprar {s.coin || 'USDT'}</b></div>
      <div className="flex flex-col items-center pt-6 gap-1"><span className="text-[9px] text-[#666]">Vas a pagar</span><b {...H(s, 'amt', 'text-[26px] rounded-lg px-2')}>{s.amt || '$ 20.000'}</b><span className="text-[9px] text-[#666]">Recibís aprox. {s.get || '— ' + (s.coin || 'USDT')}</span></div>
      <div className="m-3 rounded-lg bg-[#f5f3ff] p-2.5 text-[9px] text-[#4c1d95]">El precio de las criptomonedas cambia todo el tiempo. Mirá el total antes de confirmar.</div>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'ok', 'block rounded-lg h-10 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: CX }}>Confirmar compra</span></div>
    </div>);
  if (s.v === 'security') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white"><div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="text-[11.5px]">Seguridad</b></div>
      {[['Verificación en dos pasos', 'Pedirá un código extra al ingresar', true], ['Bloqueo con huella o rostro', '', true], ['Direcciones de retiro de confianza', '', false]].map(([t, d, on], i) => <div key={i} {...H(s, 'r' + i, 'flex items-center gap-3 px-3 py-2.5')}><span className="flex-1"><span className="block text-[10.5px]">{t as string}</span>{d && <span className="text-[8.5px] text-[#666]">{d as string}</span>}</span><span className={cx('w-7 h-4 rounded-full relative', on ? '' : 'bg-[#d4d4d8]')} style={on ? { background: CX } : undefined}><span className={cx('absolute top-0.5 size-3 rounded-full bg-white', on ? 'right-0.5' : 'left-0.5')} /></span></div>)}
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#faf9ff]">
      <div className="px-3 pt-2 pb-3 text-white" style={{ background: CX }}><div className="flex items-center gap-2"><Avatar t="Marta" n={3} size={24} /><b className="flex-1 text-[11px]">Tu saldo</b><I n="eye" className="size-4" /></div><b className="block mt-2 text-[20px]">$ 45.200</b><span className="text-[9px] opacity-80">Equivalente en pesos</span>
        <div className="flex gap-2 mt-2.5">{[['buy', 'plus', 'Comprar'], ['sell', 'transfer', 'Vender'], ['deposit', 'deposit', 'Ingresar']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex-1 flex items-center justify-center gap-1 rounded-full bg-white/15 h-8 text-[9.5px] font-semibold')}><I n={ic} className="size-3.5" />{t}</span>)}</div></div>
      {[['USDT', 'Dólar digital (stablecoin)', '$ 30.100', 'dollar'], ['BTC', 'Bitcoin', '$ 15.100', 'btc'], ['ARS', 'Pesos', '$ 0', 'wallet']].map(([k, t, v, ic], i) => <div key={k} {...H(s, 'c' + i, 'flex items-center gap-2.5 px-3 py-2.5 border-b border-[#efeefc]')}><span className="grid place-items-center size-8 rounded-full bg-[#ede9fe]" style={{ color: CX }}><I n={ic} className="size-4" /></span><span className="flex-1"><b className="block text-[10px]">{k}</b><span className="text-[8.5px] text-[#666]">{t}</span></span><b className="text-[10px]">{v}</b></div>)}
      <div className="flex-1" />
    </div>
  );
}

/* ================= CANVA ================= */
const CV = '#7d2ae8';
export function Canva(s: any) {
  if (s.v === 'editor') { const sel = s.sel; return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#ebecf0]">
      <div className="flex items-center gap-3 px-3 h-10 bg-white shrink-0"><I n="back" className="size-4" /><span {...H(s, 'undo', 'rounded p-0.5')}><I n="undo" className="size-4" /></span><I n="redo" className="size-4 opacity-40" /><span className="flex-1" /><span {...H(s, 'share', 'flex items-center gap-1 rounded-md px-2.5 h-7 text-[9.5px] font-semibold text-white')} style={{ background: CV }}><I n="upload" className="size-3.5" />Compartir</span></div>
      <div className="flex-1 grid place-items-center p-4"><div {...H(s, 'canvas', 'relative w-[80%] aspect-[4/5] shadow-md')} style={{ background: s.bg || 'linear-gradient(160deg,#fde2e4,#fad2a3)' }}>
        <span className="absolute left-1/2 top-[14%] -translate-x-1/2 text-[22px]">{s.emoji || '🎂'}</span>
        <span {...H(s, 'title', cx('absolute inset-x-3 top-[34%] text-center font-bold leading-tight text-[#7a2e3a] rounded', sel === 'title' && 'ring-2 ring-[#00c4cc]'))} style={{ fontSize: 15 }}>{s.title || '¡Feliz cumple!'}</span>
        <span {...H(s, 'sub', cx('absolute inset-x-4 top-[58%] text-center text-[9px] text-[#7a2e3a] rounded', sel === 'sub' && 'ring-2 ring-[#00c4cc]'))}>{s.sub || 'Con todo nuestro cariño'}</span>
        {s.photo != null && <span {...H(s, 'photo', cx('absolute left-1/2 bottom-[8%] -translate-x-1/2 size-16 rounded-full overflow-hidden border-2 border-white', sel === 'photo' && 'ring-2 ring-[#00c4cc]'))}><Pic n={s.photo} className="w-full h-full" /></span>}
      </div></div>
      {sel === 'title' || sel === 'sub' ? <div className="flex justify-around bg-white py-2 shrink-0 text-[8.5px]">{[['font', 'type', 'Fuente'], ['size', 'sliders', 'Tamaño'], ['color', 'palette', 'Color'], ['fmt', 'grid', 'Formato'], ['edit', 'pencil', 'Editar']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex flex-col items-center gap-0.5 rounded px-1')}><I n={ic} className="size-4" />{t}</span>)}</div>
        : <div className="flex justify-around bg-white py-2 shrink-0 text-[8.5px]">{[['add', 'plus', 'Agregar'], ['design', 'grid', 'Diseño'], ['elements', 'sparkles', 'Elementos'], ['text', 'type', 'Texto'], ['gallery', 'images', 'Galería']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex flex-col items-center gap-0.5 rounded px-1')}><span className={cx('grid place-items-center', id === 'add' && 'size-6 rounded-full text-white')} style={id === 'add' ? { background: CV } : undefined}><I n={ic} className="size-4" /></span>{t}</span>)}</div>}
    </div>); }
  if (s.v === 'share') return <Sheet s={s} title="Compartir este diseño" grid={4} base={Canva({ v: 'editor' })} items={[{ t: 'Descargar', i: 'download', c: '#7d2ae8' }, { t: 'WhatsApp', i: 'comment', c: '#1daa61' }, { t: 'Instagram', i: 'camera', c: '#d62976' }, { t: 'Copiar enlace', i: 'link', c: '#5f6368' }]} />;
  if (s.v === 'download') return <Sheet s={s} title="Descargar" base={Canva({ v: 'editor' })} items={[{ t: 'Tipo de archivo: PNG', i: 'image', sub: 'Ideal para WhatsApp y redes' }, { t: 'PDF para imprimir', i: 'print', sub: 'La mejor calidad en papel' }, { t: 'Descargar', i: 'download' }]} />;
  if (s.v === 'templates') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-2 px-3 h-11"><I n="back" className="size-4" /><SearchPill s={s} id="q" t={s.q || 'tarjeta de cumpleaños'} className="flex-1" /></div>
      <div className="flex gap-1.5 px-3 pb-2">{['Todos', 'Gratis', 'Vertical', 'Con foto'].map((c, i) => <span key={c} {...H(s, 'chip' + i, cx('rounded-full px-2.5 h-6 grid place-items-center text-[8.5px] font-semibold', (s.chip ?? 0) === i ? 'bg-[#f1e8fd] text-[#7d2ae8]' : 'bg-[#f2f3f5]'))}>{c}</span>)}</div>
      <div className="grid grid-cols-2 gap-2 px-3">{[['¡Feliz cumple!', 'linear-gradient(160deg,#fde2e4,#fad2a3)', false], ['Celebremos', 'linear-gradient(160deg,#cdeaff,#a6c8ff)', true], ['Muchas felicidades', 'linear-gradient(160deg,#e3f6e5,#b9e4c0)', false], ['Feliz día', 'linear-gradient(160deg,#fff3c4,#ffd27a)', true]].map(([t, bg, pro], i) => <div key={i} {...H(s, 't' + i, 'relative aspect-[4/5] rounded-lg shadow-sm grid place-items-center text-center p-2')} style={{ background: bg as string }}><b className="text-[11px] text-[#5b2333]">{t as string}</b>{pro && <span className="absolute right-1 bottom-1 grid place-items-center size-4 rounded-full bg-[#f5b400] text-[7px]">👑</span>}</div>)}</div>
      <div className="flex-1" />
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="px-3 pt-3 pb-4 text-white" style={{ background: 'linear-gradient(120deg,#00c4cc,#7d2ae8)' }}><b className="block text-center text-[13px] mb-2.5">¿Qué vas a diseñar hoy?</b><div {...H(s, 'search', 'flex items-center gap-2 rounded-full bg-white h-9 px-3 text-[10px] text-[#666]')}><I n="search" className="size-3.5" />Buscar diseños y plantillas</div></div>
      <div className="flex justify-between px-3 py-3">{[['Para ti', 'sparkles', '#7d2ae8'], ['Tarjetas', 'heart', '#e5484d'], ['Invitaciones', 'gift', '#f59e0b'], ['Historias', 'cel', '#0ea5e9'], ['Collages', 'grid', '#22c55e']].map(([t, ic, c], i) => <span key={t} {...H(s, 'cat' + i, 'flex flex-col items-center gap-1 rounded-lg')}><span className="grid place-items-center size-10 rounded-full text-white" style={{ background: c }}><I n={ic} className="size-4" /></span><span className="text-[8px]">{t}</span></span>)}</div>
      <b className="px-3 text-[10.5px]">Recientes</b><div className="flex gap-2 px-3 py-2">{[0, 1].map((i) => <div key={i} className="w-20 aspect-[4/5] rounded-lg shadow-sm" style={{ background: i ? 'linear-gradient(160deg,#cdeaff,#a6c8ff)' : 'linear-gradient(160deg,#fde2e4,#fad2a3)' }} />)}</div>
      <div className="flex-1" /><BottomNav s={s} active={0} items={[['home', 'Inicio'], ['folder', 'Proyectos'], ['+', ''], ['grid', 'Plantillas'], ['menu', 'Menú']]} />
    </div>
  );
}

/* ================= CAPCUT ================= */
export function CapCut(s: any) {
  if (s.v === 'pick') { const sel: number[] = s.sel || []; return (
    <div className="flex-1 flex flex-col min-h-0 bg-black text-white">
      <div className="flex items-center gap-3 px-3 h-10"><I n="x" className="size-4" /><span className="flex-1 flex gap-3 text-[10px]"><b>Fotos</b><span className="opacity-60">Videos</span></span></div>
      <div className="grid grid-cols-4 gap-0.5">{[3, 0, 4, 2, 6, 1, 7, 5, 3, 0, 2, 4].map((p, i) => <div key={i} {...H(s, 'g' + i, 'relative')}><Pic n={p} className="aspect-square" /><span className={cx('absolute right-1 top-1 grid place-items-center size-4 rounded-full border border-white text-[7.5px] font-bold', sel.includes(i) && 'bg-[#00c4cc] border-[#00c4cc]')}>{sel.includes(i) ? sel.indexOf(i) + 1 : ''}</span></div>)}</div>
      <div className="flex-1" /><div className="flex items-center justify-between px-3 py-2.5"><span className="text-[9px] opacity-70">{sel.length} seleccionadas</span><span {...H(s, 'add', 'rounded-full bg-[#00c4cc] px-4 h-8 grid place-items-center text-[10px] font-semibold text-black')}>Agregar ({sel.length})</span></div>
    </div>); }
  if (s.v === 'editor') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#111] text-white">
      <div className="flex items-center gap-3 px-3 h-10"><I n="x" className="size-4" /><span className="flex-1" /><span className="text-[9px] opacity-70">1080P ▾</span><span {...H(s, 'export', 'rounded-md bg-[#00c4cc] px-2.5 h-7 grid place-items-center text-[9.5px] font-semibold text-black')}>Exportar</span></div>
      <div className="relative mx-6 my-2"><Pic n={s.photo ?? 0} className="w-full aspect-video rounded" />{s.text && <b className="absolute inset-x-0 top-1/3 text-center text-[13px] drop-shadow">{s.text}</b>}</div>
      <div className="flex justify-center gap-6 py-1 text-[8.5px] opacity-80"><span>00:03 / 00:20</span><I n="play" className="size-4" /></div>
      <div className="relative mt-2 px-3">
        <div className="flex gap-0.5 h-10">{[0, 4, 2, 6, 3].map((p, i) => <div key={i} {...H(s, 'clip' + i, cx('flex-1 rounded-sm overflow-hidden', s.selClip === i && 'ring-2 ring-white'))}><Pic n={p} className="w-full h-full" /></div>)}</div>
        {s.music && <div className="mt-1 h-4 rounded-sm bg-[#1fa45a]/80 text-[7px] px-1 grid items-center">♪ Mañana tranquila</div>}
        {s.text && <div className="mt-1 h-4 w-2/5 rounded-sm bg-[#e6a400]/80 text-[7px] px-1 grid items-center">T {s.text}</div>}
        <span className="absolute left-1/2 -top-1 bottom-0 w-px bg-white" />
      </div>
      <div className="flex-1" />
      <div className="flex justify-around py-2.5 border-t border-white/10 text-[8px]">{[['edit', 'cut', 'Editar'], ['audio', 'music', 'Audio'], ['text', 'type', 'Texto'], ['effects', 'sparkles', 'Efectos'], ['filters', 'sliders', 'Filtros'], ['captions', 'subs', 'Subtítulos']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex flex-col items-center gap-0.5 rounded px-1')}><I n={ic} className="size-4" />{t}</span>)}</div>
    </div>);
  if (s.v === 'audio') return <Sheet s={s} dark title="Sonidos" base={CapCut({ v: 'editor' })} items={[{ t: 'Mañana tranquila', i: 'music', sub: 'Acústica · 2:10' }, { t: 'Recuerdos', i: 'music', sub: 'Piano · 1:45' }, { t: 'Fiesta en familia', i: 'music', sub: 'Alegre · 2:30' }]} />;
  if (s.v === 'exportDone') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#111] text-white items-center justify-center gap-3 px-6 text-center"><span className="grid place-items-center size-14 rounded-full bg-[#00c4cc] text-black"><I n="check" className="size-7" /></span><b className="text-[13px]">Guardado en tu galería</b>
      <div className="flex gap-3">{[['wa', 'comment', 'WhatsApp', '#1daa61'], ['more', 'moreh', 'Más', '#444']].map(([id, ic, t, c]) => <span key={id} {...H(s, id, 'flex flex-col items-center gap-1 rounded-lg')}><span className="grid place-items-center size-10 rounded-full" style={{ background: c }}><I n={ic} className="size-4" /></span><span className="text-[8.5px]">{t}</span></span>)}</div></div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#111] text-white">
      <div className="flex items-center justify-end gap-3 px-3 h-10"><I n="help" className="size-4" /><I n="settings" className="size-4" /></div>
      <div {...H(s, 'new', 'mx-3 mt-2 flex flex-col items-center justify-center gap-1.5 rounded-xl h-28 bg-[#1f1f1f]')}><span className="grid place-items-center size-10 rounded-full bg-white text-black"><I n="plus" className="size-5" /></span><b className="text-[11px]">Nuevo proyecto</b></div>
      <div className="grid grid-cols-4 gap-2 px-3 py-3">{[['Autocorte', 'wand'], ['Plantillas', 'grid'], ['Quitar fondo', 'eraser'], ['Subtítulos', 'subs']].map(([t, ic], i) => <span key={t} {...H(s, 'tool' + i, 'flex flex-col items-center gap-1 rounded-lg')}><span className="grid place-items-center size-10 rounded-xl bg-[#1f1f1f]"><I n={ic} className="size-4" /></span><span className="text-[8px]">{t}</span></span>)}</div>
      <b className="px-3 text-[10.5px]">Proyectos</b><div className="flex gap-2 px-3 py-2"><Pic n={0} className="w-20 h-12 rounded" /><Pic n={3} className="w-20 h-12 rounded" /></div>
      <div className="flex-1" /><BottomNav s={s} dark active={0} items={[['clap', 'Editar'], ['grid', 'Plantillas'], ['inbox', 'Bandeja'], ['user', 'Yo']]} />
    </div>
  );
}

/* ================= AJUSTES DEL CELULAR ================= */
export const SET_ROWS: Record<string, [string, string, string]> = {
  conexiones: ['wifi', 'Conexiones', '#3e91ff'], sonidos: ['speaker', 'Sonidos y vibración', '#a07cf2'], notif: ['bell', 'Notificaciones', '#f25555'],
  pantalla: ['sun', 'Pantalla', '#61b94a'], seguridad: ['lock', 'Seguridad y privacidad', '#4a74ea'], ubicacion: ['pin', 'Ubicación', '#3e91ff'],
  cuentas: ['cloud', 'Cuentas y copia de seguridad', '#3e91ff'], google: ['globe', 'Google', '#3e91ff'], bienestar: ['activity', 'Bienestar digital', '#61b94a'],
  bateria: ['activity', 'Batería', '#61b94a'], general: ['sliders', 'Administración general', '#7c8796'], accesibilidad: ['a11y', 'Accesibilidad', '#57b26a'],
  update: ['refresh', 'Actualización de software', '#a07cf2'], apps: ['grid', 'Aplicaciones', '#4a74ea']
};
export function Settings(s: any) {
  const rows = s.rows || ['conexiones', 'notif', 'pantalla', 'seguridad', 'cuentas', 'google', 'bienestar', 'accesibilidad', 'update'];
  if (s.v === 'list') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f6f6f8]">
      <div className="flex items-center gap-3 px-3 h-11"><I n="chevl" className="size-4" /><b className="flex-1 text-[13px]">{s.title}</b><I n="search" className="size-4" /></div>
      <div className="mx-2.5 rounded-2xl bg-white overflow-hidden">{s.items.map((r: any, i: number) => { const o = typeof r === 'string' ? { t: r } : r; return (
        <div key={i} {...H(s, 'r' + i, 'flex items-center gap-3 px-3 py-2.5 border-b border-[#f1f1f3] last:border-0')}><span className="flex-1 min-w-0"><span className="block text-[10.5px]">{o.t}</span>{o.s && <span className="block text-[8.5px]" style={{ color: o.blue ? '#3e91ff' : '#6b6b70' }}>{o.s}</span>}</span>
          {o.tg != null && <span className={cx('w-8 h-[18px] rounded-full relative', o.tg ? 'bg-[#3e91ff]' : 'bg-[#c9c9ce]')}><span className={cx('absolute top-[2px] size-3.5 rounded-full bg-white', o.tg ? 'right-[2px]' : 'left-[2px]')} /></span>}
          {o.slider != null && <span className="w-24 h-1.5 rounded-full bg-[#dcdce0] relative"><span className="absolute inset-y-0 left-0 rounded-full bg-[#3e91ff]" style={{ width: o.slider + '%' }} /><span className="absolute -top-1 size-3.5 rounded-full bg-white border border-[#3e91ff]" style={{ left: `calc(${o.slider}% - 7px)` }} /></span>}
        </div>); })}</div>
      {s.preview && <div className="mx-2.5 mt-3 rounded-2xl bg-white p-3"><span className="text-[8.5px] text-[#6b6b70]">Vista previa</span><p style={{ fontSize: s.preview }} className="leading-snug">Así se ve el texto en tu celular.</p></div>}
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f6f6f8]">
      <div className="flex items-end justify-between px-4 pt-5 pb-3"><b className="text-[20px]">Ajustes</b><span {...H(s, 'search', 'rounded-full p-1')}><I n="search" className="size-4" /></span></div>
      <div className="mx-2.5 mb-2 flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5"><Avatar t="Marta" n={3} size={30} /><span><b className="block text-[11px]">Marta Gómez</b><span className="text-[8.5px] text-[#6b6b70]">Cuenta</span></span></div>
      <div className="mx-2.5 rounded-2xl bg-white overflow-hidden">{rows.map((k: string, i: number) => { const [ic, t, c] = SET_ROWS[k]; return <div key={k} {...H(s, k, 'flex items-center gap-3 px-3 py-2 border-b border-[#f1f1f3] last:border-0')}><span className="grid place-items-center size-7 rounded-full text-white" style={{ background: c }}><I n={ic} className="size-3.5" /></span><span className="text-[10.5px]">{t}</span></div>; })}</div>
    </div>
  );
}

/* ================= INICIO DEL CELULAR, TIENDA Y CÁMARA ================= */
const HOME_APPS: [string, string, string][] = [
  ['WhatsApp', 'comment', '#1daa61'], ['YouTube', 'play', '#ff0033'], ['Maps', 'pin', '#34a853'], ['Fotos', 'images', '#fbbc04'],
  ['Facebook', 'users', '#0866ff'], ['Instagram', 'camera', '#d62976'], ['TikTok', 'music', '#111111'], ['Drive', 'folder', '#1e8e3e'],
  ['Traductor', 'translate', '#4285f4'], ['Calendar', 'calendar', '#1a73e8'], ['ChatGPT', 'sparkles', '#111111'], ['Gemini', 'sparkles', '#4285f4'],
  ['Billetera', 'wallet', '#009ee3'], ['Mercado Libre', 'bag', '#e6c700'], ['Canva', 'palette', '#7d2ae8'], ['CapCut', 'clap', '#111111'],
  ['Inversiones', 'up', '#0b2a4a'], ['Cripto', 'btc', '#6d28d9'], ['Play Store', 'store', '#01875f'], ['Ajustes', 'settings', '#6b7280'],
  ['Google', 'search', '#4285f4'], ['Mi banco', 'bank', '#1e4f8a'], ['Cámara', 'camera', '#444b52'], ['Galería', 'images', '#d0663a']
];
export function Phone(s: any) {
  if (s.v === 'store') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="px-3 pt-2"><SearchPill s={s} id="q" t={s.q} ph="Buscar apps y juegos" /></div>
      {(s.apps || [[s.q || 'App', s.dev || 'Desarrollador oficial', '4,5 ★ · 500 M+', '#111']]).map(([t, d, r, c]: string[], i: number) => (
        <div key={i} {...H(s, 'a' + i, 'flex items-center gap-2.5 px-3 py-2.5')}><span className="grid place-items-center size-11 rounded-xl text-white" style={{ background: c }}><I n="sparkles" className="size-5" /></span><span className="flex-1 min-w-0"><b className="block text-[10.5px] truncate">{t}</b><span className="block text-[8.5px] text-[#5f6368] truncate">{d}</span><span className="text-[8.5px] text-[#5f6368]">{r}</span></span><span {...H(s, 'install' + i, 'rounded-full px-3 h-7 grid place-items-center text-[9.5px] font-semibold text-white bg-[#01875f]')}>Instalar</span></div>
      ))}
      <div className="flex-1" />{s.kb && <Keyboard s={s} />}
    </div>);
  if (s.v === 'camera') return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-black text-white">
      <div className="relative flex items-center justify-between px-3 h-10"><I n="settings" className="size-4" /><I n="sun" className="size-4" /></div>
      <div className="relative flex-1 mx-1"><Pic n={s.photo ?? 6} className="absolute inset-0 rounded" /></div>
      <div className="relative flex justify-center gap-4 py-2 text-[8.5px]"><span className="opacity-60">VIDEO</span><b className="text-[#ffd400]">FOTO</b><span className="opacity-60">RETRATO</span></div>
      <div className="relative flex items-center justify-around pb-4"><Pic n={3} className="size-9 rounded-full" round /><span {...H(s, 'shot', 'grid place-items-center size-14 rounded-full border-4 border-white')}><span className="size-11 rounded-full bg-white" /></span><span className="grid place-items-center size-9 rounded-full bg-white/15"><I n="refresh" className="size-4" /></span></div>
    </div>);
  let apps = s.apps ? HOME_APPS.filter((a) => s.apps.includes(a[0])) : HOME_APPS.slice(0, 16);
  if (s.hl && !apps.some((a) => a[0] === s.hl)) { const t = HOME_APPS.find((a) => a[0] === s.hl); if (t) apps = [...apps.slice(0, 15), t]; }
  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: 'linear-gradient(170deg,#3a5a7a 0%,#1d2f45 55%,#14202e 100%)' }}>
      <div className="px-5 pt-5 text-white"><b className="block text-[30px] font-light leading-none">10:24</b><span className="text-[10px] opacity-85">Jueves, 16 de octubre</span></div>
      <div className="mx-4 mt-3 flex items-center gap-2 rounded-full bg-white/90 h-8 px-3 text-[10px] text-[#5f6368]"><I n="search" className="size-3.5" />Buscar</div>
      <div className="grid grid-cols-4 gap-x-2 gap-y-3 px-4 pt-4 content-start">
        {apps.map(([t, ic, c]) => (
          <span key={t} {...H(s, t, 'flex flex-col items-center gap-1 rounded-xl')}><span className="grid place-items-center size-11 rounded-[14px] text-white shadow-md" style={{ background: c }}><I n={ic} className="size-5" /></span><span className="text-[8px] text-white text-center leading-tight w-full truncate">{t}</span></span>
        ))}
      </div>
      <div className="flex-1" />
      <div className="mx-4 mb-3 flex justify-around rounded-[22px] bg-white/15 py-2">{[['phone', '#1daa61'], ['comment', '#3e91ff'], ['globe', '#4285f4'], ['camera', '#555']].map(([ic, c], i) => <span key={i} className="grid place-items-center size-10 rounded-[13px] text-white" style={{ background: c }}><I n={ic} className="size-5" /></span>)}</div>
    </div>
  );
}
