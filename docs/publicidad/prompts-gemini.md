# Prompts para Gemini: publicidad de Axchi

Prompts para generar con Gemini (Nano Banana Pro) las piezas de publicidad: historias, publicaciones,
volantes imprimibles y tarjetas de presentación. Cada prompt se pega tal cual; lo que va entre
`{llaves}` se cambia.

## Reglas de toda la publicidad

1. **Nunca precios.** La pieza despierta la curiosidad y lleva a la web: "mira la demo de tu
   negocio", "averigua cuánto cuesta en axchisan.com". El precio se ve en `/planes`, donde además
   se explica qué incluye.
2. **Un solo mensaje por pieza.** Un titular corto, una línea de apoyo y la llamada a la web.
3. **El QR nunca lo dibuja Gemini.** Los QR que inventa no se pueden escanear. Pide un cuadro
   blanco vacío y pega encima el QR real de `docs/publicidad/qr/` (ver "Terminar la pieza").
4. **Revisa la ortografía letra por letra.** Gemini a veces se come tildes o cambia letras. Si
   falla, pide: "Corrige solo el texto: debe decir exactamente «…». No cambies nada más."
5. **Nada que parezca foto real de un cliente.** Las personas generadas son ilustrativas; no las
   presentes como clientes de verdad.

## Cómo usar Gemini

