import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { getBlogPosts } from "@/lib/data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Escritos",
  description:
    "Notas sobre arquitectura, costos de infraestructura y las decisiones técnicas detrás de los sistemas que construyo.",
  alternates: { canonical: "/blog" },
}

export const dynamic = "force-dynamic"

const FECHA = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" })

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

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="enter py-14 sm:py-16">
          <h1>Escritos</h1>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-graphite">
            Cómo se decidieron las cosas y qué costó cada decisión.
          </p>
        </header>

        <section className="border-t border-line pt-10">
          {categories.length > 0 && (
            <nav aria-label="Filtrar por tema" className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/blog"
                aria-current={!tag ? "page" : undefined}
                className={cn(
                  "rounded-[6px] border px-2.5 py-1 text-[0.875rem] transition-colors",
                  !tag
                    ? "border-accent bg-accent-weak text-accent"
                    : "border-line text-graphite hover:text-ink",
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
                      ? "border-accent bg-accent-weak text-accent"
                      : "border-line text-graphite hover:text-ink",
                  )}
                >
                  {c}
                </Link>
              ))}
            </nav>
          )}

          {visibles.length === 0 ? (
            <p className="text-graphite">
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
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="measure mt-2 text-[1.0625rem] leading-relaxed text-graphite">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="mt-3 text-[0.875rem] text-faint">
                    <time dateTime={(post.publishedAt ?? post.createdAt).toISOString()}>
                      {FECHA.format(post.publishedAt ?? post.createdAt)}
                    </time>
                    {post.readTime ? <span className="ml-4">{post.readTime} min de lectura</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
