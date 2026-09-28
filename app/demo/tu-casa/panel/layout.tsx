import type { Metadata } from "next"
import { MarcoTuCasa } from "@/demos/tu-casa/panel"

export const metadata: Metadata = { title: "Panel" }

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <MarcoTuCasa>{children}</MarcoTuCasa>
}
