import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import localFont from "next/font/local"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_CAFE_DEL_BARRIO } from "@/demos/cafe-del-barrio/config"
import { Vistas } from "@/demos/cafe-del-barrio/publico"

// Serif con carácter para la marca y una sans redonda para leer. Razones en docs/demos/cafe-del-barrio.md.
const youngSerif = localFont({
  src: [{ path: "../../fuentes/young-serif.woff2", weight: "400", style: "normal" }],
  variable: "--font-young-serif",
  display: "swap",
})
const outfit = localFont({
  src: [{ path: "../../fuentes/outfit.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/cafe-del-barrio"),
  title: { default: "Café del Barrio, programa de puntos (demo)", template: "%s · Café del Barrio (demo)" },
  description:
    "Demostración de Axchi: app de puntos, sellos y cupones para los clientes de un café ficticio en Pereira, con caja para sumar puntos y cobrar cupones, y panel con clientes y campañas.",
  manifest: "/demo/cafe-del-barrio/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Café del Barrio", statusBarStyle: "black-translucent" },
  icons: { apple: "/demos/cafe-del-barrio/apple-icon.png" },
}

export default function CafeDelBarrioLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider config={CONFIG_CAFE_DEL_BARRIO}>
      <BarraDemo />
      <div className={`${youngSerif.variable} ${outfit.variable} min-h-screen bg-cb-fondo font-cb text-cb-tinta`}>
        <Vistas />
        {children}
      </div>
      <PanelRecorrido />
    </DemoProvider>
  )
}
