import type { Metadata } from "next"
import { AgendaMolar } from "@/demos/molar-116/panel/agenda"

export const metadata: Metadata = { title: "Agenda" }

export default async function Page({ searchParams }: { searchParams: Promise<{ dia?: string }> }) {
  const { dia } = await searchParams
  return <AgendaMolar diaInicial={dia && /^\d{4}-\d{2}-\d{2}$/.test(dia) ? dia : undefined} />
}
