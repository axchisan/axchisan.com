import { prisma } from "@/lib/prisma"
import { ProspectosCRM, type Prospecto } from "@/components/admin/prospectos/crm"

export const dynamic = "force-dynamic"

export const metadata = { title: "Prospectos" }

/** La base desde donde se mide la distancia, "lat,lng". Opcional y fuera del repositorio. */
function base() {
  const [lat, lng] = (process.env.BASE_PROSPECCION ?? "").split(",").map(Number)
  return Number.isFinite(lat) && Number.isFinite(lng) && lat && lng ? { lat, lng } : null
}

export default async function ProspectosPagina() {
  const filas = await prisma.prospecto
    .findMany({ include: { eventos: { orderBy: { createdAt: "desc" }, take: 30 } }, orderBy: [{ prioridad: "asc" }, { puntaje: "desc" }] })
    .catch(() => [])
  const prospectos: Prospecto[] = filas.map((p) => ({
    ...p,
    proximo: p.proximo?.toISOString() ?? null,
    eventos: p.eventos.map((e) => ({ id: e.id, tipo: e.tipo, texto: e.texto, createdAt: e.createdAt.toISOString() })),
  }))

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">Prospectos</h1>
      <p className="mt-1 text-sm text-mid">Negocios que pueden ser clientes. Escríbeles desde aquí y anota cada contacto.</p>
      <div className="mt-6">
        <ProspectosCRM inicial={prospectos} base={base()} />
      </div>
    </div>
  )
}
