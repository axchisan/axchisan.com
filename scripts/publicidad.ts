/**
 * Genera el material para producir la publicidad con Gemini:
 *
 *   docs/publicidad/adjuntos/        las imágenes que se suben a Gemini, listas y con nombres simples
 *   docs/publicidad/prompts-gemini.md  un prompt completo por pieza: copiar, pegar, descargar
 *   docs/publicidad/piezas.json      qué QR lleva cada pieza (lo usa scripts/pegar-qr.ts)
 *
 *   npx tsx scripts/publicidad.ts
 *
 * Los prompts salen de los datos de cada sector: al agregar una ficha, se
 * agrega su fila en SECTORES y se vuelve a correr.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"
import { CARAS, FONDO_MARCA, VIEWBOX } from "../components/site/logo-geometria"
import { SOLUCIONES } from "../lib/catalogo/soluciones"
import { PROFILE, WHATSAPP } from "../lib/site"

const DOCS = "docs/publicidad"
const ADJ = `${DOCS}/adjuntos`

/** Cómo se le habla a cada sector. Sin precios: la pieza lleva a la web. */
const SECTORES: Record<string, { corto: string; tu: string; frase: string; apoyo: string }> = {
  restaurantes: { corto: "Restaurantes", tu: "tu restaurante", frase: "¿Tus pedidos llegan por WhatsApp y se pierden?", apoyo: "Carta con QR, pedidos a domicilio y pantalla de cocina." },
  veterinarias: { corto: "Veterinarias", tu: "tu veterinaria", frase: "Citas, vacunas y recordatorios, sin cuaderno", apoyo: "Tus clientes agendan desde el celular y tú ves la agenda del día." },
  "salones-y-barberias": { corto: "Peluquerías y barberías", tu: "tu peluquería", frase: "Que te reserven a las 11 de la noche, sin contestar", apoyo: "Reservas en línea con el profesional y la hora que quieren." },
  "consultorios-odontologicos": { corto: "Consultorios", tu: "tu consultorio", frase: "Tus pacientes agendan solos desde el celular", apoyo: "Agenda, odontograma y presupuestos en un solo lugar." },
  "inventario-y-ventas": { corto: "Ferreterías y comercios", tu: "tu negocio", frase: "¿Cuánto te queda en bodega? Míralo en un segundo", apoyo: "Inventario, caja y reportes para Excel." },
  "tiendas-de-ropa": { corto: "Tiendas de ropa", tu: "tu tienda de ropa", frase: "Vende tallas y colores con PSE y Nequi", apoyo: "Tu colección en línea, con inventario por talla." },
  inmobiliarias: { corto: "Inmobiliarias", tu: "tu inmobiliaria", frase: "Tus inmuebles con mapa, filtros y visitas agendadas", apoyo: "Una página propia, sin depender solo de los portales." },
  "gimnasios-y-estudios": { corto: "Gimnasios", tu: "tu gimnasio", frase: "Clases con cupo y membresías que avisan antes de vencer", apoyo: "Tus socios reservan su puesto desde el celular." },
  "panaderias-y-cafeterias": { corto: "Panaderías", tu: "tu panadería", frase: "Que sepan a qué hora sale el pan caliente", apoyo: "Pedidos para recoger y tortas por encargo." },
  "abogados-y-contadores": { corto: "Abogados y contadores", tu: "tu oficina", frase: "Clientes que llegan con los documentos listos", apoyo: "Una página que da confianza antes de la primera llamada." },
  "hoteles-y-turismo": { corto: "Hoteles", tu: "tu hotel", frase: "Que recorran tu hotel antes de reservar", apoyo: "Una página con video que avanza con el scroll." },
  "programa-de-puntos": { corto: "Programa de puntos", tu: "tu negocio", frase: "Que tus clientes vuelvan por el café gratis", apoyo: "Puntos, sellos y cupones en el celular de tus clientes." },
  "tiendas-de-cosmeticos": { corto: "Cosméticos", tu: "tu tienda", frase: "Tu tienda de cosméticos, vendiendo por internet", apoyo: "Catálogo, carrito y pagos en línea." },
}

