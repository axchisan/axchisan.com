import type { Metadata } from "next"
import { MarcoFogon } from "@/demos/sabor-de-casa/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelFogonLayout({ children }: { children: React.ReactNode }) {
  return <MarcoFogon>{children}</MarcoFogon>
}
