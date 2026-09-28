import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { CabeceraSalon } from "@/demos/look-y-estilo/publico"
import { Reservar } from "@/demos/look-y-estilo/reservar"

export const metadata: Metadata = { title: "Reservar" }

export default async function ReservarPage({
  searchParams,
}: {
  searchParams: Promise<{ servicios?: string; profesional?: string }>
}) {
  const { servicios, profesional } = await searchParams
  return (
    <>
      <CabeceraSalon />
      <main id="contenido">
        <SoloEnNivel nivel="citas">
          <Reservar serviciosIniciales={servicios} profesionalInicial={profesional} />
        </SoloEnNivel>
      </main>
    </>
  )
}
