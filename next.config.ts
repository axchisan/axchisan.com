import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  // Prisma 7 (+ adapter pg) y bcryptjs no deben empaquetarse por el bundler RSC.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "bcryptjs"],
  // El type-check no debe bloquear el build de imagen (se valida aparte).
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.axchisan.com", pathname: "/**" },
      { protocol: "https", hostname: "axchisan.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "github.com", pathname: "/**" },
    ],
  },
}

export default nextConfig