1. Abre [gemini.google.com](https://gemini.google.com), elige el modelo con imágenes
   (Nano Banana Pro) y la herramienta **Crear imagen**.
2. **Adjunta referencias** antes de escribir el prompt:
   - El logo: `public/icon-512.png`.
   - Para las piezas de sector, la captura de su demo (tabla de abajo). Gemini la pone en la
     pantalla del celular o del computador.
3. Pega primero el **bloque de marca** y debajo el prompt de la pieza.
4. Pide la resolución más alta (2K o 4K) cuando sea para imprimir.
5. Genera 3 o 4 variantes y quédate con la mejor. Para ajustar, pide cambios concretos: "el
   titular más grande", "más aire alrededor del texto", "fondo más oscuro".

### Capturas y QR por sector

| Sector | Captura de celular | Captura de computador | Nombre en los QR |
|---|---|---|---|
| Veterinarias | `public/capturas/canela-portada-movil.webp` | `public/capturas/canela-portada-escritorio.webp` | `veterinarias` |
| Salones y barberías | `public/capturas/look-y-estilo-portada-movil.webp` | `public/capturas/look-y-estilo-portada-escritorio.webp` | `salones-y-barberias` |
| Panaderías y cafeterías | `public/capturas/pan-de-la-casa-portada-movil.webp` | `public/capturas/pan-de-la-casa-horneadas-escritorio.webp` | `panaderias-y-cafeterias` |
| Abogados y contadores | `public/capturas/rojas-duarte-portada-movil.webp` | `public/capturas/rojas-duarte-portada-escritorio.webp` | `abogados-y-contadores` |
| Inmobiliarias | `public/capturas/tu-casa-portada-movil.webp` | `public/capturas/tu-casa-listado-escritorio.webp` | `inmobiliarias` |
| Gimnasios y estudios | `public/capturas/titan-gym-portada-movil.webp` | `public/capturas/titan-gym-horario-escritorio.webp` | `gimnasios-y-estudios` |
| Consultorios odontológicos | `public/capturas/sonrisa-clara-portada-movil.webp` | `public/capturas/sonrisa-clara-odontograma-escritorio.webp` | `consultorios-odontologicos` |
| Tiendas de ropa | `public/capturas/linaza-producto-movil.webp` | `public/capturas/linaza-portada-escritorio.webp` | `tiendas-de-ropa` |
| Comercio y distribución | `public/capturas/la-principal-portada-movil.webp` | `public/capturas/la-principal-caja-escritorio.webp` | `inventario-y-ventas` |
| Restaurantes y cafeterías | `public/capturas/sabor-de-casa-portada-movil.webp` | `public/capturas/sabor-de-casa-portada-escritorio.webp` | `restaurantes` |
| Hoteles y turismo | `public/capturas/brisas-del-mar-portada-movil.webp` | `public/capturas/brisas-del-mar-portada-escritorio.webp` | `hoteles-y-turismo` |
| Programa de puntos | `public/capturas/cafe-del-barrio-app-movil.webp` | `public/capturas/cafe-del-barrio-caja-escritorio.webp` | `programa-de-puntos` |
| Cosméticos y cuidado personal | `public/capturas/jabones-mari-portada-movil.webp` | `public/capturas/jabones-mari-portada-escritorio.webp` | `tiendas-de-cosmeticos` |

**Ojo con las capturas de computador:** arriba llevan la barra de la demo de Axchi, que muestra el
precio del plan. Antes de adjuntarlas, recorta los primeros 48 px (Vista Previa → seleccionar →
Recortar), o usa solo las de celular, que no lo muestran. Si Gemini dibuja algún precio por su
cuenta, pídele que lo quite.

## Bloque de marca (pegar al inicio de cada prompt)

```
Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia.
Logo adjunto: una letra A geométrica en tres tonos de verde azulado (#0a7676, #12a5a5, #3fc9c2) seguida de la palabra "Axchi". Úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En versiones claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica y moderna, estilo Instrument Sans, títulos en peso semibold con letras juntas. Nada de letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Pantallas de celular y computador mostrando páginas reales de negocios. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes ni bombillos, sin manos de robot.
Idioma: español de Colombia. El texto en la imagen debe estar escrito exactamente como lo indico, con tildes.
```

## Formatos

| Pieza | Medida para pedir a Gemini | Medida final |
|---|---|---|
| Historia de Instagram o estado de WhatsApp | Vertical 9:16 | 1080 × 1920 px |
| Publicación de Instagram o Facebook | Vertical 4:5 | 1080 × 1350 px |
| Imagen para compartir por WhatsApp | Cuadrada 1:1 | 1080 × 1080 px |
| Portada del Perfil de Google | Horizontal 16:9 | 1920 × 1080 px |
| Volante media carta | Vertical, proporción 1:1,414 | 14 × 21,6 cm con 3 mm de sangrado: 1701 × 2622 px a 300 dpi |
| Volante A5 | Vertical, proporción 1:1,414 | 14,8 × 21 cm con sangrado: 1819 × 2551 px a 300 dpi |
| Tarjeta de presentación (la usual en Colombia) | Horizontal 9:5 | 9 × 5 cm con sangrado: 1134 × 661 px a 300 dpi |
| Tarjeta tamaño tarjeta de crédito | Horizontal 85,6 × 54 mm | Con sangrado: 1082 × 709 px a 300 dpi |

**Sangrado y margen de seguridad (piezas impresas):** el fondo debe llegar 3 mm más allá del corte
por cada lado, y ningún texto ni el QR puede quedar a menos de 4 mm del borde de corte. Por eso los
prompts de impresión piden "márgenes amplios".

---

## 1. Historias (9:16)

Para Instagram, Facebook y estados de WhatsApp. En Instagram, agrega encima el **sticker de enlace**
con `https://axchisan.com/?utm_source=instagram&utm_campaign=historia` (o la ficha del sector).

### 1.1 General: "prueba antes de contratar"

```
Crea una historia vertical 9:16 (1080 x 1920) para redes sociales.
Fondo casi negro #0b0f14. Arriba, el logo de Axchi pequeño y centrado.
En el centro, tres celulares ligeramente inclinados en abanico, cada uno mostrando la página de un tipo de negocio distinto: un restaurante, una veterinaria y un gimnasio (usa las capturas adjuntas en las pantallas).
Titular grande en blanco, arriba de los celulares: "Prueba la página de tu negocio antes de pagarla".
Debajo de los celulares, en gris claro: "Hay una demo funcionando para cada tipo de negocio".
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Mírala en axchisan.com".
Deja libre la franja inferior de 250 px para el sticker de enlace.
```

### 1.2 Por sector (cambia `{sector}` y `{frase}`)

Adjunta la captura móvil del sector.

```
Crea una historia vertical 9:16 (1080 x 1920).
Fondo casi negro #0b0f14. Arriba a la izquierda, el logo de Axchi pequeño.
Un solo celular grande, centrado y un poco inclinado, con la captura adjunta en la pantalla.
Titular en blanco, arriba: "{frase}".
Línea de apoyo en gris claro: "Así se vería la página de tu {sector}. Tócala, es una demo real."
Abajo, botón verde azulado #0ea5a5: "Pruébala en axchisan.com".
Deja libre la franja inferior de 250 px.
```

Frases por sector (sin precios):

| Sector | `{sector}` | `{frase}` |
|---|---|---|
| Restaurantes | restaurante | ¿Tus pedidos llegan por WhatsApp y se pierden? |
| Veterinarias | veterinaria | Citas, vacunas y recordatorios, sin cuaderno |
| Salones y barberías | peluquería | Que te reserven a las 11 de la noche, sin contestar |
| Consultorios odontológicos | consultorio | Tus pacientes agendan solos desde el celular |
| Ferreterías y comercios | ferretería | ¿Cuánto te queda en bodega? Míralo en un segundo |
| Tiendas de ropa | tienda de ropa | Vende tallas y colores con PSE y Nequi |
| Inmobiliarias | inmobiliaria | Tus inmuebles con mapa, filtros y visitas agendadas |
| Gimnasios | gimnasio | Clases con cupo y membresías que avisan antes de vencer |
| Panaderías | panadería | Que sepan a qué hora sale el pan caliente |
| Abogados y contadores | oficina | Clientes que llegan con los documentos listos |
| Hoteles | hotel | Que recorran tu hotel antes de reservar |
| Cafés y comercios de barrio | negocio | Que tus clientes vuelvan por el café gratis |

### 1.3 Pregunta que invita a averiguar

```
Crea una historia vertical 9:16 (1080 x 1920), fondo claro #f3f6f9, texto oscuro #0f1720.
Arriba, el logo de Axchi.
En el centro, en letra grande y semibold: "¿Cuánto cuesta una página web para tu negocio?"
Debajo, en gris: "Menos de lo que crees, y la pruebas antes de pagar."
Una flecha simple hacia abajo en verde azulado #0ea5a5, separada del texto.
Abajo: "Averígualo en axchisan.com/planes".
Sin imágenes de personas. Mucho espacio en blanco.
```

---

## 2. Publicaciones (4:5) y para compartir (1:1)

### 2.1 Antes y después

```
Crea una publicación vertical 4:5 (1080 x 1350) dividida en dos mitades.
Mitad superior, en tonos grises apagados: un cuaderno de citas lleno de tachones, un celular con muchos mensajes de WhatsApp sin leer. Texto pequeño: "Antes".
Mitad inferior, fondo casi negro #0b0f14 con acento verde azulado #0ea5a5: un celular limpio mostrando una agenda de citas ordenada (usa la captura adjunta). Texto pequeño: "Con tu página".
Sobre la línea que divide ambas mitades, el titular en blanco sobre una franja oscura: "Tu negocio, ordenado desde el celular".
Abajo a la derecha, el logo de Axchi. Abajo a la izquierda: "Mira cómo funciona en axchisan.com".
```

### 2.2 Carrusel "¿Qué necesita tu negocio?" (una imagen por diapositiva, 4:5)

Diapositiva de portada:

```
Crea una imagen 4:5 (1080 x 1350), fondo #0b0f14.
Titular grande en blanco, alineado a la izquierda: "¿Página, tienda o sistema? Qué necesita tu negocio."
Abajo, en gris claro: "Desliza".
Logo de Axchi abajo a la derecha. Mucho espacio vacío.
```

Diapositivas siguientes (una por cada caso, cambia `{titulo}`, `{texto}` y la captura adjunta):

```
Crea una imagen 4:5 (1080 x 1350), fondo #0b0f14.
Arriba, en verde azulado #0ea5a5, el número "{n}".
Titular en blanco: "{titulo}".
Texto en gris claro, dos líneas: "{texto}".
Abajo, un computador portátil mostrando la captura adjunta.
Logo de Axchi pequeño abajo a la derecha.
```

Casos: 1. "Si te buscan en Google" / "Una página con tus servicios, horario y WhatsApp." 2. "Si vendes
productos" / "Una tienda con carrito y pagos con PSE y Nequi." 3. "Si das citas" / "Reservas en
línea y la agenda del día en tu celular." 4. "Si llevas inventario" / "Existencias, caja y reportes
para Excel."

Diapositiva de cierre: igual a la portada con el titular "Prueba la demo de tu negocio" y abajo
"axchisan.com".

### 2.3 Imagen cuadrada para compartir por WhatsApp (1:1)

```
Crea una imagen cuadrada 1:1 (1080 x 1080), fondo #0b0f14.
Centrado: el logo de Axchi, debajo el titular en blanco "Páginas web, tiendas y sistemas para tu negocio" y una línea en gris claro "Pruébalos funcionando antes de contratar".
Abajo, en verde azulado #0ea5a5: "axchisan.com".
A los lados, dos celulares recortados por el borde mostrando las capturas adjuntas.
```

---

## 3. Portada del Perfil de Google (16:9)

```
Crea una portada horizontal 16:9 (1920 x 1080).
Fondo casi negro #0b0f14. A la derecha, un computador portátil y un celular mostrando las capturas adjuntas (una página de restaurante y una de veterinaria).
A la izquierda, con márgenes amplios: el logo de Axchi y debajo el texto en blanco "Páginas web, tiendas y sistemas para negocios en Colombia".
Todo el texto dentro del 60 % central de la imagen: Google recorta los bordes en el celular.
```

---

## 4. Volantes imprimibles

Para dejar en mostradores o entregar en persona. Imprime la cara y el reverso.

### 4.1 Volante general, cara (media carta, vertical)

```
Crea un volante vertical para imprimir, proporción 1:1,414, a máxima resolución.
Fondo casi negro #0b0f14 que llegue hasta los bordes. Márgenes internos amplios: ningún texto cerca del borde.
Arriba, el logo de Axchi.
Titular grande en blanco: "Tu negocio merece una página que venda".
Subtítulo en gris claro: "Páginas web, tiendas en línea y sistemas de citas, pedidos e inventario".
En el centro, un computador y dos celulares mostrando las capturas adjuntas.
Tres líneas cortas con un pequeño punto verde azulado #0ea5a5 al inicio de cada una:
"Pruébala funcionando antes de contratar"
"Todo queda a tu nombre"
"Te atendemos por WhatsApp"
Abajo a la derecha, un cuadrado blanco vacío de 4 x 4 cm con un borde fino, para pegar un código QR después. Nada dentro del cuadrado.
Abajo a la izquierda, junto al cuadrado: "Escanea y mira la demo de tu negocio" y debajo "axchisan.com".
```

### 4.2 Volante general, reverso

```
Crea el reverso del volante anterior, misma proporción 1:1,414, fondo claro #f3f6f9, texto #0f1720.
Titular: "¿Qué tipo de negocio tienes?"
Una cuadrícula de 12 recuadros iguales, cada uno con un ícono lineal simple en verde azulado #0ea5a5 y su nombre debajo: Restaurante, Veterinaria, Peluquería, Consultorio, Ferretería, Tienda de ropa, Inmobiliaria, Gimnasio, Panadería, Abogados, Hotel, Cosméticos.
Abajo: "Para cada uno hay una demo funcionando en axchisan.com. Averigua cuánto cuesta la tuya en la web."
Y en una línea aparte: "WhatsApp +57 318 303 8190".
Márgenes amplios.
```

### 4.3 Volante por sector (para repartir en una zona de restaurantes, por ejemplo)

Adjunta las capturas del sector.

```
Crea un volante vertical para imprimir, proporción 1:1,414, máxima resolución, fondo #0b0f14 hasta los bordes, márgenes internos amplios.
Arriba, el logo de Axchi.
Titular grande en blanco: "{frase}".
Subtítulo en gris claro: "Mira cómo se vería la página de tu {sector}. Es una demo real: tócala desde tu celular."
En el centro, un celular y un computador con las capturas adjuntas.
Abajo, un cuadrado blanco vacío de 4 x 4 cm con borde fino, sin nada adentro, para un código QR.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".
```

Usa el QR `volante-<sector>.png` correspondiente.

---

## 5. Tarjetas pequeñas

### 5.1 Tarjeta de presentación, cara (9 × 5 cm)

```
Crea la cara de una tarjeta de presentación horizontal, proporción 9:5, máxima resolución.
Fondo casi negro #0b0f14 hasta los bordes. Márgenes internos amplios.
Centrado: el logo de Axchi grande.
Debajo, en gris claro y letra pequeña: "Páginas web, tiendas y sistemas para tu negocio".
Nada más. Minimalista.
```

### 5.2 Tarjeta de presentación, reverso

```
Crea el reverso de una tarjeta de presentación horizontal, proporción 9:5, máxima resolución.
Fondo claro #f3f6f9 hasta los bordes, texto #0f1720, márgenes internos amplios.
A la izquierda, en tres líneas:
"Duvan Arciniegas"
"Axchi" en verde azulado #0b7c7c
"WhatsApp +57 318 303 8190"
"contacto@axchisan.com"
A la derecha, un cuadrado blanco vacío con borde fino, del alto de las cuatro líneas, para pegar un código QR. Nada dentro.
Debajo del cuadrado, en letra pequeña: "Mira las demos".
```

Usa el QR `tarjeta-general.png`.

### 5.3 Tarjeta para dejar en un negocio (por sector)

La que se deja en el mostrador de un restaurante, una peluquería o una ferretería: una pregunta que
le hable a ese dueño y un QR a la demo de su sector.

```
Crea una tarjeta horizontal proporción 9:5, máxima resolución, fondo #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "{frase}".
Debajo, en gris claro y pequeño: "Mira la demo de tu {sector}".
A la derecha, un cuadrado blanco vacío con borde fino que ocupe casi todo el alto, para un código QR. Nada dentro.
Abajo a la izquierda, el logo de Axchi pequeño.
```

Usa el QR `tarjeta-<sector>.png`. El reverso puede ser el 5.2.

### 5.4 Variante tamaño tarjeta de crédito

Los mismos prompts 5.1 a 5.3 cambiando "proporción 9:5" por "proporción 85,6 x 54 mm (como una
tarjeta de crédito), con esquinas redondeadas de 3 mm". Las esquinas redondeadas se piden también
a la imprenta: se cortan con troquel.

