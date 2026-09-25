"use client"

import Link from "next/link"
import { LayoutDashboard } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { RAIZ } from "../config"

/** La puerta al panel. En la ferretería real no está en la página; en la demo sí. */
export function EntradaPanelFerreteria() {
  const { incluye } = useDemo()
  return (
    <Link
      href={incluye("gestion") ? `${RAIZ}/panel` : `${RAIZ}/panel/pedidos`}
      className="inline-flex items-center gap-2 rounded-[6px] border border-white/50 px-4 py-2 text-[0.9375rem] font-semibold text-white hover:border-white"
    >
      <LayoutDashboard className="h-4 w-4" aria-hidden />
      Ver el sistema de la ferretería
    </Link>
  )
}
