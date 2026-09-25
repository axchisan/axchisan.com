"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { claveDia, claveInstante } from "@/demos/motores/agenda/tiempo"
import {
  cancelarPuesto,
  estadoMembresia,
  renovar,
  reservarPuesto,
  sesionPorId,
  type Reserva,
} from "@/demos/motores/clases/cupos"
import { HORARIO, plan, type EstadoGimnasio, type MetodoPago, type Socio } from "./modelo"
import { generarGimnasio, ponerAlDia } from "./semilla"

export const almacenGimnasio = crearAlmacen<EstadoGimnasio>(
  "axchi-demo:palanca:gimnasio:v1",
  () => generarGimnasio(),
  (guardado) => ponerAlDia(guardado),
)

export const useGimnasio = () => useAlmacen(almacenGimnasio)

const nuevoId = (prefijo: string) => `${prefijo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
const soloDigitos = (t: string) => t.replace(/\D/g, "")

export function socioPorDocumento(e: EstadoGimnasio | null, documento: string) {
  const d = soloDigitos(documento)
  if (!e || d.length < 6) return null
  return e.socios.find((s) => soloDigitos(s.documento) === d) ?? null
}

export const socioPorId = (e: EstadoGimnasio | null, id: string) => e?.socios.find((s) => s.id === id) ?? null

export const estadoDe = (s: Socio) => estadoMembresia(s.membresia, claveDia(new Date()))

/** Un socio puede reservar si su membresía está al día, o si es invitado y aún no usó su clase gratis. */
export function puedeReservar(e: EstadoGimnasio, s: Socio) {
  if (s.invitado) return !e.reservas.some((r) => r.socioId === s.id && r.estado !== "cancelada")
  const estado = estadoDe(s)
  return estado === "activa" || estado === "por-vencer"
}

export type Resultado = { tipo: "reservada" | "espera"; reserva: Reserva } | { tipo: "no-puede"; motivo: string }

export function reservarClase(sesionId: string, socioId: string): Resultado {
  const e = almacenGimnasio.leer()
  const s = sesionPorId(HORARIO, sesionId)
  const socio = socioPorId(e, socioId)
  if (!s || !socio) return { tipo: "no-puede", motivo: "Esa clase ya no existe." }
  if (!puedeReservar(e, socio)) {
    return {
      tipo: "no-puede",
      motivo: socio.invitado ? "Ya usaste tu clase gratis. Elige un plan para seguir entrenando." : "Tu membresía está vencida o sin clases. Renuévala en recepción o por WhatsApp.",
    }
  }
  const reservas = reservarPuesto(e.reservas, s, socio.id, nuevoId("r"), claveInstante(new Date()))
  const reserva = reservas.find((r) => r.sesionId === sesionId && r.socioId === socio.id && r.estado !== "cancelada")!
  almacenGimnasio.escribir((x) => ({ ...x, reservas }))
  return { tipo: reserva.estado === "espera" ? "espera" : "reservada", reserva }
}

/** Primera clase gratis: se crea el invitado y se le reserva el puesto. */
export function reservarComoInvitado(sesionId: string, datos: { nombre: string; documento: string; telefono: string }): Resultado {
  const id = nuevoId("s")
  almacenGimnasio.escribir((e) => ({
    ...e,
    socios: [...e.socios, { id, nombre: datos.nombre.trim(), documento: datos.documento.trim(), telefono: datos.telefono.trim(), invitado: true, alta: claveDia(new Date()) }],
  }))
  return reservarClase(sesionId, id)
}

export function cancelarReserva(reservaId: string) {
  const { reservas, promovido } = cancelarPuesto(almacenGimnasio.leer().reservas, reservaId)
  almacenGimnasio.escribir((e) => ({ ...e, reservas }))
  return promovido
}

/** Tomar asistencia. En una tiquetera, asistir descuenta una clase. */
export function marcarAsistencia(reservaId: string, asistio: boolean) {
  almacenGimnasio.escribir((e) => {
    const r = e.reservas.find((x) => x.id === reservaId)
    if (!r) return e
    const antes = r.estado === "asistio"
    const delta = asistio === antes ? 0 : asistio ? -1 : 1
    return {
      ...e,
      reservas: e.reservas.map((x) => (x.id === reservaId ? { ...x, estado: asistio ? "asistio" : "no-asistio" } : x)),
      socios: e.socios.map((s) =>
        s.id === r.socioId && s.membresia?.clasesRestantes !== undefined && delta
          ? { ...s, membresia: { ...s.membresia, clasesRestantes: Math.max(0, s.membresia.clasesRestantes + delta) } }
          : s,
      ),
    }
  })
}

export function renovarMembresia(socioId: string, planId: string, metodo: MetodoPago) {
  const p = plan(planId)
  const hoy = claveDia(new Date())
  almacenGimnasio.escribir((e) => ({
    ...e,
    socios: e.socios.map((s) => (s.id === socioId ? { ...s, invitado: false, membresia: renovar(s.membresia, p, hoy) } : s)),
    pagos: [...e.pagos, { id: nuevoId("g"), socioId, planId, valor: p.precio, fecha: hoy, metodo }],
  }))
}

export function restablecerGimnasio() {
  almacenGimnasio.restablecer()
}
