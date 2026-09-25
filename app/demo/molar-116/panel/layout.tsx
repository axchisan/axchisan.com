import type { Metadata } from "next"
import { MarcoMolar } from "@/demos/molar-116/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelMolarLayout({ children }: { children: React.ReactNode }) {
  return <MarcoMolar>{children}</MarcoMolar>
}
