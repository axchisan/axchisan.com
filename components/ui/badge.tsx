import * as React from "react"
import { cn } from "@/lib/utils"

const variants = {
  default: "border-line bg-raised text-graphite",
  accent: "border-accent/30 bg-accent-weak text-accent",
  positive: "border-positive/30 bg-positive/10 text-positive",
  danger: "border-danger/30 bg-danger-weak text-danger",
  warning: "border-warning/30 bg-warning-weak text-warning",
}

/**
 * Etiqueta de estado o categoría. En caja baja y con la familia del sitio:
 * las versalitas monoespaciadas son decoración, no información.
 */
export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] border px-2 py-0.5 text-[0.8125rem] leading-5",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
