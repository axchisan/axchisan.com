"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { claveInstante } from "@/demos/motores/agenda/tiempo"
import { agregarABolsa, cambiarCantidadBolsa, clave, costoEnvio, descontar, type LineaBolsa } from "@/demos/motores/catalogo/variantes"
import { CIUDADES, GRATIS_DESDE, prendaPorId, type EstadoPedido, type EstadoTienda, type MetodoPago, type Pedido } from "./modelo"
import { generarTienda, ponerAlDia } from "./semilla"

export const almacenTienda = crearAlmacen<EstadoTienda>(
  "axchi-demo:linaza:tienda:v1",
  () => generarTienda(),
  (guardado) => ponerAlDia(guardado),
)

export type Bolsa = { lineas: LineaBolsa[] }
export const almacenBolsa = crearAlmacen<Bolsa>("axchi-demo:linaza:bolsa:v1", () => ({ lineas: [] }))

export const useTienda = () => useAlmacen(almacenTienda)
export const useBolsa = () => useAlmacen(almacenBolsa)

export function agregar(productoId: string, color: string, talla: string) {
  almacenBolsa.escribir((b) => ({ lineas: agregarABolsa(b.lineas, { productoId, color, talla, cantidad: 1 }) }))
}

export function cambiarCantidad(i: number, cantidad: number) {
  almacenBolsa.escribir((b) => ({ lineas: cambiarCantidadBolsa(b.lineas, i, cantidad) }))
}

export const subtotalBolsa = (lineas: LineaBolsa[]) => lineas.reduce((t, l) => t + (prendaPorId(l.productoId)?.precio ?? 0) * l.cantidad, 0)

export const envioPara = (ciudadId: string, subtotal: number) => costoEnvio(CIUDADES.find((c) => c.id === ciudadId), subtotal, GRATIS_DESDE)

export function hacerPedido(d: { nombre: string; correo?: string; telefono: string; direccion: string; ciudadId: string; pago: MetodoPago }): Pedido {
  const e = almacenTienda.leer()
  const { lineas } = almacenBolsa.leer()
  const subtotal = subtotalBolsa(lineas)
  const pedido: Pedido = {
    id: `l${e.siguientePedido}`,
    numero: e.siguientePedido,
    fecha: claveInstante(new Date()),
    cliente: { nombre: d.nombre.trim(), correo: d.correo?.trim() || undefined, telefono: d.telefono.trim() },
    direccion: d.direccion.trim(),
    ciudadId: d.ciudadId,
    lineas: lineas.map((l) => {
      const p = prendaPorId(l.productoId)!
      return { ...l, nombre: p.nombre, colorNombre: p.colores.find((c) => c.id === l.color)?.nombre ?? "", precio: p.precio }
    }),
    envio: envioPara(d.ciudadId, subtotal),
    pago: d.pago,
    // Un pago en línea confirmado aparta las prendas; un pedido por WhatsApp
    // espera a que la tienda confirme.
    estado: d.pago === "whatsapp" ? "por-confirmar" : "pagado",
  }
  almacenTienda.escribir((x) => ({
    ...x,
    pedidos: [pedido, ...x.pedidos],
    siguientePedido: x.siguientePedido + 1,
    existencias: d.pago === "whatsapp" ? x.existencias : descontar(x.existencias, lineas),
  }))
  almacenBolsa.escribir({ lineas: [] })
  return pedido
}

export function cambiarEstado(id: string, estado: EstadoPedido) {
  almacenTienda.escribir((e) => ({
    ...e,
    pedidos: e.pedidos.map((p) =>
      p.id === id ? { ...p, estado, guia: estado === "enviado" && !p.guia ? `2400${Math.floor(100000 + Math.random() * 899999)}` : p.guia } : p,
    ),
    // Al confirmar un pedido de WhatsApp se descuentan las prendas.
    existencias: estado === "pagado" && e.pedidos.find((p) => p.id === id)?.estado === "por-confirmar" ? descontar(e.existencias, e.pedidos.find((p) => p.id === id)!.lineas) : e.existencias,
  }))
}

export function fijarExistencia(productoId: string, color: string, talla: string, cantidad: number) {
  almacenTienda.escribir((e) => ({ ...e, existencias: { ...e.existencias, [clave(productoId, color, talla)]: Math.max(0, cantidad) } }))
}

export const pedidoPorId = (e: EstadoTienda | null, id: string) => e?.pedidos.find((p) => p.id === id) ?? null

export function restablecerTienda() {
  almacenTienda.restablecer()
  almacenBolsa.restablecer()
}
