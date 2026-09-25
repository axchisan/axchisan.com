import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { MisClasesPalanca } from "@/demos/palanca/mis-clases"
import { CabeceraPalanca } from "@/demos/palanca/publico"

export const metadata: Metadata = { title: "Mis clases" }

export default async function MisClasesPage({ searchParams }: { searchParams: Promise<{ documento?: string }> }) {
  const { documento } = await searchParams
  return (
    <>
      <CabeceraPalanca />
      <main id="contenido">
        <SoloEnNivel nivel="reservas">
          <MisClasesPalanca documentoInicial={documento} />
        </SoloEnNivel>
      </main>
    </>
  )
}
