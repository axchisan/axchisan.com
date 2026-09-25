"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ClipboardList } from "lucide-react"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { estadoStock } from "@/demos/motores/gestion/inventario"
import { RAIZ } from "./config"
import { useLista } from "./estado"

/** Una tuerca vista de frente, con la rosca doble por dentro: la marca. */
export function Tuerca({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M16 1.5 28.6 8.75v14.5L16 30.5 3.4 23.25V8.75z" fill="currentColor" />
      <circle cx="16" cy="16" r="7.2" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="16" cy="16" r="3.6" fill="none" stroke="#fff" strokeWidth="1.6" />
    </svg>
  )
}

export function MarcaDobleRosca({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${claro ? "text-white" : "text-dr-verde"}`}>
      <Tuerca className="h-8 w-8" />
      <span className="leading-none">
        <span className={`block text-[0.6875rem] font-semibold tracking-[0.02em] ${claro ? "text-dr-verde-claro" : "text-dr-acero"}`}>Ferretería</span>
        <span className="dr-ancha block text-[1.3125rem] font-extrabold">Doble Rosca</span>
      </span>
    </span>
  )
}

export function BotonWhatsappFerreteria(props: { children: ReactNode; className?: string; mensaje?: string }) {
  return (
    <WhatsappSimulado negocio="la ferretería" mensaje={props.mensaje ?? "Hola, Doble Rosca. ¿Tienen…?"} className={props.className}>
      {props.children}
    </WhatsappSimulado>
  )
}

export const botonVerde =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-dr-verde px-5 text-[0.9375rem] font-bold text-white transition-colors hover:bg-dr-verde-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-dr-verde disabled:cursor-not-allowed disabled:opacity-50"
export const botonBorde =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border-2 border-dr-tinta px-5 text-[0.9375rem] font-bold text-dr-tinta transition-colors hover:bg-dr-tinta hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-dr-tinta"
export const campo =
  "mt-1.5 block h-11 w-full rounded-[6px] border border-dr-linea bg-white px-3 text-[1rem] placeholder:text-dr-acero focus:border-dr-verde focus:outline-2 focus:outline-dr-verde aria-[invalid=true]:border-dr-rojo"

/** "Hay 38 kilos", "Quedan 3" o "Agotado". Con `exacto` en falso, solo si hay o no. */
export function Disponibilidad({ hay, minimo, unidad, exacto }: { hay: number; minimo: number; unidad: string; exacto: boolean }) {
  const estado = estadoStock(hay, minimo)
  if (estado === "agotado") return <span className="inline-flex rounded-[4px] bg-dr-rojo-suave px-2 py-0.5 text-[0.8125rem] font-bold text-dr-rojo">Agotado</span>
  if (!exacto) return <span className="inline-flex rounded-[4px] bg-dr-exito-suave px-2 py-0.5 text-[0.8125rem] font-bold text-dr-exito">Disponible</span>
  const plural = hay === 1 ? unidad : unidad === "unidad" ? "unidades" : unidad === "galón" ? "galones" : `${unidad}s`
  return (
    <span className={`inline-flex rounded-[4px] px-2 py-0.5 text-[0.8125rem] font-bold ${estado === "bajo" ? "bg-dr-alerta-suave text-dr-alerta" : "bg-dr-exito-suave text-dr-exito"}`}>
      {estado === "bajo" ? `Quedan ${hay}` : `Hay ${hay} ${plural}`}
    </span>
  )
}

/**
 * Las existencias como una cinta métrica: la barra llega hasta lo que hay y la
 * raya negra marca el mínimo. Escala: el doble del mínimo llena la cinta.
 */
export function CintaStock({ hay, minimo }: { hay: number; minimo: number }) {
  const tope = Math.max(minimo * 3, hay, 1)
  const estado = estadoStock(hay, minimo)
  const color = estado === "agotado" ? "bg-dr-rojo" : estado === "bajo" ? "bg-dr-cinta" : "bg-dr-verde"
  return (
    <span className="relative block h-3 w-full min-w-24 overflow-hidden rounded-[2px] bg-white ring-1 ring-dr-linea" aria-hidden>
      <span className={`absolute inset-y-0 left-0 ${color}`} style={{ width: `${Math.min(100, (hay / tope) * 100)}%` }} />
      <span className="dr-cinta-marcas absolute inset-0" />
      <span className="absolute inset-y-[-2px] w-[3px] bg-dr-tinta" style={{ left: `${(minimo / tope) * 100}%` }} />
    </span>
  )
}

export function CabeceraFerreteria() {
  const lista = useLista()
  const n = lista?.lineas.length ?? 0
  return (
    <header className="border-b-4 border-dr-verde bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Ferretería Doble Rosca, inicio" className="rounded-[4px]">
          <MarcaDobleRosca />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-[0.9375rem] font-semibold md:flex">
          <a href={`${RAIZ}#productos`} className="hover:underline">Productos</a>
          <a href={`${RAIZ}#visitenos`} className="hover:underline">Horario y ubicación</a>
        </nav>
        <Link href={`${RAIZ}/lista`} className="ml-auto inline-flex h-10 items-center gap-2 rounded-[6px] bg-dr-verde px-4 text-[0.9375rem] font-bold text-white hover:bg-dr-verde-2 md:ml-0">
          <ClipboardList className="h-4 w-4" aria-hidden />
          Mi lista{n ? ` (${n})` : ""}
        </Link>
      </div>
    </header>
  )
}
