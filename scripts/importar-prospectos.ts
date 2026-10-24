/**
 * Carga en la base los prospectos extraídos de Google Maps.
 *
 *   npx tsx scripts/importar-prospectos.ts                    a producción (.env.local)
 *   ENV_FILE=.env.test npx tsx scripts/importar-prospectos.ts  a la rama de pruebas
 *
 * Lee ~/Documents/Axchi/prospectos/crudo/*.txt, fuera del repositorio porque
 * tienen teléfonos de otros negocios. Cada archivo empieza con la búsqueda
 * ("# restaurantes en Claret, Bogotá") y sigue con una fila por negocio:
 *
 *   nombre|categoría|calificación|reseñas|teléfono|web|dirección[|lat|lng|placeId]
 *
 * Volver a importar no duplica ni pisa lo que se trabajó en el panel: el
 * estado, las notas y el historial se conservan; solo se actualizan los datos
 * del negocio (teléfono, web, reseñas) y la prioridad.
 */
import { config } from "dotenv"
import { readdirSync, readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { distanciaKm, esCadena, estadoWeb, fortalezas, limpiarTelefono, puntuar, sectorDe } from "../lib/prospectos"

config({ path: process.env.ENV_FILE ?? ".env.local" })
const CRUDO = process.argv[2] ?? join(homedir(), "Documents/Axchi/prospectos/crudo")
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL }) })

const [bLat, bLng] = (process.env.BASE_PROSPECCION ?? "").split(",").map(Number)
const base = Number.isFinite(bLat) && bLat ? { lat: bLat, lng: bLng } : null

/** "restaurantes en Claret, Bogotá" → Bogotá / Claret; "hoteles en Barbosa Santander" → Barbosa. */
function lugar(consulta: string) {
  const donde = consulta.split(/\ben\b/).slice(1).join("en").trim()
  if (/bogot/i.test(donde)) {
    const zona = donde.replace(/,?\s*Bogot[aá].*$/i, "").trim()
    return { ciudad: "Bogotá", zona: zona || null }
  }
  return { ciudad: donde.replace(/\s+(Santander|Boyac[aá]|Cundinamarca)$/i, "").trim(), zona: null }
}

async function main() {
  let nuevos = 0
  let actualizados = 0
  let omitidos = 0
  for (const archivo of readdirSync(CRUDO).filter((a) => a.endsWith(".txt")).sort()) {
    const lineas = readFileSync(join(CRUDO, archivo), "utf8").split("\n").map((l) => l.trim()).filter(Boolean)
    const consulta = lineas[0].replace(/^#\s*/, "")
    const { ciudad, zona } = lugar(consulta)
    for (const linea of lineas.slice(1)) {
      const [nombre, categoria, cal, resenas, tel, web, direccion, lat, lng, placeId] = linea.split("|").map((x) => x?.trim() ?? "")
      if (!nombre || esCadena(nombre)) {
        omitidos++
        continue
      }
      const sector = sectorDe(consulta, categoria)
      const telefono = limpiarTelefono(tel)
      const url = web ? (web.startsWith("http") ? web : `https://${web}`) : null
      const ew = estadoWeb(url)
      const calificacion = cal ? Number(cal.replace(",", ".")) : null
      const nResenas = Number(resenas) || 0
      const { puntaje, prioridad } = puntuar({ estadoWeb: ew, resenas: nResenas, calificacion, telefono })
      const la = lat ? Number(lat) : null
      const ln = lng ? Number(lng) : null
      const datos = {
        nombre,
        categoria: categoria || null,
        ficha: sector?.ficha ?? null,
        ciudad,
        zona,
        direccion: direccion || null,
        telefono,
        web: url,
        estadoWeb: ew,
        calificacion,
        resenas: nResenas,
        lat: la,
        lng: ln,
        distanciaKm: base && la && ln ? Math.round(distanciaKm(base, { lat: la, lng: ln }) * 10) / 10 : null,
        mapsUrl: placeId
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nombre)}&query_place_id=${placeId}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nombre} ${zona ?? ""} ${ciudad}`)}`,
        puntaje,
        fortalezas: fortalezas({ estadoWeb: ew, resenas: nResenas, calificacion }) || null,
        falta: sector?.falta ?? null,
        plan: sector?.plan ?? null,
        fuente: `maps:${consulta}`,
      }
      const existente = placeId
        ? await prisma.prospecto.findUnique({ where: { placeId } })
        : await prisma.prospecto.findFirst({ where: { nombre, ciudad } })
      if (existente) {
        // La prioridad que se haya cambiado a mano en el panel se respeta.
        await prisma.prospecto.update({ where: { id: existente.id }, data: { ...datos, prioridad: existente.prioridad } })
        actualizados++
      } else {
        await prisma.prospecto.create({ data: { ...datos, prioridad, placeId: placeId || null } })
        nuevos++
      }
    }
  }
  const total = await prisma.prospecto.count()
  console.log(`${nuevos} nuevos, ${actualizados} actualizados, ${omitidos} omitidos (cadenas o sin nombre). ${total} prospectos en la base.`)
  await prisma.$disconnect()
}

main()
