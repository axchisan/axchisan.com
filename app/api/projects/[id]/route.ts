import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
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
            likes: true,
            comments: true,
            favorites: true,
            projectViews: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const userAgent = request.headers.get("user-agent")
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")

    const hashedIp = ip ? Buffer.from(ip).toString("base64").slice(0, 10) : null

    await prisma.projectView
      .create({
        data: {
          projectId: params.id,
          userAgent: userAgent?.slice(0, 255),
          ip: hashedIp,
        },
      })
      .catch(() => {
        // Ignore errors for analytics
      })

    await prisma.project
      .update({
        where: { id: params.id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {
        // Ignore errors for view counter
      })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Project fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        shortDesc: data.shortDesc,
        content: data.content,
        coverImage: data.coverImage,
        images: data.images || [],
        videos: data.videos || [],
        technologies: data.technologies || [],
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        downloadUrl: data.downloadUrl,
        category: data.category,
        status: data.status,
        featured: data.featured,
        order: data.order,
      },
    })

    if (data.files) {
      const existingFiles = await prisma.projectFile.findMany({
        where: { projectId: params.id },
      })

      const newFileIds = data.files.filter((f: any) => f.id).map((f: any) => f.id)
      const filesToDelete = existingFiles.filter((f) => !newFileIds.includes(f.id))

      if (filesToDelete.length > 0) {
        await prisma.projectFile.deleteMany({
          where: {
            id: { in: filesToDelete.map((f) => f.id) },
          },
        })
      }

      for (const file of data.files) {
        if (file.id && file.id.startsWith("temp-")) {
          await prisma.projectFile.create({
            data: {
              filename: file.filename,
              originalName: file.originalName,
              displayName: file.displayName || file.originalName,
              description: file.description,
              url: file.url,
              size: file.size,
              type: file.type,
              category: file.category || "OTHER",
              platform: file.platform,
              version: file.version,
              isDownloadable: file.isDownloadable ?? true,
              order: file.order || 0,
              projectId: params.id,
            },
          })
        } else if (file.id) {
          await prisma.projectFile.update({
            where: { id: file.id },
            data: {
              displayName: file.displayName,
              description: file.description,
              platform: file.platform,
              version: file.version,
              isDownloadable: file.isDownloadable,
              order: file.order,
            },
          })
        }
      }
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        files: {
          orderBy: { order: "asc" },
        },
      },
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Project update error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Project deletion error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
