/**
 * ¿Tengo que declarar renta en 2026? Topes del año gravable 2025 para personas
 * naturales residentes, que se calculan con la UVT de 2025 (artículos 592 a
 * 594-3 del Estatuto Tributario). Basta con cumplir uno para estar obligado.
 */

export const UVT_2025 = 49_799

export type DatosRenta = {
  patrimonio: number
  ingresos: number
  tarjeta: number
  compras: number
  consignaciones: number
}

type Tope = { id: keyof DatosRenta; nombre: string; uvt: number; /** Si el tope mismo ya obliga. */ inclusive: boolean }

export const TOPES: Tope[] = [
  { id: "patrimonio", nombre: "Patrimonio bruto al 31 de diciembre de 2025", uvt: 4_500, inclusive: false },
  { id: "ingresos", nombre: "Ingresos brutos de 2025", uvt: 1_400, inclusive: true },
  { id: "tarjeta", nombre: "Consumos con tarjeta de crédito", uvt: 1_400, inclusive: false },
  { id: "compras", nombre: "Compras y consumos totales", uvt: 1_400, inclusive: false },
  { id: "consignaciones", nombre: "Consignaciones, depósitos e inversiones", uvt: 1_400, inclusive: false },
]

export const enPesos = (uvt: number) => uvt * UVT_2025

export function debeDeclarar(d: DatosRenta) {
  const revision = TOPES.map((t) => {
    const tope = enPesos(t.uvt)
    const valor = d[t.id]
    return { ...t, tope, valor, supera: t.inclusive ? valor >= tope : valor > tope }
  })
  return { debe: revision.some((r) => r.supera), revision }
}
