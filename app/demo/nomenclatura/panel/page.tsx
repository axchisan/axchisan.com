import type { Metadata } from "next"
import { InmueblesPanel } from "@/demos/nomenclatura/panel"

export const metadata: Metadata = { title: "Inmuebles" }

export default function Page() {
  return <InmueblesPanel />
}
