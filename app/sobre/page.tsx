import type { Metadata } from "next"
import { Compass, Sparkles, MessageSquare } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { PageHero } from "@/components/site/page-hero"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"
import { getProfile, getSkills, getSiteMetrics } from "@/lib/data"

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Axchi es un studio de ingeniería de software en Bogotá fundado por Duvan Yair Arciniegas. Construimos productos digitales con criterio.",
  alternates: { canonical: "/sobre" },
}

export const dynamic = "force-dynamic"

const VALUES = [
  { t: "Criterio sobre moda", d: "Elegimos la tecnología adecuada para el problema, no la que está de moda.", icon: Compass },
  { t: "Calidad invisible", d: "Los detalles que nadie nota son los que hacen que un producto se sienta sólido.", icon: Sparkles },
  { t: "Comunicación directa", d: "Sin rodeos ni intermediarios: hablas con quien construye.", icon: MessageSquare },
]

export default async function SobrePage() {
  const [profile, skills, metrics] = await Promise.all([getProfile(), getSkills(), getSiteMetrics()])

  const byCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    ;(acc[s.category] ??= []).push(s)
    return acc
  }, {})

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          kicker="El studio"
          title="Software construido con criterio"
          description="Axchi es un studio de ingeniería de software en Bogotá. Diseñamos, construimos y automatizamos productos digitales para clientes reales — con foco en hacer cosas que de verdad funcionen."
        />

        {/* Valores — bento */}
        <section className="px-7 py-14">
          <div className="mx-auto max-w-6xl">
            {/* Manifiesto destacado */}
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 md:p-12">
                <div aria-hidden className="bg-dotted-accent mask-fade pointer-events-none absolute inset-0" />
                <div className="relative">
                  <span className="mono-label text-accent">Cómo pensamos</span>
                  <p className="mt-4 max-w-3xl font-display text-[clamp(22px,3.2vw,34px)] font-semibold leading-snug tracking-[-0.02em]">
                    Construimos software como si lo fuéramos a usar nosotros: con criterio,
                    cuidado y la convicción de que <span className="text-accent">los detalles importan</span>.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Valores */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {VALUES.map((v, i) => {
                const Icon = v.icon
                return (
                  <Reveal key={v.t} delay={i * 0.06}>
                    <div className="group h-full rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent/30">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg text-accent transition-colors group-hover:border-accent/40">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-5 font-display text-xl font-semibold">{v.t}</h3>
                      <p className="mt-2 text-[15px] text-muted">{v.d}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Founder (segundo plano) */}
        <section className="px-7 py-10">
          <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-surface p-8 md:p-10">
            <span className="mono-label text-accent">Detrás del studio</span>
            <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.6fr]">
              <div>
                <h2 className="font-display text-2xl font-semibold">{profile?.name?.split(" - ")[0] ?? "Duvan Yair Arciniegas"}</h2>
                <p className="mono-label mt-2">{profile?.title ?? "Fundador · Desarrollador de Software"}</p>
                <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
                  <div><div className="font-display text-2xl font-semibold">{metrics.projectsCount}</div><div className="mono-label mt-1">productos</div></div>
                  <div><div className="font-display text-2xl font-semibold">{metrics.yearsExperience}+</div><div className="mono-label mt-1">años</div></div>
                  <div><div className="font-display text-2xl font-semibold">{metrics.technologiesCount}+</div><div className="mono-label mt-1">tecnologías</div></div>
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-muted">
                {profile?.bio ??
                  "Desarrollador de software apasionado por construir soluciones con impacto real. Bajo la marca Axchi combina ingeniería, DevOps e IA para transformar ideas complejas en productos sólidos."}
              </p>
            </div>
          </div>
        </section>

        {/* Stack / capacidades */}
        {Object.keys(byCategory).length > 0 && (
          <section className="px-7 py-12">
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <h2 className="mb-8 border-b border-border pb-4 font-display text-[clamp(24px,3.2vw,34px)] font-semibold tracking-[-0.02em]">
                  Stack & capacidades
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(byCategory).map(([cat, items], i) => (
                  <Reveal key={cat} delay={(i % 3) * 0.06}>
                    <div className="h-full rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/30">
                      <span className="mono-label text-accent">{cat}</span>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {items.map((s) => (
                          <li key={s.id} className="rounded-md border border-border px-2.5 py-1 text-sm text-text">
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-7 pb-20 pt-6">
          <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-surface px-8 py-14 text-center">
            <h2 className="font-display text-[clamp(24px,3.6vw,38px)] font-bold tracking-[-0.02em]">
              Trabajemos juntos
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted">Cuéntanos tu idea. Respondemos personalmente.</p>
            <div className="mt-7 flex justify-center">
              <Button href="/contacto" size="lg">Hablemos →</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
