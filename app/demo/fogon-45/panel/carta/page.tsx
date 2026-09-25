import type { Metadata } from "next"
import { CartaPanelFogon } from "@/demos/fogon-45/panel/carta"

export const metadata: Metadata = { title: "Carta" }

export default function Page() {
  return <CartaPanelFogon />
}
