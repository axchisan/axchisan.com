"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { registrarEvento } from "@/lib/eventos"

/**
 * Mide el embudo: visitas a las páginas que venden, aperturas de demo y clics
 * a WhatsApp. Una visita por ruta y pestaña, para no inflar las cifras al
 * recargar.
 */
export function Medicion() {
  const ruta = usePathname()

  useEffect(() => {
    if (/^\/(admin|auth)/.test(ruta)) return
    // Dentro de una demo solo cuenta la entrada, no cada pantalla.
    const demo = ruta.match(/^\/demo\/([^/]+)/)?.[1]
    const clave = `axchi-medido:${demo ? `demo:${demo}` : ruta}`
    try {
      if (sessionStorage.getItem(clave)) return
      sessionStorage.setItem(clave, "1")
    } catch {}
    registrarEvento(demo ? "demo" : "visita", demo)
  }, [ruta])

  useEffect(() => {
    function alHacerClic(e: MouseEvent) {
      const enlace = (e.target as Element | null)?.closest?.("a[href*='wa.me']")
      if (enlace) registrarEvento("whatsapp")
    }
    document.addEventListener("click", alHacerClic, { capture: true })
    return () => document.removeEventListener("click", alHacerClic, { capture: true })
  }, [])

  return null
}
