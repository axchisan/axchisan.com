import type { Metadata } from "next"
import { CartaPanelFogon } from "@/demos/sabor-de-casa/panel/carta"

export const metadata: Metadata = { title: "Carta" }

export default function Page() {
  return <CartaPanelFogon />
}
