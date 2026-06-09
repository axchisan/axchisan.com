import { cn } from "@/lib/utils"
import type { ElementType, ReactNode } from "react"

interface GradientTextProps {
  as?: ElementType
  children: ReactNode
  className?: string
}

/**
 * Aplica el gradiente de marca (violeta -> cian) sobre el texto.
 * Reemplaza el patrón repetido `bg-gradient-to-r ... bg-clip-text text-transparent`.
 */
export function GradientText({ as: Tag = "span", children, className }: GradientTextProps) {
  return <Tag className={cn("text-gradient", className)}>{children}</Tag>
}
