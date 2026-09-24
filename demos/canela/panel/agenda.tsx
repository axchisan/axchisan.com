"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { RAIZ } from "../config"
import { profesional, servicio, useClinica } from "../estado"
import {
  aFecha,
  claveDia,
  PROFESIONALES,
  sumarDias,
  sumarMinutos,
  textoDia,
  textoHora,
  textoHoraDecimal,
  type Cita,
} from "../modelo"
import { CargandoPanel, EncabezadoPanel } from "./marco"
import { NuevaCita } from "./nueva-cita"

const DESDE = 8
const HASTA = 20
const FILA = 34 // px por media hora

/**
 * Reparte las citas de un día en carriles solo donde se pisan. Cada grupo de
 * citas que se solapan usa tantos carriles como citas simultáneas tenga; una
 * cita sola ocupa todo el ancho del día.
 */
function enCarriles(citas: Cita[]) {
  const orden = [...citas].sort((a, b) => a.inicio.localeCompare(b.inicio))
  const out: { cita: Cita; carril: number; carriles: number }[] = []
  let grupo: typeof out = []
  let finGrupo = ""
  let finesCarril: string[] = []

  const cerrar = () => {
    for (const g of grupo) g.carriles = finesCarril.length
    out.push(...grupo)
    grupo = []
    finesCarril = []
  }

  for (const c of orden) {
    const fin = sumarMinutos(c.inicio, servicio(c.servicioId).duracionMin)
    if (grupo.length && c.inicio >= finGrupo) cerrar()
    let carril = finesCarril.findIndex((f) => f <= c.inicio)
    if (carril < 0) {
      carril = finesCarril.length
      finesCarril.push(fin)
    } else {
      finesCarril[carril] = fin
    }
    grupo.push({ cita: c, carril, carriles: 0 })
    finGrupo = grupo.length === 1 || fin > finGrupo ? fin : finGrupo
  }
  cerrar()
  return out
}

function lunesDe(dia: string) {
  const f = aFecha(dia)
  const desplazamiento = (f.getDay() + 6) % 7
  return sumarDias(dia, -desplazamiento)
}

const DIA_CORTO = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric" })

