/**
 * Genera las publicaciones del primer mes en redes (Instagram y Facebook):
 *
 *   docs/publicidad/redes/<n>-<tema>.png   1080 × 1350 (4:5), listas para subir
 *
 *   npx tsx scripts/redes.ts
 *
 * Tres plantillas con la marca: demo (una captura real en un celular), consejo
 * (texto sobre fondo claro) y foto (la oficina). Los textos para el pie de
 * cada publicación están en docs/publicidad/redes.md.
 */
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs"
import { chromium } from "@playwright/test"
import { CARAS, FONDO_MARCA, VIEWBOX } from "../components/site/logo-geometria"
import { SECTORES } from "./publicidad-sectores"

const DESTINO = "docs/publicidad/redes"
const ADJ = "docs/publicidad/adjuntos"
const fuente = readFileSync("app/fuentes/instrument-sans.woff2").toString("base64")
const datos = (archivo: string, tipo = "image/png") => `data:${tipo};base64,${readFileSync(archivo).toString("base64")}`
const marca = (alto: number) =>
  `<svg viewBox="${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}" height="${alto}" width="${(alto * VIEWBOX.w) / VIEWBOX.h}" style="display:block">${CARAS.map((c) => `<polygon points="${c.puntos}" fill="${c.color}"/>`).join("")}</svg>`
const logo = (color: string) => `<div style="display:flex;align-items:center;gap:14px;font-size:34px;font-weight:600;letter-spacing:-.02em;color:${color}">${marca(38)}Axchi</div>`

const base = (fondo: string, cuerpo: string) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: "Instrument Sans"; src: url(data:font/woff2;base64,${fuente}) format("woff2"); font-weight: 400 700; }
* { margin: 0; box-sizing: border-box }
body { width: 1080px; height: 1350px; overflow: hidden; background: ${fondo}; font-family: "Instrument Sans", sans-serif; position: relative }
h1 { font-weight: 600; letter-spacing: -.035em; line-height: 1.03 }
</style>${cuerpo}`

/** Una demo: la pregunta del sector arriba y la captura real en un celular. */
function demo(slug: string) {
  const x = SECTORES[slug]
  return base(
    FONDO_MARCA,
    `<div style="position:absolute;inset:72px 72px 0;color:#fff">
      ${logo("#fff")}
      <h1 style="margin-top:56px;font-size:76px;max-width:14ch">${x.frase}</h1>
      <p style="margin-top:24px;font-size:32px;line-height:1.35;color:#9aa7b5;max-width:28ch">${x.apoyo}</p>
    </div>
    <div style="position:absolute;left:50%;transform:translateX(-50%) rotate(-3deg);top:690px;width:420px;height:860px;border-radius:56px;border:14px solid #1e2630;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.6)">
      <img src="${datos(`${ADJ}/${slug}-celular.png`)}" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block">
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(transparent,${FONDO_MARCA} 55%)"></div>
    <p style="position:absolute;left:72px;bottom:56px;font-size:30px;color:#fff">Pruébala en <span style="color:#0ea5a5;font-weight:600">axchisan.com</span></p>`,
  )
}

/** Un consejo: titular y una lista corta sobre fondo claro. */
function consejo(titulo: string, puntos: string[], cierre: string) {
  return base(
    "#f3f6f9",
    `<div style="position:absolute;inset:80px;display:flex;flex-direction:column;color:#0f1720">
      ${logo("#0f1720")}
      <h1 style="margin-top:70px;font-size:78px;max-width:15ch">${titulo}</h1>
      <ol style="margin-top:54px;list-style:none;padding:0;display:flex;flex-direction:column;gap:26px">
        ${puntos.map((p, i) => `<li style="display:flex;gap:26px;font-size:36px;line-height:1.3"><span style="flex:none;width:58px;height:58px;border-radius:50%;background:#0ea5a5;color:#04201f;font-weight:600;display:flex;align-items:center;justify-content:center;font-size:30px">${i + 1}</span><span style="padding-top:6px">${p}</span></li>`).join("")}
      </ol>
      <p style="margin-top:auto;font-size:32px;color:#4b5866">${cierre}</p>
    </div>`,
  )
}

/** Una foto de la oficina con el texto encima, abajo. */
function foto(archivo: string, titulo: string, texto: string) {
  const tipo = archivo.endsWith(".jpg") ? "image/jpeg" : "image/png"
  return base(
    FONDO_MARCA,
    `<img src="${datos(`${ADJ}/${archivo}`, tipo)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
    <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(11,15,20,.92) 0%, rgba(11,15,20,.6) 38%, transparent 62%)"></div>
    <div style="position:absolute;left:72px;right:72px;bottom:72px;color:#fff">
      <h1 style="font-size:72px;max-width:15ch">${titulo}</h1>
      <p style="margin-top:22px;font-size:32px;line-height:1.4;color:#dfe6ee;max-width:30ch">${texto}</p>
      <div style="margin-top:36px">${logo("#fff")}</div>
    </div>`,
  )
}

/** Tres celulares con demos distintas: "hay una para cada negocio". */
function abanico() {
  const cel = (slug: string, giro: number, x: number, y: number) =>
    `<div style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${giro}deg);width:330px;height:680px;border-radius:46px;border:12px solid #1e2630;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.55)"><img src="${datos(`${ADJ}/${slug}-celular.png`)}" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block"></div>`
  return base(
    FONDO_MARCA,
    `<div style="position:absolute;inset:72px 72px 0;color:#fff">
      ${logo("#fff")}
      <h1 style="margin-top:56px;font-size:80px;max-width:13ch">Prueba la página de tu negocio antes de pagarla</h1>
    </div>
    ${cel("restaurantes", -8, 40, 640)}${cel("salones-y-barberias", 0, 375, 600)}${cel("veterinarias", 8, 710, 640)}
    <div style="position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(transparent,${FONDO_MARCA} 55%)"></div>
    <p style="position:absolute;left:72px;bottom:56px;font-size:30px;color:#fff">Una demo funcionando por tipo de negocio en <span style="color:#0ea5a5;font-weight:600">axchisan.com</span></p>`,
  )
}

