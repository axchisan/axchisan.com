/**
 * Datos de ejemplo, relativos a hoy. La clienta de la demo está armada a mano
 * para que cada pantalla tenga algo que mostrar: le faltan dos sellos para el
 * café gratis, tiene puntos que vencen en unas semanas y un cupón por usar.
 * El resto de clientes sale de un generador con semilla fija.
 */
import { aFecha, claveDia, claveInstante, diasEntre, generador, sumarDias } from "@/demos/motores/agenda/tiempo"
import { nivelDe, puntosPorCompra, type Cupon, type Movimiento } from "@/demos/motores/fidelizacion/programa"
import { CAMPANAS, CARTA, CLIENTE_DEMO, PROGRAMA, type Cliente, type EstadoCafe } from "./modelo"

const NOMBRES = [
  "Mariana Osorio", "Julián Cardona", "Luisa Fernanda Gil", "Andrés Felipe Toro", "Catalina Arango", "Santiago Marín",
  "Paula Andrea Ríos", "Camilo Henao", "Daniela Correa", "Sebastián Giraldo", "Natalia Ospina", "Mateo Londoño",
  "Laura Valencia", "Juan Pablo Ramírez", "Manuela Castaño", "David Montoya", "Isabela Duque", "Alejandro Zapata",
  "Valeria Arias", "Felipe Salazar", "Juliana Bedoya", "Esteban Agudelo", "Sara Villegas", "Tomás Cárdenas",
  "Carolina Mejía", "Nicolás Quintero", "Ana María Uribe", "Samuel Restrepo", "Gabriela Franco", "Simón Echeverry",
]

/** Combinaciones típicas de una visita, de la carta de la caja. */
const PEDIDOS = [["tinto"], ["tinto", "pandebono"], ["capuchino"], ["capuchino", "almojabana"], ["latte", "torta"], ["americano"], ["filtrado"], ["latte"], ["americano", "pandebono"], ["bolsa"]]
const montoDe = (ids: string[]) => ids.reduce((t, id) => t + CARTA.find((c) => c.id === id)!.precio, 0)
const conceptoDe = (ids: string[]) => ids.map((id) => CARTA.find((c) => c.id === id)!.nombre).join(" y ")

