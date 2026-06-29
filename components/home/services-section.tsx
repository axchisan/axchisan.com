import Link from "next/link"
import type { Service } from "@prisma/client"
import { Globe, Smartphone, Workflow, Boxes, ArrowUpRight, type LucideIcon } from "lucide-react"
import { SectionHead } from "@/components/ui/section-head"
import { Reveal } from "@/components/ui/reveal"

const KIND = ["WEB", "MOBILE", "AUTOMATION", "CUSTOM", "PRODUCT", "DATA"]
const ICONS: LucideIcon[] = [Globe, Smartphone, Workflow, Boxes]

export function ServicesSection({ services }: { services: Service[] }) {
  if (services.length === 0) return null

  return (
    <section className="relative px-7 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead title="Qué hacemos" meta={`${String(services.length).padStart(2, "0")} servicios`} />

        <Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {services.map((s, i) => {
              const Icon = ICONS[i] ?? Boxes
              return (
                <Link
                  key={s.id}
                  href="/servicios"
                  className="group relative block bg-surface p-7 transition-colors hover:bg-surface-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg text-accent transition-colors group-hover:border-accent/40">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-faint transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>

                  <span className="mt-5 block font-mono text-[11px] tracking-[0.1em] text-accent">
                    {String(i + 1).padStart(2, "0")} — {KIND[i] ?? "STUDIO"}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.description}</p>
                  {s.features?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {s.features.slice(0, 4).map((f) => (
                        <li key={f} className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
