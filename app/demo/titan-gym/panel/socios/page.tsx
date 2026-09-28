import type { Metadata } from "next"
import { SociosTitanGym } from "@/demos/titan-gym/panel/socios"

export const metadata: Metadata = { title: "Socios" }

export default function Page() {
  return <SociosTitanGym />
}
