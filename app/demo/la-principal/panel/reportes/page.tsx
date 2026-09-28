import type { Metadata } from "next"
import { ReportesFerreteria } from "@/demos/la-principal/panel/reportes"

export const metadata: Metadata = { title: "Reportes" }

export default function Page() {
  return <ReportesFerreteria />
}
