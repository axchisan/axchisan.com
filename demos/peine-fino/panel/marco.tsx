"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { CalendarClock, ExternalLink, RotateCcw, UserRoundSearch, Users, Wallet, type LucideIcon } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { RAIZ } from "../config"
import { restablecerSalon } from "../estado"
import { Peine } from "../publico"

type Seccion = { href: string; etiqueta: string; icono: LucideIcon; nivel: string }

const SECCIONES: Seccion[] = [
  { href: `${RAIZ}/panel`, etiqueta: "Hoy", icono: CalendarClock, nivel: "citas" },
  { href: `${RAIZ}/panel/caja`, etiqueta: "Caja", icono: Wallet, nivel: "sistema" },
  { href: `${RAIZ}/panel/clientes`, etiqueta: "Clientes", icono: Users, nivel: "sistema" },
  { href: `${RAIZ}/panel/volver`, etiqueta: "Que vuelvan", icono: UserRoundSearch, nivel: "sistema" },
]

const activa = (ruta: string, href: string) => (href === `${RAIZ}/panel` ? ruta === href : ruta.startsWith(href))

export function MarcoSalon({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  const { incluye } = useDemo()

  return (
    <SoloEnNivel nivel="citas">
      <div className="font-pf-texto lg:grid lg:grid-cols-[224px_1fr] print:block">
        <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] flex-col bg-pf-cordoban px-4 py-6 text-white lg:flex print:hidden">
          <Link href={`${RAIZ}/panel`} className="flex items-center gap-2 px-2">
            <Peine className="h-4 w-7" />
            <span className="font-pf-letrero text-[1.3125rem] leading-none font-extrabold uppercase">Peine Fino</span>
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
                        className={`flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-[0.9375rem] transition-colors ${
                          es ? "bg-white font-semibold text-pf-cordoban" : "text-pf-niebla hover:bg-pf-cordoban-2 hover:text-white"
                        }`}
                      >
                        <Icono className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                        <span className="flex-1">{s.etiqueta}</span>
                        {!incluye(s.nivel) && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6875rem] font-normal">Sistema</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </Punto>
          <div className="mt-auto space-y-1 border-t border-white/15 pt-4 text-[0.875rem]">
            <p className="px-3 pb-2">
              <span className="block font-semibold">Lina Moreno</span>
              <span className="text-pf-niebla">Administradora</span>
            </p>
            <Link href={RAIZ} className="flex items-center gap-2.5 rounded-[4px] px-3 py-2 text-pf-niebla hover:bg-pf-cordoban-2 hover:text-white">
              <ExternalLink className="h-4 w-4" aria-hidden />
              Ver la página pública
            </Link>
            <button
              type="button"
              onClick={restablecerSalon}
              className="flex w-full items-center gap-2.5 rounded-[4px] px-3 py-2 text-left text-pf-niebla hover:bg-pf-cordoban-2 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Restablecer la demo
            </button>
          </div>
        </aside>

        <div className="flex h-14 items-center justify-between bg-pf-cordoban px-4 text-white lg:hidden print:hidden">
          <Link href={`${RAIZ}/panel`} className="flex items-center gap-2">
            <Peine className="h-4 w-7" />
            <span className="font-pf-letrero text-[1.25rem] font-extrabold uppercase">Peine Fino</span>
          </Link>
          <button type="button" onClick={restablecerSalon} className="rounded-[4px] p-2 text-pf-niebla hover:text-white" aria-label="Restablecer la demo">
            <RotateCcw className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="min-w-0 pb-24 lg:pb-0">{children}</div>

        <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-pf-linea bg-white pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden">
          {SECCIONES.map((s) => {
            const Icono = s.icono
            const es = activa(ruta, s.href)
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={es ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[0.6875rem] ${es ? "font-semibold text-pf-cordoban" : "text-pf-humo"}`}
              >
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
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-pf-linea bg-white px-4 py-6 sm:px-8">
      <div>
        <h1 className="font-pf-letrero text-[2.4375rem] leading-none font-extrabold text-pf-cordoban uppercase">{titulo}</h1>
        {detalle && <p className="mt-2 text-[0.9375rem] text-pf-humo">{detalle}</p>}
      </div>
      {accion}
    </div>
  )
}

export const Cargando = () => <div className="min-h-[60vh]" aria-busy="true" />
