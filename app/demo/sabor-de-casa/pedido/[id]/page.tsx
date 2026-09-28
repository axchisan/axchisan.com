import type { Metadata } from "next"
import { CabeceraSaborDeCasa } from "@/demos/sabor-de-casa/publico"
import { SeguimientoSaborDeCasa } from "@/demos/sabor-de-casa/seguimiento"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"

export const metadata: Metadata = { title: "Tu pedido" }

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <CabeceraSaborDeCasa />
      <main id="contenido">
        <SoloEnNivel nivel="pedidos">
          <SeguimientoSaborDeCasa id={id} />
        </SoloEnNivel>
      </main>
    </>
  )
}
