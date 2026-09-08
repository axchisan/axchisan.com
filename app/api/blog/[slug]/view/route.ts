import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashIp, ipDePeticion } from "@/lib/analytics"

// Registra una visita a un post e incrementa el contador.
// Endpoint dedicado (POST) para no mutar en el GET y no contar vistas del admin.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: (await params).slug }, select: { id: true } })
    if (!post) return NextResponse.json({ ok: false }, { status: 404 })

    const userAgent = request.headers.get("user-agent")
    const hashedIp = hashIp(ipDePeticion(request.headers))

    await prisma.blogView
      .create({ data: { blogPostId: post.id, userAgent: userAgent?.slice(0, 255), ip: hashedIp } })
      .catch(() => {})

    const updated = await prisma.blogPost
      .update({ where: { id: post.id }, data: { views: { increment: 1 } }, select: { views: true } })
      .catch(() => null)

    return NextResponse.json({ ok: true, views: updated?.views ?? null })
  } catch (error) {
    console.error("Blog view error:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
