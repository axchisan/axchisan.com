/**
 * Genera el material para producir la publicidad con Gemini:
 *
 *   docs/publicidad/adjuntos/        las imágenes que se suben a Gemini, listas y con nombres simples
 *   docs/publicidad/prompts-gemini.md  un prompt completo por pieza: copiar, pegar, descargar
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
import { SECTORES } from "./publicidad-sectores"

const DOCS = "docs/publicidad"
const ADJ = `${DOCS}/adjuntos`


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


type Pieza = { id: string; titulo: string; adjuntos: string[]; formato: string; prompt: string; guia?: string }

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
  // La publicidad no muestra precios: se oculta el recuadro "Desde $ …" de la portada.
  await web.evaluate(() => {
    for (const el of document.querySelectorAll("main *")) {
      if (el.children.length === 0 && /\$\s?\d/.test(el.textContent ?? "")) {
        // Se sube hasta el recuadro con borde que contiene el precio.
        let caja: Element | null = el
        while (caja && caja !== document.body && parseFloat(getComputedStyle(caja).borderTopWidth) === 0) caja = caja.parentElement
        if (caja instanceof HTMLElement && caja !== document.body) caja.style.visibility = "hidden"
      }
    }
  })
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
      guia: "Genera varias y quédate con la mejor. **Guárdala también como `docs/publicidad/adjuntos/oficina-base.jpg`**: es la referencia de todas las demás fotos de la oficina.",
    },
    {
      id: "O02",
      titulo: "Oficina desde arriba",
      adjuntos: ["oficina-base.jpg", "restaurantes-computador.png"],
      formato: "Cuadrada 1:1",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el ángulo: vista cenital, desde arriba, con el MacBook abierto en el centro y la planta y la taza a los lados, con aire alrededor. En la pantalla se ve la captura adjunta "restaurantes-computador". Formato cuadrado 1:1, máxima resolución.`,
    },
    {
      id: "O03",
      titulo: "Primer plano de la pantalla",
      adjuntos: ["oficina-base.jpg", "programa-de-puntos-computador.png"],
      formato: "Vertical 4:5",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el encuadre: primer plano del MacBook, con la pantalla ocupando buena parte de la imagen y la hoja de la planta desenfocada en primer plano a la derecha. En la pantalla, la captura adjunta "programa-de-puntos-computador", nítida. Formato vertical 4:5, máxima resolución.`,
    },
    {
      id: "O04",
      titulo: "Oficina para historias, con espacio para texto",
      adjuntos: ["oficina-base.jpg", "pantalla-axchisan.png"],
      formato: "Vertical 9:16",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el formato: vertical 9:16. El escritorio ocupa el tercio inferior; los dos tercios superiores son pared blanca lisa y vacía, para poner texto encima después. En la pantalla, la captura adjunta "pantalla-axchisan". Máxima resolución.`,
    },
    {
      id: "O05",
      titulo: "Programando",
      adjuntos: ["oficina-base.jpg"],
      formato: "Horizontal 3:2",
      prompt: `${MISMA}
${ESCENA}
Cambia solo la pantalla: un editor de código de tema oscuro con líneas de código de colores suaves, bien ordenadas; que no se lean palabras concretas. Mismo encuadre de la foto base. Formato horizontal 3:2, máxima resolución.`,
    },
    {
      id: "O06",
      titulo: "El Mac y un celular con una demo",
      adjuntos: ["oficina-base.jpg", "salones-y-barberias-computador.png", "salones-y-barberias-celular.png"],
      formato: "Vertical 4:5",
      prompt: `${MISMA}
${ESCENA}
Agrega solo un objeto: un celular negro sin marca, acostado sobre el escritorio frente al MacBook, con la captura adjunta "salones-y-barberias-celular" en su pantalla. En el MacBook, la captura "salones-y-barberias-computador". Formato vertical 4:5, máxima resolución.`,
    },
    {
      id: "O07",
      titulo: "Panorámica para portadas, con espacio a la izquierda",
      adjuntos: ["oficina-base.jpg", "pantalla-axchisan.png"],
      formato: "Horizontal 16:9",
      prompt: `${MISMA}
${ESCENA}
Cambia solo el formato: panorámica 16:9. El escritorio con el MacBook, la planta y la taza queda en el tercio derecho; los dos tercios izquierdos son pared blanca lisa y vacía, para poner texto encima. En la pantalla, la captura adjunta "pantalla-axchisan". Máxima resolución.`,
    },
    {
      id: "O08",
      titulo: "La misma oficina al atardecer",
      adjuntos: ["oficina-base.jpg", "hoteles-y-turismo-computador.png"],
      formato: "Horizontal 3:2",
      prompt: `${MISMA}
${ESCENA}
Cambia solo la luz: atardecer, luz cálida y dorada entrando por la ventana, sombras un poco más largas. En la pantalla, la captura adjunta "hoteles-y-turismo-computador". Mismo encuadre de la foto base. Formato horizontal 3:2, máxima resolución.`,
    },
    {
      id: "O09",
      titulo: "Manos en el teclado",
      adjuntos: ["oficina-base.jpg", "inventario-y-ventas-computador.png"],
      formato: "Vertical 4:5",
      prompt: `${MISMA}
${ESCENA}
Agrega solo unas manos escribiendo en el teclado del MacBook, vistas de cerca desde un lado, sin que se vea la cara ni el cuerpo; mangas de un suéter gris claro. En la pantalla, la captura adjunta "inventario-y-ventas-computador". Formato vertical 4:5, máxima resolución.`,
    },
    {
      id: "O10",
      titulo: "Detalle de la planta y la taza",
      adjuntos: ["oficina-base.jpg"],
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
    { seccion: "Portada", intro: "Para el Perfil de Google, Facebook y LinkedIn. Ya está hecha: `generadas/G01.jpg`.", items: portada() },
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

Ninguna pieza muestra precios: todas llevan a la web a averiguarlo.

Las publicaciones del feed salen de \`npx tsx scripts/redes.ts\` y su calendario está en \`docs/publicidad/redes.md\`: aquí quedan solo las fotos que Gemini hace bien.

Las tarjetas y los volantes **no** se hacen con Gemini: llevan texto exacto y un QR que tiene que escanearse, y salen listos para la imprenta de \`npx tsx scripts/impresos.ts\` (ver \`docs/publicidad/README.md\`).

${indice}
`
  for (const s of piezas) {
    md += `\n## ${s.seccion}\n\n${s.intro}\n`
    for (const p of s.items) {
      md += `\n### ${p.id} · ${p.titulo}\n\n`
      md += `**Adjunta:** ${p.adjuntos.map((a) => `\`${a}\``).join(", ")}  \n`
      md += `**Formato:** ${p.formato}  \n`
      md += `**Guardar como:** \`${p.id}.png\`\n`
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
  return piezas.reduce((t, s) => t + s.items.length, 0)
}

async function main() {
  await prepararAdjuntos()
  const total = documento()
  console.log(`${total} prompts en ${DOCS}/prompts-gemini.md; adjuntos en ${ADJ}/`)
}

main()
