import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_DOBLE_ROSCA } from "@/demos/doble-rosca/config"

// Una sola familia, con dos anchos. Razones en docs/demos/doble-rosca.md.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Ferretería Doble Rosca (demo)", template: "%s · Doble Rosca (demo)" },
  description:
    "Demostración de Axchi: catálogo con existencias, pedidos por WhatsApp, caja, inventario con kardex, entradas de mercancía, reportes a Excel y pedido sugerido a proveedores para una ferretería ficticia.",
}

export default function DobleRoscaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_DOBLE_ROSCA}>
      <BarraDemo />
      <div className={`${archivo.variable} min-h-screen bg-dr-zinc font-dr text-dr-tinta`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
