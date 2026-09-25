import type { Metadata } from "next"
import { EncargosTanda } from "@/demos/tanda/encargos"
import { CabeceraTanda } from "@/demos/tanda/publico"

export const metadata: Metadata = { title: "Encarga tu torta" }

export default function EncargosPage() {
  return (
    <>
      <CabeceraTanda />
      <main id="contenido">
        <EncargosTanda />
      </main>
    </>
  )
}
