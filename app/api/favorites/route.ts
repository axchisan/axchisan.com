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

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        projectId: projectId || null,
        blogPostId: blogPostId || null,
      },
    })

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      })

      return NextResponse.json({ favorited: false, message: "Removed from favorites" })
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          projectId: projectId || null,
          blogPostId: blogPostId || null,
        },
      })

      return NextResponse.json({ favorited: true, message: "Added to favorites" })
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 })
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
    const getUserFavorites = searchParams.get("user") === "true"

    if (getUserFavorites) {
      // Get user's favorites
      const favorites = await prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              shortDesc: true,
              images: true,
              category: true,
              createdAt: true,
            },
          },
          blogPost: {
            select: {
              id: true,
              title: true,
              excerpt: true,
              coverImage: true,
              tags: true,
              createdAt: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json({ favorites })
    }

    if (!projectId && !blogPostId) {
      return NextResponse.json({ error: "Either projectId or blogPostId is required" }, { status: 400 })
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        projectId: projectId || null,
        blogPostId: blogPostId || null,
      },
    })

    return NextResponse.json({ favorited: !!favorite })
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return NextResponse.json({ error: "Failed to check favorite status" }, { status: 500 })
  }
}
