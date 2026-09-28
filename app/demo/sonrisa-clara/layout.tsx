import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import { Onest } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_SONRISA_CLARA } from "@/demos/sonrisa-clara/config"

// Una sola familia. Razones en docs/demos/sonrisa-clara.md.
const onest = Onest({ variable: "--font-onest", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/sonrisa-clara"),
  title: { default: "Sonrisa Clara, odontología (demo)", template: "%s · Sonrisa Clara (demo)" },
  description:
    "Demostración de Axchi: página, citas en línea por motivo y odontólogo, odontograma interactivo, plan de tratamiento con presupuesto y abonos para un consultorio odontológico ficticio.",
}

export default function SonrisaClaraLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_SONRISA_CLARA}>
      <BarraDemo />
      <div className={`${onest.variable} min-h-screen bg-mo-fondo font-mo text-mo-tinta`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
