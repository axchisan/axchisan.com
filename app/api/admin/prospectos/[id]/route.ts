import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ESTADOS, nombreEstado } from "@/lib/prospectos"

/**
 * Cambios desde /admin/prospectos: estado, próximo contacto, notas y
 * prioridad. No llama a invalidate(): los prospectos no salen en el sitio
 * público ni pasan por la caché.
 */
const schema = z.object({
  estado: z.enum(ESTADOS.map((e) => e.id) as [string, ...string[]]).optional(),
  proximo: z.string().nullable().optional(),
  notas: z.string().max(5000).optional(),
  prioridad: z.enum(["A", "B", "C"]).optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  const { id } = await params
  const d = parsed.data
  const antes = await prisma.prospecto.findUnique({ where: { id }, select: { estado: true } })
  if (!antes) return NextResponse.json({ error: "No existe" }, { status: 404 })
  const prospecto = await prisma.prospecto.update({
    where: { id },
    data: {
      estado: d.estado,
      notas: d.notas,
      prioridad: d.prioridad,
      proximo: d.proximo === undefined ? undefined : d.proximo ? new Date(`${d.proximo}T12:00:00`) : null,
      // El cambio de estado queda en el historial.
      eventos: d.estado && d.estado !== antes.estado ? { create: { tipo: "estado", texto: `${nombreEstado(antes.estado)} → ${nombreEstado(d.estado)}` } } : undefined,
    },
    include: { eventos: { orderBy: { createdAt: "desc" } } },
  })
  return NextResponse.json(prospecto)
}
