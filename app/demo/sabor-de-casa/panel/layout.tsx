import type { Metadata } from "next"
import { MarcoSaborDeCasa } from "@/demos/sabor-de-casa/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelSaborDeCasaLayout({ children }: { children: React.ReactNode }) {
  return <MarcoSaborDeCasa>{children}</MarcoSaborDeCasa>
}
