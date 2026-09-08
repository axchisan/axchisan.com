import * as React from "react"
import { cn } from "@/lib/utils"

/** Estilo compartido por input y textarea: un solo sitio donde cambiarlo. */
export const fieldClass =
  "w-full rounded-[8px] border border-line-firm bg-paper px-3 py-2 text-[0.9375rem] text-ink " +
  "placeholder:text-faint transition-colors duration-150 " +
  // El anillo de foco no se elimina: sin él no se puede navegar con teclado.
  "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1 " +
  "focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-danger"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldClass, "h-10", className)} {...props} />
  ),
)
Input.displayName = "Input"
