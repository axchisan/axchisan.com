import type { Metadata } from "next"
import { MesasSaborDeCasa } from "@/demos/sabor-de-casa/panel/mesas"

export const metadata: Metadata = { title: "Mesas y QR" }

export default function Page() {
  return <MesasSaborDeCasa />
}
