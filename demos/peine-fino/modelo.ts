/**
 * Modelo de Peine Fino, salón y barbería (negocio ficticio).
 * Fechas y disponibilidad vienen del motor de agenda.
 */
import type { Franja } from "@/demos/motores/agenda/tiempo"

export type Categoria = "Barbería" | "Cabello" | "Color" | "Uñas" | "Cejas y pestañas"

export type Servicio = {
  id: string
  nombre: string
  categoria: Categoria
  duracionMin: number
  precio: number
  /** "desde" cuando el valor final depende del largo o del caso. */
  desde?: boolean
  profesionales: string[]
}

export type Profesional = {
  id: string
  nombre: string
  oficio: string
  especialidad: string
  /** 0 = domingo … 6 = sábado. */
  dias: number[]
  /** Porcentaje de cada servicio que recibe el profesional. */
  comision: number
  color: string
  trabajos: { src: string; alt: string }[]
}

export type MetodoPago = "efectivo" | "nequi" | "daviplata" | "tarjeta"

export type EstadoCita = "agendada" | "en-silla" | "atendida" | "no-asistio"

export type Cita = {
  id: string
  clienteId: string
  /** Una reserva puede llevar varios servicios; se hacen en orden, seguidos. */
  servicios: string[]
  profesionalId: string
  inicio: string
  estado: EstadoCita
  origen: "web" | "recepcion"
  nota?: string
  pago?: { metodo: MetodoPago; total: number; propina: number }
}

export type FormulaColor = {
  fecha: string
  profesionalId: string
  texto: string
}

export type Cliente = {
  id: string
  nombre: string
  telefono: string
  notas?: string
  formulas: FormulaColor[]
  /** Último día en que se le escribió para que volviera. */
  contactado?: string
}

export type EstadoSalon = {
  referencia: string
  clientes: Cliente[]
  citas: Cita[]
}

// ─── Datos fijos del negocio ──────────────────────────────────────────────

export const SALON = {
  nombre: "Peine Fino",
  nombreCompleto: "Peine Fino, salón y barbería",
  zona: "Galerías, Bogotá",
  direccion: "Galerías, Bogotá (dirección de ejemplo)",
  telefono: "(601) 000 0000",
  whatsappVisible: "300 000 0000",
  instagram: "@peinefino.ejemplo",
} as const

/** Horario de atención por día, en horas decimales. */
export const HORARIO: Record<number, { abre: number; cierra: number } | null> = {
  0: { abre: 10, cierra: 15 },
  1: { abre: 9, cierra: 19 },
  2: { abre: 9, cierra: 19 },
  3: { abre: 9, cierra: 19 },
  4: { abre: 9, cierra: 19 },
  5: { abre: 9, cierra: 20 },
  6: { abre: 9, cierra: 20 },
}

/** Inicios de cita posibles: la última media hora antes de cerrar. */
export const FRANJAS: Record<number, Franja> = Object.fromEntries(
  Object.entries(HORARIO).map(([d, h]) => [d, h ? { desde: h.abre, hasta: h.cierra - 0.5 } : null]),
)

const U = "https://images.unsplash.com"

export const FOTOS = {
  barba: { src: `${U}/photo-1599011176306-4a96f1516d4d`, alt: "Barbero recortando una barba con tijera" },
  peine: { src: `${U}/photo-1657105052497-f996284ffff8`, alt: "Corte con peine y tijera de entresacar" },
  color: { src: `${U}/photo-1707720531504-ce087725861a`, alt: "Aplicación de color con papel de aluminio" },
  mechas: { src: `${U}/photo-1707979577466-2d6109c68a45`, alt: "Dos coloristas aplicando mechas" },
  ondas: { src: `${U}/photo-1629397685944-7073f5589754`, alt: "Estilista haciendo ondas con tenaza" },
  unas: { src: `${U}/photo-1659391542239-9648f307c0b1`, alt: "Manicurista pintando uñas" },
  tijera: { src: `${U}/photo-1647140655214-e4a2d914971f`, alt: "Corte de cabello con tijera y peine" },
  salon: { src: `${U}/photo-1695527081848-1e46c06e6458`, alt: "Interior luminoso de un salón de belleza" },
  sillas: { src: `${U}/photo-1521590832167-7bcbfaa6381f`, alt: "Tres sillas de salón color vino frente al espejo" },
}

