import { type NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { join, normalize } from "path"

export const dynamic = "force-dynamic"

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  pdf: "application/pdf",
  txt: "text/plain",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  "7z": "application/x-7z-compressed",
  tar: "application/x-tar",
  gz: "application/gzip",
  exe: "application/x-msdownload",
  dmg: "application/x-apple-diskimage",
  apk: "application/vnd.android.package-archive",
}

export async function GET(_request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await ctx.params
    const baseDir = join(process.cwd(), "public", "uploads")
    // Normaliza y bloquea path traversal fuera de /public/uploads.
    const requested = normalize(join(baseDir, ...path))
    if (!requested.startsWith(baseDir)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const fileStats = await stat(requested).catch(() => null)
    if (!fileStats || !fileStats.isFile()) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = await readFile(requested)
    const ext = requested.split(".").pop()?.toLowerCase() ?? ""
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream"

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": fileStats.size.toString(),
      },
    })
  } catch (error) {
    console.error("files GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
