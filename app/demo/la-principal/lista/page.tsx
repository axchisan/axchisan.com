import type { Metadata } from "next"
import { ListaFerreteria } from "@/demos/la-principal/lista"
import { CabeceraFerreteria } from "@/demos/la-principal/publico"

export const metadata: Metadata = { title: "Mi lista" }

export default function ListaPage() {
  return (
    <>
      <CabeceraFerreteria />
      <main id="contenido">
        <ListaFerreteria />
      </main>
    </>
  )
}
