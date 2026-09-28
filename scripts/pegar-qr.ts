/**
 * Pega el QR que le corresponde a cada pieza generada con Gemini.
 *
 *   npx tsx scripts/pegar-qr.ts            todas las de docs/publicidad/generadas/
 *   npx tsx scripts/pegar-qr.ts V03 T05    solo esas
 *
 * Las piezas se guardan con su código (V03.png, T05.jpg…). El prompt pide un
 * cuadrado blanco puro con borde fino; aquí se busca el área blanca más grande
 * que sea casi cuadrada y no toque el borde de la imagen, y se pega encima el
 * QR de docs/publicidad/qr/ según docs/publicidad/piezas.json. El resultado
 * queda en docs/publicidad/listas/, sin tocar la original.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs"
import sharp from "sharp"

const DOCS = "docs/publicidad"
const piezas: Record<string, string> = JSON.parse(readFileSync(`${DOCS}/piezas.json`, "utf8"))

type Caja = { x: number; y: number; w: number; h: number }

/** El cuadro blanco vacío: componente blanco casi cuadrado, lleno, que no toca los bordes. */
async function buscarCuadro(archivo: string): Promise<Caja | null> {
  const meta = await sharp(archivo).metadata()
  const escala = Math.min(1, 900 / Math.max(meta.width!, meta.height!))
  const W = Math.round(meta.width! * escala)
  const H = Math.round(meta.height! * escala)
  const { data } = await sharp(archivo).resize(W, H).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const blanco = new Uint8Array(W * H)
  for (let i = 0; i < W * H; i++) blanco[i] = data[i * 3] >= 246 && data[i * 3 + 1] >= 246 && data[i * 3 + 2] >= 246 ? 1 : 0

  const etiqueta = new Int32Array(W * H)
  let mejor: (Caja & { area: number }) | null = null
  const pila: number[] = []
  let actual = 0
  for (let inicio = 0; inicio < W * H; inicio++) {
    if (!blanco[inicio] || etiqueta[inicio]) continue
    actual++
    let area = 0, x0 = W, y0 = H, x1 = 0, y1 = 0
    pila.push(inicio)
    etiqueta[inicio] = actual
    while (pila.length) {
      const p = pila.pop()!
      const x = p % W, y = (p - x) / W
      area++
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
      for (const q of [p - 1, p + 1, p - W, p + W]) {
        if (q < 0 || q >= W * H || etiqueta[q] || !blanco[q]) continue
        if ((q === p - 1 && x === 0) || (q === p + 1 && x === W - 1)) continue
        etiqueta[q] = actual
        pila.push(q)
      }
    }
    const w = x1 - x0 + 1, h = y1 - y0 + 1
    const tocaBorde = x0 === 0 || y0 === 0 || x1 === W - 1 || y1 === H - 1
    const proporcion = w / h
    const lleno = area / (w * h)
    const minimo = Math.min(W, H) * 0.12
    if (tocaBorde || proporcion < 0.8 || proporcion > 1.25 || lleno < 0.85 || w < minimo || area > W * H * 0.4) continue
    if (!mejor || area > mejor.area) mejor = { x: x0, y: y0, w, h, area }
  }
  if (!mejor) return null
  const k = 1 / escala
  return { x: Math.round(mejor.x * k), y: Math.round(mejor.y * k), w: Math.round(mejor.w * k), h: Math.round(mejor.h * k) }
}

async function main() {
  const origen = `${DOCS}/generadas`
  const destino = `${DOCS}/listas`
  mkdirSync(destino, { recursive: true })
  if (!existsSync(origen)) throw new Error(`No existe ${origen}: guarda ahí las imágenes descargadas.`)
  const pedidas = process.argv.slice(2).map((x) => x.toUpperCase())
  const archivos = readdirSync(origen).filter((a) => /\.(png|jpe?g|webp)$/i.test(a))
  let hechas = 0
  for (const a of archivos) {
    const id = a.match(/^([A-Z]\d{2})/i)?.[1].toUpperCase()
    if (!id || !piezas[id] || (pedidas.length && !pedidas.includes(id))) continue
    const cuadro = await buscarCuadro(`${origen}/${a}`)
    if (!cuadro) {
      console.log(`${id}: no encontré el cuadro blanco. Pídele a Gemini que lo deje blanco puro y vacío, o pégalo a mano.`)
      continue
    }
    // Un poco de aire dentro del cuadro para que el borde se siga viendo.
    const lado = Math.round(Math.min(cuadro.w, cuadro.h) * 0.9)
    const qr = await sharp(`${DOCS}/qr/${piezas[id]}.png`).resize(lado, lado, { kernel: "nearest" }).toBuffer()
    const salida = `${destino}/${id}.png`
    await sharp(`${origen}/${a}`)
      .composite([{ input: qr, left: cuadro.x + Math.round((cuadro.w - lado) / 2), top: cuadro.y + Math.round((cuadro.h - lado) / 2) }])
      .png()
      .toFile(salida)
    console.log(`${id}: QR ${piezas[id]} en ${cuadro.w}×${cuadro.h} px (x ${cuadro.x}, y ${cuadro.y}) → ${salida}`)
    hechas++
  }
  console.log(`${hechas} piezas con QR.`)
}

main()
