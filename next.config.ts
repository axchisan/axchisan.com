import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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

  /**
   * La versión anterior del sitio usaba rutas en inglés y estuvo indexada. Sin
   * estas redirecciones, cada resultado de Google, enlace compartido o marcador
   * apuntando al sitio viejo devuelve un 404 y se pierde la autoridad ganada.
   *
   * Son permanentes (308, el equivalente de 301 que conserva el método) para
   * que los buscadores trasladen el posicionamiento a la ruta nueva.
   */
  async redirects() {
    return [
      { source: "/about", destination: "/sobre", permanent: true },
      { source: "/services", destination: "/servicios", permanent: true },
      { source: "/contact", destination: "/contacto", permanent: true },
      { source: "/projects", destination: "/trabajo", permanent: true },
      { source: "/projects/:id", destination: "/trabajo/:id", permanent: true },
      { source: "/privacy", destination: "/privacidad", permanent: true },

      // Rutas que ya no existen. Se mandan a la sección equivalente en lugar de
      // dejarlas morir en un 404.
      { source: "/terms", destination: "/privacidad", permanent: true },
      { source: "/saved", destination: "/trabajo", permanent: true },
      { source: "/messages", destination: "/contacto", permanent: true },
      { source: "/auth/signup", destination: "/auth/signin", permanent: true },
      { source: "/admin/analytics", destination: "/admin", permanent: true },
      { source: "/admin/comments", destination: "/admin", permanent: true },
    ]
  },
}

export default nextConfig
