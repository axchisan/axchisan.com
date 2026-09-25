import type { Metadata } from "next"
import { InventarioLinaza } from "@/demos/linaza/panel"

export const metadata: Metadata = { title: "Inventario" }

export default function Page() {
  return <InventarioLinaza />
}
