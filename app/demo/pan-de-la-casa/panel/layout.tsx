import type { Metadata } from "next"
import { MarcoPanDeLaCasa } from "@/demos/pan-de-la-casa/panel"

export const metadata: Metadata = { title: "Panel" }

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <MarcoPanDeLaCasa>{children}</MarcoPanDeLaCasa>
}
