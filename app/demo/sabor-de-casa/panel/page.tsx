import type { Metadata } from "next"
import { PedidosSaborDeCasa } from "@/demos/sabor-de-casa/panel/pedidos"

export const metadata: Metadata = { title: "Pedidos" }

export default function Page() {
  return <PedidosSaborDeCasa />
}
