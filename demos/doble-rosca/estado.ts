"use client"

import { useMemo } from "react"
import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { claveInstante } from "@/demos/motores/agenda/tiempo"
import { existencias, estadoStock, sugerirPedido, type MetodoPago, type Venta } from "@/demos/motores/gestion/inventario"
import { PRODUCTOS, productoPorId, PROVEEDORES, type EstadoFerreteria, type PedidoWeb, type Producto } from "./modelo"
import { generarFerreteria, ponerAlDia } from "./semilla"

export const almacenFerreteria = crearAlmacen<EstadoFerreteria>(
  "axchi-demo:doble-rosca:ferreteria:v1",
  () => generarFerreteria(),
  (guardado) => ponerAlDia(guardado),
)

export type Lista = { lineas: { productoId: string; cantidad: number }[] }
export const almacenLista = crearAlmacen<Lista>("axchi-demo:doble-rosca:lista:v1", () => ({ lineas: [] }))

export const useFerreteria = () => useAlmacen(almacenFerreteria)
export const useLista = () => useAlmacen(almacenLista)

export const precioDe = (e: EstadoFerreteria | null, p: Producto) => e?.precios[p.id] ?? p.precio

/** Existencias de cada producto, recalculadas solo cuando cambian los datos. */
export function useExistencias(e: EstadoFerreteria | null) {
  return useMemo(() => (e ? existencias(e.movimientos, e.ventas) : null), [e])
}

/** Productos por debajo del mínimo, con lo que se sugiere pedir, agrupados por proveedor. */
export function porReponer(stock: Map<string, number>) {
  return PROVEEDORES.map((prov) => ({
    proveedor: prov,
    lineas: PRODUCTOS.filter((p) => p.proveedorId === prov.id)
      .map((p) => {
        const hay = stock.get(p.id) ?? 0
        return { producto: p, hay, pedir: sugerirPedido(hay, p.minimo, p.empaque) }
      })
      .filter((x) => x.pedir > 0),
  })).filter((g) => g.lineas.length > 0)
}

export const bajoMinimo = (stock: Map<string, number>) => PRODUCTOS.filter((p) => estadoStock(stock.get(p.id) ?? 0, p.minimo) !== "ok")

const nuevoId = (prefijo: string) => `${prefijo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

// ─── Lista pública ────────────────────────────────────────────────────────

export function ponerEnLista(productoId: string, cantidad: number) {
  almacenLista.escribir((l) => {
    const ya = l.lineas.find((x) => x.productoId === productoId)
    const lineas = ya
      ? l.lineas.map((x) => (x.productoId === productoId ? { ...x, cantidad: x.cantidad + cantidad } : x))
      : [...l.lineas, { productoId, cantidad }]
    return { lineas: lineas.filter((x) => x.cantidad > 0) }
  })
}

export function fijarCantidadLista(productoId: string, cantidad: number) {
  almacenLista.escribir((l) => ({
    lineas: l.lineas.map((x) => (x.productoId === productoId ? { ...x, cantidad } : x)).filter((x) => x.cantidad > 0),
  }))
}

export function enviarPedidoWeb(d: { nombre: string; telefono: string; entrega: PedidoWeb["entrega"]; direccion?: string }): PedidoWeb {
  const e = almacenFerreteria.leer()
  const pedido: PedidoWeb = {
    id: nuevoId("w"),
    numero: e.siguientePedido,
    fecha: claveInstante(new Date()),
    cliente: { nombre: d.nombre.trim(), telefono: d.telefono.trim() },
    lineas: almacenLista.leer().lineas,
    entrega: d.entrega,
    direccion: d.entrega === "domicilio" ? d.direccion?.trim() : undefined,
    estado: "nuevo",
  }
  almacenFerreteria.escribir((x) => ({ ...x, pedidosWeb: [...x.pedidosWeb, pedido], siguientePedido: x.siguientePedido + 1 }))
  almacenLista.escribir({ lineas: [] })
  return pedido
}

export function marcarPedidoWeb(id: string, estado: PedidoWeb["estado"]) {
  almacenFerreteria.escribir((e) => ({ ...e, pedidosWeb: e.pedidosWeb.map((p) => (p.id === id ? { ...p, estado } : p)) }))
}

// ─── Caja, inventario y precios ───────────────────────────────────────────

export type LineaCaja = { productoId: string; cantidad: number }

export function registrarVenta(d: {
  lineas: LineaCaja[]
  descuento: number
  pago: MetodoPago
  recibido?: number
  cliente?: string
  pedidoWebId?: string
}): Venta {
  const e = almacenFerreteria.leer()
  const venta: Venta = {
    id: nuevoId("v"),
    numero: e.siguienteVenta,
    fecha: claveInstante(new Date()),
    lineas: d.lineas.map((l) => {
      const p = productoPorId(l.productoId)!
      return { productoId: p.id, nombre: p.nombre, cantidad: l.cantidad, precio: precioDe(e, p), costo: p.costo }
    }),
    descuento: d.descuento,
    pago: d.pago,
    recibido: d.pago === "efectivo" ? d.recibido : undefined,
    cliente: d.cliente?.trim() || undefined,
    origen: d.pedidoWebId ? "web" : "mostrador",
  }
  almacenFerreteria.escribir((x) => ({
    ...x,
    ventas: [...x.ventas, venta],
    siguienteVenta: x.siguienteVenta + 1,
    pedidosWeb: d.pedidoWebId ? x.pedidosWeb.map((p) => (p.id === d.pedidoWebId ? { ...p, estado: "vendido", ventaId: venta.id } : p)) : x.pedidosWeb,
  }))
  return venta
}

export function registrarEntrada(lineas: { productoId: string; cantidad: number; costo: number }[], factura: string) {
  const fecha = claveInstante(new Date())
  almacenFerreteria.escribir((e) => ({
    ...e,
    movimientos: [
      ...e.movimientos,
      ...lineas
        .filter((l) => l.cantidad > 0)
        .map((l) => ({ id: nuevoId("m"), productoId: l.productoId, fecha, tipo: "entrada" as const, cantidad: l.cantidad, costo: l.costo, nota: factura.trim() ? `factura ${factura.trim()}` : undefined })),
    ],
  }))
}

/** Ajuste por conteo físico: se registra la diferencia contra lo que dice el sistema. */
export function ajustarConteo(productoId: string, contado: number, actual: number, nota: string) {
  if (contado === actual) return
  almacenFerreteria.escribir((e) => ({
    ...e,
    movimientos: [...e.movimientos, { id: nuevoId("m"), productoId, fecha: claveInstante(new Date()), tipo: "ajuste", cantidad: contado - actual, nota: nota.trim() || "conteo físico" }],
  }))
}

export function cambiarPrecio(productoId: string, precio: number) {
  almacenFerreteria.escribir((e) => ({ ...e, precios: { ...e.precios, [productoId]: precio } }))
}

export function registrarAviso(texto: string) {
  almacenFerreteria.escribir((e) => ({ ...e, avisos: [{ fecha: claveInstante(new Date()), texto }, ...e.avisos] }))
}

export function restablecerFerreteria() {
  almacenFerreteria.restablecer()
  almacenLista.restablecer()
}
