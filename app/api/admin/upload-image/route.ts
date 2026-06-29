import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/avif"]
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/avif": "avif",
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de imagen no permitido" }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Máximo 10MB" }, { status: 400 })
    }

    const dir = join(process.cwd(), "public", "uploads", "images")
    await mkdir(dir, { recursive: true })
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}.${EXT[file.type]}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(join(dir, name), buffer)

    return NextResponse.json({ url: `/api/files/images/${name}` })
  } catch (error) {
    console.error("upload-image error:", error)
    return NextResponse.json({ error: "Error al subir" }, { status: 500 })
  }
}
