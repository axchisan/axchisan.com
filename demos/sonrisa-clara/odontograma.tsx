"use client"

import type { MouseEvent } from "react"
import { ARCADA_INFERIOR, ARCADA_SUPERIOR, CARAS, nombreDiente, type Cara, type Diente, type Odontograma } from "./modelo"

const ROJO = "var(--color-mo-rojo)"
const AZUL = "var(--color-mo-azul)"

/** Polígonos de las cinco caras en un diente de 40 × 40, visto de frente en el esquema. */
const POLIGONOS = {
  arriba: "0,0 40,0 28,12 12,12",
  abajo: "0,40 12,28 28,28 40,40",
  izquierda: "0,0 12,12 12,28 0,40",
  derecha: "40,0 40,40 28,28 28,12",
}

/**
 * Qué cara queda en cada lado del dibujo. Vestibular mira hacia afuera de la
 * boca (arriba en la arcada superior, abajo en la inferior) y mesial hacia la
 * línea media.
 */
function lados(n: number): Record<keyof typeof POLIGONOS, Cara> {
  const cuadrante = Math.floor(n / 10)
  const superior = cuadrante === 1 || cuadrante === 2
  const derechaPaciente = cuadrante === 1 || cuadrante === 4
  return {
    arriba: superior ? "V" : "L",
    abajo: superior ? "L" : "V",
    izquierda: derechaPaciente ? "D" : "M",
    derecha: derechaPaciente ? "M" : "D",
  }
}

const relleno = (d: Diente | undefined, c: Cara) => (d?.caras?.[c] === "caries" ? ROJO : d?.caras?.[c] === "resina" ? AZUL : "#fff")

/** Lo que tiene un diente, en palabras, para el lector de pantalla y el título. */
export function describir(n: number, d?: Diente) {
  const partes: string[] = []
  if (d?.pieza === "ausente") partes.push("ausente")
  if (d?.pieza === "extraccion") partes.push("extracción indicada")
  if (d?.pieza === "endodoncia") partes.push("endodoncia indicada")
  if (d?.pieza === "endodoncia-hecha") partes.push("con endodoncia")
  if (d?.pieza === "corona") partes.push("corona indicada")
  if (d?.pieza === "corona-hecha") partes.push("con corona")
  const caries = (Object.entries(d?.caras ?? {}) as [Cara, string][]).filter(([, h]) => h === "caries").map(([c]) => CARAS[c])
  const resinas = (Object.entries(d?.caras ?? {}) as [Cara, string][]).filter(([, h]) => h === "resina").map(([c]) => CARAS[c])
  if (caries.length) partes.push(`caries en ${caries.join(", ")}`)
  if (resinas.length) partes.push(`resina en ${resinas.join(", ")}`)
  return `Diente ${n}, ${nombreDiente(n)}: ${partes.length ? partes.join("; ") : "sano"}`
}

function DibujoDiente({ n, d }: { n: number; d?: Diente }) {
  const l = lados(n)
  const ausente = d?.pieza === "ausente"
  const colorPieza = d?.pieza?.endsWith("-hecha") ? AZUL : ROJO
  return (
    <svg viewBox="-4 -4 48 48" className="h-full w-full" aria-hidden>
      <g opacity={ausente ? 0.35 : 1} stroke="var(--color-mo-tinta)" strokeWidth="1" strokeLinejoin="round">
        {(Object.keys(POLIGONOS) as (keyof typeof POLIGONOS)[]).map((k) => (
          <polygon key={k} points={POLIGONOS[k]} fill={relleno(d, l[k])} data-cara={l[k]} />
        ))}
        <rect x="12" y="12" width="16" height="16" fill={relleno(d, "O")} data-cara="O" />
      </g>
      {(ausente || d?.pieza === "extraccion") && (
        <g stroke={ausente ? "var(--color-mo-gris)" : ROJO} strokeWidth="3.5" strokeLinecap="round" pointerEvents="none">
          <line x1="2" y1="2" x2="38" y2="38" />
          <line x1="38" y1="2" x2="2" y2="38" />
        </g>
      )}
      {(d?.pieza === "corona" || d?.pieza === "corona-hecha") && <circle cx="20" cy="20" r="22" fill="none" stroke={colorPieza} strokeWidth="3" pointerEvents="none" />}
      {(d?.pieza === "endodoncia" || d?.pieza === "endodoncia-hecha") && (
        <line x1="20" y1="-3" x2="20" y2="43" stroke={colorPieza} strokeWidth="4" strokeLinecap="round" pointerEvents="none" />
      )}
    </svg>
  )
}

/**
 * El odontograma completo, con numeración FDI. Si recibe `alTocar`, cada diente
 * es un botón: con el puntero se marca la cara tocada; con el teclado, el
 * diente entero (o su cara oclusal, si la herramienta es de cara).
 */
export function OdontogramaSvg({ odontograma, alTocar }: { odontograma: Odontograma; alTocar?: (diente: number, cara?: Cara) => void }) {
  const fila = (dientes: number[], superior: boolean) => (
    <div className="flex items-end justify-center gap-0.5 sm:gap-1">
      {dientes.map((n, i) => {
        const d = odontograma[n]
        const numero = <span className="block text-center text-[0.6875rem] font-semibold text-mo-gris tabular-nums">{n}</span>
        const contenido = (
          <>
            {superior && numero}
            <span className="block h-8 w-8 sm:h-10 sm:w-10">
              <DibujoDiente n={n} d={d} />
            </span>
            {!superior && numero}
          </>
        )
        return (
          <div key={n} className={`flex ${i === 8 ? "ml-2 sm:ml-4" : ""}`}>
            {alTocar ? (
              <button
                type="button"
                aria-label={describir(n, d)}
                title={describir(n, d)}
                onClick={(ev: MouseEvent<HTMLButtonElement>) => {
                  const cara = (ev.target as Element).getAttribute?.("data-cara") as Cara | null
                  alTocar(n, ev.detail === 0 ? undefined : (cara ?? undefined))
                }}
                className="rounded-[6px] p-0.5 hover:bg-mo-lila focus-visible:outline-2 focus-visible:outline-mo-violeta"
              >
                {contenido}
              </button>
            ) : (
              <div role="img" aria-label={describir(n, d)} className="p-0.5">
                {contenido}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
  return (
    <div className="space-y-3">
      {fila(ARCADA_SUPERIOR, true)}
      <div className="mx-auto h-px max-w-[46rem] bg-mo-linea" aria-hidden />
      {fila(ARCADA_INFERIOR, false)}
    </div>
  )
}
