import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashIp, ipDePeticion } from "@/lib/analytics"

// Registra una visita a un proyecto e incrementa el contador.
// Endpoint dedicado (POST) para no mutar en el GET y no contar vistas del admin.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userAgent = request.headers.get("user-agent")
    const hashedIp = hashIp(ipDePeticion(request.headers))

    await prisma.projectView
      .create({ data: { projectId: (await params).id, userAgent: userAgent?.slice(0, 255), ip: hashedIp } })
      .catch(() => {})

    const updated = await prisma.project
      .update({ where: { id: (await params).id }, data: { views: { increment: 1 } }, select: { views: true } })
      .catch(() => null)

    return NextResponse.json({ ok: true, views: updated?.views ?? null })
  } catch (error) {
    console.error("Project view error:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
