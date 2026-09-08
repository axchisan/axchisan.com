import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { getPublishedBlogSlugs, getPublicProjectRefs } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/servicios", "/trabajo", "/blog", "/sobre", "/contacto", "/privacidad"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/privacidad" ? 0.2 : 0.8,
  }))

  try {
    const [posts, projects] = await Promise.all([getPublishedBlogSlugs(), getPublicProjectRefs()])
    const blog = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
    const work = projects.map((p) => ({
      url: `${SITE_URL}/trabajo/${p.slug ?? p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
    return [...routes, ...work, ...blog]
  } catch {
    return routes
  }
}
