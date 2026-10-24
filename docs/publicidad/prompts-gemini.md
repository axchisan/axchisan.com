# Prompts para Gemini

Generado por `npx tsx scripts/publicidad.ts`: no se edita a mano.

## Cómo se usa

1. Abre [gemini.google.com](https://gemini.google.com) y un **chat nuevo por pieza**, para que no mezcle una con otra.
2. En la caja de texto, toca **Herramientas** y activa **Crear imágenes** (el ícono del banano). Sin eso, Gemini puede responder con código en lugar de una imagen.
3. Sube los archivos de **Adjunta**, que están en `docs/publicidad/adjuntos/`.
4. Copia el prompt completo y envíalo. Si responde con código, contesta `No quiero código. Genera la imagen.` Si el texto sale con un error: `Corrige solo el texto: debe decir exactamente «…». No cambies nada más.`
5. Descarga la imagen y guárdala en `docs/publicidad/generadas/` con el nombre de **Guardar como** (basta el código: `V03.png`).

Ninguna pieza muestra precios: todas llevan a la web a averiguarlo.

Las tarjetas y los volantes **no** se hacen con Gemini: llevan texto exacto y un QR que tiene que escanearse, y salen listos para la imprenta de `npx tsx scripts/impresos.ts` (ver `docs/publicidad/README.md`).

- [Historias](#historias): 15 piezas
- [Publicaciones](#publicaciones): 8 piezas
- [Portada](#portada): 1 piezas
- [Fotos de la oficina](#fotos-de-la-oficina): 10 piezas

## Historias

Para Instagram, Facebook y estados de WhatsApp. No llevan QR: en Instagram se les pone el sticker de enlace.

### H01 · Historia general: prueba antes de contratar

**Adjunta:** `logo.png`, `restaurantes-celular.png`, `veterinarias-celular.png`, `gimnasios-y-estudios-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H01.png`

En Instagram, agrega el sticker de enlace con `https://axchisan.com/?utm_source=instagram&utm_campaign=historia`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba, el logo pequeño y centrado. En el centro, tres celulares ligeramente inclinados en abanico, cada uno con una de las capturas adjuntas en la pantalla (restaurante, veterinaria y gimnasio).
Titular grande en blanco, arriba de los celulares: "Prueba la página de tu negocio antes de pagarla".
Debajo de los celulares, en gris claro: "Hay una demo funcionando para cada tipo de negocio".
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Mírala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H02 · Historia: ¿cuánto cuesta una página?

**Adjunta:** `logo-claro.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H02.png`

Sticker de enlace: `https://axchisan.com/planes?utm_source=instagram&utm_campaign=cuanto-cuesta`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: pieza clara, fondo #f3f6f9 y texto #0f1720. Arriba, el logo adjunto "logo-claro". En el centro, en letra grande y semibold: "¿Cuánto cuesta una página web para tu negocio?". Debajo, en gris: "Menos de lo que crees, y la pruebas antes de pagar." Más abajo, una flecha simple hacia abajo en verde azulado #0ea5a5, separada del texto. Abajo: "Averígualo en axchisan.com". Sin personas ni celulares. Mucho espacio en blanco.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H03 · Historia: Veterinarias

**Adjunta:** `logo.png`, `veterinarias-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H03.png`

Sticker de enlace: `https://axchisan.com/soluciones/veterinarias?utm_source=instagram&utm_campaign=veterinarias`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "veterinarias-celular" en la pantalla.
Titular en blanco, arriba del celular: "Citas, vacunas y recordatorios, sin cuaderno".
Línea en gris claro: "Así se vería la página de tu veterinaria. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H04 · Historia: Peluquerías y barberías

**Adjunta:** `logo.png`, `salones-y-barberias-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H04.png`

Sticker de enlace: `https://axchisan.com/soluciones/salones-y-barberias?utm_source=instagram&utm_campaign=salones-y-barberias`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "salones-y-barberias-celular" en la pantalla.
Titular en blanco, arriba del celular: "Que te reserven a las 11 de la noche, sin contestar".
Línea en gris claro: "Así se vería la página de tu peluquería. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H05 · Historia: Panaderías

**Adjunta:** `logo.png`, `panaderias-y-cafeterias-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H05.png`

Sticker de enlace: `https://axchisan.com/soluciones/panaderias-y-cafeterias?utm_source=instagram&utm_campaign=panaderias-y-cafeterias`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "panaderias-y-cafeterias-celular" en la pantalla.
Titular en blanco, arriba del celular: "Que sepan a qué hora sale el pan caliente".
Línea en gris claro: "Así se vería la página de tu panadería. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H06 · Historia: Abogados y contadores

**Adjunta:** `logo.png`, `abogados-y-contadores-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H06.png`

Sticker de enlace: `https://axchisan.com/soluciones/abogados-y-contadores?utm_source=instagram&utm_campaign=abogados-y-contadores`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "abogados-y-contadores-celular" en la pantalla.
Titular en blanco, arriba del celular: "Clientes que llegan con los documentos listos".
Línea en gris claro: "Así se vería la página de tu oficina. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H07 · Historia: Programa de puntos

**Adjunta:** `logo.png`, `programa-de-puntos-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H07.png`

Sticker de enlace: `https://axchisan.com/soluciones/programa-de-puntos?utm_source=instagram&utm_campaign=programa-de-puntos`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "programa-de-puntos-celular" en la pantalla.
Titular en blanco, arriba del celular: "Que tus clientes vuelvan por el café gratis".
Línea en gris claro: "Así se vería la página de tu negocio. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H08 · Historia: Inmobiliarias

**Adjunta:** `logo.png`, `inmobiliarias-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H08.png`

Sticker de enlace: `https://axchisan.com/soluciones/inmobiliarias?utm_source=instagram&utm_campaign=inmobiliarias`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "inmobiliarias-celular" en la pantalla.
Titular en blanco, arriba del celular: "Tus inmuebles con mapa, filtros y visitas agendadas".
Línea en gris claro: "Así se vería la página de tu inmobiliaria. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H09 · Historia: Gimnasios

**Adjunta:** `logo.png`, `gimnasios-y-estudios-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H09.png`

Sticker de enlace: `https://axchisan.com/soluciones/gimnasios-y-estudios?utm_source=instagram&utm_campaign=gimnasios-y-estudios`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "gimnasios-y-estudios-celular" en la pantalla.
Titular en blanco, arriba del celular: "Clases con cupo y membresías que avisan antes de vencer".
Línea en gris claro: "Así se vería la página de tu gimnasio. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H10 · Historia: Consultorios

**Adjunta:** `logo.png`, `consultorios-odontologicos-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H10.png`

Sticker de enlace: `https://axchisan.com/soluciones/consultorios-odontologicos?utm_source=instagram&utm_campaign=consultorios-odontologicos`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "consultorios-odontologicos-celular" en la pantalla.
Titular en blanco, arriba del celular: "Tus pacientes agendan solos desde el celular".
Línea en gris claro: "Así se vería la página de tu consultorio. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H11 · Historia: Tiendas de ropa

**Adjunta:** `logo.png`, `tiendas-de-ropa-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H11.png`

Sticker de enlace: `https://axchisan.com/soluciones/tiendas-de-ropa?utm_source=instagram&utm_campaign=tiendas-de-ropa`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "tiendas-de-ropa-celular" en la pantalla.
Titular en blanco, arriba del celular: "Vende tallas y colores con PSE y Nequi".
Línea en gris claro: "Así se vería la página de tu tienda de ropa. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H12 · Historia: Ferreterías y comercios

**Adjunta:** `logo.png`, `inventario-y-ventas-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H12.png`

Sticker de enlace: `https://axchisan.com/soluciones/inventario-y-ventas?utm_source=instagram&utm_campaign=inventario-y-ventas`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "inventario-y-ventas-celular" en la pantalla.
Titular en blanco, arriba del celular: "¿Cuánto te queda en bodega? Míralo en un segundo".
Línea en gris claro: "Así se vería la página de tu negocio. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H13 · Historia: Restaurantes

**Adjunta:** `logo.png`, `restaurantes-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H13.png`

Sticker de enlace: `https://axchisan.com/soluciones/restaurantes?utm_source=instagram&utm_campaign=restaurantes`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "restaurantes-celular" en la pantalla.
Titular en blanco, arriba del celular: "¿Tus pedidos llegan por WhatsApp y se pierden?".
Línea en gris claro: "Así se vería la página de tu restaurante. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H14 · Historia: Hoteles

**Adjunta:** `logo.png`, `hoteles-y-turismo-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H14.png`

Sticker de enlace: `https://axchisan.com/soluciones/hoteles-y-turismo?utm_source=instagram&utm_campaign=hoteles-y-turismo`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "hoteles-y-turismo-celular" en la pantalla.
Titular en blanco, arriba del celular: "Que recorran tu hotel antes de reservar".
Línea en gris claro: "Así se vería la página de tu hotel. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### H15 · Historia: Cosméticos

**Adjunta:** `logo.png`, `tiendas-de-cosmeticos-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H15.png`

Sticker de enlace: `https://axchisan.com/soluciones/tiendas-de-cosmeticos?utm_source=instagram&utm_campaign=tiendas-de-cosmeticos`.

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "tiendas-de-cosmeticos-celular" en la pantalla.
Titular en blanco, arriba del celular: "Tu tienda de cosméticos, vendiendo por internet".
Línea en gris claro: "Así se vería la página de tu tienda. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

## Publicaciones

Para el feed de Instagram y Facebook. P02 a P07 son un carrusel: se publican juntas, en orden.

### P01 · Publicación: antes y después

**Adjunta:** `logo.png`, `veterinarias-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P01.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una publicación vertical 4:5 (1080 x 1350 px) para Instagram y Facebook, dividida en dos mitades.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Mitad superior, en tonos grises apagados: un cuaderno de citas lleno de tachones y un celular con muchos mensajes sin leer. Texto pequeño arriba a la izquierda: "Antes".
Mitad inferior, fondo casi negro #0b0f14: un computador portátil con la captura adjunta "veterinarias-computador" en la pantalla. Texto pequeño: "Con tu página".
Sobre la línea que divide las mitades, una franja oscura con el titular en blanco: "Tu negocio, ordenado desde el celular".
Abajo a la derecha, el logo. Abajo a la izquierda, en gris claro: "Mira cómo funciona en axchisan.com".
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### P02 · Carrusel 1 de 6: portada

**Adjunta:** `logo.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P02.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una imagen vertical 4:5 (1080 x 1350 px), portada de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Titular grande en blanco, alineado a la izquierda y a media altura: "¿Página, tienda o sistema? Qué necesita tu negocio". Abajo a la izquierda, en gris claro: "Desliza". Abajo a la derecha, el logo pequeño. Mucho espacio vacío.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### P03 · Carrusel 2 de 6: si te buscan en google

**Adjunta:** `logo.png`, `abogados-y-contadores-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P03.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "1". Debajo, titular en blanco: "Si te buscan en Google". Debajo, en gris claro: "Una página con tus servicios, horario y WhatsApp.". En la mitad inferior, un computador portátil con la captura adjunta "abogados-y-contadores-computador" en la pantalla. Abajo a la derecha, el logo pequeño.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### P04 · Carrusel 3 de 6: si vendes productos

**Adjunta:** `logo.png`, `tiendas-de-ropa-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P04.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "2". Debajo, titular en blanco: "Si vendes productos". Debajo, en gris claro: "Una tienda con carrito y pagos con PSE y Nequi.". En la mitad inferior, un computador portátil con la captura adjunta "tiendas-de-ropa-computador" en la pantalla. Abajo a la derecha, el logo pequeño.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### P05 · Carrusel 4 de 6: si das citas

**Adjunta:** `logo.png`, `veterinarias-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P05.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "3". Debajo, titular en blanco: "Si das citas". Debajo, en gris claro: "Reservas en línea y la agenda del día en tu celular.". En la mitad inferior, un computador portátil con la captura adjunta "veterinarias-computador" en la pantalla. Abajo a la derecha, el logo pequeño.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### P06 · Carrusel 5 de 6: si llevas inventario

**Adjunta:** `logo.png`, `inventario-y-ventas-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P06.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "4". Debajo, titular en blanco: "Si llevas inventario". Debajo, en gris claro: "Existencias, caja y reportes para Excel.". En la mitad inferior, un computador portátil con la captura adjunta "inventario-y-ventas-computador" en la pantalla. Abajo a la derecha, el logo pequeño.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### P07 · Carrusel 6 de 6: cierre

**Adjunta:** `logo.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P07.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una imagen vertical 4:5 (1080 x 1350 px), última diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Centrado: el logo, debajo el titular en blanco "Prueba la demo de tu negocio" y en verde azulado #0ea5a5 "axchisan.com". Mucho espacio vacío.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

### P08 · Imagen cuadrada para compartir por WhatsApp

**Adjunta:** `logo.png`, `restaurantes-celular.png`, `programa-de-puntos-celular.png`  
**Formato:** Cuadrada 1:1, 1080 × 1080  
**Guardar como:** `P08.png`

```text
Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones.
Crea una imagen cuadrada 1:1 (1080 x 1080 px) para compartir por WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Centrado: el logo, debajo el titular en blanco "Páginas web, tiendas y sistemas para tu negocio" y una línea en gris claro "Pruébalos funcionando antes de contratar". Abajo, en verde azulado #0ea5a5: "axchisan.com". A los lados, dos celulares recortados por el borde de la imagen, con las capturas adjuntas en la pantalla.
Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código.
```

## Portada

Para el Perfil de Google, Facebook y LinkedIn.

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
