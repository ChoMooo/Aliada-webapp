/* ===== Contenido de los módulos educativos =====
   Los pasos son generales: los menús cambian según la marca, el modelo y la versión.
   Antes de vender, cada lección se prueba en al menos un Samsung, un Motorola y un iPhone,
   y se actualiza CONTENIDO_DIGITAL con la fecha de esa revisión. */
import { type Module, type Frame, F, S, home } from './shared';
import { WA } from './wa';
import { IA } from './ia';
import { PAY } from './pay';
import { GOOGLE } from './google';
import { REDES } from './redes';
import { CREAR } from './crear';
import { INV_MODULES } from './inv';

export type { Module, Lesson, Quiz, Frame, Section } from './shared';
export { INV_FECHA, INV_FUENTES } from './inv';
export const CONTENIDO_DIGITAL = { fecha: '2026-10-16', estado: 'borrador' as 'borrador' | 'verificado' };

export const ALL_MODULES: Module[] = [WA, IA, GOOGLE, REDES, CREAR, PAY, ...INV_MODULES];
export const MODULES: Module[] = ALL_MODULES.filter((m) => m.section === 'digital');
export const FIN_MODULES: Module[] = ALL_MODULES.filter((m) => m.section === 'finanzas');
export { INV_MODULES };
export const MOD = (id: string) => ALL_MODULES.find((m) => m.id === id);
export const SECTION_BASE: Record<string, string> = { finanzas: '/finanzas/m/', digital: '/digital/m/', inversiones: '/inversiones/m/' };
export const modPath = (m: Module) => SECTION_BASE[m.section] + m.id;
export const SOON = { id: 'aliada-ia', n: 'IA de Aliada Digital', desc: 'Una asistente propia de la app, que te responde con tu ritmo y tu forma de aprender.' };

