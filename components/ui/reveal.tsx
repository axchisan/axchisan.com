"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Aparición sutil al entrar en viewport, SSR-safe.
 * Visible por defecto (sin JS / antes de hidratar no hay flash de contenido
 * invisible). La animación es una mejora progresiva: solo oculta+revela una vez
 * que el componente montó en cliente y se observa la intersección.
 * Respeta prefers-reduced-motion (solo opacidad, sin desplazamiento).
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return
    const el = ref.current
    if (!el) return
    setArmed(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hidden = armed && !shown

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? `translateY(${y}px)` : "none",
        transition: `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
        willChange: hidden ? "opacity, transform" : undefined,
      }}
    >
      {children}
    </div>
  )
}
