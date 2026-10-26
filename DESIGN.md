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

## Celular

`viewport-fit=cover`, `interactive-widget=resizes-content`, `theme-color` por tema, `100dvh`, `touch-action: manipulation`, sin resaltado gris al tocar, hover solo en dispositivos con mouse (`hoverOnlyWhenSupported`), `overscroll-behavior` contenido en modo instalado.

## Casos extremos probados

Nombre largo (el saludo usa solo el primer nombre), montos de 11 dígitos (la cifra del `Hero` achica su tamaño), nombres de pagos largos, pantalla de 320 px, modo oscuro.
