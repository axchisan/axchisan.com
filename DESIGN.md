# Sistema de diseño — axchisan.com

## Brief

**Sujeto:** Duvan Yair Arciniegas (Axchi). Desarrollador de software, Bogotá. Tecnólogo ADSO (SENA).
Trabajó en una empresa de software en Bogotá desde enero de 2026 en DevOps, CI/CD, automatización
e integración de agentes de IA.

**Audiencia:** quien contrata perfiles técnicos —CTOs, líderes de ingeniería, reclutadores
especializados— en Colombia y remoto LATAM. Escanea en treinta segundos y descarta.

**Trabajo del sitio:** convencer, rápido, de que esta persona construye sistemas completos y razona
sobre decisiones de ingeniería. Después, hacer trivial el contacto.

**Qué lo distingue de verdad:** no es que sepa React. Es que construye **sistemas que funcionan
solos**: un canal de contenido que se produce y publica sin intervención, una app de finanzas
multiplataforma que cuesta 0,01 USD al mes, un juego con servidor multijugador autoritativo. Escribe
ADRs. Mide costos. Ese es el material del que sale el diseño.

## De qué se está huyendo

El sitio anterior reproducía, casi punto por punto, el catálogo de señales de página generada por IA:

| Señal | Dónde estaba |
|---|---|
| Fondo casi negro + un acento verde ácido | `#0A0B0D` + `#C6F24E` |
| Una sola palabra del titular en otro color | "software que se siente **extraordinario**" |
| Eyebrow en versalitas monoespaciadas con tracking | `.mono-label` sobre cada sección |
| Cadenas de metadatos unidas por `·` | "STUDIO DE SOFTWARE · BOGOTÁ, CO" |
| Flecha `→` pegada al texto del botón | "VER TRABAJO →" |
| Resplandor radial difuminado | `.hero-glow` |
| Monoespaciada como decoración | etiquetas, cifras, pies |

Ninguna de esas construcciones vuelve.

## Decisiones

### Concepto: el trabajo primero

**No hay hero de marketing.** La página abre con una línea de identidad —quién, qué hace, dónde,
disponibilidad— y entra directo al trabajo. Un titular que dice "construimos software
extraordinario" gasta el espacio más valioso de la página en una frase que no informa; quien lee
tiene treinta segundos y quiere ver sistemas.

Es la decisión menos obvia del rediseño y la que más lo diferencia: casi ningún portafolio se atreve
a quitarse el hero.

### Color

Escala neutra fría, definida en OKLCH para que claro y oscuro se deriven con la misma percepción de
contraste. El acento **solo marca interacción** —enlaces, foco, estado activo—, nunca decora.

| Ficha | Claro | Oscuro | Uso |
|---|---|---|---|
| `paper` | `#FCFCFD` | `#0E1013` | fondo |
| `raised` | `#F5F6F8` | `#171A1F` | superficie elevada |
| `ink` | `#14171C` | `#F2F4F7` | texto principal |
| `graphite` | `#5C6472` | `#98A1B0` | texto secundario |
| `line` | `#E3E6EB` | `#252A31` | separadores |
| `accent` | `#3454D1` | `#7C95F5` | interacción |

### Tipografía

**Una sola familia**, con rango real de peso y tamaño. Emparejar una display con una de texto es el
recurso por defecto; usar bien una sola es más difícil y se nota.

- **Instrument Sans** — todo. Titulares en 600 con tracking cerrado (−0.03em) a tamaños grandes;
  texto en 400 con altura de línea 1.65 y medida máxima de 68 caracteres.
- **JetBrains Mono** — exclusivamente donde hay código o un dato numérico real. Nunca como etiqueta
  decorativa.

Escala (proporción 1.25, redondeada a píxeles enteros):
`12 · 14 · 16 · 20 · 25 · 31 · 39 · 49 · 61`

### Retícula

Rejilla de 12 columnas con una **asimetría estructural**: la prosa vive en una columna de medida
legible alineada a la izquierda, y los metadatos —stack, año, rol, enlaces— en un raíl estrecho a la
derecha. Es la forma que tiene la documentación técnica de emparejar texto y ficha, y aquí la
estructura significa: un separador dice "otro sistema", el raíl dice "ficha técnica".

Los proyectos **no van en rejilla de tarjetas**. Van en filas a todo el ancho separadas por una
línea. Tres tarjetas iguales con la misma sombra suave es el kit por defecto; una fila deja respirar
el contenido y admite que cada proyecto tenga distinto peso.

Todo alineado a la izquierda. Nada centrado.

### Principios

1. **El trabajo abre la página.** Sin hero de marketing.
2. **Cada afirmación lleva un número o no aparece.** "Rápido" no; "0,01 USD/mes" sí.
3. **El acento marca interacción, nunca decora.**
4. **Un solo momento de movimiento** al cargar. Lo demás responde a una acción de la persona.
5. **La estructura informa.** Ningún borde, línea ni etiqueta que no signifique algo.

## Piso de calidad

Responsive hasta 360px · foco de teclado visible en todo elemento interactivo · `prefers-reduced-motion`
respetado · contraste WCAG AA como mínimo · claro y oscuro completos, ninguno como añadido.
