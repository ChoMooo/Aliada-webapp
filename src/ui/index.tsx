import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Volume2, Square, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cx } from './cx';
import { useToasts } from './toast';
import { speak, stopSpeak } from '../lib/share';
import { useD } from '../store';
import logo from '../logo.png';

export { cx };
export const LOGO = logo;

/* ---------- Animación base ---------- */
export const ease = [0.22, 1, 0.36, 1] as const;
export const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } };
export function Stagger({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}>
      {children}
    </motion.div>
  );
}
export const Item = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div className={className} variants={fadeUp}>{children}</motion.div>
);

/* ---------- Botones ---------- */
type BtnProps = {
  children?: React.ReactNode; onClick?: () => void; to?: string; href?: string; icon?: React.ReactNode; iconRight?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glow' | 'onbrand' | 'danger' | 'quiet'; size?: 'md' | 'sm' | 'lg'; block?: boolean;
  className?: string; disabled?: boolean; type?: 'button' | 'submit'; label?: string; pressed?: boolean;
};
const VAR: Record<string, string> = {
  primary: 'bg-accent text-onaccent border-2 border-accent shadow-[0_6px_18px_-8px_rgb(var(--accent)/.7)] hover:brightness-110',
  secondary: 'bg-transparent text-accent border-2 border-accent hover:bg-accent/5',
  ghost: 'bg-surface text-ink border border-line hover:border-ink/30',
  glow: 'bg-glow text-[#032216] border-2 border-glow shadow-[0_8px_24px_-10px_rgb(var(--glow)/.9)] hover:brightness-105',
  onbrand: 'bg-white/5 text-onbrand border border-onbrand/30 hover:bg-white/10',
  danger: 'bg-transparent text-bad border-2 border-bad hover:bg-bad/5',
  quiet: 'bg-sunk text-ink border border-transparent hover:bg-line/60'
};
const SIZE: Record<string, string> = { md: 'min-h-[3.4rem] px-5 text-[1rem] rounded-2xl', sm: 'min-h-[2.8rem] px-4 text-[.92rem] rounded-xl', lg: 'min-h-[3.8rem] px-6 text-[1.06rem] rounded-2xl' };
export function Button({ children, onClick, to, href, icon, iconRight, variant = 'primary', size = 'md', block, className, disabled, type = 'button', label, pressed }: BtnProps) {
  const nav = useNavigate();
  const cls = cx('inline-flex items-center justify-center gap-2 font-bold text-center select-none transition-[filter,background-color,border-color] duration-200 disabled:opacity-40 disabled:pointer-events-none [&_svg]:size-[1.2em] [&_svg]:shrink-0', VAR[variant], SIZE[size], block && 'w-full', className);
  if (href) return (
    <motion.a whileTap={{ scale: 0.97 }} className={cls} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{icon}{children}{iconRight}</motion.a>
  );
  return (
    <motion.button whileTap={{ scale: 0.97 }} type={type} disabled={disabled} aria-label={label} aria-pressed={pressed} className={cls}
      onClick={() => { if (onClick) onClick(); if (to) nav(to); }}>
      {icon}{children}{iconRight}
    </motion.button>
  );
}
export function IconButton({ children, onClick, label, className }: { children: React.ReactNode; onClick?: () => void; label: string; className?: string }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick} aria-label={label} title={label}
      className={cx('grid place-items-center size-12 rounded-full border border-line bg-surface text-ink hover:border-ink/30 [&_svg]:size-5', className)}>
      {children}
    </motion.button>
  );
}

/* ---------- Superficies ---------- */
export function Card({ children, className, onClick, to, tone = 'surface', pad = true }: { children: React.ReactNode; className?: string; onClick?: () => void; to?: string; tone?: 'surface' | 'sunk' | 'mint' | 'sky' | 'amber' | 'violet'; pad?: boolean }) {
  const nav = useNavigate();
  const interactive = !!(onClick || to);
  const toneCls = { surface: 'bg-surface border border-line', sunk: 'bg-sunk', mint: 'bg-mint', sky: 'bg-skysoft', amber: 'bg-ambersoft', violet: 'bg-violetsoft' }[tone];
  const cls = cx('rounded-xl2 text-left', toneCls, pad && 'p-5', interactive && 'cursor-pointer w-full block', tone === 'surface' && 'shadow-card', className);
  if (!interactive) return <div className={cls}>{children}</div>;
  return (
    <motion.button type="button" className={cls} whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={() => { onClick?.(); if (to) nav(to); }}>
      {children}
    </motion.button>
  );
}
export function Hero({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx('relative overflow-hidden rounded-xl3 hero-glow text-onbrand p-6 sm:p-7 shadow-lift', className)}>
      <div className="absolute inset-0 grain opacity-60 pointer-events-none" />
      <motion.img src={LOGO} alt="" aria-hidden className="absolute -right-10 -top-10 w-48 opacity-[.13] pointer-events-none"
        animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="relative">{children}</div>
    </div>
  );
}
export const Kicker = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cx('text-[.82rem] font-bold tracking-[.02em] text-accent', className)}>{children}</div>
);

