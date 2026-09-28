import type { Metadata } from "next"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Campanas } from "@/demos/cafe-del-barrio/panel"

export const metadata: Metadata = { title: "Campañas" }

export default function CampanasPagina() {
  return (
    <SoloEnNivel nivel="completo">
      <Campanas />
    </SoloEnNivel>
  )
}
