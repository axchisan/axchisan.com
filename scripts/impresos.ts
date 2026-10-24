/**
 * Genera la publicidad impresa lista para la imprenta:
 *
 *   docs/publicidad/impresos/<pieza>.pdf   medida final más 3 mm de sangrado, vectorial
 *   docs/publicidad/impresos/<pieza>.png   la misma pieza a 300 dpi, para revisarla
 *
 *   npx tsx scripts/impresos.ts            todas
 *   npx tsx scripts/impresos.ts tarjeta    solo las que contengan "tarjeta"
 *
 * Las piezas con texto exacto y QR se arman aquí y no con Gemini: Gemini se
 * equivoca en las letras y no dibuja QR que se puedan escanear. Cada QR lleva
 * utm_source (la pieza) y utm_campaign (el sector), que el panel /admin cuenta
 * en "Visitas por publicidad".
 */
import { mkdirSync, readFileSync } from "node:fs"
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

async function qr(url: string, oscuro = "#0b0f14") {
  return QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: oscuro, light: "#ffffff" } })
}
const enlace = (pieza: string, campana: string, ruta = "/") => `https://axchisan.com${ruta}?utm_source=${pieza}&utm_campaign=${campana}`

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

// ─── Tarjetas (9 × 5 cm) ─────────────────────────────────────────────────

