"use client"

import { useReducedMotion as useFramerReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"

/**
 * Re-exporta el detector de prefers-reduced-motion de framer-motion y expone
 * helpers para degradar animaciones a estado estático de forma centralizada.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}

/** Variants de reveal (fade + translateY). Si reduced, solo opacidad sin desplazamiento. */
export function getRevealVariants(reduced: boolean, distance = 24): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    visible: { opacity: 1, y: 0 },
  }
}

/** Transición estándar; instantánea cuando reduced. */
export function getTransition(reduced: boolean, duration = 0.6, delay = 0) {
  return reduced
    ? { duration: 0 }
    : { duration, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
}
