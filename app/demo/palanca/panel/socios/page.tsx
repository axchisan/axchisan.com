import type { Metadata } from "next"
import { SociosPalanca } from "@/demos/palanca/panel/socios"

export const metadata: Metadata = { title: "Socios" }

export default function Page() {
  return <SociosPalanca />
}
