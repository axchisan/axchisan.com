import type { Metadata } from "next"
import { EncargosPanel } from "@/demos/tanda/panel"

export const metadata: Metadata = { title: "Encargos" }

export default function Page() {
  return <EncargosPanel />
}
