import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Prisma 7 (+ adapter pg) y bcryptjs no deben empaquetarse por el bundler RSC.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-neon", "bcryptjs"],
  images: {
    remotePatterns: [
      // Dominio definitivo del bucket R2, cuando el DNS apunte a Cloudflare.
      { protocol: "https", hostname: "media.axchisan.com", pathname: "/**" },
      // URL gestionada del bucket, en uso hasta el traslado del DNS.
      { protocol: "https", hostname: "pub-*.r2.dev", pathname: "/**" },
      { protocol: "https", hostname: "axchisan.com", pathname: "/**" },
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      // Fotografía de las demos. Licencias en docs/licencias.md.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
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
    // Cada ruta vieja apunta directo a su destino final: una cadena de
    // redirecciones pierde posicionamiento en cada salto.
    return [
      // Reestructuración comercial (septiembre de 2026).
      { source: "/servicios", destination: "/planes", permanent: true },
      { source: "/trabajo", destination: "/soluciones", permanent: true },
      { source: "/trabajo/:slug", destination: "/soluciones", permanent: true },
      { source: "/sobre", destination: "/empresa", permanent: true },
      { source: "/contacto", destination: "/cotizar", permanent: true },
      { source: "/blog", destination: "/guias", permanent: true },
      { source: "/blog/:slug", destination: "/guias/:slug", permanent: true },

      // Rutas en inglés del sitio anterior, que estuvo indexado.
      { source: "/about", destination: "/empresa", permanent: true },
      { source: "/services", destination: "/planes", permanent: true },
      { source: "/contact", destination: "/cotizar", permanent: true },
      { source: "/projects", destination: "/soluciones", permanent: true },
      { source: "/projects/:id", destination: "/soluciones", permanent: true },
      { source: "/privacy", destination: "/privacidad", permanent: true },

      // Rutas que ya no existen. Se mandan a la sección equivalente en lugar de
      // dejarlas morir en un 404.
      { source: "/terms", destination: "/privacidad", permanent: true },
      { source: "/saved", destination: "/soluciones", permanent: true },
      { source: "/messages", destination: "/cotizar", permanent: true },
      { source: "/auth/signup", destination: "/auth/signin", permanent: true },
      { source: "/admin/analytics", destination: "/admin", permanent: true },
      { source: "/admin/comments", destination: "/admin", permanent: true },
      { source: "/admin/settings", destination: "/admin", permanent: true },
    ]
  },
}

export default nextConfig
