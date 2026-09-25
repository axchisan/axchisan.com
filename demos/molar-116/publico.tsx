"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { CalendarPlus, MessageCircle, Zap } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { RAIZ } from "./config"

/** Una muela vista de lado, con sus dos raíces: la marca. */
export function Muela({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M9 3c2.2 0 3.6 1 7 1s4.8-1 7-1c3.6 0 6 2.8 6 6.8 0 3.4-1.4 5.6-2.4 8.2-1 2.7-1.2 5.8-2 8.6-.5 1.8-1.3 2.9-2.5 2.9-1.6 0-2-2-2.4-4.4-.4-2.4-.9-4.6-3.7-4.6s-3.3 2.2-3.7 4.6C12 27.6 11.6 29.6 10 29.6c-1.2 0-2-1.1-2.5-2.9-.8-2.8-1-5.9-2-8.6C4.4 15.4 3 13.2 3 9.8 3 5.8 5.4 3 9 3Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MarcaMolar({ claro }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${claro ? "text-white" : "text-mo-violeta"}`}>
      <Muela className="h-7 w-7" />
      <span className={`text-[1.375rem] leading-none font-extrabold tracking-[-0.03em] ${claro ? "text-white" : "text-mo-tinta"}`}>
        Molar <span className="font-medium">116</span>
      </span>
    </span>
  )
}

export const botonVioleta =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-mo-violeta px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-mo-violeta-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mo-violeta disabled:cursor-not-allowed disabled:opacity-60"
export const botonBorde =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-mo-tinta px-6 text-[1rem] font-semibold transition-colors hover:bg-mo-tinta hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mo-violeta"
export const campo =
  "mt-1.5 block h-12 w-full rounded-[12px] border border-mo-linea bg-white px-3.5 text-[1rem] placeholder:text-mo-gris focus:border-mo-violeta focus:outline-2 focus:outline-mo-violeta aria-[invalid=true]:border-mo-rojo"

export function BotonWhatsappMolar(props: { children: ReactNode; className?: string; mensaje?: string }) {
  return (
    <WhatsappSimulado negocio="el consultorio" mensaje={props.mensaje ?? "Hola, Molar 116. Quiero pedir una cita."} className={props.className}>
      {props.children}
    </WhatsappSimulado>
  )
}

/** Con el plan de página se agenda por WhatsApp; desde el de citas, en línea. */
export function AccionesCita({ motivo, compacto }: { motivo?: string; compacto?: boolean }) {
  const { incluye } = useDemo()
  if (!incluye("citas")) {
    return (
      <BotonWhatsappMolar className={botonVioleta} mensaje={`Hola, Molar 116. Quiero pedir una cita${motivo ? ` de ${motivo}` : ""}.`}>
        <MessageCircle className="h-5 w-5" aria-hidden />
        Pedir cita por WhatsApp
      </BotonWhatsappMolar>
    )
  }
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={`${RAIZ}/agendar${motivo ? `?motivo=${motivo}` : ""}`} className={botonVioleta}>
        <CalendarPlus className="h-5 w-5" aria-hidden />
        Agendar cita
      </Link>
      {!compacto && (
        <Link href={`${RAIZ}/agendar?motivo=dolor`} className={botonBorde}>
          <Zap className="h-5 w-5" aria-hidden />
          Tengo dolor
        </Link>
      )}
    </div>
  )
}

export function CabeceraMolar() {
  const { incluye } = useDemo()
  return (
    <header className="border-b border-mo-linea bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={RAIZ} aria-label="Molar 116, inicio">
          <MarcaMolar />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-[0.9375rem] md:flex">
          <a href={`${RAIZ}#tratamientos`} className="hover:underline">Tratamientos</a>
          <a href={`${RAIZ}#equipo`} className="hover:underline">Equipo</a>
          <a href={`${RAIZ}#ubicacion`} className="hover:underline">Ubicación</a>
        </nav>
        {incluye("citas") ? (
          <Link href={`${RAIZ}/agendar`} className="ml-auto inline-flex h-10 items-center rounded-full bg-mo-violeta px-4 text-[0.9375rem] font-semibold text-white hover:bg-mo-violeta-2 md:ml-0">
            Agendar
          </Link>
        ) : (
          <BotonWhatsappMolar className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full bg-mo-violeta px-4 text-[0.9375rem] font-semibold text-white hover:bg-mo-violeta-2 md:ml-0">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </BotonWhatsappMolar>
        )}
      </div>
    </header>
  )
}

/**
 * La arcada superior dibujada con código: dieciséis piezas sobre una curva.
 * Es la imagen de la portada, en vez de la foto de una sonrisa de banco de
 * imágenes que tienen todos los consultorios.
 */
export function Arcada({ className }: { className?: string }) {
  // Vista oclusal: incisivos abajo al centro, muelas arriba a los lados.
  const piezas = Array.from({ length: 16 }, (_, i) => {
    const grados = -80 + (i * 160) / 15
    const t = (grados * Math.PI) / 180
    const ancho = [36, 38, 38, 28, 28, 24, 22, 26][Math.min(i, 15 - i)]
    // Redondeado: servidor y navegador calculan senos con decimales distintos.
    const r = (v: number) => Math.round(v * 100) / 100
    return { x: r(200 + 165 * Math.sin(t)), y: r(30 + 190 * Math.cos(t)), ancho, angulo: r(-grados), i }
  })
  const marcadas = new Set([2, 5, 12])
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden>
      {piezas.map((p) => (
        <rect
          key={p.i}
          x={p.x - p.ancho / 2}
          y={p.y - 20}
          width={p.ancho}
          height={40}
          rx={p.ancho / 2.4}
          transform={`rotate(${p.angulo} ${p.x} ${p.y})`}
          fill={marcadas.has(p.i) ? "var(--color-mo-violeta)" : "#fff"}
          stroke="var(--color-mo-tinta)"
          strokeWidth="2"
        />
      ))}
    </svg>
  )
}
