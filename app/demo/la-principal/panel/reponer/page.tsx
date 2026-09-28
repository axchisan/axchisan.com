import type { Metadata } from "next"
import { ReponerFerreteria } from "@/demos/la-principal/panel/reponer"

export const metadata: Metadata = { title: "Reponer" }

export default function Page() {
  return <ReponerFerreteria />
}
