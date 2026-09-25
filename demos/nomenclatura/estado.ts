"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { horasLibres as horasLibresMotor } from "@/demos/motores/agenda/disponibilidad"
import { ahoraConMargen, claveInstante } from "@/demos/motores/agenda/tiempo"
import { ASESORES, DURACION_VISITA, FRANJAS_VISITA, INMUEBLES, type Ajustes, type EstadoInmobiliaria, type EstadoLead, type Inmueble, type Lead, type Visita } from "./modelo"
import { generarInmobiliaria, ponerAlDia } from "./semilla"

export const almacenInmobiliaria = crearAlmacen<EstadoInmobiliaria>(
  "axchi-demo:nomenclatura:inmobiliaria:v1",
  () => generarInmobiliaria(),
  (guardado) => ponerAlDia(guardado),
)

export const useInmobiliaria = () => useAlmacen(almacenInmobiliaria)

/** El inmueble con los cambios hechos desde el panel. */
export function vigente(e: EstadoInmobiliaria | null, x: Inmueble) {
  const a = e?.ajustes[x.id] ?? {}
  return { ...x, precio: a.precio ?? x.precio, estado: a.estado ?? "disponible", destacado: a.destacado ?? false }
}

export const todos = (e: EstadoInmobiliaria | null) => INMUEBLES.map((x) => vigente(e, x))

export function ajustar(id: string, cambio: Ajustes) {
  almacenInmobiliaria.escribir((e) => ({ ...e, ajustes: { ...e.ajustes, [id]: { ...e.ajustes[id], ...cambio } } }))
}

const nuevoId = (prefijo: string) => `${prefijo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

export function horasVisita(e: EstadoInmobiliaria, dia: string, x: Inmueble) {
  return horasLibresMotor({
    citas: e.visitas.map((v) => ({ profesionalId: v.asesorId, inicio: v.inicio, duracionMin: DURACION_VISITA, ocupa: v.estado === "agendada" })),
    profesionales: ASESORES,
    franjas: FRANJAS_VISITA,
    dia,
    duracionMin: DURACION_VISITA,
    candidatos: [x.asesorId],
    desde: ahoraConMargen(120),
  })
}

/** Un interesado desde la página: con visita si eligió hora, o solo el contacto. */
export function registrarInteres(d: { inmuebleId: string; nombre: string; telefono: string; mensaje?: string; inicio?: string; asesorId?: string }) {
  const lead: Lead = {
    id: nuevoId("l"),
    nombre: d.nombre.trim(),
    telefono: d.telefono.trim(),
    inmuebleId: d.inmuebleId,
    mensaje: d.mensaje?.trim() || undefined,
    origen: "web",
    estado: d.inicio ? "visita" : "nuevo",
    fecha: claveInstante(new Date()),
  }
  const visita: Visita | null = d.inicio && d.asesorId ? { id: nuevoId("v"), inmuebleId: d.inmuebleId, leadId: lead.id, asesorId: d.asesorId, inicio: d.inicio, estado: "agendada" } : null
  almacenInmobiliaria.escribir((e) => ({
    ...e,
    leads: [lead, ...e.leads],
    visitas: visita ? [...e.visitas, visita].sort((a, b) => a.inicio.localeCompare(b.inicio)) : e.visitas,
  }))
  return { lead, visita }
}

export function cambiarEstadoLead(id: string, estado: EstadoLead) {
  almacenInmobiliaria.escribir((e) => ({ ...e, leads: e.leads.map((l) => (l.id === id ? { ...l, estado } : l)) }))
}

export function cambiarEstadoVisita(id: string, estado: Visita["estado"]) {
  almacenInmobiliaria.escribir((e) => ({ ...e, visitas: e.visitas.map((v) => (v.id === id ? { ...v, estado } : v)) }))
}

export function restablecerInmobiliaria() {
  almacenInmobiliaria.restablecer()
}
