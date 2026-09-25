"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { horasLibres as horasLibresMotor, type CitaAgenda } from "@/demos/motores/agenda/disponibilidad"
import { ahoraConMargen, claveDia } from "@/demos/motores/agenda/tiempo"
import {
  FRANJAS,
  hacerItem,
  motivo,
  ODONTOLOGOS,
  planDe,
  type Cara,
  type Cita,
  type EstadoCita,
  type EstadoConsultorio,
  type HallazgoDiente,
  type ItemPlan,
  type MetodoPago,
  type Paciente,
} from "./modelo"
import { generarConsultorio, ponerAlDia } from "./semilla"

export const almacenConsultorio = crearAlmacen<EstadoConsultorio>(
  "axchi-demo:molar-116:consultorio:v1",
  () => generarConsultorio(),
  (guardado) => ponerAlDia(guardado),
)

export const useConsultorio = () => useAlmacen(almacenConsultorio)

const agendaDe = (e: EstadoConsultorio): CitaAgenda[] =>
  e.citas.map((c) => ({ profesionalId: c.odontologoId, inicio: c.inicio, duracionMin: motivo(c.motivo).duracionMin, ocupa: c.estado !== "no-asistio" }))

export function horasLibres(e: EstadoConsultorio, dia: string, motivoId: string, odontologoId?: string) {
  const m = motivo(motivoId)
  return horasLibresMotor({
    citas: agendaDe(e),
    profesionales: ODONTOLOGOS,
    franjas: FRANJAS,
    dia,
    duracionMin: m.duracionMin,
    candidatos: m.odontologos.filter((o) => !odontologoId || o === odontologoId),
    desde: ahoraConMargen(motivoId === "dolor" ? 15 : 60),
  })
}

export function buscarPorDocumento(e: EstadoConsultorio, documento: string) {
  const d = documento.replace(/\D/g, "")
  if (d.length < 6) return null
  return e.pacientes.find((p) => p.documento.replace(/\D/g, "") === d) ?? null
}

export const pacientePorId = (e: EstadoConsultorio | null, id: string) => e?.pacientes.find((p) => p.id === id) ?? null

export const abonado = (p: Paciente) => p.abonos.reduce((t, a) => t + a.valor, 0)
export const saldo = (p: Paciente) => (p.aprobado ? Math.max(0, p.aprobado - abonado(p)) : 0)
export const pendientePlan = (p: Paciente) => planDe(p.odontograma).reduce((t, x) => t + x.precio, 0)

const nuevoId = (prefijo: string) => `${prefijo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

export type Solicitud = {
  motivo: string
  odontologoId: string
  inicio: string
  nota?: string
} & ({ pacienteId: string } | { paciente: { nombre: string; documento: string; telefono: string } })

export function agendar(s: Solicitud): Cita {
  const cita: Cita = { id: nuevoId("c"), pacienteId: "", motivo: s.motivo, odontologoId: s.odontologoId, inicio: s.inicio, estado: "agendada", origen: "web", nota: s.nota?.trim() || undefined }
  almacenConsultorio.escribir((e) => {
    let pacientes = e.pacientes
    if ("pacienteId" in s) cita.pacienteId = s.pacienteId
    else {
      const id = nuevoId("p")
      pacientes = [...pacientes, { id, nombre: s.paciente.nombre.trim(), documento: s.paciente.documento.trim(), telefono: s.paciente.telefono.trim(), nacimiento: "", odontograma: {}, abonos: [], hechos: [] }]
      cita.pacienteId = id
    }
    return { ...e, pacientes, citas: [...e.citas, cita].sort((a, b) => a.inicio.localeCompare(b.inicio)) }
  })
  return cita
}

export function cambiarEstadoCita(id: string, estado: EstadoCita) {
  almacenConsultorio.escribir((e) => ({ ...e, citas: e.citas.map((c) => (c.id === id ? { ...c, estado } : c)) }))
}

function editarPaciente(id: string, cambio: (p: Paciente) => Paciente) {
  almacenConsultorio.escribir((e) => ({ ...e, pacientes: e.pacientes.map((p) => (p.id === id ? cambio(p) : p)) }))
}

export type Herramienta = "caries" | "resina" | HallazgoDiente | "sano"

/** Aplica una herramienta del odontograma: a una cara, o al diente entero. */
export function marcar(pacienteId: string, diente: number, herramienta: Herramienta, cara?: Cara) {
  editarPaciente(pacienteId, (p) => {
    const d = { ...p.odontograma[diente], caras: { ...p.odontograma[diente]?.caras } }
    if (herramienta === "sano") {
      if (cara) delete d.caras[cara]
      else return { ...p, odontograma: { ...p.odontograma, [diente]: {} } }
    } else if (herramienta === "caries" || herramienta === "resina") {
      d.caras[cara ?? "O"] = herramienta
      if (d.pieza === "ausente" || d.pieza === "extraccion") delete d.pieza
    } else {
      d.pieza = herramienta
      if (herramienta === "ausente") d.caras = {}
    }
    return { ...p, odontograma: { ...p.odontograma, [diente]: d } }
  })
}

/**
 * Aprobar el presupuesto: el tratamiento completo es lo ya hecho más lo que
 * falta. Si después aparece algo nuevo en el odontograma, se vuelve a aprobar.
 */
export function aprobarPresupuesto(pacienteId: string) {
  editarPaciente(pacienteId, (p) => ({ ...p, aprobado: p.hechos.reduce((t, h) => t + h.precio, 0) + pendientePlan(p) }))
}

export function marcarHecho(pacienteId: string, item: ItemPlan) {
  editarPaciente(pacienteId, (p) => ({
    ...p,
    odontograma: hacerItem(p.odontograma, item),
    hechos: [...p.hechos, { ...item, fecha: claveDia(new Date()) }],
  }))
}

export function registrarAbono(pacienteId: string, valor: number, metodo: MetodoPago) {
  editarPaciente(pacienteId, (p) => ({ ...p, abonos: [...p.abonos, { fecha: claveDia(new Date()), valor, metodo }] }))
}

export function restablecerConsultorio() {
  almacenConsultorio.restablecer()
}
