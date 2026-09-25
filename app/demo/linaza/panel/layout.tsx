import type { Metadata } from "next"
import { MarcoLinaza } from "@/demos/linaza/panel"

export const metadata: Metadata = { title: "Panel" }

export default function PanelLinazaLayout({ children }: { children: React.ReactNode }) {
  return <MarcoLinaza>{children}</MarcoLinaza>
}
