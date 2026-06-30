"use client"

import { useEffect, useRef } from "react"

/**
 * Registra una visita (POST a `endpoint`) una sola vez al montar.
 * Silencioso: no bloquea ni afecta el render. Usa sessionStorage para no
 * recontar en navegaciones repetidas dentro de la misma sesión/pestaña.
 */
export function ViewTracker({ endpoint }: { endpoint: string }) {
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const key = `viewed:${endpoint}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, "1")
    } catch {
      // sessionStorage no disponible: igual registramos una vez por montaje.
    }

    const t = setTimeout(() => {
      fetch(endpoint, { method: "POST", keepalive: true }).catch(() => {})
    }, 1200)

    return () => clearTimeout(t)
  }, [endpoint])

  return null
}
