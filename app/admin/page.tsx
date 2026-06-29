import Link from "next/link"
import { FolderGit2, FileText, Cpu, Wrench, Mail, ArrowUpRight, Eye, type LucideIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getViewsAnalytics } from "@/lib/data"
import { Sparkline } from "@/components/admin/sparkline"

export const dynamic = "force-dynamic"

async function getStats() {
  try {
    const [projects, posts, services, skills, messages, unread] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.service.count(),
      prisma.skill.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ])
    return { projects, posts, services, skills, messages, unread }
  } catch {
    return { projects: 0, posts: 0, services: 0, skills: 0, messages: 0, unread: 0 }
  }
}

type Card = { label: string; value: number; href?: string; badge?: number; icon: LucideIcon }

export default async function AdminDashboard() {
  const [s, views] = await Promise.all([getStats(), getViewsAnalytics(30)])
  const cards: Card[] = [
    { label: "Proyectos", value: s.projects, href: "/admin/projects", icon: FolderGit2 },
    { label: "Posts", value: s.posts, href: "/admin/blog", icon: FileText },
    { label: "Skills", value: s.skills, href: "/admin/skills", icon: Cpu },
    { label: "Servicios", value: s.services, icon: Wrench },
    { label: "Mensajes", value: s.messages, href: "/admin/messages", badge: s.unread, icon: Mail },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Resumen del contenido del sitio.</p>

      {/* Analítica de vistas (últimos 30 días) */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { label: "Vistas de proyectos", total: views.totalProjects, series: views.projects },
          { label: "Vistas del blog", total: views.totalBlog, series: views.blog },
        ].map((v) => (
          <div key={v.label} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-faint">
                  <Eye className="h-4 w-4" strokeWidth={1.6} />
                  <span className="mono-label">{v.label}</span>
                </div>
                <div className="mt-2 font-display text-3xl font-semibold tabular-nums">{v.total}</div>
              </div>
              <span className="mono-label mt-1">30 días</span>
            </div>
            <div className="mt-3">
              <Sparkline data={v.series} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => {
          const Icon = c.icon
          const inner = (
            <>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-accent transition-colors group-hover:border-accent/40">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                {c.href && (
                  <ArrowUpRight className="h-4 w-4 text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                )}
              </div>
              <div className="mt-4 font-display text-3xl font-semibold tabular-nums">{c.value}</div>
              <div className="mono-label mt-1">{c.label}</div>
              {c.badge ? (
                <span className="absolute right-4 top-14 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] text-accent-ink">
                  {c.badge}
                </span>
              ) : null}
            </>
          )
          const cls = "group relative rounded-2xl border border-border bg-surface p-5"
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${cls} transition-colors hover:border-border-strong`}>
              {inner}
            </Link>
          ) : (
            <div key={c.label} className={cls}>{inner}</div>
          )
        })}
      </div>
    </div>
  )
}
