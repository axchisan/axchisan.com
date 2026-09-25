import type { Metadata } from "next"
import { CabeceraFogon } from "@/demos/fogon-45/publico"
import { SeguimientoFogon } from "@/demos/fogon-45/seguimiento"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"

export const metadata: Metadata = { title: "Tu pedido" }

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <CabeceraFogon />
      <main id="contenido">
        <SoloEnNivel nivel="pedidos">
          <SeguimientoFogon id={id} />
        </SoloEnNivel>
      </main>
    </>
  )
}
