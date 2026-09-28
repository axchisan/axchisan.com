import type { Metadata } from "next"
import { MarcoSalon } from "@/demos/look-y-estilo/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelSalonLayout({ children }: { children: React.ReactNode }) {
  return <MarcoSalon>{children}</MarcoSalon>
}
