import { Agenda } from "@/demos/canela/panel/agenda"

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ dia?: string }> }) {
  const { dia } = await searchParams
  return <Agenda diaInicial={dia} />
}
