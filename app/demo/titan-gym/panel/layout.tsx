import type { Metadata } from "next"
import { MarcoTitanGym } from "@/demos/titan-gym/panel/marco"

export const metadata: Metadata = { title: "Panel" }

export default function PanelTitanGymLayout({ children }: { children: React.ReactNode }) {
  return <MarcoTitanGym>{children}</MarcoTitanGym>
}
