"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { BarChart3, BookOpen, CalendarDays, ChefHat, ExternalLink, QrCode, ReceiptText, RotateCcw, type LucideIcon } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { RAIZ } from "../config"
import { restablecerRestaurante } from "../estado"
import { Olla } from "../publico"

type Seccion = { href: string; etiqueta: string; corta: string; icono: LucideIcon; nivel: string }

const SECCIONES: Seccion[] = [
  { href: `${RAIZ}/panel`, etiqueta: "Pedidos", corta: "Pedidos", icono: ReceiptText, nivel: "pedidos" },
  { href: `${RAIZ}/panel/cocina`, etiqueta: "Cocina", corta: "Cocina", icono: ChefHat, nivel: "sistema" },
  { href: `${RAIZ}/panel/reservas`, etiqueta: "Reservas", corta: "Reservas", icono: CalendarDays, nivel: "sistema" },
  { href: `${RAIZ}/panel/ventas`, etiqueta: "Ventas del día", corta: "Ventas", icono: BarChart3, nivel: "sistema" },
  { href: `${RAIZ}/panel/carta`, etiqueta: "Carta", corta: "Carta", icono: BookOpen, nivel: "carta" },
  { href: `${RAIZ}/panel/mesas`, etiqueta: "Mesas y QR", corta: "QR", icono: QrCode, nivel: "carta" },
]

const activa = (ruta: string, href: string) => (href === `${RAIZ}/panel` ? ruta === href : ruta.startsWith(href))

export function MarcoFogon({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  const { incluye, config } = useDemo()
  const etiquetaNivel = (id: string) => config.niveles.find((n) => n.id === id)?.etiqueta

  return (
    <div className="font-fg-texto lg:grid lg:grid-cols-[232px_1fr] print:block">
      <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] flex-col bg-fg-cobalto px-4 py-6 text-white lg:flex print:hidden">
        <Link href={`${RAIZ}/panel`} className="flex items-center gap-2 px-2">
          <Olla className="h-6 w-7" />
          <span className="font-fg-letrero text-[1.3125rem] leading-none">Fogón 45</span>
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
                      className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[0.9375rem] transition-colors ${
                        es ? "bg-white font-bold text-fg-cobalto" : "text-fg-niebla hover:bg-fg-cobalto-2 hover:text-white"
                      }`}
                    >
                      <Icono className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                      <span className="flex-1">{s.etiqueta}</span>
                      {!incluye(s.nivel) && <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.6875rem] font-normal text-white">{etiquetaNivel(s.nivel)}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </Punto>
        <div className="mt-auto space-y-1 border-t border-white/20 pt-4 text-[0.875rem]">
          <p className="px-3 pb-2">
            <span className="block font-semibold">Andrea Beltrán</span>
            <span className="text-fg-niebla">Administradora</span>
          </p>
          <Link href={RAIZ} className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-fg-niebla hover:bg-fg-cobalto-2 hover:text-white">
            <ExternalLink className="h-4 w-4" aria-hidden />
            Ver la página pública
          </Link>
          <button type="button" onClick={restablecerRestaurante} className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-fg-niebla hover:bg-fg-cobalto-2 hover:text-white">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Restablecer la demo
          </button>
        </div>
      </aside>

      <div className="flex h-14 items-center justify-between bg-fg-cobalto px-4 text-white lg:hidden print:hidden">
        <Link href={`${RAIZ}/panel`} className="flex items-center gap-2">
          <Olla className="h-6 w-7" />
          <span className="font-fg-letrero text-[1.25rem]">Fogón 45</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link href={RAIZ} className="rounded-[8px] p-2 text-fg-niebla hover:text-white" aria-label="Ver la página pública">
            <ExternalLink className="h-5 w-5" aria-hidden />
          </Link>
          <button type="button" onClick={restablecerRestaurante} className="rounded-[8px] p-2 text-fg-niebla hover:text-white" aria-label="Restablecer la demo">
            <RotateCcw className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="min-w-0 pb-24 lg:pb-0">{children}</div>

      <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-fg-linea bg-white pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden">
        {SECCIONES.map((s) => {
          const Icono = s.icono
          const es = activa(ruta, s.href)
          return (
            <Link
              key={s.href}
              href={s.href}
              aria-current={es ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-2 text-[0.6875rem] ${es ? "font-bold text-fg-cobalto" : "text-fg-ceniza"}`}
            >
              <Icono className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              {s.corta}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function Encabezado({ titulo, detalle, accion }: { titulo: string; detalle?: ReactNode; accion?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-fg-linea bg-white px-4 py-6 sm:px-8 print:hidden">
      <div>
        <h1 className="font-fg-letrero text-[2.25rem] leading-none text-fg-cobalto">{titulo}</h1>
        {detalle && <p className="mt-2 text-[0.9375rem] text-fg-ceniza">{detalle}</p>}
      </div>
      {accion}
    </div>
  )
}

export const Cargando = () => <div className="min-h-[60vh]" aria-busy="true" />
