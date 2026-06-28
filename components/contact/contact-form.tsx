"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const field =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 text-[15px] text-text placeholder:text-faint transition-colors focus:border-accent focus:outline-none"

export function ContactForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("fail")
      toast.success("Mensaje enviado. Te responderé pronto.")
      form.reset()
    } catch {
      toast.error("No se pudo enviar. Escríbeme por WhatsApp.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Tu nombre" className={field} />
        <input name="email" type="email" required placeholder="Tu email" className={field} />
      </div>
      <input name="subject" placeholder="Asunto (opcional)" className={field} />
      <textarea name="message" required rows={6} placeholder="Cuéntame sobre tu proyecto…" className={field} />
      <Button type="submit" size="lg" disabled={loading} className="self-start">
        {loading ? "Enviando…" : "Enviar mensaje →"}
      </Button>
    </form>
  )
}
