# Marca Axchi — brief y prompt para generar el logo

## 1. Qué tiene que comunicar

**Axchi** pasa de ser un alias personal a la marca de un servicio de desarrollo de software para
empresas. El logo lo verá, en este orden: un gerente que evalúa si contratar, un desarrollador que
revisa el repositorio, y una pestaña de navegador a 16×16 píxeles.

De ahí salen los requisitos, no de una idea estética:

| Requisito | Por qué |
|---|---|
| **Legible a 16 px** | El favicon es el uso más frecuente del logo. Si el monograma se emborrona ahí, no sirve por bonito que sea grande |
| **Funciona en un solo color** | Va sobre la banda oscura del sitio, sobre fondo claro, y algún día en una factura en blanco y negro |
| **Sin degradados ni sombras** | No sobreviven al tamaño pequeño y envejecen mal |
| **Sobrio** | Vende ingeniería, no creatividad. Un logo llamativo contradice el mensaje |

## 2. Territorio visual

- **Concepto en uso hoy:** la letra **A** de trazo constante con el **vértice cortado en plano**.
  Se dibujó en SVG y está en `components/site/logo.tsx`. Se probó contra una A de punta normal y
  contra una de barra muy baja: la primera no se distingue de la A de cualquier tipografía, la
  segunda deja de leerse como letra. Sirve mientras se decide la marca definitiva.
- **Familia:** geométrico, trazo de grosor constante, esquinas ligeramente redondeadas (2 px de
  radio a tamaño 64) para que no se lea agresivo.
- **Color de marca:** `#0EA5A5` (cian-teal). Sobre fondo oscuro va el color; sobre fondo claro, el
  monograma en tinta `#0F1720` y el acento reservado para un detalle.
- **Qué evitar:** hexágonos con circuitos, cerebros, nodos conectados, el corchete `</>`, cohetes,
  y cualquier degradado violeta-cian. Son el repertorio agotado del sector.

## 3. De dónde sale un logo que no es genérico

Un monograma bonito no es una marca. Lo que hace memorable a un logo es que **tenga una idea
detrás**, y esa idea tiene que salir de lo que el negocio hace de verdad.

Lo que Axchi hace, en una frase: **encontrar dónde una persona está haciendo de traductor entre dos
sistemas que no se hablan, y quitar ese paso.** Construir cosas que después funcionan solas.

De ahí salen conceptos con los que trabajar. Cada uno de los prompts de abajo ejecuta uno.

| Concepto | La idea | Por qué encaja |
|---|---|---|
| **El puente** | La A como un arco que une dos pilares | Es literalmente lo que hace: conectar dos lados que no se tocaban |
| **La cinta continua** | Una sola línea que se pliega y forma la A sin empezar ni terminar | Un sistema que se alimenta a sí mismo y no se detiene |
| **La convergencia** | Muchas líneas entran, una sola sale por el vértice | Automatización: muchas entradas, un resultado |
| **El contrapunto** | La A aparece como espacio vacío entre dos formas sólidas | Lo que no está es lo que se ve. Silueta fortísima a tamaño pequeño |
| **AX ligado** | La A y la X comparten una diagonal | Dos letras, una sola forma. El nombre completo en un gesto |

## 4. Prompts para Gemini

Cada bloque es independiente: cópialo entero. Están en inglés porque los modelos de imagen
responden con menos deriva a las instrucciones de diseño en ese idioma.

Genera **cuatro o cinco imágenes de cada uno** antes de juzgarlo: la variación entre intentos del
mismo prompt es alta, y el primer resultado casi nunca es el mejor.

---

### 1 · El puente

```
A logo mark for "Axchi", a software engineering studio.

The concept: a bridge. The letter A reimagined as an architectural arch — two
tapering piers rising from a common baseline and meeting in a spanning beam at
the top, with a horizontal deck crossing between them where the crossbar of an A
would sit. It should read simultaneously as the letter A and as a structure that
connects two sides.

Craft: the strokes have subtle weight variation, thicker at the base where a
real structure carries load and lighter at the span, so the form feels
engineered rather than drawn. The deck extends slightly past the piers on both
sides — that small overhang is what makes it a bridge and not just a letter.

Execution: a single flat teal colour (#0EA5A5) on white. Confident geometry,
generous negative space under the arch. The silhouette must stay unmistakable
at 16 pixels.

One mark, centred, nothing else in the frame. No text, no container shape, no
gradient, no shadow.
```

---

### 2 · La cinta continua

```
A logo mark for "Axchi", a software engineering studio.

The concept: one unbroken ribbon. A single continuous band of constant width
that folds through space and, in doing so, traces the letter A — there is no
start and no end, the path closes on itself. Where the ribbon crosses over
itself, the overlap is shown as a clean flat break in the band, the way a
Möbius strip or a folded paper strip reads, giving depth without any gradient.

Craft: the folds are crisp and angular, not curved — this is folded card stock,
not flowing fabric. The eye should be able to follow the whole path and return
to where it started.

Execution: two flat tones of the same teal (#0EA5A5 and a darker #0B7C7C) to
distinguish the faces of the ribbon where it turns. Nothing else. White
background, centred, generous margin.

One mark only. No text, no container shape, no gradient, no shadow, no 3D
rendering — this is flat vector art that merely suggests dimension.
```

