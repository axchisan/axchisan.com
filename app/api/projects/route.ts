import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "COMPLETED" },
      include: {
        files: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            favorites: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Projects fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const projectWithFiles = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          title: data.title,
          description: data.description,
          shortDesc: data.shortDesc,
          content: data.content,
          images: data.images || [],
          videos: data.videos || [],
          technologies: data.technologies || [],
          githubUrl: data.githubUrl,
          liveUrl: data.liveUrl,
          downloadUrl: data.downloadUrl,
          category: data.category,
          status: data.status || "COMPLETED",
          featured: data.featured || false,
          order: data.order || 0,
        },
      })

      if (data.files && data.files.length > 0) {
        const createdFiles = await Promise.all(
          data.files.map((file: any, index: number) =>
            tx.projectFile.create({
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
                order: file.order || index,
                projectId: project.id,
              },
            }),
          ),
        )

        return {
          ...project,
          files: createdFiles,
        }
      }

      return {
        ...project,
        files: [],
      }
    })

    return NextResponse.json(projectWithFiles)
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
