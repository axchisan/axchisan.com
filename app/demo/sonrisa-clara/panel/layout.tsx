import type { Metadata } from "next"
import { MarcoMolar } from "@/demos/sonrisa-clara/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelMolarLayout({ children }: { children: React.ReactNode }) {
  return <MarcoMolar>{children}</MarcoMolar>
}
