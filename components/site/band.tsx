import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Banda oscura. Es el recurso que da ritmo a la página: oscuro arriba, cuerpo
 * claro en medio, oscuro al cerrar. El contraste hace el trabajo que en otros
 * sitios hacen los bordes y las sombras.
 */
export function Band({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode
  className?: string
  as?: "section" | "header" | "div"
}) {
  return (
    <Tag className={cn("bg-band text-on-band", className)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </Tag>
  )
}

/** Encabezado de página interior: título y entradilla sobre la banda. */
export function PageBand({
  titulo,
  entradilla,
  children,
}: {
  titulo: string
  entradilla?: string
  children?: ReactNode
}) {
  return (
    <Band as="header">
      <div className="enter py-16 sm:py-20">
        <h1 className="max-w-[16ch] text-[2.4375rem] leading-[1.06] sm:text-[3.0625rem]">
          {titulo}
        </h1>
        {entradilla && (
          <p className="mt-5 max-w-[56ch] text-[1.125rem] leading-relaxed text-on-band-mid">
            {entradilla}
          </p>
        )}
        {children}
      </div>
    </Band>
  )
}

/** Cuerpo claro de la página. */
export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-paper", className)}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">{children}</div>
    </div>
  )
}

/**
 * Encabezado de sección.
 *
 * Sin eyebrow en versalitas: esa etiqueta no aporta información que el título
 * no dé ya, y es uno de los gestos que delatan una página generada.
 */
export function SectionHead({
  titulo,
  entradilla,
  accion,
}: {
  titulo: string
  entradilla?: string
  accion?: ReactNode
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div>
        <h2 className="text-[1.9375rem] text-ink sm:text-[2.125rem]">{titulo}</h2>
        {entradilla && (
          <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-relaxed text-mid">{entradilla}</p>
        )}
      </div>
      {accion}
    </div>
  )
}
