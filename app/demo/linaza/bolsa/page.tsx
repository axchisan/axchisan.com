import type { Metadata } from "next"
import { BolsaLinaza } from "@/demos/linaza/bolsa"
import { CabeceraLinaza } from "@/demos/linaza/publico"

export const metadata: Metadata = { title: "Tu bolsa" }

export default function BolsaPage() {
  return (
    <>
      <CabeceraLinaza />
      <main id="contenido">
        <BolsaLinaza />
      </main>
    </>
  )
}
