import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SectionHead } from "@/components/ui/section-head"
import { Reveal } from "@/components/ui/reveal"
import { formatDate } from "@/lib/utils"

type Post = {
  slug: string
  title: string
  tags: string[]
  publishedAt: Date | null
  createdAt: Date
}

export function InsightsSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <section className="px-7 py-12">
      <div className="mx-auto max-w-6xl">
        <SectionHead title="Insights" href="/blog" hrefLabel="Todo el blog" />

        <Reveal>
          <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group grid grid-cols-[100px_1fr_auto] items-center gap-5 bg-surface px-6 py-5 transition-colors hover:bg-surface-2 max-sm:grid-cols-1 max-sm:gap-2"
              >
                <span className="mono-label">
                  {formatDate(p.publishedAt ?? p.createdAt)}
                </span>
                <h3 className="font-display text-lg font-medium leading-snug">{p.title}</h3>
                <ArrowUpRight className="h-5 w-5 text-accent transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 max-sm:hidden" />
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
