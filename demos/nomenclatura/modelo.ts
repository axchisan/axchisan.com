/**
 * Modelo de Nomenclatura, finca raíz (negocio ficticio) en el sur del Valle de
 * Aburrá. Filtros y crédito vienen del motor de listados; la disponibilidad de
 * los asesores para las visitas, del motor de agenda.
 */
import type { Franja } from "@/demos/motores/agenda/tiempo"

const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

export type Operacion = "venta" | "arriendo"
export type TipoInmueble = "Apartamento" | "Casa" | "Apartaestudio" | "Loft"

export const ZONAS = ["Laureles", "El Poblado", "Envigado", "Sabaneta", "Belén", "El Retiro"] as const
export type Zona = (typeof ZONAS)[number]

export type Foto = { src: string; alt: string; autor: string }

export type Inmueble = {
  id: string
  codigo: string
  titulo: string
  operacion: Operacion
  tipo: TipoInmueble
  zona: Zona
  barrio: string
  /** Venta: precio total. Arriendo: canon mensual. */
  precio: number
  administracion: number
  area: number
  habitaciones: number
  banos: number
  parqueaderos: number
  estrato: number
  piso?: number
  /** Años de construido; 0 es para estrenar. */
  antiguedad: number
  descripcion: string
  caracteristicas: string[]
  fotos: Foto[]
  /** Posición en el mapa esquemático, de 0 a 100. */
  mapa: { x: number; y: number }
  /** Días desde que se publicó. */
  publicado: number
  asesorId: string
}

export type Asesor = { id: string; nombre: string; iniciales: string; zonas: string; dias: number[] }

export const ASESORES: Asesor[] = [
  { id: "juliana", nombre: "Juliana Restrepo", iniciales: "JR", zonas: "El Poblado y Envigado", dias: [1, 2, 3, 4, 5, 6] },
  { id: "carlos", nombre: "Carlos Mario Vélez", iniciales: "CV", zonas: "Laureles y Belén", dias: [1, 2, 3, 4, 5] },
  { id: "natalia", nombre: "Natalia Ochoa", iniciales: "NO", zonas: "Sabaneta y El Retiro", dias: [2, 3, 4, 5, 6] },
]

export const asesor = (id: string) => ASESORES.find((a) => a.id === id)!

/** Visitas cada media hora de 8:00 a. m. a 5:00 p. m.; sábados hasta el mediodía. */
export const FRANJAS_VISITA: Record<number, Franja> = { 0: null, 1: { desde: 8, hasta: 17 }, 2: { desde: 8, hasta: 17 }, 3: { desde: 8, hasta: 17 }, 4: { desde: 8, hasta: 17 }, 5: { desde: 8, hasta: 17 }, 6: { desde: 9, hasta: 12 } }
export const DURACION_VISITA = 45

const F = (id: string, alt: string, autor: string) => [id, alt, autor] as const

