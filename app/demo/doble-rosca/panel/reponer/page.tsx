import type { Metadata } from "next"
import { ReponerFerreteria } from "@/demos/doble-rosca/panel/reponer"

export const metadata: Metadata = { title: "Reponer" }

export default function Page() {
  return <ReponerFerreteria />
}
