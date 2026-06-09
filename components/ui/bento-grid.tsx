import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import type { HTMLAttributes } from "react"

/**
 * Grid asimétrico tipo bento. Auto-rows para permitir celdas tall/wide.
 */
export function BentoGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(180px,auto)] gap-4 md:gap-5", className)}
      {...props}
    />
  )
}

const sizeMap: Record<string, string> = {
  sm: "",
  md: "sm:col-span-1",
  wide: "sm:col-span-2",
  tall: "row-span-2",
  large: "sm:col-span-2 row-span-2",
}

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeMap
}

export const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  ({ className, size = "sm", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 md:p-6",
          "transition-colors duration-300 hover:border-primary/40",
          sizeMap[size],
          className,
        )}
        {...props}
      />
    )
  },
)
BentoCard.displayName = "BentoCard"
