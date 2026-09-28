import type { Metadata } from "next"
import { Inter_Tight, Manrope } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_BRISAS_DEL_MAR } from "@/demos/brisas-del-mar/config"
import "./orilla.css"

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["300", "400"], display: "swap" })
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "Brisas del Mar, resort frente a la bahía (demo)", template: "%s · Brisas del Mar (demo)" },
  description:
    "Demostración de Axchi: página cinematográfica para un hotel ficticio, con un recorrido en video que avanza con el scroll.",
}

export default function BrisasDelMarLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_BRISAS_DEL_MAR}>
      <BarraDemo />
      <div className={`${interTight.variable} ${manrope.variable}`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
