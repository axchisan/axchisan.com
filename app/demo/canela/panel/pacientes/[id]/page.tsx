import { Ficha } from "@/demos/canela/panel/ficha"

export default async function FichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <Ficha id={id} />
}
