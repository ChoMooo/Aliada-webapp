# Skills de diseño instaladas en este proyecto

Copiadas y revisadas el 25/10/2026. Solo se instaló el texto (archivos .md) y las licencias.

| Origen | Versión (commit) | Licencia | Qué se instaló |
|---|---|---|---|
| github.com/emilkowalski/skills | 2d22863 | MIT | emil-design-eng, mobile-native, break-ui, review-animations, animate, animation-performance, find-animation-opportunities, apple-design, improve-animations, animation-vocabulary |
| github.com/pbakaus/impeccable | 3671d50 | Apache 2.0 | `impeccable/SKILL.md` y `impeccable/reference/*.md` |

## Qué se dejó afuera y por qué

- **Impeccable – carpeta `scripts/`**: el lanzador descarga y ejecuta un programa compilado desde los releases de GitHub del autor (la verificación sha256 viene del mismo lugar, así que no es independiente) y ese programa envía un aviso de uso ("TELEMETRY / choice ping"). No hace falta para usar las guías.
- **Impeccable – hooks de `.claude/settings.json`**: corrían ese programa en cada inicio de sesión y después de cada edición.
- **Impeccable – agentes (`.claude/agents/`)**: dependen de ese programa.
- **Emil – write-swift, animate-expo, ask-sonner, pick-ui-library, prototype**: son para Swift/React Native, para una librería que no usamos o sugieren instalar paquetes.

Sin la carpeta `scripts/`, Impeccable usa su propio camino "Launcher unavailable": lee `PRODUCT.md` y `DESIGN.md` de la raíz del proyecto y sigue sus guías. Esos dos archivos están escritos para Aliada Digital.
