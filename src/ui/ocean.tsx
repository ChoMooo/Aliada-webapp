/* El mismo océano en cada sección, cada vez más hondo:
   Inicio (superficie, foto con su propio movimiento) → Finanzas (recién bajo el agua) → Invertir (más hondo)
   → Digital (bien profundo) → Mi libro (el fondo, con arena).
   Las fotos se mueven con un shader WebGL liviano: la superficie ondula, los rayos de luz respiran y el agua se mece.
   Sin WebGL o con "reducir movimiento" queda la foto fija. Mi libro usa un video corto en bucle. */
import React, { useEffect, useRef, useState } from 'react';
import { cx } from './cx';
import { useAhorro } from '../lib/ahorro';
import { LivingSea } from './LivingSea';

export type Mar = 'finanzas' | 'invertir' | 'digital' | 'libro';

/* Cómo se mueve el agua en cada profundidad */
type Cfg = { surf: number; light: [number, number]; ray: number; flow: number; speed: number; pos: string };
const CFG: Record<Exclude<Mar, 'libro'>, Cfg> = {
  finanzas: { surf: 0.44, light: [0.66, -0.02], ray: 0.11, flow: 0.55, speed: 1, pos: '62% 30%' },
  invertir: { surf: 0.07, light: [0.62, -0.1], ray: 0.13, flow: 0.45, speed: 0.65, pos: '60% 20%' },
  digital: { surf: 0, light: [0.6, -0.25], ray: 0.16, flow: 0.5, speed: 0.5, pos: '60% 15%' }
};

const VS = `attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }`;
const FS = `precision mediump float;
varying vec2 v;
uniform sampler2D uImg;
uniform float uT, uSurf, uRay, uFlow;
uniform vec2 uLight;
uniform vec4 uMap;
void main(){
  vec2 uv = v*uMap.xy + uMap.zw;
  float t = uT;
  /* superficie: ondas que avanzan (solo arriba) */
  float s = uSurf > 0. ? 1. - smoothstep(uSurf*.5, uSurf, uv.y) : 0.;
  float a1 = sin(uv.x*22. + t*1.3 + sin(uv.y*40. - t*.9)*1.2);
  float a2 = sin(uv.x*-14. + uv.y*31. + t*1.05);
  float a3 = sin((uv.x + uv.y)*9. - t*.7);
  vec2 off = vec2(a1*.0022 + a3*.0012, a2*.0034 + a1*.0012) * s;
  /* el agua entera se mece despacio */
  off += vec2(sin(uv.y*5. + t*.35)*.0011, sin(uv.x*4. + t*.28)*.0014) * uFlow;
  vec3 c = texture2D(uImg, clamp(uv + off, .001, .999)).rgb;
  /* rayos de luz: su brillo cambia despacio a lo largo del ángulo desde el sol */
  vec2 d = uv - uLight; float ang = atan(d.x, d.y*1.8);
  float r = sin(ang*38. + t*.55)*.5 + sin(ang*23. - t*.38)*.35 + sin(ang*61. + t*.9)*.15;
  float lum = dot(c, vec3(.299, .587, .114));
  c *= 1. + uRay * r * smoothstep(.08, .5, lum) * (1. - s*.6);
  /* destellos de sol en la superficie */
  float g = smoothstep(.8, 1., a1*.5 + a2*.35 + a3*.25) * s;
  c += vec3(.10, .12, .13) * g * smoothstep(.35, .8, lum);
  gl_FragColor = vec4(c, 1.);
}`;

function reduceMotion() { return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; }

