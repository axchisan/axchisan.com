import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join, extname } from "path"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

// Mapea extensión → carpeta + categoría (para descargables: APK, ZIP, etc.)
function classify(name: string): { folder: string; category: string } {
  const ext = extname(name).toLowerCase().replace(".", "")
  const map: Record<string, { folder: string; category: string }> = {
    apk: { folder: "mobile-apps", category: "MOBILE_APP" },
    aab: { folder: "mobile-apps", category: "MOBILE_APP" },
    ipa: { folder: "mobile-apps", category: "MOBILE_APP" },
    zip: { folder: "archives", category: "ARCHIVE" },
    rar: { folder: "archives", category: "ARCHIVE" },
    "7z": { folder: "archives", category: "ARCHIVE" },
    tar: { folder: "archives", category: "ARCHIVE" },
    gz: { folder: "archives", category: "ARCHIVE" },
    exe: { folder: "executables", category: "EXECUTABLE" },
    msi: { folder: "executables", category: "EXECUTABLE" },
    dmg: { folder: "executables", category: "EXECUTABLE" },
    deb: { folder: "executables", category: "EXECUTABLE" },
    appimage: { folder: "executables", category: "EXECUTABLE" },
    pdf: { folder: "documents", category: "DOCUMENT" },
    doc: { folder: "documents", category: "DOCUMENT" },
    docx: { folder: "documents", category: "DOCUMENT" },
    txt: { folder: "documents", category: "DOCUMENT" },
    mp4: { folder: "videos", category: "VIDEO" },
    webm: { folder: "videos", category: "VIDEO" },
  }
  return map[ext] ?? { folder: "other", category: "OTHER" }
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
    if (file.size > 1024 * 1024 * 1024) {
      return NextResponse.json({ error: "Máximo 1GB" }, { status: 400 })
    }

    const { folder, category } = classify(file.name)
    const dir = join(process.cwd(), "public", "uploads", folder)
    await mkdir(dir, { recursive: true })
    const ext = extname(file.name)
    const stored = `${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(join(dir, stored), buffer)

    return NextResponse.json({
      filename: stored,
      originalName: file.name,
      displayName: file.name,
      url: `/api/files/${folder}/${stored}`,
      size: file.size,
      type: file.type || "application/octet-stream",
      category,
      isDownloadable: true,
    })
  } catch (error) {
    console.error("upload-file error:", error)
    return NextResponse.json({ error: "Error al subir" }, { status: 500 })
  }
}
