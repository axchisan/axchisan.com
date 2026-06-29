import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

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
          borderRadius: 7,
        }}
      >
        <div style={{ width: 16, height: 16, borderRadius: 4, background: "#C6F24E" }} />
      </div>
    ),
    { ...size },
  )
}
