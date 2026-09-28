import type { Metadata } from "next"
import { Alfa_Slab_One, Figtree } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_FOGON } from "@/demos/sabor-de-casa/config"

// Tipografías de Sabor de Casa, no del sitio. Razones en docs/demos/sabor-de-casa.md.
const alfaSlab = Alfa_Slab_One({
  variable: "--font-alfa-slab",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Sabor de Casa, cocina colombiana (demo)", template: "%s · Sabor de Casa (demo)" },
  description:
    "Demostración de Axchi: carta digital con QR, pedidos a la mesa, para recoger y a domicilio, reservas y panel de cocina para un restaurante ficticio en Bogotá.",
}

export default function FogonLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_FOGON}>
      <BarraDemo />
      <div className={`${alfaSlab.variable} ${figtree.variable} min-h-screen bg-fg-peltre font-fg-texto text-fg-tizne`}>
        {children}
      </div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
