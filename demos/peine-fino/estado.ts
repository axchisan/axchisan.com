"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { horasLibres as horasLibresMotor, type CitaAgenda } from "@/demos/motores/agenda/disponibilidad"
import { ahoraConMargen, claveDia, diasEntre } from "@/demos/motores/agenda/tiempo"
import {
  DIAS_SIN_VOLVER,
  duracion,
  FRANJAS,
  PROFESIONALES,
  quienesHacen,
  type Cita,
  type EstadoCita,
  type EstadoSalon,
  type MetodoPago,
} from "./modelo"
import { generarSalon, ponerAlDia } from "./semilla"

export const almacenSalon = crearAlmacen<EstadoSalon>(
  "axchi-demo:peine-fino:salon:v1",
  () => generarSalon(),
  (guardado) => ponerAlDia(guardado),
)

export function useSalon() {
  return useAlmacen(almacenSalon)
}

const nuevoId = (prefijo: string) => `${prefijo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function citasAgenda(e: EstadoSalon): CitaAgenda[] {
  return e.citas.map((c) => ({
    profesionalId: c.profesionalId,
    inicio: c.inicio,
    duracionMin: duracion(c.servicios),
    ocupa: c.estado !== "no-asistio",
  }))
}

/** Horas libres para un conjunto de servicios, hechos seguidos por la misma persona. */
export function horasLibres(e: EstadoSalon, dia: string, servicios: string[], profesionalId?: string) {
  return horasLibresMotor({
    citas: citasAgenda(e),
    profesionales: PROFESIONALES,
    franjas: FRANJAS,
    dia,
    duracionMin: duracion(servicios),
    candidatos: quienesHacen(servicios).filter((p) => !profesionalId || p === profesionalId),
    desde: ahoraConMargen(),
  })
}

export function buscarPorTelefono(e: EstadoSalon, telefono: string) {
  const limpio = telefono.replace(/\D/g, "")
  if (limpio.length < 7) return null
  return e.clientes.find((c) => c.telefono.replace(/\D/g, "").endsWith(limpio.slice(-7))) ?? null
}

export function buscarClientes(e: EstadoSalon, texto: string) {
  const q = texto.trim().toLowerCase()
  const digitos = q.replace(/\D/g, "")
  return e.clientes.filter(
    (c) =>
      !q ||
      c.nombre.toLowerCase().includes(q) ||
      (digitos.length >= 3 && c.telefono.replace(/\D/g, "").includes(digitos)),
  )
}

/** Visitas atendidas de un cliente, de la más reciente a la más antigua. */
export function visitas(e: EstadoSalon, clienteId: string) {
  return e.citas
    .filter((c) => c.clienteId === clienteId && c.estado === "atendida")
    .sort((a, b) => b.inicio.localeCompare(a.inicio))
}

/** Cada cuántos días viene, en promedio; `null` con menos de dos visitas. */
export function frecuencia(e: EstadoSalon, clienteId: string) {
  const v = visitas(e, clienteId)
  if (v.length < 2) return null
  return Math.round(diasEntre(v[v.length - 1].inicio, v[0].inicio) / (v.length - 1))
}

/**
 * Clientes que no vuelven: su última visita fue hace más de 45 días y no
 * tienen nada agendado. Ordenados por lo que gastaban, para llamar primero a
 * quien más pesa en la caja.
 */
export function sinVolver(e: EstadoSalon) {
  const hoy = claveDia(new Date())
  return e.clientes
    .map((c) => {
      const v = visitas(e, c.id)
      const agendada = e.citas.some((x) => x.clienteId === c.id && x.estado === "agendada")
      const gasto = v.reduce((t, x) => t + (x.pago?.total ?? 0), 0)
      return { cliente: c, ultima: v[0], dias: v[0] ? diasEntre(v[0].inicio, hoy) : 0, agendada, gasto }
    })
    .filter((x) => x.ultima && !x.agendada && x.dias > DIAS_SIN_VOLVER)
    .sort((a, b) => b.gasto - a.gasto)
}

// ─── Acciones ─────────────────────────────────────────────────────────────

export type SolicitudReserva = {
  servicios: string[]
  profesionalId: string
  inicio: string
  origen: Cita["origen"]
  nota?: string
} & ({ clienteId: string } | { cliente: { nombre: string; telefono: string } })

export function reservar(s: SolicitudReserva): Cita {
  const cita: Cita = {
    id: nuevoId("a"),
    clienteId: "",
    servicios: s.servicios,
    profesionalId: s.profesionalId,
    inicio: s.inicio,
    estado: "agendada",
    origen: s.origen,
    nota: s.nota?.trim() || undefined,
  }
  almacenSalon.escribir((e) => {
    let clientes = e.clientes
    if ("clienteId" in s) {
      cita.clienteId = s.clienteId
    } else {
      const id = nuevoId("c")
      clientes = [...clientes, { id, nombre: s.cliente.nombre.trim(), telefono: s.cliente.telefono.trim(), formulas: [] }]
      cita.clienteId = id
    }
    return { ...e, clientes, citas: [...e.citas, cita] }
  })
  return cita
}

export function cambiarEstado(citaId: string, estado: EstadoCita) {
  almacenSalon.escribir((e) => ({ ...e, citas: e.citas.map((c) => (c.id === citaId ? { ...c, estado } : c)) }))
}

export function cobrar(citaId: string, pago: { metodo: MetodoPago; total: number; propina: number }) {
  almacenSalon.escribir((e) => ({
    ...e,
    citas: e.citas.map((c) => (c.id === citaId ? { ...c, estado: "atendida", pago } : c)),
  }))
}

export function guardarFormula(clienteId: string, profesionalId: string, texto: string) {
  const fecha = claveDia(new Date())
  almacenSalon.escribir((e) => ({
    ...e,
    clientes: e.clientes.map((c) =>
      c.id === clienteId ? { ...c, formulas: [...c.formulas, { fecha, profesionalId, texto: texto.trim() }] } : c,
    ),
  }))
}

export function marcarContactado(clienteId: string) {
  const hoy = claveDia(new Date())
  almacenSalon.escribir((e) => ({
    ...e,
    clientes: e.clientes.map((c) => (c.id === clienteId ? { ...c, contactado: hoy } : c)),
  }))
}

export function restablecerSalon() {
  almacenSalon.restablecer()
}
