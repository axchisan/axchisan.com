import type { Metadata } from "next"
import { CarteraMolar } from "@/demos/molar-116/panel/pacientes"

export const metadata: Metadata = { title: "Cartera" }

export default function Page() {
  return <CarteraMolar />
}
