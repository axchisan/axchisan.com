"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface AdditionalImagesUploadProps {
  projectId?: string
  blogPostId?: string
  initialImages?: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export function AdditionalImagesUpload({
  projectId,
  blogPostId,
  initialImages = [],
  onImagesChange,
  maxImages = 10,
  className,
}: AdditionalImagesUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast.error(`Solo puedes subir un máximo de ${maxImages} imágenes`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()

      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      formData.append("isCoverImage", "true")

      if (projectId) {
        formData.append("projectId", projectId)
      }
      if (blogPostId) {
        formData.append("blogPostId", blogPostId)
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al subir las imágenes")
      }

      const data = await response.json()

      const uploadedUrls = data.files.map((file: any) => file.url)
      const newImages = [...images, ...uploadedUrls]

      setImages(newImages)
      onImagesChange(newImages)

      toast.success(`${files.length} imagen(es) subida(s) exitosamente`)
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error(error instanceof Error ? error.message : "Error al subir las imágenes")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
    toast.success("Imagen eliminada")
  }

  return (
    <Card className={`p-6 bg-card/50 backdrop-blur-sm border-primary/20 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Imágenes Adicionales</h3>
            <p className="text-sm text-muted-foreground">
              Sube capturas de pantalla y media adicional ({images.length}/{maxImages})
            </p>
          </div>

          {images.length < maxImages && (
            <div>
              <input
                type="file"
                id="additional-images-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("additional-images-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Imágenes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video relative overflow-hidden rounded-lg border border-primary/20">
                  <Image src={image || "/placeholder.svg"} alt={`Imagen ${index + 1}`} fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              No hay imágenes adicionales. Sube capturas de pantalla o media relacionada.
            </p>
            <input
              type="file"
              id="additional-images-upload-empty"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("additional-images-upload-empty")?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Primera Imagen
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
