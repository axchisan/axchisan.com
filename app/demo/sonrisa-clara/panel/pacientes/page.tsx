import type { Metadata } from "next"
import { PacientesMolar } from "@/demos/sonrisa-clara/panel/pacientes"

export const metadata: Metadata = { title: "Pacientes" }

export default function Page() {
  return <PacientesMolar />
}
