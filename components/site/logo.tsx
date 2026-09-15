import type { SVGProps } from "react"

/**
 * Monograma de Axchi: una A de trazo constante con el vértice cortado en plano.
 *
 * Es SVG y no un PNG generado: pesa unos cientos de bytes, es nítida a
 * cualquier tamaño y hereda el color del contexto con `currentColor`, así que
 * la misma marca sirve sobre la banda oscura y sobre el cuerpo claro.
 */
export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Vértice plano en lugar de punta: es la decisión que separa este
          monograma de la A de cualquier tipografía. Se percibe incluso a 16px,
          que es el tamaño al que más se ve la marca. */}
      <path d="M5.5 27 12.4 5h7.2L26.5 27" />
      <path d="M10.2 20.2h11.6" />
    </svg>
  )
}

/** Marca completa: monograma + nombre. El tamaño lo fija quien la usa. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="h-[22px] w-[22px] text-accent" />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">Axchi</span>
    </span>
  )
}
