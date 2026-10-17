/* WhatsApp, YouTube, Facebook, Instagram y TikTok: pantallas fieles a la disposición real de cada app */
import React from 'react';
import { cx } from '../../../ui';
import { H, I, StatusBar, Pic, Avatar, BottomNav, Sheet, SearchPill, Keyboard } from './kit';

/* ================= WHATSAPP ================= */
const WG = '#1daa61';
export const WA_CHATS = [
  { t: 'Hija', m: 'Te quiero ma ❤️', h: '10:12', u: 2 }, { t: 'Familia Pérez', m: 'Juan: ¿el domingo almorzamos?', h: '9:40', u: 5 },
  { t: 'Club de bochas', m: 'Mañana a las 10 en la cancha', h: 'Ayer' }, { t: 'Dr. López', m: 'Turno confirmado para el martes', h: 'Ayer' },
  { t: 'Vecinos del edificio', m: 'Marta: se corta el agua el jueves', h: 'Lun' }, { t: 'Carlos', m: 'Audio · 0:42', h: 'Dom' }
];
function WaChats(s: any) {
  const items = s.items || WA_CHATS;
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center px-3 h-10 shrink-0"><b className="flex-1 text-[15px] tracking-tight" style={{ color: WG }}>{s.sel != null ? '' : 'WhatsApp'}</b>
        {s.sel != null ? <div className="flex-1 flex items-center gap-3 text-[#3b4a54]"><I n="back" className="size-4" /><b className="flex-1 text-[12px] text-[#111]">1</b><span {...H(s, 'pin', 'rounded p-0.5')}><I n="pinned" className="size-4" /></span><span {...H(s, 'mute', 'rounded p-0.5')}><I n="mute" className="size-4" /></span><span {...H(s, 'archive', 'rounded p-0.5')}><I n="archive" className="size-4" /></span><I n="more" className="size-4" /></div>
          : <div className="flex items-center gap-3 text-[#3b4a54]"><I n="camera" className="size-4" /><span {...H(s, 'menu', 'rounded p-0.5')}><I n="more" className="size-4" /></span></div>}
      </div>
      <div className="px-3"><SearchPill s={s} ph="Buscar" className="!bg-[#f0f2f5] !rounded-full" /></div>
      <div className="flex gap-1.5 px-3 py-2 shrink-0">{['Todos', 'No leídos', 'Favoritos', 'Grupos'].map((c, i) => <span key={c} {...H(s, 'chip' + i, cx('px-2.5 h-6 grid place-items-center rounded-full text-[9px] font-medium', (s.chip ?? 0) === i ? 'bg-[#d8fdd2] text-[#0a5c36]' : 'bg-[#f0f2f5] text-[#54656f]'))}>{c}</span>)}</div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {s.archived && <div {...H(s, 'arch', 'flex items-center gap-3 px-3 py-2 text-[10.5px] text-[#111]')}><I n="archive" className="size-4 text-[#54656f]" /><span className="flex-1 font-medium">Archivados</span><span className="text-[9px]" style={{ color: WG }}>1</span></div>}
        {items.map((c: any, i: number) => (
          <div key={i} {...H(s, 'c' + i, cx('flex items-center gap-2.5 px-3 py-2', s.sel === i && 'bg-[#e7f6ec]'))}>
            <span className="relative"><Avatar t={c.t} n={i} size={34} />{s.sel === i && <span className="absolute -right-0.5 -bottom-0.5 grid place-items-center size-3.5 rounded-full text-white" style={{ background: WG }}><I n="check" className="size-2.5" /></span>}</span>
            <span className="flex-1 min-w-0"><span className="flex justify-between"><b className="text-[11px] text-[#111] truncate">{c.t}</b><span className="text-[8.5px]" style={{ color: c.u ? WG : '#667781' }}>{c.h}</span></span>
              <span className="flex justify-between items-center gap-1"><span className="text-[9.5px] text-[#667781] truncate">{c.m}</span>{c.pin && <I n="pinned" className="size-2.5 text-[#8696a0] rotate-45" />}{c.u ? <span className="grid place-items-center min-w-[15px] h-[15px] rounded-full px-1 text-[8px] font-bold text-white" style={{ background: WG }}>{c.u}</span> : null}</span></span>
          </div>
        ))}
      </div>
      <div className="relative"><span {...H(s, 'fab', 'absolute right-3 -top-12 grid place-items-center size-11 rounded-2xl text-white shadow-md')} style={{ background: WG }}><I n="plus" className="size-4" /></span></div>
      <BottomNav s={s} active={s.tab ?? 0} items={[['comment', 'Chats'], ['circle', 'Novedades'], ['users', 'Comunidades'], ['phone', 'Llamadas']]} />
    </div>
  );
}
function WaChat(s: any) {
  const msgs = s.msgs || [];
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {s.selMsg != null ? (
        <div className="flex items-center gap-3 px-3 h-11 shrink-0 bg-white text-[#3b4a54] border-b border-[#eee]"><I n="back" className="size-4" /><b className="flex-1 text-[12px] text-[#111]">1</b>
          {[['reply', 'back'], ['star', 'star'], ['del', 'trash'], ['fwd', 'share'], ['mmore', 'more']].map(([id, ic]) => <span key={id} {...H(s, id, 'rounded p-0.5')}><I n={ic} className={cx('size-4', id === 'reply' && 'rotate-0')} /></span>)}</div>
      ) : (
        <div className="flex items-center gap-2 px-2 h-11 shrink-0 bg-white border-b border-[#eee]">
          <I n="back" className="size-4 text-[#3b4a54]" /><span {...H(s, 'head', 'flex items-center gap-2 flex-1 min-w-0 rounded-md')}><Avatar t={s.title || 'Hija'} n={s.av ?? 0} size={28} /><span className="min-w-0"><b className="block text-[11.5px] text-[#111] truncate leading-tight">{s.title || 'Hija'}</b><span className="block text-[8.5px] text-[#667781] truncate">{s.sub || 'en línea'}</span></span></span>
          <span {...H(s, 'video', 'p-1 rounded text-[#3b4a54]')}><I n="video" className="size-4" /></span><span {...H(s, 'call', 'p-1 rounded text-[#3b4a54]')}><I n="phone" className="size-4" /></span><span {...H(s, 'menu', 'p-1 rounded text-[#3b4a54]')}><I n="more" className="size-4" /></span>
        </div>
      )}
      <div className="flex-1 min-h-0 flex flex-col gap-1.5 p-2.5 overflow-hidden" style={{ background: '#efeae2', backgroundImage: 'radial-gradient(#e2dbd0 1px, transparent 1px)', backgroundSize: '14px 14px' }}>
        <span className="self-center rounded-md bg-white/90 px-2 py-0.5 text-[8.5px] text-[#54656f] shadow-sm">HOY</span>
        {msgs.map((m: any, i: number) => (
          <div key={i} className={cx('flex flex-col max-w-[80%]', m.me ? 'self-end items-end' : 'self-start items-start')}>
            {s.react === i && <div {...H(s, 'emoji', 'mb-1 flex gap-1.5 rounded-full bg-white px-2 py-1 text-[12px] shadow')}>{'👍❤️😂😮😢🙏'.match(/./gu)!.map((e) => <span key={e}>{e}</span>)}</div>}
            <div {...H(s, 'm' + i, cx('relative rounded-lg px-2 py-1 text-[10.5px] text-[#111] shadow-[0_1px_0.5px_rgba(0,0,0,.13)]', m.me ? 'bg-[#d9fdd3]' : 'bg-white', s.selMsg === i && 'ring-2 ring-[#25d366]/40'))}>
              {m.reply && <div className="mb-1 rounded border-l-4 border-[#06cf9c] bg-black/5 px-1.5 py-0.5 text-[9px] text-[#555]">{m.reply}</div>}
              {m.audio ? <span className="flex items-center gap-1.5 py-0.5 pr-1"><Avatar t={m.me ? 'Yo' : s.title || 'H'} n={m.me ? 3 : 0} size={22} /><I n="play" className="size-3.5 text-[#54656f]" /><span className="flex items-center gap-[1.5px]">{[3, 6, 9, 5, 8, 11, 7, 4, 9, 6, 10, 5, 3, 7, 5].map((h, k) => <span key={k} className="w-[2px] rounded-full bg-[#8fa3ad]" style={{ height: h }} />)}</span><span className="text-[8px] text-[#667781]">{m.dur || '0:42'}</span></span>
                : m.doc ? <span className="flex items-center gap-2 rounded bg-black/5 px-2 py-1.5"><span className="grid place-items-center w-6 h-7 rounded-sm bg-[#e94b3c] text-white text-[6px] font-bold">PDF</span><span><b className="block text-[9.5px]">{m.t}</b><span className="text-[8px] text-[#667781]">1 página · 180 kB</span></span></span>
                : m.loc ? <span className="block w-36"><span className="relative block h-16 rounded bg-[#d6e7d0] overflow-hidden"><span className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(90deg,transparent 45%,#fff 45%,#fff 55%,transparent 55%),linear-gradient(transparent 40%,#fff 40%,#fff 50%,transparent 50%)' }} /><I n="pin" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-5 text-[#e94b3c]" /></span><b className="block text-[9.5px] mt-1">{m.t || 'Ubicación en tiempo real'}</b><span className="text-[8px] text-[#667781]">Compartiendo por 1 hora</span></span>
                : m.img ? <Pic n={m.img} className="w-32 h-24 rounded" />
                : m.poll ? <span className="block w-40"><b className="block text-[10px] mb-1">{m.t}</b>{m.poll.map((o: string, k: number) => <span key={k} className="flex items-center gap-1.5 py-0.5 text-[9.5px]"><span className="size-3 rounded-full border border-[#8696a0]" />{o}</span>)}</span>
                : m.t}
              {m.trans && <span className="block mt-1 rounded bg-black/5 px-1.5 py-1 text-[9px] italic text-[#3b4a54]">{m.trans}</span>}
              <span className="ml-2 float-right mt-1 text-[7.5px] text-[#667781] flex items-center gap-0.5">{m.edited && 'Editado '}10:2{i}{m.me && <span className="text-[#53bdeb]">✓✓</span>}</span>
              {m.r && <span className="absolute -bottom-2.5 left-2 rounded-full bg-white px-1 text-[9px] shadow">{m.r}</span>}
            </div>
          </div>
        ))}
      </div>
      {s.kb ? null : null}
      <div className="flex items-center gap-1.5 p-1.5 shrink-0" style={{ background: '#efeae2' }}>
        <div className="flex-1 flex items-center gap-2 rounded-full bg-white h-9 px-3 text-[10px] text-[#667781]">
          {s.rec ? <><span className="size-2 rounded-full bg-[#ef4444] animate-pulse" /><span className="text-[#111]">0:07</span><span className="flex-1 text-center">‹ Deslizá para cancelar</span></>
            : <><I n="smile" className="size-4" /><span className={cx('flex-1 truncate', s.typing && 'text-[#111]')}>{s.typing || 'Mensaje'}</span>{!s.typing && <span {...H(s, 'clip', 'rounded p-0.5')}><I n="clip" className="size-4 -rotate-45" /></span>}{!s.typing && <span {...H(s, 'cam', 'rounded p-0.5')}><I n="camera" className="size-4" /></span>}</>}
        </div>
        <span className="relative">
          {s.rec && <span {...H(s, 'lock', 'absolute -top-14 left-1/2 -translate-x-1/2 grid place-items-center w-8 h-12 rounded-full bg-white shadow text-[#54656f]')}><I n="lock" className="size-3.5" /></span>}
          <span {...H(s, 'mic', cx('grid place-items-center rounded-full text-white transition-transform', s.rec ? 'size-12 -my-1.5' : 'size-9'))} style={{ background: WG }}><I n={s.typing ? 'send' : 'mic'} className="size-4" /></span>
        </span>
      </div>
      {s.kb && <Keyboard s={s} />}
    </div>
  );
}
function WaCall(s: any) {
  return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-[#0b141a]">
      <Pic n={s.pic ?? 3} className="absolute inset-0" />
      <div className="relative text-center text-white pt-4 drop-shadow"><b className="block text-[13px]">{s.title || 'Familia Pérez'}</b><span className="text-[9px]">Cifrado de extremo a extremo · 03:12</span></div>
      <div className="absolute right-3 top-14 w-20 h-28 rounded-xl overflow-hidden border-2 border-white/70"><Pic n={0} className="w-full h-full" /></div>
      <div className="relative mt-auto m-3 flex justify-around rounded-[22px] bg-[#1f2c33]/95 py-2.5">
        {[['more', 'moreh'], ['cam', 'video'], ['mic', 'mic'], ['flip', 'refresh'], ['end', 'phone']].map(([id, ic]) => (
          <span key={id} {...H(s, id, cx('grid place-items-center size-10 rounded-full text-white', id === 'end' ? 'bg-[#ea0038]' : 'bg-white/10'))}><I n={ic} className={cx('size-4', id === 'end' && 'rotate-[135deg]')} /></span>
        ))}
      </div>
    </div>
  );
}
function WaList(s: any) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11 shrink-0"><I n="back" className="size-4 text-[#3b4a54]" /><b className="text-[13px] text-[#111]">{s.title}</b></div>
      {s.profile && <div className="flex items-center gap-3 px-3 py-2 border-b border-[#eee]"><Avatar t="Marta" n={3} size={42} /><span><b className="block text-[12px]">Marta</b><span className="text-[9px] text-[#667781]">Disponible</span></span></div>}
      {s.info && <div className="flex flex-col items-center py-3 border-b-8 border-[#f0f2f5]"><Avatar t={s.info} n={1} size={56} /><b className="mt-1.5 text-[13px]">{s.info}</b><span className="text-[9px] text-[#667781]">{s.infoSub || 'Grupo · 6 miembros'}</span>
        <div className="flex gap-2 mt-2">{[['phone', 'Llamar'], ['video', 'Video'], ['search', 'Buscar']].map(([ic, t]) => <span key={t} className="flex flex-col items-center gap-0.5 rounded-lg border border-[#e9edef] px-3 py-1.5 text-[8.5px]" style={{ color: WG }}><I n={ic} className="size-3.5" />{t}</span>)}</div></div>}
      <div className="flex-1 min-h-0 overflow-hidden">
        {s.items.map((r: any, i: number) => {
          const o = typeof r === 'string' ? { t: r } : r;
          return (
            <div key={i} {...H(s, 'r' + i, 'flex items-center gap-3.5 px-3.5 py-2.5')}>
              {o.i && <I n={o.i} className={cx('size-4', o.danger ? 'text-[#ea0038]' : 'text-[#54656f]')} />}
              <span className="flex-1 min-w-0"><span className={cx('block text-[11px]', o.danger ? 'text-[#ea0038]' : 'text-[#111]')}>{o.t}</span>{o.s && <span className="block text-[9px] text-[#667781]">{o.s}</span>}</span>
              {o.tg != null && <span className={cx('w-7 h-4 rounded-full relative', o.tg ? '' : 'bg-[#c7cdd1]')} style={o.tg ? { background: WG } : undefined}><span className={cx('absolute top-0.5 size-3 rounded-full bg-white', o.tg ? 'right-0.5' : 'left-0.5')} /></span>}
              {o.ok && <span className="grid place-items-center size-4 rounded-full text-white" style={{ background: WG }}><I n="check" className="size-2.5" /></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function WaStatus(s: any) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center px-3 h-10"><b className="flex-1 text-[15px] text-[#111]">Novedades</b><I n="search" className="size-4 text-[#3b4a54]" /></div>
      <b className="px-3 text-[11.5px]">Estados</b>
      <div className="flex gap-3 px-3 py-2">
        <span {...H(s, 'mine', 'flex flex-col items-center gap-1 rounded-lg')}><span className="relative"><Avatar t="Marta" n={3} size={44} /><span className="absolute -right-0.5 -bottom-0.5 grid place-items-center size-4 rounded-full text-white ring-2 ring-white" style={{ background: WG }}><I n="plus" className="size-2.5" /></span></span><span className="text-[8.5px]">Mi estado</span></span>
        {['Hija', 'Juan', 'Ana'].map((t, i) => <span key={t} {...H(s, 'st' + i, 'flex flex-col items-center gap-1 rounded-lg')}><Avatar t={t} n={i + 4} size={44} ring={WG} /><span className="text-[8.5px]">{t}</span></span>)}
      </div>
      <b className="px-3 mt-2 text-[11.5px]">Canales</b>
      {[['Recetas de la abuela', 'Nueva receta: tarta de acelga'], ['Noticias de mi ciudad', 'Hoy se corta el tránsito en…']].map(([t, m], i) => <div key={t} {...H(s, 'ch' + i, 'flex items-center gap-2.5 px-3 py-2')}><Pic n={i + 2} className="size-9 rounded-full" round /><span className="min-w-0"><b className="block text-[11px]">{t}</b><span className="block text-[9px] text-[#667781] truncate">{m}</span></span></div>)}
      <div className="flex-1" /><div className="relative"><span {...H(s, 'cam', 'absolute right-3 -top-12 grid place-items-center size-11 rounded-2xl text-white shadow-md')} style={{ background: WG }}><I n="camera" className="size-4" /></span></div>
      <BottomNav s={s} active={1} items={[['comment', 'Chats'], ['circle', 'Novedades'], ['users', 'Comunidades'], ['phone', 'Llamadas']]} />
    </div>
  );
}
export function WhatsApp(s: any) {
  if (s.v === 'chat') return WaChat(s);
  if (s.v === 'attach') return <Sheet s={s} grid={4} base={WaChat({ ...s, hl: undefined })} items={[{ t: 'Galería', i: 'images', c: '#3f8cff' }, { t: 'Cámara', i: 'camera', c: '#ff2e74' }, { t: 'Ubicación', i: 'pin', c: '#1fa855' }, { t: 'Contacto', i: 'user', c: '#009de2' }, { t: 'Documento', i: 'doc', c: '#7f66ff' }, { t: 'Audio', i: 'headphones', c: '#ff7a2f' }, { t: 'Encuesta', i: 'bars', c: '#ffbc38' }, { t: 'Evento', i: 'calendar', c: '#ff2e74' }]} />;
  if (s.v === 'call') return WaCall(s);
  if (s.v === 'list') return WaList(s);
  if (s.v === 'status') return WaStatus(s);
  if (s.v === 'menu') return <Sheet s={s} base={s.base ? WaChat({ ...s.base }) : WaChats({})} items={s.items} title={s.title} />;
  return WaChats(s);
}

/* ================= YOUTUBE ================= */
const YTR = '#ff0000';
export const YT_VIDS = [
  { t: 'Gimnasia suave en silla: 20 minutos para todos los días', c: 'Kine en casa', m: '1,2 M de vistas · hace 2 meses', d: '20:14', p: 3 },
  { t: 'Tarta de acelga fácil, como la de la abuela', c: 'Cocina de casa', m: '845 k vistas · hace 1 año', d: '12:03', p: 2 },
  { t: 'Recorrido por la Quebrada de Humahuaca', c: 'Viajar por Argentina', m: '320 k vistas · hace 3 semanas', d: '18:47', p: 0 }
];
function YtTop(s: any) {
  return (
    <div className="flex items-center gap-3 px-3 h-10 shrink-0 bg-white">
      <b className="flex-1 text-[13px] tracking-tight text-[#0f0f0f]">YouTube</b>
      <span {...H(s, 'cast', 'rounded p-0.5')}><I n="cast" className="size-4" /></span><span {...H(s, 'bell', 'rounded p-0.5')}><I n="bell" className="size-4" /></span><span {...H(s, 'search', 'rounded p-0.5')}><I n="search" className="size-4" /></span>
    </div>
  );
}
function YtCard(v: any, s: any, i: number) {
  return (
    <div key={i} {...H(s, 'v' + i, 'pb-2')}>
      <div className="relative"><Pic n={v.p} className="w-full aspect-video" /><span className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1 text-[8px] font-semibold text-white">{v.d}</span></div>
      <div className="flex gap-2 px-2.5 pt-1.5"><Avatar t={v.c} n={i + 2} size={24} /><div className="min-w-0 flex-1"><b className="block text-[10px] leading-snug text-[#0f0f0f] line-clamp-2">{v.t}</b><span className="block text-[8.5px] text-[#606060]">{v.c} · {v.m}</span></div><I n="more" className="size-3.5 text-[#0f0f0f]" /></div>
    </div>
  );
}
const YT_NAV: [string, string][] = [['home', 'Inicio'], ['film', 'Shorts'], ['+', ''], ['tv', 'Suscripciones'], ['user', 'Tú']];
function YtHome(s: any) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {YtTop(s)}
      <div className="flex gap-1.5 px-2.5 pb-2 shrink-0 overflow-hidden">{['Todos', 'Música', 'Cocina', 'Gimnasia', 'Viajes', 'Noticias'].map((c, i) => <span key={c} {...H(s, 'chip' + i, cx('px-2.5 h-6 grid place-items-center rounded-md text-[9px] font-medium whitespace-nowrap', (s.chip ?? 0) === i ? 'bg-[#0f0f0f] text-white' : 'bg-[#f2f2f2] text-[#0f0f0f]'))}>{c}</span>)}</div>
      <div className="flex-1 min-h-0 overflow-hidden">{(s.vids || YT_VIDS).map((v: any, i: number) => YtCard(v, s, i))}</div>
      <BottomNav s={s} active={s.tab ?? 0} items={YT_NAV} />
    </div>
  );
}
function YtSearch(s: any) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-2 px-2 h-10 shrink-0"><I n="back" className="size-4" /><SearchPill s={s} id="q" t={s.q} ph="Buscar en YouTube" className="flex-1 !bg-[#f2f2f2]" /><span {...H(s, 'mic', 'grid place-items-center size-7 rounded-full bg-[#f2f2f2]')}><I n="mic" className="size-3.5" /></span></div>
      {s.results ? <div className="flex-1 min-h-0 overflow-hidden pt-1">{(s.vids || YT_VIDS).map((v: any, i: number) => YtCard(v, s, i))}</div>
        : <div className="flex-1 min-h-0">{(s.sugg || []).map((t: string, i: number) => <div key={i} {...H(s, 's' + i, 'flex items-center gap-3 px-3 py-2 text-[10.5px]')}><I n="search" className="size-3.5 text-[#606060]" />{t}</div>)}</div>}
      {s.kb && <Keyboard s={s} />}
    </div>
  );
}
function YtWatch(s: any) {
  const v = s.vid || YT_VIDS[0];
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div {...H(s, 'player', 'relative bg-black shrink-0')}>
        <Pic n={v.p} className="w-full aspect-video opacity-95" />
        {s.controls && <div className="absolute inset-0 bg-black/40 flex items-center justify-around text-white"><I n="back" className="size-4 rotate-180 opacity-0" /><span className="grid place-items-center size-10 rounded-full bg-black/40"><I n="pause" className="size-5" /></span><span /></div>}
        {s.controls && <span {...H(s, 'gear', 'absolute right-2 top-2 rounded-full p-1 text-white')}><I n="settings" className="size-4" /></span>}
        {s.controls && <span {...H(s, 'cc', 'absolute right-9 top-2 rounded p-1 text-white')}><I n="subs" className="size-4" /></span>}
        {s.controls && <span {...H(s, 'full', 'absolute right-2 bottom-3 rounded p-0.5 text-white')}><I n="max" className="size-3.5" /></span>}
        {s.captions && <span className="absolute inset-x-6 bottom-4 text-center"><span className="bg-black/75 px-1.5 text-[9px] text-white">Ahora levantamos los brazos despacio</span></span>}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/30"><div className="h-full w-1/3" style={{ background: YTR }} /></div>
      </div>
      <div className="px-2.5 pt-2"><b className="block text-[11.5px] leading-snug text-[#0f0f0f]">{v.t}</b><span className="text-[8.5px] text-[#606060]">{v.m} ...más</span></div>
      <div className="flex items-center gap-2 px-2.5 py-2"><Avatar t={v.c} n={2} size={26} /><span className="flex-1 min-w-0"><b className="block text-[10px]">{v.c}</b><span className="text-[8px] text-[#606060]">320 k suscriptores</span></span>
        <span {...H(s, 'sub', cx('rounded-full px-3 h-7 grid place-items-center text-[9.5px] font-semibold', s.subscribed ? 'bg-[#f2f2f2] text-[#0f0f0f]' : 'bg-[#0f0f0f] text-white'))}>{s.subscribed ? '🔔 Suscripto' : 'Suscribirme'}</span></div>
      <div className="flex gap-1.5 px-2.5 overflow-hidden">
        <span {...H(s, 'like', 'flex items-center gap-1 rounded-full bg-[#f2f2f2] px-2.5 h-7 text-[9px] whitespace-nowrap')}><I n="like" className="size-3.5" />28 k<span className="mx-0.5 h-3 w-px bg-[#ccc]" /><I n="dislike" className="size-3.5" /></span>
        {[['share', 'share', 'Compartir'], ['dl', 'download', 'Descargar'], ['save', 'save', 'Guardar']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex items-center gap-1 rounded-full bg-[#f2f2f2] px-2.5 h-7 text-[9px] whitespace-nowrap')}><I n={ic} className="size-3.5" />{t}</span>)}
      </div>
      <div className="m-2.5 rounded-xl bg-[#f2f2f2] p-2"><b className="text-[9.5px]">Comentarios 1,3 k</b><div className="flex gap-1.5 mt-1 items-center"><Avatar t="R" n={6} size={18} /><span className="text-[9px] text-[#0f0f0f]">¡Excelente! Lo hago todas las mañanas 🙌</span></div></div>
      <div className="flex-1" />
    </div>
  );
}
export function YouTube(s: any) {
  if (s.v === 'search') return YtSearch(s);
  if (s.v === 'watch') return YtWatch(s);
  if (s.v === 'gear') return <Sheet s={s} base={YtWatch({ ...s, hl: undefined, controls: true })} items={[{ t: 'Calidad', i: 'sliders', sub: 'Automática (720p)' }, { t: 'Subtítulos', i: 'subs', sub: 'Desactivados' }, { t: 'Velocidad de reproducción', i: 'speed', sub: 'Normal' }, { t: 'Bloquear pantalla', i: 'lock' }, { t: 'Más configuraciones', i: 'settings' }]} />;
  if (s.v === 'speed') return <Sheet s={s} title="Velocidad de reproducción" base={YtWatch({ ...s, hl: undefined, controls: true })} items={['0,5x', '0,75x', 'Normal', '1,25x', '1,5x'].map((t) => ({ t }))} />;
  if (s.v === 'cc') return <Sheet s={s} title="Subtítulos" base={YtWatch({ ...s, hl: undefined, controls: true })} items={[{ t: 'Desactivados' }, { t: 'Español (generados automáticamente)' }, { t: 'Traducción automática' }]} />;
  if (s.v === 'saveTo') return <Sheet s={s} title="Guardar video en…" base={YtWatch({ ...s, hl: undefined })} items={[{ t: 'Ver más tarde', i: 'clock' }, { t: 'Gimnasia', i: 'list' }, { t: 'Recetas', i: 'list' }, { t: '+ Nueva playlist', i: 'plus' }]} />;
  if (s.v === 'cast') return <Sheet s={s} title="Transmitir a" base={YtWatch({ ...s, hl: undefined })} items={[{ t: 'Televisor del living', i: 'tv' }, { t: 'Vincular con código de TV', i: 'link' }]} />;
  if (s.v === 'subs') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">{YtTop(s)}
      <div className="flex gap-3 px-3 py-2 shrink-0">{['Kine en casa', 'Cocina de casa', 'Viajar por AR', 'Historia'].map((c, i) => <span key={c} {...H(s, 'ch' + i, 'flex flex-col items-center gap-1 w-12 rounded-lg')}><Avatar t={c} n={i + 2} size={36} /><span className="text-[7.5px] text-center leading-tight">{c}</span></span>)}</div>
      <div className="flex-1 min-h-0 overflow-hidden">{YT_VIDS.slice(0, 2).map((v, i) => YtCard(v, s, i))}</div>
      <BottomNav s={s} active={3} items={YT_NAV} />
    </div>);
  return YtHome(s);
}

/* ================= FACEBOOK ================= */
const FB = '#0866ff';
function FbTop(s: any) {
  return (
    <div className="bg-white shrink-0">
      <div className="flex items-center gap-2 px-3 h-10"><b className="flex-1 text-[15px] tracking-tight" style={{ color: FB }}>Facebook</b>
        {[['new', 'plus'], ['search', 'search'], ['msg', 'comment']].map(([id, ic]) => <span key={id} {...H(s, id, 'grid place-items-center size-7 rounded-full bg-[#e4e6eb]')}><I n={ic} className="size-3.5" /></span>)}</div>
      <div className="flex border-b border-[#ddd]">{[['home', 'home'], ['video', 'tv'], ['friends', 'users'], ['market', 'store'], ['notif', 'bell'], ['menu', 'menu']].map(([id, ic], i) => <span key={id} {...H(s, id, cx('flex-1 grid place-items-center h-8 border-b-2', (s.tab ?? 0) === i ? 'border-[#0866ff] text-[#0866ff]' : 'border-transparent text-[#65676b]'))}><I n={ic} className="size-4" /></span>)}</div>
    </div>
  );
}
function FbPost(p: any, s: any, i: number) {
  return (
    <div key={i} className="bg-white mt-1.5 pb-1.5">
      <div className="flex items-center gap-2 px-3 py-2"><Avatar t={p.a} n={i + 1} size={28} /><span className="flex-1"><b className="block text-[10.5px]">{p.a}</b><span className="text-[8.5px] text-[#65676b]">{p.h} · <I n={p.pub ? 'globe' : 'users'} className="inline size-2.5" /></span></span><I n="moreh" className="size-4 text-[#65676b]" /></div>
      <p className="px-3 pb-1.5 text-[10px]">{p.t}</p>
      {p.p != null && <Pic n={p.p} className="w-full h-28" />}
      <div className="flex justify-between px-3 py-1 text-[8.5px] text-[#65676b]"><span>👍❤️ {p.l}</span><span>{p.c} comentarios</span></div>
      <div className="flex border-t border-[#e4e6eb] mx-3 pt-1">{[['like', 'like', 'Me gusta'], ['comment', 'comment', 'Comentar'], ['share', 'share', 'Compartir']].map(([id, ic, t]) => <span key={id} {...H(s, id + i, 'flex-1 flex items-center justify-center gap-1 py-1 text-[9px] text-[#65676b] rounded')}><I n={ic} className="size-3.5" />{t}</span>)}</div>
    </div>
  );
}
export function Facebook(s: any) {
  if (s.v === 'compose') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11 border-b border-[#ddd]"><I n="back" className="size-4" /><b className="flex-1 text-[12px]">Crear publicación</b><span {...H(s, 'post', 'rounded-md px-3 h-7 grid place-items-center text-[10px] font-semibold text-white')} style={{ background: FB }}>Publicar</span></div>
      <div className="flex items-center gap-2 px-3 py-2"><Avatar t="Marta" n={3} size={32} /><span><b className="block text-[11px]">Marta Gómez</b><span {...H(s, 'aud', 'inline-flex items-center gap-1 rounded-md bg-[#e7f0ff] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#0866ff]')}><I n={s.aud === 'Público' ? 'globe' : 'users'} className="size-2.5" />{s.aud || 'Amigos'} ▾</span></span></div>
      <p className="px-3 text-[13px] text-[#1c1e21]">{s.text || <span className="text-[#65676b]">¿Qué estás pensando?</span>}</p>
      {s.photo != null && <Pic n={s.photo} className="mx-3 mt-2 h-28 rounded-lg" />}
      <div className="flex-1" />
      <div className="border-t border-[#ddd]">{[['photo', 'images', 'Foto/video', '#45bd62'], ['tag', 'user', 'Etiquetar personas', '#1877f2'], ['feel', 'smile', 'Sentimiento/actividad', '#f7b928'], ['loc', 'pin', 'Registrar visita', '#f5533d']].map(([id, ic, t, c]) => <div key={id} {...H(s, id, 'flex items-center gap-3 px-3 py-2 text-[10.5px]')}><I n={ic} className="size-4" style={{ color: c }} />{t}</div>)}</div>
    </div>);
  if (s.v === 'audience') return <Sheet s={s} title="¿Quién puede ver tu publicación?" base={Facebook({ v: 'compose' })} items={[{ t: 'Público', i: 'globe', sub: 'Cualquier persona dentro o fuera de Facebook' }, { t: 'Amigos', i: 'users', sub: 'Tus amigos de Facebook' }, { t: 'Solo yo', i: 'lock' }]} />;
  if (s.v === 'menu' || s.v === 'list') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f0f2f5]">
      {s.v === 'menu' ? FbTop({ ...s, tab: 5 }) : <div className="flex items-center gap-3 px-3 h-11 bg-white"><I n="back" className="size-4" /><b className="text-[12px]">{s.title}</b></div>}
      {s.v === 'menu' && <div className="m-2 flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm"><Avatar t="Marta" n={3} size={30} /><b className="text-[11px]">Marta Gómez</b></div>}
      {s.v === 'menu' && <div className="grid grid-cols-2 gap-1.5 mx-2">{[['Grupos', 'users', '#1877f2'], ['Marketplace', 'store', '#1877f2'], ['Recuerdos', 'clock', '#1877f2'], ['Guardado', 'save', '#a033ff']].map(([t, ic, c], i) => <span key={t} {...H(s, 'g' + i, 'flex flex-col gap-1 rounded-lg bg-white p-2 text-[9.5px] font-medium shadow-sm')}><I n={ic} className="size-4" style={{ color: c }} />{t}</span>)}</div>}
      <div className="mt-2 bg-white">{s.items.map((r: any, i: number) => { const o = typeof r === 'string' ? { t: r } : r; return <div key={i} {...H(s, 'r' + i, 'flex items-center gap-3 px-3 py-2.5 border-b border-[#f0f2f5]')}>{o.i && <I n={o.i} className="size-4 text-[#65676b]" />}<span className="flex-1"><span className="block text-[10.5px]">{o.t}</span>{o.s && <span className="block text-[8.5px] text-[#65676b]">{o.s}</span>}</span>{o.val && <span className="text-[9px] text-[#65676b]">{o.val}</span>}<I n="chev" className="size-3 text-[#bcc0c4]" /></div>; })}</div>
    </div>);
  if (s.v === 'groups') return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f0f2f5]">
      <div className="flex items-center gap-3 px-3 h-11 bg-white"><I n="back" className="size-4" /><b className="flex-1 text-[12px]">Grupos</b><I n="search" className="size-4" /></div>
      <div className="flex gap-1.5 px-3 py-2 bg-white">{['Para ti', 'Tus grupos', 'Descubrir'].map((c, i) => <span key={c} {...H(s, 'chip' + i, cx('px-2.5 h-6 grid place-items-center rounded-full text-[9px] font-semibold', (s.chip ?? 0) === i ? 'bg-[#e7f0ff] text-[#0866ff]' : 'bg-[#e4e6eb]'))}>{c}</span>)}</div>
      {[['Jardinería en casa', '128 mil miembros', 4], ['Recetas fáciles y caseras', '420 mil miembros', 2], ['Amigos del ajedrez', '35 mil miembros', 6]].map(([t, m, p], i) => <div key={i} {...H(s, 'gr' + i, 'flex items-center gap-2.5 bg-white mt-1.5 p-2.5')}><Pic n={p as number} className="size-10 rounded-lg" /><span className="flex-1"><b className="block text-[10.5px]">{t}</b><span className="text-[8.5px] text-[#65676b]">{m}</span></span><span {...H(s, 'join' + i, 'rounded-md bg-[#e7f0ff] px-2 h-6 grid place-items-center text-[9px] font-semibold text-[#0866ff]')}>Unirte</span></div>)}
    </div>);
  if (s.v === 'market') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="flex-1 text-[12px]">Marketplace</b><I n="search" className="size-4" /></div>
      <div className="flex gap-1.5 px-3 pb-2">{['Vender', 'Para ti', 'Categorías'].map((c, i) => <span key={c} {...H(s, 'chip' + i, 'px-2.5 h-6 grid place-items-center rounded-full bg-[#e4e6eb] text-[9px] font-semibold')}>{c}</span>)}</div>
      <div className="grid grid-cols-2 gap-0.5">{[['$ 45.000 · Bicicleta rodado 26', 6], ['$ 12.000 · Sillas de jardín', 4], ['$ 30.000 · Mesa de luz', 7], ['$ 8.000 · Macetas', 4]].map(([t, p], i) => <div key={i} {...H(s, 'it' + i)}><Pic n={p as number} className="w-full aspect-square" /><b className="block px-1 py-1 text-[9px]">{t}</b></div>)}</div>
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#c9ccd1]">
      {FbTop(s)}
      <div className="flex items-center gap-2 bg-white px-3 py-2"><Avatar t="Marta" n={3} size={28} /><span {...H(s, 'think', 'flex-1 rounded-full border border-[#ccd0d5] px-3 h-7 grid items-center text-[10px] text-[#65676b]')}>¿Qué estás pensando?</span><I n="images" className="size-4 text-[#45bd62]" /></div>
      <div className="flex-1 min-h-0 overflow-hidden">{(s.posts || [{ a: 'Hija', h: '2 h', t: '¡Llegamos a Mendoza! Qué lindo día ☀️', p: 0, l: 34, c: 8 }, { a: 'Club de bochas', h: '5 h', t: 'Este sábado, torneo de primavera. ¡Los esperamos!', p: 4, l: 21, c: 3, pub: true }]).map((p: any, i: number) => FbPost(p, s, i))}</div>
    </div>
  );
}

