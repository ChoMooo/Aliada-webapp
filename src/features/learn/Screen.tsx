/* Pantallas de celular dibujadas por código, para mini videos y miniaturas de pasos.
   No copian logos ni diseños de marcas: son pantallas genéricas que muestran dónde tocar. */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MessageCircle, Settings, MapPin, Image, Palette, Clapperboard, HardDrive, Languages, Users, Play, Camera, Wallet, ShoppingBag, Sparkles, Store,
  Phone, Mail, Globe, Search, ChevronRight, ArrowLeft, EllipsisVertical, Paperclip, Plus, Mic, Video, Share2, Bookmark, Bus, Car, Footprints,
  Navigation, Cloud, Trash2, Type, Music, Download, Upload, QrCode, Bell, Lock, Shield, UserRound, Heart, ThumbsUp, Sun, Eye, Volume2,
  Scissors, Wand2, Layers, Crop, Folder, FileText, Check, Star, Send, Menu, Home, Subtitles, Gauge, Newspaper, UserX, BellOff, Images, Film, Printer, Pin, Archive, Smartphone, X, Clock, CreditCard, Banknote, Flag, Copy, Receipt, Truck, Wifi, Link2, Hash, Sliders
} from 'lucide-react';
import { cx } from '../../ui';

/* ---------- Tipos de pantalla ---------- */
export type Row = string | { t: string; s?: string; i?: string; on?: boolean; toggle?: boolean; danger?: boolean };
export type Block =
  | { b: 'search'; t: string; id?: string }
  | { b: 'btn'; t: string; id?: string; tone?: 'main' | 'ghost' | 'danger' }
  | { b: 'card'; t: string; s?: string; i?: string; id?: string }
  | { b: 'text'; t: string; muted?: boolean; big?: boolean }
  | { b: 'input'; t: string; ph?: boolean; id?: string }
  | { b: 'tiles'; items: { t: string; i: string }[]; hl?: number }
  | { b: 'big'; t: string; s?: string }
  | { b: 'img'; t?: string; tone?: number; id?: string }
  | { b: 'chips'; items: string[]; hl?: number; on?: number }
  | { b: 'toggle'; t: string; on?: boolean; id?: string }
  | { b: 'tabs'; items: string[]; hl?: number; on?: number }
  | { b: 'rows'; items: Row[]; hl?: number };
export type Screen =
  | { k: 'home'; apps: string[]; hl?: number }
  | { k: 'list'; title: string; items: Row[]; hl?: number; search?: boolean; back?: boolean }
  | { k: 'chat'; title: string; sub?: string; msgs: { me?: boolean; t: string; audio?: boolean; doc?: boolean; loc?: boolean; img?: boolean }[]; hl?: string; typing?: string; rec?: boolean }
  | { k: 'chats'; items: { t: string; s: string; pin?: boolean }[]; hl?: number; sel?: number; bar?: boolean }
  | { k: 'sheet'; base: Screen; title?: string; items: { t: string; i?: string }[]; hl?: number; grid?: boolean }
  | { k: 'app'; title: string; tone?: string; back?: boolean; blocks: Block[]; hl?: string; nav?: string[]; navHl?: number }
  | { k: 'map'; q?: string; route?: boolean; place?: string; hl?: string; mode?: 'auto' | 'bus' | 'pie'; share?: boolean }
  | { k: 'photos'; title?: string; hl?: number; sel?: number[]; banner?: string; bannerHl?: boolean }
  | { k: 'call'; name: string; hl?: string }
  | { k: 'editor'; title: string; canvas: { t: string; s?: string; tone?: number }; tools: { t: string; i: string }[]; hl?: string | number; timeline?: boolean };
export type Frame = { s: Screen; cap: string; act?: 'tap' | 'hold' | 'up' | 'left' | 'type' };

