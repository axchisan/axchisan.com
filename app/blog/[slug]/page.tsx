import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ViewTracker } from "@/components/view-tracker"
import { getBlogPostBySlug } from "@/lib/data"
import { PROFILE, SITE_URL } from "@/lib/site"
import { formatDate, toDate } from "@/lib/utils"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: "Artículo no encontrado" }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: toDate(post.publishedAt ?? post.createdAt).toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post || !post.published) notFound()

  const publicado = toDate(post.publishedAt ?? post.createdAt)

  return (
    <>
      <ViewTracker endpoint={`/api/blog/${post.slug}/view`} />
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt ?? undefined,
              datePublished: publicado.toISOString(),
              dateModified: toDate(post.updatedAt).toISOString(),
              author: { "@type": "Person", name: PROFILE.name, url: SITE_URL },
              mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
            }),
          }}
        />

        <nav aria-label="Migas" className="pt-8">
          <Link href="/blog" className="text-[0.9375rem] text-graphite transition-colors hover:text-ink">
            Volver a escritos
          </Link>
        </nav>

        <header className="enter measure pb-10 pt-8">
          <h1>{post.title}</h1>
          <p className="mt-4 text-[0.9375rem] text-faint">
            <time dateTime={publicado.toISOString()}>{formatDate(publicado)}</time>
            {post.readTime ? <span className="ml-4">{post.readTime} min de lectura</span> : null}
          </p>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t}>
                  <Link
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    className="rounded-[5px] border border-line bg-raised px-2 py-0.5 text-[0.875rem] text-graphite transition-colors hover:text-ink"
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        <article className="border-t border-line pt-10">
          <div className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <section className="measure mt-16 border-t border-line pt-8">
          <p className="text-[1.0625rem] text-graphite">
            ¿Preguntas sobre algo de esto?{" "}
            <Link href="/contacto" className="link">
              Escríbeme
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}
