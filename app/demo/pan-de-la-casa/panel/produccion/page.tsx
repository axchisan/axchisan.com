import type { Metadata } from "next"
import { ProduccionPanDeLaCasa } from "@/demos/pan-de-la-casa/panel"

export const metadata: Metadata = { title: "Producción" }

export default function Page() {
  return <ProduccionPanDeLaCasa />
}
