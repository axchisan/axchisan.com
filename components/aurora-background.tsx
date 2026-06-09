"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/**
 * Fondo aurora premium reactivo al scroll. Reemplaza el canvas de partículas.
 * Capas mesh blur posicionadas fixed; parallax multicapa con useScroll/useTransform.
 * Solo anima transform/opacity. Respeta prefers-reduced-motion.
 */
export function AuroraBackground() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Parallax sutil: cada capa se desplaza a distinta velocidad
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "28%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-22%"])
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "16%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 0.7])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
      {/* Grano/grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.25) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.25) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />

      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 will-change-transform">
        <div
          className="absolute -top-1/4 left-[5%] h-[55vh] w-[55vh] rounded-full blur-[110px] animate-aurora"
          style={{ background: "hsl(var(--aurora-1) / 0.5)" }}
        />
      </motion.div>

      <motion.div style={{ y: y2, opacity }} className="absolute inset-0 will-change-transform">
        <div
          className="absolute top-[10%] right-[8%] h-[50vh] w-[50vh] rounded-full blur-[120px] animate-aurora [animation-delay:-6s]"
          style={{ background: "hsl(var(--aurora-2) / 0.45)" }}
        />
      </motion.div>

      <motion.div style={{ y: y3, opacity }} className="absolute inset-0 will-change-transform">
        <div
          className="absolute bottom-[-10%] left-[35%] h-[45vh] w-[45vh] rounded-full blur-[120px] animate-aurora [animation-delay:-12s]"
          style={{ background: "hsl(var(--aurora-3) / 0.4)" }}
        />
      </motion.div>

      {/* Viñeta para asentar el contenido */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 0%, transparent 40%, hsl(var(--background) / 0.6) 100%)",
        }}
      />
    </div>
  )
}
