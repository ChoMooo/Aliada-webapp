# Design · "Mar de noche"

Sistema visual de Aliada Digital (octubre 2026). Reemplaza al sistema verde anterior. Se apoya en las guías de `impeccable`, `emil-design-eng`, `animate`, `review-animations`, `mobile-native`, `apple-design` y `break-ui`.

## Modo

App de uso (Operate): la persona viene a resolver algo concreto. Familiaridad antes que sorpresa, controles estándar de la web, y la marca vive en los detalles: el color, el horizonte, la tipografía.

## Idea

Arena de día y mar de noche. Fondo cálido de arena, títulos en azul noche, acción en azul ballena, detalles en turquesa (las estrellas sobre el agua). El modo oscuro es el mar de noche en sí, no una inversión del claro.

**Firma:** el `Horizon` (estrella de cuatro puntas turquesa + línea que se desvanece) cierra cada `PageHeader`. Es el único ornamento que se repite en toda la app.

## Color (tokens en `src/styles.css`, tripletas RGB para Tailwind)

| Rol | Claro | Oscuro | Uso |
|---|---|---|---|
| `bg` | 246 243 236 (arena) | 7 15 28 (noche) | Fondo, con un velo de degradado muy leve (`body::before`) |
| `surface` | 255 254 251 | 14 26 46 | Listas, tarjetas, casilleros |
| `sunk` | 237 232 222 | 20 34 57 | Resúmenes, totales, fondo al tocar una fila |
| `ink` / `muted` | 14 27 46 / 76 88 106 | 233 239 248 / 160 174 196 | Texto |
| `line` | 219 211 196 | 35 51 78 | Bordes y divisores |
| `accent` | 38 80 196 (ballena) | 128 162 255 | Acción principal, selección, progreso |
| `brand` | 12 25 45 | 10 21 39 | Tarjetas de noche (`Hero`, `.hero-glow`) con estrellas fijas (`.night-stars`) |
| `glow` | 52 212 166 | 70 224 182 | Botón principal dentro de una tarjeta de noche y cifras destacadas sobre ella |
| `teal` | 9 118 93 | 92 220 182 | Íconos sobre `mint`, estrella del horizonte, avisos buenos |
| `sky` / `amber` / `violet` (+ `*soft`) | | | Color por sección: inversiones y trámites, pagos y talento, Mundo digital y Mi libro |
| `warn` / `bad` (+ `badsoft`) | | | Avisos y vencidos |

`theme-color`: `#F6F3EC` claro, `#070F1C` oscuro (se sincroniza con el tema elegido en Ajustes).

## Tipografía

- **Atkinson Hyperlegible Next** (variable, autoalojada con `@fontsource-variable`, funciona sin internet). Diseñada para baja visión: letras que no se confunden (I/l/1, O/0).
- Base 18 px (`html{font-size:112.5%}`), con tamaños Grande y Muy grande en Ajustes.
- Títulos en negrita con `letter-spacing: -.018em`; texto corrido con `text-wrap: pretty`.
- Números con `tabular-nums` (`.num`). La plata usa espacio duro entre `$` y la cifra: el signo nunca queda solo al final de un renglón.
- Nada de rótulos chicos en mayúsculas sobre los títulos: el título habla solo.

## Componentes

- **`RowList` + `RowLink`**: las herramientas de cada sección van en una sola superficie con divisores a la altura del texto (como una lista nativa), no en tarjetas sueltas. Al tocar, la fila cambia de fondo; no escala.
- **`SectionTile`** (Inicio): un acceso grande por sección con su estado real (próximo pago, lecciones hechas, día del programa).
- **`Hero`**: tarjeta de noche para el próximo paso de cada sección. Una sola por pantalla.
- **`Note`**: fondo tintado y borde de 1 px. Nunca una franja gruesa a la izquierda.
- **Botones** de 48 px o más; zonas táctiles de 44 px mínimo (la casilla de `CheckRow` mide 28 px pero se toca en 44).
- **`MoneyInput`** ordena el número con puntos de miles al salir del casillero.
- **Mi resumen** se arma una vez como datos: de ahí salen la hoja que se ve (secciones con filas etiqueta/valor) y el texto plano para copiar o mandar por WhatsApp.

## Movimiento

