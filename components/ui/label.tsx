import * as React from "react"
import { cn } from "@/lib/utils"

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("mb-1.5 block text-[0.9375rem] font-medium text-ink", className)}
      {...props}
    />
  ),
)
Label.displayName = "Label"
