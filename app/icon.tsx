import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const size = { width: 64, height: 64 }
export const contentType = "image/png"

/** Favicon: monograma "a" en lima sobre canvas oscuro con esquina de marca. */
export default function Icon() {
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
          borderRadius: 14,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 14,
            border: "2px solid #1f2937",
          }}
        />
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: "#C6F24E",
            fontFamily: "sans-serif",
            lineHeight: 1,
            marginTop: -2,
          }}
        >
          a
        </div>
        <div
          style={{
            position: "absolute",
            right: 9,
            top: 11,
            width: 8,
            height: 8,
            borderRadius: 2,
            background: "#C6F24E",
          }}
        />
      </div>
    ),
    { ...size },
  )
}
