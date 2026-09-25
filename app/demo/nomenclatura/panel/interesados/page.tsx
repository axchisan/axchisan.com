import type { Metadata } from "next"
import { InteresadosPanel } from "@/demos/nomenclatura/panel"

export const metadata: Metadata = { title: "Interesados" }

export default function Page() {
  return <InteresadosPanel />
}
