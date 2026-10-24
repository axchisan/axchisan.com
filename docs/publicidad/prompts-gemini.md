# Prompts para Gemini

Generado por `npx tsx scripts/publicidad.ts`: no se edita a mano.

## Cómo se usa

1. Abre [gemini.google.com](https://gemini.google.com) y un **chat nuevo por pieza**, para que no mezcle una con otra.
2. En la caja de texto, toca **Herramientas** y activa **Crear imágenes** (el ícono del banano). Sin eso, Gemini puede responder con código en lugar de una imagen.
3. Sube los archivos de **Adjunta**, que están en `docs/publicidad/adjuntos/`.
4. Copia el prompt completo y envíalo. Si responde con código, contesta `No quiero código. Genera la imagen.` Si el texto sale con un error: `Corrige solo el texto: debe decir exactamente «…». No cambies nada más.`
5. Descarga la imagen y guárdala en `docs/publicidad/generadas/` con el nombre de **Guardar como** (basta el código: `V03.png`).

Ninguna pieza muestra precios: todas llevan a la web a averiguarlo.

Las publicaciones del feed salen de `npx tsx scripts/redes.ts` y su calendario está en `docs/publicidad/redes.md`: aquí quedan solo las fotos que Gemini hace bien.

Las tarjetas y los volantes **no** se hacen con Gemini: llevan texto exacto y un QR que tiene que escanearse, y salen listos para la imprenta de `npx tsx scripts/impresos.ts` (ver `docs/publicidad/README.md`).

- [Portada](#portada): 1 piezas
- [Fotos de la oficina](#fotos-de-la-oficina): 10 piezas

## Portada

Para el Perfil de Google, Facebook y LinkedIn. Ya está hecha: `generadas/G01.jpg`.

### G01 · Portada del Perfil de Google y de redes

**Adjunta:** `logo.png`, `restaurantes-computador.png`, `veterinarias-celular.png`  
**Formato:** Horizontal 16:9, 1920 × 1080  
**Guardar como:** `G01.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una portada horizontal 16:9 (1920 x 1080 px).
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. A la derecha, un computador portátil con la captura adjunta "restaurantes-computador" y un celular con "veterinarias-celular". A la izquierda, con márgenes amplios: el logo y debajo, en blanco, "Páginas web, tiendas y sistemas para negocios en Colombia". Todo el texto dentro del 60 % central de la imagen: en el celular se recortan los bordes.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

## Fotos de la oficina

Una serie de fotos consistente: siempre el mismo escritorio blanco, el MacBook Air medianoche, el pothos y la taza. **Haz primero la O01**; todas las demás la usan de referencia para que parezcan de la misma sesión.

Son imágenes generadas: úsalas en redes, en la web y en publicaciones. Para las fotos del negocio en el Perfil de Google, Google pide fotos reales; ahí sube una foto tuya de verdad.

### O01 · Foto base de la oficina (hazla primero)

**Adjunta:** `pantalla-axchisan.png`  
**Formato:** Horizontal 3:2  
**Guardar como:** `O01.png`

Genera varias y quédate con la mejor. **Guárdala también como `docs/publicidad/adjuntos/oficina-base.jpg`**: es la referencia de todas las demás fotos de la oficina.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
En la pantalla del MacBook se ve la captura adjunta "pantalla-axchisan", nítida y sin reflejos fuertes.
Cámara a la altura del escritorio, ligeramente de frente, el computador un poco a la derecha del centro. Profundidad de campo suave. Formato horizontal 3:2, máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O02 · Oficina desde arriba

**Adjunta:** `oficina-base.jpg`, `restaurantes-computador.png`  
**Formato:** Cuadrada 1:1  
**Guardar como:** `O02.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el ángulo: vista cenital, desde arriba, con el MacBook abierto en el centro y la planta y la taza a los lados, con aire alrededor. En la pantalla se ve la captura adjunta "restaurantes-computador". Formato cuadrado 1:1, máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O03 · Primer plano de la pantalla

**Adjunta:** `oficina-base.jpg`, `programa-de-puntos-computador.png`  
**Formato:** Vertical 4:5  
**Guardar como:** `O03.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el encuadre: primer plano del MacBook, con la pantalla ocupando buena parte de la imagen y la hoja de la planta desenfocada en primer plano a la derecha. En la pantalla, la captura adjunta "programa-de-puntos-computador", nítida. Formato vertical 4:5, máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O04 · Oficina para historias, con espacio para texto

**Adjunta:** `oficina-base.jpg`, `pantalla-axchisan.png`  
**Formato:** Vertical 9:16  
**Guardar como:** `O04.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el formato: vertical 9:16. El escritorio ocupa el tercio inferior; los dos tercios superiores son pared blanca lisa y vacía, para poner texto encima después. En la pantalla, la captura adjunta "pantalla-axchisan". Máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O05 · Programando

**Adjunta:** `oficina-base.jpg`  
**Formato:** Horizontal 3:2  
**Guardar como:** `O05.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo la pantalla: un editor de código de tema oscuro con líneas de código de colores suaves, bien ordenadas; que no se lean palabras concretas. Mismo encuadre de la foto base. Formato horizontal 3:2, máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O06 · El Mac y un celular con una demo

**Adjunta:** `oficina-base.jpg`, `salones-y-barberias-computador.png`, `salones-y-barberias-celular.png`  
**Formato:** Vertical 4:5  
**Guardar como:** `O06.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Agrega solo un objeto: un celular negro sin marca, acostado sobre el escritorio frente al MacBook, con la captura adjunta "salones-y-barberias-celular" en su pantalla. En el MacBook, la captura "salones-y-barberias-computador". Formato vertical 4:5, máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O07 · Panorámica para portadas, con espacio a la izquierda

**Adjunta:** `oficina-base.jpg`, `pantalla-axchisan.png`  
**Formato:** Horizontal 16:9  
**Guardar como:** `O07.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el formato: panorámica 16:9. El escritorio con el MacBook, la planta y la taza queda en el tercio derecho; los dos tercios izquierdos son pared blanca lisa y vacía, para poner texto encima. En la pantalla, la captura adjunta "pantalla-axchisan". Máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O08 · La misma oficina al atardecer

**Adjunta:** `oficina-base.jpg`, `hoteles-y-turismo-computador.png`  
**Formato:** Horizontal 3:2  
**Guardar como:** `O08.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo la luz: atardecer, luz cálida y dorada entrando por la ventana, sombras un poco más largas. En la pantalla, la captura adjunta "hoteles-y-turismo-computador". Mismo encuadre de la foto base. Formato horizontal 3:2, máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O09 · Manos en el teclado

**Adjunta:** `oficina-base.jpg`, `inventario-y-ventas-computador.png`  
**Formato:** Vertical 4:5  
**Guardar como:** `O09.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Agrega solo unas manos escribiendo en el teclado del MacBook, vistas de cerca desde un lado, sin que se vea la cara ni el cuerpo; mangas de un suéter gris claro. En la pantalla, la captura adjunta "inventario-y-ventas-computador". Formato vertical 4:5, máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### O10 · Detalle de la planta y la taza

**Adjunta:** `oficina-base.jpg`  
**Formato:** Cuadrada 1:1  
**Guardar como:** `O10.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el encuadre: detalle de la planta y la taza en primer plano, nítidas, con el MacBook desenfocado al fondo. Formato cuadrado 1:1, máxima resolución.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

## Imprimir

- **Revisa el QR con tu celular** en la pieza de `listas/` antes de mandarla: debe abrir la página de su sector.
- **Pide a la imprenta** impresión con sangrado de 3 mm y una prueba de color: el verde azulado suele salir más apagado en papel.
- **Tarjetas:** propalcote de 300 g, plastificado mate por ambas caras. Si las quieres del tamaño de una tarjeta de crédito (8,5 × 5,4 cm) con esquinas redondeadas, pídelo con troquel: la imagen sirve igual.
- **Volantes:** propalcote de 150 g brillante para repartir; 250 g mate para dejar en mostradores.

## Medir

Cada QR lleva su origen. En `/admin`, **Visitas por publicidad** muestra cuántas visitas trajo cada pieza (`volante/restaurantes`, `tarjeta/general`…). Si una no trae visitas en dos semanas, cambia la frase antes de imprimir más.
