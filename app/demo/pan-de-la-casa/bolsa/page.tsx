import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { BolsaPanDeLaCasa } from "@/demos/pan-de-la-casa/bolsa"
import { CabeceraPanDeLaCasa } from "@/demos/pan-de-la-casa/publico"

export const metadata: Metadata = { title: "Tu bolsa" }

export default function BolsaPage() {
  return (
    <>
      <CabeceraPanDeLaCasa />
      <main id="contenido">
        <SoloEnNivel nivel="pedidos">
          <BolsaPanDeLaCasa />
        </SoloEnNivel>
      </main>
    </>
  )
}
