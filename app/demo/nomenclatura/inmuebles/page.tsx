import type { Metadata } from "next"
import { Suspense } from "react"
import { ListadoInmuebles } from "@/demos/nomenclatura/listado"
import { CabeceraNomenclatura } from "@/demos/nomenclatura/publico"

export const metadata: Metadata = { title: "Inmuebles" }

export default function InmueblesPage() {
  return (
    <>
      <CabeceraNomenclatura />
      <main id="contenido">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <ListadoInmuebles />
        </Suspense>
      </main>
    </>
  )
}
