/* Pantallas de celular dibujadas por código para los mini videos y las miniaturas.
   Reproducen la disposición de cada app (pestañas, botones, colores) sin usar logos oficiales. */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cx } from '../../ui';
import { StatusBar, Dialog } from './screens/kit';
import { WhatsApp, YouTube, Facebook, Instagram, TikTok } from './screens/social';
import { Maps, Photos, Drive, Translate, Google, Calendar } from './screens/google';
import { AI, Wallet, MercadoLibre, Broker, Crypto, Canva, CapCut, Settings, Phone } from './screens/more';

export type Screen = { app: string; v?: string; hl?: string; dialog?: { title: string; text?: string; ok?: string; cancel?: string; icon?: string }; [k: string]: any };
export type Frame = { s: Screen; cap: string; act?: 'tap' | 'hold' | 'up' | 'left' | 'type' };

const APPS: Record<string, (s: any) => JSX.Element> = {
  wa: WhatsApp, yt: YouTube, fb: Facebook, ig: Instagram, tt: TikTok, maps: Maps, photos: Photos, drive: Drive, translate: Translate,
  google: Google, calendar: Calendar, ai: AI, wallet: Wallet, ml: MercadoLibre, broker: Broker, crypto: Crypto, canva: Canva, capcut: CapCut,
  settings: Settings, phone: Phone
};
const DARK = (s: Screen) => (s.app === 'tt' && s.v !== 'list') || s.app === 'capcut' || (s.app === 'photos' && (s.v === 'photo' || s.v === 'edit')) || (s.app === 'wa' && s.v === 'call') || ['scan', 'camera', 'lens'].includes(s.v || '') || (s.app === 'ig' && (s.v === 'new' || s.v === 'story'));
const BAR_BG: Record<string, string> = { ml: '#ffe600', broker: '#0b2a4a', crypto: '#6d28d9', settings: '#f6f6f8', phone: '#3a5a7a', claude: '#faf9f5' };

function Body({ s }: { s: Screen }) {
  const R = APPS[s.app] || Phone;
  const inner = R(s.dialog ? { ...s, hl: undefined } : s);
  return s.dialog ? <Dialog s={s} base={inner} {...s.dialog} /> : inner;
}

export function PhoneScreen({ frame, width = 280, animateFinger = true, className }: { frame: Frame; width?: number; animateFinger?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  const reduce = useReducedMotion();
  const scale = width / 280;
  const s = frame.s, dark = DARK(s);
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
        <div className="w-[280px] h-[580px] rounded-[36px] bg-[#101113] p-[8px] shadow-[0_22px_44px_-16px_rgba(0,0,0,.5),inset_0_0_0_1.5px_#2a2c30]">
          <div ref={ref} className="relative w-full h-full rounded-[29px] overflow-hidden bg-white text-[#1f1f1f] [color-scheme:light] flex flex-col antialiased" style={{ fontFamily: "Roboto, 'Public Sans', system-ui, sans-serif" }}>
            <StatusBar dark={dark} light={['broker', 'crypto', 'phone'].includes(s.app) && !s.v?.match(/store/)} bg={dark ? '#000' : BAR_BG[s.app === 'ai' && s.name === 'Claude' ? 'claude' : s.app]} />
            <div className="flex-1 flex flex-col min-h-0">{Body({ s })}</div>
            <div className={cx('h-4 shrink-0 grid place-items-center', dark ? 'bg-black' : 'bg-white')}><span className={cx('w-20 h-1 rounded-full', dark ? 'bg-white/70' : 'bg-black/70')} /></div>
            {pt && (
              <motion.div className="absolute z-30 pointer-events-none" initial={animateFinger && !reduce ? { x: pt.x + 40, y: pt.y + 70, opacity: 0 } : { x: pt.x, y: pt.y, opacity: 1 }}
                animate={{ x: act === 'left' ? [pt.x, pt.x - 60] : pt.x, y: act === 'up' ? [pt.y, pt.y - 50] : pt.y, opacity: 1 }}
                transition={{ duration: act === 'left' || act === 'up' ? 1.2 : 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} key={JSON.stringify(pt) + act}>
                <motion.span className="absolute -left-5 -top-5 size-10 rounded-full bg-[#00E091]/30 border-2 border-[#00E091]"
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
