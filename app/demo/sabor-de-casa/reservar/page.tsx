import type { Metadata } from "next"
import { CabeceraFogon } from "@/demos/sabor-de-casa/publico"
import { ReservarFogon } from "@/demos/sabor-de-casa/reservar"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"

export const metadata: Metadata = { title: "Reservar mesa" }

export default function ReservarPage() {
  return (
    <>
      <CabeceraFogon />
      <main id="contenido">
        <SoloEnNivel nivel="sistema">
          <ReservarFogon />
        </SoloEnNivel>
      </main>
    </>
  )
}
