/**
 * Manifiesto de la app de Café del Barrio: se puede instalar en el celular
 * desde la demo, como la instalaría un cliente del negocio.
 */
export function GET() {
  return Response.json(
    {
      name: "Café del Barrio",
      short_name: "Café del Barrio",
      description: "Tus puntos, sellos y cupones de Café del Barrio (demostración de Axchi).",
      start_url: "/demo/cafe-del-barrio",
      scope: "/demo/cafe-del-barrio",
      display: "standalone",
      background_color: "#eef2ef",
      theme_color: "#1d3b2f",
      lang: "es-CO",
      icons: [
        { src: "/demos/cafe-del-barrio/icono-192.png", sizes: "192x192", type: "image/png" },
        { src: "/demos/cafe-del-barrio/icono-512.png", sizes: "512x512", type: "image/png" },
        { src: "/demos/cafe-del-barrio/icono-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=3600" } },
  )
}
