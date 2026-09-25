import type { Metadata } from "next"
import { ListaFerreteria } from "@/demos/doble-rosca/lista"
import { CabeceraFerreteria } from "@/demos/doble-rosca/publico"

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
