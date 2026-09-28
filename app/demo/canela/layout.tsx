import type { Metadata } from "next"
import { tarjetaDeDemo } from "@/lib/metadatos"
import localFont from "next/font/local"
import { BarraDemo } from "@/demos/comun/barra-demo"
import { DemoProvider } from "@/demos/comun/contexto"
import { PanelRecorrido } from "@/demos/comun/recorrido"
import { CONFIG_CANELA } from "@/demos/canela/config"

// Tipografías de Canela, no del sitio. Razones en docs/demos/canela.md.
const bricolage = localFont({
  src: [{ path: "../../fuentes/bricolage-grotesque.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-bricolage",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
})

const atkinson = localFont({
  src: [{ path: "../../fuentes/atkinson-hyperlegible-next.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-atkinson",
  display: "swap",
})

export const metadata: Metadata = {
  ...tarjetaDeDemo("/demo/canela"),
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
