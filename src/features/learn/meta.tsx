import React from 'react';
import { MessageCircle, Sparkles, CreditCard, MapPin, Users, Palette, ShieldCheck } from 'lucide-react';
import type { Module } from '../../content/learn';

export const MOD_ICON: Record<string, React.ReactNode> = { wa: <MessageCircle />, ia: <Sparkles />, pay: <CreditCard />, google: <MapPin />, redes: <Users />, crear: <Palette />, escudo: <ShieldCheck /> };
export const TONE: Record<string, string> = { mint: 'bg-mint text-accent', sky: 'bg-skysoft text-sky', amber: 'bg-ambersoft text-amber', violet: 'bg-violetsoft text-violet' };
export const sectionOf = (m: Module) => (m.section === 'finanzas' ? { to: '/finanzas', label: 'Finanzas' } : { to: '/digital', label: 'Mundo digital' });