const MARCA = `Marca: Axchi, estudio que hace páginas web, tiendas en línea y sistemas para negocios pequeños en Colombia. El logo está en la imagen adjunta "logo": úsalo tal cual, sin redibujarlo ni cambiarle los colores.
Colores: fondo casi negro #0b0f14, texto blanco, acento verde azulado #0ea5a5, gris claro #9aa7b5 para textos secundarios. En piezas claras: fondo #f3f6f9 y texto #0f1720.
Tipografía: sans serif geométrica moderna, estilo Instrument Sans, títulos semibold. Sin letras decorativas, cursivas ni sombras.
Estilo: sobrio, limpio y actual, con mucho espacio libre. Sin brillos, sin degradados de colores, sin íconos 3D, sin cohetes, bombillos ni robots.
Texto: español de Colombia, escrito exactamente como lo indico, con tildes. No agregues ningún otro texto, número ni precio.`

/**
 * Con medidas en px y colores en hexadecimal, Gemini a veces lo toma como un
 * encargo de diseño web y responde con HTML. Cada prompt abre y cierra
 * pidiendo una imagen.
 */
const INICIO = "Genera una imagen. Tu respuesta debe ser únicamente la imagen generada: no escribas código, HTML, CSS ni explicaciones."
const CIERRE = "Recuerda: entrega solo la imagen terminada, lista para descargar. Nada de código."

const QR = `un cuadrado blanco puro (#FFFFFF), liso y completamente vacío, con un borde fino gris oscuro. No dibujes nada dentro: ahí se pegará un código QR después`

type Pieza = { id: string; titulo: string; adjuntos: string[]; formato: string; prompt: string; qr?: string; guia?: string }

const piezas: { seccion: string; intro: string; items: Pieza[] }[] = []

// ─── Adjuntos ─────────────────────────────────────────────────────────────

async function prepararAdjuntos() {
  mkdirSync(ADJ, { recursive: true })
  const navegador = await chromium.launch()
  const pagina = await navegador.newPage({ viewport: { width: 1000, height: 300 } })
  const svg = `<svg viewBox="${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}" height="150" width="${(150 * VIEWBOX.w) / VIEWBOX.h}">${CARAS.map((c) => `<polygon points="${c.puntos}" fill="${c.color}"/>`).join("")}</svg>`
  for (const [archivo, fondo, texto] of [["logo", FONDO_MARCA, "#ffffff"], ["logo-claro", "#f3f6f9", "#0f1720"]] as const) {
    await pagina.setContent(
      `<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600&display=block" rel="stylesheet"><body style="margin:0;background:${fondo};display:flex;align-items:center;justify-content:center;width:1000px;height:300px;gap:32px;font:600 120px 'Instrument Sans';letter-spacing:-0.02em;color:${texto}">${svg}Axchi</body>`,
      { waitUntil: "networkidle" },
    )
    await pagina.evaluate(() => document.fonts.ready)
    await pagina.screenshot({ path: `${ADJ}/${archivo}.png` })
  }
  // La pantalla de la oficina: la portada de axchisan.com, sin la cabecera del navegador.
  const web = await navegador.newPage({ viewport: { width: 1440, height: 900 } })
  await web.goto("https://axchisan.com", { waitUntil: "networkidle" })
  await web.screenshot({ path: `${ADJ}/pantalla-axchisan.png` })
  await navegador.close()

  // Capturas de cada demo, sin la barra superior de Axchi, que muestra el precio del plan.
  for (const s of SOLUCIONES) {
    const demo = s.muestra.tipo === "demo"
    for (const [tipo, src, barra] of [["celular", s.capturas.movil.src, 96], ["computador", s.capturas.escritorio.src, 48]] as const) {
      const img = sharp(`public${src}`)
      const { width, height } = await img.metadata()
      const recorte = demo ? barra : 0
      await img.extract({ left: 0, top: recorte, width: width!, height: height! - recorte }).png().toFile(`${ADJ}/${s.slug}-${tipo}.png`)
    }
  }
}

// ─── Piezas ───────────────────────────────────────────────────────────────

const orden = SOLUCIONES.map((s) => s.slug).filter((slug) => SECTORES[slug])
const faltan = SOLUCIONES.filter((s) => !SECTORES[s.slug]).map((s) => s.slug)
if (faltan.length) throw new Error(`Faltan en SECTORES: ${faltan.join(", ")}`)

const n = (i: number) => String(i).padStart(2, "0")

