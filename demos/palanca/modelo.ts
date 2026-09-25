/**
 * Modelo de Palanca, entrenamiento funcional (negocio ficticio). Cupos,
 * reservas y membresías vienen del motor de clases.
 */
import type { ClaseSemanal, Membresia, Plan, Reserva } from "@/demos/motores/clases/cupos"

export type Tipo = { id: string; nombre: string; descripcion: string; color: string; claro?: boolean }

/** Cada tipo de clase lleva el color de un disco olímpico. */
export const TIPOS: Tipo[] = [
  { id: "fuerza", nombre: "Fuerza", descripcion: "Sentadilla, peso muerto y press con barra. Técnica primero, carga después.", color: "#c41f1f" },
  { id: "funcional", nombre: "Funcional", descripcion: "Circuitos con kettlebell, balón y peso corporal. La clase para empezar.", color: "#1d4ed8" },
  { id: "movilidad", nombre: "Movilidad", descripcion: "Articulaciones, espalda y cadera. Para quien pasa el día sentado.", color: "#f5c518", claro: true },
  { id: "hiit", nombre: "HIIT", descripcion: "Intervalos de alta intensidad en remo, bicicleta y cuerda. 45 minutos que se sienten.", color: "#15803d" },
]

export const tipo = (id: string) => TIPOS.find((t) => t.id === id)!

export type Coach = { id: string; nombre: string; iniciales: string; especialidad: string }

export const COACHES: Coach[] = [
  { id: "valentina", nombre: "Valentina Holguín", iniciales: "VH", especialidad: "Fuerza y levantamiento olímpico" },
  { id: "jhon", nombre: "Jhon Mosquera", iniciales: "JM", especialidad: "Funcional y HIIT" },
  { id: "manuela", nombre: "Manuela Riascos", iniciales: "MR", especialidad: "Movilidad y yoga" },
  { id: "kevin", nombre: "Kevin Angulo", iniciales: "KA", especialidad: "Funcional para principiantes" },
]

export const coach = (id: string) => COACHES.find((c) => c.id === id)!

const c = (tipoId: string, dia: number, hora: string, coachId: string, duracionMin = 60): ClaseSemanal => ({
  id: `${tipoId}-${dia}-${hora.replace(":", "")}`,
  tipo: tipoId,
  dia,
  hora,
  duracionMin,
  cupo: tipoId === "fuerza" ? 10 : tipoId === "movilidad" ? 14 : 12,
  coachId,
})

/** Horario semanal: mañana temprano, mediodía y noche entre semana; sábado en la mañana. */
export const HORARIO: ClaseSemanal[] = [1, 2, 3, 4, 5].flatMap((d) => [
  c(d % 2 ? "funcional" : "fuerza", d, "05:30", d % 2 ? "jhon" : "valentina"),
  c(d % 2 ? "fuerza" : "funcional", d, "06:30", d % 2 ? "valentina" : "kevin"),
  c("movilidad", d, "07:30", "manuela", 45),
  c("hiit", d, "12:15", "jhon", 45),
  c(d % 2 ? "funcional" : "hiit", d, "17:30", d % 2 ? "kevin" : "jhon", d % 2 ? 60 : 45),
  c(d % 2 ? "hiit" : "fuerza", d, "18:30", d % 2 ? "jhon" : "valentina", d % 2 ? 45 : 60),
  c("funcional", d, "19:30", "kevin"),
]).concat([c("funcional", 6, "08:00", "kevin"), c("fuerza", 6, "09:00", "valentina", 75), c("movilidad", 6, "10:30", "manuela")])

export const PLANES: Plan[] = [
  { id: "mensual", nombre: "Mensual sin límite", precio: 189_000, dias: 30 },
  { id: "tiquetera", nombre: "Tiquetera de 12 clases", precio: 149_000, dias: 45, clases: 12 },
  { id: "trimestral", nombre: "Trimestral sin límite", precio: 499_000, dias: 90 },
  { id: "suelta", nombre: "Clase suelta", precio: 25_000, dias: 1, clases: 1 },
]

export const plan = (id: string) => PLANES.find((p) => p.id === id)!

const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

export const FOTOS = {
  portada: { src: u("photo-1758875569256-f37c438cac65", 1600), alt: "Mujer levantando una barra mientras su entrenador la observa", autor: "Vitaly Gariev" },
  tecnica: { src: u("photo-1648542036561-e1d66a5ae2b1"), alt: "Entrenador corrigiendo la técnica de un swing con kettlebell", autor: "maxhome fitness" },
}

export const CENTRO = {
  nombre: "Palanca",
  direccion: "Carrera 34 con calle 5, San Fernando, Cali (dirección de ejemplo)",
  whatsappVisible: "300 000 0000",
  instagram: "@palanca.cali (ejemplo)",
}

// ─── Estado de la demo ────────────────────────────────────────────────────

export type MetodoPago = "efectivo" | "nequi" | "tarjeta" | "transferencia"
export const PAGO: Record<MetodoPago, string> = { efectivo: "Efectivo", nequi: "Nequi", tarjeta: "Tarjeta", transferencia: "Transferencia" }

export type Socio = {
  id: string
  nombre: string
  documento: string
  telefono: string
  membresia?: Membresia
  /** Vino a la clase gratis y todavía no tiene plan. */
  invitado?: boolean
  alta: string
}

export type Pago = { id: string; socioId: string; planId: string; valor: number; fecha: string; metodo: MetodoPago }

export type EstadoGimnasio = {
  referencia: string
  socios: Socio[]
  reservas: Reserva[]
  pagos: Pago[]
}
