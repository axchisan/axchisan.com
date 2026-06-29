"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/admin/image-upload"
import { MultiImageUpload } from "@/components/admin/multi-image-upload"

export type ProjectInput = {
  id?: string
  title?: string
  shortDesc?: string | null
  description?: string
  content?: string | null
  category?: string | null
  status?: string
  featured?: boolean
  technologies?: string[]
  githubUrl?: string | null
  liveUrl?: string | null
  coverImage?: string | null
  images?: string[]
  order?: number
}

const STATUSES = [
  { v: "COMPLETED", l: "Completado" },
  { v: "IN_PROGRESS", l: "En progreso" },
  { v: "ARCHIVED", l: "Archivado" },
]

export function ProjectForm({ initial }: { initial?: ProjectInput }) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "")
  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [status, setStatus] = useState(initial?.status ?? "COMPLETED")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const payload = {
      title: String(fd.get("title") || "").trim(),
      shortDesc: String(fd.get("shortDesc") || ""),
      description: String(fd.get("description") || ""),
      content: String(fd.get("content") || ""),
      category: String(fd.get("category") || ""),
      githubUrl: String(fd.get("githubUrl") || ""),
      liveUrl: String(fd.get("liveUrl") || ""),
      technologies: String(fd.get("technologies") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      order: Number(fd.get("order") || 0),
      status,
      featured,
      coverImage,
      images,
    }
    try {
      const res = await fetch(isEdit ? `/api/projects/${initial!.id}` : "/api/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success(isEdit ? "Proyecto actualizado" : "Proyecto creado")
      router.push("/admin/projects")
      router.refresh()
    } catch {
      toast.error("No se pudo guardar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Card>
        <CardContent className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" name="title" required defaultValue={initial?.title ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="shortDesc">Descripción corta</Label>
            <Input id="shortDesc" name="shortDesc" defaultValue={initial?.shortDesc ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={initial?.description ?? ""} />
          </div>
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Input id="category" name="category" placeholder="Web, Mobile…" defaultValue={initial?.category ?? ""} />
          </div>
          <div>
            <Label htmlFor="status">Estado</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-[15px] text-text focus:border-accent focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s.v} value={s.v}>{s.l}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" name="githubUrl" defaultValue={initial?.githubUrl ?? ""} />
          </div>
          <div>
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input id="liveUrl" name="liveUrl" defaultValue={initial?.liveUrl ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="technologies">Tecnologías (separadas por coma)</Label>
            <Input id="technologies" name="technologies" defaultValue={(initial?.technologies ?? []).join(", ")} />
          </div>
          <div>
            <Label htmlFor="order">Orden</Label>
            <Input id="order" name="order" type="number" defaultValue={initial?.order ?? 0} />
          </div>
          <label className="flex items-center gap-3 self-end pb-2.5">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
            <span className="text-sm text-text">Destacado</span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-6 pt-6">
          <div>
            <Label>Portada</Label>
            <ImageUpload value={coverImage} onChange={setCoverImage} />
          </div>
          <div>
            <Label>Galería de imágenes</Label>
            <MultiImageUpload value={images} onChange={setImages} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Label htmlFor="content">Contenido (markdown)</Label>
          <Textarea id="content" name="content" rows={10} className="font-mono text-sm" defaultValue={initial?.content ?? ""} />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear proyecto"}
        </Button>
        <Button type="button" variant="outline" href="/admin/projects">Cancelar</Button>
      </div>
    </form>
  )
}
