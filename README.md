# Aliada Digital 2.0

Web app instalable (PWA) para personas de más de 55 que quieren ordenar su plata, aprender a invertir y aprovechar el celular.
Secciones: **Finanzas** (Mi plata, Mis trámites, Mi talento, Plata en el celular), **Inversiones** (cómo invertir en Argentina, calculadora y glosario), **Mundo digital** (WhatsApp, IA, Google, Redes, Crear y Escudo antiestafas) y **Mi nueva versión** (libro y cuaderno; solo visible si la persona se identifica como mujer).
Cada lección trae un mini video propio (pantallas que reproducen cada app, dibujadas por código, + narración) y una guía en imágenes.
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
- `src/features/learn/Screen.tsx` y `screens/` — pantallas de cada app para los videos y las miniaturas. Para revisarlas todas: `npm run dev` y abrir `/gallery.html` (o `/gallery.html?all` para ver cada fotograma de cada lección).
- `src/content/learn/inv.ts` — lecciones de Inversiones, con fecha de revisión y fuentes oficiales.
- `public/mascota/` — la mascota en sus dos poses. `public/libro/` — el kit Mi nueva versión.
- `public/audio/` y `src/generated/audio.json` — narraciones generadas (ver abajo).
- `src/content/escudo.ts` — situaciones del simulador y reglas del analizador.
- `src/config.ts` — textos legales y acceso con código (desactivado por defecto).

## Audios (narración)
Las narraciones se generan gratis, en la computadora, con la voz masculina «em_alex» de Kokoro v1.0 (licencia Apache 2.0) usando sherpa-onnx, a velocidad lenta y con pausas entre frases.
Si cambiás un texto, su audio deja de coincidir y la app usa la voz del dispositivo hasta regenerarlo:
```bash
npx tsx scripts/audio-texts.ts > textos.json      # lista de textos
VOICE_DIR=ruta/kokoro-multi-lang-v1_0 python3 scripts/audio-batch.py textos.json public/audio src/generated/audio.json   # solo genera los que faltan y borra los que sobran
```

## Animaciones
- **Pantalla de carga** (`index.html`, bloque `#splash`): el logo se arma en SVG + CSS (aro, cola de ballena, luna y estrellas), sin sonido, y se va en menos de 3 s cuando la app ya cargó. Tocarla la saltea.
- **Entradas de sección** (`src/ui/Motion.tsx`, `SectionVeil`): cada vez que se cambia entre Inicio, Finanzas, Invertir, Digital y Mi libro aparece su animación propia (~1 s). Los módulos muestran la suya al entrar desde afuera (no al volver de una lección). La lógica está en `src/lib/navhist.ts`. Con "reducir movimiento" activado no se muestran.
- **Foto del inicio**: `public/inicio/escritorio-*.webp`.

## Antes de vender
- Probar cada lección de Mundo digital en celulares reales (Samsung, Motorola, iPhone) y actualizar `CONTENIDO_DIGITAL`.
- Revisar las guías de trámites contra las fuentes oficiales y actualizar `CONTENIDO_VERSION`.
- Activar el acceso con código (`ACCESS_REQUIRED`) y cargar los códigos vendidos.
- Revisión legal: términos, privacidad y botón de arrepentimiento.
