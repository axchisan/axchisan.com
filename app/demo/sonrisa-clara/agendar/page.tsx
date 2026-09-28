import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { AgendarSonrisaClara } from "@/demos/sonrisa-clara/agendar"
import { CabeceraSonrisaClara } from "@/demos/sonrisa-clara/publico"

export const metadata: Metadata = { title: "Agendar cita" }

export default async function AgendarPage({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const { motivo } = await searchParams
  return (
    <>
      <CabeceraSonrisaClara />
      <main id="contenido">
        <SoloEnNivel nivel="citas">
          <AgendarSonrisaClara motivoInicial={motivo} />
        </SoloEnNivel>
      </main>
    </>
  )
}
