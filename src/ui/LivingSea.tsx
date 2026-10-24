/* Foto del mar "viva": la marea se mueve todo el tiempo con un shader WebGL muy liviano.
   Una máscara (mar-mask.png) dice qué partes son agua: el escritorio, la silla y el cielo quedan quietos.
   Si el dispositivo no tiene WebGL o pidió "reducir movimiento", queda la foto fija. */
import React, { useEffect, useRef, useState } from 'react';
import { cx } from './cx';

const VS = `attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }`;
const FS = `precision mediump float;
varying vec2 v;
uniform sampler2D uImg, uMask;
uniform float uT, uHz;
uniform vec4 uMap;
void main(){
  vec2 uv = v*uMap.xy + uMap.zw;
  float m = texture2D(uMask, uv).r;
  float d = clamp((uv.y-uHz)/(1.-uHz), 0., 1.);
  float z = 1./(d+.07);
  float sway = sin(uv.x*5. + uT*.35)*.9 + sin(uv.x*13. - uT*.6)*.35;
  float w1 = sin(z*5.2 + uT*1.05 + sway);
  float w2 = sin((uv.x*26. - uv.y*7.)*(.6+d) + uT*1.6 + w1*.6);
  float w3 = sin((uv.x*-19. - uv.y*11.)*(.7+d) + uT*1.25);
  float amp = (.15 + d*d*1.1) * m;
  vec2 off = vec2(w2*.0016 + w3*.0012, w1*.0042 + w2*.0012) * amp;
  vec3 c = texture2D(uImg, uv + off).rgb;
  float glint = smoothstep(.72, 1., w1*.55 + w2*.3 + w3*.25);
  c += vec3(.05, .06, .065) * glint * m * (.35 + d*.65);
  c *= 1. - .035*w1*m*d;
  gl_FragColor = vec4(c, 1.);
}`;

type Props = { src: string; srcSet?: string; mask: string; hz: number; className?: string; imgClass?: string; pos: [number, number]; posSm?: [number, number] };

export function LivingSea({ src, mask, hz, className, imgClass, pos, posSm }: Props) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = cv.current!;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false, powerPreference: 'low-power' }) as WebGLRenderingContext | null;
    if (!gl) return;
    let raf = 0, stop = false, visible = true, iw = 1, ih = 1, ready = 0, shown = false;
    const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const uT = U('uT'), uMap = U('uMap');
    gl.uniform1f(U('uHz'), hz); gl.uniform1i(U('uImg'), 0); gl.uniform1i(U('uMask'), 1);

    const tex = (unit: number, url: string, onload: (im: HTMLImageElement) => void) => {
      const t = gl.createTexture(); const im = new Image(); im.decoding = 'async';
      im.onload = () => {
        if (stop) return;
        gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
        onload(im); ready++; if (ready === 2) { fit(); loop(); }
      };
      im.src = url;
    };
    const big = canvas.clientWidth * Math.min(devicePixelRatio || 1, 2) > 1000;
    tex(0, big ? src.replace('-1000', '-1800') : src, (im) => { iw = im.naturalWidth; ih = im.naturalHeight; });
    tex(1, mask, () => {});

    /* Igual que object-fit: cover + object-position */
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      const cw = canvas.clientWidth, ch = canvas.clientHeight; if (!cw || !ch) return;
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr); gl.viewport(0, 0, canvas.width, canvas.height);
      const [px, py] = posSm && window.innerWidth >= 640 ? posSm : pos;
      const s = Math.max(cw / iw, ch / ih), dw = iw * s, dh = ih * s;
      const ox = (cw - dw) * px, oy = (ch - dh) * py;
      gl.uniform4f(uMap, cw / dw, ch / dh, -ox / dw, -oy / dh);
    };
    const t0 = performance.now(); let last = 0;
    const loop = () => {
      if (stop) return;
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const now = performance.now(); if (now - last < 1000 / 40) return; last = now; // ~40 cuadros por segundo alcanzan y cuidan la batería
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!shown) { shown = true; setLive(true); }
    };
    const ro = new ResizeObserver(() => ready === 2 && fit()); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
    return () => { stop = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('absolute inset-0', className)} aria-hidden>
      <img src={src} alt="" decoding="async" className={cx('absolute inset-0 size-full object-cover', imgClass)} />
      <canvas ref={cv} className={cx('absolute inset-0 size-full transition-opacity duration-700', live ? 'opacity-100' : 'opacity-0')} />
    </div>
  );
}
