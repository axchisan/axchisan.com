/**
 * Genera todos los iconos del sitio desde la geometría del logo.
 *
 *   npm run iconos
 *
 * Salidas:
 *   app/icon.svg            pestaña del navegador, nítida a cualquier densidad
 *   app/favicon.ico         16, 32 y 48 px, para quien lo pide a ciegas en /favicon.ico
 *   app/apple-icon.png      180 px, pantalla de inicio de iOS
 *   public/icon-192.png     manifest
 *   public/icon-512.png     manifest
 *   public/icon-maskable-512.png   manifest, con la zona segura que exige Android
 *
 * Next enlaza solos los tres archivos de `app/`. Los de `public/` los declara
 * `app/manifest.ts`.
 */
import { writeFileSync } from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"
import { CARAS, FONDO_MARCA, VIEWBOX } from "../components/site/logo-geometria"

const poligonos = CARAS.map((c) => `<polygon points="${c.puntos}" fill="${c.color}"/>`).join("")

/**
 * La marca centrada en un lienzo cuadrado. `escala` es la fracción del ancho
 * que ocupa la cinta: 0,8 para un favicon (cada píxel cuenta) y 0,5 para el
 * icono enmascarable, que Android recorta en círculo.
 */
function svgCuadrado(escala: number, fondo: string | null) {
  const lado = VIEWBOX.w / escala
  const x = VIEWBOX.x - (lado - VIEWBOX.w) / 2
  const y = VIEWBOX.y - (lado - VIEWBOX.h) / 2
  const rect = fondo ? `<rect x="${x}" y="${y}" width="${lado}" height="${lado}" fill="${fondo}"/>` : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${lado} ${lado}">${rect}${poligonos}</svg>`
}

/**
 * Empaqueta PNG en un .ico. El formato admite PNG dentro desde Windows Vista:
 * cabecera de 6 bytes, una entrada de 16 bytes por imagen y los PNG seguidos.
 */
function ico(pngs: { lado: number; datos: Buffer }[]) {
  const cabecera = Buffer.alloc(6)
  cabecera.writeUInt16LE(0, 0)
  cabecera.writeUInt16LE(1, 2)
  cabecera.writeUInt16LE(pngs.length, 4)

  let desplazamiento = 6 + 16 * pngs.length
  const entradas = pngs.map(({ lado, datos }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(lado >= 256 ? 0 : lado, 0)
    e.writeUInt8(lado >= 256 ? 0 : lado, 1)
    e.writeUInt16LE(1, 4) // planos
    e.writeUInt16LE(32, 6) // bits por píxel
    e.writeUInt32LE(datos.length, 8)
    e.writeUInt32LE(desplazamiento, 12)
    desplazamiento += datos.length
    return e
  })
  return Buffer.concat([cabecera, ...entradas, ...pngs.map((p) => p.datos)])
}

async function main() {
  const navegador = await chromium.launch()
  const pagina = await navegador.newPage()

  async function png(svg: string, lado: number) {
    await pagina.setViewportSize({ width: lado, height: lado })
    await pagina.setContent(
      `<style>html,body{margin:0;background:transparent}svg{display:block;width:${lado}px;height:${lado}px}</style>${svg}`,
    )
    const captura = await pagina.screenshot({ omitBackground: true, type: "png" })
    // Chromium guarda en RGB las capturas sin transparencia, y el lector de
    // .ico de Next solo acepta PNG en RGBA.
    return sharp(captura).ensureAlpha().png().toBuffer()
  }

  // Pestaña: sin fondo, para que la cinta se vea sobre pestañas claras y oscuras.
  writeFileSync("app/icon.svg", svgCuadrado(0.9, null))

  // Tamaños pequeños con fondo: a 16 px la cinta sola se pierde sobre gris.
  const pequeno = svgCuadrado(0.8, FONDO_MARCA)
  const tamanosIco = [16, 32, 48]
  const pngsIco = []
  for (const lado of tamanosIco) pngsIco.push({ lado, datos: await png(pequeno, lado) })
  writeFileSync("app/favicon.ico", ico(pngsIco))

  const app = svgCuadrado(0.72, FONDO_MARCA)
  writeFileSync("app/apple-icon.png", await png(app, 180))
  writeFileSync("public/icon-192.png", await png(app, 192))
  writeFileSync("public/icon-512.png", await png(app, 512))
  writeFileSync("public/icon-maskable-512.png", await png(svgCuadrado(0.5, FONDO_MARCA), 512))

  await navegador.close()
  console.log("Iconos generados.")
}

main()