function historias(): Pieza[] {
  const lista: Pieza[] = [
    {
      id: "H01",
      titulo: "Historia general: prueba antes de contratar",
      adjuntos: ["logo.png", "restaurantes-celular.png", "veterinarias-celular.png", "gimnasios-y-estudios-celular.png"],
      formato: "Vertical 9:16, 1080 × 1920",
      prompt: `Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
${MARCA}
Composición: fondo casi negro #0b0f14. Arriba, el logo pequeño y centrado. En el centro, tres celulares ligeramente inclinados en abanico, cada uno con una de las capturas adjuntas en la pantalla (restaurante, veterinaria y gimnasio).
Titular grande en blanco, arriba de los celulares: "Prueba la página de tu negocio antes de pagarla".
Debajo de los celulares, en gris claro: "Hay una demo funcionando para cada tipo de negocio".
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Mírala en axchisan.com".
Deja vacía la franja inferior de 250 px.`,
      guia: "En Instagram, agrega el sticker de enlace con `https://axchisan.com/?utm_source=instagram&utm_campaign=historia`.",
    },
    {
      id: "H02",
      titulo: "Historia: ¿cuánto cuesta una página?",
      adjuntos: ["logo-claro.png"],
      formato: "Vertical 9:16, 1080 × 1920",
      prompt: `Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
${MARCA}
Composición: pieza clara, fondo #f3f6f9 y texto #0f1720. Arriba, el logo adjunto "logo-claro". En el centro, en letra grande y semibold: "¿Cuánto cuesta una página web para tu negocio?". Debajo, en gris: "Menos de lo que crees, y la pruebas antes de pagar." Más abajo, una flecha simple hacia abajo en verde azulado #0ea5a5, separada del texto. Abajo: "Averígualo en axchisan.com". Sin personas ni celulares. Mucho espacio en blanco.`,
      guia: "Sticker de enlace: `https://axchisan.com/planes?utm_source=instagram&utm_campaign=cuanto-cuesta`.",
    },
  ]
  orden.forEach((slug, i) => {
    const x = SECTORES[slug]
    lista.push({
      id: `H${n(i + 3)}`,
      titulo: `Historia: ${x.corto}`,
      adjuntos: ["logo.png", `${slug}-celular.png`],
      formato: "Vertical 9:16, 1080 × 1920",
      prompt: `Crea una historia vertical 9:16 (1080 x 1920 px) para Instagram y estados de WhatsApp.
${MARCA}
Composición: fondo casi negro #0b0f14. Arriba a la izquierda, el logo pequeño. Un solo celular grande, centrado y un poco inclinado, con la captura adjunta "${slug}-celular" en la pantalla.
Titular en blanco, arriba del celular: "${x.frase}".
Línea en gris claro: "Así se vería la página de ${x.tu}. Es una demo real: tócala."
Abajo, un botón redondeado verde azulado #0ea5a5 con texto oscuro: "Pruébala en axchisan.com".
Deja vacía la franja inferior de 250 px.`,
      guia: `Sticker de enlace: \`https://axchisan.com/soluciones/${slug}?utm_source=instagram&utm_campaign=${slug}\`.`,
    })
  })
  return lista
}

