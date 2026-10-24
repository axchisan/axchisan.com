"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import type { Map as MapaLeaflet, LayerGroup } from "leaflet"

export type PuntoMapa = { id: string; nombre: string; lat: number; lng: number; prioridad: string; estado: string }

const COLOR: Record<string, string> = { A: "#0b7c7c", B: "#b7791f", C: "#8a94a3" }

/**
 * Mapa de prospectos sobre OpenStreetMap: sin clave ni costo por uso. Cada
 * punto es un negocio; el color dice su prioridad y el borde, si ya se
 * contactó. Leaflet necesita `window`, así que se carga en el efecto.
 */
export function MapaProspectos({ puntos, seleccionado, alElegir, base }: { puntos: PuntoMapa[]; seleccionado: string | null; alElegir: (id: string) => void; base?: { lat: number; lng: number } | null }) {
  const caja = useRef<HTMLDivElement>(null)
  const mapa = useRef<MapaLeaflet | null>(null)
  const capa = useRef<LayerGroup | null>(null)
  const encuadrado = useRef(false)

  useEffect(() => {
    let vivo = true
    void import("leaflet").then((L) => {
      if (!vivo || !caja.current || mapa.current) return
      mapa.current = L.map(caja.current, { zoomControl: true }).setView([4.62, -74.1], 12)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa.current)
      capa.current = L.layerGroup().addTo(mapa.current)
      dibujar(L)
    })
    return () => {
      vivo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function dibujar(L: typeof import("leaflet")) {
    if (!mapa.current || !capa.current) return
    capa.current.clearLayers()
    if (base) L.circleMarker([base.lat, base.lng], { radius: 7, color: "#0f1720", weight: 3, fillColor: "#fff", fillOpacity: 1 }).bindTooltip("Base").addTo(capa.current)
    for (const p of puntos) {
      const elegido = p.id === seleccionado
      L.circleMarker([p.lat, p.lng], {
        radius: elegido ? 10 : 6,
        color: p.estado === "por-contactar" ? "#ffffff" : "#0f1720",
        weight: elegido ? 3 : 1.5,
        fillColor: COLOR[p.prioridad] ?? COLOR.C,
        fillOpacity: 0.9,
      })
        .bindTooltip(p.nombre)
        .on("click", () => alElegir(p.id))
        .addTo(capa.current)
    }
    if (!encuadrado.current && puntos.length) {
      mapa.current.fitBounds(L.latLngBounds(puntos.map((p) => [p.lat, p.lng])), { padding: [24, 24], maxZoom: 15 })
      encuadrado.current = true
    }
  }

  useEffect(() => {
    void import("leaflet").then((L) => dibujar(L))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puntos, seleccionado, base])

  return <div ref={caja} className="h-full min-h-[24rem] w-full rounded-[12px] border border-line" aria-label="Mapa de prospectos" role="region" />
}
