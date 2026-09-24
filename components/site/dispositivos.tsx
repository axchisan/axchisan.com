import Image from "next/image"
import type { Captura } from "@/lib/catalogo/soluciones"
import { cn } from "@/lib/utils"

/**
 * Marcos para mostrar capturas reales de las demos. Son deliberadamente
 * neutros: sin logos de fabricantes ni reflejos, para que lo que se vea sea
 * la demo y no el aparato.
 */

export function Navegador({
  captura,
  className,
  prioridad,
  tamanos = "(min-width: 1024px) 640px, 100vw",
}: {
  captura: Captura
  className?: string
  prioridad?: boolean
  tamanos?: string
}) {
  return (
    <figure className={cn("overflow-hidden rounded-[12px] bg-[#1b232d] shadow-[0_24px_60px_-24px_rgb(0_0_0/0.55)]", className)}>
      <div className="flex h-7 items-center gap-1.5 px-3" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a4655]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a4655]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a4655]" />
      </div>
      <Image
        src={captura.src}
        alt={captura.alt}
        width={captura.ancho}
        height={captura.alto}
        sizes={tamanos}
        priority={prioridad}
        className="block h-auto w-full"
      />
    </figure>
  )
}

export function Celular({
  captura,
  className,
  prioridad,
  tamanos = "240px",
}: {
  captura: Captura
  className?: string
  prioridad?: boolean
  tamanos?: string
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[28px] border-[6px] border-[#1b232d] bg-[#1b232d] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]",
        className,
      )}
    >
      <Image
        src={captura.src}
        alt={captura.alt}
        width={captura.ancho}
        height={captura.alto}
        sizes={tamanos}
        priority={prioridad}
        className="block h-auto w-full rounded-[22px]"
      />
    </figure>
  )
}
