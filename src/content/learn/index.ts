/* ===== Contenido de los módulos educativos =====
   Los pasos son generales: los menús cambian según la marca, el modelo y la versión.
   Antes de vender, cada lección se prueba en al menos un Samsung, un Motorola y un iPhone,
   y se actualiza CONTENIDO_DIGITAL con la fecha de esa revisión. */
import { type Module, type Frame, F, home, list } from './shared';
import { WA } from './wa';
import { IA } from './ia';
import { PAY } from './pay';
import { GOOGLE } from './google';
import { REDES } from './redes';
import { CREAR } from './crear';

export type { Module, Lesson, Quiz, Frame } from './shared';
export const CONTENIDO_DIGITAL = { fecha: '2026-10-16', estado: 'borrador' as 'borrador' | 'verificado' };

export const ALL_MODULES: Module[] = [WA, IA, GOOGLE, REDES, CREAR, PAY];
/* Mundo digital (Plata en el celular vive en Finanzas) */
export const MODULES: Module[] = ALL_MODULES.filter((m) => m.section === 'digital');
export const FIN_MODULES: Module[] = ALL_MODULES.filter((m) => m.section === 'finanzas');
export const MOD = (id: string) => ALL_MODULES.find((m) => m.id === id);
export const modPath = (m: Module) => (m.section === 'finanzas' ? '/finanzas/m/' : '/digital/m/') + m.id;
export const SOON = { id: 'aliada-ia', n: 'IA de Aliada Digital', desc: 'Una asistente propia, pensada para jubilados, que te responde dentro de la app.' };

/* ===== Primeros ajustes del celular ===== */
const aj = (items: any[], hl: number, title = 'Ajustes') => list(title, items, hl, title !== 'Ajustes');
const AJ = [{ t: 'Conexiones', i: 'wifi' }, { t: 'Pantalla', i: 'luz' }, { t: 'Accesibilidad', i: 'persona' }, { t: 'Seguridad y privacidad', i: 'candado' }, { t: 'Google', i: 'web' }, { t: 'Sistema', i: 'cel' }];
export type SetupItem = { id: string; t: string; por: string; android: string; ios: string; samsung?: string; demo: Frame[] };
export const SETUP: SetupItem[] = [
  {
    id: 'letra', t: 'Letra más grande', por: 'Leer sin anteojos y sin esfuerzo.', android: 'Ajustes → Pantalla → Tamaño de fuente (o “Tamaño de pantalla y texto”).', samsung: 'En Samsung: Ajustes → Pantalla → Tamaño y estilo de fuente.', ios: 'Ajustes → Pantalla y brillo → Tamaño del texto. Para aún más grande: Accesibilidad → Pantalla y tamaño de texto → Texto más grande.',
    demo: [F(home('Ajustes'), 'Abrí los Ajustes del celular.'), F(aj(AJ, 1), 'Entrá a «Pantalla».'), F(aj([{ t: 'Brillo', i: 'luz' }, { t: 'Tema oscuro', toggle: true }, { t: 'Tamaño de fuente', s: 'Predeterminado', i: 'texto' }], 2, 'Pantalla'), 'Tocá «Tamaño de fuente» y mové la barra hasta que leas cómodo.')]
  },
  {
    id: 'oscuro', t: 'Modo oscuro o más contraste', por: 'Descansa la vista y ahorra batería.', android: 'Ajustes → Pantalla → Tema oscuro (o “Modo oscuro”).', ios: 'Ajustes → Pantalla y brillo → Oscuro.',
    demo: [F(aj(AJ, 1), 'En Ajustes, entrá a «Pantalla».'), F(aj([{ t: 'Brillo', i: 'luz' }, { t: 'Tema oscuro', toggle: true, on: true }, { t: 'Tamaño de fuente', i: 'texto' }], 1, 'Pantalla'), 'Activá «Tema oscuro».')]
  },
  {
    id: 'leer', t: 'Que el celular te lea en voz alta', por: 'Escuchar mensajes y textos largos.', android: 'Ajustes → Accesibilidad → “Seleccionar para pronunciar” (el nombre puede variar según la marca).', ios: 'Ajustes → Accesibilidad → Contenido leído → activá “Leer selección”.',
    demo: [F(aj(AJ, 2), 'En Ajustes, entrá a «Accesibilidad».'), F(aj([{ t: 'Seleccionar para pronunciar', s: 'Tocá un texto y el celular lo lee', toggle: true, on: true }, { t: 'Texto en alto contraste', toggle: true }], 0, 'Accesibilidad'), 'Activá «Seleccionar para pronunciar». El nombre puede variar según la marca.')]
  },
  {
    id: 'dictado', t: 'Dictar en vez de escribir', por: 'Escribir mensajes hablando.', android: 'En el teclado, tocá el micrófono y hablá. Si no aparece, revisá los ajustes de tu teclado.', ios: 'Ajustes → General → Teclado → activá “Dictado”. Después, tocá el micrófono del teclado.',
    demo: [F({ k: 'chat', title: 'Hija', msgs: [{ t: '¿Venís el domingo?' }], typing: 'Sí, llevo el postre', hl: 'mic' }, 'En cualquier chat, tocá el micrófono del teclado y hablá: el celular escribe por vos.', 'type')]
  },
  {
    id: 'bloqueo', t: 'Bloqueo de pantalla', por: 'Que nadie pueda usar tu celular si lo perdés.', android: 'Ajustes → Seguridad (o Seguridad y privacidad) → Bloqueo de pantalla. Elegí PIN o huella.', ios: 'Ajustes → Face ID y código (o Touch ID y código) → Activar código.',
    demo: [F(aj(AJ, 3), 'En Ajustes, entrá a «Seguridad y privacidad».'), F(aj([{ t: 'Bloqueo de pantalla', s: 'Ninguno', i: 'candado' }, { t: 'Huella digital', i: 'persona' }], 0, 'Seguridad'), 'Tocá «Bloqueo de pantalla» y elegí un PIN que recuerdes. Después podés sumar la huella.')]
  },
  {
    id: 'buscar', t: 'Encontrar el celular si se pierde', por: 'Ubicarlo, hacerlo sonar o bloquearlo a distancia.', android: 'Ajustes → Google → “Encontrar mi dispositivo” (o en Seguridad). Activalo.', ios: 'Ajustes → tu nombre (arriba) → Buscar → Buscar mi iPhone. Activalo.',
    demo: [F(aj(AJ, 4), 'En Ajustes, entrá a «Google».'), F(aj([{ t: 'Encontrar mi dispositivo', toggle: true, on: true, i: 'ubicacion' }], 0, 'Google'), 'Activá «Encontrar mi dispositivo».')]
  },
  {
    id: 'update', t: 'Actualizaciones al día', por: 'Las actualizaciones cierran puertas a los virus.', android: 'Ajustes → Sistema → Actualización de software (en Samsung: Ajustes → Actualización de software).', ios: 'Ajustes → General → Actualización de software.',
    demo: [F(aj(AJ, 5), 'En Ajustes, entrá a «Sistema».'), F(aj([{ t: 'Actualización de software', s: 'Tu sistema está actualizado', i: 'descargar' }], 0, 'Sistema'), 'Tocá «Actualización de software» y, si hay una, instalala con wifi y batería.')]
  }
];

