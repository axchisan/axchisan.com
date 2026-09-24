"use client"

import Link from "next/link"
import { useSyncExternalStore, type ReactNode } from "react"
import { CalendarPlus, MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { WhatsappSimulado } from "@/demos/comun/whatsapp-simulado"
import { RAIZ } from "./config"
import { CLINICA, HORARIO, textoHoraDecimal } from "./modelo"

// ─── Reloj ───────────────────────────────────────────────────────────────

function suscribirMinuto(aviso: () => void) {
  const t = setInterval(aviso, 30_000)
  return () => clearInterval(t)
}
const minutoActual = () => Math.floor(Date.now() / 60_000)

/** Minuto actual del visitante; `null` en el servidor. */
function useMinuto() {
  return useSyncExternalStore(suscribirMinuto, minutoActual, () => null)
}

type Estado = { titulo: string; detalle: string; abierto: boolean }

function estadoClinica(ahora: Date): Estado {
  const dia = ahora.getDay()
  const h = ahora.getHours() + ahora.getMinutes() / 60
  const hoy = HORARIO[dia]
  const manana = HORARIO[(dia + 1) % 7]

  if (hoy && h >= hoy.abre && h < hoy.cierra) {
    return { abierto: true, titulo: "Abierto", detalle: `hasta las ${textoHoraDecimal(hoy.cierra)}` }
  }
  if (hoy && h >= hoy.cierra && h < hoy.urgencias) {
    return { abierto: true, titulo: "Urgencias", detalle: `hasta las ${textoHoraDecimal(hoy.urgencias)}` }
  }
  if (hoy && h < hoy.abre) {
    return { abierto: false, titulo: "Cerrado", detalle: `abre a las ${textoHoraDecimal(hoy.abre)}` }
  }
  return {
    abierto: false,
    titulo: "Cerrado",
    detalle: manana ? `mañana desde las ${textoHoraDecimal(manana.abre)}` : "",
  }
}

// ─── La placa ────────────────────────────────────────────────────────────

/**
 * Placa de identificación colgada de su argolla: el elemento memorable de la
 * demo. Dice en tiempo real si la clínica está abierta.
 */
export function PlacaEstado({ className }: { className?: string }) {
  const minuto = useMinuto()
  const estado = minuto === null ? null : estadoClinica(new Date(minuto * 60_000))

  return (
    <div className={`cn-placa-colgada w-[128px] sm:w-[172px] ${className ?? ""}`} role="status" aria-live="polite">
      {/* Argolla */}
      <svg viewBox="0 0 40 30" className="mx-auto block h-[26px] w-[34px]" aria-hidden>
        <ellipse cx="20" cy="15" rx="12" ry="11" fill="none" stroke="#8a97a6" strokeWidth="3.5" />
      </svg>
      <div className="-mt-[7px] flex aspect-square flex-col items-center justify-center rounded-full bg-cn-pelota p-4 text-center text-cn-collar shadow-[0_14px_30px_-12px_rgb(28_53_82/0.45)] ring-[6px] ring-inset ring-cn-collar/10">
        <span className="mx-auto -mt-2 mb-2 block h-2.5 w-2.5 rounded-full bg-cn-nube ring-2 ring-cn-collar/25" aria-hidden />
        {estado ? (
          <>
            <span className="text-[0.8125rem] leading-none">Hoy</span>
            <span className="mt-1 font-cn-titulo text-[1.3125rem] leading-none font-bold tracking-[-0.02em] sm:text-[1.75rem]">
              {estado.titulo}
            </span>
            <span className="mt-1.5 text-[0.75rem] leading-tight sm:text-[0.8125rem]">{estado.detalle}</span>
          </>
        ) : (
          <>
            <span className="font-cn-titulo text-[1.25rem] leading-none font-bold">Horario</span>
            <span className="mt-1.5 text-[0.75rem] leading-tight sm:text-[0.8125rem]">Lun a vie, 8 a. m. a 8 p. m.</span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── WhatsApp simulado ───────────────────────────────────────────────────

/** El WhatsApp de la clínica, simulado: su número es ficticio. */
export function BotonWhatsapp(props: { mensaje: string; children: ReactNode; className?: string }) {
  return <WhatsappSimulado negocio="la clínica" {...props} />
}

// ─── Acciones principales según el plan ──────────────────────────────────

const clasesPrincipal =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cn-pelota px-6 text-[1rem] font-bold text-cn-collar transition-colors hover:bg-cn-pelota-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cn-collar"
const clasesSecundario =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-cn-collar px-6 text-[1rem] font-bold text-cn-collar transition-colors hover:bg-cn-collar hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cn-collar"

const clasesSecundarioOscuro =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-white px-6 text-[1rem] font-bold text-white transition-colors hover:bg-white hover:text-cn-collar focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"

const MENSAJE_CITA = "Hola, quiero pedir una cita en Canela para mi mascota."

/**
 * Con el plan Página no hay agenda en línea: el botón principal pasa a ser
 * WhatsApp. Es la diferencia más visible entre los dos primeros niveles.
 */
export function AccionesCita({ servicio, sobreOscuro }: { servicio?: string; sobreOscuro?: boolean }) {
  const { incluye } = useDemo()
  const conCitas = incluye("citas")
  const secundario = sobreOscuro ? clasesSecundarioOscuro : clasesSecundario

  return (
    <div className="flex flex-wrap gap-3">
      {conCitas ? (
        <>
          <Link href={`${RAIZ}/agendar${servicio ? `?servicio=${servicio}` : ""}`} className={clasesPrincipal}>
            <CalendarPlus className="h-5 w-5" aria-hidden />
            Agendar cita
          </Link>
          <BotonWhatsapp mensaje={MENSAJE_CITA} className={secundario}>
            <MessageCircle className="h-5 w-5" aria-hidden />
            Escribir por WhatsApp
          </BotonWhatsapp>
        </>
      ) : (
        <BotonWhatsapp mensaje={MENSAJE_CITA} className={clasesPrincipal}>
          <MessageCircle className="h-5 w-5" aria-hidden />
          Pedir cita por WhatsApp
        </BotonWhatsapp>
      )}
    </div>
  )
}

// ─── Marca y cabecera ────────────────────────────────────────────────────

export function MarcaCanela() {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-cn-pelota font-cn-titulo text-[1.0625rem] font-extrabold text-cn-collar"
        aria-hidden
      >
        C
      </span>
      <span className="font-cn-titulo text-[1.375rem] font-extrabold tracking-[-0.03em]">canela</span>
    </span>
  )
}

export function CabeceraCanela() {
  const { incluye } = useDemo()
  return (
    <header className="bg-cn-nube">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href={RAIZ} aria-label={`${CLINICA.nombreCompleto}, inicio`} className="rounded-[6px]">
          <MarcaCanela />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-6 text-[0.9375rem] md:flex">
          <a href="#servicios" className="hover:underline">Servicios</a>
          <a href="#cachorros" className="hover:underline">Cachorros</a>
          <a href="#equipo" className="hover:underline">Equipo</a>
          <a href="#horario" className="hover:underline">Horario</a>
        </nav>
        {incluye("citas") ? (
          <Link
            href={`${RAIZ}/agendar`}
            className="ml-auto inline-flex h-10 items-center rounded-full bg-cn-collar px-4 text-[0.9375rem] font-bold text-white hover:bg-cn-collar-2 md:ml-0"
          >
            Agendar
          </Link>
        ) : (
          <BotonWhatsapp
            mensaje={MENSAJE_CITA}
            className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full bg-cn-collar px-4 text-[0.9375rem] font-bold text-white hover:bg-cn-collar-2 md:ml-0"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </BotonWhatsapp>
        )}
      </div>
    </header>
  )
}