/* ===== Primeros ajustes del celular ===== */
const set = (o: any = {}) => S('settings', o);
const L = (title: string, items: any[], hl: string, extra: any = {}) => set({ v: 'list', title, items, hl, ...extra });
export type SetupItem = { id: string; t: string; por: string; android: string; ios: string; samsung?: string; demo: Frame[] };
export const SETUP: SetupItem[] = [
  {
    id: 'letra', t: 'Letra más grande', por: 'Leer sin anteojos y sin esfuerzo.', android: 'Ajustes → Pantalla → Tamaño de fuente (o “Tamaño de pantalla y texto”).', samsung: 'En Samsung: Ajustes → Pantalla → Tamaño y estilo de fuente.', ios: 'Ajustes → Pantalla y brillo → Tamaño del texto. Para aún más grande: Accesibilidad → Pantalla y tamaño de texto → Texto más grande.',
    demo: [F(home('Ajustes'), 'Abrí los Ajustes del celular.'), F(set({ hl: 'pantalla' }), 'Entrá a «Pantalla».'), F(L('Pantalla', [{ t: 'Modo oscuro', tg: false }, { t: 'Brillo' }, { t: 'Tamaño y estilo de fuente', s: 'Predeterminado', blue: true }], 'r2'), 'Tocá «Tamaño de fuente».'), F(L('Tamaño y estilo de fuente', [{ t: 'Tamaño de fuente', slider: 80 }, { t: 'Negrita', tg: true }], 'r0', { preview: 16 }), 'Mové la barra hacia la derecha hasta que leas cómodo. Activar la negrita también ayuda.')]
  },
  {
    id: 'oscuro', t: 'Modo oscuro', por: 'Descansa la vista de noche y ahorra batería.', android: 'Ajustes → Pantalla → Modo oscuro (o “Tema oscuro”).', ios: 'Ajustes → Pantalla y brillo → Oscuro.',
    demo: [F(set({ hl: 'pantalla' }), 'En Ajustes, entrá a «Pantalla».'), F(L('Pantalla', [{ t: 'Modo oscuro', tg: true }, { t: 'Brillo' }, { t: 'Tamaño y estilo de fuente', s: 'Grande', blue: true }], 'r0'), 'Activá «Modo oscuro».')]
  },
  {
    id: 'leer', t: 'Que el celular te lea en voz alta', por: 'Escuchar mensajes y textos largos.', android: 'Ajustes → Accesibilidad → “Seleccionar para pronunciar” (el nombre puede variar según la marca).', ios: 'Ajustes → Accesibilidad → Contenido leído → activá “Leer selección”.',
    demo: [F(set({ hl: 'accesibilidad' }), 'En Ajustes, entrá a «Accesibilidad».'), F(L('Accesibilidad', [{ t: 'Seleccionar para pronunciar', s: 'Tocá un texto y el celular lo lee', tg: true }, { t: 'Mejoras de visibilidad' }, { t: 'Mejoras de audición' }], 'r0'), 'Activá «Seleccionar para pronunciar». El nombre puede variar según la marca.')]
  },
  {
    id: 'dictado', t: 'Dictar en vez de escribir', por: 'Escribir mensajes hablando.', android: 'En el teclado, tocá el micrófono y hablá. Si no aparece, revisá los ajustes de tu teclado.', ios: 'Ajustes → General → Teclado → activá “Dictado”. Después, tocá el micrófono del teclado.',
    demo: [F(S('wa', { v: 'chat', msgs: [{ t: '¿Venís el domingo?' }], kb: true, hl: 'kmic' }), 'En cualquier chat, tocá el micrófono del teclado.'), F(S('wa', { v: 'chat', msgs: [{ t: '¿Venís el domingo?' }], typing: 'Sí, llevo el postre', kb: true, hl: 'mic' }), 'Hablá y el celular escribe por vos. Después tocá enviar.', 'type')]
  },
  {
    id: 'bloqueo', t: 'Bloqueo de pantalla', por: 'Que nadie pueda usar tu celular si lo perdés.', android: 'Ajustes → Seguridad (o Seguridad y privacidad) → Bloqueo de pantalla. Elegí PIN o huella.', ios: 'Ajustes → Face ID y código (o Touch ID y código) → Activar código.',
    demo: [F(set({ hl: 'seguridad' }), 'En Ajustes, entrá a «Seguridad y privacidad».'), F(L('Seguridad y privacidad', [{ t: 'Bloqueo de pantalla', s: 'Ninguno', blue: true }, { t: 'Huellas digitales' }, { t: 'Reconocimiento facial' }], 'r0'), 'Tocá «Bloqueo de pantalla» y elegí un PIN que recuerdes. Después podés sumar la huella.')]
  },
  {
    id: 'buscar', t: 'Encontrar el celular si se pierde', por: 'Ubicarlo, hacerlo sonar o bloquearlo a distancia.', android: 'Ajustes → Google → “Encontrar mi dispositivo” (o en Seguridad). Activalo.', ios: 'Ajustes → tu nombre (arriba) → Buscar → Buscar mi iPhone. Activalo.',
    demo: [F(set({ hl: 'google' }), 'En Ajustes, entrá a «Google».'), F(L('Google', [{ t: 'Encontrar mi dispositivo', tg: true }, { t: 'Copia de seguridad' }, { t: 'Autocompletar' }], 'r0'), 'Activá «Encontrar mi dispositivo». Si lo perdés, entrás desde otro celular o compu a «Encontrar mi dispositivo» de Google.')]
  },
  {
    id: 'update', t: 'Actualizaciones al día', por: 'Las actualizaciones corrigen fallas y suman mejoras.', android: 'Ajustes → Sistema → Actualización de software (en Samsung: Ajustes → Actualización de software).', ios: 'Ajustes → General → Actualización de software.',
    demo: [F(set({ hl: 'update' }), 'En Ajustes, entrá a «Actualización de software».'), F(L('Actualización de software', [{ t: 'Descargar e instalar', s: 'Tu software está actualizado', blue: true }, { t: 'Descargar automáticamente por wifi', tg: true }], 'r1'), 'Dejá activada la descarga automática por wifi. Instalalas con el cargador puesto.')]
  }
];