function publicaciones(): Pieza[] {
  const casos = [
    ["Si te buscan en Google", "Una página con tus servicios, horario y WhatsApp.", "abogados-y-contadores"],
    ["Si vendes productos", "Una tienda con carrito y pagos con PSE y Nequi.", "tiendas-de-ropa"],
    ["Si das citas", "Reservas en línea y la agenda del día en tu celular.", "veterinarias"],
    ["Si llevas inventario", "Existencias, caja y reportes para Excel.", "inventario-y-ventas"],
  ] as const
  const lista: Pieza[] = [
    {
      id: "P01",
      titulo: "Publicación: antes y después",
      adjuntos: ["logo.png", "veterinarias-computador.png"],
      formato: "Vertical 4:5, 1080 × 1350",
      prompt: `Crea una publicación vertical 4:5 (1080 x 1350 px) para Instagram y Facebook, dividida en dos mitades.
${MARCA}
Mitad superior, en tonos grises apagados: un cuaderno de citas lleno de tachones y un celular con muchos mensajes sin leer. Texto pequeño arriba a la izquierda: "Antes".
Mitad inferior, fondo casi negro #0b0f14: un computador portátil con la captura adjunta "veterinarias-computador" en la pantalla. Texto pequeño: "Con tu página".
Sobre la línea que divide las mitades, una franja oscura con el titular en blanco: "Tu negocio, ordenado desde el celular".
Abajo a la derecha, el logo. Abajo a la izquierda, en gris claro: "Mira cómo funciona en axchisan.com".`,
    },
    {
      id: "P02",
      titulo: "Carrusel 1 de 6: portada",
      adjuntos: ["logo.png"],
      formato: "Vertical 4:5, 1080 × 1350",
      prompt: `Crea una imagen vertical 4:5 (1080 x 1350 px), portada de un carrusel de Instagram.
${MARCA}
Fondo casi negro #0b0f14. Titular grande en blanco, alineado a la izquierda y a media altura: "¿Página, tienda o sistema? Qué necesita tu negocio". Abajo a la izquierda, en gris claro: "Desliza". Abajo a la derecha, el logo pequeño. Mucho espacio vacío.`,
    },
  ]
  casos.forEach(([titulo, texto, slug], i) => {
    lista.push({
      id: `P${n(i + 3)}`,
      titulo: `Carrusel ${i + 2} de 6: ${titulo.toLowerCase()}`,
      adjuntos: ["logo.png", `${slug}-computador.png`],
      formato: "Vertical 4:5, 1080 × 1350",
      prompt: `Crea una imagen vertical 4:5 (1080 x 1350 px), diapositiva de un carrusel de Instagram.
${MARCA}
Fondo casi negro #0b0f14. Arriba a la izquierda, en verde azulado #0ea5a5 y grande, el número "${i + 1}". Debajo, titular en blanco: "${titulo}". Debajo, en gris claro: "${texto}". En la mitad inferior, un computador portátil con la captura adjunta "${slug}-computador" en la pantalla. Abajo a la derecha, el logo pequeño.`,
    })
  })
  lista.push(
    {
      id: "P07",
      titulo: "Carrusel 6 de 6: cierre",
      adjuntos: ["logo.png"],
      formato: "Vertical 4:5, 1080 × 1350",
      prompt: `Crea una imagen vertical 4:5 (1080 x 1350 px), última diapositiva de un carrusel de Instagram.
${MARCA}
Fondo casi negro #0b0f14. Centrado: el logo, debajo el titular en blanco "Prueba la demo de tu negocio" y en verde azulado #0ea5a5 "axchisan.com". Mucho espacio vacío.`,
    },
    {
      id: "P08",
      titulo: "Imagen cuadrada para compartir por WhatsApp",
      adjuntos: ["logo.png", "restaurantes-celular.png", "programa-de-puntos-celular.png"],
      formato: "Cuadrada 1:1, 1080 × 1080",
      prompt: `Crea una imagen cuadrada 1:1 (1080 x 1080 px) para compartir por WhatsApp.
${MARCA}
Fondo casi negro #0b0f14. Centrado: el logo, debajo el titular en blanco "Páginas web, tiendas y sistemas para tu negocio" y una línea en gris claro "Pruébalos funcionando antes de contratar". Abajo, en verde azulado #0ea5a5: "axchisan.com". A los lados, dos celulares recortados por el borde de la imagen, con las capturas adjuntas en la pantalla.`,
    },
  )
  return lista
}

function portada(): Pieza[] {
  return [
    {
      id: "G01",
      titulo: "Portada del Perfil de Google y de redes",
      adjuntos: ["logo.png", "restaurantes-computador.png", "veterinarias-celular.png"],
      formato: "Horizontal 16:9, 1920 × 1080",
      prompt: `Crea una portada horizontal 16:9 (1920 x 1080 px).
${MARCA}
Fondo casi negro #0b0f14. A la derecha, un computador portátil con la captura adjunta "restaurantes-computador" y un celular con "veterinarias-celular". A la izquierda, con márgenes amplios: el logo y debajo, en blanco, "Páginas web, tiendas y sistemas para negocios en Colombia". Todo el texto dentro del 60 % central de la imagen: en el celular se recortan los bordes.`,
    },
  ]
}

