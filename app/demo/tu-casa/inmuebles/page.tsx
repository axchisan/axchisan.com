import type { Metadata } from "next"
import { Suspense } from "react"
import { ListadoInmuebles } from "@/demos/tu-casa/listado"
import { CabeceraTuCasa } from "@/demos/tu-casa/publico"

export const metadata: Metadata = { title: "Inmuebles" }

export default function InmueblesPage() {
  return (
    <>
      <CabeceraTuCasa />
      <main id="contenido">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <ListadoInmuebles />
        </Suspense>
      </main>
    </>
  )
}
