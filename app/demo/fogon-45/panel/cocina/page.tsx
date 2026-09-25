import type { Metadata } from "next"
import { CocinaFogon } from "@/demos/fogon-45/panel/cocina"

export const metadata: Metadata = { title: "Cocina" }

export default function Page() {
  return <CocinaFogon />
}
