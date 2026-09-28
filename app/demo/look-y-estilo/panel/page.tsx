import { HoySalon } from "@/demos/look-y-estilo/panel/hoy"

export default async function PanelSalonPage({ searchParams }: { searchParams: Promise<{ dia?: string }> }) {
  const { dia } = await searchParams
  return <HoySalon diaInicial={dia} />
}
