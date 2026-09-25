"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { RAIZ } from "./config"
import type { Tipo } from "./modelo"

/** Un disco olímpico visto de frente: la marca. */
export function Disco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="15" fill="currentColor" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.55" />
      <circle cx="16" cy="16" r="3.2" fill="#fff" />
    </svg>
  )
}

export function MarcaPalanca({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${claro ? "text-white" : "text-pa-hierro"}`}>
      <Disco className="h-7 w-7 text-pa-rojo" />
      <span className="pa-ancha font-pa-titulo text-[1.375rem] leading-none font-extrabold tracking-[-0.02em]">PALANCA</span>
    </span>
  )
}

export const botonRojo =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-pa-rojo px-6 text-[1rem] font-bold text-white transition-colors hover:bg-pa-rojo-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-pa-rojo disabled:cursor-not-allowed disabled:opacity-60"
export const botonBorde =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[4px] border-2 border-pa-hierro px-6 text-[1rem] font-bold transition-colors hover:bg-pa-hierro hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-pa-rojo"
export const campo =
  "mt-1.5 block h-12 w-full rounded-[4px] border-2 border-pa-linea bg-white px-3 text-[1rem] placeholder:text-pa-gris focus:border-pa-hierro focus:outline-none aria-[invalid=true]:border-pa-rojo"

/** La etiqueta de color de un tipo de clase, como el disco que le corresponde. */
export function EtiquetaTipo({ tipo, grande }: { tipo: Tipo; grande?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-[3px] px-2 font-bold ${grande ? "py-1 text-[0.875rem]" : "py-0.5 text-[0.75rem]"} ${tipo.claro ? "text-pa-hierro" : "text-white"}`}
      style={{ background: tipo.color }}
    >
      {tipo.nombre}
    </span>
  )
}

export function BotonWhatsappPalanca(props: { children: ReactNode; className?: string; mensaje?: string }) {
  return (
    <WhatsappSimulado negocio="el gimnasio" mensaje={props.mensaje ?? "Hola, Palanca. Quiero información de los planes."} className={props.className}>
      {props.children}
    </WhatsappSimulado>
  )
}

export function CabeceraPalanca() {
  const { incluye } = useDemo()
  return (
    <header className="border-b-4 border-pa-hierro bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Palanca, inicio">
          <MarcaPalanca />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-[0.9375rem] font-semibold md:flex">
          <a href={`${RAIZ}#horario`} className="hover:underline">Horario</a>
          <a href={`${RAIZ}#planes`} className="hover:underline">Planes</a>
          <a href={`${RAIZ}#coaches`} className="hover:underline">Coaches</a>
        </nav>
        {incluye("reservas") ? (
          <Link href={`${RAIZ}/mis-clases`} className="ml-auto inline-flex h-10 items-center rounded-[4px] bg-pa-hierro px-4 text-[0.9375rem] font-bold text-white hover:bg-pa-rojo md:ml-0">
            Mis clases
          </Link>
        ) : (
          <BotonWhatsappPalanca className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-[4px] bg-pa-hierro px-4 text-[0.9375rem] font-bold text-white hover:bg-pa-rojo md:ml-0">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </BotonWhatsappPalanca>
        )}
      </div>
    </header>
  )
}
