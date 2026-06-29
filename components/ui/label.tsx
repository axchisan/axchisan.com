import * as React from "react"
import { cn } from "@/lib/utils"

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("mono-label mb-2 block", className)} {...props} />
  ),
)
Label.displayName = "Label"
