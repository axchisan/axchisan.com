import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { AgendarMolar } from "@/demos/molar-116/agendar"
import { CabeceraMolar } from "@/demos/molar-116/publico"

export const metadata: Metadata = { title: "Agendar cita" }

export default async function AgendarPage({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const { motivo } = await searchParams
  return (
    <>
      <CabeceraMolar />
      <main id="contenido">
        <SoloEnNivel nivel="citas">
          <AgendarMolar motivoInicial={motivo} />
        </SoloEnNivel>
      </main>
    </>
  )
}
