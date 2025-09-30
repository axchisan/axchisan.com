import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const { fileId } = params

    // Try to find the file in project files first
    let file = await prisma.projectFile.findUnique({
      where: { id: fileId },
      include: { project: true },
    })

    let fileType = "project"

    // If not found in project files, try blog files
    if (!file) {
      const blogFile = await prisma.blogFile.findUnique({
        where: { id: fileId },
        include: { blogPost: true },
      })

      if (blogFile) {
        file = blogFile as any
        fileType = "blog"
      }
    }

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (!file.isDownloadable) {
      return NextResponse.json({ error: "File is not downloadable" }, { status: 403 })
    }

    // Increment download counter
    if (fileType === "project") {
      await prisma.projectFile.update({
        where: { id: fileId },
        data: { downloadCount: { increment: 1 } },
      })
    } else {
      await prisma.blogFile.update({
        where: { id: fileId },
        data: { downloadCount: { increment: 1 } },
      })
    }

    // We need to prepend 'public' to get the actual file system path
    const filePath = join(process.cwd(), "public", file.url)

    try {
      const fileBuffer = await readFile(filePath)

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${file.originalName}"`,
          "Content-Length": file.size.toString(),
        },
      })
    } catch (fileError) {
      console.error("File read error:", fileError)
      console.error("Attempted path:", filePath)
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 })
    }
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