/* ---------- Encabezado de página ---------- */
export function BackLink({ to, label = 'Volver' }: { to: string; label?: string }) {
  const nav = useNavigate();
  return (
    <button onClick={() => nav(to)} className="no-print inline-flex items-center gap-1 min-h-[2.8rem] -ml-1 pr-2 font-bold text-muted hover:text-ink">
      <ChevronLeft className="size-5" />{label}
    </button>
  );
}
export function PageHeader({ kicker, title, lead, back, right }: { kicker?: string; title: React.ReactNode; lead?: React.ReactNode; back?: { to: string; label?: string }; right?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-2">
      {back && <div className="flex items-center justify-between"><BackLink to={back.to} label={back.label} /><SavedMark /></div>}
      {kicker && <Kicker>{kicker}</Kicker>}
      {(title || right) && <div className="flex items-start justify-between gap-3">
        {title && <h1 className="text-[1.85rem] sm:text-[2.1rem]">{title}</h1>}{right}
      </div>}
      {lead && <p className="text-[1.05rem] text-muted max-w-[38rem]">{lead}</p>}
    </header>
  );
}
export function SavedMark() {
  const savedAt = useStoreSaved();
  const [show, setShow] = useState(false);
  useEffect(() => { if (!savedAt) return; setShow(true); const t = setTimeout(() => setShow(false), 1600); return () => clearTimeout(t); }, [savedAt]);
  return (
    <AnimatePresence>{show && (
      <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[.8rem] text-muted inline-flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-accent" />Guardado en este dispositivo
      </motion.span>)}
    </AnimatePresence>
  );
}
import { useStore } from '../store';
const useStoreSaved = () => useStore((s) => s.savedAt);

/* ---------- Campos ---------- */
export function Field({ label, hint, children, htmlFor, className }: { label?: React.ReactNode; hint?: React.ReactNode; children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-1.5 min-w-0', className)}>
      {label && <label htmlFor={htmlFor} className="font-bold text-[.95rem]">{label}</label>}
      {children}
      {hint && <p className="text-[.85rem] text-muted">{hint}</p>}
    </div>
  );
}
export function TextInput({ value, onChange, placeholder, id, numeric, decimal, className, label }: { value: string; onChange: (v: string) => void; placeholder?: string; id?: string; numeric?: boolean; decimal?: boolean; className?: string; label?: string }) {
  return <input id={id} type="text" aria-label={label} inputMode={numeric ? 'numeric' : decimal ? 'decimal' : undefined} autoComplete="off" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={className} />;
}
export function MoneyInput({ value, onChange, id, cur = '$', placeholder = '0', label }: { value: string; onChange: (v: string) => void; id?: string; cur?: string; placeholder?: string; label?: string }) {
  return (
    <div className="relative min-w-0">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted pointer-events-none">{cur}</span>
      <input id={id} type="text" aria-label={label} inputMode="decimal" autoComplete="off" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} className={cx('num font-bold', cur.length > 1 ? '!pl-14' : '!pl-9')} />
    </div>
  );
}
export function TextArea({ value, onChange, placeholder, id, rows, className, label }: { value: string; onChange: (v: string) => void; placeholder?: string; id?: string; rows?: number; className?: string; label?: string }) {
  return <textarea id={id} aria-label={label} value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={className} />;
}

