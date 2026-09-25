import type { Metadata } from "next"
import { Gluten, Nunito_Sans } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_TANDA } from "@/demos/tanda/config"

// Tipografías de Tanda, no del sitio. Razones en docs/demos/tanda.md.
const gluten = Gluten({ variable: "--font-gluten", subsets: ["latin"], display: "swap" })
const nunito = Nunito_Sans({ variable: "--font-nunito-sans", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "Tanda, panadería y café (demo)", template: "%s · Tanda (demo)" },
  description:
    "Demostración de Axchi: vitrina con horneadas y disponibilidad en vivo, pedidos para recoger o a domicilio, encargos de tortas con anticipo y plan de producción para una panadería ficticia en Bucaramanga.",
}

export default function TandaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_TANDA}>
      <BarraDemo />
      <div className={`${gluten.variable} ${nunito.variable} min-h-screen bg-ta-blanco font-ta-texto text-ta-cacao`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
