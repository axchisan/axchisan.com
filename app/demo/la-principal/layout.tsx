import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import { Archivo } from "next/font/google"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_LA_PRINCIPAL } from "@/demos/la-principal/config"

// Una sola familia, con dos anchos. Razones en docs/demos/la-principal.md.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
})

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/la-principal"),
  title: { default: "Ferretería La Principal (demo)", template: "%s · La Principal (demo)" },
  description:
    "Demostración de Axchi: catálogo con existencias, pedidos por WhatsApp, caja, inventario con kardex, entradas de mercancía, reportes a Excel y pedido sugerido a proveedores para una ferretería ficticia.",
}

export default function LaPrincipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_LA_PRINCIPAL}>
      <BarraDemo />
      <div className={`${archivo.variable} min-h-screen bg-dr-zinc font-dr text-dr-tinta`}>{children}</div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
