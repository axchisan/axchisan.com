import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { MisClasesTitanGym } from "@/demos/titan-gym/mis-clases"
import { CabeceraTitanGym } from "@/demos/titan-gym/publico"

export const metadata: Metadata = { title: "Mis clases" }

export default async function MisClasesPage({ searchParams }: { searchParams: Promise<{ documento?: string }> }) {
  const { documento } = await searchParams
  return (
    <>
      <CabeceraTitanGym />
      <main id="contenido">
        <SoloEnNivel nivel="reservas">
          <MisClasesTitanGym documentoInicial={documento} />
        </SoloEnNivel>
      </main>
    </>
  )
}
