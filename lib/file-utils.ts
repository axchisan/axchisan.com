export interface FileUploadResult {
  filename: string
  originalName: string
  size: number
  type: string
  url: string
  category?: string
  platform?: string | null
  version?: string | null
  isDownloadable?: boolean
  projectId?: string | null
}

export const uploadFiles = async (
  files: File[],
  metadata?: {
    projectId?: string
    platform?: string
    version?: string
    isDownloadable?: boolean
  },
): Promise<FileUploadResult[]> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append("files", file)
  })

  if (metadata?.projectId) {
    formData.append("projectId", metadata.projectId)
  }
  if (metadata?.platform) {
    formData.append("platform", metadata.platform)
  }
  if (metadata?.version) {
    formData.append("version", metadata.version)
  }
  if (metadata?.isDownloadable !== undefined) {
    formData.append("isDownloadable", metadata.isDownloadable.toString())
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  const result = await response.json()
  return result.files
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const getFileType = (
  filename: string,
): "image" | "video" | "document" | "executable" | "mobile_app" | "archive" | "source_code" | "other" => {
  const extension = filename.split(".").pop()?.toLowerCase()

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
    return "image"
  }

  if (["mp4", "avi", "mov", "wmv", "flv", "webm", "ogg"].includes(extension || "")) {
    return "video"
  }

  if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || "")) {
    return "document"
  }

  if (["exe", "msi", "dmg", "deb", "rpm", "appimage"].includes(extension || "")) {
    return "executable"
  }

  if (["apk", "ipa", "aab"].includes(extension || "")) {
    return "mobile_app"
  }

  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension || "")) {
    return "archive"
  }

  if (["js", "ts", "jsx", "tsx", "py", "java", "cpp", "c", "cs", "php", "rb", "go", "rs"].includes(extension || "")) {
    return "source_code"
  }

  return "other"
}

export const getFileIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    IMAGE: "ImageIcon",
    VIDEO: "Video",
    DOCUMENT: "FileText",
    EXECUTABLE: "Monitor",
    MOBILE_APP: "Smartphone",
    ARCHIVE: "Archive",
    SOURCE_CODE: "Code",
    OTHER: "File",
  }
  return iconMap[category] || "File"
}

export const getPlatformIcon = (platform: string) => {
  const platformMap: Record<string, string> = {
    Android: "Smartphone",
    iOS: "Smartphone",
    Windows: "Monitor",
    macOS: "Monitor",
    Linux: "Monitor",
    Web: "Globe",
  }
  return platformMap[platform] || "Monitor"
}

export const getFileExtensions = (category: string): string[] => {
  const extensionMap: Record<string, string[]> = {
    IMAGE: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    VIDEO: [".mp4", ".webm", ".ogg", ".avi", ".mov"],
    DOCUMENT: [".pdf", ".doc", ".docx", ".txt"],
    EXECUTABLE: [".exe", ".msi", ".dmg", ".deb", ".rpm", ".appimage"],
    MOBILE_APP: [".apk", ".ipa", ".aab"],
    ARCHIVE: [".zip", ".rar", ".7z", ".tar", ".gz"],
    SOURCE_CODE: [".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".cpp", ".c", ".cs", ".php", ".rb", ".go", ".rs"],
    OTHER: [],
  }
  return extensionMap[category] || []
}