const oficina = existsSync(`${ADJ}/oficina-base.jpg`) ? "oficina-base.jpg" : "pantalla-axchisan.png"

const PUBLICACIONES: [string, string][] = [
  ["01-presentacion", foto(oficina, "Hago páginas web para negocios de Colombia", "Soy Duvan, desarrollador de software. Desde ahora esta cuenta es de Axchi: páginas, tiendas y sistemas para negocios como el tuyo.")],
  ["02-demo-restaurantes", demo("restaurantes")],
  ["03-consejo-senales", consejo("5 señales de que tu negocio necesita página", ["Te preguntan lo mismo diez veces al día por WhatsApp", "Quien te busca en Google no te encuentra", "Anotas pedidos o citas en un cuaderno", "Tu competencia ya recibe pedidos en línea", "No sabes cuánto vendiste este mes"], "¿Te pasan dos o más? Mira cómo se resolvería en axchisan.com")],
  ["04-demo-veterinarias", demo("veterinarias")],
  ["05-pruebala", abanico()],
  ["06-demo-barberias", demo("salones-y-barberias")],
  ["07-consejo-redes", consejo("Tus redes no son tu página", ["En redes le hablas a tus seguidores; en Google te encuentra quien todavía no te conoce", "Una página es tuya: no depende de un algoritmo", "Ahí te pueden pedir, reservar o pagar sin esperar a que contestes"], "Las dos se complementan. Mira ejemplos en axchisan.com")],
  ["08-demo-ferreterias", demo("inventario-y-ventas")],
  ["09-como-trabajo", foto(oficina, "Así trabajo", "Precio cerrado por escrito antes de empezar. Ves los avances desde tu celular. Al final, el dominio, el código y los datos quedan a tu nombre.")],
  ["10-demo-panaderias", demo("panaderias-y-cafeterias")],
  ["11-consejo-cuanto-cuesta", consejo("¿Cuánto cuesta una página para tu negocio?", ["Depende de lo que necesites: mostrar, vender o agendar", "Puedes pagarla de una vez o por mes", "El precio va por escrito, antes de empezar"], "Mira los planes en axchisan.com/planes")],
  ["12-demo-puntos", demo("programa-de-puntos")],
]

async function main() {
  rmSync(DESTINO, { recursive: true, force: true })
  mkdirSync(DESTINO, { recursive: true })
  const navegador = await chromium.launch()
  const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const [nombre, html] of PUBLICACIONES) {
    await pagina.setContent(html, { waitUntil: "load" })
    await pagina.evaluate(() => document.fonts.ready)
    await pagina.screenshot({ path: `${DESTINO}/${nombre}.png` })
    console.log(nombre)
  }
  await navegador.close()
}

main()
