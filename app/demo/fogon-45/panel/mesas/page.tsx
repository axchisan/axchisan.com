import type { Metadata } from "next"
import { MesasFogon } from "@/demos/fogon-45/panel/mesas"

export const metadata: Metadata = { title: "Mesas y QR" }

export default function Page() {
  return <MesasFogon />
}
