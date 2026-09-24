"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { X } from "lucide-react"
import { nivelDe, pasosDe, useDemo } from "./contexto"

/**
 * El recorrido "Cómo funciona" pertenece a Axchi, no al negocio ficticio: por
 * eso usa los colores del sitio y no los de la demo. Así el visitante distingue
 * sin esfuerzo la explicación de la cosa explicada.
 */

function irAlPunto(id: string) {
  const el = document.querySelector<HTMLElement>(`[data-punto="${id}"]`)
  el?.scrollIntoView({ behavior: "smooth", block: "center" })
}

function irALaExplicacion(id: string) {
  const el = document.getElementById(`recorrido-${id}`)
  el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  el?.focus({ preventScroll: true })
}

/**
 * Marca un elemento como parte del recorrido. Cuando el recorrido está activo
 * aparece encima su número; al pulsarlo, se abre su explicación.
 */
export function Punto({
  id,
  children,
  className,
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  const { config, recorrido } = useDemo()
  const ruta = usePathname()
  const pasos = pasosDe(config, ruta)
  const indice = pasos.findIndex((p) => p.id === id)
  const visible = recorrido && indice >= 0

  return (
    <div
      data-punto={id}
      className={`relative ${visible ? "rounded-[10px] outline-2 outline-offset-4 outline-accent/70 outline-dashed" : ""} ${className ?? ""}`}
    >
      {children}
      {visible && (
        <button
          type="button"
          onClick={() => irALaExplicacion(id)}
          className="absolute -top-3 -left-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-band font-sans text-[0.8125rem] font-semibold text-on-band shadow-md ring-2 ring-accent"
          aria-label={`Explicación ${indice + 1}: ${pasos[indice].titulo}`}
        >
          {indice + 1}
        </button>
      )}
    </div>
  )
}

/** Panel con las explicaciones de la pantalla actual. */
export function PanelRecorrido() {
  const { config, recorrido, alternarRecorrido, incluye } = useDemo()
  const ruta = usePathname()
  if (!recorrido) return null
  const requerido = nivelDe(config, ruta)
  const bloqueada = !incluye(requerido)
  const pasos = bloqueada ? [] : pasosDe(config, ruta)

  return (
    <aside
      aria-label="Cómo funciona esta pantalla"
      className="fixed inset-x-3 bottom-3 z-[60] print:hidden max-h-[42vh] overflow-y-auto rounded-[14px] bg-band font-sans text-on-band shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-h-[70vh] sm:w-[360px]"
    >
      <div className="sticky top-0 flex items-center justify-between gap-3 bg-band px-5 pt-4 pb-3">
        <h2 className="text-[1rem] font-semibold">Cómo funciona esta pantalla</h2>
        <button
          type="button"
          onClick={() => alternarRecorrido(false)}
          className="rounded-[6px] p-1.5 text-on-band-mid hover:text-on-band"
          aria-label="Cerrar la explicación"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {bloqueada ? (
        <p className="px-5 pb-5 text-[0.9375rem] text-on-band-mid">
          Esta pantalla no entra en el plan que estás viendo. Elige «
          {config.niveles.find((n) => n.id === requerido)?.etiqueta}» en la barra de arriba para
          verla funcionando.
        </p>
      ) : pasos.length === 0 ? (
        <p className="px-5 pb-5 text-[0.9375rem] text-on-band-mid">
          Esta pantalla no tiene explicaciones. Prueba en la portada, al agendar una cita o en el
          panel.
        </p>
      ) : (
        <ol className="space-y-1 px-3 pb-4">
          {pasos.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                id={`recorrido-${p.id}`}
                onClick={() => irAlPunto(p.id)}
                className="flex w-full gap-3 rounded-[10px] p-2.5 text-left transition-colors hover:bg-band-2 focus-visible:bg-band-2"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[0.75rem] font-semibold text-on-accent">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-semibold">{p.titulo}</span>
                  <span className="mt-0.5 block text-[0.875rem] leading-relaxed text-on-band-mid">
                    {p.texto}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
