/**
 * Modelo de Tanda, panadería y café (negocio ficticio) en Bucaramanga. Carrito
 * y pedidos vienen del motor de pedidos; las horneadas y los encargos de
 * tortas son de esta panadería.
 */
import type { Producto as ProductoCarrito } from "@/demos/motores/pedidos/carrito"
import type { Pedido } from "@/demos/motores/pedidos/pedido"

const u = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

export type Foto = { src: string; alt: string; autor: string }

export const CATEGORIAS = [
  { id: "pan", nombre: "Pan de la casa" },
  { id: "dulce", nombre: "Hojaldres y dulces" },
  { id: "cafe", nombre: "Café y bebidas" },
] as const

export type Producto = ProductoCarrito & {
  categoria: (typeof CATEGORIAS)[number]["id"]
  descripcion: string
  foto?: Foto
  /** Horas en que sale del horno (`HH:mm`). Sin tandas, se prepara al momento. */
  tandas: string[]
  /** Unidades de cada horneada. */
  porTanda: number
}

export const PRODUCTOS: Producto[] = [
  { id: "pandebono", categoria: "pan", nombre: "Pandebono", precio: 2_500, descripcion: "Con queso costeño y almidón agrio, como en el Valle. Se come caliente.", tandas: ["06:00", "10:00", "16:00"], porTanda: 60, foto: { src: u("photo-1559141680-d0bd7bc5af84"), alt: "Pandebonos en un plato junto a una taza de café", autor: "rodolfo allen_" } },
  { id: "frances", categoria: "pan", nombre: "Pan francés", precio: 3_200, descripcion: "Corteza que cruje y miga blanda. El del desayuno.", tandas: ["06:00", "16:00"], porTanda: 40, foto: { src: u("photo-1568471173242-461f0a730452"), alt: "Panes franceses dorados", autor: "Sergio Arze" } },
  { id: "masa-madre", categoria: "pan", nombre: "Pan de masa madre", precio: 16_000, descripcion: "Fermentado 24 horas, con harina integral de Boyacá. Dura cuatro días.", tandas: ["10:00"], porTanda: 14, foto: { src: u("photo-1616841888027-89693dec0827"), alt: "Pan de masa madre sobre un mantel", autor: "Monika Grabkowska" } },
  { id: "pan-leche", categoria: "pan", nombre: "Pan de leche", precio: 1_200, descripcion: "El de siempre, suave y un poco dulce. Bolsa de diez a 11.000.", tandas: ["06:00", "10:00", "16:00"], porTanda: 80, foto: { src: u("photo-1609889132680-4e2ea2befbef"), alt: "Panes de leche en una canasta", autor: "César Guel" } },
  { id: "croissant", categoria: "dulce", nombre: "Croissant de mantequilla", precio: 5_500, descripcion: "Mantequilla de verdad, 27 capas. Solo o relleno de jamón y queso.", tandas: ["07:00", "15:00"], porTanda: 24, foto: { src: u("photo-1691480162735-9b91238080f6"), alt: "Croissant dorado sobre fondo blanco", autor: "personalgraphic.com" }, opciones: [{ id: "relleno", nombre: "Relleno", tipo: "uno", opciones: [{ id: "solo", nombre: "Solo" }, { id: "jamon", nombre: "Jamón y queso", extra: 3_000 }] }] },
  { id: "pastel-guayaba", categoria: "dulce", nombre: "Pastel de guayaba", precio: 3_000, descripcion: "Hojaldre con bocadillo veleño y queso. El de la merienda santandereana.", tandas: ["07:00", "15:00"], porTanda: 36, foto: { src: u("photo-1608582037152-adefa9decb70"), alt: "Pasteles de hojaldre dorados", autor: "Geri Chapple" } },
  { id: "mantecada", categoria: "dulce", nombre: "Mantecada", precio: 3_500, descripcion: "Esponjosa, con mantequilla y un toque de naranja.", tandas: ["09:00"], porTanda: 30, foto: { src: u("photo-1499889808931-317a0255c0e9"), alt: "Bandeja de mantecadas recién horneadas", autor: "Taylor Grote" } },
  { id: "torta-naranja", categoria: "dulce", nombre: "Torta de naranja, porción", precio: 6_000, descripcion: "Con jugo de naranja de Lebrija y glaseado de la misma.", tandas: ["09:00"], porTanda: 16, foto: { src: u("photo-1590055619179-a07394301525"), alt: "Porción de torta de naranja", autor: "Rasmus Gundorff Sæderup" } },
  { id: "milhoja", categoria: "dulce", nombre: "Milhoja", precio: 7_500, descripcion: "Hojaldre, crema pastelera y arequipe. Se arma en la mañana.", tandas: ["11:00"], porTanda: 12, foto: { src: u("photo-1622941367239-8acd68fa946d"), alt: "Milhoja con capas de hojaldre y crema", autor: "Cody Chan" } },
  { id: "tinto", categoria: "cafe", nombre: "Tinto", precio: 2_000, descripcion: "Café de Santander, de finca en Los Santos, filtrado.", tandas: [], porTanda: 0, foto: { src: u("photo-1593443320739-77f74939d0da"), alt: "Taza de café sobre una mesa de madera", autor: "tabitha turner" } },
  { id: "capuchino", categoria: "cafe", nombre: "Capuchino", precio: 6_500, descripcion: "Espresso de la casa con leche texturizada.", tandas: [], porTanda: 0, foto: { src: u("photo-1559001724-fbad036dbc9e"), alt: "Capuchino con arte latte", autor: "Phil Desforges" }, opciones: [{ id: "leche", nombre: "Leche", tipo: "uno", opciones: [{ id: "entera", nombre: "Entera" }, { id: "deslactosada", nombre: "Deslactosada" }, { id: "almendras", nombre: "De almendras", extra: 2_000 }] }] },
  { id: "chocolate", categoria: "cafe", nombre: "Chocolate con queso", precio: 5_000, descripcion: "Chocolate de mesa santandereano, con queso campesino.", tandas: [], porTanda: 0 },
]

