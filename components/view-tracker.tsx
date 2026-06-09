"use client"

import { useEffect, useRef } from "react"

interface ViewTrackerProps {
  /** Endpoint POST que registra la vista, p.ej. `/api/projects/<id>/view` */
  endpoint: string
  /** Clave única para no recontar en la misma sesión */
  storageKey: string
}

/**
 * Registra una visita (POST fire-and-forget) una sola vez por sesión de navegador.
 * No renderiza nada. Evita el doble disparo de React StrictMode con un ref.
 */
export function ViewTracker({ endpoint, storageKey }: ViewTrackerProps) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    try {
      const key = `viewed:${storageKey}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, "1")
    } catch {
      // sessionStorage no disponible: seguimos igualmente
    }

    fetch(endpoint, { method: "POST", keepalive: true }).catch(() => {})
  }, [endpoint, storageKey])

  return null
}
