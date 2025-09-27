import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current date for comparisons
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Get projects stats
    const totalProjects = await prisma.project.count()
    const projectsThisMonth = await prisma.project.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    })

    // Get blog posts stats
    const totalBlogPosts = await prisma.blogPost.count({
      where: { published: true },
    })
    const blogPostsThisWeek = await prisma.blogPost.count({
      where: {
        published: true,
        createdAt: {
          gte: startOfWeek,
        },
      },
    })

    // Get messages stats
    const totalMessages = await prisma.contactMessage.count()
    const unreadMessages = await prisma.contactMessage.count({
      where: { read: false },
    })

    // Get comments stats
    const totalComments = await prisma.comment.count()
    const commentsToday = await prisma.comment.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    })

    // Get recent projects with stats
    const recentProjects = await prisma.project.findMany({
      take: 3,
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    // Get recent messages
    const recentMessages = await prisma.contactMessage.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        createdAt: true,
        read: true,
      },
    })

    const stats = [
      {
        title: "Proyectos",
        value: totalProjects.toString(),
        change: `+${projectsThisMonth} este mes`,
        icon: "FolderOpen",
        color: "text-blue-500",
      },
      {
        title: "Artículos",
        value: totalBlogPosts.toString(),
        change: `+${blogPostsThisWeek} esta semana`,
        icon: "BookOpen",
        color: "text-green-500",
      },
      {
        title: "Mensajes",
        value: totalMessages.toString(),
        change: `${unreadMessages} sin leer`,
        icon: "Mail",
        color: "text-purple-500",
      },
      {
        title: "Comentarios",
        value: totalComments.toString(),
        change: `+${commentsToday} hoy`,
        icon: "MessageSquare",
        color: "text-orange-500",
      },
    ]

    return NextResponse.json({
      stats,
      recentProjects: recentProjects.map((project) => ({
        id: project.id,
        title: project.title,
        status: project.status,
        likes: project._count.likes,
        views: 0, // You might want to add a views field to the Project model
        updatedAt: project.updatedAt.toISOString(),
      })),
      recentMessages,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Error fetching admin stats" }, { status: 500 })
  }
}
