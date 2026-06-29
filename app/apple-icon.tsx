import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** Apple touch icon: monograma de marca con glow. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0B0D",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 160,
            height: 160,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(198,242,78,0.22), transparent 60%)",
          }}
        />
        <div style={{ display: "flex", fontSize: 118, fontWeight: 700, color: "#C6F24E", fontFamily: "sans-serif", lineHeight: 1 }}>
          a
        </div>
        <div style={{ position: "absolute", right: 30, top: 38, width: 22, height: 22, borderRadius: 6, background: "#C6F24E" }} />
      </div>
    ),
    { ...size },
  )
}
