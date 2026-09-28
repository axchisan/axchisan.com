"use client"

import { useState } from "react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { Punto } from "@/demos/comun/recorrido"
import { aFecha, claveDia, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { cambiarEstadoReserva, useRestaurante } from "../estado"
import { HORARIO, type Reserva } from "../modelo"
import { Cargando, Encabezado } from "./marco"

const CORTO = new Intl.DateTimeFormat("es-CO", { weekday: "short" })

const ESTADO: Record<Reserva["estado"], { texto: string; clase: string }> = {
  confirmada: { texto: "Confirmada", clase: "bg-[#e6ecf8] text-fg-cobalto" },
  llego: { texto: "Llegó", clase: "bg-fg-exito-suave text-fg-exito" },
  cancelada: { texto: "No vino", clase: "bg-fg-aji-suave text-fg-aji" },
}

export function ReservasFogon({ diaInicial }: { diaInicial?: string }) {
  const e = useRestaurante()
  const [dia, setDia] = useState<string | null>(diaInicial ?? null)

  return (
    <SoloEnNivel nivel="sistema">
      {!e ? (
        <Cargando />
      ) : (
        (() => {
          const hoy = claveDia(new Date())
          const actual = dia ?? hoy
          const dias = Array.from({ length: 7 }, (_, i) => sumarDias(hoy, i))
          const delDia = e.reservas.filter((r) => r.inicio.startsWith(actual))
          const vienen = delDia.filter((r) => r.estado !== "cancelada")
          const personas = vienen.reduce((t, r) => t + r.personas, 0)
          return (
            <>
              <Encabezado titulo="Reservas" detalle={`${textoDia(actual)}: ${vienen.length} ${vienen.length === 1 ? "reserva" : "reservas"}, ${personas} personas.`} />
              <div className="px-4 py-6 sm:px-8">
                <div role="group" aria-label="Día" className="flex gap-2 overflow-x-auto pb-1">
                  {dias.map((d) => {
                    const n = e.reservas.filter((r) => r.inicio.startsWith(d) && r.estado !== "cancelada").length
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={actual === d}
                        onClick={() => setDia(d)}
                        className={`shrink-0 rounded-[14px] border-2 px-4 py-2 text-center ${actual === d ? "border-fg-cobalto bg-fg-cobalto text-white" : "border-fg-linea bg-white hover:border-fg-cobalto"}`}
                      >
                        <span className="block text-[0.8125rem]">{d === hoy ? "Hoy" : CORTO.format(aFecha(d))}</span>
                        <span className="block text-[1.125rem] font-bold">{aFecha(d).getDate()}</span>
                        <span className="block text-[0.75rem]">{HORARIO[aFecha(d).getDay()] ? `${n} res.` : "Cerrado"}</span>
                      </button>
                    )
                  })}
                </div>

                <Punto id="dia" className="mt-6">
                  {delDia.length === 0 ? (
                    <p className="rounded-[16px] bg-white p-6 text-fg-ceniza">No hay reservas para este día. Las que se hagan desde la página aparecen aquí.</p>
                  ) : (
                    <ul className="divide-y divide-fg-linea rounded-[16px] bg-white ring-1 ring-fg-linea">
                      {delDia.map((r) => (
                        <li key={r.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-5">
                          <p className="w-24 text-[1.125rem] font-bold tabular-nums">{textoHora(r.inicio)}</p>
                          <div className="min-w-[12rem] flex-1">
                            <p className="font-semibold">
                              {r.nombre}, {r.personas} {r.personas === 1 ? "persona" : "personas"}
                            </p>
                            <p className="text-[0.875rem] text-fg-ceniza">
                              {r.telefono}
                              {r.origen === "web" ? ", reservó en la página" : ", reservó por teléfono"}
                            </p>
                            {r.nota && <p className="mt-1 inline-block rounded-[6px] bg-fg-alerta-suave px-2 py-0.5 text-[0.875rem] font-semibold text-fg-alerta">{r.nota}</p>}
                          </div>
                          <span className={`rounded-full px-3 py-1 text-[0.8125rem] font-bold ${ESTADO[r.estado].clase}`}>{ESTADO[r.estado].texto}</span>
                          {r.estado === "confirmada" && (
                            <span className="flex gap-2">
                              <button type="button" onClick={() => cambiarEstadoReserva(r.id, "cancelada")} className="h-9 rounded-full px-3 text-[0.875rem] font-semibold text-fg-aji hover:bg-fg-aji-suave">
                                No vino
                              </button>
                              <button type="button" onClick={() => cambiarEstadoReserva(r.id, "llego")} className="h-9 rounded-full bg-fg-cobalto px-4 text-[0.875rem] font-bold text-white hover:bg-fg-cobalto-2">
                                Llegó
                                <span className="sr-only">: {r.nombre}</span>
                              </button>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </Punto>
              </div>
            </>
          )
        })()
      )}
    </SoloEnNivel>
  )
}
