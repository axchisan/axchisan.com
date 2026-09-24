import type { Metadata } from "next"
import { Atkinson_Hyperlegible_Next, Bricolage_Grotesque } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_CANELA } from "@/demos/canela/config"

// Tipografías de Canela, no del sitio. Razones en docs/demos/canela.md.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
})

const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Canela, clínica veterinaria (demo)", template: "%s · Canela (demo)" },
  description:
    "Demostración de Axchi: página, citas en línea y sistema clínico para una veterinaria ficticia en Bogotá.",
}

export default function CanelaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_CANELA}>
      <BarraDemo />
      <div
        className={`${bricolage.variable} ${atkinson.variable} min-h-screen bg-cn-nube font-cn-titulo text-cn-collar`}
      >
        {children}
      </div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
