import type { Metadata } from "next"
import { MarcoSalon } from "@/demos/peine-fino/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelSalonLayout({ children }: { children: React.ReactNode }) {
  return <MarcoSalon>{children}</MarcoSalon>
}
