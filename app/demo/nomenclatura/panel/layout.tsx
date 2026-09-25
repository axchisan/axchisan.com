import type { Metadata } from "next"
import { MarcoNomenclatura } from "@/demos/nomenclatura/panel"

export const metadata: Metadata = { title: "Panel" }

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <MarcoNomenclatura>{children}</MarcoNomenclatura>
}
