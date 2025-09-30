"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CoverImageUploadProps {
  onImageChange?: (url: string) => void
  initialImage?: string
  className?: string
}

export function CoverImageUpload({ onImageChange, initialImage, className }: CoverImageUploadProps) {
  const [coverImage, setCoverImage] = useState<string>(initialImage || "")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setUploading(true)
      setUploadProgress(0)

      try {
        const formData = new FormData()
        formData.append("files", file)
        formData.append("isCoverImage", "true")

        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const result = await response.json()
        const uploadedImage = result.files[0]

        setCoverImage(uploadedImage.url)
        onImageChange?.(uploadedImage.url)

        toast({
          title: "Imagen subida",
          description: "La imagen de portada se ha subido exitosamente.",
        })

        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      } catch (error) {
        console.error("Upload error:", error)
        toast({
          title: "Error",
          description: "Error al subir la imagen. Intenta de nuevo.",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    },
    [onImageChange, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const removeImage = () => {
    setCoverImage("")
    onImageChange?.("")
    toast({
      title: "Imagen eliminada",
      description: "La imagen de portada ha sido eliminada.",
    })
  }

  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-primary/20", className)}>
      <CardHeader>
        <CardTitle>Imagen de Portada</CardTitle>
        <CardDescription>Sube una imagen de portada para tu proyecto (máx. 5MB)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!coverImage ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
              uploading && "pointer-events-none opacity-50",
            )}
          >
            <input {...getInputProps()} />
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Suelta la imagen aquí...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">Arrastra una imagen aquí o haz clic para seleccionar</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, JPEG, GIF o WEBP (máx. 5MB)</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative group">
            <div className="aspect-video relative rounded-lg overflow-hidden border border-border">
              <Image src={coverImage || "/placeholder.svg"} alt="Imagen de portada" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={removeImage}>
                  <X className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Subiendo imagen...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
