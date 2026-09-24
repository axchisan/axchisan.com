/**
 * Disponibilidad del motor de agenda: qué horas están libres y con quién.
 * No sabe nada del negocio: recibe los profesionales, las franjas y las citas
 * y calcula huecos. Lo usan todas las demos con reservas.
 */
import { aFecha, finDeFranja, franjasDelDia, sumarMinutos, type Franja } from "./tiempo"

export type ProfesionalAgenda = { id: string; dias: number[] }

export type CitaAgenda = {
  profesionalId: string
  inicio: string
  /** Duración total ya calculada; en una cita de varios servicios, la suma. */
  duracionMin: number
  /** Una cita cancelada o a la que no llegaron no ocupa el hueco. */
  ocupa: boolean
}

/** ¿Está libre el profesional durante toda la duración? */
export function estaLibre(citas: CitaAgenda[], profesionalId: string, inicio: string, duracionMin: number) {
  const fin = sumarMinutos(inicio, duracionMin)
  return !citas.some(
    (c) =>
      c.ocupa &&
      c.profesionalId === profesionalId &&
      c.inicio < fin &&
      inicio < sumarMinutos(c.inicio, c.duracionMin),
  )
}

/**
 * Horas libres de un día para una duración, con los profesionales que pueden
 * atender en cada una. `candidatos` son quienes saben hacer lo pedido.
 */
export function horasLibres(opciones: {
  citas: CitaAgenda[]
  profesionales: ProfesionalAgenda[]
  franjas: Record<number, Franja>
  dia: string
  duracionMin: number
  candidatos: string[]
  /** Nada antes de este instante (por defecto, ahora más media hora). */
  desde: string
}) {
  const { citas, profesionales, franjas, dia, duracionMin, candidatos, desde } = opciones
  const diaSemana = aFecha(dia).getDay()
  // La cita tiene que terminar dentro del horario: una de 90 minutos no empieza
  // en la última media hora.
  const cierre = finDeFranja(dia, franjas)
  if (!cierre) return []
  return franjasDelDia(dia, franjas)
    .filter((inicio) => inicio > desde && sumarMinutos(inicio, duracionMin) <= cierre)
    .map((inicio) => ({
      inicio,
      profesionales: candidatos.filter((id) => {
        const p = profesionales.find((x) => x.id === id)
        return p && p.dias.includes(diaSemana) && estaLibre(citas, id, inicio, duracionMin)
      }),
    }))
    .filter((h) => h.profesionales.length > 0)
}
