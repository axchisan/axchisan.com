import type { Metadata } from "next"
import { ReservasSaborDeCasa } from "@/demos/sabor-de-casa/panel/reservas"

export const metadata: Metadata = { title: "Reservas" }

export default async function Page({ searchParams }: { searchParams: Promise<{ dia?: string }> }) {
  const { dia } = await searchParams
  return <ReservasSaborDeCasa diaInicial={dia && /^\d{4}-\d{2}-\d{2}$/.test(dia) ? dia : undefined} />
}
