import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import type { HTMLAttributes } from "react"

/**
 * Card con glassmorphism. Usar SOLO en elementos flotantes/modales/nav,
 * no como contenedor por defecto.
 */
export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("glass rounded-xl", className)} {...props} />
  },
)
GlassCard.displayName = "GlassCard"
