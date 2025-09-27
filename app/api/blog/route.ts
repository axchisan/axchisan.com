import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const published = searchParams.get("published") !== "false"

    const where: any = {
      published: published,
    }

    if (category) {
      where.tags = {
        has: category,
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    // Get unique categories from all published posts
    const allPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { tags: true },
    })

    const categories = Array.from(new Set(allPosts.flatMap((post) => post.tags))).sort()

    return NextResponse.json({
      posts,
      categories,
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Error fetching blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, tags, published = false, featured = false, readTime } = body

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags: tags || [],
        published,
        featured,
        readTime,
        publishedAt: published ? new Date() : null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Error creating blog post" }, { status: 500 })
  }
}
