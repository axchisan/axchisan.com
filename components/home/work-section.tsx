import Link from "next/link"
import { SectionHead } from "@/components/ui/section-head"
import { Reveal } from "@/components/ui/reveal"

type WorkItem = {
  id: string
  title: string
  shortDesc: string | null
  description: string
  category: string | null
  technologies: string[]
  coverImage: string | null
}

export function WorkSection({ projects }: { projects: WorkItem[] }) {
  if (projects.length === 0) return null

  return (
    <section className="px-7 py-12">
      <div className="mx-auto max-w-6xl">
        <SectionHead title="Trabajo seleccionado" href="/trabajo" hrefLabel="Ver todo" />

        <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <Link
                href={`/trabajo/${p.id}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-border-strong"
              >
                <div
                  className="relative flex h-32 items-end bg-cover bg-center p-3.5"
                  style={{
                    backgroundImage: p.coverImage
                      ? `linear-gradient(to top, rgba(10,11,13,0.55), transparent), url(${p.coverImage})`
                      : "linear-gradient(135deg, #1d2127, #14161a)",
                  }}
                >
                  {p.category && (
                    <span className="absolute right-3.5 top-3 rounded-full border border-border bg-bg/70 px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[17px] font-semibold">{p.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-[13.5px] text-muted">
                    {p.shortDesc || p.description}
                  </p>
                  {p.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border px-2 py-[3px] font-mono text-[10px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
