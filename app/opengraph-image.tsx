import { ImageResponse } from "next/og"
import { PROFILE, SITE_NAME } from "@/lib/site"

export const runtime = "nodejs"
export const alt = `${SITE_NAME} — ${PROFILE.role}`
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
          background: "#14171c",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
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
            {SITE_NAME}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 36, color: "#98a1b0" }}>
            {PROFILE.role} en {PROFILE.location}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #363c45",
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", fontSize: 30, color: "#c6cdd8", maxWidth: 900, lineHeight: 1.4 }}>
            Sistemas completos, del modelo de datos al despliegue.
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 26, color: "#6b7480" }}>
            axchisan.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