/* ---------- Elecciones ---------- */
export function Chips({ options, value, onChange, multi }: { options: ReadonlyArray<readonly [string, string]>; value: string | string[]; onChange: (v: any) => void; multi?: boolean }) {
  type T = string;
  const sel = (k: T) => (multi ? (value as T[]).includes(k) : value === k);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([k, l]) => (
        <motion.button key={k} type="button" whileTap={{ scale: 0.95 }} aria-pressed={sel(k)}
          onClick={() => {
            if (multi) { const a = value as T[]; onChange(a.includes(k) ? a.filter((x) => x !== k) : [...a, k]); }
            else onChange(value === k ? '' : k);
          }}
          className={cx('min-h-[2.75rem] px-4 rounded-full border-2 font-bold text-[.92rem] transition-colors',
            sel(k) ? 'bg-ink text-bg border-ink' : 'bg-surface border-line hover:border-ink/30')}>
          {sel(k) && <Check className="inline size-4 -ml-1 mr-1 align-[-2px]" />}{l}
        </motion.button>
      ))}
    </div>
  );
}
export function Choices({ options, value, onChange, multi }: { options: { k: string; t: string; s?: string; icon?: React.ReactNode }[]; value: string | string[]; onChange: (v: any) => void; multi?: boolean }) {
  const sel = (k: string) => (multi ? (value as string[]).includes(k) : value === k);
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((o) => (
        <motion.button key={o.k} type="button" whileTap={{ scale: 0.985 }} aria-pressed={sel(o.k)}
          onClick={() => {
            if (multi) { const a = value as string[]; onChange(a.includes(o.k) ? a.filter((x) => x !== o.k) : [...a, o.k]); }
            else onChange(o.k);
          }}
          className={cx('flex items-center gap-4 w-full text-left min-h-[4rem] px-4 py-3 rounded-2xl border-2 transition-colors',
            sel(o.k) ? 'border-accent bg-mint' : 'border-line bg-surface hover:border-ink/25')}>
          {o.icon && <span className="grid place-items-center size-11 rounded-xl bg-sunk shrink-0 [&_svg]:size-6">{o.icon}</span>}
          <span className="flex-1 min-w-0"><span className="block font-bold text-[1.02rem]">{o.t}</span>{o.s && <span className="block text-[.88rem] text-muted">{o.s}</span>}</span>
          <span className={cx('grid place-items-center size-7 rounded-full border-2 shrink-0 transition-colors', sel(o.k) ? 'bg-accent border-accent text-onaccent' : 'border-line text-transparent')}>
            <Check className="size-4" strokeWidth={3} />
          </span>
        </motion.button>
      ))}
    </div>
  );
}

