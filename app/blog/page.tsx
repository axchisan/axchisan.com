import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/site/header"
import { Body, PageBand } from "@/components/site/band"
import { Footer } from "@/components/site/footer"
import { getBlogPosts } from "@/lib/data"
import { cn, formatDate, toDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Escritos",
  description:
    "Notas sobre arquitectura, costos de infraestructura y las decisiones técnicas detrás de los sistemas que construyo.",
  alternates: { canonical: "/blog" },
}

export const dynamic = "force-dynamic"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const { posts, categories } = await getBlogPosts()

  // Antes estos filtros eran spans decorativos que no filtraban nada.
  const visibles = tag ? posts.filter((p) => p.tags.includes(tag)) : posts

  return (
    <>
      <Header />

      <main id="contenido">
        <PageBand
          titulo="Ideas"
          entradilla="Cómo se decidieron las cosas y qué costó cada decisión. Arquitectura, costos de infraestructura y automatización, con los números por delante."
        />

        <Body>
          {categories.length > 0 && (
            <nav aria-label="Filtrar por tema" className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/blog"
                aria-current={!tag ? "page" : undefined}
                className={cn(
                  "rounded-[6px] border px-2.5 py-1 text-[0.875rem] transition-colors",
                  !tag
                    ? "border-accent-ink bg-accent-weak text-accent-ink"
                    : "border-line bg-card text-mid hover:text-ink",
                )}
              >
                Todo
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/blog?tag=${encodeURIComponent(c)}`}
                  aria-current={tag === c ? "page" : undefined}
                  className={cn(
                    "rounded-[6px] border px-2.5 py-1 text-[0.875rem] transition-colors",
                    tag === c
                      ? "border-accent-ink bg-accent-weak text-accent-ink"
                      : "border-line bg-card text-mid hover:text-ink",
                  )}
                >
                  {c}
                </Link>
              ))}
            </nav>
          )}

          {visibles.length === 0 ? (
            <p className="text-mid">
              {tag ? (
                <>
                  No hay artículos sobre {tag}.{" "}
                  <Link href="/blog" className="link">
                    Ver todos
                  </Link>
                </>
              ) : (
                "Todavía no hay artículos publicados."
              )}
            </p>
          ) : (
            <ul>
              {visibles.map((post) => (
                <li key={post.slug} className="border-t border-line py-7 first:border-t-0 first:pt-0">
                  <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em]">
                    <Link href={`/blog/${post.slug}`} className="text-ink transition-colors hover:text-accent-ink">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="measure mt-2 text-[1.0625rem] leading-relaxed text-mid">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="mt-3 text-[0.875rem] text-faint">
                    <time dateTime={toDate(post.publishedAt ?? post.createdAt).toISOString()}>
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </time>
                    {post.readTime ? <span className="ml-4">{post.readTime} min de lectura</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Body>
      </main>

      <Footer />
    </>
  )
}
