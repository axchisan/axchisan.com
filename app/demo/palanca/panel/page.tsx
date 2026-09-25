import type { Metadata } from "next"
import { HoyPalanca } from "@/demos/palanca/panel/hoy"

export const metadata: Metadata = { title: "Clases de hoy" }

export default function Page() {
  return <HoyPalanca />
}
