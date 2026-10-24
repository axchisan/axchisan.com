/**
 * Genera la publicidad impresa de Axchi, lista para la imprenta:
 *
 *   docs/publicidad/impresos/tarjeta-cara.pdf, tarjeta-reverso.pdf   9 × 5 cm, dos caras
 *   docs/publicidad/impresos/volante.pdf                             media carta, una cara
 *
 * Cada una sale también en PNG a 300 dpi para revisarla.
 *
 *   npx tsx scripts/impresos.ts
 *
 * Son solo dos piezas generales, a propósito: imprimir una versión por sector
 * multiplica el costo sin necesidad. La variedad por sector va en redes. El
 * QR lleva utm_source (la pieza), que el panel /admin cuenta en "Visitas por
 * publicidad".
 */
import { mkdirSync, readFileSync, rmSync } from "node:fs"
import { chromium } from "@playwright/test"
import QRCode from "qrcode"
import { CARAS, VIEWBOX } from "../components/site/logo-geometria"
import { SOLUCIONES } from "../lib/catalogo/soluciones"
import { PROFILE, WHATSAPP } from "../lib/site"
import { SECTORES } from "./publicidad-sectores"

const DESTINO = "docs/publicidad/impresos"
const SANGRADO = 3
const SEGURIDAD = 5

const fuente = readFileSync("app/fuentes/instrument-sans.woff2").toString("base64")
const img = (archivo: string) => `data:image/png;base64,${readFileSync(`docs/publicidad/adjuntos/${archivo}`).toString("base64")}`
const marca = (alto: string) =>
  `<svg viewBox="${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}" style="height:${alto};width:auto;display:block">${CARAS.map((c) => `<polygon points="${c.puntos}" fill="${c.color}"/>`).join("")}</svg>`
const logo = (alto: string, color: string) =>
  `<div style="display:flex;align-items:center;gap:calc(${alto} * .35);font-weight:600;font-size:calc(${alto} * .9);letter-spacing:-.02em;color:${color}">${marca(alto)}Axchi</div>`
const qr = (url: string) => QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0b0f14", light: "#ffffff" } })
const enlace = (pieza: string) => `https://axchisan.com/?utm_source=${pieza}&utm_campaign=general`

function hoja(anchoMm: number, altoMm: number, fondo: string, cuerpo: string) {
  const W = anchoMm + SANGRADO * 2
  const H = altoMm + SANGRADO * 2
  return {
    W,
    H,
    html: `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: "Instrument Sans"; src: url(data:font/woff2;base64,${fuente}) format("woff2"); font-weight: 400 700; }
@page { size: ${W}mm ${H}mm; margin: 0 }
* { margin: 0; box-sizing: border-box }
html, body { width: ${W}mm; height: ${H}mm; background: ${fondo}; font-family: "Instrument Sans", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact }
.area { position: absolute; inset: ${SANGRADO + SEGURIDAD}mm }
.qr svg { width: 100%; height: 100%; display: block }
</style><body><div class="area">${cuerpo}</div></body>`,
  }
}

type Pieza = { archivo: string; anchoMm: number; altoMm: number; fondo: string; cuerpo: string }

