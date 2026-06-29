"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Cuenta desde 0 hasta `value` cuando entra en viewport (una vez).
 * Acepta sufijo/prefijo y padding con ceros. Respeta reduced-motion.
 */
export function NumberTicker({
  value,
  durationMs = 1400,
  prefix = "",
  suffix = "",
  pad = 0,
}: {
  value: number
  durationMs?: number
  prefix?: string
  suffix?: string
  pad?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setDisplay(value)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs)
          // ease-out-quint
          const eased = 1 - Math.pow(1 - t, 5)
          setDisplay(Math.round(eased * value))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, durationMs])

  const text = pad > 0 ? String(display).padStart(pad, "0") : String(display)

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {text}
      {suffix}
    </span>
  )
}
