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
import { slugify } from "@/lib/utils"

export type BlogInput = {
  slug?: string
  title?: string
  excerpt?: string | null
  content?: string
  coverImage?: string | null
  tags?: string[]
  published?: boolean
  featured?: boolean
  readTime?: number | null
}

export function BlogForm({ initial }: { initial?: BlogInput }) {
  const router = useRouter()
  const isEdit = Boolean(initial?.slug)
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "")
  const [published, setPublished] = useState(initial?.published ?? false)
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [slug, setSlug] = useState(initial?.slug ?? "")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const payload = {
      title: String(fd.get("title") || "").trim(),
      slug: slug.trim() || slugify(String(fd.get("title") || "")),
      excerpt: String(fd.get("excerpt") || ""),
      content: String(fd.get("content") || ""),
      readTime: Number(fd.get("readTime") || 0) || null,
      tags: String(fd.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverImage,
      published,
      featured,
    }
    try {
      const res = await fetch(isEdit ? `/api/blog/${initial!.slug}` : "/api/blog", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.error || "")
      }
      toast.success(isEdit ? "Post actualizado" : "Post creado")
      router.push("/admin/blog")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "No se pudo guardar")
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
            <Input
              id="title"
              name="title"
              required
              defaultValue={initial?.title ?? ""}
              onChange={(e) => { if (!isEdit) setSlug(slugify(e.target.value)) }}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="mi-articulo" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="excerpt">Extracto</Label>
            <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={initial?.excerpt ?? ""} />
          </div>
          <div>
            <Label htmlFor="tags">Tags (separados por coma)</Label>
            <Input id="tags" name="tags" defaultValue={(initial?.tags ?? []).join(", ")} />
          </div>
          <div>
            <Label htmlFor="readTime">Min. de lectura</Label>
            <Input id="readTime" name="readTime" type="number" defaultValue={initial?.readTime ?? ""} />
          </div>
          <div className="flex flex-wrap gap-6 sm:col-span-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
              <span className="text-sm text-text">Publicado</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
              <span className="text-sm text-text">Destacado</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Label>Portada</Label>
          <ImageUpload value={coverImage} onChange={setCoverImage} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Label htmlFor="content">Contenido (markdown) *</Label>
          <Textarea id="content" name="content" rows={16} required className="font-mono text-sm" defaultValue={initial?.content ?? ""} />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear post"}
        </Button>
        <Button type="button" variant="outline" href="/admin/blog">Cancelar</Button>
      </div>
    </form>
  )
}
