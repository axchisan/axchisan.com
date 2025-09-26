"use client"

import { useState } from "react"
import { FileUpload } from "@/components/ui/file-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ExternalLink } from "lucide-react"
import Image from "next/image"

interface UploadedFileResult {
  filename: string
  originalName: string
  size: number
  type: string
  url: string
}

interface ImageUploadProps {
  title?: string
  description?: string
  maxFiles?: number
  onImagesChange?: (urls: string[]) => void
  initialImages?: string[]
  className?: string
}

export function ImageUpload({
  title = "Subir Imágenes",
  description = "Sube imágenes para tu proyecto o perfil",
  maxFiles = 5,
  onImagesChange,
  initialImages = [],
  className,
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages)

  const handleUpload = (files: UploadedFileResult[]) => {
    const imageUrls = files.filter((file) => file.type.startsWith("image/")).map((file) => file.url)

    const newImages = [...uploadedImages, ...imageUrls]
    setUploadedImages(newImages)
    onImagesChange?.(newImages)
  }

  const removeImage = (urlToRemove: string) => {
    const newImages = uploadedImages.filter((url) => url !== urlToRemove)
    setUploadedImages(newImages)
    onImagesChange?.(newImages)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUpload
          onUpload={handleUpload}
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
          maxFiles={maxFiles}
          maxSize={5 * 1024 * 1024} // 5MB
        />

        {uploadedImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Imágenes subidas</h4>
              <Badge variant="secondary">{uploadedImages.length} imagen(es)</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden border border-border">
                    <Image src={url || "/placeholder.svg"} alt={`Imagen ${index + 1}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => window.open(url, "_blank")}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeImage(url)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