/* ---------- Progreso ---------- */
export function Progress({ value, max = 100, label, right, tone = 'accent', size = 'md' }: { value: number; max?: number; label?: React.ReactNode; right?: React.ReactNode; tone?: 'accent' | 'sky' | 'amber' | 'glow'; size?: 'md' | 'sm' }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const col = { accent: 'bg-accent', sky: 'bg-sky', amber: 'bg-amber', glow: 'bg-glow' }[tone];
  return (
    <div className="flex flex-col gap-1.5">
      {(label || right) && <div className="flex justify-between gap-3 text-[.95rem]"><b>{label}</b><span className="num text-muted">{right}</span></div>}
      <div className={cx('rounded-full bg-sunk overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5')} role="progressbar" aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100}>
        <motion.div className={cx('h-full rounded-full', col)} initial={{ width: 0 }} animate={{ width: pct * 100 + '%' }} transition={{ duration: 0.8, ease }} />
      </div>
    </div>
  );
}
export function Ring({ value, max = 100, size = 64, stroke = 7, children, tone = 'accent' }: { value: number; max?: number; size?: number; stroke?: number; children?: React.ReactNode; tone?: 'accent' | 'glow' | 'sky' }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const col = { accent: 'rgb(var(--accent))', glow: 'rgb(var(--glow))', sky: 'rgb(var(--sky))' }[tone];
  return (
    <div className="relative grid place-items-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct) }} transition={{ duration: 1.1, ease }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[.85rem] font-bold num">{children}</div>
    </div>
  );
}
export function CountUp({ value, format = (n: number) => String(Math.round(n)), className }: { value: number; format?: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const prev = useRef(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reduce) { el.textContent = format(value); prev.current = value; return; }
    const c = animate(prev.current, value, { duration: 0.9, ease, onUpdate: (v) => { el.textContent = format(v); } });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return <span ref={ref} className={cx('num', className)}>{format(value)}</span>;
}

/* ---------- Etiquetas y avisos ---------- */
export function Tag({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'ok' | 'warn' | 'sky' | 'amber' | 'violet' | 'bad' }) {
  const t = { neutral: 'bg-sunk text-muted', ok: 'bg-mint text-accent', warn: 'bg-warn text-warnink', sky: 'bg-skysoft text-sky', amber: 'bg-ambersoft text-amber', violet: 'bg-violetsoft text-violet', bad: 'bg-badsoft text-bad' }[tone];
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[.78rem] font-bold', t)}>{children}</span>;
}
export function Note({ children, tone = 'info', title }: { children: React.ReactNode; tone?: 'info' | 'warn' | 'good' | 'bad'; title?: React.ReactNode }) {
  const t = { info: ['bg-skysoft border-sky', <Info key="i" />], warn: ['bg-warn border-amber text-warnink', <AlertTriangle key="w" />], good: ['bg-mint border-accent', <CheckCircle2 key="g" />], bad: ['bg-badsoft border-bad', <AlertTriangle key="b" />] }[tone] as [string, React.ReactNode];
  return (
    <div className={cx('flex gap-3 rounded-2xl border-l-4 px-4 py-3.5 text-[.95rem]', t[0])}>
      <span className="mt-0.5 [&_svg]:size-5 shrink-0 opacity-80">{t[1]}</span>
      <div className="min-w-0 flex-1">{title && <b className="block mb-0.5">{title}</b>}{children}</div>
    </div>
  );
}
export function KV({ k, v, total, tone }: { k: React.ReactNode; v: React.ReactNode; total?: boolean; tone?: 'pos' | 'neg' }) {
  return (
    <div className={cx('flex justify-between items-baseline gap-4 py-2.5', total ? 'border-t-2 border-ink mt-1 pt-3.5 text-[1.1rem]' : 'border-b border-dashed border-line last:border-0')}>
      <span className="min-w-0">{k}</span>
      <b className={cx('num whitespace-nowrap', tone === 'pos' && 'text-accent', tone === 'neg' && 'text-bad')}>{v}</b>
    </div>
  );
}
export function Bullets({ items, ordered, className }: { items: React.ReactNode[]; ordered?: boolean; className?: string }) {
  const L = ordered ? 'ol' : 'ul';
  return (
    <L className={cx('flex flex-col gap-2 pl-5', ordered ? 'list-decimal' : 'list-disc', 'marker:text-muted', className)}>
      {items.map((x, i) => <li key={i} className="pl-1">{x}</li>)}
    </L>
  );
}

/* ---------- Filas de navegación y checklists ---------- */
export function RowLink({ to, onClick, icon, tone = 'mint', title, sub, right }: { to?: string; onClick?: () => void; icon: React.ReactNode; tone?: 'mint' | 'sky' | 'amber' | 'violet' | 'sunk'; title: React.ReactNode; sub?: React.ReactNode; right?: React.ReactNode }) {
  const nav = useNavigate();
  const t = { mint: 'bg-mint text-accent', sky: 'bg-skysoft text-sky', amber: 'bg-ambersoft text-amber', violet: 'bg-violetsoft text-violet', sunk: 'bg-sunk text-ink' }[tone];
  return (
    <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={() => { onClick?.(); if (to) nav(to); }}
      className="w-full flex items-center gap-4 text-left p-4 rounded-xl2 bg-surface border border-line shadow-card">
      <span className={cx('grid place-items-center size-12 rounded-2xl shrink-0 [&_svg]:size-6', t)}>{icon}</span>
      <span className="flex-1 min-w-0"><span className="block font-head text-[1.12rem] leading-tight">{title}</span>{sub && <span className="block text-[.88rem] text-muted mt-0.5">{sub}</span>}</span>
      {right ?? <ChevronRight className="size-5 text-muted shrink-0" />}
    </motion.button>
  );
}
export function CheckRow({ done, onToggle, children, sub, actions }: { done: boolean; onToggle: () => void; children: React.ReactNode; sub?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-line last:border-0">
      <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={onToggle} aria-pressed={done} aria-label={done ? 'Desmarcar' : 'Marcar como hecho'}
        className={cx('mt-0.5 grid place-items-center size-8 rounded-lg border-2 shrink-0 transition-colors', done ? 'bg-accent border-accent text-onaccent' : 'border-line bg-surface')}>
        <AnimatePresence>{done && (
          <motion.svg key="c" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }} transition={{ duration: 0.3 }} />
          </motion.svg>)}
        </AnimatePresence>
      </motion.button>
      <div className="flex-1 min-w-0">
        <div className={cx('transition-colors', done && 'text-muted line-through decoration-1')}>{children}</div>
        {sub && <div className="text-[.85rem] text-muted mt-0.5">{sub}</div>}
      </div>
      {actions}
    </div>
  );
}

