import type { Metadata } from "next"
import { PedidosFerreteria } from "@/demos/doble-rosca/panel/pedidos"

export const metadata: Metadata = { title: "Pedidos web" }

export default function Page() {
  return <PedidosFerreteria />
}
