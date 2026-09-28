import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import localFont from "next/font/local"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_PAN_DE_LA_CASA } from "@/demos/pan-de-la-casa/config"

// Tipografías de Pan de la Casa, no del sitio. Razones en docs/demos/pan-de-la-casa.md.
const gluten = localFont({
  src: [{ path: "../../fuentes/gluten.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-gluten",
  display: "swap",
})
const nunito = localFont({
  src: [{ path: "../../fuentes/nunito-sans.woff2", weight: "200 1000", style: "normal" }],
  variable: "--font-nunito-sans",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "100%" }],
})

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
