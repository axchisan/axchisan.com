import type { Metadata } from "next"
import { PedidosFerreteria } from "@/demos/la-principal/panel/pedidos"

export const metadata: Metadata = { title: "Pedidos web" }

export default function Page() {
  return <PedidosFerreteria />
}
