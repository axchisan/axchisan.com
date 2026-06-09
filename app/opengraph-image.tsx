import { ImageResponse } from "next/og"

export const alt = "Axchi — Desarrollador de Software · DevOps & IA"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Imagen Open Graph generada por código (on-brand Aurora Tech: near-black +
// gradiente violeta→cian). Next la usa como og:image / twitter:image por defecto.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: "#09090B",
          padding: "72px",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Glows aurora */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0) 70%)",
          }}
        />
        {/* Top: dominio */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <div style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: "#06B6D4" }} />
          <div style={{ color: "#A1A1AA", fontSize: 28, letterSpacing: 1 }}>axchisan.com</div>
        </div>

        {/* Centro: logo + nombre */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
                boxShadow: "0 20px 60px -20px rgba(139,92,246,0.7)",
              }}
            >
              <div style={{ color: "white", fontSize: 64, fontWeight: 800 }}>A</div>
            </div>
            <div
              style={{
                fontSize: 108,
                fontWeight: 800,
                background: "linear-gradient(135deg, #C4B5FD, #67E8F9)",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1,
              }}
            >
              Axchi
            </div>
          </div>

          <div style={{ color: "#FAFAFA", fontSize: 52, fontWeight: 700, maxWidth: 900, lineHeight: 1.15 }}>
            Duvan Yair Arciniegas
          </div>
          <div style={{ color: "#A1A1AA", fontSize: 38, fontWeight: 500 }}>
            Desarrollador de Software · DevOps · CI/CD · IA
          </div>
        </div>

        {/* Bottom: ubicación */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 9999,
              border: "1px solid rgba(139,92,246,0.4)",
              color: "#D4D4D8",
              fontSize: 28,
              display: "flex",
            }}
          >
            Bogotá, Colombia
          </div>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 9999,
              border: "1px solid rgba(6,182,212,0.4)",
              color: "#D4D4D8",
              fontSize: 28,
              display: "flex",
            }}
          >
            Clientes reales
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
