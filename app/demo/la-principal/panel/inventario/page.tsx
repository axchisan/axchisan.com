import type { Metadata } from "next"
import { InventarioFerreteria } from "@/demos/la-principal/panel/inventario"

export const metadata: Metadata = { title: "Inventario" }

export default function Page() {
  return <InventarioFerreteria />
}
