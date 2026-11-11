/* Copia de seguridad de los datos.
   1) Compartir la copia con la hoja de "Compartir" del celular (Drive, WhatsApp, correo…): funciona siempre.
   2) Copia automática en Google Drive: la persona entra una vez con su cuenta de Google y la app guarda sola
      un archivo en un espacio privado de su Drive que solo Aliada puede ver. Aliada nunca ve la contraseña:
      el ingreso lo hace Google en su propia ventana. Requiere VITE_GOOGLE_CLIENT_ID (ver README). */
import { getD, mut, mergeData, useStore, type Data } from '../store';
import { downloadText } from './share';

export const DRIVE_ID: string = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '';
export const hayDrive = () => !!DRIVE_ID;

export const textoCopia = (d: Data = getD()) => JSON.stringify({ app: 'aliada', ...d, lastBackup: Date.now() });
const nombreCopia = (ext: string) => 'aliada-copia-' + new Date().toISOString().slice(0, 10) + '.' + ext;

/** Valida y carga una copia. Devuelve false si el texto no es una copia de Aliada */
export function restaurarCopia(txt: string): boolean {
  try {
    const o = JSON.parse(txt);
    if (!o || !(o.v === 2 || o.v === 1) || !o.plata) return false;
    const nd = mergeData(o); nd.perfil.onb = true;
    useStore.getState().replace(nd);
    return true;
  } catch { return false; }
}

/** Abre "Compartir" con el archivo de la copia; si el celular no puede, lo descarga */
export async function compartirCopia(): Promise<'compartida' | 'descargada' | 'cancelada' | 'fallo'> {
  const txt = textoCopia();
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  for (const [ext, type] of [['json', 'application/json'], ['txt', 'text/plain']] as const) {
    try {
      const file = new File([txt], nombreCopia(ext), { type });
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: 'Copia de mis datos de Aliada Digital' });
        mut((d) => { d.lastBackup = Date.now(); });
        return 'compartida';
      }
    } catch (e) { if ((e as DOMException)?.name === 'AbortError') return 'cancelada'; }
  }
  if (downloadText(nombreCopia('json'), txt)) { mut((d) => { d.lastBackup = Date.now(); }); return 'descargada'; }
  return 'fallo';
}

/* ---------- Google Drive ---------- */
const SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
const ARCHIVO = 'aliada-copia.json';
type Fetch = typeof fetch;

let gis: Promise<void> | null = null;
function cargarGoogle(): Promise<void> {
  return (gis ||= new Promise<void>((ok, mal) => {
    if ((window as any).google?.accounts?.oauth2) return ok();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true;
    s.onload = () => ok(); s.onerror = () => { gis = null; mal(new Error('sin-google')); };
    document.head.appendChild(s);
  }));
}

let token = '', tokenHasta = 0;
/** Pide permiso a Google. La primera vez muestra su ventana; después suele resolverse sin preguntar */
async function pedirToken(silencioso: boolean): Promise<string> {
  if (token && Date.now() < tokenHasta - 60_000) return token;
  await cargarGoogle();
  return new Promise<string>((ok, mal) => {
    const cliente = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: DRIVE_ID, scope: SCOPE,
      callback: (r: { access_token?: string; expires_in?: number; error?: string }) => {
        if (!r.access_token) return mal(new Error(r.error || 'sin-permiso'));
        token = r.access_token; tokenHasta = Date.now() + (Number(r.expires_in) || 3600) * 1000; ok(token);
      },
      error_callback: (e: { type?: string }) => mal(new Error(e?.type || 'sin-permiso'))
    });
    cliente.requestAccessToken({ prompt: silencioso ? '' : 'consent' });
  });
}

/** Busca el archivo de la copia en el espacio privado de la app */
export async function buscarEnDrive(tk: string, f: Fetch = fetch): Promise<{ id: string; modifiedTime: string } | null> {
  const q = new URLSearchParams({ spaces: 'appDataFolder', q: `name='${ARCHIVO}'`, fields: 'files(id,modifiedTime)', orderBy: 'modifiedTime desc', pageSize: '1' });
  const r = await f('https://www.googleapis.com/drive/v3/files?' + q, { headers: { Authorization: 'Bearer ' + tk } });
  if (!r.ok) throw new Error('drive-' + r.status);
  return (await r.json()).files?.[0] || null;
}

/** Guarda la copia: actualiza el archivo si ya existe, o lo crea */
export async function guardarEnDrive(tk: string, txt: string, f: Fetch = fetch): Promise<void> {
  const ya = await buscarEnDrive(tk, f);
  let r: Response;
  if (ya) {
    r = await f(`https://www.googleapis.com/upload/drive/v3/files/${ya.id}?uploadType=media`, { method: 'PATCH', headers: { Authorization: 'Bearer ' + tk, 'Content-Type': 'application/json' }, body: txt });
  } else {
    const b = 'aliada' + Math.random().toString(36).slice(2);
    const cuerpo = `--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name: ARCHIVO, parents: ['appDataFolder'] })}\r\n--${b}\r\nContent-Type: application/json\r\n\r\n${txt}\r\n--${b}--`;
    r = await f('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { Authorization: 'Bearer ' + tk, 'Content-Type': 'multipart/related; boundary=' + b }, body: cuerpo });
  }
  if (!r.ok) throw new Error('drive-' + r.status);
}

export async function leerDeDrive(tk: string, f: Fetch = fetch): Promise<string | null> {
  const ya = await buscarEnDrive(tk, f);
  if (!ya) return null;
  const r = await f(`https://www.googleapis.com/drive/v3/files/${ya.id}?alt=media`, { headers: { Authorization: 'Bearer ' + tk } });
  if (!r.ok) throw new Error('drive-' + r.status);
  return r.text();
}

/** Activa la copia automática (muestra la ventana de Google) y hace la primera copia */
export async function activarDrive() {
  const tk = await pedirToken(false);
  await guardarEnDrive(tk, textoCopia());
  mut((d) => { d.drive.on = true; d.drive.at = Date.now(); d.lastBackup = Date.now(); });
}
export async function copiarAhoraEnDrive(silencioso = false) {
  const tk = await pedirToken(silencioso);
  await guardarEnDrive(tk, textoCopia());
  mut((d) => { d.drive.at = Date.now(); d.lastBackup = Date.now(); });
}
export async function recuperarDeDrive(): Promise<'ok' | 'vacio' | 'invalida'> {
  const tk = await pedirToken(false);
  const txt = await leerDeDrive(tk);
  if (!txt) return 'vacio';
  if (!restaurarCopia(txt)) return 'invalida';
  mut((d) => { d.drive.on = true; d.drive.at = Date.now(); });
  return 'ok';
}
export function desactivarDrive() {
  try { if (token) (window as any).google?.accounts?.oauth2?.revoke(token, () => {}); } catch { /* */ }
  token = ''; tokenHasta = 0;
  mut((d) => { d.drive.on = false; });
}

/** Copia automática: una vez por día, al primer toque de la sesión (Google exige un gesto para abrir su permiso) */
export function copiaAutomatica() {
  if (!hayDrive() || typeof window === 'undefined') return;
  const intento = () => {
    const d = getD();
    if (!d.drive.on || !navigator.onLine || Date.now() - d.drive.at < 20 * 3600e3) return;
    copiarAhoraEnDrive(true).catch(() => { /* se reintenta la próxima vez que se abra la app */ });
  };
  window.addEventListener('pointerup', intento, { once: true, passive: true });
}
