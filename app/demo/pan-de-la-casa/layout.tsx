import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import { Gluten, Nunito_Sans } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_PAN_DE_LA_CASA } from "@/demos/pan-de-la-casa/config"

// Tipografías de Pan de la Casa, no del sitio. Razones en docs/demos/pan-de-la-casa.md.
const gluten = Gluten({ variable: "--font-gluten", subsets: ["latin"], display: "swap" })
const nunito = Nunito_Sans({ variable: "--font-nunito-sans", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/pan-de-la-casa"),
  title: { default: "Pan de la Casa, panadería y café (demo)", template: "%s · Pan de la Casa (demo)" },
  description:
    "Demostración de Axchi: vitrina con horneadas y disponibilidad en vivo, pedidos para recoger o a domicilio, encargos de tortas con anticipo y plan de producción para una panadería ficticia en Bucaramanga.",
}

export default function PanDeLaCasaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_PAN_DE_LA_CASA}>
      <BarraDemo />
      <div className={`${gluten.variable} ${nunito.variable} min-h-screen bg-ta-blanco font-ta-texto text-ta-cacao`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
