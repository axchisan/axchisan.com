import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { action, response } = data

    let updateData: any = {}

    switch (action) {
      case "mark_read":
        updateData = { read: true }
        break
      case "mark_unread":
        updateData = { read: false }
        break
      case "mark_replied":
        updateData = { replied: true, respondedAt: new Date(), response: response || null }
        break
      case "update_status":
        updateData = { status: data.status }
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const message = await prisma.contactMessage.update({
      where: { id: params.id },
      data: updateData,
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
