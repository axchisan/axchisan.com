/**
 * Motor de presencia: lo que necesita una página de servicios profesionales
 * para recibir contactos buenos. Validación de formularios con los formatos de
 * Colombia, número de radicado y horario de atención. Lo usa la firma Rojas &
 * Duarte y sirve igual para una constructora, un consultorio o una notaría.
 */

export type Errores<C extends string> = Partial<Record<C, string>>

/** Celular colombiano: diez dígitos que empiezan por 3. Acepta espacios, guiones y el +57. */
export function limpiarCelular(texto: string) {
  const d = texto.replace(/\D/g, "")
  return d.length === 12 && d.startsWith("57") ? d.slice(2) : d
}

export function celularValido(texto: string) {
  return /^3\d{9}$/.test(limpiarCelular(texto))
}

/** `300 123 4567`: como se dicta un celular en Colombia. */
export function textoCelular(texto: string) {
  const d = limpiarCelular(texto)
  return d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : texto
}

export function correoValido(texto: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto.trim())
}

/**
 * Las reglas de un formulario, campo por campo. Cada una devuelve el mensaje
 * de error o nada. Los mensajes dicen qué hacer, no solo qué está mal.
 */
export type Reglas<V, C extends string> = Record<C, (valores: V) => string | undefined>

export function validar<V, C extends string>(valores: V, reglas: Reglas<V, C>): Errores<C> {
  const errores: Errores<C> = {}
  for (const campo of Object.keys(reglas) as C[]) {
    const e = reglas[campo](valores)
    if (e) errores[campo] = e
  }
  return errores
}

const dos = (n: number) => String(n).padStart(2, "0")

/**
 * Número de radicado para que el cliente cite su consulta: prefijo, fecha y
 * hora. `RD-260928-1432`. No se repite en la práctica para una firma pequeña.
 */
export function radicado(prefijo: string, fecha: Date) {
  const f = `${String(fecha.getFullYear()).slice(2)}${dos(fecha.getMonth() + 1)}${dos(fecha.getDate())}`
  return `${prefijo}-${f}-${dos(fecha.getHours())}${dos(fecha.getMinutes())}`
}
