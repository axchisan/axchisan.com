import type { Metadata } from "next"
import { Schibsted_Grotesk } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_NOMENCLATURA } from "@/demos/nomenclatura/config"

// Una sola familia. Razones en docs/demos/nomenclatura.md.
const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "Nomenclatura, finca raíz (demo)", template: "%s · Nomenclatura (demo)" },
  description:
    "Demostración de Axchi: inmuebles con filtros y mapa, ficha con simulador de crédito, visitas agendadas en línea y panel de inmuebles, interesados y visitas para una inmobiliaria ficticia en Medellín.",
}

export default function NomenclaturaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_NOMENCLATURA}>
      <BarraDemo />
      <div className={`${schibsted.variable} min-h-screen bg-nm-fondo font-nm text-nm-tinta`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
