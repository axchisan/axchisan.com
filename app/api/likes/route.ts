import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const data = await request.json()
    const { projectId, blogPostId } = data

    if (!projectId && !blogPostId) {
      return NextResponse.json({ error: "Either projectId or blogPostId is required" }, { status: 400 })
    }

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        projectId: projectId || null,
        blogPostId: blogPostId || null,
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })

      return NextResponse.json({ liked: false, message: "Like removed" })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          projectId: projectId || null,
          blogPostId: blogPostId || null,
        },
      })

      return NextResponse.json({ liked: true, message: "Like added" })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const blogPostId = searchParams.get("blogPostId")

    if (!projectId && !blogPostId) {
      return NextResponse.json({ error: "Either projectId or blogPostId is required" }, { status: 400 })
    }

    const like = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        projectId: projectId || null,
        blogPostId: blogPostId || null,
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 })
  }
}