export function Agenda({ diaInicial }: { diaInicial?: string }) {
  const clinica = useClinica()
  const { incluye } = useDemo()
  const hoy = claveDia(new Date())
  const inicial = diaInicial && /^\d{4}-\d{2}-\d{2}$/.test(diaInicial) ? diaInicial : hoy
  const [lunes, setLunes] = useState(() => lunesDe(inicial))
  const [diaMovil, setDiaMovil] = useState(inicial)
  const [filtro, setFiltro] = useState("")

  if (!clinica) return <CargandoPanel />

  const dias = Array.from({ length: 6 }, (_, i) => sumarDias(lunes, i))
  const citas = clinica.citas.filter((c) => !filtro || c.profesionalId === filtro)
  const conFicha = incluye("sistema")
  const mascota = (id: string) => clinica.mascotas.find((m) => m.id === id)

  function moverSemana(semanas: number) {
    const nuevo = sumarDias(lunes, semanas * 7)
    setLunes(nuevo)
    setDiaMovil(nuevo)
  }

  const bloque = (c: Cita) => {
    const s = servicio(c.servicioId)
    const m = mascota(c.mascotaId)
    const contenido = (
      <>
        <span className="block truncate font-bold">{m?.nombre}</span>
        <span className="block truncate">{s.nombre}</span>
        {c.origen === "web" && <span className="sr-only">Agendada desde la página</span>}
      </>
    )
    return conFicha && m ? (
      <Link href={`${RAIZ}/panel/pacientes/${m.id}`} className="block h-full">
        {contenido}
      </Link>
    ) : (
      contenido
    )
  }

  return (
    <>
      <EncabezadoPanel
        titulo="Agenda"
        detalle={`Semana del ${textoDia(dias[0]).toLowerCase()}`}
        accion={<NuevaCita />}
      />

      <div className="px-4 py-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => moverSemana(-1)}
              className="rounded-[8px] border-2 border-cn-linea bg-white p-2 hover:border-cn-collar"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                setLunes(lunesDe(hoy))
                setDiaMovil(hoy)
              }}
              className="h-9 rounded-[8px] border-2 border-cn-linea bg-white px-3 text-[0.9375rem] font-bold hover:border-cn-collar"
            >
              Esta semana
            </button>
            <button
              type="button"
              onClick={() => moverSemana(1)}
              className="rounded-[8px] border-2 border-cn-linea bg-white p-2 hover:border-cn-collar"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <Punto id="filtro">
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Profesional">
              {[{ id: "", nombre: "Todos", color: "" }, ...PROFESIONALES].map((p) => (
                <button
                  key={p.id || "todos"}
                  type="button"
                  role="radio"
                  aria-checked={filtro === p.id}
                  onClick={() => setFiltro(p.id)}
                  className={`inline-flex h-9 items-center gap-2 rounded-full border-2 px-3 text-[0.875rem] ${
                    filtro === p.id ? "border-cn-collar bg-cn-collar text-white" : "border-cn-linea bg-white hover:border-cn-collar"
                  }`}
                >
                  {p.color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} aria-hidden />}
                  {p.id ? p.nombre.replace(/^Dra?\. /, "") : p.nombre}
                </button>
              ))}
            </div>
          </Punto>
        </div>

        <p className="mt-5 hidden items-center gap-2 text-[0.875rem] text-cn-pizarra md:flex">
          <span className="h-4 w-1 rounded-full bg-cn-pelota" aria-hidden />
          Borde amarillo: la cita se agendó desde la página.
        </p>

        {/* Escritorio: semana completa */}
        <Punto id="semana" className="mt-3 hidden md:block">
          <div className="overflow-hidden rounded-[14px] bg-white">
            <div className="grid grid-cols-[4.5rem_repeat(6,1fr)] border-b border-cn-linea">
              <span />
              {dias.map((d) => (
                <span
                  key={d}
                  className={`px-2 py-3 text-center text-[0.9375rem] capitalize ${d === hoy ? "bg-cn-pelota font-bold" : ""}`}
                >
                  {DIA_CORTO.format(aFecha(d)).replace(".", "")}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-[4.5rem_repeat(6,1fr)]">
              <div>
                {Array.from({ length: HASTA - DESDE }, (_, i) => (
                  <div key={i} className="pr-2 text-right text-[0.75rem] text-cn-pizarra" style={{ height: FILA * 2 }}>
                    <span className="relative -top-2">{i === 0 ? "" : textoHoraDecimal(DESDE + i)}</span>
                  </div>
                ))}
              </div>
              {dias.map((d) => (
                <div
                  key={d}
                  className="relative border-l border-cn-linea"
                  style={{
                    height: (HASTA - DESDE) * FILA * 2,
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${FILA * 2 - 1}px, #dde3e0 ${FILA * 2 - 1}px ${FILA * 2}px)`,
                  }}
                >
                  {enCarriles(citas.filter((c) => c.inicio.startsWith(d))).map(({ cita: c, carril, carriles }) => {
                    const f = aFecha(c.inicio)
                    const h = f.getHours() + f.getMinutes() / 60
                    if (h < DESDE || h >= HASTA) return null
                    const ancho = 100 / carriles
                    const pro = profesional(c.profesionalId)
                    return (
                      <div
                        key={c.id}
                        title={`${textoHora(c.inicio)}, ${mascota(c.mascotaId)?.nombre}, ${servicio(c.servicioId).nombre}, ${pro.nombre}`}
                        className={`absolute overflow-hidden rounded-[6px] px-1.5 py-1 text-[0.75rem] leading-[1.15] ${
                          c.origen === "web" ? "border-l-4 border-cn-pelota" : ""
                        } ${c.estado === "no-asistio" ? "bg-[#e8ecea]! text-cn-pizarra line-through" : "text-white"}`}
                        style={{
                          top: (h - DESDE) * FILA * 2 + 1,
                          height: (servicio(c.servicioId).duracionMin / 30) * FILA - 2,
                          left: `calc(${carril * ancho}% + 2px)`,
                          width: `calc(${ancho}% - 4px)`,
                          background: pro.color,
                        }}
                      >
                        {bloque(c)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </Punto>

        {/* Celular: un día a la vez */}
        <div className="mt-6 md:hidden">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {dias.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={diaMovil === d}
                onClick={() => setDiaMovil(d)}
                className={`shrink-0 rounded-full border-2 px-4 py-2 text-[0.875rem] capitalize ${
                  diaMovil === d ? "border-cn-collar bg-cn-collar text-white" : "border-cn-linea bg-white"
                }`}
              >
                {DIA_CORTO.format(aFecha(d)).replace(".", "")}
              </button>
            ))}
          </div>
          <ol className="mt-4 divide-y divide-cn-linea rounded-[14px] bg-white">
            {citas
              .filter((c) => c.inicio.startsWith(diaMovil))
              .sort((a, b) => a.inicio.localeCompare(b.inicio))
              .map((c) => {
                const pro = profesional(c.profesionalId)
                return (
                  <li key={c.id} className={`flex gap-3 p-3 ${c.estado === "no-asistio" ? "text-cn-pizarra line-through" : ""}`}>
                    <span className="w-[4.5rem] shrink-0 text-[0.9375rem] font-bold tabular-nums">{textoHora(c.inicio)}</span>
                    <span className="w-1 shrink-0 rounded-full" style={{ background: pro.color }} aria-hidden />
                    <span className="min-w-0 text-[0.9375rem]">
                      <strong>{mascota(c.mascotaId)?.nombre}</strong>, {servicio(c.servicioId).nombre}
                      <span className="block text-[0.8125rem] text-cn-pizarra">{pro.nombre}</span>
                    </span>
                  </li>
                )
              })}
            {!citas.some((c) => c.inicio.startsWith(diaMovil)) && (
              <li className="p-4 text-cn-pizarra">Sin citas este día.</li>
            )}
          </ol>
        </div>
      </div>
    </>
  )
}
