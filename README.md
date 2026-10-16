# Aliada Digital 2.0

Web app instalable (PWA) para personas que se jubilan o están por jubilarse.
Dos secciones: **Finanzas** (Mi plata, Mis trámites, Mi talento, Plata en el celular) y **Mundo digital** (WhatsApp, Inteligencia artificial, Google en tu celular, Redes sociales, Crear con el celular y Escudo antiestafas).
Cada lección trae un mini video propio (pantallas dibujadas por código + narración) y una guía en imágenes.
Los datos de cada persona se guardan solo en su dispositivo.

## Tecnología
React 18 + TypeScript + Vite · Tailwind CSS · Framer Motion · Zustand (guardado local) · vite-plugin-pwa (instalable y sin internet).
Todo gratuito y de código abierto.

## Comandos
```bash
npm install        # instalar dependencias
npm run dev        # desarrollo local
npm run build      # versión para publicar (carpeta dist/)
npm run build:preview  # versión de un solo archivo para vista previa
```

## Publicar gratis en Cloudflare Pages
1. Entrá a dash.cloudflare.com → Workers & Pages → Create → Pages → **Connect to Git**.
2. Elegí este repositorio.
3. Build command: `npm run build` · Output directory: `dist`.
4. Guardar y publicar. Cada cambio que se sube a GitHub se publica solo.

## Dónde está el contenido
- `src/content/finanzas.ts` — guías de trámites (con fuente y fecha) y oportunidades de ingreso.
- `src/content/learn/` — módulos y lecciones (un archivo por módulo), videos (`demo`), primeros ajustes y encuesta.
- `src/features/learn/Screen.tsx` — pantallas de celular para los videos y las miniaturas.
- `public/audio/` y `src/generated/audio.json` — narraciones generadas (ver abajo).
- `src/content/escudo.ts` — situaciones del simulador y reglas del analizador.
- `src/config.ts` — textos legales y acceso con código (desactivado por defecto).

## Audios (narración)
Las narraciones se generan gratis, en la computadora, con la voz «Daniela» (Piper, español de Argentina, licencia CC BY-SA 4.0) usando sherpa-onnx.
Si cambiás un texto, su audio deja de coincidir y la app usa la voz del dispositivo hasta regenerarlo:
```bash
npx tsx scripts/audio-texts.ts > textos.json      # lista de textos
python3 scripts/audio-batch.py textos.json public/audio src/generated/audio.json   # solo genera los que faltan
```

## Antes de vender
- Probar cada lección de Mundo digital en celulares reales (Samsung, Motorola, iPhone) y actualizar `CONTENIDO_DIGITAL`.
- Revisar las guías de trámites contra las fuentes oficiales y actualizar `CONTENIDO_VERSION`.
- Activar el acceso con código (`ACCESS_REQUIRED`) y cargar los códigos vendidos.
- Revisión legal: términos, privacidad y botón de arrepentimiento.
