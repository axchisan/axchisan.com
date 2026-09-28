/**
 * Datos de ejemplo de la ferretería: tres semanas de ventas hasta la hora del
 * visitante, entradas de mercancía y un inventario inicial calculado para que
 * hoy las existencias sean las previstas (algunas por debajo del mínimo).
 */
import { claveDia, claveInstante, generador, sumarDias } from "@/demos/motores/agenda/tiempo"
import type { MetodoPago, Movimiento, Venta } from "@/demos/motores/gestion/inventario"
import { PRODUCTOS, type EstadoFerreteria, type PedidoWeb, type Producto } from "./modelo"

const DIAS = 21
const CLIENTES = ["Maestro Jairo", "Constructora Los Pinos", "Doña Gloria", "Edwin, electricista", "Taller El Paisa", "Conjunto Villa Rica"]

type R = ReturnType<typeof generador>

function cantidadPara(r: R, p: Producto) {
  if (p.unidad === "metro") return r.uno([3, 5, 8, 10, 15, 20])
  if (p.unidad === "bulto") return r.entero(1, 4)
  if (p.rotacion >= 3) return r.uno([2, 4, 6, 10, 12, 20])
  return r.prob(0.8) ? 1 : 2
}

function elegir(r: R) {
  const total = PRODUCTOS.reduce((t, p) => t + p.rotacion, 0)
  let x = r.n() * total
  for (const p of PRODUCTOS) if ((x -= p.rotacion) <= 0) return p
  return PRODUCTOS[0]
}

function pago(r: R): MetodoPago {
  const x = r.n()
  return x < 0.45 ? "efectivo" : x < 0.75 ? "nequi" : x < 0.85 ? "daviplata" : x < 0.95 ? "tarjeta" : "transferencia"
}

export function generarFerreteria(ahora = new Date()): EstadoFerreteria {
  const r = generador(38)
  const hoy = claveDia(ahora)
  const ahoraClave = claveInstante(ahora)
  const ventas: Venta[] = []
  let numero = 4_120

  for (let d = DIAS - 1; d >= 0; d--) {
    const dia = sumarDias(hoy, -d)
    const domingo = new Date(`${dia}T12:00`).getDay() === 0
    const [abre, cierra] = domingo ? [8, 13] : [7, 19]
    const cuantas = domingo ? r.entero(8, 12) : r.entero(18, 28)
    const horas = Array.from({ length: cuantas }, () => abre + r.n() * (cierra - abre)).sort((a, b) => a - b)
    for (const h of horas) {
      const fecha = `${dia}T${String(Math.floor(h)).padStart(2, "0")}:${String(Math.floor((h % 1) * 60)).padStart(2, "0")}`
      if (fecha > ahoraClave) break
      const lineas = new Map<string, Venta["lineas"][number]>()
      for (let i = r.entero(1, 4); i > 0; i--) {
        const p = elegir(r)
        const previa = lineas.get(p.id)
        const cantidad = cantidadPara(r, p)
        lineas.set(p.id, { productoId: p.id, nombre: p.nombre, cantidad: (previa?.cantidad ?? 0) + cantidad, precio: p.precio, costo: p.costo })
      }
      const ls = [...lineas.values()]
      const bruto = ls.reduce((t, l) => t + l.precio * l.cantidad, 0)
      const metodo = pago(r)
      ventas.push({
        id: `v${numero}`,
        numero: numero++,
        fecha,
        lineas: ls,
        // A los clientes de obra se les hace un 5 % en compras grandes.
        descuento: bruto > 150_000 && r.prob(0.5) ? Math.round((bruto * 0.05) / 100) * 100 : 0,
        pago: metodo,
        recibido: metodo === "efectivo" ? Math.ceil(bruto / 10_000) * 10_000 : undefined,
        cliente: bruto > 150_000 && r.prob(0.6) ? r.uno(CLIENTES) : undefined,
        origen: r.prob(0.08) ? "web" : "mostrador",
      })
    }
  }

  const vendido = new Map<string, number>()
  for (const v of ventas) for (const l of v.lineas) vendido.set(l.productoId, (vendido.get(l.productoId) ?? 0) + l.cantidad)

  // Entradas: cada proveedor trajo mercancía hace una y hace dos semanas. Solo
  // las que caben: el inventario inicial no puede quedar por debajo del mínimo.
  const movimientos: Movimiento[] = []
  const entradas = new Map<string, number>()
  for (const p of PRODUCTOS) {
    for (const hace of [14, 7]) {
      if (!r.prob(0.55)) continue
      const cantidad = p.empaque * r.entero(1, 3)
      const inicial = p.hoy + (vendido.get(p.id) ?? 0) - (entradas.get(p.id) ?? 0) - cantidad
      if (inicial < p.minimo) continue
      entradas.set(p.id, (entradas.get(p.id) ?? 0) + cantidad)
      movimientos.push({
        id: `m${p.id}-${hace}`,
        productoId: p.id,
        fecha: `${sumarDias(hoy, -hace)}T09:${String(r.entero(10, 50))}`,
        tipo: "entrada",
        cantidad,
        costo: p.costo,
        nota: `factura ${r.entero(1000, 9999)}`,
      })
    }
  }

  // El inicial se calcula al final, para que hoy cuadre con lo previsto.
  const inicio = `${sumarDias(hoy, -DIAS)}T18:00`
  for (const p of PRODUCTOS) {
    movimientos.push({
      id: `m${p.id}-inicial`,
      productoId: p.id,
      fecha: inicio,
      tipo: "inicial",
      cantidad: p.hoy + (vendido.get(p.id) ?? 0) - (entradas.get(p.id) ?? 0),
    })
  }

  const pedidosWeb: PedidoWeb[] = [
    {
      id: "w311",
      numero: 311,
      fecha: `${hoy}T08:12`,
      cliente: { nombre: "Ricardo Peña", telefono: "311 000 0101" },
      lineas: [
        { productoId: "cemento-50", cantidad: 6 },
        { productoId: "arena-pega", cantidad: 4 },
        { productoId: "varilla-3-8", cantidad: 10 },
      ],
      entrega: "domicilio",
      direccion: "Calle 38 sur # 78-12",
      estado: "listo",
    },
    {
      id: "w312",
      numero: 312,
      fecha: `${hoy}T10:40`,
      cliente: { nombre: "Adriana Mora", telefono: "320 000 0202" },
      lineas: [
        { productoId: "led-9", cantidad: 6 },
        { productoId: "toma-doble", cantidad: 2 },
        { productoId: "cinta-aislante", cantidad: 1 },
      ],
      entrega: "recoger",
      estado: "nuevo",
    },
  ].filter((p) => p.fecha <= ahoraClave) as PedidoWeb[]

  return {
    referencia: hoy,
    precios: {},
    movimientos,
    ventas,
    pedidosWeb,
    siguienteVenta: numero,
    siguientePedido: 313,
    avisos: [1, 2, 4].map((hace) => ({
      fecha: `${sumarDias(hoy, -hace)}T06:30`,
      texto: `Aviso enviado a su WhatsApp: ${3 + hace} productos por debajo del mínimo. Pedido sugerido listo para Tornillos del Norte y Pinturas La Sabana.`,
    })),
  }
}

/** Otro día, otra ferretería: se regenera todo menos los precios cambiados. */
export function ponerAlDia(e: EstadoFerreteria): EstadoFerreteria {
  if (e.referencia === claveDia(new Date())) return e
  return { ...generarFerreteria(), precios: e.precios }
}