export const productoPorId = (id: string) => PRODUCTOS.find((p) => p.id === id)

// ─── Tortas por encargo ──────────────────────────────────────────────────

export const TAMANOS = [
  { id: "media", nombre: "Media libra", porciones: 10, precio: 58_000 },
  { id: "libra", nombre: "Una libra", porciones: 20, precio: 95_000 },
  { id: "dos", nombre: "Dos libras", porciones: 40, precio: 170_000 },
] as const

export const SABORES = ["Vainilla", "Chocolate", "Naranja", "Tres leches"] as const
export const RELLENOS = [
  { id: "arequipe", nombre: "Arequipe", extra: 0 },
  { id: "fresas", nombre: "Fresas con crema", extra: 12_000 },
  { id: "mora", nombre: "Mermelada de mora", extra: 0 },
] as const
export const CUBIERTAS = [
  { id: "chantilly", nombre: "Crema chantilly", extra: 0 },
  { id: "ganache", nombre: "Ganache de chocolate", extra: 15_000 },
  { id: "fondant", nombre: "Fondant con diseño", extra: 35_000 },
] as const

/** Días mínimos para pedir una torta: el bizcocho se hornea el día anterior. */
export const ANTELACION_DIAS = 2

export const FOTOS_TORTAS: Foto[] = [
  { src: u("photo-1555050338-0abc773f7978"), alt: "Torta redonda cubierta de chocolate", autor: "Karly Jones" },
  { src: u("photo-1559553156-2e97137af16f"), alt: "Torta con fresas y frutos rojos", autor: "Tuva Mathilde Løland" },
  { src: u("photo-1772064871914-00305a3053d2"), alt: "Torta de chocolate con rodajas de naranja", autor: "Joe Dumas" },
]

export const FOTOS = {
  portada: { src: u("photo-1560427183-4efd29c38997", 1600), alt: "Panadero sacando las bandejas del horno", autor: "DDP" },
}

export const PANADERIA = {
  nombre: "Tanda",
  direccion: "Carrera 33 con calle 48, Cabecera del Llano, Bucaramanga (dirección de ejemplo)",
  whatsappVisible: "300 000 0000",
  instagram: "@tanda.bga (ejemplo)",
  abre: 6,
  cierra: 20,
}

export const ZONAS_DOMICILIO = [
  { id: "cabecera", barrio: "Cabecera y Sotomayor", costo: 3_000 },
  { id: "provenza", barrio: "Provenza y Ciudadela Real de Minas", costo: 5_000 },
  { id: "floridablanca", barrio: "Cañaveral y Floridablanca", costo: 6_000 },
]

// ─── Estado de la demo ────────────────────────────────────────────────────

export type Encargo = {
  id: string
  numero: number
  creado: string
  /** Día y hora de entrega (`AAAA-MM-DDTHH:mm`). */
  entrega: string
  tamano: (typeof TAMANOS)[number]["id"]
  sabor: (typeof SABORES)[number]
  relleno: (typeof RELLENOS)[number]["id"]
  cubierta: (typeof CUBIERTAS)[number]["id"]
  mensaje?: string
  cliente: { nombre: string; telefono: string }
  total: number
  anticipo: number
  estado: "por-anticipo" | "confirmado" | "listo" | "entregado"
}

export type EstadoPanaderia = {
  referencia: string
  pedidos: Pedido[]
  encargos: Encargo[]
  siguientePedido: number
  siguienteEncargo: number
  /** Tandas que la cocina ya marcó como horneadas hoy: `productoId@HH:mm`. */
  horneadas: string[]
}

export function precioEncargo(e: Pick<Encargo, "tamano" | "relleno" | "cubierta">) {
  return (
    TAMANOS.find((t) => t.id === e.tamano)!.precio +
    RELLENOS.find((r) => r.id === e.relleno)!.extra +
    CUBIERTAS.find((c) => c.id === e.cubierta)!.extra
  )
}
