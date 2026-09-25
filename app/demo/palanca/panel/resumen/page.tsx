import type { Metadata } from "next"
import { ResumenPalanca } from "@/demos/palanca/panel/socios"

export const metadata: Metadata = { title: "Resumen" }

export default function Page() {
  return <ResumenPalanca />
}
