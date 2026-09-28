import type { Metadata } from "next"
import { CabeceraSaborDeCasa } from "@/demos/sabor-de-casa/publico"
import { ReservarSaborDeCasa } from "@/demos/sabor-de-casa/reservar"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"

export const metadata: Metadata = { title: "Reservar mesa" }

export default function ReservarPage() {
  return (
    <>
      <CabeceraSaborDeCasa />
      <main id="contenido">
        <SoloEnNivel nivel="sistema">
          <ReservarSaborDeCasa />
        </SoloEnNivel>
      </main>
    </>
  )
}