/* ===== Encuesta de Mundo digital ===== */
export const DIAG_APPS: [string, string][] = [['wa', 'WhatsApp'], ['fb', 'Facebook'], ['ig', 'Instagram'], ['yt', 'YouTube'], ['tt', 'TikTok'], ['maps', 'Google Maps'], ['fotos', 'Google Fotos o iCloud'], ['ia', 'ChatGPT u otra IA'], ['canva', 'Canva o CapCut']];
export const DIAG_AREAS: [string, string][] = [['wa', 'WhatsApp'], ['ia', 'Inteligencia artificial'], ['google', 'Mapas, fotos y traductor'], ['redes', 'Redes sociales'], ['crear', 'Crear tarjetas y videos']];
export const NIVELES: [string, string][] = [['cuesta', 'Me cuesta'], ['defiendo', 'Me defiendo'], ['bien', 'Me manejo bien']];
export const METAS: [string, string][] = [['familia', 'Hablar más con la familia'], ['ia', 'Usar la inteligencia artificial'], ['fotos', 'Cuidar y ordenar mis fotos'], ['moverme', 'Moverme y viajar con el celular'], ['redes', 'Usar mejor las redes'], ['crear', 'Crear tarjetas y videos'], ['aprender', 'Aprender cosas nuevas'], ['proteger', 'Sentirme más seguro con el celular']];
export const MIEDOS: [string, string][] = [['tocar', 'Tocar algo y romper algo'], ['cuentas', 'Que me roben las cuentas'], ['fotos', 'Perder mis fotos'], ['privacidad', 'Que desconocidos vean mis datos'], ['nada', 'Nada en especial']];
export const RETOS = [
  { id: 'r1', area: 'wa', q: 'En un grupo de WhatsApp, ¿cómo respondés a un mensaje puntual para que se entienda a cuál contestás?', o: ['Lo deslizo hacia la derecha y respondo', 'Escribo en mayúsculas', 'Mando un audio largo'], c: 0 },
  { id: 'r2', area: 'redes', q: 'Publicás una foto en Facebook y querés que la vean solo tus amigos. ¿Qué tocás?', o: ['El público debajo de tu nombre y elijo “Amigos”', 'Nada, ya es privada', 'Le saco la foto'], c: 0 },
  { id: 'r3', area: 'ia', q: '¿Qué pedido le darías a una IA para que responda mejor?', o: ['“Receta”', '“Receta de cena para 2, sin sal, barata, en 5 pasos cortos”'], c: 1 },
  { id: 'r4', area: 'google', q: 'El celular está lleno. Antes de borrar fotos para hacer lugar, ¿qué confirmás?', o: ['Que tengan copia de seguridad', 'Nada, las borro', 'Que tenga batería'], c: 0 }
];

/* Textos de las preguntas de la encuesta (también se usan para generar los audios) */
export const DIAG_Q = {
  os: (det?: string | null) => ({ t: '¿Qué celular tenés?', h: det ? `Por lo que vemos, parece ${det === 'ios' ? 'un iPhone' : 'un Android'}. Confirmalo.` : 'Así te mostramos los pasos exactos para tu celular.' }),
  marca: { t: '¿De qué marca es?', h: 'En Android los menús cambian un poco según la marca.' },
  apps: { t: '¿Qué apps usás hoy?', h: 'Marcá todas las que uses, aunque sea poco.' },
  nivel: { t: '¿Cómo te llevás con cada tema?', h: 'Sin vueltas: así sabemos por dónde empezar.' },
  reto: (k: number) => ({ t: `Desafío ${k + 1} de ${RETOS.length}`, h: RETOS[k].q }),
  metas: { t: '¿Qué te gustaría lograr?', h: 'Elegí todo lo que quieras.' },
  miedos: { t: '¿Qué te preocupa del celular?', h: '' },
  aprende: { t: '¿Cómo preferís aprender?', h: '' }
};
