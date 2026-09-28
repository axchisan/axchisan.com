import type { Metadata } from "next"
import { VisitasPanel } from "@/demos/tu-casa/panel"

export const metadata: Metadata = { title: "Visitas" }

export default function Page() {
  return <VisitasPanel />
}
