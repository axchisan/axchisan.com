"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, CalendarCheck } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { claveDia, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { pesos } from "@/lib/catalogo/planes"
import { RAIZ } from "./config"
import { agendar, buscarPorDocumento, horasLibres, useConsultorio } from "./estado"
import { CONSULTORIO, MOTIVOS, motivo, odontologo, type Cita } from "./modelo"
import { botonBorde, botonVioleta, campo } from "./publico"

const PASOS = ["Motivo", "Odontólogo", "Día y hora", "Tus datos"] as const
const CORTO = new Intl.DateTimeFormat("es-CO", { weekday: "short" })

export function AgendarMolar({ motivoInicial }: { motivoInicial?: string }) {
  const e = useConsultorio()
  const inicial = MOTIVOS.some((m) => m.id === motivoInicial) ? motivoInicial! : ""
  const [paso, setPaso] = useState(inicial ? 1 : 0)
  const [motivoId, setMotivo] = useState(inicial)
  const [quien, setQuien] = useState("")
  const [dia, setDia] = useState("")
  const [hora, setHora] = useState<{ inicio: string; odontologoId: string } | null>(null)
  const [documento, setDocumento] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [nota, setNota] = useState("")
  const [error, setError] = useState("")
  const [cita, setCita] = useState<Cita | null>(null)

  const dias = useMemo(() => {
    if (!e || !motivoId) return []
    const hoy = claveDia(new Date())
    return Array.from({ length: 21 }, (_, i) => sumarDias(hoy, i))
      .map((d) => ({ dia: d, libres: horasLibres(e, d, motivoId, quien || undefined) }))
      .filter((d) => d.libres.length > 0)
      .slice(0, 12)
  }, [e, motivoId, quien])
  const diaElegido = dias.find((d) => d.dia === dia) ?? dias[0]

  if (!e) return <div className="min-h-[60vh]" aria-busy="true" />
  const paciente = buscarPorDocumento(e, documento)
  const m = motivoId ? motivo(motivoId) : null

  function siguiente() {
    setError("")
    if (paso === 0 && !motivoId) return setError("Elige el motivo de la cita.")
    if (paso === 2 && !hora) return setError("Elige una hora.")
    setPaso((p) => p + 1)
    window.scrollTo({ top: 0 })
  }

  function confirmar() {
    setError("")
    if (documento.replace(/\D/g, "").length < 6) return setError("Escribe tu número de documento.")
    if (!paciente) {
      if (nombre.trim().length < 3) return setError("Escribe tu nombre completo.")
      const d = telefono.replace(/\D/g, "")
      if (d.length !== 10 || !d.startsWith("3")) return setError("Escribe un celular de 10 dígitos que empiece por 3.")
    }
    if (!hora || !m) return
    const base = { motivo: m.id, odontologoId: hora.odontologoId, inicio: hora.inicio, nota }
    setCita(paciente ? agendar({ ...base, pacienteId: paciente.id }) : agendar({ ...base, paciente: { nombre, documento, telefono } }))
    window.scrollTo({ top: 0 })
  }

  if (cita) {
    const o = odontologo(cita.odontologoId)
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <CalendarCheck className="mx-auto h-12 w-12 text-mo-violeta" aria-hidden />
        <h1 className="mt-4 text-[2.25rem] leading-tight font-extrabold tracking-[-0.03em]">Tu cita quedó agendada</h1>
        <p className="mt-4 text-[1.125rem]">
          {textoDia(cita.inicio.slice(0, 10))}, a las {textoHora(cita.inicio)}: {motivo(cita.motivo).nombre.toLowerCase()} con {o.nombre}.
        </p>
        <p className="mt-3 text-mo-gris">
          Llega diez minutos antes. {CONSULTORIO.direccion}. Si no puedes venir, avísanos por WhatsApp para dar la hora a otro paciente.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={RAIZ} className={botonVioleta}>
            Volver al inicio
          </Link>
          <Link href={`${RAIZ}/panel?dia=${cita.inicio.slice(0, 10)}`} className={botonBorde}>
            Verla en el panel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 pb-20 sm:px-6 lg:pt-12">
      <Link href={RAIZ} className="inline-flex items-center gap-1.5 text-[0.9375rem] hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Volver
      </Link>
      <h1 className="mt-4 text-[2.5rem] leading-none font-extrabold tracking-[-0.04em]">Agendar cita</h1>

      <ol className="mt-6 flex gap-2" aria-label="Pasos">
        {PASOS.map((p, i) => (
          <li key={p} className="flex-1">
            <span className={`block h-1.5 rounded-full ${i <= paso ? "bg-mo-violeta" : "bg-mo-linea"}`} aria-hidden />
            <span className={`mt-2 block text-[0.8125rem] sm:text-[0.9375rem] ${i === paso ? "font-semibold" : "text-mo-gris"}`} aria-current={i === paso ? "step" : undefined}>
              {p}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        {paso === 0 && (
          <Punto id="motivo">
            <fieldset>
              <legend className="text-[1.5rem] font-bold">¿Para qué es la cita?</legend>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {MOTIVOS.map((x) => (
                  <label key={x.id} className="flex cursor-pointer gap-3 rounded-[16px] border-2 border-mo-linea bg-white p-4 has-[:checked]:border-mo-violeta has-[:checked]:bg-mo-lila">
                    <input type="radio" name="motivo" checked={motivoId === x.id} onChange={() => { setMotivo(x.id); setQuien(""); setHora(null) }} className="mt-1 h-5 w-5 accent-mo-violeta" />
                    <span className="flex-1">
                      <span className="flex justify-between gap-3">
                        <span className="font-semibold">{x.nombre}</span>
                        <span className="font-semibold tabular-nums">
                          {x.desde && <span className="text-[0.8125rem] font-normal">desde </span>}
                          {pesos(x.precio)}
                        </span>
                      </span>
                      <span className="mt-1 block text-[0.875rem] leading-relaxed text-mo-gris">{x.descripcion}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </Punto>
        )}

        {paso === 1 && m && (
          <fieldset>
            <legend className="text-[1.5rem] font-bold">¿Con quién?</legend>
            <p className="mt-1 text-mo-gris">{m.nombre} lo atiende{m.odontologos.length > 1 ? "n" : ""} {m.odontologos.map((id) => odontologo(id).nombre).join(" o ")}.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[{ id: "", nombre: "Quien tenga la primera hora", especialidad: "Te mostramos más horas disponibles" }, ...m.odontologos.map(odontologo)].map((o) => (
                <label key={o.id || "cualquiera"} className="cursor-pointer rounded-[16px] border-2 border-mo-linea bg-white p-4 has-[:checked]:border-mo-violeta has-[:checked]:bg-mo-lila">
                  <input type="radio" name="odontologo" className="sr-only" checked={quien === o.id} onChange={() => { setQuien(o.id); setHora(null) }} />
                  <span className="block font-semibold">{o.nombre}</span>
                  <span className="mt-0.5 block text-[0.875rem] text-mo-gris">{o.especialidad}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {paso === 2 && m && (
          <Punto id="horas">
            <h2 className="text-[1.5rem] font-bold">¿Cuándo?</h2>
            {m.id === "dolor" && <p className="mt-1 text-mo-gris">Las citas por dolor se dan desde dentro de 15 minutos.</p>}
            {dias.length === 0 ? (
              <p className="mt-4 text-mo-gris">No hay horas libres en las próximas tres semanas. Escríbenos por WhatsApp.</p>
            ) : (
              <>
                <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-2">
                  <div className="flex gap-2" role="radiogroup" aria-label="Día">
                    {dias.map((d) => {
                      const activo = diaElegido?.dia === d.dia
                      return (
                        <button
                          key={d.dia}
                          type="button"
                          role="radio"
                          aria-checked={activo}
                          aria-label={textoDia(d.dia)}
                          onClick={() => { setDia(d.dia); setHora(null) }}
                          className={`flex w-16 shrink-0 flex-col items-center rounded-[14px] border-2 py-2 ${activo ? "border-mo-violeta bg-mo-violeta text-white" : "border-mo-linea bg-white"}`}
                        >
                          <span className="text-[0.8125rem]">{d.dia === claveDia(new Date()) ? "Hoy" : CORTO.format(new Date(`${d.dia}T12:00`))}</span>
                          <span className="text-[1.25rem] font-bold">{Number(d.dia.slice(8))}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div role="radiogroup" aria-label="Hora" className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {diaElegido?.libres.map((h) => {
                    const activo = hora?.inicio === h.inicio
                    return (
                      <button
                        key={h.inicio}
                        type="button"
                        role="radio"
                        aria-checked={activo}
                        onClick={() => setHora({ inicio: h.inicio, odontologoId: quien || h.profesionales[0] })}
                        className={`h-11 rounded-[12px] border-2 text-[0.9375rem] font-semibold ${activo ? "border-mo-violeta bg-mo-violeta text-white" : "border-mo-linea bg-white hover:border-mo-violeta"}`}
                      >
                        {textoHora(h.inicio)}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </Punto>
        )}

        {paso === 3 && m && hora && (
          <Punto id="paciente">
            <h2 className="text-[1.5rem] font-bold">Tus datos</h2>
            <p className="mt-1 text-mo-gris">
              {textoDia(hora.inicio.slice(0, 10))}, a las {textoHora(hora.inicio)}: {m.nombre.toLowerCase()} con {odontologo(hora.odontologoId).nombre}.
            </p>
            <div className="mt-6 grid max-w-xl gap-4">
              <label className="block">
                <span className="font-semibold">Número de documento</span>
                <input value={documento} onChange={(ev) => setDocumento(ev.target.value)} inputMode="numeric" autoComplete="off" className={campo} />
              </label>
              {paciente ? (
                <p role="status" className="rounded-[12px] bg-mo-lila px-4 py-3 font-semibold">
                  Hola de nuevo, {paciente.nombre.split(" ")[0]}. Ya tenemos tus datos.
                </p>
              ) : (
                <>
                  <label className="block">
                    <span className="font-semibold">Nombre completo</span>
                    <input value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" className={campo} />
                  </label>
                  <label className="block">
                    <span className="font-semibold">Celular</span>
                    <input value={telefono} onChange={(ev) => setTelefono(ev.target.value)} inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={campo} />
                  </label>
                </>
              )}
              <label className="block">
                <span className="font-semibold">¿Algo que debamos saber?</span> <span className="text-[0.875rem] text-mo-gris">Opcional</span>
                <input value={nota} onChange={(ev) => setNota(ev.target.value)} placeholder="Me duele al tomar frío, soy alérgico a…" className={campo} />
              </label>
            </div>
          </Punto>
        )}

        {error && (
          <p role="alert" className="mt-6 font-semibold text-mo-rojo">
            {error}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          {paso > 0 && (
            <button type="button" onClick={() => { setError(""); setPaso((p) => p - 1) }} className={botonBorde}>
              Atrás
            </button>
          )}
          {paso < 3 ? (
            <button type="button" onClick={siguiente} className={botonVioleta}>
              Continuar
            </button>
          ) : (
            <button type="button" onClick={confirmar} className={botonVioleta}>
              Confirmar cita
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
