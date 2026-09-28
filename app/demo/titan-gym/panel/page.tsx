import type { Metadata } from "next"
import { HoyTitanGym } from "@/demos/titan-gym/panel/hoy"

export const metadata: Metadata = { title: "Clases de hoy" }

export default function Page() {
  return <HoyTitanGym />
}
