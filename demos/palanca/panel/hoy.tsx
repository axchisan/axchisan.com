"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Punto } from "@/demos/comun/recorrido"
import { useAhora } from "@/demos/comun/reloj"
import { claveDia, claveInstante, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { enEspera, ocupados, sesionesDelDia } from "@/demos/motores/clases/cupos"
import { marcarAsistencia, socioPorId, useGimnasio } from "../estado"
import { coach, HORARIO, tipo } from "../modelo"
import { EtiquetaTipo } from "../publico"
import { Cargando, Encabezado } from "./marco"

export function HoyPalanca() {
  const e = useGimnasio()
  const ahora = useAhora()
  const [dia, setDia] = useState<string | null>(null)
  if (!e || !ahora) return <Cargando />
  const actual = dia ?? claveDia(ahora)
  const ahoraClave = claveInstante(ahora)
  const sesiones = sesionesDelDia(HORARIO, actual)
  const reservados = sesiones.reduce((t, s) => t + ocupados(e.reservas, s.sesionId), 0)
  const cupos = sesiones.reduce((t, s) => t + s.cupo, 0)

  return (
    <>
      <Encabezado
        titulo="CLASES"
        detalle={sesiones.length ? `${textoDia(actual)}: ${sesiones.length} clases, ${reservados} de ${cupos} puestos tomados.` : `${textoDia(actual)}: sin clases.`}
        accion={
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setDia(sumarDias(actual, -1))} className="rounded-[4px] p-2 hover:bg-pa-tiza" aria-label="Día anterior">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" onClick={() => setDia(null)} className="h-9 rounded-[4px] border-2 border-pa-linea px-4 font-semibold hover:border-pa-hierro">
              Hoy
            </button>
            <button type="button" onClick={() => setDia(sumarDias(actual, 1))} className="rounded-[4px] p-2 hover:bg-pa-tiza" aria-label="Día siguiente">
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        }
      />
      <Punto id="sesiones" className="px-4 py-6 sm:px-8">
        {sesiones.length === 0 ? (
          <p className="rounded-[6px] bg-white p-6 text-pa-gris">No hay clases este día.</p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {sesiones.map((s, i) => {
              const t = tipo(s.tipo)
              const tomados = ocupados(e.reservas, s.sesionId)
              const lista = e.reservas.filter((r) => r.sesionId === s.sesionId && (r.estado === "reservada" || r.estado === "asistio" || r.estado === "no-asistio"))
              const espera = enEspera(e.reservas, s.sesionId)
              const empezo = s.inicio <= ahoraClave
              const tarjeta = (
                <article aria-label={`${t.nombre} de las ${textoHora(s.inicio)}`} className="rounded-[6px] bg-white p-4 ring-1 ring-pa-linea">
                  <header className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-pa-titulo text-[1.375rem] leading-none font-bold tabular-nums">{textoHora(s.inicio)}</p>
                      <p className="mt-1 text-[0.875rem] text-pa-gris">{coach(s.coachId).nombre}</p>
                    </div>
                    <EtiquetaTipo tipo={t} />
                  </header>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-pa-tiza" aria-hidden>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (tomados / s.cupo) * 100)}%`, background: t.claro ? "#b88d00" : t.color }} />
                  </div>
                  <p className="mt-1.5 text-[0.8125rem] text-pa-gris">
                    {tomados} de {s.cupo} puestos{espera.length ? `, ${espera.length} en espera` : ""}
                  </p>
                  {lista.length > 0 && (
                    <ul className="mt-3 divide-y divide-pa-linea border-t border-pa-linea">
                      {lista.map((r) => {
                        const socio = socioPorId(e, r.socioId)
                        return (
                          <li key={r.id} className="flex items-center justify-between gap-2 py-1.5 text-[0.9375rem]">
                            <span className={r.estado === "no-asistio" ? "text-pa-gris line-through" : ""}>
                              {socio?.nombre}
                              {socio?.invitado && <span className="ml-1.5 rounded-[3px] bg-pa-alerta-suave px-1.5 text-[0.75rem] font-bold text-pa-alerta no-underline">Prueba</span>}
                            </span>
                            {empezo ? (
                              <span className="flex gap-1">
                                <button
                                  type="button"
                                  aria-pressed={r.estado === "asistio"}
                                  onClick={() => marcarAsistencia(r.id, true)}
                                  className={`h-7 rounded-[3px] px-2 text-[0.75rem] font-bold ${r.estado === "asistio" ? "bg-pa-exito text-white" : "border border-pa-linea text-pa-gris hover:border-pa-exito"}`}
                                >
                                  Vino<span className="sr-only">: {socio?.nombre}</span>
                                </button>
                                <button
                                  type="button"
                                  aria-pressed={r.estado === "no-asistio"}
                                  onClick={() => marcarAsistencia(r.id, false)}
                                  className={`h-7 rounded-[3px] px-2 text-[0.75rem] font-bold ${r.estado === "no-asistio" ? "bg-pa-rojo text-white" : "border border-pa-linea text-pa-gris hover:border-pa-rojo"}`}
                                >
                                  No vino<span className="sr-only">: {socio?.nombre}</span>
                                </button>
                              </span>
                            ) : (
                              <span className="text-[0.75rem] text-pa-gris">Reservó</span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  {espera.length > 0 && (
                    <p className="mt-3 text-[0.8125rem] text-pa-gris">
                      En espera: {espera.map((r) => socioPorId(e, r.socioId)?.nombre.split(" ")[0]).join(", ")}.
                    </p>
                  )}
                </article>
              )
              return <li key={s.sesionId}>{i === sesiones.findIndex((x) => x.inicio <= ahoraClave) ? <Punto id="asistencia">{tarjeta}</Punto> : tarjeta}</li>
            })}
          </ul>
        )}
      </Punto>
    </>
  )
}
