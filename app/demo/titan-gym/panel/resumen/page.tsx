import type { Metadata } from "next"
import { ResumenTitanGym } from "@/demos/titan-gym/panel/socios"

export const metadata: Metadata = { title: "Resumen" }

export default function Page() {
  return <ResumenTitanGym />
}
