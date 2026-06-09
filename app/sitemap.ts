import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { getPublishedBlogSlugs, getPublicProjectIds } from "@/lib/data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ]

  try {
    const [posts, projects] = await Promise.all([getPublishedBlogSlugs(), getPublicProjectIds()])

    const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

    const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes, ...projectRoutes]
  } catch {
    // Si la BD no está disponible en build, devolver solo rutas estáticas
    return staticRoutes
  }
}
