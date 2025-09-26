import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { createdAt: "desc" },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst()

    let profile
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          name: data.name,
          title: data.title,
          bio: data.bio,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          instagram: data.instagram,
          github: data.github,
          linkedin: data.linkedin,
          avatar: data.avatar,
          resumeUrl: data.resumeUrl,
        },
      })
    } else {
      profile = await prisma.profile.create({
        data: {
          name: data.name,
          title: data.title,
          bio: data.bio,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          instagram: data.instagram,
          github: data.github,
          linkedin: data.linkedin,
          avatar: data.avatar,
          resumeUrl: data.resumeUrl,
        },
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
