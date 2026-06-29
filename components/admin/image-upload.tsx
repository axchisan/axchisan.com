"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

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

/** Subida de una sola imagen (portada). value/onChange con la URL. */
export function ImageUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  async function handle(file?: File) {
    if (!file) return
    setLoading(true)
    try {
      onChange(await uploadOne(file))
      toast.success("Imagen subida")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error")
    } finally {
      setLoading(false)
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
        <div className="group relative w-full max-w-sm overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Portada" className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bg/80 text-text transition-colors hover:bg-destructive hover:text-white"
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
            "flex h-44 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg text-muted transition-colors hover:border-accent hover:text-text",
          )}
        >
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          <span className="text-sm">{loading ? "Subiendo…" : "Subir imagen"}</span>
        </button>
      )}
    </div>
  )
}
