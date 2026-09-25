/**
 * Sube a R2 los fotogramas de una página cinematográfica.
 *
 *   npx tsx scripts/subir-cinematico.ts <carpeta-origen> <slug>
 *   npx tsx scripts/subir-cinematico.ts ~/Documents/Dev/PaginasScroll/hotel-orilla orilla
 *
 * La carpeta de origen sigue la estructura de las pruebas de PaginasScroll:
 *   frames/actoN/0001.webp …   escritorio
 *   frames-m/actoN/0001.webp … celular
 *   frames/actoN/poster.jpg    póster de cada acto (sin movimiento)
 *   img/*.webp                 fotos fijas de la galería
 *
 * Los fotogramas se suben tal cual: ya vienen comprimidos, y recomprimirlos
 * ahorraba entre 1 y 2 % a cambio de una segunda pérdida de calidad (medido
 * con la demo de Orilla). Los pósters pasan de JPG a WebP. Todo se sirve desde
 * R2 (sin cobro de salida) con caché de un año: un fotograma publicado nunca
 * cambia; si cambia el video, cambia el slug.
 */
import { config } from "dotenv"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { AwsClient } from "aws4fetch"
import sharp from "sharp"

config({ path: ".env.local" })

const [origen, slug] = process.argv.slice(2)
if (!origen || !slug) {
  console.error("Uso: npx tsx scripts/subir-cinematico.ts <carpeta-origen> <slug>")
  process.exit(1)
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET = "axchisan-media" } = process.env
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) throw new Error("Faltan las credenciales de R2 en .env.local")

const r2 = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" })
const PREFIJO = `demos/${slug}`

type Tarea = { origen: string; destino: string; calidad?: number }

async function subir(t: Tarea) {
  const entrada = readFileSync(t.origen)
  const cuerpo = t.calidad ? await sharp(entrada).webp({ quality: t.calidad, effort: 5 }).toBuffer() : entrada
  const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${PREFIJO}/${t.destino}`
  for (let intento = 1; intento <= 3; intento++) {
    const res = await r2.fetch(url, {
      method: "PUT",
      body: new Uint8Array(cuerpo),
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    })
    if (res.ok) return cuerpo.length
    if (intento === 3) throw new Error(`${t.destino}: HTTP ${res.status}`)
  }
  return 0
}

const tareas: Tarea[] = []
for (const carpeta of ["frames", "frames-m"]) {
  const base = join(origen, carpeta)
  for (const acto of readdirSync(base).filter((d) => statSync(join(base, d)).isDirectory())) {
    for (const archivo of readdirSync(join(base, acto))) {
      if (archivo.endsWith(".webp")) {
        tareas.push({ origen: join(base, acto, archivo), destino: `${carpeta}/${acto}/${archivo}` })
      } else if (archivo === "poster.jpg") {
        tareas.push({ origen: join(base, acto, archivo), destino: `${carpeta}/${acto}/poster.webp`, calidad: 78 })
      }
    }
  }
}
const img = join(origen, "img")
for (const archivo of readdirSync(img).filter((a) => a.endsWith(".webp"))) {
  tareas.push({ origen: join(img, archivo), destino: `img/${archivo}` })
}

async function main() {
  let hechas = 0
  let bytesOrigen = 0
  let bytesSubidos = 0
  const cola = [...tareas]
  const trabajador = async () => {
    for (let t = cola.shift(); t; t = cola.shift()) {
      bytesOrigen += statSync(t.origen).size
      // Se espera antes de sumar: `total += await …` lee el total antes de la
      // espera y pierde las sumas de los otros trabajadores.
      const subidos = await subir(t)
      bytesSubidos += subidos
      if (++hechas % 100 === 0) console.log(`${hechas} de ${tareas.length}`)
    }
  }
  await Promise.all(Array.from({ length: 8 }, trabajador))
  const mb = (b: number) => (b / 1_048_576).toFixed(1)
  console.log(`Listo: ${hechas} archivos en ${PREFIJO}/. ${mb(bytesOrigen)} MB de origen, ${mb(bytesSubidos)} MB subidos.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
