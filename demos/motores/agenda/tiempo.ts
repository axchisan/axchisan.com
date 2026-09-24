/**
 * Fechas del motor de agenda. Se guardan como texto en hora local:
 * `AAAA-MM-DD` para días y `AAAA-MM-DDTHH:mm` para instantes. Las demos no
 * cruzan zonas horarias, y así lo que se guarda es exactamente lo que se ve.
 */

const dos = (n: number) => String(n).padStart(2, "0")

export function claveDia(d: Date) {
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`
}

export function claveInstante(d: Date) {
  return `${claveDia(d)}T${dos(d.getHours())}:${dos(d.getMinutes())}`
}

/** Interpreta `AAAA-MM-DD` o `AAAA-MM-DDTHH:mm` como hora local. */
export function aFecha(clave: string) {
  const [dia, hora = "00:00"] = clave.split("T")
  const [a, m, d] = dia.split("-").map(Number)
  const [h, min] = hora.split(":").map(Number)
  return new Date(a, m - 1, d, h, min)
}

export function sumarDias(clave: string, dias: number) {
  const f = aFecha(clave)
  f.setDate(f.getDate() + dias)
  return clave.includes("T") ? claveInstante(f) : claveDia(f)
}

export function sumarMinutos(clave: string, minutos: number) {
  return claveInstante(new Date(aFecha(clave).getTime() + minutos * 60_000))
}

export function diasEntre(desde: string, hasta: string) {
  const a = aFecha(desde.slice(0, 10))
  const b = aFecha(hasta.slice(0, 10))
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

const fmtDia = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" })

export function textoDia(clave: string) {
  const t = fmtDia.format(aFecha(clave))
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

/** `4 ago 2026`: corta, para tablas y listas. */
export function textoFecha(clave: string) {
  const f = aFecha(clave)
  return `${f.getDate()} ${MESES[f.getMonth()]} ${f.getFullYear()}`
}

/**
 * `8:30 a. m.`: el formato de hora que se usa en Colombia. Con espacios de no
 * separación, para que "p. m." nunca quede sola en la línea siguiente.
 */
export function textoHora(clave: string) {
  const f = aFecha(clave)
  const h = f.getHours()
  const sufijo = h < 12 ? "a. m." : "p. m."
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${dos(f.getMinutes())} ${sufijo}`
}

export function textoHoraDecimal(h: number) {
  const f = new Date(2000, 0, 1, Math.floor(h), Math.round((h % 1) * 60))
  return textoHora(claveInstante(f))
}

/** Franja de citas de un día de la semana, en horas decimales. */
export type Franja = { desde: number; hasta: number } | null

/** Inicios posibles de cita cada media hora dentro de la franja del día. */
export function franjasDelDia(dia: string, franjas: Record<number, Franja>) {
  const f = franjas[aFecha(dia).getDay()]
  if (!f) return []
  const out: string[] = []
  for (let h = f.desde; h <= f.hasta; h += 0.5) {
    out.push(`${dia}T${dos(Math.floor(h))}:${h % 1 ? "30" : "00"}`)
  }
  return out
}

/**
 * Hasta cuándo puede terminar una cita ese día: media hora después del último
 * inicio posible. `null` si ese día no se atiende.
 */
export function finDeFranja(dia: string, franjas: Record<number, Franja>) {
  const f = franjas[aFecha(dia).getDay()]
  if (!f) return null
  const fin = f.hasta + 0.5
  return `${dia}T${dos(Math.floor(fin))}:${fin % 1 ? "30" : "00"}`
}

/** Ahora más un margen: nadie agenda para dentro de cinco minutos. */
export function ahoraConMargen(minutos = 30) {
  const d = new Date()
  d.setMinutes(d.getMinutes() + minutos)
  return claveInstante(d)
}

/** Mulberry32: pseudoaleatorio pequeño y reproducible, para los datos de ejemplo. */
export function generador(semilla: number) {
  let a = semilla >>> 0
  const siguiente = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    n: siguiente,
    entero: (min: number, max: number) => min + Math.floor(siguiente() * (max - min + 1)),
    uno: <T,>(xs: readonly T[]) => xs[Math.floor(siguiente() * xs.length)],
    prob: (p: number) => siguiente() < p,
  }
}
