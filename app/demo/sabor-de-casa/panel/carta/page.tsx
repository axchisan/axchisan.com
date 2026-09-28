import type { Metadata } from "next"
import { CartaPanelSaborDeCasa } from "@/demos/sabor-de-casa/panel/carta"

export const metadata: Metadata = { title: "Carta" }

export default function Page() {
  return <CartaPanelSaborDeCasa />
}
