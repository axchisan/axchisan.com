import type { SVGProps } from "react"

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

const CLARO = "#3fc9c2"
const MEDIO = "#12a5a5"
const OSCURO = "#0a7676"

export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="-1 0 140 100"
      className={className}
      role="img"
      aria-label="Axchi"
      {...props}
    >
      {/* Orden de pintado = orden de la cinta: pata derecha al fondo, barra
          encima, pata izquierda delante. De ahí sale el tejido imposible. */}
      <polygon points="58.20,0.00 80.50,0.00 124.50,100.00 102.20,100.00" fill={OSCURO} />
      <polygon points="13.00,52.00 125.70,52.00 138.80,70.00 -0.10,70.00" fill={MEDIO} />
      <polygon points="58.20,0.00 80.50,0.00 36.50,100.00 14.20,100.00" fill={CLARO} />
    </svg>
  )
}

/** Versión de un solo color, para cuando el fondo no admite las tres caras. */
export function LogoMarkPlano({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-1 0 140 100" fill="currentColor" className={className} aria-hidden {...props}>
      <polygon points="58.20,0.00 80.50,0.00 124.50,100.00 102.20,100.00" />
      <polygon points="13.00,52.00 125.70,52.00 138.80,70.00 -0.10,70.00" />
      <polygon points="58.20,0.00 80.50,0.00 36.50,100.00 14.20,100.00" />
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
