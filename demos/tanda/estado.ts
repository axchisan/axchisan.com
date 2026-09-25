"use client"

import { crearAlmacen, useAlmacen } from "@/demos/comun/almacen"
import { claveDia, claveInstante } from "@/demos/motores/agenda/tiempo"
import { agregarLinea, cambiarCantidad, precioUnitario, textoSeleccion, type LineaCarrito, type Seleccion } from "@/demos/motores/pedidos/carrito"
import { siguiente, type MetodoPago, type Pedido } from "@/demos/motores/pedidos/pedido"
import { precioEncargo, productoPorId, ZONAS_DOMICILIO, type Encargo, type EstadoPanaderia } from "./modelo"
import { generarPanaderia, ponerAlDia } from "./semilla"

export const almacenPanaderia = crearAlmacen<EstadoPanaderia>("axchi-demo:tanda:panaderia:v1", () => generarPanaderia(), (g) => ponerAlDia(g))
export const almacenBolsa = crearAlmacen<{ lineas: LineaCarrito[] }>("axchi-demo:tanda:bolsa:v1", () => ({ lineas: [] }))

export const usePanaderia = () => useAlmacen(almacenPanaderia)
export const useBolsa = () => useAlmacen(almacenBolsa)

export const pedidosDeHoy = (e: EstadoPanaderia | null) => (e ? e.pedidos.filter((p) => p.creado.startsWith(claveDia(new Date()))) : [])

export function agregar(productoId: string, cantidad: number, seleccion: Seleccion = {}) {
  almacenBolsa.escribir((b) => ({ lineas: agregarLinea(b.lineas, { productoId, seleccion, cantidad }) }))
}

export function cambiar(clave: string, cantidad: number) {
  almacenBolsa.escribir((b) => ({ lineas: cambiarCantidad(b.lineas, clave, cantidad) }))
}

export const precioLinea = (l: LineaCarrito) => {
  const p = productoPorId(l.productoId)
  return p ? precioUnitario(p, l.seleccion) : 0
}
export const subtotal = (lineas: LineaCarrito[]) => lineas.reduce((t, l) => t + precioLinea(l) * l.cantidad, 0)

export function enviarPedido(d: { canal: "recoger" | "domicilio"; nombre: string; telefono: string; zonaId?: string; direccion?: string; pago: MetodoPago; hora?: string }): Pedido {
  const e = almacenPanaderia.leer()
  const { lineas } = almacenBolsa.leer()
  const zona = ZONAS_DOMICILIO.find((z) => z.id === d.zonaId)
  const ahora = claveInstante(new Date())
  const pedido: Pedido = {
    id: `t${e.siguientePedido}`,
    numero: e.siguientePedido,
    creado: ahora,
    canal: d.canal,
    cliente: { nombre: d.nombre.trim(), telefono: d.telefono.trim() },
    direccion: d.canal === "domicilio" && zona ? { barrio: zona.barrio, direccion: d.direccion?.trim() ?? "" } : undefined,
    hora: d.canal === "recoger" ? d.hora : undefined,
    lineas: lineas.map((l) => {
      const p = productoPorId(l.productoId)!
      return { productoId: p.id, nombre: p.nombre, detalle: textoSeleccion(p, l.seleccion) || undefined, cantidad: l.cantidad, precio: precioLinea(l) }
    }),
    domicilio: d.canal === "domicilio" ? (zona?.costo ?? 0) : 0,
    pago: d.pago,
    estado: "recibido",
    historial: [{ estado: "recibido", en: ahora }],
    origen: "web",
  }
  almacenPanaderia.escribir((x) => ({ ...x, pedidos: [pedido, ...x.pedidos], siguientePedido: x.siguientePedido + 1 }))
  almacenBolsa.escribir({ lineas: [] })
  return pedido
}

export function avanzarPedido(id: string) {
  const en = claveInstante(new Date())
  almacenPanaderia.escribir((e) => ({
    ...e,
    pedidos: e.pedidos.map((p) => {
      const s = p.id === id ? siguiente(p) : null
      return s ? { ...p, estado: s, historial: [...p.historial, { estado: s, en }] } : p
    }),
  }))
}

export function encargar(d: Omit<Encargo, "id" | "numero" | "creado" | "total" | "anticipo" | "estado">): Encargo {
  const e = almacenPanaderia.leer()
  const encargo: Encargo = { ...d, mensaje: d.mensaje?.trim() || undefined, id: `e${e.siguienteEncargo}`, numero: e.siguienteEncargo, creado: claveInstante(new Date()), total: precioEncargo(d), anticipo: 0, estado: "por-anticipo" }
  almacenPanaderia.escribir((x) => ({ ...x, encargos: [...x.encargos, encargo].sort((a, b) => a.entrega.localeCompare(b.entrega)), siguienteEncargo: x.siguienteEncargo + 1 }))
  return encargo
}

export function cambiarEncargo(id: string, cambio: Partial<Pick<Encargo, "estado" | "anticipo">>) {
  almacenPanaderia.escribir((e) => ({ ...e, encargos: e.encargos.map((x) => (x.id === id ? { ...x, ...cambio } : x)) }))
}

export function alternarHorneada(clave: string) {
  almacenPanaderia.escribir((e) => ({ ...e, horneadas: e.horneadas.includes(clave) ? e.horneadas.filter((x) => x !== clave) : [...e.horneadas, clave] }))
}

export function restablecerPanaderia() {
  almacenPanaderia.restablecer()
  almacenBolsa.restablecer()
}
