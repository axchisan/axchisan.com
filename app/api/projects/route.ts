import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "COMPLETED" },
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

    const project = await prisma.project.create({
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

    return NextResponse.json(project)
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
