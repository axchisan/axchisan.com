import { ArrowUpRight } from "lucide-react"
import { SpotlightCard } from "@/components/ui/spotlight-card"

type Project = {
  id: string
  title: string
  shortDesc: string | null
  description: string
  category: string | null
  technologies: string[]
  coverImage: string | null
}

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <SpotlightCard href={`/trabajo/${p.id}`}>
      <div
        className="relative flex h-40 items-end bg-cover bg-center p-4"
        style={{
          backgroundImage: p.coverImage
            ? `linear-gradient(to top, rgba(10,11,13,0.6), transparent), url(${p.coverImage})`
            : "linear-gradient(135deg, #1d2127, #14161a)",
        }}
      >
        {p.category && (
          <span className="absolute right-4 top-3.5 rounded-full border border-border bg-bg/70 px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
            {p.category}
          </span>
        )}
      </div>
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold">{p.title}</h3>
          <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-faint transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p.shortDesc || p.description}</p>
        {p.technologies.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {p.technologies.slice(0, 4).map((t) => (
              <span key={t} className="rounded-md border border-border px-2 py-[3px] font-mono text-[10px] text-muted">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </SpotlightCard>
  )
}
