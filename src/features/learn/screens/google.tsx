/* Google Maps, Fotos, Drive, Traductor, Lens y Calendar */
import React from 'react';
import { cx } from '../../../ui';
import { H, I, Pic, Avatar, BottomNav, Sheet, SearchPill, Keyboard } from './kit';

const GB = '#1a73e8';
/* ================= MAPS ================= */
function MapBg({ route, nav, dot = true, pin = true }: { route?: boolean; nav?: boolean; dot?: boolean; pin?: boolean }) {
  return (
    <div className={cx('absolute inset-0 overflow-hidden', nav ? 'bg-[#e9ecef]' : 'bg-[#f1f3f4]')}>
      <svg viewBox="0 0 280 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" style={nav ? { transform: 'perspective(400px) rotateX(35deg) scale(1.4)', transformOrigin: '50% 70%' } : undefined}>
        <rect x="150" y="300" width="110" height="90" rx="6" fill="#c8e6c9" /><rect x="10" y="120" width="80" height="70" rx="6" fill="#c8e6c9" />
        <path d="M-10 230 C 60 210, 120 250, 300 200" stroke="#aadaff" strokeWidth="18" fill="none" />
        {[60, 130, 200, 260].map((x) => <path key={x} d={`M${x} -10 L${x - 20} 540`} stroke="#fff" strokeWidth="7" />)}
        {[80, 170, 330, 420, 480].map((y) => <path key={y} d={`M-10 ${y} L300 ${y + 18}`} stroke="#fff" strokeWidth="7" />)}
        <path d="M-10 360 L300 330" stroke="#fde293" strokeWidth="10" />
        {route && <path d="M100 440 L95 352 L170 344 L178 250 L185 150" stroke={GB} strokeWidth="8" fill="none" strokeLinejoin="round" strokeLinecap="round" />}
        {route && <path d="M100 440 L95 352 L170 344 L178 250 L185 150" stroke="#8ab4f8" strokeWidth="3" fill="none" strokeLinejoin="round" />}
      </svg>
      {dot && <span className="absolute left-[36%] top-[83%] size-3.5 rounded-full bg-[#1a73e8] ring-[3px] ring-white shadow-[0_0_0_8px_rgba(26,115,232,.18)]" />}
      {pin && <span className="absolute left-[66%] top-[26%] -translate-x-1/2 -translate-y-full"><svg width="22" height="30" viewBox="0 0 22 30"><path d="M11 0C5 0 0 5 0 11c0 8 11 19 11 19s11-11 11-19C22 5 17 0 11 0z" fill="#ea4335" /><circle cx="11" cy="11" r="4" fill="#a50e0e" /></svg></span>}
    </div>
  );
}
const MAPS_NAV: [string, string][] = [['pin', 'Explorar'], ['nav', 'Ir'], ['save', 'Guardado'], ['plus', 'Contribuir'], ['bell', 'Novedades']];
function MapsExplore(s: any) {
  return (
    <div className="flex-1 relative flex flex-col min-h-0">
      <MapBg pin={!!s.pin} />
      <div className="relative p-2.5 flex flex-col gap-2">
        <div {...H(s, 'search', 'flex items-center gap-2 rounded-full bg-white h-10 px-3 shadow-md text-[10.5px]')}><I n="pin" className="size-4 text-[#ea4335]" /><span className={cx('flex-1 truncate', !s.q && 'text-[#5f6368]')}>{s.q || 'Buscá aquí'}</span><span {...H(s, 'mic', 'rounded-full p-0.5')}><I n="mic" className="size-4 text-[#5f6368]" /></span><span {...H(s, 'avatar', 'rounded-full')}><Avatar t="Marta" n={3} size={24} /></span></div>
        <div className="flex gap-1.5 overflow-hidden">{[['food', 'Restaurantes'], ['coffee', 'Cafeterías'], ['pill', 'Farmacias'], ['cart', 'Supermercados']].map(([ic, t], i) => <span key={t} {...H(s, 'chip' + i, 'flex items-center gap-1 rounded-full bg-white px-2.5 h-7 text-[9px] shadow whitespace-nowrap')}><I n={ic} className="size-3" />{t}</span>)}</div>
      </div>
      <div className="relative mt-auto flex justify-end p-2.5"><span {...H(s, 'locate', 'grid place-items-center size-10 rounded-full bg-white shadow-md')}><I n="nav" className="size-4 text-[#1a73e8]" /></span></div>
      {s.results ? <div className="relative bg-white rounded-t-2xl px-3 pt-2 pb-1 shadow-[0_-4px_14px_rgba(0,0,0,.15)]"><div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-[#dadce0]" />{s.results.map((r: any, i: number) => <div key={i} {...H(s, 'res' + i, 'flex gap-2.5 py-1.5 rounded-md')}><Pic n={r.p ?? 2} className="size-11 rounded-lg" /><span className="min-w-0"><b className="block text-[10.5px]">{r.t}</b><span className="block text-[8.5px] text-[#5f6368]">{r.r} ★ · {r.d}</span><span className="text-[8.5px] text-[#188038]">{r.o || 'Abierto'}</span></span></div>)}</div>
        : <div className="relative bg-white"><BottomNav s={s} active={s.tab ?? 0} items={MAPS_NAV} /></div>}
    </div>
  );
}
function MapsPlace(s: any) {
  const p = s.place || { t: 'Hospital Central', k: 'Hospital', r: '4,3', n: '1.284', d: '1,8 km', o: 'Abierto las 24 horas' };
  return (
    <div className="flex-1 relative flex flex-col min-h-0">
      <MapBg pin />
      <div className="relative p-2.5"><div className="flex items-center gap-2 rounded-full bg-white h-10 px-3 shadow-md text-[10.5px]"><I n="back" className="size-4" /><span className="flex-1 truncate">{p.t}</span><I n="x" className="size-4 text-[#5f6368]" /></div></div>
      <div className="relative mt-auto bg-white rounded-t-2xl px-3 pt-2 pb-2 shadow-[0_-4px_14px_rgba(0,0,0,.15)]">
        <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-[#dadce0]" />
        <b className="block text-[14px] text-[#202124]">{p.t}</b>
        <span className="block text-[9px] text-[#5f6368]">{p.r} <span className="text-[#fbbc04]">★★★★☆</span> ({p.n}) · {p.k} · {p.d}</span>
        <span className="block text-[9px] text-[#188038]">{p.o}</span>
        <div className="flex gap-1.5 mt-2 overflow-hidden">
          <span {...H(s, 'dir', 'flex items-center gap-1 rounded-full px-3 h-8 text-[9.5px] font-semibold text-white whitespace-nowrap')} style={{ background: GB }}><I n="nav" className="size-3.5" />Cómo llegar</span>
          {[['call', 'phone', 'Llamar'], ['save', 'save', 'Guardar'], ['share', 'share', 'Compartir']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex items-center gap-1 rounded-full bg-[#e8f0fe] px-2.5 h-8 text-[9.5px] font-semibold text-[#1967d2] whitespace-nowrap')}><I n={ic} className="size-3.5" />{t}</span>)}
        </div>
        <div className="flex gap-1 mt-2">{[6, 1, 3].map((n) => <Pic key={n} n={n} className="flex-1 h-14 rounded-lg" />)}</div>
        <div className="flex mt-2 border-b border-[#e8eaed] text-[9.5px]">{['Descripción', 'Opiniones', 'Información'].map((t, i) => <span key={t} {...H(s, 'tab' + i, cx('flex-1 text-center pb-1.5', i === (s.ptab ?? 0) ? 'text-[#1a73e8] border-b-2 border-[#1a73e8] font-semibold' : 'text-[#5f6368]'))}>{t}</span>)}</div>
      </div>
    </div>
  );
}
const MODES: [string, string, string][] = [['car', 'car', '15 min'], ['bus', 'bus', '32 min'], ['walk', 'walk', '48 min']];
function MapsRoute(s: any) {
  const mode = s.mode || 'car';
  return (
    <div className="flex-1 relative flex flex-col min-h-0">
      <MapBg route pin />
      <div className="relative bg-white px-2.5 pt-1.5 pb-2 shadow-md">
        <div className="flex items-center gap-2"><I n="back" className="size-4" /><div className="flex-1 flex flex-col gap-1"><span {...H(s, 'from', 'rounded-md border border-[#dadce0] px-2 h-7 grid items-center text-[9.5px]')}>Tu ubicación</span><span {...H(s, 'to', 'rounded-md border border-[#dadce0] px-2 h-7 grid items-center text-[9.5px]')}>{s.dest || 'Hospital Central'}</span></div><I n="repeat" className="size-4 rotate-90 text-[#5f6368]" /></div>
        <div className="flex gap-1.5 mt-2">{MODES.map(([id, ic, t]) => <span key={id} {...H(s, id, cx('flex items-center gap-1 rounded-full px-2.5 h-7 text-[9px] font-semibold', mode === id ? 'bg-[#e8f0fe] text-[#1967d2]' : 'text-[#3c4043]'))}><I n={ic} className="size-3.5" />{t}</span>)}</div>
      </div>
      {mode === 'bus' && s.transit ? (
        <div className="relative mt-auto bg-white rounded-t-2xl px-3 pt-2 pb-2 shadow-[0_-4px_14px_rgba(0,0,0,.15)]">
          <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-[#dadce0]" />
          {[['10:42 – 11:14', '32 min', ['60'], '5 min a pie'], ['10:50 – 11:27', '37 min', ['152', '29'], 'Combinación']].map(([h, d, ls, w], i) => (
            <div key={i} {...H(s, 'opt' + i, 'py-2 border-b border-[#f1f3f4] rounded-md')}><div className="flex justify-between"><b className="text-[10.5px]">{h}</b><b className="text-[10.5px]">{d}</b></div>
              <div className="flex items-center gap-1 mt-1"><I n="walk" className="size-3 text-[#5f6368]" />›{(ls as string[]).map((l) => <span key={l} className="flex items-center gap-0.5 rounded px-1 bg-[#e8f0fe] text-[8.5px] font-bold text-[#1967d2]"><I n="bus" className="size-2.5" />{l}</span>)}<span className="text-[8.5px] text-[#5f6368] ml-1">{w}</span></div></div>
          ))}
        </div>
      ) : (
        <div className="relative mt-auto bg-white rounded-t-2xl px-3 pt-2 pb-2 shadow-[0_-4px_14px_rgba(0,0,0,.15)]">
          <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-[#dadce0]" />
          <b className="text-[13px] text-[#188038]">{MODES.find((m) => m[0] === mode)?.[2]}</b> <span className="text-[10px] text-[#5f6368]">(6,2 km)</span>
          <span className="block text-[9px] text-[#5f6368]">Ruta más rápida según el tránsito actual</span>
          <div className="flex gap-1.5 mt-2"><span {...H(s, 'start', 'flex items-center gap-1 rounded-full px-4 h-8 text-[10px] font-semibold text-white')} style={{ background: GB }}><I n="nav" className="size-3.5" />Iniciar</span><span {...H(s, 'steps', 'flex items-center gap-1 rounded-full border border-[#dadce0] px-3 h-8 text-[10px] font-semibold text-[#1a73e8]')}><I n="list" className="size-3.5" />Pasos</span><span {...H(s, 'shareEta', 'flex items-center gap-1 rounded-full border border-[#dadce0] px-3 h-8 text-[10px] font-semibold text-[#1a73e8]')}><I n="share" className="size-3.5" /></span></div>
        </div>
      )}
    </div>
  );
}
function MapsNav(s: any) {
  return (
    <div className="flex-1 relative flex flex-col min-h-0">
      <MapBg route nav dot={false} pin={false} />
      <div className="relative m-2 rounded-xl bg-[#0f9d58] p-2.5 text-white flex gap-2 items-center shadow-lg"><span className="text-[22px] leading-none">↱</span><span><b className="block text-[13px]">150 m</b><span className="text-[10px]">Girá a la derecha en Av. San Martín</span></span></div>
      <span className="relative mx-auto mt-auto mb-3 size-5 rounded-full bg-[#1a73e8] ring-4 ring-white" />
      <div className="relative bg-white px-3 py-2.5 flex items-center gap-3 shadow-[0_-4px_14px_rgba(0,0,0,.15)]"><span {...H(s, 'exit', 'grid place-items-center size-8 rounded-full bg-[#f1f3f4]')}><I n="x" className="size-4" /></span><span className="flex-1 text-center"><b className="block text-[13px] text-[#188038]">14 min</b><span className="text-[9px] text-[#5f6368]">4,2 km · llegada 10:38</span></span><span {...H(s, 'sound', 'grid place-items-center size-8 rounded-full bg-[#f1f3f4]')}><I n="speaker" className="size-4" /></span></div>
    </div>
  );
}
export function Maps(s: any) {
  if (s.v === 'place') return MapsPlace(s);
  if (s.v === 'route') return MapsRoute(s);
  if (s.v === 'nav') return MapsNav(s);
  if (s.v === 'menu') return <Sheet s={s} base={MapsExplore({})} items={[{ t: 'Tu perfil', i: 'user' }, { t: 'Activar el modo incógnito', i: 'eye' }, { t: 'Compartir ubicación', i: 'users' }, { t: 'Tu cronología', i: 'clock' }, { t: 'Mapas sin conexión', i: 'download' }, { t: 'Configuración', i: 'settings' }]} />;
  if (s.v === 'share') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="text-[12px]">Compartir ubicación</b></div>
      <div className="px-3 text-[9.5px] text-[#5f6368]">Compartir tu ubicación en tiempo real</div>
      <div className="flex gap-1.5 px-3 py-2">{['Por 1 hora', 'Hasta que la desactives'].map((t, i) => <span key={t} {...H(s, 'time' + i, cx('rounded-lg border px-2.5 py-1.5 text-[9.5px]', (s.time ?? 0) === i ? 'border-[#1a73e8] bg-[#e8f0fe] text-[#1967d2]' : 'border-[#dadce0]'))}>{t}</span>)}</div>
      <div className="flex gap-3 px-3 py-2">{[['Hija', 0], ['Juan', 4], ['Ana', 5]].map(([t, n], i) => <span key={i} {...H(s, 'p' + i, 'flex flex-col items-center gap-1 rounded-lg')}><span className="relative"><Avatar t={t as string} n={n as number} size={40} />{s.pick === i && <span className="absolute -right-0.5 -bottom-0.5 grid place-items-center size-4 rounded-full bg-[#1a73e8] text-white"><I n="check" className="size-2.5" /></span>}</span><span className="text-[8.5px]">{t}</span></span>)}<span {...H(s, 'wa', 'flex flex-col items-center gap-1 rounded-lg')}><span className="grid place-items-center size-10 rounded-full bg-[#1daa61] text-white"><I n="comment" className="size-4" /></span><span className="text-[8.5px]">WhatsApp</span></span></div>
      <div className="flex-1" /><div className="p-3"><span {...H(s, 'ok', 'block rounded-full h-9 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: GB }}>Compartir</span></div>
    </div>);
  if (s.v === 'saved') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center px-3 h-11"><b className="flex-1 text-[14px]">Guardado</b><I n="search" className="size-4" /></div>
      <b className="px-3 text-[10.5px]">Tus listas</b>
      {[['heart', 'Favoritos', '6 lugares', '#d93025'], ['flag', 'Quiero ir', '3 lugares', '#188038'], ['star', 'Lugares destacados', '4 lugares', '#f9ab00'], ['home', 'Casa', 'Av. Siempre Viva 742', '#1a73e8']].map(([ic, t, d, c], i) => <div key={t} {...H(s, 'l' + i, 'flex items-center gap-3 px-3 py-2.5')}><span className="grid place-items-center size-8 rounded-full" style={{ background: c + '1f', color: c }}><I n={ic} className="size-4" /></span><span><b className="block text-[10.5px]">{t}</b><span className="text-[8.5px] text-[#5f6368]">{d}</span></span></div>)}
      <div className="flex-1" /><BottomNav s={s} active={2} items={MAPS_NAV} />
    </div>);
  return MapsExplore(s);
}

/* ================= GOOGLE FOTOS ================= */
const PH_NAV: [string, string][] = [['image', 'Fotos'], ['grid', 'Colecciones'], ['search', 'Buscar']];
function PhotosGrid(s: any) {
  const sel: number[] = s.sel || [];
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-2 px-3 h-10 shrink-0">{sel.length ? <><I n="x" className="size-4" /><b className="flex-1 text-[12px]">{sel.length} seleccionadas</b><span {...H(s, 'shareSel', 'rounded p-0.5')}><I n="share" className="size-4" /></span><span {...H(s, 'addSel', 'rounded p-0.5')}><I n="plus" className="size-4" /></span><I n="trash" className="size-4" /></> : <><b className="flex-1 text-[14px] text-[#202124]">Fotos</b><span {...H(s, 'create', 'rounded p-0.5')}><I n="plus" className="size-4" /></span><span {...H(s, 'avatar', 'relative rounded-full')}><Avatar t="Marta" n={3} size={26} ring={s.backing ? '#1a73e8' : undefined} />{s.off && <span className="absolute -right-1 -bottom-1 grid place-items-center size-3.5 rounded-full bg-[#f9ab00] text-white text-[7px] font-bold">!</span>}</span></>}</div>
      {s.banner && <div className="mx-2 mb-1.5 flex items-center gap-2 rounded-xl bg-[#e8f0fe] px-2.5 py-2 text-[9px] text-[#174ea6]"><I n="cloud" className="size-3.5" />{s.banner}</div>}
      <div className="flex-1 min-h-0 overflow-hidden">
        {[['Hoy', [1, 3, 0, 4]], ['Sábado 11 oct', [2, 6, 7, 5, 0, 3, 4, 1]]].map(([d, ps], gi) => (
          <div key={gi}><b className="block px-3 pt-1 pb-1 text-[10px] text-[#202124]">{d as string}</b>
            <div className="grid grid-cols-4 gap-0.5">{(ps as number[]).map((p, k) => { const idx = gi * 4 + k; return <div key={k} {...H(s, 'p' + idx, 'relative')}><Pic n={p} className="aspect-square" />{sel.includes(idx) && <span className="absolute inset-0 border-[3px] border-[#1a73e8]"><span className="absolute left-1 top-1 grid place-items-center size-3.5 rounded-full bg-[#1a73e8] text-white"><I n="check" className="size-2.5" /></span></span>}</div>; })}</div></div>
        ))}
      </div>
      <BottomNav s={s} active={s.tab ?? 0} items={PH_NAV} />
    </div>
  );
}
function PhotoView(s: any) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black text-white">
      <div className="flex items-center gap-3 px-3 h-10"><I n="back" className="size-4" /><span className="flex-1" /><I n="cloud" className="size-4" /><I n="more" className="size-4" /></div>
      <div className="flex-1 grid place-items-center"><Pic n={s.photo ?? 3} className="w-full aspect-[4/3]" /></div>
      <div className="flex justify-around py-2.5">{[['share', 'share', 'Compartir'], ['edit', 'sliders', 'Editar'], ['lens', 'scan', 'Lens'], ['del', 'trash', 'Eliminar']].map(([id, ic, t]) => <span key={id} {...H(s, id, 'flex flex-col items-center gap-0.5 text-[8.5px] rounded-lg px-1')}><I n={ic} className="size-4" />{t}</span>)}</div>
    </div>
  );
}
function PhotoEdit(s: any) {
  const tabs = ['Sugerencias', 'Recortar', 'Herramientas', 'Ajustar', 'Filtros'];
  const t = s.tool ?? 0;
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#1f1f1f] text-white">
      <div className="flex-1 grid place-items-center p-3"><div className="relative w-full"><Pic n={s.photo ?? 3} className={cx('w-full aspect-[4/3]', s.dark && 'brightness-[.55]', s.warm && 'saturate-150')} />{t === 1 && <span className="absolute inset-2 border-2 border-white"><span className="absolute -left-1 -top-1 size-3 border-l-4 border-t-4 border-white" /><span className="absolute -right-1 -bottom-1 size-3 border-r-4 border-b-4 border-white" /></span>}</div></div>
      <div className="flex gap-1.5 px-3 pb-2 overflow-hidden">{(t === 0 ? ['Mejorar', 'Dinámico', 'Cálido', 'Frío'] : t === 3 ? ['Brillo', 'Contraste', 'Luces', 'Sombras'] : t === 1 ? ['Rotar', 'Enderezar', 'Libre', '4:3'] : t === 2 ? ['Borrador mágico', 'Desenfoque', 'Enfoque'] : ['Vivid', 'Playa', 'Retro', 'Blanco y negro']).map((c, i) => <span key={c} {...H(s, 'opt' + i, cx('rounded-full px-2.5 h-7 grid place-items-center text-[9px] whitespace-nowrap', s.on === i ? 'bg-[#a8c7fa] text-[#062e6f]' : 'bg-white/10'))}>{c}</span>)}</div>
      {t === 3 && <div className="px-4 pb-2"><div className="h-1 rounded bg-white/25"><div className="h-full w-3/5 rounded bg-[#a8c7fa]" /></div></div>}
      <div className="flex justify-around px-1 pb-1 text-[8.5px]">{tabs.map((x, i) => <span key={x} {...H(s, 'tab' + i, cx('rounded px-1 py-1', i === t ? 'text-[#a8c7fa] font-semibold' : 'text-white/70'))}>{x}</span>)}</div>
      <div className="flex justify-between px-3 pb-2.5 pt-1"><span {...H(s, 'cancel', 'rounded-full px-3 h-7 grid place-items-center text-[9.5px]')}>Cancelar</span><span {...H(s, 'savecopy', 'rounded-full bg-[#a8c7fa] px-3 h-7 grid place-items-center text-[9.5px] font-semibold text-[#062e6f]')}>Guardar copia</span></div>
    </div>
  );
}
export function Photos(s: any) {
  if (s.v === 'account') return <Sheet s={s} base={PhotosGrid({})} items={[{ t: s.backup ? 'Copia de seguridad completa' : 'Activar copia de seguridad', i: 'cloud', sub: s.backup ? '2,1 GB de 15 GB usados' : 'Tus fotos quedan guardadas en tu cuenta de Google' }, { t: 'Liberar espacio', i: 'trash', sub: 'Borra del dispositivo lo que ya tiene copia' }, { t: 'Configuración de Fotos', i: 'settings' }, { t: 'Administrar tu cuenta de Google', i: 'user' }]} />;
  if (s.v === 'photo') return PhotoView(s);
  if (s.v === 'edit') return PhotoEdit(s);
  if (s.v === 'create') return <Sheet s={s} title="Crear" grid={4} base={PhotosGrid({})} items={[{ t: 'Álbum', i: 'images', c: '#1a73e8' }, { t: 'Collage', i: 'grid', c: '#e8710a' }, { t: 'Video destacado', i: 'film', c: '#d93025' }, { t: 'Animación', i: 'sparkles', c: '#188038' }]} />;
  if (s.v === 'add') return <Sheet s={s} title="Agregar a" base={PhotosGrid({ sel: [1, 3, 4] })} items={[{ t: 'Álbum compartido', i: 'users' }, { t: 'Álbum', i: 'images' }, { t: 'Collage', i: 'grid' }, { t: 'Archivo', i: 'archive' }]} />;
  if (s.v === 'search') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="px-3 pt-2"><SearchPill s={s} id="q" t={s.q} ph="Buscar en tus fotos" /></div>
      {s.q ? <div className="grid grid-cols-3 gap-0.5 mt-2">{[4, 4, 0, 4, 2, 4].map((p, i) => <Pic key={i} n={p} className="aspect-square" />)}</div> : <>
        <b className="px-3 mt-3 text-[10.5px]">Personas</b><div className="flex gap-3 px-3 py-2">{['Hija', 'Juan', 'Sofi', 'Carlos'].map((t, i) => <span key={t} className="flex flex-col items-center gap-1"><Avatar t={t} n={i} size={38} /><span className="text-[8.5px]">{t}</span></span>)}</div>
        <b className="px-3 mt-1 text-[10.5px]">Lugares</b><div className="grid grid-cols-3 gap-1.5 px-3 py-2">{[['Mendoza', 0], ['Mar del Plata', 1], ['Córdoba', 6]].map(([t, p]) => <span key={t as string}><Pic n={p as number} className="aspect-square rounded-lg" label={t as string} /></span>)}</div></>}
      <div className="flex-1" />{s.kb && <Keyboard s={s} />}
    </div>);
  if (s.v === 'album') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-10"><I n="back" className="size-4" /><span className="flex-1" /><span {...H(s, 'share', 'rounded p-0.5')}><I n="share" className="size-4" /></span><span {...H(s, 'more', 'rounded p-0.5')}><I n="more" className="size-4" /></span></div>
      <b className="px-3 text-[16px]">{s.title || 'Cumple 70 de Marta'}</b>
      <div className="flex items-center gap-1 px-3 py-1.5">{[0, 4, 5].map((n) => <Avatar key={n} t={"ABC"[n % 3]} n={n} size={20} />)}<span {...H(s, 'invite', 'ml-1 rounded-full border border-[#dadce0] px-2 h-6 grid place-items-center text-[9px] text-[#1a73e8]')}>+ Invitar</span></div>
      <div className="grid grid-cols-3 gap-0.5">{[3, 0, 4, 2, 6, 1].map((p, i) => <Pic key={i} n={p} className="aspect-square" />)}</div>
      <div className="flex-1" /><div className="p-3 flex justify-end"><span {...H(s, 'addPh', 'rounded-2xl bg-[#c2e7ff] px-3 h-10 grid place-items-center text-[10px] font-semibold text-[#001d35]')}>+ Agregar fotos</span></div>
    </div>);
  if (s.v === 'free') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="x" className="size-4" /><b className="text-[12px]">Liberar espacio</b></div>
      <div className="flex-1 grid place-items-center px-6 text-center"><div><I n="cloud" className="size-10 mx-auto text-[#1a73e8]" /><b className="block mt-2 text-[16px]">18,4 GB</b><p className="text-[10px] text-[#5f6368]">Se quitarán de este dispositivo 1.204 elementos que ya tienen copia de seguridad. Seguís viéndolos en Fotos.</p></div></div>
      <div className="p-3"><span {...H(s, 'ok', 'block rounded-full h-9 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: GB }}>Liberar 18,4 GB</span></div>
    </div>);
  return PhotosGrid(s);
}

/* ================= DRIVE ================= */
const DR_NAV: [string, string][] = [['home', 'Inicio'], ['star', 'Destacados'], ['users', 'Compartidos'], ['folder', 'Archivos']];
function DriveHome(s: any) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="px-3 pt-2 pb-1"><div {...H(s, 'search', 'flex items-center gap-2 rounded-full bg-[#e9eef6] h-10 px-3 text-[10.5px] text-[#444746]')}><I n="menu" className="size-4" /><span className="flex-1">Buscar en Drive</span><Avatar t="Marta" n={3} size={24} /></div></div>
      <div className="flex gap-1.5 px-3 py-1.5">{['Tipo', 'Personas', 'Modificado'].map((c) => <span key={c} className="rounded-lg border border-[#c4c7c5] px-2 h-6 grid place-items-center text-[8.5px]">{c} ▾</span>)}</div>
      <div className="flex-1 min-h-0 overflow-hidden">{(s.files || [['folder', 'Salud', 'Carpeta'], ['folder', 'Casa y servicios', 'Carpeta'], ['folder', 'Garantías', 'Carpeta'], ['doc', 'Receta presión - oct 2026.pdf', 'Hoy'], ['doc', 'Factura de luz septiembre.pdf', 'Ayer']]).map(([ic, t, d]: string[], i: number) => (
        <div key={i} {...H(s, 'f' + i, 'flex items-center gap-3 px-3 py-2')}><span className={cx('grid place-items-center size-8 rounded-md', ic === 'folder' ? 'text-[#5f6368]' : 'text-white bg-[#ea4335]')}><I n={ic} className={ic === 'folder' ? 'size-5 fill-[#5f6368]' : 'size-4'} /></span><span className="flex-1 min-w-0"><span className="block text-[10.5px] truncate">{t}</span><span className="text-[8.5px] text-[#5f6368]">{d}</span></span><span {...H(s, 'm' + i, 'rounded p-0.5')}><I n="more" className="size-4 text-[#5f6368]" /></span></div>
      ))}</div>
      <div className="relative"><span {...H(s, 'new', 'absolute right-3 -top-14 flex items-center gap-1.5 rounded-2xl bg-[#c2e7ff] px-4 h-12 text-[10.5px] font-semibold text-[#001d35] shadow-md')}><I n="plus" className="size-4" />Nuevo</span></div>
      <BottomNav s={s} active={s.tab ?? 3} items={DR_NAV} />
    </div>
  );
}
export function Drive(s: any) {
  if (s.v === 'new') return <Sheet s={s} title="Crear nuevo" grid={3} base={DriveHome({})} items={[{ t: 'Carpeta', i: 'folder', c: '#5f6368' }, { t: 'Subir', i: 'upload', c: '#5f6368' }, { t: 'Escanear', i: 'camera', c: '#5f6368' }, { t: 'Documentos', i: 'doc', c: '#4285f4' }, { t: 'Hojas de cálculo', i: 'grid', c: '#0f9d58' }, { t: 'Presentaciones', i: 'film', c: '#f4b400' }]} />;
  if (s.v === 'file') return <Sheet s={s} title={s.title || 'Receta presión - oct 2026.pdf'} base={DriveHome({})} items={[{ t: 'Compartir', i: 'users' }, { t: 'Enviar una copia', i: 'share' }, { t: 'Agregar a destacados', i: 'star' }, { t: 'Disponible sin conexión', i: 'download' }, { t: 'Cambiar nombre', i: 'pencil' }, { t: 'Mover', i: 'folder' }]} />;
  if (s.v === 'scan') return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-black text-white">
      <div className="relative flex items-center justify-between px-3 h-10"><I n="x" className="size-4" /><span className="text-[10px]">Automático</span><I n="sun" className="size-4" /></div>
      <div className="relative flex-1 grid place-items-center"><div className="relative w-[70%] aspect-[3/4] bg-[#f5f1e8] rotate-[-3deg] shadow-xl p-3 text-[#333]"><b className="block text-[9px]">Dr. López · Clínica médica</b>{[90, 70, 85, 60, 75, 50].map((w, i) => <span key={i} className="block h-1 my-1.5 rounded bg-[#999]" style={{ width: w + '%' }} />)}<span className="absolute -inset-1.5 border-[3px] border-[#4285f4] rounded" /></div></div>
      <div className="relative flex items-center justify-around pb-4 pt-2"><Pic n={3} className="size-9 rounded" /><span {...H(s, 'shot', 'grid place-items-center size-14 rounded-full border-4 border-white')}><span className="size-11 rounded-full bg-white" /></span><span className="size-9" /></div>
    </div>);
  if (s.v === 'save') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="x" className="size-4" /><b className="text-[12px]">Guardar en Drive</b></div>
      <div className="px-3"><span className="text-[9px] text-[#5f6368]">Título del documento</span><div {...H(s, 'name', 'mt-1 rounded-md border-2 border-[#1a73e8] px-2 h-9 grid items-center text-[11px]')}>{s.name || 'Escaneo 16-10-2026'}</div></div>
      <div {...H(s, 'folder', 'mx-3 mt-3 flex items-center gap-2 rounded-md border border-[#dadce0] px-2 h-10 text-[10.5px]')}><I n="folder" className="size-4 text-[#5f6368]" /><span className="flex-1">Carpeta: {s.folder || 'Mi unidad'}</span><I n="chev" className="size-3" /></div>
      <div className="flex-1" />{s.kb ? <Keyboard s={s} /> : <div className="p-3 flex justify-end"><span {...H(s, 'ok', 'rounded-full px-5 h-9 grid place-items-center text-[11px] font-semibold text-white')} style={{ background: GB }}>Guardar</span></div>}
    </div>);
  return DriveHome(s);
}