async function tarjetas(): Promise<Pieza[]> {
  const lista: Pieza[] = [
    {
      archivo: "tarjeta-cara",
      anchoMm: 90,
      altoMm: 50,
      fondo: "#0b0f14",
      cuerpo: `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3.2mm">
        ${logo("9mm", "#ffffff")}
        <p style="font-size:2.6mm;color:#9aa7b5">Páginas web, tiendas y sistemas para tu negocio</p></div>`,
    },
    {
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
          <div class="qr" style="width:24mm;height:24mm">${await qr(enlace("tarjeta", "general"))}</div>
          <p style="margin-top:1mm">Mira las demos</p>
        </div></div>`,
    },
  ]
  for (const s of SOLUCIONES) {
    const x = SECTORES[s.slug]
    lista.push({
      archivo: `tarjeta-${s.slug}`,
      anchoMm: 90,
      altoMm: 50,
      fondo: "#0b0f14",
      cuerpo: `<div style="height:100%;display:flex;align-items:center;justify-content:space-between;gap:4mm">
        <div style="height:100%;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <p style="font-size:4.1mm;line-height:1.15;font-weight:600;letter-spacing:-.015em;color:#fff;max-width:44mm">${x.frase}</p>
            <p style="margin-top:2.2mm;font-size:2.4mm;line-height:1.35;color:#9aa7b5;max-width:44mm">Mira la demo de ${x.tu}. Escanea el código.</p>
          </div>
          ${logo("4mm", "#ffffff")}
        </div>
        <div style="background:#fff;border-radius:1.5mm;padding:1.2mm;width:30mm;height:30mm;flex:none">
          <div class="qr" style="width:100%;height:100%">${await qr(enlace("tarjeta", s.slug, `/soluciones/${s.slug}`))}</div>
        </div></div>`,
    })
  }
  return lista
}

// ─── Volantes (media carta, 14 × 21,6 cm) ────────────────────────────────

/** Un computador y un celular con las capturas de una demo. */
function pantallas(computador: string, celular: string) {
  return `<div style="position:relative;height:66mm;margin:6mm 0 2mm">
    <div style="position:absolute;left:0;top:0;width:96mm;border-radius:2.4mm 2.4mm 0 0;border:2mm solid #1e2630;border-bottom-width:3mm;overflow:hidden;background:#1e2630">
      <img src="${img(computador)}" style="display:block;width:100%;height:54mm;object-fit:cover;object-position:top">
    </div>
    <div style="position:absolute;left:-4mm;top:59mm;width:104mm;height:3mm;border-radius:0 0 3mm 3mm;background:#2a3542"></div>
    <div style="position:absolute;right:0;top:6mm;width:30mm;height:60mm;border-radius:4mm;border:1.6mm solid #1e2630;overflow:hidden;background:#1e2630;box-shadow:0 0 0 .3mm #2a3542">
      <img src="${img(celular)}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:top">
    </div></div>`
}

async function volanteCara(archivo: string, titular: string, apoyo: string, linea: string, puntos: string[], computador: string, celular: string, url: string): Promise<Pieza> {
  return {
    archivo,
    anchoMm: 140,
    altoMm: 216,
    fondo: "#0b0f14",
    cuerpo: `<div style="height:100%;display:flex;flex-direction:column;color:#fff">
      ${logo("7mm", "#ffffff")}
      <h1 style="margin-top:9mm;font-size:10.5mm;line-height:1.04;font-weight:600;letter-spacing:-.035em">${titular}</h1>
      <p style="margin-top:4mm;font-size:4.2mm;line-height:1.4;color:#9aa7b5">${apoyo}</p>
      ${pantallas(computador, celular)}
      <p style="font-size:3.9mm;line-height:1.45;color:#dfe6ee">${linea}</p>
      <ul style="list-style:none;padding:0;margin-top:3mm;font-size:3.7mm;line-height:1.7;color:#dfe6ee">
        ${puntos.map((p) => `<li style="display:flex;align-items:center;gap:2.4mm"><span style="width:2mm;height:2mm;border-radius:50%;background:#0ea5a5;flex:none"></span>${p}</li>`).join("")}
      </ul>
      <div style="margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:6mm;border-top:.3mm solid #1e2630;padding-top:5mm">
        <div>
          <p style="font-size:5mm;font-weight:600">Escanea y pruébala</p>
          <p style="margin-top:1.2mm;font-size:3.8mm;color:#9aa7b5">o entra a <span style="color:#0ea5a5;font-weight:600">axchisan.com</span></p>
          <p style="margin-top:1.2mm;font-size:3.4mm;color:#9aa7b5">WhatsApp ${WHATSAPP.visible}</p>
        </div>
        <div style="background:#fff;border-radius:2mm;padding:1.6mm;width:36mm;height:36mm;flex:none">
          <div class="qr" style="width:100%;height:100%">${await qr(url)}</div>
        </div>
      </div></div>`,
  }
}

async function volantes(): Promise<Pieza[]> {
  const lista: Pieza[] = [
    await volanteCara(
      "volante-general",
      "Tu negocio merece una página que venda",
      "Páginas web, tiendas en línea y sistemas de citas, pedidos e inventario.",
      "Hay una demo funcionando para cada tipo de negocio: tócala desde tu celular antes de decidir.",
      ["Pruébala antes de contratar", "Todo queda a tu nombre", "Te atendemos por WhatsApp"],
      "restaurantes-computador.png",
      "veterinarias-celular.png",
      enlace("volante", "general"),
    ),
    {
      archivo: "volante-reverso",
      anchoMm: 140,
      altoMm: 216,
      fondo: "#f3f6f9",
      cuerpo: `<div style="height:100%;display:flex;flex-direction:column;color:#0f1720">
        ${logo("6mm", "#0f1720")}
        <h2 style="margin-top:8mm;font-size:8.4mm;line-height:1.08;font-weight:600;letter-spacing:-.03em">¿Qué tipo de negocio tienes?</h2>
        <p style="margin-top:3mm;font-size:3.9mm;color:#4b5866">Para cada uno hay una demo funcionando en axchisan.com.</p>
        <div style="margin-top:6mm;display:grid;grid-template-columns:1fr 1fr;gap:3.4mm 6mm">
          ${SOLUCIONES.map((s) => `<div style="border-top:.3mm solid #d5dde5;padding-top:2.2mm"><p style="font-size:3.7mm;font-weight:600">${SECTORES[s.slug].corto}</p><p style="margin-top:.6mm;font-size:2.9mm;line-height:1.35;color:#4b5866">${SECTORES[s.slug].apoyo}</p></div>`).join("")}
        </div>
        <div style="margin-top:auto;border-top:.3mm solid #d5dde5;padding-top:5mm">
          <p style="font-size:5mm;font-weight:600;letter-spacing:-.01em">Averigua cuánto cuesta la tuya en <span style="color:#0b7c7c">axchisan.com</span></p>
          <p style="margin-top:1.5mm;font-size:3.8mm;color:#4b5866">WhatsApp ${WHATSAPP.visible}</p>
        </div></div>`,
    },
  ]
  for (const s of SOLUCIONES) {
    const x = SECTORES[s.slug]
    lista.push(
      await volanteCara(
        `volante-${s.slug}`,
        x.frase,
        x.apoyo,
        `Así se vería la página de ${x.tu}. Es una demo real: tócala desde tu celular.`,
        ["Pruébala antes de contratar", "Todo queda a tu nombre", "Te atendemos por WhatsApp"],
        `${s.slug}-computador.png`,
        `${s.slug}-celular.png`,
        enlace("volante", s.slug, `/soluciones/${s.slug}`),
      ),
    )
  }
  return lista
}

async function main() {
  mkdirSync(DESTINO, { recursive: true })
  const filtro = process.argv[2] ?? ""
  const piezas = [...(await tarjetas()), ...(await volantes())].filter((p) => p.archivo.includes(filtro))
  const navegador = await chromium.launch()
  for (const p of piezas) {
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
