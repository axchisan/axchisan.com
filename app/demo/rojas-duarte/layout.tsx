import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import localFont from "next/font/local"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_ROJAS_DUARTE } from "@/demos/rojas-duarte/config"

// Serif para los títulos y una sans sobria para el texto. Razones en docs/demos/rojas-duarte.md.
const newsreader = localFont({
  src: [
    { path: "../../fuentes/newsreader-italica.woff2", weight: "200 800", style: "italic" },
    { path: "../../fuentes/newsreader.woff2", weight: "200 800", style: "normal" },
  ],
  variable: "--font-newsreader",
  display: "swap",
})
const instrument = localFont({
  src: [{ path: "../../fuentes/instrument-sans.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-instrument-sans",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "100%" }],
})

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/rojas-duarte"),
  title: { default: "Rojas & Duarte, abogados y contadores (demo)", template: "%s · Rojas & Duarte (demo)" },
  description:
    "Demostración de Axchi: página de una firma ficticia de abogados y contadores en Bogotá, con páginas por área, calculadora de liquidación laboral, verificador de declaración de renta y formulario de consulta.",
}

export default function RojasDuarteLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_ROJAS_DUARTE}>
      <BarraDemo />
      <div className={`${newsreader.variable} ${instrument.variable} min-h-screen bg-rd-papel font-rd-texto text-rd-tinta`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
