# Brief de demo — Orilla, hotel frente al mar

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

- Cada `<section data-scrub>` es un acto: una sección alta con un escenario sticky y un canvas. El
  motor pinta el fotograma que corresponde a lo recorrido. No hay `<video>`: el scroll hacia atrás
  y hacia adelante es exacto y no depende del códec.
- Fotogramas WebP en R2 (`demos/orilla/frames/actoN/`, 1600 px a 24 fps; `frames-m/`, 900 px a
  15 fps para celular). Se suben con `npx tsx scripts/subir-cinematico.ts <origen> <slug>`. El panel
  de medios oculta la carpeta `demos/` para que sus miles de archivos no llenen el listado.
- Carga en dos fases: primero uno de cada 16 fotogramas de todos los actos (la escena ya responde
  en cualquier punto), y después del evento `load` el detalle. Cada `Image` pendiente retrasa `load`,
  así que el detalle no puede empezar antes.
- Mientras llegan los fotogramas, el póster de cada acto queda detrás del canvas: nunca se ve un
  cuadro negro.
- Con `prefers-reduced-motion` o ahorro de datos no se descarga ningún fotograma: quedan los pósters.

## Decisiones de diseño

- Tinta casi negra sobre fotogramas y papel cálido en las secciones de lectura: el color lo pone el
  video, la interfaz se calla. Inter Tight ligera para títulos, Manrope para texto.
- Nada de etiquetas en versalitas espaciadas, que es lo que traía la prueba original: el nombre de
  cada acto va en minúscula normal, encima del título.
- La prueba original tenía testimonios. En una demo serían inventados, así que se cambiaron por
  información útil: cómo llegar, horarios de entrada y salida, niños y mascotas.
- Precios en pesos y horas en formato colombiano (6:30 a. m.).
