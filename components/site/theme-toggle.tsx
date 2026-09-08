"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

/**
 * Alterna entre claro y oscuro.
 *
 * Hasta que monta en el cliente no se sabe qué tema resolvió el sistema, así
 * que se pinta un hueco de la misma medida: cambiar el icono después del
 * montaje provoca un salto del layout.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [montado, setMontado] = useState(false)

  useEffect(() => setMontado(true), [])

  const esOscuro = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(esOscuro ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-[8px] text-graphite transition-colors hover:bg-raised hover:text-ink"
      // El servidor no sabe qué tema resolvió el sistema: hasta que monta, la
      // etiqueta tiene que ser la misma en ambos lados o React avisa de
      // discrepancia de hidratación.
      aria-label={montado ? (esOscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro") : "Cambiar de tema"}
    >
      {montado ? (
        esOscuro ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  )
}
