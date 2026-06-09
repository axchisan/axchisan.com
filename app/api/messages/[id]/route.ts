import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const message = await prisma.contactMessage.findUnique({
      where: { id: params.id },
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Message fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { status, adminNotes } = data

    const message = await prisma.contactMessage.update({
      where: { id: params.id },
      data: {
        status: status ? (status as any) : undefined,
        // 'adminNotes' no existe en el schema; se mapea al campo 'response'
        ...(adminNotes !== undefined ? { response: adminNotes } : {}),
        respondedAt: status === "RESOLVED" && !data.respondedAt ? new Date() : undefined,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Message update error:", error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.contactMessage.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Message deleted successfully" })
  } catch (error) {
    console.error("Message deletion error:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
