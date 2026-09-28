import type { Metadata } from "next"
import { KardexFerreteria } from "@/demos/la-principal/panel/kardex"

export const metadata: Metadata = { title: "Kardex" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <KardexFerreteria id={id} />
}
