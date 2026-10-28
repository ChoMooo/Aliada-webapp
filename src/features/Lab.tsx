/* Banco de pruebas de los componentes de React Bits (solo en desarrollo, no se publica) */
import React, { useState } from 'react';
import Aurora from '../ui/bits/Aurora/Aurora';
import Waves from '../ui/bits/Waves/Waves';
import Galaxy from '../ui/bits/Galaxy/Galaxy';
import SpotlightCard from '../ui/bits/SpotlightCard/SpotlightCard';
import GlassSurface from '../ui/bits/GlassSurface/GlassSurface';
import Counter from '../ui/bits/Counter/Counter';
import TiltedCard from '../ui/bits/TiltedCard/TiltedCard';
import BlurText from '../ui/bits/BlurText/BlurText';
import ShinyText from '../ui/bits/ShinyText/ShinyText';
import FlipCard from '../ui/bits/FlipCard/FlipCard';
import SpringCheck from '../ui/bits/SpringCheck/SpringCheck';
import HoldButton from '../ui/bits/HoldButton/HoldButton';
import StatusMark from '../ui/bits/StatusMark/StatusMark';
import ClickSpark from '../ui/bits/ClickSpark/ClickSpark';

const Box = ({ t, children, className = '' }: { t: string; children: React.ReactNode; className?: string }) => (
  <section className={'flex flex-col gap-2 ' + className}><b className="text-[.85rem] text-muted">{t}</b>{children}</section>
);

export default function Lab() {
  const only = new URLSearchParams(location.hash.split('?')[1] || '').get('solo');
  const show = (k: string) => !only || only === k;
  const [n, setN] = useState(210000);
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col gap-8 pb-20">
      {show('aurora') && <Box t="Aurora en tarjeta de noche">
        <div className="relative overflow-hidden rounded-xl3 hero-glow text-onbrand p-6 min-h-[14rem] isolate">
          <Aurora className="!absolute inset-0 -z-[1]" colorStops={['#1E4FD8', '#34D4A6', '#2650C4']} amplitude={0.9} blend={0.6} speed={0.5} opacity={0.75} mouseInteraction={false} />
          <h2 className="text-[1.6rem] text-onbrand">Cargá tus números</h2><p className="opacity-85">Aurora sobre la noche</p>
        </div>
      </Box>}
      {show('waves') && <Box t="Waves detrás de un encabezado">
        <div className="relative overflow-hidden rounded-xl3 border border-line h-48 isolate">
          <Waves className="!absolute inset-0 -z-[1]" lineColor="rgb(38 80 196 / .35)" accentColor="#34D4A6" spacing={12} amplitude={22} speed={0.4} mouseInteraction={false} clickRipple={false} lightMode />
          <h1 className="p-5 text-[2rem]">Finanzas</h1>
        </div>
      </Box>}
      {show('galaxy') && <Box t="Galaxy (bienvenida)">
        <div className="relative overflow-hidden rounded-xl3 bg-brand h-56 isolate">
          <Galaxy className="!absolute inset-0" starColors={['#ffffff', '#9fe8d2', '#a8c0ff']} density={0.8} glowIntensity={0.25} saturation={0.3} hueShift={200} speed={0.4} mouseInteraction={false} transparent />
          <h2 className="relative p-5 text-[1.6rem] text-onbrand">Tu experiencia, tus reglas</h2>
        </div>
      </Box>}
      <Box t="SpotlightCard">
        <SpotlightCard theme="light" spotlightColor="rgba(38,80,196,0.35)" className="rounded-xl2 border border-line bg-surface p-5">
          <b className="text-[1.2rem]">Finanzas</b><p className="text-muted">Te sobran $ 210.000 por mes</p>
        </SpotlightCard>
      </Box>
      <Box t="GlassSurface sobre el mar">
        <div className="relative h-64 rounded-xl3 overflow-hidden grid place-items-center" style={{ background: 'url(inicio/mar-1000.webp) center/cover' }}>
          <GlassSurface width={300} height={140} borderRadius={28} className="text-white">
            <div className="p-4 text-center"><b className="text-[1.2rem] text-white">Armá tu ruta</b><p className="text-white/85">Vidrio líquido</p></div>
          </GlassSurface>
        </div>
      </Box>
      <Box t="Counter">
        <div className="flex items-center gap-4"><Counter value={n} prefix="$ " locale="es-AR" fontSize={44} fontWeight={700} /><button className="border rounded px-3" onClick={() => setN(n + 12500)}>+</button></div>
      </Box>
      <Box t="TiltedCard (portada del libro)">
        <TiltedCard imageSrc="libro/portada.webp" altText="Portada" containerHeight={320} containerWidth={240} imageHeight={300} imageWidth={220} rotateAmplitude={10} scaleOnHover={1.04} showTooltip={false} />
      </Box>
      <Box t="BlurText"><BlurText text="Buenas noches, Marta" className="text-[2.1rem] font-bold" animateBy="words" delay={60} /></Box>
      <Box t="ShinyText"><ShinyText text="Tu próximo paso" className="text-[1.2rem] font-bold" color="#2650C4" shineColor="#9fe8d2" speed={3} /></Box>
      <Box t="FlipCard (glosario)">
        <FlipCard width={320} height={180} radius={18} background="rgb(var(--surface))" color="rgb(var(--ink))"
          front={<div className="p-5"><b className="text-[1.3rem]">Plazo fijo UVA</b><p className="text-muted">Tocá para ver qué es</p></div>}
          back={<div className="p-5"><p>Un plazo fijo que se ajusta por inflación y además paga un interés.</p></div>} />
      </Box>
      <Box t="SpringCheck"><SpringCheck label="Llevar el DNI" checked={ok} onChange={setOk} color="#2650C4" /></Box>
      <Box t="HoldButton"><HoldButton holdTime={1.6} backgroundColor="#b02626" fillColor="#7a1515" textColor="#fff" doneLabel="Borrado">Mantené apretado para borrar</HoldButton></Box>
      <Box t="StatusMark"><div className="flex gap-6"><StatusMark status="running" label="Guardando" /><StatusMark status="done" label="Listo" doneColor="#09765D" /></div></Box>
      <Box t="ClickSpark"><ClickSpark sparkColor={['#34D4A6', '#2650C4']}><button className="rounded-lg bg-accent text-onaccent px-5 py-3 font-bold">Terminé la lección</button></ClickSpark></Box>
    </div>
  );
}
