"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type Profile = {
  name?: string | null
  title?: string | null
  bio?: string | null
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  instagram?: string | null
  github?: string | null
  linkedin?: string | null
}

const FIELDS: { key: keyof Profile; label: string; type?: string; full?: boolean }[] = [
  { key: "name", label: "Nombre" },
  { key: "title", label: "Título / rol" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Teléfono" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "instagram", label: "Instagram (URL)" },
  { key: "github", label: "GitHub (URL)" },
  { key: "linkedin", label: "LinkedIn (URL)" },
]

export function ProfileForm({ initial }: { initial: Profile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success("Perfil actualizado")
      router.refresh()
    } catch {
      toast.error("No se pudo guardar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input id={f.key} name={f.key} type={f.type ?? "text"} defaultValue={initial[f.key] ?? ""} />
              </div>
            ))}
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={5} defaultValue={initial.bio ?? ""} />
          </div>
          <Button type="submit" disabled={loading} className="self-start">
            {loading ? "Guardando…" : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
