import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { CabeceraSalon } from "@/demos/peine-fino/publico"
import { Reservar } from "@/demos/peine-fino/reservar"

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
