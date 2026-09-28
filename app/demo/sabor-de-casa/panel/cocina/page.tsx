import type { Metadata } from "next"
import { CocinaSaborDeCasa } from "@/demos/sabor-de-casa/panel/cocina"

export const metadata: Metadata = { title: "Cocina" }

export default function Page() {
  return <CocinaSaborDeCasa />
}
