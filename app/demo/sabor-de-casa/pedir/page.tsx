import type { Metadata } from "next"
import { CabeceraFogon } from "@/demos/sabor-de-casa/publico"
import { PedirFogon } from "@/demos/sabor-de-casa/pedir"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"

export const metadata: Metadata = { title: "Tu pedido" }

export default function PedirPage() {
  return (
    <>
      <CabeceraFogon />
      <main id="contenido">
        <SoloEnNivel nivel="pedidos">
          <PedirFogon />
        </SoloEnNivel>
      </main>
    </>
  )
}
