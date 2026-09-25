import type { Metadata } from "next"
import { EntradasFerreteria } from "@/demos/doble-rosca/panel/entradas"

export const metadata: Metadata = { title: "Entradas" }

export default function Page() {
  return <EntradasFerreteria />
}
