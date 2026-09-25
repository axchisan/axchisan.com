"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { BarChart3, ClipboardList, ExternalLink, Package, PackagePlus, RotateCcw, ScanBarcode, Truck, type LucideIcon } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { RAIZ } from "../config"
import { bajoMinimo, restablecerFerreteria, useExistencias, useFerreteria } from "../estado"
import { Tuerca } from "../publico"

type Seccion = { href: string; etiqueta: string; corta: string; icono: LucideIcon; nivel: string }

const SECCIONES: Seccion[] = [
  { href: `${RAIZ}/panel`, etiqueta: "Caja", corta: "Caja", icono: ScanBarcode, nivel: "gestion" },
  { href: `${RAIZ}/panel/pedidos`, etiqueta: "Pedidos web", corta: "Pedidos", icono: ClipboardList, nivel: "catalogo" },
  { href: `${RAIZ}/panel/inventario`, etiqueta: "Inventario", corta: "Inventario", icono: Package, nivel: "catalogo" },
  { href: `${RAIZ}/panel/entradas`, etiqueta: "Entradas", corta: "Entradas", icono: PackagePlus, nivel: "gestion" },
  { href: `${RAIZ}/panel/reportes`, etiqueta: "Reportes", corta: "Reportes", icono: BarChart3, nivel: "gestion" },
  { href: `${RAIZ}/panel/reponer`, etiqueta: "Reponer", corta: "Reponer", icono: Truck, nivel: "completo" },
]

const activa = (ruta: string, href: string) => (href === `${RAIZ}/panel` ? ruta === href : ruta.startsWith(href))

export function MarcoFerreteria({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  const { incluye, config } = useDemo()
  const e = useFerreteria()
  const stock = useExistencias(e)
  const nuevos = e?.pedidosWeb.filter((p) => p.estado === "nuevo").length ?? 0
  const reponer = stock ? bajoMinimo(stock).length : 0
  const etiquetaNivel = (id: string) => config.niveles.find((n) => n.id === id)?.etiqueta
  // Solo el número a la vista; el resto lo lee el lector de pantalla.
  const insignia = (href: string) =>
    href.endsWith("/pedidos") && nuevos ? (
      <>
        {nuevos}
        <span className="sr-only"> nuevo{nuevos === 1 ? "" : "s"}</span>
      </>
    ) : href.endsWith("/inventario") && reponer ? (
      <>
        {reponer}
        <span className="sr-only"> por reponer</span>
      </>
    ) : null

  return (
    <div className="font-dr lg:grid lg:grid-cols-[236px_1fr] print:block">
      <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] flex-col bg-dr-verde px-4 py-6 text-white lg:flex print:hidden">
        <Link href={`${RAIZ}/panel`} className="flex items-center gap-2 px-2">
          <Tuerca className="h-7 w-7" />
          <span className="dr-ancha text-[1.125rem] leading-none font-extrabold">Doble Rosca</span>
        </Link>
        <Punto id="menu" className="mt-8">
          <nav aria-label="Panel">
            <ul className="space-y-1">
              {SECCIONES.map((s) => {
                const Icono = s.icono
                const es = activa(ruta, s.href)
                const extra = incluye(s.nivel) ? insignia(s.href) : etiquetaNivel(s.nivel)
                return (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      aria-current={es ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-[0.9375rem] transition-colors ${
                        es ? "bg-white font-bold text-dr-verde" : "text-dr-verde-claro hover:bg-dr-verde-2 hover:text-white"
                      }`}
                    >
                      <Icono className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                      <span className="flex-1">{s.etiqueta}</span>
                      {extra && (
                        <span className={`rounded-[4px] px-1.5 py-0.5 text-[0.6875rem] font-semibold ${incluye(s.nivel) ? "bg-dr-cinta text-dr-tinta" : "bg-white/15 text-white"}`}>{extra}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </Punto>
        <div className="mt-auto space-y-1 border-t border-white/20 pt-4 text-[0.875rem]">
          <p className="px-3 pb-2">
            <span className="block font-semibold">Hernando Rojas</span>
            <span className="text-dr-verde-claro">Dueño</span>
          </p>
          <Link href={RAIZ} className="flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-dr-verde-claro hover:bg-dr-verde-2 hover:text-white">
            <ExternalLink className="h-4 w-4" aria-hidden />
            Ver la página pública
          </Link>
          <button type="button" onClick={restablecerFerreteria} className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-left text-dr-verde-claro hover:bg-dr-verde-2 hover:text-white">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Restablecer la demo
          </button>
        </div>
      </aside>

      <div className="flex h-14 items-center justify-between bg-dr-verde px-4 text-white lg:hidden print:hidden">
        <Link href={`${RAIZ}/panel`} className="flex items-center gap-2">
          <Tuerca className="h-6 w-6" />
          <span className="dr-ancha text-[1.0625rem] font-extrabold">Doble Rosca</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link href={RAIZ} className="rounded-[6px] p-2 text-dr-verde-claro hover:text-white" aria-label="Ver la página pública">
            <ExternalLink className="h-5 w-5" aria-hidden />
          </Link>
          <button type="button" onClick={restablecerFerreteria} className="rounded-[6px] p-2 text-dr-verde-claro hover:text-white" aria-label="Restablecer la demo">
            <RotateCcw className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="min-w-0 pb-24 lg:pb-0">{children}</div>

      <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-dr-linea bg-white pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden">
        {SECCIONES.map((s) => {
          const Icono = s.icono
          const es = activa(ruta, s.href)
          return (
            <Link key={s.href} href={s.href} aria-current={es ? "page" : undefined} className={`flex flex-col items-center gap-0.5 py-2 text-[0.6875rem] ${es ? "font-bold text-dr-verde" : "text-dr-acero"}`}>
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
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-dr-linea bg-white px-4 py-6 sm:px-8 print:hidden">
      <div>
        <h1 className="dr-ancha text-[1.875rem] leading-none font-extrabold">{titulo}</h1>
        {detalle && <p className="mt-2 text-[0.9375rem] text-dr-acero">{detalle}</p>}
      </div>
      {accion}
    </div>
  )
}

export const Cargando = () => <div className="min-h-[60vh]" aria-busy="true" />