function volantes(): Pieza[] {
  const lista: Pieza[] = [
    {
      id: "V01",
      titulo: "Volante general, cara",
      adjuntos: ["logo.png", "restaurantes-computador.png", "veterinarias-celular.png", "gimnasios-y-estudios-celular.png"],
      formato: "Vertical media carta, 14 × 21,6 cm",
      qr: "volante-general",
      prompt: `Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
${MARCA}
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios: ningún texto cerca del borde.
Arriba, el logo. Titular grande en blanco: "Tu negocio merece una página que venda". Subtítulo en gris claro: "Páginas web, tiendas en línea y sistemas de citas, pedidos e inventario".
En el centro, un computador portátil y dos celulares con las capturas adjuntas en las pantallas.
Tres líneas cortas, cada una con un pequeño punto verde azulado #0ea5a5 al inicio: "Pruébala funcionando antes de contratar", "Todo queda a tu nombre", "Te atendemos por WhatsApp".
Abajo a la derecha, ${QR}. Que mida un cuarto del ancho del volante.
Abajo a la izquierda, junto al cuadrado: "Escanea y mira la demo de tu negocio" y debajo "axchisan.com".`,
    },
    {
      id: "V02",
      titulo: "Volante, reverso (sirve para todos)",
      adjuntos: ["logo-claro.png"],
      formato: "Vertical media carta, 14 × 21,6 cm",
      prompt: `Crea el reverso de un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
${MARCA}
Pieza clara: fondo #f3f6f9 hasta los bordes, texto #0f1720, márgenes internos amplios. Arriba, el logo adjunto "logo-claro" pequeño.
Titular: "¿Qué tipo de negocio tienes?".
Una cuadrícula de 12 recuadros iguales, cada uno con un ícono lineal simple en verde azulado #0ea5a5 y su nombre debajo: Restaurante, Veterinaria, Peluquería, Consultorio, Ferretería, Tienda de ropa, Inmobiliaria, Gimnasio, Panadería, Abogados, Hotel, Café.
Abajo: "Para cada uno hay una demo funcionando en axchisan.com. Averigua cuánto cuesta la tuya en la web." Y en una línea aparte: "WhatsApp ${WHATSAPP.visible}".`,
    },
  ]
  orden.forEach((slug, i) => {
    const x = SECTORES[slug]
    lista.push({
      id: `V${n(i + 3)}`,
      titulo: `Volante: ${x.corto}`,
      adjuntos: ["logo.png", `${slug}-celular.png`, `${slug}-computador.png`],
      formato: "Vertical media carta, 14 × 21,6 cm",
      qr: `volante-${slug}`,
      prompt: `Crea un volante vertical para imprimir en media carta (14 x 21,6 cm), proporción 1:1,54, a la máxima resolución.
${MARCA}
El fondo casi negro #0b0f14 llega hasta los bordes. Márgenes internos amplios.
Arriba, el logo. Titular grande en blanco: "${x.frase}". Subtítulo en gris claro: "${x.apoyo}".
En el centro, un celular y un computador portátil con las capturas adjuntas "${slug}-celular" y "${slug}-computador" en las pantallas.
Debajo: "Mira cómo se vería la página de ${x.tu}. Es una demo real: tócala desde tu celular."
Abajo a la derecha, ${QR}. Que mida un cuarto del ancho del volante.
Junto al cuadrado: "Escanea y pruébala" y "axchisan.com".`,
    })
  })
  return lista
}

