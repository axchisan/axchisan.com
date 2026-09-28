import type { Metadata } from "next"
import { MarcoSonrisaClara } from "@/demos/sonrisa-clara/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelSonrisaClaraLayout({ children }: { children: React.ReactNode }) {
  return <MarcoSonrisaClara>{children}</MarcoSonrisaClara>
}
