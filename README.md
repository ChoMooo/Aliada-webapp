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
Las narraciones vienen pregrabadas (carpeta `public/audio/`). En Ajustes hay 3 velocidades (más despacio, normal, más rápido) y también se cambian mientras suena.

**Voz gratuita actual:** «em_alex» de Kokoro v1.0 (Apache 2.0) con pronunciación latinoamericana (`es-419`), generada en la computadora con sherpa-onnx:
```bash
npx tsx scripts/audio-texts.ts > textos.json      # lista de textos
VOICE_DIR=ruta/kokoro-multi-lang-v1_0 python3 scripts/audio-batch.py textos.json public/audio src/generated/audio.json   # solo genera lo que falta o cambió
```

**Voz argentina de calidad (recomendado antes de vender):** `scripts/audio-nube.py` genera todo una sola vez con un servicio en la nube y deja los mp3 en la app (después no hay costos):
- Azure, voces `es-AR-TomasNeural` o `es-AR-ElenaNeural`: el plan gratuito incluye 500.000 caracteres por mes y la app usa unos 65.000.
- ElevenLabs: el plan gratis no permite uso comercial; con un mes de un plan pago alcanza.
```bash
AZURE_KEY=… AZURE_REGION=eastus PROVIDER=azure VOICE=es-AR-TomasNeural python3 scripts/audio-nube.py textos.json public/audio src/generated/audio.json
```

## Herramientas que resuelven cosas
- **Mis vencimientos** (`src/features/finanzas/vencimientos.tsx`): pagos del mes, qué vence primero, marcar pagado, recordatorios para el calendario (.ics) y resumen por WhatsApp. Aparece en el Inicio cuando algo vence en 7 días.
- **¿Cuánto tengo ahorrado?** (`ahorros.tsx`, paso 3 de Mis números): plazo fijo, cuentas, efectivo y dólares con la cotización que carga la persona.
- **¿Cuotas o contado?** (`cuotas.tsx`): pasa las cuotas a plata de hoy con la inflación mensual que estima la persona.
- **¿Dónde rinde más mi plata?** (`inversiones/Calculadora.tsx`, pestaña Comparar): plazo fijo vs cuenta remunerada vs dejarla quieta, contra la inflación.
- **Mi ficha de salud** (`src/features/Salud.tsx`): medicamentos, alergias, médico y contactos de emergencia, para mostrar, imprimir o mandar.
- **Práctica tocando** (`src/features/learn/Practice.tsx`): cada lección convierte sus pantallas en práctica; la persona toca y la app la guía.

## Skills de diseño
`.claude/skills/` tiene las guías de Emil Kowalski y de Impeccable (solo texto; ver `.claude/skills/README.md`). `PRODUCT.md` y `DESIGN.md` describen el producto y el sistema visual para que esas guías se apliquen con criterio.

## Animaciones
- **Pantalla de carga** (`index.html`, bloque `#splash`): el video del logo (`public/intro/logo.webm` y `.mp4`, 2,8 s, sin sonido, recortado y acelerado del original). Se va cuando el video termina y la app ya cargó; tocarla la saltea. Si el celular no reproduce video o pidió "reducir movimiento", muestra el logo fijo.
- **Entradas de sección** (`src/ui/Motion.tsx`, `SectionVeil`): solo al cambiar entre Inicio, Finanzas, Invertir, Digital y Mi libro. Inicio repite el video del logo; las demás tienen su dibujo animado (~1 s). Los módulos no tienen animación de entrada. Lógica en `src/lib/navhist.ts`.
- **Mar en movimiento** (`src/ui/LivingSea.tsx`): la foto del inicio (`public/inicio/mar-*.webp`) se anima con un shader WebGL. `mar-mask.png` marca qué es agua (blanco) y qué queda quieto (negro: cielo, escritorio, silla). Si se cambia la foto, hay que regenerar la máscara.

## Antes de vender
- Probar cada lección de Mundo digital en celulares reales (Samsung, Motorola, iPhone) y actualizar `CONTENIDO_DIGITAL`.
- Revisar las guías de trámites contra las fuentes oficiales y actualizar `CONTENIDO_VERSION`.
- Activar el acceso con código (`ACCESS_REQUIRED`) y cargar los códigos vendidos.
- Revisión legal: términos, privacidad y botón de arrepentimiento.
