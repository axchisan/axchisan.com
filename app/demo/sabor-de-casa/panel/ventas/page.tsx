import type { Metadata } from "next"
import { VentasSaborDeCasa } from "@/demos/sabor-de-casa/panel/ventas"

export const metadata: Metadata = { title: "Ventas del día" }

export default function Page() {
  return <VentasSaborDeCasa />
}
