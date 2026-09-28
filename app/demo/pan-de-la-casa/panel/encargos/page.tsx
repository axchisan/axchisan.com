import type { Metadata } from "next"
import { EncargosPanel } from "@/demos/pan-de-la-casa/panel"

export const metadata: Metadata = { title: "Encargos" }

export default function Page() {
  return <EncargosPanel />
}
