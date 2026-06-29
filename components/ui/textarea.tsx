import * as React from "react"
import { cn } from "@/lib/utils"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-[15px] text-text placeholder:text-faint transition-colors focus:border-accent focus:outline-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = "Textarea"
