import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

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
          background: "#14171c",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 600,
            color: "#fcfcfd",
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: -5,
          }}
        >
          da
        </div>
      </div>
    ),
    { ...size },
  )
}