function tarjetas(): Pieza[] {
  const lista: Pieza[] = [
    {
      id: "T01",
      titulo: "Tarjeta de presentación, cara",
      adjuntos: ["logo.png"],
      formato: "Horizontal 9 × 5 cm",
      prompt: `Crea la cara de una tarjeta de presentación horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución.
${MARCA}
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios. Centrado: el logo grande. Debajo, en gris claro y letra pequeña: "Páginas web, tiendas y sistemas para tu negocio". Nada más.`,
    },
    {
      id: "T02",
      titulo: "Tarjeta de presentación, reverso con tus datos",
      adjuntos: ["logo-claro.png"],
      formato: "Horizontal 9 × 5 cm",
      qr: "tarjeta-general",
      prompt: `Crea el reverso de una tarjeta de presentación horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución.
${MARCA}
Pieza clara: fondo #f3f6f9 hasta los bordes, texto #0f1720, márgenes internos amplios.
A la izquierda, en cuatro líneas: "${PROFILE.name}", "Axchi" en verde azulado #0b7c7c, "WhatsApp ${WHATSAPP.visible}", "${PROFILE.email}".
A la derecha, ${QR}. Del alto de las cuatro líneas de texto.
Debajo del cuadrado, en letra pequeña: "Mira las demos".`,
    },
  ]
  orden.forEach((slug, i) => {
    const x = SECTORES[slug]
    lista.push({
      id: `T${n(i + 3)}`,
      titulo: `Tarjeta para dejar en: ${x.corto}`,
      adjuntos: ["logo.png"],
      formato: "Horizontal 9 × 5 cm",
      qr: `tarjeta-${slug}`,
      prompt: `Crea una tarjeta horizontal de 9 x 5 cm, proporción 9:5, a la máxima resolución, para dejar en el mostrador de un negocio.
${MARCA}
Fondo casi negro #0b0f14 hasta los bordes, márgenes internos amplios.
A la izquierda, en blanco y semibold, en dos o tres líneas: "${x.frase}". Debajo, en gris claro y pequeño: "Mira la demo de ${x.tu} en axchisan.com".
A la derecha, ${QR}. Que ocupe casi todo el alto de la tarjeta.
Abajo a la izquierda, el logo pequeño.`,
      guia: "Reverso: la T02.",
    })
  })
  return lista
}

// ─── Fotos de la oficina ─────────────────────────────────────────────────

const ESCENA = `Fotografía realista de estilo editorial minimalista, como tomada con cámara profesional; no parece render 3D ni ilustración.
Escena: un escritorio blanco mate, de líneas simples, contra una pared blanca cálida y lisa. Luz natural suave que entra por una ventana a la izquierda, sombras suaves.
Sobre el escritorio, siempre los mismos tres objetos y nada más: en el centro, un MacBook Air de 13 pulgadas color medianoche (azul muy oscuro, casi negro), abierto; a la derecha, una planta pequeña, un pothos de hojas verdes en una maceta de cerámica blanca mate; a la izquierda, una taza de café de cerámica blanca sin logo.
Sin cables, papeles, marcas, logos, textos en la pared ni objetos extra. Paleta: blancos, grises cálidos, el verde de la planta y el azul medianoche del computador.`

const MISMA = `Usa la foto adjunta "oficina-base" como referencia exacta: el mismo escritorio, la misma pared, el mismo MacBook Air medianoche, la misma planta, la misma taza y la misma luz. Que parezca otra foto de la misma sesión.`

