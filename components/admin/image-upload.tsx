"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadFile } from "@/lib/upload-client"

/** Subida de una sola imagen (portada). value/onChange con la URL. */
export function ImageUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handle(file?: File) {
    if (!file) return
    setLoading(true)
    setProgress(0)
    try {
      const { url } = await uploadFile(file, { imagesOnly: true, onProgress: setProgress })
      onChange(url)
      toast.success("Imagen subida")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error")
    } finally {
      setLoading(false)
      // El input conserva el archivo anterior: sin esto no se puede reintentar
      // con el mismo archivo tras un fallo.
      if (ref.current) ref.current.value = ""
    }
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {value ? (
        <div className="group relative w-full max-w-sm overflow-hidden rounded-[8px] border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Portada" className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-paper/80 text-ink transition-colors hover:bg-danger hover:text-white"
            aria-label="Quitar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={loading}
          className={cn(
            "flex h-44 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-line bg-paper text-graphite transition-colors hover:border-accent hover:text-ink",
          )}
        >
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          <span className="text-sm">
            {loading ? `Subiendo… ${Math.round(progress * 100)}%` : "Subir imagen"}
          </span>
        </button>
      )}
    </div>
  )
}
