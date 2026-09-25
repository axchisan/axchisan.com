import type { Metadata } from "next"
import { Familjen_Grotesk } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_LINAZA } from "@/demos/linaza/config"

// Una sola familia. Razones en docs/demos/linaza.md.
const familjen = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Linaza, lino y algodón (demo)", template: "%s · Linaza (demo)" },
  description:
    "Demostración de Axchi: tienda en línea de ropa con tallas y colores, guía de tallas, bolsa, envío por ciudad, pago con PSE, Nequi o tarjeta, y panel de pedidos e inventario por talla.",
}

export default function LinazaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_LINAZA}>
      <BarraDemo />
      <div className={`${familjen.variable} min-h-screen bg-li-blanco font-li text-li-tinta`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
