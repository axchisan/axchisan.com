/**
 * Modelo de la ferretería Doble Rosca (negocio ficticio). Existencias, ventas y
 * reportes vienen del motor de gestión; aquí vive lo que es de esta ferretería.
 */
import type { Movimiento, ProductoInventario, Unidad, Venta } from "@/demos/motores/gestion/inventario"

export const CATEGORIAS = ["Tornillería", "Herramientas", "Eléctricos", "Plomería", "Pinturas", "Construcción"] as const
export type Categoria = (typeof CATEGORIAS)[number]

export type Proveedor = {
  id: string
  nombre: string
  contacto: string
  whatsapp: string
  /** Día en que pasa el vendedor o se hace el pedido. */
  visita: string
}

export const PROVEEDORES: Proveedor[] = [
  { id: "tornillos-norte", nombre: "Tornillos del Norte", contacto: "Fabián", whatsapp: "310 000 0001", visita: "martes" },
  { id: "herramientas-andinas", nombre: "Herramientas Andinas", contacto: "Liliana", whatsapp: "310 000 0002", visita: "jueves" },
  { id: "electricos-sabana", nombre: "Eléctricos Sabana", contacto: "Óscar", whatsapp: "310 000 0003", visita: "miércoles" },
  { id: "tubos-chia", nombre: "Tubos y Accesorios Chía", contacto: "Martha", whatsapp: "310 000 0004", visita: "lunes" },
  { id: "pinturas-sabana", nombre: "Pinturas La Sabana", contacto: "Jhon", whatsapp: "310 000 0005", visita: "viernes" },
  { id: "materiales-cerro", nombre: "Materiales El Cerro", contacto: "Don Álvaro", whatsapp: "310 000 0006", visita: "todos los días" },
]

export type Producto = ProductoInventario & {
  categoria: Categoria
  /** Cantidad por empaque del proveedor, para redondear lo que se pide. */
  empaque: number
  /** Ventas por día en un día normal, para los datos de ejemplo. */
  rotacion: number
  /** Existencias con que amanece hoy la demo. */
  hoy: number
}

type Fila = [id: string, nombre: string, categoria: Categoria, unidad: Unidad, costo: number, precio: number, minimo: number, empaque: number, rotacion: number, hoy: number, proveedor: string, ubicacion: string]

