"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type Skill = { id: string; name: string; category: string; level: number; order: number }

export function SkillsClient({ initial }: { initial: Skill[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  const grouped = initial.reduce<Record<string, Skill[]>>((acc, s) => {
    ;(acc[s.category] ??= []).push(s)
    return acc
  }, {})

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAdding(true)
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get("name") || "").trim(),
      category: String(fd.get("category") || "").trim(),
      level: Number(fd.get("level") || 5),
      order: Number(fd.get("order") || 0),
    }
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success("Skill añadida")
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    } catch {
      toast.error("No se pudo añadir")
    } finally {
      setAdding(false)
    }
  }

  async function remove(id: string) {
    setBusy(id)
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Skill eliminada")
      router.refresh()
    } catch {
      toast.error("No se pudo eliminar")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={add} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto_auto]">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" required placeholder="React" />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" required placeholder="Frontend" />
            </div>
            <div className="w-24">
              <Label htmlFor="level">Nivel</Label>
              <Input id="level" name="level" type="number" min={1} max={10} defaultValue={7} />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={adding}>
                <Plus className="h-4 w-4" /> Añadir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-[0.875rem] text-faint mb-2 text-accent">{cat}</h3>
          <div className="flex flex-wrap gap-2">
            {items.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-2 rounded-lg border border-line bg-raised px-3 py-1.5 text-sm">
                {s.name}
                <button
                  onClick={() => remove(s.id)}
                  disabled={busy === s.id}
                  className="text-faint transition-colors hover:text-danger"
                  aria-label={`Eliminar ${s.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
