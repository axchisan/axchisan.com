import { NuevaConsulta } from "@/demos/canela/panel/consulta"

export default async function ConsultaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ cita?: string }>
}) {
  const [{ id }, { cita }] = await Promise.all([params, searchParams])
  return <NuevaConsulta id={id} citaId={cita} />
}
