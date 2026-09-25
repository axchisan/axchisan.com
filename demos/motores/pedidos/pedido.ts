/**
 * El pedido ya enviado. Guarda una copia de cada plato con su precio del
 * momento: si mañana sube el precio en la carta, el pedido de hoy no cambia.
 */

export type Canal = "mesa" | "recoger" | "domicilio"

export type EstadoPedido = "recibido" | "preparando" | "listo" | "en-camino" | "entregado" | "cancelado"

export type MetodoPago = "nequi" | "daviplata" | "efectivo" | "datafono"

export type LineaPedido = {
  productoId: string
  nombre: string
  /** Opciones elegidas, en texto: "Término medio, yuca frita". */
  detalle?: string
  nota?: string
  cantidad: number
  /** Precio unitario con opciones, al momento del pedido. */
  precio: number
}

export type Pedido = {
  id: string
  numero: number
  /** `AAAA-MM-DDTHH:mm`, hora local. */
  creado: string
  canal: Canal
  mesa?: number
  cliente: { nombre: string; telefono?: string }
  direccion?: { barrio: string; direccion: string; indicaciones?: string }
  /** Para recoger a una hora; sin ella, "lo antes posible". */
  hora?: string
  lineas: LineaPedido[]
  domicilio: number
  pago: MetodoPago
  /** Efectivo: con cuánto paga, para llevar el cambio. */
  pagaCon?: number
  estado: EstadoPedido
  historial: { estado: EstadoPedido; en: string }[]
  origen: "web" | "mesero"
}

export const CANAL: Record<Canal, string> = {
  mesa: "En la mesa",
  recoger: "Para recoger",
  domicilio: "Domicilio",
}

export const PAGO: Record<MetodoPago, string> = {
  nequi: "Nequi",
  daviplata: "Daviplata",
  efectivo: "Efectivo",
  datafono: "Tarjeta con datáfono",
}

export const ESTADO: Record<EstadoPedido, string> = {
  recibido: "Recibido",
  preparando: "En preparación",
  listo: "Listo",
  "en-camino": "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
}

/** Los pasos que recorre un pedido según cómo se entrega. */
export function pasos(canal: Canal): EstadoPedido[] {
  return canal === "domicilio"
    ? ["recibido", "preparando", "listo", "en-camino", "entregado"]
    : ["recibido", "preparando", "listo", "entregado"]
}

export function siguiente(p: Pick<Pedido, "canal" | "estado">): EstadoPedido | null {
  const ps = pasos(p.canal)
  const i = ps.indexOf(p.estado)
  return i >= 0 && i < ps.length - 1 ? ps[i + 1] : null
}

/** El verbo del botón que mueve el pedido al estado siguiente. */
export function accion(p: Pick<Pedido, "canal" | "estado">) {
  const s = siguiente(p)
  if (s === "preparando") return "Empezar"
  if (s === "listo") return "Marcar listo"
  if (s === "en-camino") return "Despachar"
  if (s === "entregado") return p.canal === "mesa" ? "Servido" : "Entregado"
  return null
}

export const subtotal = (p: Pick<Pedido, "lineas">) => p.lineas.reduce((t, l) => t + l.precio * l.cantidad, 0)
export const total = (p: Pick<Pedido, "lineas" | "domicilio">) => subtotal(p) + p.domicilio

export const activo = (p: Pick<Pedido, "estado">) => p.estado !== "entregado" && p.estado !== "cancelado"
