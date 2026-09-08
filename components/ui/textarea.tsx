import * as React from "react"
import { cn } from "@/lib/utils"
import { fieldClass } from "./input"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldClass, "min-h-28 py-2.5", className)} {...props} />
  ),
)
Textarea.displayName = "Textarea"