- Curva única: `--ease-out: cubic-bezier(.23,1,.32,1)` (en JS, `ease` de `src/ui`).
- Respuesta al tocar con CSS (`.press` escala 0,97 en 140 ms; `.press-soft` 0,985 para superficies grandes; filas con cambio de fondo).
- Entrada de contenido: 280 ms, 8 px, escalonado de 40 ms.
- Siempre `transform` y `opacity` con el string completo (`transform: 'translateY(8px)'`), nunca `x`/`y`/`width`. Las barras de progreso usan `scaleX`.
- Entrada de las 5 secciones: 620 ms en total. Inicio: el logo aparece y se va en menos de medio segundo.
- "Reducir movimiento" apaga desplazamientos y deja solo cambios de opacidad.

## Efectos (React Bits, en `src/ui/bits`, licencia en `LICENSE-react-bits.md`)

Adaptados a la marca y a React 18 (framer-motion en lugar de motion/react). Todos respetan "reducir movimiento" y se pausan fuera de pantalla.

| Efecto | Dónde | Para qué |
|---|---|---|
| Aurora | Toda tarjeta de noche (`Hero`) y la bienvenida | Luz azul y turquesa sobre el mar de noche |
| Waves | Encabezado de Finanzas, Inversiones, Digital y Mi libro, arriba a la derecha | Corrientes de mar en el color de la sección, sin cruzar el texto |
| Galaxy | Bienvenida | Cielo con estrellas |
| GlassSurface | "Tu próximo paso" sobre el mar del Inicio | Vidrio líquido que refracta el agua |
| SpotlightCard (`Spot`) | Accesos de sección, misiones y módulos | Brillo que sigue el dedo |
| BlurText | Saludo del Inicio | Entrada palabra por palabra |
| ShinyText | "Tu próximo paso en…" | Brillo suave que invita a seguir |
| Counter | Cifra principal de Mi plata | Dígitos que giran |
| FlipCard | Glosario, modo "Practicar con tarjetas" | Palabra de un lado, significado del otro |
| TiltedCard | Portada de Mi libro | Se inclina con el dedo |
| SpringCheck, StatusMark, ClickSpark | Pasos de misiones y final de lecciones | Confirmación clara de lo hecho |
| HoldButton | "Empezar de cero" en Ajustes | Mantener apretado para borrar: evita borrar sin querer |

## Mar al atardecer (fotos, títulos con emoción y luz)
- **Fotos**: paisajes de océano y atardeceres, sin animales reales (`public/fotos`, créditos en `CREDITOS.md`, licencia Unsplash). Encabezados con foto a todo el ancho (`PhotoHero` en `src/ui/sunset.tsx`) con degradado oscuro abajo para que el texto se lea siempre.
- **Títulos con emoción**: Instrument Serif en cursiva (`font-display`, componente `Display`), solo en tamaños grandes: saludo del Inicio, títulos de Misiones, Mis logros, Revisión del mes, Mi libro y la bienvenida. El resto sigue en Atkinson Hyperlegible.
- **Botón con luz** (`ShineButton`, Moving Border de Aceternity): una sola acción principal por pantalla (Continuar en el Inicio, Empezar el paso actual de una misión, Armar mi plan).
- **Vidrio sobre foto**: `GlassStat` (cifras grandes), `.liquid` (tarjetas que se eligen), `.glass-chip` (etiquetas y "Volver" con `PhotoBack`).
- **Cada misión tiene su atardecer** (`fotoMision`): siempre la misma foto para la misma misión; el ícono de la esquina dice el área.
- Pantallas nuevas: `/empezar` (primera vez: qué querés resolver), `/logros`, `/revision` (barras que se dibujan solas, plan contra gastado).
- Vencimientos: las filas se deslizan a su lugar al marcar un pago; el vencido late con una franja coral (quieta con movimiento reducido).
- Mis números: pasos como un camino tocable, con anillo que se mueve al paso actual.
- Componentes de Aceternity UI en `src/ui/aceternity` (licencia: se pueden usar dentro de productos finales; no se revenden sueltos).

- **Mascota animada** (`Mascot act=…`): tres acciones recortadas del video de la mascota (festeja, piensa, señala), WebP animado con transparencia en `public/mascota/`. Se reproducen una vez y quedan quietas en el último cuadro; tocarla la repite. Con movimiento reducido se muestra el último cuadro. Festeja: misión y lección terminadas, plan armado, logros. Piensa: encuesta inicial, diagnóstico, pantallas vacías. Señala: logros sin misiones.
- **Volver**: botón en la barra de arriba en todas las pantallas menos el Inicio. Vuelve a la pantalla anterior; si no hay, al "padre" que declara la página (`PageHeader back`) o a la sección (`src/lib/back.ts`).