export const PROFESIONALES: Profesional[] = [
  {
    id: "andres",
    nombre: "Andrés Pardo",
    oficio: "Barbero",
    especialidad: "Degradados y barba con navaja",
    dias: [2, 3, 4, 5, 6],
    comision: 40,
    color: "#5b1e26",
    trabajos: [FOTOS.barba, FOTOS.tijera],
  },
  {
    id: "mateo",
    nombre: "Mateo Ruiz",
    oficio: "Barbero",
    especialidad: "Cortes clásicos y perfilado de cejas",
    dias: [0, 1, 2, 4, 5, 6],
    comision: 40,
    color: "#2f4f6f",
    trabajos: [FOTOS.peine],
  },
  {
    id: "valeria",
    nombre: "Valeria Gómez",
    oficio: "Colorista",
    especialidad: "Balayage, mechas y corrección de color",
    dias: [2, 3, 4, 5, 6],
    comision: 45,
    color: "#6b4c1f",
    trabajos: [FOTOS.color, FOTOS.mechas],
  },
  {
    id: "sofia",
    nombre: "Sofía Herrera",
    oficio: "Estilista",
    especialidad: "Cortes de dama, cepillados y peinados de evento",
    dias: [1, 2, 3, 5, 6],
    comision: 40,
    color: "#35603f",
    trabajos: [FOTOS.ondas, FOTOS.salon],
  },
  {
    id: "karen",
    nombre: "Karen López",
    oficio: "Manicurista",
    especialidad: "Uñas semipermanentes, cejas y pestañas",
    dias: [1, 2, 3, 4, 5, 6],
    comision: 50,
    color: "#6a3f63",
    trabajos: [FOTOS.unas],
  },
]

const BARBEROS = ["andres", "mateo"]

export const SERVICIOS: Servicio[] = [
  { id: "corte-hombre", nombre: "Corte de hombre", categoria: "Barbería", duracionMin: 30, precio: 25_000, profesionales: BARBEROS },
  { id: "barba", nombre: "Barba con toalla caliente", categoria: "Barbería", duracionMin: 30, precio: 18_000, profesionales: BARBEROS },
  { id: "cejas-hombre", nombre: "Perfilado de cejas", categoria: "Barbería", duracionMin: 15, precio: 8_000, profesionales: BARBEROS },
  { id: "corte-dama", nombre: "Corte de dama", categoria: "Cabello", duracionMin: 45, precio: 40_000, profesionales: ["sofia"] },
  { id: "cepillado", nombre: "Cepillado", categoria: "Cabello", duracionMin: 45, precio: 30_000, profesionales: ["sofia", "valeria"] },
  { id: "peinado", nombre: "Peinado de evento", categoria: "Cabello", duracionMin: 60, precio: 60_000, profesionales: ["sofia"] },
  { id: "hidratacion", nombre: "Hidratación profunda", categoria: "Cabello", duracionMin: 45, precio: 45_000, profesionales: ["sofia", "valeria"] },
  { id: "tinte", nombre: "Tinte de raíz", categoria: "Color", duracionMin: 90, precio: 90_000, desde: true, profesionales: ["valeria"] },
  { id: "balayage", nombre: "Balayage o mechas", categoria: "Color", duracionMin: 180, precio: 220_000, desde: true, profesionales: ["valeria"] },
  { id: "manicure", nombre: "Manicure tradicional", categoria: "Uñas", duracionMin: 45, precio: 20_000, profesionales: ["karen"] },
  { id: "semipermanente", nombre: "Uñas semipermanentes", categoria: "Uñas", duracionMin: 60, precio: 35_000, profesionales: ["karen"] },
  { id: "pedicure", nombre: "Pedicure", categoria: "Uñas", duracionMin: 60, precio: 28_000, profesionales: ["karen"] },
  { id: "cejas", nombre: "Diseño de cejas", categoria: "Cejas y pestañas", duracionMin: 30, precio: 18_000, profesionales: ["karen"] },
  { id: "pestanas", nombre: "Lifting de pestañas", categoria: "Cejas y pestañas", duracionMin: 60, precio: 55_000, profesionales: ["karen"] },
]

export const CATEGORIAS: Categoria[] = ["Barbería", "Cabello", "Color", "Uñas", "Cejas y pestañas"]

export const METODOS: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  nequi: "Nequi",
  daviplata: "Daviplata",
  tarjeta: "Tarjeta",
}

/** Días sin venir a partir de los cuales un cliente se considera perdido. */
export const DIAS_SIN_VOLVER = 45

// ─── Cálculos sobre servicios ────────────────────────────────────────────

export function servicio(id: string) {
  return SERVICIOS.find((s) => s.id === id)!
}

export function profesional(id: string) {
  return PROFESIONALES.find((p) => p.id === id)!
}

export function duracion(servicios: string[]) {
  return servicios.reduce((t, id) => t + servicio(id).duracionMin, 0)
}

export function precio(servicios: string[]) {
  return servicios.reduce((t, id) => t + servicio(id).precio, 0)
}

/** Quién sabe hacer todos los servicios pedidos. */
export function quienesHacen(servicios: string[]) {
  return PROFESIONALES.filter((p) => servicios.every((s) => servicio(s).profesionales.includes(p.id))).map(
    (p) => p.id,
  )
}

export function textoDuracion(minutos: number) {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
