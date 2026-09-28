import type { Metadata } from "next"
import { MarcoPanel } from "@/demos/cafe-del-barrio/panel"

export const metadata: Metadata = { title: "Panel" }

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="contenido">
      <MarcoPanel>{children}</MarcoPanel>
    </main>
  )
}
