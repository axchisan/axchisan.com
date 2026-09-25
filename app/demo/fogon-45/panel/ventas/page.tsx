import type { Metadata } from "next"
import { VentasFogon } from "@/demos/fogon-45/panel/ventas"

export const metadata: Metadata = { title: "Ventas del día" }

export default function Page() {
  return <VentasFogon />
}
