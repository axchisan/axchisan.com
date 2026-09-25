/**
 * Datos de ejemplo de Fogón 45, generados alrededor de la hora del visitante:
 * a cualquier hora que se abra la demo, la cocina tiene pedidos entrando, en
 * preparación y ya entregados, y hay reservas para hoy y los próximos días.
 */
import { claveDia, claveInstante, franjasDelDia, generador, sumarDias, sumarMinutos } from "@/demos/motores/agenda/tiempo"
import { precioUnitario, seleccionInicial, textoSeleccion, type Seleccion } from "@/demos/motores/pedidos/carrito"
import { pasos, type Canal, type EstadoPedido, type LineaPedido, type MetodoPago, type Pedido } from "@/demos/motores/pedidos/pedido"
import { FRANJAS_RESERVA, PLATOS, ZONAS, type EstadoRestaurante, type Plato, type Reserva } from "./modelo"

const NOMBRES = [
  "Laura Gómez", "Andrés Rincón", "Camila Ospina", "Julián Parra", "Valentina Rojas", "Santiago Muñoz", "Daniela Castro",
  "Felipe Herrera", "Natalia Pardo", "Sebastián Vargas", "María José León", "Carlos Beltrán", "Paula Suárez", "Diego Cárdenas",
  "Juliana Mejía", "Tomás Acosta", "Mariana Torres", "Alejandro Niño", "Sara Quintero", "Mateo Salazar",
]

const DIRECCIONES = ["Carrera 7 # 45-10, apto 402", "Calle 47 # 13-21", "Carrera 15 # 39-80, torre 2", "Calle 53 # 9-30, casa", "Carrera 19 # 42-15, apto 301"]

const NOTAS_PLATO = ["Sin cebolla", "El ají aparte", "Sin cilantro", "Bien caliente, por favor"]

type R = ReturnType<typeof generador>

function lineaAlAzar(r: R, plato: Plato): LineaPedido {
  const s: Seleccion = seleccionInicial(plato)
  for (const g of plato.opciones ?? []) {
    if (g.tipo === "uno") s[g.id] = [r.uno(g.opciones).id]
    else s[g.id] = r.prob(0.25) ? [g.opciones[0].id] : []
  }
  return {
    productoId: plato.id,
    nombre: plato.nombre,
    detalle: textoSeleccion(plato, s) || undefined,
    nota: r.prob(0.12) ? r.uno(NOTAS_PLATO) : undefined,
    cantidad: plato.categoria === "bebidas" || plato.categoria === "empezar" ? r.entero(1, 3) : r.entero(1, 2),
    precio: precioUnitario(plato, s),
  }
}

function lineasAlAzar(r: R): LineaPedido[] {
  // El sancocho es de fin de semana: los pedidos de ejemplo no lo llevan.
  const fuertes = PLATOS.filter((p) => (p.categoria === "fogon" || p.categoria === "sopas") && p.id !== "sancocho")
  const otros = PLATOS.filter((p) => p.categoria !== "fogon" && p.categoria !== "sopas")
  const elegidos = new Set<Plato>([r.uno(fuertes)])
  if (r.prob(0.5)) elegidos.add(r.uno(fuertes))
  for (let i = r.entero(1, 2); i > 0; i--) elegidos.add(r.uno(otros))
  return [...elegidos].map((p) => lineaAlAzar(r, p))
}

/** Estado según los minutos que lleva el pedido. */
function estadoPorEdad(canal: Canal, minutos: number): EstadoPedido {
  if (minutos < 5) return "recibido"
  if (minutos < 16) return "preparando"
  if (canal === "domicilio") return minutos < 22 ? "listo" : minutos < 45 ? "en-camino" : "entregado"
  return minutos < 20 ? "listo" : "entregado"
}

/** Minutos, desde que se creó, en que el pedido llegó a cada paso. */
const MINUTO_DE: Partial<Record<EstadoPedido, number>> = { recibido: 0, preparando: 3, listo: 16, "en-camino": 20, entregado: 21 }

