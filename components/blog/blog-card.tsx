import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { formatDate } from "@/lib/utils"

type Post = {
  slug: string
  title: string
  excerpt: string | null
  tags: string[]
  readTime: number | null
  publishedAt: Date | null
  createdAt: Date
}

export function BlogCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-border-strong"
    >
      <div className="flex items-center gap-3">
        <span className="mono-label text-accent">{post.tags[0] ?? "Artículo"}</span>
        {featured && (
          <span className="rounded-md border border-accent/40 px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
            Destacado
          </span>
        )}
      </div>
      <h3 className={`mt-3 font-display font-semibold leading-snug ${featured ? "text-2xl" : "text-lg"}`}>
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{post.excerpt}</p>
      )}
      <div className="mt-5 flex items-center justify-between">
        <span className="mono-label">
          {formatDate(post.publishedAt ?? post.createdAt)}
          {post.readTime ? ` · ${post.readTime} min` : ""}
        </span>
        <ArrowUpRight className="h-4.5 w-4.5 text-accent transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  )
}
