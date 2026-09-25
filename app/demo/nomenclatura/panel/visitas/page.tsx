import type { Metadata } from "next"
import { VisitasPanel } from "@/demos/nomenclatura/panel"

export const metadata: Metadata = { title: "Visitas" }

export default function Page() {
  return <VisitasPanel />
}
