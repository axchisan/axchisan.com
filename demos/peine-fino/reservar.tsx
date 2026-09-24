"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, CalendarCheck, CalendarPlus, Check } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { claveDia, sumarDias, sumarMinutos, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { RAIZ } from "./config"
import { buscarPorTelefono, horasLibres, reservar, useSalon } from "./estado"
import {
  CATEGORIAS,
  duracion,
  precio,
  profesional,
  quienesHacen,
  SALON,
  SERVICIOS,
  servicio,
  textoDuracion,
  type Cita,
} from "./modelo"

const PASOS = ["Servicios", "Profesional", "Día y hora", "Tus datos"] as const

const campo =
  "mt-2 block h-12 w-full rounded-[4px] border-2 border-pf-linea bg-white px-4 text-[1.0625rem] outline-none focus:border-pf-cordoban"

export function Reservar({ serviciosIniciales, profesionalInicial }: { serviciosIniciales?: string; profesionalInicial?: string }) {
  const salon = useSalon()
  const [paso, setPaso] = useState(0)
  const [elegidos, setElegidos] = useState<string[]>(() =>
    (serviciosIniciales ?? "").split(",").filter((id) => SERVICIOS.some((s) => s.id === id)),
  )
  const [quien, setQuien] = useState(() => (profesionalInicial && SERVICIOS.some((s) => s.profesionales.includes(profesionalInicial)) ? profesionalInicial : ""))
  const [dia, setDia] = useState("")
  const [hora, setHora] = useState<{ inicio: string; profesionalId: string } | null>(null)
  const [telefono, setTelefono] = useState("")
  const [nombre, setNombre] = useState("")
  const [nota, setNota] = useState("")
  const [error, setError] = useState("")
  const [cita, setCita] = useState<Cita | null>(null)

  const posibles = quienesHacen(elegidos)
  const dias = useMemo(() => {
    if (!salon || elegidos.length === 0 || posibles.length === 0) return []
    const hoy = claveDia(new Date())
    return Array.from({ length: 21 }, (_, i) => sumarDias(hoy, i))
      .map((d) => ({ dia: d, libres: horasLibres(salon, d, elegidos, quien || undefined) }))
      .filter((d) => d.libres.length > 0)
      .slice(0, 14)
  }, [salon, elegidos, quien, posibles.length])
  const diaElegido = dias.find((d) => d.dia === dia) ?? dias[0]

  if (!salon) return <div className="min-h-[60vh]" aria-busy="true" />

  const cliente = buscarPorTelefono(salon, telefono)

  function alternar(id: string) {
    setError("")
    setHora(null)
    setElegidos((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]))
  }

  function continuar() {
    setError("")
    if (paso === 0) {
      if (elegidos.length === 0) return setError("Elige al menos un servicio.")
      if (posibles.length === 0) return setError("Esos servicios los hacen personas distintas. Resérvalos por separado.")
      if (quien && !posibles.includes(quien)) setQuien("")
    }
    if (paso === 2 && !hora) return setError("Elige una hora.")
    setPaso((p) => p + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function confirmar() {
    setError("")
    if (telefono.replace(/\D/g, "").length < 10) return setError("Escribe tu celular de 10 dígitos.")
    if (!cliente && nombre.trim().length < 3) return setError("Escribe tu nombre.")
    if (!hora) return
    const base = { servicios: elegidos, profesionalId: hora.profesionalId, inicio: hora.inicio, origen: "web" as const, nota }
    setCita(cliente ? reservar({ ...base, clienteId: cliente.id }) : reservar({ ...base, cliente: { nombre, telefono } }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (cita) return <Confirmada cita={cita} nombre={(cliente?.nombre ?? nombre).split(" ")[0]} />

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-6 pb-20 sm:px-6 lg:grid-cols-12 lg:pt-12">
      <div className="min-w-0 lg:col-span-8">
        <Link href={RAIZ} className="inline-flex items-center gap-1.5 text-[0.9375rem] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver a Peine Fino
        </Link>
        <h1 className="mt-4 font-pf-letrero text-[3.0625rem] leading-none font-extrabold text-pf-cordoban uppercase">Reservar</h1>

        <ol className="mt-6 flex gap-2" aria-label="Pasos">
          {PASOS.map((p, i) => (
            <li key={p} className="flex-1">
              <span className={`block h-1 ${i <= paso ? "bg-pf-cordoban" : "bg-pf-linea"}`} aria-hidden />
              <span
                className={`mt-2 block text-[0.8125rem] sm:text-[0.9375rem] ${i === paso ? "font-semibold" : "text-pf-humo"}`}
                aria-current={i === paso ? "step" : undefined}
              >
                {i + 1}. {p}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          {paso === 0 && (
            <Punto id="servicios">
              <h2 className="text-[1.5625rem] font-bold">¿Qué te vas a hacer?</h2>
              <p className="mt-1 text-[0.9375rem] text-pf-humo">Puedes elegir varios: se hacen seguidos, con la misma persona.</p>
              {CATEGORIAS.map((cat) => (
                <fieldset key={cat} className="mt-6">
                  <legend className="font-pf-letrero text-[1.25rem] font-bold tracking-[0.04em] text-pf-cordoban uppercase">{cat}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {SERVICIOS.filter((s) => s.categoria === cat).map((s) => {
                      const activo = elegidos.includes(s.id)
                      return (
                        <label
                          key={s.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-[4px] border-2 bg-white p-3.5 transition-colors ${
                            activo ? "border-pf-cordoban" : "border-transparent hover:border-pf-linea"
                          }`}
                        >
                          <input type="checkbox" checked={activo} onChange={() => alternar(s.id)} className="h-5 w-5 accent-pf-cordoban" />
                          <span className="flex-1">
                            <span className="block font-semibold">{s.nombre}</span>
                            <span className="block text-[0.875rem] text-pf-humo">{textoDuracion(s.duracionMin)}</span>
                          </span>
                          <span className="text-right font-semibold tabular-nums">
                            {s.desde && <span className="block text-[0.75rem] font-normal">desde</span>}
                            {pesos(s.precio)}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </Punto>
          )}

          {paso === 1 && (
            <Punto id="profesional">
              <h2 className="text-[1.5625rem] font-bold">¿Con quién?</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Profesional">
                {[{ id: "", nombre: "Quien esté libre", especialidad: "Te mostramos más horas disponibles" }, ...posibles.map((id) => profesional(id))].map((p) => (
                  <button
                    key={p.id || "cualquiera"}
                    type="button"
                    role="radio"
                    aria-checked={quien === p.id}
                    onClick={() => {
                      setQuien(p.id)
                      setHora(null)
                    }}
                    className={`rounded-[4px] border-2 bg-white p-4 text-left transition-colors ${
                      quien === p.id ? "border-pf-cordoban" : "border-transparent hover:border-pf-linea"
                    }`}
                  >
                    <span className="block text-[1.0625rem] font-semibold">{p.nombre}</span>
                    <span className="mt-0.5 block text-[0.875rem] text-pf-humo">{p.especialidad}</span>
                  </button>
                ))}
              </div>
            </Punto>
          )}

          {paso === 2 && (
            <Punto id="horas">
              <h2 className="text-[1.5625rem] font-bold">¿Cuándo?</h2>
              {dias.length === 0 ? (
                <p className="mt-4 text-pf-humo">No hay horas libres en las próximas tres semanas. Escríbenos por WhatsApp.</p>
              ) : (
                <>
                  <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-2">
                    <div className="flex gap-2" role="radiogroup" aria-label="Día">
                      {dias.map((d) => {
                        const f = new Date(`${d.dia}T12:00`)
                        const activo = diaElegido?.dia === d.dia
                        return (
                          <button
                            key={d.dia}
                            type="button"
                            role="radio"
                            aria-checked={activo}
                            aria-label={textoDia(d.dia)}
                            onClick={() => {
                              setDia(d.dia)
                              setHora(null)
                            }}
                            className={`flex w-[64px] shrink-0 flex-col items-center rounded-[4px] border-2 py-2 ${
                              activo ? "border-pf-cordoban bg-pf-cordoban text-white" : "border-pf-linea bg-white"
                            }`}
                          >
                            <span className="text-[0.8125rem] capitalize">{f.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", "")}</span>
                            <span className="font-pf-letrero text-[1.75rem] leading-tight font-bold">{f.getDate()}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {diaElegido && (
                    <div className="mt-6">
                      <p className="font-semibold">{textoDia(diaElegido.dia)}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Hora">
                        {diaElegido.libres.map((h) => {
                          const activo = hora?.inicio === h.inicio
                          return (
                            <button
                              key={h.inicio}
                              type="button"
                              role="radio"
                              aria-checked={activo}
                              onClick={() => setHora({ inicio: h.inicio, profesionalId: h.profesionales[0] })}
                              className={`h-11 rounded-[4px] border-2 text-[0.9375rem] font-semibold tabular-nums ${
                                activo ? "border-pf-cordoban bg-pf-cordoban text-white" : "border-pf-linea bg-white hover:border-pf-cordoban"
                              }`}
                            >
                              {textoHora(h.inicio)}
                            </button>
                          )
                        })}
                      </div>
                      {hora && (
                        <p className="mt-4 text-[0.9375rem] text-pf-humo">
                          Te atiende {profesional(hora.profesionalId).nombre}. Terminas hacia las{" "}
                          {/* Sin punto final: la hora ya termina en «m.» */}
                          {textoHora(sumarMinutos(hora.inicio, duracion(elegidos)))}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </Punto>
          )}

          {paso === 3 && (
            <div className="max-w-xl">
              <h2 className="text-[1.5625rem] font-bold">Tus datos</h2>
              <label className="mt-5 block">
                <span className="font-semibold">Tu celular</span>
                <input type="tel" inputMode="tel" autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="301 000 0000" className={campo} />
              </label>
              {cliente ? (
                <p className="mt-4 text-[1.0625rem]">
                  Hola de nuevo, <strong>{cliente.nombre.split(" ")[0]}</strong>.
                </p>
              ) : (
                telefono.replace(/\D/g, "").length >= 10 && (
                  <label className="mt-5 block">
                    <span className="font-semibold">Tu nombre</span>
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className={campo} />
                  </label>
                )
              )}
              <label className="mt-5 block">
                <span className="font-semibold">
                  ¿Algo que debamos saber? <span className="font-normal text-pf-humo">(opcional)</span>
                </span>
                <textarea
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  rows={3}
                  placeholder="Por ejemplo: quiero el mismo degradado de la última vez."
                  className="mt-2 block w-full rounded-[4px] border-2 border-pf-linea bg-white p-4 text-[1.0625rem] outline-none focus:border-pf-cordoban"
                />
              </label>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-6 font-semibold text-pf-cordoban">
            {error}
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {paso > 0 && (
            <button type="button" onClick={() => setPaso((p) => p - 1)} className="inline-flex h-12 items-center rounded-[4px] border-2 border-pf-tinta px-6 font-semibold hover:bg-white">
              Atrás
            </button>
          )}
          {paso < 3 ? (
            <button type="button" onClick={continuar} className="inline-flex h-12 items-center rounded-[4px] bg-pf-cordoban px-7 font-semibold text-white hover:bg-pf-cordoban-2">
              Continuar
            </button>
          ) : (
            <button type="button" onClick={confirmar} className="inline-flex h-12 items-center gap-2 rounded-[4px] bg-pf-cordoban px-7 font-semibold text-white hover:bg-pf-cordoban-2">
              <Check className="h-5 w-5" aria-hidden />
              Confirmar reserva
            </button>
          )}
        </div>
      </div>

      <aside className="min-w-0 lg:col-span-4 lg:pt-[7.5rem]">
        <div className="rounded-[6px] bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-pf-letrero text-[1.5625rem] leading-none font-bold text-pf-cordoban uppercase">Tu reserva</h2>
          {elegidos.length === 0 ? (
            <p className="mt-4 text-[0.9375rem] text-pf-humo">Todavía no has elegido servicios.</p>
          ) : (
            <ul className="mt-4 space-y-1.5 text-[0.9375rem]">
              {elegidos.map((id) => (
                <li key={id} className="flex justify-between gap-3">
                  <span>{servicio(id).nombre}</span>
                  <span className="tabular-nums">{pesos(servicio(id).precio)}</span>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-4 space-y-1.5 border-t border-pf-linea pt-4 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt className="text-pf-humo">Duración</dt>
              <dd className="font-semibold">{elegidos.length ? textoDuracion(duracion(elegidos)) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-pf-humo">Con</dt>
              <dd className="font-semibold">{hora ? profesional(hora.profesionalId).nombre : quien ? profesional(quien).nombre : "Por elegir"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-pf-humo">Cuándo</dt>
              <dd className="text-right font-semibold">{hora ? `${textoDia(hora.inicio.slice(0, 10))}, ${textoHora(hora.inicio)}` : "Por elegir"}</dd>
            </div>
            <div className="flex justify-between text-[1.0625rem]">
              <dt>Total</dt>
              <dd className="font-bold tabular-nums">{pesos(precio(elegidos))}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[0.8125rem] text-pf-humo">Se paga en el salón: efectivo, Nequi, Daviplata o tarjeta.</p>
        </div>
      </aside>
    </div>
  )
}

function ics(cita: Cita) {
  const fmt = (clave: string) => clave.replace(/[-:]/g, "") + "00"
  const sello = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Peine Fino (demo de Axchi)//ES",
    "BEGIN:VEVENT",
    `UID:${cita.id}@peinefino.example`,
    `DTSTAMP:${sello}`,
    `DTSTART:${fmt(cita.inicio)}`,
    `DTEND:${fmt(sumarMinutos(cita.inicio, duracion(cita.servicios)))}`,
    `SUMMARY:${cita.servicios.map((s) => servicio(s).nombre).join(" y ")} en Peine Fino`,
    `LOCATION:${SALON.direccion}`,
    `DESCRIPTION:Con ${profesional(cita.profesionalId).nombre}. Demo de Axchi con un negocio ficticio.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

function Confirmada({ cita, nombre }: { cita: Cita; nombre: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-24 sm:px-6 lg:pt-16">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pf-cordoban text-white">
        <CalendarCheck className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mt-6 font-pf-letrero text-[3.0625rem] leading-none font-extrabold text-pf-cordoban uppercase">Listo, {nombre}</h1>
      <p className="mt-5 text-[1.125rem] leading-relaxed text-pf-humo">
        {cita.servicios.map((s) => servicio(s).nombre).join(" y ")}, {textoDia(cita.inicio.slice(0, 10)).toLowerCase()} a las{" "}
        {textoHora(cita.inicio)}, con {profesional(cita.profesionalId).nombre}. Te escribimos por WhatsApp el día anterior para
        confirmarla.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics(cita))}`}
          download="reserva-peine-fino.ics"
          className="inline-flex h-12 items-center gap-2 rounded-[4px] bg-pf-cordoban px-6 font-semibold text-white hover:bg-pf-cordoban-2"
        >
          <CalendarPlus className="h-5 w-5" aria-hidden />
          Agregar a mi calendario
        </a>
        <Link href={RAIZ} className="inline-flex h-12 items-center rounded-[4px] border-2 border-pf-tinta px-6 font-semibold hover:bg-white">
          Volver al inicio
        </Link>
      </div>
      <div className="mt-12 rounded-[6px] border-2 border-dashed border-pf-cordoban/30 p-5 font-sans">
        <p className="text-[0.9375rem] font-semibold">Del lado del salón</p>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-pf-humo">La reserva ya aparece en la columna de {profesional(cita.profesionalId).nombre.split(" ")[0]}.</p>
        <Link href={`${RAIZ}/panel?dia=${cita.inicio.slice(0, 10)}`} className="mt-3 inline-block font-semibold underline">
          Verla en el panel
        </Link>
      </div>
    </div>
  )
}
