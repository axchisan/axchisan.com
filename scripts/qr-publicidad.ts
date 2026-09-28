/**
 * Genera los QR de la publicidad impresa en docs/publicidad/qr/.
 *
 *   npx tsx scripts/qr-publicidad.ts
 *
 * Gemini no dibuja QR que se puedan escanear: la imagen se genera con un
 * cuadro vacío y el QR real se pega encima. Cada QR lleva utm_source (la
 * pieza) y utm_campaign (el sector), y el panel /admin cuenta las visitas que
 * trae cada uno en "Visitas por publicidad".
 */
import { mkdirSync, writeFileSync } from "node:fs"
import QRCode from "qrcode"
import { SOLUCIONES } from "../lib/catalogo/soluciones"

const DESTINO = "docs/publicidad/qr"
const PIEZAS = ["tarjeta", "volante"] as const
const opciones = { errorCorrectionLevel: "M" as const, margin: 2, color: { dark: "#0b0f14", light: "#ffffff" } }

async function main() {
  mkdirSync(DESTINO, { recursive: true })
  const destinos = [{ nombre: "general", ruta: "/" }, ...SOLUCIONES.map((s) => ({ nombre: s.slug, ruta: `/soluciones/${s.slug}` }))]
  const indice: string[] = ["| Archivo | Abre |", "|---|---|"]
  for (const pieza of PIEZAS) {
    for (const d of destinos) {
      const url = `https://axchisan.com${d.ruta}?utm_source=${pieza}&utm_campaign=${d.nombre}`
      const base = `${DESTINO}/${pieza}-${d.nombre}`
      await QRCode.toFile(`${base}.png`, url, { ...opciones, width: 1200 })
      writeFileSync(`${base}.svg`, await QRCode.toString(url, { ...opciones, type: "svg" }))
      indice.push(`| \`${pieza}-${d.nombre}.png\` | ${url} |`)
    }
  }
  writeFileSync(`${DESTINO}/README.md`, `# Códigos QR de la publicidad\n\nGenerados con \`npx tsx scripts/qr-publicidad.ts\`. PNG de 1200 px para imprimir hasta 10 cm de lado; SVG para cualquier tamaño.\n\n${indice.join("\n")}\n`)
  console.log(`${destinos.length * PIEZAS.length} QR en ${DESTINO}`)
}

main()
