import type { Metadata } from "next"
import { Caja } from "@/demos/cafe-del-barrio/caja"

export const metadata: Metadata = { title: "Caja" }

export default function CajaPagina() {
  return (
    <main id="contenido">
      <h1 className="sr-only">Caja de Café del Barrio</h1>
      <Caja />
    </main>
  )
}
