"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, ImageIcon, Video } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (files: File[]) => void
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)

      const newFiles = acceptedFiles.map((file) => ({
        file,
        progress: 0,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Simulate upload progress
      for (const fileObj of newFiles) {
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setUploadedFiles((prev) => prev.map((f) => (f.file === fileObj.file ? { ...f, progress } : f)))
        }

        // Simulate successful upload
        setUploadedFiles((prev) =>
          prev.map((f) => (f.file === fileObj.file ? { ...f, url: URL.createObjectURL(f.file) } : f)),
        )
      }

      setIsUploading(false)
      onUpload(acceptedFiles)
    },
    [onUpload],
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

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer",
          isDragActive && "border-primary bg-primary/5",
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
                      <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                      <p className="text-xs text-muted-foreground">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {fileObj.progress < 100 && <Progress value={fileObj.progress} className="mt-2" />}
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
