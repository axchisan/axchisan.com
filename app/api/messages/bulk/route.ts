import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { messageIds, action } = data

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: "Message IDs are required" }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case "mark_read":
        updateData = { status: "READ", readAt: new Date() }
        break
      case "mark_unread":
        updateData = { status: "UNREAD", readAt: null }
        break
      case "mark_responded":
        updateData = { status: "RESPONDED", respondedAt: new Date() }
        break
      case "archive":
        updateData = { status: "ARCHIVED" }
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const result = await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
      },
      data: updateData,
    })

    return NextResponse.json({
      message: `${result.count} messages updated successfully`,
      count: result.count,
    })
  } catch (error) {
    console.error("Bulk message update error:", error)
    return NextResponse.json({ error: "Failed to update messages" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { messageIds } = data

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: "Message IDs are required" }, { status: 400 })
    }

    const result = await prisma.message.deleteMany({
      where: {
        id: { in: messageIds },
      },
    })

    return NextResponse.json({
      message: `${result.count} messages deleted successfully`,
      count: result.count,
    })
  } catch (error) {
    console.error("Bulk message deletion error:", error)
    return NextResponse.json({ error: "Failed to delete messages" }, { status: 500 })
  }
}