const FILAS: Fila[] = [
  ["drywall-6x1", "Tornillo drywall 6 x 1\", caja x 100", "Tornillería", "caja", 6_200, 9_500, 8, 10, 1.2, 22, "tornillos-norte", "Pasillo 1"],
  ["chazo-1-4", "Chazo plástico 1/4\", caja x 100", "Tornillería", "caja", 3_300, 5_500, 6, 10, 0.8, 4, "tornillos-norte", "Pasillo 1"],
  ["puntilla-2", "Puntilla 2\" con cabeza", "Tornillería", "kilo", 6_100, 8_900, 10, 25, 1.5, 38, "tornillos-norte", "Pasillo 1"],
  ["hex-3-8", "Tornillo hexagonal 3/8 x 2\"", "Tornillería", "unidad", 650, 1_200, 60, 100, 9, 240, "tornillos-norte", "Pasillo 1"],
  ["tuerca-3-8", "Tuerca 3/8\"", "Tornillería", "unidad", 180, 350, 80, 100, 10, 310, "tornillos-norte", "Pasillo 1"],
  ["arandela-3-8", "Arandela 3/8\"", "Tornillería", "unidad", 90, 200, 80, 100, 8, 55, "tornillos-norte", "Pasillo 1"],
  ["chazo-exp-3-8", "Chazo expansivo 3/8\"", "Tornillería", "unidad", 1_600, 2_800, 20, 50, 2, 64, "tornillos-norte", "Pasillo 1"],
  ["martillo-16", "Martillo de uña 16 oz", "Herramientas", "unidad", 21_000, 32_000, 3, 6, 0.3, 7, "herramientas-andinas", "Mostrador"],
  ["destornillador-pala", "Destornillador de pala 1/4\"", "Herramientas", "unidad", 5_900, 9_800, 4, 12, 0.4, 11, "herramientas-andinas", "Mostrador"],
  ["destornillador-estrella", "Destornillador de estrella #2", "Herramientas", "unidad", 5_900, 9_800, 4, 12, 0.5, 3, "herramientas-andinas", "Mostrador"],
  ["alicate-8", "Alicate universal 8\"", "Herramientas", "unidad", 18_000, 28_500, 3, 6, 0.3, 9, "herramientas-andinas", "Mostrador"],
  ["llave-expansion", "Llave de expansión 10\"", "Herramientas", "unidad", 23_500, 36_000, 2, 6, 0.2, 5, "herramientas-andinas", "Mostrador"],
  ["flexometro-5", "Flexómetro 5 m", "Herramientas", "unidad", 11_200, 18_900, 4, 12, 0.6, 14, "herramientas-andinas", "Mostrador"],
  ["nivel-24", "Nivel de burbuja 24\"", "Herramientas", "unidad", 25_000, 39_000, 2, 4, 0.15, 4, "herramientas-andinas", "Pared"],
  ["segueta", "Segueta con marco", "Herramientas", "unidad", 16_500, 26_000, 2, 6, 0.2, 6, "herramientas-andinas", "Pared"],
  ["taladro", "Taladro percutor 1/2\" 650 W", "Herramientas", "unidad", 176_000, 239_000, 1, 2, 0.07, 2, "herramientas-andinas", "Vitrina"],
  ["brocas-concreto", "Juego de brocas para concreto x 5", "Herramientas", "unidad", 14_500, 24_000, 3, 6, 0.3, 8, "herramientas-andinas", "Vitrina"],
  ["pistola-silicona", "Pistola de silicona", "Herramientas", "unidad", 9_800, 16_500, 2, 6, 0.2, 0, "herramientas-andinas", "Pared"],
  ["guantes-carnaza", "Guantes de carnaza", "Herramientas", "par", 5_200, 9_500, 6, 12, 0.8, 18, "herramientas-andinas", "Pared"],
  ["cable-12", "Cable THHN #12", "Eléctricos", "metro", 2_250, 3_400, 50, 100, 12, 180, "electricos-sabana", "Pasillo 2"],
  ["cable-duplex-14", "Cable dúplex #14", "Eléctricos", "metro", 1_850, 2_900, 40, 100, 9, 36, "electricos-sabana", "Pasillo 2"],
  ["toma-doble", "Toma doble con polo a tierra", "Eléctricos", "unidad", 4_900, 8_500, 8, 20, 1.2, 26, "electricos-sabana", "Pasillo 2"],
  ["interruptor", "Interruptor sencillo", "Eléctricos", "unidad", 4_100, 7_200, 8, 20, 1, 21, "electricos-sabana", "Pasillo 2"],
  ["led-9", "Bombillo LED 9 W", "Eléctricos", "unidad", 3_600, 6_500, 15, 24, 2.5, 48, "electricos-sabana", "Pasillo 2"],
  ["led-12", "Bombillo LED 12 W", "Eléctricos", "unidad", 5_100, 8_900, 12, 24, 1.8, 10, "electricos-sabana", "Pasillo 2"],
  ["cinta-aislante", "Cinta aislante", "Eléctricos", "unidad", 3_500, 5_800, 10, 20, 1.5, 33, "electricos-sabana", "Mostrador"],
  ["extension-5", "Extensión 5 m, 3 tomas", "Eléctricos", "unidad", 18_500, 29_000, 3, 6, 0.3, 7, "electricos-sabana", "Pasillo 2"],
  ["breaker-20", "Breaker 1 x 20 A", "Eléctricos", "unidad", 13_800, 21_000, 4, 10, 0.4, 12, "electricos-sabana", "Vitrina"],
  ["tubo-pvc-1-2", "Tubo PVC presión 1/2\" x 6 m", "Plomería", "unidad", 11_900, 17_500, 10, 10, 1, 24, "tubos-chia", "Patio"],
  ["codo-1-2", "Codo PVC 1/2\"", "Plomería", "unidad", 450, 900, 30, 50, 4, 95, "tubos-chia", "Pasillo 3"],
  ["tee-1-2", "Tee PVC 1/2\"", "Plomería", "unidad", 560, 1_100, 25, 50, 3, 22, "tubos-chia", "Pasillo 3"],
  ["llave-paso", "Llave de paso 1/2\"", "Plomería", "unidad", 11_600, 18_500, 4, 10, 0.4, 11, "tubos-chia", "Pasillo 3"],
  ["soldadura-pvc", "Soldadura líquida PVC 1/32 gal", "Plomería", "unidad", 5_800, 9_500, 6, 12, 0.7, 19, "tubos-chia", "Pasillo 3"],
  ["teflon", "Cinta de teflón", "Plomería", "unidad", 900, 1_800, 20, 50, 3, 70, "tubos-chia", "Mostrador"],
  ["sifon", "Sifón plástico para lavamanos", "Plomería", "unidad", 7_400, 12_500, 4, 10, 0.4, 9, "tubos-chia", "Pasillo 3"],
  ["griferia-lavaplatos", "Grifería lavaplatos cuello de ganso", "Plomería", "unidad", 58_000, 89_000, 2, 4, 0.1, 3, "tubos-chia", "Vitrina"],
  ["vinilo-t1", "Vinilo tipo 1 blanco", "Pinturas", "galón", 51_000, 72_000, 6, 4, 0.6, 14, "pinturas-sabana", "Bodega"],
  ["vinilo-t2", "Vinilo tipo 2 blanco", "Pinturas", "galón", 28_500, 42_000, 6, 4, 0.8, 5, "pinturas-sabana", "Bodega"],
  ["esmalte-negro", "Esmalte sintético negro 1/4 gal", "Pinturas", "unidad", 19_800, 29_500, 4, 6, 0.3, 8, "pinturas-sabana", "Pasillo 4"],
  ["brocha-3", "Brocha 3\"", "Pinturas", "unidad", 4_800, 8_500, 6, 12, 0.8, 20, "pinturas-sabana", "Pasillo 4"],
  ["rodillo-9", "Rodillo de felpa 9\"", "Pinturas", "unidad", 10_500, 17_000, 4, 6, 0.5, 12, "pinturas-sabana", "Pasillo 4"],
  ["lija-150", "Lija de agua #150", "Pinturas", "unidad", 800, 1_500, 30, 50, 4, 110, "pinturas-sabana", "Mostrador"],
  ["thinner", "Thinner, botella 750 ml", "Pinturas", "unidad", 7_800, 12_000, 6, 12, 0.6, 15, "pinturas-sabana", "Pasillo 4"],
  ["masilla-drywall", "Masilla para drywall", "Pinturas", "galón", 17_000, 26_000, 4, 4, 0.4, 2, "pinturas-sabana", "Bodega"],
  ["cemento-50", "Cemento gris 50 kg", "Construcción", "bulto", 28_500, 33_500, 15, 20, 3, 42, "materiales-cerro", "Patio"],
  ["arena-pega", "Arena de pega, bulto 40 kg", "Construcción", "bulto", 5_600, 9_000, 10, 20, 2, 26, "materiales-cerro", "Patio"],
  ["pegacor", "Pegante cerámico gris 25 kg", "Construcción", "bulto", 20_500, 28_000, 6, 10, 0.7, 5, "materiales-cerro", "Patio"],
  ["varilla-3-8", "Varilla corrugada 3/8\" x 6 m", "Construcción", "unidad", 16_800, 21_500, 20, 50, 2.5, 66, "materiales-cerro", "Patio"],
  ["alambre-negro", "Alambre negro", "Construcción", "kilo", 6_900, 9_800, 8, 25, 1, 17, "materiales-cerro", "Patio"],
]

