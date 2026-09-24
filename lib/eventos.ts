/**
 * Los pasos del embudo que se miden. Sin cookies ni identificadores: cada
 * evento es una fila con su ruta, y la IP se guarda seudonimizada (ver
 * lib/analytics.ts). Sirve para saber qué ficha o demo termina en contacto.
 */
export const EVENTOS = ["visita", "demo", "whatsapp", "cotizacion"] as const
export type Evento = (typeof EVENTOS)[number]

/** Registra un evento sin bloquear nada: si falla, no pasa nada. */
export function registrarEvento(evento: Evento, detalle?: string) {
  if (typeof window === "undefined") return
  const cuerpo = JSON.stringify({ evento, ruta: window.location.pathname, detalle })
  try {
    // sendBeacon sobrevive a que la página se cierre, que es justo lo que pasa
    // al tocar un enlace de WhatsApp en el celular.
    if (navigator.sendBeacon?.("/api/eventos", new Blob([cuerpo], { type: "application/json" }))) return
    void fetch("/api/eventos", { method: "POST", body: cuerpo, headers: { "Content-Type": "application/json" }, keepalive: true })
  } catch {}
}
