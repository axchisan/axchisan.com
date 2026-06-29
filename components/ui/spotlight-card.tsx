"use client"

import Link from "next/link"
import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Tarjeta-link con spotlight que sigue el cursor (glow lima) + borde que se
 * ilumina al hover. El glow se mueve actualizando --mx/--my en el elemento
 * (no en un padre) para no recalcular estilos de los hijos.
 */
export function SpotlightCard({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      className={cn(
        "spotlight group relative block overflow-hidden rounded-2xl border border-border bg-surface transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-accent/30",
        className,
      )}
    >
      {children}
    </Link>
  )
}
