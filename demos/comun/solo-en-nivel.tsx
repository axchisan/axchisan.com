"use client"

import type { ReactNode } from "react"
import { PLANES, SUSCRIPCIONES, pesos } from "@/lib/catalogo/planes"
import { useDemo } from "./contexto"

/**
 * Muestra su contenido solo si el nivel elegido lo incluye. Si no, explica en
 * qué plan entra y cuánto cuesta, y deja verlo con un clic: la idea es que el
 * visitante descubra el siguiente plan, no que se tope con una pared.
 */
export function SoloEnNivel({
  nivel: requerido,
  children,
  compacto,
}: {
  nivel: string
  children: ReactNode
  compacto?: boolean
}) {
  const { config, incluye, elegirNivel } = useDemo()
  if (incluye(requerido)) return <>{children}</>

  const nivel = config.niveles.find((n) => n.id === requerido)
  if (!nivel) return null
  const plan = PLANES[nivel.planes[0]]

  return (
    <div
      className={`rounded-[14px] border border-dashed border-band/25 bg-card font-sans text-ink ${
        compacto ? "p-4" : "mx-auto my-10 max-w-lg p-7"
      }`}
    >
      <p className="text-[0.9375rem] font-semibold">
        Esto entra en el plan {plan.nombre}, desde {pesos(plan.desde)}
        {plan.suscripcion ? ` o ${pesos(SUSCRIPCIONES[plan.suscripcion].mensual)} al mes` : ""}.
      </p>
      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-mid">{plan.resumen}</p>
      <button
        type="button"
        onClick={() => elegirNivel(requerido)}
        className="mt-4 inline-flex h-9 items-center rounded-[8px] bg-band px-4 text-[0.875rem] font-semibold text-on-band hover:bg-band-2"
      >
        Ver la demo como «{nivel.etiqueta}»
      </button>
    </div>
  )
}