export const PRODUCTOS: Producto[] = FILAS.map(([id, nombre, categoria, unidad, costo, precio, minimo, empaque, rotacion, hoy, proveedorId, ubicacion], i) => ({
  id,
  sku: `${categoria.slice(0, 3).toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")}-${String(i + 1).padStart(3, "0")}`,
  nombre,
  categoria,
  unidad,
  costo,
  precio,
  minimo,
  empaque,
  rotacion,
  hoy,
  proveedorId,
  ubicacion,
}))

export const productoPorId = (id: string) => PRODUCTOS.find((p) => p.id === id)
export const proveedorPorId = (id: string) => PROVEEDORES.find((p) => p.id === id)

export const FERRETERIA = {
  nombre: "Doble Rosca",
  nombreCompleto: "Ferretería Doble Rosca",
  zona: "Kennedy Central, Bogotá",
  direccion: "Kennedy Central, Bogotá (dirección de ejemplo)",
  telefono: "(601) 000 0000",
  whatsappVisible: "300 000 0000",
  /** NIT de ejemplo, para el recibo. */
  nit: "900.000.000-0",
}

export const HORARIO_TEXTO = [
  { dias: "Lunes a sábado", horas: "7:00 a. m. a 7:00 p. m." },
  { dias: "Domingos y festivos", horas: "8:00 a. m. a 1:00 p. m." },
]

export const FOTOS = {
  estanteria: { src: "https://images.unsplash.com/photo-1765744893064-dce3184289ef?auto=format&fit=crop&w=1400&q=70", alt: "Estantería de ferretería llena de cajas, con una escalera", autor: "Artem Korolev" },
  herramientas: { src: "https://images.unsplash.com/photo-1759200165738-6366977a73c6?auto=format&fit=crop&w=1000&q=70", alt: "Pared con alicates y herramientas colgadas", autor: "Darien Attridge" },
}

// ─── Estado de la demo ────────────────────────────────────────────────────

/** Lista que un cliente arma en la página y manda por WhatsApp. */
export type PedidoWeb = {
  id: string
  numero: number
  fecha: string
  cliente: { nombre: string; telefono: string }
  lineas: { productoId: string; cantidad: number }[]
  entrega: "recoger" | "domicilio"
  direccion?: string
  estado: "nuevo" | "listo" | "vendido" | "cancelado"
  ventaId?: string
}

export type EstadoFerreteria = {
  referencia: string
  /** Precios cambiados desde el panel. */
  precios: Record<string, number>
  movimientos: Movimiento[]
  ventas: Venta[]
  pedidosWeb: PedidoWeb[]
  siguienteVenta: number
  siguientePedido: number
  /** Avisos automáticos que "envió" el sistema completo. */
  avisos: { fecha: string; texto: string }[]
}