export function generarPedidos(ahora: Date, r: R, desdeNumero: number): Pedido[] {
  const referencia = claveInstante(ahora)
  // Edades fijas para que siempre haya de todo en la cocina; después, uno
  // cada diez o quince minutos hacia atrás durante unas cinco horas.
  const edades = [1, 3, 7, 11, 14, 18, 30]
  for (let m = 42; m < 300; m += r.entero(9, 16)) edades.push(m)

  const pedidos = edades.map((edad, i): Pedido => {
    const canal: Canal = i === 6 ? "domicilio" : r.uno<Canal>(["mesa", "mesa", "domicilio", "recoger"])
    const creado = sumarMinutos(referencia, -edad)
    let estado = estadoPorEdad(canal, edad)
    if (i === 12) estado = "cancelado"
    const ps = pasos(canal)
    const hasta = estado === "cancelado" ? 0 : ps.indexOf(estado)
    const historial = ps.slice(0, hasta + 1).map((e) => ({
      estado: e,
      en: sumarMinutos(creado, e === "entregado" && canal === "domicilio" ? 42 : (MINUTO_DE[e] ?? 0)),
    }))
    if (estado === "cancelado") historial.push({ estado: "cancelado", en: sumarMinutos(creado, 4) })
    const zona = r.uno(ZONAS)
    const pago: MetodoPago = canal === "mesa" ? r.uno<MetodoPago>(["datafono", "nequi", "efectivo", "datafono"]) : r.uno<MetodoPago>(["nequi", "nequi", "daviplata", "efectivo"])
    const numero = desdeNumero + edades.length - 1 - i
    return {
      id: `p${numero}`,
      numero,
      creado,
      canal,
      mesa: canal === "mesa" ? r.entero(1, 12) : undefined,
      cliente: { nombre: canal === "mesa" ? `Mesa` : r.uno(NOMBRES), telefono: canal === "mesa" ? undefined : `3${r.entero(0, 2)}${r.entero(0, 9)} ${r.entero(100, 999)} ${r.entero(1000, 9999)}` },
      direccion: canal === "domicilio" ? { barrio: zona.barrio, direccion: r.uno(DIRECCIONES), indicaciones: r.prob(0.3) ? "Portería, dejar con el vigilante" : undefined } : undefined,
      lineas: lineasAlAzar(r),
      domicilio: canal === "domicilio" ? zona.costo : 0,
      pago,
      pagaCon: pago === "efectivo" && canal !== "mesa" ? 100_000 : undefined,
      estado,
      historial,
      origen: canal === "mesa" && r.prob(0.5) ? "mesero" : "web",
    }
  })
  // Los de mesa llevan el número de la mesa como nombre.
  return pedidos
    .map((p) => (p.canal === "mesa" ? { ...p, cliente: { nombre: `Mesa ${p.mesa}` } } : p))
    .sort((a, b) => a.creado.localeCompare(b.creado))
}

const NOTAS_RESERVA = ["Cumpleaños, llevamos torta", "Silla para bebé", "Mesa lejos de la puerta, si se puede", "Aniversario"]

export function generarReservas(ahora: Date, r: R): Reserva[] {
  const hoy = claveDia(ahora)
  const ahoraClave = claveInstante(ahora)
  const reservas: Reserva[] = []
  for (let d = 0; d < 7; d++) {
    const dia = sumarDias(hoy, d)
    const franjas = franjasDelDia(dia, FRANJAS_RESERVA)
    if (franjas.length === 0) continue
    const cuantas = d === 0 ? 8 : r.entero(3, 7)
    for (let i = 0; i < cuantas; i++) {
      // La noche pesa más que el mediodía.
      const inicio = r.prob(0.65) ? r.uno(franjas.slice(Math.floor(franjas.length / 2))) : r.uno(franjas)
      const pasada = inicio < ahoraClave
      reservas.push({
        id: `r${d}-${i}`,
        nombre: r.uno(NOMBRES),
        telefono: `3${r.entero(0, 2)}${r.entero(0, 9)} ${r.entero(100, 999)} ${r.entero(1000, 9999)}`,
        personas: r.uno([2, 2, 2, 3, 4, 4, 5, 6, 8]),
        inicio,
        nota: r.prob(0.25) ? r.uno(NOTAS_RESERVA) : undefined,
        estado: pasada ? (r.prob(0.85) ? "llego" : "cancelada") : "confirmada",
        origen: r.prob(0.7) ? "web" : "telefono",
      })
    }
  }
  return reservas.sort((a, b) => a.inicio.localeCompare(b.inicio))
}

/** El sancocho es de fin de semana: entre semana amanece agotado. */
const agotadosDelDia = (d: Date) => (d.getDay() === 0 || d.getDay() === 6 ? [] : ["sancocho"])

export function generarRestaurante(ahora = new Date()): EstadoRestaurante {
  const r = generador(45)
  const pedidos = generarPedidos(ahora, r, 101)
  return {
    referencia: claveDia(ahora),
    carta: { precios: {}, agotados: agotadosDelDia(ahora) },
    pedidos,
    reservas: generarReservas(ahora, r),
    siguienteNumero: Math.max(...pedidos.map((p) => p.numero)) + 1,
  }
}

/**
 * Una demo abierta otro día muestra una cocina de otro día. Se regeneran
 * pedidos y reservas, pero se conservan los cambios de la carta: son lo que el
 * visitante hizo a propósito. Los agotados, en cambio, son de un día.
 */
export function ponerAlDia(e: EstadoRestaurante): EstadoRestaurante {
  if (e.referencia === claveDia(new Date())) return e
  const nuevo = generarRestaurante()
  return { ...nuevo, carta: { ...nuevo.carta, precios: e.carta.precios } }
}
