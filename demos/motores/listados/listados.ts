/**
 * Motor de listados: fichas con filtros que viven en la dirección de la página
 * (para compartir una búsqueda por WhatsApp), orden y un simulador de crédito.
 * Lo usa la inmobiliaria Nomenclatura y sirve igual para un concesionario de
 * carros usados o un directorio de fincas para alquilar.
 */

export type Rango = { min?: number; max?: number }

export const enRango = (valor: number, r: Rango) => (r.min === undefined || valor >= r.min) && (r.max === undefined || valor <= r.max)

/** Lee un número de los parámetros de la dirección; vacío o inválido es "sin filtro". */
export function numeroDe(params: URLSearchParams, clave: string) {
  const v = Number(params.get(clave))
  return params.get(clave) && Number.isFinite(v) ? v : undefined
}

/** Escribe los filtros en la dirección, sin los vacíos, para que el enlace se pueda compartir. */
export function aParams(filtros: Record<string, string | number | undefined | null>) {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(filtros)) if (v !== undefined && v !== null && v !== "") p.set(k, String(v))
  return p
}

/**
 * Cuota mensual de un crédito de vivienda a cuota fija. La tasa se da como
 * efectiva anual, que es como la publican los bancos en Colombia.
 */
export function cuotaMensual(monto: number, tasaEA: number, años: number) {
  const i = (1 + tasaEA) ** (1 / 12) - 1
  const n = años * 12
  return i === 0 ? monto / n : (monto * i) / (1 - (1 + i) ** -n)
}

/** Los bancos prestan si la cuota no pasa del 30 % de los ingresos del hogar. */
export const ingresosNecesarios = (cuota: number, tope = 0.3) => cuota / tope
