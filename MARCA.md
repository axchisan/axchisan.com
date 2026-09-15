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

## 3. Prompt para Gemini

Copia esto tal cual. Está en inglés a propósito: los modelos de imagen responden mejor y con menos
deriva a las instrucciones tipográficas en inglés.

```
Flat vector logo mark for a software engineering studio called "Axchi".

Subject: a geometric monogram of the letter A, built from strokes of uniform
weight, with the apex cut flat instead of coming to a point — a short horizontal
segment joins the two diagonals at the top. The crossbar sits slightly below
centre. The counter (the space inside the A) stays open and generous.

Style: Swiss/international typographic tradition. Precise, constructed, calm.
Uniform stroke weight throughout. Corners very slightly rounded, about 2px at a
64px size — enough to feel considered, not enough to look soft.

Color: a single flat colour, teal #0EA5A5, on a pure white background. No second
colour anywhere.

Hard constraints:
- absolutely flat: no gradient, no shadow, no bevel, no glow, no 3D, no texture
- no outline or border around the mark
- no container shape: no circle, no rounded square, no badge, no hexagon
- no text, no letters other than the A itself, no tagline
- centred, generous empty margin around the mark
- must stay legible when scaled down to 16×16 pixels

Avoid entirely: circuit-board patterns, neural networks, connected nodes, brains,
rockets, angle brackets, chevrons, swooshes, gradient meshes, glassmorphism.

Output: a single mark on white, nothing else in the frame.
```

### Variantes que vale la pena probar

Cambia solo el bloque `Subject:` y deja el resto igual:

**B — monograma AX ligado**
```
Subject: a monogram of the letters A and X, sharing one diagonal stroke so the two
letters read as a single connected form. Uniform stroke weight. The shared diagonal
is what makes it work — it should be immediately legible as both letters at once.
```

**C — la A como forma sólida negativa**
```
Subject: a solid filled square with slightly rounded corners, with the letter A cut
out of it as negative space so the background shows through. The A is geometric and
centred, its counter also cut through. High contrast, no outline.
```

**D — marca abstracta derivada de la A**
```
Subject: an abstract mark derived from the apex of a letter A — two strokes meeting
at a precise angle at the top, with the lower ends left open. It should suggest the
letter without completing it. Uniform stroke weight, generous negative space.
```

### Para el icono de la aplicación (favicon y PWA)

```
App icon, 512×512. The Axchi monogram mark centred on a solid dark background
(#0B0F14), with the mark itself in teal #0EA5A5. The mark occupies about 58% of
the canvas width, centred both axes, with even margin on all sides.

Flat design: no gradient, no shadow, no glow, no bevel, no border, no texture.
Square canvas with no rounded corners — the operating system applies its own mask.
Nothing else in the frame.
```

## 4. Antes de generar, una advertencia que ahorra tiempo

**Gemini devuelve PNG, no SVG.** Un logo en mapa de bits sirve para decidir el concepto, pero no
para producción: se pixela al escalar, pesa de más en un favicon y no puede cambiar de color con el
tema de la página.

La forma correcta de usar esto:

1. Genera varias opciones con los prompts de arriba.
2. Elige la que te convenza.
3. **Pásamela y la reconstruyo como SVG** —unos cientos de bytes, nítida a cualquier tamaño, con
   variante clara y oscura— y la integro en el sitio, el favicon, el manifest y la imagen de Open
   Graph.

Si prefieres saltarte Gemini, puedo dibujar directamente dos o tres propuestas en SVG a partir de
este brief y las comparas en pantalla.

## 5. Uso del logo en el sitio

| Sitio | Versión |
|---|---|
| Cabecera sobre banda oscura | marca en `#0EA5A5` + palabra "Axchi" en blanco |
| Cabecera sobre fondo claro | marca en `#0F1720` + palabra en `#0F1720` |
| Favicon | marca en `#0EA5A5` sobre `#0B0F14` |
| Open Graph | marca sobre la banda oscura, a la izquierda del nombre |

Margen de protección: el ancho del trazo del monograma por cada lado. Nunca meter el logo dentro de
una caja de color que no sea la del favicon.
