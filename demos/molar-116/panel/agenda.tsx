"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { claveDia, sumarDias, textoDia, textoHora } from "@/demos/motores/agenda/tiempo"
import { RAIZ } from "../config"
import { cambiarEstadoCita, useConsultorio } from "../estado"
import { motivo, ODONTOLOGOS, type Cita, type EstadoCita } from "../modelo"
import { Cargando, Encabezado } from "./marco"

const ESTADO: Record<EstadoCita, { texto: string; clase: string }> = {
  agendada: { texto: "Agendada", clase: "bg-mo-lila text-mo-violeta" },
  llego: { texto: "En consulta", clase: "bg-mo-alerta-suave text-mo-alerta" },
  atendida: { texto: "Atendida", clase: "bg-mo-exito-suave text-mo-exito" },
  "no-asistio": { texto: "No vino", clase: "bg-mo-rojo-suave text-mo-rojo" },
}

export function AgendaMolar({ diaInicial }: { diaInicial?: string }) {
  const e = useConsultorio()
  const { incluye } = useDemo()
  const [dia, setDia] = useState(diaInicial ?? "")
  if (!e) return <Cargando />
  const actual = dia || claveDia(new Date())
  const delDia = e.citas.filter((c) => c.inicio.startsWith(actual))
  const trabajan = ODONTOLOGOS.filter((o) => o.dias.includes(new Date(`${actual}T12:00`).getDay()))

  return (
    <>
      <Encabezado
        titulo="Agenda"
        detalle={`${textoDia(actual)}: ${delDia.length} ${delDia.length === 1 ? "cita" : "citas"}.`}
        accion={
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setDia(sumarDias(actual, -1))} className="rounded-full p-2 hover:bg-mo-lila" aria-label="Día anterior">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" onClick={() => setDia(claveDia(new Date()))} className="h-9 rounded-full border border-mo-linea px-4 text-[0.9375rem] font-semibold hover:border-mo-violeta">
              Hoy
            </button>
            <button type="button" onClick={() => setDia(sumarDias(actual, 1))} className="rounded-full p-2 hover:bg-mo-lila" aria-label="Día siguiente">
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        }
      />
      <Punto id="columnas" className="px-4 py-6 sm:px-8">
        {trabajan.length === 0 ? (
          <p className="rounded-[16px] bg-white p-6 text-mo-gris">El consultorio no atiende este día.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {trabajan.map((o) => {
              const suyas = delDia.filter((c) => c.odontologoId === o.id)
              return (
                <section key={o.id} aria-labelledby={`col-${o.id}`} className="rounded-[18px] bg-white p-4 ring-1 ring-mo-linea">
                  <h2 id={`col-${o.id}`} className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mo-lila text-[0.8125rem] font-bold text-mo-violeta" aria-hidden>
                      {o.iniciales}
                    </span>
                    <span>
                      <span className="block text-[1rem] font-semibold">{o.nombre}</span>
                      <span className="block text-[0.8125rem] font-normal text-mo-gris">{o.especialidad}</span>
                    </span>
                  </h2>
                  {suyas.length === 0 ? (
                    <p className="mt-4 text-[0.9375rem] text-mo-gris">Sin citas.</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {suyas.map((c) => (
                        <FilaCita key={c.id} cita={c} conFicha={incluye("sistema")} />
                      ))}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </Punto>
    </>
  )
}

function FilaCita({ cita: c, conFicha }: { cita: Cita; conFicha: boolean }) {
  const e = useConsultorio()!
  const p = e.pacientes.find((x) => x.id === c.pacienteId)
  const m = motivo(c.motivo)
  return (
    <li className={`rounded-[12px] border-l-4 p-3 ${c.motivo === "dolor" ? "border-mo-rojo bg-mo-rojo-suave/40" : "border-mo-violeta bg-mo-fondo"}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.875rem] font-semibold tabular-nums">
          {textoHora(c.inicio)} <span className="font-normal text-mo-gris">{m.duracionMin} min</span>
        </p>
        <span className={`rounded-full px-2 py-0.5 text-[0.75rem] font-semibold ${ESTADO[c.estado].clase}`}>{ESTADO[c.estado].texto}</span>
      </div>
      <p className="mt-1 font-semibold">
        {conFicha && p ? (
          <Link href={`${RAIZ}/panel/pacientes/${p.id}`} className="hover:underline">
            {p.nombre}
          </Link>
        ) : (
          p?.nombre
        )}
      </p>
      <p className="text-[0.875rem] text-mo-gris">
        {m.nombre}
        {c.origen === "web" ? ", agendó en la página" : ""}
      </p>
      {c.nota && <p className="mt-1 text-[0.875rem]">«{c.nota}»</p>}
      {(c.estado === "agendada" || c.estado === "llego") && (
        <div className="mt-2 flex gap-1.5">
          {c.estado === "agendada" && (
            <button type="button" onClick={() => cambiarEstadoCita(c.id, "llego")} className="h-8 rounded-full bg-mo-violeta px-3 text-[0.8125rem] font-semibold text-white hover:bg-mo-violeta-2">
              Llegó<span className="sr-only">: {p?.nombre}</span>
            </button>
          )}
          {c.estado === "llego" && (
            <button type="button" onClick={() => cambiarEstadoCita(c.id, "atendida")} className="h-8 rounded-full bg-mo-violeta px-3 text-[0.8125rem] font-semibold text-white hover:bg-mo-violeta-2">
              Terminar<span className="sr-only">: {p?.nombre}</span>
            </button>
          )}
          {c.estado === "agendada" && (
            <button type="button" onClick={() => cambiarEstadoCita(c.id, "no-asistio")} className="h-8 rounded-full px-3 text-[0.8125rem] font-semibold text-mo-rojo hover:bg-mo-rojo-suave">
              No vino
            </button>
          )}
        </div>
      )}
    </li>
  )
}
