import type { Metadata } from "next"
import { PedidosLinaza } from "@/demos/linaza/panel"

export const metadata: Metadata = { title: "Pedidos" }

export default function Page() {
  return <PedidosLinaza />
}
