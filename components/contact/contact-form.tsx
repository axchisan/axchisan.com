"use client"

import { useId, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Errores = Partial<Record<"name" | "email" | "message", string>>

/** Mismas reglas que valida el servidor con zod en /api/contact. */
function validar(data: Record<string, string>): Errores {
  const e: Errores = {}
  if (data.name.trim().length < 2) e.name = "Escribe tu nombre."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = "Revisa el correo: falta algo."
  if (data.message.trim().length < 5) e.message = "Cuéntame un poco más."
  return e
}

export function ContactForm() {
  const id = useId()
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState<Errores>({})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>

    const encontrados = validar(data)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) {
      // El foco va al primer campo con problema: sin esto quien navega con
      // teclado no sabe dónde está el error.
      form.querySelector<HTMLElement>(`[aria-invalid="true"]`)?.focus()
      return
    }

    setEnviando(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(String(res.status))
      toast.success("Mensaje enviado. Te respondo pronto.")
      form.reset()
    } catch {
      toast.error("No se pudo enviar. Escríbeme directamente por correo.")
    } finally {
      setEnviando(false)
    }
  }

  const campo = (nombre: keyof Errores) => ({
    id: `${id}-${nombre}`,
    name: nombre,
    "aria-invalid": Boolean(errores[nombre]),
    "aria-describedby": errores[nombre] ? `${id}-${nombre}-error` : undefined,
  })

  const error = (nombre: keyof Errores) =>
    errores[nombre] ? (
      <p id={`${id}-${nombre}-error`} className="mt-1.5 text-[0.875rem] text-danger">
        {errores[nombre]}
      </p>
    ) : null

  return (
    <form onSubmit={onSubmit} noValidate className="flex max-w-xl flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${id}-name`}>Nombre</Label>
          <Input {...campo("name")} autoComplete="name" />
          {error("name")}
        </div>
        <div>
          <Label htmlFor={`${id}-email`}>Correo</Label>
          <Input {...campo("email")} type="email" autoComplete="email" />
          {error("email")}
        </div>
      </div>

      <div>
        <Label htmlFor={`${id}-subject`}>
          Asunto <span className="font-normal text-faint">(opcional)</span>
        </Label>
        <Input id={`${id}-subject`} name="subject" />
      </div>

      <div>
        <Label htmlFor={`${id}-message`}>Mensaje</Label>
        <Textarea {...campo("message")} rows={7} />
        {error("message")}
      </div>

      <Button type="submit" disabled={enviando} className="self-start">
        {enviando ? "Enviando…" : "Enviar mensaje"}
      </Button>
    </form>
  )
}
