import type { Metadata } from "next"
import { CabeceraSaborDeCasa } from "@/demos/sabor-de-casa/publico"
import { PedirSaborDeCasa } from "@/demos/sabor-de-casa/pedir"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"

export const metadata: Metadata = { title: "Tu pedido" }

export default function PedirPage() {
  return (
    <>
      <CabeceraSaborDeCasa />
      <main id="contenido">
        <SoloEnNivel nivel="pedidos">
          <PedirSaborDeCasa />
        </SoloEnNivel>
      </main>
    </>
  )
}
