import type { Metadata } from "next"
import { CabeceraFogon } from "@/demos/fogon-45/publico"
import { ReservarFogon } from "@/demos/fogon-45/reservar"
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