const LISTA: (Omit<Inmueble, "codigo" | "fotos"> & { fotos: (readonly [string, string, string])[] })[] = [
  {
    id: "laureles-balcon", titulo: "Apartamento con balcón sobre la 70", operacion: "venta", tipo: "Apartamento", zona: "Laureles", barrio: "Laureles, segundo parque",
    precio: 520_000_000, administracion: 380_000, area: 96, habitaciones: 3, banos: 2, parqueaderos: 1, estrato: 5, piso: 4, antiguedad: 18,
    descripcion: "Luz de la mañana, balcón con plantas y a dos cuadras del segundo parque de Laureles. Cocina remodelada en 2024 y pisos en madera en las alcobas.",
    caracteristicas: ["Balcón", "Cocina integral remodelada", "Cuarto útil", "Portería 24 horas", "Cerca al metro de la 70"],
    fotos: [F("photo-1665249934445-1de680641f50", "Sala con ventanal y balcón con plantas", "Danilo Rios"), F("photo-1630699293875-e56c25151c4b", "Cocina integral blanca", "Point3D Commercial Imaging Ltd.")],
    mapa: { x: 30, y: 30 }, publicado: 3, asesorId: "carlos",
  },
  {
    id: "poblado-vista", titulo: "Apartamento con vista a la ciudad en El Poblado", operacion: "venta", tipo: "Apartamento", zona: "El Poblado", barrio: "Loma de Los Parra",
    precio: 890_000_000, administracion: 720_000, area: 128, habitaciones: 3, banos: 3, parqueaderos: 2, estrato: 6, piso: 11, antiguedad: 7,
    descripcion: "Piso once con ventanales de piso a techo hacia el valle. Unidad con piscina, gimnasio y zonas verdes. Dos parqueaderos cubiertos y depósito.",
    caracteristicas: ["Vista abierta", "Piscina", "Gimnasio", "Dos parqueaderos", "Depósito", "Planta eléctrica"],
    fotos: [F("photo-1612419299101-6c294dc2901d", "Sala amplia con ventanal hacia la ciudad", "Huy Nguyen"), F("photo-1560448075-57d0285fc59b", "Alcoba principal con mesas de noche", "Francesca Tosolini")],
    mapa: { x: 70, y: 36 }, publicado: 9, asesorId: "juliana",
  },
  {
    id: "envigado-cocina", titulo: "Apartamento remodelado en Envigado", operacion: "venta", tipo: "Apartamento", zona: "Envigado", barrio: "La Magnolia",
    precio: 435_000_000, administracion: 290_000, area: 82, habitaciones: 2, banos: 2, parqueaderos: 1, estrato: 4, piso: 6, antiguedad: 12,
    descripcion: "Cocina abierta con isla, dos alcobas con baño cada una y estudio. A cinco minutos del parque de Envigado caminando.",
    caracteristicas: ["Cocina abierta con isla", "Estudio", "Ascensor", "Parqueadero cubierto"],
    fotos: [F("photo-1501876725168-00c445821c9e", "Sala blanca con mesa de madera", "ian dooley"), F("photo-1759691337957-ebc9ed54dc44", "Cocina con isla y butacos amarillos", "Raphael (Ajani Kamali Akio)")],
    mapa: { x: 64, y: 70 }, publicado: 1, asesorId: "juliana",
  },
  {
    id: "sabaneta-familiar", titulo: "Apartamento familiar en Sabaneta", operacion: "arriendo", tipo: "Apartamento", zona: "Sabaneta", barrio: "Aves María",
    precio: 2_400_000, administracion: 260_000, area: 74, habitaciones: 3, banos: 2, parqueaderos: 1, estrato: 4, piso: 3, antiguedad: 5,
    descripcion: "Unidad cerrada con parque infantil y piscina. Tres alcobas, patio de ropas y parqueadero. Arriendo con póliza o fiador con finca raíz.",
    caracteristicas: ["Unidad cerrada", "Piscina", "Parque infantil", "Patio de ropas"],
    fotos: [F("photo-1493809842364-78817add7ffb", "Sala con sofá azul y ventanal", "Jarek Ceborski"), F("photo-1630699375019-c334927264df", "Alcoba con cama doble", "Point3D Commercial Imaging Ltd.")],
    mapa: { x: 52, y: 93 }, publicado: 5, asesorId: "natalia",
  },
  {
    id: "belen-arriendo", titulo: "Apartamento cerca a la Unidad Deportiva de Belén", operacion: "arriendo", tipo: "Apartamento", zona: "Belén", barrio: "La Mota",
    precio: 1_900_000, administracion: 180_000, area: 68, habitaciones: 2, banos: 2, parqueaderos: 1, estrato: 4, piso: 2, antiguedad: 15,
    descripcion: "Dos alcobas, balcón interior y cocina integral. Cerca a la unidad deportiva y a rutas de bus hacia El Poblado.",
    caracteristicas: ["Balcón", "Cocina integral", "Parqueadero", "Mascotas pequeñas"],
    fotos: [F("photo-1630699294897-723e02620662", "Sala gris con sillón", "Point3D Commercial Imaging Ltd."), F("photo-1759691337936-ef702afd0714", "Cocina con barra y electrodomésticos", "Raphael (Ajani Kamali Akio)")],
    mapa: { x: 24, y: 66 }, publicado: 12, asesorId: "carlos",
  },
  {
    id: "poblado-amoblado", titulo: "Apartamento amoblado en Provenza", operacion: "arriendo", tipo: "Apartamento", zona: "El Poblado", barrio: "Provenza",
    precio: 5_800_000, administracion: 0, area: 88, habitaciones: 2, banos: 2, parqueaderos: 1, estrato: 6, piso: 8, antiguedad: 4,
    descripcion: "Amoblado y equipado, con servicios e internet incluidos. Ideal para quien llega a Medellín por trabajo. Contrato desde seis meses.",
    caracteristicas: ["Amoblado", "Servicios incluidos", "Internet de fibra", "Terraza comunal", "Contrato desde seis meses"],
    fotos: [F("photo-1741764014072-68953e93cd48", "Sala abierta a la cocina, amoblada", "Melrose By The Lake"), F("photo-1612320743558-020669ff20e8", "Sala de televisión con mueble de madera", "Huy Nguyen")],
    mapa: { x: 76, y: 24 }, publicado: 2, asesorId: "juliana",
  },
  {
    id: "loft-ciudad-del-rio", titulo: "Loft en Ciudad del Río", operacion: "venta", tipo: "Loft", zona: "El Poblado", barrio: "Ciudad del Río",
    precio: 610_000_000, administracion: 540_000, area: 72, habitaciones: 1, banos: 2, parqueaderos: 1, estrato: 5, piso: 14, antiguedad: 9,
    descripcion: "Doble altura, alcoba en mezanine y biblioteca de piso a techo. Al lado del Museo de Arte Moderno y del parque Ciudad del Río.",
    caracteristicas: ["Doble altura", "Mezanine", "Coworking en el edificio", "Parqueadero de bicicletas"],
    fotos: [F("photo-1536376072261-38c75010e6c9", "Loft con biblioteca y sofá verde", "Nathan Van Egmond"), F("photo-1529408632839-a54952c491e5", "Sala de televisión del loft", "Grant")],
    mapa: { x: 56, y: 22 }, publicado: 20, asesorId: "juliana",
  },
  {
    id: "estudio-laureles", titulo: "Apartaestudio para estudiante en Laureles", operacion: "arriendo", tipo: "Apartaestudio", zona: "Laureles", barrio: "Bolivariana",
    precio: 1_350_000, administracion: 0, area: 32, habitaciones: 1, banos: 1, parqueaderos: 0, estrato: 4, piso: 2, antiguedad: 10,
    descripcion: "A diez minutos a pie de la Universidad Pontificia Bolivariana. Con cocineta, baño privado y administración incluida en el canon.",
    caracteristicas: ["Administración incluida", "Cocineta", "Cerca a universidades", "Sin fiador con póliza"],
    fotos: [F("photo-1585128792103-0b591f96512e", "Apartaestudio luminoso con cama junto a la ventana", "Julia"), F("photo-1649068559107-e5d936141e44", "Cama junto a la ventana", "Andrew Kayani")],
    mapa: { x: 18, y: 30 }, publicado: 4, asesorId: "carlos",
  },
  {
    id: "envigado-casa", titulo: "Casa con patio en Envigado", operacion: "venta", tipo: "Casa", zona: "Envigado", barrio: "Loma del Esmeraldal",
    precio: 980_000_000, administracion: 0, area: 210, habitaciones: 4, banos: 4, parqueaderos: 2, estrato: 5, antiguedad: 22,
    descripcion: "Casa de dos niveles con patio, estudio y terraza. Calle cerrada y tranquila, a diez minutos de la Avenida Las Vegas.",
    caracteristicas: ["Patio", "Terraza", "Estudio", "Calle cerrada", "Dos parqueaderos"],
    fotos: [F("photo-1661796428215-04fc2830aae6", "Sala con sofá verde y mesa de centro", "Evan Wise"), F("photo-1702014861736-d62834317c5e", "Alcoba amplia con ventanal", "Aquilion Property")],
    mapa: { x: 80, y: 72 }, publicado: 15, asesorId: "juliana",
  },
  {
    id: "sabaneta-estrenar", titulo: "Apartamento para estrenar en Sabaneta", operacion: "venta", tipo: "Apartamento", zona: "Sabaneta", barrio: "Mayorca",
    precio: 398_000_000, administracion: 240_000, area: 64, habitaciones: 2, banos: 2, parqueaderos: 1, estrato: 4, piso: 9, antiguedad: 0,
    descripcion: "Proyecto entregado este año, con zonas comunes completas. Aplica para subsidio de tasa si es tu primera vivienda.",
    caracteristicas: ["Para estrenar", "Piscina", "Coworking", "Zona BBQ", "Cerca a Mayorca"],
    fotos: [F("photo-1501688639626-9804fb1ad475", "Fachada de edificio nuevo de apartamentos", "Patrick Tomasso"), F("photo-1781249144275-c04daed37031", "Cocina moderna con gabinetes de madera", "Irena Oze")],
    mapa: { x: 36, y: 94 }, publicado: 0, asesorId: "natalia",
  },
  {
    id: "retiro-finca", titulo: "Casa campestre en El Retiro", operacion: "venta", tipo: "Casa", zona: "El Retiro", barrio: "Vereda Don Diego",
    precio: 1_450_000_000, administracion: 350_000, area: 260, habitaciones: 4, banos: 3, parqueaderos: 3, estrato: 5, antiguedad: 6,
    descripcion: "En parcelación cerrada con bosque nativo, a 40 minutos de Medellín. Chimenea, jardín y lote de 2.000 metros cuadrados.",
    caracteristicas: ["Lote de 2.000 m²", "Chimenea", "Parcelación cerrada", "Bosque nativo"],
    fotos: [F("photo-1613498248726-8922766cebdb", "Casa de madera entre árboles", "Datingjungle"), F("photo-1599243272864-e9dd455966bd", "Interior con puerta de madera y mesa", "Julia")],
    mapa: { x: 95, y: 96 }, publicado: 25, asesorId: "natalia",
  },
  {
    id: "belen-estrenar", titulo: "Apartamento vacío listo para mudarse en Belén", operacion: "arriendo", tipo: "Apartamento", zona: "Belén", barrio: "Rosales",
    precio: 2_100_000, administracion: 210_000, area: 70, habitaciones: 3, banos: 2, parqueaderos: 1, estrato: 4, piso: 5, antiguedad: 2,
    descripcion: "Recién pintado, pisos en porcelanato y ventanas amplias. Disponible de inmediato.",
    caracteristicas: ["Disponible ya", "Porcelanato", "Ascensor", "Parqueadero cubierto"],
    fotos: [F("photo-1630699144867-37acec97df5a", "Sala vacía con ventana grande", "Point3D Commercial Imaging Ltd."), F("photo-1629042306548-afec37a5e46b", "Comedor con sillas rojas", "Zac Gudakov")],
    mapa: { x: 14, y: 42 }, publicado: 6, asesorId: "carlos",
  },
]

