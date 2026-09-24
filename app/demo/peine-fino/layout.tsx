import type { Metadata } from "next"
import { Big_Shoulders, Hanken_Grotesk } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_PEINE_FINO } from "@/demos/peine-fino/config"

// Tipografías de Peine Fino, no del sitio. Razones en docs/demos/peine-fino.md.
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
})

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Peine Fino, salón y barbería (demo)", template: "%s · Peine Fino (demo)" },
  description:
    "Demostración de Axchi: página, reservas en línea y sistema de caja y clientes para un salón y barbería ficticio en Bogotá.",
}

export default function PeineFinoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_PEINE_FINO}>
      <BarraDemo />
      <div className={`${bigShoulders.variable} ${hanken.variable} min-h-screen bg-pf-porcelana font-pf-texto text-pf-tinta`}>
        {children}
      </div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
