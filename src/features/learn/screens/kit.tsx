/* Piezas comunes para dibujar pantallas de apps reales (sin logos oficiales). */
import React from 'react';
import {
  Wifi, Signal, BatteryFull, Search, ChevronLeft, ArrowLeft, MoreVertical, MoreHorizontal, Plus, Mic, Camera, Paperclip, Smile, Send, Phone, Video,
  Home, Bell, User, Users, Heart, MessageCircle, Share2, Bookmark, Download, ThumbsUp, ThumbsDown, Settings, Menu, X as XIcon, Check, Star, MapPin,
  Navigation, Car, Bus, Footprints, Image, Images, Folder, FileText, Upload, Scan, Languages, Volume2, Copy, Cloud, Trash2, Pencil, Crop,
  SlidersHorizontal, Wand2, Type, Music, Scissors, Layers, Sparkles, QrCode, Wallet, CreditCard, Receipt, ArrowLeftRight, ArrowDownToLine,
  ShoppingCart, ShoppingBag, Truck, Store, Clock, Lock, Shield, Eye, Globe, Flag, Ban, BellOff, Archive, Pin, Play, Pause, SkipForward,
  Subtitles, Gauge, Cast, Film, Clapperboard, Palette, LayoutGrid, Calendar, Mail, Inbox, Hash, Compass, TrendingUp, TrendingDown, BarChart3,
  PieChart, Landmark, DollarSign, Bitcoin, Repeat, Info, CircleHelp, Link2, Lightbulb, Sun, Moon, Accessibility, Smartphone, RefreshCcw,
  ChevronRight, ChevronDown, Square, Circle, Headphones, Radio, Newspaper, Tv, Maximize, Printer, Gift, PartyPopper, Sticker, Brush, Eraser,
  Undo2, Redo2, Mountain, Utensils, Coffee, Pill, Fuel, Building2, Bot, AudioLines, ListChecks, Tag, Percent, Award, Activity, Key
} from 'lucide-react';
import { cx } from '../../../ui';

export const RING = 'outline outline-[2.5px] outline-offset-2 outline-[#00E091]';
/** atributos para el elemento resaltado (donde se apoya el dedo) */
export const X = (s: { hl?: string }, id: string) => (s.hl === id ? { 'data-hl': '1' } : {});
export const R = (s: { hl?: string }, id: string) => (s.hl === id ? RING : '');
/** props listos: data-hl + clase */
export const H = (s: { hl?: string }, id: string, cls = '') => ({ ...X(s, id), className: cx(cls, R(s, id)) });

export const IC: Record<string, any> = {
  search: Search, back: ArrowLeft, chevl: ChevronLeft, more: MoreVertical, moreh: MoreHorizontal, plus: Plus, mic: Mic, camera: Camera, clip: Paperclip,
  smile: Smile, send: Send, phone: Phone, video: Video, home: Home, bell: Bell, user: User, users: Users, heart: Heart, comment: MessageCircle, share: Share2,
  save: Bookmark, download: Download, like: ThumbsUp, dislike: ThumbsDown, settings: Settings, menu: Menu, x: XIcon, check: Check, star: Star, pin: MapPin,
  nav: Navigation, car: Car, bus: Bus, walk: Footprints, image: Image, images: Images, folder: Folder, doc: FileText, upload: Upload, scan: Scan,
  translate: Languages, speaker: Volume2, copy: Copy, cloud: Cloud, trash: Trash2, pencil: Pencil, crop: Crop, sliders: SlidersHorizontal, wand: Wand2,
  type: Type, music: Music, cut: Scissors, layers: Layers, sparkles: Sparkles, qr: QrCode, wallet: Wallet, card: CreditCard, receipt: Receipt,
  transfer: ArrowLeftRight, deposit: ArrowDownToLine, cart: ShoppingCart, bag: ShoppingBag, truck: Truck, store: Store, clock: Clock, lock: Lock, shield: Shield,
  eye: Eye, globe: Globe, flag: Flag, ban: Ban, mute: BellOff, archive: Archive, pinned: Pin, play: Play, pause: Pause, next: SkipForward, subs: Subtitles,
  speed: Gauge, cast: Cast, film: Film, clap: Clapperboard, palette: Palette, grid: LayoutGrid, calendar: Calendar, mail: Mail, inbox: Inbox, hash: Hash,
  compass: Compass, up: TrendingUp, down: TrendingDown, bars: BarChart3, pie: PieChart, bank: Landmark, dollar: DollarSign, btc: Bitcoin, repeat: Repeat,
  wifi: Wifi, info: Info, help: CircleHelp, link: Link2, idea: Lightbulb, sun: Sun, moon: Moon, a11y: Accessibility, cel: Smartphone, refresh: RefreshCcw, chev: ChevronRight,
  chevd: ChevronDown, square: Square, circle: Circle, headphones: Headphones, radio: Radio, news: Newspaper, tv: Tv, max: Maximize, print: Printer, gift: Gift,
  party: PartyPopper, sticker: Sticker, brush: Brush, eraser: Eraser, undo: Undo2, redo: Redo2, mountain: Mountain, food: Utensils, coffee: Coffee, pill: Pill,
  fuel: Fuel, building: Building2, bot: Bot, wave: AudioLines, list: ListChecks, tag: Tag, percent: Percent, award: Award, activity: Activity, key: Key
};
export const I = ({ n, className, style }: { n: string; className?: string; style?: React.CSSProperties }) => { const C = IC[n] || Circle; return <C className={className} style={style} />; };

