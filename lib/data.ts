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

/**
 * Busca por slug y, si no lo encuentra, por id.
 *
 * Las URLs son `/trabajo/tecnobichos`, pero los identificadores antiguos
 * siguieron circulando en el sitemap y en enlaces compartidos: mantenerlos
 * vivos cuesta una consulta y evita romperlos.
 */
export const getProjectBySlugOrId = unstable_cache(
  async (slugOrId: string) => {
    try {
      return await prisma.project.findFirst({
        where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
        include: {
          files: { orderBy: { order: "asc" } },
          _count: { select: { likes: true, comments: true, favorites: true } },
        },
      })
    } catch (error) {
      console.error("getProjectBySlugOrId error:", error)
      return null
    }
  },
  ["project-by-slug-or-id"],
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

/**
 * Cifras contadas contra la base. Ninguna se inventa.
 *
 * La versión anterior devolvía valores fabricados cuando la consulta fallaba
 * (25 proyectos, 15 clientes) y el sitio los mostraba como si fueran ciertos.
 * Un portafolio no puede publicar un número que no puede sostener: si la
 * consulta falla, se devuelve null y la interfaz omite el dato.
 */
export const getSiteMetrics = unstable_cache(
  async () => {
    try {
      const [projects, blog] = await Promise.all([
        prisma.project.findMany({ where: { status: "COMPLETED" }, select: { technologies: true } }),
        prisma.blogPost.findMany({ where: { published: true }, select: { tags: true } }),
      ])

      return {
        projectsCount: projects.length,
        technologiesCount: new Set(projects.flatMap((p) => p.technologies)).size,
        blogPostsCount: blog.length,
        categoriesCount: new Set(blog.flatMap((b) => b.tags)).size,
      }
    } catch (error) {
      console.error("getSiteMetrics error:", error)
      return null
    }
  },
  ["site-metrics"],
  { revalidate: REVALIDATE, tags: ["projects", "blog", "settings"] },
)

/** Slugs/ids para sitemap (ligero, sin relaciones). */
export const getPublishedBlogSlugs = unstable_cache(
  async () => prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ["blog-slugs"],
  { revalidate: REVALIDATE, tags: ["blog"] },
)

export const getPublicProjectRefs = unstable_cache(
  async () => prisma.project.findMany({ where: { status: "COMPLETED" }, select: { id: true, slug: true, updatedAt: true } }),
  ["project-ids"],
  { revalidate: REVALIDATE, tags: ["projects"] },
)

/** Servicios activos, ordenados. */
export const getServices = unstable_cache(
  async () => {
    try {
      return await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      })
    } catch (error) {
      console.error("getServices error:", error)
      return []
    }
  },
  ["services-list"],
  { revalidate: REVALIDATE, tags: ["services"] },
)

/** Perfil del founder (único registro). */
export const getProfile = unstable_cache(
  async () => {
    try {
      return await prisma.profile.findFirst()
    } catch (error) {
      console.error("getProfile error:", error)
      return null
    }
  },
  ["profile"],
  { revalidate: REVALIDATE, tags: ["profile"] },
)

/**
 * Serie de vistas por día (últimos N días) para sparklines del admin.
 * Rellena días sin datos con 0 para una serie continua. No cacheado (admin).
 */
export async function getViewsAnalytics(days = 30) {
  const empty = { projects: Array(days).fill(0) as number[], blog: Array(days).fill(0) as number[], totalProjects: 0, totalBlog: 0 }
  try {
    const since = new Date()
    since.setUTCHours(0, 0, 0, 0)
    since.setUTCDate(since.getUTCDate() - (days - 1))

    const [pv, bv] = await Promise.all([
      prisma.projectView.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.blogView.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    ])

    const bucket = (rows: { createdAt: Date }[]) => {
      const arr = Array(days).fill(0) as number[]
      for (const r of rows) {
        const d = new Date(r.createdAt)
        d.setUTCHours(0, 0, 0, 0)
        const idx = Math.floor((d.getTime() - since.getTime()) / 86400000)
        if (idx >= 0 && idx < days) arr[idx] += 1
      }
      return arr
    }

    return {
      projects: bucket(pv),
      blog: bucket(bv),
      totalProjects: pv.length,
      totalBlog: bv.length,
    }
  } catch (error) {
    console.error("getViewsAnalytics error:", error)
    return empty
  }
}

/** Skills agrupadas por categoría (para /sobre). */
export const getSkills = unstable_cache(
  async () => {
    try {
      return await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] })
    } catch (error) {
      console.error("getSkills error:", error)
      return []
    }
  },
  ["skills-list"],
  { revalidate: REVALIDATE, tags: ["skills"] },
)
