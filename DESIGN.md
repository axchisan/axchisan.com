# Sistema de diseño — axchisan.com

Reescrito el 24 de septiembre de 2026 con el giro comercial (ver `REESTRUCTURACION.md`). La versión
anterior estaba escrita para reclutadores; queda en el historial de git.

## Brief

**Qué es:** Axchi, estudio de software de una persona en Bogotá, que vende páginas web, tiendas y
sistemas a negocios pequeños y medianos.

**Audiencia:** el dueño de un negocio (una veterinaria, una tienda, un restaurante), no técnico,
casi siempre desde el celular. Llega desde Google, Instagram o una recomendación de WhatsApp.
Se pregunta tres cosas: *¿esto me sirve a mí?, ¿cuánto cuesta?, ¿es de fiar?*

**Trabajo del sitio:** que la persona se reconozca en su sector, pruebe una demo que funciona y
escriba por WhatsApp sabiendo ya cuánto le costaría.

**Qué lo distingue:** no tiene que imaginarse nada. Cada solución tiene una demo real que se puede
abrir desde el celular, y el precio se ve antes de preguntar.

## Principios

1. **Las demos abren la página.** Lo primero que se puede hacer es probar algo, no leer un eslogan.
2. **El precio no se esconde.** "Desde $ 300.000" es visible en la portada, en planes y en cada ficha.
3. **Cada afirmación lleva una cifra o una demo que la respalde.** "Rápido" no; "3 días hábiles" sí.
4. **El cliente entiende cada frase sin saber de software.** Lo técnico existe, pero plegado o en `/a-medida`.
5. **El acento marca interacción, nunca decora.**
6. **Un solo momento de movimiento** al cargar. Lo demás responde a una acción.

## Color

Tema claro con bandas oscuras deliberadas (cabecera, portada, cierres). Contraste calculado, no
elegido a ojo: cualquier cambio obliga a correr `npx playwright test e2e/accesibilidad.spec.ts`.

| Ficha | Hex | Uso |
|---|---|---|
| `band` | `#0B0F14` | Bandas oscuras y fondo de la marca |
| `paper` | `#F3F6F9` | Cuerpo |
| `card` | `#FFFFFF` | Superficies |
| `ink` | `#0F1720` | Texto principal (16,6:1) |
| `mid` | `#4D5866` | Texto secundario (6,7:1) |
| `faint` | `#66707D` | Mínimo accesible (4,6:1) |
| `accent` | `#0EA5A5` | Interacción sobre la banda (6,4:1), botón principal |
| `accent-ink` | `#0B7C7C` | Texto de acento sobre claro (4,6:1) |
| `on-accent` | `#04201F` | Texto dentro del botón de acento (5,6:1) |

Los valores viven en `app/globals.css`; esta tabla solo los resume.

## Tipografía

- **Instrument Sans**, una sola familia para todo el sitio. Titulares en 600 con tracking cerrado; texto en 400 con altura de línea 1,65 y medida máxima de 68 caracteres.
- **JetBrains Mono**, solo donde hay código real (artículos técnicos). Nunca como etiqueta.
- Precios con `tabular-nums`, para que las cifras de una tabla se alineen.

Escala 1,25: `12 · 14 · 16 · 20 · 25 · 31 · 39 · 49 · 61`.

## Composición

- Todo alineado a la izquierda, salvo los cierres de página, que son una sola frase y un botón.
- Los sectores y las fichas **no** van en tres tarjetas iguales con la misma sombra: el peso de cada elemento responde a su contenido. Una demo disponible pesa más que un sector pendiente.
- Las capturas de las demos son siempre capturas reales, generadas por `npm run capturas`. Nunca una maqueta que prometa algo que la demo no hace.

## Iconografía

- **lucide-react**, trazo 1,75, tamaños 16 / 20 / 24. Sin emojis.
- Cada sector tiene un solo icono, definido en `lib/catalogo`, y se usa igual en todas partes.
- Marcas de terceros (WhatsApp, Instagram, GitHub) como SVG propios en `components/site/social-icons.tsx`.
- Los iconos de la aplicación salen del logo con `npm run iconos`.

## Voz

La marca habla como empresa ("te respondemos", "en Axchi…") y al cliente se le habla de tú. La
primera persona del singular solo aparece en `/empresa`, donde se presenta quién está detrás. Nunca
"nuestro equipo" ni "nuestros expertos": es una persona, y decir otra cosa es mentir.

| Así sí | Así no |
|---|---|
| Tus clientes piden cita desde el celular | Sistema de agendamiento omnicanal |
| Lista en 3 días hábiles | Entrega ágil |
| Desde $ 300.000 | Precios competitivos |
| Pruébala antes de contratar | Solicita una demo |
| El dominio y los datos quedan a tu nombre | Soluciones escalables y seguras |
| Cotizar por WhatsApp | Iniciar conversación |
| Te respondemos el mismo día hábil | Respondemos a la brevedad |
| Si una plataforma ya lo resuelve, te lo decimos | Soluciones a la medida de cada cliente |
| Recordatorios de vacunas que salen solos | Automatización inteligente con IA |
| Una página, un panel y tus datos | Ecosistema digital integral |

## Patrones prohibidos

Heredados de la versión anterior y vigentes (ver también `AGENTS.md`): versalitas monoespaciadas
como etiqueta, flechas pegadas al texto de un botón, cadenas de metadatos unidas por `·`, una
palabra del titular en otro color, animaciones de entrada por sección al hacer scroll, resplandores
radiales difuminados.

## Demos

Cada demo tiene su propia identidad y su brief en `docs/demos/`. Estas reglas no se les aplican,
salvo el piso de calidad y los patrones prohibidos. La barra de Axchi y el recorrido "Cómo funciona"
usan los colores del sitio, para que se distinga la explicación de la cosa explicada.

## Piso de calidad

Responsive desde 360 px, foco de teclado visible, `prefers-reduced-motion` respetado, contraste WCAG
AA verificado con axe en cada ruta pública y en cada demo.
