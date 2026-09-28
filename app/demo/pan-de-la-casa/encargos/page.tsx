import type { Metadata } from "next"
import { EncargosPanDeLaCasa } from "@/demos/pan-de-la-casa/encargos"
import { CabeceraPanDeLaCasa } from "@/demos/pan-de-la-casa/publico"

export const metadata: Metadata = { title: "Encarga tu torta" }

export default function EncargosPage() {
  return (
    <>
      <CabeceraPanDeLaCasa />
      <main id="contenido">
        <EncargosPanDeLaCasa />
      </main>
    </>
  )
}
