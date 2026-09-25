/**
 * Datos de ejemplo de Linaza: existencias por talla y color, con algunas tallas
 * agotadas a propósito, y los pedidos de la última semana.
 */
import { claveDia, claveInstante, generador, sumarMinutos } from "@/demos/motores/agenda/tiempo"
import { clave } from "@/demos/motores/catalogo/variantes"
import { CIUDADES, GRATIS_DESDE, PRENDAS, type EstadoPedido, type EstadoTienda, type MetodoPago, type Pedido } from "./modelo"

const BASE: Record<string, number> = { XS: 3, S: 7, M: 8, L: 5, XL: 3 }

/** Tallas agotadas o casi, para que la demo muestre cómo se ve. */
const FIJAS: Record<string, number> = {
  [clave("pantalon-tobillero", "mostaza", "XS")]: 0,
  [clave("pantalon-tobillero", "menta", "L")]: 1,
  [clave("vestido-lazo", "terracota", "M")]: 0,
  [clave("vestido-lazo", "terracota", "L")]: 1,
  [clave("camisa-manga-corta", "azul-noche", "XL")]: 0,
  [clave("vestido-arena", "arena", "XS")]: 0,
  [clave("blazer-lino", "azul", "S")]: 1,
}

const NOMBRES = ["Catalina Restrepo", "Juan Pablo Vélez", "Manuela Gaviria", "Simón Arango", "Isabella Zapata", "Andrés Ochoa", "Luisa Fernanda Ríos", "Tomás Mejía", "Sofía Uribe", "Daniel Echeverri"]
const DIRECCIONES = ["Carrera 43A # 1-50, apto 1204", "Calle 10 # 32-15", "Carrera 7 # 72-41, apto 502", "Avenida 6N # 23-40", "Calle 84 # 51B-20", "Transversal 39 # 74B-10"]

export function generarTienda(ahora = new Date()): EstadoTienda {
  const r = generador(27)
  const existencias: Record<string, number> = {}
  for (const p of PRENDAS) {
    for (const c of p.colores) {
      for (const t of p.tallas) {
        const k = clave(p.id, c.id, t)
        existencias[k] = FIJAS[k] ?? Math.max(0, (BASE[t] ?? 3) + r.entero(-2, 3))
      }
    }
  }

  const ref = claveInstante(ahora)
  const edades = [25, 140, 380, 900, 1500, 2200, 2900, 3600, 4700, 5900, 7400, 9100]
  const pedidos: Pedido[] = edades.map((min, i) => {
    const fecha = sumarMinutos(ref, -min)
    const lineas = Array.from({ length: r.entero(1, 3) }, () => {
      const p = r.uno(PRENDAS)
      const c = r.uno(p.colores)
      return { productoId: p.id, color: c.id, talla: r.uno(p.tallas), cantidad: 1, nombre: p.nombre, colorNombre: c.nombre, precio: p.precio }
    })
    const ciudad = r.uno(CIUDADES)
    const subtotal = lineas.reduce((t, l) => t + l.precio * l.cantidad, 0)
    const pago: MetodoPago = i === 1 ? "whatsapp" : r.uno<MetodoPago>(["pse", "pse", "nequi", "tarjeta"])
    const estado: EstadoPedido =
      pago === "whatsapp" ? "por-confirmar" : min < 200 ? "pagado" : min < 1_000 ? "alistado" : min < 4_000 ? "enviado" : "entregado"
    const numero = 1_048 + edades.length - i
    return {
      id: `l${numero}`,
      numero,
      fecha,
      cliente: { nombre: r.uno(NOMBRES), correo: undefined, telefono: `3${r.entero(0, 2)}${r.entero(0, 9)} ${r.entero(100, 999)} ${r.entero(1000, 9999)}` },
      direccion: r.uno(DIRECCIONES),
      ciudadId: ciudad.id,
      lineas,
      envio: subtotal >= GRATIS_DESDE ? 0 : ciudad.costo,
      pago,
      estado,
      guia: estado === "enviado" || estado === "entregado" ? `2400${r.entero(100000, 999999)}` : undefined,
    }
  })

  return {
    referencia: claveDia(ahora),
    existencias,
    pedidos,
    siguientePedido: 1_048 + edades.length + 1,
  }
}

/** Otro día: los pedidos se regeneran; las existencias se conservan. */
export function ponerAlDia(e: EstadoTienda): EstadoTienda {
  if (e.referencia === claveDia(new Date())) return e
  return { ...generarTienda(), existencias: e.existencias }
}
