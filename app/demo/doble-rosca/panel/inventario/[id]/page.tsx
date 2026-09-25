import type { Metadata } from "next"
import { KardexFerreteria } from "@/demos/doble-rosca/panel/kardex"

export const metadata: Metadata = { title: "Kardex" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <KardexFerreteria id={id} />
}
