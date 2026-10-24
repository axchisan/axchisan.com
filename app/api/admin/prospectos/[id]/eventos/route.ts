import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/** Una entrada en el historial del prospecto: lo que se habló, por dónde. */
const schema = z.object({
  tipo: z.enum(["nota", "whatsapp", "llamada", "visita"]),
  texto: z.string().trim().min(1).max(2000),
})

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  const { id } = await params
  const evento = await prisma.prospectoEvento.create({ data: { prospectoId: id, ...parsed.data } })
  return NextResponse.json(evento)
}