/** Foto del mar que se mueve (Finanzas, Invertir, Digital) */
export function OceanLive({ mar, className }: { mar: Exclude<Mar, 'libro'>; className?: string }) {
  const cfg = CFG[mar];
  const cv = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const bat = useAhorro();
  const small = `mar/${mar}-1280.webp`, big = `mar/${mar}-1920.webp`;

  useEffect(() => {
    if (bat) { setLive(false); return; }
    let cleanup: void | (() => void);
    try { cleanup = start(); } catch (e) { console.warn('[mar] sin animación:', e); }
    return () => { try { cleanup && cleanup(); } catch { /* */ } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mar, bat]);

  function start(): void | (() => void) {
    const canvas = cv.current;
    if (!canvas || reduceMotion() || typeof ResizeObserver === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }) as WebGLRenderingContext | null;
    if (!gl) return;
    let raf = 0, stop = false, visible = true, iw = 1, ih = 1, ready = false, shown = false;
    const sh = (k: number, s: string) => { const o = gl.createShader(k)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const uT = U('uT'), uMap = U('uMap');
    gl.uniform1i(U('uImg'), 0); gl.uniform1f(U('uSurf'), cfg.surf); gl.uniform1f(U('uRay'), cfg.ray); gl.uniform1f(U('uFlow'), cfg.flow);
    gl.uniform2f(U('uLight'), cfg.light[0], cfg.light[1]);

    const [px, py] = cfg.pos.split(' ').map((x) => parseFloat(x) / 100);
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      const cw = canvas.clientWidth, ch = canvas.clientHeight; if (!cw || !ch) return;
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr); gl.viewport(0, 0, canvas.width, canvas.height);
      const s = Math.max(cw / iw, ch / ih), dw = iw * s, dh = ih * s;
      gl.uniform4f(uMap, cw / dw, ch / dh, -((cw - dw) * px) / dw, -((ch - dh) * py) / dh);
    };
    const im = new Image(); im.decoding = 'async';
    im.onload = () => {
      if (stop) return;
      try {
        const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
        iw = im.naturalWidth; ih = im.naturalHeight; ready = true; fit(); loop();
      } catch (e) { stop = true; console.warn('[mar] sin animación:', e); }
    };
    im.src = canvas.clientWidth * Math.min(devicePixelRatio || 1, 2) > 1100 ? big : small;

    const t0 = performance.now(); let last = 0;
    const loop = () => {
      if (stop) return;
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const now = performance.now(); if (now - last < 1000 / 40) return; last = now; // ~40 cuadros por segundo cuidan la batería
      try { gl.uniform1f(uT, ((now - t0) / 1000) * cfg.speed); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); } catch { stop = true; return; }
      if (!shown) { shown = true; setLive(true); }
    };
    const ro = new ResizeObserver(() => ready && fit()); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
    return () => {
      stop = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      /* en desarrollo React monta dos veces: solo se suelta el contexto si el lienzo ya no está en la página */
      setTimeout(() => { if (!canvas.isConnected) gl.getExtension('WEBGL_lose_context')?.loseContext(); }, 0);
    };
  }

  return (
    <div className={cx('absolute inset-0', className)} aria-hidden>
      <img src={small} srcSet={`${small} 1280w, ${big} 1920w`} sizes="100vw" alt="" decoding="async" className="absolute inset-0 size-full object-cover" style={{ objectPosition: cfg.pos }} />
      <canvas ref={cv} className={cx('absolute inset-0 size-full transition-opacity duration-700', live ? 'opacity-100' : 'opacity-0')} />
    </div>
  );
}

/** El fondo con arena: video corto en bucle (sin sonido); con "reducir movimiento" queda el cuadro fijo */
export function OceanFloor({ className }: { className?: string }) {
  const bat = useAhorro();
  const still = bat || reduceMotion();
  return (
    <div className={cx('absolute inset-0', className)} aria-hidden>
      {still ? <img src="mar/libro.webp" alt="" className="absolute inset-0 size-full object-cover" />
        : <video src="mar/libro.mp4" poster="mar/libro.webp" autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />}
    </div>
  );
}

/** El mar del Inicio (la superficie), con su propio movimiento; para fondos de pantalla completa */
export function HomeSea({ className, hero }: { className?: string; hero?: boolean }) {
  /* en un encabezado (más ancho que alto) se corre a la izquierda para que no asome el escritorio */
  if (hero) return <LivingSea src="inicio/mar-1000.webp" mask="inicio/mar-mask.png" hz={0.292} pos={[0, 0.55]} posSm={[0, 0.6]} imgClass="object-[0%_55%] sm:object-[0%_60%]" className={className} />;
  return <LivingSea src="inicio/mar-1000.webp" mask="inicio/mar-mask.png" hz={0.292} pos={[0.16, 0.5]} posSm={[1, 0.6]} imgClass="object-[16%_50%] sm:object-[100%_60%]" className={className} />;
}

/** Encabezado de sección con el mar a todo el ancho y el título abajo, sobre un degradado que lo hace legible.
    "inicio" usa el mar del Inicio (para lo que vive en el Inicio, como las misiones) */
export function OceanHero({ mar, children, className, height = 'min-h-[21rem] sm:min-h-[24rem]' }: { mar: Mar | 'inicio'; children?: React.ReactNode; className?: string; height?: string }) {
  return (
    <section className={cx('relative isolate overflow-hidden -mx-4 sm:-mx-6 lg:mx-0 lg:rounded-[1.75rem] -mt-5 lg:mt-0 text-white flex flex-col justify-end bg-[#0a2a52]', height, className)}>
      <div className="absolute inset-0 -z-[2]">{mar === 'libro' ? <OceanFloor /> : mar === 'inicio' ? <HomeSea hero /> : <OceanLive mar={mar} />}</div>
      <div className="absolute inset-0 -z-[1] bg-[linear-gradient(180deg,rgb(4_14_34/.18)_0%,rgb(4_14_34/0)_30%,rgb(4_14_34/.35)_62%,rgb(4_14_34/.88)_100%)]" aria-hidden />
      <div className="px-4 sm:px-8 pt-24 pb-7 sm:pb-9">{children}</div>
    </section>
  );
}