/* Barra de estado del celular */
export function StatusBar({ dark, bg, light }: { dark?: boolean; bg?: string; light?: boolean }) {
  return (
    <div className={cx('flex items-center justify-between px-4 h-[22px] shrink-0 text-[9.5px] font-semibold', dark || light ? 'text-white' : 'text-[#1f1f1f]')} style={{ background: bg || (dark ? '#000' : '#fff') }}>
      <span>10:24</span><span className="w-12 h-3 rounded-full bg-black/90" style={{ background: dark ? '#111' : '#0b0b0b' }} />
      <span className="flex items-center gap-0.5"><Signal className="size-2.5" /><Wifi className="size-2.5" /><BatteryFull className="size-3" /></span>
    </div>
  );
}

/* Fotos ilustradas (paisajes, comida, familia...) para miniaturas y galerías */
const SCENES = [
  ['#9fd3f5', '#5c9e5a', '#3f7d45', 'mount'], ['#ffd59a', '#f08a5d', '#2f6a8f', 'beach'], ['#cfe8ff', '#7a5c44', '#c95f3c', 'food'], ['#f6e3c7', '#e7a38c', '#5d7f6b', 'family'],
  ['#e8f1e4', '#d97a8a', '#7aa25f', 'flowers'], ['#1f2b4a', '#f2c66d', '#384a73', 'night'], ['#dce9f2', '#8a9aa8', '#4f6170', 'city'], ['#fbe7d4', '#c98b5a', '#6b4b3a', 'dog'], ['#d9d4c7', '#fbfaf6', '#9a9a9a', 'doc']
] as const;
export function Pic({ n = 0, className, label, round }: { n?: number; className?: string; label?: string; round?: boolean }) {
  const [sky, a, b, k] = SCENES[((n % SCENES.length) + SCENES.length) % SCENES.length];
  return (
    <div className={cx(className?.includes('absolute') ? '' : 'relative', 'overflow-hidden', round ? 'rounded-full' : '', className)} style={{ background: sky }}>
      <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        {k === 'mount' && <><circle cx="78" cy="16" r="7" fill="#fff6c9" /><path d="M0 70 L28 26 L46 50 L64 22 L100 70Z" fill={a} /><path d="M0 70 L20 48 L40 62 L70 40 L100 70Z" fill={b} /></>}
        {k === 'beach' && <><circle cx="70" cy="30" r="10" fill="#fff1b8" /><rect y="40" width="100" height="12" fill={b} /><rect y="52" width="100" height="18" fill="#f3d9a4" /><path d="M14 52 Q18 30 26 28" stroke="#6b4a2b" strokeWidth="2" fill="none" /><path d="M26 28 q-10 -2 -14 4 M26 28 q8 -6 14 0 M26 28 q-2 -8 -8 -8" stroke="#3d7a3a" strokeWidth="2.5" fill="none" /></>}
        {k === 'food' && <><rect width="100" height="70" fill="#e9dccb" /><circle cx="50" cy="38" r="26" fill="#fff" /><circle cx="50" cy="38" r="19" fill={b} /><circle cx="44" cy="34" r="4" fill="#f4d35e" /><circle cx="56" cy="42" r="3.5" fill="#6aa84f" /><circle cx="52" cy="31" r="3" fill="#fff4dc" /></>}
        {k === 'family' && <><rect y="48" width="100" height="22" fill={b} /><circle cx="35" cy="28" r="7" fill="#c98c6a" /><rect x="27" y="35" width="16" height="22" rx="6" fill="#3f6b9e" /><circle cx="58" cy="30" r="6" fill="#e2b48f" /><rect x="51" y="36" width="14" height="20" rx="6" fill="#c0574b" /><circle cx="73" cy="38" r="4.5" fill="#d9a07c" /><rect x="68" y="42" width="10" height="14" rx="4" fill="#f2b84b" /></>}
        {k === 'flowers' && <>{[15, 35, 55, 75, 90].map((x, i) => <g key={i}><path d={`M${x} 70 L${x} ${40 + (i % 2) * 8}`} stroke={b} strokeWidth="2" /><circle cx={x} cy={38 + (i % 2) * 8} r="6" fill={i % 2 ? a : '#f2c14e'} /><circle cx={x} cy={38 + (i % 2) * 8} r="2" fill="#fff4" /></g>)}</>}
        {k === 'night' && <><circle cx="72" cy="18" r="8" fill={a} />{[10, 25, 40, 88, 55].map((x, i) => <circle key={i} cx={x} cy={8 + (i * 7) % 20} r="0.9" fill="#fff" />)}<path d="M0 70 L0 50 L15 50 L15 40 L28 40 L28 54 L45 54 L45 36 L58 36 L58 52 L100 52 L100 70Z" fill={b} /></>}
        {k === 'city' && <>{[5, 22, 40, 58, 76].map((x, i) => <rect key={i} x={x} y={20 + (i * 9) % 22} width="15" height="60" fill={i % 2 ? a : b} />)}</>}
        {k === 'doc' && <><rect x="22" y="6" width="56" height="60" rx="1.5" fill={a} transform="rotate(-3 50 36)" /><g transform="rotate(-3 50 36)"><rect x="28" y="12" width="26" height="3" fill="#3d5a80" />{[20, 25, 30, 35, 40, 45, 50].map((y, i) => <rect key={y} x="28" y={y} width={[40, 36, 42, 30, 38, 26, 34][i]} height="1.6" fill={b} />)}<rect x="56" y="56" width="16" height="5" fill="#c0392b" opacity=".55" /></g></>}
        {k === 'dog' && <><rect y="50" width="100" height="20" fill="#a6c48a" /><ellipse cx="50" cy="44" rx="18" ry="12" fill={a} /><circle cx="66" cy="32" r="9" fill={a} /><ellipse cx="72" cy="27" rx="3" ry="6" fill={b} /><circle cx="69" cy="31" r="1.4" fill="#222" /><rect x="38" y="52" width="4" height="8" fill={b} /><rect x="56" y="52" width="4" height="8" fill={b} /></>}
      </svg>
      {label && <span className="absolute left-1 bottom-1 rounded bg-black/70 px-1 text-[7.5px] font-semibold text-white">{label}</span>}
    </div>
  );
}

