import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PRENDAS, prendaPorId } from "@/demos/linaza/modelo"
import { ProductoLinaza } from "@/demos/linaza/producto"
import { CabeceraLinaza } from "@/demos/linaza/publico"

export function generateStaticParams() {
  return PRENDAS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: prendaPorId(id)?.nombre ?? "Prenda" }
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const prenda = prendaPorId(id)
  if (!prenda) notFound()
  return (
    <>
      <CabeceraLinaza />
      <main id="contenido">
        <ProductoLinaza key={prenda.id} prenda={prenda} />
      </main>
    </>
  )
}
