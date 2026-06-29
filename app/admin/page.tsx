import Link from "next/link"
import { prisma } from "@/lib/prisma"

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

export default async function AdminDashboard() {
  const s = await getStats()
  const cards = [
    { label: "Proyectos", value: s.projects },
    { label: "Posts", value: s.posts },
    { label: "Servicios", value: s.services },
    { label: "Skills", value: s.skills },
    { label: "Mensajes", value: s.messages, href: "/admin/messages", badge: s.unread },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Resumen del contenido del sitio.</p>

      <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => {
          const inner = (
            <>
              <div className="font-display text-3xl font-semibold">{c.value}</div>
              <div className="mono-label mt-1">{c.label}</div>
              {c.badge ? (
                <span className="absolute right-4 top-4 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] text-accent-ink">
                  {c.badge} nuevos
                </span>
              ) : null}
            </>
          )
          const cls = "relative rounded-2xl border border-border bg-surface p-5"
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${cls} transition-colors hover:border-border-strong`}>
              {inner}
            </Link>
          ) : (
            <div key={c.label} className={cls}>
              {inner}
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-sm text-faint">
        La edición de proyectos, blog y media llega en el próximo incremento. Por ahora puedes
        gestionar mensajes, perfil y ajustes.
      </p>
    </div>
  )
}
