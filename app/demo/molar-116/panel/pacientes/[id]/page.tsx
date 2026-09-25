import type { Metadata } from "next"
import { PacienteMolar } from "@/demos/molar-116/panel/paciente"

export const metadata: Metadata = { title: "Paciente" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PacienteMolar id={id} />
}
