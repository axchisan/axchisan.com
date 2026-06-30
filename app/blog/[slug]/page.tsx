import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ViewTracker } from "@/components/view-tracker"
import { getBlogPostBySlug } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { SITE_URL } from "@/lib/site"

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
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post || !post.published) notFound()

  return (
    <>
      <ViewTracker endpoint={`/api/blog/${post.slug}/view`} />
      <Header />
      <main id="contenido" tabIndex={-1} className="px-7 pt-28 md:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt ?? undefined,
              image: post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined,
              datePublished: new Date(post.publishedAt ?? post.createdAt).toISOString(),
              dateModified: new Date(post.updatedAt).toISOString(),
              author: { "@type": "Person", name: "Duvan Yair Arciniegas", url: SITE_URL },
              publisher: { "@type": "Organization", name: "Axchi Studio", url: SITE_URL },
              mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
              keywords: post.tags.join(", "),
            }),
          }}
        />
        <article className="mx-auto max-w-3xl">
          <Link href="/blog" className="mono-label inline-flex items-center gap-2 text-muted transition-colors hover:text-text">
            <ArrowLeft className="h-3.5 w-3.5" /> Blog
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {post.tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-5 font-display text-[clamp(30px,5vw,52px)] font-bold leading-[1.04] tracking-[-0.03em]">
            {post.title}
          </h1>

          <div className="mono-label mt-5 border-b border-border pb-7">
            {formatDate(post.publishedAt ?? post.createdAt)}
            {post.readTime ? ` · ${post.readTime} min de lectura` : ""}
            {post.views ? ` · ${post.views} vistas` : ""}
          </div>

          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" className="mt-8 w-full rounded-2xl border border-border" />
          )}

          <div className="prose-axchi mt-9">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <div className="mx-auto mt-16 max-w-3xl border-t border-border py-10">
          <Link href="/contacto" className="mono-label text-accent transition-colors hover:text-text">
            ¿Tienes un proyecto en mente? Hablemos →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
