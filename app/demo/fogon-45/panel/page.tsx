import type { Metadata } from "next"
import { PedidosFogon } from "@/demos/fogon-45/panel/pedidos"

export const metadata: Metadata = { title: "Pedidos" }

export default function Page() {
  return <PedidosFogon />
}
