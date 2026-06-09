import "server-only"
import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

/**
 * Capa de acceso a datos para Server Components.
 * Usa Prisma directo (sin fetch a la propia API) + unstable_cache para
 * cachear resultados y reducir golpes a la base de datos (mejora TTFB).
 * Revalidación: 300s. Tags por entidad para invalidación futura desde el admin.
 */

const REVALIDATE = 300

export const getProjects = unstable_cache(
  async () => {
    try {
      return await prisma.project.findMany({
        where: { status: "COMPLETED" },
        include: {
          files: { orderBy: { order: "asc" } },
          _count: { select: { likes: true, comments: true, favorites: true } },
        },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      })
    } catch (error) {
      console.error("getProjects error:", error)
      return []
    }
  },
  ["projects-list"],
  { revalidate: REVALIDATE, tags: ["projects"] },
)

export const getProjectById = unstable_cache(
  async (id: string) => {
    try {
      return await prisma.project.findUnique({
        where: { id },
        include: {
          files: { orderBy: { order: "asc" } },
          _count: { select: { likes: true, comments: true, favorites: true } },
        },
      })
    } catch (error) {
      console.error("getProjectById error:", error)
      return null
    }
  },
  ["project-by-id"],
  { revalidate: REVALIDATE, tags: ["projects"] },
)

export const getBlogPosts = unstable_cache(
  async () => {
    try {
      const posts = await prisma.blogPost.findMany({
        where: { published: true },
        include: { _count: { select: { comments: true, likes: true } } },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      })
      const categories = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
      return { posts, categories }
    } catch (error) {
      console.error("getBlogPosts error:", error)
      return { posts: [], categories: [] as string[] }
    }
  },
  ["blog-list"],
  { revalidate: REVALIDATE, tags: ["blog"] },
)

export const getBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.blogPost.findUnique({
        where: { slug },
        include: { _count: { select: { comments: true, likes: true, favorites: true } } },
      })
    } catch (error) {
      console.error("getBlogPostBySlug error:", error)
      return null
    }
  },
  ["blog-by-slug"],
  { revalidate: REVALIDATE, tags: ["blog"] },
)

/** Slugs/ids para sitemap (ligero, sin relaciones). */
export const getPublishedBlogSlugs = unstable_cache(
  async () => prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ["blog-slugs"],
  { revalidate: REVALIDATE, tags: ["blog"] },
)

export const getPublicProjectIds = unstable_cache(
  async () => prisma.project.findMany({ where: { status: "COMPLETED" }, select: { id: true, updatedAt: true } }),
  ["project-ids"],
  { revalidate: REVALIDATE, tags: ["projects"] },
)
