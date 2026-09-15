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
          background: "#0b0f14",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 32 32">
          <path d="M5.5 27 12.4 5h7.2L26.5 27" stroke="#0ea5a5" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M10.2 20.2h11.6" stroke="#0ea5a5" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
