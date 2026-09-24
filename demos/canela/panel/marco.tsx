"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import {
  BarChart3,
  BellRing,
  CalendarClock,
  CalendarDays,
  ExternalLink,
  LogOut,
  PawPrint,
  RotateCcw,
  type LucideIcon,
} from "lucide-react"
import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { RAIZ } from "../config"
import { restablecerClinica } from "../estado"
import type { Especie } from "../modelo"

// ─── Sesión simulada ─────────────────────────────────────────────────────

type Rol = "recepcion" | "veterinario"
const almacenSesion = crearAlmacen<{ rol: Rol | null }>("axchi-demo:canela:sesion", () => ({ rol: null }))

const USUARIOS: Record<Rol, { nombre: string; correo: string; descripcion: string }> = {
  recepcion: {
    nombre: "Sandra Rojas",
    correo: "recepcion@canela.example",
    descripcion: "Agenda, llegada de pacientes y recordatorios",
  },
  veterinario: {
    nombre: "Dra. Laura Méndez",
    correo: "laura@canela.example",
    descripcion: "Todo lo anterior, más historias clínicas y fórmulas",
  },
}

export function useSesion() {
  return useAlmacen(almacenSesion)
}

function Entrar() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center bg-cn-collar px-4 py-12">
      <div className="w-full max-w-md rounded-[22px] bg-white p-7 sm:p-9">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cn-pelota font-cn-titulo text-[1.25rem] font-extrabold">
          C
        </span>
        <h1 className="mt-5 text-[1.5625rem] font-bold">Panel de Canela</h1>
        <p className="mt-2 text-[1rem] text-cn-pizarra">
          Cada persona entra con su usuario y ve lo que le corresponde. En la demo, elige con quién
          entrar: no hace falta contraseña.
        </p>
        <div className="mt-7 grid gap-3">
          {(Object.keys(USUARIOS) as Rol[]).map((rol) => (
            <button
              key={rol}
              type="button"
              onClick={() => almacenSesion.escribir({ rol })}
              className="rounded-[14px] border-2 border-cn-linea p-4 text-left transition-colors hover:border-cn-collar focus-visible:border-cn-collar"
            >
              <span className="block text-[1.0625rem] font-bold">
                Entrar como {rol === "recepcion" ? "recepción" : "veterinaria"}
              </span>
              <span className="mt-0.5 block text-[0.9375rem] text-cn-pizarra">
                {USUARIOS[rol].nombre}, {USUARIOS[rol].correo}
              </span>
              <span className="mt-1 block text-[0.875rem] text-cn-pizarra">{USUARIOS[rol].descripcion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Navegación ──────────────────────────────────────────────────────────

type Seccion = { href: string; etiqueta: string; icono: LucideIcon; nivel: string }

const SECCIONES: Seccion[] = [
  { href: `${RAIZ}/panel`, etiqueta: "Hoy", icono: CalendarClock, nivel: "citas" },
  { href: `${RAIZ}/panel/agenda`, etiqueta: "Agenda", icono: CalendarDays, nivel: "citas" },
  { href: `${RAIZ}/panel/pacientes`, etiqueta: "Pacientes", icono: PawPrint, nivel: "sistema" },
  { href: `${RAIZ}/panel/recordatorios`, etiqueta: "Recordatorios", icono: BellRing, nivel: "sistema" },
  { href: `${RAIZ}/panel/resumen`, etiqueta: "Resumen", icono: BarChart3, nivel: "sistema" },
]

function activa(ruta: string, href: string) {
  return href === `${RAIZ}/panel` ? ruta === href : ruta.startsWith(href)
}

export function MarcoPanel({ children }: { children: ReactNode }) {
  const sesion = useSesion()
  const ruta = usePathname()
  const { incluye } = useDemo()

  if (sesion === null) return <div className="min-h-screen" aria-busy="true" />

  return (
    <SoloEnNivel nivel="citas">
      {!sesion.rol ? (
        <Entrar />
      ) : (
        <div className="font-cn-texto lg:grid lg:grid-cols-[232px_1fr] print:block">
          {/* Barra lateral: escritorio */}
          <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] flex-col bg-cn-collar px-4 py-6 text-white lg:flex print:hidden">
            <Link href={`${RAIZ}/panel`} className="flex items-center gap-2 px-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cn-pelota font-cn-titulo text-[1.0625rem] font-extrabold text-cn-collar">
                C
              </span>
              <span className="font-cn-titulo text-[1.25rem] font-extrabold tracking-[-0.03em]">canela</span>
              <span className="ml-1 text-[0.875rem] text-cn-niebla">panel</span>
            </Link>

            <Punto id="menu" className="mt-8">
              <nav aria-label="Panel">
                <ul className="space-y-1">
                  {SECCIONES.map((s) => {
                    const Icono = s.icono
                    const esActiva = activa(ruta, s.href)
                    return (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          aria-current={esActiva ? "page" : undefined}
                          className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[0.9375rem] transition-colors ${
                            esActiva ? "bg-cn-pelota font-bold text-cn-collar" : "text-cn-niebla hover:bg-cn-collar-2 hover:text-white"
                          }`}
                        >
                          <Icono className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                          <span className="flex-1">{s.etiqueta}</span>
                          {!incluye(s.nivel) && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6875rem] font-normal">
                              Sistema
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </Punto>

            <div className="mt-auto space-y-1 border-t border-white/10 pt-4 text-[0.875rem]">
              <p className="px-3 pb-2">
                <span className="block font-bold">{USUARIOS[sesion.rol].nombre}</span>
                <span className="text-cn-niebla">{sesion.rol === "recepcion" ? "Recepción" : "Veterinaria"}</span>
              </p>
              <Link href={RAIZ} className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-cn-niebla hover:bg-cn-collar-2 hover:text-white">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Ver la página pública
              </Link>
              <button
                type="button"
                onClick={restablecerClinica}
                className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-cn-niebla hover:bg-cn-collar-2 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Restablecer la demo
              </button>
              <button
                type="button"
                onClick={() => almacenSesion.escribir({ rol: null })}
                className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-cn-niebla hover:bg-cn-collar-2 hover:text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Salir
              </button>
            </div>
          </aside>

          {/* Barra superior: celular */}
          <div className="flex h-14 items-center justify-between bg-cn-collar px-4 text-white lg:hidden print:hidden">
            <Link href={`${RAIZ}/panel`} className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cn-pelota font-cn-titulo text-[0.9375rem] font-extrabold text-cn-collar">
                C
              </span>
              <span className="font-cn-titulo text-[1.125rem] font-extrabold">canela</span>
            </Link>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={restablecerClinica}
                className="rounded-[8px] p-2 text-cn-niebla hover:text-white"
                aria-label="Restablecer la demo"
              >
                <RotateCcw className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => almacenSesion.escribir({ rol: null })}
                className="rounded-[8px] p-2 text-cn-niebla hover:text-white"
                aria-label="Salir"
              >
                <LogOut className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>

          <div className="min-w-0 pb-24 lg:pb-0">{children}</div>

          {/* Barra inferior: celular */}
          <nav
            aria-label="Panel"
            className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-cn-linea bg-white pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden"
          >
            {SECCIONES.map((s) => {
              const Icono = s.icono
              const esActiva = activa(ruta, s.href)
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-current={esActiva ? "page" : undefined}
                  className={`flex flex-col items-center gap-0.5 py-2 text-[0.6875rem] ${esActiva ? "font-bold" : "text-cn-pizarra"}`}
                >
                  <span className={`rounded-full px-3 py-1 ${esActiva ? "bg-cn-pelota" : ""}`}>
                    <Icono className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  {s.etiqueta}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </SoloEnNivel>
  )
}

// ─── Piezas compartidas del panel ────────────────────────────────────────

export function EncabezadoPanel({
  titulo,
  detalle,
  accion,
}: {
  titulo: string
  detalle?: ReactNode
  accion?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-cn-linea bg-white px-4 py-6 sm:px-8">
      <div>
        <h1 className="text-[1.5625rem] leading-tight font-bold sm:text-[1.9375rem]">{titulo}</h1>
        {detalle && <p className="mt-1 text-[0.9375rem] text-cn-pizarra">{detalle}</p>}
      </div>
      {accion}
    </div>
  )
}

/**
 * La placa de la mascota: foto si la hay, y si no, la inicial en la placa
 * amarilla. Es el mismo objeto que cuelga en la portada.
 */
export function PlacaMascota({
  nombre,
  especie,
  foto,
  tamano = 40,
}: {
  nombre: string
  especie: Especie
  foto?: string
  tamano?: number
}) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-cn-pelota font-cn-titulo font-extrabold text-cn-collar ring-2 ring-cn-collar/10"
      style={{ width: tamano, height: tamano, fontSize: tamano * 0.42 }}
      title={especie === "perro" ? "Perro" : "Gato"}
    >
      {foto ? (
        <Image src={foto} alt="" fill sizes={`${tamano * 2}px`} className="object-cover" />
      ) : (
        <span aria-hidden>{nombre.charAt(0)}</span>
      )}
    </span>
  )
}

export function CargandoPanel() {
  return <div className="min-h-[60vh]" aria-busy="true" />
}