export const INMUEBLES: Inmueble[] = LISTA.map((x, i) => ({
  ...x,
  codigo: `NM-${String(1040 + i * 7).padStart(4, "0")}`,
  fotos: x.fotos.map(([id, alt, autor]) => ({ src: u(id), alt, autor })),
}))

export const inmueblePorId = (id: string) => INMUEBLES.find((x) => x.id === id)

export const FOTOS = {
  portada: { src: u("photo-1785970841472-ac4d3a690c13", 1800), alt: "Edificio escalonado de ladrillo rojo contra el cielo azul", autor: "Sergio Aguirre" },
}

export const EMPRESA = {
  nombre: "Nomenclatura",
  direccion: "Calle 10 # 43-12, oficina 504, El Poblado, Medellín (dirección de ejemplo)",
  whatsappVisible: "300 000 0000",
  correo: "hola@nomenclatura.example",
  matricula: "Matrícula de arrendador 000 (ejemplo)",
}

/** Tasa efectiva anual de referencia para el simulador de crédito. */
export const TASA_REFERENCIA = 0.125

// ─── Estado de la demo ────────────────────────────────────────────────────

export type EstadoInmueble = "disponible" | "reservado" | "cerrado"

export type Ajustes = { precio?: number; estado?: EstadoInmueble; destacado?: boolean }

export type EstadoLead = "nuevo" | "contactado" | "visita" | "oferta" | "cerrado" | "descartado"

export type Lead = {
  id: string
  nombre: string
  telefono: string
  inmuebleId: string
  mensaje?: string
  origen: "web" | "whatsapp" | "portal"
  estado: EstadoLead
  fecha: string
}

export type Visita = { id: string; inmuebleId: string; leadId: string; asesorId: string; inicio: string; estado: "agendada" | "realizada" | "cancelada" }

export type EstadoInmobiliaria = {
  referencia: string
  ajustes: Record<string, Ajustes>
  leads: Lead[]
  visitas: Visita[]
}
