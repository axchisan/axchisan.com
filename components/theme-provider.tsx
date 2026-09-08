"use client"

import { ThemeProvider as NextThemes } from "next-themes"
import type { ReactNode } from "react"

/**
 * `attribute="data-theme"` para que coincida con `:root[data-theme="dark"]`
 * en globals.css. next-themes inyecta un script bloqueante que fija el atributo
 * antes del primer pintado: sin él la página parpadea en el tema equivocado.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  )
}