/* ================= INSTAGRAM ================= */
const IGG = 'linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)';
function IgStoryRing({ t, n, mine, s, id }: any) {
  return <span {...H(s, id, 'flex flex-col items-center gap-0.5 w-12 rounded-lg')}><span className="rounded-full p-[2px]" style={{ background: mine ? 'transparent' : IGG }}><span className="block rounded-full p-[1.5px] bg-white"><span className="relative block"><Avatar t={t} n={n} size={36} />{mine && <span className="absolute -right-0.5 -bottom-0.5 grid place-items-center size-3.5 rounded-full bg-[#0095f6] text-white ring-2 ring-white"><I n="plus" className="size-2" /></span>}</span></span></span><span className="text-[7.5px] truncate w-full text-center">{t}</span></span>;
}
const IG_NAV: [string, string][] = [['home', ''], ['search', ''], ['+', ''], ['film', ''], ['user', '']];
export function Instagram(s: any) {
  if (s.v === 'profile') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-2 px-3 h-10"><b className="flex-1 text-[13px]">marta.gomez 🔒</b><span {...H(s, 'new', 'rounded p-0.5')}><I n="plus" className="size-4" /></span><span {...H(s, 'menu', 'rounded p-0.5')}><I n="menu" className="size-4" /></span></div>
      <div className="flex items-center gap-4 px-3"><Avatar t="Marta" n={3} size={56} /><div className="flex-1 grid grid-cols-3 text-center">{[['24', 'publicaciones'], ['180', 'seguidores'], ['210', 'seguidos']].map(([a, b]) => <span key={b}><b className="block text-[11.5px]">{a}</b><span className="text-[8px]">{b}</span></span>)}</div></div>
      <b className="px-3 mt-1.5 text-[10px]">Marta Gómez</b><span className="px-3 text-[9px]">Abuela, jardinera y viajera 🌿</span>
      <div className="flex gap-1.5 px-3 my-2"><span {...H(s, 'edit', 'flex-1 rounded-lg bg-[#efefef] h-7 grid place-items-center text-[9.5px] font-semibold')}>Editar perfil</span><span {...H(s, 'shareP', 'flex-1 rounded-lg bg-[#efefef] h-7 grid place-items-center text-[9.5px] font-semibold')}>Compartir perfil</span></div>
      <div className="grid grid-cols-3 gap-0.5 flex-1 min-h-0 overflow-hidden content-start">{[0, 4, 2, 6, 3, 7].map((p, i) => <Pic key={i} n={p} className="aspect-square" />)}</div>
      <BottomNav s={s} active={4} items={IG_NAV} />
    </div>);
  if (s.v === 'new') return (
    <div className="flex-1 flex flex-col min-h-0 bg-black text-white">
      <div className="flex items-center gap-3 px-3 h-10"><I n="x" className="size-4" /><b className="flex-1 text-[12px]">Nueva publicación</b><span {...H(s, 'next', 'rounded px-1 text-[11px] font-semibold text-[#4ca3ff]')}>Siguiente</span></div>
      <Pic n={s.photo ?? 4} className="w-full aspect-square" />
      <div className="flex items-center justify-between px-3 py-2"><b className="text-[11px]">Recientes ▾</b><span {...H(s, 'multi', 'rounded-full bg-white/20 px-2 h-6 grid place-items-center text-[8.5px]')}>Seleccionar varias</span></div>
      <div className="grid grid-cols-4 gap-0.5">{[4, 0, 2, 3, 6, 7, 1, 5].map((p, i) => <div key={i} {...H(s, 'g' + i, 'relative')}><Pic n={p} className="aspect-square" />{s.sel?.includes(i) && <span className="absolute right-1 top-1 grid place-items-center size-3.5 rounded-full bg-[#0095f6] text-[7px]">{s.sel.indexOf(i) + 1}</span>}</div>)}</div>
    </div>);
  if (s.v === 'caption') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-10 border-b border-[#efefef]"><I n="back" className="size-4" /><b className="flex-1 text-[12px]">Nueva publicación</b></div>
      <div className="flex gap-2 p-3"><Pic n={4} className="size-16 rounded" /><span className="text-[10px] text-[#262626]">{s.text || 'Agregá un pie de foto…'}</span></div>
      {['Etiquetar personas', 'Agregar ubicación', 'Agregar música', 'Público: Seguidores'].map((t, i) => <div key={t} {...H(s, 'r' + i, 'flex items-center justify-between px-3 py-2.5 border-t border-[#efefef] text-[10.5px]')}>{t}<I n="chev" className="size-3 text-[#8e8e8e]" /></div>)}
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'share', 'block rounded-lg h-9 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: '#0095f6' }}>Compartir</span></div>
    </div>);
  if (s.v === 'story') return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-black text-white">
      <Pic n={s.photo ?? 0} className="absolute inset-0" />
      <div className="relative flex gap-0.5 px-2 pt-2">{[1, 0.4, 0].map((p, i) => <span key={i} className="flex-1 h-[2px] rounded bg-white/40"><span className="block h-full bg-white" style={{ width: p * 100 + '%' }} /></span>)}</div>
      <div className="relative flex items-center gap-2 px-2 py-2"><Avatar t={s.who || 'sofi.perez'} n={4} size={22} /><b className="text-[9.5px] drop-shadow">{s.who || 'sofi.perez'}</b><span className="text-[8.5px] opacity-80">3 h</span></div>
      <div className="relative mt-auto flex items-center gap-2 p-2"><span {...H(s, 'reply', 'flex-1 rounded-full border border-white/70 h-8 px-3 grid items-center text-[9.5px]')}>Enviar mensaje</span><span {...H(s, 'heart', 'rounded-full p-1')}><I n="heart" className="size-5" /></span><I n="send" className="size-5" /></div>
    </div>);
  if (s.v === 'privacy') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="text-[12px]">Privacidad de la cuenta</b></div>
      <div {...H(s, 'priv', 'flex items-center justify-between px-3 py-3')}><span className="text-[11px]">Cuenta privada</span><span className={cx('w-8 h-4.5 h-[18px] rounded-full relative', s.on ? 'bg-[#0095f6]' : 'bg-[#c7c7c7]')}><span className={cx('absolute top-0.5 size-3.5 rounded-full bg-white', s.on ? 'right-0.5' : 'left-0.5')} /></span></div>
      <p className="px-3 text-[9px] text-[#737373]">Si tu cuenta es privada, solo las personas que apruebes podrán ver tus fotos y videos.</p>
    </div>);
  if (s.v === 'menu') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="text-[12px]">Configuración y actividad</b></div>
      <div className="px-3"><SearchPill s={s} ph="Buscar" /></div>
      {s.items.map((t: any, i: number) => { const o = typeof t === 'string' ? { t } : t; return <div key={i} {...H(s, 'r' + i, 'flex items-center gap-3 px-3 py-2.5 text-[10.5px]')}>{o.i && <I n={o.i} className="size-4" />}<span className="flex-1">{o.t}</span>{o.val && <span className="text-[9px] text-[#737373]">{o.val}</span>}<I n="chev" className="size-3 text-[#8e8e8e]" /></div>; })}
    </div>);
  if (s.v === 'dm') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="flex-1 text-[12px]">marta.gomez</b><I n="pencil" className="size-4" /></div>
      <div className="px-3"><SearchPill s={s} ph="Buscar" /></div><b className="px-3 mt-2 text-[10.5px]">Mensajes</b>
      {[['sofi.perez', '¡Hola abu! 💛', 4], ['juan.p', 'Te mandé las fotos', 5]].map(([t, m, n], i) => <div key={i} {...H(s, 'c' + i, 'flex items-center gap-2.5 px-3 py-2')}><Avatar t={t as string} n={n as number} size={34} /><span><b className="block text-[10.5px]">{t}</b><span className="text-[9px] text-[#737373]">{m}</span></span></div>)}
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-10 shrink-0"><span {...H(s, 'new', 'rounded p-0.5')}><I n="plus" className="size-4" /></span><b className="flex-1 text-center text-[14px] tracking-tight">Instagram</b><span {...H(s, 'heart', 'rounded p-0.5')}><I n="heart" className="size-4" /></span><span {...H(s, 'dm', 'rounded p-0.5')}><I n="send" className="size-4" /></span></div>
      <div className="flex gap-1.5 px-2 pb-2 shrink-0"><IgStoryRing t="Tu historia" n={3} mine s={s} id="st-me" />{['sofi.perez', 'juan.p', 'cocina.ar', 'viajes'].map((t, i) => <IgStoryRing key={t} t={t} n={i + 4} s={s} id={'st' + i} />)}</div>
      <div className="flex-1 min-h-0 overflow-hidden border-t border-[#efefef]">
        <div className="flex items-center gap-2 px-3 py-1.5"><Avatar t="sofi.perez" n={4} size={24} /><b className="flex-1 text-[10px]">sofi.perez</b><I n="moreh" className="size-4" /></div>
        <Pic n={s.photo ?? 1} className="w-full aspect-square" />
        <div className="flex items-center gap-3 px-3 py-1.5"><span {...H(s, 'like', 'rounded p-0.5')}><I n="heart" className={cx('size-[17px]', s.liked && 'fill-[#ff3040] text-[#ff3040]')} /></span><span {...H(s, 'comment', 'rounded p-0.5')}><I n="comment" className="size-[17px]" /></span><span {...H(s, 'send', 'rounded p-0.5')}><I n="send" className="size-[17px]" /></span><span className="flex-1" /><span {...H(s, 'save', 'rounded p-0.5')}><I n="save" className="size-[17px]" /></span></div>
        <p className="px-3 text-[9.5px]"><b>sofi.perez</b> Atardecer en la costa 🌅</p>
      </div>
      <BottomNav s={s} active={s.tab ?? 0} items={IG_NAV} />
    </div>
  );
}

