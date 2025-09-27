export interface FileUploadResult {
  filename: string
  originalName: string
  size: number
  type: string
  url: string
}

export const uploadFiles = async (files: File[]): Promise<FileUploadResult[]> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append("files", file)
  })

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

export const getFileType = (filename: string): "image" | "video" | "document" | "other" => {
  const extension = filename.split(".").pop()?.toLowerCase()

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
    return "image"
  }

  if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension || "")) {
    return "video"
  }

  if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || "")) {
    return "document"
  }

  return "other"
}
