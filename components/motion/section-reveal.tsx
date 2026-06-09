"use client"

import { motion } from "framer-motion"
import type { ElementType, ReactNode } from "react"
import { useReducedMotion, getTransition } from "@/hooks/use-reduced-motion"

interface SectionRevealProps {
  children: ReactNode
  className?: string
  /** Desplazamiento vertical inicial en px */
  y?: number
  /** Retardo en segundos */
  delay?: number
  /** Duración en segundos */
  duration?: number
  /** Si true, anima en cascada a los hijos directos */
  stagger?: boolean
  /** Retardo entre hijos cuando stagger está activo */
  staggerDelay?: number
  as?: ElementType
  /** Margen del viewport para disparar antes/después */
  amount?: number
}

/**
 * Wrapper centralizado de reveal-on-scroll. Usa whileInView (IntersectionObserver
 * internamente) con once:true. Solo anima opacity/transform. Degrada con reduced-motion.
 */
export function SectionReveal({
  children,
  className,
  y = 24,
  delay = 0,
  duration = 0.6,
  stagger = false,
  staggerDelay = 0.1,
  as = "div",
  amount = 0.2,
}: SectionRevealProps) {
  const reduced = useReducedMotion()
  const MotionTag = motion(as as ElementType)

  if (stagger) {
    return (
      <MotionTag
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduced ? 0 : staggerDelay, delayChildren: delay } },
        }}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={getTransition(reduced, duration, delay)}
    >
      {children}
    </MotionTag>
  )
}

/** Item para usar dentro de un SectionReveal con stagger. */
export function SectionRevealItem({
  children,
  className,
  y = 24,
  as = "div",
}: {
  children: ReactNode
  className?: string
  y?: number
  as?: ElementType
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion(as as ElementType)
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : y },
        visible: { opacity: 1, y: 0, transition: getTransition(reduced) },
      }}
    >
      {children}
    </MotionTag>
  )
}
