"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"

type EventoInstalar = Event & { prompt: () => Promise<void> }

/**
 * Instalar la app en el celular. En Chrome y Android el navegador ofrece el
 * aviso de instalación; en iPhone se explica cómo agregarla a la pantalla de
 * inicio, que es lo único que Safari permite.
 */
export function Instalar() {
  const [evento, setEvento] = useState<EventoInstalar | null>(null)
  const [instalada, setInstalada] = useState(false)
  useEffect(() => {
    const alOfrecer = (e: Event) => {
      e.preventDefault()
      setEvento(e as EventoInstalar)
    }
    const alInstalar = () => setInstalada(true)
    addEventListener("beforeinstallprompt", alOfrecer)
    addEventListener("appinstalled", alInstalar)
    return () => {
      removeEventListener("beforeinstallprompt", alOfrecer)
      removeEventListener("appinstalled", alInstalar)
    }
  }, [])

  if (instalada) return <p className="text-[0.9375rem] font-medium text-cb-exito">Listo: la app quedó en tu pantalla de inicio.</p>
  return (
    <div className="rounded-[14px] border border-cb-linea bg-white p-4">
      <p className="flex items-center gap-2 font-semibold">
        <Download className="h-4 w-4 text-cb-cafeto" aria-hidden />
        Se instala como una app
      </p>
      {evento ? (
        <button type="button" onClick={() => void evento.prompt()} className="mt-3 h-10 rounded-full bg-cb-cafeto px-5 text-[0.9375rem] font-semibold text-white hover:bg-cb-cafeto-2">
          Instalar en este dispositivo
        </button>
      ) : (
        <p className="mt-1.5 text-[0.9375rem] text-cb-gris">
          Sin pasar por la tienda de aplicaciones. En el iPhone: botón Compartir de Safari y «Agregar a inicio». En Android: menú de Chrome e «Instalar aplicación».
        </p>
      )}
    </div>
  )
}
