import type { SVGProps } from "react"
import { CARAS, VIEWBOX } from "./logo-geometria"

/**
 * Marca Axchi: una cinta continua que se pliega y forma una A.
 *
 * Reconstruida en SVG a partir de la imagen generada, midiendo su geometría en
 * lugar de calcarla: el vértice es un pliegue plano de 22 unidades, las patas
 * caen con pendiente 0,44 y la barra se abre hacia abajo por los dos extremos.
 * Así los bordes son exactos, el archivo pesa unos cientos de bytes y la marca
 * es nítida a cualquier tamaño.
 *
 * Los tres tonos son las caras de la cinta, no un degradado: se mantienen
 * planos para que la marca sobreviva al tamaño de un favicon.
 */

const VB = `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`

export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VB} className={className} role="img" aria-label="Axchi" {...props}>
      {CARAS.map((c) => (
        <polygon key={c.color} points={c.puntos} fill={c.color} />
      ))}
    </svg>
  )
}

/** Marca completa: cinta + nombre. El tamaño lo fija quien la usa. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-[22px] w-[30.6px]" />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">Axchi</span>
    </span>
  )
}
