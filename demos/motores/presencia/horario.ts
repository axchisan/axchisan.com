/**
 * Horario de atención y "abierto ahora". Las horas van en decimales (8.5 es
 * 8:30) por día de la semana, 0 = domingo. Un día sin horario no se atiende.
 */
import { textoHoraDecimal } from "@/demos/motores/agenda/tiempo"

export type Horario = Partial<Record<number, { abre: number; cierra: number }>>

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]

export type EstadoHorario = { abierto: boolean; texto: string }

/** "Abierto, hasta las 6:00 p. m." o "Cerrado. Abre el lunes a las 8:00 a. m." */
export function estadoHorario(horario: Horario, ahora: Date): EstadoHorario {
  const hoy = ahora.getDay()
  const hora = ahora.getHours() + ahora.getMinutes() / 60
  const h = horario[hoy]
  if (h && hora >= h.abre && hora < h.cierra) return { abierto: true, texto: `Abierto, hasta las ${textoHoraDecimal(h.cierra)}` }
  if (h && hora < h.abre) return { abierto: false, texto: `Cerrado. Abre hoy a las ${textoHoraDecimal(h.abre)}` }
  for (let i = 1; i <= 7; i++) {
    const dia = (hoy + i) % 7
    const siguiente = horario[dia]
    if (siguiente) {
      const cuando = i === 1 ? "mañana" : `el ${DIAS[dia]}`
      return { abierto: false, texto: `Cerrado. Abre ${cuando} a las ${textoHoraDecimal(siguiente.abre)}` }
    }
  }
  return { abierto: false, texto: "Cerrado" }
}

/** Filas para mostrar el horario: los días seguidos con la misma franja se agrupan. */
export function filasHorario(horario: Horario) {
  const orden = [1, 2, 3, 4, 5, 6, 0]
  const filas: { dias: string; horas: string }[] = []
  let inicio = orden[0]
  for (let i = 0; i < orden.length; i++) {
    const d = orden[i]
    const sig = orden[i + 1]
    const texto = (x: number) => {
      const h = horario[x]
      return h ? `${textoHoraDecimal(h.abre)} a ${textoHoraDecimal(h.cierra)}` : "Cerrado"
    }
    if (sig === undefined || texto(sig) !== texto(d)) {
      const nombre = (x: number) => DIAS[x].charAt(0).toUpperCase() + DIAS[x].slice(1)
      filas.push({ dias: inicio === d ? nombre(d) : `${nombre(inicio)} a ${DIAS[d]}`, horas: texto(d) })
      if (sig !== undefined) inicio = sig
    }
  }
  return filas
}
