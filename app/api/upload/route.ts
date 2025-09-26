import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.formData()
    const files: File[] = data.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split(".").pop()
      const filename = `${timestamp}-${randomString}.${extension}`

      // Determine upload directory based on file type
      let uploadDir = "uploads"
      if (file.type.startsWith("image/")) {
        uploadDir = "uploads/images"
      } else if (file.type.startsWith("video/")) {
        uploadDir = "uploads/videos"
      } else if (file.type === "application/pdf") {
        uploadDir = "uploads/documents"
      }

      // Create directory if it doesn't exist
      const fullUploadDir = join(process.cwd(), "public", uploadDir)
      await mkdir(fullUploadDir, { recursive: true })

      // Write file
      const filePath = join(fullUploadDir, filename)
      await writeFile(filePath, buffer)

      // Return public URL
      const publicUrl = `/${uploadDir}/${filename}`

      uploadedFiles.push({
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
      })
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}
