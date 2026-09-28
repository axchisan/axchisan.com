import type { Metadata } from "next"
import { PacientesSonrisaClara } from "@/demos/sonrisa-clara/panel/pacientes"

export const metadata: Metadata = { title: "Pacientes" }

export default function Page() {
  return <PacientesSonrisaClara />
}
