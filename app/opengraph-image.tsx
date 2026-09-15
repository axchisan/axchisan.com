import { ImageResponse } from "next/og"
import { PROFILE, SITE_NAME } from "@/lib/site"

export const runtime = "nodejs"
export const alt = `${SITE_NAME} — ${PROFILE.role} en Bogotá`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Tarjeta que se ve al compartir el enlace. Es lo primero que aparece en un
 * mensaje de LinkedIn o WhatsApp, así que dice quién y qué, sin decoración.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0f14",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 36 }}>
            <svg width="52" height="52" viewBox="0 0 32 32">
              <path d="M5.5 27 12.4 5h7.2L26.5 27" stroke="#0ea5a5" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M10.2 20.2h11.6" stroke="#0ea5a5" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span style={{ display: "flex", fontSize: 40, fontWeight: 600, color: "#ffffff", letterSpacing: -1 }}>
              Axchi
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 600,
              color: "#fcfcfd",
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            Software a medida para empresas
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#9aa7b5" }}>
            Aplicaciones, automatización e integración de IA
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #1e2630",
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#c6cdd8", maxWidth: 900, lineHeight: 1.4 }}>
            Del modelo de datos al despliegue. Alcance y precio cerrados antes de empezar.
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 26, color: "#0ea5a5" }}>
            axchisan.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
