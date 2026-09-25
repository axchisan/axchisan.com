import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FichaInmueble } from "@/demos/nomenclatura/ficha"
import { INMUEBLES, inmueblePorId } from "@/demos/nomenclatura/modelo"
import { CabeceraNomenclatura } from "@/demos/nomenclatura/publico"

export function generateStaticParams() {
  return INMUEBLES.map((x) => ({ id: x.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: inmueblePorId(id)?.titulo ?? "Inmueble" }
}

export default async function FichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const x = inmueblePorId(id)
  if (!x) notFound()
  return (
    <>
      <CabeceraNomenclatura />
      <main id="contenido">
        <FichaInmueble key={x.id} inmueble={x} />
      </main>
    </>
  )
}
