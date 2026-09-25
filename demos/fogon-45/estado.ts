"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { claveInstante } from "@/demos/motores/agenda/tiempo"
import {
  agregarLinea,
  cambiarCantidad,
  precioUnitario,
  textoSeleccion,
  type LineaCarrito,
  type Seleccion,
} from "@/demos/motores/pedidos/carrito"
import { activo, siguiente, total, type Canal, type EstadoPedido, type MetodoPago, type Pedido } from "@/demos/motores/pedidos/pedido"
import { CUPO_RESERVAS, platoPorId, PLATOS, ZONAS, type EstadoRestaurante, type Plato, type Reserva } from "./modelo"
import { generarRestaurante, ponerAlDia } from "./semilla"

export const almacenRestaurante = crearAlmacen<EstadoRestaurante>(
  "axchi-demo:fogon-45:restaurante:v1",
  () => generarRestaurante(),
  (guardado) => ponerAlDia(guardado),
)

export type Carrito = { lineas: LineaCarrito[]; /** Mesa desde la que se escaneó el QR. */ mesa?: number }

export const almacenCarrito = crearAlmacen<Carrito>("axchi-demo:fogon-45:carrito:v1", () => ({ lineas: [] }))

export const useRestaurante = () => useAlmacen(almacenRestaurante)
export const useCarrito = () => useAlmacen(almacenCarrito)

// ─── Carta ────────────────────────────────────────────────────────────────

/** Precio vigente: el que se puso en el panel o, si no, el de la carta. */
export const precioDe = (e: EstadoRestaurante | null, plato: Plato) => e?.carta.precios[plato.id] ?? plato.precio

export const estaAgotado = (e: EstadoRestaurante | null, id: string) => e?.carta.agotados.includes(id) ?? false

export function precioLinea(e: EstadoRestaurante | null, l: LineaCarrito) {
  const plato = platoPorId(l.productoId)
  return plato ? precioUnitario(plato, l.seleccion, precioDe(e, plato)) : 0
}

export const subtotalCarrito = (e: EstadoRestaurante | null, lineas: LineaCarrito[]) =>
  lineas.reduce((t, l) => t + precioLinea(e, l) * l.cantidad, 0)

export function agregarAlCarrito(productoId: string, seleccion: Seleccion, cantidad: number, nota?: string) {
  almacenCarrito.escribir((c) => ({ ...c, lineas: agregarLinea(c.lineas, { productoId, seleccion, cantidad, nota }) }))
}

export function cambiarCantidadCarrito(clave: string, cantidad: number) {
  almacenCarrito.escribir((c) => ({ ...c, lineas: cambiarCantidad(c.lineas, clave, cantidad) }))
}

export function fijarMesa(mesa: number | undefined) {
  almacenCarrito.escribir((c) => ({ ...c, mesa }))
}

export function cambiarPrecio(id: string, precio: number) {
  almacenRestaurante.escribir((e) => ({ ...e, carta: { ...e.carta, precios: { ...e.carta.precios, [id]: precio } } }))
}

export function alternarAgotado(id: string) {
  almacenRestaurante.escribir((e) => {
    const ya = e.carta.agotados.includes(id)
    return { ...e, carta: { ...e.carta, agotados: ya ? e.carta.agotados.filter((x) => x !== id) : [...e.carta.agotados, id] } }
  })
}

// ─── Pedidos ──────────────────────────────────────────────────────────────

/**
 * Minutos estimados: lo que tarda el plato más lento, más un minuto por cada
 * pedido que la cocina ya tiene en fila. A domicilio se suma el recorrido.
 */
export function tiempoEstimado(e: EstadoRestaurante | null, lineas: { productoId: string }[], canal: Canal, zonaId?: string) {
  const coccion = Math.max(5, ...lineas.map((l) => platoPorId(l.productoId)?.coccion ?? 0))
  const fila = (e?.pedidos ?? []).filter((p) => p.estado === "recibido" || p.estado === "preparando").length
  const cocina = coccion + fila
  if (canal !== "domicilio") return [cocina, cocina + 10] as const
  const zona = ZONAS.find((z) => z.id === zonaId) ?? ZONAS[0]
  return [cocina + zona.minutos[0] - 15, cocina + zona.minutos[1] - 15] as const
}

export type DatosPedido = {
  canal: Canal
  mesa?: number
  cliente: { nombre: string; telefono?: string }
  zonaId?: string
  direccion?: string
  indicaciones?: string
  hora?: string
  pago: MetodoPago
  pagaCon?: number
}

