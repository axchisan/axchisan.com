/**
 * Reglas del CRM de prospectos: estados, prioridad y qué ofrecerle a cada
 * negocio. Lo usan el panel (/admin/prospectos) y los scripts que cargan
 * prospectos desde Google Maps y OpenStreetMap.
 */

export const ESTADOS = [
  { id: "por-contactar", nombre: "Por contactar" },
  { id: "escrito", nombre: "Escrito" },
  { id: "respondio", nombre: "Respondió" },
  { id: "reunion", nombre: "Reunión" },
  { id: "propuesta", nombre: "Propuesta" },
  { id: "cliente", nombre: "Cliente" },
  { id: "descartado", nombre: "No le interesa" },
] as const

export type EstadoProspecto = (typeof ESTADOS)[number]["id"]
export const nombreEstado = (id: string) => ESTADOS.find((e) => e.id === id)?.nombre ?? id

export const ESTADOS_WEB = { "sin-pagina": "Sin página", "solo-redes": "Solo redes", "con-pagina": "Con página" } as const
export type EstadoWeb = keyof typeof ESTADOS_WEB

const REDES = ["facebook.com", "instagram.com", "linktr.ee", "wa.me", "whatsapp.com", "tiktok.com", "linkin.bio", "beacons.ai", "taplink.cc", "aiyellow.com", "my.canva.site", "bit.ly"]

export function estadoWeb(web?: string | null): EstadoWeb {
  if (!web) return "sin-pagina"
  return REDES.some((r) => web.includes(r)) ? "solo-redes" : "con-pagina"
}

/** Celular colombiano: 10 dígitos que empiezan por 3. Es el que tiene WhatsApp. */
export function limpiarTelefono(t?: string | null) {
  let d = (t ?? "").replace(/\D/g, "")
  if (d.startsWith("57") && d.length === 12) d = d.slice(2)
  return d || null
}
export const esCelular = (t?: string | null) => /^3\d{9}$/.test(t ?? "")

/**
 * Prioridad: no tiene página (hay qué venderle), tiene clientela (reseñas) y
 * se le puede escribir. A con 6 puntos o más, B con 4 o 5, C el resto.
 */
export function puntuar(p: { estadoWeb: string; resenas: number; calificacion?: number | null; telefono?: string | null }) {
  let puntaje = { "sin-pagina": 3, "solo-redes": 2, "con-pagina": 0 }[p.estadoWeb] ?? 0
  puntaje += p.resenas >= 50 ? 2 : p.resenas >= 15 ? 1 : 0
  puntaje += (p.calificacion ?? 0) >= 4.3 ? 1 : 0
  puntaje += p.telefono ? 1 : 0
  return { puntaje, prioridad: puntaje >= 6 ? "A" : puntaje >= 4 ? "B" : "C" }
}

type Sector = { claves: string[]; ficha: string; falta: string; plan: string }

const SECTORES: Sector[] = [
  { claves: ["restaurant", "comida", "asadero", "pizz", "hamburg", "fast_food", "parrilla", "piqueteadero", "marisquer", "estadero"], ficha: "restaurantes", falta: "Carta digital con QR y pedidos a domicilio y para recoger sin perder mensajes en WhatsApp", plan: "Catálogo con pedidos por WhatsApp" },
  { claves: ["panader", "pasteler", "reposter", "bakery"], ficha: "panaderias-y-cafeterias", falta: "Mostrar a qué hora sale el pan y recibir pedidos y encargos de tortas", plan: "Catálogo con pedidos por WhatsApp" },
  { claves: ["cafe", "cafeter", "helader", "fruter", "ice_cream"], ficha: "programa-de-puntos", falta: "Que los clientes vuelvan: tarjeta de sellos y puntos en el celular", plan: "Sistema de gestión" },
  { claves: ["peluquer", "barber", "belleza", "estetica", "spa", "unas", "hairdresser", "beauty"], ficha: "salones-y-barberias", falta: "Reservas en línea a cualquier hora y agenda por profesional", plan: "Citas en línea" },
  { claves: ["ferreter", "herramienta", "materiales", "miscelan", "cacharrer", "hardware", "doityourself", "electric"], ficha: "inventario-y-ventas", falta: "Inventario, caja y reportes, y catálogo con existencias en la web", plan: "Sistema de gestión" },
  { claves: ["hotel", "hostal", "hospedaje", "glamping", "finca"], ficha: "hoteles-y-turismo", falta: "Una página que muestre el lugar y lleve la reserva a WhatsApp", plan: "Página profesional" },
  { claves: ["veterinar", "mascota", "veterinary"], ficha: "veterinarias", falta: "Citas en línea, carnet de vacunas y recordatorios", plan: "Citas en línea" },
  { claves: ["odontol", "dental", "dentist", "ortodonc", "endodonc"], ficha: "consultorios-odontologicos", falta: "Agenda en línea, odontograma y presupuestos", plan: "Citas en línea" },
  { claves: ["gimnasio", "gym", "crossfit", "yoga", "danza", "baile", "fitness"], ficha: "gimnasios-y-estudios", falta: "Reservas de clases con cupo y control de membresías", plan: "Sistema de gestión" },
  { claves: ["ropa", "boutique", "moda", "calzado", "clothes"], ficha: "tiendas-de-ropa", falta: "Tienda en línea con tallas y colores, y pagos con PSE y Nequi", plan: "Tienda con pagos" },
  { claves: ["inmobiliar", "finca raiz"], ficha: "inmobiliarias", falta: "Página propia de inmuebles con filtros, mapa y visitas agendadas", plan: "Sitio con panel" },
  { claves: ["abogad", "contador", "contable", "juridic", "notar"], ficha: "abogados-y-contadores", falta: "Una página que dé confianza y traiga consultas ordenadas", plan: "Página profesional" },
  { claves: ["cosmet", "jabon"], ficha: "tiendas-de-cosmeticos", falta: "Tienda en línea con catálogo y pagos", plan: "Tienda con pagos" },
]

