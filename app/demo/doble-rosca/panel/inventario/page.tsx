import type { Metadata } from "next"
import { InventarioFerreteria } from "@/demos/doble-rosca/panel/inventario"

export const metadata: Metadata = { title: "Inventario" }

export default function Page() {
  return <InventarioFerreteria />
}
