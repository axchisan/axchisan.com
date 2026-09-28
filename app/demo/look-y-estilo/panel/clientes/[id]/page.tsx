import { FichaCliente } from "@/demos/look-y-estilo/panel/clientes"

export default async function FichaClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <FichaCliente id={id} />
}
