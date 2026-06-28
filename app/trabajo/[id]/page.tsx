import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/site/social-icons"
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
      <Header />
      <main className="px-7 pt-28 md:pt-32">
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
          <img src={p.coverImage} alt={p.title} className="mx-auto mt-10 w-full max-w-5xl rounded-2xl border border-border" />
        )}

        {p.content && (
          <div className="prose-axchi mx-auto mt-12 max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown>
          </div>
        )}

        {p.images?.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
            {p.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`${p.title} ${i + 1}`} className="w-full rounded-xl border border-border" />
            ))}
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
