"use client"

import Link from "next/link"
import { Globe, Phone } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { RAIZ } from "../config"
import { cambiarEstado, profesional, servicio, useClinica } from "../estado"
import { claveDia, textoDia, textoHora, type Cita, type EstadoCita } from "../modelo"
import { CargandoPanel, EncabezadoPanel, PlacaMascota } from "./marco"
import { NuevaCita } from "./nueva-cita"

const ESTADOS: Record<EstadoCita, { texto: string; clase: string }> = {
  agendada: { texto: "Agendada", clase: "bg-cn-nube text-cn-collar" },
  "en-sala": { texto: "En consulta", clase: "bg-cn-pelota text-cn-collar" },
  atendida: { texto: "Atendida", clase: "bg-cn-pino-suave text-cn-pino" },
  "no-asistio": { texto: "No asistió", clase: "bg-cn-coral-suave text-cn-coral" },
}

export function Hoy() {
  const clinica = useClinica()
  const { incluye } = useDemo()
  if (!clinica) return <CargandoPanel />

  const hoy = claveDia(new Date())
  const citas = clinica.citas
    .filter((c) => c.inicio.startsWith(hoy))
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  const cuenta = (e: EstadoCita) => citas.filter((c) => c.estado === e).length
  const desdeWeb = citas.filter((c) => c.origen === "web").length
  const conFicha = incluye("sistema")

  return (
    <>
      <EncabezadoPanel titulo="Hoy" detalle={textoDia(hoy)} accion={<NuevaCita />} />

      <div className="px-4 py-6 sm:px-8">
        <Punto id="resumen">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { t: "Citas", v: citas.length },
              { t: "Por atender", v: cuenta("agendada") },
              { t: "En consulta", v: cuenta("en-sala") },
              { t: "Atendidas", v: cuenta("atendida") },
            ].map((x) => (
              <div key={x.t} className="rounded-[14px] bg-white p-4">
                <dt className="text-[0.875rem] text-cn-pizarra">{x.t}</dt>
                <dd className="mt-1 text-[1.9375rem] leading-none font-bold tabular-nums">{x.v}</dd>
              </div>
            ))}
          </dl>
        </Punto>

        <Punto id="origen" className="mt-6 inline-flex">
          <p className="flex items-center gap-2 text-[0.9375rem]">
            <Globe className="h-4 w-4" aria-hidden />
            <span>
              <strong>{desdeWeb}</strong> de {citas.length} citas de hoy se agendaron desde la página.
            </span>
          </p>
        </Punto>

        <Punto id="lista" className="mt-4">
          {citas.length === 0 ? (
            <p className="rounded-[14px] bg-white p-6 text-cn-pizarra">
              Hoy no hay citas. Agenda una con el botón de arriba.
            </p>
          ) : (
            <ol className="divide-y divide-cn-linea overflow-hidden rounded-[14px] bg-white">
              {citas.map((c) => (
                <FilaCita key={c.id} cita={c} conFicha={conFicha} />
              ))}
            </ol>
          )}
        </Punto>
      </div>
    </>
  )
}

function FilaCita({ cita, conFicha }: { cita: Cita; conFicha: boolean }) {
  const clinica = useClinica()!
  const m = clinica.mascotas.find((x) => x.id === cita.mascotaId)
  const p = m && clinica.propietarios.find((x) => x.id === m.propietarioId)
  if (!m || !p) return null
  const s = servicio(cita.servicioId)
  const pro = profesional(cita.profesionalId)
  const estado = ESTADOS[cita.estado]
  const ficha = `${RAIZ}/panel/pacientes/${m.id}`

  return (
    <li className={`grid gap-3 p-4 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:gap-5 sm:px-5 ${cita.estado === "en-sala" ? "bg-[#fbfde9]" : ""}`}>
      <p className="text-[1.0625rem] font-bold tabular-nums">{textoHora(cita.inicio)}</p>

      <div className="flex min-w-0 items-center gap-3">
        <PlacaMascota nombre={m.nombre} especie={m.especie} foto={m.foto} />
        <div className="min-w-0">
          <p className="text-[1.0625rem]">
            {conFicha ? (
              <Link href={ficha} className="font-bold hover:underline">
                {m.nombre}
              </Link>
            ) : (
              <strong>{m.nombre}</strong>
            )}{" "}
            <span className="text-cn-pizarra">
              {m.raza}, {p.nombre}
            </span>
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.875rem] text-cn-pizarra">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: pro.color }} aria-hidden />
              {s.nombre}, {pro.nombre}
            </span>
            <span className="inline-flex items-center gap-1">
              {cita.origen === "web" ? (
                <>
                  <Globe className="h-3.5 w-3.5" aria-hidden /> Desde la página
                </>
              ) : (
                <>
                  <Phone className="h-3.5 w-3.5" aria-hidden /> Recepción
                </>
              )}
            </span>
          </p>
          {cita.nota && <p className="mt-1 text-[0.875rem] italic">«{cita.nota}»</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <span className={`rounded-full px-3 py-1 text-[0.8125rem] font-bold ${estado.clase}`}>{estado.texto}</span>
        {cita.estado === "agendada" && (
          <>
            <Accion onClick={() => cambiarEstado(cita.id, "en-sala")}>Llegó</Accion>
            <Accion suave onClick={() => cambiarEstado(cita.id, "no-asistio")}>
              No vino
            </Accion>
          </>
        )}
        {cita.estado === "en-sala" &&
          (conFicha ? (
            <Link
              href={`${ficha}/consulta?cita=${cita.id}`}
              className="inline-flex h-9 items-center rounded-[8px] bg-cn-collar px-3 text-[0.875rem] font-bold text-white hover:bg-cn-collar-2"
            >
              Registrar consulta
            </Link>
          ) : (
            <Accion onClick={() => cambiarEstado(cita.id, "atendida")}>Terminar</Accion>
          ))}
        {cita.estado === "no-asistio" && (
          <Accion suave onClick={() => cambiarEstado(cita.id, "agendada")}>
            Deshacer
          </Accion>
        )}
      </div>
    </li>
  )
}

function Accion({ children, onClick, suave }: { children: React.ReactNode; onClick: () => void; suave?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center rounded-[8px] px-3 text-[0.875rem] font-bold ${
        suave ? "border-2 border-cn-linea hover:border-cn-collar" : "bg-cn-collar text-white hover:bg-cn-collar-2"
      }`}
    >
      {children}
    </button>
  )
}
