/**
 * Lo que queda de cada producto, calculado desde las horneadas del día: lo que
 * salió del horno menos lo que se vendió en el mostrador (estimado por las
 * horas que lleva afuera) y lo pedido por la página. Sin almacenar nada: a
 * cualquier hora que se abra la demo, la vitrina tiene sentido.
 */
import type { Pedido } from "@/demos/motores/pedidos/pedido"
import type { Producto } from "./modelo"

const minutos = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))

export type Disponibilidad = {
  /** Unidades que quedan; `null` si se prepara al momento. */
  quedan: number | null
  /** Hora de la próxima tanda de hoy, si la hay. */
  proxima: string | null
  /** Salió del horno hace menos de 40 minutos. */
  recien: boolean
}

export function disponibilidad(p: Producto, ahora: Date, pedidosHoy: Pedido[]): Disponibilidad {
  if (p.tandas.length === 0) return { quedan: null, proxima: null, recien: false }
  const m = ahora.getHours() * 60 + ahora.getMinutes()
  const pasadas = p.tandas.filter((t) => minutos(t) <= m)
  const proxima = p.tandas.find((t) => minutos(t) > m) ?? null
  // En el mostrador se va vendiendo durante unas cuatro horas después de cada horneada.
  const mostrador = pasadas.reduce((t, h) => t + Math.floor(p.porTanda * Math.min(0.9, ((m - minutos(h)) / 240) * 0.9)), 0)
  const web = pedidosHoy.filter((x) => x.estado !== "cancelado").reduce((t, x) => t + x.lineas.filter((l) => l.productoId === p.id).reduce((s, l) => s + l.cantidad, 0), 0)
  const quedan = Math.max(0, pasadas.length * p.porTanda - mostrador - web)
  const ultima = pasadas.at(-1)
  return { quedan, proxima, recien: Boolean(ultima && m - minutos(ultima) < 40) }
}

/** Todas las tandas del día, en orden, con lo que sale en cada una. */
export function tandasDelDia(productos: Producto[]) {
  const horas = [...new Set(productos.flatMap((p) => p.tandas))].sort()
  return horas.map((hora) => ({ hora, productos: productos.filter((p) => p.tandas.includes(hora)) }))
}

export const yaSalio = (hora: string, ahora: Date) => minutos(hora) <= ahora.getHours() * 60 + ahora.getMinutes()
