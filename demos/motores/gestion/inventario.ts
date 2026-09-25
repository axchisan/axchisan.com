/**
 * Motor de gestión: productos, existencias, ventas de mostrador y reportes.
 * Lo usa la ferretería Doble Rosca y sirve igual para una miscelánea, una
 * distribuidora o una tienda de repuestos.
 *
 * Las existencias no se guardan: se calculan. Salen de los movimientos
 * (inventario inicial, entradas de mercancía, ajustes) menos lo vendido. Así el
 * kardex de cada producto siempre cuadra con lo que dice el inventario.
 */

export type Unidad = "unidad" | "metro" | "kilo" | "galón" | "bulto" | "caja" | "par"

export type ProductoInventario = {
  id: string
  /** Código interno, el que se escribe en la caja. */
  sku: string
  nombre: string
  categoria: string
  unidad: Unidad
  /** Pesos, IVA incluido. */
  costo: number
  precio: number
  /** Existencias por debajo de las cuales hay que reponer. */
  minimo: number
  proveedorId: string
  ubicacion?: string
}

export type TipoMovimiento = "inicial" | "entrada" | "ajuste"

export type Movimiento = {
  id: string
  productoId: string
  /** `AAAA-MM-DDTHH:mm`, hora local. */
  fecha: string
  tipo: TipoMovimiento
  /** Positiva entra, negativa sale (un ajuste por daño o pérdida). */
  cantidad: number
  nota?: string
  /** Costo unitario de una entrada. */
  costo?: number
}

export type MetodoPago = "efectivo" | "nequi" | "daviplata" | "tarjeta" | "transferencia"

export const PAGO: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  nequi: "Nequi",
  daviplata: "Daviplata",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
}

export type LineaVenta = { productoId: string; nombre: string; cantidad: number; precio: number; costo: number }

export type Venta = {
  id: string
  numero: number
  fecha: string
  lineas: LineaVenta[]
  /** Descuento total en pesos. */
  descuento: number
  pago: MetodoPago
  /** En efectivo: lo que entregó el cliente. */
  recibido?: number
  cliente?: string
  origen: "mostrador" | "web"
}

export const subtotalVenta = (v: Pick<Venta, "lineas">) => v.lineas.reduce((t, l) => t + l.precio * l.cantidad, 0)
export const totalVenta = (v: Pick<Venta, "lineas" | "descuento">) => subtotalVenta(v) - v.descuento
export const costoVenta = (v: Pick<Venta, "lineas">) => v.lineas.reduce((t, l) => t + l.costo * l.cantidad, 0)

/** El IVA que va dentro de un precio que ya lo incluye (19 %). */
export const ivaIncluido = (valor: number) => Math.round(valor - valor / 1.19)

/** Existencias de todos los productos a partir de movimientos y ventas. */
export function existencias(movimientos: Movimiento[], ventas: Venta[]) {
  const stock = new Map<string, number>()
  for (const m of movimientos) stock.set(m.productoId, (stock.get(m.productoId) ?? 0) + m.cantidad)
  for (const v of ventas) for (const l of v.lineas) stock.set(l.productoId, (stock.get(l.productoId) ?? 0) - l.cantidad)
  return stock
}

export type EstadoStock = "agotado" | "bajo" | "ok"

export function estadoStock(cantidad: number, minimo: number): EstadoStock {
  if (cantidad <= 0) return "agotado"
  if (cantidad <= minimo) return "bajo"
  return "ok"
}

export type LineaKardex = { fecha: string; concepto: string; entra: number; sale: number; saldo: number }

/** Kardex de un producto: cada entrada y salida en orden, con el saldo después de cada una. */
export function kardex(productoId: string, movimientos: Movimiento[], ventas: Venta[]): LineaKardex[] {
  const filas: Omit<LineaKardex, "saldo">[] = []
  for (const m of movimientos) {
    if (m.productoId !== productoId) continue
    const concepto = m.tipo === "inicial" ? "Inventario inicial" : m.tipo === "entrada" ? `Entrada${m.nota ? `: ${m.nota}` : ""}` : `Ajuste${m.nota ? `: ${m.nota}` : ""}`
    filas.push({ fecha: m.fecha, concepto, entra: Math.max(0, m.cantidad), sale: Math.max(0, -m.cantidad) })
  }
  for (const v of ventas) {
    const cantidad = v.lineas.filter((l) => l.productoId === productoId).reduce((t, l) => t + l.cantidad, 0)
    if (cantidad) filas.push({ fecha: v.fecha, concepto: `Venta #${v.numero}${v.origen === "web" ? " (pedido web)" : ""}`, entra: 0, sale: cantidad })
  }
  filas.sort((a, b) => a.fecha.localeCompare(b.fecha))
  let saldo = 0
  return filas.map((f) => ({ ...f, saldo: (saldo += f.entra - f.sale) }))
}

/**
 * Cuánto pedir para reponer: lo que falta para llegar al doble del mínimo,
 * redondeado hacia arriba a la cantidad de empaque.
 */
export function sugerirPedido(stock: number, minimo: number, empaque = 1) {
  if (stock > minimo) return 0
  const falta = minimo * 2 - stock
  return Math.ceil(falta / empaque) * empaque
}
