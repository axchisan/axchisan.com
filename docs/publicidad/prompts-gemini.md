# Prompts para Gemini

Generado por `npx tsx scripts/publicidad.ts`: no se edita a mano.

## Cómo se usa

1. Abre [gemini.google.com](https://gemini.google.com) con el modelo de imágenes (Nano Banana Pro). Un **chat nuevo por pieza**, para que no mezcle una con otra.
2. Sube los archivos de **Adjunta**, que están en `docs/publicidad/adjuntos/`.
3. Copia el prompt completo y envíalo. Si el texto sale con un error, responde: `Corrige solo el texto: debe decir exactamente «…». No cambies nada más.`
4. Descarga la imagen y guárdala en `docs/publicidad/generadas/` con el nombre de **Guardar como** (basta el código: `V03.png`).
5. Las que dicen **Lleva QR** salen con un cuadro blanco vacío: avísame y les pego el QR de su sector (`npx tsx scripts/pegar-qr.ts`). Quedan en `docs/publicidad/listas/`.

Ninguna pieza muestra precios: todas llevan a la web a averiguarlo.

- [Historias](#historias): 15 piezas
- [Publicaciones](#publicaciones): 8 piezas
- [Portada](#portada): 1 piezas
- [Volantes](#volantes): 15 piezas
- [Tarjetas](#tarjetas): 15 piezas
- [Fotos de la oficina](#fotos-de-la-oficina): 10 piezas

## Historias

Para Instagram, Facebook y estados de WhatsApp. No llevan QR: en Instagram se les pone el sticker de enlace.

### H01 · Historia general: prueba antes de contratar

**Adjunta:** `logo.png`, `restaurantes-celular.png`, `veterinarias-celular.png`, `gimnasios-y-estudios-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H01.png`

En Instagram, agrega el sticker de enlace con `https://axchisan.com/?utm_source=instagram&utm_campaign=historia`.

```text
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
```

### H02 · Historia: ¿cuánto cuesta una página?

**Adjunta:** `logo-claro.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H02.png`

Sticker de enlace: `https://axchisan.com/planes?utm_source=instagram&utm_campaign=cuanto-cuesta`.

```text
Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Composición: pieza clara, fondo #f3f6f9 y texto #0f1720. Arriba, el logo adjunto "logo-claro". En el centro, en letra grande y semibold: "¿Cuánto cuesta una página web para tu negocio?". Debajo, en gris: "Menos de lo que crees, y la pruebas antes de pagar." Más abajo, una flecha simple hacia abajo en verde azulado #0ea5a5, separada del texto. Abajo: "Averígualo en axchisan.com". Sin personas ni celulares. Mucho espacio en blanco.
```

### H03 · Historia: Veterinarias

**Adjunta:** `logo.png`, `veterinarias-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H03.png`

Sticker de enlace: `https://axchisan.com/soluciones/veterinarias?utm_source=instagram&utm_campaign=veterinarias`.

```text
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
```

### H04 · Historia: Peluquerías y barberías

**Adjunta:** `logo.png`, `salones-y-barberias-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H04.png`

Sticker de enlace: `https://axchisan.com/soluciones/salones-y-barberias?utm_source=instagram&utm_campaign=salones-y-barberias`.

```text
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
```

### H05 · Historia: Panaderías

**Adjunta:** `logo.png`, `panaderias-y-cafeterias-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H05.png`

Sticker de enlace: `https://axchisan.com/soluciones/panaderias-y-cafeterias?utm_source=instagram&utm_campaign=panaderias-y-cafeterias`.

```text
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
```

### H06 · Historia: Abogados y contadores

**Adjunta:** `logo.png`, `abogados-y-contadores-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H06.png`

Sticker de enlace: `https://axchisan.com/soluciones/abogados-y-contadores?utm_source=instagram&utm_campaign=abogados-y-contadores`.

```text
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
```

### H07 · Historia: Programa de puntos

**Adjunta:** `logo.png`, `programa-de-puntos-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H07.png`

Sticker de enlace: `https://axchisan.com/soluciones/programa-de-puntos?utm_source=instagram&utm_campaign=programa-de-puntos`.

```text
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
```

### H08 · Historia: Inmobiliarias

**Adjunta:** `logo.png`, `inmobiliarias-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H08.png`

Sticker de enlace: `https://axchisan.com/soluciones/inmobiliarias?utm_source=instagram&utm_campaign=inmobiliarias`.

```text
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
```

### H09 · Historia: Gimnasios

**Adjunta:** `logo.png`, `gimnasios-y-estudios-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H09.png`

Sticker de enlace: `https://axchisan.com/soluciones/gimnasios-y-estudios?utm_source=instagram&utm_campaign=gimnasios-y-estudios`.

```text
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
```

### H10 · Historia: Consultorios

**Adjunta:** `logo.png`, `consultorios-odontologicos-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H10.png`

Sticker de enlace: `https://axchisan.com/soluciones/consultorios-odontologicos?utm_source=instagram&utm_campaign=consultorios-odontologicos`.

```text
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
```

### H11 · Historia: Tiendas de ropa

**Adjunta:** `logo.png`, `tiendas-de-ropa-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H11.png`

Sticker de enlace: `https://axchisan.com/soluciones/tiendas-de-ropa?utm_source=instagram&utm_campaign=tiendas-de-ropa`.

```text
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
```

### H12 · Historia: Ferreterías y comercios

**Adjunta:** `logo.png`, `inventario-y-ventas-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H12.png`

Sticker de enlace: `https://axchisan.com/soluciones/inventario-y-ventas?utm_source=instagram&utm_campaign=inventario-y-ventas`.

```text
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
```

### H13 · Historia: Restaurantes

**Adjunta:** `logo.png`, `restaurantes-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H13.png`

Sticker de enlace: `https://axchisan.com/soluciones/restaurantes?utm_source=instagram&utm_campaign=restaurantes`.

```text
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
```

### H14 · Historia: Hoteles

**Adjunta:** `logo.png`, `hoteles-y-turismo-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H14.png`

Sticker de enlace: `https://axchisan.com/soluciones/hoteles-y-turismo?utm_source=instagram&utm_campaign=hoteles-y-turismo`.

```text
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
```

### H15 · Historia: Cosméticos

**Adjunta:** `logo.png`, `tiendas-de-cosmeticos-celular.png`  
**Formato:** Vertical 9:16, 1080 × 1920  
**Guardar como:** `H15.png`

Sticker de enlace: `https://axchisan.com/soluciones/tiendas-de-cosmeticos?utm_source=instagram&utm_campaign=tiendas-de-cosmeticos`.

```text
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
```

## Publicaciones

Para el feed de Instagram y Facebook. P02 a P07 son un carrusel: se publican juntas, en orden.

### P01 · Publicación: antes y después

**Adjunta:** `logo.png`, `veterinarias-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P01.png`

```text
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
```

### P02 · Carrusel 1 de 6: portada

**Adjunta:** `logo.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P02.png`

```text
Crea una imagen vertical 4:5 (1080 x 1350 px), portada de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Titular grande en blanco, alineado a la izquierda y a media altura: "¿Página, tienda o sistema? Qué necesita tu negocio". Abajo a la izquierda, en gris claro: "Desliza". Abajo a la derecha, el logo pequeño. Mucho espacio vacío.
```

### P03 · Carrusel 2 de 6: si te buscan en google

**Adjunta:** `logo.png`, `abogados-y-contadores-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P03.png`

```text
Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "1". Debajo, titular en blanco: "Si te buscan en Google". Debajo, en gris claro: "Una página con tus servicios, horario y WhatsApp.". En la mitad inferior, un computador portátil con la captura adjunta "abogados-y-contadores-computador" en la pantalla. Abajo a la derecha, el logo pequeño.
```

### P04 · Carrusel 3 de 6: si vendes productos

**Adjunta:** `logo.png`, `tiendas-de-ropa-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P04.png`

```text
Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "2". Debajo, titular en blanco: "Si vendes productos". Debajo, en gris claro: "Una tienda con carrito y pagos con PSE y Nequi.". En la mitad inferior, un computador portátil con la captura adjunta "tiendas-de-ropa-computador" en la pantalla. Abajo a la derecha, el logo pequeño.
```

### P05 · Carrusel 4 de 6: si das citas

**Adjunta:** `logo.png`, `veterinarias-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P05.png`

```text
Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "3". Debajo, titular en blanco: "Si das citas". Debajo, en gris claro: "Reservas en línea y la agenda del día en tu celular.". En la mitad inferior, un computador portátil con la captura adjunta "veterinarias-computador" en la pantalla. Abajo a la derecha, el logo pequeño.
```

### P06 · Carrusel 5 de 6: si llevas inventario

**Adjunta:** `logo.png`, `inventario-y-ventas-computador.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P06.png`

```text
Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "4". Debajo, titular en blanco: "Si llevas inventario". Debajo, en gris claro: "Existencias, caja y reportes para Excel.". En la mitad inferior, un computador portátil con la captura adjunta "inventario-y-ventas-computador" en la pantalla. Abajo a la derecha, el logo pequeño.
```

### P07 · Carrusel 6 de 6: cierre

**Adjunta:** `logo.png`  
**Formato:** Vertical 4:5, 1080 × 1350  
**Guardar como:** `P07.png`

```text
Crea una imagen vertical 4:5 (1080 x 1350 px), última diapositiva de un carrusel de Instagram.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Centrado: el logo, debajo el titular en blanco "Prueba la demo de tu negocio" y en verde azulado #0ea5a5 "axchisan.com". Mucho espacio vacío.
```

### P08 · Imagen cuadrada para compartir por WhatsApp

**Adjunta:** `logo.png`, `restaurantes-celular.png`, `programa-de-puntos-celular.png`  
**Formato:** Cuadrada 1:1, 1080 × 1080  
**Guardar como:** `P08.png`

```text
Crea una imagen cuadrada 1:1 (1080 x 1080 px) para compartir por WhatsApp.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. Centrado: el logo, debajo el titular en blanco "Páginas web, tiendas y sistemas para tu negocio" y una línea en gris claro "Pruébalos funcionando antes de contratar". Abajo, en verde azulado #0ea5a5: "axchisan.com". A los lados, dos celulares recortados por el borde de la imagen, con las capturas adjuntas en la pantalla.
```

## Portada

Para el Perfil de Google, Facebook y LinkedIn.

### G01 · Portada del Perfil de Google y de redes

**Adjunta:** `logo.png`, `restaurantes-computador.png`, `veterinarias-celular.png`  
**Formato:** Horizontal 16:9, 1920 × 1080  
**Guardar como:** `G01.png`

```text
Crea una portada horizontal 16:9 (1920 x 1080 px).
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14. A la derecha, un computador portátil con la captura adjunta "restaurantes-computador" y un celular con "veterinarias-celular". A la izquierda, con márgenes amplios: el logo y debajo, en blanco, "Páginas web, tiendas y sistemas para negocios en Colombia". Todo el texto dentro del 60 % central de la imagen: en el celular se recortan los bordes.
```

## Volantes

Media carta para imprimir. V02 es el reverso de todos. Llevan QR.

### V01 · Volante general, cara

**Adjunta:** `logo.png`, `restaurantes-computador.png`, `veterinarias-celular.png`, `gimnasios-y-estudios-celular.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V01.png`  
**Lleva QR:** `volante-general`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios: ningún texto cerca del borde.
Arriba, el logo. Titular grande en blanco: "Tu negocio merece una página que venda". Subtítulo en gris claro: "Páginas web, tiendas en línea y sistemas de citas, pedidos e inventario".
En el centro, un computador portátil y dos celulares con las capturas adjuntas en las pantallas.
Tres líneas cortas, cada una con un pequeño punto verde azulado #0ea5a5 al inicio: "Pruébala funcionando antes de contratar", "Todo queda a tu nombre", "Te atendemos por WhatsApp".
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Abajo a la izquierda, junto al cuadrado: "Escanea y mira la demo de tu negocio" y debajo "axchisan.com".
```

### V02 · Volante, reverso (sirve para todos)

**Adjunta:** `logo-claro.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V02.png`

```text
Crea el reverso de un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Pieza clara: fondo #f3f6f9 hasta los bordes, texto #0f1720, márgenes internos amplios. Arriba, el logo adjunto "logo-claro" pequeño.
Titular: "¿Qué tipo de negocio tienes?".
Una cuadrícula de 12 recuadros iguales, cada uno con un ícono lineal simple en verde azulado #0ea5a5 y su nombre debajo: Restaurante, Veterinaria, Peluquería, Consultorio, Ferretería, Tienda de ropa, Inmobiliaria, Gimnasio, Panadería, Abogados, Hotel, Café.
Abajo: "Para cada uno hay una demo funcionando en axchisan.com. Averigua cuánto cuesta la tuya en la web." Y en una línea aparte: "WhatsApp +57 318 303 8190".
```

### V03 · Volante: Veterinarias

**Adjunta:** `logo.png`, `veterinarias-celular.png`, `veterinarias-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V03.png`  
**Lleva QR:** `volante-veterinarias`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Citas, vacunas y recordatorios, sin cuaderno". Subtítulo en gris claro: "Tus clientes agendan desde el celular y tú ves la agenda del día.".
En el centro, un celular y un computador portátil con las capturas adjuntas "veterinarias-celular" y "veterinarias-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu veterinaria. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V04 · Volante: Peluquerías y barberías

**Adjunta:** `logo.png`, `salones-y-barberias-celular.png`, `salones-y-barberias-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V04.png`  
**Lleva QR:** `volante-salones-y-barberias`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Que te reserven a las 11 de la noche, sin contestar". Subtítulo en gris claro: "Reservas en línea con el profesional y la hora que quieren.".
En el centro, un celular y un computador portátil con las capturas adjuntas "salones-y-barberias-celular" y "salones-y-barberias-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu peluquería. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V05 · Volante: Panaderías

**Adjunta:** `logo.png`, `panaderias-y-cafeterias-celular.png`, `panaderias-y-cafeterias-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V05.png`  
**Lleva QR:** `volante-panaderias-y-cafeterias`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Que sepan a qué hora sale el pan caliente". Subtítulo en gris claro: "Pedidos para recoger y tortas por encargo.".
En el centro, un celular y un computador portátil con las capturas adjuntas "panaderias-y-cafeterias-celular" y "panaderias-y-cafeterias-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu panadería. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V06 · Volante: Abogados y contadores

**Adjunta:** `logo.png`, `abogados-y-contadores-celular.png`, `abogados-y-contadores-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V06.png`  
**Lleva QR:** `volante-abogados-y-contadores`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Clientes que llegan con los documentos listos". Subtítulo en gris claro: "Una página que da confianza antes de la primera llamada.".
En el centro, un celular y un computador portátil con las capturas adjuntas "abogados-y-contadores-celular" y "abogados-y-contadores-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu oficina. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V07 · Volante: Programa de puntos

**Adjunta:** `logo.png`, `programa-de-puntos-celular.png`, `programa-de-puntos-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V07.png`  
**Lleva QR:** `volante-programa-de-puntos`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Que tus clientes vuelvan por el café gratis". Subtítulo en gris claro: "Puntos, sellos y cupones en el celular de tus clientes.".
En el centro, un celular y un computador portátil con las capturas adjuntas "programa-de-puntos-celular" y "programa-de-puntos-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu negocio. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V08 · Volante: Inmobiliarias

**Adjunta:** `logo.png`, `inmobiliarias-celular.png`, `inmobiliarias-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V08.png`  
**Lleva QR:** `volante-inmobiliarias`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Tus inmuebles con mapa, filtros y visitas agendadas". Subtítulo en gris claro: "Una página propia, sin depender solo de los portales.".
En el centro, un celular y un computador portátil con las capturas adjuntas "inmobiliarias-celular" y "inmobiliarias-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu inmobiliaria. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V09 · Volante: Gimnasios

**Adjunta:** `logo.png`, `gimnasios-y-estudios-celular.png`, `gimnasios-y-estudios-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V09.png`  
**Lleva QR:** `volante-gimnasios-y-estudios`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Clases con cupo y membresías que avisan antes de vencer". Subtítulo en gris claro: "Tus socios reservan su puesto desde el celular.".
En el centro, un celular y un computador portátil con las capturas adjuntas "gimnasios-y-estudios-celular" y "gimnasios-y-estudios-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu gimnasio. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V10 · Volante: Consultorios

**Adjunta:** `logo.png`, `consultorios-odontologicos-celular.png`, `consultorios-odontologicos-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V10.png`  
**Lleva QR:** `volante-consultorios-odontologicos`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Tus pacientes agendan solos desde el celular". Subtítulo en gris claro: "Agenda, odontograma y presupuestos en un solo lugar.".
En el centro, un celular y un computador portátil con las capturas adjuntas "consultorios-odontologicos-celular" y "consultorios-odontologicos-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu consultorio. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V11 · Volante: Tiendas de ropa

**Adjunta:** `logo.png`, `tiendas-de-ropa-celular.png`, `tiendas-de-ropa-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V11.png`  
**Lleva QR:** `volante-tiendas-de-ropa`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Vende tallas y colores con PSE y Nequi". Subtítulo en gris claro: "Tu colección en línea, con inventario por talla.".
En el centro, un celular y un computador portátil con las capturas adjuntas "tiendas-de-ropa-celular" y "tiendas-de-ropa-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu tienda de ropa. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V12 · Volante: Ferreterías y comercios

**Adjunta:** `logo.png`, `inventario-y-ventas-celular.png`, `inventario-y-ventas-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V12.png`  
**Lleva QR:** `volante-inventario-y-ventas`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "¿Cuánto te queda en bodega? Míralo en un segundo". Subtítulo en gris claro: "Inventario, caja y reportes para Excel.".
En el centro, un celular y un computador portátil con las capturas adjuntas "inventario-y-ventas-celular" y "inventario-y-ventas-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu negocio. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V13 · Volante: Restaurantes

**Adjunta:** `logo.png`, `restaurantes-celular.png`, `restaurantes-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V13.png`  
**Lleva QR:** `volante-restaurantes`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "¿Tus pedidos llegan por WhatsApp y se pierden?". Subtítulo en gris claro: "Carta con QR, pedidos a domicilio y pantalla de cocina.".
En el centro, un celular y un computador portátil con las capturas adjuntas "restaurantes-celular" y "restaurantes-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu restaurante. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V14 · Volante: Hoteles

**Adjunta:** `logo.png`, `hoteles-y-turismo-celular.png`, `hoteles-y-turismo-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V14.png`  
**Lleva QR:** `volante-hoteles-y-turismo`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Que recorran tu hotel antes de reservar". Subtítulo en gris claro: "Una página con video que avanza con el scroll.".
En el centro, un celular y un computador portátil con las capturas adjuntas "hoteles-y-turismo-celular" y "hoteles-y-turismo-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu hotel. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

### V15 · Volante: Cosméticos

**Adjunta:** `logo.png`, `tiendas-de-cosmeticos-celular.png`, `tiendas-de-cosmeticos-computador.png`  
**Formato:** Vertical media carta, 14 × 21,6 cm  
**Guardar como:** `V15.png`  
**Lleva QR:** `volante-tiendas-de-cosmeticos`

```text
Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "Tu tienda de cosméticos, vendiendo por internet". Subtítulo en gris claro: "Catálogo, carrito y pagos en línea.".
En el centro, un celular y un computador portátil con las capturas adjuntas "tiendas-de-cosmeticos-celular" y "tiendas-de-cosmeticos-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de tu tienda. Es una demo real: tócala desde tu celular."
Abajo a la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

## Tarjetas

9 × 5 cm, el tamaño usual en Colombia. T02 es el reverso de todas. Llevan QR.

### T01 · Tarjeta de presentación, cara

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T01.png`

```text
Crea la cara de una tarjeta de presentación horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios. Centrado: el logo grande. Debajo, en gris claro y letra pequeña: "Páginas web, tiendas y sistemas para tu negocio". Nada más.
```

### T02 · Tarjeta de presentación, reverso con tus datos

**Adjunta:** `logo-claro.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T02.png`  
**Lleva QR:** `tarjeta-general`

```text
Crea el reverso de una tarjeta de presentación horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Pieza clara: fondo #f3f6f9 hasta los bordes, texto #0f1720, márgenes internos amplios.
A la izquierda, en cuatro líneas: "Duvan Yair Arciniegas", "Axchi" en verde azulado #0b7c7c, "WhatsApp +57 318 303 8190", "contacto@axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Del alto de las cuatro líneas de texto.
Debajo del cuadrado, en letra pequeña: "Mira las demos".
```

### T03 · Tarjeta para dejar en: Veterinarias

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T03.png`  
**Lleva QR:** `tarjeta-veterinarias`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Citas, vacunas y recordatorios, sin cuaderno". Debajo, en gris claro y pequeño: "Mira la demo de tu veterinaria en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T04 · Tarjeta para dejar en: Peluquerías y barberías

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T04.png`  
**Lleva QR:** `tarjeta-salones-y-barberias`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Que te reserven a las 11 de la noche, sin contestar". Debajo, en gris claro y pequeño: "Mira la demo de tu peluquería en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T05 · Tarjeta para dejar en: Panaderías

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T05.png`  
**Lleva QR:** `tarjeta-panaderias-y-cafeterias`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Que sepan a qué hora sale el pan caliente". Debajo, en gris claro y pequeño: "Mira la demo de tu panadería en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T06 · Tarjeta para dejar en: Abogados y contadores

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T06.png`  
**Lleva QR:** `tarjeta-abogados-y-contadores`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Clientes que llegan con los documentos listos". Debajo, en gris claro y pequeño: "Mira la demo de tu oficina en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T07 · Tarjeta para dejar en: Programa de puntos

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T07.png`  
**Lleva QR:** `tarjeta-programa-de-puntos`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Que tus clientes vuelvan por el café gratis". Debajo, en gris claro y pequeño: "Mira la demo de tu negocio en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T08 · Tarjeta para dejar en: Inmobiliarias

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T08.png`  
**Lleva QR:** `tarjeta-inmobiliarias`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Tus inmuebles con mapa, filtros y visitas agendadas". Debajo, en gris claro y pequeño: "Mira la demo de tu inmobiliaria en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T09 · Tarjeta para dejar en: Gimnasios

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T09.png`  
**Lleva QR:** `tarjeta-gimnasios-y-estudios`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Clases con cupo y membresías que avisan antes de vencer". Debajo, en gris claro y pequeño: "Mira la demo de tu gimnasio en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T10 · Tarjeta para dejar en: Consultorios

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T10.png`  
**Lleva QR:** `tarjeta-consultorios-odontologicos`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Tus pacientes agendan solos desde el celular". Debajo, en gris claro y pequeño: "Mira la demo de tu consultorio en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T11 · Tarjeta para dejar en: Tiendas de ropa

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T11.png`  
**Lleva QR:** `tarjeta-tiendas-de-ropa`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Vende tallas y colores con PSE y Nequi". Debajo, en gris claro y pequeño: "Mira la demo de tu tienda de ropa en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T12 · Tarjeta para dejar en: Ferreterías y comercios

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T12.png`  
**Lleva QR:** `tarjeta-inventario-y-ventas`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "¿Cuánto te queda en bodega? Míralo en un segundo". Debajo, en gris claro y pequeño: "Mira la demo de tu negocio en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T13 · Tarjeta para dejar en: Restaurantes

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T13.png`  
**Lleva QR:** `tarjeta-restaurantes`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "¿Tus pedidos llegan por WhatsApp y se pierden?". Debajo, en gris claro y pequeño: "Mira la demo de tu restaurante en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T14 · Tarjeta para dejar en: Hoteles

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T14.png`  
**Lleva QR:** `tarjeta-hoteles-y-turismo`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Que recorran tu hotel antes de reservar". Debajo, en gris claro y pequeño: "Mira la demo de tu hotel en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

### T15 · Tarjeta para dejar en: Cosméticos

**Adjunta:** `logo.png`  
**Formato:** Horizontal 9 × 5 cm  
**Guardar como:** `T15.png`  
**Lleva QR:** `tarjeta-tiendas-de-cosmeticos`

Reverso: la T02.

```text
Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "Tu tienda de cosméticos, vendiendo por internet". Debajo, en gris claro y pequeño: "Mira la demo de tu tienda en axchisan.com".
A la derecha, un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.
```

## Fotos de la oficina

Una serie de fotos consistente: siempre el mismo escritorio blanco, el MacBook Air medianoche, el pothos y la taza. **Haz primero la O01**; todas las demás la usan de referencia para que parezcan de la misma sesión.

Son imágenes generadas: úsalas en redes, en la web y en publicaciones. Para las fotos del negocio en el Perfil de Google, Google pide fotos reales; ahí sube una foto tuya de verdad.

### O01 · Foto base de la oficina (hazla primero)

**Adjunta:** `pantalla-axchisan.png`  
**Formato:** Horizontal 3:2  
**Guardar como:** `O01.png`

Genera varias y quédate con la mejor. **Guárdala también como `docs/publicidad/adjuntos/oficina-base.png`**: es la referencia de todas las demás fotos de la oficina.

```text
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
En la pantalla del MacBook se ve la captura adjunta "pantalla-axchisan", nítida y sin reflejos fuertes.
Cámara a la altura del escritorio, ligeramente de frente, el computador un poco a la derecha del centro. Profundidad de campo suave. Formato horizontal 3:2, máxima resolución.
```

### O02 · Oficina desde arriba

**Adjunta:** `oficina-base.png`, `restaurantes-computador.png`  
**Formato:** Cuadrada 1:1  
**Guardar como:** `O02.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el ángulo: vista cenital, desde arriba, con el MacBook abierto en el centro y la planta y la taza a los lados, con aire alrededor. En la pantalla se ve la captura adjunta "restaurantes-computador". Formato cuadrado 1:1, máxima resolución.
```

### O03 · Primer plano de la pantalla

**Adjunta:** `oficina-base.png`, `programa-de-puntos-computador.png`  
**Formato:** Vertical 4:5  
**Guardar como:** `O03.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el encuadre: primer plano del MacBook, con la pantalla ocupando buena parte de la imagen y la hoja de la planta desenfocada en primer plano a la derecha. En la pantalla, la captura adjunta "programa-de-puntos-computador", nítida. Formato vertical 4:5, máxima resolución.
```

### O04 · Oficina para historias, con espacio para texto

**Adjunta:** `oficina-base.png`, `pantalla-axchisan.png`  
**Formato:** Vertical 9:16  
**Guardar como:** `O04.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el formato: vertical 9:16. El escritorio ocupa el tercio inferior; los dos tercios superiores son pared blanca lisa y vacía, para poner texto encima después. En la pantalla, la captura adjunta "pantalla-axchisan". Máxima resolución.
```

### O05 · Programando

**Adjunta:** `oficina-base.png`  
**Formato:** Horizontal 3:2  
**Guardar como:** `O05.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo la pantalla: un editor de código de tema oscuro con líneas de código de colores suaves, bien ordenadas; que no se lean palabras concretas. Mismo encuadre de la foto base. Formato horizontal 3:2, máxima resolución.
```

### O06 · El Mac y un celular con una demo

**Adjunta:** `oficina-base.png`, `salones-y-barberias-computador.png`, `salones-y-barberias-celular.png`  
**Formato:** Vertical 4:5  
**Guardar como:** `O06.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Agrega solo un objeto: un celular negro sin marca, acostado sobre el escritorio frente al MacBook, con la captura adjunta "salones-y-barberias-celular" en su pantalla. En el MacBook, la captura "salones-y-barberias-computador". Formato vertical 4:5, máxima resolución.
```

### O07 · Panorámica para portadas, con espacio a la izquierda

**Adjunta:** `oficina-base.png`, `pantalla-axchisan.png`  
**Formato:** Horizontal 16:9  
**Guardar como:** `O07.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el formato: panorámica 16:9. El escritorio con el MacBook, la planta y la taza queda en el tercio derecho; los dos tercios izquierdos son pared blanca lisa y vacía, para poner texto encima. En la pantalla, la captura adjunta "pantalla-axchisan". Máxima resolución.
```

### O08 · La misma oficina al atardecer

**Adjunta:** `oficina-base.png`, `hoteles-y-turismo-computador.png`  
**Formato:** Horizontal 3:2  
**Guardar como:** `O08.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo la luz: atardecer, luz cálida y dorada entrando por la ventana, sombras un poco más largas. En la pantalla, la captura adjunta "hoteles-y-turismo-computador". Mismo encuadre de la foto base. Formato horizontal 3:2, máxima resolución.
```

### O09 · Manos en el teclado

**Adjunta:** `oficina-base.png`, `inventario-y-ventas-computador.png`  
**Formato:** Vertical 4:5  
**Guardar como:** `O09.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Agrega solo unas manos escribiendo en el teclado del MacBook, vistas de cerca desde un lado, sin que se vea la cara ni el cuerpo; mangas de un suéter gris claro. En la pantalla, la captura adjunta "inventario-y-ventas-computador". Formato vertical 4:5, máxima resolución.
```

### O10 · Detalle de la planta y la taza

**Adjunta:** `oficina-base.png`  
**Formato:** Cuadrada 1:1  
**Guardar como:** `O10.png`

```text
Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.
Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.
Cambia solo el encuadre: detalle de la planta y la taza en primer plano, nítidas, con el MacBook desenfocado al fondo. Formato cuadrado 1:1, máxima resolución.
```

## Imprimir

- **Revisa el QR con tu celular** en la pieza de `listas/` antes de mandarla: debe abrir la página de su sector.
- **Pide a la imprenta** impresión con sangrado de 3 mm y una prueba de color: el verde azulado suele salir más apagado en papel.
- **Tarjetas:** propalcote de 300 g, plastificado mate por ambas caras. Si las quieres del tamaño de una tarjeta de crédito (8,5 × 5,4 cm) con esquinas redondeadas, pídelo con troquel: la imagen sirve igual.
- **Volantes:** propalcote de 150 g brillante para repartir; 250 g mate para dejar en mostradores.

## Medir

Cada QR lleva su origen. En `/admin`, **Visitas por publicidad** muestra cuántas visitas trajo cada pieza (`volante/restaurantes`, `tarjeta/general`…). Si una no trae visitas en dos semanas, cambia la frase antes de imprimir más.
