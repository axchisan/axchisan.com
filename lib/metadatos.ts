import type { Metadata } from "next"
import { SOLUCIONES } from "@/lib/catalogo/soluciones"
import { SITE_NAME } from "@/lib/site"

/**
 * Metadatos completos de una página, tarjeta social incluida.
 *
 * En Next, `openGraph` y `twitter` no se mezclan entre segmentos: una página
 * que no los declara hereda los del layout raíz tal cual, con su título. Por
 * eso cada página que se comparte pasa por aquí, y el enlace muestra lo que
 * de verdad hay al abrirlo.
 */
export function metadatos(m: {
  titulo: string
  descripcion: string
  ruta: string
  /** Imagen de 1200×630 en `public/`. Por defecto, la tarjeta general. */
  imagen?: string
  alt?: string
}): Metadata {
  const imagen = m.imagen ?? "/og.png"
  const titulo = `${m.titulo} | ${SITE_NAME}`
  return {
    title: m.titulo,
    description: m.descripcion,
    alternates: { canonical: m.ruta },
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: SITE_NAME,
      url: m.ruta,
      title: titulo,
      description: m.descripcion,
      images: [{ url: imagen, width: 1200, height: 630, alt: m.alt ?? m.titulo }],
    },
    twitter: { card: "summary_large_image", title: titulo, description: m.descripcion, images: [imagen] },
  }
}

/** La tarjeta de cada ficha, generada por `npm run og`. */
export const imagenDeFicha = (slug: string) => `/og/${slug}.png`

/**
 * Tarjeta de una demo: se comparte tanto como la ficha, y debe decir que es
 * una demostración y de qué sector. Usa la imagen de su ficha.
 */
export function tarjetaDeDemo(ruta: string): Pick<Metadata, "openGraph" | "twitter"> {
  const s = SOLUCIONES.find((x) => x.muestra.tipo === "demo" && x.muestra.href === ruta)
  if (!s || s.muestra.tipo !== "demo") return {}
  const titulo = `Demo de ${s.muestra.nombre}: ${s.sector.toLowerCase()} | ${SITE_NAME}`
  const nota = s.muestra.nota.charAt(0).toLowerCase() + s.muestra.nota.slice(1)
  const descripcion = `Pruébala funcionando: ${nota} Negocio ficticio, hecho por Axchi.`
  const imagen = imagenDeFicha(s.slug)
  return {
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: SITE_NAME,
      url: ruta,
      title: titulo,
      description: descripcion,
      images: [{ url: imagen, width: 1200, height: 630, alt: `Demo de ${s.muestra.nombre}` }],
    },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: [imagen] },
  }
}
