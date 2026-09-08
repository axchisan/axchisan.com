import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Download } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { GithubIcon } from "@/components/site/social-icons"
import { ViewTracker } from "@/components/view-tracker"
import { getProjectById } from "@/lib/data"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) return { title: "Proyecto no encontrado" }
  return {
    title: project.title,
    description: project.shortDesc ?? project.description.slice(0, 160),
    alternates: { canonical: `/trabajo/${id}` },
    openGraph: {
      title: project.title,
      description: project.shortDesc ?? undefined,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  }
}

function formatoTamano(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default async function ProjectPage({ params }: Params) {
  const { id } = await params
  const p = await getProjectById(id)
  if (!p) notFound()

  const descargables = p.files.filter((f) => f.isDownloadable)

  return (
    <>
      <ViewTracker endpoint={`/api/projects/${p.id}/view`} />
      <Header />

      <main id="contenido" className="mx-auto max-w-5xl px-5 sm:px-8">
        <nav aria-label="Migas" className="pt-8">
          <Link href="/trabajo" className="text-[0.9375rem] text-graphite transition-colors hover:text-ink">
            Volver al trabajo
          </Link>
        </nav>

        <header className="enter pb-10 pt-8">
          <h1 className="max-w-[20ch]">{p.title}</h1>
          {p.shortDesc && (
            <p className="measure mt-4 text-[1.1875rem] leading-relaxed text-graphite">{p.shortDesc}</p>
          )}
        </header>

        <div className="grid gap-12 border-t border-line pt-10 lg:grid-cols-[1fr_16rem] lg:gap-16">
          <article className="min-w-0">
            {p.content ? (
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {p.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="prose">
                <p>{p.description}</p>
              </div>
            )}

            {descargables.length > 0 && (
              <section className="mt-14 border-t border-line pt-8">
                <h2 className="text-[1.1875rem] font-semibold tracking-[-0.015em]">Descargas</h2>
                <ul className="mt-4 space-y-2">
                  {descargables.map((f) => (
                    <li key={f.id}>
                      <a
                        href={f.url}
                        download
                        className="flex items-center gap-3 rounded-[8px] border border-line bg-raised px-4 py-3 transition-colors hover:border-line-firm"
                      >
                        <Download className="h-4 w-4 shrink-0 text-graphite" aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.9375rem] text-ink">
                            {f.displayName || f.originalName}
                          </span>
                          <span className="block text-[0.875rem] text-faint">
                            {f.platform ? `${f.platform} — ` : ""}
                            {formatoTamano(f.size)}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          {/* Raíl de ficha técnica. La estructura dice qué es cada cosa. */}
          <aside className="lg:border-l lg:border-line lg:pl-8">
            <dl className="space-y-6 text-[0.9375rem]">
              {p.category && (
                <div>
                  <dt className="text-faint">Tipo</dt>
                  <dd className="mt-0.5 text-ink">{p.category}</dd>
                </div>
              )}

              {p.technologies.length > 0 && (
                <div>
                  <dt className="text-faint">Stack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-[5px] border border-line bg-raised px-2 py-0.5 text-[0.875rem] text-graphite"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              {(p.githubUrl || p.liveUrl) && (
                <div>
                  <dt className="text-faint">Enlaces</dt>
                  <dd className="mt-1.5 space-y-1.5">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link flex items-center gap-2"
                      >
                        <GithubIcon className="h-4 w-4" />
                        Código
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer noopener" className="link block">
                        Verlo funcionando
                      </a>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  )
}
