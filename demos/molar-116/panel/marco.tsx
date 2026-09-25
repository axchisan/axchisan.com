"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { CalendarDays, ExternalLink, RotateCcw, Users, Wallet, type LucideIcon } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { RAIZ } from "../config"
import { restablecerConsultorio } from "../estado"
import { Muela } from "../publico"

type Seccion = { href: string; etiqueta: string; icono: LucideIcon; nivel: string }

const SECCIONES: Seccion[] = [
  { href: `${RAIZ}/panel`, etiqueta: "Agenda", icono: CalendarDays, nivel: "citas" },
  { href: `${RAIZ}/panel/pacientes`, etiqueta: "Pacientes", icono: Users, nivel: "sistema" },
  { href: `${RAIZ}/panel/cartera`, etiqueta: "Cartera", icono: Wallet, nivel: "sistema" },
]

const activa = (ruta: string, href: string) => (href === `${RAIZ}/panel` ? ruta === href : ruta.startsWith(href))

export function MarcoMolar({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  const { incluye, config } = useDemo()
  return (
    <SoloEnNivel nivel="citas">
      <div className="font-mo lg:grid lg:grid-cols-[228px_1fr] print:block">
        <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] flex-col bg-mo-tinta px-4 py-6 text-white lg:flex print:hidden">
          <Link href={`${RAIZ}/panel`} className="flex items-center gap-2 px-2">
            <Muela className="h-6 w-6 text-mo-lila-claro" />
            <span className="text-[1.1875rem] font-extrabold tracking-[-0.02em]">Molar 116</span>
          </Link>
          <Punto id="menu" className="mt-8">
            <nav aria-label="Panel">
              <ul className="space-y-1">
                {SECCIONES.map((s) => {
                  const Icono = s.icono
                  const es = activa(ruta, s.href)
                  return (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        aria-current={es ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[0.9375rem] ${es ? "bg-mo-lila font-semibold text-mo-tinta" : "text-mo-lila-claro hover:bg-white/10 hover:text-white"}`}
                      >
                        <Icono className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                        <span className="flex-1">{s.etiqueta}</span>
                        {!incluye(s.nivel) && <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.6875rem] text-white">{config.niveles.find((n) => n.id === s.nivel)?.etiqueta.split(" ")[0]}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </Punto>
          <div className="mt-auto space-y-1 border-t border-white/15 pt-4 text-[0.875rem]">
            <p className="px-3 pb-2">
              <span className="block font-semibold">Marcela Díaz</span>
              <span className="text-mo-lila-claro">Recepción</span>
            </p>
            <Link href={RAIZ} className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-mo-lila-claro hover:bg-white/10 hover:text-white">
              <ExternalLink className="h-4 w-4" aria-hidden />
              Ver la página pública
            </Link>
            <button type="button" onClick={restablecerConsultorio} className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-mo-lila-claro hover:bg-white/10 hover:text-white">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Restablecer la demo
            </button>
          </div>
        </aside>

        <div className="flex h-14 items-center justify-between bg-mo-tinta px-4 text-white lg:hidden print:hidden">
          <Link href={`${RAIZ}/panel`} className="flex items-center gap-2">
            <Muela className="h-6 w-6 text-mo-lila-claro" />
            <span className="font-extrabold">Molar 116</span>
          </Link>
          <button type="button" onClick={restablecerConsultorio} className="rounded-[8px] p-2 text-mo-lila-claro hover:text-white" aria-label="Restablecer la demo">
            <RotateCcw className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="min-w-0 bg-mo-fondo pb-24 lg:pb-0">{children}</div>

        <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-mo-linea bg-white pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden">
          {SECCIONES.map((s) => {
            const Icono = s.icono
            const es = activa(ruta, s.href)
            return (
              <Link key={s.href} href={s.href} aria-current={es ? "page" : undefined} className={`flex flex-col items-center gap-0.5 py-2 text-[0.75rem] ${es ? "font-semibold text-mo-violeta" : "text-mo-gris"}`}>
                <Icono className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                {s.etiqueta}
              </Link>
            )
          })}
        </nav>
      </div>
    </SoloEnNivel>
  )
}

export function Encabezado({ titulo, detalle, accion }: { titulo: string; detalle?: ReactNode; accion?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-mo-linea bg-white px-4 py-6 sm:px-8 print:hidden">
      <div>
        <h1 className="text-[2rem] leading-none font-extrabold tracking-[-0.03em]">{titulo}</h1>
        {detalle && <p className="mt-2 text-[0.9375rem] text-mo-gris">{detalle}</p>}
      </div>
      {accion}
    </div>
  )
}

export const Cargando = () => <div className="min-h-[60vh]" aria-busy="true" />
