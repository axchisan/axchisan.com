"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Globe, X } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { pesos } from "@/lib/catalogo/planes"
import { aFecha, claveDia, sumarDias, sumarMinutos, textoDia, textoHora, textoHoraDecimal } from "@/demos/motores/agenda/tiempo"
import { RAIZ } from "../config"
import { cambiarEstado, useSalon } from "../estado"
import { duracion, HORARIO, METODOS, precio, PROFESIONALES, servicio, type Cita, type EstadoCita } from "../modelo"
import { Cargando, Encabezado } from "./marco"

const FILA = 44 // px por media hora: caben nombre y servicio

const ESTADOS: Record<EstadoCita, { texto: string; clase: string }> = {
  agendada: { texto: "Agendada", clase: "bg-white text-pf-tinta" },
  "en-silla": { texto: "En la silla", clase: "bg-pf-alerta-suave text-pf-alerta" },
  atendida: { texto: "Atendida", clase: "bg-pf-exito-suave text-pf-exito" },
  "no-asistio": { texto: "No vino", clase: "bg-pf-linea text-pf-humo" },
}

export function HoySalon({ diaInicial }: { diaInicial?: string }) {
  const salon = useSalon()
  const { incluye } = useDemo()
  const hoy = claveDia(new Date())
  const [dia, setDia] = useState(diaInicial && /^\d{4}-\d{2}-\d{2}$/.test(diaInicial) ? diaInicial : hoy)
  const [abierta, setAbierta] = useState<Cita | null>(null)
  const dialogo = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (abierta && !dialogo.current?.open) dialogo.current?.showModal()
  }, [abierta])

  if (!salon) return <Cargando />

  const diaSemana = aFecha(dia).getDay()
  const horario = HORARIO[diaSemana]
  const trabajan = PROFESIONALES.filter((p) => p.dias.includes(diaSemana))
  const citas = salon.citas.filter((c) => c.inicio.startsWith(dia))
  const nombre = (id: string) => salon.clientes.find((c) => c.id === id)?.nombre ?? "Cliente"
  const vigente = abierta && salon.citas.find((c) => c.id === abierta.id)
  const totalDia = citas.filter((c) => c.estado !== "no-asistio").reduce((t, c) => t + precio(c.servicios), 0)

  return (
    <>
      <Encabezado
        titulo={dia === hoy ? "Hoy" : textoDia(dia)}
        detalle={`${dia === hoy ? `${textoDia(dia)}. ` : ""}${citas.length} citas, ${pesos(totalDia)} en servicios agendados`}
        accion={
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setDia(sumarDias(dia, -1))} className="rounded-[4px] border-2 border-pf-linea bg-white p-2 hover:border-pf-cordoban" aria-label="Día anterior">
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button type="button" onClick={() => setDia(hoy)} className="h-9 rounded-[4px] border-2 border-pf-linea bg-white px-3 text-[0.9375rem] font-semibold hover:border-pf-cordoban">
              Hoy
            </button>
            <button type="button" onClick={() => setDia(sumarDias(dia, 1))} className="rounded-[4px] border-2 border-pf-linea bg-white p-2 hover:border-pf-cordoban" aria-label="Día siguiente">
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        }
      />

      <div className="px-4 py-6 sm:px-8">
        {!horario || trabajan.length === 0 ? (
          <p className="rounded-[6px] bg-white p-6 text-pf-humo">El salón no abre este día.</p>
        ) : (
          <>
            {/* Escritorio: una columna por silla */}
            <Punto id="columnas" className="hidden md:block">
              <div className="overflow-hidden rounded-[6px] bg-white">
                <div className="grid border-b border-pf-linea" style={{ gridTemplateColumns: `4.5rem repeat(${trabajan.length}, minmax(0,1fr))` }}>
                  <span />
                  {trabajan.map((p) => (
                    <span key={p.id} className="flex items-center gap-2 border-l border-pf-linea px-3 py-3 text-[0.9375rem] font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} aria-hidden />
                      {p.nombre.split(" ")[0]}
                    </span>
                  ))}
                </div>
                <div className="grid" style={{ gridTemplateColumns: `4.5rem repeat(${trabajan.length}, minmax(0,1fr))` }}>
                  <div>
                    {Array.from({ length: horario.cierra - horario.abre }, (_, i) => (
                      <div key={i} className="pr-2 text-right text-[0.75rem] text-pf-humo" style={{ height: FILA * 2 }}>
                        {textoHoraDecimal(horario.abre + i)}
                      </div>
                    ))}
                  </div>
                  {trabajan.map((p) => (
                    <div
                      key={p.id}
                      className="relative border-l border-pf-linea"
                      style={{
                        height: (horario.cierra - horario.abre) * FILA * 2,
                        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${FILA * 2 - 1}px, #e4e0dc ${FILA * 2 - 1}px ${FILA * 2}px)`,
                      }}
                    >
                      {citas
                        .filter((c) => c.profesionalId === p.id)
                        .map((c) => {
                          const f = aFecha(c.inicio)
                          const h = f.getHours() + f.getMinutes() / 60
                          const estado = ESTADOS[c.estado]
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setAbierta(c)}
                              className={`absolute inset-x-1 overflow-hidden rounded-[4px] border-l-4 px-2 py-1 text-left text-[0.8125rem] leading-tight shadow-sm ${estado.clase} ${
                                c.estado === "no-asistio" ? "line-through" : ""
                              }`}
                              style={{
                                top: (h - horario.abre) * FILA * 2 + 1,
                                height: (duracion(c.servicios) / 30) * FILA - 2,
                                borderLeftColor: p.color,
                              }}
                            >
                              <span className="block truncate font-semibold">{nombre(c.clienteId)}</span>
                              <span className="block truncate">{c.servicios.map((s) => servicio(s).nombre).join(" + ")}</span>
                            </button>
                          )
                        })}
                    </div>
                  ))}
                </div>
              </div>
            </Punto>

            {/* Celular: lista por profesional */}
            <div className="space-y-6 md:hidden">
              {trabajan.map((p) => (
                <section key={p.id} aria-label={p.nombre}>
                  <h2 className="flex items-center gap-2 font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} aria-hidden />
                    {p.nombre}
                  </h2>
                  <ul className="mt-2 divide-y divide-pf-linea rounded-[6px] bg-white">
                    {citas
                      .filter((c) => c.profesionalId === p.id)
                      .sort((a, b) => a.inicio.localeCompare(b.inicio))
                      .map((c) => (
                        <li key={c.id}>
                          <button type="button" onClick={() => setAbierta(c)} className="flex w-full gap-3 p-3 text-left">
                            <span className="w-[4.5rem] shrink-0 font-semibold tabular-nums">{textoHora(c.inicio)}</span>
                            <span className="min-w-0 flex-1 text-[0.9375rem]">
                              <span className="block font-semibold">{nombre(c.clienteId)}</span>
                              <span className="block text-pf-humo">{c.servicios.map((s) => servicio(s).nombre).join(" + ")}</span>
                            </span>
                            <span className={`self-start rounded-full px-2 py-0.5 text-[0.75rem] font-semibold ${ESTADOS[c.estado].clase}`}>
                              {ESTADOS[c.estado].texto}
                            </span>
                          </button>
                        </li>
                      ))}
                    {!citas.some((c) => c.profesionalId === p.id) && <li className="p-3 text-[0.9375rem] text-pf-humo">Sin citas.</li>}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>

      <dialog
        ref={dialogo}
        aria-labelledby="cita-titulo"
        onClose={() => setAbierta(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
        className="m-auto w-[min(94vw,440px)] rounded-[8px] bg-white p-0 font-pf-texto text-pf-tinta backdrop:bg-black/50"
      >
        {vigente && (
          <Punto id="estados">
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="cita-titulo" className="text-[1.25rem] font-bold">{nombre(vigente.clienteId)}</h2>
                  <p className="text-[0.9375rem] text-pf-humo">
                    {textoHora(vigente.inicio)} a {textoHora(sumarMinutos(vigente.inicio, duracion(vigente.servicios)))}, con{" "}
                    {PROFESIONALES.find((p) => p.id === vigente.profesionalId)?.nombre}
                  </p>
                </div>
                <button type="button" onClick={() => dialogo.current?.close()} className="rounded-[4px] p-1" aria-label="Cerrar">
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <ul className="mt-4 space-y-1 text-[0.9375rem]">
                {vigente.servicios.map((s) => (
                  <li key={s} className="flex justify-between">
                    <span>{servicio(s).nombre}</span>
                    <span className="tabular-nums">{pesos(servicio(s).precio)}</span>
                  </li>
                ))}
              </ul>
              {vigente.origen === "web" && (
                <p className="mt-3 flex items-center gap-1.5 text-[0.875rem] text-pf-humo">
                  <Globe className="h-4 w-4" aria-hidden /> Reservada desde la página
                </p>
              )}
              {vigente.nota && <p className="mt-2 text-[0.9375rem] italic">«{vigente.nota}»</p>}
              <p className="mt-4">
                <span className={`rounded-full px-2.5 py-1 text-[0.8125rem] font-semibold ${ESTADOS[vigente.estado].clase} border border-pf-linea`}>
                  {ESTADOS[vigente.estado].texto}
                  {vigente.pago ? `, pagada con ${METODOS[vigente.pago.metodo]}` : ""}
                </span>
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {vigente.estado === "agendada" && (
                  <>
                    <Accion onClick={() => cambiarEstado(vigente.id, "en-silla")}>Llegó</Accion>
                    <Accion suave onClick={() => cambiarEstado(vigente.id, "no-asistio")}>
                      No vino
                    </Accion>
                  </>
                )}
                {vigente.estado === "en-silla" && <Accion onClick={() => cambiarEstado(vigente.id, "atendida")}>Terminó</Accion>}
                {vigente.estado === "atendida" && !vigente.pago && incluye("sistema") && (
                  <Link href={`${RAIZ}/panel/caja`} className="inline-flex h-10 items-center rounded-[4px] bg-pf-cordoban px-4 font-semibold text-white hover:bg-pf-cordoban-2">
                    Cobrar en caja
                  </Link>
                )}
                {vigente.estado === "no-asistio" && (
                  <Accion suave onClick={() => cambiarEstado(vigente.id, "agendada")}>
                    Deshacer
                  </Accion>
                )}
                {incluye("sistema") && (
                  <Link href={`${RAIZ}/panel/clientes/${vigente.clienteId}`} className="inline-flex h-10 items-center rounded-[4px] border-2 border-pf-linea px-4 font-semibold hover:border-pf-cordoban">
                    Ver ficha
                  </Link>
                )}
              </div>
            </div>
          </Punto>
        )}
      </dialog>
    </>
  )
}

function Accion({ children, onClick, suave }: { children: React.ReactNode; onClick: () => void; suave?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center rounded-[4px] px-4 font-semibold ${
        suave ? "border-2 border-pf-linea hover:border-pf-cordoban" : "bg-pf-cordoban text-white hover:bg-pf-cordoban-2"
      }`}
    >
      {children}
    </button>
  )
}
