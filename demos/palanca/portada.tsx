"use client"

import { MessageCircle } from "lucide-react"
import { useDemo } from "@/demos/comun/contexto"
import { Punto } from "@/demos/comun/recorrido"
import { BotonWhatsappPalanca } from "./publico"

/** Con el plan de página, la clase gratis se pide por WhatsApp; con reservas, en el horario. */
export function AccionesPortada() {
  const { incluye } = useDemo()
  return (
    <div className="flex flex-wrap gap-3">
      {incluye("reservas") ? (
        <Punto id="reservar-portada">
          <a href="#horario" className="inline-flex h-12 items-center rounded-[4px] bg-pa-rojo px-6 font-bold text-white hover:bg-pa-rojo-2">
            Reservar mi clase gratis
          </a>
        </Punto>
      ) : (
        <BotonWhatsappPalanca className="inline-flex h-12 items-center gap-2 rounded-[4px] bg-pa-rojo px-6 font-bold text-white hover:bg-pa-rojo-2" mensaje="Hola, Palanca. Quiero mi primera clase gratis.">
          <MessageCircle className="h-5 w-5" aria-hidden />
          Pedir mi clase gratis
        </BotonWhatsappPalanca>
      )}
      <a href="#planes" className="inline-flex h-12 items-center rounded-[4px] border-2 border-white px-6 font-bold text-white hover:bg-white hover:text-pa-hierro">
        Ver planes
      </a>
    </div>
  )
}
