import type { Metadata } from "next"
import { InmueblesPanel } from "@/demos/tu-casa/panel"

export const metadata: Metadata = { title: "Inmuebles" }

export default function Page() {
  return <InmueblesPanel />
}