---

### 3 · La convergencia

```
A logo mark for "Axchi", a software engineering studio.

The concept: many things becoming one. Five or six parallel lines rise from the
bottom of the frame — some from the left, some from the right — and converge
toward a single point at the top, where they merge into one thick stroke. The
overall silhouette reads as the letter A. A horizontal element crosses the
converging lines partway up, functioning as the crossbar.

Craft: the lines are not evenly spaced — the rhythm varies, tighter in some
places than others, the way real flows do. As they approach the apex they
thicken and merge. The gaps between lines are part of the design and should stay
open and airy.

Execution: flat teal (#0EA5A5) on white, single colour. Precise, mathematical,
calm. Must remain legible as a mark at 16 pixels even if individual lines blur
together at that size.

One mark, centred. No text, no container, no gradient, no shadow.
```

---

### 4 · El contrapunto

```
A logo mark for "Axchi", a software engineering studio.

The concept: the letter appears in the gap. Two solid geometric shapes — think
of two heavy angular blocks — sit close to each other, and the narrow channel of
empty space left between them forms a perfect letter A. The A itself is never
drawn; it exists only as the space the two shapes do not occupy.

Craft: the blocks have slightly different weights and are not mirror images of
each other, which keeps the mark from looking mechanical. The channel of
negative space has constant width throughout, so the implied letter feels
deliberate. The outer silhouette of the pair should itself be an interesting,
compact shape.

Execution: solid flat teal (#0EA5A5) blocks on pure white, the negative space
showing the white through. Single colour, maximum contrast. This is the kind of
mark that gets stronger as it gets smaller.

One mark, centred, generous margin. No text, no outline, no gradient, no shadow.
```

---

### 5 · AX ligado

```
A logo mark for "Axchi", a software engineering studio.

The concept: two letters, one form. A ligature where the letter A and the letter
X share a diagonal stroke, so that a single connected shape reads as both
letters at once depending on how the eye enters it. The shared diagonal is the
whole idea — it should be impossible to say where the A ends and the X begins.

Craft: the stroke weight is constant throughout, and the angles of the A and the
X are deliberately harmonised so the shared diagonal serves both letters
honestly, without distorting either. The counters — the enclosed spaces — stay
open and generous so the form breathes.

Execution: flat teal (#0EA5A5) on white. Confident, geometric, built rather than
handwritten. The mark should be immediately legible as letters, not as an
abstract symbol.

One mark, centred, nothing else. No text beyond the ligature itself, no
container shape, no gradient, no shadow.
```

---

### Para el icono de aplicación, una vez elegida la marca

```
App icon, 512×512 pixels. [PEGA AQUÍ LA DESCRIPCIÓN DEL CONCEPTO QUE ELEGISTE]

The mark sits centred on a solid dark background (#0B0F14), rendered in teal
(#0EA5A5), occupying about 58% of the canvas width with even margin on all
sides.

Flat design: no gradient, no shadow, no glow, no bevel, no border, no texture.
Square canvas with square corners — the operating system applies its own mask.
Nothing else in the frame.
```

## 5. Cómo juzgar los resultados

Cuando tengas las imágenes, descarta rápido con estas tres preguntas. Son las que separan un logo de
un dibujo bonito:

1. **Achícalo a 16 píxeles.** Si se convierte en una mancha, no sirve — ahí es donde más se ve.
2. **Pásalo a negro sobre blanco.** Si depende del color para funcionar, no es un logo, es una
   ilustración.
3. **Descríbelo por teléfono en una frase.** Si no puedes, no tiene una idea detrás y no se va a
   recordar.

Un cuarto criterio, más difícil pero decisivo: **¿podría ser el logo de otra empresa de software
cualquiera?** Si la respuesta es sí, sigue buscando.
## 6. Antes de generar, una advertencia que ahorra tiempo

**Gemini devuelve PNG, no SVG.** Un logo en mapa de bits sirve para decidir el concepto, pero no
para producción: se pixela al escalar, pesa de más en un favicon y no puede cambiar de color con el
tema de la página.

La forma correcta de usar esto:

1. Genera cuatro o cinco imágenes por cada concepto de arriba.
2. Elige la que te convenza.
3. **Pásamela y la reconstruyo como SVG** —unos cientos de bytes, nítida a cualquier tamaño, con
   variante clara y oscura— y la integro en el sitio, el favicon, el manifest y la imagen de Open
   Graph.

El monograma que hay ahora mismo en el sitio —una A con el vértice plano— es solo un marcador de
posición para que la web no saliera sin marca. No pretende ser la solución final.

## 7. Uso del logo en el sitio

| Sitio | Versión |
|---|---|
| Cabecera sobre banda oscura | marca en `#0EA5A5` + palabra "Axchi" en blanco |
| Cabecera sobre fondo claro | marca en `#0F1720` + palabra en `#0F1720` |
| Favicon | marca en `#0EA5A5` sobre `#0B0F14` |
| Open Graph | marca sobre la banda oscura, a la izquierda del nombre |

Margen de protección: el ancho del trazo del monograma por cada lado. Nunca meter el logo dentro de
una caja de color que no sea la del favicon.
