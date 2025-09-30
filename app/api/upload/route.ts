import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export const maxDuration = 60

export const dynamic = 'force-dynamic'

const SUPPORTED_TYPES = {
  // Imágenes
  "image/jpeg": { category: "IMAGE", extensions: [".jpg", ".jpeg"], folder: "images" },
  "image/png": { category: "IMAGE", extensions: [".png"], folder: "images" },
  "image/gif": { category: "IMAGE", extensions: [".gif"], folder: "images" },
  "image/webp": { category: "IMAGE", extensions: [".webp"], folder: "images" },
  "image/svg+xml": { category: "IMAGE", extensions: [".svg"], folder: "images" },

  // Videos
  "video/mp4": { category: "VIDEO", extensions: [".mp4"], folder: "videos" },
  "video/webm": { category: "VIDEO", extensions: [".webm"], folder: "videos" },
  "video/ogg": { category: "VIDEO", extensions: [".ogg"], folder: "videos" },
  "video/avi": { category: "VIDEO", extensions: [".avi"], folder: "videos" },
  "video/mov": { category: "VIDEO", extensions: [".mov"], folder: "videos" },

  // Documentos
  "application/pdf": { category: "DOCUMENT", extensions: [".pdf"], folder: "documents" },
  "text/plain": { category: "DOCUMENT", extensions: [".txt"], folder: "documents" },
  "application/msword": { category: "DOCUMENT", extensions: [".doc"], folder: "documents" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    category: "DOCUMENT",
    extensions: [".docx"],
    folder: "documents",
  },

  // Ejecutables
  "application/x-msdownload": { category: "EXECUTABLE", extensions: [".exe"], folder: "executables" },
  "application/x-msi": { category: "EXECUTABLE", extensions: [".msi"], folder: "executables" },
  "application/x-apple-diskimage": { category: "EXECUTABLE", extensions: [".dmg"], folder: "executables" },
  "application/x-debian-package": { category: "EXECUTABLE", extensions: [".deb"], folder: "executables" },
  "application/x-rpm": { category: "EXECUTABLE", extensions: [".rpm"], folder: "executables" },

  // Apps móviles
  "application/vnd.android.package-archive": { category: "MOBILE_APP", extensions: [".apk"], folder: "mobile-apps" },
  "application/octet-stream": { category: "MOBILE_APP", extensions: [".ipa"], folder: "mobile-apps" }, // iOS apps

  // Archivos comprimidos
  "application/zip": { category: "ARCHIVE", extensions: [".zip"], folder: "archives" },
  "application/x-rar-compressed": { category: "ARCHIVE", extensions: [".rar"], folder: "archives" },
  "application/x-7z-compressed": { category: "ARCHIVE", extensions: [".7z"], folder: "archives" },
  "application/x-tar": { category: "ARCHIVE", extensions: [".tar"], folder: "archives" },
  "application/gzip": { category: "ARCHIVE", extensions: [".gz"], folder: "archives" },
}

function getCategoryByExtension(filename: string): { category: string; folder: string } {
  const extension = filename.toLowerCase().split(".").pop()

  const extensionMap: Record<string, { category: string; folder: string }> = {
    // Ejecutables adicionales
    exe: { category: "EXECUTABLE", folder: "executables" },
    msi: { category: "EXECUTABLE", folder: "executables" },
    dmg: { category: "EXECUTABLE", folder: "executables" },
    deb: { category: "EXECUTABLE", folder: "executables" },
    rpm: { category: "EXECUTABLE", folder: "executables" },
    appimage: { category: "EXECUTABLE", folder: "executables" },

    // Apps móviles
    apk: { category: "MOBILE_APP", folder: "mobile-apps" },
    ipa: { category: "MOBILE_APP", folder: "mobile-apps" },
    aab: { category: "MOBILE_APP", folder: "mobile-apps" }, // Android App Bundle

    // Archivos comprimidos
    zip: { category: "ARCHIVE", folder: "archives" },
    rar: { category: "ARCHIVE", folder: "archives" },
    "7z": { category: "ARCHIVE", folder: "archives" },
    tar: { category: "ARCHIVE", folder: "archives" },
    gz: { category: "ARCHIVE", folder: "archives" },
    bz2: { category: "ARCHIVE", folder: "archives" },

    // Código fuente
    js: { category: "SOURCE_CODE", folder: "source-code" },
    ts: { category: "SOURCE_CODE", folder: "source-code" },
    jsx: { category: "SOURCE_CODE", folder: "source-code" },
    tsx: { category: "SOURCE_CODE", folder: "source-code" },
    py: { category: "SOURCE_CODE", folder: "source-code" },
    java: { category: "SOURCE_CODE", folder: "source-code" },
    cpp: { category: "SOURCE_CODE", folder: "source-code" },
    c: { category: "SOURCE_CODE", folder: "source-code" },
    cs: { category: "SOURCE_CODE", folder: "source-code" },
    php: { category: "SOURCE_CODE", folder: "source-code" },
    rb: { category: "SOURCE_CODE", folder: "source-code" },
    go: { category: "SOURCE_CODE", folder: "source-code" },
    rs: { category: "SOURCE_CODE", folder: "source-code" },
  }

  return extensionMap[extension || ""] || { category: "OTHER", folder: "other" }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.formData()
    const files: File[] = data.getAll("files") as File[]
    const projectId = data.get("projectId") as string | null
    const blogPostId = data.get("blogPostId") as string | null
    const platform = data.get("platform") as string | null
    const version = data.get("version") as string | null
    const isDownloadable = data.get("isDownloadable") === "true"
    const displayName = data.get("displayName") as string | null
    const description = data.get("description") as string | null
    const isCoverImage = data.get("isCoverImage") === "true"

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB in bytes
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File ${file.name} exceeds maximum size of 1GB` }, { status: 400 })
      }
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

      let fileInfo = SUPPORTED_TYPES[file.type as keyof typeof SUPPORTED_TYPES]
      if (!fileInfo) {
        fileInfo = getCategoryByExtension(file.name)
      }

      const uploadDir = `uploads/${fileInfo.folder}`

      // Create directory if it doesn't exist
      const fullUploadDir = join(process.cwd(), "public", uploadDir)
      await mkdir(fullUploadDir, { recursive: true })

      // Write file
      const filePath = join(fullUploadDir, filename)
      await writeFile(filePath, buffer)

      const publicUrl = `/api/files/${fileInfo.folder}/${filename}`

      let savedFile
      if (projectId && !isCoverImage) {
        savedFile = await prisma.projectFile.create({
          data: {
            filename,
            originalName: file.name,
            displayName: displayName || file.name,
            description,
            url: publicUrl,
            size: file.size,
            type: file.type,
            category: fileInfo.category as any,
            platform,
            version,
            isDownloadable,
            projectId,
          },
        })
      } else if (blogPostId && !isCoverImage) {
        savedFile = await prisma.blogFile.create({
          data: {
            filename,
            originalName: file.name,
            displayName: displayName || file.name,
            description,
            url: publicUrl,
            size: file.size,
            type: file.type,
            category: fileInfo.category as any,
            isDownloadable,
            blogPostId,
          },
        })
      }

      uploadedFiles.push({
        id: savedFile?.id,
        filename,
        originalName: file.name,
        displayName: displayName || file.name,
        description,
        size: file.size,
        type: file.type,
        category: fileInfo.category,
        url: publicUrl,
        platform: platform || null,
        version: version || null,
        isDownloadable: isDownloadable,
        projectId: projectId || null,
        blogPostId: blogPostId || null,
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