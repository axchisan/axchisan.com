import type { Metadata } from "next"
import { VentasFogon } from "@/demos/sabor-de-casa/panel/ventas"

export const metadata: Metadata = { title: "Ventas del día" }

export default function Page() {
  return <VentasFogon />
}
