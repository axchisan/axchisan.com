"use client"

import { useId, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { registrarEvento } from "@/lib/eventos"

type Opcion = { valor: string; texto: string }
type Errores = Partial<Record<"name" | "contacto" | "email" | "message", string>>

const PRESUPUESTOS = [
  "Menos de $ 500.000",
  "Entre $ 500.000 y $ 1.500.000",
  "Entre $ 1.500.000 y $ 3.000.000",
  "Prefiero pagar por mes",
  "Todavía no lo sé",
]

const PLAZOS = ["Lo antes posible", "Este mes", "En uno a tres meses", "Solo estoy averiguando"]

/** Mismas reglas que valida el servidor en /api/contact. */
function validar(d: Record<string, string>): Errores {
  const e: Errores = {}
  if (d.name.trim().length < 2) e.name = "Escribe tu nombre."
  const tel = d.telefono.replace(/\D/g, "")
  if (!d.email.trim() && tel.length < 7) e.contacto = "Déjanos un WhatsApp o un correo para responderte."
  if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "Revisa el correo: falta algo."
  if (d.message.trim().length < 5) e.message = "Cuéntanos un poco más de lo que necesitas."
  return e
}

export function CotizacionForm({
  negocios,
  planes,
  negocioInicial,
  planInicial,
}: {
  negocios: Opcion[]
  planes: Opcion[]
  negocioInicial?: string
  planInicial?: string
}) {
  const id = useId()
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errores, setErrores] = useState<Errores>({})
  // La página desde la que se llegó a cotizar, si es de este sitio: dice qué
  // ficha o demo convence. Se lee al montar, antes de que cambie la historia.
  const [origen] = useState(() => {
    if (typeof document === "undefined" || !document.referrer) return undefined
    try {
      const url = new URL(document.referrer)
      return url.host === window.location.host ? url.pathname + url.search : `externo: ${url.host}`
    } catch {
      return undefined
    }
  })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>

    const encontrados = validar(d)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) {
      // El foco va al primer campo con problema: sin esto quien navega con
      // teclado no sabe dónde está el error.
      form.querySelector<HTMLElement>(`[aria-invalid="true"]`)?.focus()
      return
    }

    const negocio = negocios.find((n) => n.valor === d.negocio)?.texto
    const plan = planes.find((p) => p.valor === d.plan)?.texto

    setEnviando(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.name,
          email: d.email,
          telefono: d.telefono,
          subject: `Cotización: ${negocio ?? "negocio sin indicar"}, ${plan ?? "sin plan elegido"}`,
          message: d.message.trim(),
          sector: negocio,
          necesidad: plan,
          presupuesto: d.presupuesto || undefined,
          plazo: d.plazo || undefined,
          origen,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setEnviado(true)
      toast.success("Recibimos tu solicitud. Te respondemos el mismo día hábil.")
      registrarEvento("cotizacion", negocio)
      form.reset()
    } catch {
      toast.error("No se pudo enviar. Escríbenos por WhatsApp y lo vemos por ahí.")
    } finally {
      setEnviando(false)
    }
  }

  const invalido = (n: keyof Errores) => ({
    "aria-invalid": Boolean(errores[n]),
    "aria-describedby": errores[n] ? `${id}-${n}-error` : undefined,
  })
  const error = (n: keyof Errores) =>
    errores[n] ? (
      <p id={`${id}-${n}-error`} className="mt-1.5 text-[0.875rem] text-danger">
        {errores[n]}
      </p>
    ) : null

  const selectClase =
    "mt-1.5 block h-11 w-full rounded-[10px] border border-line-firm bg-card px-3 text-[1rem] text-ink focus-visible:outline-2 focus-visible:outline-accent-ink"

  return (
    <form onSubmit={onSubmit} noValidate className="flex max-w-2xl flex-col gap-6">
      {enviado && (
        <p role="status" className="rounded-[12px] border border-accent-ink/30 bg-accent-weak p-4 text-[0.9375rem] text-ink">
          Recibimos tu solicitud. Te respondemos el mismo día hábil, por el medio que dejaste.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${id}-negocio`}>Tipo de negocio</Label>
          <select id={`${id}-negocio`} name="negocio" defaultValue={negocioInicial ?? ""} className={selectClase}>
            <option value="">Elegir</option>
            {negocios.map((n) => (
              <option key={n.valor} value={n.valor}>
                {n.texto}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor={`${id}-plan`}>Qué necesitas</Label>
          <select id={`${id}-plan`} name="plan" defaultValue={planInicial ?? ""} className={selectClase}>
            <option value="">No estoy seguro</option>
            {planes.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.texto}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="text-[0.9375rem] font-medium text-ink">Presupuesto aproximado</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESUPUESTOS.map((p) => (
            <label key={p} className="cursor-pointer">
              <input type="radio" name="presupuesto" value={p} className="peer sr-only" />
              <span className="inline-flex h-10 items-center rounded-full border border-line-firm bg-card px-4 text-[0.9375rem] text-ink peer-checked:border-accent-ink peer-checked:bg-accent-weak peer-focus-visible:outline-2 peer-focus-visible:outline-accent-ink">
                {p}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="sm:max-w-xs">
        <Label htmlFor={`${id}-plazo`}>Para cuándo</Label>
        <select id={`${id}-plazo`} name="plazo" defaultValue="" className={selectClase}>
          <option value="">Elegir</option>
          {PLAZOS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor={`${id}-message`}>Cuéntanos qué necesitas</Label>
        <Textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          placeholder="Por ejemplo: tengo una veterinaria en Suba y quiero que los clientes pidan cita sin llamar."
          {...invalido("message")}
        />
        {error("message")}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor={`${id}-name`}>Tu nombre</Label>
          <Input id={`${id}-name`} name="name" autoComplete="name" {...invalido("name")} />
          {error("name")}
        </div>
        <div>
          <Label htmlFor={`${id}-telefono`}>WhatsApp</Label>
          <Input id={`${id}-telefono`} name="telefono" type="tel" inputMode="tel" autoComplete="tel" {...invalido("contacto")} />
        </div>
        <div>
          <Label htmlFor={`${id}-email`}>
            Correo <span className="font-normal text-faint">(opcional)</span>
          </Label>
          <Input id={`${id}-email`} name="email" type="email" autoComplete="email" {...invalido("email")} />
          {error("email")}
        </div>
      </div>
      {error("contacto")}

      <Button type="submit" disabled={enviando} size="lg" className="self-start">
        {enviando ? "Enviando…" : "Pedir cotización"}
      </Button>
      <p className="-mt-2 text-[0.875rem] text-mid">
        Tus datos solo se usan para responderte. Ver la{" "}
        <a href="/privacidad" className="link">
          política de privacidad
        </a>
        .
      </p>
    </form>
  )
}
