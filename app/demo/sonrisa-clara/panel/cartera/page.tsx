import type { Metadata } from "next"
import { CarteraMolar } from "@/demos/sonrisa-clara/panel/pacientes"

export const metadata: Metadata = { title: "Cartera" }

export default function Page() {
  return <CarteraMolar />
}
