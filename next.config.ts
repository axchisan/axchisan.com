import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  // Prisma 7 (+ adapter pg) y bcryptjs no deben empaquetarse por el bundler RSC.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "bcryptjs"],
  images: {
    remotePatterns: [
      // Dominio definitivo del bucket R2, cuando el DNS apunte a Cloudflare.
      { protocol: "https", hostname: "media.axchisan.com", pathname: "/**" },
      // URL gestionada del bucket, en uso hasta el traslado del DNS.
      { protocol: "https", hostname: "pub-*.r2.dev", pathname: "/**" },
      { protocol: "https", hostname: "axchisan.com", pathname: "/**" },
      { protocol: "https", hostname: "github.com", pathname: "/**" },
    ],
  },
}

export default nextConfig
