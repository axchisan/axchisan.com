"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Intensidad máxima de rotación en grados */
  intensity?: number
  /** Mostrar glow que sigue al cursor */
  glow?: boolean
}

/**
 * Card con tilt 3D y glow que sigue al cursor. Solo anima transform/opacity.
 * Se desactiva en touch y con reduced-motion (render estático).
 */
export function TiltCard({ children, className, intensity = 8, glow = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()

  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const sx = useSpring(x, { stiffness: 150, damping: 20 })
  const sy = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity])
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity])
  const glowX = useTransform(sx, [0, 1], ["0%", "100%"])
  const glowY = useTransform(sy, [0, 1], ["0%", "100%"])
  const glowBg = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, hsl(var(--primary) / 0.18), transparent 70%)`

  const disabled = reduced || isMobile

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  if (disabled) {
    return <div className={cn("relative", className)}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }}
      className={cn("group relative", className)}
    >
      {glow && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBg }}
        />
      )}
      {children}
    </motion.div>
  )
}
