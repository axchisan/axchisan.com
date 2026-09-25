"use client"

import Link from "next/link"
import { CalendarPlus, LayoutDashboard, MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { RAIZ } from "./config"
import { BotonWhatsappFogon, botonPrincipal, botonSecundario } from "./publico"

const botonClaro =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[1rem] font-bold text-fg-cobalto transition-colors hover:bg-fg-peltre focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"

export function AccionesPortada() {
  const { incluye } = useDemo()
  return (
    <div className="flex flex-wrap gap-3">
      <a href="#carta" className={botonPrincipal}>
        {incluye("pedidos") ? "Ver la carta y pedir" : "Ver la carta"}
      </a>
      {incluye("sistema") ? (
        <Link href={`${RAIZ}/reservar`} className={botonSecundario}>
          <CalendarPlus className="h-5 w-5" aria-hidden />
          Reservar mesa
        </Link>
      ) : (
        <BotonWhatsappFogon className={botonSecundario} mensaje="Hola, Fogón 45. Quiero reservar una mesa.">
          <MessageCircle className="h-5 w-5" aria-hidden />
          Reservar por WhatsApp
        </BotonWhatsappFogon>
      )}
    </div>
  )
}

export function AccionReserva() {
  const { incluye } = useDemo()
  return incluye("sistema") ? (
    <Link href={`${RAIZ}/reservar`} className={botonClaro}>
      <CalendarPlus className="h-5 w-5" aria-hidden />
      Reservar mesa
    </Link>
  ) : (
    <BotonWhatsappFogon className={botonClaro} mensaje="Hola, Fogón 45. Quiero reservar una mesa.">
      <MessageCircle className="h-5 w-5" aria-hidden />
      Reservar por WhatsApp
    </BotonWhatsappFogon>
  )
}

/**
 * La entrada al panel. En un restaurante real no está en la página pública;
 * en la demo sí, para que el visitante vea el otro lado.
 */
export function EntradaPanel() {
  const { incluye } = useDemo()
  return (
    <Link
      href={incluye("pedidos") ? `${RAIZ}/panel` : `${RAIZ}/panel/carta`}
      className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-[0.9375rem] font-semibold text-white hover:border-white"
    >
      <LayoutDashboard className="h-4 w-4" aria-hidden />
      Ver el panel del restaurante
    </Link>
  )
}
