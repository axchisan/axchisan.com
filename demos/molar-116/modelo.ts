/**
 * Modelo de Molar 116, odontología (negocio ficticio). La disponibilidad viene
 * del motor de agenda; el odontograma y el presupuesto son de este consultorio.
 */
import type { Franja } from "@/demos/motores/agenda/tiempo"

export type Motivo = {
  id: string
  nombre: string
  descripcion: string
  duracionMin: number
  precio: number
  desde?: boolean
  /** Quiénes lo atienden. */
  odontologos: string[]
}

export type Odontologo = {
  id: string
  nombre: string
  especialidad: string
  registro: string
  dias: number[]
  iniciales: string
}

export const ODONTOLOGOS: Odontologo[] = [
  { id: "camila", nombre: "Dra. Camila Rueda", especialidad: "Odontología general y estética", registro: "RM 00000-1 (ejemplo)", dias: [1, 2, 3, 4, 5, 6], iniciales: "CR" },
  { id: "andres", nombre: "Dr. Andrés Ocampo", especialidad: "Ortodoncia", registro: "RM 00000-2 (ejemplo)", dias: [1, 3, 5, 6], iniciales: "AO" },
  { id: "lucia", nombre: "Dra. Lucía Barrera", especialidad: "Endodoncia", registro: "RM 00000-3 (ejemplo)", dias: [2, 4], iniciales: "LB" },
]

export const MOTIVOS: Motivo[] = [
  { id: "valoracion", nombre: "Valoración", descripcion: "Primera cita: revisión completa, radiografía panorámica si hace falta y presupuesto por escrito.", duracionMin: 30, precio: 60_000, odontologos: ["camila", "andres"] },
  { id: "limpieza", nombre: "Limpieza y profilaxis", descripcion: "Detartraje con ultrasonido, pulido y flúor. Se recomienda cada seis meses.", duracionMin: 45, precio: 140_000, odontologos: ["camila"] },
  { id: "resina", nombre: "Resinas", descripcion: "Arreglo de caries con resina del color del diente, por cara.", duracionMin: 60, precio: 150_000, desde: true, odontologos: ["camila"] },
  { id: "dolor", nombre: "Tengo dolor", descripcion: "Cita prioritaria el mismo día o el siguiente. Te decimos qué es y lo calmamos.", duracionMin: 30, precio: 90_000, odontologos: ["camila", "lucia"] },
  { id: "endodoncia", nombre: "Endodoncia", descripcion: "Tratamiento de conducto con microscopio. Precio según el diente.", duracionMin: 90, precio: 480_000, desde: true, odontologos: ["lucia"] },
  { id: "ortodoncia", nombre: "Control de ortodoncia", descripcion: "Ajuste mensual de brackets o cambio de alineadores.", duracionMin: 30, precio: 110_000, odontologos: ["andres"] },
  { id: "blanqueamiento", nombre: "Blanqueamiento", descripcion: "En consultorio, dos sesiones. Incluye valoración previa de sensibilidad.", duracionMin: 90, precio: 690_000, odontologos: ["camila"] },
]

export const motivo = (id: string) => MOTIVOS.find((m) => m.id === id)!
export const odontologo = (id: string) => ODONTOLOGOS.find((o) => o.id === id)!

export const CONSULTORIO = {
  nombre: "Molar 116",
  direccion: "Calle 116 con carrera 15, Usaquén, Bogotá (dirección de ejemplo)",
  telefono: "(601) 000 0000",
  whatsappVisible: "300 000 0000",
  correo: "citas@molar116.example",
}

export const HORARIO: Record<number, { abre: number; cierra: number } | null> = {
  0: null,
  1: { abre: 7, cierra: 19 },
  2: { abre: 7, cierra: 19 },
  3: { abre: 7, cierra: 19 },
  4: { abre: 7, cierra: 19 },
  5: { abre: 7, cierra: 19 },
  6: { abre: 8, cierra: 13 },
}

export const FRANJAS: Record<number, Franja> = Object.fromEntries(
  Object.entries(HORARIO).map(([d, h]) => [d, h ? { desde: h.abre, hasta: h.cierra - 0.5 } : null]),
)

// ─── Odontograma ──────────────────────────────────────────────────────────

/** Numeración FDI, en el orden en que se dibuja: de la derecha del paciente a su izquierda. */
export const ARCADA_SUPERIOR = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
export const ARCADA_INFERIOR = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

/** Caras del diente: vestibular, lingual o palatina, mesial, distal y oclusal o incisal. */
export type Cara = "V" | "L" | "M" | "D" | "O"
export const CARAS: Record<Cara, string> = { V: "vestibular", L: "lingual", M: "mesial", D: "distal", O: "oclusal" }

/** Hallazgos por cara (caries por tratar, resina hecha) y por diente. */
export type HallazgoCara = "caries" | "resina"
export type HallazgoDiente = "endodoncia" | "endodoncia-hecha" | "corona" | "corona-hecha" | "extraccion" | "ausente"

