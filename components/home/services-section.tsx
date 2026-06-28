import Link from "next/link"
import type { Service } from "@prisma/client"
import { SectionHead } from "@/components/ui/section-head"
import { Reveal } from "@/components/ui/reveal"

const KIND = ["WEB", "MOBILE", "AUTOMATION", "CUSTOM", "PRODUCT", "DATA"]

export function ServicesSection({ services }: { services: Service[] }) {
  if (services.length === 0) return null

  return (
    <section className="px-7 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead title="Qué hacemos" meta={`${String(services.length).padStart(2, "0")} servicios`} />

        <Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {services.map((s, i) => (
              <Link
                key={s.id}
                href="/servicios"
                className="group block bg-surface p-7 transition-colors hover:bg-surface-2"
              >
                <span className="font-mono text-[11px] tracking-[0.1em] text-accent">
                  {String(i + 1).padStart(2, "0")} — {KIND[i] ?? "STUDIO"}
                </span>
                <h3 className="mt-3.5 font-display text-xl font-semibold tracking-[-0.01em]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.description}</p>
                {s.features?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.features.slice(0, 4).map((f) => (
                      <li
                        key={f}
                        className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
