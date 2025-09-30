import { type NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { join } from "path"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const filePath = params.path.join("/")

    // Construct the full path to the file
    const fullPath = join(process.cwd(), "public", "uploads", filePath)

    console.log("[v0] Attempting to serve file from:", fullPath)

    try {
      // Check if file exists
      const fileStats = await stat(fullPath)

      if (!fileStats.isFile()) {
        console.log("[v0] Path is not a file:", fullPath)
        return NextResponse.json({ error: "Not a file" }, { status: 404 })
      }

      // Read the file
      const fileBuffer = await readFile(fullPath)

      // Determine content type based on extension
      const extension = filePath.split(".").pop()?.toLowerCase()
      const contentTypeMap: Record<string, string> = {
        // Images
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        svg: "image/svg+xml",
        // Videos
        mp4: "video/mp4",
        webm: "video/webm",
        ogg: "video/ogg",
        // Documents
        pdf: "application/pdf",
        txt: "text/plain",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // Archives
        zip: "application/zip",
        rar: "application/x-rar-compressed",
        "7z": "application/x-7z-compressed",
        tar: "application/x-tar",
        gz: "application/gzip",
        // Executables
        exe: "application/x-msdownload",
        dmg: "application/x-apple-diskimage",
        apk: "application/vnd.android.package-archive",
      }

      const contentType = contentTypeMap[extension || ""] || "application/octet-stream"

      console.log("[v0] Successfully serving file:", fullPath, "Content-Type:", contentType)

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Length": fileStats.size.toString(),
        },
      })
    } catch (fileError) {
      console.error("[v0] File not found:", fullPath, fileError)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("[v0] Error serving file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