const AV = ['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ba68c8', '#4db6ac', '#f06292', '#90a4ae'];
export function Avatar({ t, n = 0, size = 28, ring, className }: { t: string; n?: number; size?: number; ring?: string; className?: string }) {
  return <span className={cx('grid place-items-center rounded-full text-white font-semibold shrink-0', className)} style={{ width: size, height: size, background: AV[n % 8], fontSize: size * 0.4, boxShadow: ring ? `0 0 0 2px #fff, 0 0 0 3.5px ${ring}` : undefined }}>{t[0]}</span>;
}

/* Barra inferior de navegación de una app */
export function BottomNav({ s, items, active = 0, dark, idp = 'nav' }: { s: any; items: [string, string][]; active?: number; dark?: boolean; idp?: string }) {
  return (
    <div className={cx('flex shrink-0 border-t pb-1.5 pt-1', dark ? 'bg-black border-white/10' : 'bg-white border-[#ececec]')}>
      {items.map(([ic, t], i) => (
        <div key={i} {...H(s, idp + i, cx('flex-1 flex flex-col items-center gap-0.5 rounded-md py-0.5', dark ? 'text-white' : i === active ? 'text-[#111]' : 'text-[#5f6368]'))}>
          {ic === '+' ? <span className={cx('grid place-items-center w-8 h-6 rounded-lg', dark ? 'bg-white text-black' : 'border border-[#bbb]')}><Plus className="size-3.5" /></span> : <I n={ic} className={cx('size-[15px]', i === active && 'stroke-[2.6]')} />}
          {t && <span className={cx('text-[7.5px]', i === active && 'font-semibold')}>{t}</span>}
        </div>
      ))}
    </div>
  );
}

