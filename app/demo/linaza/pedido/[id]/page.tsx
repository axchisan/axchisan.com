import type { Metadata } from "next"
import { PedidoLinaza } from "@/demos/linaza/pedido"
import { CabeceraLinaza } from "@/demos/linaza/publico"

export const metadata: Metadata = { title: "Tu pedido" }

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <CabeceraLinaza />
      <main id="contenido">
        <PedidoLinaza id={id} />
      </main>
    </>
  )
}
