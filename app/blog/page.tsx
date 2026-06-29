import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { PageHero } from "@/components/site/page-hero"
import { BlogCard } from "@/components/blog/blog-card"
import { Reveal } from "@/components/ui/reveal"
import { getBlogPosts } from "@/lib/data"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre desarrollo de software, automatización, IA y las decisiones técnicas detrás de productos digitales reales.",
  alternates: { canonical: "/blog" },
}

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const { posts, categories } = await getBlogPosts()

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          kicker="Insights · Notas del studio"
          title="Ideas, decisiones y aprendizajes"
          description="Escribimos sobre lo que construimos: desarrollo web, multiplataforma, automatización e IA — y el porqué de cada decisión técnica."
        />

        <section className="px-7 py-14">
          <div className="mx-auto max-w-6xl">
            {categories.length > 0 && (
              <Reveal>
                <div className="mb-10 flex flex-wrap gap-2">
                  <span className="rounded-full border border-accent bg-accent-soft px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                    Todo
                  </span>
                  {categories.slice(0, 8).map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            {posts.length === 0 ? (
              <p className="text-muted">Aún no hay artículos publicados.</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal key={post.slug} delay={(i % 3) * 0.06}>
                    <BlogCard post={post} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
