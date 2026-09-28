"use client"

import Link from "next/link"
import { useId, useState } from "react"
import { CalendarCheck } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { aFecha, claveDia, claveInstante, franjasDelDia, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { RAIZ } from "./config"
import { cuposLibres, reservarMesa, useRestaurante } from "./estado"
import { FRANJAS_RESERVA, type Reserva } from "./modelo"
import { botonPrincipal } from "./publico"

const CORTO = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric" })

const campo =
  "mt-1.5 block h-12 w-full rounded-[12px] border border-fg-linea bg-white px-3 text-[1rem] placeholder:text-fg-ceniza focus:border-fg-cobalto focus:outline-2 focus:outline-fg-cobalto aria-[invalid=true]:border-fg-aji"

export function ReservarFogon() {
  const ahora = useAhora()
  const e = useRestaurante()
  const [dia, setDia] = useState<string | null>(null)
  const [hora, setHora] = useState<string | null>(null)
  const [personas, setPersonas] = useState(2)
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [nota, setNota] = useState("")
  const [intento, setIntento] = useState(false)
  const [hecha, setHecha] = useState<Reserva | null>(null)
  const id = useId()

  if (!ahora || !e) return <div className="min-h-[70vh]" aria-busy="true" />

  const hoy = claveDia(ahora)
  const minimo = claveInstante(new Date(ahora.getTime() + 60 * 60_000))
  const dias = Array.from({ length: 10 }, (_, i) => sumarDias(hoy, i))
    .map((d) => ({ dia: d, horas: franjasDelDia(d, FRANJAS_RESERVA).filter((h) => h >= minimo) }))
    .filter((d) => d.horas.length > 0)
    .slice(0, 7)
  const diaActual = dia ?? dias[0]?.dia
  const horas = dias.find((d) => d.dia === diaActual)?.horas ?? []

  if (hecha) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CalendarCheck className="mx-auto h-12 w-12 text-fg-cobalto" aria-hidden />
        <h1 className="mt-4 font-fg-letrero text-[2.5rem] leading-none text-fg-cobalto">Mesa reservada</h1>
        <p className="mt-4 text-[1.125rem]">
          {textoDia(hecha.inicio.slice(0, 10))}, a las {textoHora(hecha.inicio)}, para {hecha.personas} {hecha.personas === 1 ? "persona" : "personas"}, a nombre de{" "}
          {hecha.nombre}.
        </p>
        <p className="mt-3 text-[1rem] text-fg-ceniza">Te guardamos la mesa 15 minutos. Si no puedes venir, avísanos por WhatsApp para dársela a otra persona.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={RAIZ} className={botonPrincipal}>
            Volver al inicio
          </Link>
          <Link href={`${RAIZ}/panel/reservas?dia=${hecha.inicio.slice(0, 10)}`} className="inline-flex h-12 items-center px-4 font-semibold text-fg-cobalto underline underline-offset-4">
            Verla en el panel
          </Link>
        </div>
      </div>
    )
  }

  const digitos = telefono.replace(/\D/g, "")
  const errores: Record<string, string> = {}
  if (!hora) errores.hora = "Elige una hora."
  if (nombre.trim().length < 2) errores.nombre = "Escribe tu nombre para anotar la reserva."
  if (digitos.length !== 10 || !digitos.startsWith("3")) errores.telefono = "Escribe un celular de 10 dígitos que empiece por 3."

  const error = (k: string) =>
    intento && errores[k] ? (
      <p id={`${id}-${k}-error`} className="mt-1.5 text-[0.875rem] font-semibold text-fg-aji">
        {errores[k]}
      </p>
    ) : null

  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault()
        setIntento(true)
        if (Object.keys(errores).length || !hora) return
        setHecha(reservarMesa({ nombre: nombre.trim(), telefono: telefono.trim(), personas, inicio: hora, nota }))
      }}
      className="mx-auto max-w-3xl px-4 pt-10 pb-24 sm:px-6 lg:pt-14"
    >
      <Link href={RAIZ} className="text-[0.9375rem] font-semibold text-fg-cobalto underline underline-offset-4 hover:no-underline">
        Volver al inicio
      </Link>
      <h1 className="mt-4 font-fg-letrero text-[2.75rem] leading-none text-fg-cobalto">Reserva tu mesa</h1>
      <p className="mt-3 text-[1.0625rem] text-fg-ceniza">Para grupos de más de diez, escríbenos por WhatsApp y armamos la mesa.</p>

      <fieldset className="mt-10">
        <legend className="font-fg-letrero text-[1.5rem]">¿Qué día?</legend>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {dias.map((d) => (
            <label key={d.dia} className="shrink-0 cursor-pointer rounded-[14px] border-2 border-fg-linea bg-white px-4 py-3 text-center has-[:checked]:border-fg-cobalto has-[:checked]:bg-fg-peltre has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-fg-cobalto">
              <input
                type="radio"
                name={`${id}-dia`}
                className="sr-only"
                checked={diaActual === d.dia}
                onChange={() => {
                  setDia(d.dia)
                  setHora(null)
                }}
              />
              <span className="block text-[0.875rem] text-fg-ceniza">{d.dia === hoy ? "Hoy" : CORTO.format(aFecha(d.dia)).split(" ")[0]}</span>
              <span className="block text-[1.25rem] font-bold">{aFecha(d.dia).getDate()}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Punto id="horas" className="mt-10">
        <fieldset>
          <legend className="font-fg-letrero text-[1.5rem]">¿A qué hora?</legend>
          <div role="radiogroup" aria-label="Hora" aria-describedby={intento && errores.hora ? `${id}-hora-error` : undefined} className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {horas.map((h) => {
              const libres = cuposLibres(e, h)
              return (
                <label key={h} className={`rounded-[12px] border-2 px-2 py-2.5 text-center ${libres ? "cursor-pointer border-fg-linea bg-white has-[:checked]:border-fg-cobalto has-[:checked]:bg-fg-cobalto has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-fg-cobalto" : "border-dashed border-fg-linea text-fg-ceniza"}`}>
                  <input type="radio" name={`${id}-hora`} className="sr-only" disabled={!libres} checked={hora === h} onChange={() => setHora(h)} />
                  <span className="block text-[0.9375rem] font-semibold">{textoHora(h)}</span>
                  {!libres && <span className="block text-[0.75rem]">Completo</span>}
                </label>
              )
            })}
          </div>
          {error("hora")}
        </fieldset>
      </Punto>

      <fieldset className="mt-10">
        <legend className="font-fg-letrero text-[1.5rem]">Tus datos</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="font-semibold">Personas</span>
            <select value={personas} onChange={(ev) => setPersonas(Number(ev.target.value))} className={campo}>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-semibold">Nombre</span>
            <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} aria-invalid={intento && Boolean(errores.nombre)} aria-describedby={intento && errores.nombre ? `${id}-nombre-error` : undefined} />
            {error("nombre")}
          </label>
          <label className="block">
            <span className="font-semibold">Celular</span>
            <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} aria-invalid={intento && Boolean(errores.telefono)} aria-describedby={intento && errores.telefono ? `${id}-telefono-error` : undefined} />
            {error("telefono")}
          </label>
          <label className="block sm:col-span-3">
            <span className="font-semibold">¿Algo que debamos saber?</span> <span className="text-[0.875rem] text-fg-ceniza">Opcional</span>
            <input value={nota} onChange={(ev) => setNota(ev.target.value)} placeholder="Cumpleaños, silla para bebé…" className={campo} />
          </label>
        </div>
      </fieldset>

      <button type="submit" className={`${botonPrincipal} mt-10 w-full sm:w-auto`}>
        Reservar la mesa
      </button>
    </form>
  )
}