const sinTildes = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

/** Qué ficha, qué le falta y qué plan proponer, a partir de la búsqueda y la categoría. */
export function sectorDe(...textos: (string | null | undefined)[]) {
  const t = sinTildes(textos.filter(Boolean).join(" "))
  return SECTORES.find((s) => s.claves.some((c) => t.includes(c))) ?? null
}

/** Cadenas y franquicias: manejan su tecnología en casa, no son clientes. */
const CADENAS = ["crepes", "el corral gourmet", "hamburguesas el corral", "frisby", "kfc", "mcdonald", "burger king", "juan valdez", "tostao", "dunkin", "domino", "papa john", "presto", "jeno", "subway", "starbucks", "dollarcity", "homecenter", "d1 ", "olimpica", "exito", "carulla", "jumbo", "smart fit", "bodytech", "spinning center", "stop jeans", "studio f", "arturo calle", "koaj", "americanino", "colsanitas", "sura", "compensar", "cafam", "colsubsidio", "dentisalud", "sonria", "oral plus", "ibis", "hilton", "marriott", "ghl ", "decameron", "cruz verde", "farmatodo", "la rebaja", "locatel", "sodimac", "pricesmart", "qbano", "kokoriko", "wok", "bbc ", "andres carne", "comfenalco", "via baloto", "efecty", "oma ", "pan pa ya", "home burgers", "el portal de la 80", "cine colombia"]
export const esCadena = (nombre: string) => CADENAS.some((c) => sinTildes(nombre).includes(c))

/** Lo que se resalta del negocio al hablarle: buenas reseñas, que no tiene página. */
export function fortalezas(p: { estadoWeb: string; resenas: number; calificacion?: number | null }) {
  const partes: string[] = []
  const cal = p.calificacion ?? 0
  if (cal >= 4.5 && p.resenas >= 20) partes.push(`Muy bien calificado (${cal.toLocaleString("es-CO")} con ${p.resenas} reseñas)`)
  else if (p.resenas >= 50) partes.push(`Negocio con movimiento (${p.resenas} reseñas)`)
  else if (p.resenas > 0 && p.resenas < 10) partes.push("Pocas reseñas: le sirve aparecer mejor en Google")
  if (p.estadoWeb === "sin-pagina") partes.push("No tiene página web")
  else if (p.estadoWeb === "solo-redes") partes.push("Solo tiene redes sociales, sin página propia ni pedidos o reservas en línea")
  return partes.join(". ")
}

/** Primer mensaje por WhatsApp: corto, con el enlace a la demo de su sector. */
export function mensajeDeEntrada(p: { nombre: string; ficha?: string | null }) {
  const ruta = p.ficha ? `/soluciones/${p.ficha}` : "/"
  return `Hola, ¿hablo con ${p.nombre}? Soy Duvan, de Axchi: hago páginas web y sistemas para negocios. Vi su negocio en Google y armé un ejemplo de cómo funcionaría para uno como el suyo: https://axchisan.com${ruta}?utm_source=whatsapp&utm_campaign=prospeccion ¿Le puedo contar en dos minutos qué incluye?`
}

/** Distancia en km entre dos puntos (haversine). */
export function distanciaKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = (g: number) => (g * Math.PI) / 180
  const dLat = r(b.lat - a.lat)
  const dLng = r(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}
