"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { RotateCcw } from "lucide-react"
import { almacenCafe } from "./estado"
import { RAIZ } from "./config"

/** Un grano de café y el nombre en serif: la marca. */
export function Marca({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${claro ? "text-white" : "text-cb-cafeto"}`}>
      <svg viewBox="0 0 24 30" className="h-6 w-5" aria-hidden>
        <ellipse cx="12" cy="15" rx="10" ry="13" fill={claro ? "var(--color-cb-menta)" : "var(--color-cb-cereza)"} />
        <path d="M12 3.5c-4 5-4 18 0 23" fill="none" stroke={claro ? "var(--color-cb-cafeto)" : "#fff"} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="font-cb-marca text-[1.25rem] leading-none whitespace-nowrap">Café del Barrio</span>
    </span>
  )
}

const VISTAS = [
  { href: RAIZ, nombre: "App del cliente" },
  { href: `${RAIZ}/caja`, nombre: "Caja" },
  { href: `${RAIZ}/panel`, nombre: "Panel" },
]

/**
 * Las tres caras del programa. La app es del cliente; la caja y el panel, del
 * negocio. Se pueden abrir en pestañas distintas: comparten los datos.
 */
export function Vistas() {
  const ruta = usePathname()
  return (
    <nav aria-label="Vistas de la demo" className="border-b border-cb-linea bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 sm:gap-6 sm:px-6">
        <Link href={RAIZ} className="hidden shrink-0 py-3 sm:block" aria-label="Café del Barrio, app del cliente">
          <Marca />
        </Link>
        <ul className="flex gap-1 sm:ml-auto">
          {VISTAS.map((v) => {
            const activa = v.href === RAIZ ? ruta === RAIZ : ruta.startsWith(v.href)
            return (
              <li key={v.href}>
                <Link
                  href={v.href}
                  aria-current={activa ? "page" : undefined}
                  className={`inline-block border-b-2 px-3 py-3.5 text-[0.9375rem] font-medium whitespace-nowrap ${activa ? "border-cb-cafeto text-cb-cafeto" : "border-transparent text-cb-gris hover:text-cb-tinta"}`}
                >
                  {v.nombre}
                </Link>
              </li>
            )
          })}
        </ul>
        <button type="button" onClick={() => almacenCafe.restablecer()} className="ml-auto flex shrink-0 items-center gap-1.5 py-3 text-[0.875rem] text-cb-gris hover:text-cb-tinta sm:ml-0">
          <RotateCcw className="h-4 w-4" aria-hidden />
          <span className="sr-only sm:not-sr-only sm:underline sm:underline-offset-4">Restablecer demo</span>
        </button>
      </div>
    </nav>
  )
}
