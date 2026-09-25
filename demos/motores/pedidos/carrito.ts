/**
 * Motor de pedidos: carta con opciones, carrito y pedido. Lo usa Fogón 45 y
 * sirve igual para una cafetería, una panadería o unas comidas rápidas: cambia
 * la carta, no la lógica.
 */

export type Opcion = { id: string; nombre: string; /** Pesos que suma al plato. */ extra?: number }

export type GrupoOpciones = {
  id: string
  nombre: string
  /** "uno": se elige exactamente una (término, sabor). "varios": adiciones opcionales. */
  tipo: "uno" | "varios"
  opciones: Opcion[]
}

export type Producto = {
  id: string
  nombre: string
  precio: number
  opciones?: GrupoOpciones[]
}

/** Opciones elegidas: por grupo, los ids de las opciones. */
export type Seleccion = Record<string, string[]>

export type LineaCarrito = {
  clave: string
  productoId: string
  cantidad: number
  seleccion: Seleccion
  nota?: string
}

/** La selección por defecto: la primera opción de cada grupo "uno", nada en "varios". */
export function seleccionInicial(p: Producto): Seleccion {
  const s: Seleccion = {}
  for (const g of p.opciones ?? []) s[g.id] = g.tipo === "uno" ? [g.opciones[0].id] : []
  return s
}

export function precioUnitario(p: Producto, s: Seleccion, precioBase = p.precio) {
  let total = precioBase
  for (const g of p.opciones ?? []) {
    for (const id of s[g.id] ?? []) total += g.opciones.find((o) => o.id === id)?.extra ?? 0
  }
  return total
}

/** "Término medio, con yuca frita": lo elegido, en el orden de la carta. */
export function textoSeleccion(p: Producto, s: Seleccion) {
  const partes: string[] = []
  for (const g of p.opciones ?? []) {
    for (const o of g.opciones) if (s[g.id]?.includes(o.id)) partes.push(o.nombre)
  }
  return partes.join(", ")
}

/**
 * Dos platos iguales, con las mismas opciones y la misma nota, son una sola
 * línea con cantidad 2. Con otra opción, son líneas distintas: la cocina tiene
 * que verlas por separado.
 */
export function claveLinea(productoId: string, s: Seleccion, nota?: string) {
  const opciones = Object.keys(s)
    .sort()
    .map((g) => `${g}:${[...s[g]].sort().join("+")}`)
    .join("|")
  return `${productoId}#${opciones}#${(nota ?? "").trim().toLowerCase()}`
}

export function agregarLinea(lineas: LineaCarrito[], nueva: Omit<LineaCarrito, "clave">): LineaCarrito[] {
  const clave = claveLinea(nueva.productoId, nueva.seleccion, nueva.nota)
  const existente = lineas.find((l) => l.clave === clave)
  if (existente) return lineas.map((l) => (l.clave === clave ? { ...l, cantidad: l.cantidad + nueva.cantidad } : l))
  return [...lineas, { ...nueva, clave, nota: nueva.nota?.trim() || undefined }]
}

export function cambiarCantidad(lineas: LineaCarrito[], clave: string, cantidad: number): LineaCarrito[] {
  return cantidad <= 0 ? lineas.filter((l) => l.clave !== clave) : lineas.map((l) => (l.clave === clave ? { ...l, cantidad } : l))
}

export const unidades = (lineas: { cantidad: number }[]) => lineas.reduce((t, l) => t + l.cantidad, 0)
