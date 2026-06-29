"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Item = {
  slug: string
  title: string
  published: boolean
  featured: boolean
  tags: string[]
}

export function BlogList({ items }: { items: Item[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  async function remove(slug: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"?`)) return
    setBusy(slug)
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Post eliminado")
      router.refresh()
    } catch {
      toast.error("No se pudo eliminar")
    } finally {
      setBusy(null)
    }
  }

  if (items.length === 0) return <Card className="p-10 text-center text-muted">Aún no hay posts.</Card>

  return (
    <div className="flex flex-col gap-3">
      {items.map((p) => (
        <Card key={p.slug} className="flex items-center gap-4 p-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-display font-semibold">{p.title}</span>
              <Badge variant={p.published ? "success" : "warning"}>{p.published ? "Publicado" : "Borrador"}</Badge>
              {p.featured && <Badge variant="accent">Destacado</Badge>}
            </div>
            {p.tags.length > 0 && <span className="mono-label">{p.tags.slice(0, 4).join(" · ")}</span>}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" href={`/admin/blog/${p.slug}`}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy === p.slug}
              onClick={() => remove(p.slug, p.title)}
              className="text-destructive hover:border-destructive/50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
