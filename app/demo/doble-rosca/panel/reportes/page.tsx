import type { Metadata } from "next"
import { ReportesFerreteria } from "@/demos/doble-rosca/panel/reportes"

export const metadata: Metadata = { title: "Reportes" }

export default function Page() {
  return <ReportesFerreteria />
}
