import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import localFont from "next/font/local"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_TITAN_GYM } from "@/demos/titan-gym/config"

// Tipografías de Titán Gym, no del sitio. Razones en docs/demos/titan-gym.md.
const anybody = localFont({
  src: [{ path: "../../fuentes/anybody.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-anybody",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "50% 150%" }],
})
const publicSans = localFont({
  src: [{ path: "../../fuentes/public-sans.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-public-sans",
  display: "swap",
})

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/titan-gym"),
  title: { default: "Titán Gym, entrenamiento funcional (demo)", template: "%s · Titán Gym (demo)" },
  description:
    "Demostración de Axchi: horario de clases con cupos, reservas con lista de espera, membresías con vencimiento, asistencia y ocupación para un centro de entrenamiento ficticio en Cali.",
}

export default function TitanGymLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_TITAN_GYM}>
      <BarraDemo />
      <div className={`${anybody.variable} ${publicSans.variable} min-h-screen bg-pa-tiza font-pa-texto text-pa-hierro`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