export function generarCafe(ahora = new Date()): EstadoCafe {
  const hoy = claveDia(ahora)
  const azar = generador(20260928).n
  const entre = (a: number, b: number) => a + Math.floor(azar() * (b - a + 1))
  const clientes: Cliente[] = []
  const movimientos: Movimiento[] = []
  const cupones: Cupon[] = []
  let n = 0
  const id = (p: string) => `${p}${(n++).toString(36)}`

  function compra(clienteId: string, fecha: string, pedido: string[]) {
    const monto = montoDe(pedido)
    const previos = movimientos.filter((m) => m.clienteId === clienteId)
    const nivel = nivelDe(PROGRAMA, previos, clienteId, fecha.slice(0, 10)).actual
    const sello = monto >= PROGRAMA.compraMinimaSello
    movimientos.push({ id: id("m"), clienteId, fecha, tipo: "compra", puntos: puntosPorCompra(PROGRAMA, monto, nivel), monto, sello, concepto: conceptoDe(pedido) })
    // Cada tarjeta llena se cambia por un café en la visita siguiente.
    const sellosHastaAhora = previos.filter((m) => m.sello).length + (sello ? 1 : 0)
    const canjeados = previos.filter((m) => m.tipo === "sello-canjeado").length
    if (sellosHastaAhora - canjeados * PROGRAMA.sellos >= PROGRAMA.sellos) {
      movimientos.push({ id: id("m"), clienteId, fecha: fecha.slice(0, 11) + "23:59", tipo: "sello-canjeado", puntos: 0, concepto: "Café gratis de la tarjeta de sellos" })
    }
  }

  // ─── La clienta de la demo ───
  clientes.push({ id: CLIENTE_DEMO, nombre: "Valentina Ríos", telefono: "3001234567", codigo: "CB-2718", cumple: "03-14", alta: sumarDias(hoy, -350) })
  // Bono de bienvenida hace casi un año: vence en unas semanas, y la app lo avisa.
  movimientos.push({ id: id("m"), clienteId: CLIENTE_DEMO, fecha: `${sumarDias(hoy, -345)}T12:00`, tipo: "bono", puntos: 40, concepto: "Bienvenida al programa" })
  // Una visita cada 7 días, empezando hace 322 días: 46 compras con sello
  // dejan la tarjeta en 6 de 8 (5 tarjetas llenas ya canjeadas).
  for (let d = -322, i = 0; d < 0; d += 7, i++) {
    const pedido = [["capuchino"], ["latte"], ["americano", "pandebono"], ["capuchino", "almojabana"], ["filtrado"], ["latte", "torta"]][i % 6]
    compra(CLIENTE_DEMO, `${sumarDias(hoy, d)}T${["08:10", "09:40", "16:20", "17:05"][i % 4]}`, pedido)
  }
  // Un amigo invitado hace dos meses: 50 puntos para cada uno.
  movimientos.push({ id: id("m"), clienteId: CLIENTE_DEMO, fecha: `${sumarDias(hoy, -62)}T11:00`, tipo: "bono", puntos: 50, concepto: "Invitaste a Julián Cardona" })
  const postre = CAMPANAS.find((c) => c.id === "postre")!
  cupones.push(
    { codigo: "K7Q3MD", clienteId: CLIENTE_DEMO, titulo: postre.premio, origen: "campana", creado: `${sumarDias(hoy, -2)}T10:00`, vence: sumarDias(hoy, 5) },
    { codigo: "H2WX9P", clienteId: CLIENTE_DEMO, titulo: "Café gratis de la tarjeta de sellos", origen: "sellos", creado: `${sumarDias(hoy, -40)}T09:00`, vence: sumarDias(hoy, -10), usado: `${sumarDias(hoy, -38)}T09:12` },
    { codigo: "R4TB8N", clienteId: CLIENTE_DEMO, titulo: "2x1 en bebidas calientes", origen: "campana", creado: `${sumarDias(hoy, -30)}T10:00`, vence: sumarDias(hoy, -23) },
  )

  // ─── El resto del barrio ───
  NOMBRES.forEach((nombre, i) => {
    const cid = `c${i}`
    const alta = entre(40, 420)
    // Unos vienen casi a diario, otros cada dos semanas; algunos dejaron de venir.
    const cada = [2, 3, 4, 7, 10, 14][i % 6]
    const dejoHace = i % 5 === 0 ? entre(32, 70) : entre(0, 4)
    clientes.push({
      id: cid,
      nombre,
      telefono: `31${String(20000000 + i * 314159).slice(0, 8)}`,
      codigo: `CB-${String(3100 + i * 37).padStart(4, "0")}`,
      cumple: `${String((i % 12) + 1).padStart(2, "0")}-${String(entre(1, 28)).padStart(2, "0")}`,
      alta: sumarDias(hoy, -alta),
      referidoPor: i === 1 ? CLIENTE_DEMO : undefined,
    })
    for (let d = -alta; d < -dejoHace; d += cada + entre(0, 2)) {
      compra(cid, `${sumarDias(hoy, d)}T${String(entre(7, 19)).padStart(2, "0")}:${String(entre(0, 5) * 10).padStart(2, "0")}`, PEDIDOS[entre(0, PEDIDOS.length - 1)])
      // Quien junta puntos a veces los cambia.
      if (azar() < 0.06) {
        movimientos.push({ id: id("m"), clienteId: cid, fecha: `${sumarDias(hoy, d)}T20:00`, tipo: "canje", puntos: -120, concepto: "Canje: Capuchino" })
      }
    }
  })

  movimientos.sort((a, b) => a.fecha.localeCompare(b.fecha))
  return { referencia: hoy, clientes, movimientos, cupones, envios: [] }
}

/**
 * Al abrir la demo otro día, todas las fechas se corren los días que pasaron:
 * la demo no envejece y se conserva lo que el visitante hizo.
 */
export function ponerAlDia(e: EstadoCafe, ahora = new Date()): EstadoCafe {
  const hoy = claveDia(ahora)
  if (e.referencia === hoy) return e
  const dias = diasEntre(e.referencia, hoy)
  const correr = (f: string) => (f.includes("T") ? claveInstante(new Date(aFecha(f).getTime() + dias * 86_400_000)) : sumarDias(f, dias))
  return {
    referencia: hoy,
    clientes: e.clientes.map((c) => ({ ...c, alta: correr(c.alta) })),
    movimientos: e.movimientos.map((m) => ({ ...m, fecha: correr(m.fecha) })),
    cupones: e.cupones.map((c) => ({ ...c, creado: correr(c.creado), vence: correr(c.vence), usado: c.usado ? correr(c.usado) : undefined })),
    envios: e.envios.map((x) => ({ ...x, fecha: correr(x.fecha) })),
  }
}
