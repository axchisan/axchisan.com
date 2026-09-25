import type { Metadata } from "next"
import { CajaFerreteria } from "@/demos/doble-rosca/panel/caja"

export const metadata: Metadata = { title: "Caja" }

export default async function Page({ searchParams }: { searchParams: Promise<{ pedido?: string }> }) {
  const { pedido } = await searchParams
  return <CajaFerreteria pedidoInicial={pedido} />
}
