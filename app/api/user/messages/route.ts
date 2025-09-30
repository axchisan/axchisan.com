import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  console.log("[v0] User messages API called")
  try {
    const session = await getServerSession(authOptions)
    console.log("[v0] Session:", session ? `User ${session.user.id}` : "No session")

    if (!session) {
      console.log("[v0] Unauthorized - no session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Fetching messages for user:", session.user.id)
    const messages = await prisma.contactMessage.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log("[v0] Found messages:", messages.length)
    return NextResponse.json(messages)
  } catch (error) {
    console.error("[v0] Error fetching user messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
