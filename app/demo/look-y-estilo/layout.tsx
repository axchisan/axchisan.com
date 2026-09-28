import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import { Big_Shoulders, Hanken_Grotesk } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_LOOK_Y_ESTILO } from "@/demos/look-y-estilo/config"

// Tipografías de Look & Estilo, no del sitio. Razones en docs/demos/look-y-estilo.md.
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
  ...tarjetaDeDemo("/demo/look-y-estilo"),
  title: { default: "Look & Estilo, salón y barbería (demo)", template: "%s · Look & Estilo (demo)" },
  description:
    "Demostración de Axchi: página, reservas en línea y sistema de caja y clientes para un salón y barbería ficticio en Bogotá.",
}

export default function LookYEstiloLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_LOOK_Y_ESTILO}>
      <BarraDemo />
      <div className={`${bigShoulders.variable} ${hanken.variable} min-h-screen bg-pf-porcelana font-pf-texto text-pf-tinta`}>
        {children}
      </div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
