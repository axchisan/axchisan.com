import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: params.slug,
        published: true,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Blog post fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}
