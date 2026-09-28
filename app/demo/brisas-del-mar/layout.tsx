import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import localFont from "next/font/local"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_BRISAS_DEL_MAR } from "@/demos/brisas-del-mar/config"
import "./orilla.css"

const interTight = localFont({
  src: [{ path: "../../fuentes/inter-tight.woff2", weight: "300 400", style: "normal" }],
  variable: "--font-inter-tight",
  display: "swap",
})
const manrope = localFont({
  src: [{ path: "../../fuentes/manrope.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/brisas-del-mar"),
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
