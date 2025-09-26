import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(skills)
  } catch (error) {
    console.error("Skills fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        level: data.level,
        icon: data.icon,
        color: data.color,
        order: data.order || 0,
      },
    })

    return NextResponse.json(skill)
  } catch (error) {
    console.error("Skill creation error:", error)
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}