/* ---------- Pestañas, desplegables ---------- */
export function Tabs<T extends string>({ tabs, value, onChange, id }: { tabs: [T, string][]; value: T; onChange: (v: T) => void; id: string }) {
  return (
    <div role="tablist" className="flex gap-1 p-1 rounded-2xl bg-sunk overflow-x-auto">
      {tabs.map(([k, l]) => (
        <button key={k} role="tab" aria-selected={value === k} onClick={() => onChange(k)}
          className={cx('relative flex-1 whitespace-nowrap min-h-[2.8rem] px-3.5 rounded-xl font-bold text-[.92rem] transition-colors', value === k ? 'text-ink' : 'text-muted hover:text-ink')}>
          {value === k && <motion.span layoutId={'tab-' + id} className="absolute inset-0 rounded-xl bg-surface shadow-card" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
          <span className="relative">{l}</span>
        </button>
      ))}
    </div>
  );
}
export function Disclosure({ title, children, defaultOpen = false, icon }: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl2 bg-surface border border-line shadow-card overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center gap-3 text-left px-5 min-h-[3.6rem] font-bold">
        {icon}<span className="flex-1">{title}</span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="text-muted"><ChevronRight className="size-5" /></motion.span>
      </button>
      <AnimatePresence initial={false}>{open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
          <div className="px-5 pb-5">{children}</div>
        </motion.div>)}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Voz ---------- */
export function ListenButton({ text, getText }: { text?: string; getText?: () => string }) {
  const voz = useD((d) => d.aj.voz);
  const [on, setOn] = useState(false);
  useEffect(() => () => stopSpeak(), []);
  if (!voz) return null;
  return (
    <button type="button" onClick={() => { if (on) { stopSpeak(); setOn(false); return; } speak(getText ? getText() : text || ''); setOn(true); setTimeout(() => setOn(false), 8000); }}
      className="no-print inline-flex items-center gap-2 self-start rounded-full bg-sunk px-4 min-h-[2.6rem] font-bold text-[.88rem] hover:bg-line/60">
      {on ? <Square className="size-4" /> : <Volume2 className="size-4" />}{on ? 'Detener' : 'Escuchar'}
    </button>
  );
}

/* ---------- Toasts ---------- */
export function Toaster() {
  const list = useToasts((s) => s.list);
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-28 lg:bottom-8 z-[60] flex flex-col items-center gap-2 pointer-events-none" aria-live="polite">
      <AnimatePresence>{list.map((t) => (
        <motion.div key={t.id} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
          className="rounded-full bg-ink text-bg px-5 py-3 font-bold text-[.95rem] shadow-lift max-w-[90vw] text-center">{t.msg}</motion.div>
      ))}</AnimatePresence>
    </div>
  );
}

/* ---------- Celebración ---------- */
export function Celebrate({ show }: { show: boolean }) {
  const reduce = useReducedMotion();
  if (!show || reduce) return null;
  const bits = Array.from({ length: 18 }, (_, i) => i);
  const cols = ['rgb(var(--glow))', 'rgb(var(--sky))', 'rgb(var(--amber))', 'rgb(var(--accent))', 'rgb(var(--violet))'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {bits.map((i) => {
        const a = (i / bits.length) * Math.PI * 2, d = 70 + (i % 4) * 22;
        return <motion.span key={i} className="absolute left-1/2 top-1/2 size-2.5 rounded-sm" style={{ background: cols[i % cols.length] }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 30, opacity: 0, rotate: 200 }} transition={{ duration: 1.1, ease: 'easeOut' }} />;
      })}
    </div>
  );
}

/* ---------- Marco de celular para simuladores ---------- */
export function PhoneFrame({ children, title, sub, className }: { children: React.ReactNode; title?: React.ReactNode; sub?: React.ReactNode; className?: string }) {
  return (
    <div className={cx('mx-auto w-full max-w-[22rem] rounded-[2.4rem] bg-ink p-2.5 shadow-lift', className)}>
      <div className="relative rounded-[1.9rem] overflow-hidden bg-bg min-h-[30rem] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-[.72rem] font-bold text-muted"><span>9:41</span><span className="h-5 w-24 rounded-full bg-ink/90 absolute left-1/2 -translate-x-1/2 top-2" /><span>100%</span></div>
        {title && <div className="flex items-center gap-3 px-4 py-2.5 border-b border-line bg-surface"><div className="min-w-0"><b className="block truncate">{title}</b>{sub && <span className="block text-[.75rem] text-muted truncate">{sub}</span>}</div></div>}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}

export const Divider = () => <hr className="border-0 border-t border-line my-1" />;
export const Legal = ({ children }: { children: React.ReactNode }) => <p className="text-[.8rem] text-muted border-t border-line pt-4 mt-4">{children}</p>;
export const Section = ({ title, children, right, className }: { title?: React.ReactNode; children: React.ReactNode; right?: React.ReactNode; className?: string }) => (
  <section className={cx('flex flex-col gap-3', className)}>
    {title && <div className="flex items-end justify-between gap-3"><h2 className="text-[1.35rem]">{title}</h2>{right}</div>}
    {children}
  </section>
);
