import type { Metadata } from "next"
import { PacienteSonrisaClara } from "@/demos/sonrisa-clara/panel/paciente"

export const metadata: Metadata = { title: "Paciente" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PacienteSonrisaClara id={id} />
}