function oficina(): Pieza[] {
  return [
    {
      id: "O01",
      titulo: "Foto base de la oficina (hazla primero)",
      adjuntos: ["pantalla-axchisan.png"],
      formato: "Horizontal 3:2",
      prompt: `${ESCENA}
En la pantalla del MacBook se ve la captura adjunta "pantalla-axchisan", nítida y sin reflejos fuertes.
Cámara a la altura del escritorio, ligeramente de frente, el computador un poco a la derecha del centro. Profundidad de campo suave. Formato horizontal 3:2, máxima resolución.`,
      guia: "Genera varias y quédate con la mejor. **Guárdala también como `docs/publicidad/adjuntos/oficina-base.png`**: es la referencia de todas las demás fotos de la oficina.",
    },
    {
      id: "O02",
      titulo: "Oficina desde arriba",
      adjuntos: ["oficina-base.png", "restaurantes-computador.png"],
      formato: "Cuadrada 1:1",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el ángulo: vista cenital, desde arriba, con el MacBook abierto en el centro y la planta y la taza a los lados, con aire alrededor. En la pantalla se ve la captura adjunta "restaurantes-computador". Formato cuadrado 1:1, máxima resolución.`,
    },
    {
      id: "O03",
      titulo: "Primer plano de la pantalla",
      adjuntos: ["oficina-base.png", "programa-de-puntos-computador.png"],
      formato: "Vertical 4:5",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el encuadre: primer plano del MacBook, con la pantalla ocupando buena parte de la imagen y la hoja de la planta desenfocada en primer plano a la derecha. En la pantalla, la captura adjunta "programa-de-puntos-computador", nítida. Formato vertical 4:5, máxima resolución.`,
    },
    {
      id: "O04",
      titulo: "Oficina para historias, con espacio para texto",
      adjuntos: ["oficina-base.png", "pantalla-axchisan.png"],
      formato: "Vertical 9:16",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el formato: vertical 9:16. El escritorio ocupa el tercio inferior; los dos tercios superiores son pared blanca lisa y vacía, para poner texto encima después. En la pantalla, la captura adjunta "pantalla-axchisan". Máxima resolución.`,
    },
    {
      id: "O05",
      titulo: "Programando",
      adjuntos: ["oficina-base.png"],
      formato: "Horizontal 3:2",
      prompt: `${MISMA}
${ESCENA}
Cambia solo la pantalla: un editor de código de tema oscuro con líneas de código de colores suaves, bien ordenadas; que no se lean palabras concretas. Mismo encuadre de la foto base. Formato horizontal 3:2, máxima resolución.`,
    },
    {
      id: "O06",
      titulo: "El Mac y un celular con una demo",
      adjuntos: ["oficina-base.png", "salones-y-barberias-computador.png", "salones-y-barberias-celular.png"],
      formato: "Vertical 4:5",
      prompt: `${MISMA}
${ESCENA}
Agrega solo un objeto: un celular negro sin marca, acostado sobre el escritorio frente al MacBook, con la captura adjunta "salones-y-barberias-celular" en su pantalla. En el MacBook, la captura "salones-y-barberias-computador". Formato vertical 4:5, máxima resolución.`,
    },
    {
      id: "O07",
      titulo: "Panorámica para portadas, con espacio a la izquierda",
      adjuntos: ["oficina-base.png", "pantalla-axchisan.png"],
      formato: "Horizontal 16:9",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el formato: panorámica 16:9. El escritorio con el MacBook, la planta y la taza queda en el tercio derecho; los dos tercios izquierdos son pared blanca lisa y vacía, para poner texto encima. En la pantalla, la captura adjunta "pantalla-axchisan". Máxima resolución.`,
    },
    {
      id: "O08",
      titulo: "La misma oficina al atardecer",
      adjuntos: ["oficina-base.png", "hoteles-y-turismo-computador.png"],
      formato: "Horizontal 3:2",
      prompt: `${MISMA}
${ESCENA}
Cambia solo la luz: atardecer, luz cálida y dorada entrando por la ventana, sombras un poco más largas. En la pantalla, la captura adjunta "hoteles-y-turismo-computador". Mismo encuadre de la foto base. Formato horizontal 3:2, máxima resolución.`,
    },
    {
      id: "O09",
      titulo: "Manos en el teclado",
      adjuntos: ["oficina-base.png", "inventario-y-ventas-computador.png"],
      formato: "Vertical 4:5",
      prompt: `${MISMA}
${ESCENA}
Agrega solo unas manos escribiendo en el teclado del MacBook, vistas de cerca desde un lado, sin que se vea la cara ni el cuerpo; mangas de un suéter gris claro. En la pantalla, la captura adjunta "inventario-y-ventas-computador". Formato vertical 4:5, máxima resolución.`,
    },
    {
      id: "O10",
      titulo: "Detalle de la planta y la taza",
      adjuntos: ["oficina-base.png"],
      formato: "Cuadrada 1:1",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el encuadre: detalle de la planta y la taza en primer plano, nítidas, con el MacBook desenfocado al fondo. Formato cuadrado 1:1, máxima resolución.`,
    },
  ]
}

// ─── Documento ────────────────────────────────────────────────────────────

function documento() {
  piezas.push(
    { seccion: "Historias", intro: "Para Instagram, Facebook y estados de WhatsApp. No llevan QR: en Instagram se les pone el sticker de enlace.", items: historias() },
    { seccion: "Publicaciones", intro: "Para el feed de Instagram y Facebook. P02 a P07 son un carrusel: se publican juntas, en orden.", items: publicaciones() },
    { seccion: "Portada", intro: "Para el Perfil de Google, Facebook y LinkedIn.", items: portada() },
    { seccion: "Volantes", intro: "Media carta para imprimir. V02 es el reverso de todos. Llevan QR.", items: volantes() },
    { seccion: "Tarjetas", intro: "9 × 5 cm, el tamaño usual en Colombia. T02 es el reverso de todas. Llevan QR.", items: tarjetas() },
    {
      seccion: "Fotos de la oficina",
      intro:
        "Una serie de fotos consistente: siempre el mismo escritorio blanco, el MacBook Air medianoche, el pothos y la taza. **Haz primero la O01**; todas las demás la usan de referencia para que parezcan de la misma sesión.\n\nSon imágenes generadas: úsalas en redes, en la web y en publicaciones. Para las fotos del negocio en el Perfil de Google, Google pide fotos reales; ahí sube una foto tuya de verdad.",
      items: oficina(),
    },
  )

  const indice = piezas.map((s) => `- [${s.seccion}](#${s.seccion.toLowerCase().replace(/ /g, "-")}): ${s.items.length} piezas`).join("\n")
  let md = `# Prompts para Gemini

Generado por \`npx tsx scripts/publicidad.ts\`: no se edita a mano.

## Cómo se usa

1. Abre [gemini.google.com](https://gemini.google.com) y un **chat nuevo por pieza**, para que no mezcle una con otra.
2. En la caja de texto, toca **Herramientas** y activa **Crear imágenes** (el ícono del banano). Sin eso, Gemini puede responder con código en lugar de una imagen.
3. Sube los archivos de **Adjunta**, que están en \`docs/publicidad/adjuntos/\`.
4. Copia el prompt completo y envíalo. Si responde con código, contesta \`No quiero código. Genera la imagen.\` Si el texto sale con un error: \`Corrige solo el texto: debe decir exactamente «…». No cambies nada más.\`
5. Descarga la imagen y guárdala en \`docs/publicidad/generadas/\` con el nombre de **Guardar como** (basta el código: \`V03.png\`).
6. Las que dicen **Lleva QR** salen con un cuadro blanco vacío: avísame y les pego el QR de su sector (\`npx tsx scripts/pegar-qr.ts\`). Quedan en \`docs/publicidad/listas/\`.

Ninguna pieza muestra precios: todas llevan a la web a averiguarlo.

${indice}
`
  for (const s of piezas) {
    md += `\n## ${s.seccion}\n\n${s.intro}\n`
    for (const p of s.items) {
      md += `\n### ${p.id} · ${p.titulo}\n\n`
      md += `**Adjunta:** ${p.adjuntos.map((a) => `\`${a}\``).join(", ")}  \n`
      md += `**Formato:** ${p.formato}  \n`
      md += `**Guardar como:** \`${p.id}.png\`${p.qr ? `  \n**Lleva QR:** \`${p.qr}\`` : ""}\n`
      if (p.guia) md += `\n${p.guia}\n`
      md += `\n\`\`\`text\n${INICIO}\n${p.prompt}\n${CIERRE}\n\`\`\`\n`
    }
  }
  md += `
## Imprimir

- **Revisa el QR con tu celular** en la pieza de \`listas/\` antes de mandarla: debe abrir la página de su sector.
- **Pide a la imprenta** impresión con sangrado de 3 mm y una prueba de color: el verde azulado suele salir más apagado en papel.
- **Tarjetas:** propalcote de 300 g, plastificado mate por ambas caras. Si las quieres del tamaño de una tarjeta de crédito (8,5 × 5,4 cm) con esquinas redondeadas, pídelo con troquel: la imagen sirve igual.
- **Volantes:** propalcote de 150 g brillante para repartir; 250 g mate para dejar en mostradores.

## Medir

Cada QR lleva su origen. En \`/admin\`, **Visitas por publicidad** muestra cuántas visitas trajo cada pieza (\`volante/restaurantes\`, \`tarjeta/general\`…). Si una no trae visitas en dos semanas, cambia la frase antes de imprimir más.
`
  writeFileSync(`${DOCS}/prompts-gemini.md`, md)
  const mapa = Object.fromEntries(piezas.flatMap((s) => s.items).filter((p) => p.qr).map((p) => [p.id, p.qr]))
  writeFileSync(`${DOCS}/piezas.json`, JSON.stringify(mapa, null, 2) + "\n")
  return piezas.reduce((t, s) => t + s.items.length, 0)
}

async function main() {
  await prepararAdjuntos()
  const total = documento()
  console.log(`${total} prompts en ${DOCS}/prompts-gemini.md; adjuntos en ${ADJ}/`)
}

main()
