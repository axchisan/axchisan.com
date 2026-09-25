"use client"

import { useSyncExternalStore } from "react"

/**
 * La hora actual, al minuto, compartida por todos los componentes de una demo.
 * `null` en el servidor y durante la hidratación: "abierto ahora" o "hace 12
 * minutos" dependen del reloj del visitante, no del servidor.
 */
let ahora = 0
const oyentes = new Set<() => void>()
let temporizador: ReturnType<typeof setInterval> | undefined

function suscribir(oyente: () => void) {
  oyentes.add(oyente)
  if (!temporizador) {
    temporizador = setInterval(() => {
      ahora = Date.now()
      for (const o of oyentes) o()
    }, 15_000)
  }
  return () => {
    oyentes.delete(oyente)
    if (oyentes.size === 0 && temporizador) {
      clearInterval(temporizador)
      temporizador = undefined
    }
  }
}

const leer = () => ahora || (ahora = Date.now())

export function useAhora(): Date | null {
  const t = useSyncExternalStore(suscribir, leer, () => 0)
  return t ? new Date(t) : null
}
