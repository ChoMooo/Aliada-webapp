/* Configuración general del producto */
export const APP_NAME = 'Aliada Digital';
export const LEGAL =
  'Aliada Digital ofrece orientación general y herramientas de cálculo y aprendizaje. No es asesoramiento legal, previsional, impositivo ni financiero, y no está vinculada a ANSES, PAMI, ARCA ni a las empresas de las apps que enseña. Verificá siempre en la fuente oficial. Nunca cargues ni compartas DNI, CUIL, claves ni códigos en esta aplicación.';

/* Acceso con código (pago único).
   - Para activarlo: ACCESS_REQUIRED = true y cargá en ACCESS_HASHES el SHA-256 (hex) de cada código vendido.
   - Generar un hash: en la consola del navegador →
     crypto.subtle.digest('SHA-256', new TextEncoder().encode('CODIGO')).then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
   Es una protección simple para la primera etapa; más adelante se puede validar en un servidor. */
export const ACCESS_REQUIRED = false;
export const ACCESS_HASHES: string[] = [];

export async function checkCode(code: string) {
  const norm = code.trim().toUpperCase();
  if (!norm) return false;
  try {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(norm));
    const hex = [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
    return ACCESS_HASHES.includes(hex);
  } catch { return false; }
}
