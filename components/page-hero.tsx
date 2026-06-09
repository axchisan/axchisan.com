"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { GradientText } from "@/components/ui/gradient-text"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { useReducedMotion, getTransition } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export interface HeroMetric {
  value: number
  label: string
  prefix?: string
  suffix?: string
}

interface PageHeroProps {
  /** Texto del badge superior (opcional) */
  badge?: string
  /** Ícono decorativo superior (opcional) */
  icon?: LucideIcon
  /** Título; la parte resaltada se pasa por `highlight` */
  title: string
  /** Porción del título con gradiente de marca */
  highlight?: string
  subtitle?: string
  metrics?: HeroMetric[]
  actions?: ReactNode
  /** Layout: centrado (default) o dividido texto + media */
  variant?: "default" | "split"
  /** Contenido visual para variant split */
  media?: ReactNode
  className?: string
}

/**
 * Hero configurable que unifica el molde repetido de todas las páginas internas.
 * Soporta layout centrado o split (texto + media) para romper la monotonía.
 */
export function PageHero({
  badge,
  icon: Icon,
  title,
  highlight,
  subtitle,
  metrics,
  actions,
  variant = "default",
  media,
  className,
}: PageHeroProps) {
  const reduced = useReducedMotion()

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: getTransition(reduced, 0.6, delay),
  })

  const content = (
    <div className={cn(variant === "split" ? "text-left" : "text-center max-w-4xl mx-auto")}>
      {Icon && variant === "default" && (
        <motion.div {...fade(0)} className="mb-6 flex justify-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 glow">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </motion.div>
      )}

      {badge && (
        <motion.div {...fade(0.05)} className={cn("mb-5", variant === "default" && "flex justify-center")}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            {Icon && variant === "split" && <Icon className="h-4 w-4" />}
            {badge}
          </span>
        </motion.div>
      )}

      <motion.h1
        {...fade(0.1)}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance"
      >
        {title}
        {highlight && (
          <>
            {" "}
            <GradientText>{highlight}</GradientText>
          </>
        )}
      </motion.h1>

      {subtitle && (
        <motion.p
          {...fade(0.2)}
          className={cn(
            "text-lg text-muted-foreground mb-8 text-pretty",
            variant === "default" ? "max-w-2xl mx-auto" : "max-w-xl",
          )}
        >
          {subtitle}
        </motion.p>
      )}

      {actions && (
        <motion.div
          {...fade(0.3)}
          className={cn("flex flex-col sm:flex-row gap-4 mb-10", variant === "default" && "justify-center")}
        >
          {actions}
        </motion.div>
      )}

      {metrics && metrics.length > 0 && (
        <motion.div
          {...fade(0.4)}
          className={cn(
            "grid gap-6",
            metrics.length === 2 ? "grid-cols-2" : "grid-cols-3",
            variant === "default" && "max-w-2xl mx-auto",
          )}
        >
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient">
                <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )

  return (
    <section className={cn("relative pt-28 pb-16 px-4 sm:px-6 lg:px-8", className)}>
      {variant === "split" ? (
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {content}
          {media && (
            <motion.div
              initial={{ opacity: 0, x: reduced ? 0 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={getTransition(reduced, 0.7, 0.2)}
              className="relative"
            >
              {media}
            </motion.div>
          )}
        </div>
      ) : (
        content
      )}
    </section>
  )
}
