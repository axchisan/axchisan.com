import type { Metadata } from "next"
import { Inter_Tight, Manrope } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_ORILLA } from "@/demos/orilla/config"
import "./orilla.css"

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["300", "400"], display: "swap" })
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "Orilla, resort frente a la bahía (demo)", template: "%s · Orilla (demo)" },
  description:
    "Demostración de Axchi: página cinematográfica para un hotel ficticio, con un recorrido en video que avanza con el scroll.",
}

export default function OrillaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_ORILLA}>
      <BarraDemo />
      <div className={`${interTight.variable} ${manrope.variable}`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
