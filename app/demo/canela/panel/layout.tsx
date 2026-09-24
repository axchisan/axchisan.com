import type { Metadata } from "next"
import { MarcoPanel } from "@/demos/canela/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <MarcoPanel>{children}</MarcoPanel>
}
