import {
  BedDouble,
  Boxes,
  Building2,
  Dumbbell,
  PawPrint,
  Scale,
  Scissors,
  Shirt,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

/**
 * Sectores para los que Axchi construye. Un sector con `solucion` tiene ficha y
 * muestra funcionando; los demás llevan a cotizar con el sector ya elegido.
 * Cada sector tiene un único icono, y se usa igual en todo el sitio.
 */
export type Sector = {
  id: string
  nombre: string
  icono: LucideIcon
  /** Qué se le construye a este negocio, en una línea. */
  ejemplo: string
  solucion?: string
}

export const SECTORES: Sector[] = [
  {
    id: "veterinarias",
    nombre: "Veterinarias",
    icono: PawPrint,
    ejemplo: "Citas en línea, historia clínica y recordatorios de vacunas",
    solucion: "veterinarias",
  },
  {
    id: "cosmeticos",
    nombre: "Cosméticos y cuidado personal",
    icono: Sparkles,
    ejemplo: "Catálogo con carrito y pedidos por WhatsApp",
    solucion: "tiendas-de-cosmeticos",
  },
  {
    id: "restaurantes",
    nombre: "Restaurantes y cafeterías",
    icono: UtensilsCrossed,
    ejemplo: "Carta digital con QR, pedidos y reservas",
    solucion: "restaurantes",
  },
  {
    id: "ropa",
    nombre: "Tiendas de ropa",
    icono: Shirt,
    ejemplo: "Colecciones con tallas y colores, carrito y pagos",
    solucion: "tiendas-de-ropa",
  },
  {
    id: "salones",
    nombre: "Salones de belleza y barberías",
    icono: Scissors,
    ejemplo: "Reservas por estilista, caja y comisiones",
    solucion: "salones-y-barberias",
  },
  {
    id: "hoteles",
    nombre: "Hoteles y turismo",
    icono: BedDouble,
    ejemplo: "Página que recorre el lugar como un video y reservas por WhatsApp",
    solucion: "hoteles-y-turismo",
  },
  {
    id: "consultorios",
    nombre: "Consultorios",
    icono: Stethoscope,
    ejemplo: "Citas en línea, odontograma y presupuestos con abonos",
    solucion: "consultorios-odontologicos",
  },
  {
    id: "inventario",
    nombre: "Comercio y distribución",
    icono: Boxes,
    ejemplo: "Inventario, ventas y reportes",
    solucion: "inventario-y-ventas",
  },
  {
    id: "gimnasios",
    nombre: "Gimnasios",
    icono: Dumbbell,
    ejemplo: "Clases con cupo, reservas y control de membresías",
    solucion: "gimnasios-y-estudios",
  },
  {
    id: "inmobiliarias",
    nombre: "Inmobiliarias",
    icono: Building2,
    ejemplo: "Inmuebles con filtros, mapa y solicitud de visita",
  },
  {
    id: "profesionales",
    nombre: "Abogados y contadores",
    icono: Scale,
    ejemplo: "Página de servicios que genera confianza y contactos",
  },
]

export const ICONO_SECTOR: Record<string, LucideIcon> = Object.fromEntries(
  SECTORES.map((s) => [s.id, s.icono]),
)