export function enviarPedido(d: DatosPedido): Pedido {
  const e = almacenRestaurante.leer()
  const { lineas } = almacenCarrito.leer()
  const zona = ZONAS.find((z) => z.id === d.zonaId)
  const ahora = claveInstante(new Date())
  const pedido: Pedido = {
    id: `p${e.siguienteNumero}`,
    numero: e.siguienteNumero,
    creado: ahora,
    canal: d.canal,
    mesa: d.canal === "mesa" ? d.mesa : undefined,
    cliente: d.canal === "mesa" ? { nombre: d.cliente.nombre.trim() || `Mesa ${d.mesa}` } : { nombre: d.cliente.nombre.trim(), telefono: d.cliente.telefono?.trim() },
    direccion: d.canal === "domicilio" && zona ? { barrio: zona.barrio, direccion: d.direccion?.trim() ?? "", indicaciones: d.indicaciones?.trim() || undefined } : undefined,
    hora: d.canal === "recoger" ? d.hora : undefined,
    lineas: lineas.map((l) => {
      const plato = platoPorId(l.productoId)!
      return {
        productoId: l.productoId,
        nombre: plato.nombre,
        detalle: textoSeleccion(plato, l.seleccion) || undefined,
        nota: l.nota,
        cantidad: l.cantidad,
        precio: precioUnitario(plato, l.seleccion, precioDe(e, plato)),
      }
    }),
    domicilio: d.canal === "domicilio" ? (zona?.costo ?? 0) : 0,
    pago: d.pago,
    pagaCon: d.pago === "efectivo" ? d.pagaCon : undefined,
    estado: "recibido",
    historial: [{ estado: "recibido", en: ahora }],
    origen: "web",
  }
  almacenRestaurante.escribir((x) => ({ ...x, pedidos: [...x.pedidos, pedido], siguienteNumero: x.siguienteNumero + 1 }))
  almacenCarrito.escribir((c) => ({ lineas: [], mesa: c.mesa }))
  return pedido
}

function moverPedido(id: string, cambio: (p: Pedido) => EstadoPedido | null) {
  const en = claveInstante(new Date())
  almacenRestaurante.escribir((e) => ({
    ...e,
    pedidos: e.pedidos.map((p) => {
      const estado = p.id === id ? cambio(p) : null
      return estado ? { ...p, estado, historial: [...p.historial, { estado, en }] } : p
    }),
  }))
}

export const avanzarPedido = (id: string) => moverPedido(id, (p) => siguiente(p))
export const cancelarPedido = (id: string) => moverPedido(id, (p) => (activo(p) ? "cancelado" : null))

export const pedidoPorId = (e: EstadoRestaurante | null, id: string) => e?.pedidos.find((p) => p.id === id) ?? null

/** Minutos desde que entró el pedido. */
export function minutosDesde(clave: string, ahora = new Date()) {
  const [dia, hora] = clave.split("T")
  const [a, m, d] = dia.split("-").map(Number)
  const [h, min] = hora.split(":").map(Number)
  return Math.max(0, Math.floor((ahora.getTime() - new Date(a, m - 1, d, h, min).getTime()) / 60_000))
}

// ─── Reservas ─────────────────────────────────────────────────────────────

export function cuposLibres(e: EstadoRestaurante | null, inicio: string) {
  const tomadas = (e?.reservas ?? []).filter((r) => r.inicio === inicio && r.estado !== "cancelada").length
  return Math.max(0, CUPO_RESERVAS - tomadas)
}

export function reservarMesa(r: Omit<Reserva, "id" | "estado" | "origen">): Reserva {
  const reserva: Reserva = { ...r, id: `r${Date.now().toString(36)}`, estado: "confirmada", origen: "web", nota: r.nota?.trim() || undefined }
  almacenRestaurante.escribir((e) => ({
    ...e,
    reservas: [...e.reservas, reserva].sort((a, b) => a.inicio.localeCompare(b.inicio)),
  }))
  return reserva
}

export function cambiarEstadoReserva(id: string, estado: Reserva["estado"]) {
  almacenRestaurante.escribir((e) => ({ ...e, reservas: e.reservas.map((r) => (r.id === id ? { ...r, estado } : r)) }))
}

// ─── Ventas del día ───────────────────────────────────────────────────────

export function ventasDelDia(e: EstadoRestaurante) {
  const validos = e.pedidos.filter((p) => p.estado !== "cancelado")
  const suma = (ps: Pedido[]) => ps.reduce((t, p) => t + total(p), 0)
  const vendido = suma(validos)
  const porCanal = (["mesa", "recoger", "domicilio"] as Canal[]).map((c) => {
    const ps = validos.filter((p) => p.canal === c)
    return { canal: c, pedidos: ps.length, total: suma(ps) }
  })
  const porPago = (["nequi", "daviplata", "efectivo", "datafono"] as MetodoPago[]).map((m) => {
    const ps = validos.filter((p) => p.pago === m)
    return { pago: m, pedidos: ps.length, total: suma(ps) }
  })
  const unidades = new Map<string, number>()
  for (const p of validos) for (const l of p.lineas) unidades.set(l.productoId, (unidades.get(l.productoId) ?? 0) + l.cantidad)
  const masVendidos = [...unidades.entries()]
    .map(([id, n]) => ({ plato: PLATOS.find((x) => x.id === id)!, unidades: n }))
    .filter((x) => x.plato)
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 5)
  return {
    vendido,
    pedidos: validos.length,
    ticket: validos.length ? Math.round(vendido / validos.length) : 0,
    cancelados: e.pedidos.length - validos.length,
    porCanal,
    porPago,
    masVendidos,
  }
}

export function restablecerRestaurante() {
  almacenRestaurante.restablecer()
  almacenCarrito.restablecer()
}
