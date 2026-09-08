"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Copy, Trash2, FileArchive, FileText, Smartphone, Film, File as FileIcon, Loader2, ImagePlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Media = { name: string; url: string; size: number; category: string; uploadedAt: string }

const CAT_ICON: Record<string, typeof FileIcon> = {
  IMAGE: ImagePlus,
  images: ImagePlus,
  VIDEO: Film,
  videos: Film,
  DOCUMENT: FileText,
  documents: FileText,
  ARCHIVE: FileArchive,
  archives: FileArchive,
  MOBILE_APP: Smartphone,
  "mobile-apps": Smartphone,
}

function fmtSize(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

function isImage(m: Media) {
  return /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(m.name)
}

export function MediaManager() {
  const [files, setFiles] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [busy, setBusy] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/upload")
      const data = await res.json()
      setFiles(data.files ?? [])
    } catch {
      toast.error("No se pudieron cargar los archivos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function remove(url: string) {
    if (!confirm("¿Eliminar este archivo? Si está en uso, se romperá su enlace.")) return
    setBusy(url)
    try {
      const res = await fetch(`/api/upload?path=${encodeURIComponent(url)}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Archivo eliminado")
      setFiles((f) => f.filter((x) => x.url !== url))
    } catch {
      toast.error("No se pudo eliminar")
    } finally {
      setBusy(null)
    }
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url)
    toast.success("URL copiada")
  }

  const cats = Array.from(new Set(files.map((f) => f.category)))
  const shown = filter === "all" ? files : files.filter((f) => f.category === filter)

  if (loading) {
    return (
      <Card className="flex items-center justify-center gap-3 p-12 text-graphite">
        <Loader2 className="h-5 w-5 animate-spin" /> Cargando archivos…
      </Card>
    )
  }

  if (files.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 p-12 text-center">
        <ImagePlus className="h-8 w-8 text-faint" />
        <p className="text-graphite">No hay archivos subidos todavía.</p>
        <p className="text-sm text-faint">Los archivos que subas en proyectos y blog aparecerán aquí.</p>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${filter === "all" ? "border-accent bg-accent-weak text-accent" : "border-line text-graphite hover:text-ink"}`}
        >
          Todo ({files.length})
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${filter === c ? "border-accent bg-accent-weak text-accent" : "border-line text-graphite hover:text-ink"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((m) => {
          const Icon = CAT_ICON[m.category] ?? FileIcon
          return (
            <Card key={m.url} className="group overflow-hidden">
              <div className="relative flex h-32 items-center justify-center border-b border-line bg-paper">
                {isImage(m) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <Icon className="h-8 w-8 text-faint" strokeWidth={1.4} />
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-paper/80 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button onClick={() => copy(m.url)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-raised text-ink transition-colors hover:border-accent hover:text-accent" aria-label="Copiar URL">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(m.url)} disabled={busy === m.url} className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-raised text-ink transition-colors hover:border-danger hover:text-danger" aria-label="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-ink" title={m.name}>{m.name}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <Badge>{m.category}</Badge>
                  <span className="font-mono text-[10px] text-faint">{fmtSize(m.size)}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
