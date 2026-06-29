"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success("Ajustes guardados")
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
            <div>
              <Label htmlFor="years_experience">Años de experiencia</Label>
              <Input id="years_experience" name="years_experience" type="number" min={0} defaultValue={initial.years_experience ?? "3"} />
            </div>
            <div>
              <Label htmlFor="clients_count">Clientes</Label>
              <Input id="clients_count" name="clients_count" type="number" min={0} defaultValue={initial.clients_count ?? "6"} />
            </div>
          </div>
          <p className="text-xs text-faint">
            Estas métricas aparecen en el hero y la sección "Detrás del studio". Los demás números
            (proyectos, tecnologías) se calculan solos desde la base de datos.
          </p>
          <Button type="submit" disabled={loading} className="self-start">
            {loading ? "Guardando…" : "Guardar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
