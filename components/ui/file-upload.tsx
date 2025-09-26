"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, ImageIcon, Video, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onUpload: (files: UploadedFileResult[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  className?: string
}

interface UploadedFile {
  file: File
  progress: number
  url?: string
  error?: string
  status: "uploading" | "success" | "error"
}

interface UploadedFileResult {
  filename: string
  originalName: string
  size: number
  type: string
  url: string
}

export function FileUpload({
  onUpload,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "video/*": [".mp4", ".webm", ".ogg"],
    "application/pdf": [".pdf"],
  },
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)

      const newFiles = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      try {
        // Create FormData
        const formData = new FormData()
        acceptedFiles.forEach((file) => {
          formData.append("files", file)
        })

        // Upload files
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const result = await response.json()

        // Update file status to success
        setUploadedFiles((prev) =>
          prev.map((f) => {
            const uploadedFile = result.files.find((rf: UploadedFileResult) => rf.originalName === f.file.name)
            if (uploadedFile && acceptedFiles.includes(f.file)) {
              return {
                ...f,
                progress: 100,
                status: "success" as const,
                url: uploadedFile.url,
              }
            }
            return f
          }),
        )

        // Call onUpload callback
        onUpload(result.files)

        toast({
          title: "Archivos subidos",
          description: `${acceptedFiles.length} archivo(s) subido(s) exitosamente.`,
        })
      } catch (error) {
        console.error("Upload error:", error)

        // Update file status to error
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (acceptedFiles.includes(f.file)) {
              return {
                ...f,
                status: "error" as const,
                error: "Error al subir archivo",
              }
            }
            return f
          }),
        )

        toast({
          title: "Error",
          description: "Error al subir los archivos. Intenta de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  })

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file !== fileToRemove))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.startsWith("video/")) return Video
    return File
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer",
          isDragActive && "border-primary bg-primary/5",
          isUploading && "pointer-events-none opacity-50",
        )}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary">Suelta los archivos aquí...</p>
          ) : (
            <div>
              <p className="text-foreground font-medium mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p className="text-sm text-muted-foreground">
                Máximo {maxFiles} archivos, {Math.round(maxSize / 1024 / 1024)}MB por archivo
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((fileObj, index) => {
            const Icon = getFileIcon(fileObj.file)
            return (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Icon className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                        {getStatusIcon(fileObj.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {fileObj.status === "uploading" && <Progress value={fileObj.progress} className="mt-2" />}
                      {fileObj.error && <p className="text-xs text-red-500 mt-1">{fileObj.error}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileObj.file)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