---

## Terminar la pieza

1. **Pegar el QR:** abre la imagen en [Canva](https://www.canva.com) (o en Vista Previa del Mac),
   arrastra encima el PNG del QR de `docs/publicidad/qr/` y ajústalo al cuadro blanco. Tamaños
   mínimos para que se escanee bien: 2 cm en tarjetas, 3,5 cm en volantes.
2. **Escanéalo con tu celular** antes de imprimir: debe abrir la página correcta.
3. **Exporta para imprenta:** PDF para impresión, con marcas de corte y sangrado de 3 mm. Si la
   imprenta pide CMYK, pídeles una prueba de color: el verde azulado suele salir más apagado en
   papel.
4. **Papel recomendado:**
   - Tarjetas: propalcote de 300 g, plastificado mate por ambas caras.
   - Volantes: propalcote de 150 g brillante para repartir; 250 g mate para dejar en mostradores.

## Medir qué funciona

Cada QR lleva su origen: en `/admin`, "Visitas por publicidad" muestra filas como
`tarjeta/restaurantes` o `volante/general` con cuántas visitas trajo cada una. Si una zona o un
sector no trae visitas en dos semanas, cambia la frase antes de imprimir más.

Para las historias y publicaciones, usa enlaces con origen:

```
https://axchisan.com/?utm_source=instagram&utm_campaign=historia
https://axchisan.com/soluciones/restaurantes?utm_source=instagram&utm_campaign=restaurantes
https://axchisan.com/?utm_source=whatsapp&utm_campaign=estado
```
