"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useMotionValue, animate } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  /** Valor numérico final */
  value: number
  /** Texto antes del número (ej. "+") */
  prefix?: string
  /** Texto después del número (ej. "+", "%", "h") */
  suffix?: string
  duration?: number
  className?: string
}

/**
 * Cuenta de 0 al valor objetivo cuando entra en viewport.
 * Con reduced-motion muestra el valor final directamente.
 */
export function AnimatedCounter({ value, prefix = "", suffix = "", duration = 1.6, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()
  const motionValue = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(value)
      return
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, reduced, value, duration, motionValue])

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
