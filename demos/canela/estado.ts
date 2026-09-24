"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import {
  aFecha,
  claveDia,
  franjasDelDia,
  PROFESIONALES,
  SERVICIOS,
  sumarMinutos,
  type Cita,
  type Consulta,
  type EstadoCita,
  type EstadoClinica,
  type Especie,
} from "./modelo"
import { generarClinica, ponerAlDia } from "./semilla"

export const almacenClinica = crearAlmacen<EstadoClinica>(
  "axchi-demo:canela:clinica:v1",
  () => generarClinica(),
  (guardado) => ponerAlDia(guardado),
)

export function useClinica() {
  return useAlmacen(almacenClinica)
}

const nuevoId = (prefijo: string) => `${prefijo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

// ─── Consultas sobre el estado ───────────────────────────────────────────

export function servicio(id: string) {
  return SERVICIOS.find((s) => s.id === id)!
}

export function profesional(id: string) {
  return PROFESIONALES.find((p) => p.id === id)!
}

/** "la Dra. Laura Méndez", "el Dr. Andrés Rincón", "Camila Ortiz". */
export function conArticulo(id: string) {
  const { nombre } = profesional(id)
  if (nombre.startsWith("Dra.")) return `la ${nombre}`
  if (nombre.startsWith("Dr.")) return `el ${nombre}`
  return nombre
}

/** ¿Está libre el profesional durante toda la duración del servicio? */
export function estaLibre(e: EstadoClinica, profesionalId: string, inicio: string, duracionMin: number) {
  const fin = sumarMinutos(inicio, duracionMin)
  return !e.citas.some((c) => {
    if (c.profesionalId !== profesionalId || c.estado === "no-asistio") return false
    const cFin = sumarMinutos(c.inicio, servicio(c.servicioId).duracionMin)
    return c.inicio < fin && inicio < cFin
  })
}

/** Horas libres de un día para un servicio, con quién puede atender cada una. */
export function horasLibres(e: EstadoClinica, dia: string, servicioId: string, profesionalId?: string) {
  const s = servicio(servicioId)
  const diaSemana = aFecha(dia).getDay()
  const limite = claveLocalAhora()
  return franjasDelDia(dia)
    .filter((inicio) => inicio > limite)
    .map((inicio) => ({
      inicio,
      profesionales: s.profesionales.filter(
        (p) =>
          (!profesionalId || p === profesionalId) &&
          profesional(p).dias.includes(diaSemana) &&
          estaLibre(e, p, inicio, s.duracionMin),
      ),
    }))
    .filter((h) => h.profesionales.length > 0)
}

function claveLocalAhora() {
  const d = new Date()
  // Media hora de margen: nadie agenda para dentro de cinco minutos.
  d.setMinutes(d.getMinutes() + 30)
  return `${claveDia(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export function buscarPorTelefono(e: EstadoClinica, telefono: string) {
  const limpio = telefono.replace(/\D/g, "")
  if (limpio.length < 7) return null
  return e.propietarios.find((p) => p.telefono.replace(/\D/g, "").endsWith(limpio.slice(-7))) ?? null
}

/** Busca por nombre de la mascota, del propietario o por teléfono. */
export function buscarMascotas(e: EstadoClinica, texto: string) {
  const q = texto.trim().toLowerCase()
  const digitos = q.replace(/\D/g, "")
  return e.mascotas
    .map((m) => ({ m, p: e.propietarios.find((p) => p.id === m.propietarioId)! }))
    .filter(
      ({ m, p }) =>
        !q ||
        m.nombre.toLowerCase().includes(q) ||
        p.nombre.toLowerCase().includes(q) ||
        (digitos.length >= 3 && p.telefono.replace(/\D/g, "").includes(digitos)),
    )
}

// ─── Acciones ─────────────────────────────────────────────────────────────

export type SolicitudCita = {
  servicioId: string
  profesionalId: string
  inicio: string
  nota?: string
  origen: Cita["origen"]
} & (
  | { mascotaId: string }
  | {
      nuevaMascota: { nombre: string; especie: Especie; raza: string }
      propietario: { id?: string; nombre: string; telefono: string }
    }
)

export function agendar(solicitud: SolicitudCita): Cita {
  const cita: Cita = {
    id: nuevoId("a"),
    mascotaId: "",
    servicioId: solicitud.servicioId,
    profesionalId: solicitud.profesionalId,
    inicio: solicitud.inicio,
    estado: "agendada",
    origen: solicitud.origen,
    nota: solicitud.nota?.trim() || undefined,
  }

  almacenClinica.escribir((e) => {
    const siguiente = { ...e }
    if ("mascotaId" in solicitud) {
      cita.mascotaId = solicitud.mascotaId
    } else {
      let propietarioId = solicitud.propietario.id
      if (!propietarioId) {
        propietarioId = nuevoId("p")
        siguiente.propietarios = [
          ...e.propietarios,
          {
            id: propietarioId,
            nombre: solicitud.propietario.nombre.trim(),
            telefono: solicitud.propietario.telefono.trim(),
            barrio: "Sin registrar",
          },
        ]
      }
      const mascotaId = nuevoId("m")
      siguiente.mascotas = [
        ...e.mascotas,
        {
          id: mascotaId,
          propietarioId,
          nombre: solicitud.nuevaMascota.nombre.trim(),
          especie: solicitud.nuevaMascota.especie,
          raza: solicitud.nuevaMascota.raza.trim() || "Criollo",
          sexo: "macho",
          esterilizado: false,
          nacimiento: e.referencia,
          pesos: [],
          alergias: [],
          alertas: ["Paciente nuevo: completar datos en la primera consulta"],
        },
      ]
      cita.mascotaId = mascotaId
    }
    siguiente.citas = [...e.citas, cita]
    return siguiente
  })

  return cita
}

export function cambiarEstado(citaId: string, estado: EstadoCita) {
  almacenClinica.escribir((e) => ({
    ...e,
    citas: e.citas.map((c) => (c.id === citaId ? { ...c, estado } : c)),
  }))
}

export function registrarConsulta(
  datos: Omit<Consulta, "id" | "fecha"> & { citaId?: string; pesoKg?: number },
) {
  const { citaId, pesoKg, ...consulta } = datos
  const ahora = new Date()
  const fecha = `${claveDia(ahora)}T${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`
  const id = nuevoId("c")

  almacenClinica.escribir((e) => ({
    ...e,
    consultas: [...e.consultas, { ...consulta, id, fecha }],
    citas: citaId ? e.citas.map((c) => (c.id === citaId ? { ...c, estado: "atendida" } : c)) : e.citas,
    mascotas:
      pesoKg && pesoKg > 0
        ? e.mascotas.map((m) =>
            m.id === consulta.mascotaId
              ? { ...m, pesos: [...m.pesos, { fecha: claveDia(ahora), kg: pesoKg }] }
              : m,
          )
        : e.mascotas,
  }))
  return id
}

export function marcarRecordada(vacunaId: string) {
  const hoy = claveDia(new Date())
  almacenClinica.escribir((e) => ({
    ...e,
    vacunas: e.vacunas.map((v) => (v.id === vacunaId ? { ...v, recordada: hoy } : v)),
  }))
}

export function restablecerClinica() {
  almacenClinica.restablecer()
}