/* ---------- Íconos genéricos ---------- */
const IC: Record<string, any> = {
  whatsapp: MessageCircle, mensajes: MessageCircle, ajustes: Settings, maps: MapPin, mapas: MapPin, fotos: Image, galeria: Images, canva: Palette, capcut: Clapperboard,
  drive: HardDrive, traductor: Languages, facebook: Users, youtube: Play, instagram: Camera, billetera: Wallet, compras: ShoppingBag, ia: Sparkles, tienda: Store,
  telefono: Phone, correo: Mail, web: Globe, buscar: Search, camara: Camera, video: Video, phone: Phone, clip: Paperclip, plus: Plus, mic: Mic, share: Share2,
  guardar: Bookmark, bus: Bus, auto: Car, pie: Footprints, ir: Navigation, nube: Cloud, borrar: Trash2, texto: Type, musica: Music, descargar: Download,
  subir: Upload, qr: QrCode, campana: Bell, candado: Lock, escudo: Shield, persona: UserRound, corazon: Heart, like: ThumbsUp, luz: Sun, ojo: Eye, voz: Volume2,
  cortar: Scissors, magia: Wand2, capas: Layers, recortar: Crop, carpeta: Folder, doc: FileText, check: Check, estrella: Star, enviar: Send, menu: Menu,
  inicio: Home, subtitulos: Subtitles, velocidad: Gauge, noticias: Newspaper, bloquear: UserX, silencio: BellOff, peli: Film, imprimir: Printer, pin: Pin,
  archivo: Archive, cel: Smartphone, x: X, ubicacion: MapPin, reloj: Clock, tarjeta: CreditCard, plata: Banknote, denunciar: Flag, copiar: Copy, recibo: Receipt, envio: Truck, wifi: Wifi, link: Link2, tema: Hash, filtros: Sliders
};
const APP_TONE: Record<string, string> = {
  WhatsApp: '#1f8f5c', Ajustes: '#5b6670', Maps: '#2f6fd6', Fotos: '#d0663a', Canva: '#5a4fcf', CapCut: '#1c1c1c', Drive: '#2a8a59', Traductor: '#3466c2',
  Facebook: '#3459a8', YouTube: '#c2362d', Instagram: '#a63c84', Billetera: '#1d77c4', 'Mercado Libre': '#c99a12', ChatGPT: '#2c2c2c', Gemini: '#3d5bd9', Claude: '#b8643e',
  Tienda: '#2f7a64', Teléfono: '#1f8f5c', Correo: '#c4473a', Chrome: '#3466c2', Cámara: '#444b52', Galería: '#d0663a', 'Mi banco': '#1e4f8a', Archivos: '#3a6fb0', TikTok: '#1c1c1c', 'Play Store': '#2f7a64', 'App Store': '#3466c2'
};
const APP_IC: Record<string, string> = {
  WhatsApp: 'whatsapp', Ajustes: 'ajustes', Maps: 'maps', Fotos: 'fotos', Canva: 'canva', CapCut: 'capcut', Drive: 'drive', Traductor: 'traductor', Facebook: 'facebook',
  YouTube: 'youtube', Instagram: 'instagram', Billetera: 'billetera', 'Mercado Libre': 'compras', ChatGPT: 'ia', Gemini: 'ia', Claude: 'ia', Tienda: 'tienda',
  Teléfono: 'telefono', Correo: 'correo', Chrome: 'web', Cámara: 'camara', Galería: 'galeria', 'Mi banco': 'billetera', Archivos: 'carpeta', TikTok: 'musica', 'Play Store': 'tienda', 'App Store': 'tienda'
};
const Ico = ({ n, className }: { n?: string; className?: string }) => { const C = (n && IC[n]) || ChevronRight; return <C className={className} />; };
const TONES = ['#d9a066', '#7aa6c2', '#9cc48a', '#c98a9a', '#b4a2d6', '#e0c36b', '#6fb3a8', '#c27a5a'];

