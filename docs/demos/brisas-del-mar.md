# Brief de demo — Hotel Brisas del Mar

Nombre elegido por el dueño del sitio (antes "Orilla"). Hay hoteles reales con ese nombre en Santa
Marta, Coveñas y Cartagena: la demo lo aclara al pie como negocio ficticio y no usa ninguna de sus
fotos ni direcciones.

Primera demo del motor cinematográfico (`demos/motores/cinematico/scrub.ts`) y la que justifica el
plan **Página cinematográfica** y el módulo **Portada cinematográfica** (`lib/catalogo/planes.ts`).
Nació de las pruebas de `~/Documents/Dev/PaginasScroll/hotel-orilla`.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** hotel boutique en una bahía del Caribe, 84 habitaciones en dos alas curvas.
- **Quién usa la página:** viajeros que comparan hoteles desde el celular. Deciden por cómo se ve el
  lugar, y casi siempre terminan en una plataforma de reservas que cobra comisión.
- **Quién juzga la demo:** dueños de hoteles, glampings, fincas turísticas y, con el mismo motor,
  constructoras e inmobiliarias con proyectos sobre plano.
- **Trabajo de la página:** que el lugar se sienta antes de preguntar, y que la pregunta llegue
  directo por WhatsApp.

## Cómo funciona

- Cada `<section data-scrub>` es un acto: una sección alta con un escenario sticky y un `<video>`.
  El motor (`demos/motores/cinematico/scrub.ts`) lleva el video al instante que corresponde a lo
  recorrido, con una inercia de 0,08 s que suaviza la rueda del mouse.
- Un MP4 por acto y por pantalla, en R2 (`demos/orilla/video/`): `actoN-d.mp4` de 1920×1080 para
  escritorio y `actoN-m.mp4` vertical de 608×1080 para celular, recortado del centro de la toma
  original. Se generan con `scripts/codificar-cinematico.sh` y se suben con
  `npx tsx scripts/subir-cinematico.ts <origen> <slug>`.
- Lo que hace posible el scrub es la codificación: un fotograma clave cada 6 (`-g 6`), sin
  fotogramas B y sin audio. Saltar a cualquier instante decodifica como mucho 5 fotogramas.
- El video se descarga entero con `fetch` y se reproduce desde memoria (blob). Así cada salto es
  local; con `src` directo, Safari vuelve a pedir rangos a la red y el scrub se traba. Por eso el
  bucket tiene una regla CORS de solo lectura (GET y HEAD) para axchisan.com y los puertos locales.
- Los videos se piden en orden después del evento `load`. Mientras llegan se ve el póster (el
  primer fotograma de cada video, horizontal o vertical según la pantalla) y el video aparece con
  un fundido.
- Con `prefers-reduced-motion` o ahorro de datos no se descarga ningún video: quedan los pósters.

### Por qué se cambió la secuencia de imágenes (28 sep 2026)

La primera versión pintaba en un canvas 627 fotogramas WebP de 1600 px. Medido en producción:

| | Secuencia de imágenes | Video |
|---|---|---|
| Descarga en escritorio | 53 MB en 627 archivos | 22 MB en 3 archivos |
| Descarga en celular | 18 MB | 7,9 MB |
| Resolución | 1600 px estirados a 1920; en celular, el centro de la toma ampliado | 1920 nativo; vertical nativo en celular |
| A los 5 s de abrir | 1 de cada 16 fotogramas: el video avanza a saltos | la primera escena completa (conexión rápida) |
| Salto a un instante | decodificación de WebP en el hilo principal | 4 a 7 ms, decodificado por hardware (Chrome y Safari) |

La sensación de "lag" era sobre todo la carga: quien bajaba antes de que llegaran los fotogramas
veía la escena saltar en pasos de dos tercios de segundo.

Pendiente: los fotogramas viejos (`demos/orilla/frames/`, `frames-m/`) siguen en R2 sin uso. Se
pueden borrar cuando se confirme la versión nueva en celulares reales.

## Decisiones de diseño

- Tinta casi negra sobre fotogramas y papel cálido en las secciones de lectura: el color lo pone el
  video, la interfaz se calla. Inter Tight ligera para títulos, Manrope para texto.
- Nada de etiquetas en versalitas espaciadas, que es lo que traía la prueba original: el nombre de
  cada acto va en minúscula normal, encima del título.
- La prueba original tenía testimonios. En una demo serían inventados, así que se cambiaron por
  información útil: cómo llegar, horarios de entrada y salida, niños y mascotas.
- Precios en pesos y horas en formato colombiano (6:30 a. m.).
