import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { BolsaTanda } from "@/demos/tanda/bolsa"
import { CabeceraTanda } from "@/demos/tanda/publico"

export const metadata: Metadata = { title: "Tu bolsa" }

export default function BolsaPage() {
  return (
    <>
      <CabeceraTanda />
      <main id="contenido">
        <SoloEnNivel nivel="pedidos">
          <BolsaTanda />
        </SoloEnNivel>
      </main>
    </>
  )
}