export type Diente = { caras?: Partial<Record<Cara, HallazgoCara>>; pieza?: HallazgoDiente }
export type Odontograma = Record<number, Diente>

export const esMolar = (n: number) => n % 10 >= 6
export const nombreDiente = (n: number) => {
  const d = n % 10
  const tipo = d <= 2 ? "incisivo" : d === 3 ? "canino" : d <= 5 ? "premolar" : "molar"
  const lado = [1, 4].includes(Math.floor(n / 10)) ? "derecho" : "izquierdo"
  const arcada = n < 30 ? "superior" : "inferior"
  return `${tipo} ${arcada} ${lado}`
}

/** Precios del presupuesto. */
export const PRECIO = {
  resinaPrimeraCara: 150_000,
  resinaCaraAdicional: 40_000,
  endodoncia: (n: number) => (esMolar(n) ? 680_000 : 480_000),
  corona: 950_000,
  extraccion: (n: number) => (n % 10 === 8 ? 380_000 : 160_000),
}

export type ItemPlan = { id: string; diente: number; nombre: string; precio: number }

/**
 * El plan de tratamiento sale del odontograma: todo lo que está en rojo tiene
 * un procedimiento y un precio. Lo que está en azul ya se hizo.
 */
export function planDe(o: Odontograma): ItemPlan[] {
  const items: ItemPlan[] = []
  for (const n of [...ARCADA_SUPERIOR, ...ARCADA_INFERIOR]) {
    const d = o[n]
    if (!d) continue
    const caries = (Object.entries(d.caras ?? {}) as [Cara, HallazgoCara][]).filter(([, h]) => h === "caries").map(([c]) => c)
    if (caries.length && d.pieza !== "extraccion" && d.pieza !== "ausente") {
      items.push({
        id: `${n}-resina`,
        diente: n,
        nombre: `Resina de ${caries.length === 1 ? "una cara" : `${caries.length} caras`} (${caries.map((c) => CARAS[c]).join(", ")})`,
        precio: PRECIO.resinaPrimeraCara + (caries.length - 1) * PRECIO.resinaCaraAdicional,
      })
    }
    if (d.pieza === "endodoncia") items.push({ id: `${n}-endo`, diente: n, nombre: "Endodoncia", precio: PRECIO.endodoncia(n) })
    if (d.pieza === "corona") items.push({ id: `${n}-corona`, diente: n, nombre: "Corona en cerámica", precio: PRECIO.corona })
    if (d.pieza === "extraccion") items.push({ id: `${n}-exo`, diente: n, nombre: n % 10 === 8 ? "Cirugía de cordal" : "Extracción", precio: PRECIO.extraccion(n) })
  }
  return items
}

/** Marca un ítem del plan como hecho: el rojo pasa a azul. */
export function hacerItem(o: Odontograma, item: ItemPlan): Odontograma {
  const d = { ...o[item.diente], caras: { ...o[item.diente]?.caras } }
  if (item.id.endsWith("-resina")) {
    for (const c of Object.keys(d.caras) as Cara[]) if (d.caras[c] === "caries") d.caras[c] = "resina"
  }
  if (item.id.endsWith("-endo")) d.pieza = "endodoncia-hecha"
  if (item.id.endsWith("-corona")) d.pieza = "corona-hecha"
  if (item.id.endsWith("-exo")) {
    d.pieza = "ausente"
    d.caras = {}
  }
  return { ...o, [item.diente]: d }
}

// ─── Estado de la demo ────────────────────────────────────────────────────

export type MetodoPago = "efectivo" | "nequi" | "tarjeta" | "transferencia"
export const PAGO: Record<MetodoPago, string> = { efectivo: "Efectivo", nequi: "Nequi", tarjeta: "Tarjeta", transferencia: "Transferencia" }

export type Paciente = {
  id: string
  nombre: string
  documento: string
  telefono: string
  nacimiento: string
  alergias?: string
  odontograma: Odontograma
  /** Presupuesto aprobado: total del plan en el momento en que el paciente lo aceptó. */
  aprobado?: number
  abonos: { fecha: string; valor: number; metodo: MetodoPago }[]
  /** Procedimientos del plan ya hechos, con su fecha. */
  hechos: (ItemPlan & { fecha: string })[]
  /** Hecho y cobrado aparte del plan (limpiezas, valoraciones). */
  ultimaLimpieza?: string
  notas?: string
}

export type EstadoCita = "agendada" | "llego" | "atendida" | "no-asistio"

export type Cita = {
  id: string
  pacienteId: string
  motivo: string
  odontologoId: string
  inicio: string
  estado: EstadoCita
  origen: "web" | "recepcion"
  nota?: string
}

export type EstadoConsultorio = {
  referencia: string
  pacientes: Paciente[]
  citas: Cita[]
}

export function textoDuracion(minutos: number) {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
