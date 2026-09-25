/**
 * Motor de clases con cupo: un horario semanal que se repite, sesiones con un
 * número fijo de puestos, reservas, lista de espera y membresías. Lo usa el
 * centro de entrenamiento Palanca y sirve igual para un estudio de yoga, una
 * academia de baile o una escuela de natación.
 *
 * A diferencia del motor de agenda (una cita, un profesional, un hueco), aquí
 * muchas personas comparten la misma hora hasta llenar el cupo.
 */
import { claveDia, sumarDias, sumarMinutos } from "@/demos/motores/agenda/tiempo"

export type ClaseSemanal = {
  id: string
  tipo: string
  /** 0 = domingo … 6 = sábado. */
  dia: number
  /** `HH:mm`. */
  hora: string
  duracionMin: number
  cupo: number
  coachId: string
}

/** Una clase concreta en una fecha: `claseId@AAAA-MM-DD`. */
export type Sesion = ClaseSemanal & { sesionId: string; inicio: string; fin: string }

export function sesionesDelDia(horario: ClaseSemanal[], dia: string): Sesion[] {
  const d = new Date(`${dia}T12:00`).getDay()
  return horario
    .filter((c) => c.dia === d)
    .map((c) => {
      const inicio = `${dia}T${c.hora}`
      return { ...c, sesionId: `${c.id}@${dia}`, inicio, fin: sumarMinutos(inicio, c.duracionMin) }
    })
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
}

export function sesionesEntre(horario: ClaseSemanal[], desde: string, dias: number) {
  return Array.from({ length: dias }, (_, i) => sesionesDelDia(horario, sumarDias(desde, i))).flat()
}

export const sesionPorId = (horario: ClaseSemanal[], sesionId: string): Sesion | null => {
  const [claseId, dia] = sesionId.split("@")
  return sesionesDelDia(horario, dia).find((s) => s.id === claseId) ?? null
}

export type EstadoReserva = "reservada" | "espera" | "asistio" | "no-asistio" | "cancelada"

export type Reserva = { id: string; sesionId: string; socioId: string; estado: EstadoReserva; creada: string }

/** Puestos tomados: reservas vigentes y asistencias. */
export const ocupados = (reservas: Reserva[], sesionId: string) =>
  reservas.filter((r) => r.sesionId === sesionId && (r.estado === "reservada" || r.estado === "asistio")).length

export const enEspera = (reservas: Reserva[], sesionId: string) =>
  reservas.filter((r) => r.sesionId === sesionId && r.estado === "espera").sort((a, b) => a.creada.localeCompare(b.creada))

export const reservaDe = (reservas: Reserva[], sesionId: string, socioId: string) =>
  reservas.find((r) => r.sesionId === sesionId && r.socioId === socioId && r.estado !== "cancelada") ?? null

/** Reserva un puesto; si la clase está llena, entra a la lista de espera. */
export function reservarPuesto(reservas: Reserva[], s: Sesion, socioId: string, id: string, ahora: string): Reserva[] {
  if (reservaDe(reservas, s.sesionId, socioId)) return reservas
  const estado: EstadoReserva = ocupados(reservas, s.sesionId) < s.cupo ? "reservada" : "espera"
  return [...reservas, { id, sesionId: s.sesionId, socioId, estado, creada: ahora }]
}

/**
 * Cancelar libera el puesto y lo pasa al primero de la lista de espera, que se
 * entera por WhatsApp.
 */
export function cancelarPuesto(reservas: Reserva[], reservaId: string): { reservas: Reserva[]; promovido?: Reserva } {
  const r = reservas.find((x) => x.id === reservaId)
  if (!r) return { reservas }
  let nuevas = reservas.map((x) => (x.id === reservaId ? { ...x, estado: "cancelada" as const } : x))
  let promovido: Reserva | undefined
  if (r.estado === "reservada") {
    const primero = enEspera(nuevas, r.sesionId)[0]
    if (primero) {
      promovido = { ...primero, estado: "reservada" }
      nuevas = nuevas.map((x) => (x.id === primero.id ? promovido! : x))
    }
  }
  return { reservas: nuevas, promovido }
}

/** Se puede cancelar hasta unas horas antes; después, el puesto se pierde. */
export const puedeCancelar = (inicio: string, ahora: string, horas = 2) => sumarMinutos(ahora, horas * 60) <= inicio

// ─── Membresías ───────────────────────────────────────────────────────────

export type Plan = {
  id: string
  nombre: string
  precio: number
  /** Días de vigencia desde que se paga. */
  dias: number
  /** Clases incluidas; sin límite si no se indica. */
  clases?: number
}

export type Membresia = { planId: string; inicio: string; vence: string; clasesRestantes?: number }

export type EstadoMembresia = "activa" | "por-vencer" | "vencida" | "sin-clases"

export function estadoMembresia(m: Membresia | undefined, hoy: string, avisoDias = 5): EstadoMembresia {
  if (!m || m.vence < hoy) return "vencida"
  if (m.clasesRestantes !== undefined && m.clasesRestantes <= 0) return "sin-clases"
  if (m.vence <= sumarDias(hoy, avisoDias)) return "por-vencer"
  return "activa"
}

/** Renovar: si aún está vigente, los días se suman desde el vencimiento, no desde hoy. */
export function renovar(m: Membresia | undefined, plan: Plan, hoy = claveDia(new Date())): Membresia {
  const desde = m && m.vence >= hoy ? sumarDias(m.vence, 1) : hoy
  return { planId: plan.id, inicio: desde, vence: sumarDias(desde, plan.dias - 1), clasesRestantes: plan.clases }
}