/* ================= TRADUCTOR ================= */
function LangBar(s: any, a = 'Español', b = 'Inglés') {
  return <div className="flex items-center gap-1.5 px-3 py-2"><span {...H(s, 'la', 'flex-1 rounded-full bg-[#e9eef6] h-8 grid place-items-center text-[10px] font-medium')}>{a}</span><span {...H(s, 'swap', 'grid place-items-center size-7 rounded-full')}><I n="transfer" className="size-4" /></span><span {...H(s, 'lb', 'flex-1 rounded-full bg-[#e9eef6] h-8 grid place-items-center text-[10px] font-medium')}>{b}</span></div>;
}
export function Translate(s: any) {
  if (s.v === 'conv') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex-1 flex flex-col justify-center gap-2 px-4 bg-[#f1f4f9] rotate-180"><span className="text-[9px] text-[#5f6368]">Inglés</span><b className="text-[15px] text-[#1a73e8]">{s.b || 'Where is the train station?'}</b></div>
      <div className="flex-1 flex flex-col justify-center gap-2 px-4"><span className="text-[9px] text-[#5f6368]">Español</span><b className="text-[15px]">{s.a || '¿Dónde queda la estación de tren?'}</b></div>
      <div className="flex items-center justify-around py-3 border-t border-[#e8eaed]">
        <span {...H(s, 'micA', 'flex flex-col items-center gap-1 rounded-xl')}><span className={cx('grid place-items-center size-12 rounded-full', s.listening === 'a' ? 'bg-[#d93025] text-white' : 'bg-[#c2e7ff] text-[#001d35]')}><I n="mic" className="size-5" /></span><span className="text-[8.5px]">Español</span></span>
        <span className="text-[9px] text-[#5f6368]">Automático</span>
        <span {...H(s, 'micB', 'flex flex-col items-center gap-1 rounded-xl')}><span className={cx('grid place-items-center size-12 rounded-full', s.listening === 'b' ? 'bg-[#d93025] text-white' : 'bg-[#c2e7ff] text-[#001d35]')}><I n="mic" className="size-5" /></span><span className="text-[8.5px]">Inglés</span></span>
      </div>
    </div>);
  if (s.v === 'camera') return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-black text-white">
      <div className="relative flex items-center justify-between px-3 h-10"><I n="x" className="size-4" /><span className="text-[10px]">Inglés → Español</span><I n="sun" className="size-4" /></div>
      <div className="relative flex-1 grid place-items-center"><div className="w-[78%] rounded bg-[#fdf8ef] p-3 text-[#3a2a1a] shadow-xl"><b className="block text-center text-[11px] tracking-widest">MENÚ</b>{[['Sopa del día', '$8'], ['Pollo asado con papas', '$14'], ['Ensalada de la casa', '$9'], ['Flan con dulce de leche', '$6']].map(([a, b]) => <div key={a} className="flex justify-between text-[9.5px] py-1 border-b border-dashed border-[#d9c9a8]"><span className="bg-white/90 px-0.5">{a}</span><span>{b}</span></div>)}</div></div>
      <div className="relative flex justify-around pb-3 pt-2 text-[9px]">{['Traducir', 'Buscar', 'Tarea'].map((t, i) => <span key={t} className={cx('rounded-full px-3 h-7 grid place-items-center', i === 0 ? 'bg-white text-black font-semibold' : 'bg-white/15')}>{t}</span>)}</div>
    </div>);
  if (s.v === 'offline') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="back" className="size-4" /><b className="text-[12px]">Idiomas descargados</b></div>
      {[['Español', true], ['Inglés', true], ['Italiano', false], ['Portugués', false], ['Francés', false]].map(([t, ok], i) => <div key={t as string} {...H(s, 'l' + i, 'flex items-center gap-3 px-3 py-2.5 text-[10.5px]')}><span className="flex-1">{t}</span>{ok ? <I n="check" className="size-4 text-[#188038]" /> : <I n="download" className="size-4 text-[#5f6368]" />}</div>)}
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-10"><I n="menu" className="size-4" /><b className="flex-1 text-center text-[12px]">Traductor</b><Avatar t="Marta" n={3} size={22} /></div>
      {LangBar(s)}
      <div className="flex-1 px-4 pt-2">{s.text ? <><p className="text-[15px]">{s.text}</p><div className="mt-3 rounded-2xl bg-[#e8f0fe] p-3"><span className="text-[9px] text-[#1967d2]">Inglés</span><p className="text-[15px] text-[#174ea6]">{s.result}</p><div className="flex gap-3 mt-2 text-[#1967d2]"><span {...H(s, 'speak', 'rounded p-0.5')}><I n="speaker" className="size-4" /></span><span {...H(s, 'copy', 'rounded p-0.5')}><I n="copy" className="size-4" /></span></div></div></> : <p {...H(s, 'input', 'text-[15px] text-[#80868b] rounded')}>Ingresar texto</p>}</div>
      {s.kb ? <Keyboard s={s} /> : <div className="flex items-end justify-around px-6 pb-5">
        <span {...H(s, 'conv', 'flex flex-col items-center gap-1 rounded-xl')}><span className="grid place-items-center size-10 rounded-full bg-[#e9eef6]"><I n="users" className="size-4" /></span><span className="text-[8.5px]">Conversación</span></span>
        <span {...H(s, 'mic', 'grid place-items-center size-16 rounded-full bg-[#c2e7ff]')}><I n="mic" className="size-6 text-[#001d35]" /></span>
        <span {...H(s, 'cam', 'flex flex-col items-center gap-1 rounded-xl')}><span className="grid place-items-center size-10 rounded-full bg-[#e9eef6]"><I n="camera" className="size-4" /></span><span className="text-[8.5px]">Cámara</span></span>
      </div>}
    </div>
  );
}

