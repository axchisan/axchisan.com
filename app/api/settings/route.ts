import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { revalidateTag } from "next/cache"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const EDITABLE_KEYS = ["years_experience", "clients_count"] as const

// Lee los ajustes editables (métricas no derivables). Solo admin.
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rows = await prisma.siteSettings.findMany({ where: { key: { in: [...EDITABLE_KEYS] } } })
    const settings: Record<string, string> = {}
    for (const r of rows) settings[r.key] = r.value
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// Guarda ajustes editables (upsert por clave). Solo admin.
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    await Promise.all(
      EDITABLE_KEYS.filter((key) => data[key] !== undefined).map((key) =>
        prisma.siteSettings.upsert({
          where: { key },
          update: { value: String(data[key]) },
          create: { key, value: String(data[key]), type: "NUMBER" },
        }),
      ),
    )

    revalidateTag("settings")
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Settings PUT error:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
