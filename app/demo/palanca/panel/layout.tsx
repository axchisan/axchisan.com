import type { Metadata } from "next"
import { MarcoPalanca } from "@/demos/palanca/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelPalancaLayout({ children }: { children: React.ReactNode }) {
  return <MarcoPalanca>{children}</MarcoPalanca>
}
