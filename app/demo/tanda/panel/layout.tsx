import type { Metadata } from "next"
import { MarcoTanda } from "@/demos/tanda/panel"

export const metadata: Metadata = { title: "Panel" }

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <MarcoTanda>{children}</MarcoTanda>
}
