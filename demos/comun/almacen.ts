"use client"

import { useSyncExternalStore } from "react"

/**
 * Estado de una demo guardado en el navegador del visitante.
 *
 * Las demos no tienen backend a propósito: cuestan cero, nadie puede
 * estropearle la demo a otro y no hay datos personales que proteger. Lo que el
 * visitante cambia vive en su `localStorage` hasta que pulsa "Restablecer".
 *
 * En el servidor, y durante la hidratación, el valor es `null`: las fechas de
 * la demo dependen del día y de la hora del visitante, y calcularlas en el
 * servidor produciría un HTML distinto del que pinta el navegador.
 */
export type Almacen<T> = {
  suscribir: (oyente: () => void) => () => void
  leer: () => T
  escribir: (siguiente: T | ((actual: T) => T)) => void
  restablecer: () => void
}

/**
 * `ajustar` corre sobre lo que se lee del almacenamiento antes de usarlo. Sirve
 * para que una demo abierta hace una semana no muestre una agenda vieja.
 */
export function crearAlmacen<T>(
  clave: string,
  inicial: () => T,
  ajustar?: (guardado: T) => T,
): Almacen<T> {
  const oyentes = new Set<() => void>()
  let cache: T | undefined

  function leer(): T {
    if (cache !== undefined) return cache
    try {
      const guardado = localStorage.getItem(clave)
      if (guardado) {
        const leido = JSON.parse(guardado) as T
        cache = ajustar ? ajustar(leido) : leido
        return cache
      }
    } catch {
      // Navegación privada, almacenamiento bloqueado o JSON corrupto: se
      // arranca de cero sin romper la demo.
    }
    cache = inicial()
    return cache
  }

  function avisar() {
    for (const o of oyentes) o()
  }

  function escribir(siguiente: T | ((actual: T) => T)) {
    cache = typeof siguiente === "function" ? (siguiente as (a: T) => T)(leer()) : siguiente
    try {
      localStorage.setItem(clave, JSON.stringify(cache))
    } catch {
      // Sin almacenamiento la demo sigue funcionando; solo no recuerda.
    }
    avisar()
  }

  function restablecer() {
    try {
      localStorage.removeItem(clave)
    } catch {}
    cache = undefined
    avisar()
  }

  function suscribir(oyente: () => void) {
    oyentes.add(oyente)
    // Otra pestaña con la misma demo abierta: mantenerlas iguales.
    const alCambiarOtraPestana = (e: StorageEvent) => {
      if (e.key === clave) {
        cache = undefined
        oyente()
      }
    }
    window.addEventListener("storage", alCambiarOtraPestana)
    return () => {
      oyentes.delete(oyente)
      window.removeEventListener("storage", alCambiarOtraPestana)
    }
  }

  return { suscribir, leer, escribir, restablecer }
}

const enServidor = () => null

/** Valor actual del almacén; `null` en el servidor y durante la hidratación. */
export function useAlmacen<T>(almacen: Almacen<T>): T | null {
  return useSyncExternalStore(almacen.suscribir, almacen.leer, enServidor)
}
