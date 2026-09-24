"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2, Mail, Check, MessageCircle, X } from "lucide-react"
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
  telefono?: string | null
  sector?: string | null
  necesidad?: string | null
  presupuesto?: string | null
  plazo?: string | null
  origen?: string | null
}

/** wa.me necesita el número con indicativo: a un celular colombiano de 10 dígitos se le antepone 57. */
function enlaceWhatsapp(telefono: string, nombre: string) {
  const digitos = telefono.replace(/\D/g, "")
  const numero = digitos.length === 10 ? `57${digitos}` : digitos
  const saludo = `Hola, ${nombre.split(" ")[0]}. Te escribo de Axchi por la cotización que nos enviaste.`
  return `https://wa.me/${numero}?text=${encodeURIComponent(saludo)}`
}

/** Los estados siguen una cotización: nueva, en conversación, cerrada o descartada. */
const STATUS: Record<string, { label: string; variant: "default" | "accent" | "positive" | "warning" }> = {
  PENDING: { label: "Nueva", variant: "warning" },
  IN_PROGRESS: { label: "En conversación", variant: "accent" },
  RESOLVED: { label: "Cerrada", variant: "positive" },
  REJECTED: { label: "Descartada", variant: "default" },
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
        <p className="text-mid">Aún no hay mensajes.</p>
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
                  <span className="font-semibold">{m.name}</span>
                  <Badge variant={st.variant}>{st.label}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 text-sm">
                  {m.telefono && <span className="text-ink">WhatsApp {m.telefono}</span>}
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="text-accent-ink hover:underline">
                      {m.email}
                    </a>
                  )}
                </div>
              </div>
              <span className="text-[0.875rem] text-faint shrink-0">{formatDate(m.createdAt)}</span>
            </div>
            {m.subject && <p className="mt-3 text-sm font-medium text-ink">{m.subject}</p>}
            {(m.sector || m.necesidad || m.presupuesto || m.plazo || m.origen) && (
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                {(
                  [
                    ["Negocio", m.sector],
                    ["Necesita", m.necesidad],
                    ["Presupuesto", m.presupuesto],
                    ["Plazo", m.plazo],
                    ["Llegó desde", m.origen],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([t, v]) => (
                    <div key={t} className="contents">
                      <dt className="text-faint">{t}</dt>
                      <dd className="text-ink">{v}</dd>
                    </div>
                  ))}
              </dl>
            )}
            <p className="mt-3 whitespace-pre-wrap text-[15px] text-mid">{m.message}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {m.telefono && (
                <Button href={enlaceWhatsapp(m.telefono, m.name)} size="sm" target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="h-4 w-4" /> Responder por WhatsApp
                </Button>
              )}
              {m.status === "PENDING" && (
                <Button variant="outline" size="sm" disabled={busy === m.id} onClick={() => setStatus(m.id, "IN_PROGRESS")}>
                  <MessageCircle className="h-4 w-4" /> En conversación
                </Button>
              )}
              {m.status !== "RESOLVED" && (
                <Button variant="outline" size="sm" disabled={busy === m.id} onClick={() => setStatus(m.id, "RESOLVED")}>
                  <Check className="h-4 w-4" /> Cerrar
                </Button>
              )}
              {m.status !== "REJECTED" && m.status !== "RESOLVED" && (
                <Button variant="outline" size="sm" disabled={busy === m.id} onClick={() => setStatus(m.id, "REJECTED")}>
                  <X className="h-4 w-4" /> Descartar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={busy === m.id}
                onClick={() => remove(m.id)}
                className="text-danger hover:border-danger/50"
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
