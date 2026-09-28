import type { Metadata } from "next"
import { CabeceraFogon } from "@/demos/sabor-de-casa/publico"
import { SeguimientoFogon } from "@/demos/sabor-de-casa/seguimiento"
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
