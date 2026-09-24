import type { MetadataRoute } from "next"
import { SOLUCIONES } from "@/lib/catalogo/soluciones"
import { SITE_URL } from "@/lib/site"
import { getPublishedBlogSlugs } from "@/lib/data"

export const dynamic = "force-dynamic"

/**
 * Solo páginas que venden o informan. Las demos no entran: son negocios
 * ficticios y llevan noindex.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prioridad: Record<string, number> = { "": 1, "/soluciones": 0.9, "/planes": 0.9, "/privacidad": 0.2 }
  const fijas = ["", "/soluciones", "/planes", "/proceso", "/a-medida", "/empresa", "/cotizar", "/guias", "/privacidad"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: prioridad[path] ?? 0.7,
    }),
  )

  const fichas = SOLUCIONES.map((s) => ({
    url: `${SITE_URL}/soluciones/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }))

  try {
    const posts = await getPublishedBlogSlugs()
    const guias = posts.map((p) => ({
      url: `${SITE_URL}/guias/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
    return [...fijas, ...fichas, ...guias]
  } catch {
    return [...fijas, ...fichas]
  }
}
