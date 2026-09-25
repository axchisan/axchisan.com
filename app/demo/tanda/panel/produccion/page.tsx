import type { Metadata } from "next"
import { ProduccionTanda } from "@/demos/tanda/panel"

export const metadata: Metadata = { title: "Producción" }

export default function Page() {
  return <ProduccionTanda />
}
