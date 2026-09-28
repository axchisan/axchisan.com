import type { Metadata } from "next"
import { MarcoFerreteria } from "@/demos/la-principal/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelFerreteriaLayout({ children }: { children: React.ReactNode }) {
  return <MarcoFerreteria>{children}</MarcoFerreteria>
}
