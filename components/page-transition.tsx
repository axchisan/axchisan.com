"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useReducedMotion, getTransition } from "@/hooks/use-reduced-motion"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -12 }}
      transition={getTransition(reduced, 0.35)}
    >
      {children}
    </motion.div>
  )
}
