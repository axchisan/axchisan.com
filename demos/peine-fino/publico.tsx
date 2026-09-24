"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { CalendarPlus, MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { RAIZ } from "./config"

/** Un peine visto de frente: el lomo y sus dientes. Es la marca del salón. */
export function Peine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden>
      <rect x="1" y="1" width="38" height="7" rx="3" fill="currentColor" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={3 + i * 3} y="8" width="1.6" height={i % 2 ? 11 : 15} rx="0.8" fill="currentColor" />
      ))}
    </svg>
  )
}

export function MarcaPeineFino({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${claro ? "text-white" : "text-pf-cordoban"}`}>
      <Peine className="h-5 w-8" />
      <span className="font-pf-letrero text-[1.5rem] leading-none font-extrabold tracking-[0.01em] uppercase">
        Peine Fino
      </span>
    </span>
  )
}

const MENSAJE = "Hola, quiero reservar en Peine Fino."

export function BotonWhatsappSalon(props: { children: ReactNode; className?: string; mensaje?: string }) {
  return <WhatsappSimulado negocio="el salón" mensaje={props.mensaje ?? MENSAJE} className={props.className}>{props.children}</WhatsappSimulado>
}

const principal =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-pf-cordoban px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-pf-cordoban-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-pf-cordoban"
const secundario =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[4px] border-2 border-pf-tinta px-6 text-[1rem] font-semibold text-pf-tinta transition-colors hover:bg-pf-tinta hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-pf-tinta"

/**
 * Reservar en línea solo existe desde el plan con reservas. Con el plan
 * Página, el botón principal pasa a ser WhatsApp.
 */
export function AccionesReserva({ query }: { query?: string }) {
  const { incluye } = useDemo()
  if (!incluye("citas")) {
    return (
      <BotonWhatsappSalon className={principal}>
        <MessageCircle className="h-5 w-5" aria-hidden />
        Reservar por WhatsApp
      </BotonWhatsappSalon>
    )
  }
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={`${RAIZ}/reservar${query ? `?${query}` : ""}`} className={principal}>
        <CalendarPlus className="h-5 w-5" aria-hidden />
        Reservar
      </Link>
      <BotonWhatsappSalon className={secundario}>
        <MessageCircle className="h-5 w-5" aria-hidden />
        WhatsApp
      </BotonWhatsappSalon>
    </div>
  )
}

export function CabeceraSalon() {
  const { incluye } = useDemo()
  return (
    <header className="border-b border-pf-linea bg-pf-porcelana">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Peine Fino, inicio" className="rounded-[4px]">
          <MarcaPeineFino />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-[0.9375rem] md:flex">
          <a href="#servicios" className="hover:underline">Servicios</a>
          <a href="#equipo" className="hover:underline">Equipo</a>
          <a href="#horario" className="hover:underline">Horario</a>
        </nav>
        {incluye("citas") ? (
          <Link
            href={`${RAIZ}/reservar`}
            className="ml-auto inline-flex h-10 items-center rounded-[4px] bg-pf-cordoban px-4 text-[0.9375rem] font-semibold text-white hover:bg-pf-cordoban-2 md:ml-0"
          >
            Reservar
          </Link>
        ) : (
          <BotonWhatsappSalon className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-[4px] bg-pf-cordoban px-4 text-[0.9375rem] font-semibold text-white hover:bg-pf-cordoban-2 md:ml-0">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </BotonWhatsappSalon>
        )}
      </div>
    </header>
  )
}
