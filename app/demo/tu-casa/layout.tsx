import type { Metadata } from "next"
import { Schibsted_Grotesk } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_TU_CASA } from "@/demos/tu-casa/config"

// Una sola familia. Razones en docs/demos/tu-casa.md.
const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "Tu Casa Inmobiliaria (demo)", template: "%s · Tu Casa Inmobiliaria (demo)" },
  description:
    "Demostración de Axchi: inmuebles con filtros y mapa, ficha con simulador de crédito, visitas agendadas en línea y panel de inmuebles, interesados y visitas para una inmobiliaria ficticia en Medellín.",
}

export default function TuCasaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_TU_CASA}>
      <BarraDemo />
      <div className={`${schibsted.variable} min-h-screen bg-nm-fondo font-nm text-nm-tinta`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
