"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2, Mail, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  status: string
  createdAt: string | Date
}

const STATUS: Record<string, { label: string; variant: "default" | "accent" | "success" | "warning" }> = {
  PENDING: { label: "Pendiente", variant: "warning" },
  IN_PROGRESS: { label: "En curso", variant: "accent" },
  RESOLVED: { label: "Resuelto", variant: "success" },
  REJECTED: { label: "Rechazado", variant: "default" },
}

export function MessagesClient({ initial }: { initial: Message[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  async function setStatus(id: string, status: string) {
    setBusy(id)
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success("Mensaje actualizado")
      router.refresh()
    } catch {
      toast.error("No se pudo actualizar")
    } finally {
      setBusy(null)
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este mensaje?")) return
    setBusy(id)
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Mensaje eliminado")
      router.refresh()
    } catch {
      toast.error("No se pudo eliminar")
    } finally {
      setBusy(null)
    }
  }

  if (initial.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <Mail className="h-8 w-8 text-faint" />
        <p className="text-muted">Aún no hay mensajes.</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {initial.map((m) => {
        const st = STATUS[m.status] ?? STATUS.PENDING
        return (
          <Card key={m.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display font-semibold">{m.name}</span>
                  <Badge variant={st.variant}>{st.label}</Badge>
                </div>
                <a href={`mailto:${m.email}`} className="text-sm text-accent hover:underline">
                  {m.email}
                </a>
              </div>
              <span className="mono-label shrink-0">{formatDate(m.createdAt)}</span>
            </div>
            {m.subject && <p className="mt-3 text-sm font-medium text-text">{m.subject}</p>}
            <p className="mt-1.5 whitespace-pre-wrap text-[15px] text-muted">{m.message}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {m.status !== "RESOLVED" && (
                <Button variant="outline" size="sm" disabled={busy === m.id} onClick={() => setStatus(m.id, "RESOLVED")}>
                  <Check className="h-4 w-4" /> Resolver
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={busy === m.id}
                onClick={() => remove(m.id)}
                className="text-destructive hover:border-destructive/50"
              >
                <Trash2 className="h-4 w-4" /> Eliminar
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