/* Hoja inferior (menú que sube desde abajo) */
export function Sheet({ s, title, items, grid, dark, base }: { s: any; title?: string; items: { t: string; i?: string; c?: string; sub?: string }[]; grid?: number; dark?: boolean; base: React.ReactNode }) {
  return (
    <div className="flex-1 relative flex flex-col min-h-0">
      <div className="flex-1 flex flex-col min-h-0 pointer-events-none">{base}</div>
      <div className="absolute inset-0 bg-black/35" />
      <div className={cx('absolute inset-x-0 bottom-0 rounded-t-[18px] px-3 pt-2 pb-3', dark ? 'bg-[#1f1f1f] text-white' : 'bg-white text-[#1f1f1f]')}>
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-[#c4c4c4]" />
        {title && <b className="block text-[11.5px] mb-2 px-1">{title}</b>}
        <div className={grid ? 'grid gap-y-2.5' : 'flex flex-col'} style={grid ? { gridTemplateColumns: `repeat(${grid}, minmax(0,1fr))` } : undefined}>
          {items.map((x, i) => grid ? (
            <div key={i} {...H(s, 'o' + i, 'flex flex-col items-center gap-1 rounded-lg py-1')}>
              <span className="grid place-items-center size-9 rounded-full text-white" style={{ background: x.c || '#5f6368' }}><I n={x.i || 'circle'} className="size-4" /></span>
              <span className="text-[8.5px] text-center leading-tight">{x.t}</span>
            </div>
          ) : (
            <div key={i} {...H(s, 'o' + i, 'flex items-center gap-3 px-1 py-2 rounded-md')}>
              {x.i && <I n={x.i} className="size-4 opacity-80" />}<span className="flex-1 min-w-0"><span className="block text-[11px]">{x.t}</span>{x.sub && <span className="block text-[8.5px] opacity-60">{x.sub}</span>}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Diálogo del sistema (permisos, confirmaciones) */
export function Dialog({ s, base, title, text, ok = 'Permitir', cancel = 'No permitir', icon = 'mic' }: { s: any; base: React.ReactNode; title: string; text?: string; ok?: string; cancel?: string; icon?: string }) {
  return (
    <div className="flex-1 relative flex flex-col min-h-0">
      <div className="flex-1 flex flex-col min-h-0">{base}</div>
      <div className="absolute inset-0 bg-black/45 grid place-items-center p-5">
        <div className="w-full rounded-[22px] bg-[#f3f1f6] p-4 text-center">
          <I n={icon} className="size-5 mx-auto text-[#3c5a99]" />
          <b className="block mt-2 text-[11.5px] leading-snug text-[#1f1f1f]">{title}</b>
          {text && <p className="mt-1 text-[9px] text-[#555]">{text}</p>}
          <div className="mt-3 flex flex-col gap-1">
            <div {...H(s, 'ok', 'rounded-full bg-[#dfe3f1] py-2 text-[10px] font-semibold text-[#2b3f74]')}>{ok}</div>
            <div {...H(s, 'cancel', 'rounded-full py-2 text-[10px] font-semibold text-[#2b3f74]')}>{cancel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Teclado para pantallas donde se escribe */
export function Keyboard({ s, mic = true }: { s: any; mic?: boolean }) {
  const rows = ['qwertyuiop', 'asdfghjklñ', 'zxcvbnm'];
  return (
    <div className="shrink-0 bg-[#e9ebee] px-1 pt-1.5 pb-2">
      <div className="flex items-center justify-between px-2 pb-1 text-[#5f6368]"><I n="smile" className="size-3.5" /><I n="sticker" className="size-3.5" /><I n="settings" className="size-3.5" />{mic && <span {...H(s, 'kmic', 'rounded-full p-0.5')}><I n="mic" className="size-3.5" /></span>}</div>
      {rows.map((r, i) => <div key={i} className="flex justify-center gap-[3px] mb-[3px]">{r.split('').map((c) => <span key={c} className="w-[21px] h-[24px] rounded bg-white grid place-items-center text-[10px] text-[#222] shadow-[0_1px_0_#c4c7cc]">{c}</span>)}</div>)}
      <div className="flex justify-center gap-[3px]"><span className="w-10 h-[24px] rounded bg-[#cfd3d8] text-[8px] grid place-items-center">?123</span><span className="flex-1 max-w-[140px] h-[24px] rounded bg-white shadow-[0_1px_0_#c4c7cc]" /><span {...H(s, 'kok', 'w-10 h-[24px] rounded bg-[#1a73e8] grid place-items-center text-white')}><I n="check" className="size-3" /></span></div>
    </div>
  );
}

/* Campo de búsqueda redondeado */
export function SearchPill({ s, id = 'search', t, ph, className, dark, icon = 'search' }: { s: any; id?: string; t?: string; ph?: string; className?: string; dark?: boolean; icon?: string }) {
  return <div {...H(s, id, cx('flex items-center gap-2 rounded-full h-8 px-3 text-[10px]', dark ? 'bg-white/10 text-white' : 'bg-[#eef0f3] text-[#1f1f1f]', className))}><I n={icon} className="size-3.5 opacity-70" /><span className={cx('truncate', !t && 'opacity-60')}>{t || ph}</span></div>;
}

export function Btn({ s, id, children, className }: { s: any; id: string; children: React.ReactNode; className?: string }) {
  return <div {...H(s, id, cx('grid place-items-center text-center', className))}>{children}</div>;
}
