/**
 * Genera la imagen social por defecto (`public/og.png`, 1200×630).
 *
 *   npm run og
 *
 * Es un archivo estático a propósito: la tarjeta no cambia entre visitas y
 * generarla con next/og en cada petición solo añade peso a las funciones.
 */
import { CARAS, FONDO_MARCA, VIEWBOX } from "../components/site/logo-geometria"
import { chromium } from "@playwright/test"

const marca = `<svg viewBox="${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}" width="84" height="60">${CARAS.map(
  (c) => `<polygon points="${c.puntos}" fill="${c.color}"/>`,
).join("")}</svg>`

const html = `<!doctype html>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box }
  body { width: 1200px; height: 630px; background: ${FONDO_MARCA}; color: #fff;
         font-family: "Instrument Sans", sans-serif; padding: 72px 80px;
         display: flex; flex-direction: column }
  .marca { display: flex; align-items: center; gap: 18px; font-size: 40px; font-weight: 600; letter-spacing: -0.02em }
  h1 { margin-top: 64px; font-size: 68px; line-height: 1.04; font-weight: 600; letter-spacing: -0.035em; max-width: 17ch }
  p { margin-top: 22px; font-size: 30px; color: #9aa7b5 }
  .pie { margin-top: auto; display: flex; align-items: baseline; justify-content: space-between;
         border-top: 1px solid #1e2630; padding-top: 28px }
  .precio { font-size: 30px; color: #9aa7b5 }
  .precio b { color: #fff; font-size: 44px; font-weight: 600; margin-left: 10px }
  .url { font-size: 28px; color: #0ea5a5 }
</style>
<div class="marca">${marca}Axchi</div>
<h1>Páginas web, tiendas y sistemas para tu negocio</h1>
<p>Pruébalos funcionando antes de contratar.</p>
<div class="pie"><span class="precio">Desde<b>$ 300.000</b></span><span class="url">axchisan.com</span></div>`

async function main() {
  const navegador = await chromium.launch()
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } })
  await pagina.setContent(html, { waitUntil: "networkidle" })
  await pagina.evaluate(() => document.fonts.ready)
  await pagina.screenshot({ path: "public/og.png" })
  await navegador.close()
  console.log("public/og.png generada.")
}

main()
