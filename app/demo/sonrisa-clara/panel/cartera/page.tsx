import type { Metadata } from "next"
import { CarteraSonrisaClara } from "@/demos/sonrisa-clara/panel/pacientes"

export const metadata: Metadata = { title: "Cartera" }

export default function Page() {
  return <CarteraSonrisaClara />
}
