"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { MessageCircle, ShoppingBag } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { useAhora } from "@/demos/comun/reloj"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { textoHoraDecimal } from "@/demos/motores/agenda/tiempo"
import { unidades } from "@/demos/motores/pedidos/carrito"
import { RAIZ } from "./config"
import { useCarrito } from "./estado"
import { HORARIO } from "./modelo"

/** Una olla de peltre con su vapor: la marca del restaurante. */
export function Olla({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 34" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M13 9c-2-2 2-4 0-7" />
        <path d="M20 9c-2-2 2-4 0-7" />
        <path d="M27 9c-2-2 2-4 0-7" />
      </g>
      <rect x="4" y="12" width="32" height="4" rx="2" fill="currentColor" />
      <path d="M7 17h26v8a7 7 0 0 1-7 7H14a7 7 0 0 1-7-7z" fill="currentColor" />
      <rect x="1" y="19" width="5" height="3" rx="1.5" fill="currentColor" />
      <rect x="34" y="19" width="5" height="3" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export function MarcaFogon({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${claro ? "text-white" : "text-fg-cobalto"}`}>
      <Olla className="h-7 w-8" />
      <span className="font-fg-letrero text-[1.5rem] leading-none">Fogón 45</span>
    </span>
  )
}

const MENSAJE = "Hola, Fogón 45. Quiero hacer un pedido."

export function BotonWhatsappFogon(props: { children: ReactNode; className?: string; mensaje?: string }) {
  return (
    <WhatsappSimulado negocio="el restaurante" mensaje={props.mensaje ?? MENSAJE} className={props.className}>
      {props.children}
    </WhatsappSimulado>
  )
}

export const botonPrincipal =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-fg-cobalto px-6 text-[1rem] font-bold text-white transition-colors hover:bg-fg-cobalto-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg-cobalto disabled:cursor-not-allowed disabled:opacity-60"
export const botonSecundario =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-fg-cobalto px-6 text-[1rem] font-bold text-fg-cobalto transition-colors hover:bg-fg-cobalto hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg-cobalto"

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]

/** "Abierto hasta las 10:00 p. m." o cuándo se abre, según la hora del visitante. */
export function EstadoHoy({ claro }: { claro?: boolean }) {
  const ahora = useAhora()
  if (!ahora) return <span className="inline-block h-6" aria-hidden />
  const h = ahora.getHours() + ahora.getMinutes() / 60
  const hoy = HORARIO[ahora.getDay()]
  let texto: string
  let abierto = false
  if (hoy && h >= hoy.abre && h < hoy.cierra) {
    abierto = true
    texto = `Abierto ahora, hasta las ${textoHoraDecimal(hoy.cierra)}`
  } else if (hoy && h < hoy.abre) {
    texto = `Cerrado. Abrimos hoy a las ${textoHoraDecimal(hoy.abre)}`
  } else {
    let d = 1
    while (!HORARIO[(ahora.getDay() + d) % 7]) d++
    const proximo = HORARIO[(ahora.getDay() + d) % 7]!
    texto = `Cerrado. Abrimos ${d === 1 ? "mañana" : `el ${DIAS[(ahora.getDay() + d) % 7]}`} a las ${textoHoraDecimal(proximo.abre)}`
  }
  return (
    <span className={`inline-flex items-center gap-2 text-[0.9375rem] font-semibold ${claro ? "text-white" : "text-fg-tizne"}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${abierto ? "bg-fg-exito" : "bg-fg-aji"}`} aria-hidden />
      {texto}
    </span>
  )
}

export function CabeceraFogon() {
  const { incluye } = useDemo()
  const carrito = useCarrito()
  const n = unidades(carrito?.lineas ?? [])
  return (
    <header className="border-b border-fg-linea bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Fogón 45, inicio" className="rounded-[4px]">
          <MarcaFogon />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-[0.9375rem] font-semibold md:flex">
          <a href={`${RAIZ}#carta`} className="hover:underline">Carta</a>
          <a href={`${RAIZ}#reservas`} className="hover:underline">Reservas</a>
          <a href={`${RAIZ}#llegar`} className="hover:underline">Cómo llegar</a>
        </nav>
        {incluye("pedidos") ? (
          <Link
            href={n ? `${RAIZ}/pedir` : `${RAIZ}#carta`}
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-fg-cobalto px-4 text-[0.9375rem] font-bold text-white hover:bg-fg-cobalto-2 md:ml-0"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {n ? `Tu pedido (${n})` : "Pedir"}
          </Link>
        ) : (
          <BotonWhatsappFogon className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-fg-cobalto px-4 text-[0.9375rem] font-bold text-white hover:bg-fg-cobalto-2 md:ml-0">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Pedir por WhatsApp
          </BotonWhatsappFogon>
        )}
      </div>
    </header>
  )
}
