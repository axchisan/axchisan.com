"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { Upload, X, Loader2, FileDown } from "lucide-react"
import { uploadFile } from "@/lib/upload-client"

export type ProjectFileItem = {
  id?: string
  filename: string
  originalName: string
  displayName: string
  url: string
  size: number
  type: string
  category: string
  platform?: string | null
  version?: string | null
  isDownloadable: boolean
}

function fmtSize(n: number) {
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

/** Sube archivos descargables (APK, ZIP, etc.) y mantiene la lista (existentes + nuevos). */
export function FileUpload({ value, onChange }: { value: ProjectFileItem[]; onChange: (files: ProjectFileItem[]) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState<{ name: string; progress: number } | null>(null)

  async function handle(files: FileList | null) {
    if (!files || files.length === 0) return
    setLoading(true)
    // Los archivos ya subidos se conservan aunque uno posterior falle: son
    // binarios grandes y volver a subirlos todos por un fallo es inaceptable.
    const uploaded: ProjectFileItem[] = []
    try {
      for (const f of Array.from(files)) {
        setCurrent({ name: f.name, progress: 0 })
        uploaded.push(
          await uploadFile(f, {
            onProgress: (progress) => setCurrent({ name: f.name, progress }),
          }),
        )
      }
      toast.success(`${uploaded.length} archivo(s) subido(s)`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error")
    } finally {
      if (uploaded.length) onChange([...value, ...uploaded])
      setLoading(false)
      setCurrent(null)
      if (ref.current) ref.current.value = ""
    }
  }

  return (
    <div>
      <input ref={ref} type="file" multiple className="hidden" onChange={(e) => handle(e.target.files)} />
      <div className="flex flex-col gap-2">
        {value.map((f, i) => (
          <div key={f.url + i} className="flex items-center gap-3 rounded-lg border border-border bg-bg px-3.5 py-2.5">
            <FileDown className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-text">{f.displayName || f.originalName}</p>
              <p className="font-mono text-[10px] text-faint">{f.category} · {fmtSize(f.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-faint transition-colors hover:text-destructive"
              aria-label="Quitar archivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg py-3 text-sm text-muted transition-colors hover:border-accent hover:text-text"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {current
            ? `Subiendo ${current.name} — ${Math.round(current.progress * 100)}%`
            : "Subir archivo descargable (APK, ZIP, …)"}
        </button>
      </div>
    </div>
  )
}
