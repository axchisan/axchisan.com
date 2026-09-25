import { costoVenta, totalVenta, type MetodoPago, type ProductoInventario, type Venta } from "./inventario"

/** Ventas entre dos días, ambos incluidos (`AAAA-MM-DD`). */
export const ventasEntre = (ventas: Venta[], desde: string, hasta: string) =>
  ventas.filter((v) => v.fecha.slice(0, 10) >= desde && v.fecha.slice(0, 10) <= hasta)

export function resumen(ventas: Venta[]) {
  const vendido = ventas.reduce((t, v) => t + totalVenta(v), 0)
  const costo = ventas.reduce((t, v) => t + costoVenta(v), 0)
  return {
    vendido,
    ventas: ventas.length,
    ticket: ventas.length ? Math.round(vendido / ventas.length) : 0,
    utilidad: vendido - costo,
    margen: vendido ? (vendido - costo) / vendido : 0,
  }
}

export function porDia(ventas: Venta[], dias: string[]) {
  return dias.map((d) => {
    const del = ventas.filter((v) => v.fecha.startsWith(d))
    return { dia: d, total: del.reduce((t, v) => t + totalVenta(v), 0), ventas: del.length }
  })
}

export function porPago(ventas: Venta[]) {
  const m = new Map<MetodoPago, number>()
  for (const v of ventas) m.set(v.pago, (m.get(v.pago) ?? 0) + totalVenta(v))
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

export function porProducto(ventas: Venta[], productos: ProductoInventario[]) {
  const m = new Map<string, { cantidad: number; total: number; utilidad: number }>()
  for (const v of ventas) {
    for (const l of v.lineas) {
      const x = m.get(l.productoId) ?? { cantidad: 0, total: 0, utilidad: 0 }
      x.cantidad += l.cantidad
      x.total += l.precio * l.cantidad
      x.utilidad += (l.precio - l.costo) * l.cantidad
      m.set(l.productoId, x)
    }
  }
  return [...m.entries()]
    .map(([id, x]) => ({ producto: productos.find((p) => p.id === id)!, ...x }))
    .filter((x) => x.producto)
    .sort((a, b) => b.total - a.total)
}

export function porCategoria(ventas: Venta[], productos: ProductoInventario[]) {
  const m = new Map<string, number>()
  for (const x of porProducto(ventas, productos)) m.set(x.producto.categoria, (m.get(x.producto.categoria) ?? 0) + x.total)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

/**
 * Un archivo que Excel abre bien en Colombia: separado por punto y coma, con
 * coma decimal y BOM para que las tildes no se dañen.
 */
export function aCsv(filas: (string | number)[][]) {
  const celda = (x: string | number) => {
    const t = typeof x === "number" ? String(x).replace(".", ",") : x
    return /[;"\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t
  }
  return "﻿" + filas.map((f) => f.map(celda).join(";")).join("\r\n")
}

export function descargar(nombre: string, contenido: string) {
  const url = URL.createObjectURL(new Blob([contenido], { type: "text/csv;charset=utf-8" }))
  const a = document.createElement("a")
  a.href = url
  a.download = nombre
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