/* ---------- Piezas ---------- */
const H = (on?: boolean) => (on ? { 'data-hl': '1' } : {});
const hlCls = (on?: boolean) => (on ? 'relative z-10 ring-[2.5px] ring-[#00E091] ring-offset-2 ring-offset-white rounded-md' : '');
function Bar({ title, back = true, right }: { title: string; back?: boolean; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 h-11 border-b border-[#e3e7e4] bg-white shrink-0">
      {back && <ArrowLeft className="size-4 text-[#46524c]" />}<b className="flex-1 truncate text-[13px] text-[#13201b]">{title}</b>{right}
    </div>
  );
}
function RowView({ r, hl }: { r: Row; hl?: boolean }) {
  const o = typeof r === 'string' ? { t: r } : r;
  return (
    <div {...H(hl)} className={cx('flex items-center gap-2.5 px-3 py-2.5 border-b border-[#eef1ef] bg-white', hlCls(hl))}>
      {o.i && <span className="grid place-items-center size-6 rounded-md bg-[#eef2ef] text-[#2e3a35]"><Ico n={o.i} className="size-3.5" /></span>}
      <span className="flex-1 min-w-0"><span className={cx('block text-[12px] leading-tight', o.danger ? 'text-[#c0392b]' : 'text-[#13201b]')}>{o.t}</span>{o.s && <span className="block text-[10px] text-[#6b7771] truncate">{o.s}</span>}</span>
      {o.toggle ? <span className={cx('w-7 h-4 rounded-full relative', o.on ? 'bg-[#1f8f5c]' : 'bg-[#cfd6d2]')}><span className={cx('absolute top-0.5 size-3 rounded-full bg-white', o.on ? 'right-0.5' : 'left-0.5')} /></span> : <ChevronRight className="size-3.5 text-[#a3ada8]" />}
    </div>
  );
}
function BlockView({ b, hl }: { b: Block; hl?: string }) {
  const on = 'id' in b && !!b.id && b.id === hl;
  switch (b.b) {
    case 'search': return <div {...H(on)} className={cx('mx-3 my-2 flex items-center gap-2 rounded-full bg-[#eef2ef] px-3 h-8 text-[11px] text-[#6b7771]', hlCls(on))}><Search className="size-3.5" />{b.t}</div>;
    case 'btn': return <div className="px-3 my-1.5"><div {...H(on)} className={cx('h-9 rounded-lg grid place-items-center text-[12px] font-semibold', b.tone === 'ghost' ? 'border border-[#cfd6d2] text-[#13201b]' : b.tone === 'danger' ? 'border border-[#c0392b] text-[#c0392b]' : 'bg-[#13201b] text-white', hlCls(on))}>{b.t}</div></div>;
    case 'card': return <div className="px-3 my-1.5"><div {...H(on)} className={cx('flex items-center gap-2.5 rounded-lg border border-[#e3e7e4] bg-white p-2.5', hlCls(on))}>{b.i && <span className="grid place-items-center size-8 rounded-md bg-[#eef2ef]"><Ico n={b.i} className="size-4 text-[#2e3a35]" /></span>}<span className="min-w-0 flex-1"><b className="block text-[12px] leading-tight text-[#13201b]">{b.t}</b>{b.s && <span className="block text-[10px] text-[#6b7771]">{b.s}</span>}</span></div></div>;
    case 'text': return <p className={cx('px-3 my-1.5', b.big ? 'text-[15px] font-semibold text-[#13201b]' : 'text-[11px]', b.muted ? 'text-[#6b7771]' : 'text-[#13201b]')}>{b.t}</p>;
    case 'input': return <div className="px-3 my-1.5"><div {...H(on)} className={cx('h-9 rounded-lg border border-[#cfd6d2] px-2.5 flex items-center text-[11.5px]', b.ph ? 'text-[#9aa49f]' : 'text-[#13201b]', hlCls(on))}>{b.t}</div></div>;
    case 'tiles': return <div className="grid grid-cols-2 gap-2 px-3 my-1.5">{b.items.map((x, i) => <div key={i} {...H(b.hl === i)} className={cx('rounded-lg bg-[#eef2ef] p-2.5 flex flex-col items-center gap-1 text-[10.5px] font-semibold text-[#13201b]', hlCls(b.hl === i))}><Ico n={x.i} className="size-5" />{x.t}</div>)}</div>;
    case 'big': return <div className="px-3 my-2"><div className="text-[24px] font-semibold tracking-tight text-[#13201b]">{b.t}</div>{b.s && <div className="text-[10.5px] text-[#6b7771]">{b.s}</div>}</div>;
    case 'img': return <div className="px-3 my-1.5"><div {...H(on)} className={cx('h-24 rounded-lg grid place-items-end p-2 text-[11px] font-semibold text-white', hlCls(on))} style={{ background: `linear-gradient(135deg, ${TONES[(b.tone ?? 0) % 8]}, ${TONES[((b.tone ?? 0) + 3) % 8]})` }}>{b.t}</div></div>;
    case 'chips': return <div className="flex gap-1.5 px-3 my-1.5 flex-wrap">{b.items.map((x, i) => <span key={i} {...H(b.hl === i)} className={cx('px-2 h-6 rounded-full border text-[10.5px] grid place-items-center', b.on === i ? 'bg-[#13201b] text-white border-[#13201b]' : 'border-[#cfd6d2] text-[#13201b]', hlCls(b.hl === i))}>{x}</span>)}</div>;
    case 'toggle': return <div className="px-3"><RowView r={{ t: b.t, toggle: true, on: b.on }} hl={on} /></div>;
    case 'tabs': return <div className="flex border-b border-[#e3e7e4] px-1">{b.items.map((x, i) => <span key={i} {...H(b.hl === i)} className={cx('flex-1 text-center py-2 text-[10.5px] font-semibold', b.on === i ? 'text-[#13201b] border-b-2 border-[#13201b]' : 'text-[#7b8681]', hlCls(b.hl === i))}>{x}</span>)}</div>;
    case 'rows': return <div className="my-1">{b.items.map((r, i) => <RowView key={i} r={r} hl={b.hl === i} />)}</div>;
  }
}

function Body({ s }: { s: Screen }): JSX.Element {
  switch (s.k) {
    case 'home':
      return (
        <div className="flex-1 bg-gradient-to-b from-[#23413a] to-[#14231e] p-4 pt-6 grid grid-cols-4 gap-x-2 gap-y-4 content-start">
          {s.apps.map((a, i) => (
            <div key={a + i} className="flex flex-col items-center gap-1">
              <span {...H(s.hl === i)} className={cx('grid place-items-center size-11 rounded-xl text-white', s.hl === i && 'ring-[2.5px] ring-[#00E091] ring-offset-2 ring-offset-[#1b2f28]')} style={{ background: APP_TONE[a] || '#4a5a54' }}><Ico n={APP_IC[a]} className="size-5" /></span>
              <span className="text-[9px] text-white/90 text-center leading-tight truncate w-full">{a}</span>
            </div>
          ))}
        </div>
      );
    case 'list':
      return (
        <div className="flex-1 flex flex-col bg-[#f3f5f3]">
          <Bar title={s.title} back={s.back !== false} />
          {s.search && <div className="bg-white"><BlockView b={{ b: 'search', t: 'Buscar en ajustes' }} /></div>}
          <div className="mt-1.5">{s.items.map((r, i) => <RowView key={i} r={r} hl={s.hl === i} />)}</div>
        </div>
      );
    case 'chat':
      return (
        <div className="flex-1 flex flex-col bg-[#ece9e2]">
          <div className="flex items-center gap-2 px-2.5 h-12 bg-[#1f6b4f] text-white shrink-0">
            <ArrowLeft className="size-4" /><span className="size-7 rounded-full bg-white/25 grid place-items-center text-[11px] font-bold">{s.title[0]}</span>
            <span className="flex-1 min-w-0"><b className="block text-[12px] leading-tight truncate">{s.title}</b><span className="text-[9px] opacity-80">{s.sub || 'en línea'}</span></span>
            <span {...H(s.hl === 'cam')} className={cx('p-1', s.hl === 'cam' && 'ring-[2.5px] ring-[#00E091] rounded-md')}><Video className="size-4" /></span>
            <span {...H(s.hl === 'phone')} className={cx('p-1', s.hl === 'phone' && 'ring-[2.5px] ring-[#00E091] rounded-md')}><Phone className="size-4" /></span>
            <span {...H(s.hl === 'menu')} className={cx('p-1', s.hl === 'menu' && 'ring-[2.5px] ring-[#00E091] rounded-md')}><EllipsisVertical className="size-4" /></span>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 p-2.5 overflow-hidden">
            {s.msgs.map((m, i) => (
              <div key={i} {...H(s.hl === 'm' + i)} className={cx('max-w-[78%] rounded-lg px-2.5 py-1.5 text-[11px] shadow-sm', m.me ? 'self-end bg-[#d6f2dc]' : 'self-start bg-white', hlCls(s.hl === 'm' + i))}>
                {m.audio ? <span className="flex items-center gap-1.5"><Play className="size-3" /><span className="h-0.5 w-16 bg-[#1f6b4f]/40 rounded" />0:12</span>
                  : m.doc ? <span className="flex items-center gap-1.5"><FileText className="size-3.5 text-[#c0392b]" />{m.t}</span>
                  : m.loc ? <span className="block"><span className="block h-12 w-32 rounded bg-[#cfe3d6] mb-1 relative"><MapPin className="size-4 text-[#c0392b] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" /></span>{m.t}</span>
                  : m.img ? <span className="block h-14 w-28 rounded" style={{ background: 'linear-gradient(135deg,#d9a066,#7aa6c2)' }} />
                  : m.t}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 p-2 shrink-0">
            <div className="flex-1 flex items-center gap-1.5 rounded-full bg-white px-2.5 h-8 text-[11px] text-[#7b8681]">
              {s.rec ? <span className="text-[#c0392b] font-semibold flex items-center gap-1"><span className="size-1.5 rounded-full bg-[#c0392b]" />0:04  ◀ cancelar</span> : <span className="flex-1 truncate">{s.typing || 'Mensaje'}</span>}
              {!s.rec && <span {...H(s.hl === 'clip')} className={cx(s.hl === 'clip' && 'ring-[2.5px] ring-[#00E091] rounded')}><Paperclip className="size-3.5" /></span>}
              {!s.rec && <Camera className="size-3.5" />}
            </div>
            <span {...H(s.hl === 'mic')} className={cx('grid place-items-center size-8 rounded-full bg-[#1f8f5c] text-white', s.hl === 'mic' && 'ring-[2.5px] ring-[#00E091] ring-offset-2', s.rec && 'scale-125')}>{s.typing ? <Send className="size-3.5" /> : <Mic className="size-3.5" />}</span>
          </div>
        </div>
      );
    case 'chats':
      return (
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex items-center gap-2 px-3 h-11 border-b border-[#e3e7e4]">
            {s.bar ? <><ArrowLeft className="size-4" /><b className="flex-1 text-[12px]">1</b><span {...H(s.hl === -1)} className={cx('p-1', s.hl === -1 && 'ring-[2.5px] ring-[#00E091] rounded-md')}><Pin className="size-4" /></span><span {...H(s.hl === -2)} className={cx('p-1', s.hl === -2 && 'ring-[2.5px] ring-[#00E091] rounded-md')}><Archive className="size-4" /></span></>
              : <><b className="flex-1 text-[14px]">Chats</b><span {...H(s.hl === -3)} className={cx('p-1', s.hl === -3 && 'ring-[2.5px] ring-[#00E091] rounded-md')}><Search className="size-4" /></span><EllipsisVertical className="size-4" /></>}
          </div>
          {s.items.map((c, i) => (
            <div key={i} {...H(s.hl === i)} className={cx('flex items-center gap-2.5 px-3 py-2 border-b border-[#f0f2f1]', s.sel === i && 'bg-[#e3f3ea]', hlCls(s.hl === i))}>
              <span className="size-8 rounded-full bg-[#e3e8e5] grid place-items-center text-[11px] font-bold">{c.t[0]}</span>
              <span className="flex-1 min-w-0"><b className="block text-[11.5px]">{c.t}</b><span className="block text-[10px] text-[#6b7771] truncate">{c.s}</span></span>
              {c.pin && <Pin className="size-3 text-[#7b8681] rotate-45" />}
            </div>
          ))}
          <div className="flex-1" />
          <div className="flex justify-end p-3"><span {...H(s.hl === -4)} className={cx('grid place-items-center size-10 rounded-xl bg-[#1f8f5c] text-white', s.hl === -4 && 'ring-[2.5px] ring-[#00E091] ring-offset-2')}><Plus className="size-4" /></span></div>
        </div>
      );
    case 'sheet':
      return (
        <div className="flex-1 relative flex flex-col">
          <div className="flex-1 flex flex-col opacity-40 pointer-events-none"><Body s={s.base} /></div>
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-3 shadow-[0_-8px_20px_rgba(0,0,0,.15)]">
            <div className="mx-auto w-8 h-1 rounded-full bg-[#cfd6d2] mb-2" />
            {s.title && <b className="block text-[12px] mb-2 text-[#13201b]">{s.title}</b>}
            <div className={s.grid ? 'grid grid-cols-3 gap-2' : 'flex flex-col'}>
              {s.items.map((x, i) => s.grid
                ? <div key={i} {...H(s.hl === i)} className={cx('flex flex-col items-center gap-1 py-1.5 text-[10px] text-[#13201b]', hlCls(s.hl === i))}><span className="grid place-items-center size-9 rounded-full bg-[#eef2ef]"><Ico n={x.i} className="size-4" /></span>{x.t}</div>
                : <div key={i} {...H(s.hl === i)} className={cx('flex items-center gap-2.5 py-2 px-1 text-[12px] text-[#13201b] border-b border-[#f0f2f1]', hlCls(s.hl === i))}>{x.i && <Ico n={x.i} className="size-4 text-[#46524c]" />}{x.t}</div>)}
            </div>
          </div>
        </div>
      );
    case 'app':
      return (
        <div className="flex-1 flex flex-col bg-[#f7f8f7]">
          <div className="flex items-center gap-2 px-3 h-11 shrink-0 text-white" style={{ background: s.tone || '#24342e' }}>
            {s.back && <ArrowLeft className="size-4" />}<b className="flex-1 text-[12.5px] truncate">{s.title}</b><Menu className="size-4 opacity-80" />
          </div>
          <div className="flex-1 flex flex-col py-1 overflow-hidden">{s.blocks.map((b, i) => <BlockView key={i} b={b} hl={s.hl} />)}</div>
          {s.nav && <div className="flex border-t border-[#e3e7e4] bg-white shrink-0">{s.nav.map((n, i) => <span key={i} {...H(s.navHl === i)} className={cx('flex-1 text-center py-2 text-[9.5px] font-semibold text-[#46524c]', hlCls(s.navHl === i))}>{n}</span>)}</div>}
        </div>
      );
    case 'map':
      return (
        <div className="flex-1 relative overflow-hidden bg-[#e8efe6]">
          <svg viewBox="0 0 280 500" className="absolute inset-0 w-full h-full" aria-hidden>
            <path d="M0 120 L280 90 M0 260 L280 300 M60 0 L90 500 M190 0 L170 500 M0 400 L280 380" stroke="#fff" strokeWidth="10" />
            <rect x="200" y="320" width="60" height="50" rx="6" fill="#cfe3c8" /><rect x="20" y="160" width="40" height="60" rx="6" fill="#cfe3c8" />
            {s.route && <path d="M95 420 C 110 330, 160 300, 175 260 S 185 160, 180 130" stroke="#2f6fd6" strokeWidth="6" fill="none" strokeLinecap="round" />}
          </svg>
          {s.route && <span className="absolute left-[30%] top-[82%] size-3 rounded-full bg-[#2f6fd6] ring-4 ring-[#2f6fd6]/25" />}
          <MapPin className="absolute left-[62%] top-[22%] size-6 text-[#c0392b] fill-[#c0392b]/30" />
          <div className="absolute inset-x-3 top-3 flex flex-col gap-1.5">
            <div {...H(s.hl === 'search')} className={cx('flex items-center gap-2 rounded-full bg-white h-9 px-3 text-[11px] shadow', s.q ? 'text-[#13201b]' : 'text-[#7b8681]', s.hl === 'search' && 'ring-[2.5px] ring-[#00E091]')}><Search className="size-3.5" />{s.q || 'Buscá aquí'}</div>
            {s.route && <div className="flex gap-1">{([['auto', 'auto'], ['bus', 'bus'], ['pie', 'pie']] as const).map(([k, ic]) => <span key={k} {...H(s.hl === k)} className={cx('flex items-center gap-1 rounded-full px-2 h-6 text-[10px]', s.mode === k ? 'bg-[#2f6fd6] text-white' : 'bg-white', s.hl === k && 'ring-[2.5px] ring-[#00E091]')}><Ico n={ic} className="size-3" />{k === 'auto' ? '15 min' : k === 'bus' ? '32 min' : '48 min'}</span>)}</div>}
          </div>
          {(s.place || s.route) && (
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-3 shadow-[0_-6px_18px_rgba(0,0,0,.12)]">
              <b className="block text-[12.5px]">{s.place || 'Hospital Central'}</b><span className="text-[10px] text-[#6b7771]">{s.route ? 'Ruta más rápida' : 'Av. Siempre Viva 1200'}</span>
              <div className="flex gap-1.5 mt-2">
                <span {...H(s.hl === 'dir' || s.hl === 'start')} className={cx('flex items-center gap-1 whitespace-nowrap rounded-full bg-[#2f6fd6] text-white px-2.5 h-7 text-[10px] font-semibold', (s.hl === 'dir' || s.hl === 'start') && 'ring-[2.5px] ring-[#00E091] ring-offset-1')}><Navigation className="size-3" />{s.route ? 'Iniciar' : 'Cómo llegar'}</span>
                <span {...H(s.hl === 'save')} className={cx('flex items-center gap-1 whitespace-nowrap rounded-full border border-[#cfd6d2] px-2 h-7 text-[10px]', s.hl === 'save' && 'ring-[2.5px] ring-[#00E091]')}><Bookmark className="size-3" />Guardar</span>
                <span {...H(s.hl === 'share')} className={cx('flex items-center gap-1 whitespace-nowrap rounded-full border border-[#cfd6d2] px-2 h-7 text-[10px]', s.hl === 'share' && 'ring-[2.5px] ring-[#00E091]')}><Share2 className="size-3" />Compartir</span>
              </div>
            </div>
          )}
        </div>
      );
    case 'photos':
      return (
        <div className="flex-1 flex flex-col bg-white">
          <Bar title={s.title || 'Fotos'} back={false} right={<UserRound {...H(s.bannerHl)} className={cx('size-5 text-[#46524c]', s.bannerHl && 'ring-[2.5px] ring-[#00E091] rounded-full')} />} />
          {s.banner && <div className="m-2 rounded-lg bg-[#eaf2fb] px-2.5 py-2 text-[10.5px] text-[#1e4f8a] flex items-center gap-2"><Cloud className="size-3.5" />{s.banner}</div>}
          <div className="grid grid-cols-3 gap-0.5 p-0.5">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} {...H(s.hl === i)} className={cx('aspect-square relative', s.hl === i && 'ring-[2.5px] ring-[#00E091] z-10')} style={{ background: `linear-gradient(135deg, ${TONES[i % 8]}, ${TONES[(i + 3) % 8]})` }}>
                {s.sel?.includes(i) && <span className="absolute top-1 right-1 size-4 rounded-full bg-[#2f6fd6] grid place-items-center"><Check className="size-2.5 text-white" /></span>}
              </div>
            ))}
          </div>
        </div>
      );
    case 'call':
      return (
        <div className="flex-1 flex flex-col items-center justify-between bg-[#14211c] text-white p-5">
          <div className="text-center mt-8"><div className="mx-auto size-20 rounded-full bg-white/15 grid place-items-center text-[26px] font-bold">{s.name[0]}</div><b className="block mt-2 text-[14px]">{s.name}</b><span className="text-[10px] text-white/70">00:12</span></div>
          <div className="flex gap-3 mb-2">
            {[['mic', Mic], ['cam', Video], ['flip', Camera]].map(([k, C]: any) => <span key={k} {...H(s.hl === k)} className={cx('grid place-items-center size-10 rounded-full bg-white/15', s.hl === k && 'ring-[2.5px] ring-[#00E091]')}><C className="size-4" /></span>)}
            <span {...H(s.hl === 'end')} className={cx('grid place-items-center size-10 rounded-full bg-[#e5484d]', s.hl === 'end' && 'ring-[2.5px] ring-[#00E091]')}><Phone className="size-4 rotate-[135deg]" /></span>
          </div>
        </div>
      );
    case 'editor':
      return (
        <div className="flex-1 flex flex-col bg-[#1d2321] text-white">
          <div className="flex items-center gap-2 px-3 h-11 shrink-0"><ArrowLeft className="size-4" /><b className="flex-1 text-[12px] truncate">{s.title}</b><span {...H(s.hl === 'export')} className={cx('rounded-md bg-[#5a4fcf] px-2.5 h-7 grid place-items-center text-[10.5px] font-semibold', s.hl === 'export' && 'ring-[2.5px] ring-[#00E091]')}><Download className="size-3.5" /></span></div>
          <div className="flex-1 grid place-items-center p-4">
            <div {...H(s.hl === 'canvas')} className={cx('w-[78%] aspect-[4/5] rounded-md grid place-items-center text-center p-3', s.hl === 'canvas' && 'ring-[2.5px] ring-[#00E091]')} style={{ background: `linear-gradient(160deg, ${TONES[(s.canvas.tone ?? 1) % 8]}, ${TONES[((s.canvas.tone ?? 1) + 2) % 8]})` }}>
              <div><b className="block text-[16px] leading-tight drop-shadow">{s.canvas.t}</b>{s.canvas.s && <span className="block text-[10px] mt-1 opacity-90">{s.canvas.s}</span>}</div>
            </div>
          </div>
          {s.timeline && <div className="mx-3 mb-2 h-8 rounded bg-white/10 flex gap-0.5 p-1">{[0, 1, 2, 3, 4].map((i) => <span key={i} className="flex-1 rounded-sm" style={{ background: TONES[i % 8] }} />)}</div>}
          <div className="flex justify-around border-t border-white/10 py-2 shrink-0">
            {s.tools.map((t, i) => <span key={i} {...H(s.hl === i)} className={cx('flex flex-col items-center gap-0.5 text-[9px] px-1', s.hl === i && 'ring-[2.5px] ring-[#00E091] rounded-md')}><Ico n={t.i} className="size-4" />{t.t}</span>)}
          </div>
        </div>
      );
  }
}

/* ---------- Teléfono con dedo animado ---------- */
export function PhoneScreen({ frame, width = 280, animateFinger = true, className }: { frame: Frame; width?: number; animateFinger?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  const reduce = useReducedMotion();
  const scale = width / 280;
  useLayoutEffect(() => {
    const root = ref.current; if (!root) return;
    const el = root.querySelector('[data-hl="1"]') as HTMLElement | null;
    if (!el) { setPt(null); return; }
    const r = el.getBoundingClientRect(), b = root.getBoundingClientRect();
    setPt({ x: (r.left - b.left + r.width / 2) / scale, y: (r.top - b.top + r.height / 2) / scale });
  }, [frame, scale]);
  const act = frame.act || 'tap';
  return (
    <div className={cx('relative shrink-0', className)} style={{ width, height: 580 * scale }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: 280, height: 580, transform: `scale(${scale})` }}>
        <div className="w-[280px] h-[580px] rounded-[34px] bg-[#0f1714] p-[9px] shadow-[0_18px_40px_-14px_rgba(0,0,0,.45)]">
          <div ref={ref} className="relative w-full h-full rounded-[26px] overflow-hidden bg-white flex flex-col font-body">
            <div className="flex items-center justify-between px-5 h-6 text-[9.5px] font-semibold text-[#13201b] bg-white shrink-0"><span>9:41</span><span className="w-14 h-3.5 rounded-full bg-[#0f1714]" /><span>100%</span></div>
            <div className="flex-1 flex flex-col min-h-0"><Body s={frame.s} /></div>
            {pt && (
              <motion.div className="absolute z-30 pointer-events-none" initial={animateFinger && !reduce ? { x: pt.x + 40, y: pt.y + 70, opacity: 0 } : { x: pt.x, y: pt.y, opacity: 1 }}
                animate={{ x: act === 'left' ? [pt.x, pt.x - 60] : pt.x, y: act === 'up' ? [pt.y, pt.y - 50] : pt.y, opacity: 1 }}
                transition={{ duration: act === 'left' || act === 'up' ? 1.2 : 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} key={JSON.stringify(pt) + act}>
                <motion.span className="absolute -left-5 -top-5 size-10 rounded-full bg-[#00E091]/35 border-2 border-[#00E091]"
                  animate={reduce ? {} : act === 'hold' ? { scale: [0.8, 1.3, 1.3] } : { scale: [1, 0.75, 1], opacity: [1, 0.9, 0.6] }} transition={{ duration: act === 'hold' ? 1.4 : 1, repeat: Infinity, repeatDelay: 0.6, delay: 0.8 }} />
                <svg viewBox="0 0 24 24" className="absolute left-0 top-1 size-7 drop-shadow-[0_2px_3px_rgba(0,0,0,.4)]" fill="#ffffff" stroke="#13201b" strokeWidth="1.3" strokeLinejoin="round">
                  <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5V8a1.5 1.5 0 0 1 3 0v2m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4.6 15.4a1.6 1.6 0 0 1 2.4-2.1L9 15" />
                </svg>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
