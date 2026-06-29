"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"

type Stat = { n: string; label: string }

const LEAD = ["Construimos", "software", "que", "se", "siente"]

export function HeroInteractive({ stats }: { stats: Stat[] }) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Parallax al scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -90])
  const y = useSpring(yRaw, { stiffness: 120, damping: 30, mass: 0.4 })
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Parallax al mouse (sutil)
  const mx = useSpring(0, { stiffness: 90, damping: 18 })
  const my = useSpring(0, { stiffness: 90, damping: 18 })

  // Fondo: constelación reactiva al cursor
  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    type P = { x: number; y: number; vx: number; vy: number }
    let pts: P[] = []
    const mouse = { x: -9999, y: -9999 }
    let raf = 0
    let running = true

    const build = () => {
      const r = section.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(90, Math.floor((w * h) / 16000))
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }))
    }

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      const MOUSE_R = 200
      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }
      // Conexiones
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > 130) continue
          const midx = (a.x + b.x) / 2
          const midy = (a.y + b.y) / 2
          const md = Math.hypot(midx - mouse.x, midy - mouse.y)
          const energy = md < MOUSE_R ? 1 - md / MOUSE_R : 0
          const base = (1 - dist / 130) * 0.12
          if (energy > 0.02) {
            ctx.strokeStyle = `rgba(198,242,78,${base + energy * 0.5})`
            ctx.lineWidth = 0.6 + energy * 0.5
          } else {
            ctx.strokeStyle = `rgba(125,134,146,${base})`
            ctx.lineWidth = 0.5
          }
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      // Puntos
      for (const p of pts) {
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        const energy = md < MOUSE_R ? 1 - md / MOUSE_R : 0
        if (energy > 0.02) {
          ctx.fillStyle = `rgba(198,242,78,${0.4 + energy * 0.6})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.4 + energy * 1.6, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = "rgba(150,160,172,0.35)"
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 16)
      my.set(((e.clientY - r.top) / r.height - 0.5) * 16)
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      mx.set(0)
      my.set(0)
    }
    const onResize = () => build()

    build()
    draw()
    section.addEventListener("pointermove", onMove)
    section.addEventListener("pointerleave", onLeave)
    window.addEventListener("resize", onResize)

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      if (running) {
        raf = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf)
      }
    })
    io.observe(section)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      section.removeEventListener("pointermove", onMove)
      section.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("resize", onResize)
      io.disconnect()
    }
  }, [reduce, mx, my])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[92vh] items-center overflow-hidden px-7 pt-24"
    >
      {/* Constelación */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1]"
      />
      {/* Glow de marca */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[20%] -z-[1] h-[640px] w-[640px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 60%)", filter: "blur(20px)" }}
      />

      <motion.div style={{ y, opacity }} className="relative z-[1] mx-auto w-full max-w-6xl">
        <div className="hero-word" style={{ ["--i" as string]: 0 }}>
          <span className="mono-label text-accent">Studio de software · Bogotá, CO</span>
        </div>

        <motion.h1
          style={{ x: mx, y: my }}
          className="mt-6 max-w-[15ch] font-display text-[clamp(42px,7.5vw,88px)] font-bold leading-[0.97] tracking-[-0.035em]"
        >
          {LEAD.map((word, i) => (
            <span key={word + i} className="hero-word mr-[0.22em]" style={{ ["--i" as string]: i + 1 }}>
              <span>{word}</span>
            </span>
          ))}
          <span className="hero-word" style={{ ["--i" as string]: LEAD.length + 1 }}>
            <span className="text-sweep">extraordinario.</span>
          </span>
        </motion.h1>

        <div className="hero-word mt-7 max-w-[52ch]" style={{ ["--i" as string]: 7 }}>
          <span className="block text-lg text-muted md:text-xl">
            Diseñamos, construimos y automatizamos productos digitales para clientes
            reales — desarrollo web, aplicaciones multiplataforma e integración de IA.
          </span>
        </div>

        <div className="hero-word mt-9" style={{ ["--i" as string]: 8 }}>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button href="/trabajo" size="lg">Ver trabajo →</Button>
            <Button href="/blog" variant="outline" size="lg">Leer el blog</Button>
          </div>
        </div>

        <dl className="hero-word mt-14 w-full" style={{ ["--i" as string]: 9 }}>
          <div className="flex flex-wrap gap-x-12 gap-y-6 border-t border-border pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-semibold">{s.n}</dt>
                <dd className="mono-label mt-1">{s.label}</dd>
              </div>
            ))}
          </div>
        </dl>
      </motion.div>

      {/* Indicador de scroll */}
      <div className="pointer-events-none absolute bottom-7 left-1/2 -z-[0] -translate-x-1/2">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1.5">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-accent" />
        </div>
      </div>
    </section>
  )
}
