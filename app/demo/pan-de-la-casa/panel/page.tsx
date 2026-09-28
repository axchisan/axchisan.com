import type { Metadata } from "next"
import { PedidosPanDeLaCasa } from "@/demos/pan-de-la-casa/panel"

export const metadata: Metadata = { title: "Pedidos" }

export default function Page() {
  return <PedidosPanDeLaCasa />
}
