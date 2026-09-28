/**
 * Café del Barrio, café de especialidad ficticio en Pereira. El programa de
 * fidelización, las recompensas, la carta rápida de la caja y las campañas.
 */
import type { Cupon, Movimiento, Programa } from "@/demos/motores/fidelizacion/programa"

export const PROGRAMA: Programa = {
  pesosPorPunto: 1_000,
  sellos: 8,
  compraMinimaSello: 5_000,
  mesesVigencia: 12,
  niveles: [
    { id: "semilla", nombre: "Semilla", desde: 0, multiplicador: 1, beneficio: "Un punto por cada $ 1.000 y tu tarjeta de sellos." },
    { id: "tostado", nombre: "Tostado", desde: 300, multiplicador: 1.25, beneficio: "25 % más puntos en cada compra." },
    { id: "origen", nombre: "Origen", desde: 800, multiplicador: 1.5, beneficio: "50 % más puntos y catas de los cafés nuevos antes que nadie." },
  ],
}

export type Recompensa = { id: string; nombre: string; puntos: number; detalle: string }

export const RECOMPENSAS: Recompensa[] = [
  { id: "tinto", nombre: "Tinto", puntos: 60, detalle: "El de la casa, de Belén de Umbría." },
  { id: "capuchino", nombre: "Capuchino", puntos: 120, detalle: "Con leche entera o de avena." },
  { id: "combo", nombre: "Pandebono y café", puntos: 150, detalle: "El desayuno del barrio." },
  { id: "postre", nombre: "Postre del día", puntos: 180, detalle: "Torta de naranja, brownie o tres leches." },
  { id: "bolsa", nombre: "Bolsa de café de 250 g", puntos: 450, detalle: "En grano o molido para tu método." },
  { id: "taller", nombre: "Taller de métodos", puntos: 800, detalle: "Una hora con el barista: V60, prensa y moka." },
]

export const recompensa = (id: string) => RECOMPENSAS.find((r) => r.id === id)

/** Botones de la caja: se toca lo que pidió el cliente y se suma el total. */
export const CARTA = [
  { id: "tinto", nombre: "Tinto", precio: 3_000 },
  { id: "americano", nombre: "Americano", precio: 5_500 },
  { id: "capuchino", nombre: "Capuchino", precio: 7_500 },
  { id: "latte", nombre: "Latte", precio: 8_000 },
  { id: "filtrado", nombre: "Filtrado V60", precio: 9_500 },
  { id: "pandebono", nombre: "Pandebono", precio: 3_500 },
  { id: "almojabana", nombre: "Almojábana", precio: 3_500 },
  { id: "torta", nombre: "Tajada de torta", precio: 9_000 },
  { id: "bolsa", nombre: "Bolsa de café 250 g", precio: 34_000 },
]

export type Cliente = {
  id: string
  nombre: string
  telefono: string
  /** Código que muestra la app y se dicta o escanea en caja. */
  codigo: string
  /** `MM-DD`. */
  cumple: string
  alta: string
  referidoPor?: string
}

export type Campana = {
  id: string
  nombre: string
  /** A quién le llega. */
  segmento: "inactivos" | "cumpleanos" | "por-vencer" | "todos"
  premio: string
  mensaje: string
  /** Días que dura el cupón. */
  dias: number
}

export const CAMPANAS: Campana[] = [
  {
    id: "extranamos",
    nombre: "Te extrañamos",
    segmento: "inactivos",
    premio: "2x1 en bebidas calientes",
    mensaje: "Hola, {nombre}. Hace rato no te vemos en Café del Barrio. Te dejamos un 2x1 en bebidas calientes para esta semana: muestra el código {codigo} en caja.",
    dias: 7,
  },
  {
    id: "cumple",
    nombre: "Cumpleaños del mes",
    segmento: "cumpleanos",
    premio: "Bebida gratis de cumpleaños",
    mensaje: "¡Feliz cumpleaños, {nombre}! Tu bebida favorita va por nuestra cuenta este mes. Código {codigo}.",
    dias: 30,
  },
  {
    id: "vencer",
    nombre: "Puntos por vencer",
    segmento: "por-vencer",
    premio: "Doble puntos en tu próxima compra",
    mensaje: "{nombre}, tienes puntos que vencen pronto en Café del Barrio. Ven esta semana y te damos doble puntos: código {codigo}.",
    dias: 10,
  },
  {
    id: "postre",
    nombre: "Martes de postre",
    segmento: "todos",
    premio: "Postre a mitad de precio con tu bebida",
    mensaje: "Hola, {nombre}. Este martes, el postre del día va a mitad de precio con cualquier bebida. Código {codigo}.",
    dias: 7,
  },
]

/** Puntos de bienvenida para quien llega invitado y para quien lo invitó. */
export const BONO_REFERIDO = 50

export type EnvioCampana = { id: string; campanaId: string; fecha: string; enviados: number }

export type EstadoCafe = {
  /** Día de referencia de las fechas; al cambiar de día se corren para que la demo no envejezca. */
  referencia: string
  clientes: Cliente[]
  movimientos: Movimiento[]
  cupones: Cupon[]
  envios: EnvioCampana[]
}

/** La visitante de la demo: su app es la que se ve en /demo/cafe-del-barrio. */
export const CLIENTE_DEMO = "c-yo"

export const EMPRESA = {
  nombre: "Café del Barrio",
  direccion: "Calle 19 # 7-40, centro, Pereira (dirección de ejemplo)",
  whatsappVisible: "300 000 0000",
}
