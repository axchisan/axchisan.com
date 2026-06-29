"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Pencil, Trash2, FolderGit2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/admin/empty-state"

type Item = {
  id: string
  title: string
  category: string | null
  featured: boolean
  status: string
  coverImage: string | null
}

export function ProjectsList({ items }: { items: Item[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  async function remove(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return
    setBusy(id)
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Proyecto eliminado")
      router.refresh()
    } catch {
      toast.error("No se pudo eliminar")
    } finally {
      setBusy(null)
    }
  }

  if (items.length === 0)
    return (
      <EmptyState
        icon={FolderGit2}
        title="Aún no hay proyectos"
        description="Crea tu primer caso para mostrarlo en el sitio. Aparecerá en la sección Trabajo."
        actionHref="/admin/projects/new"
        actionLabel="Nuevo proyecto"
      />
    )

  return (
    <div className="flex flex-col gap-3">
      {items.map((p) => (
        <Card key={p.id} className="flex items-center gap-4 p-4">
          <div
            className="h-14 w-20 shrink-0 rounded-lg border border-border bg-cover bg-center"
            style={{ backgroundImage: p.coverImage ? `url(${p.coverImage})` : "linear-gradient(135deg,#1d2127,#14161a)" }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-display font-semibold">{p.title}</span>
              {p.featured && <Badge variant="accent">Destacado</Badge>}
              {p.category && <Badge>{p.category}</Badge>}
            </div>
            <span className="mono-label">{p.status}</span>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" href={`/admin/projects/${p.id}`}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy === p.id}
              onClick={() => remove(p.id, p.title)}
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