async function piezas(): Promise<Pieza[]> {
  const tarjetaCara: Pieza = {
    archivo: "tarjeta-cara",
    anchoMm: 90,
    altoMm: 50,
    fondo: "#0b0f14",
    cuerpo: `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3.2mm">
      ${logo("9mm", "#ffffff")}
      <p style="font-size:2.6mm;color:#9aa7b5">Páginas web, tiendas y sistemas para tu negocio</p></div>`,
  }
  const tarjetaReverso: Pieza = {
    archivo: "tarjeta-reverso",
    anchoMm: 90,
    altoMm: 50,
    fondo: "#f3f6f9",
    cuerpo: `<div style="height:100%;display:flex;align-items:center;justify-content:space-between;gap:4mm;color:#0f1720">
      <div style="font-size:2.7mm;line-height:1.55">
        <p style="font-size:3.6mm;font-weight:600;letter-spacing:-.01em">${PROFILE.name}</p>
        <p style="color:#0b7c7c;font-weight:600;margin-bottom:2mm">Axchi</p>
        <p>WhatsApp ${WHATSAPP.visible}</p>
        <p>${PROFILE.email}</p>
        <p>axchisan.com</p>
      </div>
      <div style="text-align:center;font-size:2.2mm;color:#4b5866">
        <div class="qr" style="width:24mm;height:24mm">${await qr(enlace("tarjeta"))}</div>
        <p style="margin-top:1mm">Mira las demos</p>
      </div></div>`,
  }

  // El volante dice en una sola cara qué se hace, lo muestra funcionando y
  // nombra los tipos de negocio: quien lo recibe se reconoce en la lista.
  const sectores = SOLUCIONES.map((s) => SECTORES[s.slug].corto)
  const volante: Pieza = {
    archivo: "volante",
    anchoMm: 140,
    altoMm: 216,
    fondo: "#0b0f14",
    cuerpo: `<div style="height:100%;display:flex;flex-direction:column;color:#fff">
      ${logo("7mm", "#ffffff")}
      <h1 style="margin-top:7mm;font-size:10mm;line-height:1.04;font-weight:600;letter-spacing:-.035em">Tu negocio merece una página que venda</h1>
      <p style="margin-top:3.5mm;font-size:4.2mm;line-height:1.4;color:#9aa7b5">Páginas web, tiendas en línea y sistemas de citas, pedidos e inventario.</p>
      <div style="position:relative;height:50mm;flex:none;margin:5mm 0 3mm">
        <div style="position:absolute;left:0;top:0;width:90mm;border-radius:2.4mm 2.4mm 0 0;border:2mm solid #1e2630;border-bottom-width:3mm;overflow:hidden;background:#1e2630">
          <img src="${img("restaurantes-computador.png")}" style="display:block;width:100%;height:41mm;object-fit:cover;object-position:top">
        </div>
        <div style="position:absolute;left:-4mm;top:46mm;width:98mm;height:3mm;border-radius:0 0 3mm 3mm;background:#2a3542"></div>
        <div style="position:absolute;right:0;top:2mm;width:25mm;height:48mm;border-radius:4mm;border:1.6mm solid #1e2630;overflow:hidden;background:#1e2630">
          <img src="${img("veterinarias-celular.png")}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:top">
        </div>
      </div>
      <p style="font-size:4.2mm;font-weight:600">Hay una demo funcionando para cada tipo de negocio:</p>
      <div style="margin-top:2.6mm;display:flex;flex-wrap:wrap;gap:1.6mm">
        ${sectores.map((s) => `<span style="font-size:3.1mm;padding:1mm 2.4mm;border-radius:99mm;border:.3mm solid #2a3542;color:#dfe6ee">${s}</span>`).join("")}
      </div>
      <ul style="list-style:none;padding:0;margin-top:5mm;flex:none;font-size:3.9mm;line-height:1.75;color:#dfe6ee">
        ${["La pruebas funcionando antes de contratar", "Precio cerrado por escrito y todo queda a tu nombre", "Te atendemos por WhatsApp"].map((t) => `<li style="display:flex;align-items:center;gap:2.4mm"><span style="width:2mm;height:2mm;border-radius:50%;background:#0ea5a5;flex:none"></span>${t}</li>`).join("")}
      </ul>
      <div style="margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:6mm;border-top:.3mm solid #1e2630;padding-top:5mm">
        <div>
          <p style="font-size:5mm;font-weight:600">Escanea y prueba la de tu negocio</p>
          <p style="margin-top:1.2mm;font-size:3.8mm;color:#9aa7b5">o entra a <span style="color:#0ea5a5;font-weight:600">axchisan.com</span></p>
          <p style="margin-top:1.2mm;font-size:3.4mm;color:#9aa7b5">WhatsApp ${WHATSAPP.visible}</p>
        </div>
        <div style="background:#fff;border-radius:2mm;padding:1.6mm;width:34mm;height:34mm;flex:none">
          <div class="qr" style="width:100%;height:100%">${await qr(enlace("volante"))}</div>
        </div>
      </div></div>`,
  }
  return [tarjetaCara, tarjetaReverso, volante]
}

async function main() {
  // Se borran las versiones viejas (una por sector) para que no queden sueltas.
  rmSync(DESTINO, { recursive: true, force: true })
  mkdirSync(DESTINO, { recursive: true })
  const navegador = await chromium.launch()
  for (const p of await piezas()) {
    const h = hoja(p.anchoMm, p.altoMm, p.fondo, p.cuerpo)
    const mm = 96 / 25.4
    const pagina = await navegador.newPage({ viewport: { width: Math.round(h.W * mm), height: Math.round(h.H * mm) }, deviceScaleFactor: 300 / 96 })
    await pagina.setContent(h.html, { waitUntil: "load" })
    await pagina.evaluate(() => document.fonts.ready)
    await pagina.pdf({ path: `${DESTINO}/${p.archivo}.pdf`, width: `${h.W}mm`, height: `${h.H}mm`, printBackground: true })
    await pagina.screenshot({ path: `${DESTINO}/${p.archivo}.png` })
    await pagina.close()
    console.log(p.archivo)
  }
  await navegador.close()
}

main()
