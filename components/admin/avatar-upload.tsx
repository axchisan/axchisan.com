"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, ImageIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface AvatarUploadProps {
  onImageChange?: (url: string) => void
  initialImage?: string
  className?: string
}

/**
 * Subida de avatar (imagen de perfil) por arrastre o clic, desde cualquier
 * dispositivo. Sube a /api/upload y devuelve la URL. Vista previa circular.
 */
export function AvatarUpload({ onImageChange, initialImage, className }: AvatarUploadProps) {
  const [avatar, setAvatar] = useState<string>(initialImage || "")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      setUploading(true)
      setProgress(0)

      try {
        const formData = new FormData()
        formData.append("files", file)

        const interval = setInterval(() => {
          setProgress((p) => (p >= 90 ? 90 : p + 10))
        }, 150)

        const response = await fetch("/api/upload", { method: "POST", body: formData })
        clearInterval(interval)
        setProgress(100)

        if (!response.ok) throw new Error("Upload failed")

        const result = await response.json()
        const url = result.files[0].url
        setAvatar(url)
        onImageChange?.(url)
        toast({ title: "Foto actualizada", description: "Tu foto de perfil se subió correctamente." })
        setTimeout(() => setProgress(0), 800)
      } catch (error) {
        console.error("Avatar upload error:", error)
        toast({ title: "Error", description: "No se pudo subir la imagen. Intenta de nuevo.", variant: "destructive" })
      } finally {
        setUploading(false)
      }
    },
    [onImageChange, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    maxSize: 5 * 1024 * 1024,
  })

  const removeImage = () => {
    setAvatar("")
    onImageChange?.("")
  }

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden border border-border bg-muted">
        {avatar ? (
          <Image src={avatar} alt="Avatar" fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            uploading && "pointer-events-none opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-4 w-4" />
            <span>Arrastra o haz clic para subir tu foto (máx. 5MB)</span>
          </div>
        </div>
        {uploading && <Progress value={progress} className="w-full h-2" />}
        {avatar && !uploading && (
          <Button variant="ghost" size="sm" onClick={removeImage} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Quitar foto
          </Button>
        )}
      </div>
    </div>
  )
}
