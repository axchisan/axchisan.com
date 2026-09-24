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


/**
 * Embudo de los últimos N días: visitas, demos abiertas, clics a WhatsApp y
 * cotizaciones, más las páginas que más visitas y contactos traen. Para el
 * panel; no se cachea.
 */
export async function getEmbudo(days = 30) {
  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  since.setUTCDate(since.getUTCDate() - (days - 1))
  const vacio = {
    pasos: { visita: 0, demo: 0, whatsapp: 0, cotizacion: 0 },
    serie: Array(days).fill(0) as number[],
    paginas: [] as { ruta: string; visitas: number; whatsapp: number }[],
    demos: [] as { demo: string; aperturas: number }[],
  }
  try {
    const [porEvento, eventos, cotizaciones, demos] = await Promise.all([
      prisma.siteAnalytics.groupBy({ by: ["evento"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
      prisma.siteAnalytics.findMany({
        where: { createdAt: { gte: since }, evento: { in: ["visita", "whatsapp"] } },
        select: { evento: true, path: true, createdAt: true },
      }),
      prisma.contactMessage.count({ where: { createdAt: { gte: since } } }),
      prisma.siteAnalytics.groupBy({
        by: ["detalle"],
        where: { createdAt: { gte: since }, evento: "demo" },
        _count: { _all: true },
      }),
    ])

    const pasos = { ...vacio.pasos }
    for (const e of porEvento) {
      if (e.evento in pasos) pasos[e.evento as keyof typeof pasos] = e._count._all
    }
    // Las cotizaciones se cuentan en la tabla de mensajes: es la fuente real.
    pasos.cotizacion = cotizaciones

    const serie = [...vacio.serie]
    const porRuta = new Map<string, { visitas: number; whatsapp: number }>()
    for (const e of eventos) {
      const fila = porRuta.get(e.path) ?? { visitas: 0, whatsapp: 0 }
      if (e.evento === "visita") {
        fila.visitas += 1
        const d = new Date(e.createdAt)
        d.setUTCHours(0, 0, 0, 0)
        const i = Math.floor((d.getTime() - since.getTime()) / 86_400_000)
        if (i >= 0 && i < days) serie[i] += 1
      } else {
        fila.whatsapp += 1
      }
      porRuta.set(e.path, fila)
    }

    const paginas = [...porRuta.entries()]
      .map(([ruta, v]) => ({ ruta, ...v }))
      .sort((a, b) => b.whatsapp - a.whatsapp || b.visitas - a.visitas)
      .slice(0, 8)

    return {
      pasos,
      serie,
      paginas,
      demos: demos
        .map((d) => ({ demo: d.detalle ?? "sin nombre", aperturas: d._count._all }))
        .sort((a, b) => b.aperturas - a.aperturas),
    }
  } catch (error) {
    console.error("getEmbudo error:", error)
    return vacio
  }
}
