import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import localFont from "next/font/local"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_SABOR_DE_CASA } from "@/demos/sabor-de-casa/config"

// Tipografías de Sabor de Casa, no del sitio. Razones en docs/demos/sabor-de-casa.md.
const alfaSlab = localFont({
  src: [{ path: "../../fuentes/alfa-slab-one.woff2", weight: "400", style: "normal" }],
  variable: "--font-alfa-slab",
  display: "swap",
})

const figtree = localFont({
  src: [{ path: "../../fuentes/figtree.woff2", weight: "300 900", style: "normal" }],
  variable: "--font-figtree",
  display: "swap",
})

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/sabor-de-casa"),
  title: { default: "Sabor de Casa, cocina colombiana (demo)", template: "%s · Sabor de Casa (demo)" },
  description:
    "Demostración de Axchi: carta digital con QR, pedidos a la mesa, para recoger y a domicilio, reservas y panel de cocina para un restaurante ficticio en Bogotá.",
}

export default function SaborDeCasaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_SABOR_DE_CASA}>
      <BarraDemo />
      <div className={`${alfaSlab.variable} ${figtree.variable} min-h-screen bg-fg-peltre font-fg-texto text-fg-tizne`}>
        {children}
      </div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