/* ================= GOOGLE (app y Lens) ================= */
export function Google(s: any) {
  if (s.v === 'lens') return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-black text-white">
      <div className="relative flex items-center justify-between px-3 h-10"><I n="x" className="size-4" /><b className="text-[11px]">Google Lens</b><I n="more" className="size-4" /></div>
      <div className="relative flex-1"><Pic n={s.photo ?? 4} className="absolute inset-0" /><span className="absolute inset-[18%] border-[3px] border-white/90 rounded-2xl" /></div>
      {s.results ? <div className="relative bg-white text-[#202124] rounded-t-2xl px-3 pt-2 pb-3"><div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-[#dadce0]" /><b className="text-[11px]">{s.results}</b><div className="grid grid-cols-3 gap-1.5 mt-1.5">{[4, 4, 1].map((p, i) => <div key={i} {...H(s, 'r' + i)}><Pic n={p} className="aspect-square rounded-lg" /><span className="block text-[8px] mt-0.5 truncate">{['Lavanda · Wikipedia', 'Cómo cuidar la lavanda', 'Vivero La Huerta'][i]}</span></div>)}</div></div>
        : <div className="relative flex justify-center gap-2 py-3 text-[9px]">{['Traducir', 'Buscar', 'Tarea'].map((t, i) => <span key={t} className={cx('rounded-full px-3 h-7 grid place-items-center', i === 1 ? 'bg-white text-black font-semibold' : 'bg-white/15')}>{t}</span>)}<span {...H(s, 'shot', 'absolute bottom-12 left-1/2 -translate-x-1/2 grid place-items-center size-12 rounded-full bg-white')}><I n="search" className="size-5 text-black" /></span></div>}
    </div>);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center justify-end px-3 h-10"><Avatar t="Marta" n={3} size={24} /></div>
      <b className="text-center text-[22px] tracking-tight mt-6 mb-4 text-[#4285f4]">Google</b>
      <div className="mx-3 flex items-center gap-2 rounded-full bg-[#eef0f3] h-10 px-3 text-[10.5px] text-[#5f6368]"><I n="search" className="size-4" /><span className="flex-1">Buscar</span><span {...H(s, 'mic', 'rounded-full p-0.5')}><I n="mic" className="size-4" /></span><span {...H(s, 'lens', 'rounded-full p-0.5')}><I n="camera" className="size-4" /></span></div>
      <div className="flex-1" />
    </div>
  );
}

