import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Count messages that have been replied to but user hasn't seen yet
    // We consider a message "unread" if it has a response and the user hasn't checked it recently
    const count = await prisma.contactMessage.count({
      where: {
        userId: session.user.id,
        replied: true,
        // You could add additional logic here to track if user has seen the response
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return NextResponse.json({ error: "Failed to fetch unread count" }, { status: 500 })
  }
}
