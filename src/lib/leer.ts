/* Leer una foto o un archivo y devolver su texto. Todo ocurre en el dispositivo:
   la foto y el archivo no se envían a ningún lado. Las piezas pesadas se bajan recién cuando se usan. */
import { entenderCSV, entenderTexto, type Borrador } from './entender';

declare const __PREVIEW__: boolean;
export type Lectura = { clase: 'resumen' | 'boleta' | 'nada'; items: Borrador[]; texto: string };

/** Achica la foto (las de la cámara son enormes) y la pasa a grises con más contraste: se lee mejor y más rápido */
async function prepararFoto(file: Blob, max = 2000): Promise<HTMLCanvasElement> {
  const bmp = await createImageBitmap(file).catch(async () => {
    const url = URL.createObjectURL(file);
    try { const img = new Image(); img.src = url; await img.decode(); return img; } finally { setTimeout(() => URL.revokeObjectURL(url), 5000); }
  });
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  const g = c.getContext('2d')!;
  g.filter = 'grayscale(1) contrast(1.25)';
  g.drawImage(bmp as CanvasImageSource, 0, 0, c.width, c.height);
  return c;
}

/** Texto de una foto (OCR). `onProg` recibe el avance de 0 a 1 */
export async function textoDeFoto(file: Blob, onProg?: (p: number) => void): Promise<string> {
  if (__PREVIEW__) throw new Error('foto-preview'); // la vista previa no puede alojar el lector
  const [{ createWorker }, lienzo] = await Promise.all([import('tesseract.js'), prepararFoto(file)]);
  const base = new URL('ocr/', document.baseURI).href;
  const worker = await createWorker('spa', 1, {
    workerPath: base + 'worker.min.js', corePath: base, langPath: base, gzip: true,
    logger: (m: { status: string; progress: number }) => { if (m.status === 'recognizing text') onProg?.(0.25 + m.progress * 0.75); else onProg?.(Math.min(0.25, m.progress * 0.25)); }
  });
  try { const { data } = await worker.recognize(lienzo); return data.text || ''; }
  finally { worker.terminate().catch(() => {}); }
}

/** Texto de un PDF, renglón por renglón (une las palabras que están a la misma altura) */
export async function textoDePdf(file: Blob): Promise<string> {
  if (__PREVIEW__) throw new Error('pdf-preview');
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const out: string[] = [];
  for (let p = 1; p <= Math.min(doc.numPages, 40); p++) {
    const page = await doc.getPage(p), tc = await page.getTextContent();
    const filas = new Map<number, { x: number; s: string }[]>();
    for (const it of tc.items as { str: string; transform: number[] }[]) {
      if (!it.str?.trim()) continue;
      const y = Math.round(it.transform[5] / 3) * 3;
      (filas.get(y) || filas.set(y, []).get(y)!).push({ x: it.transform[4], s: it.str });
    }
    [...filas.entries()].sort((a, b) => b[0] - a[0]).forEach(([, f]) => out.push(f.sort((a, b) => a.x - b.x).map((x) => x.s).join(' ')));
  }
  doc.loadingTask?.destroy().catch(() => {});
  return out.join('\n');
}

const esImagen = (f: File) => f.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif|bmp)$/i.test(f.name);
const esPdf = (f: File) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
const esCsv = (f: File) => /csv|tab-separated/.test(f.type) || /\.(csv|tsv)$/i.test(f.name);

/** Lee cualquier archivo que sirva (foto, PDF, planilla CSV o texto) y devuelve los borradores */
export async function leerArchivo(file: File, onProg?: (p: number) => void): Promise<Lectura> {
  if (esImagen(file)) { const texto = await textoDeFoto(file, onProg); return { ...entenderTexto(texto), texto }; }
  if (esPdf(file)) {
    const texto = await textoDePdf(file);
    if (texto.replace(/\s/g, '').length < 20) throw new Error('pdf-sin-texto');
    return { ...entenderTexto(texto), texto };
  }
  if (/\.(xlsx?|ods)$/i.test(file.name)) throw new Error('excel');
  const texto = await file.text();
  if (esCsv(file) || /^[^\n]*[;,\t][^\n]*\n/.test(texto)) { const items = entenderCSV(texto); if (items.length) return { clase: 'resumen', items, texto }; }
  return { ...entenderTexto(texto), texto };
}

/** Mensaje claro para cada cosa que puede salir mal */
export function porQueFallo(e: unknown): string {
  const m = String((e as Error)?.message || e);
  if (m === 'pdf-preview' || m === 'foto-preview') return 'En esta vista previa no se pueden leer fotos ni PDF. En la app instalada sí. Acá podés probar con la voz, una frase o un archivo CSV.';
  if (m === 'pdf-sin-texto') return 'Ese PDF es una imagen escaneada. Probá sacándole una foto a la hoja.';
  if (m === 'excel') return 'Todavía no leo planillas de Excel. Si podés, descargala como CSV o como PDF.';
  if (!navigator.onLine) return 'La primera vez hace falta internet para bajar el lector. Conectate y probá de nuevo.';
  return 'No pude leerlo. Probá con otra foto, más de cerca y con buena luz.';
}
