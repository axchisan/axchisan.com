import type { Metadata } from "next"
import { Onest } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_MOLAR } from "@/demos/molar-116/config"

// Una sola familia. Razones en docs/demos/molar-116.md.
const onest = Onest({ variable: "--font-onest", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "Molar 116, odontología (demo)", template: "%s · Molar 116 (demo)" },
  description:
    "Demostración de Axchi: página, citas en línea por motivo y odontólogo, odontograma interactivo, plan de tratamiento con presupuesto y abonos para un consultorio odontológico ficticio.",
}

export default function MolarLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_MOLAR}>
      <BarraDemo />
      <div className={`${onest.variable} min-h-screen bg-mo-fondo font-mo text-mo-tinta`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