/* ===== Encuesta inicial ===== */
export const DIAG_APPS: [string, string][] = [['wa', 'WhatsApp'], ['fb', 'Facebook'], ['ig', 'Instagram'], ['yt', 'YouTube'], ['tt', 'TikTok'], ['maps', 'Google Maps'], ['fotos', 'Google Fotos o iCloud'], ['mp', 'Billetera virtual'], ['ia', 'ChatGPT u otra IA'], ['canva', 'Canva o CapCut']];
export const DIAG_AREAS: [string, string][] = [['wa', 'WhatsApp'], ['ia', 'Inteligencia artificial'], ['google', 'Mapas, fotos y traductor'], ['redes', 'Redes sociales'], ['crear', 'Crear tarjetas y videos']];
export const NIVELES: [string, string][] = [['cuesta', 'Me cuesta'], ['defiendo', 'Me defiendo'], ['bien', 'Me manejo bien']];
export const METAS: [string, string][] = [['familia', 'Hablar más con la familia'], ['proteger', 'Protegerme de estafas'], ['ia', 'Usar la inteligencia artificial'], ['fotos', 'Cuidar mis fotos'], ['moverme', 'Moverme y viajar con el celular'], ['redes', 'Usar mejor las redes'], ['crear', 'Crear tarjetas y videos'], ['aprender', 'Aprender cosas nuevas']];
export const MIEDOS: [string, string][] = [['estafas', 'Caer en una estafa'], ['cuentas', 'Que me roben las cuentas'], ['fotos', 'Perder mis fotos'], ['privacidad', 'Que desconocidos vean mis datos'], ['nada', 'Nada en especial']];
export const RETOS = [
  { id: 'r1', area: 'wa', q: 'Te llega: “Hola, soy de soporte de WhatsApp. Pasame el código de 6 números que te llegó para verificar tu cuenta.” ¿Qué hacés?', o: ['Se lo paso', 'No se lo paso a nadie', 'Le pido que me llame primero'], c: 1 },
  { id: 'r2', area: 'redes', q: 'Un amigo que ya tenés en Facebook te manda otra solicitud de amistad. ¿Qué pensás?', o: ['Que cambió de cuenta: la acepto', 'Que puede ser un perfil falso: confirmo con él por teléfono', 'Le pido plata para ver si es él'], c: 1 },
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
