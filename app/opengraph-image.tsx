import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "Axchi Studio — Software que se siente extraordinario"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
          background: "#0A0B0D",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(198,242,78,0.20), transparent 60%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#C6F24E" }} />
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
            <span style={{ color: "#F4F5F7" }}>axchi</span>
            <span style={{ color: "#8A9099", fontWeight: 400 }}>/studio</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#C6F24E",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 22,
            }}
          >
            Studio de software · Bogotá
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -2,
              maxWidth: 920,
            }}
          >
            <span style={{ color: "#F4F5F7" }}>Construimos software que se siente</span>
            <span style={{ color: "#C6F24E" }}>&nbsp;extraordinario.</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, color: "#8A9099", fontSize: 24 }}>
          <span>Web</span>
          <span style={{ color: "#33373D" }}>·</span>
          <span>Multiplataforma</span>
          <span style={{ color: "#33373D" }}>·</span>
          <span>Automatización</span>
          <span style={{ color: "#33373D" }}>·</span>
          <span>IA</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
