import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Header } from "@/components/site/header"
import { Band, Body } from "@/components/site/band"
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

      <main id="contenido">
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

        <Band as="header">
          <div className="enter py-12 sm:py-16">
            <nav aria-label="Migas">
              <Link
                href="/blog"
                className="text-[0.9375rem] text-on-band-mid transition-colors hover:text-accent"
              >
                Volver a Ideas
              </Link>
            </nav>
            <h1 className="mt-6 max-w-[24ch] text-[2.125rem] leading-[1.1] sm:text-[2.75rem]">
              {post.title}
            </h1>
          <p className="mt-5 text-[0.9375rem] text-on-band-mid">
            <time dateTime={publicado.toISOString()}>{formatDate(publicado)}</time>
            {post.readTime ? <span className="ml-4">{post.readTime} min de lectura</span> : null}
          </p>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t}>
                  <Link
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    className="rounded-[5px] border border-band-line bg-band-2 px-2 py-0.5 text-[0.875rem] text-on-band-mid transition-colors hover:text-accent"
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          </div>
        </Band>

        <Body>
        <article>
          <div className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <section className="measure mt-16 border-t border-line pt-8">
          <p className="text-[1.0625rem] text-mid">
            ¿Preguntas sobre algo de esto?{" "}
            <Link href="/contacto" className="link">
              Escríbeme
            </Link>
            .
          </p>
        </section>
        </Body>
      </main>

      <Footer />
    </>
  )
}
