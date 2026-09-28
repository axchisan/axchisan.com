/**
 * Motor de fidelización: puntos por compra, tarjeta de sellos, niveles,
 * recompensas y cupones de un solo uso. Lo usa Café del Barrio y sirve igual
 * para una heladería, una droguería, un lavadero de carros o una peluquería.
 *
 * Como en el motor de gestión, el saldo no se guarda: se calcula de los
 * movimientos. Así el historial que ve el cliente siempre cuadra con su saldo,
 * y el vencimiento de puntos sale solo.
 */
import { textoFecha } from "@/demos/motores/agenda/tiempo"

export type Nivel = {
  id: string
  nombre: string
  /** Puntos ganados en los últimos 12 meses para llegar a este nivel. */
  desde: number
  /** Multiplica los puntos de cada compra. */
  multiplicador: number
  beneficio: string
}

export type Programa = {
  /** Pesos de compra por cada punto. */
  pesosPorPunto: number
  /** Compras que llenan la tarjeta de sellos. La siguiente es gratis. */
  sellos: number
  /** Compra mínima para ganar un sello. */
  compraMinimaSello: number
  /** Meses que duran los puntos antes de vencer. */
  mesesVigencia: number
  niveles: Nivel[]
}

export type TipoMovimiento = "compra" | "canje" | "bono" | "sello-canjeado"

export type Movimiento = {
  id: string
  clienteId: string
  /** `AAAA-MM-DDTHH:mm`, hora local. */
  fecha: string
  tipo: TipoMovimiento
  /** Positivos se ganan, negativos se gastan. */
  puntos: number
  /** Compra en pesos, para las compras. */
  monto?: number
  /** Si la compra sumó un sello. */
  sello?: boolean
  concepto: string
}

const sumarMeses = (fecha: string, meses: number) => {
  const d = new Date(fecha.slice(0, 10) + "T12:00")
  d.setMonth(d.getMonth() + meses)
  return d.toISOString().slice(0, 10)
}

export type Lote = { fecha: string; vence: string; restantes: number }

/**
 * Los puntos se gastan del más viejo al más nuevo, y cada lote vence a los N
 * meses de ganado. Devuelve los lotes vivos: su suma es el saldo.
 */
export function lotesVigentes(programa: Programa, movimientos: Movimiento[], clienteId: string, hoy: string): Lote[] {
  const propios = movimientos.filter((m) => m.clienteId === clienteId).sort((a, b) => a.fecha.localeCompare(b.fecha))
  let lotes: Lote[] = []
  for (const m of propios) {
    // Antes de cada movimiento, se descartan los lotes que ya vencieron.
    lotes = lotes.filter((l) => l.vence > m.fecha.slice(0, 10))
    if (m.puntos > 0) {
      lotes.push({ fecha: m.fecha, vence: sumarMeses(m.fecha, programa.mesesVigencia), restantes: m.puntos })
    } else if (m.puntos < 0) {
      let porGastar = -m.puntos
      for (const l of lotes) {
        const usa = Math.min(l.restantes, porGastar)
        l.restantes -= usa
        porGastar -= usa
        if (!porGastar) break
      }
      lotes = lotes.filter((l) => l.restantes > 0)
    }
  }
  return lotes.filter((l) => l.vence > hoy && l.restantes > 0)
}

export const saldo = (programa: Programa, movimientos: Movimiento[], clienteId: string, hoy: string) =>
  lotesVigentes(programa, movimientos, clienteId, hoy).reduce((t, l) => t + l.restantes, 0)

/** Puntos que vencen en los próximos N días: el aviso que hace volver al cliente. */
export function porVencer(programa: Programa, movimientos: Movimiento[], clienteId: string, hoy: string, dias = 30) {
  const limite = new Date(hoy + "T12:00")
  limite.setDate(limite.getDate() + dias)
  const hasta = limite.toISOString().slice(0, 10)
  const lotes = lotesVigentes(programa, movimientos, clienteId, hoy).filter((l) => l.vence <= hasta)
  return { puntos: lotes.reduce((t, l) => t + l.restantes, 0), vence: lotes[0]?.vence ?? null }
}

/** El nivel sale de los puntos ganados (no del saldo) en los últimos 12 meses. */
export function nivelDe(programa: Programa, movimientos: Movimiento[], clienteId: string, hoy: string) {
  const desde = sumarMeses(hoy, -12)
  const ganados = movimientos
    .filter((m) => m.clienteId === clienteId && m.puntos > 0 && m.fecha.slice(0, 10) > desde)
    .reduce((t, m) => t + m.puntos, 0)
  const orden = [...programa.niveles].sort((a, b) => a.desde - b.desde)
  const actual = orden.filter((n) => ganados >= n.desde).at(-1) ?? orden[0]
  const siguiente = orden.find((n) => n.desde > ganados) ?? null
  return { actual, siguiente, ganados, faltan: siguiente ? siguiente.desde - ganados : 0 }
}

/** Puntos de una compra según el nivel: se redondea hacia abajo, como en caja. */
export const puntosPorCompra = (programa: Programa, monto: number, nivel: Nivel) =>
  Math.floor((monto / programa.pesosPorPunto) * nivel.multiplicador)

/** Sellos en la tarjeta actual: las compras con sello desde el último café gratis. */
export function sellos(programa: Programa, movimientos: Movimiento[], clienteId: string) {
  const propios = movimientos.filter((m) => m.clienteId === clienteId).sort((a, b) => a.fecha.localeCompare(b.fecha))
  let n = 0
  for (const m of propios) {
    if (m.tipo === "sello-canjeado") n = Math.max(0, n - programa.sellos)
    else if (m.sello) n++
  }
  return { tiene: Math.min(n, programa.sellos), llena: n >= programa.sellos }
}

// ─── Cupones ──────────────────────────────────────────────────────────────

export type Cupon = {
  codigo: string
  clienteId: string
  /** Qué da: "Capuchino gratis", "2x1 en postres". */
  titulo: string
  /** De dónde salió: una recompensa canjeada, una campaña o la tarjeta de sellos. */
  origen: "recompensa" | "campana" | "sellos" | "referido" | "cumpleanos"
  creado: string
  /** `AAAA-MM-DD`, último día en que se puede usar. */
  vence: string
  usado?: string
}

export type EstadoCupon = "activo" | "usado" | "vencido"

export const estadoCupon = (c: Cupon, hoy: string): EstadoCupon => (c.usado ? "usado" : c.vence < hoy ? "vencido" : "activo")

/** Código corto que se dicta en caja: sin letras que se confunden (0/O, 1/I). */
export function codigoCupon(azar: () => number = Math.random) {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({ length: 6 }, () => letras[Math.floor(azar() * letras.length)]).join("")
}

export type ResultadoCupon = { ok: true; cupon: Cupon } | { ok: false; motivo: string }

/** Lo que valida la caja antes de entregar el premio. */
export function validarCupon(cupones: Cupon[], codigo: string, hoy: string): ResultadoCupon {
  const c = cupones.find((x) => x.codigo === codigo.trim().toUpperCase().replace(/[^A-Z0-9]/g, ""))
  if (!c) return { ok: false, motivo: "Ese código no existe. Revisa que esté bien escrito." }
  const estado = estadoCupon(c, hoy)
  if (estado === "usado") return { ok: false, motivo: `Ese cupón ya se usó el ${textoFecha(c.usado!.slice(0, 10))}.` }
  if (estado === "vencido") return { ok: false, motivo: `Ese cupón venció el ${textoFecha(c.vence)}.` }
  return { ok: true, cupon: c }
}
