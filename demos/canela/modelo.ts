/**
 * Modelo de Canela, clínica veterinaria (negocio ficticio).
 *
 * Las fechas se guardan como texto en hora local: `AAAA-MM-DD` para días y
 * `AAAA-MM-DDTHH:mm` para instantes. La demo no cruza zonas horarias, y así
 * lo que se guarda es exactamente lo que se ve.
 */

import { aFecha, diasEntre, franjasDelDia as franjasMotor } from "@/demos/motores/agenda/tiempo"

export type Especie = "perro" | "gato"

export type Profesional = {
  id: string
  nombre: string
  cargo: string
  enfoque: string
  /** 0 = domingo … 6 = sábado. */
  dias: number[]
  color: string
}

export type Servicio = {
  id: string
  nombre: string
  descripcion: string
  duracionMin: number
  precio: number
  /** "desde" cuando el valor final depende del peso o del caso. */
  desde?: boolean
  profesionales: string[]
}

export type Propietario = {
  id: string
  nombre: string
  telefono: string
  barrio: string
}

export type Mascota = {
  id: string
  propietarioId: string
  nombre: string
  especie: Especie
  raza: string
  sexo: "macho" | "hembra"
  esterilizado: boolean
  nacimiento: string
  pesos: { fecha: string; kg: number }[]
  alergias: string[]
  alertas: string[]
  foto?: string
}

export type Vacuna = {
  id: string
  mascotaId: string
  nombre: string
  aplicada: string
  proxima: string
  /** Día en que se envió el último recordatorio al propietario. */
  recordada?: string
}

export type LineaFormula = {
  medicamento: string
  indicacion: string
}

export type Consulta = {
  id: string
  mascotaId: string
  fecha: string
  profesionalId: string
  motivo: string
  anamnesis: string
  examen: string
  diagnostico: string
  tratamiento: string
  formula: LineaFormula[]
}

export type EstadoCita = "agendada" | "en-sala" | "atendida" | "no-asistio"

export type Cita = {
  id: string
  mascotaId: string
  servicioId: string
  profesionalId: string
  inicio: string
  estado: EstadoCita
  origen: "web" | "recepcion"
  nota?: string
}

export type EstadoClinica = {
  /** Día en que se generaron o ajustaron por última vez las fechas. */
  referencia: string
  propietarios: Propietario[]
  mascotas: Mascota[]
  vacunas: Vacuna[]
  consultas: Consulta[]
  citas: Cita[]
}

// ─── Datos fijos del negocio ──────────────────────────────────────────────

export const CLINICA = {
  nombre: "Canela",
  nombreCompleto: "Canela, clínica veterinaria",
  zona: "Chapinero, Bogotá",
  direccion: "Chapinero Alto, Bogotá (dirección de ejemplo)",
  telefono: "(601) 000 0000",
  whatsappVisible: "300 000 0000",
  correo: "hola@canela.example",
  urgencias: "Urgencias hasta las 10:00 p. m. todos los días",
} as const

/**
 * Horario de atención por día de la semana, en horas decimales. `urgencias`
 * es hasta cuándo se atienden urgencias ese día.
 */
export const HORARIO: Record<number, { abre: number; cierra: number; urgencias: number } | null> = {
  0: { abre: 10, cierra: 14, urgencias: 22 },
  1: { abre: 8, cierra: 20, urgencias: 22 },
  2: { abre: 8, cierra: 20, urgencias: 22 },
  3: { abre: 8, cierra: 20, urgencias: 22 },
  4: { abre: 8, cierra: 20, urgencias: 22 },
  5: { abre: 8, cierra: 20, urgencias: 22 },
  6: { abre: 9, cierra: 16, urgencias: 22 },
}

/** Franjas de cita: consulta programada, no urgencias. */
export const FRANJAS: Record<number, { desde: number; hasta: number } | null> = {
  0: null,
  1: { desde: 8, hasta: 19.5 },
  2: { desde: 8, hasta: 19.5 },
  3: { desde: 8, hasta: 19.5 },
  4: { desde: 8, hasta: 19.5 },
  5: { desde: 8, hasta: 19.5 },
  6: { desde: 9, hasta: 15.5 },
}

