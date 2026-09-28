/**
 * Liquidación de un contrato a término indefinido con salario ordinario, como
 * la calcula un abogado laboralista en la primera consulta. Es orientativa: no
 * cubre salario integral, horas extra, comisiones ni cesantías de años
 * anteriores sin consignar, que cambian la base.
 */
import { aFecha } from "@/demos/motores/agenda/tiempo"

/** Decretos 1469 y 1470 de 2025. */
export const SMMLV_2026 = 1_750_905
export const AUXILIO_TRANSPORTE_2026 = 249_095

export type Motivo = "renuncia" | "despido" | "justa-causa"

export const MOTIVOS: Record<Motivo, string> = {
  renuncia: "Renuncié",
  despido: "Me despidieron sin justa causa",
  "justa-causa": "Me despidieron con justa causa",
}

const esUltimoDelMes = (f: Date) => new Date(f.getFullYear(), f.getMonth(), f.getDate() + 1).getDate() === 1

/**
 * Días entre dos fechas, ambas incluidas, con meses de 30 días: la cuenta
 * laboral en Colombia. El último día de cualquier mes cuenta como el 30.
 */
export function dias360(desde: string, hasta: string) {
  const a = aFecha(desde)
  const b = aFecha(hasta)
  const d1 = esUltimoDelMes(a) ? 30 : Math.min(a.getDate(), 30)
  const d2 = esUltimoDelMes(b) ? 30 : Math.min(b.getDate(), 30)
  return (b.getFullYear() - a.getFullYear()) * 360 + (b.getMonth() - a.getMonth()) * 30 + (d2 - d1) + 1
}

const mayor = (a: string, b: string) => (a > b ? a : b)

export type Concepto = { id: string; nombre: string; dias: number; valor: number; nota: string }

export type Liquidacion = {
  diasTrabajados: number
  conAuxilio: boolean
  base: number
  conceptos: Concepto[]
  total: number
}

export function liquidar(e: { salario: number; ingreso: string; retiro: string; motivo: Motivo }): Liquidacion {
  const { salario, ingreso, retiro, motivo } = e
  const año = retiro.slice(0, 4)
  const conAuxilio = salario <= 2 * SMMLV_2026
  const base = salario + (conAuxilio ? AUXILIO_TRANSPORTE_2026 : 0)

  // Las cesantías de años anteriores ya se consignaron al fondo; se liquida el año en curso.
  const diasCesantias = dias360(mayor(ingreso, `${año}-01-01`), retiro)
  const cesantias = (base * diasCesantias) / 360
  const intereses = (cesantias * 0.12 * diasCesantias) / 360

  const semestre = retiro.slice(5, 7) <= "06" ? `${año}-01-01` : `${año}-07-01`
  const diasPrima = dias360(mayor(ingreso, semestre), retiro)
  const prima = (base * diasPrima) / 360

  // Vacaciones del periodo en curso, desde el último aniversario del contrato.
  const aniversarioEsteAño = `${año}-${ingreso.slice(5)}`
  const ultimoAniversario = aniversarioEsteAño <= retiro ? aniversarioEsteAño : `${Number(año) - 1}-${ingreso.slice(5)}`
  const diasVacaciones = dias360(mayor(ingreso, ultimoAniversario), retiro)
  const vacaciones = (salario * diasVacaciones) / 720

  const diasTrabajados = dias360(ingreso, retiro)
  const conceptos: Concepto[] = [
    { id: "cesantias", nombre: "Cesantías", dias: diasCesantias, valor: cesantias, nota: "Un mes de salario por año, del año en curso." },
    { id: "intereses", nombre: "Intereses sobre cesantías", dias: diasCesantias, valor: intereses, nota: "El 12 % anual sobre las cesantías." },
    { id: "prima", nombre: "Prima de servicios", dias: diasPrima, valor: prima, nota: "Medio mes por semestre, del semestre en curso." },
    { id: "vacaciones", nombre: "Vacaciones", dias: diasVacaciones, valor: vacaciones, nota: "Quince días hábiles por año, sin el auxilio de transporte." },
  ]

  if (motivo === "despido") {
    // Artículo 64 del Código Sustantivo del Trabajo, contrato a término indefinido.
    const alto = salario >= 10 * SMMLV_2026
    const primero = alto ? 20 : 30
    const adicional = alto ? 15 : 20
    const años = diasTrabajados / 360
    const diasIndemnizacion = años <= 1 ? primero : primero + adicional * (años - 1)
    conceptos.push({
      id: "indemnizacion",
      nombre: "Indemnización por despido sin justa causa",
      dias: Math.round(diasIndemnizacion),
      valor: (salario / 30) * diasIndemnizacion,
      nota: alto ? "Veinte días el primer año y quince por cada año siguiente." : "Treinta días el primer año y veinte por cada año siguiente.",
    })
  }

  const redondeados = conceptos.map((c) => ({ ...c, valor: Math.round(c.valor) }))
  return { diasTrabajados, conAuxilio, base, conceptos: redondeados, total: redondeados.reduce((t, c) => t + c.valor, 0) }
}
