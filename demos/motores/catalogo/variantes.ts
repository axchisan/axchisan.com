/**
 * Motor de catálogo y tienda: productos con variantes (color y talla), cada una
 * con sus existencias, bolsa de compras y envío por ciudad. Lo usa Linaza y
 * sirve igual para calzado, accesorios o cosméticos con tonos.
 */

export type Color = { id: string; nombre: string; hex: string; fotos: { src: string; alt: string }[] }

export type ProductoVariantes = {
  id: string
  nombre: string
  precio: number
  /** Precio antes, cuando está en rebaja. */
  antes?: number
  colores: Color[]
  tallas: string[]
}

/** Existencias de toda la tienda por variante: `producto/color:talla` → unidades. */
export type Existencias = Record<string, number>

export const clave = (productoId: string, color: string, talla: string) => `${productoId}/${color}:${talla}`

export const disponible = (stock: Existencias, productoId: string, color: string, talla: string) => stock[clave(productoId, color, talla)] ?? 0

/** Tallas de un color con al menos una unidad. */
export const tallasCon = (p: ProductoVariantes, stock: Existencias, color: string) => p.tallas.filter((t) => disponible(stock, p.id, color, t) > 0)

/** Un producto está agotado cuando no queda ninguna variante. */
export const agotado = (p: ProductoVariantes, stock: Existencias) => p.colores.every((c) => tallasCon(p, stock, c.id).length === 0)

export type LineaBolsa = { productoId: string; color: string; talla: string; cantidad: number }

export function agregarABolsa(lineas: LineaBolsa[], nueva: LineaBolsa): LineaBolsa[] {
  const igual = (l: LineaBolsa) => l.productoId === nueva.productoId && l.color === nueva.color && l.talla === nueva.talla
  return lineas.some(igual) ? lineas.map((l) => (igual(l) ? { ...l, cantidad: l.cantidad + nueva.cantidad } : l)) : [...lineas, nueva]
}

export function cambiarCantidadBolsa(lineas: LineaBolsa[], i: number, cantidad: number): LineaBolsa[] {
  return cantidad <= 0 ? lineas.filter((_, j) => j !== i) : lineas.map((l, j) => (j === i ? { ...l, cantidad } : l))
}

/** Descuenta de las existencias lo que se vendió. */
export function descontar(stock: Existencias, lineas: LineaBolsa[]): Existencias {
  const nuevo = { ...stock }
  for (const l of lineas) {
    const k = clave(l.productoId, l.color, l.talla)
    nuevo[k] = Math.max(0, (nuevo[k] ?? 0) - l.cantidad)
  }
  return nuevo
}

export type Ciudad = { id: string; nombre: string; costo: number; dias: string }

/**
 * Envío según la ciudad, y gratis desde un monto. Las tarifas son las de una
 * transportadora nacional para un paquete pequeño.
 */
export function costoEnvio(ciudad: Ciudad | undefined, subtotal: number, gratisDesde: number) {
  if (!ciudad) return 0
  return subtotal >= gratisDesde ? 0 : ciudad.costo
}