export const PROFESIONALES: Profesional[] = [
  {
    id: "laura",
    nombre: "Dra. Laura Méndez",
    cargo: "Médica veterinaria",
    enfoque: "Medicina general y pacientes felinos",
    dias: [1, 2, 3, 4, 5],
    color: "#1c3552",
  },
  {
    id: "andres",
    nombre: "Dr. Andrés Rincón",
    cargo: "Médico veterinario cirujano",
    enfoque: "Cirugía de tejidos blandos y ortopedia",
    dias: [1, 3, 5, 6],
    color: "#7a4e9c",
  },
  {
    id: "paula",
    nombre: "Dra. Paula Castaño",
    cargo: "Médica veterinaria",
    enfoque: "Dermatología y alergias",
    dias: [2, 4, 5, 6],
    color: "#1f7a80",
  },
  {
    id: "camila",
    nombre: "Camila Ortiz",
    cargo: "Peluquera canina y felina",
    enfoque: "Baño, corte y manejo de mascotas nerviosas",
    dias: [1, 2, 3, 4, 5, 6],
    color: "#8a6a12",
  },
]

export const SERVICIOS: Servicio[] = [
  {
    id: "consulta",
    nombre: "Consulta general",
    descripcion: "Revisión completa, diagnóstico y plan de tratamiento.",
    duracionMin: 30,
    precio: 70_000,
    profesionales: ["laura", "paula", "andres"],
  },
  {
    id: "vacunacion",
    nombre: "Vacunación",
    descripcion: "Múltiple, rabia y triple felina, con carnet al día.",
    duracionMin: 30,
    precio: 75_000,
    desde: true,
    profesionales: ["laura", "paula"],
  },
  {
    id: "desparasitacion",
    nombre: "Desparasitación",
    descripcion: "Interna y externa, con la dosis según el peso.",
    duracionMin: 30,
    precio: 35_000,
    desde: true,
    profesionales: ["laura", "paula"],
  },
  {
    id: "dermatologia",
    nombre: "Dermatología",
    descripcion: "Picazón, caída de pelo, otitis y alergias.",
    duracionMin: 30,
    precio: 90_000,
    profesionales: ["paula"],
  },
  {
    id: "cirugia",
    nombre: "Valoración para cirugía",
    descripcion: "Esterilización desde $ 350.000, según especie y peso.",
    duracionMin: 30,
    precio: 80_000,
    profesionales: ["andres"],
  },
  {
    id: "laboratorio",
    nombre: "Laboratorio clínico",
    descripcion: "Cuadro hemático, química sanguínea y parcial de orina.",
    duracionMin: 30,
    precio: 60_000,
    desde: true,
    profesionales: ["laura", "andres", "paula"],
  },
  {
    id: "peluqueria",
    nombre: "Peluquería y baño",
    descripcion: "Baño, corte, uñas y limpieza de oídos.",
    duracionMin: 60,
    precio: 55_000,
    desde: true,
    profesionales: ["camila"],
  },
]

export const PRECIO_URGENCIA = 120_000

// ─── Fechas ───────────────────────────────────────────────────────────────
// Vienen del motor de agenda, que comparten todas las demos con reservas.

export {
  aFecha,
  claveDia,
  claveInstante,
  diasEntre,
  sumarDias,
  sumarMinutos,
  textoDia,
  textoFecha,
  textoHora,
  textoHoraDecimal,
} from "@/demos/motores/agenda/tiempo"

export function edad(nacimiento: string, hoy = new Date()) {
  const n = aFecha(nacimiento)
  let meses = (hoy.getFullYear() - n.getFullYear()) * 12 + (hoy.getMonth() - n.getMonth())
  if (hoy.getDate() < n.getDate()) meses -= 1
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`
  const anos = Math.floor(meses / 12)
  return `${anos} ${anos === 1 ? "año" : "años"}`
}

export type EstadoVacuna = "vencida" | "proxima" | "al-dia"

/** Vencida si ya pasó; próxima si vence en los siguientes 30 días. */
export function estadoVacuna(v: Vacuna, hoy: string): EstadoVacuna {
  const dias = diasEntre(hoy, v.proxima)
  if (dias < 0) return "vencida"
  if (dias <= 30) return "proxima"
  return "al-dia"
}

export function franjasDelDia(dia: string) {
  return franjasMotor(dia, FRANJAS)
}
