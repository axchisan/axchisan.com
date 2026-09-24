import Link from "next/link"
import { FolderGit2, FileText, Cpu, Mail, ArrowUpRight, Eye, type LucideIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getEmbudo } from "@/lib/data"
import { Sparkline } from "@/components/admin/sparkline"

export const dynamic = "force-dynamic"

async function getStats() {
  try {
    const [projects, posts, skills, messages, nuevas] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.skill.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "PENDING" } }),
    ])
    return { projects, posts, skills, messages, nuevas }
  } catch {
    return { projects: 0, posts: 0, skills: 0, messages: 0, nuevas: 0 }
  }
}

const PASOS = [
  { id: "visita", label: "Visitas" },
  { id: "demo", label: "Demos abiertas" },
  { id: "whatsapp", label: "Clics a WhatsApp" },
  { id: "cotizacion", label: "Cotizaciones" },
] as const

type Card = { label: string; value: number; href?: string; badge?: number; icon: LucideIcon }

export default async function AdminDashboard() {
  const [s, embudo] = await Promise.all([getStats(), getEmbudo(30)])
  const cards: Card[] = [
    { label: "Mensajes", value: s.messages, href: "/admin/messages", badge: s.nuevas, icon: Mail },
    { label: "Guías publicadas", value: s.posts, href: "/admin/blog", icon: FileText },
    { label: "Proyectos (no se muestran en el sitio)", value: s.projects, href: "/admin/projects", icon: FolderGit2 },
    { label: "Herramientas", value: s.skills, href: "/admin/skills", icon: Cpu },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">Dashboard</h1>
      <p className="mt-1 text-sm text-mid">Cómo llegan los clientes en los últimos 30 días.</p>

      {/* Embudo: cada paso con su número; la conversión respecto al anterior. */}
      <section aria-labelledby="embudo" className="mt-7 rounded-[12px] border border-line bg-card p-5">
        <h2 id="embudo" className="text-[1rem] font-semibold">Embudo</h2>
        <ol className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PASOS.map((p, i) => {
            const valor = embudo.pasos[p.id]
            const anterior = i > 0 ? embudo.pasos[PASOS[i - 1].id] : 0
            return (
              <li key={p.id} className="rounded-[10px] bg-paper p-4">
                <p className="text-[0.875rem] text-faint">{p.label}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">{valor}</p>
                {i > 0 && anterior > 0 && (
                  <p className="mt-1 text-[0.8125rem] text-mid">{Math.round((valor / anterior) * 100)} % del paso anterior</p>
                )}
              </li>
            )
          })}
        </ol>
        <div className="mt-5">
          <p className="flex items-center gap-2 text-[0.875rem] text-faint">
            <Eye className="h-4 w-4" strokeWidth={1.6} aria-hidden /> Visitas por día
          </p>
          <div className="mt-2">
            <Sparkline data={embudo.serie} />
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="paginas" className="rounded-[12px] border border-line bg-card p-5">
          <h2 id="paginas" className="text-[1rem] font-semibold">Páginas que traen contactos</h2>
          {embudo.paginas.length === 0 ? (
            <p className="mt-3 text-sm text-mid">Todavía no hay datos. Aparecen con las primeras visitas.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <thead className="text-left text-faint">
                <tr>
                  <th className="pb-2 font-normal">Página</th>
                  <th className="pb-2 text-right font-normal">Visitas</th>
                  <th className="pb-2 text-right font-normal">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {embudo.paginas.map((p) => (
                  <tr key={p.ruta}>
                    <td className="py-2 pr-3 break-all">{p.ruta}</td>
                    <td className="py-2 text-right tabular-nums">{p.visitas}</td>
                    <td className="py-2 text-right tabular-nums">{p.whatsapp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section aria-labelledby="demos" className="rounded-[12px] border border-line bg-card p-5">
          <h2 id="demos" className="text-[1rem] font-semibold">Demos abiertas</h2>
          {embudo.demos.length === 0 ? (
            <p className="mt-3 text-sm text-mid">Nadie ha abierto una demo en estos días.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line text-sm">
              {embudo.demos.map((d) => (
                <li key={d.demo} className="flex justify-between py-2">
                  <span>{d.demo}</span>
                  <span className="tabular-nums">{d.aperturas}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Link
              key={c.label}
              href={c.href!}
              className="group relative rounded-[12px] border border-line bg-card p-5 transition-colors hover:border-line-firm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-line bg-paper text-accent-ink transition-colors group-hover:border-accent-ink/40">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink" />
              </div>
              <div className="mt-4 text-3xl font-semibold tabular-nums">{c.value}</div>
              <div className="mt-1 text-[0.875rem] text-faint">{c.label}</div>
              {c.badge ? (
                <span className="absolute top-14 right-4 rounded-full bg-accent px-2 py-0.5 text-[0.75rem] font-semibold text-on-accent">
                  {c.badge} nuevas
                </span>
              ) : null}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
