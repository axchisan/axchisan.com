import * as React from "react"
import { cn } from "@/lib/utils"

const variants = {
  default: "border-border text-muted",
  accent: "border-accent/40 bg-accent-soft text-accent",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
}

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
