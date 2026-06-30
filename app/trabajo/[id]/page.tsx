import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Download } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/site/social-icons"
import { ViewTracker } from "@/components/view-tracker"
import { getProjectById } from "@/lib/data"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) return { title: "Caso no encontrado" }
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

export default async function ProjectPage({ params }: Params) {
  const { id } = await params
  const p = await getProjectById(id)
  if (!p) notFound()

  return (
    <>
      <ViewTracker endpoint={`/api/projects/${p.id}/view`} />
      <Header />
      <main id="contenido" tabIndex={-1} className="px-7 pt-28 md:pt-32">
        <div className="mx-auto max-w-4xl">
          <Link href="/trabajo" className="mono-label inline-flex items-center gap-2 text-muted transition-colors hover:text-text">
            <ArrowLeft className="h-3.5 w-3.5" /> Trabajo
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {p.category && (
              <span className="rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                {p.category}
              </span>
            )}
            <span className="mono-label">{p.status === "COMPLETED" ? "En producción" : p.status}</span>
          </div>

          <h1 className="mt-5 font-display text-[clamp(30px,5vw,54px)] font-bold leading-[1.04] tracking-[-0.03em]">
            {p.title}
          </h1>
          <p className="mt-5 max-w-[58ch] text-lg text-muted">{p.shortDesc || p.description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            {p.liveUrl && (
              <Button href={p.liveUrl} target="_blank" size="sm">
                Ver en vivo <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            {p.githubUrl && (
              <Button href={p.githubUrl} target="_blank" variant="outline" size="sm">
                <GithubIcon className="h-4 w-4" /> Código
              </Button>
            )}
          </div>

          {p.technologies.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-y border-border py-6">
              {p.technologies.map((t) => (
                <span key={t} className="rounded-md border border-border px-2.5 py-1 font-mono text-[11px] text-muted">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {p.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverImage} alt={p.title} loading="lazy" decoding="async" className="mx-auto mt-10 w-full max-w-5xl rounded-2xl border border-border" />
        )}

        {p.content && (
          <div className="prose-axchi mx-auto mt-12 max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{p.content}</ReactMarkdown>
          </div>
        )}

        {p.images?.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
            {p.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`${p.title} ${i + 1}`} loading="lazy" decoding="async" className="w-full rounded-xl border border-border" />
            ))}
          </div>
        )}

        {p.files?.filter((f) => f.isDownloadable).length > 0 && (
          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="mb-4 font-display text-xl font-semibold">Descargas</h2>
            <div className="flex flex-col gap-2.5">
              {p.files
                .filter((f) => f.isDownloadable)
                .map((f) => (
                  <a
                    key={f.id}
                    href={f.url}
                    download
                    className="group flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-accent/40 hover:bg-surface-2"
                  >
                    <Download className="h-5 w-5 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] text-text">{f.displayName ?? f.originalName}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                        {f.category}
                        {f.size ? ` · ${(f.size / 1024 / 1024).toFixed(1)} MB` : ""}
                      </p>
                    </div>
                    <span className="mono-label text-muted transition-colors group-hover:text-accent">Descargar</span>
                  </a>
                ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-16 max-w-3xl border-t border-border py-10 text-center">
          <p className="font-display text-2xl font-semibold">¿Quieres algo así para tu negocio?</p>
          <div className="mt-5 flex justify-center">
            <Button href="/contacto" size="lg">Hablemos →</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
