"use client"

import { useId, useRef, type ReactNode } from "react"
import { X } from "lucide-react"

/**
 * WhatsApp de un negocio ficticio. Su número no existe, y abrir wa.me de
 * verdad podría escribirle a un desconocido: el botón muestra en cambio cómo
 * llegaría el mensaje. El diálogo es de Axchi, no de la demo, así que usa los
 * colores del sitio.
 */
export function WhatsappSimulado({
  mensaje,
  negocio,
  children,
  className,
}: {
  mensaje: string
  /** "la clínica", "el salón": completa "el chat de ___". */
  negocio: string
  children: ReactNode
  className?: string
}) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const id = useId()
  return (
    <>
      <button type="button" onClick={() => dialogo.current?.showModal()} className={className}>
        {children}
      </button>
      <dialog
        ref={dialogo}
        aria-labelledby={`${id}-titulo`}
        className="m-auto w-[min(92vw,420px)] rounded-[20px] bg-card p-0 font-sans text-ink backdrop:bg-black/50"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 id={`${id}-titulo`} className="text-[1.25rem] font-semibold">
              Así llega a WhatsApp
            </h2>
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              className="rounded-[8px] p-1 text-mid hover:text-ink"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-[0.9375rem] text-mid">
            En la página real este botón abre el chat de {negocio} con el mensaje ya escrito:
          </p>
          <div className="mt-4 rounded-[14px] rounded-tr-[4px] bg-[#dcf8c6] p-4 text-[0.9375rem] leading-relaxed text-[#111b21]">
            {mensaje}
          </div>
          <p className="mt-4 text-[0.8125rem] text-mid">
            Aquí no se envía nada: el número de este negocio de ejemplo es ficticio.
          </p>
        </div>
      </dialog>
    </>
  )
}
