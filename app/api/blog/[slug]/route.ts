import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: params.slug,
        published: true,
      },
      include: {
        files: {
          orderBy: { order: "asc" },
        },
        comments: {
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
        likes: {
          include: { user: { select: { name: true, email: true } } },
        },
        favorites: {
          include: { user: { select: { name: true, email: true } } },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            favorites: true,
            blogViews: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const userAgent = request.headers.get("user-agent")
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")

    const hashedIp = ip ? Buffer.from(ip).toString("base64").slice(0, 10) : null

    await prisma.blogView
      .create({
        data: {
          blogPostId: post.id,
          userAgent: userAgent?.slice(0, 255),
          ip: hashedIp,
        },
      })
      .catch(() => {
        // Ignore errors for analytics
      })

    await prisma.blogPost
      .update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {
        // Ignore errors for view counter
      })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Blog post fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        tags: data.tags || [],
        published: data.published,
        featured: data.featured,
        readTime: data.readTime,
        publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt,
      },
    })

    if (data.files) {
      const existingFiles = await prisma.blogFile.findMany({
        where: { blogPostId: post.id },
      })

      const newFileIds = data.files.filter((f: any) => f.id).map((f: any) => f.id)
      const filesToDelete = existingFiles.filter((f) => !newFileIds.includes(f.id))

      if (filesToDelete.length > 0) {
        await prisma.blogFile.deleteMany({
          where: {
            id: { in: filesToDelete.map((f) => f.id) },
          },
        })
      }

      for (const file of data.files) {
        if (file.id && file.id.startsWith("temp-")) {
          await prisma.blogFile.create({
            data: {
              filename: file.filename,
              originalName: file.originalName,
              displayName: file.displayName || file.originalName,
              description: file.description,
              url: file.url,
              size: file.size,
              type: file.type,
              category: file.category || "OTHER",
              isDownloadable: file.isDownloadable ?? true,
              order: file.order || 0,
              blogPostId: post.id,
            },
          })
        } else if (file.id) {
          await prisma.blogFile.update({
            where: { id: file.id },
            data: {
              displayName: file.displayName,
              description: file.description,
              isDownloadable: file.isDownloadable,
              order: file.order,
            },
          })
        }
      }
    }

    const updatedPost = await prisma.blogPost.findUnique({
      where: { id: post.id },
      include: {
        files: {
          orderBy: { order: "asc" },
        },
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Blog post update error:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.blogPost.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Blog post deletion error:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
