import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const size = { width: 64, height: 64 }
export const contentType = "image/png"

/** Favicon: monograma sobre grafito. Sin resplandores ni acentos ácidos. */
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
          background: "#14171c",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 600,
            color: "#fcfcfd",
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          da
        </div>
      </div>
    ),
    { ...size },
  )
}
