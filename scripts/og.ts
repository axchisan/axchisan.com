/**
 * Genera las tarjetas sociales (1200×630):
 *
 *   public/og.png            la general, para la portada y las páginas sin tarjeta propia
 *   public/og/planes.png     planes y precios
 *   public/og/<ficha>.png    una por solución, con las capturas de su demo
 *
 *   npm run og
 *
 * Son archivos estáticos a propósito: no cambian entre visitas, y generarlas
 * con next/og en cada petición solo añade peso a las funciones.
 *
 * WhatsApp muestra la tarjeta recortada a un cuadrado central cuando el enlace
 * no va solo en el mensaje. Por eso todo lo que se tiene que leer (marca,
 * titular, precio) vive en el cuadrado del centro, y los lados llevan las
 * capturas, que pueden perderse sin que la tarjeta deje de decir qué es.
 */
import { mkdirSync, readFileSync } from "node:fs"
import { chromium } from "@playwright/test"
import { CARAS, FONDO_MARCA, VIEWBOX } from "../components/site/logo-geometria"
import { PLANES, PRECIO_ENTRADA, MENSUAL_ENTRADA, pesos } from "../lib/catalogo/planes"
import { SOLUCIONES } from "../lib/catalogo/soluciones"

const marca = (alto: number) =>
  `<svg viewBox="${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}" height="${alto}" width="${(alto * VIEWBOX.w) / VIEWBOX.h}">${CARAS.map(
    (c) => `<polygon points="${c.puntos}" fill="${c.color}"/>`,
  ).join("")}</svg>`

/** Una captura de `public/` como data URI: la página se arma sin servidor. */
const imagen = (ruta: string) => `data:image/webp;base64,${readFileSync(`public${ruta}`).toString("base64")}`

const estilos = `
  * { margin: 0; box-sizing: border-box }
  body { width: 1200px; height: 630px; overflow: hidden; background: ${FONDO_MARCA}; color: #fff;
         font-family: "Instrument Sans", sans-serif; position: relative }
  .centro { position: absolute; left: 285px; width: 630px; top: 0; bottom: 0; padding: 56px 24px;
            display: flex; flex-direction: column; align-items: center; text-align: center; z-index: 2 }
  .marca { display: flex; align-items: center; gap: 12px; font-size: 30px; font-weight: 600; letter-spacing: -0.02em }
  .antetitulo { margin-top: 40px; font-size: 26px; color: #0ea5a5; font-weight: 600 }
  h1 { margin-top: 10px; font-weight: 600; letter-spacing: -0.035em; line-height: 1.03 }
  p { margin-top: 20px; font-size: 25px; line-height: 1.35; color: #9aa7b5 }
  .pie { margin-top: auto; font-size: 25px; color: #9aa7b5 }
  .pie b { color: #fff; font-size: 38px; font-weight: 600; margin-left: 8px }
  .lado { position: absolute; top: 0; bottom: 0; width: 300px; z-index: 1 }
  .lado.izq { left: 0 } .lado.der { right: 0 }
  .telefono { position: absolute; width: 214px; border-radius: 30px; border: 7px solid #1e2630;
              overflow: hidden; background: #1e2630; box-shadow: 0 30px 60px rgba(0,0,0,.5) }
  .telefono img { display: block; width: 100%; height: auto }
  .pantalla { position: absolute; width: 520px; border-radius: 12px; border: 6px solid #1e2630;
              overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,.5) }
  .pantalla img { display: block; width: 100%; height: auto }
  /* Los lados se funden con el fondo hacia el centro, para que el texto respire. */
  .velo { position: absolute; top: 0; bottom: 0; width: 120px; z-index: 1 }
  .velo.izq { left: 230px; background: linear-gradient(90deg, transparent, ${FONDO_MARCA}) }
  .velo.der { right: 230px; background: linear-gradient(270deg, transparent, ${FONDO_MARCA}) }
`

function pagina(cuerpo: string) {
  return `<!doctype html>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&display=block" rel="stylesheet">
<style>${estilos}</style>${cuerpo}`
}

function lados(izquierda: string, derecha: string) {
  return `<div class="lado izq">${izquierda}</div><div class="lado der">${derecha}</div><div class="velo izq"></div><div class="velo der"></div>`
}

