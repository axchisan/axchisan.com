import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Agendar } from "@/demos/canela/agendar"
import { CabeceraCanela } from "@/demos/canela/publico"

export const metadata: Metadata = { title: "Agendar cita" }

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string }>
}) {
  const { servicio } = await searchParams
  return (
    <>
      <CabeceraCanela />
      <main id="contenido">
        <SoloEnNivel nivel="citas">
          <Agendar servicioInicial={servicio} />
        </SoloEnNivel>
      </main>
    </>
  )
}
