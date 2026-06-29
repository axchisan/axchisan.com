"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { ImagePlus, X, Loader2 } from "lucide-react"

async function uploadOne(file: File): Promise<string> {
  const fd = new FormData()
  fd.append("file", file)
  const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.error || "Error al subir")
  }
  const { url } = await res.json()
  return url as string
}

/** Galería de imágenes. value/onChange con array de URLs. */
export function MultiImageUpload({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  async function handle(files: FileList | null) {
    if (!files || files.length === 0) return
    setLoading(true)
    try {
      const urls = await Promise.all(Array.from(files).map(uploadOne))
      onChange([...value, ...urls])
      toast.success(`${urls.length} imagen(es) subida(s)`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handle(e.target.files)} />
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url + i} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded bg-bg/80 text-text transition-colors hover:bg-destructive hover:text-white"
              aria-label="Quitar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={loading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-bg text-muted transition-colors hover:border-accent hover:text-text"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="text-[11px]">Añadir</span>
        </button>
      </div>
    </div>
  )
}
