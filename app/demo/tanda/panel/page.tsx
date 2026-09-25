import type { Metadata } from "next"
import { PedidosTanda } from "@/demos/tanda/panel"

export const metadata: Metadata = { title: "Pedidos" }

export default function Page() {
  return <PedidosTanda />
}
