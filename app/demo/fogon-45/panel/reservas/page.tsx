import type { Metadata } from "next"
import { ReservasFogon } from "@/demos/fogon-45/panel/reservas"

export const metadata: Metadata = { title: "Reservas" }

export default async function Page({ searchParams }: { searchParams: Promise<{ dia?: string }> }) {
  const { dia } = await searchParams
  return <ReservasFogon diaInicial={dia && /^\d{4}-\d{2}-\d{2}$/.test(dia) ? dia : undefined} />
}