/* ================= CALENDAR ================= */
export function Calendar(s: any) {
  if (s.v === 'new') return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-11"><I n="x" className="size-4" /><span className="flex-1" /><span {...H(s, 'save', 'rounded-full px-4 h-8 grid place-items-center text-[10.5px] font-semibold text-white')} style={{ background: GB }}>Guardar</span></div>
      <div {...H(s, 'title', 'mx-4 py-2 text-[16px] border-b border-[#e8eaed]')}>{s.title ? <span>{s.title}</span> : <span className="text-[#80868b]">Agregar título</span>}</div>
      {[['clock', 'Todo el día', ''], ['', 'Martes, 21 de octubre', '10:30'], ['', 'Martes, 21 de octubre', '11:00'], ['repeat', 'No se repite', ''], ['pin', 'Agregar ubicación', ''], ['bell', s.alert || '1 día antes', '']].map(([ic, t, h], i) => <div key={i} {...H(s, 'r' + i, 'flex items-center gap-3 px-4 py-2 text-[10.5px]')}><span className="w-4">{ic && <I n={ic} className="size-4 text-[#5f6368]" />}</span><span className="flex-1">{t}</span><span>{h}</span></div>)}
      <div className="flex-1" />{s.kb && <Keyboard s={s} />}
    </div>);
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex items-center gap-3 px-3 h-10"><I n="menu" className="size-4" /><b className="flex-1 text-[13px]">Octubre</b><I n="search" className="size-4" /><Avatar t="Marta" n={3} size={22} /></div>
      <div className="grid grid-cols-7 text-center text-[8px] text-[#5f6368] px-1">{['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="grid grid-cols-7 flex-1 px-1">{days.map((d, i) => <div key={i} {...H(s, 'd' + d, 'border-t border-[#f1f3f4] pt-0.5 text-center')}><span className={cx('inline-grid place-items-center size-4 rounded-full text-[8.5px]', d === 16 ? 'bg-[#1a73e8] text-white' : d < 1 || d > 31 ? 'text-[#bdc1c6]' : '')}>{d < 1 ? 30 + d : d > 31 ? d - 31 : d}</span>{[21, 9, 28].includes(d) && <span className="block mx-0.5 mt-0.5 rounded-sm bg-[#039be5] text-white text-[6px] truncate px-0.5">{d === 21 ? 'Dr. López' : d === 9 ? 'Cumple' : 'Pago'}</span>}</div>)}</div>
      <div className="relative"><span {...H(s, 'fab', 'absolute right-3 -top-14 grid place-items-center size-12 rounded-2xl bg-[#c2e7ff] shadow-md')}><I n="plus" className="size-5" /></span></div>
    </div>
  );
}