const telefono = (src: string, estilo: string) => `<div class="telefono" style="${estilo}"><img src="${imagen(src)}"></div>`
const pantalla = (src: string, estilo: string) => `<div class="pantalla" style="${estilo}"><img src="${imagen(src)}"></div>`

type Tarjeta = { archivo: string; html: string }

function general(): Tarjeta {
  const movil = (slug: string) => SOLUCIONES.find((s) => s.slug === slug)!.capturas.movil.src
  return {
    archivo: "public/og.png",
    html: pagina(`
      ${lados(
        telefono(movil("restaurantes"), "left: 22px; top: 70px; transform: rotate(-7deg)") + telefono(movil("veterinarias"), "left: -120px; top: 250px; transform: rotate(-4deg); opacity: .8"),
        telefono(movil("abogados-y-contadores"), "right: 22px; top: 60px; transform: rotate(6deg)") + telefono(movil("gimnasios-y-estudios"), "right: -120px; top: 250px; transform: rotate(4deg); opacity: .8"),
      )}
      <div class="centro">
        <div class="marca">${marca(40)}Axchi</div>
        <h1 style="margin-top: 52px; font-size: 58px; max-width: 13.5ch">Páginas web, tiendas y sistemas para tu negocio</h1>
        <p>Pruébalos funcionando antes de contratar: una demo por cada tipo de negocio.</p>
        <div class="pie">Desde<b>${pesos(PRECIO_ENTRADA)}</b></div>
      </div>`),
  }
}

function planes(): Tarjeta {
  const precios = [PLANES.presencia, PLANES["pagina-profesional"], PLANES["sistema-de-gestion"]]
  const fila = (nombre: string, precio: number) =>
    `<div style="display:flex; justify-content:space-between; gap:24px; padding:14px 0; border-top:1px solid #1e2630; font-size:24px"><span style="color:#9aa7b5">${nombre}</span><b style="font-weight:600">${pesos(precio)}</b></div>`
  return {
    archivo: "public/og/planes.png",
    html: pagina(`
      <div class="centro" style="padding-top: 48px">
        <div class="marca">${marca(34)}Axchi</div>
        <h1 style="margin-top: 36px; font-size: 54px">Planes y precios</h1>
        <p style="margin-top: 12px">Precio cerrado por escrito, en un pago o por mes desde ${pesos(MENSUAL_ENTRADA)}.</p>
        <div style="margin-top: 28px; width: 100%; text-align: left">${precios.map((p) => fila(p.nombre, p.desde)).join("")}</div>
        <div class="pie" style="color:#0ea5a5">axchisan.com/planes</div>
      </div>`),
  }
}

function ficha(s: (typeof SOLUCIONES)[number]): Tarjeta {
  const desde = Math.min(...s.planes.map((p) => PLANES[p].desde))
  const muestra = s.muestra.tipo === "demo" ? `Demo: ${s.muestra.nombre}` : `En producción: ${s.muestra.nombre}`
  return {
    archivo: `public/og/${s.slug}.png`,
    html: pagina(`
      ${lados(
        pantalla(s.capturas.escritorio.src, "left: -250px; top: 110px; transform: rotate(-3deg)"),
        telefono(s.capturas.movil.src, "right: 40px; top: 56px; transform: rotate(5deg)"),
      )}
      <div class="centro">
        <div class="marca">${marca(34)}Axchi</div>
        <div class="antetitulo">${muestra}</div>
        <h1 style="font-size: ${s.sector.length > 22 ? 58 : 66}px">${s.sector}</h1>
        <p>${s.titulo.split(" para ")[0]}.</p>
        <div class="pie">Desde<b>${pesos(desde)}</b></div>
      </div>`),
  }
}

async function main() {
  mkdirSync("public/og", { recursive: true })
  const navegador = await chromium.launch()
  const hoja = await navegador.newPage({ viewport: { width: 1200, height: 630 } })
  const filtro = process.argv[2] ?? ""
  for (const t of [general(), planes(), ...SOLUCIONES.map(ficha)].filter((t) => t.archivo.includes(filtro))) {
    await hoja.setContent(t.html, { waitUntil: "networkidle" })
    await hoja.evaluate(() => document.fonts.ready)
    await hoja.screenshot({ path: t.archivo })
    console.log(t.archivo)
  }
  await navegador.close()
}

main()
