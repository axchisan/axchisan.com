import type { Metadata } from "next"
import { Anybody, Public_Sans } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_PALANCA } from "@/demos/palanca/config"

// Tipografías de Palanca, no del sitio. Razones en docs/demos/palanca.md.
const anybody = Anybody({ variable: "--font-anybody", subsets: ["latin"], axes: ["wdth"], display: "swap" })
const publicSans = Public_Sans({ variable: "--font-public-sans", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "Palanca, entrenamiento funcional (demo)", template: "%s · Palanca (demo)" },
  description:
    "Demostración de Axchi: horario de clases con cupos, reservas con lista de espera, membresías con vencimiento, asistencia y ocupación para un centro de entrenamiento ficticio en Cali.",
}

export default function PalancaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_PALANCA}>
      <BarraDemo />
      <div className={`${anybody.variable} ${publicSans.variable} min-h-screen bg-pa-tiza font-pa-texto text-pa-hierro`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