/* ================= TIKTOK ================= */
export function TikTok(s: any) {
  if (s.v === 'menu') return <Sheet s={s} dark base={TikTok({})} items={[{ t: 'No me interesa', i: 'ban' }, { t: 'Guardar video', i: 'save' }, { t: 'Velocidad', i: 'speed' }, { t: 'Subtítulos', i: 'subs' }, { t: 'Denunciar', i: 'flag' }]} />;
  if (s.v === 'list') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="text-[12px]">{s.title}</b></div>
      {s.items.map((t: any, i: number) => { const o = typeof t === 'string' ? { t } : t; return <div key={i} {...H(s, 'r' + i, 'flex items-center gap-3 px-3 py-2.5 text-[10.5px]')}>{o.i && <I n={o.i} className="size-4" />}<span className="flex-1"><span className="block">{o.t}</span>{o.s && <span className="block text-[8.5px] text-[#8a8b91]">{o.s}</span>}</span>{o.val && <span className="text-[9px] text-[#8a8b91]">{o.val}</span>}{o.tg != null ? <span className={cx('w-7 h-4 rounded-full relative', o.tg ? 'bg-[#20d5ec]' : 'bg-[#d0d1d3]')}><span className={cx('absolute top-0.5 size-3 rounded-full bg-white', o.tg ? 'right-0.5' : 'left-0.5')} /></span> : <I n="chev" className="size-3 text-[#8a8b91]" />}</div>; })}
    </div>);
  return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-black text-white">
      <Pic n={s.photo ?? 2} className="absolute inset-0 opacity-90" />
      <div className="relative flex justify-center gap-4 pt-2 text-[10.5px] font-semibold drop-shadow"><span {...H(s, 'following', 'opacity-70 rounded px-1')}>Siguiendo</span><span className="border-b-2 border-white pb-0.5">Para ti</span><span {...H(s, 'search', 'absolute right-3 rounded p-0.5')}><I n="search" className="size-4" /></span></div>
      <div className="relative ml-auto mt-auto mr-2 mb-2 flex flex-col items-center gap-3 drop-shadow">
        <span className="relative"><Avatar t="Cocina" n={2} size={30} /><span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 grid place-items-center size-3.5 rounded-full bg-[#fe2c55]"><I n="plus" className="size-2" /></span></span>
        {[['like', 'heart', '12 k'], ['comment', 'comment', '310'], ['save', 'save', '2 k'], ['share', 'share', '540']].map(([id, ic, n]) => <span key={id} {...H(s, id, 'flex flex-col items-center text-[8px] rounded-lg')}><I n={ic} className={cx('size-5', id === 'like' && s.liked && 'fill-[#fe2c55] text-[#fe2c55]')} />{n}</span>)}
      </div>
      <div className="relative px-3 pb-2 text-[9.5px] drop-shadow"><b>@cocinadecasa</b><p>Empanadas al horno en 3 pasos 🥟 #recetas</p></div>
      <BottomNav s={s} dark active={0} items={[['home', 'Inicio'], ['users', 'Amigos'], ['+', ''], ['inbox', 'Bandeja'], ['user', 'Perfil']]} />
    </div>
  );
}
