# Design

Sistema visual actual de Aliada Digital (documentado desde el código, octubre 2026). Las guías de `.claude/skills/impeccable` y `.claude/skills/emil-design-eng` se aplican sobre esta base.

## Modo

App de uso (Operate): la persona viene a resolver algo. Familiaridad antes que sorpresa; los controles son los estándar de la web.

## Color (tokens en `src/styles.css`, tripletas RGB para Tailwind)

| Rol | Claro | Oscuro | Uso |
|---|---|---|---|
| `bg` | 244 246 241 | 11 19 16 | Fondo, con un degradado muy leve del mismo verde (`body::before`) |
| `surface` | 255 255 255 | 20 31 27 | Tarjetas y listas |
| `sunk` | 233 239 233 | 27 40 35 | Resúmenes y totales |
| `ink` / `muted` | 19 32 27 / 77 93 86 | 234 243 238 / 165 182 173 | Texto |
| `accent` | 10 125 88 | 0 224 145 | Acción principal, selección, progreso |
| `brand` | 24 39 34 | 18 33 27 | Tarjetas verde profundo (`hero-glow`) |
| `sky` / `amber` / `violet` (+ `*soft`) | | | Color por sección: inversiones, talento y pagos, mundo digital |
| `warn` / `bad` | | | Avisos y vencidos |

Los avisos (`Note`) usan fondo tintado y borde fino; nunca una franja gruesa a la izquierda.

## Tipografía

- Instrument Sans (títulos), Public Sans (texto). Base 18 px (`html{font-size:112.5%}`), con tamaños Grande y Muy grande en Ajustes.
- Números con `tabular-nums` (`.num`). Nada de rótulos en mayúsculas sobre los títulos: el título habla solo.

## Componentes

- Listas en una sola superficie con divisores (módulos, vencimientos, ahorros) antes que tarjetas sueltas.
- `RowLink` para herramientas: ícono con color de sección, título, una línea de ayuda y flecha.
- Botones de 48 px o más; `press` da respuesta al tocar (escala 0,97 en 140 ms).
- Casilleros de plata (`MoneyInput`) ordenan el número con puntos de miles al salir del casillero.

## Movimiento

- Curvas: `--ease-out: cubic-bezier(.23,1,.32,1)` para entrar/salir; transiciones de UI entre 140 y 250 ms.
- Entrada de las 5 secciones (pedido del dueño); Inicio repite el video del logo. Los módulos no tienen.
- "Reducir movimiento" apaga desplazamientos y deja solo cambios de opacidad.

## Celular

`viewport-fit=cover`, `interactive-widget=resizes-content`, `theme-color` por tema, `100dvh`, `touch-action: manipulation`, hover solo en dispositivos con mouse (`hoverOnlyWhenSupported`).