## Imágenes y ahorro de batería
- Solo se usan las fotos del mar: el del Inicio (también en la bienvenida, la encuesta inicial y la pantalla de Misiones) y el mar por profundidad de cada sección. Cada misión muestra el mar de la sección donde se hace (`seccionMision`: manda adónde llevan sus pasos). Las únicas otras fotos son las de "Tu mes" (Mis logros y Revisión del mes).
- Todas las animaciones están activas por defecto. "Ahorro de batería" en Ajustes (`aj.bat`, `useAhorro`) apaga el agua en movimiento, los videos de fondo, auroras, estrellas, la luz del botón principal, el balanceo de la mascota y las animaciones CSS que corren sin parar (`html[data-bat="1"]`).
- Botones simples: solo el título. La línea de abajo queda únicamente cuando muestra un estado real (pagos pendientes, avance, próximo paso).

## Un mar por sección (profundidad)
- El mismo océano, cada vez más hondo: Inicio (superficie) → Finanzas (recién bajo el agua) → Invertir (más hondo) → Digital (bien profundo) → Mi libro (el fondo, con arena). Fotos en `public/mar/`.
- `OceanHero` / `OceanLive` (`src/ui/ocean.tsx`): shader WebGL liviano sobre la foto — la superficie ondula con destellos (Finanzas), los rayos de luz respiran y el agua se mece (todas). ~40 cuadros por segundo, se pausa fuera de pantalla; con "reducir movimiento" o sin WebGL queda la foto fija. Mi libro usa un video corto en bucle.
- Para cambiar una foto: reemplazar `public/mar/<seccion>-1280.webp` y `-1920.webp` (16:9) y ajustar en `CFG` dónde termina la superficie (`surf`) y dónde está el sol (`light`).

## Paneles (Finanzas e Inversiones)
- `/finanzas/panel` y `/inversiones/panel`, con piezas de `src/ui/viz.tsx`: `Panel`, `Tile`, `Meter`, `SegBar`, `RankBars`, `MonthColumns`.
- Reglas de gráficos: el color identifica y nunca se usa para texto; paleta validada para daltonismo (`--viz-1..5`, claro y oscuro por separado); colores de estado (`--st-*`) siempre con ícono y texto; cada valor también se lee sin tocar (etiquetas, lista o "Ver tabla"); una sola cifra grande por pantalla, en la letra normal (no la cursiva).
- Inversiones es educativo: muestra los números de la persona, no recomienda.

## Misiones

`src/content/misiones.ts`: cada misión va de una situación ("¿Me alcanza la plata del mes?") a un resultado. Sus pasos usan herramientas y lecciones existentes; la app marca sola los pasos que puede detectar y el resto se marca con "Ya lo hice". Se ven al final del Inicio, en `/misiones` y en Mi resumen; mientras se usa una herramienta aparece "Volver a tu misión".

## Celular

`viewport-fit=cover`, `interactive-widget=resizes-content`, `theme-color` por tema, `100dvh`, `touch-action: manipulation`, sin resaltado gris al tocar, hover solo en dispositivos con mouse (`hoverOnlyWhenSupported`), `overscroll-behavior` contenido en modo instalado.

## Casos extremos probados

Nombre largo (el saludo usa solo el primer nombre), montos de 11 dígitos (la cifra del `Hero` achica su tamaño), nombres de pagos largos, pantalla de 320 px, modo oscuro.

## Cargar sin escribir

- Una sola entrada ("Cargar sin escribir", en Finanzas, Seguimiento y Vencimientos) para voz, foto, resumen y compartir.
- Siempre el mismo recorrido: elegir puerta → "Esto entendí" → Guardar. Nunca se guarda sin confirmar.
- En la revisión cada fila muestra nombre, monto y destino; el lápiz abre la corrección. Lo que es plata que entró viene destildado.
- "Lo último que cargaste" permite deshacer cada gasto.
- Textos de privacidad cortos y concretos al pie de cada puerta (qué queda en el celular y qué no).
